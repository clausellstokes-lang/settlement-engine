/**
 * tests/data/canonicalRowsDeclared.test.js — CENSUS-3f unit 3: the seven canonical v0 rows of
 * DS-ECO-3 / -6 / -7 (CENSUS-3d's table) declare through the projector's tag slot (CENSUS-1f unit
 * 5c, `48189488b`). The annex carries the slot; the generated leaf is the receipt (never hand-edited,
 * R-D). Three rows presume a fact (the markets ×2, the guild fees ×1); the other four presume nothing
 * beyond their key (ADEQUATE's pool is `{crisis-scoped}`, so its silence already reads calm; the
 * minor-shadow row and the two frozen freshness sentences name no fact).
 *
 * @enforced-by npx vitest run tests/data/canonicalRowsDeclared.test.js
 */
import { describe, expect, it } from 'vitest';
import { DOSSIER_STATE_PROSE_ECONOMY as E } from '../../src/data/dossierStateProse/economy.generated.js';

const canonical = (block, pool) => {
  const p = E[block].pools[pool];
  const rows = (Array.isArray(p) ? p : p.variants).filter((v) => v.angle === 'canonical');
  expect(rows).toHaveLength(1);
  return rows[0];
};

describe('the seven canonical v0 rows declare through the tag slot (CENSUS-3f unit 3)', () => {
  it.each([
    ['DS-ECO-3', 'SHORTAGE × trade-dependent', ['market']],
    ['DS-ECO-3', 'SURPLUS × trade-dependent', ['market']],
    ['DS-ECO-6', 'TIER: significant off-book activity (≥15)', ['guild']],
  ])('%s %s declares %j', (block, pool, marks) => {
    const row = canonical(block, pool);
    expect(row.vid).toBe(0);
    expect(row.marks).toEqual(marks);
  });

  it.each([
    ['DS-ECO-3', 'ADEQUATE'],
    ['DS-ECO-6', 'TIER: minor shadow activity (≥3)'],
    ['DS-ECO-7', 'TALLIES'],
    ['DS-ECO-7', 'CATALOG'],
  ])('%s %s presumes nothing beyond its key (no slot)', (block, pool) => {
    expect(canonical(block, pool).marks ?? []).toEqual([]);
  });

  it('the slot never reaches the text', () => {
    for (const [b, p] of [['DS-ECO-3', 'SHORTAGE × trade-dependent'], ['DS-ECO-3', 'SURPLUS × trade-dependent'], ['DS-ECO-6', 'TIER: significant off-book activity (≥15)']]) {
      expect(canonical(b, p).text).not.toMatch(/[`[\]]/);
    }
  });
});
