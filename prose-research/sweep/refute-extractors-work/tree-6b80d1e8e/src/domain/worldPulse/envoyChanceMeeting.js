/**
 * envoyChanceMeeting.js — ENC-1. THE CHANCE-MEETING LEAF.
 *
 * A named person away from home (a diplomatic envoy on the errand spine, or a covert
 * operative wearing a diplomatic face) may, ONCE PER STOP, meet a named notable of the
 * place he stands in, or another named traveller from a third court standing in the same
 * place. This leaf is the pure half of that: the candidate census, the one-meeting-per-
 * person select, and the resolution over two charts, two courts and the posture between
 * them. It returns a typed receipt; the writers who already own each ledger apply it on
 * their own ticks, and none of those writers is here.
 *
 * ⛔ PURE. No world state, no clock, no store, no PRNG, no mutation. Every draw is a
 * KEYED HASH over a stable key (`hash01`, the estate's cured root) and never a fork off
 * the pulse confluence, so no later stream moves: THE PROMISE's own requirement, and the
 * reason the envoy family draws no PRNG at all.
 *
 * ⛔ STATE, NEVER FATE. Nothing this leaf can return kills, marries off, replaces or
 * concludes a person. The widest outcome it names is `compromised`, and a compromise is a
 * LEASH the corruption web already mints, never a defection: the owner's word, and the
 * three fences that make it true by construction are ENC-2's, not this file's.
 *
 * ── WHAT THIS FILE DELIBERATELY DOES NOT DO ─────────────────────────────────────
 *
 * It writes nothing, reads no `worldState`, and names no persisted key: the two deposit
 * ledgers, the ladder's mark mint, the web's willed pin, the funnel entry and the Herald
 * line are ENC-2, ENC-3 and ENC-4, and every one of them sits behind an OWNER ROW that is
 * unruled at this commit. It also has NO IMPORTER under `src/`: the stage that calls it is
 * ENC-3. That is the car order (data before consumers), not an oversight.
 *
 * ── THE SIX DRAW SYMBOLS, AND WHY THEY ARE SIX RATHER THAN ONE HELPER ───────────
 *
 * `tests/lint/chooserTotality.walker.test.js` discovers a weighted decision fork by the
 * `hash01(` signature and attributes it to the NEAREST PRECEDING TOP-LEVEL DECLARATION,
 * then asserts that no symbol carries two dispositions. Six arms with six different honest
 * dispositions therefore need six symbols: routing them through one `eighth()` helper would
 * collapse six questions into one row and launder four deferrals into whatever the helper
 * was filed as. The duplication is the instrument's price and it is paid on purpose.
 *
 * ── THE ONE KEY LAW ─────────────────────────────────────────────────────────────
 *
 * EVERY arm, `pick` included, draws from `${seed}|chance-meeting:${meetingKey}:${arm}`
 * with the seed threaded in by the caller. A seed-less key would make two campaigns that
 * happen to share an errand episode meet the same way, and errand ids are deterministic
 * from the offer, so the exemption the first draft granted the resident pick was the exact
 * defect the law refuses.
 *
 * ── FINITE SEMANTICS ────────────────────────────────────────────────────────────
 *
 * Every chance is an integer number of EIGHTHS (0..8) and every roll is an integer 0..7
 * compared `roll < rung`. Every distance is an integer RUNG count over `positionValue`,
 * banded into three words. A receipt carries words and integers only: no float reaches
 * one, and the only numbers on it are drawn eighths, rung counts and the tick.
 *
 * ⛔ EVERY VALUE IN `CHANCE_MEETING_TUNING` IS A DRAFT AND UNSIGNED. Tuning is the owner's
 * and it is LAST (§12 row 7). Nothing here is taste this leaf claims.
 *
 * ── EVERY CHARACTER READ ARRIVES AS AN ARGUMENT ─────────────────────────────────
 *
 * ⛔ THIS LEAF HOLDS NO OPINION ABOUT THE DRIFT MACHINERY. The (pole, level) → signed
 * rung read is W-LIVES car L2's `positionValue`, and it reaches every function here as
 * an ARGUMENT rather than as an import — the shape W-OPS car O5's depth-priced drift
 * leaf already ships for L2's floor and clamp, whose header states the law: "every
 * constant of theirs … arrives here as an ARGUMENT, so a second opinion about any of
 * them is structurally unavailable rather than merely discouraged."
 *
 * ⚠ THAT LEAF IS NOT NAMED BY FILE HERE, AND THE OMISSION IS ITS OWN FINDING. Its
 * darkness walker scans src for its basename on RAW text, so a comment CITING it is read
 * as an import — the estate's settled citation law (comments and strings are citations,
 * never dependencies) not yet applied to that one scan. Naming the car rather than the
 * path keeps the address without convicting this file for explaining itself.
 *
 * Two other readings were live and both are refused. IMPORTING the drift module makes
 * this leaf a SECOND production door onto a family whose one door is enumerated by name
 * (`tests/domain/npc/characterDrift.test.js`, step 1), and reaching it through that door
 * instead would put a pure leaf's whole world-state substrate behind an eight-line
 * arithmetic. RESTATING those eight lines here is the fork O5's own driver pins shut in
 * as many words — "the leaf declares no floor, no clamp and no decay band of its own".
 * So the read is handed in, and a caller that hands none reads every position as making
 * no claim, which is exactly what an unreadable position already reads as: this file's
 * declared totality, not a new silence.
 *
 * ⚠ AND THE KNOWN CHART ARRIVES THE SAME WAY, as `knownAxes`. A party used to carry a
 * whole KnownReading and this file dug the axes out of its authored-core key — a
 * hand-spelled read of the one key in the estate whose readers are enumerated by file
 * AND by count. The caller holds the reading; it hands down the axes that reading
 * disclosed, and this leaf never names the key at all.
 *
 * @enforced-by tests/domain/envoyChanceMeeting.test.js
 */
import { hash01 } from '../region/contestMath.js';
import { axisPositionForWord, traitColumns, wordForAxisPosition } from '../npc/paradigmAxisCatalog.js';

