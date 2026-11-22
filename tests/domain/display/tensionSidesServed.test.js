/**
 * tensionSidesServed.test.js — THE SIDES TABLE ON A SERVED DOCUMENT (PAGE-13's SIDES-DECLARATION; the chair's ruling of
 * 07:11 UTC 2026-11-22). The proof that `tests/lint/samenessHideable.walker.test.js :: EXEMPT` cites for
 * `src/data/tensionSideMeanings.js :: TENSION_SIDE_MEANINGS` (class 'trouble'; withheld by
 * `src/domain/display/tensionShown.js :: tensionSidesShown`, the one reader, which reads only the document in hand).
 *
 * THE ARM. For EVERY row of the table and EVERY `at` placement of it (kind, form, slot), a PLANTED record (no birth, made up
 * as `tensionShown.test.js` makes its towns) whose one live tension of that kind stores the row's words at that slot and
 * the template's own words at its other slots (`TENSION_SIDE_BY_SLOT`), in two versions:
 *   (H) holding every house the row `presumes` and, for a row whose `means` is a power kind (`POWER_MEANS`), exactly one
 *       power of that kind on the roster (a criminal power for 'criminal power');
 *   (W) its twin WITHOUT those houses and that power.
 * Under each of the five projections a non-owner page is given (`docs/chair/2026-11-20/content/page/build/SIDES/parity.mjs ::
 * PROJECTIONS`: `toPublicSafe`, `toPublicSafe` full, `publicVeiledRecordOf`, and the first two through the gallery veil's
 * default set), `tensionSidesShown(served(H), t')` equals `tensionSidesShown(W, t)` WHEREVER the projection hid the house or
 * the power, and the owner's `tensionSidesShown(H, t)` where it hid nothing. Hidden or not is read from what the projection
 * DID to the planted record, never from a list: a planted house is hidden where the served `institutions` no longer hold its
 * name; the planted power where the served roster no longer holds its row (its `faction` and `category`).
 *
 * RED FIRST (the brief's two named cases, on the planted record): (a) the row "Criminal organisations" (`named: "{power}"`):
 * the owner's page prints the sole criminal power's name; (b) its `organised crime` atom: the twin prints "Lawbreakers".
 * The device lives here: `SIDES_SERVED_RED=a` hands the reader a variant table whose row has no `named`, and
 * `SIDES_SERVED_RED=b` one whose row presumes nothing (the reader's own third argument), so each case is seen red; unset,
 * the shipped table, green. `SIDES_SERVED_TABLE=1` writes the verdict of every row, place and projection to stderr.
 *
 * PINNED (the brief's point 2, as `troubleHooksShared.test.js` (D) pins its gap): the arm's reds are exactly the states in
 * `PINNED` below. Each is the gallery veil's default set over a record holding a criminal house and an open criminal power:
 * the veil takes the house whole (`institutions[]`, X-21e) and leaves the power's row on the roster
 * (`powerStructure.factions[]`, its `faction` and `category` on the card floor), so the `organised crime` atom still
 * answers yes through the roster (`criminalStructureKey.js`) and `solePowerNameOf` names the power. NOT held by the sameness
 * walker: owed to the share veil's instrument, and LISTED for the security reader. The day the veil holds it, the arm's
 * reds fall, (D) here reds, and the walker's TENSION_SIDE_MEANINGS entry is rewritten.
 */
import { describe, expect, it } from 'vitest';
import { POWER_MEANS, TENSION_SIDE_BY_SLOT, TENSION_SIDE_MEANINGS } from '../../../src/data/tensionSideMeanings.js';
import { solePowerNameOf } from '../../../src/data/tensionSidePower.js';
import { factsOf } from '../../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../../src/domain/facts/factVocabulary.js';
import { publicVeiledRecordOf, toPublicSafe } from '../../../src/domain/display/publicSafe.js';
import { applyVeil, defaultVeilFor, resolveVeil } from '../../../src/domain/display/galleryVeil.js';
import { MEANS_CATEGORY, tensionSidesShown } from '../../../src/domain/display/tensionShown.js';

