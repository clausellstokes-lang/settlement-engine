/**
 * fullTypecheckRatchet.test.js — the FULL-TREE typecheck ratchet, pinned and PROVEN.
 *
 * scripts/check-full-typecheck.mjs restores `npm run check`. `npm run typecheck`
 * (`tsc --noEmit -p tsconfig.full.json`) is a BOOLEAN gate at zero errors and step
 * 9 of the 14-step `&&` chain; it went red on 2026-08-02 at 7796954e and stayed
 * red, so `lint`, `test`, `build` and `verify:dist` — every step BEHIND it — had
 * not run as part of the gate since. The ratchet replaces the boolean with a
 * truthful per-file ceiling that only shrinks, which lets the dark tail run again
 * while still redding on the next regression.
 *
 * This file pins BOTH halves, and the second half is the point:
 *
 *   1. STATIC PINS — the baseline is internally consistent, the ceiling never
 *      rises, the wiring reaches `npm run check` and CI, and `npm run typecheck`
 *      survives as a RAW command (burn lanes read the unfiltered list).
 *
 *   2. EXECUTED PINS — every FAILURE path of the ratchet is run, against an
 *      injected fake tsc and an injected temp baseline, and asserted to exit
 *      non-zero. A ratchet whose failure paths are never exercised is a ratchet
 *      nobody has proven works: each guard below exists because its absence is
 *      indistinguishable from success (a vacuous green), which is exactly the
 *      class of defect that cannot be caught by watching the gate pass.
 *
 * The fake tsc is driven from a FILE of output lines rather than a `node -e`
 * string: the backslash-path and indented-elaboration cases are precisely the ones
 * whose bytes shell quoting would mangle, and a mangled fixture would prove the
 * wrong thing while still going green.
 */
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCRIPT = join(ROOT, 'scripts/check-full-typecheck.mjs');

const baseline = JSON.parse(readFileSync(join(ROOT, 'scripts/.full-typecheck-baseline.json'), 'utf8'));
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

// The census measured in an integrity-counted `git archive` of committed sha
// 173e9d7b (6,182 tracked paths in, 6,182 files out): 177 errors across 39 files.
//
// ── CORRECTION, 2026-08-07: THE ORIGINAL EXPLANATION HERE WAS WRONG ─────────
// This block used to freeze the ceiling at 188 measured at 1977db07, and to
// explain the gap like this: "A sibling lane was actively burning the count down
// as it was taken (the live working tree read 179 at that moment, against 188 in
// the committed bytes — the difference was that lane's UNCOMMITTED work)."
//
// GIT CONTRADICTS THAT, and the contradiction was reproduced rather than argued.
// This ratchet LANDED at a9691e73. a9691e73's DIRECT PARENT is 9ecec2a2, and
// three integrity-counted archives measure `tsc -p tsconfig.full.json` as:
//
//     1977db07  (grandparent)      188 errors / 42 files   6,171 in -> 6,171 out
//     9ecec2a2  (DIRECT PARENT)    179 errors / 40 files   6,172 in -> 6,172 out
//     173e9d7b  (this baseline)    177 errors / 39 files   6,182 in -> 6,182 out
//
// So 179 was not a live-tree reading contaminated by anyone's unlanded work: 179
// is exactly what the COMMITTED direct parent measures. The 9-error gap is
// 9ecec2a2's OWN committed net burn (message-normalized: 22 rows removed, 13
// introduced, net -9, clearing rulingPower.js, applyWorldPulse.js,
// warPeaceDecision.js, warSeatBooks.js and warTermination.js of `Property 'id'
// does not exist on type 'RulingFaction'`). The baseline was simply frozen ONE
// COMMIT STALE — at the grandparent instead of the parent — and the uncommitted-
// sibling story was a plausible narrative fitted to a number nobody re-measured.
//
// The cost of the wrong story was not the story: a ratchet 9 errors looser than
// the tree it guards is 9 errors of slack a future regression can hide in, and
// "a tightening pass is owed" made that slack sound like a scheduled chore rather
// than a live hole. RE-BASELINED HERE at 173e9d7b, this lane's own committed sha,
// measured in an archive of that sha and not in the live shared tree.
//
// THE RULE THIS COST US, so the next lane does not pay it again: a ratchet's
// stated reason is a CLAIM, and a claim about what a commit contained is settled
// by measuring that commit — never by reasoning about which lane was busy.
//
// MONOTONE DOWN from here. You may burn it; you may never pad it.
const CEILING = 177;

