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
 * BILLING for each deleted account. Migration 175's processor transactionally
 * enqueues a leased cleanup job and leaves the request processing. The manual
 * handler invokes the same shared queue worker as the secret-gated cron; only the
 * completion RPC clears linkage + marks done. Asserted at the boundary with an
 * injected queue/Stripe fake:
 *   - a deleted user with a recorded subscription ⇒ stripe.subscriptions.cancel
 *     runs with the stored id and the profile's Stripe ids are cleared
 *   - a legacy customer-only row (pre-087, no recorded sub id) ⇒ resolved via
 *     subscriptions.list; open subs canceled, nothing open ⇒ just cleared
 *   - already-canceled / missing at Stripe ⇒ idempotent, deletion still succeeds
 *   - pagination follows every subscriptions.list page before clearing linkage
 *   - auth/Stripe/lookup failures ⇒ non-success response, ids RETAINED for retry
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

/** Admin stub for the migration-175 durable process_deletions path: the role
 * gate reads ADMIN, the processor queues jobs, the shared worker leases those
 * jobs, checkpoints auth, and asks the completion RPC to transactionally clear
 * linkage + mark request/job done. */
function makeDeletionAdmin(
  billing: BillingRow[],
  opts: {
    callerLookupError?: boolean;
    processedLookupError?: boolean;
    billingLookupError?: boolean;
    banError?: boolean;
    clearError?: boolean;
  } = {},
) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const updates: Array<{ values: Record<string, unknown>; id: string }> = [];
  const billingCheckpoints = new Map<
    string,
    { subscriptionIds: string[]; customerIds: string[]; revision: number }
  >();
  let bans = 0;
  const softDeletes: Array<{ userId: string; shouldSoftDelete: boolean }> = [];
  let claimed = false;
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (_table: string) => ({
      select: (_cols: string) => ({
        // role gate: profiles.role for the caller.
        eq: () => ({
          single: () => Promise.resolve({
            data: opts.callerLookupError ? null : { role: 'admin', email: 'a@x.com' },
            error: opts.callerLookupError ? { message: 'caller lookup failed' } : null,
          }),
        }),
      }),
    }),
    auth: {
      admin: {
        updateUserById: () => {
          bans += 1;
          return Promise.resolve({ error: opts.banError ? { message: 'ban failed' } : null });
        },
        deleteUser: (userId: string, shouldSoftDelete: boolean) => {
          softDeletes.push({ userId, shouldSoftDelete });
          return Promise.resolve({ error: null });
        },
      },
    },
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'process_account_deletions') {
        return Promise.resolve(opts.processedLookupError
          ? { data: null, error: { message: 'processor failed' } }
          : { data: { queued: billing.length, ids: billing.map((_, i) => `req${i + 1}`) }, error: null });
      }
      if (fn === 'claim_account_deletion_cleanup_jobs') {
        if (opts.billingLookupError) {
          return Promise.resolve({ data: null, error: { message: 'queue claim failed' } });
        }
        if (claimed) return Promise.resolve({ data: [], error: null });
        claimed = true;
        return Promise.resolve({
          data: billing.map((row, i) => ({
            job_id: `job${i + 1}`,
            deletion_request_id: `req${i + 1}`,
            user_id: row.id,
            lease_token: `lease${i + 1}`,
            attempts: 1,
            auth_revoked_at: null,
            stripe_subscription_id: row.stripe_subscription_id,
            stripe_customer_id: row.stripe_customer_id,
            surveyor_subscription_id: null,
            surveyor_customer_id: null,
            late_stripe_subscription_ids: [],
            late_stripe_customer_ids: [],
            late_billing_revision: 0,
          })),
          error: null,
        });
      }
      if (fn === 'mark_account_deletion_auth_revoked') {
        return Promise.resolve({ data: true, error: null });
      }
      if (fn === 'checkpoint_account_deletion_billing_identity') {
        const checkpointArgs = args as Record<string, unknown>;
        const jobId = String(checkpointArgs.p_job_id);
        const checkpoint = billingCheckpoints.get(jobId) ?? {
          subscriptionIds: [],
          customerIds: [],
          revision: 0,
        };
        let grew = false;
        const subscriptionId = typeof checkpointArgs.p_subscription_id === 'string'
          ? checkpointArgs.p_subscription_id
          : null;
        const customerId = typeof checkpointArgs.p_customer_id === 'string'
          ? checkpointArgs.p_customer_id
          : null;
        if (subscriptionId && !checkpoint.subscriptionIds.includes(subscriptionId)) {
          checkpoint.subscriptionIds.push(subscriptionId);
          grew = true;
        }
        if (customerId && !checkpoint.customerIds.includes(customerId)) {
          checkpoint.customerIds.push(customerId);
          grew = true;
        }
        if (grew) checkpoint.revision += 1;
        billingCheckpoints.set(jobId, checkpoint);
        return Promise.resolve({
          data: {
            ok: true,
            late_stripe_subscription_ids: [...checkpoint.subscriptionIds],
            late_stripe_customer_ids: [...checkpoint.customerIds],
            late_billing_revision: checkpoint.revision,
          },
          error: null,
        });
      }
      if (fn === 'complete_account_deletion_cleanup_job') {
        if (opts.clearError) {
          return Promise.resolve({ data: null, error: { message: 'clear failed' } });
        }
        const jobIndex = Number(String((args as Record<string, unknown>).p_job_id).replace('job', '')) - 1;
        const row = billing[jobIndex];
        if (row) {
          updates.push({
            values: { stripe_subscription_id: null, stripe_customer_id: null },
            id: row.id,
          });
        }
        return Promise.resolve({ data: true, error: null });
      }
      if (fn === 'fail_account_deletion_cleanup_job') {
        return Promise.resolve({ data: true, error: null });
      }
      throw new Error(`unexpected RPC ${fn}`);
    },
  };
  return { rpc, updates, bans: () => bans, softDeletes, adminClient: () => client };
}

