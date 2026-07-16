/**
 * tests/domain/activeConditions.test.js — Tier 2.3 canonical state contract.
 *
 * Pins:
 *   - severityBand boundaries (low / medium / high / critical).
 *   - conditionIdFromArchetype stability + format.
 *   - deriveActiveCondition defaults from catalog, normalizes shape,
 *     preserves explicit values.
 *   - deriveAllActiveConditions tolerates missing / empty / nullish.
 *   - activeArchetypes returns flat archetype keys.
 *   - withActiveCondition: pure clone-and-add, replaces by id.
 *   - withoutActiveCondition: pure clone-and-remove.
 *   - withTickedConditionDurations: per-interval increments.
 *   - withExpiredConditionsRemoved: drops past-cap, keeps null-cap.
 *   - summarizeActiveConditions: aggregate counts + lines.
 */

import { describe, it, expect } from 'vitest';
import {
  severityBand,
  defaultSeverityForBand,
  conditionIdFromArchetype,
  deriveActiveCondition,
  deriveAllActiveConditions,
  activeArchetypes,
  findActiveCondition,
  withActiveCondition,
  withoutActiveCondition,
  withTickedConditionDurations,
  withExpiredConditionsRemoved,
  summarizeActiveConditions,
  supportedConditionArchetypes,
  conditionArchetypeTemplate,
  severityBands,
} from '../../src/domain/activeConditions.js';

// ── severityBand / defaultSeverityForBand ──────────────────────────────

describe('severityBand()', () => {
  it('maps scores to canonical bands at the right boundaries', () => {
    expect(severityBand(0.0)).toBe('low');
    expect(severityBand(0.24)).toBe('low');
    expect(severityBand(0.25)).toBe('medium');
    expect(severityBand(0.49)).toBe('medium');
    expect(severityBand(0.5)).toBe('high');
    expect(severityBand(0.74)).toBe('high');
    expect(severityBand(0.75)).toBe('critical');
    expect(severityBand(1.0)).toBe('critical');
  });

  it('treats non-numeric input as 0 (low)', () => {
    expect(severityBand(null)).toBe('low');
    expect(severityBand(undefined)).toBe('low');
    expect(severityBand('high')).toBe('low');
  });

  it('clamps out-of-range scores', () => {
    expect(severityBand(-5)).toBe('low');
    expect(severityBand(5)).toBe('critical');
  });
});

describe('defaultSeverityForBand()', () => {
  it('round-trips through severityBand', () => {
    for (const band of ['low', 'medium', 'high', 'critical']) {
      expect(severityBand(defaultSeverityForBand(band))).toBe(band);
    }
  });
});

// ── conditionIdFromArchetype ───────────────────────────────────────────

describe('conditionIdFromArchetype()', () => {
  it('produces a stable hash-suffixed id when no sourceEventId given', () => {
    const a = conditionIdFromArchetype('plague', { label: 'Plague', tick: 0 });
    const b = conditionIdFromArchetype('plague', { label: 'Plague', tick: 0 });
    expect(a).toBe(b);
    expect(a).toMatch(/^condition\.plague\.[a-z0-9]+$/);
  });

  it('uses sourceEventId as a stable suffix when provided', () => {
    const a = conditionIdFromArchetype('plague', { sourceEventId: 'EVENT-42' });
    const b = conditionIdFromArchetype('plague', { sourceEventId: 'EVENT-42' });
    expect(a).toBe(b);
    expect(a).toMatch(/^condition\.plague\./);
  });

  it('snake-cases the archetype', () => {
    expect(conditionIdFromArchetype('Trade Route Cut', { suffix: 'x' })).toMatch(/^condition\.trade_route_cut\./);
  });

  it('accepts an explicit suffix override', () => {
    expect(conditionIdFromArchetype('plague', { suffix: 'spring-1399' })).toBe('condition.plague.spring_1399');
  });
});

// ── deriveActiveCondition ──────────────────────────────────────────────

