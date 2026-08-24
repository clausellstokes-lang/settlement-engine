/**
 * config/entitlementLadder.js — W-DOC: THE ENTITLEMENT LADDER, the owner's
 * freely-given ruling of 2026-07-17 transcribed ONCE as config, grouped by
 * capability area for the pricing page's comparison table (brief §3 band 4).
 *
 * THE RULING (verbatim scope):
 *   FREE        = map view · provenance hover · all five lenses · panorama ·
 *                 gallery viewing.
 *   CARTOGRAPHER = map editing · DM pins · change-view history depth · the fog
 *                 table layer · building interiors (ONE free sample interior
 *                 per settlement as the teaser) · the v1→v2 redraw opt-in —
 *                 plus the existing unlimited saves/exports.
 *   The $2.99 per-settlement export bundle is unchanged (free pays per
 *   settlement; premium included). SURVEYOR = the AI stages. The engine itself
 *   is NEVER tier-gated (constitutional — every tier runs the same simulation).
 *
 * DERIVE-WHERE-ENFORCED: every row carries an `enforcement` marker naming the
 * symbol that resolves the row in code (TIER_GATE via tierFacts, TIERS,
 * TOWN_MAP_STYLE_IDS, viewerCanAuthor) — display can never split from
 * enforcement.
 *
 * THE RULE THE WALKER ENFORCES (ODQ §464.2 O-P1, as corrected at §449/§471).
 * A row CLAIMS a paywall when its two cells DIFFER (`free !== cartographer`).
 * Every claiming row must name a symbol that RESOLVES — free refused, premium
 * granted — measured against the real gate rather than grepped. A row whose
 * cells are EQUAL claims nothing a gate could refuse and is marked 'parity',
 * or keeps the derivation source its equal cells are computed from.
 *
 * THE RETIRED MARKER. The old `ruled-2026-07-17` spelling meant "the ruling
 * grants it, the gate has not landed yet". Measured at ODQ §471 that sentence
 * was FALSE for four of its six claiming rows — map editing, DM pins,
 * change-view depth and the fog table have been enforced all along through
 * `viewerCanAuthor` (src/lib/viewerAuthority.js), which SettlementMapPane
 * threads down as `entitled`. The other two, building interiors and the v1 to
 * v2 redraw opt-in, are neither gated nor shipped, so they are de-advertised
 * into DEFERRED_LADDER_ROWS below and return WITH their gates at map
 * activation. Nothing in the rendered table now rests on a ruling alone.
 *
 * ⚠ THE WALKER READS ROW VALUES, NEVER THIS FILE'S TEXT. A source scan for the
 * retired spelling would match the paragraph you are reading and pass while a
 * live row still carried it — the doc-agreement vacuity class. The absence pin
 * is over `row.enforcement`, which prose cannot forge.
 *
 * Consumed ONLY by the lazy pricing chunk (+ tests) — nothing here rides
 * first paint.
 */

import { TIERS, SINGLE_DOSSIER } from './pricing.js';
import { TIER_FACTS } from './tierFacts.js';
import { TOWN_MAP_STYLE_IDS } from '../design/townMapStyles.js';

/** Cell vocabulary: true (included) · false (not included) · a short string
 *  (an honest qualifier — rendered verbatim, e.g. '1 sample per settlement').
 *  The constitutional engine-never-gated sentence renders from the copy
 *  registry (copy/pricingPage.js band4.engineNote) — words live in copy. */

export const LENS_COUNT = TOWN_MAP_STYLE_IDS.length; // 5 — the ruling's "all five lenses"

/**
 * The comparison table, grouped by capability area (sticky headers render per
 * group). Column order: free → cartographer. (Surveyor is the AI lane, priced
 * per task — its band renders the task menu; the table's AI group points at it
 * rather than duplicating task prices.)
 * @type {ReadonlyArray<{ area: string, rows: ReadonlyArray<{ id: string, axis: 'viewing'|'authoring'|'account', free: boolean|string, cartographer: boolean|string, enforcement: string }> }>}
 */
