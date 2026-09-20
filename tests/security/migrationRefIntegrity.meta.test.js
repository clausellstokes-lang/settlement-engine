/**
 * migrationRefIntegrity.meta.test.js — SS4: the anti-vacuity walker for the
 * runIf-gated security suites.
 *
 * THE HOLE THIS CLOSES (executed, not hypothetical): 60+ security suites gate
 * their whole describe on `describe.runIf(existsSync(<migration>))`. When a
 * cross-worktree renumber/rename makes that existsSync false, the suite SKIPS,
 * vitest exits 0, CI stays green — and the pin (a stripe_subscription_id
 * self-UPDATE lock, a refund-ledger contract, a sanitizer allowlist) is simply
 * no longer enforced. `runIf(false)` with a guaranteed-fail test was confirmed
 * to exit 0. The per-file "anti-vacuity sentinel" was an unenforced convention;
 * several files (profileStripeSubPin, refundLedger.contract,
 * gallerySanitizeAllowlist's drift block) lack it.
 *
 * THE WALKER: every migration FILENAME any tests/security file references must
 * exist under supabase/migrations/. A renumber now fails THIS suite loudly —
 * with the referencing test named — instead of silently skipping the gated one.
 *
 * ── THE DECLARED SYNTHETIC NAME (CURE-I, 2026-09-20) ─────────────────────────
 * Run 19 reddened here on five literals that are not references at all.
 * tests/security/galleryScannerMirrorTotality.test.js builds its own SORT
 * FIXTURES — '089_a.sql', '202_b.sql', '1000_z.sql' — because proving that
 * NUMERIC order beats LEXICAL order needs a four-digit prefix the live corpus
 * does not have. Two instruments disagreed about what a quoted literal means:
 * the product was sound and the gate was red.
 *
 * THE CURE IS A DECLARATION, NEVER AN EXEMPTION. A literal whose own line, or
 * the ONE line immediately above it, carries
 *   // synthetic-migration-name: <why this names no migration>
 * is read as SYNTHETIC: excluded from the existence check AND asserted to be
 * genuinely ABSENT. The marker therefore cannot hide anything — aiming it at a
 * real migration is its own loud red. Three properties, each one a thing the
 * cheaper fixes would have cost:
 *   • the guard stays armed for UNMARKED names (self-test 1 below executes it);
 *   • a second file-level exclusion would be a blanket exemption behind which a
 *     genuinely vacated runIf gate could hide. This is per LITERAL, declared at
 *     the site, and visible in the diff that introduces it;
 *   • computing the names to dodge MIG_REF_RE would have been an evasion of the
 *     CANNOT-CATCH gap declared below, silently widening it for everyone.
 * Placement matches the estate's `// anchored:` idiom exactly — own line or the
 * one immediately above, nothing else consulted — so one habit serves both
 * readers (tests/lint/negativeAssertionAnchor.walker.test.js, THE MARKER RULE).
 * A marker wrapped over two comment lines must carry the token on its LAST line.
 *
 * KNOWN EDGE, inherited from the plain line scan and named rather than hidden: the
 * token is recognised wherever it appears on those two lines, including inside a
 * string or prose that merely QUOTES it. A false declaration is therefore possible
 * by accident — but it is not silent, because a declared name is asserted absent,
 * so the only literal it can ever excuse is one that names no migration anyway.
 *
 * CANNOT-CATCH: a migration referenced through a computed/joined variable whose
 * basename never appears as a literal (zero instances at freeze time), and
 * suites gated on non-migration artifacts. Mutation-sweep area 12 proves this
 * walker actually reddens on a missing migration.
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const REPO = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), '..', '..');
const SEC_DIR = path.join(REPO, 'tests', 'security');
const MIG_DIR = path.join(REPO, 'supabase', 'migrations');

/** Migration-basename literals: `NNN_some_name.sql` in any quote style. */
const MIG_REF_RE = /['"`](\d{3}[A-Za-z0-9_-]*\.sql)['"`]/g;

/** The DECLARED synthetic name: `// synthetic-migration-name: <reason>`. A reason,
 *  not a mute button — the declaration is itself asserted, below. */
const SYNTHETIC_MARKER_RE = /\/\/\s*synthetic-migration-name:/;

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, out);
    else if (/\.test\.js$/.test(e.name)) out.push(fp);
  }
  return out;
}

