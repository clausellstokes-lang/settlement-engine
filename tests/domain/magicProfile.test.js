/**
 * tests/domain/magicProfile.test.js — Tier 4.8.
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
    // legality is "restricted" — religious factor pulled it down one
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

  it("infrastructure reaches the 'common' band below the top magic tier (present without integral)", () => {
    // Regression: infrastructure's 'present' and 'integral' conditions were the
    // identical expression, so role() (which checks integral first) skipped
    // 'common' entirely. An arcane institution at a NON-top magic tier is
    // present-but-not-integral → 'common'.
    const m = deriveMagicProfile({
      config: { magicLevel: 'moderate' },
      institutions: [{ name: "Mage's Tower" }],
      powerStructure: { factions: [] },
    });
    expect(m.roles.infrastructure).toBe('common');
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

// P3.3b Stage 3b: magicProfile keyed on a stale 6-tier vocabulary, but the generator emits the
// canonical 4-tier band (none/low/medium/high via getMagicLevel). A generated 'medium'-magic
// town used to fall through to the 'low' defaults (availability limited, cost extortionate);
// 'none' showed magic roles as 'occasional'. These pin the canonical bands.
describe('deriveMagicProfile — canonical generator vocabulary (P3.3b Stage 3b)', () => {
  const at = (magicLevel) => deriveMagicProfile({ config: { magicLevel }, powerStructure: { factions: [] }, institutions: [] });

  it("'medium' reads as the moderate tier (not the low default)", () => {
    const m = at('medium');
    expect(m.availability).toBe('moderate'); // was 'limited' (low default)
    expect(m.legality).toBe('regulated');    // was 'restricted'
    expect(m.cost).toBe('costly');            // was 'extortionate'
  });

  it("'medium' matches the legacy 'moderate' on every facet (canonical == legacy mid-tier)", () => {
    const med = at('medium');
    const mod = at('moderate');
    expect(med.availability).toBe(mod.availability);
    expect(med.legality).toBe(mod.legality);
    expect(med.cost).toBe(mod.cost);
    expect(med.risk).toBe(mod.risk);
  });

  it("'none' (dead-magic) reads magic roles as absent, not occasional", () => {
    const m = at('none');
    expect(m.roles.economic).toBe('absent');
    expect(m.roles.medical).toBe('absent');
  });

  it('legacy pervasive/high tiers are unchanged (no 6-tier collapse)', () => {
    expect(at('pervasive').cost).toBe('cheap');
    expect(at('pervasive').availability).toBe('pervasive');
    expect(at('high').availability).toBe('broad');
  });
});

// Wave 7 wiring: a magical_instability condition (the deadzone/instability
// stressor family's promotion target) lowers the substrate's magical_stability,
// which this profile already reads — so the crisis now raises magical risk
// without any new plumbing here.
describe('deriveMagicProfile — magical_instability condition raises risk (Wave 7)', () => {
  const at = (activeConditions) => deriveMagicProfile({
    config: { magicLevel: 'medium' },
    powerStructure: { factions: [] },
    institutions: [],
    activeConditions,
  });

  it('risk climbs one band when the condition strains magical_stability', () => {
    const calm = at([]);
    const unstable = at([{ archetype: 'magical_instability', severity: 0.8 }]);
    const bands = magicRiskBands();
    expect(bands.indexOf(unstable.risk)).toBeGreaterThan(bands.indexOf(calm.risk));
    expect(unstable.contributors.some(c => c.source === 'var.magical_stability')).toBe(true);
  });
});

// Wave 5 #3 (dead-magic leaks): deriveMagicProfile fabricated a full availability/
// cost/risk envelope for magicExists:false worlds — a no-magic campaign read
// "Availability: rare. Cost: extortionate." as if magic merely happened to be
// scarce. The profile now says magic is absent, even when legacy magicLevel
// bands, sliders, or arcane institutions survive on the record.
describe('deriveMagicProfile — dead-magic world is honest (Wave 5 #3)', () => {
  const deadMagicCity = {
    config: { magicExists: false, magicLevel: 'pervasive', priorityMagic: 90 },
    institutions: [{ name: "Wizard's Tower" }, { name: 'Cathedral' }],
    powerStructure: { factions: [{ faction: 'Arcane Conclave', power: 70 }] },
  };

  it('reports magic as absent instead of fabricating an envelope', () => {
    const m = deriveMagicProfile(deadMagicCity);
    expect(m.magicExists).toBe(false);
    expect(m.availability).toBe('absent');
    expect(m.legality).toBe('absent');
    expect(m.cost).toBe('absent');
    expect(m.risk).toBe('absent');
    expect(m.roles).toEqual({
      economic: 'absent', military: 'absent', medical: 'absent', infrastructure: 'absent',
    });
    expect(m.institutionalControl).toBe('unregulated');
    expect(m.religiousAcceptance).toBe('indifferent');
  });

  it('the contributor names the no-magic world as the cause', () => {
    const m = deriveMagicProfile(deadMagicCity);
    expect(m.contributors).toHaveLength(1);
    expect(m.contributors[0].source).toBe('config.magicExists');
  });

  it('absent facets still come from the canonical band exports', () => {
    const m = deriveMagicProfile(deadMagicCity);
    expect(magicAvailabilityBands()).toContain(m.availability);
    expect(magicLegalityBands()).toContain(m.legality);
    expect(magicRiskBands()).toContain(m.risk);
    for (const r of Object.values(m.roles)) expect(magicRoleBands()).toContain(r);
  });

  it('summarizeMagic stays well-formed for a dead-magic world', () => {
    const lines = summarizeMagic(deadMagicCity);
    expect(lines).toHaveLength(6);
    expect(lines[0]).toBe('Availability: absent.');
  });

  it('a magic-enabled profile carries magicExists:true and unchanged facets', () => {
    const m = deriveMagicProfile({ config: { magicLevel: 'medium' }, powerStructure: { factions: [] }, institutions: [] });
    expect(m.magicExists).toBe(true);
    expect(m.availability).toBe('moderate'); // medium tier facets unchanged by the guard
    expect(m.legality).toBe('regulated');
    expect(m.cost).toBe('costly');
  });

  it("'absent' floors are unreachable by band stepping — only the dead-magic short circuit assigns them", () => {
    // Strong religious faction pulls legality DOWN one band from the 'restricted'
    // baseline: the floor of the lived-world scale is 'forbidden', never 'absent'.
    const m = deriveMagicProfile({
      config: { magicLevel: 'low' },
      powerStructure: { factions: [{ faction: 'Religious Authorities', power: 60 }] },
      institutions: [],
    });
    expect(m.legality).toBe('forbidden');
    expect(m.availability).not.toBe('absent');
    expect(m.risk).not.toBe('absent');
  });
});
