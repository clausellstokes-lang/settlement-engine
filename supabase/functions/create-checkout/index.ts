/**
 * Supabase Edge Function: create-checkout
 *
 * Creates a Stripe Checkout session for any of:
 *   - Credit packs (new schedule:  25 / 60 / 150)
 *   - Credit packs (legacy:         5 / 15 / 40)  — kept for refund/replay
 *   - Premium subscription ($5.99/mo)
 *   - Founder Lifetime ($99 one-time)
 *   - Single-dossier microtransaction ($2.99 one-time)
 *
 * Catalog and pricing live in src/config/pricing.js on the client. This
 * function maps each product key → a Stripe Price ID set in env. The
 * legacy SKUs stay listed so refund and replay links keep resolving
 * after the catalog rotates.
 *
 * Redeem codes (migration 107): an authenticated purchase may carry an
 * optional `redeemCode`. The code is resolved SERVER-SIDE via the
 * reserve_redemption RPC (guarded atomic seat claim) — the client never
 * supplies a coupon id or credit amount. free_month codes ride the session
 * as a server-attached discount (NEVER allow_promotion_codes); credits
 * codes attach nothing here — the webhook grants them when the paid
 * session completes (apply_redemption). A code that fails to reserve
 * degrades to a non-fatal `redeemNotice` in the response: a bad code must
 * never fail a paying checkout.
 *
 * Environment variables (set in Supabase dashboard):
 *   STRIPE_SECRET_KEY                 — Stripe secret key
 *   CLIENT_URL                        — Frontend origin (e.g. https://yourapp.com)
 *
 *   New schedule (active):
 *     STRIPE_PRICE_CREDITS_25         — 25-credit pack  ($4.99)
 *     STRIPE_PRICE_CREDITS_60         — 60-credit pack  ($9.99)
 *     STRIPE_PRICE_CREDITS_150        — 150-credit pack ($19.99)
 *     STRIPE_PRICE_PREMIUM            — Cartographer subscription ($5.99/mo)
 *     STRIPE_PRICE_FOUNDER_LIFETIME   — Founder Lifetime ($99 one-time)
 *     STRIPE_PRICE_SINGLE_DOSSIER     — Single-dossier microtransaction ($2.99)
 *
 *   Legacy (kept for backward compat / refunds):
 *     STRIPE_PRICE_CREDITS_5          — 5-credit pack  ($4.99)
 *     STRIPE_PRICE_CREDITS_15         — 15-credit pack ($9.99)
 *     STRIPE_PRICE_CREDITS_40         — 40-credit pack ($19.99)
 *     STRIPE_PRICE_CREDITS_10         — 10-credit pack (early beta)
 *     STRIPE_PRICE_CREDITS_50         — 50-credit pack (early beta)
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { isSessionSuperseded, deviceLabelFromRequest } from '../_shared/sessionGate.ts';
import { botGuard, readRequestMeta } from '../_shared/requestMeta.ts';
// Structured error logging for the money path (review B16 observability).
import { logError } from '../_shared/logError.ts';
// One CORS allowlist for every edge function (incl. Cloudflare Pages preview).
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
// Wave-D human verification (INERT until TURNSTILE_SECRET_KEY is set): gates the
// session-creation door against scripted checkout abuse. Key-inert — a no-op that
// returns { ok:true, enforced:false } until the owner activates it, so the money
// path is byte-identical while unconfigured. See docs/PERIMETER_RUNBOOK.md.
import { verifyTurnstile } from '../_shared/verifyTurnstile.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

const PRICE_MAP: Record<string, string> = {
  // ── Active catalog ───────────────────────────────────────────────────────
  credits_25:       Deno.env.get('STRIPE_PRICE_CREDITS_25') || '',
  credits_60:       Deno.env.get('STRIPE_PRICE_CREDITS_60') || '',
  credits_150:      Deno.env.get('STRIPE_PRICE_CREDITS_150') || '',
  premium:          Deno.env.get('STRIPE_PRICE_PREMIUM') || '',
  founder_lifetime: Deno.env.get('STRIPE_PRICE_FOUNDER_LIFETIME') || '',
  single_dossier:   Deno.env.get('STRIPE_PRICE_SINGLE_DOSSIER') || '',
  // Surveyor subscription (#16). Unset env ⇒ '' ⇒ unpurchasable (LAW 1). Signed-in
  // only (non-anonymous), subscription mode (below). Grants an ENTITLEMENT, not a tier.
  surveyor:         Deno.env.get('STRIPE_PRICE_SURVEYOR') || '',
  // ── Legacy SKUs (kept resolvable so refund + replay flows work) ──────────
  credits_5:        Deno.env.get('STRIPE_PRICE_CREDITS_5') || '',
  credits_15:       Deno.env.get('STRIPE_PRICE_CREDITS_15') || '',
  credits_40:       Deno.env.get('STRIPE_PRICE_CREDITS_40') || '',
  credits_10:       Deno.env.get('STRIPE_PRICE_CREDITS_10') || '',
  credits_50:       Deno.env.get('STRIPE_PRICE_CREDITS_50') || '',
};

const CREDIT_AMOUNTS: Record<string, number> = {
  // Active
  credits_25:  25,
  credits_60:  60,
  credits_150: 150,
  // Legacy
  credits_5:  5,
  credits_15: 15,
  credits_40: 40,
  credits_10: 10,
  credits_50: 50,
};

// Products that bill as a subscription (vs one-time payment). Everything
// else uses Stripe's payment mode. Keep this in sync with TIERS.billing
// in src/config/pricing.js.
const SUBSCRIPTION_PRODUCTS = new Set(['premium', 'surveyor']);

// Founder Lifetime is advertised as "X of 30 seats remaining". Keep in sync
// with `seatLimit` in src/config/pricing.js and FOUNDER_SEAT_CAP in
// src/lib/founderSeats.js (the pricing-page counter reads the same
// founder_seats_taken() RPC this gate does).
const FOUNDER_SEAT_LIMIT = 30;

// Server-side delivery stash (dossier_purchases, migration 122): an anonymous
// single_dossier buyer's settlement is persisted here at checkout, keyed on the
// checkout_token, so delivery survives a wiped localStorage (the webhook binds
// the Stripe session id; verify-single-dossier reads it back). Cap the stashed
// payload so a malformed/oversized settlement is rejected pre-payment rather than
// bloating the row. Coexists with the durable-rights entitlement (108) — they key
// on different anchors (checkout_token here; account+save/token-hash there).
const MAX_DOSSIER_BYTES = 512 * 1024;

/**
 * Build CORS headers from the shared allowlist (_shared/cors.ts). Fail-closed,
 * never '*' for this credentialed money endpoint; the shared list also accepts
 * the Cloudflare Pages preview origin. Advertises POST/OPTIONS.
 */
