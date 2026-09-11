import { walkEntry, verdictOf } from '../laneINSTR/src/domain/prose/entryWalker.js';
import { estateGround, withEntryContext } from '../laneINSTR/src/domain/prose/entryGround.js';
import * as C from '../laneINSTR/tests/helpers/dossierCorpus.js';
import { fillSites, composedFillByBlock } from '../laneINSTR/tests/helpers/dossierComposedFill.js';
const cat = await import('file:///private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR/src/generators/npc/factionRoleCatalog.js');
const fr = await import('file:///private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneINSTR/src/generators/factionRoles.js');
const roles = new Set();
for (const arr of Object.values(fr.FACTION_ROLES || {})) for (const r of arr) if (r.role) roles.add(r.role);
for (const v of Object.values(cat)) if (Array.isArray(v)) for (const r of v) { if (r?.role) roles.add(r.role); if (r?.title) roles.add(r.title); }
const base = estateGround({ officeRoster: [...roles] });
const byBlock = composedFillByBlock(fillSites());

const r1 = await C.loadStateLeaves();
const r2 = await C.loadCausalLeaf();
const r5 = await C.loadCrierVoice();
const fd = C.loadInFunctionNarratives();
const cells = C.poolCells([...r1, ...r2]);

const tally = new Map(); const armTally = new Map();
let fails=0, withheld=0, notes=0, nexec=0, entries=0;
const failing = [];
const run = (list, withCells) => {
  for (const e of list) {
    const siblings = withCells ? (cells.get(e.poolId)||[]).filter(x=>x.id!==e.id) : [];
    const bag = byBlock.get(e.block);
    const g = withEntryContext(base, { siblings, ...(bag ? { fill: { declared: [], variantUnion: [], composed: bag.slots } } : {}) });
    const r = walkEntry(e, g);
    entries++; fails += r.fails.length; withheld += r.withheld.length; notes += r.notes.length; nexec += r.notExecutable.length;
    for (const f of r.fails) { tally.set(f.klass,(tally.get(f.klass)||0)+1); armTally.set(f.klass+' · '+f.arm,(armTally.get(f.klass+' · '+f.arm)||0)+1); }
    if (r.fails.length) failing.push({e, r});
  }
};
run(r1, true); run(r2, true); run(r5, false); run(fd, false);
console.log(`entries walked ${entries} | FAIL findings ${fails} on ${failing.length} entries (${(failing.length/entries*100).toFixed(1)}%) | WITHHELD ${withheld} | NOTE ${notes} | NOT-EXECUTABLE ${nexec}`);
console.log('\nby class:', [...tally].sort((a,b)=>b[1]-a[1]).map(([k,v])=>`${k}=${v}`).join('  '));
console.log('\nby arm:'); for (const [k,v] of [...armTally].sort((a,b)=>b[1]-a[1])) console.log(`  ${String(v).padStart(5)}  ${k}`);
console.log('\n=== THE FOUR LIVE BREACHES ===');
const breaches = [
  ['newsVoice.js:97', r5.find(e=>e.text.includes('every household is counted for the levy'))],
  ['general.generated.js leaf twin', r1.find(e=>e.text.includes('the same trades exempt'))],
  ['factionDynamics.js:466', fd.find(e=>e.text.includes('Church land exemptions'))],
];
for (const [label, e] of breaches) {
  if (!e) { console.log(`  ${label}: ENTRY NOT FOUND`); continue; }
  const siblings = (cells.get(e.poolId)||[]).filter(x=>x.id!==e.id);
  const r = walkEntry(e, withEntryContext(base, { siblings }));
  console.log(`  ${label} [${e.id}] -> ${verdictOf(r)}  ${r.fails.map(f=>f.klass+'/'+f.arm).join(' ; ')||'NO FAIL'}`);
}
const annex = C.joinAnnexToLeaves(C.loadStateAnnex(), r1).joined.find(e=>e.line===5233);
const ra = walkEntry(annex, withEntryContext(base, {}));
console.log(`  annex :5233 [${annex.id}] -> ${verdictOf(ra)}  ${ra.fails.map(f=>f.klass+'/'+f.arm).join(' ; ')||'NO FAIL'}`);
console.log('\n=== sample of failing entries (10) ===');
for (const {e,r} of failing.slice(0,10)) console.log(` ${e.register} ${e.id.slice(0,54).padEnd(54)} ${r.fails.map(f=>f.klass).join(',')}  :: ${e.text.slice(0,70)}`);
