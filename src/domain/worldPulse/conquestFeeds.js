/**
 * domain/worldPulse/conquestFeeds.js — W-C2 item 1: CONQUEST FEEDS (captives + loot),
 * the pure derivation + its per-settlement DECAYING pulse ledger.
 *
 * When a settlement FALLS (the war layer's conquest power_transfer seeds a fresh
 * occupation), the VICTOR draws two economic feeds from the TAKEN town. Both are
 * CONDITIONALLY MATERIALIZED: a world with no captures produces byte-identical output
 * to today (the ledger key is absent, every reader returns the identity), and both are
 * DETERMINISTIC — derived from state, no rng.
 *
 *   • CAPTIVES CHANNEL (conscience-gated). A slave-trade windfall sized by the taken
 *     town's population tier + the conquest severity — but it PAYS OUT ONLY when the
 *     victor (a) runs a standing SLAVE-MARKET-CLASS institution (the frozen moral coding
 *     in moralMartialLean.js: a cruelty-pole ≥ SLAVE_MARKET_CRUELTY_MIN lean) AND (b) the
 *     victor's PATRON PLANE PERMITS. CONSCIENCE FORECLOSES REVENUE: a good plane's
 *     cruelty-axis abolition read (reusing moralInstitutionPressure's ABOLITION_FLOOR
 *     machinery) crosses the floor ⇒ the yield is LOST — no partial payout, no laundering
 *     into the loot channel, no deferred credit. A good-plane conqueror simply does not
 *     profit this way, and the foreclosure emits its own cause ("V refused the captive
 *     trade").
 *   • LOOT CHANNEL (amoral plunder). A TEMPORARY prosperity/market pulse on the victor,
 *     magnitude scaled by the taken town's ECONOMIC STRENGTH and the OUTCOME KIND
 *     (sack > capture), cause-chained to the specific conquest. It is a PULSE, not a
 *     rebase: it DECAYS over weeks back to zero (no permanent step-change).
 *
 * Both pulses feed the victor's economy-health composite (the "market grows" signal the
 * institution-lifecycle build gate reads) through prosperityPulseOf, and both decay on a
 * WEEK scale so a windfall accelerates growth for a season, then fades. Bounded caps keep
 * repeated conquest from minting unbounded prosperity (the containment discipline the
 * occupation snowball loop also obeys).
 *
 * PURE: no rng, no wall-clock, no mutation. Imports only the frozen lean leaf, the moral-
 * pressure tuning (the shared ABOLITION_FLOOR), the axis leaf, and the tier constants —
 * all reached without a religion-engine cycle. moralMartialLean.js is CONSUMED, never
 * extended (the slave-market selector reads its existing cruelty lean).
 */

import { institutionMoralLean, isStandingInstitution } from './moralMartialLean.js';
import { MORAL_PRESSURE_TUNING } from './moralInstitutionPressure.js';
import { evil01 } from './deityAxes.js';
import { TIER_ORDER, popToTier } from '../../data/constants.js';

export const CONQUEST_FEED_TUNING = Object.freeze({
  // ── the CAPTIVES CHANNEL (conscience-gated slave trade) ──────────────────────
  // The slave-market SELECTOR. moralMartialLean's FROZEN table codes the slave market at
  // cruelty 0.9 — the only row at/above this floor (debtor's prison 0.6, workhouse 0.5,
  // fighting pit 0.55). So a cruelty ≥ this uniquely selects the slave-market class
  // WITHOUT extending the frozen leaf (we read its existing lean, never add to it).
  SLAVE_MARKET_CRUELTY_MIN: 0.8,
  // The conscience GATE threshold — REUSED verbatim from the moral-institution viability
  // machinery. A victor whose PATRON exerts a cruelty-axis abolition read at/above this
  // FORECLOSES the captive trade (the same floor the lifecycle uses to fire an abolition
  // candidate). Neutral/absent patron ⇒ read 0 ⇒ the amoral warlord profits.
  ABOLITION_FLOOR: MORAL_PRESSURE_TUNING.ABOLITION_FLOOR,
  CAPTIVE_POP_W: 0.6,       // captive yield ∝ the taken town's population-tier rank…
  CAPTIVE_SEVERITY_W: 0.4,  // …and the conquest severity (a hard storm carries off more).
  // WEEK-SCALE decay of the captive-trade throughput pulse. A tick is ONE WEEK, so a
  // single conquest's slave influx must CLEAR over a season, not persist. 0.06 ⇒ retention
  // 0.94/wk ⇒ half-life ln(0.5)/ln(0.94) ≈ 11 wk (~2.7 months): the market absorbs and
  // sells its captives over a season, and the profit pulse fades. Not a rebase.
  CAPTIVE_DECAY: 0.06,
  CAPTIVE_CAP: 0.6,         // bounded — repeated conquest cannot mint unbounded slave-trade prosperity.
  // ── the LOOT CHANNEL (amoral plunder pulse) ──────────────────────────────────
  LOOT_ECON_W: 0.7,        // loot yield ∝ the taken town's economic strength…
  KIND_SACK: 1.0,          // …scaled by the OUTCOME KIND: a sack (violent pillage) yields most…
  KIND_CAPTURE: 0.6,       // …a bloodless capture less…
  KIND_OCCUPATION_ESTABLISH: 0.3, // …an administrative occupation-establishment least (see the module note on kinds).
  // WEEK-SCALE decay of the loot pulse. Plunder is a WINDFALL SPENT over a season, never a
  // permanent step-change. 0.09 ⇒ retention 0.91/wk ⇒ half-life ln(0.5)/ln(0.91) ≈ 7.3 wk
  // (~1.7 months): the boom fades as the loot is consumed and prices normalize.
  LOOT_DECAY: 0.09,
  LOOT_CAP: 0.6,           // bounded windfall.
  // ── the prosperity read (what the pulse DOES) ────────────────────────────────
  // The combined loot+captive pulse lifts the victor's economy-health composite by up to
  // this — a BOUNDED market boom that makes institution builds likelier while the windfall
  // lasts. Bounded so a windfall ACCELERATES growth, never guarantees it.
  PROSPERITY_W: 0.35,
  EPS: 0.005,              // below this on BOTH pulses ⇒ drop the entry (return to byte-neutral absent).
});

