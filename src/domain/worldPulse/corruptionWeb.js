/**
 * domain/worldPulse/corruptionWeb.js — W-DOCTRINE-3b: THE FOREIGN LANES
 * (DESIGN_CORRUPTION_WEB.md §2 creation + §3 effects). The corruption web completes:
 * the leash generalizes, the effects stay home.
 *
 * Phase A (02b66c4c) landed the RESOLVER CHOKEPOINT (corruptionLeash.js) + the
 * innocent-guild attribution repair — a foreign conspirator's exposure no longer
 * blames the local guild. This module gives the foreign leash its CREATION and its
 * EFFECTS:
 *
 *   §2 CREATION (the mover advanceCorruptionWeb): a patron court mints ONE covert
 *      asset in a target — turning a clean, corruptible NPC there — but ONLY through
 *      a CHANNEL (a hostile/rival edge, a criminal_corridor channel, or an active
 *      smuggle path), and only under SCARCITY AS LAW: at most one live asset per
 *      (patron, target) pair, a small realm-wide per-patron cap, an affordability
 *      (upkeep) gate in the prosperity vocabulary, and an E0-tempo rarity gate on a
 *      §H loaded draw whose weights are the channel quality × the E1 obligation
 *      ledger (the patron who has been "generous" for a decade recruits cheap) ×
 *      the target's HIDE posture (secrecy degrades the channel). Deferral-not-denial:
 *      a patron at cap DEFERS (a visible, receipted deferral), never a hard denial.
 *      The seedBetrayalTraitor deterministic-pick template (importance rank, codepoint
 *      tiebreak, covert, no news) picks the target NPC.
 *
 *   §3 EFFECTS (pure reads, consumed at their seams):
 *      • THE FORK — foreignGripOf: local-leashed corrupt seats feed thievesGuildStrength
 *        EXACTLY as today (byte-identical — the fork lives in factionCapture, gated);
 *        foreign-leashed seats feed a DERIVED per-patron foreign-grip read (puppet-seat
 *        readiness, the W-PEACE puppet_seat term's missing input — exported + seam-noted).
 *      • DIRECTION — directionBias: a bounded, centered-toward-reluctance nudge the
 *        target feels toward its patron's interest (covert; the loaded-coalition twin).
 *      • PAID EYES — assetSightFidelityOf: a live asset grants its patron sight on the
 *        target (the design's "sight + hand"), consumed by the supply-web read.
 *
 * ── WHY LAZY (first-paint budget) ────────────────────────────────────────────
 * This module is imported ONLY by the dynamically-loaded pulse kernel (a lazy engine
 * leaf) and the lazy peace/supply seams — ZERO first-paint bytes. It imports the LAZY
 * resolver leaf (corruptionLeash.js) and the light corruption substrate reads. No Date,
 * no Math.random; all randomness forks off the pulse rng confluence; all folds
 * codepoint-sorted.
 *
 * ── DORMANCY (constitutional) ────────────────────────────────────────────────
 * The whole layer lights on corruptionWebActive: beliefsActive (the spatial/belief
 * substrate — foreign endpoints are save ids, the effects ride beliefs) AND the VIRTUAL
 * flag simulationRules.corruptionWebEnabled === true. That flag has NO entry in
 * DEFAULT_SIMULATION_RULES (the supplyWebWarfareEnabled / infoStatecraftEnabled idiom),
 * so every existing golden is byte-identical. Gate absent ⇒ the mover is an IMMEDIATE
 * no-op (no fork, no mint, no leash) and every read returns its neutral value (0 grip,
 * 0 direction, 0 sight) ⇒ byte-identical.
 *   [JUDGMENT: a dedicated virtual flag composed with beliefsActive (not warLayer — a
 *    foreign court recruits in peacetime, so coupling to the war gate would be wrong;
 *    and not a bare corruption-substrate gate — corruption has no activation flag). The
 *    infoStatecraft precedent exactly. Say "veto" to fold onto a different substrate.]
 */

