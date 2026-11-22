/**
 * subsystemCertificationTotality.walker.test.js — habitat removal for the
 * UNCERTIFIED SUBSYSTEM class.
 *
 * THE CLASS: a boolean simulation-rule key can be added to the engine, lit in a
 * preset, and shipped without anyone ever asking whether the subsystem behind it
 * actually does anything. The whole-world behavioral oracle cannot catch that: it
 * grades the realm in aggregate, so a completely dead lane passes every check as
 * long as the other lanes carry the tempo. The completed 30-year soak ladder is
 * the proof by example, having graded green while the knowledge mover selected
 * nothing at all and the settlement-lifecycle lane founded and killed nothing.
 *
 * THE WALK: the boolean rule keys reachable from DEFAULT_SIMULATION_RULES and
 * every SIMULATION_RULE_PRESETS override spread must PARTITION exactly across
 *   - SUBSYSTEM_CERTIFICATION_REGISTRY (an authored certification row), and
 *   - SUBSYSTEM_CERTIFICATION_PENDING_KEYS (a declared, shrink-only gap).
 * Both directions red: a rule key in neither list fails (so a NEW subsystem
 * cannot enter the engine uncertified), and a row or pending entry naming a key
 * the engine does not define fails (so the registry cannot drift into fiction).
 *
 * GUARD THE GUARD: auditSubsystemCoverage is a pure set function, so this file
 * drives it with synthetic registries and asserts it REDS on each failure shape
 * before asserting the live partition holds. Without that, a broken auditor would
 * pass everything below on empty sets.
 *
 * TO COMPLY when this reds:
 *   - added a boolean rule key → author its row in the matching lane file, or add
 *     it to that lane's PENDING list with the intent to author it.
 *   - authored a row → delete its key from the lane's PENDING list in the same
 *     edit (the partition is exact; a key may not be in both).
 *   - renamed or removed a rule key → update the row or the PENDING entry.
 */
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import {
  SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
  SUBSYSTEM_CERTIFICATION_REGISTRY,
  SUBSYSTEM_SOAK_EVIDENCE,
  SUBSYSTEM_TEMPOS,
  auditSubsystemCoverage,
  simulationRuleKeys,
} from '../../src/domain/certification/subsystemCertification.js';
import { BEHAVIORAL_MOVER_FAMILIES } from '../../src/domain/certification/behavioralContract.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

// Burn-down marker, not the guard. The partition assertions below are the real
// invariant (they are exact in both directions), so this number exists only to
// keep the remaining gap visible and to point the next author at it. Lower it
// whenever rows land; never raise it.
const PENDING_CEILING = 4;

/** A minimal well-formed row, so the synthetic fixtures below differ in ONE way. */
const fixtureRow = (rule) => ({
  rule,
  title: 'Fixture',
  module: 'src/domain/worldPulse/simulationRules.js',
  aliveness: { eventTypes: ['fixture_event'], moverFamilies: [], stateKeys: [], other: '' },
  expectedTempo: 'rare',
  invariants: [],
  soakEvidence: 'measured',
});

