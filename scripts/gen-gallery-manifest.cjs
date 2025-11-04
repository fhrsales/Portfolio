#!/usr/bin/env node
/*
  Generate manifest.json files listing images/PDFs for one or more directories under static/.

  Usage:
    node scripts/gen-gallery-manifest.cjs imgs/galeria1 imgs/galeria2

  If no args are provided, defaults to static/imgs.
*/
const fsp = require('node:fs/promises');
const path = require('node:path');

function isMedia(name) {
  return /(\.jpe?g|\.png|\.webp|\.avif|\.svg|\.pdf)$/i.test(name);
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
  const entries = await fsp.readdir(srcDir, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile() && isMedia(e.name)).map((e) => e.name).sort();
  const out = { files };
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

