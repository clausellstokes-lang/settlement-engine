/**
 * stripe.js — Client-side Stripe checkout integration.
 *
 * Calls the Supabase Edge Function to create a Checkout session,
 * then redirects to Stripe's hosted checkout page.
 *
 * No Stripe SDK needed on the client — we just redirect to the URL.
 *
 * Catalog data (packs, tiers, single-dossier) lives in
 * `src/config/pricing.js`. This module pulls the active set via
 * `getActivePacks()` so flipping the `packsRepriced` flag rotates the
 * SKUs offered without touching any UI code.
 */

import { supabase, isConfigured, withTimeout } from './supabase.js';
import { getActivePacks, findPackByKey, SINGLE_DOSSIER } from '../config/pricing.js';
import { fetchCreditBalanceFromLedger } from './creditLedger.js';

// PRODUCTS preserves the historical shape (object keyed by product id)
// so existing imports (PurchaseModal, AccountPage) keep working. The
// premium row is added in here since pricing.js stores it in TIERS,
// not in the packs catalog.
function buildProductsMap() {
  const packs = getActivePacks();
  return {
    ...packs,
    premium: {
      key:       'premium',
      name:      'Premium Upgrade',
      price:     '$6/mo',
      credits:   30,
      perCredit: null,
      discount:  null,
    },
    [SINGLE_DOSSIER.key]: {
      key:       SINGLE_DOSSIER.key,
      name:      'Single Dossier',
      price:     SINGLE_DOSSIER.priceLabel,
      credits:   0,
      perCredit: null,
      discount:  null,
    },
    founder_lifetime: {
      key:       'founder_lifetime',
      name:      'Founder Lifetime',
      price:     '$99 one-time',
      credits:   30,
      perCredit: null,
      discount:  null,
    },
  };
}

// PRODUCTS is a proxy onto the active map so callers always see the
// current flag-driven catalog without hot-reload gymnastics.
const PRODUCTS = new Proxy({}, {
  get(_, key)        { return buildProductsMap()[key]; },
  ownKeys()          { return Object.keys(buildProductsMap()); },
  has(_, key)        { return key in buildProductsMap(); },
  getOwnPropertyDescriptor(_, key) {
    const value = buildProductsMap()[key];
    return value ? { configurable: true, enumerable: true, value } : undefined;
  },
});

/**
 * Create a Stripe Checkout session and redirect.
 * @param {string} product — A key from the active PRODUCTS catalog or a legacy pack key.
 * @param {{ checkoutToken?: string }} options
 */
export async function startCheckout(product, options = {}) {
  if (!isConfigured) {
    throw new Error('Supabase not configured — cannot process payments in local mode');
  }
  // Allow legacy product keys (credits_5/15/40) too, even when the
  // catalog has been rotated, so refund/replay links don't 404.
  if (!PRODUCTS[product] && !findPackByKey(product)) {
    throw new Error(`Unknown product: ${product}`);
  }

  // Single-dossier checkout is anonymous-allowed (per
  // pricing.js SINGLE_DOSSIER.requiresAccount=false). All other
  // products still require auth because they grant ongoing account
  // benefits (subscription, founder seat, credit pack) that need a
  // user_id to bind to.
  const isAnonymousProduct = product === 'single_dossier';
  const checkoutToken = options.checkoutToken;
  if (isAnonymousProduct && (typeof checkoutToken !== 'string' || checkoutToken.length < 24)) {
    throw new Error('A secure dossier checkout token is required');
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session && !isAnonymousProduct) {
    throw new Error('You must be signed in to purchase');
  }

  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { product, checkoutToken },
  });

  if (error) throw new Error(error.message || 'Checkout failed');
  if (!data?.url) throw new Error('No checkout URL returned');

  // Redirect to Stripe
  window.location.href = data.url;
}

/** Create a Stripe Billing Portal session and redirect the signed-in user. */
export async function startCustomerPortal() {
  if (!isConfigured) {
    throw new Error('Supabase not configured - cannot manage billing in local mode');
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('You must be signed in to manage billing');

  const { data, error } = await supabase.functions.invoke('create-customer-portal', {
    body: {},
  });
  if (error) throw new Error(error.message || 'Billing portal failed');
  if (!data?.url) throw new Error('No billing portal URL returned');
  window.location.href = data.url;
}

/**
 * Check URL params for post-checkout status (called on app mount).
 * Returns { status, product, sessionId } or null.
 */
export function checkCheckoutResult() {
  const params = new URLSearchParams(window.location.search);
  const checkout = params.get('checkout');
  const product  = params.get('product');
  const sessionId = params.get('session_id');

  if (!checkout) return null;

  // Clean up URL params
  const url = new URL(window.location.href);
  url.searchParams.delete('checkout');
  url.searchParams.delete('product');
  url.searchParams.delete('session_id');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);

  return { status: checkout, product, sessionId };
}

/** Verify an anonymous single-dossier payment before releasing the PDF. */
export async function verifySingleDossierPurchase(sessionId, checkoutToken) {
  if (!isConfigured) throw new Error('Payments are not configured');
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    throw new Error('Missing checkout session');
  }
  if (typeof checkoutToken !== 'string' || checkoutToken.length < 24) {
    throw new Error('Missing dossier checkout token');
  }

  const { data, error } = await supabase.functions.invoke('verify-single-dossier', {
    body: { sessionId, checkoutToken },
  });
  if (error) throw new Error(error.message || 'Purchase verification failed');
  if (!data?.verified) throw new Error(data?.error || 'Purchase could not be verified');
  return data;
}

/**
 * Fetch the user's current credit balance from the server.
 *
 * Returns a number on success, 0 for the genuine signed-out / not-configured
 * cases, and `null` when the balance could NOT be determined (transient
 * network/RLS failure). Callers must treat `null` as "unknown" and keep the
 * last-known balance rather than rendering 0 — a blip must not flash a paying
 * user to zero credits.
 */
export async function fetchCreditBalance() {
  if (!isConfigured) return 0;

  const { data: { user } } = await withTimeout(supabase.auth.getUser(), 15000, 'Authentication check');
  if (!user) return 0;

  try {
    return await fetchCreditBalanceFromLedger();
  } catch {
    // Ledger read failed; try the legacy counter once before giving up.
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Failed to fetch credits:', error);
    return null; // unknown — caller preserves the last-known balance
  }
  return data?.credits || 0;
}

export { PRODUCTS };
