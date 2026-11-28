/**
 * tests/domain/close7SickCare.test.js — R24-A1 (CLOSE-7; the chair's RULING-R24 and its ruling R24a on CHAIN-1-LISTS,
 * 2026-11-24): SICK CARE AT HAND, ONE READING.
 *
 * Three readings of "is there someone here who tends the sick" disagreed: a house by its name (`sick house`), a service
 * by its category, the capacity's count. The one fact (`sick care`, `facts/sickCare.js`): a sick house by name, OR a
 * RESIDENT service (its house on the live roster, never an "Access to" row) whose catalogue row tends the sick
 * (`tendsSick` on the row, `data/institutionServices.js`; the chair's 25 names). Every line that says no healer stands
 * here (H2, H3, H7, H8, H9 of `OUTSIDER_IMPRESSIONS['services.healing']`) excludes it.
 *
 *   (a) RED FIRST, BY NAME: the 13 births of the census 900 (C: `birthConfig({ settType })`) and the 26 of the visitor
 *       900 (V: `birthConfig({ ...DEFAULT_CONFIG, settType, _randomizePriorities: true })`, `close-7/read24/
 *       make-visitor-plan.mjs`) whose page printed a no-healer line beside resident sick care at d447ee31e
 *       (`close-7/chain-1/a1-pattern-before-{C,V}.tsv`): each holds sick care, and its Daily Life prints none of the five.
 *   (b) the reader on planted records: each arm, and what is not care (a birth alone, an "Access to" row, a ruin).
 *   (c) NO NEW WORDS (R24a): where the lens is strained and care is at hand, H4, H5 and H6 stay eligible; H0 and H1
 *       stay on `sick house`.
 *   (d) THE LINT ARM (R24a: "the set of flagged names derived from the rows, with the lint arm"): a drawn service keeps
 *       its name and its house, not its row, so the reader tests the NAME; that is exact only while every row of a flagged
 *       name is flagged. And the flagged names are the chair's 25, the struck five on no row.
 *   (e) THE DOOR: the leaf rides lazy, beside `facts/factsOf.js` (vite.config.js :: FIRSTPAINT2_LAZY_DOMAIN), so the
 *       catalogue it reads stays out of first paint.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { join, resolve } from 'node:path';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveDailyLife } from '../../src/domain/dailyLife.js';
import { OUTSIDER_IMPRESSIONS } from '../../src/data/dailyLife/outsiderImpressions.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { atomHolds } from '../../src/domain/facts/factVocabulary.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { INSTITUTION_SERVICES, TENDS_SICK_SERVICE_NAMES } from '../../src/data/institutionServices.js';

const HEALING = OUTSIDER_IMPRESSIONS['services.healing'];
const NO_HEALER_IDS = Object.freeze(['H2', 'H3', 'H7', 'H8', 'H9']);
const NO_HEALER = HEALING.filter((l) => NO_HEALER_IDS.includes(l.id));

/** The pattern's births at d447ee31e, by name (the join of READ-24's records and renders; R24a: "your 13 (C) and 26 (V)"). */
const C_SEEDS = Object.freeze(['dp-village-50', 'dp-village-103', 'dp-village-124', 'dp-village-136', 'dp-town-28', 'dp-town-109',
  'dp-town-144', 'dp-city-3', 'dp-city-28', 'dp-city-36', 'dp-city-71', 'dp-city-91', 'dp-city-140']);
const V_SEEDS = Object.freeze(['dp-village-3', 'dp-village-33', 'dp-village-53', 'dp-village-59', 'dp-village-83', 'dp-village-124',
  'dp-village-130', 'dp-town-11', 'dp-town-24', 'dp-town-39', 'dp-town-48', 'dp-town-58', 'dp-town-64', 'dp-town-91', 'dp-town-109',
  'dp-city-18', 'dp-city-21', 'dp-city-29', 'dp-city-62', 'dp-city-70', 'dp-city-89', 'dp-metropolis-38', 'dp-metropolis-80',
  'dp-metropolis-109', 'dp-metropolis-114', 'dp-metropolis-133']);
/** @param {string} seed */
const sizeOf = (seed) => seed.split('-')[1];

/** @param {string} seed @param {'C'|'V'} corpus */
function birth(seed, corpus) {
  const settType = sizeOf(seed);
  const config = corpus === 'C' ? { settType } : { ...DEFAULT_CONFIG, settType, _randomizePriorities: true };
  return generateSettlementPipeline(birthConfig(config), null, { seed, customContent: {} });
}

