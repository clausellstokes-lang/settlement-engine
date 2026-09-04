import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
function streams(p){ const raw=readFileSync(p).toString('latin1'); let out=[],i=0;
  while((i=raw.indexOf('stream',i))!==-1){ let s=i+6; while(raw[s]==='\r'||raw[s]==='\n')s++;
    const e=raw.indexOf('endstream',s); if(e===-1)break; const ch=Buffer.from(raw.slice(s,e),'latin1');
    try{out.push(inflateSync(ch).toString('latin1'));}catch{out.push(ch.toString('latin1'));} i=e+9;} return out;}
function toUnicodeMap(all){ const m=new Map();
  for(const s of all){ if(!s.includes('beginbfchar'))continue;
    for(const blk of s.split('beginbfchar').slice(1)){ const body=blk.split('endbfchar')[0];
      for(const mm of body.matchAll(/<([0-9a-fA-F]{4})>\s*<([0-9a-fA-F]{4,})>/g)) m.set(parseInt(mm[1],16), String.fromCodePoint(parseInt(mm[2].slice(0,4),16))); } }
  return m;}
function painted(p){
  const all=streams(p); const m=toUnicodeMap(all); let plain='',ident='';
  for(const s of all){
    for(const mm of s.matchAll(/\(((?:\\.|[^\\)])*)\)\s*Tj/g)) plain+=mm[1].replace(/\\([()\\])/g,'$1')+'\n';
    for(const mm of s.matchAll(/<([0-9a-fA-F]+)>\s*Tj/g)){
      const h=mm[1]; let t=''; for(let i=0;i+3<h.length+1;i+=4){const g=parseInt(h.slice(i,i+4),16); t+=m.get(g)??'�';} ident+=t+'\n'; }
  }
  return {plain, ident, mapSize:m.size};
}
const PROBE=['Babić','Đorđević','Kovačević','Uroš','Snežana','Čupić','Khān','Hadžić','€','†','—','’'];
for(const f of ['sample-helvetica.pdf','sample-embed-full.pdf','sample-embed-subset.pdf']){
  const r=painted(f); const text=(r.plain+r.ident);
  console.log(`\n### ${f}  (plainTj=${r.plain.length}B identityTj=${r.ident.length}B toUnicodeEntries=${r.mapSize})`);
  console.log('  first identity line:', JSON.stringify(r.ident.split('\n')[0]||'(none)'));
  console.log('  first plain line   :', JSON.stringify(r.plain.split('\n')[0]||'(none)'));
  console.log('  probe hits:', PROBE.map(t=>`${t}=${text.includes(t)?'YES':'no'}`).join(' '));
}
