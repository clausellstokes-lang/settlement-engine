import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const T='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/58f0a8e2-2c4f-4073-8635-ecc7cf5010f6/scratchpad/laneKERNELMARK-tree';
const src=readFileSync(join(T,'src/domain/content/customContentCharset.generated.js'),'utf8');
const ranges=/"dossier-pdf":\s*\{\s*"ranges":\s*"([^"]*)"/.exec(src)[1];
const dec=new Set();
for(const tok of ranges.split(' ').filter(Boolean)){
  const [a,b]=tok.split('-'); const lo=parseInt(a,16), hi=b?parseInt(b,16):lo;
  for(let c=lo;c<=hi;c++) dec.add(c);
}
console.log('manifest dossier-pdf decoded size =', dec.size);
// re-read cmaps (reuse the parser inline by import of cmap.mjs is not exported; duplicate minimal)
function u16(b,o){return b.readUInt16BE(o);} function u32(b,o){return b.readUInt32BE(o);} function i16(b,o){return b.readInt16BE(o);}
function tables(buf){const n=u16(buf,4);const t={};for(let i=0;i<n;i++){const o=12+i*16;t[buf.toString('ascii',o,o+4)]={off:u32(buf,o+8)};}return t;}
function cps(buf){const t=tables(buf);const base=t.cmap.off;const n=u16(buf,base+2);let best=null,bs=-1;
 for(let i=0;i<n;i++){const o=base+4+i*8,pid=u16(buf,o),eid=u16(buf,o+2),off=u32(buf,o+4);
  const s=pid===3&&eid===10?4:pid===3&&eid===1?3:pid===0?2:0; if(s>bs){bs=s;best=base+off;}}
 const set=new Set(); const fmt=u16(buf,best);
 if(fmt!==4) throw new Error('fmt '+fmt);
 const segX2=u16(buf,best+6),seg=segX2/2,endO=best+14,startO=endO+segX2+2,deltaO=startO+segX2,rangeO=deltaO+segX2;
 for(let s=0;s<seg;s++){const end=u16(buf,endO+s*2),start=u16(buf,startO+s*2),delta=i16(buf,deltaO+s*2),ro=u16(buf,rangeO+s*2);
  if(start===0xFFFF)continue;
  for(let c=start;c<=end&&c!==0x10000;c++){let g; if(ro===0)g=(c+delta)&0xFFFF; else{const gi=rangeO+s*2+ro+(c-start)*2; if(gi+1>=buf.length)continue; g=u16(buf,gi); if(g!==0)g=(g+delta)&0xFFFF;} if(g!==0)set.add(c);}}
 return set;}
const FD=join(T,'public/fonts');
const files=readdirSync(FD).filter(f=>f.endsWith('.ttf')).sort();
const sets=Object.fromEntries(files.map(f=>[f,cps(readFileSync(join(FD,f)))]));
let inter=null; for(const f of files){const s=sets[f]; inter=inter===null?new Set(s):new Set([...inter].filter(c=>s.has(c)));}
console.log('measured 8-face intersection =', inter.size);
const onlyManifest=[...dec].filter(c=>!inter.has(c)).sort((a,b)=>a-b);
const onlyMeasured=[...inter].filter(c=>!dec.has(c)).sort((a,b)=>a-b);
const hx=c=>'U+'+c.toString(16).toUpperCase().padStart(4,'0');
console.log('in manifest, NOT in measured intersection:', onlyManifest.map(hx).join(' ')||'(none)');
console.log('in measured intersection, NOT in manifest:', onlyMeasured.map(hx).join(' ')||'(none)');

