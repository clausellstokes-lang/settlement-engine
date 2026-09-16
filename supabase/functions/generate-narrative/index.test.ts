/**
 * index.test.ts — EXECUTION test of the generate-narrative money/AI trust boundary
 * (A+ tests-tooling — the highest-trust untested edge handler: it both spends money
 * and calls the model).
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * generate-narrative spends credits up-front (the atomic spend_credits RPC) BEFORE
 * streaming, then must (a) NEVER spend for an inactive account (fail-closed gate) and
 * (b) REFUND via the captured spend_id when the generation fails — without double-
 * spending. Previously this was asserted only by regex over the handler source — a
 * refactor that spent before the active gate, dropped the refund, or used the wrong
 * ledger row would have kept those green. This RUNS the real handler with injected
 * supabase stubs and asserts the boundary:
 *   - an INACTIVE account (account_is_active=false) is rejected and NEVER spends
 *   - a null account_is_active result FAILS CLOSED (never spends)
 *   - a thesis-generation FAILURE refunds via refund_credits with the EXACT spend_id
 *     captured from spend_credits, and spend_credits ran EXACTLY ONCE (no double-spend)
 *   - an elevated account that fails does NOT call refund_credits (never charged)
 *
 * The generation failure is induced naturally: ANTHROPIC_API_KEY is unset, so the
 * thesis callModel throws "Anthropic API key is not configured" — the real failure
 * path, not a mocked-out one.
 *
 * `handleGenerateNarrative` is the exported handler; we inject recording stubs via
 * its `deps` seam (production passes nothing).
 *
 * NOTE: authored without a local Deno runtime — verified in CI.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_ANON_KEY', 'anon_dummy');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
// No model keys → the thesis call throws on the real path, exercising the refund.
Deno.env.delete('ANTHROPIC_API_KEY');
Deno.env.delete('OPENAI_API_KEY');

const { handleGenerateNarrative, MAX_BODY_BYTES } = await import('./index.ts');

/** user-client stub: getUser() resolves the verified JWT identity, and rpc()
 *  handles spend_credits. `spendResult` is what spend_credits returns; every rpc
 *  call is recorded so a test can assert spend ran exactly once (no double-spend). */
function makeUserClient(
  user: { id: string; email?: string | null } | null,
  spendResult: Record<string, unknown>,
  authError = false,
) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    auth: {
      getUser: () => Promise.resolve({
        data: { user: authError ? null : user },
        error: authError ? { message: 'bad jwt' } : null,
      }),
    },
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'spend_credits') return Promise.resolve({ data: spendResult, error: null });
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { rpc, userClient: () => client };
}

/** Admin (service-role) stub: account_is_active gate + the refund_credits RPC.
 *  `activeResult` drives the gate; every rpc is recorded so a test can assert that
 *  refund_credits was (or was NOT) called and with which spend_ledger_row.
 *
 *  `free` (migration 118) drives the free-first-narrative RPCs the handler calls on
 *  the admin client: claim_free_narrative returns `free.claim` (true = this run is
 *  free, in place of spend_credits; false = already used, fall through to spend);
 *  get_credit_balance returns `free.balance` (the unchanged balance streamed for a
 *  free run). release_free_narrative always no-ops OK. Omit `free` and both RPCs
 *  return null (the pre-118 default), so every existing test is byte-unchanged. */
