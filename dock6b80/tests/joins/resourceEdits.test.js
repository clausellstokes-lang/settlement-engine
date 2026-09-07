/**
 * Join harness — config.resourceEdits: the editor's resource events survive
 * regeneration.
 *
 * The seam: ADD/REMOVE/DEPLETE/RECOVERED_RESOURCE write the LIVE config keys
 * (nearbyResources plus native/custom provenance sidecars, state, and
 * depletion) — but those are derivation OUTPUTS. A full
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
 *   { removedNative } organic catalog exhaustion that preserves a same-name
 *                 custom definition;
 *   { depleted }  DEPLETE_RESOURCE forces these into the depleted set;
 *   { depletedCustomDefinitionIds } preserves exact custom depletion when a
 *                 same-name native resource changes independently;
 *   { recovered } RECOVERED_RESOURCE forces these OUT of it — without this
 *                 the same-seed regen re-rolls the original depletion back.
 *
 * The events dual-write resourceEdits to config + _config (withResourceEdits
 * — withCustomTradeGoods' discipline) and resolveResources re-applies the
 * deltas as a post-roll overlay consuming NO rng, so a config without edits
 * generates byte-identically and the key must NOT be in DERIVED_CONFIG_KEYS.
 *
 * ANCHORING CONVENTION (epistemic prevention, wave EP-2). This file is the
 * `re-rt-1` roster case — the one where a bare `not.toContain` was found passing
 * against a collection that had drifted away entirely. Every negative here is
 * therefore paired with a POSITIVE that can only hold while the roster is live:
 *   • a removal/recovery is written as expectPresentThenAbsent(before, after, key)
 *     so the before-state proves the pipeline still produces the key at all;
 *   • a selection is written as expectAbsentWithAnchor(roster, key, sibling) with a
 *     sibling this seed demonstrably rolls (marshlands / ancient_grove /
 *     coal_deposits / hunting_grounds), so an emptied roster reds on the anchor.
 * A bare negative on a roster is not acceptable in this file — if no anchor exists,
 * that absence is itself the finding.
 */

import { describe, test, expect } from 'vitest';
import {
  expectAbsentWithAnchor,
  expectPresentThenAbsent,
} from '../helpers/anchoredNegatives.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import {
  stripDerivedConfigKeys,
  DERIVED_CONFIG_KEYS,
} from '../../src/store/settlementSlice.js';
import {
  nativeSemanticDepletedResourceKeys,
} from '../../src/domain/content/customContentSemanticAuthority.js';
import { isRandomlyDepletableResource } from '../../src/domain/resourceSemantics.js';

const NOW = '2026-06-11T00:00:00.000Z';

const gen = (config, seed, customContent = {}) =>
  generateSettlementPipeline(config, null, { seed, customContent });

const BASE_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};