function getCorsHeaders(req?: Request) {
  return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' });
}

/** Default user-scoped client (anon key + the caller's Authorization header). */
function defaultUserClient(authHeader: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
}

/** Default service-role client (bypasses RLS for the profile read/write). */
function defaultAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

// ── Anonymous single_dossier rate limiter (backend-1) ────────────────────────
// The anon single_dossier path was the ONE anonymous edge function with no
// throttle: with the public anon key an attacker could mint unbounded real Stripe
// checkout sessions (exhausting the account's Stripe budget, blocking real buyers)
// and write up-to-512KB dossier_purchases rows per call. Every sibling anon fn
// (verify-single-dossier, send-email, ingest-events, auth-recovery) already carries
// a fail-closed limiter; this mirrors verify-single-dossier's exactly.
//
// PRIMARY: the migration-035 per-IP dossier bucket RPC — REUSED (no new migration,
// per the F4 verdict). NOTE FOR THE OWNER (migration batch): create-checkout and
// verify-single-dossier now SHARE this per-IP window (30/IP/hour); a real purchase
// spends ~2 (one checkout + one verify), so the shared budget is ample, but a
// dedicated create-checkout bucket could be minted later if the endpoints ever need
// independent budgets.
//
// FAIL-OPEN to a two-dimension in-memory backstop (per-IP AND a global per-instance
// ceiling — the dimension x-forwarded-for rotation cannot defeat) so a limiter-DB
// blip can neither remove all throttling nor block a paying customer. Same rationale
// verify-single-dossier documents.
const BACKSTOP_WINDOW_MS = 60_000;
const BACKSTOP_MAX_PER_IP = 30;      // ~1 attempt/2s per IP per instance
const BACKSTOP_MAX_GLOBAL = 120;     // ~2 attempts/s per instance across ALL IPs
const backstopHits = new Map<string, { count: number; resetAt: number }>();
let globalBackstop = { count: 0, resetAt: 0 };

