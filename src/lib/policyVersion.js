/**
 * policyVersion.js — the single version stamp for the legal / trust pages.
 *
 * The /terms, /privacy, and /refunds pages are a first honest draft written from
 * the actual product behavior, not boilerplate. They are UNDER REVIEW: the copy
 * is stamped with POLICY_VERSION and carries a visible "under review" note so
 * nobody mistakes a working draft for reviewed legal text.
 *
 * POLICY_VERSION is a plain integer so it can be recorded alongside a consent /
 * acceptance decision the same way consent.js stamps CONSENT_MODEL_VERSION on
 * every research capture. Bump it whenever the substance of a policy page
 * changes so a stored acceptance can be tied to the exact text that was live.
 *
 * NOTE: the research-consent model already stamps its own CONSENT_MODEL_VERSION
 * (see lib/consent.js) onto every research payload. POLICY_VERSION is the
 * companion stamp for the human-readable policy pages; wiring it into a formal
 * "I accept these terms" record is a follow-up when such a flow exists (there is
 * no click-through acceptance gate today — the pages are informational).
 */

/** Integer revision of the legal/trust page set. Bump on any substantive change. */
export const POLICY_VERSION = 2;

/** Human label for the version (shown on each page). */
export const POLICY_LABEL = `v${POLICY_VERSION}`;

/** Visible status note: these pages are a working draft pending review. */
export const POLICY_STATUS = `${POLICY_LABEL} · under review`;

/** The date this draft went live (ISO). Displayed as the "last updated" line. */
export const POLICY_EFFECTIVE = '2026-08-02';
