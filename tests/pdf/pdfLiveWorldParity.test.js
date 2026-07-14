/**
 * tests/pdf/pdfLiveWorldParity.test.js — pdf-1.
 *
 * The PDF's Faith & War chapter printed a pre-spatial world: no rumors, no belief
 * divergence, no M6d trade-flow drift, no pestilence — while the screen dossier
 * showed them. This wave threads those reads into vm.liveWorld and FaithWar.
 *
 * THE LIVE-LAYER PARITY LANE (structural prevention): the on-screen dossier gains a
 * new living-world read-model roughly every mover. This registry + walker asserts
 * the PDF's liveWorld slice carries EACH such key, so a future mover that surfaces a
 * read on the screen but forgets the PDF trips this test instead of silently
 * re-opening the parity gap. Adding a screen living-world read ⇒ add its liveWorld
 * key here and thread it in buildPdfLiveWorld.
 */
import { describe, test, expect } from 'vitest';
import { buildViewModel } from '../../src/pdf/lib/viewModel.js';
import { GOVERNING_SEAT_KEY } from '../../src/domain/worldPulse/beliefMap.js';

// Every living-world key the PDF liveWorld slice must surface. Keyed on the
// worldState-derived facts the screen dossier already shows.
const LIVE_LAYER_FIELDS = [
  // The reads this wave added (pdf-1) — the ones that were silently missing:
  'rumors', 'beliefs', 'flowDrift', 'pestilence',
  // The war/faith reads already present — kept in the lane so they can't regress:
  'atWar', 'tradeWars', 'mobilization', 'army', 'tradePressure',
  'deity', 'pantheon', 'realmArcs', 'livePantheon',
];

function liveSettlement() {
  return {
    name: 'Faithhold', tier: 'town', population: 1200,
    config: { tradeRouteAccess: 'road', primaryDeitySnapshot: { name: 'The Iron Lord', rankAxis: 'major', alignmentAxis: 'neutral', temperamentAxis: 'warlike' } },
    economicState: { primaryImports: [], primaryExports: [] },
    powerStructure: { publicLegitimacy: { score: 40 }, factions: [], conflicts: [] },
    institutions: [], npcs: [],
  };
}
function liveCampaign() {
  return {
    settlementId: 'faithhold',
    worldState: {
      tick: 20,
      spatialLedgers: { beliefMaps: { faithhold: { [GOVERNING_SEAT_KEY]: {
        rivertown: { readiness: 0.75, strengthBand: 3, allianceLabel: 'trade_partner', faithLabel: null, confidence01: 0.9, lastUpdateTick: 19 },
      } } } },
    },
    nameById: { rivertown: 'Rivertown', faithhold: 'Faithhold' },
  };
}

describe('pdf-1 — PDF live-layer parity', () => {
  const vm = buildViewModel({ settlement: liveSettlement(), campaign: liveCampaign() });

  test('vm.liveWorld carries EVERY live-layer field (mover-proof parity lane)', () => {
    expect(vm.liveWorld).toBeTruthy();
    const missing = LIVE_LAYER_FIELDS.filter((k) => !(k in vm.liveWorld));
    expect(missing, `liveWorld is missing living-world reads: ${missing.join(', ')}`).toEqual([]);
  });

  test('belief-divergence is wired (the DM projection reaches the premium chapter)', () => {
    expect(vm.liveWorld.beliefs.length).toBeGreaterThan(0);
    expect(vm.liveWorld.beliefs[0].subject).toBe('Rivertown');
    expect(vm.liveWorld.beliefs[0]).toHaveProperty('divergence');
  });

  test('rumors are the PLAYER projection — no DM truth block reaches the shareable PDF', () => {
    // includeGroundTruth:false ⇒ no rumor carries a `truth` field (adversarial scrub).
    for (const r of vm.liveWorld.rumors) expect(r).not.toHaveProperty('truth');
  });

  test('a dormant / non-campaign settlement ⇒ liveWorld is null (byte-identical off-state)', () => {
    const plain = { name: 'Plain Thorp', tier: 'thorp', population: 40, config: {}, economicState: {}, powerStructure: {}, institutions: [], npcs: [] };
    expect(buildViewModel({ settlement: plain }).liveWorld).toBeNull();
  });
});
