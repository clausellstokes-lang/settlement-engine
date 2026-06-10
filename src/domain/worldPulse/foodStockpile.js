/**
 * domain/worldPulse/foodStockpile.js — the granary finally moves.
 *
 * storageMonths was generation-frozen: sieges never drained it, surpluses
 * never refilled it. This module makes it a conserved, tick-advanced stock
 * with three behaviors (the design qualifiers):
 *
 *   1. SURPLUS FILLS. A food-surplus settlement banks a fraction of the
 *      surplus each tick, capped by its granary infrastructure (same tier
 *      table the generator uses — a thorp without a granary can't hoard a
 *      year of grain in its root cellars).
 *   2. RESERVE TITHE. In a MILD deficit with low stores, a small tithe of
 *      production/imports still goes into storage — visibly DEEPENING the
 *      effective deficit (seed corn is sacred; the lord's granary gets
 *      filled while tables get thinner). The tithe stops once stores reach
 *      the security floor or the deficit turns severe.
 *   3. DRAWDOWN CALMS. A real deficit draws stored food down to relieve it —
 *      rationed: release targets the 'Pressured' band rather than zero, and
 *      never spends more than half the remaining stores in one tick, so a
 *      12-month state granary is a multi-tick story arc, not a one-tick
 *      eraser.
 *
 * Sieges/occupations couple in: an active blockade cuts the import share of
 *  need, which lands on the effective deficit — so a siege literally eats
 * the granary, and the siege counterforce (which reads storageMonths) weakens
 * as the stores drain. Wars of attrition are now arithmetic.
 *
 * Bookkeeping: the STRUCTURAL deficit/surplus (what production physics say)
 * is stashed once as `stockpile.baseDeficitPct`/`baseSurplusPct`; each tick
 * recomputes the effective ledger numbers from that base so relief never
 * compounds into the next tick's input.
 *
 * Pure + deterministic; no rng, no Date.
 */

import { foodLedger } from '../foodLedger.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, Number.isFinite(v) ? v : lo));
const round1 = v => Math.round(v * 10) / 10;
// Storage moves in small steps (a one-month tithe is 0.03 months of food) —
// one-decimal rounding would silently erase them.
const round2 = v => Math.round(v * 100) / 100;

const INTERVAL_MONTHS = Object.freeze({
  one_week: 0.25,
  one_month: 1,
  one_season: 3,
  one_year: 12,
});

export const STOCKPILE_TUNING = Object.freeze({
  fillRate: 0.6,                // fraction of the surplus that actually reaches storage
  reserveTitheDeficitCap: 25,   // tithe only under MILD deficits (below this %)
  reserveTitheFloorMonths: 1,   // tithe only while stores sit below this floor
  reserveTithePct: 3,           // the tithe deepens the visible deficit by this much
  rationFloorPct: 5,            // drawdown aims at 'Pressured', not zero — rationing
  maxReleaseFraction: 0.5,      // never spend more than half the stores in one tick
  blockadeSeverityGate: 0.4,    // siege/occupation severity that cuts imports
  famineSeverityGate: 0.3,      // famine severity below this is ambient scarcity, not crop failure
  famineDeficitScale: 45,       // a full-severity famine cuts ~45% of need (production failure)
});

const ACTIVE_STAGES = new Set(['active', 'emerging', 'peaking', 'easing']);
const BLOCKADE_TYPES = new Set(['siege', 'occupation']);

// ── Live resilience ──────────────────────────────────────────────────────
// resilienceScore is a generation-time composite (foodGenerator): storage
// months (up to ~35 pts) + source diversity (30) + import independence (15)
// + current adequacy (20). The non-storage slices are STRUCTURAL — chains
// and routes don't change by playing — but the storage slice describes the
// granary, which now fills and drains every tick. So the storage slice is
// re-graded live: stash the non-storage remainder once (resilienceRest),
// then each tick resilience = rest + storageComponent(current months).
// A town that ate its granary through a siege is no longer "resilient",
// and three fat harvests actually buy something.
const RESILIENCE_STORAGE_POINTS = 35;       // mirrors foodGenerator's storage slice
const RESILIENCE_STORAGE_FULL_MONTHS = 12;  // …at months/12 scaling

