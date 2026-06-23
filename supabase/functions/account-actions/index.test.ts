/**
 * index.test.ts — EXECUTION test of the account-actions account_is_active gate
 * (A+ tests-tooling defense-in-depth #1).
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * account-actions lets a user file support content (create_ticket / reply_ticket).
 * A banned / disabled / soft-deleted account must NOT be able to write new content —
 * the handler gates the ticket-WRITE actions on the account_is_active RPC and fails
 * CLOSED (isActive !== true ⇒ 403). Previously this was asserted only by regex over
 * the handler source — a refactor that moved the gate after the write RPC, or that
 * failed OPEN on a null/error result, would have kept those green. This RUNS the
 * real handler with injected supabase stubs and asserts the boundary:
 *   - a BANNED actor (account_is_active=false) is rejected 403 on create_ticket /
 *     reply_ticket and NO write RPC runs
 *   - a null/error account_is_active result FAILS CLOSED (403) — never fails open
 *   - an ACTIVE actor is allowed through and the write RPC runs with the verified id
 *   - a read-only action (list_my_tickets) is NOT gated (reachable while inactive)
 *
 * `handleAccountActions` is the exported handler; we inject recording stubs via its
 * `deps` seam (production passes nothing).
 *
 * NOTE: authored without a local Deno runtime — verified in CI.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
// Resend unconfigured so the create email soft-fails (never blocks the action).
Deno.env.delete('RESEND_API_KEY');
Deno.env.delete('RESEND_FROM_EMAIL');

const { handleAccountActions } = await import('./index.ts');

/** user-client stub: getUser() resolves the verified JWT identity. Also records
 *  any user-scoped RPC (list_my_tickets / list_ticket_thread run through it). */
function makeUserClient(user: { id: string; email?: string | null } | null, authError = false) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    auth: {
      getUser: () => Promise.resolve({
        data: { user: authError ? null : user },
        error: authError ? { message: 'bad jwt' } : null,
      }),
    },
    rpc: (fn: string, args: unknown) => { rpc.push({ fn, args }); return Promise.resolve({ data: [], error: null }); },
  };
  return { rpc, userClient: () => client };
}

/** Admin (service-role) stub. `activeResult` drives the account_is_active gate
 *  (true / false / null). Every RPC is recorded so a test can assert that NO
 *  write RPC (create_ticket / post_ticket_reply) ran when the gate rejects. */
function makeAdminClient(activeResult: boolean | null) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (_t: string) => ({
      select: () => ({
        eq: () => ({
          in: () => ({ order: () => ({ limit: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }) }),
          single: () => Promise.resolve({ data: { role: 'user', email: 'x@x.com' }, error: null }),
        }),
      }),
      insert: () => Promise.resolve({ error: null }),
    }),
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'account_is_active') {
        return Promise.resolve({
          data: activeResult,
          error: activeResult === null ? { message: 'rpc blew up' } : null,
        });
      }
      // create_ticket returns a ticket row the handler reads.
      return Promise.resolve({ data: { ticket_number: 'T-1' }, error: null });
    },
  };
  return { rpc, adminClient: () => client };
}

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://edge/account-actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

/** RPCs that constitute an actual ticket WRITE (must never run for a banned actor). */
function writeRpcRan(rpc: Array<{ fn: string }>): boolean {
  return rpc.some((c) => c.fn === 'create_ticket' || c.fn === 'post_ticket_reply');
}

Deno.test('a BANNED actor is rejected 403 on create_ticket and NO write RPC runs', async () => {
  const user = makeUserClient({ id: 'banned1', email: 'b@x.com' });
  const admin = makeAdminClient(false);   // account_is_active=false
  const res = await handleAccountActions(
    req({ action: 'create_ticket', subject: 'help', message: 'please' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals((await res.json()).error, 'Account is not active');
  assertEquals(writeRpcRan(admin.rpc), false);   // gate ran before the write
});

Deno.test('a BANNED actor is rejected 403 on reply_ticket and NO write RPC runs', async () => {
  const user = makeUserClient({ id: 'banned2', email: 'b@x.com' });
  const admin = makeAdminClient(false);
  const res = await handleAccountActions(
    req({ action: 'reply_ticket', ticketId: 't1', body: 'reply' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(writeRpcRan(admin.rpc), false);
});

Deno.test('a null account_is_active result FAILS CLOSED (403) — never fails open', async () => {
  const user = makeUserClient({ id: 'unknown1', email: 'u@x.com' });
  const admin = makeAdminClient(null);   // RPC error / unexpected shape ⇒ null
  const res = await handleAccountActions(
    req({ action: 'create_ticket', subject: 'help', message: 'please' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(writeRpcRan(admin.rpc), false);
});

Deno.test('an ACTIVE actor is allowed through and create_ticket runs with the verified id', async () => {
  const user = makeUserClient({ id: 'active1', email: 'a@x.com' });
  const admin = makeAdminClient(true);   // account_is_active=true
  const res = await handleAccountActions(
    // The body smuggles p_actor='someone_else'; the handler must forward the
    // server-verified callingUser.id (active1), never the body value.
    req({ action: 'create_ticket', subject: 'help', message: 'please', p_actor: 'someone_else' },
      { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  const create = admin.rpc.find((c) => c.fn === 'create_ticket');
  assertEquals(create !== undefined, true);
  assertEquals((create!.args as { p_actor: string }).p_actor, 'active1');   // verified, not the body
});

Deno.test('a read-only action (list_my_tickets) is NOT gated — reachable while inactive', async () => {
  const user = makeUserClient({ id: 'inactive_reader', email: 'r@x.com' });
  const admin = makeAdminClient(false);   // even though inactive…
  const res = await handleAccountActions(
    req({ action: 'list_my_tickets' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);   // a read is allowed for an inactive account
  // The active gate never ran for a read action; the read went via the user client.
  assertEquals(admin.rpc.some((c) => c.fn === 'account_is_active'), false);
  assertEquals(user.rpc.some((c) => c.fn === 'list_my_tickets'), true);
});
