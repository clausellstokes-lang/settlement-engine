/**
 * beliefMapFactions.test.js — Phase 5.5 M9a, component (1): FACTION BELIEF MAPS.
 *
 * The belief ledger's factionId dimension ACTIVATES: per-faction beliefs fed by
 * their round-9 carrier organs (merchant←trade, military←army, criminal←smuggle),
 * the governing COALITION derivation (seat + relationship-allied factions), DISSENT
 * as an internal stressor (detectCouncilSchism), faction LEAKAGE via the compromise
 * system, the sparse-arrival cardinality law extended per-faction, and dormant
 * byte-identity (the seat slot + the whole layer are the SAME gate as Wave A).
 */
import { describe, it, expect } from 'vitest';

import {
  advanceBeliefMaps, governingCoalition, detectCouncilSchism, isFactionCompromised,
  GOVERNING_SEAT_KEY, PUBLIC_FACTION_KEY, FACTION_CARRIER_FRAMING,
} from '../../src/domain/worldPulse/beliefMap.js';

// ── Fixture builders ──────────────────────────────────────────────────────────
function item(id, factions = []) {
  return {
    id, name: id.toUpperCase(),
    settlement: {
      name: id, tier: 'town', population: 2000,
      config: { primaryDeitySnapshot: { name: 'Sol' } },
      powerStructure: { factions },
    },
  };
}
function snapshotOf(settlements, edges) {
  return { settlements, byId: new Map(settlements.map((s) => [s.id, s])), regionalGraph: { edges } };
}
/** A rumor arrival record about `subject`, carried with the given framing tags. */
function rec({ subject, framing, arrivalTick = 3, hopCount = 1, accuracy01 = 1, completeness01 = 1, score = 80 }) {
  return {
    eventRef: `evt-${subject}-${framing.join('') || 'amb'}`, eventTick: 1, carrier: 'trade',
    arrivalTick, hopCount, lineageIds: [`evt-${subject}`, 't'], corroborationRoots: ['t'],
    provenance: { originId: subject, relayIds: [] }, completeness01, accuracy01, framing,
    significance: 'notable', score, content: { whereId: subject, partyIds: [subject], magnitude: 2 },
    relayedTick: 1,
  };
}
function worldWith({ prior, rumorLedgers, infoMode = 'unreliable', marker = 1 }) {
  return {
    ...(marker ? { spatialCanonVersion: marker } : {}),
    simulationRules: { infoMode },
    relationshipStates: {},
    spatialLedgers: { ...(prior ? { beliefMaps: prior } : {}), ...(rumorLedgers ? { rumorLedgers } : {}) },
  };
}
const edges = [
  { id: 'e.ab', from: 'a', to: 'b', relationshipType: 'hostile' },
  { id: 'e.ac', from: 'a', to: 'c', relationshipType: 'rival' },
];
// 'a' governs via a government seat, with a merchant + military faction beside it.
const facA = [
  { faction: 'City Council', category: 'government', power: 60, isGoverning: true },
  { faction: 'Merchant League', category: 'merchant', power: 45 },
  { faction: 'Town Guard', category: 'military', power: 40 },
];
// A prior ledger so the NORMAL path (not cold-start) runs.
const priorSeatOnly = { a: { [GOVERNING_SEAT_KEY]: { b: { readiness: 0, strengthBand: 1, allianceLabel: 'hostile', faithLabel: null, confidence01: 0.6, lastUpdateTick: 0 } } } };

// ── Per-faction beliefs fed by the right carrier organ ────────────────────────
describe('M9a — per-faction beliefs are the carrier partition', () => {
  const settlements = [item('a', facA), item('b'), item('c')];
  const snapshot = snapshotOf(settlements, edges);

  it('the merchant slot is fed by TRADE-framed reports; the military slot by ARMY-framed', () => {
    const rumorLedgers = { a: {
      'trade:eb': rec({ subject: 'b', framing: ['merchant'] }),   // trade carrier → merchant
      'trade:ec': rec({ subject: 'c', framing: ['army'] }),       // army carrier → military
    } };
    const ws = worldWith({ prior: priorSeatOnly, rumorLedgers });
    const { next } = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: ws, tick: 5 });
    const a = next.a;
    // The dimension carries the seat PLUS the two fed faction slots.
    expect(GOVERNING_SEAT_KEY in a).toBe(true);
    expect(a.merchant?.b).toBeTruthy();     // merchant heard about b via trade
    expect(a.military?.c).toBeTruthy();     // military heard about c via couriers/army
    // The PARTITION is strict: the army report never reached the merchant slot.
    expect(a.merchant?.c).toBeUndefined();
    expect(a.military?.b).toBeUndefined();
  });

  it('the carrier→framing map wires the round-9 organs', () => {
    expect(FACTION_CARRIER_FRAMING).toMatchObject({ merchant: 'merchant', military: 'army', criminal: 'criminal', religious: 'faith' });
  });
});

