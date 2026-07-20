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
 *
 * BOUNDARY (design §0.5 amendment, owner ruling 2026-07-19 — the anonymity law amended in
 * place, never crossed): paid eyes and exposed agents are ANONYMOUS AGGREGATES; a named NPC
 * may be CITED as a channel in prose but is never burned, turned, or executed by the engine.
 * PER-NPC CREDIBILITY (DEEP COUPLINGS D-2, npcCredibility.js) is the sanctioned exception: a
 * personal credibility stock and a lie-stigma standing hit are REPUTATION costs, NOT fate
 * resolutions — no exposure removes, kills, or disappears the NPC. Fates remain unresolvable
 * everywhere. The LIE verb now stamps a SPOKESPERSON (the court's mouthpiece) so the personal
 * charge can land on exposure; the deeper no-fate carve is preserved intact.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { getSpatialLedger, setSpatialLedger, dropSpatialLedger, hasSpatialLedger } from '../spatial/distanceRead.js';
import { beliefsActive, GOVERNING_SEAT_KEY, strengthBandOf, governingCoalition } from './beliefMap.js';
import { applyRelationshipPatch } from './relationshipEvolution.js';
import { relationshipKeyFromEdge } from './relationshipState.js';
import { npcId } from './npcAgency.js';
import { importanceWeight } from '../entities/npcs.js';
import {
  npcCredibilityActive, npcCredibilityWeightOf, compositeCredibilityWeight,
  advanceNpcCredibility, hasNpcCredibilityLedger,
} from './npcCredibility.js';
import { PROSPERITY_TIERS, prosperityRank } from '../../data/constants.js';
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
  // W-MOMENTUM §4 — THE CLIMB-DOWN charge: a publicly-declared course reversed costs
  // credibility (the priced, receipted crack), but LESS sharply than an exposed lie — an
  // honest reversal is not a deception. Only ever folded when the momentum layer fires a
  // 'climb_down' delta (never produced until momentum is wired ⇒ byte-identical here).
  CLIMB_DOWN_FALL: 2,
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
  // D-2: also serve the closure when only the per-NPC ledger has materialized (a composite
  // source is still weightable). Byte-safe: a settlement-only source with no credibility
  // ledger weighs EXACTLY 1.0 ⇒ identical to passing null.
  if (!hasSpatialLedger(worldState, 'credibility') && !hasNpcCredibilityLedger(worldState)) return null;
  const ledger = asObject(getSpatialLedger(worldState, 'credibility'));
  const now = Math.floor(finiteNumber(tick, 0));
  const npcCredLit = npcCredibilityActive(worldState);
  return (/** @type {string} */ sourceId) => {
    const raw = String(sourceId);
    // D-2 (§6): an NPC-attributed source is `settlement#npc` — weight settlementCred ×
    // npcCred, clamped. No '#' ⇒ the settlement-only weight, byte-identical (no report
    // carries a composite source until an act stamps a spokesperson).
    const sep = raw.indexOf('#');
    if (sep >= 0 && npcCredLit) {
      const settId = raw.slice(0, sep);
      const nid = raw.slice(sep + 1);
      const settW = credibilityWeight(decayedCredibilityScore(/** @type {CredibilityEntry | undefined} */ (ledger[settId]), now));
      return compositeCredibilityWeight(settW, npcCredibilityWeightOf(worldState, nid, now));
    }
    const entry = /** @type {CredibilityEntry | undefined} */ (ledger[raw]);
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
 * One signed credibility delta to fold this tick. The CLOSED union; 'climb_down' is the
 * W-MOMENTUM §4 crack charge (a publicly-reversed course spends credibility) — a producer
 * only exists once momentum is wired, so it is byte-neutral here.
 * @typedef {{ id: string, kind: 'proven_true' | 'deception' | 'fracture' | 'climb_down', magnitude01?: number }} CredibilityDelta
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
    if (d.kind === 'climb_down') return -T.CLIMB_DOWN_FALL * mag; // W-MOMENTUM §4 crack charge
    return -T.LIE_FALL * mag; // deception
  };
  const ordered = (Array.isArray(deltas) ? deltas : [])
    .filter((d) => d && d.id != null && (d.kind === 'proven_true' || d.kind === 'deception' || d.kind === 'fracture' || d.kind === 'climb_down'))
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
  // The resentment an exposed lie banks on the (audience↔liar) relationship edge — the
  // people-held grievance the news already narrates, now WRITTEN through the E1 incident
  // machinery. Bounded (a single lie is a wound, not instant max-hatred).
  EXPOSE_GRIEVANCE_W: 0.3,
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
 * @property {string} [spokespersonNpcId] D-2: the court's mouthpiece (the named npcId that
 *   fronted the bluff) — present only when npcCredibilityEnabled is lit; on exposure the
 *   personal credibility charge + the lie-stigma land on this soul (a REPUTATION cost, §0.5).
 */

// D-2 (design §6): only government/notable souls front a court's bluff (the mouthpiece floor
// mirrors the ladder's RUNG_ELIGIBLE_FLOOR — a nameless extra never speaks for the court).
const MOUTHPIECE_FLOOR = 0.4;

/**
 * Pick the court's MOUTHPIECE for a bluff (design §6 attribution): a seeded, importance-
 * weighted draw over the settlement's notable+ roster (fork `npc-cred:lie:${sid}:${tick}`).
 * Returns the npcId (the eligibleMembers idiom's key) or null (no eligible soul ⇒ the court
 * speaks anonymously, the pre-D-2 behaviour). PURE. @param {{ settlement?: { npcs?: unknown } } | undefined} item
 * @param {string} sid @param {{ fork?: (label: string) => { random: () => number } } | null} rng @param {number} now
 * @returns {string | null}
 */
