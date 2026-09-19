/**
 * lifecycleRoundTrip.test.js — ENFORCER E-C: THE STATE-LIFECYCLE ROUND-TRIP
 * WALKER (A+ bar 12, docs/THE_APLUS_EXECUTION_ARCHITECTURE.md §E-C).
 *
 * CONTRACT: no write orphaned by any path. For every persisted state family the
 * walker (a) proves BYTE-EXACT survival through the lifecycle hops that apply to
 * it — create → persist/serialize → re-derive (the ensure/normalize fixpoint) →
 * undo → clone → migrate → import/reload — and (b) holds a COMPLETENESS
 * REGISTRY: a new persisted family left unregistered REDS this file, so the
 * orphaned-write class cannot silently regrow (the save-museum idiom extended
 * from SAMPLED eras to the registered COMPLETE family set).
 *
 * THE THREE PERSISTENCE SUBSTRATES (there is deliberately no single chokepoint):
 *   A. zustand persist `settlementforge` (localStorage) — settings/toggles only
 *      (src/store/index.js partialize; rehydrate = persistMerge.js).
 *   B. the saves envelope — localStorage `dnd_settlement_saves` in local mode,
 *      the `settlements` table via src/lib/saves.js when configured.
 *   C. the campaign record — localStorage `sf_campaigns[:owner]` via
 *      src/lib/campaigns.js (+ cloud sync); worldState / mapState / wizardNews /
 *      regionalGraph are FAMILIES NESTED INSIDE this record.
 * This file runs everything through the REAL modules with ONLY supabase.js
 * mocked off (the saveMuseum.test.js idiom), so substrates bind their genuine
 * localStorage persistence paths — services are never stubbed here.
 *
 * HOW TO REGISTER A NEW FAMILY (when a completeness test reds on your change):
 *   1. Decide the key's lifecycle: is it persisted? backfilled by its load
 *      chokepoint (migrateCampaign / migrateSaveToV2 / ensureWorldState)?
 *      restored or deliberately untouched by pulse undo?
 *   2. Add it to the matching registry below WITH those policy fields — the
 *      undo/backfill walkers read the policies, so registration buys coverage.
 *   3. If it must NOT persist, add it to SESSION_ONLY_FAMILIES with the reason.
 *   Never widen a scan or delete a registry row to silence a red — a red here
 *   means a write path and a read path disagree, which is the bug class itself.
 *
 * BYTE-COMPARE EXCLUSIONS (deliberate, verified against src): pulse undo
 * re-stamps campaign.updatedAt, member save .timestamp, and live-view .editedAt
 * with wall-clock now (campaignWorldPulseSlice.js undoLastPulse). Those three
 * are registered as policy 'stamp' and excluded from byte-compares; everything
 * else must survive byte-exact.
 *
 * CANNOT-CATCH (documented evasion gaps — accepted costs of a regex gate):
 *   1. The partialize / select / writer-column scans are string-anchored. A
 *      dynamically-concatenated select string, a renamed `partialize` state
 *      param, or `const r = row; r.x =` aliasing would evade them. None exists;
 *      convention keeps these shapes stable (operationRegistry.walker precedent).
 *   2. The supabase LIST → envelope field mapping (timestamp, gallery_* read
 *      side) is not executed here (needs a live DB); the DB column scans red on
 *      any new persisted column, and the mapping lives in the same diff.
 *   3. Server-side writers (gallery/unlisted RPCs, edge functions) write columns
 *      client code never assigns; those are covered by the security/edge tests,
 *      not this walker.
 *   4. A brand-new storage engine (IndexedDB, a new localStorage key) would be
 *      invisible until registered; the SESSION_ONLY guard only covers the known
 *      store keys. Review owns that seam.
 *
 * @enforced-by this test
 */
import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Force LOCAL mode everywhere: every service binds its real localStorage path.
// `setSessionPersistence` is a named export src/lib/auth.js imports (the real auth
// service runs here in MOCK mode, for the anonymous-draft arms); it is only ever
// CALLED on the configured Supabase sign-in path, so a no-op is the whole contract.
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: null, isConfigured: false, setSessionPersistence: () => {},
}));

// Map-backed localStorage shim (the campaignSlice.migrate.test.js idiom) — node
// env, no jsdom. Installed at module scope; no imported module reads storage at
// import time (proven by the existing store tests using this shim).
{
  const data = new Map();
  globalThis.localStorage = {
    getItem: (k) => data.get(String(k)) ?? null,
    setItem: (k, v) => { data.set(String(k), String(v)); },
    removeItem: (k) => { data.delete(String(k)); },
    clear: () => data.clear(),
  };
}

import { saves } from '../../src/lib/saves.js';
import { campaigns as campaignService } from '../../src/lib/campaigns.js';
import { migrateCampaign, createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { createCampaignRegionalSlice } from '../../src/store/campaignRegionalSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { capturePulseSnapshot } from '../../src/store/campaignPulseHelpers.js';
import {
  createDefaultWorldState,
  ensureWorldState,
  runWorldStateMigrations,
  CONDITIONAL_LEDGER_KEYS,
} from '../../src/domain/worldPulse/worldState.js';
import { hydratePersistedWorldState } from '../../src/domain/worldPulse/worldStateHydration.js';
import { mergePersistedState } from '../../src/store/persistMerge.js';
import { partializeStoreState, PERSIST_KEY } from '../../src/store/persistProjection.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { normalizeServicesToggles } from '../../src/store/toggleSlice.js';
import { createDisplayPrefsSlice, DEFAULT_DISPLAY_PREFS } from '../../src/store/displayPrefsSlice.js';
import { PUBLIC_TOPLEVEL_KEYS } from '../../src/domain/display/publicSafe.js';
import { OPERATIONS } from '../../src/store/operationRegistry.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { codeOnly } from '../helpers/codeOnlySource.js';
import { deepClone } from '../../src/domain/clone.js';
import { envoyErrandIdForOffer } from '../../src/domain/worldPulse/envoyErrand.js';

// ═══════════════════════════════════════════════════════════════════════════
// THE REGISTRY — every persisted state family, with its lifecycle policies.
// Discovery is automatic (executed create paths + source scans); registration
// is manual; the completeness tests force them to move together (Pattern 2).
// Frozen 2026-07-21, hand-audited against src. SHRINK/EDIT ONLY WITH A POLICY.
// ═══════════════════════════════════════════════════════════════════════════

/** Substrate A — zustand persist partialize keys (src/store/persistProjection.js).
 *
 *  `displayPrefs` joined this list in R-5b (owner queue #17 / atlas
 *  presentation-scene gap 11) with a written reason, per the header's rule 3. It
 *  is NOT a family moved out of SESSION_ONLY_FAMILIES: the 3D portrait's quality
 *  ceiling had no store home at all before, only component useState, so nothing
 *  that was registered as deliberately-session-only became persisted. The reason
 *  it may persist: it is a DEVICE preference (how much detail this machine is
 *  allowed to render), never world state — no domain module reads it, it is
 *  absent from `config` so it cannot reach the generator, and it is covered by
 *  mergePersistedState so a returning user missing a later-added key backfills to
 *  the shipped default instead of forking shapes.
 *
 *  `advanceAutoResolve` joined in the realm-directive-7 full-auto-resolve wave
 *  (J-D7, 2026-07-31), also with a written reason. It is NOT a family moved out of
 *  SESSION_ONLY_FAMILIES — it was never registered there; it was simply an
 *  unpersisted slice default, and re-picking the play mode on every reload was the
 *  defect. The reason it may persist: it is a PLAYER preference about how the world
 *  advances, it is absent from `config` so it cannot reach the generator, it is not
 *  campaign canon (clearTransientCampaignWork leaves it alone and no undo touches
 *  it), and it is a bare boolean whose ABSENCE in an older blob rehydrates to the
 *  slice's `false` default through the top-level spread — the same cohort-fork
 *  safety `displayPrefs` gets from its explicit merge branch. */
const ZUSTAND_PERSIST_KEYS = Object.freeze([
  'config', 'configExplicitFields',
  'institutionToggles', 'categoryToggles', 'goodsToggles', 'servicesToggles',
  'displayPrefs',
  // Realm directive 7 (J-D7): the FULL AUTO-RESOLVE play mode. Persisted as an
  // additive top-level key (persistProjection.js), absent-tolerant on rehydrate.
  'advanceAutoResolve',
  // THE ANONYMOUS DRAFT (2026-09-18), as ONE ENVELOPE, with its written reason
  // per the header's rule 3 — and it is the one entry here that IS a generated
  // world, so the reason is longer than its neighbours'.
  //
  // It is NOT a family moved out of SESSION_ONLY_FAMILIES: `settlement` was
  // never registered there. It was an unpersisted slice default, and the defect
  // was that /create promises an anonymous visitor "Your first dossier is yours
  // to keep" while a refresh took it — an anonymous account has maxSaves 0
  // (authSlice TIER_GATE), so no library held it and nothing else did either.
  //
  // Why it MAY persist: it is the viewer's OWN world, device-local like every
  // other key here; it is scoped to the anonymous tier, so no signed-in cohort's
  // draft is duplicated outside their library; it is absent from `config`, so it
  // cannot reach the generator as input; it is written WHOLE rather than
  // projected, so a restored draft is byte-identical to the generated one and a
  // save after a reload writes exactly what a save before it would; and its
  // ABSENCE in an older blob rehydrates to the slice's `null`, the same
  // cohort-fork safety advanceAutoResolve gets. Measured before it was written:
  // a TOWN at 4,000 population is 141,607–192,830 B.
  //
  // ⛔ IT IS ONE KEY BECAUSE TWO WERE A BUG. The first cut wrote `settlement` and
  // `lastSeed` as top-level keys gated on the tier at WRITE time, while the READ
  // restored them by top-level spread, so a returning user booted with a previous
  // anonymous session's draft. One envelope keeps marker and payload together;
  // `lastSeed` rides inside it because a draft without the seed it was drawn from
  // is a world whose provenance the reload silently dropped.
  //
  // ⭐ WHEN IT IS WRITTEN IS ONE RULE (2026-09-18): the world in the editor was
  // BORN ANONYMOUS (`state.draftOrigin === 'anon'` — a TRANSIENT store-root field,
  // never a key on the world and never persisted) and nobody is signed in now. There is no second
  // half at the boot auth resolution any more — every boot adopts what the device
  // kept, because a device's anonymous draft belongs to the device.
  'anonDraft',
]);

/**
 * Substrate C — the campaign record (createCampaign initial shape, normalized on
 * every load by migrateCampaign). Policies:
 *   migrate: 'backfilled' — migrateCampaign materializes the key on a bare
 *            legacy record; 'preserved' — carried verbatim when present only.
 *   undo:    'restored' — pulse undo restores the pre-advance value;
 *            'untouched' — pulse undo must NOT revert it (V-2 letter-state law);
 *            'stamp' — re-stamped with wall-clock now by design (excluded from
 *            byte-compares).
 */
const CAMPAIGN_RECORD_REGISTRY = Object.freeze({
  id:            { migrate: 'backfilled', undo: 'untouched' },
  name:          { migrate: 'preserved',  undo: 'untouched' },
  createdAt:     { migrate: 'preserved',  undo: 'untouched' },
  updatedAt:     { migrate: 'preserved',  undo: 'stamp' },
  settlementIds: { migrate: 'backfilled', undo: 'untouched' },
  mapState:      { migrate: 'preserved',  undo: 'untouched' },
  regionalGraph: { migrate: 'preserved',  undo: 'restored' },
  wizardNews:    { migrate: 'backfilled', undo: 'restored' },
  worldState:    { migrate: 'backfilled', undo: 'restored' },
  collapsed:     { migrate: 'preserved',  undo: 'untouched' },
  accessState:   { migrate: 'backfilled', undo: 'untouched' },
  lastReadTick:  { migrate: 'backfilled', undo: 'untouched' },
  flagsSeen:     { migrate: 'backfilled', undo: 'untouched' },
  pendingSync:   { migrate: 'preserved',  undo: 'untouched' },
  contentBinding: {
    migrate: 'preserved',
    undo: 'untouched',
  },
  contentBindingHistory: {
    migrate: 'backfilled',
    undo: 'untouched',
  },
  contentBindingStatus: {
    migrate: 'backfilled',
    undo: 'untouched',
  },
});

/** Nested family — worldState BASE keys (createDefaultWorldState, always present). */
const WORLD_STATE_BASE_KEYS = Object.freeze([
  'schemaVersion', 'canonizedAt', 'tick', 'calendar', 'rngSeed', 'volatility',
  'simulationRules', 'stressors', 'relationshipStates', 'npcStates',
  'factionStates', 'proposals', 'pulseHistory', 'settlementTickStates',
  'pendingEvents', 'dispositionStats', 'deployments', 'tradeWarState',
  'warExhaustion',
]);

/** Nested family — worldState CONDITIONAL ledgers (absent-when-dormant; the
 *  registry mirrors the exported CONDITIONAL_LEDGER_KEYS and reds on drift). */
const WORLD_STATE_CONDITIONAL_KEYS = Object.freeze([
  'pantheon', 'religionStates', 'warPosture', 'occupations', 'pausedAdvance',
  'martialReadiness', 'conquestFeeds', 'mercenaryMarket', 'rulesetLog',
  'spatialDigest', 'spatialLedgers', 'narrativeTempo', 'politicsLedgers',
  'factionPairStates', 'envoyErrands', 'concludedWars',
]);

/** The conditionally-present SCALAR gate (not a ledger — see worldState.js). */
const WORLD_STATE_SCALAR_GATE = 'spatialCanonVersion';

/** Nested family — per-save campaignState (migrateSaveToV2 default shape). */
const SAVE_CAMPAIGN_STATE_KEYS = Object.freeze([
  'phase', 'eventLog', 'systemState', 'locks', 'generatedAt', 'editedAt',
  'canonizedAt', 'lastExportAt', 'narrativeDrift', 'exportState',
]);

/** Nested family — campaign mapState v2 (campaignSlice migrateMapState). */
const MAP_STATE_V2_KEYS = Object.freeze([
  'schemaVersion', 'fmgSnapshot', 'seed', 'placements', 'labels', 'markers',
  'forests', 'layers', 'viewport', 'savedAt', '_legacyPlacements',
]);

/** Substrate B — the LOCAL saves envelope after a full save→list round-trip
 *  (canonical writer input + the keys the load path materializes). */
const SAVE_ENVELOPE_LOCAL_KEYS = Object.freeze([
  'accessState', 'aiData', 'campaignState', 'categoryToggles', 'config',
  'goodsToggles', 'id', 'institutionToggles', 'name', 'savedAt', 'seed',
  'servicesToggles', 'settlement', 'tier', 'versionHistory',
]);

/** Substrate B — every `settlements` DB column any client read path selects
 *  (union of the .select() strings in src/lib/saves.js). */
const SETTLEMENTS_DB_READ_COLUMNS = Object.freeze([
  'access_state', 'ai_data', 'campaign_state', 'config', 'created_at', 'data',
  'gallery_description', 'gallery_image_alt', 'gallery_image_url',
  'gallery_importable', 'gallery_member_overrides', 'gallery_share_dm',
  'gallery_share_narrated', 'gallery_tags', 'gallery_title', 'id',
  'inactive_reason', 'inactive_since', 'is_public', 'name', 'neighbour_links',
  'public_slug', 'reactivated_free_at', 'retention_expires_at', 'seed', 'tier',
  'toggles', 'unlisted_slug', 'updated_at', 'version_history', 'visibility',
]);

/** Substrate B — every column the client WRITE paths assign (mutationRow /
 *  supabaseSave row literal / supabaseUpdate). */
const SETTLEMENTS_DB_WRITER_COLUMNS = Object.freeze([
  'ai_data', 'campaign_state', 'config', 'data', 'id', 'name',
  'neighbour_links', 'seed', 'tier', 'toggles', 'user_id', 'version_history',
]);

/** Written-but-never-selected columns that are NOT orphans, with the reason. */
const WRITER_ONLY_EXEMPT = Object.freeze({
  user_id: 'RLS owner-scoping column — write-only metadata, never envelope state',
});

/** Families that are DELIBERATELY session-only (never persisted). Registered so
 *  the exclusion is a recorded decision, not drift; the partialize scan asserts
 *  they never quietly join persistence. */
const SESSION_ONLY_FAMILIES = Object.freeze({
  pendingEditsQueue: 'session-only by design — drains into committed edits (src/domain/pendingEdits.js)',
  pendingEditsClock: 'session-only companion cursor to pendingEditsQueue (src/store/settlementSlice.js)',
  pendingEditReceipts: 'session-only idempotency/correlation receipts; authoritative receipts live in snapshots and event logs',
  pulseUndoStack: 'session-scoped pulse undo stack — a reload clears it (src/store/campaignWorldPulseSlice.js)',
  proposalUndoStack: 'session-scoped proposal-apply undo ring, separate from pulseUndoStack by construction — a reload clears it (src/store/campaignWorldPulseSlice.js)',
  // ⚰ RETIRED 2026-09-18: `restoredAnonDraft` and `signedInWorld`. Two SESSION
  // CLAIMS about what was in the editor — one raised by the rehydrate for a boot
  // resolution to spend, one raised at sign-out to bar a write — replaced by a
  // single DERIVED root field, `draftOrigin`, whose own row is below. Their rows
  // are deleted rather than kept, because a registry row for a key no code writes
  // is exactly the staleness this file's header calls a red.
  draftOrigin: "whose session put the world in the editor — 'anon' or 'account'. Set at the birth (settlementGenerateAction), DERIVED on every rehydrate (persistMerge: 'anon' iff that boot adopted the envelope), re-stamped by claimSettlementForAccount when a signed-in person saves/opens/canonizes, and nulled at the swap chokepoint so an unanswering door fails closed. It MUST NOT persist: it is derived from the adoption, and a persisted copy would outlive the session it describes and could assert an origin a hand-edited blob chose (src/store/settlementSlice.js)",
});

// ═══════════════════════════════════════════════════════════════════════════
// Shared helpers
// ═══════════════════════════════════════════════════════════════════════════

const NOW = '2026-07-21T00:00:00.000Z';
const CAMPAIGN_ID = '11111111-1111-4111-8111-111111111111'; // valid v4 shape — migrateCampaign must not remint it

/** The dual byte-compare idiom (advanceWorkerByteIdentity.test.js): structural
 *  equality AND serialized-byte equality (key order + presence included). */
function expectByteEqual(actual, expected) {
  expect(actual).toEqual(expected);
  expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
}

function readSrc(rel) {
  return readFileSync(join(process.cwd(), rel), 'utf8');
}

function sortedUnique(list) {
  return [...new Set(list)].sort();
}

/** Exact-set walker assert with kind messages: unregistered AND ghost rows fail. */
function expectExactSet(discovered, registered, what, howToRegister) {
  const d = new Set(discovered);
  const r = new Set(registered);
  const unregistered = [...d].filter((k) => !r.has(k)).sort()
    .map((k) => `${what}: '${k}' exists in the code but is NOT registered — ${howToRegister}`);
  const ghosts = [...r].filter((k) => !d.has(k)).sort()
    .map((k) => `${what}: registered key '${k}' no longer exists in the code — delete its registry row (staleness is a red too)`);
  expect(unregistered).toEqual([]);
  expect(ghosts).toEqual([]);
}

beforeEach(() => {
  localStorage.clear();
});

// The store-composition idiom from pulseMutatorsInFlightGuard.test.js — the
// slices under test composed over a stub of the cross-slice state they read.
// auth.tier 'premium' so the REAL createCampaign gate admits the walker.
const stubSlice = () => ({
  auth: { user: null, tier: 'premium', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  savedSettlements: [],
  settlement: null,
  activeSaveId: null,
  phase: 'draft',
  eventLog: [],
  locks: {},
  generatedAt: null,
  editedAt: null,
  canonizedAt: null,
  lastExportAt: null,
});

/** The settings substrate composed alone (the display-preference family needs no
 *  campaign machinery). Mirrors makeStore's composition idiom. */
function makeSettingsStore() {
  return create(immer((...a) => ({ ...createDisplayPrefsSlice(...a) })));
}

/** The exact projection passed to Zustand persist by src/store/index.js. */
const partializeOf = partializeStoreState;

function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createSettlementSlice(...a),
    ...createCampaignSlice(...a),
    ...createCampaignRegionalSlice(...a),
    ...createCampaignWorldPulseSlice(...a),
  })));
}

