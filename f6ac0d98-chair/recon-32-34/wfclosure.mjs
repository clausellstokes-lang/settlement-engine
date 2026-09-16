import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
const ROOT = process.argv[2];
const START = process.argv.slice(3);
const seen = new Set(); const q = [...START.map(s=>resolve(ROOT,s))];
while(q.length){
  const f = q.shift();
  if(seen.has(f) || !existsSync(f)) continue;
  seen.add(f);
  let src; try{ src = readFileSync(f,'utf8'); }catch{ continue; }
  const re = /(?:^|[\s;{(=])(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  let m;
  while((m = re.exec(src))){
    const spec = m[1]||m[2];
    if(!spec || !spec.startsWith('.')) continue;
    let t = resolve(dirname(f), spec);
    if(!existsSync(t) && existsSync(t+'.js')) t = t+'.js';
    if(!existsSync(t) && existsSync(t+'.jsx')) t = t+'.jsx';
    if(!existsSync(t)) continue;
    q.push(t);
  }
}
const rel = [...seen].map(f=>relative(ROOT,f)).sort();
console.log('TOTAL MODULES:', rel.length);
const needles = ['pilgrimage','religionState','religionLegitimacy','religiousContest','peaceTerms','heraldRouting','settlementRumors','realmEvents','deityStance','sacredClaim','generosityEV','warDeployment','warTermination','treatyEnforcement','institutionRoster','institutionFounding','faithNews','piety','deityAxes','errandMint','foreignGuestHold','traditions'];
for (const n of needles){ const hits = rel.filter(r=>r.toLowerCase().includes(n.toLowerCase())); if(hits.length) console.log(n.padEnd(20), hits.join(' | ')); }
