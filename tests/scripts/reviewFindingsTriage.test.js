/**
 * reviewFindingsTriage.test.js — the mechanical review-triage harness (LT36 car 8).
 *
 * ⛔ EVERY FIXTURE HERE IS SYNTHETIC, AND THAT IS A REQUIREMENT, NOT A STYLE CHOICE.
 * Commit 0ac348e6d removed the real register (docs/REVIEW_FINDINGS.md,
 * docs/.review_findings.json) from this repo under the owner's 2026-08-10 delegation grant
 * because "a 133-finding security register is an exploit roadmap". Slicing even four real
 * rows in here as a fixture would put a piece of it straight back. The rows below are
 * invented, and they point at a temp directory this test creates and destroys.
 *
 * WHAT IS PINNED:
 *   1. The four mechanical outcomes the harness exists to compute, each against a file it
 *      built itself so the expected answer is known rather than observed.
 *   2. THE IP GUARD, and it is a POSITIVE PRESENCE CHECK on the emitted key set — an exact
 *      `toEqual` over the sorted keys of every emitted row, not a bare absence assertion.
 *      An absence assertion passes just as happily over an empty row, over an empty result
 *      set, or over a renamed field; and tests/lint/contractTestAntiVacuity.walker.test.js
 *      would rightly call it vacuous. Set equality reds when ANY key is added, including a
 *      private one nobody has thought of yet.
 *   3. That the rendered table carries neither the evidence prose nor the suggested fix nor
 *      the finding title, using sentinel strings planted in the fixture — so the guard holds
 *      at the RENDER layer too, not only in the row objects.
 */