/** Recording fake Stripe. `behavior` drives subscriptions.cancel/list:
 *  ok = resolves; missing = cancel rejects resource_missing (already gone at
 *  Stripe); outage = cancel AND list reject with an unrelated transport error.
 *  `listedSubs` is what subscriptions.list reports open for any customer. */
function makeStripe(
  behavior: 'ok' | 'missing' | 'outage' | 'cancel_outage' = 'ok',
  listedSubs: string[] = [],
  retrievedCustomer = 'cus_1',
) {
  const canceled: string[] = [];
  const listedFor: string[] = [];
  const deletedCustomers: string[] = [];
  const client = {
    customers: {
      del: (id: string) => {
        deletedCustomers.push(id);
        if (behavior === 'outage') {
          return Promise.reject(new Error('An error occurred with our connection to Stripe.'));
        }
        return Promise.resolve({ id, deleted: true });
      },
    },
    subscriptions: {
      retrieve: (id: string) => {
        if (behavior === 'outage') {
          return Promise.reject(new Error('An error occurred with our connection to Stripe.'));
        }
        return Promise.resolve({ id, customer: retrievedCustomer });
      },
      cancel: (id: string) => {
        canceled.push(id);
        if (behavior === 'missing') {
          return Promise.reject(Object.assign(new Error(`No such subscription: '${id}'`), { code: 'resource_missing' }));
        }
        if (behavior === 'outage' || behavior === 'cancel_outage') {
          return Promise.reject(new Error('An error occurred with our connection to Stripe.'));
        }
        return Promise.resolve({ id, status: 'canceled', customer: retrievedCustomer });
      },
      list: ({ customer }: { customer: string }) => {
        listedFor.push(customer);
        if (behavior === 'outage') return Promise.reject(new Error('An error occurred with our connection to Stripe.'));
        return Promise.resolve({ data: listedSubs.map((id) => ({ id })) });
      },
    },
  };
  return { canceled, listedFor, deletedCustomers, stripeClient: () => client };
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
  assertEquals(admin.softDeletes, [{ userId: 'u1', shouldSoftDelete: true }]);
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

Deno.test('a DUAL-PLAN user (recorded sub + a SECOND open sub at Stripe) has BOTH canceled — the Surveyor sub is never orphaned', async () => {
  // Regression pin (SB3): a recorded id no longer short-circuits the customer
  // enumeration. sub_cartographer is in profiles.stripe_subscription_id; a
  // Surveyor sub id lives only in surveyor_entitlements but is open under the
  // SAME customer. Canceling only the recorded id left Surveyor billing forever
  // (clearLinkage nulls the customer id, so it could never be found again).
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: 'sub_cartographer', stripe_customer_id: 'cus_dual' }]);
  const stripe = makeStripe('ok', ['sub_cartographer', 'sub_surveyor'], 'cus_dual');   // Stripe lists BOTH open subs
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: stripe.stripeClient,
  });
  assertEquals(res.status, 200);
  assertEquals((await res.json()).subscriptionsCanceled, 2);                 // BOTH plans stopped
  assertEquals(stripe.canceled.sort(), ['sub_cartographer', 'sub_surveyor']); // deduped, both canceled
  assertEquals(stripe.listedFor, ['cus_dual']);                             // enumerated EVEN WITH a recorded id
  assertEquals(linkageCleared(admin.updates, 'u1'), true);
});

