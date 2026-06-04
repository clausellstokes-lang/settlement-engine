/**
 * tests/domain/magicProfile.test.js - Tier 4.8.
 *
 * Pin facet directions + envelope shape + no-mutation + smoke.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveMagicProfile,
  magicAvailabilityBands,
  magicLegalityBands,
  magicRiskBands,
  magicRoleBands,
  summarizeMagic,
} from '../../src/domain/magicProfile.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

describe('deriveMagicProfile()', () => {
  it('returns null for nullish settlement', () => {
    expect(deriveMagicProfile(null)).toBeNull();
  });

  it('returns the canonical 10-facet shape', () => {
    const m = deriveMagicProfile({ config: { magicLevel: 'moderate' } });
    expect(m).toHaveProperty('availability');
    expect(m).toHaveProperty('legality');
    expect(m).toHaveProperty('institutionalControl');
    expect(m).toHaveProperty('cost');
    expect(m).toHaveProperty('risk');
    expect(m).toHaveProperty('religiousAcceptance');
    expect(m.roles).toHaveProperty('economic');
    expect(m.roles).toHaveProperty('military');
    expect(m.roles).toHaveProperty('medical');
    expect(m.roles).toHaveProperty('infrastructure');
    expect(Array.isArray(m.contributors)).toBe(true);
  });

  it('every facet value comes from the canonical bands', () => {
    const m = deriveMagicProfile({ config: { magicLevel: 'moderate' } });
    expect(magicAvailabilityBands()).toContain(m.availability);
    expect(magicLegalityBands()).toContain(m.legality);
    expect(magicRiskBands()).toContain(m.risk);
    for (const r of Object.values(m.roles)) {
      expect(magicRoleBands()).toContain(r);
    }
  });
});

// ── Facet directions ───────────────────────────────────────────────────

describe('availability scales with magic level', () => {
  it('pervasive > low', () => {
    const lo = deriveMagicProfile({ config: { magicLevel: 'low' } });
    const hi = deriveMagicProfile({ config: { magicLevel: 'pervasive' } });
    const bands = magicAvailabilityBands();
    expect(bands.indexOf(hi.availability)).toBeGreaterThan(bands.indexOf(lo.availability));
  });
});

describe('legality + religious acceptance', () => {
  it('dominant religious faction with weak arcane shows hostile acceptance + lower legality', () => {
    const s = {
      config: { magicLevel: 'moderate' },
      powerStructure: {
        factions: [
          { faction: 'Religious Authorities', power: 60 },
        ],
      },
    };
    const m = deriveMagicProfile(s);
    expect(m.religiousAcceptance).toBe('hostile');
    // legality is "restricted" - religious factor pulled it down one
    const bands = magicLegalityBands();
    const baseline = deriveMagicProfile({ config: { magicLevel: 'moderate' } });
    expect(bands.indexOf(m.legality)).toBeLessThan(bands.indexOf(baseline.legality));
  });

  it('arcane dominant produces syncretic acceptance', () => {
    const m = deriveMagicProfile({
      config: { magicLevel: 'high' },
      powerStructure: {
        factions: [
          { faction: 'Arcane Conclave', power: 70 },
          { faction: 'Religious Authorities', power: 20 },
        ],
      },
    });
    expect(m.religiousAcceptance).toBe('syncretic');
  });
});

describe('institutionalControl', () => {
  it('arcane faction + arcane institution = guild_controlled', () => {
    const m = deriveMagicProfile({
      config: { magicLevel: 'high' },
      institutions: [{ name: "Mage's Tower" }],
      powerStructure: {
        factions: [{ faction: 'Arcane Conclave', power: 50 }],
      },
    });
    expect(m.institutionalControl).toBe('guild_controlled');
  });

  it('arcane institution without faction = fragmented', () => {
    const m = deriveMagicProfile({
      config: { magicLevel: 'high' },
      institutions: [{ name: "Mage's Tower" }],
      powerStructure: { factions: [] },
    });
    expect(m.institutionalControl).toBe('fragmented');
  });

  it('no arcane institutions = unregulated', () => {
    const m = deriveMagicProfile({
      config: { magicLevel: 'low' },
      institutions: [],
      powerStructure: { factions: [] },
    });
    expect(m.institutionalControl).toBe('unregulated');
  });
});

describe('cost scales inversely with availability', () => {
  it('pervasive = cheap, rare = extortionate', () => {
    expect(deriveMagicProfile({ config: { magicLevel: 'pervasive' } }).cost).toBe('cheap');
    expect(deriveMagicProfile({ config: { magicLevel: 'low' } }).cost).toBe('extortionate');
  });
});

describe('roles', () => {
  it('low magic + no arcane = mostly absent roles', () => {
    const m = deriveMagicProfile({
      config: { magicLevel: 'low' },
      institutions: [],
      powerStructure: { factions: [] },
    });
    expect(m.roles.economic).toBe('absent');
    expect(m.roles.military).toBe('absent');
    expect(m.roles.infrastructure).toBe('absent');
  });

  it('pervasive magic produces integral roles', () => {
    const m = deriveMagicProfile({
      config: { magicLevel: 'pervasive' },
      institutions: [{ name: "Grand Tower" }, { name: 'Temple of Light' }, { name: 'Apothecary' }],
      powerStructure: {
        factions: [{ faction: 'Arcane Conclave', power: 60 }],
      },
    });
    expect(m.roles.economic).toBe('integral');
    expect(m.roles.infrastructure).toBe('integral');
  });
});

// ── Diagnostics ────────────────────────────────────────────────────────

describe('summarizeMagic()', () => {
  it('emits 6 lines covering every facet', () => {
    const lines = summarizeMagic({ config: { magicLevel: 'moderate' } });
    expect(lines).toHaveLength(6);
    for (const line of lines) {
      expect(line.length).toBeGreaterThan(0);
    }
  });
});

// ── Purity + smoke ─────────────────────────────────────────────────────

describe('purity + real-settlement smoke', () => {
  it('does not mutate the input settlement', () => {
    const s = {
      config: { magicLevel: 'high' },
      institutions: [{ name: "Mage's Tower" }],
      powerStructure: { factions: [{ faction: 'Arcane Conclave', power: 50 }] },
    };
    const before = JSON.stringify(s);
    deriveMagicProfile(s);
    expect(JSON.stringify(s)).toBe(before);
  });

  it('runs over a real city without throwing', () => {
    const settlement = generateSettlementPipeline(
      { settType: 'city', culture: 'germanic' },
      null,
      { seed: 'magic-real-city', customContent: {} },
    );
    const m = deriveMagicProfile(settlement);
    expect(m).toBeTruthy();
    expect(magicAvailabilityBands()).toContain(m.availability);
    expect(magicLegalityBands()).toContain(m.legality);
  });
});