describe('deriveActiveCondition()', () => {
  it('fills defaults from the catalog for a known archetype', () => {
    const c = deriveActiveCondition({ archetype: 'plague' });
    expect(c.label).toBe('Plague');
    expect(c.severity).toBeGreaterThan(0);
    expect(c.severityBand).toBe(severityBand(c.severity));
    expect(c.status).toBe('worsening');
    expect(c.affectedSystems.length).toBeGreaterThan(0);
    expect(c.duration.expiresAtTicks).toBe(12);
    expect(c.duration.elapsedTicks).toBe(0);
    expect(c.id).toMatch(/^condition\.plague\./);
  });

  it('preserves explicit values over catalog defaults', () => {
    const c = deriveActiveCondition({
      archetype: 'plague',
      severity: 0.9,
      status: 'easing',
      label: 'Spring Cough',
      description: 'A mild respiratory illness.',
      duration: { elapsedTicks: 3, expiresAtTicks: 5 },
      affectedSystems: ['food_security'],
    });
    expect(c.severity).toBe(0.9);
    expect(c.severityBand).toBe('critical');
    expect(c.status).toBe('easing');
    expect(c.label).toBe('Spring Cough');
    expect(c.description).toBe('A mild respiratory illness.');
    expect(c.duration.elapsedTicks).toBe(3);
    expect(c.duration.expiresAtTicks).toBe(5);
    expect(c.affectedSystems).toEqual(['food_security']);
  });

  it('clamps severity to 0..1', () => {
    expect(deriveActiveCondition({ archetype: 'plague', severity: -2 }).severity).toBe(0);
    expect(deriveActiveCondition({ archetype: 'plague', severity:  9 }).severity).toBe(1);
  });

  it('uses a sane default for unknown archetype (no catalog entry)', () => {
    const c = deriveActiveCondition({ archetype: 'mystery_thing' });
    expect(c.id).toMatch(/^condition\.mystery_thing\./);
    expect(c.label).toBe('mystery_thing');
    expect(c.duration.expiresAtTicks).toBeNull();
  });

  it('honors an existing canonical id (idempotent contract)', () => {
    const c1 = deriveActiveCondition({ archetype: 'plague' });
    const c2 = deriveActiveCondition({ ...c1 });
    expect(c2.id).toBe(c1.id);
  });

  it('returns null for nullish input', () => {
    expect(deriveActiveCondition(null)).toBeNull();
    expect(deriveActiveCondition('plague')).toBeNull();
  });
});

// ── deriveAllActiveConditions ──────────────────────────────────────────

describe('deriveAllActiveConditions()', () => {
  it('returns [] for nullish settlement', () => {
    expect(deriveAllActiveConditions(null)).toEqual([]);
  });

  it('returns [] for settlement without activeConditions', () => {
    expect(deriveAllActiveConditions({ name: 'Empty' })).toEqual([]);
  });

  it('derives every entry from a populated list', () => {
    const settlement = {
      activeConditions: [
        { archetype: 'plague' },
        { archetype: 'trade_route_cut' },
      ],
    };
    const out = deriveAllActiveConditions(settlement);
    expect(out).toHaveLength(2);
    expect(out.map(c => c.archetype)).toEqual(['plague', 'trade_route_cut']);
  });

  it('drops nullish entries', () => {
    const settlement = {
      activeConditions: [{ archetype: 'plague' }, null, undefined, 'not_an_object'],
    };
    expect(deriveAllActiveConditions(settlement)).toHaveLength(1);
  });
});

// ── activeArchetypes ───────────────────────────────────────────────────

describe('activeArchetypes()', () => {
  it('flattens to archetype keys', () => {
    const settlement = {
      activeConditions: [
        { archetype: 'plague' },
        { archetype: 'trade_route_cut' },
      ],
    };
    expect(activeArchetypes(settlement)).toEqual(['plague', 'trade_route_cut']);
  });

  it('returns [] when no conditions present', () => {
    expect(activeArchetypes({})).toEqual([]);
    expect(activeArchetypes(null)).toEqual([]);
  });
});

// ── findActiveCondition ────────────────────────────────────────────────

describe('findActiveCondition()', () => {
  const settlement = {
    activeConditions: [
      { id: 'condition.plague.fixed', archetype: 'plague' },
      { archetype: 'siege_lifted' },
    ],
  };

  it('finds by canonical id', () => {
    expect(findActiveCondition(settlement, 'condition.plague.fixed')).toBeTruthy();
  });

  it('finds by archetype', () => {
    expect(findActiveCondition(settlement, 'siege_lifted')).toBeTruthy();
  });

  it('returns null for missing', () => {
    expect(findActiveCondition(settlement, 'absent')).toBeNull();
    expect(findActiveCondition(settlement, null)).toBeNull();
  });
});

