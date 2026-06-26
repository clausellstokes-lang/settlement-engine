/**
 * tests/domain/advanceCampaignWorldPause.test.js — Advance-scaling Stage 3.
 *
 * The keystone: the autoresolve-OFF PAUSE/RESUME state machine. Pins THE #1
 * CORRECTNESS INVARIANT (locked decision #4):
 *
 *   an autoresolve-ON run == an autoresolve-OFF run with EVERY paused major
 *   resolved-to-RECOMMENDED — byte-identical worldState/settlementUpdates.
 *
 * Plus: pause returns at a tick boundary after committing minors; resume continues
 * the remaining ticks to the same final state; a reload-mid-pause (rehydrate the
 * cursor) resumes to identical ticks (seed replay, no double-advance); a dismissed
 * major is honored.
 *
 * The fixture deliberately uses a rival/hostile regional graph so the live
 * faction_government_challenge candidate fires structural MAJORS without needing
 * the war layer — a reproducible major source (first major surfaces at tick 5).
 */

import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/index.js';
import { deriveDecisionTier } from '../../src/domain/worldPulse/decisionTier.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-06-01T00:00:00.000Z';

function settlement(name, patch = {}) {
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
    ...patch,
  };
}

function save(id, name, patch = {}) {
  return {
    id,
    name,
    phase: 'canon',
    settlement: settlement(name, patch),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

function buildFixture(seed = 'pause-seed') {
  const ids = ['a', 'b', 'c'];
  const campaign = {
    id: 'camp-pause',
    name: 'Pause Realm',
    settlementIds: ids,
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
      ],
    }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: seed,
      tick: 0,
      canonizedAt: NOW,
      stressors: [{ id: 'world_stressor.famine.realm', type: 'famine', severity: 0.6, affectedSettlementIds: ids }],
    },
  };
  const saves = [
    save('a', 'Ashford', { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.5 }] }),
    save('b', 'Briarwatch'),
    save('c', 'Caldmere'),
  ];
  return { campaign, saves };
}

// Fold a tick result's settlementUpdates onto saves (id-matched, last-write-wins).
function foldOntoSaves(saves, updates) {
  if (!Array.isArray(updates) || !updates.length) return saves;
  const byId = new Map(updates.map(u => [String(u.saveId), u.settlement]));
  return saves.map(s => (byId.has(String(s.id)) ? { ...s, settlement: byId.get(String(s.id)) } : s));
}

// Build a resume cursor (the persisted pausedAdvance shape) from a paused result.
function cursorFrom(paused, decisions = {}) {
  return {
    interval: paused.interval,
    ticksTotal: paused.ticksTotal,
    resumeTick: paused.resumeTick,
    pendingMajors: paused.pendingMajors,
    preWorldState: paused.preWorldState,
    preRegionalGraph: paused.preRegionalGraph,
    preWizardNews: paused.preWizardNews,
    preSaves: paused.preSaves,
    // Stage 5 ring policy: carry the original pre-interval length through resume so
    // the whole interval collapses to ONE composed record (mirrors the store cursor).
    preIntervalHistoryLen: paused.preIntervalHistoryLen,
    decisions,
  };
}

// Drive an autoresolve-OFF advance to completion by resolving every pause to
// RECOMMENDED (decisions = {}), exactly as the store would: re-enter with the
// cursor until status === 'complete'. Returns the final composed result.
async function runOffToCompletionRecommended(campaign, saves, interval) {
  let result = await simulateCampaignWorldInterval({ campaign, saves, interval, commit: true, now: NOW, autoResolve: false });
  let guard = 0;
  while (result.status === 'paused') {
    if (guard++ > 200) throw new Error('pause loop did not converge');
    // The resume re-runs the paused tick from its PRE-tick inputs (carried on the
    // cursor), so the campaign/saves passed here are irrelevant to the re-run — the
    // store passes the live campaign; the cursor pre-inputs drive determinism.
    result = await simulateCampaignWorldInterval({
      campaign, saves, commit: true, now: NOW, autoResolve: false,
      resume: cursorFrom(result),
    });
  }
  return result;
}

