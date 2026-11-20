// FAULTS-TOOLS (2026-11-18, BRIEF-FAULTS § FAULTS-TOOLS): the guards of the checking tools this seat repaired.
//
// ITEM 1 · THE MATCHER TAKES A NAME FOR A CLAIM (the chair's ruling CL25). `claimsField` read the NAME SLOT `{settlement}`
// (the town's proper name) as a claim of the record's `settlement` field, and the bare verb "has" as a claim of every field
// whose name opens on it (`hasGranary`, `hasWatch`, ...). Cured at the matcher; each kind of claim it must still find is planted.
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
import { armA0b, claimsField, claimTokensOf } from '../../src/domain/prose/composedWalker.js';
import { loadStateLeaves } from '../helpers/dossierCorpus.js';

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
    expect(out.stdout).toMatch(/^BAD \d+/m);
    // anchored: the verdict line just above is present, so this absence is not a drifted collection
    expect(out.stderr).not.toMatch(/ENOENT|Error:/);
    expect([0, 1]).toContain(out.status);
    // the exit code says the verdict: 1 exactly when a finding stands
    expect(out.status).toBe(findingsOf(out.stdout).length ? 1 : 0);
  }, 120_000);

  it('NAMES the files of the directory it does not read, by family, and reads the CENSUS-4 ledgers', () => {
    const out = run([raw]);
    expect(out.stdout).toMatch(/^NOT READ \(CENSUS-2 pool-shaped \(pools\[\]\)\): \d+$/m);
    expect(out.stdout).toMatch(/^NOT READ \(row-shaped, not a CENSUS-4 table \(CENSUS-3b\)\): \d+$/m);
    expect(out.stdout).toMatch(/^npcData\.MANNERISMS\tR\t\d+/m);
    // negative beside it, anchored: the MANNERISMS row just above is read, so a CENSUS-2 ledger's absence is the selection's
    // anchored: a CENSUS-2 ledger is not read as a CENSUS-4 one (the CENSUS-4 row above is present)
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

const corpus = await loadStateLeaves();
const census = JSON.parse(readFileSync(join(ROOT, 'docs/content/wiring-census.json'), 'utf8'));
const censusByPool = new Map(census.rows.map((r) => [`${r.block} :: ${r.pool}`, r]));
/** every over-claim armA0b finds on the shipped corpus, as `<block> :: <pool> v<vid> <field>` */
const overClaims = corpus.flatMap((entry) => {
  const row = censusByPool.get(`${entry.block} :: ${entry.pool}`);
  const out = armA0b({ id: `${entry.block} :: ${entry.pool}`, text: entry.text, reads: row ? row.reads : [],
    universe: row ? row.fieldsRead : [], predicate: row ? row.predicate : [], marks: entry.marks });
  return out.fails.filter((f) => f.subject === 'over-claim').map((f) => `${f.id} v${entry.vid} ${String(f.value).replace(/ \(as .*$/, '')}`);
});

describe('FAULTS-TOOLS item 1 · the matcher tells a name and a verb from a claim', () => {
  it('the NAME SLOT claims no field; a slot naming a field, and the bare word, still do', () => {
    expect(claimsField('{settlement} keeps its own rolls.', 'settlement')).toBe('');
    expect(claimsField('What binds {settlement} to {counterpart} expires.', 'readings.settlementId')).toBe('');
    // positives beside it
    expect(claimsField('The {granary} stands full.', 'readings.inst.granary')).toBe('{granary}');
    expect(claimsField('The settlement keeps its own rolls.', 'settlement')).toBe('settlement');
    expect(claimsField('{settlement} keeps a watch at the gate.', 'readings.inst.hasWatch')).toBe('watch');
  });

  it('the BARE VERB of a predicate field is not a claim word; the field\'s own words still are', () => {
    expect(claimTokensOf('readings.inst.hasWatch')).toEqual(['haswatchs', 'haswatch', 'watchs', 'watch']);
    // DS-GEN-17 ADMINISTERED v5, read from the corpus (never quoted): its "has" claims no watch
    const v5 = corpus.find((e) => e.block === 'DS-GEN-17' && e.pool === 'ADMINISTERED' && e.vid === 5);
    expect(v5?.text).toMatch(/\bhas\b/);
    expect(claimsField(v5.text, 'readings.inst.hasWatch')).toBe('');
    expect(claimsField('The town has decided it can afford them.', 'readings.inst.hasGranary')).toBe('');
    // positives beside it: the leaf's own words, a camel-cased leaf's words, a plural
    expect(claimsField('The town has a granary.', 'readings.inst.hasGranary')).toBe('granary');
    expect(claimsField('The economic gates hold.', 'defenseProfile.economicGates')).toBe('economic');
    expect(claimsField('No court sits here.', 'readings.inst.hasCourtSystem')).toBe('court');
  });

  it('PLANTED over-claims of each kind are still found by armA0b, and a clean line finds none', () => {
    const universe = ['walls', 'readings.inst.hasWatch', 'readings.inst.granary', 'settlement', 'defenseProfile.economicGates'];
    const planted = armA0b({ id: 'plant', text: 'The settlement has walls; the watch walks, the {granary} is full and the economic gates hold.',
      reads: ['walls'], universe });
    expect(planted.fails.filter((f) => f.subject === 'over-claim').map((f) => f.value).sort()).toEqual([
      'defenseProfile.economicGates (as "economic")', 'readings.inst.granary (as "{granary}")',
      'readings.inst.hasWatch (as "watch")', 'settlement (as "settlement")',
    ]);
    const clean = armA0b({ id: 'clean', text: '{settlement} has walls.', reads: ['walls'], universe });
    expect(clean.fails).toEqual([]);
  });

  it('on the shipped corpus, CL25\'s eight are gone and the true over-claims of the same lines stand', () => {
    const eight = [
      'DS-GEN-17 :: ADMINISTERED v4 settlement', 'DS-GEN-17 :: ADMINISTERED v5 settlement',
      ...['hasGranary', 'hasHospital', 'hasMagicInst', 'hasMilitaryInst', 'hasNavy', 'hasWatch']
        .map((f) => `DS-GEN-17 :: ADMINISTERED v5 readings.inst.${f}`),
    ];
    expect(eight.filter((row) => overClaims.includes(row))).toEqual([]);
    // the lines are still walked (non-vacuity): their true claim of the court stands
    expect(overClaims).toEqual(expect.arrayContaining([
      'DS-GEN-17 :: ADMINISTERED v4 readings.inst.hasCourtSystem', 'DS-GEN-17 :: ADMINISTERED v5 readings.inst.hasCourtSystem',
    ]));
    expect(overClaims.filter((row) => / settlement$| readings\.settlementId$/.test(row))).toEqual([]);
  });
});
