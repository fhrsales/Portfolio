const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'lib', 'archiePages.json');
if (!fs.existsSync(file)) process.exit(0);

const pages = JSON.parse(fs.readFileSync(file, 'utf8'));
let home = pages.index?.content || '';

// The source content already contains the divider that precedes the next block.
// Blue used to add another divider of its own, producing two horizontal rules.
// Collapse any repeated divider sequence immediately before the Blue preview to exactly one.
home = home.replace(
  /(?:\{divisor\}\s*){2,}(?=\{imagem\}\s*nome:\s*blue\/tela02\.png)/g,
  '{divisor}\n\n'
);

// ImageBlock automatically invents a "-m" filename on mobile even when the asset does not exist.
// For this homepage preview, bypass ImageBlock entirely and render the known existing asset directly.
// This guarantees the same lightweight PNG is used on desktop and mobile.
home = home.replace(
  /\{imagem\}\s*\n\s*nome:\s*blue\/tela02\.png\s*\n(?:\s*nome_mobile:.*\n)?\s*tamanho:\s*M\s*\n\s*classes:\s*shadow-1\s*\n\s*tags:\s*Product Design, UX\/UI, Interaction Design\s*\n\{\}/,
  `<div class='blue-home-preview' style='max-width:640px;width:calc(100% - (var(--grid) * 4));margin:3em auto 1rem auto;'>\n<img src='imgs/blue/tela02.png' alt='Blue touch-interface prototype' loading='lazy' decoding='async' style='display:block;width:100%;height:auto;box-shadow:0 8px 24px rgba(0,0,0,.18);' />\n</div>`
);

// Defensive cleanup in case spacing differs in the generated content: never allow two consecutive dividers.
home = home.replace(/\{divisor\}\s*\{divisor\}/g, '{divisor}');

if (pages.index) pages.index.content = home;
fs.writeFileSync(file, `${JSON.stringify(pages, null, 2)}\n`, 'utf8');
console.log('Fixed Blue preview asset and duplicate divider');