// ── withActiveCondition / withoutActiveCondition ───────────────────────

describe('withActiveCondition()', () => {
  it('adds a condition without mutating the input', () => {
    const s = { name: 'Test', activeConditions: [] };
    const before = JSON.stringify(s);
    const next = withActiveCondition(s, { archetype: 'plague' });
    expect(JSON.stringify(s)).toBe(before);
    expect(next.activeConditions).toHaveLength(1);
    expect(next.activeConditions[0].archetype).toBe('plague');
  });

  it('replaces an existing entry with the same id', () => {
    const c1 = deriveActiveCondition({ archetype: 'plague', severity: 0.4 });
    const s = { name: 'Test', activeConditions: [c1] };
    const next = withActiveCondition(s, { ...c1, severity: 0.9 });
    expect(next.activeConditions).toHaveLength(1);
    expect(next.activeConditions[0].severity).toBe(0.9);
  });

  it('returns input unchanged for nullish settlement', () => {
    expect(withActiveCondition(null, { archetype: 'plague' })).toBeNull();
  });

  it('returns input unchanged for nullish partial', () => {
    const s = { activeConditions: [] };
    expect(withActiveCondition(s, null)).toBe(s);
  });
});

describe('withoutActiveCondition()', () => {
  it('removes the matching id, returns new object', () => {
    const c = deriveActiveCondition({ archetype: 'plague' });
    const s = { activeConditions: [c] };
    const next = withoutActiveCondition(s, c.id);
    expect(next.activeConditions).toHaveLength(0);
    expect(next).not.toBe(s);
  });

  it('returns the same settlement object when id not present (no-op)', () => {
    const s = { activeConditions: [] };
    const next = withoutActiveCondition(s, 'condition.absent.x');
    expect(next).toBe(s);
  });
});

// ── withTickedConditionDurations ───────────────────────────────────────

describe('withTickedConditionDurations()', () => {
  it('advances elapsedTicks by per-month increment by default', () => {
    const c = deriveActiveCondition({ archetype: 'plague' });
    const s = { activeConditions: [c] };
    const next = withTickedConditionDurations(s, 'one_month');
    expect(next.activeConditions[0].duration.elapsedTicks).toBe(1);
  });

  it('scales by interval (week is 0.25, year is 6)', () => {
    const c = deriveActiveCondition({ archetype: 'plague' });
    const s = { activeConditions: [c] };
    const weekly = withTickedConditionDurations(s, 'one_week');
    const yearly = withTickedConditionDurations(s, 'one_year');
    expect(weekly.activeConditions[0].duration.elapsedTicks).toBeCloseTo(0.25);
    expect(yearly.activeConditions[0].duration.elapsedTicks).toBeCloseTo(6.0);
  });

  it('coerces unknown intervals to one_month', () => {
    const c = deriveActiveCondition({ archetype: 'plague' });
    const s = { activeConditions: [c] };
    const next = withTickedConditionDurations(s, 'one_decade');
    expect(next.activeConditions[0].duration.elapsedTicks).toBe(1);
  });

  it('does not mutate input', () => {
    const c = deriveActiveCondition({ archetype: 'plague' });
    const s = { activeConditions: [c] };
    const before = JSON.stringify(s);
    withTickedConditionDurations(s, 'one_month');
    expect(JSON.stringify(s)).toBe(before);
  });

  it('returns input when no conditions to tick', () => {
    const s = { activeConditions: [] };
    expect(withTickedConditionDurations(s, 'one_month')).toBe(s);
  });
});

// ── withTickedConditionDurations — severity dynamics (W5#5) ────────────
//
// Status was written everywhere and consumed for dynamics nowhere; severity
// sat flat until the expiry cliff. Now the status written on the condition
// nudges severity per tick (worsening +0.04/tick clamped at 1, easing
// −0.06/tick floored at 0.05, everything else flat) and the last 2 ticks
// before expiresAtTicks force the easing nudge so the condition winds down
// instead of flat-then-cliff. Expiry timing itself is untouched.