function pickMouthpiece(item, sid, rng, now) {
  const settlement = asObject(asObject(item).settlement);
  const npcs = Array.isArray(settlement.npcs) ? /** @type {Record<string, unknown>[]} */ (settlement.npcs) : [];
  /** @type {Array<{ nid: string, w: number }>} */
  const roster = [];
  npcs.forEach((npc, index) => {
    const n = asObject(npc);
    if (n.stasis) return;
    const w = importanceWeight(/** @type {Parameters<typeof importanceWeight>[0]} */ (/** @type {unknown} */ (n)));
    if (w < MOUTHPIECE_FLOOR) return;
    roster.push({ nid: npcId(sid, /** @type {Parameters<typeof npcId>[1]} */ (n), index), w });
  });
  if (!roster.length) return null;
  roster.sort((a, b) => (b.w - a.w) || compareCodepoint(a.nid, b.nid));
  const fork = rng && typeof rng.fork === 'function' ? rng.fork(`npc-cred:lie:${sid}:${now}`) : null;
  const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 0)) : 0;
  const total = roster.reduce((sum, r) => sum + r.w, 0);
  if (!(total > 0)) return roster[0].nid;
  const target = u * total;
  let acc = 0;
  for (const r of roster) { acc += r.w; if (target <= acc) return r.nid; }
  return roster[roster.length - 1].nid;
}

/** The complete set of live npcIds across the roster this tick (the D-2 prune scan — a
 *  vanished NPC's credibility key is dropped). @param {{ byId?: Map<string, unknown> }} snapshot @returns {Set<string>} */
function buildLiveNpcIds(snapshot) {
  const byId = snapshot && snapshot.byId instanceof Map ? snapshot.byId : new Map();
  /** @type {Set<string>} */
  const out = new Set();
  for (const [sid, item] of byId) {
    const settlement = asObject(asObject(item).settlement);
    const npcs = Array.isArray(settlement.npcs) ? /** @type {Record<string, unknown>[]} */ (settlement.npcs) : [];
    npcs.forEach((npc, index) => { out.add(npcId(String(sid), /** @type {Parameters<typeof npcId>[1]} */ (npc), index)); });
  }
  return out;
}

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
 *   deltas: CredibilityDelta[], npcDeltas: import('./npcCredibility.js').NpcCredibilityDelta[],
 *   grievances: GrievanceWrite[], newsEntries: Array<Record<string, unknown>> }}
 */
export function processLies({ snapshot, worldState, beliefMaps, rng, tick, strengthOf, alignmentOf, nameFor }) {
  const T = LIE_TUNING;
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const name = typeof nameFor === 'function' ? nameFor : (/** @type {string} */ id) => String(id);
  const strength = typeof strengthOf === 'function' ? strengthOf : () => 0.5;
  const byId = snapshot?.byId instanceof Map ? snapshot.byId : new Map();
  // D-2: the LIE verb attributes a mouthpiece + charges it personally on exposure ONLY when
  // npcCredibilityEnabled is lit (else no spokesperson is stamped, credW is settlement-only,
  // and every existing infoStatecraft golden is byte-identical).
  const npcCredLit = npcCredibilityActive(worldState);
  /** @type {Map<string, Map<string, BeliefRecord>>} */
  const overrides = new Map();
  /** @type {CredibilityDelta[]} */
  const deltas = [];
  /** @type {import('./npcCredibility.js').NpcCredibilityDelta[]} */
  const npcDeltas = [];
  /** @type {GrievanceWrite[]} */
  const grievances = [];
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
      // D-2 THE PERSONAL CHARGE (§6): the court takes today's deception delta unchanged AND
      // the mouthpiece takes a personal one (sharper — the npc LIE_FALL is steeper). The
      // magnitude band (the size of the exaggeration) rides as lieExposedBand so the ladder
      // can scale the stigma sev. Only when a spokesperson was stamped (npcCredibility lit).
      if (rec.spokespersonNpcId) {
        const band = clamp(Math.abs(Math.round(finiteNumber(rec.assertedBand, 0)) - Math.round(finiteNumber(rec.trueBand, 0))), 0, 4);
        npcDeltas.push({ id: String(rec.spokespersonNpcId), kind: 'deception', magnitude01: T.EXPOSE_CHARGE01, lieExposedBand: band });
      }
      // THE LIE EDGE-GRIEVANCE (W-DOCTRINE-2b follow-up from 2a's boundary): beyond the
      // news receipt, the exposure banks a PEOPLE-HELD grievance on the (audience↔liar)
      // relationship edge — "the court that lies to neighbours" — applied through the E1
      // incident machinery (applyRelationshipPatch) so it feeds scoreGrievance/revanchism
      // the SAME tick. incidentType carries 'betray' so it lights the old-wound clock too.
      grievances.push({ a: String(rec.audienceId), b: String(rec.liarId), magnitude01: T.EXPOSE_GRIEVANCE_W, incidentType: 'deception_betrayal' });
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

    // D-2 ATTRIBUTION (§6): the lying court picks ONE mouthpiece for this scandal (a court
    // speaks with one voice). Gated — dark ⇒ null ⇒ no spokesperson, settlement-only credW,
    // byte-identical. The composite weight (settlementCred × mouthpieceCred, clamped) scales
    // the bluff's ex-ante believability: a known liar fronting it is believed even less.
    const mouthpiece = npcCredLit ? pickMouthpiece(item, liarId, rng, now) : null;
    const settlementCredW = credibilityWeight(credibilityScoreOf(worldState, liarId, now));
    const credW = mouthpiece
      ? compositeCredibilityWeight(settlementCredW, npcCredibilityWeightOf(worldState, mouthpiece, now))
      : settlementCredW;
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
        ...(mouthpiece ? { spokespersonNpcId: mouthpiece } : {}),
      };
    }
  }

  const disinfo = Object.keys(nextDisinfo).length ? sortDisinfo(nextDisinfo) : null;
  return { overrides, disinfo, deltas, npcDeltas, grievances, newsEntries };
}

/** Codepoint-stable disinfo ledger ordering. @param {Record<string, DisinfoRecord>} ledger
 *  @returns {Record<string, DisinfoRecord>} */
function sortDisinfo(ledger) {
  /** @type {Record<string, DisinfoRecord>} */
  const out = {};
  for (const k of Object.keys(ledger).sort(compareCodepoint)) out[k] = ledger[k];
  return out;
}

/**
 * One relationship-edge grievance to write this tick (SEE/LIE exposure → the E1 incident
 * machinery). `a` resents `b` (the shared-pair resentment scalar is bumped; incidentType
 * carries a 'betray' marker so it lights scoreRevanchism too — the directed store is the
 * warReasons ledger, which the shared-edge idiom feeds via scoreGrievance the same tick).
 * @typedef {{ a: string, b: string, magnitude01: number, incidentType?: string }} GrievanceWrite
 */

