/**
 * tests/domain/aiOverlayVerifier.test.js — Tier 6.4 comprehensive suite.
 *
 * Verifies that verifyAiOverlay(original, refined) catches every
 * documented violation class. Each test constructs a minimal pair of
 * settlement objects, applies a single mutation that mirrors a real
 * AI failure mode, and asserts the right violation surfaces.
 */

import { describe, it, expect } from 'vitest';
import {
  verifyAiOverlay,
  summarizeViolations,
  filterViolations,
  VIOLATION_KINDS,
} from '../../src/domain/aiOverlayVerifier.js';

// ── Base fixture ─────────────────────────────────────────────────────────
//
// A small but plausible settlement we can mutate per test. Real
// fixtures from src/data/ would be more realistic but couple the
// tests to engine layout; this hand-rolled shape is enough.

function baseFixture() {
  return {
    id: 'sett.test',
    name: 'Stonebridge',
    tier: 'town',
    population: 1800,
    _seed: 'fixed-seed',
    schemaVersion: 7,
    simulationVersion: 19,
    institutions: [
      { id: 'inst.market',   name: 'Stonebridge Market',   category: 'Economy', source: 'generated', locked: true },
      { id: 'inst.guard',    name: 'Town Guard',           category: 'Defense', source: 'generated' },
      { id: 'inst.cathedral', name: 'St. Aldwin\'s',        category: 'Religious', source: 'user', _authored: true },
    ],
    powerStructure: {
      factions: [
        { id: 'fac.silver',  name: 'Silver Chain Guild',   power: 'high', isGoverning: true,  source: 'generated' },
        { id: 'fac.river',   name: 'River Boatmen',        power: 'medium', isGoverning: false, source: 'generated' },
      ],
      conflicts: [
        { factions: ['Silver Chain Guild', 'River Boatmen'], issue: 'Toll dispute', stakes: 'control of the river crossing' },
      ],
    },
    npcs: [
      { id: 'npc.aldis',    name: 'Aldis Vale',  role: 'Guildmaster', source: 'generated' },
      { id: 'npc.morrow',   name: 'Captain Morrow', role: 'Guard Captain', source: 'generated', locked: true },
    ],
    history: {
      historicalCharacter: 'Resilient',
      founding: { reason: 'River ford toll station', initialChallenge: 'flooding', overcoming: 'built stone bridge', foundedBy: 'House Vale' },
      historicalEvents: [
        { name: 'The Flood Year', severity: 'major', summary: 'River broke its banks', yearsAgo: 80 },
      ],
      currentTensions: [
        { type: 'economic', description: 'Toll dispute is straining trade', severity: 'moderate' },
      ],
    },
    arrivalScene: 'A stone bridge across the river greets you.',
    pressureSentence: 'The Silver Chain Guild is squeezing the boatmen with new tolls.',
  };
}

function clone(o) { return JSON.parse(JSON.stringify(o)); }

// ─────────────────────────────────────────────────────────────────────
// Envelope shape + null safety
// ─────────────────────────────────────────────────────────────────────

