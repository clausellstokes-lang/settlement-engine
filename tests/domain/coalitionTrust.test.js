/**
 * coalitionTrust.test.js — DEEP COUPLINGS D-7c/D-7e THE COALITION COOPERATION deposit
 * (DESIGN_DEEP_COUPLINGS.md §10.5; the positive sign of the symmetric faction-pair ledger).
 *
 * Factions standing together in a settlement's GOVERNING COALITION slowly BUILD alliance-trust —
 * a year-cadence accrual through the faction-pair ledger's OWN writer, memoryWeave-gated (DARK ⇒
 * byte-identical). The mirror of the contest-loss resentment deposit: one ledger, both signs.
 */
import { describe, it, expect } from 'vitest';
import { depositCoalitionTrust, COALITION_TRUST_TUNING } from '../../src/domain/worldPulse/factionCompetition.js';

// A settlement item with a governing seat (highest power) + allies; `rivals` on the seat name
// its OPPONENTS (excluded from the coalition). The roster shape governingCoalition reads.
const item = (rivals = []) => ({
  id: 's1',
  settlement: { powerStructure: { factions: [
    { name: 'Merchant Guild', category: 'merchant', power: 0.8, rivals },
    { name: 'House Vane', category: 'noble', power: 0.5 },
    { name: 'Dockhands', category: 'labor', power: 0.3 },
  ] } },
});
const snap = (it) => ({ settlements: [it] });
const litWS = () => ({ simulationRules: { memoryWeaveEnabled: true } });

describe('D-7c/e coalition cooperation — the alliance-trust deposit', () => {
  it('DARK: memoryWeave absent ⇒ the SAME worldState reference back (byte-identical, no ledger)', () => {
    const ws = { simulationRules: {} };
    expect(depositCoalitionTrust(ws, snap(item()), 100)).toBe(ws);
    expect(depositCoalitionTrust(ws, snap(item()), 100).factionPairStates).toBeUndefined();
  });

  it('LIT: co-governing factions build POSITIVE trust via a coalition_standing incident', () => {
    const out = depositCoalitionTrust(litWS(), snap(item()), 100);
    const keys = Object.keys(out.factionPairStates || {});
    expect(keys.length).toBeGreaterThan(0);        // a unified council ⇒ every ally pair co-governs
    const rec = out.factionPairStates[keys[0]];
    expect(rec.trust).toBeGreaterThan(0);          // the POSITIVE sign
    expect(rec.resentment).toBe(0);                // no negative sign from cooperation
    expect(rec.incidents.some((i) => i.type === 'coalition_standing')).toBe(true);
  });

  it('the SEAT rival is an OPPONENT ⇒ excluded from the coalition (no trust minted with it)', () => {
    const out = depositCoalitionTrust(litWS(), snap(item(['House Vane'])), 100);
    const keys = Object.keys(out.factionPairStates || {});
    expect(keys.length).toBeGreaterThan(0);        // merchant + labor still co-govern
    expect(keys.every((k) => !k.toLowerCase().includes('vane'))).toBe(true); // the noble opponent is out
  });

  it('YEAR-CADENCE: a second pass within the year is a no-op (no double deposit, no ring spam)', () => {
    const once = depositCoalitionTrust(litWS(), snap(item()), 100);
    const k = Object.keys(once.factionPairStates)[0];
    const twice = depositCoalitionTrust(once, snap(item()), 100 + COALITION_TRUST_TUNING.YEAR_WEEKS - 22);
    expect(twice.factionPairStates[k].trust).toBe(once.factionPairStates[k].trust);
    expect(twice.factionPairStates[k].incidents.filter((i) => i.type === 'coalition_standing').length).toBe(1);
  });

  it('a YEAR later the trust BUILDS (a second coalition_standing lands, sustained co-governance)', () => {
    const y1 = depositCoalitionTrust(litWS(), snap(item()), 100);
    const k = Object.keys(y1.factionPairStates)[0];
    const y2 = depositCoalitionTrust(y1, snap(item()), 100 + COALITION_TRUST_TUNING.YEAR_WEEKS + 8);
    expect(y2.factionPairStates[k].trust).toBeGreaterThan(y1.factionPairStates[k].trust);
  });

  it('a lone governing faction (no ally) mints nothing (< 2 co-governing ⇒ no pair)', () => {
    const solo = { id: 's2', settlement: { powerStructure: { factions: [{ name: 'The Council', category: 'civic', power: 0.9 }] } } };
    const out = depositCoalitionTrust(litWS(), snap(solo), 100);
    expect(out.factionPairStates).toBeUndefined();
  });
});
