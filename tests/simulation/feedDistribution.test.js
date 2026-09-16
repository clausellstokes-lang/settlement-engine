/**
 * tests/simulation/feedDistribution.test.js — Wizard-News anti-monoculture envelope.
 *
 * The distribution complement to the soak test (which pins that the world stays
 * bounded/alive) and to E4-2's cadence damping (which stopped two single
 * outcome types — the guaranteed overlord-weakness beat and the calm-city
 * resource ratchet — from flooding the feed). This envelope pins the RESULT
 * a DM actually reads: across many ticks and several synthetic campaigns, NO
 * single news TYPE may dominate the feed. A feed that is 80% "route disruption"
 * is a monoculture even if each entry is individually correct.
 *
 * Method (the house pattern for envelopes — measure, then gate at measured +
 * margin, and DOCUMENT the baseline so a future shift is visible in the diff):
 *   - drive advanceCampaignWorld over N ticks across M topologically-distinct
 *     campaigns (trade region, political/protection region, prosperous resource
 *     region, criminal underworld, conflict frontier),
 *   - aggregate every wizard-news entry produced,
 *   - group by TYPE (impactKind — the substantive kind of thing that happened —
 *     falling back to the transition kind),
 *   - assert the most common type's share is under the anti-monoculture gate.
 *
 * MEASURED BASELINE (this tree, 2026-07; arc-aware 240-cap retention): 1200
 * entries across the 5-campaign corpus span 32 distinct types; the dominant type
 * ("population_growth") is 25.8% of the feed, then npc_suppress 12.7%,
 * crime_pressure 11.4%. wizardNews.capEntries keeps the RECENCY window intact and
 * only RESCUES the orphaned heads of major arcs that recency would flush (one slot
 * per story), so each campaign's feed — which reaches the 240-cap here — stays
 * close to the pure-recency distribution (the earlier pure-recency baseline was
 * population_growth 23.6%, npc_suppress 17.9%, crime_pressure 10.6%; the head
 * rescues surface one extra type and shift the tail). The gate is the
 * anti-monoculture ceiling (0.45) — well above the measured max, so ordinary tuning
 * has generous headroom while a regression that re-introduces a single-type flood
 * (e.g. the pre-E4 guaranteed overlord-weakness beat, which does NOT appear in the
 * top ranks here) trips it. Determinism: advanceCampaignWorld threads its own
 * seeded RNG + codepoint sorts, so the same corpus produces the same feed
 * byte-for-byte; the shares above are reproducible.
 */

import { describe, expect, test } from 'vitest';

import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph, deriveNewsThreads } from '../../src/domain/region/index.js';

const ANTI_MONOCULTURE_GATE = 0.45;
const TICKS = 30;

// ── Synthetic settlement + campaign factories ──────────────────────────────
// Deliberately varied so different news TYPES get produced: trade shocks,
// authority/protection failures, resource depletion + tier drift, criminal
// pressure, and conflict spillover. Aggregating across all of them is what
// keeps any one type from dominating — exactly the anti-monoculture property.

function baseSettlement(name, seed, over = {}) {
  return {
    name,
    tier: 'town',
    population: 1200 + (seed % 5) * 400,
    config: { tradeRouteAccess: seed % 2 ? 'road' : 'remote', priorityEconomy: 20, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'] },
    powerStructure: {
      publicLegitimacy: { score: 30 + (seed % 4) * 8, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 70 },
        { faction: 'Temple Wardens', category: 'religious', power: 50 },
      ],
      conflicts: [],
    },
    npcs: [
      { id: `reeve_${seed}`, name: `Reeve ${name}`, importance: 'key', faction: 'Merchant League' },
      { id: `captain_${seed}`, name: `Captain ${name}`, importance: 'notable', faction: 'Temple Wardens' },
    ],
    activeConditions: [],
    ...over,
  };
}

