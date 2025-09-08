/*
  Generate WebP and AVIF versions for images under static/imgs.
  - Converts .jpg/.jpeg/.png → .webp and .avif (quality ~70)
  - Skips if the target file already exists
*/

const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

async function main() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch (e) {
    console.error('optimize-images: sharp not installed');
    process.exit(1);
  }

  const root = path.resolve('static', 'imgs');
  const entries = await fsp.readdir(root, { withFileTypes: true });
  const tasks = [];

  for (const ent of entries) {
    if (!ent.isFile()) continue;
    const file = path.join(root, ent.name);
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;
    const base = file.slice(0, -ext.length);
    const webp = `${base}.webp`;
    const avif = `${base}.avif`;

    if (!fs.existsSync(webp)) {
      tasks.push(
        sharp(file)
          .webp({ quality: 72 })
          .toFile(webp)
          .then(() => console.log('webp:', path.basename(webp)))
      );
    }
    if (!fs.existsSync(avif)) {
      tasks.push(
        sharp(file)
          .avif({ quality: 50 })
          .toFile(avif)
          .then(() => console.log('avif:', path.basename(avif)))
      );
    }
  }

  await Promise.allSettled(tasks);
  console.log('optimize-images: done');
}

main().catch((err) => {
  console.error('optimize-images: error', err);
  process.exit(1);
});

