/**
 * intelSelfPolicing.test.js — DEEP COUPLINGS D-3 SELF-POLICING LOOP (design §7).
 *
 * The parked orphan intelSaleCredibilityDeltas gets its callers: at courier-arrival the statecraft
 * mover RESOLVES each sold/gifted read against the subject's ground truth and charges the seller —
 * the SETTLEMENT stock (intelSaleCredibilityDeltas) AND, when a spokesperson was stamped, that
 * SOUL's personal stock (intelSaleNpcCredibilityDeltas). The boy who sold true wolf-sightings gets
 * rich in trust; the one who sold rumors goes broke in it. Degrades to settlement-only when no
 * mouthpiece is stamped (the seller-side stamp is a D-3-lane coordination point). Dark ⇒ no charge.
 */
import { describe, it, expect } from 'vitest';
import {
  advanceInformationStatecraft, intelSaleCredibilityDeltas, intelSaleNpcCredibilityDeltas,
  credibilityScoreOf,
} from '../../src/domain/worldPulse/informationStatecraft.js';
import { resolveIntelSale } from '../../src/domain/spatial/intelActs.js';
import { npcCredibilityScoreOf } from '../../src/domain/worldPulse/npcCredibility.js';
import { strengthBandOf } from '../../src/domain/worldPulse/beliefMap.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';

const rng = { fork: () => ({ random: () => 0 }) };

// ── The pure resolver ──────────────────────────────────────────────────────────
describe('D-3 resolveIntelSale — was the transferred read TRUE?', () => {
  const recFor = (band, extra = {}) => ({ sellerId: 'sell', belief: { strengthBand: band }, ...extra });
  it('CONTRADICTED: a read ≥ 2 bands off the truth is a false product (deception)', () => {
    const r = resolveIntelSale(recFor(4), 0);
    expect(r).toMatchObject({ sellerId: 'sell', accurate: false });
    expect(r.magnitude01).toBeCloseTo(1, 5); // |4-0|/4
  });
  it('PROVED OUT: a read within 2 bands of the truth pays the slow rise (proven_true)', () => {
    expect(resolveIntelSale(recFor(3), 3).accurate).toBe(true);
    expect(resolveIntelSale(recFor(3), 4).accurate).toBe(true); // 1 band off is still "true enough"
    expect(resolveIntelSale(recFor(3), 1).accurate).toBe(false); // 2 bands off contradicts
  });
  it('carries the spokespersonNpcId through when present (the personal-charge route)', () => {
    expect(resolveIntelSale(recFor(4, { spokespersonNpcId: 'sell:reeve' }), 0).spokespersonNpcId).toBe('sell:reeve');
    expect(resolveIntelSale(recFor(4), 0).spokespersonNpcId).toBeUndefined();
  });
  it('unresolvable (no belief / non-finite) ⇒ null (no charge)', () => {
    expect(resolveIntelSale({ sellerId: 'sell' }, 2)).toBeNull();
    expect(resolveIntelSale(recFor(3), NaN)).toBeNull();
    expect(resolveIntelSale(null, 2)).toBeNull();
  });
});

// ── The delta builders ──────────────────────────────────────────────────────────
describe('D-3 delta builders — settlement always, spokesperson only when stamped', () => {
  it('intelSaleCredibilityDeltas charges the seller SETTLEMENT for every resolved sale', () => {
    const d = intelSaleCredibilityDeltas([{ sellerId: 'sell', accurate: false, magnitude01: 1 }]);
    expect(d).toEqual([{ id: 'sell', kind: 'deception', magnitude01: 1 }]);
    expect(intelSaleCredibilityDeltas([{ sellerId: 'sell', accurate: true, magnitude01: 1 }])[0].kind).toBe('proven_true');
  });
  it('intelSaleNpcCredibilityDeltas charges ONLY sales bearing a spokesperson (NO lieExposedBand ⇒ no stigma)', () => {
    const d = intelSaleNpcCredibilityDeltas([
      { sellerId: 'sell', accurate: false, magnitude01: 1, spokespersonNpcId: 'sell:reeve' },
      { sellerId: 'sell2', accurate: true, magnitude01: 1 }, // no spokesperson ⇒ skipped
    ]);
    expect(d).toEqual([{ id: 'sell:reeve', kind: 'deception', magnitude01: 1 }]);
    expect(d[0].lieExposedBand).toBeUndefined(); // a private bad sale is not a public scandal
  });
});

