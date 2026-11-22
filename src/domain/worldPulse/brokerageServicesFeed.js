/**
 * domain/worldPulse/brokerageServicesFeed.js — [W-I INFORMATION BROKERAGES] I3, THE
 * STANDING PATRON CONTRACT (docs/DESIGN_INFORMATION_BROKERAGES.md §6 FEED, §7, and the
 * owner's original spine: "the brokerage feeds its patron power").
 *
 * SHARE-SELL, INSTITUTIONALIZED. The statecraft module already lets one court hand another
 * court a read and charges it for lying. The FEED is that act made STANDING: a guild-form
 * house delivers to the power that keeps it, every pulse, forever, without anybody
 * deciding to.
 *
 * ── WHAT THE FEED ACTUALLY DOES, AND WHY IT IS CALIBRATION AND NOT OMNISCIENCE ──
 *
 * It pulls the patron's own belief slot a FRACTION of the way toward the truth, on the
 * axes its house is competent in, and raises its confidence no further than that pull
 * justifies. Three properties fall out, and all three are pinned:
 *
 *   1. IT IS CHANNEL-SCOPED. A house feeds only what it will VOUCH for, at I2's own vouch
 *      floor, so the same competence table that decides what the Herald stamp will say
 *      decides what the patron gets told. A Whisper market keeps a court sharp on armies
 *      and courts and leaves it as ignorant about the temples as it ever was, because a
 *      covert house has no seat in any congregation. The design's risk register calls the
 *      patron feed a possible intel superweapon; channel scope is the answer.
 *   2. IT IS A FRACTION, NEVER AN ASSIGNMENT. The pull closes part of the gap and the part
 *      is bounded by the house's competence against Law 1's ceiling, so no arrangement of
 *      houses converges a belief onto the truth in one pulse and none converges it fully
 *      at all while the subject stays far away.
 *   3. IT CANNOT MAKE A POWER OVER-CONFIDENT. Confidence rises to the pull and no further,
 *      which is what CALIBRATION means: the patron ends up as sure as it is right. A feed
 *      that raised confidence past accuracy would be manufacturing exactly the
 *      miscalibration Law 2 forbids.
 *
 * ── WHERE IT WRITES, AND WHY THERE IS NO NEW KEY ──
 *
 * The patron's belief lives in the belief ledger already: `beliefMaps[host][slot]`, where
 * slot is the patron archetype's carrier partition when it has one (merchant, military,
 * criminal, religious) and the governing seat when it does not, because a government
 * patron IS the seat. So the feed writes into a container the belief engine already owns
 * and already persists, and this slice adds no worldState key of its own. It runs as a
 * post-pass inside `advanceBeliefMaps` for the same reason I2's fidelity term composes
 * there: that function already holds the snapshot index, the neighbourhood and the ground
 * truth, and the pulse kernel is at its frozen size ceiling.
 *
 * DORMANCY IS BY OBJECT IDENTITY, the I2 anchor: with the layer dark `applyPatronFeeds`
 * returns the CALLER'S OWN maps object, so a dark advance hands the belief engine the
 * identical reference it held before this module existed.
 *
 * PURE, TOTAL, ZERO-DRAW: no rng, no clock, no mutation of its inputs, no tier read.
 */

import { clamp, clamp01 } from '../../kernel/math.js';
import { INFORMATION_BROKERAGE_TUNING } from '../../data/informationBrokerageTuning.js';
import {
  BROKERAGE_STAMP_TUNING,
  brokerageEffectsActive,
  houseChannelCompetence,
} from './brokerageStamps.js';
import { CHANNEL_BELIEF_AXES, servicesAvailable } from './brokerageServices.js';
import { brokeragePatronBindings } from './brokeragePatronage.js';

