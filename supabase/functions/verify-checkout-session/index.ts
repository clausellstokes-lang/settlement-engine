/**
 * Supabase Edge Function: verify-checkout-session
 *
 * Server-side confirmation that a Stripe Checkout session genuinely belongs to
 * the AUTHENTICATED caller and is paid. This is the trust anchor for the
 * post-checkout reconciliation flow (finding F23): the browser must never
 * declare "Credits added!" / "Cartographer activated!" from the spoofable
 * `?checkout=success` URL param alone. The client calls this first, then polls
 * the actual entitlement (credit balance / profile tier) until it lands.
 *
 * Mirrors verify-single-dossier, but for the ACCOUNT-BOUND products
 * (credit packs, premium, founder) — so the check here is
 * `metadata.supabase_user_id === caller's JWT user id`, not a dossier token.
 *
 * Contract:
 *   POST { sessionId }  (Authorization: Bearer <supabase JWT> required)
 *   200 { verified:true,  product, status }         — paid + belongs to caller
 *   200 { verified:false, product, status }         — genuine session, not paid
 *   400 — malformed request (terminal)
 *   401 — missing/invalid auth (terminal)
 *   403 — the session belongs to a DIFFERENT user (terminal)
 *   429 — rate limited (transient; the client may retry — classifyInvokeError
 *         already marks 429 transient, same as 503)
 *   503 — Stripe unreachable (transient; the client may retry)
 *
 * Environment variables:
 *   STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_ANON_KEY
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard, readRequestMeta } from '../_shared/requestMeta.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
// Per-user + per-IP fixed-window limiter (shared ingest_check_rate idiom, no new
// migration). This was the last money endpoint with no server-side rate limit
// (CYCLE-3 Wave 8 item M23): JWT auth + botGuard alone still let a compromised
// token (or a script with a real login) amplify unbounded Stripe
// checkout.sessions.retrieve calls.
import { checkUserIpRate } from '../_shared/rateLimit.ts';

const defaultStripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

// CORS: fail-closed via the shared allowlist (_shared/cors.ts). This replaces the
// legacy inline allowlist whose missing-Origin fallback emitted a wildcard ACAO —
// the exact leak the shared module exists to kill, and the last per-function copy
// still carrying it (round-1 backend-5 / backend-functions-2). The shared module
// never emits a wildcard: it pins a disallowed/missing origin to the first allowed
// host and adds Allow-Credentials, matching every sibling.
function corsHeaders(req: Request) {
  return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' });
}

/** Resolve the caller's user id from the Authorization header (server-verified). */
async function resolveUser(req: Request): Promise<{ id: string } | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return null;
  const url = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!url || !anonKey) return null;
  const supabase = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { id: user.id };
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

/**
 * Per-user + per-IP fixed-window rate check (ingest_check_rate, migration 036,
 * via _shared/rateLimit.ts — the create-customer-portal idiom, function-scoped
 * 'vcs' prefix so buckets never collide with ingest-events' bare keys or ccp's).
 * Keyed PER-USER first because this endpoint requires a JWT: the caller identity
 * is verified, so the user dimension — unlike x-forwarded-for — cannot be rotated.
 *
 * Bounds by analogy to the closest siblings: verify-single-dossier's DB limiter
 * budgets 30 verify attempts/IP/hour for the same retrieve-a-session semantics,
 * so the per-USER ceiling here is 30/hour (a legit buyer spends 1–3: one verify
 * plus a 503 retry or two); the per-IP ceiling is 3x that (90/hour), the same
 * user→IP multiplier create-customer-portal uses (20→60).
 *
 * FAIL-CLOSED (the shared module's contract, mirroring create-customer-portal /
 * ingest-events): missing env, RPC error, or a thrown transport error returns
 * false → 429. This deliberately DIVERGES from verify-single-dossier's
 * fail-open in-memory backstop: that endpoint is the ANONYMOUS post-payment PDF
 * door, where a limiter blip must never trap a paid buyer's only delivery path.
 * Here the caller is authed and this response is only the confirmation UX — the
 * client independently polls the actual entitlement (credit balance / profile
 * tier, granted by the webhook), and classifyInvokeError already treats 429 as
 * transient, so a limiter outage delays a banner, never a purchase.
 */
