/**
 * Embed-on-assign bridge + deriveReligiousAuthority deepening (Feature D / R1).
 *
 * Pins the load-bearing pure-domain half of R1:
 *   1. SET_PRIMARY_DEITY commits config.primaryDeityRef + a self-contained
 *      config.primaryDeitySnapshot (and clears them on a null assignment).
 *   2. The snapshot is a frozen, self-contained COPY — mutating the source
 *      authored deity afterward does not mutate an already-embedded snapshot,
 *      and no wall-clock field leaks into it.
 *   3. deriveReligiousAuthority moves WITH a deity (tier-scaled: major > cult),
 *      is BYTE-IDENTICAL without one except for the new condition scan, and a
 *      deity-free settlement only sees the religious_authority condition scan.
 */

import { describe, expect, test } from 'vitest';

import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { deriveSystemVariable } from '../../src/domain/causalState.js';

function baseSettlement(patch = {}) {
  return {
    name: 'Test Hold',
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    powerStructure: {},
    ...patch,
  };
}

const SNAPSHOT = {
  name: 'Vael',
  alignmentAxis: 'good',
  temperamentAxis: 'warlike',
  rankAxis: 'major',
  domain: 'war',
};

function assign(settlement, deityRef, snapshot) {
  return mutateSettlement({
    settlement,
    event: { type: 'SET_PRIMARY_DEITY', targetId: deityRef, payload: { deityRef, snapshot } },
  });
}

describe('SET_PRIMARY_DEITY — the embed bridge', () => {
  test('writes config.primaryDeityRef + a resolved snapshot', () => {
    const next = assign(baseSettlement(), 'custom:lu_vael', SNAPSHOT);
    expect(next.config.primaryDeityRef).toBe('custom:lu_vael');
    expect(next.config.primaryDeitySnapshot).toMatchObject({
      _deityRef: 'custom:lu_vael',
      name: 'Vael',
      alignmentAxis: 'good',
      temperamentAxis: 'warlike',
      rankAxis: 'major',
      domain: 'war',
    });
  });

  test('the snapshot is self-contained — mutating the source does not change it', () => {
    const source = { ...SNAPSHOT };
    const next = assign(baseSettlement(), 'custom:lu_vael', source);
    // Mutate the authored deity afterward.
    source.rankAxis = 'cult';
    source.name = 'Renamed';
    expect(next.config.primaryDeitySnapshot.rankAxis).toBe('major');
    expect(next.config.primaryDeitySnapshot.name).toBe('Vael');
  });

  test('no wall-clock / stray field leaks into the embedded snapshot', () => {
    const next = assign(baseSettlement(), 'custom:lu_vael', { ...SNAPSHOT, _embeddedAt: '2026-06-18T00:00:00Z', secret: 42 });
    const snap = next.config.primaryDeitySnapshot;
    expect(snap._embeddedAt).toBeUndefined();
    expect(snap.secret).toBeUndefined();
    // Exactly the whitelisted keys.
    expect(Object.keys(snap).sort()).toEqual(['_deityRef', 'alignmentAxis', 'domain', 'name', 'rankAxis', 'temperamentAxis']);
  });

  test('a null assignment clears both keys (returns to dormant)', () => {
    const assigned = assign(baseSettlement(), 'custom:lu_vael', SNAPSHOT);
    const cleared = mutateSettlement({
      settlement: assigned,
      event: { type: 'SET_PRIMARY_DEITY', targetId: null, payload: { deityRef: null, snapshot: null } },
    });
    expect('primaryDeityRef' in cleared.config).toBe(false);
    expect('primaryDeitySnapshot' in cleared.config).toBe(false);
  });
});

describe('deriveReligiousAuthority — deity term + condition scan', () => {
  test('a major-deity settlement has higher religious_authority than the same settlement without', () => {
    const plain = baseSettlement();
    const withDeity = assign(baseSettlement(), 'custom:lu_vael', SNAPSHOT);

    const plainScore = deriveSystemVariable('religious_authority', plain).score;
    const deityScore = deriveSystemVariable('religious_authority', withDeity).score;
    expect(deityScore).toBeGreaterThan(plainScore);
  });

  test('tier-scaled: a major deity lifts more than a cult', () => {
    const major = assign(baseSettlement(), 'custom:lu_major', { ...SNAPSHOT, rankAxis: 'major' });
    const cult = assign(baseSettlement(), 'custom:lu_cult', { ...SNAPSHOT, rankAxis: 'cult' });
    const majorScore = deriveSystemVariable('religious_authority', major).score;
    const cultScore = deriveSystemVariable('religious_authority', cult).score;
    expect(majorScore).toBeGreaterThan(cultScore);
  });

  test('a deity-free settlement is unchanged by the deity term (only the condition scan can move it)', () => {
    const plain = baseSettlement();
    // No conditions present ⇒ score is the pure pre-R1 baseline.
    const v = deriveSystemVariable('religious_authority', plain);
    // The deity contributor must NOT appear for a deity-free settlement.
    const hasDeityContributor = (v.contributors || []).some(c => c.effect === 'deity_patronage');
    expect(hasDeityContributor).toBe(false);
  });

  test('the new condition scan picks up a religious_authority-affecting condition', () => {
    // A settlement carrying regional_religious_pressure (now declares
    // religious_authority) gains a religious_pressure contributor.
    const withCond = baseSettlement({
      activeConditions: [{
        id: 'condition.regional_religious_pressure.x1',
        label: 'Regional religious pressure',
        affectedSystems: ['public_legitimacy', 'social_trust', 'healing_capacity', 'religious_authority'],
        severity: 0.45,
        status: 'stable',
      }],
    });
    const v = deriveSystemVariable('religious_authority', withCond);
    const hasPressure = (v.contributors || []).some(c => c.effect === 'religious_pressure');
    expect(hasPressure).toBe(true);
    // And it moved the score up from the deity-free, condition-free baseline.
    const baseline = deriveSystemVariable('religious_authority', baseSettlement()).score;
    expect(v.score).toBeGreaterThan(baseline);
  });
});