/** Every Daily Life slot's text, as the owner's tab derives it. @param {unknown} s */
const dailyText = (s) => Object.values(deriveDailyLife(/** @type {any} */ (s), { audience: 'owner' }).slots || {}).map((x) => String(x?.text || '')).join('\n');

beforeAll(async () => { await loadGenerationLawPayloads(); }, 120000);

describe('(a) red first, by name: no no-healer line beside resident sick care (the five of C and V)', () => {
  it('the pattern\'s five lines are the pool\'s own, each excluding the one fact', () => {
    expect(NO_HEALER.map((l) => l.id)).toEqual(NO_HEALER_IDS);
    for (const l of NO_HEALER) expect(l.excludes, l.id).toContain('sick care');
  });
  for (const [corpus, seeds] of /** @type {const} */ ([['C', C_SEEDS], ['V', V_SEEDS]])) {
    for (const seed of seeds) {
      it(`${corpus} ${seed}`, () => {
        const s = birth(seed, corpus);
        const said = NO_HEALER.filter((l) => dailyText(s).includes(l.text)).map((l) => l.id);
        expect({ seed, said }).toEqual({ seed, said: [] });
        expect(atomHolds('sick care', factsOf(s)), seed).toBe(true);
      }, 120000);
    }
  }
});

describe('(b) the one reading, on planted records', () => {
  const rec = (/** @type {string[]} */ houses, /** @type {Array<[string, string]>} */ services) => ({
    tier: 'village', institutions: houses.map((name) => ({ name })),
    availableServices: { healing: services.map(([name, institution]) => ({ name, desc: '', institution })) },
  });
  it('a resident service whose row tends the sick: a priest who heals, a midwife who dresses wounds, an apothecary\'s remedies', () => {
    expect(atomHolds('sick care', factsOf(rec(['Priest (resident)'], [['Healing', 'Priest (resident)']])))).toBe(true);
    expect(atomHolds('sick care', factsOf(rec(['Midwife'], [['Basic wound care', 'Midwife']])))).toBe(true);
    expect(atomHolds('sick care', factsOf(rec(['Apothecary (established)'], [['Herbal remedies', 'Apothecary (established)']])))).toBe(true);
  });
  it('a sick house by name holds it with no service drawn', () => {
    expect(atomHolds('sick care', factsOf(rec(['Healer (divine, 1st level)'], [])))).toBe(true);
    expect(atomHolds('sick care', factsOf(rec(['Small hospital'], [])))).toBe(true);
  });
  it('not care: a birth alone (the chair\'s strike), a rite, a burial, an "Access to" row, a house not on the roster', () => {
    expect(atomHolds('sick care', factsOf(rec(['Midwife'], [['Birth assistance', 'Midwife']])))).toBe(false);
    expect(atomHolds('sick care', factsOf(rec(['Priest (resident)', 'Burial ground'], [['Religious services', 'Priest (resident)'], ['Burial', 'Burial ground']])))).toBe(false);
    expect(atomHolds('sick care', factsOf(rec(['Access to apothecary'], [['Herbal remedies', 'Access to apothecary']])))).toBe(false);
    expect(atomHolds('sick care', factsOf(rec(['Mill'], [['Herbal remedies', 'Apothecary']])))).toBe(false);
    expect(atomHolds('sick care', factsOf(rec([], [])))).toBe(false);
  });
  it('a ruined house is no resident (the live roster)', () => {
    const r = rec(['Apothecary'], [['Herbal remedies', 'Apothecary']]);
    r.institutions[0] = { name: 'Apothecary', status: 'ruined' };
    expect(atomHolds('sick care', factsOf(r))).toBe(false);
  });
});

describe('(c) no new words (R24a): where care is here and short, the pool still holds its true lines', () => {
  it('H4, H5 and H6 stay eligible beside resident care; the five and H0, H1 do not', () => {
    const facts = factsOf({ tier: 'village', institutions: [{ name: 'Priest (resident)' }],
      availableServices: { healing: [{ name: 'Healing', desc: '', institution: 'Priest (resident)' }] } });
    expect(atomHolds('sick house', facts)).toBe(false);
    expect(filterDeclared(HEALING, { facts, poolId: 'test', surface: 'dailyLife' }).map((l) => l.id)).toEqual(['H4', 'H5', 'H6']);
    expect(HEALING.filter((l) => ['H0', 'H1'].includes(l.id)).map((l) => l.needs)).toEqual([['sick house'], ['sick house']]);
  });
});

