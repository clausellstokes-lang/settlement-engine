/**
 * tests/generators/serviceRollDeclared.test.js — CENSUS-1f unit 1c, Appendix B site 15 (R): a
 * service that survived its rolls is resolved through `drawDeclared` against the declaration
 * CENSUS-4c placed on its definition; a refused row takes its desc's walls twin where it has one,
 * else it is not materialized. No roll moves (the resolution runs after them).
 *
 * @enforced-by npx vitest run tests/generators/serviceRollDeclared.test.js
 */
import { describe, expect, it } from 'vitest';
import { resolveServiceRow } from '../../src/generators/services/serviceRollMaterialization.js';
import { factsOf } from '../../src/domain/facts/factsOf.js';
import { CALM_FACTS_ADMIT_ALL } from '../helpers/calmFactsDouble.js';

const ADMIT_ALL = { ...CALM_FACTS_ADMIT_ALL, guild: true, tier: 'city', terrain: 'forest', crime: 'organized' };
/** No walls, no gate, no watch: an open village. */
const OPEN = factsOf({ institutions: [], tier: 'village', config: {} });
/** A watch, no walls. */
const WATCHED = factsOf({ institutions: [{ name: 'Town watch', category: 'Defense' }], tier: 'town', config: {} });

const GATE_DUTY = { name: 'Gate duty', desc: 'Check travelers entering and leaving. Note unusual visitors.', needs: ['gate'], svcKey: 'Town watch' };
const PUBLIC_WORKS = { name: 'Public works', desc: 'Walls, wells, roads, and the watch', needs: ['walls', 'watch'], svcKey: 'Town council' };

describe('the service roll resolves through drawDeclared (CENSUS-1f, site 15)', () => {
  it('a declared service the record refuses is not materialized', () => {
    expect(resolveServiceRow(GATE_DUTY, OPEN)).toBeNull();
  });

  it('a refused walls service takes its twin desc where the record admits the twin', () => {
    const row = resolveServiceRow(PUBLIC_WORKS, WATCHED);
    expect(row?.name).toBe('Public works');
    expect(row?.desc).toBe('Wells, roads and the common ground');
  });

  it('an admitted service is the same object (byte witness); an undeclared one needs no facts', () => {
    expect(resolveServiceRow(GATE_DUTY, ADMIT_ALL)).toBe(GATE_DUTY);
    const plain = { name: 'Bread', desc: 'Loaves.' };
    expect(resolveServiceRow(plain, null)).toBe(plain);
  });

  it('a custom service is never touched', () => {
    const custom = { name: 'Gate duty', desc: 'x', needs: ['gate'], custom: true };
    expect(resolveServiceRow(custom, OPEN)).toBe(custom);
  });
});
