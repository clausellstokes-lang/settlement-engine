/**
 * domain/worldPulse/disinformationPlant.js — THE LIE'S LAW, AND THE PAID PLANT'S ENVELOPE.
 *
 * A PURE LEAF of the information-statecraft writer family (ruling R-BLD-4: the
 * single-writer law reads ONE WRITER FAMILY, never one file). informationStatecraft.js
 * remains the family HEAD and the sole belief/disinfo WRITER — `processLies` and
 * `advanceInformationStatecraft` still own every ledger mutation. This leaf owns only the
 * law and the shapes that writer consults, and mutates nothing:
 *
 *   THE LIE LAW — `LIE_TUNING` (willingness, initiation rarity, the inflation size, the
 *     exposure gap and the blowback charges) and `lieWillingness`, the alignment/structure
 *     gate that decides whether a seat will lie at all. Borrowed, never re-authored:
 *     brokerageServicesPlant.js imports the SAME constants, so a tuning edit to the lie
 *     moves the paid plant with it and the two can never drift apart.
 *   THE BELIEF-MAP OVERRIDE — `applyBeliefOverrides` returns a NEW maps object with each
 *     (observer → subject) override applied to the observer's SEAT slot, codepoint-sorted
 *     at every level so the result is byte-stable, and observers absent from the override
 *     set keep their EXACT prior reference (a no-op cannot mint fresh objects).
 *   THE PAID-PLANT ENVELOPE — `commissionedPlantAt`, the boundary validator. The commission
 *     producer is pure, so this seam must reject a forged alias, a stale deposit or an
 *     aliased sub-record rather than turning any of them into state. It proves the exact
 *     key set of every sub-record, that no two sub-records are the same object, that the
 *     asserted band is exactly the intent's authored exaggeration of the true band, and
 *     that the lineage/key/host tokens are the ones the liar's own identity implies.
 *
 * PURE: no Date, no Math.random, no store, no React, no I/O, no mutation. Every function
 * is total on garbage — a malformed envelope returns null rather than throwing.
 *
 * @enforced-by tests/domain/informationStatecraftPins.test.js
 * @enforced-by tests/domain/brokeragePlant.test.js
 */

import { compareCodepoint } from '../deterministicSort.js';
import { GOVERNING_SEAT_KEY } from './beliefMap.js';
import { clamp01 } from '../../kernel/math.js';

/** The disinfo record shape the head owns; referenced here as a type only. */
/** @typedef {import('./informationStatecraft.js').DisinfoRecord} DisinfoRecord */

