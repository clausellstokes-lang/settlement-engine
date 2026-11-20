import { recs } from './rd.mjs';
let n=0, t=0; const ex=[];
for (const f of process.argv.slice(2)) for await (const {seed,s} of recs(f)) { const ps=s.powerStructure||{}; const thieves=(ps.factions||[]).find(x=>/thieves/i.test(x.faction)); if(!thieves) continue;
  for (const fa of ps.factions||[]) { if (!String(fa.desc||'').includes('A slow war with the guild')) continue; t++;
    const rel=(ps.factionRelationships||[]).find(r=>{const p=(r.pair||[r.factionA||r.a,r.factionB||r.b]).map(String); return p.includes(fa.faction)&&p.includes(thieves.faction);});
    if (rel && /corrupt|symbio|depend/i.test(String(rel.type||rel.relationshipType))) { n++; ex.push(`${seed} ${fa.faction} ${rel.type||rel.relationshipType}`); } } }
console.log('slowwar with guild present',t,'against a corrupted/symbiotic tie',n, ex.slice(0,8));