export const ENTITLEMENT_LADDER = Object.freeze([
  Object.freeze({
    area: 'world-generation',
    rows: Object.freeze([
      Object.freeze({ id: 'every-size',      free: true, cartographer: true, axis: 'account', enforcement: 'TIER_GATE.free.maxTier' }),
      Object.freeze({ id: 'saves',           free: `${TIER_FACTS.free.saveLimit} saves`, cartographer: 'unlimited', axis: 'account', enforcement: 'TIER_GATE.maxSaves' }),
      Object.freeze({ id: 'custom-content',  free: false, cartographer: true, axis: 'authoring', enforcement: 'TIER_GATE.customContent' }),
      Object.freeze({ id: 'gallery-viewing', free: true, cartographer: true, axis: 'viewing', enforcement: 'parity' }),
    ]),
  }),
  Object.freeze({
    area: 'simulation',
    rows: Object.freeze([
      Object.freeze({ id: 'same-engine',     free: true, cartographer: true, axis: 'account', enforcement: 'constitutional' }),
      Object.freeze({ id: 'living-realm',    free: false, cartographer: true, axis: 'account', enforcement: 'TIER_GATE.neighbour' }),
      Object.freeze({ id: 'map-chains',      free: false, cartographer: true, axis: 'viewing', enforcement: 'TIER_GATE.mapChains' }),
    ]),
  }),
  Object.freeze({
    area: 'maps-exports',
    rows: Object.freeze([
      Object.freeze({ id: 'map-view',        free: true, cartographer: true, axis: 'viewing', enforcement: 'parity' }),
      Object.freeze({ id: 'provenance-hover', free: true, cartographer: true, axis: 'viewing', enforcement: 'parity' }),
      Object.freeze({ id: 'all-lenses',      free: `all ${LENS_COUNT} lenses`, cartographer: `all ${LENS_COUNT} lenses`, axis: 'viewing', enforcement: 'TOWN_MAP_STYLE_IDS' }),
      Object.freeze({ id: 'panorama',        free: true, cartographer: true, axis: 'viewing', enforcement: 'parity' }),
      Object.freeze({ id: 'map-editing',     free: false, cartographer: true, axis: 'authoring', enforcement: 'viewerCanAuthor' }),
      Object.freeze({ id: 'dm-pins',         free: false, cartographer: true, axis: 'authoring', enforcement: 'viewerCanAuthor' }),
      Object.freeze({ id: 'change-view',     free: 'latest change only', cartographer: true, axis: 'viewing', enforcement: 'viewerCanAuthor' }),
      Object.freeze({ id: 'fog-table',       free: false, cartographer: true, axis: 'viewing', enforcement: 'viewerCanAuthor' }),
      Object.freeze({ id: 'export-bundle',   free: SINGLE_DOSSIER.priceLabel + ' per settlement', cartographer: 'included', axis: 'account', enforcement: 'TIER_GATE.export' }),
    ]),
  }),
  Object.freeze({
    area: 'ai',
    rows: Object.freeze([
      Object.freeze({ id: 'surveyor-stages', free: 'per task', cartographer: 'per task', axis: 'account', enforcement: 'SURVEYOR_AI_COSTS' }),
    ]),
  }),
]);

/**
 * ⛔ THE THREE ROWS THE OWNER'S AUTHORING RULING HAS NOT REACHED YET (ODQ §514.1b).
 *
 * The ruling: "Editing the map is paywall gated at all levels of the map. But viewing
 * and interacting with it is not." That makes AUTHORING the one paid axis and viewing
 * free at every level — which is why every row above carries an `axis`.
 *
 * Measured against the shipped code, three rows marked `viewing` STILL CLAIM a paywall.
 * They are listed here rather than silently corrected, because changing any of them
 * changes what a user receives, and paid-surface behaviour is the owner's call, not a
 * build lane's. Each is a REPORT, not a to-do this file may quietly action:
 *
 *   map-chains  — the region map's supply-chain layer is a VIEW LAYER gated by
 *     TIER_GATE.mapChains (canUseMapChains, authSlice.js:674) with three locked
 *     affordances (MapOverlay.jsx:62, map/LayersPanel.jsx:54, map/RoutesToolbar.jsx:50).
 *     Viewing a layer is interaction, not authoring.
 *   change-view — the change-history DEPTH is capped for the free tier at
 *     FREE_CHANGE_DEPTH = 1 (SettlementMapNotes.jsx:33/:157) behind the AUTHORING
 *     predicate. Reading history is interaction.
 *   fog-table   — the fog panel renders locked for a non-authoring viewer
 *     (fog/SettlementMapFogControls.jsx:70). Revealing quarters at a live table reads
 *     as interaction; the owner may class the session's PERSISTENCE as authoring, which
 *     is precisely why this one is reported rather than assumed either way.
 *
 * THE LEDGER IS SHRINK-ONLY BY TEST. A fourth viewing row that starts claiming a
 * paywall reds the walker; so does adding an id here without the row to match. When the
 * ruling is implemented these entries leave, and the walker's rule F then holds with no
 * exceptions at all.
 */