function save(id, name, seed, over) {
  return {
    id, name, phase: 'canon',
    settlement: baseSettlement(name, seed, over),
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

const FOOD_DEFICIT = {
  economicState: {
    primaryExports: [], primaryImports: ['Bulk grain and foodstuffs'],
    foodSecurity: {
      dailyNeed: 4200, dailyProduction: 2100, foodRatio: 0.5,
      deficitPct: 50, surplusPct: 0, storageMonths: 1,
      importDependency: 0.6, magicSupplement: 0, resilienceScore: 30,
    },
  },
};

const RESOURCE_TOWN = {
  tier: 'city', population: 9000,
  config: { tradeRouteAccess: 'crossroads', priorityEconomy: 55, nearbyResources: ['iron_deposits', 'stone_quarry', 'managed_forest'] },
  economicState: { primaryExports: ['Quality tools and weapons'], primaryImports: [] },
};

const CRIMINAL_TOWN = {
  institutions: [
    { id: 'guild', name: "Thieves' Guild", category: 'criminal' },
    { id: 'watch', name: 'Town Watch' },
    { id: 'market', name: 'Market square' },
  ],
  npcs: [
    { id: 'boss', name: 'The Broker', importance: 'key', faction: "Thieves' Guild", flaw: 'greedy' },
    { id: 'sarge', name: 'Sergeant Vane', importance: 'notable', faction: 'Town Watch', flaw: 'greedy', factionAffiliation: 'Town Watch' },
  ],
};

// Each campaign has a distinct topology + stressor mix so the corpus spans the
// real spread of news TYPES rather than one scenario's flavour.
function campaignFactory(index) {
  const ids = ['a', 'b', 'c', 'd', 'e'];
  const configs = [
    // 0: trade region under supply stress → import/route/famine news
    {
      id: 'feed-trade', over: id => (id === 'b' || id === 'd' ? FOOD_DEFICIT : {}),
      channels: [
        { type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'trade_route', from: 'b', to: 'c', status: 'confirmed' },
        { type: 'trade_route', from: 'c', to: 'd', status: 'confirmed' },
        { type: 'trade_dependency', from: 'd', to: 'e', status: 'confirmed' },
      ],
      stressors: [{ id: 'ws.route.a', type: 'trade_disruption', severity: 0.7, affectedSettlementIds: ['a', 'b'] }],
    },
    // 1: political / protection region → authority instability + protection gap
    {
      id: 'feed-political', over: () => ({}),
      channels: [
        { type: 'political_authority', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'political_authority', from: 'a', to: 'c', status: 'confirmed' },
        { type: 'military_protection', from: 'a', to: 'd', status: 'confirmed' },
        { type: 'military_protection', from: 'b', to: 'e', status: 'confirmed' },
      ],
      stressors: [{ id: 'ws.auth.a', type: 'succession_crisis', severity: 0.75, affectedSettlementIds: ['a'] }],
    },
    // 2: prosperous resource region → resource depletion + tier drift
    {
      id: 'feed-resource', over: () => RESOURCE_TOWN,
      channels: [
        { type: 'trade_route', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'resource_competition', from: 'b', to: 'c', status: 'confirmed' },
        { type: 'trade_route', from: 'c', to: 'd', status: 'confirmed' },
        { type: 'resource_competition', from: 'd', to: 'e', status: 'confirmed' },
      ],
      stressors: [],
    },
    // 3: criminal underworld → criminal pressure + npc corruption news
    {
      id: 'feed-underworld', over: () => CRIMINAL_TOWN,
      channels: [
        { type: 'trade_dependency', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'trade_route', from: 'b', to: 'c', status: 'confirmed' },
        { type: 'political_authority', from: 'c', to: 'd', status: 'confirmed' },
        { type: 'military_protection', from: 'd', to: 'e', status: 'confirmed' },
      ],
      stressors: [{ id: 'ws.crime.c', type: 'racket', severity: 0.6, affectedSettlementIds: ['c'] }],
    },
    // 4: conflict frontier → conflict pressure + war news
    {
      id: 'feed-conflict', over: () => ({}),
      channels: [
        { type: 'war_front', from: 'a', to: 'b', status: 'confirmed' },
        { type: 'military_protection', from: 'b', to: 'c', status: 'confirmed' },
        { type: 'trade_route', from: 'c', to: 'd', status: 'confirmed' },
        { type: 'political_authority', from: 'd', to: 'e', status: 'confirmed' },
      ],
      stressors: [{ id: 'ws.war.a', type: 'war', severity: 0.8, affectedSettlementIds: ['a', 'b'] }],
    },
  ];
  const cfg = configs[index % configs.length];
  const saves = ids.map((id, i) => save(id, `${cfg.id}-${id.toUpperCase()}`, i + 1 + index * 7, cfg.over(id)));
  const campaign = {
    id: cfg.id,
    name: cfg.id,
    settlementIds: ids,
    worldState: { rngSeed: `${cfg.id}-seed`, tick: 0, stressors: cfg.stressors },
    regionalGraph: ensureRegionalGraph({ channels: cfg.channels }),
    wizardNews: { currentTick: 0, entries: [] },
  };
  return { campaign, saves };
}

/** The substantive TYPE of a news entry (impactKind), falling back to the transition. */
function typeOf(entry) {
  return entry.impactKind || entry.kind || 'unknown';
}

function runCampaign(index) {
  let { campaign, saves } = campaignFactory(index);
  for (let i = 0; i < TICKS; i++) {
    const result = advanceCampaignWorld({
      campaign,
      saves,
      interval: 'one_month',
      now: `2026-03-01T00:00:${String(i).padStart(2, '0')}.000Z`,
    });
    if (!result) break;
    campaign = { ...campaign, worldState: result.worldState, regionalGraph: result.regionalGraph, wizardNews: result.wizardNews };
    saves = saves.map(s => {
      const update = result.settlementUpdates.find(u => String(u.saveId) === String(s.id));
      return update ? { ...s, settlement: update.settlement } : s;
    });
  }
  return campaign.wizardNews?.entries || [];
}

describe('wizard news — feed distribution (anti-monoculture envelope)', () => {
  test(`no single news type exceeds ${ANTI_MONOCULTURE_GATE * 100}% of the feed across ${TICKS} ticks × 5 campaigns`, () => {
    const allEntries = [];
    for (let m = 0; m < 5; m++) allEntries.push(...runCampaign(m));

    // Alive: the corpus must actually produce a feed, or the gate is vacuous.
    expect(allEntries.length).toBeGreaterThan(20);

    const counts = new Map();
    for (const entry of allEntries) {
      const type = typeOf(entry);
      counts.set(type, (counts.get(type) || 0) + 1);
    }

    const total = allEntries.length;
    const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
    const [topType, topCount] = ranked[0];
    const topShare = topCount / total;

    // MEASURE: surface the distribution so a shift is legible in CI output.
    console.log('[feedDistribution] total=%d distinct-types=%d top=%s@%s%%  dist=%o',
      total, counts.size, topType, (topShare * 100).toFixed(1),
      Object.fromEntries(ranked.slice(0, 8).map(([t, c]) => [t, `${((c / total) * 100).toFixed(1)}%`])));

    // Diversity: more than one type is present (a single-type feed is the
    // pure monoculture failure).
    expect(counts.size).toBeGreaterThan(1);

    // The anti-monoculture gate.
    expect(topShare, `news type "${topType}" is ${(topShare * 100).toFixed(1)}% of the feed (> ${ANTI_MONOCULTURE_GATE * 100}%)`)
      .toBeLessThanOrEqual(ANTI_MONOCULTURE_GATE);
  });

  test('feed assembly is deterministic (same corpus → identical feed)', () => {
    const first = runCampaign(0).map(e => e.id);
    const second = runCampaign(0).map(e => e.id);
    expect(second).toEqual(first);
  });

  test('arc threading collapses a real feed into progressions (schema + coverage)', () => {
    // One campaign's feed — ids are unique within a feed (appendWizardNewsEntries
    // dedupes by id), and 30 ticks give the same impact types recurring on the
    // same settlements, so multi-stage arcs form.
    const entries = runCampaign(0);
    const threads = deriveNewsThreads(entries);

    // Every entry lands in exactly one thread (partition, no loss, no dupes).
    const threadedIds = threads.flatMap(t => t.entries.map(e => e.id));
    expect(threadedIds.length).toBe(entries.length);
    expect(new Set(threadedIds).size).toBe(entries.length);

    // Arcs actually form: at least one thread has more than one stage.
    expect(threads.some(t => t.size > 1)).toBe(true);

    for (const thread of threads) {
      let priorCount = 0;
      for (const [i, entry] of thread.entries.entries()) {
        // Schema: entry.thread = { arcId, stage, priorEntryIds }.
        expect(entry.thread.arcId).toBe(thread.arcId);
        expect(entry.thread.stage).toBe(i + 1);
        expect(entry.thread.priorEntryIds).toHaveLength(priorCount);
        // priorEntryIds are exactly the earlier stages, in order.
        expect(entry.thread.priorEntryIds).toEqual(thread.entries.slice(0, i).map(e => e.id));
        priorCount += 1;
      }
      // Stages are chronological (tick non-decreasing) and head is the latest.
      const ticks = thread.entries.map(e => e.tick);
      expect(ticks).toEqual([...ticks].sort((a, b) => a - b));
      expect(thread.head).toBe(thread.entries[thread.entries.length - 1]);
    }

    // Determinism: same entries → identical arc ordering.
    expect(deriveNewsThreads(entries).map(t => t.arcId)).toEqual(threads.map(t => t.arcId));
  });
});
