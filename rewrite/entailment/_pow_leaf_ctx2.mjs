import { DOSSIER_STATE_PROSE_POWER as L } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW/src/data/dossierStateProse/power.generated.js';
const re = /\b(the watch|a working watch|watches|watch rota|guards?|the guard|somebody|nobody|anybody|everybody|a stranger|the people|a person|the town knows|the town has noticed|the town has decided|the seat|the interest|a particular interest|the criminal interest|the combination|the majority|the houses?|a house|the bloc|the crown|the lord|the state|the government|the governing body|the rulers?|the office|the hall|the court|the council)\b/gi;
const counts={}; const rows=[];
for (const [block,def] of Object.entries(L)) for (const [pool,p] of Object.entries(def.pools||{})) for (const v of (Array.isArray(p)?p:(p.variants||[]))) {
  const found = [...v.text.matchAll(re)].map(m=>m[1].toLowerCase()); for (const f of found) counts[f]=(counts[f]||0)+1;
  if (found.some(f=>/government|governing body|the state|crown|lord/.test(f))) rows.push(`${block} :: ${pool} v${v.vid} [${v.angle}${(v.marks||[]).length?' · '+v.marks.join(','):''}] ${v.text.slice(0,150)}`);
}
console.log(JSON.stringify(Object.fromEntries(Object.entries(counts).sort((a,b)=>b[1]-a[1]))));
console.log(rows.join('\n'));
