/**
 * tests/domain/distribution.test.js — Distributional invariants.
 *
 * Tier 3.2 of the roadmap. Generation is stochastic; assertions about
 * single seeds (in causalChains.test.js) can catch obvious failures but
 * not silent drift. As the institutional catalog grows and per-tier
 * probabilities are tuned, what we really want to know is:
 *
 *   - "Are mage colleges still rare in villages?"
 *   - "Do coastal+port settlements still produce port institutions
 *     more often than inland ones?"
 *   - "Are towns still likely to have at least one enforcement
 *     institution?"
 *
 * Single-seed tests can't answer those. Sample size can.
 *
 * Performance budget: every test generates N settlements through the
 * full pipeline. We use N=40 here — enough for stable proportions on
 * "common" categories (95% CI roughly ±15%), small enough that the
 * suite still runs in seconds. Tests assert generous thresholds that
 * give wide margin against random variation; if any one fails it's a
 * real shift in distribution, not noise.
 *
 * Tests are deterministic per-run because each settlement uses a seed
 * derived from index. Re-running locally produces the same numbers.
 */

import { describe, it, expect } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { hasAnyTag, TAG_GROUPS } from '../../src/lib/entities.js';
import { deriveAllFactionProfiles } from '../../src/domain/factionProfile.js';

const SAMPLE_SIZE = 40;

function generateMany(config, { count = SAMPLE_SIZE, seedPrefix = 'dist' } = {}) {
  const results = [];
  for (let i = 0; i < count; i++) {
    const seed = `${seedPrefix}-${config.settType || 'any'}-${i}`;
    results.push(
      generateSettlementPipeline(config, null, { seed, customContent: {} })
    );
  }
  return results;
}

function proportionWith(settlements, predicate) {
  if (settlements.length === 0) return 0;
  const hits = settlements.filter(predicate).length;
  return hits / settlements.length;
}

function averageOf(settlements, getNumber) {
  if (settlements.length === 0) return 0;
  return settlements.reduce((s, x) => s + getNumber(x), 0) / settlements.length;
}

// ── Tier scaling ──────────────────────────────────────────────────────────
// Bigger settlements should have more institutions on average. This is
// the most basic distributional sanity check; if it fails, the engine's
// tier system itself has regressed.

describe('tier scaling — population grows with tier', () => {
  it('towns average more institutions than villages', () => {
    const villages = generateMany({ settType: 'village', culture: 'germanic' });
    const towns    = generateMany({ settType: 'town',    culture: 'germanic' });
    expect(averageOf(towns, s => s.institutions.length))
      .toBeGreaterThan(averageOf(villages, s => s.institutions.length));
  });

  it('cities average a higher population than towns', () => {
    // We deliberately don't assert `cities have more institutions than
    // towns` — the UPGRADE_CHAINS dedup pass in assembleInstitutions
    // collapses lesser → greater pairs (e.g. "Town watch" + "Professional
    // city watch" → just the greater), so cities legitimately carry a
    // tighter institution count even though they're structurally larger.
    // Population is the unambiguous tier-scaling signal.
    const towns  = generateMany({ settType: 'town',  culture: 'germanic' });
    const cities = generateMany({ settType: 'city',  culture: 'germanic' });
    expect(averageOf(cities, s => s.population))
      .toBeGreaterThan(averageOf(towns, s => s.population));
  });

  it('city institutions are not fewer than village institutions', () => {
    // Even with the dedup collapse, a city should still carry more
    // institutions than a village. This is the floor that breaks if
    // the tier system actively regresses.
    const villages = generateMany({ settType: 'village', culture: 'germanic' });
    const cities   = generateMany({ settType: 'city',    culture: 'germanic' });
    expect(averageOf(cities, s => s.institutions.length))
      .toBeGreaterThan(averageOf(villages, s => s.institutions.length));
  });
});

// ── Enforcement frequency ─────────────────────────────────────────────────
// Towns and cities should usually carry some form of enforcement
// (watch, garrison, militia, etc.). Villages may or may not. Thresholds
// are deliberately loose so the test is a drift detector, not a fixture.

describe('enforcement institution prevalence', () => {
  it('at least 70% of towns carry an enforcement institution', () => {
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    const p = proportionWith(towns, s =>
      s.institutions.some(i => hasAnyTag(i, TAG_GROUPS.ENFORCEMENT))
    );
    expect(p).toBeGreaterThanOrEqual(0.70);
  });

  it('at least 90% of cities carry an enforcement institution', () => {
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    const p = proportionWith(cities, s =>
      s.institutions.some(i => hasAnyTag(i, TAG_GROUPS.ENFORCEMENT))
    );
    expect(p).toBeGreaterThanOrEqual(0.90);
  });
});

// ── Trade-route gating ───────────────────────────────────────────────────
// Settlements with `tradeRouteAccess: 'none'` should rarely have
// institutions whose definition requires a trade route. This catches
// regressions in the gating logic inside assembleInstitutions.