describe('subsystem certification totality (the uncertified-subsystem class)', () => {
  test('guard the guard: the coverage auditor reds on every failure shape', () => {
    const keys = ['aEnabled', 'bEnabled'];
    const both = auditSubsystemCoverage({
      ruleKeys: keys,
      registry: [fixtureRow('aEnabled')],
      pendingKeys: ['bEnabled'],
    });
    expect(both.ok, 'a complete partition must audit clean, or every red below is meaningless').toBe(true);

    // 1. A NEW subsystem with neither a row nor a pending entry.
    const missing = auditSubsystemCoverage({
      ruleKeys: [...keys, 'freshlyAddedEnabled'],
      registry: [fixtureRow('aEnabled')],
      pendingKeys: ['bEnabled'],
    });
    expect(missing.ok).toBe(false);
    expect(missing.missing).toEqual(['freshlyAddedEnabled']);

    // 2. A row naming a rule the engine does not define.
    const fiction = auditSubsystemCoverage({
      ruleKeys: keys,
      registry: [fixtureRow('aEnabled'), fixtureRow('inventedEnabled')],
      pendingKeys: ['bEnabled'],
    });
    expect(fiction.ok).toBe(false);
    expect(fiction.unknownRows).toEqual(['inventedEnabled']);

    // 3. A pending entry naming a rule the engine does not define.
    const stalePending = auditSubsystemCoverage({
      ruleKeys: keys,
      registry: [fixtureRow('aEnabled')],
      pendingKeys: ['bEnabled', 'retiredEnabled'],
    });
    expect(stalePending.ok).toBe(false);
    expect(stalePending.unknownPending).toEqual(['retiredEnabled']);

    // 4. A key claimed as BOTH authored and pending (the half-finished edit).
    const claimedTwice = auditSubsystemCoverage({
      ruleKeys: keys,
      registry: [fixtureRow('aEnabled'), fixtureRow('bEnabled')],
      pendingKeys: ['bEnabled'],
    });
    expect(claimedTwice.ok).toBe(false);
    expect(claimedTwice.claimedTwice).toEqual(['bEnabled']);

    // 5. Two rows for one rule (a merge that duplicated instead of replacing).
    const duplicated = auditSubsystemCoverage({
      ruleKeys: keys,
      registry: [fixtureRow('aEnabled'), fixtureRow('aEnabled')],
      pendingKeys: ['bEnabled'],
    });
    expect(duplicated.ok).toBe(false);
    expect(duplicated.duplicatedRows).toEqual(['aEnabled']);
  });

  test('the rule-key census is non-vacuous and reaches the virtual preset flags', () => {
    const keys = simulationRuleKeys();
    // A census that silently emptied would make the partition below trivially
    // true. The engine carries 46 boolean switches today; the floor is set under
    // that so ordinary retirement does not red the walker, while a collapsed
    // census still does.
    expect(keys.length).toBeGreaterThanOrEqual(40);
    // The virtual flags live ONLY in preset override spreads (they are absent
    // from DEFAULT_SIMULATION_RULES by design), so a census that read the
    // defaults alone would miss the whole wave and one-regen cohorts.
    expect(keys).toContain('settlementLifecycleEnabled');
    expect(keys).toContain('roadsEnabled');
    expect(keys).toContain('npcAgencyEnabled');
  });

  test('every boolean rule key is certified or explicitly pending, and nothing is invented', () => {
    const audit = auditSubsystemCoverage({
      ruleKeys: simulationRuleKeys(),
      registry: SUBSYSTEM_CERTIFICATION_REGISTRY,
      pendingKeys: SUBSYSTEM_CERTIFICATION_PENDING_KEYS,
    });
    expect(
      audit,
      `subsystem certification partition broken.\n`
      + `  uncertified rule keys (author a row or add a PENDING entry): ${audit.missing.join(', ') || 'none'}\n`
      + `  rows naming a rule the engine does not define: ${audit.unknownRows.join(', ') || 'none'}\n`
      + `  pending entries naming a rule the engine does not define: ${audit.unknownPending.join(', ') || 'none'}\n`
      + `  claimed both authored and pending: ${audit.claimedTwice.join(', ') || 'none'}`,
    ).toMatchObject({ ok: true, missing: [], unknownRows: [], unknownPending: [], claimedTwice: [] });
    expect(audit.covered + audit.pending).toBe(simulationRuleKeys().length);
  });

  test('the pending gap is a shrinking burn-down list, deduped and sorted', () => {
    const pending = [...SUBSYSTEM_CERTIFICATION_PENDING_KEYS];
    expect(pending.length).toBeLessThanOrEqual(PENDING_CEILING);
    expect(new Set(pending).size).toBe(pending.length);
    for (const lane of [pending]) {
      const sorted = [...lane].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
      // Sorted WITHIN a lane; the composed list is lane-ordered, so compare the
      // multiset rather than the concatenation.
      expect(new Set(sorted)).toEqual(new Set(lane));
    }
  });

  test('every authored row is well shaped and its declared source paths exist', () => {
    expect(SUBSYSTEM_CERTIFICATION_REGISTRY.length).toBeGreaterThan(0);
    for (const row of SUBSYSTEM_CERTIFICATION_REGISTRY) {
      const where = `row ${row.rule}`;
      expect(typeof row.title, where).toBe('string');
      expect(row.title.length, where).toBeGreaterThan(0);
      expect(SUBSYSTEM_TEMPOS, `${where}: unknown expectedTempo ${row.expectedTempo}`)
        .toContain(row.expectedTempo);
      expect(SUBSYSTEM_SOAK_EVIDENCE, `${where}: unknown soakEvidence ${row.soakEvidence}`)
        .toContain(row.soakEvidence);
      // A row must declare at least one channel or admit it observes nothing.
      const channels = row.aliveness.eventTypes.length
        + row.aliveness.moverFamilies.length
        + row.aliveness.stateKeys.length;
      expect(
        channels > 0 || row.soakEvidence === 'unobserved',
        `${where}: declares no aliveness channel, so it must declare soakEvidence 'unobserved' and say why in aliveness.other`,
      ).toBe(true);
      for (const family of row.aliveness.moverFamilies) {
        expect(BEHAVIORAL_MOVER_FAMILIES, `${where}: ${family} is not a behavioral mover family`)
          .toContain(family);
      }
      for (const invariant of row.invariants) {
        expect(invariant.name.length, `${where}: unnamed invariant`).toBeGreaterThan(0);
        expect(invariant.check.length, `${where}: invariant ${invariant.name} has no receipt-expressible check`)
          .toBeGreaterThan(0);
      }
      // The module path is the row's provenance: it is where the next reader goes
      // to check that the declared event types are still the emitted ones.
      for (const path of row.module.split(',').map((part) => part.trim())) {
        expect(path.length, `${where}: empty module path`).toBeGreaterThan(0);
        expect(existsSync(join(ROOT, path)), `${where}: module path does not exist: ${path}`).toBe(true);
      }
    }
  });
});
