/**
 * viewerSecrets.js — THE SECRETS SEAM predicate (THE ROADS amendment D, render-layer law;
 * DESIGN_THE_ROADS.md §13/§15). Slice R-1c.
 *
 * THE ONE FAIL-CLOSED DISCIPLINE (§15 binding 3, the stasis-predicate twin): sim state is
 * untouched; which LENS a viewer gets is governed by ONE chokepoint. Any context not
 * PROVABLY the owning DM's authenticated session on their OWN campaign renders the redacted
 * view; unknown/ambiguous ⇒ secrets hidden; redaction means THE DATA DOES NOT SHIP (the
 * publicSafe fail-closed allowlists do the dropping — this predicate governs which surfaces
 * even attempt to render DM truth).
 *
 * Every roads render surface (the Travelers overlay R-6, the Road Scene R-7, and any
 * whereabouts card line in a shared rendering path) consults viewerSeesDmSecrets. TODAY it
 * is truth-constant per surface (roads surfaces only mount in owner sessions), so it exists
 * so the FUTURE campaign-share surface flips ONE switch: it adds the owner-facing "show DM
 * secrets" toggle (default OFF) as the predicate's one added input (ctx.showDmSecrets), and
 * everything downstream already honours the predicate (§20 Q9 — the toggle ships WITH that
 * surface; this wave ships the predicate + the fail-closed posture).
 *
 * A PURE, DEPENDENCY-FREE leaf — imported only from the lazy roads render surfaces. Zero
 * eager bytes. Total: any input shape resolves to a boolean, defaulting to HIDDEN.
 *
 * @enforced-by tests/domain/viewerSecrets.test.js
 */

/**
 * @typedef {Object} DmSecretsContext
 * @property {boolean} [isOwner]       the viewer is the campaign's owner
 * @property {boolean} [authenticated] an authenticated (not anonymous) session
 * @property {boolean} [shared]        a share/gallery/public rendering path
 * @property {boolean} [gallery]       a gallery projection
 * @property {boolean} [anonymous]     an anonymous/public viewer
 * @property {boolean} [public]        a public rendering path
 * @property {(string|number|null)} [ownerUserId]  the campaign owner's id (when known)
 * @property {(string|number|null)} [viewerUserId] the current viewer's id (when known)
 * @property {boolean} [showDmSecrets] FUTURE campaign-share toggle (default OFF ⇒ false hides)
 */

/**
 * May this viewer see DM secrets (raw whereabouts / movement overlays / road-scene truth)?
 * FAIL CLOSED: true ONLY when the context PROVES an owning-DM authenticated session on their
 * own campaign, and no share/gallery/anonymous marker is set, and the future share toggle is
 * not explicitly OFF. Every other context — unknown, ambiguous, shared, gallery, anonymous,
 * a non-owner, or a user-id mismatch — resolves to false (secrets hidden). Pure, total.
 * @param {DmSecretsContext|null|undefined} ctx
 * @returns {boolean}
 */
export function viewerSeesDmSecrets(ctx) {
  const c = ctx && typeof ctx === 'object' && !Array.isArray(ctx) ? /** @type {DmSecretsContext} */ (ctx) : null;
  if (!c) return false; // unknown / ambiguous ⇒ hidden
  // Any share / gallery / anonymous / public rendering path ⇒ hidden, unconditionally.
  if (c.shared === true || c.gallery === true || c.anonymous === true || c.public === true) return false;
  // Must be an authenticated session that is the campaign's OWNER.
  if (c.authenticated !== true || c.isOwner !== true) return false;
  // When both ids are known, the owner must be viewing THEIR OWN campaign.
  if (c.ownerUserId != null && c.viewerUserId != null && String(c.ownerUserId) !== String(c.viewerUserId)) return false;
  // FUTURE campaign-share surface: the owner-facing "show DM secrets" toggle (default OFF).
  // Its absence, in an in-session owner view (the only place roads surfaces mount today),
  // means visible; an explicit false always hides.
  if (c.showDmSecrets === false) return false;
  return true;
}