Deno.test('subscription enumeration follows EVERY Stripe page before canceling and clearing linkage', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: null, stripe_customer_id: 'cus_many' }]);
  const canceled: string[] = [];
  const listCalls: Array<Record<string, unknown>> = [];
  const stripeClient = () => ({
    customers: {
      del: (id: string) => Promise.resolve({ id, deleted: true }),
    },
    subscriptions: {
      retrieve: (id: string) => Promise.resolve({ id }),
      cancel: (id: string) => {
        canceled.push(id);
        return Promise.resolve({ id });
      },
      list: (params: Record<string, unknown>) => {
        listCalls.push(params);
        if (!params.starting_after) {
          return Promise.resolve({ data: [{ id: 'sub_page_1' }], has_more: true });
        }
        return Promise.resolve({ data: [{ id: 'sub_page_2' }], has_more: false });
      },
    },
  });
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient,
  });
  assertEquals(res.status, 200);
  assertEquals((await res.json()).subscriptionsCanceled, 2);
  assertEquals(listCalls.length, 2);
  assertEquals(listCalls[1].starting_after, 'sub_page_1');
  assertEquals(canceled, ['sub_page_1', 'sub_page_2']);
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

Deno.test('an unexpected Stripe outage reports cleanup incomplete and RETAINS ids for retry', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: 'sub_live_1', stripe_customer_id: 'cus_1' }]);
  const stripe = makeStripe('outage');
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: stripe.stripeClient,
  });
  assertEquals(res.status, 502);
  const body = await res.json();
  assertEquals(body.success, false);
  assertEquals(body.subscriptionsCanceled, 0);
  assertEquals(linkageCleared(admin.updates, 'u1'), false); // kept for the retry sweep
  assertEquals(admin.bans() > 0, true);                     // the ban still ran (deletion stands)
});

Deno.test('a cancellation failure reports cleanup incomplete and RETAINS customer linkage', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: 'sub_live_1', stripe_customer_id: 'cus_1' }]);
  const stripe = makeStripe('cancel_outage');
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: stripe.stripeClient,
  });
  assertEquals(res.status, 502);
  assertEquals((await res.json()).success, false);
  assertEquals(linkageCleared(admin.updates, 'u1'), false);
});

Deno.test('an auth revocation failure reports cleanup incomplete and RETAINS customer linkage', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin(
    [{ id: 'u1', stripe_subscription_id: 'sub_live_1', stripe_customer_id: 'cus_1' }],
    { banError: true },
  );
  const stripe = makeStripe('ok');
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: stripe.stripeClient,
  });
  assertEquals(res.status, 502);
  assertEquals((await res.json()).success, false);
  assertEquals(stripe.canceled, ['sub_live_1']);            // billing still stops
  assertEquals(linkageCleared(admin.updates, 'u1'), false); // retained as retry marker
});

