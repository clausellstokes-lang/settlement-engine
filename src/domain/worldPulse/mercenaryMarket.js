/**
 * domain/worldPulse/mercenaryMarket.js — W-C2 item 2: the MERCENARY / ADVENTURER-GUILD
 * COMPENSATING MARKET, the pure derivation + its per-settlement ledger.
 *
 * A settlement under WAR EXPOSURE whose own READINESS and SUPPLY QUALITY fall short of
 * that exposure has a SHORTFALL — force it needs and cannot field. Where local mercenary /
 * adventurer-guild institutions exist (the catalog SUPPLY), that shortfall becomes DEMAND
 * they answer: the settlement can BUY the readiness it didn't train — at a price and a
 * noise. The RENTED-FORCE TRADEOFF has three legs, all bounded, all cause-chained:
 *
 *   • SUPPLEMENT — a bounded effective-readiness/mobilization lift (hired steel fills the
 *     ranks the town could not raise), consumed at the deployment seam.
 *   • PROSPERITY COST — an upkeep drain WHILE ENGAGED (guns-vs-butter; sellswords are paid
 *     in coin the market would otherwise grow with), consumed at the economy-health seam.
 *   • FIDELITY PENALTY — hired steel reads the RISK CALCULATOR worse than sworn steel: a
 *     bounded ADDITIVE error term at the war-decision sites, composing with the existing
 *     chaosPull + rust geometry UNDER fidelityNoise's TOTAL_MAX cap (folded into the rust
 *     argument at the war-decision read — it does not fork the noise geometry).
 *
 * STRICTLY ENDOGENOUS: every input is a WORLD RECORD — the threat environment (W-C1),
 * this tick's war ledgers, projected readiness, supply-chain completeness, and the
 * standing institution roster. NO user/party action ever feeds it.
 *
 * NEUTRALITY THEOREM: the market is INSTANTANEOUS (it responds to the current standing
 * exposure, read one tick earlier under the READ-LAST/WRITE-NEXT discipline — you hire
 * against the menace on your border). It MATERIALIZES a ledger entry ONLY when shortfall
 * demand MEETS local mercenary supply (activity > EPS). A world with no wars, OR no
 * shortfall, OR no mercenary institutions produces NO ledger key and every reader returns
 * the identity ⇒ byte-identical.
 *
 * PURE: no rng, no wall-clock, no mutation. Imports the readiness + supply-quality leaves
 * (both reached without a religion-engine cycle) — no fork of either.
 */

import { readinessOf } from './martialReadiness.js';
import { deployedQualityMult, SUPPLY_QUALITY_TUNING } from './supplyQuality.js';
import {
  isMaterializedCustomContent,
} from '../content/customContentSemanticAuthority.js';

export const MERCENARY_MARKET_TUNING = Object.freeze({
  // ── war EXPOSURE (0..1) — how much force the standing situation demands ───────
  EXPOSURE_THREAT_W: 0.7,   // a menacing border (the W-C1 threat index) demands readiness…
  EXPOSURE_ENGAGE_W: 0.6,   // …an ACTUAL engagement this tick (a siege at the walls / an army committed / an occupation endured) demands more.
  // ── native CAPABILITY (0..1) — what the town fields on its own ────────────────
  CAP_READY_W: 0.6,         // trained posture (readiness)…
  CAP_SUPPLY_W: 0.4,        // …and kit (war-supply completeness) meet exposure.
  // ── mercenary SUPPLY (presence of the hireable institutions) ──────────────────
  PRESENCE_PER_INST: 0.5,   // one standing mercenary/adventurer-guild institution ⇒ 0.5 presence…
  PRESENCE_CAP: 1.0,        // …two or more ⇒ a full local market (bounded — no unbounded stacking).
  // ── the RENTED-FORCE legs (all ∝ activity = shortfall × presence, all BOUNDED) ─
  // SUPPLEMENT: the town fields force it didn't train — meaningful but never overwhelming
  // (parity with readiness's own EFFECTIVE_STAT_W class); the capacity clamps still govern.
  SUPPLEMENT_MAX: 0.35,
  // PROSPERITY COST: upkeep drain WHILE ENGAGED (activity carries the exposure, so it fades
  // in peace). Sized to the readinessUpkeepDrag guns-vs-butter class (0.3).
  COST_MAX: 0.3,
  // FIDELITY PENALTY: the hired-steel misread. Bounded so that summed with rust (≤0.35) and
  // chaos it stays UNDER fidelityNoise's TOTAL_MAX (0.75) — hired steel degrades the read,
  // never dominates it.
  FIDELITY_MAX: 0.3,
  EPS: 0.005,               // below this activity ⇒ no active market ⇒ no ledger entry (byte-neutral).
});

