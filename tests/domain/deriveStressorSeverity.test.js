/**
 * #2b — APPLY_STRESSOR onset severity is a CONSEQUENCE of the settlement's
 * preexisting pressure, not a DM-picked payload value.
 *
 * What these pin:
 *   - determinism: the same settlement always derives the same severity;
 *   - directionality + range: a calm settlement derives a lighter onset than a
 *     stressed one, and both land inside the sane [0.45, 0.80] band;
 *   - the static fallback (0.6) on a sparse / non-derivable settlement;
 *   - an explicitly-authored payload.severity STILL wins end-to-end (back-compat),
 *     while an ABSENT severity is derived end-to-end through crisisOnset (the
 *     dossier entry carries the derived number, never a hard-coded 0.6).
 */

import { describe, test, expect } from 'vitest';

import {
  deriveOnsetSeverity,
  resolveOnsetSeverity,
  STATIC_ONSET_SEVERITY,
  ONSET_SEVERITY_MIN,
  ONSET_SEVERITY_MAX,
} from '../../src/domain/state/deriveStressorSeverity.js';
import { resolveStressorEventSeverity } from '../../src/domain/events/resolveStressorEventSeverity.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';

const NOW = '2026-06-23T00:00:00.000Z';

// A steady settlement: prosperous, fed, few factions, no conflicts, safe region.
function calmSettlement() {
  return {
    name: 'Greenhollow',
    tier: 'town',
    economicState: {
      prosperity: 'Wealthy',
      exports: ['grain', 'wool', 'cheese', 'timber', 'ale'],
      foodSecurity: { surplusPct: 50 },
    },
    powerStructure: { factions: [{}, {}], conflicts: [], publicLegitimacy: { score: 85 } },
    config: { monsterThreat: 'civilized', nearbyResourcesState: { iron: 'allow', timber: 'allow' } },
    neighbourNetwork: [],
    institutions: [],
    npcs: [],
    activeConditions: [],
  };
}

// A settlement already at the edge: struggling, starving, faction-riven, plagued,
// resource-depleted, hostile neighbours.
function stressedSettlement() {
  return {
    name: 'Ashfall',
    tier: 'town',
    economicState: {
      prosperity: 'Struggling',
      exports: [],
      foodSecurity: { deficitPct: 35 },
    },
    powerStructure: {
      factions: [{}, {}, {}, {}, {}, {}],
      conflicts: [{ a: 'x' }, { a: 'y' }, { a: 'z' }],
      publicLegitimacy: { score: 18 },
    },
    config: {
      monsterThreat: 'plagued',
      nearbyResourcesState: { iron: 'depleted', timber: 'depleted', salt: 'depleted' },
    },
    neighbourNetwork: [
      { relationshipType: 'hostile' },
      { relationshipType: 'hostile' },
      { relationshipType: 'cold_war' },
    ],
    institutions: [],
    npcs: [],
    activeConditions: [],
  };
}

const onsetEvent = (overrides = {}) => ({
  id: 'ev-onset',
  type: 'APPLY_STRESSOR',
  targetId: 'famine',
  payload: { stressorType: 'famine', label: 'Famine', ...overrides.payload },
  cause: 'player_action',
  ...overrides,
});