/** @typedef {import('../../../src/data/tensionSideMeanings.js').SideMeaning} SideMeaning */

const CRIME_ROW = 'Criminal organisations';

/** THE RED-FIRST DEVICE: the shipped table, or (a) the crime row without its `named`, or (b) presuming nothing. */
const RED = process.env.SIDES_SERVED_RED ?? '';
/** @type {Readonly<Record<string, Readonly<SideMeaning>>>} */
const TABLE = RED === 'a'
  ? { ...TENSION_SIDE_MEANINGS, [CRIME_ROW]: (({ named: _named, ...rest }) => Object.freeze(rest))(TENSION_SIDE_MEANINGS[CRIME_ROW]) }
  : RED === 'b'
    ? { ...TENSION_SIDE_MEANINGS, [CRIME_ROW]: Object.freeze({ ...TENSION_SIDE_MEANINGS[CRIME_ROW], presumes: Object.freeze([]) }) }
    : TENSION_SIDE_MEANINGS;
/** The reader, over the table in hand. @param {unknown} record @param {any} tension */
const shownOf = (record, tension) => tensionSidesShown(record, tension, TABLE);

/** THE FIVE PROJECTIONS a non-owner page is given (`build/SIDES/parity.mjs :: PROJECTIONS`, the same five, the same order). */
const veiled = (/** @type {any} */ pub) => applyVeil(pub, resolveVeil(defaultVeilFor(pub), null));
/** @type {Readonly<Record<string, (record: any) => any>>} */
const PROJECTIONS = Object.freeze({
  'toPublicSafe': (r) => toPublicSafe(r),
  'toPublicSafe full': (r) => toPublicSafe(r, { full: true }),
  'publicVeiledRecordOf': (r) => publicVeiledRecordOf(r),
  'toPublicSafe + default veil': (r) => veiled(toPublicSafe(r)),
  'toPublicSafe full + default veil': (r) => veiled(toPublicSafe(r, { full: true })),
});

/** A planted house for each atom a row presumes (each checked below to answer its atom on H and not on W). */
const HOUSE_OF = Object.freeze({
  market: { name: 'Market Square', tags: ['market'] },
  'force: kept': { name: 'Town watch', category: 'Defense' },
  'legal house': { name: 'Courthouse', category: 'Government' },
  healer: { name: 'Healer', category: 'Services' },
  clergy: { name: 'Parish church', category: 'Religious' },
  'organised crime': { name: 'Thieves guild', category: 'Criminal' },
});
/** One power of each power kind. Its category is the roster's mark (`MEANS_CATEGORY`); a craft power is marked `economy`, the roster's one mark for merchants and crafts alike (the chair's craft ruling). */
const POWER_OF = Object.freeze(Object.fromEntries(POWER_MEANS.map((means) => [means, Object.freeze({
  faction: { 'merchant power': 'Merchant League', 'craft power': 'Weavers Guild', 'faith power': 'Synod of the Lamp', 'military power': 'Iron Company', 'criminal power': 'The Hollow Hand' }[means],
  category: MEANS_CATEGORY[means] ?? 'economy',
})])));
const RULER = Object.freeze({ faction: 'Ashford Council', category: 'government', isGoverning: true });

/** @param {string} kind @param {string} form @param {number} slot @param {string} words the tension of that kind with the row's words at that slot */
const tensionAt = (kind, form, slot, words) => {
  const slots = TENSION_SIDE_BY_SLOT[kind][form];
  return { type: kind, description: 'A planted trouble.', factions: Object.keys(slots).map(Number).sort((a, b) => a - b).map((s) => (s === slot ? words : slots[s])) };
};
/** @param {any} tension @param {Readonly<SideMeaning>} row @param {boolean} holding (H) or (W) */
const planted = (tension, row, holding) => ({
  id: 'set_planted', name: 'Ashford', tier: 'town', population: 2400,
  powerStructure: { factions: [{ ...RULER }, ...(holding && POWER_MEANS.includes(row.means) ? [{ .../** @type {any} */ (POWER_OF)[row.means] }] : [])] },
  institutions: holding ? row.presumes.map((a) => ({ .../** @type {any} */ (HOUSE_OF)[a] })) : [],
  history: { currentTensions: [tension] },
});

