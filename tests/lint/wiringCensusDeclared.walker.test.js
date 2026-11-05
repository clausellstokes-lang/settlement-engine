/**
 * tests/lint/wiringCensusDeclared.walker.test.js — CENSUS-1g unit 5 (the design's §3.5, CENSUS-1d's
 * "unit 3c"): THE WIRING CENSUS'S DECLARED COLUMNS AND `tablePools`.
 *
 *   1. Every state row of `docs/content/wiring-census.json` carries `declares`, `lineDeclares`,
 *      `undeclared` and `crisisScoped`, and they equal a fresh reading of the ANNEX through the
 *      projector's own parse (`scripts/lib/census-declared.mjs`), so a declaration and its census
 *      re-take land in one commit.
 *   2. At a projected tree the annex reading and the registers' reading of the leaves agree per
 *      pool (the columns are not a second spelling).
 *   3. `tablePools` carries one row per enrolled off-census pool with the four columns, its draw
 *      kind and site; a `{colour}` table owes no undeclared line.
 *
 * Re-take through the door: `node scripts/wiring-census.mjs` (then `gen:dossier-prose --check`).
 *
 * @enforced-by npx vitest run tests/lint/wiringCensusDeclared.walker.test.js
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { annexDeclaredColumns } from '../../scripts/lib/census-declared.mjs';
import { TABLE_POOLS } from '../../scripts/lib/table-pools.mjs';
import { statePoolCounts } from '../../src/domain/facts/declarationRegisters.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';

const CENSUS = JSON.parse(readFileSync(new URL('../../docs/content/wiring-census.json', import.meta.url), 'utf8'));
const ANNEX = readFileSync(new URL('../../docs/content/RECEIPT_POOLS_DOSSIER_STATE.md', import.meta.url), 'utf8');
const fresh = annexDeclaredColumns(ANNEX);

describe('the state rows\' declared columns', () => {
  it('every row carries the four columns, equal to a fresh annex reading', () => {
    const stale = [];
    for (const r of CENSUS.rows) {
      const d = fresh.get(`${r.block} :: ${r.pool}`);
      expect(d, `${r.block} :: ${r.pool}`).toBeTruthy();
      const held = { declares: r.declares, lineDeclares: r.lineDeclares, undeclared: r.undeclared, crisisScoped: r.crisisScoped };
      if (JSON.stringify(held) !== JSON.stringify(d)) stale.push(`${r.block} :: ${r.pool}`);
    }
    expect(stale).toEqual([]);
    expect(CENSUS.totals.declaredColumnRows).toBe(CENSUS.rows.length);
  });

  it('the annex reading agrees with the registers\' reading of the leaves, pool by pool', () => {
    const leaves = statePoolCounts([
      DOSSIER_STATE_PROSE_DEFENSE, DOSSIER_STATE_PROSE_ECONOMY, DOSSIER_STATE_PROSE_GENERAL,
      DOSSIER_STATE_PROSE_POWER, DOSSIER_STATE_PROSE_STRESSORS, DOSSIER_STATE_PROSE_WAR_FAITH,
    ]);
    const disagree = [];
    for (const [key, d] of fresh) {
      const c = leaves[key.replace(' :: ', '::')];
      if (!c || c.undeclared !== d.undeclared || c.crisisScoped !== d.crisisScoped) disagree.push(key);
    }
    expect(disagree).toEqual([]);
  });

  it('the census reads the annex through the projector\'s own parse, never the leaves', () => {
    const src = readFileSync(new URL('../../scripts/lib/census-declared.mjs', import.meta.url), 'utf8');
    expect(src).toMatch(/import \{ parseAnnex, STATE_HEADER \} from '\.\/dossier-annex-parse\.mjs';/);
    expect(src).not.toMatch(/generated\.js/);
    const projector = readFileSync(new URL('../../scripts/generate-dossier-state-prose.mjs', import.meta.url), 'utf8');
    expect(projector).toMatch(/parseAnnex, STATE_HEADER,\n\} from '\.\/lib\/dossier-annex-parse\.mjs';/);
    expect(projector).not.toMatch(/^function parseAnnex/m);
  });
});

describe('tablePools', () => {
  it('one row per enrolled pool, with the four columns, draw kind and site', () => {
    expect(CENSUS.tablePools.map((t) => t.id)).toEqual(TABLE_POOLS.map((e) => e.id));
    for (const t of CENSUS.tablePools) {
      expect(Object.keys(t)).toEqual(expect.arrayContaining(['declares', 'lineDeclares', 'undeclared', 'crisisScoped', 'drawKind', 'drawSite']));
      expect(['K', 'R', 'H', 'A', 'T', 'mixed']).toContain(t.drawKind);
    }
  });
  it('a {colour} table owes no undeclared line; CENSUS-5c\'s ALIGNED_BASIS is enrolled colour', () => {
    for (const t of CENSUS.tablePools.filter((x) => x.colour)) expect(t.undeclared).toBe(0);
    expect(CENSUS.tablePools.find((t) => t.id === 'powerSupport.ALIGNED_BASIS')).toMatchObject({ colour: true, undeclared: 0 });
  });
});
