import zlib from 'zlib'; import fs from 'fs'; import readline from 'readline';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const { chainPrintName } = await import(S+'/tip/src/domain/display/chainPrintName.js');
const rl = readline.createInterface({ input: fs.createReadStream(S+'/out/births-tip.ndjson.gz').pipe(zlib.createGunzip()) });
const t=new Map();
for await (const line of rl) { const {seed,s}=JSON.parse(line);
  for (const c of s.economicState?.activeChains||[]) { const sh=chainPrintName(c,s); if (sh.resource===c.resource) continue;
   const names=(s.institutions||[]).map(i=>i.name).join('|');
   const k=sh.resource+' water='+/dock|harbo|port|pier|wharf|quay/i.test(names)+' river='+/river|ferry|barge|boat/i.test(names)+' rivers='+JSON.stringify(s.spatialLayout?.waterway||s.config?.nearbyWater||s.config?.terrainType||'');
   t.set(k,(t.get(k)||[]).concat(seed)); } }
for (const [k,v] of t) console.log(v.length, k, v.slice(0,3).join(' '));
