/**
 * tests/generators/settlementReasonVariants.test.js — PEOPLE-2 B3: WHY THE PLACE IS HERE, VARIED
 * (`settlementReason[]`; the brief `docs/chair/2026-11-20/content/people/briefs/P2-B3-settlementReason-BUILD.md`, the
 * proposal `PROPOSAL-settlementReason.md` beside it, and the chair's rulings of 17:13 and 17:21 UTC quoted there).
 *
 * The field prints on the Overview's "Settlement Origin", the Summary tab, the PDF Overview, the campaign PDF and the
 * Foundry journal. Before this lane its size line was one fixed sentence in every city (100 of 100) and nearly every
 * metropolis (96 of 100). The cure: today's line stays the head of the list, and the wordings whose `needs` hold and
 * whose `excludes` do not on the place's own facts follow it; the pick is `pickVariantMixed` over that list, keyed on the
 * birth's seed (no draw).
 *
 * 1. THE BAR, BY THE SENTENCE (the chair, 17:21, item 3): over 150 places a size (`hxd-<size>-0..149`, born as the chair's
 *    instrument births them), no sentence of `settlementReason` (names masked) prints in more than 20% of a size's places.
 * 2. A seedless record, and a place where no wording is eligible, keep their lines byte for byte.
 * 3. Every printed wording over the 900 places: its `needs` hold and its `excludes` do not on the FINAL record (through
 *    `drawDeclared`), its slots read the final record, and the rows the chair re-worded stand as ruled.
 * 4. THE HIDEABLE RULE (the chair, 17:21, item 5): no wording needs a fact about crime, and every printed wording's
 *    `needs` still hold with every hideable house (`cardVeil.js :: isHideableHouse`) taken off the roster.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { generateSettlementReason } from '../../src/generators/narrativeGenerator.js';
import { GROUND_PHRASE, originArmKey, originVariantKey } from '../../src/generators/narrative/settlementOriginProse.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { drawDeclared } from '../../src/domain/facts/drawDeclared.js';
import { parseAtom } from '../../src/domain/facts/factVocabulary.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';

const SIZES = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
const N = 150;
const BAR = 0.2;
const MODULE = '../../src/data/settlementReasonVariants.js';

/** The variant module, or null before it exists (the red commit). */
const loadVariants = async () => { try { return await import(/* @vite-ignore */ MODULE); } catch { return null; } };

