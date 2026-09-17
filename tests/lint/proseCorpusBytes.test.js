/**
 * proseCorpusBytes.test.js — THE PROSE BYTE RATCHET (ARCH-COMPOSED-PROSE §10, §12
 * row 2; lane MEASURE car 2).
 *
 * WHAT IT GUARDS. The composed-prose model grows the dossier's authored corpus from
 * today's 641,410 raw bytes over six state leaves toward a declared ceiling of about
 * 2.8 MB (§10's arithmetic on measured unit costs: 160.8 B per added face, 158 B per
 * new piece record, about 1,200 pieces at the ceiling). Nothing in the estate could
 * see that growth before this file. The three first-paint budgets in
 * tests/build/vendorPdfLazy.test.js measure the ENTRY CLOSURE, which the corpus is
 * absent from by construction; scripts/.size-baseline.json measures effective LINES
 * and its ceilingFor() returns null for src/data/**, so no prose leaf can ever
 * appear there. The corpus was therefore outside every existing ruler, and a wave
 * that quadrupled it would have measured green everywhere.
 *
 * WHY THIS FILE AND NOT ONE OF THOSE TWO. §11 refuses, in terms, "no
 * .size-baseline.json byte row; no second first-paint ruler". A byte row planted in
 * .size-baseline.json would be read by eslint.config.js:92-96 as a max-LINES ceiling
 * of 641,410 and would red both of that instrument's consumers; a first-paint byte
 * test in tests/lint/ would be a second ruler for a budget that already has one AND
 * a breach of the house STALE-DIST POLICY, since a size assertion outside
 * VERIFY_DIST measures whatever dist happened to be on disk. This instrument avoids
 * both by measuring the SOURCE leaves, which is lawful in the plain pre-build test
 * phase precisely because the artefact it reads is the committed file: there is no
 * stale version of a tracked source file.
 *
 * WHAT IT ASSERTS.
 *   1. EXACT SET     — the baseline's leaf rows equal the prose leaves on disk.
 *   2. RAW EXACT     — every leaf's committed `raw` equals its bytes; above fails,
 *                      below fails demanding the row be LOWERED (the sizeBaseline
 *                      honesty idiom, in bytes).
 *   3. GZIP BAND     — level-9 gzip within 1 % of the committed figure, and under
 *                      the leaf's gzip ceiling. A band rather than an equality
 *                      because gzip output depends on the zlib build as well as the
 *                      payload, and this estate has already ruled that a ratchet
 *                      which reds on a toolchain upgrade has stopped measuring the
 *                      payload. The RAW arm above is the exact one; no byte moves
 *                      through this file unseen.
 *   4. THE CEILINGS  — re-derived here from §10's arithmetic rather than trusted as
 *                      committed numbers, so the apportionment cannot drift.
 *   5. DECLARED ROWS — growth is lawful only through a declared row that chains from
 *                      the genesis measurement to today's bytes (see below).
 *   6. NON-OVERLAP   — the size-baseline instrument still cannot see src/data/**,
 *                      asserted against its OWN ceilingFor() rules rather than a
 *                      replica of them, and this file is that map's only consumer.
 *
 * THE DECLARED-ROW IDIOM, WHICH IS MACHINE-CHECKED. A shrink needs no declaration:
 * lower the row and the win is banked. A GROWTH needs an entry in the baseline's
 * `declared` array naming the car, the leaf, fromRaw, toRaw, gzipAfter and a reason.
 * The chain is then reconstructed per leaf: it must start at that leaf's genesis
 * measurement, each row must begin where the previous ended, and the last row must
 * land EXACTLY on the leaf's current committed bytes. Raise a number without a
 * declared row and the chain stops short, and this file reds naming the leaf. That
 * is what makes "monotone unless declared" an enforced property rather than a habit.
 *
 * TO COMPLY when this reds:
 *   - a leaf SHRANK  → lower its `raw` and `gzip` rows; no declaration is owed.
 *   - a leaf GREW    → append a `declared` row (car, leaf, fromRaw, toRaw, gzipAfter,
 *                      reason) and update the `leaves` row to match it.
 *   - a NEW leaf     → add its `genesis` and `leaves` rows; its ceiling is the
 *                      apportionment arithmetic in the baseline's _ceilingArithmetic.
 *   - a leaf needs MORE than its ceiling → that is an amendment to ARCH §10 and §13
 *                      row 17, which is the owner's row and not a lane's.
 *
 * @enforced-by this test
 * @consumes scripts/.prose-byte-baseline.json
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { describe, expect, test } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BASELINE_PATH = 'scripts/.prose-byte-baseline.json';
const STATE_LEAF_DIR = 'src/data/dossierStateProse';
const CAUSAL_LEAF = 'src/data/dossierCausalProse.generated.js';

const baseline = JSON.parse(readFileSync(join(ROOT, BASELINE_PATH), 'utf8'));
const { genesis, leaves, declared } = baseline;
const CEILING_TOTAL_RAW = baseline.ceilingTotalRawStateLeaves;
const GZIP_RATIO_TENTHS = baseline.ceilingGzipRatioTenths;
const GENESIS_BASIS_RAW = baseline.genesisBasisRawStateLeaves;

/**
 * The three leaves SEAM car 4 projects beside the desks (ARCH §2.3, §4.1): the connective
 * phrase lists, the departure bits and the relation table. They live in `src/data/` itself
 * rather than under the desk directory, because they are not a desk's corpus — they are the
 * composer's frozen inputs — so the directory walk below cannot find them and they are NAMED,
 * which is what this file's own header requires of a leaf projected outside that walk.
 */
