/**
 * pgliteHookTimeoutRatchet.test.js — habitat removal for the F4 PGLITE HOOK-TIMEOUT
 * class (the four-file red of 2026-07-27, closed at ada1252d).
 *
 * THE CLASS: a beforeAll/beforeEach that boots PGlite (or installs migration bodies
 * into it) while inheriting vitest's 10000ms hookTimeout. Under the parallel load of
 * a real gate run, pglite's cold WASM boot sits exactly ON that ceiling — measured
 * 2026-07-27 under load: failing hooks 11.2–20.7s, passing hooks 8.6–10.0s — so the
 * suite goes FLAKY red, and a blown hook fails the file with its tests UNEXECUTED.
 * That is the dangerous half: a suite that never ran looks the same as one that had
 * nothing to say. The cure is a generous explicit timeout (the sibling shape in
 * tierCreditMultiplierSql / surveyorProbeTierSql: PGLITE_BOOT_TIMEOUT_MS = 180_000),
 * never a value tuned to the measured boot — a previous 30000ms and a previous
 * 60_000ms both went brittle exactly that way, which is why the floor below treats
 * the tuned-30s stratum as unguarded.
 *
 * THE WALK: extract every beforeAll/beforeEach call in tests/security/*.pglite.test.js
 * (paren-matched from the hook keyword), keep the BOOT-BEARING ones — callback text
 * names a live boot constructor/helper (`new PGlite`, makeDb, makeCreditLedgerDb,
 * baseDb, buildDb, supportDb), OR the hook is the file's first PGlite-touching hook
 * and calls `.exec(`/`.query(` (boot is LAZY: `new PGlite()` returns instantly and
 * the cold WASM start lands on the first exec, wherever that runs) — and require a
 * trailing timeout argument that is a numeric literal >= 60_000 or an in-file
 * `const NAME = <number>` resolving >= 60_000. The offender inventory below was
 * burned down to EMPTY on 2026-07-27 (63 hooks across 58 files took the constant
 * shape); it now stands as a zero-tolerance gate.
 *
 * WHY per-file counts, not per-line pins: line numbers churn under unrelated edits; a
 * per-file exact count is stable, still reds on a NEW unguarded hook in a frozen file,
 * and — because the assertion is exact equality in both directions — forces every win
 * to be banked by lowering the row (the negativeAssertionAnchor idiom).
 *
 * CANNOT-CATCH — audited 2026-07-27 at the freeze, AMENDED the same day after the
 * helper-boot audit proved the original first two claims false: makeCreditLedgerDb
 * alone was live in four files the makeDb-only marker could not see, and four of the
 * six files claimed to boot "inside per-test helper bodies" actually await their
 * helper INSIDE a before-hook, squarely under hookTimeout. The eight files carrying
 * that blind spot (founderTransferPayout — which booted PER TEST with no timeout at
 * all — creditAllocationTrigger, creditPackClawback, moneyPathJourney,
 * accountStatusProfilesCustomContent, profileModerationColumnLock,
 * accountStatusSupportTickets, migration062Authz) are now guarded and pinned in
 * GUARDED_EXEMPLARS; BOOT_MARKER_RE carries the live helper roster and the walk is
 * exec-aware. What still escapes (accepted costs of a regex gate):
 *   - A boot helper with an UNLISTED name whose hook never execs directly — a pure
 *     `db = await newHelper()` line — shows neither marker nor exec text. The
 *     HELPER-NAME LAW below turns this from convention into enforcement for helpers
 *     defined in tests/security: a census walker reds any hook calling an unlisted
 *     in-scope constructor. Remaining escape: a constructor defined OUTSIDE
 *     tests/security and imported into a hook.
 *   - Two files construct PGlite inside per-test helper/test bodies rather than hooks
 *     (customContentBackfill, reviewedQuarantineConflict). Those boots run under
 *     testTimeout, not hookTimeout — a different failure surface this ratchet does
 *     not claim.
 *   - The exec rule orders hooks beforeAll-then-beforeEach (source order within each)
 *     to pick the file's first toucher; an exotic layout — a later describe's
 *     beforeEach outrunning an earlier describe's beforeAll — could flag a warm hook.
 *     A LOUD false positive, fixed by guarding the flagged hook.
 *   - Paren matching is string-naive: an unbalanced `)` inside a hook's string literal
 *     truncates that hook's extracted text. None exist today. A truncation before the
 *     boot marker hides the hook (silent); after it, the lost tail reds as unguarded
 *     (loud).
 *   - A timeout passed as an imported constant or an arithmetic expression does not
 *     resolve and counts as unguarded — a loud false positive, fixed by using the
 *     in-file constant shape every guarded suite already uses.
 *
 * REGENERATION: UPDATE_PGLITE_HOOK_ALLOWLIST=1 npx vitest run
 * tests/security/pgliteHookTimeoutRatchet.test.js PRINTS a fresh literal and FAILS
 * with instructions. It never writes a file — the allowlist is a reviewed artifact,
 * and a self-updating ratchet ratchets nothing.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCAN_DIR = 'tests/security';

/** Below this, a timeout is either absent or tuned-to-a-measurement; both are the class. */
const FLOOR_MS = 60_000;