/**
 * THE PATRON SLOT MAP. Which belief slot a patron of each archetype actually reads. The
 * four carrier-fed archetypes have their own partition in the belief ledger (beliefMap's
 * FACTION_CARRIER_FRAMING); every other power reads the governing seat, because a
 * government, noble or civic patron sits IN the council rather than beside it.
 *
 * A LOCAL COPY, on the settlementRumors precedent and for the same reason the header
 * gives: importing beliefMap.js here would close a cycle through the belief advance that
 * calls this module. tests/domain/brokerageServices.test.js pins this map equal to the
 * canonical FACTION_CARRIER_FRAMING key set, so a carrier added upstream reds here.
 * @type {readonly string[]}
 */
export const CARRIER_FED_ARCHETYPES = Object.freeze(['criminal', 'merchant', 'military', 'religious']);

/** The governing seat slot key (beliefMap.GOVERNING_SEAT_KEY, local copy per above). */
export const PATRON_SEAT_SLOT = 'seat';

/**
 * The belief slot a patron of this archetype is fed through. TOTAL: an unknown archetype
 * reads the seat, which is the conservative direction (the council hears it, no private
 * partition is invented).
 * @param {unknown} archetype @returns {string}
 */
export function patronFeedSlot(archetype) {
  const key = typeof archetype === 'string' ? archetype : '';
  return CARRIER_FED_ARCHETYPES.includes(key) ? key : PATRON_SEAT_SLOT;
}

/**
 * THE FEED TUNING (PROPOSED, soak-vetoable in the I1 band idiom). The STRUCTURE is what
 * the pins lock: bounded strictly below a full assignment, rising with competence, and
 * confidence that never outruns accuracy.
 */
export const PATRON_FEED_TUNING = Object.freeze({
  /** The largest share of the belief-to-truth gap one pulse of feed may close. Strictly
   *  below 1 so a standing contract converges and never snaps. */
  MAX_PULL01: 0.6,
  /** Below this pull a categorical axis (an alliance label, an observance) is not
   *  rewritten at all: a half-heard correction is not a correction, and flipping a label
   *  on a weak feed would be a fact the house never actually had. */
  LABEL_ADOPT_FLOOR: 0.35,
  /** Strength bands are integers 0..4 (beliefMap.strengthBandOf's range). */
  MAX_STRENGTH_BAND: 4,
});

/** The numeric axes, which are pulled continuously. @type {readonly string[]} */
const NUMERIC_AXES = Object.freeze(['strengthBand', 'readiness']);

/** @param {unknown} v @returns {Record<string, unknown>} */
function asObject(v) {
  return v != null && typeof v === 'object' && !Array.isArray(v)
    ? /** @type {Record<string, unknown>} */ (v) : {};
}

