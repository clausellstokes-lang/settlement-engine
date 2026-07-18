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
 * DERIVE-WHERE-ENFORCED: every row carries an `enforcement` marker. Rows whose
 * gate exists in code derive their values from it (TIER_GATE via tierFacts,
 * TIERS, TOWN_MAP_STYLE_IDS) and are pinned by the contract test — display can
 * never split from enforcement. Rows the ruling grants but whose gate has not
 * landed yet are marked 'ruled-2026-07-17' so the ROUND-3 claims audit can see
 * exactly which cells rest on the ruling rather than on a code path.
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
 * @type {ReadonlyArray<{ area: string, rows: ReadonlyArray<{ id: string, free: boolean|string, cartographer: boolean|string, enforcement: string }> }>}
 */
export const ENTITLEMENT_LADDER = Object.freeze([
  Object.freeze({
    area: 'world-generation',
    rows: Object.freeze([
      Object.freeze({ id: 'every-size',      free: true, cartographer: true, enforcement: 'TIER_GATE.free.maxTier' }),
      Object.freeze({ id: 'saves',           free: `${TIER_FACTS.free.saveLimit} saves`, cartographer: 'unlimited', enforcement: 'TIER_GATE.maxSaves' }),
      Object.freeze({ id: 'custom-content',  free: false, cartographer: true, enforcement: 'TIER_GATE.customContent' }),
      Object.freeze({ id: 'gallery-viewing', free: true, cartographer: true, enforcement: 'ruled-2026-07-17' }),
    ]),
  }),
  Object.freeze({
    area: 'simulation',
    rows: Object.freeze([
      Object.freeze({ id: 'same-engine',     free: true, cartographer: true, enforcement: 'constitutional' }),
      Object.freeze({ id: 'living-realm',    free: false, cartographer: true, enforcement: 'TIER_GATE.neighbour' }),
      Object.freeze({ id: 'map-chains',      free: false, cartographer: true, enforcement: 'TIER_GATE.mapChains' }),
    ]),
  }),
  Object.freeze({
    area: 'maps-exports',
    rows: Object.freeze([
      Object.freeze({ id: 'map-view',        free: true, cartographer: true, enforcement: 'ruled-2026-07-17' }),
      Object.freeze({ id: 'provenance-hover', free: true, cartographer: true, enforcement: 'ruled-2026-07-17' }),
      Object.freeze({ id: 'all-lenses',      free: `all ${LENS_COUNT} lenses`, cartographer: `all ${LENS_COUNT} lenses`, enforcement: 'TOWN_MAP_STYLE_IDS' }),
      Object.freeze({ id: 'panorama',        free: true, cartographer: true, enforcement: 'ruled-2026-07-17' }),
      Object.freeze({ id: 'map-editing',     free: false, cartographer: true, enforcement: 'ruled-2026-07-17' }),
      Object.freeze({ id: 'dm-pins',         free: false, cartographer: true, enforcement: 'ruled-2026-07-17' }),
      Object.freeze({ id: 'change-view',     free: false, cartographer: true, enforcement: 'ruled-2026-07-17' }),
      Object.freeze({ id: 'fog-table',       free: false, cartographer: true, enforcement: 'ruled-2026-07-17' }),
      Object.freeze({ id: 'interiors',       free: '1 sample per settlement', cartographer: true, enforcement: 'ruled-2026-07-17' }),
      Object.freeze({ id: 'v2-redraw',       free: false, cartographer: true, enforcement: 'ruled-2026-07-17' }),
      Object.freeze({ id: 'export-bundle',   free: SINGLE_DOSSIER.priceLabel + ' per settlement', cartographer: 'included', enforcement: 'TIER_GATE.export' }),
    ]),
  }),
  Object.freeze({
    area: 'ai',
    rows: Object.freeze([
      Object.freeze({ id: 'surveyor-stages', free: 'per task', cartographer: 'per task', enforcement: 'SURVEYOR_AI_COSTS' }),
    ]),
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