/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
/** @param {number} x @returns {number} */
const clamp01 = (x) => clamp(x, 0, 1);
/** @param {string} a @param {string} b @returns {number} */
const codepoint = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** @typedef {{ name?: string, category?: string, priorityCategory?: string, tags?: string[], status?: unknown, _worldPulseInactive?: boolean }} InstLike */
/** @typedef {{ institutions?: InstLike[] }} SettlementLike */
/** @typedef {{ shortfall: number, presence: number, activity: number, supplement: number, prosperityCost: number, fidelityPenalty: number, causes: Array<{ source: string, value: number }> }} MercMarketRecord */

/**
 * The hireable-force institution pattern — mercenary companies, free companies, sellsword
 * quarters, adventurer guilds/charter halls, and veterans' lodges. A SELF-CONTAINED merc-
 * market classifier (it does NOT extend the frozen moralMartialLean leaf): the frozen leaf
 * only catches "free company" on the chaotic-warrior FORM axis, which misses the merc
 * quarter, the adventurer guilds, and the charter hall. Matched against name/category/tags.
 * @type {RegExp}
 */
export const MERCENARY_MARKET_PATTERN =
  /mercenary|free\s*company|sellsword|hired\s*blade|adventurer|charter\s*hall|condottier|war\s*(band|camp)|veteran'?s?\s*lodge/i;

/** True iff the institution is currently STANDING (mirrors the lifecycle active read). @param {InstLike|null|undefined} inst @returns {boolean} */
function isStanding(inst) {
  if (!inst) return false;
  if (inst._worldPulseInactive) return false;
  const s = String(inst.status || 'active').toLowerCase();
  return s !== 'removed' && s !== 'destroyed' && s !== 'remnant' && s !== 'ruined';
}

/**
 * Boolean-only wrapper around the shared type guard.
 *
 * `InstLike` is intentionally a narrow compatibility shape. Exposing only a
 * boolean here keeps TypeScript from treating its non-custom branch as
 * impossible after the richer materialized-content guard runs.
 *
 * @param {unknown} value
 * @returns {boolean}
 */
function hasCustomContentProvenance(value) {
  return isMaterializedCustomContent(value);
}

/** @param {InstLike|null|undefined} inst @returns {boolean} */
function isMercenaryInstitution(inst) {
  if (!inst) return false;
  // This regex is a native/unstamped compatibility vocabulary. A current
  // custom definition cannot acquire rented-force mechanics from presentation
  // text alone.
  if (hasCustomContentProvenance(inst)) return false;
  const tags = Array.isArray(inst.tags) ? inst.tags.join(' ') : '';
  const hay = `${String(inst.name || '')} ${String(inst.category || '')} ${String(inst.priorityCategory || '')} ${tags}`;
  return MERCENARY_MARKET_PATTERN.test(hay);
}

/**
 * 0..1 local MERCENARY SUPPLY presence — how much hireable force a settlement's standing
 * institutions represent. 0 (⇒ no supply response ⇒ byte-identical) when the settlement
 * has none. Pure.
 * @param {SettlementLike|null|undefined} settlement @returns {number}
 */