/**
 * A hook whose callback text matches this is standing up (or first-exec-booting)
 * PGlite. The alternation carries the LIVE boot-helper roster (2026-07-27 amendment):
 * makeDb (the common cross-file harness name), makeCreditLedgerDb
 * (creditLedgerHarness.js), and the local baseDb/buildDb/supportDb helpers. Add every
 * NEW harness name here when introducing one — the exec-aware rule in unguardedHooks
 * catches the common miss (a hook that also execs directly), but a pure
 * `await newHelper()` with no in-hook exec is invisible until listed.
 */
const BOOT_MARKER_RE = /new\s+PGlite|\b(?:makeDb|makeCreditLedgerDb|baseDb|buildDb|supportDb)\s*\(/;

/** A hook whose callback touches the db at all — the lazy-boot payment surface. */
const EXEC_RE = /\.exec\s*\(|\.query\s*\(/;

/**
 * The hook call's trailing timeout argument: a numeric literal (underscores legal) or an
 * identifier, optionally followed by a block comment, then the call's closing paren.
 */
const TAIL_ARG_RE = /,\s*([0-9][0-9_]*|[A-Za-z_$][\w$]*)\s*(?:\/\*[\s\S]*?\*\/\s*)?\)$/;

/** Every beforeAll/beforeEach call in a source, paren-matched to its own closing paren. */
function extractHooks(src) {
  const hooks = [];
  const re = /\b(beforeAll|beforeEach)\s*\(/g;
  let m;
  while ((m = re.exec(src))) {
    let i = re.lastIndex;
    let depth = 1;
    while (i < src.length && depth > 0) {
      const ch = src[i];
      if (ch === '(') depth += 1;
      else if (ch === ')') depth -= 1;
      i += 1;
    }
    hooks.push({
      kind: m[1],
      text: src.slice(m.index, i),
      line: src.slice(0, m.index).split('\n').length,
    });
  }
  return hooks;
}

/** Resolve the hook's timeout argument to milliseconds, or null when it has none. */
function timeoutOf(hookText, src) {
  const m = hookText.match(TAIL_ARG_RE);
  if (!m) return null;
  const arg = m[1];
  if (/^[0-9]/.test(arg)) return Number(arg.replace(/_/g, ''));
  const c = src.match(new RegExp(`const\\s+${arg}\\s*=\\s*([0-9][0-9_]*)`));
  return c ? Number(c[1].replace(/_/g, '')) : null;
}

/**
 * Unguarded boot-bearing hooks in one source. A hook is boot-bearing when
 *   (1) its callback names a known boot constructor/helper (BOOT_MARKER_RE), or
 *   (2) it is the file's FIRST PGlite-touching hook and touches `.exec(`/`.query(` —
 *       PGlite boot is LAZY (`new PGlite()` returns instantly; the cold WASM start
 *       lands on the first exec), so whichever hook performs the file's first exec
 *       pays the boot even when the constructor hides behind an unlisted helper.
 * "First" approximates runtime order at the string level: all beforeAll hooks in
 * source order, then all beforeEach hooks — exact for the corpus's single-describe
 * shape. A later toucher runs warm and is out of scope regardless of its own guard.
 */
function unguardedHooks(src) {
  const hooks = extractHooks(src);
  const ordered = [...hooks.filter((h) => h.kind === 'beforeAll'), ...hooks.filter((h) => h.kind === 'beforeEach')];
  const firstToucher = ordered.find((h) => BOOT_MARKER_RE.test(h.text) || EXEC_RE.test(h.text));
  const bad = [];
  for (const h of hooks) {
    if (!BOOT_MARKER_RE.test(h.text) && !(h === firstToucher && EXEC_RE.test(h.text))) continue;
    const t = timeoutOf(h.text, src);
    if (t === null || t < FLOOR_MS) bad.push({ kind: h.kind, line: h.line, timeout: t });
  }
  return bad;
}

/** Index just past the delimiter that closes the one opening at openIdx. */
function matchedClose(src, openIdx, open, close) {
  let i = openIdx;
  let depth = 0;
  do {
    const ch = src[i];
    if (ch === open) depth += 1;
    else if (ch === close) depth -= 1;
    i += 1;
  } while (i < src.length && depth > 0);
  return i;
}

/**
 * HELPER-NAME LAW (2026-07-27 second amendment). BOOT_MARKER_RE can only see a
 * helper-boot hook if the helper's NAME is in its alternation, so the law is:
 * a before-hook may only call a PGlite-constructing helper the marker knows.
 * Enforcement is need-based — a constructor used solely in test bodies (today:
 * makeLegacyDatabase, createPre188Database, profilesDb, firstOrderingVerdict)
 * needs no marker entry, and the walker reds the moment any hook adopts one,
 * with the fix in the message.
 *
 * Named functions whose body constructs PGlite. Shapes covered:
 * `function name(…) {…}` (destructured params included), `const name = (…) => {…}`,
 * `const name = (…) => new PGlite(…)`, `const name = function (…) {…}`.
 * String-naive like every walker in this file — a brace inside a body's string
 * or regex literal can desync the match; the fixture test pins the live shapes.
 */
function constructorHelperNames(src) {
  const names = new Set();
  const heads = [
    /(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*(?=\()/g,
    /const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function\s*)?(?=\()/g,
  ];
  for (const re of heads) {
    let m;
    while ((m = re.exec(src))) {
      const afterParams = matchedClose(src, re.lastIndex, '(', ')');
      const tail = src.slice(afterParams);
      const arrow = tail.match(/^\s*=>\s*/);
      if (arrow && /^new\s+PGlite/.test(tail.slice(arrow[0].length))) {
        names.add(m[1]);
        continue;
      }
      const braceAt = afterParams + (arrow ? arrow[0].length : tail.match(/^\s*/)[0].length);
      if (src[braceAt] !== '{') continue;
      if (/new\s+PGlite/.test(src.slice(braceAt, matchedClose(src, braceAt, '{', '}')))) names.add(m[1]);
    }
  }
  return names;
}

/** Violations of the helper-name law: hooks calling a constructor the marker cannot see. */
function helperLawViolations(defs, suites) {
  const violations = [];
  for (const { file, src } of suites) {
    for (const h of extractHooks(src)) {
      if (BOOT_MARKER_RE.test(h.text)) continue; // already visible to the timeout walk
      for (const [name, where] of defs) {
        if (new RegExp(`\\b${name}\\s*\\(`).test(h.text)) {
          violations.push(
            `${file}:${h.line} ${h.kind} calls ${name}() — a PGlite constructor (defined in ${where.join(', ')}) ` +
            `invisible to BOOT_MARKER_RE, so its boot cost escapes the timeout walk. Add \`${name}\` to the ` +
            `BOOT_MARKER_RE alternation (and guard the hook with PGLITE_BOOT_TIMEOUT_MS).`,
          );
        }
      }
    }
  }
  return violations;
}

/** @returns {Record<string, number>} unguarded-hook count per pglite suite. */
function scanCorpus() {
  const found = {};
  for (const f of readdirSync(join(ROOT, SCAN_DIR)).filter((n) => n.endsWith('.pglite.test.js')).sort()) {
    const rel = `${SCAN_DIR}/${f}`;
    const bad = unguardedHooks(readFileSync(join(ROOT, rel), 'utf8'));
    if (bad.length) found[rel] = bad.length;
  }
  return found;
}

/**
 * CLEARED 2026-07-27 (was 63 hooks across 58 files, frozen earlier the same day the
 * ratchet stood; the ~19-file `30000` stratum was an earlier tuned wave, deliberately
 * counted as unguarded). The burn-down wave gave every one of those hooks the
 * PGLITE_BOOT_TIMEOUT_MS = 180_000 constant shape, so this is now a ZERO-TOLERANCE
 * gate: a new unguarded boot hook anywhere in the corpus is a bug to fix in the same
 * change (add the constant shape), never an entry to append here.
 *
 * The 2026-07-27 helper-boot amendment (widened marker + exec-aware walk) changed no
 * row: the eight files it made visible were guarded in the same change, so they
 * entered the ledger at zero.
 */
const FROZEN_UNGUARDED = Object.freeze({});

/**
 * Suites that carry the guard on every boot-bearing hook — the detector's positive
 * pin. The eight 2026-07-27-amendment files (helper-boot shapes: makeCreditLedgerDb,
 * baseDb, buildDb, supportDb) are pinned here deliberately: narrowing BOOT_MARKER_RE
 * back to makeDb-only would make the detector see "no boot-bearing hook" in them and
 * red this pin, so the widened marker cannot silently regress.
 */
const GUARDED_EXEMPLARS = [
  'tests/security/accountStatusProfilesCustomContent.pglite.test.js',
  'tests/security/accountStatusSupportTickets.pglite.test.js',
  'tests/security/creditAllocationTrigger.pglite.test.js',
  'tests/security/creditPackClawback.pglite.test.js',
  'tests/security/founderTransferPayout.pglite.test.js',
  'tests/security/migration062Authz.pglite.test.js',
  'tests/security/moneyPathJourney.pglite.test.js',
  'tests/security/neighbourBacklinkMerge.pglite.test.js',
  'tests/security/paymentRefundObligations.pglite.test.js',
  'tests/security/paymentRefundRecovery.pglite.test.js',
  'tests/security/profileModerationColumnLock.pglite.test.js',
  'tests/security/refundDedup.pglite.test.js',
  'tests/security/surveyorByokHealth.pglite.test.js',
  'tests/security/surveyorProbeTierSql.pglite.test.js',
  'tests/security/surveyorProvisioning.pglite.test.js',
  'tests/security/tierCreditMultiplierSql.pglite.test.js',
];

const ratchetMessage = (file, count, ceiling) =>
  `${file}: ${count} unguarded PGlite boot hook(s); frozen ceiling is ${ceiling}.\n` +
  `A hook that boots PGlite inherits vitest's 10000ms hookTimeout, which sits ON the\n` +
  `boot-noise band under gate load (measured 2026-07-27: 8.6-20.7s), so the file goes\n` +
  `FLAKY red with its tests unexecuted. Add at module/describe scope:\n` +
  `  const PGLITE_BOOT_TIMEOUT_MS = 180_000; // deadlock guard, not a perf budget\n` +
  `and pass it as the hook's second argument (copy the shape from\n` +
  `tests/security/tierCreditMultiplierSql.pglite.test.js). Never tune it to a measurement.\n` +
  `The FROZEN_UNGUARDED inventory was cleared 2026-07-27: fix the hook in this same
` +
  `change — never append a row.`;

const renderLiteral = (found) =>
  `const FROZEN_UNGUARDED = Object.freeze({\n${Object.keys(found)
    .sort()
    .map((f) => `  '${f}': ${found[f]},`)
    .join('\n')}\n});`;

describe('pglite hook-timeout ratchet (F4 class habitat removal)', () => {
  test('every boot-bearing hook is guarded, or frozen SHRINK-ONLY', () => {
    const found = scanCorpus();

    if (process.env.UPDATE_PGLITE_HOOK_ALLOWLIST) {
      // Print-only regeneration: paste the literal, review the diff, never auto-write.
       
      console.log(renderLiteral(found));
      expect.fail('UPDATE_PGLITE_HOOK_ALLOWLIST printed a fresh literal above. Paste it over FROZEN_UNGUARDED, review the diff as a reviewed artifact, and re-run without the flag.');
    }

    const violations = [];
    for (const [file, count] of Object.entries(found)) {
      const ceiling = FROZEN_UNGUARDED[file] ?? 0;
      if (count > ceiling) violations.push(ratchetMessage(file, count, ceiling));
    }
    for (const [file, ceiling] of Object.entries(FROZEN_UNGUARDED)) {
      const count = found[file] ?? 0;
      if (count < ceiling) {
        violations.push(
          `${file}: only ${count} unguarded hook(s) remain but the frozen row says ${ceiling}. ` +
          `Bank the win: lower the row to ${count}${count === 0 ? ' by DELETING it' : ''}.`,
        );
      }
    }
    expect(violations).toEqual([]);
  });

  test('inventory honesty: every frozen file still exists', () => {
    const stale = [];
    for (const file of Object.keys(FROZEN_UNGUARDED)) {
      if (!existsSync(join(ROOT, file))) stale.push(`${file}: deleted or renamed — remove its row`);
    }
    expect(stale).toEqual([]);
  });

  test('the guarded exemplars are detected as boot-bearing AND clean (positive pin)', () => {
    // Without this, every green above could mean the detector stopped seeing hooks at all.
    const problems = [];
    for (const file of GUARDED_EXEMPLARS) {
      const src = readFileSync(join(ROOT, file), 'utf8');
      const bootHooks = extractHooks(src).filter((h) => BOOT_MARKER_RE.test(h.text));
      if (bootHooks.length === 0) problems.push(`${file}: detector sees no boot-bearing hook`);
      const bad = unguardedHooks(src);
      if (bad.length > 0) problems.push(`${file}: exemplar has unguarded hooks ${JSON.stringify(bad)}`);
    }
    expect(problems).toEqual([]);
  });

  describe('helper-name law: hooks may only call constructors the marker can see', () => {
    const censusDefs = () => {
      const defs = new Map();
      for (const f of readdirSync(join(ROOT, SCAN_DIR)).filter((n) => n.endsWith('.js')).sort()) {
        for (const name of constructorHelperNames(readFileSync(join(ROOT, SCAN_DIR, f), 'utf8'))) {
          if (!defs.has(name)) defs.set(name, []);
          defs.get(name).push(f);
        }
      }
      return defs;
    };

    test('the census keeps seeing the live constructor roster (vacuity pin)', () => {
      const names = [...censusDefs().keys()];
      for (const known of ['makeDb', 'makeCreditLedgerDb', 'baseDb', 'buildDb', 'supportDb', 'profilesDb', 'makeLegacyDatabase', 'createPre188Database']) {
        expect(names, `census lost sight of ${known}`).toContain(known);
      }
    });

    test('no hook in the corpus calls an unlisted constructor', () => {
      const suites = readdirSync(join(ROOT, SCAN_DIR)).filter((n) => n.endsWith('.pglite.test.js')).sort()
        .map((f) => ({ file: `${SCAN_DIR}/${f}`, src: readFileSync(join(ROOT, SCAN_DIR, f), 'utf8') }));
      expect(helperLawViolations(censusDefs(), suites)).toEqual([]);
    });

    test('constructorHelperNames: declaration/destructured/arrow/expression shapes in, query helpers out', () => {
      const src =
        `async function buildThing({ with060 }) { const db = new PGlite(); return db; }\n` +
        `const arrowMaker = async () => { return new PGlite(); };\n` +
        `const exprMaker = () => new PGlite();\n` +
        `const scalar = async (q) => (await db.query(q)).rows[0];\n` +
        `function reader() { return 'no database here'; }\n`;
      expect([...constructorHelperNames(src)].sort()).toEqual(['arrowMaker', 'buildThing', 'exprMaker']);
    });

    test('a hook calling an unlisted constructor is a violation; a marker-visible hook is not (planted)', () => {
      const defs = new Map([['makeShadowDb', ['shadowHarness.js']]]);
      const offender = { file: 'planted.pglite.test.js', src: `beforeAll(async () => { db = await makeShadowDb(); })` };
      const legal = { file: 'legal.pglite.test.js', src: `beforeAll(async () => { db = await makeDb(); }, 180_000)` };
      const violations = helperLawViolations(defs, [offender, legal]);
      expect(violations).toHaveLength(1);
      expect(violations[0]).toContain('makeShadowDb');
    });
  });

  describe('guard the guard: the detector discriminates on planted fixtures', () => {
    const UNGUARDED_BOOT = `beforeAll(async () => { db = await new PGlite(); await db.exec('select 1'); })`;
    const TUNED_BOOT = `beforeAll(async () => { db = await new PGlite(); }, 30000)`;
    const LITERAL_GUARDED = `beforeAll(async () => { db = await new PGlite(); }, 180_000 /* deadlock guard */)`;
    const CONSTANT_GUARDED_SRC =
      `const PGLITE_BOOT_TIMEOUT_MS = 180_000;\n` +
      `beforeEach(async () => { db = await makeDb(); }, PGLITE_BOOT_TIMEOUT_MS);`;
    const NON_TOUCHING_HOOK = `beforeEach(() => { seed = DEFAULT_SEED; })`;
    const HELPER_BOOT_UNGUARDED = `beforeAll(async () => { db = await makeCreditLedgerDb(); })`;
    const FIRST_EXEC_UNGUARDED = `beforeAll(async () => { db = await bootSomehowElse(); await db.exec('select 1'); })`;
    const WARM_EXEC_AFTER_GUARDED_BOOT =
      `const PGLITE_BOOT_TIMEOUT_MS = 180_000;\n` +
      `beforeAll(async () => { db = await makeDb(); }, PGLITE_BOOT_TIMEOUT_MS);\n` +
      `beforeEach(async () => { await db.exec('truncate public.t;'); });`;

    test('an unguarded boot hook is flagged', () => {
      expect(unguardedHooks(UNGUARDED_BOOT)).toHaveLength(1);
    });

    test('the tuned-30s shape is flagged (below the 60s floor)', () => {
      const bad = unguardedHooks(TUNED_BOOT);
      expect(bad).toHaveLength(1);
      expect(bad[0].timeout).toBe(30000);
    });

    test('a generous numeric literal passes, comment and underscores included', () => {
      expect(unguardedHooks(LITERAL_GUARDED)).toEqual([]);
    });

    test('the named-constant shape resolves through the in-file const and passes', () => {
      expect(unguardedHooks(CONSTANT_GUARDED_SRC)).toEqual([]);
    });

    test('a hook that never touches PGlite is out of scope', () => {
      expect(unguardedHooks(NON_TOUCHING_HOOK)).toEqual([]);
    });

    test('an unguarded helper-boot hook is flagged (the makeCreditLedgerDb shape that hid the eight-file gap)', () => {
      expect(unguardedHooks(HELPER_BOOT_UNGUARDED)).toHaveLength(1);
    });

    test('an unguarded first-exec hook is flagged even when its boot helper is unlisted (lazy boot: the first exec pays)', () => {
      expect(unguardedHooks(FIRST_EXEC_UNGUARDED)).toHaveLength(1);
    });

    test('a warm exec hook after the guarded boot hook is out of scope (only the first toucher pays boot)', () => {
      expect(unguardedHooks(WARM_EXEC_AFTER_GUARDED_BOOT)).toEqual([]);
    });

    test('a beforeEach that boots per test is in scope (the paymentRefundObligations shape)', () => {
      const perTest = `beforeEach(async () => {\n  db = await makeDb();\n})`;
      const bad = unguardedHooks(perTest);
      expect(bad).toHaveLength(1);
      expect(bad[0].kind).toBe('beforeEach');
    });
  });
});
