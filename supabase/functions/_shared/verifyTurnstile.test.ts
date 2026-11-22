/**
 * verifyTurnstile.test.ts — pins the INERT-by-default contract + the fail-closed
 * enforcement of the server-side Turnstile helper (Wave-D perimeter item 7).
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`).
 * `fetchImpl` is injected so no network is touched. The load-bearing property is
 * the FIRST test: with no secret configured the helper is inert (ok:true,
 * enforced:false) and never even calls fetch — so wiring it into an edge function
 * changes nothing until the owner sets TURNSTILE_SECRET_KEY.
 */
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { verifyTurnstile } from './verifyTurnstile.ts';

const okFetch = (success: boolean): typeof fetch =>
  (() => Promise.resolve(new Response(JSON.stringify({ success }), { status: 200 }))) as typeof fetch;
const throwFetch: typeof fetch = (() => Promise.reject(new Error('network down'))) as typeof fetch;

Deno.test('INERT when no secret is configured: ok:true, enforced:false, fetch never called', async () => {
  Deno.env.delete('TURNSTILE_SECRET_KEY');
  let called = false;
  const spyFetch: typeof fetch = (() => { called = true; return Promise.resolve(new Response('{}')); }) as typeof fetch;
  const r = await verifyTurnstile('any-token', '1.2.3.4', spyFetch);
  assertEquals(r, { ok: true, enforced: false, reason: 'unconfigured' });
  assertEquals(called, false); // no siteverify call while inert
});

Deno.test('with a secret + valid token: ok:true, enforced:true', async () => {
  Deno.env.set('TURNSTILE_SECRET_KEY', 'sk_test');
  try {
    const r = await verifyTurnstile('good-token', '1.2.3.4', okFetch(true));
    assertEquals(r.ok, true);
    assertEquals(r.enforced, true);
  } finally {
    Deno.env.delete('TURNSTILE_SECRET_KEY');
  }
});

Deno.test('with a secret + missing token: FAIL CLOSED (ok:false, missing_token)', async () => {
  Deno.env.set('TURNSTILE_SECRET_KEY', 'sk_test');
  try {
    const r = await verifyTurnstile(null, null, okFetch(true));
    assertEquals(r, { ok: false, enforced: true, reason: 'missing_token' });
  } finally {
    Deno.env.delete('TURNSTILE_SECRET_KEY');
  }
});

Deno.test('with a secret + failed verification: FAIL CLOSED (ok:false, verify_failed)', async () => {
  Deno.env.set('TURNSTILE_SECRET_KEY', 'sk_test');
  try {
    const r = await verifyTurnstile('bad-token', null, okFetch(false));
    assertEquals(r, { ok: false, enforced: true, reason: 'verify_failed' });
  } finally {
    Deno.env.delete('TURNSTILE_SECRET_KEY');
  }
});

Deno.test('with a secret + transport error: FAIL CLOSED (ok:false, verify_error)', async () => {
  Deno.env.set('TURNSTILE_SECRET_KEY', 'sk_test');
  try {
    const r = await verifyTurnstile('token', null, throwFetch);
    assertEquals(r, { ok: false, enforced: true, reason: 'verify_error' });
  } finally {
    Deno.env.delete('TURNSTILE_SECRET_KEY');
  }
});
