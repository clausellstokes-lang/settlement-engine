/**
 * tests/domain/crisis/crisisKeeperBothDoors.test.js — ONE KEEPER RULE AT BOTH DOORS (FRAME-6 · P1BF; the brief
 * docs/chair/2026-11-20/content/frame6/P1BF-WORDING-PARITY.md, commit 2; FRAME-5's hand-back ruling 34 (b), each point
 * vetoable by the owner).
 *
 * The crisis page reaches an infiltration's outside hand through a lodging keeper (crisisPage.js :: lodgingKeeperOf).
 * That function is a second copy of the standing trouble's outsider rung (troubleCast.js :: lodgingKeepersOf), because
 * the veil test's walker "one door: only the sheet's composer imports the trouble cast" forbids crisisPage.js importing
 * the trouble cast. Until one module serves both, this test holds them together. On a bounded set of born towns, calm and
 * infiltrated, with a keeper and with none, the crisis page's keeper is the rung's first keeper: the same person and the
 * same house, or both name none.
 *
 * What may differ by design, and is not compared here:
 * - The frame chooses AMONG the rung's keepers by its hash, after its other sides have taken their people (`used`).
 * - The crisis page takes the first keeper (rate 1, no hash).
 * Both read "free" as nobody an active crisis's stored cast holds (MEASURED equal on 1,215 towns: P1BF-RESULTS.md).
 */
import { describe, expect, test } from 'vitest';
import { lodgingKeeperOf } from '../../../src/domain/crisis/crisisPage.js';
import { lodgingKeepersOf } from '../../../src/domain/tension/troubleCast.js';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import { collectSeedFailures, expectNoSeedFailures } from '../../helpers/seedFailures.js';

/** The born towns, as measured (P1BF-RESULTS.md, commit 2's measure): [seed, tier, forced kind or null, keepers]. */
const TOWNS = [
  ['frame-calm-town-80', 'town', null, 3], // calm, framed; three keepers (the frame's own outsider face is the third)
  ['frame-calm-thorp-0', 'thorp', null, 0], // calm, no keeper
  ['b7-infiltrated-town-0', 'town', 'infiltrated', 2], // infiltrated, the hand absent, two keepers
  ['b7-infiltrated-thorp-0', 'thorp', 'infiltrated', 0], // infiltrated, the hand absent, no keeper
];
const born = new Map();
/** One birth per seed, kept (births are slow); a fresh copy each read. @param {string} seed */
const town = (seed) => {
  if (!born.has(seed)) {
    const [, tier, kind] = TOWNS.find(([s]) => s === seed);
    born.set(seed, generateSettlementPipeline({ settType: tier, ...(kind ? { stressType: kind } : {}) }, null, { seed, customContent: {} }));
  }
  return structuredClone(born.get(seed));
};
/** The rung's first keeper, in the crisis page's shape. */
const firstOfRung = (s) => {
  const [k] = lodgingKeepersOf(s);
  return k ? { keeper: k.keeper, house: k.house } : null;
};

describe('P1BF: the outside hand\'s keeper is the standing trouble\'s outsider rung, at both doors', () => {
  test(`the two rules name the same keeper (person and house), or both none, on ${TOWNS.length} born towns`, () => {
    const failures = collectSeedFailures(TOWNS, ([seed, , kind, keepers]) => {
      const s = town(seed);
      expect(lodgingKeepersOf(s).length, `${seed}: the measured keepers`).toBe(keepers);
      expect(lodgingKeeperOf(s), `${seed}: the crisis page's keeper is the rung's first`).toEqual(firstOfRung(s));
      expect(!!kind === [s.stress].flat().some((e) => e?.type === 'infiltrated'), `${seed}: calm or infiltrated, as listed`).toBe(true);
    });
    expectNoSeedFailures(failures, 'one keeper rule at both doors');
    // the bounded set holds both kinds of town, each with a keeper and with none
    const shape = TOWNS.map(([, , kind, keepers]) => `${kind ? 'infiltrated' : 'calm'}:${keepers ? 'keeper' : 'none'}`);
    expect(new Set(shape)).toEqual(new Set(['calm:keeper', 'calm:none', 'infiltrated:keeper', 'infiltrated:none']));
  }, 300000);

  test('the same FREE test: a keeper an active crisis\'s cast holds is passed over by both rules, for the same next keeper', () => {
    const s = town('b7-infiltrated-town-0');
    const [first, second] = lodgingKeepersOf(s);
    expect(second, 'two keepers stand').toBeTruthy();
    const entry = [s.stress].flat().find((e) => e?.type === 'infiltrated');
    entry.cast.roles.push({ role: 'collaborator', kind: 'npc', id: first.npc.id || first.npc.name, name: first.npc.name, reason: 'its power could go either way', temporary: false });
    expect(lodgingKeeperOf(s), 'the crisis page passes over the held keeper').toEqual({ keeper: second.keeper, house: second.house });
    expect(firstOfRung(s), 'the rung passes over the held keeper').toEqual({ keeper: second.keeper, house: second.house });
  }, 120000);

  test('the same ORDER: strongest first, then roster order, at both doors (the strongest keeper weakened)', () => {
    const s = town('frame-calm-town-80');
    const [first] = lodgingKeepersOf(s);
    const npc = s.npcs.find((n) => n.id === first.npc.id && n.name === first.npc.name);
    npc.power = -1;
    expect(firstOfRung(s)?.keeper, 'the rung\'s first moves').not.toBe(first.keeper);
    expect(lodgingKeeperOf(s), 'and the crisis page\'s keeper with it').toEqual(firstOfRung(s));
  }, 120000);
});
