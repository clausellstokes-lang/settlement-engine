/**
 * tests/domain/b07DomainSchemaFixes.test.js — B07 review-bundle regression pins.
 *
 * Each block pins one reviewed bug:
 *   #1 magicProfile integral roles are reachable for GENERATOR vocabulary ('high')
 *   #4 regenerationMode preserves locked/canon factions+conditions lacking a raw id
 *   #5 reconciliationLog.at is deterministic (no wall-clock) when options.now omitted
 *   #6 migration runner REFUSES a forward-versioned (newer) save
 *   #7 npcArchetypeBreakdown buckets are built dynamically (no silent undercount)
 */

import { describe, it, expect, vi } from 'vitest';

import { deriveMagicProfile, magicRoleBands } from '../../src/domain/magicProfile.js';
import { buildRegenerationPlan } from '../../src/domain/regenerationMode.js';
import { reconcileSettlementChange } from '../../src/domain/settlementReconciliation.js';
import { migrateSettlementToLatest } from '../../src/domain/settlementMigrations.js';
import { SCHEMA_VERSION } from '../../src/domain/settlement.schema.js';
import { npcArchetypeBreakdown } from '../../src/domain/npcProfile.js';

// ── #1 Magic 'integral' roles reachable for generator vocabulary ───────────
//
// getMagicLevel tops out at 'high' (priority > 65) — it NEVER emits 'pervasive'.
// deriveRoles keyed the 'integral' tier on magic === 'pervasive', so a
// procedurally-generated high-magic town could never reach integral economic/
// military/infrastructure roles. The fix routes the top-band check through
// magicLedger's canonical band so 'high' (generator) and 'pervasive' (legacy)
// both count as the top tier.
describe('magicProfile — generator-vocabulary high magic can reach integral roles (#1)', () => {
  const highMagicCity = {
    config: { magicLevel: 'high', priorityMagic: 90 },
    institutions: [{ name: 'Grand Tower' }, { name: 'Temple of Light' }, { name: 'House of Healing' }],
    powerStructure: { factions: [{ faction: 'Arcane Conclave', power: 60 }] },
  };

  it("'high' (the generator's top band) yields integral economic + infrastructure roles", () => {
    const m = deriveMagicProfile(highMagicCity);
    expect(m.roles.economic).toBe('integral');
    expect(m.roles.infrastructure).toBe('integral');
    for (const r of Object.values(m.roles)) expect(magicRoleBands()).toContain(r);
  });

  it("'high' military reaches integral once arcane power is strong (>=50)", () => {
    const m = deriveMagicProfile(highMagicCity);
    expect(m.roles.military).toBe('integral');
  });

  it('legacy pervasive remains integral (no regression — both canon to the top band)', () => {
    const m = deriveMagicProfile({
      config: { magicLevel: 'pervasive' },
      institutions: [{ name: 'Grand Tower' }, { name: 'Temple of Light' }, { name: 'Apothecary' }],
      powerStructure: { factions: [{ faction: 'Arcane Conclave', power: 60 }] },
    });
    expect(m.roles.economic).toBe('integral');
    expect(m.roles.infrastructure).toBe('integral');
  });

  it("'medium' magic stays below integral (mid band, not top)", () => {
    const m = deriveMagicProfile({
      config: { magicLevel: 'medium' },
      institutions: [{ name: 'Grand Tower' }],
      powerStructure: { factions: [{ faction: 'Arcane Conclave', power: 60 }] },
    });
    expect(m.roles.economic).not.toBe('integral');
    expect(m.roles.infrastructure).not.toBe('integral');
  });

  it('does not mutate the input settlement', () => {
    const before = JSON.stringify(highMagicCity);
    deriveMagicProfile(highMagicCity);
    expect(JSON.stringify(highMagicCity)).toBe(before);
  });
});

