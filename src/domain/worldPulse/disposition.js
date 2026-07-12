/**
 * domain/worldPulse/disposition.js — Feature C `computeAggressiveness` (pure).
 *
 * A per-settlement aggression DISPOSITION, recomputed each tick from the pre-tick
 * snapshot (NOT cached — the inputs drift via corruption / promotion / coups).
 * Expressed as a centered-on-1.0 multiplier, matching dispositionLedger's
 * convention so it composes with the ratcheted history through the SAME signed
 * `candidateBase` multiplier (> 1.0 belligerent, < 1.0 pacific, EXACTLY 1.0 when
 * there is no signal at all). Three blended terms:
 *
 *   1. govBaseline   — the existing COUP_COERCION coercion map (rulingPower.js),
 *                      re-centered into a signed aggression baseline keyed on the
 *                      governing faction's archetype.
 *   2. personality   — importance-weighted mean of TRAIT_AGGRESSION over the
 *                      settlement's AUTHORED NPC personality strings (OQ13 — the
 *                      authored `npc.personality`, NEVER the RNG-rolled
 *                      `npcStates.alignment`), each NPC weighted by importance
 *                      (notability) × its governing-faction power, governing
 *                      faction up-weighted.
 *   3. history       — `readDispositionMultiplier` over the ratcheted win/loss
 *                      ledger (worldState.dispositionStats): the "we succeed at
 *                      war / at trade" memory.
 *   4. deityTemper   — ONE additional term derived from
 *                      the embedded primary-deity snapshot's temperamentAxis
 *                      (warlike ⇒ +, peacelike ⇒ −, neutral / absent ⇒ 0). It
 *                      folds into the SAME signed `drive` sum as ONE additive
 *                      term — NEVER a parallel war/peace multiplier elsewhere.
 *                      Absent deity ⇒ 0 ⇒ byte-identical. Only takes effect when
 *                      the disposition layer is itself active (warLayerEnabled —
 *                      the disposition gate at the candidate-build call site); when
 *                      the war layer is off this function isn't on the live path.
 *
 * Determinism: pure — no rng, no wall-clock, no mutation. Iterates NPCs in array
 * order but the aggregation is an order-INDEPENDENT weighted mean (commutative
 * sum), so member order never changes the result. A settlement with no governing
 * faction, no scoring NPC, and an empty ledger reads EXACTLY 1.0 — the
 * byte-identity anchor that keeps a legacy / layer-off campaign unchanged.
 */

import { factionArchetype, FACTION_ARCHETYPES } from '../factionArchetypes.js';
import { governingFactionOf, COUP_COERCION } from '../rulingPower.js';
import { TRAIT_AGGRESSION, TRAIT_ALIGNMENT } from '../../data/npcData.js';
import { governanceLedger } from '../governanceLedger.js';
import { readDispositionMultiplier } from './dispositionLedger.js';
import { deityTemper, evil01, chaos01 } from './deityAxes.js';
// Phase 4 W-F3 site #8 — the local piety amplifier on the deity-temper drive term.
// pietyLocalMultOf is the identity short-circuit reader (absent record ⇒ 1.0), so a
// deity-free / tick-0 / zero-span settlement is byte-identical.
import { pietyLocalMultOf } from './piety.js';

const A = FACTION_ARCHETYPES;

// Re-center COUP_COERCION (≈0.85 craft/labor … 1.25 military) onto a SIGNED
// aggression baseline: subtract the neutral pivot (GOVERNMENT/CIVIC = 1.0) so a
// civic/government/religious archetype contributes 0 (no government tilt), a
// garrison leans positive, a craft/merchant guild leans negative. The OCCUPATION
// archetype — a settlement ruled at spearpoint — is the one place we depart from
// COUP_COERCION's 1.0: an occupation authority is overtly belligerent.
const GOV_PIVOT = COUP_COERCION[A.GOVERNMENT]; // 1.0
const OCCUPATION_AGGRESSION = 0.25;

/** Signed government aggression baseline for a governing-faction archetype.
 * @param {string} archetype @returns {number} */
function govBaselineFor(archetype) {
  if (archetype === A.OCCUPATION) return OCCUPATION_AGGRESSION;
  if (archetype === A.CRIMINAL) return 0.1; // not in COUP_COERCION; mildly coercive
  const coercion = /** @type {Record<string, number>} */ (COUP_COERCION)[archetype];
  if (!Number.isFinite(coercion)) return 0; // unknown ⇒ neutral
  return coercion - GOV_PIVOT;
}

