// @vitest-environment node
/**
 * sourceCitationIntegrity.walker.test.js — A CITED LINE NUMBER IS A CLAIM, AND
 * NOTHING IN THIS ESTATE HAD EVER CHECKED ONE (FIX-C2, ODQ §934.47 addendum 44).
 *
 * ── THE CLASS ────────────────────────────────────────────────────────────────
 * The estate carries 14,604 `<path>:<line>` citations across 471 files. Measured
 * 2026-09-20, ZERO of them were truth-guarded and 64 were form-guarded: the
 * prose-wiring census asserts only that a `cite:` field CONTAINS a colon, and the
 * three baselines that hold line numbers REGENERATE them rather than assert them
 * (their own headers record "88 pure line moves" and "re-addresses 238 → 373" as
 * routine). So an address is written once, is true for a day, and then an
 * unrelated insertion six lines above it silently makes it false — eleven
 * citations of one `Primitives.jsx` address rotted together that way, all by
 * exactly six.
 *
 * The sharpest case is not a comment. `subsystemRowsWar.js` carried SEVEN
 * citations past the end of `warDeployment.js` (a 1,338-line file cited as far
 * as 2,133), TWO of them inside executable strings that ship as the `other:`
 * evidence prose of certification rows. The file had been decomposed into
 * `warHomeCosts.js` and `warSiegeVerdict.js`; the evidence kept naming the old
 * module at the old line.
 *
 * Even the instrument that measures the estate's tuning had rotted: of the three
 * hand-written `realHome` addresses in `scripts/count-tuning-inventory.mjs`, one
 * was off by 11 and one was off by one INTO THE WRONG SEMANTIC ARM.
 *
 * ── ARM 1 · THE EOF ARM, OVER LIVE CODE (GATE-WIRED, NO BASELINE) ────────────
 * A citation whose line is past the end of the file it addresses cannot be right,
 * whatever it meant to name. No symbol, no heuristic, no judgment. Measured over
 * the whole live-code corpus it has ZERO false positives and reaches 100% of
 * RESOLVABLE citations, where the symbol arm reaches 5.6%. `src/`, `tests/` and
 * `scripts/` carry NO baseline: past-EOF there is always red.
 *
 * ── ARM 2 · THE EOF ARM, OVER LIVE DOCS (SHRINK-ONLY BASELINE) ───────────────
 * The same objective test over `docs/`, against .source-citation-baseline.json —
 * the prose-numerics idiom. A NEW past-EOF citation reds; a baselined row that
 * has cleared also reds, with "delete its entry", so the set can only fall. The
 * baseline holds the SET (citing file × address), never counts, because a count
 * assertion would red every time a document legitimately restates an address it
 * already carries, and a gate that reds on correct behaviour gets turned off.
 *
 * ⚠ THE ARCHIVAL EXCLUSION, MEASURED AND LISTED. 29 documents are frozen records
 * of their day, and re-addressing them to today's tree would FALSIFY a record
 * rather than repair it — `docs/review-r2/VERIFY_SUBSYSTEMS_RESULTS.json` pins a
 * sha and states that all its cited lines matched AT THAT SHA. They carry 377
 * past-EOF citations this gate deliberately does not see. FOUR rules select them,
 * each checkable, and the full roster is committed in the baseline's
 * `archivalExclusionAtFreeze.files`:
 *   tree (16)    docs/review-r2/**, docs/shift-records/**
 *   banner (7)   a blockquote status banner naming HISTORICAL in the opening ten
 *                lines — the estate's OWN marker (docs/README.md §"HISTORICAL —
 *                point-in-time audit / plan / status exhaust (not maintained)"):
 *                A_PLUS_ROADMAP, CAPABILITY_REMEDIATION_PLAN,
 *                GENERATION_COHERENCE_AUDIT, LANDING_HANDOFF_AMENDMENTS,
 *                SIMULATION_LOGIC_AUDIT, SOL_QUEUE, UIUX_AUDIT_AND_PLAN
 *   dated (5)    an ISO date in the filename: the three COMPREHENSIVE_REVIEWs,
 *                HANDOFF_2026-08-01_PAUSE, SIM-SEALS-SURVEY-2026-09-19
 *   sha-pin (1)  a header that pins the tree it describes (`**Snapshot base:**`):
 *                SETTLEMENT_CAPABILITY_ATLAS
 * The BLOCKQUOTE is required, not decoration: docs/README.md discusses the word
 * HISTORICAL in body prose while being the most live document in the tree, and a
 * bare word match excluded it. A first pass tried "any hex sha in the header"
 * instead and swallowed 269 of 493 documents including live design specs — the
 * measurement is in the lane report. The bias is deliberate and one-directional:
 * a live document wrongly baselined costs one row, a frozen one wrongly excluded
 * costs a permanent blind spot, so anything not provably frozen is INCLUDED.
 *
 * ── ARM 3 · THE SYMBOL ARM (REPORT-ONLY, LIVE CODE) ──────────────────────────
 * A citation whose adjacent backticked symbol is not on the cited line. It never
 * fails the gate, and the reason is arithmetic rather than caution: a citation is
 * symbol-checkable only when the name and the number sit on the SAME line, which
 * is true of 5.6% of live-code citations. The charter's own example is invisible
 * to it — `bearerSituation` is named on the line ABOVE its address. Widening the
 * window to a paragraph pushed the measured finding count from 38 to 8,120, on
 * common nouns ("tabs", "source", "settlement") read as symbols. Precision and
 * coverage trade directly, and this arm keeps the precision and prints what it
 * sees, exactly as proseWiringCensus gates three identities and reports the rest.
 *
 * ── WHAT THIS WALKER CANNOT SEE (measured, not guessed) ──────────────────────
 *   · a citation whose target does not resolve — 357 point at files absent from
 *     this tree, 170 at an ambiguous basename, 12 at vendored `node_modules`
 *     builds. Unresolvable is SKIPPED, never convicted: this gate judges only an
 *     address it can read, which is also what makes the synthetic `fixture.ts:1`
 *     inside a test assertion a non-event rather than an allowlist entry.
 *   · a bare `:NNN` inheriting its path from earlier in the sentence.
 *   · a stale address that still lands inside the file.
 *
 * ⚠ IT READS FROM DISK, DELIBERATELY. `git grep` without a rev reads the INDEX,
 * and the mutation sweep proves this gate by PLANTING an untracked file, so an
 * index-based walk would be blind to its own mutant.
 *
 * ⚠ ONE FILE IS EXCLUDED BY NAME: .source-citation-baseline.json, which is a
 * register of convicted addresses and would otherwise convict this gate of its
 * own findings. Nothing else is exempt, including this file — its own citations
 * are written to be true.
 *
 * @enforced-by scripts/mutation-sweep.sh ("citations/past-EOF citation planted")
 */
