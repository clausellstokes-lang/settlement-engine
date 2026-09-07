/**
 * domain/npc/knownCharacter.js — THE REPUTATION READ (W-LIVES car L4, the R2
 * half-car; DESIGN_W_LIVES.md §12 R2 and §15's panel fold, which OUTRANKS it).
 *
 * WHAT THIS HOLDS. What OTHERS believe a person's character to be — derived, every
 * tick, from the RECEIPTED SUBSET of what happened to them, and from nothing else.
 *
 * ── THERE IS NO SECOND PERSONALITY STORE, AND THAT IS THE DESIGN ────────────
 *
 * §12 R2: "No second personality store." GAP D: "Biography is a query, not a
 * store... No per-NPC memory store exists or may be minted." So this module holds
 * NOTHING. It is a function of (the authored core, the on-record disclosures, the
 * observer) and it recomputes from those three every time it is asked. The town's
 * opinion is not a thing the world saves; it is a thing the world can be asked.
 *
 * The consequence is the point of the whole feature: UNRECEIPTED DRIFT STAYS
 * PRIVATE. The reeve whose hardening crossed a band, and whose crossing made news,
 * is known to have hardened. The quiet clerk whose treachery never crossed anything
 * reads exactly as he was authored — and his betrayal, when it comes, surprises
 * everybody. That asymmetry is not a gap in the model; it IS the model.
 *
 * ── ⭐ THE SIGHT RULING, MADE STRUCTURAL ────────────────────────────────────
 *
 * §12 R2: "mortal consumers (patrons, courts, R1 refusals) read KNOWN character;
 * deities read TRUE character (`targetedFootholds` keeps true-sight,
 * byte-identical) — gods know souls, men know reputations."
 *
 * `characterAsSeenBy` is the one seam that routes it, and the divine branch is
 * L2's `effectiveCharacter` CALLED, never re-implemented — so "deities read the
 * true chart" is a property of there being one function, not of two functions
 * agreeing. When drift is absent that call returns the authored core BY REFERENCE,
 * which is what makes the byte-identity claim checkable rather than asserted.
 *
 * ⚠ AND THE MEASURED FACT THAT MAKES THE CLAIM EASY TODAY: `targetedFootholds`
 * (`worldPulse/clergyTraitPlane.js`) does not read `npc.character` AT ALL — it
 * reads `npc.personality` through `npcTraitPlane`. So the deity consumer is
 * byte-unchanged by construction, because it has no code path this car could
 * disturb. Re-pointing it at `effectiveCharacter` is car L5's act; this car pins
 * that it has NOT happened yet, so the day it does, somebody has to mean it.
 *
 * ── THE BELIEF WEIGHT IS DERIVED, NEVER AUTHORED ────────────────────────────
 *
 * §12 R2: "per-observer belief = the subject's track record (credibility stock ×
 * revealed states) × the observer's own TRUST-axis position." Both halves are read
 * from machinery that already exists and neither invents a number:
 *
 *   THE SUBJECT'S HALF is `npcCredibilityWeightOf`, the estate's own multiplicative
 *   credibility weight, centred on exactly 1.0 for somebody with no record.
 *   THE OBSERVER'S HALF is their own effective TRUST position, mapped onto [0,1]
 *   across the spectrum's own span — so a neutral observer sits at exactly one
 *   half, a `defining`-trusting one at 1, and a `defining`-suspicious one at 0.
 *
 * A believed position is then the core walked toward the disclosed one by that
 * confidence. The arithmetic has a consequence worth stating out loud because it
 * reads as a bug and is not one: at neutral trust and ordinary credibility the
 * confidence is one half, so ONE disclosed band crossing usually bands back to the
 * core and the town's opinion does not move. One rumour does not change a man's
 * reputation. It takes a record.
 *
 * PURE. No world state written, no clock, no PRNG, no I/O, no mutation, no store.
 *
 * @see docs/DESIGN_W_LIVES.md §12 (R1, R2, R3b), §14 (GAP D), §15
 * @see docs/OWNER_DECISION_QUEUE.md §802, §856
 * @enforced-by tests/domain/npc/knownCharacter.test.js
 */