/** One live WR-7a record with nested, mutable-shaped cargo.  Keeping this in the
 *  lifecycle fixture makes the generic campaign cache/import/clone/undo walkers
 *  exercise the conditional ARRAY instead of proving only object ledgers. */
function envoyErrandFixture() {
  const offer = {
    outcomeId: 'peace-outcome-1',
    generatedAtTick: 5,
    severity: 0.7,
    candidateType: 'strategy_sue_for_peace',
    targetSaveId: 'ashford',
    relationshipKey: 'ashford::irontown',
    relationshipPatch: { proposedRelationshipType: 'neutral' },
    proposalPayload: {
      kind: 'relationship_label_change',
      relationshipKey: 'ashford::irontown',
      fromType: 'hostile',
      toType: 'neutral',
      peaceOffer: true,
      offererId: 'ashford',
      targetId: 'irontown',
      peaceFrontOwnerId: 'ashford',
      peaceFrontSinceTick: 4,
      reason: 'The court carries an authored peace offer home.',
    },
  };
  return {
    id: envoyErrandIdForOffer(offer),
    npcId: 'reeve',
    npcName: 'Reeve Mara',
    from: 'ashford',
    fromName: 'Ashford',
    to: 'irontown',
    toName: 'Irontown',
    purpose: 'sue',
    offer,
    acceptance: {
      accepted: true,
      offererId: 'ashford',
      targetId: 'irontown',
      receipt: {
        id: 'war-peace-decision.ashford.irontown.5',
        kind: 'war_peace_acceptance_read',
        tick: 5,
        offerId: 'peace-outcome-1',
        offererId: 'ashford', targetId: 'irontown', decision: 'accept', actualAction: 'peace',
        decidingTerm: 'cost_to_continue',
        bands: {
          cause: 'present', cost_to_continue: 'pressing', cost_to_stop: 'present', momentum: 'quiet',
        },
        reason: 'Both courts accept the carried peace.',
      },
      offererRead: {
        id: 'war-termination.ashford.irontown.5', kind: 'war_termination_read', tick: 5,
        attackerId: 'ashford', targetId: 'irontown', settlementIds: ['ashford', 'irontown'],
        decidingTerm: 'momentum',
      },
      targetTerminationReceipt: {
        id: 'war-termination.irontown.ashford.5', kind: 'war_termination_read', tick: 5,
        attackerId: 'irontown', targetId: 'ashford', settlementIds: ['irontown', 'ashford'],
        decidingTerm: 'cost_to_continue',
      },
      inheritedDemand: null,
      coalitionPeaceExpenditures: [{ settlementId: 'ashford', costBand: 'present' }],
    },
    snapshot: {
      storesBand: 'thin',
      strengthBand: 'ready',
      moraleExhaustionBand: 'present',
      foundingCauseStatus: 'live',
      believedRatioBand: 'matched',
    },
    termSheet: null,
    legs: [{
      fromId: 'ashford', toId: 'irontown', departTick: 5, arrivalTick: 7,
      journey: 'outbound', routeRef: { id: 'road-ash-iron', name: 'North Road' },
    }],
    positionRef: {
      journey: 'outbound', legIndex: 0, fromId: 'ashford', toId: 'irontown',
      progressBand: 'departed',
    },
    departedTick: 5,
    expectedReturnTick: 12,
    state: 'travelling',
  };
}

/** A RICH worldState raw: every base container populated, every conditional
 *  ledger present, the scalar gate set, plus one FORWARD-COMPAT unknown key
 *  (fixtures that hide population are how defect classes survive — memory). */
