import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { botGuard, readRequestMeta } from '../_shared/requestMeta.ts';
// Structured error logging for the money path (review B16 observability).
import { logError } from '../_shared/logError.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

// In-memory per-IP backstop (review B16 #8). The primary limiter is the DB RPC
// below; when IT is unavailable (missing env, RPC error, throw) the original code
// failed FULLY OPEN, removing all throttling — so a limiter outage let an
// attacker amplify into Stripe. This static, per-instance cap survives only the
// fail-open branches: it doesn't block legitimate buyers under normal operation
// (the DB limiter is far more generous) but prevents an unbounded burst when the
// DB limiter is down. Best-effort: edge instances are ephemeral and not shared,
// so this is a coarse cap, not a precise quota.
const BACKSTOP_WINDOW_MS = 60_000;   // fixed window
const BACKSTOP_MAX_PER_WINDOW = 30;  // generous: ~1 attempt/2s per IP per instance
const backstopHits = new Map<string, { count: number; resetAt: number }>();

/** Returns true if the IP is still under the in-memory backstop cap (and records
 *  the hit). Only consulted when the DB limiter could not give a verdict. */
function withinBackstop(ip: string): boolean {
  const now = Date.now();
  const entry = backstopHits.get(ip);
  if (!entry || now >= entry.resetAt) {
    backstopHits.set(ip, { count: 1, resetAt: now + BACKSTOP_WINDOW_MS });
    // Opportunistic cleanup so the map can't grow without bound across windows.
    if (backstopHits.size > 10_000) {
      for (const [k, v] of backstopHits) if (now >= v.resetAt) backstopHits.delete(k);
    }
    return true;
  }
  entry.count += 1;
  return entry.count <= BACKSTOP_MAX_PER_WINDOW;
}

/**
 * Per-IP fixed-window rate check (consume_dossier_verify_rate_limit, migration
 * 035) so a well-formed-but-fake session id can't be used to amplify Stripe API
 * calls. The DB limiter is PRIMARY; if it cannot give a verdict (missing env, RPC
 * error, throw) we no longer fail fully open — we fall back to a cheap in-memory
 * per-IP backstop (withinBackstop) so a limiter outage can't remove ALL
 * throttling. A legitimate buyer is never blocked under normal operation. Returns
 * false when the caller is over either the DB limit or the backstop.
 */
async function withinRateLimit(req: Request): Promise<boolean> {
  const ip = readRequestMeta(req).ip;
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceKey) {
      console.warn('[verify-single-dossier] rate limiter unavailable (SUPABASE_URL/SERVICE_ROLE_KEY unset); falling back to in-memory backstop');
      return withinBackstop(ip);
    }
    const admin = createClient(url, serviceKey);
    const { data, error } = await admin.rpc('consume_dossier_verify_rate_limit', {
      p_ip: ip,
    });
    if (error || !data) {
      console.warn('[verify-single-dossier] rate limiter error; falling back to in-memory backstop:', error?.message ?? 'no data');
      return withinBackstop(ip);
    }
    return data.allowed !== false;
  } catch (e) {
    console.warn('[verify-single-dossier] rate limiter threw; falling back to in-memory backstop:', e);
    return withinBackstop(ip);
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
    // Fail closed: never emit '*'. Echo the matched origin, else pin to the
    // first allowed host (a missing Origin is treated as same-origin).
    'Access-Control-Allow-Origin': accepted ? (origin || allowed[0]) : allowed[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...(accepted ? { Vary: 'Origin' } : {}),
  };
}

// Exported (not just inlined into serve) so the trust boundary can be
// EXECUTION-tested: index.test.ts feeds forged/oversized/valid requests with a
// recording Stripe stub and asserts the input + session-metadata gate. `deps`
// is an optional injection seam for the test; production passes nothing, so
// behavior is identical to the previous inline handler.
export async function handleVerifyDossier(
  req: Request,
  deps: { stripeClient?: typeof stripe; rateLimit?: (req: Request) => Promise<boolean> } = {},
): Promise<Response> {
  const stripeApi = deps.stripeClient ?? stripe;
  const rateLimit = deps.rateLimit ?? withinRateLimit;
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
    if (!(await rateLimit(req))) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Too many verification attempts. Please wait a moment and try again.' }),
        { status: 429, headers: { ...headers, 'Content-Type': 'application/json' } },
      );
    }

    const session = await stripeApi.checkout.sessions.retrieve(sessionId);
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
    // One structured line per verification failure. This endpoint is anonymous-
    // allowed (single-dossier microtransaction), so there is no user id to attribute.
    logError('verify-single-dossier', null, message);
    return new Response(JSON.stringify({ verified: false, error: message }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
}

// Wrap in a 1-arg lambda so the handler's optional `deps` param doesn't clash with
// std/http's Handler signature (req, connInfo) — `deno check` (check:edge) flagged
// the direct `serve(handler)` as a Handler-shape mismatch. The deps default applies.
serve((req) => handleVerifyDossier(req));