import { clamp01 } from '../../kernel/math.js';
import { compareCodepoint } from '../deterministicSort.js';
import { npcCredibilityWeightOf } from '../worldPulse/npcCredibility.js';
import {
  AXIS_LEVELS,
  SPECTRUM_HALF_SPAN,
  authoredCharacterOf,
  effectiveCharacter,
  positionValue,
  valuePosition,
} from './characterDrift.js';

/**
 * WHO IS LOOKING. Two kinds of viewer, and there is no third: the ruling is an
 * asymmetry between gods and men, not a ladder of partial sight.
 * @type {readonly string[]}
 */
export const SIGHT_VIEWERS = Object.freeze(['deity', 'mortal']);

/** The viewer whose sight is TRUE. Named once so the seam cannot grow a second spelling. */
export const TRUE_SIGHT_VIEWER = 'deity';

/**
 * The disclosure kinds this read accepts — the funnel's own receipt kinds, because
 * "what made news" is exactly "what the funnel minted a receipt for". A displacement
 * says the composition changed and names no band, so it discloses no POSITION; it
 * is carried because it is on record and it tells an observer that something moved.
 * @type {readonly string[]}
 */
export const DISCLOSURE_KINDS = Object.freeze(['band_crossing', 'displacement', 'reversal']);

/**
 * The revealed STATES §12 R2 names beside the crossings. These are facts the town
 * holds about a person that are not positions on any axis, so they ride the reading
 * as flags rather than being folded into the chart — a court refusing a compromise
 * needs "he has been exposed", not a number.
 * @type {readonly string[]}
 */
export const KNOWN_STATE_FLAGS = Object.freeze(['lieStigma', 'revealedCorruption']);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) {
  return Array.isArray(v) ? v : [];
}

/** @param {unknown} v @returns {string} */
function str(v) {
  return v == null ? '' : String(v);
}

// ⛔ `num()` IS LOAD-BEARING AND STAYS. The bare local clamp01 this replaced
// (`Math.max(0, Math.min(1, v))`) rode NaN straight through; the kernel's
// `Number.isFinite` guard sends it to 0. Both call sites are byte-neutral only
// because their arguments are already finite — `positionValue` is total over
// garbage and returns a finite band position, and `credibility` is `num()`-wrapped.
/** @param {unknown} v @returns {number} */
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

/**
 * A band word (`virtue_marked`, `vice_a_touch`, `neutral`) back to a signed band
 * position. TOTAL: an unreadable word bands at the midpoint, because a disclosure
 * nobody can parse makes no claim about anybody.
 * @param {unknown} word @returns {number}
 */
export function bandWordPosition(word) {
  const text = str(word);
  const split = text.indexOf('_');
  if (split <= 0) return 0;
  const pole = text.slice(0, split);
  const level = text.slice(split + 1);
  if ((pole !== 'virtue' && pole !== 'vice') || !AXIS_LEVELS.includes(level)) return 0;
  return positionValue({ pole: /** @type {'virtue'|'vice'} */ (pole), level });
}

/**
 * THE OBSERVER'S HALF of the belief weight: their own effective TRUST position,
 * mapped across the spectrum's own span onto [0,1]. DERIVED from
 * `SPECTRUM_HALF_SPAN`, never chosen — a neutral observer lands on exactly one
 * half, and the two extremes land on 1 and 0, which is the whole claim §12 R2
 * makes about the observer's TRUST axis.
 *
 * ⚠ ABSENT OBSERVER ⇒ NEUTRAL, NOT CREDULOUS. A caller with nobody in particular in
 * mind gets the half-weight of an ordinary listener, so "the town in general"
 * is a real answer rather than a maximally believing one.
 * @param {{character?: unknown}|null|undefined} observer
 * @param {Record<string, {offset: number, updatedTick: number}>|null|undefined} observerDrift
 * @returns {number} 0..1
 */
export function observerTrustWeight(observer, observerDrift) {
  const chart = asObject(asObject(effectiveCharacter(observer, observerDrift)).axes);
  const trust = positionValue(/** @type {{pole?: 'virtue'|'vice', level?: string}} */ (chart.TRUST));
  return clamp01((trust + SPECTRUM_HALF_SPAN) / (2 * SPECTRUM_HALF_SPAN));
}

