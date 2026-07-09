import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { botGuard, readRequestMeta } from '../_shared/requestMeta.ts';

const defaultStripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

function adminClient() {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

/**
 * Per-IP fixed-window rate check (consume_dossier_verify_rate_limit, migration
 * 035) so a well-formed-but-fake session id can't be used to amplify Stripe API
 * calls. FAILS OPEN by design: any limiter problem (missing env, RPC error,
 * throw) returns true and the request proceeds — a limiter outage must never
 * block a legitimate buyer from confirming their purchase. Returns false ONLY
 * when the RPC explicitly reports the caller is over the limit.
 */
async function withinRateLimit(req: Request, admin: ReturnType<typeof adminClient>): Promise<boolean> {
  try {
    if (!admin) {
      console.warn('[verify-single-dossier] rate limiter unavailable (SUPABASE_URL/SERVICE_ROLE_KEY unset); proceeding open');
      return true;
    }
    const { data, error } = await admin.rpc('consume_dossier_verify_rate_limit', {
      p_ip: readRequestMeta(req).ip,
    });
    if (error || !data) {
      console.warn('[verify-single-dossier] rate limiter error; proceeding open:', error?.message ?? 'no data');
      return true;
    }
    return data.allowed !== false;
  } catch (e) {
    console.warn('[verify-single-dossier] rate limiter threw; proceeding open:', e);
    return true;
  }
}

function corsHeaders(req: Request) {
  const configured = Deno.env.get('CLIENT_URL') || '';
  const allowed = [
    configured,
    'https://settlementforge.com',
    'https://www.settlementforge.com',
    'https://settlementwork.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);
  const origin = req.headers.get('Origin') || '';
  const accepted = !origin || allowed.includes(origin);
  return {
    'Access-Control-Allow-Origin': accepted ? (origin || '*') : allowed[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...(accepted ? { Vary: 'Origin' } : {}),
  };
}

/**
 * Exported for the Deno execution test. `deps.stripe` / `deps.adminClient` are
 * injection seams; production calls pass nothing.
 *
 * Response-code contract (so the client can offer retry vs. support):
 *   200 { verified:true, sessionId, settlement }  — paid; settlement is the
 *        server-persisted dossier, or null when the row is missing (client falls
 *        back to its local stash).
 *   400 — malformed request (terminal; not retryable as-is).
 *   403 — a genuine Stripe session that is NOT a paid single_dossier for this
 *        token (terminal mismatch; show the support card).
 *   429 — rate limited (transient; retry after a beat).
 *   503 — Stripe (or an upstream dependency) is unreachable (transient; retry).
 */
export async function handleVerifySingleDossier(
  req: Request,
  deps: { stripe?: Stripe; adminClient?: () => ReturnType<typeof adminClient> } = {},
): Promise<Response> {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers });

  const guard = botGuard(req, 'verify-single-dossier');
  if (guard.reject) return guard.reject;

  const stripe = deps.stripe ?? defaultStripe;
  const admin = (deps.adminClient ?? adminClient)();

  let sessionId: string;
  let checkoutToken: string;
  try {
    const body = await req.json();
    sessionId = body.sessionId;
    checkoutToken = body.checkoutToken;
    // Bound the length before the charset check: a real Stripe checkout session
    // id is well under 100 chars, so cap generously. Without this the
    // `[A-Za-z0-9]+` pattern would accept a multi-megabyte string and still
    // forward it to Stripe — cheap to reject here, wasteful to send.
    if (typeof sessionId !== 'string' || sessionId.length > 200
      || !/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(sessionId)) {
      throw new Error('Invalid checkout session');
    }
    if (typeof checkoutToken !== 'string' || checkoutToken.length < 24 || checkoutToken.length > 128) {
      throw new Error('Invalid checkout token');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Purchase verification failed';
    return new Response(JSON.stringify({ verified: false, error: message }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  // Throttle BEFORE hitting Stripe (input validation above is free; the
  // Stripe call is the amplifiable cost). Fail-open — see withinRateLimit.
  if (!(await withinRateLimit(req, admin))) {
    return new Response(
      JSON.stringify({ verified: false, error: 'Too many verification attempts. Please wait a moment and try again.' }),
      { status: 429, headers: { ...headers, 'Content-Type': 'application/json' } },
    );
  }

  // Stripe retrieval is the transient-failure boundary: a network blip or a 5xx
  // from Stripe must surface as 503 (retryable), not a terminal 403/400.
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.warn('[verify-single-dossier] Stripe retrieve failed:', (error as Error)?.message ?? 'unknown');
    return new Response(
      JSON.stringify({ verified: false, error: 'Could not reach the payment processor. Please try again in a moment.' }),
      { status: 503, headers: { ...headers, 'Content-Type': 'application/json' } },
    );
  }

  const paid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
  const verified = session.status === 'complete'
    && paid
    && session.metadata?.product === 'single_dossier'
    && session.metadata?.checkout_token === checkoutToken;

  if (!verified) {
    return new Response(JSON.stringify({ verified: false, error: 'Purchase not verified' }), {
      status: 403,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  // Verified paid. Hand back the server-persisted settlement (findings
  // F21/F23) and stamp the claim. A missing row (e.g. persistence hiccuped at
  // checkout, or an old client that never sent one) returns settlement:null and
  // the client falls back to its local stash. DB failures here are non-fatal:
  // the purchase is already verified, so we still return verified:true.
  let settlement: unknown = null;
  if (admin) {
    try {
      const token = session.metadata?.checkout_token;
      const { data: row } = await admin
        .from('dossier_purchases')
        .select('settlement')
        .eq('checkout_token', token)
        .maybeSingle();
      settlement = row?.settlement ?? null;
      if (row) {
        await admin
          .from('dossier_purchases')
          .update({ claimed_at: new Date().toISOString() })
          .eq('checkout_token', token);
      }
    } catch (e) {
      console.warn('[verify-single-dossier] dossier lookup failed; client stash will be the fallback:', (e as Error)?.message ?? 'unknown');
    }
  }

  return new Response(JSON.stringify({ verified: true, sessionId: session.id, settlement }), {
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

if (import.meta.main) {
  serve((req) => handleVerifySingleDossier(req));
}
