// pagediffall.mjs <basedir> <tipdir> <out.tsv>: over every town in both dirs, page lines (tab|line) added at tip / removed; tallied by the line with the town name masked
import fs from 'node:fs';
const [bd, td, out] = process.argv.slice(2);
const rd=(f)=>{ const s=new Set(); let tab=''; for(const l of fs.readFileSync(f,'utf8').split('\n')){ if(l.startsWith('== ')){tab=l.replace(/==/g,'').trim(); continue;} if(l&&!l.startsWith('[STYLE]')) s.add(tab+'|'+l); } return s; };
const rows=[]; const tally=new Map(); let moved=0, n=0;
for(const f of fs.readdirSync(bd)){ if(!fs.existsSync(td+'/'+f)) continue; n++; const seed=f.slice(0,-4); const A=rd(bd+'/'+f), B=rd(td+'/'+f); let m=false; const name=(fs.readFileSync(td+'/'+f,'utf8').split('\n')[1]||'').split('·')[0].trim();
  const mask=(x)=> name? x.split(name).join('{N}') : x;
  for(const x of B) if(!A.has(x)){ m=true; rows.push(['+',seed,x].join('\t')); const k='+\t'+mask(x); tally.set(k,(tally.get(k)||[]).concat(seed)); }
  for(const x of A) if(!B.has(x)){ m=true; rows.push(['-',seed,x].join('\t')); const k='-\t'+mask(x); tally.set(k,(tally.get(k)||[]).concat(seed)); }
  if(m) moved++; }
fs.writeFileSync(out, rows.join('\n')+'\n');
console.log('towns',n,'moved',moved,'distinct lines',tally.size);
fs.writeFileSync(out+'.tally', [...tally].sort((a,b)=>b[1].length-a[1].length).map(([k,v])=>v.length+'\t'+k.slice(0,300)+'\t'+v.slice(0,3).join(' ')).join('\n')+'\n');
