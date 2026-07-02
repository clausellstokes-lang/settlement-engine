import { describe, expect, test } from 'vitest';

import { previewCampaignWorldPulse, applyWorldPulseOutcomes } from '../../src/domain/worldPulse/index.js';
import { advanceReligionStates } from '../../src/domain/worldPulse/religiousContest.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/generators/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// Feature D (R2) — the religion core: gradual pantheon driver + conversion
// spread + religious_authority mint. These pins target the LIVE driver
// (`advanceReligionStates`, the one pulseKernel mounts) — the legacy binary
// `evaluateReligiousContest` driver was removed as unmounted dead code.
//
// DOUBLE-GATE determinism contract under test:
//   - Religion ACTS only when BOTH simulationRules.religionDynamicsEnabled AND
//     the F2 activation gate (≥1 settlement carries config.primaryDeitySnapshot)
//     hold. Either false ⇒ pure no-op (no mint, no contest, no conversion) ⇒
//     byte-identical legacy.
//   - Every output iteration is codepoint-sorted (bearers, settlements, mint
//     endpoints); the re-embed copies an EMBEDDED snapshot (never customContent);
//     same-tick multi-spread is a commutative field-merge (union ids, max
//     severities).
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function deitySnapshot(name, { rank = 'minor', alignment = 'neutral', temper = 'neutral' } = {}) {
  return {
    _deityRef: `custom:lu_${name.toLowerCase()}`,
    name,
    alignmentAxis: alignment,
    temperamentAxis: temper,
    rankAxis: rank,
  };
}

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: {
      tradeRouteAccess: 'road',
      priorityEconomy: 30,
      priorityMilitary: 25,
      ...(patch.deity ? { primaryDeityRef: patch.deity._deityRef, primaryDeitySnapshot: patch.deity } : {}),
    },
    institutions: patch.institutions || [],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [{ faction: 'Council', category: 'civic', power: 60, isGoverning: true }],
      conflicts: [],
    },
    npcs: [],
    activeConditions: patch.activeConditions || [],
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

function religionCampaign(rulesPatch = {}, { settlementIds, edges = [], channels = [], extraState = {} } = {}) {
  return {
    id: 'religion-fixture',
    name: 'Religion Fixture',
    settlementIds,
    worldState: {
      rngSeed: 'religion-seed',
      tick: 4,
      simulationRules: { religionDynamicsEnabled: true, ...rulesPatch },
      ...extraState,
    },
    regionalGraph: ensureRegionalGraph({ edges, channels }),
    wizardNews: { currentTick: 4, entries: [] },
  };
}

function snapshotFor(campaign, saves) {
  return buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
}

// A strong major deity at A and B, both allied/trade-linked to a weak-faith
// convert C.
function contestFixture({ cHasDeity = false, edges } = {}) {
  const saves = [
    save('asource', 'Asource', { deity: deitySnapshot('Vael', { rank: 'major', alignment: 'good', temper: 'warlike' }) }),
    save('bsource', 'Bsource', { deity: deitySnapshot('Korl', { rank: 'major', alignment: 'evil', temper: 'warlike' }) }),
    save('cconv', 'Cconv', cHasDeity
      ? { deity: deitySnapshot('Faded', { rank: 'cult' }), legitimacy: 30 }
      : { legitimacy: 30 }),
  ];
  const defaultEdges = [
    { id: 'edge.asource.cconv', from: 'asource', to: 'cconv', relationshipType: 'allied' },
    { id: 'edge.bsource.cconv', from: 'bsource', to: 'cconv', relationshipType: 'trade_partner' },
  ];
  return { saves, edges: edges || defaultEdges, settlementIds: ['asource', 'bsource', 'cconv'] };
}

const rng = () => createPRNG('religion-contest');

function drive(campaign, saves, rules) {
  return advanceReligionStates({
    snapshot: snapshotFor(campaign, saves),
    worldState: campaign.worldState,
    tick: 4,
    now: NOW,
    rules,
    rng: rng(),
  });
}

describe('advanceReligionStates — DOUBLE GATE dormancy', () => {
  test('flag OFF ⇒ empties even with deities present (byte-identical no-op)', () => {
    const fx = contestFixture();
    const campaign = religionCampaign({ religionDynamicsEnabled: false }, fx);
    const result = drive(campaign, fx.saves, { religionDynamicsEnabled: false });
    expect(result.religionStates).toBeNull();
    expect(result.outcomes).toEqual([]);
    expect(result.graphChannels).toEqual([]);
  });

  test('flag ON but NO deity assigned ⇒ empties (activation gate short-circuits)', () => {
    const saves = [
      save('x', 'Xtown'), save('y', 'Ytown'), save('z', 'Ztown'),
    ];
    const edges = [
      { id: 'edge.x.z', from: 'x', to: 'z', relationshipType: 'allied' },
      { id: 'edge.y.z', from: 'y', to: 'z', relationshipType: 'trade_partner' },
    ];
    const campaign = religionCampaign({}, { settlementIds: ['x', 'y', 'z'], edges });
    const result = drive(campaign, saves, { religionDynamicsEnabled: true });
    expect(result.religionStates).toBeNull();
    expect(result.outcomes).toEqual([]);
    expect(result.graphChannels).toEqual([]);
  });
});