Deno.test('a processed request/user lookup error is not discarded or reported as success', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([], { processedLookupError: true });
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: makeStripe().stripeClient,
  });
  assertEquals(res.status, 500);
  assertEquals((await res.json()).success, false);
});

Deno.test('a deleted billing lookup error is not discarded or reported as success', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([], { billingLookupError: true });
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: makeStripe().stripeClient,
  });
  assertEquals(res.status, 500);
  assertEquals((await res.json()).success, false);
});

Deno.test('no Stripe client configured (STRIPE_SECRET_KEY unset) — cleanup is incomplete and ids retained', async () => {
  const user = makeUserClient({ id: 'admin1', email: 'a@x.com' });
  const admin = makeDeletionAdmin([{ id: 'u1', stripe_subscription_id: 'sub_live_1', stripe_customer_id: 'cus_1' }]);
  const res = await handleAccountActions(processReq(), {
    userClient: user.userClient, adminClient: admin.adminClient, stripeClient: () => null,
  });
  assertEquals(res.status, 502);
  const body = await res.json();
  assertEquals(body.success, false);
  assertEquals(body.subscriptionsCanceled, 0);
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

// ── Dossier retro-claim, same-device token path (migration 108) ───────────────
// claim_dossier_purchase is the SOLE retro-claim path: same-device + same-
// settlement + automatic. The original device still holds the checkout token in
// its purchase stash; after the buyer signs up and saves that settlement, the
// client makes a silent post-save call with { sessionId, checkoutToken, saveId }.
// The handler verifies, server-side, that a purchase row exists + is 'unclaimed' +
// sha256(checkoutToken) matches the stored hash (constant-time), then calls the
// service-role claim RPC. There is NO email-match path. No Stripe call.

/** sha256 hex mirror so a test can seed the stored checkout_token_hash. */
async function sha256hexTest(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Admin stub for the claim path. `purchase` is the single_dossier_purchases row
 *  the lookup returns (null = unknown session). `claimResult` drives the claim RPC.
 *  `rateOk` drives the ingest_check_rate limiter (default under-limit). */
function makeClaimAdminClient(cfg: {
  purchase?: { checkout_token_hash: string; status: string } | null;
  claimResult?: Record<string, unknown>;
  rateOk?: boolean;
}) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          maybeSingle: () => table === 'single_dossier_purchases'
            ? Promise.resolve({ data: cfg.purchase ?? null, error: null })
            : Promise.resolve({ data: null, error: null }),
        }),
      }),
    }),
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'ingest_check_rate') {
        return Promise.resolve({ data: cfg.rateOk === false ? false : true, error: null });
      }
      if (fn === 'claim_dossier_purchase_by_session') {
        return Promise.resolve({ data: cfg.claimResult ?? { ok: true, entitlement_id: 'ent_1' }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { rpc, adminClient: () => client };
}

const TOKEN = 'tok_' + 'q'.repeat(40);   // 24..128 chars

Deno.test('claim_dossier_purchase happy path: verifies the token then claims (no Stripe call)', async () => {
  const user = makeUserClient({ id: 'claimer', email: 'c@x.com' });
  const admin = makeClaimAdminClient({
    purchase: { checkout_token_hash: await sha256hexTest(TOKEN), status: 'unclaimed' },
  });
  const res = await handleAccountActions(
    req({ action: 'claim_dossier_purchase', sessionId: 'cs_1', checkoutToken: TOKEN, saveId: 'save_1' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals((await res.json()).entitlementId, 'ent_1');
  const claim = admin.rpc.find((c) => c.fn === 'claim_dossier_purchase_by_session');
  assertEquals(claim !== undefined, true);
  assertEquals((claim!.args as Record<string, unknown>).p_session_id, 'cs_1');
  assertEquals((claim!.args as Record<string, unknown>).p_user, 'claimer');   // the verified JWT id
  assertEquals((claim!.args as Record<string, unknown>).p_save_id, 'save_1');
});

Deno.test('claim_dossier_purchase rejects a WRONG token (403) and never calls the claim RPC', async () => {
  const user = makeUserClient({ id: 'claimer', email: 'c@x.com' });
  const admin = makeClaimAdminClient({
    // The stored hash is for the REAL token; the caller presents a different one.
    purchase: { checkout_token_hash: await sha256hexTest(TOKEN), status: 'unclaimed' },
  });
  const wrongToken = 'tok_' + 'p'.repeat(40);
  const res = await handleAccountActions(
    req({ action: 'claim_dossier_purchase', sessionId: 'cs_1', checkoutToken: wrongToken, saveId: 'save_1' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(admin.rpc.some((c) => c.fn === 'claim_dossier_purchase_by_session'), false);  // no claim on a bad token
});

Deno.test('claim_dossier_purchase rejects an UNKNOWN session (403), no claim RPC', async () => {
  const user = makeUserClient({ id: 'claimer', email: 'c@x.com' });
  const admin = makeClaimAdminClient({ purchase: null });   // no such purchase row
  const res = await handleAccountActions(
    req({ action: 'claim_dossier_purchase', sessionId: 'cs_ghost', checkoutToken: TOKEN, saveId: 'save_1' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(admin.rpc.some((c) => c.fn === 'claim_dossier_purchase_by_session'), false);
});

Deno.test('claim_dossier_purchase rejects an ALREADY-CLAIMED purchase (403), no claim RPC', async () => {
  const user = makeUserClient({ id: 'claimer', email: 'c@x.com' });
  const admin = makeClaimAdminClient({
    purchase: { checkout_token_hash: await sha256hexTest(TOKEN), status: 'claimed' },  // terminal
  });
  const res = await handleAccountActions(
    req({ action: 'claim_dossier_purchase', sessionId: 'cs_1', checkoutToken: TOKEN, saveId: 'save_1' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 403);
  // A non-unclaimed row is rejected at the verify gate — the claim RPC never runs.
  assertEquals(admin.rpc.some((c) => c.fn === 'claim_dossier_purchase_by_session'), false);
});

Deno.test('claim_dossier_purchase requires sessionId, a valid token, and saveId (400s)', async () => {
  const user = makeUserClient({ id: 'claimer', email: 'c@x.com' });
  const admin = makeClaimAdminClient({ purchase: null });
  // Missing sessionId.
  let res = await handleAccountActions(
    req({ action: 'claim_dossier_purchase', checkoutToken: TOKEN, saveId: 'save_1' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  // A too-short token (below the 24-char floor).
  res = await handleAccountActions(
    req({ action: 'claim_dossier_purchase', sessionId: 'cs_1', checkoutToken: 'short', saveId: 'save_1' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  // Missing saveId.
  res = await handleAccountActions(
    req({ action: 'claim_dossier_purchase', sessionId: 'cs_1', checkoutToken: TOKEN }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(admin.rpc.some((c) => c.fn === 'claim_dossier_purchase_by_session'), false);
});

Deno.test('claim_dossier_purchase over the rate limit is rejected (429), no verify/claim', async () => {
  const user = makeUserClient({ id: 'spammer', email: 's@x.com' });
  const admin = makeClaimAdminClient({
    purchase: { checkout_token_hash: await sha256hexTest(TOKEN), status: 'unclaimed' },
    rateOk: false,   // limiter says over-limit
  });
  const res = await handleAccountActions(
    req({ action: 'claim_dossier_purchase', sessionId: 'cs_1', checkoutToken: TOKEN, saveId: 'save_1' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 429);
  assertEquals(admin.rpc.some((c) => c.fn === 'claim_dossier_purchase_by_session'), false);  // no claim past the limiter
});

Deno.test('claim_dossier_purchase surfaces a save_not_found business rejection (400)', async () => {
  const user = makeUserClient({ id: 'claimer', email: 'c@x.com' });
  const admin = makeClaimAdminClient({
    purchase: { checkout_token_hash: await sha256hexTest(TOKEN), status: 'unclaimed' },
    claimResult: { ok: false, reason: 'save_not_found' },   // RPC rejects the bind
  });
  const res = await handleAccountActions(
    req({ action: 'claim_dossier_purchase', sessionId: 'cs_1', checkoutToken: TOKEN, saveId: 'not_mine' }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals((await res.json()).reason, 'save_not_found');
});