// Importance → weight (mirrors npcAgency.notability so the agency layer and the
// disposition read the same authored-importance ladder). Authored importance
// strings dominate; falls back to dots/notability; an unranked NPC still counts
// at a small floor so a town of minor NPCs isn't silently weightless.
/** @param {import('../settlement.schema.js').SimNpc} npc @returns {number} */
function importanceWeight(npc = {}) {
  if (npc.importance === 'pillar') return 1;
  if (npc.importance === 'key') return 0.82;
  if (npc.importance === 'notable') return 0.62;
  if (npc.notability === 3 || npc.dots === 3) return 0.9;
  if (npc.notability === 2 || npc.dots === 2) return 0.68;
  if (npc.notability === 1 || npc.dots === 1) return 0.48;
  return 0.38;
}

// AUTHORED personality strings only. Reads the {dominant, flaw, modifier}
// slots the generator writes (npcGenerator.js:81-84); tolerant of a flat string
// or array shape. NEVER reads npcStates.alignment.
/** @param {import('../settlement.schema.js').SimNpc} npc @returns {string[]} */
function authoredTraits(npc = {}) {
  const p = npc.personality;
  if (!p) return [];
  if (typeof p === 'string') return [p];
  if (Array.isArray(p)) return p.filter((x) => typeof x === 'string');
  return [p.dominant, p.flaw, p.modifier].filter((x) => typeof x === 'string');
}

/** Signed aggression score for one NPC's authored personality (Σ of trait weights).
 * @param {import('../settlement.schema.js').SimNpc} npc @returns {number} */
function npcTraitScore(npc) {
  let score = 0;
  for (const trait of authoredTraits(npc)) {
    const w = /** @type {Record<string, number>} */ (TRAIT_AGGRESSION)[String(trait).trim().toLowerCase()];
    if (Number.isFinite(w)) score += w;
  }
  return score;
}

// Normalize a faction power field to 0..1 (mirrors factionCompetition.factionPower:
// >1 is treated as a 0..100 scale). A missing power is a neutral 0.5 so the NPC
// still contributes rather than vanishing.
/** @param {import('../settlement.schema.js').SimFaction} faction @returns {number} */
function normFactionPower(faction) {
  const raw = faction?.power ?? faction?.influence ?? faction?.score ?? faction?.weight;
  if (!Number.isFinite(raw)) return 0.5;
  return raw > 1 ? Math.max(0, Math.min(1, raw / 100)) : Math.max(0, Math.min(1, raw));
}

// The governing faction's power is up-weighted so the seat of power colours the
// settlement's disposition more than a back-bench guild.
const GOVERNING_UPWEIGHT = 1.5;

/**
 * The importance × faction-power weighted mean of NPC trait scores. Empty / no
 * scoring NPCs ⇒ 0 (no personality signal). Order-independent (weighted mean is
 * a commutative sum).
 */
/** @param {import('../settlement.schema.js').SimSettlement} settlement @returns {number} */
function personalityDrive(settlement) {
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  if (!npcs.length) return 0;
  const governing = governingFactionOf(/** @type {any} */ (settlement));
  const governingPower = governing ? normFactionPower(governing) : 0.5;

  let weighted = 0;
  let totalWeight = 0;
  for (const npc of npcs) {
    const score = npcTraitScore(npc);
    if (score === 0) continue; // no authored aggression signal — contributes nothing
    // Weight = authored importance × the governing faction's power, up-weighted
    // (the chooser doesn't bind NPCs to factions here; the governing faction is
    // the settlement-level power lens, per the C.1 "governing faction up-weighted").
    const w = importanceWeight(npc) * governingPower * GOVERNING_UPWEIGHT;
    if (w <= 0) continue;
    weighted += score * w;
    totalWeight += w;
  }
  return totalWeight > 0 ? weighted / totalWeight : 0;
}