const COMPOSER_LEAVES = Object.freeze([
  'src/data/dossierConnectives.generated.js',
  'src/data/proseNorms.generated.js',
  'src/data/dossierRelations.generated.js',
]);

/** The prose leaves the tree actually holds: the projected state desks, plus the causal leaf.
 *  DERIVED from the directory, never a hand-list, so a leaf car 4 adds under
 *  src/data/dossierStateProse/ is claimed the day it lands. A prose leaf projected to some
 *  OTHER directory escapes this walk and must be named here in the same commit. */
function proseLeavesOnDisk() {
  const dir = join(ROOT, STATE_LEAF_DIR);
  const state = readdirSync(dir)
    .filter((f) => f.endsWith('.generated.js'))
    .map((f) => `${STATE_LEAF_DIR}/${f}`);
  return [...state, CAUSAL_LEAF, ...COMPOSER_LEAVES].sort();
}

/** Bytes on disk plus level-9 gzip over the same bytes. */
function measure(rel) {
  const bytes = readFileSync(join(ROOT, rel));
  return { raw: bytes.length, gzip: gzipSync(bytes, { level: 9 }).length };
}

const stateLeafKeys = Object.keys(leaves).filter((k) => k.startsWith(`${STATE_LEAF_DIR}/`)).sort();
const measured = new Map(Object.keys(leaves).map((rel) => [rel, measure(rel)]));

