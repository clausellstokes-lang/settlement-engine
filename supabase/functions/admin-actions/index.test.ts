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

// ── mint_redeem_code (migration 107) ─────────────────────────────────────────
// Minting a redeem code is deferred money (a free month or a credit grant), so
// it is HIGHEST-role gated like grant_credits, the code is generated
// server-side (crypto.getRandomValues, SFC- + 12 Crockford chars), and the
// bearer value is returned to the operator exactly once — never audited.

/** Admin stub for the mint action: records redeem_codes inserts + audit RPCs. */
function makeMintAdminClient(callerRole: string) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const inserts: Array<Record<string, unknown>> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (table: string) => {
      if (table === 'redeem_codes') {
        return { insert: (row: Record<string, unknown>) => { inserts.push(row); return Promise.resolve({ error: null }); } };
      }
      return {
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: { role: callerRole, email: 'caller@x.com' }, error: null }),
          }),
        }),
      };
    },
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    rpc: (fn: string, args: unknown) => { rpc.push({ fn, args }); return Promise.resolve({ data: null, error: null }); },
  };
  return { rpc, inserts, adminClient: () => client };
}

// Crockford base32 body: no I, L, O, or U — unambiguous when read back.
const REDEEM_CODE_SHAPE = /^SFC-[0-9A-HJKMNP-TV-Z]{12}$/;

