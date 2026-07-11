/**
 * institutionVocabulary.test.js — Phase 5 Wave 1 side-car integrity + drift pin.
 *
 * domain/display/institutionVocabulary.js is a golden-INERT side-car (generation never
 * imports it, so the golden manifest is unaffected by anything here). These pins
 * guard the two things that would otherwise rot silently:
 *
 *   1. KEY INTEGRITY. Every key in every map is an EXACT canonical catalog name
 *      (no orphans), and every catalog institution carries an authored identity
 *      one-liner (completeness). Identity copy is F24-clean (no em-dashes, no
 *      exclamation, terminal period, bounded length).
 *
 *   2. SINGLE-SOURCE DRIFT PIN. The moral/martial FORM leans that generation
 *      reads stay canonical in domain/worldPulse/moralMartialLean.js. This test
 *      asserts INSTITUTION_MORAL_LEAN is a consistent SUPERSET of that engine
 *      seed (every engine-coded institution appears in the side-car with the
 *      IDENTICAL value), and every engine-martial institution carries a role tag.
 *      If either the engine leaf or the side-car changes without the other, this
 *      fails — there is one source per value, plus an extension.
 */

import { describe, test, expect } from 'vitest';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { institutionMoralLean, institutionMartialLean } from '../../src/domain/worldPulse/moralMartialLean.js';
// W-C3 item 1: the founding-catalog names are legitimate side-car keys (lifecycle-only
// institutions the founding lane raises). They are NOT in the generation catalog
// (golden-inert by construction) but they DO appear on settlements post-founding, so
// they carry an authored identity + moral lean here. Unioned into CATALOG_NAMES so the
// coverage/no-orphan pins recognize them; their leans are pinned equal below.
import { FOUNDING_INSTITUTIONS } from '../../src/domain/worldPulse/foundingCatalog.js';
import {
  INSTITUTION_IDENTITY,
  INSTITUTION_MORAL_LEAN,
  INSTITUTION_MARTIAL_ROLE,
  INSTITUTION_WAR_SUPPLY,
  INSTITUTION_FLAVOR_AFFINITY,
  INSTITUTION_BADGE_OVERRIDES,
  identityForInstitution,
  badgeForInstitution,
} from '../../src/domain/display/institutionVocabulary.js';

// Unique catalog names → a representative instance (mirrors what generation
// spreads: name + group as category + priorityCategory + tags).
const INSTANCES = (() => {
  /** @type {Map<string, any>} */
  const m = new Map();
  for (const groups of Object.values(institutionalCatalog)) {
    for (const [group, insts] of Object.entries(groups)) {
      for (const [name, def] of Object.entries(insts)) {
        if (!m.has(name)) m.set(name, { name, category: group, priorityCategory: def.priorityCategory || '', tags: def.tags || [] });
      }
    }
  }
  return m;
})();
// Coverage/no-orphan domain = generation catalog names ∪ founding-catalog names. The
// instance-based pins below (drift, badge, martial) still iterate INSTANCES only, since
// founded institutions are not generated.
const FOUNDING_NAMES = FOUNDING_INSTITUTIONS.map((e) => e.name);
const CATALOG_NAMES = new Set([...INSTANCES.keys(), ...FOUNDING_NAMES]);
const ARRAY_MAPS = { INSTITUTION_MARTIAL_ROLE, INSTITUTION_WAR_SUPPLY, INSTITUTION_FLAVOR_AFFINITY };

describe('institutionVocabulary — key integrity', () => {
  const MAPS = {
    INSTITUTION_IDENTITY,
    INSTITUTION_MORAL_LEAN,
    INSTITUTION_MARTIAL_ROLE,
    INSTITUTION_WAR_SUPPLY,
    INSTITUTION_FLAVOR_AFFINITY,
    INSTITUTION_BADGE_OVERRIDES,
  };
  for (const [label, map] of Object.entries(MAPS)) {
    test(`${label}: every key is a real catalog institution (no orphans)`, () => {
      const orphans = Object.keys(map).filter((k) => !CATALOG_NAMES.has(k));
      expect(orphans, `orphan keys in ${label}: ${orphans.join(', ')}`).toEqual([]);
    });
  }

  test('every catalog institution has an authored identity one-liner', () => {
    const missing = [...CATALOG_NAMES].filter((n) => !(n in INSTITUTION_IDENTITY));
    expect(missing, `institutions with no identity: ${missing.join(', ')}`).toEqual([]);
    expect(Object.keys(INSTITUTION_IDENTITY).length).toBe(CATALOG_NAMES.size);
  });
});

