# Scripts

Quick reference for utility scripts in `scripts/`.

## gen-gallery-manifest.cjs
- Purpose: create `manifest.json` files listing images/PDFs (and sizes when possible) for one or more directories under `static/`.
- Uses: `sharp` if installed, otherwise macOS `sips` for image dimensions.
- Usage:
  ```bash
  node scripts/gen-gallery-manifest.cjs imgs/galeria1 imgs/galeria2
  ```
  If no args: scans `static/imgs` and writes `static/imgs/manifest.json`.

## gen-modern-images.cjs
- Purpose: generate `.avif` and `.webp` variants for specific images under `static/`.
- Requires: `sharp`.
- Usage:
  ```bash
  node scripts/gen-modern-images.cjs imgs/atbl-app.png imgs/atbl-app-m.png
  ```
  Skips files that already have the target formats.

## gen-image-meta.cjs
- Purpose: create `src/lib/imageMeta.json` with width/height/ratio + format availability for `static/imgs/*`.
- Uses: `sharp` if installed, otherwise macOS `sips`.
- Usage:
  ```bash
  node scripts/gen-image-meta.cjs
  ```

## optimize-images.cjs
- Purpose: batch-generate `.webp` and `.avif` versions for all `.jpg/.jpeg/.png` in `static/imgs/`.
- Requires: `sharp`.
- Usage:
  ```bash
  node scripts/optimize-images.cjs
  ```

## pdf2png.cjs
- Purpose: convert the first page of PDFs to PNGs (next to the original file).
- Tries tools in order: ImageMagick (`magick`/`convert`), GraphicsMagick (`gm`), Poppler (`pdftoppm`), macOS `sips`, macOS `qlmanage`.
- Environment:
  - `PAGE_BORDER` (px, default 48)
  - `MAX_SIDE` (px, default 1600)
  - `REPROCESS=1` to re-add border on existing PNGs
- Usage:
  ```bash
  node scripts/pdf2png.cjs static/imgs/samples [more/paths]
  ```
  If no args: defaults to `static/imgs/samples`.

## ffmpeg-presets.sh
- Purpose: encode videos for smooth scroll-scrubbing (CFR, short GOP, no B-frames, faststart).
- Requires: `ffmpeg`.
- Usage:
  ```bash
  scripts/ffmpeg-presets.sh input.mov output.mp4 [fps=30] [crf=18]
  ```

## video-reencode.sh
- Purpose: re-encode a video with CFR + scrub-friendly GOP settings, optional height clamp.
- Requires: `ffmpeg`.
- Usage:
  ```bash
  scripts/video-reencode.sh input.mp4 output.mp4 [fps=60] [crf=20] [max_height]
  ```

## video-diagnose-json.sh
- Purpose: analyze a video with `ffprobe`, extract stream/format/keyframe stats, and write a JSON report with recommendations.
- Requires: `ffprobe` (ffmpeg) + `node`.
- Usage:
  ```bash
  scripts/video-diagnose-json.sh path/to/video.mp4 [output.json]
  ```
  If output is omitted, writes `<video>.diagnose.json` next to the file.