function withinPerIpBackstop(ip: string): boolean {
  const now = Date.now();
  const entry = backstopHits.get(ip);
  if (!entry || now >= entry.resetAt) {
    backstopHits.set(ip, { count: 1, resetAt: now + BACKSTOP_WINDOW_MS });
    if (backstopHits.size > 10_000) {
      for (const [k, v] of backstopHits) if (now >= v.resetAt) backstopHits.delete(k);
    }
    return true;
  }
  entry.count += 1;
  return entry.count <= BACKSTOP_MAX_PER_IP;
}

function withinGlobalBackstop(): boolean {
  const now = Date.now();
  if (now >= globalBackstop.resetAt) {
    globalBackstop = { count: 1, resetAt: now + BACKSTOP_WINDOW_MS };
    return true;
  }
  globalBackstop.count += 1;
  return globalBackstop.count <= BACKSTOP_MAX_GLOBAL;
}

/** Fail-open backstop: BOTH per-IP and the global ceiling must pass. Per-IP first
 *  so an over-limit single IP does not consume global budget. Exported (with a
 *  reset) so the trust boundary can be execution-tested. */
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
 * Per-IP fixed-window rate check for the anon single_dossier path. The DB limiter
 * (consume_dossier_verify_rate_limit, migration 035) is PRIMARY; when it cannot
 * give a verdict (missing env, RPC error, throw) we fall back to the in-memory
 * backstop rather than fail fully open. Returns false when over the limit.
 */
async function withinDossierRateLimit(req: Request): Promise<boolean> {
  const ip = readRequestMeta(req).ip;
  try {
    const url = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !serviceKey) {
      console.warn('[create-checkout] rate limiter unavailable (SUPABASE_URL/SERVICE_ROLE_KEY unset); falling back to in-memory backstop');
      return withinBackstop(ip);
    }
    const admin = createClient(url, serviceKey);
    const { data, error } = await admin.rpc('consume_dossier_verify_rate_limit', { p_ip: ip });
    if (error || !data) {
      console.warn('[create-checkout] rate limiter error; falling back to in-memory backstop:', error?.message ?? 'no data');
      return withinBackstop(ip);
    }
    return data.allowed !== false;
  } catch (e) {
    console.warn('[create-checkout] rate limiter threw; falling back to in-memory backstop:', e);
    return withinBackstop(ip);
  }
}

// ── Redeem codes (migration 107) ─────────────────────────────────────────────
//
// The applies_to/mode gate now lives INSIDE reserve_redemption (migration 112): it
// refuses a mismatch BEFORE creating the once-per-user row, so a code entered in the
// wrong modal is never burned. create-checkout passes p_mode and handles the
// 'mode_mismatch' reason like any other non-fatal redeem notice.

/**
 * Hand a just-reserved seat back when the code cannot ride this checkout
 * (applies_to/mode mismatch, or Stripe refused the session after the seat was
 * taken). There is deliberately no "unreserve" RPC, so this walks the same
 * lifecycle an abandoned checkout does: bind a phantom session id (write-once)
 * then revert it (claim-once flip + guarded uses_count decrement). The
 * (code, user) row persists as 'reverted' — once-per-user-EVER, identical to
 * an expired session. Best-effort: failures log and leave the reserved row as
 * the operator's remediation surface; they never fail the checkout path.
 */
