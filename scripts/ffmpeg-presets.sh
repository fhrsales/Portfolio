#!/usr/bin/env bash

# ffmpeg presets for smooth scrolly scrubbing
# - CFR 30 or 60 fps
# - GOP equal to FPS (keyframe every frame duration)
# - No B-frames (bf=0)
# - yuv420p for broad compatibility
# - +faststart to move moov atom to the beginning (better seeks)
# - Remove audio (-an) for safer seeking

set -euo pipefail

if [[ "$#" -lt 2 ]]; then
  echo "Usage: $0 <input> <output> [fps=30] [crf=18]" >&2
  echo "Example desktop: $0 input.mov output-desktop.mp4 30 18" >&2
  echo "Example mobile (scale to 720p high): ffmpeg -i input.mov -vf 'scale=-2:720:flags=lanczos' -c:v libx264 -pix_fmt yuv420p -r 30 -g 30 -keyint_min 1 -sc_threshold 0 -bf 0 -profile:v high -level 4.1 -crf 20 -preset slow -movflags +faststart -an output-mobile.mp4" >&2
  exit 1
fi

IN="$1"
OUT="$2"
FPS="${3:-30}"
CRF="${4:-18}"

ffmpeg -y -i "$IN" \
  -c:v libx264 -pix_fmt yuv420p \
  -r "$FPS" -g "$FPS" -keyint_min 1 -sc_threshold 0 -bf 0 \
  -profile:v high -level 4.1 \
  -crf "$CRF" -preset slow \
  -movflags +faststart -an \
  "$OUT"

echo "Wrote $OUT (FPS=$FPS, CRF=$CRF)."

