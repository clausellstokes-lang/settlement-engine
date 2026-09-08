import { walkEntry } from '../laneINSTR/src/domain/prose/entryWalker.js';
import { estateGround, withEntryContext } from '../laneINSTR/src/domain/prose/entryGround.js';
import * as C from '../laneINSTR/tests/helpers/dossierCorpus.js';
const R='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR';
const cat = await import(`file://${R}/src/generators/npc/factionRoleCatalog.js`);
const fr = await import(`file://${R}/src/generators/factionRoles.js`);
const roles=new Set(); for (const a of Object.values(fr.FACTION_ROLES||{})) for (const r of a) if(r.role) roles.add(r.role);
for (const v of Object.values(cat)) if(Array.isArray(v)) for(const r of v){if(r?.role)roles.add(r.role);if(r?.title)roles.add(r.title);}
const base = estateGround({officeRoster:[...roles]});
const all = [...await C.loadStateLeaves(), ...await C.loadCausalLeaf()];
for (const e of all) for (const f of walkEntry(e, withEntryContext(base,{})).fails)
  if (f.klass==='D' && f.arm.includes('declare')) console.log(`${e.id.slice(0,52).padEnd(52)} names={${f.clause}} declared={${f.value}} :: ${e.text.slice(0,70)}`);
