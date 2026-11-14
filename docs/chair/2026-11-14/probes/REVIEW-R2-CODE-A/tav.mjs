import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T=process.argv[2]; const { hasInstitution } = await import(T+'/src/domain/facts/institutions.js');
const rl=readline.createInterface({input:fs.createReadStream(process.argv[3]).pipe(zlib.createGunzip()),crlfDelay:Infinity}); const c={};
for await (const line of rl){ const {seed,s}=JSON.parse(line); const sr=(s.settlementReason||[]).join(' '); if(!/other people's journeys/.test(sr)) continue; const h=hasInstitution({institutions:s.institutions},'tavern'); const k=`${s.tier} tavernAtom=${h}`; c[k]=c[k]||[]; c[k].push(seed); }
for(const [k,v] of Object.entries(c)) console.log(v.length, k, v.slice(0,3).join(' '));