/**
 * Every migration-name literal in ONE source, tagged with its line and with whether
 * that site DECLARES the name synthetic. Line-oriented because the marker is read
 * exactly as `// anchored:` is: the literal's own line, or the ONE line immediately
 * above it, and nothing else.
 *
 * This is the reader the live arms and the three marker self-tests both drive. A
 * self-test that re-implemented it would prove nothing about it.
 *
 * @param {string} src the file's text
 * @param {string} file repo-relative path, carried into the messages
 * @returns {{ file: string, migration: string, line: number, synthetic: boolean }[]}
 */
function refsIn(src, file) {
  const lines = src.split('\n');
  const refs = [];
  for (let i = 0; i < lines.length; i += 1) {
    MIG_REF_RE.lastIndex = 0;
    const hits = [...lines[i].matchAll(MIG_REF_RE)];
    if (!hits.length) continue;
    const synthetic = SYNTHETIC_MARKER_RE.test(lines[i])
      || (i > 0 && SYNTHETIC_MARKER_RE.test(lines[i - 1]));
    for (const hit of hits) refs.push({ file, migration: hit[1], line: i + 1, synthetic });
  }
  return refs;
}

/** Every migration literal in tests/security. The walker skips ITSELF: its detector
 *  and marker self-tests below plant deliberately-fake literals AND a deliberate lie. */
function gatherRefs() {
  const refs = [];
  for (const abs of walk(SEC_DIR)) {
    if (abs.endsWith('migrationRefIntegrity.meta.test.js')) continue;
    const rel = path.relative(REPO, abs).split(path.sep).join('/');
    refs.push(...refsIn(fs.readFileSync(abs, 'utf8'), rel));
  }
  return refs;
}

/** THE EXISTENCE VERDICT. One message per UNMARKED literal naming no migration file.
 *  @param {ReturnType<typeof refsIn>} refs @returns {string[]} */
function missingReferences(refs) {
  return refs
    .filter(({ migration, synthetic }) => !synthetic && !fs.existsSync(path.join(MIG_DIR, migration)))
    .map(({ file, migration }) =>
      `${file} references supabase/migrations/${migration} — which does not exist.\n` +
      `  If that suite is runIf-gated on this file, it is now SILENTLY SKIPPED and its\n` +
      `  security pin is unenforced. A renumber/rename must update the referencing test\n` +
      `  in the same change; deleting a migration outright needs its pins re-homed first.\n` +
      `  If the literal is a FIXTURE naming no migration, declare it AT THE SITE with\n` +
      `  // synthetic-migration-name: <why> — on its own line or the one directly above.`);
}

/** THE DECLARATION VERDICT. One message per MARKED literal that names a real migration
 *  after all — a marker excluding a live reference instead of a fixture.
 *  @param {ReturnType<typeof refsIn>} refs @returns {string[]} */
function lyingMarkers(refs) {
  return refs
    .filter(({ migration, synthetic }) => synthetic && fs.existsSync(path.join(MIG_DIR, migration)))
    .map(({ file, migration, line }) =>
      `${file}:${line} declares '${migration}' synthetic, but supabase/migrations/${migration} EXISTS.\n` +
      `  THE MARKER LIES: a real migration hides behind a synthetic marker, and this site is\n` +
      `  now excluded from the existence check — so a later renumber of that very migration\n` +
      `  would pass here unnoticed, which is the hole this walker exists to close. Either the\n` +
      `  marker sits on the wrong line and is muting a real reference (move it), or a fixture\n` +
      `  picked a name the corpus has since taken (rename the FIXTURE, never the migration).`);
}

