/**
 * data/dailyLife/commonerResentments.js — THE PUBLIC `commoner_resentments` POOLS (DAILY-1 `lines/L2/LINES-2.md` § 2,
 * revised by `lines/L2/LINES-2b.md` § 5, as the chair ruled: 18:26 (ruling 6: the crime clauses leave this slot for the
 * owner-only `commoner_resentments_dm`; `corruption_exposed` is dead, nothing written), 18:47 (ruling 14: legitimacy #4
 * needs the legitimacy band critical or collapsed) and 18:56 (ruling 11: every line declared in the vocabulary's own
 * atoms, `facts/factVocabulary.js`)).
 *
 * `COMMONER_RESENTMENTS`: one frozen array a branch. The branches are the grievances the record holds, each said as one
 * whole sentence, in this order: `legitimacy` (`deriveCausalState().bands.public_legitimacy` strained, critical or
 * collapsed, said of the body the record names), `food` (the food band, `capacity.food_production`, strained, critical
 * or collapsed) and `uprising` (a live popular-uprising tension, the vocabulary's `uprising`). THE CALM RULE (ruling 8):
 * a place whose record holds none of the three has no grievance said; LINES-2 writes no calm pool for this slot, so it is
 * the EMPTY string (ruling 3), never "the small grievances of any town". No branch is chosen by a crime fact and no line
 * names a veiled power (ruling 7). A line is `{ id, text, needs }` as in `childWarnings.js`; the id is its number in
 * LINES-2 § 2. `{gov}` is the government's label with its article (`display/powerSentenceName.js ::
 * powerNameWithArticle`, the record's `powerStructure.government`) and `{gov|one|many}` its verb or pronoun in the name's
 * number (`fillAgreement`); a line that says it declares `government named`. "The council" needs a ruling body (`ruling
 * body`); "the price of food", "the stalls" need a market. The deriver (`domain/dailyLife.js ::
 * deriveCommonerResentments`) hands each branch's lines to `facts/drawDeclared.js :: filterDeclared` and picks one by
 * `kernel/proseHash.js :: pickVariantMixed` keyed `<record.name>::dailyLife.commoner_resentments::<branch>`. No line
 * needs a hideable house or a crime atom (`tests/domain/dailyLifeAtoms.test.js`, arm (c)).
 *
 * NOT BUILT (a need with no atom, ruling 10; `dailyLifeAtoms.test.js :: NOT_GRANTED`):
 * - legitimacy #4 "There is open doubt here about whether {gov} {gov|has|have} any right to decide for everyone."
 *   (`legitimacyGrave`: the causal band critical or collapsed has no fact home; the nearest atom, `legitimacy crisis`,
 *   reads another field).
 * A line with no true need is not eligible; each branch keeps the rest.
 *
 * THE CHAIR'S LINES OF B3 L8 (E72 and E82 of 2026-11-22, the brief `briefs/B3-L8-OFFICE-LINES.md`): legitimacy #8 to #11,
 * the four office lines that name the body by its office's own noun, L8 to L11, each on its one `office:` atom (`office:
 * elders`, `office: headman`, `office: mayor`, `office: reeve`: the governing row's form, read through
 * `seat/seatTable.js :: formKindOf` by the lazy leaf `facts/officeForms.js`). The ids are not renumbered: L13 stays L13.
 *
 * L12 RETURNS (WORDS-2 E6; the tenth chair's leave, RULING G9 (3), with D8 ruled at G10), in the shape the chair's E107 ruled
 * when it was cut (DAILY-4 unit (0a)): "The lord's steward is obeyed, but not much liked." needs `sovereign`, `office: lord's
 * steward` and the steward's own house, `house: lord's steward`, answered by `institution: lordsSteward` (a lord's steward
 * presumes a steward's house, not only the office: on four steward thorps the page gave the seat to another officer and no
 * steward's house stood; a thorp's officer is the lord's reeve, so a thorp never prints it).
 *
 * THE CHAIR'S LINE OF B3 F1 (06:17 and E56 of 2026-11-22, `DAILY-3-HANDBACK.md` § 2 items 4 and 5): food #0, today's
 * text, on `grain` and `market` (bread prices need grain in the food record; "merchants who claim" needs a market, M1's
 * false line).
 *
 * THE SAMENESS LINES OF D5C-2 (the chair's E133 (2); `lines/D4C/DRAFT-2.md`,
 * taken 2026-11-22 21:55 UTC): legitimacy L14 and L15; food F9 to F13, F9 as the chair reworded it ("Short rations");
 * each appended at its branch's end, its keyed pick unchanged (`tests/domain/dailyLifeNewLines.test.js`).
 */

/** @typedef {{ readonly id: string, readonly text: string, readonly needs: ReadonlyArray<string> }} ResentmentLine */

/** @param {ReadonlyArray<{ id: string, text: string, needs: string[] }>} lines @returns {ReadonlyArray<ResentmentLine>} */
const frozen = (lines) => Object.freeze(lines.map((l) => Object.freeze({ ...l, needs: Object.freeze([...l.needs]) })));

