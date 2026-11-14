/**
 * threatRowsTrueUnderBand.test.js — UPKEEP-8, F3 (the chair's rulings (a) and (b), 2026-11-13): a threat row's
 * sentence is true of what stands and under the band its row prints. (a) A force is a garrison, a militia (a household
 * levy is one), a watch or a contracted company, read from the lane's one projection (`standingDefenseForces`): a
 * sentence that says no force stands prints only where none does. (b) A sentence prints only under the bands its own
 * words are true of; a contradicted cell of fifteen rows or more has ONE twin, a smaller one prints its band alone.
 *
 * THE GUARDS are the seventh seat's towns for the largest cells (born in the app's shape); THE LAW runs over births of
 * every size. Red at the lane's base (995293e81).
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { deriveDefenseReadiness } from '../../src/domain/display/defenseDisplay.js';
import { standingDefenseForces } from '../../src/domain/institutions/defenseInstitutionBuckets.js';

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** The app's shape, as the seventh seat's 1,440 were born: rv2-<crisis|calm>-<size>-<i>. */
const birth = (seed) => {
  const [, crisis, tier] = /^rv2-([a-z_+]+)-(\w+)-\d+$/.exec(seed);
  return generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: tier, selectedStresses: crisis === 'calm' ? [] : crisis.split('+'), selectedStressesRandom: false }), null, { seed, customContent: {} });
};
const rows = (s) => Object.fromEntries(deriveDefenseReadiness(s).map((r) => [r.label, r]));

/** Each judging clause and the bands its words cannot stand under. */
const FALSE_UNDER = [
  [/which is all the country asks/, ['WEAK', 'CRITICAL']],
  [/Existing defenses are appropriate/, ['WEAK', 'CRITICAL']],
  [/viable but demanding/, ['STRONG', 'CRITICAL']],
  [/Adequate for routine threats/, ['STRONG', 'CRITICAL']],
  [/not enough against an army that brings siege gear/, ['STRONG', 'CRITICAL']],
  [/A determined attacker/, ['ADEQUATE', 'STRONG']],
  [/Cannot resist organized military aggression/, ['ADEQUATE', 'STRONG']],
  [/Effective against disorganized raiders/, ['STRONG', 'CRITICAL']],
  [/far more defences than it calls for/, ['ADEQUATE', 'WEAK', 'CRITICAL']],
];

describe('the seventh seat\'s cells: the contradicted sentence does not print, and what prints is true', () => {
  const ROWS = [
    ['rv2-calm-thorp-3', 'Beasts & Monsters', 'Quiet country and no organised defence', 'Quiet country, and nothing organised is kept against it.'], // 233 rows: Critical
    ['rv2-calm-thorp-1', 'Beasts & Monsters', 'citizen militia provide a viable but demanding', 'An embattled region, and only a palisade and a citizen militia to hold it.'], // 96: Critical
    ['rv2-calm-town-0', 'Invasion & War', 'no organized military force', 'Walls, and a watch to keep them.'], // 86 + 54: a watch stands
    ['rv2-calm-town-7', 'Beasts & Monsters', 'nobody organised to meet it', 'Active frontier, with walls and a watch to meet what comes.'], // 44 + 16: a watch stands
    ['rv2-calm-hamlet-1', 'Invasion & War', 'not enough against an army', 'A palisade and armed townsfolk who know how to hold it.'], // 28: Strong
  ];
  test("each cell's town: its twin prints and the contradicted sentence does not", () => {
    for (const [seed, label, cured, twin] of ROWS) {
      const row = rows(birth(seed))[label];
      expect(row.assess).toBe(twin);
      expect(row.assess).not.toContain(cured); // anchored: the twin was asserted on the line above
    }
  });
});

describe('the law, over births of every size', () => {
  const seeds = ['thorp', 'hamlet', 'village', 'town', 'city'].flatMap((t) => Array.from({ length: 12 }, (_, i) => `rv2-calm-${t}-${i}`))
    .concat(['village', 'town'].flatMap((t) => [0, 1, 2, 3].map((i) => `rv2-under_siege-${t}-${i}`)));
  test('no sentence says no force stands beside one, and none stands under a band its words deny', () => {
    let judged = 0, alone = 0;
    expectNoSeedFailures(collectSeedFailures(seeds, (seed) => {
      const s = birth(seed); const f = standingDefenseForces(s);
      const force = f.garrison.present || f.militia.present || f.watch.present || f.mercenary.present;
      for (const label of ['Beasts & Monsters', 'Invasion & War']) {
        const r = rows(s)[label];
        if (!r.assess) { alone++; continue; }
        if (force) expect(/no organi[sz]ed (?:military )?force|nobody organised to meet|no organised defence|no organized defense|nothing organised/.test(r.assess), `${seed} ${label}: ${r.assess}`).toBe(false);
        for (const [words, bands] of FALSE_UNDER) if (words.test(r.assess)) { judged++; expect(bands, `${seed} ${label} ${r.status}: ${r.assess}`).not.toContain(r.status); } // anchored: `judged` counts the clauses read, asserted below
      }
    }));
    expect(judged, 'judging clauses were read').toBeGreaterThan(20);
    expect(alone, 'a few rows print their band alone').toBeLessThan(seeds.length);
  });
});
