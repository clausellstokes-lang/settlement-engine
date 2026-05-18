/**
 * tests/security/profile_escalation.test.js — Profile escalation prevention.
 *
 * Two layers of testing live here:
 *
 *   1. CLIENT-SIDE — pure assertions about how src/lib/auth.js calls
 *      supabase. We stub the supabase client and verify the RPC path is
 *      tried first, the table-update fallback runs only on RPC failure,
 *      and the user_metadata mirror always fires. This catches client
 *      regressions where we accidentally route around the RPC.
 *
 *   2. SERVER-SIDE (commented-only) — pgTAP-style SQL assertions that
 *      verify migration 009's policy actually blocks role/tier/credits/
 *      is_founder updates. These can't run from Vitest (they need a real
 *      Postgres + supabase CLI). They're written here as a runnable
 *      checklist that should be executed via:
 *
 *        supabase test db
 *
 *      ...after migration 009 is applied to the dev environment.
 *
 * Why this file exists at all (vs. just trusting the migration):
 *   The migration's WITH CHECK clause is a single line of SQL. Easy to
 *   reorder, easy to typo into something looser without anyone noticing.
 *   The client tests pin the surface so a regression in how we call the
 *   safe paths shows up immediately. The SQL block is the receipt for
 *   actually verifying the server end.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Server-side verification checklist (run manually) ──────────────────────
//
// These are written as pgTAP-style assertions. Save to a file like
// supabase/tests/profile_security.sql and run with `supabase test db`.
// They assume the test session is authenticated as a regular user
// (auth.uid() returns a real, non-privileged uuid).
//
//   begin;
//   select plan(8);
//
//   -- 1. Direct role escalation is rejected.
//   prepare attempt_role as update profiles set role='developer' where id = auth.uid();
//   select throws_ok('execute attempt_role', null, null, 'role update blocked');
//
//   -- 2. Direct tier upgrade is rejected.
//   prepare attempt_tier as update profiles set tier='premium' where id = auth.uid();
//   select throws_ok('execute attempt_tier', null, null, 'tier update blocked');
//
//   -- 3. Direct credit grant is rejected.
//   prepare attempt_credits as update profiles set credits=99999 where id = auth.uid();
//   select throws_ok('execute attempt_credits', null, null, 'credit update blocked');
//
//   -- 4. Direct founder grant is rejected.
//   prepare attempt_founder as update profiles set is_founder=true where id = auth.uid();
//   select throws_ok('execute attempt_founder', null, null, 'is_founder update blocked');
//
//   -- 5. display_name update via RPC succeeds.
//   select isnt(public.update_display_name('Newname'), null, 'rpc accepts display name');
//
//   -- 6. spend_credits returns ok=false when balance is zero.
//   update profiles set credits = 0 where id = auth.uid(); -- via service role
//   select is(public.spend_credits('narrative')->>'ok', 'false', 'insufficient funds returns ok=false');
//
//   -- 7. spend_credits decrements atomically when balance is sufficient.
//   update profiles set credits = 10 where id = auth.uid(); -- via service role
//   select is(public.spend_credits('narrative')->>'balance', '7', 'cost=3 decrement');
//
//   -- 8. admin_set_role rejected from non-privileged caller.
//   select throws_ok($$select public.admin_set_role(auth.uid(), 'admin')$$,
//                    null, null, 'admin_set_role rejected for unprivileged user');
//
//   select * from finish();
//   rollback;
// ────────────────────────────────────────────────────────────────────────

// ── Client-side path tests ────────────────────────────────────────────────

let auth;
let stubs;

beforeEach(async () => {
  stubs = {
    rpcImpl:        vi.fn(),
    fromUpdate:     vi.fn(),
    fromUpdateEq:   vi.fn(),
    userMetaUpdate: vi.fn(),
    getUser:        vi.fn().mockResolvedValue({ data: { user: { id: 'user-abc' } } }),
  };

  // Stub the supabase module shape that lib/auth.js consumes.
  vi.doMock('../../src/lib/supabase.js', () => ({
    isConfigured: true,
    supabase: {
      rpc: (...args) => stubs.rpcImpl(...args),
      from: () => ({
        update: (...args) => { stubs.fromUpdate(...args); return { eq: (...e) => stubs.fromUpdateEq(...e) }; },
      }),
      auth: {
        updateUser: (...args) => stubs.userMetaUpdate(...args),
        getUser: () => stubs.getUser(),
      },
    },
  }));

  ({ auth } = await import('../../src/lib/auth.js'));
});

describe('updateDisplayName client path', () => {
  it('routes through the RPC when migration 009 is applied', async () => {
    stubs.rpcImpl.mockResolvedValue({ error: null });
    stubs.userMetaUpdate.mockResolvedValue({ error: null });

    await auth.updateDisplayName('Ada');

    expect(stubs.rpcImpl).toHaveBeenCalledWith('update_display_name', { new_name: 'Ada' });
    // RPC succeeded → no fallback table update.
    expect(stubs.fromUpdate).not.toHaveBeenCalled();
    // user_metadata mirror always runs.
    expect(stubs.userMetaUpdate).toHaveBeenCalledWith({ data: { display_name: 'Ada' } });
  });

  it('falls back to direct table UPDATE when the RPC errors', async () => {
    stubs.rpcImpl.mockResolvedValue({ error: { message: 'function not found' } });
    stubs.fromUpdateEq.mockResolvedValue({ error: null });
    stubs.userMetaUpdate.mockResolvedValue({ error: null });

    await auth.updateDisplayName('Ada');

    expect(stubs.rpcImpl).toHaveBeenCalled();
    expect(stubs.fromUpdate).toHaveBeenCalledWith({ display_name: 'Ada' });
    // The fallback row update is scoped to the current user's id.
    expect(stubs.fromUpdateEq).toHaveBeenCalledWith('id', 'user-abc');
    expect(stubs.userMetaUpdate).toHaveBeenCalled();
  });

  it('still mirrors to user_metadata even when the table fallback fires', async () => {
    stubs.rpcImpl.mockResolvedValue({ error: { message: 'function not found' } });
    stubs.fromUpdateEq.mockResolvedValue({ error: null });
    stubs.userMetaUpdate.mockResolvedValue({ error: null });

    await auth.updateDisplayName('Ada');
    expect(stubs.userMetaUpdate).toHaveBeenCalledWith({ data: { display_name: 'Ada' } });
  });

  it('throws when both the RPC and the fallback fail', async () => {
    stubs.rpcImpl.mockResolvedValue({ error: { message: 'function not found' } });
    stubs.fromUpdateEq.mockResolvedValue({ error: { message: 'policy violation' } });

    await expect(auth.updateDisplayName('Ada')).rejects.toBeTruthy();
  });
});
