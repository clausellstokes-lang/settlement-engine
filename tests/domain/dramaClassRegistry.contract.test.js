/**
 * dramaClassRegistry.contract.test.js — the E0 §6 WALKER (design §6: "a registration
 * requirement, not a hope"). Guards the drama-class registry (decisionTier.js) +
 * the governor taxonomy (narrativeTempo.js) against silent drift.
 *
 * Three structural guarantees (plan §5.2):
 *  (a) every registry entry has a valid class + birthKind + wired + rationale;
 *  (b) DRAMA_CLASS_PRIORITY covers all 7 classes exactly once, and every registry
 *      entry's class is one of them;
 *  (c) the CATALOG-COVERAGE guard: every STRESSOR_CATALOG key either appears in the
 *      registry as stressor_birth_<key> OR is on the EXEMPT_STRESSOR_TYPES allow-list
 *      WITH a reason — so a future engine that adds a stressor type is FORCED to name
 *      its class or document the exemption.
 */
import { describe, expect, test } from 'vitest';

import {
  DRAMA_CLASS_REGISTRY,
  DRAMA_CLASS_PRIORITY,
  EXEMPT_STRESSOR_TYPES,
} from '../../src/domain/worldPulse/decisionTier.js';
import {
  dramaClassOf,
  isChainedConsequence,
  TEMPO_BUDGETS,
  TEMPO_TIERS,
  narrativeTempoOf,
} from '../../src/domain/worldPulse/narrativeTempo.js';
import { STRESSOR_CATALOG } from '../../src/domain/worldPulse/stressorsCore.js';

const VALID_CLASSES = new Set(DRAMA_CLASS_PRIORITY);
const VALID_BIRTHKINDS = new Set(['spontaneous', 'consequence']);

describe('drama-class registry — entry shape (walker (a))', () => {
  test('every registry entry has a valid class + birthKind + wired + module + rationale', () => {
    const bad = [];
    for (const [key, entry] of Object.entries(DRAMA_CLASS_REGISTRY)) {
      if (!VALID_CLASSES.has(entry.class)) bad.push(`${key}: class ${entry.class}`);
      if (!VALID_BIRTHKINDS.has(entry.birthKind)) bad.push(`${key}: birthKind ${entry.birthKind}`);
      if (typeof entry.wired !== 'boolean') bad.push(`${key}: wired not boolean`);
      if (typeof entry.module !== 'string' || !entry.module) bad.push(`${key}: module missing`);
      if (typeof entry.rationale !== 'string' || entry.rationale.length < 8) bad.push(`${key}: rationale missing`);
    }
    expect(bad).toEqual([]);
  });

  test('anti-vacuity: the registry actually holds wired seam producers AND deferred bypass producers', () => {
    const wired = Object.values(DRAMA_CLASS_REGISTRY).filter((e) => e.wired);
    const deferred = Object.values(DRAMA_CLASS_REGISTRY).filter((e) => !e.wired);
    expect(wired.length).toBeGreaterThan(10);
    expect(deferred.length).toBeGreaterThan(0);
  });
});

describe('drama-class priority (walker (b))', () => {
  test('DRAMA_CLASS_PRIORITY covers exactly the 8 design classes, once each', () => {
    expect(DRAMA_CLASS_PRIORITY.length).toBe(8);
    expect(new Set(DRAMA_CLASS_PRIORITY).size).toBe(8);
    expect([...DRAMA_CLASS_PRIORITY].sort()).toEqual([
      'boom_flourishing', 'calamity', 'economic_shock', 'plague', 'reframe', 'schism_contest', 'succession_coup', 'war',
    ]);
  });

  test('every registry entry class appears in the priority list', () => {
    for (const entry of Object.values(DRAMA_CLASS_REGISTRY)) {
      expect(VALID_CLASSES.has(entry.class)).toBe(true);
    }
  });

  test('war outranks economic_shock (the simultaneity tiebreak keeps war, defers the economic birth)', () => {
    expect(DRAMA_CLASS_PRIORITY.indexOf('war')).toBeLessThan(DRAMA_CLASS_PRIORITY.indexOf('economic_shock'));
  });
});

