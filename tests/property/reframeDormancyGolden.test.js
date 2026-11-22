/**
 * reframeDormancyGolden.test.js — D7 THE REFRAME LAYER dormancy pin
 * (DESIGN_SIM_DEPTH_R2 §D7, the dormancy golden). Proves, at the INTEGRATION point
 * (advanceWarReasons, where advanceReframe is folded in): the flag absent ⇒ NO reframe
 * ledger + a war-reason ledger byte-identical to the pre-D7 behaviour (the two reframe
 * casus never materialise); and the flag LIT ⇒ the layer diverges (anti-vacuity — the
 * crown emergent, a war from a kindness misremembered, actually fires). Determinism is
 * proven by a same-seed re-run.
 *
 * This is the self-contained dormancy proof for the D7 gate; the WHOLE golden suite
 * (peaceCausalDormancyGolden + the generator/worldpulse goldens) proves the broader
 * byte-identity — reframeEnabled is absent from DEFAULT_SIMULATION_RULES and the WAVES
 * preset bundle, so every committed golden runs the reframe layer dark.
 */
import { describe, it, expect } from 'vitest';
import { advanceWarReasons } from '../../src/domain/worldPulse/warReasons.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipState.js';

/** A soured creditor→debtor with a live obligation (the aid), under a chosen gate config. */
function scenario({ reframe = false, peace = false } = {}) {
  const key = relationshipKeyFromEdge({ from: 'creditor', to: 'debtor' });
  const rules = {
    ...(peace ? { warLayerEnabled: true, peaceEngineEnabled: true } : {}),
    ...(reframe ? { reframeEnabled: true } : {}),
  };
  const worldState = {
    simulationRules: rules,
    relationshipStates: { [key]: { relationshipType: 'rival', trust: 0.03, resentment: 0.88 } },
    spatialLedgers: {
      obligations: { 'debtor:creditor:grain_relief': { from: 'debtor', to: 'creditor', kind: 'grain_relief', magnitude: 0.6, mintTick: 0, lastTick: 3 } },
    },
  };
  const byId = new Map([['creditor', { id: 'creditor', settlement: {} }], ['debtor', { id: 'debtor', settlement: {} }]]);
  const snapshot = { byId, regionalGraph: { edges: [{ from: 'creditor', to: 'debtor' }] } };
  const graph = snapshot.regionalGraph;
  return { worldState, snapshot, graph };
}

const drive = (cfg, tick = 5) => {
  const { worldState, snapshot, graph } = scenario(cfg);
  return advanceWarReasons({ snapshot, worldState, graph, tick });
};

describe('D7 reframe dormancy golden', () => {
  it('BOTH gates dark ⇒ an immediate no-op (worldState identity, no reframe key)', () => {
    const { worldState, snapshot, graph } = scenario({ reframe: false, peace: false });
    const r = advanceWarReasons({ snapshot, worldState, graph, tick: 5 });
    expect(r.changed).toBe(false);
    expect(r.worldState).toBe(worldState);
    expect(r.worldState.spatialLedgers.reframes).toBeUndefined();
  });

  it('reframe DARK + peace LIT ⇒ no reframe ledger, and the two reframe casus never materialise', () => {
    const r = drive({ reframe: false, peace: true });
    expect(r.worldState.spatialLedgers.reframes).toBeUndefined();
    const wr = r.worldState.spatialLedgers.warReasons || {};
    for (const key of Object.keys(wr)) {
      const reasons = wr[key].reasons || {};
      expect(reasons.ingratitude_debt).toBeUndefined();
      expect(reasons.dependency_by_design).toBeUndefined();
    }
  });

  it('reframe LIT + peace DARK ⇒ the reframe ledger materialises, but no war-reason ledger', () => {
    const r = drive({ reframe: true, peace: false });
    expect(r.changed).toBe(true);
    expect(r.worldState.spatialLedgers.reframes).toBeDefined();
    expect(r.worldState.spatialLedgers.warReasons).toBeUndefined();
  });

  it('BOTH gates LIT ⇒ the layer diverges: the reframe casus fires (anti-vacuity)', () => {
    const r = drive({ reframe: true, peace: true });
    expect(r.worldState.spatialLedgers.reframes).toBeDefined();
    const wr = r.worldState.spatialLedgers.warReasons || {};
    const entry = wr['creditor>debtor'];
    expect(entry, 'the creditor holds a war-reason case against the debtor').toBeDefined();
    expect(entry.reasons.ingratitude_debt, 'a war from a kindness misremembered').toBeDefined();
    expect(entry.reasons.ingratitude_debt.score).toBeGreaterThan(0);
  });

  it('determinism: same-config re-runs fold byte-identically', () => {
    const a = drive({ reframe: true, peace: true });
    const b = drive({ reframe: true, peace: true });
    expect(JSON.stringify(a.worldState.spatialLedgers.reframes)).toBe(JSON.stringify(b.worldState.spatialLedgers.reframes));
    expect(JSON.stringify(a.worldState.spatialLedgers.warReasons)).toBe(JSON.stringify(b.worldState.spatialLedgers.warReasons));
  });
});
