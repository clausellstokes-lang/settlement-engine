/** @vitest-environment jsdom */
/**
 * persistMerge.test.js — store-6 pin, and the anonymous draft's 24-hour life.
 *
 * zustand's default persist merge is a SHALLOW top-level spread, so a returning
 * user's persisted `config` REPLACES DEFAULT_CONFIG wholesale — any key added to
 * DEFAULT_CONFIG after they last saved reads `undefined` for them while a fresh user
 * gets the default (a silent config-shape fork between cohorts that reaches the
 * generator as input). The custom merge deep-merges config (and the toggle maps) over
 * their defaults so missing keys backfill. Pinned here so a future refactor can't
 * regress the class.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mergePersistedState } from '../../src/store/persistMerge.js';
import { PERSIST_KEY, partializeStoreState } from '../../src/store/persistProjection.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { readPendingDossierByToken, stashPendingDossier } from '../../src/lib/pendingDossier.js';

// THE ENGINE, stubbed at the transport seam, so the pre-generate arm can read what the
// lane handed it (the previous settlement) without running a pipeline.
const engine = vi.hoisted(() => ({ lastRequest: null }));
vi.mock('../../src/lib/generationClient.js', () => ({
  runGeneration: async (request) => {
    engine.lastRequest = request;
    return {
      result: {
        settlement: { id: 'fresh', name: 'Fresh', tier: 'town' },
        preservation: null,
        resolvedConfig: request?.payload?.fullConfig ?? null,
        pipelineHistory: [],
      },
    };
  },
}));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(), Funnel: {}, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

describe('store-6 — mergePersistedState deep-merges config over defaults', () => {
  it('backfills EVERY DEFAULT_CONFIG key a returning user\'s persisted config predates', () => {
    // A returning user's blob: only a couple of keys (persisted before newer defaults).
    const persisted = { config: { population: 9999, magicExists: false } };
    const current = {
      config: { ...DEFAULT_CONFIG },
      institutionToggles: {},
      someSliceMethod: () => 'alive',
    };
    const merged = mergePersistedState(persisted, current);

    // The user's own values survive (persisted wins on collision).
    expect(merged.config.population).toBe(9999);
    expect(merged.config.magicExists).toBe(false);
    // The shallow-merge bug dropped these; the deep merge restores every default key.
    for (const key of Object.keys(DEFAULT_CONFIG)) {
      expect(merged.config).toHaveProperty(key);
    }
    // Concrete newer keys a pre-version blob wouldn't carry.
    expect(merged.config.settlementAgeMode).toBe(DEFAULT_CONFIG.settlementAgeMode);
    expect(merged.config.powerDynamicsConfig).toBe(DEFAULT_CONFIG.powerDynamicsConfig);
    // Old blobs prove intent only where their value differs from the old
    // materialized default. The untouched 50-valued fields remain eligible for
    // an active content environment.
    expect(merged.configExplicitFields).toEqual({ magicExists: true });
    // The top-level spread still restores every other slice's state/methods.
    expect(merged.someSliceMethod()).toBe('alive');
  });

  it('normalizes a persisted field-intent record through the closed registry', () => {
    const persisted = {
      config: { priorityEconomy: 50 },
      configExplicitFields: {
        priorityEconomy: true,
        priorityMagic: false,
        internalAutoTuningGain: true,
      },
    };
    const current = {
      config: { ...DEFAULT_CONFIG },
      configExplicitFields: {},
    };
    const merged = mergePersistedState(persisted, current);
    expect(merged.configExplicitFields).toEqual({ priorityEconomy: true });
  });

  it('merges the four toggle maps over their (empty) defaults', () => {
    const persisted = { goodsToggles: { town_good_ale: { allow: true } } };
    const current = { config: { ...DEFAULT_CONFIG }, goodsToggles: {}, institutionToggles: {}, categoryToggles: {}, servicesToggles: {} };
    const merged = mergePersistedState(persisted, current);
    expect(merged.goodsToggles.town_good_ale).toEqual({ allow: true });
    // Absent-in-persisted maps fall back to the current (empty) default, never undefined.
    expect(merged.institutionToggles).toEqual({});
    expect(merged.servicesToggles).toEqual({});
  });

  it('a null/absent persisted blob yields the fresh config defaults (no throw)', () => {
    const current = { config: { ...DEFAULT_CONFIG }, institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {} };
    const merged = mergePersistedState(null, current);
    expect(merged.config).toEqual(DEFAULT_CONFIG);
    expect(merged.configExplicitFields).toEqual({});
  });
});

// ── THE ANONYMOUS DRAFT LIVES 24 HOURS (the owner, 2026-10-30: "I want a daily reset.
// The settlement only persist if they save them."). Chair ruling (2): ROLLING 24 hours
// from the generation stamp, never local midnight; saved settlements, signed-in drafts
// and the paid purchase stash are untouched.
describe('the anonymous draft expires 24 hours after it was forged', () => {
  const HOUR = 60 * 60 * 1000;
  const NOW = Date.parse('2026-10-30T12:00:00.000Z');
  const ago = (hours) => new Date(NOW - hours * HOUR).toISOString();
  const world = Object.freeze({ id: 'w-anon', name: 'Ashford', tier: 'town' });
  const fresh = () => ({ config: { ...DEFAULT_CONFIG }, settlement: null, lastSeed: null, generatedAt: null });
  const blobWith = (generatedAt) => ({
    config: { ...DEFAULT_CONFIG },
    anonDraft: { settlement: world, lastSeed: 'seed-a', ...(generatedAt === undefined ? {} : { generatedAt }) },
  });

  it('a draft stamped 25 hours ago is absent after rehydrate', () => {
    const merged = mergePersistedState(blobWith(ago(25)), fresh(), NOW);
    expect(merged.settlement, 'a stale anonymous draft survived the reload').toBeNull();
    expect(merged.lastSeed).toBeNull();
    expect(merged.draftOrigin).toBe('account');
  });

  it('a draft stamped 23 hours ago is present, and keeps its stamp', () => {
    const merged = mergePersistedState(blobWith(ago(23)), fresh(), NOW);
    expect(merged.settlement).toBe(world);
    expect(merged.lastSeed).toBe('seed-a');
    expect(merged.draftOrigin).toBe('anon');
    expect(merged.generatedAt, 'the stamp did not survive, so the next write would restart the clock').toBe(ago(23));
  });

  it('the clock is ROLLING, not local midnight: forged at 23:50, still here at 00:10', () => {
    const forged = new Date(2026, 9, 29, 23, 50).getTime();
    const afterMidnight = new Date(2026, 9, 30, 0, 10).getTime();
    const blob = blobWith(new Date(forged).toISOString());
    expect(mergePersistedState(blob, fresh(), afterMidnight).settlement).toBe(world);
    // …and gone once a full day has passed.
    expect(mergePersistedState(blob, fresh(), forged + 24 * HOUR + 60_000).settlement).toBeNull();
  });

  it('an envelope written before the stamp existed is adopted and stamped NOW, so it too expires', () => {
    const merged = mergePersistedState(blobWith(undefined), fresh(), NOW);
    expect(merged.settlement).toBe(world);
    expect(merged.generatedAt).toBe(new Date(NOW).toISOString());
  });

  it('a stamp from far in the future (a hand edit) cannot keep a draft forever', () => {
    expect(mergePersistedState(blobWith(new Date(NOW + 72 * HOUR).toISOString()), fresh(), NOW).settlement).toBeNull();
  });

  it('a signed-in world of any age is untouched: no envelope, nothing to expire', () => {
    const current = { ...fresh(), settlement: { id: 'w-account' }, generatedAt: ago(72) };
    const merged = mergePersistedState({ config: { ...DEFAULT_CONFIG }, anonDraft: null }, current, NOW);
    expect(merged.settlement).toEqual({ id: 'w-account' });
    expect(merged.generatedAt).toBe(ago(72));
  });

  describe('the device slot and the purchase stash', () => {
    beforeEach(() => { window.localStorage.clear(); vi.useFakeTimers(); vi.setSystemTime(NOW); });
    afterEach(() => { vi.useRealTimers(); window.localStorage.clear(); });

    const seat = (generatedAt) => window.localStorage.setItem(PERSIST_KEY, JSON.stringify({
      state: blobWith(generatedAt), version: 2,
    }));
    const otherTab = { config: { ...DEFAULT_CONFIG }, settlement: null, lastSeed: null, draftOrigin: null, auth: { user: null } };

    it('a case-(a) write carries the generation stamp into the envelope', () => {
      const state = { ...otherTab, settlement: world, lastSeed: 'seed-a', draftOrigin: 'anon', generatedAt: ago(1) };
      expect(partializeStoreState(state).anonDraft).toEqual({ settlement: world, lastSeed: 'seed-a', generatedAt: ago(1) });
    });

    it('any write retires an expired slot, and re-emits a live one', () => {
      seat(ago(25));
      expect(partializeStoreState(otherTab).anonDraft, 'an expired draft lingers in storage').toBeNull();
      seat(ago(23));
      expect(partializeStoreState(otherTab).anonDraft).toEqual({ settlement: world, lastSeed: 'seed-a', generatedAt: ago(23) });
    });

    it('a PAID purchase stash is present after the expiry, both at rehydrate and at the next write', () => {
      const token = 'tok-paid-0123456789abcdefghij';
      expect(stashPendingDossier({ id: 'bought' }, token, 'cs_test_paid')).toBe(true);
      vi.setSystemTime(NOW + 30 * HOUR);
      seat(ago(25));
      mergePersistedState(blobWith(ago(25)), fresh(), NOW + 30 * HOUR);
      partializeStoreState(otherTab);
      expect(readPendingDossierByToken(token)?.settlement, 'the paid stash was taken with the draft').toEqual({ id: 'bought' });
    });
  });

  describe('a long-open tab agrees before it forges', () => {
    const laneStore = ({ generatedAt, user = null, draftOrigin = 'anon' }) => {
      const state = {
        config: { ...DEFAULT_CONFIG },
        institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
        importedNeighbour: null, locks: null, activeSaveId: null, randomSliderMode: false,
        auth: { tier: user ? 'free' : 'anon', user }, lastRefusal: null,
        settlement: world, lastSeed: 'seed-a', draftOrigin, generatedAt,
        canCustomizePreGeneration: () => user != null,
        isTierAllowed: () => true,
        clearSettlement: () => { state.settlement = null; state.lastSeed = null; state.draftOrigin = null; },
      };
      return { state, set: (fn) => { fn(state); }, get: () => state };
    };
    const forge = async (store) => {
      window.localStorage.clear();
      engine.lastRequest = null;
      const { generateSettlementAction } = await import('../../src/store/settlementGenerateAction.js');
      await generateSettlementAction(store.set, store.get, 'seed-next', undefined);
      return engine.lastRequest?.payload ?? null;
    };

    it('an anonymous draft past 24 hours is dropped before the forge, so the forge is a first one', async () => {
      const payload = await forge(laneStore({ generatedAt: new Date(Date.now() - 25 * HOUR).toISOString() }));
      expect(payload, 'the engine was never reached').toBeTruthy();
      expect(payload.previousSettlement, 'the stale draft rode into the new forge').toBeNull();
    });

    it('an anonymous draft inside 24 hours is still the one being rerolled', async () => {
      const payload = await forge(laneStore({ generatedAt: new Date(Date.now() - 23 * HOUR).toISOString() }));
      expect(payload.previousSettlement).toBe(world);
    });

    it('a signed-in draft of any age is untouched', async () => {
      const payload = await forge(laneStore({
        generatedAt: new Date(Date.now() - 72 * HOUR).toISOString(), user: { id: 'u-1' }, draftOrigin: 'account',
      }));
      expect(payload.previousSettlement).toBe(world);
    });
  });
});