function resilienceStorageComponent(months) {
  return (clamp(months, 0, 24) / RESILIENCE_STORAGE_FULL_MONTHS) * RESILIENCE_STORAGE_POINTS;
}

/**
 * Storage capacity in months, mirroring the generator's granary tier table
 * (foodGenerator baseStorage) so play-time refills can't exceed what the
 * infrastructure could ever have held.
 */
export function storageCapacityMonths(settlement) {
  const names = (settlement?.institutions || []).map(i => String(i?.name || '').toLowerCase());
  const has = (...fragments) => names.some(n => fragments.some(f => n.includes(f)));
  const tier = String(settlement?.tier || 'village');
  const base = has('state granary') ? (tier === 'metropolis' ? 12 : 8)
    : has('city granari') ? (tier === 'city' ? 7 : 5)
    : has('granary') ? (tier === 'town' ? 5 : tier === 'village' ? 3.5 : 2.5)
    : (['thorp', 'hamlet'].includes(tier) ? 1.5 : 2.0);
  return round1(has('mill') ? base * 1.25 : base);
}

/** The active blockade (siege/occupation) gripping a settlement, if any. */
export function blockadeFor(worldStateStressors = [], settlementId) {
  const sid = String(settlementId);
  return (worldStateStressors || []).find(s =>
    BLOCKADE_TYPES.has(s?.type)
    && ACTIVE_STAGES.has(s.lifecycleStage || 'active')
    && (s.severity ?? 0) >= STOCKPILE_TUNING.blockadeSeverityGate
    && (s.affectedSettlementIds || []).map(String).includes(sid)) || null;
}

/**
 * The active CAMPAIGN-EMERGENT famine stressor gripping a settlement, if any.
 * Deliberately stressor-based, never condition-based: a settlement GENERATED
 * mid-famine already has the crop failure baked into its ledger (foodGenerator
 * multiplies production ×0.35), so reading conditions here would double-count.
 * The roaming famine stressor is never generation-baked — it is exactly the
 * famine that arrives during play, which the frozen ledger knows nothing about.
 */
export function famineFor(worldStateStressors = [], settlementId) {
  const sid = String(settlementId);
  return (worldStateStressors || []).find(s =>
    s?.type === 'famine'
    && ACTIVE_STAGES.has(s.lifecycleStage || 'active')
    && (s.severity ?? 0) >= STOCKPILE_TUNING.famineSeverityGate
    && (s.affectedSettlementIds || []).map(String).includes(sid)) || null;
}

/**
 * Advance the settlement's food stockpile one tick.
 *
 * @param {Object} settlement
 * @param {{ interval?: string, tick?: number, blockade?: any, famine?: any }} [options]
 * @returns {{ settlement: Object, changed: boolean,
 *            summary: { storageMonths: number, effectiveDeficitPct: number,
 *                       reliefPct: number, tithed: boolean, blockaded: boolean,
 *                       famished: boolean } | null }}
 */
