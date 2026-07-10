import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard, readRequestMeta } from '../_shared/requestMeta.ts';
// Structured error logging for the money path (review B16 observability).
import { logError } from '../_shared/logError.ts';
// One CORS allowlist for every edge function (incl. Cloudflare Pages preview).
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

// Constant-time comparison for the checkout token. A plain `===` short-circuits on
// the first differing byte, leaking a comparison-timing side channel that could let
// an attacker recover the token (and claim someone's paid dossier) character by
// character. Both sides are SHA-256'd to a fixed 32-byte digest first (so input
// length can't leak either), then XOR-accumulated over the whole digest.
async function timingSafeEqualStr(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [da, db] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  const va = new Uint8Array(da);
  const vb = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

// In-memory backstop (review B16 #8, hardened). The primary limiter is the DB RPC
// below; when IT is unavailable (missing env, RPC error, throw) the original code
// failed FULLY OPEN. A first patch added a PER-IP in-memory cap — but the IP comes
// from x-forwarded-for (spoofable, see readRequestMeta), so an attacker rotating
// XFF got a FRESH per-IP bucket every request and could still amplify into Stripe
// unbounded. The backstop therefore now has TWO dimensions and BOTH must pass:
//   1. per-IP — fairness between honest callers.
//   2. GLOBAL — one IP-INDEPENDENT per-instance ceiling. This is the dimension XFF
//      rotation cannot defeat: a spoofed IP gets a fresh per-IP bucket, but every
//      per-IP-allowed attempt still counts against the single global ceiling, so a
//      limiter outage can no longer be amplified past a bounded per-instance rate.
// Only consulted on the fail-open branches; under normal operation the DB limiter
// is authoritative. Best-effort: edge instances are ephemeral and not shared, so
// these are coarse caps, not precise quotas. Failing fully closed here was rejected
// deliberately: it would deny a paying customer their already-purchased dossier
// during a transient limiter-DB blip. The global ceiling bounds abuse cost while
// keeping legitimate verification available.
const BACKSTOP_WINDOW_MS = 60_000;   // fixed window (both dimensions)
const BACKSTOP_MAX_PER_IP = 30;      // ~1 attempt/2s per IP per instance
const BACKSTOP_MAX_GLOBAL = 120;     // ~2 attempts/s per instance across ALL IPs
const backstopHits = new Map<string, { count: number; resetAt: number }>();
let globalBackstop = { count: 0, resetAt: 0 };

/** Per-IP fixed-window check (records the hit). Fairness between honest callers. */
function withinPerIpBackstop(ip: string): boolean {
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
  return entry.count <= BACKSTOP_MAX_PER_IP;
}

/** IP-INDEPENDENT per-instance ceiling (records the hit). The dimension that
 *  defeats x-forwarded-for rotation — a spoofed IP cannot mint fresh global
 *  budget. */
function withinGlobalBackstop(): boolean {
  const now = Date.now();
  if (now >= globalBackstop.resetAt) {
    globalBackstop = { count: 1, resetAt: now + BACKSTOP_WINDOW_MS };
    return true;
  }
  globalBackstop.count += 1;
  return globalBackstop.count <= BACKSTOP_MAX_GLOBAL;
}

/**
 * Fail-open backstop: BOTH the per-IP and the global ceiling must pass. Per-IP is
 * consulted FIRST so an over-limit single IP does not consume global budget (only
 * per-IP-allowed attempts count toward the global ceiling). Exported (with a reset)
 * so the trust boundary can be EXECUTION-tested — the XFF-rotation case in
 * index.test.ts drives 200 distinct IPs through here and asserts the global ceiling
 * still throttles once BACKSTOP_MAX_GLOBAL is reached.
 */
export function withinBackstop(ip: string): boolean {
  if (!withinPerIpBackstop(ip)) return false;
  return withinGlobalBackstop();
}

/** Test-only: reset the in-memory backstop windows between cases. */
export function _resetBackstopsForTest(): void {
  backstopHits.clear();
  globalBackstop = { count: 0, resetAt: 0 };
}

/**
 * Per-IP fixed-window rate check (consume_dossier_verify_rate_limit, migration
 * 035) so a well-formed-but-fake session id can't be used to amplify Stripe API
 * calls. The DB limiter is PRIMARY; if it cannot give a verdict (missing env, RPC
 * error, throw) we no longer fail fully open — we fall back to the in-memory
 * backstop (withinBackstop: per-IP AND a global per-instance ceiling), so a limiter
 * outage can neither remove ALL throttling nor be bypassed by x-forwarded-for
 * rotation. A legitimate buyer is never blocked under normal operation. Returns
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

// CORS: fail-closed via the shared allowlist (_shared/cors.ts). Never '*'; the
// shared list also accepts the Cloudflare Pages preview origin. Advertises
// POST/OPTIONS.
function corsHeaders(req: Request) {
  return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' });
}

// Service-role client for the delivery stash (dossier_purchases, migration 122):
// read the server-stashed settlement back so delivery survives a wiped client
// localStorage, and stamp the claim. Returns null when the service env is unset —
// the caller then returns settlement:null and the client falls back to its own
// stash, so a missing service key never blocks a verified purchase.
function defaultAdminClient(): ReturnType<typeof createClient> | null {
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

// Exported (not just inlined into serve) so the trust boundary can be
// EXECUTION-tested: index.test.ts feeds forged/oversized/valid requests with a
// recording Stripe stub and asserts the input + session-metadata gate. `deps`
// is an optional injection seam for the test; production passes nothing, so
// behavior is identical to the previous inline handler.
export async function handleVerifyDossier(
  req: Request,
  deps: {
    stripeClient?: typeof stripe;
    rateLimit?: (req: Request) => Promise<boolean>;
    // Service-role seam for the delivery-stash read (122). Production passes
    // nothing → defaultAdminClient (null when the service env is unset).
    adminClient?: () => ReturnType<typeof createClient> | null;
  } = {},
): Promise<Response> {
  const stripeApi = deps.stripeClient ?? stripe;
  const rateLimit = deps.rateLimit ?? withinRateLimit;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
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
    // Stripe call is the amplifiable cost). Fail-open to the two-dimension
    // in-memory backstop — see withinRateLimit / withinBackstop.
    if (!(await rateLimit(req))) {
      return new Response(
        JSON.stringify({ verified: false, error: 'Too many verification attempts. Please wait a moment and try again.' }),
        { status: 429, headers: { ...headers, 'Content-Type': 'application/json' } },
      );
    }

    const session = await stripeApi.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
    const tokenMatches = await timingSafeEqualStr(
      typeof session.metadata?.checkout_token === 'string' ? session.metadata.checkout_token : '',
      checkoutToken,
    );
    const verified = session.status === 'complete'
      && paid
      && session.metadata?.product === 'single_dossier'
      && tokenMatches;

    if (!verified) {
      return new Response(JSON.stringify({ verified: false, error: 'Purchase not verified' }), {
        status: 403,
        headers: { ...headers, 'Content-Type': 'application/json' },
      });
    }

    // DELIVERY STASH (122): read back the server-stashed settlement so delivery
    // survives a wiped client localStorage, and stamp the claim. Keyed on the
    // session's checkout_token — already proven equal to the caller's token by the
    // verified gate above. Best-effort + additive: on any miss/error we return
    // settlement:null and the client falls back to its own stash.
    let settlement: unknown = null;
    const admin = makeAdminClient();
    if (admin) {
      try {
        const token = typeof session.metadata?.checkout_token === 'string' ? session.metadata.checkout_token : '';
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
        console.warn('[verify-single-dossier] dossier lookup failed; client stash fallback:', e instanceof Error ? e.message : String(e));
      }
    }

    return new Response(JSON.stringify({ verified: true, sessionId: session.id, settlement }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Purchase verification failed';
    // One structured line per verification failure. This endpoint is anonymous-
    // allowed (single-dossier microtransaction), so there is no user id to attribute.
    // The real message (which may carry Stripe internals) is logged server-side;
    // the client only ever sees a generic string.
    logError('verify-single-dossier', null, message);
    return new Response(JSON.stringify({ verified: false, error: 'Verification failed' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
}

// Wrap in a 1-arg lambda so the handler's optional `deps` param doesn't clash with
// std/http's Handler signature (req, connInfo) — `deno check` (check:edge) flagged
// the direct `serve(handler)` as a Handler-shape mismatch. The deps default applies.
serve((req) => handleVerifyDossier(req));
