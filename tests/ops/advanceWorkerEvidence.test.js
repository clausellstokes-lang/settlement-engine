/**
 * Release-evidence pin for actual isolated advance execution.
 *
 * The older clone-parity tests correctly prove structured-clone compatibility,
 * but a clone on the test thread cannot prove that work ran in another isolate
 * or measure its round trip. This test launches the Node worker_threads adapter,
 * which imports the product browser-worker module and its real domain entry.
 */

import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';
import { measureIsolatedAdvanceWorker } from '../../scripts/audit/advance-worker-evidence.mjs';

const NOW = '2026-07-24T00:00:00.000Z';
const sha256 = value => createHash('sha256').update(value).digest('hex');

function buildFixture() {
  const save = {
    id: 'worker-evidence-save',
    name: 'Evidence Ward',
    phase: 'canon',
    settlement: {
      name: 'Evidence Ward',
      tier: 'town',
      population: 1800,
      config: {
        tradeRouteAccess: 'road',
        priorityEconomy: 25,
        priorityMilitary: 20,
      },
      institutions: [],
      economicState: {
        primaryExports: [],
        primaryImports: ['Bulk grain and foodstuffs'],
      },
      powerStructure: {
        publicLegitimacy: { score: 45, label: 'Contested' },
        factions: [
          { faction: 'Market Council', category: 'economy', power: 55 },
        ],
        conflicts: [],
      },
      npcs: [{
        id: 'worker-evidence-reeve',
        name: 'Reeve Nera',
        importance: 'key',
      }],
      activeConditions: [],
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
  const campaign = {
    id: 'worker-evidence-campaign',
    name: 'Worker Evidence Realm',
    settlementIds: [save.id],
    regionalGraph: ensureRegionalGraph({}, { now: NOW }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: 'worker-evidence-seed',
      tick: 0,
      canonizedAt: NOW,
    },
  };
  return {
    campaign,
    saves: [save],
    interval: 'one_week',
    commit: true,
    now: NOW,
    autoResolve: true,
  };
}

describe('isolated advance-worker release evidence', () => {
  it('runs the product worker module in a real Node isolate and labels the boundary honestly', async () => {
    const payload = buildFixture();
    const direct = await simulateCampaignWorldInterval(payload);
    const { result, evidence } = await measureIsolatedAdvanceWorker(
      payload,
      { customContent: {}, timeoutMs: 30_000 },
    );

    expect(result.status).toBe('complete');
    expect(result).toEqual(direct);
    expect(evidence).toMatchObject({
      schemaVersion: 1,
      kind: 'isolated_advance_worker_measurement',
      actualExecution: true,
      nonVacuous: true,
      runtime: {
        transport: 'node:worker_threads',
        isolation: 'separate-thread-v8-isolate',
        workerIsMainThread: false,
        browserWebWorker: false,
        productionBrowserTransportMeasured: false,
        productWorkerModule: 'src/workers/advanceInterval.worker.js',
        domainEntry:
          'src/domain/worldPulse/advanceInterval.js#simulateCampaignWorldInterval',
      },
      response: {
        status: 'complete',
        progressMessages: 1,
        firstProgress: {
          ticksDone: 1,
          ticksTotal: 1,
          interval: 'one_week',
        },
        lastProgress: {
          ticksDone: 1,
          ticksTotal: 1,
          interval: 'one_week',
        },
      },
    });
    expect(evidence.runtime.workerThreadId).toBeGreaterThan(0);
    expect(evidence.runtime.workerThreadId).not.toBe(
      evidence.runtime.parentThreadId,
    );
    expect(evidence.response.jsonSha256).toBe(
      sha256(JSON.stringify(direct)),
    );
    expect(evidence.timingsMs.requestToTerminal).toBeGreaterThan(0);
    expect(evidence.timingsMs.workerHandlerToTerminalPost).toBeGreaterThan(0);
    expect(evidence.timingsMs.coldStartToTerminal).toBeGreaterThanOrEqual(
      evidence.timingsMs.requestToTerminal,
    );
    expect(evidence.timingsMs.boundaryAndBootstrapResidual)
      .toBeGreaterThanOrEqual(0);
    expect(evidence.timingsMs).not.toHaveProperty('exactTransport');
    expect(evidence.claimBoundary.notMeasured).toMatch(/Browser Web Worker/);
    expect(evidence.claimBoundary.residual).toMatch(/not exact transport time/);
  }, 30_000);
});
