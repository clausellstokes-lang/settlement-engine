/**
 * lib/momentScope.js — THE POPUP SCOPE REGISTRY (LD-7, owner-ordered 2026-08-01).
 *
 * ── THE LAW, in the owner's own three clauses ────────────────────────────────
 *   1. A popup is PAGE-SCOPED BY DEFAULT: it never follows the user off the
 *      surface that spawned it. Leaving the page unmounts it, immediately.
 *   2. LEAVING IS NOT DISMISSING: an undismissed popup RE-APPEARS every time the
 *      user returns to its owner page, until they actually dismiss it.
 *   3. Cross-page popups exist ONLY by explicit design declaration — a popup that
 *      travels must SAY SO in its registration, never by accident of mount point.
 *
 * ── THE BUG THAT REVEALED IT, and why the cure is shaped this way ────────────
 * The Cartographer World-Map upsell (`map_clicked`) is fired by App's realm nav
 * click, lands in `settlementSlice.activePricingMoment`, and was cleared by
 * EXACTLY ONE caller — PricingMomentCard's own dismiss / auto-dismiss. No route
 * change touched it, and the App-level mount's only suppression was
 * `view !== 'pricing'`. So a Realm upsell followed the visitor to every page in
 * the product except /pricing.
 *
 * THE CURE IS A RENDER GATE, NOT A CLEAR. The App-level host stays exactly where
 * it is (the lazy-chunk economics are unchanged, and App.jsx is frozen at its
 * ceiling), and PricingMomentCard RENDERS a moment only when the active route is
 * in its declared scope. Nothing writes dismissal state on navigation, so law 2
 * FALLS OUT of the mechanism rather than needing a second rule: the flag survives
 * the trip and the render gates. Dismissal (`Not now` / the auto-dismiss) remains
 * the ONLY permanent suppressor, and the auto-dismiss timer is gated with the
 * render — an out-of-scope moment must not quietly time itself out while the user
 * is reading some other page.
 *
 * ── THE SCOPE VOCABULARY ─────────────────────────────────────────────────────
 * A declaration is either:
 *   • `GLOBAL` — the moment travels every route. THE EXPLICIT DECLARATION law 3
 *     demands. No pricing moment holds it today, and that is a finding, not an
 *     oversight: every moment in this product is a pitch fired by ONE surface
 *     reaching toward ONE system. See OVERLAY_SCOPE_CLASSIFICATION below for the
 *     overlays that legitimately are global.
 *   • a frozen array of view ids from `lib/routes.js` ROUTES — the surfaces the
 *     moment's own trigger is reachable from. A single-page moment is a
 *     one-element array rather than a bare string, so every consumer reads one
 *     shape and no call site has to branch on typeof.
 *
 * ⚠️ A SCOPE IS A CLAIM ABOUT WHERE THE TRIGGER LIVES, so it goes stale the moment
 * a trigger moves. `MOMENT_KEY_SOURCE_CENSUS` freezes the set of source files that
 * name any moment key at all, and tests/lint/momentScopeRegistry.walker.test.js
 * reds when that set moves — which is exactly when someone must re-read the scope
 * beside it. The census is the ratchet; these arrays are the data it protects.
 */

import { ROUTES } from './routes.js';

/** The one cross-page declaration. Law 3: travelling is said, never inferred. */
export const GLOBAL = 'global';

// ── The route families the moments are actually reachable from ───────────────
// Named rather than repeated so a re-scoping is one edit and the reasoning has a
// place to live. Every id here is a ROUTES `view`; the walker proves it.

/** The OWNER dossier surfaces — the live draft on Create and the saved dossier
 *  in the Library. Both mount `OutputContainer` with write affordances; the
 *  public projections (/gallery, /world, /screen) mount it readOnly and are
 *  deliberately NOT here, because no moment's trigger renders on them. */
const DOSSIER_VIEWS = Object.freeze(['generate', 'settlements']);

/** The Library alone — SettlementDetail and everything hung off it
 *  (PhaseBadge, NextActionRail, SuccessorPrompt, the export seam). */
const LIBRARY_VIEWS = Object.freeze(['settlements']);

/** Create alone — the wizard and the anonymous size ladder. */
const CREATE_VIEWS = Object.freeze(['generate']);

/** The Realm hub and the legacy /map path that redirects into it. `map` is
 *  included because `redirectForView` bounces it on an EFFECT, so the resolved
 *  view really is `map` for the frame before the redirect lands — a moment fired
 *  into that frame must not be suppressed on a technicality. */
