// Self-contained TTF cmap reader (formats 4, 6, 12). No deps, read-only.
import { readFileSync, statSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = process.argv[2];

function u16(b,o){return b.readUInt16BE(o);} function u32(b,o){return b.readUInt32BE(o);}
function i16(b,o){return b.readInt16BE(o);}

function tables(buf){
  const num = u16(buf,4); const t={};
  for(let i=0;i<num;i++){const o=12+i*16; t[buf.toString('ascii',o,o+4)]={off:u32(buf,o+8),len:u32(buf,o+12)};}
  return t;
}

function cmapCodepoints(buf){
  const t=tables(buf); const cm=t['cmap']; if(!cm) return null;
  const base=cm.off; const n=u16(buf,base+2);
  let best=null, bestScore=-1;
  for(let i=0;i<n;i++){
    const o=base+4+i*8; const pid=u16(buf,o), eid=u16(buf,o+2), off=u32(buf,o+4);
    // prefer (3,10) unicode full, then (3,1) BMP, then (0,x)
    let score = pid===3&&eid===10?4 : pid===3&&eid===1?3 : pid===0?2 : 0;
    if(score>bestScore){bestScore=score; best=base+off;}
  }
  if(best==null) return null;
  const fmt=u16(buf,best); const set=new Set();
  if(fmt===4){
    const segX2=u16(buf,best+6); const seg=segX2/2;
    const endO=best+14, startO=endO+segX2+2, deltaO=startO+segX2, rangeO=deltaO+segX2;
    for(let s=0;s<seg;s++){
      const end=u16(buf,endO+s*2), start=u16(buf,startO+s*2);
      const delta=i16(buf,deltaO+s*2), ro=u16(buf,rangeO+s*2);
      if(start===0xFFFF) continue;
      for(let c=start;c<=end && c!==0x10000;c++){
        let g;
        if(ro===0){ g=(c+delta)&0xFFFF; }
        else{ const gi=rangeO+s*2+ro+(c-start)*2; if(gi+1>=buf.length) continue; g=u16(buf,gi); if(g!==0) g=(g+delta)&0xFFFF; }
        if(g!==0) set.add(c);
      }
    }
  } else if(fmt===12){
    const ng=u32(buf,best+12);
    for(let i=0;i<ng;i++){const o=best+16+i*12; const s=u32(buf,o),e=u32(buf,o+4);
      for(let c=s;c<=e;c++) set.add(c);}
  } else if(fmt===6){
    const first=u16(buf,best+6), cnt=u16(buf,best+8);
    for(let i=0;i<cnt;i++){ if(u16(buf,best+10+i*2)!==0) set.add(first+i); }
  } else { return {fmt, set:null}; }
  return {fmt,set};
}

const PINNED=[0x0101,0x0107,0x010C,0x010D,0x0110,0x0111,0x0161,0x017E];
const files=readdirSync(DIR).filter(f=>f.endsWith('.ttf')).sort();
const per={};
for(const f of files){
  const buf=readFileSync(join(DIR,f));
  const r=cmapCodepoints(buf);
  const size=statSync(join(DIR,f)).size;
  const numGlyphs = (()=>{const t=tables(buf); return t['maxp']?u16(buf,t['maxp'].off+4):null;})();
  per[f]={size,fmt:r?.fmt,count:r?.set?.size,numGlyphs,
    pinned:PINNED.map(cp=>[`U+${cp.toString(16).toUpperCase().padStart(4,'0')}`, r?.set?.has(cp)??null]),
    set:r?.set};
}
console.log('file,bytes,cmapFmt,cmapCodepoints,numGlyphs');
for(const [f,v] of Object.entries(per)) console.log(`${f},${v.size},${v.fmt},${v.count},${v.numGlyphs}`);
console.log('\n--- pinned 8 coverage per face ---');
console.log('codepoint,'+files.join(','));
for(let i=0;i<PINNED.length;i++){
  const cp=PINNED[i];
  console.log(`U+${cp.toString(16).toUpperCase().padStart(4,'0')},`+files.map(f=>per[f].pinned[i][1]?'YES':'no').join(','));
}
// intersection + union
let inter=null, union=new Set();
for(const f of files){ const s=per[f].set; for(const c of s) union.add(c);
  if(inter===null) inter=new Set(s); else for(const c of [...inter]) if(!s.has(c)) inter.delete(c); }
console.log(`\nINTERSECTION size = ${inter.size}`);
console.log(`UNION size        = ${union.size}`);
console.log(`total TTF bytes   = ${files.reduce((a,f)=>a+per[f].size,0)}`);
// WinAnsi-superset question: how many of the 190 campaign-pdf set are in the intersection
let miss=[]; for(let c=0x20;c<=0x7E;c++) if(!inter.has(c)) miss.push(c);
for(let c=0xA1;c<=0xFF;c++) if(!inter.has(c)) miss.push(c);
console.log(`campaign-pdf 190-set codepoints MISSING from the 8-face intersection: ${miss.length}` + (miss.length?` -> ${miss.map(c=>'U+'+c.toString(16).toUpperCase().padStart(4,'0')).join(' ')}`:''));
