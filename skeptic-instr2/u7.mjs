import { walkEntry } from '../skepINSTR2/src/domain/prose/entryWalker.js';
import { estateGround, withEntryContext } from '../skepINSTR2/src/domain/prose/entryGround.js';
import { FACTION_ROLES } from '../skepINSTR2/src/generators/factionRoles.js';
import * as ROLE_CATALOG from '../skepINSTR2/src/generators/npc/factionRoleCatalog.js';
import { POWER_ROLES_BY_CATEGORY } from '../skepINSTR2/src/data/historyData.js';
import { ROLE_CATEGORY_KEYWORDS } from '../skepINSTR2/src/generators/roleCategory.js';
import { loadStateLeaves, loadCausalLeaf, loadCrierVoice, loadInFunctionNarratives, poolCells } from '../skepINSTR2/tests/helpers/dossierCorpus.js';
import { composedFillByBlock, fillSites } from '../skepINSTR2/tests/helpers/dossierComposedFill.js';
const roles=new Set();
for (const l of Object.values(FACTION_ROLES)) for (const r of l) if(r.role) roles.add(r.role);
for (const v of Object.values(ROLE_CATALOG)){ if(!Array.isArray(v))continue; for(const r of v){ if(r?.role)roles.add(r.role); if(r?.title)roles.add(r.title);} }
for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)){ if(!Array.isArray(rows))continue; for(const r of rows){ if(r?.role)roles.add(r.role); if(r?.title)roles.add(r.title);} }
for (const l of Object.values(ROLE_CATEGORY_KEYWORDS)) for(const k of l) roles.add(k);
const base = estateGround({ officeRoster:[...roles].sort() });
const leaves = await loadStateLeaves();
const causal = await loadCausalLeaf();
const cells = poolCells([...leaves, ...causal]);
const byBlock = composedFillByBlock(fillSites());
const corpus = [...leaves, ...causal, ...await loadCrierVoice(), ...loadInFunctionNarratives()];
function run(mutate){
  let failing=0; const hits=[];
  for (const e0 of corpus){
    const e = mutate ? { ...e0, text: String(e0.text).replace('every household is counted', 'the households are counted') } : e0;
    const bag = byBlock.get(e.block);
    const r = walkEntry(e, withEntryContext(base, { siblings:(cells.get(e.poolId)||[]).filter(s=>s.id!==e.id), ...(bag?{fill:{declared:[],variantUnion:[],composed:bag.slots}}:{}) }));
    if (r.fails.length) { failing+=1; if(String(e0.text).includes('every household is counted')) hits.push([e0.id, r.fails.map(f=>f.arm)]); }
  }
  return {failing, hits};
}
const a=run(false), b=run(true);
console.log('corpus', corpus.length);
console.log('failing BEFORE the anchor cure:', a.failing);
console.log('failing AFTER  the anchor cure:', b.failing);
console.log('delta', a.failing-b.failing, '| FAILING_FLOOR = 4 | after > 4 ?', b.failing>4);
console.log('the anchor entry fails BEFORE:', JSON.stringify(a.hits));
console.log('the anchor entry fails AFTER :', JSON.stringify(b.hits));
