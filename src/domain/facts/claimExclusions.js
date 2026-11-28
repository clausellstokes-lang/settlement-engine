/**
 * domain/facts/claimExclusions.js — THE TABLE OF EXCLUSIONS BETWEEN CLAIMS (SURVEY S-C, the eleventh chair's SURVEY-DESIGN §2;
 * the owner's rule of 2026-11-27: "if one thing is true another can't be": disqualifiers, not qualifiers).
 *
 * A CLAIM is an atom of the fact vocabulary (`factVocabulary.js`), with ONE reader on the FINAL record. Two claims that exclude
 * each other are written ONCE, here. THE TABLE IS NOT CONSULTED WHEN A PAGE IS DRAWN: the record is the only arbiter, and a line
 * yields because its own declaration is refused by the record (`drawDeclared.js`, the kernel's `eligibleVariants`), never because
 * another line printed first. The table does three things, all at test time:
 *   (i)   the READERS' PROPERTY: no record of the corpora answers both sides of a row TRUE on its final record
 *         (`tests/domain/facts/claimExclusions.test.js`);
 *   (ii)  THE PAGE CLASH CENSUS: the pages that print a line standing on side A beside a line (or a recording) standing on side
 *         B (`scripts/page-clash-census.mjs`, its register `scripts/.page-clash-census.json`, shrink-only, its bar 0);
 *   (iii) THE WALKER: a pool line whose words assert a side declares that side's atom, or is allowed by name with a reason
 *         (`tests/lint/claimExclusions.walker.test.js`).
 *
 * A ROW: `id`; `a` and `b`, each one atom as a line declares it (`X`, `no X`, `crisis: K`, `no crisis: K`, a band atom), or, for a
 * GENERIC row, `generic` names the shape whose every atom is so paired (`presence`: X against `no X`; `band`: two atoms of one
 * band dimension whose ranges do not meet; `crisis`: a kind in force against `no crisis: <that kind>`); `recorded`: the sides the
 * page always prints FROM THE RECORD where the record holds them (a stress card, a tension, a graded row, the rung), so the census
 * counts that side as standing wherever its atom holds on the final record; `said`: for a side that pool lines ASSERT in words,
 * the words (a regular expression's source, case-insensitive) that the walker reads; `why`, one plain line; `source`, where the
 * pair was measured (`docs/chair/2026-11-27/eleventh/survey/measure/E-clashes.md`, rows 10 to 14 only: no row the measure classed
 * ARTEFACT or SOFT) or ruled.
 *
 * DATA ONLY: no logic, no import of a reader.
 */

/** @typedef {'a'|'b'} Side */
/**
 * @typedef {object} ClaimExclusion
 * @property {string} id
 * @property {'presence'|'band'|'crisis'} [generic]
 * @property {string} [a] @property {string} [b]
 * @property {ReadonlyArray<Side>} [recorded]
 * @property {Readonly<Partial<Record<Side, string>>>} [said]
 * @property {string} why
 * @property {string} source
 */

