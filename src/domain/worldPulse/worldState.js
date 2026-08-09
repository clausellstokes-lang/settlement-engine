import { isDraft } from 'immer';
import { normalizeSimulationRules } from './simulationRules.js';
import { wallClockNow } from '../clock.js';
import { deepClone } from '../clone.js';
import { stablePart } from './stablePart.js';
import { INTERVAL_WEEKS } from './intervalWeeks.js';
import { migrateTreatyClockMarkers } from './treatyClock.js';
import { compareCodepoint } from '../deterministicSort.js';
import { isWarReasonType } from './warReasonTaxonomy.js';
import { normalizeJoinAnchor } from './warCoalitionLedger.js';
import { migrateDispositionStats } from './dispositionLedger.js';

export const WORLD_STATE_SCHEMA_VERSION = 2;

const MAX_HISTORY = 80;
const MAX_PROPOSALS = 80;
// Player-authored intentions awaiting the next world-pulse tick (campaign-clock).
// Generous cap — these drain every advance; the bound only guards a pathological
// campaign that queues for hundreds of intentions without ever advancing time.
const MAX_PENDING = 400;

// Calendar unification (Option B' — the 4-4-5 week grid, owner ruling
// 2026-07-11, superseding the 13-month Option A): INTEGER WEEKS ARE CANONICAL.
// The temporal constitution fixes tick = 1 week and year = 52 weeks; the
// display year is a REGULAR 12-month calendar laid over that grid — four
// 13-week seasons, each split into months of 4, 4, and 5 weeks (4+4+5 = 13,
// ×4 = 52). Every month boundary lands on a week boundary, a season is exactly
// 3 months (months 1-3 spring … 10-12 winter), and nothing drifts: the advance
// path stores/advances integer elapsed weeks and DERIVES every label from them
// (never accumulates float months), so coarse == weekly holds by integer
// construction.
//
// The dependency-free intervalWeeks.js leaf is the SINGLE-SOURCE interval →
// week-count table (weeksPerInterval in advanceInterval.js re-exports it
// verbatim; keep them one object). This historic import path remains an identity
// re-export for every existing consumer.
export { INTERVAL_WEEKS };

const MONTHS_PER_YEAR = 12;  // regular 12-month display year over 52 weeks
const WEEKS_PER_YEAR = 52;
const WEEKS_PER_SEASON = 13; // four equal 13-week quarters
// Cumulative month-END weeks of the 4-4-5 grid: month m spans week-of-year
// [MONTH_END_WEEKS[m-2] (or 0), MONTH_END_WEEKS[m-1]). The 5-week months are
// 3, 6, 9, 12 — the season-closing months.
const MONTH_END_WEEKS = Object.freeze([4, 8, 13, 17, 21, 26, 30, 34, 39, 43, 47, 52]);

// The year opens in SPRING — createDefaultWorldState seeds {month:1,
// season:'spring'} and that seeded default is the documented intent. (The array
// used to start at winter, so the very first tick flipped a fresh campaign
// spring->winter and the pressure model's +0.08 winter food bias skewed early
// famines.) Seasons derive from WEEK-OF-YEAR as four 13-week quarters (weeks
// 0-12 spring … 39-51 winter); under the 4-4-5 month grid those quarters are
// exactly months 1-3 / 4-6 / 7-9 / 10-12, so month labels and season labels
// never disagree. Mid-campaign saves shift their season LABEL at most one step
// on the next tick; pressure bias stays consistent with the label.
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];

/**
 * @param {any} value
 * @param {number} [fallback]
 */
function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

// stablePart moved to the dependency-free leaf ./stablePart.js (W2b byte-budget
// extraction) so the eager tier-outcome applier mints identical ids without
// importing this module; imported above (this module still uses it) and
// re-exported verbatim — every consumer is unchanged.
export { stablePart };

/** @param {any} value */
function cloneArray(value) {
  return Array.isArray(value) ? value.map((/** @type {any} */ item) => ({ ...item })) : [];
}

// Stressors are special: each item carries NESTED mutable structures
// (affectedSettlementIds, severityBySettlement, causes). A shallow `{...item}`
// (cloneArray) would alias those nested arrays/objects into the per-tick snapshot,
// so any future in-place mutation of one (push/splice/index-assign, instead of the
// normalizeStressor rebuild every current writer uses) would corrupt the persisted
// pre-tick record and break determinism. Deep-clone each stressor through the
// sanctioned seam so the snapshot can never alias live nested state. The cloned
// values are deeply EQUAL to the source, so the dormancy / byte-identity invariants
// are unaffected — this only removes the aliasing fragility the shallow clone relied
// on an unenforced "writers always rebuild" convention to stay safe.
/** @param {any} value */
function cloneStressors(value) {
  return Array.isArray(value) ? value.map((/** @type {any} */ item) => deepClone(item)) : [];
}

/** @param {any} value */
function cloneObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? { ...value } : {};
}

// cloneObject is SHALLOW. Nested simulation ledgers (dispositionStats, deployments,
// and later pantheon) are read inside the per-tick snapshot and mutated across
// ticks, so a shallow copy would let a snapshot alias live state and corrupt
// determinism. These ledgers route through deepClone (the sole sanctioned clone
// seam) instead. Non-objects normalize to an empty ledger.
/** @param {any} value */
function deepCloneLedger(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? deepClone(value) : {};
}