describe('drama-class registry — STRESSOR_CATALOG coverage (walker (c): the §6 structural requirement)', () => {
  const catalogKeys = Object.keys(STRESSOR_CATALOG);

  test('the catalog is non-empty (anti-vacuity — the walker is scanning real types)', () => {
    expect(catalogKeys.length).toBeGreaterThan(15);
  });

  for (const type of Object.keys(STRESSOR_CATALOG)) {
    test(`stressor type '${type}' is registered OR explicitly exempt with a reason`, () => {
      const registered = Object.prototype.hasOwnProperty.call(DRAMA_CLASS_REGISTRY, `stressor_birth_${type}`);
      const exemptReason = EXEMPT_STRESSOR_TYPES[type];
      const exempt = typeof exemptReason === 'string' && exemptReason.length > 8;
      expect(
        registered || exempt,
        `stressor '${type}' must appear in DRAMA_CLASS_REGISTRY as stressor_birth_${type} OR in EXEMPT_STRESSOR_TYPES with a reason`,
      ).toBe(true);
      // A type is registered XOR exempt — never both (no ambiguous double-classification).
      expect(registered && exempt).toBe(false);
    });
  }

  test('every EXEMPT_STRESSOR_TYPES entry is a real catalog key with a reason (no stale exemptions)', () => {
    for (const [type, reason] of Object.entries(EXEMPT_STRESSOR_TYPES)) {
      expect(catalogKeys, `exempt '${type}' is not a catalog key`).toContain(type);
      expect(typeof reason).toBe('string');
      expect(reason.length).toBeGreaterThan(8);
    }
  });
});

describe('drama-class registry — the UNWIRED set is pinned shrink-only (C5 bar-10)', () => {
  // The soak's honesty note (cacophonySoak.test.js) documents that the bypass
  // producers are REGISTERED-BUT-NOT-WIRED by deliberate per-entry rationale —
  // but until now nothing pinned the SET, so a future producer could land
  // wired:false silently and the ungoverned surface would GROW with every gate
  // green. This is the exact-set idiom: the list below may only SHRINK (a
  // producer gets wired → remove it here in the same diff — a conscious act);
  // a NEW unwired entry reds with its key named. Wiring itself is a product
  // decision on the owner/domain lane — this pin only makes drift visible.
  const UNWIRED_PINNED = Object.freeze([
    'calamity_annual_strike',
    'reframe_transition',
    'religious_contest_flip',
    'satellite_founded',
    'settlement_resettled',
    'settlement_terminal_death',
    'upswing_flourishing',
    'war_mobilization_open',
  ]);

  test('no NEW unwired producer beyond the pinned set (the ungoverned surface never grows silently)', () => {
    const actual = Object.entries(DRAMA_CLASS_REGISTRY)
      .filter(([, e]) => !e.wired)
      .map(([k]) => k)
      .sort();
    const novel = actual.filter((k) => !UNWIRED_PINNED.includes(k));
    expect(
      novel,
      `new REGISTERED-BUT-NOT-WIRED producer(s): ${novel.join(', ')} — either wire the producer through the governor seam (dramaClassOf requires wired:true) or make the deferral a visible, reviewed act by extending UNWIRED_PINNED with the rationale recorded in decisionTier.js`,
    ).toEqual([]);
  });

  test('no stale pin: every pinned key still exists and is still unwired (wiring ratchets the pin down)', () => {
    const stale = [];
    for (const key of UNWIRED_PINNED) {
      const entry = DRAMA_CLASS_REGISTRY[key];
      if (!entry) stale.push(`${key}: no longer in the registry — remove it from UNWIRED_PINNED`);
      else if (entry.wired) stale.push(`${key}: now wired:true — remove it from UNWIRED_PINNED (lock the win in)`);
    }
    expect(stale, `\n${stale.join('\n')}`).toEqual([]);
  });
});

describe('dramaClassOf — the runtime classifier honours the registry', () => {
  test('a wired seam producer classifies to its registered class', () => {
    expect(dramaClassOf({ candidateType: 'stressor_birth_famine' })).toBe('economic_shock');
    expect(dramaClassOf({ candidateType: 'stressor_birth_siege' })).toBe('war');
    expect(dramaClassOf({ candidateType: 'stressor_birth_disease_outbreak' })).toBe('plague');
    expect(dramaClassOf({ candidateType: 'faction_government_challenge' })).toBe('succession_coup');
    // Addendum ruling (2026-07-14): the two REALM_LABELS-grounded types now governed.
    expect(dramaClassOf({ candidateType: 'stressor_birth_political_fracture' })).toBe('succession_coup');
    expect(dramaClassOf({ candidateType: 'stressor_birth_slave_revolt' })).toBe('schism_contest');
  });

  test('the strategy/war disambiguation requires the strategy ruleFamily', () => {
    expect(dramaClassOf({ candidateType: 'strategy_deploy', ruleFamily: 'strategy' })).toBe('war');
    // A strategy_deploy carrying a DIFFERENT ruleFamily is not the war-birth producer.
    expect(dramaClassOf({ candidateType: 'strategy_deploy', ruleFamily: 'other' })).toBe(null);
  });

  test('deferred bypass producers + exempt/unknown types classify null (never governed at the seam)', () => {
    // calamity_annual_strike is wired:false ⇒ null.
    expect(dramaClassOf({ candidateType: 'calamity_annual_strike' })).toBe(null);
    // exempt stressor types (dramaClassOf is by candidateType — an exempt type never resolves).
    expect(dramaClassOf({ candidateType: 'stressor_birth_mass_migration' })).toBe(null);
    expect(dramaClassOf({ candidateType: 'stressor_birth_betrayal' })).toBe(null);
    expect(dramaClassOf({ candidateType: 'conquest' })).toBe(null);
    expect(dramaClassOf(null)).toBe(null);
  });
});