/** @param {unknown} v @param {number} fallback @returns {number} */
function num(v, fallback) {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

/** Codepoint order. @param {string} a @param {string} b @returns {number} */
function compareCodepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Four decimal places, the belief ledger's own rounding. @param {number} v @returns {number} */
function round4(v) {
  return Math.round(v * 10000) / 10000;
}

/**
 * The pull one house's competence buys in one channel: its competence measured against
 * Law 1's ceiling, scaled by the maximum share. 0 below the vouch floor, which is the
 * channel scope the header describes and the "and not others" half of the pin.
 * @param {number} competence01 @returns {number}
 */
export function feedPull01(competence01) {
  const competence = clamp01(num(competence01, 0));
  if (competence < BROKERAGE_STAMP_TUNING.CHANNEL_VOUCH_FLOOR) return 0;
  const ratio = clamp01(competence / INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING);
  return clamp01(ratio * PATRON_FEED_TUNING.MAX_PULL01);
}

/**
 * @typedef {Object} FeedEdge
 * @property {string} hostId          the settlement the house stands in
 * @property {string} institutionId   the house
 * @property {string} patronId        the power it feeds
 * @property {string} patronArchetype
 * @property {string} slot            the belief slot the feed lands in
 * @property {boolean} covert         the feed of an illegal house is DM truth until exposed
 * @property {Readonly<Record<string, number>>} pullByChannel  the channels it actually feeds
 */

/**
 * THE FEED EDGES of one settlement: every standing MAJOR house, the power it serves, and
 * the pull it delivers per channel. This is also the ESPIONAGE-TARGET SURFACE the design
 * asks for (§6): a feed is a visible edge between a house and a power, so it is a thing a
 * rival can name, watch and take. `pullByChannel` carries ONLY the channels the house
 * actually feeds (the drop-when-empty idiom), so an absent channel is absent rather than a
 * zero, and a house that feeds nothing yields no edge at all.
 *
 * @param {Object} args
 * @param {unknown} args.worldState
 * @param {unknown} args.item the snapshot item
 * @returns {readonly FeedEdge[]}
 */
export function patronFeedEdges({ worldState, item }) {
  const bindings = brokeragePatronBindings({ worldState, item });
  /** @type {FeedEdge[]} */
  const edges = [];
  for (const binding of bindings) {
    if (!servicesAvailable(binding.legality, binding.form, 'war').includes('info_feed')) continue;
    /** @type {Record<string, number>} */
    const pullByChannel = {};
    for (const channel of Object.keys(CHANNEL_BELIEF_AXES).sort(compareCodepoint)) {
      const axes = /** @type {Record<string, readonly string[]>} */ (CHANNEL_BELIEF_AXES)[channel];
      if (!axes.length) continue; // a channel the belief ledger cannot carry is not fed
      const pull = feedPull01(houseChannelCompetence(
        [{ legality: binding.legality, form: binding.form }], channel,
      ));
      if (pull > 0) pullByChannel[channel] = pull;
    }
    if (!Object.keys(pullByChannel).length) continue;
    edges.push({
      hostId: String(asObject(item).id),
      institutionId: binding.institutionId,
      patronId: binding.patronId,
      patronArchetype: binding.patronArchetype,
      slot: patronFeedSlot(binding.patronArchetype),
      covert: binding.covert,
      pullByChannel: Object.freeze(pullByChannel),
    });
  }
  return Object.freeze(edges);
}

/**
 * The per-axis pull an edge delivers, folded across its channels (best wins: a court fed
 * on armies by two houses is fed by the better one, not by their sum).
 * @param {FeedEdge} edge @returns {Readonly<Record<string, number>>}
 */
export function feedAxisPulls(edge) {
  /** @type {Record<string, number>} */
  const byAxis = {};
  for (const [channel, pull] of Object.entries(asObject(edge?.pullByChannel))) {
    const axes = /** @type {Record<string, readonly string[]>} */ (CHANNEL_BELIEF_AXES)[channel] || [];
    for (const axis of axes) {
      const value = num(pull, 0);
      if (value > (byAxis[axis] || 0)) byAxis[axis] = value;
    }
  }
  return Object.freeze(byAxis);
}

/**
 * Calibrate ONE belief record toward one truth record on the given axes. Returns the prior
 * record BY REFERENCE when nothing moved, so an unchanged slot cannot make the belief
 * engine think it mutated.
 *
 * @param {Record<string, unknown>|null|undefined} prior
 * @param {Record<string, unknown>|null|undefined} truth
 * @param {Readonly<Record<string, number>>} pullByAxis
 * @param {number} now
 * @returns {Record<string, unknown>|null}
 */
export function calibrateBelief(prior, truth, pullByAxis, now) {
  const before = asObject(prior);
  const target = asObject(truth);
  if (!Object.keys(before).length || !Object.keys(target).length) return prior || null;
  /** @type {Record<string, unknown>} */
  const after = { ...before };
  let moved = false;
  let bestPull = 0;
  for (const axis of Object.keys(asObject(pullByAxis)).sort(compareCodepoint)) {
    const pull = clamp01(num(/** @type {Record<string, number>} */ (pullByAxis)[axis], 0));
    if (pull <= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(target, axis)) continue;
    if (pull > bestPull) bestPull = pull;
    if (NUMERIC_AXES.includes(axis)) {
      const from = num(before[axis], NaN);
      const to = num(target[axis], NaN);
      if (!Number.isFinite(from) || !Number.isFinite(to)) continue;
      const pulled = from + (to - from) * pull;
      const next = axis === 'strengthBand'
        ? clamp(Math.round(pulled), 0, PATRON_FEED_TUNING.MAX_STRENGTH_BAND)
        : round4(clamp01(pulled));
      if (next !== before[axis]) { after[axis] = next; moved = true; }
      continue;
    }
    if (pull < PATRON_FEED_TUNING.LABEL_ADOPT_FLOOR) continue;
    if (target[axis] !== before[axis]) { after[axis] = target[axis]; moved = true; }
  }
  if (bestPull > 0) {
    // CALIBRATION, not confidence inflation: the patron ends as sure as the feed makes it
    // right, and never surer. Bounded by Law 1's ceiling like every other reading here.
    const ceiling = INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING;
    const confidence = round4(clamp01(Math.min(
      Math.max(clamp01(num(before.confidence01, 0)), bestPull), ceiling,
    )));
    if (confidence !== before.confidence01) { after.confidence01 = confidence; moved = true; }
  }
  if (!moved) return prior || null;
  after.lastUpdateTick = Math.max(0, Math.floor(num(now, 0)));
  return after;
}

/**
 * THE FEED PASS. Apply every standing patron feed to the just-built belief maps.
 *
 * Returns `maps` BY REFERENCE when the layer is dark or nothing moved, which is the
 * dormancy anchor: the belief engine's own object, unchanged, by identity.
 *
 * @param {Object} args
 * @param {Record<string, unknown>} args.maps the just-built belief maps
 * @param {unknown} args.worldState
 * @param {Map<string, unknown>|null|undefined} args.byId the snapshot index
 * @param {(observerId: string, subjectId: string) => (Record<string, unknown>|null)} args.truthFor
 *   the ground-truth belief record for a pair, supplied by the belief engine (which owns
 *   that derivation); a pair it cannot answer for is simply not fed.
 * @param {number} args.now
 * @returns {Record<string, unknown>}
 */
export function applyPatronFeeds({ maps, worldState, byId, truthFor, now }) {
  if (!brokerageEffectsActive(worldState)) return maps;
  const index = byId instanceof Map ? byId : new Map();
  if (!index.size) return maps;
  /** @type {Record<string, unknown>|null} */
  let out = null;
  for (const observerId of Object.keys(asObject(maps)).sort(compareCodepoint)) {
    const item = index.get(observerId);
    if (!item) continue;
    const edges = patronFeedEdges({ worldState, item });
    if (!edges.length) continue;
    const observer = asObject(asObject(maps)[observerId]);
    /** @type {Record<string, unknown>} */
    let nextObserver = observer;
    for (const edge of edges) {
      const pullByAxis = feedAxisPulls(edge);
      if (!Object.keys(pullByAxis).length) continue;
      const slot = asObject(nextObserver[edge.slot]);
      if (!Object.keys(slot).length) continue; // no partition to feed: the contract has no ear
      /** @type {Record<string, unknown>} */
      const nextSlot = {};
      let slotMoved = false;
      for (const subjectId of Object.keys(slot).sort(compareCodepoint)) {
        const prior = asObject(slot[subjectId]);
        const calibrated = calibrateBelief(prior, truthFor(observerId, subjectId), pullByAxis, now);
        nextSlot[subjectId] = calibrated || prior;
        if (calibrated && calibrated !== prior) slotMoved = true;
      }
      if (!slotMoved) continue;
      /** @type {Record<string, unknown>} */
      const rebuilt = {};
      for (const key of Object.keys(nextObserver).sort(compareCodepoint)) {
        rebuilt[key] = key === edge.slot ? nextSlot : nextObserver[key];
      }
      nextObserver = rebuilt;
    }
    if (nextObserver === observer) continue;
    if (!out) out = { ...asObject(maps) };
    out[observerId] = nextObserver;
  }
  return out || maps;
}
