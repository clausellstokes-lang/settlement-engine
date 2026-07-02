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
 * ALSO covered here (stripe-deletion remediation): process_deletions must STOP
 * BILLING for each deleted account. The process_account_deletions RPC anonymises
 * the profile but never touches Stripe (and the nightly pg_cron run calls the RPC
 * directly), so the handler sweeps every soft-deleted profile still holding a
 * Stripe id: cancel the subscription, then clear the stored ids. Asserted at the
 * boundary with an injected fake Stripe:
 *   - a deleted user with a recorded subscription ⇒ stripe.subscriptions.cancel
 *     runs with the stored id and the profile's Stripe ids are cleared
 *   - a legacy customer-only row (pre-087, no recorded sub id) ⇒ resolved via
 *     subscriptions.list; open subs canceled, nothing open ⇒ just cleared
 *   - already-canceled / missing at Stripe ⇒ idempotent, deletion still succeeds
 *   - an unexpected Stripe outage ⇒ deletion still succeeds, ids RETAINED for retry
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

// ── process_deletions × Stripe (stripe-deletion remediation) ────────────────────

/** Billing row shape the sweep reads back for each processed user. */
type BillingRow = { id: string; stripe_subscription_id: string | null; stripe_customer_id: string | null };

/** Admin stub for the process_deletions path: the role gate reads an ADMIN
 *  profile, the processor RPC reports one processed request (req1 → user u1),
 *  and the soft-deleted billing sweep (.not/.or/.limit chain) reads `billing`.
 *  Every profiles UPDATE is recorded so a test can assert whether the Stripe
 *  linkage was cleared or retained. */
function makeDeletionAdmin(billing: BillingRow[]) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const updates: Array<{ values: Record<string, unknown>; id: string }> = [];
  let bans = 0;
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (_table: string) => ({
      select: (_cols: string) => ({
        // role gate: profiles.role for the caller.
        eq: () => ({ single: () => Promise.resolve({ data: { role: 'admin', email: 'a@x.com' }, error: null }) }),
        // processed request ids → user ids (awaited .in on deletion_requests).
        in: (_col: string, _ids: string[]) => Promise.resolve({ data: [{ user_id: 'u1' }], error: null }),
        // the billing sweep: soft-deleted profiles still holding a Stripe id.
        not: () => ({ or: () => ({ limit: () => Promise.resolve({ data: billing, error: null }) }) }),
      }),
      update: (values: Record<string, unknown>) => ({
        eq: (_col: string, id: string) => { updates.push({ values, id }); return Promise.resolve({ error: null }); },
      }),
    }),
    auth: { admin: { updateUserById: () => { bans += 1; return Promise.resolve({ error: null }); } } },
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      return Promise.resolve({ data: { ids: ['req1'] }, error: null });
    },
  };
  return { rpc, updates, bans: () => bans, adminClient: () => client };
}

/** Recording fake Stripe. `behavior` drives subscriptions.cancel/list:
 *  ok = resolves; missing = cancel rejects resource_missing (already gone at
 *  Stripe); outage = cancel AND list reject with an unrelated transport error.
 *  `listedSubs` is what subscriptions.list reports open for any customer. */
function makeStripe(behavior: 'ok' | 'missing' | 'outage' = 'ok', listedSubs: string[] = []) {
  const canceled: string[] = [];
  const listedFor: string[] = [];
  const client = {
    subscriptions: {
      cancel: (id: string) => {
        canceled.push(id);
        if (behavior === 'missing') {
          return Promise.reject(Object.assign(new Error(`No such subscription: '${id}'`), { code: 'resource_missing' }));
        }
        if (behavior === 'outage') return Promise.reject(new Error('An error occurred with our connection to Stripe.'));
        return Promise.resolve({ id, status: 'canceled' });
      },
      list: ({ customer }: { customer: string }) => {
        listedFor.push(customer);
        if (behavior === 'outage') return Promise.reject(new Error('An error occurred with our connection to Stripe.'));
        return Promise.resolve({ data: listedSubs.map((id) => ({ id })) });
      },
    },
  };
  return { canceled, listedFor, stripeClient: () => client };
}