// Probed shape for this seed (random mode): roster [marshlands,
// ancient_grove, coal_deposits, hunting_grounds], with ancient_grove ROLLED
// depleted — so the roster gives every round trip both an open node to
// deplete and a rolled depletion to recover. Every member here is a stock
// (renewable or exhaustible) and so randomDepletionEligible; the positional
// resources a settlement-size roll must NEVER consume (a pass, a harbour, a
// mill site) are pinned by tests/domain/resourceTaxonomyClassification.test.js,
// and the eligibility invariant is re-asserted below against whatever this
// seed actually rolls rather than spot-checked on one absent key.
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
    expect(s1.config.nearbyResources).toContain('marshlands');
    // ancient_grove is this seed's OWN rolled depletion — the live sibling that
    // proves the depletion set exists and is correctly keyed before the event.
    expectAbsentWithAnchor(
      s1.config.nearbyResourcesDepleted, 'marshlands', 'ancient_grove',
      'pre-event depletion set',
    );

    const depleted = mutate(s1, ev('DEPLETE_RESOURCE', { targetId: 'marshlands' }));
    // Live write + the authored delta in BOTH config and _config.
    expect(depleted.config.nearbyResourcesDepleted).toContain('marshlands');
    expect(depleted.config.resourceEdits.depleted).toEqual(['marshlands']);
    expect(depleted._config.resourceEdits.depleted).toEqual(['marshlands']);

    // Full regeneration, exactly as applyChange rebuilds its input.
    const s2 = gen(buildNextConfig(depleted), SEED);
    expect(s2.config.nearbyResources).toContain('marshlands');
    expect(effectiveDepleted(s2)).toContain('marshlands');
    // The deltas survive into the next generation's raw config — chained
    // what-ifs keep working.
    expect(s2._config.resourceEdits.depleted).toEqual(['marshlands']);
  });

  test('deplete → regenerate → RECOVER on the regenerated settlement → regenerate → open again', () => {
    const s1 = gen(BASE_CFG, SEED);
    const s2 = gen(buildNextConfig(mutate(s1, ev('DEPLETE_RESOURCE', { targetId: 'marshlands' }))), SEED);
    expect(effectiveDepleted(s2)).toContain('marshlands');

    const recovered = mutate(s2, ev('RECOVERED_RESOURCE', { targetId: 'marshlands' }));
    expect(recovered.config.resourceEdits.depleted).toEqual([]);
    expect(recovered.config.resourceEdits.recovered).toEqual(['marshlands']);

    const s3 = gen(buildNextConfig(recovered), SEED);
    expect(s3.config.nearbyResources).toContain('marshlands');
    expectPresentThenAbsent(
      effectiveDepleted(s2), effectiveDepleted(s3), 'marshlands',
      'RECOVERED_RESOURCE on a regenerated settlement, through another regeneration',
    );
  });
});

describe('join: RECOVERED_RESOURCE survives against the same-seed re-roll', () => {
  test('recovering an ORIGINALLY-ROLLED depletion stays recovered after regeneration', () => {
    const s1 = gen(BASE_CFG, SEED);
    // ancient_grove was rolled depleted by the generator itself — the
    // hardest case: the same seed re-rolls that exact depletion back.
    expect(s1.config.nearbyResourcesDepleted).toContain('ancient_grove');
    // …and the size roll only ever consumes stocks. Whatever this seed rolls,
    // no position or built work is in that set: a pass, harbour, or mill site
    // goes unavailable only by an authored state or an editor event.
    expect(s1.config.nearbyResourcesDepleted.every(isRandomlyDepletableResource))
      .toBe(true);

    const recovered = mutate(s1, ev('RECOVERED_RESOURCE', { targetId: 'ancient_grove' }));
    expectPresentThenAbsent(
      s1.config.nearbyResourcesDepleted, recovered.config.nearbyResourcesDepleted,
      'ancient_grove', 'RECOVERED_RESOURCE clears the live depletion',
    );
    expect(recovered._config.resourceEdits.recovered).toEqual(['ancient_grove']);

    const s2 = gen(buildNextConfig(recovered), SEED);
    expect(s2.config.nearbyResources).toContain('ancient_grove');
    expectPresentThenAbsent(
      effectiveDepleted(s1), effectiveDepleted(s2), 'ancient_grove',
      'the recovery beats the same-seed re-roll of the original depletion',
    );
  });
});