describe('institutionVocabulary — identity hygiene (F24 / house voice)', () => {
  test('every one-liner is clean: no em-dash, no exclamation, terminal period, bounded', () => {
    const bad = [];
    for (const [name, s] of Object.entries(INSTITUTION_IDENTITY)) {
      if (typeof s !== 'string' || !s.trim()) bad.push(`${name}: empty`);
      if (/[—–]/.test(s)) bad.push(`${name}: em/en-dash`);
      if (s.includes('!')) bad.push(`${name}: exclamation`);
      if (!/\.$/.test(s.trim())) bad.push(`${name}: no terminal period`);
      if (s.length > 260) bad.push(`${name}: over 260 chars`);
    }
    expect(bad, bad.join('\n')).toEqual([]);
  });

  test('identityForInstitution resolves the exact authored string, null for unknowns', () => {
    const [name, str] = Object.entries(INSTITUTION_IDENTITY)[0];
    expect(identityForInstitution({ name })).toBe(str);
    expect(identityForInstitution({ name: name.toLowerCase() })).toBe(str); // case-tolerant
    expect(identityForInstitution({ name: 'No Such Institution 12345' })).toBeNull();
    expect(identityForInstitution({})).toBeNull();
    expect(identityForInstitution(null)).toBeNull();
  });
});

describe('institutionVocabulary — moral/martial single-source drift pin', () => {
  test('INSTITUTION_MORAL_LEAN is a consistent superset of the engine seed', () => {
    const problems = [];
    for (const inst of INSTANCES.values()) {
      const engine = institutionMoralLean(inst);
      if (!engine) continue;
      const side = INSTITUTION_MORAL_LEAN[inst.name];
      if (!side) { problems.push(`${inst.name}: engine-coded but absent from side-car`); continue; }
      if (side.cruelty !== engine.cruelty || side.disorder !== engine.disorder) {
        problems.push(`${inst.name}: drift engine=${JSON.stringify(engine)} side=${JSON.stringify(side)}`);
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('every engine-martial institution carries a role tag in the side-car', () => {
    const problems = [];
    for (const inst of INSTANCES.values()) {
      if (!institutionMartialLean(inst)) continue;
      const roles = INSTITUTION_MARTIAL_ROLE[inst.name];
      if (!Array.isArray(roles) || roles.length === 0) problems.push(`${inst.name}: engine-martial but no role tag`);
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('INSTITUTION_MORAL_LEAN agrees with the founding-catalog engine seed', () => {
    // The founding catalog's `lean` is the engine coding the founding lane reads; the
    // side-car must carry the IDENTICAL value (single source + drift pin, W-C3 item 1).
    const problems = [];
    for (const entry of FOUNDING_INSTITUTIONS) {
      const side = INSTITUTION_MORAL_LEAN[entry.name];
      if (!side) { problems.push(`${entry.name}: founding-coded but absent from side-car`); continue; }
      if (side.cruelty !== entry.lean.cruelty || side.disorder !== entry.lean.disorder) {
        problems.push(`${entry.name}: drift founding=${JSON.stringify(entry.lean)} side=${JSON.stringify(side)}`);
      }
    }
    expect(problems, problems.join('\n')).toEqual([]);
  });

  test('every founding institution carries an authored identity', () => {
    const missing = FOUNDING_NAMES.filter((n) => !(n in INSTITUTION_IDENTITY));
    expect(missing, `founding institutions with no identity: ${missing.join(', ')}`).toEqual([]);
  });

  test('all moral leans are signed and in range [-1, 1]', () => {
    for (const [name, lean] of Object.entries(INSTITUTION_MORAL_LEAN)) {
      expect(Number.isFinite(lean.cruelty), name).toBe(true);
      expect(Number.isFinite(lean.disorder), name).toBe(true);
      expect(lean.cruelty).toBeGreaterThanOrEqual(-1);
      expect(lean.cruelty).toBeLessThanOrEqual(1);
      expect(lean.disorder).toBeGreaterThanOrEqual(-1);
      expect(lean.disorder).toBeLessThanOrEqual(1);
    }
  });
});

describe('institutionVocabulary — tag maps + badge derivation', () => {
  for (const [label, map] of Object.entries(ARRAY_MAPS)) {
    test(`${label}: every value is a non-empty array of non-empty strings`, () => {
      for (const [name, arr] of Object.entries(map)) {
        expect(Array.isArray(arr), name).toBe(true);
        expect(arr.length, name).toBeGreaterThan(0);
        for (const t of arr) {
          expect(typeof t, name).toBe('string');
          expect(t.length, name).toBeGreaterThan(0);
        }
      }
    });
  }

  test('badgeForInstitution returns a non-empty label for every catalog institution', () => {
    for (const inst of INSTANCES.values()) {
      const badge = badgeForInstitution(inst);
      expect(typeof badge, inst.name).toBe('string');
      expect(badge.length, inst.name).toBeGreaterThan(0);
    }
  });

  test('badge overrides win over the group default', () => {
    expect(badgeForInstitution({ name: 'Almshouse', category: 'Religious' })).toBe('Charity');
    expect(badgeForInstitution({ name: 'Slave market', category: 'Economy' })).toBe('Bondage');
    expect(badgeForInstitution({ name: 'Tannery', category: 'Crafts' })).toBe('Craft'); // group default
    expect(badgeForInstitution({ name: 'Utterly Custom Thing' })).toBe('Institution'); // fallback
  });
});
