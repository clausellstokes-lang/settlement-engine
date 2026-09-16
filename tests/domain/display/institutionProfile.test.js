/**
 * institutionProfile.test.js — Wave E / batch E2.
 *
 * deriveInstitutionProfile pulls an institution's identity from the settlement's
 * REAL generated data. These pins run it over two fully generated settlements and
 * assert the shape + honesty of what it derives:
 *   - name echoes the institution; oneLiner is the Phase 5 authored identity from
 *     the vocabulary side-car (a clean, non-empty string for catalog institutions)
 *     or null for content with no authored identity (never fabricated);
 *   - every contribution is one of the four real domains with non-empty label+detail;
 *   - the derivation actually fires (some institutions gain contributions), and the
 *     defence/economy/power signals map to the settlement's own structures.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import {
  deriveInstitutionProfile, resolveInstitutionByName,
} from '../../../src/domain/display/institutionProfile.js';
import { INSTITUTION_IDENTITY } from '../../../src/domain/display/institutionVocabulary.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });
const DOMAINS = new Set(['economy', 'defense', 'power', 'services']);

const CASES = [
  { label: 'city', settlement: gen({ settType: 'city', terrain: 'river', tradeRouteAccess: 'road' }, 'inst-profile-city') },
  { label: 'village', settlement: gen({ settType: 'village', terrain: 'grassland', tradeRouteAccess: 'road' }, 'inst-profile-village') },
];

describe('deriveInstitutionProfile — shape + honesty', () => {
  for (const { label, settlement } of CASES) {
    test(`${label}: every profile is well-formed and oneLiner is authored-or-null`, () => {
      const insts = settlement.institutions || [];
      expect(insts.length).toBeGreaterThan(0);
      let authored = 0;
      for (const inst of insts) {
        const p = deriveInstitutionProfile(inst, settlement);
        expect(p.name).toBe(inst.name);
        // oneLiner is the authored identity or null — never fabricated. When
        // present it is the exact vocabulary string for this institution.
        if (p.oneLiner === null) {
          expect(INSTITUTION_IDENTITY[inst.name]).toBeUndefined();
        } else {
          expect(typeof p.oneLiner).toBe('string');
          expect(p.oneLiner.length).toBeGreaterThan(0);
          expect(p.oneLiner).toBe(INSTITUTION_IDENTITY[inst.name]);
          expect(/[—–]/.test(p.oneLiner)).toBe(false); // no em-dashes (F24)
          authored += 1;
        }
      }
      // Catalog institutions all carry an authored identity — the wiring fires.
      expect(authored).toBeGreaterThan(insts.length / 2);
      expect(Array.isArray(deriveInstitutionProfile(insts[0], settlement).contributions)).toBe(true);
      for (const inst of insts) {
        for (const c of deriveInstitutionProfile(inst, settlement).contributions) {
          expect(DOMAINS.has(c.domain)).toBe(true);
          expect(typeof c.label).toBe('string');
          expect(c.label.length).toBeGreaterThan(0);
          expect(typeof c.detail).toBe('string');
          expect(c.detail.length).toBeGreaterThan(0);
        }
      }
    });

    test(`${label}: a custom institution with no authored identity resolves oneLiner null`, () => {
      const custom = { name: 'The Broken Wheel Meetinghouse', priorityCategory: 'economy', tags: ['trade'] };
      expect(deriveInstitutionProfile(custom, settlement).oneLiner).toBeNull();
    });

    test(`${label}: the derivation fires for a real share of institutions`, () => {
      const insts = settlement.institutions || [];
      const withContrib = insts.filter((i) => deriveInstitutionProfile(i, settlement).contributions.length > 0);
      // Most institutions carry at least one real signal (economy/power/defence/services).
      expect(withContrib.length).toBeGreaterThan(insts.length / 2);
    });
  }

  test('defence institutions surface a defence contribution grounded in defenseProfile', () => {
    const { settlement } = CASES[0]; // city
    const buckets = settlement.defenseProfile?.institutions || {};
    const defenseNames = new Set(Object.values(buckets).flat().map((i) => i && i.name).filter(Boolean));
    expect(defenseNames.size).toBeGreaterThan(0);
    for (const inst of settlement.institutions || []) {
      if (!defenseNames.has(inst.name)) continue;
      const p = deriveInstitutionProfile(inst, settlement);
      expect(p.contributions.some((c) => c.domain === 'defense')).toBe(true);
    }
  });

  test('resolveInstitutionByName tolerates count-suffix / casing drift', () => {
    const { settlement } = CASES[0];
    const guild = (settlement.institutions || []).find((i) => /guild/i.test(i.name || ''));
    if (guild) {
      // Strip a parenthetical count and lowercase — still resolves to the same object.
      const stripped = guild.name.replace(/\s*\([^)]*\)\s*/g, '').toLowerCase();
      expect(resolveInstitutionByName(stripped, settlement)).toBe(guild);
    }
    expect(resolveInstitutionByName('a name that is not here', settlement)).toBeNull();
  });
});
