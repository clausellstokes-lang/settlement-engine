// drawmove.mjs <baseRecords> <tipRecords> <seedsfile>: per town, the people added/removed and, for people on both trees (by id),
// which fields differ (influence, power, goal.short, presentation, secret, personality, relationships count/kind), and whether
// the town's relationships list differs. Read-only.
import fs from 'node:fs';
const [B,T,SF]=process.argv.slice(2);
const pick=(p)=>({influence:p.influence,power:p.power,goal:p.goal?.short,goalLong:p.goal?.long,disp:p.presentation?.disposition,secret:p.secret?.what,flaw:p.personality?.flaw,name:p.name,title:p.title,structuralRank:p.structuralRank,importance:p.importance,mem:JSON.stringify((p.memberships||[]).map(m=>[m.power,m.rank]))});
const tally={};
for(const s of fs.readFileSync(SF,'utf8').trim().split('\n')){
  const b=JSON.parse(fs.readFileSync(`${B}/${s}.json`)), t=JSON.parse(fs.readFileSync(`${T}/${s}.json`));
  const bm=new Map(b.npcs.map(p=>[p.id,p])), tm=new Map(t.npcs.map(p=>[p.id,p]));
  const added=[...tm.keys()].filter(k=>!bm.has(k)), gone=[...bm.keys()].filter(k=>!tm.has(k));
  const diffs={}; for(const [id,p] of tm){ const q=bm.get(id); if(!q) continue; const a=pick(q), c=pick(p); for(const k of Object.keys(a)) if(a[k]!==c[k]){ (diffs[k]=diffs[k]||[]).push(id);} }
  const rel=(x)=>JSON.stringify(x.relationships||x.npcRelationships||null);
  const relSame=rel(b)===rel(t);
  const line=`${s}: +[${added.join(',')}] -[${gone.join(',')}] rel ${relSame?'same':'DIFF'} | `+Object.entries(diffs).map(([k,v])=>`${k}:${v.length}`).join(' ');
  console.log(line); for(const k of Object.keys(diffs)) tally[k]=(tally[k]||0)+diffs[k].length;
}
console.log('TALLY', JSON.stringify(tally));
