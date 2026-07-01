/**
 * check-migration-head.mjs — guard the "deployed schema == repo migration head"
 * invariant (review M5).
 *
 * WHY
 *   Several hardening migrations are documented as inert-until-`supabase db push`
 *   (089's anon-leak snapshot sanitizer, 087's refund unique-index, 084/092/093…).
 *   If one is never pushed, its defense is silently absent in production and NOTHING
 *   flags the drift. There was no in-repo check that the live schema head matches
 *   the repo head.
 *
 * WHAT (two modes, both dependency-free — no pg driver bundled):
 *   1. Always: validate the migration files are CONTIGUOUSLY numbered from the
 *      lowest present (a gap means a migration file was deleted/renamed/lost) and
 *      print the repo head. Wired into the gate so a gap fails `npm run check`.
 *   2. Optional deploy probe: if SUPABASE_MIGRATION_HEAD is set (the operator's
 *      deploy step obtains it from the live DB — e.g. `supabase migration list`
 *      or `psql -c "select max(version) from supabase_migrations.schema_migrations"`
 *      — and exports it), compare it to the repo head and EXIT NON-ZERO on drift.
 *      This is the piece a deploy pipeline runs after `db push` to prove the live
 *      schema actually caught up to the repo. See docs/DEPLOY.md.
 *
 * Exit 0 = contiguous (and, when probed, in sync). Exit 1 = gap or drift.
 */

import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const MIGRATIONS_DIR = join(dirname(fileURLToPath(import.meta.url)), '../supabase/migrations');

/** Numeric prefixes of the migration files, ascending. */
export function migrationNumbers(dir = MIGRATIONS_DIR) {
  return readdirSync(dir)
    .filter((f) => /^\d+.*\.sql$/.test(f))
    .map((f) => Number.parseInt(f.match(/^(\d+)/)[1], 10))
    .sort((a, b) => a - b);
}

/** Gaps in an ascending numeric sequence (each missing integer between min..max). */
export function contiguityGaps(nums) {
  const gaps = [];
  for (let i = 1; i < nums.length; i++) {
    for (let n = nums[i - 1] + 1; n < nums[i]; n++) gaps.push(n);
  }
  return gaps;
}

function main() {
  const nums = migrationNumbers();
  if (nums.length === 0) {
    console.error('[check-migration-head] no migration files found');
    process.exit(1);
  }
  const head = nums[nums.length - 1];
  const gaps = contiguityGaps(nums);
  if (gaps.length) {
    console.error(
      `[check-migration-head] migration numbering has gaps: ${gaps.join(', ')}. ` +
      `A missing migration file corrupts the ordered-apply contract.`,
    );
    process.exit(1);
  }
  console.log(`[check-migration-head] repo migration head = ${String(head).padStart(3, '0')} (${nums.length} files, contiguous)`);

  const deployedRaw = process.env.SUPABASE_MIGRATION_HEAD;
  if (deployedRaw != null && deployedRaw !== '') {
    const deployed = Number.parseInt(String(deployedRaw).match(/(\d+)/)?.[1] ?? 'NaN', 10);
    if (!Number.isFinite(deployed)) {
      console.error(`[check-migration-head] SUPABASE_MIGRATION_HEAD="${deployedRaw}" is not a number`);
      process.exit(1);
    }
    if (deployed !== head) {
      console.error(
        `[check-migration-head] DEPLOY DRIFT: live schema head=${deployed} but repo head=${head}. ` +
        `${deployed < head ? 'Run `supabase db push` — unpushed migrations mean their defenses are absent in production.' : 'The live DB is AHEAD of the repo — a migration was applied out of band.'}`,
      );
      process.exit(1);
    }
    console.log(`[check-migration-head] deploy probe OK: live head ${deployed} == repo head ${head}`);
  }
}

// Run only when invoked as a script (importable helpers above stay side-effect-free).
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
