#!/usr/bin/env bash
set -euo pipefail

if ! command -v ffprobe >/dev/null 2>&1; then
  echo "ffprobe not found. Install ffmpeg (e.g., brew install ffmpeg)" >&2
  exit 1
fi

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <video-file>" >&2
  exit 1
fi

IN="$1"

echo "== Streams (basic) =="
ffprobe -v error -select_streams v:0 -show_entries \
  stream=codec_name,codec_long_name,profile,level,pix_fmt,avg_frame_rate,r_frame_rate,nb_frames,bit_rate,width,height,has_b_frames \
  -of json "$IN"

echo
echo "== Format / duration / size =="
ffprobe -v error -show_entries format=format_name,duration,bit_rate,size \
  -of json "$IN"

echo
echo "== Keyframe distances (GOP estimate) =="
# Extract I-frame timestamps and compute average/median spacing
TMP=$(mktemp)
ffprobe -v error -select_streams v:0 -skip_frame nokey -show_entries frame=pkt_pts_time \
  -of csv=p=0 "$IN" > "$TMP" || true
if [[ -s "$TMP" ]]; then
  python3 - "$TMP" << 'PY' 2>/dev/null || awk -v f="$TMP" '
  BEGIN{prev="";n=0;sum=0;min=1e9;max=0}
  {if(prev!=""){d=$1-prev; sum+=d; n++; if(d<min)min=d; if(d>max)max=d} prev=$1}
  END{ if(n>0){printf("avg_sec=%.4f min_sec=%.4f max_sec=%.4f count=%d\n", sum/n, min, max, n);} else {print "no keyframe data"} }
'
import sys,statistics
import math
with open(sys.argv[1]) as f:
    ts=[float(x.strip()) for x in f if x.strip()]
if len(ts)<2:
    print("no keyframe data")
    sys.exit(0)
diffs=[ts[i]-ts[i-1] for i in range(1,len(ts)) if ts[i]>ts[i-1]]
avg=sum(diffs)/len(diffs)
med=statistics.median(diffs)
print(f"avg_sec={avg:.4f} med_sec={med:.4f} count={len(diffs)}")
PY
else
  echo "no keyframe data"
fi

rm -f "$TMP"

echo
echo "== Suggested targets for smooth scrubbing =="
echo "- Constant framerate (CFR): 30 or 60 fps"
echo "- GOP length ~= fps (keyframe every 1 frame-duration): -g <fps> -keyint_min 1 -sc_threshold 0"
echo "- No B-frames: -bf 0"
echo "- H.264 High profile, yuv420p, +faststart"
echo "- Remove audio if not needed (-an)"

