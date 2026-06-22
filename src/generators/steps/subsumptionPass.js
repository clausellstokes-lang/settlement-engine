/**
 * Step 6: subsumptionPass
 *
 * Removes lesser institutions when greater ones are present
 * (e.g. "banking district" subsumes "money changers").
 *
 * Subsumption pass for the settlement generation pipeline.
 */

import { registerStep } from '../pipeline.js';
import { recordTrace } from '../../domain/trace.js';

function instId(name) {
  return `institution.${String(name).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`;
}

// Rules collapse same-function scale ladders ONLY (a bigger version of the
// same trade replaces the smaller one). Constraints the table must hold:
//   - No rule may let a downstream consumer absorb its upstream producer
//     (smelter/charcoal burner, merchant guild/salt works, butchers/shepherd,
//     harbour master/docks): producers feeding a processor ARE the supply
//     chain — removing them deactivates the chains and export gates keyed on
//     their names. Cross-function adjacency belongs to the cascade pass,
//     which adds institutions instead of removing them.
//   - Lessers are matched by EXACT name (case-insensitive) against the
//     catalog vocabulary; every lesser must be a real catalog name.
//   - A greater must never equal one of its own lessers.
const SUBSUMPTION_RULES = [
  { greater: 'banking district',            lesser: ['banking houses', 'money changers'] },
  { greater: 'banking houses',              lesser: ['money changers'] },
  { greater: 'mages\' guild',               lesser: ['wizard\'s tower', 'alchemist shop'] },
  { greater: 'mages\' district',            lesser: ['wizard\'s tower', 'mages\' guild', 'alchemist shop', 'alchemist quarter'] },
  { greater: 'academy of magic',            lesser: ['wizard\'s tower', 'mages\' guild'] },
  { greater: 'multiple adventurers\' guild', lesser: ['adventurers\' charter hall', 'hireling hall'] },
  { greater: 'adventurers\' guild',          lesser: ['adventurers\' charter hall', 'hireling hall'] },
  { greater: 'cathedral',                   lesser: ['parish church', 'priest (resident)', 'wayside shrine'] },
  { greater: 'major hospital',              lesser: ['small hospital'] },
  { greater: 'professional city watch',     lesser: ['town watch', 'citizen militia'] },
  { greater: 'multiple courthouses',        lesser: ['courthouse'] },
  { greater: 'major port',                  lesser: ['docks/port facilities', 'river boatyard', 'river ferry'] },
  { greater: 'craft guilds (30-80)',         lesser: ['craft guilds (5-15)'] },
  { greater: 'craft guilds (100-150+)',      lesser: ['craft guilds (30-80)', 'craft guilds (5-15)'] },
  { greater: 'merchant guilds (15-40)',      lesser: ['merchant guilds (3-8)'] },
  { greater: 'merchant guilds (50-100+)',    lesser: ['merchant guilds (15-40)', 'merchant guilds (3-8)'] },
  { greater: 'thieves\' guild chapter',      lesser: ['fence (word of mouth)', 'local fence', 'bandit affiliate'] },
  { greater: 'black market',                lesser: ['fence (word of mouth)', 'local fence'] },
  { greater: 'brewery',                     lesser: ['brewer'] },
  { greater: "cobbler's guild",             lesser: ['cobbler'] },
  { greater: "tailor's guild",              lesser: ['tailor'] },
  { greater: 'mint (official)',             lesser: ['mint', 'assay office'] },
  { greater: 'stable district',             lesser: ['stable master', 'stable yard'] },
  { greater: 'fish market',                 lesser: ['fishmonger'] },
  { greater: "furrier's district",          lesser: ['tannery'] },
  { greater: "assassins' guild",            lesser: ['contract killer', 'hired blades'] },
  { greater: "thieves' guild (powerful)",   lesser: ["thieves' guild chapter", 'black market bazaar', 'contract killer'] },
  { greater: 'auction house',              lesser: ['slave market'] },
  { greater: 'gladiatorial school',        lesser: ['fighting pits'] },
  { greater: 'printing house',             lesser: ['village scribe'] },
  { greater: 'great library',              lesser: ['village scribe', 'printing house'] },
  { greater: 'banking houses',             lesser: ['pawnbroker'] },
  { greater: 'banking district',           lesser: ['pawnbroker', 'banking houses'] },
  { greater: 'major hospital',              lesser: ['almshouse'] },
  { greater: 'hospital network',             lesser: ['almshouse', 'foundling home'] },
  { greater: "caravan masters' exchange",    lesser: ["caravaneer's post", 'waystation', 'pack animal trader'] },
  { greater: "caravaneer's post",            lesser: ['waystation', 'pack animal trader'] },
  { greater: 'international trade center',  lesser: ["caravan masters' exchange", "caravaneer's post"] },
  { greater: 'luxury goods quarter',        lesser: ['jeweller'] },
  { greater: 'specialized metalworkers',    lesser: ['jeweller'] },
];

