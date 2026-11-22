/**
 * engineRemoteRederive.test.js — the DM layer's re-derivation through the engine service
 * (ENGINE-4 unit 1, the flag-on gaps).
 *
 * With VITE_ENGINE_REMOTE on, the client carries no pipeline, so the re-derivation seat
 * (`src/store/settlementRederiveAction.js`) runs `rederive` around engine-generate's two
 * non-birth ops: `stepMeta` (the registry rows the pins bag is cut by) and `derive` (the
 * pipeline call with the bag, verbatim). The service double below computes what
 * engine-generate computes for those bodies and answers over JSON, so the proof is the one
 * ENGINE-2 made for generation: per seed, the remote envelope equals the local one, byte for
 * byte, after a JSON wire.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { getStepMeta } from '../../src/generators/pipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { declarationsFor, isEditableCard } from '../../src/domain/edit/fieldDeclarations.js';
import { regenerateWithLayer, regenerateWithLayerRemote } from '../../src/store/settlementRederiveAction.js';

const URL_ = 'https://stub.functions/engine-generate';
const SERVED = 'feedfacecafebeef';
const DECLARATIONS = { declarationsFor, isEditableCard };

/** What engine-generate answers for a `stepMeta` or `derive` body, over JSON. */
function serviceReply(bodyText) {
  const body = JSON.parse(bodyText);
  if (body.op === 'stepMeta') return JSON.parse(JSON.stringify({ stepMeta: getStepMeta(), engineVersion: SERVED }));
  if (body.op !== 'derive') throw new Error(`unexpected op ${String(body.op)}`);
  const settlement = generateSettlementPipeline(body.config, null,
    body.pins === undefined ? { seed: body.seed } : { seed: body.seed, pins: body.pins });
  return JSON.parse(JSON.stringify({ settlement, engineVersion: SERVED, generatedAt: '2026-11-04T00:00:00.000Z' }));
}

function okFetch() {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init, body: JSON.parse(init.body) });
    const reply = serviceReply(init.body);
    return { ok: true, status: 200, json: async () => reply };
  };
  return { impl, calls };
}

const remoteOpts = (impl) => ({ fetchImpl: impl, url: URL_, getAccessToken: async () => null });

/** A world and a DM layer that holds one NPC's status, so the bag is non-empty. */
function worldFor(settType, seed) {
  const config = birthConfig({ settType });
  const record = generateSettlementPipeline(config, null, { seed });
  const npc0 = (record.npcs || [])[0] || {};
  const layer = { roots: { [`npc:${npc0.id}:status`]: npc0.status }, worldFacts: {}, minted: {}, phantoms: {} };
  return { config, record, layer };
}

beforeAll(async () => { await loadGenerationLawPayloads(); });

describe('the re-derivation through the engine service equals the local one', () => {
  it('for three seeds (town, village, city), the envelope over the wire equals the local core\'s, and the bag rode the body', async () => {
    const failures = [];
    // seed-loop: collected — every seed runs: a failing seed is caught and listed, and the roster is asserted once below
    for (const [settType, seed] of [['town', 'engine4-rederive-0'], ['village', 'engine4-rederive-1'], ['city', 'engine4-rederive-2']]) {
      try {
        const { config, record, layer } = worldFor(settType, seed);
        const local = await regenerateWithLayer(record, config, layer, DECLARATIONS, { remote: false });
        const { impl, calls } = okFetch();
        const remote = await regenerateWithLayerRemote(record, config, layer, DECLARATIONS, remoteOpts(impl));
        expect(JSON.stringify(remote), `${settType} ${seed}`).toBe(JSON.stringify(local));
        expect(calls.map((c) => c.body.op)).toEqual(['stepMeta', 'derive']);
        const derive = calls[1].body;
        expect(derive.seed).toBe(record._seed);
        expect(Object.keys(derive.pins || {}).length, 'the pins bag is sent').toBeGreaterThan(0);
        expect(derive.config).toEqual(JSON.parse(JSON.stringify(config)));
      } catch (error) {
        failures.push(`${settType} ${seed}: ${String(error?.message ?? error).split('\n')[0]}`);
      }
    }
    expect(failures, `${failures.length} of the seeds failed; every seed ran`).toEqual([]);
  }, 240_000);

  it('the flag routes the seat: open, regenerateWithLayer reaches the service and never the local door', async () => {
    const { config, record, layer } = worldFor('village', 'engine4-rederive-flag');
    const { impl } = okFetch();
    const viaSeat = await regenerateWithLayerRemote(record, config, layer, DECLARATIONS, remoteOpts(impl));
    // The seat's default transport is the real fetch to an unconfigured URL in this test build,
    // so with the flag forced open it rejects typed instead of running the local pipeline.
    await expect(regenerateWithLayer(record, config, layer, DECLARATIONS, { remote: true }))
      .rejects.toMatchObject({ code: 'engine_unavailable' });
    expect(viaSeat.record).toBeTruthy();
  }, 120_000);
});

describe('a remote failure is shown, never replaced by a local run', () => {
  it('a 5xx on derive rejects engine_unavailable; a 429 rejects engine_rate_limited', async () => {
    const { config, record, layer } = worldFor('village', 'engine4-rederive-fail');
    for (const [status, code] of [[503, 'engine_unavailable'], [429, 'engine_rate_limited']]) {
      const impl = async (_url, init) => {
        const body = JSON.parse(init.body);
        if (body.op === 'stepMeta') return { ok: true, status: 200, json: async () => serviceReply(init.body) };
        return { ok: false, status, json: async () => ({ error: 'x' }) };
      };
      await expect(regenerateWithLayerRemote(record, config, layer, DECLARATIONS, remoteOpts(impl)))
        .rejects.toMatchObject({ code });
    }
  }, 120_000);

  it('a world without a string seed is refused before the derive call', async () => {
    const { config, record, layer } = worldFor('village', 'engine4-rederive-noseed');
    const { impl, calls } = okFetch();
    await expect(regenerateWithLayerRemote({ ...record, _seed: 42 }, config, layer, DECLARATIONS, remoteOpts(impl)))
      .rejects.toMatchObject({ code: 'engine_remote_unsupported' });
    expect(calls.map((c) => c.body.op)).toEqual(['stepMeta']);
  }, 120_000);
});
