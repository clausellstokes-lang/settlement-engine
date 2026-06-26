/**
 * tests/domain/historyRingCollapse.test.js — Advance-scaling Stage 5 ring policy,
 * SATURATED-ring regression.
 *
 * Pins the data-integrity fix for collapseIntervalHistory (advanceInterval.js):
 * the interior-beat collapse must hold even when the pulseHistory ring is already
 * at MAX_HISTORY=80. The one-week kernel slices its ring to 80 every tick
 * (appendPulseHistory), so on a saturated ring an interior tick appends AND evicts
 * — the post-eviction `history.length` stays pinned at 80 while the pre-interval
 * length is also 80. A collapse gated on `history.length - preIntervalLen` then
 * mis-fires: it either early-returns (leaking N-1 interior interval records into
 * the ring) or, had it fired, front-slices `slice(0, base)` and over-evicts the
 * pre-interval survivors. The fix collapses off the APPENDED-record count, trimming
 * the interior beats from the END — robust to eviction.
 *
 * Invariant under test: a saturated-ring multi-tick advance leaves EXACTLY ONE
 * record for the interval (no interior leak) and does NOT over-evict — the ring
 * stays full at 80 with the single final composed beat as its tail.
 */

import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

const NOW = '2026-06-01T00:00:00.000Z';
const MAX_HISTORY = 80;

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

// Pre-fill the ring to MAX_HISTORY with distinct legacy records. These are the
// PRE-INTERVAL records that must survive (all but the oldest, evicted as the
// interval appends) — they carry an `isPreInterval` marker the assertions key on.
function saturatedHistory() {
  return Array.from({ length: MAX_HISTORY }, (_, i) => ({
    id: `legacy_pulse.${i}`,
    tick: -MAX_HISTORY + i,
    committed: true,
    isPreInterval: true,
  }));
}

function buildSaturatedFixture(seed = 'ring-saturated-seed') {
  const ids = ['a', 'b', 'c'];
  const campaign = {
    id: 'camp-ring',
    name: 'Saturated Ring Realm',
    settlementIds: ids,
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
      ],
    }),
    wizardNews: { currentTick: 0, entries: [] },
    worldState: {
      rngSeed: seed,
      tick: 0,
      canonizedAt: NOW,
      pulseHistory: saturatedHistory(),
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

describe('Stage 5 ring policy — saturated-ring collapse (data-integrity regression)', () => {
  test('the world starts with a FULL ring (the precondition the bug needs)', () => {
    const { campaign } = buildSaturatedFixture();
    expect(campaign.worldState.pulseHistory.length).toBe(MAX_HISTORY);
  });

  test('a one_month advance on a saturated ring collapses to EXACTLY ONE interval record', async () => {
    const { campaign, saves } = buildSaturatedFixture();
    const composed = await simulateCampaignWorldInterval({
      campaign, saves, interval: 'one_month', commit: true, now: NOW,
    });

    const history = composed.worldState.pulseHistory;
    // The ring is bounded at MAX_HISTORY and was already full; collapsing 4 appended
    // beats to 1 nets -3, so the ring shrinks to 77 (it does NOT stay pinned at 80
    // with interior leakage, and it does NOT over-evict below 77).
    expect(history.length).toBe(MAX_HISTORY - (4 - 1));

    // Exactly ONE interval record (the final composed tick): every other surviving
    // record is a pre-interval legacy beat. No interior interval beats leak in.
    const intervalRecords = history.filter(r => !r.isPreInterval);
    expect(intervalRecords.length).toBe(1);
    // The retained interval record is the FINAL tick's composed beat.
    expect(intervalRecords[0].tick).toBe(4);
    expect(intervalRecords[0].committed).toBe(true);
    // It is the ring's tail.
    expect(history[history.length - 1]).toBe(intervalRecords[0]);
  });

  test('the surviving pre-interval records are NOT over-evicted (kept verbatim, FIFO-trimmed)', async () => {
    const { campaign, saves } = buildSaturatedFixture();
    const before = campaign.worldState.pulseHistory;
    const composed = await simulateCampaignWorldInterval({
      campaign, saves, interval: 'one_month', commit: true, now: NOW,
    });

    const survivors = composed.worldState.pulseHistory.filter(r => r.isPreInterval);
    // A 4-tick advance appends 4 records to a full ring, each append FIFO-evicting one
    // oldest pre-interval record — so 4 of the 80 pre-interval records are evicted by
    // the ring before the collapse even runs, leaving 76 pre-interval survivors (the
    // newest, indices 4..79). The collapse then trims the 3 interior interval beats.
    // The bug's front-slice would over-evict the pre-interval survivors; the count-
    // based trim keeps exactly those newest 76, FIFO order intact.
    expect(survivors.length).toBe(MAX_HISTORY - 4);
    const expectedIds = before.slice(4).map(r => r.id);
    expect(survivors.map(r => r.id)).toEqual(expectedIds);
  });

  test('a one_year advance on a saturated ring still leaves exactly one interval record', async () => {
    const { campaign, saves } = buildSaturatedFixture();
    const composed = await simulateCampaignWorldInterval({
      campaign, saves, interval: 'one_year', commit: true, now: NOW,
    });
    const history = composed.worldState.pulseHistory;
    const intervalRecords = history.filter(r => !r.isPreInterval);
    expect(intervalRecords.length).toBe(1);
    expect(intervalRecords[0].tick).toBe(48);
    // 48 appended, collapsed to 1 ⇒ ring nets to 80 - 47 = 33.
    expect(history.length).toBe(MAX_HISTORY - (48 - 1));
  });
});
