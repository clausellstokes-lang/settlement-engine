/**
 * domain/facts/officeForms.js — THE OFFICE A PLACE IS GOVERNED BY (DAILY-3 B3 L8; the chair's E72 and E82 of 2026-11-22,
 * on the measure `docs/chair/2026-11-20/content/daily/measures/OFFICE`; `docs/DESIGN_POOL_CENSUS.md` §1: ONE FACT, ONE
 * HOME). A LAZY leaf, named in the `factsOf` getter `office` (its layer row in `factLayers.js`, its pin in
 * `vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN`); the vocabulary's `office: <key>` reads it there.
 *
 *   officesOf(record)   key -> does the office hold: the governing ROW's form (`rulingPower.js ::
 *                       nameOf(governingFactionOf(record))`, the read `seat/holderOfSeat.js :: holderOf` makes) is one of
 *                       the key's forms, its row read through `seat/seatTable.js :: formKindOf` (which reads the
 *                       transfer's "<form> Ascendant" as its form). NEVER `powerStructure.government`, never a name test
 *                       on a label (ruling 10): a form is a KEY of the table, matched whole.
 *
 * FAIL CLOSED: no governing row, or one stamped `hidden: true` (a shared read drops such a row), and every office is
 * false. The office, not the holder: the seat law's dial (dark or lit) moves the holder, never the form.
 *
 * THE MAP (frozen, the chair's E82 item 1): each form a key of its row in `SEAT_TABLE` (row `government`; row `noble`
 * for the steward, Feudal Stewardship and NOT Feudal Appointee); `tests/domain/dailyLifeOffice.test.js` pins each.
 *
 * Layer 3 (over the powers). Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/dailyLifeOffice.test.js
 */
import { governingFactionOf, nameOf } from '../rulingPower.js';
import { formKindOf } from '../seat/seatTable.js';

/** @typedef {{ readonly row: string, readonly forms: ReadonlyArray<string> }} OfficeRow */

/** @param {string} row @param {string[]} forms @returns {OfficeRow} */
const office = (row, forms) => Object.freeze({ row, forms: Object.freeze(forms) });

/**
 * key -> the row of `SEAT_TABLE` and the forms (its keys) that hold the office.
 * @type {Readonly<Record<string, OfficeRow>>}
 */
export const OFFICE_FORMS = Object.freeze({
  elders: office('government', ['Elder Council', 'Free Elder Council', 'Elder Consensus', 'Household Council']),
  headman: office('government', ["Headman's Authority"]),
  mayor: office('government', ['Town Mayor']),
  reeve: office('government', ['Elected Reeve']),
  "lord's steward": office('noble', ['Feudal Stewardship']),
});

/** The office keys, in the map's order (the vocabulary's `office` keys). */
export const OFFICE_KEYS = Object.freeze(Object.keys(OFFICE_FORMS));

/** A form's own name, without the transfer's " Ascendant" (as `seatTable.js :: bareForm` reads it). @param {string} form */
const bareForm = (form) => form.replace(/ Ascendant$/, '');

/**
 * THE ONE READER: key -> does the office hold (all false where no unhidden governing row stands).
 * @param {unknown} record a settlement record, or its shared document
 * @returns {Readonly<Record<string, boolean>>}
 */
export function officesOf(record) {
  const g = governingFactionOf(/** @type {Parameters<typeof governingFactionOf>[0]} */ (record && typeof record === 'object' ? record : null));
  const form = g && /** @type {{ hidden?: unknown }} */ (g).hidden !== true ? nameOf(g) : '';
  const kind = form ? formKindOf(form) : null;
  const bare = form ? bareForm(form) : '';
  return Object.freeze(Object.fromEntries(OFFICE_KEYS.map((k) => [k, kind !== null && kind === OFFICE_FORMS[k].row && OFFICE_FORMS[k].forms.includes(bare)])));
}
