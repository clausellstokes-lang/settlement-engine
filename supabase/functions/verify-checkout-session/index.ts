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
 *   503 — Stripe unreachable (transient; the client may retry)
 *
 * Environment variables:
 *   STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_ANON_KEY
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { botGuard } from '../_shared/requestMeta.ts';

const defaultStripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

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
 * Exported for the Deno execution test. `deps.stripe` / `deps.resolveUser` are
 * injection seams; production calls pass nothing.
 */
export async function handleVerifyCheckoutSession(
  req: Request,
  deps: { stripe?: Stripe; resolveUser?: (req: Request) => Promise<{ id: string } | null> } = {},
): Promise<Response> {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers });

  const guard = botGuard(req, 'verify-checkout-session');
  if (guard.reject) return guard.reject;

  const stripe = deps.stripe ?? defaultStripe;
  const getUser = deps.resolveUser ?? resolveUser;

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