function makeAdminClient(
  activeResult: boolean | null,
  free?: { claim?: boolean; balance?: number },
  idem?: { duplicate?: boolean; spend_id?: string | null; balance?: number },
  // `opts` drives the re-pointed narrate-limiter lanes (fused migration 123 dropped
  // consume_narrate_rate_limit; consume_ai_generate_rate_limit — migration 087, run
  // on the service-role client — is now the limiter) and the refund-failure lane.
  // Omit it and every existing test is byte-unchanged.
  opts?: {
    rateLimit?: { allowed: boolean } | null;
    rateLimitError?: { message: string };
    refundError?: { message: string };
  },
) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      if (fn === 'account_is_active') {
        return Promise.resolve({
          data: activeResult,
          error: activeResult === null ? { message: 'rpc blew up' } : null,
        });
      }
      // Request-idempotency RPCs (migration 119). Only meaningfully driven when a
      // test passes `idem`; otherwise claim returns {duplicate:false} (the pre-119
      // behaviour — charge once) and attach no-ops, so every existing test is
      // byte-unchanged. When idem.duplicate is true, get_credit_balance below also
      // serves idem.balance for the duplicate-run creditsRemaining read.
      if (fn === 'claim_ai_request') {
        return Promise.resolve({
          data: {
            duplicate: idem?.duplicate === true,
            spend_id: idem?.spend_id ?? null,
          },
          error: null,
        });
      }
      if (fn === 'attach_ai_spend_to_claim') {
        return Promise.resolve({ data: null, error: null });
      }
      // Free-first-narrative RPCs (118). Only meaningfully driven when a test passes
      // `free`; otherwise claim/release/balance fall to the null default below.
      if (fn === 'claim_free_narrative') {
        return Promise.resolve({ data: free?.claim === true, error: null });
      }
      if (fn === 'release_free_narrative') {
        return Promise.resolve({ data: null, error: null });
      }
      if (fn === 'get_credit_balance') {
        // Serves the free-claim balance (118) OR the duplicate-run balance (119),
        // whichever a test wired; null when neither is set.
        const bal = typeof free?.balance === 'number'
          ? free.balance
          : (typeof idem?.balance === 'number' ? idem.balance : null);
        return Promise.resolve({ data: bal, error: null });
      }
      // Service-role SAFETY preflights added with provider-peer metering: both run
      // on the admin client BEFORE spend_credits. The spend cap FAILS CLOSED
      // (a null/!allowed result throws 400 before the stream opens), so the refund-
      // path tests must let it through to reach the spend → fail → refund boundary
      // they actually exercise. consume_ai_generate_rate_limit fails open, but we
      // allow it explicitly so the stub doesn't depend on that asymmetry.
      //
      // reserve_ai_spend (migration 086) replaced the read-only check_ai_spend_cap:
      // it RESERVES an estimated cost before the model calls and returns a
      // reservation_id the handler RELEASES in its finally once the real COGS row
      // lands. We allow it (with an id so the release path runs) and no-op the
      // release. (The legacy name is kept for any caller still on the read-only RPC.)
      if (fn === 'reserve_ai_spend') {
        return Promise.resolve({ data: { allowed: true, reservation_id: 'res_stub' }, error: null });
      }
      if (fn === 'release_ai_spend_reservation') {
        return Promise.resolve({ data: true, error: null });
      }
      if (fn === 'consume_ai_generate_rate_limit') {
        // Re-pointed from the dropped consume_narrate_rate_limit. opts drives the
        // throttle-before-spend + fail-open lanes:
        //   rateLimitError → the limiter RPC errors (handler FAILS OPEN → still spends)
        //   rateLimit:{allowed:false} → throttled (handler throws BEFORE spend_credits)
        if (opts?.rateLimitError) return Promise.resolve({ data: null, error: opts.rateLimitError });
        if (opts?.rateLimit !== undefined) return Promise.resolve({ data: opts.rateLimit, error: null });
        return Promise.resolve({ data: { allowed: true }, error: null });
      }
      if (fn === 'check_ai_spend_cap') {
        return Promise.resolve({ data: { allowed: true }, error: null });
      }
      if (fn === 'refund_credits' && opts?.refundError) {
        // Force the refund RPC to fail so the in-stream refund path surfaces the
        // {refund:'failed', …} frame. Fused migration 123 makes refund_credits a
        // no-op idempotent retry, so a genuine RPC error IS a real failure — the
        // edge must surface it (contact-support), never swallow it.
        return Promise.resolve({ data: null, error: opts.refundError });
      }
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { rpc, adminClient: () => client };
}

/** A minimal-but-real settlement: enough for summarizeSettlement to run without
 *  throwing, so the handler reaches the streaming thesis call (which then fails). */
const SETTLEMENT = {
  name: 'Testford',
  tier: 'village',
  population: 400,
  config: { terrainType: 'hills', culture: 'frontier', tradeRouteAccess: 'road' },
};

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://edge/generate-narrative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

/** Drain an NDJSON stream body to completion (the refund runs inside the stream). */
async function drain(res: Response): Promise<string> {
  if (!res.body) return '';
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let out = '';
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    out += decoder.decode(value, { stream: true });
  }
  return out;
}