describe('isChainedConsequence — chain immunity predicate (design §1 / plan §1.1)', () => {
  test('receipt is by MARKER, not probability — a prob-1 spontaneous birth is governable', () => {
    // A residual is chained by its candidateType MARKER, at any probability.
    expect(isChainedConsequence({ candidateType: 'stressor_residual', probability: 1 })).toBe(true);
    // A prob-1 candidate WITHOUT a receipt marker is NOT chained. strategy_deploy is
    // prob 1 but a SPONTANEOUS opportunistic-war birth (design §1 names it governor-
    // eligible) — treating prob-1 as chained would let opportunistic wars escape the
    // governor entirely. It must classify as war AND be non-chained (hence governable).
    expect(isChainedConsequence({ candidateType: 'strategy_deploy', ruleFamily: 'strategy', probability: 1 })).toBe(false);
    expect(dramaClassOf({ candidateType: 'strategy_deploy', ruleFamily: 'strategy' })).toBe('war');
  });

  test('the RECEIPTED spread/escalate paths are chained (the plan-regex correction — prefix, not $-anchor)', () => {
    // These ruleIds/candidateTypes END in the stressor TYPE, not the verb — a
    // $-anchored /_(spread|escalate)$/ would MISS them and break chain immunity.
    expect(isChainedConsequence({ candidateType: 'stressor_spread_famine', probability: 0.3 })).toBe(true);
    expect(isChainedConsequence({ candidateType: 'stressor_escalate_famine', probability: 0.4 })).toBe(true);
    expect(isChainedConsequence({ candidateType: 'stressor_residual', probability: 0.2 })).toBe(true);
  });

  test('mobilization reactions + upstream-stressor-sourced conditions are chained', () => {
    expect(isChainedConsequence({ candidateType: 'x', ruleFamily: 'mobilization_reaction', probability: 0.5 })).toBe(true);
    expect(isChainedConsequence({ candidateType: 'x', probability: 0.5, condition: { causes: [{ source: 'world_stressor.famine.a' }] } })).toBe(true);
  });

  test('a spontaneous pressure-born birth is NOT chained (it IS governable)', () => {
    expect(isChainedConsequence({ candidateType: 'stressor_birth_famine', probability: 0.3, condition: { causes: [{ source: 'world_pulse' }] } })).toBe(false);
    expect(isChainedConsequence({ candidateType: 'stressor_birth_siege', probability: 0.2 })).toBe(false);
  });
});

describe('TEMPO_BUDGETS — dial monotonicity by construction (design §4)', () => {
  test('the four tiers exist and match TEMPO_TIERS', () => {
    expect(Object.keys(TEMPO_BUDGETS).sort()).toEqual([...TEMPO_TIERS].sort());
  });

  test('classMax + arcMax are non-decreasing across ascending tiers (louder ⇒ ≥ births)', () => {
    let prevClass = -Infinity;
    let prevArc = -Infinity;
    for (const tier of TEMPO_TIERS) {
      const b = TEMPO_BUDGETS[tier];
      expect(b.classMax).toBeGreaterThanOrEqual(prevClass);
      expect(b.arcMax).toBeGreaterThanOrEqual(prevArc);
      expect(b.graceWeeks).toBeGreaterThan(0);
      prevClass = b.classMax;
      prevArc = b.arcMax;
    }
  });
});

describe('narrativeTempoOf — fail-closed activation gate (design §3)', () => {
  test('a valid tier lights the governor; absent/garbage is DORMANT (null)', () => {
    expect(narrativeTempoOf({ narrativeTempo: 'dramatic_campaign' })).toBe('dramatic_campaign');
    expect(narrativeTempoOf({ narrativeTempo: 'quiet_local' })).toBe('quiet_local');
    expect(narrativeTempoOf({})).toBe(null);
    expect(narrativeTempoOf({ narrativeTempo: 'nonsense' })).toBe(null);
    expect(narrativeTempoOf(null)).toBe(null);
    expect(narrativeTempoOf({ narrativeTempo: 3 })).toBe(null);
  });
});
