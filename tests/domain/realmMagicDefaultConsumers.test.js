/**
 * tests/domain/realmMagicDefaultConsumers.test.js — MG-2 pins for the realm's
 * REMAINDER (docs/DESIGN_REALM_MAGIC_TOGGLE §4, MG-LAW-6).
 *
 * `realmMagicDefault` is a virtual key: absent from DEFAULT_SIMULATION_RULES,
 * declared at its inert value in exactly one preset, read exact-'mundane'. Three
 * things must therefore be true at once, and each has its own way of failing
 * silently:
 *
 *   • THE READ IS TOTAL — absent, misspelled, or corrupt all mean "a world of
 *     magic", which is what every realm built before the question was.
 *   • IT IS INERT WHERE IT IS DECLARED — the declaration exists so the next
 *     reader of the preset catalog sees the key; it must not light anything or
 *     move a preset's identity.
 *   • IT REACHES THE SURFACES THAT MUST CARRY IT — a public projection that
 *     silently drops the key would render a shared mundane realm as magical, and
 *     a telemetry list filtered on `=== true` would emit nothing while looking
 *     measured.
 */
import { describe, test, expect } from 'vitest';
import {
  DEFAULT_SIMULATION_RULES,
  SIMULATION_RULE_PRESETS,
  normalizeSimulationRules,
  realmMagicIsMundane,
} from '../../src/domain/worldPulse/simulationRules.js';
import { serializeWorldSnapshotPublic } from '../../src/domain/display/worldSnapshotPublic.js';
import { extractSimulationRules } from '../../src/lib/pulseFingerprint.js';
import { extractSpatialUsage } from '../../src/lib/spatialUsage.js';

describe('MG-2 — the read is total and exact', () => {
  test.each([
    ['absent', {}],
    ['magical', { realmMagicDefault: 'magical' }],
    ['a near miss', { realmMagicDefault: 'Mundane' }],
    ['a boolean', { realmMagicDefault: true }],
    ['null rules', null],
    ['undefined rules', undefined],
  ])('%s reads as a world of magic', (_label, rules) => {
    expect(realmMagicIsMundane(rules)).toBe(false);
  });

  test('only the exact token reads mundane', () => {
    expect(realmMagicIsMundane({ realmMagicDefault: 'mundane' })).toBe(true);
  });
});

describe('MG-2 — the key is virtual and its declaration is inert', () => {
  test('it is absent from the default rule bank (no installed save gains a byte)', () => {
    expect(Object.hasOwn(DEFAULT_SIMULATION_RULES, 'realmMagicDefault')).toBe(false);
    expect(Object.hasOwn(normalizeSimulationRules({}), 'realmMagicDefault')).toBe(false);
  });

  test('it is declared in exactly one preset, at a value that is not mundane', () => {
    const declaring = Object.entries(SIMULATION_RULE_PRESETS)
      .filter(([, preset]) => Object.hasOwn(preset.rules, 'realmMagicDefault'));
    expect(declaring.map(([id]) => id)).toEqual(['full_simulation']);
    expect(realmMagicIsMundane(declaring[0][1].rules)).toBe(false);
  });

  test('every preset still infers its own identity', () => {
    for (const [id, preset] of Object.entries(SIMULATION_RULE_PRESETS)) {
      expect(normalizeSimulationRules(preset.rules).presetId).toBe(id);
    }
  });

  test('a campaign that opted into a mundane realm keeps its preset identity', () => {
    const rules = normalizeSimulationRules({
      ...SIMULATION_RULE_PRESETS.realistic_regional.rules,
      realmMagicDefault: 'mundane',
    });
    expect(rules.presetId).toBe('realistic_regional');
    // The key itself survives normalization — it rides `...input` unnormalized,
    // which is the whole reason the read has to be defensive.
    expect(rules.realmMagicDefault).toBe('mundane');
  });
});

describe('MG-2 — the key reaches the surfaces that must carry it', () => {
  test('the public world snapshot carries a mundane stance', () => {
    const snapshot = serializeWorldSnapshotPublic(
      { schemaVersion: 1, simulationRules: { presetId: 'realistic_regional', intensity: 'normal', realmMagicDefault: 'mundane' } },
      {},
      [],
      { dashboard: true },
    );
    expect(snapshot.dashboard.simulationRules.realmMagicDefault).toBe('mundane');
    // …and drops it for a magical realm, so the default projection is unchanged.
    const magical = serializeWorldSnapshotPublic(
      { schemaVersion: 1, simulationRules: { presetId: 'realistic_regional', intensity: 'normal' } },
      {},
      [],
      { dashboard: true },
    );
    expect(Object.hasOwn(magical.dashboard.simulationRules, 'realmMagicDefault')).toBe(false);
    // Anchor: the allowlist is doing real work in both calls.
    expect(magical.dashboard.simulationRules.presetId).toBe('realistic_regional');
  });

  test('both telemetry emitters carry the stance as an enum, not a dead flag', () => {
    const pulse = extractSimulationRules({ realmMagicDefault: 'mundane', intensity: 'normal' }, []);
    expect(pulse.realm_magic).toBe('mundane');
    expect(pulse.toggles.realmMagicDefault).toBeUndefined();
    expect(extractSimulationRules({ intensity: 'normal' }, []).realm_magic).toBeUndefined();

    const usage = extractSpatialUsage({
      simulationRules: { presetId: 'realistic_regional', realmMagicDefault: 'mundane' },
    });
    expect(usage.sim_config.realm_magic).toBe('mundane');
    expect(usage.sim_config.flags_on).not.toContain('realmMagicDefault');
    // Anchor: the same emitter is alive on a magical realm and simply says nothing.
    const magical = extractSpatialUsage({ simulationRules: { presetId: 'realistic_regional' } });
    expect(magical.sim_config.preset_id).toBe('realistic_regional');
    expect(magical.sim_config.realm_magic).toBeUndefined();
  });
});
