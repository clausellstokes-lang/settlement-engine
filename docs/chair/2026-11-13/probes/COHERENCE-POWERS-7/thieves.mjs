// node thieves.mjs <tree> <corpus...>: NPCs whose secret/goal names a thieves' guild in a town that has none
import { recs } from './rd.mjs'; import path from 'node:path';
const T=path.resolve(process.argv[2]);
const { crimeSignalOf } = await import(T+'/src/domain/crimeSignal.js');
let towns=0, hits=0; const byKind={};
for (const f of process.argv.slice(3)) for await (const {seed,s} of recs(f)) {
  const facs=s.powerStructure?.factions||[]; const insts=s.institutions||[];
  const sig=crimeSignalOf({seats:facs, estate:insts});
  const has=[...facs.map(x=>x.faction), ...sig.factions, ...sig.houses].some(n=>/thie|criminal guild/i.test(String(n||'')));
  if (has) continue;
  let t=0;
  for (const n of s.npcs||[]) { const txt=[n.secret?.what, typeof n.goal==='string'?n.goal:n.goal?.short].join(' | ');
    if (/thie[vf]/i.test(txt) && /guild/i.test(txt)) { t++; hits++; const k=`${n.id?.replace(/_[0-9a-z]{4,}$/,'')} :: ${n.role} :: ${n.title||''}`; byKind[k]=(byKind[k]||0)+1; console.log(seed, n.id, '|', n.role, '|', n.title, '|', (n.secret?.what||'').slice(0,90), '| crime:', sig.present); } }
  if (t) towns++;
}
console.log('towns', towns, 'npcs', hits); console.log(byKind);
