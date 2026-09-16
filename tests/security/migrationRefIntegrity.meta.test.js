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

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp, out);
    else if (/\.test\.js$/.test(e.name)) out.push(fp);
  }
  return out;
}

/** { file, migration } for every migration literal in tests/security. The walker
 *  skips ITSELF: its detector self-test below plants a deliberately-fake literal. */
function gatherRefs() {
  const refs = [];
  for (const abs of walk(SEC_DIR)) {
    if (abs.endsWith('migrationRefIntegrity.meta.test.js')) continue;
    const src = fs.readFileSync(abs, 'utf8');
    for (const m of src.matchAll(MIG_REF_RE)) {
      refs.push({ file: path.relative(REPO, abs).split(path.sep).join('/'), migration: m[1] });
    }
  }
  return refs;
}

describe('security-suite migration references resolve (runIf cannot silently vacate)', () => {
  const refs = gatherRefs();

  it('every referenced migration file exists under supabase/migrations/', () => {
    const missing = refs
      .filter(({ migration }) => !fs.existsSync(path.join(MIG_DIR, migration)))
      .map(({ file, migration }) =>
        `${file} references supabase/migrations/${migration} — which does not exist.\n` +
        `  If that suite is runIf-gated on this file, it is now SILENTLY SKIPPED and its\n` +
        `  security pin is unenforced. A renumber/rename must update the referencing test\n` +
        `  in the same change; deleting a migration outright needs its pins re-homed first.`,
      );
    expect(missing).toEqual([]);
  });

  it('the scan is non-vacuous (refs and runIf-gated suites are actually present)', () => {
    expect(refs.length, 'migration-literal extraction found implausibly few refs').toBeGreaterThanOrEqual(40);
    const runIfFiles = walk(SEC_DIR).filter((f) => /\brunIf\s*\(/.test(fs.readFileSync(f, 'utf8')));
    expect(runIfFiles.length, 'runIf census collapsed — did the gating idiom change?').toBeGreaterThanOrEqual(30);
  });

  it('detector self-test: the literal extractor catches every quote style', () => {
    const sample = `x('009_profile_security.sql'); y("087_review_money_hardening.sql"); z(\`123_money.sql\`)`;
    const got = [...sample.matchAll(MIG_REF_RE)].map((m) => m[1]);
    expect(got).toEqual(['009_profile_security.sql', '087_review_money_hardening.sql', '123_money.sql']);
  });
});
