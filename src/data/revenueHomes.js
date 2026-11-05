/**
 * data/revenueHomes.js — WHERE A REVENUE THAT LEFT THE TRADE LISTS IS PRINTED (CENSUS-3c; the
 * chair's ruling R-P 2, 2026-11-05).
 *
 * `tradeListDeclarations.js :: NOT_A_GOOD` takes revenues, fees and services off the export and
 * import lists (a toll is income, not a good shipped). R-P 2: the income table prints, as a DISPLAY
 * read model, the revenue the record already holds — a toll needs the route and the gate the record
 * has — and a revenue with no fact behind it leaves the page and is listed under "needs a home".
 * Pages move; records do not.
 *
 * Each home is a declared line (`{ text, needs?, excludes? }`, the census vocabulary): `text` is the
 * label the income table prints; `labels` are the list spellings it answers (case-folded, the mark
 * stripped); `family` are the income rows that already speak for it, so a record that carries one
 * prints nothing more. A NOT_A_GOOD label in no home is not printed anywhere: the lane doc lists
 * those under "needs a home" (no atom: legal, banking, minting, tourism, planar access) or "not a
 * revenue" (an import of a service; a strategic or political quality; a food need).
 *
 * Pure data.
 */

/**
 * @typedef {{ text: string, desc: string, labels: ReadonlyArray<string>, family: ReadonlyArray<string>,
 *   needs?: ReadonlyArray<string>, excludes?: ReadonlyArray<string> }} RevenueHome
 */

/** @type {ReadonlyArray<RevenueHome>} */
export const REVENUE_HOMES = Object.freeze([
  Object.freeze({
    text: 'Tolls', desc: 'taken at the gate on the road traffic.',
    labels: Object.freeze(['Toll revenue', 'Toll income', 'Trade access fees']),
    family: Object.freeze(['Toll Revenue', 'Gate Tolls', 'River Tolls', 'Port Duties']),
    needs: Object.freeze(['gate']), excludes: Object.freeze(['route: isolated']),
  }),
  Object.freeze({
    text: 'Transit trade', desc: 'goods passing through on the route, handled here on their way elsewhere.',
    labels: Object.freeze(['Transit trade', 'Pass transit trade', 'Transit trade profit', 'Overland freight revenue']),
    family: Object.freeze(['Entrepôt Trade', 'Toll Revenue', 'Gate Tolls', 'River Tolls', 'Port Duties']),
    excludes: Object.freeze(['route: isolated']),
  }),
  Object.freeze({
    text: 'Market taxes', desc: 'levied on the stalls of the market.',
    labels: Object.freeze(['Market taxes']),
    family: Object.freeze(['Market Taxes']),
    needs: Object.freeze(['market']),
  }),
  Object.freeze({
    text: 'Medical care', desc: 'paid for at the hospital by those who come to it.',
    labels: Object.freeze(['Advanced medical care']),
    family: Object.freeze([]),
    needs: Object.freeze(['hospital']),
  }),
]);
