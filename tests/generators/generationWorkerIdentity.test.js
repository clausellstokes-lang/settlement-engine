/**
 * generationWorkerIdentity.test.js — THE DORMANCY INSTRUMENT for the generation
 * transport: the same seed is the same world on either side of the boundary.
 *
 * THE PROMISE says a seed is a starting world forever. Moving generation into a
 * Web Worker must therefore move NOTHING, and the claim is not "the code looks
 * the same" but a measured byte identity in three places:
 *
 *  1. THE CLONE BOUNDARY. `structuredClone(core(structuredClone(request)))` must
 *     equal `core(request)` over a tier x culture sample of the golden corpus's
 *     own vocabulary. This is the leg that would catch the two things a
 *     postMessage boundary genuinely COULD move: a Map/Set/undefined mangled by
 *     the clone, and a config resolved in place on one path only.
 *  2. IDENTITY WITH THE ONE GENERATION ENTRY. With no previous settlement the
 *     core's settlement must equal the direct `generateSettlementPipeline` call,
 *     so the headless runners (soak, the golden master, the OSR corpus) and the
 *     worker are the SAME path rather than two agreeing ones.
 *  3. THE CARRY. The locked-roster carry crosses INSIDE the core, so its report
 *     and its output must equal the carry applied outside it.
 *
 * ⚠ HONEST LABEL ON THE "WORKER" LEG. There is no browser Worker here. The
 * end-to-end arm drives the REAL worker shell module (`generation.worker.js`,
 * with its `self` host installed by this file) through the REAL client over a
 * transport double that structured-clones in BOTH directions exactly as
 * postMessage would. That proves shell + core + client + clone semantics in one
 * JS thread. A second real engine (a Node worker_threads isolate) and the
 * browser leg are separate instruments and are NOT claimed here.
 *
 * @enforced-by this test
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  generateSettlementPipeline,
  carryLockedRosterThroughGenerate,
} from '../../src/generators/generateSettlementPipeline.js';
import { CULTURE_PROFILE_KEYS } from '../../src/domain/cultureProfiles.js';
import { runGenerationRequest } from '../../src/workers/generationRequest.js';
import { runGeneration } from '../../src/lib/generationClient.js';
import {
  GENERATION_PROTOCOL_VERSION,
  GENERATION_REQUEST_KIND,
} from '../../src/lib/generationProtocol.js';

// The golden corpus's own vocabulary and base config, transcribed from
// tests/property/generatorGoldenMaster.test.js so this file samples the SAME
// world space the dormancy manifest pins.
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const CULTURES = [...CULTURE_PROFILE_KEYS, 'mediterranean'];
const BASE = {
  settType: 'town',
  culture: 'germanic',
  terrainOverride: 'plains',
  tradeRouteAccess: 'road',
  monsterThreat: 'civilized',
};
const SEED = 'golden-master-v3';

/**
 * A 25-row tier x culture sample. The full cross product is 6 x 12 = 72 rows,
 * which is why this walks a diagonal instead: the offset advances the culture
 * once per completed tier sweep, so 25 rows are 25 DISTINCT pairs that between
 * them cover every tier and every culture. The sample's own coverage is
 * asserted below rather than assumed, because a sample that quietly collapsed
 * onto one tier would still pass every identity arm.
 * @returns {Array<{settType: string, culture: string}>}
 */
function sampleRows() {
  const rows = [];
  for (let i = 0; i < 25; i += 1) {
    rows.push({
      ...BASE,
      settType: TIERS[i % TIERS.length],
      culture: CULTURES[(i + Math.floor(i / TIERS.length)) % CULTURES.length],
    });
  }
  return rows;
}

const ROWS = sampleRows();

