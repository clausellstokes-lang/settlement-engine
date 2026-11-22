/**
 * provenanceMap.test.js — the gate on docs/PROVENANCE_MAP.tsv's regeneration.
 *
 * §687.2 landed the map as an instrument that "can be regenerated from the walk
 * at any time", and cited "the walk in ODQ §687.4" — which is "P0 IS ADDED TO THE
 * REGISTER — POISONED DISCHARGES" (ODQ:28775). No walk existed anywhere in the
 * repository, so for as long as the map existed it could not in fact be
 * regenerated, and it went stale by 233 sections without any instrument noticing.
 *
 * ARM 1 IS THE WHOLE ARGUMENT. A generator that produces 900 new rows has no
 * standing unless it first reproduces the 693 hand-derived rows BYTE-FOR-BYTE —
 * all seven columns, including the 110-character header truncation and the
 * abbreviated introducing-commit sha. That is why the CLI REFUSES to write when
 * arm 1's condition fails, and why the first control below mutates a recovered
 * trailer and proves the arm reds: an arm that cannot fail proves nothing.
 *
 * ⛔ THIS FILE RULES NOTHING. Producing provenance rows is P4-mechanical under
 * §685.3 ("executed evidence, re-derivable by any seat"). It does not mark,
 * discharge or validate any section, and it changes no status word or P-ranking
 * anywhere in the register — §685.5(vii) reserves that to the owner at the pass.
 */

import { describe, expect, test } from 'vitest';
import { execFileSync } from 'node:child_process';

import {
  DEFAULT_LEDGER_REF,
  LEGACY_HIGH,
  MAP_PATH,
  buildRow,
  matchOpener,
  readOpeners,
  readLedger,
  regenerate,
  sectionOf,
  textSeat,
} from '../../scripts/audit/provenance-map.mjs';

const committedMapText = execFileSync('git', ['show', `${DEFAULT_LEDGER_REF}:${MAP_PATH}`], {
  encoding: 'utf8',
  maxBuffer: 1024 * 1024 * 64,
});

// One walk, shared by every arm: it is a full `git log` over the ledger file.
const run = regenerate({ committedMapText });

describe('provenance map — the controls', () => {
  test('CONTROL: a mutated recovered trailer makes the row differ — arm 1 can fail', () => {
    const opener = { id: '§0', line: 21, header: '§0 · 2026-07-28 DELEGATED DISPOSITION — current truth' };
    const good = buildRow(opener, { sha: '158624de5abc', trailers: 'Claude Fable 5 <x@y>' });
    expect(good.split('\t')[3]).toBe('Fable 5');
    expect(good.split('\t')[2]).toBe('TRAILER-FABLE');

    const mutated = buildRow(opener, { sha: '158624de5abc', trailers: 'Claude Opus 5 <x@y>' });
    expect(mutated).not.toBe(good);
    expect(mutated.split('\t')[2]).toBe('TRAILER-OPUS');

    // and the committed row is the un-mutated one, so arm 1 would convict
    const committedRow = run.committed.rows.find((r) => sectionOf(r) === '§0');
    expect(committedRow).toBe(good);
    expect(committedRow).not.toBe(mutated);
  });

  test('CONTROL: the legacy epoch refuses a bullet opener, so history is never re-cut', () => {
    // `- **§685.1 …` is a bullet INSIDE §685. The hand walk cut only `## §N`
    // headings, so admitting it would inject a row into history rather than
    // extend it. Above the legacy high-water mark the same form IS an opener.
    expect(matchOpener('- **§685.1 THE ORDER, VERBATIM** (owner, in chat)')).toBeNull();
    expect(matchOpener('## §685 · OWNER DIRECTIVE')?.[1]).toBe('685');
    expect(matchOpener('- **§800.1 OWNER ADDENDUM**')?.[1]).toBe('800.1');
    expect(LEGACY_HIGH).toBe(686);
  });

  test('CONTROL: the two rule epochs read one header differently — §686 is the proof', () => {
    // §686's header carries "SEAT: Opus 5 — Fable-unvalidated", the convention
    // §685 minted. Under the convention in force when §686 was written the hand
    // walk did not read it, and the committed row says TRAILER-FABLE. Applying
    // today's rule to yesterday's section would rewrite history (§687.2 law 12).
    const header = '§686 · GROW-FOLD SEALS (2026-08-26 ~15:20 CDT; SEAT: Opus 5 — Fable-unvalidated)';
    expect(textSeat(header, 'legacy')).toBeNull();
    expect(textSeat(header, 'current')).toBe('OPUS-TEXT');
    expect(run.committed.rows.find((r) => sectionOf(r) === '§686').split('\t')[2]).toBe('TRAILER-FABLE');
  });
});

describe('provenance map — the gate', () => {
  test('arm 1: the walk reproduces every committed row byte-for-byte', () => {
    expect(
      run.mismatches.map((m) => m.id),
      `the generator no longer reproduces the hand-derived rows. It has no standing to assert new ones `
        + `until it does. First mismatch: ${JSON.stringify(run.mismatches[0] ?? null)}`,
    ).toEqual([]);
    expect(run.committed.rows.length).toBeGreaterThanOrEqual(693);
  });

  test('arm 2: every ledger opener has exactly one row, and every row has an opener', () => {
    const openers = readOpeners(readLedger());
    const rowIds = run.rows.map(sectionOf);
    expect(new Set(rowIds).size, 'a section appears twice in the map').toBe(rowIds.length);
    expect(rowIds.slice().sort()).toEqual([...openers.keys()].sort());
  });

  test('arm 3: the committed map is a byte PREFIX of the regenerated map — no row is rewritten', () => {
    // The header block is documentation and is corrected in place; the ROWS are
    // history, and §687.2 law 12 is "the map is ADDITIVE: history is never
    // rewritten". This asserts the rows, in order, byte-for-byte.
    const regeneratedRows = run.output
      .split('\n')
      .filter((l) => l.startsWith('§'));
    expect(regeneratedRows.slice(0, run.committed.rows.length)).toEqual(run.committed.rows);
    expect(regeneratedRows.length).toBe(run.committed.rows.length + run.appended.length);
  });

  test('the map cites its own generator, not ODQ §687.4', () => {
    const header = run.output.split('\n').filter((l) => l.startsWith('#'));
    const regen = header.find((l) => l.startsWith('# Regenerate:'));
    expect(regen).toContain('scripts/audit/provenance-map.mjs');
    // anchored: the line above proves this exact string is non-empty and carries the generator path, so a drifted or missing header reds there first
    expect(regen).not.toContain('§687.4');
    expect(header.some((l) => l.startsWith('# Walked at:'))).toBe(true);
  });
});
