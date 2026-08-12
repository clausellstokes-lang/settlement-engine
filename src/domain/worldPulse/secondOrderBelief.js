/**
 * secondOrderBelief.js — FP IN-1a: THE MIRROR ("what does our own durable record say that
 * court has been shown of us?").
 *
 * ── IT COMPOSES SP-B'S LEAF AND RE-DERIVES NOT ONE LINE OF IT ──────────────────────
 *
 * `outboundImpression.js` already holds the strength/label heuristic over our outbound
 * acts, and its own header names this wave as the one consumer it was built for. This
 * file supplies the four things that leaf deliberately does not: the ROW ADAPTATION from
 * the live ledgers, the BANDING onto a closed ladder, the STALENESS clock, and the
 * CONFIDENCE that degrades. A second derivation here would be the fourteenth instance of
 * the second-spelling drift SP-B's header counts.
 *
 * ── THE K3 FENCE IS STRUCTURAL, NOT A SCAN ────────────────────────────────────────
 *
 * Law One forbids reading a counterpart's own record to answer what they hold of us.
 * The legal read and the forbidden one are THE SAME FUNCTION WITH ITS ARGUMENTS SWAPPED
 * — `beliefRecord(ws, US, THEM)` against `beliefRecord(ws, THEM, US)` — so no import
 * list can tell them apart. The cure is structural and it is free:
 * `secondOrderMirrorOf` NEVER RECEIVES `worldState`. It takes rows the collector already
 * read. A function with no world cannot reach a partition, by construction, forever.
 *
 * ── DURABLE FAMILIES ONLY (CR-IN1-7) ──────────────────────────────────────────────
 *
 * The design asserted every input was "already ledgered, already decaying". Measured
 * against the tree, that is false for three families, so the clock rests only on what
 * actually persists:
 *   - PLANTS (`seededTick`) and our HIDE posture (`enteredTick`) carry `lastShownTick`.
 *   - INTEL TRANSFERS are LIVE BUT MEMORYLESS: the ledger prunes every prior-tick row,
 *     so a transfer can say what we showed them THIS tick and can never age.
 *   - ALLY SHARES have no persisted source at all, so the share channel is always empty.
 *   - Our exposure receipts are one-shot news with a sidecar drained the next tick, so
 *     that degradation leg is DEFERRED rather than silently half-built.
 * Each of those is a recorded deferral carrying its measurement, not an oversight.
 *
 * ⚠ Confidence degrading on our own record of THEIR acts is CORRECT BEHAVIOUR even when
 * that record is wrong: a court that has been fed a lie should be less sure of its
 * mirror, not more. It is not a defect to repair.
 *
 * PURE: no state, no writer, no RNG, no clock, no mutation of any argument. Zero
 * production callers at this HEAD, so the dark path is byte-identical BY CONSTRUCTION.
 */
import { HALF_LIFE_BANDS, halfLifeWeeksOf } from './bandedStock.js';
import { beliefRecord } from './beliefMap.js';
import { outboundImpressionOf } from './outboundImpression.js';

/**
 * THE MIRROR LADDER, ascending, with an `unknown` head. The spellings are COPIED from
 * the negotiation pictures' private strength ladder rather than invented, so a reader
 * meeting a mirror and a picture in one session learns one set of words. It is copied
 * and not imported because that module sits in another layer.
 * @type {readonly string[]}
 */
export const MIRROR_BANDS = Object.freeze(['unknown', 'spent', 'strained', 'ready', 'strong', 'dominant']);

/**
 * THE STALENESS LADDER, DERIVED rather than authored — this wave mints no tuning. The
 * rungs ARE the estate's one half-life vocabulary, so a mirror ages on exactly the clock
 * every other decaying stock ages on, and a rung added there is carried here for free.
 * @type {readonly string[]}
 */
export const MIRROR_STALENESS_BANDS = Object.freeze(['unknown', ...HALF_LIFE_BANDS]);

/**
 * Words the mirror may never speak, because the record cannot see a mind. The mirror
 * reports what WE SHOWED, never what they hold — the distinction Law One rests on.
 * @type {readonly string[]}
 */
export const MIRROR_PERCEPTION_BANNED = Object.freeze(['believe', 'believes', 'thinks', 'perceive', 'in their eyes']);

/** The frozen zero-confidence answer. Absence is a result, never a fabricated middle. */
export const MIRROR_UNKNOWN = Object.freeze({
  basis: Object.freeze([]),
  confidence: MIRROR_BANDS[0],
  devotionShown: MIRROR_BANDS[0],
  lastShownTick: null,
  sealed: false,
  staleness: MIRROR_STALENESS_BANDS[0],
  strengthShown: MIRROR_BANDS[0],
  wealthShown: MIRROR_BANDS[0],
});

