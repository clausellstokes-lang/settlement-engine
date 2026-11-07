/**
 * engineRemoteTransport.test.js — the `remote` generation transport (ENGINE-2 unit 1;
 * docs/DESIGN_ENGINE_SERVICE.md "The client switch").
 *
 * Pins, red-first:
 *   1. the flag is CLOSED unless the build carries exactly VITE_ENGINE_REMOTE='true'
 *      (launchGate.js :: purchasesOpen's rule), and closed is the default;
 *   2. the remote packet EQUALS the worker's for the same seed — a stubbed fetch answers
 *      with what the service computes (the bundle's birth is the in-process birth:
 *      tests/build/engineBundleReplay.test.js), carried over a JSON wire;
 *   3. the 409 `engine_version_retired` reply is a typed rejection carrying both versions;
 *   4. a network failure is a typed rejection; NEITHER generates locally;
 *   5. a request the service cannot reproduce (a neighbour, homebrew) is refused before
 *      any fetch.
 * The service's half (the bundle's core equals the in-process core) is
 * tests/build/engineServiceCore.test.js.
 */
import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest';
import { runGenerationRequest } from '../../src/workers/generationRequest.js';
import { runGeneration } from '../../src/lib/generationClient.js';
import {
  ENGINE_VERSION_RETIRED_CODE,
  engineFunctionUrl,
  engineRemoteOpen,
  runRemoteGeneration,
} from '../../src/lib/engineRemote.js';
import {
  GENERATION_PROTOCOL_VERSION,
  GENERATION_REQUEST_KIND,
} from '../../src/lib/generationProtocol.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { settlementContentRuntimeOptions } from '../../src/store/settlementContentRuntime.js';
import { eligibleCustomContent } from '../../src/domain/customContentSchema.js';
import { contentRuntimeFromCampaignBinding } from '../../src/domain/content/contentEnvironment.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { engineVersion as LOCAL_ENGINE_VERSION } from '../../supabase/functions/_shared/engineBundle.meta.json';

const URL_ = 'https://stub.supabase.co/functions/v1/engine-generate';
// The service built from THESE sources serves the committed bundle's version.
const SERVED = LOCAL_ENGINE_VERSION;

/** The request the generate action builds for a signed-in, no-homebrew, standalone forge. */
function actionRequest(seed, settType) {
  const state = { config: { ...DEFAULT_CONFIG, settType }, customContent: {}, configExplicitFields: {} };
  const fullConfig = birthConfig({
    ...DEFAULT_CONFIG,
    settType,
    _institutionToggles: {},
    _categoryToggles: {},
    _goodsToggles: {},
    _servicesToggles: {},
  });
  return {
    kind: GENERATION_REQUEST_KIND,
    v: GENERATION_PROTOCOL_VERSION,
    op: 'settlement',
    requestId: `gen-${seed}`,
    payload: {
      fullConfig,
      neighbour: null,
      seed,
      contentRuntime: settlementContentRuntimeOptions(state, contentRuntimeFromCampaignBinding, eligibleCustomContent),
      previousSettlement: null,
      locks: null,
    },
  };
}

/**
 * What engine-generate computes for a body: a birth through the ONE core with the
 * service's inputs (no neighbour, no custom content), answered over JSON.
 */
function serviceReply(bodyText) {
  const { seed, config } = JSON.parse(bodyText);
  const served = runGenerationRequest({
    op: 'settlement',
    requestId: null,
    payload: { fullConfig: birthConfig(config), neighbour: null, seed, contentRuntime: { customContent: {} } },
  });
  return JSON.parse(JSON.stringify({
    settlement: served.settlement,
    pipelineHistory: served.pipelineHistory,
    engineVersion: SERVED,
    generatedAt: '2026-11-03T00:00:00.000Z',
  }));
}

/** A fetch double: records every call, answers through `answer`. */
function fetchDouble(answer) {
  const calls = [];
  const impl = async (url, init) => {
    calls.push({ url, init });
    return answer(url, init);
  };
  return { impl, calls };
}

const okFetch = () => fetchDouble(async (_url, init) => {
  const body = serviceReply(init.body);
  return { ok: true, status: 200, json: async () => body };
});

/** runGeneration through the remote transport with every seam pinned. */
function remoteRun(request, fetchImpl, { fallback, getAccessToken = async () => null, workerFactory } = {}) {
  return runGeneration(request, {
    flagOn: true,
    remote: true,
    fallback: fallback || (() => { throw new Error('the local engine must not run'); }),
    workerFactory: workerFactory || (() => { throw new Error('no worker on the remote path'); }),
    remoteTransport: (req, opts) => runRemoteGeneration(req, { ...opts, fetchImpl, url: URL_, getAccessToken }),
  });
}

