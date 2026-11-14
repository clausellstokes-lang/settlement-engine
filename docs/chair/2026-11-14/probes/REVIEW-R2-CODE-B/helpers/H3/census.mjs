// census.mjs <dir> <glob-suffix>: per file, per section, every catalogue count range / gate printed
import fs from 'fs'; import path from 'path';
const [dir, suffix=''] = process.argv.slice(2);
const RX=/\((?:\d[\d,]*\s*[-–]\s*\d[\d,]*\+?(?:\s*households)?|\d[\d,]*\+(?:\s*(?:only|households))?|high magic|low magic|if walled|multiple)\)/g;
const t=new Map();
for (const f of fs.readdirSync(dir).filter(f=>f.endsWith(suffix))) {
  const lines=fs.readFileSync(path.join(dir,f),'utf8').split('\n'); let sec='(top)';
  for (const l of lines) { if (/^== .* ==$/.test(l)) { sec=l; continue; } if (/^#{1,3} /.test(l)) sec=l.slice(0,60);
    for (const m of l.matchAll(RX)) { const i=m.index; const ctx=l.slice(Math.max(0,i-60),i+m[0].length+20);
      const pre=l.slice(Math.max(0,i-30),i).replace(/.*[,:·] /,'');
      const k=(suffix?'':sec)+' :: '+pre+m[0]; const e=t.get(k)||{n:0,files:new Set(),ex:''}; e.n++; e.files.add(f); if(!e.ex) e.ex=f+' | '+ctx; t.set(k,e);} } }
for (const [k,e] of [...t].sort((a,b)=>b[1].files.size-a[1].files.size)) console.log(e.files.size+'\t'+k+'\t'+e.ex);
