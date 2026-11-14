import fs from 'node:fs'; import {towns} from './iter.mjs';
const [B,DUMPS]=process.argv.slice(2); const picks=[]; const seenKey=new Set();
for await (const {seed,s} of towns(B)){ const size=s.config.settType||seed.split('-')[1]; const cr=(seed.match(/^r2s-([a-z_]+)-/)||seed.match(/^rr3-\w+-([a-z_+]+)-/)||[])[1]||'calm';
  for(const c of s.economicState?.activeChains||[]){ if(c.resourceCondition!=='absent') continue; const k=c.resource+'|'+size; if(seenKey.has(k)) continue; seenKey.add(k);
    const t=fs.readFileSync(`${DUMPS}/${seed}.txt`,'utf8'); const res=(t.split(/^== /m).find(x=>x.startsWith('Systems/Resources'))||'');
    const word=c.resource.split(' ')[0].toLowerCase().replace(/s$/,'');
    picks.push(`${seed} [${size}/${cr}] ${c.chainId} "${c.resource}" key=${c.resourceKey} entrepot=${!!c.entrepot} status=${c.status} route=${s.config.tradeRouteAccess} terrain=${s.config.terrainType} near=${(s.config.nearbyResources||[]).join(',')} resTabMentions=${res.toLowerCase().includes(word)}`); } }
console.log(picks.length); console.log(picks.join('\n'));
