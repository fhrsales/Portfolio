#!/usr/bin/env bash
set -euo pipefail

if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "ffmpeg not found. Install ffmpeg (e.g., brew install ffmpeg)" >&2
  exit 1
fi

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <input> <output> [fps=60] [crf=20] [max_height]" >&2
  echo "Examples:" >&2
  echo "  $0 in.mp4 out-60fps.mp4 60 20" >&2
  echo "  $0 in.mp4 out-30fps.mp4 30 18 1080  # clamp height to 1080p" >&2
  exit 1
fi

IN="$1"
OUT="$2"
FPS="${3:-60}"
CRF="${4:-20}"
MAXH="${5:-}"  # optional

VF=""
if [[ -n "${MAXH}" ]]; then
  VF="-vf scale=-2:${MAXH}:flags=lanczos"
fi

echo "Re-encoding $IN -> $OUT (FPS=$FPS, CRF=$CRF, MAXH=${MAXH:-none})"
set -x
ffmpeg -y -i "$IN" \
  $VF \
  -c:v libx264 -pix_fmt yuv420p \
  -r "$FPS" -g "$FPS" -keyint_min 1 -sc_threshold 0 -bf 0 \
  -profile:v high -movflags +faststart \
  -crf "$CRF" -preset slow \
  -an \
  "$OUT"
set +x
echo "Done: $OUT"

