/**
 * engineRemoteRegenSection.test.js — section regeneration through the engine service
 * (ENGINE-5 unit 1, the chair's ruling: lifted and routed).
 *
 * With VITE_ENGINE_REMOTE on the client carries no pipeline, so `regenSection`'s two passes
 * (`regenNPCsPipeline`, `regenHistoryPipeline`) run on engine-generate's `regenSection` op. The
 * service double below computes exactly what engine-generate computes for that body (the pass,
 * from the parsed body, answered over JSON), so the proof is ENGINE-2's: the remote result
 * equals the local one, byte for byte, after a JSON wire — first for the pass alone (three seeds,
 * both sections, a replayed seed), then for the whole lifted action over a store (the minted
 * seed pinned so the two runs mint the same one).
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/kernel/prng.js', async (importOriginal) => {
  const real = /** @type {Record<string, unknown>} */ (await importOriginal());
  return { ...real, generateSeed: () => 'engine5-regen-minted' };
});

import {
  generateSettlementPipeline, regenHistoryPipeline, regenNPCsPipeline,
} from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { runRemoteRegenSection } from '../../src/lib/engineRemote.js';
import { regenSectionAction } from '../../src/store/settlementRegenAction.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const URL_ = 'https://stub.functions/engine-generate';
const SERVED = 'feedfacecafebeef';
const SEEDS = [['town', 'engine5-regen-0'], ['village', 'engine5-regen-1'], ['city', 'engine5-regen-2']];

/** What engine-generate answers for a `regenSection` body, over JSON. */
function serviceReply(bodyText) {
  const body = JSON.parse(bodyText);
  if (body.op !== 'regenSection') throw new Error(`unexpected op ${String(body.op)}`);
  const seeded = body.seed === undefined ? {} : { seed: body.seed };
  const parts = body.section === 'npcs'
    ? regenNPCsPipeline(body.settlement, body.config, { ...(body.locks === undefined ? {} : { locks: body.locks }), ...seeded })
    : regenHistoryPipeline(body.settlement, body.config, seeded);
  return JSON.parse(JSON.stringify({ parts, engineVersion: SERVED, generatedAt: '2026-11-04T00:00:00.000Z' }));
}

function okFetch() {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, body: JSON.parse(init.body) });
    const reply = serviceReply(init.body);
    return { ok: true, status: 200, json: async () => reply };
  };
  return { impl, calls };
}

const remoteOpts = (impl) => ({ fetchImpl: impl, url: URL_, getAccessToken: async () => null });

/** A world as a store holds it: born under the mint, its config on the record. */
function worldFor(settType, seed) {
  const config = birthConfig({ settType });
  return generateSettlementPipeline(config, null, { seed });
}

// Minimal companion slices — the pattern tests/store/regenPreservation.test.js uses.
const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  setCampaignRegionalGraph: () => {},
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function storeHolding(settlement) {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
  store.setState((s) => { s.settlement = structuredClone(settlement); s.phase = 'draft'; s.locks = {}; });
  return store;
}

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('the regenSection op answers the pass the client runs', () => {
  it('for three seeds (town, village, city), both sections over the wire equal the local passes, replayed seed and minted', async () => {
    const failures = [];
    // seed-loop: collected — every seed runs: a failing seed is caught and listed, and the roster is asserted once below
    for (const [settType, seed] of SEEDS) {
      try {
        const settlement = worldFor(settType, seed);
        const cfg = settlement.config;
        for (const replay of [`${seed}-replay`, undefined]) {
          const seeded = replay === undefined ? {} : { seed: replay };
          const localNpcs = regenNPCsPipeline(settlement, cfg, { locks: {}, ...seeded });
          const localHistory = regenHistoryPipeline(settlement, cfg, seeded);
          const { impl, calls } = okFetch();
          const remoteNpcs = await runRemoteRegenSection({ section: 'npcs', settlement, config: cfg, locks: {}, ...seeded }, remoteOpts(impl));
          const remoteHistory = await runRemoteRegenSection({ section: 'history', settlement, config: cfg, ...seeded }, remoteOpts(impl));
          expect(JSON.stringify(remoteNpcs), `${settType} npcs ${String(replay)}`).toBe(JSON.stringify(localNpcs));
          expect(JSON.stringify(remoteHistory), `${settType} history ${String(replay)}`).toBe(JSON.stringify(localHistory));
          expect(calls.map((c) => [c.body.op, c.body.section])).toEqual([['regenSection', 'npcs'], ['regenSection', 'history']]);
          expect(calls[0].body.settlement).toEqual(JSON.parse(JSON.stringify(settlement)));
          expect(Object.prototype.hasOwnProperty.call(calls[1].body, 'locks'), 'history sends no locks').toBe(false);
          expect(Object.prototype.hasOwnProperty.call(calls[1].body, 'seed')).toBe(replay !== undefined);
        }
      } catch (error) {
        failures.push(`${settType} ${seed}: ${String(error?.message ?? error).split('\n')[0]}`);
      }
    }
    expect(failures, `${failures.length} of the seeds failed; every seed ran`).toEqual([]);
  }, 240_000);

  it('an unknown section is refused before any fetch', async () => {
    const { impl, calls } = okFetch();
    await expect(runRemoteRegenSection({ section: 'economy', settlement: {}, config: {} }, remoteOpts(impl)))
      .rejects.toMatchObject({ code: 'engine_remote_unsupported' });
    expect(calls).toHaveLength(0);
  });
});