describe('withTickedConditionDurations() — severity dynamics (W5#5)', () => {
  const tick = (s, interval = 'one_month') => withTickedConditionDurations(s, interval);
  const sev = (s) => s.activeConditions[0].severity;

  it('a worsening condition climbs by 0.04 per tick', () => {
    // Plague defaults: status worsening, severity 0.6, expires at 12.
    const s0 = { activeConditions: [deriveActiveCondition({ archetype: 'plague' })] };
    const s1 = tick(s0);
    const s2 = tick(s1);
    expect(sev(s1)).toBeCloseTo(0.64);
    expect(sev(s2)).toBeCloseTo(0.68);
  });

  it('an easing condition decays by 0.06 per tick', () => {
    // corruption_exposed defaults: status easing, severity 0.5, expires at 6.
    const s0 = { activeConditions: [deriveActiveCondition({ archetype: 'corruption_exposed' })] };
    const s1 = tick(s0);
    expect(sev(s1)).toBeCloseTo(0.44);
  });

  it('a stable condition holds severity exactly', () => {
    // trade_route_cut defaults: status stable, severity 0.5, expires at 9.
    const s0 = { activeConditions: [deriveActiveCondition({ archetype: 'trade_route_cut' })] };
    expect(sev(tick(s0))).toBe(0.5);
  });

  it('a no-status condition holds severity — canonical defaulting must not invent motion', () => {
    // Raw partial, never derived: no status written. Plague's template
    // defaults to 'worsening', so this pins that the drift reads the
    // status as written, not the canonical default.
    const s0 = { activeConditions: [{
      archetype: 'plague', severity: 0.6,
      duration: { elapsedTicks: 0, expiresAtTicks: 12 },
    }] };
    const s1 = tick(s0);
    expect(sev(s1)).toBe(0.6);
    expect(s1.activeConditions[0].duration.elapsedTicks).toBe(1);
  });

  it("a legacy 'active' status holds severity — flat is correct for non-directional statuses", () => {
    const s0 = { activeConditions: [{
      archetype: 'plague', severity: 0.6, status: 'active',
      duration: { elapsedTicks: 0, expiresAtTicks: 12 },
    }] };
    expect(sev(tick(s0))).toBe(0.6);
  });

  it('drift scales with the interval (week 0.25x, year 6x)', () => {
    const s0 = { activeConditions: [deriveActiveCondition({ archetype: 'plague', severity: 0.6 })] };
    expect(sev(tick(s0, 'one_week'))).toBeCloseTo(0.6 + 0.04 * 0.25);
    expect(sev(tick(s0, 'one_year'))).toBeCloseTo(0.6 + 0.04 * 6.0);
  });

  it('worsening clamps at 1', () => {
    const hot = { activeConditions: [deriveActiveCondition({
      archetype: 'plague', severity: 0.99, status: 'worsening',
      duration: { elapsedTicks: 0, expiresAtTicks: 12 },
    })] };
    expect(sev(tick(hot))).toBe(1);
  });

  it('easing floors at 0.05 and holds there', () => {
    const cold = { activeConditions: [deriveActiveCondition({
      archetype: 'corruption_exposed', severity: 0.08, status: 'easing',
      duration: { elapsedTicks: 0, expiresAtTicks: 12 },
    })] };
    const c1 = tick(cold);
    expect(sev(c1)).toBe(0.05);
    expect(sev(tick(c1))).toBe(0.05);
  });

  it('severityBand is recomputed from the nudged severity', () => {
    const s0 = { activeConditions: [deriveActiveCondition({
      archetype: 'plague', severity: 0.73, status: 'worsening',
      duration: { elapsedTicks: 0, expiresAtTicks: 12 },
    })] };
    const s1 = tick(s0);
    expect(sev(s1)).toBeCloseTo(0.77);
    expect(s1.activeConditions[0].severityBand).toBe('critical');
  });

  it('within 2 ticks of expiry the condition ramps toward easing instead of flat-then-cliff', () => {
    const s0 = { activeConditions: [deriveActiveCondition({
      archetype: 'plague', severity: 0.6, status: 'worsening',
      duration: { elapsedTicks: 9, expiresAtTicks: 12 },
    })] };
    const s1 = tick(s0); // elapsed 10, remaining 2 → wind-down
    expect(sev(s1)).toBeCloseTo(0.54);
    expect(s1.activeConditions[0].status).toBe('easing');
  });

  it('the wind-down boundary is exact: remaining 2.25 still worsens, remaining 2 eases', () => {
    const s0 = { activeConditions: [deriveActiveCondition({
      archetype: 'plague', severity: 0.6, status: 'worsening',
      duration: { elapsedTicks: 9.5, expiresAtTicks: 12 },
    })] };
    const s1 = tick(s0, 'one_week'); // elapsed 9.75, remaining 2.25 → still worsening
    expect(s1.activeConditions[0].status).toBe('worsening');
    expect(sev(s1)).toBeCloseTo(0.61);
    const s2 = tick(s1, 'one_week'); // elapsed 10, remaining 2 → wind-down
    expect(s2.activeConditions[0].status).toBe('easing');
    expect(sev(s2)).toBeCloseTo(0.595);
  });

  it('outside the wind-down window a worsening condition still worsens', () => {
    const s0 = { activeConditions: [deriveActiveCondition({
      archetype: 'plague', severity: 0.6, status: 'worsening',
      duration: { elapsedTicks: 8, expiresAtTicks: 12 },
    })] };
    const s1 = tick(s0); // elapsed 9, remaining 3 → no wind-down yet
    expect(sev(s1)).toBeCloseTo(0.64);
    expect(s1.activeConditions[0].status).toBe('worsening');
  });

  it('a null-expiry condition never winds down — it drifts by status alone', () => {
    const s0 = { activeConditions: [deriveActiveCondition({
      archetype: 'unknown_thing', severity: 0.5, status: 'worsening',
      duration: { elapsedTicks: 99, expiresAtTicks: null },
    })] };
    const s1 = tick(s0);
    expect(sev(s1)).toBeCloseTo(0.54);
    expect(s1.activeConditions[0].status).toBe('worsening');
  });

  it('the nudge never resurrects an expired condition — expiry drops exactly as before', () => {
    const s0 = { activeConditions: [deriveActiveCondition({
      archetype: 'plague', severity: 0.6,
      duration: { elapsedTicks: 11, expiresAtTicks: 12 },
    })] };
    const { settlement, expired } = withExpiredConditionsRemoved(tick(s0));
    expect(settlement.activeConditions).toHaveLength(0);
    expect(expired).toHaveLength(1);
  });

  it('every field other than severity, band, status, and elapsed is preserved verbatim', () => {
    const c0 = deriveActiveCondition({
      archetype: 'plague', severity: 0.6, status: 'worsening',
      duration: { elapsedTicks: 0, expiresAtTicks: 12 },
      causes: ['caravan from the delta'],
    });
    const s1 = tick({ activeConditions: [c0] });
    const c1 = s1.activeConditions[0];
    expect(c1.id).toBe(c0.id);
    expect(c1.label).toBe(c0.label);
    expect(c1.description).toBe(c0.description);
    expect(c1.archetype).toBe(c0.archetype);
    expect(c1.affectedSystems).toEqual(c0.affectedSystems);
    expect(c1.causes).toEqual(c0.causes);
    expect(c1.triggeredAt).toEqual(c0.triggeredAt);
    expect(c1.duration.expiresAtTicks).toBe(c0.duration.expiresAtTicks);
  });
});