Deno.test('an INACTIVE account is rejected (fail-closed) and NEVER spends a credit', async () => {
  const user = makeUserClient({ id: 'banned1', email: 'b@x.com' }, { ok: true, spend_id: 'should_not_happen', balance: 10 });
  const admin = makeAdminClient(false);   // account_is_active=false
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals((await res.json()).error, 'Account is not active');
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);   // gate ran before spend
});

Deno.test('a null account_is_active result FAILS CLOSED — never spends', async () => {
  const user = makeUserClient({ id: 'unknown1', email: 'u@x.com' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(null);    // RPC error ⇒ null
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);
});

Deno.test('a thesis FAILURE refunds via the captured spend_id and does NOT double-spend', async () => {
  const SPEND_ID = 'ledger_row_abc123';
  const user = makeUserClient(
    { id: 'payer1', email: 'p@x.com' },
    { ok: true, spend_id: SPEND_ID, balance: 9, elevated: false },
  );
  const admin = makeAdminClient(true);    // active → reaches the spend + the thesis call
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);          // a streaming response opens (200); failure is in-band
  const body = await drain(res);          // run the stream to completion (refund happens inside)

  // The thesis call failed (no API key) → the stream emitted a refunded error line.
  const lines = body.trim().split('\n').map((l) => JSON.parse(l));
  const errLine = lines.find((l) => typeof l.error === 'string' && l.error.includes('Thesis generation failed'));
  assertEquals(errLine !== undefined, true);
  assertEquals(errLine.refunded, true);

  // Spend ran EXACTLY ONCE (no double-spend on the failure path).
  const spends = user.rpc.filter((c) => c.fn === 'spend_credits');
  assertEquals(spends.length, 1);

  // Refund ran via the SERVICE-ROLE client, targeting the EXACT captured spend_id.
  const refunds = admin.rpc.filter((c) => c.fn === 'refund_credits');
  assertEquals(refunds.length, 1);
  assertEquals((refunds[0].args as { spend_ledger_row: string }).spend_ledger_row, SPEND_ID);
});

Deno.test('a PRE-STREAM throw (insufficient credits) RELEASES the 086 reservation — no global-cap headroom leak', async () => {
  // The reservation is taken (reserve_ai_spend) BEFORE spend_credits. spend fails
  // (insufficient_funds → ok:false) and the handler throws BEFORE the stream opens,
  // so the in-stream `finally` release never runs. Without the outer-catch release
  // the reservation leaks its global-cap headroom for the full TTL — a reachable
  // DoS (a zero-credit account can flood reserve→insufficient and saturate the cap).
  const user = makeUserClient(
    { id: 'broke1', email: 'b@x.com' },
    { ok: false, reason: 'insufficient_funds', balance: 0 },
  );
  const admin = makeAdminClient(true);   // active → reaches reserve (res_stub) → spend → fail
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);                                  // pre-stream throw → outer catch
  assertEquals((await res.json()).error.startsWith('Insufficient credits'), true);

  // The reservation was taken exactly once and RELEASED on the throw path.
  assertEquals(admin.rpc.filter((c) => c.fn === 'reserve_ai_spend').length, 1);
  const releases = admin.rpc.filter((c) => c.fn === 'release_ai_spend_reservation');
  assertEquals(releases.length, 1);
  assertEquals((releases[0].args as { p_id: string }).p_id, 'res_stub');
});

Deno.test('an ELEVATED account that fails does NOT refund (it was never charged)', async () => {
  const user = makeUserClient(
    { id: 'dev1', email: 'dev@x.com' },
    { ok: true, spend_id: 'elev_row', balance: -2, elevated: true },
  );
  const admin = makeAdminClient(true);
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  await drain(res);
  // refund() short-circuits for elevated accounts → refund_credits never called.
  assertEquals(admin.rpc.some((c) => c.fn === 'refund_credits'), false);
});

// ── FREE FIRST NARRATIVE (migration 118) — money-path boundary ──────────────
//
// A first base narrative is FREE: instead of spend_credits the handler makes an
// atomic server-side claim (claim_free_narrative). These tests assert, via injected
// stubs, that (a) a WON claim spends NOTHING and releases on failure, (b) a LOST
// claim (already used) falls through to the normal paid spend/refund unchanged.
// The model call still fails (no API key) so the stream reaches its terminal branch.

