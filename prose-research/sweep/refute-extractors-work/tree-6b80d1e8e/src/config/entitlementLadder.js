/**
 * config/entitlementLadder.js — W-DOC: THE ENTITLEMENT LADDER, the owner's
 * freely-given ruling of 2026-07-17 transcribed ONCE as config, grouped by
 * capability area for the pricing page's comparison table (brief §3 band 4).
 *
 * THE RULING OF 2026-07-17 (verbatim scope, TRANSCRIBED AS HISTORY — its
 * settlement-map clauses are SUPERSEDED, see the next block):
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
 * ⚰ SUPERSEDED BY THE LEGACY-MAP STRIP (owner, ODQ §725; Q8 CLOSED at §726).
 * The owner ruled the entire legacy settlement map out of the launch product
 * — "leave no tab or trace of it on the website" — and then ruled what the
 * CARTOGRAPHER tier sells afterwards. The ruling above is KEPT VERBATIM rather
 * than edited, because a transcribed owner ruling is evidence and rewriting it
 * would destroy the record of what was decided when; what changed is recorded
 * here beside it, so a successor reads the ruling AND its supersession in one
 * place.
 *   WHAT LEFT (TE-STRIP-5, §726): the four settlement-map AUTHORING rows
 *     (map editing, DM pins, change-view depth, the fog table layer) and the
 *     four lens/parity DISPLAY rows (map view, provenance hover, all N lenses,
 *     panorama), together with the `LENS_COUNT`→`TOWN_MAP_STYLE_IDS` import
 *     that computed the advertised lens count. The v1→v2 redraw row left the
 *     DEFERRED ledger below for the same reason. Their band4 display labels
 *     left the copy registry in the same act: the strip is a removal, not a
 *     de-advertisement, so there is nothing to move back.
 *   WHAT SURVIVES, AND WHY IT NEVER DEPENDED ON THE MAP (§726 Q8): the tier's
 *     spine — unlimited saves, custom content, the living Realm, map chains
 *     (a REALM-surface layer, a different map) and the export bundle —
 *     predates the settlement map and is untouched by this strip. The
 *     `interiors` deferred row also survives: interiors are not the legacy
 *     settlement map and read the retained geometric substrate (§11.2 J-STRIP-1,
 *     Q6′ narrowed).
 *
 * DERIVE-WHERE-ENFORCED: every row carries an `enforcement` marker naming the
 * symbol that resolves the row in code (TIER_GATE via tierFacts, TIERS) —
 * display can never split from enforcement.
 *
 * THE RULE THE WALKER ENFORCES (ODQ §464.2 O-P1, as corrected at §449/§471).
 * A row CLAIMS a paywall when its two cells DIFFER (`free !== cartographer`).
 * Every claiming row must name a symbol that RESOLVES — free refused, premium
 * granted — measured against the real gate rather than grepped. A row whose
 * cells are EQUAL claims nothing a gate could refuse and is marked 'parity',
 * or keeps the derivation source its equal cells are computed from.
 *
 * THE RETIRED MARKER (history, and it is why the walker reads VALUES). The old
 * `ruled-2026-07-17` spelling meant "the ruling grants it, the gate has not
 * landed yet". Measured at ODQ §471 that sentence was FALSE for four of its six
 * claiming rows — map editing, DM pins, change-view depth and the fog table had
 * been enforced all along through `viewerCanAuthor` (src/lib/viewerAuthority.js),
 * which `SettlementMapPane` threaded down as `entitled`. The other two, building
 * interiors and the v1→v2 redraw opt-in, were neither gated nor shipped, so they
 * were de-advertised into DEFERRED_LADDER_ROWS below.
 * ⚰ ALL FOUR OF THOSE ENFORCED ROWS, their pane and `SettlementMapPane` itself
 * left with the legacy settlement map (§725/§726), so `viewerCanAuthor` no longer
 * resolves any ladder row — the symbol is LIVE and still gates four non-map
 * authoring surfaces, it is simply no longer named here. Of the two de-advertised
 * rows, `interiors` survives below and `v2-redraw` was removed outright: its
 * subject (`withLayoutLawVersion`, in the legacy map's mapEdits module) is inside
 * the strip, so there is no longer a capability for the row to return TO.
 * Nothing in the rendered table now rests on a ruling alone.
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

/** Cell vocabulary: true (included) · false (not included) · a short string
 *  (an honest qualifier — rendered verbatim, e.g. '1 sample per settlement').
 *  The constitutional engine-never-gated sentence renders from the copy
 *  registry (copy/pricingPage.js band4.engineNote) — words live in copy. */

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
    // ⚰ ONE ROW, and that is the strip's shape rather than an oversight (§725/§726).
    // This group held nine rows, eight of which described the legacy settlement map:
    // four viewing/parity rows (map view, provenance hover, all N lenses, panorama)
    // and the four authoring rows the CARTOGRAPHER tier was defined by (map editing,
    // DM pins, change-view depth, the fog table layer). The export bundle is the one
    // member that was never a map feature — it sells a settlement DOSSIER — so the
    // group survives at one row instead of being dissolved into another area, which
    // would have moved a paid row's group and reddened the axis-order pin for a
    // presentational reason.
    area: 'maps-exports',
    rows: Object.freeze([
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
 * ⛔ THE ONE ROW THE OWNER'S AUTHORING RULING HAS NOT REACHED YET (ODQ §514.1b).
 *
 * The ruling: "Editing the map is paywall gated at all levels of the map. But viewing
 * and interacting with it is not." That makes AUTHORING the one paid axis and viewing
 * free at every level — which is why every row above carries an `axis`.
 *
 * Measured against the shipped code, one row marked `viewing` STILL CLAIMS a paywall.
 * It is listed here rather than silently corrected, because changing it changes what a
 * user receives, and paid-surface behaviour is the owner's call, not a build lane's.
 * It is a REPORT, not a to-do this file may quietly action:
 *
 *   map-chains  — the region map's supply-chain layer is a VIEW LAYER gated by
 *     TIER_GATE.mapChains (canUseMapChains, authSlice.js) with three locked
 *     affordances (MapOverlay.jsx, map/LayersPanel.jsx, map/RoutesToolbar.jsx).
 *     Viewing a layer is interaction, not authoring.
 *
 * ⚰ THE OTHER TWO WERE MOOTED, NOT ANSWERED (TE-STRIP-5, §725/§726) — recorded because
 * a question that disappears with its subject must not look like a question that was
 * decided. `change-view` and `fog-table` were §514.1b's other two open items; both named
 * legacy-settlement-map surfaces (`SettlementMapNotes`' FREE_CHANGE_DEPTH cap and
 * `SettlementMapFogControls`' locked panel), and the owner's strip removed the surfaces
 * rather than ruling on their axis. Their ladder rows left with them, so the ledger
 * shrinks to the one row whose subject survives — and `map-chains` is a REALM-surface
 * layer, which is why it is the survivor. Nobody's answer was assumed.
 *
 * THE LEDGER IS SHRINK-ONLY BY TEST. A second viewing row that starts claiming a
 * paywall reds the walker; so does adding an id here without the row to match. When the
 * ruling is implemented this entry leaves, and the walker's rule F then holds with no
 * exceptions at all.
 */
export const VIEWING_PAYWALLS_PENDING_514 = Object.freeze([
  Object.freeze({ id: 'map-chains',  reason: 'a region-map view layer behind TIER_GATE.mapChains' }),
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
 * ⚰ v2-redraw LEFT THIS LEDGER OUTRIGHT (TE-STRIP-5, §725/§726), and the
 * distinction matters: a deferred row is a promise held open, so removing one is
 * not the same act as never having made it. Its subject was
 * `withLayoutLawVersion` in the legacy map's `mapEdits` module — inside the strip
 * — so there is no capability left for the row to return TO, and a ledger entry
 * whose return can never happen is a promise nobody can keep. Its recorded
 * finding stands as history: `newSettlementMapEdits()` stamped
 * `layoutLawVersion: 2` onto every newly saved settlement on every tier, so
 * there was no opt-in and no gate, and the free tier already received v2. The row
 * was an inverted paywall rather than an unenforced one, which is why its removal
 * takes nothing from anyone either. Its band4 display label left the copy registry
 * in the same act.
 *
 * ⚠ `interiors` SURVIVES, and its `returnsAt` is KNOWN-STALE — left verbatim
 * deliberately, not overlooked. Interiors are NOT the legacy settlement map: they
 * read the retained geometric substrate and STAY at launch (§11.2 J-STRIP-1,
 * Q6′ narrowed), while the "map activation D3b/P6" programme the address names was
 * struck by the same owner ruling that ordered the strip. So the address is stale
 * in substance and not merely in wording. It is NOT re-pointed here because the
 * new address is a paid-surface promise's wording and the strip's brief does not
 * cover it (census §D4, vetoable): re-addressing is a paired two-line edit — this
 * row plus the walker's verbatim pin — for whoever rules the interiors programme's
 * return. Deliberately deferred and recorded, not a bug to re-find.
 *
 * The `band4.rows` display label for `interiors` STAYS in the copy registry, so the
 * return is a two-line move back into the ladder with a resolving `enforcement`
 * symbol. The walker pins that the id is ABSENT from the rendered ladder and
 * PRESENT here, so it cannot be quietly resurrected without a gate.
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