describe('verifyAiOverlay() — envelope shape', () => {
  it('returns the canonical { ok, violations, summary } structure', () => {
    const result = verifyAiOverlay(baseFixture(), clone(baseFixture()));
    expect(result).toHaveProperty('ok');
    expect(result).toHaveProperty('violations');
    expect(result).toHaveProperty('summary');
    expect(Array.isArray(result.violations)).toBe(true);
  });

  it('summary has counts for every documented violation class', () => {
    const result = verifyAiOverlay(baseFixture(), clone(baseFixture()));
    expect(result.summary).toHaveProperty('invented');
    expect(result.summary).toHaveProperty('removed');
    expect(result.summary).toHaveProperty('renamed');
    expect(result.summary).toHaveProperty('contradicted');
    expect(result.summary).toHaveProperty('canonChanged');
    expect(result.summary).toHaveProperty('historyDropped');
  });

  it('identical settlement produces ok=true + empty violations', () => {
    const result = verifyAiOverlay(baseFixture(), clone(baseFixture()));
    expect(result.ok).toBe(true);
    expect(result.violations).toEqual([]);
  });

  it('null original returns ok=true (neutral pass-through)', () => {
    expect(verifyAiOverlay(null, baseFixture()).ok).toBe(true);
  });

  it('null refined returns ok=true (neutral pass-through)', () => {
    expect(verifyAiOverlay(baseFixture(), null).ok).toBe(true);
  });

  it('both null returns ok=true', () => {
    expect(verifyAiOverlay(null, null).ok).toBe(true);
  });

  it('primitive input is tolerated and produces a neutral report', () => {
    expect(verifyAiOverlay('not a settlement', baseFixture()).ok).toBe(true);
    expect(verifyAiOverlay(baseFixture(), 42).ok).toBe(true);
  });

  it('VIOLATION_KINDS exports the documented vocabulary', () => {
    expect(VIOLATION_KINDS).toContain('invented_entity');
    expect(VIOLATION_KINDS).toContain('removed_entity');
    expect(VIOLATION_KINDS).toContain('renamed_entity');
    expect(VIOLATION_KINDS).toContain('changed_fact');
    expect(VIOLATION_KINDS).toContain('changed_canon');
    expect(VIOLATION_KINDS).toContain('removed_history_beat');
  });

  it('VIOLATION_KINDS is frozen', () => {
    expect(() => { VIOLATION_KINDS.push('rogue'); }).toThrow();
  });
});

// ─────────────────────────────────────────────────────────────────────
// Root-level fact changes
// ─────────────────────────────────────────────────────────────────────

describe('verifyAiOverlay() — root-level fact changes', () => {
  it('flags a renamed settlement', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.name = 'Stonebridge-on-the-River';
    const result = verifyAiOverlay(original, refined);
    expect(result.ok).toBe(false);
    expect(result.violations.some(v => v.kind === 'changed_fact' && v.field === 'name')).toBe(true);
  });

  it('flags a tier change', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.tier = 'city';
    const result = verifyAiOverlay(original, refined);
    expect(result.ok).toBe(false);
    expect(result.violations.some(v => v.kind === 'changed_fact' && v.field === 'tier')).toBe(true);
  });

  it('flags a population change', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.population = 2400;
    const result = verifyAiOverlay(original, refined);
    expect(result.ok).toBe(false);
    const v = result.violations.find(x => x.field === 'population');
    expect(v).toBeDefined();
    expect(v.before).toBe(1800);
    expect(v.after).toBe(2400);
  });

  it('flags _seed drift (engine determinism violation)', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined._seed = 'different';
    const result = verifyAiOverlay(original, refined);
    expect(result.violations.some(v => v.field === '_seed')).toBe(true);
  });

  it('flags schemaVersion drift', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.schemaVersion = 8;
    const result = verifyAiOverlay(original, refined);
    expect(result.violations.some(v => v.field === 'schemaVersion')).toBe(true);
  });

  it('flags simulationVersion drift', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.simulationVersion = 20;
    const result = verifyAiOverlay(original, refined);
    expect(result.violations.some(v => v.field === 'simulationVersion')).toBe(true);
  });

  it('does NOT flag fields the AI is allowed to refine (arrivalScene, pressureSentence)', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.arrivalScene = 'A polished refinement of the original.';
    refined.pressureSentence = 'Polished refinement of the pressure.';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.contradicted).toBe(0);
  });

  it('handles undefined → undefined as no change', () => {
    const original = { id: 'a', name: 'A' };
    const refined = { id: 'a', name: 'A' };
    expect(verifyAiOverlay(original, refined).ok).toBe(true);
  });

  it('detects null → value as a change', () => {
    const original = { id: 'a', name: 'A', population: null };
    const refined = { id: 'a', name: 'A', population: 100 };
    const result = verifyAiOverlay(original, refined);
    expect(result.violations.some(v => v.field === 'population')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Entity invention / removal / rename
// ─────────────────────────────────────────────────────────────────────

describe('verifyAiOverlay() — invented entities', () => {
  it('flags an invented faction', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.powerStructure.factions.push({ id: 'fac.invented', name: 'Phantom Cabal', power: 'low', source: 'ai_overlay' });
    const result = verifyAiOverlay(original, refined);
    expect(result.ok).toBe(false);
    expect(result.summary.invented).toBe(1);
    const v = result.violations.find(x => x.kind === 'invented_entity');
    expect(v.field).toBe('powerStructure.factions');
    expect(v.label).toBe('Phantom Cabal');
  });

  it('flags an invented NPC', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs.push({ id: 'npc.invented', name: 'Lord Smithwick', role: 'Mysterious Stranger' });
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.invented).toBe(1);
    expect(result.violations[0].label).toBe('Lord Smithwick');
  });

  it('flags an invented institution', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.institutions.push({ id: 'inst.invented', name: 'Hidden Temple', category: 'Religious' });
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.invented).toBe(1);
  });

  it('flags multiple inventions in one pass', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs.push({ id: 'npc.a', name: 'New NPC A', role: 'Stranger' });
    refined.npcs.push({ id: 'npc.b', name: 'New NPC B', role: 'Wanderer' });
    refined.institutions.push({ id: 'inst.new', name: 'New Inn', category: 'Hospitality' });
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.invented).toBe(3);
  });

  it('flags inventions in supplyChains and activeConditions too', () => {
    const original = baseFixture();
    original.supplyChains = [{ id: 'sc.iron', resource: 'iron' }];
    original.activeConditions = [{ id: 'cond.plague', archetype: 'plague' }];
    const refined = clone(original);
    refined.supplyChains.push({ id: 'sc.gold', resource: 'gold' });
    refined.activeConditions.push({ id: 'cond.famine', archetype: 'famine' });
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.invented).toBe(2);
  });
});

