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
import { infoModeOf } from './simulationRules.js';
import { settlementStrength, buildPressureSummary } from './relationshipEvolution.js';

// ── The v1 faction slot (present from day one; the governing coalition) ───────
/** The single faction key v1 carries — the governing seat's operational belief.
 *  Real per-faction keys (merchant/military/clergy/criminal/public) light in
 *  Wave B; the dimension EXISTS now so that is a value change, not a schema break. */
export const GOVERNING_SEAT_KEY = 'seat';

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
 * @param {{ beliefMaps?: unknown } | null | undefined} worldState
 * @param {string} observerId @param {string} subjectId
 * @param {string} [factionId]
 * @returns {BeliefRecord | null}
 */
export function beliefRecord(worldState, observerId, subjectId, factionId = GOVERNING_SEAT_KEY) {
  const maps = asObject(worldState?.beliefMaps);
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
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>, beliefMaps?: unknown } | null | undefined} worldState
 * @returns {BeliefResolution}
 */
export function belief(observerId, subjectId, worldState) {
  if (String(observerId) === String(subjectId)) return { source: 'truth' };   // self carve-out
  if (!beliefsActive(worldState)) return { source: 'truth' };                  // dormant ⇒ byte-exact
  const rec = beliefRecord(worldState, observerId, subjectId);
  return rec ? { source: 'belief', record: rec } : { source: 'unknown' };
}

// ── The three chooser reads (byte-exact identity fallback) ────────────────────
/**
 * The observer's read of a subject's strength: ground truth verbatim (dormant /
 * self), the banded belief midpoint (a held belief), or the neutral mid band
 * (max-uncertainty). `truthStrength` is the ground-truth value the caller already
 * computed — returned EXACTLY when the fallback fires (zero rng).
 * @param {string} observerId @param {string} subjectId
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>, beliefMaps?: unknown } | null | undefined} worldState
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
 * @param {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>, beliefMaps?: unknown } | null | undefined} worldState
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
  return {
    readiness: round4(groundTruthReadiness(ctx.worldState, subjectId)),
    strengthBand: strengthBandOf(strength),
    allianceLabel: allianceLabel || 'unknown',
    faithLabel: groundTruthFaith(item),
    confidence01: 1,
    lastUpdateTick: now,
  };
}

/**
 * The worldState members the belief layer reads (a permissive projection — the
 * caller hands the full ensured worldState). Exported so the chooser's re-plumbed
 * reads can annotate their casts without widening to `any`.
 * @typedef {{ spatialCanonVersion?: unknown, simulationRules?: Record<string, unknown>,
 *   beliefMaps?: unknown, rumorLedgers?: unknown, warPosture?: unknown,
 *   relationshipStates?: unknown } | null | undefined} BeliefWorldState
 */

/** @typedef {{ id?: string | number, name?: string, settlement?: { config?: { primaryDeitySnapshot?: { name?: unknown } } } }} SnapItem */
/** @typedef {{ from?: unknown, to?: unknown, source?: unknown, target?: unknown, a?: unknown, b?: unknown, id?: unknown, relationshipType?: unknown }} RawEdge */
/** @typedef {{ byId?: Map<string, SnapItem>, settlements?: SnapItem[], regionalGraph?: { edges?: RawEdge[] }, relationships?: RawEdge[] }} BeliefSnapshot */

/**
 * @typedef {Object} GroundTruthCtx
 * @property {Map<string, SnapItem>} byId     snapshot items by id
 * @property {unknown} pressureIdx            the pressure index (settlementStrength input)
 * @property {{ warPosture?: unknown }} worldState  the ledgers (readiness)
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
 */

/** The aggregate weight + accuracy of a report set (provenance × recency ×
 *  independence × completeness). Reports are pre-sorted by the caller.
 *  @param {BeliefReport[]} reports @returns {{ weight: number, accuracy: number }} */
