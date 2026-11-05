/**
 * CENSUS-2d unit 3 — the off-census tables carry the ledger's declarations (Phase A's
 * `docs/census/declarations/<TABLE>.json`; `docs/DESIGN_POOL_CENSUS.md` §3.1, the sibling column;
 * the chair's R-C). Each declaring ledger line is found at its path in the LIVE table, its text is
 * the ledger's verbatim, and its row declares exactly what the ledger says under this lane's
 * reading of the rulings:
 *   - a pool keyed on a crisis does not re-declare its key (R-B1);
 *   - in a `{crisis-scoped}` pool `calm` is silence and `any` is written; outside one, `any` is
 *     noise and is not written;
 *   - Phase A's spellings map onto the vocabulary (`deficit` → `starving`, `>=` → `≥`).
 * Every atom written must be declarable (a home exists: R-E). An R/H/T consumer whose site is not
 * wired reads its row through `textOf` (R-C), so carrying a declaration moves no birth.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { declarationOf, assertDeclarable } from '../../../src/domain/facts/factVocabulary.js';
import { textOf } from '../../../src/domain/facts/textOf.js';
import { STRESS_DESCS } from '../../../src/data/narrativeData.js';

const ledger = (name) => JSON.parse(readFileSync(new URL(`../../../docs/census/declarations/${name}.json`, import.meta.url), 'utf8'));

/** @param {string} a */
const norm = (a) => a.replace(/^deficit$/, 'starving').replace(/^other-npc$/, 'other npc').replace(/>=/g, '≥').replace(/<=/g, '≤').trim();

/** the declaration a ledger line carries under this lane's reading (see the header) */
export function expectedDeclaration(pool, line) {
  const key = new Set(pool.poolCrisis || []);
  const keyed = key.size > 0;
  const c = line.crisis;
  let crisis = [];
  if (Array.isArray(c)) crisis = keyed && c.some((v) => key.has(v)) ? [] : c.filter((v) => v !== 'calm');
  else if (c === 'any' && pool.crisisScoped && !keyed) crisis = ['any'];
  if (Array.isArray(c) && c.includes('calm') && crisis.length) crisis.push('calm');
  return { needs: (line.needs || []).map(norm), excludes: (line.excludes || []).map(norm), crisis };
}

/** @param {string} id */
const parseLineId = (id) => {
  const out = []; const re = /([^.[\]]+)|\[(\d+)\]|\[['"]([^'"]+)['"]\]/g; let m;
  while ((m = re.exec(id))) out.push(m[2] !== undefined ? Number(m[2]) : (m[3] ?? m[1]));
  return out;
};

/**
 * @param {string} name the ledger file
 * @param {object} root the live table
 * @param {{ drop?: number, render?: (row: any) => string }} [opts]
 */
function holdsLedger(name, root, opts = {}) {
  const d = ledger(name);
  const render = opts.render || ((row) => { const t = textOf(row); return typeof t === 'function' ? t('{name}') : t; });
  const rows = [];
  for (const pool of d.pools) for (const line of pool.lines) {
    const path = parseLineId(line.lineId).slice(opts.drop ?? 1);
    let node = root;
    for (const step of path) node = node?.[step];
    rows.push({ pool, line, node, path });
  }
  return rows;
}

const TABLES = [
  ['STRESS_DESCS', STRESS_DESCS],
];

describe.each(TABLES)('%s carries the ledger\'s declarations', (name, root) => {
  const rows = holdsLedger(name, root);
  it('every ledger line is at its path, verbatim', () => {
    const missing = rows.filter((r) => r.node == null).map((r) => r.line.lineId);
    expect(missing).toEqual([]);
    const drift = rows.filter((r) => { const t = textOf(r.node); return (typeof t === 'function' ? t('{name}') : t) !== r.line.text; }).map((r) => r.line.lineId);
    expect(drift).toEqual([]);
  });
  it('every row declares what the ledger says (R-B1; scoped calm is silence)', () => {
    const wrong = rows.filter((r) => {
      const want = expectedDeclaration(r.pool, r.line);
      const have = declarationOf(r.node);
      return JSON.stringify([have.needs, have.excludes, have.crisis]) !== JSON.stringify([want.needs, want.excludes, want.crisis]);
    }).map((r) => `${r.line.lineId}: ${JSON.stringify(declarationOf(r.node))} ≠ ${JSON.stringify(expectedDeclaration(r.pool, r.line))}`);
    expect(wrong).toEqual([]);
  });
  it('every atom written has a home (R-E)', () => {
    for (const r of rows) {
      const d = declarationOf(r.node);
      for (const a of [...d.needs, ...d.excludes]) expect(() => assertDeclarable(a)).not.toThrow();
    }
  });
});
