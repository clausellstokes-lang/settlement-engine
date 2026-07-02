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
import { botGuard } from '../_shared/requestMeta.ts';
// Structured error logging for the money path (review B16 observability).
import { logError } from '../_shared/logError.ts';
// One CORS allowlist for every edge function (incl. Cloudflare Pages preview).
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

const PRICE_MAP: Record<string, string> = {
  // ── Active catalog ───────────────────────────────────────────────────────
  credits_25:       Deno.env.get('STRIPE_PRICE_CREDITS_25') || '',
  credits_60:       Deno.env.get('STRIPE_PRICE_CREDITS_60') || '',
  credits_150:      Deno.env.get('STRIPE_PRICE_CREDITS_150') || '',
  premium:          Deno.env.get('STRIPE_PRICE_PREMIUM') || '',
  founder_lifetime: Deno.env.get('STRIPE_PRICE_FOUNDER_LIFETIME') || '',
  single_dossier:   Deno.env.get('STRIPE_PRICE_SINGLE_DOSSIER') || '',
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
const SUBSCRIPTION_PRODUCTS = new Set(['premium']);

// Founder Lifetime is advertised as "X of 30 seats remaining". Keep in sync
// with `seatLimit` in src/config/pricing.js and FOUNDER_SEAT_CAP in
// src/lib/founderSeats.js (the pricing-page counter reads the same
// founder_seats_taken() RPC this gate does).
const FOUNDER_SEAT_LIMIT = 30;

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

// ── Redeem codes (migration 107) ─────────────────────────────────────────────

/**
 * applies_to → Stripe session mode compatibility. 'subscription' codes ride
 * only subscription-mode sessions, 'one_time' only payment-mode; 'any' rides
 * both. Enforced HERE, before session create, because reserve_redemption
 * cannot see the purchase — and a mis-scoped 100%-off free_month coupon
 * attached to the wrong mode would zero a purchase (founder seat, credit
 * pack) it was never minted for.
 */
function redeemAppliesToMode(appliesTo: unknown, mode: 'subscription' | 'payment'): boolean {
  if (appliesTo === 'subscription') return mode === 'subscription';
  if (appliesTo === 'one_time') return mode === 'payment';
  return true; // 'any' (the column default)
}

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
  } = {},
): Promise<Response> {
  const stripeApi = deps.stripeClient ?? stripe;
  const userClient = deps.userClient ?? defaultUserClient;
  const adminClient = deps.adminClient ?? defaultAdminClient;
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
    const { product, checkoutToken, redeemCode } = await req.json();
    if (!product || !PRICE_MAP[product]) {
      throw new Error(`Invalid product: ${product}. Valid: ${Object.keys(PRICE_MAP).join(', ')}`);
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

    const authHeader = req.headers.get('Authorization');

    if (authHeader) {
      // If auth is provided (even for an anonymous-allowed product), try
      // to resolve the user so the purchase binds to the account when
      // possible. Failures fall through to anonymous handling.
      const supabase = userClient(authHeader);
      const { data: { user: authedUser }, error: authError } = await supabase.auth.getUser();
      if (!authError && authedUser) {
        user = { id: authedUser.id, email: authedUser.email ?? null };
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

    const priceId = PRICE_MAP[product];
    if (!priceId) throw new Error(`Price ID not configured for ${product}`);

    const clientUrl = Deno.env.get('CLIENT_URL') || 'http://localhost:5173';
    let stripeCustomerId: string | null = null;

    if (user) {
      const admin = adminClient();
      const { data: profile } = await admin
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

      stripeCustomerId = typeof profile?.stripe_customer_id === 'string'
        ? profile.stripe_customer_id
        : null;

      if (!stripeCustomerId) {
        const customer = await stripeApi.customers.create({
          email: user.email || undefined,
          metadata: { supabase_user_id: user.id },
        });
        stripeCustomerId = customer.id;
        await admin
          .from('profiles')
          .update({ stripe_customer_id: stripeCustomerId })
          .eq('id', user.id);
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
        const { data: reservation, error: reserveErr } = await admin.rpc('reserve_redemption', {
          p_code: redeemCode.trim(),
          p_user: user.id,
        });
        if (reserveErr || !reservation?.ok) {
          if (reserveErr) {
            logError('create-checkout', user.id, reserveErr.message, { stage: 'reserve_redemption' });
          }
          // The RPC's reasons are already enumeration-collapsed; only the
          // caller's OWN prior redemption reads differently (truthful to the
          // one user it cannot leak to).
          redeemNotice = reservation?.reason === 'already_used'
            ? 'That code has already been redeemed on this account, so this purchase continues at the regular price.'
            : 'That code could not be applied, so this purchase continues at the regular price.';
        } else if (!redeemAppliesToMode(reservation.applies_to, mode)) {
          // applies_to gate (red-team): the seat is already held, so hand it
          // back through the same lifecycle an expired checkout uses.
          await releaseUnusedReservation(admin, user.id, reservation.redemption_id as string);
          redeemNotice = 'That code does not apply to this type of purchase, so this purchase continues at the regular price.';
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
      success_url: `${clientUrl}?checkout=success&product=${product}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${clientUrl}?checkout=cancelled`,
      metadata: {
        supabase_user_id: user?.id ?? '',
        product,
        credits: String(CREDIT_AMOUNTS[product] || 0),
        anonymous: isAnonymousProduct && !user ? 'true' : 'false',
        checkout_token: isAnonymousProduct ? checkoutToken : '',
      },
    };
    if (stripeCustomerId) {
      sessionParams.customer = stripeCustomerId;
    } else if (user?.email) {
      sessionParams.customer_email = user.email;
    }
    if (redeemCoupon) {
      // Server-attached discount ONLY. NEVER allow_promotion_codes: the
      // hosted checkout page must not become a coupon-guessing surface, and
      // the webhook's zero-dollar gates (referral grant, redeem apply) assume
      // every discount on a session was placed by this line.
      sessionParams.discounts = [{ coupon: redeemCoupon }];
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
