/**
 * index.test.ts — execution test for the send-email anonymous trust boundary.
 *
 * Runs the real handler with an injected rate-limiter + dispatcher and pins
 * the cap_warning path: the strict placeholder schema (digit-only counters —
 * an anonymous caller must never be able to put free text, URLs, or phishing
 * copy into mail sent from our Resend identity), recipient plausibility, bot
 * rejection, and the rate-limit gate. No live Supabase, no live Resend.
 */
import { assertEquals, assertStringIncludes } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { installScopedTestEnv } from '../_shared/scopedTestEnv.ts';

const scopedEnv = installScopedTestEnv({
  RESEND_API_KEY: 're_test_dummy',
  RESEND_FROM_EMAIL: 'SettlementForge <hello@settlementforge.test>',
});

const { handleSendEmail } = await import('./index.ts');
// The import above has read the stubs at module scope; hand the ambient environment
// back so nothing this suite supplied is visible while any OTHER suite runs.
scopedEnv.release();

type Dispatched = { to: string; from: string; subject: string; text: string };

/**
 * Deps stub: rate limiter allows (or not); dispatcher records instead of posting to Resend.
 *
 * `limiter` selects which of the limiter's THREE outcomes to model, because the handler
 * branches on them differently and only one was ever covered (A+ backend.4 case (d); LT36
 * car 6):
 *   'allow'       — under both limits.
 *   'rate_limited'— the caller is over their limit            -> 429.
 *   'unavailable' — the LIMITER ITSELF is down (missing service key, RPC error). This is the
 *                   FAIL-CLOSED arm: consumeAnonRateLimit's own contract is "if the limiter
 *                   is unreachable or misconfigured we do NOT send", because the safe failure
 *                   for a spam-relay control is to drop a non-critical email rather than
 *                   relay it unthrottled -> 503.
 *   'throws'      — the limiter raises instead of reporting. Not a shape consumeAnonRateLimit
 *                   produces today (it catches its own RPC errors), but an injected or future
 *                   limiter could, and the property that matters is that NO EMAIL LEAVES.
 */
function makeDeps(
  opts: { allow?: boolean; limiter?: 'allow' | 'rate_limited' | 'unavailable' | 'throws' } = {},
) {
  const sent: Dispatched[] = [];
  const limited: Array<{ ip: string; recipient: string }> = [];
  const mode = opts.limiter ?? (opts.allow === false ? 'rate_limited' : 'allow');
  return {
    sent,
    limited,
    deps: {
      consumeRateLimit: (ip: string, recipient: string) => {
        limited.push({ ip, recipient });
        if (mode === 'throws') return Promise.reject(new Error('limiter exploded'));
        return Promise.resolve(
          mode === 'rate_limited'
            ? ({ ok: false as const, reason: 'rate_limited' })
            : mode === 'unavailable'
            ? ({ ok: false as const, reason: 'rate_limit_unavailable' })
            : ({ ok: true as const }),
        );
      },
      dispatch: (o: Dispatched & { apiKey: string }) => {
        sent.push({ to: o.to, from: o.from, subject: o.subject, text: o.text });
        return Promise.resolve({ id: 'email_test' });
      },
    },
  };
}

const post = (body: unknown, ua = 'Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/120') =>
  new Request('https://edge/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'user-agent': ua },
    body: JSON.stringify(body),
  });

const capBody = (payload: Record<string, unknown>, recipient = 'reader@example.com') => ({
  template: 'cap_warning',
  recipient,
  payload,
});

scopedEnv.test('legit cap_warning (digit strings, as the client sends) dispatches with the counters rendered', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(post(capBody({ capUsed: '3', capTotal: '3' })), deps);
  assertEquals(res.status, 200);
  assertEquals((await res.json()).ok, true);
  assertEquals(sent.length, 1);
  assertEquals(sent[0].to, 'reader@example.com');
  assertStringIncludes(sent[0].text, '(3 of 3 used)');
});

scopedEnv.test('numeric counter values are accepted too', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(post(capBody({ capUsed: 2, capTotal: 3 })), deps);
  assertEquals(res.status, 200);
  assertStringIncludes(sent[0].text, '(2 of 3 used)');
});

scopedEnv.test('free text in a placeholder is rejected 400 and nothing is dispatched', async () => {
  const { deps, sent, limited } = makeDeps();
  const attackerCopy =
    'URGENT — your SettlementForge account was compromised. Reset now: http://evil.example/reset';
  const res = await handleSendEmail(
    post(capBody({ capUsed: attackerCopy, capTotal: '3' })),
    deps,
  );
  assertEquals(res.status, 400);
  assertEquals((await res.json()).reason, 'bad_payload');
  assertEquals(sent.length, 0);
  // Rejected before the rate limit is consumed — invalid payloads cost nothing.
  assertEquals(limited.length, 0);
});

scopedEnv.test('a URL smuggled into the second slot is rejected too', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(
    post(capBody({ capUsed: '3', capTotal: '3 — claim a refund at http://evil.example' })),
    deps,
  );
  assertEquals(res.status, 400);
  assertEquals(sent.length, 0);
});

