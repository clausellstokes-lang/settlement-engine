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
 * THE WALK: extract every beforeAll/beforeEach call in every tests/security/*.test.js
 * (ANY test file there, not only *.pglite.test.js — a booting hook does not care what
 * its file is called; paren-matched from the hook keyword), keep the BOOT-BEARING ones — callback text
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
 *     HELPER-NAME LAW below turns this from convention into enforcement, and the
 *     JURISDICTION test pins `new PGlite` to tests/security across tests/ and
 *     scripts/ (quoters frozen with rationale), so an out-of-scope constructor
 *     cannot exist to be imported. Remaining escape: a constructor in src/ —
 *     none exists, and one would be a product-architecture change (shipping
 *     in-browser Postgres), not a test helper.
 *   - Two files construct PGlite inside per-test helper/test bodies rather than hooks
 *     (customContentBackfill, reviewedQuarantineConflict). Those boots run under
 *     testTimeout, not hookTimeout — a different failure surface this ratchet does
 *     not claim.
 *   - The exec rule orders hooks beforeAll-then-beforeEach (source order within each)
 *     to pick the file's first toucher; an exotic layout — a later describe's
 *     beforeEach outrunning an earlier describe's beforeAll — could flag a warm hook.
 *     A LOUD false positive, fixed by guarding the flagged hook.
 *   - (CURED 2026-11-25, WORDS-2 unit E11, the tenth chair's PRERELEASE-LIST E11.) Paren
 *     and brace matching WAS string-naive: an escaped `\(` in a regex literal, or an
 *     unbalanced `)` inside a string, was counted as code, so the hook's extracted text ran
 *     past its own close (or stopped short of it) and a guarded hook read as unguarded (the
 *     ninth chair's N-intake: a test file had to spell `\x28` to get past it). The matchers
 *     now count delimiters over `codeMask(src)`: the source with every string, template
 *     text, comment and regex-literal body blanked (same length, newlines kept), so the
 *     slices are still taken from the real text. What still escapes: a regex literal the
 *     mask's one-token look-behind reads as a division (a `/` after `)` or `]` that opens a
 *     regex) is counted as code: none exist in the corpus; the guard-the-guard arm plants
 *     the shapes the mask must read.
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
import { parse } from 'espree';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SCAN_DIR = 'tests/security';

/** Below this, a timeout is either absent or tuned-to-a-measurement; both are the class. */
const FLOOR_MS = 60_000;

/**
 * A hook whose callback text matches this is standing up (or first-exec-booting)
 * PGlite. The alternation carries the LIVE boot-helper roster (2026-07-27 amendment):
 * makeDb (the common cross-file harness name), makeCreditLedgerDb
 * (creditLedgerHarness.js), bootHostedChain (hostedDefaultHarness.js, GRANTS-1), and
 * the local baseDb/buildDb/supportDb helpers. Add every
 * NEW harness name here when introducing one — the exec-aware rule in unguardedHooks
 * catches the common miss (a hook that also execs directly), but a pure
 * `await newHelper()` with no in-hook exec is invisible until listed.
 */