/** @param {unknown} v @returns {Record<string, unknown>} */
function asRecord(v) { return v && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, unknown>} */ (v) : {}; }

/** @param {unknown} v @returns {unknown[]} */
function asArray(v) { return Array.isArray(v) ? v : []; }

/**
 * A ledger reads as an array or as a keyed object; both answer the same question.
 * @param {unknown} v @returns {unknown[]}
 */
function ledgerRows(v) { return Array.isArray(v) ? v : Object.values(asRecord(v)); }

/** @param {unknown} v @returns {string} */
function text(v) { return typeof v === 'string' ? v : ''; }

/** @param {unknown} v @returns {number | null} */
function finite(v) { return typeof v === 'number' && Number.isFinite(v) ? v : null; }

/** The collector's inert answer: shaped exactly like a real one, carrying nothing. */
const EMPTY_INPUT = Object.freeze({
  evidence: Object.freeze([]),
  observerId: '',
  plants: Object.freeze([]),
  sealed: false,
  sealedTick: null,
  selfId: '',
  shares: Object.freeze([]),
  tick: 0,
  transfers: Object.freeze([]),
});

/**
 * THE ONE GATE, read BY NAME with the strict identity idiom and read EXACTLY ONCE in the
 * tree. A frozen-list `.every()` would attribute to no key and hide a fully wired flag
 * from the engine-gated-key census; two doors on one flag is how a deleted guard hides
 * behind a surviving one.
 * @param {unknown} worldState
 * @returns {boolean}
 */
export function secondOrderBeliefActive(worldState) {
  return asRecord(asRecord(worldState).simulationRules).secondOrderBeliefEnabled === true;
}

/**
 * The staleness rung: the FASTEST half-life the age still fits inside. Every argument
 * handed to the weeks accessor is a frozen ladder member, so the accessor's throw — which
 * is deliberate and correct for a coding error — can never be reached from here.
 * @param {number} now @param {number | null} lastShownTick @returns {string}
 */
function stalenessBandOf(now, lastShownTick) {
  if (lastShownTick == null) return MIRROR_STALENESS_BANDS[0];
  const age = Math.max(0, now - lastShownTick);
  for (const band of HALF_LIFE_BANDS) {
    if (age <= halfLifeWeeksOf(band)) return band;
  }
  return HALF_LIFE_BANDS[HALF_LIFE_BANDS.length - 1];
}

/**
 * THE COLLECTOR — the only half that sees a world, and the only half that may.
 *
 * ⚠ THE ADAPTER IS A NAMED CONTRACT, NOT AN INLINE SHRUG. SP-B's typedefs are
 * CALLER-SHAPED and mismatch the live intel row on three spellings; the rename lives
 * here, in one place, and never in SP's file.
 *
 * @param {unknown} worldState @param {string} selfId @param {string} observerId @param {number} tick
 */
export function mirrorInputsAt(worldState, selfId, observerId, tick) {
  const self = text(selfId);
  const observer = text(observerId);
  if (!secondOrderBeliefActive(worldState) || !self || !observer || self === observer) return EMPTY_INPUT;

  const world = asRecord(worldState);
  const ledgers = asRecord(world.spatialLedgers);

  const plants = ledgerRows(ledgers.disinfo).map(asRecord)
    .filter((row) => text(row.subjectId) === self && text(row.audienceId) === observer)
    .map((row) => Object.freeze({
      assertedBand: finite(row.assertedBand),
      audienceId: text(row.audienceId),
      seededTick: finite(row.seededTick),
      subjectId: text(row.subjectId),
    }));

  // THE THREE RENAMES: the receiver becomes the addressee, the handed-over snapshot's
  // own strength rung becomes the flat field SP-B reads, and the deposit becomes the tick.
  //
  // ⛔ LIVE BUT MEMORYLESS, AND THE MIRROR HOLDS THAT ITSELF. The handover ledger drops
  // every prior-tick row on the tick after it lands, so it is a hand-off surface and not a
  // durable outbound record. The same cut is applied HERE rather than inherited, because a
  // property that is only true because another module tidies up is a property that breaks
  // silently the first time the tidying is reordered.
  const now = finite(tick) ?? 0;
  const transfers = ledgerRows(ledgers.intelTransfers).map(asRecord)
    .filter((row) => text(row.sellerId) === self && text(row.receiverId) === observer)
    .filter((row) => (finite(row.depositTick) ?? -1) >= now)
    .map((row) => Object.freeze({
      fidelity01: finite(row.fidelity01) ?? 1,
      strengthBand: finite(asRecord(row.belief).strengthBand),
      subjectId: text(row.subjectId),
      tick: finite(row.depositTick),
      toId: text(row.receiverId),
    }));

  // ⚠ PER SETTLEMENT, NOT PER COUNTERPART. The ledger holds one posture for a town, so
  // the seal is a fact about our whole silence and the record says so in those words
  // rather than implying a granularity the ledger does not hold.
  const posture = asRecord(asRecord(ledgers.secrecyPostures)[self]);
  const level01 = finite(posture.level01);
  const sealed = level01 != null && level01 > 0;

  /** @type {string[]} */
  const evidence = [];
  // LEG (b) — OUR errand, taken by THEM. ⚠ The direction is silent if it is wrong: the
  // errand's origin is us, the encounter's interceptor is them. Reversing the pair reads
  // as a clean mirror forever.
  for (const errand of ledgerRows(world.envoyErrands).map(asRecord)) {
    if (text(errand.from) !== self) continue;
    if (!asArray(errand.encounters).map(asRecord).some((row) => text(row.interceptorId) === observer)) continue;
    evidence.push('intercept:caught');
    break;
  }
  // LEG (c) — OUR OWN record of THEIR acts. This is the call the argument-order scan
  // exists for: our id stands in the observer slot, and the swap would be undetectable
  // to any import list.
  const heard = beliefRecord(world, self, observer);
  if (heard && finite(asRecord(heard).lastUpdateTick) != null) evidence.push('record:independent');

  return Object.freeze({
    evidence: Object.freeze(evidence.sort()),
    observerId: observer,
    plants: Object.freeze(plants),
    sealed,
    sealedTick: sealed ? finite(posture.enteredTick) : null,
    selfId: self,
    shares: Object.freeze([]),
    tick: now,
    transfers: Object.freeze(transfers),
  });
}

