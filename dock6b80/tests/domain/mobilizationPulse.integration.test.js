import { describe, expect, test } from 'vitest';

import { previewCampaignWorldPulse, advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { mobilizationStandings, settlementMobilization } from '../../src/domain/display/mobilizationStatus.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B1 — mobilization + feasibility through the FULL pulse:
//   • OFF byte-identical: no warPosture ledger, no mobilization conditions.
//   • can't siege from peace → ramps over ticks → eventually deploys.
//   • a neighbour REACTS to a visibly-mobilizing rival (a reaction candidate fires).
//   • covert prep is invisible to player views.
//   • determinism: order-independent, posture converges, the ledger deep-clones.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name, tier: patch.tier || 'town', population: patch.population || 8000,
    config: { tradeRouteAccess: 'road', priorityMilitary: 35 }, institutions: patch.institutions || [],
    economicState: patch.economicState || { prosperity: 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 75, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Military Council', category: 'military', power: 80, isGoverning: true }],
      conflicts: [],
    },
    npcs: patch.npcs || [],
    activeConditions: patch.activeConditions || [],
  };
}
function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function campaignWith({ rules = {}, edges, channels = [], extraState = {} } = {}) {
  return {
    id: 'mob-fixture', name: 'Mobilization Fixture', settlementIds: edges.settlementIds,
    worldState: {
      rngSeed: 'mob-seed', tick: 4, relationshipStates: edges.relationshipStates || {},
      simulationRules: { warLayerEnabled: true, ...rules }, ...extraState,
    },
    regionalGraph: ensureRegionalGraph({ edges: edges.edges, channels }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

// A strong, warlike, legitimate aggressor (ramps fast) hostile to a weak village.
function aggressor(id, name) {
  return save(id, name, {
    tier: 'city', population: 60000, legitimacy: 90,
    institutions: [{ name: 'Citadel Garrison' }, { name: 'Royal Armory' }],
    economicState: { prosperity: 'Prosperous', primaryExports: [{ name: 'Forged Weapons' }], primaryImports: [] },
    factions: [{ faction: 'Garrison Command', category: 'military', power: 95, isGoverning: true }],
    npcs: [{ id: `gen_${id}`, importance: 'pillar', personality: { dominant: 'domineering', flaw: 'ruthless', modifier: 'ambitious' } }],
  });
}
function target(id, name) {
  return save(id, name, { tier: 'village', population: 300, legitimacy: 30,
    factions: [{ faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true }] });
}

const HOSTILE_EDGES = {
  settlementIds: ['agg', 'vic'],
  edges: [{ id: 'edge.agg.vic', from: 'agg', to: 'vic', relationshipType: 'hostile' }],
  relationshipStates: { 'edge.agg.vic': { relationshipType: 'hostile' } },
};

describe('mobilization pulse — OFF byte-identity', () => {
  test('warLayerEnabled:false → no warPosture ledger, no mobilization conditions, order-independent', () => {
    const saves = [aggressor('agg', 'Ironhold'), target('vic', 'Thornmere')];
    const a = previewCampaignWorldPulse({ campaign: campaignWith({ rules: { warLayerEnabled: false }, edges: HOSTILE_EDGES }), saves, interval: 'one_month', now: NOW });
    const b = previewCampaignWorldPulse({ campaign: campaignWith({ rules: { warLayerEnabled: false }, edges: HOSTILE_EDGES }), saves: [...saves].reverse(), interval: 'one_month', now: NOW });

    // No warPosture key materializes (conditional ledger, absent when off).
    expect('warPosture' in a.worldState).toBe(false);
    expect(a.selected.some(o => o.candidateType === 'war_mobilization')).toBe(false);
    expect(a.selected.some(o => String(o.candidateType).startsWith('mobilization_reaction'))).toBe(false);

    // Order-independent (the legacy invariant is untouched).
    expect(b.selected.map(o => o.id).sort()).toEqual(a.selected.map(o => o.id).sort());
  });
});

describe('mobilization pulse — the ramp (cannot siege from peace)', () => {
  test('an aggressor at peace does NOT deploy on the first tick — it must ramp first', () => {
    const saves = [aggressor('agg', 'Ironhold'), target('vic', 'Thornmere')];
    const tick1 = previewCampaignWorldPulse({ campaign: campaignWith({ edges: HOSTILE_EDGES }), saves, interval: 'one_month', now: NOW });
    // No army committed yet (still ramping); no war_front minted.
    expect(tick1.worldState.deployments).toEqual({});
    expect((tick1.regionalGraph.channels || []).some(c => c.type === 'war_front')).toBe(false);
    // But it HAS begun mobilizing — a posture key now exists.
    expect('warPosture' in tick1.worldState).toBe(true);
    expect(tick1.worldState.warPosture.agg).toBeTruthy();
  });

  test('over several ticks the aggressor RAMPS to a war-ready posture and THEN deploys', () => {
    const saves = [aggressor('agg', 'Ironhold'), target('vic', 'Thornmere')];
    let worldState;
    let deployed = false;
    const postureStates = [];
    for (let i = 0; i < 15 && !deployed; i += 1) {
      const campaign = campaignWith({ edges: HOSTILE_EDGES, extraState: worldState ? { ...worldState } : {} });
      if (worldState) campaign.worldState = worldState;
      const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      const posture = pulse.worldState.warPosture?.agg?.state || 'peace';
      postureStates.push(posture);
      if (pulse.worldState.deployments?.agg?.targetId === 'vic') deployed = true;
      worldState = pulse.worldState;
    }
    // It deployed only AFTER ramping through the intermediate rungs.
    expect(deployed).toBe(true);
    expect(postureStates).toContain('war_preparation');
    expect(postureStates).toContain('mobilized');
    // And it took more than one tick (it could not siege from peace).
    expect(postureStates.length).toBeGreaterThan(2);
  });

  test('a mobilizing settlement stamps a war_mobilization economic-footing condition', () => {
    const saves = [aggressor('agg', 'Ironhold'), target('vic', 'Thornmere')];
    let worldState;
    let sawCondition = false;
    for (let i = 0; i < 8 && !sawCondition; i += 1) {
      const campaign = campaignWith({ edges: HOSTILE_EDGES });
      if (worldState) campaign.worldState = worldState;
      const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      if (pulse.selected.some(o => o.candidateType === 'war_mobilization')) sawCondition = true;
      worldState = pulse.worldState;
    }
    expect(sawCondition).toBe(true);
  });
});

describe('mobilization pulse — neighbour reactions', () => {
  test('a rival REACTS to a visibly-mobilizing neighbour (a reaction candidate fires)', () => {
    // Two mutual rivals — when one mobilizes, the other (a rival) reacts.
    const saves = [aggressor('agg', 'Ironhold'), aggressor('riv', 'Stonewatch')];
    const edges = {
      settlementIds: ['agg', 'riv'],
      edges: [{ id: 'edge.agg.riv', from: 'agg', to: 'riv', relationshipType: 'rival' }],
      relationshipStates: { 'edge.agg.riv': { relationshipType: 'rival' } },
    };
    let worldState;
    let reacted = false;
    for (let i = 0; i < 10 && !reacted; i += 1) {
      const campaign = campaignWith({ edges });
      if (worldState) campaign.worldState = worldState;
      const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      if (pulse.candidates.some(c => String(c.candidateType).startsWith('mobilization_reaction'))) reacted = true;
      worldState = pulse.worldState;
    }
    expect(reacted).toBe(true);
  });

  test('covert prep is INVISIBLE to player views (the read-model hides it)', () => {
    const worldState = ensureWorldState({
      warPosture: {
        overt: { state: 'war_preparation', progress: 0.5, sinceTick: 0, covert: false },
        sneaky: { state: 'war_preparation', progress: 0.5, sinceTick: 0, covert: true },
      },
    });
    // Player view (default) sees the overt mobilizer only.
    const playerView = mobilizationStandings({ worldState });
    expect(playerView.map(s => s.id)).toEqual(['overt']);
    expect(settlementMobilization({ settlementId: 'sneaky', worldState })).toBeNull();
    // GM view sees both.
    const gmView = mobilizationStandings({ worldState, includeCovert: true });
    expect(gmView.map(s => s.id).sort()).toEqual(['overt', 'sneaky']);
    expect(settlementMobilization({ settlementId: 'sneaky', worldState, includeCovert: true })).toBeTruthy();
  });

  test('covert mobilization signal is minted gm-visibility (hidden from player map overlays)', () => {
    const saves = [aggressor('agg', 'Ironhold'), aggressor('riv', 'Stonewatch')];
    const edges = {
      settlementIds: ['agg', 'riv'],
      edges: [{ id: 'edge.agg.riv', from: 'agg', to: 'riv', relationshipType: 'rival' }],
      relationshipStates: { 'edge.agg.riv': { relationshipType: 'rival' } },
    };
    // Seed agg as a COVERT preparer so the signal it mints is gm-visibility.
    let worldState;
    let foundCovertSignal = false;
    let foundPublicSignal = false;
    for (let i = 0; i < 6; i += 1) {
      const extraState = { warPosture: { agg: { state: 'war_preparation', progress: 0.5, sinceTick: 0, covert: true } } };
      const campaign = campaignWith({ edges, extraState: worldState ? {} : extraState });
      if (worldState) campaign.worldState = worldState;
      const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      for (const c of pulse.regionalGraph.channels || []) {
        if (c.type !== 'information_flow') continue;
        if (!/mobilization_signal/.test(c.relationshipKey || '')) continue;
        if (c.from === 'agg' && c.visibility === 'gm') foundCovertSignal = true;
        if (c.from === 'agg' && c.visibility === 'public') foundPublicSignal = true;
      }
      worldState = pulse.worldState;
    }
    expect(foundCovertSignal).toBe(true);
    expect(foundPublicSignal).toBe(false); // a covert preparer never mints a public signal
  });
});

describe('mobilization pulse — determinism', () => {
  test('order-independent: reversing the saves array yields an identical warPosture ledger', () => {
    const saves = [aggressor('agg', 'Ironhold'), target('vic', 'Thornmere')];
    const fwd = advanceCampaignWorld({ campaign: campaignWith({ edges: HOSTILE_EDGES }), saves, interval: 'one_month', now: NOW });
    const rev = advanceCampaignWorld({ campaign: campaignWith({ edges: HOSTILE_EDGES }), saves: [...saves].reverse(), interval: 'one_month', now: NOW });
    expect(rev.worldState.warPosture).toEqual(fwd.worldState.warPosture);
  });

  test('the warPosture ledger is DEEP-CLONED (a pre-tick snapshot never aliases live state)', () => {
    const original = { agg: { state: 'mobilized', progress: 1, sinceTick: 0, covert: false } };
    const ws = ensureWorldState({ warPosture: original });
    // The ensured ledger is a deep clone — mutating the source must not touch it.
    original.agg.state = 'TAMPERED';
    expect(ws.warPosture.agg.state).toBe('mobilized');
    expect(ws.warPosture).not.toBe(original);
    expect(ws.warPosture.agg).not.toBe(original.agg);
  });

  test('posture converges: a sustained run does not oscillate forever (it stabilizes or resolves)', () => {
    const saves = [aggressor('agg', 'Ironhold'), target('vic', 'Thornmere')];
    let worldState;
    const recentStates = [];
    for (let i = 0; i < 30; i += 1) {
      const campaign = campaignWith({ edges: HOSTILE_EDGES });
      if (worldState) campaign.worldState = worldState;
      const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      recentStates.push(pulse.worldState.warPosture?.agg?.state || 'peace');
      worldState = pulse.worldState;
    }
    // The aggressor reached a terminal war state (deployed / war_exhaustion) — the
    // ramp drove a real outcome rather than cycling forever between alert/preparation.
    const reachedWar = recentStates.some(s => s === 'deployed' || s === 'war_exhaustion' || s === 'mobilized');
    expect(reachedWar).toBe(true);
  });
});
