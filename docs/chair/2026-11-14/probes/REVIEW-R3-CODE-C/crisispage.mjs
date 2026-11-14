// crisispage.mjs <tree> <births.gz>: per crisis section, empty cast / empty levers; with kind, tier, the town's institutions matching the kind's lever table and its absent roles
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [tree, file] = process.argv.slice(2);
const { composeCrisisPage } = await import(tree+'/src/domain/crisis/crisisPage.js');
const { CRISIS_LEVERS } = await import(tree+'/src/domain/crisis/crisisCast.js');
const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line); let page; try{ page=composeCrisisPage(s);}catch(e){ console.log(seed+'\tERR '+e.message); continue; }
  const secs=page?.sections||page||[]; for(const sec of (Array.isArray(secs)?secs:[])){ const kind=sec.kind||sec.type; const lev=CRISIS_LEVERS[kind]; const houses=lev? s.institutions.map(i=>i.name).filter(n=>lev.house.test(n)) : [];
    if(sec.cast?.length===0) console.log([seed,s.tier,s.population,kind,'NOBODY','absent='+(sec.absent||[]).map(a=>a.roleLabel+':'+a.reason).join('; ').slice(0,200)].join('\t'));
    if(sec.levers?.length===0) console.log([seed,s.tier,s.population,kind,'NOLEVERS','matchingHouses='+houses.join('|'),'npcRoles='+(sec.cast||[]).map(c=>c.roleLabel+':'+c.name).join('; ').slice(0,160)].join('\t')); } }
