// ROUND-3-CUT step 4, second pass: where several lanes change one file, the lanes with commits of their OWN on it
// (commits in merge-base..tip touching the file that no other holder also carries). A lane whose changes to the file
// are all carried from another holder is not its holder. Repackages cut.json. node own-holders.mjs <holders> <cut>
import fs from 'node:fs'; import { execSync } from 'node:child_process';
const H=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const R=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const memo={}; const own=(f,hs)=>memo[f+hs]??=(()=>{ const sets=hs.map(k=>new Set(execSync(`git log --format=%H ${H[k].mergeBase}..${H[k].tip} -- ${f}`).toString().trim().split('\n').filter(Boolean)));
  const o=hs.filter((k,i)=>{ const others=new Set(sets.filter((_,j)=>j!==i).flatMap(s=>[...s])); return [...sets[i]].some(c=>!others.has(c)); }); return o; })();
let moved=0; for(const r of R){ r.ownHolders=r.holders.length>1?own(r.writer.file,r.holders):r.holders; if(!r.package||r.holders.length<2) continue;
  const o=r.ownHolders; const p= o.length===1?`lane ${o[0]}`: o.length>1?`several lanes: ${o.join(', ')}`:`several lanes, shared commits only: ${r.holders.join(', ')}`; if(p!==r.package){ r.packageBefore=r.package; r.package=p; moved++; } }
fs.writeFileSync(process.argv[3],JSON.stringify(R,null,1)); console.log('repackaged',moved);
