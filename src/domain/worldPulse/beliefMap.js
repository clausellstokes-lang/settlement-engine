/**
 * domain/worldPulse/beliefMap.js — Phase 5.5 WAVE A: THE BELIEF MAP.
 *
 * The fog of war made a first-class, DM-visible structure. A settlement no
 * longer reasons over ground truth about its neighbours; it reasons over what
 * it BELIEVES — a possibly-wrong, possibly-STALE model of the world, fed by the
 * STEP-3.5 rumor ledger and decaying with silence. The gap between belief and
 * truth is where misjudgment (and the wars it starts) lives (design §4g).
 *
 *   worldState.beliefMaps = { [observerId]: { [factionId]: { [subjectId]:
 *     { readiness, strengthBand, allianceLabel, faithLabel, confidence01,
 *       lastUpdateTick } } } }
 *
 * a NEW conditionally-materialized worldState key (the conquestFeeds template:
 * absent ⇒ prior bytes; deepCloneConditionalLedger round-trips the 3-level
 * nesting). THE FACTION KEY IS PRESENT FROM DAY ONE (round-14 / VI.4-1): v1
 * carries a single 'seat' slot — the GOVERNING COALITION'S operational belief —
 * so per-faction belief (merchant/military/clergy/…, each fed by its round-9
 * carrier) can light in Wave B WITHOUT a schema break. Do NOT bake a single-
 * settlement-mind assumption into the key.
 *
 * THE GATE IS ORTHOGONAL (PART IV §IV.4): beliefs activate on
 * `spatialCanonVersion` present AND infoMode != 'omniscient' — NEVER on
 * settlementStrategyEnabled (the war faculty is already live for some
 * campaigns). Marker absent OR omniscient ⇒ the reads fall back to GROUND TRUTH
 * VERBATIM, forking no rng (the fidelityNoise neutrality-theorem discipline —
 * byte-exact today). SELF-reads stay ground truth (§IV.4 carve-out).
 *
 * COLD-START (VI.4, binding): at the first active advance, beliefs INITIALIZE TO
 * GROUND TRUTH AS-OF-CANONIZE (confidence 1.0) for the observer's declared
 * relationship neighbourhood — the settlements it "has news of" at opt-in. The
 * fog ACCUMULATES from there; the dormant→active transition is non-paranoid.
 * Growth BEYOND the neighbourhood is arrival-gated: an (observer,subject) entry
 * materializes ONLY when a rumor actually reached the observer (§IV.3-1 — never
 * pre-populate all-pairs; the sparse informational neighbourhood is the cap).
 *
 * THE UPDATE RULE (V.4 — modelled node-for-node on advanceInstitutionTolerance):
 * per (observer, subject, attribute) a WEIGHTED RECONCILIATION of the decayed
 * prior + this window's reports, weights = provenance (hop reliability) × recency
 * (tick-delta) × INDEPENDENCE (3.5's lineage count, V.3 — echoes of one origin
 * weigh ~one, not five) × report completeness. A fresh report RE-ANCHORS the
 * belief toward CURRENT ground truth, degraded by its fidelity (accuracy pulls a
 * garbled telling toward the neutral midpoint). CONTRADICTION widens uncertainty
 * (a report far from the prior drops confidence — a contested belief).
 * CONFIDENCE DECAYS with silence: pure arithmetic on (tick − lastUpdateTick),
 * NO rng (round 13 / §IV.3-4). Total-order fold: reports sorted (arrival desc,
 * score desc, completeness desc, codepoint key) BEFORE folding; observers +
 * subjects codepoint-sorted.
 *
 * PURE + lazy: no Date, no Math.random, no mutation, no tier/auth reads. A
 * worldPulse leaf (the lazy engine chunk) — zero first-paint bytes. Imported by
 * the settlementStrategy chooser (the three re-plumbed reads) and the pulse
 * kernel (the advance + the misjudgment news).
 */

import { compareCodepoint } from '../deterministicSort.js';
import { factionArchetype } from '../factionArchetypes.js';
import { infoModeOf } from './simulationRules.js';
import { settlementStrength, buildPressureSummary } from './relationshipEvolution.js';
import { hasSpatialLedger, getSpatialLedger, activeSpatialDigest } from '../spatial/distanceRead.js';
import { hopDelayTicks } from './distancePricedNews.js';
import { beliefAxesActive, axisGroundTruth, foldBeliefAxes } from './beliefAxes.js';

// ── The v1 faction slot + the M9a per-faction dimension ───────────────────────
/** The governing seat's operational belief — the v1 map that DRIVES the war
 *  chooser (settlementStrategy). Fed by ALL reports (byte-identical to Wave A);
 *  M9a leaves this slot UNCHANGED and lights the per-faction slots ALONGSIDE it. */
export const GOVERNING_SEAT_KEY = 'seat';

/** Reserved one-key SEED SENTINEL (not a settlement id — save ids never start
 *  with `__`). It records the spatialCanonVersion a belief map was cold-started
 *  at, and materializes ONLY at the decayed-empty boundary, so a belief ledger
 *  that decays fully below MIN_CONFIDENCE is not mistaken for "never seeded" and
 *  re-cold-started to omniscient ground truth. Silence deepens fog; only a
 *  genuine re-canonize (version bump) re-seeds. [spatial-engine-5] */
export const BELIEF_SEED_KEY = '__seededAt';

/** The populace's common-knowledge belief — fed by the AMBIENT stream (firsthand,
 *  un-carrier-tagged tellings) PLUS whatever a COMPROMISED faction leaks (M9a
 *  leakage). A political faction, always eligible (the populace needs no roster seat). */
export const PUBLIC_FACTION_KEY = 'public';

/**
 * M9a — THE CARRIER↔FACTION PARTITION (design §VI, "faction belief maps are the
 * NATURAL PARTITION of the information the carriers already deliver"). A rumor
 * arrival carries carrier-bias FRAMING tags (round-9 carriers: trade→'merchant',
 * army→'army', smuggle→'criminal', ship→'ship', faith→'faith'). Each political
 * faction's belief is fed ONLY by the reports whose carrier feeds it:
 *   merchant  ← the TRADE carrier (framing 'merchant')
 *   military  ← the ARMY / courier carrier (framing 'army')
 *   criminal  ← the SMUGGLE carrier (framing 'criminal')
 *   religious ← the FAITH carrier (framing 'faith') — a SEAM: no faith carrier is
 *               lit yet, so this slot stays empty until the faith mover lights it.
 * The 'public' slot is the AMBIENT (untagged) stream, handled separately. Frozen so
 * a typo'd archetype reads `undefined`. */
export const FACTION_CARRIER_FRAMING = Object.freeze({
  merchant: 'merchant',
  military: 'army',
  criminal: 'criminal',
  religious: 'faith',
});

// ── Tuning (documented here; retuned in the checkpoint soak) ──────────────────
export const BELIEF_TUNING = Object.freeze({
  // Confidence multiplier per SILENT tick (no fresh report). Half-life ≈ 8 ticks
  // (~2 months at one-week ticks): a belief you hear nothing about grows unsure.
  SILENCE_DECAY: 0.92,
  // Prune a belief below this confidence — the observer has effectively forgotten
  // (absence-as-information: the selector then reads MAX-UNCERTAINTY). Bounds the
  // ledger cardinality (the conditional-ledger "drops when empty" idiom).
  MIN_CONFIDENCE: 0.03,
  // Confidence GAINED per unit of aggregate report weight (a well-sourced, fresh,
  // independent telling rebuilds certainty; a distant echo barely moves it).
  CONF_GAIN: 0.6,
  // Contradiction → confidence PENALTY scale: how far a report's observed value
  // sits from the prior belief widens uncertainty (a contested belief).
  CONTRA_W: 0.5,
  // Provenance: weight ×= HOP_DECAY^hopCount — firsthand (hop 0) is fully trusted,
  // road-worn word less so.
  HOP_DECAY: 0.75,
  // Recency: weight ×= RECENCY_DECAY^ageTicks — old news informs a current picture
  // less than fresh news.
  RECENCY_DECAY: 0.85,
  // Independence (V.3): weight_indep = INDEP_BASE + INDEP_PER × independentSources.
  // One source → 1.0; three INDEPENDENT tellings → 2.0; five ECHOES of one origin
  // (merged to independence 1 in the rumor ledger) → 1.0. Independence beats the
  // echo chamber.
  INDEP_BASE: 0.5,
  INDEP_PER: 0.5,
  // Aggregate accuracy at/above which a fresh report lets the observer ADOPT the
  // current true CATEGORICAL value (relationship label / faith); below it the
  // stale label survives (low-fidelity news does not overturn a settled view).
  CAT_ADOPT_ACCURACY: 0.6,
  // The MAX-UNCERTAINTY reads (marker present, no belief record) — mid strength,
  // low readiness (a settlement assumes an unknown neighbour is average + calm).
  NEUTRAL_STRENGTH_BAND: 2,
  NEUTRAL_READINESS: 0.25,
  // How recent (ticks) a rumor must be to MATERIALIZE a brand-new belief about a
  // subject the observer had no prior belief for (bounds resurrection of a pruned
  // belief by very old word).
  MATERIALIZE_WINDOW: 8,
  // A vassal-siege belief is only ACTED on (recall the army) when the lord holds
  // fresh enough intel; below this confidence the besieged vassal goes unrelieved
  // (the info-starvation tragedy).
  SIEGE_AWARENESS_CONFIDENCE: 0.35,
  // MISJUDGMENT: the chooser acted on a strength belief this many bands off the
  // truth (a two-band error on a five-band scale), OR on a stale relationship
  // label that reads hostile when the truth is not.
  MISJUDGE_BAND_DELTA: 2,
});

// The number of strength bands (0..4) beliefs are quantized to — a belief is
// coarse; you do not know a rival's army to the man.
const STRENGTH_BANDS = 5;

// Ground-truth war readiness for a warPosture state (0 calm … 1 in the field).
const READINESS_BY_POSTURE = Object.freeze({
  peace: 0, alert: 0.25, war_preparation: 0.5, mobilized: 0.75,
  deployed: 1, war_exhaustion: 0.4, demobilizing: 0.15,
});

// ── Small pure helpers ────────────────────────────────────────────────────────
/** @param {number} x @param {number} lo @param {number} hi @returns {number} */
const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x);
/** @param {number} x @returns {number} */
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}
/** @param {number} v @returns {number} 4-dp round for byte-tidy persisted floats */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

/** A 0..1 strength score → its integer band (0..STRENGTH_BANDS-1).
 *  @param {number} strength01 @returns {number} */