import { describe, it, expect, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';

import {
  ROW_KEYS, STATUSES, WINDOW, deriveAnchor, resolveRow, triage, render,
} from '../../scripts/reviewFindingsTriage.mjs';

// Sentinels: if any of these three strings ever reaches an emitted row or the rendered table,
// the harness has leaked the half of the register that must never be printed.
const EVIDENCE_SENTINEL = 'EVIDENCE_PROSE_THAT_MUST_NEVER_BE_PRINTED';
const FIX_SENTINEL = 'SUGGESTED_FIX_THAT_MUST_NEVER_BE_PRINTED';
const TITLE_SENTINEL = 'FINDING_TITLE_THAT_MUST_NEVER_BE_PRINTED';

const roots = [];
afterAll(() => { for (const r of roots) rmSync(r, { recursive: true, force: true }); });

/** A throwaway tree with the three files the synthetic rows point at. */
function fixtureRoot() {
  const root = mkdtempSync(join(tmpdir(), 'review-triage-'));
  roots.push(root);
  const write = (rel, body) => {
    mkdirSync(dirname(join(root, rel)), { recursive: true });
    writeFileSync(join(root, rel), body, 'utf8');
  };
  // 40 lines; the anchor `doThing(arg)` sits on line 20, where its row says it is.
  write('src/present.js', Array.from({ length: 40 }, (_, i) => (
    i === 19 ? '  const out = doThing(arg);' : `  // filler line ${i + 1}`
  )).join('\n'));
  // 200 lines; the anchor sits at line 150 while its row still says line 5.
  write('src/moved.js', Array.from({ length: 200 }, (_, i) => (
    i === 149 ? '  const out = movedThing(arg);' : `  // filler line ${i + 1}`
  )).join('\n'));
  // 8 lines; a row claiming line 900 is out of range.
  write('src/short.js', Array.from({ length: 8 }, (_, i) => `  // short ${i + 1}`).join('\n'));
  return root;
}

/** One synthetic register row, carrying all three sentinels. */
const row = (over) => ({
  title: TITLE_SENTINEL,
  severity: 'medium',
  dim: 'components-core',
  category: 'correctness',
  confidence: 'high',
  evidence: `${EVIDENCE_SENTINEL} — the call \`doThing(arg)\` is unguarded here.`,
  suggested_fix: FIX_SENTINEL,
  verdicts: [],
  confirmed: true,
  tiebroken: false,
  ...over,
});

const REGISTER = {
  confirmed: [
    row({ file: 'src/gone.js', line: 12 }),
    row({
      file: 'src/moved.js',
      line: 5,
      severity: 'low',
      dim: 'lib-services',
      evidence: `${EVIDENCE_SENTINEL} — the call \`movedThing(arg)\` moved.`,
    }),
    row({ file: 'src/present.js', line: 20 }),
    row({
      file: 'src/short.js',
      line: 900,
      severity: 'low',
      dim: 'seams-drift',
      evidence: `${EVIDENCE_SENTINEL} — the call \`shortThing(arg)\` is here.`,
    }),
    // Not triaged by default: the harness's severity filter is medium+low.
    row({ file: 'src/present.js', line: 20, severity: 'high' }),
  ],
  rejected: [],
  pending: [],
};

describe('reviewFindingsTriage — the mechanical resolve', () => {
  const root = fixtureRoot();
  const result = triage(REGISTER, { root });

  it('triages exactly the medium+low rows, leaving the high one out', () => {
    expect(result.confirmedTotal).toBe(5);
    expect(result.total).toBe(4);
    expect(result.rows.map((r) => r.severity)).toEqual(['medium', 'low', 'medium', 'low']);
  });

  it('computes all four mechanical outcomes, each against a file the test built', () => {
    expect(result.rows.map((r) => r.status)).toEqual([
      'FILE_GONE',          // src/gone.js was never written
      'ANCHOR_MOVED',       // movedThing(arg) is at 150, the row says 5
      'ANCHOR_PRESENT',     // doThing(arg) is at 20, the row says 20
      'LINE_OUT_OF_RANGE',  // src/short.js has 8 lines, the row says 900
    ]);
    expect(result.counts).toEqual({
      FILE_GONE: 1, LINE_OUT_OF_RANGE: 1, ANCHOR_PRESENT: 1,
      ANCHOR_MOVED: 1, ANCHOR_ABSENT: 0, NO_ANCHOR: 0,
    });
  });

  it('distinguishes ANCHOR_ABSENT from ANCHOR_MOVED, and NO_ANCHOR from both', () => {
    // A row whose anchor is nowhere in a file that does exist at that line.
    const absent = resolveRow(
      row({ file: 'src/present.js', line: 20, evidence: 'the call `neverThing(arg)` is here.' }),
      0, root,
    );
    expect(absent.status).toBe('ANCHOR_ABSENT');
    // A row whose evidence carries no quotable code span at all.
    const none = resolveRow(
      row({ file: 'src/present.js', line: 20, evidence: 'This component is confusing to read.' }),
      0, root,
    );
    expect(none.status).toBe('NO_ANCHOR');
  });

  it('the ±WINDOW tolerance is what separates PRESENT from MOVED', () => {
    // Same file, same anchor, two line claims either side of the window edge.
    const near = resolveRow(row({ file: 'src/present.js', line: 20 + WINDOW }), 0, root);
    const far = resolveRow(row({ file: 'src/present.js', line: 20 + WINDOW + 1 }), 0, root);
    expect(near.status).toBe('ANCHOR_PRESENT');
    expect(far.status).toBe('ANCHOR_MOVED');
  });

  it('refuses a path that escapes the tree — a register is untrusted input', () => {
    const escape = resolveRow(row({ file: '../../../../etc/hosts', line: 1 }), 0, root);
    expect(escape.status).toBe('FILE_GONE');
  });

  it('every status it can emit is a declared one', () => {
    for (const r of result.rows) expect(STATUSES).toContain(r.status);
  });
});

describe('reviewFindingsTriage — THE IP GUARD', () => {
  const root = fixtureRoot();
  const result = triage(REGISTER, { root });
  const rendered = render(result, { severities: ['medium', 'low'] });

  it('every emitted row carries EXACTLY the allowlisted keys — set equality, not absence', () => {
    // The positive form. An absence assertion would pass over an empty row, an empty result
    // set, or a renamed private field; this reds the moment ANY key appears that nobody put
    // on the allowlist, including one that does not exist yet.
    expect(result.rows.length).toBeGreaterThan(0);
    for (const r of result.rows) {
      expect(Object.keys(r).sort()).toEqual([...ROW_KEYS].sort());
    }
  });

  it('the allowlist itself is the five status facts and nothing that describes a defect', () => {
    expect([...ROW_KEYS].sort()).toEqual(['dim', 'file', 'index', 'line', 'severity', 'status']);
  });

  it('the rendered table prints the status facts and NONE of the three sentinels', () => {
    // Positive first, so the sentinel checks below cannot be passing over an empty string.
    expect(rendered).toContain('src/present.js:20');
    expect(rendered).toContain('ANCHOR_PRESENT');
    expect(rendered).toContain('components-core');
    // …and the three fields that make a register an exploit roadmap are absent from it.
    const leaks = [EVIDENCE_SENTINEL, FIX_SENTINEL, TITLE_SENTINEL].filter((s) => rendered.includes(s));
    expect(leaks).toEqual([]);
  });

  it('the rendered table says out loud that a status is not a verdict', () => {
    expect(rendered).toContain('STATUS ONLY, NEVER A VERDICT');
    expect(rendered).toContain('owner-gated');
  });
});

describe('reviewFindingsTriage — deriveAnchor', () => {
  it('picks the longest code-shaped backticked span', () => {
    expect(deriveAnchor('see `x` and `settlement.trade.goods[0]` and `foo`'))
      .toBe('settlement.trade.goods[0]');
  });

  it('rejects English in backticks, so prose never becomes an anchor', () => {
    expect(deriveAnchor('the `trade goods` are wrong')).toBeNull();
    expect(deriveAnchor('no backticks at all here')).toBeNull();
  });

  it('returns null for a non-string, rather than throwing on a malformed register', () => {
    for (const bad of [null, undefined, 42, {}, [], '']) expect(deriveAnchor(bad)).toBeNull();
  });
});
