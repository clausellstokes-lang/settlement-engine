// REVIEW-R2-STAGES step 6: every machinery form on every surface of the 20 towns at a tree.
// node machinery.mjs <surf dir> <dumps dir> : counts by surface and form, with the line before for context
import fs from 'node:fs';
const [surf,dumps]=process.argv.slice(2);
const FORMS={ chainDepth:/\d-order chain/, covers:/· covers /, countRange:/\((?:\d+[-–]\d+\+?|\d[\d,]*\+(?: only)?)\)/, gate:/\((?:high magic|if walled)\)/, provenance:/\((?:smuggling|arcane underground)\)/ };
const out={}; const ex={};
function scan(surface,text){ const ls=text.split('\n'); ls.forEach((l,i)=>{ if(/History & Founding \(|hooks to pull|institutions; the largest/.test(l)) return; for(const [k,re] of Object.entries(FORMS)) if(re.test(l)){ const key=surface+' :: '+k; out[key]=(out[key]||0)+1; (ex[key]||=new Map()).set(l.slice(0,90), (ls[i-2]||'').slice(0,40)+' / '+(ls[i-1]||'').slice(0,40)); } }); }
for(const f of fs.readdirSync(surf).filter(f=>f.endsWith('.txt')&&f.startsWith('rr2s'))){ const surface=f.replace(/^rr2s-[^.]+\./,'').replace(/\.txt$/,''); scan(surface, fs.readFileSync(`${surf}/${f}`,'utf8')); }
for(const f of fs.readdirSync(dumps)){ const t=fs.readFileSync(`${dumps}/${f}`,'utf8'); let view=''; for(const l of t.split('\n')){ if(l.startsWith('== ')){view=l;continue;} if(l.startsWith('[STYLE]')) continue; scan('page '+view.replace(/^== | ==$/g,''), l); } }
for(const [k,v] of Object.entries(out).sort()) { console.log(v, k); for(const [l,c] of [...ex[k]].slice(0,4)) console.log('     ', l, '   ⟵', c); }