Deno.test('a FIRST narrative claims the free run: claim_free_narrative called, spend_credits NOT called, and a mid-stream failure RELEASES (never refunds)', async () => {
  // Free claim WON. spend_credits must never run; on the thesis failure (no key) the
  // handler must RELEASE the free claim (giving the taste back), NOT call refund_credits.
  const user = makeUserClient(
    { id: 'freeuser1', email: 'f@x.com' },
    // spend_credits must NOT be reached; if it were, this result would let it "succeed"
    // and expose the bug (we assert length 0 below).
    { ok: true, spend_id: 'should_not_spend', balance: 1, elevated: false },
  );
  const admin = makeAdminClient(true, { claim: true, balance: 1 });
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);          // streaming response opens; failure is in-band
  const body = await drain(res);
  const lines = body.trim().split('\n').map((l) => JSON.parse(l));
  const errLine = lines.find((l) => typeof l.error === 'string' && l.error.includes('Thesis generation failed'));
  assertEquals(errLine !== undefined, true);

  // The free claim was made exactly once, in place of the spend.
  assertEquals(admin.rpc.filter((c) => c.fn === 'claim_free_narrative').length, 1);
  // spend_credits was NEVER called (the free claim replaced it).
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);
  // On the failure the claim was RELEASED (rolled back) exactly once...
  assertEquals(admin.rpc.filter((c) => c.fn === 'release_free_narrative').length, 1);
  assertEquals(
    (admin.rpc.find((c) => c.fn === 'release_free_narrative')!.args as { p_user: string }).p_user,
    'freeuser1',
  );
  // ...and refund_credits was NEVER called (nothing was spent to refund).
  assertEquals(admin.rpc.some((c) => c.fn === 'refund_credits'), false);
});

Deno.test('a SECOND narrative (free claim already used) FALLS THROUGH to the normal paid spend + refund — unchanged', async () => {
  // Free claim LOST (already used). The handler must fall through to spend_credits and,
  // on the failure, refund via the captured spend_id — the pre-118 paid path, byte-for-byte.
  const SPEND_ID = 'paid_row_xyz';
  const user = makeUserClient(
    { id: 'freeuser2', email: 'g@x.com' },
    { ok: true, spend_id: SPEND_ID, balance: 5, elevated: false },
  );
  const admin = makeAdminClient(true, { claim: false, balance: 5 });
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  const body = await drain(res);
  const lines = body.trim().split('\n').map((l) => JSON.parse(l));
  const errLine = lines.find((l) => typeof l.error === 'string' && l.error.includes('Thesis generation failed'));
  assertEquals(errLine !== undefined, true);
  assertEquals(errLine.refunded, true);

  // The claim was attempted (and lost) exactly once...
  assertEquals(admin.rpc.filter((c) => c.fn === 'claim_free_narrative').length, 1);
  // ...so the NORMAL spend ran exactly once (no double-spend)...
  assertEquals(user.rpc.filter((c) => c.fn === 'spend_credits').length, 1);
  // ...and the refund targeted the EXACT captured spend_id...
  const refunds = admin.rpc.filter((c) => c.fn === 'refund_credits');
  assertEquals(refunds.length, 1);
  assertEquals((refunds[0].args as { spend_ledger_row: string }).spend_ledger_row, SPEND_ID);
  // ...and release_free_narrative was NEVER called (no free claim was held).
  assertEquals(admin.rpc.some((c) => c.fn === 'release_free_narrative'), false);
});

// ── REQUEST IDEMPOTENCY (migration 119) — the timeout-retry double-charge fix ──
//
// generate-narrative charges up-front, then a client watchdog may abort a slow
// stream and the user manually retries → a SECOND request would spend AGAIN. The
// client now sends a STABLE idempotencyKey; the edge claims it as the outermost
// money gate. These tests assert, via injected stubs, that (1) a FIRST request
// with a key claims (duplicate:false), spends once, and attaches the spend_id;
// (2) a DUPLICATE key skips the spend entirely and a mid-stream failure does NOT
// refund the prior charge (content still streams); (3) NO key behaves exactly as
// pre-119 (spend once), proving fail-open. The model call still fails (no API key)
// so each stream reaches its terminal branch.

