/**
 * magicCountOnce.test.js — COHERENCE-UPKEEP-6, the chair's ruling 4 (C5, count once: every magic house),
 * READING A, built as a declared move (measured first: docs/chair/2026-11-13/probes/UPKEEP-6/magic-count-once.md).
 *
 * A house that stands as its own named part of defence (the apothecary district and the alchemist houses as
 * alchemists, the elder grove council as druids, the mages' guild, the wizard's tower and the hedge wizard as
 * arcane, the divine healer as the hospital) keeps that part and LEAVES the magic presence: the magic part reads
 * the roster without them. No weight changed.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { defencePartsOf } from '../../src/generators/defenseGenerator.js';
import * as home from '../../src/domain/institutions/defenseInstitutionBuckets.js';

/** The ruling's eight houses, as the measure read them (magic6.mjs :: HOUSES). */
const RULED = ['apothecary district', 'elder grove council', "wizard's tower", 'alchemist shop', "mages' guild", 'alchemist quarter', 'hedge wizard', 'healer (divine'];
const DIALS = { tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat', nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true, magicExists: true, contentProfile: 'grounded' };
const lc = (/** @type {any} */ i) => String(i?.name || '').toLowerCase();

/** @type {any[]} */
const births = [];
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const tier of ['village', 'town', 'city', 'metropolis']) {
    for (let i = 0; i < 24; i++) {
      const seed = `once6-${tier}-${i}`;
      births.push({ seed, s: generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, ...DIALS, settType: tier }), null, { seed, customContent: {} }) });
    }
  }
}, 600000);

describe('count once: a named house leaves the magic presence (ruling 4, reading A)', () => {
  test('the defence home names the ruling\'s eight houses', () => {
    expect([...(home.DEFENSE_NAMED_MAGIC_HOUSES || [])].sort()).toEqual([...RULED].sort());
  });

  test('RED-FIRST: the magic part reads the roster without the named houses', () => {
    let holding = 0;
    const bad = [];
    for (const { seed, s } of births) {
      const magic = defencePartsOf(s).find((p) => p.id === 'magic');
      if (!magic) continue;
      const without = s.institutions.filter((i) => !RULED.some((h) => lc(i).includes(h)));
      if (without.length === s.institutions.length) continue;
      // the same record without the houses: its magic line is the presence of the roster without them
      const bare = defencePartsOf({ ...s, institutions: without }).find((p) => p.id === 'magic');
      if (!bare) continue;
      holding += 1;
      if (magic.full !== bare.full) bad.push([seed, magic.full, bare.full]);
    }
    expect(holding, 'anchored: the corpus holds named houses beside a magic part').toBeGreaterThan(10);
    expect(bad).toEqual([]);
  });
});
