/**
 * npcIndexZeroHome.test.js — PEOPLE-1 B1c (2026-11-20; the chair's ruling of 20:30 UTC, "ONE HOME FOR EVERY INDEX 0"):
 * a pooled row's index 0 is the writer's own `T` line, and it has ONE home, the writer's table (`generators/npcStructure.js`).
 *   1. `data/npcStructureVariants.js` holds no text equal to any `T` line (position or constraint): neither a row of
 *      `POSITION_VARIANTS` / `CONSTRAINT_VARIANTS` nor a string literal of the file.
 *   2. `pooledLineOf` composes the pool it resolves as [the `T` row's own line, ...the data pool] for every pooled key: the
 *      list handed to `filterDeclared` (ledger pool `NPC_STRUCTURE.<T key>`) is, at index 0, the `T` row's line byte for
 *      byte, and after it the data pool's own rows in their order (so every sibling keeps its index, and the gates' `#n` keys
 *      and the ledger's `lineId` stand).
 */
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it, vi } from 'vitest';

/** every list `pooledLineOf` hands to `filterDeclared`, with its ledger pool id */
const HANDED = /** @type {Array<{ poolId: string, list: ReadonlyArray<unknown> }>} */ ([]);
vi.mock('../../../src/domain/facts/drawDeclared.js', async (importOriginal) => {
  const actual = /** @type {Record<string, any>} */ (await importOriginal());
  return {
    ...actual,
    filterDeclared: (/** @type {ReadonlyArray<unknown>} */ list, /** @type {Record<string, any>} */ options) => {
      if (String(options?.poolId || '').startsWith('NPC_STRUCTURE.')) HANDED.push({ poolId: options.poolId, list: [...list] });
      return actual.filterDeclared(list, options);
    },
  };
});

const { POSITION_VARIANTS, CONSTRAINT_VARIANTS, POSITION_POOL_OF } = await import('../../../src/data/npcStructureVariants.js');
const { enrichNPCsWithStructure } = await import('../../../src/generators/npcStructure.js');

// the writer's own table, SLICED FROM ITS FILE and evaluated (never retyped; `npcPositionPools.test.js`'s method)
const WRITER = readFileSync(new URL('../../../src/generators/npcStructure.js', import.meta.url), 'utf8');
const DATA = readFileSync(new URL('../../../src/data/npcStructureVariants.js', import.meta.url), 'utf8');
const cut = (/** @type {string} */ from, /** @type {string} */ to) => { const a = WRITER.indexOf(from); const b = WRITER.indexOf(to, a); if (a < 0 || b < 0) throw new Error(`slice ${from}`); return WRITER.slice(a, b); };
const TABLE = [cut('const GOVERNANCE_FRACTURED', 'function getPrimaryCondition'), cut('const T = {};', '// ── Score NPCs'), 'export { T };'].join('\n');
/** @type {Record<string, { position: string, constraint: string }>} */
let T = {};
beforeAll(async () => {
  T = (await import(/* @vite-ignore */ `data:text/javascript;base64,${Buffer.from(TABLE).toString('base64')}`)).T;
});

/** the source spellings of a line as a string literal */
const literals = (/** @type {string} */ s) => [`'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`, `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`, `\`${s}\``];