/**
 * THE CONFIDENCE one observer places in the record about one subject: the estate's
 * own credibility weight times the observer's trust weight, clamped to [0,1].
 *
 * `npcCredibilityWeightOf` returns EXACTLY 1.0 for a person with no record and for
 * a dark ledger, so an observer with neutral TRUST reads a stranger's record at
 * exactly one half — which is the honest prior and costs no configuration.
 * @param {Object} args
 * @param {Record<string, unknown>} args.worldState
 * @param {string} args.subjectNpcKey  the composite key the credibility ledger is keyed on
 * @param {{character?: unknown}|null|undefined} [args.observer]
 * @param {Record<string, {offset: number, updatedTick: number}>|null|undefined} [args.observerDrift]
 * @param {number} args.tick
 * @returns {number} 0..1
 */
export function beliefConfidence({ worldState, subjectNpcKey, observer, observerDrift, tick }) {
  const credibility = num(npcCredibilityWeightOf(worldState, str(subjectNpcKey), num(tick)));
  return clamp01(credibility * observerTrustWeight(observer, observerDrift));
}

/**
 * @typedef {Object} KnownReading
 * @property {unknown} character                     the BELIEVED chart, `effectiveCharacter`'s shape
 * @property {number} confidence                     the weight the record was read at
 * @property {readonly string[]} disclosedAxes       the axes the record speaks to at all
 * @property {Readonly<Record<string, boolean>>} flags  the revealed states §12 R2 names
 */

/**
 * THE DERIVED READ. Everything an observer believes about a subject, from the
 * on-record subset and nothing else.
 *
 * THE DISCLOSURES ARE GIVEN, NOT FETCHED, and that is GAP D honoured rather than
 * quoted: a biography is a QUERY over the receipts that name a person, so the
 * caller runs the query and hands the answer in. A version of this function that
 * went looking would need somewhere to look, and somewhere to look is the store the
 * design forbids.
 *
 * ONE AXIS TAKES ITS LATEST DISCLOSURE, never a sum. Two crossings on one axis are
 * two reports of the same journey, not two journeys; the later one is what the town
 * holds. Ties break on the evidence id so a reading is a property of the record set
 * rather than of its order.
 *
 * @param {Object} args
 * @param {{character?: unknown}} args.npc                     the roster record, for its authored core
 * @param {ReadonlyArray<Record<string, unknown>>} [args.disclosures]  on-record receipts naming them
 * @param {Record<string, unknown>} [args.worldState]
 * @param {string} [args.subjectNpcKey]
 * @param {{character?: unknown}|null} [args.observer]
 * @param {Record<string, {offset: number, updatedTick: number}>|null} [args.observerDrift]
 * @param {number} [args.tick]
 * @param {Readonly<Record<string, boolean>>} [args.flags]
 * @returns {KnownReading}
 */
export function knownCharacterOf({
  npc, disclosures, worldState, subjectNpcKey, observer, observerDrift, tick, flags,
}) {
  const core = authoredCharacterOf(npc);
  const confidence = beliefConfidence({
    worldState: asObject(worldState),
    subjectNpcKey: str(subjectNpcKey),
    observer,
    observerDrift,
    tick: num(tick),
  });

  // 1. THE RECORD, folded to one disclosed position per axis — latest wins.
  /** @type {Map<string, {position: number, tick: number, eventId: string}>} */
  const latest = new Map();
  /** @type {Set<string>} */
  const spokenOf = new Set();
  for (const raw of asArray(disclosures)) {
    const row = asObject(raw);
    if (!DISCLOSURE_KINDS.includes(str(row.kind))) continue;
    const axisId = str(row.axisId);
    if (!axisId) continue;
    spokenOf.add(axisId);
    // A displacement names no band — it says the composition moved, which is on
    // record and is not a claim about where any axis now sits.
    const to = str(asObject(row.crossing).to);
    if (!to) continue;
    const at = num(row.tick);
    const eventId = str(asArray(row.sourceEventIds)[0]);
    const held = latest.get(axisId);
    if (held && (held.tick > at || (held.tick === at && compareCodepoint(held.eventId, eventId) <= 0))) continue;
    latest.set(axisId, { position: bandWordPosition(to), tick: at, eventId });
  }

  // 2. THE BELIEVED CHART. An axis the record never spoke of reads at the AUTHORED
  //    CORE — not at the true effective position, which is exactly the privacy the
  //    whole feature turns on.
  const authored = asObject(asObject(core).axes);
  /** @type {Record<string, unknown>} */
  const axes = {};
  const axisIds = [...new Set([...Object.keys(authored), ...latest.keys()])].sort(compareCodepoint);
  for (const axisId of axisIds) {
    const disclosed = latest.get(axisId);
    if (!disclosed) {
      if (authored[axisId]) axes[axisId] = authored[axisId];
      continue;
    }
    const home = positionValue(/** @type {{pole?: 'virtue'|'vice', level?: string}} */ (authored[axisId]));
    // BELIEF WALKS THE CORE TOWARD THE RECORD, by the confidence and no further.
    const believed = valuePosition(home + confidence * (disclosed.position - home));
    if (believed.pole) axes[axisId] = believed;
  }

  /** @type {Record<string, boolean>} */
  const known = {};
  for (const flag of KNOWN_STATE_FLAGS) known[flag] = asObject(flags)[flag] === true;

  return Object.freeze({
    // The same shape `effectiveCharacter` returns, so a mortal consumer swaps one
    // for the other without learning a second vocabulary.
    character: Object.freeze({ ...asObject(core), axes: Object.freeze(axes) }),
    confidence,
    disclosedAxes: Object.freeze([...spokenOf].sort(compareCodepoint)),
    flags: Object.freeze(known),
  });
}

