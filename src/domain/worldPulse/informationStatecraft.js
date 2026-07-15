/**
 * domain/worldPulse/informationStatecraft.js — W-DOCTRINE-2: INFORMATION STATECRAFT.
 * (design DESIGN_INFORMATION_STATECRAFT.md — the fifth domain gets its verbs.)
 *
 * Information was the sim's most robust SUBSTRATE (rumor lineages, belief ledgers,
 * fog-as-staleness, carriers-as-wagons) but nobody ACTED on it. This module gives
 * information its verbs — SEE, HIDE, LIE, SHARE — and the one genuinely new mechanic
 * they all lean on, CREDIBILITY AS A STOCK (design §4). No new substrate is built: every
 * verb writes into machinery that already exists (the rumor network, the belief maps, the
 * Blainey convergence, the covert-exposure triple, the generosity act catalog). The verbs
 * are thin decision layers; credibility is an extension of the corroboration weighting,
 * not a parallel system.
 *
 * IMPLEMENTATION STATUS (W-DOCTRINE-2, this pass — the design's scope-overflow order):
 * BUILT + gate-green here — the LOAD-BEARING PAIR: the CREDIBILITY STOCK (consumed by the
 * belief corroboration math + the Blainey convergence + the fracture-hit seam) and the LIE
 * verb (seed → propagate → contradict → expose → the blowback triple). SEAM-NOTED for a
 * follow-up pass — SEE, HIDE, and SHARE-SELL: their exact seams are recorded at the foot of
 * this file (search "SEAM NOTES — SEE / HIDE / SHARE"). This is the clean boundary the
 * design's §9 sequencing + the wave brief's scope-overflow order sanction.
 *
 * DORMANCY (constitutional §6 + §8): all posture/stock state nests under the
 * spatialLedgers namespace (set/get/dropSpatialLedger) — absent ⇒ byte-identical.
 * The layer lights on infoStatecraftActive: beliefsActive (spatial marker present AND
 * infoMode != omniscient — the verbs manipulate beliefs, which only exist then) AND
 * the VIRTUAL flag simulationRules.infoStatecraftEnabled === true. That flag has NO
 * entry in DEFAULT_SIMULATION_RULES (the supplyWebWarfareEnabled / constructiveFlows
 * idiom), so every existing golden — including the belief/rumor/peace tripwires that
 * run at a LIVE infoMode WITHOUT this flag — is byte-identical. [JUDGMENT: a dedicated
 * virtual flag composed with beliefsActive, not literally supplyWebWarfare's
 * warLayer+supplyWebWarfareEnabled gate; SEE/HIDE/LIE work in peacetime, so coupling to
 * warLayer would be wrong. Say "veto" to fold onto the war gate.]
 *
 * The credibility WEIGHT is centered on 1.0 — EXACTLY 1.0 at a neutral/absent stock —
 * so its consumers (belief aggregateReports, the Blainey margins) are byte-identical
 * for any campaign without a materialized credibility ledger, which is every campaign
 * that never lit this flag.
 *
 * PURE + lazy: imported ONLY by the dynamically-loaded pulse kernel (a lazy engine
 * leaf) — zero first-paint bytes. No Date, no Math.random, no tier/auth reads; all
 * randomness forks off the pulse rng confluence; all folds codepoint-sorted.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger, hasSpatialLedger } from '../spatial/distanceRead.js';
import { beliefsActive, GOVERNING_SEAT_KEY, strengthBandOf } from './beliefMap.js';
import { clamp, clamp01 } from '../../kernel/math.js';

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

// ── THE GATE ──────────────────────────────────────────────────────────────────
/**
 * Is the information-statecraft layer LIT? beliefsActive (spatial marker present AND
 * infoMode != 'omniscient') AND the virtual flag infoStatecraftEnabled === true, read
 * defensively (absent ⇒ false ⇒ dormant). NO entry in DEFAULT_SIMULATION_RULES, so
 * every existing golden is byte-identical.
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} worldState
 * @returns {boolean}
 */
export function infoStatecraftActive(worldState) {
  if (!beliefsActive(worldState)) return false;
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).infoStatecraftEnabled === true);
}

// ── CREDIBILITY AS A STOCK (design §4 — the wave's one new mechanic) ────────────
/**
 * Each settlement carries a credibility weight consumed by the EXISTING corroboration
 * math: information arriving on its lineage is weighted by it. Modelled as the
 * dispositionLedger shape (a signed, saturating score, centered-on-1.0 read) plus a
 * generational half-life decay (the relationshipMemory idiom). Stored under
 * spatialLedgers.credibility = { [settlementId]: { score, lastUpdateTick, holder } }.
 *
 *   score   signed, [-SCORE_MAX .. +SCORE_MAX]; NEUTRAL 0 ⇒ weight EXACTLY 1.0.
 *           RISES SLOWLY on proven-true information; FALLS SHARPLY on exposed
 *           deception (asymmetric by design — trust builds in years, dies in an
 *           afternoon). Regresses toward neutral on a generational clock.
 *   holder  'people_held' (survives a change of seat — the town's reputation) with a
 *           'seat_held' fraction restored toward neutral on succession (a new dynasty
 *           inherits the paper, not the hatred — the succession-softening idiom).
 *
 * @typedef {Object} CredibilityEntry
 * @property {number} score
 * @property {number} lastUpdateTick
 * @property {'people_held'} holder
 */