function richWorldStateRaw() {
  return {
    tick: 5,
    canonizedAt: '2026-07-01T00:00:00.000Z',
    rngSeed: 'world-pulse:lifecycle-walker',
    calendar: { elapsedWeeks: 5, elapsedMonths: 1, month: 2, year: 1, season: 'spring' },
    volatility: 'normal',
    stressors: [{
      id: 'str_1', type: 'food_shortage', severity: 'moderate',
      affectedSettlementIds: ['ashford'],
      severityBySettlement: { ashford: 'moderate' },
      causes: [{ kind: 'weather', label: 'drought' }],
    }],
    relationshipStates: { 'ashford->irontown': { disposition: 'wary' } },
    npcStates: { reeve: { mood: 'grim' } },
    factionStates: { league: { power: 70 } },
    proposals: [{ id: 'prop-1', status: 'pending', kind: 'event', settlementId: 'ashford', createdAt: '2026-07-01T00:00:00.000Z' }],
    pulseHistory: [{ tick: 4, at: '2026-06-24T00:00:00.000Z' }],
    settlementTickStates: { ashford: { lastTick: 4 } },
    pendingEvents: [{ id: 'pe-1', saveId: 'ashford', kind: 'event' }],
    dispositionStats: { 'ashford->irontown': { wins: 1, losses: 0 } },
    deployments: { d1: { from: 'ashford', to: 'irontown', sinceTick: 4 } },
    tradeWarState: { grain: { holder: 'ashford', cooldown: 2 } },
    warExhaustion: { ashford: 0.2 },
    spatialCanonVersion: 1,
    pantheon: { stormfather: { tier: 2, wins: 3, losses: 1 } },
    religionStates: { ashford: { patronRef: 'stormfather', patronHeld: 4 } },
    warPosture: { ashford: { state: 'mobilizing', progress: 0.5, sinceTick: 3 } },
    occupations: { irontown: { occupierId: 'ashford', state: 'contested', sinceTick: 4 } },
    pausedAdvance: { cursor: { tickIndex: 2 }, campaignId: CAMPAIGN_ID },
    martialReadiness: { ashford: { readiness01: 0.4, experience01: 0.2 } },
    conquestFeeds: { ashford: { loot: 2, captives: 1, lastTick: 4 } },
    mercenaryMarket: { ashford: { rented: 1, rate: 3 } },
    rulesetLog: { rc_1_0: { tick: 1, change: 'volatility', from: 'calm', to: 'normal' } },
    spatialDigest: {
      spatialGeometryVersion: 1, costLawVersion: 1, overlayVersion: 1,
      costField: [1, 2, 3], territory: { ashford: [0] }, gates: {}, tiers: {},
      distanceMatrix: [[0, 4], [4, 0]], routeReceipts: {}, reserved: {},
    },
    spatialLedgers: { spatialArrivals: { imp_1: { arrivalTick: 6, targetId: 'ashford', sourceId: 'irontown' } } },
    narrativeTempo: { lullTicks: 1, lastMajorTick: 4 },
    politicsLedgers: { ashford: { blocs: [{ id: 'bloc1', members: ['reeve'], glue: ['grain'], end: 'grain_control', strain: 0.1, sinceTick: 3 }] } },
    factionPairStates: { 'league|temple': { trust: 0.5, resentment: 0.1 } },
    envoyErrands: [envoyErrandFixture()],
    // W-MEM: one SEALED concluded-war record. Populated rather than stubbed because a
    // fixture that hides population is how a defect class survives — this record must
    // carry a member of every sub-shape the normalizer rebuilds (participants, casus
    // pins, the fact block with an applied terminal outcome, banded costs, an
    // engagement epitome), or the round trip proves only that an empty object clones.
    concludedWars: {
      'war.ashford.kelby.3.0': {
        schemaVersion: 1,
        warId: 'war.ashford.kelby.3.0',
        originPair: ['ashford', 'kelby'],
        originAttackerId: 'ashford',
        openedTick: 3, concludedTick: 9, sealed: true, form: 'full',
        participants: [
          { id: 'ashford', label: 'Ashford', side: 'attacker' },
          { id: 'kelby', label: 'Kelby', side: 'defender' },
        ],
        casusReasons: [{ type: 'grievance', score: 0.4, receipt: 'a torn seal', atTick: 3 }],
        fact: {
          closed: true,
          closeRoad: 'conquest',
          terminalOutcomes: [{ id: 'world_outcome.conquest.kelby.9', candidateType: 'conquest', targetSaveId: 'kelby', tick: 9 }],
          // W-MEM-P1: the annihilation channel, which had a reader and no producer at
          // all until this train. It rides the fact block, so it is exactly the shape
          // that would ghost on a lifecycle path if the normalizer's allowlist forgot it.
          loserDied: true,
          // W-MEM-P2: the governed WR-5 family that closed the war, carried as a TOKEN
          // from the seam that minted it — never read back out of a rendered sentence.
          seatTransitionFamily: 'war_dissolved_by_verdict',
        },
        victorId: 'ashford',
        territorialOutcomes: [{ settlementId: 'kelby', kind: 'occupied', occupierId: 'ashford', tick: 9 }],
        cost: { attackerRemainingBand: 'battered', exhaustionBands: { ashford: 'war-weary' } },
        notableEngagements: [{ kind: 'field_battle', tick: 6, settlementIds: ['ashford', 'kelby'], sourceEventId: 'field_battle.ashford.kelby.6' }],
      },
    },
    futureLedgerX: { forwardCompat: true }, // unknown key — MUST pass through (tolerant-forward law)
  };
}

/** A normalized (load-chokepoint fixpoint) campaign carrying every nested family. */
function normalizedCampaignFixture() {
  return migrateCampaign({
    id: CAMPAIGN_ID,
    name: 'Lifecycle Realm',
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
    settlementIds: ['ashford'],
    mapState: {
      schemaVersion: 2, fmgSnapshot: null, seed: 42,
      placements: { 7: { settlementId: 'ashford', x: 10, y: 20, cellId: 3, placedAt: '2026-07-01T00:00:00.000Z' } },
      labels: [], markers: [], forests: [],
      layers: { relationships: true, labels: true },
      viewport: { cx: 0, cy: 0, scale: 1, width: 800, height: 600 },
      savedAt: '2026-07-01T00:00:00.000Z',
    },
    regionalGraph: {
      nodes: [{ id: 'ashford', settlementId: 'ashford', name: 'Ashford', tier: 'town', updatedAt: '2026-07-01T00:00:00.000Z' }],
      edges: [], channels: [], queuedImpacts: [], eventLog: [],
      updatedAt: '2026-07-01T00:00:00.000Z',
    },
    wizardNews: {
      currentTick: 5,
      updatedAt: '2026-07-01T00:00:00.000Z',
      entries: [{
        id: 'wizard_news.4.applied.imp_0', createdAt: '2026-06-24T00:00:00.000Z', tick: 4,
        scope: 'regional', significance: 'notable', score: 3,
        headline: 'Grain caravans thin on the river road',
        summary: 'The shortage pressed Ashford toward its neighbours.',
        kind: 'applied', settlementIds: ['ashford'],
      }],
    },
    worldState: richWorldStateRaw(),
    collapsed: false,
    accessState: 'active',
    lastReadTick: 7,
    flagsSeen: ['warLayerEnabled'],
    pendingSync: false,
  });
}

const memberSettlement = () => ({
  _seed: 12345,
  name: 'Ashford', tier: 'town', population: 1500,
  config: { tradeRouteAccess: 'road', priorityEconomy: 20 },
  institutions: [], npcs: [{ id: 'reeve', name: 'Reeve Mara', importance: 'key' }],
  activeConditions: [],
  economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
});

const memberCampaignState = () => ({
  phase: 'canon', eventLog: [{ id: 'ev0', type: 'ADD_INSTITUTION' }], systemState: { resilience: 40 },
  locks: {}, generatedAt: '2026-07-01T00:00:00.000Z', editedAt: '2026-07-01T00:00:00.000Z',
  canonizedAt: '2026-07-01T00:00:00.000Z', lastExportAt: null, narrativeDrift: null, exportState: null,
});

// ═══════════════════════════════════════════════════════════════════════════
// COMPLETENESS — discovery (executed create paths + source scans) vs registry
// ═══════════════════════════════════════════════════════════════════════════

