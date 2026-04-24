/**
 * stripe.js — Client-side Stripe checkout integration.
 *
 * Calls the Supabase Edge Function to create a Checkout session,
 * then redirects to Stripe's hosted checkout page.
 *
 * No Stripe SDK needed on the client — we just redirect to the URL.
 */

import { supabase, isConfigured } from './supabase.js';

const PRODUCTS = {
  credits_5:  { name: '5 AI Credits',      price: '$4.99',    credits: 5,  perCredit: '$1.00',  discount: null },
  credits_15: { name: '15 AI Credits',     price: '$9.99',    credits: 15, perCredit: '$0.67',  discount: '33% off' },
  credits_40: { name: '40 AI Credits',     price: '$19.99',   credits: 40, perCredit: '$0.50',  discount: '50% off' },
  premium:    { name: 'Premium Upgrade',   price: '$4.99/mo', credits: 0,  perCredit: null,     discount: null },
};

/**
 * Create a Stripe Checkout session and redirect.
 * @param {'credits_5' | 'credits_15' | 'credits_40' | 'premium'} product
 */
export async function startCheckout(product) {
  if (!isConfigured) {
    throw new Error('Supabase not configured — cannot process payments in local mode');
  }
  if (!PRODUCTS[product]) {
    throw new Error(`Unknown product: ${product}`);
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('You must be signed in to purchase');

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { product },
  });

  if (error) throw new Error(error.message || 'Checkout failed');
  if (!data?.url) throw new Error('No checkout URL returned');

  // Redirect to Stripe
  window.location.href = data.url;
}

/**
 * Check URL params for post-checkout status (called on app mount).
 * Returns { status, product } or null.
 */
export function checkCheckoutResult() {
  const params = new URLSearchParams(window.location.search);
  const checkout = params.get('checkout');
  const product  = params.get('product');

  if (!checkout) return null;

  // Clean up URL params
  const url = new URL(window.location.href);
  url.searchParams.delete('checkout');
  url.searchParams.delete('product');
  window.history.replaceState({}, '', url.pathname);

  return { status: checkout, product };
}

/**
 * Fetch the user's current credit balance from the server.
 */
export async function fetchCreditBalance() {
  if (!isConfigured) return 0;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Failed to fetch credits:', error);
    return 0;
  }
  return data?.credits || 0;
}

export { PRODUCTS };
