/**
 * roadsParty.test.js — THE PARTY'S HAND (R-5; DESIGN_THE_ROADS.md §11). The pure op bodies
 * (marker set / validation) + the mover's consumption of the whereabouts.partyRelease marker
 * as an early-release with the kind-specific write schedule, plus THE ROUND-TRIP PIN (§3):
 * edit→advance→undo leaves no orphan whereabouts/ledger state (the input snapshot is never
 * mutated, so restoring it — undoLastPulse's model — yields a clean hostage).
 */
import { describe, it, expect } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';
import {
  applyRoadsPartyRelease, isRoadsHostage, captorOfHostage, roadsRescueImpactAction, ROADS_RELEASE_MODE,
} from '../../src/domain/roads/ops.js';

const IDS = ['h', 'e'];
const MID = 'road.h.h:m.10';
const RID = `ransom.${MID}`;
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();
const graph = ensureRegionalGraph({ edges: [{ id: 'edge.h.e', from: 'h', to: 'e', relationshipType: 'trade_partner' }], channels: [{ from: 'h', to: 'e', type: 'trade_route', status: 'confirmed', strength: 0.5 }] });

const captive = (importance, partyRelease, willConvert = false) => ({
  id: 'm', name: 'The Captive', importance, category: 'economy', personality: { dominant: 'bold' },
  whereabouts: { state: 'hostage', placeId: 'e', purposeKind: 'trade', sinceTick: 10, expectedReturnTick: null, missionId: MID, ...(partyRelease ? { partyRelease } : {}) },
});
const settlement = (name, npcs, prosperity = 'Comfortable', legit = 55) => ({ name, tier: 'town', npcs, economicState: { prosperity }, powerStructure: { publicLegitimacy: { score: legit, label: 'Accepted' }, factions: [{ faction: 'C', isGoverning: true, power: 55 }] } });
const ransomRec = (willConvert = false) => ({
  id: RID, npcKey: 'h:m', npcName: 'The Captive', homeId: 'h', captorId: 'e', threatClass: 'T2',
  purposeKind: 'trade', missionId: MID, startedTick: 90, startedWeek: 95, termWeeks: 50, remainingWeeks: 50,
  hostileAtCapture: false, conversionRolled: true, willConvert,
});

// A direct-mover call at week 100 with an injected LONG-TERM ransom (remainingWeeks > 0, so the
// ONLY release cause is the party marker on the hostage's whereabouts). Full roster in `saves`;
// the update roster FILTERS the hostage (mimicking the pulse's off-stage snapshot).
function directPartyRelease(importance, partyRelease, { willConvert = false } = {}) {
  const h = settlement('Home', [captive(importance, partyRelease, willConvert)]);
  const e = settlement('Captorhold', [], 'Comfortable');
  const saves = [{ id: 'h', settlement: h }, { id: 'e', settlement: e }];
  const settlementUpdates = [{ saveId: 'h', settlement: { ...h, npcs: [] } }, { saveId: 'e', settlement: e }];
  const snapshot = { settlements: [{ id: 'h', name: 'Home', settlement: { ...h, npcs: [] } }, { id: 'e', name: 'Captorhold', settlement: e }] };
  const worldState = {
    rngSeed: 's', tick: 100, simulationRules: { roadsEnabled: true }, calendar: { elapsedWeeks: 100, year: 2 },
    spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: { roads: { ransoms: { [RID]: ransomRec(willConvert) } } },
  };
  return { worldState, out: advanceRoads({ snapshot, worldState, settlementUpdates, saves, graph, tick: 100, now: null }) };
}
const roadsOf = (r) => r.worldState?.spatialLedgers?.roads || {};
const upd = (r, id) => r.settlementUpdates.find((u) => u.saveId === id).settlement;

// ── THE PURE OP BODIES ────────────────────────────────────────────────────────
describe('roads party ops — pure bodies (§11)', () => {
  const hostageS = () => ({ npcs: [captive('key')] });
  it('applyRoadsPartyRelease stamps whereabouts.partyRelease on a hostage', () => {
    const r = applyRoadsPartyRelease(hostageS(), 0, 'ransom-npc');
    expect(r.ok).toBe(true);
    expect(r.settlement.npcs[0].whereabouts.partyRelease).toBe('ransom');
    const r2 = applyRoadsPartyRelease(hostageS(), 0, 'rescue-npc');
    expect(r2.settlement.npcs[0].whereabouts.partyRelease).toBe('rescue');
  });
  it('refuses a non-hostage, a bad index, and an unknown kind (no mutation)', () => {
    const s = { npcs: [{ id: 'x', name: 'Homebody' }] };
    expect(applyRoadsPartyRelease(s, 0, 'ransom-npc').ok).toBe(false);
    expect(applyRoadsPartyRelease(hostageS(), 9, 'ransom-npc').ok).toBe(false);
    expect(applyRoadsPartyRelease(hostageS(), 0, 'edit-npc').ok).toBe(false);
    // input never mutated (a NEW settlement is returned on success only)
    const before = hostageS(); applyRoadsPartyRelease(before, 0, 'edit-npc');
    expect(before.npcs[0].whereabouts.partyRelease).toBeUndefined();
  });
  it('helpers: isRoadsHostage / captorOfHostage / roadsRescueImpactAction', () => {
    expect(isRoadsHostage(captive('key'))).toBe(true);
    expect(isRoadsHostage({ whereabouts: { state: 'traveling' } })).toBe(false);
    expect(captorOfHostage(captive('key'))).toBe('e');
    expect(roadsRescueImpactAction('h', 'e')).toEqual({ kind: 'inflame_relationship', settlementId: 'h', relationshipTargetId: 'e' });
    expect(roadsRescueImpactAction('h', 'h')).toBeNull();
    expect(roadsRescueImpactAction('h', '')).toBeNull();
    expect(ROADS_RELEASE_MODE['ransom-npc']).toBe('ransom');
  });
});