export function mercPresenceOf(settlement) {
  const insts = Array.isArray(settlement?.institutions) ? settlement.institutions : [];
  let count = 0;
  for (const inst of insts) if (isStanding(inst) && isMercenaryInstitution(inst)) count += 1;
  const T = MERCENARY_MARKET_TUNING;
  return Math.min(T.PRESENCE_CAP, count * T.PRESENCE_PER_INST);
}

/** 0..1 native war CAPABILITY from readiness + war-supply completeness — what a town
 *  fields on its own before hiring. supplyQual is the FLOORED deployed-quality read
 *  normalized off its floor (a floor-supply town reads 0 supply capability). Pure.
 *  @param {number} readiness01 @param {number} supplyQualityMult FLOOR..1 @returns {number} */
export function nativeCapability01(readiness01, supplyQualityMult) {
  const T = MERCENARY_MARKET_TUNING;
  const floor = SUPPLY_QUALITY_TUNING.FLOOR;
  const supply01 = clamp01((clamp01(supplyQualityMult) - floor) / Math.max(1e-6, 1 - floor));
  return clamp01(T.CAP_READY_W * clamp01(readiness01) + T.CAP_SUPPLY_W * supply01);
}

/** 0..1 war EXPOSURE from the threat environment + this-tick engagement. Pure.
 *  @param {number} threat01 @param {boolean} engaged @returns {number} */
export function warExposure01(threat01, engaged) {
  const T = MERCENARY_MARKET_TUNING;
  return clamp01(T.EXPOSURE_THREAT_W * clamp01(threat01) + (engaged ? T.EXPOSURE_ENGAGE_W : 0));
}

// ── site readers: identity short-circuit (absent ledger/entry ⇒ 0) ─────────────

/** @param {Record<string, MercMarketRecord>|null|undefined} ledger @param {string|number} cid @returns {MercMarketRecord|null} */
function entryOf(ledger, cid) {
  const rec = ledger && typeof ledger === 'object' ? ledger[String(cid)] : null;
  return rec && typeof rec === 'object' ? rec : null;
}

/** The bounded rented-force READINESS SUPPLEMENT for a settlement (0 when no active market). @param {Record<string, MercMarketRecord>|null|undefined} ledger @param {string|number} cid @returns {number} */
export function mercSupplementOf(ledger, cid) {
  const rec = entryOf(ledger, cid);
  return rec && Number.isFinite(rec.supplement) ? Math.max(0, rec.supplement) : 0;
}

/** The rented-force UPKEEP PROSPERITY DRAIN for a settlement (0 when no active market). @param {Record<string, MercMarketRecord>|null|undefined} ledger @param {string|number} cid @returns {number} */
export function mercProsperityCostOf(ledger, cid) {
  const rec = entryOf(ledger, cid);
  return rec && Number.isFinite(rec.prosperityCost) ? Math.max(0, rec.prosperityCost) : 0;
}

/** The hired-steel FIDELITY PENALTY for a settlement (0 when no active market) — the
 *  additive error term folded into rust at the war-decision sites. @param {Record<string, MercMarketRecord>|null|undefined} ledger @param {string|number} cid @returns {number} */
export function mercFidelityPenaltyOf(ledger, cid) {
  const rec = entryOf(ledger, cid);
  return rec && Number.isFinite(rec.fidelityPenalty) ? Math.max(0, rec.fidelityPenalty) : 0;
}

// ── the tick-END advance (READ-LAST/WRITE-NEXT) ────────────────────────────────

