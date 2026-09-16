import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, relative } from 'node:path';
const ROOT = process.argv[2];
const START = process.argv.slice(3);
const seen = new Set(); const q = [...START.map(s=>resolve(ROOT,s))];
const edges = new Map();
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
    if(!existsSync(t)) continue;
    if(!edges.has(t)) edges.set(t, f);
    q.push(t);
  }
}
const rel = [...seen].map(f=>relative(ROOT,f)).sort();
console.log('TOTAL MODULES:', rel.length);
const wp = rel.filter(r=>r.includes('domain/worldPulse'));
console.log('worldPulse modules reached:', wp.length);
console.log(wp.filter(r=>/warSeatBooks|settlementPolitics|grievanceRead|relationshipMemory|factionPairLedger|warPoliticalLoop|npcLadderState|commonsVoiceKernel|deploymentReturn/.test(r)).join('\n'));