describe('Advance-scaling Stage 3 — pause/resume state machine', () => {
  test('the fixture actually produces structural majors (anti-vacuity)', async () => {
    const { campaign, saves } = buildFixture();
    const on = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_year', commit: true, now: NOW });
    expect(on.majors.length).toBeGreaterThan(0);
  });

  test('PAUSE returns at a tick boundary after committing minors, with majors batched + correct cursor', async () => {
    const { campaign, saves } = buildFixture();
    const paused = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_year', commit: true, now: NOW, autoResolve: false });
    expect(paused.status).toBe('paused');
    // The cursor is a clean tick boundary: the pause tick committed its minors
    // (ticksDone), and the remaining ticks add up to the total.
    expect(paused.ticksDone).toBeGreaterThanOrEqual(1);
    expect(paused.ticksDone + paused.remainingTicks).toBe(paused.ticksTotal);
    expect(paused.ticksTotal).toBe(48); // one_year = 48 weeks
    // Majors are batched (no cap) and every one classifies major.
    expect(paused.pendingMajors.length).toBeGreaterThan(0);
    for (const m of paused.pendingMajors) expect(deriveDecisionTier(m)).toBe('major');
    // The committed worldState advanced exactly to the pause tick (minors landed).
    expect(paused.worldState.tick).toBe(paused.atTick);
    expect(paused.worldState.tick).toBe(paused.ticksDone);
    // The cursor carries the PRE-tick inputs for the deterministic re-run.
    expect(paused.preWorldState).toBeTruthy();
    expect(paused.preWorldState.tick).toBe(paused.atTick - 1);
    expect(paused.resumeTick).toBe(paused.ticksDone - 1);
  });

  test('THE EQUIVALENCE: autoresolve-ON == autoresolve-OFF resolved-to-recommended (byte-identical)', async () => {
    const on = await (async () => { const { campaign, saves } = buildFixture(); return await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_year', commit: true, now: NOW }); })();
    const off = await (async () => { const { campaign, saves } = buildFixture(); return await runOffToCompletionRecommended(campaign, saves, 'one_year'); })();

    expect(off.status).toBe('complete');
    expect(on.worldState.tick).toBe(48);
    expect(off.worldState.tick).toBe(48);
    // THE locked invariant: byte-identical worldState + settlementUpdates.
    expect(off.worldState).toEqual(on.worldState);
    const sortBySave = arr => [...arr].sort((x, y) => String(x.saveId).localeCompare(String(y.saveId)));
    expect(sortBySave(off.settlementUpdates)).toEqual(sortBySave(on.settlementUpdates));
  });

  test('RESUME via the cursor continues the remaining ticks and lands the same final state', async () => {
    const { campaign, saves } = buildFixture();
    const off = await runOffToCompletionRecommended(campaign, saves, 'one_season');
    const on = await simulateCampaignWorldInterval({ ...buildFixture(), interval: 'one_season', commit: true, now: NOW });
    expect(off.status).toBe('complete');
    expect(off.worldState.tick).toBe(12);
    expect(off.worldState).toEqual(on.worldState);
  });

  test('RELOAD-mid-pause: rehydrate the cursor from a serialized pause → identical ticks (seed replay, no double-advance)', async () => {
    const { campaign, saves } = buildFixture();
    const paused = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_year', commit: true, now: NOW, autoResolve: false });
    expect(paused.status).toBe('paused');

    // Simulate a reload: round-trip the cursor + committed state through JSON, as a
    // persisted campaign would. The resume must re-derive identical ticks.
    const persistedCursor = JSON.parse(JSON.stringify(cursorFrom(paused)));

    let result = await simulateCampaignWorldInterval({
      campaign, saves, commit: true, now: NOW, autoResolve: false, resume: persistedCursor,
    });
    let guard = 0;
    while (result.status === 'paused') {
      if (guard++ > 200) throw new Error('loop');
      result = await simulateCampaignWorldInterval({ campaign, saves, commit: true, now: NOW, autoResolve: false, resume: JSON.parse(JSON.stringify(cursorFrom(result))) });
    }

    // No double-advance: the rehydrated resume completes at tick 48 (the same end
    // the ON path reaches), proving the cursor picked up at the pause tick, not 0.
    expect(result.worldState.tick).toBe(48);
    // And it matches a never-reloaded ON run to the same end (full byte-identity).
    const on = await simulateCampaignWorldInterval({ ...buildFixture(), interval: 'one_year', commit: true, now: NOW });
    expect(result.worldState).toEqual(on.worldState);
  });

  test('a DISMISSED major is NOT applied (the DM verdict is honored, diverges from recommended)', async () => {
    const { campaign, saves } = buildFixture();
    const paused = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_year', commit: true, now: NOW, autoResolve: false });

    // Resume resolving every pending major to RECOMMENDED.
    const recommended = await simulateCampaignWorldInterval({ campaign, saves, commit: true, now: NOW, autoResolve: false, resume: cursorFrom(paused) });
    // Resume DISMISSING every pending major.
    const dismissAll = Object.fromEntries(paused.pendingMajors.map(m => [String(m.id), { decision: 'dismissed' }]));
    const dismissed = await simulateCampaignWorldInterval({ campaign, saves, commit: true, now: NOW, autoResolve: false, resume: cursorFrom(paused, dismissAll) });

    // Both are valid runs, but the worldState differs — the dismissal actually
    // routed (the pause tick's majors never landed under dismissal).
    expect(JSON.stringify(dismissed.worldState)).not.toBe(JSON.stringify(recommended.worldState));
  });

  test('autoResolve ON is the default and runs to completion (no pause field leaks majors)', async () => {
    const { campaign, saves } = buildFixture();
    const r = await simulateCampaignWorldInterval({ campaign, saves, interval: 'one_month', commit: true, now: NOW });
    expect(r.status).toBe('complete');
    expect(r.worldState.tick).toBe(4);
    // Stage 1/2 invariant: the ON path carries no pause cursor.
    expect(r.pendingMajors).toBeUndefined();
    expect(r.preWorldState).toBeUndefined();
  });
});