// Blend weights — the signed terms combine into one centered drive, then squash
// into a bounded centered-on-1.0 multiplier. Government + history are modest;
// the authored-personality term carries the most signal (the dossier's "who runs
// this place" answer). W_GOV + W_PERS + W_HIST sum to 1 (the legacy blend);
// W_DEITY is a FOURTH additive term that is 0 when no deity is embedded, so the
// no-deity sum is byte-identical to the legacy blend.
const W_GOV = 0.3;
const W_PERS = 0.45;
const W_HIST = 0.25;
// The warlike-deity term's weight. Modest — a deity
// tilts a settlement's posture, it does not by itself make a peaceful merchant
// town a crusader state (the tanh squash bounds the combined drive regardless).
const W_DEITY = 0.35;

// The embedded deity's temperament as a signed drive: warlike → +1, peacelike →
// −1, neutral / absent → 0. Read off the resolved primaryDeitySnapshot (never
// customContent — the pulse is store-decoupled).
export const DEITY_TEMPER_SIGN = Object.freeze({ warlike: 1, peacelike: -1, neutral: 0 });

/** Signed warlike drive for a settlement's embedded primary-deity snapshot.
 *  0 (no tilt) when there is no deity, a neutral-temperament deity, or an
 *  unrecognized axis — the byte-identity anchor for a deity-free settlement. The
 *  temperament is read THROUGH the W-F2 shim (deityTemper), which returns the
 *  stored axis verbatim for every existing deity ⇒ byte-identical.
 * @param {import('../settlement.schema.js').SimSettlement} settlement @returns {number} */
function deityTemperDrive(settlement) {
  const axis = deityTemper(settlement?.config?.primaryDeitySnapshot) ?? 'neutral';
  const sign = /** @type {Record<string, number>} */ (DEITY_TEMPER_SIGN)[axis];
  return Number.isFinite(sign) ? sign : 0;
}
// Multiplier span at full saturation (matches dispositionLedger's MULTIPLIER_SPAN
// so disposition and ratcheted history live on the same scale).
const MULTIPLIER_SPAN = 0.5;

/** tanh squash: a signed drive (roughly −1..+1) → a bounded signed value.
 * @param {number} x @returns {number} */
function squash(x) {
  return Math.tanh(x);
}

// How hard war-weariness drags a regime's political footing. The exhaustion scar is
// 0..1; a fully-exhausted home front pulls the sentiment strongly negative regardless
// of how warlike the seat is.
const WAR_WEARINESS_WEIGHT = 1.5;

/**
 * Signed war sentiment for the political flywheel (P2). Positive ⇒ the regime's war is
 * sustainable (a warlike governing seat, low weariness); negative ⇒ the home front is
 * turning against an exhausting/unpopular war. Composed from the SAME governing-weighted
 * personality drive the aggression kernel uses (so the seat of power colours it) minus a
 * war-exhaustion drag. Pure, order-independent (personalityDrive is a weighted sum), and
 * `0` for a leaderless settlement with no war-exhaustion.
 * @param {any} settlement
 * @param {number} [warExhaustionScar] the settlement's ratcheted war-exhaustion (0..1)
 * @returns {number} signed, clamped to [-1, 1]
 */
export function computeWarSentiment(settlement, warExhaustionScar = 0) {
  const scar = Math.max(0, Math.min(1, Number(warExhaustionScar) || 0));
  const appetite = personalityDrive(settlement); // governing-weighted aggression, signed
  return Math.max(-1, Math.min(1, appetite - WAR_WEARINESS_WEIGHT * scar));
}

/**
 * The settlement's aggression disposition as a centered-on-1.0 multiplier.
 *
 * @param {{ id?: string, settlement?: any }} item - a worldSnapshot settlement item.
 * @param {any} worldState - carries the ratcheted `dispositionStats` ledger.
 * @param {{ historyMultiplier?: number }} [opts] - test seam to inject history.
 * @returns {number} EXACTLY 1.0 when there is no signal; >1.0 belligerent; <1.0 pacific.
 */