Deno.test('a FIRST request WITH an idempotency key claims it (duplicate:false), spends ONCE, and attaches the spend_id', async () => {
  const SPEND_ID = 'ledger_row_first_attempt';
  const KEY = 'stable-req-key-1';
  const user = makeUserClient(
    { id: 'payerK1', email: 'k@x.com' },
    { ok: true, spend_id: SPEND_ID, balance: 8, elevated: false },
  );
  const admin = makeAdminClient(true, undefined, { duplicate: false });
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT, idempotencyKey: KEY }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  await drain(res);

  // The claim was made exactly once, with the sent key.
  const claims = admin.rpc.filter((c) => c.fn === 'claim_ai_request');
  assertEquals(claims.length, 1);
  assertEquals((claims[0].args as { p_key: string }).p_key, KEY);
  // The normal spend ran exactly once (a first attempt is a real charge).
  assertEquals(user.rpc.filter((c) => c.fn === 'spend_credits').length, 1);
  // The spend_id was attached to the claim so a later duplicate can target it.
  const attaches = admin.rpc.filter((c) => c.fn === 'attach_ai_spend_to_claim');
  assertEquals(attaches.length, 1);
  assertEquals((attaches[0].args as { p_key: string }).p_key, KEY);
  assertEquals((attaches[0].args as { p_spend_id: string }).p_spend_id, SPEND_ID);
});

Deno.test('a DUPLICATE request (retry within TTL) does NOT spend and a mid-stream failure does NOT refund the prior charge', async () => {
  const PRIOR_SPEND_ID = 'ledger_row_prior_attempt';
  const KEY = 'stable-req-key-1';
  const user = makeUserClient(
    { id: 'payerK2', email: 'k@x.com' },
    // If spend_credits were (wrongly) reached, this would let it "succeed" — we
    // assert length 0 below to prove the duplicate path skipped it entirely.
    { ok: true, spend_id: 'should_not_spend_again', balance: 5, elevated: false },
  );
  // claim_ai_request returns duplicate:true carrying the PRIOR attempt's spend_id.
  const admin = makeAdminClient(true, undefined, { duplicate: true, spend_id: PRIOR_SPEND_ID, balance: 5 });
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT, idempotencyKey: KEY }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);          // a streaming response opens; the failure is in-band
  const body = await drain(res);
  const lines = body.trim().split('\n').map((l) => JSON.parse(l));
  // Content still streams: the client lost the prior stream and the duplicate
  // regenerates. The thesis fails (no API key) so a terminal error line appears...
  const errLine = lines.find((l) => typeof l.error === 'string' && l.error.includes('Thesis generation failed'));
  assertEquals(errLine !== undefined, true);
  // ...but it reports refunded:false — nothing was charged THIS attempt to refund.
  assertEquals(errLine.refunded, false);

  // The claim was made once and reported duplicate:true.
  assertEquals(admin.rpc.filter((c) => c.fn === 'claim_ai_request').length, 1);
  // spend_credits was NEVER called (the duplicate path skips the charge)...
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);
  // ...the free-narrative claim was also SKIPPED (the whole charge block is gated)...
  assertEquals(admin.rpc.some((c) => c.fn === 'claim_free_narrative'), false);
  // ...attach was NOT called (only the first attempt attaches)...
  assertEquals(admin.rpc.some((c) => c.fn === 'attach_ai_spend_to_claim'), false);
  // ...and CRUCIALLY: refund_credits was NEVER called — a mid-stream failure of a
  // DUPLICATE must not refund the PRIOR attempt's charge (the money-safety crux).
  assertEquals(admin.rpc.some((c) => c.fn === 'refund_credits'), false);
  // ...and no free release either (no free claim was held this attempt).
  assertEquals(admin.rpc.some((c) => c.fn === 'release_free_narrative'), false);
});

