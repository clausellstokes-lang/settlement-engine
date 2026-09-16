/**
 * tests/lint/migrationGrantPosturePin.test.js — structural guard for the
 * service-role-only EXECUTE grant posture on privilege/money-mutation RPCs
 * (finding backend-migrations-1, W-R2-TRUST).
 *
 * THE INVARIANT: a function's EXECUTE privilege defaults to PUBLIC at CREATE
 * time. The codebase's `public.service_*` functions are the SECURITY DEFINER
 * admin RPCs that mutate money and privilege (credit balances, and
 * role/tier/is_founder). Every one MUST carry an explicit
 * `revoke all on function public.<name>(...) from public` so anon/authenticated
 * cannot reach it over PostgREST — the internal `_assert_service_admin_actor`
 * gate must not be the ONLY thing between PUBLIC and a real-money/privilege RPC.
 *
 * This class regressed silently: migration 113 closed it for service_set_credits,
 * but its sibling service_update_profile_metadata was left with the inherited
 * PUBLIC grant (backend-migrations-1) because NO guard walked the class. This test
 * is that guard — it is why the gap can't reopen.
 *
 * THE WALK (static — no live DB): discover every `create or replace function
 * public.service_<name>(...)` across the migration corpus, then assert each name
 * has a matching `revoke all on function public.<name>(...) from public` somewhere
 * in the corpus. A NEW `service_*` RPC without a revoke FAILS with the 113/135 fix
 * pointer. A function intentionally granted more broadly is added to
 * READ_ONLY_EXEMPT with a written reason (empty today — every service_* RPC is a
 * mutation locked to service_role).
 *
 * CANNOT-CATCH (accepted gaps, covered by review): this walks the `service_`
 * naming convention only — a privilege RPC named differently (no `service_`
 * prefix) is invisible here; and it matches a revoke by NAME, not by exact
 * signature, so a revoke on a stale overload would satisfy it (no such overloads
 * exist today — all three RPCs have a single signature).
 *
 * @enforced-by this test
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const MIG_DIR = resolve(process.cwd(), 'supabase/migrations');

// `service_*` functions intentionally granted beyond service_role (none today).
// Add here with a reason ONLY for a read-only/authenticated-by-design RPC.
const READ_ONLY_EXEMPT = Object.freeze({
  // 'public.service_something': 'granted to authenticated by design because …',
});

function allMigrationSql() {
  return readdirSync(MIG_DIR)
    .filter((f) => /^\d+_.*\.sql$/.test(f))
    .sort()
    .map((f) => readFileSync(join(MIG_DIR, f), 'utf8'))
    .join('\n');
}

const sql = allMigrationSql();

// Every service_* function the migrations define (net of case).
// ⚠ ANCHORED AT LINE START (`^` + m) — the unanchored form can invent a phantom
// name from a comment that wraps the statement mid-identifier (the 098 shape;
// see tests/security/moneyRpcNetCurrentGuards.test.js).
const defined = [
  ...sql.matchAll(/^create\s+or\s+replace\s+function\s+public\.(service_[a-z0-9_]+)\s*\(/gim),
].map((m) => m[1].toLowerCase());
const definedSet = [...new Set(defined)].sort();

// Names that carry an explicit revoke-from-public.
const revoked = new Set(
  [...sql.matchAll(/revoke\s+all\s+on\s+function\s+public\.(service_[a-z0-9_]+)\s*\([^)]*\)\s*\n?\s*from\s+[^;]*\bpublic\b/gi)]
    .map((m) => m[1].toLowerCase()),
);

describe('grant-posture ratchet — every service_* privilege/money RPC is revoked from PUBLIC', () => {
  it('discovers the known service_* RPC family (guard-the-guard: the scan is not vacuous)', () => {
    // If this ever reads empty, the scan regex broke — a green "no offenders"
    // would then be meaningless.
    expect(definedSet).toEqual([
      'service_adjust_credits',
      'service_set_credits',
      'service_update_profile_metadata',
    ]);
  });

  it('every defined service_* function has an explicit revoke-from-public (or a documented exemption)', () => {
    const offenders = definedSet
      .filter((name) => !(`public.${name}` in READ_ONLY_EXEMPT))
      .filter((name) => !revoked.has(name))
      .map((name) =>
        `public.${name}: no "revoke all on function public.${name}(...) from public" in any migration. `
        + `Add a grant-only migration mirroring 113/135, or add it to READ_ONLY_EXEMPT with a reason.`,
      );
    expect(offenders).toEqual([]);
  });

  it('service_update_profile_metadata specifically is revoked (backend-migrations-1, migration 135)', () => {
    expect(revoked.has('service_update_profile_metadata')).toBe(true);
  });
});
