/**
 * tests/security/profile_escalation.test.js — Profile escalation prevention.
 *
 * Two layers of testing live here:
 *
 *   1. CLIENT-SIDE — pure assertions about how src/lib/auth.js calls
 *      supabase. We stub the supabase client and verify display_name goes
 *      through the RPC only: an RPC error (a civility refusal included) is
 *      thrown to the caller and NO direct table write happens, and the
 *      user_metadata mirror runs only after an RPC success (GRANTS-1 part C).
 *      This catches client regressions where we route around the RPC.
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

// ── Server-side verification — NOW EXECUTED (no longer a manual checklist) ──
// Migration 009's column-lock UPDATE policy (role/tier/credits/is_founder pinned)
// is executed by tests/security/profileEscalation.pglite.test.js: it loads the
// REAL policy DDL into in-process Postgres and runs every escalation attempt
// under a forced-RLS non-superuser role, asserting each is rejected and that
// display_name updates still succeed — in the standard `npm run test` (no
// Docker). supabase/tests/profile_security.sql remains the pg_prove/Docker
// superset (it also covers the spend_credits/admin_set_role RPCs).

// ── Client-side path tests ────────────────────────────────────────────────

let auth;
let stubs;

beforeEach(async () => {
  vi.resetModules();
  vi.clearAllMocks();

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
    // RPC succeeded → no direct table write.
    expect(stubs.fromUpdate).not.toHaveBeenCalled();
    // user_metadata mirror runs after the RPC success.
    expect(stubs.userMetaUpdate).toHaveBeenCalledWith({ data: { display_name: 'Ada' } });
  });

  it('an RPC refusal is shown and NO table write happens', async () => {
    const refusal = { message: 'display name refused by the civility guard' };
    stubs.rpcImpl.mockResolvedValue({ error: refusal });
    stubs.fromUpdateEq.mockResolvedValue({ error: null });
    stubs.userMetaUpdate.mockResolvedValue({ error: null });

    await expect(auth.updateDisplayName('Ada')).rejects.toBe(refusal);

    expect(stubs.rpcImpl).toHaveBeenCalledWith('update_display_name', { new_name: 'Ada' });
    // Never routed round the civility guard: no direct profiles write.
    expect(stubs.fromUpdate).not.toHaveBeenCalled();
    expect(stubs.fromUpdateEq).not.toHaveBeenCalled();
    // The user_metadata mirror runs only after an RPC success.
    expect(stubs.userMetaUpdate).not.toHaveBeenCalled();
  });

  it('any RPC error (e.g. the function missing) is thrown, never routed round', async () => {
    const missing = { message: 'function not found' };
    stubs.rpcImpl.mockResolvedValue({ error: missing });
    stubs.fromUpdateEq.mockResolvedValue({ error: null });
    stubs.userMetaUpdate.mockResolvedValue({ error: null });

    await expect(auth.updateDisplayName('Ada')).rejects.toBe(missing);
    expect(stubs.fromUpdate).not.toHaveBeenCalled();
    expect(stubs.userMetaUpdate).not.toHaveBeenCalled();
  });
});