describe('security-suite migration references resolve (runIf cannot silently vacate)', () => {
  const refs = gatherRefs();
  const declaredSynthetic = refs.filter(({ synthetic }) => synthetic);

  it('every referenced migration file exists under supabase/migrations/', () => {
    expect(missingReferences(refs)).toEqual([]);
  });

  it('every DECLARED synthetic name is genuinely absent (a marker may not hide a real migration)', () => {
    expect(lyingMarkers(refs)).toEqual([]);
  });

  it('the scan is non-vacuous (refs and runIf-gated suites are actually present)', () => {
    expect(refs.length, 'migration-literal extraction found implausibly few refs').toBeGreaterThanOrEqual(40);
    const runIfFiles = walk(SEC_DIR).filter((f) => /\brunIf\s*\(/.test(fs.readFileSync(f, 'utf8')));
    expect(runIfFiles.length, 'runIf census collapsed — did the gating idiom change?').toBeGreaterThanOrEqual(30);
    // THE MARKER'S OWN LIVENESS. A file carrying the token while the reader reports no
    // synthetic literal means MIG_REF_RE and SYNTHETIC_MARKER_RE have drifted apart — the
    // declaration would then be excluding nothing, or excluding a literal silently.
    const markerFiles = walk(SEC_DIR)
      .filter((f) => !f.endsWith('migrationRefIntegrity.meta.test.js'))
      .filter((f) => SYNTHETIC_MARKER_RE.test(fs.readFileSync(f, 'utf8')));
    expect(
      markerFiles.length > 0 && declaredSynthetic.length === 0,
      `${markerFiles.length} tests/security file(s) carry the synthetic-name marker, and the reader`
      + ' found NO synthetic literal. The two regexes have drifted apart, so the declaration is inert'
      + ` — files: ${markerFiles.map((f) => path.relative(REPO, f)).join(', ')}`,
    ).toBe(false);
  });

  it('detector self-test: the literal extractor catches every quote style', () => {
    const sample = `x('009_profile_security.sql'); y("087_review_money_hardening.sql"); z(\`123_money.sql\`)`;
    const got = [...sample.matchAll(MIG_REF_RE)].map((m) => m[1]);
    expect(got).toEqual(['009_profile_security.sql', '087_review_money_hardening.sql', '123_money.sql']);
  });

  // ── THE THREE MARKER SELF-TESTS ─────────────────────────────────────────────
  // Each drives the LIVE reader and the LIVE verdicts over a planted source, so the
  // declaration is proved to discriminate rather than merely to exist. Their planted
  // literals live in this file, which gatherRefs skips by name.

  it('marker self-test 1: an UNMARKED fake name still fires (the guard is not disarmed)', () => {
    const planted = refsIn(`describe.runIf(existsSync(join(DIR, '998_no_such_migration.sql')))`, 'planted.test.js');
    expect(planted.map(({ migration, synthetic }) => [migration, synthetic]),
      'the reader must SEE the literal and call it a real reference').toEqual([['998_no_such_migration.sql', false]]);
    expect(missingReferences(planted).length, 'an unmarked name for a file that does not exist is the original red').toBe(1);
    expect(missingReferences(planted)[0], 'and it names the offending file and migration')
      .toMatch('planted.test.js references supabase/migrations/998_no_such_migration.sql');
    expect(lyingMarkers(planted), 'an unmarked reference can never be a lying marker').toEqual([]);
  });

  it('marker self-test 2: a MARKED fake name clears both arms', () => {
    const planted = refsIn('    // synthetic-migration-name: a sort fixture, not a reference\n'
      + `    const fixture = '997_no_such_migration.sql';`, 'planted.test.js');
    expect(planted.map(({ migration, synthetic, line }) => [migration, synthetic, line]),
      'a marker on the line IMMEDIATELY ABOVE declares the literal synthetic').toEqual([['997_no_such_migration.sql', true, 2]]);
    expect(missingReferences(planted), 'a declared synthetic name is excluded from the existence check').toEqual([]);
    expect(lyingMarkers(planted), 'and a declared name that really is absent is an honest declaration').toEqual([]);
  });

  it('marker self-test 3: a MARKED REAL migration name fires the lie', () => {
    const realMigration = fs.readdirSync(MIG_DIR).filter((f) => /^\d{3}[A-Za-z0-9_-]*\.sql$/.test(f)).sort()[0];
    expect(realMigration, 'no real migration to aim the lying marker at — this arm would prove nothing').toBeTruthy();
    const planted = refsIn(`    const sneak = '${realMigration}'; // synthetic-migration-name: claims to be a fixture`,
      'planted.test.js');
    expect(planted.map(({ migration, synthetic }) => [migration, synthetic]),
      "a marker on the literal's OWN line declares it synthetic").toEqual([[realMigration, true]]);
    expect(missingReferences(planted), 'the existence arm stays silent: the declaration arm owns this case').toEqual([]);
    const lies = lyingMarkers(planted);
    expect(lies.length, 'a marker aimed at a REAL migration must red — this is what makes the marker safe').toBe(1);
    expect(lies[0], 'and it says so in its own words, naming the site and the migration it hides')
      .toMatch('THE MARKER LIES');
    expect(lies[0], 'with the planted line number, so the reviewer goes straight to it')
      .toMatch(`planted.test.js:1 declares '${realMigration}' synthetic`);
  });
});
