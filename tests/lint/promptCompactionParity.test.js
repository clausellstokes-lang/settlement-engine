/**
 * promptCompactionParity.test.js — every slice-bearing AI prompt goes through
 * compactSlices (C5 bar-7: token-efficiency parity across the edge surfaces).
 *
 * _shared/promptEfficiency.ts's compactSlices is the house slice serializer:
 * canonical compact JSON, a per-task whole-bundle budget, VISIBLE truncation.
 * constructCore / customContentCore / styleOverhaulCore / autonomyCore all use it —
 * but THREE read surfaces ship raw `JSON.stringify(s.data).slice(0, N)` per slice
 * (no compaction, no whole-bundle budget, hard mid-JSON cut): ai-analyst (N=6000,
 * the reviewed finding), plus the interview (6000) and interpret-session (4000)
 * siblings this walker's first run surfaced. This scan makes the parity a contract:
 *   - the known adopters must KEEP importing compactSlices (drift guard);
 *   - each exception is pinned in its CURRENT raw shape — when a fix lands (an
 *     edge-function-lane change; this meta lane only pins it), this test reds
 *     with move-it-to-ADOPTERS instructions, so no exception can go stale;
 *   - any NEW slice-bearing core must adopt compactSlices or be pinned here as a
 *     visible, reviewed exception.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FUNCTIONS = join(ROOT, 'supabase/functions');

// The cores that already serialize retrieval slices through compactSlices.
const ADOPTERS = [
  'supabase/functions/_shared/constructCore.ts',
  'supabase/functions/custom-content/customContentCore.ts',
  'supabase/functions/style-overhaul/styleOverhaulCore.ts',
  'supabase/functions/surveyor-autonomy/autonomyCore.ts',
];

// The pinned exceptions: cores that build slice text RAW. KNOWN-UNCOMPACTED,
// recorded 2026-07-21 (C5 review — the finding named the analyst; this walker's
// first run then surfaced the interview + interpret-session siblings, the same
// shape with their own per-slice cuts). The FIX is an edge-function-lane change
// (route each slicesText through compactSlices with a per-task budget) — outside
// this meta/enforcement lane's fence, so the class is pinned here instead of
// silently drifting. Each value is the raw per-slice cut the file currently uses.
const EXCEPTIONS = Object.freeze({
  'supabase/functions/ai-analyst/analystCore.ts': 6000,
  'supabase/functions/interview/interviewCore.ts': 6000,
  'supabase/functions/interpret-session/interpretCore.ts': 4000,
});

const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

function walkTs(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const fp = join(dir, e.name);
    if (e.isDirectory()) walkTs(fp, out);
    else if (e.name.endsWith('.ts')) out.push(fp);
  }
  return out;
}

/** A file "serializes slices" when it stringifies slice data into prompt text. */
const buildsSliceText = (src) => /\.slices\b/.test(src) && /JSON\.stringify\(\s*s\.data/.test(src);

describe('prompt compaction parity (bar-7)', () => {
  test('every known adopter still routes slices through compactSlices (no drift)', () => {
    for (const rel of ADOPTERS) {
      expect(read(rel).includes('compactSlices'), `${rel} no longer references compactSlices — the token-efficiency seam drifted`).toBe(true);
    }
  });

  test('every exception is pinned in its exact raw shape (a fix must ratchet this down)', () => {
    const stale = [];
    for (const [rel, cut] of Object.entries(EXCEPTIONS)) {
      const src = read(rel);
      const stillRaw = !src.includes('compactSlices') && new RegExp(`\\.slice\\(0,\\s*${cut}\\)`).test(src);
      if (!stillRaw) {
        stale.push(
          `${rel} no longer matches its pinned raw shape (cut ${cut}). If it now uses ` +
          'compactSlices: the parity fix landed — MOVE it into ADOPTERS and delete its ' +
          'EXCEPTIONS entry (lock the win in). If it changed shape while staying ' +
          'uncompacted: re-pin the new shape here so the exception stays visible.',
        );
      }
    }
    expect(stale, `\n${stale.join('\n')}`).toEqual([]);
  });

  test('no NEW slice-serializing core outside the adopter/exception ledger', () => {
    const known = new Set([...ADOPTERS, ...Object.keys(EXCEPTIONS)]);
    const offenders = [];
    for (const abs of walkTs(FUNCTIONS)) {
      const rel = relative(ROOT, abs).split('/').join('/');
      if (known.has(rel)) continue;
      const src = readFileSync(abs, 'utf8');
      if (buildsSliceText(src) && !src.includes('compactSlices')) offenders.push(rel);
    }
    expect(
      offenders,
      `new slice-serializing edge core(s) bypass compactSlices — adopt the _shared/promptEfficiency seam or pin a reviewed exception here:\n  ${offenders.join('\n  ')}`,
    ).toEqual([]);
  });

  test('the detection predicate fires on every exception (the walker is not vacuous)', () => {
    for (const rel of Object.keys(EXCEPTIONS)) {
      expect(buildsSliceText(read(rel)), `${rel} pinned but the predicate no longer sees it`).toBe(true);
    }
    // …and the compaction seam it points authors at actually exists.
    expect(read('supabase/functions/_shared/promptEfficiency.ts')).toMatch(/export function compactSlices/);
  });
});
