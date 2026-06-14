import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { botGuard, readRequestMeta } from '../_shared/requestMeta.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

/**
 * Per-IP fixed-window rate check (consume_dossier_verify_rate_limit, migration
 * 035) so a well-formed-but-fake session id can't be used to amplify Stripe API
 * calls. FAILS OPEN by design: any limiter problem (missing env, RPC error,
 * throw) returns true and the request proceeds — a limiter outage must never
 * block a legitimate buyer from confirming their purchase. Returns false ONLY
 * when the RPC explicitly reports the caller is over the limit.
 */
async function withinRateLimit(req: Request): Promise<boolean> {
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceKey) {
      console.warn('[verify-single-dossier] rate limiter unavailable (SUPABASE_URL/SERVICE_ROLE_KEY unset); proceeding open');
      return true;
    }
    const admin = createClient(url, serviceKey);
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

serve(async req => {
  const headers = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers });

  const guard = botGuard(req, 'verify-single-dossier');
  if (guard.reject) return guard.reject;

  try {
    const { sessionId, checkoutToken } = await req.json();
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

    // Throttle BEFORE hitting Stripe (input validation above is free; the
    // Stripe call is the amplifiable cost). Fail-open — see withinRateLimit.
    if (!(await withinRateLimit(req))) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Too many verification attempts. Please wait a moment and try again.' }),
        { status: 429, headers: { ...headers, 'Content-Type': 'application/json' } },
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
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

    return new Response(JSON.stringify({ verified: true, sessionId: session.id }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Purchase verification failed';
    return new Response(JSON.stringify({ verified: false, error: message }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
});
