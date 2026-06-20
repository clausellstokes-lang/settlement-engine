import { describe, expect, test } from 'vitest';

import {
  createOccupationRecord,
  occupiedUsefulness,
  resistanceTarget,
  stabilizationSuitability,
  advanceResistance,
  advanceOccupationState,
  computeOccupierBenefit,
  computeOccupierBurden,
  freshConquestsFrom,
  liberatedIdsFrom,
  evaluateOccupations,
  OCCUPATION_TUNING,
} from '../../src/domain/worldPulse/occupation.js';
import { previewCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from './religionDormancy.byteIdentity.test.js';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B3 — occupation states + benefit/burden + resistance. THE SNOWBALL is the
// danger zone: the occupier-benefit loop must be CAPPED, DELAYED, CONDITIONAL — a
// soak proves an occupier CANNOT eat the map. Plus: the state machine (hysteresis,
// no 1-tick flips, slide-back under resistance), burden outweighing benefit for a
// contested occupation, overextension, determinism, and OFF byte-identity.
// ─────────────────────────────────────────────────────────────────────────────

const NOW = '2026-01-01T00:00:00.000Z';

// ── Snapshot helpers (modelled on warDeployment.test.js) ─────────────────────
function settlement(name, patch = {}) {
  return {
    name,
    tier: patch.tier || 'town',
    population: patch.population || 4000,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 35 },
    institutions: patch.institutions || [],
    economicState: { prosperity: patch.prosperity || 'Prosperous', primaryExports: patch.exports || [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 60, label: 'Stable' },
      factions: patch.factions || [
        { faction: 'Council', category: 'civic', power: 60, isGoverning: true },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: patch.activeConditions || [],
  };
}

function save(id, name, patch = {}) {
  return { id, name, phase: 'canon', settlement: settlement(name, patch), campaignState: { phase: 'canon', eventLog: [], locks: {} } };
}

function richCity(id, name, patch = {}) {
  return save(id, name, { tier: 'city', population: 50000, prosperity: 'Wealthy', ...patch });
}
function hamlet(id, name, patch = {}) {
  return save(id, name, { tier: 'hamlet', population: 120, prosperity: 'Struggling', legitimacy: 24, ...patch });
}

function snapshotForSaves(saves, { edges = [], channels = [], relationshipStates = {}, occupations } = {}) {
  const worldState = {
    rngSeed: 'occupation-seed', tick: 4, relationshipStates,
    ...(occupations ? { occupations } : {}),
  };
  const campaign = {
    id: 'occupation-fixture',
    settlementIds: saves.map(s => s.id),
    worldState,
    regionalGraph: ensureRegionalGraph({ edges, channels }),
  };
  return buildWorldSnapshot({ campaign, saves, worldState });
}

// A compliant-regime occupied item: an installed occupier faction + subdued locals.
function compliantItem(snapshot, id) {
  const item = snapshot.byId.get(id);
  return {
    ...item,
    settlement: {
      ...item.settlement,
      powerStructure: {
        ...item.settlement.powerStructure,
        factions: [
          { faction: 'Occupation Authority', category: 'military', power: 90, modifiers: ['occupier'] },
          { faction: 'Council', category: 'civic', power: 20, isGoverning: true, modifiers: ['occupied'] },
        ],
      },
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
describe('occupation — OFF byte-identity', () => {
  test('evaluateOccupations is a pure no-op when warLayerEnabled is false', () => {
    const snapshot = snapshotForSaves([richCity('a', 'Ironhold'), hamlet('b', 'Thornmere')]);
    const existing = { b: createOccupationRecord('a', 3) };
    const out = evaluateOccupations({
      snapshot, worldState: { occupations: existing }, graph: snapshot.regionalGraph,
      deployments: {}, warOutcomes: [], returnOutcomes: [], tick: 4, rules: { warLayerEnabled: false },
    });
    expect(out.outcomes).toEqual([]);
    expect(out.occupations).toBe(existing); // untouched reference
    expect(out.dispositionDeltas).toEqual([]);
  });

  test('a full pulse with no conquests carries NO occupations key (byte-neutral under the dormancy oracle)', () => {
    const saves = [save('a', 'Ironhold', { tier: 'town' }), save('b', 'Thornmere', { tier: 'town' })];
    const campaign = {
      id: 'occ-dormancy', name: 'Occ Dormancy',
      settlementIds: ['a', 'b'],
      worldState: { rngSeed: 'occ-seed', tick: 2, simulationRules: { warLayerEnabled: true }, relationshipStates: {} },
      regionalGraph: ensureRegionalGraph({ edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' }], channels: [] }),
      wizardNews: { currentTick: 2, entries: [] },
    };
    const a = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    const b = previewCampaignWorldPulse({ campaign, saves: [...saves].reverse(), interval: 'one_month', now: NOW });
    // No occupation was created → no occupations key materialized on either run.
    expect('occupations' in a.worldState).toBe(false);
    expect('occupations' in b.worldState).toBe(false);
    // Order-independent on the load-bearing surfaces (the canonical comparison: selected
    // ids + per-save settlements — pulseHistory.timeTicks carries a cosmetic save-list
    // order the canonical order-independence test also excludes).
    expect(a.selected.map(o => o.id).sort()).toEqual(b.selected.map(o => o.id).sort());
    const bySave = r => new Map(r.settlementUpdates.map(u => [String(u.saveId), normalizeForDormancy(u.settlement)]));
    for (const id of ['a', 'b']) {
      expect(bySave(b).get(id)).toEqual(bySave(a).get(id));
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('occupation — conquest detection + ledger seeding', () => {
  test('freshConquestsFrom reads conquest power_transfers; liberatedIdsFrom reads occupation_lifted', () => {
    const warOutcomes = [
      { type: 'power_transfer', targetSaveId: 'b', powerTransfer: { cause: 'conquest' }, condition: { causes: [{ source: 'a' }] } },
      { type: 'power_transfer', targetSaveId: 'c', powerTransfer: { cause: 'coup' }, condition: { causes: [{ source: 'x' }] } }, // not a conquest
    ];
    expect(freshConquestsFrom(warOutcomes)).toEqual([{ occupiedId: 'b', occupierId: 'a' }]);
    const returnOutcomes = [
      { targetSaveId: 'b', condition: { archetype: 'occupation_lifted' } },
      { targetSaveId: 'd', condition: { archetype: 'siege_lifted' } },
      { targetSaveId: 'e', condition: { archetype: 'war_drain' } }, // not a liberation
    ];
    const libs = liberatedIdsFrom(returnOutcomes);
    expect([...libs].sort()).toEqual(['b', 'd']);
  });

  test('a fresh conquest seeds a CONTESTED occupation keyed by the occupied settlement', () => {
    const snapshot = snapshotForSaves([richCity('a', 'Ironhold'), hamlet('b', 'Thornmere')]);
    const warOutcomes = [
      { type: 'power_transfer', targetSaveId: 'b', powerTransfer: { cause: 'conquest' }, condition: { causes: [{ source: 'a' }] } },
    ];
    const out = evaluateOccupations({
      snapshot, worldState: {}, graph: snapshot.regionalGraph, deployments: {},
      warOutcomes, returnOutcomes: [], tick: 5, rules: { warLayerEnabled: true },
    });
    expect(out.occupations.b.occupierId).toBe('a');
    expect(out.occupations.b.state).toBe('contested');
    expect(out.occupations.b.sinceTick).toBe(5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('occupation — state machine (hysteresis, no 1-tick flips, slide-back)', () => {
  test('advanceOccupationState requires the dwell — no 1-tick flip even at high suitability', () => {
    const rec = { state: 'contested', stateHeld: 0 };
    const t1 = advanceOccupationState(rec, 0.9); // argues advance, dwell 1 < HOLD(2)
    expect(t1.state).toBe('contested'); // held — no flip yet
    expect(t1.liberated).toBe(false);
    const t2 = advanceOccupationState({ state: 'contested', stateHeld: t1.stateHeld }, 0.9);
    expect(t2.state).toBe('unstable'); // matured → advances ONE rung
  });

  test('a regression direction RESETS the dwell (no oscillation across a flip)', () => {
    // Build up one tick of advance pressure, then flip to regress: the dwell must reset.
    const up1 = advanceOccupationState({ state: 'unstable', stateHeld: 0 }, 0.9);
    expect(up1.stateHeld).toBe(1);
    const down1 = advanceOccupationState({ state: 'unstable', stateHeld: up1.stateHeld }, 0.1);
    expect(down1.stateHeld).toBe(-1); // flipped sign, did NOT mature off the +1
    expect(down1.state).toBe('unstable'); // held
  });

  test('sustained low suitability slides an occupation BACK one rung at a time', () => {
    let state = 'stabilized';
    let held = 0;
    const r1 = advanceOccupationState({ state, stateHeld: held }, 0.1); held = r1.stateHeld;
    expect(r1.state).toBe('stabilized'); // dwell 1
    const r2 = advanceOccupationState({ state, stateHeld: held }, 0.1);
    expect(r2.state).toBe('extractive'); // matured → slid back one rung
  });

  test('a contested occupation with collapsed suitability LIBERATES outright (exits)', () => {
    const out = advanceOccupationState({ state: 'contested', stateHeld: 0 }, 0.05);
    expect(out.liberated).toBe(true);
  });

  test('a compliant regime drives advancement; an intact loyalist resists and stalls', () => {
    const snapshot = snapshotForSaves([richCity('a', 'Ironhold'), richCity('b', 'Goldport', { legitimacy: 85 })]);
    const loyalistItem = snapshot.byId.get('b'); // intact, high-legitimacy, populous → high resistance
    const compliant = compliantItem(snapshot, 'b');

    // Loyalist: resistance climbs, suitability stays low.
    let rec = createOccupationRecord('a', 0);
    for (let i = 0; i < 4; i++) {
      const r = advanceResistance(rec, loyalistItem);
      const suit = stabilizationSuitability({ ...rec, resistance: r }, loyalistItem, false);
      const adv = advanceOccupationState(rec, suit);
      rec = { ...rec, resistance: r, state: adv.liberated ? 'contested' : adv.state, stateHeld: adv.stateHeld };
    }
    // The loyalist occupation never reached stabilized.
    expect(OCCUPATION_TUNING.STATE_RANK[rec.state]).toBeLessThan(OCCUPATION_TUNING.STATE_RANK.stabilized);

    // Compliant regime: resistance decays, suitability rises, it advances.
    let rec2 = createOccupationRecord('a', 0);
    for (let i = 0; i < 8; i++) {
      const r = advanceResistance(rec2, compliant);
      const suit = stabilizationSuitability({ ...rec2, resistance: r }, compliant, true);
      const adv = advanceOccupationState(rec2, suit);
      if (adv.liberated) { rec2 = createOccupationRecord('a', 0); continue; }
      rec2 = { ...rec2, resistance: r, state: adv.state, stateHeld: adv.stateHeld };
    }
    expect(OCCUPATION_TUNING.STATE_RANK[rec2.state]).toBeGreaterThanOrEqual(OCCUPATION_TUNING.STATE_RANK.stabilized);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('occupation — resistance grows on intact loyalist, shrinks on devastated/compliant', () => {
  test('resistanceTarget is high for an intact populous loyalist, low for a devastated hamlet', () => {
    const snapshot = snapshotForSaves([
      richCity('big', 'Goldport', { legitimacy: 85 }),
      hamlet('small', 'Ashfen', { legitimacy: 15, activeConditions: [{ archetype: 'war_pressure', severity: 0.9 }] }),
    ]);
    const tBig = resistanceTarget(snapshot.byId.get('big'));
    const tSmall = resistanceTarget(snapshot.byId.get('small'));
    expect(tBig).toBeGreaterThan(tSmall);
    expect(tBig).toBeGreaterThan(0.4);
  });

  test('resistance grows toward target on an intact loyalist; a compliant regime decays it', () => {
    const snapshot = snapshotForSaves([richCity('a', 'Ironhold'), richCity('b', 'Goldport', { legitimacy: 85 })]);
    const intact = snapshot.byId.get('b');
    const compliant = compliantItem(snapshot, 'b');
    const rec = createOccupationRecord('a', 0); // resistance 0.35, contested

    const grown = advanceResistance(rec, intact);
    expect(grown).toBeGreaterThan(rec.resistance); // climbs on an intact loyalist

    const decayed = advanceResistance({ ...rec, state: 'stabilized' }, compliant);
    expect(decayed).toBeLessThan(rec.resistance); // shrinks under a compliant, mature occupation
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('occupation — CAPPED / DELAYED / CONDITIONAL benefit (the anti-snowball)', () => {
  test('DELAYED: a fresh CONTESTED occupation yields ~0; benefit rises with stabilization', () => {
    const snapshot = snapshotForSaves([richCity('a', 'Ironhold'), richCity('b', 'Goldport')]);
    const itemFor = (id) => snapshot.byId.get(id);
    const contested = { b: { occupierId: 'a', state: 'contested', resistance: 0.3 } };
    const stabilized = { b: { occupierId: 'a', state: 'stabilized', resistance: 0.1 } };
    const bC = computeOccupierBenefit(contested, itemFor);
    const bS = computeOccupierBenefit(stabilized, itemFor);
    expect(bC.perOccupation.b).toBe(0); // contested scale is 0 → ~0 yield
    expect(bS.perOccupation.b).toBeGreaterThan(0.1); // stabilized yields real benefit
  });

  test('CONDITIONAL: benefit is proportional to the occupied settlement\'s usefulness', () => {
    const snapshot = snapshotForSaves([
      richCity('a', 'Ironhold'),
      richCity('rich', 'Goldport', { prosperity: 'Thriving', institutions: [{ name: 'Royal Armory' }, { name: 'Grand Forge' }] }),
      hamlet('poor', 'Ashfen'),
    ]);
    const itemFor = (id) => snapshot.byId.get(id);
    expect(occupiedUsefulness(itemFor('rich'))).toBeGreaterThan(occupiedUsefulness(itemFor('poor')));
    const benefitRich = computeOccupierBenefit({ rich: { occupierId: 'a', state: 'stabilized', resistance: 0.1 } }, itemFor);
    const benefitPoor = computeOccupierBenefit({ poor: { occupierId: 'a', state: 'stabilized', resistance: 0.1 } }, itemFor);
    expect(benefitRich.perOccupier.a).toBeGreaterThan(benefitPoor.perOccupier.a);
  });

  test('CONDITIONAL: active resistance subtracts from the benefit', () => {
    const snapshot = snapshotForSaves([richCity('a', 'Ironhold'), richCity('b', 'Goldport')]);
    const itemFor = (id) => snapshot.byId.get(id);
    const calm = computeOccupierBenefit({ b: { occupierId: 'a', state: 'stabilized', resistance: 0.05 } }, itemFor);
    const resisted = computeOccupierBenefit({ b: { occupierId: 'a', state: 'stabilized', resistance: 0.7 } }, itemFor);
    expect(resisted.perOccupier.a).toBeLessThan(calm.perOccupier.a);
  });

  test('CAPPED: per-occupation and per-occupier totals are HARD-CAPPED', () => {
    const snapshot = snapshotForSaves([
      richCity('a', 'Ironhold'),
      ...Array.from({ length: 12 }, (_, i) => richCity(`v${i}`, `Vassal ${i}`, { prosperity: 'Thriving' })),
    ]);
    const itemFor = (id) => snapshot.byId.get(id);
    // 12 stabilized, maximally-useful, zero-resistance occupations under ONE occupier.
    const occupations = {};
    for (let i = 0; i < 12; i++) occupations[`v${i}`] = { occupierId: 'a', state: 'vassalized', resistance: 0 };
    const { perOccupier, perOccupation } = computeOccupierBenefit(occupations, itemFor);
    for (const id of Object.keys(perOccupation)) {
      expect(perOccupation[id]).toBeLessThanOrEqual(OCCUPATION_TUNING.PER_OCCUPATION_BENEFIT_CAP + 1e-9);
    }
    // The TOTAL per occupier is bounded by the containment cap — no compounding.
    expect(perOccupier.a).toBeLessThanOrEqual(OCCUPATION_TUNING.OCCUPIER_BENEFIT_CONTAINMENT + 1e-9);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('occupation — burden / resistance / overextension', () => {
  test('a CONTESTED resisted occupation\'s burden OUTWEIGHS its (near-zero) benefit', () => {
    const snapshot = snapshotForSaves([richCity('a', 'Ironhold'), richCity('b', 'Goldport')]);
    const itemFor = (id) => snapshot.byId.get(id);
    const occupations = { b: { occupierId: 'a', state: 'contested', resistance: 0.6 } };
    const benefit = computeOccupierBenefit(occupations, itemFor).perOccupier.a || 0;
    const burden = computeOccupierBurden(occupations).a || 0;
    expect(burden).toBeGreaterThan(benefit);
    expect(benefit).toBe(0); // contested yields nothing
  });

  test('OVEREXTENSION: each additional occupation raises the per-occupation burden', () => {
    const oneOcc = { b: { occupierId: 'a', state: 'extractive', resistance: 0.3 } };
    const fourOcc = {
      b: { occupierId: 'a', state: 'extractive', resistance: 0.3 },
      c: { occupierId: 'a', state: 'extractive', resistance: 0.3 },
      d: { occupierId: 'a', state: 'extractive', resistance: 0.3 },
      e: { occupierId: 'a', state: 'extractive', resistance: 0.3 },
    };
    const burden1 = computeOccupierBurden(oneOcc).a;
    const burden4 = computeOccupierBurden(fourOcc).a;
    // Total burden grows super-linearly with count (overextension), AND the average per
    // occupation is heavier with more occupations.
    expect(burden4).toBeGreaterThan(burden1 * 4);
  });

  test('resistance GROWS on an intact loyalist population over an integration run', () => {
    const snapshot = snapshotForSaves([richCity('a', 'Ironhold'), richCity('b', 'Goldport', { legitimacy: 90 })]);
    let ws = { occupations: { b: createOccupationRecord('a', 0) } };
    let maxResistance = 0;
    for (let t = 1; t <= 4; t++) {
      const out = evaluateOccupations({
        snapshot, worldState: ws, graph: snapshot.regionalGraph, deployments: {},
        warOutcomes: [], returnOutcomes: [], tick: t, rules: { warLayerEnabled: true },
      });
      if (out.occupations.b) maxResistance = Math.max(maxResistance, out.occupations.b.resistance);
      ws = { occupations: out.occupations };
    }
    expect(maxResistance).toBeGreaterThan(0.35); // climbed above the seed
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('occupation — THE SNOWBALL SOAK (an occupier cannot eat the map)', () => {
  test('an occupier holding MANY stabilized occupations gains a STRICTLY BOUNDED benefit over a long run', () => {
    // 20 maximally-useful settlements, all stabilized/vassalized under ONE occupier,
    // zero resistance — the worst-case snowball input. The per-occupier benefit must
    // stay under the containment cap on EVERY tick of a long run (no compounding).
    const saves = [richCity('emperor', 'Ironhold'),
      ...Array.from({ length: 20 }, (_, i) => richCity(`p${i}`, `Province ${i}`, { prosperity: 'Thriving', institutions: [{ name: 'Armory' }, { name: 'Forge' }] }))];
    const snapshot = snapshotForSaves(saves);
    const itemFor = (id) => snapshot.byId.get(id);

    const occupations = {};
    for (let i = 0; i < 20; i++) occupations[`p${i}`] = { occupierId: 'emperor', state: 'vassalized', resistance: 0 };

    let prevTotal = -Infinity;
    const totals = [];
    for (let tick = 0; tick < 60; tick++) {
      // Re-run the benefit each tick (the ledger is unchanged → benefit is stationary).
      const { perOccupier } = computeOccupierBenefit(occupations, itemFor);
      const total = perOccupier.emperor;
      totals.push(total);
      // HARD BOUND on every tick — the anti-snowball ceiling.
      expect(total).toBeLessThanOrEqual(OCCUPATION_TUNING.OCCUPIER_BENEFIT_CONTAINMENT + 1e-9);
      prevTotal = total;
    }
    // CONVERGENCE: the benefit is stationary (bounded, not growing) across the run.
    const first = totals[0];
    const last = totals[totals.length - 1];
    expect(Math.abs(last - first)).toBeLessThan(1e-9);
    expect(prevTotal).toBeLessThanOrEqual(OCCUPATION_TUNING.OCCUPIER_BENEFIT_CONTAINMENT + 1e-9);
  });

  test('soak through evaluateOccupations: many fresh conquests do NOT push the occupier benefit past the cap', () => {
    const saves = [richCity('emperor', 'Ironhold'),
      ...Array.from({ length: 15 }, (_, i) => richCity(`p${i}`, `Province ${i}`, { prosperity: 'Thriving' }))];
    const snapshot = snapshotForSaves(saves);

    // Seed all 15 as already-vassalized occupations under the emperor (steady state).
    const seeded = {};
    for (let i = 0; i < 15; i++) seeded[`p${i}`] = { ...createOccupationRecord('emperor', 0), state: 'vassalized', stateHeld: 1, resistance: 0 };
    let ws = { occupations: seeded };

    let maxSpoils = 0;
    for (let tick = 1; tick <= 40; tick++) {
      const out = evaluateOccupations({
        snapshot, worldState: ws, graph: snapshot.regionalGraph, deployments: {},
        warOutcomes: [], returnOutcomes: [], tick, rules: { warLayerEnabled: true },
      });
      const spoils = out.outcomes.find(o => o.candidateType === 'war_spoils' && o.targetSaveId === 'emperor');
      if (spoils) maxSpoils = Math.max(maxSpoils, spoils.severity);
      ws = { occupations: out.occupations };
    }
    // war_spoils severity = capped benefit × relief scale → bounded well under 1.
    expect(maxSpoils).toBeLessThanOrEqual(OCCUPATION_TUNING.OCCUPIER_BENEFIT_CONTAINMENT * OCCUPATION_TUNING.BENEFIT_RELIEF_SCALE + 1e-9);
    expect(maxSpoils).toBeLessThan(0.6);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('occupation — integration: liberation exits the ledger; vassalization converts', () => {
  test('a liberation outcome drops the occupation from the ledger', () => {
    const snapshot = snapshotForSaves([richCity('a', 'Ironhold'), richCity('b', 'Goldport')]);
    const out = evaluateOccupations({
      snapshot, worldState: { occupations: { b: createOccupationRecord('a', 0) } },
      graph: snapshot.regionalGraph, deployments: {},
      warOutcomes: [], returnOutcomes: [{ targetSaveId: 'b', condition: { archetype: 'occupation_lifted' } }],
      tick: 5, rules: { warLayerEnabled: true },
    });
    expect(out.occupations.b).toBeUndefined();
  });

  test('an occupation that reaches vassalized emits a relationship_label_change to vassal on the real edge', () => {
    const snapshot = snapshotForSaves(
      [richCity('a', 'Ironhold'), richCity('b', 'Goldport')],
      { edges: [{ id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'hostile' }], relationshipStates: { 'edge.a.b': { relationshipType: 'hostile' } } },
    );
    // A just-arrived vassalized occupation (stateHeld 0, lastTick = this tick).
    const ws = { occupations: { b: { occupierId: 'a', state: 'vassalized', stateHeld: 0, resistance: 0.05, sinceTick: 0, lastTick: 5, benefitYield: 0 } } };
    const out = evaluateOccupations({
      snapshot, worldState: ws, graph: snapshot.regionalGraph, deployments: {},
      warOutcomes: [], returnOutcomes: [], tick: 5, rules: { warLayerEnabled: true },
    });
    const vassal = out.outcomes.find(o => o.candidateType === 'occupation_vassalized');
    expect(vassal).toBeTruthy();
    expect(vassal.proposalPayload).toEqual(expect.objectContaining({ kind: 'relationship_label_change', toType: 'vassal' }));
    expect(vassal.relationshipKey).toBeTruthy();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('occupation — determinism (order-independence, read-last/write-next)', () => {
  test('evaluateOccupations is order-independent across reversed save arrays', () => {
    const saves = [richCity('a', 'Ironhold'), richCity('b', 'Goldport'), richCity('c', 'Silverkeep')];
    const snapA = snapshotForSaves(saves);
    const snapB = snapshotForSaves([...saves].reverse());
    const ws = { occupations: { b: { occupierId: 'a', state: 'extractive', stateHeld: 0, resistance: 0.3, sinceTick: 0, lastTick: 3, benefitYield: 0 }, c: { occupierId: 'a', state: 'stabilized', stateHeld: 0, resistance: 0.1, sinceTick: 0, lastTick: 3, benefitYield: 0 } } };
    const argsFor = (snapshot) => ({ snapshot, worldState: ws, graph: snapshot.regionalGraph, deployments: {}, warOutcomes: [], returnOutcomes: [], tick: 6, rules: { warLayerEnabled: true } });
    const a = evaluateOccupations(argsFor(snapA));
    const b = evaluateOccupations(argsFor(snapB));
    expect(a.occupations).toEqual(b.occupations);
    expect(a.outcomes.map(o => o.id).sort()).toEqual(b.outcomes.map(o => o.id).sort());
    expect(a.dispositionDeltas).toEqual(b.dispositionDeltas);
  });

  test('the ledger is not mutated in place (read-last/write-next)', () => {
    const snapshot = snapshotForSaves([richCity('a', 'Ironhold'), richCity('b', 'Goldport')]);
    const original = { b: { occupierId: 'a', state: 'contested', stateHeld: 0, resistance: 0.35, sinceTick: 0, lastTick: 3, benefitYield: 0 } };
    const frozen = JSON.parse(JSON.stringify(original));
    evaluateOccupations({
      snapshot, worldState: { occupations: original }, graph: snapshot.regionalGraph, deployments: {},
      warOutcomes: [], returnOutcomes: [], tick: 4, rules: { warLayerEnabled: true },
    });
    expect(original).toEqual(frozen); // input untouched
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// End-to-end: a conquest through the FULL pulse seeds an occupation, which then runs
// its state machine across subsequent ticks. Mirrors the warDeployment full-pulse
// conquest fixture (a strong city besieging a weak village).
// ─────────────────────────────────────────────────────────────────────────────
function fullAttacker(id, name) {
  return save(id, name, { tier: 'city', population: 45000 });
}
function fullVictim(id, name) {
  return save(id, name, {
    tier: 'village', population: 280, legitimacy: 24,
    factions: [
      { faction: 'Village Elders', category: 'civic', power: 30, isGoverning: true },
      { faction: 'Hedge Wardens', category: 'military', power: 22 },
    ],
  });
}

describe('occupation — end-to-end through the full pulse', () => {
  test('a conquest seeds an occupations ledger entry and runs the state machine over ticks', () => {
    const saves = [fullAttacker('strong', 'Ironhold'), fullVictim('weak', 'Thornmere')];
    const channels = [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }];
    const edges = [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }];
    const relationshipStates = { 'edge.strong.weak': { relationshipType: 'hostile' } };
    let worldState = {
      rngSeed: 'war-seed', tick: 4, relationshipStates,
      deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } },
      simulationRules: { warLayerEnabled: true },
    };

    let sawOccupation = false;
    let sawResistanceCondition = false;
    const states = new Set();
    for (let i = 0; i < 70; i++) {
      const campaign = {
        id: 'occ-e2e', name: 'Occ E2E', settlementIds: ['strong', 'weak'],
        worldState, regionalGraph: ensureRegionalGraph({ edges, channels }),
        wizardNews: { currentTick: worldState.tick, entries: [] },
      };
      const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      worldState = pulse.worldState;
      if (worldState.occupations && worldState.occupations.weak) {
        sawOccupation = true;
        states.add(worldState.occupations.weak.state);
      }
      const weak = pulse.settlementUpdates.find(u => String(u.saveId) === 'weak');
      if ((weak?.settlement?.activeConditions || []).some(c => c.archetype === 'occupation_resistance')) {
        sawResistanceCondition = true;
      }
    }
    expect(sawOccupation).toBe(true);
    // The occupation passed through `contested` (the seed rung) at least.
    expect(states.has('contested')).toBe(true);
    // The occupied village resists.
    expect(sawResistanceCondition).toBe(true);
  });

  test('full-pulse soak: a conquering occupier never accrues unbounded war_spoils relief', () => {
    const saves = [fullAttacker('strong', 'Ironhold'), fullVictim('weak', 'Thornmere')];
    const channels = [{ type: 'war_front', from: 'strong', to: 'weak', status: 'confirmed' }];
    const edges = [{ id: 'edge.strong.weak', from: 'strong', to: 'weak', relationshipType: 'hostile' }];
    let worldState = {
      rngSeed: 'war-seed', tick: 4,
      relationshipStates: { 'edge.strong.weak': { relationshipType: 'hostile' } },
      deployments: { strong: { targetId: 'weak', sinceTick: 1, role: 'siege' } },
      simulationRules: { warLayerEnabled: true },
    };
    let maxSpoilsSeverity = 0;
    for (let i = 0; i < 80; i++) {
      const campaign = {
        id: 'occ-soak', name: 'Occ Soak', settlementIds: ['strong', 'weak'],
        worldState, regionalGraph: ensureRegionalGraph({ edges, channels }),
        wizardNews: { currentTick: worldState.tick, entries: [] },
      };
      const pulse = previewCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
      worldState = pulse.worldState;
      const strong = pulse.settlementUpdates.find(u => String(u.saveId) === 'strong');
      const spoils = (strong?.settlement?.activeConditions || []).filter(c => c.archetype === 'war_spoils');
      for (const s of spoils) maxSpoilsSeverity = Math.max(maxSpoilsSeverity, s.severity);
    }
    // Across 80 ticks the occupier's spoils relief stays bounded — no compounding.
    expect(maxSpoilsSeverity).toBeLessThanOrEqual(OCCUPATION_TUNING.OCCUPIER_BENEFIT_CONTAINMENT * OCCUPATION_TUNING.BENEFIT_RELIEF_SCALE + 1e-9);
  });
});