export function strengthBandOf(strength01) {
  return clamp(Math.floor(clamp01(finiteNumber(strength01, 0.5)) * STRENGTH_BANDS), 0, STRENGTH_BANDS - 1);
}

/** The representative 0..1 strength of a band (the band midpoint) — what a
 *  banded belief "reads as" when the chooser needs a number.
 *  @param {number} band @returns {number} */
export function strengthOfBand(band) {
  const b = clamp(Math.round(finiteNumber(band, BELIEF_TUNING.NEUTRAL_STRENGTH_BAND)), 0, STRENGTH_BANDS - 1);
  return (b + 0.5) / STRENGTH_BANDS;
}

// ── The activation gate (ORTHOGONAL to settlementStrategyEnabled) ─────────────
/**
 * Beliefs are LIVE iff the spatial-canon marker is present AND infoMode is not
 * omniscient. This is the whole dormancy/byte-identity seam: false ⇒ every read
 * falls back to ground truth verbatim, forking no rng.
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} worldState
 * @returns {boolean}
 */
export function beliefsActive(worldState) {
  if (!worldState || typeof worldState !== 'object') return false;
  const marker = worldState.spatialCanonVersion;
  if (!(Number.isInteger(marker) && Number(marker) > 0)) return false;
  return infoModeOf(worldState.simulationRules) !== 'omniscient';
}

// ── Ledger accessors ──────────────────────────────────────────────────────────
/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/**
 * The observer's belief record about a subject (the governing-seat slot), or
 * null. Total on garbage.
 * @param {{ spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} observerId @param {string} subjectId
 * @param {string} [factionId]
 * @returns {BeliefRecord | null}
 */
export function beliefRecord(worldState, observerId, subjectId, factionId = GOVERNING_SEAT_KEY) {
  const maps = asObject(getSpatialLedger(worldState, 'beliefMaps'));
  const byFaction = asObject(maps[String(observerId)]);
  const bySubject = asObject(byFaction[String(factionId)]);
  const rec = bySubject[String(subjectId)];
  return rec && typeof rec === 'object' && !Array.isArray(rec) ? /** @type {BeliefRecord} */ (rec) : null;
}

/**
 * @typedef {Object} BeliefRecord
 * @property {number} readiness        believed war readiness 0..1
 * @property {number} strengthBand     believed strength band 0..STRENGTH_BANDS-1
 * @property {string} allianceLabel    believed relationship label (observer↔subject)
 * @property {string | null} faithLabel believed dominant faith (public deity name)
 * @property {number} confidence01     0..1
 * @property {number} lastUpdateTick   tick of the last refresh
 * @property {number} [populationTrendBand]  D-1 DEMOGRAPHIC axis: believed −2..+2 (emptying…swelling); present only when beliefAxesEnabled
 * @property {string | null} [observanceLabel]  D-1 CULTURAL axis: believed dominant rite `${motif}:${patron}`; present only when beliefAxesEnabled
 */

/**
 * @typedef {{ source: 'truth' } | { source: 'unknown' } | { source: 'belief', record: BeliefRecord }} BeliefResolution
 */

/**
 * THE ONE SELECTOR the three settlementStrategy reads route through. IDENTITY
 * FALLBACK: marker absent OR omniscient OR a SELF-read ⇒ { source: 'truth' } (the
 * caller uses ground truth verbatim, no rng). Marker present + a held record ⇒
 * { source: 'belief' }. Marker present + NO record ⇒ { source: 'unknown' }
 * (max-uncertainty — absence-as-information at the seam, §IV.3-5).
 * @param {string} observerId @param {string} subjectId
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>, spatialLedgers?: unknown } | null | undefined} worldState
 * @returns {BeliefResolution}
 */
export function belief(observerId, subjectId, worldState) {
  if (String(observerId) === String(subjectId)) return { source: 'truth' };   // self carve-out
  if (!beliefsActive(worldState)) return { source: 'truth' };                  // dormant ⇒ byte-exact
  const rec = beliefRecord(worldState, observerId, subjectId);
  return rec ? { source: 'belief', record: rec } : { source: 'unknown' };
}

// ── D1: DISTANCE-PRICED NEWS (DESIGN_SIM_DEPTH_R2 D1) ─────────────────────────
// Information pays for distance the way grain does: a fact about a FAR origin reads
// STALER to a distant observer, so misjudgment (the war-starter) grows with reach.
// A REFINEMENT of the infoMode seam, gated by the VIRTUAL flag
// `distancePricedNewsEnabled` — ABSENT from DEFAULT_SIMULATION_RULES *and every
// preset* ⇒ dark EVERYWHERE ⇒ byte-identical to every campaign and golden until the
// owner lights it (the preset-lighting question is parked on the owner queue; not
// added to the WAVES catalog here — zero eager bytes). It COMPOSES with the existing
// rumor-relay latency (rumorNetwork stamps arrivalTick += hopWeeks per graph hop):
// `hopDelayTicks` (distancePricedNews.js) is an ADDITIVE recency surcharge — the
// design's `effective age = actual age + hopDelayTicks(dist(O,S))` — applied ONCE per
// consuming path (the belief recency fold below; the player rumor display). The
// coherence matrix's "one delay application" rule is honored: the surcharge lands at
// the recency fold, NEVER doubled against the credibility/fidelity axes. Its size is
// owner-retunable at NEWS_SPEED_FACTOR; DM-truth surfaces are NEVER delayed (they are
// not world actors — the delay is on actor epistemics only).

/** Is distance-priced news LIT? beliefsActive (spatial marker present AND infoMode
 *  non-omniscient) AND the virtual flag distancePricedNewsEnabled === true (absent ⇒
 *  false ⇒ dormant ⇒ byte-identical). Mirrors momentumActive's AND-gate shape.
 *  @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown> } | null | undefined} worldState */
export function distancePricedNewsActive(worldState) {
  if (!beliefsActive(worldState)) return false;
  const rules = worldState && typeof worldState === 'object' ? worldState.simulationRules : null;
  return !!(rules && typeof rules === 'object'
    && /** @type {Record<string, unknown>} */ (rules).distancePricedNewsEnabled === true);
}

/** D1 believed-need coupling (the coherence-matrix discovered COUPLING): a giver
 *  learns of a receiver's distress THROUGH ITS DELAYED PICTURE, so its perceived need
 *  is the ground-truth need SCALED by how current its belief of that subject is.
 *  BeliefRecord gains NO field — the scale is DERIVED at read time from the existing
 *  confidence (fresh news ⇒ full need; a stale/silent picture under-reads it ⇒ aid
 *  lags coherently — "word of the famine reached the ally three weeks late"; a picture
 *  the observer never formed ⇒ 0, it cannot act on need it has not heard of). truth/self
 *  (dormant) ⇒ 1 (ground truth verbatim). Callers gate on distancePricedNewsActive, so
 *  dark ⇒ this is never called ⇒ byte-identical.
 *  @param {string} observerId @param {string} subjectId
 *  @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>, spatialLedgers?: unknown } | null | undefined} worldState
 *  @returns {number} 0..1 */
export function believedNeedScale(observerId, subjectId, worldState) {
  const b = belief(observerId, subjectId, worldState);
  if (b.source === 'truth') return 1;      // self / dormant ⇒ ground truth verbatim
  if (b.source === 'unknown') return 0;    // marker present, no picture ⇒ cannot perceive the need
  return clamp01(finiteNumber(b.record.confidence01, 0));
}

// ── The three chooser reads (byte-exact identity fallback) ────────────────────
/**
 * The observer's read of a subject's strength: ground truth verbatim (dormant /
 * self), the banded belief midpoint (a held belief), or the neutral mid band
 * (max-uncertainty). `truthStrength` is the ground-truth value the caller already
 * computed — returned EXACTLY when the fallback fires (zero rng).
 * @param {string} observerId @param {string} subjectId
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>, spatialLedgers?: unknown } | null | undefined} worldState
 * @param {number} truthStrength
 * @returns {number}
 */
export function readBeliefStrength(observerId, subjectId, worldState, truthStrength) {
  const b = belief(observerId, subjectId, worldState);
  if (b.source === 'truth') return truthStrength;
  if (b.source === 'unknown') return strengthOfBand(BELIEF_TUNING.NEUTRAL_STRENGTH_BAND);
  return strengthOfBand(b.record.strengthBand);
}

/**
 * The observer's read of the relationship label toward a subject: ground truth
 * verbatim (dormant / self / unknown — the declared relationship is public, so
 * absence is NON-paranoid: the label the observer knows), or the believed (and
 * possibly STALE) allianceLabel.
 * @param {string} observerId @param {string} subjectId
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>, spatialLedgers?: unknown } | null | undefined} worldState
 * @param {string} truthType
 * @returns {string}
 */
export function readBeliefRelationship(observerId, subjectId, worldState, truthType) {
  const b = belief(observerId, subjectId, worldState);
  if (b.source === 'belief') return b.record.allianceLabel || truthType;
  return truthType; // truth / self / unknown ⇒ the known declared relationship
}

// ── Ground-truth extraction (cold-start + the re-anchor target) ───────────────
/** The public dominant-faith name (the primaryDeitySnapshot the FaithSection
 *  shows to every viewer — never the latent pantheon), or null.
 *  @param {{ settlement?: { config?: { primaryDeitySnapshot?: { name?: unknown } } } } | null | undefined} item */
function groundTruthFaith(item) {
  const name = item?.settlement?.config?.primaryDeitySnapshot?.name;
  return typeof name === 'string' && name ? name : null;
}

/** Ground-truth war readiness of a subject from the warPosture ledger (0 absent).
 *  @param {{ warPosture?: unknown } | null | undefined} worldState @param {string} subjectId */
function groundTruthReadiness(worldState, subjectId) {
  const rec = asObject(worldState?.warPosture)[String(subjectId)];
  const state = rec && typeof rec === 'object' ? /** @type {{ state?: unknown }} */ (rec).state : undefined;
  const r = /** @type {Record<string, number>} */ (READINESS_BY_POSTURE)[String(state)];
  return Number.isFinite(r) ? r : 0;
}

/**
 * The GROUND-TRUTH belief a fully-informed observer would hold about a subject
 * right now — cold-start seeds this (confidence 1.0), and a fresh report
 * re-anchors toward it. Pure.
 * @param {string} subjectId
 * @param {string} allianceLabel  the true relationship label (observer↔subject)
 * @param {GroundTruthCtx} ctx
 * @param {number} now
 * @returns {BeliefRecord}
 */