// ── withExpiredConditionsRemoved ───────────────────────────────────────

describe('withExpiredConditionsRemoved()', () => {
  it('drops conditions that have reached expiresAtTicks', () => {
    const c = deriveActiveCondition({
      archetype: 'plague',
      duration: { elapsedTicks: 12, expiresAtTicks: 12 },
    });
    const s = { activeConditions: [c] };
    const { settlement, expired } = withExpiredConditionsRemoved(s);
    expect(settlement.activeConditions).toHaveLength(0);
    expect(expired).toHaveLength(1);
    expect(expired[0].archetype).toBe('plague');
  });

  it('keeps conditions whose elapsedTicks is below cap', () => {
    const c = deriveActiveCondition({
      archetype: 'plague',
      duration: { elapsedTicks: 5, expiresAtTicks: 12 },
    });
    const s = { activeConditions: [c] };
    const { settlement, expired } = withExpiredConditionsRemoved(s);
    expect(settlement.activeConditions).toHaveLength(1);
    expect(expired).toHaveLength(0);
    // No-op should return the same settlement reference.
    expect(settlement).toBe(s);
  });

  it('keeps conditions with null expiresAtTicks (persists indefinitely)', () => {
    const c = deriveActiveCondition({
      archetype: 'unknown_thing',
      duration: { elapsedTicks: 999, expiresAtTicks: null },
    });
    const s = { activeConditions: [c] };
    const { settlement, expired } = withExpiredConditionsRemoved(s);
    expect(settlement.activeConditions).toHaveLength(1);
    expect(expired).toHaveLength(0);
  });

  it('drops only the expired ones (mixed case)', () => {
    const expired = deriveActiveCondition({
      archetype: 'plague',
      duration: { elapsedTicks: 13, expiresAtTicks: 12 },
    });
    const alive = deriveActiveCondition({
      archetype: 'siege_lifted',
      duration: { elapsedTicks: 2, expiresAtTicks: 6 },
    });
    const s = { activeConditions: [expired, alive] };
    const result = withExpiredConditionsRemoved(s);
    expect(result.settlement.activeConditions).toHaveLength(1);
    expect(result.settlement.activeConditions[0].archetype).toBe('siege_lifted');
    expect(result.expired).toHaveLength(1);
    expect(result.expired[0].archetype).toBe('plague');
  });

  it('returns sane defaults for nullish settlement', () => {
    const result = withExpiredConditionsRemoved(null);
    expect(result.settlement).toBeNull();
    expect(result.expired).toEqual([]);
  });
});