// WR-1 persistence law: deployments are a durable war ledger, but their founding
// casus list is a CLOSED taxonomy rather than an arbitrary import surface. Rebuild
// the outer ledger in deterministic key order, retain every deployment field, and
// keep only well-shaped reasons whose type the live taxonomy knows. An invalid or
// exhausted casus list disappears instead of surviving as an empty artifact. The
// whole input is cloned first, so retained nested receipts never alias the loaded
// save; no schema bump is needed because the additive field remains optional.
/** @param {unknown} value */
function normalizeDeployments(value) {
  const cloned = deepCloneLedger(value);
  /** @type {Record<string, unknown>} */
  const normalized = {};
  for (const key of Object.keys(cloned).sort(compareCodepoint)) {
    const record = cloned[key];
    if (!record || typeof record !== 'object' || Array.isArray(record)) {
      normalized[key] = record;
      continue;
    }
    const next = { ...record };
    if (Object.prototype.hasOwnProperty.call(next, 'casusReasons')) {
      const reasons = Array.isArray(next.casusReasons)
        ? next.casusReasons.filter((/** @type {unknown} */ reason) => (
          reason && typeof reason === 'object' && !Array.isArray(reason)
          && isWarReasonType((/** @type {Record<string, unknown>} */ (reason)).type)
        ))
        : [];
      if (reasons.length) next.casusReasons = reasons;
      else delete next.casusReasons;
    }
    // WR-6: `joinLedger` is exactly one closed anchor, never an extensible
    // membership surface.  Validate it against the owning deployment key and
    // target; malformed, empty, or multi-row imports disappear fail-closed.
    if (Object.prototype.hasOwnProperty.call(next, 'joinLedger')) {
      const anchor = Array.isArray(next.joinLedger) && next.joinLedger.length === 1
        && Number.isInteger(Number(next.sinceTick)) && Number(next.sinceTick) >= 0
        ? normalizeJoinAnchor(next.joinLedger[0], key, next.targetId, next.sinceTick)
        : null;
      if (anchor) next.joinLedger = [anchor];
      else delete next.joinLedger;
    }
    normalized[key] = next;
  }
  return normalized;
}

// CONDITIONAL ledger clone (the pantheon). UNLIKE the additive ledgers above, the
// pantheon is CONDITIONALLY MATERIALIZED: it must be ABSENT from worldState while
// religion is dormant so a legacy/deity-free campaign stays byte-identical under
// the dormancy oracle (which treats an absent key as `{}`). So this returns
// `undefined` (key omitted by the conditional spread below) when the value is
// absent or empty, and a DEEP clone of a present, non-empty pantheon otherwise —
// never the `{}` default deepCloneLedger materializes unconditionally.
/** @param {any} value */
function deepCloneConditionalLedger(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  if (Object.keys(value).length === 0) return undefined;
  return deepClone(value);
}

// FIRST-PAINT TRUST BOUNDARY. Live world state has already crossed persisted
// hydration or the envoy family's single writer. The hot normalizer therefore
// preserves and DEEP-clones the admitted rows; it must not import the cold,
// strict DTO family. Raw cache/cloud/RPC rows enter through
// worldStateHydration.js, which injects that validator into the same body below.
// @enforced-by tests/build/envoyPersistenceHydrationLazy.test.js
function cloneAdmittedEnvoyErrands(value) {
  return Array.isArray(value) ? deepClone(value) : [];
}

// DEEP-FREEZE (idempotent): recursively Object.freeze an object/array graph. Used
// for the spatialDigest — an immutable-by-contract ledger (worldState.js catalog:
// "authored ONCE … never recomputed") that ensureWorldState now shares BY REFERENCE
// instead of deep-cloning ~11×/tick (performance-scale-2). Object.isFrozen
// short-circuits at the top: the FIRST ensure of a fresh (canonize- or reload-
// hydrated) digest freezes its whole graph once, every subsequent ensure returns
// immediately AND hands back the SAME object identity — which restores the
// distanceRead WeakMap route memos to true once-per-canonize semantics
// (performance-scale-3). WE are the sole freezer and no writer in src mutates the
// digest (verified across the tree), so top-frozen ⟺ deep-frozen holds and the
// freeze turns the never-written contract into an enforced guarantee (a stray write
// throws in strict mode / test). Byte-output is unchanged: freeze alters no
// enumerable value or key order, so a shared-frozen digest serializes identically to
// the deep clone it replaces (the goldens prove it by running).
/** @param {unknown} value @returns {unknown} */
export function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  // NEVER freeze an Immer draft: Object.freeze on a draft proxy violates the proxy's
  // ownKeys invariant ('type_' trap error) and would poison the produce in progress.
  // ensureWorldState runs inside store producers, so a digest reached THROUGH a draft
  // is shared un-frozen for that pass; the finished plain object freezes on its next
  // ensure (load/read paths), so the immutability guarantee and the reference-sharing
  // win (performance-scale-2/3) both hold on every non-draft state.
  if (isDraft(value)) return value;
  Object.freeze(value);
  // Object.values covers arrays (elements) AND objects (own enumerable values) alike.
  for (const item of Object.values(/** @type {Record<string, unknown>} */ (value))) deepFreeze(item);
  return value;
}