/**
 * THE DERIVATION. It never receives `worldState` — that is the fence, and it is the
 * whole design rather than a comment on it. Total on garbage: every malformed input
 * answers the frozen unknown and nothing throws.
 * @param {unknown} input @returns {Readonly<Record<string, unknown>>}
 */
export function secondOrderMirrorOf(input) {
  const arg = asRecord(input);
  const self = text(arg.selfId);
  const observer = text(arg.observerId);
  if (!self || !observer || self === observer) return MIRROR_UNKNOWN;

  const plants = asArray(arg.plants).map(asRecord);
  const sealed = arg.sealed === true;
  const impression = outboundImpressionOf({
    observerId: observer,
    plants,
    sealed,
    selfId: self,
    shares: /** @type {import('./outboundImpression.js').OutboundShare[]} */ (asArray(arg.shares)),
    transfers: /** @type {import('./outboundImpression.js').OutboundTransfer[]} */ (asArray(arg.transfers)),
  });
  // NOTHING SHOWN, NOTHING KNOWN — never a fabricated band.
  if (!impression) return MIRROR_UNKNOWN;

  const basis = new Set(asArray(impression.basis).map(text).filter(Boolean));

  /** @type {number[]} */
  const durableTicks = [];
  for (const row of plants) {
    const seeded = finite(row.seededTick);
    if (seeded != null) durableTicks.push(seeded);
  }
  const sealedTick = finite(arg.sealedTick);
  if (sealed && sealedTick != null) {
    durableTicks.push(sealedTick);
    basis.add('posture:sealed');
  }
  const lastShownTick = durableTicks.length ? Math.max(...durableTicks) : null;

  // CONFIDENCE IS EVIDENCE BREADTH, THEN DEGRADED — and both halves are counted against
  // the ladder's own length, so this wave authors no number at all.
  const evidence = new Set(asArray(arg.evidence).map(text).filter(Boolean));
  const breadth = Math.min(basis.size, MIRROR_BANDS.length - 1);
  const confidence = MIRROR_BANDS[Math.max(0, breadth - evidence.size)];
  for (const token of evidence) basis.add(token);

  const rawBand = finite(impression.strengthBand);
  const strengthShown = rawBand == null
    ? MIRROR_BANDS[0]
    : MIRROR_BANDS[Math.min(Math.max(Math.round(rawBand), 0), MIRROR_BANDS.length - 2) + 1];

  return Object.freeze({
    basis: Object.freeze([...basis].sort()),
    confidence,
    // ⛔ NO SUBSTRATE AT THIS HEAD. SP-B's heuristic derives strength and a label and
    // nothing else, so these two answer the head rung always. They are MINTED NOW
    // because widening a frozen cross-program shape later is the expensive act.
    devotionShown: MIRROR_BANDS[0],
    lastShownTick,
    sealed,
    staleness: stalenessBandOf(finite(arg.tick) ?? 0, lastShownTick),
    strengthShown,
    wealthShown: MIRROR_BANDS[0],
  });
}