// Exported for re-use in cascadePass
export { SUBSUMPTION_RULES };

// Institutions a subsumption rule may never delete. Tier-required entries,
// DM force-toggles, and user-authored customs are contract with the DM —
// subsumption only collapses redundancy among *generated* institutions.
const PROTECTED_SOURCES = new Set(['required', 'forced', 'custom']);

function isProtectedInstitution(inst) {
  return inst?.required === true || PROTECTED_SOURCES.has(inst?.source);
}

// `trace` lets re-subsumption sites (cascadePass) keep their own step/result
// labels while sharing this one guarded matcher — the rules table must never
// be applied through a second matcher with different protection semantics.
function applySubsumption(institutions, ctx = null, trace = {}) {
  const { step: traceStep = 'subsumptionPass', result: traceResult = 'subsumed' } = trace;
  const names = institutions.map(i => i.name.toLowerCase());
  const toRemove = new Set();
  // Track which `greater` triggered each removal so the trace can name
  // the actual reason ("subsumed by Banking District") rather than just
  // "subsumed."
  const subsumedBy = new Map();
  SUBSUMPTION_RULES.forEach(({ greater, lesser }) => {
    const g = greater.toLowerCase();
    // Greaters match by substring so tier-suffixed catalog variants count
    // ("Cathedral (10,000+ only)" satisfies greater 'cathedral'). The
    // matched indices are immune to this rule's removals: an institution
    // can never be subsumed into itself.
    const greaterIdxs = new Set();
    names.forEach((n, idx) => { if (n.includes(g)) greaterIdxs.add(idx); });
    if (greaterIdxs.size === 0) return;
    lesser.forEach(l => {
      const lc = l.toLowerCase();
      institutions.forEach((inst, idx) => {
        // Lessers match by EXACT name: substring matching also caught the
        // greater itself ("Brewery" contains 'brewer') and independent
        // scale variants ("Parish churches (10-30)" contains 'parish
        // church'), deleting institutions the rule never meant.
        if (names[idx] !== lc) return;
        if (greaterIdxs.has(idx)) return;
        if (isProtectedInstitution(inst)) return;
        toRemove.add(idx);
        if (!subsumedBy.has(idx)) subsumedBy.set(idx, greater);
      });
    });
  });

  // Emit one trace per subsumption so the rail / AI overlay
  // can explain why a smaller institution disappeared. The "greater"
  // institution is recorded as the cause; the lesser is the target.
  if (ctx) {
    for (const idx of toRemove) {
      const inst = institutions[idx];
      if (!inst) continue;
      const greaterName = subsumedBy.get(idx);
      recordTrace(ctx, {
        targetType: 'institution',
        targetId:   instId(inst.name),
        step:       traceStep,
        result:     traceResult,
        causes: [
          { source: instId(greaterName || 'unknown'),
            effect: 'absorbed',
            reason: `"${inst.name}" was absorbed into "${greaterName}". The larger institution provides equivalent function.` },
        ],
      });
    }
  }

  const removedNames = [...toRemove].sort((a, b) => b - a).map(idx => institutions.splice(idx, 1)[0].name);
  return removedNames;
}

registerStep('subsumptionPass', {
  deps: ['assembleInstitutions'],
  reads: ['institutions'], // ctx keys this step consumes that another step produces
  provides: [],
  mutates: ['institutions'], // subsumes/merges roster entries in place
  scratch: ['_subsumed'],     // sets a flag recording what was subsumed
  phase: 'institutions',
}, (ctx) => {
  ctx._subsumed = applySubsumption(ctx.institutions, ctx);
  return {};
});

export { applySubsumption, isProtectedInstitution };