describe('advanceReligionStates — mints only under deity presence', () => {
  test('a deity-bearing settlement mints religious_authority along faith carriers; a deity-free graph mints none', () => {
    const fx = contestFixture();
    const campaign = religionCampaign({}, fx);
    const result = drive(campaign, fx.saves, { religionDynamicsEnabled: true });
    expect(result.graphChannels.length).toBeGreaterThan(0);
    expect(result.graphChannels.every(c => c.type === 'religious_authority')).toBe(true);
    // Mints originate at the deity-bearing sources, never at the deity-free convert.
    const froms = new Set(result.graphChannels.map(c => c.from));
    expect(froms.has('asource')).toBe(true);
    expect(froms.has('bsource')).toBe(true);
    expect(froms.has('cconv')).toBe(false);
  });
});

describe('advanceReligionStates — order independence', () => {
  test('reversing the saves + edges arrays yields identical religionStates + mints', () => {
    const fx = contestFixture();
    const fwdCampaign = religionCampaign({}, fx);
    const fwd = drive(fwdCampaign, fx.saves, { religionDynamicsEnabled: true });

    const revSaves = [...fx.saves].reverse();
    const revEdges = [...fx.edges].reverse();
    const revCampaign = religionCampaign({}, { settlementIds: [...fx.settlementIds].reverse(), edges: revEdges });
    const rev = drive(revCampaign, revSaves, { religionDynamicsEnabled: true });

    expect(JSON.stringify(fwd.religionStates)).toBe(JSON.stringify(rev.religionStates));

    const convertEmbeds = (r) => r.outcomes
      .filter(o => o.deityReembed)
      .map(o => ({ to: o.targetSaveId, deity: o.deityReembed.snapshot.name }))
      .sort((a, b) => (a.to < b.to ? -1 : a.to > b.to ? 1 : 0));
    expect(convertEmbeds(fwd)).toEqual(convertEmbeds(rev));

    const mintIds = (r) => r.graphChannels.map(c => c.id).sort();
    expect(mintIds(fwd)).toEqual(mintIds(rev));
  });
});

describe('advanceReligionStates — incumbency advantage', () => {
  test('a strong-orthodoxy settlement with its OWN major deity does NOT flip to a weaker challenger in one tick', () => {
    const saves = [
      save('weak', 'Weakcult', { deity: deitySnapshot('Murk', { rank: 'cult' }), legitimacy: 20 }),
      save('strong', 'Stronghold', {
        deity: deitySnapshot('Aegis', { rank: 'major' }),
        legitimacy: 90,
        institutions: [{ type: 'temple', classification: 'religious', name: 'Grand Temple' }],
        activeConditions: [{ archetype: 'religious_revival', severity: 0.6, affectedSystems: ['religious_authority'] }],
      }),
      save('mid', 'Midshrine', { deity: deitySnapshot('Lyte', { rank: 'minor' }) }),
    ];
    const edges = [
      { id: 'edge.weak.strong', from: 'weak', to: 'strong', relationshipType: 'trade_partner' },
      { id: 'edge.mid.strong', from: 'mid', to: 'strong', relationshipType: 'allied' },
    ];
    const campaign = religionCampaign({}, { settlementIds: ['weak', 'strong', 'mid'], edges });
    const result = drive(campaign, saves, { religionDynamicsEnabled: true });
    // The strong incumbent holds — no conversion lands on 'strong'.
    const flippedStrong = result.outcomes.find(o => o.deityReembed && o.targetSaveId === 'strong');
    expect(flippedStrong).toBeFalsy();
    expect(result.religionStates.strong.patronRef).toBe('custom:lu_aegis');
  });
});

