/**
 * tests/domain/factionProfile.test.js — Structured faction profile contract.
 *
 * Tier 4.1's substrate is read-only derivation: the generator output
 * stays the same; this layer enriches it on demand. The contract:
 *
 *   - Archetype detection is deterministic and total (every faction
 *     resolves to one of the canonical archetypes).
 *   - Every template has the same shape (resources × 5 bands; wants,
 *     fears, leverage, vulnerabilities non-empty).
 *   - Idempotent: deriveFactionProfile(deriveFactionProfile(f)) === ...
 *   - Lossless: legacy fields (power, desc) survive on the profile.
 *   - Tolerant: missing fields don't crash; nullish input returns null.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveFactionArchetype,
  templateForArchetype,
  deriveFactionProfile,
  deriveAllFactionProfiles,
} from '../../src/domain/factionProfile.js';
import { explainInstitution } from '../../src/domain/explanation.js';
import { deriveCausalView } from '../../src/domain/causalViews.js';
import { recalculateFactionRelationships } from '../../src/domain/factionRelationshipUpdate.js';
import { deriveDistrictProfile } from '../../src/domain/districtProfile.js';
import { counterfactualCandidates } from '../../src/domain/counterfactual.js';

// ── deriveFactionArchetype ───────────────────────────────────────────────

describe('deriveFactionArchetype()', () => {
  it.each([
    ['Town Council',                  'government'],
    ['Mayor and Council',             'government'],
    ['Royal Authority',               'government'],
    ['Noble Governorship',            'government'],
    ['Feudal Stewardship',            'government'],
    ['Military/Guard',                'military'],
    ['War Council',                   'military'],
    ['Town Watch',                    'military'],
    ['Citizen militia',               'military'],
    ['Religious Authorities',         'religious'],
    ['Temple of the Road Saints',     'religious'],
    ['Clergy',                        'religious'],
    ['Merchant Guilds',               'merchant'],
    ['Merchant Guilds (dominant)',    'merchant'],
    ['Caravan Brokers',               'merchant'],
    ['Craft Guilds',                  'craft'],
    ["Thieves' Guild",                'criminal'],
    ['Street Gang',                   'criminal'],
    ['Smugglers',                     'criminal'],
    ['Arcane Orders',                 'arcane'],
    ['Mage Council',                  'arcane'],
    ['Occupation Authority',          'occupation'],
  ])('"%s" → %s', (name, expected) => {
    expect(deriveFactionArchetype(name)).toBe(expected);
  });

  it('returns "other" for unrecognized names', () => {
    expect(deriveFactionArchetype('Mysterious Cabal')).toBe('other');
  });

  it('accepts the legacy `{ faction, power, desc }` object shape', () => {
    expect(deriveFactionArchetype({ faction: 'Merchant Guilds', power: 30 })).toBe('merchant');
  });

  it('accepts the new `{ name }` object shape', () => {
    expect(deriveFactionArchetype({ name: 'War Council' })).toBe('military');
  });

  it('returns "other" for nullish input', () => {
    expect(deriveFactionArchetype(null)).toBe('other');
    expect(deriveFactionArchetype(undefined)).toBe('other');
    expect(deriveFactionArchetype({})).toBe('other');
  });
});

// ── templateForArchetype ─────────────────────────────────────────────────

describe('templateForArchetype()', () => {
  const archetypes = ['government', 'military', 'religious', 'merchant',
                       'craft', 'criminal', 'arcane', 'occupation', 'other'];

  it.each(archetypes)('%s template has all five resources at low|medium|high', (a) => {
    const t = templateForArchetype(a);
    const bands = ['low', 'medium', 'high'];
    expect(bands).toContain(t.resources.wealth);
    expect(bands).toContain(t.resources.manpower);
    expect(bands).toContain(t.resources.publicTrust);
    expect(bands).toContain(t.resources.coerciveForce);
    expect(bands).toContain(t.resources.informationAccess);
  });

  it.each(archetypes)('%s template has non-empty wants / fears / leverage / vulnerabilities', (a) => {
    const t = templateForArchetype(a);
    expect(t.wants.length).toBeGreaterThan(0);
    expect(t.fears.length).toBeGreaterThan(0);
    expect(t.leverage.length).toBeGreaterThan(0);
    expect(t.vulnerabilities.length).toBeGreaterThan(0);
  });

  it('unknown archetype falls back to "other"', () => {
    const t = templateForArchetype('not-a-real-archetype');
    expect(t).toEqual(templateForArchetype('other'));
  });

  it('returns a fresh clone (mutating return does not pollute template)', () => {
    const a = templateForArchetype('merchant');
    a.wants.push('mutate me');
    const b = templateForArchetype('merchant');
    expect(b.wants).not.toContain('mutate me');
  });

  it('clones the resources object too', () => {
    const a = templateForArchetype('military');
    a.resources.wealth = 'mutated';
    const b = templateForArchetype('military');
    expect(b.resources.wealth).not.toBe('mutated');
  });
});

// ── deriveFactionProfile ─────────────────────────────────────────────────

describe('deriveFactionProfile()', () => {
  it('produces a full profile from a legacy faction object', () => {
    const profile = deriveFactionProfile(
      { faction: 'Merchant Guilds (dominant)', power: 42, desc: 'They run the docks.' },
    );
    expect(profile.id).toBe('faction.merchant_guilds_dominant');
    expect(profile.name).toBe('Merchant Guilds (dominant)');
    expect(profile.archetype).toBe('merchant');
    expect(profile.power).toBe(42);
    expect(profile.desc).toBe('They run the docks.');
    expect(profile.wants.length).toBeGreaterThan(0);
    expect(profile.fears.length).toBeGreaterThan(0);
    expect(profile.leverage.length).toBeGreaterThan(0);
    expect(profile.vulnerabilities.length).toBeGreaterThan(0);
    expect(profile.resources.wealth).toBe('high');
  });

  it('preserves the legacy power field even when missing on input', () => {
    const profile = deriveFactionProfile({ faction: 'Thieves\' Guild' });
    expect(profile.power).toBe(0);
  });

  it('accepts a string faction name', () => {
    const profile = deriveFactionProfile('War Council');
    expect(profile.archetype).toBe('military');
    expect(profile.power).toBe(0);
    expect(profile.id).toBe('faction.war_council');
  });

  it('returns null for nullish input', () => {
    expect(deriveFactionProfile(null)).toBeNull();
    expect(deriveFactionProfile(undefined)).toBeNull();
  });

  it('does not mutate the input', () => {
    const input = { faction: 'Religious Authorities', power: 30 };
    const before = JSON.stringify(input);
    deriveFactionProfile(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  it('legitimacy defaults to 50 when no settlement context is provided', () => {
    const profile = deriveFactionProfile({ faction: 'Town Council' });
    expect(profile.legitimacy).toBe(50);
  });

  it('legitimacy inherits the settlement publicLegitimacy when the faction is governing', () => {
    const profile = deriveFactionProfile(
      { faction: 'Mayor and Council', power: 50 },
      {
        powerStructure: {
          governingName: 'Mayor and Council',
          publicLegitimacy: { score: 38, label: 'Contested' },
        },
      },
    );
    expect(profile.legitimacy).toBe(38);
  });

  it('non-governing factions still get 50 even on a low-legitimacy settlement', () => {
    const profile = deriveFactionProfile(
      { faction: 'Thieves\' Guild', power: 10 },
      {
        powerStructure: {
          governingName: 'Mayor and Council',
          publicLegitimacy: { score: 38 },
        },
      },
    );
    expect(profile.legitimacy).toBe(50);
  });
});

// ── deriveAllFactionProfiles ─────────────────────────────────────────────

describe('deriveAllFactionProfiles()', () => {
  it('maps every faction on a settlement to a profile', () => {
    const profiles = deriveAllFactionProfiles({
      powerStructure: {
        governingName: 'Town Council',
        publicLegitimacy: { score: 60 },
        factions: [
          { faction: 'Town Council',          power: 35 },
          { faction: 'Merchant Guilds',       power: 22 },
          { faction: 'Religious Authorities', power: 20 },
        ],
      },
    });
    expect(profiles).toHaveLength(3);
    expect(profiles[0].archetype).toBe('government');
    expect(profiles[1].archetype).toBe('merchant');
    expect(profiles[2].archetype).toBe('religious');
    // The governing faction (council) inherits settlement legitimacy.
    expect(profiles[0].legitimacy).toBe(60);
    // Non-governing factions remain at neutral baseline.
    expect(profiles[1].legitimacy).toBe(50);
    expect(profiles[2].legitimacy).toBe(50);
  });

  it('returns [] for a settlement with no power structure', () => {
    expect(deriveAllFactionProfiles({})).toEqual([]);
    expect(deriveAllFactionProfiles(null)).toEqual([]);
  });

  it('reads from the legacy `factions` top-level field too', () => {
    const profiles = deriveAllFactionProfiles({
      factions: [{ faction: 'Merchant Guilds', power: 10 }],
    });
    expect(profiles).toHaveLength(1);
    expect(profiles[0].archetype).toBe('merchant');
  });

  // ── Wave B regression: dense FactionProfile[] (drops nullish roster rows) ──
  // deriveFactionProfile maps a falsy roster entry to null; deriveAllFactionProfiles
  // must filter those so every consumer sees a dense array and never dereferences a
  // null element. Consumers key on profile.id/.name, not positional alignment.
  it('drops nullish roster rows so the result is a dense FactionProfile[]', () => {
    const profiles = deriveAllFactionProfiles({
      powerStructure: {
        governingName: 'Town Council',
        factions: [
          { faction: 'Town Council', power: 35 },
          null,                          // degenerate/legacy row → deriveFactionProfile returns null
          undefined,                     // ditto
          '',                            // falsy string → null
          { faction: 'Merchant Guilds', power: 22 },
        ],
      },
    });
    expect(profiles).toHaveLength(2);
    expect(profiles.every(p => p != null)).toBe(true);
    expect(profiles.map(p => p.archetype)).toEqual(['government', 'merchant']);
  });
});

// ── Wave B regression: consumers tolerate a nullish faction row ────────────
// Before the source fix these five sites dereferenced array elements behind a
// non-null cast; a falsy roster row would crash. Now the array is dense, so
// each consumer produces output without throwing and simply omits that faction.
describe('deriveAllFactionProfiles() consumers omit a nullish faction row', () => {
  const settlement = {
    name: 'Testburgh',
    powerStructure: {
      governingName: 'Town Council',
      publicLegitimacy: { score: 60 },
      factions: [
        { faction: 'Town Council', power: 35, controlsInstitutionIds: ['institution.granary'] },
        null,                            // the degenerate row under test
        { faction: 'Merchant Guilds', power: 22 },
      ],
    },
    institutions: [{ id: 'institution.granary', name: 'Granary' }],
    spatialLayout: { quarters: [{ name: 'Market Quarter' }] },
  };

  it('explanation.explainInstitution does not throw and finds the controlling faction', () => {
    let env;
    expect(() => { env = explainInstitution(settlement, 'institution.granary'); }).not.toThrow();
    expect(env).toBeTruthy();
    expect(env.causes.some(c => /Town Council/.test(c.reason))).toBe(true);
  });

  it('causalViews.deriveCausalView("faction") does not throw and lists both real factions', () => {
    let view;
    expect(() => { view = deriveCausalView(settlement, 'faction'); }).not.toThrow();
    expect(view.entries.factions).toHaveLength(2);
  });

  it('factionRelationshipUpdate.recalculateFactionRelationships does not throw', () => {
    let updates;
    expect(() => {
      updates = recalculateFactionRelationships(settlement, { type: 'PLAGUE' }, { archetype: 'plague' });
    }).not.toThrow();
    expect(Array.isArray(updates)).toBe(true);
  });

  it('districtProfile.deriveDistrictProfile does not throw', () => {
    let profile;
    expect(() => {
      profile = deriveDistrictProfile({ name: 'Market Quarter' }, settlement);
    }).not.toThrow();
    expect(profile).toBeTruthy();
  });

  it('counterfactual.counterfactualCandidates does not throw and lists both real factions', () => {
    let candidates;
    expect(() => { candidates = counterfactualCandidates(settlement); }).not.toThrow();
    const factionCandidates = candidates.filter(c => c.type === 'faction');
    expect(factionCandidates).toHaveLength(2);
  });
});