const esc = (/** @type {string} */ x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
/** The chair's instrument's mask: the place's name, its people's names and their words of more than three letters, its powers' names -> '#'; digits -> '0'. */
function maskOf(/** @type {any} */ t) {
  const names = new Set();
  const add = (/** @type {unknown} */ x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
  add(t.name);
  for (const p of t.npcs || []) {
    add(p.name);
    for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w);
  }
  for (const f of t.powerStructure?.factions || []) {
    add(f.name);
    add(f.faction);
  }
  const list = [...names].sort((a, b) => b.length - a.length);
  const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
  return (/** @type {string} */ s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');
}
const sentencesOf = (/** @type {string} */ line) => line.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);

/** Every pool row of the module, with its pool's name. */
const rowsOf = (/** @type {any} */ V) => [
  ...Object.entries(V.ORIGIN_VARIANTS).flatMap(([arm, rows]) => /** @type {any[]} */ (rows).map((row) => ({ pool: `origin.${arm}`, row }))),
  ...V.SMALL_PLACE_VARIANTS.map((/** @type {any} */ row) => ({ pool: 'small-place', row })),
  ...V.CITY_DEFICIT_VARIANTS.map((/** @type {any} */ row) => ({ pool: 'city-deficit', row })),
  ...V.METROPOLIS_VARIANTS.map((/** @type {any} */ row) => ({ pool: 'metropolis', row })),
];
const templateRe = (/** @type {string} */ text) => new RegExp(`^${esc(text).replace(/\\\{(ground|export|routeWay)\\\}/g, '(.+?)')}$`);

/** @type {Record<string, { places: number, bySentence: Map<string, number> }>} */
const SHARES = {};
/** @type {string[]} */ const ADMIT_MISSES = [];
/** @type {string[]} */ const SLOT_MISSES = [];
/** @type {string[]} */ const HIDEABLE_MISSES = [];
/** @type {string[]} */ const GRAIN_MISSES = [];
/** @type {Map<string, number>} */ const PRINTED = new Map();
/** @type {any} */ let V = null;

beforeAll(async () => {
  await loadGenerationLawPayloads();
  V = await loadVariants();
  const rows = V ? rowsOf(V).map((r) => ({ ...r, re: templateRe(r.row.text) })) : [];
  for (const size of SIZES) {
    const share = { places: 0, bySentence: new Map() };
    SHARES[size] = share;
    for (let i = 0; i < N; i += 1) {
      const seed = `hxd-${size}-${i}`;
      const t = /** @type {any} */ (generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }));
      const lines = Array.isArray(t.settlementReason) ? t.settlementReason.map(String) : [];
      if (!lines.length) continue;
      share.places += 1;
      const mask = maskOf(t);
      for (const s of new Set(lines.flatMap(sentencesOf).map(mask))) share.bySentence.set(s, (share.bySentence.get(s) || 0) + 1);
      if (!V) continue;
      const facts = factsOf(t);
      const unveiled = factsOf({ ...t, institutions: (t.institutions || []).filter((/** @type {any} */ h) => !isHideableHouse(h)) });
      const grain = Array.isArray(facts.foodSources) && facts.foodSources.includes('grain');
      for (const line of lines) {
        if (/\bits own grain\b|\balongside its own\b|\btheir own fields\b/.test(line) && !grain) GRAIN_MISSES.push(`${seed}: ${line}`);
        const hits = rows.filter((r) => r.re.test(line));
        if (!hits.length) continue;
        const admitted = (/** @type {any} */ f) => hits.some((h) => drawDeclared([h.row], { draw: (p) => p[0], facts: f, poolId: 'test' }).resolvedBy === 'drawn');
        const filledHere = hits.some((h) => V.fillWording(h.row.text, V.slotsOf(facts, GROUND_PHRASE)) === line);
        for (const h of hits) PRINTED.set(`${h.pool} :: ${h.row.text}`, (PRINTED.get(`${h.pool} :: ${h.row.text}`) || 0) + 1);
        if (!admitted(facts)) ADMIT_MISSES.push(`${seed}: ${line}`);
        if (!filledHere) SLOT_MISSES.push(`${seed}: ${line}`);
        if (!admitted(unveiled)) HIDEABLE_MISSES.push(`${seed}: ${line}`);
      }
    }
  }
}, 1_800_000);

describe('1. the bar, by the sentence, over 150 places a size', () => {
  it('no settlementReason sentence prints in more than 20% of a size\'s places (every size)', () => {
    const over = [];
    for (const size of SIZES) {
      const { places, bySentence } = SHARES[size];
      expect(places, `${size}: places holding the field`).toBe(N);
      for (const [s, n] of bySentence) if (n / places > BAR) over.push(`${size} ${n}/${places}: ${s}`);
    }
    expect(over).toEqual([]);
  });
});

describe('2. a seedless record, and a place with no eligible wording, keep their lines byte for byte', () => {
  const RECORD = Object.freeze({
    tier: 'city', population: 30000, institutions: [{ name: 'Market Square', category: 'Economy' }, { name: 'Granary', category: 'Economy' }],
    config: { terrainType: 'plains', tradeRouteAccess: 'road', stressTypes: [] },
    economicState: { prosperity: 'Comfortable', primaryExports: [], primaryImports: ['Grain'], foodSecurity: { foodRecord: { foodSources: ['grain', 'livestock'] } } },
  });
  const GAP = Object.freeze({ dailyNeed: 1000, rawDeficit: 300, deficit: 0, importCoverage: 0.3 });

  it('the variant module stands', () => { expect(V).not.toBeNull(); });

  it('a seedless record prints exactly what it printed without its facts', () => {
    for (const tier of SIZES) {
      const bare = generateSettlementReason(tier, 'road', null, { terrainType: 'plains' }, GAP, { hasDocks: false });
      const withFacts = generateSettlementReason(tier, 'road', null, { terrainType: 'plains' }, GAP, { hasDocks: false, record: { ...RECORD, tier } });
      expect(withFacts, tier).toEqual(bare);
    }
  });

  it('variedReasonLines hands back the very lines it was given: no seed, no facts, no eligible wording', () => {
    expect(V).not.toBeNull();
    const ctx = (/** @type {Record<string, unknown>} */ over) => ({ tier: 'city', route: 'road', config: { terrainType: 'plains', _seed: 'b3-unit-1' }, foodBalance: GAP, roster: { hasDocks: false, record: RECORD }, seed: 'b3-unit-1', siege: false, hasFoodDeficit: true, originArmKey, originVariantKey, groundPhrase: GROUND_PHRASE, ...over });
    const lines = generateSettlementReason('city', 'road', null, { terrainType: 'plains' }, GAP, { hasDocks: false });
    expect(V.variedReasonLines(lines, ctx({ seed: undefined }))).toBe(lines); // no seed
    expect(V.variedReasonLines(lines, ctx({ roster: { hasDocks: false } }))).toBe(lines); // no facts
    // a city whose record answers no wording: no house, no terrain, no food source, nothing brought in
    const bareCity = { tier: 'city', institutions: [], config: { tradeRouteAccess: 'isolated', stressTypes: [] }, economicState: {} };
    expect(V.variedReasonLines(lines, ctx({ route: 'isolated', foodBalance: { ...GAP, importCoverage: 0 }, roster: { hasDocks: false, record: bareCity } }))).toBe(lines);
  });
});

