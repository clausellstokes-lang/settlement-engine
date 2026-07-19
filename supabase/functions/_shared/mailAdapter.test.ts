/**
 * mailAdapter.test.ts — pins the provider-neutral mail seam: env selection,
 * inertness without keys, and per-provider transport routing (Resend / Postmark).
 * fetch is stubbed so no network is touched.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { selectMailAdapter, MAIL_PROVIDERS } from './mailAdapter.ts';

/** Build an env getter from a plain map. */
const envOf = (m: Record<string, string>) => (k: string) => m[k];

Deno.test('defaults to resend and is INERT without keys', () => {
  const a = selectMailAdapter(envOf({}));
  assertEquals(a.id, 'resend');
  assertEquals(a.configured, false);
  assertEquals(a.from, '');
});

Deno.test('resend is configured only when BOTH key and from are set', () => {
  assertEquals(selectMailAdapter(envOf({ RESEND_API_KEY: 're_x' })).configured, false);
  const a = selectMailAdapter(envOf({ RESEND_API_KEY: 're_x', RESEND_FROM_EMAIL: 'a@b.co' }));
  assertEquals(a.configured, true);
  assertEquals(a.from, 'a@b.co');
});

Deno.test('EMAIL_PROVIDER=postmark selects postmark; unknown falls back to resend', () => {
  assertEquals(selectMailAdapter(envOf({ EMAIL_PROVIDER: 'postmark' })).id, 'postmark');
  assertEquals(selectMailAdapter(envOf({ EMAIL_PROVIDER: 'nope' })).id, 'resend');
  assertEquals(MAIL_PROVIDERS.includes('postmark'), true);
});

Deno.test('resend.send posts to the Resend API and returns the id', async () => {
  const calls: Array<{ url: string; body: unknown }> = [];
  const orig = globalThis.fetch;
  globalThis.fetch = ((url: string, init: RequestInit) => {
    calls.push({ url: String(url), body: JSON.parse(String(init.body)) });
    return Promise.resolve(new Response(JSON.stringify({ id: 'resend_123' }), { status: 200 }));
  }) as typeof fetch;
  try {
    const a = selectMailAdapter(envOf({ RESEND_API_KEY: 're_x', RESEND_FROM_EMAIL: 'from@b.co' }));
    const r = await a.send({ to: 't@b.co', subject: 'Hi', text: 'Body' });
    assertEquals(r.id, 'resend_123');
    assertEquals(calls[0].url, 'https://api.resend.com/emails');
    assertEquals((calls[0].body as { to: string[] }).to[0], 't@b.co');
  } finally {
    globalThis.fetch = orig;
  }
});

Deno.test('postmark.send posts to the Postmark API and maps MessageID', async () => {
  const calls: Array<{ url: string; body: Record<string, unknown> }> = [];
  const orig = globalThis.fetch;
  globalThis.fetch = ((url: string, init: RequestInit) => {
    calls.push({ url: String(url), body: JSON.parse(String(init.body)) });
    return Promise.resolve(new Response(JSON.stringify({ MessageID: 'pm_9' }), { status: 200 }));
  }) as typeof fetch;
  try {
    const a = selectMailAdapter(envOf({ EMAIL_PROVIDER: 'postmark', POSTMARK_SERVER_TOKEN: 'pm_x', POSTMARK_FROM_EMAIL: 'from@b.co' }));
    const r = await a.send({ to: 't@b.co', subject: 'Hi', text: 'Body' });
    assertEquals(r.id, 'pm_9');
    assertEquals(calls[0].url, 'https://api.postmarkapp.com/email');
    assertEquals(calls[0].body.TextBody, 'Body');
  } finally {
    globalThis.fetch = orig;
  }
});

Deno.test('send throws on a non-2xx provider response', async () => {
  const orig = globalThis.fetch;
  globalThis.fetch = (() => Promise.resolve(new Response('bad', { status: 422 }))) as typeof fetch;
  try {
    const a = selectMailAdapter(envOf({ RESEND_API_KEY: 're_x', RESEND_FROM_EMAIL: 'from@b.co' }));
    let threw = false;
    try {
      await a.send({ to: 't@b.co', subject: 'Hi', text: 'Body' });
    } catch {
      threw = true;
    }
    assertEquals(threw, true);
  } finally {
    globalThis.fetch = orig;
  }
});
