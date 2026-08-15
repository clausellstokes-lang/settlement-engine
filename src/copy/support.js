/**
 * support.js — Single source of truth for the support contact address.
 *
 * The address was previously hardcoded (as a maintainer's personal AOL address)
 * across App.jsx, AuthModal.jsx, AccountSupportSection.jsx, and
 * SingleDossierSuccessPage.jsx. Centralizing it here means the destination — and
 * any future switch to a helpdesk/form — is a one-line change, and no personal
 * PII is scattered through the UI.
 *
 * Override at build time with VITE_SUPPORT_EMAIL if the deploy uses a different
 * inbox.
 */

export const SUPPORT_EMAIL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPPORT_EMAIL) ||
  'settlementforge@gmail.com';

/** Build a `mailto:` href with an optional subject line. */
export function supportMailto(subject) {
  return subject
    ? `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${SUPPORT_EMAIL}`;
}