const requestFor = (config, extra = {}) => ({
  kind: GENERATION_REQUEST_KIND,
  v: GENERATION_PROTOCOL_VERSION,
  op: 'settlement',
  requestId: 'identity-1',
  payload: {
    fullConfig: { ...config },
    neighbour: null,
    seed: SEED,
    contentRuntime: { customContent: {} },
    previousSettlement: null,
    locks: null,
    ...extra,
  },
});

const CFG = { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' };

/** The real worker shell's message handler, with this file as its `self` host. */
let shellOnMessage = null;
const ORIGINAL_SELF = Object.prototype.hasOwnProperty.call(globalThis, 'self')
  ? /** @type {any} */ (globalThis).self
  : undefined;

beforeAll(async () => {
  const host = { onmessage: null, postMessage: () => {} };
  /** @type {any} */ (globalThis).self = host;
  await import('../../src/workers/generation.worker.js');
  shellOnMessage = host.onmessage;
  expect(typeof shellOnMessage).toBe('function');
}, 60_000);

afterAll(() => {
  if (ORIGINAL_SELF === undefined) delete (/** @type {any} */ (globalThis)).self;
  else /** @type {any} */ (globalThis).self = ORIGINAL_SELF;
});

/**
 * A transport double that structured-clones in BOTH directions, so the shell
 * sees what a real worker would see and the client receives what a real
 * postMessage would deliver.
 */
function shellWorkerFactory() {
  return new (class {
    constructor() {
      this.onmessage = null;
      this.onerror = null;
      this.onmessageerror = null;
      this.terminated = 0;
    }
    postMessage(data) {
      /** @type {any} */ (globalThis).self.postMessage = (packet) => {
        this.onmessage?.({ data: structuredClone(packet) });
      };
      shellOnMessage({ data: structuredClone(data) });
    }
    terminate() { this.terminated += 1; }
  })();
}

describe('generation across the thread boundary — the same seed is the same world', () => {
  it('the tier x culture sample is 25 distinct pairs covering every tier and every culture', () => {
    const pairs = new Set(ROWS.map(r => `${r.settType}|${r.culture}`));
    expect(pairs.size).toBe(25);
    expect(new Set(ROWS.map(r => r.settType)).size).toBe(TIERS.length);
    expect(new Set(ROWS.map(r => r.culture)).size).toBe(CULTURES.length);
  });

  it('clone-boundary identity: structuredClone(core(structuredClone(request))) equals core(request), settlement and pipelineHistory, over the tier x culture sample', () => {
    const drifted = [];
    for (const row of ROWS) {
      const direct = runGenerationRequest(requestFor(row));
      const crossed = structuredClone(runGenerationRequest(structuredClone(requestFor(row))));
      const key = `${row.settType}|${row.culture}`;
      if (JSON.stringify(crossed.settlement) !== JSON.stringify(direct.settlement)) {
        drifted.push(`${key}: settlement`);
      }
      if (JSON.stringify(crossed.pipelineHistory) !== JSON.stringify(direct.pipelineHistory)) {
        drifted.push(`${key}: pipelineHistory`);
      }
      expect(crossed.settlement).toEqual(direct.settlement);
      expect(crossed.pipelineHistory).toEqual(direct.pipelineHistory);
    }
    expect(drifted, `rows whose bytes moved across the clone boundary:\n${drifted.join('\n')}`).toEqual([]);
  }, 120_000);

  it('the core with no previous settlement equals the direct module entry generateSettlementPipeline(cfg, null, { seed, customContent: {} }) — the headless runners and the worker are one path', () => {
    const mismatches = [];
    for (const row of ROWS) {
      const viaCore = runGenerationRequest(requestFor(row));
      const direct = generateSettlementPipeline({ ...row }, null, { seed: SEED, customContent: {} });
      if (JSON.stringify(viaCore.settlement) !== JSON.stringify(direct)) {
        mismatches.push(`${row.settType}|${row.culture}`);
      }
    }
    expect(mismatches, `rows where the core and the direct entry disagree:\n${mismatches.join('\n')}`).toEqual([]);
    // Non-vacuity: the loop above must actually have generated worlds.
    expect(ROWS.length).toBe(25);
  }, 120_000);

  it('the result is fully structured-cloneable — a real worker could post it', () => {
    const result = runGenerationRequest(requestFor({ ...BASE }));
    const cloned = structuredClone(result);
    expect(JSON.stringify(cloned)).toBe(JSON.stringify(result));
    expect(Array.isArray(cloned.pipelineHistory)).toBe(true);
    expect(cloned.pipelineHistory.length).toBeGreaterThan(0);
  }, 60_000);

  it('the request is not mutated by the core — the in-thread path has the worker path\'s side-effect profile', () => {
    const request = requestFor({ ...BASE });
    const before = JSON.stringify(request);
    runGenerationRequest(request);
    expect(JSON.stringify(request)).toBe(before);
  }, 60_000);

  it('end-to-end through the real client over the real worker shell equals the in-thread fallback', async () => {
    const request = requestFor({ ...BASE });
    const relayedViaWorker = [];
    const relayedInThread = [];

    const viaWorker = await runGeneration(request, {
      flagOn: true,
      fallback: () => { throw new Error('the worker path must not fall back here'); },
      workerFactory: shellWorkerFactory,
      onStep: (step) => relayedViaWorker.push(step.id),
    });
    const inThread = await runGeneration(request, {
      flagOn: false,
      fallback: (req, onStep) => runGenerationRequest(req, (event) => onStep?.(event.step)),
      onStep: (step) => relayedInThread.push(step.id),
    });

    expect(viaWorker.outcome).toBe('worker');
    expect(inThread.outcome).toBe('in-thread:flag-off');
    expect(JSON.stringify(viaWorker.result.settlement)).toBe(JSON.stringify(inThread.result.settlement));
    expect(JSON.stringify(viaWorker.result.pipelineHistory)).toBe(JSON.stringify(inThread.result.pipelineHistory));
    expect(relayedViaWorker).toEqual(relayedInThread);
    expect(relayedViaWorker.length).toBeGreaterThan(0);
  }, 60_000);
});

describe('the locked-roster carry crosses the boundary intact', () => {
  /** @type {Record<string, any>} */
  let previous;

  beforeAll(() => {
    previous = generateSettlementPipeline(CFG, null, { seed: 'lockb-A-1', customContent: {} });
  }, 60_000);

  it('with one locked NPC, the core\'s preservation report names it and the carried settlement equals the carry applied outside the core', () => {
    const locks = { npcs: [String(previous.npcs[0].id)] };
    const request = requestFor(CFG, { previousSettlement: previous, locks, seed: 'lockb-B-1' });

    const viaCore = runGenerationRequest(request);
    const fresh = generateSettlementPipeline({ ...CFG }, null, { seed: 'lockb-B-1', customContent: {} });
    const outside = carryLockedRosterThroughGenerate(previous, fresh, locks);

    // Non-vacuous: the carry actually ran and actually preserved somebody.
    expect(viaCore.preservation).toBeTruthy();
    expect(viaCore.preservation.preserved.length).toBeGreaterThanOrEqual(1);
    expect(JSON.stringify(viaCore.settlement)).toBe(JSON.stringify(outside.settlement));
    expect(JSON.stringify(viaCore.preservation)).toBe(JSON.stringify(outside._preservation));
  }, 120_000);

  it('with no locks the carried settlement is byte-equal to the fresh one', () => {
    const request = requestFor(CFG, { previousSettlement: previous, locks: {}, seed: 'lockb-B-1' });

    const viaCore = runGenerationRequest(request);
    const fresh = generateSettlementPipeline({ ...CFG }, null, { seed: 'lockb-B-1', customContent: {} });

    expect(JSON.stringify(viaCore.settlement)).toBe(JSON.stringify(fresh));
    expect(viaCore.preservation).toBe(null);
  }, 120_000);
});
