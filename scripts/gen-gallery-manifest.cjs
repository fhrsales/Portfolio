#!/usr/bin/env node
/*
  Generate manifest.json files listing images/PDFs for one or more directories under static/.

  Usage:
    node scripts/gen-gallery-manifest.cjs imgs/galeria1 imgs/galeria2

  If no args are provided, defaults to static/imgs.
*/
const fsp = require('node:fs/promises');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function isMedia(name) {
  return /(\.jpe?g|\.png|\.webp|\.avif|\.svg|\.pdf)$/i.test(name);
}

function parseSipsOutput(out) {
  const w = out.match(/pixelWidth:\s*(\d+)/i);
  const h = out.match(/pixelHeight:\s*(\d+)/i);
  return {
    width: w ? Number(w[1]) : 0,
    height: h ? Number(h[1]) : 0
  };
}

function getSizeWithSips(file) {
  try {
    const out = execFileSync('sips', ['-g', 'pixelWidth', '-g', 'pixelHeight', file], {
      encoding: 'utf8'
    });
    return parseSipsOutput(out);
  } catch {
    return { width: 0, height: 0 };
  }
}

async function getSize(file, sharp) {
  if (sharp) {
    try {
      const meta = await sharp(file).metadata();
      return { width: meta.width || 0, height: meta.height || 0 };
    } catch {
      return { width: 0, height: 0 };
    }
  }
  return getSizeWithSips(file);
}

async function genForDir(rel) {
  const srcDir = path.resolve('static', rel);
  try {
    const st = await fsp.stat(srcDir);
    if (!st.isDirectory()) {
      console.error('[manifest] not a directory:', srcDir);
      return;
    }
  } catch (e) {
    console.error('[manifest] directory not found:', srcDir);
    return;
  }
  let sharp = null;
  try {
    sharp = require('sharp');
  } catch {
    sharp = null;
  }
  const entries = await fsp.readdir(srcDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && isMedia(e.name)).map((e) => e.name).sort();
  const detailed = [];
  for (const name of files) {
    const ext = path.extname(name).toLowerCase();
    if (ext === '.pdf') {
      detailed.push({ name });
      continue;
    }
    const filePath = path.join(srcDir, name);
    const size = await getSize(filePath, sharp);
    if (size.width && size.height) detailed.push({ name, width: size.width, height: size.height });
    else detailed.push({ name });
  }
  const out = { files: detailed };
  const outFile = path.join(srcDir, 'manifest.json');
  await fsp.writeFile(outFile, JSON.stringify(out, null, '\t'));
  console.log('[manifest] wrote', outFile, `(${files.length} files)`);
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    await genForDir('imgs');
    return;
  }
  for (const p of args) {
    const rel = String(p).replace(/^\/*/, '');
    await genForDir(rel);
  }
}

main().catch((e) => {
  console.error('[manifest] error:', e);
  process.exit(1);
});