/** @type {ReadonlyArray<Readonly<ClaimExclusion>>} */
export const CLAIM_EXCLUSIONS = Object.freeze([
  // ── THE GENERIC ROWS: one row a shape, never a row a pair ──
  Object.freeze({ id: 'presence', generic: 'presence', why: 'A thing stands or it does not: a line that needs X cannot stand beside a line that says there is no X.', source: 'E-clashes, the declared-excludes rows (72 atoms with lines on both sides); E row 14 is its instance' }),
  Object.freeze({ id: 'band', generic: 'band', why: 'A ladder has one rung at a time: two lines whose rungs of one dimension do not meet cannot both be true.', source: 'E-clashes, the band rows; E row 13 is its instance' }),
  Object.freeze({ id: 'crisis', generic: 'crisis', why: 'A crisis is in force or it is not: a line drawn on that crisis cannot stand beside a line that says it is absent.', source: 'the crisis dimension (factVocabulary.js); point 122 B1 is its instance' }),

  // ── S-B's two atoms against the claims they rule out ──
  Object.freeze({ id: 'place debt', a: 'place debt', b: 'no place debt', recorded: Object.freeze(/** @type {const} */ (['a'])),
    said: Object.freeze({ b: 'pays its (own )?way|purse closes every year ahead|money laid by|put things by|owes no(body| one)' }),
    why: 'Where the page says the place owes a debt now, no line may say it pays its way, has money laid by or owes no one.',
    source: 'E-clashes rows 11 and 12 (27 and 18 owner pages on 682667fe2); SURVEY S-B, RULING S-B-1' }),
  Object.freeze({ id: 'nothing laid by', a: 'nothing laid by', b: 'no nothing laid by', recorded: Object.freeze(/** @type {const} */ (['a'])),
    said: Object.freeze({ a: 'nothing laid by|would have to borrow', b: 'money laid by|put things by|a little in hand' }),
    why: 'Where the Economic Survival row reads Weak or Critical (nothing laid by), no line may say there is money laid by.',
    source: 'E-clashes row 10 (76 owner pages on 682667fe2); SURVEY S-B, RULING S-B-1' }),
  Object.freeze({ id: 'the indebted crisis is a place debt', a: 'crisis: indebted', b: 'no place debt', recorded: Object.freeze(/** @type {const} */ (['a'])),
    why: 'The indebted crisis is the place owing more than it can repay: a line that says the place owes no one cannot stand beside it.',
    source: 'SURVEY S-B: one of `place debt`\'s own sources (`solvencyShown.js :: owesDebtShown`); E-clashes "the indebted crisis never meets a solvency line"' }),

  // ── the late writes of the measure ──
  Object.freeze({ id: 'prosperity', a: 'prosperity: ≤ poor', b: 'prosperity: ≥ moderate', recorded: Object.freeze(/** @type {const} */ (['a', 'b'])),
    why: 'A place whose coin runs short is not one the page calls moderate, comfortable or better.',
    source: 'E-clashes row 13 (23 owner pages on 682667fe2: the safety line drawn at birth before the rung settled)' }),
  Object.freeze({ id: 'guild', a: 'guild', b: 'no guild',
    why: 'A hook about the guilds cannot stand beside a market that no guild keeps.',
    source: 'E-clashes row 14 (6 owner pages on 682667fe2: the guild hook drawn at birth, the guild gone by the stamp)' }),

  // ── each crisis in force against "that crisis is coming" (point 122, unit B1: the imminent lines of Daily Life's recent changes) ──
  Object.freeze({ id: 'plague in force / plague coming', a: 'crisis: plague_onset', b: 'no crisis: plague_onset', recorded: Object.freeze(/** @type {const} */ (['a'])),
    why: 'Sickness that is close to breaking out cannot be said where the plague is already in force.', source: 'point 122 B1 (R4): recentChanges threat.plague imminent T0, T1, T2' }),
  Object.freeze({ id: 'famine in force / famine coming', a: 'crisis: famine', b: 'no crisis: famine', recorded: Object.freeze(/** @type {const} */ (['a'])),
    why: 'Food close to running out cannot be said where the famine is already in force.', source: 'point 122 B1 (R4): recentChanges threat.famine imminent T0, T1' }),
  Object.freeze({ id: 'siege in force / siege coming', a: 'crisis: under_siege', b: 'no crisis: under_siege', recorded: Object.freeze(/** @type {const} */ (['a'])),
    why: 'A siege that is expected cannot be said where the siege already holds the place.', source: 'point 122 B1 (R4): recentChanges threat.siege imminent T0, T1' }),
  Object.freeze({ id: 'beasts in force / beasts coming', a: 'crisis: monster_pressure', b: 'no crisis: monster_pressure', recorded: Object.freeze(/** @type {const} */ (['a'])),
    why: 'Beasts pressing closer cannot be said as news where the monster pressure is already the crisis in force.', source: 'point 122 B1 (R4): recentChanges threat.monster imminent T0, T1 (three branches)' }),
]);
