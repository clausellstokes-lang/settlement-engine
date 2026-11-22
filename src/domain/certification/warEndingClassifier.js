/**
 * warEndingClassifier.js — WR-9's endings classifier (amendment L, obligation 2).
 *
 * THE PROBLEM THIS SOLVES, STATED PLAINLY. WR-9's endings mix is a closed
 * eight-key vocabulary (`WAR_ENDING_KEYS`), and FIVE of those eight keys are
 * SPEC INVENTIONS: `ruler_change`, `fragmentation`, `annihilation`,
 * `punitive_sack_initiation` and `punitive_sack_vengeance` exist nowhere in the
 * engine as emitted tokens. `terms` exists only as a conquest INTENT
 * (conquestIntent.js) and `exhaustion` only as a PEACE REASON (peaceReasons.js)
 * — different concepts wearing the same word. A collector that merely COUNTED
 * engine tokens would therefore score seven of eight keys at zero forever and
 * call it evidence. WR-9 owes a CLASSIFIER: a pure, total mapping from the facts
 * the engine really emits onto the vocabulary the envelope really grades.
 *
 * PURE: no rng, no wall clock, no mutation, no state, no world reads. Its only
 * import is the razing leaf's id minter, and that import is deliberate (below).
 *
 * ⚠️⚠️ THE RAZING ROAD IS RECOVERED BY RECONSTRUCTION, NEVER BY PARSING. The two
 * punitive-sack keys are kept separate because their RATIO is the health metric
 * for R2's vengeance-license economy; collapsing them would erase the claim. The
 * only published carrier of the road is the razing outcome id, and settlement
 * ids may contain dots — so splitting that id would mis-attribute an atrocity,
 * which under R2 is a warrant to burn a city. This module re-mints the id from
 * (accused, victim, tick, road) over the closed `RAZING_ROADS` vocabulary and
 * compares for EQUALITY, exactly as believedRazings.js does. A road that does
 * not reconstruct is reported as unclassified, never guessed.
 *
 * IT NEVER SILENTLY BUCKETS. An unclassifiable close returns `ending: null` with
 * a closed reason token. The alternative — defaulting to `terms` — would let the
 * dominance envelope pass on a corpus whose endings were never actually read,
 * which is the precise failure mode ("one path carrying nearly all endings means
 * the others are decoration") the envelope exists to catch.
 *
 * WHAT IT IS NOT. It does not read world state, does not decide whether a war
 * closed, and does not own duration. The census (warConvergenceCensus's future
 * home, or a harness) decides those and hands this module a finished fact
 * record. One judgment per module.
 */

import { RAZING_ROADS, razingOutcomeIdFor } from '../worldPulse/razing.js';
import { WAR_ENDING_KEYS } from './warConvergenceContract.js';

/**
 * THE PRECEDENCE, DECLARED RATHER THAN IMPLIED (J-WR9-2, vetoable). A single
 * close can satisfy more than one key's evidence, so the order below is part of
 * the contract and is pinned as behaviour, not left to statement order.
 *
 * The two sack roads come FIRST and that is the load-bearing choice: their ratio
 * polices R2's license economy, and any rule that let a co-occurring conquest or
 * death mask a burning would silently zero the exact metric WR-9 exists to read.
 * `conquest` follows because a held town is a power transfer the world reasons
 * from afterwards. `annihilation` is next: it is disjoint from the sack by
 * construction (a razed town becomes a REMNANT — "razing the same remnant twice
 * yields NOTHING" — it does not die), so the ordering only ever settles a
 * pathological overlap. The four negotiated endings follow in decreasing
 * specificity: a coalition that dissolved into pairwise peaces (`fragmentation`)
 * is a more particular fact than a court that changed hands (`ruler_change`),
 * which is more particular than a war that simply ran out of will
 * (`exhaustion`), which is more particular than a war that was talked to a close
 * (`terms`). `terms` is LAST and is never a fallback — it requires its own
 * positive evidence.
 * @type {ReadonlyArray<string>}
 */