export const CREDIBILITY_TUNING = Object.freeze({
  // The centered-on-1.0 weight span at saturation (the dispositionLedger idiom).
  SCORE_MAX: 12,
  SCORE_SAT: 8,
  // ASYMMETRY (design §4, pinned): proven-true rises are SLOW; exposed-lie falls are
  // SHARP. A single caught lie undoes many honest tellings.
  TRUE_RISE: 0.6,
  LIE_FALL: 5,
  // The FRACTURE (coalition-betrayal) credibility charge scale applied to the recorded
  // fracture.credibilityHit (peaceTerms §7 — the recorded-not-enforced seam this closes).
  FRACTURE_FALL_W: 8,
  // Generational half-life (ticks): credibility regresses toward neutral. 52 ≈ a game
  // year at one-week ticks — a proven-liar mark fades over generations, never ratchets
  // forever. Past MAX_LOOKBACK the mark is spent (prune ⇒ byte-identical-dormant).
  HALF_LIFE_TICKS: 52,
  MAX_LOOKBACK_TICKS: 260,
  // The discount floor / boost ceiling of the read weight. A proven liar's tellings are
  // discounted toward FLOOR; a proven-true court's toward CEIL (the trusted broker).
  WEIGHT_FLOOR: 0.35,
  WEIGHT_CEIL: 1.15,
  // Prune an entry whose |decayed score| falls below this — the mark is forgotten and
  // the ledger drops it (absent ⇒ byte-identical). The one-tick read-last/write-next
  // gap keeps this from oscillating on the boundary.
  PRUNE_EPSILON: 0.05,
});

/**
 * The decayed score of an entry as of `tick` (the generational regression toward
 * neutral). Pure arithmetic, no rng (the belief-decay discipline). Past MAX_LOOKBACK
 * the mark is fully spent (0).
 * @param {CredibilityEntry | null | undefined} entry
 * @param {number} tick
 * @returns {number}
 */
export function decayedCredibilityScore(entry, tick) {
  if (!entry || typeof entry !== 'object') return 0;
  const score = finiteNumber(entry.score, 0);
  if (!score) return 0;
  const age = Math.max(0, Math.floor(finiteNumber(tick, 0)) - Math.floor(finiteNumber(entry.lastUpdateTick, 0)));
  const T = CREDIBILITY_TUNING;
  if (age > T.MAX_LOOKBACK_TICKS) return 0;
  return score * Math.pow(0.5, age / Math.max(1, T.HALF_LIFE_TICKS));
}

/**
 * The centered-on-1.0 credibility WEIGHT for a signed score. NEUTRAL (0) ⇒ EXACTLY
 * 1.0 (the byte-identity anchor). A positive score (proven true) → up to WEIGHT_CEIL;
 * a negative score (proven liar) → down to WEIGHT_FLOOR. Saturates at ±SCORE_SAT.
 * @param {number} score
 * @returns {number}
 */
export function credibilityWeight(score) {
  const s = finiteNumber(score, 0);
  if (!s) return 1.0;
  const T = CREDIBILITY_TUNING;
  const t = clamp(s / T.SCORE_SAT, -1, 1);
  return t >= 0 ? 1 + (T.WEIGHT_CEIL - 1) * t : 1 + (1 - T.WEIGHT_FLOOR) * t;
}

/**
 * The DISCOUNT-only weight (≤ 1.0) — the Blainey seam wants a low-credibility court's
 * believed strength discounted (needs MORE evidence to converge), but does NOT want a
 * high-credibility court's strength amplified in the enemy's reckoning. Honest/neutral
 * ⇒ EXACTLY 1.0 (byte-identity). Only proven liars pull below 1.
 * @param {number} score
 * @returns {number}
 */
export function credibilityDiscount(score) {
  return Math.min(1.0, credibilityWeight(score));
}

/**
 * Read a settlement's decayed credibility score from the live ledger (0 when absent —
 * the neutral anchor). @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} id @param {number} tick @returns {number}
 */
export function credibilityScoreOf(worldState, id, tick) {
  const ledger = asObject(getSpatialLedger(worldState, 'credibility'));
  const entry = /** @type {CredibilityEntry | undefined} */ (ledger[String(id)]);
  return decayedCredibilityScore(entry, tick);
}

/**
 * Build the per-source credibility WEIGHT closure the belief layer consumes (injected
 * into aggregateReports). Returns null when the layer is dormant OR no credibility
 * ledger has materialized — so advanceBeliefMaps is passed nothing and stays
 * byte-identical. When present, weight(sourceId) is centered on 1.0 (exactly 1.0 for
 * an unmarked source), so even a materialized-but-neutral ledger is byte-identical.
 * @param {{ spatialLedgers?: unknown, spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} worldState
 * @param {number} tick
 * @returns {((sourceId: string) => number) | null}
 */