// ── THE CLOSED VOCABULARIES ───────────────────────────────────────────────────
// Leaf-local, finite and UNPERSISTED. Four of them are words this design mints
// (`DISTANCE_BANDS`, `POSTURE_BANDS`, `LEAN_BANDS` and `MEETING_REFUSALS`), which is
// recorded at §12 row 15: the law is "typed bands, existing where one exists", not
// "typed bands from existing vocabularies". The persisted words a deposit row would
// carry are the ladder's and the funnel's own, and they ride OWNER ROWS 1, 2 and 3.

/** The two shapes a chance meeting can take. @type {readonly string[]} */
export const MEETING_KINDS = Object.freeze(['traveller_resident', 'traveller_traveller']);

/**
 * The venue words, taken BY VALUE from two members of `ENVOY_ENCOUNTER_VENUE_KINDS`
 * without importing either of its two homes: a meeting persists no encounter row, so the
 * twin law that binds the census and the DTO does not reach here, and importing either
 * home would put this leaf inside a pin it has no business moving.
 * @type {readonly string[]}
 */
export const MEETING_VENUES = Object.freeze(['host_settlement', 'field_node']);

/** Every outcome the resolution can name. @type {readonly string[]} */
export const MEETING_OUTCOMES = Object.freeze([
  'nothing', 'bond', 'respect', 'rivalry', 'compromised', 'rejected', 'exposed',
]);

/** How alike two people read, in three words. @type {readonly string[]} */
export const DISTANCE_BANDS = Object.freeze(['alike', 'differing', 'opposed']);

/**
 * The two courts' edge, BANDED. ⚠ This is a banding OF the estate's `relationshipType`,
 * never a rename of the posture vocabulary `relationshipMemory.js` speaks: that family is
 * a different grain (`strained_trade`, `protective_alliance`, `escalating_rivalry`) and
 * nothing here may be mistaken for it.
 * @type {readonly string[]}
 */
export const POSTURE_BANDS = Object.freeze(['friendly', 'neutral', 'hostile']);

/** The mark kinds a receipt can name. OWNER ROWS 2 and 3 are RULED: `respect` is a bond kind
 *  and `rivalry` a grudge kind on the ladder. The stage grains a mark by its kind, so a
 *  `rivalry` is deposited under `grudge` and folded by nobody yet; it is no longer coerced
 *  into a friendship, which is what the old refusal text claimed to prevent and did not.
 *  @type {readonly string[]} */
export const MEETING_MARK_KINDS = Object.freeze(['friendship', 'gratitude', 'loyalty', 'respect', 'rivalry']);

/** The two quanta a meeting can teach, the funnel's own words. @type {readonly string[]} */
export const MEETING_DRIFT_BANDS = Object.freeze(['faint', 'firm']);

/** The lean channel's two rungs before the web mints anything. @type {readonly string[]} */
export const LEAN_BANDS = Object.freeze(['leaning', 'won_over']);

/** The approach die's two words. @type {readonly string[]} */
export const APPROACH_WORDS = Object.freeze(['not_made', 'made']);

/**
 * THE CLOSED REFUSAL VOCABULARY. A refused arm is a RECEIPTED refusal, never a silent
 * drop, on the funnel's own law: "nothing happened" and "nothing COULD happen here" are
 * different facts. ⚠ These words live HERE and never in `FUNNEL_REFUSALS`, which is a
 * closed chartered W-LIVES vocabulary this train has no business widening.
 * @type {readonly string[]}
 */
export const MEETING_REFUSALS = Object.freeze([
  'no_home_record',
  'vocabulary_unruled',
  'drift_dormant',
  'web_dark',
  'weave_dark',
  'ladder_dark',
  'ineligible_target',
  'already_taught_this_season',
]);

/** The six named draw arms, in resolution order. @type {readonly string[]} */
export const MEETING_ARMS = Object.freeze([
  'meet', 'pick', 'approach', 'mark', 'compromise', 'exposure',
]);

/**
 * THE TUNING REGISTER — every row a DRAFT, `signedBy: null`, on the `FUNNEL_TUNING` idiom.
 * ⛔ OWNER ROW §12 row 7. Nothing here is signed, and this lane signs nothing: the values
 * are the design's recommendations carried verbatim so the lit arm can measure numbers
 * that were written down before the instrument ran.
 * @type {Readonly<Record<string, unknown>>}
 */
export const CHANCE_MEETING_TUNING_PROVENANCE = Object.freeze({
  status: 'CANDIDATE, OWNER-UNSIGNED (§12 row 7; enrolled in TUNEREG at its landing)',
  signedBy: null,
  ownerRows: Object.freeze([
    'the three base rungs 3 / 4 / 2 and the plus-or-minus-one modifiers',
    'the approach die: base 2, plus 2 at an at-odds target, plus 1 covert',
    'the compromise caps 6 and 4, the fast path 7, the arithmetic floor 2',
    'the mark ladder per distance band and the never-below-two-eighths nothing floor',
    'the exposure rungs: base 2, covert 2, wariness capped at 2, hostile 1',
    'the lesson cadence (one season recommended; one year puts every axis strictly inside the clamp)',
    'the lean TTL of one year, and the leash lapse ticks ENC-2 owes',
    'the die itself: eight faces, and the alignment no-signal point of one half',
    'the exposure grievance magnitude, which lives with its writer in ENC-3',
  ]),
});

/**
 * THE VALUES THEMSELVES, every leaf a number so every leaf can carry a unit. The tuning
 * walker holds units ALL-OR-NONE per table and a status word has no honest unit, so the
 * provenance above is its own export rather than three unlabelled keys inside this one.
 *
 * ⚠ THERE IS NO `@type` TAG HERE AND THERE MAY NOT BE ONE. A widening annotation —
 * `Readonly<Record<string, unknown>>` was the first draft's — erases every leaf's number,
 * which erases `EIGHTHS`, which makes the die `unknown` at THIRTEEN arithmetic and
 * argument sites in this file. The inferred frozen-literal type is both the honest type
 * and the house idiom: thirty-two of the thirty-five `*_TUNING` tables under `src/` carry
 * no annotation at all. If a later hand wants a name for this shape, that name must be a
 * typedef that keeps the leaves numbers, never a `Record` of `unknown`.
 */
