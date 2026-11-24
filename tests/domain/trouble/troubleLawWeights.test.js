/**
 * troubleLawWeights.test.js — THE TROUBLE LAW'S THREE WEIGHTS, AND THE DRAW COUNT, EXECUTED
 * (lane KINDS-1, unit K1; the brief's MANIFEST item 7, proofs (iii) and (iv)).
 *
 * (iv) THE WEIGHTS. Each of `crimeWaveChance`, `guildConflictChance` and `smallPlaceCrimeChance` sits at
 *      its row's floor at or below `readLow`, at its ceiling at or above `readHigh`, at the row's
 *      midpoint for an absent read (`undefined`, `null`, `NaN`, any non-number), and NO finite read
 *      from -1e9 to 1e9 yields 0 or 1 (the owner's rule: no read alone determines a trouble).
 *
 * (iii) THE DRAW COUNT, EXECUTED. Under law 2 the crime coin (a) and the guild swap (b) are thresholds on
 *      the SAME `_rng()` call as law 1's (none added, none removed). With the leaf mocked so law 2's
 *      crime row is the constant 0.5 and its guild row the constant 0.3 (floor = ceiling: law 1's own
 *      bars, 1 - 0.5 and 1 - 0.3), a birth under law 2 of each of 20 visitor seeds a size for town, city
 *      and metropolis (where (c) never runs) is deep-equal to the same birth under law 1 except the
 *      `_troubleLawVersion` marker itself: any draw added or removed at (a) or (b) shifts the stream and
 *      reds it. A control with the crime constant moved proves the comparison discriminates.
 *      THE SMALL PLACE (c): law 2 gains ONE coin, drawn only where today's branch fires. With its chance
 *      ~1, a small place whose (c) fires keeps the crime wave, and "exactly one" is shown on the WHOLE
 *      seeded stream: the pipeline's step PRNG is handed on behind a proxy (a mocked `setActiveRng`) that
 *      logs every draw by its caller's source line. Law 1's and law 2's logs agree draw for draw up to
 *      their first difference, that difference is law 2's coin at (c)'s own line, and (c)'s line draws
 *      once under law 2 and never under law 1.
 *
 * Births are K0's visitor births (`docs/chair/2026-11-20/content/kinds/measure-kinds.mjs :: birth`):
 * `{ ...DEFAULT_CONFIG, settType, the four empty toggle bags, _randomizePriorities: true }`, the content
 * runtime options from the real custom-content slice, `loadGenerationLawPayloads()` first, then
 * `generateSettlementPipeline({ ...birthConfig(config), _troubleLawVersion: <1 or 2> }, null, { seed, ...runtime })`.
 * EVERY BIRTH HERE FORCES ITS LAW IN ITS OWN CONFIG (1 or 2, or the key deleted for the "absent" arm), so the
 * later flip of the dial (`NEW_SETTLEMENT_TROUBLE_LAW_VERSION`) cannot red this file: the one test that follows
 * the dial is the wiring file's "1. CREATE (dark)". No stored digest of a birth: every proof is a differential
 * of two births in this one tree.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import {
  LAW_ONE_TROUBLE_BARS,
  TROUBLE_LAW_CONFIG_KEY,
  TROUBLE_WEIGHT_TUNING,
  crimeWaveBar,
  crimeWaveChance,
  economyPowersOf,
  guildConflictChance,
  guildSwapBar,
  smallPlaceCrimeChance,
  troubleChance,
} from '../../../src/domain/trouble/troubleLaw.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

const LEAF_SPEC = '../../../src/domain/trouble/troubleLaw.js';
const RNG_SPEC = '../../../src/kernel/rngContext.js';
const HISTORY_REL = 'src/generators/historyGenerator.js';

// ── (iv) THE WEIGHTS ──────────────────────────────────────────────────────────────────────────────
const WEIGHTS = Object.freeze([
  ['crimeWave', crimeWaveChance],
  ['guildConflict', guildConflictChance],
  ['smallPlaceCrime', smallPlaceCrimeChance],
]);

describe('(iv) the three weights: floor, ceiling, midpoint, and never 0 or 1', () => {
  for (const [name, weight] of WEIGHTS) {
    const row = TROUBLE_WEIGHT_TUNING[name];
    const mid = (row.floor + row.ceiling) / 2;

    it(`${name}: the floor at or below readLow (${row.readLow})`, () => {
      for (const read of [row.readLow, row.readLow - 0.5, row.readLow - 1, row.readLow - 1000, -1e9]) {
        expect(weight(read), `${name}(${read})`).toBeCloseTo(row.floor, 12);
        expect(troubleChance(row, read)).toBe(weight(read));
      }
    });

    it(`${name}: the ceiling at or above readHigh (${row.readHigh})`, () => {
      for (const read of [row.readHigh, row.readHigh + 0.5, row.readHigh + 1, row.readHigh + 1000, 1e9]) {
        expect(weight(read), `${name}(${read})`).toBeCloseTo(row.ceiling, 12);
        expect(troubleChance(row, read)).toBe(weight(read));
      }
    });

    it(`${name}: the midpoint for an absent read (undefined, null, NaN, a non-number)`, () => {
      for (const read of [undefined, null, Number.NaN, Infinity, -Infinity, '50', {}, true]) {
        expect(weight(read), `${name}(${String(read)})`).toBeCloseTo(mid, 12);
      }
      // …and the read range's own middle lands on the same midpoint (the line is straight).
      expect(weight((row.readLow + row.readHigh) / 2)).toBeCloseTo(mid, 12);
    });

    it(`${name}: no finite read from -1e9 to 1e9 yields 0 or 1, and the weight never falls as the read rises`, () => {
      const reads = [];
      for (let e = 0; e <= 9; e++) reads.push(-(10 ** e), 10 ** e);
      for (let r = row.readLow - 50; r <= row.readHigh + 50; r += 0.25) reads.push(r);
      reads.push(0, -0, Number.MIN_VALUE, -Number.MIN_VALUE);
      reads.sort((a, b) => a - b);
      const outOfBounds = reads.filter((read) => !(weight(read) > 0 && weight(read) < 1));
      expect(outOfBounds, `${name}: a read alone set the chance to 0 or 1`).toEqual([]);
      const falls = reads.filter((read, i) => i > 0 && weight(read) < weight(reads[i - 1]));
      expect(falls).toEqual([]);
    });
  }
});

describe('(iv) the two bars the generator compares its draw against: today\'s numbers under law 1, 1 - the weight under law 2', () => {
  const LAW2 = Object.freeze({ [TROUBLE_LAW_CONFIG_KEY]: 2 });
  const economy = (criminalEffective) => ({ compound: { criminalEffective } });
  const roster = (n) => Array.from({ length: n }, (_, i) => ({ faction: `p${i}`, category: 'economy' }))
    .concat([{ faction: 'x', category: 'military' }, { faction: 'y' }]);

  it('law 1 (absent, 1, a string, an unshipped 3) is today\'s 0.5 and 0.7, whatever the reads', () => {
    expect(LAW_ONE_TROUBLE_BARS).toEqual({ crimeWave: 0.5, guildSwap: 0.7 });
    for (const config of [{}, null, undefined, { [TROUBLE_LAW_CONFIG_KEY]: 1 }, { [TROUBLE_LAW_CONFIG_KEY]: '2' }, { [TROUBLE_LAW_CONFIG_KEY]: 3 }]) {
      for (const read of [undefined, 0, 50, 1e9]) {
        expect(crimeWaveBar(config, economy(read))).toBe(0.5);
        expect(guildSwapBar(config, roster(read === undefined ? 0 : 3))).toBe(0.7);
      }
      expect(crimeWaveBar(config, null)).toBe(0.5);
      expect(guildSwapBar(config, undefined)).toBe(0.7);
    }
  });

  it('law 2 is 1 minus the row\'s weight on the read, an absent crime read the midpoint, an empty roster the floor', () => {
    for (const read of [-5, 0, 20, 37.5, 60, 100, 250]) {
      expect(crimeWaveBar(LAW2, economy(read))).toBe(1 - crimeWaveChance(read));
    }
    expect(crimeWaveBar(LAW2, null)).toBe(1 - crimeWaveChance(undefined));
    expect(crimeWaveBar(LAW2, {})).toBeCloseTo(1 - (TROUBLE_WEIGHT_TUNING.crimeWave.floor + TROUBLE_WEIGHT_TUNING.crimeWave.ceiling) / 2, 12);
    for (const n of [0, 1, 2, 3, 4, 7]) {
      expect(economyPowersOf(roster(n))).toBe(n);
      expect(guildSwapBar(LAW2, roster(n))).toBe(1 - guildConflictChance(n));
    }
    expect(economyPowersOf(null)).toBe(0);
    expect(guildSwapBar(LAW2, [])).toBeCloseTo(1 - TROUBLE_WEIGHT_TUNING.guildConflict.floor, 12);
    // Law 2 only lowers a chance: its bar is never below law 1's.
    for (const read of [-1e9, 0, 50, 1e9, undefined]) expect(crimeWaveBar(LAW2, economy(read)) >= 0.5).toBe(true);
    for (const n of [0, 2, 9]) expect(guildSwapBar(LAW2, roster(n)) >= 0.7).toBe(true);
  });
});

// ── (iii) THE DRAW COUNT, EXECUTED ────────────────────────────────────────────────────────────────
/** The mocked leaf's and the wrapped RNG's knobs, set per arm (the modules are loaded once). */
const knobs = {
  crime: 0.5, // law 2's crime row, floor = ceiling: 1 - 0.5 is law 1's bar
  guild: 0.3, // law 2's guild row, floor = ceiling: 1 - 0.3 is law 1's bar
  small: 0.999999, // law 2's small-place chance: ~1, so (c)'s coin passes
  calls: { crimeWave: 0, guildConflict: 0, smallPlaceCrime: 0 }, // the bars' calls UNDER LAW 2, and (c)'s chance
  seq: null, // when an array, EVERY draw of the active seeded stream is logged as its caller's file:line
};

