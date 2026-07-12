/**
 * simulationProfileValidate.test.js — CL-0 gate (c): validateSimulationProfile
 * property tests (pure, versioned, deterministic, idempotent on its own
 * canonical output, total on garbage), plus the dependency-gating matrix as
 * data and the domainState tri-state read model.
 */
import { describe, expect, test } from 'vitest';

import {
  PROFILE_KEYS,
  normalizeSimulationRules,
  politicalAutonomyOf,
  worldProgressionOf,
} from '../../src/domain/worldPulse/simulationRules.js';
import {
  PROFILE_COERCION_LAWS,
  SIMULATION_DOMAINS,
  domainState,
  validateSimulationProfile,
} from '../../src/domain/worldPulse/simulationProfile.js';

const GARBAGE_INPUTS = [
  undefined, null, 0, 1, NaN, '', 'rules', true, false, [], [1, 2], () => {},
  { worldProgression: 42 }, { politicalAutonomy: ['full'] }, { spatialMode: { nested: true } },
  { travelMode: null, infoMode: NaN, profileVersion: 'nine' },
  { worldProgression: 'living' }, { worldProgression: 'autonomous' },
  { spatialMode: 'full', travelMode: 'slow', infoMode: 'unreliable' },
  { politicalAutonomy: 'banana', majorChangesRequireProposal: false },
];

describe('validateSimulationProfile — total, deterministic, idempotent', () => {
  test('never throws and always returns the versioned shape, on any garbage', () => {
    for (const input of GARBAGE_INPUTS) {
      const out = validateSimulationProfile(input);
      expect(out.profileVersion).toBe(1);
      expect(out.canonical && typeof out.canonical).toBe('object');
      expect(Array.isArray(out.coercions)).toBe(true);
    }
  });

  test('deterministic: identical input produces deep-equal output', () => {
    for (const input of GARBAGE_INPUTS) {
      expect(validateSimulationProfile(input)).toEqual(validateSimulationProfile(input));
    }
  });

  test('canonical is a fixed point (idempotent) and normalizer-canonical', () => {
    for (const input of GARBAGE_INPUTS) {
      const first = validateSimulationProfile(input);
      // canonical IS the normalizer's output — the single canonicalization step
      // every engine consumer already reads through.
      expect(first.canonical).toEqual(normalizeSimulationRules(input));
      const second = validateSimulationProfile(first.canonical);
      expect(second.canonical).toEqual(first.canonical);
      // No STORED coercion may fire on canonical input (presentation laws
      // re-report by design — they describe standing state, e.g. frozen).
      expect(second.coercions.filter(c => c.kind === 'stored')).toEqual([]);
    }
  });

  test('forward values fail closed and are reported as stored coercions', () => {
    const { canonical, coercions } = validateSimulationProfile({
      worldProgression: 'autonomous', spatialMode: 'mapped', travelMode: 'slow', infoMode: 'full',
    });
    expect(canonical.worldProgression).toBe('dm_advanced');
    expect(canonical.spatialMode).toBe('ignore');
    expect(canonical.travelMode).toBe('instant');
    expect(canonical.infoMode).toBe('omniscient');
    const byKey = Object.fromEntries(coercions.map(c => [c.key, c]));
    expect(byKey.worldProgression.law).toBe('progression_not_yet_built');
    expect(byKey.spatialMode.law).toBe('geography_not_yet_built');
    expect(byKey.travelMode.law).toBe('instant_travel_without_geography');
    expect(byKey.infoMode.law).toBe('information_not_yet_built');
    for (const c of coercions) expect(c.kind).toBe('stored');
  });

  test('frozen pauses autonomy PRESENTATION-only: the stored setting survives', () => {
    const { canonical, coercions } = validateSimulationProfile({
      worldProgression: 'frozen', politicalAutonomy: 'full',
    });
    // Stored value preserved (§11: settings preserved, reactivate on resume)…
    expect(canonical.politicalAutonomy).toBe('full');
    // …while the presentation law reports the effective pause.
    const law = coercions.find(c => c.law === 'frozen_world_pauses_autonomy');
    expect(law).toBeTruthy();
    expect(law.kind).toBe('presentation');
    expect(law.to).toBe('dm_only');
    // Unfreezing restores the stored autonomy with no presentation coercion.
    const thawed = validateSimulationProfile({ ...canonical, worldProgression: 'dm_advanced' });
    expect(thawed.canonical.politicalAutonomy).toBe('full');
    expect(thawed.coercions.find(c => c.law === 'frozen_world_pauses_autonomy')).toBeUndefined();
  });

  test('the coercion matrix is data: every law has a stable id and a kind', () => {
    expect(PROFILE_COERCION_LAWS.length).toBeGreaterThanOrEqual(6);
    for (const law of PROFILE_COERCION_LAWS) {
      expect(typeof law.law).toBe('string');
      expect(['stored', 'presentation']).toContain(law.kind);
      expect(typeof law.apply).toBe('function');
    }
  });

  test('profile-absent inputs produce NO stored coercions and stay virtual', () => {
    const { canonical, coercions } = validateSimulationProfile({ warLayerEnabled: true });
    expect(coercions.filter(c => c.kind === 'stored')).toEqual([]);
    for (const key of PROFILE_KEYS) expect(canonical).not.toHaveProperty(key);
  });
});

