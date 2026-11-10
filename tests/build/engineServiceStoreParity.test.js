/**
 * engineServiceStoreParity.test.js — THE SERVICE'S RECORD IS THE STORE'S RECORD, for all three
 * ops, on REAL store-built requests (remote-path R2, 2026-11-10).
 *
 * The transport suites build their payloads by hand, which is how the vanilla content stamp
 * went unseen (D1/D2 of the chair's flagged-path walk): the real store stamps every standalone
 * generation with `VANILLA_CONTENT_ENVIRONMENT`, and the service's birth carried no stamp. This
 * suite takes the request the REAL store's generate action builds (captured at the
 * generation client) and compares, byte for byte after a JSON wire:
 *   - generate:     the local core's run of that request  vs  the committed BUNDLE's run of
 *                   engine-generate's birth for the `{ seed, config }` the transport sends;
 *   - derive:       the local re-derivation of the store-born world  vs  the remote one, with
 *                   the bundle's `generateSettlementPipeline` / `getStepMeta` answering;
 *   - regenSection: the local passes over the store-born world  vs  the bundle's passes over
 *                   the wire body, for both sections, one replayed seed.
 * The function's own handler is pinned to the same birth in Deno
 * (`supabase/functions/engine-generate/index.test.ts`, the REPLAY arms).
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/** Every request the store's generate action hands the generation client. */
const captured = [];
vi.mock('../../src/lib/generationClient.js', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    runGeneration: async (request, opts) => {
      captured.push(structuredClone(request));
      return real.runGeneration(request, { ...opts, flagOn: false, remote: false });
    },
  };
});