describe('join: ADD_RESOURCE survives a full regeneration', () => {
  test('a catalog node joins the re-rolled roster, open and untinted', () => {
    const s1 = gen(BASE_CFG, SEED);
    // marshlands is one of this seed's four rolled nodes — the live sibling that
    // proves the roster exists before the ADD.
    expectAbsentWithAnchor(
      s1.config.nearbyResources, 'grain_fields', 'marshlands', 'the pre-ADD roster',
    );

    const added = mutate(s1, ev('ADD_RESOURCE', { targetId: 'grain_fields' }));
    expect(added.config.resourceEdits.added).toEqual([{ key: 'grain_fields', custom: false }]);
    expect(added._config.resourceEdits.added).toEqual([{ key: 'grain_fields', custom: false }]);

    const s2 = gen(buildNextConfig(added), SEED);
    expect(s2.config.nearbyResources).toContain('grain_fields');
    expect(s2.config.nearbyResourcesNative).toContain('grain_fields');
    // ancient_grove stays this seed's rolled depletion across the ADD, so it is the
    // live sibling proving the depletion set is still populated and correctly keyed.
    expectAbsentWithAnchor(
      effectiveDepleted(s2), 'grain_fields', 'ancient_grove', 'an ADDed node arrives open',
    );
    // The native/custom provenance split: the custom sidecar is empty here by design.
    // anchored: the same key is asserted PRESENT in nearbyResourcesNative above.
    expect(s2.config.nearbyResourcesCustom || []).not.toContain('grain_fields');
  });

  test('a custom node keeps its verbatim name and its gold tint', () => {
    const s1 = gen(BASE_CFG, SEED);
    const added = mutate(s1, ev('ADD_RESOURCE', { targetId: 'Moonpetal grove' }));
    expect(added.config.resourceEdits.added).toEqual([{ key: 'Moonpetal grove', custom: true }]);

    const s2 = gen(buildNextConfig(added), SEED);
    expect(s2.config.nearbyResources).toContain('Moonpetal grove');
    // The native list still carries this seed's rolled nodes; marshlands anchors it,
    // so the exclusion measures the custom tint rather than an emptied native list.
    expectAbsentWithAnchor(
      s2.config.nearbyResourcesNative, 'Moonpetal grove', 'marshlands',
      'a custom node never joins the native provenance list',
    );
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

describe('join: native/custom same-name depletion survives regeneration', () => {
  const customContent = {
    resources: [{
      localUid: 'custom-iron',
      definitionId: 'definition:custom-iron',
      revisionId: 'revision:custom-iron:1',
      name: 'iron_deposits',
      category: 'mineral',
      essential: true,
    }],
  };
  const collisionConfig = {
    ...BASE_CFG,
    terrainOverride: 'mountain',
    nearbyResourcesRandom: false,
    nearbyResources: ['iron_deposits'],
    nearbyResourcesState: { iron_deposits: 'abundant' },
  };

  test('reopening the native owner leaves the exact custom owner depleted', () => {
    const generated = gen(
      collisionConfig,
      'resource-depletion-identity',
      customContent,
    );
    expect(generated.config.nearbyResourcesNative)
      .toContain('iron_deposits');
    expect(generated.config.nearbyResourceDefinitions)
      .toContainEqual(expect.objectContaining({
        customDefinitionId: 'definition:custom-iron',
      }));

    const depleted = mutate(
      generated,
      ev('DEPLETE_RESOURCE', { targetId: 'iron_deposits' }),
    );
    const reopenedNative = mutate(
      depleted,
      ev('ADD_RESOURCE', { targetId: 'iron_deposits' }),
    );
    expect(reopenedNative._config.resourceEdits)
      .toMatchObject({
        depleted: [],
        depletedCustomDefinitionIds: ['definition:custom-iron'],
      });

    const regenerated = gen(
      buildNextConfig(reopenedNative),
      'resource-depletion-identity',
      customContent,
    );
    expect(nativeSemanticDepletedResourceKeys(regenerated.config)).toEqual([]);
    expect(regenerated.config.nearbyResourceDefinitionsDepleted)
      .toContainEqual(expect.objectContaining({
        customDefinitionId: 'definition:custom-iron',
      }));
    expect(regenerated.config.nearbyResourcesDepleted)
      .toContain('iron_deposits');
  });
});

describe('join: REMOVE_RESOURCE suppression survives a full regeneration', () => {
  test('removing a GENERATOR-rolled node keeps it gone; re-adding clears the suppression', () => {
    const s1 = gen(BASE_CFG, SEED);
    expect(s1.config.nearbyResources).toContain('hunting_grounds');

    const removed = mutate(s1, ev('REMOVE_RESOURCE', { targetId: 'hunting_grounds' }));
    expectPresentThenAbsent(
      s1.config.nearbyResources, removed.config.nearbyResources, 'hunting_grounds',
      'REMOVE_RESOURCE strips the live roster',
    );
    expect(removed._config.resourceEdits.removed).toEqual(['hunting_grounds']);

    const s2 = gen(buildNextConfig(removed), SEED);
    expectPresentThenAbsent(
      s1.config.nearbyResources, s2.config.nearbyResources, 'hunting_grounds',
      'the suppression keeps a rolled node gone across regeneration',
    );
    // ancient_grove survives as this seed's rolled depletion, so the depletion set is
    // demonstrably still populated when we assert the removed node is not in it.
    expectAbsentWithAnchor(
      s2.config.nearbyResourcesDepleted, 'hunting_grounds', 'ancient_grove',
      'a suppressed node carries no depletion record',
    );

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
    // ancient_grove is this seed's own rolled depletion — removing it must
    // take the depletion entry with it, or the next generation carries a
    // depletion for a resource no longer on the roster.
    expect(s1.config.nearbyResourcesDepleted).toContain('ancient_grove');
    const removed = mutate(s1, ev('REMOVE_RESOURCE', { targetId: 'ancient_grove' }));

    const s2 = gen(buildNextConfig(removed), SEED);
    expectPresentThenAbsent(
      s1.config.nearbyResources, s2.config.nearbyResources, 'ancient_grove',
      'the removed node stays off the regenerated roster',
    );
    expectPresentThenAbsent(
      s1.config.nearbyResourcesDepleted, s2.config.nearbyResourcesDepleted, 'ancient_grove',
      'removing a rolled-depleted node takes its depletion entry with it',
    );
  });
});

describe('join: manual mode — the overlay is mode-agnostic', () => {
  const MANUAL_CFG = {
    ...BASE_CFG,
    nearbyResourcesRandom: false,
    nearbyResourcesState: { fishing_grounds: 'allow', stone_quarry: 'allow', grain_fields: 'allow' },
  };

  // Probed roster for this config, both seeds: [grain_fields, stone_quarry].
  // fishing_grounds is authored 'allow' but never joins it — manual mode
  // filters the state map through terrain/route compatibility, and this
  // inland road town has no water. That is the mode working, not drift.

  test("deplete survives the manual-mode 'allow' re-roll", () => {
    // Probed: seed re-man-1 rolls NOTHING depleted from these 'allow' states.
    const s1 = gen(MANUAL_CFG, 're-man-1');
    expect(s1.config.nearbyResourcesDepleted).toEqual([]);

    const depleted = mutate(s1, ev('DEPLETE_RESOURCE', { targetId: 'grain_fields' }));
    const s2 = gen(buildNextConfig(depleted), 're-man-1');
    expect(effectiveDepleted(s2)).toContain('grain_fields');
  });

  test("recovery survives the manual-mode 'allow' re-roll", () => {
    // Probed: seed re-man-2 rolls stone_quarry depleted from 'allow'.
    const s1 = gen(MANUAL_CFG, 're-man-2');
    expect(s1.config.nearbyResourcesDepleted).toContain('stone_quarry');

    const recovered = mutate(s1, ev('RECOVERED_RESOURCE', { targetId: 'stone_quarry' }));
    const s2 = gen(buildNextConfig(recovered), 're-man-2');
    expect(s2.config.nearbyResources).toContain('stone_quarry');
    expectPresentThenAbsent(
      effectiveDepleted(s1), effectiveDepleted(s2), 'stone_quarry',
      "recovery survives the manual-mode 'allow' re-roll",
    );
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
    // 'stressType' is the liveness anchor: it is a real derived key that this same
    // test strips below, so an emptied or renamed DERIVED_CONFIG_KEYS cannot make
    // the exclusion pass by accident.
    expectAbsentWithAnchor(
      DERIVED_CONFIG_KEYS, 'resourceEdits', 'stressType', 'derived-key roster',
    );
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