/** Did any profiles update clear the Stripe linkage for `id`? */
function linkageCleared(updates: Array<{ values: Record<string, unknown>; id: string }>, id: string): boolean {
  return updates.some((u) =>
    u.id === id && u.values.stripe_subscription_id === null && u.values.stripe_customer_id === null
  );
}

const processReq = () =>
  req({ action: 'process_deletions' }, { Authorization: 'Bearer jwt' });

Deno.test('process_deletions CANCELS a processed user\'s live subscription and clears the stored Stripe ids', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: 'sub_live_1', stripe_customer_id: 'cus_1' }]);
  const stripe = makeStripe('ok');
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: stripe.stripeClient,
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.subscriptionsCanceled, 1);
  assertEquals(stripe.canceled, ['sub_live_1']);          // canceled the STORED id
  assertEquals(linkageCleared(admin.updates, 'u1'), true); // shell keeps no billing identifier
});

Deno.test('a customer-only row (no recorded sub id) is resolved via list — nothing open ⇒ no cancel, ids cleared', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: null, stripe_customer_id: 'cus_1' }]);
  const stripe = makeStripe('ok', []);   // nothing open at Stripe
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: stripe.stripeClient,
  });
  assertEquals(res.status, 200);
  assertEquals((await res.json()).subscriptionsCanceled, 0);
  assertEquals(stripe.listedFor, ['cus_1']);   // the customer WAS checked
  assertEquals(stripe.canceled.length, 0);
  assertEquals(linkageCleared(admin.updates, 'u1'), true);
});

Deno.test('a legacy customer-only row WITH an open subscription at Stripe is listed, canceled and cleared', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: null, stripe_customer_id: 'cus_legacy' }]);
  const stripe = makeStripe('ok', ['sub_legacy_1']);   // pre-087: sub id never recorded
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: stripe.stripeClient,
  });
  assertEquals(res.status, 200);
  assertEquals((await res.json()).subscriptionsCanceled, 1);
  assertEquals(stripe.canceled, ['sub_legacy_1']);
  assertEquals(linkageCleared(admin.updates, 'u1'), true);
});

Deno.test('a subscription already gone at Stripe (resource_missing) does not abort the deletion — idempotent, ids cleared', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: 'sub_gone', stripe_customer_id: 'cus_1' }]);
  const stripe = makeStripe('missing');
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: stripe.stripeClient,
  });
  assertEquals(res.status, 200);                           // deletion never aborts
  assertEquals((await res.json()).subscriptionsCanceled, 0);
  assertEquals(linkageCleared(admin.updates, 'u1'), true); // nothing left to stop ⇒ still cleared
});

Deno.test('an unexpected Stripe outage never aborts the deletion — ids RETAINED so a re-run can retry', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: 'sub_live_1', stripe_customer_id: 'cus_1' }]);
  const stripe = makeStripe('outage');
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: stripe.stripeClient,
  });
  assertEquals(res.status, 200);                            // soft-fail, like the GoTrue ban
  assertEquals((await res.json()).subscriptionsCanceled, 0);
  assertEquals(linkageCleared(admin.updates, 'u1'), false); // kept for the retry sweep
  assertEquals(admin.bans() > 0, true);                     // the ban still ran (deletion stands)
});

Deno.test('no Stripe client configured (STRIPE_SECRET_KEY unset) — deletion still succeeds, ids retained', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: 'sub_live_1', stripe_customer_id: 'cus_1' }]);
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: () => null,
  });
  assertEquals(res.status, 200);
  assertEquals((await res.json()).subscriptionsCanceled, 0);
  assertEquals(linkageCleared(admin.updates, 'u1'), false);
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
