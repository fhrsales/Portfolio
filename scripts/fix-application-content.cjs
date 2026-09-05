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

if (pages.index) pages.index.content = home;
fs.writeFileSync(file, `${JSON.stringify(pages, null, 2)}\n`, 'utf8');
console.log('Restored Blue native image preview with explicit mobile source');