export const CHANCE_MEETING_TUNING = Object.freeze({
  /** the die's face count: every chance is an integer number of these */
  eighths: 8,
  /** the alignment axes' no-signal point, the estate's own 0.5 */
  courtNeutralPoint: 0.5,
  /** base rung of 8 per venue and kind */
  baseRung: Object.freeze({
    traveller_resident: Object.freeze({ host_settlement: 3, field_node: 0 }),
    traveller_traveller: Object.freeze({ host_settlement: 4, field_node: 2 }),
  }),
  posturePlus: Object.freeze({ friendly: 1, neutral: 0, hostile: -1 }),
  covertMeetStep: -1,
  approachBaseRung: 2,
  approachAtOddsRung: 4,
  approachAtOddsStep: 2,
  approachCovertStep: 1,
  compromiseFloor: 2,
  compromiseCapCorruptible: 6,
  compromiseCapPlain: 4,
  compromiseFastPath: 7,
  markLadder: Object.freeze({
    alike: Object.freeze({ bond: 4, respect: 0, rivalry: 1 }),
    differing: Object.freeze({ bond: 2, respect: 2, rivalry: 2 }),
    opposed: Object.freeze({ bond: 0, respect: 2, rivalry: 3 }),
  }),
  markPostureStep: 1,
  markRefusedRivalryStep: 1,
  nothingFloor: 2,
  exposureBaseRung: 2,
  exposureCovertStep: 2,
  exposureWarinessCap: 2,
  exposureHostileStep: 1,
  distanceEdges: Object.freeze({ alike: 3, differing: 8 }),
  driftAxisCap: 3,
  driftFirmGap: 4,
  /** one season, the funnel's own cadence (`INTERVAL_WEEKS.one_season`), RECOMMENDED not signed */
  lessonCadenceTicks: 13,
  /** one year; the lean channel's TTL, enforced by ENC-2's ledger leaf */
  leanTtlTicks: 52,
});

/** The die. Every chance is an integer number of these; the face count is a REGISTERED
 *  dial rather than a loose constant, because a die with a different number of faces is a
 *  different mechanism and the owner should see it named. */
export const EIGHTHS = CHANCE_MEETING_TUNING.eighths;


// ── TOTAL READERS ─────────────────────────────────────────────────────────────

/** @param {unknown} value @returns {Record<string, unknown>} */
function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {};
}

