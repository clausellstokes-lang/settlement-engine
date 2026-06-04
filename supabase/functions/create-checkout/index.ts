/**
 * Supabase Edge Function: create-checkout
 *
 * Creates a Stripe Checkout session for any of:
 *   - Credit packs (new schedule:  25 / 60 / 150)
 *   - Credit packs (legacy:         5 / 15 / 40)  — kept for refund/replay
 *   - Premium subscription ($6/mo)
 *   - Founder Lifetime ($99 one-time)
 *   - Single-dossier microtransaction ($2.99 one-time)
 *
 * Catalog and pricing live in src/config/pricing.js on the client. This
 * function maps each product key → a Stripe Price ID set in env. The
 * legacy SKUs stay listed so refund and replay links keep resolving
 * after the catalog rotates.
 *
 * Environment variables (set in Supabase dashboard):
 *   STRIPE_SECRET_KEY                 — Stripe secret key
 *   CLIENT_URL                        — Frontend origin (e.g. https://yourapp.com)
 *
 *   New schedule (active):
 *     STRIPE_PRICE_CREDITS_25         — 25-credit pack  ($4.99)
 *     STRIPE_PRICE_CREDITS_60         — 60-credit pack  ($9.99)
 *     STRIPE_PRICE_CREDITS_150        — 150-credit pack ($19.99)
 *     STRIPE_PRICE_PREMIUM            — Cartographer subscription ($6/mo)
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
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';
import { botGuard } from '../_shared/requestMeta.ts';

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

/** Build CORS headers dynamically from the request origin. */
function getCorsHeaders(req?: Request) {
  const clientUrl = Deno.env.get('CLIENT_URL') || '';
  const allowed = [
    clientUrl,
    'https://settlementforge.com',
    'https://www.settlementforge.com',
    'https://settlementwork.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);
  const origin = req?.headers?.get('Origin') || '';
  const match = allowed.includes(origin) || !origin;
  return {
    'Access-Control-Allow-Origin': match ? (origin || '*') : allowed[0],
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    ...(match ? { 'Vary': 'Origin' } : {}),
  };
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Tier 0.10 — obvious-bot guard. Auth gating already protects this
  // endpoint, but rejecting bots up front saves Stripe API budget +
  // keeps the function logs readable. Real users are never blocked.
  const guard = botGuard(req, 'create-checkout');
  if (guard.reject) return guard.reject;

  try {
    // Parse request body first so we know whether the product requires auth.
    const { product } = await req.json();
    if (!product || !PRICE_MAP[product]) {
      throw new Error(`Invalid product: ${product}. Valid: ${Object.keys(PRICE_MAP).join(', ')}`);
    }

    // Tier 7.4 — single-dossier is anonymous-allowed (per pricing.js
    // SINGLE_DOSSIER.requiresAccount=false). All other products bind
    // to a user_id at delivery time (credit packs, subscriptions,
    // founder seats) so they keep the auth requirement.
    const isAnonymousProduct = product === 'single_dossier';

    const authHeader = req.headers.get('Authorization');
    let user: { id: string; email?: string | null } | null = null;

    if (authHeader) {
      // If auth is provided (even for an anonymous-allowed product), try
      // to resolve the user so the purchase binds to the account when
      // possible. Failures fall through to anonymous handling.
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_ANON_KEY')!,
        { global: { headers: { Authorization: authHeader } } },
      );
      const { data: { user: authedUser }, error: authError } = await supabase.auth.getUser();
      if (!authError && authedUser) {
        user = { id: authedUser.id, email: authedUser.email ?? null };
      } else if (!isAnonymousProduct) {
        throw new Error('Not authenticated');
      }
    } else if (!isAnonymousProduct) {
      throw new Error('Missing authorization header');
    }

    const priceId = PRICE_MAP[product];
    if (!priceId) throw new Error(`Price ID not configured for ${product}`);

    const clientUrl = Deno.env.get('CLIENT_URL') || 'http://localhost:5173';
    let stripeCustomerId: string | null = null;

    if (user) {
      const admin = createClient(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
      );
      const { data: profile } = await admin
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', user.id)
        .single();

      stripeCustomerId = typeof profile?.stripe_customer_id === 'string'
        ? profile.stripe_customer_id
        : null;

      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
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

    // Create Stripe checkout session. For anonymous purchases we omit
    // customer_email — Stripe collects it on the checkout page and
    // sends it back on session.completed via session.customer_details
    // and session.customer (which the webhook reads).
    const mode = SUBSCRIPTION_PRODUCTS.has(product) ? 'subscription' : 'payment';
    const sessionParams: Record<string, unknown> = {
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${clientUrl}?checkout=success&product=${product}`,
      cancel_url:  `${clientUrl}?checkout=cancelled`,
      metadata: {
        supabase_user_id: user?.id ?? '',
        product,
        credits: String(CREDIT_AMOUNTS[product] || 0),
        anonymous: isAnonymousProduct && !user ? 'true' : 'false',
      },
    };
    if (stripeCustomerId) {
      sessionParams.customer = stripeCustomerId;
    } else if (user?.email) {
      sessionParams.customer_email = user.email;
    }
    const session = await stripe.checkout.sessions.create(sessionParams as Parameters<typeof stripe.checkout.sessions.create>[0]);

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