function groundTruthBelief(subjectId, allianceLabel, ctx, now) {
  const item = ctx.byId.get(String(subjectId));
  const strength = item
    ? settlementStrength(item, buildPressureSummary(ctx.pressureIdx, String(subjectId)))
    : strengthOfBand(BELIEF_TUNING.NEUTRAL_STRENGTH_BAND);
  /** @type {BeliefRecord} */
  const record = {
    readiness: round4(groundTruthReadiness(ctx.worldState, subjectId)),
    strengthBand: strengthBandOf(strength),
    allianceLabel: allianceLabel || 'unknown',
    faithLabel: groundTruthFaith(item),
    confidence01: 1,
    lastUpdateTick: now,
  };
  // D-1 (deep-couplings): the two OPTIONAL axis fields, appended ONLY when the flag is lit
  // (dormancy by absence — law 12). ABSENT ⇒ byte-identical.
  if (ctx.axesActive) Object.assign(record, axisGroundTruth(item));
  return record;
}

/**
 * The worldState members the belief layer reads (a permissive projection — the
 * caller hands the full ensured worldState). Exported so the chooser's re-plumbed
 * reads can annotate their casts without widening to `any`.
 * @typedef {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>,
 *   spatialLedgers?: unknown, warPosture?: unknown,
 *   relationshipStates?: unknown } | null | undefined} BeliefWorldState
 */

/** @typedef {{ id?: string | number, name?: string, settlement?: { config?: { primaryDeitySnapshot?: { name?: unknown } }, populationHistory?: unknown, traditions?: unknown } }} SnapItem */
/** @typedef {{ from?: unknown, to?: unknown, source?: unknown, target?: unknown, a?: unknown, b?: unknown, id?: unknown, relationshipType?: unknown }} RawEdge */
/** @typedef {{ byId?: Map<string, SnapItem>, settlements?: SnapItem[], regionalGraph?: { edges?: RawEdge[] }, relationships?: RawEdge[] }} BeliefSnapshot */

/**
 * @typedef {Object} GroundTruthCtx
 * @property {Map<string, SnapItem>} byId     snapshot items by id
 * @property {unknown} pressureIdx            the pressure index (settlementStrength input)
 * @property {{ warPosture?: unknown }} worldState  the ledgers (readiness)
 * @property {boolean} [axesActive]           D-1: the belief-axes flag is lit (append the two axis fields)
 */

// ── The reconciliation rule (V.4) — the pure, testable core ───────────────────
/**
 * One report about a subject, as the reconciler reads it (derived from a 3.5
 * rumor arrival record — no prose).
 * @typedef {Object} BeliefReport
 * @property {number} hopCount           0 = firsthand
 * @property {number} ageTicks           now − arrivalTick (≥ 0)
 * @property {number} independentSources corroborationRoots.length (V.3)
 * @property {number} completeness01
 * @property {number} accuracy01
 * @property {number} score
 * @property {string} sortKey            the ledger event key (codepoint tie-break)
 * @property {string} [sourceId]         the origin telling's settlement (W-DOCTRINE-2 credibility weighting; optional — synthetic reports omit it)
 * @property {{ what?: unknown, magnitude?: unknown, partyIds?: unknown } | null} [content]  D-1: raw rumor content for the axis fold (transient, never serialized)
 * @property {string} [eventRef]         D-1: the canonical event id — the migration_flight direction (transient)
 */

/** The aggregate weight + accuracy of a report set (provenance × recency ×
 *  independence × completeness). Reports are pre-sorted by the caller.
 *  W-DOCTRINE-2 CREDIBILITY: when a `credibilityOf` weight closure is injected (the
 *  info-statecraft layer lit), each report's weight is ALSO scaled by the credibility
 *  of its SOURCE — a proven liar's tellings count for less, a proven-true court's for
 *  more (the existing corroboration math, credibility-weighted, design §4). ABSENT
 *  ⇒ no multiply ⇒ byte-identical (every campaign that never lit the flag).
 *  @param {BeliefReport[]} reports
 *  @param {((sourceId: string) => number) | null} [credibilityOf]
 *  @returns {{ weight: number, accuracy: number }} */
function aggregateReports(reports, credibilityOf = null) {
  const T = BELIEF_TUNING;
  let weight = 0;
  let accWeighted = 0;
  for (const r of reports) {
    let w = Math.pow(T.HOP_DECAY, Math.max(0, r.hopCount))
      * Math.pow(T.RECENCY_DECAY, Math.max(0, r.ageTicks))
      * (T.INDEP_BASE + T.INDEP_PER * Math.max(1, r.independentSources))
      * clamp01(r.completeness01);
    if (credibilityOf) w *= credibilityOf(r.sourceId || '');
    weight += w;
    accWeighted += w * clamp01(r.accuracy01);
  }
  return { weight, accuracy: weight > 0 ? accWeighted / weight : 0 };
}

/**
 * Reconcile a subject belief from the DECAYED prior + this window's reports and
 * the current ground truth. A pure weighted reconciliation (NOT last-writer-
 * wins): reports re-anchor toward truth (degraded toward neutral by their
 * fidelity), contradiction widens uncertainty, and — when there are no reports —
 * the caller has already decayed confidence for silence. Deterministic; no rng.
 *
 * @param {Object} args
 * @param {BeliefRecord | null} args.prior       the DECAYED prior (or null for a new belief)
 * @param {BeliefRecord} args.groundTruth        the current true belief (re-anchor target)
 * @param {BeliefReport[]} args.reports          this window's fresh reports (pre-sorted)
 * @param {number} args.now
 * @param {((sourceId: string) => number) | null} [args.credibilityOf]  W-DOCTRINE-2: source-credibility weight (absent ⇒ byte-identical)
 * @param {number} [args.sightFloor01]  W-DOCTRINE-2b: an accuracy FLOOR the observer's active
 *   SEE posture on this subject raises the aggregate fidelity to (paid eyes sharpen the read).
 *   ABSENT (0) ⇒ byte-identical (max(accuracy, 0) === accuracy).
 * @param {number} [args.commitmentDiscount01]  W-MOMENTUM §3.2: a motivated-reasoning discount
 *   (∈ [DISCOUNT_FLOOR, 1], 1 when the observer holds no committed course against this subject)
 *   applied to the report weight in the VALUE re-anchoring blend, SCALED BY how far the report
 *   CONTRADICTS the prior (a corroborating report is heard in full; a contradicting one is
 *   resisted). Bounded below (> 0) so it only SLOWS convergence, never inverts it; the
 *   contradiction-widens-uncertainty (confidence) term below runs at FULL weight regardless —
 *   reality always eventually wins. ABSENT (1) ⇒ byte-identical (weight * 1 === weight).
 * @param {boolean} [args.axesActive]  D-1 (deep-couplings): fold the two axis fields AFTER the
 *   base reconcile (the leaf owns the logic). ABSENT/false ⇒ untouched ⇒ byte-identical.
 * @param {string} [args.subjectId]  D-1: the subject id the axis fold resolves the
 *   migration_flight direction against (unused when axesActive is false).
 * @returns {BeliefRecord}
 */
export function reconcileBelief({ prior, groundTruth, reports, now, credibilityOf = null, sightFloor01 = 0, commitmentDiscount01 = 1, axesActive = false, subjectId = '' }) {
  const T = BELIEF_TUNING;
  const priorConf = prior ? clamp01(prior.confidence01) : 0;
  if (!reports.length) {
    // Silence: keep the (frozen) prior value; confidence already decayed by the
    // caller. A new belief with no report never materializes (guarded upstream).
    return prior
      ? { ...prior, confidence01: round4(priorConf) }
      : { ...groundTruth, confidence01: 0, lastUpdateTick: now };
  }
  const agg = aggregateReports(reports, credibilityOf);
  const weight = agg.weight;
  // W-DOCTRINE-2b SEE: the observer's paid eyes floor the aggregate fidelity for this pair
  // (a sharper read of what it hears). max(accuracy, 0) === accuracy ⇒ byte-identical absent.
  const accuracy = Math.max(clamp01(agg.accuracy), clamp01(finiteNumber(sightFloor01, 0)));
  // Numeric attributes re-anchor toward the fidelity-degraded truth (a garbled
  // telling pulls the observation toward the neutral midpoint).
  const obsStrengthBand = accuracy * groundTruth.strengthBand + (1 - accuracy) * T.NEUTRAL_STRENGTH_BAND;
  const obsReadiness = accuracy * groundTruth.readiness + (1 - accuracy) * T.NEUTRAL_READINESS;
  const priorStrengthBand = prior ? prior.strengthBand : T.NEUTRAL_STRENGTH_BAND;
  const priorReadiness = prior ? prior.readiness : T.NEUTRAL_READINESS;
  // W-MOMENTUM §3.2: the motivated-reasoning discount bites ONLY to the extent the report
  // CONTRADICTS the committed prior (a corroborating report — obs ≈ prior — is heard in full).
  // effDiscount ∈ [commitmentDiscount01, 1]; EXACTLY 1 when uncommitted (discount 1) or when
  // there is no prior/contradiction ⇒ blendW === weight ⇒ byte-identical. It only scales the
  // VALUE blend (re-anchoring is SLOWED, never switched off — the floor keeps it alive); the
  // confidence/contradiction term below uses the FULL weight (reality's doubt always lands).
  const contradiction01 = prior
    ? clamp01(Math.abs(obsStrengthBand - priorStrengthBand) / (STRENGTH_BANDS - 1))
    : 0;
  const effDiscount = 1 - (1 - clamp(finiteNumber(commitmentDiscount01, 1), 0, 1)) * contradiction01;
  const blendW = weight * effDiscount;
  const denom = priorConf + blendW;
  const blendedStrength = (priorConf * priorStrengthBand + blendW * obsStrengthBand) / denom;
  const blendedReadiness = (priorConf * priorReadiness + blendW * obsReadiness) / denom;
  // Categorical attributes: ADOPT the current truth when the aggregate telling is
  // faithful enough; else the stale label survives.
  const adopt = accuracy >= T.CAT_ADOPT_ACCURACY;
  const allianceLabel = adopt || !prior ? groundTruth.allianceLabel : prior.allianceLabel;
  const faithLabel = adopt || !prior ? groundTruth.faithLabel : prior.faithLabel;
  // Contradiction widens uncertainty: how far the observation sits from the prior
  // (normalized by the band range) drops confidence.
  const contradiction = prior
    ? T.CONTRA_W * (Math.abs(obsStrengthBand - priorStrengthBand) / (STRENGTH_BANDS - 1))
    : 0;
  const confidence01 = clamp01(priorConf + weight * T.CONF_GAIN - contradiction);
  /** @type {BeliefRecord} */
  const record = {
    readiness: round4(clamp01(blendedReadiness)),
    strengthBand: clamp(Math.round(blendedStrength), 0, STRENGTH_BANDS - 1),
    allianceLabel,
    faithLabel,
    confidence01: round4(confidence01),
    lastUpdateTick: now,
  };
  // D-1 (deep-couplings): fold the two axes AFTER the base reconcile (the credibilityOf
  // injection shape — the leaf owns the logic). ABSENT flag ⇒ untouched ⇒ byte-identical.
  if (axesActive) Object.assign(record, foldBeliefAxes({ prior, groundTruth: /** @type {{ populationTrendBand: number, observanceLabel: string | null }} */ (/** @type {unknown} */ (groundTruth)), reports, subjectId }));
  return record;
}