export function computeAggressiveness(item, worldState, opts = {}) {
  const settlement = item?.settlement || item || {};
  const id = item?.id != null ? String(item.id) : null;

  const gov = govBaselineFor(factionArchetype(governingFactionOf(settlement)));
  const pers = personalityDrive(settlement);

  // History rides the SAME ledger the ratchet writes. readDispositionMultiplier
  // is already centered on 1.0 (EXACTLY 1.0 when absent/net-zero), so convert it
  // to a signed drive for the blend: (mult − 1) / SPAN ∈ roughly [−1, 1].
  const histMult = Number.isFinite(opts.historyMultiplier)
    ? Number(opts.historyMultiplier)
    : (id != null ? readDispositionMultiplier(worldState?.dispositionStats || {}, id) : 1.0);
  const hist = (histMult - 1) / MULTIPLIER_SPAN;

  // ONE additive warlike-deity term into the SAME drive
  // sum — never a parallel multiplier. 0 when no deity ⇒ the legacy blend ⇒
  // byte-identical. W-F3 site #8: the LOCAL piety amplifier scales this term (a devout
  // settlement's patron tilts its posture harder); 1.0 with no piety record, and the
  // whole term is 0 for a neutral/absent deity regardless, so byte-identity holds.
  const deityTemper = deityTemperDrive(settlement) * pietyLocalMultOf(settlement);

  const drive = W_GOV * gov + W_PERS * pers + W_HIST * hist + W_DEITY * deityTemper;
  if (drive === 0) return 1.0; // no signal anywhere ⇒ the byte-identity anchor

  return 1.0 + MULTIPLIER_SPAN * squash(drive);
}

/**
 * The LIVE disposition factor map for the candidate-build chokepoint, when the
 * geopolitical layer is ACTIVE: blend each settlement's `computeAggressiveness`
 * (govBaseline + authored NPC personality + ratcheted history) into a per-id
 * centered-on-1.0 multiplier. Only entries that differ from 1.0 are emitted —
 * so a settlement with no signal (no government tilt, no aggressive NPC, empty
 * ledger) is omitted ⇒ candidateBase reads EXACTLY 1.0 for it (`{}`-equivalent).
 *
 * This SUPERSEDES `dispositionFactorMap(dispositionStats)` on the active path
 * (the history term it carried is folded in here via readDispositionMultiplier),
 * so the two must NOT both be applied. Off-path callers keep using
 * `dispositionFactorMap` directly (history-only, byte-identical for an empty
 * ledger). Pure, order-independent (object keys), deterministic.
 *
 * @param {{ settlements?: Array<{id?:string, settlement?:any}> }} snapshot
 * @param {any} worldState - carries `dispositionStats`.
 * @returns {Record<string, number>} { settlementId -> multiplier }, 1.0 entries omitted.
 */
export function computeDispositionFactorMap(snapshot, worldState) {
  /** @type {Record<string, number>} */
  const out = {};
  for (const item of snapshot?.settlements || []) {
    const id = item?.id != null ? String(item.id) : null;
    if (id == null) continue;
    const mult = computeAggressiveness(item, worldState);
    if (mult !== 1.0) out[id] = mult;
  }
  return out;
}

export const AGGRESSION_TUNING = Object.freeze({
  W_GOV, W_PERS, W_HIST, W_DEITY, MULTIPLIER_SPAN, GOVERNING_UPWEIGHT, OCCUPATION_AGGRESSION,
});

