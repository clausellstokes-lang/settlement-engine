/**
 * domain/display/neighbourMirror.js — FP IN-1b: THE STANDING LINE, the mirror's first
 * production consumer.
 *
 * ── WHAT IT ANSWERS, AND IN WHOSE VOICE ───────────────────────────────────────────
 *
 * One row per counterpart, saying what OUR OWN durable record shows we have put in front
 * of that court, and how old that record is. It is a court's bookkeeping of its own
 * disclosures, which is why it is properly player-facing: nothing here reports another
 * court's mind, and nothing here could, because the leaf it composes never receives a
 * world at all on the half that derives.
 *
 * LAW ONE IS A PROPERTY OF THE SENTENCE, NOT A COMMENT ON IT. Every word map below and
 * every composed line speaks the RECORD — "has been shown", "nothing has left our hand" —
 * and never a mind. The rendered-surface scan in tests/ui/neighbourMirrorLine.test.js
 * drives that against real rendered output rather than against this vocabulary, because a
 * vocabulary can only prove what it already contains.
 *
 * ── THE ABSENCE RULE IS WHAT MAKES THE DARK PATH FREE ──────────────────────────────
 *
 * The gate stands at the collector, one layer down, and is read there exactly once in the
 * whole tree. Dark, the collector hands back its frozen inert input BY IDENTITY and the
 * derivation hands back the frozen unknown BY IDENTITY — so an identity check here yields
 * an empty array without this module ever branching on, or even naming, the key. A
 * counterpart we have shown nothing produces NO ROW, never a row reading "unknown", and an
 * empty array renders no section at all. Absence of a surface is absence of a sentence.
 *
 * ⚠ `wealthShown` and `devotionShown` answer the head rung ALWAYS at this HEAD — there is
 * no substrate behind either. The sentence therefore speaks only to what we showed of our
 * STRENGTH, when we last showed it, and whether we have gone quiet since. Widening it
 * would be implying a record the ledgers do not hold.
 *
 * PRESENTATION ONLY. Pure; no store, no rng, no wall clock; INERT-NOT-CRASH on
 * absent/garbage ledgers; every list codepoint-sorted or total-ordered. Strict-clean;
 * zero any-casts.
 */

import { compareCodepoint } from '../deterministicSort.js';
import { informationReceipt } from '../worldPulse/informationNews.js';
import { MIRROR_UNKNOWN, mirrorInputsAt, secondOrderMirrorOf } from '../worldPulse/secondOrderBelief.js';

/**
 * The governed kind this read-model voices. IN-1c-a moved the sentence's SOURCE out of this
 * file and into the INFORMATION corpus; the row it names files no Herald desk, because this
 * line renders into the town page under the heading above and reaches no feed.
 */
const STANDING_LINE_KIND = 'mirror_standing_line';

/** The section's own title. British spelling throughout, matching the mount file. */
export const NEIGHBOUR_MIRROR_HEADING = 'What the neighbours have been shown';

/**
 * The strength ladder in player words. One phrase per rung of the leaf's closed ladder,
 * so a rung added there fails loudly here instead of rendering a raw token.
 * @type {Readonly<Record<string, string>>}
 */
export const MIRROR_BAND_WORDS = Object.freeze({
  unknown: 'nothing we can account for',
  spent: 'a spent hand',
  strained: 'a strained hand',
  ready: 'a ready hand',
  strong: 'a strong hand',
  dominant: 'a commanding hand',
});

/**
 * The staleness ladder in player words, over the estate's one half-life vocabulary.
 * @type {Readonly<Record<string, string>>}
 */
export const MIRROR_STALENESS_WORDS = Object.freeze({
  unknown: 'on no date our record holds',
  a_season: 'within the season',
  a_year: 'within the year',
  a_few_years: 'some years back',
  a_decade: 'a decade back',
  a_generation: 'a generation back',
});

/**
 * The deriving acts in DM words — the expansion behind the line. One phrase per basis
 * token the derivation can emit; an unmapped token is dropped rather than rendered raw.
 * @type {Readonly<Record<string, string>>}
 */
export const MIRROR_BASIS_WORDS = Object.freeze({
  'intercept:caught': 'an errand of ours they took off the road',
  'plant:strengthBand': 'a story we seeded in their court',
  'posture:sealed': 'a silence we have kept',
  'record:independent': 'our own record of their dealings',
  'share:allianceLabel': 'a standing we declared as allies',
  'transfer:partial': 'a handover that was less than the whole truth',
  'transfer:strengthBand': 'intelligence we handed over',
});

/**
 * @typedef {object} NeighbourMirrorLine
 * @property {string} counterpartId the campaign settlement id, never a generator name
 * @property {string} counterpartName the display name, falling back to the id
 * @property {string} line the standing sentence, in record voice
 * @property {string} band the strength rung, carried for styling and never rendered raw
 * @property {string} staleness the age rung, carried and never rendered raw
 * @property {readonly string[] | null} basis DM ONLY — the deriving acts, else null
 * @property {number | null} lastShownTick DM ONLY — the newest durable act, else null
 */

/** @type {readonly NeighbourMirrorLine[]} */
const NO_LINES = Object.freeze([]);

/** @param {unknown} value @returns {string} */
function text(value) { return typeof value === 'string' ? value : ''; }

/** @param {unknown} value @returns {number | null} */
function finite(value) { return typeof value === 'number' && Number.isFinite(value) ? value : null; }

/**
 * A rung's phrase, falling back to the head rung rather than leaking a raw token.
 * @param {Readonly<Record<string, string>>} words @param {string} rung @returns {string}
 */