beforeAll(async () => {
  await loadGenerationLawPayloads();
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('the VITE_ENGINE_REMOTE flag is closed unless explicitly opened', () => {
  it('opens only on the exact string "true"', () => {
    for (const env of [undefined, null, {}, { VITE_ENGINE_REMOTE: '' }, { VITE_ENGINE_REMOTE: 'TRUE' },
      { VITE_ENGINE_REMOTE: 'yes' }, { VITE_ENGINE_REMOTE: '1' }, { VITE_ENGINE_REMOTE: true },
      { VITE_ENGINE_REMOTE: ' true' }]) {
      expect(engineRemoteOpen(env), JSON.stringify(env)).toBe(false);
    }
    expect(engineRemoteOpen({ VITE_ENGINE_REMOTE: 'true' })).toBe(true);
  });

  it('is closed in this build by default, and a closed flag never reaches the remote transport', async () => {
    expect(engineRemoteOpen()).toBe(false);
    const remoteTransport = vi.fn();
    const { outcome } = await runGeneration(actionRequest('s', 'town'), {
      flagOn: false,
      fallback: async () => ({ settlement: { name: 'Local' } }),
      remoteTransport,
    });
    expect(outcome).toBe('in-thread:flag-off');
    expect(remoteTransport).not.toHaveBeenCalled();
  });

  it('reads the build env when no seam is passed: "true" goes remote, "TRUE" stays local', async () => {
    const remoteTransport = vi.fn(async () => ({ settlement: { name: 'Remote' } }));
    const fallback = vi.fn(async () => ({ settlement: { name: 'Local' } }));
    vi.stubEnv('VITE_ENGINE_REMOTE', 'TRUE');
    expect((await runGeneration(actionRequest('s', 'town'), { flagOn: false, fallback, remoteTransport })).outcome)
      .toBe('in-thread:flag-off');
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    expect((await runGeneration(actionRequest('s', 'town'), { flagOn: false, fallback, remoteTransport })).outcome)
      .toBe('remote');
    expect(remoteTransport).toHaveBeenCalledTimes(1);
    expect(fallback).toHaveBeenCalledTimes(1);
  });

  it('runGeneration\'s own reading of the build flag agrees with engineRemoteOpen on every value', async () => {
    const remoteTransport = vi.fn(async () => ({ settlement: { name: 'Remote' } }));
    const fallback = async () => ({ settlement: { name: 'Local' } });
    for (const value of ['', 'TRUE', 'yes', '1', ' true', 'false', 'true']) {
      vi.stubEnv('VITE_ENGINE_REMOTE', value);
      const { outcome } = await runGeneration(actionRequest('s', 'town'), { flagOn: false, fallback, remoteTransport });
      expect(outcome === 'remote', JSON.stringify(value)).toBe(engineRemoteOpen({ VITE_ENGINE_REMOTE: value }));
    }
  });

  it('with the flag open and no seams, the lazily loaded service leaf runs: an unconfigured build rejects typed, never locally', async () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    vi.stubEnv('VITE_ENGINE_GENERATE_URL', '');
    vi.stubEnv('VITE_SUPABASE_URL', '');
    const fallback = vi.fn();
    const err = await runGeneration(actionRequest('s', 'town'), { flagOn: true, fallback }).catch(e => e);
    expect(err.code).toBe('engine_unavailable');
    expect(fallback).not.toHaveBeenCalled();
  });

  it('the function URL takes its override, else the project functions base, else none', () => {
    expect(engineFunctionUrl('engine-generate', { VITE_ENGINE_GENERATE_URL: 'https://e/g' })).toBe('https://e/g');
    expect(engineFunctionUrl('engine-advance', { VITE_ENGINE_ADVANCE_URL: 'https://e/a' })).toBe('https://e/a');
    expect(engineFunctionUrl('engine-generate', { VITE_SUPABASE_URL: 'https://p.supabase.co/' }))
      .toBe('https://p.supabase.co/functions/v1/engine-generate');
    expect(engineFunctionUrl('engine-generate', {})).toBe(null);
  });
});

describe('the remote packet is the worker packet', () => {
  const CASES = [['remote-a', 'town'], ['remote-b', 'village'], ['remote-c', 'city']];

  it('for three seeds (town, village, city), every key of the packet equals the local core\'s, over the wire', async () => {
    const failures = [];
    // seed-loop: collected — every seed runs: a failing seed is caught and listed, and the roster is asserted once below
    for (const [seed, settType] of CASES) {
      try {
        const request = actionRequest(seed, settType);
        const { result: local } = await runGeneration(request, {
          flagOn: false, remote: false, fallback: (r) => structuredClone(runGenerationRequest(structuredClone(r))),
        });
        const { impl, calls } = okFetch();
        const { result, outcome } = await remoteRun(request, impl);
        expect(outcome).toBe('remote');
        expect(calls).toHaveLength(1);
        expect(Object.keys(result).sort()).toEqual(Object.keys(local).sort());
        expect(JSON.stringify(result.settlement)).toBe(JSON.stringify(local.settlement));
        expect(result.pipelineHistory).toEqual(local.pipelineHistory);
        expect(result.pipelineHistory.length).toBeGreaterThan(0);
        expect(result.preservation).toBe(local.preservation);
        expect(result.resolvedConfig).toEqual(local.resolvedConfig);
        // Same sources, same version: both records carry the committed bundle's hash.
        expect(result.settlement.engineVersion).toBe(LOCAL_ENGINE_VERSION);
        expect(local.settlement.engineVersion).toBe(LOCAL_ENGINE_VERSION);
      } catch (error) {
        failures.push(`${settType} ${seed}: ${String(error?.message ?? error).split('\n')[0]}`);
      }
    }
    expect(failures, `${failures.length} of the seeds failed; every seed ran`).toEqual([]);
  });

  it('posts { seed, config } with the caller\'s session token, and nothing pinned by default', async () => {
    const request = actionRequest('remote-a', 'town');
    const { impl, calls } = okFetch();
    await remoteRun(request, impl, { getAccessToken: async () => 'jwt-1' });
    const [{ url, init }] = calls;
    expect(url).toBe(URL_);
    expect(init.method).toBe('POST');
    expect(init.headers.Authorization).toBe('Bearer jwt-1');
    const body = JSON.parse(init.body);
    expect(Object.keys(body).sort()).toEqual(['config', 'seed']);
    expect(body.seed).toBe('remote-a');
    expect(body.config).toEqual(JSON.parse(JSON.stringify(request.payload.fullConfig)));
  });

  it('an anonymous caller is sent with no Authorization header', async () => {
    const { impl, calls } = okFetch();
    await remoteRun(actionRequest('remote-a', 'town'), impl);
    expect(Object.keys(calls[0].init.headers)).toEqual(['Content-Type']);
  });
});

describe('a remote failure is shown, never replaced by a local town', () => {
  it('409 engine_version_retired rejects typed, carrying the requested and served versions', async () => {
    const fallback = vi.fn();
    const { impl } = fetchDouble(async () => ({
      ok: false,
      status: 409,
      json: async () => ({ error: 'engine_version_retired', requested: 'old0000000000000', engineVersion: SERVED }),
    }));
    const err = await runGeneration(actionRequest('s', 'town'), {
      remote: true,
      fallback,
      remoteTransport: (req, o) => runRemoteGeneration(req, { ...o, fetchImpl: impl, url: URL_, getAccessToken: async () => null, engineVersion: 'old0000000000000' }),
    }).catch(e => e);
    expect(err.code).toBe(ENGINE_VERSION_RETIRED_CODE);
    expect(err.requested).toBe('old0000000000000');
    expect(err.servedVersion).toBe(SERVED);
    expect(fallback).not.toHaveBeenCalled();
  });

  it('the pin rides the body when one is given', async () => {
    const { impl, calls } = okFetch();
    await runRemoteGeneration(actionRequest('remote-a', 'town'), {
      fetchImpl: impl, url: URL_, getAccessToken: async () => null, engineVersion: SERVED,
    });
    expect(JSON.parse(calls[0].init.body).engineVersion).toBe(SERVED);
  });

  it('a network failure rejects engine_unavailable and does not generate locally', async () => {
    const fallback = vi.fn();
    const { impl } = fetchDouble(async () => { throw new TypeError('Failed to fetch'); });
    const err = await remoteRun(actionRequest('s', 'town'), impl, { fallback }).catch(e => e);
    expect(err.code).toBe('engine_unavailable');
    expect(fallback).not.toHaveBeenCalled();
  });

  it('a 5xx, a 429 and an unconfigured build each reject typed', async () => {
    const status = (s) => fetchDouble(async () => ({ ok: false, status: s, json: async () => ({ error: 'x' }) })).impl;
    expect((await remoteRun(actionRequest('s', 'town'), status(503)).catch(e => e)).code).toBe('engine_unavailable');
    expect((await remoteRun(actionRequest('s', 'town'), status(429)).catch(e => e)).code).toBe('engine_rate_limited');
    const refused = await remoteRun(actionRequest('s', 'town'), status(403)).catch(e => e);
    expect(refused.code).toBe('engine_refused');
    expect(refused.status).toBe(403);
    const unconfigured = await runRemoteGeneration(actionRequest('s', 'town'), { url: null, getAccessToken: async () => null })
      .catch(e => e);
    expect(unconfigured.code).toBe('engine_unavailable');
  });

  it('a 200 outside the contract rejects engine_reply_invalid', async () => {
    const { impl } = fetchDouble(async () => ({ ok: true, status: 200, json: async () => ({ hello: 1 }) }));
    expect((await remoteRun(actionRequest('s', 'town'), impl).catch(e => e)).code).toBe('engine_reply_invalid');
  });

  it('a request carrying a neighbour or homebrew is refused before any fetch', async () => {
    const { impl, calls } = okFetch();
    const withNeighbour = actionRequest('s', 'town');
    withNeighbour.payload.neighbour = { name: 'Elsewhere', _seed: 'n' };
    const err = await remoteRun(withNeighbour, impl).catch(e => e);
    expect(err.code).toBe('engine_remote_unsupported');
    expect(err.inputs).toEqual(['neighbour']);
    const withHomebrew = actionRequest('s', 'town');
    withHomebrew.payload.contentRuntime = { ...withHomebrew.payload.contentRuntime, customContent: { institutions: [{ id: 'x' }] } };
    expect((await remoteRun(withHomebrew, impl).catch(e => e)).inputs).toEqual(['customContent']);
    expect(calls).toHaveLength(0);
  });
});

describe('the engineVersion stamp lives at the transport (ENGINE-2 unit 2)', () => {
  const request = () => actionRequest('stamp-a', 'town');

  it('the build carries the committed engine bundle meta\'s version, a 16-hex content hash', () => {
    const meta = JSON.parse(readFileSync(resolve(__dirname, '..', '..', 'supabase', 'functions', '_shared', 'engineBundle.meta.json'), 'utf8'));
    expect(LOCAL_ENGINE_VERSION).toBe(meta.engineVersion);
    expect(LOCAL_ENGINE_VERSION).toMatch(/^[0-9a-f]{16}$/);
  });

  it('the pipeline\'s own output is NOT stamped (the byte replay and the goldens read it)', () => {
    const core = runGenerationRequest(request());
    expect(Object.keys(core.settlement).length).toBeGreaterThan(10);
    // anchored: the line above proves the settlement is a populated record before its key set is read.
    expect(Object.keys(core.settlement)).not.toContain('engineVersion');
  });

  it('every local outcome stamps the build\'s version: in-thread, worker, transport-failed', async () => {
    const fallback = async () => ({ settlement: { name: 'Local' } });
    const flagOff = await runGeneration(request(), { flagOn: false, remote: false, fallback });
    expect(flagOff.result.settlement).toEqual({ name: 'Local', engineVersion: LOCAL_ENGINE_VERSION });

    const worker = {
      onmessage: null, onerror: null, onmessageerror: null,
      postMessage(req) {
        queueMicrotask(() => this.onmessage({ data: {
          kind: 'generation.result', requestId: req.requestId,
          workerContract: 'settlementforge:generation:worker-v1', result: { settlement: { name: 'Worker' } },
        } }));
      },
      terminate() {},
    };
    const viaWorker = await runGeneration(request(), { flagOn: true, remote: false, fallback, workerFactory: () => worker });
    expect(viaWorker.outcome).toBe('worker');
    expect(viaWorker.result.settlement).toEqual({ name: 'Worker', engineVersion: LOCAL_ENGINE_VERSION });

    const broken = {
      onmessage: null, onerror: null, onmessageerror: null,
      postMessage() { queueMicrotask(() => this.onerror(new Error('script error'))); },
      terminate() {},
    };
    const failed = await runGeneration(request(), { flagOn: true, remote: false, fallback, workerFactory: () => broken });
    expect(failed.outcome).toBe('in-thread:transport-failed');
    expect(failed.result.settlement).toEqual({ name: 'Local', engineVersion: LOCAL_ENGINE_VERSION });
  });

  it('the remote transport stamps the version the service ANSWERED, even when this build carries another', async () => {
    const other = 'ffffffffffffffff';
    const { impl } = fetchDouble(async (_url, init) => {
      const body = { ...serviceReply(init.body), engineVersion: other };
      return { ok: true, status: 200, json: async () => body };
    });
    const { result } = await remoteRun(request(), impl);
    expect(result.settlement.engineVersion).toBe(other);
    expect(other).not.toBe(LOCAL_ENGINE_VERSION);
  });

  it('a packet without a settlement object is returned as it came', async () => {
    const { result } = await runGeneration(request(), { flagOn: false, remote: false, fallback: async () => ({ settlement: null }) });
    expect(result).toEqual({ settlement: null });
  });
});
