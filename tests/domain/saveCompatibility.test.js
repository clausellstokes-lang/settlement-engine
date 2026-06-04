/**
 * tests/domain/saveCompatibility.test.js — Save shape backward compatibility.
 *
 * Tier 3.4 of the roadmap. Users will save settlements before the engine
 * stabilizes. Every future change to the canonical schema is a potential
 * "your old saves don't load anymore" bug.
 *
 * Strategy: freeze representative fixtures from each schema version we
 * have ever shipped, and assert that `normalizeSettlement` loads them
 * into the current canonical shape without crashing or losing data.
 *
 * As new schema versions ship, add a frozen fixture from that version
 * to FIXTURES below. The test then proves the migration path works
 * across the full version history.
 *
 * NOTE: fixtures live in this file (not separate JSON) because they're
 * deliberately minimal — just enough fields to exercise the migration
 * surface, not full real settlements. A separate fixture museum would
 * be more realistic but also rot faster.
 */

import { describe, it, expect } from 'vitest';
import { normalizeSettlement } from '../../src/domain/normalizeSettlement.js';
import { SCHEMA_VERSION } from '../../src/domain/settlement.schema.js';

// ── Fixture catalog ────────────────────────────────────────────────────────
// Each entry represents a settlement as it would have been written to
// localStorage / Supabase at the time of that schemaVersion. The
// `label` is human-readable; `description` documents what era of the
// codebase this shape came from.

const FIXTURES = [
  {
    label: 'pre-schema (before migration 009)',
    description: 'Saves written before any version stamps existed. No id, no schemaVersion, no canonical containers. The most aggressive migration test.',
    raw: {
      name: 'Old Town',
      tier: 'town',
      population: 1200,
      _seed: 'pre-schema-seed-001',
      institutions: [{ name: 'Town Watch', tags: ['security'] }],
      stress: 'plague',
      config: { settType: 'town', culture: 'germanic', terrain: 'plains' },
      // No simulationTrace, no activeConditions, no aiOverlays.
      // No id. No schemaVersion. No userCanon.
    },
  },
  {
    label: 'pre-schema with legacy stress alias forms',
    description: 'Different builds of the codebase used different field names for the same concept. Make sure each alias resolves.',
    raw: {
      name: 'Stresses Town',
      tier: 'village',
      _seed: 'alias-test-001',
      stresses: ['plague', 'cut_route'], // alias 1
    },
  },
  {
    label: 'pre-schema with stressTypes alias',
    description: 'Yet another legacy alias for the same field.',
    raw: {
      name: 'StressTypes Town',
      tier: 'village',
      _seed: 'alias-test-002',
      stressTypes: ['drought'], // alias 2
    },
  },
  {
    label: 'partially-canonical (post-Phase-6, pre-Tier-2)',
    description: 'Saves written after the canonical adapter shipped but before the trace layer. Carries version stamps + id, no traces.',
    raw: {
      name: 'Half Town',
      tier: 'town',
      population: 1100,
      _seed: 'partial-canon-seed-001',
      id: 's_existing12345',
      schemaVersion: 1,
      simulationVersion: 1,
      generatorVersion: '0.9.0',
      institutions: [{ name: 'Marketplace' }],
      activeConditions: [],
      aiOverlays: [],
      userCanon: {},
      simulationTrace: [],
      stressors: [],
    },
  },
  {
    label: 'fully-canonical (current shape)',
    description: 'Saves written today. The adapter should be a near-identity pass.',
    raw: {
      name: 'Modern Town',
      tier: 'town',
      population: 1100,
      _seed: 'modern-seed-001',
      id: 's_modern12345',
      schemaVersion: 1,
      simulationVersion: 1,
      generatorVersion: '0.9.0',
      institutions: [{ name: 'Town Watch', tags: ['security'] }],
      activeConditions: [{ id: 'condition.plague', severity: 0.5, status: 'easing', affectedSystems: [] }],
      aiOverlays: [],
      userCanon: { pinnedNpcs: ['npc.captain_rusk'] },
      simulationTrace: [{ targetType: 'institution', targetId: 'institution.town_watch', step: 'assembleInstitutions', result: 'selected', causes: [], downstreamEffects: [], ts: 1 }],
      stressors: ['plague'],
    },
  },
];

// ── Generic migration assertions (apply to every fixture) ─────────────────