// ── Sparse-arrival cardinality (extended per-faction) ─────────────────────────
describe('M9a — faction-belief cardinality stays sparse (arrival-driven)', () => {
  it('a present faction with NO carrier report materializes NO slot', () => {
    const snapshot = snapshotOf([item('a', facA), item('b'), item('c')], edges);
    // A merchant-framed report only about b: the military slot (no army report) never forms.
    const rumorLedgers = { a: { 'trade:eb': rec({ subject: 'b', framing: ['merchant'] }) } };
    const { next } = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: worldWith({ prior: priorSeatOnly, rumorLedgers }), tick: 5 });
    expect(next.a.merchant?.b).toBeTruthy();
    expect(next.a.military).toBeUndefined();  // no army report ⇒ no military slot
  });

  it('a settlement with NO carrier-mapped factions grows NO faction slots (only seat / ambient public)', () => {
    const snapshot = snapshotOf([item('a', [{ faction: 'Elders', category: 'government', isGoverning: true }]), item('b'), item('c')], edges);
    const rumorLedgers = { a: { 'trade:eb': rec({ subject: 'b', framing: ['merchant'] }) } };
    const { next } = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: worldWith({ prior: priorSeatOnly, rumorLedgers }), tick: 5 });
    // Government has no carrier feed → merchant/military/criminal slots never appear.
    expect(next.a.merchant).toBeUndefined();
    expect(next.a.military).toBeUndefined();
    expect(next.a.criminal).toBeUndefined();
  });
});

// ── Faction LEAKAGE via the compromise system ─────────────────────────────────
describe('M9a — a COMPROMISED faction leaks its intel to the public', () => {
  const compromisedMerchant = [
    { faction: 'City Council', category: 'government', power: 60, isGoverning: true },
    { faction: 'Merchant League', category: 'merchant', power: 45, impairments: [{ type: 'corruption', severity: 0.4 }] },
  ];
  const cleanMerchant = [
    { faction: 'City Council', category: 'government', power: 60, isGoverning: true },
    { faction: 'Merchant League', category: 'merchant', power: 45 },
  ];
  const rumorLedgers = { a: { 'trade:eb': rec({ subject: 'b', framing: ['merchant'] }) } };

  it('isFactionCompromised reads corruption / covert / capture / vector signals', () => {
    expect(isFactionCompromised({ impairments: [{ type: 'corruption' }] })).toBe(true);
    expect(isFactionCompromised({ impairments: [{ type: 'legitimacy', covert: true }] })).toBe(true);
    expect(isFactionCompromised({ captureState: 'corrupted' })).toBe(true);
    expect(isFactionCompromised({ corruptionVector: 'bribery' })).toBe(true);
    expect(isFactionCompromised({ impairments: [{ type: 'legitimacy' }] })).toBe(false);
    expect(isFactionCompromised({})).toBe(false);
  });

  it('the merchant carrier (no ambient) reaches the public ONLY when the merchant faction is compromised', () => {
    const snapshot = snapshotOf([item('a', compromisedMerchant), item('b'), item('c')], edges);
    const leaked = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: worldWith({ prior: priorSeatOnly, rumorLedgers }), tick: 5 }).next;
    expect(leaked.a[PUBLIC_FACTION_KEY]?.b).toBeTruthy();   // compromised ⇒ the private read spilled

    const cleanSnap = snapshotOf([item('a', cleanMerchant), item('b'), item('c')], edges);
    const sealed = advanceBeliefMaps({ snapshot: cleanSnap, pressureIdx: null, worldState: worldWith({ prior: priorSeatOnly, rumorLedgers }), tick: 5 }).next;
    expect(sealed.a[PUBLIC_FACTION_KEY]).toBeUndefined();   // sealed ⇒ nothing reached the public
  });
});