describe('verifyAiOverlay() — removed entities', () => {
  it('flags a removed NPC', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs = refined.npcs.filter(n => n.id !== 'npc.aldis');
    const result = verifyAiOverlay(original, refined);
    expect(result.ok).toBe(false);
    expect(result.summary.removed).toBe(1);
    const v = result.violations.find(x => x.kind === 'removed_entity');
    expect(v.label).toBe('Aldis Vale');
  });

  it('flags a removed faction', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.powerStructure.factions = refined.powerStructure.factions.filter(f => f.id !== 'fac.river');
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.removed).toBe(1);
  });

  it('flags a removed institution', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.institutions = refined.institutions.filter(i => i.id !== 'inst.guard');
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.removed).toBe(1);
  });

  it('removing a user-authored institution flags BOTH removed_entity AND triggers downstream concern', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.institutions = refined.institutions.filter(i => i.id !== 'inst.cathedral');
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.removed).toBeGreaterThanOrEqual(1);
    const removed = result.violations.find(v => v.kind === 'removed_entity' && v.label === 'St. Aldwin\'s');
    expect(removed).toBeDefined();
  });
});

describe('verifyAiOverlay() — renamed entities', () => {
  it('flags a renamed NPC (same id, different name)', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs[0].name = 'Aldis Vale the Elder';
    const result = verifyAiOverlay(original, refined);
    expect(result.ok).toBe(false);
    expect(result.summary.renamed).toBe(1);
    const v = result.violations.find(x => x.kind === 'renamed_entity');
    expect(v.label).toBe('Aldis Vale');
    expect(v.newLabel).toBe('Aldis Vale the Elder');
  });

  it('flags a renamed faction (same id, different name)', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.powerStructure.factions[0].name = 'Silver Chain Cartel';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.renamed).toBe(1);
  });

  it('flags a renamed institution', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.institutions[0].name = 'Greater Stonebridge Market';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.renamed).toBe(1);
  });

  it('multiple renames surface independently', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs[0].name = 'Aldis Vale Senior';
    refined.npcs[1].name = 'Captain Marlowe';
    refined.powerStructure.factions[1].name = 'Boatmens Guild';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.renamed).toBe(3);
  });

  it('does NOT flag identical names (no-op refinement is fine)', () => {
    const original = baseFixture();
    const refined = clone(original);
    // Don't change names — only descriptions.
    refined.npcs[0].role = 'Senior Guildmaster';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.renamed).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Canon-tag drift
// ─────────────────────────────────────────────────────────────────────

describe('verifyAiOverlay() — canon-tag drift', () => {
  it('flags unlocking a locked institution', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.institutions[0].locked = false;
    const result = verifyAiOverlay(original, refined);
    expect(result.ok).toBe(false);
    expect(result.summary.canonChanged).toBe(1);
    const v = result.violations.find(x => x.kind === 'changed_canon');
    expect(v.label).toBe('Stonebridge Market');
  });

  it('flags unlocking a locked NPC', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs[1].locked = false;
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.canonChanged).toBeGreaterThanOrEqual(1);
  });

  it('flags changing a user-authored entity\'s source', () => {
    const original = baseFixture();
    const refined = clone(original);
    // The user-authored cathedral becomes "generated" — that's a downgrade.
    refined.institutions[2].source = 'generated';
    delete refined.institutions[2]._authored;
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.canonChanged).toBeGreaterThanOrEqual(1);
  });

  it('does NOT flag a draft → canon promotion (allowed direction)', () => {
    const original = baseFixture();
    const refined = clone(original);
    // Guard wasn't locked; refining its description shouldn't promote canon status.
    // (And even if it became canon via promotion, that's an allowed direction.)
    refined.institutions[1].locked = true;
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.canonChanged).toBe(0);
  });

  it('flags locked-entity downgrade only (not upgrade)', () => {
    const original = baseFixture();
    const refined = clone(original);
    // Make the unlocked guard locked — allowed.
    refined.institutions[1].locked = true;
    expect(verifyAiOverlay(original, refined).summary.canonChanged).toBe(0);

    // Now mutate so the locked market becomes unlocked — forbidden.
    refined.institutions[0].locked = false;
    expect(verifyAiOverlay(original, refined).summary.canonChanged).toBeGreaterThanOrEqual(1);
  });
});