// ── summarizeActiveConditions ──────────────────────────────────────────

describe('summarizeActiveConditions()', () => {
  it('returns zero counts on an empty settlement', () => {
    const s = summarizeActiveConditions({});
    expect(s.count).toBe(0);
    expect(s.summaryLines).toEqual([]);
  });

  it('counts archetypes + bands and produces summary lines', () => {
    const s = {
      activeConditions: [
        { archetype: 'plague',          severity: 0.8 },
        { archetype: 'trade_route_cut', severity: 0.4 },
      ],
    };
    const out = summarizeActiveConditions(s);
    expect(out.count).toBe(2);
    expect(out.byArchetype.plague).toBe(1);
    expect(out.byArchetype.trade_route_cut).toBe(1);
    expect(out.bySeverityBand.critical).toBe(1);
    expect(out.bySeverityBand.medium).toBe(1);
    expect(out.summaryLines).toHaveLength(2);
  });
});

// ── supportedConditionArchetypes / template / bands ────────────────────

describe('supportedConditionArchetypes()', () => {
  it('contains the full faction-impact archetype set', () => {
    const set = new Set(supportedConditionArchetypes());
    expect(set.has('plague')).toBe(true);
    expect(set.has('trade_route_cut')).toBe(true);
    expect(set.has('corruption_exposed')).toBe(true);
    expect(set.has('food_anchor_lost')).toBe(true);
    expect(set.has('dominant_npc_removed')).toBe(true);
    expect(set.has('siege_lifted')).toBe(true);
  });

  // Wave 7: the magical crisis family (magical_instability / magic_deadzone
  // stressors) promotes into this archetype — the first condition that can
  // reach the substrate's magical_stability variable.
  it('contains the Wave 7 magical_instability archetype tagging magical_stability', () => {
    expect(supportedConditionArchetypes()).toContain('magical_instability');
    const t = conditionArchetypeTemplate('magical_instability');
    expect(t.affectedSystems).toContain('magical_stability');
    expect(t.affectedSystems).toContain('healing_capacity');
  });

  // Wave 7: deriveHousingPressure charges this condition through the
  // affectedSystems contract (like every other deriver), so the template
  // must DECLARE housing_pressure — otherwise the explanation/AI surfaces
  // list food/labor/legitimacy while the substrate quietly shows a housing
  // contributor.
  it('regional_migration_pressure declares housing_pressure among its affectedSystems', () => {
    const t = conditionArchetypeTemplate('regional_migration_pressure');
    expect(t.affectedSystems).toContain('housing_pressure');
    expect(t.affectedSystems).toContain('food_security');
    expect(t.affectedSystems).toContain('labor_capacity');
    expect(t.affectedSystems).toContain('public_legitimacy');
  });
});

describe('conditionArchetypeTemplate()', () => {
  it('returns the catalog entry for a known archetype', () => {
    const t = conditionArchetypeTemplate('plague');
    expect(t).toBeTruthy();
    expect(t.label).toBe('Plague');
    expect(t.affectedSystems.length).toBeGreaterThan(0);
  });

  it('returns null for unknown archetype', () => {
    expect(conditionArchetypeTemplate('unknown')).toBeNull();
  });
});

describe('severityBands()', () => {
  it('exposes the canonical band list', () => {
    expect(severityBands()).toEqual(['low', 'medium', 'high', 'critical']);
  });
});