describe('every fixture loads into the current canonical shape', () => {
  for (const fixture of FIXTURES) {
    describe(fixture.label, () => {
      it('normalizes without crashing', () => {
        expect(() => normalizeSettlement(fixture.raw)).not.toThrow();
      });

      it('preserves the original name + tier + population', () => {
        const out = normalizeSettlement(fixture.raw);
        if (fixture.raw.name) expect(out.name).toBe(fixture.raw.name);
        if (fixture.raw.tier) expect(out.tier).toBe(fixture.raw.tier);
        if (fixture.raw.population !== undefined) expect(out.population).toBe(fixture.raw.population);
      });

      it('preserves the original _seed if present', () => {
        if (fixture.raw._seed === undefined) return;
        const out = normalizeSettlement(fixture.raw);
        expect(out._seed).toBe(fixture.raw._seed);
      });

      it('emits a current schemaVersion', () => {
        const out = normalizeSettlement(fixture.raw);
        expect(out.schemaVersion).toBe(SCHEMA_VERSION);
      });

      it('emits a stable id', () => {
        const out = normalizeSettlement(fixture.raw);
        // Either an already-set id is preserved as-is (any 's_*' shape),
        // or normalize mints a fresh hex id from the seed.
        expect(out.id).toMatch(/^s_/);
        expect(out.id.length).toBeGreaterThan(2);
      });

      it('defaults canonical containers if absent', () => {
        const out = normalizeSettlement(fixture.raw);
        expect(Array.isArray(out.activeConditions)).toBe(true);
        expect(Array.isArray(out.simulationTrace)).toBe(true);
        expect(Array.isArray(out.aiOverlays)).toBe(true);
        expect(typeof out.userCanon).toBe('object');
      });

      it('round-trips idempotently — normalize(normalize(x)) === normalize(x)', () => {
        const once  = normalizeSettlement(fixture.raw);
        const twice = normalizeSettlement(once);
        expect(twice).toEqual(once);
      });

      it('does not mutate the input fixture', () => {
        const before = JSON.stringify(fixture.raw);
        normalizeSettlement(fixture.raw);
        expect(JSON.stringify(fixture.raw)).toBe(before);
      });
    });
  }
});

// ── Field-specific migration assertions ───────────────────────────────────

describe('stress / stresses / stressTypes all resolve to canonical stressors', () => {
  it('legacy `stress` (string) resolves', () => {
    const out = normalizeSettlement(FIXTURES[0].raw);
    expect(out.stressors).toBe('plague');
  });

  it('legacy `stresses` (array) resolves', () => {
    const out = normalizeSettlement(FIXTURES[1].raw);
    expect(out.stressors).toEqual(['plague', 'cut_route']);
  });

  it('legacy `stressTypes` (array) resolves', () => {
    const out = normalizeSettlement(FIXTURES[2].raw);
    expect(out.stressors).toEqual(['drought']);
  });

  it('canonical `stressors` passes through', () => {
    const out = normalizeSettlement(FIXTURES[4].raw);
    expect(out.stressors).toEqual(['plague']);
  });
});

describe('pre-Tier-2 saves get the trace container populated to []', () => {
  it('pre-schema fixtures have simulationTrace defaulted to []', () => {
    const out = normalizeSettlement(FIXTURES[0].raw);
    expect(out.simulationTrace).toEqual([]);
  });

  it('saves that already have traces preserve them', () => {
    const out = normalizeSettlement(FIXTURES[4].raw);
    expect(out.simulationTrace.length).toBe(1);
    expect(out.simulationTrace[0].targetId).toBe('institution.town_watch');
  });
});

describe('userCanon survives migration', () => {
  it('canonical fixtures preserve pinned NPCs', () => {
    const out = normalizeSettlement(FIXTURES[4].raw);
    expect(out.userCanon.pinnedNpcs).toEqual(['npc.captain_rusk']);
  });

  it('pre-schema fixtures get a fresh empty userCanon', () => {
    const out = normalizeSettlement(FIXTURES[0].raw);
    expect(out.userCanon).toEqual({});
  });
});

describe('id stability across reloads', () => {
  it('the same legacy save (with same _seed) loads to the same id every time', () => {
    const a = normalizeSettlement(FIXTURES[0].raw);
    const b = normalizeSettlement(FIXTURES[0].raw);
    expect(a.id).toBe(b.id);
  });

  it('a save that already has an id keeps it', () => {
    const out = normalizeSettlement(FIXTURES[3].raw);
    expect(out.id).toBe('s_existing12345');
  });
});