// ── SEE / HIDE (design §2.1/§2.2) — sight & secrecy postures, the belief-decay seam ──
export const SIGHT_TUNING = Object.freeze({
  // SEE EFFECT: an active sight posture at fidelity f SLOWS the pair's belief decay
  // (decayKeep toward 1.0) and FLOORS the pair's report accuracy (paid eyes sharpen reads).
  SEE_DECAY_KEEP: 0.8,       // full-fidelity eyes ⇒ decayKeep +0.8 (belief barely stales)
  SEE_ACC_FLOOR: 0.85,       // full-fidelity eyes ⇒ the fresh read's accuracy floored at 0.85
  // HIDE EFFECT (symmetric isolation): a secrecy level L RAISES rivals' staleness about the
  // hider AND DIMS the hider's own inbound sight — both via decayKeep < 0 (the two directions).
  HIDE_STALENESS: 0.7,       // rivals' belief about a level-1 hider decays much faster
  HIDE_SELF_DIM: 0.5,        // a level-1 hider's own beliefs decay faster (sealed gates)

  // SEE ENGAGE (§2.1): a watcher BUYS SIGHT on a target it has stakes against + a channel to.
  // Rarity-gated (E0 tempo — a posture change is drama-classed spontaneity, not a hum).
  ENGAGE_BASE: 0.14,         // the loaded-dice enter baseline, ramped by stakes²
  STAKES_FLOOR: 0.3,         // below this stakes the watcher does not bother buying eyes
  STAKES_HOSTILE_W: 0.8,     // war footing (a believed-hostile target) is the primary driver
  STAKES_TRADE_W: 0.35,      // + trade dependence (you watch what you feed on)
  FIDELITY_BASE: 0.45,       // the fidelity a fresh posture opens at
  FIDELITY_STAKES_GAIN: 0.4, // + stakes-scaled fidelity (you invest more where you fear more)

  // UPKEEP (§2.1 "coin", the E1d PROSPERITY vocabulary): the watcher must clear a fidelity-
  // scaled prosperity floor to OPEN and to HOLD a posture; too poor ⇒ the eyes go quiet.
  // [JUDGMENT: an affordability GATE priced in the prosperity vocabulary, not a per-tick
  //  prosperity DRAIN — the coarse 7-band ladder rounds a small per-tick sub-band debit to
  //  nil (E1d applyProsperityDeltasToUpdates), and draining would couple this mover into the
  //  settlementUpdates mutation lane it deliberately stays out of (byte-cleanliness). The
  //  gate faithfully expresses "a chosen, paid position": lose the coffers, lose the eyes.
  //  Say "veto" to add a real prosperity-drain debit + thread settlementUpdates through the mover.]
  UPKEEP_AFFORD_FLOOR: 0.25, // baseline prosperity01 to afford any eyes
  UPKEEP_FIDELITY_COST: 0.4, // + fidelity-scaled prosperity demand (dearer eyes need deeper coffers)
  MERCHANT_UPKEEP_RELIEF: 0.6, // merchant-league watchers debrief caravans cheap (§5 character)

  // COVERT EXPOSURE (deniable-until-lineage §2.1 + the SEE↔HIDE counterplay): a covert posture
  // on a HIDING target is exposed at odds RISING with the target's secrecy — the blowback triple.
  EXPOSE_BASE: 0.06,         // baseline per-tick exposure odds for a covert posture
  EXPOSE_SECRECY_GAIN: 0.55, // + the target's secrecy level (HIDE raises exposure odds)
  EXPOSE_CHARGE01: 0.8,      // the exposed-watcher credibility charge (deception-class, the blowback)
  EXPOSE_GRIEVANCE_W: 0.3,   // the resentment the exposed spying banks on the target→watcher edge

  // HIDE ENTER (§2.2 — secrecy, hysteresis, paranoia is sticky): a settlement raises its gates
  // under concealment pressure = paranoia (malice) + weakness before believed-hostile strength.
  HIDE_PARANOIA_W: 0.55,
  HIDE_WEAKNESS_W: 0.7,
  HIDE_ENTER: 0.4,           // concealment pressure at/above which a posture OPENS
  HIDE_EXIT: 0.22,           // pressure below which an open posture may CLOSE (the deadband)
  HIDE_DWELL: 6,             // min ticks a secrecy posture holds before it may close
  HIDE_ENGAGE_BASE: 0.16,    // the loaded-dice enter baseline, ramped by pressure²
  // The honest TRADE TAX (§2.2 carrier=commerce): a secrecy posture closes the market to
  // foreign merchants. Recorded as legible cost; wiring the bounded merchantAppetite/
  // tradeSalience penalty into the trade read is a thin deferred hook (like the DEMAND lane).
});

const TRADE_STAKE_LABELS = new Set(['trade_partner', 'client', 'patron', 'vassal']);

/** The watcher's prosperity as a 0..1 rank (the E1d prosperity vocabulary). Unknown ⇒ 0.5
 *  (non-blocking mid). @param {unknown} item @returns {number} */
function prosperity01Of(item) {
  const it = asObject(item);
  const s = it.settlement && typeof it.settlement === 'object' ? asObject(it.settlement) : it;
  const rank = prosperityRank(asObject(s.economicState).prosperity);
  const maxRank = Math.max(1, PROSPERITY_TIERS.length - 1);
  return rank < 0 ? 0.5 : clamp01(rank / maxRank);
}

/**
 * A settlement's CONCEALMENT PRESSURE (design §2.2 gating) in [0,1]: paranoia (malice-tinged
 * self-protection) + being weak before its believed-hostile neighbours' strength. Pure.
 * @param {{ malice01: number, threatenedWeakness01: number }} inputs @returns {number}
 */
export function secrecyPressure({ malice01, threatenedWeakness01 }) {
  const m = clamp01(finiteNumber(malice01, 0.5));
  const w = clamp01(finiteNumber(threatenedWeakness01, 0));
  const T = SIGHT_TUNING;
  return clamp01(T.HIDE_PARANOIA_W * m + T.HIDE_WEAKNESS_W * w);
}