describe('the prose byte ratchet — the roster and the measurement (ARCH §10)', () => {
  test('anti-vacuity: the baseline names leaves, they exist, and they are measurable', () => {
    // Without this, every arm below is green-on-nothing the day the baseline is
    // emptied or the leaves move: an empty roster satisfies every for-loop.
    expect(Object.keys(leaves).length, 'the baseline names no leaf at all').toBeGreaterThanOrEqual(10);
    expect(stateLeafKeys.length, 'the baseline names no STATE leaf').toBeGreaterThanOrEqual(6);
    for (const rel of Object.keys(leaves)) {
      expect(existsSync(join(ROOT, rel)), `${rel} is baselined but is not on disk`).toBe(true);
      expect(measured.get(rel).raw, `${rel} measured zero bytes`).toBeGreaterThan(0);
      expect(measured.get(rel).gzip, `${rel} gzipped to zero bytes`).toBeGreaterThan(0);
    }
  });

  test('EXACT SET: the baselined leaves equal the prose leaves on disk', () => {
    // A new leaf (car 4 projects three) must take a row rather than growing the
    // corpus outside every ruler; a deleted leaf must lose its row.
    expect(Object.keys(leaves).sort()).toEqual(proseLeavesOnDisk());
    expect(Object.keys(genesis).sort()).toEqual(proseLeavesOnDisk());
  });

  test('RAW is EXACT: above fails, below demands the row be lowered', () => {
    const drift = [];
    for (const [rel, row] of Object.entries(leaves)) {
      const now = measured.get(rel).raw;
      if (now > row.raw) {
        drift.push(
          `${rel}: grew to ${now} raw bytes, over the committed ${row.raw}. `
          + `Append a declared row to ${BASELINE_PATH} naming the car and the delta, `
          + `and move this number onto ${now}.`,
        );
      } else if (now < row.raw) {
        drift.push(
          `${rel}: shrank to ${now} raw bytes, under the committed ${row.raw}. `
          + `LOWER this number to ${now} so the reduction is banked. No declaration is owed for a shrink.`,
        );
      }
    }
    expect(drift).toEqual([]);
  });

  test('GZIP sits inside the 1 % band around its committed figure', () => {
    // Integer arithmetic only: |now - committed| * 100 <= committed * 1.
    const drift = [];
    for (const [rel, row] of Object.entries(leaves)) {
      const now = measured.get(rel).gzip;
      const delta = Math.abs(now - row.gzip);
      if (delta * 100 > row.gzip) {
        drift.push(
          `${rel}: gzip is ${now} against the committed ${row.gzip}, a move of ${delta} bytes, `
          + `outside the 1 % band. A payload change reds the RAW arm first, so a gzip-only move `
          + `this large means the zlib build changed: re-measure and move the row, saying so.`,
        );
      }
    }
    expect(drift).toEqual([]);
  });

  test('every leaf sits at or under its own ceiling, raw and gzip', () => {
    const over = [];
    for (const [rel, row] of Object.entries(leaves)) {
      const now = measured.get(rel);
      if (now.raw > row.ceilingRaw) over.push(`${rel}: raw ${now.raw} over ceiling ${row.ceilingRaw}`);
      if (now.gzip > row.ceilingGzip) over.push(`${rel}: gzip ${now.gzip} over ceiling ${row.ceilingGzip}`);
    }
    expect(
      over,
      'a leaf passed the ceiling ARCH §10 sizes the whole model against. Raising it amends'
      + ' §10 and §13 row 17, which is the owner\'s row and not a lane\'s.',
    ).toEqual([]);
  });
});

