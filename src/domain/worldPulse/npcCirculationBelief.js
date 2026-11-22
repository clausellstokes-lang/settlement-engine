/**
 * domain/worldPulse/npcCirculationBelief.js — W-H3: REPUTATION AS BELIEF.
 *
 * (design DESIGN_NPC_CONSEQUENCES.md §6b, the epistemology unification; law 4 FINITE
 * SEMANTICS, law 5 DORMANCY.)
 *
 * THE LEDGER RECORDS TRUTH. What a settlement BELIEVES about a roamer is DERIVED, here,
 * from the information layer: distance-priced decay from the origin, complicated by
 * infoMode. Admission and rejection run against the LOCAL BELIEF and never against the
 * global truth, so a wanderer can outrun their story on a long road and be preceded by
 * it on a short one. That gap is a designed mechanic, not an artifact: a person travels
 * at road speed while their story travels at news speed.
 *
 * ── THE ENGINEERING GUARD, WHICH IS THE WHOLE REASON THIS IS A LEAF ─────────
 * Beliefs are derived ON DEMAND and NEVER stored per pair. A stored belief would be an
 * S x roamers table: quadratic state, a fresh save-shape contract, and a second thing
 * that can drift from the truth it summarizes. This module therefore exports READS ONLY.
 * There is no setter, no ledger key, and nothing here takes a worldState to write to,
 * which makes "never stored" a structural property of the file rather than a discipline
 * somebody has to keep.
 *
 * ── THE DECAY IS A RE-USE, NOT A SECOND MODEL ──────────────────────────────
 * The distance price is distancePricedNews.hopDelayTicks, which is already the ONE
 * source of truth shared by the belief engine (beliefMap) and the rumour display
 * (settlementRumors). A second distance-to-staleness curve for people would drift from
 * the one for facts, and the drift would show up as a settlement that knows a grain
 * price from three hundred miles away but not a banishment from next door.
 *
 * ── WHY THE FADED READING IS THE NEUTRAL FACET SET, EXACTLY ────────────────
 * When the story has faded past its last band, this returns the shared frozen
 * NEUTRAL_REPUTATION_FACETS reference: a settlement that never heard anything believes
 * precisely what it believes about a stranger, which IS the neutral set. Returning the
 * same reference rather than an equal-looking copy keeps the belief read comparable by
 * identity and makes "this town has formed no read" a one-token check downstream.
 *
 * ── OMNISCIENT IS IDENTITY, AND THAT IS THE DORMANCY PROPERTY ──────────────
 * Under infoMode 'omniscient' (the default, and the mode the goldens run in) the
 * believed reputation IS the truth, returned unchanged. So this whole lane is inert in
 * every campaign that has not opted into a live information layer, on top of being inert
 * in every campaign that has not lit npcConsequencesEnabled.
 *
 * PURE + LAZY: no Date, no Math.random, no store, no React, no I/O, no mutation, and
 * ZERO rng draws (the unreliable-mode reading is a hash, for the same stream-safety
 * reason H1's mint and H2's verdict roll are hashes).
 *
 * @enforced-by tests/domain/npcCirculationBelief.test.js
 */

import { hopDelayTicks } from './distancePricedNews.js';
import { infoModeOf } from './simulationRules.js';
import { activeSpatialDigest } from '../spatial/distanceRead.js';
import {
  NOTORIETY_BANDS,
  NEUTRAL_REPUTATION_FACETS,
  normalizeReputationFacets,
  notorietyRank,
} from './npcLedgerFacets.js';
import { NPC_CONSEQUENCES_TUNING } from './npcConsequencesTuning.js';

/** The seeded-fork label for the unreliable-mode reading (design §11's namespace). */
export const BELIEF_FORK_LABEL = 'npcfate:belief';

/** The composite-key delimiter, named for the same reason H1 and H2 name theirs. */
const KEY_DELIM = '|';

/**
 * FNV-1a 32-bit. The estate's one hash idiom, carried locally so this leaf keeps a
 * narrow import posture (same constants as kernel/proseHash.js and its siblings).
 * @param {string} s @returns {number} unsigned 32-bit
 */