// FROZEN conditional ledger (the spatial digest). Mirrors deepCloneConditionalLedger's
// dormancy semantics (absent / non-object / empty ⇒ key omitted), but SHARES the raw
// value BY REFERENCE after deep-freezing it, rather than deep-cloning. Safe precisely
// because the value is immutable by contract (see deepFreeze) — the no-alias invariant
// the deep clone protected is instead guaranteed by immutability.
/** @param {unknown} value */
function freezeConditionalLedger(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  if (Object.keys(value).length === 0) return undefined;
  return deepFreeze(value);
}

// The conditional ledgers that are IMMUTABLE by contract — materialized by reference
// (deep-frozen) instead of deep-cloned. Only the spatialDigest qualifies: it is
// authored once at the canonize seam and never recomputed or mutated. Every other
// conditional ledger (pantheon, religionStates, spatialLedgers, the mover ledgers, …)
// is written across ticks and MUST keep deep-cloning to avoid pre-tick-snapshot aliasing.
const FROZEN_CONDITIONAL_LEDGER_KEYS = new Set(['spatialDigest']);

// Forward-compatible VERSIONED worldState migration chain. Modelled on
// settlementMigrations: each entry bumps a breaking shape, while additive ledgers
// still normalize from absence without a schema bump. Same-version nested repairs
// run explicitly after this ordered chain (see runWorldStateMigrations below).
/** @type {ReadonlyArray<{ to: number, migrate: (raw: any) => any }>} */
const WORLD_STATE_MIGRATIONS = Object.freeze([
  // v2 — the per-settlement pantheon renamed its leading deity from "chief" to
  // "patron", unifying vocabulary with the DM "Assign patron deity" action. Rename
  // the persisted religionStates keys in place. IDEMPOTENT: migrations run
  // unconditionally, so a state already carrying patronRef (or no religionStates at
  // all) passes through untouched.
  { to: 2, migrate: (/** @type {any} */ raw) => {
    const states = raw?.religionStates;
    if (!states || typeof states !== 'object' || Array.isArray(states)) return raw;
    let touched = false;
    /** @type {Record<string, any>} */
    const next = {};
    for (const [cid, st] of Object.entries(states)) {
      if (st && typeof st === 'object' && !Array.isArray(st)
        && ('chiefRef' in st || 'chiefHeld' in st || 'chiefChallengeTicks' in st)) {
        touched = true;
        const { chiefRef, chiefHeld, chiefChallengeTicks, ...rest } = /** @type {any} */ (st);
        next[cid] = {
          ...rest,
          ...(chiefRef !== undefined ? { patronRef: chiefRef } : {}),
          ...(chiefHeld !== undefined ? { patronHeld: chiefHeld } : {}),
          ...(chiefChallengeTicks !== undefined ? { patronChallengeTicks: chiefChallengeTicks } : {}),
        };
      } else {
        next[cid] = st;
      }
    }
    return touched ? { ...raw, religionStates: next, schemaVersion: 2 } : raw;
  } },
]);

/** @param {any} raw */
export function runWorldStateMigrations(raw = {}) {
  const input = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  const versioned = WORLD_STATE_MIGRATIONS.reduce((state, step) => step.migrate(state), input);
  // Treaty clock markers are a SAME-VERSION nested migration: the outer world
  // shape remains v2, while pre-correction treaties retain their historical
  // twelve-tick horizons and marked treaties preserve their authored clock.
  return migrateTreatyClockMarkers(versioned);
}

/** @param {any} campaign */
export function createDefaultWorldState(campaign = {}) {
  const seedPart = campaign.id || campaign.name || 'campaign';
  return {
    schemaVersion: WORLD_STATE_SCHEMA_VERSION,
    canonizedAt: null,
    tick: 0,
    calendar: {
      elapsedWeeks: 0,
      elapsedMonths: 0,
      month: 1,
      year: 1,
      season: 'spring',
    },
    rngSeed: `world-pulse:${seedPart}`,
    volatility: 'normal',
    simulationRules: normalizeSimulationRules(),
    stressors: [],
    relationshipStates: {},
    npcStates: {},
    factionStates: {},
    proposals: [],
    pulseHistory: [],
    settlementTickStates: {},
    // Campaign-clock: player events/edits authored on clock-bound member
    // settlements queue here and resolve simultaneously at the next pulse tick.
    pendingEvents: [],
    // Additive simulation ledgers (the geopolitical layer). Empty on a fresh
    // world; populated by later phases (dispositionStats: cross-settlement
    // win/loss disposition memory; deployments: active army records;
    // tradeWarState: per-prize primary-supplier crown + flip cooldown;
    // warExhaustion: the NON-REVERTING per-home war-exhaustion scar that
    // ratchets up with sustained deployment and decays only slowly, closing the
    // homeostasis loop). A legacy keyless save normalizes equal to these empties —
    // byte-neutral under the dormancy oracle. `pantheon` is intentionally NOT here
    // (it is conditional).
    dispositionStats: {},
    deployments: {},
    tradeWarState: {},
    warExhaustion: {},
  };
}