describe('the prose byte ratchet — the ceilings are re-derived, never trusted (ARCH §10)', () => {
  test('the genesis basis equals the six state leaves it claims to total', () => {
    const sum = stateLeafKeys.reduce((n, rel) => n + genesis[rel].raw, 0);
    expect(sum, `genesisBasisRawStateLeaves disagrees with the genesis rows it sums`).toBe(GENESIS_BASIS_RAW);
  });

  test('each state leaf\'s raw ceiling is the total apportioned by its genesis share', () => {
    const wrong = [];
    for (const rel of stateLeafKeys) {
      const want = Math.round((CEILING_TOTAL_RAW * genesis[rel].raw) / GENESIS_BASIS_RAW);
      if (leaves[rel].ceilingRaw !== want) {
        wrong.push(`${rel}: ceilingRaw ${leaves[rel].ceilingRaw}, apportionment says ${want}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  test('the six state ceilings sum to the declared total with no remainder', () => {
    // §10's total is not an aspiration to be approached: the rounded shares land on
    // it exactly, so a hand-edited row is visible here rather than absorbed.
    const sum = stateLeafKeys.reduce((n, rel) => n + leaves[rel].ceilingRaw, 0);
    expect(sum).toBe(CEILING_TOTAL_RAW);
  });

  test('each gzip ceiling is its raw ceiling at §10\'s over-the-wire ratio', () => {
    const wrong = [];
    for (const rel of stateLeafKeys) {
      const want = Math.round((leaves[rel].ceilingRaw * 10) / GZIP_RATIO_TENTHS);
      if (leaves[rel].ceilingGzip !== want) {
        wrong.push(`${rel}: ceilingGzip ${leaves[rel].ceilingGzip}, the ratio says ${want}`);
      }
    }
    expect(wrong).toEqual([]);
    // And the total lands inside the band §10 states in prose (0.5 to 0.65 MB over
    // the wire, fetched with the first lazy tab).
    const sum = stateLeafKeys.reduce((n, rel) => n + leaves[rel].ceilingGzip, 0);
    expect(sum).toBeGreaterThanOrEqual(500_000);
    expect(sum).toBeLessThanOrEqual(650_000);
  });

  test('each COMPOSER leaf\'s ceiling is ARCH §10\'s three-leaf total, apportioned the same way', () => {
    // SEAM car 4. §10 prices the three at about 77 KB together, and the apportionment rule is
    // the state leaves' own: a share of the total in proportion to genesis bytes, re-derived
    // here rather than trusted as a committed number, with the rounded shares landing on the
    // total exactly so a hand-edited row is visible instead of absorbed.
    const total = baseline.ceilingTotalRawNewLeaves;
    const basis = baseline.genesisBasisRawNewLeaves;
    expect(COMPOSER_LEAVES.reduce((n, rel) => n + genesis[rel].raw, 0), 'the new-leaf basis disagrees with the rows it sums').toBe(basis);
    const wrong = [];
    for (const rel of COMPOSER_LEAVES) {
      const wantRaw = Math.round((total * genesis[rel].raw) / basis);
      // §10's 4.5 : 1 is a CORPUS ratio; on a small payload gzip's fixed overhead dominates and
      // that ratio would set a ceiling the leaf breaches at birth (the connectives leaf
      // compresses at 1.72 : 1 and this arm's first run said so). The ceiling is therefore the
      // LARGER of §10's ratio and the leaf's own measured one.
      const wantGzip = Math.max(
        Math.round((wantRaw * 10) / GZIP_RATIO_TENTHS),
        Math.round((genesis[rel].gzip * wantRaw) / genesis[rel].raw),
      );
      if (leaves[rel].ceilingRaw !== wantRaw) wrong.push(`${rel}: ceilingRaw ${leaves[rel].ceilingRaw}, apportionment says ${wantRaw}`);
      if (leaves[rel].ceilingGzip !== wantGzip) wrong.push(`${rel}: ceilingGzip ${leaves[rel].ceilingGzip}, the ratio says ${wantGzip}`);
    }
    expect(wrong).toEqual([]);
    expect(COMPOSER_LEAVES.reduce((n, rel) => n + leaves[rel].ceilingRaw, 0)).toBe(total);
  });

  test('the causal leaf takes NO headroom, and that is the refusal pinned', () => {
    // ARCH §11 refuses wording sets on the causal register in wave one; §12 car 13
    // is owner-gated ("wire or retire"); and at car 2's build the leaf reached no
    // emitted chunk at all. Its ceiling is therefore its own bytes, so a car that
    // grows it must come through a declared row AND a ceiling amendment.
    expect(leaves[CAUSAL_LEAF].ceilingRaw).toBe(genesis[CAUSAL_LEAF].raw);
    expect(leaves[CAUSAL_LEAF].ceilingGzip).toBe(genesis[CAUSAL_LEAF].gzip);
  });
});

describe('the prose byte ratchet — the declared-row chain (the monotone door)', () => {
  test('every declared row is well formed and names a baselined leaf', () => {
    expect(Array.isArray(declared), '`declared` must be an array, even when empty').toBe(true);
    for (const [i, row] of declared.entries()) {
      const where = `declared[${i}]`;
      expect(Object.keys(leaves), `${where} names a leaf with no baseline row`).toContain(row.leaf);
      for (const field of ['car', 'reason']) {
        expect(typeof row[field], `${where}.${field} must be a string`).toBe('string');
        expect(row[field].trim().length, `${where}.${field} is empty; a car that leaves it empty has declared nothing`).toBeGreaterThan(0);
      }
      for (const field of ['fromRaw', 'toRaw', 'gzipAfter']) {
        expect(Number.isInteger(row[field]), `${where}.${field} must be an integer byte count`).toBe(true);
      }
      expect(row.toRaw, `${where}: a declared row exists to RAISE a leaf; a shrink needs no declaration, only a lowered row`).toBeGreaterThan(row.fromRaw);
      expect(row.toRaw, `${where}: declared past ${row.leaf}'s ceiling ${leaves[row.leaf].ceilingRaw}`).toBeLessThanOrEqual(leaves[row.leaf].ceilingRaw);
    }
  });

  test('the chain from genesis reaches today\'s committed bytes for every leaf', () => {
    const broken = [];
    for (const rel of Object.keys(leaves)) {
      const chain = declared.filter((row) => row.leaf === rel);
      let at = genesis[rel].raw;
      for (const [i, row] of chain.entries()) {
        if (row.fromRaw !== at) {
          broken.push(
            `${rel}: declared row ${i} starts at ${row.fromRaw} but the chain stands at ${at}. `
            + `Rows must chain from the genesis measurement without a gap.`,
          );
          at = null;
          break;
        }
        at = row.toRaw;
      }
      if (at === null) continue;
      if (at !== leaves[rel].raw) {
        broken.push(
          `${rel}: the declared chain ends at ${at} but the committed row says ${leaves[rel].raw}. `
          + `A number cannot be raised without a declared row landing on it; a number LOWERED below `
          + `the chain must have its stale declared rows removed with it.`,
        );
      }
      const last = chain[chain.length - 1];
      if (last && last.gzipAfter !== leaves[rel].gzip) {
        broken.push(`${rel}: the last declared row records gzipAfter ${last.gzipAfter}, the committed row says ${leaves[rel].gzip}`);
      }
    }
    expect(broken).toEqual([]);
  });

  test('MUTANT: a chain that stops short of the committed row is caught', () => {
    // A control that cannot fail proves nothing. Drive the same reconstruction over a
    // fabricated baseline in which a leaf's number was raised with no declaration.
    const chainReaches = (genesisRaw, rows, committedRaw) => {
      let at = genesisRaw;
      for (const row of rows) { if (row.fromRaw !== at) return false; at = row.toRaw; }
      return at === committedRaw;
    };
    expect(chainReaches(100, [], 100), 'an undeclared, unchanged leaf must pass').toBe(true);
    expect(chainReaches(100, [], 900), 'a silent raise must be caught').toBe(false);
    expect(chainReaches(100, [{ fromRaw: 100, toRaw: 900 }], 900), 'a declared raise must pass').toBe(true);
    expect(chainReaches(100, [{ fromRaw: 500, toRaw: 900 }], 900), 'a chain with a gap must be caught').toBe(false);
    expect(chainReaches(100, [{ fromRaw: 100, toRaw: 900 }], 950), 'a raise past its own declaration must be caught').toBe(false);
  });
});

describe('the prose byte ratchet — no overlap with the size-baseline instrument (ARCH §11)', () => {
  const sizeBaselinePath = 'scripts/.size-baseline.json';
  const sizeBaselineSrc = readFileSync(join(ROOT, 'tests/lint/sizeBaseline.test.js'), 'utf8');
  const sizeBaselineKeys = Object.keys(JSON.parse(readFileSync(join(ROOT, sizeBaselinePath), 'utf8')))
    .filter((k) => !k.startsWith('_'));

  /** The ceilingFor() layer rules, read out of the size-baseline test's OWN source rather
   *  than replicated here: a replica drifts the first time that function changes, and a
   *  non-overlap guard measuring a stale copy of the other instrument is the vacuous green
   *  the whole tests/lint/ family exists to prevent. */
  function sizeBaselineLayerRules() {
    const from = sizeBaselineSrc.indexOf('function ceilingFor(rel)');
    const body = sizeBaselineSrc.slice(from);
    const fn = body.slice(0, body.indexOf('\nfunction walk('));
    return [...fn.matchAll(/if \((\/.+?\/)\.test\(rel\)\)/g)].map((m) => {
      const parts = m[1].match(/^\/(.*)\/(\w*)$/);
      return new RegExp(parts[1], parts[2]);
    });
  }

  test('anti-vacuity: the layer rules were actually read, and they cover real files', () => {
    const rules = sizeBaselineLayerRules();
    expect(rules.length, 'no ceilingFor() layer rule was extracted — the reader has rotted').toBeGreaterThanOrEqual(5);
    for (const covered of ['src/App.jsx', 'src/domain/explanation.js', 'src/store/settlementSlice.js']) {
      expect(rules.some((re) => re.test(covered)), `${covered} should be covered by a layer rule`).toBe(true);
    }
    expect(sizeBaselineKeys.length, 'the size baseline holds no file rows').toBeGreaterThan(0);
  });

  test('ceilingFor() still returns null for every prose leaf (no byte row can ever land there)', () => {
    const rules = sizeBaselineLayerRules();
    const covered = Object.keys(leaves).filter((rel) => rules.some((re) => re.test(rel)));
    expect(
      covered,
      'a size-baseline LAYER rule now covers a prose leaf. §10 states the consequence: a byte row'
      + ' there becomes a max-lines ceiling on a 641,410-byte generated file and reds BOTH of that'
      + ' instrument\'s consumers. Two instruments, two rulers, no overlap.',
    ).toEqual([]);
  });

  test('the size baseline names no prose leaf, and this baseline names nothing else', () => {
    // Anchored both ways: each collection is proved live by a member that travels the
    // same path as the one being excluded.
    expectAbsentWithAnchor(
      sizeBaselineKeys,
      'src/data/dossierStateProse/general.generated.js',
      // The anchor is a row that is still baselined (src/App.jsx left the baseline when the
      // painted arrow header moved out of the shell, 2026-09-16).
      'src/domain/explanation.js',
      'the size baseline must hold no prose leaf row',
    );
    expectAbsentWithAnchor(
      Object.keys(leaves),
      'src/App.jsx',
      CAUSAL_LEAF,
      'the prose byte baseline must hold no line-ceiling row',
    );
  });

  test('this baseline has exactly one consumer, and eslint is not it', () => {
    const eslintSrc = readFileSync(join(ROOT, 'eslint.config.js'), 'utf8');
    // Liveness anchor first: prove we read the real config, so an empty or moved read
    // reds HERE rather than passing the absence claim below vacuously.
    expect(eslintSrc, 'eslint.config.js no longer reads the size baseline — this reader has rotted').toContain('scripts/.size-baseline.json');
    // A byte row read as a max-lines override would put a ceiling of 641,410 on a generated
    // data file; this map has ONE consumer, and it is this test.
    // anchored: the toContain directly above pins eslintSrc non-empty and pins the sibling path read by the identical readFileSync call, so an emptied or moved read reds there first
    expect(eslintSrc, 'eslint.config.js now reads the prose byte baseline').not.toContain('.prose-byte-baseline.json');
  });
});
