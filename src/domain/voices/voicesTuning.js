/**
 * domain/voices/voicesTuning.js — THE VOICES' TUNING (S-G1; the owner's sixth message: "randomly, not everything needs a
 * quote"; the design's §4 and VOICES-CARDS' C-weight; the chair's ruling E28 point 2).
 *
 * ⛔ EVERY VALUE HERE IS A TUNING VALUE, THE OWNER'S TO SIGN. They are VOICES-CARDS' proposals as the chair ruled them
 * (the odds and the size factor of the charter's starting point; the tab budget of F's first question; the caps of the
 * design), written here so the engine runs; none is signed. Its row in the declared tuning register
 * (`tests/lint/.tuning-register.json`, the pen's) is NAMED for the owner and not written by this seat.
 *
 *   odds        how often a card speaks, by its weight (`cardsOf.js :: WEIGHTY`): about three in four of the weightiest,
 *               about one in four of the lesser
 *   sizeFactor  small places quieter still (a tier not named reads 1)
 *   tabBudget   a tab expects at most this many quotes of each weight: a card's odds are no higher than the budget over
 *               the cards of its weight on the tab
 *   tabCap      the hard cap of quotes on one tab, the weightiest first
 *   personCap   quotes one person may sign on one page
 *
 * Pure data.
 * @enforced-by tests/domain/voices/voicePlan.test.js
 */
export const VOICES_TUNING = Object.freeze({
  odds: Object.freeze({ weighty: 0.75, lesser: 0.25 }),
  sizeFactor: Object.freeze({ thorp: 0.5, hamlet: 0.5, village: 0.75 }),
  tabBudget: Object.freeze({ weighty: 2, lesser: 1 }),
  tabCap: 3,
  personCap: 1,
});