/**
 * THE VERDICTS: one for each row, place and projection.
 * @returns {Array<{ key: string, words: string, place: string, projection: string, hidden: string[], owner: string[], twin: string[], served: string[], expected: string[], ok: boolean, H: any, s: any }>}
 */
const verdicts = () => Object.entries(TENSION_SIDE_MEANINGS).flatMap(([words, shipped]) => shipped.at.flatMap((p) => {
  const row = TABLE[words];
  const t = tensionAt(p.kind, p.form, p.slot, words);
  const H = planted(t, row, true);
  const W = planted(t, row, false);
  const owner = shownOf(H, t);
  const twin = shownOf(W, t);
  const place = `${p.kind}/${p.form}/${p.slot}`;
  return Object.entries(PROJECTIONS).map(([projection, project]) => {
    const s = project(H);
    const t2 = (s?.history?.currentTensions ?? []).find((/** @type {any} */ x) => x?.type === t.type);
    const served = shownOf(s, t2);
    const houses = new Set((s?.institutions ?? []).map((/** @type {any} */ i) => i?.name));
    const roster = s?.powerStructure?.factions ?? [];
    const power = POWER_MEANS.includes(row.means) ? /** @type {any} */ (POWER_OF)[row.means] : null;
    const hidden = [
      ...row.presumes.filter((a) => !houses.has(/** @type {any} */ (HOUSE_OF)[a].name)).map((a) => `house ${a}`),
      ...(power && !roster.some((/** @type {any} */ f) => f?.faction === power.faction && f?.category === power.category) ? [`power ${row.means}`] : []),
    ];
    const expected = hidden.length ? twin : owner;
    return { key: `${projection} :: ${words} :: ${place}`, words, place, projection, hidden, owner, twin, served, expected, ok: JSON.stringify(served) === JSON.stringify(expected), H, s };
  });
}));

/**
 * THE PINNED STATES (the brief's point 2): "Criminal organisations" at both of its places, under the gallery veil's
 * default set (both of its projections). Projection: `applyVeil(…, resolveVeil(defaultVeilFor(…)))`. Fields: the criminal
 * house leaves `institutions[]` whole (X-21e) while the criminal power's row stays in `powerStructure.factions[]` (`faction`,
 * `category` on the card floor), so `organised crime` answers yes and `solePowerNameOf(…, 'criminal')` names the power: the
 * served page prints the owner's side, the twin "Lawbreakers". Owed to the share veil's instrument; LISTED for the security
 * reader; not held by the sameness walker.
 */
const PINNED = Object.freeze([
  'toPublicSafe + default veil :: Criminal organisations :: crime_wave/base/2',
  'toPublicSafe full + default veil :: Criminal organisations :: crime_wave/base/2',
  'toPublicSafe + default veil :: Criminal organisations :: crime_wave/unanchored/2',
  'toPublicSafe full + default veil :: Criminal organisations :: crime_wave/unanchored/2',
]);