// The CONDITIONALLY-MATERIALIZED worldState ledgers, in their RESULT-SPREAD
// ORDER (load-bearing: the order below IS the serialized key order, and the
// dormancy oracle / byte-identity goldens pin serialized bytes — append only).
// Each is ABSENT while its subsystem is dormant (so a legacy campaign
// serializes byte-identically to today under the dormancy oracle) and
// DEEP-cloned when present so a pre-tick snapshot never aliases live state:
//   • pantheon         — the deity ledger (wins/losses/seats/tier).
//   • religionStates   — per-settlement pantheon (deities/shares/niches/patron).
//   • warPosture       — per-settlement mobilization posture ({ id -> { state,
//                        progress, sinceTick, covert } }); absent while at peace.
//   • occupations      — per-OCCUPIED-settlement occupation state (occupierId,
//                        state, sinceTick, resistance, …); absent until conquest.
//   • pausedAdvance    — the paused-Advance cursor (Advance-scaling Stage 3);
//                        clearing the pause drops the key back to absent.
//   • martialReadiness — per-settlement { readiness01, experience01 } (W-F8);
//                        absent until a settlement first arms under a patron.
//   • conquestFeeds    — per-victor decaying loot/captive pulses (W-C2); decays
//                        back to absent.
//   • mercenaryMarket  — per-settlement rented-force market (W-C2).
//   • rulesetLog       — ruleset-change receipts (CL-0), an OBJECT keyed
//                        rc_<tick>_<seq> (deepCloneConditionalLedger rejects
//                        arrays); absent until the first effective rules edit.
//   • spatialDigest    — the FROZEN spatial canon digest (Phase 5.5 KEYSTONE):
//                        an OBJECT { spatialGeometryVersion, costLawVersion,
//                        overlayVersion, costField, territory, gates, tiers,
//                        distanceMatrix, routeReceipts, reserved:{…} } authored
//                        ONCE at an entitled spatial canonize and never
//                        recomputed. Absent until an explicit spatial opt-in
//                        (see the spatialCanonVersion marker below) ⇒ every
//                        aspatial/legacy campaign serializes byte-identically.
//                        deepCloneConditionalLedger rejects arrays, so the digest
//                        is object-shaped at the top level (its costField /
//                        distanceMatrix arrays live INSIDE that object).
//   • spatialLedgers   — the Phase 5.5 SPATIAL LEDGER NAMESPACE (FP-R): the ONE
//                        conditional container for every spatial mover ledger, so
//                        the eager array carries ONE name for the whole family and
//                        a NEW mover ledger costs ZERO first-paint bytes (it nests
//                        here via distanceRead.js's setSpatialLedger, invisible to
//                        this array). Materialized ONLY when ≥1 sub-ledger is
//                        present (deepCloneConditionalLedger drops an empty object;
//                        dropSpatialLedger drops the namespace when its last
//                        sub-ledger drains) ⇒ an aspatial/legacy campaign carries no
//                        `spatialLedgers` key and serializes byte-identically. The
//                        deep-clone-no-alias invariant is preserved: the whole
//                        namespace is deep-cloned (recursively — every sub-ledger
//                        fresh) exactly as each top-level ledger was before. The
//                        sub-ledgers (each accessed via distanceRead.js, live path
//                        `worldState.spatialLedgers.<key>`) are:
//                          · spatialArrivals — propagation ARRIVAL QUEUE (5.5-M):
//                            cross-settlement impacts IN TRANSIT, impact id →
//                            { arrivalTick, targetId, sourceId, impact }; present
//                            while something travels.
//                          · rumorLedgers    — per-settlement RUMOR ledgers (STEP
//                            3.5, spatial/rumorNetwork.js): { settlementId →
//                            { 'trade:<eventRef>' → arrival record } }, top-K
//                            bounded, tick-age expiry; present under a live infoMode
//                            ('perfect_delayed'/'unreliable'). Dialling infoMode back
//                            to omniscient PRESERVES an existing ledger.
//                          · beliefMaps      — per-settlement BELIEF maps (WAVE A,
//                            worldPulse/beliefMap.js): { observerId → { factionId →
//                            { subjectId → belief record } } }; present under a live
//                            infoMode (same gate as rumorLedgers).
//                          · embattlement    — per-region EMBATTLEMENT scalar ledger
//                            (M1, spatial/embattlement.js): { settlementId →
//                            { level, phase, sinceTick, lastTick } } — a CONTINUOUS
//                            0..1 danger scalar with a hysteresis latch; present for
//                            settlements under threat (sparse).
//                          · supplyShipments — IN-TRANSIT supply-shipment ledger
//                            (M2, spatial/supplyShipments.js): ONE record per ACTIVE
//                            LINK, keyed `${settlementId}:${institutionId}:${input}`
//                            → { institutionId, settlementId, input, sourceId,
//                            arrivalTick, starving } — AGGREGATE; present while a
//                            caravan rides or a link starves (sparse).
//                          · commodityStocks — per-(settlement,good) QUANTITY stock
//                            (M6a, spatial/commodityFlow.js): { settlementId →
//                            { goodId → units } }; present under the commodity-flow
//                            opt-in where activeChains produce/consume (sparse).
//                          · entrepots       — per-settlement EARNED CENTRALITY + toll
//                            (M6b, spatial/entrepots.js): { settlementId →
//                            { centrality, toll, since, lastTick } } — centrality from
//                            REAL gate-crossings, a rent-bounded toll that joins the M1
//                            re-score; present for settlements trade flows through under
//                            the commodity-flow opt-in (sparse).
//                          · tradeFlow        — per-settlement ARRIVALS TALLY (M6d,
//                            spatial/tradeFlow.js): { settlementId →
//                            { in, out, lastTick } } — a WINDOWED (decayed),
//                            modality-weighted throughput count (goods in + out) written
//                            from the arrivals the supply kernel used to discard;
//                            DISPLAY SUBSTRATE ONLY (never writes economicState — the
//                            generation baseline is sacred). The flow-derived economics
//                            drift (display/tradeFlowEconomics.js) reads it; present
//                            under the commodity-flow opt-in while goods move (sparse).
// Exported for the public-snapshot deny-census walker (tests/security/
// worldSnapshotDenyCensus.test.js), which asserts WORLD_SNAPSHOT_HARD_DENY covers every
// conditional ledger except the public allowlist (security-privacy-r2-1). Export-only —
// no production consumer imports this from here (the serializer stays decoupled).
export const CONDITIONAL_LEDGER_KEYS = Object.freeze([
  'pantheon', 'religionStates', 'warPosture', 'occupations', 'pausedAdvance',
  'martialReadiness', 'conquestFeeds', 'mercenaryMarket', 'rulesetLog',
  'spatialDigest', 'spatialLedgers',
  // E0 NARRATIVE TEMPO GOVERNOR — APPENDED AT THE END ONLY (the array order IS the
  // serialized key order, pinned by the dormancy/golden oracle). Mutates each tick,
  // so it takes the mutable deepCloneConditionalLedger branch (NOT the FROZEN set).
  // Absent/empty ⇒ key omitted ⇒ byte-identical-dormant.
  'narrativeTempo',
  // W-DOCTRINE-4 SETTLEMENT POLITICS — the per-settlement bloc ledger
  // (worldState.politicsLedgers, DESIGN_SETTLEMENT_POLITICS §1): { cid → { blocs: [
  //   { id, members[], glue[], end, strain, sinceTick, covert? } ] } }, HARD CAP 3
  // blocs/settlement. Mutable across ticks (blocs strain/realign/dissolve), so it
  // rides the mutable deepCloneConditionalLedger branch. Materialized ONLY when the
  // settlementPolitics mover forms ≥1 bloc under its virtual flag; absent/empty ⇒
  // key omitted ⇒ byte-identical-dormant (the narrativeTempo precedent). APPEND-ONLY.
  'politicsLedgers',
  // D-7c FACTION-PAIR LEDGER (worldState.factionPairStates, DESIGN_DEEP_COUPLINGS D-7c):
  // { pairKey → { trust, resentment, ... } } — mutable across ticks (pair trust/resentment
  // build + decay), additive, absent-when-dark, drop-when-empty: identical lifecycle to
  // politicsLedgers/narrativeTempo. Missing from this list left it BOTH un-empty-stripped
  // (an empty {} survived ensureWorldState, breaking dormancy byte-identity) and un-deep-
  // cloned (undo/clone shared the ledger by reference). Rides the mutable
  // deepCloneConditionalLedger branch. Materialized ONLY under the memoryWeave flag;
  // absent/empty ⇒ key omitted ⇒ byte-identical-dormant. APPEND-ONLY. [lifecycle-2]
  'factionPairStates',
  // WR-7a THE ERRAND — the only top-level conditional ARRAY.  Accepted peace
  // offers can remain physically in transit across save/reload and undo, so the
  // durable traveller rows belong in worldState rather than proposal or news
  // state.  The owning normalizer validates, bounds, sorts, and deep-clones the
  // closed records; absent/non-array/empty ⇒ key omitted. APPEND-ONLY.
  'envoyErrands',
]);

