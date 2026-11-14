/**
 * gangLineNeedsAGang.test.js — UPKEEP-9, step 7 (2026-11-14): the round-three cut's #1082. The safety profile's
 * street-gang line ("A street gang controls part of the place …", and its several-gangs sibling "Territorial
 * gangs …") is opened by the gang flag, `priorityHelpers.js :: getInstFlags` → `inst.hasGangInfra`. The flag read
 * "Front businesses" (a criminal front, not a gang) as gang infrastructure, so the line printed where the roster
 * holds no gang house: 6 of the lane's 1,490 births at the capacity merge (c448bb3a0), all cities with Front
 * businesses and a black market and no street gang. THE CURE: the flag reads the gang houses only (the catalogue's
 * "Street gang" and "Multiple criminal factions", the same two `safetyLineTruth.js :: GANG_HOUSES_OF` counts).
 * THE GUARDS are three of the six: the line must not print. THE TWIN GUARD is a town with a Street gang (and one with
 * a Street gang beside Front businesses): the line still prints. Red at 33acecd6d.
 */
import { beforeAll, describe, expect, test } from 'vitest';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getInstFlags } from '../../src/generators/priorityHelpers.js';

beforeAll(async () => { await loadGenerationLawPayloads(); });

/** The lane's rv2 shape: rv2-<crisis|calm>-<size>-<i>. */
const cfgFor = (seed) => {
  const m = /^rv2-([a-z_+]+)-(\w+)-\d+$/.exec(seed);
  if (!m) throw new Error(`seed shape ${seed}`);
  return birthConfig({ ...DEFAULT_CONFIG, settType: m[2], selectedStresses: m[1] === 'calm' ? [] : m[1].split('+'), selectedStressesRandom: false });
};
const birth = (seed) => generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
const gangLines = (s) => (s.economicState.safetyProfile.crimeTypes || []).filter((c) => c.type === 'Street gang activity');

describe('#1082: the gang flag reads the gang houses', () => {
  test('a criminal front is not a gang; a street gang and several criminal factions are', () => {
    expect(getInstFlags({}, [{ name: 'Front businesses' }]).inst.hasGangInfra).toBe(false);
    expect(getInstFlags({}, [{ name: 'Street gang' }]).inst.hasGangInfra).toBe(true);
    expect(getInstFlags({}, [{ name: 'Multiple criminal factions' }]).inst.hasGangInfra).toBe(true);
    expect(getInstFlags({}, [{ name: 'Front businesses' }, { name: 'Street gang' }]).inst.hasGangInfra).toBe(true);
  });

  test('GUARDS: Front businesses and no gang house, so no street-gang line (three of the six towns)', () => {
    for (const seed of ['rv2-under_siege-city-10', 'rv2-under_siege-city-31', 'rv2-succession_void-city-12']) {
      const s = birth(seed);
      const names = (s.institutions || []).map((i) => String(i.name));
      expect(names, seed).toContain('Front businesses');
      expect(names.some((n) => /street gang|multiple criminal/i.test(n)), seed).toBe(false);
      expect(gangLines(s), seed).toEqual([]);
    }
  });

  test('TWIN GUARDS: a Street gang stands, so the line prints', () => {
    for (const seed of ['rv2-calm-town-0', 'rv2-calm-town-30']) {
      const s = birth(seed);
      expect((s.institutions || []).some((i) => /street gang/i.test(String(i.name))), seed).toBe(true);
      expect(gangLines(s).length, seed).toBe(1);
    }
  });
});