/**
 * The STAKES a watcher holds against a target (design §2.1 EV) in [0,1]: war footing (a
 * believed-hostile, believed-strong target — you watch what you fear) + trade dependence
 * (you watch what you feed on). Pure.
 * @param {{ hostile: boolean, believedStrongerBand01: number, tradeDependence01: number }} inputs
 * @returns {number}
 */
export function sightStakes({ hostile, believedStrongerBand01, tradeDependence01 }) {
  const s = clamp01(finiteNumber(believedStrongerBand01, 0));
  const d = clamp01(finiteNumber(tradeDependence01, 0));
  const T = SIGHT_TUNING;
  const fear = hostile ? T.STAKES_HOSTILE_W * (0.5 + 0.5 * s) : 0;
  return clamp01(fear + T.STAKES_TRADE_W * d);
}

/**
 * Build the SEE/HIDE per-pair sight modifier closure the belief layer consumes (injected into
 * advanceBeliefMaps → reconcileSlot). Returns null when the layer is dormant OR neither posture
 * ledger has materialized — so advanceBeliefMaps is passed nothing and stays byte-identical.
 * The closure composes, for (observer, subject): the observer's SEE posture on the subject
 * (slows decay + floors accuracy), the subject's HIDE secrecy (raises everyone's staleness
 * about it), the observer's own HIDE secrecy (dims its inbound sight — symmetric isolation),
 * and the SEE↔HIDE counterplay (a hiding subject degrades the watcher's accuracy floor).
 * @param {{ spatialLedgers?: unknown, spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} worldState
 * @returns {((observerId: string, subjectId: string) => { decayKeep01: number, accuracyFloor01: number }) | null}
 */
export function makeSightFn(worldState) {
  if (!infoStatecraftActive(worldState)) return null;
  const hasSight = hasSpatialLedger(worldState, 'sightPostures');
  const hasSecrecy = hasSpatialLedger(worldState, 'secrecyPostures');
  if (!hasSight && !hasSecrecy) return null; // byte-identical
  const sight = asObject(getSpatialLedger(worldState, 'sightPostures'));
  const secrecy = asObject(getSpatialLedger(worldState, 'secrecyPostures'));
  const T = SIGHT_TUNING;
  return (/** @type {string} */ observerId, /** @type {string} */ subjectId) => {
    const seeF = clamp01(finiteNumber(asObject(asObject(sight[String(observerId)])[String(subjectId)]).fidelity01, 0));
    const subjSecrecy = clamp01(finiteNumber(asObject(secrecy[String(subjectId)]).level01, 0));
    const obsSecrecy = clamp01(finiteNumber(asObject(secrecy[String(observerId)]).level01, 0));
    const decayKeep01 = clamp(
      seeF * T.SEE_DECAY_KEEP - subjSecrecy * T.HIDE_STALENESS - obsSecrecy * T.HIDE_SELF_DIM,
      -1, 1,
    );
    // SEE↔HIDE counterplay: the target's secrecy degrades the watcher's paid-eyes accuracy.
    const accuracyFloor01 = clamp01(seeF * T.SEE_ACC_FLOOR * (1 - subjSecrecy));
    return { decayKeep01, accuracyFloor01 };
  };
}

/**
 * The watcher's active SEE fidelity on a target (0 when dormant / no posture) — the
 * supply-web coupling read (§2.1 "SEE prices the web read"). Pure, byte-neutral absent.
 * @param {{ spatialLedgers?: unknown, spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} worldState
 * @param {string} watcherId @param {string} targetId @returns {number}
 */
export function sightFidelityOf(worldState, watcherId, targetId) {
  if (!infoStatecraftActive(worldState)) return 0;
  if (!hasSpatialLedger(worldState, 'sightPostures')) return 0;
  const sight = asObject(getSpatialLedger(worldState, 'sightPostures'));
  return clamp01(finiteNumber(asObject(asObject(sight[String(watcherId)])[String(targetId)]).fidelity01, 0));
}

/**
 * One secrecy posture (spatialLedgers.secrecyPostures).
 * @typedef {{ level01: number, enteredTick: number }} SecrecyPosture
 */

/**
 * Advance the HIDE secrecy postures one tick (design §2.2): per settlement, a concealment
 * pressure (paranoia + weakness before believed-hostile strength) drives an enter/exit
 * hysteresis with dwell (paranoia is sticky); the ENTER is rarity-gated (E0 tempo). Pure;
 * deterministic (codepoint fold; rng forked per (sid, tick)). Returns the next ledger (or
 * null when no posture stands ⇒ drop-when-empty, byte-identical-dormant).
 * @param {Object} args
 * @param {{ settlements?: Array<{ id?: string|number }> }} args.snapshot
 * @param {Record<string, unknown>} args.priorSecrecy
 * @param {Record<string, unknown>} args.beliefMaps
 * @param {{ fork?: (label: string) => { random: () => number } } | null} args.rng
 * @param {number} args.tick
 * @param {(id: string) => number} args.strengthOf
 * @param {(id: string) => { malice01: number, lawfulness01: number }} args.alignmentOf
 * @returns {Record<string, SecrecyPosture> | null}
 */
