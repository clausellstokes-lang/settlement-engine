/**
 * domain/display/cardStandingRead.js — A PERSON'S STANDING, READ FROM THE RECORD'S FACTS (PAGE-1 CARD, F4;
 * docs/chair/2026-11-20/content/page/briefs/BUILD.md §CARD, on the chair's order of 11:15, 2026-11-20).
 *
 * ⛔ NEVER THE STORED `influence`. That band is a keyword match on the pool row's role (npcGenerator.js:59-76), misread at
 * birth: 88.6% of the chair's 300 towns' cards carried "low", a third of the firsts of a power and every thorp elder
 * among them (measures/C/f4.out.txt §1-§4). It is PAGE-2's to cure at birth; no surface prints it.
 *
 * THE FACT, instead: the powers the card stands FIRST of (`memberships[].rank === 1`, the card line's "first of X") and
 * each one's weight HERE, read from the record's own figure for that power (`powerStructure.factions[].power`, the final
 * share the Power tab orders its roster by): its place among the town's powers that carry a figure. A card in no power,
 * or first of none, has no line; a power the record holds no figure for has no weight (never a new fact).
 *
 * ON A SERVED PAGE (PAGE-4 CARD-SERVED, the chair's condition (1) of 14:17 UTC, 2026-11-20): a power the document in hand
 * HOLDS with no figure (a served page may withhold raw measures) is still the card's fact, printed "first of <power>" WITH
 * NO WEIGHT, and is not counted in the ranking; a power the card's membership names that the document's roster does NOT
 * hold (a withheld power) is FAIL CLOSED: never named here.
 *
 * ONE READER for every surface that printed the band (the people card, the PDF's person card, the Foundry journal).
 * Pure, draw-free, total over any input; reads only what the record passed in holds (a public projection's powers are
 * its own, so a hidden power is neither counted nor named).
 */
import { cardPowerParts, powersOf, powerNameOf, powerNamesOf, powerOrderOf } from '../people/cardPowers.js';

/** The ordinal words of the three strongest places. */
const ORDINAL = Object.freeze(/** @type {Record<number, string>} */ ({ 1: '', 2: 'second ', 3: 'third ' }));

/**
 * THE WEIGHT OF A POWER HERE: its place among the town's powers by their own figures, in a DM's words; null where the
 * record holds no such power or no figure for it.
 * @param {unknown} settlement @param {string} powerName @returns {string | null}
 */
export function powerWeightHere(settlement, powerName) {
  const rows = powersOf(settlement)
    .map((f) => ({ name: powerNameOf(f), v: typeof f.power === 'number' ? f.power : Number.NaN }))
    .filter((r) => r.name && Number.isFinite(r.v));
  const me = rows.find((r) => r.name === String(powerName || ''));
  if (!me) return null;
  const above = rows.filter((r) => r.v > me.v).length;
  const below = rows.filter((r) => r.v < me.v).length;
  const tie = rows.some((r) => r !== me && r.v === me.v);
  if (rows.length === 1) return 'the only power here';
  if (rows.length === 2) {
    if (tie) return 'as strong as the other power here';
    return above ? 'the weaker power here' : 'the stronger power here';
  }
  const joint = tie ? 'joint ' : '';
  if (above < 3) return `the ${joint}${ORDINAL[above + 1]}strongest power here`;
  if (below === 0) return `the ${joint}weakest power here`;
  return 'one of the lesser powers here';
}

/**
 * The powers the card stands first of, each with its weight here, in the card line's own order (cardPowers.js ::
 * cardPowerParts over the town's power order). FAIL CLOSED: only a power the document's roster (`powersOf`) holds;
 * cardPowerParts reads the card's memberships and only ORDERS by the roster, it filters nothing, so a withheld power is
 * dropped here. A held power with no figure is kept with no weight (`weightHere: null`).
 * @param {unknown} card @param {unknown} settlement @returns {{ power: string, weightHere: string | null }[]}
 */
export function cardFirstOfWeights(card, settlement) {
  const held = new Set(powerNamesOf(settlement));
  /** @type {{ power: string, weightHere: string | null }[]} */
  const out = [];
  for (const part of cardPowerParts(card, powerOrderOf(settlement))) {
    if (part.rank !== 1 || !held.has(part.power)) continue;
    out.push({ power: part.power, weightHere: powerWeightHere(settlement, part.power) });
  }
  return out;
}

/**
 * THE CARD'S STANDING LINE: "first of Council, the strongest power here" (a card first of two: both, by "; "); a power
 * the document holds with no figure, "first of Temple" (no weight); null for a card first of no power the document holds.
 * @param {unknown} card @param {unknown} settlement @returns {string | null}
 */
export function cardStandingLine(card, settlement) {
  const parts = cardFirstOfWeights(card, settlement);
  return parts.length ? parts.map((p) => (p.weightHere ? `first of ${p.power}, ${p.weightHere}` : `first of ${p.power}`)).join('; ') : null;
}
