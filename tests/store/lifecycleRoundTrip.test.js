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
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Force LOCAL mode everywhere: every service binds its real localStorage path.
vi.mock('../../src/lib/supabase.js', () => ({ supabase: null, isConfigured: false }));

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
import { mergePersistedState } from '../../src/store/persistMerge.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { normalizeServicesToggles } from '../../src/store/toggleSlice.js';
import { createDisplayPrefsSlice, DEFAULT_DISPLAY_PREFS } from '../../src/store/displayPrefsSlice.js';
import { deepClone } from '../../src/domain/clone.js';

// ═══════════════════════════════════════════════════════════════════════════
// THE REGISTRY — every persisted state family, with its lifecycle policies.
// Discovery is automatic (executed create paths + source scans); registration
// is manual; the completeness tests force them to move together (Pattern 2).
// Frozen 2026-07-21, hand-audited against src. SHRINK/EDIT ONLY WITH A POLICY.
// ═══════════════════════════════════════════════════════════════════════════

/** Substrate A — zustand persist partialize keys (src/store/index.js).
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
 *  the shipped default instead of forking shapes. */
const ZUSTAND_PERSIST_KEYS = Object.freeze([
  'config', 'configExplicitFields',
  'institutionToggles', 'categoryToggles', 'goodsToggles', 'servicesToggles',
  'displayPrefs',
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
  'factionPairStates',
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

/** The REAL partialize, derived from the registry the source scan above proves is
 *  identical to src/store/index.js — so this cannot drift from what ships. */
function partializeOf(state) {
  return Object.fromEntries(ZUSTAND_PERSIST_KEYS.map((k) => [k, state[k]]));
}

function makeStore() {
  return create(immer((...a) => ({
    ...stubSlice(...a),
    ...createSettlementSlice(...a),
    ...createCampaignSlice(...a),
    ...createCampaignRegionalSlice(...a),
    ...createCampaignWorldPulseSlice(...a),
  })));
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
    // The fully-populated ensure output carries EXACTLY base ∪ scalar ∪
    // conditional ∪ the forward-compat unknown — nothing invented, nothing lost.
    const ensured = ensureWorldState(richWorldStateRaw(), { id: CAMPAIGN_ID });
    expectExactSet(
      Object.keys(ensured),
      [...WORLD_STATE_BASE_KEYS, 'futureLedgerX', WORLD_STATE_SCALAR_GATE, ...WORLD_STATE_CONDITIONAL_KEYS],
      'ensured worldState (fully-populated fixture)',
      'a new persisted worldState key must be registered as base, conditional, or the scalar gate',
    );
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
    const src = readSrc('src/store/index.js');
    const block = src.match(/partialize:\s*\(state\)\s*=>\s*\(\{([\s\S]*?)\}\)/);
    if (!block) throw new Error('partialize block not found in src/store/index.js — the scan anchor moved; re-anchor this walker, do not delete it');
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
    const withEmpties = { tick: 1, pantheon: {}, spatialLedgers: {}, politicsLedgers: {} };
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
    someSliceMethod: () => {},
  });

  test('a current-shape persisted blob survives the rehydrate merge byte-exact', () => {
    const blob = {
      config: { ...DEFAULT_CONFIG, settType: 'city' },
      configExplicitFields: { priorityEconomy: true },
      institutionToggles: { temple: true }, categoryToggles: { economy: false },
      goodsToggles: { grain: true }, servicesToggles: { svc_smith: true },
      displayPrefs: { sceneQualityMode: 'low' },
    };
    const merged = mergePersistedState(JSON.parse(JSON.stringify(blob)), currentStub());
    const rePartialized = Object.fromEntries(ZUSTAND_PERSIST_KEYS.map((k) => [k, merged[k]]));
    expectByteEqual(rePartialized, blob);
  });

  // ── R-5b: the display-preference family, both directions ───────────────────
  // The whole point of owner queue #17 is that a clamped ceiling SURVIVES; the
  // whole point of it being safe is that its ABSENCE is indistinguishable from a
  // fresh install. Both are pinned through the REAL partialize + merge pair.

  test('a set quality ceiling survives the persist → rehydrate round trip', () => {
    const store = makeSettingsStore();
    store.getState().setSceneQualityMode('low');
    // The persist hop, exactly as the store performs it: partialize → JSON → merge.
    const blob = JSON.parse(JSON.stringify(partializeOf(store.getState())));
    expect(blob.displayPrefs).toEqual({ sceneQualityMode: 'low' });
    const merged = mergePersistedState(blob, currentStub());
    expect(merged.displayPrefs.sceneQualityMode).toBe('low');
  });

  test('a blob with NO displayPrefs (every save written before R-5b) rehydrates to the default', () => {
    const legacy = { config: { ...DEFAULT_CONFIG } };
    const merged = mergePersistedState(legacy, currentStub());
    expect(merged.displayPrefs).toEqual({ ...DEFAULT_DISPLAY_PREFS });
    expect(merged.displayPrefs.sceneQualityMode).toBe('auto');
    // And a bag present but missing a future key still backfills that key, which
    // is the cohort-fork cure this family inherited from `config`.
    const partial = mergePersistedState({ displayPrefs: {} }, currentStub());
    expect(partial.displayPrefs.sceneQualityMode).toBe('auto');
  });

  test('the setter refuses a non-string rather than persisting junk', () => {
    const store = makeSettingsStore();
    store.getState().setSceneQualityMode(null);
    expect(store.getState().displayPrefs.sceneQualityMode).toBe('auto');
    store.getState().setSceneQualityMode(7);
    expect(store.getState().displayPrefs.sceneQualityMode).toBe('auto');
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