import { describe, expect, test } from 'vitest';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';

import {
  BASELINE_REL,
  CODE_TREES,
  archivalReason,
  buildTargetIndex,
  citationsIn,
  citedLines,
  collectFiles,
  createReader,
  eofFindings,
  partitionDocs,
  rowKey,
  symbolFindings,
} from './sourceCitationIntegrity.shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const read = createReader(ROOT);
const resolve = buildTargetIndex(ROOT);
const codeFiles = CODE_TREES.flatMap((tree) => collectFiles(ROOT, tree));
const docs = partitionDocs(ROOT, read);
const stats = { seen: 0, resolvable: 0 };
const codeEof = eofFindings({ files: codeFiles, resolve, read, stats });
const docsEof = eofFindings({ files: docs.live, resolve, read });

const baseline = JSON.parse(readFileSync(join(ROOT, BASELINE_REL), 'utf8'));
const baselinedRows = new Set(baseline.rows.map(rowKey));

/** One finding, as a line a reader can act on without opening the tree. */
const fmt = (r) => `  ${r.from}:${r.line}  cites ${r.cite}  but ${r.target} has ${r.targetLines} lines`;

describe('source citation integrity — the controls (each proves an arm can RED)', () => {
  /** A synthetic estate: three files, no disk. */
  const files = { 'a/one.js': ['line1', 'line2', 'line3'], 'b/two.md': [] };
  const fakeRead = (rel) => files[rel] ?? null;
  const fakeResolve = (token) => (token === 'one.js' || token === 'a/one.js' ? 'a/one.js' : null);
  const cite = (text) => {
    files['b/two.md'] = [text];
    return eofFindings({ files: ['b/two.md'], resolve: fakeResolve, read: fakeRead });
  };

  test('CONTROL: a citation past the end of its target is convicted', () => {
    const found = cite('see `one.js:9` for the roster');
    expect(found.map((r) => r.cite)).toEqual(['one.js:9']);
    expect(found[0].targetLines).toBe(3);
  });

  test('CONTROL: the same citation acquits the moment it lands inside the file', () => {
    expect(cite('see `one.js:3` for the roster')).toEqual([]);
    expect(cite('see `one.js:1` for the roster')).toEqual([]);
  });

  test('CONTROL: an unresolvable target is SKIPPED, never convicted', () => {
    // A vendored build, an absent file, an ambiguous basename and the synthetic
    // `fixture.ts:1` inside a test assertion all land here. Convicting them would
    // make the gate a liar about files it cannot read.
    expect(cite('see `nowhere.js:9999` for the roster')).toEqual([]);
  });

  test('CONTROL: ranges and lists are parsed, and a range is an INTERVAL', () => {
    // A naive split(':') sees neither form. And endpoints-only reading called a
    // true citation stale: `tuningRegister.walker.test.js:75-91` names a constant
    // declared at :84.
    expect(citationsIn('`one.js:1-17` and `one.js:211,229`').map((c) => c.spec)).toEqual(['1-17', '211,229']);
    expect([...citedLines('75-91')]).toContain(84);
    expect([...citedLines('4,9')].sort((a, b) => a - b)).toEqual([4, 9]);
    // The last number of a range is checked too, not only its opening.
    expect(cite('see `one.js:1-9` for the roster').length).toBe(0);
    expect(cite('see `one.js:8-9` for the roster').length).toBe(1);
  });

  test('CONTROL: the symbol arm convicts a moved symbol and acquits a present one', () => {
    files['a/one.js'] = ['const alpha = 1;', 'const beta = 2;', 'const gammaRay = 3;'];
    const stale = { 'b/two.md': ['`gammaRay` lives at `one.js:1`'] };
    const fresh = { 'b/two.md': ['`gammaRay` lives at `one.js:3`'] };
    const readOf = (bank) => (rel) => (rel === 'a/one.js' ? files['a/one.js'] : bank[rel] ?? null);
    expect(symbolFindings({ files: ['b/two.md'], resolve: fakeResolve, read: readOf(stale) })
      .map((r) => r.symbol)).toEqual(['gammaRay']);
    expect(symbolFindings({ files: ['b/two.md'], resolve: fakeResolve, read: readOf(fresh) })).toEqual([]);
    files['a/one.js'] = ['line1', 'line2', 'line3'];
  });

  test('CONTROL: the archival rule DISCRIMINATES — it is four checkable predicates, not a hunch', () => {
    const bank = {
      'docs/LIVE.md': ['# live', 'body'],
      'docs/BANNERED.md': ['# t', '', '> **⚠️ HISTORICAL (audit snapshot) — do NOT read as current state.**'],
      'docs/PROSE.md': ['# t', '', '**HISTORICAL** docs are point-in-time exhaust, unlike this index.'],
      'docs/PINNED.md': ['# t', '', '**Snapshot base:** `composite-r4 @ 8033ddbe`'],
      'docs/SNAP_2026-07-13.md': ['# t'],
      'docs/review-r2/RESULTS.json': ['{}'],
    };
    const r = (rel) => bank[rel] ?? null;
    expect(archivalReason('docs/review-r2/RESULTS.json', r)).toBe('tree');
    expect(archivalReason('docs/SNAP_2026-07-13.md', r)).toBe('dated');
    expect(archivalReason('docs/BANNERED.md', r)).toBe('banner');
    expect(archivalReason('docs/PINNED.md', r)).toBe('sha-pin');
    expect(archivalReason('docs/LIVE.md', r)).toBeNull();
    // The blockquote is load-bearing: docs/README.md names HISTORICAL in body
    // prose and is the most live document in the tree.
    expect(archivalReason('docs/PROSE.md', r)).toBeNull();
  });
});