export function makeCredibilityWeightFn(worldState, tick) {
  if (!infoStatecraftActive(worldState)) return null;
  if (!hasSpatialLedger(worldState, 'credibility')) return null;
  const ledger = asObject(getSpatialLedger(worldState, 'credibility'));
  const now = Math.floor(finiteNumber(tick, 0));
  return (/** @type {string} */ sourceId) => {
    const entry = /** @type {CredibilityEntry | undefined} */ (ledger[String(sourceId)]);
    return credibilityWeight(decayedCredibilityScore(entry, now));
  };
}

// The neutral believed-strength the Blainey discount regresses a proven liar's read
// toward: strengthOfBand(BELIEF_TUNING.NEUTRAL_STRENGTH_BAND) = (2 + 0.5) / 5 = 0.5 —
// "I do not trust this court's signals, so I revert to baseline uncertainty about it."
const BLAINEY_NEUTRAL_STRENGTH = 0.5;

/**
 * Build the Blainey convergence-seam closure the peace engine consumes (peaceReasons
 * margins). Given a subject court and the observer's raw believed strength of it,
 * returns the CREDIBILITY-DISCOUNTED believed strength: an honest/unmarked court's read
 * passes through EXACTLY (byte-identity for peace goldens); a proven liar's read
 * regresses toward the neutral midpoint (its signals are trusted less), so the courts'
 * reckonings fail to reconcile → the war against a proven liar runs measurably longer.
 * Same dormancy discipline as the weight closure (null when dormant / no ledger).
 * @param {{ spatialLedgers?: unknown, spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} worldState
 * @param {number} tick
 * @returns {((subjectId: string, believedStrength: number) => number) | null}
 */
export function makeBlaineyCredibilityFn(worldState, tick) {
  if (!infoStatecraftActive(worldState)) return null;
  if (!hasSpatialLedger(worldState, 'credibility')) return null;
  const ledger = asObject(getSpatialLedger(worldState, 'credibility'));
  const now = Math.floor(finiteNumber(tick, 0));
  return (/** @type {string} */ subjectId, /** @type {number} */ believedStrength) => {
    const entry = /** @type {CredibilityEntry | undefined} */ (ledger[String(subjectId)]);
    const d = credibilityDiscount(decayedCredibilityScore(entry, now));
    if (d >= 1) return believedStrength; // honest / neutral ⇒ byte-identical
    return BLAINEY_NEUTRAL_STRENGTH + (believedStrength - BLAINEY_NEUTRAL_STRENGTH) * d;
  };
}

/**
 * One signed credibility delta to fold this tick.
 * @typedef {{ id: string, kind: 'proven_true' | 'deception' | 'fracture', magnitude01?: number }} CredibilityDelta
 */

/**
 * Fold this tick's credibility deltas into the ledger: decay every prior entry to
 * `now`, apply the deltas (proven-true SLOW rise, deception/fracture SHARP fall,
 * clamped to ±SCORE_MAX), prune spent marks, persist codepoint-sorted (drop-when-empty
 * ⇒ byte-identical-dormant). Deterministic; order-stable (deltas folded id-sorted,
 * then signed-magnitude so same-id folds are permutation-independent under the clamp).
 * DORMANT ⇒ an immediate no-op (no key, no change).
 * @param {Object} args
 * @param {{ spatialLedgers?: unknown, spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} args.worldState
 * @param {number} args.tick
 * @param {CredibilityDelta[]} [args.deltas]
 * @returns {{ worldState: unknown, changed: boolean }}
 */