// The spatial-canon MARKER (Phase 5.5 KEYSTONE) is a conditionally-present SCALAR
// (not a ledger, so it is NOT in CONDITIONAL_LEDGER_KEYS): the positive-integer
// `spatialCanonVersion`, stamped ONLY by an explicit spatial opt-in at the
// canonize seam. Its PRESENCE is the dormancy/premium gate every spatial reader
// keys on — NEVER the pre-existing canonizedAt (which is true for essentially
// every campaign in the wild, so gating on it would retro-light the installed
// base and break byte-identity). ensureWorldState materializes it only when the
// raw carries a valid version, so an aspatial/legacy save (no marker) is
// byte-identical forever. A valid version is a positive integer.
/** @param {number} value  the raw persisted marker candidate — runtime-defended
 *  (Number.isInteger) so a garbage persisted value still normalizes to null */
function normalizeSpatialCanonVersion(value) {
  return Number.isInteger(value) && value > 0 ? value : null;
}

/**
 * Shared world-state materializer. The third argument is an internal composition
 * seam: eager live callers use the deep structural clone; the cold persisted
 * hydrator injects the envoy family's strict validator exactly once.
 */
export function ensureWorldStateWithEnvoyNormalizer(
  rawInput = {},
  campaign = {},
  normalizeEnvoyRows = cloneAdmittedEnvoyErrands,
) {
  const raw = runWorldStateMigrations(rawInput);
  const base = createDefaultWorldState(campaign);
  const calendar = raw?.calendar && typeof raw.calendar === 'object' ? raw.calendar : {};
  const tick = Math.max(0, Math.floor(finite(raw?.tick, 0)));
  const simulationRules = normalizeSimulationRules(raw?.simulationRules);
  // The SHALLOW `...cloneObject(raw)` spread would otherwise carry a
  // present-but-EMPTY conditional ledger (e.g. `pantheon:{}`) through to the
  // result, breaking dormancy. Strip every conditional key from the shallow
  // spread; the conditional deep-clone pass below is the SOLE source of those
  // keys — each materialized only when present and non-empty.
  const shallowRaw = cloneObject(raw);
  // Spatial-canon marker (Phase 5.5 KEYSTONE): a conditionally-present SCALAR gate.
  // Strip it from the shallow spread and re-materialize it ONLY when the raw
  // carries a valid positive-integer version — so a legacy/aspatial save (no
  // marker) serializes byte-identically (absent === no key) and a garbage value
  // (string / non-positive / float) can never leak through unnormalized.
  if ('spatialCanonVersion' in shallowRaw) delete shallowRaw.spatialCanonVersion;
  const spatialCanonVersion = normalizeSpatialCanonVersion(raw?.spatialCanonVersion);
  /** @type {Record<string, unknown>} */
  const conditionalLedgers = {};
  for (const key of CONDITIONAL_LEDGER_KEYS) {
    if (key in shallowRaw) delete shallowRaw[key];
    // The FROZEN keys (spatialDigest) are shared by reference (deep-frozen) so the
    // ~11 ensures per tick stop cloning the 47-400KB digest and hand back a stable
    // identity; every other conditional ledger deep-clones (mutable across ticks).
    const materialized = key === 'envoyErrands'
      ? normalizeEnvoyRows(raw?.[key])
      : FROZEN_CONDITIONAL_LEDGER_KEYS.has(key)
        ? freezeConditionalLedger(raw?.[key])
        : deepCloneConditionalLedger(raw?.[key]);
    if (Array.isArray(materialized)
      ? materialized.length > 0
      : materialized !== undefined) conditionalLedgers[key] = materialized;
  }
  return {
    ...base,
    ...shallowRaw,
    schemaVersion: WORLD_STATE_SCHEMA_VERSION,
    canonizedAt: raw?.canonizedAt || null,
    tick,
    calendar: {
      ...base.calendar,
      ...calendar,
      // Canonical integer weeks — tolerant read (new elapsedWeeks, else the
      // legacy 0.25/week months × 4). The months fallback must be the SAME
      // normalized value written below (including the legacy-keyless top-level
      // raw.elapsedMonths lift), or an old keyless save would read weeks 0
      // beside months 9 and the next advance would reset the clock. Idempotent:
      // re-ensuring a normalized state reads back the same integer. NO save
      // migration; the legacy elapsedMonths field is preserved as stored.
      elapsedWeeks: weeksFromCalendar({
        elapsedWeeks: calendar.elapsedWeeks,
        elapsedMonths: Math.max(0, finite(calendar.elapsedMonths, finite(raw?.elapsedMonths, 0))),
      }),
      elapsedMonths: Math.max(0, finite(calendar.elapsedMonths, finite(raw?.elapsedMonths, 0))),
      month: Math.max(1, Math.floor(finite(calendar.month, 1))),
      year: Math.max(1, Math.floor(finite(calendar.year, 1))),
      season: calendar.season || base.calendar.season,
    },
    rngSeed: raw?.rngSeed || base.rngSeed,
    volatility: ['calm', 'normal', 'turbulent'].includes(raw?.volatility) ? raw.volatility : base.volatility,
    simulationRules,
    stressors: cloneStressors(raw?.stressors),
    relationshipStates: cloneObject(raw?.relationshipStates),
    npcStates: cloneObject(raw?.npcStates),
    factionStates: cloneObject(raw?.factionStates),
    proposals: cloneArray(raw?.proposals).slice(-MAX_PROPOSALS),
    pulseHistory: cloneArray(raw?.pulseHistory).slice(-MAX_HISTORY),
    settlementTickStates: cloneObject(raw?.settlementTickStates),
    pendingEvents: cloneArray(raw?.pendingEvents).slice(-MAX_PENDING),
    // DEEP-cloned (not the shallow `...cloneObject(raw)` spread above) so a
    // pre-tick snapshot never aliases live ledger state across ticks.
    // WR-2 is a same-schema, flag-gated extension of the EXISTING ledger. Absent or
    // explicit false preserves the legacy shape exactly. Only an explicit true folds
    // the old signed score into martial stock and materializes the other neutral
    // channels; dispositionLedger owns that migration so it remains the one writer.
    dispositionStats: simulationRules.dispositionChannelsEnabled === true
      ? migrateDispositionStats(deepCloneLedger(raw?.dispositionStats), tick)
      : deepCloneLedger(raw?.dispositionStats),
    deployments: normalizeDeployments(raw?.deployments),
    tradeWarState: deepCloneLedger(raw?.tradeWarState),
    warExhaustion: deepCloneLedger(raw?.warExhaustion),
    // Spatial-canon marker — present ONLY when the raw carried a valid version
    // (spread from a single-key object so an absent marker adds no key at all,
    // keeping every aspatial save byte-identical). Its presence gates the
    // spatialDigest reader; it serializes just before the conditional ledgers.
    ...(spatialCanonVersion !== null ? { spatialCanonVersion } : {}),
    // The conditionally-materialized ledgers, in CONDITIONAL_LEDGER_KEYS order
    // (see the catalog comment above ensureWorldState — that order IS the
    // serialized key order the byte-identity invariants pin). Each key appears
    // ONLY when its deep-cloned value is present and non-empty.
    ...conditionalLedgers,
  };
}

