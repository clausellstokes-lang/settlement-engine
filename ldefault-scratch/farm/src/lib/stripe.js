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

import { supabase, isConfigured } from './supabase.js';
import { getActivePacks, findPackByKey, SINGLE_DOSSIER, TIERS } from '../config/pricing.js';
import { fetchCreditBalanceFromLedger } from './creditLedger.js';
import { track, EVENTS, Funnel } from './analytics.js';

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
      price:     `$${(TIERS.cartographer.priceCents / 100).toFixed(2)}/mo`,
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
 *
 * A redeem code (migration 107) is resolved entirely server-side: the edge
 * function reserves it and attaches any discount itself. When the code did not
 * apply, checkout still proceeds and the server sends back a non-fatal
 * `redeemNotice` — returned here so callers can toast it (the redirect to
 * Stripe follows regardless).
 *
 * @param {string} product — A key from the active PRODUCTS catalog or a legacy pack key.
 * @param {{ checkoutToken?: string, settlement?: object, redeemCode?: string, saveId?: string, captchaToken?: string, savePaymentMethod?: boolean }} options
 *   For single_dossier, `settlement` is persisted server-side before payment so
 *   the paid dossier survives a lost/overwritten local stash (F21/F23).
 *   `saveId` (single_dossier + signed-in only): binds the durable export right
 *   to that SAVED settlement (migration 108). The server re-verifies ownership;
 *   an anonymous checkout ignores it.
 * @returns {Promise<{ redeemNotice: string|null }>}
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

  // Tier 7.4 — single-dossier checkout is anonymous-allowed (per
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

  // Only send a non-empty trimmed code; the server treats anything else as
  // "no code". Case is preserved — codes are matched exactly server-side.
  const redeemCode = typeof options.redeemCode === 'string' && options.redeemCode.trim()
    ? options.redeemCode.trim()
    : undefined;

  // saveId (durable-rights binding, 108): only meaningful for a SIGNED-IN
  // single_dossier buyer picking one saved settlement to bind the right to. The
  // server verifies ownership and ignores it for anonymous checkouts.
  const saveId = product === 'single_dossier' && typeof options.saveId === 'string' && options.saveId.trim()
    ? options.saveId.trim()
    : undefined;

  // Wave-D human verification (INERT until activated): a Turnstile token minted by
  // the purchase surface's CaptchaGate. ADDITIVE — omitted entirely when absent, so
  // the flag-off body is byte-identical. The edge function's verifyTurnstile is a
  // no-op until the owner sets TURNSTILE_SECRET_KEY. See docs/PERIMETER_RUNBOOK.md.
  const captchaToken = typeof options.captchaToken === 'string' && options.captchaToken
    ? options.captchaToken
    : undefined;

  // Only single_dossier carries a settlement to persist; other products bind to
  // the account server-side and never ship the artifact through checkout.
  const body = {
    product, checkoutToken,
    ...(redeemCode ? { redeemCode } : {}),
    ...(saveId ? { saveId } : {}),
    ...(captchaToken ? { captchaToken } : {}),
    ...(isAnonymousProduct && options.settlement ? { settlement: options.settlement } : {}),
    // Auto-reload consent (§4.2): the server re-gates this to signed-in credit-pack
    // payment sessions before it attaches setup_future_usage. Sending the flag is
    // harmless anywhere else.
    ...(options.savePaymentMethod === true ? { savePaymentMethod: true } : {}),
  };

  const { data, error } = await supabase.functions.invoke('create-checkout', { body });

  if (error) {
    // Surface the server's specific message (e.g. the 413 size-guard rejection)
    // instead of the generic "non-2xx" wrapper, so the buyer learns WHY before
    // paying rather than after.
    const classified = await classifyInvokeError(error, 'Checkout failed');
    throw classified;
  }
  if (!data?.url) throw new Error('No checkout URL returned');

  // Redirect to Stripe
  window.location.href = data.url;
  return { redeemNotice: data.redeemNotice ?? null };
}

/**
 * Emit the paid-conversion success events for a completed checkout return
 * (premium / founder_lifetime / credit packs) — the counterpart of the success
 * toast/landing surfaces. Fired at App reconcile OUTCOME.SUCCESS, only once the
 * entitlement is verified server-side (never from the ?checkout=success URL
 * alone). The single-dossier one-shot emits its own event from the landing page
 * after Stripe verification instead. Fire-and-forget: track() never throws.
 *
 * This tree's analytics taxonomy has no dedicated credit-pack success event;
 * the paid-conversion funnel below still counts credit-pack purchases. premium
 * emits PREMIUM_PURCHASED; founder_lifetime is covered by its own tile surface.
 */