export function advanceCredibility({ worldState, tick, deltas = [] }) {
  if (!infoStatecraftActive(worldState)) {
    return { worldState, changed: false };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const T = CREDIBILITY_TUNING;
  const prior = asObject(getSpatialLedger(worldState, 'credibility'));

  // Decay every prior entry to `now` (the generational regression), carrying the
  // decayed score forward with lastUpdateTick = now.
  /** @type {Map<string, number>} */
  const scores = new Map();
  for (const id of Object.keys(prior).sort(compareCodepoint)) {
    const decayed = decayedCredibilityScore(/** @type {CredibilityEntry} */ (prior[id]), now);
    if (decayed !== 0) scores.set(id, decayed);
  }

  // Fold the deltas, id-sorted then signed-magnitude (permutation-independent under the
  // ±SCORE_MAX clamp — the applyDispositionDeltas discipline).
  const signedOf = (/** @type {CredibilityDelta} */ d) => {
    const mag = clamp01(finiteNumber(d.magnitude01, 1));
    if (d.kind === 'proven_true') return T.TRUE_RISE * mag;
    if (d.kind === 'fracture') return -T.FRACTURE_FALL_W * mag;
    return -T.LIE_FALL * mag; // deception
  };
  const ordered = (Array.isArray(deltas) ? deltas : [])
    .filter((d) => d && d.id != null && (d.kind === 'proven_true' || d.kind === 'deception' || d.kind === 'fracture'))
    .sort((a, b) => (compareCodepoint(String(a.id), String(b.id))) || (signedOf(a) - signedOf(b)));
  for (const d of ordered) {
    const key = String(d.id);
    const next = clamp((scores.get(key) || 0) + signedOf(d), -T.SCORE_MAX, T.SCORE_MAX);
    scores.set(key, next);
  }

  // Rebuild codepoint-sorted; prune spent marks (|score| < epsilon) ⇒ drop-when-empty.
  /** @type {Record<string, CredibilityEntry>} */
  const next = {};
  for (const id of [...scores.keys()].sort(compareCodepoint)) {
    const score = round4(/** @type {number} */ (scores.get(id)));
    if (Math.abs(score) < T.PRUNE_EPSILON) continue;
    next[id] = { score, lastUpdateTick: now, holder: 'people_held' };
  }

  const hasNext = Object.keys(next).length > 0;
  const prevSerialized = JSON.stringify(Object.keys(prior).length ? prior : null);
  const nextSerialized = JSON.stringify(hasNext ? next : null);
  if (prevSerialized === nextSerialized) {
    return { worldState, changed: false };
  }
  // The gate (infoStatecraftActive) already guaranteed a non-null worldState; the write
  // accessors want the broad Record shape.
  const ws = /** @type {Record<string, unknown>} */ (worldState);
  const nextWorldState = hasNext
    ? setSpatialLedger(ws, 'credibility', next)
    : dropSpatialLedger(ws, 'credibility');
  return { worldState: nextWorldState, changed: true };
}

/**
 * The fracture-credibilityHit deltas for THIS tick (design §4 + peaceTerms §7 — the
 * recorded-not-enforced seam). Scans the treaties ledger for coalition-betrayal
 * fractures minted this tick (fracture.tick === now, so each is charged exactly once —
 * idempotent), and returns a sharp deception-class charge against each deserter, scaled
 * by the recorded credibilityHit. Empty when no fracture minted this tick ⇒ byte-neutral.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {number} tick
 * @returns {CredibilityDelta[]}
 */
export function fractureCredibilityDeltas(worldState, tick) {
  const now = Math.floor(finiteNumber(tick, 0));
  const treaties = asObject(getSpatialLedger(worldState, 'treaties'));
  /** @type {CredibilityDelta[]} */
  const out = [];
  for (const key of Object.keys(treaties).sort(compareCodepoint)) {
    const treaty = asObject(treaties[key]);
    const fracture = asObject(treaty.fracture);
    if (!fracture || Object.keys(fracture).length === 0) continue;
    if (Math.floor(finiteNumber(fracture.tick, -1)) !== now) continue; // charge once, at mint
    const deserter = fracture.deserter != null ? String(fracture.deserter) : '';
    if (!deserter) continue;
    out.push({ id: deserter, kind: 'fracture', magnitude01: clamp01(finiteNumber(fracture.credibilityHit, 0)) });
  }
  return out;
}

// ── LIE — disinformation (design §2.3; alignment/structure-gated, blowback-priced) ──
// The LIE seeds a false belief into the audience carrying a SYNTHETIC lineage, then
// propagates/corroborates/contradicts/exposes like any telling — the lifecycle the
// design pins. It is modelled as a GATED belief-injection (the twin of the LIVE
// ally-intel deceit path applyAllyIntelSharing, which already injects a crafted hostile
// belief at high confidence), reaching the liar's believed-hostile neighbours, with a
// synthetic-origin record kept in the spatialLedgers.disinfo ledger for exposure
// accounting. [JUDGMENT: belief-injection over a rumor-ledger seed — the mover runs
// AFTER advanceBeliefMaps (~pulseKernel 1713), so a rumor SEED would need pre-rumor
// timing (line 1659); the injection delivers seed/propagate/corroborate/contradict/
// expose faithfully AND keeps every rumor/belief golden byte-identical (it is gated
// off in all of them). Say "veto" to move to a pre-rumor synthetic-feed seed.]
//
// The canonical lie is the GARRISON BLUFF (§2.3): a settlement facing a believed-
// hostile, believed-stronger neighbour INFLATES its own strength in that neighbour's
// belief map to deter the war (the Blainey mechanic then consumes the false belief).

export const LIE_TUNING = Object.freeze({
  // WILLINGNESS: alignment + structure decide. A lawful-good seat will not; a deceitful
  // or desperate one will. willingness rises with malice + desperation, falls with a
  // lawful-good conscience (lawful AND good = strong restraint).
  WILLING_FLOOR: 0.35,
  MALICE_W: 0.7,
  DESPERATION_W: 0.6,
  LAWGOOD_RESTRAINT: 0.9,
  // INITIATION rarity (E0 tempo — a drama-classed event, not a hum): the loaded-dice
  // baseline (shouldInitiateAsk idiom), ramped by willingness². [JUDGMENT: rarity-gated
  // via the existing loaded-dice idiom rather than minting a new E0 drama class — the
  // drama-class taxonomy is a pinned-at-7 near-schema public surface; §6 frames the
  // drama-classing as initiation TEMPO, which this achieves. Say "veto" to add a
  // 'deception' drama class + bump the dramaClassRegistry contract to 8.]
  INITIATE_BASE: 0.12,
  // The inflation the bluff plants (strength bands, 0..4 scale) above the audience's
  // current belief — bounded so a lie is a plausible exaggeration, not a fantasy.
  INFLATE_BANDS: 2,
  // The bluff is planted at a confidence scaled by the liar's credibility (a proven
  // liar is believed less even before exposure — the boy who cried wolf, ex ante).
  BASE_CONFIDENCE: 0.7,
  // EXPOSURE: a lie is exposed when the audience's belief has re-anchored back toward
  // truth (the normal reconcile CONTRADICTS it) past this band gap, OR it has been
  // afield this many ticks (a long-standing bluff eventually meets independent word).
  EXPOSE_CONTRADICT_BANDS: 2,
  EXPOSE_MAX_AGE_TICKS: 8,
  // The exposed-lie credibility charge magnitude (fed as a 'deception' delta — the
  // SHARP fall side of the asymmetry).
  EXPOSE_CHARGE01: 1,
});

/**
 * The liar's WILLINGNESS to seed disinformation, in [0,1] (design §2.3 gating).
 * Alignment + structure: malice and desperation raise it; a lawful-good conscience
 * lowers it (lawful AND good = the council that will not).
 * @param {{ malice01: number, lawfulness01: number, desperation01: number }} inputs
 * @returns {number}
 */
export function lieWillingness({ malice01, lawfulness01, desperation01 }) {
  const m = clamp01(finiteNumber(malice01, 0.5));
  const l = clamp01(finiteNumber(lawfulness01, 0.5));
  const d = clamp01(finiteNumber(desperation01, 0));
  const T = LIE_TUNING;
  const restraint = T.LAWGOOD_RESTRAINT * l * (1 - m); // lawful-good restraint
  return clamp01(T.MALICE_W * m + T.DESPERATION_W * d - restraint);
}

// ── The belief-map manipulation (a NEW maps, byte-stable, codepoint-sorted) ─────
/** @typedef {import('./beliefMap.js').BeliefRecord} BeliefRecord */

/** The observer's seat belief record about a subject, or null. Total on garbage.
 *  @param {Record<string, unknown>} maps @param {string} observerId @param {string} subjectId
 *  @returns {BeliefRecord | null} */
function seatBeliefRecord(maps, observerId, subjectId) {
  const observer = asObject(maps[String(observerId)]);
  const seat = asObject(observer[GOVERNING_SEAT_KEY]);
  const rec = seat[String(subjectId)];
  return rec && typeof rec === 'object' && !Array.isArray(rec) ? /** @type {BeliefRecord} */ (rec) : null;
}

/**
 * Return a NEW beliefMaps with the given (observer → subject → record) overrides
 * applied to each observer's SEAT slot, codepoint-sorted at every level (byte-stable).
 * Observers/subjects absent from `overrides` keep their exact prior reference.
 * @param {Record<string, unknown>} maps
 * @param {Map<string, Map<string, BeliefRecord>>} overrides
 * @returns {Record<string, unknown>}
 */
function applyBeliefOverrides(maps, overrides) {
  if (!overrides.size) return maps;
  /** @type {Record<string, unknown>} */
  const out = {};
  const observerIds = [...new Set([...Object.keys(maps), ...overrides.keys()])].sort(compareCodepoint);
  for (const observerId of observerIds) {
    const bySubject = overrides.get(observerId);
    if (!bySubject || !bySubject.size) { out[observerId] = maps[observerId]; continue; }
    const priorObserver = asObject(maps[observerId]);
    const priorSeat = asObject(priorObserver[GOVERNING_SEAT_KEY]);
    /** @type {Record<string, unknown>} */
    const nextSeat = {};
    const subjectIds = [...new Set([...Object.keys(priorSeat), ...bySubject.keys()])].sort(compareCodepoint);
    for (const subjectId of subjectIds) {
      const override = bySubject.get(subjectId);
      nextSeat[subjectId] = override !== undefined ? override : priorSeat[subjectId];
    }
    /** @type {Record<string, unknown>} */
    const nextObserver = {};
    for (const k of Object.keys(priorObserver).sort(compareCodepoint)) {
      nextObserver[k] = k === GOVERNING_SEAT_KEY ? nextSeat : priorObserver[k];
    }
    if (!(GOVERNING_SEAT_KEY in nextObserver)) nextObserver[GOVERNING_SEAT_KEY] = nextSeat;
    out[observerId] = nextObserver;
  }
  return out;
}

const HOSTILE_LABELS = new Set(['hostile', 'cold_war', 'rival']);

/**
 * One active lie in the disinfo ledger (spatialLedgers.disinfo).
 * @typedef {Object} DisinfoRecord
 * @property {string} liarId       the seat that seeded it (the synthetic origin)
 * @property {string} subjectId    the strength being lied about (self-inflation ⇒ liarId)
 * @property {string} audienceId   the observer the bluff was planted in
 * @property {number} assertedBand the inflated strength band planted
 * @property {number} trueBand     the true band at seed (the contradiction reference)
 * @property {number} seededTick
 * @property {string} lineageId    the synthetic-origin telling id (deniable-until-lineage)
 */

/**
 * LIE lifecycle (design §2.3): seed → propagate → corroborate → contradict → expose →
 * blowback. Pure; forks off the pulse rng per (liar, tick). Returns the beliefMap
 * overrides (the plant), the next disinfo ledger, the exposed-lie credibility deltas,
 * and the legible news. DORMANT-neutral when no willing liar initiates.
 * @param {Object} args
 * @param {{ byId?: Map<string, { id?: string|number }>, settlements?: Array<{ id?: string|number }> }} args.snapshot
 * @param {Record<string, unknown>} args.worldState  the ensured worldState (post-belief-advance)
 * @param {Record<string, unknown>} args.beliefMaps  the just-advanced beliefMaps
 * @param {{ fork?: (label: string) => { random: () => number } } | null} args.rng
 * @param {number} args.tick
 * @param {(id: string) => number} args.strengthOf  ground-truth 0..1 strength
 * @param {(id: string) => { malice01: number, lawfulness01: number }} args.alignmentOf  derived alignment
 * @param {(id: string) => string} args.nameFor
 * @returns {{ overrides: Map<string, Map<string, BeliefRecord>>, disinfo: Record<string, DisinfoRecord> | null,
 *   deltas: CredibilityDelta[], newsEntries: Array<Record<string, unknown>> }}
 */
export function processLies({ snapshot, worldState, beliefMaps, rng, tick, strengthOf, alignmentOf, nameFor }) {
  const T = LIE_TUNING;
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const name = typeof nameFor === 'function' ? nameFor : (/** @type {string} */ id) => String(id);
  const strength = typeof strengthOf === 'function' ? strengthOf : () => 0.5;
  const byId = snapshot?.byId instanceof Map ? snapshot.byId : new Map();
  /** @type {Map<string, Map<string, BeliefRecord>>} */
  const overrides = new Map();
  /** @type {CredibilityDelta[]} */
  const deltas = [];
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];

  const priorDisinfo = asObject(getSpatialLedger(worldState, 'disinfo'));
  /** @type {Record<string, DisinfoRecord>} */
  const nextDisinfo = {};

  const setOverride = (/** @type {string} */ observerId, /** @type {string} */ subjectId, /** @type {BeliefRecord} */ rec) => {
    if (!overrides.has(observerId)) overrides.set(observerId, new Map());
    /** @type {Map<string, BeliefRecord>} */ (overrides.get(observerId)).set(subjectId, rec);
  };

  // ── (1) PROCESS EXISTING LIES: contradicted (belief re-anchored back toward truth)
  //        or aged-out ⇒ EXPOSE → blowback (credibility charge + the legible triple). ─
  for (const key of Object.keys(priorDisinfo).sort(compareCodepoint)) {
    const rec = /** @type {DisinfoRecord} */ (priorDisinfo[key]);
    if (!rec || typeof rec !== 'object') continue;
    const belief = seatBeliefRecord(beliefMaps, rec.audienceId, rec.subjectId);
    const curBand = belief ? Math.round(finiteNumber(belief.strengthBand, T.INFLATE_BANDS)) : rec.trueBand;
    // CONTRADICTION: the audience's belief has drifted off the plant back toward truth.
    const contradicted = Math.abs(curBand - Math.round(rec.assertedBand)) >= T.EXPOSE_CONTRADICT_BANDS;
    const agedOut = now - Math.floor(finiteNumber(rec.seededTick, now)) >= T.EXPOSE_MAX_AGE_TICKS;
    if (contradicted || agedOut) {
      deltas.push({ id: rec.liarId, kind: 'deception', magnitude01: T.EXPOSE_CHARGE01 });
      newsEntries.push({
        kind: 'infowar_lie_exposed',
        headline: `${name(rec.liarId)}'s bluff is exposed`,
        summary: `A telling ${name(rec.liarId)} planted in ${name(rec.audienceId)} — that its strength was greater than it is — has met independent word and collapsed. The lie traces to ${name(rec.liarId)}'s own court.`,
        reasons: [
          contradicted
            ? `${name(rec.audienceId)}'s reckoning re-anchored toward the truth; the exaggeration no longer holds.`
            : `The bluff outlived its shelf life; a lie meets contradiction in the end.`,
          `The court that lies to neighbours lies to its own people — a legitimacy wound and a people-held grievance ride with the credibility charge.`,
        ],
        settlementIds: [String(rec.liarId), String(rec.audienceId)],
        significance: 'notable',
        score: 61,
        tick: now,
        tags: ['world_pulse', 'infowar', 'deception', 'exposed_lie', 'grievance', 'legitimacy'],
      });
      continue; // drop the exposed lie (do not carry forward)
    }
    nextDisinfo[key] = rec; // still afield
  }

  // ── (2) SEED NEW LIES: a willing, desperate liar plants a garrison bluff in each
  //        believed-hostile neighbour that has a channel to hear it. ────────────────
  const liarIds = [...new Set((snapshot?.settlements || []).map((s) => String(s.id)))].sort(compareCodepoint);
  for (const liarId of liarIds) {
    const item = byId.get(liarId);
    if (!item) continue;
    // The liar's believed-hostile neighbours (its OWN seat map): who it wants to deter.
    const liarSeat = asObject(asObject(beliefMaps[liarId])[GOVERNING_SEAT_KEY]);
    const hostiles = Object.keys(liarSeat).filter((sid) => {
      const b = /** @type {BeliefRecord} */ (liarSeat[sid]);
      return b && typeof b === 'object' && HOSTILE_LABELS.has(String(b.allianceLabel));
    }).sort(compareCodepoint);
    if (!hostiles.length) continue;
    // DESPERATION: at least one believed-hostile neighbour it believes is at least as
    // strong as it truly is (it cannot win the real fight, so it bluffs).
    const selfStrength = clamp01(strength(liarId));
    const selfBand = strengthBandOf(selfStrength);
    let maxHostileBand = -1;
    for (const h of hostiles) {
      const b = /** @type {BeliefRecord} */ (liarSeat[h]);
      maxHostileBand = Math.max(maxHostileBand, Math.round(finiteNumber(b.strengthBand, 2)));
    }
    const desperation01 = clamp01((maxHostileBand - selfBand) / 4 + 0.3);
    const align = typeof alignmentOf === 'function' ? alignmentOf(liarId) : { malice01: 0.5, lawfulness01: 0.5 };
    const willingness = lieWillingness({
      malice01: clamp01(finiteNumber(align?.malice01, 0.5)),
      lawfulness01: clamp01(finiteNumber(align?.lawfulness01, 0.5)),
      desperation01,
    });
    if (willingness < T.WILLING_FLOOR) continue;
    // INITIATION rarity (E0 tempo — loaded dice, an event not a hum).
    const fork = rng && typeof rng.fork === 'function' ? rng.fork(`infowar-lie:${liarId}:${now}`) : null;
    const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 1)) : 1;
    if (u >= T.INITIATE_BASE * willingness * willingness) continue;

    // The liar's current credibility scales how believable the bluff is (ex-ante trust).
    const credW = credibilityWeight(credibilityScoreOf(worldState, liarId, now));
    const assertedBand = clamp(selfBand + T.INFLATE_BANDS, 0, 4);
    for (const audienceId of hostiles) {
      // The audience must have a CHANNEL to hear it (a belief about the liar already —
      // the informational neighbourhood the carriers deliver). No channel ⇒ no reach.
      const prior = seatBeliefRecord(beliefMaps, audienceId, liarId);
      if (!prior) continue;
      const lieKey = `lie:${liarId}:${audienceId}`;
      if (nextDisinfo[lieKey]) continue; // one active bluff per (liar, audience)
      /** @type {BeliefRecord} */
      const planted = {
        readiness: round4(clamp01(Math.max(finiteNumber(prior.readiness, 0.25), 0.5))),
        strengthBand: assertedBand,
        allianceLabel: prior.allianceLabel,
        faithLabel: prior.faithLabel,
        confidence01: round4(clamp01(T.BASE_CONFIDENCE * credW)),
        lastUpdateTick: now,
      };
      setOverride(audienceId, liarId, planted);
      nextDisinfo[lieKey] = {
        liarId, subjectId: liarId, audienceId,
        assertedBand, trueBand: selfBand, seededTick: now,
        lineageId: `disinfo:${liarId}:${audienceId}:${now}`,
      };
    }
  }

  const disinfo = Object.keys(nextDisinfo).length ? sortDisinfo(nextDisinfo) : null;
  return { overrides, disinfo, deltas, newsEntries };
}

