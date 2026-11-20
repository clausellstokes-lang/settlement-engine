/**
 * domain/display/tensionShown.js — A TROUBLE AS SHOWN: its sides (PAGE-9's SIDES, `briefs/SIDES.md` and both amendments).
 * The one module every surface that prints a live tension (`history.currentTensions[]`) calls; nothing here writes the
 * record (the chair's 11:58: the stored `factions` keep the template's words, and the words SHOWN are resolved here).
 *
 *   tensionSidesShown(record, tension)   the sides to print, in order, for one tension of the document in hand.
 *
 * THE RULES are the sides table's header (`data/tensionSideMeanings.js`, rules 0 to 4) under the chair's seven:
 *   1. a power's name ONLY through a row's `named` wording, `{power}` filled by the ONE helper
 *      (`data/tensionSidePower.js :: solePowerNameOf`); a row without `named` is never named;
 *   2. and only where that helper names one (it applies the exactly-one test and the ruler's governing power itself);
 *   3. never the same power on two sides of one tension: a named row whose fill would repeat a power already on a side
 *      keeps its own words;
 *   4. `presumes` first: a town lacking the house shows `without`; `without` null DROPS the side;
 *   5. a side the generator wrote over follows the header's rules 2 to 4 (rule 3 reads the SLOT row's `without` first);
 *   6. every side as shown begins with a capital letter;
 *   7. the reader reads ONLY the document it is given: a served document lacking a withheld power is, here, a town without
 *      that power, and prints what such a town prints. There is no second source.
 *
 * THE SLOTS. A stored side is placed at its template slot by its own words, never by position alone: the roster's
 * settlement (`generators/power/rosterText.js :: settleTensionsToRoster`) drops or merges sides, so the n-th stored side is
 * not always slot n. The form (`base`, `unanchored`, `dated`) is the one whose own words the stored sides match most
 * (`base` on a tie); each side then takes the first slot at or after the last one placed: its own words where they are a
 * row of that slot; a fixed generator word at a slot it stands for (`standsFor`); any other words that are no row of the
 * table at a slot the generator writes over (a power's name). Words the table holds for some OTHER place, and anything
 * unplaced, are shown as stored (header rule 4).
 *
 * A power OF A KIND (`POWER_MEANS`) is read against the roster's own mark, `powerStructure.factions[].category`, through
 * MEANS_CATEGORY below. The roster marks merchants and crafts alike `economy`, so a craft side is never named (the chair's
 * craft ruling, 20:30 UTC).
 *
 * Pure: no randomness, no clock, no store, no write.
 * @enforced-by tests/domain/display/tensionShown.test.js
 */
import { POWER_MEANS, TENSION_SIDE_BY_SLOT, TENSION_SIDE_MEANINGS } from '../../data/tensionSideMeanings.js';
import { solePowerNameOf } from '../../data/tensionSidePower.js';
import { powerNameWithArticle } from '../../data/people/powerSentenceName.js';
import { factsOf } from '../facts/factsOf.js';
import { atomHolds } from '../facts/factVocabulary.js';

/** @typedef {import('../../data/tensionSideMeanings.js').SideMeaning} SideMeaning */
/** @typedef {import('../../data/tensionSideMeanings.js').SideMeans} SideMeans */
/** @typedef {Readonly<Record<string, Readonly<SideMeaning>>>} SideTable */

/** The fill's slot in a `named` wording. */
const POWER_SLOT = '{power}';

/**
 * A side's party → the roster's category for it (`powerStructure.factions[].category`, the mark `solePowerNameOf` reads).
 * THE CRAFT RULING (the chair, 20:30 UTC): 'craft power' has NO entry. The roster carries no craft mark, and its `economy`
 * mark holds merchants and crafts alike, so a craft side is never named by it: it keeps its own words. 'merchant power'
 * keeps the economy mark.
 * @type {Readonly<Partial<Record<SideMeans, string>>>}
 */
export const MEANS_CATEGORY = Object.freeze({
  ruler: 'ruler',
  'merchant power': 'economy',
  'faith power': 'religious',
  'military power': 'military',
  'criminal power': 'criminal',
});

/** The forms in the order a tie falls. */
const FORM_ORDER = Object.freeze(['base', 'unanchored', 'dated']);

/**
 * @param {unknown} record
 * @returns {Array<{ faction?: unknown, category?: unknown }>}
 */
const rosterOf = (record) => {
  const f = /** @type {{ powerStructure?: { factions?: unknown } | null } | null | undefined} */ (record)?.powerStructure?.factions;
  return Array.isArray(f) ? f.filter((x) => !!x && typeof x === 'object') : [];
};

/** @param {string} s */
const capital = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

/** A power's name as a sentence opening with it: the key two sides are compared by (rule 3). @param {string} name */
const powerKey = (name) => powerNameWithArticle(name, true).toLowerCase();

/**
 * THE ONE READER.
 * @param {unknown} record the document in hand (the DM's record, or the served document)
 * @param {{ type?: unknown, factions?: unknown } | null | undefined} tension one of `history.currentTensions`
 * @param {SideTable} [table] the sides table (the shipped one; a test may hand a variant with the same keys)
 * @returns {string[]}
 */