async function withinRateLimit(req: Request, userId: string): Promise<boolean> {
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceKey) {
      console.warn('[verify-checkout-session] rate limiter unavailable (SUPABASE_URL/SERVICE_ROLE_KEY unset); failing closed');
      return false;
    }
    const admin = createClient(url, serviceKey);
    return await checkUserIpRate(admin, {
      prefix: 'vcs',
      userId,
      ip: readRequestMeta(req).ip,
      userMax: 30,
      userWindowSeconds: 3600,
      ipMax: 90,
      ipWindowSeconds: 3600,
    });
  } catch (e) {
    console.warn('[verify-checkout-session] rate limiter threw; failing closed:', e);
    return false;
  }
}

/**
 * Exported for the Deno execution test. `deps.stripe` / `deps.resolveUser` are
 * injection seams; production calls pass nothing.
 */
export async function handleVerifyCheckoutSession(
  req: Request,
  deps: {
    stripe?: Stripe;
    resolveUser?: (req: Request) => Promise<{ id: string } | null>;
    rateLimit?: (req: Request, userId: string) => Promise<boolean>;
  } = {},
): Promise<Response> {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers });

  const guard = botGuard(req, 'verify-checkout-session');
  if (guard.reject) return guard.reject;

  const stripe = deps.stripe ?? defaultStripe;
  const getUser = deps.resolveUser ?? resolveUser;
  const rateLimit = deps.rateLimit ?? withinRateLimit;

  // Auth is required: this endpoint only confirms sessions for the caller.
  const user = await getUser(req);
  if (!user) return json({ verified: false, error: 'Not authenticated' }, 401, headers);

  let sessionId: string;
  try {
    const body = await req.json();
    sessionId = body.sessionId;
    if (typeof sessionId !== 'string' || sessionId.length > 200
      || !/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(sessionId)) {
      throw new Error('Invalid checkout session');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Verification failed';
    return json({ verified: false, error: message }, 400, headers);
  }

  // Throttle BEFORE hitting Stripe (auth + input validation above are free; the
  // Stripe retrieve is the amplifiable cost). Placed AFTER auth so the key is the
  // JWT-verified user id — an unauthenticated caller is 401'd without ever
  // touching (or burning) anyone's rate budget — and AFTER validation so garbage
  // requests don't consume it either. Fail-closed; see withinRateLimit.
  if (!(await rateLimit(req, user.id))) {
    return json({ verified: false, error: 'Too many verification attempts. Please wait a moment and try again.' }, 429, headers);
  }

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.warn('[verify-checkout-session] Stripe retrieve failed:', (error as Error)?.message ?? 'unknown');
    return json({ verified: false, error: 'Could not reach the payment processor. Please try again in a moment.' }, 503, headers);
  }

  const product = session.metadata?.product ?? null;
  const status = session.payment_status ?? session.status ?? 'unknown';
  const owner = session.metadata?.supabase_user_id ?? '';

  // The session must belong to the caller. A genuine session for a DIFFERENT
  // user is a terminal 403 — never confirm someone else's purchase.
  if (owner && owner !== user.id) {
    return json({ verified: false, product, status, error: 'This checkout session belongs to a different account.' }, 403, headers);
  }
  // A session with no bound user (shouldn't happen for account products) is also
  // rejected — we can't attribute it to the caller.
  if (!owner) {
    return json({ verified: false, product, status, error: 'This checkout session is not bound to an account.' }, 403, headers);
  }

  const paid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
  const verified = session.status === 'complete' && paid;

  return json({ verified, product, status }, 200, headers);
}

if (import.meta.main) {
  serve((req) => handleVerifyCheckoutSession(req));
}
