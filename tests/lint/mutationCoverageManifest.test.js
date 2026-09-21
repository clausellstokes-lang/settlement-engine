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
 *   4. DIRTY GUARD— the sweep's MUTATED_FILES refusal list names EXACTLY the
 *                   files its check_caught/check_caught_missing calls mutate.
 *                   A missing row means `git checkout --` would discard a
 *                   maintainer's uncommitted work in that file; a stale row is
 *                   an over-broad refusal. Both directions red here.
 *
 * TO COMPLY when this reds:
 *   - added/moved a sweep mutation target → update MUTATED_FILES in the same edit.
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
import {
  ADMITTED_TREE_REF,
  enumerateInvariants,
  parseSweepLabels,
  parseSweepMutationTargets,
  parseGuardedMutatedFiles,
  subjectCouplingOf,
} from './mutationCoverage.shared.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const manifest = JSON.parse(readFileSync(join(ROOT, 'scripts/mutation-coverage-manifest.json'), 'utf8'));
const sweepSrc = readFileSync(join(ROOT, 'scripts/mutation-sweep.sh'), 'utf8');
const sweepLabels = parseSweepLabels(sweepSrc);
const mutationTargets = parseSweepMutationTargets(sweepSrc);
const guardedFiles = parseGuardedMutatedFiles(sweepSrc);
const enumerated = enumerateInvariants(ROOT);
const invariantEntries = Object.entries(manifest.invariants);
const metaEntries = Object.entries(manifest.meta ?? {});