const REALM_VIEWS = Object.freeze(['realm', 'map']);

/**
 * THE REGISTRY. One row per moment key in the `moments` copy registry
 * (src/copy/en.js), and the walker keeps the two sets EQUAL in both directions.
 *
 *   scope     — GLOBAL, or the frozen view-id array the moment may render on.
 *   firedFrom — the surfaces whose code calls `triggerPricingMoment` with this
 *               key (documentation for the next reader; the mechanical guard is
 *               MOMENT_KEY_SOURCE_CENSUS).
 *   why       — why the scope is what it is, in one sentence.
 *
 * ⚠️ FOUR MOMENTS ARE DECLARED-BUT-UNFIRED at this tree (`cloud_save`,
 * `weekly_user`, `anon_cap_hit`, `founder_eligible`): their copy ships and the
 * registry resolves it, but no call site passes their key today. They keep a
 * scope anyway — an undeclared moment is refused outright by
 * `triggerPricingMoment`, so leaving them out would turn "wire this up" into
 * "wire this up and discover a refusal". Their `firedFrom` is empty, which is the
 * honest record; wiring one up moves the census and forces the scope to be
 * re-read at the same moment, which is the point.
 */
export const MOMENT_SCOPES = Object.freeze({
  first_canonize: Object.freeze({
    scope: LIBRARY_VIEWS,
    firedFrom: Object.freeze(['src/components/settlement/PhaseBadge.jsx', 'src/components/settlementDetail/useNextActionRailHandlers.js']),
    why: 'Canonizing is a Library act — the badge and the next-action rail both hang off SettlementDetail.',
  }),
  first_ai_use: Object.freeze({
    scope: LIBRARY_VIEWS,
    firedFrom: Object.freeze(['src/components/SettlementDetail.jsx', 'src/components/settlementDetail/useNextActionRailHandlers.js']),
    why: 'The narrate spend is gated behind a saveId, so its first-use pitch only ever fires from the saved dossier.',
  }),
  first_canon_export: Object.freeze({
    scope: LIBRARY_VIEWS,
    firedFrom: Object.freeze(['src/components/SettlementDetail.jsx', 'src/components/settlement/SuccessorPrompt.jsx']),
    why: 'A canon export needs a canon settlement, which only the Library holds.',
  }),
  cloud_save: Object.freeze({
    scope: LIBRARY_VIEWS,
    firedFrom: Object.freeze([]),
    why: 'UNFIRED today. Cross-device sync is a Library promise, so that is where it would belong.',
  }),
  first_save: Object.freeze({
    scope: DOSSIER_VIEWS,
    firedFrom: Object.freeze(['src/store/saveMoments.js']),
    why: 'The save chokepoint is reached from the wizard\'s Save to Library and from the Library itself.',
  }),
  third_save: Object.freeze({
    scope: DOSSIER_VIEWS,
    firedFrom: Object.freeze(['src/store/saveMoments.js']),
    why: 'Same chokepoint as first_save — the cap is hit wherever a save lands.',
  }),
  first_pdf_export: Object.freeze({
    scope: DOSSIER_VIEWS,
    firedFrom: Object.freeze(['src/store/settlementSlice.js']),
    why: 'markExported is called from SettlementDetail (Library) and the wizard\'s draft export button.',
  }),
  regen_burst: Object.freeze({
    scope: DOSSIER_VIEWS,
    firedFrom: Object.freeze(['src/store/settlementSlice.js']),
    why: 'regenSection runs from the dossier, which mounts on the draft and the saved view alike.',
  }),
  map_clicked: Object.freeze({
    scope: REALM_VIEWS,
    firedFrom: Object.freeze(['src/App.jsx']),
    why: 'THE REPORTED BUG. Fired by the Realm nav click, so the Realm is the only surface that owns it.',
  }),
  map_realm_teaser: Object.freeze({
    scope: REALM_VIEWS,
    firedFrom: Object.freeze([
      'src/components/map/RealmDashboard.jsx', 'src/components/map/LayersPanel.jsx',
      'src/components/map/RoutesToolbar.jsx', 'src/components/settlements/LivingWorldGates.jsx',
      'src/components/instant/InstantWorldEntry.jsx',
    ]),
    why: 'Every one of its five triggers renders inside the Realm hub (LivingWorldGates is hosted by RealmDashboard and SimulationRulesDialog; InstantWorldEntry by SettlementPalette).',
  }),
  weekly_user: Object.freeze({
    scope: CREATE_VIEWS,
    firedFrom: Object.freeze([]),
    why: 'UNFIRED today. A returning-cadence nudge belongs on the front door the returning user lands on.',
  }),
  welcome_credit: Object.freeze({
    scope: DOSSIER_VIEWS,
    firedFrom: Object.freeze(['src/components/OutputContainer.jsx']),
    why: 'The insufficient-credits recovery CTA lives in the dossier\'s own session notices.',
  }),
  anon_cap_hit: Object.freeze({
    scope: CREATE_VIEWS,
    firedFrom: Object.freeze([]),
    why: 'UNFIRED today. The anonymous size ladder is a Create-page ceiling, so its pitch is Create-scoped.',
  }),
  founder_eligible: Object.freeze({
    scope: LIBRARY_VIEWS,
    firedFrom: Object.freeze([]),
    why: 'UNFIRED today. Its eligibility is read off the library (five settlements, neighbours linked, dossiers exported).',
  }),
  first_advance_attempt: Object.freeze({
    scope: REALM_VIEWS,
    firedFrom: Object.freeze(['src/components/map/RealmDashboard.jsx']),
    why: 'Advance Time is a Realm control and reaches for a Realm system.',
  }),
  war_layer_curiosity: Object.freeze({
    scope: REALM_VIEWS,
    firedFrom: Object.freeze(['src/components/settlements/LivingWorldGates.jsx']),
    why: 'The war gate is one of the simulation-rule switches, and those render in the Realm.',
  }),
  pantheon_preview: Object.freeze({
    scope: Object.freeze([...DOSSIER_VIEWS, ...REALM_VIEWS]),
    firedFrom: Object.freeze(['src/components/settlement/FaithSection.jsx', 'src/components/settlements/LivingWorldGates.jsx']),
    why: 'THE ONE TWO-FAMILY MOMENT: the dossier\'s Faith teaser fires it and so does the Realm pantheon gate, so its scope is the union of the two — declared, not inferred from either mount.',
  }),
});

