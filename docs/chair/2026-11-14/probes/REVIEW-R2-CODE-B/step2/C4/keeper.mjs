// keeper.mjs <tree> <births.gz> [seedRe]: towns with a vacant seat; the keeper; every relationship end that is the keeper: stored role vs shown
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [tree,f,want]=process.argv.slice(2);
const { keeperFormOf, seatKeeperOf, isSeatVacant } = await import(tree+'/src/domain/people/seatKeeper.js');
const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity});
let vac=0,withKeeper=0,ends=0,townsEnds=0; const ex=[]; const otherRoleUse=[];
for await(const l of rl){ const {seed,s}=JSON.parse(l); if(want&&!new RegExp(want).test(seed)) continue; if(!isSeatVacant(s)) continue; vac++;
  const k=seatKeeperOf(s); if(!k) { ex.push(seed+' VACANT, NO KEEPER'); continue;} withKeeper++; const form=keeperFormOf(s);
  let e=0; for(const r of (s.relationships||[])){ for(const [id,role,name] of [[r.from,r.npc1Role,r.npc1Name],[r.to,r.npc2Role,r.npc2Name]]){
    if(id===k.id){ e++; ends++; ex.push(`${seed} [${s.tier}] keeper ${k.name} (role ${k.role}, title ${k.title}) | stored "${role}" -> "${form||role}" | line: ${r.from===k.id?(form||r.npc1Role)+' · '+r.strength+' · '+r.npc2Role : r.npc1Role+' · '+r.strength+' · '+(form||r.npc2Role)}`);}
    else if(name===k.name) otherRoleUse.push(seed+' name match without id '+name); } }
  if(e) townsEnds++; }
console.log({vac,withKeeper,ends,townsEnds,otherRoleUse:otherRoleUse.length}); console.log(ex.join('\n'));