// ── The governing COALITION derivation (VI.4-1) ───────────────────────────────
describe('M9a — governingCoalition = seat + relationship-allied factions', () => {
  it('derives the governing archetype + folds the allied factions in', () => {
    const c = governingCoalition(item('a', facA));
    expect(c.governing).toBe('government');
    expect([...c.members].sort()).toEqual(['government', 'merchant', 'military']);
  });
  it('a faction on the seat’s rivals list is EXCLUDED from the coalition (an opponent)', () => {
    const withRival = [
      { id: 'f.seat', faction: 'City Council', category: 'government', isGoverning: true, rivals: ['f.merch'] },
      { id: 'f.merch', faction: 'Merchant League', category: 'merchant', power: 45 },
      { id: 'f.mil', faction: 'Town Guard', category: 'military', power: 40 },
    ];
    const c = governingCoalition(item('a', withRival));
    expect(c.opponents.has('merchant')).toBe(true);
    expect(c.members.has('merchant')).toBe(false);
    expect(c.members.has('military')).toBe(true);
  });
  it('an empty roster ⇒ no governing archetype, empty coalition', () => {
    const c = governingCoalition(item('a', []));
    expect(c.governing).toBeNull();
    expect(c.members.size).toBe(0);
  });
});

// ── DISSENT → council_schism (belief divergence across the factions) ──────────
describe('M9a — detectCouncilSchism fires on faction↔seat divergence', () => {
  const band = (b, conf, label = 'hostile') => ({ readiness: 0.2, strengthBand: b, allianceLabel: label, faithLabel: null, confidence01: conf, lastUpdateTick: 3 });

  it('a confident faction reading ≥2 bands off the seat splits the council', () => {
    const factionMaps = { [GOVERNING_SEAT_KEY]: { b: band(1, 0.9) }, merchant: { b: band(4, 0.9) } };
    const schism = detectCouncilSchism({ observerId: 'a', factionMaps, coalition: { members: new Set(['merchant']) } });
    expect(schism).toBeTruthy();
    expect(schism.factionKey).toBe('merchant');
    expect(schism.subjectId).toBe('b');
    expect(schism.bandGap).toBe(3);
    expect(schism.inCoalition).toBe(true);
    expect(schism.severity).toBeGreaterThan(0);
  });

  it('a small (1-band) disagreement is NOT a schism', () => {
    const factionMaps = { [GOVERNING_SEAT_KEY]: { b: band(3, 0.9) }, merchant: { b: band(4, 0.9) } };
    expect(detectCouncilSchism({ observerId: 'a', factionMaps, coalition: null })).toBeNull();
  });

  it('an UNSURE faction does not split the council (a vague hunch is not dissent)', () => {
    const factionMaps = { [GOVERNING_SEAT_KEY]: { b: band(1, 0.9) }, merchant: { b: band(4, 0.1) } };
    expect(detectCouncilSchism({ observerId: 'a', factionMaps, coalition: null })).toBeNull();
  });

  it('a HOSTILITY flip (faction reads hostile, seat does not) is a schism', () => {
    const factionMaps = {
      [GOVERNING_SEAT_KEY]: { b: band(2, 0.9, 'trade_partner') },
      military: { b: band(2, 0.9, 'hostile') },
    };
    const schism = detectCouncilSchism({ observerId: 'a', factionMaps, coalition: null });
    expect(schism).toBeTruthy();
    expect(schism.relFlip).toBe(true);
  });

  it('no faction slots (seat only) ⇒ never a schism', () => {
    expect(detectCouncilSchism({ observerId: 'a', factionMaps: { [GOVERNING_SEAT_KEY]: { b: band(1, 0.9) } }, coalition: null })).toBeNull();
  });
});

// ── Dormant byte-identity (faction slots are the SAME gate as the seat) ───────
describe('M9a — dormancy: faction slots never materialize off-marker', () => {
  const snapshot = snapshotOf([item('a', facA), item('b'), item('c')], edges);
  const rumorLedgers = { a: { 'trade:eb': rec({ subject: 'b', framing: ['merchant'] }) } };

  it('omniscient (marker present) ⇒ no advance, no faction slots', () => {
    const ws = worldWith({ prior: priorSeatOnly, rumorLedgers, infoMode: 'omniscient' });
    const { next, changed } = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: ws, tick: 5 });
    expect(changed).toBe(false);
    expect(next).toEqual(priorSeatOnly); // preserved untouched
  });

  it('no spatial marker ⇒ no advance even with a live infoMode', () => {
    const ws = worldWith({ prior: priorSeatOnly, rumorLedgers, marker: 0 });
    const { changed } = advanceBeliefMaps({ snapshot, pressureIdx: null, worldState: ws, tick: 5 });
    expect(changed).toBe(false);
  });
});