describe('source citation integrity — the live estate', () => {
  test('guard-the-guard: the walk reached the corpus and resolved real targets', () => {
    // Every arm below would pass vacuously on an empty walk. Floors are measured
    // against this tree and TIGHTEN toward reality; they are never lowered to
    // admit a shrinking scan.
    expect(codeFiles.length, 'the src/tests/scripts walk collapsed').toBeGreaterThanOrEqual(5000);
    expect(docs.all.length, 'the docs walk collapsed').toBeGreaterThanOrEqual(480);
    expect(docs.live.length, 'the live-docs corpus collapsed').toBeGreaterThanOrEqual(450);
    expect(stats.seen, 'the citation parser matched nothing').toBeGreaterThanOrEqual(700);
    expect(stats.resolvable, 'the target index resolved nothing').toBeGreaterThanOrEqual(600);
    expect(resolve('sourceCitationIntegrity.shared.mjs')).toBe('tests/lint/sourceCitationIntegrity.shared.mjs');
    // An ambiguous basename must resolve to NOTHING rather than to a coin flip.
    expect(resolve('index.js')).toBeNull();
  });

  test('ARM 1 — NO citation in src/, tests/ or scripts/ points past the end of its target', () => {
    expect(
      codeEof.map(fmt),
      '\nA live-code citation addresses a line that does not exist. The file it names was'
      + ' decomposed, truncated or replaced, and the address was never re-verified — the'
      + ' subsystemRowsWar class (ODQ §934.47 addendum 44). Open the citing line, find the'
      + ' symbol its sentence NAMES, locate that symbol in the target, and write its true'
      + ' line. There is no baseline for live code and there will not be one.\n',
    ).toEqual([]);
  });

  test('ARM 2 — ONLY-SHRINKS: no NEW past-EOF citation in a live document', () => {
    const novel = docsEof.filter((r) => !baselinedRows.has(rowKey(r)));
    expect(
      novel.map(fmt),
      `\nNEW past-EOF citation(s) in live documentation, against ${BASELINE_REL}.`
      + ' Re-address the citation to the symbol its sentence names. This baseline never'
      + ' grows: a new row is a red, not an entry. If the document is a frozen record of'
      + ' its day, give it the estate\'s own HISTORICAL banner rather than editing this'
      + ' gate — the archival rules are listed in this file\'s header.\n',
    ).toEqual([]);
  });

  test('ARM 2 — ONLY-SHRINKS: every baselined row is still live — delete it when it clears', () => {
    const live = new Set(docsEof.map(rowKey));
    const cleared = [...baselinedRows].filter((k) => !live.has(k)).sort();
    expect(
      cleared,
      `\n${cleared.length} baselined past-EOF citation(s) no longer exist. The ratchet only`
      + ` shrinks, so the win is banked by DELETING these rows from ${BASELINE_REL}`
      + ' (the "rows" array; leave frozenAt alone).\n',
    ).toEqual([]);
  });

  test('ARM 3 — REPORT-ONLY: citations whose named symbol has moved', () => {
    const findings = symbolFindings({ files: codeFiles, resolve, read });
    // Never an assertion on the count: this arm exists to be READ, and a ratchet
    // over a 5.6%-coverage heuristic would freeze the heuristic, not the estate.
    const lines = findings.map(
      (r) => `  ${r.from}:${r.line}  cites ${r.cite}  but \`${r.symbol}\` is declared at `
        + `${r.declaredAt.slice(0, 4).join(', ')} in ${r.target}`,
    );
    // ⚠ process.stdout.write, NOT console.log, and this is measured rather than
    // stylistic. Under vitest 4.1.8's DEFAULT reporter a passing test's
    // console.log is DROPPED — probed on this tree 2026-09-20, both channels in
    // one passing test: process.stdout survived the default reporter and
    // --reporter=verbose, console.log only the latter. A report-only arm whose
    // report nobody can read is a false instrument, and this walker exists
    // because false instruments are the class.
    process.stdout.write(
      `\nSYMBOL ARM (report-only): ${findings.length} citation(s) whose named symbol is not on the cited line.\n`
      + `${lines.join('\n')}\n\n`,
    );
    expect(Array.isArray(findings)).toBe(true);
  });

  test('the archival exclusion is still the set this walker documents', () => {
    // An exclusion nobody counts is an exclusion nobody audits. If a document
    // acquires or loses its frozen-record marks, the header above and the
    // committed roster must move WITH it, deliberately.
    const byRule = {};
    for (const { reason } of docs.archival) byRule[reason] = (byRule[reason] ?? 0) + 1;
    expect(
      byRule,
      'the archival roster moved. Re-measure, update archivalExclusionAtFreeze in '
      + `${BASELINE_REL} and the header of this file, and say in the commit which `
      + 'document changed class and why.',
    ).toEqual(baseline.archivalExclusionAtFreeze.byRule);
  });
});
