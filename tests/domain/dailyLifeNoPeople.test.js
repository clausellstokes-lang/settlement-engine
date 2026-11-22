/**
 * tests/domain/dailyLifeNoPeople.test.js — DAILY-1 B1 C1, THE DEAD CALL (the chair's ruling of 2026-11-20 18:19).
 *
 * `dailyLife.js :: buildContext` built `npcs: deriveAllNpcProfiles(settlement)` (a read of every person's `secret`
 * and `plotHooks`) and no slot deriver read `ctx.npcs` (M1 table 6). The call and the field are removed. Two arms:
 *   (a) THE CALL: `deriveDailyLife` makes exactly as many `deriveAllNpcProfiles` calls as the substrate derivers it
 *       still builds make on their own. (`causalState.js :: deriveSocialTrust` asks for the dominant figures, so the
 *       count is not zero: what is pinned is that `dailyLife.js` adds no call of its own.)
 *   (b) THE TEXTS: on 30 born places (five a size, M1's births `hxd-<size>-0..4`), the eight slot texts equal the
 *       texts the PRE-change code printed (`tests/fixtures/daily-life-no-people-before.json`, taken from the code
 *       before the removal), and equal the texts derived from the place's `toPublicSafe` document.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

vi.mock('../../src/domain/npcProfile.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return { ...actual, deriveAllNpcProfiles: vi.fn(actual.deriveAllNpcProfiles) };
});

const { deriveAllNpcProfiles } = await import('../../src/domain/npcProfile.js');
const { deriveDailyLife, DAILY_LIFE_SLOTS } = await import('../../src/domain/dailyLife.js');
const { deriveAllFactionProfiles } = await import('../../src/domain/factionProfile.js');
const { deriveAllSupplyChainStates } = await import('../../src/domain/supplyChainState.js');
const { deriveAllActiveConditions } = await import('../../src/domain/activeConditions.js');
const { deriveAllThreatProfiles } = await import('../../src/domain/threatProfile.js');
const { deriveAllCapacities } = await import('../../src/domain/capacityModel.js');
const { deriveCausalState } = await import('../../src/domain/causalState.js');
const { deriveHistoryBeats } = await import('../../src/domain/historyBeats.js');
const { toPublicSafe } = await import('../../src/domain/display/publicSafe.js');
const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import('../../src/store/configSlice.js');

const BEFORE = JSON.parse(readFileSync(fileURLToPath(new URL('../fixtures/daily-life-no-people-before.json', import.meta.url)), 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];

/** @type {Array<{ seed: string, rec: any }>} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const size of SIZES) for (let i = 0; i < 5; i++) {
    const seed = `hxd-${size}-${i}`;
    births.push({ seed, rec: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} }) });
  }
}, 120_000);

const at = (/** @type {string} */ seed) => /** @type {{ seed: string, rec: any }} */ (births.find((b) => b.seed === seed));
/** @param {any} rec */
const textsOf = (rec) => { const life = deriveDailyLife(rec); return Object.fromEntries(DAILY_LIFE_SLOTS.map((k) => [k, life.slots[k].text])); };

describe('daily life reads no person of its own (the dead call removed)', () => {
  it('deriveDailyLife adds no deriveAllNpcProfiles call beyond the substrate derivers it builds', () => {
    const spy = /** @type {import('vitest').Mock} */ (/** @type {unknown} */ (deriveAllNpcProfiles));
    const failures = collectSeedFailures(births.map((b) => b.seed), (seed) => {
      const { rec } = at(seed);
      spy.mockClear();
      deriveAllFactionProfiles(rec); deriveAllSupplyChainStates(rec); deriveAllActiveConditions(rec); deriveAllThreatProfiles(rec);
      deriveAllCapacities(rec); deriveCausalState(rec); deriveHistoryBeats(rec);
      const substrate = spy.mock.calls.length;
      spy.mockClear();
      deriveDailyLife(rec);
      expect(spy.mock.calls.length, `${seed}: deriveDailyLife's own calls`).toBe(substrate);
    });
    expectNoSeedFailures(failures, 'deriveDailyLife adds no deriveAllNpcProfiles call of its own on any born place');
  });

  it('the fixture covers 30 born places, five of each size', () => {
    expect(births).toHaveLength(30);
    expect(Object.keys(BEFORE).sort()).toEqual(births.map((b) => b.seed).sort());
  });

  it('every slot text equals the pre-change text and the text on the toPublicSafe document', () => {
    const failures = collectSeedFailures(births.map((b) => b.seed), (seed) => {
      const { rec } = at(seed);
      const now = textsOf(rec);
      // DAILY-2 B1b C3 moved `gathering_places` by design (LINES-1 as the chair ruled): the parity of C1's removal holds
      // on the other seven slots; the eighth is held by `tests/domain/dailyLifeGathering.test.js` and the owner-vs-public check below.
      // DAILY-2 B2 D1 and D2 moved `dawn_work` and `child_warnings` by design the same way (LINES-1 / LINES-1b as ruled; held
      // by `dailyLifeDawn.test.js` and `dailyLifeChild.test.js`).
      const { gathering_places: _moved, dawn_work: _movedDawn, child_warnings: _movedChild, ...kept } = BEFORE[seed];
      const { gathering_places: _now, dawn_work: _nowDawn, child_warnings: _nowChild, ...nowKept } = now;
      expect(nowKept, `${seed}: before vs after`).toEqual(kept);
      expect(textsOf(toPublicSafe(rec)), `${seed}: owner vs toPublicSafe`).toEqual(now);
    });
    expectNoSeedFailures(failures, 'every born place keeps its pre-change texts and its toPublicSafe texts');
  });
});
