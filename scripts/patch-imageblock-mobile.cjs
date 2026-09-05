const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'lib', 'components', 'image', 'ImageBlock.svelte');
if (!fs.existsSync(file)) process.exit(0);

let src = fs.readFileSync(file, 'utf8');
const oldBlock = "\tfunction getResponsiveSrcSync() {\n\t\tif (typeof window !== 'undefined') {\n\t\t\tconst mobile = window.matchMedia('(max-width: 600px)').matches;\n\t\t\tisMobile = mobile;\n\t\t\tif (mobile && src) {\n\t\t\t\tconst dotIndex = src.lastIndexOf('.');\n\t\t\t\tif (dotIndex !== -1) {\n\t\t\t\t\treturn `${src.slice(0, dotIndex)}-m${src.slice(dotIndex)}`;\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn src;\n\t}";

const newBlock = "\tfunction getResponsiveSrcSync() {\n\t\tif (typeof window !== 'undefined') {\n\t\t\tconst mobile = window.matchMedia('(max-width: 600px)').matches;\n\t\t\tisMobile = mobile;\n\t\t\tif (mobile) {\n\t\t\t\tif (nome_mobile) return nome_mobile;\n\t\t\t\tif (src) {\n\t\t\t\t\tconst dotIndex = src.lastIndexOf('.');\n\t\t\t\t\tif (dotIndex !== -1) {\n\t\t\t\t\t\treturn `${src.slice(0, dotIndex)}-m${src.slice(dotIndex)}`;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t\treturn src;\n\t}";

if (!src.includes(oldBlock)) {
  console.error('ImageBlock responsive source block not found');
  process.exit(1);
}
src = src.replace(oldBlock, newBlock);
fs.writeFileSync(file, src, 'utf8');
console.log('Patched ImageBlock to honor nome_mobile');
