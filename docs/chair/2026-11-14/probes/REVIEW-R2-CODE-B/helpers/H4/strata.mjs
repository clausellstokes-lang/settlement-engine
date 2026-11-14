import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/';
const B=await import(T+'domain/density/densityCreateBoundary.js'); if (B.loadGenerationLawPayloads) await B.loadGenerationLawPayloads();
const P=await import(T+'domain/dossier/powerStrata.js'); const K=await import(T+'domain/people/seatKeeper.js');
function seatListTitle(powers){const held=powers.some(p=>p.role==='ruler'); if(!held) return `Contenders for the Seat (${powers.length})`; return powers.length>1?`The Seat and Its Contenders (${powers.length})`:'The Seat';}
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const t={}; const out=fs.createWriteStream('strata.tsv');
for await (const line of rl){ const {seed,s}=JSON.parse(line); const {powers,roster}=P.derivePowerStrata(s); if(!powers.length){t['none']=(t['none']||[]).concat(seed);continue;}
 const title=seatListTitle(powers); const k=title.replace(/\d+/,'N')+` vacant=${K.isSeatVacant(s)}`; (t[k]=t[k]||[]).push(seed);
 out.write([seed,s.tier,(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.type).join('+'),title,powers.map(p=>p.role+':'+p.name).join('; '),roster?.length,(s.powerStructure?.factions||[]).length].join('\t')+'\n'); }
out.end(); for(const [k,v] of Object.entries(t)) console.log(v.length,k,v.slice(0,3).join(' '));
