/**
 * generosityUpdates.js — the generosity mover's settlementUpdates APPLICATORS (extracted leaf).
 *
 * The three conserved per-settlement delta applicators the generosity mover
 * (worldPulse/generosityKernel.js) folds onto its returned settlementUpdates at the end of a
 * tick: the relief/sale GRAIN deltas (the calamity idiom), the §9 LEGITIMACY→COUP score
 * deltas, and the PURCHASE prosperity BAND-STEP deltas. Extracted VERBATIM from the kernel
 * (behaviour-preserving — the generosity goldens stay byte-identical) to keep the hot mover
 * under its 800 effective-line ceiling (design DEEP_COUPLINGS §1 law 8: new engine logic
 * rides a lazy sibling leaf, never a kernel edit at ceiling).
 *
 * Lazy leaf: imported ONLY by the (lazy) generosity mover ⇒ zero eager first-paint bytes.
 * Pure, deterministic, side-effect-free (each returns a NEW settlementUpdates array or the
 * input unchanged when nothing moved); imports NO store/React (the layerBoundaries law).
 */

import { storageCapacityMonths } from './foodStockpile.js';
import { PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';

// ── Kernel-mirrored read-shapes (0-hole discipline: no `any`) ──────────────────
/** @typedef {{ _deityRef?: unknown, alignmentAxis?: string, lawAxis?: string }} GenDeity */
/** @typedef {{ name?: unknown, type?: unknown, category?: unknown }} GenInstitution */
/** @typedef {{ faction?: unknown, category?: unknown, power?: unknown }} GenFaction */
/** @typedef {{ population?: number, institutions?: GenInstitution[],
 *   economicState?: { foodSecurity?: { storageMonths?: unknown }, economicBase?: unknown, primaryIndustry?: unknown, prosperity?: unknown },
 *   powerStructure?: { factions?: GenFaction[] },
 *   config?: { primaryDeitySnapshot?: GenDeity|null, economicBase?: unknown } }} GenSettlement */
/** @typedef {{ saveId?: (string|number), settlement?: GenSettlement }} GenUpdate */

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** Narrow a kernel-local read-shape settlement to the food module's SimSettlement param. */
/** @param {GenSettlement|undefined} s @returns {Parameters<typeof storageCapacityMonths>[0]} */
function asSimSettlement(s) {
  return /** @type {Parameters<typeof storageCapacityMonths>[0]} */ (/** @type {unknown} */ (s));
}

/**
 * Apply the conserved per-settlement storageMonths deltas to settlementUpdates (clamped to
 * [0, granary capacity], rounded to the tenth-month — the applyFoodStockpileOutcome idiom).
 * @param {GenUpdate[]} updates @param {Map<string, number>} updateIndex @param {Map<string, number>} foodDeltas
 * @returns {GenUpdate[]}
 */
export function applyFoodDeltasToUpdates(updates, updateIndex, foodDeltas) {
  let next = updates;
  let cloned = false;
  for (const [id, delta] of foodDeltas) {
    if (!delta) continue;
    const ui = updateIndex.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = entry?.settlement;
    const fs = settlement?.economicState?.foodSecurity;
    if (!fs || !Number.isFinite(Number(fs.storageMonths))) continue;
    const cap = storageCapacityMonths(asSimSettlement(settlement));
    const nextMonths = Math.round(Math.max(0, Math.min(cap, Number(fs.storageMonths) + delta)) * 10) / 10;
    if (nextMonths === Number(fs.storageMonths)) continue;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = {
      ...entry,
      settlement: {
        ...settlement,
        economicState: { ...settlement.economicState, foodSecurity: { ...fs, storageMonths: nextMonths } },
      },
    };
  }
  return next;
}

/**
 * Apply the bounded per-giver publicLegitimacy.score deltas to settlementUpdates (§9): a
 * hungry giver's ruler loses legitimacy for shipping food out, a comfortable one gains a
 * small "granary city" lift. Integer, clamped [0,100] (the applyDivineMandate idiom); SKIPS
 * a legacy bare-number or absent legitimacy (only nudges a structured {score}). Pure.
 * @param {GenUpdate[]} updates @param {Map<string, number>} updateIndex @param {Map<string, number>} legitimacyDeltas
 * @returns {GenUpdate[]}
 */
export function applyLegitimacyDeltasToUpdates(updates, updateIndex, legitimacyDeltas) {
  let next = updates;
  let cloned = false;
  for (const [id, delta] of legitimacyDeltas) {
    if (!delta) continue;
    const ui = updateIndex.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = entry?.settlement;
    if (!settlement) continue;
    const ps = asObject(settlement.powerStructure);
    const plRaw = ps.publicLegitimacy;
    const pl = plRaw && typeof plRaw === 'object' && !Array.isArray(plRaw)
      ? /** @type {Record<string, unknown>} */ (plRaw) : null;
    if (!pl || !Number.isFinite(Number(pl.score))) continue;
    const nextScore = Math.round(Math.max(0, Math.min(100, Number(pl.score) + delta)));
    if (nextScore === Number(pl.score)) continue;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = /** @type {GenUpdate} */ ({
      ...entry,
      settlement: /** @type {GenSettlement} */ (/** @type {unknown} */ ({
        ...settlement,
        powerStructure: { ...ps, publicLegitimacy: { ...pl, score: nextScore } },
      })),
    });
  }
  return next;
}

/**
 * Apply the PURCHASE payment prosperity BAND-STEP deltas to settlementUpdates (§4/A2 — E1d):
 * a buyer's band-step debit + a bounded seller income nudge, both ranked on the canonical
 * PROSPERITY_TIERS ladder (data/constants — never a hand-typed band match), clamped [0,6], and
 * written back IN KIND (a string label stays a string; a { tier } object keeps its shape). A
 * settlement with no readable prosperity band (numeric/absent ⇒ rank −1) is SKIPPED. Because
 * the ladder is coarse, a single sale's sub-band nudge often rounds to no change; a settlement
 * that sells to several buyers in one tick accumulates its credits and CAN step up a band (the
 * "granary city grows rich on volume" story). Pure.
 * @param {GenUpdate[]} updates @param {Map<string, number>} updateIndex @param {Map<string, number>} prosperityDeltas
 * @returns {GenUpdate[]}
 */
export function applyProsperityDeltasToUpdates(updates, updateIndex, prosperityDeltas) {
  let next = updates;
  let cloned = false;
  const maxRank = Math.max(1, PROSPERITY_TIERS.length - 1);
  for (const [id, delta] of prosperityDeltas) {
    if (!delta) continue;
    const ui = updateIndex.get(String(id));
    if (ui === undefined) continue;
    const entry = next[ui];
    const settlement = entry?.settlement;
    const ec = asObject(settlement?.economicState);
    const cur = ec.prosperity;
    const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (cur));
    if (rank < 0) continue; // no readable band (numeric/absent) — nothing to step
    const nextRank = Math.round(Math.max(0, Math.min(maxRank, rank + delta)));
    if (nextRank === rank) continue;
    const nextLabel = PROSPERITY_TIERS[nextRank];
    // Preserve the field shape (string label vs { tier } object).
    const nextProsperity = cur && typeof cur === 'object' && !Array.isArray(cur)
      ? { .../** @type {Record<string, unknown>} */ (cur), tier: nextLabel } : nextLabel;
    if (!cloned) { next = updates.slice(); cloned = true; }
    next[ui] = /** @type {GenUpdate} */ ({
      ...entry,
      settlement: /** @type {GenSettlement} */ (/** @type {unknown} */ ({
        ...settlement, economicState: { ...ec, prosperity: nextProsperity },
      })),
    });
  }
  return next;
}
