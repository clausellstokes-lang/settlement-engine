import { walkEntry } from '../laneINSTR/src/domain/prose/entryWalker.js';
import { estateGround, withEntryContext } from '../laneINSTR/src/domain/prose/entryGround.js';
import * as C from '../laneINSTR/tests/helpers/dossierCorpus.js';
import { fillSites, composedFillByBlock } from '../laneINSTR/tests/helpers/dossierComposedFill.js';
const R='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR';
const cat = await import(`file://${R}/src/generators/npc/factionRoleCatalog.js`);
const fr = await import(`file://${R}/src/generators/factionRoles.js`);
const roles=new Set(); for (const a of Object.values(fr.FACTION_ROLES||{})) for (const r of a) if(r.role) roles.add(r.role);
for (const v of Object.values(cat)) if(Array.isArray(v)) for(const r of v){if(r?.role)roles.add(r.role);if(r?.title)roles.add(r.title);}
const base = estateGround({officeRoster:[...roles]});
const byBlock = composedFillByBlock(fillSites());
const r1 = await C.loadStateLeaves(); const r2 = await C.loadCausalLeaf();
const cells = C.poolCells([...r1,...r2]);
const buckets = new Map();
for (const e of [...r1,...r2]) {
  const bag = byBlock.get(e.block);
  const g = withEntryContext(base,{siblings:(cells.get(e.poolId)||[]).filter(x=>x.id!==e.id), ...(bag?{fill:{declared:[],variantUnion:[],composed:bag.slots}}:{})});
  for (const f of walkEntry(e,g).fails) { const k=f.klass+' · '+f.arm; if(!buckets.has(k))buckets.set(k,[]); buckets.get(k).push({e,f}); }
}
const want = process.argv[2];
for (const [k,list] of buckets) {
  if (want && !k.includes(want)) continue;
  console.log(`\n######## ${k}  (${list.length})`);
  for (const {e,f} of list.slice(0,8)) console.log(`  ${e.id.slice(0,50).padEnd(50)} val="${f.value}"  :: ${e.text.slice(0,95)}`);
}
