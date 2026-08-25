/**
 * laneClassifier.js — the §10 two-lane router. Given a proposed constant nudge, decides
 * LANE A (auto-apply, pre-ratified) vs LANE B (proposal-only, owner-signed).
 *
 * THE RULE (DESIGN_ANALYTICS_V2 §10, made executable):
 *   LANE A requires ALL of:
 *     - the constant is a VALID entry in the ratified AUTO_TUNABLE registry;
 *     - the soak battery reported GREEN and NOT golden-shifting for this candidate;
 *     - the proposed value is inside the entry's RANGE;
 *     - the step |proposed − current| is within the entry's MAX-STEP-PER-WEEK;
 *     - the step respects any declared monotone direction.
 *   ANYTHING ELSE → LANE B. In particular a golden-/same-seed-shifting change is ALWAYS
 *   lane B (the GOLDEN LAW), even if it were somehow registered — belt-and-suspenders over
 *   the registry's structural surface/module guards.
 *
 * This module APPLIES NOTHING. It returns a classification (data). The actual lane-A commit
 * is an implementer-agent step in the scheduled routine (§10 MECHANISM), gated behind the
 * owner enabling that routine — never a live-world write (the §7 endogeneity law).
 *
 * PURITY / BUDGET: pure, no side effects, no eager importer. Zero first-paint bytes.
 */

import { AUTO_TUNABLE, validateRegistryEntry } from './autoTunableRegistry.js';

export const LANE_A = 'auto_apply';
export const LANE_B = 'proposal_only';

/**
 * @typedef {{ id?: string, currentValue?: number, proposedValue?: number,
 *   soak?: { green?: boolean, shiftsGolden?: boolean } }} TuningProposal
 *   soak = the EXPERIMENT result (§10 step 3); absent ⇒ not-yet-soaked ⇒ cannot auto-apply.
 */

/**
 * Classify one tuning proposal.
 * @param {TuningProposal} proposal
 * @param {ReadonlyArray<import('./autoTunableRegistry.js').RegistryEntry>} [registry] - the ratified AUTO_TUNABLE registry.
 * @returns {{ lane: 'auto_apply'|'proposal_only', reasons: string[] }}
 */
export function classifyTuningProposal(proposal, registry = AUTO_TUNABLE) {
  const reasons = [];
  const p = proposal && typeof proposal === 'object' ? proposal : /** @type {TuningProposal} */ ({});

  // GOLDEN LAW — a golden/same-seed shift is ALWAYS lane B, no exceptions.
  if (p.soak && p.soak.shiftsGolden === true) {
    return { lane: LANE_B, reasons: ['golden/same-seed-shifting → owner-signed forever (GOLDEN LAW)'] };
  }

  const entry = Array.isArray(registry) ? registry.find(e => e && e.id === p.id) : undefined;
  if (!entry) {
    return { lane: LANE_B, reasons: [`'${p.id}' is not in the ratified auto-tunable registry`] };
  }
  // Defense in depth: never trust a registered entry that isn't actually valid.
  const v = validateRegistryEntry(entry);
  if (!v.ok) return { lane: LANE_B, reasons: [`registry entry invalid: ${v.reasons.join('; ')}`] };

  // The soak must have run and been green + non-golden-shifting to auto-apply.
  if (!p.soak || p.soak.green !== true) reasons.push('soak battery not green (or not run)');

  const cur = Number(p.currentValue);
  const next = Number(p.proposedValue);
  if (!Number.isFinite(next)) reasons.push('proposedValue is not finite');
  else {
    const [min, max] = entry.range;
    if (next < min || next > max) reasons.push(`proposedValue ${next} outside range [${min}, ${max}]`);
    if (Number.isFinite(cur)) {
      const stepMag = Math.abs(next - cur);
      if (stepMag > entry.maxStepPerWeek) reasons.push(`step ${stepMag} exceeds maxStepPerWeek ${entry.maxStepPerWeek}`);
      if (entry.monotoneDir === 'up' && next < cur) reasons.push('monotone up-only: proposed value decreases');
      if (entry.monotoneDir === 'down' && next > cur) reasons.push('monotone down-only: proposed value increases');
    }
  }

  return reasons.length === 0 ? { lane: LANE_A, reasons: [] } : { lane: LANE_B, reasons };
}