/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
/** @param {number} x @returns {number} */
const clamp01 = (x) => clamp(x, 0, 1);
/** @param {number} x @returns {number} */
const pos = (x) => (x > 0 ? x : 0);
/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {{ alignmentAxis?: string, lawAxis?: string, name?: string }} DeitySnapshot */
/** @typedef {{ name?: string, category?: string, tags?: string[], status?: unknown, _worldPulseInactive?: boolean }} InstLike */
/** @typedef {{ institutions?: InstLike[], tier?: string, population?: number, config?: { primaryDeitySnapshot?: DeitySnapshot } }} SettlementLike */
/** @typedef {{ loot?: number, captive?: number, causes?: Array<{ source: string, value: number, reason?: string }> }} ConquestFeedRecord */
/** @typedef {{ victorId: string, takenId: string, kind: string, severity: number }} ConquestEntry */

// ── the CAPTIVES CHANNEL ──────────────────────────────────────────────────────

/**
 * The standing SLAVE-MARKET-CLASS institution on a settlement, or null. Selects on the
 * FROZEN moral coding: a standing institution whose cruelty lean reaches
 * SLAVE_MARKET_CRUELTY_MIN (only the slave-market row does). Consumes moralMartialLean;
 * never extends it. Codepoint-first match for determinism. Pure.
 * @param {SettlementLike|null|undefined} settlement @returns {InstLike|null}
 */
export function slaveMarketInstitutionOf(settlement) {
  const insts = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  let best = /** @type {InstLike|null} */ (null);
  for (const inst of insts) {
    if (!isStandingInstitution(inst)) continue;
    const lean = institutionMoralLean(inst);
    if (!lean || lean.cruelty < CONQUEST_FEED_TUNING.SLAVE_MARKET_CRUELTY_MIN) continue;
    if (!best || codepoint(String(inst.name || ''), String(best.name || '')) < 0) best = inst;
  }
  return best;
}

/**
 * The 0..1 cruelty-axis ABOLITION READ a patron exerts on a slave-market lean — how
 * strongly the victor's conscience rejects the captive trade. Reuses the moral-viability
 * geometry (MORAL_AXIS_W × −(lean.cruelty × patronCruelty)), positive side only. A good
 * patron (evil01 low ⇒ patronCruelty negative) reads high; neutral/evil ⇒ 0. Pure.
 * @param {DeitySnapshot|null|undefined} patron @param {{ cruelty: number }} marketLean @returns {number}
 */
export function captiveConscienceRead(patron, marketLean) {
  if (!patron) return 0;
  const patronCruelty = 2 * evil01(patron) - 1;   // −1 good … +1 evil
  return pos(MORAL_PRESSURE_TUNING.MORAL_AXIS_W * -(marketLean.cruelty * patronCruelty));
}

