/**
 * institutionProfile.test.js — Wave E / batch E2.
 *
 * deriveInstitutionProfile pulls an institution's identity from the settlement's
 * REAL generated data. These pins run it over two fully generated settlements and
 * assert the shape + honesty of what it derives:
 *   - name echoes the institution; oneLiner is ALWAYS null (Phase 5 authors copy —
 *     we invent none);
 *   - every contribution is one of the four real domains with non-empty label+detail;
 *   - the derivation actually fires (some institutions gain contributions), and the
 *     defence/economy/power signals map to the settlement's own structures.
 */

import { describe, test, expect } from 'vitest';
import { generateSettlementPipeline } from '../../../src/generators/generateSettlementPipeline.js';
import {
  deriveInstitutionProfile, resolveInstitutionByName,
} from '../../../src/domain/display/institutionProfile.js';

const gen = (config, seed) => generateSettlementPipeline(config, null, { seed, customContent: {} });
const DOMAINS = new Set(['economy', 'defense', 'power', 'services']);

const CASES = [
  { label: 'city', settlement: gen({ settType: 'city', terrain: 'river', tradeRouteAccess: 'road' }, 'inst-profile-city') },
  { label: 'village', settlement: gen({ settType: 'village', terrain: 'grassland', tradeRouteAccess: 'road' }, 'inst-profile-village') },
];

describe('deriveInstitutionProfile — shape + honesty', () => {
  for (const { label, settlement } of CASES) {
    test(`${label}: every profile is well-formed and oneLiner stays null`, () => {
      const insts = settlement.institutions || [];
      expect(insts.length).toBeGreaterThan(0);
      for (const inst of insts) {
        const p = deriveInstitutionProfile(inst, settlement);
        expect(p.name).toBe(inst.name);
        expect(p.oneLiner).toBeNull(); // no fabricated copy
        expect(Array.isArray(p.contributions)).toBe(true);
        for (const c of p.contributions) {
          expect(DOMAINS.has(c.domain)).toBe(true);
          expect(typeof c.label).toBe('string');
          expect(c.label.length).toBeGreaterThan(0);
          expect(typeof c.detail).toBe('string');
          expect(c.detail.length).toBeGreaterThan(0);
        }
      }
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