// Per-family subsets a jsPDF embed would actually guarantee
const groups={
 'Lora 4 (R/B/I/BI)':['Lora-Regular.ttf','Lora-Bold.ttf','Lora-Italic.ttf','Lora-BoldItalic.ttf'],
 'Lora 3 (R/B/I)':['Lora-Regular.ttf','Lora-Bold.ttf','Lora-Italic.ttf'],
 'Nunito 4 (R/B/XB/I)':['Nunito-Regular.ttf','Nunito-Bold.ttf','Nunito-ExtraBold.ttf','Nunito-Italic.ttf'],
 'Nunito 3 (R/B/I)':['Nunito-Regular.ttf','Nunito-Bold.ttf','Nunito-Italic.ttf'],
};
const CAMPAIGN=new Set(); for(let c=0x20;c<=0x7E;c++)CAMPAIGN.add(c); for(let c=0xA1;c<=0xFF;c++)CAMPAIGN.add(c);
const PINNED=[0x0101,0x0107,0x010C,0x010D,0x0110,0x0111,0x0161,0x017E];
console.log('\ngroup, intersectionSize, coversAll8Pinned, campaign190Missing, ttfBytes');
const sz=f=>readFileSync(join(FD,f)).length;
for(const [name,fs] of Object.entries(groups)){
  let gi=null; for(const f of fs){const s=sets[f]; gi=gi===null?new Set(s):new Set([...gi].filter(c=>s.has(c)));}
  const miss=[...CAMPAIGN].filter(c=>!gi.has(c));
  console.log(`${name}, ${gi.size}, ${PINNED.every(c=>gi.has(c))}, ${miss.length} (${miss.map(hx).join(' ')||'-'}), ${fs.reduce((a,f)=>a+sz(f),0)}`);
}
// The 27 WinAnsi-only additions, DERIVED from jsPDF's own runtime map (not typed).
const { jsPDF } = await import(join(T,'node_modules/jspdf/dist/jspdf.node.js'));
const winAnsi = new jsPDF().getFont().metadata?.Unicode?.encoding?.WinAnsiEncoding;
if (!winAnsi) throw new Error('no runtime WinAnsiEncoding map');
const winKeys = Object.keys(winAnsi).map(Number).sort((a,b)=>a-b);
const CURRENT = new Set(); for(let c=0x09;c<=0x0D;c++) CURRENT.add(c);
for(let c=0x20;c<=0x7E;c++) CURRENT.add(c); for(let c=0xA0;c<=0xFF;c++) CURRENT.add(c);
const w = winKeys.filter(c=>!CURRENT.has(c));
console.log('\njsPDF runtime WinAnsiEncoding keys =', winKeys.length);
console.log('widening additions (in WinAnsi, rejected by the current sanitiser) =', w.length);
console.log('  ', w.map(hx).join(' '));
let li=null; for(const f of groups['Lora 4 (R/B/I/BI)']){const s=sets[f]; li=li===null?new Set(s):new Set([...li].filter(c=>s.has(c)));}
let ni=null; for(const f of groups['Nunito 4 (R/B/XB/I)']){const s=sets[f]; ni=ni===null?new Set(s):new Set([...ni].filter(c=>s.has(c)));}
console.log('  covered by Lora-4 intersection:  ', w.filter(c=>li.has(c)).length, ' missing:', w.filter(c=>!li.has(c)).map(hx).join(' ')||'-');
console.log('  covered by Nunito-4 intersection:', w.filter(c=>ni.has(c)).length, ' missing:', w.filter(c=>!ni.has(c)).map(hx).join(' ')||'-');
// What an EMBEDDED-FONT campaign-pdf surface set would be vs today's 190
const embedLora = new Set([...li]); const embedNun = new Set([...ni]);
console.log('\nsurface-set movement if campaign-pdf/world-book switch to an embedded face:');
console.log('  today (winansi-and-textpass) = 190');
console.log('  Lora-4 embedded              =', embedLora.size, ' (gain +'+(embedLora.size-190)+')');
console.log('  Nunito-4 embedded            =', embedNun.size, ' (gain +'+(embedNun.size-190)+')');
const loseL=[...CAMPAIGN].filter(c=>!embedLora.has(c)).map(hx);
const loseN=[...CAMPAIGN].filter(c=>!embedNun.has(c)).map(hx);
console.log('  codepoints TODAY-printable that Lora-4 would LOSE:  ', loseL.join(' ')||'(none)');
console.log('  codepoints TODAY-printable that Nunito-4 would LOSE:', loseN.join(' ')||'(none)');
