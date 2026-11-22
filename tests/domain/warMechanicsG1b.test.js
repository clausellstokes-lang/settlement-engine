import { describe, expect, test } from 'vitest';

import { advanceMartialReadiness } from '../../src/domain/worldPulse/martialReadiness.js';
import { advanceArmyTransit } from '../../src/domain/worldPulse/armyTransitKernel.js';
import { armyRecordOf, ARMY_ROLES } from '../../src/domain/spatial/armyTransit.js';
import { setSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { evaluateWarLayer } from '../../src/domain/worldPulse/warDeployment.js';
import { evaluateOccupations } from '../../src/domain/worldPulse/occupation.js';
import { evaluateMobilization } from '../../src/domain/worldPulse/mobilization.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { createPRNG } from '../../src/kernel/prng.js';

// ─────────────────────────────────────────────────────────────────────────────
// G1b — "WAR MECHANICS." Pins for the six physical-war-layer fixes:
//   worldpulse-war-1   engagement reads ACTUAL siege, not own mobilization posture
//   spatial-engine-3   the field-battle loser RETREATS (dead retreatRoute wired)
//   spatial-engine-4   the courier umbilical is READ (fog stamps a battle receipt)
//   worldpulse-war-8   defenders BANK disposition wins (siege survived / occupation thrown off)
//   worldpulse-war-9   occupation CONSTRAINS the occupied town's own war machine
//   worldpulse-war-7   deployments on a vanished party RESOLVE (no immortal siege)
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: patch.institutions || [],
    economicState: { prosperity: patch.prosperity || 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [
        { faction: 'Military Council', category: 'military', power: 78, isGoverning: true },
        { faction: 'Merchant League', category: 'merchant', power: 52 },
      ],
      conflicts: [],
    },
    npcs: patch.npcs || [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: patch.activeConditions || [],
  };
}
const save = (id, name, patch = {}) => ({ id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } });
const strongSave = (id, name, patch = {}) => save(id, name, { tier: 'city', population: 48000, ...patch });
const weakSave = (id, name, patch = {}) => save(id, name, {
  tier: 'village', population: 260, legitimacy: 24,
  factions: [{ faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true }, { faction: 'Hedge Wardens', category: 'military', power: 20 }],
  ...patch,
});

