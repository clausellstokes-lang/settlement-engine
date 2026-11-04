/**
 * domain/coherence/crisisBlindFindings.js — does the page say calm while a crisis is on?
 *
 * A page check (F12 CRISIS-BLIND PROSE, rung 2, 2026-11-04). Rung 2's DM-eye read of sixty
 * settlements (`docs/SOAK_10000_RUNG2_2026-11-04.md` §3c) found about a third of the pages
 * printing a stock calm sentence under an active crisis that the sentence denies: "Nothing
 * presses Rundfeld at present…" under a siege, "The succession question is not a live one"
 * in a succession void. The page then says calm and crisis at once, a contradiction (kind
 * 10, "crisis", in the soak's stop rule).
 *
 * THE DEFINITION. A finding is a rendered sentence that asserts calm, normality or the absence
 * of a pressure (a CLAIM below) while the record carries an active crisis of a family the
 * claim denies (`crisis/crisisFacts.js :: CRISIS_FAMILIES`, read from `settlement.stress`).
 * A sentence that names its crisis is not a claim; a claim in a place whose crises it does
 * not deny is not a finding ("the succession question is not a live one" under a famine is
 * true). One finding per sentence, the first claim that fires.
 *
 * THE VOCABULARY is the rung-2 sample's quoted lines plus every state-prose variant the
 * 1,000-settlement corpus prints under a crisis that asserts calm (measured over the rendered
 * pages at `d0068d35e`). It is written out phrase by phrase, never derived from the corpus's
 * marks, so the check stands over the cure rather than reading it. The tier noun is spoken
 * at render time, so no phrase names "town".
 *
 * Mass migration is an influx in the engine ("an influx of newcomers"): a page that says
 * families are leaving denies it. That writer is generation-time
 * (`power/governanceNarrative.js`), counted here and cured by its own lane.
 *
 * Pure: no randomness, no clock.
 */

import { activeCrisisTypes, familyTypesActive } from '../crisis/crisisFacts.js';

/**
 * @typedef {object} CrisisBlindFinding
 * @property {string} surface the surface the sentence is on
 * @property {string} sentence the offending sentence
 * @property {string} claim the calm the sentence asserts
 * @property {string} family the crisis family it denies
 * @property {string[]} crises the active crisis types of that family
 */

/**
 * @typedef {object} CalmClaim
 * @property {string} claim
 * @property {RegExp} re
 * @property {string} family a key of CRISIS_FAMILIES, or 'migration'
 */

/** @type {ReadonlyArray<CalmClaim>} */
const CLAIMS = Object.freeze([
  // threat: under siege, occupied, beast & raider threat
  { claim: 'nothing presses', re: /\bNothing presses\b/, family: 'threat' },
  { claim: 'not thinking about being attacked', re: /\bdoes not spend much time thinking about being attacked\b/, family: 'threat' },
  { claim: 'over-provided against beasts', re: /\bover-provided against beasts\b/, family: 'threat' },
  { claim: 'a relaxed perimeter', re: /\bchiefly for how relaxed the people on it are\b/, family: 'threat' },
  { claim: 'the works are not for the creatures', re: /\bit is not the creatures\b/, family: 'threat' },
  { claim: 'a quiet heartland', re: /\bin a heartland this quiet\b/, family: 'threat' },
  { claim: 'never needed to think about what is outside', re: /\bnever needed to think about what is outside it\b/, family: 'threat' },
  { claim: 'nothing that would justify a watch', re: /\bmeets nothing that would justify a watch\b/, family: 'threat' },
  { claim: 'nothing has come for it', re: /\bNothing has come for\b/, family: 'threat' },
  { claim: 'not interesting to an army', re: /\bplan for an army is to not be interesting to one\b/, family: 'threat' },
  { claim: 'safe by distance and unimportance', re: /\bsafety is its neighbours, its distance, and its unimportance\b/, family: 'threat' },
  { claim: 'the present peace', re: /\bthe present peace\b/, family: 'threat' },
  { claim: 'no present need for its works', re: /\bstands ahead of any present need\b/, family: 'threat' },
  { claim: 'its works asked little of', re: /\bnow that it asks little of it\b/, family: 'threat' },
  { claim: 'nothing has arrived by sea', re: /\bnothing has yet arrived that made the second half matter\b/, family: 'threat' },
  // hunger: famine, under siege
  { claim: 'feeds itself with a margin', re: /\bfeeds itself with a small margin\b/, family: 'hunger' },
  { claim: 'food is not a subject', re: /\bIt is not a subject anyone raises unprompted\b/, family: 'hunger' },
  { claim: 'fed, comfortably', re: /\bfed and only just comfortably\b/, family: 'hunger' },
  { claim: 'the road staying open', re: /\bNothing about the arrangement is failing; everything about it rests on the road staying open\b/, family: 'hunger' },
  { claim: 'nobody without bread', re: /\bNobody is going without bread\b/, family: 'hunger' },
  { claim: 'nobody talks about bread', re: /\bNobody here talks about the price of bread\b/, family: 'hunger' },
  // succession: succession void, politically fractured
  { claim: 'the succession is not live', re: /\bthe succession question is not a live one\b/, family: 'succession' },
  { claim: 'nobody would replace the seat', re: /\bdoes not come up, because there is nobody the \p{L}+ would name\b/u, family: 'succession' },
  { claim: 'the seat is safe', re: /\bsafe for the plainest reason a seat can be safe\b/, family: 'succession' },
  // unrest: insurgency, slave revolt, wartime
  { claim: 'very little street violence', re: /\bvery little street violence\b/, family: 'unrest' },
  { claim: 'random violence is put down', re: /\brandom violence is put down\b/, family: 'unrest' },
  // crisis: any active crisis
  { claim: 'nothing to remark on', re: /\bcondition asks to be remarked on\b/, family: 'crisis' },
  { claim: 'nothing striking either way', re: /\bnothing striking about \S.{0,80}? condition in either direction\b/, family: 'crisis' },
  { claim: 'things are fine', re: /^Things are fine\./, family: 'crisis' },
  // migration (an influx): a page that says families are leaving
  { claim: 'families leaving', re: /\bfamilies left this week\b/, family: 'migration' },
]);

/** The migration "family": its one type, outside the state-prose dimensions. */
const MIGRATION_TYPES = Object.freeze(['mass_migration']);

/** @param {string} text @returns {string[]} */
function sentencesOf(text) {
  return String(text ?? '')
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Every sentence on the surfaces that asserts a calm an active crisis denies.
 * @param {object | null | undefined} settlement the generated record
 * @param {Readonly<Record<string, string>>} surfaces surface id → the text a reader sees there
 * @returns {CrisisBlindFinding[]}
 */
export function crisisBlindFindings(settlement, surfaces) {
  const types = activeCrisisTypes(settlement);
  if (types.length === 0) return [];
  /** @type {Record<string, string[]>} */
  const active = {};
  for (const { family } of CLAIMS) {
    if (active[family]) continue;
    active[family] = family === 'migration' ? types.filter((t) => MIGRATION_TYPES.includes(t)) : familyTypesActive(family, types);
  }
  /** @type {CrisisBlindFinding[]} */
  const findings = [];
  for (const [surface, raw] of Object.entries(surfaces ?? {})) {
    for (const sentence of sentencesOf(typeof raw === 'string' ? raw : '')) {
      const hit = CLAIMS.find(({ re, family }) => active[family].length > 0 && re.test(sentence));
      if (hit) findings.push({ surface, sentence, claim: hit.claim, family: hit.family, crises: active[hit.family] });
    }
  }
  return findings;
}
