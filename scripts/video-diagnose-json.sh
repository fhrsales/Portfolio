#!/usr/bin/env bash
set -euo pipefail

if ! command -v ffprobe >/dev/null 2>&1; then
  echo "ffprobe not found. Install ffmpeg (e.g., brew install ffmpeg)" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "node not found. Please install Node.js to run this script." >&2
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <video-file> [output-json]" >&2
  exit 1
fi

IN="$1"
if [[ ! -f "$IN" ]]; then
  echo "Input not found: $IN" >&2; exit 1
fi

OUT=""
if [[ $# -ge 2 ]]; then
  OUT="$2"
else
  base="$(basename "$IN")"
  dir="$(dirname "$IN")"
  OUT="${dir}/${base}.diagnose.json"
fi

tmpd="$(mktemp -d)"
streams_json="$tmpd/streams.json"
format_json="$tmpd/format.json"
keyframes_txt="$tmpd/keyframes.txt"

# Collect stream info
ffprobe -v error -select_streams v:0 -show_entries \
  stream=codec_name,codec_long_name,profile,level,pix_fmt,avg_frame_rate,r_frame_rate,nb_frames,bit_rate,width,height,has_b_frames \
  -of json "$IN" > "$streams_json"

# Collect format info
ffprobe -v error -show_entries format=format_name,duration,bit_rate,size \
  -of json "$IN" > "$format_json"

# Collect keyframe timestamps (I-frames)
ffprobe -v error -select_streams v:0 -skip_frame nokey -show_entries frame=pkt_pts_time \
  -of csv=p=0 "$IN" > "$keyframes_txt" || true

node - << 'NODE' "$IN" "$streams_json" "$format_json" "$keyframes_txt" "$OUT"
const fs = require('fs');
const path = require('path');
const [,, inPath, streamsPath, formatPath, kfPath, outPath] = process.argv;

function readJSON(p){ try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } }
function readKeyframes(p){
  try {
    const s = fs.readFileSync(p,'utf8').trim();
    if (!s) return [];
    return s.split(/\n+/).map(x=>parseFloat(x.trim())).filter(Number.isFinite);
  } catch { return []; }
}
const streams = readJSON(streamsPath) || {};
const format = readJSON(formatPath) || {};
const kf = readKeyframes(kfPath);
let diffs = [];
for (let i=1;i<kf.length;i++){ const d = kf[i]-kf[i-1]; if (d>0 && Number.isFinite(d)) diffs.push(d); }

function median(arr){ if(!arr.length) return null; const a=[...arr].sort((a,b)=>a-b); const m=Math.floor(a.length/2); return a.length%2?a[m]:(a[m-1]+a[m])/2; }
const stats = {
  count: diffs.length || 0,
  avg_sec: diffs.length ? diffs.reduce((a,b)=>a+b,0)/diffs.length : null,
  med_sec: diffs.length ? median(diffs) : null,
  min_sec: diffs.length ? Math.min(...diffs) : null,
  max_sec: diffs.length ? Math.max(...diffs) : null
};

// Heuristics
const v = ((streams.streams||[])[0]) || {};
const ar = v.avg_frame_rate || '';
const rr = v.r_frame_rate || '';
function fpsFromFR(fr){
  const m = String(fr).match(/^(\d+)(?:\/(\d+))?$/); if(!m) return null;
  const num = parseFloat(m[1]||'0'); const den = parseFloat(m[2]||'1'); if(!den) return null; return num/den;
}
const avg_fps = fpsFromFR(ar);
const raw_fps = fpsFromFR(rr);
const nb = (typeof v.nb_frames === 'string' ? parseInt(v.nb_frames,10) : v.nb_frames) || null;
const dur = format.format && format.format.duration ? parseFloat(format.format.duration) : null;
let cfrLikely = null;
if (avg_fps && raw_fps && Math.abs(avg_fps - raw_fps) < 0.02) cfrLikely = true; else if (avg_fps && raw_fps) cfrLikely = false;
let fpsSuggested = avg_fps ? Math.round(avg_fps) : (raw_fps ? Math.round(raw_fps) : null);
if (fpsSuggested && (fpsSuggested<24 || fpsSuggested>120)) fpsSuggested = null;

// GOP suggestion: closer to one keyframe per frame-duration; if med_sec known, target_gop ≈ fps*med_sec
let gopMed = null; if (stats.med_sec && fpsSuggested) gopMed = Math.round(fpsSuggested * stats.med_sec);

const recommendations = [
  'Use constant framerate (CFR), e.g., 30 or 60 fps',
  'Set GOP length equal to fps: -g <fps> -keyint_min 1 -sc_threshold 0',
  'Disable B-frames: -bf 0',
  'H.264 High profile, yuv420p, +faststart',
  'Remove audio if not needed (-an)'
];

const out = {
  input: path.resolve(inPath),
  streams,
  format,
  keyframes: stats,
  analysis: {
    cfr_likely: cfrLikely,
    avg_fps: avg_fps || null,
    r_frame_rate_fps: raw_fps || null,
    fps_suggested: fpsSuggested || null,
    gop_med_estimate: gopMed
  },
  recommendations
};

fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log('Wrote', outPath);
NODE

rm -rf "$tmpd"