export function processSecrecy({ snapshot, priorSecrecy, beliefMaps, rng, tick, strengthOf, alignmentOf }) {
  const T = SIGHT_TUNING;
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const strength = typeof strengthOf === 'function' ? strengthOf : () => 0.5;
  const alignOf = typeof alignmentOf === 'function' ? alignmentOf : () => ({ malice01: 0.5, lawfulness01: 0.5 });
  const prior = asObject(priorSecrecy);
  const sids = [...new Set((snapshot?.settlements || []).map((s) => String(s.id)))].sort(compareCodepoint);
  /** @type {Record<string, SecrecyPosture>} */
  const next = {};
  for (const sid of sids) {
    // Weakness before believed-hostile strength (its OWN seat map — like the LIE desperation read).
    const selfBand = strengthBandOf(clamp01(strength(sid)));
    const seat = asObject(asObject(beliefMaps[sid])[GOVERNING_SEAT_KEY]);
    let worstGap = 0;
    for (const other of Object.keys(seat)) {
      const b = /** @type {BeliefRecord} */ (seat[other]);
      if (!b || typeof b !== 'object' || !HOSTILE_LABELS.has(String(b.allianceLabel))) continue;
      worstGap = Math.max(worstGap, (Math.round(finiteNumber(b.strengthBand, 2)) - selfBand) / 4);
    }
    const a = alignOf(sid);
    const pressure = secrecyPressure({ malice01: finiteNumber(a?.malice01, 0.5), threatenedWeakness01: clamp01(worstGap) });
    const priorRec = asObject(prior[sid]);
    const wasGuarded = Object.keys(priorRec).length > 0;
    const since = wasGuarded ? Math.floor(finiteNumber(priorRec.enteredTick, now)) : now;
    let guarded = wasGuarded;
    if (!wasGuarded) {
      // ENTER — rarity-gated (a posture change is drama-classed spontaneity).
      if (pressure >= T.HIDE_ENTER) {
        const fork = rng && typeof rng.fork === 'function' ? rng.fork(`infowar-hide:${sid}:${now}`) : null;
        const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 1)) : 1;
        if (u < T.HIDE_ENGAGE_BASE * pressure * pressure) guarded = true;
      }
    } else if (pressure < T.HIDE_EXIT && (now - since) >= T.HIDE_DWELL) {
      guarded = false; // hysteresis EXIT: below the deadband AND dwelled (paranoia is sticky)
    }
    if (guarded) {
      // A guarded settlement holds at least the exit-threshold level (still on guard as the
      // immediate pressure ebbs — what dwell models); a fresh enter stamps `now`.
      next[sid] = { level01: round4(clamp01(Math.max(pressure, T.HIDE_EXIT))), enteredTick: wasGuarded ? since : now };
    }
  }
  if (!Object.keys(next).length) return null;
  /** @type {Record<string, SecrecyPosture>} */
  const sorted = {};
  for (const k of Object.keys(next).sort(compareCodepoint)) sorted[k] = next[k];
  return sorted;
}

/**
 * One sight posture (spatialLedgers.sightPostures[watcher][target]).
 * @typedef {{ fidelity01: number, enteredTick: number, upkeep: number, covert: boolean }} SightPosture
 */

/**
 * Advance the SEE sight postures one tick (design §2.1): per (watcher, target), a watcher with
 * STAKES (war footing / trade dependence) + a CHANNEL (it has news of the target) + AFFORDABILITY
 * (the prosperity-vocabulary upkeep gate) ENGAGES (rarity-gated) or MAINTAINS paid eyes; a posture
 * whose stakes vanished or that the watcher can no longer afford DROPS (the eyes go quiet). A covert
 * posture on a HIDING target is EXPOSED at odds rising with the target's secrecy (the SEE↔HIDE
 * counterplay) ⇒ the deniable-until-lineage blowback triple against the watcher (grievance +
 * legitimacy + credibility) and the eyes are burned. Pure; deterministic (codepoint folds; rng
 * forked per stable key). Returns the next ledger, the credibility deltas, the grievances, and the
 * legible exposure news.
 * @param {Object} args
 * @param {{ byId?: Map<string, unknown>, settlements?: Array<{ id?: string|number }> }} args.snapshot
 * @param {Record<string, unknown>} args.priorSight
 * @param {Record<string, unknown>} args.secrecy  the secrecy ledger read for exposure odds (read-last)
 * @param {Record<string, unknown>} args.beliefMaps
 * @param {{ fork?: (label: string) => { random: () => number } } | null} args.rng
 * @param {number} args.tick
 * @param {(id: string) => string} args.nameFor
 * @returns {{ sight: Record<string, Record<string, SightPosture>> | null, deltas: CredibilityDelta[], grievances: GrievanceWrite[], newsEntries: Array<Record<string, unknown>> }}
 */