/**
 * The captive-channel GATE for a victor: does it have a slave market, and does its plane
 * PERMIT the trade? permitted ⇔ hasMarket AND the abolition read is BELOW the floor. A
 * deity-free victor (no patron) has no conscience objection ⇒ permitted where the market
 * exists. Pure.
 * @param {SettlementLike|null|undefined} victor
 * @returns {{ hasMarket: boolean, permitted: boolean, abolitionRead: number, marketName: string|null }}
 */
export function captiveGate(victor) {
  const market = slaveMarketInstitutionOf(victor);
  if (!market) return { hasMarket: false, permitted: false, abolitionRead: 0, marketName: null };
  const lean = institutionMoralLean(market) || { cruelty: 0, disorder: 0 };
  const patron = victor?.config?.primaryDeitySnapshot || null;
  const abolitionRead = captiveConscienceRead(patron, lean);
  const permitted = abolitionRead < CONQUEST_FEED_TUNING.ABOLITION_FLOOR;
  return { hasMarket: true, permitted, abolitionRead, marketName: String(market.name || 'slave market') };
}

/** 0..1 normalized population-tier rank of a settlement (thorp 0 … metropolis 1). @param {SettlementLike|null|undefined} s @returns {number} */
function tierScale01(s) {
  const tier = s?.tier || popToTier(Number(s?.population) || 0);
  const rank = TIER_ORDER.indexOf(String(tier));
  return rank >= 0 ? rank / (TIER_ORDER.length - 1) : 0;
}

/**
 * The RAW captive yield (0..1) from a taken town: pop-tier scale × severity. The GATE
 * (captiveGate) decides whether it pays out; this is only the size. Pure.
 * @param {SettlementLike|null|undefined} taken @param {number} severity 0..1 @returns {number}
 */
export function captiveYieldRaw(taken, severity) {
  const T = CONQUEST_FEED_TUNING;
  return clamp01(T.CAPTIVE_POP_W * tierScale01(taken) + T.CAPTIVE_SEVERITY_W * clamp01(severity));
}

// ── the LOOT CHANNEL ───────────────────────────────────────────────────────────

/** 0..1 economic strength of a settlement — its tier scale is the dominant economic axis
 *  in the engine (a metropolis loots richer than a thorp). Pure. @param {SettlementLike|null|undefined} s @returns {number} */
export function economicStrength01(s) {
  return tierScale01(s);
}

/** The OUTCOME-KIND loot factor (sack > capture > occupation-establishment). @param {string} kind @returns {number} */
export function lootKindFactor(kind) {
  const T = CONQUEST_FEED_TUNING;
  if (kind === 'sack') return T.KIND_SACK;
  if (kind === 'capture') return T.KIND_CAPTURE;
  return T.KIND_OCCUPATION_ESTABLISH;
}

/**
 * The RAW loot yield (0..1) from a taken town: economic strength × the outcome-kind
 * factor, weighted. Pure.
 * @param {SettlementLike|null|undefined} taken @param {string} kind @returns {number}
 */
export function lootYieldRaw(taken, kind) {
  const T = CONQUEST_FEED_TUNING;
  return clamp01(T.LOOT_ECON_W * economicStrength01(taken) * lootKindFactor(kind));
}

// ── the pulse integrator + reader ──────────────────────────────────────────────

/** Decay a pulse toward 0, then add this tick's yield, capped. add 0 ⇒ pure decay. Pure.
 *  @param {number|null|undefined} prior @param {number} add @param {number} decay @param {number} cap @returns {number} */
export function stepPulse(prior, add, decay, cap) {
  const p = Number.isFinite(prior) ? Math.max(0, /** @type {number} */ (prior)) : 0;
  return clamp(p * (1 - clamp01(decay)) + Math.max(0, add), 0, cap);
}

/** The 0..PROSPERITY_W economy-health lift a settlement's conquest-feed record contributes
 *  — the bounded market boom the institution-build gate reads. 0 when no record. Pure.
 *  @param {ConquestFeedRecord|null|undefined} record @returns {number} */
export function prosperityPulseOf(record) {
  if (!record) return 0;
  const combined = clamp01((Number(record.loot) || 0) + (Number(record.captive) || 0));
  return CONQUEST_FEED_TUNING.PROSPERITY_W * combined;
}

/** Economy-health lift for a settlement id, read straight off a conquest-feeds ledger.
 *  0 when absent (byte-identical). @param {Record<string, ConquestFeedRecord>|null|undefined} ledger @param {string|number} cid @returns {number} */
export function conquestProsperityFor(ledger, cid) {
  if (!ledger) return 0;
  return prosperityPulseOf(ledger[String(cid)]);
}

// ── the tick-END advance (READ-LAST/WRITE-NEXT) ────────────────────────────────

