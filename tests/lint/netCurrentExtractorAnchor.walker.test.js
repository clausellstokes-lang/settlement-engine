/**
 * netCurrentExtractorAnchor.walker.test.js — habitat removal for the UNANCHORED
 * NET-CURRENT EXTRACTOR class (2026-07-27).
 *
 * THE CLASS: the house idiom for reading a function out of supabase/migrations
 * spells a regex over `create or replace function public.<name>`. WITHOUT a
 * line-start anchor (`^` + the m flag), that regex also matches a migration
 * HEADER that quotes the statement in prose — the extract then begins
 * mid-comment and swallows the header (or an unrelated function's body) instead
 * of the real definition. Wave L-5 of docs/DESIGN_AI_CAPABILITY_LADDER.md fed
 * Postgres ~11k characters of English this way. Text-asserting suites are worse:
 * they stay GREEN over prose. The class is live in the corpus, not hypothetical
 * (101's @rollback quotes current_user_is_privileged; 098's wraps
 * mid-identifier, minting a phantom name `enforce_allocation_`). Canonical
 * writeup: tests/security/moneyRpcNetCurrentGuards.test.js.
 *
 * THE WALK: scan tests/ and scripts/ sources for create-or-replace-function
 * regex constructions in any of the three house spellings —
 *   1. escaped:      /create\s+or\s+replace\s+function…/  (regex literals) and
 *                    `create\\s+or\\s+replace\\s+function…` (RegExp strings);
 *   2. plain-space regex literal:  /create or replace function…/;
 *   3. plain-space RegExp string:  new RegExp(`create or replace function…`)
 * — and fail on any occurrence NOT immediately preceded by `^`, naming the file
 * and line. Surviving pre-fix offenders are frozen below, SHRINK-ONLY.
 *
 * CANNOT-CATCH (accepted costs of a regex gate, hand-audited 2026-07-27):
 *   - bare `function\s+<name>` block matches with no create prefix at all
 *     (none exist since the shrink wave rewrote contracts.test.js's onto the
 *     optional-group spelling, which detector 5 now guards);
 *   - substring-search extractors (an indexOf with a create-or-replace
 *     needle) carry no regex to scan — sourceContract.sqlFunctionBody was
 *     converted to the anchored idiom; a future indexOf spelling is invisible
 *     here and is caught only by review;
 *   - sibling statement families (create trigger / create policy extractors,
 *     e.g. enforceSaveLimit's extractTrigger) — a different spelling class;
 *   - `\s*`-spelled or split-across-concatenation patterns (none exist today);
 *   - shell-side patterns in scripts/*.sh (grep/sed syntax; none exist today);
 *   - regexes built from variables where the create prefix lives elsewhere.
 *   Residual coverage: the pglite half of the family fails loudly on any
 *   mis-extract (Postgres refuses prose), and moneyRpcNetCurrentGuards'
 *   assertFunctionShaped() belt guards the text-asserting money path.
 *
 * SELF-EXEMPTION: this file necessarily spells the unanchored patterns (as
 * detector sources and guard-the-guard fixtures), so it exempts itself from the
 * scan; the guard-the-guard cases below prove the detectors on fixtures instead.
 */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, test } from 'vitest';

const ROOT = process.cwd();
const SCAN_ROOTS = ['tests', 'scripts'];
const SCAN_EXT = /\.(js|jsx|mjs|cjs|ts)$/;
const SELF = 'tests/lint/netCurrentExtractorAnchor.walker.test.js';

/**
 * The three detectors. Each captures an optional `^` immediately before
 * `create`; an occurrence with the capture ABSENT is unanchored. The escaped
 * detector matches both the regex-literal spelling (one backslash before `s`)
 * and the RegExp-string spelling (two backslashes). The spellings are mutually
 * exclusive per occurrence, so no site is double-counted.
 */