export function processSight({ snapshot, priorSight, secrecy, beliefMaps, rng, tick, nameFor }) {
  const T = SIGHT_TUNING;
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const name = typeof nameFor === 'function' ? nameFor : (/** @type {string} */ id) => String(id);
  const byId = snapshot?.byId instanceof Map ? snapshot.byId : new Map();
  const prior = asObject(priorSight);
  const secrecyLedger = asObject(secrecy);
  const watchers = [...new Set((snapshot?.settlements || []).map((s) => String(s.id)))].sort(compareCodepoint);
  /** @type {Record<string, Record<string, SightPosture>>} */
  const next = {};
  /** @type {CredibilityDelta[]} */
  const deltas = [];
  /** @type {GrievanceWrite[]} */
  const grievances = [];
  /** @type {Array<Record<string, unknown>>} */
  const newsEntries = [];

  for (const watcherId of watchers) {
    const item = byId.get(watcherId);
    if (!item) continue;
    const prosperity01 = prosperity01Of(item);
    const isMerchant = governingCoalition(/** @type {Parameters<typeof governingCoalition>[0]} */ (item)).governing === 'merchant';
    const seat = asObject(asObject(beliefMaps[watcherId])[GOVERNING_SEAT_KEY]);
    const priorWatch = asObject(prior[watcherId]);
    const targets = [...new Set([...Object.keys(seat), ...Object.keys(priorWatch)])].sort(compareCodepoint);
    /** @type {Record<string, SightPosture>} */
    const watcherOut = {};
    for (const targetId of targets) {
      if (targetId === watcherId) continue;
      const belief = /** @type {BeliefRecord | undefined} */ (seat[targetId]);
      const hasChannel = !!(belief && typeof belief === 'object'); // it has news of the target
      const hostile = hasChannel && HOSTILE_LABELS.has(String(belief?.allianceLabel));
      const tradeDep = hasChannel && TRADE_STAKE_LABELS.has(String(belief?.allianceLabel)) ? 1 : 0;
      const targetBand = hasChannel ? Math.round(finiteNumber(belief?.strengthBand, 2)) : 2;
      const stakes = sightStakes({ hostile, believedStrongerBand01: clamp01(targetBand / 4), tradeDependence01: tradeDep });
      const priorPosture = asObject(priorWatch[targetId]);
      const hadPosture = Object.keys(priorPosture).length > 0;
      const fidelity = hadPosture
        ? clamp01(finiteNumber(priorPosture.fidelity01, T.FIDELITY_BASE))
        : clamp01(T.FIDELITY_BASE + T.FIDELITY_STAKES_GAIN * stakes);
      const affordFloor = (T.UPKEEP_AFFORD_FLOOR + T.UPKEEP_FIDELITY_COST * fidelity) * (isMerchant ? T.MERCHANT_UPKEEP_RELIEF : 1);
      const canAfford = prosperity01 >= affordFloor;

      // EXPOSURE of an existing COVERT posture (deniable-until-lineage): a hiding target
      // catches the watchers at odds rising with its secrecy ⇒ the blowback triple; eyes burned.
      if (hadPosture && priorPosture.covert !== false) {
        const targetSecrecy = clamp01(finiteNumber(asObject(secrecyLedger[targetId]).level01, 0));
        const exposeOdds = clamp01(T.EXPOSE_BASE + T.EXPOSE_SECRECY_GAIN * targetSecrecy);
        const fork = rng && typeof rng.fork === 'function' ? rng.fork(`infowar-see-expose:${watcherId}:${targetId}:${now}`) : null;
        const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 1)) : 1;
        if (u < exposeOdds) {
          deltas.push({ id: watcherId, kind: 'deception', magnitude01: T.EXPOSE_CHARGE01 });
          grievances.push({ a: targetId, b: watcherId, magnitude01: T.EXPOSE_GRIEVANCE_W, incidentType: 'spy_exposed' });
          newsEntries.push({
            kind: 'infowar_spy_exposed',
            headline: `${name(watcherId)}'s eyes in ${name(targetId)} go quiet`,
            summary: `${name(targetId)} closed its gates and caught the watchers within: ${name(watcherId)}'s paid eyes are exposed. The lineage traces back to ${name(watcherId)}'s own court — a covert watch, now a public grievance.`,
            reasons: [
              `${name(targetId)}'s secrecy tightened until the informants were found; deniability collapsed with the lineage.`,
              `A court caught spying on a neighbour pays in credibility at home and grievance abroad — the blowback the covert instruments always carry.`,
            ],
            settlementIds: [String(watcherId), String(targetId)],
            significance: 'notable',
            score: 59,
            tick: now,
            tags: ['world_pulse', 'infowar', 'see', 'spy_exposed', 'grievance', 'legitimacy'],
          });
          continue; // drop the burned posture
        }
      }

      if (hadPosture) {
        // MAINTAIN while the stakes hold AND the watcher can still afford the eyes; else DROP.
        if (stakes >= T.STAKES_FLOOR && canAfford) {
          watcherOut[targetId] = {
            fidelity01: round4(fidelity),
            enteredTick: Math.floor(finiteNumber(priorPosture.enteredTick, now)),
            upkeep: round4(affordFloor),
            covert: priorPosture.covert !== false,
          };
        }
      } else if (hasChannel && stakes >= T.STAKES_FLOOR && canAfford) {
        // ENGAGE — rarity-gated (a posture change is drama-classed spontaneity). Covert by default.
        const fork = rng && typeof rng.fork === 'function' ? rng.fork(`infowar-see-engage:${watcherId}:${targetId}:${now}`) : null;
        const u = fork && typeof fork.random === 'function' ? clamp01(finiteNumber(fork.random(), 1)) : 1;
        if (u < T.ENGAGE_BASE * stakes * stakes) {
          watcherOut[targetId] = { fidelity01: round4(fidelity), enteredTick: now, upkeep: round4(affordFloor), covert: true };
        }
      }
    }
    if (Object.keys(watcherOut).length) {
      /** @type {Record<string, SightPosture>} */
      const sortedTargets = {};
      for (const k of Object.keys(watcherOut).sort(compareCodepoint)) sortedTargets[k] = watcherOut[k];
      next[watcherId] = sortedTargets;
    }
  }
  /** @type {Record<string, Record<string, SightPosture>> | null} */
  let sight = null;
  if (Object.keys(next).length) {
    sight = {};
    for (const k of Object.keys(next).sort(compareCodepoint)) sight[k] = next[k];
  }
  return { sight, deltas, grievances, newsEntries };
}

// ── SHARE-SELL (design §2.4 SELL lane) — the self-policing market feedback ───────
/**
 * One resolved intel sale, ready to feed the credibility stock.
 * @typedef {{ sellerId: string, accurate: boolean, magnitude01?: number }} ResolvedIntelSale
 */

/**
 * THE SELF-POLICING MARKET (design §2.4/§4): a sale later proven FALSE feeds a `deception`
 * CredibilityDelta against the SELLER (bad product damages the seller's stock → its future
 * sales are priced lower, since intelSalePrice discounts by the seller's credibility weight);
 * a sale proven TRUE feeds a slow `proven_true` rise. Expressible ENTIRELY with the live
 * credibility stock — no parallel ledger. Deterministic (codepoint-sorted). Pure.
 * @param {ReadonlyArray<ResolvedIntelSale>} sales @returns {CredibilityDelta[]}
 */
export function intelSaleCredibilityDeltas(sales) {
  /** @type {CredibilityDelta[]} */
  const out = [];
  for (const sale of (Array.isArray(sales) ? sales : [])) {
    if (!sale || sale.sellerId == null) continue;
    out.push({
      id: String(sale.sellerId),
      kind: sale.accurate === true ? 'proven_true' : 'deception',
      magnitude01: clamp01(finiteNumber(sale.magnitude01, 1)),
    });
  }
  return out.sort((a, b) => compareCodepoint(String(a.id), String(b.id)) || (a.kind < b.kind ? -1 : a.kind > b.kind ? 1 : 0));
}

// ── The grievance-edge writer (SEE/LIE exposure → the E1 incident machinery) ─────
/** The REAL graph edge key between two settlements (relationshipStates is keyed by the edge's
 *  own id, so a synthesized key would orphan the overlay). Mirrors peaceTerms.edgeKeyBetween.
 *  @param {Array<Record<string, unknown>>} edges @param {string} a @param {string} b @returns {string | null} */
function edgeKeyBetween(edges, a, b) {
  for (const edge of (Array.isArray(edges) ? edges : [])) {
    const f = edge?.from != null ? String(edge.from) : '';
    const t = edge?.to != null ? String(edge.to) : '';
    if ((f === a && t === b) || (f === b && t === a)) return relationshipKeyFromEdge(edge);
  }
  return null;
}

