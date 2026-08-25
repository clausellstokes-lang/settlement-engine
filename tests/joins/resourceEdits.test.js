/**
 * Join harness — config.resourceEdits: the editor's resource events survive
 * regeneration.
 *
 * The seam: ADD/REMOVE/DEPLETE/RECOVERED_RESOURCE write the LIVE config keys
 * (nearbyResources / nearbyResourcesState / nearbyResourcesDepleted /
 * nearbyResourcesCustom) — but those are derivation OUTPUTS. A full
 * regeneration (applyChange) rebuilds the pipeline input from the raw
 * _config, and resolveResources re-rolls the roster and depletion wholesale
 * in random mode (and re-rolls 'allow' depletion in manual mode) — so a
 * DEPLETE_RESOURCE followed by any what-if applyChange silently resurrected
 * the depleted resource. config.resourceEdits is the authored delta record
 * that closes the loop (customTradeGoods' architecture):
 *
 *   { added }     [{ key, custom }] nodes opened by ADD_RESOURCE (custom →
 *                 verbatim name, re-tinted gold on regeneration);
 *   { removed }   suppression list — REMOVE_RESOURCE keeps rolled nodes gone;
 *   { depleted }  DEPLETE_RESOURCE forces these into the depleted set;
 *   { recovered } RECOVERED_RESOURCE forces these OUT of it — without this
 *                 the same-seed regen re-rolls the original depletion back.
 *
 * The events dual-write resourceEdits to config + _config (withResourceEdits
 * — withCustomTradeGoods' discipline) and resolveResources re-applies the
 * deltas as a post-roll overlay consuming NO rng, so a config without edits
 * generates byte-identically and the key must NOT be in DERIVED_CONFIG_KEYS.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import {
  stripDerivedConfigKeys,
  DERIVED_CONFIG_KEYS,
} from '../../src/store/settlementSlice.js';

const NOW = '2026-06-11T00:00:00.000Z';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};

// Probed shape for this seed (random mode): roster [river_fish,
// hunting_grounds, defended_pass, iron_deposits, fishing_grounds], with
// defended_pass + iron_deposits ROLLED depleted — giving every round trip
// below both an open node to deplete/remove and a rolled depletion to recover.
const SEED = 're-rt-1';

/** Exactly how settlementSlice.applyChange rebuilds the next run's input. */
const buildNextConfig = (settlement) => ({
  ...(settlement?._config
    || stripDerivedConfigKeys(settlement?.config)
    || {}),
});

const ev = (type, overrides = {}) => ({
  id: `ev_${type.toLowerCase()}`,
  type,
  targetId: '',
  payload: {},
  cause: 'player_action',
  ...overrides,
});

function deepFreeze(o) {
  if (o && typeof o === 'object') {
    Object.freeze(o);
    for (const k of Object.keys(o)) deepFreeze(o[k]);
  }
  return o;
}

const mutate = (settlement, event) =>
  mutateSettlement({ settlement: deepFreeze(settlement), event, now: NOW });

// What every consumer (economy chains, food, resource pressure, the dossier)
// actually computes: depletion ∩ roster.
const effectiveDepleted = (s) => {
  const depleted = new Set(s.config.nearbyResourcesDepleted || []);
  return (s.config.nearbyResources || []).filter(k => depleted.has(k));
};

describe('join: DEPLETE_RESOURCE survives a full regeneration (the reported bug)', () => {
  test('deplete → regenerate → still depleted; the delta lives in BOTH config formats', () => {
    const s1 = gen(BASE_CFG, SEED);
    expect(s1.config.nearbyResources).toContain('river_fish');
    expect(s1.config.nearbyResourcesDepleted).not.toContain('river_fish');

    const depleted = mutate(s1, ev('DEPLETE_RESOURCE', { targetId: 'river_fish' }));
    // Live write + the authored delta in BOTH config and _config.
    expect(depleted.config.nearbyResourcesDepleted).toContain('river_fish');
    expect(depleted.config.resourceEdits.depleted).toEqual(['river_fish']);
    expect(depleted._config.resourceEdits.depleted).toEqual(['river_fish']);

    // Full regeneration, exactly as applyChange rebuilds its input.
    const s2 = gen(buildNextConfig(depleted), SEED);
    expect(s2.config.nearbyResources).toContain('river_fish');
    expect(effectiveDepleted(s2)).toContain('river_fish');
    // The deltas survive into the next generation's raw config — chained
    // what-ifs keep working.
    expect(s2._config.resourceEdits.depleted).toEqual(['river_fish']);
  });

  test('deplete → regenerate → RECOVER on the regenerated settlement → regenerate → open again', () => {
    const s1 = gen(BASE_CFG, SEED);
    const s2 = gen(buildNextConfig(mutate(s1, ev('DEPLETE_RESOURCE', { targetId: 'river_fish' }))), SEED);
    expect(effectiveDepleted(s2)).toContain('river_fish');

    const recovered = mutate(s2, ev('RECOVERED_RESOURCE', { targetId: 'river_fish' }));
    expect(recovered.config.resourceEdits.depleted).toEqual([]);
    expect(recovered.config.resourceEdits.recovered).toEqual(['river_fish']);

    const s3 = gen(buildNextConfig(recovered), SEED);
    expect(s3.config.nearbyResources).toContain('river_fish');
    expect(effectiveDepleted(s3)).not.toContain('river_fish');
  });
});

