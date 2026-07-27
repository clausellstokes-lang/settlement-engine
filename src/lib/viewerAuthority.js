/**
 * viewerAuthority.js — THE single source for the dossier AUTHORING-AUTHORITY
 * spelling (Wave R-4 premium-gate scan, docs/CAPABILITY_REMEDIATION_PLAN.md;
 * the R-0 deity single-source cure generalized).
 *
 * WHERE IT LIVES: beside the repo's existing access helpers (src/lib/auth.js,
 * src/lib/saveAccess.js, src/lib/dossierEntitlements.js) rather than under
 * src/domain/**. A viewer-tier predicate is not kernel-grade engine logic, and
 * the headless spine must stay free of auth concepts (tests/architecture/
 * layerBoundaries.test.js). This module still imports NOTHING, so it costs the
 * eager graph only its own bytes.
 *
 * THE AUTHORITY, VERBATIM. Two surfaces had hand-copied the same disjunction:
 *   SettlementDetail.jsx  `canEdit`          — the Library dossier editor
 *   SettlementWorkbenchMount.jsx `viewerCanAuthor` — the Create-flow Workbench
 * They must never drift again: a third copy is what let the Create flow ship
 * un-gated in the first place (the gap Wave R-2 closed).
 *
 * FAIL-CLOSED: a missing `auth`, a missing `tier`, or a state without a callable
 * `isElevated` selector all read as NOT entitled. Anything short of an explicit
 * `true` from `isElevated()` is refused, so a selector returning a truthy
 * non-boolean cannot widen the gate.
 *
 * THE DEAD `founder` DISJUNCT IS DELIBERATE. No code path produces
 * `auth.tier === 'founder'` today — authSlice's resolveTier only ever yields
 * 'anon' | 'free' | 'premium', and the founder-lifetime grant sets
 * tier:'premium' plus a separate `isFounder` flag. The disjunct is preserved
 * BYTE-FOR-BYTE because retiring it is the OWNER'S word, not this program's
 * (docs/CAPABILITY_REMEDIATION_PLAN.md owner-decision queue, added by R-3).
 * Extraction here is behaviour-identical by construction.
 *
 * DELIBERATELY NOT THIS AUTHORITY (each a different question). Two families are
 * pinned as EXEMPTIONS in tests/lint/premiumGateSingleSource.test.js (they spell
 * a tier literal the exact-set census can see); the other two spell their gates
 * through TIER_GATE / entitlement helpers with NO tier literal, so they sit
 * outside the census's reach BY CONSTRUCTION — nothing to pin, and adding them
 * to EXEMPTIONS would red the census's stale-entry assertion:
 *   - `npcAuthoringAllowed` (OutputContainer.jsx) — PINNED ('documented-divergence'):
 *     aligning it changes which users see NPC authoring levers, a paid-surface
 *     behaviour change that is owner-gated.
 *   - purchase / pricing / account routing — PINNED ('sell-to-the-tier'): surfaces
 *     that ASK the tier in order to sell to it; converging them would gate the
 *     upgrade path on being upgraded.
 *   - `canUseCustomContent()` / deityWriteGate — the CUSTOM-CONTENT entitlement
 *     (TIER_GATE.customContent), which an elevated role and a lapsed embed owner
 *     both reach on different terms. No tier literal; outside the census.
 *   - `canExport()` / resolveExportAccess — the EXPORT ladder, which a free tier
 *     can also satisfy with a purchased durable per-dossier right. No tier
 *     literal; outside the census.
 */

/** The account tiers that hold dossier-authoring authority on their own. */
export const AUTHORING_TIERS = Object.freeze(['premium', 'founder']);

/**
 * Whether this viewer may author dossier content (edit prose, edit NPC details,
 * open the change dock). The ONE spelling of the check.
 *
 * Written as a plain state predicate so it works as a zustand selector
 * (`useStore(viewerCanAuthor)`) and as a direct call on a `getState()` snapshot.
 *
 * @param {{ auth?: { tier?: string|null }|null, isElevated?: (() => boolean)|unknown }|null|undefined} state
 *   a store state (or `getState()` snapshot)
 * @returns {boolean} true only for an entitled tier or a live elevated role
 */
export function viewerCanAuthor(state) {
  const tier = state?.auth?.tier;
  return tier === 'premium' || tier === 'founder'
    || (typeof state?.isElevated === 'function' && state.isElevated() === true);
}

export default viewerCanAuthor;
