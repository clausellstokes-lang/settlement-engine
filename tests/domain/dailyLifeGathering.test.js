/**
 * tests/domain/dailyLifeGathering.test.js — DAILY-2 B1b C3, `gathering_places` BY LINES-1 AS RULED (the chair's rulings 7
 * and 12 of 2026-11-20; `lines/L1/LINES-1.md` § gathering_places, `LINES-1b.md`).
 *
 * THE RED (the B1 brief, C3): a born thorp M1 names (`hxd-thorp-0`) printed "the bridge" / "the open square" it lacks,
 * and a metropolis printed "Great cathedral" with no article or a bracketed qualifier. THE GREEN: on born places of every
 * size (M1's births `hxd-<size>-0..2`), the slot prints only a line of its branch's pool whose declared atoms the record
 * holds, every named house is a live, non-hideable, non-access row printed `the <noun>`, no bracket, and no M1 clause
 * the record cannot stand behind; the pick is `pickVariantMixed` over the eligible lines on the name key; a nameless
 * record takes index 0 of the eligible list; a place with no true line prints the EMPTY string (ruling 3).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveDailyLifeSlot } from '../../src/domain/dailyLife.js';
import { GATHERING_NAMED, GATHERING_PLAIN } from '../../src/data/dailyLife/gatheringPlaces.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { pickVariantMixed } from '../../src/kernel/proseHash.js';
import { institutionSentenceNoun } from '../../src/domain/display/institutionSentenceNoun.js';
import { isLiveInstitution, liveInstitutions } from '../../src/domain/institutions/institutionRoster.js';
import { ACCESS_ONLY } from '../../src/domain/facts/liveInstitutionNames.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** @type {Array<{ seed: string, rec: any }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 3; i++) {
    const seed = `hxd-${size}-${i}`;
    births.push({ seed, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
}, 120_000);

// M1's no-home record tests for today's plain clauses (`measures/M1/measure.m1.mjs`, copied)
const names = (/** @type {any} */ r) => liveInstitutions(r).map((i) => String(i?.name || '')).filter((n) => n && !ACCESS_ONLY.test(n));
const quarters = (/** @type {any} */ r) => (Array.isArray(r?.spatialLayout?.quarters) ? r.spatialLayout.quarters : []);
const marks = (/** @type {any} */ r) => quarters(r).flatMap((/** @type {any} */ q) => (Array.isArray(q?.landmarks) ? q.landmarks.map(String) : []));
const has = (/** @type {any} */ r, /** @type {RegExp} */ re) => names(r).some((n) => re.test(n)) || marks(r).some((l) => re.test(l))
  || quarters(r).some((/** @type {any} */ q) => re.test(String(q?.name || '')));
const at = (/** @type {string} */ seed) => /** @type {{ seed: string, rec: any }} */ (births.find((b) => b.seed === seed));
const text = (/** @type {any} */ rec) => /** @type {import('../../src/domain/dailyLife.js').DailyLifeSlot} */ (deriveDailyLifeSlot('gathering_places', rec)).text;
/** the pool line a printed text came from (each `{house}` any words), the liveness anchor of every exclusion below */
const lineOf = (/** @type {string} */ t) => [...GATHERING_NAMED, ...GATHERING_PLAIN]
  .find((l) => new RegExp(`^${l.text.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\\?\{\w+\\?\}/g, '.+')}$`).test(t));

describe('the red: the falsest gathering lines M1 found', () => {
  it('hxd-thorp-0 prints no bridge and no open square it lacks', () => {
    const { rec } = at('hxd-thorp-0');
    const t = text(rec);
    expect(lineOf(t), `"${t}"`).toBeTruthy();
    // anchored: the same text is pinned live on the line above (a line of its pool)
    if (!has(rec, /\bbridges?\b/i)) expect(t).not.toMatch(/the bridge/);
    // anchored: the same text is pinned live at this test's head (a line of its pool)
    if (!has(rec, /\bsquares?\b|\bplaza\b|\bgreen\b/i)) expect(t).not.toMatch(/the open square/);
  });
  it('a metropolis names its houses with the article and no bracket (hxd-metropolis-0..2)', () => {
    const failures = collectSeedFailures(['hxd-metropolis-0', 'hxd-metropolis-1', 'hxd-metropolis-2'], (seed) => {
      const s = /** @type {any} */ (deriveDailyLifeSlot('gathering_places', at(seed).rec));
      expect(lineOf(s.text), `${seed}: "${s.text}"`).toBeTruthy();
      // anchored: the same text is pinned live on the line above (a line of its pool)
      expect(s.text, seed).not.toMatch(/[()]/);
      // anchored: the same text is pinned live two lines above (a line of its pool)
      expect(s.text, seed).not.toMatch(/(?<!the )\b[A-Z]\w+ cathedral\b/);
      for (const ref of s.references) expect(s.text, `${seed}: ${ref.label}`).toContain(`the ${institutionSentenceNoun(ref.label)}`);
    });
    expectNoSeedFailures(failures, 'every born metropolis names its houses with the article and no bracket');
  });
});

