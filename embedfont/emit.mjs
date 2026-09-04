// READ-ONLY EXPERIMENT. Emits sample PDFs into THIS scratch dir only.
import { readFileSync, writeFileSync } from 'node:fs';
const T='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const { jsPDF } = await import(T+'/node_modules/jspdf/dist/jspdf.node.js');
const NAMES=['Babić','Đorđević','Kovačević','Uroš','Snežana','Čupić','Khān','Ilić','Hadžić','Nikolić','Marković','Lazić','Grbić','Filipović','Cvjetković','Nataša','Uglješa','Jovanović'];
const LOREM='The fortified keep — its ledgers… don’t balance. €5 †';

function build({embed, faces, lines}) {
  const d = new jsPDF({ unit:'mm', format:'a4', compress:true });
  if (embed) {
    for (const [file, alias, style] of faces) {
      const bin = readFileSync(file).toString('binary');
      d.addFileToVFS(file.split('/').pop(), Buffer.from(bin,'binary').toString('base64'));
      d.addFont(file.split('/').pop(), alias, style);
    }
  }
  for (let p=0;p<lines;p++){
    if(p) d.addPage();
    let y=20;
    for (const st of ['normal','bold','italic']) {
      d.setFont(embed?'BookFace':'helvetica', st); d.setFontSize(10);
      for (const n of NAMES) { d.text(n+' — '+LOREM, 15, y); y+=5; }
      y+=4;
    }
  }
  return Buffer.from(d.output('arraybuffer'));
}
const FD=T+'/public/fonts';
const SS='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/embedfont/subsets';
const full=[[FD+'/Lora-Regular.ttf','BookFace','normal'],[FD+'/Lora-Bold.ttf','BookFace','bold'],[FD+'/Lora-Italic.ttf','BookFace','italic']];
const sub =[[SS+'/Lora-Regular.A.ttf','BookFace','normal'],[SS+'/Lora-Bold.A.ttf','BookFace','bold'],[SS+'/Lora-Italic.A.ttf','BookFace','italic']];
for (const pages of [1,8,24]) {
  const base=build({embed:false,lines:pages});
  let e1=null,e2=null,err1=null,err2=null;
  try{ e1=build({embed:true,faces:full,lines:pages}); }catch(x){ err1=x.message; }
  try{ e2=build({embed:true,faces:sub, lines:pages}); }catch(x){ err2=x.message; }
  console.log(`pages=${pages}  helvetica=${base.length}  embed-FULL-TTF=${e1?e1.length:'ERR:'+err1}  embed-SUBSET-TTF=${e2?e2.length:'ERR:'+err2}`);
  if(pages===8&&e1) writeFileSync('sample-embed-full.pdf', e1);
  if(pages===8&&e2) writeFileSync('sample-embed-subset.pdf', e2);
  if(pages===8) writeFileSync('sample-helvetica.pdf', base);
}
