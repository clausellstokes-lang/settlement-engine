/**
 * chooserTotality.walker.test.js — HB-1. THE CHOOSER-TOTALITY STOP LAW, MADE MACHINERY,
 * and the owner's named-domain checklist asserted three separate ways.
 *
 * ⛔ THE LAW: every weighted decision fork in `src/domain` is classified in the habit fork
 * registry. A fork that lands unclassified REDS, and a wave that finds one STOPS.
 *
 * ── THE PARTITION HAS TWO HALVES AND ONE OF THEM IS BLIND ───────────────────────
 *
 * `discovered` is what the FOUR idiom signatures find: the softmax-and-sample pair, the
 * keyed race, an inline extremum over a computed score array, and the explicit register of
 * guard-chain choosers. `classified` is every registry row that is not a checklist row.
 * The two are asserted EXACTLY equal, both directions.
 *
 * ⚠ THE WALKER'S OWN BLIND SPOT, DECLARED rather than discovered later: an argmin over a
 * cost computed in a helper the scan cannot follow, a Bernoulli chance gate, and any fork
 * expressed as an if/else ladder over thresholds are NOT discoverable by signature. Those
 * are covered by the registry's hand-maintained checklist rows, which carry their own
 * totality assertion below — a declared blind spot with a second instrument beside it,
 * never a silent hole.
 *
 * ⭐⭐ THE ROOT-SET SELF-ASSERTION (and it earned its keep on its first run). The scan roots
 * are DECLARED here and then checked against the tree: any `src/domain/*` directory holding
 * a live idiom signature must be one of them. The failure mode this closes was never a
 * missed file, it was a missed PLACE — a totality walker whose roots miss a whole domain
 * directory does not report a gap, it reports SUCCESS. The volume widened its roots once
 * already, for a faith fork living outside them; this arm caught a second directory the
 * widening had missed, holding the very contest one of the owner-named rows depends on.
 *
 * ⚠ DERIVE, DON'T RESTATE. Every denominator below is a QUERY over the registry or the
 * tree. The only hand-written numbers are the two frozen ceilings, which exist precisely so
 * that moving them is a reviewable act rather than a silent one.
 *
 * @enforced-by itself (a source scan plus a registry query; no runtime coupling)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  FORK_ARITIES,
  FORK_CLASS_VOCABULARY,
  FORK_DISPOSITIONS,
  HABIT_FORK_REGISTRY,
  NAMED_DOMAIN_LABELS,
  OWNER_DOMAIN_MAPPING,
} from '../../src/domain/worldPulse/habitForkRegistry.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * THE DECLARED ROOTS. Checked against the tree below, never trusted.
 * @type {readonly string[]}
 */
const SCAN_ROOTS = Object.freeze([
  'src/domain/worldPulse',
  'src/domain/spatial',
  'src/domain/traditions',
  'src/domain/region',
]);

/** The FOUR idiom signatures. The fourth is a register rather than a scan, by design. */
const IDIOM_SIGNATURES = Object.freeze({
  SOFTMAX_SAMPLE: /\b(?:softmaxWeights|stableSampleByWeight)\s*\(/,
  KEYED_RACE: /\bhash01\s*\(/,
  SCORE_EXTREMUM: /\.sort\(\s*\([^)]*\)\s*=>[^;]*?\b[A-Za-z_$][\w$]*\s*\.\s*(?:[A-Za-z_$][\w$]*)?(?:[Ss]core|[Cc]ost|[Ww]eight)\b[^;]*?\)\s*\[\s*0\s*\]/,
});

/**
 * THE FOURTH SIGNATURE: guard-chain choosers cannot be found by shape, because a chain of
 * early returns looks like any other chain. One member today, and it is registered rather
 * than omitted because it was carried as a learning site in one table while two others
 * already ruled it deterministic.
 */
const GUARD_CHAIN_CHOOSERS = Object.freeze([
  'src/domain/worldPulse/espionage/espionageMath.js#deliberationRead',
]);

/** A module that DECLARES an idiom helper is not using it. */
const DECLARES_IDIOM = /(?:export\s+)?function\s+(?:hash01|softmaxWeights|stableSampleByWeight)\s*\(/;

/**
 * THE DEFER CEILING, exact in BOTH directions. Growth means a fork JOINED the defer list,
 * which the stop law forbids — a newly discovered fork is a chair-sized event, not an
 * automatic deferral. A shrink means a row found its close, and the number moves DOWN in
 * that same commit so the win is banked and the slot cannot be refilled unreviewed. This is
 * the argued-roster idiom, and it is why the constant is a COUNT rather than a list: a list
 * would restate what the registry already answers.
 */
const DEFER_CEILING = 29;

/** The named-domain checklist's row count, asserted rather than read off. */
const NAMED_DOMAIN_ROWS = 14;

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.js$/.test(p) && !/\.test\./.test(p)) out.push(p);
  }
  return out;
}