describe('the lifted action commits the same world through either transport', () => {
  it('for three seeds, regenSection(npcs) then (history) leaves the remote store byte-identical to the local one', async () => {
    const failures = [];
    // seed-loop: collected — every seed runs: a failing seed is caught and listed, and the roster is asserted once below
    for (const [settType, seed] of SEEDS) {
      try {
        const world = worldFor(settType, seed);
        const local = storeHolding(world);
        const remote = storeHolding(world);
        const { impl, calls } = okFetch();
        for (const section of ['npcs', 'history']) {
          await regenSectionAction(local.setState, local.getState, section, { remote: false });
          await regenSectionAction(remote.setState, remote.getState, section, { remote: true, remoteOptions: remoteOpts(impl) });
        }
        expect(JSON.stringify(remote.getState().settlement), `${settType} ${seed}`).toBe(JSON.stringify(local.getState().settlement));
        expect(remote.getState().settlement._regenSeed).toBe('engine5-regen-minted');
        expect(JSON.stringify(remote.getState().lastRegenerationDelta)).toBe(JSON.stringify(local.getState().lastRegenerationDelta));
        expect(calls.map((c) => c.body.section)).toEqual(['npcs', 'history']);
        expect(calls.every((c) => c.body.config && c.body.config.settType === world.config.settType),
          'the world\'s own config rides the body').toBe(true);
      } catch (error) {
        failures.push(`${settType} ${seed}: ${String(error?.message ?? error).split('\n')[0]}`);
      }
    }
    expect(failures, `${failures.length} of the seeds failed; every seed ran`).toEqual([]);
  }, 240_000);

  it('the slice keeps the action key and delegates to the lifted body', async () => {
    const world = worldFor('village', 'engine5-regen-key');
    const store = storeHolding(world);
    expect(typeof store.getState().regenSection).toBe('function');
    await store.getState().regenSection('history');
    expect(store.getState().settlement._regenSeed).toBe('engine5-regen-minted');
    expect(store.getState().settlement.history).toEqual(
      JSON.parse(JSON.stringify(regenHistoryPipeline(world, world.config).history)));
  }, 120_000);

  it('a remote failure rejects typed and leaves the world untouched (no local run)', async () => {
    const world = worldFor('village', 'engine5-regen-fail');
    for (const [status, code] of [[503, 'engine_unavailable'], [429, 'engine_rate_limited'], [413, 'engine_refused']]) {
      const store = storeHolding(world);
      const impl = async () => ({ ok: false, status, json: async () => ({ error: 'x' }) });
      await expect(regenSectionAction(store.setState, store.getState, 'npcs', { remote: true, remoteOptions: remoteOpts(impl) }))
        .rejects.toMatchObject({ code });
      expect(JSON.stringify(store.getState().settlement)).toBe(JSON.stringify(world));
    }
    // The flag forced open with no configured service: typed, never the local engine.
    const unconfigured = storeHolding(world);
    await expect(regenSectionAction(unconfigured.setState, unconfigured.getState, 'history', { remote: true }))
      .rejects.toMatchObject({ code: 'engine_unavailable' });
    expect(JSON.stringify(unconfigured.getState().settlement)).toBe(JSON.stringify(world));
  }, 120_000);
});