describe('the route on born places (ruling 12): eligible by declared atoms, then the keyed pick', () => {
  it('every place prints a line of its pool whose atoms it holds, its houses live, nameable and said with "the"', () => {
    const lines = [...GATHERING_NAMED, ...GATHERING_PLAIN];
    const failures = collectSeedFailures(births.map((b) => b.seed), (seed) => {
      const { rec } = at(seed);
      const s = /** @type {any} */ (deriveDailyLifeSlot('gathering_places', rec));
      if (!s.text) return;
      const branch = s.references.length ? 'named' : 'plain';
      const eligible = filterDeclared(branch === 'named' ? GATHERING_NAMED : GATHERING_PLAIN, { facts: factsOf(rec) });
      const own = lines.find((l) => new RegExp(`^${l.text.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\\?\{\w+\\?\}/g, '.+')}$`).test(s.text));
      expect(own, `${seed}: "${s.text}"`).toBeTruthy();
      expect(eligible, `${seed}: ${own?.id} is eligible`).toContain(own);
      for (const ref of s.references) {
        const row = (rec.institutions || []).find((/** @type {any} */ i) => i?.id === ref.id || i?.name === ref.label);
        expect(row && isLiveInstitution(row) && !isHideableHouse(row) && !ACCESS_ONLY.test(String(row.name)), `${seed}: ${ref.label}`).toBe(true);
      }
      // anchored: the same text is pinned live above (`own`, a line of its pool, checked truthy and eligible)
      expect(s.text, seed).not.toMatch(/\btowns?\b/i);
    });
    expectNoSeedFailures(failures, 'every born place prints an eligible line of its pool, its houses live and nameable');
  });
  it('the pick is pickVariantMixed over the eligible lines on `<name>::dailyLife.gathering_places::<branch>`', () => {
    const plain = { name: 'Ashby', tier: 'thorp', institutions: [{ name: 'Water source' }, { name: 'Dwellings (1-8)' }, { name: 'Subsistence farming' }] };
    const eligible = filterDeclared(GATHERING_PLAIN, { facts: factsOf(plain) });
    // D5C-2 phase B appended P16 to P20 (`lines/D4C/DRAFT-2.md`); by the chair's ruling (b) of 2026-11-23 01:57 UTC each
    // needs `institution: dwellings` at least, and this thorp holds dwellings, water and fields, so all five are eligible here
    expect(eligible.map((l) => l.id)).toEqual(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P16', 'P17', 'P18', 'P19', 'P20']);
    expect(text(plain)).toBe(/** @type {any} */ (pickVariantMixed(eligible, 'Ashby::dailyLife.gathering_places::plain')).text);
    expect(text({ ...plain, name: undefined })).toBe(eligible[0].text);
  });
  it('a named place: N0 (today\'s, reworded) at index 0 for a nameless record holding a church, a market and an inn', () => {
    // the house said through `institutionSentenceNoun` (the label seam: a parish church reads "house of worship"; the bracket struck)
    const rec = { institutions: [{ id: 'a', name: 'Parish church' }, { id: 'b', name: 'Weekly market' }, { id: 'c', name: 'Inn (multiple)' }] };
    expect(text(rec)).toBe('By midday people are gathered on the steps of the house of worship, at the weekly market and at the inn: talking, trading, and watching.');
  });
  it('a place with no true line prints the EMPTY string (ruling 3), and a thorp without fields is never told of them', () => {
    expect(text({ name: 'Nowhere', institutions: [] })).toBe('');
    const town = { name: 'Brigg', tier: 'town', institutions: [{ name: 'Water source' }, { name: 'Farmland' }] };
    const t = text(town);
    expect(lineOf(t), `"${t}"`).toBeTruthy();
    // anchored: the same text is pinned live on the line above (a line of its pool)
    expect(t).not.toMatch(/fields?\b/);
  });
});