Deno.test('NO idempotency key behaves exactly as pre-119: claim_ai_request is not called and the spend runs once (fail-open)', async () => {
  const SPEND_ID = 'ledger_row_nokey';
  const user = makeUserClient(
    { id: 'payerNoKey', email: 'n@x.com' },
    { ok: true, spend_id: SPEND_ID, balance: 7, elevated: false },
  );
  const admin = makeAdminClient(true);   // no idem wiring
  const res = await handleGenerateNarrative(
    // No idempotencyKey in the body → the handler must not touch the claim RPCs.
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  const body = await drain(res);
  const lines = body.trim().split('\n').map((l) => JSON.parse(l));
  const errLine = lines.find((l) => typeof l.error === 'string' && l.error.includes('Thesis generation failed'));
  assertEquals(errLine !== undefined, true);
  assertEquals(errLine.refunded, true);   // a real charge WAS refunded on the failure

  // FAIL OPEN: with no key the idempotency RPCs are never called...
  assertEquals(admin.rpc.some((c) => c.fn === 'claim_ai_request'), false);
  assertEquals(admin.rpc.some((c) => c.fn === 'attach_ai_spend_to_claim'), false);
  // ...the spend ran exactly once (pre-119 behaviour)...
  assertEquals(user.rpc.filter((c) => c.fn === 'spend_credits').length, 1);
  // ...and the refund targeted that real charge.
  const refunds = admin.rpc.filter((c) => c.fn === 'refund_credits');
  assertEquals(refunds.length, 1);
  assertEquals((refunds[0].args as { spend_ledger_row: string }).spend_ledger_row, SPEND_ID);
});

Deno.test('a request with NO authorization header is rejected (400) before any spend', async () => {
  const user = makeUserClient({ id: 'u1' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(true);
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }),   // no Authorization
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 400);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);
});

// Finding (1): an oversized body is rejected with 413 BEFORE parse + spend.
// The cap bounds abuse/DoS, not the token bill (the prompt is a compact summary).
// Sized OVER the real exported ceiling so this test tracks MAX_BODY_BYTES and can
// never silently drift when the cap is retuned.
Deno.test('an OVER-CAP body (> MAX_BODY_BYTES) is rejected (413) before any spend', async () => {
  const user = makeUserClient({ id: 'u1', email: 'u@x.com' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(true);
  const huge = { type: 'narrative', settlement: { ...SETTLEMENT, blob: 'x'.repeat(MAX_BODY_BYTES + 1024) } };
  const res = await handleGenerateNarrative(
    req(huge, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 413);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);   // never reached the spend
});

// Finding (1, byte cap): a multi-byte payload whose UTF-16 code-unit count is
// UNDER the cap but whose BYTE count is OVER it must be rejected (413). The cap
// must measure BYTES (new TextEncoder().encode(rawBody).length), not rawBody.length
// (code units) — else a payload of many 3-byte chars slips past the byte ceiling.
// '実' is 3 UTF-8 bytes / 1 UTF-16 code unit, so ceil(cap/3)+pad chars gives a body
// whose byte size exceeds the cap while its code-unit count stays comfortably under.
Deno.test('a multi-byte body OVER the BYTE cap (but under code-unit count) is rejected (413)', async () => {
  const user = makeUserClient({ id: 'u1', email: 'u@x.com' }, { ok: true, spend_id: 'x', balance: 10 });
  const admin = makeAdminClient(true);
  const blob = '実'.repeat(Math.ceil(MAX_BODY_BYTES / 3) + 4_000);
  const body = JSON.stringify({ type: 'narrative', settlement: { ...SETTLEMENT, blob } });
  // Sanity: a code-unit cap would ADMIT this body (code units < cap); the byte cap rejects it (bytes > cap).
  assertEquals(body.length <= MAX_BODY_BYTES, true);
  assertEquals(new TextEncoder().encode(body).length > MAX_BODY_BYTES, true);
  const res = await handleGenerateNarrative(
    new Request('https://edge/generate-narrative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer jwt' },
      body,
    }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 413);
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);   // never reached the spend
});

// A body just under the cap still parses + flows normally (cap is a ceiling,
// not a regression on legitimate requests). No model key set, so the thesis
// fails in-stream → 200 streaming response, but the body parsed fine.
Deno.test('an UNDER-CAP body parses normally (cap does not block legitimate requests)', async () => {
  const user = makeUserClient({ id: 'u1', email: 'u@x.com' }, { ok: true, spend_id: 'x', balance: 9, elevated: false });
  const admin = makeAdminClient(true);
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);   // streaming response opened → body parsed
  await drain(res);
});

