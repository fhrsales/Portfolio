const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'src', 'lib', 'components', 'ArchieRenderer.svelte');
if (!fs.existsSync(file)) process.exit(1);
let s = fs.readFileSync(file, 'utf8');

if (!s.includes("import TapuiScrolly from '$lib/components/TapuiScrolly.svelte';")) {
  s = s.replace(
    "import ScrollerVideo from '$lib/components/ScrollerVideo.svelte';",
    "import ScrollerVideo from '$lib/components/ScrollerVideo.svelte';\n\timport TapuiScrolly from '$lib/components/TapuiScrolly.svelte';"
  );
}

const anchor = "{:else if blocoStr.match(/^<divisor\\s*\\/?>$/i) || blocoStr.match(/^<divisor\\s*>\\s*<\\/divisor>$/i) || blocoStr.match(/^\\{divisor\\}$/i)}\n\t\t\t\t\t<Divider />";
const replacement = `${anchor}\n\t\t\t\t{:else if blocoStr.match(/^\\{tapuiScrolly\\}$/i)}\n\t\t\t\t\t<TapuiScrolly />`;

if (!s.includes('blocoStr.match(/^\\{tapuiScrolly\\}$/i)')) {
  if (!s.includes(anchor)) {
    console.error('ArchieRenderer insertion anchor not found');
    process.exit(1);
  }
  s = s.replace(anchor, replacement);
}

fs.writeFileSync(file, s, 'utf8');
console.log('Patched ArchieRenderer for Tapuiassauro scrollytelling');