export function advanceFoodStockpile(settlement, { interval = 'one_month', tick = 0, blockade = null, famine = null } = {}) {
  const ledger = foodLedger(settlement);
  if (!ledger.present) return { settlement, changed: false, summary: null };
  const fs = settlement.economicState?.foodSecurity || {};
  const months = INTERVAL_MONTHS[interval] ?? 1;
  const cap = storageCapacityMonths(settlement);
  const T = STOCKPILE_TUNING;

  // Structural base: what production physics say, independent of past relief.
  const baseDeficitPct = clamp(fs.stockpile?.baseDeficitPct ?? ledger.deficitPct, 0, 95);
  const baseSurplusPct = clamp(fs.stockpile?.baseSurplusPct ?? ledger.surplusPct, 0, 200);
  // Non-storage remainder of the resilience composite, stashed on first touch
  // from the PRE-clamp generated months (so the subtraction matches what the
  // generator originally added).
  const resilienceRest = Number.isFinite(fs.stockpile?.resilienceRest)
    ? fs.stockpile.resilienceRest
    : clamp(ledger.resilienceScore - resilienceStorageComponent(ledger.storageMonths), 0, 100);

  let storage = clamp(ledger.storageMonths, 0, cap);
  let tithed = false;
  let reliefPct = 0;

  // A blockade cuts the IMPORT share of need; a campaign-emergent famine
  // cuts PRODUCTION (severity-scaled, up to famineDeficitScale% of need —
  // the dynamic analog of generation's ×0.35 production multiplier). Both
  // land on the effective deficit, both get answered by the drawdown: the
  // famine eats the granary exactly the way the siege does, and a town
  // suffering both (the Starving City) drains twice as fast.
  const blockaded = !!blockade;
  const famished = !!famine;
  const blockadePct = blockaded ? clamp(ledger.importDependency, 0, 1) * 100 : 0;
  const faminePct = famished
    ? clamp(famine.severity ?? 0, 0, 1) * T.famineDeficitScale
    : 0;
  let effectiveDeficit = clamp(baseDeficitPct + blockadePct + faminePct, 0, 95);

  if (effectiveDeficit <= 0) {
    // 1. Surplus fills, capped by the granary infrastructure.
    storage = Math.min(cap, storage + months * (baseSurplusPct / 100) * T.fillRate);
  } else if (storage < T.reserveTitheFloorMonths && effectiveDeficit < T.reserveTitheDeficitCap) {
    // 2. Reserve tithe: mild hardship, empty granary — divert a slice into
    // storage and let the table feel it.
    tithed = true;
    storage = Math.min(cap, storage + months * (T.reserveTithePct / 100));
    effectiveDeficit = clamp(effectiveDeficit + T.reserveTithePct, 0, 95);
  } else if (effectiveDeficit > T.rationFloorPct && storage > 0) {
    // 3. Drawdown: rationed release toward the 'Pressured' band.
    const targetRelief = effectiveDeficit - T.rationFloorPct;          // % of need to cover
    const cost = (targetRelief / 100) * months;                        // months of food it costs
    const available = storage * T.maxReleaseFraction;
    const spend = Math.min(cost, available);
    reliefPct = months > 0 ? (spend / months) * 100 : 0;
    storage -= spend;
    effectiveDeficit = clamp(effectiveDeficit - reliefPct, 0, 95);
  }

  // Live resilience: the storage slice re-graded from the CURRENT granary,
  // on top of the structural remainder (diversity, imports, adequacy).
  const resilienceScore = Math.round(clamp(resilienceRest + resilienceStorageComponent(storage), 0, 100));

  const nextFoodSecurity = {
    ...fs,
    storageMonths: round2(storage),
    deficitPct: round1(effectiveDeficit),
    surplusPct: effectiveDeficit > 0 ? 0 : round1(baseSurplusPct),
    resilienceScore,
    stockpile: {
      baseDeficitPct: round1(baseDeficitPct),
      baseSurplusPct: round1(baseSurplusPct),
      resilienceRest: round1(resilienceRest),
      capacityMonths: cap,
      reliefPct: round1(reliefPct),
      tithed,
      blockaded,
      famished,
      lastTick: tick,
    },
  };

  const changed = nextFoodSecurity.storageMonths !== fs.storageMonths
    || nextFoodSecurity.deficitPct !== fs.deficitPct
    || nextFoodSecurity.resilienceScore !== fs.resilienceScore
    || !fs.stockpile;
  if (!changed) return { settlement, changed: false, summary: null };

  return {
    settlement: {
      ...settlement,
      economicState: { ...settlement.economicState, foodSecurity: nextFoodSecurity },
    },
    changed: true,
    summary: {
      storageMonths: round2(nextFoodSecurity.storageMonths),
      effectiveDeficitPct: nextFoodSecurity.deficitPct,
      resilienceScore,
      reliefPct: round1(reliefPct),
      tithed,
      blockaded,
      famished,
    },
  };
}
