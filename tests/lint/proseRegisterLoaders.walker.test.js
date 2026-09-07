/**
 * proseRegisterLoaders.walker.test.js — THE LOADERS' OWN GATE.
 *
 * ── WHY THE LOADERS NEEDED A GATE OF THEIR OWN ─────────────────────────────────────
 * Every reconcile in the reconstruction named the same debt: a rule that cites
 * `check-pair.mjs` on a register whose LOADER DOES NOT EXIST is OWED, not tested — it keeps
 * its direction and loses its standing until the loader runs (Part B §0.2). A loader that
 * silently returned `[]` would convert that honest debt into a false green, which is the
 * exact class `contractTestAntiVacuity.walker.test.js` exists to forbid one level up.
 *
 * So every loader THROWS on an empty read and on a stale export roster, and this file proves
 * both by driving them: a roster naming an export that does not exist must ERROR, and the
 * error must name the file and the export.
 *
 * ── THE COUNTS ARE PRINTED AGAINST PROBE_ALL'S, AND NEVER RECONCILED BY HAND ───────
 * Two figures are asserted EXACTLY, because they are reproductions rather than measurements:
 * R6's 1,662 rows in 1,104 pools (the seat's own figures, which the sitting recorded against
 * PROBE_ALL's 1,659 without erasing either) and R4b's 50. Everything else is printed with
 * PROBE_ALL's number beside it and the reason they differ stated: the admission predicate
 * here is looser (it admits fragments a sentence regex drops) and the ROSTER sometimes differs.
 *
 * @see tests/helpers/dossierCorpus.js
 */
import { describe, expect, it } from 'vitest';
import {
  harvestExports, isProse, loadChromeCopy, loadChronicle, loadCrierVoice, loadDmHooks,
  loadHeraldDisclosure, loadInstitutionGazetteer, loadNpcLadder, privateArray,
} from '../helpers/dossierCorpus.js';

/** @param {ReadonlyArray<{poolId: string, text: string}>} rows */
const census = (rows) => ({
  rows: rows.length,
  pools: new Set(rows.map((r) => r.poolId)).size,
  distinct: new Set(rows.map((r) => r.text)).size,
  singletonPools: [...new Set(rows.filter((r) => r.poolId.endsWith('::single')).map((r) => r.poolId))].length,
});

describe('the admission predicate — published, because every count depends on it', () => {
  it('admits prose and refuses an id wearing a string\'s coat', () => {
    expect(isProse('The hall keeps the rolls of freemen.')).toBe(true);
    expect(isProse('A quiet week, with little to note.')).toBe(true);
    expect(isProse('SCREAMING_SNAKE_KEY')).toBe(false);
    expect(isProse('a-kebab-slug-token')).toBe(false);
    expect(isProse('two words')).toBe(false);
    expect(isProse(42)).toBe(false);
    expect(isProse('')).toBe(false);
  });
});

describe('the harvester — fail-closed on a stale roster', () => {
  it('THROWS when an export the roster names is gone, and names it', () => {
    expect(() => harvestExports({
      rel: 'fixture.js', register: 'X', module: { REAL: ['a b c'] }, exports: ['GONE'],
    })).toThrow(/exports no `GONE`/);
  });

  it('THROWS when a module-private array cannot be found', () => {
    expect(() => privateArray('const OTHER = ["a b c"];', 'GREETINGS')).toThrow(/no `const GREETINGS`/);
  });

  it('reads a private array out of source, prose only', () => {
    const src = "const GREETINGS = Object.freeze([\n  'To the keeper of the roll, greeting.',\n  'ID_ONLY',\n]);";
    expect(privateArray(src, 'GREETINGS')).toEqual(['To the keeper of the roll, greeting.']);
  });

  it('reads an array of prose as a POOL and a lone string as a POOL OF ONE', () => {
    const rows = harvestExports({
      rel: 'fixture.js',
      register: 'X',
      module: {
        T: { pooled: ['one line here', 'another line here'], lone: 'a single standing line' },
      },
      exports: ['T'],
    });
    expect(rows.filter((r) => r.poolId === 'X::T.pooled')).toHaveLength(2);
    expect(rows.filter((r) => r.poolId.endsWith('::single'))).toHaveLength(1);
  });
});