// ─────────────────────────────────────────────────────────────────────
// History beat preservation
// ─────────────────────────────────────────────────────────────────────

describe('verifyAiOverlay() — history beat preservation', () => {
  it('flags removed founding (history beat dropped)', () => {
    const original = baseFixture();
    const refined = clone(original);
    delete refined.history.founding;
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.historyDropped).toBeGreaterThan(0);
  });

  it('flags removed historical events (history beats dropped)', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.history.historicalEvents = [];
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.historyDropped).toBeGreaterThan(0);
  });

  it('does NOT flag refined-but-present history beats', () => {
    const original = baseFixture();
    const refined = clone(original);
    // Same beats present — just with polished prose.
    refined.history.founding.reason = 'A refined retelling of the river ford toll.';
    refined.history.historicalEvents[0].summary = 'Polished prose about the flood.';
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.historyDropped).toBe(0);
  });

  it('flags every dropped beat independently', () => {
    const original = baseFixture();
    // Add more events so we have a richer beat set.
    original.history.historicalEvents.push({ name: 'The Great Frost', severity: 'major', summary: 'Crops failed', yearsAgo: 30 });
    original.history.historicalEvents.push({ name: 'The Bridge Fire', severity: 'moderate', summary: 'Old bridge burned', yearsAgo: 15 });
    const refined = clone(original);
    refined.history.historicalEvents = [];
    delete refined.history.founding;
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.historyDropped).toBeGreaterThanOrEqual(2);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Mixed-violation scenarios
// ─────────────────────────────────────────────────────────────────────

describe('verifyAiOverlay() — mixed scenarios', () => {
  it('reports multiple violation classes in one run', () => {
    const original = baseFixture();
    const refined = clone(original);
    // Invent
    refined.npcs.push({ id: 'npc.new', name: 'Phantom', role: 'Mystery' });
    // Rename
    refined.powerStructure.factions[0].name = 'Silver Chain Cartel';
    // Contradict
    refined.population = 99999;
    // Remove
    refined.institutions = refined.institutions.filter(i => i.id !== 'inst.guard');

    const result = verifyAiOverlay(original, refined);
    expect(result.ok).toBe(false);
    expect(result.summary.invented).toBe(1);
    expect(result.summary.renamed).toBe(1);
    expect(result.summary.contradicted).toBeGreaterThanOrEqual(1);
    expect(result.summary.removed).toBe(1);
    expect(result.violations.length).toBeGreaterThanOrEqual(4);
  });

  it('preserves every violation as an independent record (no de-duplication)', () => {
    const original = baseFixture();
    const refined = clone(original);
    // Two renames + one invention = three distinct records.
    refined.npcs[0].name = 'New Name 1';
    refined.npcs[1].name = 'New Name 2';
    refined.npcs.push({ id: 'npc.inv', name: 'Invented' });
    const result = verifyAiOverlay(original, refined);
    expect(result.violations.length).toBe(3);
  });

  it('every violation has the required record fields', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs[0].name = 'Renamed';
    refined.npcs.push({ id: 'npc.x', name: 'X' });
    refined.population = 9999;
    const { violations } = verifyAiOverlay(original, refined);
    for (const v of violations) {
      expect(typeof v.kind).toBe('string');
      expect(typeof v.field).toBe('string');
      expect(typeof v.key).toBe('string');
      expect(typeof v.label).toBe('string');
      expect(typeof v.detail).toBe('string');
      expect(VIOLATION_KINDS).toContain(v.kind);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────
// Defensive handling of malformed entities
// ─────────────────────────────────────────────────────────────────────

describe('verifyAiOverlay() — defensive against malformed entities', () => {
  it('tolerates entities without ids (uses name fallback)', () => {
    const original = { id: 's', name: 'S', npcs: [{ name: 'Alice', role: 'Smith' }] };
    const refined  = { id: 's', name: 'S', npcs: [{ name: 'Alice', role: 'Master Smith' }] };
    const result = verifyAiOverlay(original, refined);
    // Same name → same key → no rename/invention surfaces.
    expect(result.ok).toBe(true);
  });

  it('tolerates null entries in arrays', () => {
    const original = baseFixture();
    original.npcs = [...original.npcs, null];
    const refined = clone(original);
    const result = verifyAiOverlay(original, refined);
    // Null entries should be silently skipped, no spurious violations.
    expect(result.ok).toBe(true);
  });

  it('tolerates non-array values where arrays are expected', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs = null;
    const result = verifyAiOverlay(original, refined);
    // All npcs from original now missing in refined — these surface as removed.
    expect(result.summary.removed).toBeGreaterThan(0);
  });

  it('does NOT crash on missing powerStructure', () => {
    const original = { id: 's', name: 'S' };
    const refined  = { id: 's', name: 'S' };
    expect(() => verifyAiOverlay(original, refined)).not.toThrow();
  });

  it('does NOT crash when one side has powerStructure and the other does not', () => {
    const original = baseFixture();
    const refined = clone(original);
    delete refined.powerStructure;
    expect(() => verifyAiOverlay(original, refined)).not.toThrow();
    // All factions removed → counted as removed_entity.
    const result = verifyAiOverlay(original, refined);
    expect(result.summary.removed).toBeGreaterThanOrEqual(2);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Auxiliary exports
// ─────────────────────────────────────────────────────────────────────

describe('summarizeViolations()', () => {
  it('returns one string per violation', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs[0].name = 'Renamed';
    refined.npcs.push({ id: 'npc.x', name: 'X' });
    const { violations } = verifyAiOverlay(original, refined);
    const lines = summarizeViolations(violations);
    expect(lines.length).toBe(violations.length);
    for (const line of lines) {
      expect(typeof line).toBe('string');
      expect(line.length).toBeGreaterThan(0);
    }
  });

  it('format: "[kind] field: detail"', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs[0].name = 'Renamed';
    const { violations } = verifyAiOverlay(original, refined);
    const lines = summarizeViolations(violations);
    expect(lines[0]).toMatch(/^\[\w+\]\s+\S+:/);
  });

  it('handles non-array gracefully', () => {
    expect(summarizeViolations(null)).toEqual([]);
    expect(summarizeViolations(undefined)).toEqual([]);
    expect(summarizeViolations(42)).toEqual([]);
  });
});

describe('filterViolations()', () => {
  it('keeps only the allowed kinds', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs[0].name = 'Renamed';                            // renamed_entity
    refined.npcs.push({ id: 'npc.x', name: 'X' });               // invented_entity
    refined.population = 9999;                                   // changed_fact
    const { violations } = verifyAiOverlay(original, refined);

    const hardOnly = filterViolations(violations, ['invented_entity', 'renamed_entity']);
    expect(hardOnly.length).toBe(2);
    expect(hardOnly.every(v => ['invented_entity', 'renamed_entity'].includes(v.kind))).toBe(true);
  });

  it('accepts a Set as well as an array', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs.push({ id: 'npc.x', name: 'X' });
    const { violations } = verifyAiOverlay(original, refined);
    const filtered = filterViolations(violations, new Set(['invented_entity']));
    expect(filtered.length).toBe(1);
  });

  it('returns [] when no kinds match', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs.push({ id: 'npc.x', name: 'X' });
    const { violations } = verifyAiOverlay(original, refined);
    expect(filterViolations(violations, ['nonexistent_kind'])).toEqual([]);
  });

  it('handles non-array gracefully', () => {
    expect(filterViolations(null, ['invented_entity'])).toEqual([]);
    expect(filterViolations(undefined, ['invented_entity'])).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────
// Real-world AI failure pattern smoke tests
// ─────────────────────────────────────────────────────────────────────

describe('verifyAiOverlay() — real-world AI failure patterns', () => {
  it('catches the "AI added a flavor NPC" pattern', () => {
    // Model thinks adding a colorful side character helps the prose.
    // Per PRESERVATION_RULES, this is a hard violation.
    const original = baseFixture();
    const refined = clone(original);
    refined.npcs.push({
      id: 'npc.barfly',
      name: 'Old Tomas the Lamplighter',
      role: 'Lamplighter',
    });
    const { ok, summary } = verifyAiOverlay(original, refined);
    expect(ok).toBe(false);
    expect(summary.invented).toBe(1);
  });

  it('catches the "AI rewrote the settlement name" pattern', () => {
    // Model decided "Stonebridge" sounded boring and "renamed" it.
    const original = baseFixture();
    const refined = clone(original);
    refined.name = 'Stonebridge-by-the-Falls';
    const { ok, summary } = verifyAiOverlay(original, refined);
    expect(ok).toBe(false);
    expect(summary.contradicted).toBeGreaterThanOrEqual(1);
  });

  it('catches the "AI renamed a faction to match the thesis" pattern', () => {
    // Most common Haiku failure: model rewrites faction names to fit
    // the thesis it generated. The id stays the same so apply() merges
    // it, but the name is now wrong.
    const original = baseFixture();
    const refined = clone(original);
    refined.powerStructure.factions[0].name = 'The Silver Hand';
    const { ok, summary } = verifyAiOverlay(original, refined);
    expect(ok).toBe(false);
    expect(summary.renamed).toBe(1);
  });

  it('catches the "AI dropped a stress event because the thesis was too rosy" pattern', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.history.historicalEvents = [];
    const { ok, summary } = verifyAiOverlay(original, refined);
    expect(ok).toBe(false);
    expect(summary.historyDropped).toBeGreaterThanOrEqual(1);
  });

  it('passes the "AI did exactly what it should — refined prose only" path', () => {
    const original = baseFixture();
    const refined = clone(original);
    refined.arrivalScene = 'Refined arrival scene with better cadence and specific sensory detail.';
    refined.pressureSentence = 'The Silver Chain Guild squeezes the boatmen, and the boatmen are starting to hold meetings.';
    refined.history.founding.reason = 'A polished retelling — the river ford was the toll station.';
    refined.history.historicalEvents[0].summary = 'Polished summary of the flood year.';
    const { ok, summary } = verifyAiOverlay(original, refined);
    expect(ok).toBe(true);
    expect(summary.invented).toBe(0);
    expect(summary.renamed).toBe(0);
    expect(summary.removed).toBe(0);
    expect(summary.contradicted).toBe(0);
  });
});