export function tensionSidesShown(record, tension, table = TENSION_SIDE_MEANINGS) {
  const raw = Array.isArray(tension?.factions) ? tension.factions : [];
  const sides = raw.filter((s) => typeof s === 'string' && s.trim() !== '').map(String);
  if (!sides.length) return [];
  const kind = typeof tension?.type === 'string' ? tension.type : '';
  const forms = Object.hasOwn(TENSION_SIDE_BY_SLOT, kind) ? TENSION_SIDE_BY_SLOT[kind] : null;
  const roster = rosterOf(record);
  const names = new Set(roster.map((f) => (typeof f.faction === 'string' ? f.faction : '')).filter(Boolean));
  /** @param {string} words @param {string} category */
  const isPowerOf = (words, category) => roster.some((f) => f.faction === words && f.category === category);
  /** @param {string} category */
  const holdsPowerOf = (category) => roster.some((f) => f.category === category);
  /** @typedef {Parameters<typeof atomHolds>[1]} FactsIn */
  /** @type {FactsIn} */
  let facts = null;
  /** @returns {FactsIn} the facts of the document in hand, read once */
  const factsIn = () => (facts ??= /** @type {FactsIn} */ (factsOf(/** @type {{}} */ (record))));
  /** @param {ReadonlyArray<string>} presumes the town lacks one of these houses (an unanswered atom reads as lacking) */
  const lacks = (presumes) => presumes.some((atom) => atomHolds(atom, factsIn()) !== true);
  /** the template words the generator writes over (every row a fixed word stands for) */
  const writtenOver = new Set(Object.values(table).flatMap((r) => r.standsFor || []));

  /** @param {string} form @returns {Array<{ slot: number, how: 'own' | 'fixed' | 'written' } | null>} */
  const place = (form) => {
    const slots = forms?.[form] || {};
    const order = Object.keys(slots).map(Number).sort((a, b) => a - b);
    let from = 0;
    return sides.map((words) => {
      const fixed = Object.hasOwn(table, words) && table[words].standsFor ? table[words].standsFor : null;
      const isRow = Object.hasOwn(table, words);
      for (let i = from; i < order.length; i += 1) {
        const key = slots[order[i]];
        const how = key === words ? 'own' : fixed ? (fixed.includes(key) ? 'fixed' : null) : !isRow && writtenOver.has(key) ? 'written' : null;
        if (how) { from = i + 1; return { slot: order[i], how }; }
      }
      return null;
    });
  };
  // the form whose own words the stored sides match most (`base` on a tie)
  let form = 'base';
  let placed = forms ? place('base') : sides.map(() => null);
  if (forms) {
    let best = -1;
    for (const f of FORM_ORDER) {
      if (!forms[f]) continue;
      const p = place(f);
      const own = p.filter((x) => x?.how === 'own').length;
      if (own > best) { best = own; form = f; placed = p; }
    }
  }

  // rule 3: every power a stored side already names, then each name a fill adds
  const used = new Set(sides.filter((s) => names.has(s)).map(powerKey));
  /** @type {string[]} */
  const shown = [];
  sides.forEach((words, i) => {
    const at = placed[i];
    const slotWords = at && forms ? forms[form]?.[at.slot] : undefined;
    const slotRow = slotWords !== undefined && Object.hasOwn(table, slotWords) ? table[slotWords] : null;
    /** @type {string | null} */
    let out = words;
    if (at && slotRow && at.how === 'own') {
      // header rule 1 under the chair's 1 to 4: presumes first, then the one door to a name
      if (slotRow.presumes.length && lacks(slotRow.presumes)) out = slotRow.without === undefined ? words : slotRow.without;
      else if (slotRow.named !== undefined) {
        const category = MEANS_CATEGORY[slotRow.means];
        const name = category ? solePowerNameOf(record, category, slotRow.named.startsWith(POWER_SLOT)) : null;
        if (name && !used.has(name.toLowerCase())) {
          used.add(name.toLowerCase());
          out = slotRow.named.split(POWER_SLOT).join(name);
        }
      }
    } else if (at && slotRow) {
      // the generator wrote over the slot: header rules 2 to 4
      const category = MEANS_CATEGORY[slotRow.means];
      const ownRow = at.how === 'fixed' ? table[words] : null;
      if (POWER_MEANS.includes(slotRow.means) && category && !isPowerOf(words, category) && slotRow.without !== undefined) {
        out = slotRow.without; // rule 2: never a power in another party's part
      } else if (ownRow) {
        const ownCategory = MEANS_CATEGORY[ownRow.means];
        const missing = (POWER_MEANS.includes(ownRow.means) && !!ownCategory && !holdsPowerOf(ownCategory))
          || (ownRow.presumes.length > 0 && lacks(ownRow.presumes));
        if (missing) {
          const w = slotRow.without !== undefined ? slotRow.without : ownRow.without;
          if (w !== undefined) out = w; // rule 3: the slot row's words first
        }
      }
    }
    if (out !== null) shown.push(capital(out));
  });
  return shown;
}
