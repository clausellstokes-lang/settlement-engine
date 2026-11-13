// firstsub.mjs <corpus> <dumps>: cards that are FIRST (rank 1) of a power and whose own card prints a SUBORDINATE position line
// (under its leaders / the senior casters / the crew's boss; a place in a crew; a smaller house / a lesser family behind the leading one).
import fs from 'node:fs'; import zlib from 'node:zlib';
const [C,D]=process.argv.slice(2); const SUB=/^(Works spells under|Serves the faith under|Holds a place (in a crew|under)|Runs a smaller house|Belongs to a lesser|Leads a squad|Holds an office (under|that hangs|among))/;
let n=0, cards=0; const by={}; const ex=[];
for(const l of zlib.gunzipSync(fs.readFileSync(C)).toString().split('\n')){ if(!l) continue; const {seed,s}=JSON.parse(l);
  const v=fs.readFileSync(`${D}/${seed}.txt`,'utf8').split('\n'); const s0=v.indexOf('== World/NPCs =='); const s1=v.findIndex((x,i)=>i>s0&&/^== /.test(x)); const w=v.slice(s0+1,s1);
  const gov=(s.powerStructure.factions||[]).find(f=>f.isGoverning); const govName=gov&&(gov.faction||gov.name);
  let hit=false;
  for(const p of s.npcs){ const firsts=(p.memberships||[]).filter(m=>m.rank===1&&m.power!==govName); if(!firsts.length) continue;
    const i=w.findIndex(x=>x.startsWith(p.name)&&/●+$/.test(x)); if(i<0) continue;
    for(let j=i+1;j<w.length&&!/●+$/.test(w[j]);j++) if(SUB.test(w[j])){ cards++; hit=true; const k=`${p.title} :: ${w[j].slice(0,45)}`; by[k]=(by[k]||0)+1; if(ex.length<4) ex.push(`${seed} ${p.name} first of ${firsts.map(m=>m.power).join('+')}: ${w[j]}`); break; } }
  if(hit) n++; }
console.log(JSON.stringify({townsWith:n, cards, top:Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,12), ex},null,1));
