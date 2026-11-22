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
  // LANDING-R2 seat E: the four tables below run as plain parameterless tests, each row labelled
  // (the lighting census credits a table read inside the body, never an `each` callback).
  it('the three declaring canonical rows: v0, with their marks', () => {
    for (const [block, pool, marks] of [
      ['DS-ECO-3', 'SHORTAGE × trade-dependent', ['market']],
      ['DS-ECO-3', 'SURPLUS × trade-dependent', ['market']],
      ['DS-ECO-6', 'TIER: significant off-book activity (≥15)', ['guild']],
    ]) {
      const row = canonical(block, pool);
      expect(row.vid, `${block} ${pool}`).toBe(0);
      expect(row.marks, `${block} ${pool} declares ${JSON.stringify(marks)}`).toEqual(marks);
    }
  });

  it('the four canonical rows that presume nothing beyond their key: marked colour (R-AO, CENSUS-3g unit 3)', () => {
    for (const [block, pool] of [
      ['DS-ECO-3', 'ADEQUATE'],
      ['DS-ECO-6', 'TIER: minor shadow activity (≥3)'],
      ['DS-ECO-7', 'TALLIES'],
      ['DS-ECO-7', 'CATALOG'],
    ]) {
      expect(canonical(block, pool).marks, `${block} ${pool}`).toEqual(['colour']);
    }
  });

  // CENSUS-3g unit 3 (R-AO): the lines this lane read in its mixed pools and found presuming nothing
  // carry the per-line `colour` mark; the five that presume a fact with no declaration yet stay
  // unmarked (an unread or presuming line is never marked).
  const variants = (leaf, block, pool) => { const p = leaf[block].pools[pool]; return Array.isArray(p) ? p : p.variants; };
  it('the read lines of the mixed pools: exactly the listed vids are marked colour', () => {
    for (const [block, pool, vids] of [
      ['DS-ECO-1', 'COMBINATION C2: a high rung on a narrow approach (isolated / mountain_pass)', [2, 3]],
      ['DS-ECO-4', 'HIGHLIGHT: cheap', [1, 2, 4]],
      ['DS-ECO-6', 'TIER: a large share off the books (≥30)', [1, 2, 3]],
      ['DS-ECO-7', 'TALLIES', [0, 1, 2, 3]],
      ['DS-SUP-1', 'COMPLETE LINE, output exported', [1, 3]],
    ]) {
      for (const v of variants(E, block, pool)) expect(v.marks?.includes('colour') ?? false, `${block} ${pool} v${v.vid}`).toBe(vids.includes(v.vid));
    }
  });
  it('the four lines that presume a fact: not marked', () => {
    for (const [block, pool, vid] of [
      ['DS-ECO-1', 'COMBINATION C4: a low rung on a working approach', 2],
      ['DS-ECO-2', 'FOOD: deficit', 1],
      ['DS-ECO-8', 'COMFORTABLE', 3],
      ['DS-ECO-11', 'EXPLOITATION: fullyExploited', 1],
    ]) {
      const v = variants(E, block, pool).find((x) => x.vid === vid);
      expect(v.marks?.includes('colour') ?? false, `${block} ${pool} v${vid}`).toBe(false);
    }
  });

  // CENSUS-3g unit 2 (the chair's answer 1 / R-AR's second block): the dm-only v4 of the large-share
  // tier presumes guilds exactly as the significant tier's canonical row does (R-AD: a DM reads it as
  // a fact), so it declares `guild` now.
  it('DS-ECO-6 large share v4 ("The guilds are losing their grip…") declares guild', () => {
    const p = E['DS-ECO-6'].pools['TIER: a large share off the books (≥30)'];
    const v4 = (Array.isArray(p) ? p : p.variants).find((v) => v.vid === 4);
    expect(v4.text).toMatch(/^The guilds are losing their grip/);
    expect(v4.marks).toEqual(['dm-only', 'guild']);
  });

  it('the slot never reaches the text', () => {
    for (const [b, p] of [['DS-ECO-3', 'SHORTAGE × trade-dependent'], ['DS-ECO-3', 'SURPLUS × trade-dependent'], ['DS-ECO-6', 'TIER: significant off-book activity (≥15)']]) {
      const text = canonical(b, p).text;
      expect(text, `${b} :: ${p}`).toMatch(/\w{4}/);
      expect(text).not.toMatch(/[`[\]]/); // anchored: the line above proves the canonical line carries text
    }
  });
});
