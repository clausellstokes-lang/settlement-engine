/**
 * tests/domain/advanceIntervalProgressYield.test.js — perf-advance surface fixes.
 *
 * Pins the two scheduling/observability seams of the multi-tick orchestrator:
 *
 *   1. yieldToEventLoop's fallback is a REAL MACROTASK. The old fallback was
 *      Promise.resolve() — a microtask, which resumes BEFORE the event loop
 *      regains control, so a host without scheduler.yield (Safari, older
 *      Firefox/Chromium — and this Node test env) ran the whole advance as ONE
 *      long task and queued timers/paint/input starved until the end. The test
 *      queues a setTimeout(0) probe before the advance and requires it to fire
 *      DURING the run (at the between-batch yield), not after.
 *
 *   2. Per-tick progress reporting. The orchestrator reports after EVERY
 *      completed kernel tick via BOTH the onProgress callback and the
 *      ADVANCE_PROGRESS_EVENT CustomEvent on globalThis (the channel the
 *      useAdvanceSession hook listens on — it cannot import this lazy-loaded
 *      chunk, so the event name is a frozen mirrored contract). Reporting is
 *      observational only: the composed output must be byte-identical with and
 *      without an observer.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, test, vi } from 'vitest';

import {
  simulateCampaignWorldInterval,
  ADVANCE_PROGRESS_EVENT,
} from '../../src/domain/worldPulse/advanceInterval.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-06-01T00:00:00.000Z';

function settlement(name) {
  return {
    name,
    tier: 'town',
    population: 1800,
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

function buildFixture(seed = 'progress-yield-seed') {
  const ids = ['a', 'b'];
  const campaign = {
    id: 'camp-progress',
    name: 'Progress Realm',
    settlementIds: ids,
    regionalGraph: ensureRegionalGraph({
      edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }],
      // Pin the mint stamp: without options.now the fixture graph carries a
      // wall-clock updatedAt, which would make two "identical" fixtures differ.
    }, { now: NOW }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: { rngSeed: seed, tick: 0, canonizedAt: NOW },
  };
  return { campaign, saves: [save('a', 'Ashford'), save('b', 'Briarwatch')] };
}

describe('perf-advance — macrotask yield between tick batches', () => {
  test('a queued macrotask runs DURING a multi-batch advance, not after it', async () => {
    // This env has no scheduler.yield (like Safari), so the FALLBACK path is
    // exercised. one_season = 12 ticks ⇒ one yield boundary (after tick 8).
    expect(typeof globalThis.scheduler?.yield).not.toBe('function');

    const { campaign, saves } = buildFixture();
    let advanceDone = false;
    let macrotaskRanDuringAdvance = false;
    const probe = setTimeout(() => {
      if (!advanceDone) macrotaskRanDuringAdvance = true;
    }, 0);

    const result = await simulateCampaignWorldInterval({
      campaign, saves, interval: 'one_season', now: NOW,
    });
    advanceDone = true;
    clearTimeout(probe);

    expect(result.status).toBe('complete');
    // With the old Promise.resolve() microtask fallback the probe could only
    // fire AFTER the advance resolved (microtasks drain before any macrotask),
    // leaving this false — the whole advance was one long task.
    expect(macrotaskRanDuringAdvance).toBe(true);
  });
});

describe('perf-advance — per-tick progress reporting', () => {
  test('onProgress fires after every kernel tick with a running ticksDone', async () => {
    const { campaign, saves } = buildFixture();
    const beats = [];
    const result = await simulateCampaignWorldInterval({
      campaign, saves, interval: 'one_month', now: NOW,
      onProgress: detail => beats.push(detail),
    });

    expect(result.status).toBe('complete');
    expect(beats.map(b => b.ticksDone)).toEqual([1, 2, 3, 4]);
    expect(beats.every(b => b.ticksTotal === 4)).toBe(true);
    expect(beats.every(b => b.interval === 'one_month')).toBe(true);
  });

  test('the same beats dispatch as ADVANCE_PROGRESS_EVENT on globalThis when the host has dispatchEvent', async () => {
    // Node's globalThis is not an EventTarget, so install a dispatch spy to
    // stand in for the browser window the hook listens on.
    expect(globalThis.dispatchEvent).toBeUndefined();
    const dispatched = [];
    globalThis.dispatchEvent = vi.fn(event => { dispatched.push(event); return true; });
    try {
      const { campaign, saves } = buildFixture();
      await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_month', now: NOW });
    } finally {
      delete globalThis.dispatchEvent;
    }

    const progressEvents = dispatched.filter(e => e?.type === ADVANCE_PROGRESS_EVENT);
    expect(progressEvents.map(e => e.detail.ticksDone)).toEqual([1, 2, 3, 4]);
    expect(progressEvents.every(e => e.detail.ticksTotal === 4)).toBe(true);
  });

  test('a throwing onProgress observer never breaks the advance', async () => {
    const { campaign, saves } = buildFixture();
    const result = await simulateCampaignWorldInterval({
      campaign, saves, interval: 'one_month', now: NOW,
      onProgress: () => { throw new Error('observer exploded'); },
    });
    expect(result.status).toBe('complete');
  });

  test('progress observation is output-neutral: composed result is identical with and without it', async () => {
    const plain = await simulateCampaignWorldInterval({
      ...buildFixture(), interval: 'one_month', now: NOW,
    });
    const observed = await simulateCampaignWorldInterval({
      ...buildFixture(), interval: 'one_month', now: NOW, onProgress: () => {},
    });
    expect(JSON.stringify(observed)).toBe(JSON.stringify(plain));
  });

  test('frozen contract: useAdvanceSession mirrors the event name without importing the lazy domain chunk', () => {
    const hookSource = readFileSync(
      fileURLToPath(new URL('../../src/hooks/useAdvanceSession.js', import.meta.url)),
      'utf8',
    );
    expect(hookSource).toContain(`'${ADVANCE_PROGRESS_EVENT}'`);
    // The mirror exists precisely so the hook does NOT pull the heavy chunk
    // into the main bundle — pin that it never starts importing it.
    expect(hookSource).not.toMatch(/from\s+['"].*worldPulse/);
  });
});