/**
 * THE MOMENT-KEY SOURCE CENSUS — PER KEY, and the "per key" is the whole point.
 *
 * This is the RATCHET that keeps the scopes above honest. A scope is a claim
 * about where a moment's trigger lives, and the only way that claim rots silently
 * is a trigger moving or a new one appearing. Both move this map.
 *
 * ⚠️ IT IS PER-KEY BECAUSE THE FILE-LEVEL VERSION WAS MEASURED BLIND. The first
 * cut froze the flat SET of files naming any moment key, and a planted mutation
 * proved it could not see the most likely real edit: swapping `first_canonize`
 * for `map_clicked` inside PhaseBadge.jsx — a trigger firing the WRONG moment
 * from a surface the wrong scope covers — left that set byte-identical and the
 * walker green. Keyed by moment, the same plant reds immediately. The three
 * other plants (a deleted row, a typo'd view id, a predicate that stops failing
 * closed) were caught by both cuts.
 *
 * Not every file listed under a key is a FIRING surface — `pricingMoments.js`
 * carries the typedef naming all seventeen, `PricingMomentCard.jsx` the accent
 * partition, `pricingLens.js` the system→moment map, and `guidanceRegistry.js` /
 * `usePricingMoment.js` a documentation mention. That is deliberate: a census
 * that tried to classify would need a heuristic, and a heuristic is exactly what
 * lets a real new site look like a mention. `firedFrom` above carries the
 * curated reading; this map carries the mechanical one, and the walker proves
 * every `firedFrom` entry is a subset of it.
 *
 * ⚠️ THIS MODULE IS EXCLUDED FROM ITS OWN CENSUS, BY ADDRESS. It is the
 * DECLARATION, not a usage, and counting it would make the map mean two things
 * at once — and make it flicker on nothing more than whether a doc comment here
 * happened to quote a key in an illustration. (The first cut of the walker did
 * exactly that, and its own census arm caught it.)
 */