/** The chair's list (R24a: "THE LIST: 25 NAMES"): READ-24's thirty less Birth assistance, Midwifery, Quarantine, Antitoxins, Poison antidotes. */
const CHAIRS_25 = Object.freeze(['Basic wound care', 'Compound medicines', 'Emergency treatment', 'Fever and illness', 'Healing',
  'Healing (nature)', 'Healing herbs', 'Herbal medicines', 'Herbal remedies', 'Herbalism and healing', 'Higher healing',
  'Long-term recovery', 'Medical care (basic)', 'Medical consultation', 'Medical treatment', 'Medicines and compounds',
  'Recovery wards', 'Remove minor disease', 'Specialist care', 'Specialist compounds', 'Specialist physicians', 'Surgery',
  'Surgical procedures', 'Wound closing', 'Wound treatment']);
/** Struck by the chair, each with its reason: on no row. */
const STRUCK = Object.freeze({
  'Birth assistance': 'a birth alone does not make a healer (R24)',
  Midwifery: 'the same strike, births alone (R24a)',
  Quarantine: 'isolation, not care (R24a)',
  Antitoxins: 'goods on a shelf; it would make a delving-supply district a healer (R24a)',
  'Poison antidotes': 'goods on a shelf (R24a)',
});
/** Every catalogue row: [house, service, def]. */
const ROWS = Object.entries(INSTITUTION_SERVICES).flatMap(([house, menu]) => Object.entries(menu).map(([name, def]) => /** @type {const} */ ([house, name, /** @type {any} */ (def)])));

describe('(d) the lint arm: the flag is the rows\' own, and the name set is exact', () => {
  it('every row of a flagged name is flagged', () => {
    const flagged = new Set(ROWS.filter(([, , def]) => def?.tendsSick === true).map(([, name]) => name));
    expect(ROWS.filter(([, name, def]) => flagged.has(name) && def?.tendsSick !== true).map(([house, name]) => `${house} :: ${name}`)).toEqual([]);
  });
  it('the flag is `true` or absent, never another value', () => {
    expect(ROWS.filter(([, , def]) => def && 'tendsSick' in def && def.tendsSick !== true).map(([house, name]) => `${house} :: ${name}`)).toEqual([]);
  });
  it('the exported name set is the rows\' reading, and it is the chair\'s 25 on 28 rows', () => {
    const fromRows = [...new Set(ROWS.filter(([, , def]) => def?.tendsSick === true).map(([, name]) => name))].sort();
    expect([...TENDS_SICK_SERVICE_NAMES].sort()).toEqual(fromRows);
    expect(fromRows).toEqual([...CHAIRS_25].sort());
    expect(ROWS.filter(([, , def]) => def?.tendsSick === true).length).toBe(28);
  });
  it('the struck names are catalogue names, flagged on no row', () => {
    for (const [name, why] of Object.entries(STRUCK)) {
      expect(ROWS.some(([, n]) => n === name), `${name} is a catalogue name`).toBe(true);
      expect(ROWS.filter(([, n, def]) => n === name && def?.tendsSick === true).map(([h]) => h), `${name}: ${why}`).toEqual([]);
    }
  });
});

describe('(e) the door: the leaf rides lazy, beside factsOf', () => {
  it('the eager first-paint graph holds neither the leaf nor the catalogue; manualChunks routes the leaf where factsOf rides', async () => {
    const ROOT = resolve(__dirname, '../..');
    const LEAF_REL = 'src/domain/facts/sickCare.js';
    const vite = await import('../../vite.config.js');
    const eager = new Set([...vite.EAGER_FIRST_PAINT_MODULES].map((abs) => abs.slice(ROOT.length + 1)));
    expect(eager.has('src/domain/facts/factVocabulary.js')).toBe(true);
    expect(eager.has(LEAF_REL)).toBe(false);
    expect(eager.has('src/data/institutionServices.js')).toBe(false);
    expect(vite.FIRSTPAINT2_LAZY_DOMAIN).toContain(`/${LEAF_REL}`);
    const manualChunks = vite.default.build.rollupOptions.output.manualChunks;
    const route = (/** @type {string} */ f) => manualChunks(join(ROOT, f), { getModuleInfo: () => null, getModuleIds: () => [][Symbol.iterator]() }) ?? null;
    expect(route('src/domain/facts/factsOf.js')).toBe('coherence-lazy');
    expect(route(LEAF_REL)).toBe('coherence-lazy');
  });
});
