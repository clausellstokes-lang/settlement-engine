import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/';
const A=await import(T+'domain/people/allegiance.js');
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const t={}; const out=fs.createWriteStream('alleg.tsv'); let towns=new Set(), named=new Set();
for await (const line of rl){ const {seed,s}=JSON.parse(line);
 for (const npc of s.npcs||[]){ const a=A.allegianceOf(npc); if(!a) continue; towns.add(seed);
  const guild=a.power||a.house||null; const h=a.handler?(s.npcs||[]).find(n=>String(n?.id)===a.handler)||null:null;
  const byKey=!!h&&!!guild&&String(h.institution?.key||'')===guild; const byMem=!!h&&!!guild&&Array.isArray(h.memberships)&&h.memberships.some(m=>m?.power===guild);
  const of=byKey||byMem; if(of) named.add(seed);
  const k=`power=${!!a.power} handler=${!!a.handler} found=${!!h} byKey=${byKey} byMem=${byMem}`; t[k]=(t[k]||0)+1;
  const powerExists=(s.powerStructure?.factions||[]).some(f=>(f.faction||f.name)===guild);
  const instExists=(s.institutions||[]).some(i=>i.name===guild);
  out.write([seed,s.tier,npc.name,npc.role,guild,powerExists,instExists,h?h.name:'',h?h.role:'',h?.institution?.key||'',JSON.stringify((h?.memberships||[]).map(m=>m.power)),of,`answers to ${guild}${of?', through '+h.name:''}`].join('\t')+'\n'); } }
out.end(); console.log('towns',towns.size,'towns with a named handler',named.size); console.log(t);