describe('join: RECOVERED_RESOURCE survives against the same-seed re-roll', () => {
  test('recovering an ORIGINALLY-ROLLED depletion stays recovered after regeneration', () => {
    const s1 = gen(BASE_CFG, SEED);
    // defended_pass was rolled depleted by the generator itself — the
    // hardest case: the same seed re-rolls that exact depletion back.
    expect(s1.config.nearbyResourcesDepleted).toContain('defended_pass');

    const recovered = mutate(s1, ev('RECOVERED_RESOURCE', { targetId: 'defended_pass' }));
    expect(recovered.config.nearbyResourcesDepleted).not.toContain('defended_pass');
    expect(recovered._config.resourceEdits.recovered).toEqual(['defended_pass']);

    const s2 = gen(buildNextConfig(recovered), SEED);
    expect(s2.config.nearbyResources).toContain('defended_pass');
    expect(effectiveDepleted(s2)).not.toContain('defended_pass');
    // The OTHER rolled depletion is untouched — the overlay is a delta,
    // not a freeze of the whole depletion set.
    expect(effectiveDepleted(s2)).toContain('iron_deposits');
  });
});

describe('join: ADD_RESOURCE survives a full regeneration', () => {
  test('a catalog node joins the re-rolled roster, open and untinted', () => {
    const s1 = gen(BASE_CFG, SEED);
    expect(s1.config.nearbyResources).not.toContain('grain_fields');

    const added = mutate(s1, ev('ADD_RESOURCE', { targetId: 'grain_fields' }));
    expect(added.config.resourceEdits.added).toEqual([{ key: 'grain_fields', custom: false }]);
    expect(added._config.resourceEdits.added).toEqual([{ key: 'grain_fields', custom: false }]);

    const s2 = gen(buildNextConfig(added), SEED);
    expect(s2.config.nearbyResources).toContain('grain_fields');
    expect(effectiveDepleted(s2)).not.toContain('grain_fields');
    expect(s2.config.nearbyResourcesCustom || []).not.toContain('grain_fields');
  });

  test('a custom node keeps its verbatim name and its gold tint', () => {
    const s1 = gen(BASE_CFG, SEED);
    const added = mutate(s1, ev('ADD_RESOURCE', { targetId: 'Moonpetal grove' }));
    expect(added.config.resourceEdits.added).toEqual([{ key: 'Moonpetal grove', custom: true }]);

    const s2 = gen(buildNextConfig(added), SEED);
    expect(s2.config.nearbyResources).toContain('Moonpetal grove');
    expect(s2.config.nearbyResourcesCustom).toContain('Moonpetal grove');
  });

  test('an added custom node can then be depleted, and BOTH edits survive together', () => {
    const s1 = gen(BASE_CFG, SEED);
    const added = mutate(s1, ev('ADD_RESOURCE', { targetId: 'Moonpetal grove' }));
    const depleted = mutate(added, ev('DEPLETE_RESOURCE', { targetId: 'Moonpetal grove' }));
    expect(depleted.config.resourceEdits.added).toEqual([{ key: 'Moonpetal grove', custom: true }]);
    expect(depleted.config.resourceEdits.depleted).toEqual(['Moonpetal grove']);

    const s2 = gen(buildNextConfig(depleted), SEED);
    expect(s2.config.nearbyResources).toContain('Moonpetal grove');
    expect(effectiveDepleted(s2)).toContain('Moonpetal grove');
  });
});