/**
 * The silence-decay base ADJUSTED by a signed sight modifier (W-DOCTRINE-2b SEE/HIDE).
 * decayKeep01 ∈ [-1,1]: 0 ⇒ EXACTLY BELIEF_TUNING.SILENCE_DECAY (the byte-identity anchor).
 * Positive (an active SEE posture on the pair) pulls the base toward 1.0 — belief decays
 * SLOWER (paid eyes keep the picture fresh). Negative (a HIDE posture on the subject and/or
 * the observer — symmetric isolation) pulls it toward 0 — belief decays FASTER (the sealed
 * gates and the fog behind them). Pure.
 * @param {number} decayKeep01 @returns {number}
 */
function adjustedDecayBase(decayKeep01) {
  const k = clamp(finiteNumber(decayKeep01, 0), -1, 1);
  const base = BELIEF_TUNING.SILENCE_DECAY;
  if (k === 0) return base; // byte-identity anchor — the absent/neutral read
  return k > 0 ? base + (1 - base) * k : base * (1 + k);
}

/** Confidence after `silentTicks` ticks of silence (pure arithmetic, no rng). The optional
 *  `decayKeep01` is the W-DOCTRINE-2b SEE/HIDE decay modifier — ABSENT (0) ⇒ byte-identical.
 *  @param {number} confidence01 @param {number} silentTicks @param {number} [decayKeep01]
 *  @returns {number} */
export function decayedConfidence(confidence01, silentTicks, decayKeep01 = 0) {
  const n = Math.max(0, Math.floor(finiteNumber(silentTicks, 0)));
  return clamp01(finiteNumber(confidence01, 0) * Math.pow(adjustedDecayBase(decayKeep01), n));
}

// ── The relationship neighbourhood (cold-start seed + true labels) ────────────
/**
 * observer → [{ subjectId, relType }] over the regional-graph relationship edges
 * (the declared informational neighbourhood), and a "a|b" → relType index. Reads
 * the SAME normalized edge + ensured relState the chooser's contextFor reads, so
 * the seed and the read agree. Codepoint-stable.
 * @param {BeliefSnapshot | null | undefined} snapshot
 * @param {{ relationshipStates?: unknown } | null | undefined} worldState
 */
function relationshipNeighbourhood(snapshot, worldState) {
  const states = asObject(worldState?.relationshipStates);
  /** @type {Map<string, Map<string, string>>} */
  const neighbours = new Map();
  const edges = snapshot?.regionalGraph?.edges || snapshot?.relationships || [];
  const add = (/** @type {string} */ a, /** @type {string} */ b, /** @type {string} */ type) => {
    if (!a || !b || a === b) return;
    if (!neighbours.has(a)) neighbours.set(a, new Map());
    const m = /** @type {Map<string, string>} */ (neighbours.get(a));
    if (!m.has(b)) m.set(b, type); // first edge pairing a→b wins (contextFor order)
  };
  // Lazy imports of the edge normalizers would create a cycle risk; read the raw
  // edge shape the same way tolerance's tradePartnerMap does, tolerant of aliases.
  for (const raw of edges) {
    const from = String(raw?.from ?? raw?.source ?? raw?.a ?? '');
    const to = String(raw?.to ?? raw?.target ?? raw?.b ?? '');
    if (!from || !to) continue;
    const key = String(raw?.id ?? `edge.${from}.${to}`);
    const overlay = /** @type {{ relationshipType?: string } | undefined} */ (states[key]);
    const type = String(overlay?.relationshipType || raw?.relationshipType || 'neutral');
    add(from, to, type);
    add(to, from, type);
  }
  return neighbours;
}

// ── The advance (one pure step per pulse tick) ────────────────────────────────
/**
 * The rumor arrivals that inform an observer's beliefs, indexed subject → reports.
 * Reads the observer's 3.5 rumor ledger; a record about subject S (S in whereId ∪
 * partyIds, S != observer) with arrivalTick ≤ now is a report about S.
 * M9a: an optional `matchFraming(framing[])` predicate PARTITIONS the ledger by
 * carrier (the per-faction slots pass one; the seat passes null ⇒ ALL reports ⇒
 * byte-identical to Wave A).
 * @param {unknown} observerLedger  worldState.rumorLedgers[observerId]
 * @param {string} observerId @param {number} now
 * @param {((framing: string[]) => boolean) | null} [matchFraming]
 * @param {import('../spatial/distanceRead.js').SpatialDigest | null} [digest]  D1
 *   distance-priced news: when present (distancePricedNewsActive), each report's
 *   effective age gains hopDelayTicks(origin→observer); null (dark) ⇒ byte-identical.
 * @returns {Map<string, Array<{ report: BeliefReport, arrivalTick: number }>>}
 */
function reportsBySubject(observerLedger, observerId, now, matchFraming = null, digest = null) {
  /** @type {Map<string, Array<{ report: BeliefReport, arrivalTick: number }>>} */
  const out = new Map();
  const ledger = asObject(observerLedger);
  for (const key of Object.keys(ledger)) {
    const rec = /** @type {{ arrivalTick?: unknown, content?: unknown, hopCount?: unknown, corroborationRoots?: unknown, completeness01?: unknown, accuracy01?: unknown, score?: unknown, framing?: unknown, provenance?: unknown, eventRef?: unknown } | null } */ (ledger[key]);
    if (!rec || typeof rec !== 'object') continue;
    const arrivalTick = Math.floor(finiteNumber(rec.arrivalTick, Infinity));
    if (arrivalTick > now) continue; // in transit — not yet heard
    if (matchFraming) {
      const framing = Array.isArray(rec.framing) ? rec.framing.map(String) : [];
      if (!matchFraming(framing)) continue; // not this faction's carrier — skip
    }
    const content = asObject(rec.content);
    // W-DOCTRINE-2: the origin telling's settlement (credibility weighting source). The
    // field is set unconditionally but consumed ONLY when a credibilityOf closure is
    // injected — byte-identical otherwise.
    const prov = asObject(rec.provenance);
    const sourceId = prov.originId != null ? String(prov.originId) : '';
    const parties = new Set(
      [content.whereId, ...(Array.isArray(content.partyIds) ? content.partyIds : [])]
        .filter((v) => v != null && v !== '')
        .map(String),
    );
    /** @type {BeliefReport} */
    const report = {
      hopCount: Math.max(0, Math.floor(finiteNumber(rec.hopCount, 0))),
      // D1: effective info age = actual age (already rumor-relay-delayed) + the direct
      // origin→observer distance surcharge (0 when digest null ⇒ byte-identical).
      ageTicks: Math.max(0, now - arrivalTick) + hopDelayTicks(digest, sourceId, observerId),
      independentSources: Array.isArray(rec.corroborationRoots) ? rec.corroborationRoots.length : 1,
      completeness01: clamp01(finiteNumber(rec.completeness01, 1)),
      accuracy01: clamp01(finiteNumber(rec.accuracy01, 1)),
      score: Math.max(0, finiteNumber(rec.score, 0)),
      sortKey: String(key),
      sourceId,
      // D-1 (deep-couplings): the leaf's axis fold reads these transient fields (the raw content
      // for the axis kind/magnitude/parties + the canonical eventRef for the migration direction).
      // Transient (never serialized) ⇒ byte-neutral; the base aggregate/sort ignore them.
      content,
      eventRef: rec.eventRef != null ? String(rec.eventRef) : '',
    };
    for (const subjectId of parties) {
      if (subjectId === String(observerId)) continue; // self is never a rumor subject
      if (!out.has(subjectId)) out.set(subjectId, []);
      /** @type {Array<{ report: BeliefReport, arrivalTick: number }>} */ (out.get(subjectId)).push({ report, arrivalTick });
    }
  }
  return out;
}

/** Total-order sort of reports (arrival desc, score desc, completeness desc,
 *  codepoint key) — applied before folding (§IV.3-2).
 *  @param {Array<{ report: BeliefReport, arrivalTick: number }>} rows */
function sortReports(rows) {
  return rows.slice().sort((a, b) => (b.arrivalTick - a.arrivalTick)
    || (b.report.score - a.report.score)
    || (b.report.completeness01 - a.report.completeness01)
    || compareCodepoint(a.report.sortKey, b.report.sortKey));
}

// ── M9a: the faction roster + the governing coalition (design §VI.4-1) ─────────
/** The faction roster the belief layer reads off a snapshot item (the SAME source
 *  npcAgency / thievesGuild read — powerStructure first, then the loose aliases).
 *  @param {SnapItem | null | undefined} item @returns {Array<Record<string, unknown>>} */
function settlementFactionRoster(item) {
  const it = asObject(item);
  const s = it.settlement && typeof it.settlement === 'object' ? asObject(it.settlement) : it;
  const facs = asObject(s.powerStructure).factions || s.factions || s.powerFactions || asObject(s.politics).factions;
  return Array.isArray(facs) ? /** @type {Array<Record<string, unknown>>} */ (facs) : [];
}

/** A faction is COMPROMISED (owner vocab = corruption; covert or revealed) when it
 *  carries a corruption/covert impairment, sits at a captured underworld rung, or
 *  the corruption pass stamped a vector on it. Its private intel LEAKS (M9a).
 *  @param {unknown} faction @returns {boolean} */
export function isFactionCompromised(faction) {
  if (!faction || typeof faction !== 'object') return false;
  const f = /** @type {Record<string, unknown>} */ (faction);
  const imps = f.impairments;
  if (Array.isArray(imps) && imps.some((i) => i && (i.type === 'corruption' || i.covert === true))) return true;
  const cap = f.captureState;
  const capObj = asObject(cap);
  const rung = typeof cap === 'string' ? cap : (capObj.rung || capObj.state);
  if (rung === 'corrupted' || rung === 'capture') return true;
  return !!f.corruptionVector;
}