/** Codepoint-stable disinfo ledger ordering. @param {Record<string, DisinfoRecord>} ledger
 *  @returns {Record<string, DisinfoRecord>} */
function sortDisinfo(ledger) {
  /** @type {Record<string, DisinfoRecord>} */
  const out = {};
  for (const k of Object.keys(ledger).sort(compareCodepoint)) out[k] = ledger[k];
  return out;
}

// ── THE MOVER — one pure step per pulse tick ───────────────────────────────────
/**
 * Advance information statecraft one tick: run the LIE lifecycle over the just-advanced
 * belief maps (seed/expose), then fold ALL this-tick credibility deltas (fracture
 * betrayals + exposed lies + any proven-true signals) into the credibility stock.
 * DORMANT (gate dark) ⇒ an immediate no-op (no fork, no key) — byte-identical.
 *
 * @param {Object} args
 * @param {{ byId?: Map<string, { id?: string|number }>, settlements?: Array<{ id?: string|number }> }} args.snapshot
 * @param {Record<string, unknown>} args.worldState  the ensured worldState (post-belief-advance)
 * @param {{ fork?: (label: string) => { random: () => number } } | null} [args.rng]
 * @param {number} args.tick
 * @param {(id: string) => number} args.strengthOf  ground-truth 0..1 strength
 * @param {(id: string) => { malice01: number, lawfulness01: number }} [args.alignmentOf]  derived alignment
 * @param {(id: string) => string} [args.nameFor]
 * @param {CredibilityDelta[]} [args.provenTrue]  proven-true rises (SHARE/warning accuracy, etc.)
 * @returns {{ worldState: unknown, changed: boolean, newsEntries: Array<Record<string, unknown>> }}
 */