import { getSpatialLedger } from '../spatial/distanceRead.js';
import { beliefsActive } from './beliefMap.js';
import { resolveLeash } from '../corruptionLeash.js';
import { npcCorruptibleFlaw } from '../corruption.js';
import { npcId } from './npcAgency.js';
import { compareCodepoint } from '../deterministicSort.js';
import { PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';
import { clamp01 } from '../../kernel/math.js';

/** @typedef {import('../settlement.schema.js').SimNpc} SimNpc */
/** @typedef {import('../settlement.schema.js').SimSettlement} SimSettlement */
/** A settlement item as it appears on the pre-tick snapshot.
 *  @typedef {{ id: string|number, name?: string, settlement?: SimSettlement }} WebItem */
/** The loosely-typed snapshot slice this module reads.
 *  @typedef {{ byId?: Map<string, WebItem>, settlements?: WebItem[],
 *    regionalGraph?: { edges?: Array<Record<string, unknown>>, channels?: Array<Record<string, unknown>> } }} WebSnapshot */
/** @typedef {{ fork?: (key: string) => { random: () => number } } | null} RngLike */

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} n @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(n) { return Math.round((Number(n) || 0) * 10000) / 10000; }

// ── Tuning (bounded named constants — owner-retunable) ───────────────────────────
export const CORRUPTION_WEB_TUNING = Object.freeze({
  /** Realm-wide cap on LIVE foreign assets a single patron may hold (§2 "a small
   *  realm-wide cap per patron"). At cap ⇒ a visible deferral, never a mint. */
  MAX_ASSETS_PER_PATRON: 3,
  /** Baseline patron prosperity01 to AFFORD opening any asset (the E1d prosperity
   *  vocabulary — an affordability GATE, not a per-tick drain; the infoStatecraft
   *  SEE-upkeep precedent). */
  UPKEEP_AFFORD_FLOOR: 0.3,
  /** + per EXISTING asset the patron already runs (each new asset is dearer — the
   *  meaningful, rising upkeep the design asks for). */
  UPKEEP_PER_ASSET: 0.12,
  /** Channel-quality weights by channel kind (0..1). A hostile edge is the strongest
   *  recruiting motive; a smuggle path the quietest conduit. The MAX across a pair's
   *  live channels is the base channel quality. */
  CHANNEL_HOSTILE: 0.6,
  CHANNEL_COLD_WAR: 0.5,
  CHANNEL_RIVAL: 0.4,
  CHANNEL_CRIMINAL: 0.7,
  CHANNEL_SMUGGLE: 0.5,
  /** The E1 obligation channel-quality BOOST ceiling: a fully-indebted target (a
   *  decade of the patron's "generous" gifts) multiplies the recruiting weight by up
   *  to (1 + this) — "the patron who has been generous recruits cheap" (§2). 0 when the
   *  obligation ledger is absent ⇒ byte-neutral. */
  OBLIGATION_BOOST_MAX: 0.6,
  /** A target's HIDE secrecy level DEGRADES the channel quality toward this floor
   *  fraction (§2 "HIDE posture" weight; couples to secrecyPostures). */
  HIDE_DEGRADE: 0.6,
  /** E0 initiation tempo: the loaded-dice rarity baseline, ramped by recruitment²
   *  (the shouldInitiateAsk idiom — a drama-classed event, not a hum). */
  INITIATE_BASE: 0.1,
  /** §3 DIRECTION: the bounded span of the covert weight-tamper the target feels
   *  toward its patron (0 = no asset; up to this at a fully-gripped seat). */
  DIRECTION_MAX: 0.3,
  /** §3 FORK: per-asset contribution to the patron's saturating foreign-grip read
   *  (puppet-seat readiness). Saturates so many assets never run the read away. */
  GRIP_SATURATION_RATE: 0.8,
  /** §3 PAID EYES: the sight fidelity a single live asset grants its patron on the
   *  target (the design's "sight + hand"). Scaled by asset seniority. */
  ASSET_SIGHT_FIDELITY: 0.5,
});

