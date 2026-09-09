/**
 * giftsAndDebtsRead.test.js — D7 THE LEDGER OF GIFTS AND DEBTS read-model pins
 * (DESIGN_SIM_DEPTH_R2 §D7, consumer 5): the frozen fact vs the observer's reading vs the
 * TRUE mint intent, the false-reframe irony pin, and the premium DM-truth seam.
 */
import { describe, it, expect } from 'vitest';
import {
  giftsAndDebtsFor, realmGiftsAndDebts, hasGiftsAndDebts,
} from '../../src/domain/display/giftsAndDebtsRead.js';
import { advanceReframe } from '../../src/domain/worldPulse/reframeKernel.js';
import { relationshipKeyFromEdge } from '../../src/domain/worldPulse/relationshipState.js';

/** A lit world: creditor gave the debtor a PREDATORY credit (true intent = leverage), and the
 *  relationship soured (high resentment) so the creditor now reads it as a debt unpaid. */
function souredWorld({ predatory = false } = {}) {
  const key = relationshipKeyFromEdge({ from: 'creditor', to: 'debtor' });
  const worldState = {
    simulationRules: { reframeEnabled: true },
    relationshipStates: { [key]: { relationshipType: 'rival', trust: 0.03, resentment: 0.88 } },
    spatialLedgers: {
      obligations: {
        'debtor:creditor:grain_relief': { from: 'debtor', to: 'creditor', kind: 'grain_relief', magnitude: 0.6, mintTick: 0, lastTick: 3, ...(predatory ? { predatory: true } : {}) },
      },
    },
  };
  const byId = new Map([['creditor', { id: 'creditor', settlement: {} }], ['debtor', { id: 'debtor', settlement: {} }]]);
  const snapshot = { byId, regionalGraph: { edges: [{ from: 'creditor', to: 'debtor' }] } };
  return advanceReframe({ snapshot, worldState, tick: 4 }).worldState;
}

describe('D7 gifts-and-debts read-model', () => {
  it('is dormant-safe: absent ledgers ⇒ empty acts, no crash', () => {
    expect(giftsAndDebtsFor({ worldState: {}, observerId: 'a', subjectId: 'b' }).acts).toEqual([]);
    expect(realmGiftsAndDebts({ worldState: {} })).toEqual([]);
    expect(hasGiftsAndDebts({})).toBe(false);
    expect(hasGiftsAndDebts(null)).toBe(false);
  });

  it('surfaces the frozen fact + the observer\'s current reading (the creditor now reads a debt)', () => {
    const ws = souredWorld();
    const entry = giftsAndDebtsFor({ worldState: ws, observerId: 'creditor', subjectId: 'debtor' });
    expect(entry.acts.length).toBe(1);
    const act = entry.acts[0];
    expect(act.kind).toBe('grain_relief');       // the FROZEN fact — nominally a gift
    expect(act.role).toBe('giver');
    expect(act.reading).toBe('debt_unpaid');      // the observer's CURRENT belief
    expect(act.sign).toBe('dark');
    expect(hasGiftsAndDebts(ws)).toBe(true);
  });

  it('the premium DM-truth seam: player view hides true intent; DM view exposes it', () => {
    const ws = souredWorld({ predatory: false });
    const player = giftsAndDebtsFor({ worldState: ws, observerId: 'creditor', subjectId: 'debtor' });
    expect(player.acts[0].truth).toBeUndefined();               // player-safe: no true-intent block
    const dm = giftsAndDebtsFor({ worldState: ws, observerId: 'creditor', subjectId: 'debtor', includeGroundTruth: true });
    expect(dm.acts[0].truth).toBeDefined();                     // DM lane: the truth block appears
    expect(dm.acts[0].truth.predatoryIntent).toBe(false);
  });

  it('the false-reframe irony pin: believed debt ≠ true (freely-given) intent renders in the DM lane', () => {
    // The aid was NOT predatory (a genuine gift) but the soured creditor reads it as a debt unpaid.
    const ws = souredWorld({ predatory: false });
    const dm = giftsAndDebtsFor({ worldState: ws, observerId: 'creditor', subjectId: 'debtor', includeGroundTruth: true });
    expect(dm.acts[0].reading).toBe('debt_unpaid');            // believed
    expect(dm.acts[0].truth.predatoryIntent).toBe(false);      // true intent: a free gift
    expect(dm.acts[0].truth.divergence).toMatch(/kindness misremembered/); // the irony is named
  });

  it('realmGiftsAndDebts rolls up the reframed pairs with names', () => {
    const ws = souredWorld();
    const rows = realmGiftsAndDebts({ worldState: ws, nameFor: (id) => id.toUpperCase() });
    expect(rows.length).toBeGreaterThan(0);
    const row = rows.find((r) => r.observerId === 'creditor');
    expect(row?.observerName).toBe('CREDITOR');
    expect(Object.keys(row?.readings || {})).toContain('aid');
  });
});