describe('mutation-coverage manifest — the totality contract (E-A)', () => {
  test('guard-the-guard: enumeration and label parsing are not vacuous', () => {
    // If the enumerator or the label regex silently broke, everything below
    // would pass on empty sets. The floors below had once rotted to the 2026-05
    // figures (300/22), which is two thirds of the corpus a broken enumerator
    // could have dropped unnoticed.
    // Floors TIGHTEN toward reality; they are never raised to admit a budget.
    // 2026-08-30: 547 -> 644 as tests/generators joined ENFORCER_DIRS (ODQ 764.2),
    // so the floor tightens with it — left at 440 it would have gone on passing
    // with the entire admitted tree dropped back out of the walk.
    // 2026-09-19: 630 -> 686. The floor had not moved since the 2026-08-30 note
    // while the corpus grew to 686 files, so FIFTY-SIX of them could have been
    // dropped and this guard-the-guard would have gone on passing — the same rot
    // the sweep-label floor was re-measured for one day earlier. Re-measured
    // against this tree by executing enumerateInvariants(ROOT): 686.
    expect(enumerated.length).toBeGreaterThanOrEqual(686);
    // 2026-09-18: 61 -> 121. The floor had not moved since the 2026-08-30 note
    // above while the sweep grew to 121 plants, so SIXTY of them could have been
    // deleted and this guard-the-guard would have gone on passing — the exact
    // rot it exists to catch, one level up. Re-measured against this tree and
    // tightened to it, as the paragraph above prescribes.
    expect(sweepLabels.length).toBeGreaterThanOrEqual(121);
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

  // ── DIRTY-GUARD TOTALITY ────────────────────────────────────────────────────
  // The sweep reverts each mutation with `git checkout -- <file>`, which DISCARDS
  // uncommitted work in that file. Its MUTATED_FILES refusal guard is the only thing
  // standing between a manual run and a maintainer's unsaved edits — and it was
  // hand-maintained, so it drifted: seven targets (the arch/discourse/realmEntityWeb
  // areas and two pglite suites) were mutated but unguarded. This binds the two lists
  // in BOTH directions, at the same join the sweep/manifest contract uses.
  test('DIRTY-GUARD TOTALITY: the refusal guard names exactly the files the sweep mutates', () => {
    const targetFiles = [...new Set(mutationTargets.map((t) => t.file))].sort();
    const guarded = new Set(guardedFiles);
    const unguarded = targetFiles.filter((f) => !guarded.has(f));
    expect(
      unguarded,
      `\nThe sweep MUTATES these files and reverts them with \`git checkout --\`, but the`
      + ` MUTATED_FILES dirty-tree guard in scripts/mutation-sweep.sh does not name them —`
      + ` so a manual run on a tree with uncommitted work in any of them DESTROYS that work`
      + ` instead of refusing. Add each to MUTATED_FILES:\n${unguarded.join('\n')}\n`,
    ).toEqual([]);

    const targetSet = new Set(targetFiles);
    const stale = [...guarded].filter((f) => !targetSet.has(f)).sort();
    expect(
      stale,
      `MUTATED_FILES names files no check_caught/check_caught_missing call mutates — an`
      + ` over-broad refusal that makes the guard read as maintained when it is not.`
      + ` Remove them (or re-anchor the area that used to touch them):\n${stale.join('\n')}`,
    ).toEqual([]);
  });

  test('guard-the-guard: every guarded path exists (a typo guards nothing, silently)', () => {
    // `git status --porcelain -- <path-that-does-not-exist>` prints nothing, so a
    // misspelled row passes the refusal check while protecting no file at all.
    const missing = guardedFiles.filter((rel) => !existsSync(join(ROOT, rel)));
    expect(missing, 'MUTATED_FILES rows that name no file on disk').toEqual([]);
    expect(guardedFiles.length, 'the MUTATED_FILES parse is not vacuous').toBeGreaterThanOrEqual(40);
    expect(mutationTargets.length, 'the mutation-target parse is not vacuous').toBeGreaterThanOrEqual(50);
    expect(new Set(guardedFiles).size, 'duplicate rows in MUTATED_FILES').toBe(guardedFiles.length);
  });

  // ── THE ADMITTED TREE (ODQ 764.2) ───────────────────────────────────────────
  // tests/generators joined ENFORCER_DIRS on the 759.4 finding that 97 of its 108
  // files were invisible here. They came in on ONE shared rationale, and a shared
  // rationale is the cheapest thing in this file to abuse: ninety-seven rows can
  // point at one paragraph and nothing re-reads whether the paragraph is still
  // true of any of them. So the paragraph's claim is re-derived from disk, per
  // member, every run — a member gutted to a smoke check reds BY NAME.
  test('THE ADMITTED-TREE CLAIM: every member still scans or executes its subject and asserts', () => {
    const members = invariantEntries.filter(([, e]) => e.ref === ADMITTED_TREE_REF);
    expect(
      members.length,
      'the admitted-tree membership collapsed — this arm would pass vacuously',
    ).toBeGreaterThanOrEqual(90);

    const offenders = [];
    for (const [rel] of members) {
      if (!rel.startsWith('tests/generators/')) {
        offenders.push(`${rel}: cites the tests/generators admission from outside that tree`);
        continue;
      }
      const { importsSubject, scansSubject, asserts } = subjectCouplingOf(readFileSync(join(ROOT, rel), 'utf8'));
      if (!importsSubject && !scansSubject) offenders.push(`${rel}: neither imports nor scans anything under src/`);
      else if (!asserts) offenders.push(`${rel}: reaches its subject but asserts nothing`);
    }
    expect(
      offenders,
      `\nThese files were admitted to ENFORCER_DIRS on the claim that they already scan or execute`
      + ` production material and assert on what came back. That claim is no longer true of them, so the`
      + ` shared rationale no longer covers them: give each its own mutation plant or its own written`
      + ` rationale, or restore the coupling:\n${offenders.join('\n')}\n`,
    ).toEqual([]);
  });

  test('THE PLANTED CONTROL: the coupling predicate refuses a member that reaches nothing', () => {
    // Without this the arm above could be a broken regex admitting everything. The
    // control drives the SAME function the live arm calls — a control that
    // re-implements the detector proves nothing about the detector.
    const importing = "import { generate } from '../../src/generators/x.js';\ntest('t', () => { expect(generate()).toBe(1); });";
    const scanning = "const s = readFileSync(join(ROOT, 'src/generators/x.js'), 'utf8');\nexpect(s).toContain('export');";
    const gutted = "test('t', () => { expect(true).toBe(true); });";
    const mute = "import { generate } from '../../src/generators/x.js';\ntest('t', () => { generate(); });";

    expect(subjectCouplingOf(importing).coupled, 'an importing, asserting member must be ADMITTED').toBe(true);
    expect(subjectCouplingOf(scanning).coupled, 'a source-scanning, asserting member must be ADMITTED').toBe(true);
    expect(subjectCouplingOf(gutted).coupled, 'a member that reaches no subject must be REFUSED').toBe(false);
    expect(subjectCouplingOf(mute).coupled, 'a member that reaches its subject and asserts nothing must be REFUSED').toBe(false);
    // …and it DISCRIMINATES: a test-tree import is not production material, and a
    // src/ token inside prose is not a scan.
    expect(subjectCouplingOf("import x from '../helpers/fixture.js';\nexpect(x).toBe(1);").coupled).toBe(false);
    expect(subjectCouplingOf("// walks src/ looking for drift\ntest('t', () => { expect(1).toBe(1); });").coupled).toBe(false);
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