/** The importance rank ordering for the deterministic target-NPC pick — the SAME
 *  ladder seedBetrayalTraitor uses (applyWorldPulse IMPORTANCE_RANK). */
const IMPORTANCE_RANK = Object.freeze({ pillar: 3, key: 2, notable: 1 });

/** The hostile/rival edge kinds that open a recruiting channel, mapped to their
 *  channel-quality weight. */
const HOSTILE_CHANNEL_WEIGHT = Object.freeze({
  hostile: CORRUPTION_WEB_TUNING.CHANNEL_HOSTILE,
  cold_war: CORRUPTION_WEB_TUNING.CHANNEL_COLD_WAR,
  rival: CORRUPTION_WEB_TUNING.CHANNEL_RIVAL,
});

// ── THE GATE (fail-closed; the virtual-flag idiom) ───────────────────────────────
/**
 * Is the corruption-web foreign-lanes layer LIT? beliefsActive (spatial marker present
 * AND infoMode != 'omniscient') AND the virtual flag corruptionWebEnabled === true, read
 * defensively (absent ⇒ false ⇒ dormant). NO entry in DEFAULT_SIMULATION_RULES.
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} worldState
 * @returns {boolean}
 */
export function corruptionWebActive(worldState) {
  if (!beliefsActive(worldState)) return false;
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).corruptionWebEnabled === true);
}

/** The stable seed fork key (§H). @param {string} patron @param {string} target @param {number} tick @returns {string} */
export function corruptionWebForkKey(patron, target, tick) {
  return `corruption-web:${patron}:${target}:${tick}`;
}

// ── The channel readers (§2 — no channel, no leash) ──────────────────────────────

/** The regional edges + channels off a snapshot (the stressorGates idiom). */
/** @param {WebSnapshot} snapshot @returns {Array<Record<string, unknown>>} */
function edgesOf(snapshot) {
  const e = snapshot?.regionalGraph?.edges;
  return Array.isArray(e) ? e : [];
}
/** @param {WebSnapshot} snapshot @returns {Array<Record<string, unknown>>} */
function channelsOf(snapshot) {
  const c = snapshot?.regionalGraph?.channels;
  return Array.isArray(c) ? c : [];
}

/** The set of unordered (patron,target) pairs that carry an active SMUGGLE path
 *  (spatialLedgers.supplyShipments, r.smuggle===true) — the quiet conduit. Absent ⇒
 *  an empty set ⇒ that channel kind contributes nothing.
 * @param {Record<string, unknown> | null | undefined} worldState @returns {Set<string>} */
function smugglePairs(worldState) {
  /** @type {Set<string>} */
  const out = new Set();
  const ledger = asObject(getSpatialLedger(worldState, 'supplyShipments'));
  for (const key of Object.keys(ledger).sort(compareCodepoint)) {
    const r = asObject(ledger[key]);
    if (r.smuggle !== true || r.sourceId == null || r.settlementId == null) continue;
    const a = String(r.sourceId);
    const b = String(r.settlementId);
    if (a === b) continue;
    out.add(a < b ? `${a}|${b}` : `${b}|${a}`);
  }
  return out;
}

/**
 * The raw channel quality (0..1) a patron holds toward a target — the MAX over its live
 * channels: a hostile/rival EDGE, a criminal_corridor CHANNEL, or an active SMUGGLE path.
 * 0 ⇒ NO channel ⇒ the patron cannot recruit here (the hard §2 gate). Pure.
 * @param {WebSnapshot} snapshot
 * @param {Set<string>} smuggle  the unordered smuggle-pair set (smugglePairs)
 * @param {string} patronId @param {string} targetId
 * @returns {number}
 */
