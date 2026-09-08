/**
 * roadsProvenanceThread.test.js — DEEPER PROVENANCE THREADING (DESIGN_VISION_WAVE V-24d, the
 * roads captivity lineage). When a captivity RESOLVES, the release beat now carries a `causedBy`
 * that traces BACK to the CAPTURE receipt that began it — a genuinely deeper cause-edge than the
 * release beat's own root. FLAG-DARK BYTE-NEUTRAL: the causedBy appears ONLY when
 * provenanceLedgerEnabled is lit; with provenance dark the beat is byte-identical (the
 * existing-provenance discipline). Plus the "walks deeper" pin: the provenance kernel records the
 * release→capture edge, connecting two receipts that were isolated before.
 */
import { describe, it, expect } from 'vitest';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { advanceRoads } from '../../src/domain/worldPulse/roadsKernel.js';
import { captureCauseId } from '../../src/domain/roads/state.js';
import { collectProvenanceEdges } from '../../src/domain/worldPulse/provenanceKernel.js';
import { buildRecordedEdges, hasRecordedEdge } from '../../src/domain/display/chronicleGraph.js';

const IDS = ['h', 'e'];
const MID = 'road.h.h:m.10';
const RID = `ransom.${MID}`;
const START_TICK = 90;          // the capture tick (r.startedTick)
const RELEASE_TICK = 100;       // the mover's tick this advance
// The capture receipt's node id, as roadsBeat mints it (wizard_news.${tick}.roads.${sid}.${seed},
// seed = `capture.${mid}`) — the exact id the release's causedBy must reconstruct.
const CAPTURE_ID = `wizard_news.${START_TICK}.roads.h.capture.${MID}`;

const DIGEST = (() => {
  const pack = makeGridPack({ cols: 5, rows: 4 });
  const placed = placeSettlements(pack, IDS.length);
  return buildSpatialDigest({ pack, placements: placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId })) });
})();
const graph = ensureRegionalGraph({ edges: [{ id: 'edge.h.e', from: 'h', to: 'e', relationshipType: 'trade_partner' }], channels: [{ from: 'h', to: 'e', type: 'trade_route', status: 'confirmed', strength: 0.5 }] });

const captive = () => ({
  id: 'm', name: 'The Captive', importance: 'key', category: 'economy', personality: { dominant: 'bold' },
  whereabouts: { state: 'hostage', placeId: 'e', purposeKind: 'trade', sinceTick: START_TICK, expectedReturnTick: null, missionId: MID, partyRelease: 'ransom' },
});
const settlement = (name, npcs) => ({ name, tier: 'town', npcs, economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55, label: 'Accepted' }, factions: [{ faction: 'C', isGoverning: true, power: 55 }] } });
const ransomRec = () => ({
  id: RID, npcKey: 'h:m', npcName: 'The Captive', homeId: 'h', captorId: 'e', threatClass: 'T2',
  purposeKind: 'trade', missionId: MID, startedTick: START_TICK, startedWeek: 95, termWeeks: 50, remainingWeeks: 50,
  hostileAtCapture: false, conversionRolled: true, willConvert: false,
});

function runRelease({ provenanceLit }) {
  const h = settlement('Home', [captive()]);
  const e = settlement('Captorhold', []);
  const saves = [{ id: 'h', settlement: h }, { id: 'e', settlement: e }];
  const settlementUpdates = [{ saveId: 'h', settlement: { ...h, npcs: [] } }, { saveId: 'e', settlement: e }];
  const snapshot = { settlements: [{ id: 'h', name: 'Home', settlement: { ...h, npcs: [] } }, { id: 'e', name: 'Captorhold', settlement: e }] };
  const simulationRules = provenanceLit ? { roadsEnabled: true, provenanceLedgerEnabled: true } : { roadsEnabled: true };
  const worldState = {
    rngSeed: 's', tick: RELEASE_TICK, simulationRules, calendar: { elapsedWeeks: RELEASE_TICK, year: 2 },
    spatialCanonVersion: 1, spatialDigest: DIGEST, spatialLedgers: { roads: { ransoms: { [RID]: ransomRec() } } },
  };
  return advanceRoads({ snapshot, worldState, settlementUpdates, saves, graph, tick: RELEASE_TICK, now: null });
}
const releaseBeatOf = (out) => (out.newsEntries || []).find((n) => Array.isArray(n.tags) && n.tags.some((t) => String(t).startsWith('ransom')));

describe('roads provenance threading — the release traces back to the capture (V-24d)', () => {
  it('captureCauseId reconstructs the exact capture receipt node id when provenance is lit', () => {
    const r = ransomRec();
    expect(captureCauseId({ simulationRules: { provenanceLedgerEnabled: true } }, r)).toBe(CAPTURE_ID);
    // Dark ⇒ undefined (the byte-neutral gate).
    expect(captureCauseId({ simulationRules: {} }, r)).toBeUndefined();
    expect(captureCauseId(null, r)).toBeUndefined();
  });

  it('provenance LIT: the release beat carries causedBy → the capture receipt', () => {
    const beat = releaseBeatOf(runRelease({ provenanceLit: true }));
    expect(beat, 'a release beat fired').toBeTruthy();
    expect(beat.causedBy).toBe(CAPTURE_ID);
  });

  it('provenance DARK: the release beat carries NO causedBy (byte-neutral)', () => {
    const beat = releaseBeatOf(runRelease({ provenanceLit: false }));
    expect(beat, 'a release beat fired').toBeTruthy();
    expect('causedBy' in beat, 'the causedBy key is absent when dark').toBe(false);
  });

  it('walks deeper: the provenance kernel records the release→capture edge (isolated before)', () => {
    const release = releaseBeatOf(runRelease({ provenanceLit: true }));
    // The capture receipt as it was recorded at the capture tick (its own root edge).
    const capture = { id: CAPTURE_ID, sourceEventId: `capture.${MID}`, impactKind: 'roads' };
    const durableIds = new Set([release.id, CAPTURE_ID]);
    const ledger = collectProvenanceEdges({ outcomes: [], newsEntries: [capture, release], durableIds, tick: RELEASE_TICK });
    // The release entry now lists the capture receipt among its parents — the new deep edge.
    expect(ledger[release.id].parents).toContain(CAPTURE_ID);
    // And it connects: a recorded edge exists between the release and the capture nodes.
    const edges = buildRecordedEdges(ledger);
    expect(hasRecordedEdge(release.id, CAPTURE_ID, edges)).toBe(true);
  });
});
