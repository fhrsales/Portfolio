const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'assets', 'tapui-scrolly.mp4.b64');
const outDir = path.join(__dirname, '..', 'static', 'videos');
const out = path.join(outDir, 'tapui-scrolly.mp4');

if (!fs.existsSync(src)) {
  console.error('Missing Tapuiassauro video source:', src);
  process.exit(1);
}

fs.mkdirSync(outDir, { recursive: true });
const b64 = fs.readFileSync(src, 'utf8').replace(/\s+/g, '');
fs.writeFileSync(out, Buffer.from(b64, 'base64'));
console.log('Decoded Tapuiassauro scrollytelling video:', out);