describe('deriveOnsetSeverity — severity is a consequence of state', () => {
  test('is deterministic: same settlement → same severity', () => {
    const s = stressedSettlement();
    expect(deriveOnsetSeverity(s)).toBe(deriveOnsetSeverity(s));
    expect(deriveOnsetSeverity(calmSettlement())).toBe(deriveOnsetSeverity(calmSettlement()));
  });

  test('a calm settlement derives a LIGHTER onset than a stressed one', () => {
    const calm = deriveOnsetSeverity(calmSettlement());
    const stressed = deriveOnsetSeverity(stressedSettlement());
    expect(calm).toBeLessThan(stressed);
  });

  test('every derived severity sits inside the sane [0.45, 0.80] band', () => {
    for (const make of [calmSettlement, stressedSettlement, () => ({})]) {
      const sev = deriveOnsetSeverity(make());
      expect(sev).toBeGreaterThanOrEqual(ONSET_SEVERITY_MIN);
      expect(sev).toBeLessThanOrEqual(ONSET_SEVERITY_MAX);
    }
  });

  test('a calm settlement lands near the floor; a stressed one near the ceiling', () => {
    expect(deriveOnsetSeverity(calmSettlement())).toBeLessThan(0.6);
    expect(deriveOnsetSeverity(stressedSettlement())).toBeGreaterThan(0.68);
  });

  test('static fallback: a non-derivable settlement returns 0.6', () => {
    // null derives a usable neutral state (mid pressure), not the fallback — the
    // explicit fallback fires only when derivation itself yields non-finite. A
    // poisoned settlement whose deriveSystemState throws hits the catch path.
    const poisoned = { get economicState() { throw new Error('boom'); } };
    expect(deriveOnsetSeverity(poisoned)).toBe(STATIC_ONSET_SEVERITY);
  });
});

describe('resolveOnsetSeverity / resolveStressorEventSeverity — explicit wins, absent derives', () => {
  test('an explicit payload.severity is honored verbatim (back-compat)', () => {
    expect(resolveOnsetSeverity(stressedSettlement(), { payload: { severity: 0.9 } })).toBe(0.9);
    // present-and-zero is NOT absent — never derived over.
    expect(resolveOnsetSeverity(stressedSettlement(), { payload: { severity: 0 } })).toBe(0);
  });

  test('an absent severity derives from the BEFORE settlement', () => {
    const derived = deriveOnsetSeverity(calmSettlement());
    expect(resolveOnsetSeverity(calmSettlement(), { payload: {} })).toBe(derived);
  });

  test('resolveStressorEventSeverity stamps the derived number onto the cloned event', () => {
    const before = calmSettlement();
    const resolved = resolveStressorEventSeverity(before, onsetEvent());
    expect(resolved.payload.severity).toBe(deriveOnsetSeverity(before));
    // non-APPLY_STRESSOR events and explicitly-authored ones pass through unchanged.
    const explicit = onsetEvent({ payload: { severity: 0.7 } });
    expect(resolveStressorEventSeverity(before, explicit)).toBe(explicit);
    const other = { type: 'KILL_NPC', payload: {} };
    expect(resolveStressorEventSeverity(before, other)).toBe(other);
  });
});

describe('end-to-end through mutateSettlement — the dossier entry carries the DERIVED severity', () => {
  test('an absent-severity onset on a STRESSED settlement records a hard onset', () => {
    const before = stressedSettlement();
    const resolved = resolveStressorEventSeverity(before, onsetEvent());
    const after = mutateSettlement({ settlement: before, event: resolved, now: NOW });
    const entry = (after.stress || after.stressors || []).find(st => st.type === 'famine');
    expect(entry).toBeTruthy();
    expect(entry.severity).toBe(deriveOnsetSeverity(before));
    expect(entry.severity).toBeGreaterThan(0.68);
    // The promoted condition agrees (the crisis triple's local half).
    const cond = (after.activeConditions || []).find(c => c.archetype === 'famine');
    expect(cond.severity).toBeCloseTo(entry.severity, 5);
  });

  test('the SAME onset on a CALM settlement records a lighter onset — varies with state', () => {
    const before = calmSettlement();
    const resolved = resolveStressorEventSeverity(before, onsetEvent());
    const after = mutateSettlement({ settlement: before, event: resolved, now: NOW });
    const entry = (after.stress || after.stressors || []).find(st => st.type === 'famine');
    expect(entry.severity).toBe(deriveOnsetSeverity(before));
    expect(entry.severity).toBeLessThan(deriveOnsetSeverity(stressedSettlement()));
  });

  test('an explicitly-authored severity still wins end-to-end', () => {
    const before = stressedSettlement();
    const resolved = resolveStressorEventSeverity(before, onsetEvent({ payload: { severity: 0.42 } }));
    const after = mutateSettlement({ settlement: before, event: resolved, now: NOW });
    const entry = (after.stress || after.stressors || []).find(st => st.type === 'famine');
    expect(entry.severity).toBe(0.42);
  });
});