/**
 * The observer's per-faction belief slots to build: archetype → { framingTag }
 * for each faction present whose archetype maps to a carrier, plus the set of
 * carrier framing tags a COMPROMISED faction leaks (into the public slot).
 * @param {SnapItem | null | undefined} item
 * @returns {{ slots: Map<string, { framingTag: string }>, leakedTags: Set<string> }}
 */
function observerFactionSlots(item) {
  /** @type {Map<string, { framingTag: string }>} */
  const slots = new Map();
  /** @type {Set<string>} */
  const leakedTags = new Set();
  for (const fac of settlementFactionRoster(item)) {
    const archetype = factionArchetype(fac);
    const framingTag = /** @type {Record<string, string>} */ (FACTION_CARRIER_FRAMING)[archetype];
    if (!framingTag) continue; // government / noble / civic / … have no carrier feed
    if (!slots.has(archetype)) slots.set(archetype, { framingTag });
    if (isFactionCompromised(fac)) leakedTags.add(framingTag);
  }
  return { slots, leakedTags };
}

/** The governing seat faction: the isGoverning flag wins; else the highest-power
 *  faction (codepoint tie-break for determinism). Null on an empty roster.
 *  @param {Array<Record<string, unknown>>} roster @returns {Record<string, unknown> | null} */
function pickGoverningFaction(roster) {
  /** @type {Record<string, unknown> | null} */
  let seat = null;
  let topPower = -Infinity;
  for (const fac of roster) {
    if (fac.isGoverning) return fac;
    const p = Number(fac.power);
    const power = Number.isFinite(p) ? p : 0;
    if (seat === null || power > topPower) { topPower = power; seat = fac; }
  }
  return seat;
}

/** The archetypes the governing seat treats as OPPONENTS — the seat's declared
 *  `rivals` (names/ids resolved back to roster archetypes). Absent ⇒ empty (a
 *  unified council: absence-of-rivalry reads as allied).
 *  @param {Record<string, unknown> | null} seatFac
 *  @param {Array<Record<string, unknown>>} roster @returns {Set<string>} */
function coalitionOpponents(seatFac, roster) {
  /** @type {Set<string>} */
  const opponents = new Set();
  const rivals = seatFac ? seatFac.rivals : null;
  if (!Array.isArray(rivals) || !rivals.length) return opponents;
  const rivalKeys = new Set(rivals.map((r) => String(r && typeof r === 'object' ? (r.id ?? r.faction ?? r.name ?? '') : r).toLowerCase()).filter(Boolean));
  for (const fac of roster) {
    const keys = [fac.id, fac.name, fac.faction].map((x) => String(x || '').toLowerCase()).filter(Boolean);
    if (keys.some((k) => rivalKeys.has(k))) opponents.add(factionArchetype(fac));
  }
  return opponents;
}

/**
 * Derive the governing COALITION (design §VI.4-1's deferred half): the governing
 * seat's archetype + the archetypes of the factions ALLIED to it (present factions
 * not on the seat's rivals). The coalition's operational belief IS the `seat` slot;
 * membership colours DISSENT (an in-coalition faction diverging is the sharper
 * schism). Pure.
 * @param {SnapItem | null | undefined} item
 * @returns {{ governing: string | null, members: Set<string>, opponents: Set<string> }}
 */
export function governingCoalition(item) {
  const roster = settlementFactionRoster(item);
  const seatFac = pickGoverningFaction(roster);
  const governing = seatFac ? factionArchetype(seatFac) : null;
  const opponents = coalitionOpponents(seatFac, roster);
  /** @type {Set<string>} */
  const members = new Set();
  if (governing && governing !== 'other') members.add(governing);
  for (const fac of roster) {
    const a = factionArchetype(fac);
    if (a && a !== 'other' && !opponents.has(a)) members.add(a);
  }
  return { governing, members, opponents };
}

// ── M9b component (4): ALLY-INTEL SHARING + THE COMPROMISED-ALLY LEAK ──────────
// (design §4g round 11 "ALLY INFORMATION-SHARING, ALIGNMENT-GOVERNED HANDLING &
// BETRAYAL"; round 15A intel STYLES). A DELIBERATE high-confidence sharing channel
// DISTINCT from the ambient telephone: allies actively share HIGH-CONFIDENCE intel
// at PRESERVED fidelity — so a well-allied lawful bloc's beliefs converge toward
// TRUTH (misjudgment falls). ALIGNMENT STYLES the handling (2-axis map onto the
// derived settlement alignment): LAW↔CHAOS = FIDELITY (lawful faithful, chaotic
// noisy); GOOD↔EVIL = HONESTY (good shares TRUE, evil DISTORTS for self-benefit —
// feeds allies FALSE high-confidence intel). A settlement shares based on who it
// BELIEVES is an ally (its belief map), NOT who truly is — so a PRESUMED ally that
// has TURNED or been COMPROMISED is a LEAK: it relays the sharer's high-confidence
// intel to the sharer's REAL ENEMY, who uses it to tip a war. Belief-map alliance
// ACCURACY becomes load-bearing (a correct belief that the ally turned ⇒ no share ⇒
// no leak). OPT-IN (allyIntelSharingEnabled) — OFF ⇒ this pass never runs ⇒ the M9a
// advance is byte-identical. Extends M9a's INTRA-settlement leakedTags to the OUTWARD
// leak. PURE, NO rng (styling is a deterministic function of the alignment coords).

/** The friendly relationship axis a settlement shares intel across. */
const FRIENDLY_LABELS = new Set(['allied', 'trade_partner', 'patron', 'client', 'vassal']);

export const ALLY_INTEL_TUNING = Object.freeze({
  // Only HIGH-CONFIDENCE beliefs are shared as ACTIONABLE (you don't pass a vague
  // rumor as fact).
  SHARE_CONFIDENCE_FLOOR: 0.6,
  // A sharer shares only with an ESTABLISHED believed-ally (a vague "maybe friendly"
  // is not a courier channel).
  VET_CONFIDENCE: 0.5,
  // A relayed lawful/faithful belief keeps (nearly) its confidence — the high-fidelity
  // node that reduces the telephone weathering.
  RELAY_KEEP: 0.95,
  // Above this malice, the sharer DECEIVES (evil, accurate-inward / deceptive-outward).
  EVIL_FLOOR: 0.6,
  // Below this lawfulness (and not evil), the sharer is NOISY (chaotic, high-variance).
  CHAOS_CEIL: 0.4,
  // The chaotic-noise confidence damp (a garbled relay).
  NOISE_DAMP: 0.5,
  // The enemy's confidence in the LEAKED (accurate) intel — actionable, war-tipping.
  LEAK_CONFIDENCE: 0.9,
  // A deceiver reports a non-hostile subject as MOBILIZING (the false-threat readiness).
  DECEIT_READINESS: 0.75,
});

/** A settlement is COMPROMISED (its intel security is broken) when ANY faction on its
 *  roster is compromised (the M9a intra-settlement leak source, read at settlement scope).
 *  @param {SnapItem | null | undefined} item @returns {boolean} */
export function settlementCompromised(item) {
  return settlementFactionRoster(item).some((fac) => isFactionCompromised(fac));
}

/**
 * Style a shared belief by the SHARER's derived alignment (round 15A). FAITHFUL
 * (lawful/good): the belief preserved at near-full confidence. DECEPTIVE (evil):
 * paint a non-hostile subject as a MOBILIZING, beatable ENEMY at high confidence
 * (the manipulation that engineers an unjust war — couples to moral drift). NOISY
 * (chaotic): the belief garbled toward neutral at reduced confidence. Pure.
 * @param {BeliefRecord} rec  the sharer's belief about the subject
 * @param {{ lawfulness01: number, malice01: number }} align
 * @param {number} now
 * @returns {BeliefRecord}
 */
function styleSharedBelief(rec, align, now) {
  const T = ALLY_INTEL_TUNING;
  const malice = clamp01(finiteNumber(align?.malice01, 0.5));
  const lawful = clamp01(finiteNumber(align?.lawfulness01, 0.5));
  if (malice > T.EVIL_FLOOR) {
    // DECEPTIVE-OUTWARD: report a non-hostile subject as a hostile, mobilizing, and
    // (slightly under-stated) beatable threat — the false high-confidence intel.
    const nonHostile = !new Set(['hostile', 'cold_war', 'rival']).has(String(rec.allianceLabel));
    return {
      readiness: round4(nonHostile ? T.DECEIT_READINESS : clamp01(rec.readiness)),
      strengthBand: nonHostile ? clamp(Math.round(rec.strengthBand) - 1, 0, STRENGTH_BANDS - 1) : rec.strengthBand,
      allianceLabel: nonHostile ? 'hostile' : rec.allianceLabel,
      faithLabel: rec.faithLabel,
      confidence01: round4(clamp01(rec.confidence01)), // presented as FACT
      lastUpdateTick: now,
    };
  }
  if (lawful < T.CHAOS_CEIL) {
    // NOISY: garble toward the neutral band, drop confidence (an unreliable relay).
    return {
      readiness: round4(clamp01(0.5 * rec.readiness + 0.5 * BELIEF_TUNING.NEUTRAL_READINESS)),
      strengthBand: clamp(Math.round(0.5 * rec.strengthBand + 0.5 * BELIEF_TUNING.NEUTRAL_STRENGTH_BAND), 0, STRENGTH_BANDS - 1),
      allianceLabel: rec.allianceLabel,
      faithLabel: rec.faithLabel,
      confidence01: round4(clamp01(rec.confidence01 * T.NOISE_DAMP)),
      lastUpdateTick: now,
    };
  }
  // FAITHFUL: the belief relayed at (near) full fidelity.
  return {
    readiness: round4(clamp01(rec.readiness)),
    strengthBand: rec.strengthBand,
    allianceLabel: rec.allianceLabel,
    faithLabel: rec.faithLabel,
    confidence01: round4(clamp01(rec.confidence01) * T.RELAY_KEEP),
    lastUpdateTick: now,
  };
}

/**
 * The deliberate ally-intel sharing pass (design §4g round 11). Runs AFTER the M9a
 * per-observer reconcile, over the seat slots. Each sharer S shares its
 * HIGH-CONFIDENCE seat beliefs with every settlement it BELIEVES is an ally
 * (friendly seat label + vetted confidence), STYLED by S's alignment; a receiver
 * ADOPTS a shared belief when it out-confidences its own (actionable intel
 * re-anchors — convergence toward truth for honest allies). THE LEAK: when a
 * believed-ally receiver has TRULY TURNED (hostile to S) or is COMPROMISED, S's
 * high-confidence SELF intel leaks to S's REAL ENEMY (accurate, war-tipping). PURE,
 * deterministic (codepoint folds, no rng); returns a NEW maps (untouched observers
 * keep their reference).
 * @param {Object} args
 * @param {Record<string, Record<string, Record<string, BeliefRecord>>>} args.maps
 * @param {GroundTruthCtx} args.ctx
 * @param {Map<string, Map<string, string>>} args.neighbours  observer → subject → trueType
 * @param {(id: string) => { lawfulness01: number, malice01: number }} args.alignmentOf
 * @param {number} args.now
 * @returns {Record<string, Record<string, Record<string, BeliefRecord>>>}
 */