export function trackCheckoutSuccess(product) {
  if (product === 'premium') {
    track(EVENTS.PREMIUM_PURCHASED);
  }
  Funnel.paidAction({
    kind: product === 'premium' ? 'premium'
      : product === 'founder_lifetime' ? 'founder_lifetime'
        : 'credit_pack',
  });
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
 * Returns { status, product, sessionId, dossierToken } or null.
 *
 * `dossierToken` (the `dt` param) is present only for a single_dossier return —
 * create-checkout appends it to the success_url so the browser recovers the
 * EXACT one-time token for this purchase (Stripe only fills in session_id). That
 * lets the success page verify precisely its own paid session even when several
 * dossiers were bought in the same browser (F21).
 */
export function checkCheckoutResult() {
  const params = new URLSearchParams(window.location.search);
  const checkout = params.get('checkout');
  const product  = params.get('product');
  const sessionId = params.get('session_id');
  const dossierToken = params.get('dt');

  if (!checkout) return null;

  // Clean up URL params
  const url = new URL(window.location.href);
  url.searchParams.delete('checkout');
  url.searchParams.delete('product');
  url.searchParams.delete('session_id');
  url.searchParams.delete('dt');
  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);

  return { status: checkout, product, sessionId, dossierToken };
}

/**
 * An Error augmented with retryability metadata for checkout/verify callers.
 * @typedef {Error & { transient?: boolean, status?: number }} CheckoutError
 */

/**
 * Normalize a supabase.functions.invoke() error into an Error carrying a
 * `transient` flag and `status`, so callers can offer Retry (429 / 5xx / network)
 * vs. a terminal "contact support" path (4xx). Reads the server's JSON body via
 * the FunctionsHttpError.context Response when available.
 * @returns {Promise<CheckoutError>}
 */
export async function classifyInvokeError(error, fallbackMessage = 'Request failed') {
  let status = 0;
  let bodyMessage = null;
  try {
    const ctx = error?.context;
    if (ctx && typeof ctx.status === 'number') status = ctx.status;
    if (ctx && typeof ctx.clone === 'function') {
      const parsed = await ctx.clone().json().catch(() => null);
      bodyMessage = parsed?.error || null;
    }
  } catch {
    // Non-HTTP error (network / relay) — leave status 0.
  }
  // status 0 => network/relay failure (transient). 429 and 5xx are transient.
  const transient = status === 0 || status === 429 || (status >= 500 && status <= 599);
  const err = /** @type {CheckoutError} */ (new Error(bodyMessage || error?.message || fallbackMessage));
  err.transient = transient;
  err.status = status;
  return err;
}

/**
 * Verify an anonymous single-dossier payment before releasing the PDF.
 * Returns { verified, sessionId, settlement } — `settlement` is the
 * server-persisted dossier (or null → caller falls back to the local stash).
 * Throws an Error with `.transient` set for retryable failures (429/5xx/network).
 *
 * `captchaToken` (Wave-D, optional): a managed-Turnstile token from the return
 * page's CaptchaGate. ADDITIVE — omitted when absent. This is a POST-PAYMENT
 * verification, so the edge function verifies the token ONLY IF one is present and
 * NEVER blocks a paid buyer on a missing/blocked token (a paying customer must
 * always be able to collect their PDF). See docs/PERIMETER_RUNBOOK.md.
 */
export async function verifySingleDossierPurchase(sessionId, checkoutToken, captchaToken) {
  if (!isConfigured) throw new Error('Payments are not configured');
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    throw new Error('Missing checkout session');
  }
  if (typeof checkoutToken !== 'string' || checkoutToken.length < 24) {
    throw new Error('Missing dossier checkout token');
  }

  const captcha = typeof captchaToken === 'string' && captchaToken ? captchaToken : undefined;
  const { data, error } = await supabase.functions.invoke('verify-single-dossier', {
    body: { sessionId, checkoutToken, ...(captcha ? { captchaToken: captcha } : {}) },
  });
  if (error) throw await classifyInvokeError(error, 'Purchase verification failed');
  if (!data?.verified) {
    const err = /** @type {CheckoutError} */ (new Error(data?.error || 'Purchase could not be verified'));
    err.transient = false;
    throw err;
  }
  return data;
}

/**
 * Verify an account-bound checkout session (credits / premium / founder) for the
 * signed-in caller. Returns { verified, product, status }. Throws with
 * `.transient` set for retryable failures. Used by the post-checkout
 * reconciliation flow (F23) to confirm the session server-side before polling
 * the entitlement.
 * @returns {Promise<{verified: boolean, product?: string, status?: string, transient?: boolean}>}
 */
export async function verifyCheckoutSession(sessionId) {
  if (!isConfigured) throw new Error('Payments are not configured');
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_')) {
    throw new Error('Missing checkout session');
  }
  const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
    body: { sessionId },
  });
  if (error) throw await classifyInvokeError(error, 'Purchase verification failed');
  return data; // { verified, product, status }
}

/** Read the signed-in user's current profile tier fresh from the server. */
export async function fetchProfileTier() {
  if (!isConfigured) return 'anon';
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 'anon';
  const { data, error } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', user.id)
    .single();
  if (error || !data) return 'free';
  return data.tier || 'free';
}

/**
 * Fetch the user's current credit balance from the server.
 */
export async function fetchCreditBalance() {
  if (!isConfigured) return 0;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  try {
    return await fetchCreditBalanceFromLedger();
  } catch {
    // Legacy fallback below.
  }

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
