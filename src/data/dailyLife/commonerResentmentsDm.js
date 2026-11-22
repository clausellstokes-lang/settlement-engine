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
 * `kernel/proseHash.js :: pickVariantMixed` keyed `<record.name>::dailyLife.commoner_resentments_dm::<branch>`.
 * No line needs a hideable house or a crime atom (`tests/domain/dailyLifeAtoms.test.js`, arm (c)); the branch itself is
 * the crime fact, and it is read on the owner's audience alone (`tests/domain/dailyLifeOwnerSlot.test.js`).
 *
 * NOT BUILT (a need with no atom, ruling 11; `dailyLifeAtoms.test.js :: NOT_GRANTED` `smuggling`): crime55 #0 to #3 of
 * LINES-2b § 6, the four lines that say smugglers. Each needs smuggling in the record, and no fact home answers it: the
 * crime structure's key (`facts/criminalStructureKey.js`) folds a smuggling house into `semi-organized` with a black
 * market and a gambling den, and the criminal-income home (`facts/criminalIncome.js`) reads any criminal revenue. A line
 * with no true need is not eligible, so the branch keeps the chair's three.
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
  /** criminal opportunity >= 55 and below 70: wrongdoing pays (the chair's three of 18:47). */
  crime55: frozen([
    { id: 'K55_4', text: 'People grumble that those who break the rules do better here than those who keep them.', needs: [] },
    { id: 'K55_5', text: 'Honest folk say that crime pays better here than work.', needs: [] },
    { id: 'K55_6', text: 'People resent how little is done about wrongdoing that everyone knows of.', needs: [] },
  ]),
});