// ── The lit walkthrough (through the real mover) ─────────────────────────────────
const seller = { id: 'reeve', name: 'Reeve of the Wharf', importance: 'key' };
const byId = new Map([
  ['sell', { id: 'sell', settlement: { npcs: [seller] } }],
  ['recv', { id: 'recv', settlement: { npcs: [] } }],
  ['subj', { id: 'subj', settlement: { npcs: [] } }],
]);
const snapshot = { settlements: [{ id: 'sell' }, { id: 'recv' }, { id: 'subj' }], byId };

/** Seed one couriered transfer (deposited last tick) and run the statecraft consume this tick. */
function consume({ soldBand, subjStrength, spokesperson = 'sell:reeve', intelLit = true, credLit = true }) {
  const rules = { infoStatecraftEnabled: true, infoMode: 'unreliable' };
  if (intelLit) rules.intelTradeEnabled = true;
  if (credLit) rules.npcCredibilityEnabled = true;
  const transfer = {
    sellerId: 'sell', receiverId: 'recv', subjectId: 'subj', mode: 'sale',
    belief: { readiness: 0.5, strengthBand: soldBand, allianceLabel: 'neutral', faithLabel: null, confidence01: 0.8 },
    fidelity01: 0.8, depositTick: 0,
    ...(spokesperson ? { spokespersonNpcId: spokesperson } : {}),
  };
  const worldState = {
    simulationRules: rules, spatialCanonVersion: 1, calendar: { elapsedWeeks: 40 },
    spatialLedgers: { intelTransfers: { 'k': transfer } },
  };
  return advanceInformationStatecraft({
    snapshot, worldState, graph: { edges: [] }, rng, tick: 1, now: null,
    strengthOf: (id) => (id === 'subj' ? subjStrength : 0.5),
    alignmentOf: () => ({ malice01: 0.4, lawfulness01: 0.6 }), nameFor: (id) => String(id),
  }).worldState;
}

describe('D-3 self-policing — the closed loop through advanceInformationStatecraft', () => {
  it('sells FALSE intel ⇒ the seller settlement AND its spokesperson both go broke in trust', () => {
    // The Reeve sells "the subject is a fortress (band 4)"; the subject is in truth near-empty.
    const ws = consume({ soldBand: 4, subjStrength: 0.05 });
    expect(credibilityScoreOf(ws, 'sell', 1)).toBeLessThan(0); // the court's stock falls
    expect(npcCredibilityScoreOf(ws, 'sell:reeve', 1)).toBeLessThan(0); // the man's stock falls
    // NO ladder stigma for a sale (kept off the lieExposure path — that is the LIE/BLUFF province).
    expect(getSpatialLedger(ws, 'npcCredibility')['sell:reeve'].lieExposure).toBeUndefined();
  });

  it('sells TRUE intel ⇒ both stocks rise (the trusted broker)', () => {
    const trueBand = strengthBandOf(0.85);
    const ws = consume({ soldBand: trueBand, subjStrength: 0.85 });
    expect(credibilityScoreOf(ws, 'sell', 1)).toBeGreaterThan(0);
    expect(npcCredibilityScoreOf(ws, 'sell:reeve', 1)).toBeGreaterThan(0);
  });

  it('GRACEFUL DEGRADE: no spokesperson stamped ⇒ settlement-level charge only (as today)', () => {
    const ws = consume({ soldBand: 4, subjStrength: 0.05, spokesperson: null });
    expect(credibilityScoreOf(ws, 'sell', 1)).toBeLessThan(0); // settlement still charged
    expect(getSpatialLedger(ws, 'npcCredibility')).toBeFalsy(); // no per-NPC ledger materializes
  });

  it('CREDIBILITY-DARK: intel lit but npcCredibility absent ⇒ settlement charge, no per-NPC key', () => {
    const ws = consume({ soldBand: 4, subjStrength: 0.05, credLit: false });
    expect(credibilityScoreOf(ws, 'sell', 1)).toBeLessThan(0);
    expect(getSpatialLedger(ws, 'npcCredibility')).toBeFalsy();
  });

  it('INTEL-DARK: intelTradeEnabled absent ⇒ no consume, no charge (byte-identical)', () => {
    const ws = consume({ soldBand: 4, subjStrength: 0.05, intelLit: false });
    expect(getSpatialLedger(ws, 'credibility')).toBeFalsy();
    expect(getSpatialLedger(ws, 'npcCredibility')).toBeFalsy();
  });
});