export function applyAllyIntelSharing({ maps, ctx, neighbours, alignmentOf, now }) {
  const T = ALLY_INTEL_TUNING;
  const HOSTILE = new Set(['hostile', 'cold_war', 'rival']);
  const align = (/** @type {string} */ id) => {
    const a = alignmentOf ? alignmentOf(id) : null;
    return { lawfulness01: clamp01(finiteNumber(a?.lawfulness01, 0.5)), malice01: clamp01(finiteNumber(a?.malice01, 0.5)) };
  };
  // receiverId → subjectId → the highest-priority injected belief.
  /** @type {Map<string, Map<string, BeliefRecord>>} */
  const injections = new Map();
  const inject = (/** @type {string} */ receiverId, /** @type {string} */ subjectId, /** @type {BeliefRecord} */ record) => {
    if (String(receiverId) === String(subjectId)) return; // never a self-belief
    if (!injections.has(receiverId)) injections.set(receiverId, new Map());
    const m = /** @type {Map<string, BeliefRecord>} */ (injections.get(receiverId));
    const cur = m.get(subjectId);
    if (!cur || record.confidence01 > cur.confidence01) m.set(subjectId, record); // strongest telling wins
  };

  for (const sharerId of Object.keys(maps).sort(compareCodepoint)) {
    const sharerSeat = asObject(asObject(maps[sharerId])[GOVERNING_SEAT_KEY]);
    const sharerAlign = align(sharerId);
    const trueOf = neighbours.get(sharerId) || new Map();
    // Believed allies of the sharer (its OWN seat map — who IT thinks is friendly).
    const believedAllies = Object.keys(sharerSeat).filter((rid) => {
      const rec = /** @type {BeliefRecord} */ (sharerSeat[rid]);
      return rec && typeof rec === 'object'
        && FRIENDLY_LABELS.has(String(rec.allianceLabel))
        && clamp01(rec.confidence01) >= T.VET_CONFIDENCE;
    }).sort(compareCodepoint);
    if (!believedAllies.length) continue;

    // The sharer's high-confidence, shareable beliefs about third parties.
    const shareable = Object.keys(sharerSeat).filter((sid) => {
      const rec = /** @type {BeliefRecord} */ (sharerSeat[sid]);
      return rec && typeof rec === 'object' && clamp01(rec.confidence01) >= T.SHARE_CONFIDENCE_FLOOR;
    });

    for (const receiverId of believedAllies) {
      if (!ctx.byId.has(receiverId)) continue;
      // POOL: share styled beliefs about third parties into the receiver's seat.
      for (const subjectT of shareable) {
        if (subjectT === receiverId) continue; // don't tell an ally about itself
        const styled = styleSharedBelief(/** @type {BeliefRecord} */ (sharerSeat[subjectT]), sharerAlign, now);
        inject(receiverId, subjectT, styled);
      }
      // THE COMPROMISED-ALLY LEAK: the believed-ally has TRULY turned (hostile to the
      // sharer) or is compromised ⇒ the sharer's high-confidence SELF intel reaches
      // the sharer's REAL enemies (accurate — the enemy can tip a war on it).
      const trueRel = String(trueOf.get(receiverId) || 'unknown');
      const turned = HOSTILE.has(trueRel) || settlementCompromised(ctx.byId.get(receiverId));
      if (!turned) continue;
      for (const [enemyId, enemyRel] of trueOf) {
        if (!HOSTILE.has(String(enemyRel)) || enemyId === receiverId || !ctx.byId.has(enemyId)) continue;
        const trueTypeES = neighbours.get(enemyId)?.get(sharerId) || 'unknown';
        const leaked = groundTruthBelief(sharerId, /** @type {string} */ (trueTypeES), ctx, now);
        leaked.confidence01 = round4(T.LEAK_CONFIDENCE);
        inject(enemyId, sharerId, leaked); // the enemy learns the sharer's true footing
      }
    }
  }

  if (!injections.size) return maps;
  const out = { ...maps };
  for (const receiverId of [...injections.keys()].sort(compareCodepoint)) {
    const subjectMap = /** @type {Map<string, BeliefRecord>} */ (injections.get(receiverId));
    const priorObserver = asObject(maps[receiverId]);
    const priorSeat = asObject(priorObserver[GOVERNING_SEAT_KEY]);
    /** @type {Record<string, BeliefRecord>} */
    const nextSeat = { ...(/** @type {Record<string, BeliefRecord>} */ (priorSeat)) };
    let touched = false;
    for (const subjectId of [...subjectMap.keys()].sort(compareCodepoint)) {
      const shared = /** @type {BeliefRecord} */ (subjectMap.get(subjectId));
      const cur = /** @type {BeliefRecord | undefined} */ (nextSeat[subjectId]);
      // ACTIONABLE re-anchor: adopt when the shared belief out-confidences the receiver's
      // own (a well-informed ally sharpens the picture; a weaker telling is ignored).
      if (!cur || shared.confidence01 > clamp01(cur.confidence01)) { nextSeat[subjectId] = shared; touched = true; }
    }
    if (!touched) continue;
    /** @type {Record<string, BeliefRecord>} */
    const sortedSeat = {};
    for (const k of Object.keys(nextSeat).sort(compareCodepoint)) sortedSeat[k] = nextSeat[k];
    /** @type {Record<string, Record<string, BeliefRecord>>} */
    const nextObserver = {};
    for (const k of Object.keys(priorObserver).sort(compareCodepoint)) {
      nextObserver[k] = k === GOVERNING_SEAT_KEY ? sortedSeat : /** @type {Record<string, BeliefRecord>} */ (priorObserver[k]);
    }
    if (!(GOVERNING_SEAT_KEY in nextObserver)) nextObserver[GOVERNING_SEAT_KEY] = sortedSeat;
    out[receiverId] = nextObserver;
  }
  return out;
}

/**
 * Reconcile ONE faction slot (seat or a per-faction slot) from its DECAYED prior +
 * this window's (already carrier-filtered) reports. This is the Wave-A per-subject
 * loop, lifted verbatim so the seat slot stays byte-identical while the per-faction
 * slots reuse the SAME reconciliation core.
 * @param {Object} args
 * @param {Record<string, unknown>} args.priorSlot
 * @param {Map<string, Array<{ report: BeliefReport, arrivalTick: number }>>} args.reports
 * @param {GroundTruthCtx} args.ctx
 * @param {Map<string, Map<string, string>>} args.neighbours
 * @param {string} args.observerId @param {number} args.now
 * @param {((sourceId: string) => number) | null} [args.credibilityOf]  W-DOCTRINE-2 source-credibility weight
 * @param {((observerId: string, subjectId: string) => { decayKeep01: number, accuracyFloor01: number }) | null} [args.sightOf]
 *   W-DOCTRINE-2b SEE/HIDE: the per-pair sight modifier (SEE slows decay + floors fidelity;
 *   HIDE speeds decay both directions). ABSENT / neutral ⇒ byte-identical.
 * @param {((observerId: string, subjectId: string) => number) | null} [args.commitmentDiscountFor]
 *   W-MOMENTUM §3.2: the per-pair motivated-reasoning discount (∈ [DISCOUNT_FLOOR, 1], 1 when
 *   the observer holds no committed course against the subject). ABSENT / 1 ⇒ byte-identical.
 * @returns {{ bySubject: Record<string, BeliefRecord>, pruned: boolean }}
 */
function reconcileSlot({ priorSlot, reports, ctx, neighbours, observerId, now, credibilityOf = null, sightOf = null, commitmentDiscountFor = null }) {
  const T = BELIEF_TUNING;
  const subjectIds = new Set([...Object.keys(priorSlot), ...reports.keys()].map(String));
  /** @type {Record<string, BeliefRecord>} */
  const bySubject = {};
  let pruned = false;
  for (const subjectId of [...subjectIds].sort(compareCodepoint)) {
    const priorRec = /** @type {BeliefRecord | null} */ (
      priorSlot[subjectId] && typeof priorSlot[subjectId] === 'object' ? priorSlot[subjectId] : null
    );
    const rows = reports.get(subjectId) || [];
    // Reports FRESH since the last refresh (existing belief) or recent enough to
    // materialize (new belief) — bounds resurrection of a pruned belief.
    const freshRows = sortReports(rows.filter(({ arrivalTick }) => (priorRec
      ? arrivalTick > Math.floor(finiteNumber(priorRec.lastUpdateTick, -Infinity))
      : now - arrivalTick <= T.MATERIALIZE_WINDOW)));
    const freshReports = freshRows.map((row) => row.report);

    if (!priorRec && !freshReports.length) continue; // no belief, no fresh word

    // W-DOCTRINE-2b: this pair's SEE/HIDE modifier (null / {0,0} ⇒ byte-identical).
    const sight = sightOf ? sightOf(observerId, subjectId) : null;
    const decayKeep01 = sight ? finiteNumber(sight.decayKeep01, 0) : 0;
    const sightFloor01 = sight ? finiteNumber(sight.accuracyFloor01, 0) : 0;
    // W-MOMENTUM §3.2: this observer's motivated-reasoning discount on reports contradicting
    // its committed course against THIS subject (1 when uncommitted ⇒ byte-identical).
    const commitmentDiscount01 = commitmentDiscountFor ? commitmentDiscountFor(observerId, subjectId) : 1;

    // The current true relationship label observer↔subject (for the re-anchor).
    const trueType = neighbours.get(observerId)?.get(subjectId) || priorRec?.allianceLabel || 'unknown';
    const groundTruth = groundTruthBelief(subjectId, trueType, ctx, now);

    let record;
    if (freshReports.length) {
      const silent = priorRec ? Math.max(0, now - Math.floor(finiteNumber(priorRec.lastUpdateTick, now))) : 0;
      const decayedPrior = priorRec ? { ...priorRec, confidence01: decayedConfidence(priorRec.confidence01, silent, decayKeep01) } : null;
      record = reconcileBelief({ prior: decayedPrior, groundTruth, reports: freshReports, now, credibilityOf, sightFloor01, commitmentDiscount01, axesActive: ctx.axesActive === true, subjectId });
    } else {
      // Silence: decay confidence, keep the frozen value.
      const silent = Math.max(0, now - Math.floor(finiteNumber(/** @type {BeliefRecord} */ (priorRec).lastUpdateTick, now)));
      const conf = decayedConfidence(/** @type {BeliefRecord} */ (priorRec).confidence01, silent, decayKeep01);
      record = { .../** @type {BeliefRecord} */ (priorRec), confidence01: round4(conf) };
    }

    if (record.confidence01 < T.MIN_CONFIDENCE) { pruned = true; continue; } // forgotten
    bySubject[subjectId] = record;
  }
  return { bySubject, pruned };
}