/**
 * Hot/live normalization. `envoyErrands` must already be admitted; persisted or
 * otherwise untrusted worlds must use `hydratePersistedWorldState` from the cold
 * hydration module instead.
 */
export function ensureWorldState(rawInput = {}, campaign = {}) {
  return ensureWorldStateWithEnvoyNormalizer(
    rawInput,
    campaign,
    cloneAdmittedEnvoyErrands,
  );
}

/**
 * @param {any} worldState
 * @param {any} [now]
 * @param {any} [campaign]
 */
export function canonizeWorldState(worldState, now = wallClockNow(), campaign = {}) {
  const current = ensureWorldState(worldState, campaign);
  return {
    ...current,
    canonizedAt: now,
  };
}

/**
 * Canonical integer elapsed weeks for a stored calendar — the TOLERANT READ.
 * New-format calendars carry `elapsedWeeks` (integer, authoritative). Legacy
 * saves carry only `elapsedMonths`, which every pre-4-4-5 writer accumulated at
 * exactly 0.25/week (4-week months), so weeks = months × 4 recovers the integer
 * exactly; Math.round guards float residue. NO save migration — old shapes read
 * losslessly forever, and the next advance writes the new field alongside.
 * @param {{elapsedWeeks?: number|null, elapsedMonths?: number|null}|null|undefined} calendar
 * @returns {number}
 */