const TOWN_UP = Object.freeze(['town', 'city', 'metropolis']);
const SEEDS_A_SIZE = 20;
const SMALL_CANDIDATES = Object.freeze(['visitor-village-68', 'visitor-thorp-9', 'visitor-hamlet-0', 'visitor-village-48']);

let born = null;

/** The K0 visitor birth, with the trouble law's leaf mocked and the RNG wrapped. */
async function loadBirths() {
  vi.resetModules();
  vi.doMock(LEAF_SPEC, async (importOriginal) => {
    const actual = await importOriginal();
    // The REAL bars run (their law read, their reads); only the table they weigh with is replaced, by
    // one whose crime and guild rows are flat (floor = ceiling) at the knobs.
    const T = actual.TROUBLE_WEIGHT_TUNING;
    const flatTable = () => ({
      ...T,
      crimeWave: { ...T.crimeWave, floor: knobs.crime, ceiling: knobs.crime },
      guildConflict: { ...T.guildConflict, floor: knobs.guild, ceiling: knobs.guild },
    });
    return {
      ...actual,
      crimeWaveBar: (config, economicState) => {
        if (actual.isWeightedTrouble(config)) knobs.calls.crimeWave++;
        return actual.crimeWaveBar(config, economicState, flatTable());
      },
      guildSwapBar: (config, factions) => {
        if (actual.isWeightedTrouble(config)) knobs.calls.guildConflict++;
        return actual.guildSwapBar(config, factions, flatTable());
      },
      smallPlaceCrimeChance: () => { knobs.calls.smallPlaceCrime++; return knobs.small; },
    };
  });
  vi.doMock(RNG_SPEC, async (importOriginal) => {
    const actual = await importOriginal();
    // The pipeline sets each step's seeded PRNG through `setActiveRng`; while `knobs.seq` is an array
    // the PRNG is handed on behind a proxy that logs every `.random()` (so `random`, `pick`, `randInt`,
    // `chance`, all of them) by the first caller frame outside the RNG kernel. The values are untouched.
    const callerOf = (stack) => String(stack).split('\n').slice(2)
      .map((line) => (line.match(/([^/\\(\s]+\.(?:js|jsx)):(\d+):\d+\)?\s*$/) || []).slice(1).join(':'))
      .find((site) => site && !site.startsWith('rngContext.js:') && !site.startsWith('troubleLawWeights.test.js:')) || '?';
    const logged = (rng) => new Proxy(rng, {
      get(target, key) {
        if (key === 'random') {
          return () => {
            if (knobs.seq) knobs.seq.push(callerOf(new Error().stack));
            return target.random();
          };
        }
        const value = target[key];
        return typeof value === 'function' ? value.bind(target) : value;
      },
    });
    return { ...actual, setActiveRng: (rng) => actual.setActiveRng(rng && knobs.seq ? logged(rng) : rng) };
  });
  const { generateSettlementPipeline } = await import('../../../src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import('../../../src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await import('../../../src/store/configSlice.js');
  const { createCustomContentSlice } = await import('../../../src/store/customContentSlice.js');
  const { settlementContentRuntimeOptions } = await import('../../../src/store/settlementContentRuntime.js');
  const { eligibleCustomContent } = await import('../../../src/domain/customContentSchema.js');
  const { contentRuntimeFromCampaignBinding } = await import('../../../src/domain/content/contentEnvironment.js');
  await loadGenerationLawPayloads();
  /** @param {string} seed @param {1|2|'absent'} law the law FORCED in the birth's own config ('absent': the key deleted) */
  return (seed, law) => {
    const size = seed.split('-')[1];
    const config = {
      ...DEFAULT_CONFIG, settType: size,
      _institutionToggles: {}, _categoryToggles: {}, _goodsToggles: {}, _servicesToggles: {},
      _randomizePriorities: true,
    };
    let st;
    const slice = createCustomContentSlice(() => {}, () => st);
    st = { ...slice, activeCampaignId: null, campaigns: [], config: { ...DEFAULT_CONFIG, settType: size }, configExplicitFields: {} };
    const runtime = settlementContentRuntimeOptions(st, contentRuntimeFromCampaignBinding, eligibleCustomContent);
    const { [TROUBLE_LAW_CONFIG_KEY]: _dial, ...absent } = birthConfig(config);
    const cfg = law === 'absent' ? absent : { ...absent, [TROUBLE_LAW_CONFIG_KEY]: law };
    return generateSettlementPipeline(cfg, null, { seed, ...runtime });
  };
}

/** The record's bytes without the law's own marker (it rides `config` and its echoes). */
const unmarked = (record) => JSON.stringify(record, (key, value) => (key === TROUBLE_LAW_CONFIG_KEY ? undefined : value));

describe('(iii) the draw count under law 2 equals law 1 wherever the same branch is reached (executed)', () => {
  beforeAll(async () => {
    born = await loadBirths();
  }, 60_000);

  afterAll(() => {
    vi.doUnmock(LEAF_SPEC);
    vi.doUnmock(RNG_SPEC);
    vi.resetModules();
  });

  it('DARK, AS A DIFFERENTIAL: a birth with the key ABSENT deep-equals the same birth with _troubleLawVersion: 1 forced (two seeds a size, six sizes)', () => {
    const differing = [];
    let births = 0;
    for (const size of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      for (const i of [3, 7]) {
        const seed = `visitor-${size}-${i}`;
        knobs.calls = { crimeWave: 0, guildConflict: 0, smallPlaceCrime: 0 };
        const absent = born(seed, 'absent');
        const one = born(seed, 1);
        expect(knobs.calls, `${seed}: a law-1 birth read law 2`).toEqual({ crimeWave: 0, guildConflict: 0, smallPlaceCrime: 0 });
        expect(JSON.stringify(absent).includes(TROUBLE_LAW_CONFIG_KEY), `${seed}: the absent birth carries the key`).toBe(false);
        expect(JSON.stringify(one).includes(`"${TROUBLE_LAW_CONFIG_KEY}":1`), `${seed}: the forced birth lost its key`).toBe(true);
        if (unmarked(absent) !== unmarked(one)) differing.push(seed);
        births++;
      }
    }
    expect(births).toBe(12);
    expect(differing, 'an absent key and a forced 1 are not the same law').toEqual([]);
  }, 120_000);

  it(`(a) and (b): law 2 with law 1's own bars is law 1, byte for byte, on ${SEEDS_A_SIZE} visitor seeds a size (town, city, metropolis)`, () => {
    Object.assign(knobs, { crime: 0.5, guild: 0.3 });
    const differing = [];
    let law1Calls = 0;
    let law2Crime = 0;
    let law2Guild = 0;
    let markers = 0;
    // Every seed runs and every failure is collected (tests/helpers/seedFailures.js): the true count, never a floor.
    const seeds = TOWN_UP.flatMap((size) => Array.from({ length: SEEDS_A_SIZE }, (_, i) => `visitor-${size}-${i}`));
    const failures = collectSeedFailures(seeds, (seed) => {
      knobs.calls = { crimeWave: 0, guildConflict: 0, smallPlaceCrime: 0 };
      const one = born(seed, 1);
      law1Calls += knobs.calls.crimeWave + knobs.calls.guildConflict + knobs.calls.smallPlaceCrime;
      knobs.calls = { crimeWave: 0, guildConflict: 0, smallPlaceCrime: 0 };
      const two = born(seed, 2);
      law2Crime += knobs.calls.crimeWave;
      law2Guild += knobs.calls.guildConflict;
      expect(knobs.calls.smallPlaceCrime, `${seed}: (c) ran at a size of town or above`).toBe(0);
      if (JSON.stringify(two).includes(`"${TROUBLE_LAW_CONFIG_KEY}":2`)) markers++;
      const a = unmarked(one);
      const b = unmarked(two);
      if (a !== b) differing.push(seed);
    });
    expectNoSeedFailures(failures, '(c) never runs at a size of town or above');
    const births = TOWN_UP.length * SEEDS_A_SIZE;
    // ANTI-VACUITY: law 1 never reads the weights; law 2 reaches both sites in every birth, and its
    // record really carries the marker (so the comparison is of two different laws' births).
    expect(law1Calls, 'a law-1 birth read its bars as law 2').toBe(0);
    expect(law2Crime, 'law 2 never reached the crime coin (a)').toBeGreaterThan(births / 4);
    expect(law2Guild, 'law 2 never reached the guild swap (b)').toBeGreaterThan(births / 4);
    expect(markers, 'the law-2 record does not carry its marker').toBe(births);
    expect(differing, 'a law-2 birth with law 1\'s own bars moved: a draw was added or removed at (a) or (b)').toEqual([]);
  }, 180_000);

  it('the control: the same comparison with the crime constant moved does discriminate', () => {
    Object.assign(knobs, { crime: 0.95, guild: 0.3 });
    try {
      const moved = [];
      for (const seed of ['visitor-city-0', 'visitor-city-1', 'visitor-city-2', 'visitor-metropolis-0']) {
        if (unmarked(born(seed, 1)) !== unmarked(born(seed, 2))) moved.push(seed);
      }
      expect(moved.length, 'a crime chance of 0.95 moved no birth: the comparison above proves nothing').toBeGreaterThan(0);
    } finally {
      Object.assign(knobs, { crime: 0.5, guild: 0.3 });
    }
  }, 60_000);

  it('(c): a small place whose (c) fires keeps the crime wave under law 2 (chance ~1), with exactly one extra draw at (c)', () => {
    const source = readFileSync(join(process.cwd(), HISTORY_REL), 'utf8').split('\n');
    const cLine = source.findIndex((line) => line.includes('_rng() < smallPlaceCrimeChance(')) + 1;
    expect(cLine).toBeGreaterThan(0);
    const C_SITE = `historyGenerator.js:${cLine}`;

    const firedSeeds = [];
    // Every candidate runs and every failure is collected (tests/helpers/seedFailures.js): the true count, never a floor.
    const failures = collectSeedFailures(SMALL_CANDIDATES, (seed) => {
      knobs.small = 0.999999;
      knobs.calls = { crimeWave: 0, guildConflict: 0, smallPlaceCrime: 0 };
      knobs.seq = [];
      const two = born(seed, 2);
      const seq2 = knobs.seq;
      const calls = knobs.calls.smallPlaceCrime;
      knobs.seq = [];
      const one = born(seed, 1);
      const seq1 = knobs.seq;
      knobs.seq = null;
      // A positive control that the log reads the stream at all, and by source line.
      expect(seq1.length, `${seed}: the stream log is empty`).toBeGreaterThan(100);
      expect(seq1.filter((site) => site.startsWith('historyGenerator.js:')).length).toBeGreaterThan(0);
      if (calls === 0) {
        // (c) not reached here (the crime coin (a) took the crime wave first): law 2 drew nothing at (c).
        expect(seq2.filter((site) => site === C_SITE), `${seed}: a draw at (c) without its chance`).toEqual([]);
        return;
      }
      expect(calls, `${seed}: (c)'s chance was read more than once`).toBe(1);
      // The crime wave is kept: law 1's from today's branch, law 2's from its one coin.
      expect(one.history.currentTensions[0].type, `${seed} law 1`).toBe('crime_wave');
      expect(two.history.currentTensions[0].type, `${seed} law 2`).toBe('crime_wave');
      // EXACTLY ONE EXTRA DRAW, AT (c): the two streams' callers agree draw for draw up to the first
      // difference, and that difference is law 2's coin at (c)'s own line; (c) draws once under law 2,
      // never under law 1.
      let k = 0;
      while (k < seq1.length && seq1[k] === seq2[k]) k++;
      expect(seq2[k], `${seed}: law 2's first differing draw is not (c)'s coin`).toBe(C_SITE);
      expect(seq2.filter((site) => site === C_SITE)).toHaveLength(1);
      expect(seq1.filter((site) => site === C_SITE)).toHaveLength(0);
      firedSeeds.push({ seed, at: k, moved: unmarked(one) !== unmarked(two) });
    });
    expectNoSeedFailures(failures, 'a small place whose (c) fires keeps the crime wave, with exactly one extra draw at (c)');
    // At least one candidate reached (c) (else this arm proved nothing). Whether the rest of the record
    // moved is NOT asserted: after the extra draw the stream is law 1's shifted by one, and where law 1
    // spent a draw on a fill pick that a check set aside, the two streams re-align (measured, see the report).
    expect(firedSeeds.length, `none of ${SMALL_CANDIDATES.join(', ')} reached (c)`).toBeGreaterThan(0);
  }, 60_000);
});
