// Copia o static/archiePages.json para src/lib/archiePages.json antes do build
const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'static', 'archiePages.json');
const destDir = path.join(__dirname, 'src', 'lib');
const dest = path.join(destDir, 'archiePages.json');

if (!fs.existsSync(src)) {
    console.error('static/archiePages.json não encontrado!');
    process.exit(1);
}

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

fs.copyFileSync(src, dest);
console.log('Copiado static/archiePages.json para src/lib/archiePages.json');