function weeksFromCalendar(calendar = {}) {
  const direct = finite(calendar?.elapsedWeeks, NaN);
  if (Number.isFinite(direct)) return Math.max(0, Math.floor(direct));
  return Math.max(0, Math.round(finite(calendar?.elapsedMonths, 0) * 4));
}

/**
 * Derive the full display calendar from canonical integer elapsed weeks — the
 * ONLY place week-of-year becomes month/year/season labels. 4-4-5 grid: month
 * from the cumulative MONTH_END_WEEKS table, season = 13-week quarter, year
 * rolls at week 52. `elapsedMonths` is retained as a DERIVED legacy field
 * (weeks × 12/52 = weeks × 3/13; a full year lands exactly 12) so persisted
 * shapes and public snapshots keep the key — it is never read back for
 * advancement when elapsedWeeks is present.
 * @param {number} elapsedWeeks
 */
function calendarFromWeeks(elapsedWeeks) {
  const weeks = Math.max(0, Math.floor(finite(elapsedWeeks, 0)));
  const weekOfYear = weeks % WEEKS_PER_YEAR;
  const year = Math.floor(weeks / WEEKS_PER_YEAR) + 1;
  const monthIdx = MONTH_END_WEEKS.findIndex((end) => weekOfYear < end);
  const month = monthIdx === -1 ? MONTHS_PER_YEAR : monthIdx + 1;
  const season = SEASONS[Math.floor(weekOfYear / WEEKS_PER_SEASON)] || 'spring';
  return {
    elapsedWeeks: weeks,
    elapsedMonths: (weeks * 3) / 13,
    month,
    year,
    season,
  };
}

/**
 * SEASONS-A: the season clock — a PURE function of the canonical week tick
 * (worldState.js owns the calendar law; the 13-week quarters ARE the seasons).
 * Agrees with calendarFromWeeks' season label by construction (same SEASONS
 * table, same quarter math). weekOfYear/weekOfSeason are 1-based (spring is
 * weeks 1-13). No state, no rng.
 * @param {number} weekTick  canonical elapsed weeks (calendar.elapsedWeeks)
 */
export function seasonForTick(weekTick) {
  const weeks = Math.max(0, Math.floor(finite(weekTick, 0)));
  const weekOfYear = weeks % WEEKS_PER_YEAR;
  return {
    season: SEASONS[Math.floor(weekOfYear / WEEKS_PER_SEASON)] || 'spring',
    weekOfYear: weekOfYear + 1,
    weekOfSeason: (weekOfYear % WEEKS_PER_SEASON) + 1,
    year: Math.floor(weeks / WEEKS_PER_YEAR) + 1,
  };
}

