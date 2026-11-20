/**
 * S7 SECOND CUT (PAGE-2's brief `docs/chair/2026-11-20/content/page/briefs/S7.md`, 2026-11-20 12:09 UTC; the chair's
 * rulings of 11:36, a power is never cast in another party's part, and 11:58, display, not stored): WHAT EACH TENSION
 * SIDE MEANS, as data only (`src/data/tensionSideMeanings.js`). Four checks, as the brief numbers them:
 *   (1) TOTALITY: every side string of every form of every kind (`HISTORICAL_EVENTS_DATA`'s `factions` and each
 *       `byMemory` form's `factions`), and every fixed generator side, has a row, and every `at` entry matches the
 *       catalogue;
 *   (2) every `presumes` atom is a known atom (`isKnownAtom`);
 *   (3) every `without` is a string or null and never names a power, a house or a tier word;
 *   (4) no row whose `presumes` is empty carries a `without`, save (the chair's addition, relayed by PAGE-2) a template
 *       side the generator writes over whose `means` is a power, which must carry one;
 * and the chair's addition: the table BY SLOT (`TENSION_SIDE_BY_SLOT`) reaches every slot of every form of every kind.
 * The catalogue is COMPUTED from the template table and the generator's own source, never quoted.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HISTORICAL_EVENTS_DATA } from '../../src/data/historyData.js';
import { isKnownAtom, TIER_WORDS } from '../../src/domain/facts/factVocabulary.js';
import { HISTORY_TEMPLATE_RECORD_DECLARATIONS } from '../../src/generators/historyGenerator.js';
import {
  POWER_MEANS, SIDE_MEANS, TENSION_SIDE_BY_SLOT, TENSION_SIDE_MEANINGS, TENSION_SIDE_TABLE_LINES,
} from '../../src/data/tensionSideMeanings.js';

const FORMS = /** @type {const} */ (['base', 'unanchored', 'dated']);

/** @param {any} e @param {string} form */
const sidesOf = (e, form) => (form === 'base' ? e.factions : e.byMemory?.[form]?.factions);

/** words → the sorted `kind/form/slot` keys that carry them, read off the template table */
const CATALOGUE = (() => {
  /** @type {Map<string, string[]>} */
  const m = new Map();
  for (const e of HISTORICAL_EVENTS_DATA) {
    for (const form of FORMS) {
      const sides = sidesOf(e, form);
      if (!Array.isArray(sides)) continue;
      sides.forEach((/** @type {string} */ words, /** @type {number} */ slot) => {
        if (!m.has(words)) m.set(words, []);
        /** @type {string[]} */ (m.get(words)).push(`${e.type}/${form}/${slot}`);
      });
    }
  }
  return m;
})();

const GENERATOR_SOURCE = readFileSync(new URL('../../src/generators/historyGenerator.js', import.meta.url), 'utf8');

