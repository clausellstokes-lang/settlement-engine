/**
 * advanceWorkerByteIdentity.test.js — V-8 THE PATIENT ENGINE, THE LOAD-BEARING PIN.
 *
 * The determinism claim ("a seed IS a world, bit-for-bit") must survive the Web
 * Worker thread boundary. The worker (src/workers/advanceInterval.worker.js) runs
 * the SAME pure `simulateCampaignWorldInterval` the in-thread fallback runs, so the
 * COMPUTE is identical by shared import. The one thing the worker adds that the
 * sync path does not is the postMessage transport — which serializes inputs and
 * results through the STRUCTURED CLONE ALGORITHM. `structuredClone()` exercises
 * those serialization semantics, but is not evidence of an actual isolated
 * execution, worker scheduling, or duration. The real Node-isolate measurement
 * lives in tests/ops/advanceWorkerEvidence.test.js and retains that boundary.
 *
 * This pin proves the two things that boundary could break, over a real multi-tick
 * advance with a pinned seed + pinned `now`:
 *
 *   1. CLONE-BOUNDARY IDENTITY — cloning the inputs in, running the sim, and
 *      cloning the result out yields a worldState BYTE-IDENTICAL to the direct
 *      in-thread call. (Catches anything the structured clone would mangle — a Map
 *      the consumer treats specially, a dropped `undefined`, a class instance — and
 *      catches a worldState that is not cloneable at all, which would make the real
 *      worker throw.)
 *   2. END-TO-END THROUGH THE REAL CLIENT — driving the actual `runAdvanceInterval`
 *      transport (src/lib/advanceWorkerClient.js) against a Worker double that runs
 *      the REAL sim and clones exactly as advanceInterval.worker.js does, the result
 *      the client resolves with is byte-identical to the sync fallback's result.
 *
 * Because the persisted worldState is by contract JSON-serializable (it round-trips
 * to localStorage / Supabase), `JSON.stringify` equality here IS byte-identity of
 * the persisted shape; the paired `toEqual` also catches structural/`undefined`
 * differences that a naive stringify could hide.
 */

import { describe, expect, test, vi, afterEach } from 'vitest';

import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { runAdvanceInterval } from '../../src/lib/advanceWorkerClient.js';
import { setCustomContentSource } from '../../src/lib/customContentSource.js';

const NOW = '2026-06-01T00:00:00.000Z';

function settlement(name) {
  return {
    name,
    tier: 'town',
    population: 2100,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 60 },
        { faction: 'Temple Wardens', category: 'religious', power: 48 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `${name}-reeve`, name: `Reeve of ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}

function save(id, name) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: settlement(name),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function buildFixture(seed = 'byte-identity-seed') {
  const campaign = {
    id: 'camp-byte-identity',
    name: 'Byte-Identity Realm',
    settlementIds: ['a', 'b'],
    regionalGraph: ensureRegionalGraph(
      { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }] },
      { now: NOW },
    ),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: { rngSeed: seed, tick: 0, canonizedAt: NOW },
  };
  return { campaign, saves: [save('a', 'Ashford'), save('b', 'Briarwatch')] };
}

// A deterministic, side-effect-free set of advance args (pinned seed + pinned now).
function args(interval = 'one_year') {
  const { campaign, saves } = buildFixture();
  return { campaign, saves, interval, commit: true, now: NOW, autoResolve: true };
}

afterEach(() => {
  // Reset the custom-content seam so a worker-double run cannot leak a getter into
  // a later test. The default empty getter is what a fresh page/worker starts with.
  setCustomContentSource(() => ({}));
  vi.restoreAllMocks();
});

describe('V-8 byte-identity — the thread boundary preserves the world', () => {
  test('clone-boundary identity: structuredClone(sim(clone(args))) === sim(args), full worldState', async () => {
    // The in-thread (sync fallback) path.
    const sync = await simulateCampaignWorldInterval(args());
    // The worker boundary, modeled exactly: postMessage clones the inbound payload,
    // the worker runs the sim, postMessage clones the outbound result.
    const viaBoundary = structuredClone(await simulateCampaignWorldInterval(structuredClone(args())));

    // The advance actually did work (not a degenerate no-op that trivially matches).
    expect(sync.status).toBe('complete');
    expect(sync.worldState).toBeTruthy();
    expect(sync.worldState.tick).toBeGreaterThan(0);

    // Byte-identity of the FULL worldState (the determinism claim across the boundary).
    expect(viaBoundary.worldState).toEqual(sync.worldState);
    expect(JSON.stringify(viaBoundary.worldState)).toBe(JSON.stringify(sync.worldState));

    // …and of the whole composed result (news, updates, proposals, majors — every
    // field the store applies on completion), so nothing the boundary carries diverges.
    expect(viaBoundary).toEqual(sync);
    expect(JSON.stringify(viaBoundary)).toBe(JSON.stringify(sync));
  });

  test('the composed worldState is fully structured-cloneable (a real worker could return it)', async () => {
    const result = await simulateCampaignWorldInterval(args());
    // structuredClone throws (DataCloneError) on functions, symbols, or other
    // un-postMessage-able values anywhere in the graph. A clean round-trip is the
    // proof the real worker can hand this worldState back across the boundary.
    expect(() => structuredClone(result)).not.toThrow();
    const cloned = structuredClone(result);
    expect(JSON.stringify(cloned)).toBe(JSON.stringify(result));
  });

  test('end-to-end: runAdvanceInterval (real client) over a real-sim Worker double === sync fallback', async () => {
    const ORIG_WORKER = globalThis.Worker;
    // A Worker double that mirrors advanceInterval.worker.js EXACTLY: it clones the
    // inbound message (as postMessage does), passes the pinned custom-content
    // projection into the REAL sim, and clones progress + result back out. The only fiction is that
    // it runs on this thread — the byte-boundary (structuredClone) is authentic.
    globalThis.Worker = class RealSimWorker {
      constructor() { this.onmessage = null; this.onerror = null; this.onmessageerror = null; }
      postMessage(message) {
        const { payload, customContent } = structuredClone(message);
        Promise.resolve()
          .then(() => simulateCampaignWorldInterval({
            ...payload,
            customContent: customContent || {},
            onProgress: (detail) => this.onmessage?.({ data: { type: 'progress', detail: structuredClone(detail) } }),
          }))
          .then((result) => this.onmessage?.({ data: { type: 'result', result: structuredClone(result) } }))
          .catch((err) => this.onmessage?.({ data: { type: 'error', message: String(err?.message || err), stack: err?.stack } }));
      }
      terminate() {}
    };
    try {
      // Sync fallback with the SAME (empty) custom-content source both paths see.
      setCustomContentSource(() => ({}));
      const sync = await simulateCampaignWorldInterval(args());

      const workerResult = await runAdvanceInterval(args(), {
        fallback: () => { throw new Error('fallback must not run when the Worker resolves'); },
        customContent: {},
      });

      expect(workerResult.status).toBe('complete');
      expect(workerResult.worldState).toEqual(sync.worldState);
      expect(JSON.stringify(workerResult.worldState)).toBe(JSON.stringify(sync.worldState));
      expect(JSON.stringify(workerResult)).toBe(JSON.stringify(sync));
    } finally {
      if (ORIG_WORKER === undefined) delete globalThis.Worker;
      else globalThis.Worker = ORIG_WORKER;
    }
  });
});