Deno.test('an admin mints a credits code: high-entropy SFC code, server-shaped row, code never audited', async () => {
  const stub = makeMintAdminClient('admin');
  const res = await handleAdminActions(
    req({ action: 'mint_redeem_code', kind: 'credits', credit_amount: 25, max_uses: 5 },
      { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.success, true);
  assertEquals(REDEEM_CODE_SHAPE.test(body.code), true);

  // The inserted row is server-shaped: no coupon on a credits code, and the
  // stored code is exactly the returned one.
  assertEquals(stub.inserts.length, 1);
  const row = stub.inserts[0];
  assertEquals(row.code, body.code);
  assertEquals(row.kind, 'credits');
  assertEquals(row.credit_amount, 25);
  assertEquals(row.stripe_coupon_id, null);
  assertEquals(row.max_uses, 5);
  assertEquals(row.applies_to, 'any');

  // The audit row records the SHAPE, never the bearer code itself.
  const audit = stub.rpc.find((c) => c.fn === 'write_audit');
  assertEquals(audit !== undefined, true);
  assertEquals(JSON.stringify(audit!.args).includes(body.code), false);
});

Deno.test('a free_month mint defaults applies_to to subscription and requires the operator coupon id', async () => {
  const stub = makeMintAdminClient('developer');
  const res = await handleAdminActions(
    req({ action: 'mint_redeem_code', kind: 'free_month', stripe_coupon_id: 'referral_free_month', max_uses: 1 },
      { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'dev1', email: 'dev@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 200);
  const row = stub.inserts[0];
  assertEquals(row.kind, 'free_month');
  assertEquals(row.stripe_coupon_id, 'referral_free_month');
  // The safe default: a 100%-off coupon must not zero a one-time purchase
  // unless the operator widens the scope explicitly.
  assertEquals(row.applies_to, 'subscription');
});

Deno.test('a free_month mint WITHOUT a stripe_coupon_id is rejected 400 before any insert', async () => {
  const stub = makeMintAdminClient('admin');
  const res = await handleAdminActions(
    req({ action: 'mint_redeem_code', kind: 'free_month', max_uses: 1 }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(stub.inserts.length, 0);
});

Deno.test('a credits mint without a positive credit_amount is rejected 400 before any insert', async () => {
  const stub = makeMintAdminClient('admin');
  const res = await handleAdminActions(
    req({ action: 'mint_redeem_code', kind: 'credits', credit_amount: 0, max_uses: 1 }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(stub.inserts.length, 0);
});

Deno.test('a SUPPORT-role caller CANNOT mint redeem codes (highest-only edge gate)', async () => {
  const stub = makeMintAdminClient('support');
  const res = await handleAdminActions(
    req({ action: 'mint_redeem_code', kind: 'credits', credit_amount: 25, max_uses: 1 },
      { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'support1', email: 'support@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(stub.inserts.length, 0);
  assertEquals(stub.rpc.length, 0);   // no audit, no RPC — rejected at the gate
});

// ── AI pricing NIGHTLY cron status/toggle (migration 115) ────────────────────
// Both actions are HIGHEST-role gated (parity with the manual ai_pricing_resync).
// Status NEVER echoes the url/secret VALUES — only whether both are configured.

/** Admin stub whose system_config reads return a cron config + optional last_run. */
function makeCronAdminClient(
  callerRole: string,
  cronValue: Record<string, unknown>,
  lastRunValue: unknown = null,
) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const updates: Array<{ table: string; value: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (table: string) => ({
      select: (_cols: string) => ({
        // caller-profile read: .select().eq().single()
        // cron single read:     .select().eq().single()
        eq: (_c: string, _v: string) => ({
          single: () => {
            if (table === 'profiles') {
              return Promise.resolve({ data: { role: callerRole, email: 'caller@x.com' }, error: null });
            }
            return Promise.resolve({ data: { value: cronValue }, error: null });
          },
        }),
        // status read: .select().in([...])
        in: (_c: string, _vals: string[]) => Promise.resolve({
          data: [
            { key: 'pricing_resync_cron', value: cronValue },
            { key: 'pricing_resync_last_run', value: lastRunValue },
          ],
          error: null,
        }),
      }),
      // toggle write: .update().eq()
      update: (value: Record<string, unknown>) => ({
        eq: (_c: string, _v: string) => {
          updates.push({ table, value: value.value });
          return Promise.resolve({ error: null });
        },
      }),
    }),
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    rpc: (fn: string, args: unknown) => { rpc.push({ fn, args }); return Promise.resolve({ data: null, error: null }); },
  };
  return { rpc, updates, adminClient: () => client };
}

Deno.test('ai_pricing_cron_status NEVER returns the url or secret values (redacted)', async () => {
  const stub = makeCronAdminClient('admin', {
    enabled: true, url: 'https://secret-url', secret: 'top-secret',
    timezone: 'America/New_York', applyCreditCosts: true, lastDispatchedOn: '2026-07-06',
  }, { at: '2026-07-06T04:00:00Z', ok: true, trigger: 'cron', summary: { priceChanges: 1 }, error: null });
  const res = await handleAdminActions(
    req({ action: 'ai_pricing_cron_status' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.enabled, true);
  assertEquals(body.configured, true);          // both url + secret present
  assertEquals(body.timezone, 'America/New_York');
  assertEquals(body.applyCreditCosts, true);
  assertEquals(body.lastDispatchedOn, '2026-07-06');
  // Hard requirement: the raw url + secret must NEVER appear in the response.
  const raw = JSON.stringify(body);
  assertEquals(raw.includes('secret-url'), false);
  assertEquals(raw.includes('top-secret'), false);
});

Deno.test('ai_pricing_cron_status reports configured:false when url/secret are null', async () => {
  const stub = makeCronAdminClient('developer', {
    enabled: true, url: null, secret: null, timezone: 'America/New_York', applyCreditCosts: true, lastDispatchedOn: null,
  });
  const res = await handleAdminActions(
    req({ action: 'ai_pricing_cron_status' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'dev1', email: 'dev@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.configured, false);
  assertEquals(body.lastRun, null);
});

Deno.test('a SUPPORT-role caller CANNOT read ai_pricing_cron_status (highest-only)', async () => {
  const stub = makeCronAdminClient('support', { enabled: true });
  const res = await handleAdminActions(
    req({ action: 'ai_pricing_cron_status' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'support1', email: 'support@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 403);
});

Deno.test('ai_pricing_cron_set flips only the enabled flag and audits the change', async () => {
  const stub = makeCronAdminClient('admin', {
    enabled: false, url: 'https://x', secret: 's', timezone: 'America/New_York', applyCreditCosts: true, lastDispatchedOn: null,
  });
  const res = await handleAdminActions(
    req({ action: 'ai_pricing_cron_set', enabled: true }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.success, true);
  assertEquals(body.enabled, true);
  // The update merged enabled:true onto the existing row, preserving url/secret/tz.
  assertEquals(stub.updates.length, 1);
  const written = stub.updates[0].value as Record<string, unknown>;
  assertEquals(written.enabled, true);
  assertEquals(written.url, 'https://x');       // preserved
  assertEquals(written.secret, 's');            // preserved
  assertEquals(written.timezone, 'America/New_York');
  // Audited before/after.
  const audit = stub.rpc.find((c) => c.fn === 'write_audit');
  assertEquals(audit !== undefined, true);
  assertEquals((audit!.args as { p_action: string }).p_action, 'ai_pricing_cron_toggle');
});

Deno.test('ai_pricing_cron_set rejects a non-boolean enabled with 400 and no write', async () => {
  const stub = makeCronAdminClient('admin', { enabled: false, url: 'https://x', secret: 's' });
  const res = await handleAdminActions(
    req({ action: 'ai_pricing_cron_set', enabled: 'yes' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(stub.updates.length, 0);
});

Deno.test('a SUPPORT-role caller CANNOT ai_pricing_cron_set (highest-only)', async () => {
  const stub = makeCronAdminClient('support', { enabled: false });
  const res = await handleAdminActions(
    req({ action: 'ai_pricing_cron_set', enabled: true }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'support1', email: 'support@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(stub.updates.length, 0);
  assertEquals(stub.rpc.length, 0);
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

// ── Money-spine backfill (backfill_money_events, DESIGN_MONEY_WAVE §2/§11, M-1c) ──
// Highest-role, one-time, audited. Pages Stripe history and upserts money_events
// rows through the event_key shield (idempotent). These EXECUTE the verb with a
// stubbed Stripe + admin client and assert the composed rows + the audit + the gate.

/** Admin stub that also models money_events.upsert + profiles.maybeSingle (customer→user). */
function makeBackfillAdminClient(callerRole: string, resolvedUserId: string | null = 'u1', callerEmail = 'admin@x.com') {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  const upserts: Array<{ table: string; row: Record<string, unknown> }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (t: string) => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: { role: callerRole, email: callerEmail }, error: null }),
          maybeSingle: () => Promise.resolve({ data: resolvedUserId ? { id: resolvedUserId } : null, error: null }),
        }),
      }),
      upsert: (row: Record<string, unknown>, _o?: unknown) => { upserts.push({ table: t, row }); return Promise.resolve({ data: null, error: null }); },
    }),
    auth: { admin: { updateUserById: () => Promise.resolve({ error: null }) } },
    rpc: (fn: string, args: unknown) => { rpc.push({ fn, args }); return Promise.resolve({ data: {}, error: null }); },
  };
  return { rpc, upserts, adminClient: () => client };
}

const backfillStripe = {
  checkout: { sessions: { list: (_p: Record<string, unknown>) => Promise.resolve({ data: [
    { id: 'cs_h1', payment_status: 'paid', amount_total: 500, currency: 'usd', created: 1700000000, payment_intent: 'pi_h1', metadata: { product: 'credits_25', credits: '25', supabase_user_id: 'u1' } },
    { id: 'cs_h2', payment_status: 'paid', amount_total: 9900, currency: 'usd', created: 1700000100, payment_intent: 'pi_h2', metadata: { product: 'founder_lifetime', supabase_user_id: 'u2' } },
    { id: 'cs_h3', payment_status: 'unpaid', amount_total: 500, currency: 'usd', created: 1700000150, metadata: { product: 'credits_25', credits: '25', supabase_user_id: 'u3' } },
  ], has_more: false }) } },
  invoices: { list: (_p: Record<string, unknown>) => Promise.resolve({ data: [
    { id: 'in_h1', billing_reason: 'subscription_cycle', amount_paid: 900, currency: 'usd', created: 1700000200, hosted_invoice_url: 'https://x/inv', customer: 'cus_h1' },
    { id: 'in_h2', billing_reason: 'subscription_create', amount_paid: 900, currency: 'usd', created: 1700000300, customer: 'cus_h2' },
  ], has_more: false }) },
};

Deno.test('backfill_money_events pages Stripe and upserts money_events rows (idempotent, audited)', async () => {
  const stub = makeBackfillAdminClient('admin');
  const res = await handleAdminActions(
    req({ action: 'backfill_money_events' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient, stripeClient: backfillStripe },
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.sessionsProcessed, 3);
  assertEquals(body.invoicesProcessed, 2);
  // 2 paid sessions (the unpaid one skipped) + 1 renewal (the subscription_create skipped).
  assertEquals(body.rowsUpserted, 3);
  const me = stub.upserts.filter((u) => u.table === 'money_events');
  assertEquals(me.length, 3);
  assertEquals(me.some((u) => u.row.event_key === 'sess:cs_h1' && u.row.kind === 'credit_pack'), true);
  assertEquals(me.some((u) => u.row.event_key === 'sess:cs_h2' && u.row.kind === 'founder_seat' && u.row.amount_cents === 9900), true);
  const renewal = me.find((u) => u.row.event_key === 'inv:in_h1');
  assertEquals(renewal !== undefined, true);
  assertEquals(renewal!.row.kind, 'subscription_renewal');
  assertEquals(renewal!.row.user_id, 'u1');            // owner resolved from the customer
  assertEquals(renewal!.row.receipt_url, 'https://x/inv');
  // No sess:cs_h3 (unpaid) and no inv:in_h2 (subscription_create → start comes from the session).
  assertEquals(me.some((u) => u.row.event_key === 'sess:cs_h3'), false);
  assertEquals(me.some((u) => u.row.event_key === 'inv:in_h2'), false);
  assertEquals(stub.rpc.some((c) => c.fn === 'write_audit'), true);
});

Deno.test('backfill_money_events rejects a non-highest role (403) and reads no Stripe', async () => {
  let listed = false;
  const stripe = {
    checkout: { sessions: { list: () => { listed = true; return Promise.resolve({ data: [], has_more: false }); } } },
    invoices: { list: () => { listed = true; return Promise.resolve({ data: [], has_more: false }); } },
  };
  const stub = makeBackfillAdminClient('support');
  const res = await handleAdminActions(
    req({ action: 'backfill_money_events' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'sup1', email: 'sup@x.com' }), adminClient: stub.adminClient, stripeClient: stripe },
  );
  assertEquals(res.status, 403);
  assertEquals(listed, false);
  assertEquals(stub.upserts.length, 0);
});

// ── Surveyor admin verbs (159, §5, slice M-4c) ───────────────────────────────

Deno.test('grant_surveyor routes to grant_surveyor_entitlement (highest-role, audited)', async () => {
  const stub = makeAdminClient('admin');
  const res = await handleAdminActions(
    req({ action: 'grant_surveyor', userId: 'u9' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 200);
  const call = stub.rpc.find((c) => c.fn === 'grant_surveyor_entitlement');
  assertEquals((call!.args as { p_user: string }).p_user, 'u9');
  assertEquals((call!.args as { p_source: string }).p_source, 'grant');
  const audit = stub.rpc.find((c) => c.fn === 'write_audit');
  assertEquals((audit!.args as { p_action: string }).p_action, 'grant_surveyor');
});

Deno.test('revoke_surveyor routes to revoke_surveyor_entitlement (audited, destructive)', async () => {
  const stub = makeAdminClient('developer');
  const res = await handleAdminActions(
    req({ action: 'revoke_surveyor', userId: 'u9', reason: 'refund' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'dev1', email: 'dev@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals(stub.rpc.some((c) => c.fn === 'revoke_surveyor_entitlement'), true);
  const audit = stub.rpc.find((c) => c.fn === 'write_audit');
  assertEquals((audit!.args as { p_action: string }).p_action, 'revoke_surveyor');
});

Deno.test('grant_surveyor is rejected for a non-highest role (403, no RPC dispatched)', async () => {
  const stub = makeAdminClient('support');
  const res = await handleAdminActions(
    req({ action: 'grant_surveyor', userId: 'u9' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'sup1', email: 'sup@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 403);
  assertEquals(stub.rpc.length, 0);
});

Deno.test('grant_surveyor requires a userId', async () => {
  const stub = makeAdminClient('admin');
  const res = await handleAdminActions(
    req({ action: 'grant_surveyor' }, { Authorization: 'Bearer jwt' }),
    { userClient: makeUserClient({ id: 'admin1', email: 'admin@x.com' }), adminClient: stub.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(stub.rpc.length, 0);
});