/** The template words `substituteNames` writes over (`.replace(/<words>/g, …)`), read off the generator's source. */
const REPLACED_WORDS = [...GENERATOR_SOURCE.matchAll(/\.replace\(\/([A-Z][A-Za-z ]+)\/g,/g)].map((x) => x[1]);

/** The fixed words the generator writes in their place (the brief's list; each is pinned to the source below). */
const FIXED_SIDES = [
  'the criminal network', 'the merchant class', 'the orthodox clergy', 'The garrison', 'The watch', 'The militia',
  'Local enforcement', 'the governing authority',
];

/** @param {{ kind: string, form: string, slot: number }} a */
const keyOf = (a) => `${a.kind}/${a.form}/${a.slot}`;

/** A power, a house, or a tier: words a `without` must never carry. */
const NAMES_A_POWER_OR_HOUSE = new RegExp(String.raw`\b(?:${[
  'merchants?', 'traders?', 'market', 'guilds?', 'craft', 'temple', 'church', 'shrine', 'clergy', 'priests?', 'faith',
  'court', 'notar(?:y|ies)', 'lawyers?', 'advocates?', 'legal', 'watch', 'guards?', 'garrison', 'militia', 'soldiers?',
  'enforcement', 'council', 'lords?', 'criminal', 'network', 'gangs?', 'thieves', 'syndicate', 'house', 'healers?',
  'authorit(?:y|ies)', 'officials?', 'government', ...TIER_WORDS,
].join('|')})\b`, 'i');

describe('tensionSideMeanings (S7 second cut: what each tension side means, as data only)', () => {
  it('(1) TOTALITY: every catalogue side and every fixed generator side has a row, and no other row stands', () => {
    expect(CATALOGUE.size).toBeGreaterThan(0);
    const missing = [...CATALOGUE.keys(), ...FIXED_SIDES].filter((w) => !Object.hasOwn(TENSION_SIDE_MEANINGS, w));
    expect(missing).toEqual([]);
    const stray = Object.keys(TENSION_SIDE_MEANINGS).filter((w) => !CATALOGUE.has(w) && !FIXED_SIDES.includes(w));
    expect(stray).toEqual([]);
  });

  it('(1) every catalogue row\'s `at` is exactly the places that carry its words', () => {
    const wrong = [...CATALOGUE].filter(([words, keys]) => {
      const row = TENSION_SIDE_MEANINGS[words];
      return !row || JSON.stringify(row.at.map(keyOf).sort()) !== JSON.stringify([...keys].sort());
    }).map(([words]) => words);
    expect(wrong).toEqual([]);
    const total = Object.values(TENSION_SIDE_MEANINGS).filter((r) => !r.standsFor).reduce((n, r) => n + r.at.length, 0);
    expect(total).toBe([...CATALOGUE.values()].reduce((n, k) => n + k.length, 0));
  });

  it('(1) every fixed generator side is the generator\'s own literal, standing for words it writes over, at exactly their places', () => {
    expect(REPLACED_WORDS.length).toBeGreaterThan(0);
    for (const words of FIXED_SIDES) {
      const row = TENSION_SIDE_MEANINGS[words];
      expect(GENERATOR_SOURCE.includes(`'${words}'`), words).toBe(true);
      expect(Array.isArray(row?.standsFor) && row.standsFor.length > 0, words).toBe(true);
      for (const t of row.standsFor) {
        expect(REPLACED_WORDS, `${words} stands for ${t}`).toContain(t);
        expect(CATALOGUE.has(t), t).toBe(true);
      }
      const places = row.standsFor.flatMap((t) => CATALOGUE.get(t) ?? []).sort();
      expect(row.at.map(keyOf).sort(), words).toEqual(places);
    }
    const catalogueRowsStanding = [...CATALOGUE.keys()].filter((w) => TENSION_SIDE_MEANINGS[w]?.standsFor);
    expect(catalogueRowsStanding).toEqual([]);
  });

  it('every `means` is one of the closed set', () => {
    const bad = Object.entries(TENSION_SIDE_MEANINGS).filter(([, r]) => !SIDE_MEANS.includes(r.means)).map(([w]) => w);
    expect(bad).toEqual([]);
  });

  it('(2) every `presumes` atom is a known atom, and none is one every kind at the row already needs', () => {
    const unknown = Object.entries(TENSION_SIDE_MEANINGS)
      .flatMap(([w, r]) => r.presumes.filter((a) => !isKnownAtom(a)).map((a) => `${w}: ${a}`));
    expect(unknown).toEqual([]);
    /** @param {string} kind */
    const kindNeeds = (kind) => /** @type {ReadonlyArray<string>} */ (/** @type {any} */ (HISTORY_TEMPLATE_RECORD_DECLARATIONS)[kind]?.needs ?? []);
    const guaranteed = Object.entries(TENSION_SIDE_MEANINGS)
      .flatMap(([w, r]) => r.presumes.filter((a) => r.at.every((p) => kindNeeds(p.kind).includes(a))).map((a) => `${w}: ${a}`));
    expect(guaranteed).toEqual([]);
  });

  it('(3) every `without` is a string or null, names no power, house or tier, and keeps its side\'s case', () => {
    const presuming = Object.entries(TENSION_SIDE_MEANINGS).filter(([, r]) => r.presumes.length > 0);
    expect(presuming.length).toBeGreaterThan(0);
    for (const [words, r] of presuming) expect(Object.hasOwn(r, 'without'), words).toBe(true);
    for (const [words, r] of Object.entries(TENSION_SIDE_MEANINGS).filter(([, x]) => Object.hasOwn(x, 'without'))) {
      expect(r.without === null || (typeof r.without === 'string' && r.without.trim().length > 0), words).toBe(true);
      if (typeof r.without !== 'string') continue;
      expect(NAMES_A_POWER_OR_HOUSE.test(r.without), `${words} → ${r.without}`).toBe(false);
      const upper = (/** @type {string} */ s) => s[0] === s[0].toUpperCase();
      // S7 follow-up (the chair, 13:50): a fixed generator row may keep the case of its own words OR of the side it stands for
      const cases = [words, ...(r.standsFor ?? [])].map(upper);
      expect(cases, `${words} → ${r.without}`).toContain(upper(r.without));
    }
  });

  it('(4) no row whose `presumes` is empty carries a `without`, save a written-over power side, which must', () => {
    /** @param {string} w @param {any} r */
    const owes = (w, r) => REPLACED_WORDS.includes(w) && POWER_MEANS.includes(r.means);
    const bad = Object.entries(TENSION_SIDE_MEANINGS)
      .filter(([w, r]) => r.presumes.length === 0 && Object.hasOwn(r, 'without') !== owes(w, r)).map(([w]) => w);
    expect(bad).toEqual([]);
    const owing = Object.entries(TENSION_SIDE_MEANINGS).filter(([w, r]) => owes(w, r)).map(([w]) => w).sort();
    expect(owing).toEqual(['Criminal organisations', 'Orthodox believers', 'Wealthy merchants']);
  });

  it('(1) BY SLOT: every slot of every form of every kind reaches its own words\' row, and nothing else is indexed', () => {
    const wrong = [...CATALOGUE].flatMap(([words, keys]) => keys.filter((k) => {
      const [kind, form, slot] = k.split('/');
      return TENSION_SIDE_BY_SLOT[kind]?.[form]?.[Number(slot)] !== words;
    }));
    expect(wrong).toEqual([]);
    const indexed = Object.entries(TENSION_SIDE_BY_SLOT)
      .flatMap(([kind, forms]) => Object.entries(forms).flatMap(([form, slots]) => Object.keys(slots).map((slot) => `${kind}/${form}/${slot}`)));
    expect(indexed.sort()).toEqual([...CATALOGUE.values()].flat().sort());
    expect(Object.keys(TENSION_SIDE_BY_SLOT).sort()).toEqual(HISTORICAL_EVENTS_DATA.map((e) => e.type).sort());
    for (const words of FIXED_SIDES) {
      const row = TENSION_SIDE_MEANINGS[words];
      for (const p of row.at) expect(row.standsFor, `${words} at ${keyOf(p)}`).toContain(TENSION_SIDE_BY_SLOT[p.kind][p.form][p.slot]);
    }
    expect(Object.isFrozen(TENSION_SIDE_BY_SLOT) && Object.isFrozen(TENSION_SIDE_BY_SLOT.crime_wave.unanchored)).toBe(true);
  });

  // ── S7 FOLLOW-UP (`briefs/S7-FOLLOWUP.md`, the chair's six changes of 13:22 and the ruling of 13:50) ──
  /** The chair's `named` wordings, verbatim (change 1): the only door to a power's name. */
  const CHAIR_NAMED = {
    'The sitting authority': '{power}',
    'The restored order': '{power}',
    'Those in charge, who will not give way': '{power}, who will not give way',
    'Authorities exploiting the rift': '{power}, exploiting the rift',
    'Those in authority who would exploit the rift': '{power}, who would exploit the rift',
    'Authorities caught between them': '{power}, caught between them',
    'Wealthy merchants': '{power}',
    'Merchants who benefit from cheap newcomer labour': '{power}, gaining from cheap newcomer labour',
    'Orthodox believers': '{power}',
    'Guild members': '{power}',
    'Criminal organisations': '{power}',
  };

  it('(follow-up 1) `named` is carried by exactly the chair\'s rows, each with one {power} slot', () => {
    const named = Object.fromEntries(Object.entries(TENSION_SIDE_MEANINGS)
      .filter(([, r]) => Object.hasOwn(r, 'named')).map(([w, r]) => [w, /** @type {any} */ (r).named]));
    expect(named).toEqual(CHAIR_NAMED);
    for (const [w, n] of Object.entries(named)) expect(n.split('{power}').length - 1, w).toBe(1);
    // the chair's 13:50: a stored side that already IS a power's name is shown as stored, never given a `named`
    expect(['Legitimate heir', 'Corrupt officials', 'Official guards', 'Power behind throne']
      .filter((w) => Object.hasOwn(TENSION_SIDE_MEANINGS[w], 'named'))).toEqual([]);
  });

  it('(follow-up 6) every `named` row means the ruler or a power, and no kind and form names one party twice', () => {
    const wrong = Object.entries(TENSION_SIDE_MEANINGS)
      .filter(([, r]) => Object.hasOwn(r, 'named') && r.means !== 'ruler' && !POWER_MEANS.includes(r.means)).map(([w]) => w);
    expect(wrong).toEqual([]);
    expect(Object.values(TENSION_SIDE_MEANINGS).some((r) => Object.hasOwn(r, 'named'))).toBe(true);
    /** @type {Map<string, string[]>} */
    const byParty = new Map();
    for (const [w, r] of Object.entries(TENSION_SIDE_MEANINGS)) {
      if (!Object.hasOwn(r, 'named')) continue;
      for (const p of r.at) {
        const k = `${p.kind}/${p.form}/${r.means}`;
        byParty.set(k, [...(byParty.get(k) ?? []), w]);
      }
    }
    expect([...byParty].filter(([, ws]) => ws.length > 1)).toEqual([]);
  });

  it('(follow-up 2) a camp or a part of a power is no power: its `means` is none', () => {
    const camps = ['Established guilds', 'Upstart guilds', 'Displaced traders', 'Traders who fear the buyers are going elsewhere',
      'Merchants tied to the old partner', 'Merchants who trade with the partner', 'Temple beneficiaries', 'Price regulators'];
    expect(camps.filter((w) => TENSION_SIDE_MEANINGS[w]?.means !== 'none')).toEqual([]);
  });

  it('(follow-up 3) "Price regulators" without a market shows the kind\'s own unanchored words, never dropped', () => {
    const base = HISTORICAL_EVENTS_DATA.find((e) => e.type === 'resource_scarcity');
    const slot = (base?.factions ?? []).indexOf('Price regulators');
    const own = sidesOf(base, 'unanchored')[slot];
    const row = TENSION_SIDE_MEANINGS['Price regulators'];
    expect(row.presumes).toEqual(['market']);
    expect(typeof own === 'string' && row.without === own).toBe(true);
  });

  it('(follow-up 5) the fixed word "the criminal network" shows its template row\'s own `without`', () => {
    const row = TENSION_SIDE_MEANINGS['the criminal network'];
    expect(row.without).toBe(TENSION_SIDE_MEANINGS[/** @type {string[]} */ (row.standsFor)[0]].without);
  });

  it('the chair\'s plain-text table is the file\'s own lines, so the two cannot differ', () => {
    const text = readFileSync(new URL('../../docs/chair/2026-11-20/content/page/S7-TABLE.txt', import.meta.url), 'utf8');
    const lines = text.split('\n').filter((l) => l.length > 0 && !l.startsWith('#'));
    expect(lines).toEqual(TENSION_SIDE_TABLE_LINES());
  });

  it('the table is frozen, row by row', () => {
    expect(Object.isFrozen(TENSION_SIDE_MEANINGS)).toBe(true);
    for (const r of Object.values(TENSION_SIDE_MEANINGS)) {
      expect(Object.isFrozen(r) && Object.isFrozen(r.at) && Object.isFrozen(r.presumes)).toBe(true);
    }
  });
});
