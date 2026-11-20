/**
 * data/crisis/stakeReasonLines.js — THE STAKE REASONS (rule 11 of `domain/crisis/crisisCast.js :: deriveStakes`), their
 * one home (FRAME-7 · SR1; `docs/chair/2026-11-20/content/frame7/SR1-PROPOSAL.md`, approved by the chair at 20:04 UTC
 * with four cures, each point vetoable by the owner). A pure leaf of the data layer: no import, no draw.
 *
 * `STAKE_REASONS` is every reason's text as a record holds it BEFORE SR1, byte for byte, moved here from `crisisCast.js`
 * (which re-exports it, so its readers and pins import it unchanged). Every key but `loses` and `split` keeps its one
 * text (their agreement is SR2's).
 *
 * `STAKE_REASON_LINES` holds the wordings a NEW birth draws for `loses` and `split`, each in its AGREEMENT FORM
 * (`{power|one|many}`, filled by the names lane's one helper, `data/people/powerSentenceName.js :: fillAgreement`, with
 * the stake's own power). A `loses` wording sits under the system whose loss it says (the stake's matched system: the
 * first of the kind's affected systems whose base the power is); that pool is its `needs`. It is not a fact atom: the
 * system and the crisis kind are no cards of the share veil, and a pool's line names no hideable fact (no member's house,
 * no power's description). No wording repeats the cast's brunt line for its system (`CAST_REASONS.bruntBase`), and none
 * says "the town". A system with no pool here says the pre-SR1 line in its agreement form (`LOSES_FALLBACK`).
 * The pick is `crisisCast.js`'s: a keyed hash over the record's own identity (the seed, the crisis kind, the power's
 * name), resolved through `domain/facts/drawDeclared.js :: drawDeclared`. A saved town keeps its stored sentence.
 *
 * `stakeReasonKey(reason)` is the CLOSED reverse map: every text a stake row can hold (each wording in both numbers;
 * every pre-SR1 literal, "their own people feel the crisis first" included) to its key, else null. A reader that asks
 * what a stake row IS (`crisisCast.js :: bruntCandidates`, `crisisPage.js :: stakeShown`) compares that key, never a
 * sentence.
 * @enforced-by tests/domain/crisis/stakeReasonLines.test.js
 */

/** The stake reasons as a record holds them before SR1 (rule 11): the literal set. */
export const STAKE_REASONS = Object.freeze({
  gainsVacuum: 'the military gains in a vacuum of governance',
  gainsChurch: 'the church gains while the seat struggles',
  gainsMerchants: 'the merchants gain while the seat is endorsed',
  gainsCrime: 'crime gains from the disorder',
  gainsRival: 'already carries more weight than whoever holds the seat', // SW-6 (B3 C4): R3's fact, without the echo of "gains"
  gainsClaim: 'a rival claim to govern gains by it',
  gainsHolds: 'holds what the crisis makes scarce',
  gainsOccupier: 'the occupier gains by it',
  loses: 'its own people feel the crisis first', // SW-6 (B3 C4): "its base" was the rule's word
  losesSeat: 'the seat bears the blame',
  split: 'gains and loses by it at once',
  untouched: 'it could side with either camp', // SW-6 (B3 A·C4): the page's label says "no stake yet"
  leadsRevolt: 'it leads the revolt, and rises or falls with it', // TAIL-CRISIS-5 (K22): the power the revolt raised (RAISED_TO_LEAD)
  // TAIL-CRISIS-6 (K24): the powers a crisis raises, each its stake by its own record (RAISED_BY_CRISIS)
  holdsFood: 'it holds what is left of the food stores',
  chargedWithSickness: 'it holds the emergency powers against the sickness',
  leadsInquiry: 'it leads the inquiry into the betrayal',
  // TAIL-CRISIS-6 (K25 (a)): K24's law carried to every party a crisis raises, and every power a crisis writes into
  claimsToGovern: 'it claims the right to govern by other means',
  courted: 'both sides are courting it, for a price',
  creditorAgent: 'it speaks for the creditor the town owes',
  holdsDebt: "its houses hold the crown's debt",
  infiltrator: 'it is the outside interest with its own people placed here',
  claimsSuccession: 'it presses its own claim to the succession',
  leadsChallenge: 'it leads the challenge to the government',
  speaksForNewcomers: 'it speaks for the newcomers',
  aidsRevolt: 'it has been aiding the revolt in secret',
  guildsThreatened: 'newcomers working outside the guilds threaten its hold on the trades',
  claimantsNeedIt: 'every claimant needs its backing',
  warNeedsIt: 'the call-up and the grieving have made it indispensable',
  warDivides: 'contracts have made some of it rich while others have lost their trade routes',
  revoltCutsLabour: 'the revolt has cut into its labour and its trade',
  warCostsIt: 'trade disruption and requisitions are costing it',
  someHoldDebt: "some of its houses hold the crown's debt",
  termsWithOccupier: 'some of its families have made private terms with the new authority',
  pressedToJudge: 'both sides press it to call the revolt just or sacrilegious',
});

// ── `loses`, by the matched system (the share is of the 543 CRISIS rows whose loss matched it; SR0 §2) ──────────────────