export function advanceInformationStatecraft({ snapshot, worldState, rng = null, tick, strengthOf, alignmentOf, nameFor, provenTrue = [] }) {
  if (!infoStatecraftActive(worldState)) {
    return { worldState, changed: false, newsEntries: [] };
  }
  let state = /** @type {Record<string, unknown>} */ (worldState);
  let changed = false;

  // (1) THE LIE LIFECYCLE over the just-advanced beliefMaps.
  const beliefMaps = asObject(getSpatialLedger(state, 'beliefMaps'));
  const lie = processLies({
    snapshot: /** @type {{ byId?: Map<string, { id?: string|number }>, settlements?: Array<{ id?: string|number }> }} */ (snapshot),
    worldState: state, beliefMaps, rng, tick,
    strengthOf: strengthOf || (() => 0.5),
    alignmentOf: alignmentOf || (() => ({ malice01: 0.5, lawfulness01: 0.5 })),
    nameFor: nameFor || ((/** @type {string} */ id) => String(id)),
  });
  // Plant/erode the belief maps (only when a lie injected).
  if (lie.overrides.size) {
    const nextMaps = applyBeliefOverrides(beliefMaps, lie.overrides);
    state = /** @type {Record<string, unknown>} */ (setSpatialLedger(state, 'beliefMaps', nextMaps));
    changed = true;
  }
  // Persist the disinfo ledger (drop-when-empty ⇒ byte-identical-dormant).
  const priorDisinfo = asObject(getSpatialLedger(state, 'disinfo'));
  const prevD = JSON.stringify(Object.keys(priorDisinfo).length ? priorDisinfo : null);
  const nextD = JSON.stringify(lie.disinfo);
  if (prevD !== nextD) {
    state = /** @type {Record<string, unknown>} */ (lie.disinfo
      ? setSpatialLedger(state, 'disinfo', lie.disinfo)
      : dropSpatialLedger(state, 'disinfo'));
    changed = true;
  }

  // (2) CREDIBILITY: fold fractures (recorded-not-enforced seam) + exposed lies +
  //     proven-true into the stock.
  const deltas = [
    ...fractureCredibilityDeltas(state, tick),
    ...lie.deltas,
    ...(Array.isArray(provenTrue) ? provenTrue : []),
  ];
  const cred = advanceCredibility({ worldState: state, tick, deltas });
  if (cred.changed) { state = /** @type {Record<string, unknown>} */ (cred.worldState); changed = true; }

  return { worldState: state, changed, newsEntries: lie.newsEntries };
}

