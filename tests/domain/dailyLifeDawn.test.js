/**
 * tests/domain/dailyLifeDawn.test.js — DAILY-2 B2 D1, `dawn_work` BY LINES-1 / LINES-1b AS RULED (the chair's rulings 8,
 * 9 and 11 of 2026-11-20; `lines/L1/LINES-1.md` § dawn_work, `LINES-1b.md`).
 *
 * THE RED (the B2 brief, D1): M1's `hxd-thorp-0` printed "The walls claim the first hours: the watch musters thin …"
 * with no walls and no watch (the defence branch taken from a rating), and a hamlet with no bakery (`hxd-hamlet-7`)
 * printed "Bakers light their ovens first …". THE GREEN: on born places of every size (M1's births `hxd-<size>-0..2`),
 * the slot prints only a line of its branch's pool whose declared atoms the record holds, its houses live, non-hideable,
 * non-access rows said `the <noun>`; the defence pool only under a real outside threat at medium or above (ruling 8);
 * a calm thorp or hamlet holds >= 7 eligible default lines; the pick is `pickRendezvous` over the eligible lines on
 * `<name>::dailyLife.dawn_work::<branch>`; a nameless record takes index 0; no true line gives the EMPTY string (ruling 3).
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { deriveDailyLifeSlot } from '../../src/domain/dailyLife.js';
import { DAWN_WORK } from '../../src/data/dailyLife/dawnWork.js';
import { filterDeclared } from '../../src/domain/facts/drawDeclared.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { deriveAllCapacities } from '../../src/domain/capacityModel.js'; // CLOSE-7 THE MIRROR: the profile the pools' `food production` atom reads
import { defenceOf } from '../../src/domain/facts/defence.js';
import { hasInstitution } from '../../src/domain/facts/institutions.js';
import { deriveAllThreatProfiles } from '../../src/domain/threatProfile.js';
import { pickRendezvous } from '../../src/kernel/proseHash.js';
import { isLiveInstitution } from '../../src/domain/institutions/institutionRoster.js';
import { ACCESS_ONLY } from '../../src/domain/facts/liveInstitutionNames.js';
import { isHideableHouse } from '../../src/domain/people/cardVeil.js';
import { institutionSentenceNoun } from '../../src/domain/display/institutionSentenceNoun.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** @type {Array<{ seed: string, size: string, rec: any }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  const seeds = SIZES.flatMap((size) => [0, 1, 2].map((i) => [size, `hxd-${size}-${i}`]));
  seeds.push(['hamlet', 'hxd-hamlet-7']);
  for (const [size, seed] of seeds) {
    births.push({ seed, size, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
}, 120_000);

const at = (/** @type {string} */ seed) => /** @type {{ seed: string, size: string, rec: any }} */ (births.find((b) => b.seed === seed));
const slotOf = (/** @type {any} */ rec) => /** @type {import('../../src/domain/dailyLife.js').DailyLifeSlot} */ (deriveDailyLifeSlot('dawn_work', rec));
const POOLS = DAWN_WORK;
/** a pool line's text as a pattern (each `{house}` any words) */
const patternOf = (/** @type {string} */ t) => new RegExp(`^${t.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\\?\{\w+\\?\}/g, '.+')}$`);
/** the branch and line a printed text came from */
const ownLine = (/** @type {string} */ text) => {
  for (const [branch, pool] of Object.entries(POOLS)) { const line = pool.find((l) => patternOf(l.text).test(text)); if (line) return { branch, line }; }
  return null;
};
const OUTSIDE = ['siege', 'monster_pressure', 'bandit_raids', 'rival_neighbor'];
const outsideThreat = (/** @type {any} */ rec) => deriveAllThreatProfiles(rec).some((t) => OUTSIDE.includes(t.type) && ['medium', 'high', 'critical'].includes(t.severityBand));

describe('the red: the falsest dawn lines M1 found', () => {
  it('hxd-thorp-0 prints no walls and no watch it lacks', () => {
    const { rec } = at('hxd-thorp-0');
    const text = slotOf(rec).text;
    expect(ownLine(text), `"${text}"`).toBeTruthy();
    // anchored: the same text is pinned live on the line above (a line of its branch's pool)
    if (!defenceOf(rec).walls) expect(text).not.toMatch(/\bwalls\b/i);
    // anchored: the same text is pinned live at this test's head (a line of its branch's pool)
    if (!factsOf(rec).guardPresence) expect(text).not.toMatch(/\bthe watch\b/i);
  });
  it('a hamlet with no bakery (hxd-hamlet-7) is not told the bakers light their ovens', () => {
    const { rec } = at('hxd-hamlet-7');
    expect(hasInstitution(rec, 'bakery')).toBe(false);
    const text = slotOf(rec).text;
    expect(ownLine(text), `"${text}"`).toBeTruthy();
    // anchored: the same text is pinned live on the line above (a line of its branch's pool)
    expect(text).not.toMatch(/\bbakers?\b/i);
  });
});