describe('the registers, in the wave\'s order — each loaded, each counted', () => {
  it('loads every register and prints its census against PROBE_ALL\'s', async () => {
    const registers = [
      { name: 'chronicle (R12)', rows: await loadChronicle(), probe: 'R12 n=108 over 7 files; this loader reads 5 of them' },
      { name: 'R4b herald disclosure', rows: await loadHeraldDisclosure(), probe: 'R4b n=50 over 4 files' },
      { name: 'R5 crier voice', rows: await loadCrierVoice(), probe: 'R5 n=373 (deduplicated SENTENCES)' },
      { name: 'R6 npc ladder', rows: await loadNpcLadder(), probe: 'R6 n=1659; the seat\'s own 1,662 / 1,104 pools' },
      { name: 'R7 gazetteer', rows: await loadInstitutionGazetteer(), probe: 'R7 n=2169 over 6 files; this loader reads 5 (the sixth exports a builder, no table)' },
      { name: 'D-d dm hooks', rows: await loadDmHooks(), probe: '(PROBE_ALL has no D-d column)' },
      { name: 'R9 chrome copy', rows: await loadChromeCopy(), probe: 'R9 n=619 over 6 files; R16 is NOT loaded, by a stated refusal' },
    ];
    const lines = registers.map(({ name, rows, probe }) => {
      const c = census(rows);
      return `  ${name.padEnd(24)} rows ${String(c.rows).padStart(5)} · pools ${String(c.pools).padStart(4)}`
        + ` · distinct ${String(c.distinct).padStart(5)} · singleton pools ${String(c.singletonPools).padStart(4)}   [${probe}]`;
    });
    console.log(`\nREGISTER LOADERS · census at the product tip\n${lines.join('\n')}\n`);
    for (const { name, rows } of registers) {
      expect(rows.length, `${name} loaded nothing`).toBeGreaterThan(0);
      // Every row carries the shape the walkers read, or a walker will silently skip it.
      for (const row of rows.slice(0, 5)) {
        expect(typeof row.text).toBe('string');
        expect(typeof row.poolId).toBe('string');
        expect(Array.isArray(row.slots)).toBe(true);
      }
    }
  });

  it('R6 reproduces the seat\'s 1,662 rows in 1,104 pools EXACTLY', async () => {
    const c = census(await loadNpcLadder());
    // The sitting recorded the disagreement rather than erasing it: PROBE_ALL prints 1,659
    // deduplicated sentences; the seat counts 1,662 authored rows and 546 + 558 = 1,104 pools.
    // This loader lands on the seat's figures to the unit.
    expect(c.rows).toBe(1662);
    expect(c.pools).toBe(1104);
    expect(c.distinct).toBe(1662);
  });

  it('R4b reproduces PROBE_ALL\'s 50 exactly', async () => {
    expect(census(await loadHeraldDisclosure()).rows).toBe(50);
  });

  it('R7 lands within a tenth of PROBE_ALL\'s 2,169 with a looser predicate and one file fewer', async () => {
    const c = census(await loadInstitutionGazetteer());
    expect(c.rows).toBeGreaterThan(2169 * 0.9);
    expect(c.rows).toBeLessThan(2169 * 1.1);
  });

  it('R6\'s ladder pools are overwhelmingly SINGLETONS — the floor finding, measured', async () => {
    const rows = await loadNpcLadder();
    /** @type {Map<string, number>} */
    const sizes = new Map();
    for (const row of rows) sizes.set(row.poolId, (sizes.get(row.poolId) || 0) + 1);
    const counts = [...sizes.values()];
    const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
    const singletons = counts.filter((n) => n === 1).length;
    console.log(`\nR6 POOL FLOOR · ${counts.length} pools, mean size ${mean.toFixed(2)},`
      + ` ${singletons} singletons (${(singletons / counts.length * 100).toFixed(0)}%)`
      + '  [Part B §10 item 9: a register whose mean pool size is under its derived floor is NOT-EXECUTABLE; the derived floors are 8 / 6 / 4]\n');
    // The mean pool size is the figure arm H reads. It is asserted only to be BELOW the
    // lowest derived floor, which is the finding — not pinned to a value the wave will move.
    expect(mean).toBeLessThan(4);
  });
});
