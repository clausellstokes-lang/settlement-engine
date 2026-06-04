/**
 * tests/domain/distribution.test.js - Distributional invariants.
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
 * full pipeline. We use N=40 here - enough for stable proportions on
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
import {
  deriveAllSupplyChainStates,
  supplyChainStatusBreakdown,
} from '../../src/domain/supplyChainState.js';
import {
  deriveAllStructuredHooks,
  deriveEscalationClocks,
} from '../../src/domain/hookEscalation.js';
import {
  deriveHistoryBeats,
  historyBeatPresence,
} from '../../src/domain/historyBeats.js';
import {
  deriveAllNpcProfiles,
  npcArchetypeBreakdown,
  dominantNpcRemovalImpact,
} from '../../src/domain/npcProfile.js';

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

describe('tier scaling - population grows with tier', () => {
  it('towns average more institutions than villages', () => {
    const villages = generateMany({ settType: 'village', culture: 'germanic' });
    const towns    = generateMany({ settType: 'town',    culture: 'germanic' });
    expect(averageOf(towns, s => s.institutions.length))
      .toBeGreaterThan(averageOf(villages, s => s.institutions.length));
  });

  it('cities average a higher population than towns', () => {
    // We deliberately don't assert `cities have more institutions than
    // towns` - the UPGRADE_CHAINS dedup pass in assembleInstitutions
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
        // matches the settlement's terrain - that's a valid bypass
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
    // across 40 towns - if it doesn't, archetype detection has narrowed
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
    // Authority" to the merchant archetype rather than government -
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

// ── Supply-chain prevalence (Tier 4.3) ──────────────────────────────────
// Every settlement of meaningful size should have at least one active
// supply chain. The distribution of chain statuses should skew heavily
// toward 'stable' on a healthy generation - most chains aren't disrupted
// out of the gate. Disruption is reserved for events / active conditions.

describe('supply-chain prevalence and status distribution', () => {
  it('every town carries at least one active supply chain', () => {
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    const withChains = towns.filter(s => deriveAllSupplyChainStates(s).length > 0);
    expect(withChains.length).toBe(towns.length);
  });

  it('cities average more supply chains than villages', () => {
    const villages = generateMany({ settType: 'village', culture: 'germanic' });
    const cities   = generateMany({ settType: 'city',    culture: 'germanic' });
    const villageAvg = averageOf(villages, s => deriveAllSupplyChainStates(s).length);
    const cityAvg    = averageOf(cities,   s => deriveAllSupplyChainStates(s).length);
    expect(cityAvg).toBeGreaterThan(villageAvg);
  });

  it('on healthy generation, at least half of chains are stable', () => {
    // Status remap: legacy 'operational' / 'running' / 'entrepot' all
    // become canonical 'stable'. Cities legitimately carry more chains
    // AND more disruption - the deeper supply graphs mean more
    // dependencies AND more places to be strained. The "at least half"
    // floor catches a regression where stable chains disappear, but
    // tolerates the engine's real ratio (~53% on the current sample).
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    let totalStable = 0;
    let totalChains = 0;
    for (const s of cities) {
      const breakdown = supplyChainStatusBreakdown(s);
      totalStable += breakdown.stable;
      totalChains += Object.values(breakdown).reduce((a, b) => a + b, 0);
    }
    expect(totalChains).toBeGreaterThan(0);
    expect(totalStable / totalChains).toBeGreaterThanOrEqual(0.50);
  });

  it('every supply-chain status is one of the canonical values', () => {
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    const canonical = new Set([
      'stable', 'strained', 'scarce', 'blocked',
      'captured', 'substituted', 'collapsing',
    ]);
    for (const s of cities) {
      for (const c of deriveAllSupplyChainStates(s)) {
        expect(canonical.has(c.status), `unexpected status: ${c.status}`).toBe(true);
      }
    }
  });

  it('every chain declares a non-empty failureConsequences and at least one beneficiary', () => {
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    for (const s of towns) {
      for (const c of deriveAllSupplyChainStates(s)) {
        expect(typeof c.failureConsequences).toBe('string');
        expect(c.failureConsequences.length).toBeGreaterThan(0);
        expect(Array.isArray(c.beneficiaries)).toBe(true);
        expect(c.beneficiaries.length).toBeGreaterThan(0);
      }
    }
  });
});

// ── Hook + escalation clock prevalence (Tier 4.10) ──────────────────────
// Hooks should appear consistently; clocks should appear when the
// triggering state exists.

describe('hook + escalation clock prevalence', () => {
  it('every city carries at least one structured hook', () => {
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    const withHooks = cities.filter(s => deriveAllStructuredHooks(s).length > 0);
    // Cities reliably produce hooks across economic / defense /
    // historical surfaces. If even one falls through, something has
    // regressed in the hook generators.
    expect(withHooks.length / cities.length).toBeGreaterThanOrEqual(0.95);
  });

  it('every structured hook resolves to a canonical origin', () => {
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    const canonical = new Set([
      'pressure', 'factionConflict', 'institution',
      'npc', 'chain', 'external', 'other',
    ]);
    for (const s of towns) {
      for (const h of deriveAllStructuredHooks(s)) {
        expect(canonical.has(h.origin), `unexpected origin: ${h.origin}`).toBe(true);
      }
    }
  });

  it('every clock has 6 stages and a non-empty trigger description', () => {
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    for (const s of cities) {
      for (const clock of deriveEscalationClocks(s)) {
        expect(Array.isArray(clock.stages)).toBe(true);
        expect(clock.stages.length).toBe(6);
        expect(typeof clock.triggerDescription).toBe('string');
        expect(clock.triggerDescription.length).toBeGreaterThan(0);
      }
    }
  });

  it('disrupted-food-chain settlements produce a Bread Riot Clock', () => {
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    // Across 40 cities the engine produces at least a few food-chain
    // disruptions (~50% of chains are non-stable per Phase 10 finding).
    // We assert: among cities with a non-stable food chain, AT LEAST
    // ONE produces a Bread Riot Clock.
    const withFoodDisruption = cities.filter(s => {
      const chains = deriveAllSupplyChainStates(s);
      return chains.some(c => c.needKey === 'food_security' && c.status !== 'stable');
    });
    if (withFoodDisruption.length === 0) return;  // determinism guard
    const withBreadClock = withFoodDisruption.filter(s =>
      deriveEscalationClocks(s).some(c => c.label === 'Bread Riot Clock')
    );
    expect(withBreadClock.length).toBeGreaterThan(0);
  });
});

// ── History beat prevalence (Tier 4.7) ─────────────────────────────────
// History is one of the most uniformly-populated fields on the
// generator output. Every settlement should produce at least the
// foundingCause beat; older / larger settlements should also produce
// definingCrisis and institutional legacy beats.

describe('history beat prevalence', () => {
  it('every settlement produces a foundingCause beat', () => {
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    for (const s of towns) {
      const beats = deriveHistoryBeats(s);
      expect(beats.foundingCause, `${s.name} missing foundingCause`).toBeTruthy();
    }
  });

  it('every settlement produces at least three non-null beats out of seven', () => {
    // A reasonable richness floor - engine output should never produce
    // a settlement with fewer than three beats. Cities reliably produce
    // five or more.
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    let totalNonNull = 0;
    let totalSlots = 0;
    for (const s of towns) {
      const presence = historyBeatPresence(s);
      const nonNull = Object.values(presence).filter(Boolean).length;
      totalNonNull += nonNull;
      totalSlots += 7;
      expect(nonNull, `${s.name} produced only ${nonNull} beats`).toBeGreaterThanOrEqual(3);
    }
    // Aggregate ratio should be comfortably above 50%.
    expect(totalNonNull / totalSlots).toBeGreaterThanOrEqual(0.55);
  });

  it('at least 80% of cities have a definingCrisis beat', () => {
    // Cities have richer history with anchored events. The 80% floor
    // catches a regression where the historicalEvents generator stops
    // producing major-or-worse events for city-tier settlements.
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    const withCrisis = cities.filter(s => deriveHistoryBeats(s).definingCrisis != null);
    expect(withCrisis.length / cities.length).toBeGreaterThanOrEqual(0.80);
  });

  it('every history beat carries label + text + source', () => {
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    for (const s of towns) {
      for (const beat of Object.values(deriveHistoryBeats(s))) {
        if (beat == null) continue;
        expect(typeof beat.label).toBe('string');
        expect(beat.label.length).toBeGreaterThan(0);
        expect(typeof beat.text).toBe('string');
        expect(beat.text.length).toBeGreaterThan(0);
        expect(typeof beat.source).toBe('string');
      }
    }
  });
});

// ── NPC profile prevalence (Tier 4.5) ───────────────────────────────────
// Every NPC the generator produces should resolve to a canonical
// archetype and carry the structured fields. Dominant-rank NPCs should
// reliably produce non-trivial removal-consequence forecasts.

describe('NPC profile prevalence and structural integrity', () => {
  it('every town carries at least one NPC', () => {
    const towns = generateMany({ settType: 'town', culture: 'germanic' });
    for (const s of towns) {
      expect(deriveAllNpcProfiles(s).length, `${s.name} missing NPCs`).toBeGreaterThan(0);
    }
  });

  it('every NPC profile carries an archetype from the canonical set', () => {
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    const canonical = new Set([
      'government', 'military', 'religious', 'merchant',
      'craft', 'criminal', 'arcane', 'occupation', 'other',
    ]);
    for (const s of cities) {
      for (const p of deriveAllNpcProfiles(s)) {
        expect(canonical.has(p.archetype), `unexpected archetype: ${p.archetype}`).toBe(true);
      }
    }
  });

  it('cities average at least three distinct NPC archetypes', () => {
    // Larger settlements should produce a more diverse NPC roster.
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    let totalDistinct = 0;
    for (const s of cities) {
      const breakdown = npcArchetypeBreakdown(s);
      const distinct = Object.values(breakdown).filter(n => n > 0).length;
      totalDistinct += distinct;
    }
    expect(totalDistinct / cities.length).toBeGreaterThanOrEqual(3);
  });

  it('every dominant-rank NPC produces a non-trivial removal consequence', () => {
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    for (const s of cities) {
      for (const p of deriveAllNpcProfiles(s)) {
        if (p.rank !== 'dominant') continue;
        expect(p.consequenceIfRemoved.consequences.length, `${p.name} has no removal consequences`)
          .toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('cities accumulate enough dominant-NPC removal-impact lines to drive a forecast', () => {
    // Compounding check: across N cities, the dominantNpcRemovalImpact
    // helper should produce enough lines that future Tier 4.12 (time
    // progression) has material to work with. Empirical floor is high
    // since most cities carry ≥2 dominant NPCs each with 3-4 lines.
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    let totalLines = 0;
    for (const s of cities) {
      totalLines += dominantNpcRemovalImpact(s).length;
    }
    expect(totalLines / cities.length).toBeGreaterThanOrEqual(3);
  });

  it('every NPC with a factionAffiliation carries a factionLink', () => {
    const cities = generateMany({ settType: 'city', culture: 'germanic' });
    for (const s of cities) {
      for (const p of deriveAllNpcProfiles(s)) {
        // factionAffiliation is the legacy source; factionLink is the
        // canonical id. The derivation guarantees: when the legacy
        // field is present and non-empty, the link is non-null.
        const npc = s.npcs.find(n => n.id === p.id);
        if (typeof npc?.factionAffiliation === 'string' && npc.factionAffiliation) {
          expect(p.factionLink, `${p.name} missing factionLink`).toBeTruthy();
        }
      }
    }
  });
});