/**
 * Advance the belief maps one tick (design §4g / V.4). DORMANT (marker absent or
 * infoMode omniscient) ⇒ { next: prior, changed: false } — zero work, an existing
 * ledger PRESERVED untouched (never deleted on a dial-back). COLD-START (first
 * active advance, no prior ledger) ⇒ seed the relationship neighbourhood to
 * ground truth (confidence 1.0). Otherwise per (observer, subject): reconcile the
 * decayed prior with this window's fresh reports, or decay for silence; prune
 * below MIN_CONFIDENCE. Pure + deterministic (codepoint / total-order folds).
 *
 * @param {Object} args
 * @param {BeliefSnapshot | null | undefined} args.snapshot  the tick snapshot (settlements, byId, regionalGraph)
 * @param {unknown} args.pressureIdx  the pressure index (settlementStrength input)
 * @param {{ spatialLedgers?: unknown, warPosture?: unknown,
 *   relationshipStates?: unknown, spatialCanonVersion?: unknown,
 *   simulationRules?: Record<string, unknown> }} args.worldState  the ensured worldState
 * @param {number} args.tick
 * @param {{ enabled?: boolean, alignmentOf?: (id: string) => { lawfulness01: number, malice01: number } } | null} [args.allyIntel]
 *   M9b component (4): the deliberate ally-intel sharing channel. ABSENT / disabled
 *   ⇒ the sharing pass never runs ⇒ the M9a advance is BYTE-IDENTICAL (the opt-in
 *   gate — allyIntelSharingEnabled, off by default even on a belief-active campaign).
 * @param {((sourceId: string) => number) | null} [args.credibilityOf]  W-DOCTRINE-2:
 *   the source-credibility weight closure (info-statecraft layer lit). ABSENT ⇒ the
 *   reconciliation is byte-identical (every campaign that never lit infoStatecraftEnabled).
 * @param {((observerId: string, subjectId: string) => { decayKeep01: number, accuracyFloor01: number }) | null} [args.sightOf]
 *   W-DOCTRINE-2b: the SEE/HIDE per-pair sight modifier closure (info-statecraft layer lit,
 *   a sight/secrecy posture materialized). ABSENT / neutral ⇒ byte-identical.
 * @param {((observerId: string, subjectId: string) => number) | null} [args.commitmentDiscountFor]
 *   W-MOMENTUM §3.2: the per-pair motivated-reasoning discount closure (momentum layer lit).
 *   ABSENT / 1 ⇒ byte-identical (the reconciliation only SLOWS convergence, never inverts it).
 * @returns {{ next: Record<string, unknown> | null, changed: boolean }}
 */