describe('join: REMOVE_RESOURCE suppression survives a full regeneration', () => {
  test('removing a GENERATOR-rolled node keeps it gone; re-adding clears the suppression', () => {
    const s1 = gen(BASE_CFG, SEED);
    expect(s1.config.nearbyResources).toContain('hunting_grounds');

    const removed = mutate(s1, ev('REMOVE_RESOURCE', { targetId: 'hunting_grounds' }));
    expect(removed.config.nearbyResources).not.toContain('hunting_grounds');
    expect(removed._config.resourceEdits.removed).toEqual(['hunting_grounds']);

    const s2 = gen(buildNextConfig(removed), SEED);
    expect(s2.config.nearbyResources).not.toContain('hunting_grounds');
    expect(s2.config.nearbyResourcesDepleted).not.toContain('hunting_grounds');

    // Re-ADD on the regenerated settlement clears the suppression entry —
    // the lists keep agreeing across generations.
    const readded = mutate(s2, ev('ADD_RESOURCE', { targetId: 'hunting_grounds' }));
    expect(readded.config.resourceEdits.removed).toEqual([]);
    expect(readded.config.resourceEdits.added).toEqual([{ key: 'hunting_grounds', custom: false }]);

    const s3 = gen(buildNextConfig(readded), SEED);
    expect(s3.config.nearbyResources).toContain('hunting_grounds');
  });

  test('removing a rolled-DEPLETED node also drops its depletion record', () => {
    const s1 = gen(BASE_CFG, SEED);
    const removed = mutate(s1, ev('REMOVE_RESOURCE', { targetId: 'iron_deposits' }));

    const s2 = gen(buildNextConfig(removed), SEED);
    expect(s2.config.nearbyResources).not.toContain('iron_deposits');
    expect(s2.config.nearbyResourcesDepleted).not.toContain('iron_deposits');
  });
});

describe('join: manual mode — the overlay is mode-agnostic', () => {
  const MANUAL_CFG = {
    ...BASE_CFG,
    nearbyResourcesRandom: false,
    nearbyResourcesState: { fishing_grounds: 'allow', stone_quarry: 'allow', grain_fields: 'allow' },
  };

  test("deplete survives the manual-mode 'allow' re-roll", () => {
    // Probed: seed re-man-1 rolls NOTHING depleted from these 'allow' states.
    const s1 = gen(MANUAL_CFG, 're-man-1');
    expect(s1.config.nearbyResourcesDepleted).toEqual([]);

    const depleted = mutate(s1, ev('DEPLETE_RESOURCE', { targetId: 'fishing_grounds' }));
    const s2 = gen(buildNextConfig(depleted), 're-man-1');
    expect(effectiveDepleted(s2)).toContain('fishing_grounds');
  });

  test("recovery survives the manual-mode 'allow' re-roll", () => {
    // Probed: seed re-man-2 rolls grain_fields depleted from 'allow'.
    const s1 = gen(MANUAL_CFG, 're-man-2');
    expect(s1.config.nearbyResourcesDepleted).toContain('grain_fields');

    const recovered = mutate(s1, ev('RECOVERED_RESOURCE', { targetId: 'grain_fields' }));
    const s2 = gen(buildNextConfig(recovered), 're-man-2');
    expect(s2.config.nearbyResources).toContain('grain_fields');
    expect(effectiveDepleted(s2)).not.toContain('grain_fields');
  });
});

describe('join: the overlay consumes no rng and the slice strip never eats the key', () => {
  test('a config with EMPTY resourceEdits generates byte-identically to one without', () => {
    const plain = gen(BASE_CFG, SEED);
    const withEmpty = gen({
      ...BASE_CFG,
      resourceEdits: { added: [], removed: [], depleted: [], recovered: [] },
    }, SEED);

    // The only permitted difference is the resourceEdits key itself riding
    // through config/_config — everything derived must be byte-identical.
    const scrub = (s) => {
      const clone = JSON.parse(JSON.stringify(s));
      delete clone.config.resourceEdits;
      delete clone._config.resourceEdits;
      return clone;
    };
    expect(scrub(withEmpty)).toEqual(scrub(plain));
  });

  test('stripDerivedConfigKeys preserves resourceEdits (it is user input, not derived)', () => {
    expect(DERIVED_CONFIG_KEYS).not.toContain('resourceEdits');
    const stripped = stripDerivedConfigKeys({
      stressType: 'plague',
      resourceEdits: { added: [], removed: ['hunting_grounds'], depleted: [], recovered: [] },
    });
    expect(stripped.stressType).toBeUndefined();
    expect(stripped.resourceEdits).toEqual({
      added: [], removed: ['hunting_grounds'], depleted: [], recovered: [],
    });
  });
});