function wordOf(words, rung) {
  return Object.prototype.hasOwnProperty.call(words, rung) ? words[rung] : words.unknown;
}

/**
 * The deriving acts as phrases, in the leaf's own already-sorted token order.
 * @param {unknown} basis @returns {readonly string[]}
 */
function basisPhrases(basis) {
  /** @type {string[]} */
  const phrases = [];
  for (const raw of Array.isArray(basis) ? basis : []) {
    const token = text(raw);
    if (Object.prototype.hasOwnProperty.call(MIRROR_BASIS_WORDS, token)) phrases.push(MIRROR_BASIS_WORDS[token]);
  }
  return Object.freeze(phrases);
}

/**
 * The sentence itself: who was shown what, how long ago, and whether we have gone quiet.
 *
 * ── IN-1c-a: THE SOURCE MOVED, THE SENTENCE'S JOB DID NOT ──────────────────────────
 *
 * Through IN-1b this was ONE composed template, rendered on every town page in every campaign
 * forever. It now draws from the governed INFORMATION corpus — nine authored variants, picked
 * deterministically and stably per counterpart — which is the act CR-IN1B-1 deferred to IN-1c
 * by name. The corpus is the authority; this function is the join.
 *
 * ⛔ THE FALLBACK IS TOTAL, AND IT IS THE LANDED SENTENCE RATHER THAN A BLANK. A pool that
 * resolved to nothing must never render an empty dossier line: a line with one voice is worse
 * than nine, and a line with NO voice is a defect. The composed template below is kept whole
 * as that answer, which is also why both word maps stay live in production.
 *
 * ⚠ THE STANDING-SILENCE CLAUSE IS THIS FILE'S, NOT THE CORPUS'S. The annex authors nine
 * STANDING sentences and authors no silence clause; a court's kept quiet is a second fact we
 * already hold, so it is appended here exactly as it was before. Folding it into the pool
 * would be an annex act and is not this wave's.
 *
 * @param {string} counterpartName @param {string} band @param {string} staleness
 * @param {boolean} sealed @param {string} seed the campaign-stable pick key
 * @returns {string}
 */
function standingSentence(counterpartName, band, staleness, sealed, seed) {
  const shown = wordOf(MIRROR_BAND_WORDS, band);
  // ⛔ `{season}` IS NOT SUPPLIED (CR-IN1C-2): this layer holds a tick and no calendar, and
  // both roads to one cost more than this wave. Two authored variants name a season and are
  // declared unreachable rather than quietly dropped from the corpus.
  const receipt = informationReceipt(STANDING_LINE_KIND, seed, { band: shown, counterpart: counterpartName });
  const composed = receipt
    ? receipt.line
    : `${counterpartName} has been shown ${shown}, ${wordOf(MIRROR_STALENESS_WORDS, staleness)}.`;
  return composed + (sealed ? ' Nothing has left our hand since.' : '');
}

/**
 * ONE ROW PER COUNTERPART WE HAVE ACTUALLY SHOWN SOMETHING. Total on garbage: a null or
 * malformed world, a missing settlement id, a non-array counterpart list, a non-finite
 * tick and a missing namer each answer the empty array without throwing.
 *
 * @param {object} [args]
 * @param {unknown} [args.worldState] the owning campaign's world
 * @param {unknown} [args.settlementId] our own campaign settlement id
 * @param {unknown} [args.counterpartIds] the campaign's other settlement ids
 * @param {unknown} [args.tick] the campaign clock
 * @param {(id: string) => string} [args.nameFor] id → display name
 * @param {unknown} [args.includeGroundTruth] DM seam; false (fail closed) omits basis and date
 * @returns {readonly NeighbourMirrorLine[]}
 */
export function neighbourMirrorLines({
  worldState, settlementId, counterpartIds, tick, nameFor, includeGroundTruth = false,
} = {}) {
  const selfId = text(settlementId);
  const now = finite(tick);
  if (!selfId || now === null || !Array.isArray(counterpartIds) || typeof nameFor !== 'function') return NO_LINES;

  const dm = includeGroundTruth === true;
  /** @type {NeighbourMirrorLine[]} */
  const rows = [];
  const seen = new Set();
  for (const raw of counterpartIds) {
    const counterpartId = text(raw);
    if (!counterpartId || counterpartId === selfId || seen.has(counterpartId)) continue;
    seen.add(counterpartId);
    // THE ABSENCE RULE, BY IDENTITY — and the only reason this layer needs no gate.
    const mirror = secondOrderMirrorOf(mirrorInputsAt(worldState, selfId, counterpartId, now));
    if (mirror === MIRROR_UNKNOWN) continue;
    const band = text(mirror.strengthShown);
    const staleness = text(mirror.staleness);
    const counterpartName = text(nameFor(counterpartId)) || counterpartId;
    rows.push(Object.freeze({
      band,
      basis: dm ? basisPhrases(mirror.basis) : null,
      counterpartId,
      counterpartName,
      lastShownTick: dm ? finite(mirror.lastShownTick) : null,
      // ⛔⛔ THE SEED READS THE MIRROR'S DATE, NEVER THE ROW'S. The row nulls `lastShownTick`
      // for a player viewer, so seeding off it would hand the DM and the player DIFFERENT
      // variants of the same sentence. The seam moves the EXPANSION and never the line. No
      // rng, no clock read, no store read: ids and a durable date the record already holds.
      line: standingSentence(counterpartName, band, staleness, mirror.sealed === true,
        `${selfId}:${counterpartId}:${finite(mirror.lastShownTick) ?? 'none'}`),
      staleness,
    }));
  }
  rows.sort((a, b) => compareCodepoint(a.counterpartId, b.counterpartId));
  return Object.freeze(rows);
}