/** The pools by branch (the grievance the record holds → its lines). */
export const COMMONER_RESENTMENTS = Object.freeze({
  /** public legitimacy strained, critical or collapsed: said of the body the record names. */
  legitimacy: frozen([
    { id: 'L0', text: 'Commoners resent the council\'s indifference to ordinary complaints.', needs: ['ruling body'] },
    { id: 'L1', text: 'Many here feel that {gov} no longer listens to people like them.', needs: ['government named'] },
    { id: 'L2', text: 'Ordinary people grumble that {gov} {gov|looks|look} after {gov|its|their} own first.', needs: ['government named'] },
    { id: 'L3', text: 'People bring their complaints to {gov} and expect little to come of them.', needs: ['government named'] },
    { id: 'L5', text: 'People do as {gov} {gov|says|say}, but few of them think well of {gov|it|them}.', needs: ['government named'] },
    { id: 'L6', text: 'Few here would say that {gov} {gov|speaks|speak} for them.', needs: ['government named'] },
    { id: 'L7', text: 'Talk among neighbours turns, sooner or later, to what {gov} {gov|has|have} got wrong lately.', needs: ['government named'] },
    { id: 'L8', text: 'Common folk say the elders decide among themselves and tell everyone else afterwards.', needs: ['office: elders'] },
    { id: 'L9', text: 'People grumble that the headman listens to friends first and everyone else last.', needs: ['office: headman'] },
    { id: 'L10', text: 'The mayor is blamed for most of what goes wrong, fairly or not.', needs: ['office: mayor'] },
    { id: 'L11', text: 'People say the reeve they chose has forgotten who chose them.', needs: ['office: reeve'] },
    { id: 'L12', text: 'The lord\'s steward is obeyed, but not much liked.', needs: ['sovereign', "office: lord's steward", 'institution: lordsSteward'] },
    { id: 'L13', text: 'People say the council is slow to listen and quick to decide without them.', needs: ['ruling body'] },
    { id: 'L14', text: 'There is little trust here that {gov} will do right by ordinary people.', needs: ['government named'] },
    { id: 'L15', text: 'People put up with {gov}, but they expect little of {gov|it|them}.', needs: ['government named'] },
  ]),
  /** the food band strained, critical or collapsed. */
  food: frozen([
    { id: 'F0', text: 'Commoners resent rising bread prices and merchants who claim they cannot help it.', needs: ['grain', 'market'] },
    { id: 'F1', text: 'People grumble that there is less food to go round than there ought to be.', needs: [] },
    { id: 'F2', text: 'Many feel that those in charge should be doing more to see everyone fed.', needs: [] },
    { id: 'F3', text: 'Households that go short look hard at the ones that do not.', needs: [] },
    { id: 'F4', text: 'Thin meals and short portions are the grievance nearly everyone shares.', needs: [] },
    { id: 'F5', text: 'Nobody likes to see the pot so thin, and everyone has someone to blame for it.', needs: [] },
    { id: 'F6', text: 'The price of food is the first complaint on everyone\'s lips.', needs: ['market'] },
    { id: 'F7', text: 'People resent paying more for less, and they say so at the stalls.', needs: ['market'] },
    { id: 'F8', text: 'People ask why {gov} cannot do more about the price of food.', needs: ['government named', 'market'] },
    { id: 'F9', text: 'Short rations are the talk of every household, and patience is wearing thin.', needs: [] },
    { id: 'F10', text: 'There is grumbling in every kitchen about how little there is to put on the table.', needs: [] },
    { id: 'F11', text: 'People complain that a day\'s work does not buy a day\'s food.', needs: ['market'] },
    { id: 'F12', text: 'Going short at table is the complaint heard most often here.', needs: [] },
    { id: 'F13', text: 'Many households are eating less than they would like, and they say so.', needs: [] },
  ]),
  /** a live popular-uprising tension (`facts/uprising.js`): the common people pressing those in charge. */
  uprising: frozen([
    { id: 'U0', text: 'Working people are pressing {gov} for a fairer deal, and they do not keep quiet about it.', needs: ['government named'] },
    { id: 'U1', text: 'The common people have demands of {gov}, and they want them heard.', needs: ['government named'] },
    { id: 'U2', text: 'Many here feel they have asked {gov} for fair treatment for long enough.', needs: ['government named'] },
  ]),
});

/**
 * THE DECLARATION (D4C-1, the chair's E133 (1)), one a BRANCH (every line of a branch does the same): what the branch's
 * line DOES on the page. `{ states: '<condition key>' }` it states a condition (the key as D4C's measure, table 1,
 * names it: `threat:<kind>`, `food:want`, `defence:want`, …); `{ consequence: true }` it says what a condition makes
 * people do, or the quiet as they live it; `{ names: true }` it only names a house or a place. `domain/dailyLife.js`
 * reads the declaration, never the line's words: the outsider line yields a part whose condition another printed slot
 * states (`tests/domain/dailyLifeNoRepeat.test.js`).
 */
/** Every grievance is a consequence (what the record's want makes people say). */
export const COMMONER_RESENTMENTS_DOES = Object.freeze(Object.fromEntries(Object.keys(COMMONER_RESENTMENTS).map((b) => [b, Object.freeze({ consequence: true })])));