export const VIEWING_PAYWALLS_PENDING_514 = Object.freeze([
  Object.freeze({ id: 'map-chains',  reason: 'a region-map view layer behind TIER_GATE.mapChains' }),
  Object.freeze({ id: 'change-view', reason: 'history READING depth capped behind the authoring predicate' }),
  Object.freeze({ id: 'fog-table',   reason: 'table-session reveal reads as interaction; its persistence may not — owner call' }),
]);

/**
 * THE DE-ADVERTISED ROWS — a ledger, so the return is a MOVE and not a rewrite.
 *
 * ODQ §464.2 (O-P1): the rows the pricing table claimed as Cartographer-only
 * without a gate are de-advertised until the map ships, and "at map activation
 * (D3b/P6) the rows return WITH their gates". Measured at ODQ §471 and again by
 * the WEB-8 lane, exactly two of the six qualified — the other four were
 * enforced all along and simply named the wrong symbol:
 *
 *   interiors — `src/components/interior/InteriorView.jsx` is prop-mounted and
 *     store-free, and NOTHING in product imports it (the only textual hits are
 *     three posture comments, the artwork registry row at design/boundBook.js
 *     and the module itself). No enter-interior affordance exists, and no
 *     "1 sample per settlement" allowance exists anywhere. UNGATED and UNSHIPPED
 *     — a paying Cartographer receives nothing for this row today, which is why
 *     removing it takes nothing away from anyone.
 *
 *   v2-redraw — `withLayoutLawVersion` (domain/townMap/mapEdits.js) has no
 *     caller outside its own module and the barrel, while
 *     `newSettlementMapEdits()` stamps `layoutLawVersion: 2` onto EVERY newly
 *     saved settlement, on every tier, at all four create boundaries. There is
 *     no opt-in and no gate: the free tier already receives v2. The row was not
 *     an unenforced paywall so much as an inverted one.
 *
 * The `band4.rows` display labels for both ids STAY in the copy registry, so the
 * return is a two-line move back into the ladder with a resolving `enforcement`
 * symbol. The walker pins that these ids are ABSENT from the rendered ladder and
 * PRESENT here, so neither can be quietly resurrected without a gate.
 *
 * @type {ReadonlyArray<{ id: string, axis: 'viewing'|'authoring', free: boolean|string, cartographer: boolean|string, returnsAt: string, reason: string }>}
 */
export const DEFERRED_LADDER_ROWS = Object.freeze([
  Object.freeze({
    id: 'interiors',
    axis: 'viewing',
    free: '1 sample per settlement',
    cartographer: true,
    returnsAt: 'map activation D3b/P6',
    reason: 'InteriorView has no product importer and no per-settlement sample allowance exists — unshipped, so the claim had nothing behind it on either tier',
  }),
  Object.freeze({
    id: 'v2-redraw',
    axis: 'authoring',
    free: false,
    cartographer: true,
    returnsAt: 'map activation D3b/P6',
    reason: 'newSettlementMapEdits() mints layoutLawVersion 2 tier-blind for every new settlement and withLayoutLawVersion has no caller — there is no opt-in to gate, and free already receives v2',
  }),
]);

/** Founder: everything Cartographer has, forever (the charter band renders
 *  this sentence from TIERS.founder — no per-row founder column needed). */
export const FOUNDER_EQUALS_CARTOGRAPHER_FOREVER = Object.freeze({
  seatLimit: TIERS.founder.seatLimit,
  oneTimeCredits: TIERS.founder.oneTimeCredits,
});

/**
 * The downgrade-retention window, in months. TRUE SOURCE: migration
 * 023_explicit_models_and_plan_retention.sql (handle_premium_downgrade:
 * `now() + interval '3 months'`). Held here so the FAQ's data-longevity answer
 * interpolates a pinned number instead of hand-typing one; the pricing
 * contract test greps the migration to keep this constant honest.
 */
export const RETENTION_MONTHS = 3;
