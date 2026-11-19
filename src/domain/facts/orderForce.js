/**
 * domain/facts/orderForce.js — THE FORCE THAT KEEPS ORDER, ONCE (BAR6-CRIME, LAW 9's `9a.watch`, `9a.militia`, `9a.pay` and
 * LAW 6's `6d-paid` of BRIEF-BAR6 (d) and (h); the wide read's C200637 C187260 C199950 C51048 C203044; vetoable by the owner).
 *
 * The safety profile's lines are drawn at the economy step, before the roster settles (`lawBand.js`'s header says why), and
 * each read the force its own way: "exists on paper" by the military score and the purse; "is present and responsive" by
 * the first force the flags name; "well paid" by the funded gate; "present and paid" by the same gate. The page beside them
 * prints the force's own card (a household rota that walks the lanes; a militia "absent during routine crime"; a commander
 * whose own line says the pay of those keeping order is cut). THIS LEAF says what the finished record holds of that force,
 * and every such line reads it where it prints (`display/guardLineUnderTheLaw.js`; `display/defenseDisplay.js ::
 * deriveDefenseVulnerabilities`); the vocabulary's `force` atom reads it too (`factVocabulary.js`), so a desk line can
 * declare it. It does not redraw `guardEffectivenessDesc`: the stored line stays as drawn.
 *
 *   kept        — a garrison, a watch or a militia stands on the live roster;
 *   volunteers  — kept, and no one of it is paid: no garrison and no mercenaries, and the only watch (if any) is the
 *                 village's unpaid rota (`guardPay.js :: watchIsUnpaidRota`) or there is a militia alone;
 *   paid        — a garrison, a paid watch or a hired company stands (`defence.js`'s reading of a paid force) and the town
 *                 is not held by its unpaid rota alone;
 *   pay         — `guardPay.js :: guardPayOf` ('full' | 'short' | 'unpaid' | null), the pay's one home;
 *   payCut      — a person under arms on the cast carries the hard-times condition whose own line says the pay of those
 *                 keeping order is cut ("the pay for stopping it shrinks": `npcStructure.js`, military × economic_stress);
 *   houses      — the force's rows on the live roster (garrison, watch, militia), for a reader that reads their marks.
 *
 * No display import, on purpose: `factsOf` reads this leaf (the cycle `lawBand.js`'s header names). Pure: no draw, no clock,
 * no write.
 */
import { partitionDefenseInstitutions } from '../institutions/defenseInstitutionBuckets.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { guardPayOf, watchIsUnpaidRota } from './guardPay.js';

/**
 * @typedef {object} OrderForce
 * @property {boolean} kept @property {boolean} volunteers @property {boolean} paid @property {boolean} payCut
 * @property {'full'|'short'|'unpaid'|null} pay
 * @property {ReadonlyArray<Record<string, unknown>>} houses
 * @property {{ garrison: number, watch: number, militia: number, mercenary: number }} count
 */

/** @param {unknown} v @returns {Array<Record<string, unknown>>} */
const rows = (v) => (Array.isArray(v) ? v.filter((x) => x && typeof x === 'object') : []);

/**
 * THE ONE READER of the force that keeps order.
 * @param {unknown} record the settlement
 * @returns {Readonly<OrderForce>}
 */
export function orderForceOf(record) {
  const live = /** @type {Array<Record<string, unknown>>} */ (liveInstitutions(/** @type {never} */ (record)) || []);
  const b = /** @type {Record<string, Array<Record<string, unknown>>>} */ (/** @type {unknown} */ (partitionDefenseInstitutions(/** @type {never} */ (live))));
  const garrison = rows(b.garrison); const watch = rows(b.watch); const militia = rows(b.militia); const mercenary = rows(b.mercenary);
  const kept = garrison.length + watch.length + militia.length > 0;
  const rota = watchIsUnpaidRota(/** @type {never} */ (live));
  const paid = garrison.length > 0 || mercenary.length > 0 || (watch.length > 0 && !rota);
  const npcs = rows(/** @type {{ npcs?: unknown } | null} */ (record)?.npcs);
  return Object.freeze({
    kept,
    volunteers: kept && !paid,
    paid,
    pay: guardPayOf(/** @type {never} */ (record)),
    payCut: npcs.some((n) => n.category === 'military' && n.settlementCondition === 'economic_stress'),
    houses: Object.freeze([...garrison, ...watch, ...militia]),
    count: Object.freeze({ garrison: garrison.length, watch: watch.length, militia: militia.length, mercenary: mercenary.length }),
  });
}