/**
 * Apply this tick's exposure grievances through the E1 incident machinery (applyRelationshipPatch):
 * bump the shared (a↔b) edge's resentment + stamp a typed incident — so it feeds warReasons'
 * scoreGrievance/scoreRevanchism the SAME tick. No real edge ⇒ a byte-safe skip. Deterministic
 * (codepoint-sorted folds). @param {Record<string, unknown>} worldState
 * @param {Array<Record<string, unknown>>} edges @param {GrievanceWrite[]} grievances @param {unknown} now
 * @returns {Record<string, unknown>}
 */
function applyExposureGrievances(worldState, edges, grievances, now) {
  let ws = worldState;
  const list = (Array.isArray(grievances) ? grievances : [])
    .slice()
    .sort((x, y) => compareCodepoint(`${x.a}|${x.b}`, `${y.a}|${y.b}`) || (finiteNumber(x.magnitude01, 0) - finiteNumber(y.magnitude01, 0)));
  for (const g of list) {
    const key = edgeKeyBetween(edges, String(g.a), String(g.b));
    if (!key) continue;
    const cur = asObject(asObject(/** @type {{ relationshipStates?: unknown }} */ (ws).relationshipStates)[key]);
    const resentment = clamp01(finiteNumber(cur.resentment, 0) + finiteNumber(g.magnitude01, 0));
    ws = /** @type {Record<string, unknown>} */ (applyRelationshipPatch(ws, {
      relationshipKey: key,
      relationshipPatch: { resentment },
      metadata: { incidentType: g.incidentType || 'deception_betrayal' },
      severity: clamp01(finiteNumber(g.magnitude01, 0)),
      proposalPayload: null,
    }, now));
  }
  return ws;
}

// ── THE MOVER — one pure step per pulse tick ───────────────────────────────────
/**
 * Advance information statecraft one tick over the just-advanced belief maps:
 *   (1) HIDE — advance the secrecy postures (concealment pressure → enter/exit hysteresis);
 *   (2) SEE — advance the sight postures (engage/maintain/drop + covert exposure blowback);
 *   (3) LIE — the disinformation lifecycle (seed → contradict → expose → blowback);
 *   (4) GRIEVANCE — write SEE/LIE exposure grievances through the E1 incident machinery;
 *   (5) CREDIBILITY — fold ALL this-tick deltas (fractures + exposed lies + exposed spies +
 *       proven-true signals, incl. resolved intel sales) into the stock.
 * The sight/secrecy postures written here shape NEXT tick's belief advance (read-last/write-
 * next — the makeSightFn closure the kernel passes to advanceBeliefMaps reads the persisted
 * ledgers). Secrecy + sight both read the PRIOR persisted ledgers (order-independent).
 * DORMANT (gate dark) ⇒ an immediate no-op (no fork, no key) — byte-identical.
 *
 * @param {Object} args
 * @param {{ byId?: Map<string, { id?: string|number }>, settlements?: Array<{ id?: string|number }> }} args.snapshot
 * @param {Record<string, unknown>} args.worldState  the ensured worldState (post-belief-advance)
 * @param {{ edges?: Array<Record<string, unknown>> } | null} [args.graph]  the regional graph (grievance edge resolution)
 * @param {{ fork?: (label: string) => { random: () => number } } | null} [args.rng]
 * @param {number} args.tick
 * @param {unknown} [args.now]  the deterministic overlay stamp for the grievance write (never a wall clock)
 * @param {(id: string) => number} args.strengthOf  ground-truth 0..1 strength
 * @param {(id: string) => { malice01: number, lawfulness01: number }} [args.alignmentOf]  derived alignment
 * @param {(id: string) => string} [args.nameFor]
 * @param {CredibilityDelta[]} [args.provenTrue]  proven-true rises + resolved intel sales (SHARE-SELL self-policing)
 * @param {import('./npcCredibility.js').NpcCredibilityDelta[]} [args.npcProvenTrue]  D-2/D-3: per-NPC proven-true rises (a mouthpiece's sale/warning proved out)
 * @returns {{ worldState: unknown, changed: boolean, newsEntries: Array<Record<string, unknown>> }}
 */