describe('trade-route gating', () => {
  it('isolated settlements rarely have trade-route-required institutions', () => {
    const isolated = generateMany({
      settType: 'town', culture: 'germanic', tradeRouteAccess: 'none',
    });
    // The required-route institutions live in the catalog; we look for
    // institutions whose own `tradeRouteRequired` field is non-empty.
    const violations = isolated.filter(s =>
      s.institutions.some(i => Array.isArray(i.tradeRouteRequired)
        && i.tradeRouteRequired.length > 0
        && !i.tradeRouteRequired.includes('none')
        // Allow if the institution has a fallback terrainAccess that
        // matches the settlement's terrain — that's a valid bypass
        // path in the assembleInstitutions logic.
        && !(Array.isArray(i.terrainAccess) && i.terrainAccess.length > 0))
    );
    // Allow occasional bypass via the terrainAccess path; if more than
    // 10% violate, the gating logic has regressed.
    const p = violations.length / isolated.length;
    expect(p).toBeLessThanOrEqual(0.10);
  });
});

// ── Determinism guard ────────────────────────────────────────────────────
// Generation must be deterministic per seed. This catches regressions in
// PRNG forking or step ordering that would otherwise show up as flaky
// downstream tests.

describe('determinism', () => {
  it('the same seed + same config produce structurally identical settlements', () => {
    const a = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic' }, null,
      { seed: 'determinism-check', customContent: {} },
    );
    const b = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic' }, null,
      { seed: 'determinism-check', customContent: {} },
    );
    // Same name + same tier + same population + same institution names.
    expect(a.name).toBe(b.name);
    expect(a.tier).toBe(b.tier);
    expect(a.population).toBe(b.population);
    expect(a.institutions.map(i => i.name)).toEqual(b.institutions.map(i => i.name));
  });
});

// ── Trace presence guard ─────────────────────────────────────────────────
// Every settlement in the sample should carry traces. Catches regressions
// where the trace propagation in assembleSettlement breaks silently.

describe('trace propagation prevalence', () => {
  it('every generated settlement carries a non-empty simulationTrace', () => {
    const settlements = generateMany({ settType: 'town', culture: 'germanic' });
    const withTraces = settlements.filter(s =>
      Array.isArray(s.simulationTrace) && s.simulationTrace.length > 0
    );
    expect(withTraces.length).toBe(settlements.length);
  });
});

// ── Schema-stamp guard ───────────────────────────────────────────────────
// Every settlement must carry the canonical version stamps. Catches
// regressions in the normalize wiring at assembleSettlement.

describe('canonical version stamps', () => {
  it('every generated settlement carries schemaVersion / simulationVersion / generatorVersion', () => {
    const settlements = generateMany({ settType: 'village', culture: 'germanic' });
    for (const s of settlements) {
      expect(s.schemaVersion).toBeGreaterThan(0);
      expect(s.simulationVersion).toBeGreaterThan(0);
      expect(typeof s.generatorVersion).toBe('string');
      expect(s.id).toMatch(/^s_[0-9a-f]+$/);
    }
  });
});

// ── Faction prevalence (Tier 4.1) ────────────────────────────────────────
// Towns and cities should reliably carry multi-faction power structures.
// Faction archetype distribution should reflect the institution mix.

describe('faction prevalence and archetype coverage', () => {
  it('every town carries at least one faction', () => {
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    const withFactions = towns.filter(s => {
      const ps = s.powerStructure || s.power || {};
      return Array.isArray(ps.factions) && ps.factions.length > 0;
    });
    expect(withFactions.length).toBe(towns.length);
  });

  it('at least 80% of cities carry multiple factions', () => {
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    const multi = cities.filter(s => {
      const ps = s.powerStructure || s.power || {};
      return Array.isArray(ps.factions) && ps.factions.length >= 2;
    });
    expect(multi.length / cities.length).toBeGreaterThanOrEqual(0.80);
  });

  it('every faction across the sample resolves to a known archetype', () => {
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    const archetypes = new Set();
    for (const s of towns) {
      for (const p of deriveAllFactionProfiles(s)) {
        archetypes.add(p.archetype);
      }
    }
    // The sample should cover at least three distinct archetypes
    // across 40 towns — if it doesn't, archetype detection has narrowed
    // suspiciously.
    expect(archetypes.size).toBeGreaterThanOrEqual(3);
    // Every archetype must be from the canonical set.
    const canonical = new Set([
      'government', 'military', 'religious', 'merchant',
      'craft', 'criminal', 'arcane', 'occupation', 'other',
    ]);
    for (const a of archetypes) {
      expect(canonical.has(a), `unknown archetype: ${a}`).toBe(true);
    }
  });

  it('government or merchant archetype appears in at least 90% of towns', () => {
    // Every town has SOME form of formal authority, but the classifier
    // sometimes correctly routes "Merchant Guild Council" / "Guild
    // Authority" to the merchant archetype rather than government —
    // both are legitimate governance forms. So the union of the two
    // is the real "has formal authority" prevalence.
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    const withFormal = towns.filter(s => {
      const profiles = deriveAllFactionProfiles(s);
      return profiles.some(p => p.archetype === 'government' || p.archetype === 'merchant');
    });
    expect(withFormal.length / towns.length).toBeGreaterThanOrEqual(0.90);
  });
});