describe('the route on born places (ruling 11): eligible by declared atoms, then the keyed pick', () => {
  it('every place prints a line of its branch\'s pool whose atoms it holds, its houses live, nameable and said with "the"', () => {
    const failures = collectSeedFailures(births.map((b) => b.seed), (seed) => {
      const { rec } = at(seed);
      const s = slotOf(rec);
      if (!s.text) return;
      const own = ownLine(s.text);
      expect(own, `${seed}: "${s.text}"`).toBeTruthy();
      const { branch, line } = /** @type {{ branch: string, line: any }} */ (own);
      // CLOSE-7 THE MIRROR: the deriver hands the pools the capacity profile (`food production`, K1 and F6), so the oracle does
      expect(filterDeclared(POOLS[/** @type {keyof typeof POOLS} */ (branch)], { facts: factsOf(rec), ctx: { capacities: deriveAllCapacities(rec) } }), `${seed}: ${line.id} is eligible`).toContain(line);
      for (const ref of s.references.filter((r) => r.type === 'institution')) {
        const row = (rec.institutions || []).find((/** @type {any} */ i) => i?.id === ref.id || i?.name === ref.label);
        expect(row && isLiveInstitution(row) && !isHideableHouse(row) && !ACCESS_ONLY.test(String(row.name)), `${seed}: ${ref.label}`).toBe(true);
        expect(s.text, `${seed}: ${ref.label}`).toContain(`the ${institutionSentenceNoun(ref.label)}`);
      }
      // anchored: the same text is pinned live above (`own`, a line of its branch's pool, checked truthy and eligible)
      expect(s.text, seed).not.toMatch(/[()]|\btowns?\b/i);
    });
    expectNoSeedFailures(failures, 'every born place prints an eligible line of its branch\'s pool, its houses live and said with "the"');
  });
  it('the defence pool is taken only under a real outside threat at medium or above (ruling 8)', () => {
    const failures = collectSeedFailures(births.map((b) => b.seed), (seed) => {
      const { rec } = at(seed);
      const own = ownLine(slotOf(rec).text);
      if (own?.branch === 'defence') expect(outsideThreat(rec), seed).toBe(true);
    });
    expectNoSeedFailures(failures, 'a born place takes the defence pool only under a real outside threat at medium or above');
  });
  it('a calm thorp or hamlet holds at least seven eligible default lines (ruling 8)', () => {
    const failures = collectSeedFailures(births.map((b) => b.seed), (seed) => {
      const { size, rec } = at(seed);
      if (size !== 'thorp' && size !== 'hamlet') return;
      expect(filterDeclared(DAWN_WORK.default, { facts: factsOf(rec) }).length, seed).toBeGreaterThanOrEqual(7);
    });
    expectNoSeedFailures(failures, 'every born thorp and hamlet holds at least seven eligible default lines');
  });
  it('the pick is pickRendezvous (D13 STABLE-PICKS) over the eligible lines on `<name>::dailyLife.dawn_work::<branch>`; a nameless record takes index 0', () => {
    const calm = { name: 'Ashby', tier: 'thorp', institutions: [{ name: 'Water source' }, { name: 'Dwellings (1-8)' }, { name: 'Subsistence farming' }] };
    const text = slotOf(calm).text;
    const own = /** @type {{ branch: string, line: any }} */ (ownLine(text));
    expect(own, text).toBeTruthy();
    const eligible = filterDeclared(POOLS[/** @type {keyof typeof POOLS} */ (own.branch)], { facts: factsOf(calm) });
    expect(text).toBe(/** @type {any} */ (pickRendezvous(eligible, `Ashby::dailyLife.dawn_work::${own.branch}`, (/** @type {any} */ l) => l.id)).text);
    expect(slotOf({ ...calm, name: undefined }).text).toBe(eligible[0].text);
  });
  it('a calm place with no true line prints the EMPTY string (ruling 3)', () => {
    expect(slotOf({ name: 'Nowhere', tier: 'town', institutions: [] }).text).toBe('');
  });
});
