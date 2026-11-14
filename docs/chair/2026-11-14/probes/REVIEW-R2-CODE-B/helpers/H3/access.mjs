import zlib from 'zlib'; import fs from 'fs'; import readline from 'readline';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const { chainHousesOf } = await import(S+'/tip/src/domain/display/chainHouses.js');
const rl = readline.createInterface({ input: fs.createReadStream(S+'/out/births-tip.ndjson.gz').pipe(zlib.createGunzip()) });
const t=new Map();
for await (const line of rl){const {seed,s}=JSON.parse(line); const names=s.institutions.map(i=>i.name); const st=(Array.isArray(s.stressors)?s.stressors:[]).map(x=>x.type).join('+')||'calm';
 for (const c of s.economicState.activeChains){ const hs=chainHousesOf(c.processingInstitutions,names); if(!hs.some(h=>/^Access to/.test(h.name))) continue;
  const k=c.chainId+' '+hs.map(h=>h.name).join('+')+' status='+c.status+' siege='+/siege/.test(st); const e=t.get(k)||[]; e.push(seed); t.set(k,e);} }
for (const [k,v] of [...t].sort()) console.log(v.length,k,v.slice(0,2).join(' '));