// ── progression changeType is a client string: own-property lookup only ──────
Deno.test('progressionAffectedKeys ignores prototype-chain names and unknown types (thesis-only fallback)', async () => {
  const { progressionAffectedKeys } = await import('./index.ts');
  // A prototype name used to resolve the inherited Object member (truthy, so
  // `|| []` never applied) and `.map` threw inside the stream post-spend.
  for (const hostile of ['constructor', 'toString', 'hasOwnProperty', '__proto__']) {
    assertEquals(progressionAffectedKeys(hostile), []);
  }
  assertEquals(progressionAffectedKeys('not_a_real_change_type'), []);
  // A REAL changeType still resolves its refinement passes.
  assertEquals(progressionAffectedKeys('addStressor').length > 0, true);
});

// ── Narrate rate limit (re-pointed) ─────────────────────────────────────────
// Fused migration 123 DROPPED consume_narrate_rate_limit; consume_ai_generate_
// rate_limit (migration 087, run on the SERVICE-ROLE/admin client) is now the
// narrate limiter. These two lanes preserve the throttle-before-spend + fail-open
// coverage the old limiter tests carried, re-pointed at the surviving RPC.

Deno.test('a THROTTLED narrate limiter (consume_ai_generate_rate_limit allowed:false) rejects BEFORE any spend or refund', async () => {
  const user = makeUserClient(
    { id: 'throttled1', email: 't@x.com' },
    { ok: true, spend_id: 'should_not_spend', balance: 10, elevated: false },
  );
  // Account active; the daily AI-generation limit reports it is reached.
  const admin = makeAdminClient(true, undefined, undefined, { rateLimit: { allowed: false } });
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  // Pre-stream throw → outer catch → 400 with the user-facing limit message.
  assertEquals(res.status, 400);
  assertEquals(/generation limit/i.test((await res.json()).error), true);
  // The limiter WAS consulted…
  assertEquals(admin.rpc.some((c) => c.fn === 'consume_ai_generate_rate_limit'), true);
  // …and the throttle cost the user NOTHING: neither spend (user) nor refund (admin) ran.
  assertEquals(user.rpc.some((c) => c.fn === 'spend_credits'), false);
  assertEquals(admin.rpc.some((c) => c.fn === 'refund_credits'), false);
});

Deno.test('a limiter ERROR fails OPEN — consume_ai_generate_rate_limit errors but the spend still runs', async () => {
  const user = makeUserClient(
    { id: 'failopen1', email: 'fo@x.com' },
    { ok: true, spend_id: 'row_fo', balance: 9, elevated: false },
  );
  // The limiter RPC errors; a limiter OUTAGE must never block a paying user.
  const admin = makeAdminClient(true, undefined, undefined, { rateLimitError: { message: 'limiter unavailable' } });
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);   // proceeded past the limiter → stream opened
  await drain(res);
  // The limiter was consulted (and errored) but the spend still ran — fail-open.
  assertEquals(admin.rpc.some((c) => c.fn === 'consume_ai_generate_rate_limit'), true);
  assertEquals(user.rpc.filter((c) => c.fn === 'spend_credits').length, 1);
});

Deno.test('a refund RPC FAILURE surfaces a {refund:"failed", spend_id, supportNote} frame on the stream', async () => {
  const SPEND_ID = 'row_refund_fail';
  const user = makeUserClient(
    { id: 'payer_rf', email: 'rf@x.com' },
    { ok: true, spend_id: SPEND_ID, balance: 8, elevated: false },
  );
  // active → spend → thesis fails (no key) → refund_credits ERRORS. Fused 123 makes
  // refund_credits a no-op idempotent retry, so a genuine RPC error is a REAL
  // failure the edge must surface (contact-support), never swallow.
  const admin = makeAdminClient(true, undefined, undefined, { refundError: { message: 'refund rpc exploded' } });
  const res = await handleGenerateNarrative(
    req({ type: 'narrative', settlement: SETTLEMENT }, { Authorization: 'Bearer jwt' }),
    { userClient: user.userClient, adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  const body = await drain(res);
  const lines = body.trim().split('\n').map((l) => JSON.parse(l));
  // The refund was attempted against the EXACT spend row and FAILED loudly.
  assertEquals(admin.rpc.filter((c) => c.fn === 'refund_credits').length, 1);
  const failLine = lines.find((l) => l.refund === 'failed');
  assertEquals(failLine !== undefined, true);
  assertEquals(failLine.spend_id, SPEND_ID);
  assertEquals(typeof failLine.supportNote === 'string' && failLine.supportNote.length > 0, true);
});
