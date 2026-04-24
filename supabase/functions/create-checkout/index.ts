/**
 * Supabase Edge Function: create-checkout
 *
 * Creates a Stripe Checkout session for credit pack or premium upgrade.
 * Called from the client with the user's auth token.
 *
 * Environment variables (set in Supabase dashboard):
 *   STRIPE_SECRET_KEY          — Stripe secret key
 *   STRIPE_PRICE_CREDITS_5     — Price ID for 5-credit pack ($4.99)
 *   STRIPE_PRICE_CREDITS_15    — Price ID for 15-credit pack ($9.99)
 *   STRIPE_PRICE_CREDITS_40    — Price ID for 40-credit pack ($19.99)
 *   STRIPE_PRICE_PREMIUM       — Price ID for premium subscription ($4.99/mo)
 *   CLIENT_URL                 — Frontend origin (e.g. https://yourapp.com)
 *
 * Legacy env vars (backward compat):
 *   STRIPE_PRICE_CREDITS_10    — Mapped to credits_10 if still set
 *   STRIPE_PRICE_CREDITS_50    — Mapped to credits_50 if still set
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, { apiVersion: '2023-10-16' });

const PRICE_MAP: Record<string, string> = {
  // New volume-discount tiers
  credits_5:  Deno.env.get('STRIPE_PRICE_CREDITS_5') || '',
  credits_15: Deno.env.get('STRIPE_PRICE_CREDITS_15') || '',
  credits_40: Deno.env.get('STRIPE_PRICE_CREDITS_40') || '',
  premium:    Deno.env.get('STRIPE_PRICE_PREMIUM') || '',
  // Legacy (backward compat)
  credits_10: Deno.env.get('STRIPE_PRICE_CREDITS_10') || '',
  credits_50: Deno.env.get('STRIPE_PRICE_CREDITS_50') || '',
};

const CREDIT_AMOUNTS: Record<string, number> = {
  credits_5:  5,
  credits_15: 15,
  credits_40: 40,
  credits_10: 10,
  credits_50: 50,
};

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

  try {
    // Authenticate the user via Supabase JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    // Parse request body
    const { product } = await req.json();
    if (!product || !PRICE_MAP[product]) {
      throw new Error(`Invalid product: ${product}. Valid: ${Object.keys(PRICE_MAP).join(', ')}`);
    }

    const priceId = PRICE_MAP[product];
    if (!priceId) throw new Error(`Price ID not configured for ${product}`);

    const clientUrl = Deno.env.get('CLIENT_URL') || 'http://localhost:5173';

    // Create Stripe checkout session
    const mode = product === 'premium' ? 'subscription' : 'payment';
    const session = await stripe.checkout.sessions.create({
      mode,
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${clientUrl}?checkout=success&product=${product}`,
      cancel_url:  `${clientUrl}?checkout=cancelled`,
      metadata: {
        supabase_user_id: user.id,
        product,
        credits: String(CREDIT_AMOUNTS[product] || 0),
      },
    });

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