export function rawChannelQuality(snapshot, smuggle, patronId, targetId) {
  const p = String(patronId);
  const t = String(targetId);
  if (p === t) return 0;
  let quality = 0;
  for (const edge of edgesOf(snapshot)) {
    const from = String(edge.from ?? '');
    const to = String(edge.to ?? '');
    if (!((from === p && to === t) || (from === t && to === p))) continue;
    const type = String(edge.relationshipType ?? '').toLowerCase();
    const w = /** @type {Record<string, number>} */ (HOSTILE_CHANNEL_WEIGHT)[type];
    if (w) quality = Math.max(quality, w);
    if (type === 'criminal_network' || type === 'criminal_corridor') {
      quality = Math.max(quality, CORRUPTION_WEB_TUNING.CHANNEL_CRIMINAL);
    }
  }
  for (const ch of channelsOf(snapshot)) {
    const from = String(ch.from ?? '');
    const to = String(ch.to ?? '');
    if (!((from === p && to === t) || (from === t && to === p))) continue;
    const type = String(ch.type ?? '').toLowerCase();
    if (type.includes('criminal') || type.includes('smuggl')) {
      quality = Math.max(quality, CORRUPTION_WEB_TUNING.CHANNEL_CRIMINAL);
    }
  }
  const pairKey = p < t ? `${p}|${t}` : `${t}|${p}`;
  if (smuggle.has(pairKey)) quality = Math.max(quality, CORRUPTION_WEB_TUNING.CHANNEL_SMUGGLE);
  return clamp01(quality);
}

// ── The E1 obligation channel-quality multiplier (§2 evil-generosity on-ramp) ────

/**
 * How indebted a debtor settlement is to a creditor, in [0,1] — summed over the E1
 * obligation ledger's per-kind records (from===debtor, to===creditor) and clamped. The
 * corruption-web reads it as: how "generous" the PATRON (creditor) has been toward the
 * TARGET (debtor) — a decade of indebting gifts recruits cheap. Absent ledger ⇒ 0 ⇒
 * byte-neutral (the multiplier collapses to 1.0). Pure.
 *   [JUDGMENT: sum-then-clamp across the (grain_relief / credit / …) kinds a pair can
 *    carry, over max-of-kinds — total indebtedness is the recruiting lever, and each
 *    record is already OBLIGATION_CAP-bounded. Say "veto" to switch to max-of-kinds.]
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {string} debtorId @param {string} creditorId
 * @returns {number}
 */
export function obligationDebt01(worldState, debtorId, creditorId) {
  const ledger = asObject(getSpatialLedger(worldState, 'obligations'));
  const d = String(debtorId);
  const c = String(creditorId);
  let sum = 0;
  for (const key of Object.keys(ledger).sort(compareCodepoint)) {
    const rec = asObject(ledger[key]);
    if (String(rec.from ?? '') !== d || String(rec.to ?? '') !== c) continue;
    sum += clamp01(finiteNumber(rec.magnitude, 0));
  }
  return clamp01(sum);
}

// ── The HIDE (secrecy) degrade (§2 — secrecy degrades the channel) ───────────────

/** The target's active HIDE secrecy level (0..1) off the live secrecyPostures ledger
 *  (informationStatecraft's ledger). 0 when absent ⇒ no degrade. Pure.
 * @param {Record<string, unknown> | null | undefined} worldState @param {string} targetId @returns {number} */
function targetSecrecy01(worldState, targetId) {
  const secrecy = asObject(getSpatialLedger(worldState, 'secrecyPostures'));
  return clamp01(finiteNumber(asObject(secrecy[String(targetId)]).level01, 0));
}

/**
 * The RECRUITMENT WEIGHT (0..1) for a (patron, target) pair — the §H loaded-dice weight
 * whose distribution the world has already shaped: the raw channel quality, BOOSTED by the
 * E1 obligation debt (generous patron recruits cheap) and DEGRADED by the target's HIDE
 * secrecy. 0 ⇒ no viable recruit. Pure — the weight IS the receipt.
 * @param {WebSnapshot} snapshot
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {Set<string>} smuggle
 * @param {string} patronId @param {string} targetId
 * @returns {{ weight: number, channel01: number, obligation01: number, secrecy01: number }}
 */
