/**
 * data/dailyLife/commonerResentmentsDm.js — THE OWNER-ONLY `commoner_resentments_dm` POOLS (DAILY-1 `lines/L2/LINES-2.md`
 * § 2b, revised by `lines/L2/LINES-2b.md` § 6, as the chair ruled: 18:26 (ruling 6: the crime clauses leave the public
 * `commoner_resentments` for a slot derived ONLY for the owner), 18:47 (ruling 14: crime55 #4 and #5 replaced by three) and
 * 18:56 (ruling 11: every line declared in the vocabulary's own atoms, `facts/factVocabulary.js`)).
 *
 * `COMMONER_RESENTMENTS_DM`: one frozen array a branch, keyed by today's ladder on
 * `deriveCausalState().scores.criminal_opportunity` (`crime70` at >= 70, else `crime55` at >= 55; below 55 no branch and
 * the slot is the EMPTY string). A line is a whole sentence, `{ id, text, needs }` as in `childWarnings.js`. The deriver
 * (`domain/dailyLife.js :: deriveCommonerResentmentsDm`) runs only when `deriveDailyLife(record, { audience: 'owner' })`
 * is called; it hands the branch's lines to `facts/drawDeclared.js :: filterDeclared` and picks one by
 * `kernel/proseHash.js :: pickRendezvous` keyed `<record.name>::dailyLife.commoner_resentments_dm::<branch>`.
 * No line needs a crime atom (`tests/domain/dailyLifeAtoms.test.js`, arm (c)); the branch itself is the crime fact, and it
 * is read on the owner's audience alone (`tests/domain/dailyLifeOwnerSlot.test.js`).
 *
 * THE CHAIR'S RULING OF B3 F2 (ruling 2 of 06:17 of 2026-11-22 and its word of 08:54): crime55 #0 to #3 of LINES-2b § 6,
 * the four lines that say smugglers, are built VERBATIM as `K55_0` to `K55_3`, each with `house: smuggling` (a smuggling
 * house on the live roster, `facts/causeHouses.js :: causeHouseStands`) beside its other needs as LINES-2b writes them,
 * in the vocabulary's own atoms (`gate`, `route open`, `market`); the income-row half of LINES-2b's "smuggling" is NOT
 * built (the stricter reading: a line that says smugglers prints only where a smuggling house lives). The need is a
 * hideable house, lawful here because this table is derived for the owner alone (`tests/lint/samenessHideable.walker.test.js
 * :: DM_BY_CONSTRUCTION` names it, for the security reader).
 *
 * THE CHAIR'S LINE OF B3 F1 (06:17 of 2026-11-22, `DAILY-3-HANDBACK.md` § 2 item 4): crime70 #4 of LINES-2 § 2b as the
 * chair reworded it ("… the law here bends for anyone who can pay."; the presumption-classes walker read "to spare" as
 * the `plenty` class), with no need.
 */

/** @typedef {{ readonly id: string, readonly text: string, readonly needs: ReadonlyArray<string> }} ResentmentDmLine */

/** @param {ReadonlyArray<{ id: string, text: string, needs: string[] }>} lines @returns {ReadonlyArray<ResentmentDmLine>} */
const frozen = (lines) => Object.freeze(lines.map((l) => Object.freeze({ ...l, needs: Object.freeze([...l.needs]) })));

/** The pools by branch (the deriver's ladder rung → its lines). */
export const COMMONER_RESENTMENTS_DM = Object.freeze({
  /** criminal opportunity >= 70: the law bends ("the watch" only where the record keeps a watch). */
  crime70: frozen([
    { id: 'K70_0', text: 'Commoners resent the watch turning a blind eye to the right pockets.', needs: ['watch'] },
    { id: 'K70_1', text: 'Commoners grumble that the watch looks the other way when the right purse is opened.', needs: ['watch'] },
    { id: 'K70_2', text: 'People resent that those who keep order here seem to see only what suits them.', needs: ['guardPresence'] },
    { id: 'K70_3', text: 'Commoners say that wrongdoing goes unpunished here if the wrongdoer has the right friends.', needs: [] },
    { id: 'K70_4', text: 'Ordinary folk resent that the law here bends for anyone who can pay.', needs: [] },
    { id: 'K70_5', text: 'People grumble that honest folk are pressed hard while lawbreakers with money walk free.', needs: [] },
  ]),
  /** criminal opportunity >= 55 and below 70: smugglers (only where a smuggling house stands; B3 F2) and wrongdoing pays
   * (the chair's three of 18:47). */
  crime55: frozen([
    { id: 'K55_0', text: 'Commoners resent the smugglers who pay no tax while honest carts queue.', needs: ['house: smuggling', 'gate', 'route open'] },
    { id: 'K55_1', text: 'Commoners resent the smugglers who slip goods past while honest traders pay their dues.', needs: ['house: smuggling', 'market'] },
    { id: 'K55_2', text: 'People grumble that smuggled goods undercut honest sellers at the market.', needs: ['house: smuggling', 'market'] },
    { id: 'K55_3', text: 'Honest carriers resent waiting their turn while smugglers come and go as they please.', needs: ['house: smuggling', 'route open'] },
    { id: 'K55_4', text: 'People grumble that those who break the rules do better here than those who keep them.', needs: [] },
    { id: 'K55_5', text: 'Honest folk say that crime pays better here than work.', needs: [] },
    { id: 'K55_6', text: 'People resent how little is done about wrongdoing that everyone knows of.', needs: [] },
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
/** Every owner-only grievance is a consequence, as the public grievances are. */
export const COMMONER_RESENTMENTS_DM_DOES = Object.freeze(Object.fromEntries(Object.keys(COMMONER_RESENTMENTS_DM).map((b) => [b, Object.freeze({ consequence: true })])));
