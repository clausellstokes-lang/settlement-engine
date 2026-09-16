/**
 * roadsSecretsProbe.test.js — THE SECRETS DATA-PROBE for the Travelers overlay (R-6c / §19).
 *
 * DESIGN_THE_ROADS §15 classification: army positions/directions/ETAs, migrant column
 * positions, named-NPC envoy markers/intent, the roads ledger + ransoms, and npc.whereabouts
 * are ALL DM-SECRET. §15 binding: redaction means THE DATA DOES NOT SHIP (a payload assertion,
 * never a CSS check). The overlay reads these from campaign.worldState.spatialLedgers, which is
 * settlement-scope-excluded by the fail-closed toPublicSafe allowlist. This probe asserts, by
 * deep-scanning the shared payload, that ZERO overlay data reaches a shared/gallery/anonymous
 * client — naming the specific overlay ledgers R-6 renders.
 */
import { describe, it, expect } from 'vitest';
import { toPublicSafe } from '../../src/domain/display/publicSafe.js';

// A hydrated settlement carrying EVERY overlay data source a roads-bearing campaign holds.
const roadsBearing = {
  name: 'Saltmoor', tier: 'town', population: 1200,
  npcs: [
    { id: 'lord', name: 'Lord Varn', role: 'ruler', category: 'government',
      whereabouts: { state: 'hostage', placeId: 'dulwich', missionId: 'road.saltmoor.lord.10', purposeKind: 'diplomacy', sinceTick: 10, expectedReturnTick: null } },
    { id: 'envoy', name: 'The Envoy', role: 'merchant', category: 'economy',
      whereabouts: { state: 'traveling', placeId: 'dulwich', missionId: 'road.saltmoor.envoy.12', purposeKind: 'trade', sinceTick: 12, expectedReturnTick: 20 } },
  ],
  campaign: {
    worldState: {
      tick: 15,
      spatialLedgers: {
        armyTransit: { 'a>b': { armyId: 'saltmoor', destId: 'dulwich', path: ['saltmoor', 'dulwich'], departTick: 5, arrivalTick: 18, position01: 0.7 } },
        migration: { 'saltmoor:dulwich:5': { originId: 'saltmoor', destId: 'dulwich', arrivals: 60, departTick: 5, arrivalTick: 18 } },
        roads: {
          missions: { 'road.saltmoor.envoy.12': { npcKey: 'saltmoor:envoy', npcName: 'The Envoy', homeId: 'saltmoor', destId: 'dulwich', path: ['saltmoor', 'dulwich'], phase: 'traveling', purpose: { kind: 'trade' } } },
          ransoms: { 'ransom.road.saltmoor.lord.10': { npcKey: 'saltmoor:lord', captorId: 'dulwich', termWeeks: 39, remainingWeeks: 20, willConvert: true } },
        },
      },
    },
  },
};

// The secret tokens that must appear NOWHERE in the shared payload.
const SECRET_TOKENS = ['armyTransit', 'position01', 'ransom', 'willConvert', 'missionId', 'partyRelease', 'road.saltmoor', 'purposeKind'];

describe('roads secrets data-probe — the overlay never ships (§15 / §19)', () => {
  const out = toPublicSafe(roadsBearing);
  const serialized = JSON.stringify(out);

  it('the campaign block (holding worldState + every overlay ledger) is dropped whole', () => {
    expect(out.campaign, 'campaign.worldState.spatialLedgers must not ship').toBeUndefined();
  });

  it('no npc carries a whereabouts mirror on the public projection', () => {
    for (const n of (out.npcs || [])) {
      expect(n.whereabouts, `${n.id} leaked whereabouts`).toBeUndefined();
      expect(n.purposeKind).toBeUndefined();
    }
    // …ordinary public NPC fields still come through.
    expect((out.npcs || []).find(n => n.id === 'lord')?.name).toBe('Lord Varn');
  });

  it('a deep scan of the serialized shared payload finds ZERO overlay/roads secret tokens', () => {
    for (const token of SECRET_TOKENS) {
      expect(serialized.includes(token), `secret token "${token}" leaked into the shared payload`).toBe(false);
    }
  });

  it('ordinary public content still survives (the probe is not vacuous)', () => {
    expect(out.name).toBe('Saltmoor');
    expect(out.tier).toBe('town');
  });
});