// ─────────────────────────────────────────────────────────────────────────────
// worldpulse-war-1 — posture ≠ engagement (the strategic-rust axis restored)
// ─────────────────────────────────────────────────────────────────────────────
describe('worldpulse-war-1 — mobilized posture no longer grants siege-grade experience', () => {
  const PATRON = { alignmentAxis: 'neutral', lawAxis: 'neutral', name: 'The Balance' };

  test('a MOBILIZED-but-not-besieged town rusts (experience ≈ 0); an actually-BESIEGED town is sharp (≈ 0.9)', () => {
    const religionStates = {
      poser: { patronRef: 'd', deities: { d: { snapshot: PATRON } } },   // mobilized, no siege
      sieged: { patronRef: 'd', deities: { d: { snapshot: PATRON } } },  // actually besieged
    };
    // A LIVE war-layer front INTO `sieged` (a real siege); NONE into `poser`.
    const regionalGraph = ensureRegionalGraph({
      edges: [{ id: 'edge.foe.sieged', from: 'foe', to: 'sieged', relationshipType: 'hostile' }],
      channels: [{ type: 'war_front', from: 'foe', to: 'sieged', status: 'confirmed' }],
    });
    const snapshot = { byId: new Map(), regionalGraph };
    const worldState = {
      regionalGraph,
      warPosture: { poser: { state: 'mobilized' } },   // POSTURING — never a sword drawn
      warExhaustion: {}, deployments: {}, occupations: {},
    };
    const out = advanceMartialReadiness({ snapshot, worldState, religionStates, pietyByCid: {}, priorMartial: null });
    expect(out.martialByCid).toBeTruthy();
    // The poser materializes a record (mobilized footing lifts readiness) but its
    // experience is ~0 — posturing is NOT combat, so RUST is near-maximal.
    expect(out.martialByCid.poser.experience01).toBeLessThanOrEqual(0.1);
    // The besieged town endured a real siege ⇒ sharp experience (ENGAGE_BESIEGED 0.9).
    expect(out.martialByCid.sieged.experience01).toBeGreaterThanOrEqual(0.85);
    // The whole point: the two axes diverge — posture did not buy experience.
    expect(out.martialByCid.sieged.experience01).toBeGreaterThan(out.martialByCid.poser.experience01);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// spatial-engine-3 — the field-battle loser retreats (and its deployment withdraws)
// ─────────────────────────────────────────────────────────────────────────────
describe('spatial-engine-3 — the beaten army retreats home instead of re-fighting', () => {
  // atlas — marka — borin, both directions. Two armies cross at marka.
  const lineDigest = () => ({
    spatialCanonVersion: 1,
    settlementIds: ['atlas', 'marka', 'borin'],
    gates: [{ between: ['atlas', 'marka'], cost: 100 }, { between: ['marka', 'borin'], cost: 100 }],
    distanceMatrix: { atlas: { marka: 100, borin: 200 }, marka: { atlas: 100, borin: 100 }, borin: { marka: 100, atlas: 200 } },
    tiers: { atlas: { marka: 1, borin: 1 }, marka: { atlas: 1, borin: 1 }, borin: { marka: 1, atlas: 1 } },
  });
  const snapshot = {
    byId: { get: (id) => ({ id, name: String(id), causal: { scores: { economic_capacity: 60 } } }) },
    settlements: [{ id: 'atlas' }, { id: 'borin' }],
  };
  // Seed both columns mid-route (position 0.5 ⇒ currentRegion 'marka') so the loser has a
  // real road home to retreat down. A CLAMP-decisive 5:1 edge ⇒ borin loses every roll.
  function midRouteWorld() {
    let ws = { spatialCanonVersion: 1, simulationRules: { warLayerEnabled: true, infoMode: 'omniscient' },
      deployments: {
        atlas: { targetId: 'borin', sinceTick: 0, currentEffectiveStrength: 200, readiness: 0.7 },
        borin: { targetId: 'atlas', sinceTick: 0, currentEffectiveStrength: 40, readiness: 0.5 },
      } };
    ws = setSpatialLedger(ws, 'armyTransit', {
      atlas: armyRecordOf({ armyId: 'atlas', role: 'reinforcement', originId: 'atlas', destId: 'borin', path: ['atlas', 'marka', 'borin'], departTick: 0, arrivalTick: 4, position01: 0.5, strength: 200, readiness: 0.7, supplyQuality: 1, funding: 0.6, beliefStaleness: 0, lastTick: 1 }),
      borin: armyRecordOf({ armyId: 'borin', role: 'reinforcement', originId: 'borin', destId: 'atlas', path: ['borin', 'marka', 'atlas'], departTick: 0, arrivalTick: 4, position01: 0.5, strength: 40, readiness: 0.5, supplyQuality: 1, funding: 0.6, beliefStaleness: 0, lastTick: 1 }),
    });
    return ws;
  }

  test('the loser is re-rolled to RETREAT toward home and its deployment is flagged for withdrawal', () => {
    const out = advanceArmyTransit({ snapshot, worldState: midRouteWorld(), digest: lineDigest(), graph: {}, rng: createPRNG('k'), season: null, tick: 2, now: NOW });
    expect(out.newsEntries.some(n => n.impactKind === 'field_battle')).toBe(true);
    const ledger = out.worldState.spatialLedgers.armyTransit;
    // The beaten column (borin) now RETREATS home; the winner (atlas) keeps marching.
    expect(ledger.borin.role).toBe(ARMY_ROLES.RETREAT);
    expect(ledger.borin.destId).toBe('borin');
    expect(ledger.atlas.role).not.toBe(ARMY_ROLES.RETREAT);
    // Its deployment carries the withdrawal recall the war layer executes next tick.
    expect(out.worldState.deployments.borin.recalled).toBeTruthy();
    expect(out.worldState.deployments.borin.recalled.cause).toBe('field_battle_retreat');
    expect(out.worldState.deployments.atlas.recalled).toBeUndefined();
  });

  test('the war layer EXECUTES a field-battle recall as a homecoming (no re-fight, no phantom conquest)', () => {
    const EDGE = { id: 'edge.borin.atlas', from: 'borin', to: 'atlas', relationshipType: 'hostile' };
    const graph = ensureRegionalGraph({ edges: [EDGE], channels: [] });
    const worldState = {
      rngSeed: 'w', tick: 3, simulationRules: { warLayerEnabled: true },
      relationshipStates: { [EDGE.id]: { relationshipType: 'hostile' } },
      deployments: { borin: { targetId: 'atlas', sinceTick: 0, role: 'siege', recalled: { cause: 'field_battle_retreat', tick: 2 } } },
    };
    const saves = [strongSave('atlas', 'Atlas'), weakSave('borin', 'Borin')];
    const snap = buildWorldSnapshot({ campaign: { id: 'w', settlementIds: ['atlas', 'borin'], worldState, regionalGraph: graph, wizardNews: { currentTick: 3, entries: [] } }, saves, worldState });
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('w'), tick: 3, now: NOW, rules: { warLayerEnabled: true } });
    expect(war.resolvedDeployments).toContainEqual(expect.objectContaining({ attackerId: 'borin', targetId: 'atlas', outcome: 'withdrawal' }));
    expect(war.deployments.borin).toBeUndefined();
    expect(war.outcomes.some(o => o.candidateType === 'conquest')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// spatial-engine-4 — the courier umbilical is READ (fought-blind receipt)
// ─────────────────────────────────────────────────────────────────────────────
describe('spatial-engine-4 — an info-starved column fights half-blind (the fog is read, not discarded)', () => {
  const lineDigest = () => ({
    spatialCanonVersion: 1,
    settlementIds: ['atlas', 'marka', 'borin'],
    gates: [{ between: ['atlas', 'marka'], cost: 100 }, { between: ['marka', 'borin'], cost: 100 }],
    distanceMatrix: { atlas: { marka: 100, borin: 200 }, marka: { atlas: 100, borin: 100 }, borin: { marka: 100, atlas: 200 } },
    tiers: { atlas: { marka: 1, borin: 1 }, marka: { atlas: 1, borin: 1 }, borin: { marka: 1, atlas: 1 } },
  });
  const snapshot = {
    byId: { get: (id) => ({ id, name: String(id), causal: { scores: { economic_capacity: 60 } } }) },
    settlements: [{ id: 'atlas' }, { id: 'borin' }],
  };
  function crossingWorld(borinStaleness) {
    let ws = { spatialCanonVersion: 1, simulationRules: { warLayerEnabled: true, infoMode: 'unreliable' },
      deployments: {
        atlas: { targetId: 'borin', sinceTick: 0, currentEffectiveStrength: 200, readiness: 0.7 },
        borin: { targetId: 'atlas', sinceTick: 0, currentEffectiveStrength: 40, readiness: 0.5 },
      } };
    ws = setSpatialLedger(ws, 'armyTransit', {
      atlas: armyRecordOf({ armyId: 'atlas', role: 'reinforcement', originId: 'atlas', destId: 'borin', path: ['atlas', 'marka', 'borin'], departTick: 0, arrivalTick: 4, position01: 0.5, strength: 200, readiness: 0.7, supplyQuality: 1, funding: 0.6, beliefStaleness: 0, lastTick: 1 }),
      borin: armyRecordOf({ armyId: 'borin', role: 'reinforcement', originId: 'borin', destId: 'atlas', path: ['borin', 'marka', 'atlas'], departTick: 0, arrivalTick: 4, position01: 0.5, strength: 40, readiness: 0.5, supplyQuality: 1, funding: 0.6, beliefStaleness: borinStaleness, lastTick: 1 }),
    });
    return ws;
  }
  // A confirmed war-layer front INTO borin ⇒ borin's route home is CUT ⇒ its staleness holds.
  const cutGraph = { channels: [{ type: 'war_front', status: 'confirmed', from: 'atlas', to: 'borin' }] };

  test('a deep-fog combatant stamps a fought_blind receipt — while the TRUE strengths still decide it', () => {
    const out = advanceArmyTransit({ snapshot, worldState: crossingWorld(8), digest: lineDigest(), graph: cutGraph, rng: createPRNG('k'), season: null, tick: 2, now: NOW });
    const battle = out.newsEntries.find(n => n.impactKind === 'field_battle');
    expect(battle).toBeTruthy();
    expect(battle.tags).toContain('fought_blind');
    expect(battle.reasons.some(r => /half-blind/.test(String(r)))).toBe(true);
    // Physics unchanged: the 5:1 favourite (atlas) still breaks the weaker column.
    expect(String(battle.headline)).toMatch(/^atlas/);
  });

  test('byte-safe: a fresh-courier battle (no staleness) carries NO fought_blind receipt', () => {
    const out = advanceArmyTransit({ snapshot, worldState: crossingWorld(0), digest: lineDigest(), graph: cutGraph, rng: createPRNG('k'), season: null, tick: 2, now: NOW });
    const battle = out.newsEntries.find(n => n.impactKind === 'field_battle');
    expect(battle).toBeTruthy();
    expect(battle.tags).not.toContain('fought_blind');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// worldpulse-war-8 — defenders bank disposition wins
// ─────────────────────────────────────────────────────────────────────────────
describe('worldpulse-war-8 — a survived siege / thrown-off occupation credits the defender', () => {
  test('a besieger that breaks off an infeasible siege banks a LOSS — and the defender banks the WIN', () => {
    const EDGE = { id: 'edge.att.def', from: 'att', to: 'def', relationshipType: 'hostile' };
    const graph = ensureRegionalGraph({ edges: [EDGE], channels: [{ type: 'war_front', from: 'att', to: 'def', status: 'confirmed' }] });
    const worldState = {
      rngSeed: 'w', tick: 8, simulationRules: { warLayerEnabled: true },
      relationshipStates: { [EDGE.id]: { relationshipType: 'hostile' } },
      // A weak village besieging a strong city → the feasibility gate forbids the siege → withdrawal.
      deployments: { att: { targetId: 'def', sinceTick: 1, role: 'siege', maxStartStrength: 100, currentEffectiveStrength: 60 } },
    };
    const saves = [weakSave('att', 'Thornlet'), strongSave('def', 'Bastion')];
    const snap = buildWorldSnapshot({ campaign: { id: 'w', settlementIds: ['att', 'def'], worldState, regionalGraph: graph, wizardNews: { currentTick: 8, entries: [] } }, saves, worldState });
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('w'), tick: 8, now: NOW, rules: { warLayerEnabled: true } });
    // The siege was broken off (withdrawal), the attacker banked a loss...
    expect(war.resolvedDeployments).toContainEqual(expect.objectContaining({ attackerId: 'att', outcome: 'withdrawal' }));
    expect(war.dispositionDeltas).toContainEqual(expect.objectContaining({ id: 'att', outcome: 'loss' }));
    // ...and — the fix — the DEFENDER banked the win (exactly one, keyed on the target).
    const defWins = war.dispositionDeltas.filter(d => d.id === 'def' && d.outcome === 'win');
    expect(defWins.length).toBe(1);
    expect(defWins[0].magnitude).toBeGreaterThan(0);
    expect(defWins[0].magnitude).toBeLessThanOrEqual(0.8 + 1e-9);
  });

  test('an occupation thrown off by resistance credits the OCCUPIED town a win (not only the occupier a loss)', () => {
    const saves = [strongSave('occupier', 'Grimhold'), strongSave('town', 'Freeport', { population: 52000, legitimacy: 72 })];
    const graph = ensureRegionalGraph({ edges: [], channels: [] });   // no garrison front ⇒ occupier not present
    const worldState = {
      tick: 10, simulationRules: { warLayerEnabled: true },
      // A contested occupation with entrenched resistance and no garrison ⇒ suitability collapses ⇒ liberation.
      occupations: { town: { occupierId: 'occupier', state: 'contested', resistance: 0.95, sinceTick: 0, stateHeld: 0, benefitYield: 0, lastTick: 0 } },
    };
    const snap = buildWorldSnapshot({ campaign: { id: 'o', settlementIds: ['occupier', 'town'], worldState, regionalGraph: graph, wizardNews: { currentTick: 10, entries: [] } }, saves, worldState });
    const occ = evaluateOccupations({ snapshot: snap, worldState: snap.worldState, graph: snap.regionalGraph, deployments: {}, warOutcomes: [], returnOutcomes: [], tick: 10, rules: { warLayerEnabled: true } });
    // The occupation collapsed (dropped from the ledger)...
    expect(occ.occupations.town).toBeUndefined();
    // ...the occupier banked a loss AND the liberated town banked the win.
    expect(occ.dispositionDeltas).toContainEqual(expect.objectContaining({ id: 'occupier', outcome: 'loss' }));
    expect(occ.dispositionDeltas).toContainEqual(expect.objectContaining({ id: 'town', outcome: 'win' }));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// worldpulse-war-9 — occupation constrains the occupied town's war machine
// ─────────────────────────────────────────────────────────────────────────────
describe('worldpulse-war-9 — an occupied town cannot besiege third parties (only its occupier)', () => {
  function occupiedAttackerWorld(hostileTargetId, occupierId) {
    const saves = [strongSave('occTown', 'Vantar'), weakSave('victim', 'Reedmoor'), weakSave('occupier', 'Ashfall')];
    const edges = [{ id: `edge.occTown.${hostileTargetId}`, from: 'occTown', to: hostileTargetId, relationshipType: 'hostile' }];
    const worldState = {
      rngSeed: 'w', tick: 6, simulationRules: { warLayerEnabled: true },
      warPosture: { occTown: { state: 'mobilized', progress: 1, sinceTick: 1 } },
      relationshipStates: { [`edge.occTown.${hostileTargetId}`]: { relationshipType: 'hostile' } },
      occupations: { occTown: { occupierId, state: 'contested', sinceTick: 1, resistance: 0.35, stateHeld: 0, benefitYield: 0, lastTick: 0 } },
      deployments: {},
    };
    const graph = ensureRegionalGraph({ edges });
    const snap = buildWorldSnapshot({ campaign: { id: 'w', settlementIds: ['occTown', 'victim', 'occupier'], worldState, regionalGraph: graph, wizardNews: { currentTick: 6, entries: [] } }, saves, worldState });
    return evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('w'), tick: 6, now: NOW, rules: { warLayerEnabled: true } });
  }

  test('a garrisoned town does NOT open a siege on a hostile THIRD party', () => {
    const war = occupiedAttackerWorld('victim', 'occupier'); // hostile to a third party; occupied by someone else
    expect(war.deployments.occTown).toBeUndefined();
  });

  test('the uprising path stays open — it MAY march on its own occupier', () => {
    const war = occupiedAttackerWorld('occupier', 'occupier'); // hostile to (and occupied by) the SAME power
    expect(war.deployments.occTown).toBeDefined();
    expect(String(war.deployments.occTown.targetId)).toBe('occupier');
  });

  test('mobilization: a firmly-occupied (extractive) town COOLS its posture instead of ramping', () => {
    const saves = [strongSave('occTown', 'Vantar'), strongSave('free', 'Warforge')];
    const worldState = {
      tick: 6, simulationRules: { warLayerEnabled: true },
      warPosture: { occTown: { state: 'war_preparation', progress: 0.6, sinceTick: 1 }, free: { state: 'war_preparation', progress: 0.6, sinceTick: 1 } },
      occupations: { occTown: { occupierId: 'occupier', state: 'extractive', sinceTick: 1, resistance: 0.2, stateHeld: 3, benefitYield: 0, lastTick: 5 } },
      deployments: {},
    };
    const snap = buildWorldSnapshot({ campaign: { id: 'm', settlementIds: ['occTown', 'free'], worldState, regionalGraph: ensureRegionalGraph({ edges: [] }), wizardNews: { currentTick: 6, entries: [] } }, saves, worldState });
    const mob = evaluateMobilization({ snapshot: snap, worldState: snap.worldState, tick: 6, wantsWarFor: () => true });
    const occEvent = mob.events.find(e => e.id === 'occTown');
    const freeEvent = mob.events.find(e => e.id === 'free');
    // The occupied town cools (occupier permits no war footing); the free town ramps toward war.
    expect(occEvent.cooled).toBe(true);
    expect(occEvent.reasons.some(r => /occupation/.test(String(r)))).toBe(true);
    expect(freeEvent.cooled).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// worldpulse-war-7 — deployments on a vanished party resolve cleanly
// ─────────────────────────────────────────────────────────────────────────────
describe('worldpulse-war-7 — a deployment whose party left the campaign resolves (no immortal siege)', () => {
  test('a VANISHED TARGET → the besieger withdraws home within one tick (deployment cleared)', () => {
    const saves = [strongSave('att', 'Ironhold')]; // 'ghost' target is absent from the roster
    const graph = ensureRegionalGraph({ edges: [], channels: [{ type: 'war_front', from: 'att', to: 'ghost', status: 'confirmed' }] });
    const worldState = {
      rngSeed: 'w', tick: 12, simulationRules: { warLayerEnabled: true },
      deployments: { att: { targetId: 'ghost', sinceTick: 1, role: 'siege', maxStartStrength: 100, currentEffectiveStrength: 90, deployedPopulation: 400 } },
    };
    const snap = buildWorldSnapshot({ campaign: { id: 'w', settlementIds: ['att'], worldState, regionalGraph: graph, wizardNews: { currentTick: 12, entries: [] } }, saves, worldState });
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('w'), tick: 12, now: NOW, rules: { warLayerEnabled: true } });
    expect(war.resolvedDeployments).toContainEqual(expect.objectContaining({ attackerId: 'att', targetId: 'ghost', outcome: 'withdrawal' }));
    expect(war.deployments.att).toBeUndefined();
  });

  test('a VANISHED ATTACKER → the ghost record is simply dropped (no home to return to)', () => {
    const saves = [strongSave('def', 'Bastion')]; // 'ghost' attacker is absent from the roster
    const graph = ensureRegionalGraph({ edges: [], channels: [] });
    const worldState = {
      rngSeed: 'w', tick: 12, simulationRules: { warLayerEnabled: true },
      deployments: { ghost: { targetId: 'def', sinceTick: 1, role: 'siege', currentEffectiveStrength: 80 } },
    };
    const snap = buildWorldSnapshot({ campaign: { id: 'w', settlementIds: ['def'], worldState, regionalGraph: graph, wizardNews: { currentTick: 12, entries: [] } }, saves, worldState });
    const war = evaluateWarLayer({ snapshot: snap, worldState: snap.worldState, rng: createPRNG('w'), tick: 12, now: NOW, rules: { warLayerEnabled: true } });
    expect(war.deployments.ghost).toBeUndefined();
    expect(war.resolvedDeployments.some(r => r.attackerId === 'ghost')).toBe(false);
  });
});
