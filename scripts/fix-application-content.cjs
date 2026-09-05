const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'lib', 'archiePages.json');
if (!fs.existsSync(file)) process.exit(0);

const pages = JSON.parse(fs.readFileSync(file, 'utf8'));
let home = pages.index?.content || '';

// The preceding project already ends with a divider, so Blue should not add a second one.
home = home.replace(
  '{divisor}\n\n{imagem}\n  nome: blue/tela02.png',
  '{imagem}\n  nome: blue/tela02.png'
);

// ImageBlock infers a -m filename on mobile when nome_mobile is absent. Blue has no tela02-m.png,
// so explicitly reuse the existing lightweight image on mobile instead of requesting a missing asset.
home = home.replace(
  '{imagem}\n  nome: blue/tela02.png\n  tamanho: M',
  '{imagem}\n  nome: blue/tela02.png\n  nome_mobile: blue/tela02.png\n  tamanho: M'
);

if (pages.index) pages.index.content = home;
fs.writeFileSync(file, `${JSON.stringify(pages, null, 2)}\n`, 'utf8');
console.log('Fixed Blue mobile image and duplicate divider');