export function recruitmentWeight(snapshot, worldState, smuggle, patronId, targetId) {
  const channel01 = rawChannelQuality(snapshot, smuggle, patronId, targetId);
  if (channel01 <= 0) return { weight: 0, channel01: 0, obligation01: 0, secrecy01: 0 };
  const obligation01 = obligationDebt01(worldState, targetId, patronId);
  const secrecy01 = targetSecrecy01(worldState, targetId);
  const T = CORRUPTION_WEB_TUNING;
  const boosted = channel01 * (1 + T.OBLIGATION_BOOST_MAX * obligation01);
  const degraded = boosted * (1 - (1 - T.HIDE_DEGRADE) * secrecy01);
  return { weight: clamp01(degraded), channel01, obligation01, secrecy01 };
}

// ── The scarcity scan (§2 — derived from the leashes, not a persisted ledger) ────

/**
 * The live FOREIGN assets in the realm, grouped by patron: for every corrupt, un-ousted
 * NPC whose resolved leash is foreign, record { targetId, patronId, npcKey }. This IS the
 * asset registry — "derived, not persisted beyond the leash itself" (§3). Resolves through
 * the chokepoint (corruptionLeash.resolveLeash), so betrayal-seeded foreignPatron writes,
 * this module's minted leashes, and DM-composed leashes all count uniformly. Codepoint-stable.
 * @param {WebSnapshot} snapshot
 * @returns {Map<string, Array<{ targetId: string, npcKey: string, kind: string }>>}
 */
export function foreignAssetsByPatron(snapshot) {
  /** @type {Map<string, Array<{ targetId: string, npcKey: string, kind: string }>>} */
  const byPatron = new Map();
  const items = [...(snapshot?.settlements || [])].sort((a, b) => compareCodepoint(String(a.id), String(b.id)));
  for (const item of items) {
    const sid = String(item.id);
    const npcs = Array.isArray(item.settlement?.npcs) ? item.settlement.npcs : [];
    npcs.forEach((npc, index) => {
      if (!npc || npc.corrupt !== true || npc.ousted === true) return;
      const leash = resolveLeash(/** @type {SimNpc} */ (npc), item.settlement);
      if (!leash.foreign) return;
      const patronId = leash.settlementId != null ? String(leash.settlementId) : (leash.factionName != null ? String(leash.factionName) : '');
      if (!patronId) return;
      const list = byPatron.get(patronId) || [];
      list.push({ targetId: sid, npcKey: npcId(sid, npc, index), kind: leash.kind });
      byPatron.set(patronId, list);
    });
  }
  return byPatron;
}

// ── §3 THE EXPORTED EFFECT READS ─────────────────────────────────────────────────

/**
 * THE FORK (§3): the patron's per-court FOREIGN-GRIP read (0..1) — its puppet-seat
 * readiness, DERIVED (never persisted) from its live foreign assets, saturating so many
 * assets never run it away. This is the input the W-PEACE puppet_seat term (executor
 * 'seam', peaceTerms TERM_CATALOG) currently lacks. DORMANT ⇒ 0 (byte-neutral).
 *   SEAM NOTE: peaceTerms.js's puppet_seat mint/appraisal reads nothing yet; wiring this
 *   read into its government-class asset appraisal is W-PEACE's seam to close. Exported here.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {WebSnapshot} snapshot
 * @param {string} patronId
 * @returns {number}
 */
export function foreignGripOf(worldState, snapshot, patronId) {
  if (!corruptionWebActive(worldState)) return 0;
  const assets = foreignAssetsByPatron(snapshot).get(String(patronId)) || [];
  if (!assets.length) return 0;
  // Saturating in the asset count (the guildStrength idiom): 1 - e^(-n * rate).
  return clamp01(1 - Math.exp(-assets.length * CORRUPTION_WEB_TUNING.GRIP_SATURATION_RATE));
}