/** public_legitimacy, by governing (235 rows, 43%); wording 3 is the chair's cure 1. @type {ReadonlyArray<string>} */
const LOSES_LEGITIMACY = Object.freeze([
  '{power|it governs|they govern}, and the crisis is laid at {power|its|their} door',
  '{power|its|their} right to rule is what the crisis puts to the test',
  'people look to {power|it|them} first for an answer',
  'every day the crisis lasts is counted against {power|it|them}',
]);

/** defense_readiness (94, 17%); wording 2 is the chair's cure 2. @type {ReadonlyArray<string>} */
const LOSES_DEFENCE = Object.freeze([
  '{power|its|their} people are the ones sent to hold the line',
  '{power|it has|they have} to find the hands to keep watch',
  'the danger lands first on those {power|it arms|they arm}',
]);

/** trade_connectivity (86, 16%); wording 3 is the chair's cure 3. @type {ReadonlyArray<string>} */
const LOSES_TRADE = Object.freeze([
  '{power|its|their} trade is the first thing the crisis cuts',
  '{power|its|their} goods sit unsold while this lasts',
  '{power|it lives|they live} by trade, and trade is what suffers',
]);

/** social_trust (64, 12%). @type {ReadonlyArray<string>} */
const LOSES_TRUST = Object.freeze([
  '{power|it holds|they hold} people together, and that is what the crisis frays',
  'the neighbours {power|it speaks|they speak} for have stopped trusting each other',
]);

/** tax_revenue, by governing (48, 9%). @type {ReadonlyArray<string>} */
const LOSES_REVENUE = Object.freeze([
  '{power|its|their} coffers empty while the crisis drags on',
  '{power|it cannot|they cannot} collect what {power|it is|they are} owed while this lasts',
]);

/** law_order (12, 2%). @type {ReadonlyArray<string>} */
const LOSES_ORDER = Object.freeze([
  'the disorder falls on those who keep the peace',
  '{power|its|their} people are stretched thin keeping order',
]);

/**
 * The `loses` wordings by matched system. healing_capacity (4, 1%) is the chair's cure 4; food_security, labor_capacity,
 * housing_pressure and faction_stability (0 born) have one wording each, in the same voice.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
const LOSES_BY_SYSTEM = Object.freeze({
  public_legitimacy: LOSES_LEGITIMACY,
  defense_readiness: LOSES_DEFENCE,
  trade_connectivity: LOSES_TRADE,
  social_trust: LOSES_TRUST,
  tax_revenue: LOSES_REVENUE,
  law_order: LOSES_ORDER,
  healing_capacity: Object.freeze(['the hurt and the sick are brought to {power|it|them} first']),
  food_security: Object.freeze(['{power|its|their} people go hungry first']),
  labor_capacity: Object.freeze(['{power|its|their} people are worked hardest']),
  housing_pressure: Object.freeze(['{power|its|their} people take in those with nowhere to go']),
  faction_stability: Object.freeze(['{power|its|their} own ranks start to quarrel']),
});

/**
 * A matched system with no pool above: the pre-SR1 line in its agreement form (C2b(b)'s, byte for byte when filled),
 * composed from its one home (COMMON-RULES rule 2: a literal has one home; FRAME-8, the chair's ruling of 22:23 UTC).
 */
export const LOSES_FALLBACK = Object.freeze([`{power|its|their}${STAKE_REASONS.loses.slice('its'.length)}`]);

/** `split`: the power gains and loses at once ("it" is the crisis). No `needs`. @type {ReadonlyArray<string>} */
const SPLIT_LINES = Object.freeze([
  STAKE_REASONS.split, // the pre-SR1 line, by reference (COMMON-RULES rule 2: a literal has one home)
  '{power|stands|stand} to win by it and to lose by it alike',
  '{power|has|have} as much to gain from it as to lose',
]);

/** The pools a new birth draws `loses` and `split` from. */
export const STAKE_REASON_LINES = Object.freeze({ loses: LOSES_BY_SYSTEM, split: SPLIT_LINES });

/**
 * A wording in one number: each `{power|one|many}` read as `one` or as `many`. It enumerates the two forms a row can
 * hold; it chooses no number (the fill is `fillAgreement`'s, by the stake's own power).
 * @param {string} form @param {boolean} many @returns {string}
 */
const inNumber = (form, many) => form.replace(/\{power\|([^|{}]*)\|([^|{}]*)\}/g, (_m, one, more) => (many ? more : one));

/** Every text a stake row can hold, to its key: the pre-SR1 literals, then each wording in both numbers. */
const KEY_OF_TEXT = (() => {
  /** @type {Map<string, string>} */
  const out = new Map(Object.entries(STAKE_REASONS).map(([key, text]) => [text, key]));
  /** @param {string} key @param {ReadonlyArray<string>} forms */
  const add = (key, forms) => { for (const f of forms) for (const many of [false, true]) out.set(inNumber(f, many), key); };
  for (const forms of Object.values(LOSES_BY_SYSTEM)) add('loses', forms);
  add('loses', LOSES_FALLBACK);
  add('split', SPLIT_LINES);
  return out;
})();

/**
 * What a stake row's reason IS: its key in `STAKE_REASONS` ('loses', 'split', 'untouched', …), read from the closed set of
 * every text a row can hold; null for a text that is none of them (a DM's own words).
 * @param {unknown} reason @returns {string | null}
 */
export function stakeReasonKey(reason) {
  return typeof reason === 'string' ? KEY_OF_TEXT.get(reason) ?? null : null;
}