/**
 * ⭐ THE SIGHT SEAM. One function, two branches, and the divine one is L2's
 * chokepoint CALLED rather than copied.
 *
 * A deity reads the TRUE chart — `effectiveCharacter(npc, drift)`, the same
 * reference an undrifted soul's authored core is. A mortal reads the KNOWN one.
 * An unrecognised viewer reads as a mortal: sight is a privilege, so the failure
 * direction is toward less of it, never more.
 *
 * @param {Object} args
 * @param {string} args.viewer                    a SIGHT_VIEWERS member
 * @param {{character?: unknown}} args.npc
 * @param {Record<string, {offset: number, updatedTick: number}>|null} [args.drift]
 * @param {ReadonlyArray<Record<string, unknown>>} [args.disclosures]
 * @param {Record<string, unknown>} [args.worldState]
 * @param {string} [args.subjectNpcKey]
 * @param {{character?: unknown}|null} [args.observer]
 * @param {Record<string, {offset: number, updatedTick: number}>|null} [args.observerDrift]
 * @param {number} [args.tick]
 * @param {Readonly<Record<string, boolean>>} [args.flags]
 * @returns {unknown} the character chart this viewer is entitled to
 */
export function characterAsSeenBy({
  viewer, npc, drift, disclosures, worldState, subjectNpcKey, observer, observerDrift, tick, flags,
}) {
  if (str(viewer) === TRUE_SIGHT_VIEWER) return effectiveCharacter(npc, drift);
  return knownCharacterOf({
    npc, disclosures, worldState, subjectNpcKey, observer, observerDrift, tick, flags,
  }).character;
}

/**
 * Provenance, in the module, the L1 catalog's idiom.
 * @type {Readonly<{status: string, signedBy: string|null, ownerRows: readonly string[], consumers: string}>}
 */
export const KNOWN_CHARACTER_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (the belief weight is derived from two existing ladders)',
  signedBy: null,
  ownerRows: Object.freeze([
    'the observer TRUST mapping: carried as a linear read across the spectrum\'s own span, so neutral lands on exactly one half. A signed curve is the pen\'s',
    '⚠ THE DIRECTION OF SUSPICION, and it is a real fork. §12 R2 makes the observer\'s TRUST position a MULTIPLIER on the track record, so this car reads it literally: a trusting observer believes the record and a suspicious one discounts it, falling back to the public persona. The opposite reading — that suspicion AMPLIFIES a damning record ("a paranoid man believes the worst") — is equally sayable in English and would need a signed direction, not a guess. Measured today: confidence runs 0 at defining-suspicion, 0.5 at neutral, 1 at defining-trust',
    'whether a DISPLACEMENT should move belief at all — it is on record and names no band, so today it marks the axis as spoken-of and changes no position',
    'whether the two revealed STATES belong on the chart as pulls rather than beside it as flags (§12 R2 lists them in the track record; this car keeps them legible instead of numeric)',
    'the R1 acceptance refusal that consumes this read is car L5\'s; nothing here decides who a patron takes',
  ]),
  consumers: 'NONE in production by design — the mortal consumers are car L5\'s re-routes; targetedFootholds keeps TRUE sight and does not read a chart at all today',
});