/**
 * DIRECTION (§3): the bounded covert weight-tamper (0..DIRECTION_MAX) a TARGET court feels
 * toward a PATRON's interest — the reluctance to move against a court whose asset sits in
 * one's own hall. Derived from the patron's grip on THIS target (assets the patron holds
 * inside targetId). DM-truth only; the caller applies it as a post-sum, clamped nudge (the
 * modulator idiom). DORMANT / no asset ⇒ 0 (byte-neutral). Pure.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {WebSnapshot} snapshot
 * @param {string} targetId  the court whose decision is being tampered
 * @param {string} patronId  the court that benefits
 * @returns {number}
 */
export function directionBias(worldState, snapshot, targetId, patronId) {
  if (!corruptionWebActive(worldState)) return 0;
  const assets = (foreignAssetsByPatron(snapshot).get(String(patronId)) || [])
    .filter((a) => a.targetId === String(targetId));
  if (!assets.length) return 0;
  const grip = clamp01(1 - Math.exp(-assets.length * CORRUPTION_WEB_TUNING.GRIP_SATURATION_RATE));
  return round4(CORRUPTION_WEB_TUNING.DIRECTION_MAX * grip);
}

/**
 * PAID EYES (§3): the sight fidelity (0..1) a patron's live asset grants it on the target —
 * "the asset is also PAID EYES (sight + hand)". Consumed by the supply-web read (Math.max
 * with the SEE posture). DORMANT / no asset ⇒ 0 (byte-neutral — the supply-web goldens never
 * lit it). Pure.
 * @param {Record<string, unknown> | null | undefined} worldState
 * @param {WebSnapshot} snapshot
 * @param {string} watcherId  the patron
 * @param {string} targetId
 * @returns {number}
 */
export function assetSightFidelityOf(worldState, snapshot, watcherId, targetId) {
  if (!corruptionWebActive(worldState)) return 0;
  const assets = (foreignAssetsByPatron(snapshot).get(String(watcherId)) || [])
    .filter((a) => a.targetId === String(targetId));
  if (!assets.length) return 0;
  return CORRUPTION_WEB_TUNING.ASSET_SIGHT_FIDELITY;
}

// ── §2 THE MOVER ─────────────────────────────────────────────────────────────────

/**
 * @typedef {Object} CorruptionWebResult
 * @property {Record<string, unknown>} worldState  the (possibly) updated worldState (npcStates)
 * @property {boolean} changed
 * @property {Array<Record<string, unknown>>} newsEntries
 * @property {Array<{ patronId: string, targetId: string, reason: string }>} deferrals  the
 *   VISIBLE deferrals (cap held / E0 not fired) — observable in the mover's output (the
 *   "cap-holds with deferral visible" pin), never spammed into wizardNews.
 */

/** The patron's affordability floor given how many assets it already runs (rising upkeep).
 *  @param {number} existingCount @returns {number} */
function affordFloorFor(existingCount) {
  const T = CORRUPTION_WEB_TUNING;
  return clamp01(T.UPKEEP_AFFORD_FLOOR + T.UPKEEP_PER_ASSET * Math.max(0, existingCount));
}

/** The patron's prosperity as a 0..1 rank (the E1d prosperity vocabulary). Unknown ⇒ 0.5.
 *  @param {WebItem | undefined} item @returns {number} */
function prosperity01Of(item) {
  const eco = asObject(item?.settlement?.economicState);
  const rank = prosperityRank(/** @type {Parameters<typeof prosperityRank>[0]} */ (eco.prosperity));
  const maxRank = Math.max(1, PROSPERITY_TIERS.length - 1);
  return rank < 0 ? 0.5 : clamp01(rank / maxRank);
}

