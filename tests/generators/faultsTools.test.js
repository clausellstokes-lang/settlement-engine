// FAULTS-TOOLS (2026-11-18, BRIEF-FAULTS § FAULTS-TOOLS): the guards of the checking tools this seat repaired.
//
// ITEM 2 · THE VALIDATOR THAT CANNOT OPEN. `scripts/census/census4-validate-ledger.mjs` threw on the first file of
// its directory that was not one of its own ledgers (ENOENT on `undefinedARRIVAL_MEMORIES.json`, from 2c1428102 on).
// It must OPEN on the tree as it stands, NAME the files it does not read, and still FIND each kind of fault it exists
// to find. Its findings at the tree are the chair's (named in the seat's hand-back), so no arm here asks for zero.
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const VALIDATE = join(ROOT, 'scripts/census/census4-validate-ledger.mjs');
const EXTRACT = join(ROOT, 'scripts/census/census4-extract-pools.mjs');

/** @param {string[]} args */
const run = (args) => spawnSync(process.execPath, [VALIDATE, ...args], {
  cwd: ROOT, encoding: 'utf8', env: { ...process.env, CENSUS4_ALL: '1' },
});
/** @param {string} stdout @returns {string[]} every finding, one per line */
const findingsOf = (stdout) => stdout.split('\n').filter((l) => l.startsWith('BAD: ')).map((l) => l.slice(5));

describe('FAULTS-TOOLS item 2 · census4-validate-ledger opens and still finds', () => {
  /** @type {string} */ let raw;
  /** @type {string[]} */ let baseline;
  beforeAll(() => {
    raw = mkdtempSync(join(tmpdir(), 'faults-tools-raw-'));
    const extract = spawnSync(process.execPath, [EXTRACT, `${raw}/`], { cwd: ROOT, encoding: 'utf8' });
    expect(extract.status, extract.stderr).toBe(0);
    const out = run([raw]);
    baseline = findingsOf(out.stdout);
  }, 120_000);
  afterAll(() => { if (raw) rmSync(raw, { recursive: true, force: true }); });

  it('OPENS with no argument (runs the extract itself) and reaches its verdict line, never a throw', () => {
    const out = run([]);
    expect(out.stderr).not.toMatch(/ENOENT|Error:/);
    expect(out.stdout).toMatch(/^BAD \d+/m);
    expect([0, 1]).toContain(out.status);
    // the exit code says the verdict: 1 exactly when a finding stands
    expect(out.status).toBe(findingsOf(out.stdout).length ? 1 : 0);
  }, 120_000);

  it('NAMES the files of the directory it does not read, by family, and reads the CENSUS-4 ledgers', () => {
    const out = run([raw]);
    expect(out.stdout).toMatch(/^NOT READ \(CENSUS-2 pool-shaped \(pools\[\]\)\): \d+$/m);
    expect(out.stdout).toMatch(/^NOT READ \(row-shaped, not a CENSUS-4 table \(CENSUS-3b\)\): \d+$/m);
    expect(out.stdout).toMatch(/^npcData\.MANNERISMS\tR\t\d+/m);
    // negative beside it: a CENSUS-2 ledger is not read as a CENSUS-4 one
    expect(out.stdout).not.toMatch(/^ARRIVAL_MEMORIES\t/m);
  });

  it('FINDS a planted text drift, and only where it was planted', () => {
    const planted = mkdtempSync(join(tmpdir(), 'faults-tools-plant-'));
    try {
      cpSync(raw, planted, { recursive: true });
      const file = join(planted, 'npcData.MANNERISMS.json');
      const pool = JSON.parse(readFileSync(file, 'utf8'));
      pool.rows[0].text = `${pool.rows[0].text} (planted)`;
      writeFileSync(file, JSON.stringify(pool));
      const added = findingsOf(run([planted]).stdout).filter((f) => !baseline.includes(f));
      expect(added).toEqual([`npcData.MANNERISMS: row 0 id/text mismatch (${pool.rows[0].id})`]);
      // negative: the same pool unplanted carries no finding
      expect(baseline.filter((f) => f.startsWith('npcData.MANNERISMS'))).toEqual([]);
    } finally { rmSync(planted, { recursive: true, force: true }); }
  });

  it('FINDS a pool the ledger does not cover, and a ledger whose pool is gone', () => {
    const planted = mkdtempSync(join(tmpdir(), 'faults-tools-plant-'));
    try {
      cpSync(raw, planted, { recursive: true });
      rmSync(join(planted, 'npcData.MANNERISMS.json'));
      writeFileSync(join(planted, 'npcData.PLANTED_POOL.json'), JSON.stringify({ pool: 'npcData.PLANTED_POOL', rows: [{ id: '#0', text: 'x' }] }));
      const added = findingsOf(run([planted]).stdout).filter((f) => !baseline.includes(f));
      expect(added.sort()).toEqual([
        'npcData.MANNERISMS: a CENSUS-4 ledger the extract emits no pool for',
        'npcData.PLANTED_POOL: an extracted pool with no ledger file',
      ]);
      // negative: neither finding stands on the tree's own extract
      expect(baseline.filter((f) => /no pool for|no ledger file/.test(f))).toEqual([]);
    } finally { rmSync(planted, { recursive: true, force: true }); }
  });
});