/**
 * Advance the per-settlement mercenary-market ledger for one tick. For each settlement it
 * reads THIS tick's war exposure (threat index + engagement), its native capability
 * (readiness + supply quality), and its local mercenary supply, derives the SHORTFALL and
 * the demand-driven ACTIVITY (shortfall × presence), and materializes the three rented-
 * force legs ONLY where a market is active (activity > EPS). Every leg carries its cause.
 * Pure, deterministic (no rng — derived from world records), codepoint-ordered.
 * @param {{ snapshot?: { settlements?: Array<{ id?: string|number, settlement?: SettlementLike }>, byId?: unknown }|null,
 *   worldState?: { warPosture?: Record<string, { state?: string }>, deployments?: Record<string, unknown>, occupations?: Record<string, { occupierId?: string|number }> }|null,
 *   threatByCid?: Map<string, number>|null, martialByCid?: Record<string, { readiness01?: number }>|null }} args
 * @returns {{ mercenaryMarketByCid: Record<string, MercMarketRecord>|null }}
 */
export function advanceMercenaryMarket({ snapshot, worldState, threatByCid, martialByCid } = {}) {
  const settlements = Array.isArray(snapshot?.settlements) ? snapshot.settlements : [];
  if (!settlements.length) return { mercenaryMarketByCid: null };
  const T = MERCENARY_MARKET_TUNING;
  const posture = worldState?.warPosture || {};
  const deployments = worldState?.deployments || {};
  const occupations = worldState?.occupations || {};
  const threat = threatByCid instanceof Map ? threatByCid : new Map();
  const martial = martialByCid && typeof martialByCid === 'object' ? martialByCid : {};
  // Reverse index: who is garrisoning a conquest this tick (an occupier is engaged too).
  const occupierSet = new Set();
  for (const k of Object.keys(occupations)) {
    const occ = occupations[k];
    if (occ && occ.occupierId != null) occupierSet.add(String(occ.occupierId));
  }

  /** @type {Record<string, MercMarketRecord>} */
  const out = {};
  for (const item of settlements) {
    const cid = String(item?.id ?? '');
    if (!cid) continue;
    const settlement = item.settlement || {};
    const threat01 = threat.get(cid) || 0;
    const st = String(posture[cid]?.state || 'peace');
    const engaged = deployments[cid] !== undefined
      || occupations[cid] !== undefined
      || occupierSet.has(cid)
      || st === 'mobilized' || st === 'deployed';
    const exposure = warExposure01(threat01, engaged);
    if (exposure <= 0) continue;                       // no war exposure ⇒ no market
    const presence = mercPresenceOf(settlement);
    if (presence <= 0) continue;                       // no local mercenary supply ⇒ no market
    const readiness = Number.isFinite(martial[cid]?.readiness01)
      ? clamp01(/** @type {number} */ (martial[cid].readiness01))
      : readinessOf(/** @type {SimSettlement} */ (settlement));
    const supplyQual = deployedQualityMult(/** @type {{ byId?: { get?: (id: string) => unknown }, regionalGraph?: unknown }} */ (snapshot), cid);
    const capability = nativeCapability01(readiness, supplyQual);
    const shortfall = clamp01(exposure - capability);
    const activity = shortfall * presence;
    if (activity <= T.EPS) continue;                   // supply present but demand met ⇒ no active market

    const supplement = T.SUPPLEMENT_MAX * activity;
    const prosperityCost = T.COST_MAX * activity;
    const fidelityPenalty = T.FIDELITY_MAX * activity;
    out[cid] = {
      shortfall,
      presence,
      activity,
      supplement,
      prosperityCost,
      fidelityPenalty,
      causes: [
        { source: 'supply_shortfall', value: shortfall },
        { source: 'mercenary_supply', value: presence },
        { source: 'rented_readiness', value: supplement },
        { source: 'mercenary_upkeep', value: prosperityCost },
        { source: 'hired_steel_noise', value: fidelityPenalty },
      ],
    };
  }
  const cids = Object.keys(out).sort(codepoint);
  if (!cids.length) return { mercenaryMarketByCid: null };
  /** @type {Record<string, MercMarketRecord>} */
  const ordered = {};
  for (const cid of cids) ordered[cid] = out[cid];
  return { mercenaryMarketByCid: ordered };
}
