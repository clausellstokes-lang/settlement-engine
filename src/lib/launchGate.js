/**
 * launchGate.js - the one switch that keeps purchases closed until launch.
 *
 * THE OWNER (2026-09-16): "disable all purchase buttons on the website until we are
 * ready to launch. People can make accounts, but temporarily all buttons for purchase,
 * including subscriptions, are to have a pill that says Available at launch."
 *
 * CLOSED UNLESS EXPLICITLY OPENED. Purchases open only when the build carries
 * VITE_PURCHASES_OPEN=true; a missing, empty or misspelled value keeps them closed, so a
 * forgotten environment variable can never take money early. Launch is therefore a
 * Vercel environment change plus a redeploy, with no code change.
 *
 * Two layers read it: every purchase control renders disabled with
 * <AvailableAtLaunchPill /> (components/primitives/AvailableAtLaunchPill.jsx), and
 * startCheckout (lib/stripe.js) refuses while closed, so a control the census missed
 * still cannot start a checkout. The billing portal (startCustomerPortal) is NOT gated:
 * anyone who already holds a subscription must be able to manage or cancel it.
 *
 * No imports and a few hundred bytes: the pill is used on eager surfaces too, and the
 * first-paint budget (tests/build/vendorPdfLazy.test.js) has little headroom.
 */

/** The error code startCheckout throws while purchases are closed. */
export const PURCHASES_CLOSED_CODE = 'purchases_not_open';

/**
 * Whether purchases are open in this build.
 * @param {{ VITE_PURCHASES_OPEN?: string } | undefined} [env] the build env (a seam for tests)
 * @returns {boolean}
 */
export function purchasesOpen(env = import.meta.env) {
  return Boolean(env) && env.VITE_PURCHASES_OPEN === 'true';
}

/**
 * The refusal startCheckout throws while purchases are closed.
 * @returns {Error & { code: string }}
 */
export function purchasesClosedError() {
  const error = /** @type {Error & { code: string }} */ (new Error('Purchases open at launch.'));
  error.code = PURCHASES_CLOSED_CODE;
  return error;
}