scopedEnv.test('non-digit shapes are rejected: negatives, decimals, exponents, padded, empty, oversized', async () => {
  const { deps, sent } = makeDeps();
  for (const bad of ['-1', '3.5', '1e3', ' 3', '3 ', '', '99999', -1, 3.5, Infinity, NaN, null, true, ['3'], { v: '3' }]) {
    const res = await handleSendEmail(post(capBody({ capUsed: bad, capTotal: '3' })), deps);
    assertEquals(res.status, 400, `expected 400 for capUsed=${JSON.stringify(bad)}`);
  }
  assertEquals(sent.length, 0);
});

scopedEnv.test('a missing counter is rejected (every declared placeholder is required)', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(post(capBody({ capUsed: '3' })), deps);
  assertEquals(res.status, 400);
  assertEquals(sent.length, 0);
});

scopedEnv.test('keys outside the schema are dropped — displayName cannot be smuggled into the render', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(
    post(capBody({ capUsed: '3', capTotal: '3', displayName: 'visit http://evil.example' })),
    deps,
  );
  assertEquals(res.status, 200);
  assertEquals(sent.length, 1);
  assertEquals(sent[0].text.includes('evil.example'), false);
});

scopedEnv.test('implausible recipient is rejected 400 before any other work', async () => {
  const { deps, sent, limited } = makeDeps();
  const res = await handleSendEmail(
    post(capBody({ capUsed: '3', capTotal: '3' }, 'not-an-email')),
    deps,
  );
  assertEquals(res.status, 400);
  assertEquals((await res.json()).reason, 'bad_recipient');
  assertEquals(sent.length, 0);
  assertEquals(limited.length, 0);
});

scopedEnv.test('an over-limit caller gets 429 and no email leaves', async () => {
  const { deps, sent } = makeDeps({ allow: false });
  const res = await handleSendEmail(post(capBody({ capUsed: '3', capTotal: '3' })), deps);
  assertEquals(res.status, 429);
  assertEquals((await res.json()).reason, 'rate_limited');
  assertEquals(sent.length, 0);
});

// ── A+ backend.4 case (d), the OTHER half (LT36 car 6) ───────────────────────
// index.ts branches `limit.reason === "rate_limited" ? 429 : 503`. Only the 429 side had a
// test, so the fail-closed side — the one that decides what happens when the spam-relay
// control is DOWN — was the single uncovered case of an otherwise-complete item. A
// regression that turned the 503 into a 200-and-send would have shipped green.
scopedEnv.test('a DOWN limiter fails CLOSED: 503, and no email leaves', async () => {
  const { deps, sent, limited } = makeDeps({ limiter: 'unavailable' });
  const res = await handleSendEmail(post(capBody({ capUsed: '3', capTotal: '3' })), deps);
  assertEquals(res.status, 503);
  const body = await res.json();
  assertEquals(body.ok, false);
  assertEquals(body.reason, 'rate_limit_unavailable');
  assertEquals(sent.length, 0);
  // The limiter WAS consulted — this is a fail-closed decision, not a path that skipped the
  // check. Without this the assertion above would also pass if the request had been
  // rejected earlier for an unrelated reason.
  assertEquals(limited.length, 1);
});

scopedEnv.test('503 and 429 are DIFFERENT outcomes — the branch is real, not a constant', async () => {
  // A single-arm test cannot tell "the code returns 503 when the limiter is down" from
  // "the code returns 503 for every rejection". Both arms, same request, same fixture.
  const down = makeDeps({ limiter: 'unavailable' });
  const over = makeDeps({ limiter: 'rate_limited' });
  const body = capBody({ capUsed: '3', capTotal: '3' });
  assertEquals((await handleSendEmail(post(body), down.deps)).status, 503);
  assertEquals((await handleSendEmail(post(body), over.deps)).status, 429);
  assertEquals(down.sent.length, 0);
  assertEquals(over.sent.length, 0);
});

scopedEnv.test('a limiter that THROWS still fails closed — no email leaves (500, not 503)', async () => {
  // PINNED AS THE CURRENT TRUTH, and the status is deliberately stated. A limiter that
  // RAISES does not reach the 429/503 branch at all: it unwinds to the handler's outer
  // catch, which answers 500 internal_error. The property backend.4 actually names — the
  // fail-closed one — holds either way: the dispatch seam is never called. The status
  // difference is recorded here rather than "fixed", because changing a public endpoint's
  // response code is a contract change and this car is scoped to coverage.
  const { deps, sent, limited } = makeDeps({ limiter: 'throws' });
  const res = await handleSendEmail(post(capBody({ capUsed: '3', capTotal: '3' })), deps);
  assertEquals(res.status, 500);
  assertEquals((await res.json()).reason, 'internal_error');
  assertEquals(sent.length, 0);
  assertEquals(limited.length, 1);
});

scopedEnv.test('an obvious bot UA is rejected and never dispatches', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(
    post(capBody({ capUsed: '3', capTotal: '3' }), 'curl/8.0'),
    deps,
  );
  assertEquals(res.status, 403);
  assertEquals(sent.length, 0);
});

scopedEnv.test('unknown template is rejected 400', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(post({ template: 'nope', payload: {} }), deps);
  assertEquals(res.status, 400);
  assertEquals(sent.length, 0);
});
