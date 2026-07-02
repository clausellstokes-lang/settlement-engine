/**
 * index.test.ts — EXECUTION test of the admin-actions privilege gate (A+ tests-tooling).
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * admin-actions is a privileged endpoint: it mutates other users' credits, roles,
 * and account state through SECURITY DEFINER RPCs. Previously its authorization was
 * asserted only by regex over the handler source — a refactor that, say, ran the
 * action switch before the role gate, or routed update_user_credits to the wrong
 * RPC, would have kept those green. This RUNS the real handler with injected
 * supabase stubs and asserts the boundary:
 *   - a NON-privileged caller (role='user', no owner) is rejected 403 and NO RPC runs
 *   - an UNAUTHENTICATED caller is rejected 401 and NO RPC runs
 *   - a valid admin `update_user_credits` routes to the service_set_credits RPC with
 *     the SERVER-VERIFIED actor id (callingUser.id), never a body-supplied one
 *
 * `handleAdminActions` is the exported handler; we inject recording stubs via its
 * `deps` seam (production passes nothing).
 *
 * NOTE: authored without a local Deno runtime — verified in CI. The env vars below
 * must be set before importing index.ts (the module reads them at load).
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
// No OWNER_EMAIL — owner override disabled, so the gate falls back to profiles.role.
Deno.env.delete('OWNER_EMAIL');

const { handleAdminActions } = await import('./index.ts');

/** user-client stub: getUser() resolves the verified JWT identity (or an error). */
function makeUserClient(
  user: { id: string; email?: string | null } | null,
  authError = false,
) {
  // deno-lint-ignore no-explicit-any
  return (_authHeader: string): any => ({
    auth: {
      getUser: () => Promise.resolve({
        data: { user: authError ? null : user },
        error: authError ? { message: 'bad jwt' } : null,
      }),
    },
    // userClient.rpc is used by a couple of read actions; record-only for safety.
    rpc: () => Promise.resolve({ data: [], error: null }),
  });
}

/** Admin (service-role) stub: the profiles read returns `callerRole`; every RPC is
 *  recorded so a test can assert what (if anything) was dispatched. */
function makeAdminClient(callerRole: string, callerEmail = 'caller@x.com') {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (_t: string) => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({
            data: { role: callerRole, email: callerEmail }, error: null,
          }),
        }),
      }),
    }),
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      // service_set_credits returns a small result object the handler spreads.
      return Promise.resolve({ data: { prev: 5 }, error: null });
    },
  };
  return { rpc, adminClient: () => client };
}

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://edge/admin-actions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

Deno.test('a non-privileged caller (role=user) is rejected 403 and NO RPC runs', async () => {
  const stub = makeAdminClient('user');
  const res = await handleAdminActions(
    req({ action: 'update_user_credits', userId: 'victim', credits: 100000 },
      { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'attacker', email: 'attacker@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 403);
  // The role gate ran BEFORE the action switch — only the caller-profile read
  // happened, no mutating RPC (e.g. service_set_credits) was dispatched.
  assertEquals(stub.rpc.length, 0);
});

Deno.test('an unauthenticated caller (bad token) is rejected 401 and NO RPC runs', async () => {
  const stub = makeAdminClient('admin');
  const res = await handleAdminActions(
    req({ action: 'update_user_credits', userId: 'v', credits: 5 }, { Authorization: 'Bearer bad' }),
    { userClient: makeUserClient(null, true), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 401);
  assertEquals(stub.rpc.length, 0);
});

Deno.test('a request with NO authorization header is rejected 401 before any client work', async () => {
  const stub = makeAdminClient('admin');
  const res = await handleAdminActions(
    req({ action: 'get_stats' }),  // no Authorization header
    { userClient: makeUserClient({ id: 'admin1' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 401);
  assertEquals(stub.rpc.length, 0);
});

Deno.test('a valid admin update_user_credits routes to service_set_credits with the verified actor', async () => {
  const stub = makeAdminClient('admin');
  const res = await handleAdminActions(
    // The body smuggles actor_user='someone_else'; the handler must forward the
    // server-verified callingUser.id (admin1), never the body value.
    req({ action: 'update_user_credits', userId: 'target1', credits: 42, actor_user: 'someone_else' },
      { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 200);
  const setCredits = stub.rpc.find((c) => c.fn === 'service_set_credits');
  assertEquals(setCredits !== undefined, true);
  const args = setCredits!.args as { actor_user: string; target_user: string; new_credits: number };
  assertEquals(args.actor_user, 'admin1');      // verified JWT, not the body's someone_else
  assertEquals(args.target_user, 'target1');
  assertEquals(args.new_credits, 42);
});

Deno.test('grant_credits routes the RAW DELTA to the atomic service_adjust_credits RPC (no TS read-modify-write)', async () => {
  const stub = makeAdminClient('admin');
  const res = await handleAdminActions(
    req({ action: 'grant_credits', userId: 'target1', credits: -3, actor_user: 'someone_else' },
      { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 200);
  // The delta lands in the DB untouched — the balance math happens INSIDE the
  // locked RPC (103), never as an edge-side read → compute → absolute-set,
  // which raced concurrent user spends.
  const adjust = stub.rpc.find((c) => c.fn === 'service_adjust_credits');
  assertEquals(adjust !== undefined, true);
  const args = adjust!.args as { actor_user: string; target_user: string; delta: number };
  assertEquals(args.actor_user, 'admin1'); // verified JWT, not the body's someone_else
  assertEquals(args.target_user, 'target1');
  assertEquals(args.delta, -3);
  assertEquals(stub.rpc.find((c) => c.fn === 'service_set_credits'), undefined);
});

Deno.test('a SUPPORT-role caller CANNOT update_user_credits (highest-only edge gate, defense-in-depth)', async () => {
  // support passes the general elevated-role gate but is NOT "highest". The edge
  // gate must reject the real-money credit set BEFORE the service_set_credits RPC
  // — defense-in-depth parity with grant_credits / set_account_banned, not a
  // reliance on the DB RPC alone.
  const stub = makeAdminClient('support');
  const res = await handleAdminActions(
    req({ action: 'update_user_credits', userId: 'target1', credits: 9999 },
      { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'support1', email: 'support@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(stub.rpc.length, 0); // no service_set_credits dispatched
});

Deno.test('a SUPPORT-role caller CANNOT update_user_metadata (highest-only edge gate, defense-in-depth)', async () => {
  // support passes the general elevated-role gate but is NOT "highest". The edge
  // gate must reject the role/tier/is_founder write path BEFORE the
  // service_update_profile_metadata RPC — defense-in-depth parity with
  // grant_credits / update_user_credits, not a reliance on the DB RPC alone.
  const stub = makeAdminClient('support');
  const res = await handleAdminActions(
    req({ action: 'update_user_metadata', userId: 'target1', metadata: { role: 'admin' } },
      { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'support1', email: 'support@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(stub.rpc.length, 0); // no service_update_profile_metadata dispatched
});

Deno.test('an unknown action from a privileged caller is rejected 400 with no mutating RPC', async () => {
  const stub = makeAdminClient('developer');
  const res = await handleAdminActions(
    req({ action: 'definitely_not_a_real_action' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'dev1' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 400);
  // The role gate passed (developer), but the switch fell through to the default —
  // no RPC was dispatched for an unrecognized action.
  assertEquals(stub.rpc.length, 0);
});