describe('PEOPLE-1 B1c · one home for every index 0', () => {
  it('the data file holds no text equal to any T line', () => {
    const lines = new Set(Object.values(T).flatMap((r) => [r.position, r.constraint]));
    expect(lines.size, 'premise: the writer\'s table is read').toBeGreaterThan(100);
    const rows = [...Object.entries(POSITION_VARIANTS), ...Object.entries(CONSTRAINT_VARIANTS)].flatMap(([key, pool]) => pool.map((r, i) => ({ key, i, text: r.text })));
    expect(rows.filter((r) => lines.has(r.text)).map((r) => `${r.key}[${r.i}]: ${r.text}`)).toEqual([]);
    expect([...lines].filter((l) => literals(l).some((q) => DATA.includes(q)))).toEqual([]);
  });

  it('every pooled key\'s composed index 0 IS the T row, byte for byte, and the data pool follows it in order', () => {
    const head = (/** @type {string} */ category, /** @type {number} */ rank, /** @type {string} */ id) => ({ id, name: `${id} Hale`, role: 'Reeve', category, memberships: [{ power: 'Seat', rank, share: 1 }], goal: { short: 'g', long: 'g' }, institution: { kind: 'house', key: 'Town Watch' } });
    const CONDITIONS = /** @type {Record<string, Record<string, any>>} */ ({
      governance_fractured: { publicLegitimacy: { governanceFractured: true } }, contested: { publicLegitimacy: { isContested: true } },
      economic_stress: {}, corruption: { criminalCaptureState: 'corrupted' }, food_crisis: {}, stable: {},
    });
    const keys = [...new Set([...Object.keys(POSITION_VARIANTS), ...Object.keys(CONSTRAINT_VARIANTS), ...Object.keys(POSITION_POOL_OF)])];
    HANDED.length = 0;
    for (const key of keys) {
      const [category, condition, rank] = key.split('__');
      const seatCategory = category === 'other' ? 'noble' : category;
      const place = {
        _seed: `b1c-${key}`, tier: 'city', population: 30000, stress: [], institutions: [], config: {},
        powerStructure: {
          factions: category === 'government'
            ? [{ faction: 'Seat', category, power: 60, isGoverning: true }]
            : [{ faction: 'Council', category: 'government', power: 60, isGoverning: true }, { faction: 'Seat', category: seatCategory, power: 60 }],
          criminalCaptureState: 'none', ...CONDITIONS[condition],
        },
        economicState: { prosperity: condition === 'economic_stress' ? 'Struggling' : 'Comfortable', foodSecurity: { label: condition === 'food_crisis' ? 'Famine' : '' }, primaryExports: ['Raw wool'], primaryImports: ['Iron'] },
      };
      const cards = rank === 'dominant' ? [head(category, 1, 'a'), head(category, 3, 'b'), head(category, 3, 'c')] : [head(category, 3, 'a'), head(category, 3, 'b'), head(category, 1, 'c')];
      enrichNPCsWithStructure(cards, place);
    }
    const misses = [];
    /** @type {Set<string>} */ const reached = new Set();
    for (const { poolId, list } of HANDED) {
      const looked = poolId.slice('NPC_STRUCTURE.'.length);
      const poolKey = POSITION_POOL_OF[looked] || looked;
      const tail = list.slice(1);
      const field = POSITION_VARIANTS[poolKey] && tail.length === POSITION_VARIANTS[poolKey].length && tail.every((r, i) => r === POSITION_VARIANTS[poolKey][i]) ? 'position'
        : CONSTRAINT_VARIANTS[poolKey] && tail.length === CONSTRAINT_VARIANTS[poolKey].length && tail.every((r, i) => r === CONSTRAINT_VARIANTS[poolKey][i]) ? 'constraint' : null;
      if (!field) { misses.push(`${looked}: the list after index 0 is not the data pool ${poolKey} in its order`); continue; }
      reached.add(`${field}:${poolKey}`);
      if (list[0] !== T[looked]?.[field]) misses.push(`${looked}.${field}: index 0 is ${JSON.stringify(list[0])}, not the T row ${JSON.stringify(T[looked]?.[field])}`);
    }
    expect(misses).toEqual([]);
    const pooled = [...Object.keys(POSITION_VARIANTS).map((k) => `position:${k}`), ...Object.keys(CONSTRAINT_VARIANTS).map((k) => `constraint:${k}`)];
    expect(pooled.filter((k) => !reached.has(k)), 'premise: the constructed places reach every pooled key').toEqual([]);
  });
});