export function advanceBeliefMaps({ snapshot, pressureIdx, worldState, tick, allyIntel = null, credibilityOf = null, sightOf = null, commitmentDiscountFor = null }) {
  const prior = hasSpatialLedger(worldState, 'beliefMaps')
    ? asObject(getSpatialLedger(worldState, 'beliefMaps'))
    : null;
  if (!beliefsActive(worldState)) {
    return { next: prior && Object.keys(prior).length ? prior : null, changed: false };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const byId = snapshot?.byId instanceof Map
    ? snapshot.byId
    : new Map((snapshot?.settlements || []).map((/** @type {SnapItem} */ it) => [String(it.id), it]));
  // D-1 (deep-couplings): the belief-axes flag (requires beliefsActive — already asserted above).
  // ABSENT ⇒ ctx.axesActive false ⇒ every ground-truth/reconcile path is byte-identical.
  const axesActive = beliefAxesActive(worldState);
  /** @type {GroundTruthCtx} */
  const ctx = { byId, pressureIdx, worldState, axesActive };
  const neighbours = relationshipNeighbourhood(snapshot, worldState);
  const canonVersion = Number(worldState?.spatialCanonVersion) || 0;
  const realObserverKeys = prior ? Object.keys(prior).filter(k => k !== BELIEF_SEED_KEY) : [];
  const seededVersion = prior && prior[BELIEF_SEED_KEY] !== undefined ? Number(prior[BELIEF_SEED_KEY]) : null;
  // Cold-start seeds ground truth ONCE per canonize. A ledger that merely DECAYED
  // empty (only the seed sentinel survives, at the SAME canon version) must NOT
  // re-seed — that would snap the most fog-starved world to omniscient present.
  // Silence deepens fog, it doesn't reset it. A genuine re-canonize (version bump)
  // does re-seed. [spatial-engine-5]
  const needsColdStart = realObserverKeys.length === 0 && seededVersion !== canonVersion;

  // ── COLD-START: seed the declared neighbourhood to ground truth, once. ──────
  if (needsColdStart) {
    /** @type {Record<string, Record<string, Record<string, BeliefRecord>>>} */
    const seeded = {};
    for (const observerId of [...neighbours.keys()].sort(compareCodepoint)) {
      const subjects = /** @type {Map<string, string>} */ (neighbours.get(observerId));
      /** @type {Record<string, BeliefRecord>} */
      const bySubject = {};
      for (const subjectId of [...subjects.keys()].sort(compareCodepoint)) {
        if (!byId.has(subjectId)) continue;
        bySubject[subjectId] = groundTruthBelief(subjectId, /** @type {string} */ (subjects.get(subjectId)), ctx, now);
      }
      if (Object.keys(bySubject).length) seeded[observerId] = { [GOVERNING_SEAT_KEY]: bySubject };
    }
    const next = Object.keys(seeded).length ? seeded : null;
    return { next, changed: !!next };
  }

  // ── NORMAL PATH: reconcile / decay per (observer, subject). ─────────────────
  const rumorLedgers = asObject(getSpatialLedger(worldState, 'rumorLedgers'));
  // D1: the frozen digest for the distance surcharge, read ONCE — null unless
  // distancePricedNewsEnabled is lit (dark ⇒ every reportsBySubject below is passed
  // null ⇒ zero surcharge ⇒ byte-identical).
  const newsDigest = distancePricedNewsActive(worldState)
    ? activeSpatialDigest(/** @type {Parameters<typeof activeSpatialDigest>[0]} */ (worldState)) : null;
  // Every observer that either holds a belief OR heard a rumor this window. The
  // reserved seed sentinel is NOT an observer — realObserverKeys already excludes
  // it. [spatial-engine-5]
  const observers = new Set([...realObserverKeys, ...Object.keys(rumorLedgers), ...neighbours.keys()].map(String));
  /** @type {Record<string, Record<string, Record<string, BeliefRecord>>>} */
  const next = {};
  let mutated = false;

  for (const observerId of [...observers].sort(compareCodepoint)) {
    const priorObserver = asObject(asObject(prior)[observerId]);
    const item = byId.get(String(observerId));

    // ── The SEAT slot (the governing coalition's operational belief) — ALL reports,
    //    byte-identical to Wave A: the whole ledger reconciled through reconcileSlot. ─
    const priorSeat = asObject(priorObserver[GOVERNING_SEAT_KEY]);
    const seat = reconcileSlot({
      priorSlot: priorSeat,
      reports: reportsBySubject(rumorLedgers[observerId], observerId, now, null, newsDigest),
      ctx, neighbours, observerId, now, credibilityOf, sightOf, commitmentDiscountFor,
    });
    if (seat.pruned) mutated = true;

    // ── The PER-FACTION slots (M9a) — each fed by its round-9 carrier's partition of
    //    the SAME ledger; sparse (materialized only where the faction is present AND
    //    a carrier-tagged report arrived / a prior slot survives). A COMPROMISED
    //    faction LEAKS its carrier into the public stream. ─────────────────────────
    /** @type {Record<string, Record<string, BeliefRecord>>} */
    const factionSlots = {};
    if (item) {
      const { slots, leakedTags } = observerFactionSlots(item);
      for (const archetype of [...slots.keys()].sort(compareCodepoint)) {
        const framingTag = /** @type {{ framingTag: string }} */ (slots.get(archetype)).framingTag;
        const built = reconcileSlot({
          priorSlot: asObject(priorObserver[archetype]),
          reports: reportsBySubject(rumorLedgers[observerId], observerId, now, (f) => f.includes(framingTag), newsDigest),
          ctx, neighbours, observerId, now, credibilityOf, sightOf, commitmentDiscountFor,
        });
        if (built.pruned) mutated = true;
        if (Object.keys(built.bySubject).length) factionSlots[archetype] = built.bySubject;
      }
      // public ← AMBIENT (untagged firsthand) ∪ LEAKED (compromised carriers).
      const publicBuilt = reconcileSlot({
        priorSlot: asObject(priorObserver[PUBLIC_FACTION_KEY]),
        reports: reportsBySubject(rumorLedgers[observerId], observerId, now,
          (f) => f.length === 0 || f.some((t) => leakedTags.has(t)), newsDigest),
        ctx, neighbours, observerId, now, credibilityOf, sightOf, commitmentDiscountFor,
      });
      if (publicBuilt.pruned) mutated = true;
      if (Object.keys(publicBuilt.bySubject).length) factionSlots[PUBLIC_FACTION_KEY] = publicBuilt.bySubject;
    }

    // Assemble the observer's faction dimension: seat + per-faction, codepoint-sorted
    // keys (byte-stable). Empty rosters ⇒ { seat } only ⇒ byte-identical to Wave A.
    /** @type {Record<string, Record<string, BeliefRecord>>} */
    const observerOut = {};
    if (Object.keys(seat.bySubject).length) observerOut[GOVERNING_SEAT_KEY] = seat.bySubject;
    for (const k of Object.keys(factionSlots).sort(compareCodepoint)) observerOut[k] = factionSlots[k];
    if (Object.keys(observerOut).length) {
      /** @type {Record<string, Record<string, BeliefRecord>>} */
      const sorted = {};
      for (const k of Object.keys(observerOut).sort(compareCodepoint)) sorted[k] = observerOut[k];
      next[observerId] = sorted;
    }
  }

  // M9b component (4): the deliberate ally-intel sharing channel (OPT-IN). AFTER the
  // per-observer reconcile, allies pool high-confidence intel (styled by alignment) +
  // a compromised believed-ally leaks the sharer's intel to its real enemy. Disabled
  // ⇒ `next` is returned unchanged ⇒ byte-identical to the M9a advance.
  const shared = allyIntel?.enabled
    ? applyAllyIntelSharing({ maps: next, ctx, neighbours, alignmentOf: allyIntel.alignmentOf || (() => ({ lawfulness01: 0.5, malice01: 0.5 })), now })
    : next;
  // Reached only when the world is SEEDED (cold-start handles never-seeded). If
  // the ledger decayed fully empty, persist the one-key seed sentinel instead of
  // dropping to null — so next tick reads "seeded-but-empty" (deep fog persists),
  // not "never seeded" (which re-cold-starts to ground truth). The sentinel is
  // CONDITIONAL: a non-empty belief-active ledger never carries it ⇒ byte-identical.
  // [spatial-engine-5]
  const nextOrNull = Object.keys(shared).length ? shared : { [BELIEF_SEED_KEY]: canonVersion };
  const changed = mutated || JSON.stringify(prior ?? null) !== JSON.stringify(nextOrNull);
  return { next: changed ? nextOrNull : prior, changed };
}

// ── M9a: DISSENT — the internal schism (belief divergence across the factions) ─
/** The relationship labels the schism reads as "hostile" for a stance flip. */
const SCHISM_HOSTILE = new Set(['hostile', 'cold_war', 'rival']);

/**
 * @typedef {Object} CouncilSchism
 * @property {string} observerId       the settlement whose council is split
 * @property {string} factionKey       the dissenting faction (a per-faction slot key)
 * @property {string} subjectId        the subject the factions read differently
 * @property {number} bandGap          |faction band − seat band|
 * @property {boolean} relFlip         faction ⇄ seat disagree on hostility
 * @property {boolean} inCoalition     the dissenter sits INSIDE the governing coalition
 * @property {number} confidence01     the dissenting faction's confidence
 * @property {number} severity         0..1 schism severity
 */

/**
 * DISSENT (design §VI, round 14): a faction believing something MATERIALLY different
 * from the coalition's operational (seat) belief is an internal STRESSOR — the
 * council is split (the merchants know a rival is formidable while the mayor, acting
 * on stale word, still thinks it slight). Reads the observer's OWN faction slots
 * against its seat slot; returns the SHARPEST divergence (or null when the council
 * agrees / holds no differentiated faction belief). Pure; deterministic (codepoint
 * fold, no rng). The coalition colours severity: an IN-coalition dissenter is the
 * worse schism (the ruling bloc itself is divided).
 * @param {Object} args
 * @param {string} args.observerId
 * @param {unknown} args.factionMaps  the observer's slots (belief maps for observerId)
 * @param {{ members?: Set<string> } | null} [args.coalition]
 * @returns {CouncilSchism | null}
 */
export function detectCouncilSchism({ observerId, factionMaps, coalition = null }) {
  const maps = asObject(factionMaps);
  const seat = asObject(maps[GOVERNING_SEAT_KEY]);
  if (!Object.keys(seat).length) return null;
  const members = coalition && coalition.members instanceof Set ? coalition.members : new Set();
  /** @type {CouncilSchism | null} */
  let worst = null;
  for (const factionKey of Object.keys(maps).sort(compareCodepoint)) {
    if (factionKey === GOVERNING_SEAT_KEY) continue;
    const slot = asObject(maps[factionKey]);
    for (const subjectId of Object.keys(slot).sort(compareCodepoint)) {
      const fRec = /** @type {BeliefRecord} */ (slot[subjectId]);
      const sRec = /** @type {BeliefRecord} */ (seat[subjectId]);
      if (!fRec || !sRec || typeof fRec !== 'object' || typeof sRec !== 'object') continue;
      // The dissenting faction must be CONFIDENT for its divergence to split the
      // council (a vague hunch is not a schism).
      if (clamp01(fRec.confidence01) < BELIEF_TUNING.SIEGE_AWARENESS_CONFIDENCE) continue;
      const bandGap = Math.abs(Math.round(finiteNumber(fRec.strengthBand, 2)) - Math.round(finiteNumber(sRec.strengthBand, 2)));
      const relFlip = SCHISM_HOSTILE.has(String(fRec.allianceLabel)) !== SCHISM_HOSTILE.has(String(sRec.allianceLabel));
      if (bandGap < BELIEF_TUNING.MISJUDGE_BAND_DELTA && !relFlip) continue; // no material divergence
      const inCoalition = members.has(factionKey);
      const severity = clamp01(0.3 + 0.12 * bandGap + (relFlip ? 0.15 : 0) + (inCoalition ? 0.15 : 0));
      /** @type {CouncilSchism} */
      const cand = {
        observerId: String(observerId), factionKey, subjectId: String(subjectId),
        bandGap, relFlip, inCoalition,
        confidence01: round4(clamp01(fRec.confidence01)), severity: round4(severity),
      };
      if (!worst || cand.severity > worst.severity) worst = cand; // first (codepoint) wins ties
    }
  }
  return worst;
}

// ── Misjudgment-as-cause (the fog of war made DM-visible) ─────────────────────
/**
 * A misjudgment payload the chooser stamps on an offensive move built on a
 * belief that DIVERGES from the truth beyond the band (design §4g / §4.2-5). The
 * W-C5 cause-lifecycle shape: what was believed, what was true, which telling
 * misled. Returns null when the belief is sound (no misjudgment) — so a
 * well-informed actor stamps nothing (byte-neutral).
 * @param {Object} args
 * @param {string} args.observerId @param {string} args.subjectId
 * @param {number} args.believedStrengthBand @param {number} args.trueStrengthBand
 * @param {string} args.believedRelationship @param {string} args.trueRelationship
 * @param {number} args.confidence01
 * @param {'strength'|'relationship'} [args.hostileTypesTrueMissing]  unused placeholder
 * @returns {Misjudgment | null}
 */
export function detectMisjudgment({
  observerId, subjectId, believedStrengthBand, trueStrengthBand,
  believedRelationship, trueRelationship, confidence01,
}) {
  const bandGap = Math.abs(Math.round(believedStrengthBand) - Math.round(trueStrengthBand));
  const strengthMisjudged = bandGap >= BELIEF_TUNING.MISJUDGE_BAND_DELTA;
  // A stale hostility: the observer believes the subject hostile while the truth
  // is not (marching on a former enemy now at peace — the ally-confusion war).
  const HOSTILE = new Set(['hostile', 'cold_war', 'rival']);
  const relationshipMisjudged = HOSTILE.has(String(believedRelationship)) && !HOSTILE.has(String(trueRelationship));
  if (!strengthMisjudged && !relationshipMisjudged) return null;
  return {
    observerId: String(observerId),
    subjectId: String(subjectId),
    believedStrengthBand: Math.round(believedStrengthBand),
    trueStrengthBand: Math.round(trueStrengthBand),
    believedRelationship: String(believedRelationship),
    trueRelationship: String(trueRelationship),
    confidence01: round4(clamp01(confidence01)),
    kinds: [
      ...(strengthMisjudged ? ['strength'] : []),
      ...(relationshipMisjudged ? ['relationship'] : []),
    ],
  };
}

/**
 * @typedef {Object} Misjudgment
 * @property {string} observerId @property {string} subjectId
 * @property {number} believedStrengthBand @property {number} trueStrengthBand
 * @property {string} believedRelationship @property {string} trueRelationship
 * @property {number} confidence01 @property {string[]} kinds
 */

const STRENGTH_WORDS = Object.freeze(['negligible', 'slight', 'middling', 'formidable', 'overwhelming']);
/** @param {number} band */
function strengthWord(band) {
  return STRENGTH_WORDS[clamp(Math.round(finiteNumber(band, 2)), 0, STRENGTH_BANDS - 1)];
}

/**
 * Compose wizard-news entries (house voice) for the misjudgments carried by this
 * tick's SELECTED offensive moves — the legible receipt of the fog of war. Empty
 * when nothing misjudged ⇒ byte-neutral. Mirrors causeLifecycleNewsEntries.
 * @param {Array<{ id?: string, metadata?: { misjudgment?: Misjudgment } }>} selected
 * @param {(id: string) => string} nameFor
 * @param {number} tick
 * @param {string | null} now
 * @returns {Array<Record<string, unknown>>}
 */
export function beliefMisjudgmentNewsEntries(selected, nameFor = (id) => String(id), tick = 0, now = null) {
  const rows = (Array.isArray(selected) ? selected : [])
    .map((o) => ({ o, m: o?.metadata?.misjudgment }))
    .filter((row) => row.m && typeof row.m === 'object')
    .sort((a, b) => compareCodepoint(String(a.o.id ?? ''), String(b.o.id ?? '')));
  return rows.map(({ m }) => {
    const mis = /** @type {Misjudgment} */ (m);
    const mover = nameFor(mis.observerId);
    const target = nameFor(mis.subjectId);
    const strengthMis = mis.kinds.includes('strength');
    const relMis = mis.kinds.includes('relationship');
    const headline = `${mover} marches on a misjudgment`;
    const believedWord = strengthWord(mis.believedStrengthBand);
    const trueWord = strengthWord(mis.trueStrengthBand);
    const reasons = [];
    if (strengthMis) {
      reasons.push(`${mover} believed ${target} ${believedWord}; the truth is ${trueWord} (a stale, road-worn read).`);
    }
    if (relMis) {
      reasons.push(`${mover} still counts ${target} an enemy, though that hostility has since cooled — word never reached it.`);
    }
    reasons.push(`Confidence in the belief it acted on: ${mis.confidence01.toFixed(2)}.`);
    const summary = strengthMis
      ? `${mover} commits to an offensive against ${target} on a belief its strength is ${believedWord} — the truth is ${trueWord}. The fog of war, made real.`
      : `${mover} marches on ${target} over a hostility the world has already left behind.`;
    return {
      id: `wizard_news.${tick}.belief_misjudgment.${mis.observerId}.${mis.subjectId}`,
      tick,
      scope: 'regional',
      significance: 'notable',
      score: 58,
      headline,
      summary,
      kind: 'applied',
      impactKind: 'belief_misjudgment',
      channelType: null,
      severity: 0.5,
      settlementIds: [mis.observerId, mis.subjectId],
      impactIds: [],
      channelIds: [],
      sourceEventId: `belief_misjudgment.${mis.observerId}.${mis.subjectId}.${tick}`,
      tags: ['world_pulse', 'belief', 'misjudgment', ...mis.kinds],
      reasons,
      createdAt: now,
    };
  });
}