/* ───────────────────────────────────────────────────────────────────────────────
 * SEAM NOTES — SEE / HIDE / SHARE-SELL  (deliberately deferred — documented, not a bug
 * to re-find). The CREDIBILITY STOCK + LIE pair above is built and gate-green; the three
 * remaining verbs are thin decision layers over seams that are already mapped. They nest
 * under the SAME infoStatecraftActive gate and the SAME spatialLedgers dormancy discipline,
 * so each is additive + byte-identical-when-absent. Build order per design §9 + the wave
 * brief's scope-overflow order: SEE/HIDE next, SHARE-sell third.
 *
 * SEE (design §2.1 — paid eyes, deniable-until-lineage). A per-(watcher,target) posture
 *   ledger `spatialLedgers.sightPostures = { [watcher]: { [target]: { fidelity01, enteredTick,
 *   upkeep } } }`, upkeep-costed (a prosperity band-step debit like the E1d purchase lane).
 *   EFFECT seam: it must REDUCE belief staleness / RAISE fidelity for that pair's reads —
 *   inject a `sightOf(observerId, subjectId) => { decayKeep01, accuracyFloor01 }` closure
 *   into beliefMap.reconcileSlot's SILENCE decay (decayedConfidence) + aggregateReports
 *   accuracy floor (the SAME threading pattern credibilityOf already uses; byte-identical
 *   when absent). COUNTER: HIDE (below) degrades it + raises exposure odds. DENIABLE: a covert
 *   entry, exposed via the same lineage-surfacing as covert funding (reuse the exposed-lie
 *   blowback path in processLies → the grievance/legitimacy/credibility triple).
 *
 * HIDE (design §2.2 — secrecy, symmetric isolation). A per-settlement posture
 *   `spatialLedgers.secrecyPostures = { [sid]: { level01, enteredTick } }` with hysteresis
 *   (the embattlement enter/exit idiom — paranoia is sticky). EFFECT seam: the SAME belief-
 *   decay injection as SEE, two-directional — it RAISES rivals' staleness about `sid` (faster
 *   decay of every observer's belief WHERE subject === sid) AND DIMS `sid`'s own inbound sight
 *   (faster decay of sid's beliefs about others — the symmetric-isolation pin). Plus an honest
 *   TRADE TAX through the carrier=commerce coupling (a merchantAppetite / tradeSalience nudge).
 *   The symmetric-isolation pin: prove a high secrecy posture degrades BOTH directions.
 *
 * SHARE-SELL (design §2.4 SELL lane — the self-policing market). Extend the LIVE `warning`
 *   act (generosityEV.js GENEROSITY_INSTRUMENTS + warningSacrifice) with an `intel_sale`
 *   instrument: intelligence as a priced good with the SELLER'S lineage attached. The
 *   self-policing pin is ALREADY expressible with the credibility stock built here — a bad
 *   (inaccurate) sale feeds a `deception`/negative CredibilityDelta against the seller (bad
 *   product damages the seller's stock → future sales priced lower), a GOOD sale feeds a
 *   `proven_true` rise. Price = fidelity-discounted (the NUMERIC PRICES read-model idiom).
 *   The DEMAND lane (peace disclosure terms) is a separate seam: peaceTerms.js TERM_CATALOG
 *   .disclosure (executor:'seam', line ~149) — a signed disclosure term should CREDIT the
 *   loser's credibility (an open court is verifiable) at the draftTerm executor:'seam' branch.
 * ─────────────────────────────────────────────────────────────────────────────── */