/**
 * Comments and import specifiers blanked, OFFSETS PRESERVED. Without this the scan reads a
 * JSDoc mention and an import line as uses — the narrower-than-claim defect class in its
 * other direction.
 * @param {string} src @returns {string}
 */
function codeOnly(src) {
  const stripped = src
    .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:])\/\/[^\n]*/g, (m, lead) => lead + ' '.repeat(m.length - lead.length));
  return stripped.replace(
    /^\s*(?:import|export)\b[^\n]*?from\s*['"][^'"]*['"];?[^\n]*$/gm,
    (m) => ' '.repeat(m.length),
  );
}

/** The nearest preceding top-level declaration name at an offset. */
function enclosingSymbol(code, index) {
  const decl = /^(?:export\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)|^(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=/gm;
  let best = null;
  for (const m of decl.exec ? [...code.matchAll(decl)] : []) {
    if (m.index > index) break;
    best = m[1] || m[2];
  }
  return best;
}

const DOMAIN_FILES = walk(join(ROOT, 'src/domain'))
  .map((p) => relative(ROOT, p).replace(/\\/g, '/'))
  .sort();

const IN_ROOTS = DOMAIN_FILES.filter((rel) => SCAN_ROOTS.some((r) => rel.startsWith(`${r}/`)));

/** Every `module#symbol` a signature finds inside the declared roots. */
function scanIdiomForks(files) {
  const found = new Set();
  for (const rel of files) {
    const code = codeOnly(readFileSync(join(ROOT, rel), 'utf8'));
    if (DECLARES_IDIOM.test(code)) continue;
    for (const re of Object.values(IDIOM_SIGNATURES)) {
      for (const m of code.matchAll(new RegExp(re.source, 'g'))) {
        found.add(`${rel}#${enclosingSymbol(code, m.index) || '<module>'}`);
      }
    }
  }
  return [...found].sort();
}

const DISCOVERED = [...new Set([...scanIdiomForks(IN_ROOTS), ...GUARD_CHAIN_CHOOSERS])].sort();
const CLASSIFIED = HABIT_FORK_REGISTRY
  .filter((row) => row.discovery !== 'checklist')
  .map((row) => `${row.module}#${row.symbol}`)
  .sort();
const CHECKLIST_ROWS = HABIT_FORK_REGISTRY.filter((row) => row.discovery === 'checklist');
const DOMAIN_ROWS = HABIT_FORK_REGISTRY.filter((row) => row.domain !== null);

/** module#symbol -> its rows, for the two uniqueness arms. */
const BY_SYMBOL = new Map();
for (const row of HABIT_FORK_REGISTRY) {
  if (!row.symbol) continue;
  const key = `${row.module}#${row.symbol}`;
  BY_SYMBOL.set(key, [...(BY_SYMBOL.get(key) || []), row]);
}

describe('HB-1 — the chooser-totality partition and the named-domain checklist', () => {
  test('the scan, the roots and the registry are all real (guard the guard)', () => {
    // Every absence and every equality below is worthless if the walk, the detectors or the
    // registry silently emptied. The positive control is a chooser everyone agrees is
    // there: the estate's anchor softmax.
    expect(DOMAIN_FILES.length).toBeGreaterThan(400);
    expect(IN_ROOTS.length).toBeGreaterThan(300);
    expect(HABIT_FORK_REGISTRY.length).toBeGreaterThan(20);
    expect(Object.keys(IDIOM_SIGNATURES)).toHaveLength(3);
    expect(DISCOVERED).toContain('src/domain/worldPulse/settlementStrategy.js#evaluateSettlementStrategyRules');
    expect(DISCOVERED.length).toBeGreaterThan(GUARD_CHAIN_CHOOSERS.length);
  });

  test('⭐ THE ROOT SET is asserted against the tree — no domain directory with a live idiom escapes it', () => {
    const declared = new Set(SCAN_ROOTS);
    const missed = new Set();
    for (const rel of DOMAIN_FILES) {
      const directory = rel.split('/').slice(0, 3).join('/');
      if (declared.has(directory)) continue;
      const code = codeOnly(readFileSync(join(ROOT, rel), 'utf8'));
      if (DECLARES_IDIOM.test(code)) continue;
      if (Object.values(IDIOM_SIGNATURES).some((re) => re.test(code))) missed.add(directory);
    }
    expect(
      [...missed].sort(),
      'a src/domain directory holds a live idiom signature and is NOT in SCAN_ROOTS. A'
      + ' totality walker whose roots miss a whole domain directory does not report a gap —'
      + ' it reports SUCCESS. Widen SCAN_ROOTS and classify what the widening discovers.',
    ).toEqual([]);
  });

  test('⭐⭐ THE PARTITION: every discovered fork is classified, and every classified fork is discovered', () => {
    const unclassified = DISCOVERED.filter((key) => !CLASSIFIED.includes(key));
    expect(
      unclassified,
      'an unclassified weighted decision fork is live in the tree. THE STOP LAW: a wave that'
      + ' finds one STOPS — it does not file it as a deferral on the way past.',
    ).toEqual([]);
    const phantom = CLASSIFIED.filter((key) => !DISCOVERED.includes(key));
    expect(
      phantom,
      'the registry classifies a fork no signature finds. Either the symbol moved and the'
      + ' row must be re-aimed, or the row belongs on the CHECKLIST half, which is the'
      + ' hand-maintained instrument for forks no signature can see.',
    ).toEqual([]);
    expect(CLASSIFIED).toEqual(DISCOVERED);
  });

  test('no symbol carries TWO dispositions, and none carries TWO arities', () => {
    // Two assertions over two fields, because a guard over one cannot police the other.
    // The arity arm exists on an executed instance: one chooser read as flatly dyadic in one
    // table and per-action in two others, while all three agreed on the disposition — so the
    // disposition arm passed green on a record that told an implementer to bind a
    // counterpart to ten moves that have none.
    const symbolsWithTwoDispositions = [...BY_SYMBOL]
      .filter(([, rows]) => new Set(rows.map((r) => r.disposition)).size > 1)
      .map(([key]) => key).sort();
    expect(symbolsWithTwoDispositions).toEqual([]);
    const symbolsWithTwoArities = [...BY_SYMBOL]
      .filter(([, rows]) => new Set(rows.filter((r) => r.arity).map((r) => r.arity)).size > 1)
      .map(([key]) => key).sort();
    expect(symbolsWithTwoArities).toEqual([]);
    for (const row of HABIT_FORK_REGISTRY) {
      expect(FORK_DISPOSITIONS).toContain(row.disposition);
      if (row.arity !== null) expect(FORK_ARITIES).toContain(row.arity);
      for (const cls of row.circumstanceClasses) expect(FORK_CLASS_VOCABULARY).toContain(cls);
    }
  });

  test('every DEFER row carries a written close owed, and the defer list is exact', () => {
    const deferred = HABIT_FORK_REGISTRY.filter((row) => row.disposition === 'DEFER');
    const silent = deferred
      .filter((row) => !row.closeOwed || String(row.closeOwed).trim().length < 20)
      .map((row) => row.forkId);
    expect(
      silent,
      'a deferred fork carries no written close owed. An absent reason is how a blind spot'
      + ' signs its own clearance — the deferral has to say what would have to exist.',
    ).toEqual([]);
    expect(
      deferred.length,
      'the defer list CHANGED SIZE. If it GREW, a fork joined it — the stop law forbids that:'
      + ' a newly discovered fork is a chair conversation, not an automatic deferral. If it'
      + ' SHRANK, a row found its close: lower DEFER_CEILING in this same commit so the win'
      + ' is banked and the slot cannot be refilled unreviewed.',
    ).toBe(DEFER_CEILING);
    expect(new Set(HABIT_FORK_REGISTRY.map((row) => row.forkId)).size)
      .toBe(HABIT_FORK_REGISTRY.length);
    // ⛔ NOT ONE ROW SAYS LEARN AT THIS WAVE. The registry is born seeing the whole surface.
    expect(HABIT_FORK_REGISTRY.filter((row) => row.disposition === 'LEARN')).toEqual([]);
  });

  test('J-HB-23 (a) — FOURTEEN named-domain rows, each with a disposition and a non-empty reason', () => {
    expect(
      DOMAIN_ROWS.length,
      'the named-domain checklist changed size. The owner named these domains BY NAME, and a'
      + ' row inside another table is a row that gets lost — a table edit and its count are'
      + ' ONE edit.',
    ).toBe(NAMED_DOMAIN_ROWS);
    for (const row of DOMAIN_ROWS) {
      expect(FORK_DISPOSITIONS, `${row.forkId} has no recognised disposition`).toContain(row.disposition);
      expect(String(row.reason || '').length, `${row.forkId} is dispositioned without a reason`)
        .toBeGreaterThan(40);
    }
    // The checklist half is the declared blind spot's instrument, so it must be non-empty
    // independently of the idiom half — otherwise the "second instrument" is a sentence.
    expect(CHECKLIST_ROWS.length).toBeGreaterThan(0);
  });

  test('J-HB-23 (b) — the label set is SET-EQUAL both directions to the closed explicit eight', () => {
    const used = [...new Set(DOMAIN_ROWS.map((row) => row.domain))].sort();
    // ⛔ A DISTINCT-STRING COUNT IS THE VACUOUS FORM AND IS REFUSED: it passes green on a
    // table that dropped one label and misspelled another twice. This is set equality.
    expect(used).toEqual([...NAMED_DOMAIN_LABELS].sort());
    expect(NAMED_DOMAIN_LABELS).toHaveLength(8);
    expect(new Set(NAMED_DOMAIN_LABELS).size).toBe(NAMED_DOMAIN_LABELS.length);
  });

  test('J-HB-23 (c) — the owner\'s SEVEN spoken domains map TOTAL onto those eight labels', () => {
    const spoken = Object.keys(OWNER_DOMAIN_MAPPING);
    expect(spoken).toHaveLength(7);
    const covered = new Set();
    for (const [domain, labels] of Object.entries(OWNER_DOMAIN_MAPPING)) {
      expect(labels.length, `the owner domain "${domain}" maps to nothing`).toBeGreaterThan(0);
      for (const label of labels) {
        expect(NAMED_DOMAIN_LABELS, `"${domain}" maps to an unknown label ${label}`).toContain(label);
        covered.add(label);
      }
    }
    // TOTAL in both directions: every label is reached by some spoken domain, and the one
    // domain that reaches TWO is exactly why the label count is eight while the owner's is
    // seven. Writing the mapping down is what stops a later round "correcting" one into the
    // other.
    expect([...covered].sort()).toEqual([...NAMED_DOMAIN_LABELS].sort());
    expect(Object.values(OWNER_DOMAIN_MAPPING).filter((labels) => labels.length > 1)).toHaveLength(1);
  });
});