export function advanceInformationStatecraft({ snapshot, worldState, graph = null, rng = null, tick, now = null, strengthOf, alignmentOf, nameFor, provenTrue = [], npcProvenTrue = [] }) {
  if (!infoStatecraftActive(worldState)) {
    return { worldState, changed: false, newsEntries: [] };
  }
  let state = /** @type {Record<string, unknown>} */ (worldState);
  let changed = false;
  const snap = /** @type {{ byId?: Map<string, { id?: string|number }>, settlements?: Array<{ id?: string|number }> }} */ (snapshot);
  const strengthFn = strengthOf || (() => 0.5);
  const alignFn = alignmentOf || (() => ({ malice01: 0.5, lawfulness01: 0.5 }));
  const nameFn = nameFor || ((/** @type {string} */ id) => String(id));
  const beliefMaps = asObject(getSpatialLedger(state, 'beliefMaps'));

  // Read the PRIOR posture ledgers ONCE (both movers read read-last/write-next; the sight
  // exposure reads the prior secrecy — order-independent).
  const priorSecrecy = asObject(getSpatialLedger(state, 'secrecyPostures'));
  const priorSight = asObject(getSpatialLedger(state, 'sightPostures'));

  // (1) HIDE — the secrecy postures.
  const nextSecrecy = processSecrecy({ snapshot: snap, priorSecrecy, beliefMaps, rng, tick, strengthOf: strengthFn, alignmentOf: alignFn });
  const prevSec = JSON.stringify(Object.keys(priorSecrecy).length ? priorSecrecy : null);
  const nextSec = JSON.stringify(nextSecrecy);
  if (prevSec !== nextSec) {
    state = /** @type {Record<string, unknown>} */ (nextSecrecy
      ? setSpatialLedger(state, 'secrecyPostures', nextSecrecy)
      : dropSpatialLedger(state, 'secrecyPostures'));
    changed = true;
  }

  // (2) SEE — the sight postures (exposure reads the PRIOR secrecy).
  const sightRes = processSight({ snapshot: snap, priorSight, secrecy: priorSecrecy, beliefMaps, rng, tick, nameFor: nameFn });
  const prevSi = JSON.stringify(Object.keys(priorSight).length ? priorSight : null);
  const nextSi = JSON.stringify(sightRes.sight);
  if (prevSi !== nextSi) {
    state = /** @type {Record<string, unknown>} */ (sightRes.sight
      ? setSpatialLedger(state, 'sightPostures', sightRes.sight)
      : dropSpatialLedger(state, 'sightPostures'));
    changed = true;
  }

  // (3) THE LIE LIFECYCLE over the just-advanced beliefMaps.
  const lie = processLies({ snapshot: snap, worldState: state, beliefMaps, rng, tick, strengthOf: strengthFn, alignmentOf: alignFn, nameFor: nameFn });
  if (lie.overrides.size) {
    const nextMaps = applyBeliefOverrides(beliefMaps, lie.overrides);
    state = /** @type {Record<string, unknown>} */ (setSpatialLedger(state, 'beliefMaps', nextMaps));
    changed = true;
  }
  const priorDisinfo = asObject(getSpatialLedger(state, 'disinfo'));
  const prevD = JSON.stringify(Object.keys(priorDisinfo).length ? priorDisinfo : null);
  const nextD = JSON.stringify(lie.disinfo);
  if (prevD !== nextD) {
    state = /** @type {Record<string, unknown>} */ (lie.disinfo
      ? setSpatialLedger(state, 'disinfo', lie.disinfo)
      : dropSpatialLedger(state, 'disinfo'));
    changed = true;
  }

  // (4) GRIEVANCE — SEE + LIE exposure grievances through the E1 incident machinery (feeds
  //     scoreGrievance/revanchism the same tick). No graph edge ⇒ a byte-safe skip.
  const edges = Array.isArray(graph?.edges) ? /** @type {Array<Record<string, unknown>>} */ (graph.edges) : [];
  const grievances = [...sightRes.grievances, ...lie.grievances];
  if (edges.length && grievances.length) {
    const withGrievance = applyExposureGrievances(state, edges, grievances, now);
    if (withGrievance !== state) { state = withGrievance; changed = true; }
  }

  // (5) CREDIBILITY: fold fractures (recorded-not-enforced seam) + exposed lies + exposed
  //     spies + proven-true (incl. resolved intel sales) into the stock.
  const deltas = [
    ...fractureCredibilityDeltas(state, tick),
    ...sightRes.deltas,
    ...lie.deltas,
    ...(Array.isArray(provenTrue) ? provenTrue : []),
  ];
  const cred = advanceCredibility({ worldState: state, tick, deltas });
  if (cred.changed) { state = /** @type {Record<string, unknown>} */ (cred.worldState); changed = true; }

  // (5b) NPC CREDIBILITY (D-2): fold the per-NPC deltas (exposed-lie mouthpieces + D-3's
  //      resolved intel-sale self-policing) into the per-NPC stock; prune vanished NPCs (the
  //      roster scan — DM remove_npc leaves no dangling npcCredibility key). Gated: dark ⇒ a
  //      complete no-op (no key). The ladder consumes the lieExposure deposit NEXT tick.
  if (npcCredibilityActive(state)) {
    const npcDeltas = [...lie.npcDeltas, ...(Array.isArray(npcProvenTrue) ? npcProvenTrue : [])];
    if (npcDeltas.length || hasNpcCredibilityLedger(state)) {
      const liveNpcIds = buildLiveNpcIds(snap);
      const npcCred = advanceNpcCredibility({ worldState: state, tick, deltas: npcDeltas, liveNpcIds });
      if (npcCred.changed) { state = /** @type {Record<string, unknown>} */ (npcCred.worldState); changed = true; }
    }
  }

  return { worldState: state, changed, newsEntries: [...sightRes.newsEntries, ...lie.newsEntries] };
}

/* ───────────────────────────────────────────────────────────────────────────────
 * SEAM NOTES — the four verbs are now BUILT (W-DOCTRINE-2a: CREDIBILITY + LIE; 2b: SEE +
 * HIDE + SHARE-SELL). What remains DEFERRED (documented, not a bug to re-find):
 *
 * HIDE TRADE TAX (design §2.2 carrier=commerce): a secrecy posture closes the market to
 *   foreign merchants — a bounded trade-pressure penalty. The posture is legible + the cost
 *   is narrated; wiring the actual merchantAppetite/tradeSalience penalty into the trade read
 *   is a thin downstream hook, NOT a pinned effect (the pinned HIDE effect is the symmetric-
 *   isolation belief-decay). Deferred with the DEMAND lane below.
 *
 * SEE UPKEEP as a prosperity DRAIN (design §2.1): modelled as an affordability GATE priced in
 *   the E1d prosperity vocabulary (a watcher too poor loses its eyes), NOT a per-tick prosperity
 *   debit — the coarse 7-band ladder rounds a small sub-band drain to nil, and draining would
 *   couple this mover into the settlementUpdates mutation lane it stays out of (byte-cleanliness).
 *   See the JUDGMENT at SIGHT_TUNING.UPKEEP_*. Reversal is a thin add if a real drain is wanted.
 *
 * SHARE-SELL DEMAND lane (design §2.4 — peace disclosure terms): peaceTerms.js TERM_CATALOG
 *   .disclosure (executor:'seam') — a signed disclosure term should CREDIT the loser's
 *   credibility (an open court is verifiable) at the draftTerm executor:'seam' branch. That is
 *   W-PEACE's seam to close (design §9: the DEMAND hook lands with its host engine), not this
 *   module's; the credibility stock it would feed is live here (a `proven_true` delta).
 *
 * SHARE-SELL autonomous SELLER mover: the SELL lane ships as the priced instrument
 *   (generosityEV.intelSalePrice, credibility-discounted) + the self-policing feedback
 *   (intelSaleCredibilityDeltas → the credibility stock), demonstrable as a closed loop. A
 *   fully autonomous per-tick seller mover is deliberately NOT wired — the design §8 soak warns
 *   against a "constant whisper-war hum"; the SELL primitives are available to future wiring /
 *   the DM-verb path, mirroring how E1a registered `warning` LIVE without an autonomous spammer.
 * ─────────────────────────────────────────────────────────────────────────────── */

