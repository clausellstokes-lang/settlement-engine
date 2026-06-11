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
 *      eraser. Under a MILD deficit (the tithe's own regime) the drawdown
 *      stops at the tithe floor — the security reserve the tithe exists to
 *      protect is never raided to calm a hardship the tithe deems survivable.
 *      That asymmetry is the hysteresis that gives the tithe/drawdown handoff
 *      a fixed point: without it, the tithe pushes stores past the floor, the
 *      drawdown raids them back below it, and the pair alternates forever.
 *      A severe deficit breaks the floor protection exactly as it stops the
 *      tithe.
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
import { FOOD_IMPORT_RATES } from '../../data/foodImportRates.js';

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
 * When the settlement carries a persisted defenseProfile.scores.disaster
 * (the gated resilience the display surfaces prefer), the live re-grade is
 * written back through the same gate so the 'Disasters & Famine' row moves
 * with the granary instead of freezing at the generation value.
 *
 * @param {Object} settlement
 * @param {{ interval?: string, tick?: number, blockade?: any, famine?: any }} [options]
 * @returns {{ settlement: Object, changed: boolean,
 *            summary: { storageMonths: number, effectiveDeficitPct: number,
 *                       resilienceScore: number, reliefPct: number, tithed: boolean,
 *                       blockaded: boolean, famished: boolean } | null }}
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
  // Magical transport vs the blockade: a teleportation circle is point-to-
  // point — the besieger cannot interdict it; an airship dock keeps flying
  // but impaired against countermeasures. Either way the channel carries at
  // most its own throughput from the shared ladder (FOOD_IMPORT_RATES) —
  // generation's model — so a port metropolis importing 58% of need still
  // starves on the overflow above what a circle can move. Channel resolution
  // prefers the generator's verdict (foodSecurity.magicTradeChannel) and
  // falls back to the institution-name sniff for saves generated on an open
  // route or before the field existed; both paths are gated on magicExists —
  // a no-magic world's legacy circle is masonry, not a channel. The mode is
  // recorded in the stockpile bookkeeping so the dossier can say WHY the
  // blockade did or didn't bite.
  const _instNames = (settlement?.institutions || []).map(i => String(i?.name || '').toLowerCase());
  const _hasTeleportCircle = _instNames.some(n =>
    n.includes('teleportation') || n.includes('planar') || n.includes('extradimensional'));
  const _hasAirshipDock = _instNames.some(n => n.includes('airship'));
  const _magicOn = settlement?.config?.magicExists !== false;
  const blockadeBypass = !blockaded || !_magicOn ? null
    : (fs.magicTradeChannel
      ?? (_hasTeleportCircle ? 'teleport' : _hasAirshipDock ? 'airship' : null));
  const _channelShare = blockadeBypass === 'teleport' ? FOOD_IMPORT_RATES.teleport
    : blockadeBypass === 'airship' ? FOOD_IMPORT_RATES.airshipBesieged
    : 0;
  const blockadePct = blockaded
    ? Math.max(0, clamp(ledger.importDependency, 0, 1) - _channelShare) * 100
    : 0;
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
    // 3. Drawdown: rationed release toward the 'Pressured' band. A MILD
    // deficit may only spend stores ABOVE the tithe floor (the security
    // reserve stays sacred — see header, behavior 3); this is what lets the
    // tithe/drawdown handoff converge instead of alternating across the
    // floor forever. A severe deficit releases from the full stores.
    const releasable = effectiveDeficit < T.reserveTitheDeficitCap
      ? Math.max(0, storage - T.reserveTitheFloorMonths)
      : storage;
    const targetRelief = effectiveDeficit - T.rationFloorPct;          // % of need to cover
    const cost = (targetRelief / 100) * months;                        // months of food it costs
    const available = releasable * T.maxReleaseFraction;
    const spend = Math.min(cost, available);
    reliefPct = months > 0 ? (spend / months) * 100 : 0;
    storage -= spend;
    effectiveDeficit = clamp(effectiveDeficit - reliefPct, 0, 95);
  }

  // Live resilience: the storage slice re-graded from the CURRENT granary,
  // on top of the structural remainder (diversity, imports, adequacy).
  const resilienceScore = Math.round(clamp(resilienceRest + resilienceStorageComponent(storage), 0, 100));

  // Disaster writeback: defenseGenerator persists scores.disaster as the
  // GATED resilience (resilienceScore × economicGates.disaster), and the
  // display surfaces prefer it — so the live re-grade must move it too or
  // the 'Disasters & Famine' row stays frozen at the generation value while
  // a siege eats the granary. Legacy saves without a persisted disaster
  // score never gain one (their displays correctly fall through to live
  // resilience). The persisted gate is 2dp-rounded, so the first recompute
  // can shift the score by ±1 against the generated value — intended.
  const _frozenDisaster = settlement.defenseProfile?.scores?.disaster;
  const _disasterGate = settlement.defenseProfile?.economicGates?.disaster;
  const nextDisaster = Number.isFinite(_frozenDisaster)
    ? Math.round(clamp(resilienceScore, 0, 100) * (Number.isFinite(_disasterGate) ? _disasterGate : 1))
    : undefined;
  const _disasterMoved = nextDisaster !== undefined && nextDisaster !== _frozenDisaster;

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
      blockadeBypass,
      famished,
      lastTick: tick,
    },
  };

  // Bookkeeping transitions count as change too (NOT lastTick — that moves
  // every tick by definition): a siege lifting under full bypass must flip
  // blockaded/blockadeBypass off even when the numbers held still, or the
  // stockpile's "why" record lies to whatever reads it next.
  const _flagsMoved = !!fs.stockpile && (
    fs.stockpile.blockaded !== blockaded
    || (fs.stockpile.blockadeBypass ?? null) !== blockadeBypass
    || fs.stockpile.famished !== famished
  );
  const changed = nextFoodSecurity.storageMonths !== fs.storageMonths
    || nextFoodSecurity.deficitPct !== fs.deficitPct
    || nextFoodSecurity.resilienceScore !== fs.resilienceScore
    || _disasterMoved
    || _flagsMoved
    || !fs.stockpile;
  if (!changed) return { settlement, changed: false, summary: null };

  return {
    settlement: {
      ...settlement,
      economicState: { ...settlement.economicState, foodSecurity: nextFoodSecurity },
      // Spread defenseProfile/scores immutably ONLY when the gated disaster
      // score actually moved — unchanged ticks keep reference identity.
      ...(_disasterMoved ? {
        defenseProfile: {
          ...settlement.defenseProfile,
          scores: { ...settlement.defenseProfile.scores, disaster: nextDisaster },
        },
      } : {}),
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