function fnv1a32(s) {
  let h = 0x811c9dc5;
  const str = String(s);
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** @param {unknown} v @returns {string} */
function text(v) {
  return String(v == null ? '' : v);
}

/** @param {unknown} v @returns {number} a non-negative integer */
function ticksOf(v) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

/**
 * The unreliable-mode reading for one (settlement, roamer, elapsed) triple, as a
 * deterministic hash rather than a draw. TRUE means the rumour GREW in the telling
 * (the story outran its own decay by one band); FALSE means it died on the road.
 *
 * `elapsed` is in the key on purpose: an unreliable world is one where the same story
 * is told differently at different times, so a reading frozen for all time would be
 * 'perfect_delayed' with extra steps.
 *
 * @param {{ observerId: string, roamerId: string, elapsedTicks: number }} args
 * @returns {boolean}
 */
export function rumourReinforcesAt({ observerId, roamerId, elapsedTicks }) {
  const key = [BELIEF_FORK_LABEL, text(observerId), text(roamerId), String(ticksOf(elapsedTicks))].join(KEY_DELIM);
  return fnv1a32(key) / 0x100000000 < NPC_CONSEQUENCES_TUNING.BELIEF_REINFORCE_SHARE;
}

/**
 * @typedef {Object} BeliefReceipt
 * @property {string} infoMode         the effective information mode
 * @property {number} hopDelayTicks    the distance price, in ticks
 * @property {number} elapsedTicks     how long ago the truth was recorded
 * @property {number} fadeSteps        notoriety bands the story lost on the way here
 * @property {boolean} reinforced      the unreliable reading grew the story
 * @property {boolean} arrived         the story is still legible here at all
 */

/**
 * HOW MANY BANDS THE STORY LOSES getting here. Time fades it; distance fades it
 * further; an unreliable telling moves it one band either way.
 *
 * Monotone non-decreasing in BOTH elapsed time and hop delay, which is the property
 * the "long road versus short road" pin measures: a farther observer can never believe
 * MORE than a nearer one at equal time, and a later observer can never believe more
 * than an earlier one at equal distance.
 *
 * @param {Object} args
 * @param {string} args.infoMode
 * @param {number} args.hopDelayTicks
 * @param {number} args.elapsedTicks
 * @param {string} args.observerId
 * @param {string} args.roamerId
 * @returns {{ fadeSteps: number, reinforced: boolean }}
 */
export function beliefFadeSteps({ infoMode, hopDelayTicks: delay, elapsedTicks, observerId, roamerId }) {
  const time = Math.floor(ticksOf(elapsedTicks) / NPC_CONSEQUENCES_TUNING.BELIEF_FADE_TICKS);
  const distance = Math.floor(ticksOf(delay) / NPC_CONSEQUENCES_TUNING.BELIEF_DISTANCE_FADE_TICKS);
  const base = time + distance;
  if (infoMode !== 'unreliable') return { fadeSteps: base, reinforced: false };
  const reinforced = rumourReinforcesAt({ observerId, roamerId, elapsedTicks });
  // REINFORCE pulls the story back toward its origin volume, but never past it: an
  // unreliable world grows a tale in the telling, it does not invent a louder verdict
  // than the court actually handed down.
  return { fadeSteps: Math.max(0, reinforced ? base - 1 : base + 1), reinforced };
}

/**
 * WHAT ONE SETTLEMENT BELIEVES ABOUT ONE ROAMER (design §6b).
 *
 * Returns a TOTAL, closed ReputationFacets set plus a receipt naming why. Derived, never
 * stored. Under 'omniscient' the belief is the truth, unchanged and normalized, which is
 * the identity case every existing campaign runs in.
 *
 * @param {Object} args
 * @param {{ simulationRules?: unknown, spatialCanonVersion?: number, spatialDigest?: unknown } | null | undefined} args.worldState
 * @param {string} args.originId        where the truth happened
 * @param {string} args.observerId      the settlement forming the belief
 * @param {string} args.roamerId        the durable id the belief is about
 * @param {unknown} args.truth          the ledger's ReputationFacets
 * @param {number} args.elapsedTicks    ticks since the truth was recorded
 * @returns {{ believed: import('./npcLedgerFacets.js').ReputationFacets, receipt: BeliefReceipt }}
 */
export function believedReputation({ worldState, originId, observerId, roamerId, truth, elapsedTicks }) {
  const facts = normalizeReputationFacets(truth);
  const rules = worldState && typeof worldState === 'object'
    ? /** @type {Record<string, unknown>} */ (worldState).simulationRules
    : null;
  const infoMode = infoModeOf(/** @type {Record<string, unknown>|null} */ (
    rules && typeof rules === 'object' ? /** @type {Record<string, unknown>} */ (rules) : null
  ));
  const elapsed = ticksOf(elapsedTicks);

  if (infoMode === 'omniscient') {
    return {
      believed: facts,
      receipt: {
        infoMode, hopDelayTicks: 0, elapsedTicks: elapsed, fadeSteps: 0, reinforced: false, arrived: true,
      },
    };
  }

  const digest = activeSpatialDigest(/** @type {Parameters<typeof activeSpatialDigest>[0]} */ (worldState));
  const delay = hopDelayTicks(
    /** @type {Parameters<typeof hopDelayTicks>[0]} */ (digest),
    text(originId),
    text(observerId),
  );
  const { fadeSteps, reinforced } = beliefFadeSteps({
    infoMode, hopDelayTicks: delay, elapsedTicks: elapsed, observerId, roamerId,
  });

  const rank = notorietyRank(facts.notorietyBand) - fadeSteps;
  // THE STORY IS GONE. Not "quieter": gone. A settlement that never heard anything
  // believes about this person exactly what it believes about a stranger, which is the
  // neutral facet set, and every downstream check must see a stranger rather than a
  // half-remembered scandal. The alignment and competence reads travel WITH the story,
  // so they go with it.
  if (rank <= 0) {
    return {
      believed: NEUTRAL_REPUTATION_FACETS,
      receipt: { infoMode, hopDelayTicks: delay, elapsedTicks: elapsed, fadeSteps, reinforced, arrived: false },
    };
  }
  const band = NOTORIETY_BANDS[Math.min(NOTORIETY_BANDS.length - 1, rank)];
  return {
    believed: normalizeReputationFacets({ ...facts, notorietyBand: band }),
    receipt: { infoMode, hopDelayTicks: delay, elapsedTicks: elapsed, fadeSteps, reinforced, arrived: true },
  };
}