// ─────────────────────────────────────────────────────────────────────────────
// Phase 5.5 W0 — DERIVED SETTLEMENT ALIGNMENT (computeLawfulness / computeMalice)
//
// The two 0..1 alignment coordinates of a SETTLEMENT, derived — never authored,
// never persisted — as SIBLINGS of computeAggressiveness (same shape: pure,
// centered signed drive, tanh-squashed). The design ruling (PHASE55 §IV.4 /
// §VI.1-15A): settlement alignment is on the critical path for culture, moral
// drift, info-handling, the risk faculty, and fidelity STYLE — and it must be
// a LIVE read over state the engine already has:
//
//   MALICE (the good–evil axis, 0 saintly … 1 malicious, 0.5 neutral):
//     1. conscience   — importance × governing-power weighted mean of
//                       TRAIT_ALIGNMENT over the AUTHORED npc.personality
//                       strings (the same OQ13 authored-only discipline as
//                       TRAIT_AGGRESSION; + is a GOOD conscience, so it enters
//                       the malice drive NEGATED).
//     2. deityEvil    — the embedded primary deity's evil01 coordinate
//                       (deityAxes), re-centered signed. Absent deity reads the
//                       0.5 midpoint ⇒ 0 drive (the fidelityNoise neutrality
//                       discipline).
//     3. govMalice    — the governing archetype's malice band (criminal /
//                       occupation regimes are predatory; everything else 0).
//     4. recentActs   — cheap signals ALREADY on the worldState: the
//                       war-exhaustion scar (sustained war-waging) and held
//                       OCCUPATIONS (conquest feeds). No new state is plumbed.
//
//   LAWFULNESS (the law–chaos axis, 0 lawless … 1 lawful-bureaucratic, 0.5 neutral):
//     1. govLaw       — the governing archetype's rule-of-law band
//                       (lawful-bureaucratic > personalist > lawless — the
//                       §II.5-2 regime axis, keyed on the canonical archetype).
//     2. deityChaos   — the patron's chaos01 coordinate, signed AGAINST
//                       lawfulness (a chaotic god means the streets shrug).
//     3. legitimacy   — publicLegitimacy through governanceLedger (the one
//                       null-safe read-point); a legitimate order enforces its
//                       law, a collapsed one cannot. `present:false` ⇒ 0 drive.
//     4. occupied     — a settlement under an ACTIVE occupation (worldState
//                       .occupations[id]) lives under imposed martial rule, not
//                       its own law — a signed drag.
//
// NEUTRALITY ANCHOR (constitutional for this wave): a settlement with NO deity,
// NO scoring traits, NO recognized governing archetype, NO legitimacy record,
// and NO war ledgers reads EXACTLY 0.5 on both axes — so a sparse/legacy fixture
// carries no phantom alignment. NO consumer is wired this wave (substrate only);
// fidelityNoise stays deity-driven until Wave A widens it.
//
// Determinism: pure — no rng, no wall-clock, no mutation; every aggregation is
// a commutative weighted sum (order-independent); total on garbage inputs.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The recent-acts slice of worldState the alignment axes read (all optional —
 * an absent ledger is the no-signal midpoint).
 * @typedef {Object} AlignmentActsSource
 * @property {Record<string, number>} [warExhaustion]  0..1 sustained-war scars by settlement id
 * @property {Record<string, { occupierId?: string|number } | null | undefined>} [occupations]  active occupations by OCCUPIED id
 */

/**
 * A worldSnapshot settlement item (or a bare settlement — the tolerant
 * `item?.settlement || item` calling convention computeAggressiveness uses).
 * @typedef {{ id?: string|number, settlement?: import('../settlement.schema.js').SimSettlement }} AlignmentItem
 */

/** Signed good↔evil conscience score for one NPC's authored personality
 *  (Σ of TRAIT_ALIGNMENT weights; + is good-leaning — corruption.js's
 *  npcAlignmentScore convention, read through the same authoredTraits slots).
 * @param {import('../settlement.schema.js').SimNpc} npc @returns {number} */
function npcConscienceScore(npc) {
  let score = 0;
  for (const trait of authoredTraits(npc)) {
    const w = /** @type {Record<string, number>} */ (TRAIT_ALIGNMENT)[String(trait).trim().toLowerCase()];
    if (Number.isFinite(w)) score += w;
  }
  return Math.max(-1, Math.min(1, score));
}

/** The governing entry for an alignment read. ONE typed shim for the
 *  SimSettlement ↔ RulingPowerSettlement structural mismatch (the
 *  `powerStructure.stability` string-vs-number widening) so the three
 *  alignment readers don't each re-route it.
 * @param {import('../settlement.schema.js').SimSettlement} settlement
 * @returns {ReturnType<typeof governingFactionOf>} */
function governingEntryOf(settlement) {
  return governingFactionOf(
    /** @type {import('../rulingPower.js').RulingPowerSettlement} */ (/** @type {unknown} */ (settlement)),
  );
}

/**
 * The importance × governing-power weighted mean of NPC conscience scores —
 * personalityDrive's exact aggregation shape over TRAIT_ALIGNMENT instead of
 * TRAIT_AGGRESSION. Empty / no scoring NPCs ⇒ 0 (no signal). Order-independent.
 * @param {import('../settlement.schema.js').SimSettlement} settlement @returns {number}
 */
function conscienceDrive(settlement) {
  const npcs = Array.isArray(settlement?.npcs) ? settlement.npcs : [];
  if (!npcs.length) return 0;
  const governing = governingEntryOf(settlement);
  const governingPower = governing ? normFactionPower(governing) : 0.5;

  let weighted = 0;
  let totalWeight = 0;
  for (const npc of npcs) {
    const score = npcConscienceScore(npc);
    if (score === 0) continue; // no authored conscience signal — contributes nothing
    const w = importanceWeight(npc) * governingPower * GOVERNING_UPWEIGHT;
    if (w <= 0) continue;
    weighted += score * w;
    totalWeight += w;
  }
  return totalWeight > 0 ? weighted / totalWeight : 0;
}

