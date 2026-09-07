const fs=require('fs');const path=require('path');
const file=path.join(__dirname,'..','src','lib','archiePages.json');
if(!fs.existsSync(file))process.exit(1);
const pages=JSON.parse(fs.readFileSync(file,'utf8'));
if(!pages.archive||!pages.archive.content)process.exit(1);
let c=pages.archive.content;
const marker="{imagem}\n  nome: tapuiassauro.png";
const scrolly=`h3: Tapuiassauro — From evidence to understanding\n\nThe reconstruction was not illustration added after the reporting. It was a way of turning fragments, measurements, and scientific inference into something readers could understand.\n\n{scrollerVideo}\n  video: tapui-scrolly.mp4\n  video-mobile: tapui-scrolly.mp4\n  video-desktop: tapui-scrolly.mp4\n  tamanho: GG\n  altura: 360vh\n  guia: false\n  fit: cover\n  vignette: true\n  tags: Information Design, Art Direction, Scrollytelling, Interaction Design\n  {.passo}\n    posicao: 0.14\n    texto: <strong>A few fragments are evidence.<br>Not an image.</strong>\n    classe: headline\n  {}\n  {.passo}\n    posicao: 0.48\n    texto: <strong>Design connects what science knows<br>with what people can understand.</strong>\n    classe: headline\n  {}\n  {.passo}\n    posicao: 0.82\n    texto: <strong>The reconstruction becomes<br>a hypothesis you can see.</strong>\n    classe: headline\n  {}\n{}\n\n`;
if(!c.includes('video: tapui-scrolly.mp4')){
 if(!c.includes(marker)){console.error('Tapuiassauro marker not found');process.exit(1);}
 c=c.replace(marker,scrolly+marker);
}
pages.archive.content=c;
fs.writeFileSync(file,JSON.stringify(pages,null,2)+'\n','utf8');
console.log('Added Tapuiassauro scrollytelling');