export const WAR_ENDING_PRECEDENCE = Object.freeze([
  'punitive_sack_vengeance',
  'punitive_sack_initiation',
  'conquest',
  'annihilation',
  'fragmentation',
  'ruler_change',
  'exhaustion',
  'terms',
]);

/**
 * The closed reasons a close may fail to classify. Each is a DISTINCT diagnosis,
 * because "we saw nothing" and "we saw a razing we could not attribute" call for
 * opposite repairs and must never share a bucket.
 * @type {ReadonlyArray<string>}
 */
export const WAR_ENDING_UNCLASSIFIED_REASONS = Object.freeze([
  'not_a_closed_war',
  'no_terminal_evidence',
  'razing_road_unreconstructable',
]);

/**
 * The evidence channel each key is read from, named once so a reader can audit
 * the mapping without tracing the branches. These are CHANNEL NAMES, not engine
 * tokens: half the vocabulary has no engine token at all, which is why this
 * module exists.
 * @type {Readonly<Record<string, string>>}
 */
export const WAR_ENDING_EVIDENCE = Object.freeze({
  punitive_sack_vengeance: 'razing outcome whose id reconstructs on the vengeance road (razing.js RAZING_ROADS)',
  punitive_sack_initiation: 'razing outcome whose id reconstructs on the initiation road (razing.js RAZING_ROADS)',
  conquest: "outcome candidateType 'conquest' (warDeployment.js siege verdict fork)",
  annihilation: 'the losing belligerent died in the closing window (the harness died flag)',
  fragmentation: 'the coalition dissolved into pairwise peaces (peaceTermsCoalition fractures)',
  ruler_change: 'a governed WR-5 seat-transition family closed the war (warRulingsNews families)',
  exhaustion: "the peace was decided on the 'exhaustion' peace reason (peaceReasons.js)",
  terms: 'a treaty document was written for the pair (peaceTerms.js, the single terms writer)',
});

/**
 * The WR-5 governed families whose whole content is "a court changed hands and
 * the war ended with it". Spelled here as a CLOSED set rather than a substring
 * test, because `successor_escalates_war` is the same machinery producing the
 * opposite fact and must never be counted as an ending.
 * @type {ReadonlyArray<string>}
 */
export const RULER_CHANGE_ENDING_FAMILIES = Object.freeze([
  'successor_repudiates_war',
  'war_party_overturns_peacemaker',
  'peace_party_overturns_warmonger',
  'war_dissolved_by_verdict',
]);

/** @param {unknown} value @returns {Record<string, unknown>} */
const asRecord = (value) => (
  value && typeof value === 'object' && !Array.isArray(value)
    ? /** @type {Record<string, unknown>} */ (value)
    : {}
);

/** @param {unknown} value @returns {Array<Record<string, unknown>>} */
const asRecords = (value) => (Array.isArray(value) ? value.map(asRecord) : []);

/** @param {unknown} value @returns {string} */
const asText = (value) => (typeof value === 'string' ? value : '');

/**
 * The road a razing outcome rode in on, recovered by RE-MINTING its id for each
 * closed road and comparing for equality. Returns '' when no road reconstructs —
 * which is a finding, not a default.
 *
 * @param {{ id?: unknown, targetSaveId?: unknown, tick?: unknown }} outcome
 * @param {string} razerId  the accused, supplied by the caller's own war record
 * @returns {string} one of RAZING_ROADS, or '' when nothing reconstructs
 */
export function razingRoadOf(outcome, razerId) {
  const row = asRecord(outcome);
  const id = asText(row.id);
  if (!id) return '';
  for (const road of RAZING_ROADS) {
    const minted = razingOutcomeIdFor({
      road,
      razerId,
      victimId: row.targetSaveId,
      tick: row.tick,
    });
    if (minted && minted === id) return road;
  }
  return '';
}

/**
 * @typedef {object} ClosedWarFact
 * @property {string} [attackerId] the belligerent whose deployment opened the war
 * @property {string} [defenderId] the belligerent it deployed against
 * @property {boolean} [closed] whether the census judged this war closed
 * @property {Array<Record<string, unknown>>} [terminalOutcomes] outcomes observed
 *   in the closing window, each `{ id, candidateType, targetSaveId, tick }`
 * @property {boolean} [loserDied] the losing belligerent ceased to exist
 * @property {boolean} [coalitionFragmented] the coalition dissolved into pairwise peaces
 * @property {string} [seatTransitionFamily] a governed WR-5 family, when one closed it
 * @property {string} [peaceReason] the deciding peace reason, when one was read
 * @property {boolean} [treatyWritten] a treaty document exists for the pair
 */