describe('accessors — virtual reads are total and legacy-faithful', () => {
  test('worldProgressionOf: only explicit frozen freezes; everything else is dm_advanced', () => {
    expect(worldProgressionOf(undefined)).toBe('dm_advanced');
    expect(worldProgressionOf({})).toBe('dm_advanced');
    expect(worldProgressionOf({ worldProgression: 'living' })).toBe('dm_advanced');
    expect(worldProgressionOf({ worldProgression: 'frozen' })).toBe('frozen');
  });

  test('politicalAutonomyOf: explicit mode wins; else the legacy flag maps in', () => {
    expect(politicalAutonomyOf(undefined)).toBe('routine');
    expect(politicalAutonomyOf({ majorChangesRequireProposal: true })).toBe('routine');
    expect(politicalAutonomyOf({ majorChangesRequireProposal: false })).toBe('full');
    expect(politicalAutonomyOf({ politicalAutonomy: 'dm_only', majorChangesRequireProposal: false })).toBe('dm_only');
    expect(politicalAutonomyOf({ politicalAutonomy: 'nonsense' })).toBe('routine');
  });
});

describe('domainState — the derived tri-state over the boolean storage', () => {
  test('legacy defaults: diplomacy/trade/migration auto, war/religion/strategy off', () => {
    const rules = normalizeSimulationRules({});
    expect(domainState(rules, 'diplomacy')).toBe('auto');
    expect(domainState(rules, 'trade')).toBe('auto');
    expect(domainState(rules, 'migration')).toBe('auto');
    expect(domainState(rules, 'war')).toBe('off');
    expect(domainState(rules, 'religion')).toBe('off');
    expect(domainState(rules, 'strategy')).toBe('off');
  });

  test('tolerant of raw/virtual rules (absent keys read each flag default)', () => {
    expect(domainState(undefined, 'trade')).toBe('auto');
    expect(domainState({}, 'war')).toBe('off');
    expect(domainState({ religionDynamicsEnabled: true }, 'religion')).toBe('auto');
  });

  test('dm_only/recommendations present enabled domains as dm; war never does', () => {
    const rules = normalizeSimulationRules({ politicalAutonomy: 'dm_only', warLayerEnabled: true });
    expect(domainState(rules, 'trade')).toBe('dm');
    expect(domainState(rules, 'diplomacy')).toBe('dm');
    // War's initiate/resolve split has not landed — its row is Off/Autonomous only.
    expect(domainState(rules, 'war')).toBe('auto');
    expect(SIMULATION_DOMAINS.war.dmDriven).toBe('deferred');
  });

  test('the booleans remain the storage: no tri-state key is ever persisted', () => {
    const rules = normalizeSimulationRules({ politicalAutonomy: 'recommendations' });
    expect(rules).not.toHaveProperty('domainStates');
    expect(domainState(rules, 'trade')).toBe('dm');
    // Flip the boolean off — the read model follows the storage.
    expect(domainState({ ...rules, tradeFlowsEnabled: false }, 'trade')).toBe('off');
  });
});