const BOOT_MARKER_RE = /new\s+PGlite|\b(?:makeDb|makeCreditLedgerDb|baseDb|buildDb|supportDb|bootHostedChain|boot)\s*\(/;

/** A hook whose callback touches the db at all — the lazy-boot payment surface. */
const EXEC_RE = /\.exec\s*\(|\.query\s*\(/;

/**
 * The hook call's trailing timeout argument: a numeric literal (underscores legal) or an
 * identifier, optionally followed by a block comment, then the call's closing paren.
 */
const TAIL_ARG_RE = /,\s*([0-9][0-9_]*|[A-Za-z_$][\w$]*)\s*(?:\/\*[\s\S]*?\*\/\s*)?\)$/;

/**
 * THE SOURCE WITH EVERY NON-CODE CHARACTER BLANKED (E11): the bodies of '…' and "…" strings, the text of `…` templates
 * (a `${…}` hole is code again, to any depth), // and /* *\/ comments, and the bodies of regex literals (a `/` is a regex's
 * opening where the last code token before it cannot end an expression: start, an operator or punctuator, or `return`,
 * `typeof`, `case`, `in`, `of`, `void`, `delete`, `throw`, `new`, `do`, `else`, `yield`, `await`), each replaced by a space
 * (a newline kept), so an index into the mask is an index into the source. The delimiters themselves stay, so a string is
 * seen as one token and a regex `/\(/` keeps its slashes and loses its paren.
 * @param {string} src @returns {string}
 */
function codeMask(src) {
  const out = src.split('');
  const n = src.length;
  const blank = (/** @type {number} */ k) => { if (out[k] !== '\n') out[k] = ' '; };
  /** the index of the last non-space code character written before i, or -1 */
  const lastCode = (/** @type {number} */ i) => { let k = i - 1; while (k >= 0 && /\s/.test(out[k])) k -= 1; return k; };
  const REGEX_AFTER_WORD = /(?:^|[^\w$])(?:return|typeof|case|in|of|void|delete|throw|new|do|else|yield|await)$/;
  /** @type {Array<'tpl'|'hole'>} what each open `${` or template belongs to */
  const stack = [];
  let braces = 0; // `{` depth inside the innermost `${…}` hole
  /** @type {number[]} */ const holeBraces = [];
  let i = 0;
  const scanTemplateText = () => { // at a char inside template text; stops after the closing ` or at a `${`
    while (i < n) {
      const c = src[i];
      if (c === '\\') { blank(i); blank(i + 1); i += 2; continue; }
      if (c === '`') { stack.pop(); i += 1; return; }
      if (c === '$' && src[i + 1] === '{') { stack.push('hole'); holeBraces.push(braces); braces = 0; i += 2; return; }
      blank(i); i += 1;
    }
  };
  while (i < n) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') { blank(i); i += 1; } continue; }
    if (c === '/' && src[i + 1] === '*') { const end = src.indexOf('*/', i + 2); const stop = end < 0 ? n : end + 2; while (i < stop) { blank(i); i += 1; } continue; }
    if (c === "'" || c === '"') {
      i += 1;
      while (i < n && src[i] !== c && src[i] !== '\n') { if (src[i] === '\\') { blank(i); i += 1; } blank(i); i += 1; }
      i += 1; continue;
    }
    if (c === '`') { stack.push('tpl'); i += 1; scanTemplateText(); continue; }
    if (c === '{' && stack[stack.length - 1] === 'hole') { braces += 1; i += 1; continue; }
    if (c === '}' && stack[stack.length - 1] === 'hole') {
      if (braces > 0) { braces -= 1; i += 1; continue; }
      stack.pop(); braces = holeBraces.pop() ?? 0; i += 1; scanTemplateText(); continue;
    }
    if (c === '/') {
      const k = lastCode(i);
      const prev = k < 0 ? '' : out[k];
      const isRegex = k < 0 || /[(,=:[!&|?{};+\-*%<>~^]/.test(prev) || REGEX_AFTER_WORD.test(out.slice(Math.max(0, k - 8), k + 1).join(''));
      if (isRegex) {
        i += 1;
        let inClass = false;
        while (i < n && src[i] !== '\n') {
          const d = src[i];
          if (d === '\\') { blank(i); blank(i + 1); i += 2; continue; }
          if (d === '[') inClass = true;
          else if (d === ']') inClass = false;
          else if (d === '/' && !inClass) break;
          blank(i); i += 1;
        }
        i += 1; continue;
      }
    }
    i += 1;
  }
  return out.join('');
}

/** Every beforeAll/beforeEach call in a source, paren-matched to its own closing paren (over `codeMask`, E11). */
function extractHooks(src) {
  const hooks = [];
  const code = codeMask(src);
  const re = /\b(beforeAll|beforeEach)\s*\(/g;
  let m;
  // the keyword is sought in CODE too: a `beforeAll (` in a comment or a string opens no hook
  while ((m = re.exec(code))) {
    let i = re.lastIndex;
    let depth = 1;
    while (i < src.length && depth > 0) {
      const ch = code[i];
      if (ch === '(') depth += 1;
      else if (ch === ')') depth -= 1;
      i += 1;
    }
    hooks.push({
      kind: m[1],
      start: m.index,
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
 * Rule (2) additionally requires the FILE to actually USE PGlite — import
 * @electric-sql/pglite or construct `new PGlite` — not merely mention it: a suite
 * driving real PostgreSQL (pg Client `.query(` — customContentLockOrder.postgres,
 * whose header PROSE explains PGlite while constructing none) has no lazy WASM
 * boot to pay, so its exec-touching hooks are not this class.
 */
function unguardedHooks(src) {
  const filePGlite = /new\s+PGlite|@electric-sql\/pglite/.test(src);
  const hooks = extractHooks(src);
  const ordered = [...hooks.filter((h) => h.kind === 'beforeAll'), ...hooks.filter((h) => h.kind === 'beforeEach')];
  const firstToucher = ordered.find((h) => BOOT_MARKER_RE.test(h.text) || (filePGlite && EXEC_RE.test(h.text)));
  const bad = [];
  for (const h of hooks) {
    if (!BOOT_MARKER_RE.test(h.text) && !(filePGlite && h === firstToucher && EXEC_RE.test(h.text))) continue;
    const t = timeoutOf(h.text, src);
    if (t === null || t < FLOOR_MS) bad.push({ kind: h.kind, line: h.line, timeout: t });
  }
  return bad;
}

/** Index just past the delimiter that closes the one opening at openIdx (counted over `codeMask`, E11). */
function matchedClose(src, openIdx, open, close) {
  const code = codeMask(src);
  let i = openIdx;
  let depth = 0;
  do {
    const ch = code[i];
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
 * Its brace and paren matching reads `codeMask(src)` (E11), so a brace or paren inside a
 * body's string, template text, comment or regex literal no longer desyncs the match; the
 * fixture test pins the live shapes.
 */
function constructorHelperNames(src) {
  const names = new Set();
  const heads = [
    /(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*(?=\()/g,
    /const\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s+)?(?:function\s*)?(?=\()/g,
  ];
  const code = codeMask(src); // a head in a comment or a string declares nothing (E11)
  for (const re of heads) {
    let m;
    while ((m = re.exec(code))) {
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

/**
 * Files under tests/ and scripts/ that may mention `new PGlite` WITHOUT living in
 * tests/security — each row is a QUOTER (pattern text, never construction), frozen
 * with its rationale. The jurisdiction test proves every row still exists, still
 * mentions the pattern, and that nothing else outside tests/security does.
 */
const PGLITE_OUTSIDE_JURISDICTION = Object.freeze({
  'tests/lint/contractTestAntiVacuity.walker.test.js':
    'quotes `new PGlite` inside its DERIV_RE detection regex; never constructs',
});

/** Every .js/.jsx/.mjs/.ts file under dir (repo-relative), recursively. */
function* walkSourceFiles(dir) {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = `${dir}/${e.name}`;
    if (e.isDirectory()) yield* walkSourceFiles(rel);
    else if (/\.(js|jsx|mjs|ts)$/.test(e.name)) yield rel;
  }
}

/**
 * @returns {Record<string, number>} unguarded-hook count per tests/security suite.
 * Scope is EVERY *.test.js in tests/security, not only *.pglite.test.js — a
 * pglite-booting hook in a conventionally named file is the same flake with a
 * different filename (non-booting files contribute zero and cost microseconds).
 */
function scanCorpus() {
  const found = {};
  // Self-exclusion: this file's guard-the-guard fixtures QUOTE offending hook
  // shapes as template-literal text; scanning self would flag the quotes.
  for (const f of readdirSync(join(ROOT, SCAN_DIR)).filter((n) => n.endsWith('.test.js') && n !== 'pgliteHookTimeoutRatchet.test.js').sort()) {
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

  test('jurisdiction: `new PGlite` lives only where this ratchet can see it', () => {
    const problems = [];
    for (const dir of ['tests', 'scripts']) {
      for (const rel of walkSourceFiles(dir)) {
        if (rel.startsWith(`${SCAN_DIR}/`)) continue;
        if (!/new\s+PGlite/.test(readFileSync(join(ROOT, rel), 'utf8'))) continue;
        if (PGLITE_OUTSIDE_JURISDICTION[rel]) continue;
        problems.push(
          `${rel}: mentions \`new PGlite\` outside ${SCAN_DIR}, where this ratchet cannot police hooks. ` +
          `Move the construction under ${SCAN_DIR}, or — if the file only QUOTES the pattern — freeze it in ` +
          `PGLITE_OUTSIDE_JURISDICTION with a rationale.`,
        );
      }
    }
    for (const [rel, why] of Object.entries(PGLITE_OUTSIDE_JURISDICTION)) {
      if (!existsSync(join(ROOT, rel))) {
        problems.push(`${rel}: frozen quoter no longer exists (${why}) — remove its row`);
      } else if (!/new\s+PGlite/.test(readFileSync(join(ROOT, rel), 'utf8'))) {
        problems.push(`${rel}: frozen quoter no longer mentions the pattern (${why}) — remove its row`);
      }
    }
    expect(problems).toEqual([]);
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
      const suites = readdirSync(join(ROOT, SCAN_DIR)).filter((n) => n.endsWith('.test.js')).sort()
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
    const FIRST_EXEC_UNGUARDED =
      `import { PGlite } from '@electric-sql/pglite';\n` +
      `beforeAll(async () => { db = await bootSomehowElse(); await db.exec('select 1'); })`;
    const REAL_POSTGRES_EXEC_HOOK = `beforeAll(async () => { admin = new Client({ connectionString: url }); await admin.query('create database x'); })`;
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

    test('a real-PostgreSQL suite (no PGlite in the file) is out of scope for the exec rule', () => {
      expect(unguardedHooks(REAL_POSTGRES_EXEC_HOOK)).toEqual([]);
    });

    test('a warm exec hook after the guarded boot hook is out of scope (only the first toucher pays boot)', () => {
      expect(unguardedHooks(WARM_EXEC_AFTER_GUARDED_BOOT)).toEqual([]);
    });

    // E11 (WORDS-2, the tenth chair's PRERELEASE-LIST E11): the matcher counts delimiters in CODE only. Each plant is a
    // guarded hook whose body carries a paren the old string-naive matcher counted: red on the base (read as unguarded),
    // green over `codeMask`.
    test('a guarded hook with an escaped paren in a regex literal reads guarded (E11)', () => {
      const src = `const PGLITE_BOOT_TIMEOUT_MS = 180_000;\nbeforeAll(async () => { db = await makeDb(); const open = /\\(/; }, PGLITE_BOOT_TIMEOUT_MS);\nconst after = 1;`;
      expect(unguardedHooks(src)).toEqual([]);
    });

    test('a guarded hook with a lone paren inside a string, a template and a comment reads guarded (E11)', () => {
      const src = `beforeAll(async () => {\n  db = await makeDb(); // a stray ) in a comment\n  log(')'); log(\`(\${pad(1)}\`); /* ( */\n}, 180_000)`;
      expect(unguardedHooks(src)).toEqual([]);
      expect(extractHooks(src)[0].text.endsWith('180_000)')).toBe(true);
    });

    test('the mask keeps code and blanks only non-code, index for index (E11)', () => {
      const src = `a = b / c; d = /\\)[)]/g.test(x) ? '(' : \`\${f(')')})\`; // )\nreturn /(/;`;
      const code = codeMask(src);
      expect(code.length).toBe(src.length);
      expect(code.split('\n').length).toBe(src.split('\n').length);
      // the division stays code; every paren left in the mask is a real call or group of the code
      expect(code).toContain('b / c');
      expect([...code].filter((ch) => ch === '(').length).toBe([...code].filter((ch) => ch === ')').length);
      expect(code.replace(/[^()]/g, '')).toBe('()()');
    });

    test('over every file of the corpus the matcher finds exactly the hooks a parser finds, each to its own close (E11)', () => {
      // THE ORACLE IS INDEPENDENT: espree's AST (every CallExpression whose callee is beforeAll or beforeEach), not the mask.
      const problems = [];
      let hooksSeen = 0;
      for (const f of readdirSync(join(ROOT, SCAN_DIR)).filter((n) => n.endsWith('.test.js') && n !== 'pgliteHookTimeoutRatchet.test.js').sort()) {
        const src = readFileSync(join(ROOT, SCAN_DIR, f), 'utf8');
        /** @type {Array<[number, number]>} */ const parsed = [];
        const visit = (/** @type {any} */ node) => {
          if (!node || typeof node !== 'object') return;
          if (Array.isArray(node)) { node.forEach(visit); return; }
          if (node.type === 'CallExpression' && node.callee?.type === 'Identifier' && /^before(?:All|Each)$/.test(node.callee.name)) parsed.push(node.range);
          for (const k of Object.keys(node)) if (k !== 'range' && k !== 'loc') visit(node[k]);
        };
        visit(parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true }));
        const found = extractHooks(src).map((h) => [h.start, h.start + h.text.length]);
        hooksSeen += parsed.length;
        if (JSON.stringify(found) !== JSON.stringify(parsed)) problems.push(`${f}: matcher ${JSON.stringify(found)} parser ${JSON.stringify(parsed)}`);
      }
      expect(hooksSeen).toBeGreaterThan(50);
      expect(problems).toEqual([]);
    });

    test('a beforeEach that boots per test is in scope (the paymentRefundObligations shape)', () => {
      const perTest = `beforeEach(async () => {\n  db = await makeDb();\n})`;
      const bad = unguardedHooks(perTest);
      expect(bad).toHaveLength(1);
      expect(bad[0].kind).toBe('beforeEach');
    });
  });
});