/**
 * Classify one closed war onto the WR-9 endings vocabulary.
 *
 * TOTAL over its input: every return names either a key in `WAR_ENDING_KEYS` or
 * a reason in `WAR_ENDING_UNCLASSIFIED_REASONS`. Never throws, never guesses.
 *
 * @param {ClosedWarFact} fact
 * @returns {{ ending: string|null, evidence: string, reason: string }}
 */
export function classifyWarEnding(fact) {
  const row = asRecord(fact);
  if (row.closed !== true) {
    return { ending: null, evidence: '', reason: 'not_a_closed_war' };
  }
  const attackerId = asText(row.attackerId);
  const outcomes = asRecords(row.terminalOutcomes);

  /** @type {Set<string>} */
  const earned = new Set();
  let sawRazing = false;
  let roadRecovered = false;
  for (const outcome of outcomes) {
    const candidateType = asText(outcome.candidateType);
    if (candidateType === 'conquest') earned.add('conquest');
    if (candidateType !== 'razing') continue;
    sawRazing = true;
    const road = razingRoadOf(outcome, attackerId);
    if (!road) continue;
    roadRecovered = true;
    earned.add(road === 'vengeance' ? 'punitive_sack_vengeance' : 'punitive_sack_initiation');
  }
  if (sawRazing && !roadRecovered) {
    return { ending: null, evidence: '', reason: 'razing_road_unreconstructable' };
  }
  if (row.loserDied === true) earned.add('annihilation');
  if (row.coalitionFragmented === true) earned.add('fragmentation');
  if (RULER_CHANGE_ENDING_FAMILIES.includes(asText(row.seatTransitionFamily))) {
    earned.add('ruler_change');
  }
  if (asText(row.peaceReason) === 'exhaustion') earned.add('exhaustion');
  if (row.treatyWritten === true) earned.add('terms');

  for (const key of WAR_ENDING_PRECEDENCE) {
    if (earned.has(key)) {
      return { ending: key, evidence: WAR_ENDING_EVIDENCE[key], reason: '' };
    }
  }
  return { ending: null, evidence: '', reason: 'no_terminal_evidence' };
}

/**
 * Fold a list of closed-war facts into a WR-9 endings histogram over the whole
 * closed vocabulary, plus the unclassified tally the envelope must be able to
 * see. An endings mix whose unclassified count dwarfs its classified count is a
 * broken instrument wearing a passing histogram, so the count travels WITH the
 * mix rather than being discarded at the fold.
 *
 * @param {ClosedWarFact[]} facts
 * @returns {{
 *   endingsMix: Record<string, number>,
 *   unclassified: Record<string, number>,
 *   classifiedTotal: number,
 *   unclassifiedTotal: number,
 * }}
 */
export function foldWarEndings(facts) {
  /** @type {Record<string, number>} */
  const endingsMix = Object.fromEntries(WAR_ENDING_KEYS.map((key) => [key, 0]));
  /** @type {Record<string, number>} */
  const unclassified = Object.fromEntries(
    WAR_ENDING_UNCLASSIFIED_REASONS.map((reason) => [reason, 0]),
  );
  let classifiedTotal = 0;
  let unclassifiedTotal = 0;
  for (const fact of Array.isArray(facts) ? facts : []) {
    const { ending, reason } = classifyWarEnding(fact);
    if (ending && Object.prototype.hasOwnProperty.call(endingsMix, ending)) {
      endingsMix[ending] += 1;
      classifiedTotal += 1;
      continue;
    }
    if (Object.prototype.hasOwnProperty.call(unclassified, reason)) {
      unclassified[reason] += 1;
    }
    unclassifiedTotal += 1;
  }
  return { endingsMix, unclassified, classifiedTotal, unclassifiedTotal };
}