const { useStore } = await import('../../src/store/index.js');
const { runGenerationRequest } = await import('../../src/workers/generationRequest.js');
const { loadGenerationLawPayloads } = await import('../../src/domain/density/densityCreateBoundary.js');
const { regenNPCsPipeline, regenHistoryPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
const { declarationsFor, isEditableCard } = await import('../../src/domain/edit/fieldDeclarations.js');
const { regenerateWithLayer, regenerateWithLayerRemote } = await import('../../src/store/settlementRederiveAction.js');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const BUNDLE = resolve(ROOT, 'supabase', 'functions', '_shared', 'engineBundle.js');
const DECLARATIONS = { declarationsFor, isEditableCard };
const wire = (v) => JSON.parse(JSON.stringify(v));

let bundle;
beforeAll(async () => {
  bundle = await import(/* @vite-ignore */ pathToFileURL(BUNDLE).href);
  await bundle.loadGenerationLawPayloads();
  await loadGenerationLawPayloads();
});

/** engine-generate's birth for a `{ seed, config }` body (index.ts, the generate op). */
function serviceBirth({ seed, config }) {
  const contentRuntime = config.useCustomContent === false
    ? { customContent: {} }
    : {
        customContent: {},
        contentProvenance: { scope: 'standalone', environment: bundle.VANILLA_CONTENT_ENVIRONMENT, bindingHash: null },
      };
  return bundle.runGenerationRequest({
    op: 'settlement',
    requestId: null,
    payload: { fullConfig: bundle.birthConfig(config), neighbour: null, seed, contentRuntime },
  });
}

/** Forge through the REAL store; answer the request it built and the record it committed. */
async function storeForge(seed) {
  const before = captured.length;
  await useStore.getState().generateSettlement(seed);
  expect(captured.length, 'the store reached the generation client').toBe(before + 1);
  const request = captured.at(-1);
  const record = useStore.getState().settlement;
  expect(record, 'the store committed a world').toBeTruthy();
  return { request, record: wire(record) };
}

const SEEDS = ['store-parity-a', 'store-parity-b'];

describe('the engine service answers the store\'s own requests with the store\'s own records', () => {
  it('generate: the bundle\'s birth for the wire body equals the local core on the store\'s request, stamp included', async () => {
    const failures = [];
    // seed-loop: collected — every seed runs: a failing seed is caught and listed, and the roster is asserted once below
    for (const seed of SEEDS) {
      try {
        const { request } = await storeForge(seed);
        expect(request.payload.contentRuntime.contentProvenance?.environment?.environmentId).toBe('system:vanilla');
        const local = runGenerationRequest(structuredClone(request));
        const body = wire({ seed: request.payload.seed, config: request.payload.fullConfig });
        const served = serviceBirth(body);
        expect(JSON.stringify(wire(served.settlement)), seed).toBe(JSON.stringify(wire(local.settlement)));
        expect(JSON.stringify(wire(served.pipelineHistory)), seed).toBe(JSON.stringify(wire(local.pipelineHistory)));
      } catch (error) {
        failures.push(`${seed}: ${String(error?.message ?? error).split('\n')[0]}`);
      }
    }
    expect(failures, `${failures.length} of the seeds failed; every seed ran`).toEqual([]);
  }, 240_000);

  it('generate: an account that may customize, with custom content turned off — neither side stamps', async () => {
    // A free account's forge takes its stored config, so `useCustomContent: false` rides the
    // wire and the function reads it by the store's rule. (An ANONYMOUS forge takes
    // DEFAULT_CONFIG while the store's content runtime reads the STORED flag; that split is
    // the store's, recorded in the remote-path hand-back, and not pinned here.)
    const auth = useStore.getState().auth;
    useStore.setState({ auth: { ...auth, user: { id: 'parity-free' }, tier: 'free' } });
    useStore.getState().updateConfig({ useCustomContent: false });
    try {
      const { request } = await storeForge('store-parity-off');
      expect(request.payload.contentRuntime.contentProvenance).toBe(null);
      const local = runGenerationRequest(structuredClone(request));
      const served = serviceBirth(wire({ seed: request.payload.seed, config: request.payload.fullConfig }));
      expect(local.settlement.customContentProvenance).toBeUndefined();
      expect(JSON.stringify(wire(served.settlement))).toBe(JSON.stringify(wire(local.settlement)));
    } finally {
      useStore.getState().updateConfig({ useCustomContent: true });
      useStore.setState({ auth });
    }
  }, 240_000);

  it('derive: the remote re-derivation of a store-born world equals the local one', async () => {
    const { record } = await storeForge('store-parity-derive');
    const config = record.config;
    const npc0 = (record.npcs || [])[0] || {};
    const layer = { roots: { [`npc:${npc0.id}:status`]: npc0.status }, worldFacts: {}, minted: {}, phantoms: {} };
    const local = await regenerateWithLayer(record, config, layer, DECLARATIONS, { remote: false });
    const ops = [];
    const fetchImpl = async (_url, init) => {
      const body = JSON.parse(init.body);
      ops.push(body.op);
      const reply = body.op === 'stepMeta'
        ? { stepMeta: bundle.getStepMeta(), engineVersion: 'x' }
        : {
            settlement: bundle.generateSettlementPipeline(body.config, null,
              body.pins === undefined ? { seed: body.seed } : { seed: body.seed, pins: body.pins }),
            engineVersion: 'x',
          };
      const out = wire(reply);
      return { ok: true, status: 200, json: async () => out };
    };
    const remote = await regenerateWithLayerRemote(record, config, layer, DECLARATIONS,
      { fetchImpl, url: 'https://stub/engine-generate', getAccessToken: async () => null });
    expect(ops).toEqual(['stepMeta', 'derive']);
    expect(JSON.stringify(wire(remote))).toBe(JSON.stringify(wire(local)));
  }, 240_000);

  it('regenSection: the bundle\'s passes over the wire body equal the local passes over the store-born world', async () => {
    const { record } = await storeForge('store-parity-regen');
    const cfg = record.config;
    const seed = 'store-parity-regen-seed';
    const localNpcs = regenNPCsPipeline(structuredClone(record), structuredClone(cfg), { locks: {}, seed });
    const servedNpcs = bundle.regenNPCsPipeline(wire(record), wire(cfg), { locks: {}, seed });
    expect(JSON.stringify(wire(servedNpcs))).toBe(JSON.stringify(wire(localNpcs)));
    const localHistory = regenHistoryPipeline(structuredClone(record), structuredClone(cfg), { seed });
    const servedHistory = bundle.regenHistoryPipeline(wire(record), wire(cfg), { seed });
    expect(JSON.stringify(wire(servedHistory))).toBe(JSON.stringify(wire(localHistory)));
  }, 240_000);
});