async function releaseUnusedReservation(
  // Typed against the CONCRETE client (the webhook's helper idiom): the bare
  // `ReturnType<typeof createClient>` resolves the uninstantiated generic to a
  // never-schema client whose rpc() rejects argument objects under deno check.
  admin: ReturnType<typeof defaultAdminClient>,
  userId: string,
  redemptionId: string,
): Promise<void> {
  // Never a real Stripe session id (those are `cs_…`), so the webhook's
  // apply/revert lookups can never collide with it.
  const phantomSessionId = `released:${redemptionId}`;
  try {
    const { data: bound, error: bindErr } = await admin.rpc('bind_redemption_session', {
      p_redemption_id: redemptionId,
      p_session_id: phantomSessionId,
    });
    if (bindErr || !bound?.ok) {
      throw new Error(bindErr?.message ?? `bind refused: ${bound?.reason ?? 'unknown'}`);
    }
    const { data: reverted, error: revertErr } = await admin.rpc('revert_redemption', {
      p_session_id: phantomSessionId,
    });
    if (revertErr || !reverted?.ok) {
      throw new Error(revertErr?.message ?? `revert refused: ${reverted?.reason ?? 'unknown'}`);
    }
  } catch (err) {
    logError('create-checkout', userId, err, {
      stage: 'release_unused_redemption', redemption_id: redemptionId,
    });
  }
}

