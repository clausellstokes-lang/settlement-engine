/**
 * roadsRansom.test.js — THE RANSOM WRITE SCHEDULE + EARLY RELEASE (R-4b; DESIGN_THE_ROADS.md
 * §9). The write schedule is proven with DETERMINISTIC direct-mover calls (no base-sim noise
 * on legitimacy/prosperity); the capture→ransom→release round-trip + off-stage participation
 * is proven through the REAL pulse pipeline (the lit walkthrough).
 */
import { describe, it, expect } from 'vitest';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['h', 'e'];
const MID = 'road.h.h:m.10';
const RID = `ransom.${MID}`;
const DIGEST = (() => {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();
const graph = ensureRegionalGraph({ edges: [{ id: 'edge.h.e', from: 'h', to: 'e', relationshipType: 'trade_partner' }], channels: [{ from: 'h', to: 'e', type: 'trade_route', status: 'confirmed', strength: 0.5 }] });

const captive = (importance) => ({ id: 'm', name: 'The Captive', importance, category: 'economy', personality: { dominant: 'bold' }, whereabouts: { state: 'hostage', placeId: 'e', purposeKind: 'trade', sinceTick: 10, expectedReturnTick: null, missionId: MID } });
const settlement = (name, npcs, prosperity = 'Comfortable', legit = 55) => ({ name, tier: 'town', npcs, economicState: { prosperity }, powerStructure: { publicLegitimacy: { score: legit, label: 'Accepted' }, factions: [{ faction: 'C', isGoverning: true, power: 55 }] } });
const ransomRec = (importance, captorId, { termWeeks = 5, startedWeek = 90, startedYear, hostileAtCapture = false, willConvert = false } = {}) => ({
  id: RID, npcKey: 'h:m', npcName: 'The Captive', homeId: 'h', captorId, threatClass: 'T2',
  purposeKind: 'trade', missionId: MID, startedTick: 90, startedWeek, termWeeks, remainingWeeks: termWeeks,
  ...(Number.isFinite(startedYear) ? { startedYear } : {}),
  hostileAtCapture, conversionRolled: true, willConvert,
});

// A direct-mover call at week 100 with an injected ransom (full roster in `saves`; the update
// roster FILTERS the hostage, mimicking the pulse). captorId 'e' is a settlement; a phantom id is
// "razed".
function directRelease(importance, captorId, opts = {}) {
  const h = settlement('Home', [captive(importance)]);
  const e = settlement('Captorhold', [], 'Comfortable');
  const saves = [{ id: 'h', settlement: h }, { id: 'e', settlement: e }];
  const settlementUpdates = [{ saveId: 'h', settlement: { ...h, npcs: [] } }, { saveId: 'e', settlement: e }]; // hostage filtered out
  const snapshot = { settlements: [{ id: 'h', name: 'Home', settlement: { ...h, npcs: [] } }, { id: 'e', name: 'Captorhold', settlement: e }] };
  const worldState = {
    rngSeed: 's', tick: 100, simulationRules: { roadsEnabled: true }, calendar: { elapsedWeeks: 100, year: 2 },
    spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: { roads: { ransoms: { [RID]: ransomRec(importance, captorId, opts) } } },
  };
  return advanceRoads({ snapshot, worldState, settlementUpdates, saves, graph, tick: 100, now: null });
}
const roadsOf = (r) => r.worldState?.spatialLedgers?.roads || {};
const upd = (r, id) => r.settlementUpdates.find((u) => u.saveId === id).settlement;

describe('roads ransom — the term-end write schedule (§9, deterministic)', () => {
  it('KEY captive: term completes ⇒ ransom clears, a returning mission is born, home −1 legit, captor +1 prosperity', () => {
    const r = directRelease('key', 'e');
    expect(roadsOf(r).ransoms || {}, 'the ransom record cleared on release').toEqual({});
    const mission = Object.values(roadsOf(r).missions || {})[0];
    expect(mission, 'a returning mission carries the captive home').toBeTruthy();
    expect(mission.phase).toBe('returning');
    expect(mission.releasedFromRansom).toBe(true);
    expect(upd(r, 'h').powerStructure.publicLegitimacy.score, 'home bled −1 legitimacy (the treasury paid)').toBe(54);
    expect(upd(r, 'e').economicState.prosperity, 'the captor booked +1 prosperity (key captive)').toBe('Prosperous');
    // the captive is mirrored as returning (on-stage again), still in the roster (NO-DEATH).
    const m = upd(r, 'h').npcs.find((n) => n.id === 'm');
    expect(m.whereabouts.state).toBe('returning');
  });

  it('PILLAR captive: home ALSO −1 prosperity band (§20 Q10), captor still +1', () => {
    const r = directRelease('pillar', 'e');
    expect(upd(r, 'h').economicState.prosperity, 'a realm notices ransoming a pillar (home −1 band: Comfortable→Moderate)').toBe('Moderate');
    expect(upd(r, 'e').economicState.prosperity).toBe('Prosperous');
  });

  it('release resumes the captured mission id and its original genesis year', () => {
    const r = directRelease('key', 'e', { startedYear: 1 });
    expect(Object.keys(roadsOf(r).missions || {})).toEqual([MID]);
    const mission = roadsOf(r).missions[MID];
    expect(mission.id).toBe(MID);
    expect(mission.startedYear).toBe(1);
    expect(mission.departTick, 'the resumed return leg still begins at release').toBe(100);
  });
});

describe('roads ransom — EARLY RELEASE (§9): skips the captor credit + the final hit', () => {
  it('captor razed (not a live settlement) ⇒ release with NO captor credit and NO home legit hit', () => {
    const r = directRelease('key', 'ghosthold', { termWeeks: 40, startedWeek: 99 }); // not term-end; captor gone
    expect(roadsOf(r).ransoms || {}, 'released early').toEqual({});
    expect(Object.values(roadsOf(r).missions || {})[0].phase).toBe('returning');
    expect(upd(r, 'h').powerStructure.publicLegitimacy.score, 'no final legitimacy hit on early release').toBe(55);
  });
  it('PEACE (hostile-at-capture, relationship now normalized) ⇒ early release, no schedule', () => {
    const r = directRelease('key', 'e', { termWeeks: 40, startedWeek: 99, hostileAtCapture: true }); // rel h↔e is trade_partner ⇒ peace
    expect(roadsOf(r).ransoms || {}, 'released on peace').toEqual({});
    expect(upd(r, 'h').powerStructure.publicLegitimacy.score, 'no final hit on early release').toBe(55);
    expect(upd(r, 'e').economicState.prosperity, 'no captor credit on early release').toBe('Comfortable');
  });
});

describe('roads ransom — the lit walkthrough (real pipeline: off-stage while captive, then home)', () => {
  it('capture→ransom→release round-trip: off-stage during captivity, a ransom-paid beat, then home; roster conserved', () => {
    const town = (name, npcs) => ({ name, tier: 'town', population: 3000, config: { tradeRouteAccess: 'road', economicBase: 'trade' }, institutions: [{ name: 'Town hall', status: 'active' }], economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [{ faction: 'C', isGoverning: true, power: 55 }] }, activeConditions: [], calamityHistory: [], npcs });
    let saves = [
      { id: 'h', name: 'Home', phase: 'canon', settlement: town('Home', [captive('key')]), campaignState: { phase: 'canon', eventLog: [], locks: {} } },
      { id: 'e', name: 'Captorhold', phase: 'canon', settlement: town('Captorhold', []), campaignState: { phase: 'canon', eventLog: [], locks: {} } },
    ];
    let campaign = {
      id: 'c', name: 'c', settlementIds: [...IDS],
      worldState: { rngSeed: 's', tick: 10, simulationRules: { roadsEnabled: true, warLayerEnabled: false }, calendar: { elapsedWeeks: 10, year: 1 }, spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: { roads: { ransoms: { [RID]: ransomRec('key', 'e', { termWeeks: 4, startedWeek: 10 }) } } }, stressors: [] },
      regionalGraph: graph, wizardNews: { currentTick: 10, entries: [] },
    };
    let sawHostage = false; let sawRansomBeat = false;
    for (let t = 0; t < 14; t++) {
      const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
      for (const e of (r.wizardNews?.entries || [])) if (e?.impactKind === 'roads' && Array.isArray(e.tags) && e.tags.includes('ransom')) sawRansomBeat = true;
      const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
      saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
      const m = saves.find((s) => s.id === 'h')?.settlement?.npcs?.find((n) => n.id === 'm');
      if (m?.whereabouts?.state === 'hostage') sawHostage = true;
      campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
    }
    expect(sawHostage, 'the captive was off-stage (hostage) during captivity').toBe(true);
    expect(sawRansomBeat, 'a ransom-paid beat fired at release').toBe(true);
    const finalM = saves.find((s) => s.id === 'h').settlement.npcs.find((n) => n.id === 'm');
    expect(finalM, 'the captive still exists — never removed (NO-DEATH)').toBeTruthy();
    expect(finalM.whereabouts, 'the captive is home (whereabouts cleared)').toBeUndefined();
  }, 60_000);
});
