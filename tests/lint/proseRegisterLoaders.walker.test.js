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
 * ONE figure is asserted EXACTLY as a reproduction: R6's 1,662 rows in 1,104 pools (the seat's
 * own figures, which the sitting recorded against PROBE_ALL's 1,659 without erasing either).
 * Everything else is printed with PROBE_ALL's number beside it and the reason they differ
 * stated: the admission predicate here is looser (it admits fragments a sentence regex drops)
 * and the ROSTER sometimes differs.
 *
 * ⚠ R4b's "= 50, PROBE_ALL's number to the unit" IS WITHDRAWN, AND THE WITHDRAWAL IS A
 * ONE-TIME SHIFT THIS FILE STATES RATHER THAN LETS RIDE. The harvester dropped a top-level
 * BARE-STRING export silently — `causeWalk.js`'s three lines — so the loader read 53 and
 * reported 50, and the agreement with PROBE_ALL was 53 − 3 rather than a reproduction. Two
 * things were measured before the cure landed: (1) the loader's 50 came entirely from
 * `heraldIntegrity.js` (18) and `causeLifecycleVocabulary.js` (32), with `causeWalk.js`
 * contributing ZERO — so PROBE_ALL's own 50, over a file set that NAMES causeWalk.js, cannot
 * have counted the three either; and (2) PROBE_ALL's R4b file set names a fourth file,
 * `heraldCausalVoice.js`, which this loader does not read at all. The two 50s were an
 * agreement between different rosters. The count is now **53** and the roster disagreement is
 * printed instead of hidden.
 *
 * @see tests/helpers/dossierCorpus.js
 */
import { describe, expect, it } from 'vitest';
import {
  harvestExports, isProse, loadChromeCopy, loadChronicle, loadCrierVoice, loadDmHooks,
  loadHeraldDisclosure, loadInstitutionGazetteer, loadNpcLadder, privateArray, refuseEmpty,
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

  it('THROWS on an empty read — the third fail-closed path, DRIVEN rather than described', () => {
    // A stub module whose only export is an id wearing a string's coat: the harvester admits
    // nothing, and the loader's guard is what turns that into an error instead of a silent
    // `[]`. Before this case, `refuseEmpty` had twelve call sites, one definition and no
    // driver anywhere in the estate — while the loader receipt claimed each control fires.
    const harvested = harvestExports({
      rel: 'stub.js', register: 'X', module: { T: { id: 'ID_ONLY', n: 4 } }, exports: ['T'],
    });
    // anchored: the harvest IS empty, which is what makes the throw below the guard's doing
    expect(harvested).toEqual([]);
    expect(() => refuseEmpty('stub register', harvested)).toThrow(/read ZERO rows/);
    // PRESENT-THEN-ABSENT: one prose row and the same guard falls silent.
    expect(() => refuseEmpty('stub register', harvestExports({
      rel: 'stub.js', register: 'X', module: { T: { line: 'a line of real prose here' } }, exports: ['T'],
    }))).not.toThrow();
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

  it('reads a TOP-LEVEL bare string as a pool of one — the silent drop that cost R4b three lines', () => {
    const rows = harvestExports({
      rel: 'fixture.js',
      register: 'X',
      module: { LONE: 'The ledger holds no deeper memory of this.', ID: 'SCREAMING_KEY' },
      exports: ['LONE'],
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].poolId).toBe('X::LONE::single');
    expect(rows[0].text).toBe('The ledger holds no deeper memory of this.');
    // The admission predicate still governs: an id wearing a string's coat is not a pool.
    expect(harvestExports({
      rel: 'fixture.js', register: 'X', module: { ID: 'SCREAMING_KEY' }, exports: ['ID'],
    })).toEqual([]);
  });
});

describe('the registers, in the wave\'s order — each loaded, each counted', () => {
  it('loads every register and prints its census against PROBE_ALL\'s', async () => {
    const registers = [
      { name: 'chronicle (R11 · R12)', rows: await loadChronicle(), probe: 'R12 n=108 over 7 files; this loader reads 5 of them, and the letter\'s three pools are R11' },
      { name: 'R4b herald disclosure', rows: await loadHeraldDisclosure(), probe: 'PROBE_ALL R4b n=50 over 4 files — a DIFFERENT roster (it names heraldCausalVoice.js, unread here) and without causeWalk.js\'s three bare strings' },
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

  it('R4b reads 53 — the three bare-string exports the harvester used to drop, named by file', async () => {
    const rows = await loadHeraldDisclosure();
    expect(census(rows).rows).toBe(53);
    // The cure's own witness: at least one row now comes from `causeWalk.js`, which
    // contributed ZERO before and which PROBE_ALL's file set nonetheless names.
    const fromWalk = rows.filter((row) => row.file.endsWith('causeWalk.js'));
    expect(fromWalk.length).toBe(3);
    expect(fromWalk.map((row) => row.text)).toContain('The ledger holds no deeper memory of this.');
    // The per-file split, so the 53 can be argued with rather than taken.
    /** @type {Record<string, number>} */
    const byFile = {};
    for (const row of rows) byFile[row.file.split('/').pop()] = (byFile[row.file.split('/').pop()] || 0) + 1;
    expect(byFile).toEqual({
      'heraldIntegrity.js': 18, 'causeLifecycleVocabulary.js': 32, 'causeWalk.js': 3,
    });
  });

  it('the CHRONICLE carries both of its registers, and every row carries exactly one', async () => {
    // SITTING §L: R11 is the chronicler's LETTER (greetings, closings, quiet lines); R12 is
    // the quiet pool (quiet fallbacks, treaty, demographic, assessment). The loader's stamps
    // were right and the census heading was wrong; the receipt's "R11 is not loaded" is
    // withdrawn — 11 of the 85 rows are R11 and every one of them is a letter row.
    const rows = await loadChronicle();
    const registers = new Set(rows.map((row) => row.register));
    expect([...registers].sort()).toEqual(['R11', 'R12']);
    for (const row of rows) expect(['R11', 'R12']).toContain(row.register);
    const letter = rows.filter((row) => row.poolId.startsWith('R11::letter.'));
    expect(letter.length).toBe(11);
    for (const row of letter) expect(row.register).toBe('R11');
    // And no NON-letter row wears the letter's register.
    expect(rows.filter((row) => row.register === 'R11').length).toBe(letter.length);
    expect(rows.filter((row) => row.register === 'R12').length).toBe(rows.length - letter.length);
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
