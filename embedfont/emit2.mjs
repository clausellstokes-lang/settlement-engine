import { readFileSync, writeFileSync } from 'node:fs';
const T='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const { jsPDF } = await import(T+'/node_modules/jspdf/dist/jspdf.node.js');
const { sanitizeJsPdfText: s } = await import(T+'/src/utils/jsPdfText.js');
const NAMES=['Babić','Đorđević','Kovačević','Uroš','Snežana','Čupić','Khān','Ilić','Hadžić','Nikolić','Marković','Lazić','Grbić','Filipović','Cvjetković','Nataša','Uglješa','Jovanović'];
const LOREM='The fortified keep — its ledgers… don’t balance. €5 †';
function build({mode, faces, pages}) {
  const d=new jsPDF({unit:'mm',format:'a4',compress:true});
  if(faces) for(const [file,alias,style] of faces){ const nm=file.split('/').pop();
    d.addFileToVFS(nm, readFileSync(file).toString('base64')); d.addFont(nm, alias, style); }
  const fam = faces?'BookFace':'helvetica';
  const xf = mode==='today' ? s : (x=>x);
  for(let p=0;p<pages;p++){ if(p) d.addPage(); let y=20;
    for(const st of ['normal','bold','italic']){ d.setFont(fam,st); d.setFontSize(10);
      for(const n of NAMES) d.text(xf(n+' — '+LOREM), 15, y), y+=5; y+=4; } }
  return Buffer.from(d.output('arraybuffer'));
}
const FD=T+'/public/fonts', SS=process.cwd()+'/subsets';
const full=[[FD+'/Lora-Regular.ttf','BookFace','normal'],[FD+'/Lora-Bold.ttf','BookFace','bold'],[FD+'/Lora-Italic.ttf','BookFace','italic']];
const sub =[[SS+'/Lora-Regular.A.ttf','BookFace','normal'],[SS+'/Lora-Bold.A.ttf','BookFace','bold'],[SS+'/Lora-Italic.A.ttf','BookFace','italic']];
console.log('pages, TODAY(helvetica+sanitiser), EMBED-full-TTF, EMBED-subset-TTF, delta-full, delta-subset');
for(const pages of [1,4,8,16,24,40]){
  const a=build({mode:'today',faces:null,pages}).length;
  const b=build({mode:'raw',faces:full,pages}).length;
  const c=build({mode:'raw',faces:sub,pages}).length;
  console.log(`${pages}, ${a}, ${b}, ${c}, +${b-a}, +${c-a}`);
  if(pages===8){writeFileSync('today-8p.pdf',build({mode:'today',faces:null,pages}));}
}
// prove the TODAY path really erases the names (negative control)
console.log('\nNEGATIVE CONTROL — what the shipped sanitiser does to the names today:');
for(const n of ['Babić','Đorđević','Kovačević','Uroš','Snežana','Čupić','Khān','Hadžić'])
  console.log(`  ${n.padEnd(12)} -> ${JSON.stringify(s(n))}`);
