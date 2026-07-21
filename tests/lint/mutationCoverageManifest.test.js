/**
 * mutationCoverageManifest.test.js — E-A MUTATION-SWEEP TOTALITY (A+ tranche 2,
 * bar 1 CORRECTNESS).
 *
 * scripts/mutation-sweep.sh proves invariants' removers by planting regressions
 * and asserting the gate reds (with an attribution control). This meta-test
 * closes the totality class STRUCTURALLY: every correctness-asserting invariant
 * test file (enumeration rule: ./mutationCoverage.shared.mjs) must appear in
 * scripts/mutation-coverage-manifest.json as one of
 *   - mutation  — a planted sweep regression proves it reds (label joins to a
 *                 check_caught* call in the sweep script);
 *   - rationale — a documented reason mutation-testing is redundant or
 *                 disproportionate;
 *   - uncovered — a known gap counted against uncoveredBaseline.
 *
 * ENFORCED HERE:
 *   1. TOTALITY   — a NEW invariant file with no manifest entry REDS; a stale
 *                   entry whose file vanished REDS.
 *   2. LABEL JOIN — every manifest "mutation" label exists in the sweep script,
 *                   every sweep label is claimed by exactly one entry (no
 *                   phantom coverage, no orphan mutation, no double-claim).
 *   3. SHRINK-ONLY— the uncovered count equals uncoveredBaseline EXACTLY:
 *                   above fails (new invariants need a mutation or a rationale,
 *                   never a silent gap); below fails demanding the baseline be
 *                   LOWERED so the win is banked (the sizeBaseline honesty
 *                   idiom). Drive toward 0.
 *
 * TO COMPLY when this reds:
 *   - added an invariant test → plant a sweep mutation for it (preferred) or
 *     add a rationale entry with a written reason; do NOT mark it uncovered.
 *   - upgraded an uncovered entry → lower uncoveredBaseline by one.
 *   - renamed/deleted a test → update or remove its manifest entry.
 *   - renamed a sweep label → update the claiming manifest entry (labels are
 *     the join key; keep them stable).
 */
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { enumerateInvariants, parseSweepLabels } from './mutationCoverage.shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const manifest = JSON.parse(readFileSync(join(ROOT, 'scripts/mutation-coverage-manifest.json'), 'utf8'));
const sweepSrc = readFileSync(join(ROOT, 'scripts/mutation-sweep.sh'), 'utf8');
const sweepLabels = parseSweepLabels(sweepSrc);
const enumerated = enumerateInvariants(ROOT);
const invariantEntries = Object.entries(manifest.invariants);
const metaEntries = Object.entries(manifest.meta ?? {});

describe('mutation-coverage manifest — the totality contract (E-A)', () => {
  test('guard-the-guard: enumeration and label parsing are not vacuous', () => {
    // If the enumerator or the label regex silently broke, everything below
    // would pass on empty sets. Today: 342 invariant files, 22 sweep labels.
    expect(enumerated.length).toBeGreaterThanOrEqual(300);
    expect(sweepLabels.length).toBeGreaterThanOrEqual(22);
    expect(new Set(sweepLabels).size, 'duplicate labels in mutation-sweep.sh — labels are the join key and must be unique').toBe(sweepLabels.length);
  });

  test('TOTALITY: every enumerated invariant file has a manifest entry', () => {
    const missing = enumerated.filter((rel) => !(rel in manifest.invariants));
    expect(
      missing,
      `\nInvariant test file(s) with NO mutation-coverage entry. For each: plant a `
      + `regression in scripts/mutation-sweep.sh proving it reds (preferred), or add a `
      + `rationale entry to scripts/mutation-coverage-manifest.json with a written reason. `
      + `Do NOT add it as uncovered — the gap list only shrinks:\n${missing.join('\n')}\n`,
    ).toEqual([]);
  });

  test('no stale entries: every manifest invariant key is an enumerated, existing file', () => {
    const enumeratedSet = new Set(enumerated);
    const stale = invariantEntries
      .map(([rel]) => rel)
      .filter((rel) => !enumeratedSet.has(rel) || !existsSync(join(ROOT, rel)));
    expect(
      stale,
      `manifest entries whose file vanished or left the enumeration rule — remove or update them:\n${stale.join('\n')}`,
    ).toEqual([]);
  });

  test('every entry is well-formed (kind, label, rationale resolution)', () => {
    const problems = [];
    for (const [key, entry] of [...invariantEntries, ...metaEntries]) {
      if (!['mutation', 'rationale', 'uncovered'].includes(entry.kind)) {
        problems.push(`${key}: unknown kind "${entry.kind}"`);
        continue;
      }
      if (entry.kind === 'mutation' && !entry.label) problems.push(`${key}: mutation entry with no label`);
      if (entry.kind === 'rationale') {
        const text = entry.rationale ?? manifest.rationales?.[entry.ref];
        if (!text || text.length < 40) problems.push(`${key}: rationale missing/too thin — a documented reason is the contract`);
      }
      if (entry.kind === 'uncovered' && key.startsWith('meta:')) problems.push(`${key}: meta invariants may not be uncovered — they exist only because the sweep proves them`);
    }
    expect(problems).toEqual([]);
  });

  test('LABEL JOIN: manifest mutation claims and sweep labels match one-to-one', () => {
    const claimed = [...invariantEntries, ...metaEntries]
      .filter(([, e]) => e.kind === 'mutation')
      .map(([key, e]) => ({ key, label: e.label }));
    const labelSet = new Set(sweepLabels);
    const phantom = claimed.filter(({ label }) => !labelSet.has(label));
    expect(
      phantom.map(({ key, label }) => `${key} claims "${label}"`),
      'manifest claims a planted mutation the sweep script does not contain (phantom coverage)',
    ).toEqual([]);
    const claimCounts = new Map();
    for (const { label } of claimed) claimCounts.set(label, (claimCounts.get(label) ?? 0) + 1);
    const orphans = sweepLabels.filter((l) => !claimCounts.has(l));
    expect(
      orphans,
      'sweep script plants a mutation no manifest entry claims — add the entry (the sweep and the manifest are one contract)',
    ).toEqual([]);
    const doubled = [...claimCounts.entries()].filter(([, n]) => n > 1).map(([l]) => l);
    expect(doubled, 'a sweep label may prove exactly one invariant entry').toEqual([]);
  });

  test('SHRINK-ONLY: uncovered count equals uncoveredBaseline exactly', () => {
    const uncovered = invariantEntries.filter(([, e]) => e.kind === 'uncovered').length;
    const baseline = manifest.uncoveredBaseline;
    expect(typeof baseline).toBe('number');
    if (uncovered > baseline) {
      expect.fail(
        `uncovered grew: ${uncovered} > baseline ${baseline}. A new invariant needs a planted `
        + `sweep mutation or a written rationale — never a silent gap. Never raise the baseline.`,
      );
    }
    if (uncovered < baseline) {
      expect.fail(
        `uncovered shrank: ${uncovered} < baseline ${baseline}. Lower uncoveredBaseline to `
        + `${uncovered} in scripts/mutation-coverage-manifest.json to bank the win.`,
      );
    }
  });
});