describe('the sides table on a served document: every row, every place, the five projections', () => {
  it('the planted records: every row at every place, H holding every house it presumes and its one power, W without them', () => {
    const atoms = [...new Set(Object.values(TENSION_SIDE_MEANINGS).flatMap((r) => r.presumes))].sort();
    expect(atoms.filter((a) => !Object.hasOwn(HOUSE_OF, a))).toEqual([]);
    let places = 0;
    for (const [words, row] of Object.entries(TENSION_SIDE_MEANINGS)) for (const p of row.at) {
      places += 1;
      const t = tensionAt(p.kind, p.form, p.slot, words);
      expect(t.factions[Object.keys(TENSION_SIDE_BY_SLOT[p.kind][p.form]).map(Number).sort((a, b) => a - b).indexOf(p.slot)], words).toBe(words);
      const H = planted(t, row, true);
      const W = planted(t, row, false);
      for (const a of row.presumes) expect([a, atomHolds(a, factsOf(H)), atomHolds(a, factsOf(W)) === true], words).toEqual([a, true, false]);
      const category = MEANS_CATEGORY[row.means];
      if (POWER_MEANS.includes(row.means) && category) expect([solePowerNameOf(H, category) !== null, solePowerNameOf(W, category)], words).toEqual([true, null]);
    }
    expect(places).toBe(Object.values(TENSION_SIDE_MEANINGS).reduce((n, r) => n + r.at.length, 0));
  });

  it('(a) the sole criminal power\'s named fill: the owner\'s page prints the power\'s name; (b) the `organised crime` atom: the twin prints "Lawbreakers"', () => {
    const shipped = TENSION_SIDE_MEANINGS[CRIME_ROW];
    expect([shipped.means, shipped.presumes, shipped.named]).toEqual(['criminal power', ['organised crime'], '{power}']);
    for (const p of shipped.at) {
      const t = tensionAt(p.kind, p.form, p.slot, CRIME_ROW);
      const H = planted(t, TABLE[CRIME_ROW], true);
      const W = planted(t, TABLE[CRIME_ROW], false);
      const name = solePowerNameOf(H, 'criminal', true);
      expect(name).toBe(POWER_OF['criminal power'].faction);
      expect(shownOf(H, t)[p.slot], `(a) ${p.kind}/${p.form}`).toBe(/** @type {string} */ (shipped.named).split('{power}').join(/** @type {string} */ (name)));
      expect(shownOf(W, t)[p.slot], `(b) ${p.kind}/${p.form}`).toBe(shipped.without);
    }
  });

  it("every row at every place, under each of the five projections, prints the twin's sides where the projection hid the house or the power and the owner's where it hid nothing; the reds are the pinned states", () => {
    const all = verdicts();
    expect(all.length).toBe(5 * Object.values(TENSION_SIDE_MEANINGS).reduce((n, r) => n + r.at.length, 0));
    if (process.env.SIDES_SERVED_TABLE === '1') {
      process.stderr.write(`${all.map((v) => `${v.ok ? 'HOLDS' : 'RED  '} ${v.hidden.length ? `hidden (${v.hidden.join(', ')})` : 'not hidden'} :: ${v.key} :: served ${JSON.stringify(v.served)} :: expected ${JSON.stringify(v.expected)}`).join('\n')}\n`);
    }
    // the read discriminates: some projection hid something on some row, and the planted rows differ where it did
    expect(all.filter((v) => v.hidden.length).length).toBeGreaterThan(0);
    expect(all.filter((v) => !v.ok).map((v) => v.key)).toEqual([...PINNED]);
  });

  it('(D) the pinned state exists: under the gallery veil\'s default set the criminal house is gone, its power\'s row left, `organised crime` answers yes and the served page names the power', () => {
    const pinned = verdicts().filter((v) => PINNED.includes(v.key));
    expect(pinned.map((v) => v.key)).toEqual([...PINNED]);
    for (const v of pinned) {
      const power = POWER_OF['criminal power'];
      // the house left `institutions[]` (the planted list held it on H)
      expect([v.H.institutions.map((/** @type {any} */ i) => i.name), (v.s.institutions ?? []).map((/** @type {any} */ i) => i.name)], v.key).toEqual([[HOUSE_OF['organised crime'].name], []]);
      // the power's row stayed in `powerStructure.factions[]`, its kind still criminal
      expect((v.s.powerStructure?.factions ?? []).filter((/** @type {any} */ f) => f.category === 'criminal').map((/** @type {any} */ f) => f.faction), v.key).toEqual([power.faction]);
      expect([v.hidden, atomHolds('organised crime', factsOf(v.s)), solePowerNameOf(v.s, 'criminal', true)], v.key).toEqual([['house organised crime'], true, power.faction]);
      // the served page prints the owner's sides, the power's name at the row's slot, where the twin prints "Lawbreakers"
      const slot = Number(v.place.split('/')[2]);
      expect([v.served, v.served[slot], v.twin[slot]], v.key).toEqual([v.owner, power.faction, TENSION_SIDE_MEANINGS[CRIME_ROW].without]);
    }
  });
});