const DETECTORS = [
  { name: 'escaped', re: /(\^)?create\\{1,2}s\+or\\{1,2}s\+replace\\{1,2}s\+function/gi },
  { name: 'literal', re: /\/(\^)?create or replace function/gi },
  { name: 'constructed', re: /RegExp\(\s*[`'"](\^)?create or replace function/gi },
  { name: 'alternation', re: /(\^)?\(create\|create or replace\)\\{1,2}s\+function/gi },
  { name: 'optional-group', re: /(\^)?create\(\?:\\{1,2}s\+or\\{1,2}s\+replace\)\?\\{1,2}s\+function/gi },
  // The classifier spelling (migration-ordering.mjs): `create\s+(?:or\s+replace\s+)?<kind>`.
  // Its sanctioned anchor is `^[ \t]*create…` (indented DDL is legal there), so
  // the exemption capture accepts `^` optionally followed by a `[…]*` class.
  { name: 'kind-group', re: /(\^(?:\[[^\]]*\]\*)?)?create\\{1,2}s\+\(\?:or\\{1,2}s\+replace\\{1,2}s\+\)\?/gi },
];

/** { 'relative/file.js': { count, lines: [n, …] } } for UNANCHORED occurrences. */
function scanForUnanchored() {
  const found = {};
  const walk = (dir) => {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) { walk(p); continue; }
      const rel = relative(ROOT, p).split('/').join('/').replace(/\\/g, '/');
      if (!SCAN_EXT.test(rel) || rel === SELF) continue;
      const src = readFileSync(p, 'utf8');
      const lines = [];
      for (const { re } of DETECTORS) {
        re.lastIndex = 0;
        for (const m of src.matchAll(re)) {
          if (m[1]) continue; // `^`-anchored — the house form
          lines.push(src.slice(0, m.index).split('\n').length);
        }
      }
      if (lines.length) found[rel] = { count: lines.length, lines: lines.sort((a, b) => a - b) };
    }
  };
  for (const root of SCAN_ROOTS) if (existsSync(join(ROOT, root))) walk(join(ROOT, root));
  return found;
}

/**
 * FROZEN 2026-07-27, post-shrink-wave. SHRINK-ONLY, and every remaining row is
 * a DELIBERATE decision, not debt:
 *   - moneyRpcNetCurrentGuards.test.js (3): its NEGATIVE CONTROLS — the
 *     pre-fix extractor and the prose-discovery scan kept on purpose to prove
 *     the old form takes prose; they move only with that file.
 *   - dossierEntitlements.pglite.test.js (3: the not-reintroduced pins around
 *     lines 424/425 and the nameless enumerator feeding the not.toMatch at
 *     ~441) and gallery_privacy.contract.test.js (2: the "leaves the
 *     sanitizers untouched" pins at ~128/129): NEGATIVE-PRESENCE guards. Their
 *     job is to catch a FUTURE re-creation at ANY indentation, so anchoring
 *     would WEAKEN them; each carries an inline comment at the site.
 * Everything else was anchored by the 2026-07-27 shrink wave, with per-site
 * old-vs-new parity executed against each site's real inputs before the edit.
 * To fix a remaining site (only with its polarity understood): spell it
 * `^create…` + m, prove parity, then LOWER the row (delete at 0).
 * Never raise a number; never add a file.
 */
const FROZEN_UNANCHORED = Object.freeze({
  'tests/security/dossierEntitlements.pglite.test.js': 3, // DELIBERATE: negative-presence guards
  'tests/security/gallery_privacy.contract.test.js': 2, // DELIBERATE: negative-presence guards
  'tests/security/moneyRpcNetCurrentGuards.test.js': 3, // DELIBERATE: negative controls
});

describe('unanchored net-current extractor walker (habitat removal)', () => {
  const found = scanForUnanchored();

  test('no NEW unanchored create-or-replace-function regex in tests/ or scripts/', () => {
    const violations = [];
    for (const [file, { count, lines }] of Object.entries(found)) {
      const ceiling = FROZEN_UNANCHORED[file] ?? 0;
      if (count > ceiling) {
        violations.push(
          `${file}: ${count} unanchored create-or-replace-function regex(es) at line(s) `
          + `${lines.join(', ')} (frozen ceiling ${ceiling}). An unanchored form also matches a `
          + `migration HEADER that quotes the statement in prose, so an extractor starts `
          + `mid-comment and swallows English instead of SQL — and text-asserting suites stay `
          + `GREEN over prose. Spell it ^create\\s+or\\s+replace\\s+function… with the m flag `
          + `(see tests/security/moneyRpcNetCurrentGuards.test.js). Fixed a site? LOWER this `
          + `file's number in FROZEN_UNANCHORED (delete the row at 0). Never raise a number; `
          + `never add a file.`,
        );
      }
    }
    expect(violations).toEqual([]);
  });

  test('inventory honesty: every frozen entry still exists and still offends at its count', () => {
    const stale = [];
    for (const [file, ceiling] of Object.entries(FROZEN_UNANCHORED)) {
      if (!existsSync(join(ROOT, file))) {
        stale.push(`${file}: deleted or moved — remove its FROZEN_UNANCHORED row`);
      } else if ((found[file]?.count ?? 0) < ceiling) {
        stale.push(
          `${file}: ${found[file]?.count ?? 0} unanchored site(s) found, ceiling ${ceiling} — `
          + `a site was fixed; LOWER the row to ${found[file]?.count ?? 0} (delete at 0) to bank the win`,
        );
      }
    }
    expect(stale).toEqual([]);
  });

  // ── GUARD-THE-GUARD: the detectors themselves, on fixtures ────────────────
  // A scanner regression would otherwise read as "no offenders". Each fixture
  // is exercised directly against the detector set; unanchored spellings must
  // fire, anchored spellings and plain SQL fixture text must not.
  const hits = (text) => DETECTORS.reduce((n, { re }) => {
    re.lastIndex = 0;
    return n + [...text.matchAll(re)].filter((m) => !m[1]).length;
  }, 0);

  test('detectors fire on every unanchored spelling', () => {
    expect(hits('src.match(/create\\s+or\\s+replace\\s+function\\s+public\\.foo\\b/i)'), 'regex literal, escaped').toBe(1);
    expect(hits('new RegExp(`create\\\\s+or\\\\s+replace\\\\s+function\\\\s+public\\\\.${name}\\\\b`, "i")'), 'RegExp string, escaped').toBe(1);
    expect(hits('sql.match(/create or replace function[\\s\\S]*?\\$\\$;/gi)'), 'regex literal, plain-space').toBe(1);
    expect(hits('new RegExp(`create or replace function public\\\\.${name}\\\\b`, "i")'), 'RegExp string, plain-space').toBe(1);
    expect(hits('expect(migrations).toMatch(/(create|create or replace)\\s+function\\s+(public\\.)?refund_credits/i)'), 'alternation spelling').toBe(1);
    expect(hits('migrations.match(/create(?:\\s+or\\s+replace)?\\s+function\\s+(public\\.)?refund_credits[\\s\\S]{0,4000}/i)'), 'optional-group spelling').toBe(1);
    expect(hits('const re = /create\\s+(?:or\\s+replace\\s+)?(?:function|table)\\s+(?:public\\.)?([a-z_][a-z0-9_]*)/gi'), 'kind-group spelling').toBe(1);
  });

  test('detectors stay silent on the anchored house form', () => {
    expect(hits('src.match(/^create\\s+or\\s+replace\\s+function\\s+public\\.foo\\b/im)'), 'anchored regex literal').toBe(0);
    expect(hits('new RegExp(`^create\\\\s+or\\\\s+replace\\\\s+function\\\\s+public\\\\.${name}\\\\b`, "im")'), 'anchored RegExp string').toBe(0);
    expect(hits('sql.match(/^create or replace function public\\\\.foo/m)'), 'anchored plain-space literal').toBe(0);
    expect(hits('expect(migrations).toMatch(/^(create|create or replace)\\s+function/im)'), 'anchored alternation').toBe(0);
    expect(hits('migrations.match(/^create(?:\\s+or\\s+replace)?\\s+function/im)'), 'anchored optional-group').toBe(0);
    expect(hits('const re = /^[ \\t]*create\\s+(?:or\\s+replace\\s+)?(?:function|table)/gim'), 'anchored kind-group (classifier form)').toBe(0);
  });

  test('the migrations corpus itself keeps every create-or-replace-function at column 0', () => {
    // The anchored extractors are COMPLETE only while no real definition is
    // indented. Machine-close that assumption at the source: an indented
    // definition (e.g. inside a DO block) must fail here, never silently
    // vanish from net-current extraction. Comment prose is immune — `--`
    // precedes any embedded create on a comment line, so it cannot match.
    const MIG_DIR = join(ROOT, 'supabase', 'migrations');
    const offenders = [];
    for (const f of readdirSync(MIG_DIR).filter((n) => n.endsWith('.sql'))) {
      const src = readFileSync(join(MIG_DIR, f), 'utf8');
      for (const m of src.matchAll(/^[ \t]+create\s+or\s+replace\s+function/gim)) {
        offenders.push(
          `supabase/migrations/${f}: INDENTED create-or-replace-function at line `
          + `${src.slice(0, m.index).split('\n').length}. The house extractors anchor on `
          + `column-0 definitions; either dedent this statement, or — if it is genuinely `
          + `dynamic SQL — rework the extractors that pin this function before landing it.`,
        );
      }
    }
    expect(offenders).toEqual([]);
    // Guard-the-guard: the scan fires on an indented fixture.
    expect([...'  create or replace function public.x()'.matchAll(/^[ \t]+create\s+or\s+replace\s+function/gim)].length).toBe(1);
  });

  test('detectors stay silent on plain SQL fixture text (not a regex context)', () => {
    // pglite suites carry real SQL in template strings; that is data, not an
    // extractor, and must never join the inventory.
    expect(hits('await db.exec(`\n      create or replace function public.account_is_active(p uuid)\n      returns boolean language sql stable as $fn$ select true $fn$;\n    `)')).toBe(0);
    expect(hits("const planted = ['create or replace function public.helper()', 'as $$ begin end $$;'].join('\\n')")).toBe(0);
  });

  test('the scan itself is not vacuous (it sees the frozen population)', () => {
    // If the walker's directory walk or extension filter silently broke, found
    // would collapse and the honesty test would demand mass-lowering — but pin
    // the aggregate here too so the failure names the real problem first.
    const totalFound = Object.values(found).reduce((n, { count }) => n + count, 0);
    const totalFrozen = Object.values(FROZEN_UNANCHORED).reduce((a, b) => a + b, 0);
    expect(totalFound, 'scan found fewer unanchored sites than the frozen inventory — either sites were fixed (lower their rows) or the scanner broke').toBeGreaterThanOrEqual(totalFrozen);
  });
});