describe('full-tree typecheck ratchet — static pins', () => {
  test('baseline.total equals the sum of its per-file counts (no stale drift)', () => {
    const sum = Object.values(baseline.files).reduce((a, b) => a + b, 0);
    expect(baseline.total).toBe(sum);
  });

  test('every baselined entry is a repo-relative path with a positive count', () => {
    for (const [file, n] of Object.entries(baseline.files)) {
      expect(file.startsWith('/'), `${file} is absolute — paths must be repo-relative`).toBe(false);
      expect(file.includes('\\'), `${file} carries a backslash — paths must be POSIX`).toBe(false);
      expect(n, `${file} has a non-positive baseline`).toBeGreaterThan(0);
    }
  });

  test('the baseline records the committed sha it was measured at', () => {
    expect(baseline.measuredAtSha, 'a baseline that cannot name its tree cannot be re-derived').toMatch(/^[0-9a-f]{40}$/);
  });

  test('every baselined file still exists (a stale row hides a burned-down win)', () => {
    const missing = Object.keys(baseline.files).filter((f) => !existsSync(join(ROOT, f)));
    expect(missing, `deleted/moved baselined file(s) — run \`npm run typecheck:ratchet:update\`: ${missing.join(', ')}`).toEqual([]);
  });

  test('the committed ceiling never rises (the ratchet is monotone-down)', () => {
    expect(baseline.total).toBeLessThanOrEqual(CEILING);
  });

  test('the ratchet is wired into `npm run check`', () => {
    expect(pkg.scripts['typecheck:ratchet']).toContain('check-full-typecheck.mjs');
    expect(pkg.scripts['typecheck:ratchet:update']).toContain('--update');
    expect(pkg.scripts.check).toContain('typecheck:ratchet');
  });

  test('the check chain no longer runs the BARE boolean typecheck (that is what went dark)', () => {
    // The whole repair: the chain must run the ratchet, not the all-or-nothing
    // step whose red blacked out lint/test/build/verify:dist. Compare STEP NAMES,
    // not substrings — "npm run typecheck:ratchet" contains "npm run typecheck".
    const steps = pkg.scripts.check.split('&&').map((s) => s.trim().replace(/^npm run /, ''));
    expect(steps).toContain('typecheck:ratchet');
    expect(steps.length, 'the check chain parsed to no steps — the scan broke').toBeGreaterThan(4);
    // anchored: the two assertions above prove `steps` is a populated list that really contains the chain
    expect(steps, 'the bare `typecheck` step is back in the chain — the tail goes dark again').not.toContain('typecheck');
  });

  test('`npm run typecheck` survives as a RAW tsc command (burn lanes need the full list)', () => {
    // The ratchet reports a verdict; a burn-down lane needs the unfiltered
    // diagnostics. Keeping the raw script is a requirement, not an accident.
    expect(pkg.scripts.typecheck).toBe('tsc --noEmit -p tsconfig.full.json');
  });

  test('CI runs the ratchet too (the local gate and CI must not diverge)', () => {
    // CI steps are sequential and a failed step ends the job, so CI's Lint / Run
    // tests / Build / Verify steps were dark for exactly the same reason.
    const ci = readFileSync(join(ROOT, '.github/workflows/ci.yml'), 'utf8');
    expect(ci, 'ci.yml must run the full-tree ratchet').toContain('npm run typecheck:ratchet');
  });

  test('the baselined roots are the tsconfig.full.json include roots (scope was not narrowed at baseline time)', () => {
    const cfg = JSON.parse(readFileSync(join(ROOT, 'tsconfig.full.json'), 'utf8'));
    // Every include root that names a concrete src area must have resolved to at
    // least one file when the baseline was taken, or the baseline itself was
    // measured over a narrowed tree.
    const declared = (cfg.include || [])
      .map((g) => g.match(/^(src\/[^*/]+)\//)?.[1])
      .filter(Boolean)
      .map((d) => `${d}/`);
    expect(declared.length, 'tsconfig.full.json should declare concrete src include roots').toBeGreaterThan(4);
    const missing = declared.filter((d) => !(baseline.roots || []).includes(d));
    expect(missing, `include root(s) that resolved to nothing at baseline time: ${missing.join(', ')}`).toEqual([]);
  });
});

// ── EXECUTED PINS: every failure path, actually run ──────────────────────────
describe('full-tree typecheck ratchet — the guards, EXECUTED', () => {
  const TMP = mkdtempSync(join(tmpdir(), 'full-typecheck-ratchet-'));

  // A fake tsc: prints the given lines verbatim, exits with the given code.
  // Driven from a file so backslashes and leading whitespace survive intact.
  const FAKE_TSC = join(TMP, 'fake-tsc.mjs');
  writeFileSync(
    FAKE_TSC,
    'import fs from "node:fs";\n'
    + 'const [, , linesFile, code] = process.argv;\n'
    + 'const text = linesFile === "-" ? "" : fs.readFileSync(linesFile, "utf8");\n'
    + 'if (text) process.stdout.write(text);\n'
    + 'process.exit(Number(code));\n',
  );

  let seq = 0;
  const tmpFile = (ext, contents) => {
    seq += 1;
    const f = join(TMP, `f${seq}.${ext}`);
    writeFileSync(f, contents);
    return f;
  };

  /** Build a `node fake-tsc.mjs` command emitting `lines` and exiting `code`. */
  function fakeTsc(lines, code = 1) {
    if (lines === null) return `node ${FAKE_TSC} - ${code}`;
    return `node ${FAKE_TSC} ${tmpFile('txt', `${lines.join('\n')}\n`)} ${code}`;
  }
  /** Build a fake `--listFilesOnly` emitting `paths`. */
  const fakeList = (paths) => fakeTsc(paths, 0);

  /**
   * Run the ratchet against an injected baseline + injected tsc (+ optional
   * injected file-set probe). Returns the spawn result with a combined `out`.
   */
  function run({ files = {}, roots, resolvedCount, diagnostics = [], exitCode = 1, list, listCmd }) {
    const total = Object.values(files).reduce((a, b) => a + b, 0);
    const payload = { measuredAtSha: 'f'.repeat(40), total, files };
    if (roots !== undefined) payload.roots = roots;
    if (resolvedCount !== undefined) payload.resolvedCount = resolvedCount;
    const baselineFile = tmpFile('json', JSON.stringify(payload, null, 2));
    const env = {
      ...process.env,
      FULL_TYPECHECK_BASELINE: baselineFile,
      FULL_TYPECHECK_TSC_CMD: fakeTsc(diagnostics, exitCode),
    };
    if (list !== undefined) env.FULL_TYPECHECK_LISTFILES_CMD = fakeList(list);
    if (listCmd !== undefined) env.FULL_TYPECHECK_LISTFILES_CMD = listCmd;
    const r = spawnSync('node', [SCRIPT], { cwd: ROOT, encoding: 'utf8', env });
    return { ...r, out: `${r.stdout}${r.stderr}` };
  }

  const err = (file, line = 1, code = 7006) => `${file}(${line},1): error TS${code}: Parameter x implicitly has an 'any' type.`;
  // A real file, used wherever a guard needs a path that EXISTS on disk. Named,
  // never edited — this lane does not own it.
  const REAL = 'src/domain/rulingPower.js';

  // ── anti-vacuity: "tsc actually ran" ──────────────────────────────────────
  describe('anti-vacuity sentinel — a tsc that did not run is not "0 errors"', () => {
    test('fails closed when tsc cannot run at all (non-zero exit, no output)', () => {
      const r = run({ diagnostics: null });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/FAILED TO RUN|failing closed/i);
    });

    test('fails closed on non-zero exit with output carrying no TS diagnostic', () => {
      const r = run({ diagnostics: ['Cannot find module typescript'] });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/FAILED TO RUN|failing closed/i);
    });

    test('fails closed on a config-level diagnostic with no file location (TS18003 shape)', () => {
      // A config-load failure DOES print `error TSxxxx:`, so it passes a naive
      // "did tsc run" sniff — but nothing was typechecked and every count is 0.
      const r = run({ diagnostics: ['error TS18003: No inputs were found in config file tsconfig.full.json.'] });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/config-level|FAILED TO RUN/i);
    });

    test('fails closed on a diagnostic located in the tsconfig .json itself (TS5083 shape)', () => {
      // Config syntax errors DO carry a file(line,col) location — on the .json,
      // not on source. Still no typecheck happened.
      const r = run({ diagnostics: ['tsconfig.full.json(3,5): error TS1005: expected.'] });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/config-level|FAILED TO RUN/i);
    });

    test('does NOT fail closed when tsc really ran and emitted real diagnostics', () => {
      // The discriminator must distinguish "ran with errors" from "did not run",
      // or the guard is an always-red gate that would simply be deleted.
      const r = run({ files: { [REAL]: 1 }, diagnostics: [err(REAL)], list: [REAL] });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/OK — no type regressions/);
      // anchored: the verdict assertion above proves the output is non-empty and reached the normal path
      expect(r.out).not.toMatch(/FAILED TO RUN/i);
    });
  });

  // ── the ratchet law ───────────────────────────────────────────────────────
  describe('the ceiling is PER FILE and shrink-only', () => {
    test('a file AT its banked count passes (debt is banked, not forgiven-then-refused)', () => {
      const r = run({ files: { [REAL]: 2 }, diagnostics: [err(REAL, 1), err(REAL, 2)], list: [REAL] });
      expect(r.status, r.out).toBe(0);
    });

    test('a file ABOVE its banked count fails (per-file shrink-only)', () => {
      const r = run({ files: { [REAL]: 1 }, diagnostics: [err(REAL, 1), err(REAL, 2)], list: [REAL] });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/rulingPower\.js: 2 error\(s\) \(baseline 1\)/);
    });

    test('a file ABSENT from the baseline gets an allowance of ZERO (new work must be clean)', () => {
      // The zero-ceiling law. If `base[file] ?? 0` ever became `?? Infinity`, or
      // the comparison collapsed to `total <= baseline.total`, this greens and
      // every new file inherits a free debt allowance.
      const r = run({ files: { [REAL]: 40 }, diagnostics: [err('src/lib/brandNew.js')], list: [REAL] });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/brandNew\.js/);
    });

    test('a new file gets NO credit from unused slack elsewhere in the banked total', () => {
      // 1 error against a 40-error banked total is still a regression.
      const r = run({ files: { [REAL]: 40 }, diagnostics: [err('src/lib/brandNew.js')], list: [REAL] });
      expect(r.status, r.out).not.toBe(0);
    });

    test('a file BELOW its banked count passes AND names the ratchet-down command', () => {
      // BELOW-DEMANDS-RATCHET-DOWN: a silent pass would let the ceiling drift
      // permanently above the truth, which is how a ratchet stops ratcheting.
      const r = run({ files: { [REAL]: 5 }, diagnostics: [err(REAL)], list: [REAL] });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/RATCHET DOWN/);
      expect(r.out).toMatch(/typecheck:ratchet:update/);
    });
  });

  // ── path-format hardening ─────────────────────────────────────────────────
  describe('path-format hardening — a path spelling must never zero the count', () => {
    // Each case uses the SAME discriminator: a baselined file at its ceiling. If
    // normalization fails, the diagnostic keys under an unrecognised path, which
    // is absent from the baseline, allowance 0 — so a PASS proves normalization
    // ran, and only a pass proves it. (A "does it red" test cannot tell the two
    // apart: both spellings red, for opposite reasons.)
    test('an ABSOLUTE path is normalized to the repo-relative key', () => {
      const r = run({ files: { [REAL]: 1 }, diagnostics: [err(join(ROOT, REAL))], list: [REAL] });
      expect(r.status, r.out).toBe(0);
    });

    test('a BACKSLASH path is normalized to the repo-relative key', () => {
      const r = run({ files: { [REAL]: 1 }, diagnostics: [err(REAL.split('/').join('\\'))], list: [REAL] });
      expect(r.status, r.out).toBe(0);
    });

    test('a ./-prefixed path is normalized to the repo-relative key', () => {
      const r = run({ files: { [REAL]: 1 }, diagnostics: [err(`./${REAL}`)], list: [REAL] });
      expect(r.status, r.out).toBe(0);
    });

    test('an INDENTED elaboration line is not counted as a new diagnostic', () => {
      // tsc indents related-info/elaboration under a diagnostic. Counting those
      // would invent errors in files that have none — and trimming before the
      // match is exactly how that happens.
      const r = run({
        files: { [REAL]: 1 },
        diagnostics: [err(REAL), `  ${err('src/lib/notReallyAnError.js')}`],
        list: [REAL],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/OK — no type regressions/);
      // anchored: the verdict assertion above proves the run produced real output naming its result
      expect(r.out).not.toMatch(/notReallyAnError/);
    });
  });

  // ── scope sentinel ────────────────────────────────────────────────────────
  describe('scope sentinel — "tsc ran" is not "tsc ran over the governed tree"', () => {
    test('a baselined file that exists on disk but is NOT compiled fails the gate', () => {
      // Narrow tsconfig.full.json's include and the dropped files report zero
      // errors: every ceiling passes, over a tree nobody checked.
      const r = run({
        files: { [REAL]: 2 },
        diagnostics: [err(REAL, 1), err(REAL, 2)],
        list: ['src/domain/somethingElse.js'],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/SCOPE SENTINEL/);
      expect(r.out).toMatch(/no longer being checked/);
    });

    test('an include root that resolved at baseline time but resolves to nothing now fails', () => {
      // Catches a wholesale root removal in an area carrying no baselined errors,
      // which the per-file membership check above cannot see.
      const r = run({
        files: { [REAL]: 1 },
        roots: ['src/store/'],
        diagnostics: [err(REAL)],
        list: [REAL],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/SCOPE SENTINEL/);
      expect(r.out).toMatch(/src\/store\//);
    });

    test('a collapse in the compiled file count fails (>10% shrink is a scope event)', () => {
      const r = run({
        files: { [REAL]: 1 },
        resolvedCount: 1000,
        diagnostics: [err(REAL)],
        list: [REAL, 'src/lib/a.js', 'src/lib/b.js'],
      });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/collapsed/);
    });

    test('the file-set probe returning NOTHING fails closed', () => {
      // A broken probe must not read as "scope is fine".
      const r = run({ files: { [REAL]: 1 }, diagnostics: [err(REAL)], list: [] });
      expect(r.status, r.out).not.toBe(0);
      expect(r.out).toMatch(/scope sentinel/i);
    });

    test('the sentinel PASSES when scope is intact (it is not an always-red gate)', () => {
      // A guard that can only ever fail would be deleted, taking the real
      // protection with it. Positive control: same shape, consistent scope.
      const r = run({
        files: { [REAL]: 1 },
        roots: ['src/domain/'],
        resolvedCount: 3,
        diagnostics: [err(REAL)],
        list: [REAL, 'src/lib/a.js', 'src/lib/b.js'],
      });
      expect(r.status, r.out).toBe(0);
      expect(r.out).toMatch(/OK — no type regressions/);
      // anchored: the verdict assertion above proves the sentinel ran through to the normal path
      expect(r.out).not.toMatch(/SCOPE SENTINEL/);
    });
  });

  // ── --update cannot bank a lie ────────────────────────────────────────────
  describe('--update is guarded by the same sentinel', () => {
    test('a broken tsc run cannot write a 0-error baseline', () => {
      const baselineFile = tmpFile('json', JSON.stringify({ total: 5, files: { [REAL]: 5 } }));
      const r = spawnSync('node', [SCRIPT, '--update'], {
        cwd: ROOT,
        encoding: 'utf8',
        env: {
          ...process.env,
          FULL_TYPECHECK_BASELINE: baselineFile,
          FULL_TYPECHECK_TSC_CMD: fakeTsc(null, 1),
          FULL_TYPECHECK_LISTFILES_CMD: fakeList([REAL]),
        },
      });
      expect(r.status, `${r.stdout}${r.stderr}`).not.toBe(0);
      // The baseline on disk must be untouched — a broken run that rewrote the
      // ceiling to 0 would turn every real error into a regression forever.
      expect(JSON.parse(readFileSync(baselineFile, 'utf8')).total).toBe(5);
    });
  });
});