function aggregateReports(reports) {
  const T = BELIEF_TUNING;
  let weight = 0;
  let accWeighted = 0;
  for (const r of reports) {
    const w = Math.pow(T.HOP_DECAY, Math.max(0, r.hopCount))
      * Math.pow(T.RECENCY_DECAY, Math.max(0, r.ageTicks))
      * (T.INDEP_BASE + T.INDEP_PER * Math.max(1, r.independentSources))
      * clamp01(r.completeness01);
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
 * @returns {BeliefRecord}
 */
export function reconcileBelief({ prior, groundTruth, reports, now }) {
  const T = BELIEF_TUNING;
  const priorConf = prior ? clamp01(prior.confidence01) : 0;
  if (!reports.length) {
    // Silence: keep the (frozen) prior value; confidence already decayed by the
    // caller. A new belief with no report never materializes (guarded upstream).
    return prior
      ? { ...prior, confidence01: round4(priorConf) }
      : { ...groundTruth, confidence01: 0, lastUpdateTick: now };
  }
  const { weight, accuracy } = aggregateReports(reports);
  // Numeric attributes re-anchor toward the fidelity-degraded truth (a garbled
  // telling pulls the observation toward the neutral midpoint).
  const obsStrengthBand = accuracy * groundTruth.strengthBand + (1 - accuracy) * T.NEUTRAL_STRENGTH_BAND;
  const obsReadiness = accuracy * groundTruth.readiness + (1 - accuracy) * T.NEUTRAL_READINESS;
  const priorStrengthBand = prior ? prior.strengthBand : T.NEUTRAL_STRENGTH_BAND;
  const priorReadiness = prior ? prior.readiness : T.NEUTRAL_READINESS;
  const denom = priorConf + weight;
  const blendedStrength = (priorConf * priorStrengthBand + weight * obsStrengthBand) / denom;
  const blendedReadiness = (priorConf * priorReadiness + weight * obsReadiness) / denom;
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
  return {
    readiness: round4(clamp01(blendedReadiness)),
    strengthBand: clamp(Math.round(blendedStrength), 0, STRENGTH_BANDS - 1),
    allianceLabel,
    faithLabel,
    confidence01: round4(confidence01),
    lastUpdateTick: now,
  };
}

/** Confidence after `silentTicks` ticks of silence (pure arithmetic, no rng).
 *  @param {number} confidence01 @param {number} silentTicks @returns {number} */
export function decayedConfidence(confidence01, silentTicks) {
  const n = Math.max(0, Math.floor(finiteNumber(silentTicks, 0)));
  return clamp01(finiteNumber(confidence01, 0) * Math.pow(BELIEF_TUNING.SILENCE_DECAY, n));
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
 * @param {unknown} observerLedger  worldState.rumorLedgers[observerId]
 * @param {string} observerId @param {number} now
 * @returns {Map<string, Array<{ report: BeliefReport, arrivalTick: number }>>}
 */
function reportsBySubject(observerLedger, observerId, now) {
  /** @type {Map<string, Array<{ report: BeliefReport, arrivalTick: number }>>} */
  const out = new Map();
  const ledger = asObject(observerLedger);
  for (const key of Object.keys(ledger)) {
    const rec = /** @type {{ arrivalTick?: unknown, content?: unknown, hopCount?: unknown, corroborationRoots?: unknown, completeness01?: unknown, accuracy01?: unknown, score?: unknown } | null } */ (ledger[key]);
    if (!rec || typeof rec !== 'object') continue;
    const arrivalTick = Math.floor(finiteNumber(rec.arrivalTick, Infinity));
    if (arrivalTick > now) continue; // in transit — not yet heard
    const content = asObject(rec.content);
    const parties = new Set(
      [content.whereId, ...(Array.isArray(content.partyIds) ? content.partyIds : [])]
        .filter((v) => v != null && v !== '')
        .map(String),
    );
    /** @type {BeliefReport} */
    const report = {
      hopCount: Math.max(0, Math.floor(finiteNumber(rec.hopCount, 0))),
      ageTicks: Math.max(0, now - arrivalTick),
      independentSources: Array.isArray(rec.corroborationRoots) ? rec.corroborationRoots.length : 1,
      completeness01: clamp01(finiteNumber(rec.completeness01, 1)),
      accuracy01: clamp01(finiteNumber(rec.accuracy01, 1)),
      score: Math.max(0, finiteNumber(rec.score, 0)),
      sortKey: String(key),
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
 * @param {{ beliefMaps?: unknown, rumorLedgers?: unknown, warPosture?: unknown,
 *   relationshipStates?: unknown, spatialCanonVersion?: unknown,
 *   simulationRules?: Record<string, unknown> }} args.worldState  the ensured worldState
 * @param {number} args.tick
 * @returns {{ next: Record<string, unknown> | null, changed: boolean }}
 */
export function advanceBeliefMaps({ snapshot, pressureIdx, worldState, tick }) {
  const prior = worldState && typeof worldState === 'object' && 'beliefMaps' in worldState
    ? asObject(worldState.beliefMaps)
    : null;
  if (!beliefsActive(worldState)) {
    return { next: prior && Object.keys(prior).length ? prior : null, changed: false };
  }
  const now = Math.max(0, Math.floor(finiteNumber(tick, 0)));
  const byId = snapshot?.byId instanceof Map
    ? snapshot.byId
    : new Map((snapshot?.settlements || []).map((/** @type {SnapItem} */ it) => [String(it.id), it]));
  /** @type {GroundTruthCtx} */
  const ctx = { byId, pressureIdx, worldState };
  const neighbours = relationshipNeighbourhood(snapshot, worldState);
  const priorPresent = !!prior && Object.keys(prior).length > 0;
  const T = BELIEF_TUNING;

  // ── COLD-START: seed the declared neighbourhood to ground truth, once. ──────
  if (!priorPresent) {
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
  const rumorLedgers = asObject(worldState.rumorLedgers);
  // Every observer that either holds a belief OR heard a rumor this window.
  const observers = new Set([...Object.keys(prior), ...Object.keys(rumorLedgers), ...neighbours.keys()].map(String));
  /** @type {Record<string, Record<string, Record<string, BeliefRecord>>>} */
  const next = {};
  let mutated = false;

  for (const observerId of [...observers].sort(compareCodepoint)) {
    const priorSeat = asObject(asObject(asObject(prior)[observerId])[GOVERNING_SEAT_KEY]);
    const reports = reportsBySubject(rumorLedgers[observerId], observerId, now);
    // Subjects to consider: prior beliefs ∪ subjects heard about this window.
    const subjectIds = new Set([...Object.keys(priorSeat), ...reports.keys()].map(String));
    /** @type {Record<string, BeliefRecord>} */
    const bySubject = {};
    for (const subjectId of [...subjectIds].sort(compareCodepoint)) {
      const priorRec = /** @type {BeliefRecord | null} */ (
        priorSeat[subjectId] && typeof priorSeat[subjectId] === 'object' ? priorSeat[subjectId] : null
      );
      const rows = reports.get(subjectId) || [];
      // Reports FRESH since the last refresh (existing belief) or recent enough to
      // materialize (new belief) — bounds resurrection of a pruned belief.
      const freshRows = sortReports(rows.filter(({ arrivalTick }) => (priorRec
        ? arrivalTick > Math.floor(finiteNumber(priorRec.lastUpdateTick, -Infinity))
        : now - arrivalTick <= T.MATERIALIZE_WINDOW)));
      const freshReports = freshRows.map((row) => row.report);

      if (!priorRec && !freshReports.length) continue; // no belief, no fresh word

      // The current true relationship label observer↔subject (for the re-anchor).
      const trueType = neighbours.get(observerId)?.get(subjectId) || priorRec?.allianceLabel || 'unknown';
      const groundTruth = groundTruthBelief(subjectId, trueType, ctx, now);

      let record;
      if (freshReports.length) {
        const silent = priorRec ? Math.max(0, now - Math.floor(finiteNumber(priorRec.lastUpdateTick, now))) : 0;
        const decayedPrior = priorRec ? { ...priorRec, confidence01: decayedConfidence(priorRec.confidence01, silent) } : null;
        record = reconcileBelief({ prior: decayedPrior, groundTruth, reports: freshReports, now });
      } else {
        // Silence: decay confidence, keep the frozen value.
        const silent = Math.max(0, now - Math.floor(finiteNumber(/** @type {BeliefRecord} */ (priorRec).lastUpdateTick, now)));
        const conf = decayedConfidence(/** @type {BeliefRecord} */ (priorRec).confidence01, silent);
        record = { .../** @type {BeliefRecord} */ (priorRec), confidence01: round4(conf) };
      }

      if (record.confidence01 < T.MIN_CONFIDENCE) { mutated = true; continue; } // forgotten
      bySubject[subjectId] = record;
    }
    if (Object.keys(bySubject).length) next[observerId] = { [GOVERNING_SEAT_KEY]: bySubject };
  }

  const nextOrNull = Object.keys(next).length ? next : null;
  const changed = mutated || JSON.stringify(prior ?? null) !== JSON.stringify(nextOrNull);
  return { next: changed ? nextOrNull : prior, changed };
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
