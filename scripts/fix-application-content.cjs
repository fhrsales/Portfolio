const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'lib', 'archiePages.json');
if (!fs.existsSync(file)) process.exit(0);

const pages = JSON.parse(fs.readFileSync(file, 'utf8'));
let home = pages.index?.content || '';

// If a previous build script inserted raw HTML for Blue, restore the native image directive.
home = home.replace(
  /<div class='blue-home-preview'[\s\S]*?<\/div>/,
  `{imagem}\n  nome: blue/tela02.png\n  nome_mobile: blue/tela02.png\n  tamanho: M\n  classes: shadow-1\n  tags: Product Design, UX/UI, Interaction Design\n{}`
);

// Ensure the Blue image directive always has an explicit mobile source.
home = home.replace(
  /\{imagem\}\s*\n\s*nome:\s*blue\/tela02\.png\s*\n(?:\s*nome_mobile:.*\n)?\s*tamanho:\s*M/,
  `{imagem}\n  nome: blue/tela02.png\n  nome_mobile: blue/tela02.png\n  tamanho: M`
);

// Collapse repeated divider sequences globally, then ensure exactly one divider before Blue.
home = home.replace(/(?:\{divisor\}\s*){2,}/g, '{divisor}\n\n');
home = home.replace(
  /(?:\{divisor\}\s*)?(?=\{imagem\}\s*\n\s*nome:\s*blue\/tela02\.png)/,
  '{divisor}\n\n'
);

// Hard fallback for ImageBlock's legacy mobile behavior: guarantee that the inferred
// "-m" asset physically exists in the static folder. This avoids any runtime 404 on
// mobile even if a component path bypasses nome_mobile for any reason.
const blueDir = path.join(__dirname, '..', 'static', 'imgs', 'blue');
const blueDesktop = path.join(blueDir, 'tela02.png');
const blueMobile = path.join(blueDir, 'tela02-m.png');
if (fs.existsSync(blueDesktop)) {
  fs.copyFileSync(blueDesktop, blueMobile);
  console.log('Created Blue mobile fallback asset: tela02-m.png');
} else {
  console.error('Blue source asset missing:', blueDesktop);
  process.exit(1);
}

if (pages.index) pages.index.content = home;
fs.writeFileSync(file, `${JSON.stringify(pages, null, 2)}\n`, 'utf8');
console.log('Restored Blue native image preview with explicit mobile source');