describe('applyWorldPulse — same-tick multi-seat conversion is a commutative field-merge', () => {
  // Two conversion outcomes that SEED the SAME religious_conversion_fracture
  // record (same id) within one apply pass — modelling two seats converting to
  // the same faith in one tick. The apply-side merge must be commutative: union
  // of affectedSettlementIds, MAX of severities. Reversing the outcome order must
  // yield a byte-identical merged record.
  function settlementMapFor(ids) {
    return new Map(ids.map(id => [id, {
      saveId: id, save: { name: id }, settlement: { name: id, config: {}, institutions: [], activeConditions: [] },
    }]));
  }
  function conversionStressorOutcome(id, severity, affected, severityBySettlement) {
    return {
      id: `conv.${id}`, type: 'stressor', candidateType: 'stressor_birth_religious_conversion_fracture',
      applyMode: 'auto', probability: 1, targetSaveId: id, severity,
      stressor: {
        id: 'world_stressor.religious_conversion_fracture.shared',
        type: 'religious_conversion_fracture', severity,
        affectedSettlementIds: affected, severityBySettlement,
      },
    };
  }
  function applyTwo(outcomes) {
    const ids = ['m', 'n', 'o'];
    return applyWorldPulseOutcomes({
      snapshot: { regionalGraph: { edges: [], channels: [] }, settlements: ids.map(id => ({ id, settlement: { name: id } })), campaign: {} },
      worldState: { stressors: [], npcStates: {}, proposals: [] },
      regionalGraph: { edges: [], channels: [] },
      settlementMap: settlementMapFor(ids),
      outcomes, tick: 10, now: NOW,
      advanceNewsTick: false, advanceRegionalImpacts: false,
    });
  }

  test('reversing the apply order yields an identical merged stressor record', () => {
    const a = conversionStressorOutcome('m', 0.5, ['m'], { m: 0.5 });
    const b = conversionStressorOutcome('n', 0.8, ['n'], { n: 0.8 });

    const fwd = applyTwo([a, b]).worldState.stressors.find(s => s.id === 'world_stressor.religious_conversion_fracture.shared');
    const rev = applyTwo([b, a]).worldState.stressors.find(s => s.id === 'world_stressor.religious_conversion_fracture.shared');

    expect(fwd).toBeTruthy();
    // UNION of affected ids (codepoint-sorted), MAX of severities.
    expect(fwd.affectedSettlementIds.sort()).toEqual(['m', 'n']);
    expect(fwd.severity).toBe(0.8);
    expect(fwd.severityBySettlement).toEqual({ m: 0.5, n: 0.8 });
    // Commutative: reversing the order is byte-identical (modulo nothing).
    expect(JSON.stringify(fwd)).toBe(JSON.stringify(rev));
  });
});

describe('previewCampaignWorldPulse — full pulse wiring', () => {
  test('a conversion sticks: the convert config.primaryDeitySnapshot becomes the winner', () => {
    const fx = contestFixture({ cHasDeity: false });
    const campaign = religionCampaign({}, fx);
    const pulse = previewCampaignWorldPulse({
      campaign, saves: fx.saves, interval: 'one_month', now: NOW,
    });
    const cUpdate = pulse.settlementUpdates.find(u => u.saveId === 'cconv');
    expect(cUpdate).toBeTruthy();
    const snap = cUpdate.settlement.config.primaryDeitySnapshot;
    expect(snap).toBeTruthy();
    expect(['Vael', 'Korl']).toContain(snap.name);
    // The re-embed re-picks the exact field set (no foreign field leaks).
    expect(Object.keys(snap).sort()).toEqual(['_deityRef', 'alignmentAxis', 'name', 'rankAxis', 'temperamentAxis']);
  });

  test('DOUBLE-GATE: a deity-free campaign with the flag ON is byte-identical to flag OFF', () => {
    const freeSaves = [save('p', 'Ptown'), save('q', 'Qtown')];
    const freeEdges = [{ id: 'edge.p.q', from: 'p', to: 'q', relationshipType: 'allied' }];
    const base = { settlementIds: ['p', 'q'], edges: freeEdges };
    const on = previewCampaignWorldPulse({
      campaign: religionCampaign({ religionDynamicsEnabled: true }, base),
      saves: freeSaves, interval: 'one_month', now: NOW,
    });
    const off = previewCampaignWorldPulse({
      campaign: religionCampaign({ religionDynamicsEnabled: false }, base),
      saves: freeSaves, interval: 'one_month', now: NOW,
    });
    // No conversion outcomes either way, and no deity structure anywhere.
    expect(on.selected.filter(o => o.deityReembed)).toEqual([]);
    expect(off.selected.filter(o => o.deityReembed)).toEqual([]);
    const onChannels = on.regionalGraph.channels.filter(c => c.type === 'religious_authority');
    const offChannels = off.regionalGraph.channels.filter(c => c.type === 'religious_authority');
    expect(onChannels).toEqual([]);
    expect(offChannels).toEqual([]);
  });
});