// Exported (not just inlined into serve) so the money gate can be EXECUTION-
// tested: index.test.ts feeds requests with injected stubs and asserts the
// credits/product are derived server-side from PRICE_MAP/CREDIT_AMOUNTS and the
// user_id put into session.metadata comes from the verified JWT, never the
// request body. `deps` is the optional injection seam; production passes nothing.
export async function handleCreateCheckout(
  req: Request,
  deps: {
    stripeClient?: typeof stripe;
    userClient?: (authHeader: string) => ReturnType<typeof createClient>;
    adminClient?: () => ReturnType<typeof createClient>;
    rateLimit?: (req: Request) => Promise<boolean>;
  } = {},
): Promise<Response> {
  const stripeApi = deps.stripeClient ?? stripe;
  const userClient = deps.userClient ?? defaultUserClient;
  const adminClient = deps.adminClient ?? defaultAdminClient;
  const rateLimit = deps.rateLimit ?? withinDossierRateLimit;
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Tier 0.10 — obvious-bot guard. Auth gating already protects this
  // endpoint, but rejecting bots up front saves Stripe API budget +
  // keeps the function logs readable. Real users are never blocked.
  const guard = botGuard(req, 'create-checkout');
  if (guard.reject) return guard.reject;

  // Hoisted above the try so the catch can attribute a failure to the acting user
  // (when one was resolved) in the structured error log.
  let user: { id: string; email?: string | null } | null = null;

  try {
    // Parse request body first so we know whether the product requires auth.
    // saveId (optional, single_dossier only): when a SIGNED-IN buyer picks a
    // saved settlement at checkout, the durable-rights entitlement (108) binds
    // to it. It is verified for ownership below and stashed in the session
    // metadata; the webhook grants the right on the paid session.
    const { product, checkoutToken, redeemCode, saveId, settlement, savePaymentMethod, captchaToken } = await req.json();
    if (!product || !PRICE_MAP[product]) {
      throw new Error(`Invalid product: ${product}. Valid: ${Object.keys(PRICE_MAP).join(', ')}`);
    }

    // Wave-D human verification, BEFORE any Stripe call. INERT until the owner sets
    // TURNSTILE_SECRET_KEY (verifyTurnstile returns { ok:true } → this passes and the
    // path is byte-identical). When active it FAILS CLOSED: a missing/failed/expired
    // token returns the house-register error (never a stuck button — the client shows
    // the message and can retry), consistent with the money path's fail-closed
    // posture. The token is minted by the purchase surface's managed/invisible
    // CaptchaGate. Placed here so it gates every product uniformly, pre-amplification.
    const { ip: captchaIp } = readRequestMeta(req);
    const turnstile = await verifyTurnstile(
      typeof captchaToken === 'string' ? captchaToken : null,
      captchaIp,
    );
    if (!turnstile.ok) {
      return new Response(
        JSON.stringify({ error: 'We could not verify your request. Please try again.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Tier 7.4 — single-dossier is anonymous-allowed (per pricing.js
    // SINGLE_DOSSIER.requiresAccount=false). All other products bind
    // to a user_id at delivery time (credit packs, subscriptions,
    // founder seats) so they keep the auth requirement.
    const isAnonymousProduct = product === 'single_dossier';
    if (
      isAnonymousProduct
      && (typeof checkoutToken !== 'string' || checkoutToken.length < 24 || checkoutToken.length > 128)
    ) {
      throw new Error('A valid dossier checkout token is required');
    }

    // Throttle the anonymous-allowed single_dossier path BEFORE the amplifiable
    // work below (the dossier_purchases upsert and the Stripe session create). The
    // input validation above is free; the persist + Stripe call are the abuse cost.
    // Fail-open to the two-dimension in-memory backstop (see withinDossierRateLimit)
    // so a limiter-DB blip never blocks a real buyer.
    if (isAnonymousProduct && !(await rateLimit(req))) {
      return new Response(
        JSON.stringify({ error: 'Too many checkout attempts. Please wait a moment and try again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // ── Delivery stash (migration 122): persist the settlement server-side, keyed
    // on the checkout_token, BEFORE the Stripe session is created. These guards are
    // explicit early returns (NOT thrown) so the buyer sees the size/serialize error
    // pre-payment — routing them through the generic outer catch would surface only
    // "Checkout could not be started". The persist itself is best-effort: a DB
    // failure logs and falls back to the client-side stash (checkout still proceeds).
    if (isAnonymousProduct && settlement !== undefined && settlement !== null) {
      let byteSize: number;
      try {
        byteSize = new TextEncoder().encode(JSON.stringify(settlement)).length;
      } catch (_e) {
        return new Response(
          JSON.stringify({ error: 'The settlement could not be serialized for checkout.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      if (byteSize > MAX_DOSSIER_BYTES) {
        return new Response(
          JSON.stringify({ error: `This settlement is too large to purchase (limit ${MAX_DOSSIER_BYTES} bytes).` }),
          { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }
      try {
        const admin = adminClient();
        const { error: upsertErr } = await admin
          .from('dossier_purchases')
          .upsert(
            { checkout_token: checkoutToken, settlement, byte_size: byteSize },
            { onConflict: 'checkout_token' },
          );
        if (upsertErr) {
          console.warn('[create-checkout] dossier persist failed; client stash fallback:', upsertErr.message);
        }
      } catch (e) {
        console.warn('[create-checkout] dossier persist threw; client stash fallback:', e instanceof Error ? e.message : String(e));
      }
    }

    const authHeader = req.headers.get('Authorization');

    if (authHeader) {
      // If auth is provided (even for an anonymous-allowed product), try
      // to resolve the user so the purchase binds to the account when
      // possible. Failures fall through to anonymous handling.
      const supabase = userClient(authHeader);
      const { data: { user: authedUser }, error: authError } = await supabase.auth.getUser();
      if (!authError && authedUser) {
        user = { id: authedUser.id, email: authedUser.email ?? null };
        // SINGLE-SESSION GATE (161, §7.2): authed products only — the anonymous
        // single_dossier path carries no session and is intentionally ungated.
        if (await isSessionSuperseded(adminClient(), authedUser.id, authHeader, deviceLabelFromRequest(req))) {
          return new Response(JSON.stringify({ error: 'session_superseded' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      } else if (!isAnonymousProduct) {
        throw new Error('Not authenticated');
      }
    } else if (!isAnonymousProduct) {
      throw new Error('Missing authorization header');
    }

    // Founder Lifetime seat gate — the advertised "X of 30 seats" contract is
    // enforced HERE, not just displayed. founder_seats_taken() (migration 010)
    // is the same counter the pricing page renders; once the cap is reached no
    // new founder checkout session can be created. FAIL CLOSED on a counter
    // error: blocking a sale we could have made beats selling seat 31 of an
    // advertised-30 product. Two truly-concurrent checkouts at seat 29 can
    // still race past this gate — that residual is a one-off refund, not a
    // standing hole in the contract.
    if (product === 'founder_lifetime') {
      const { data: seatsTaken, error: seatErr } = await adminClient().rpc('founder_seats_taken');
      if (seatErr) throw new Error(`Founder seat check failed: ${seatErr.message}`);
      if (typeof seatsTaken !== 'number') throw new Error('Founder seat check returned no count');
      if (seatsTaken >= FOUNDER_SEAT_LIMIT) {
        throw new Error(`Founder Lifetime is sold out (${seatsTaken}/${FOUNDER_SEAT_LIMIT} seats taken)`);
      }
    }

    // ── Durable-rights save binding (108): single_dossier + signed-in only ──
    // A signed-in single_dossier buyer MAY pick one saved settlement to bind the
    // durable re-download right to. Verify server-side that the save EXISTS and
    // belongs to THIS authed user before stashing it in the metadata: a forged
    // or foreign saveId must never bind rights to someone else's save. Reject
    // with the SAME generic 400 every other checkout failure returns (never echo
    // whose save it is). A signed-in purchase with NO saveId stays valid — the
    // one-shot download semantics still apply, and the buyer can retro-claim the
    // voucher to a save later. Anonymous purchases ignore saveId entirely (the
    // durable ledger keys on the account).
    let verifiedSaveId: string | null = null;
    if (product === 'single_dossier' && user && saveId !== undefined && saveId !== null && saveId !== '') {
      if (typeof saveId !== 'string') {
        logError('create-checkout', user.id, 'non-string saveId on single_dossier checkout', { stage: 'verify_save_ownership' });
        throw new Error('Invalid save reference');
      }
      const admin = adminClient();
      const { data: save, error: saveErr } = await admin
        .from('settlements')
        .select('id, user_id')
        .eq('id', saveId)
        .maybeSingle();
      if (saveErr || !save || save.user_id !== user.id) {
        // Missing, foreign, or unreadable — never bind the right, and never
        // reveal which case it was. Fail the whole checkout (a client that
        // sent a saveId meant to bind it; silently dropping it would leave the
        // buyer paying with no durable right against the save they chose).
        logError('create-checkout', user.id, saveErr?.message ?? 'save not found or not owned', {
          stage: 'verify_save_ownership', save_id: saveId,
        });
        throw new Error('Invalid save reference');
      }
      verifiedSaveId = save.id as string;
    }

    const priceId = PRICE_MAP[product];
    if (!priceId) throw new Error(`Price ID not configured for ${product}`);

    const clientUrl = Deno.env.get('CLIENT_URL') || 'http://localhost:5173';
    let stripeCustomerId: string | null = null;

    if (user) {
      const admin = adminClient();
      const { data: profile, error: profileError } = await admin
        .from('profiles')
        .select('stripe_customer_id, banned_at, disabled_at, deleted_at')
        .eq('id', user.id)
        .single();
      if (profileError || !profile) {
        throw new Error(`Checkout profile lookup failed: ${profileError?.message ?? 'profile missing'}`);
      }
      // A still-valid JWT must not reopen billing after moderation or account
      // deletion. This service-role read happens before any Stripe customer or
      // Checkout side effect; migration 178's profile trigger is the independent
      // race backstop if deletion commits while this handler is in flight.
      if (
        !isAnonymousProduct
        && (profile.banned_at != null || profile.disabled_at != null || profile.deleted_at != null)
      ) {
        return new Response(
          JSON.stringify({ error: 'account_inactive' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        );
      }

      stripeCustomerId = typeof profile?.stripe_customer_id === 'string'
        ? profile.stripe_customer_id
        : null;

      if (!stripeCustomerId) {
        const customer = await stripeApi.customers.create({
          email: user.email || undefined,
          metadata: { supabase_user_id: user.id },
        });
        stripeCustomerId = customer.id;
        const { error: bindError } = await admin
          .from('profiles')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('id', user.id);
        if (bindError) {
          // Do not strand an external customer that the deletion worker cannot
          // discover because the profile binding lost the race.
          try {
            await stripeApi.customers.del(stripeCustomerId);
          } catch (cleanupError) {
            logError('create-checkout', user.id, cleanupError, {
              stage: 'cleanup_unbound_stripe_customer',
              stripe_customer_id: stripeCustomerId,
            });
          }
          throw new Error(`Stripe customer binding failed: ${bindError.message}`);
        }
      }
    }

    const mode = SUBSCRIPTION_PRODUCTS.has(product) ? 'subscription' : 'payment';

    // ── Redeem code (107): reserve the seat BEFORE the session exists ──────
    // reserve_redemption is the authoritative gate (guarded atomic uses_count
    // increment + the once-per-user row); validate_redeem_code was only the UX
    // echo. Redeeming requires an account — the once-per-user gate keys on
    // user_id — so an anonymous purchase ignores the code with a notice.
    // EVERY failure path here is NON-FATAL by design: a bad code must degrade
    // to a notice, never fail a paying checkout.
    let redeemNotice: string | null = null;
    let redemptionId: string | null = null;
    let redeemCoupon: string | null = null;
    if (typeof redeemCode === 'string' && redeemCode.trim() !== '') {
      if (!user) {
        redeemNotice = 'Redeem codes need a signed-in account, so this purchase continues without one.';
      } else {
        const admin = adminClient();
        // p_mode lets reserve_redemption reject an applies_to/mode mismatch BEFORE it
        // creates the once-per-user row (112) — so a code typed into the wrong modal is
        // never burned. The mismatch comes back as reason 'mode_mismatch' with no seat held.
        const { data: reservation, error: reserveErr } = await admin.rpc('reserve_redemption', {
          p_code: redeemCode.trim(),
          p_user: user.id,
          p_mode: mode,
        });
        if (reserveErr || !reservation?.ok) {
          if (reserveErr) {
            logError('create-checkout', user.id, reserveErr.message, { stage: 'reserve_redemption' });
          }
          // The RPC's reasons are already enumeration-collapsed; only the
          // caller's OWN prior redemption reads differently (truthful to the
          // one user it cannot leak to). mode_mismatch consumed NO redemption —
          // the code stays usable on the correct purchase type.
          redeemNotice = reservation?.reason === 'already_used'
            ? 'That code has already been redeemed on this account, so this purchase continues at the regular price.'
            : reservation?.reason === 'mode_mismatch'
              ? 'That code does not apply to this type of purchase, so this purchase continues at the regular price.'
              : 'That code could not be applied, so this purchase continues at the regular price.';
        } else {
          redemptionId = reservation.redemption_id as string;
          if (reservation.kind === 'free_month' && typeof reservation.stripe_coupon_id === 'string' && reservation.stripe_coupon_id) {
            redeemCoupon = reservation.stripe_coupon_id;
          }
          // kind='credits' attaches NO Stripe discount: the webhook grants
          // credit_amount once the PAID session completes (apply_redemption).
        }
      }
    }

    // Create Stripe checkout session. For anonymous purchases we omit
    // customer_email — Stripe collects it on the checkout page and
    // sends it back on session.completed via session.customer_details
    // and session.customer (which the webhook reads).
    const sessionParams: Record<string, unknown> = {
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      // For an anonymous single_dossier, echo the delivery token (dt = the
      // checkout_token) on the success URL so the returning browser can recover
      // the exact token and re-fetch its server-stashed settlement (122) even if
      // localStorage was wiped between checkout and return.
      success_url: isAnonymousProduct
        ? `${clientUrl}?checkout=success&product=${product}&session_id={CHECKOUT_SESSION_ID}&dt=${encodeURIComponent(checkoutToken)}`
        : `${clientUrl}?checkout=success&product=${product}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${clientUrl}?checkout=cancelled`,
      metadata: {
        supabase_user_id: user?.id ?? '',
        product,
        credits: String(CREDIT_AMOUNTS[product] || 0),
        anonymous: isAnonymousProduct && !user ? 'true' : 'false',
        checkout_token: isAnonymousProduct ? checkoutToken : '',
        // Durable-rights save binding (108): only ever the server-VERIFIED save
        // id for a signed-in single_dossier buyer, never a raw body value. The
        // webhook reads this to grant the entitlement.
        save_id: verifiedSaveId ?? '',
      },
    };
    if (stripeCustomerId) {
      sessionParams.customer = stripeCustomerId;
    } else if (user?.email) {
      sessionParams.customer_email = user.email;
    }
    if (mode === 'subscription' && user) {
      // The subscription survives independently of its Checkout Session. Carry
      // the verified owner onto the subscription itself so a late invoice or
      // lifecycle event remains attributable after account deletion clears the
      // profile's live Stripe ids.
      sessionParams.subscription_data = {
        metadata: {
          supabase_user_id: user.id,
          product,
        },
      };
    }
    if (redeemCoupon) {
      // Server-attached discount ONLY. NEVER allow_promotion_codes: the
      // hosted checkout page must not become a coupon-guessing surface, and
      // the webhook's zero-dollar gates (referral grant, redeem apply) assume
      // every discount on a session was placed by this line.
      sessionParams.discounts = [{ coupon: redeemCoupon }];
    }

    // AUTO-RELOAD CONSENT (§4.2 / #13): a SIGNED-IN buyer of a CREDIT PACK may opt
    // to save the card off-session so future auto-reloads can charge it. Gated
    // server-side on ALL three conditions re-derived here (never trust the body
    // flag alone to bypass them): payment mode (payment_intent_data is invalid in
    // subscription mode), a signed-in user (never anonymous), and a credit-pack
    // product (present in CREDIT_AMOUNTS). Stripe stores the payment method for
    // off_session reuse; no raw card data ever touches our code.
    const isCreditPack = Object.prototype.hasOwnProperty.call(CREDIT_AMOUNTS, product);
    if (savePaymentMethod === true && mode === 'payment' && user && isCreditPack) {
      sessionParams.payment_intent_data = { setup_future_usage: 'off_session' };
    }

    let session: { id: string; url: string | null };
    try {
      session = await stripeApi.checkout.sessions.create(sessionParams as Parameters<typeof stripe.checkout.sessions.create>[0]);
    } catch (createErr) {
      // Stripe refused the session (e.g. a deleted coupon id on the code):
      // the reserved seat must not leak — hand it back before failing.
      if (redemptionId && user) {
        await releaseUnusedReservation(adminClient(), user.id, redemptionId);
      }
      throw createErr;
    }

    if (redemptionId) {
      // Stamp the session id onto the reserved seat so the webhook can flip
      // it: apply_redemption on paid completion, revert_redemption on expiry.
      // Write-once in the RPC (a retry with the same id succeeds idempotently).
      // NON-FATAL: the session already exists and (for free_month) carries the
      // discount, so a bind failure must not kill the checkout — the
      // structured log + the unbound reserved row are the operator's
      // remediation surface.
      const { data: bound, error: bindErr } = await adminClient().rpc('bind_redemption_session', {
        p_redemption_id: redemptionId,
        p_session_id: session.id,
      });
      if (bindErr || !bound?.ok) {
        logError('create-checkout', user?.id ?? null, bindErr?.message ?? `bind refused: ${bound?.reason ?? 'unknown'}`, {
          stage: 'bind_redemption_session', redemption_id: redemptionId, session_id: session.id,
        });
      }
    }

    return new Response(
      JSON.stringify(redeemNotice ? { url: session.url, redeemNotice } : { url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    // One structured line per checkout failure so the money path is greppable.
    // The real message (which may carry Stripe/Postgres internals) is logged
    // server-side; the client only ever sees a generic string.
    logError('create-checkout', user?.id ?? null, message);
    return new Response(
      JSON.stringify({ error: 'Checkout could not be started' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
}

// Wrap in a 1-arg lambda so the handler's optional `deps` param doesn't clash with
// std/http's Handler signature (req, connInfo) — `deno check` (check:edge) flagged
// the direct `serve(handler)` as a Handler-shape mismatch. The deps default applies.
serve((req) => handleCreateCheckout(req));
