/**
 * index.test.ts — EXECUTION test of the auth-recovery hardening (Auth Phase 2,
 * finding 1: genuinely-tighter verify + cumulative per-account lockout, 067).
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * The logged-out recovery edge function must:
 *   - FAIL CLOSED when the rate limiter denies (429) or errors (503), on BOTH paths.
 *   - On VERIFY, gate on the cumulative lockout (recovery_is_locked, 067) BEFORE the
 *     bcrypt compare: a locked account is denied generically { ok:false } and
 *     verify_recovery_answer NEVER runs (waiting out the window buys no guesses).
 *   - On a WRONG answer, bump the cumulative counter (note_recovery_verify_failure)
 *     so lifetime guesses are bounded across windows.
 *   - On a CORRECT answer, clear the lockout (clear_recovery_lockout_by_email) and
 *     return generic { ok:true } (no answer/hash echoed).
 *   - On LOOKUP, a locked account responds with the no-question shape (no oracle).
 *   - NEVER echo the answer or the hash on any path.
 *
 * `handleAuthRecovery` is the exported handler; we inject a recording admin stub via
 * its `deps.adminClient` seam (production passes nothing). RPC results are canned per
 * function name so each test drives a specific branch.
 *
 * NOTE: authored without a local Deno runtime — verified in CI.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';

Deno.env.set('SUPABASE_URL', 'https://stub.supabase.co');
Deno.env.set('SUPABASE_SERVICE_ROLE_KEY', 'service_role_dummy');
// Mailer unconfigured: verify's correct-answer path still returns generic { ok:true }
// (sendEmail soft-fails) so the test asserts the branch without a live Resend.
Deno.env.delete('RESEND_API_KEY');
Deno.env.delete('RESEND_FROM_EMAIL');

const { handleAuthRecovery } = await import('./index.ts');

type RpcResult = { data?: unknown; error?: { message: string } | null };
/**
 * Admin (service-role) stub. `results` maps an RPC name to its canned result;
 * unlisted RPCs default to { data: null }. Every RPC call is recorded so a test can
 * assert which ran (e.g. that verify_recovery_answer did NOT run for a locked
 * account). generateLink is stubbed to a fixed action link.
 */
function makeAdminClient(results: Record<string, RpcResult> = {}) {
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      const r = results[fn] ?? { data: null };
      return Promise.resolve({ data: r.data ?? null, error: r.error ?? null });
    },
    auth: {
      admin: {
        generateLink: () =>
          Promise.resolve({
            data: { properties: { action_link: 'https://app/set-new-password#token=x' } },
            error: null,
          }),
      },
    },
  };
  return { rpc, adminClient: () => client };
}

/** A consume_recovery_rate_limit result that ALLOWS (under both caps). */
const ALLOW = { data: { allowed: true, ip_count: 1, email_count: 1 } };
/** A consume_recovery_rate_limit result that DENIES (over a cap). */
const DENY = { data: { allowed: false, ip_count: 99, email_count: 99 } };

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request('https://edge/auth-recovery', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });

function ranRpc(rpc: Array<{ fn: string }>, fn: string): boolean {
  return rpc.some((c) => c.fn === fn);
}