// Governing-archetype RULE-OF-LAW band (signed): the §II.5-2 axis rendered onto
// the canonical archetypes. Bureaucratic/institutional rule enforces written
// law; personalist/martial-imposed rule bends it; criminal rule IS lawlessness.
// OTHER (no recognized governing entry) is 0 — the neutrality anchor.
/** @type {Readonly<Record<string, number>>} */
const GOV_LAW_BAND = Object.freeze({
  [A.GOVERNMENT]: 0.6, [A.CIVIC]: 0.6, [A.MILITARY]: 0.4, [A.RELIGIOUS]: 0.35,
  [A.NOBLE]: 0.25, [A.MERCHANT]: 0.15, [A.CRAFT]: 0.15, [A.LABOR]: 0.1,
  [A.ARCANE]: 0.1, [A.OUTSIDER]: 0, [A.OCCUPATION]: -0.35, [A.CRIMINAL]: -0.7,
  [A.OTHER]: 0,
});

// Governing-archetype MALICE band (signed): only predatory regimes read
// malicious — a criminal syndicate in the seat, or rule at spearpoint. Everything
// else is 0: an ordinary government is not good or evil BY FORM (conscience,
// deity, and acts carry that).
/** @type {Readonly<Record<string, number>>} */
const GOV_MALICE_BAND = Object.freeze({
  [A.CRIMINAL]: 0.6, [A.OCCUPATION]: 0.45,
});

// Blend weights. Like the aggression kernel: the tanh squash bounds the combined
// drive, so the weights express RELATIVE authority, not a partition of 1.
// Malice: authored conscience carries the most signal (who RUNS the place),
// the patron tilts, regime form and recent acts are modest.
const W_MAL_CONSCIENCE = 0.45;
const W_MAL_DEITY = 0.35;
const W_MAL_GOV = 0.3;
const W_MAL_ACTS = 0.3;
// Lawfulness: regime form leads (law is an institution), the patron and the
// standing legitimacy of the order are moderate, occupation drags.
const W_LAW_GOV = 0.45;
const W_LAW_DEITY = 0.3;
const W_LAW_LEGITIMACY = 0.25;
const W_LAW_OCCUPIED = 0.25;
// The occupied-drag magnitude (an active worldState occupation record).
const OCCUPIED_LAW_DRAG = 1;
// Recent-acts saturation: one held occupation is a strong conquest signal; a
// second saturates the term (min with 1 below).
const OCCUPATION_MALICE_PER_HOLDING = 0.6;

/** 0..1 squash of a signed drive, EXACTLY 0.5 at zero drive (the neutrality anchor).
 * @param {number} drive @returns {number} */
function squash01(drive) {
  if (drive === 0) return 0.5;
  return 0.5 + 0.5 * Math.tanh(drive);
}

/** The worldState id for a snapshot item, or null.
 * @param {{ id?: string|number }|null|undefined} item @returns {string|null} */
function itemId(item) {
  return item?.id != null ? String(item.id) : null;
}

/** How many ACTIVE occupations `id` currently HOLDS as the occupier (the
 *  conquest feed — worldState.occupations is keyed by the OCCUPIED id and
 *  carries `occupierId`). 0 on an absent/garbage ledger. Order-independent.
 * @param {AlignmentActsSource|null|undefined} worldState @param {string|null} id @returns {number} */
function occupationsHeldBy(worldState, id) {
  if (id == null) return 0;
  const occupations = worldState?.occupations;
  if (!occupations || typeof occupations !== 'object') return 0;
  let held = 0;
  for (const key of Object.keys(occupations)) {
    const rec = occupations[key];
    if (rec && String(rec.occupierId) === id) held += 1;
  }
  return held;
}

/** Is `id` itself under an active occupation record?
 * @param {AlignmentActsSource|null|undefined} worldState
 * @param {string|null} id @returns {boolean} */
function isOccupied(worldState, id) {
  if (id == null) return false;
  const occupations = worldState?.occupations;
  if (!occupations || typeof occupations !== 'object') return false;
  return !!occupations[id];
}

/** The 0..1 war-exhaustion scar for `id` (worldState.warExhaustion — the
 *  ratcheted sustained-war ledger). 0 when absent/garbage.
 * @param {AlignmentActsSource|null|undefined} worldState @param {string|null} id @returns {number} */