/**
 * Advance the display calendar by one DM interval. INTEGER WEEKS ARE CANONICAL:
 * the prior week count is read tolerantly (weeksFromCalendar), the interval's
 * week count (INTERVAL_WEEKS) is added, and every label re-derives from the sum
 * (calendarFromWeeks) — no float accumulation anywhere, so one coarse call and
 * its decomposed one-week walk land byte-identical calendars by construction.
 * Note the DM one_month interval is 4 weeks: on a 5-week label-month it
 * advances slightly less than one month label (13 four-week advances = exactly
 * one year) — accepted under the 4-4-5 ruling.
 * @param {any} calendar
 * @param {string} [interval]
 */
export function advanceWorldCalendar(calendar = {}, interval = 'one_month') {
  const stepWeeks = /** @type {Record<string, number>} */ (INTERVAL_WEEKS)[interval] ?? INTERVAL_WEEKS.one_month;
  return calendarFromWeeks(weeksFromCalendar(calendar) + stepWeeks);
}

/**
 * @param {any} outcome
 * @param {any} tick
 */
export function proposalIdFor(outcome, tick) {
  return [
    'world_proposal',
    tick,
    stablePart(outcome.type),
    stablePart(outcome.targetSaveId || outcome.relationshipKey || outcome.id),
    stablePart(outcome.candidateId || outcome.id),
  ].join('.');
}

/**
 * @param {any} campaignId
 * @param {any} tick
 */
export function pulseIdFor(campaignId, tick) {
  return `world_pulse.${stablePart(campaignId)}.${tick}`;
}

/**
 * @param {any} worldState
 * @param {any} record
 */
export function appendPulseHistory(worldState, record) {
  const current = ensureWorldState(worldState);
  const next = [...current.pulseHistory, record].slice(-MAX_HISTORY);
  return { ...current, pulseHistory: next };
}

/**
 * @param {any} worldState
 * @param {any} proposal
 */
export function upsertProposal(worldState, proposal) {
  const current = ensureWorldState(worldState);
  const byId = new Map(current.proposals.map((/** @type {any} */ item) => [item.id, item]));
  byId.set(proposal.id, { ...(byId.get(proposal.id) || {}), ...proposal });
  const all = [...byId.values()];
  // Under the ring cap: unchanged — byte-identical to the historical
  // `.slice(-MAX_PROPOSALS)` (a no-op when there are ≤ MAX_PROPOSALS records).
  if (all.length <= MAX_PROPOSALS) {
    return { ...current, proposals: all };
  }
  // Over the cap. The historical blind `.slice(-MAX_PROPOSALS)` dropped the
  // OLDEST records regardless of status — so under a forcing mode (dm_only /
  // recommendations), a long advance minting hundreds of proposals could evict
  // a PENDING decision the DM never saw, with no trace (worldpulse-tick-core-2).
  // Evict in a status-aware, always-receipted order instead.
  const stamp = proposal?.updatedAt || proposal?.createdAt || wallClockNow();
  let overflow = all.length - MAX_PROPOSALS;
  // Pass 1 — prune RESOLVED records first (any non-pending status: applied /
  // dismissed / expired / refused). They were already surfaced when they
  // resolved, so their eviction is lossless.
  const afterResolved = [];
  for (const p of all) {
    if (overflow > 0 && p && p.status && p.status !== 'pending') { overflow -= 1; continue; }
    afterResolved.push(p);
  }
  if (overflow <= 0) {
    return { ...current, proposals: afterResolved };
  }
  // Pass 2 — a forcing-mode PENDING flood still exceeds the ring. The OLDEST
  // pending overflow is EXPIRE-TO-DECLINED: a visible status transition
  // (mirroring expireStaleActorMajors) so the DM sees a declined record instead
  // of a silently-vanished pending one. The stamp IS the receipt; the record is
  // retained as a terminal 'expired' entry, so it becomes the first pruned by
  // Pass 1 on the next upsert — the ring stays bounded (≈ MAX_PROPOSALS, plus
  // the recycling tombstone). Cap-raising / √N scaling for forcing modes is
  // W-R2-DEPTH's D2c — out of scope here; this is only the receipted eviction.
  const declined = afterResolved.map((p) => {
    if (overflow > 0 && p && p.status === 'pending') {
      overflow -= 1;
      return { ...p, status: 'expired', expiredAt: stamp, updatedAt: stamp, evictionReason: 'ring_overflow' };
    }
    return p;
  });
  return { ...current, proposals: declined };
}

/**
 * @param {any} worldState
 * @param {any} proposalId
 * @param {any} status
 * @param {any} [patch]
 */
export function updateProposalStatus(worldState, proposalId, status, patch = {}) {
  const current = ensureWorldState(worldState);
  return {
    ...current,
    proposals: current.proposals.map((/** @type {any} */ proposal) => (
      proposal.id === proposalId
        ? { ...proposal, ...patch, status, updatedAt: patch.updatedAt || wallClockNow() }
        : proposal
    )),
  };
}
