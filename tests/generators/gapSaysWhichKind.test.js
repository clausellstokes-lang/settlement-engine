/**
 * tests/generators/gapSaysWhichKind.test.js — REVIEW-INTAKE-3 R9 (unit 4b): "a gap says which
 * kind".
 *
 * `resourceGenerator.js :: evaluateInstitutionChain` wrote "X exists but lacks access to Y"
 * whenever Y's chain was not ACTIVE here (terrain allows it AND it was rolled nearby), reading
 * none of the record's own supply evidence. It now classifies each would-be line against the
 * record: the input is held LOCALLY (the non-depleted nearby roster, the economy's
 * `localProduction`, or a local producer per `localInstitutionSupplies`) — no line, the
 * activation mismatch is not a gap; IMPORTED (the economy's `primaryImports`, or for grain the
 * food record's import share) — written as `kind: 'imported'`, "runs on imported Y"; neither —
 * `kind: 'missing'`, the line as before.
 *
 * Red-first per class on the planted rosters below and on READER R1's named births
 * (`soak-review/corpus.mjs :: birth`), whose TRUE gaps (the potter's and the brickmaker's clay,
 * the vintner's grapes, the sawmill's timber) must stay written as missing.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateResourceAnalysis } from '../../src/generators/resourceGenerator.js';
import { birth, ensureLaws } from '../../scripts/audit/soak-review/corpus.mjs';

const LACKS = /exists but lacks access to/;
const potterOn = (economicState) => generateResourceAnalysis('desert', [], [], [{ name: 'Potter' }], {}, economicState);
const clayLines = (analysis) => (analysis.gaps || []).filter((g) => g.institution === 'Potter' && g.chain === 'clay');

describe('a gap says which kind — planted on one roster (a desert Potter, no clay rolled)', () => {
  it('missing: no record of clay anywhere is written as kind missing, the line as before', () => {
    const lines = clayLines(potterOn({ primaryImports: [], localProduction: [] }));
    expect(lines).toHaveLength(1);
    expect(lines[0].kind).toBe('missing');
    expect(lines[0].impact).toMatch(LACKS);
  });

  it('imported: clay on the economy\'s imports is written as kind imported, the house running on it', () => {
    const lines = clayLines(potterOn({ primaryImports: ['Clay (river barges)'], localProduction: [] }));
    expect(lines).toHaveLength(1);
    expect(lines[0].kind).toBe('imported');
    expect(lines[0].impact).toBe('Potter runs on imported clay');
    expect(lines[0].impact).not.toMatch(LACKS);
  });

  it('local: clay the economy produces here is no gap, so no line is written', () => {
    expect(clayLines(potterOn({ primaryImports: ['Clay'], localProduction: ['clay'] }))).toEqual([]);
  });

  it('grain: the food record\'s import share answers imported; a local farm answers local', () => {
    const mill = (institutions, foodSecurity) => generateResourceAnalysis('desert', [], [], institutions, {},
      { primaryImports: [], localProduction: [], foodSecurity })
      .gaps.filter((g) => g.institution === 'Mill' && g.chain === 'grain');
    expect(mill([{ name: 'Mill' }], { importPct: 0 }).map((g) => g.kind)).toEqual(['missing']);
    expect(mill([{ name: 'Mill' }], { importPct: 17 }).map((g) => g.kind)).toEqual(['imported']);
    expect(mill([{ name: 'Mill' }, { name: 'Subsistence farming' }], { importPct: 17 })).toEqual([]);
  });
});

describe('a gap says which kind — READER R1\'s named births', () => {
  /** @type {Map<number, Array<{institution: string, chain: string, kind?: string, impact: string}>>} */
  const lines = new Map();
  beforeAll(async () => {
    await ensureLaws();
    for (const i of [0, 4, 8, 12, 22, 24]) {
      const { settlement } = birth(i);
      lines.set(i, (settlement.resourceAnalysis?.gaps || []).filter((g) => g.institution));
    }
  }, 120_000);
  const at = (i, institution, chain) => (lines.get(i) || [])
    .filter((g) => g.institution === institution && g.chain === chain);

  it('local: the grain the place grows or a farm supplies is no longer written as lacking', () => {
    for (const [i, house] of [[0, 'Access to external mill'], [12, 'Access to external mill'],
      [24, 'Access to external mill'], [8, 'Mill']]) {
      expect(at(i, house, 'grain'), `soak1k-${i} ${house} -> grain`).toEqual([]);
    }
    expect(at(8, 'Dairy farmer', 'livestock'), 'soak1k-8: the dairy\'s herds are rolled nearby').toEqual([]);
  });

  it('imported: the smelter\'s iron ore and the city bakers\' grain run on imports', () => {
    for (const [i, house, good] of [[4, 'Smelter', 'iron ore'], [22, 'Smelter', 'iron ore'],
      [4, 'Bakers (5-15)', 'grain'], [22, 'Bakers (5-15)', 'grain']]) {
      const hit = at(i, house, good);
      expect(hit.map((g) => g.kind), `soak1k-${i} ${house} -> ${good}`).toEqual(['imported']);
      expect(hit[0].impact).toContain(`runs on imported ${good}`);
    }
  });

  it('missing: the TRUE gaps stay written — the potter\'s and brickmaker\'s clay, the vintner\'s grapes, the sawmill\'s timber', () => {
    for (const [i, house, good] of [[4, 'Potter', 'clay'], [4, 'Brickmaker', 'clay'],
      [4, 'Vintner', 'grapes'], [8, 'Sawmill', 'timber']]) {
      const hit = at(i, house, good);
      expect(hit.map((g) => g.kind), `soak1k-${i} ${house} -> ${good}`).toEqual(['missing']);
      expect(hit[0].impact).toMatch(LACKS);
    }
  });
});
