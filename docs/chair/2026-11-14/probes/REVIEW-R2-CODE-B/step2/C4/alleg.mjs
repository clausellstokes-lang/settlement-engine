// alleg.mjs <tree> <births.gz> [seedRe] [out.jsonl]: every hidden-allegiance card line, the handler, kept/dropped by the cure's predicate
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [tree,f,want,outf]=process.argv.slice(2);
const { allegianceOf } = await import(tree+'/src/domain/people/allegiance.js');
const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const out=[]; let lines=0,kept=0,drop=0; const towns=new Set();
for await(const l of rl){ const {seed,s}=JSON.parse(l); if(want&&!new RegExp(want).test(seed)) continue;
  const insts=s.institutions||[]; const F=(s.powerStructure?.factions)||[];
  for(const n of s.npcs||[]){ const a=allegianceOf(n); if(!a) continue; const g=a.power||a.house||null; if(!g) continue; lines++;
    const h=a.handler?(s.npcs||[]).find(x=>String(x?.id)===a.handler)||null:null;
    const ofHouse=!!h&&(String(h.institution?.key||'')===g||(Array.isArray(h.memberships)&&h.memberships.some(m=>m?.power===g)));
    if(h&&!ofHouse){drop++;towns.add(seed);} else if(h) kept++;
    // the power g: does a faction of that name exist, which institutions belong to it?
    const fac=F.find(x=>x.faction===g); const instOfG=insts.filter(i=>i.name===g||i.key===g).map(i=>i.name);
    out.push({seed,tier:s.tier,stress:[].concat(s.stress||[]).map(x=>x.type).join('+')||'calm',npc:n.name,npcTitle:n.title,g,power:a.power,house:a.house,via:a.via,
      handler:h?h.name:null,hTitle:h?.title,hKey:h?.institution?.key,hMem:(h?.memberships||[]).map(m=>m.power+'#'+m.rank),ofHouse,facExists:!!fac,instOfG});
  } }
console.log({lines,kept,drop,dropTowns:towns.size});
if(outf) fs.writeFileSync(outf,out.map(x=>JSON.stringify(x)).join('\n')+'\n'); else out.forEach(x=>console.log(JSON.stringify(x)));
