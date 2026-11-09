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

import { activeCrisisTypes, familyActiveIn } from '../crisis/crisisFacts.js';

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
 * @property {string} family a key of CRISIS_FAMILIES, or a key of TYPE_FAMILIES ('migration', 'debt')
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
  { claim: 'nothing has arrived by sea', re: /\bnothing hostile has come through it yet\b/, family: 'threat' },
  // hunger: famine, under siege; any crisis on a deficit food band (crisisFacts.js :: familyActiveIn)
  { claim: 'feeds itself with a margin', re: /\bfeeds itself with a small margin\b/, family: 'hunger' },
  { claim: 'food is not a subject', re: /\bIt is not a subject anyone raises unprompted\b/, family: 'hunger' },
  // W1 ECO (2026-11-07): DS-ECO-9 SECURE v3 reworded under the owner's style law; the claim kept.
  { claim: 'fed, comfortably', re: /\bis fed, but only just\b/, family: 'hunger' },
  { claim: 'the road staying open', re: /\bNothing about the arrangement is failing; everything about it rests on the road staying open\b/, family: 'hunger' },
  { claim: 'nobody without bread', re: /\bNobody is going without bread\b/, family: 'hunger' },
  { claim: 'nobody talks about bread', re: /\bNobody here talks about the price of bread\b/, family: 'hunger' },
  // succession: succession void, politically fractured
  // SW-7 POWER-SIDE (STYLE-2 B7, 2026-11-09): DS-POW-4 Stable v1 and v3 reworded under the owner's style law; the
  // claims kept, re-anchored to the new words (v3's twice, below and under unrest).
  { claim: 'the succession is not live', re: /\bnobody is asking who comes next\b/, family: 'succession' },
  { claim: 'nobody would replace the seat', re: /\bdoes not come up, because there is nobody the \p{L}+ would name\b/u, family: 'succession' },
  { claim: 'the seat is safe', re: /\bis safe in the hall\b/, family: 'succession' },
  // unrest: insurgency, slave revolt, wartime
  // Rung 2D unit 2 (the chair's ruling): an insurgency or a revolt denies the seat's safety as
  // surely as an open succession (rung 2C §3c: `soak1k-1` slave revolt, `-3001` insurgency).
  { claim: 'the seat is safe', re: /\bis safe in the hall\b/, family: 'unrest' },
  { claim: 'very little street violence', re: /\bvery little street violence\b/, family: 'unrest' },
  { claim: 'random violence is put down', re: /\brandom violence is put down\b/, family: 'unrest' },
  // crisis: any active crisis
  { claim: 'nothing to remark on', re: /\bcondition asks to be remarked on\b/, family: 'crisis' },
  { claim: 'nothing striking either way', re: /\bnothing striking about \S.{0,80}? condition in either direction\b/, family: 'crisis' },
  { claim: 'things are fine', re: /^Things are fine\./, family: 'crisis' },
  // migration (an influx): a page that says families are leaving
  { claim: 'families leaving', re: /\bfamilies left this week\b/, family: 'migration' },
  // ── RUNG 2D UNIT 3 (the chair's ruling): the twelve rows rung 2C's sixty-line read
  // (`docs/SOAK_10000_RUNG2C_2026-11-04.md` §3c) found outside the thirty claims above, nine
  // phrases. The instrument only: the goals (npcStructure.js, the registry's R11 / CENSUS-4)
  // and the desk lines keep their words; the cure is their declarations, not this table.
  // A ruler's want of "current stability" (×4 in the city tier: a fracture, a debt). CENSUS-4b: the
  // three goal rows re-anchored to R11's rewritten wording (efb84c0), the claims unchanged.
  // W3 POW (2026-11-08): the government stable dominant goal reworded under the owner's style law; the claim kept.
  { claim: 'current stability', re: /\b[Ff]ind and mend the seat.s weak spot\b/, family: 'crisis' },
  // A ruler's want that takes the order as settled, under an open succession or an uprising.
  { claim: 'competent administration', re: /\b[Dd]o every task the seat hands them so well that the seat cannot do without them\b/, family: 'succession' },
  { claim: 'competent administration', re: /\b[Dd]o every task the seat hands them so well that the seat cannot do without them\b/, family: 'unrest' },
  { claim: 'stable institutional competition', re: /\b[Kk]eep the family's name honoured at every feast while the new offices take its old work\b/, family: 'succession' },
  { claim: 'stable institutional competition', re: /\b[Kk]eep the family's name honoured at every feast while the new offices take its old work\b/, family: 'unrest' },
  // The food band's own word, under a siege or a famine (and any crisis on a deficit band). The
  // `migration` row is RETIRED (CENSUS-2c, the chair's R-P 1): the food record counts an influx
  // (×1.15 consumption, CENSUS-1c unit 7), so "Food Secure" under a fed influx is TRUE; an influx
  // the place cannot feed reads the deficit, which the hunger row already catches.
  { claim: 'food secure', re: /^Food Secure\b/, family: 'hunger' },
  // An economy line that says nothing is failing, or that no one export matters, under hunger.
  // W1 ECO (2026-11-07): DS-ECO-12 INCOME MIX one source v3 reworded under the owner's style law; the claim kept.
  { claim: 'nothing is failing', re: /^It is doing well enough now\b/, family: 'hunger' },
  // W1 ECO (2026-11-07): DS-ECO-10 POSTURE established v1 reworded under the owner's style law; the claim kept.
  { claim: 'depends on none alone', re: /\bif one trade fails, the others still go\b/, family: 'hunger' },
  // A place under threat that a stranger walks into unchallenged, or where pilgrims queue at ease.
  { claim: 'nobody stops a stranger', re: /\bwithout being stopped, challenged or counted by anybody at all\b/, family: 'threat' },
  { claim: 'pilgrims queue patiently', re: /\bqueue patiently for their turn\b/, family: 'threat' },
  // A year that closes ahead, under a debt that takes the revenue.
  { claim: 'a year closed ahead', re: /\bcloses every year ahead\b/, family: 'debt' },
]);

/**
 * The claims read under a single crisis type rather than a state-prose family (outside the
 * kernel's dimensions): mass migration (an influx), and since rung 2D a debt.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const TYPE_FAMILIES = Object.freeze({
  migration: Object.freeze(['mass_migration']),
  debt: Object.freeze(['indebted']),
});

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
    const own = TYPE_FAMILIES[family];
    active[family] = own ? types.filter((t) => own.includes(t)) : familyActiveIn(settlement, family, types);
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
