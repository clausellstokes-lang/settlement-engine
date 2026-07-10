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

Deno.env.set('RESEND_API_KEY', 're_test_dummy');
Deno.env.set('RESEND_FROM_EMAIL', 'SettlementForge <hello@settlementforge.test>');

const { handleSendEmail } = await import('./index.ts');

type Dispatched = { to: string; from: string; subject: string; text: string };

/** Deps stub: rate limiter allows (or not); dispatcher records instead of posting to Resend. */
function makeDeps(opts: { allow?: boolean } = {}) {
  const sent: Dispatched[] = [];
  const limited: Array<{ ip: string; recipient: string }> = [];
  return {
    sent,
    limited,
    deps: {
      consumeRateLimit: (ip: string, recipient: string) => {
        limited.push({ ip, recipient });
        return Promise.resolve(
          opts.allow === false
            ? ({ ok: false as const, reason: 'rate_limited' })
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

Deno.test('legit cap_warning (digit strings, as the client sends) dispatches with the counters rendered', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(post(capBody({ capUsed: '3', capTotal: '3' })), deps);
  assertEquals(res.status, 200);
  assertEquals((await res.json()).ok, true);
  assertEquals(sent.length, 1);
  assertEquals(sent[0].to, 'reader@example.com');
  assertStringIncludes(sent[0].text, '(3 of 3 used)');
});

Deno.test('numeric counter values are accepted too', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(post(capBody({ capUsed: 2, capTotal: 3 })), deps);
  assertEquals(res.status, 200);
  assertStringIncludes(sent[0].text, '(2 of 3 used)');
});

Deno.test('free text in a placeholder is rejected 400 and nothing is dispatched', async () => {
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

Deno.test('a URL smuggled into the second slot is rejected too', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(
    post(capBody({ capUsed: '3', capTotal: '3 — claim a refund at http://evil.example' })),
    deps,
  );
  assertEquals(res.status, 400);
  assertEquals(sent.length, 0);
});

Deno.test('non-digit shapes are rejected: negatives, decimals, exponents, padded, empty, oversized', async () => {
  const { deps, sent } = makeDeps();
  for (const bad of ['-1', '3.5', '1e3', ' 3', '3 ', '', '99999', -1, 3.5, Infinity, NaN, null, true, ['3'], { v: '3' }]) {
    const res = await handleSendEmail(post(capBody({ capUsed: bad, capTotal: '3' })), deps);
    assertEquals(res.status, 400, `expected 400 for capUsed=${JSON.stringify(bad)}`);
  }
  assertEquals(sent.length, 0);
});

Deno.test('a missing counter is rejected (every declared placeholder is required)', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(post(capBody({ capUsed: '3' })), deps);
  assertEquals(res.status, 400);
  assertEquals(sent.length, 0);
});

Deno.test('keys outside the schema are dropped — displayName cannot be smuggled into the render', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(
    post(capBody({ capUsed: '3', capTotal: '3', displayName: 'visit http://evil.example' })),
    deps,
  );
  assertEquals(res.status, 200);
  assertEquals(sent.length, 1);
  assertEquals(sent[0].text.includes('evil.example'), false);
});

Deno.test('implausible recipient is rejected 400 before any other work', async () => {
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

Deno.test('an over-limit caller gets 429 and no email leaves', async () => {
  const { deps, sent } = makeDeps({ allow: false });
  const res = await handleSendEmail(post(capBody({ capUsed: '3', capTotal: '3' })), deps);
  assertEquals(res.status, 429);
  assertEquals((await res.json()).reason, 'rate_limited');
  assertEquals(sent.length, 0);
});

Deno.test('an obvious bot UA is rejected and never dispatches', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(
    post(capBody({ capUsed: '3', capTotal: '3' }), 'curl/8.0'),
    deps,
  );
  assertEquals(res.status, 403);
  assertEquals(sent.length, 0);
});

Deno.test('unknown template is rejected 400', async () => {
  const { deps, sent } = makeDeps();
  const res = await handleSendEmail(post({ template: 'nope', payload: {} }), deps);
  assertEquals(res.status, 400);
  assertEquals(sent.length, 0);
});
