#!/usr/bin/env node
/*
  Convert first page of PDFs to PNGs next to the original files.

  Usage:
    node scripts/pdf2png.cjs static/imgs/samples [more/paths]

  Tries available tools in order: magick/convert (ImageMagick), gm convert, pdftoppm, sips (macOS), qlmanage (macOS Quick Look).
*/
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const fsp = require('node:fs/promises');
const path = require('node:path');

function hasBin(bin) {
  try {
    execFileSync('which', [bin], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function listPdfs(dir) {
  const out = [];
  const ents = await fsp.readdir(dir, { withFileTypes: true });
  for (const ent of ents) {
    if (ent.isFile() && /\.pdf$/i.test(ent.name)) out.push(path.join(dir, ent.name));
  }
  return out;
}

function convertWithImageMagick(inFile, outFile) {
  const magick = hasBin('magick') ? 'magick' : hasBin('convert') ? 'convert' : null;
  if (!magick) return false;
  const input = /magick$/.test(magick) ? `${inFile}[0]` : `${inFile}[0]`;
  const args = ['-density', '160', input, '-quality', '92', '-background', 'white', '-alpha', 'remove', '-alpha', 'off', outFile];
  try { execFileSync(magick, args, { stdio: 'inherit' }); return true; } catch { return false; }
}

function convertWithGm(inFile, outFile) {
  if (!hasBin('gm')) return false;
  try {
    execFileSync('gm', ['convert', '-density', '160', `${inFile}[0]`, '-quality', '92', outFile], { stdio: 'inherit' });
    return true;
  } catch { return false; }
}

function convertWithPoppler(inFile, outFile) {
  if (!hasBin('pdftoppm')) return false;
  const base = outFile.replace(/\.png$/i, '');
  try {
    execFileSync('pdftoppm', ['-png', '-f', '1', '-l', '1', inFile, base], { stdio: 'inherit' });
    return true;
  } catch { return false; }
}

function convertWithSips(inFile, outFile) {
  if (!hasBin('sips')) return false;
  try { execFileSync('sips', ['-s', 'format', 'png', inFile, '--out', outFile], { stdio: 'inherit' }); return true; } catch { return false; }
}

function convertWithQL(inFile, outFile) {
  if (!hasBin('qlmanage')) return false;
  const outDir = path.dirname(outFile);
  try {
    execFileSync('qlmanage', ['-t', '-s', '1600', '-o', outDir, inFile], { stdio: 'inherit' });
    const produced = path.join(outDir, path.basename(inFile) + '.png');
    if (fs.existsSync(produced)) {
      fs.renameSync(produced, outFile);
      return true;
    }
    return false;
  } catch { return false; }
}

const BORDER_PX = Number(process.env.PAGE_BORDER || 48);
const MAX_SIDE = Number(process.env.MAX_SIDE || 1600); // max width/height

function addBorderWithMagick(outFile) {
  const magick = hasBin('magick') ? 'magick' : hasBin('convert') ? 'convert' : null;
  if (!magick) return false;
  const tmp = outFile.replace(/\.png$/i, `.tmp_${Date.now()}.png`);
  try {
    execFileSync(magick, [outFile, '-background', 'white', '-alpha', 'remove', '-alpha', 'off', '-bordercolor', 'white', '-border', `${BORDER_PX}x${BORDER_PX}`, tmp], { stdio: 'inherit' });
    fs.renameSync(tmp, outFile);
    return true;
  } catch {
    try { fs.existsSync(tmp) && fs.unlinkSync(tmp); } catch {}
    return false;
  }
}

function addBorderWithGm(outFile) {
  if (!hasBin('gm')) return false;
  const tmp = outFile.replace(/\.png$/i, `.tmp_${Date.now()}.png`);
  try {
    execFileSync('gm', ['convert', outFile, '-bordercolor', 'white', '-border', `${BORDER_PX}x${BORDER_PX}`, tmp], { stdio: 'inherit' });
    fs.renameSync(tmp, outFile);
    return true;
  } catch {
    try { fs.existsSync(tmp) && fs.unlinkSync(tmp); } catch {}
    return false;
  }
}

function ensureBorder(outFile) {
  return addBorderWithMagick(outFile) || addBorderWithGm(outFile);
}

function hasPngquant() { return hasBin('pngquant'); }

function optimizeWithMagick(outFile) {
  const magick = hasBin('magick') ? 'magick' : hasBin('convert') ? 'convert' : null;
  if (!magick) return false;
  const tmp = outFile.replace(/\.png$/i, `.opt_${Date.now()}.png`);
  try {
    // Resize down if larger than MAX_SIDE, strip metadata, reduce palette, and use strong compression for PNG
    const args = [outFile, '-strip', '-resize', `${MAX_SIDE}x${MAX_SIDE}>`, '-colors', '256', '-define', 'png:compression-level=9', '-define', 'png:compression-filter=5', tmp];
    execFileSync(magick, args, { stdio: 'inherit' });
    // Replace original only if produced file exists (and smaller)
    const fs = require('node:fs');
    if (fs.existsSync(tmp)) {
      try {
        const a = fs.statSync(outFile).size;
        const b = fs.statSync(tmp).size;
        if (b <= a) fs.renameSync(tmp, outFile); else fs.unlinkSync(tmp);
      } catch { fs.renameSync(tmp, outFile); }
    }
    return true;
  } catch {
    try { const fs = require('node:fs'); fs.existsSync(tmp) && fs.unlinkSync(tmp); } catch {}
    return false;
  }
}

function optimizeWithSips(outFile) {
  if (!hasBin('sips')) return false;
  try {
    // Resize longest side to MAX_SIDE while preserving aspect ratio
    execFileSync('sips', ['-Z', String(MAX_SIDE), outFile], { stdio: 'inherit' });
    return true;
  } catch { return false; }
}

function optimizeWithPngquant(outFile) {
  if (!hasPngquant()) return false;
  try {
    execFileSync('pngquant', ['--force', '--ext', '.png', '--quality=65-85', outFile], { stdio: 'inherit' });
    return true;
  } catch { return false; }
}

function optimizePng(outFile) {
  // Prefer lossless-ish downscale + palette reduce; then try pngquant for further size cuts
  const ok = optimizeWithMagick(outFile) || optimizeWithSips(outFile);
  // Run pngquant if available to shave extra KBs (can be lossy)
  optimizeWithPngquant(outFile);
  return ok;
}

async function convertDir(dir) {
  const pdfs = await listPdfs(dir);
  let ok = 0; let fail = 0;
  for (const pdf of pdfs) {
    const out = pdf.replace(/\.pdf$/i, '.png');
    const reprocess = process.env.REPROCESS === '1';
    if (fs.existsSync(out)) {
      console.log('exists:', path.basename(out));
      if (reprocess) { ensureBorder(out); }
      continue;
    }
    console.log('convert:', path.basename(pdf));
    const done = (convertWithImageMagick(pdf, out) || convertWithGm(pdf, out) || convertWithPoppler(pdf, out) || convertWithSips(pdf, out) || convertWithQL(pdf, out)) && ensureBorder(out) && optimizePng(out);
    if (done) ok++; else { fail++; console.warn('failed to convert:', pdf); }
  }
  return { ok, fail };
}

async function main() {
  const args = process.argv.slice(2);
  const dirs = args.length ? args : ['static/imgs/samples'];
  let totalOk = 0, totalFail = 0;
  for (const d of dirs) {
    const dir = path.resolve(d);
    if (!fs.existsSync(dir)) { console.error('not found:', dir); continue; }
    const { ok, fail } = await convertDir(dir);
    totalOk += ok; totalFail += fail;
  }
  console.log('done. ok:', totalOk, 'fail:', totalFail);
}

main().catch((e) => { console.error(e); process.exit(1); });
