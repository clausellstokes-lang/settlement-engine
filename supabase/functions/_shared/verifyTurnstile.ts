/**
 * supabase/functions/_shared/verifyTurnstile.ts — server-side Cloudflare
 * Turnstile verification for the CUSTOM edge endpoints (checkout-session
 * creation) that Supabase Auth's NATIVE captcha support does not reach.
 *
 * INERT BY DEFAULT. When `TURNSTILE_SECRET_KEY` is unset (the flag-off / pre-key
 * state), this returns { ok: true, enforced: false } — so wiring it into an edge
 * function changes NO behavior for anyone until the owner activates it. The
 * paid-surface law holds: legitimate flows are byte-identical while inert.
 *
 * When a secret IS configured it POSTs the token to Cloudflare's siteverify and
 * FAILS CLOSED (ok:false) on a missing token, a failed verification, or a
 * transport error — matching the fail-closed posture of the money paths. The
 * caller decides the response (a 4xx with the house-register error idiom; never
 * a dead-end — see docs/PERIMETER_RUNBOOK.md).
 *
 * No runtime dependency and nothing bundled: this is a plain fetch to
 * https://challenges.cloudflare.com/turnstile/v0/siteverify (edge functions are
 * not CSP-bound; the CLIENT widget's script-src/frame-src CSP allowance is a
 * documented activation step, not shipped while inert).
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export type TurnstileResult = {
  /** true = allowed to proceed (either not enforced, or verified). */
  ok: boolean;
  /** true only when a secret key is configured (i.e. the seam is active). */
  enforced: boolean;
  /** a short machine reason for logs (never shown to the user verbatim). */
  reason?: string;
};

function readSecret(): string {
  // deno-lint-ignore no-explicit-any
  const deno = (globalThis as any).Deno;
  return (deno && typeof deno.env?.get === 'function' && deno.env.get('TURNSTILE_SECRET_KEY')) || '';
}

/**
 * Verify a Turnstile token. INERT (ok:true, enforced:false) until
 * TURNSTILE_SECRET_KEY is set. `fetchImpl` is an injection seam for tests.
 */
export async function verifyTurnstile(
  token: string | null | undefined,
  remoteIp?: string | null,
  fetchImpl: typeof fetch = fetch,
): Promise<TurnstileResult> {
  const secret = readSecret();
  if (!secret) return { ok: true, enforced: false, reason: 'unconfigured' }; // INERT

  if (!token) return { ok: false, enforced: true, reason: 'missing_token' };

  try {
    const form = new URLSearchParams();
    form.set('secret', secret);
    form.set('response', token);
    if (remoteIp && remoteIp !== '0.0.0.0') form.set('remoteip', remoteIp);
    const res = await fetchImpl(SITEVERIFY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: form,
    });
    const data = (await res.json().catch(() => ({}))) as { success?: boolean };
    return data?.success === true
      ? { ok: true, enforced: true }
      : { ok: false, enforced: true, reason: 'verify_failed' };
  } catch {
    // Transport error while enforcing: fail closed to avoid opening a hole.
    return { ok: false, enforced: true, reason: 'verify_error' };
  }
}
