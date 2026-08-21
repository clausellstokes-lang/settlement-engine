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
import {
  nativeSemanticName,
} from '../../domain/content/customContentSemanticAuthority.js';
import {
  isProtectedGenerationEntity,
} from '../../domain/generationOwnership.js';
import { SUBSUMPTION_RULES } from '../../data/institutionLadders.js';

// Compatibility export: callers historically imported the table from this
// step module. The single writer now lives in the side-effect-free data leaf.
export { SUBSUMPTION_RULES } from '../../data/institutionLadders.js';

function instId(name) {
  return `institution.${String(name).replace(/[^a-zA-Z0-9]+/g, '_').replace(/^_+|_+$/g, '').toLowerCase()}`;
}

// Backwards-compatible domain-specific name for callers that operate on
// institution rosters. The actual provenance law is shared with upgrade
// collapse, repair, theme filtering, validation, and certification.
const isProtectedInstitution = isProtectedGenerationEntity;

// `trace` lets re-subsumption sites (cascadePass) keep their own step/result
// labels while sharing this one guarded matcher — the rules table must never
// be applied through a second matcher with different protection semantics.
function applySubsumption(institutions, ctx = null, trace = {}) {
  const { step: traceStep = 'subsumptionPass', result: traceResult = 'subsumed' } = trace;
  const names = institutions.map(
    institution => nativeSemanticName(institution).toLowerCase(),
  );
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

  // Tier 2.1 — emit one trace per subsumption so the rail / AI overlay
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
            reason: `"${inst.name}" was absorbed into "${greaterName}" — the larger institution provides equivalent function.` },
        ],
      });
    }
  }

  const removedNames = [...toRemove].sort((a, b) => b - a).map(idx => institutions.splice(idx, 1)[0].name);
  return removedNames;
}

registerStep('subsumptionPass', {
  deps: ['assembleInstitutions'],
  reads: ['institutions'], // ctx keys this step consumes that another step produces (A+ generators.3 data-flow contract)
  provides: [],
  mutates: ['institutions'], // subsumes/merges roster entries in place (A+ P1.7)
  scratch: ['_subsumed'],     // sets a flag recording what was subsumed
  phase: 'institutions',
}, (ctx) => {
  ctx._subsumed = applySubsumption(ctx.institutions, ctx);
  return {};
});

export { applySubsumption, isProtectedInstitution };
