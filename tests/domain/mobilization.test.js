import { describe, expect, test } from 'vitest';

import {
  stepPosture,
  evaluateMobilization,
  isWarReady,
  shouldCool,
  rampReadiness,
  MOBILIZATION_TUNING,
} from '../../src/domain/worldPulse/mobilization.js';
import { buildWorldSnapshot } from '../../src/domain/worldPulse/worldSnapshot.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';

// ─────────────────────────────────────────────────────────────────────────────
// Phase B1 — WAR-ECONOMY MOBILIZATION POSTURE state machine. A settlement cannot
// siege from peace: it must RAMP peace→alert→war_preparation→mobilized over several
// ticks, gated on disposition/economy/legitimacy, and it COOLS under strain. The
// step function is a DETERMINISTIC classifier (no rng).
// ─────────────────────────────────────────────────────────────────────────────

function settlement(name, patch = {}) {
  return {
    name, tier: patch.tier || 'city', population: patch.population || 40000,
    config: { tradeRouteAccess: 'road' }, institutions: [],
    economicState: { prosperity: patch.prosperity || 'Prosperous', primaryExports: [], primaryImports: [] },
    powerStructure: {
      publicLegitimacy: { score: patch.legitimacy ?? 70, label: 'Stable' },
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
function snapFor(saves, worldState = {}) {
  const campaign = {
    id: 'm', settlementIds: saves.map(s => s.id),
    worldState: { tick: 1, simulationRules: { warLayerEnabled: true }, ...worldState },
    regionalGraph: ensureRegionalGraph({ edges: [], channels: [] }),
  };
  return buildWorldSnapshot({ campaign, saves, worldState: campaign.worldState });
}

const PEACE = { state: 'peace', progress: 0, sinceTick: 0, covert: false };

describe('mobilization — the ramp state machine', () => {
  test('a war-ready posture (mobilized) is required to siege; peace/alert/war_preparation are not', () => {
    expect(isWarReady('peace')).toBe(false);
    expect(isWarReady('alert')).toBe(false);
    expect(isWarReady('war_preparation')).toBe(false);
    expect(isWarReady('mobilized')).toBe(true);
    expect(isWarReady('deployed')).toBe(true);
  });

  test('a settlement RAMPS peace→…→mobilized over multiple ticks (cannot leap from peace)', () => {
    const saves = [save('s', 'Steel')];
    const snap = snapFor(saves);
    const item = snap.byId.get('s');
    let rec = { ...PEACE };
    const seen = [rec.state];
    for (let tick = 1; tick <= 12; tick += 1) {
      const { next } = stepPosture({ prev: rec, item, worldState: snap.worldState, tick, hasArmyDeployed: false, warExhaustion: 0, wantsWar: true });
      rec = next;
      if (seen[seen.length - 1] !== rec.state) seen.push(rec.state);
      if (rec.state === 'mobilized') break;
    }
    // It passed THROUGH the intermediate rungs in order — never jumped peace→mobilized.
    expect(seen[0]).toBe('peace');
    expect(seen).toContain('alert');
    expect(seen).toContain('war_preparation');
    expect(seen[seen.length - 1]).toBe('mobilized');
    // The ramp took more than one tick (it cannot siege from peace).
    expect(seen.length).toBeGreaterThanOrEqual(4);
  });

  test('ramp SPEED varies with disposition/economy/legitimacy (a warlike, prosperous, legitimate town ramps faster)', () => {
    const warlike = snapFor([save('w', 'Warhall', {
      legitimacy: 90,
      factions: [{ faction: 'Garrison', category: 'military', power: 95, isGoverning: true }],
      npcs: [{ id: 'n1', importance: 'pillar', personality: { dominant: 'ruthless', flaw: 'cruel', modifier: 'ambitious' } }],
    })]);
    const pacific = snapFor([save('p', 'Peaceburg', {
      legitimacy: 45, prosperity: 'Struggling',
      factions: [{ faction: 'Merchant Guild', category: 'economy', power: 50, isGoverning: true }],
      npcs: [{ id: 'n2', importance: 'pillar', personality: { dominant: 'compassionate', flaw: 'meek', modifier: 'cautious' } }],
    })]);
    const rw = rampReadiness(warlike.byId.get('w'), warlike.worldState);
    const rp = rampReadiness(pacific.byId.get('p'), pacific.worldState);
    expect(rw).toBeGreaterThan(rp);

    // And over a fixed horizon the warlike town reaches a higher rung.
    const rung = (snap, id) => {
      const item = snap.byId.get(id);
      let rec = { ...PEACE };
      for (let t = 1; t <= 5; t += 1) {
        rec = stepPosture({ prev: rec, item, worldState: snap.worldState, tick: t, hasArmyDeployed: false, warExhaustion: 0, wantsWar: true }).next;
      }
      return rec.state;
    };
    const order = ['peace', 'alert', 'war_preparation', 'mobilized'];
    expect(order.indexOf(rung(warlike, 'w'))).toBeGreaterThanOrEqual(order.indexOf(rung(pacific, 'p')));
  });

  test('posture COOLS/FAILS under strain — economic strain, low legitimacy, or food shortage drops it back', () => {
    // A settlement at war_preparation with a legitimacy crisis cools DOWN even though
    // it still faces a threat.
    const fragile = snapFor([save('f', 'Faltering', {
      legitimacy: 18,
      factions: [{ faction: 'Council', category: 'civic', power: 40, isGoverning: true }],
    })]);
    const item = fragile.byId.get('f');
    const cool = shouldCool(item);
    expect(cool.cool).toBe(true);
    const { next, cooled } = stepPosture({
      prev: { state: 'war_preparation', progress: 0.5, sinceTick: 0, covert: false },
      item, worldState: fragile.worldState, tick: 5, hasArmyDeployed: false, warExhaustion: 0, wantsWar: true,
    });
    expect(cooled).toBe(true);
    expect(next.progress).toBeLessThan(0.5); // it lost ground
  });

  test('peace DRIFTS to civilian when no threat exists (progress decays)', () => {
    const snap = snapFor([save('s', 'Steel')]);
    const item = snap.byId.get('s');
    const { next } = stepPosture({
      prev: { state: 'alert', progress: 0.3, sinceTick: 0, covert: false },
      item, worldState: snap.worldState, tick: 5, hasArmyDeployed: false, warExhaustion: 0, wantsWar: false,
    });
    // No threat ⇒ it winds down, never up.
    expect(['peace', 'alert']).toContain(next.state);
    expect(next.progress).toBeLessThanOrEqual(0.3);
  });

  test('a deployed army pins the posture to deployed (or war_exhaustion when deeply scarred)', () => {
    const snap = snapFor([save('s', 'Steel')]);
    const item = snap.byId.get('s');
    const deployed = stepPosture({ prev: { ...PEACE }, item, worldState: snap.worldState, tick: 5, hasArmyDeployed: true, warExhaustion: 0.1, wantsWar: true });
    expect(deployed.next.state).toBe('deployed');
    const weary = stepPosture({ prev: { ...PEACE }, item, worldState: snap.worldState, tick: 5, hasArmyDeployed: true, warExhaustion: 0.6, wantsWar: true });
    expect(weary.next.state).toBe('war_exhaustion');
  });

  test('the posture CONVERGES — a sustained no-threat run does not oscillate forever (it settles at peace)', () => {
    const snap = snapFor([save('s', 'Steel')]);
    const item = snap.byId.get('s');
    let rec = { state: 'mobilized', progress: 1, sinceTick: 0, covert: false };
    for (let t = 1; t <= 40; t += 1) {
      rec = stepPosture({ prev: rec, item, worldState: snap.worldState, tick: t, hasArmyDeployed: false, warExhaustion: 0, wantsWar: false }).next;
    }
    expect(rec.state).toBe('peace');
    expect(rec.progress).toBe(0);
  });
});

describe('mobilization — evaluateMobilization (the per-tick ledger evolution)', () => {
  test('order-independent: reversing the saves array yields the identical next ledger', () => {
    const saves = [
      save('alpha', 'Alpha', { legitimacy: 80 }),
      save('bravo', 'Bravo', { legitimacy: 80 }),
    ];
    const run = (ordered) => {
      const snap = snapFor(ordered, { warPosture: { alpha: { state: 'alert', progress: 0.5, sinceTick: 0 } } });
      return evaluateMobilization({ snapshot: snap, worldState: snap.worldState, tick: 5, wantsWarFor: () => true }).warPosture;
    };
    expect(run([...saves].reverse())).toEqual(run(saves));
  });

  test('a no-threat campaign yields an EMPTY ledger (byte-neutral — no posture key materializes)', () => {
    const snap = snapFor([save('s', 'Steel')]);
    const { warPosture } = evaluateMobilization({ snapshot: snap, worldState: snap.worldState, tick: 1, wantsWarFor: () => false });
    expect(warPosture).toEqual({});
  });

  test('exposes the right tunables', () => {
    expect(MOBILIZATION_TUNING.RAMP_BASE_RATE).toBeGreaterThan(0);
    expect(MOBILIZATION_TUNING.COOL_LEGITIMACY_FLOOR).toBeGreaterThan(0);
  });
});