/** @param {unknown} value @returns {unknown[]} */
function asArray(value) {
  return Array.isArray(value) ? value : [];
}

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/** @param {unknown} value @returns {number} */
function num(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/** @param {unknown} value @returns {number|null} */
function wholeTick(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : null;
}

/** @param {string} a @param {string} b @returns {number} */
function codepoint(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** @param {number} value @param {number} low @param {number} high @returns {number} */
function clampInt(value, low, high) {
  return Math.max(low, Math.min(high, Math.round(num(value))));
}

/** Length-prefixed join, the envoy census's own id idiom: no separator can be forged.
 *  @param {unknown[]} parts @returns {string} */
function stableParts(parts) {
  return parts.map((value) => {
    const part = String(value);
    return `${part.length}:${part}`;
  }).join('|');
}

// ── THE KEY LAW ───────────────────────────────────────────────────────────────

/**
 * THE ONE KEY EVERY ARM DRAWS FROM. The seed is threaded in by the caller (the stage
 * reads it through `tickStreamSeedOf`, which is how the ladder keys its own contests and
 * what carries the advance-epoch suffix onto this stream with every other).
 * @param {unknown} seed @param {unknown} meetingKey @param {unknown} arm @returns {string}
 */
export function meetingRollKey(seed, meetingKey, arm) {
  return `${text(seed)}|chance-meeting:${text(meetingKey)}:${text(arm)}`;
}

/** The stable key of a traveller meeting a resident: one per stop, not one per tick.
 *  @param {{errandId?: unknown, journey?: unknown, nodeId?: unknown}} row @returns {string} */
export function residentMeetingKey(row) {
  const it = asObject(row);
  return stableParts([text(it.errandId), text(it.journey), text(it.nodeId)]);
}

/** The stable key of two travellers meeting, codepoint-ordered so either order keys alike.
 *  @param {{a?: unknown, b?: unknown, nodeId?: unknown}} row @returns {string} */
export function pairMeetingKey(row) {
  const it = asObject(row);
  const a = asObject(it.a);
  const b = asObject(it.b);
  const one = stableParts([text(a.errandId), text(a.journey)]);
  const two = stableParts([text(b.errandId), text(b.journey)]);
  const ordered = codepoint(one, two) <= 0 ? [one, two] : [two, one];
  return stableParts([...ordered, text(it.nodeId)]);
}

// ── THE SIX DRAWS ─────────────────────────────────────────────────────────────
// One symbol per arm, one honest disposition per symbol. See the header.

/** Whether two co-located people notice each other at all. @param {string} seed
 *  @param {string} meetingKey @returns {number} an integer 0..7 */
function drawMeet(seed, meetingKey) {
  return Math.floor(hash01(meetingRollKey(seed, meetingKey, 'meet')) * EIGHTHS);
}

/** Which of the eligible residents the traveller happens upon. @param {string} seed
 *  @param {string} meetingKey @returns {number} an integer 0..7 */
function drawPick(seed, meetingKey) {
  return Math.floor(hash01(meetingRollKey(seed, meetingKey, 'pick')) * EIGHTHS);
}

/** Whether an offer is made at all. @param {string} seed
 *  @param {string} meetingKey @returns {number} an integer 0..7 */
function drawApproach(seed, meetingKey) {
  return Math.floor(hash01(meetingRollKey(seed, meetingKey, 'approach')) * EIGHTHS);
}

/** Which mark, if any, the meeting leaves. @param {string} seed
 *  @param {string} meetingKey @returns {number} an integer 0..7 */
function drawMark(seed, meetingKey) {
  return Math.floor(hash01(meetingRollKey(seed, meetingKey, 'mark')) * EIGHTHS);
}

/** The target's own will, against the offer. @param {string} seed
 *  @param {string} meetingKey @returns {number} an integer 0..7 */
function drawCompromise(seed, meetingKey) {
  return Math.floor(hash01(meetingRollKey(seed, meetingKey, 'compromise')) * EIGHTHS);
}

/** Whether a refusal is spoken of. @param {string} seed
 *  @param {string} meetingKey @returns {number} an integer 0..7 */
function drawExposure(seed, meetingKey) {
  return Math.floor(hash01(meetingRollKey(seed, meetingKey, 'exposure')) * EIGHTHS);
}

// ── THE CHARTS ────────────────────────────────────────────────────────────────

/**
 * The LEGACY CORE: a flat personality word list read as leveled axis positions. On every
 * generated world `npc.character` is absent, so this IS the authored chart, and the word
 * plane is the production read the design names.
 * @param {unknown} words
 * @returns {Record<string, {axisId: string, pole: string, level: string, word: string}>}
 */
export function legacyCoreAxes(words) {
  /** @type {Record<string, {axisId: string, pole: string, level: string, word: string}>} */
  const out = {};
  for (const raw of asArray(words)) {
    const position = axisPositionForWord(raw);
    if (!position) continue;
    const axisId = text(position.axisId);
    if (!axisId || out[axisId]) continue;
    out[axisId] = {
      axisId,
      pole: text(position.pole),
      level: text(position.level),
      word: text(position.word),
    };
  }
  return out;
}

/**
 * Axis positions as signed rungs, −3..3, zero where the chart makes no claim.
 *
 * `positionValue` is L2's spectrum read, HANDED IN — see the header. It is the only
 * thing this file needs from the drift family and it is never imported here.
 * @param {unknown} axes
 * @param {((position: {pole?: 'virtue'|'vice', level?: string}) => number)} [positionValue]
 * @returns {Record<string, number>}
 */
export function axisRungs(axes, positionValue) {
  /** @type {Record<string, number>} */
  const out = {};
  // A caller that handed no spectrum read gets no rungs: a chart nobody can value makes
  // no claim, which is the same answer an unreadable position has always produced.
  if (typeof positionValue !== 'function') return out;
  for (const [axisId, position] of Object.entries(asObject(axes))) {
    const value = num(positionValue(/** @type {{pole?: 'virtue'|'vice', level?: string}} */ (position)));
    if (value !== 0) out[axisId] = value;
  }
  return out;
}

/**
 * The conduct plane of a chart, projected through the catalog's own word columns. For an
 * undrifted, undisclosed person this reproduces `npcTraitPlane`'s numbers exactly, because
 * `axisPositionForWord` carries the source word and `wordForAxisPosition` returns it
 * losslessly. That equality is the leaf's control, and it is asserted rather than claimed.
 * @param {unknown} axes @returns {{e: number, c: number}}
 */
export function planeFromAxes(axes) {
  return planeFromChart(axes, []);
}

/**
 * ⭐ THE WHOLE CHART's plane, and the reason it takes the WORDS as well as the axes.
 * Not every legacy personality word has an axis home: `ambitious` carries a real plane lean
 * and lives in no axis, so an axis-only projection silently drops it and reads a schemer as
 * plane-neutral. The design's "equivalently `npcTraitPlane` walked by disclosed axes" is
 * therefore true only for the axis-homed half, and this function is what makes the whole
 * sentence true: axis-homed words read through their (possibly disclosed) axis position,
 * and the homeless ones read through their own columns, which is exactly what the true
 * plane does with them.
 * @param {unknown} axes @param {unknown} words @returns {{e: number, c: number}}
 */
export function planeFromChart(axes, words) {
  let e = 0;
  let c = 0;
  /** @param {unknown} word */
  const add = (word) => {
    const columns = typeof word === 'string' ? traitColumns(word) : null;
    const lean = columns ? columns.plane : null;
    if (!lean) return;
    e += num(lean.e);
    c += num(lean.c);
  };
  for (const [axisId, position] of Object.entries(asObject(axes))) {
    const at = asObject(position);
    // `pole` is asserted, not coerced, and the assertion is the same one `axisRungs` makes
    // twenty lines up. `AxisPole` is `'virtue'|'vice'` and it is COMPLETE — the string here
    // is not a typo and the union is not short a member. What widens it is `text()`, which
    // is total on `unknown` by design and cannot carry a literal type back out. Narrowing
    // this at runtime instead (`=== 'vice' ? 'vice' : 'virtue'`) would MOVE THE OUTPUT: a
    // chart whose pole is absent or garbage reads '' today and `wordForAxisPosition`
    // returns null for it, and a coercion would hand that person a virtue word he does not
    // have. The assertion states what the catalog already guarantees for real positions and
    // leaves the garbage path byte-identical.
    add(wordForAxisPosition({
      axisId,
      pole: /** @type {'virtue'|'vice'} */ (text(at.pole)),
      level: text(at.level),
      word: text(at.word),
    }));
  }
  for (const raw of asArray(words)) {
    // A word the axes already speak for is not counted twice.
    if (axisPositionForWord(raw)) continue;
    add(text(raw));
  }
  return { e: Math.max(-1, Math.min(1, e)), c: Math.max(-1, Math.min(1, c)) };
}

/**
 * How different two charts read, as an integer rung sum over the union of the axes either
 * one speaks of, banded in three words. Two people who share no axis read two rungs apart
 * on each, which is the honest reading of strangers with nothing in common.
 * @param {unknown} axesA @param {unknown} axesB
 * @param {((position: {pole?: 'virtue'|'vice', level?: string}) => number)} [positionValue]
 *   L2's spectrum read, HANDED IN — see the header
 * @returns {{rungs: number, band: string}}
 */
export function pairDistance(axesA, axesB, positionValue) {
  const one = axisRungs(axesA, positionValue);
  const two = axisRungs(axesB, positionValue);
  const ids = [...new Set([...Object.keys(one), ...Object.keys(two)])];
  let rungs = 0;
  for (const axisId of ids) rungs += Math.abs(num(one[axisId]) - num(two[axisId]));
  const edges = asObject(CHANCE_MEETING_TUNING.distanceEdges);
  const band = rungs <= num(edges.alike)
    ? DISTANCE_BANDS[0]
    : rungs <= num(edges.differing) ? DISTANCE_BANDS[1] : DISTANCE_BANDS[2];
  return { rungs, band };
}

/**
 * How far a person stands from a court's own character, as a rung 0..8. A person whose
 * plane matches his town reads 0; the good magistrate of an evil town reads high. A court
 * with no signal reads 0.5 on both axes, which is no signal rather than a middle claim.
 * @param {unknown} plane @param {unknown} court @returns {number}
 */
export function personCourtRung(plane, court) {
  const p = asObject(plane);
  const c = asObject(court);
  const neutral = num(CHANCE_MEETING_TUNING.courtNeutralPoint);
  const malice = (num(c.malice01) - neutral) * 2;
  const lawless = (neutral - num(c.lawfulness01)) * 2;
  const spread = Math.abs(num(p.e) - malice) + Math.abs(num(p.c) - lawless);
  return clampInt(Math.min(EIGHTHS, Math.floor(Math.round(4 * spread) / 2)), 0, EIGHTHS);
}

// ── THE CENSUS ────────────────────────────────────────────────────────────────

/** @param {unknown} raw @param {number} tick @returns {Record<string, unknown>|null} */
function normalizeTraveller(raw, tick) {
  const row = asObject(raw);
  const errandId = text(row.errandId);
  const nid = text(row.nid || row.npcId);
  const homeSid = text(row.homeSid);
  const nodeId = text(row.nodeId);
  const journey = text(row.journey);
  const arrivalTick = wholeTick(row.arrivalTick);
  const nodeKind = text(row.nodeKind) === 'settlement' ? 'settlement' : 'route_node';
  if (!errandId || !nid || !homeSid || !nodeId || !journey) return null;
  if (text(row.band) !== 'arrived') return null;
  if (arrivalTick === null || arrivalTick > tick) return null;
  if (nodeId === homeSid) return null;
  return {
    errandId, nid, homeSid, nodeId, journey, arrivalTick, nodeKind, covert: row.covert === true,
  };
}

/** @param {unknown} raw @returns {Record<string, unknown>|null} */
function normalizeResident(raw) {
  const row = asObject(raw);
  const residentNid = text(row.residentNid);
  if (!residentNid) return null;
  return { residentNid, index: num(row.index), npc: row.npc ?? null };
}

/** @param {unknown} source @param {string} nodeId @returns {unknown[]} */
function residentsOf(source, nodeId) {
  if (typeof source === 'function') return asArray(source(nodeId));
  return asArray(asObject(source)[nodeId]);
}

/**
 * THE PAIR CENSUS — a SIBLING of the army encounter census, under the same exact-node law,
 * and never a fourth member of `ENVOY_ENCOUNTER_KINDS`. Rules, in order: a party must be
 * STANDING (`arrived`), the nodes must be EQUAL, the node must not be the traveller's own
 * home, and a candidate is emitted only on the tick the LATER party arrived, which is what
 * makes a dwelling operative roll ONCE per stop with no persisted "met already" mark.
 * @param {{travellers?: unknown, residentsAt?: unknown, tick?: unknown, seed?: unknown}} [args]
 * @returns {Record<string, unknown>[]}
 */
export function censusChanceMeetingCandidates({ travellers, residentsAt, tick, seed } = {}) {
  const at = wholeTick(tick);
  if (at === null) return [];
  const key = text(seed);
  /** @type {Record<string, unknown>[]} */
  const rows = [];
  for (const raw of asArray(travellers)) {
    const row = normalizeTraveller(raw, at);
    if (row) rows.push(row);
  }
  rows.sort((a, b) => codepoint(text(a.errandId), text(b.errandId)));

  /** @type {Record<string, unknown>[]} */
  const candidates = [];

  // Rule 5 — traveller x traveller, at a settlement node or a route node.
  for (let i = 0; i < rows.length; i += 1) {
    for (let j = i + 1; j < rows.length; j += 1) {
      const a = rows[i];
      const b = rows[j];
      if (text(a.nodeId) !== text(b.nodeId)) continue;
      if (text(a.homeSid) === text(b.homeSid)) continue;
      if (Math.max(num(a.arrivalTick), num(b.arrivalTick)) !== at) continue;
      const nodeId = text(a.nodeId);
      const meetingKey = pairMeetingKey({ a, b, nodeId });
      const venue = text(a.nodeKind) === 'settlement' ? MEETING_VENUES[0] : MEETING_VENUES[1];
      candidates.push({
        id: `chance_meeting:${meetingKey}`,
        meetingKey,
        kind: 'traveller_traveller',
        venue,
        nodeId,
        tick: at,
        parties: [travellerParty(a), travellerParty(b)],
      });
    }
  }

  // Rule 4 — traveller x resident, at a settlement node only, ONE picked resident.
  for (const row of rows) {
    if (num(row.arrivalTick) !== at) continue;
    if (text(row.nodeKind) !== 'settlement') continue;
    const nodeId = text(row.nodeId);
    /** @type {Record<string, unknown>[]} */
    const eligible = [];
    for (const raw of residentsOf(residentsAt, nodeId)) {
      const resident = normalizeResident(raw);
      if (resident) eligible.push(resident);
    }
    if (eligible.length === 0) continue;
    eligible.sort((a, b) => codepoint(text(a.residentNid), text(b.residentNid)));
    const meetingKey = residentMeetingKey({ ...row, nodeId });
    const pickRoll = drawPick(key, meetingKey);
    const picked = eligible[pickRoll % eligible.length];
    candidates.push({
      id: `chance_meeting:${meetingKey}`,
      meetingKey,
      kind: 'traveller_resident',
      venue: MEETING_VENUES[0],
      nodeId,
      tick: at,
      pickRoll,
      parties: [travellerParty(row), {
        nid: text(picked.residentNid), homeSid: nodeId, index: num(picked.index),
        errandId: '', covert: false, resident: true,
      }],
    });
  }
  return candidates.sort(candidateOrder);
}

/** @param {Record<string, unknown>} row @returns {Record<string, unknown>} */
function travellerParty(row) {
  return {
    nid: text(row.nid),
    homeSid: text(row.homeSid),
    errandId: text(row.errandId),
    journey: text(row.journey),
    covert: row.covert === true,
    resident: false,
  };
}

/** @param {Record<string, unknown>} a @param {Record<string, unknown>} b @returns {number} */
function candidateOrder(a, b) {
  const priority = { traveller_traveller: 0, traveller_resident: 1 };
  const pa = priority[/** @type {'traveller_traveller'|'traveller_resident'} */ (text(a.kind))] ?? 9;
  const pb = priority[/** @type {'traveller_traveller'|'traveller_resident'} */ (text(b.kind))] ?? 9;
  const partiesA = asArray(a.parties).map((p) => text(asObject(p).errandId) || text(asObject(p).nid));
  const partiesB = asArray(b.parties).map((p) => text(asObject(p).errandId) || text(asObject(p).nid));
  return (pa - pb)
    || codepoint(partiesA[0] || '', partiesB[0] || '')
    || codepoint(partiesA[1] || '', partiesB[1] || '')
    || codepoint(text(a.id), text(b.id));
}

/** @param {unknown} party @returns {string} */
function personKey(party) {
  const it = asObject(party);
  return `${text(it.homeSid)}|${text(it.nid)}`;
}

/**
 * ONE MEETING PER PERSON PER TICK, both parties. Greedy over the census order, so two
 * foreign notables in one hall (the rarer, more consequential event) take their slot
 * before a guest and a local do.
 * @param {{travellers?: unknown, residentsAt?: unknown, tick?: unknown, seed?: unknown}} [args]
 * @returns {Record<string, unknown>[]}
 */
export function selectChanceMeetings(args = {}) {
  /** @type {Set<string>} */
  const taken = new Set();
  /** @type {Record<string, unknown>[]} */
  const out = [];
  for (const candidate of censusChanceMeetingCandidates(args)) {
    const parties = asArray(candidate.parties);
    const keys = parties.map(personKey);
    if (keys.some((k) => taken.has(k))) continue;
    for (const k of keys) taken.add(k);
    out.push(candidate);
  }
  return out;
}

// ── THE RESOLUTION ────────────────────────────────────────────────────────────

/**
 * @typedef {Object} MeetingParty
 * @property {string} nid
 * @property {string} homeSid
 * @property {boolean} covert     his errand wears a covert sub-record
 * @property {boolean} clean      not already corrupt
 * @property {boolean} corruptible has a flaw the web could pull on
 * @property {boolean} hasRecord  a standing record exists at his home, or an orphan may be minted
 * @property {string[]} words     the legacy personality words: the TRUE chart on every generated world
 * @property {unknown} [knownAxes] the axes the counterpart's KnownReading DISCLOSED, handed
 *   down by the caller that holds the reading. ⚠ THE AXES, NEVER THE READING: the reading's
 *   authored-core key has exactly one reader in this estate and it is not here.
 * @property {{e: number, c: number}} [truePlane] his conduct plane, TRUE
 */

/** @param {unknown} raw @returns {Record<string, unknown>} */
function normalizeParty(raw) {
  const row = asObject(raw);
  const words = asArray(row.words).map(text).filter(Boolean);
  const trueAxes = legacyCoreAxes(words);
  const knownAxes = asObject(row.knownAxes);
  return {
    nid: text(row.nid),
    homeSid: text(row.homeSid),
    covert: row.covert === true,
    clean: row.clean !== false,
    corruptible: row.corruptible === true,
    hasRecord: row.hasRecord === true,
    words,
    trueAxes,
    // THE SIGHT LAW: an axis the record never spoke of reads at the AUTHORED CORE, so the
    // core is the base and whatever was disclosed is the overlay. A sparse reading that
    // REPLACED the core would make a single disclosure erase a man's whole chart.
    knownAxes: { ...trueAxes, ...knownAxes },
    truePlane: row.truePlane ? asObject(row.truePlane) : planeFromChart(trueAxes, words),
  };
}

/** The three owner terms of the compromise chance, each an integer rung.
 *  `courts` is `unknown` because that is what this function actually accepts: it reads the
 *  bag through `asObject` on both uses and never assumes a shape, and the caller hands it
 *  the entry point's own `unknown` field straight through.
 *  @param {Record<string, unknown>} target @param {Record<string, unknown>} approacher
 *  @param {unknown} courts @param {string} band @returns {Record<string, number>} */
function compromiseTerms(target, approacher, courts, band) {
  const knownPlane = planeFromChart(target.knownAxes, target.words);
  // T1 — how different the target is from his OWN court, read on his KNOWN chart:
  // the approacher decides on his estimate of the man, which is what the sight law protects.
  const t1 = personCourtRung(knownPlane, asObject(courts)[text(target.homeSid)]);
  // T2 — how alike the two of them read, by the distance band.
  const t2 = band === 'alike' ? 6 : band === 'differing' ? 3 : 0;
  // T3 — how close the PATRON court stands to the target's own plane.
  const t3 = EIGHTHS - personCourtRung(knownPlane, asObject(courts)[text(approacher.homeSid)]);
  return { t1, t2, t3 };
}

/** @param {Record<string, unknown>} target @param {Record<string, number>} terms @returns {number} */
function compromiseChance(target, terms) {
  const words = asArray(target.words).map(text);
  const fastPath = target.corruptible === true && words.includes('ambitious');
  if (fastPath) return num(CHANCE_MEETING_TUNING.compromiseFastPath);
  const cap = target.corruptible === true
    ? num(CHANCE_MEETING_TUNING.compromiseCapCorruptible)
    : num(CHANCE_MEETING_TUNING.compromiseCapPlain);
  return Math.min(cap, Math.floor((terms.t1 + terms.t2 + terms.t3) / 3));
}

/**
 * The drift vector one subject takes from the other. TRUE for where the subject stands,
 * KNOWN for what he perceived: you are moved from where you really are, toward what you
 * saw. At most three axes, the three largest differences, codepoint tiebreak.
 * @param {Record<string, unknown>} subject @param {Record<string, unknown>} other
 * @param {((position: {pole?: 'virtue'|'vice', level?: string}) => number)} [positionValue]
 *   L2's spectrum read, HANDED IN — see the header
 * @returns {Record<string, string>[]}
 */
function driftVector(subject, other, positionValue) {
  const mine = axisRungs(subject.trueAxes, positionValue);
  const theirs = axisRungs(other.knownAxes, positionValue);
  const firmGap = num(CHANCE_MEETING_TUNING.driftFirmGap);
  /** @type {{axisId: string, pole: string, band: string, gap: number}[]} */
  const pulls = [];
  for (const [axisId, value] of Object.entries(theirs)) {
    const gap = Math.abs(value - num(mine[axisId]));
    if (gap === 0) continue;
    pulls.push({
      axisId,
      pole: value > 0 ? 'virtue' : 'vice',
      band: gap >= firmGap ? 'firm' : 'faint',
      gap,
    });
  }
  pulls.sort((a, b) => (b.gap - a.gap) || codepoint(a.axisId, b.axisId));
  return pulls
    .slice(0, num(CHANCE_MEETING_TUNING.driftAxisCap))
    .map((pull) => ({ axisId: pull.axisId, pole: pull.pole, band: pull.band }));
}

/** The mark the ladder draw lands on, or null. @param {number} roll @param {string} band
 *  @param {string} posture @param {number} rivalryStep @returns {string|null} */
function markOutcome(roll, band, posture, rivalryStep) {
  const ladder = asObject(asObject(CHANCE_MEETING_TUNING.markLadder)[band]);
  const step = num(CHANCE_MEETING_TUNING.markPostureStep);
  const shift = posture === 'hostile' ? step : posture === 'friendly' ? -step : 0;
  const bond = Math.max(0, num(ladder.bond) - shift);
  const respect = Math.max(0, num(ladder.respect));
  const rivalry = Math.max(0, num(ladder.rivalry) + shift + Math.max(0, rivalryStep));
  const floor = num(CHANCE_MEETING_TUNING.nothingFloor);
  // The nothing band is never below its floor: a three-century world may not accumulate a
  // foreign bond per stop, and the floor is what makes that a property rather than a hope.
  const room = Math.max(0, EIGHTHS - floor);
  let cut = Math.min(bond, room);
  if (roll < cut) return 'bond';
  cut += Math.min(respect, Math.max(0, room - cut));
  if (roll < cut) return 'respect';
  cut += Math.min(rivalry, Math.max(0, room - cut));
  if (roll < cut) return 'rivalry';
  return null;
}

/**
 * THE MEETING. Pure, total on garbage (a missing reading reads as neutral, which lands in
 * the `nothing` band by arithmetic), and every number it returns is an integer.
 *
 * ⛔ Nothing here kills, moves, marries, replaces or concludes a person. The outcome words
 * are the whole surface, and the widest of them is a LEASH the corruption web already
 * mints from a lean it may or may not consume.
 *
 * `pickRoll` is on the contract because the function READS it (the census draws that arm
 * one layer up and hands it down for the receipt). It is `unknown` like every sibling
 * field — this entry point is total on garbage, and the body re-validates with
 * `Number.isInteger` before the receipt ever carries it.
 *
 * `positionValue` is the ONE thing this leaf takes from the character family, and it is
 * taken rather than imported — the header says why. A caller that hands none reads both
 * charts as making no claim, which is the answer two unreadable charts already produce.
 *
 * @param {{meetingKey?: unknown, kind?: unknown, venue?: unknown, nodeId?: unknown,
 *   tick?: unknown, seed?: unknown, a?: unknown, b?: unknown, courts?: unknown,
 *   posture?: unknown, wariness?: unknown, pickRoll?: unknown,
 *   positionValue?: ((position: {pole?: 'virtue'|'vice', level?: string}) => number)}} [args]
 * @returns {Record<string, unknown>}
 */
export function resolveChanceMeeting({
  meetingKey, kind, venue, nodeId, tick, seed, a, b, courts, posture, wariness, pickRoll,
  positionValue,
} = {}) {
  const key = text(meetingKey);
  const seedText = text(seed);
  const at = wholeTick(tick) ?? 0;
  const meetingKind = MEETING_KINDS.includes(text(kind)) ? text(kind) : MEETING_KINDS[0];
  const meetingVenue = MEETING_VENUES.includes(text(venue)) ? text(venue) : MEETING_VENUES[0];
  const stance = POSTURE_BANDS.includes(text(posture)) ? text(posture) : 'neutral';
  const one = normalizeParty(a);
  const two = normalizeParty(b);
  /** @type {Record<string, string>[]} */
  const refusals = [];

  const base = num(asObject(asObject(CHANCE_MEETING_TUNING.baseRung)[meetingKind])[meetingVenue]);
  const covertStep = (one.covert === true || two.covert === true)
    ? num(CHANCE_MEETING_TUNING.covertMeetStep)
    : 0;
  const meetRung = clampInt(
    base + num(asObject(CHANCE_MEETING_TUNING.posturePlus)[stance]) + covertStep,
    0,
    EIGHTHS,
  );
  const meetRoll = drawMeet(seedText, key);

  /** @type {Record<string, number>} */
  const rolls = { meet: meetRoll };
  // The PICK is drawn one layer up, by the census that chose which resident is standing
  // there; the receipt carries it so every arm the mechanism draws is visible in one place.
  if (Number.isInteger(pickRoll)) rolls.pick = /** @type {number} */ (pickRoll);
  /** @type {Record<string, unknown>} */
  const receipt = {
    id: `chance_meeting:${key}`,
    kind: meetingKind,
    venue: meetingVenue,
    nodeId: text(nodeId),
    tick: at,
    parties: [
      { nid: one.nid, homeSid: one.homeSid, covert: one.covert === true },
      { nid: two.nid, homeSid: two.homeSid, covert: two.covert === true },
    ],
    posture: stance,
    outcome: 'nothing',
    mark: null,
    drift: [],
    lean: null,
    grievance: null,
    approach: 'not_made',
    refusals,
    rolls,
  };

  const distance = pairDistance(one.knownAxes, two.knownAxes, positionValue);
  receipt.distance = { rungs: distance.rungs, band: distance.band };

  if (!(meetRoll < meetRung)) {
    receipt.reason = 'no_meeting';
    return freezeReceipt(receipt);
  }

  // ── THE APPROACH. One direction only: the one with the higher chance, ties by the
  //    target's nid. An attempt needs BOTH an arithmetic opening and its own die.
  const directions = [
    { approacher: one, target: two },
    { approacher: two, target: one },
  ].map((pair) => {
    const terms = compromiseTerms(pair.target, pair.approacher, courts, distance.band);
    return { ...pair, terms, chance: compromiseChance(pair.target, terms) };
  });
  directions.sort((x, y) => (y.chance - x.chance) || codepoint(text(x.target.nid), text(y.target.nid)));
  const lead = directions[0];

  const eligible = lead.target.clean === true && lead.target.hasRecord === true;
  if (!eligible) refusals.push({ arm: 'approach', word: 'ineligible_target' });
  if (!lead.target.hasRecord) refusals.push({ arm: 'mark', word: 'no_home_record' });

  const approachRung = clampInt(
    num(CHANCE_MEETING_TUNING.approachBaseRung)
      + (lead.terms.t1 >= num(CHANCE_MEETING_TUNING.approachAtOddsRung)
        ? num(CHANCE_MEETING_TUNING.approachAtOddsStep) : 0)
      + (lead.approacher.covert === true ? num(CHANCE_MEETING_TUNING.approachCovertStep) : 0),
    0,
    EIGHTHS,
  );

  let rivalryStep = 0;
  let markArmRuns = true;
  if (eligible && lead.chance >= num(CHANCE_MEETING_TUNING.compromiseFloor)) {
    const approachRoll = drawApproach(seedText, key);
    rolls.approach = approachRoll;
    if (approachRoll < approachRung) {
      receipt.approach = 'made';
      const willRoll = drawCompromise(seedText, key);
      rolls.compromise = willRoll;
      if (willRoll < lead.chance) {
        receipt.outcome = 'compromised';
        receipt.lean = {
          patronSid: lead.approacher.homeSid,
          targetSid: lead.target.homeSid,
          targetNid: lead.target.nid,
          band: LEAN_BANDS[0],
        };
        // The person plane records the tie the compromise made; the settlement plane
        // follows through the elite bleed when that seam is wired, which is not here.
        receipt.mark = { kind: 'loyalty', sev: 'half', holderNid: lead.target.nid, otherNid: lead.approacher.nid };
        markArmRuns = false;
      } else {
        receipt.outcome = 'rejected';
        const warinessRung = Math.min(
          num(CHANCE_MEETING_TUNING.exposureWarinessCap),
          Math.max(0, Math.floor(num(wariness))),
        );
        const exposureRung = clampInt(
          num(CHANCE_MEETING_TUNING.exposureBaseRung)
            + (lead.approacher.covert === true ? num(CHANCE_MEETING_TUNING.exposureCovertStep) : 0)
            + warinessRung
            + (stance === 'hostile' ? num(CHANCE_MEETING_TUNING.exposureHostileStep) : 0),
          0,
          EIGHTHS,
        );
        const exposureRoll = drawExposure(seedText, key);
        rolls.exposure = exposureRoll;
        if (exposureRoll < exposureRung) {
          receipt.outcome = 'exposed';
          receipt.grievance = {
            fromSid: lead.target.homeSid,
            toSid: lead.approacher.homeSid,
            incidentType: 'approach_exposed',
          };
          markArmRuns = false;
        } else {
          // People who declined an offer may still like each other, a little less.
          rivalryStep = num(CHANCE_MEETING_TUNING.markRefusedRivalryStep);
        }
      }
    }
  }

  if (markArmRuns && lead.target.hasRecord === true && one.hasRecord === true && two.hasRecord === true) {
    const markRoll = drawMark(seedText, key);
    rolls.mark = markRoll;
    const outcome = markOutcome(markRoll, distance.band, stance, rivalryStep);
    if (outcome) {
      // ⚠ A REFUSED OFFER KEEPS ITS OWN WORD. The mark arm records what the two people
      // made of each other; it may not overwrite the fact that an offer was turned down,
      // because 'rejected' is a counted outcome of its own and a mark word in its place
      // would erase every refusal from the measured distribution.
      if (receipt.outcome === 'nothing') receipt.outcome = outcome;
      receipt.mark = {
        kind: outcome === 'bond' ? 'friendship' : outcome,
        sev: 'half',
        holderNid: one.nid,
        otherNid: two.nid,
      };
    }
  }

  // People rub off on each other whether or not they become friends, so the drift arm
  // runs on every meeting that HAPPENED, the `nothing` band included.
  receipt.drift = [
    ...driftVector(one, two, positionValue).map((pull) => ({ subjectNid: one.nid, ...pull })),
    ...driftVector(two, one, positionValue).map((pull) => ({ subjectNid: two.nid, ...pull })),
  ];

  return freezeReceipt(receipt);
}

/** @param {Record<string, unknown>} receipt @returns {Record<string, unknown>} */
function freezeReceipt(receipt) {
  return Object.freeze({ ...receipt });
}
