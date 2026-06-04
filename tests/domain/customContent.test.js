/**
 * tests/domain/customContent.test.js - Tier 4.16 lean tests.
 */

import { describe, it, expect } from 'vitest';
import {
  CUSTOM_CONTENT_TYPES,
  INSTITUTION_CATEGORIES,
  inferCustomEntityType,
  classifyCustomEntity,
  classifyCustomInstitution,
  supportedCustomContentTypes,
  supportedInstitutionCategories,
  institutionCategoryTemplate,
} from '../../src/domain/customContent.js';

describe('catalogs', () => {
  it('exposes 5 content types', () => {
    expect(CUSTOM_CONTENT_TYPES).toEqual(['institution', 'faction', 'npc', 'threat', 'hook']);
    expect(supportedCustomContentTypes()).toEqual([...CUSTOM_CONTENT_TYPES]);
  });

  it('exposes institution categories with templates', () => {
    expect(supportedInstitutionCategories()).toEqual([...INSTITUTION_CATEGORIES]);
    for (const c of INSTITUTION_CATEGORIES) {
      const t = institutionCategoryTemplate(c);
      expect(t, c).toBeTruthy();
      expect(Array.isArray(t.provides)).toBe(true);
      expect(t.effects).toHaveProperty('substrate');
      expect(t.effects).toHaveProperty('capacities');
    }
  });
});

// ── Type inference ─────────────────────────────────────────────────────

describe('inferCustomEntityType()', () => {
  it('respects explicit type when valid', () => {
    expect(inferCustomEntityType({ type: 'faction', name: 'X' })).toBe('faction');
  });

  it('detects faction-like names', () => {
    expect(inferCustomEntityType({ name: "Thieves' Guild" })).toBe('faction');
    expect(inferCustomEntityType({ name: 'Order of the Dragon' })).toBe('faction');
  });

  it('detects threat-like names', () => {
    expect(inferCustomEntityType({ name: 'Blight cult menace' })).toBe('threat');
  });

  it('detects hook-like names', () => {
    expect(inferCustomEntityType({ name: 'Whispers from the docks' })).toBe('hook');
  });

  it('defaults institution-shaped names to institution', () => {
    expect(inferCustomEntityType({ name: 'Dragonbone Foundry' })).toBe('institution');
  });

  it('returns null for nullish', () => {
    expect(inferCustomEntityType(null)).toBeNull();
  });
});

// ── Institution classification (the rich path) ─────────────────────────

describe('classifyCustomInstitution()', () => {
  it('Dragonbone Foundry classifies as craft', () => {
    const c = classifyCustomInstitution({ name: 'Dragonbone Foundry' });
    expect(c.inferredCategory).toBe('craft');
    expect(c.controlledBy).toBe('craft');
  });

  it('Temple of the Black Sun classifies as religious', () => {
    const c = classifyCustomInstitution({ name: 'Temple of the Black Sun' });
    expect(c.inferredCategory).toBe('religious');
    expect(c.effects.substrate.religious_authority).toBeGreaterThan(0);
  });

  it('Smugglers\' Den classifies as criminal with negative legitimacy', () => {
    const c = classifyCustomInstitution({ name: "Smugglers' Den" });
    expect(c.inferredCategory).toBe('criminal');
    expect(c.effects.substrate.criminal_opportunity).toBeGreaterThan(0);
    expect(c.effects.substrate.public_legitimacy).toBeLessThan(0);
  });

  it('arcane institution in low-magic setting picks up an environmental contributor', () => {
    const c = classifyCustomInstitution(
      { name: "Conclave of the Veil" },
      { config: { magicLevel: 'low' } }
    );
    expect(c.inferredCategory).toBe('arcane');
    expect(c.contributors.some(x => x.effect === 'environment_dampen')).toBe(true);
  });

  it('user-provided fields override template defaults', () => {
    const c = classifyCustomInstitution({
      name: 'Town Granary',
      risks: ['hoarding', 'arson'],
      controlledBy: 'merchant',
    });
    expect(c.risks).toEqual(['hoarding', 'arson']);
    expect(c.controlledBy).toBe('merchant');
  });

  it('unrecognized name falls to other', () => {
    const c = classifyCustomInstitution({ name: 'The Quiet Room' });
    expect(c.inferredCategory).toBe('other');
  });

  it('returns canonical envelope shape', () => {
    const c = classifyCustomInstitution({ name: 'Iron Forge' });
    expect(c).toHaveProperty('type', 'institution');
    expect(c).toHaveProperty('rawName');
    expect(c).toHaveProperty('inferredCategory');
    expect(c).toHaveProperty('provides');
    expect(c).toHaveProperty('requires');
    expect(c).toHaveProperty('controlledBy');
    expect(c).toHaveProperty('risks');
    expect(c).toHaveProperty('effects');
    expect(Array.isArray(c.contributors)).toBe(true);
  });
});

// ── Universal dispatcher ───────────────────────────────────────────────

describe('classifyCustomEntity()', () => {
  it('routes by inferred type', () => {
    const f = classifyCustomEntity({ name: "Merchants' Guild" });
    expect(f.type).toBe('faction');
    const i = classifyCustomEntity({ name: 'Old Mill' });
    expect(i.type).toBe('institution');
    const t = classifyCustomEntity({ name: 'Bandit raid threat' });
    expect(t.type).toBe('threat');
    const h = classifyCustomEntity({ name: 'A rumor at the docks' });
    expect(h.type).toBe('hook');
  });

  it('respects explicit type override', () => {
    const e = classifyCustomEntity({ name: 'Anything', type: 'npc' });
    expect(e.type).toBe('npc');
  });

  it('returns null for nullish input', () => {
    expect(classifyCustomEntity(null)).toBeNull();
  });
});

// ── Purity ─────────────────────────────────────────────────────────────

describe('purity', () => {
  it('does not mutate input', () => {
    const e = { name: 'Dragonbone Foundry', risks: ['contamination'] };
    const before = JSON.stringify(e);
    classifyCustomEntity(e);
    expect(JSON.stringify(e)).toBe(before);
  });
});
