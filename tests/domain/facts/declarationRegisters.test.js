/**
 * tests/domain/facts/declarationRegisters.test.js — CENSUS-1d unit 3: THE DECLARATION REGISTERS
 * and their walkers (`docs/DESIGN_POOL_CENSUS.md` §3.5; `src/domain/facts/declarationRegisters.js`).
 *
 *   1. THE UNDECLARED-LINES REGISTER (`tests/lint/undeclaredLines.register.json`), SHRINK-ONLY:
 *      a pool's undeclared count may never RISE and a new undeclared pool may not appear
 *      unpinned; a count that FELL (a lane declared lines) reds by name until the register is
 *      re-taken in the same commit. Its `needsAField` rows (a line that presumes a fact the
 *      record does not carry: season, climate, technology — the chair's ruling 8 and R-M) stay
 *      listed and name no atom of the vocabulary.
 *   2. THE CRISIS-SCOPED REGISTER (`tests/lint/crisisScopedPools.register.json`), GROW-ONLY:
 *      every pinned pool is still `{crisis-scoped}` (a pool leaving needs the chair's note, which
 *      is a commit that edits the register by hand), and every opted pool is pinned.
 *
 * Re-take both after a declaration lands (never by hand for the counts):
 *   RETAKE_DECLARATION_REGISTERS=1 npx vitest run tests/domain/facts/declarationRegisters.test.js
 * The `needsAField` rows and a crisis-scoped pool's removal are the only hand edits.
 *
 * @enforced-by npx vitest run tests/domain/facts/declarationRegisters.test.js
 */
import { describe, expect, it } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../../src/data/dossierStateProse/warFaith.generated.js';
import {
  statePoolCounts, undeclaredRows, crisisScopedRows, compareUndeclared, variantDeclares,
} from '../../../src/domain/facts/declarationRegisters.js';
import { parseAtom } from '../../../src/domain/facts/factVocabulary.js';

const LEAVES = [
  DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_GENERAL,
  DOSSIER_STATE_PROSE_POWER, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_WAR_FAITH,
];
const UNDECLARED = resolve(process.cwd(), 'tests', 'lint', 'undeclaredLines.register.json');
const SCOPED = resolve(process.cwd(), 'tests', 'lint', 'crisisScopedPools.register.json');

const counts = statePoolCounts(LEAVES);
const read = (/** @type {string} */ p) => JSON.parse(readFileSync(p, 'utf8'));

if (process.env.RETAKE_DECLARATION_REGISTERS) {
  const held = read(UNDECLARED);
  writeFileSync(UNDECLARED, `${JSON.stringify({ ...held, statePools: undeclaredRows(counts) }, null, 2)}\n`);
  const scoped = read(SCOPED);
  writeFileSync(SCOPED, `${JSON.stringify({ ...scoped, pools: crisisScopedRows(counts) }, null, 2)}\n`);
}

describe('the reading', () => {
  it('a line declares by a fact atom or a fact mark word (R-O), never by a state word or the audience mark', () => {
    expect(variantDeclares({ marks: ['walls'] })).toBe(true);
    expect(variantDeclares({ marks: ['no threat'] })).toBe(true);
    expect(variantDeclares({ marks: ['market'] })).toBe(true);
    expect(variantDeclares({ marks: ['crisis: famine'] })).toBe(true);
    expect(variantDeclares({ marks: ['major', 'deficit', 'anchored', 'dm-only'] })).toBe(false);
    expect(variantDeclares({ marks: [] })).toBe(false);
  });

  it('a {colour} pool and a pool that declares for its lines owe no undeclared row', () => {
    const leaf = { B: {
      pools: { a: [{ marks: [] }, { marks: ['walls'] }], b: [{ marks: [] }], c: [{ marks: [] }], d: [{ marks: [] }] },
      poolMeta: { b: { colour: true }, c: { crisisScoped: true }, d: { declares: ['market'] } },
    } };
    expect(undeclaredRows(statePoolCounts([leaf]))).toEqual({ 'B::a': 1 });
    expect(crisisScopedRows(statePoolCounts([leaf]))).toEqual(['B::c']);
  });

  it('reads every pool of the corpus (the wiring census\'s pools)', () => {
    const ids = Object.keys(counts);
    expect(ids.length).toBe(new Set(ids).size);
    expect(ids.length).toBeGreaterThan(700);
    const lines = Object.values(counts).reduce((n, c) => n + c.lines, 0);
    const declaring = Object.values(counts).reduce((n, c) => n + c.declaring, 0);
    expect(declaring).toBeGreaterThan(0);
    expect(declaring).toBeLessThanOrEqual(lines);
  });
});

describe('THE UNDECLARED-LINES REGISTER — shrink-only', () => {
  const register = read(UNDECLARED);

  it('no pool\'s undeclared count rose, and no undeclared pool appeared unpinned', () => {
    const { rose, added } = compareUndeclared(undeclaredRows(counts), register.statePools);
    expect({ rose, added }).toEqual({ rose: [], added: [] });
  });

  it('a count that fell is re-pinned in the same commit (the register is never left stale)', () => {
    const { fell, gone } = compareUndeclared(undeclaredRows(counts), register.statePools);
    expect({ fell, gone }).toEqual({ fell: [], gone: [] });
  });

  it('the "needs a field" rows stay listed, each naming a fact no atom answers', () => {
    expect(Array.isArray(register.needsAField)).toBe(true);
    expect(register.needsAField.length).toBeGreaterThan(0);
    for (const row of register.needsAField) {
      expect(typeof row.where).toBe('string');
      expect(typeof row.presumes).toBe('string');
      expect(parseAtom(row.presumes)).toBeNull();
    }
  });
});

describe('THE CRISIS-SCOPED REGISTER — grow-only', () => {
  const register = read(SCOPED);
  const now = crisisScopedRows(counts);

  it('every pinned pool is still {crisis-scoped} (a pool leaving needs the chair\'s note)', () => {
    expect(register.pools.filter((/** @type {string} */ id) => !now.includes(id))).toEqual([]);
  });

  it('every opted pool is pinned', () => {
    expect(now.filter((id) => !register.pools.includes(id))).toEqual([]);
  });
});
