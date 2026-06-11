/**
 * tests/joins/ports.test.js — port economy end-to-end (Cohesion Remediation
 * Wave 4a).
 *
 * Three free-string joins broke the port economy silently:
 *  - UPGRADE_CHAINS paired [Docks/port facilities -> Warehouse district],
 *    treating complementary infrastructure as a scale ladder. 'Warehouse
 *    district' is required:true at city tier, so every city that rolled docks
 *    had them deterministically deleted (at assembly AND again in cascadePass,
 *    which reuses collapseUpgradeChains).
 *  - The 'Port Duties' income source gated on hasInst('major port'), a name no
 *    catalog tier generates — port settlements never earned their flagship
 *    customs income. The gate must key on the real port vocabulary:
 *    'Docks/port facilities', "Harbour master's office", 'Shipyard'.
 *  - priorityHelpers hasPort keyed on names CONTAINING 'port'/'dock', so
 *    'Barge and river transPORT company', 'TelePORTation circle', and
 *    'Airship DOCKing' all read as harbours in the safety profile and the
 *    defense display.
 */
import { afterEach, describe, expect, test } from 'vitest';

import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { UPGRADE_CHAINS, collapseUpgradeChains } from '../../src/generators/steps/assembleInstitutions.js';
import { generateEconomicState } from '../../src/generators/economicGenerator.js';
import { getInstFlags } from '../../src/generators/priorityHelpers.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';
import { clearActiveRng, setActiveRng } from '../../src/generators/rngContext.js';

const PORT_INFRA = ['Docks/port facilities', "Harbour master's office", 'Shipyard'];

function catalogNameSet() {
  const names = new Set();
  for (const tierBlock of Object.values(institutionalCatalog)) {
    for (const category of Object.values(tierBlock)) {
      for (const name of Object.keys(category)) names.add(name);
    }
  }
  return names;
}

// ── Joins: the upgrade-ladder table ──────────────────────────────────────────

describe('joins: UPGRADE_CHAINS is a scale ladder, not an adjacency map', () => {
  test('Docks/port facilities and Warehouse district are never paired', () => {
    // Complementary port infrastructure; Warehouse district is required:true
    // at city tier, so any pairing deterministically deletes the other member.
    const offending = UPGRADE_CHAINS.filter(
      ([a, b]) =>
        (a === 'Docks/port facilities' && b === 'Warehouse district') ||
        (a === 'Warehouse district' && b === 'Docks/port facilities'),
    );
    expect(offending).toEqual([]);
  });

  test('every UPGRADE_CHAINS member is an exact catalog institution name', () => {
    const names = catalogNameSet();
    const dead = UPGRADE_CHAINS.flat().filter((n) => !names.has(n));
    expect(dead, `UPGRADE_CHAINS names absent from the catalog: ${dead.join(', ')}`).toEqual([]);
  });
});

describe('behavior: collapseUpgradeChains (shared by assembly and cascadePass)', () => {
  test('docks and the required city Warehouse district coexist', () => {
    const roster = [
      { name: 'Docks/port facilities', source: 'probabilistic' },
      { name: 'Warehouse district', source: 'required' },
    ];
    const removed = collapseUpgradeChains(roster);
    expect(removed).toEqual([]);
    expect(roster.map((i) => i.name)).toEqual(['Docks/port facilities', 'Warehouse district']);
  });

  test('a genuine scale ladder still collapses to the greater', () => {
    const roster = [
      { name: 'Town hall', source: 'probabilistic' },
      { name: 'City hall', source: 'probabilistic' },
    ];
    const removed = collapseUpgradeChains(roster);
    expect(removed).toEqual(['Town hall']);
    expect(roster.map((i) => i.name)).toEqual(['City hall']);
  });
});

// ── Behavior: the Port Duties income gate ────────────────────────────────────

describe('behavior: Port Duties keys on port institutions the catalog generates', () => {
  afterEach(() => clearActiveRng());

  const incomeFor = (tier, instNames, route) => {
    // rng pinned to 0 → every probability roll passes; the institution gate is
    // the only variable under test.
    setActiveRng({ random: () => 0 });
    const state = generateEconomicState(
      tier,
      instNames.map((name) => ({ name, category: 'Economy' })),
      route,
      {},
      { nearbyResources: [] },
    );
    return state.incomeSources.map((i) => i.source);
  };

  test.each(PORT_INFRA)('port-route city with "%s" earns Port Duties', (inst) => {
    expect(incomeFor('city', [inst], 'port')).toContain('Port Duties');
  });

  test('river-route docks still earn River Tolls, not Port Duties', () => {
    const income = incomeFor('town', ['Docks/port facilities'], 'river');
    expect(income).toContain('River Tolls');
    expect(income).not.toContain('Port Duties');
  });

  test.each([
    ['Barge and river transport company'],
    ['River boatyard'],
    ['Airship docking (high magic)'],
    ['Teleportation circle'],
  ])('"%s" on a port route is not customs infrastructure', (inst) => {
    expect(incomeFor('city', [inst], 'port')).not.toContain('Port Duties');
  });

  test('a port route without port institutions earns no Port Duties', () => {
    expect(incomeFor('city', [], 'port')).not.toContain('Port Duties');
  });
});

// ── Behavior: the hasPort presence flag ──────────────────────────────────────

