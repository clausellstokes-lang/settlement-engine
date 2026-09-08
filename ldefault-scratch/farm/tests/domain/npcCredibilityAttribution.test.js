/**
 * npcCredibilityAttribution.test.js — DEEP COUPLINGS D-2b pins (design §6).
 *
 * The statecraft-side attribution: the LIE verb stamps a mouthpiece, the exposure charges
 * that soul personally, and the credibilityOf closure weights an NPC-attributed telling by
 * settlementCred × npcCred. Dark (npcCredibilityEnabled absent) ⇒ no spokesperson, no npc
 * delta, byte-identical to the pre-D-2 lie lifecycle.
 */
import { describe, it, expect } from 'vitest';
import {
  processLies, makeCredibilityWeightFn, credibilityWeight,
} from '../../src/domain/worldPulse/informationStatecraft.js';
import { compositeCredibilityWeight, NPC_CREDIBILITY_TUNING } from '../../src/domain/worldPulse/npcCredibility.js';

// A deterministic rng: initiation always fires (u=0 < threshold), the mouthpiece draw picks
// the top-weighted soul (u=0 ⇒ the first cumulative bucket).
const rng = { fork: () => ({ random: () => 0 }) };

// A weak, hostile raider that BELIEVES a strong hostile Crown — a garrison-bluff candidate.
function fixture(rules) {
  const raiderNpcs = [{ id: 'reeve', name: 'Reeve of the March', importance: 'key' }];
  const byId = new Map([
    ['raider', { id: 'raider', settlement: { npcs: raiderNpcs } }],
    ['crown', { id: 'crown', settlement: { npcs: [{ id: 'castellan', name: 'Castellan', importance: 'key' }] } }],
  ]);
  const snapshot = { settlements: [{ id: 'raider' }, { id: 'crown' }], byId };
  const beliefMaps = {
    raider: { seat: { crown: { allianceLabel: 'hostile', strengthBand: 4, confidence01: 0.8, readiness: 0.5 } } },
    // Crown has a channel (a prior belief) about the raider — required to plant the bluff.
    crown: { seat: { raider: { allianceLabel: 'hostile', strengthBand: 1, confidence01: 0.6, readiness: 0.4 } } },
  };
  const worldState = { simulationRules: rules, spatialCanonVersion: 1, spatialLedgers: {} };
  return { snapshot, worldState, beliefMaps };
}

const args = (f, extra) => ({
  snapshot: f.snapshot, worldState: f.worldState, beliefMaps: f.beliefMaps, rng, tick: 0,
  strengthOf: () => 0.15, // weak ⇒ desperate ⇒ willing
  alignmentOf: () => ({ malice01: 0.9, lawfulness01: 0.1 }),
  nameFor: (id) => String(id),
  ...extra,
});

describe('D-2b — the mouthpiece stamp', () => {
  it('LIT: an initiated bluff carries a spokespersonNpcId (the court speaks through a named soul)', () => {
    const f = fixture({ npcCredibilityEnabled: true });
    const out = processLies(args(f));
    const rec = out.disinfo?.['lie:raider:crown'];
    expect(rec, 'a bluff was seeded').toBeTruthy();
    expect(rec.spokespersonNpcId).toBe('raider:reeve');
  });
  it('DARK: no spokesperson is stamped and no npc delta is produced (byte-identical to pre-D-2)', () => {
    const f = fixture({}); // npcCredibilityEnabled absent
    const out = processLies(args(f));
    const rec = out.disinfo?.['lie:raider:crown'];
    expect(rec, 'a bluff was seeded').toBeTruthy();
    expect(rec.spokespersonNpcId).toBeUndefined();
    expect(out.npcDeltas).toEqual([]);
  });
});

describe('D-2b — the personal charge on exposure', () => {
  it('an exposed lie charges the SETTLEMENT and the MOUTHPIECE, carrying the magnitude band', () => {
    // Seed the lie, then re-run with the audience belief re-anchored toward truth ⇒ exposure.
    const f = fixture({ npcCredibilityEnabled: true });
    const seeded = processLies(args(f));
    const rec = seeded.disinfo['lie:raider:crown'];
    // Carry the disinfo ledger forward; crown's belief re-anchors far from the plant.
    const ws2 = { ...f.worldState, spatialLedgers: { disinfo: seeded.disinfo } };
    const beliefs2 = { ...f.beliefMaps, crown: { seat: { raider: { allianceLabel: 'hostile', strengthBand: rec.trueBand, confidence01: 0.6, readiness: 0.4 } } } };
    const out = processLies(args(f, { worldState: ws2, beliefMaps: beliefs2, tick: 1 }));
    // The settlement deception delta (unchanged behaviour) AND the personal one.
    expect(out.deltas.some((d) => d.id === 'raider' && d.kind === 'deception')).toBe(true);
    const personal = out.npcDeltas.find((d) => d.id === 'raider:reeve');
    expect(personal, 'the mouthpiece is charged personally').toBeTruthy();
    expect(personal.kind).toBe('deception');
    expect(personal.lieExposedBand).toBe(Math.abs(Math.round(rec.assertedBand) - Math.round(rec.trueBand)));
  });
});

describe('D-2b — the composite credibility weight (the credibilityOf consumer)', () => {
  it('an NPC-attributed source weighs settlementCred × npcCred, clamped; a plain source is unchanged', () => {
    const worldState = {
      simulationRules: { infoMode: 'unreliable', infoStatecraftEnabled: true, npcCredibilityEnabled: true },
      spatialCanonVersion: 1,
      spatialLedgers: {
        credibility: { raider: { score: -8, lastUpdateTick: 0, holder: 'people_held' } },
        npcCredibility: { 'raider:reeve': { score: -8, lastUpdateTick: 0 } },
      },
    };
    const fn = makeCredibilityWeightFn(worldState, 0);
    expect(fn, 'the closure is live').toBeTruthy();
    // Plain settlement source ⇒ the settlement weight (unchanged W-DOCTRINE-2 behaviour).
    expect(fn('raider')).toBeCloseTo(credibilityWeight(-8), 6);
    // A source with no ledger entry ⇒ EXACTLY 1.0 (byte-identity).
    expect(fn('crown')).toBe(1.0);
    // The composite: a known-liar court fronted by a known-liar mouthpiece ⇒ the floor.
    const settW = credibilityWeight(-8);
    const composite = fn('raider#raider:reeve');
    expect(composite).toBeCloseTo(compositeCredibilityWeight(settW, credibilityWeight(-8)), 6);
    expect(composite).toBe(NPC_CREDIBILITY_TUNING.COMPOSITE_FLOOR); // two discounts hit the floor
  });
  it('the composite falls back to plain weighting when npcCredibility is dark (byte-identity)', () => {
    const worldState = {
      simulationRules: { infoMode: 'unreliable', infoStatecraftEnabled: true }, // no npcCredibilityEnabled
      spatialCanonVersion: 1,
      spatialLedgers: { credibility: { raider: { score: -8, lastUpdateTick: 0, holder: 'people_held' } } },
    };
    const fn = makeCredibilityWeightFn(worldState, 0);
    // A '#'-bearing source is NOT split when dark ⇒ treated as a plain (absent) id ⇒ 1.0.
    expect(fn('raider#raider:reeve')).toBe(1.0);
  });
});
