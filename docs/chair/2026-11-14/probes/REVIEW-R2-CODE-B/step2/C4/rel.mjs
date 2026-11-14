import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [f,tree,want]=process.argv.slice(2);
const { relationshipsDeskLists } = await import(tree+'/src/domain/display/stateProse/relationshipsDeskRead.js');
const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const tally={};
for await(const l of rl){ const {seed,s:r}=JSON.parse(l); if(want && !new RegExp(want).test(seed)) continue;
  const L=relationshipsDeskLists(r); const rels=Array.isArray(r.relationships)?r.relationships:[]; const conflicts=Array.isArray(r.conflicts)?r.conflicts:[];
  const hasAny=L.neighbours.length>0||rels.length>0||conflicts.length>0; if(hasAny) continue;
  const ct=(r.history?.currentTensions||[]); const rc=r.powerStructure?.recentConflict;
  const els=(ct.length>0)||!!rc; const k=(els?'short':'full')+' '+r.tier; tally[k]=(tally[k]||0)+1;
  if(want) console.log(seed, r.tier, els?'SHORT':'FULL', '| tensions:', JSON.stringify(ct.map(t=>t.description||t.title||t.type||t).slice(0,3)).slice(0,300), '| recent:', JSON.stringify(rc)?.slice(0,200), '| ISR', (r.interSettlementRelationships||[]).length);
}
console.log(tally);