export const MOMENT_KEY_SOURCE_CENSUS = Object.freeze({
  first_canonize: Object.freeze([
    'src/components/settlement/PhaseBadge.jsx',
    'src/components/settlementDetail/useNextActionRailHandlers.js',
    'src/lib/pricingMoments.js',
  ]),
  first_ai_use: Object.freeze([
    'src/components/SettlementDetail.jsx',
    'src/components/pricing/PricingMomentCard.jsx',
    'src/components/settlementDetail/useNextActionRailHandlers.js',
    'src/lib/pricingMoments.js',
  ]),
  first_canon_export: Object.freeze([
    'src/components/SettlementDetail.jsx',
    'src/components/pricing/PricingMomentCard.jsx',
    'src/components/settlement/SuccessorPrompt.jsx',
    'src/lib/pricingMoments.js',
  ]),
  cloud_save: Object.freeze([
    'src/lib/pricingMoments.js',
  ]),
  first_save: Object.freeze([
    'src/domain/display/guidanceRegistry.js',
    'src/hooks/usePricingMoment.js',
    'src/lib/pricingMoments.js',
    'src/store/saveMoments.js',
  ]),
  third_save: Object.freeze([
    'src/components/pricing/PricingMomentCard.jsx',
    'src/lib/pricingMoments.js',
    'src/store/saveMoments.js',
  ]),
  first_pdf_export: Object.freeze([
    'src/components/pricing/PricingMomentCard.jsx',
    'src/lib/pricingMoments.js',
    'src/store/settlementSlice.js',
  ]),
  regen_burst: Object.freeze([
    'src/components/pricing/PricingMomentCard.jsx',
    'src/lib/pricingMoments.js',
    'src/store/settlementSlice.js',
  ]),
  map_clicked: Object.freeze([
    'src/App.jsx',
    'src/components/pricing/PricingMomentCard.jsx',
    'src/lib/pricingMoments.js',
  ]),
  map_realm_teaser: Object.freeze([
    'src/components/instant/InstantWorldEntry.jsx',
    'src/components/map/LayersPanel.jsx',
    'src/components/map/RealmDashboard.jsx',
    'src/components/map/RoutesToolbar.jsx',
    'src/components/settlements/LivingWorldGates.jsx',
    'src/lib/pricingLens.js',
    'src/lib/pricingMoments.js',
  ]),
  weekly_user: Object.freeze([
    'src/components/pricing/PricingMomentCard.jsx',
    'src/lib/pricingMoments.js',
  ]),
  welcome_credit: Object.freeze([
    'src/components/OutputContainer.jsx',
    'src/lib/pricingMoments.js',
  ]),
  anon_cap_hit: Object.freeze([
    'src/lib/pricingMoments.js',
  ]),
  founder_eligible: Object.freeze([
    'src/components/pricing/PricingMomentCard.jsx',
    'src/lib/pricingMoments.js',
  ]),
  first_advance_attempt: Object.freeze([
    'src/components/map/RealmDashboard.jsx',
    'src/lib/pricingLens.js',
    'src/lib/pricingMoments.js',
  ]),
  war_layer_curiosity: Object.freeze([
    'src/components/settlements/LivingWorldGates.jsx',
    'src/lib/pricingLens.js',
    'src/lib/pricingMoments.js',
  ]),
  pantheon_preview: Object.freeze([
    'src/components/settlement/FaithSection.jsx',
    'src/components/settlements/LivingWorldGates.jsx',
    'src/lib/pricingLens.js',
    'src/lib/pricingMoments.js',
  ]),
});

/**
 * THE AUDIT SLICE — the law applied retroactively to every OTHER popup, overlay
 * and banner in the tree, classified page-scoped vs cross-page as DATA.
 *
 * Only PricingMomentCard needed a registry: it is the one overlay whose visibility
 * is driven by a store flag rather than by where it is mounted, which is exactly
 * how it acquired the bug. Everything below already obeys law 1 STRUCTURALLY —
 * either its mount point is inside a route body (so leaving unmounts it), or it is
 * a declared global. The table records which, so a future overlay has a shape to
 * copy and this reasoning is not re-derived from scratch.
 *
 *   surface — the module that owns the overlay.
 *   scope   — GLOBAL, or 'by-mount' when the route body it lives in IS the scope.
 *   why     — the one-line justification.
 */