describe('3. every printed wording holds on the final record', () => {
  it('needs hold and excludes do not, through drawDeclared (every printed wording over the 900 places)', () => {
    expect(V).not.toBeNull();
    expect(PRINTED.size, 'some new wording prints').toBeGreaterThan(0);
    expect(ADMIT_MISSES).toEqual([]);
  });
  it('the slots read the final record (the terrain, the export good, the route)', () => {
    expect(V).not.toBeNull();
    expect(SLOT_MISSES).toEqual([]);
  });
  it('the rows the chair re-worded stand as ruled (17:21, item 2; PEOPLE-1\'s fix kept)', () => {
    expect(V).not.toBeNull();
    const road8 = V.ORIGIN_VARIANTS.road[7];
    expect(road8.text).toBe('Built on the road across the open plain, among its own grain fields.');
    expect([...road8.needs].sort()).toEqual(['grain', 'terrain: plains']);
    expect(road8.excludes).toContain('famine');
    expect(V.SMALL_PLACE_VARIANTS[0].text).toBe('A few households {ground}, each with its own work.');
    const small4 = V.SMALL_PLACE_VARIANTS[3];
    expect(small4.text).toBe('Grain from their own fields feeds the households here.');
    expect(small4.needs).toContain('grain');
    expect(small4.excludes).toContain('famine');
    const mill = V.CITY_DEFICIT_VARIANTS.find((/** @type {any} */ r) => /^Grain from outside is ground here alongside its own/.test(r.text));
    expect(mill.needs).toEqual(expect.arrayContaining(['institution: mill', 'grain']));
  });
  it('a wording that names the place\'s own grain prints only where grain is its food source', () => {
    expect(V).not.toBeNull();
    expect(GRAIN_MISSES).toEqual([]);
  });
  it('every declared atom is an atom of the vocabulary', () => {
    expect(V).not.toBeNull();
    const bad = rowsOf(V).flatMap(({ pool, row }) => [...row.needs, ...row.excludes].filter((a) => !parseAtom(a)).map((a) => `${pool}: ${a}`));
    expect(bad).toEqual([]);
  });
});

describe('4. the hideable rule (the chair, 17:21, item 5)', () => {
  /** The vocabulary's crime dimensions: a wording may not need any of them. */
  const CRIME = new Set(['crime', 'organised crime', 'crime wave', 'rival rings', 'criminal income', 'court or gaol', 'prison']);
  it('no wording needs a fact about crime', () => {
    expect(V).not.toBeNull();
    const bad = rowsOf(V).flatMap(({ pool, row }) => row.needs.filter((/** @type {string} */ a) => CRIME.has(String(parseAtom(a)?.dimension))).map((/** @type {string} */ a) => `${pool}: ${a}`));
    expect(bad).toEqual([]);
  });
  it('every printed wording\'s needs still hold with the hideable houses taken off the roster (900 places)', () => {
    expect(V).not.toBeNull();
    expect(HIDEABLE_MISSES).toEqual([]);
  });
});
