import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
export async function* recs(file){ const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity});
  for await (const l of rl){ if(!l) continue; const o=JSON.parse(l); yield {seed:o.seed||o.key, s:o.s||o.rec, tier:o.tier, stress:o.stress}; } }