/** @param {unknown} v @param {number} fallback @returns {number} */
function finiteNumber(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {};
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
export function seatBeliefRecord(maps, observerId, subjectId) {
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
export function applyBeliefOverrides(maps, overrides) {
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

const ENVOY_PICTURE_PLANT_FIELDS = new Set([
  'strengthBand',
  'storesBand',
  'foodPressureBand',
  'economyPressureBand',
  'tradePressureBand',
  'threatBand',
  'allyStrengthBand',
  'restitutionClaimBand',
  'warExhaustionBand',
  'alignmentPressBand',
]);
const PAID_PLANT_PRICE_BANDS = new Set(['token', 'fee', 'purse', 'fortune']);
const PAID_PLANT_KEYS = Object.freeze(['key', 'record', 'override', 'receipt']);
const PAID_PLANT_RECORD_KEYS = Object.freeze([
  'assertedBand', 'audienceId', 'liarId', 'lineageId',
  'seededTick', 'subjectId', 'trueBand',
]);
const PAID_PLANT_OVERRIDE_KEYS = Object.freeze([
  'readiness', 'strengthBand', 'allianceLabel', 'faithLabel',
  'confidence01', 'lastUpdateTick',
]);
const PAID_PLANT_RECEIPT_KEYS = Object.freeze([
  'marketId', 'marketName', 'hostId', 'patronId', 'intent',
  'assertedBand', 'trueBand', 'priceBand', 'commissionedAtTick',
]);
const PAID_PLANT_TARGET_KEYS = Object.freeze([
  'kind', 'errandId', 'npcId', 'pictureId', 'episodeKey', 'subjectId',
  'field', 'direction', 'commissionerId', 'purpose',
]);

/** @param {unknown} value @returns {string} */
function strictText(value) {
  return typeof value === 'string' && value.length > 0 && value.trim() === value ? value : '';
}

/** @param {Record<string, unknown>} row @param {readonly string[]} expected */
function exactKeys(row, expected) {
  const actual = Object.keys(row).sort();
  const wanted = [...expected].sort();
  return actual.length === wanted.length
    && actual.every((entry, index) => entry === wanted[index]);
}

/**
 * IN-0a — THE TRANSPORT WINDOW, and the ONE equality it replaces.
 *
 * A commission is PAID on the tick its act applies and SEEDED on the tick the writer folds
 * it. Those were the same tick only because nothing carried an envelope between pulses;
 * once `brokeragePlantHandoff` does (the applied receipt is readable one pulse later, and
 * not one instant sooner — the kernel mouths are banked, see that leaf's header), a real
 * commission is exactly one week older than the lie it becomes.
 *
 * So the validator's `commissionedAtTick === seededTick` equality becomes a BOUNDED,
 * NON-NEGATIVE lag of at most this many ticks. Nothing else about the boundary moves: the
 * FRESHNESS law is untouched and still the strongest guard here (`seededTick === now` —
 * a stale deposit cannot become state no matter what its receipt says), the lineage token
 * is still re-derived from `seededTick`, the override's `lastUpdateTick` must still equal
 * it, and an envelope claiming to have been paid for AFTER it was told is refused outright.
 *
 * [JUDGMENT J-IN0A-1, vetoable. The alternatives were both worse: re-stamping
 * `commissionedAtTick` forward would put a one-week falsehood inside a DM-truth receipt and
 * contradict the act's own news beat; relaxing the FRESHNESS clause instead (folding at the
 * original seed tick) would leave the belief override claiming to be a week older than the
 * write that lands it, AND would break `envoyInterceptionStage.prepareEnvoyPlantTargets`,
 * whose `seededTick === tick` guard a WAR lane owns and this slice must not edit. Say
 * "veto" to restore the strict equality and take the pendingPlants deposit (Q1's fallback)
 * instead.]
 * @type {number}
 */
export const PLANT_HANDOFF_LAG_TICKS = 1;

/** @param {unknown} value @returns {number | null} */
function paidPlantTick(value) {
  return Number.isInteger(value) && Number(value) >= 0 ? Number(value) : null;
}

/** @param {unknown} value @returns {number | null} */
function paidPlantBand(value) {
  return Number.isInteger(value) && Number(value) >= 0 && Number(value) <= 4
    ? Number(value) : null;
}

/** @param {unknown} value @returns {number | null} */
function paidPlantUnit(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1
    ? value : null;
}

/**
 * Validate the paid plant envelope at the sole belief/disinfo writer. The
 * commission producer is pure, so this boundary must reject forged aliases or
 * stale deposits rather than turning them into state.
 * @param {unknown} value @param {number} now
 */
export function commissionedPlantAt(value, now) {
  const row = asObject(value);
  const targeted = Object.prototype.hasOwnProperty.call(row, 'target');
  const expectedTopKeys = targeted ? [...PAID_PLANT_KEYS, 'target'] : PAID_PLANT_KEYS;
  if (!exactKeys(row, expectedTopKeys)) return null;
  const key = strictText(row.key);
  const record = asObject(row.record);
  const override = asObject(row.override);
  const receipt = asObject(row.receipt);
  const target = targeted ? asObject(row.target) : null;
  if (!exactKeys(record, PAID_PLANT_RECORD_KEYS)
    || !exactKeys(override, PAID_PLANT_OVERRIDE_KEYS)
    || !exactKeys(receipt, PAID_PLANT_RECEIPT_KEYS)
    || (targeted && !exactKeys(/** @type {Record<string, unknown>} */ (target), PAID_PLANT_TARGET_KEYS))
    || record === override || record === receipt || override === receipt
    || (targeted && (target === record || target === override || target === receipt))) return null;
  const liarId = strictText(record.liarId);
  const audienceId = strictText(record.audienceId);
  const subjectId = strictText(record.subjectId);
  const lineageId = strictText(record.lineageId);
  const hostId = strictText(receipt.hostId);
  const patronId = strictText(receipt.patronId);
  const intent = strictText(receipt.intent);
  const seededTick = paidPlantTick(record.seededTick);
  const commissionedAtTick = paidPlantTick(receipt.commissionedAtTick);
  const trueBand = paidPlantBand(record.trueBand);
  const assertedBand = paidPlantBand(record.assertedBand);
  const expectedAsserted = intent === 'inflate'
    ? Math.min(4, Number(trueBand) + LIE_TUNING.INFLATE_BANDS)
    : Math.max(0, Number(trueBand) - LIE_TUNING.INFLATE_BANDS);
  if (!key || !liarId || !audienceId || !subjectId || !lineageId || !hostId || !patronId
    || !['inflate', 'deflate'].includes(intent)
    || seededTick == null || commissionedAtTick == null || seededTick !== now
    || trueBand == null || assertedBand == null || assertedBand !== expectedAsserted
    || key !== `plant:${liarId}:${audienceId}:${subjectId}`
    || lineageId !== `disinfo:${liarId}:${audienceId}:${seededTick}`
    || hostId !== liarId
    || seededTick - commissionedAtTick < 0
    || seededTick - commissionedAtTick > PLANT_HANDOFF_LAG_TICKS
    || receipt.assertedBand !== assertedBand || receipt.trueBand !== trueBand
    || !strictText(receipt.marketId) || !strictText(receipt.marketName)
    || !PAID_PLANT_PRICE_BANDS.has(String(receipt.priceBand))
    || paidPlantBand(override.strengthBand) !== assertedBand
    || paidPlantTick(override.lastUpdateTick) !== seededTick
    || paidPlantUnit(override.readiness) == null || paidPlantUnit(override.confidence01) == null
    || !strictText(override.allianceLabel)
    || !(override.faithLabel == null || strictText(override.faithLabel))) return null;

  const exactTarget = targeted ? {
    kind: strictText(target.kind),
    errandId: strictText(target.errandId),
    npcId: strictText(target.npcId),
    pictureId: strictText(target.pictureId),
    episodeKey: strictText(target.episodeKey),
    subjectId: strictText(target.subjectId),
    field: strictText(target.field),
    direction: strictText(target.direction),
    commissionerId: strictText(target.commissionerId),
    purpose: strictText(target.purpose),
  } : null;
  if (exactTarget && (exactTarget.kind !== 'envoy_picture'
    || !exactTarget.errandId || !exactTarget.npcId || !exactTarget.pictureId
    || !exactTarget.episodeKey || exactTarget.subjectId !== subjectId
    || !ENVOY_PICTURE_PLANT_FIELDS.has(exactTarget.field)
    || !['rise', 'fall'].includes(exactTarget.direction)
    || exactTarget.commissionerId !== patronId
    || exactTarget.purpose !== 'intercepted_envoy_appraisal')) return null;

  const exactReceipt = { ...receipt };
  const commission = {
    receipt: exactReceipt,
    ...(exactTarget ? { target: { ...exactTarget } } : {}),
  };
  return {
    key,
    record: /** @type {DisinfoRecord} */ ({ ...record, commission }),
    override: /** @type {BeliefRecord} */ ({ ...override }),
    receipt: exactReceipt,
    target: exactTarget,
    patch: exactTarget ? {
      id: `envoy_picture_patch:${lineageId}`,
      kind: 'plant',
      sourceId: lineageId,
      lineageId,
      targetKind: 'envoy_picture',
      errandId: exactTarget.errandId,
      npcId: exactTarget.npcId,
      pictureId: exactTarget.pictureId,
      episodeKey: exactTarget.episodeKey,
      subjectId,
      field: exactTarget.field,
      direction: exactTarget.direction,
      tick: now,
    } : null,
  };
}
