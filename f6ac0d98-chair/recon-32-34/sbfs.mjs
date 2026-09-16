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
  const re = /(?:^|[\s;{(=])(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]/g;
  let m;
  while((m = re.exec(src))){
    const spec = m[1];
    if(!spec || !spec.startsWith('.')) continue;
    let t = resolve(dirname(f), spec);
    if(!existsSync(t) && existsSync(t+'.js')) t = t+'.js';
    if(!existsSync(t)) continue;
    q.push(t);
  }
}
const rel = [...seen].map(f=>relative(ROOT,f)).sort();
console.log('TOTAL STATIC MODULES:', rel.length);
const targets = ['worldPulse/warSeatBooks','worldPulse/settlementPolitics','worldPulse/grievanceRead','worldPulse/relationshipMemory','worldPulse/relationshipEvolution','worldPulse/npcLadderState','worldPulse/coup.js','worldPulse/factionPairLedger','worldPulse/commonsVoiceKernel','worldPulse/deploymentReturn','rulingPower'];
for (const t of targets) { const hit = rel.filter(r=>r.includes(t)); console.log(t.padEnd(36), hit.length ? 'IN GRAPH: '+hit.join(',') : 'not reached'); }