describe('E-C completeness — every persisted family is registered (new family ⇒ red)', () => {
  test('campaign record: createCampaign initial shape matches the registry exactly', () => {
    const store = makeStore();
    const id = store.getState().createCampaign('Registry Probe');
    expect(id).toBeTruthy();
    const created = store.getState().campaigns[0];
    expectExactSet(
      Object.keys(created), Object.keys(CAMPAIGN_RECORD_REGISTRY),
      'campaign record',
      'add it to CAMPAIGN_RECORD_REGISTRY with its migrate + undo policies (see file header)',
    );
  });

  test('campaign record: every backfilled key is materialized by migrateCampaign on a bare record', () => {
    const bare = migrateCampaign({});
    const missing = Object.entries(CAMPAIGN_RECORD_REGISTRY)
      .filter(([, policy]) => policy.migrate === 'backfilled')
      .filter(([key]) => !Object.prototype.hasOwnProperty.call(bare, key))
      .map(([key]) => `campaign key '${key}' is registered migrate:'backfilled' but migrateCampaign({}) does not materialize it — a legacy campaign enters the store without it (the white-screen class)`);
    expect(missing).toEqual([]);
    // And migrateCampaign must not invent UNREGISTERED keys either.
    const invented = Object.keys(bare)
      .filter((k) => !Object.prototype.hasOwnProperty.call(CAMPAIGN_RECORD_REGISTRY, k))
      .map((k) => `migrateCampaign({}) materializes unregistered campaign key '${k}' — register it`);
    expect(invented).toEqual([]);
  });

  test('worldState: base shape + conditional ledgers + scalar gate match the registry exactly', () => {
    expectExactSet(
      Object.keys(createDefaultWorldState({ id: 'probe' })), WORLD_STATE_BASE_KEYS,
      'worldState base',
      'add it to WORLD_STATE_BASE_KEYS (and give it a round-trip fixture in richWorldStateRaw)',
    );
    expectExactSet(
      CONDITIONAL_LEDGER_KEYS, WORLD_STATE_CONDITIONAL_KEYS,
      'worldState conditional ledger',
      'add it to WORLD_STATE_CONDITIONAL_KEYS (and populate it in richWorldStateRaw so the round-trip covers it)',
    );
    expect(CONDITIONAL_LEDGER_KEYS.at(-1)).toBe('concludedWars');
    // The fully-populated ensure output carries EXACTLY base ∪ scalar ∪
    // conditional ∪ the forward-compat unknown — nothing invented, nothing lost.
    const ensured = ensureWorldState(richWorldStateRaw(), { id: CAMPAIGN_ID });
    expectExactSet(
      Object.keys(ensured),
      [...WORLD_STATE_BASE_KEYS, 'futureLedgerX', WORLD_STATE_SCALAR_GATE, ...WORLD_STATE_CONDITIONAL_KEYS],
      'ensured worldState (fully-populated fixture)',
      'a new persisted worldState key must be registered as base, conditional, or the scalar gate',
    );
    expect(Object.keys(ensured).at(-1)).toBe('concludedWars');
  });

  test('per-save campaignState: migrateSaveToV2 default block matches the registry exactly', async () => {
    const listed = await roundTripLocalSave();
    expectExactSet(
      Object.keys(listed.campaignState), SAVE_CAMPAIGN_STATE_KEYS,
      'save campaignState',
      'add it to SAVE_CAMPAIGN_STATE_KEYS and decide its default in migrateSaveToV2',
    );
  });

  test('mapState v2: the migrated shape matches the registry exactly', () => {
    const v1 = { placements: [{ burgId: 7, settlementId: 'ashford', x: 1, y: 2 }], mapSeed: 42, savedAt: '2026-07-01T00:00:00.000Z' };
    const migrated = migrateCampaign({ id: CAMPAIGN_ID, mapState: v1 }).mapState;
    expectExactSet(
      Object.keys(migrated), MAP_STATE_V2_KEYS,
      'mapState v2',
      'add it to MAP_STATE_V2_KEYS and thread it through migrateMapState',
    );
  });

  test('zustand persist: the partialize key list matches the registry exactly (source scan)', () => {
    const index = readSrc('src/store/index.js');
    expect(index).toMatch(/partialize:\s*partializeStoreState/);
    const src = readSrc('src/store/persistProjection.js');
    const block = src.match(/return\s*\{([\s\S]*?)\};/);
    if (!block) throw new Error('projection return object not found in persistProjection.js — re-anchor this walker, do not delete it');
    const discovered = [...block[1].matchAll(/(\w+):\s*state\.\w+/g)].map((m) => m[1]);
    expectExactSet(
      discovered, ZUSTAND_PERSIST_KEYS,
      'zustand partialize',
      'add it to ZUSTAND_PERSIST_KEYS and cover it in mergePersistedState (persistMerge.js) or a returning user forks shapes',
    );
    // Session-only families must never quietly join persistence.
    const leaked = Object.keys(SESSION_ONLY_FAMILIES)
      .filter((k) => discovered.includes(k))
      .map((k) => `'${k}' is registered SESSION-ONLY (${SESSION_ONLY_FAMILIES[k]}) but appears in partialize — decide its lifecycle before persisting it`);
    expect(leaked).toEqual([]);
  });

  test('settlements DB: read columns, writer columns, and no orphaned write (source scan)', () => {
    const src = readSrc('src/lib/saves.js');

    const readCols = sortedUnique(
      [...src.matchAll(/\.select\(\s*'([^']+)'/g)]
        .flatMap((m) => m[1].split(',').map((c) => c.trim()))
        .filter(Boolean),
    );
    expectExactSet(
      readCols, SETTLEMENTS_DB_READ_COLUMNS,
      'settlements read column',
      'add it to SETTLEMENTS_DB_READ_COLUMNS (and map it into the envelope in supabaseList, or a reload silently drops it — the V-20 unlisted_slug class)',
    );

    const assigned = [...src.matchAll(/\b(?:row|updates)\.(\w+)\s*=(?!=)/g)].map((m) => m[1]);
    // '{\n' (not '{'): mutationRow's empty `const row = {};` sits earlier in the
    // file; the multi-line literal we want is supabaseSave's insert row.
    const literalStart = src.indexOf('const row = {\n');
    if (literalStart === -1) throw new Error('supabaseSave `const row = {` literal not found in src/lib/saves.js — re-anchor this walker, do not delete it');
    const literalBlock = src.slice(literalStart, src.indexOf('};', literalStart));
    const literalKeys = [...literalBlock.matchAll(/^\s*(\w+):/gm)].map((m) => m[1]);
    const writers = sortedUnique([...assigned, ...literalKeys]);
    expectExactSet(
      writers, SETTLEMENTS_DB_WRITER_COLUMNS,
      'settlements writer column',
      'add it to SETTLEMENTS_DB_WRITER_COLUMNS with its read-back column in SETTLEMENTS_DB_READ_COLUMNS',
    );

    // THE ORPHANED-WRITE GUARD (the bar-12 contract itself): every column the
    // client writes must be read back by some select, or the write survives the
    // DB and ghosts on reload.
    const readSet = new Set(readCols);
    const orphans = writers
      .filter((c) => !readSet.has(c) && !Object.prototype.hasOwnProperty.call(WRITER_ONLY_EXEMPT, c))
      .map((c) => `settlements column '${c}' is WRITTEN by the client but selected by no read path — an orphaned write (persists, then ghosts on reload). Add it to a select + the envelope mapping, or register it in WRITER_ONLY_EXEMPT with the reason.`);
    expect(orphans).toEqual([]);
  });

  test('local saves envelope: the full save→list round-trip yields exactly the registered keys', async () => {
    const listed = await roundTripLocalSave();
    expectExactSet(
      Object.keys(listed), SAVE_ENVELOPE_LOCAL_KEYS,
      'local save envelope',
      'add it to SAVE_ENVELOPE_LOCAL_KEYS and make sure BOTH the write path (localSaveEntry/mutationRow) and the read path (localList/supabaseList mapping) carry it',
    );
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// ROUND-TRIPS — byte-exact survival per family, through the REAL paths
// ═══════════════════════════════════════════════════════════════════════════

describe('E-C worldState — ensure fixpoint, persist, clone, migrate, dormancy', () => {
  test('ensureWorldState is a byte-exact fixpoint on a fully-populated state (re-derive hop)', () => {
    const camp = { id: CAMPAIGN_ID, name: 'Lifecycle Realm' };
    const w1 = ensureWorldState(richWorldStateRaw(), camp);
    const w2 = ensureWorldState(w1, camp);
    expectByteEqual(w2, w1);
  });

  test('the persist hop (JSON round-trip) then re-ensure survives byte-exact', () => {
    const camp = { id: CAMPAIGN_ID, name: 'Lifecycle Realm' };
    const w1 = ensureWorldState(richWorldStateRaw(), camp);
    const revived = ensureWorldState(JSON.parse(JSON.stringify(w1)), camp);
    expectByteEqual(revived, w1);
  });

  test('envoy errands survive normalization and reload without aliasing nested terms, legs, or labels', () => {
    const raw = richWorldStateRaw();
    Object.assign(raw.envoyErrands[0], {
      state: 'returning',
      parlayTick: 7,
      returnStartedTick: 8,
      scheduledHomeTick: 12,
      termSheet: {
        id: 'terms-1',
        clauses: [{ kind: 'ceasefire', parties: ['ashford', 'irontown'] }],
      },
      legs: [
        ...raw.envoyErrands[0].legs,
        {
          fromId: 'irontown', toId: 'ashford', departTick: 8, arrivalTick: 10,
          journey: 'return', routeRef: { id: 'road-ash-iron', name: 'North Road' },
        },
      ],
      positionRef: {
        journey: 'return', legIndex: 0, fromId: 'irontown', toId: 'ashford',
        progressBand: 'departed',
      },
    });
    const ensured = ensureWorldState(raw, { id: CAMPAIGN_ID });
    expect(ensured.envoyErrands).toHaveLength(1);
    expect(ensured.envoyErrands).not.toBe(raw.envoyErrands);
    expect(ensured.envoyErrands[0].termSheet).not.toBe(raw.envoyErrands[0].termSheet);
    expect(ensured.envoyErrands[0].legs[0].routeRef).not.toBe(raw.envoyErrands[0].legs[0].routeRef);
    expect(ensured.envoyErrands[0].acceptance).not.toBe(raw.envoyErrands[0].acceptance);

    raw.envoyErrands[0].termSheet.clauses[0].kind = 'tampered';
    raw.envoyErrands[0].legs[0].routeRef.name = 'False Road';
    raw.envoyErrands[0].acceptance.receipt.decision = 'tampered';
    raw.envoyErrands[0].npcName = 'False Name';
    expect(ensured.envoyErrands[0].termSheet.clauses[0].kind).toBe('ceasefire');
    expect(ensured.envoyErrands[0].legs[0].routeRef.name).toBe('North Road');
    expect(ensured.envoyErrands[0].acceptance.receipt.decision).toBe('accept');
    expect(ensured.envoyErrands[0].npcName).toBe('Reeve Mara');

    const revived = ensureWorldState(JSON.parse(JSON.stringify(ensured)), { id: CAMPAIGN_ID });
    expectByteEqual(revived.envoyErrands, ensured.envoyErrands);
  });

  test('persisted hydration rejects envoy lifecycle rows whose cursor or terminal clocks claim a teleport', () => {
    const ensureWorldState = hydratePersistedWorldState;
    const parlaying = richWorldStateRaw();
    Object.assign(parlaying.envoyErrands[0], {
      state: 'parlaying',
      parlayTick: 7,
      positionRef: {
        journey: 'outbound', legIndex: 0, fromId: 'ashford', toId: 'irontown',
        progressBand: 'underway',
      },
    });
    expect(ensureWorldState(parlaying, { id: CAMPAIGN_ID })).not.toHaveProperty('envoyErrands');

    const home = richWorldStateRaw();
    Object.assign(home.envoyErrands[0], {
      state: 'home',
      parlayTick: 7,
      returnStartedTick: 8,
      scheduledHomeTick: 10,
      homeTick: 10,
      closedTick: 10,
      legs: [
        ...home.envoyErrands[0].legs,
        {
          fromId: 'irontown', toId: 'ashford', departTick: 8, arrivalTick: 10,
          journey: 'return', routeRef: { id: 'road-ash-iron', name: 'North Road' },
        },
      ],
      positionRef: {
        journey: 'return', legIndex: 0, fromId: 'irontown', toId: 'ashford',
        progressBand: 'underway',
      },
    });
    expect(ensureWorldState(home, { id: CAMPAIGN_ID })).not.toHaveProperty('envoyErrands');

    const mismatchedHomeClock = structuredClone(home);
    mismatchedHomeClock.envoyErrands[0].positionRef.progressBand = 'arrived';
    mismatchedHomeClock.envoyErrands[0].closedTick = 11;
    expect(ensureWorldState(mismatchedHomeClock, { id: CAMPAIGN_ID }))
      .not.toHaveProperty('envoyErrands');

    const mismatchedLossClock = richWorldStateRaw();
    Object.assign(mismatchedLossClock.envoyErrands[0], {
      state: 'lost', lossCause: 'route_lost', lostTick: 8, closedTick: 9,
    });
    expect(ensureWorldState(mismatchedLossClock, { id: CAMPAIGN_ID }))
      .not.toHaveProperty('envoyErrands');

    const predepartureLoss = richWorldStateRaw();
    Object.assign(predepartureLoss.envoyErrands[0], {
      state: 'lost', lossCause: 'route_lost', lostTick: 4, closedTick: 4,
    });
    expect(ensureWorldState(predepartureLoss, { id: CAMPAIGN_ID }))
      .not.toHaveProperty('envoyErrands');

    const prematureSilence = richWorldStateRaw();
    prematureSilence.envoyErrands[0].silenceInferredAtTick = 12;
    expect(ensureWorldState(prematureSilence, { id: CAMPAIGN_ID }))
      .not.toHaveProperty('envoyErrands');

    const outboundTerms = richWorldStateRaw();
    outboundTerms.envoyErrands[0].termSheet = {
      id: 'terms.never-agreed', clauses: [{ kind: 'ceasefire' }],
    };
    expect(ensureWorldState(outboundTerms, { id: CAMPAIGN_ID }))
      .not.toHaveProperty('envoyErrands');

    const crossedParlayLoss = richWorldStateRaw();
    Object.assign(crossedParlayLoss.envoyErrands[0], {
      state: 'lost', lossCause: 'route_lost', parlayTick: 7, lostTick: 8, closedTick: 8,
    });
    expect(ensureWorldState(crossedParlayLoss, { id: CAMPAIGN_ID }))
      .not.toHaveProperty('envoyErrands');

    const crossedReturnLoss = richWorldStateRaw();
    Object.assign(crossedReturnLoss.envoyErrands[0], {
      state: 'lost',
      lossCause: 'route_lost',
      parlayTick: 7,
      returnStartedTick: 8,
      scheduledHomeTick: 10,
      lostTick: 9,
      closedTick: 9,
      legs: [
        ...crossedReturnLoss.envoyErrands[0].legs,
        {
          fromId: 'irontown', toId: 'ashford', departTick: 8, arrivalTick: 10,
          journey: 'return', routeRef: { id: 'road-ash-iron', name: 'North Road' },
        },
      ],
    });
    expect(ensureWorldState(crossedReturnLoss, { id: CAMPAIGN_ID }))
      .not.toHaveProperty('envoyErrands');
  });

  test('the clone hop: deepClone is byte-exact and the state is structuredClone-safe', () => {
    const w1 = ensureWorldState(richWorldStateRaw(), { id: CAMPAIGN_ID });
    expect(() => structuredClone(w1)).not.toThrow();
    expectByteEqual(deepClone(w1), w1);
  });

  test('the migrate hop: runWorldStateMigrations upgrades v1 religion keys once, then is idempotent', () => {
    const legacy = { religionStates: { ashford: { chiefRef: 'stormfather', chiefHeld: 4, share: 0.6 } } };
    const migrated = runWorldStateMigrations(legacy);
    expect(migrated.religionStates.ashford).toEqual({ share: 0.6, patronRef: 'stormfather', patronHeld: 4 });
    expect(migrated.schemaVersion).toBe(2);
    expectByteEqual(runWorldStateMigrations(migrated), migrated);
  });

  test('dormancy: empty conditional ledgers are stripped; absent stays absent (legacy byte-identity)', () => {
    const withEmpties = {
      tick: 1,
      pantheon: {},
      spatialLedgers: {},
      politicsLedgers: {},
      envoyErrands: [],
    };
    const ensured = ensureWorldState(withEmpties, { id: CAMPAIGN_ID });
    for (const key of WORLD_STATE_CONDITIONAL_KEYS) {
      expect(Object.prototype.hasOwnProperty.call(ensured, key)).toBe(false);
    }
    expect(Object.prototype.hasOwnProperty.call(ensured, WORLD_STATE_SCALAR_GATE)).toBe(false);
    // A dormant (keyless) state and an empty-ledger state serialize identically.
    expectByteEqual(ensureWorldState({ tick: 1 }, { id: CAMPAIGN_ID }), ensured);
  });
});

describe('E-C campaign record — create, persist, reload, migrate fixpoint, clone', () => {
  test('createCampaign → the REAL local persist → loadCached → migrateCampaign survives byte-exact', () => {
    const store = makeStore();
    store.getState().createCampaign('Lifecycle Realm');
    const created = store.getState().campaigns[0];
    // createCampaign already ran persistCampaignState → campaignService.cache
    // (the real localStorage write). Reload through the real load chokepoint.
    const reloaded = campaignService.loadCached('anon').map(migrateCampaign);
    expect(reloaded).toHaveLength(1);
    expectByteEqual(reloaded[0], created);
    // migrate is a fixpoint: a second pass over a loaded campaign is byte-identical.
    expectByteEqual(migrateCampaign(reloaded[0]), reloaded[0]);
  });

  test('a fully-populated campaign survives cache→loadCached→migrate byte-exact (all nested families)', () => {
    const camp = normalizedCampaignFixture();
    campaignService.cache([camp], 'anon');
    const reloaded = campaignService.loadCached('anon').map(migrateCampaign);
    expectByteEqual(reloaded[0], camp);
    expect(() => structuredClone(camp)).not.toThrow();
    expectByteEqual(deepClone(camp), camp);
  });

  test('mapState v2 passes migrate untouched (identity) and survives the JSON persist hop', () => {
    const camp = normalizedCampaignFixture();
    // v2 short-circuit: already-migrated mapState is returned by REFERENCE.
    expect(migrateCampaign(camp).mapState).toBe(camp.mapState);
    expectByteEqual(migrateCampaign(JSON.parse(JSON.stringify(camp))).mapState, camp.mapState);
  });
});

describe('E-C the undo hop — the REAL undoLastPulse, walked over the campaign registry', () => {
  test('every family follows its registered undo policy; nothing else drifts', async () => {
    const store = makeStore();
    const camp = normalizedCampaignFixture();
    store.setState((s) => {
      s.campaigns = [camp];
      s.savedSettlements = [{
        id: 'ashford', name: 'Ashford',
        settlement: memberSettlement(), campaignState: memberCampaignState(),
      }];
      s.activeSaveId = 'ashford';
      s.settlement = memberSettlement();
      s.systemState = { resilience: 40 };
      s.eventLog = [{ id: 'ev0', type: 'ADD_INSTITUTION' }];
      s.phase = 'canon';
    });

    // The pre-advance baseline (what undo must restore), cloned OUTSIDE the store.
    const baseline = deepClone(store.getState().campaigns[0]);
    const baselineSave = deepClone(store.getState().savedSettlements[0]);
    const baselineView = {
      settlement: deepClone(store.getState().settlement),
      systemState: deepClone(store.getState().systemState),
      eventLog: deepClone(store.getState().eventLog),
      phase: store.getState().phase,
    };

    // Capture through the REAL snapshot helper the advance path uses…
    const snapshot = capturePulseSnapshot(store.getState(), store.getState().campaigns[0], NOW);
    store.setState((s) => { s.pulseUndoStack.push(snapshot); });

    // …then mutate EVERY family, as an advance would (and some it wouldn't):
    store.setState((s) => {
      const c = s.campaigns[0];
      c.worldState.tick = 9;                    // restored family
      c.worldState.stressors.push({ id: 'str_2', type: 'plague', severity: 'severe' });
      delete c.worldState.pantheon;             // a conditional ledger drops
      delete c.worldState.envoyErrands;         // the conditional array drops
      c.wizardNews.currentTick = 9;             // restored family
      c.wizardNews.entries = [];
      c.regionalGraph.eventLog.push({ id: 'rg-ev', at: NOW }); // restored family
      c.name = 'Renamed Realm';                 // untouched family — undo must NOT revert
      c.lastReadTick = 9;                       // untouched (V-2 read floor)
      c.flagsSeen = ['warLayerEnabled', 'newFlag']; // untouched (R-16 baseline)
      c.mapState.viewport.scale = 3;            // untouched (undo never touches the map)
      c.collapsed = true;                       // untouched
      const sv = s.savedSettlements[0];
      sv.settlement.population = 9999;          // restored (member save)
      sv.campaignState.phase = 'draft';         // restored (member save)
      s.settlement.population = 9999;           // restored (live view)
      s.systemState = { resilience: 5 };
      s.eventLog = [];
      s.phase = 'draft';
    });
    const mutated = deepClone(store.getState().campaigns[0]);

    const didUndo = await store.getState().undoLastPulse(CAMPAIGN_ID);
    expect(didUndo).toBe(true);
    expect(store.getState().canUndoLastPulse(CAMPAIGN_ID)).toBe(false);

    const after = store.getState().campaigns[0];
    const violations = [];
    for (const [key, policy] of Object.entries(CAMPAIGN_RECORD_REGISTRY)) {
      const got = JSON.stringify(after[key]);
      if (policy.undo === 'restored' && got !== JSON.stringify(baseline[key])) {
        violations.push(`campaign.${key} is registered undo:'restored' but did not return byte-exact to its pre-advance value`);
      } else if (policy.undo === 'untouched' && got !== JSON.stringify(mutated[key])) {
        violations.push(`campaign.${key} is registered undo:'untouched' but the undo changed it — undo must never touch this family`);
      } else if (policy.undo === 'stamp' && typeof after[key] !== 'string') {
        violations.push(`campaign.${key} is registered undo:'stamp' but is not a timestamp string`);
      }
    }
    expect(violations).toEqual([]);
    expectByteEqual(after.worldState.envoyErrands, baseline.worldState.envoyErrands);

    // Member save: settlement + campaignState restore byte-exact; timestamp is the stamp.
    const memberAfter = store.getState().savedSettlements[0];
    expectByteEqual(memberAfter.settlement, baselineSave.settlement);
    expectByteEqual(memberAfter.campaignState, baselineSave.campaignState);

    // Live active view restores verbatim (same member open at advance + undo time).
    expectByteEqual(store.getState().settlement, baselineView.settlement);
    expectByteEqual(store.getState().systemState, baselineView.systemState);
    expectByteEqual(store.getState().eventLog, baselineView.eventLog);
    expect(store.getState().phase).toBe(baselineView.phase);
  });
});

describe('E-C saves envelope — the local substrate: save, import (list), fixpoint, update', () => {
  test('save → list → writeAll → list is a byte-exact fixpoint (the reload/import hop)', async () => {
    await saves.save({
      name: 'Ashford', tier: 'town',
      settlement: memberSettlement(), config: { settType: 'town' },
      institutionToggles: { temple: true }, categoryToggles: { economy: true },
      goodsToggles: { grain: true }, servicesToggles: { svc_smith: true },
      aiData: { narration: null }, versionHistory: [],
    });
    const l1 = await saves.list();
    expect(l1).toHaveLength(1);
    await saves.writeAll(l1);
    const l2 = await saves.list();
    expectByteEqual(l2, l1);
    // The seed lifted from the settlement blob survives the round-trip (finding F2 law).
    expect(l1[0].seed).toBe(12345);
  });

  test('a partial update preserves every untouched envelope field byte-exact', async () => {
    const id = await saves.save({
      name: 'Ashford', tier: 'town', settlement: memberSettlement(), config: { settType: 'town' },
    });
    const [before] = await saves.list();
    await saves.update(id, { name: 'Ashford Renamed' });
    const [after] = await saves.list();
    expect(after.name).toBe('Ashford Renamed');
    expectByteEqual({ ...after, name: before.name }, before);
  });
});

describe('E-C settings substrate — partialize blob ↔ rehydrate merge round-trip', () => {
  const currentStub = () => ({
    config: { ...DEFAULT_CONFIG },
    configExplicitFields: {},
    institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
    displayPrefs: { ...DEFAULT_DISPLAY_PREFS },
    // Realm directive 7 (J-D7): the slice default a blob written before the mode
    // existed must rehydrate to.
    advanceAutoResolve: false,
    // The anonymous draft's slice defaults (settlementSlice).
    settlement: null,
    lastSeed: null,
    draftOrigin: null,
    someSliceMethod: () => {},
  });

  test('a current-shape persisted blob survives the rehydrate merge byte-exact', () => {
    const blob = {
      config: { ...DEFAULT_CONFIG, settType: 'city' },
      configExplicitFields: { priorityEconomy: true },
      institutionToggles: { temple: true }, categoryToggles: { economy: false },
      goodsToggles: { grain: true }, servicesToggles: { svc_smith: true },
      // A CURRENT-shape blob carries every display preference, in DEFAULT_DISPLAY_PREFS
      // key order (the merge spreads the defaults first, and this assertion is
      // byte-exact). ⚰ `sceneQualityMode` (R-5b) and `mapSubTab` (TC-0) were RETIRED
      // with the legacy settlement map (TE-STRIP-3, ODQ §731 / Q-S1), leaving
      // `realmMagicChoice` (MG-1, DESIGN_REALM_MAGIC_TOGGLE §4). The ABSENCE direction
      // is covered by the legacy-blob tests below and the RETIRED-KEY direction by the
      // stale-key arm at the end of this family, which is why moving the bag in either
      // direction is safe rather than a cohort fork. VAR-3 (T11) added
      // `instantKnobPins` — a current-shape blob carries it whole.
      displayPrefs: { realmMagicChoice: 'yes', instantKnobPins: { realmSize: false, tone: false, mapKind: false } },
      advanceAutoResolve: true,
      // The anonymous-draft envelope is UNCONDITIONAL in the projection — always
      // present, null when there is no draft to keep — so a current-shape blob
      // carries it even for a signed-in cohort. That is the point: the persisted
      // SHAPE never forks by tier, only its value does.
      anonDraft: null,
    };
    const merged = mergePersistedState(JSON.parse(JSON.stringify(blob)), currentStub());
    const rePartialized = Object.fromEntries(ZUSTAND_PERSIST_KEYS.map((k) => [k, merged[k]]));
    expectByteEqual(rePartialized, blob);
  });

  // ── THE ANONYMOUS DRAFT (2026-09-18) — ONE RULE, DRIVEN THROUGH THE REAL SLICES.
  //
  // THE RULE: the device keeps the world in the editor when that world was BORN
  // ANONYMOUS (`state.draftOrigin === 'anon'`) and nobody is signed in right now.
  // Every boot adopts what the device kept, whatever the session turns out to be;
  // a signed-in person who finds a draft on screen keeps or clears it themselves,
  // and saving, opening or canonizing it while signed in makes it the account's.
  //
  // ⛔ `draftOrigin` IS TRANSIENT STORE-ROOT STATE (ODQ §934.8), never a key on the
  // settlement and never persisted. A stamp on the world would ride into every save
  // row and into the observed-shape corpus, and the generated object would stop
  // being byte-identical to the pipeline's. It is set at the birth, DERIVED on every
  // rehydrate, re-stamped when a signed-in person makes the world theirs, and nulled
  // at the swap chokepoint — so a door that installs a world and answers nothing
  // leaves `null`, which is not 'anon', and fails CLOSED.
  //
  // ⛔ WHAT THESE ARMS REPLACED, so a future reader does not reintroduce it. The
  // predecessor carried two SESSION CLAIMS beside the world — `restoredAnonDraft`
  // raised by the rehydrate, `signedInWorld` raised at sign-out — plus a spend at
  // the boot auth resolution, retractions on both password doors, a retraction at
  // the settlement-swap chokepoint, a sessionStorage stash with a 30-minute TTL to
  // carry the claim across an OAuth redirect, and a whole-settlement clear for the
  // drop. Each piece existed to keep a claim honest across a boundary the claim
  // could not cross. One DERIVED root field crosses all of them: every door that
  // installs a world answers the question, and the swap chokepoint unanswers it.
  //
  // THE ARMS DRIVE THE REAL AUTH + SETTLEMENT SLICES COMPOSED OVER IMMER, and the
  // three arms that need a world drive the REAL generate action and the REAL
  // pipeline. `deviceWrite` and `bootFrom` are exactly what zustand's persist does
  // on a store write and on a boot — partialize + JSON out, custom merge in.
  describe('the anonymous draft', async () => {
    const { createAuthSlice } = await import('../../src/store/authSlice.js');
    // The non-fatal persist door lives with the store it guards, so this one arm
    // does construct it.
    const { resilientLocalStorage } = await import('../../src/store/index.js');

    // One stand-in world, carrying NO origin of its own — the origin is a fact
    // about the session, held at the store root. What matters to the projection is
    // that the WHOLE object makes the round trip untouched.
    const world = Object.freeze({
      name: 'Ashford', tier: 'town', population: 4000,
      institutions: [{ id: 'i1', name: 'The Salt Hall' }],
      config: { settType: 'town' },
    });
    const USER = Object.freeze({ id: 'u-1', email: 'keeper@example.com' });

    // The REAL slices, composed over a stub of only the cross-slice state they
    // read (the generateStrayConfigSeed idiom). auth is NOT stubbed — the real
    // auth slice owns the session, the tier gates and clearAuth's sign-out.
    const liveStub = (set) => ({
      config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
      institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
      customContent: {},
      importedNeighbour: null,
      campaigns: [], campaignsLoaded: true,
      setCampaignRegionalGraph: (campaignId, graph) => set((state) => {
        const campaign = state.campaigns.find((c) => c.id === campaignId);
        if (campaign) campaign.regionalGraph = graph;
      }),
      setPurchaseModalOpen: () => {},
    });
    const liveStore = () => create(immer((...a) => ({
      ...liveStub(...a), ...createSettlementSlice(...a), ...createAuthSlice(...a),
    })));

    /** What persist writes on EVERY store write: the projection, serialized. */
    const deviceWrite = (store) => JSON.parse(JSON.stringify(partializeOf(store.getState())));
    /** What persist really does on a write: the projection, serialized, INTO the
     *  device's storage under the persist key. Two live stores over one storage is
     *  exactly what two tabs are — one localStorage, two module graphs — so the
     *  arms below can read the slot back the way the projection now does. */
    const deviceCommit = (store) => {
      const blob = deviceWrite(store);
      // zustand's `{ state, version }` wrapper; the version is irrelevant to the
      // read (it walks `.state.anonDraft`) and its shape is pinned against the REAL
      // middleware in the post-signup arm below rather than assumed here.
      globalThis.localStorage.setItem(PERSIST_KEY, JSON.stringify({ state: blob, version: 2 }));
      return blob;
    };
    /** The envelope the DEVICE is holding, straight off storage. */
    const readSlot = () => {
      const raw = globalThis.localStorage.getItem(PERSIST_KEY);
      return raw ? JSON.parse(raw).state.anonDraft : null;
    };
    /** What persist does on a boot: the custom merge over a fresh store. */
    const bootFrom = (blob) => {
      const store = liveStore();
      store.setState(mergePersistedState(JSON.parse(JSON.stringify(blob)), store.getState()), true);
      return store;
    };
    /** Everything a current blob carries EXCEPT the draft. */
    const bareBlob = () => ({
      config: { ...DEFAULT_CONFIG },
      configExplicitFields: {},
      institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
      displayPrefs: { ...DEFAULT_DISPLAY_PREFS },
      advanceAutoResolve: false,
    });
    const anonBlob = () => ({ ...bareBlob(), anonDraft: { settlement: world, lastSeed: 'sf-seed-1' } });

    // This suite runs in the NODE environment (no `@vitest-environment jsdom`), and
    // node has neither web storage, so a storage-backed arm installs its own shim
    // rather than depend on an ambient one. That also makes it honest about what it
    // proves: the module's contract, not the host's storage.
    const installStorage = (name) => {
      const previous = Object.getOwnPropertyDescriptor(globalThis, name);
      const backing = new Map();
      Object.defineProperty(globalThis, name, {
        configurable: true,
        value: {
          getItem: (k) => (backing.has(k) ? backing.get(k) : null),
          setItem: (k, v) => { backing.set(k, String(v)); },
          removeItem: (k) => { backing.delete(k); },
          clear: () => backing.clear(),
        },
      });
      return () => {
        if (previous) Object.defineProperty(globalThis, name, previous);
        else delete globalThis[name];
      };
    };

    test("an anonymous generation stamps the world 'anon', the device keeps it, and the next boot adopts it", async () => {
      const store = liveStore();
      // anchored: the real auth slice boots anonymous, which is the cohort the
      // whole rule exists for (an anonymous account has maxSaves 0, so no library
      // holds this world and nothing else would).
      expect(store.getState().auth.user).toBeNull();

      const born = await store.getState().generateSettlement('anon-seed-1');
      expect(store.getState().draftOrigin).toBe('anon');
      // ⛔ AND THE WORLD ITSELF CARRIES NOTHING. The origin is a fact about the
      // SESSION; the settlement is persisted into saves and read by the
      // observed-shape corpus, so a stamp on it would ride into both and the
      // committed object would stop being the pipeline's. Anchored on a key the
      // pipeline really does produce, so this cannot pass against an empty object.
      expectAbsentWithAnchor(Object.keys(born), 'draftOrigin', 'name', 'the generated world');
      expect(store.getState().settlement).toBe(born);

      const blob = deviceWrite(store);
      expect(blob.anonDraft.lastSeed).toBe('anon-seed-1');
      expect(blob.anonDraft.settlement.name).toBe(born.name);
      // anchored: the envelope's payload is the generated object verbatim, which the byte-compare below re-proves after the round trip
      expect(Object.keys(blob.anonDraft.settlement)).not.toContain('draftOrigin');

      const rebooted = bootFrom(blob);
      // Byte-identical, not merely deep-equal: a save taken after a reload must
      // write exactly what a save taken before it would have written.
      expectByteEqual(rebooted.getState().settlement, blob.anonDraft.settlement);
      expect(rebooted.getState().lastSeed).toBe('anon-seed-1');
      // …and the adopted draft is still the device's, so it survives the NEXT
      // write too. A boot that adopted and then lost it on the first store write
      // would look identical at the moment of the reload.
      expect(deviceWrite(rebooted).anonDraft.settlement.name).toBe(born.name);
      // The rehydrate DERIVES the origin from the adoption itself — nothing in the
      // blob asserts it, so a hand-edited one cannot claim it.
      expect(rebooted.getState().draftOrigin).toBe('anon');
    });

    test("a signed-in generation stamps 'account' and the device keeps nothing", async () => {
      const store = liveStore();
      store.getState().setAuth(USER, { access_token: 't' }, 'free', 'user');

      const born = await store.getState().generateSettlement('account-seed-1');
      expect(store.getState().draftOrigin).toBe('account');
      expectAbsentWithAnchor(Object.keys(born), 'draftOrigin', 'name', 'the generated world');

      const blob = deviceWrite(store);
      // The KEY is still there — the persisted SHAPE never forks by cohort, only
      // its value does — and the value is null.
      expect(Object.hasOwn(blob, 'anonDraft')).toBe(true);
      expect(blob.anonDraft).toBeNull();
    });

    test('an anonymous draft survives an in-page sign-in on screen, and the device then lets it go', () => {
      const store = bootFrom(anonBlob());
      expect(store.getState().settlement).toEqual(world);

      // The in-page doors end by publishing the session; nothing in that path
      // touches the editor, which is the whole of rule 3.
      store.getState().setAuth(USER, { access_token: 't' }, 'free', 'user');
      expect(store.getState().settlement).toEqual(world);

      // ⭐ THE DECIDED ANSWER, PINNED. zustand's persist writes the WHOLE
      // projection on every store write, so the envelope is not "left standing
      // until something overwrites it": the first write after the sign-in replaces
      // it with null. The draft stays on screen and is theirs to keep or clear;
      // the DEVICE stops remembering it, because from here the library is where
      // their worlds live and saving is a deliberate act.
      expect(deviceWrite(store).anonDraft).toBeNull();

      // anchored: signing out again re-offers it, because a world born anonymous
      // and never saved is still this device's draft.
      store.getState().clearAuth();
      expect(deviceWrite(store).anonDraft).toEqual({ settlement: world, lastSeed: 'sf-seed-1' });
    });

    test("a signed-in account's world never lands in storage, and sign-out does not change that", async () => {
      const store = liveStore();
      store.getState().setAuth(USER, { access_token: 't' }, 'free', 'user');
      store.getState().setSettlement(world);
      expect(deviceWrite(store).anonDraft).toBeNull();

      // Sign-out LEAVES THE WORLD ON SCREEN on purpose — eviction comes through
      // the same door and must never destroy unsaved work — and sets tier 'anon'.
      store.getState().clearAuth();
      expect(store.getState().auth.tier).toBe('anon');
      expect(store.getState().settlement).toEqual(world);
      // …and the world's own stamp, not a sign-out-time bar, is what refuses it.
      expect(deviceWrite(store).anonDraft).toBeNull();

      // EDITING IT DOES NOT LIFT THE REFUSAL. The retired bar named the OBJECT,
      // and immer replaces that on every mutation, so one rename leaked the
      // departing account's world into this device's storage.
      store.setState((state) => { state.settlement.name = 'Renamed after sign-out'; });
      expect(store.getState().settlement).not.toBe(world);
      expect(deviceWrite(store).anonDraft).toBeNull();

      // And it is not a blanket off-switch: a world the anonymous visitor forges
      // afterwards is born 'anon' and persists normally.
      const forged = await store.getState().generateSettlement('post-signout-1');
      expect(store.getState().draftOrigin).toBe('anon');
      expect(deviceWrite(store).anonDraft.lastSeed).toBe('post-signout-1');
    });

    test('saving while signed in makes the world the account\'s, so the device stops re-persisting it', () => {
      const store = bootFrom(anonBlob());
      store.getState().setAuth(USER, { access_token: 't' }, 'free', 'user');

      // The real draft→save hand-off every create chokepoint funnels through.
      store.getState().setActiveSaveId('save-1');
      expect(store.getState().draftOrigin).toBe('account');

      store.getState().clearAuth();
      expect(deviceWrite(store).anonDraft).toBeNull();
    });

    test('the POST-SIGNUP save claims the world, so the next sign-out stashes nothing', async () => {
      // ⛔ THE CONVERSION PATH, AND THE ONE DOOR THAT DID NOT CLAIM. Generate
      // anonymously, click "Save this town — free account", sign up: the
      // SAVE_SETTLEMENT intent fires and its handler persisted the row without
      // ever binding the save id, so the world stayed recorded as this device's
      // ANONYMOUS draft. The next sign-out then wrote an account's library row
      // into localStorage for the next visitor on a shared machine.
      //
      // Driven through the REAL registry and the REAL handler — registered here
      // rather than awaited off the module's own floating registration, so the
      // arm cannot race it — over the app's real store and the real local-mode
      // saves service (this file forces LOCAL mode; services are never stubbed).
      const storeModule = await import('../../src/store/index.js');
      const intents = await import('../../src/lib/authIntents.js');
      intents._resetForTests();
      storeModule.registerAuthIntentHandlers(intents);
      const live = storeModule.useStore;

      live.setState((state) => { state.settlement = { ...world }; state.draftOrigin = 'anon'; });
      live.getState().setAuth(USER, { access_token: 't' }, 'free', 'user');
      // anchored: the world really is the device's anonymous draft at this point
      expect(live.getState().draftOrigin).toBe('anon');

      intents.setPending(intents.INTENTS.SAVE_SETTLEMENT, {
        name: world.name, tier: world.tier, settlement: { ...world }, config: null,
      });
      const saveId = await intents.consume({ user: USER });
      expect(saveId).toBeTruthy();

      // The save bound its id through the same door the other three chokepoints
      // use, and that door is what claims the world.
      expect(live.getState().activeSaveId).toBe(saveId);
      expect(live.getState().draftOrigin).toBe('account');

      live.getState().clearAuth();
      expect(partializeOf(live.getState()).anonDraft).toBeNull();
      live.getState().clearSettlement();

      // ⭐ AND WHILE THE REAL PERSISTED STORE IS DRIVEN HERE, THE WRAPPER IS PINNED.
      // The projection now READS this key back (persistProjection.js), so the two-tab
      // arms below have to hand-build what the middleware writes. This makes that
      // hand-build a CHECKED copy: the middleware's own blob, read off the device.
      const wrapper = JSON.parse(globalThis.localStorage.getItem(PERSIST_KEY));
      expect(Object.keys(wrapper).sort()).toEqual(['state', 'version']);
      expect(Object.hasOwn(wrapper.state, 'anonDraft')).toBe(true);
    });

    test('opening a save from the library claims it, whatever origin its blob carries', () => {
      // The stamp lands on the IN-EDITOR world at the save, so a row written
      // before that still reads 'anon' inside. Without this claim a keeper who
      // opened such a save and then signed out would have their own saved world
      // stashed as this device's anonymous draft.
      const store = liveStore();
      store.getState().setAuth(USER, { access_token: 't' }, 'free', 'user');
      store.getState().hydrateFromSave({ id: 'save-9', settlement: world, seed: 'sf-seed-1' });
      expect(store.getState().draftOrigin).toBe('account');

      store.getState().clearAuth();
      expect(deviceWrite(store).anonDraft).toBeNull();
    });

    test("canon claims a signed-in world, and leaves an anonymous visitor's own draft alone", () => {
      const keeper = bootFrom(anonBlob());
      keeper.getState().setAuth(USER, { access_token: 't' }, 'free', 'user');
      keeper.getState().canonize();
      expect(keeper.getState().phase).toBe('canon');
      expect(keeper.getState().draftOrigin).toBe('account');

      // The claim is guarded on a REAL USER, never on the tier: an anonymous
      // visitor making their own draft canon has not handed it to an account.
      const visitor = bootFrom(anonBlob());
      visitor.getState().canonize();
      expect(visitor.getState().draftOrigin).toBe('anon');
      expect(deviceWrite(visitor).anonDraft).toEqual({ settlement: world, lastSeed: 'sf-seed-1' });
    });

    test('a redirect sign-in door writes nothing to the device, and the return boot still has the draft', async () => {
      // ⛔ THE STASH IS GONE. OAuth and magic link navigate the browser AWAY, so
      // no store write survives them; the predecessor stashed the claim in
      // sessionStorage with a 30-minute TTL so the return boot could honour it.
      // There is no claim to carry now — the draft is simply the device's — so
      // these doors touch no storage at all.
      const writes = [];
      const previous = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
      Object.defineProperty(globalThis, 'sessionStorage', {
        configurable: true,
        value: { getItem: () => null, setItem: (k, v) => { writes.push([k, v]); }, removeItem: () => {} },
      });
      try {
        const store = bootFrom(anonBlob());
        expect(await store.getState().authOAuth('google')).toMatchObject({ mock: true });
        expect(await store.getState().authMagicLink('keeper@example.com')).toMatchObject({ sentTo: 'keeper@example.com' });
        expect(writes).toEqual([]);
      } finally {
        if (previous) Object.defineProperty(globalThis, 'sessionStorage', previous);
        else delete globalThis.sessionStorage;
      }

      // THE RETURN: a brand-new store booting into a session that resolves
      // SIGNED-IN. The draft is adopted and stays adopted — there is no boot
      // resolution left to drop it, which is the bug the stash existed to paper
      // over (three cuts in a row got that drop's edges wrong).
      const returned = bootFrom(anonBlob());
      expect(returned.getState().settlement).toEqual(world);
      returned.getState().setAuth(USER, { access_token: 't' }, 'free', 'user');
      expect(returned.getState().settlement).toEqual(world);
      expect(returned.getState().lastSeed).toBe('sf-seed-1');
    });

    test('no signed-in session persists a draft, however the origin reads', () => {
      // The USER is the whole of the second condition: a tier that reads 'anon'
      // while a user object is still attached is a half-applied transition, and
      // half-applied is not a state to persist a world from.
      const anon = { ...currentStub(), settlement: world, lastSeed: 'sf-seed-1', draftOrigin: 'anon' };
      for (const [label, auth] of [
        ['a free account', { tier: 'free', user: USER }],
        ['a premium account', { tier: 'premium', user: USER }],
        ['a half-applied anonymous tier', { tier: 'anon', user: USER }],
      ]) {
        const projected = partializeOf({ ...anon, auth });
        expect(Object.hasOwn(projected, 'anonDraft'), label).toBe(true);
        expect(projected.anonDraft, label).toBeNull();
      }
      // anchored: the SAME state with no user attached is written, so each refusal
      // above is the user, not the fixture.
      expect(partializeOf({ ...anon, auth: { tier: 'anon', user: null } }).anonDraft)
        .toEqual({ settlement: world, lastSeed: 'sf-seed-1' });
    });

    test('the origin is DERIVED and NEVER persisted, so no blob can assert one', () => {
      // It is absent from the projection by construction — the registry arm above
      // proves that over the whole key list — and a blob that carries one anyway
      // cannot smuggle it past the merge, which writes the derived answer AFTER the
      // spread. A persisted origin would outlive the session it describes.
      const projected = partializeOf({ ...currentStub(), auth: { tier: 'anon', user: null }, settlement: world, draftOrigin: 'anon' });
      expect(projected.anonDraft).toEqual({ settlement: world, lastSeed: null });
      // `anonDraft` is the anchor on purpose: it is the key this very state PUT in
      // the projection, so it travels the same path the excluded one would have.
      expectAbsentWithAnchor(Object.keys(projected), 'draftOrigin', 'anonDraft', 'the persist projection');
      const smuggled = mergePersistedState({ ...bareBlob(), draftOrigin: 'anon' }, currentStub());
      expect(smuggled.draftOrigin).toBe('account');
    });

    test('a door that installs a world without answering the question fails CLOSED', () => {
      // setSettlement is a real non-generate load path (the Library's "apply saved
      // configuration", the wizard's restore). It routes through the swap
      // chokepoint, which NULLS the origin — and null is not 'anon', so the device
      // keeps nothing rather than guessing.
      const store = bootFrom(anonBlob());
      // anchored: the boot really did adopt a draft this device was keeping
      expect(deviceWrite(store).anonDraft).toEqual({ settlement: world, lastSeed: 'sf-seed-1' });
      store.getState().setSettlement({ ...world, name: 'Arrived by another door' });
      expect(store.getState().draftOrigin).toBeNull();
      expect(deviceWrite(store).anonDraft).toBeNull();
      // …and clearing the editor leaves nothing to write either.
      store.getState().clearSettlement();
      expect(store.getState().draftOrigin).toBeNull();
      expect(deviceWrite(store).anonDraft).toBeNull();
    });

    test('a blob written BEFORE the draft was persisted rehydrates to the slice default', () => {
      const legacy = bareBlob();
      // anchored: the sibling key proves the blob really is the pre-draft shape
      expect(Object.hasOwn(legacy, 'anonDraft')).toBe(false);
      const merged = mergePersistedState(legacy, currentStub());
      expect(merged.settlement).toBeNull();
      expect(merged.lastSeed).toBeNull();
      // Nothing was adopted, so the derived answer is the fail-closed one.
      expect(merged.draftOrigin).toBe('account');
    });

    test('the payload is lifted VERBATIM, and the adoption itself is what says \'anon\'', () => {
      // No bridge and no backfill are needed for an envelope written by any earlier
      // build: adopting one IS the claim that an anonymous session wrote the world,
      // which is the only thing this envelope has ever meant. Nothing is copied, so
      // the restored draft is byte-identical to the generated one — a save after a
      // reload writes exactly what a save before it would.
      const store = bootFrom(anonBlob());
      expect(store.getState().draftOrigin).toBe('anon');
      expectByteEqual(store.getState().settlement, world);
      expect(deviceWrite(store).anonDraft).toEqual({ settlement: world, lastSeed: 'sf-seed-1' });
    });

    test('a stale, half-migrated or hand-edited envelope is refused outright', () => {
      // Every shape that is not a genuine envelope. `{}` is the stale case a
      // presence-only check would have adopted; `true` and the string are what a
      // half-migrated or hand-edited blob looks like; a top-level `settlement` is
      // the pre-envelope shape trying to smuggle itself past the check.
      const notEnvelopes = [
        ['absent', {}],
        ['null', { anonDraft: null }],
        ['a bare true', { anonDraft: true }],
        ['a string', { anonDraft: 'yes' }],
        ['an empty object', { anonDraft: {} }],
        ['an array', { anonDraft: [{ settlement: world }] }],
        ['an envelope with no settlement', { anonDraft: { lastSeed: 'sf-seed-1' } }],
        ['a pre-envelope top-level settlement', { settlement: world, lastSeed: 'sf-seed-1' }],
      ];
      for (const [label, blob] of notEnvelopes) {
        const merged = mergePersistedState({ ...blob }, currentStub());
        expect(merged.settlement, label).toBeNull();
        expect(merged.lastSeed, label).toBeNull();
      }
    });

    // ── ⭐⭐ THE TWO-TAB SLOT (2026-09-19) — THE ELSE-BRANCH IS NO LONGER A BARE NULL.
    //
    // persist writes the WHOLE projection on every store write, so for as long as the
    // else-branch wrote `null` it was a write ABOUT a slot that might not be this
    // tab's. Tab A holds an anonymous world and takes the slot; tab B — another
    // anonymous world, same device — takes it next; A then signs in, and A's next
    // write nulled the slot. B's draft was gone and A had never held it.
    //
    // The rule now compares IDENTITY: (a) born anonymous with nobody signed in writes
    // this world, exactly as before; (b) otherwise a slot holding THIS world is
    // retired; (c) otherwise the stored envelope is written back untouched.

    test("two anonymous tabs: signing in and saving in one never takes the other tab's draft", () => {
      globalThis.localStorage.removeItem(PERSIST_KEY);
      const worldA = { ...world, id: 'w-ashford', name: 'Ashford' };
      const worldB = { ...world, id: 'w-bellhollow', name: 'Bellhollow' };

      // TAB A — an anonymous world on screen. Case (a): its write takes the slot.
      const a = liveStore();
      a.setState((state) => { state.settlement = worldA; state.lastSeed = 'seed-a'; state.draftOrigin = 'anon'; });
      expect(deviceCommit(a).anonDraft).toEqual({ settlement: worldA, lastSeed: 'seed-a' });

      // TAB B — a DIFFERENT anonymous world on the same device. One slot, and the
      // last case-(a) write owns it. That half is unchanged and is not the defect.
      const b = liveStore();
      b.setState((state) => { state.settlement = worldB; state.lastSeed = 'seed-b'; state.draftOrigin = 'anon'; });
      expect(deviceCommit(b).anonDraft).toEqual({ settlement: worldB, lastSeed: 'seed-b' });

      // ⭐ A SIGNS IN — the write that used to eat B's draft. A's world is not what
      // the slot holds, so A has no standing to retire it.
      a.getState().setAuth(USER, { access_token: 't' }, 'free', 'user');
      expect(deviceCommit(a).anonDraft).toEqual({ settlement: worldB, lastSeed: 'seed-b' });

      // …and A SAVING does not take it either. The claim retires A's OWN world, and
      // A's own world is still not the one in the slot.
      a.getState().setActiveSaveId('save-a');
      expect(a.getState().draftOrigin).toBe('account');
      expect(deviceCommit(a).anonDraft).toEqual({ settlement: worldB, lastSeed: 'seed-b' });

      // ⭐ AND THE HOLDER STILL GIVES IT BACK, which is what keeps (c) from being a
      // leak: B signs in and saves, so the world being claimed IS the world in the
      // slot — that write, and only that write, nulls it.
      b.getState().setAuth(USER, { access_token: 't' }, 'free', 'user');
      b.getState().setActiveSaveId('save-b');
      expect(b.getState().draftOrigin).toBe('account');
      expect(deviceCommit(b).anonDraft).toBeNull();
      expect(readSlot()).toBeNull();
    });

    test('the slot is retired only by the tab whose world it holds — the id leads, so a rename keeps the claim', () => {
      const holding = (settlement, lastSeed) => {
        globalThis.localStorage.setItem(PERSIST_KEY, JSON.stringify({
          state: { anonDraft: { settlement, lastSeed } }, version: 2,
        }));
      };
      /** The projection over a signed-in tab — i.e. every write that is not case (a). */
      const signedInWrite = (settlement, lastSeed) => partializeOf({
        ...currentStub(), auth: { tier: 'free', user: USER }, settlement, lastSeed, draftOrigin: 'anon',
      }).anonDraft;

      const held = { ...world, id: 'w-ashford', name: 'Ashford' };

      // (b) the slot holds THIS world → the claim retires it, as it always did.
      holding(held, 'seed-a');
      expect(signedInWrite(held, 'seed-a')).toBeNull();

      // …and a RENAME does not lose the claim. `settlement.id` is seed-stable and
      // rename-stable, so a name-first identity would hand a visitor's own slot to
      // the "another tab's draft" branch and strand it there.
      holding(held, 'seed-a');
      expect(signedInWrite({ ...held, name: 'Ashford-upon-Wold' }, 'seed-a')).toBeNull();

      // (c) a different id is a different world, whatever it is called.
      holding(held, 'seed-a');
      expect(signedInWrite({ ...held, id: 'w-other' }, 'seed-a'))
        .toEqual({ settlement: held, lastSeed: 'seed-a' });

      // THE UN-NORMALISED FALLBACK — an imported or hand-built world with no id at
      // all, where name + seed carry the identity between them.
      const idless = { ...world };
      holding(idless, 'seed-a');
      expect(signedInWrite(idless, 'seed-a')).toBeNull();
      holding(idless, 'seed-a');
      expect(signedInWrite({ ...idless, name: 'Bellhollow' }, 'seed-a'))
        .toEqual({ settlement: idless, lastSeed: 'seed-a' });
      holding(idless, 'seed-a');
      expect(signedInWrite(idless, 'seed-b'))
        .toEqual({ settlement: idless, lastSeed: 'seed-a' });
      globalThis.localStorage.removeItem(PERSIST_KEY);
    });

    test("an unreadable device blob keeps nothing, and a cleared editor leaves another tab's draft standing", () => {
      const signedInWrite = (settlement, lastSeed) => partializeOf({
        ...currentStub(), auth: { tier: 'free', user: USER }, settlement, lastSeed, draftOrigin: 'anon',
      }).anonDraft;
      const held = { ...world, id: 'w-bellhollow', name: 'Bellhollow' };

      // FAIL CLOSED on everything that is not a readable envelope: there is no
      // draft to protect, so the answer is the bare null the branch always wrote.
      // The guard is `readAnonDraft`, the SAME one the rehydrate uses, so the read
      // and the write cannot disagree about what an envelope is.
      for (const [label, raw] of [
        ['no blob at all', null],
        ['unparseable JSON', '{ not json'],
        ['no state wrapper', JSON.stringify({ version: 2 })],
        ['a null slot', JSON.stringify({ state: { anonDraft: null }, version: 2 })],
        ['a stale empty envelope', JSON.stringify({ state: { anonDraft: {} }, version: 2 })],
        ['a bare true', JSON.stringify({ state: { anonDraft: true }, version: 2 })],
        ['an array', JSON.stringify({ state: { anonDraft: [{ settlement: held }] }, version: 2 })],
      ]) {
        if (raw === null) globalThis.localStorage.removeItem(PERSIST_KEY);
        else globalThis.localStorage.setItem(PERSIST_KEY, raw);
        expect(signedInWrite({ ...world }, 'seed-x'), label).toBeNull();
      }
      // anchored: the SAME projection over the SAME state writes the stored envelope back the moment the blob really is one, so each refusal above is the blob rather than the fixture
      globalThis.localStorage.setItem(PERSIST_KEY, JSON.stringify({
        state: { anonDraft: { settlement: held, lastSeed: 'seed-b' } }, version: 2,
      }));
      expect(signedInWrite({ ...world }, 'seed-x')).toEqual({ settlement: held, lastSeed: 'seed-b' });

      // ⚠ THE DECIDED RESIDUAL (persistProjection.js header, 2026-09-19). A CLEARED
      // editor has no world to compare — the swap chokepoint nulls the world AND the
      // origin — so the slot cannot be shown to be this tab's and is LEFT STANDING.
      // Nulling on an empty editor is the flap again: it would eat the draft above on
      // a guess. Resurrecting a draft is an annoyance; eating one is data loss.
      const store = bootFrom(anonBlob());
      store.getState().clearSettlement();
      expect(store.getState().settlement).toBeNull();
      expect(store.getState().draftOrigin).toBeNull();
      expect(deviceWrite(store).anonDraft).toEqual({ settlement: held, lastSeed: 'seed-b' });

      // …and the next generation takes the slot back through case (a), which is why
      // the residual is an annoyance rather than a trap.
      const fresh = { ...world, id: 'w-fresh', name: 'Fresh Hollow' };
      store.setState((state) => { state.settlement = fresh; state.lastSeed = 'seed-fresh'; state.draftOrigin = 'anon'; });
      expect(deviceWrite(store).anonDraft).toEqual({ settlement: fresh, lastSeed: 'seed-fresh' });
      globalThis.localStorage.removeItem(PERSIST_KEY);
    });

    test('a quota error on the persist write is swallowed, and generation is unaffected', async () => {
      const restoreLocal = installStorage('localStorage');
      const realSetItem = globalThis.localStorage.setItem;
      const quota = Object.assign(new Error('QuotaExceededError'), { name: 'QuotaExceededError' });
      globalThis.localStorage.setItem = () => { throw quota; };
      try {
        // The whole point: a full or blocked device degrades to "this device does
        // not remember", never to a throw out of the store's own `set` — which is
        // where zustand's persist calls setItem, i.e. inside generation.
        expect(() => resilientLocalStorage.setItem('settlementforge', '{}')).not.toThrow();
        const store = liveStore();
        const world = await store.getState().generateSettlement('quota-seed-1');
        expect(store.getState().draftOrigin).toBe('anon');
        expect(store.getState().settlement).toBe(world);
      } finally {
        globalThis.localStorage.setItem = realSetItem;
      }
      // anchored: the same wrapper writes and reads back normally once the device works again
      globalThis.localStorage.removeItem('sf-probe');
      resilientLocalStorage.setItem('sf-probe', 'kept');
      expect(resilientLocalStorage.getItem('sf-probe')).toBe('kept');
      resilientLocalStorage.removeItem('sf-probe');
      expect(resilientLocalStorage.getItem('sf-probe')).toBeNull();
      restoreLocal();
    });

    // The one claim with nothing to drive: that the retired machinery is GONE
    // rather than merely unreachable. Every file is read as CODE ONLY, so the
    // headers explaining what was removed are not measured as uses, and every
    // absence goes through expectAbsentWithAnchor with a LIVE sibling from the
    // same file — a bare absence would read the same against a module that had
    // been renamed, gutted or moved out from under the scan.
    test('the claim, the redirect stash and the boot drop are absent from the code', () => {
      const RETIRED = ['restoredAnonDraft', 'signedInWorld'];
      for (const [label, path, anchor, retired] of [
        ['authSlice', 'src/store/authSlice.js', 'initAuth: async () => {', ['anonDraft', ...RETIRED]],
        ['persistMerge', 'src/store/persistMerge.js', 'export function readAnonDraft', RETIRED],
        ['the swap chokepoint', 'src/store/settlementLifecycleHelpers.js', 'export function resetSettlementIdentity', RETIRED],
        ['settlementSlice', 'src/store/settlementSlice.js', 'claimSettlementForAccount', RETIRED],
      ]) {
        const code = codeOnly(readSrc(path));
        for (const member of retired) expectAbsentWithAnchor(code, member, anchor, `${label} — ${member}`);
      }

      const index = readSrc('src/store/index.js');
      expect(index).toContain('partialize: partializeStoreState');
      // anchored: the line above proves this is still the composed store's entry module, so the missing subscription is wiring DELETED rather than a file that drifted; the pattern stays a regex because the retired wiring's whitespace was never pinned
      expect(index).not.toMatch(/subscribe\(\s*\(s\)\s*=>\s*s\.auth\?\.loading/);
      // …and the module the whole claim machinery lived in is gone from disk.
      expect(() => readSrc('src/store/anonDraftGate.js')).toThrow();
    });
  });

  // ── Realm directive 7 (J-D7): the full-auto-resolve play mode, both directions.
  // The point of persisting it is that the mode SURVIVES a reload; the point of it
  // being safe is that a blob written before it existed is indistinguishable from a
  // fresh install. Both run through the REAL partialize + merge pair.

  test('the full-auto-resolve mode survives the persist to rehydrate round trip', () => {
    const merged = mergePersistedState(
      JSON.parse(JSON.stringify({ ...currentStub(), advanceAutoResolve: true, someSliceMethod: undefined })),
      currentStub(),
    );
    expect(merged.advanceAutoResolve).toBe(true);
  });

  test('a blob written BEFORE the mode existed rehydrates to the shipped default', () => {
    // The legacy blob: every pre-directive-7 key, and no advanceAutoResolve at all.
    const legacy = {
      config: { ...DEFAULT_CONFIG },
      configExplicitFields: {},
      institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
      displayPrefs: { ...DEFAULT_DISPLAY_PREFS },
    };
    // anchored: the sibling key proves the blob really rehydrated (not an empty merge)
    expect(Object.hasOwn(legacy, 'advanceAutoResolve')).toBe(false);
    const merged = mergePersistedState(legacy, currentStub());
    expect(merged.displayPrefs).toEqual({ ...DEFAULT_DISPLAY_PREFS });
    expect(merged.advanceAutoResolve).toBe(false);
  });

  // ── R-5b: the display-preference family, both directions ───────────────────
  // The whole point of the family is that a chosen preference SURVIVES; the whole
  // point of it being safe is that its ABSENCE is indistinguishable from a fresh
  // install. Both are pinned through the REAL partialize + merge pair.
  // ⚰ RE-ANCHORED ONTO `realmMagicChoice` (TE-STRIP-3, ODQ §731 / Q-S1). This family
  // rode `sceneQualityMode`, which was retired with the legacy settlement map along
  // with `mapSubTab`. The bag still has a live member, so the family keeps a real
  // subject rather than being deleted — what it pins is a property of the SLICE
  // (shape-guarded setter, defaults-first merge, absent-tolerant rehydrate), not of
  // whichever key happens to occupy it. That is why re-anchoring is the right move
  // here and deleting would have been the lossy one.

  test('a set display preference survives the persist → rehydrate round trip', () => {
    const store = makeSettingsStore();
    store.getState().setRealmMagicChoice('no');
    // The persist hop, exactly as the store performs it: partialize → JSON → merge.
    const blob = JSON.parse(JSON.stringify(partializeOf(store.getState())));
    expect(blob.displayPrefs).toEqual({ realmMagicChoice: 'no', instantKnobPins: { realmSize: false, tone: false, mapKind: false } });
    const merged = mergePersistedState(blob, currentStub());
    expect(merged.displayPrefs.realmMagicChoice).toBe('no');
  });

  test('a blob with NO displayPrefs (every save written before R-5b) rehydrates to the default', () => {
    const legacy = { config: { ...DEFAULT_CONFIG } };
    const merged = mergePersistedState(legacy, currentStub());
    expect(merged.displayPrefs).toEqual({ ...DEFAULT_DISPLAY_PREFS });
    expect(merged.displayPrefs.realmMagicChoice).toBe('yes');
    // And a bag present but missing a future key still backfills that key, which
    // is the cohort-fork cure this family inherited from `config`.
    const partial = mergePersistedState({ displayPrefs: {} }, currentStub());
    expect(partial.displayPrefs.realmMagicChoice).toBe('yes');
  });

  test('the setter refuses a non-string rather than persisting junk', () => {
    const store = makeSettingsStore();
    store.getState().setRealmMagicChoice(null);
    expect(store.getState().displayPrefs.realmMagicChoice).toBe('yes');
    store.getState().setRealmMagicChoice(7);
    expect(store.getState().displayPrefs.realmMagicChoice).toBe('yes');
  });

  // ── ⚰ THE RETIRED-KEY DIRECTION (TE-STRIP-3, owner grant ODQ §731 / Q-S1) ──────
  // The three arms above cover a key ARRIVING and a key being ABSENT. Retiring
  // `sceneQualityMode`, `mapSubTab` and the fog blob's `fogSessions` opened a third
  // direction the family had never been asked about: a save written BEFORE the
  // retirement still carries keys nothing reads any more. Loading one must not
  // crash — that is the tolerance the owner's prelaunch order relies on, since no
  // destructive migration was written.
  //
  // ⚠ AND THE TOLERANCE IS ASSERTED AS IT ACTUALLY BEHAVES, NOT AS IT READS BETTER.
  // The merge spreads the DEFAULTS first and the persisted bag OVER them, so a
  // retired key SURVIVES the rehydrate and is written back on the next partialize.
  // It is ignored, not erased. Saying "the next partialize drops it" would have been
  // the comfortable version and it is false; this arm pins the true one so nobody
  // later "fixes" a drop that never happened.

  test('a save written BEFORE the retirement loads without crashing, keys and all', () => {
    const stale = {
      config: { ...DEFAULT_CONFIG },
      // Exactly what a pre-retirement blob carried, verbatim.
      displayPrefs: { sceneQualityMode: 'low', mapSubTab: 'panorama', realmMagicChoice: 'no' },
    };
    // Anchored: the retired keys really are gone from the live defaults, so the arm
    // below is measuring tolerance rather than a bag that still declares them.
    expect(Object.hasOwn(DEFAULT_DISPLAY_PREFS, 'sceneQualityMode')).toBe(false);
    expect(Object.hasOwn(DEFAULT_DISPLAY_PREFS, 'mapSubTab')).toBe(false);

    const merged = mergePersistedState(JSON.parse(JSON.stringify(stale)), currentStub());
    // The LIVE key still rehydrates correctly — the retired ones did not disturb it.
    expect(merged.displayPrefs.realmMagicChoice).toBe('no');
    // …and the retired keys ride along inert rather than throwing or being erased.
    expect(merged.displayPrefs.sceneQualityMode).toBe('low');
    expect(merged.displayPrefs.mapSubTab).toBe('panorama');
    // The full round trip through the REAL partialize survives too, which is the hop
    // a returning user actually performs.
    expect(() => JSON.parse(JSON.stringify(partializeOf(merged)))).not.toThrow();
  });

  test('a settlement blob still carrying the retired fogSessions key loads and is ignored', () => {
    // `applyFogEdit` wrote `settlement.fogSessions` into the SAVE BLOB and was retired
    // with the fog write path (fogEditSlice.js / fogEditBody.js deleted). Nothing writes
    // the key now, but a blob saved before this commit still has it, and the hydrate hop
    // must carry it through without a reader.
    const stale = {
      name: 'Cnocbuidhe', id: 7,
      fogSessions: { 'friday-game': { name: 'Friday Game', districts: ['dA'], buildings: ['cat:vault'] } },
    };
    const revived = JSON.parse(JSON.stringify(stale));
    expect(revived.fogSessions).toEqual(stale.fogSessions);
    // Anchored on the real allowlist rather than on a hand-copy of it: the key is not
    // public, so no projection was ever obliged to understand it — which is precisely
    // why leaving it inert is safe.
    // ⚠ AND ANCHORED IN THE WALKER'S SENSE TOO. A bare `not.toContain` here would pass
    // just as happily if PUBLIC_TOPLEVEL_KEYS had drifted away to nothing — it would
    // outlive the regression it was written to catch. `spatialLayout` is the anchor
    // because it is the allowlisted SIBLING that travels the same projection path as
    // the fog sidecar: both hang off the settlement's spatial half, one public, one not.
    expectAbsentWithAnchor(
      [...PUBLIC_TOPLEVEL_KEYS], 'fogSessions', 'spatialLayout',
      'the public top-level key allowlist',
    );
    // And no registered operation can write it any more. Asserted against the OPERATION
    // REGISTRY, which is the authority on which verbs exist — NOT against a store built
    // from one slice, which would never have carried `applyFogEdit` and would therefore
    // have passed identically before the retirement. (It was written that way first; the
    // vacuity is the whole reason the anchor below is here.)
    expect(OPERATIONS.applyFogEdit).toBeUndefined();
    expect(OPERATIONS.setMapSubTab).toBeUndefined();
    expect(OPERATIONS.setSceneQualityMode).toBeUndefined();
    // ⚰ applyMapEdit JOINS THE ABSENCES (ODQ §763.2, Q-STYLE arm 2) — it was the SM-3
    // persist verb for `settlement.mapEdits` and its only caller died with the styleOverhaul
    // panel. ⚠ It was ALSO this arm's liveness anchor, so the anchor is re-pointed rather
    // than dropped: without one, an emptied registry would satisfy every absence above.
    expect(OPERATIONS.applyMapEdit).toBeUndefined();
    // The anchor that makes those four absences mean something: a sibling MECHANICAL
    // save-scoped verb from the same registry is still registered, so the lookup works.
    expect(OPERATIONS.renameSettlement?.opType).toBe('renameSettlement');
    expect(OPERATIONS.renameSettlement?.klass).toBe('mechanical');
    expect(OPERATIONS.renameSettlement?.targetScope).toBe('save');
  });

  test('a legacy blob missing a config key backfills the default instead of forking shapes', () => {
    const legacyConfig = { ...DEFAULT_CONFIG };
    delete legacyConfig.settType;
    const merged = mergePersistedState({ config: legacyConfig }, currentStub());
    expect(merged.config.settType).toBe(DEFAULT_CONFIG.settType);
  });

  test('normalizeServicesToggles (the rehydrate healer) is a byte-exact fixpoint', () => {
    const once = normalizeServicesToggles({ 'Blacksmith Services': true, svc_already: false });
    expectByteEqual(normalizeServicesToggles(once), once);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// helper used by the completeness probes above
// ═══════════════════════════════════════════════════════════════════════════

async function roundTripLocalSave() {
  localStorage.removeItem('dnd_settlement_saves');
  await saves.save({
    name: 'Probe', tier: 'town',
    settlement: memberSettlement(), config: { settType: 'town' },
    institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
    aiData: {}, versionHistory: [],
  });
  const [entry] = await saves.list();
  return entry;
}
