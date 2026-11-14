import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const {seed,s}=JSON.parse(line); const r=s.history?.founding?.reason; if(r==null||r==='') console.log(seed, s.tier, s.config?.tradeRouteAccess, s.config?.terrainType, JSON.stringify(s.history?.founding?.foundedBy)); }
