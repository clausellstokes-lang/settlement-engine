// item 1 measure: the founding paragraph's rows by arm/index against siege, tier, traveller house, isolation paths, port route
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { ORIGIN_POOLS, CHANNELS_TOKEN, GROUND_TOKEN } = await import(R+'/generators/narrative/settlementOriginProse.js');
const { crisisOf } = await import(R+'/domain/facts/crisisKind.js');
const { hasInstitution } = await import(R+'/domain/facts/institutions.js');
const heads=[]; for(const [arm,pool] of Object.entries(ORIGIN_POOLS)) pool.forEach((t,i)=>heads.push({arm,i,head:t.split(CHANNELS_TOKEN)[0].split(GROUND_TOKEN)[0].slice(0,28)}));
const which=(t)=>{ const h=heads.filter(h=>t.startsWith(h.head)).sort((a,b)=>b.head.length-a.head.length)[0]; return h?`${h.arm}[${h.i}]`:'?'; };
const tally={}; const ex={};
const add=(k,seed)=>{ tally[k]=(tally[k]||0)+1; (ex[k] ||= []).length<4 && ex[k].push(seed); };
for (const f of process.argv.slice(2)) {
 const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip())});
 for await (const l of rl){ const {seed,s}=JSON.parse(l);
  const r=(s.settlementReason||[])[0]||''; const w=which(r); const siege=crisisOf(s).has('under_siege');
  const names=(s.institutions||[]).map(i=>i.name||'');
  const trav=hasInstitution(s,'tavern') || names.some(n=>/\bstabl/i.test(n));
  const route=s.config?.tradeRouteAccess; const docks=hasInstitution(s,'docks');
  add(`row ${w}`,seed);
  if(siege && /^road\[(0|2|3)\]/.test(w)) add(`SIEGE ${w} ${s.tier}`,seed);
  if(w==='road[3]' && !trav) add(`road[3] no traveller house ${s.tier}`,seed);
  if(w==='road[3]' && /city|metropolis/.test(s.tier)) add(`road[3] at ${s.tier}`,seed);
  if(/^isolated\.deficit/.test(w)) { add(`deficit ${w} siege:${siege} paths:${(s.isolationSupport?.paths||[]).map(p=>p.type).join(',')} magic:${/carriage by magic/.test(r)}`,seed); }
  if(/through|rests on|met through/.test(r) && siege) add(`CHANNELS UNDER SIEGE ${w}`,seed);
  if(w==='ground[2]') add(`ground[2] route:${route} docks:${docks}`,seed);
  if(/^ground/.test(w)) add(`ground* route:${route}`,seed);
 }
}
for (const k of Object.keys(tally).sort()) console.log(String(tally[k]).padStart(4), k, '|', ex[k].join(' '));