/**
 * Advance the corruption-web layer one tick (§2): each patron court, codepoint-sorted,
 * considers minting ONE new covert asset. The gate stack (all must pass): a live CHANNEL
 * to the target; scarcity (not already an asset of this patron in that target; under the
 * per-patron realm cap — else a VISIBLE deferral); affordability (the rising upkeep floor
 * in the prosperity vocabulary); and the E0-tempo rarity gate on the §H recruitment weight.
 * On a mint it turns the deterministically-picked target NPC (importance rank, codepoint
 * tiebreak, corruptible + clean) corrupt with a foreign_settlement leash — writing
 * npcStates (corruption + the corruptionLeash sidecar the mirror carries onto settlement.npcs)
 * — covert, no news (the seedBetrayalTraitor template). DORMANT ⇒ an IMMEDIATE no-op.
 *
 * The mint writes npcStates only; mirrorCorruptionOntoSettlement (the existing sync)
 * propagates corrupt + the leash onto settlement.npcs (the dual-write chokepoint), so the
 * mint stays out of the settlementUpdates mutation lane entirely.
 * @param {{ snapshot: WebSnapshot, worldState: Record<string, unknown>, rng?: RngLike,
 *           tick: number, nameFor?: (id: string) => string }} args
 * @returns {CorruptionWebResult}
 */
export function advanceCorruptionWeb({ snapshot, worldState, rng = null, tick, nameFor }) {
  // ── DORMANCY GATE: absent ⇒ an immediate no-op. No fork, no mint. ──
  if (!corruptionWebActive(worldState)) {
    return { worldState, changed: false, newsEntries: [], deferrals: [] };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const name = typeof nameFor === 'function' ? nameFor : (/** @type {string} */ id) => String(id);
  const T = CORRUPTION_WEB_TUNING;

  const existingByPatron = foreignAssetsByPatron(snapshot);
  const smuggle = smugglePairs(worldState);
  /** @type {CorruptionWebResult['deferrals']} */
  const deferrals = [];

  // The candidate patrons: every mapped settlement, codepoint-sorted (a patron needs no
  // pre-existing asset to recruit its first).
  const patronIds = [...new Set((snapshot?.settlements || []).map((s) => String(s.id)))].sort(compareCodepoint);
  const targetIds = patronIds; // the same id space

  /** @type {Record<string, unknown>} */
  let nextNpcStates = /** @type {Record<string, unknown>} */ (asObject(worldState.npcStates));
  let mutated = false;

  for (const patronId of patronIds) {
    const existing = existingByPatron.get(patronId) || [];
    // The (patron→target) pairs this patron already holds (one asset per pair).
    const heldTargets = new Set(existing.map((a) => a.targetId));

    // Score every channelled, not-yet-held target; keep the strict max (codepoint-stable).
    /** @type {{ targetId: string, weight: number } | null} */
    let best = null;
    for (const targetId of targetIds) {
      if (targetId === patronId || heldTargets.has(targetId)) continue;
      const { weight } = recruitmentWeight(snapshot, worldState, smuggle, patronId, targetId);
      if (weight <= 0) continue;
      if (!best || weight > best.weight) best = { targetId, weight };
    }
    if (!best) continue; // no channel to anyone — nothing to defer

    // SCARCITY: at the realm cap ⇒ a VISIBLE deferral (deferral-not-denial), no mint.
    if (existing.length >= T.MAX_ASSETS_PER_PATRON) {
      deferrals.push({ patronId, targetId: best.targetId, reason: 'per_patron_cap' });
      continue;
    }

    // AFFORDABILITY (the rising upkeep floor).
    const patronItem = snapshot?.byId?.get?.(patronId);
    if (prosperity01Of(patronItem) < affordFloorFor(existing.length)) {
      deferrals.push({ patronId, targetId: best.targetId, reason: 'upkeep_unaffordable' });
      continue;
    }

    // E0 TEMPO: the loaded-dice rarity gate (weight² ramps the rare baseline). Deferral-
    // not-denial: a miss is a deferral, tried again next tick.
    const fork = rng && typeof rng.fork === 'function' ? rng.fork(corruptionWebForkKey(patronId, best.targetId, now)) : null;
    const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 1)) : 1;
    if (u >= T.INITIATE_BASE * best.weight * best.weight) {
      deferrals.push({ patronId, targetId: best.targetId, reason: 'e0_deferred' });
      continue;
    }

    // MINT: the deterministic target-NPC pick (the seedBetrayalTraitor template).
    const minted = mintAssetInto(nextNpcStates, snapshot, best.targetId, patronId, now);
    if (!minted) {
      deferrals.push({ patronId, targetId: best.targetId, reason: 'no_eligible_npc' });
      continue;
    }
    nextNpcStates = minted.npcStates;
    mutated = true;
    // Reflect the fresh asset so a same-tick second consideration of this patron (there is
    // none — one pass) and the scarcity of OTHER patrons stay consistent.
    const list = existingByPatron.get(patronId) || [];
    list.push({ targetId: best.targetId, npcKey: minted.npcKey, kind: 'foreign_settlement' });
    existingByPatron.set(patronId, list);
    // Covert, no news (the seedBetrayalTraitor invariant). A DM-truth receipt rides the
    // returned deferrals/effects channels, never a public headline.
    void name; // reserved for the §4 exposure lane's news (kept in the signature)
  }

  if (!mutated) {
    return { worldState, changed: false, newsEntries: [], deferrals };
  }
  return { worldState: { ...worldState, npcStates: nextNpcStates }, changed: true, newsEntries: [], deferrals };
}