describe('behavior: hasPort means real port infrastructure', () => {
  const flagsFor = (names) =>
    getInstFlags({}, names.map((name) => ({ name }))).inst;

  test.each(PORT_INFRA)('"%s" reads as a port', (name) => {
    expect(flagsFor([name]).hasPort).toBe(true);
  });

  test.each([
    ['Barge and river transport company'],
    ['Teleportation circle'],
    ['Airship docking (high magic)'],
    ['River boatyard'],
  ])('"%s" does NOT read as a port', (name) => {
    expect(flagsFor([name]).hasPort).toBe(false);
  });

  test('neighbouring flags are not flipped by the port re-key', () => {
    // Warehouse district: warehouse yes, port no (the flag no longer piggybacks).
    const warehouse = flagsFor(['Warehouse district']);
    expect(warehouse.hasWarehouse).toBe(true);
    expect(warehouse.hasPort).toBe(false);
    // Docks alone are a port but not a navy.
    const docks = flagsFor(['Docks/port facilities']);
    expect(docks.hasPort).toBe(true);
    expect(docks.hasNavy).toBe(false);
  });
});

// ── Behavior: the airship exception to the docks water-access rule ───────────

describe('behavior: airship docking exempts docks from the water-access check', () => {
  // cascadePass's airship override deliberately adds 'Docks/port facilities'
  // ("aerial and surface freight") to non-water routes, so the validator's
  // INSTITUTION_SPATIAL check must not flag the institution the generator
  // just added. The exemption keys on airship presence: landlocked docks
  // WITHOUT airships are still a genuine violation.
  const accessViolations = (instNames, route) =>
    checkStructuralValidity(
      instNames.map((name) => ({ name })),
      { tier: 'metropolis', tradeRouteAccess: route },
    ).violations
      .filter((v) => v.type === 'access_violation')
      .map((v) => v.institution);

  test('isolated docks with airship docking raise no water-access violation', () => {
    const av = accessViolations(
      ['Docks/port facilities', 'Airship docking (high magic)'],
      'isolated',
    );
    expect(av).not.toContain('Docks/port facilities');
  });

  test('isolated docks without airship docking still violate', () => {
    expect(accessViolations(['Docks/port facilities'], 'isolated')).toContain(
      'Docks/port facilities',
    );
  });

  test('the exception is narrow: Major port stays water-gated even with airships', () => {
    const av = accessViolations(
      ['Major port', 'Docks/port facilities', 'Airship docking (high magic)'],
      'isolated',
    );
    expect(av).toContain('Major port');
    expect(av).not.toContain('Docks/port facilities');
  });
});

// ── Golden settlements: seeded pipeline truths a DM can see ──────────────────

describe('golden: seeded port settlements across tiers', () => {
  const gen = (config, seed) =>
    generateSettlementPipeline(config, null, { seed, customContent: {} });

  test('port-route town carries docks and Port Duties income', () => {
    const s = gen(
      { settType: 'town', culture: 'norse', terrain: 'coastal', tradeRouteAccess: 'port' },
      'sf-test-2026-04',
    );
    const names = s.institutions.map((i) => i.name);
    expect(names).toContain('Docks/port facilities');
    const income = s.economicState.incomeSources.map((i) => i.source);
    expect(income).toContain('Port Duties');
    expect(income).not.toContain('River Tolls');
  });

  test('port-route city keeps its required Warehouse district, port infrastructure, and customs income', () => {
    const s = gen(
      { settType: 'city', culture: 'mediterranean', terrain: 'coastal', tradeRouteAccess: 'port' },
      'sf-test-2026-04',
    );
    const names = new Set(s.institutions.map((i) => i.name));
    // The required Warehouse district must never displace port infrastructure:
    // both the warehouse AND at least one real port institution are present.
    expect(names.has('Warehouse district')).toBe(true);
    expect(PORT_INFRA.some((p) => names.has(p))).toBe(true);
    const income = s.economicState.incomeSources.map((i) => i.source);
    expect(income).toContain('Port Duties');
  });

  test('isolated high-magic metropolis with airship-added docks gets a clean access receipt', () => {
    // Seed verified to roll 'Airship docking (high magic)' AND have the
    // cascadePass airship override add 'Docks/port facilities' despite the
    // isolated route — exactly the roster that used to trip the spurious
    // "Dock facilities require navigable water" viability warning.
    const s = gen(
      {
        settType: 'metropolis', culture: 'germanic', terrain: 'mountains',
        tradeRouteAccess: 'isolated', magicLevel: 'high', priorityMagic: 90,
      },
      'airship-exception-0',
    );
    const names = new Set(s.institutions.map((i) => i.name));
    expect(names.has('Airship docking (high magic)')).toBe(true);
    expect(names.has('Docks/port facilities')).toBe(true);
    const av = s.structuralViolations.filter((v) => v.type === 'access_violation');
    expect(av).toEqual([]);
  });

  test('river-route city with a barge company does not read as a port', () => {
    // Seed chosen so the roster carries the barge company and none of the
    // real port institutions — the transport company must not register as
    // harbour infrastructure anywhere downstream.
    const s = gen(
      { settType: 'city', culture: 'germanic', terrain: 'river', tradeRouteAccess: 'river' },
      'ports-wave4a-3',
    );
    const names = s.institutions.map((i) => i.name);
    expect(names).toContain('Barge and river transport company');
    expect(PORT_INFRA.some((p) => names.includes(p))).toBe(false);
    expect(getInstFlags({}, s.institutions).inst.hasPort).toBe(false);
    const income = s.economicState.incomeSources.map((i) => i.source);
    expect(income).not.toContain('Port Duties');
  });
});