export const OVERLAY_SCOPE_CLASSIFICATION = Object.freeze([
  Object.freeze({
    surface: 'src/components/pricing/PricingMomentCard.jsx', scope: 'registry',
    why: 'The one store-flag-driven overlay. Its scope is per-moment and lives in MOMENT_SCOPES above — this file is the whole reason the registry exists.',
  }),
  Object.freeze({
    surface: 'src/components/AuthModal.jsx', scope: GLOBAL,
    why: 'THE LEGITIMATE GLOBAL the order names. The sign-in door is reachable from every surface and a route change must never cancel a half-finished sign-in.',
  }),
  Object.freeze({
    surface: 'src/components/PurchaseModal.jsx', scope: GLOBAL,
    why: 'A purchase in flight is not navigation state. Closing it on a route change would abandon a checkout the user started.',
  }),
  Object.freeze({
    surface: 'src/components/CampaignSyncBanner.jsx', scope: GLOBAL,
    why: 'A sync conflict is an account-wide condition; hiding it by walking to another page would hide a live data risk.',
  }),
  Object.freeze({
    surface: 'src/components/SessionEvictedBanner.jsx', scope: GLOBAL,
    why: 'Session eviction invalidates every surface at once, so the notice belongs on every surface.',
  }),
  Object.freeze({
    surface: 'src/components/CommandPaletteHost.jsx', scope: GLOBAL,
    why: 'The palette is chrome, not a nudge — it is a way to LEAVE the page, so unmounting it on leaving would be self-defeating.',
  }),
  Object.freeze({
    surface: 'src/components/FloatingAffordances.jsx', scope: 'route-gated',
    why: 'Already route-aware by the shipped mechanism: App passes `visible={allowsFloatingFeedback(view)}`, which reads the ROUTES table. The feedback widget and the Surveyor panel are suppressed on auth, recovery and checkout chrome.',
  }),
  Object.freeze({
    surface: 'src/components/PostGenCoach.jsx', scope: 'by-mount',
    why: 'Self-gates on post-generation store state; it coaches the surface it is about and has no flag that outlives the visit.',
  }),
  Object.freeze({
    surface: 'src/components/dossier/WelcomeCreditCard.jsx', scope: 'by-mount',
    why: 'Mounted INSIDE OutputContainer, so leaving the dossier unmounts it by construction — the shape every new nudge should copy.',
  }),
  Object.freeze({
    surface: 'src/components/settlements/SaveQuotaMeter.jsx', scope: 'by-mount',
    why: 'Mounted inside the Library toolbar; it is a meter on the page it measures, never a floating nudge.',
  }),
  Object.freeze({
    surface: 'src/components/map/RealmDocket.jsx', scope: 'by-mount',
    why: 'THE HELD ADJUDICATION DOCKET, and the order calls it an obvious cross-page member. At this tree it does not need the declaration: it renders inside the Realm body (WorldMapOverlays), so it is already un-suppressable BY navigation — nothing clears it, and it reappears whenever the Realm does. Coup-guarantee law is satisfied by the mount, and a GLOBAL declaration would put a realm-only surface on /pricing.',
  }),
  Object.freeze({
    surface: 'src/components/map/WhileYouWereAway.jsx', scope: 'by-mount',
    why: 'The advance-time report is about the realm the user just advanced; it lives in the Realm body.',
  }),
]);

/** Every view id any declaration names — the walker checks these against ROUTES. */
export const DECLARED_SCOPE_VIEWS = Object.freeze([
  ...new Set(Object.values(MOMENT_SCOPES).flatMap((r) => (r.scope === GLOBAL ? [] : r.scope))),
].sort());

/** True when `reason` has a scope declaration. Law 3's precondition. */
export function momentIsDeclared(reason) {
  return typeof reason === 'string' && Object.prototype.hasOwnProperty.call(MOMENT_SCOPES, reason);
}

/** The declared scope for `reason`, or undefined when it has none. */
export function momentScope(reason) {
  return momentIsDeclared(reason) ? MOMENT_SCOPES[reason].scope : undefined;
}

/**
 * THE RENDER PREDICATE. May a moment show on this route?
 *
 * FAIL-CLOSED on an undeclared reason, and that is the whole force of law 3: an
 * overlay with no declared scope does not render, so "declare your scope" is
 * enforced by the mechanism rather than by review. `triggerPricingMoment` refuses
 * the same reasons up front, so an undeclared moment never reaches the store at
 * all — this is the second door, kept because a store rehydrated from an older
 * build could still carry one.
 *
 * @param {string|undefined|null} reason  the moment key
 * @param {string|undefined|null} view    the active view id (hooks/useRoute)
 */
export function momentAllowedOnView(reason, view) {
  const scope = momentScope(reason);
  if (scope === undefined) return false;
  if (scope === GLOBAL) return true;
  return typeof view === 'string' && scope.includes(view);
}

/** Every known view id, for the walker's validity arm. */
export function knownViewIds() {
  return ROUTES.map((r) => r.view);
}