/**
 * Advance the per-settlement conquest-feed ledger for one tick: DECAY every prior pulse,
 * then ACCRUE this tick's fresh conquests onto their victors (loot always; captives only
 * where the conscience gate permits). Emits a per-victor `causes` receipts array — the
 * loot cause, the captive cause, and the FORECLOSURE cause when a slave-market victor's
 * plane refuses the trade. CONDITIONAL: an entry that decays below EPS with no fresh feed
 * is dropped, so a world that stops conquering returns to byte-neutral absent. Pure,
 * deterministic (no rng — derived from state), codepoint-ordered.
 * @param {{ snapshot?: { byId?: { get?: (id: string) => ({ settlement?: SettlementLike }|undefined) } }|null,
 *   priorLedger?: Record<string, ConquestFeedRecord>|null, conquests?: ConquestEntry[]|null }} args
 * @returns {{ conquestFeedsByCid: Record<string, ConquestFeedRecord>|null }}
 */
export function advanceConquestFeeds({ snapshot, priorLedger, conquests } = {}) {
  const T = CONQUEST_FEED_TUNING;
  const prior = priorLedger && typeof priorLedger === 'object' ? priorLedger : {};
  const list = Array.isArray(conquests) ? conquests : [];
  if (!Object.keys(prior).length && !list.length) return { conquestFeedsByCid: null };

  // Per-victor fresh yields, accumulated from this tick's conquests (codepoint-ordered so
  // the causes array is deterministic regardless of conquest emission order).
  /** @type {Map<string, { loot: number, captive: number, causes: Array<{ source: string, value: number, reason?: string }> }>} */
  const fresh = new Map();
  const bump = (/** @type {string} */ vid) => {
    if (!fresh.has(vid)) fresh.set(vid, { loot: 0, captive: 0, causes: [] });
    return /** @type {{ loot: number, captive: number, causes: Array<{ source: string, value: number, reason?: string }> }} */ (fresh.get(vid));
  };
  const sorted = [...list].sort((a, b) =>
    codepoint(String(a.victorId), String(b.victorId))
    || codepoint(String(a.takenId), String(b.takenId)));
  for (const c of sorted) {
    const vid = String(c.victorId);
    const victor = snapshot?.byId?.get?.(vid)?.settlement || null;
    const taken = snapshot?.byId?.get?.(String(c.takenId))?.settlement || null;
    const acc = bump(vid);
    // LOOT — always (amoral plunder).
    const loot = lootYieldRaw(taken, String(c.kind));
    if (loot > 0) {
      acc.loot += loot;
      acc.causes.push({ source: 'conquest_loot', value: loot, reason: `Plunder from ${c.takenId} (${c.kind}).` });
    }
    // CAPTIVES — gated. Conscience forecloses the revenue (yield LOST, foreclosure receipt).
    const gate = captiveGate(victor);
    if (gate.hasMarket) {
      const yieldRaw = captiveYieldRaw(taken, c.severity);
      if (gate.permitted) {
        if (yieldRaw > 0) {
          acc.captive += yieldRaw;
          acc.causes.push({ source: 'captive_trade', value: yieldRaw, reason: `${gate.marketName} takes captives from ${c.takenId}.` });
        }
      } else {
        // CONSCIENCE FORECLOSES: the yield is LOST (never added, never laundered into loot).
        acc.causes.push({ source: 'captive_trade_foreclosed', value: gate.abolitionRead, reason: `${c.victorId} refused the captive trade (its plane abhors the slave market).` });
      }
    }
  }

  // Decay every prior entry, fold in fresh yields, keep only live entries. Union of prior
  // keys + fresh victors, codepoint-ordered.
  const cids = [...new Set([...Object.keys(prior), ...fresh.keys()])].sort(codepoint);
  /** @type {Record<string, ConquestFeedRecord>} */
  const out = {};
  for (const cid of cids) {
    const priorRec = prior[cid] || null;
    const add = fresh.get(cid) || { loot: 0, captive: 0, causes: [] };
    const loot = stepPulse(priorRec?.loot, add.loot, T.LOOT_DECAY, T.LOOT_CAP);
    const captive = stepPulse(priorRec?.captive, add.captive, T.CAPTIVE_DECAY, T.CAPTIVE_CAP);
    // Drop an entry only when BOTH pulses have faded AND there is no fresh receipt to carry
    // (a bare foreclosure with nothing plundered still surfaces its cause for one tick).
    if (loot <= T.EPS && captive <= T.EPS && !add.causes.length) continue;
    /** @type {ConquestFeedRecord} */
    const rec = { loot, captive };
    if (add.causes.length) rec.causes = add.causes;
    out[cid] = rec;
  }
  return { conquestFeedsByCid: Object.keys(out).length ? out : null };
}
