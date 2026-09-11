import { walkEntry } from '../skepINSTR2/src/domain/prose/entryWalker.js';
import { estateGround, withEntryContext } from '../skepINSTR2/src/domain/prose/entryGround.js';
import { FACTION_ROLES } from '../skepINSTR2/src/generators/factionRoles.js';
import * as ROLE_CATALOG from '../skepINSTR2/src/generators/npc/factionRoleCatalog.js';
import { POWER_ROLES_BY_CATEGORY } from '../skepINSTR2/src/data/historyData.js';
import { ROLE_CATEGORY_KEYWORDS } from '../skepINSTR2/src/generators/roleCategory.js';
import { loadCrierVoice, loadInFunctionNarratives, loadStateLeaves, loadStateAnnex, joinAnnexToLeaves } from '../skepINSTR2/tests/helpers/dossierCorpus.js';

const narrow=new Set();
for (const l of Object.values(FACTION_ROLES)) for (const r of l) if (r.role) narrow.add(r.role);
for (const v of Object.values(ROLE_CATALOG)) { if(!Array.isArray(v))continue; for(const r of v){ if(r?.role)narrow.add(r.role); if(r?.title)narrow.add(r.title);} }
const power=new Set(narrow);
for (const rows of Object.values(POWER_ROLES_BY_CATEGORY)) { if(!Array.isArray(rows))continue; for(const r of rows){ if(r?.role)power.add(r.role); if(r?.title)power.add(r.title);} }
const wide=new Set(power);
for (const l of Object.values(ROLE_CATEGORY_KEYWORDS)) for (const k of l) wide.add(k);

const leaves = await loadStateLeaves();
const annex = joinAnnexToLeaves(loadStateAnnex(), leaves).joined;
const corpus = [...leaves, ...await loadCrierVoice(), ...loadInFunctionNarratives(), ...annex];
console.log('corpus entries', corpus.length);
const OFFICE='an office the world does not hold';
function census(roster,label){
  const g = estateGround({ officeRoster: [...roster].sort() });
  const rows=[];
  for (const e of corpus){
    const r = walkEntry(e, withEntryContext(g, {}));
    for (const f of r.fails) if (f.arm===OFFICE) rows.push({id:e.id||e.line||'?', word:f.word||f.value||'', text:(e.text||'').slice(0,70)});
  }
  console.log(label,'roster',roster.size,'C2-office fails',rows.length);
  for (const r of rows) console.log('   ', r.id, '|', r.text.replace(/\s+/g,' '));
  return rows;
}
const a=census(narrow,'NARROW(35)');
const b=census(power,'ROLES-ONLY(no keywords)');
const c=census(wide,'WIDE(249)');
const idb=new Set(b.map(r=>r.id+r.text)); const idc=new Set(c.map(r=>r.id+r.text));
console.log('\nHIDDEN BY THE KEYWORD HALF (fail on roles-only, pass on wide):');
for (const r of b) if(!idc.has(r.id+r.text)) console.log('   ', r.id,'|',r.text.replace(/\s+/g,' '));