// ── #4 regenerationMode preserves entities whose ids are profile-derived ───
//
// A legacy faction of shape {faction, power, desc} carries no stored `.id`.
// entityCatalog stamps a profile-derived id (faction.<slug>); lookupTagForEntity
// used to match raw `.id === catalogId`, missing it entirely and tagging it
// generated/draft — so a LOCKED legacy faction got rerolled instead of preserved.
describe('regenerationMode — preserves locked/canon entities lacking a stored id (#4)', () => {
  function fixtureWithIdlessEntities() {
    return {
      name: 'Hollowmere',
      tier: 'town',
      institutions: [
        // No stored id — catalog derives `institution.locked_forge`.
        { name: 'Locked Forge', locked: true },
        { name: 'Draft Mill' },
      ],
      powerStructure: {
        factions: [
          // Legacy shape: {faction, power, desc} + locked, NO id.
          { faction: 'The Iron Pact', power: 50, desc: 'guild bloc', locked: true },
          { faction: 'Drifters', power: 20 },
        ],
      },
      activeConditions: [
        // Legacy condition without a `condition.`-prefixed id, locked by the user.
        { archetype: 'famine', severity: 0.6, locked: true },
      ],
      npcs: [{ name: 'Warden Vex', locked: true }], // no stored id
    };
  }

  it('rebalance preserves a locked legacy faction with no stored id', () => {
    const p = buildRegenerationPlan(fixtureWithIdlessEntities(), { mode: 'rebalance' });
    const preserved = p.preserveEntities.filter(e => e.type === 'faction').map(e => e.label);
    expect(preserved).toContain('The Iron Pact');
    // The unlocked draft faction is rerolled.
    const rerolled = p.rerollEntities.filter(e => e.type === 'faction').map(e => e.label);
    expect(rerolled).toContain('Drifters');
  });

  it('rebalance preserves a locked legacy condition with no condition.* id', () => {
    const p = buildRegenerationPlan(fixtureWithIdlessEntities(), { mode: 'rebalance' });
    const preserved = p.preserveEntities.filter(e => e.type === 'condition');
    expect(preserved.length).toBeGreaterThan(0);
  });

  it('rebalance preserves a locked institution + npc with no stored id', () => {
    const p = buildRegenerationPlan(fixtureWithIdlessEntities(), { mode: 'rebalance' });
    const instLabels = p.preserveEntities.filter(e => e.type === 'institution').map(e => e.label);
    expect(instLabels).toContain('Locked Forge');
    const npcLabels = p.preserveEntities.filter(e => e.type === 'npc').map(e => e.label);
    expect(npcLabels).toContain('Warden Vex');
  });

  it('reforge still preserves the locked legacy faction (locked rule)', () => {
    const p = buildRegenerationPlan(fixtureWithIdlessEntities(), { mode: 'reforge' });
    const preserved = p.preserveEntities.filter(e => e.type === 'faction').map(e => e.label);
    expect(preserved).toContain('The Iron Pact');
  });
});

// ── #5 reconciliationLog determinism ───────────────────────────────────────
describe('settlementReconciliation — deterministic at (#5)', () => {
  const prior = { activeConditions: [] };

  it('records at:null (not wall-clock) when options.now is omitted', () => {
    const merged = reconcileSettlementChange({ name: 'A', activeConditions: [] }, prior, {
      source: 'regenerate',
      changeType: 'GENERATE_SETTLEMENT',
    });
    expect(merged.reconciliationLog.at(-1).at).toBeNull();
  });

  it('two reconciles with the same inputs and no now produce identical log entries', () => {
    const opts = { source: 'regenerate', changeType: 'GENERATE_SETTLEMENT', changeLabel: 'A' };
    const a = reconcileSettlementChange({ name: 'A', activeConditions: [] }, prior, opts);
    const b = reconcileSettlementChange({ name: 'A', activeConditions: [] }, prior, opts);
    expect(JSON.stringify(a.reconciliationLog)).toBe(JSON.stringify(b.reconciliationLog));
  });

  it('still honors an explicit options.now timestamp', () => {
    const merged = reconcileSettlementChange({ name: 'A', activeConditions: [] }, prior, {
      source: 'canon_event',
      now: '2026-06-05T12:00:00.000Z',
    });
    expect(merged.reconciliationLog.at(-1).at).toBe('2026-06-05T12:00:00.000Z');
  });
});

// ── #6 migration runner surfaces forward-versioned saves ───────────────────
describe('settlementMigrations — surfaces a forward-versioned save (#6)', () => {
  it('warns (no longer silent) for schemaVersion > SCHEMA_VERSION and passes through unchanged', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const future = { name: 'Tomorrowtown', schemaVersion: SCHEMA_VERSION + 5 };
    const out = migrateSettlementToLatest(future);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toMatch(/newer/i);
    // No down-migration exists — the save is returned unchanged, not corrupted.
    expect(out).toBe(future);
    warn.mockRestore();
  });

  it('a current-version save passes through unchanged (idempotent)', () => {
    const current = { name: 'Now', schemaVersion: SCHEMA_VERSION };
    expect(migrateSettlementToLatest(current)).toEqual(current);
  });

  it('a pre-versioned save still migrates up to SCHEMA_VERSION', () => {
    const out = migrateSettlementToLatest({ name: 'Old' });
    expect(out.schemaVersion).toBe(SCHEMA_VERSION);
  });
});

// ── #7 npcArchetypeBreakdown built dynamically ─────────────────────────────
describe('npcProfile — archetype breakdown buckets are dynamic (#7)', () => {
  it('seeds a bucket for every canonical archetype even with no NPCs', () => {
    const out = npcArchetypeBreakdown({ npcs: [] });
    // The canonical NPC archetype vocabulary (NPC_TEMPLATES keys).
    for (const k of ['government', 'military', 'religious', 'merchant', 'craft', 'criminal', 'arcane', 'occupation', 'other']) {
      expect(out[k]).toBe(0);
    }
  });

  it('counts NPCs into the right buckets via the category→archetype map', () => {
    const out = npcArchetypeBreakdown({
      npcs: [
        { name: 'Captain', category: 'military' },
        { name: 'Archmage', category: 'magic' }, // alias → arcane
        { name: 'Smith', category: 'crafts' },    // alias → craft
        { name: 'Baron', category: 'noble' },      // alias → government
      ],
    });
    expect(out.military).toBe(1);
    expect(out.arcane).toBe(1);
    expect(out.craft).toBe(1);
    expect(out.government).toBe(1);
  });
});