function warExhaustionOf(worldState, id) {
  if (id == null) return 0;
  const scar = worldState?.warExhaustion?.[id];
  return Number.isFinite(scar) ? Math.max(0, Math.min(1, Number(scar))) : 0;
}

/**
 * The settlement's LAWFULNESS coordinate: 0 lawless … 1 lawful-bureaucratic,
 * EXACTLY 0.5 with no signal. Sibling of computeAggressiveness — pure, centered,
 * tanh-squashed; a DERIVED live read, never persisted (the round-7 "culture is
 * a LIVE read" law). No consumer is wired this wave.
 *
 * @param {AlignmentItem|null} [item] - a worldSnapshot settlement item.
 * @param {AlignmentActsSource|null} [worldState] - carries the occupation ledger (occupied drag).
 * @returns {number} 0..1; EXACTLY 0.5 when there is no signal at all.
 */
export function computeLawfulness(item, worldState) {
  const settlement = /** @type {import('../settlement.schema.js').SimSettlement} */ (
    /** @type {unknown} */ (item?.settlement || item || {})
  );
  const id = itemId(item);

  const govBand = GOV_LAW_BAND[factionArchetype(governingEntryOf(settlement))];
  const gov = Number.isFinite(govBand) ? govBand : 0;
  // chaos01 reads 0.5 for a neutral/absent/legacy patron ⇒ 0 drive. Signed
  // AGAINST lawfulness: a chaotic patron erodes the rule of law.
  const deityChaos = -(2 * chaos01(settlement?.config?.primaryDeitySnapshot) - 1);
  const ledger = governanceLedger(settlement);
  const legitimacy = ledger.present ? (ledger.legitimacyScore - 50) / 50 : 0;
  const occupied = isOccupied(worldState, id) ? -OCCUPIED_LAW_DRAG : 0;

  const drive = W_LAW_GOV * gov + W_LAW_DEITY * deityChaos
    + W_LAW_LEGITIMACY * legitimacy + W_LAW_OCCUPIED * occupied;
  return squash01(drive);
}

/**
 * The settlement's MALICE coordinate: 0 saintly … 1 malicious, EXACTLY 0.5 with
 * no signal. Sibling of computeAggressiveness — pure, centered, tanh-squashed;
 * a DERIVED live read, never persisted. No consumer is wired this wave.
 *
 * @param {AlignmentItem|null} [item] - a worldSnapshot settlement item.
 * @param {AlignmentActsSource|null} [worldState] - carries warExhaustion + occupations (recent acts).
 * @returns {number} 0..1; EXACTLY 0.5 when there is no signal at all.
 */
export function computeMalice(item, worldState) {
  const settlement = /** @type {import('../settlement.schema.js').SimSettlement} */ (
    /** @type {unknown} */ (item?.settlement || item || {})
  );
  const id = itemId(item);

  // + conscience is GOOD-leaning ⇒ negated into the malice drive.
  const conscience = -conscienceDrive(settlement);
  // evil01 reads 0.5 for a neutral/absent/legacy patron ⇒ 0 drive.
  const deityEvil = 2 * evil01(settlement?.config?.primaryDeitySnapshot) - 1;
  const govBand = GOV_MALICE_BAND[factionArchetype(governingEntryOf(settlement))];
  const gov = Number.isFinite(govBand) ? govBand : 0;
  // Recent acts: the sustained-war scar + held occupations, saturating at 1.
  const acts = Math.min(
    1,
    warExhaustionOf(worldState, id)
      + OCCUPATION_MALICE_PER_HOLDING * occupationsHeldBy(worldState, id),
  );

  const drive = W_MAL_CONSCIENCE * conscience + W_MAL_DEITY * deityEvil
    + W_MAL_GOV * gov + W_MAL_ACTS * acts;
  return squash01(drive);
}

export const ALIGNMENT_TUNING = Object.freeze({
  W_MAL_CONSCIENCE, W_MAL_DEITY, W_MAL_GOV, W_MAL_ACTS,
  W_LAW_GOV, W_LAW_DEITY, W_LAW_LEGITIMACY, W_LAW_OCCUPIED,
  OCCUPIED_LAW_DRAG, OCCUPATION_MALICE_PER_HOLDING,
  GOV_LAW_BAND, GOV_MALICE_BAND,
});