// ── fail-closed on the limiter ───────────────────────────────────────────────
Deno.test('verify FAILS CLOSED (429) when the limiter denies — no bcrypt compare', async () => {
  const admin = makeAdminClient({ consume_recovery_rate_limit: DENY });
  const res = await handleAuthRecovery(
    req({ action: 'verify', email: 'u@x.com', slot: 1, answer: 'rover' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 429);
  assertEquals(ranRpc(admin.rpc, 'verify_recovery_answer'), false);
});

Deno.test('verify FAILS CLOSED (503) when the limiter errors', async () => {
  const admin = makeAdminClient({
    consume_recovery_rate_limit: { data: null, error: { message: 'limiter down' } },
  });
  const res = await handleAuthRecovery(
    req({ action: 'verify', email: 'u@x.com', slot: 1, answer: 'rover' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 503);
  assertEquals(ranRpc(admin.rpc, 'verify_recovery_answer'), false);
});

// ── cumulative lockout gates verify BEFORE the bcrypt compare ─────────────────
Deno.test('a LOCKED account is denied generically and verify_recovery_answer NEVER runs', async () => {
  const admin = makeAdminClient({
    consume_recovery_rate_limit: ALLOW,
    recovery_is_locked: { data: true },
    // Even if the compare WOULD pass, it must not run for a locked account.
    verify_recovery_answer: { data: true },
  });
  const res = await handleAuthRecovery(
    req({ action: 'verify', email: 'locked@x.com', slot: 1, answer: 'rover' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals((await res.json()).ok, false); // generic deny, no locked/unlocked oracle
  assertEquals(ranRpc(admin.rpc, 'verify_recovery_answer'), false);
});

// ── wrong answer bumps the cumulative counter ────────────────────────────────
Deno.test('a WRONG answer bumps the cumulative lockout counter (067)', async () => {
  const admin = makeAdminClient({
    consume_recovery_rate_limit: ALLOW,
    recovery_is_locked: { data: false },
    verify_recovery_answer: { data: false },
    note_recovery_verify_failure: { data: { locked: false, fails: 1 } },
  });
  const res = await handleAuthRecovery(
    req({ action: 'verify', email: 'u@x.com', slot: 1, answer: 'wrong' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  assertEquals((await res.json()).ok, false);
  assertEquals(ranRpc(admin.rpc, 'note_recovery_verify_failure'), true);
  assertEquals(ranRpc(admin.rpc, 'clear_recovery_lockout_by_email'), false);
});

// ── correct answer clears the lockout and returns generic ok ─────────────────
Deno.test('a CORRECT answer clears the lockout and returns generic { ok:true }', async () => {
  const admin = makeAdminClient({
    consume_recovery_rate_limit: ALLOW,
    recovery_is_locked: { data: false },
    verify_recovery_answer: { data: true },
  });
  const res = await handleAuthRecovery(
    req({ action: 'verify', email: 'u@x.com', slot: 1, answer: 'rover' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
  // No answer/hash echoed.
  assertEquals('answer' in body, false);
  assertEquals('hash' in body, false);
  assertEquals(ranRpc(admin.rpc, 'clear_recovery_lockout_by_email'), true);
  assertEquals(ranRpc(admin.rpc, 'note_recovery_verify_failure'), false);
});

// ── lookup hides the question for a locked account (no oracle) ───────────────
Deno.test('LOOKUP on a LOCKED account returns the no-question shape (no oracle)', async () => {
  const admin = makeAdminClient({
    consume_recovery_rate_limit: ALLOW,
    recovery_is_locked: { data: true },
    // pick_recovery_question would offer a slot; it must not be called/echoed.
    pick_recovery_question: { data: [{ account_exists: true, slot: 1, question_id: 'first_pet' }] },
  });
  const res = await handleAuthRecovery(
    req({ action: 'lookup', email: 'locked@x.com' }),
    { adminClient: admin.adminClient },
  );
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.exists, true);
  assertEquals(body.slot, null);
  assertEquals(body.questionId, null);
  assertEquals(ranRpc(admin.rpc, 'pick_recovery_question'), false);
});

// ── verify limits are GENUINELY tighter than lookup (finding 1) ──────────────
Deno.test('verify consumes a TIGHTER per-email cap than lookup', async () => {
  // lookup
  const a1 = makeAdminClient({
    consume_recovery_rate_limit: ALLOW,
    recovery_is_locked: { data: false },
    pick_recovery_question: { data: [{ account_exists: true, slot: 1, question_id: 'first_pet' }] },
  });
  await handleAuthRecovery(req({ action: 'lookup', email: 'u@x.com' }), { adminClient: a1.adminClient });
  const lookupArgs = a1.rpc.find((c) => c.fn === 'consume_recovery_rate_limit')!.args as Record<string, number>;

  // verify
  const a2 = makeAdminClient({
    consume_recovery_rate_limit: ALLOW,
    recovery_is_locked: { data: false },
    verify_recovery_answer: { data: false },
    note_recovery_verify_failure: { data: { locked: false, fails: 1 } },
  });
  await handleAuthRecovery(
    req({ action: 'verify', email: 'u@x.com', slot: 1, answer: 'x' }),
    { adminClient: a2.adminClient },
  );
  const verifyArgs = a2.rpc.find((c) => c.fn === 'consume_recovery_rate_limit')!.args as Record<string, number>;

  // The per-email cap on verify must be strictly lower than on lookup.
  assertEquals(verifyArgs.p_email_limit < lookupArgs.p_email_limit, true);
});