// ── THE MOVER CONSUMPTION ───────────────────────────────────────────────────────
describe('roads party ops — the mover consumes the marker (§11 write schedule)', () => {
  it('no marker + a long term ⇒ still captive (baseline: the marker is the only release cause)', () => {
    const { out } = directPartyRelease('key', null);
    expect(roadsOf(out).ransoms[RID], 'the captive is still held').toBeTruthy();
    expect(Object.values(roadsOf(out).missions || {}).length, 'no returning mission').toBe(0);
  });

  it('ransom-npc: released mid-term, captor STILL books the prosperity pulse, home legit UNTOUCHED', () => {
    const { out } = directPartyRelease('key', 'ransom');
    expect(roadsOf(out).ransoms || {}, 'the ransom cleared').toEqual({});
    const mission = Object.values(roadsOf(out).missions || {})[0];
    expect(mission.phase, 'a returning leg is born').toBe('returning');
    expect(mission.releasedFromRansom).toBe(true);
    // captor +1 prosperity band-step (key captive meets the credit floor)
    expect(upd(out, 'e').economicState.prosperity, 'captor prosperity pulse kept').toBe('Prosperous');
    // home seat legitimacy UNTOUCHED (the party's coin covered the treasury bleed)
    expect(upd(out, 'h').powerStructure.publicLegitimacy.score, 'home legit not hit').toBe(55);
    // home prosperity UNTOUCHED (no pillar debit — the party paid, not the home)
    expect(upd(out, 'h').economicState.prosperity).toBe('Comfortable');
  });

  it('rescue-npc: released mid-term, NO captor credit, home legit UNTOUCHED, conversion VOIDED', () => {
    const { out } = directPartyRelease('key', 'rescue', { willConvert: true });
    expect(roadsOf(out).ransoms || {}, 'the ransom cleared').toEqual({});
    const mission = Object.values(roadsOf(out).missions || {})[0];
    expect(mission.phase).toBe('returning');
    expect(mission.willConvert, 'conversion voided on the returning mission').toBe(false);
    expect(upd(out, 'e').economicState.prosperity, 'no captor credit').toBe('Comfortable');
    expect(upd(out, 'h').powerStructure.publicLegitimacy.score, 'home legit not hit').toBe(55);
  });

  it('a released captive appears in the FULL-roster mirror update with whereabouts=returning, marker cleared', () => {
    const { out } = directPartyRelease('key', 'ransom');
    const homeNpcs = upd(out, 'h').npcs;
    const captiveNpc = homeNpcs.find((n) => n.id === 'm');
    expect(captiveNpc.whereabouts.state, 'now returning, not hostage').toBe('returning');
    expect(captiveNpc.whereabouts.partyRelease, 'the marker is cleared by the mirror pass').toBeUndefined();
  });
});

// ── THE ROUND-TRIP PIN (§3): no orphan whereabouts/ledger; the input snapshot is pure ──
describe('roads party ops — edit→advance→undo leaves no orphan (§3 pin)', () => {
  for (const mode of ['ransom', 'rescue']) {
    it(`${mode}: the advance never mutates the input worldState (undo restores a clean hostage)`, () => {
      const { worldState, out } = directPartyRelease('key', mode);
      // The PRE-advance ledger (what undoLastPulse restores from its snapshot) is untouched:
      // the ransom record survives on the input, so restoring it re-seats the hostage cleanly.
      expect(worldState.spatialLedgers.roads.ransoms[RID], 'input ransom intact (undo target)').toBeTruthy();
      // The advance produced a DIFFERENT worldState (the release), never the same reference.
      expect(out.worldState).not.toBe(worldState);
      // No orphan: after release the ledger has NO ransom for the captive AND the mirror shows
      // a returning (not hostage, not stale-marker) whereabouts — the two agree.
      expect(roadsOf(out).ransoms || {}).toEqual({});
      const captiveNpc = upd(out, 'h').npcs.find((n) => n.id === 'm');
      expect(captiveNpc.whereabouts.state).toBe('returning');
      expect(captiveNpc.whereabouts.partyRelease).toBeUndefined();
    });
  }
});
