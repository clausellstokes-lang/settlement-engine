import zlib from 'zlib'; import fs from 'fs'; import readline from 'readline';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const { chainHousesOf, chainSourceOf } = await import(S+'/tip/src/domain/display/chainHouses.js');
const { chainPrintName } = await import(S+'/tip/src/domain/display/chainPrintName.js');
const { institutionHouseLabel, institutionDisplayName } = await import(S+'/tip/src/domain/display/institutionDisplayName.js');
const rl = readline.createInterface({ input: fs.createReadStream(S+'/out/births-tip.ndjson.gz').pipe(zlib.createGunzip()) });
const c={}; const ex={}; const tiers={};
const hit=(k,seed,tier)=>{ (c[k]??=new Set()).add(seed); (tiers[k]??=new Set()).add(tier); ex[k]??=seed; };
for await (const line of rl) { const {seed,s}=JSON.parse(line); const names=s.institutions.map(i=>i.name);
 for (const ch of s.economicState?.activeChains||[]) { const sh=chainPrintName(ch,s); const src=chainSourceOf(ch,sh); const hs=chainHousesOf(ch.processingInstitutions,names);
  if (hs.length) hit('via',seed,s.tier);
  if (hs.some(h=>/^Access to/.test(h.name))) hit('via-access',seed,s.tier);
  if (src) hit('from',seed,s.tier); if (src && ch.resourceDepleted) hit('from-depleted',seed,s.tier);
  if (src && sh.resource!==ch.resource) hit('from-renamed',seed,s.tier);
  if (!src && ch.resource) hit('from-dropped',seed,s.tier);
  const raw=[...new Set((ch.processingInstitutions||[]).map(p=>institutionDisplayName(p)))]; if (raw.join('|')!==hs.map(h=>h.name).join('|')) hit('via-changed',seed,s.tier);
 }
 if (names.some(n=>institutionHouseLabel(n)!==institutionDisplayName(n))) hit('label-stripped',seed,s.tier);
 if (names.includes('Inn (multiple)')) hit('inns',seed,s.tier);
 if (s.institutions.some(i=>i.source==='faction_boost')) hit('faction_boost',seed,s.tier);
 if (s.institutions.some(i=>i.sourceTag==='required' || i._created?.sourceTag==='required')) hit('req',seed,s.tier);
 const st=JSON.stringify(s.stress||s.stressors||''); if (/under_siege/.test(st)) hit('siege-town',seed,s.tier);
}
for (const k in c) console.log(k, c[k].size, [...tiers[k]].join(','), ex[k]);
