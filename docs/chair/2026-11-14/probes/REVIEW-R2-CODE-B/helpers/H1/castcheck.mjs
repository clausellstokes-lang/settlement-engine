import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src';
const T = await import(R+'/domain/summary/tonightSheet.js');
const pats=[]; for(const [role,pool] of Object.entries(T.CAST_WANTS)) pool.forEach((l,i)=>pats.push({role,i,l,re:new RegExp('^'+l.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\\\{[a-z]+\\\}/g,'(.+?)')+'$')}));
const L=fs.readFileSync('scan.jsonl','utf8').trim().split('\n').map(JSON.parse); const bySeed=new Map(L.map(x=>[x.seed,x]));
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const tally={}; const rows=[];
for await (const line of rl){ const {seed,s}=JSON.parse(line); const x=bySeed.get(seed);
  for(const p of x.tonight.people){ if(p.why!=='cast') continue; const npc=s.npcs[+p.sourcePath.match(/\d+/)[0]];
    const own=T.hasOwnGoal(npc); const hit=p.says==='want'?pats.find(q=>q.re.test(p.line)):null;
    const k=`${p.castLabel}|own=${own}|says=${p.says}|pool=${hit?hit.role+hit.i:'-'}`; tally[k]=(tally[k]||0)+1;
    rows.push({seed,tier:x.tier,stresses:x.stresses,seatVacant:x.seatVacant,name:p.name,role:p.role,castLabel:p.castLabel,castKind:p.castKind,says:p.says,line:p.line,own,pool:hit?hit.role+hit.i:null,goal:npc.goal,memberships:npc.memberships,secret:typeof npc.secret==='object'?npc.secret?.what:npc.secret});
  } }
console.log(tally); fs.writeFileSync('castrows.jsonl', rows.map(r=>JSON.stringify(r)).join('\n'));