/**
 * Turn the deterministically-picked clean, corruptible target NPC corrupt with a
 * foreign_settlement leash — writing npcStates (corruption + the corruptionLeash sidecar).
 * Returns null when the target has no eligible NPC (a visible no_eligible_npc deferral).
 * The seedBetrayalTraitor deterministic pick: importance rank desc, then name codepoint.
 * @param {Record<string, unknown>} npcStates
 * @param {WebSnapshot} snapshot
 * @param {string} targetSid @param {string} patronId @param {number} tick
 * @returns {{ npcStates: Record<string, unknown>, npcKey: string } | null}
 */
function mintAssetInto(npcStates, snapshot, targetSid, patronId, tick) {
  const item = snapshot?.byId?.get?.(targetSid);
  const npcs = Array.isArray(item?.settlement?.npcs) ? item.settlement.npcs : [];
  if (!npcs.length) return null;
  const eligible = npcs
    .map((npc, index) => ({ npc, index, flaw: npcCorruptibleFlaw(/** @type {SimNpc} */ (npc)) }))
    // Corruptible + clean in the snapshot AND not already turned this tick (the in-progress
    // npcStates — so two patrons targeting the same court can't overwrite one NPC's leash,
    // and a mint never re-turns an NPC corrupted earlier in this same pass).
    .filter((c) => c.flaw && c.npc.corrupt !== true && c.npc.ousted !== true
      && asObject(npcStates[npcId(targetSid, c.npc, c.index)]).corruption !== true);
  if (!eligible.length) return null;
  eligible.sort((a, b) => {
    const rank = (/** @type {Record<string, number>} */ (IMPORTANCE_RANK)[String(b.npc.importance)] || 0)
      - (/** @type {Record<string, number>} */ (IMPORTANCE_RANK)[String(a.npc.importance)] || 0);
    if (rank) return rank;
    const an = String(a.npc.name || '');
    const bn = String(b.npc.name || '');
    return an < bn ? -1 : an > bn ? 1 : 0;
  });
  const chosen = eligible[0];
  const id = npcId(targetSid, chosen.npc, chosen.index);
  const st = asObject(npcStates[id]);
  if (!npcStates[id]) return null; // no ensured state to attach to (ensureNpcStates ran first)
  const leash = {
    kind: 'foreign_settlement',
    settlementId: String(patronId),
    factionName: null,
    viaLocalOrg: null,
    conspiracy: 'foreign_web',
    covert: true,
  };
  return {
    npcStates: {
      ...npcStates,
      [id]: {
        ...st,
        corruption: true,
        corruptionProfile: { corrupted: true, vector: 'forbidden_patron' },
        corruptionHeat: Math.max(finiteNumber(st.corruptionHeat, 0), 0.3),
        corruptionLeash: leash,
        corruptionLeashTick: tick,
      },
    },
    npcKey: id,
  };
}
