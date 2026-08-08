/**
 * spatialUsage.test.js — the privacy + signal contract for the Phase-5.5 spatial
 * usage side-channel (src/lib/spatialUsage.js).
 *
 * Same posture as pulseFingerprint.test.js: a post-tick worldState whose ledgers are
 * KEYED by distinctive settlement/npc ids and stuffed with prose fields is fed through
 * both extractors, and NONE of those strings may survive into the emitted shape (the
 * extractor must read counts + leaf numbers, never ids/keys/names). It also pins the
 * coarse signal (mover presence, counts, bands, config adoption) and proves the read is
 * PURE (the input worldState is never mutated — determinism side-channel guarantee).
 */

import { describe, it, expect } from 'vitest';
import { extractSpatialUsage } from '../../src/lib/spatialUsage.js';
import { extractCanonizeUsage } from '../../src/lib/spatialCanonizeUsage.js';

// Distinctive strings that must NEVER survive into any emitted shape.
const SENSITIVE = [
  'Blackreach',                 // settlement id / name
  'Lord Aldric Thorne',         // npc name
  'the smugglers of Duskport',  // prose
  'granary-riot-secret',        // free text
];

/** A rich post-tick worldState with sensitive ids as ledger KEYS + prose in records. */
function loadedWorldState() {
  return {
    spatialCanonVersion: 2,
    simulationRules: {
      presetId: 'full_simulation',
      infoMode: 'full',
      worldProgression: 'autonomous',
      politicalAutonomy: 'full',
      spatialMode: 'active',
      travelMode: 'spatial',
      migrationMode: 'roll',
      intensity: 'dramatic',
      seasonsEnabled: true,
      warLayerEnabled: true,
      commodityFlowEnabled: true,
      allyIntelSharingEnabled: true,
      routineMajorApproval: false,
      settlementStrategyEnabled: true,
      faithSpreadEnabled: false,
    },
    spatialLedgers: {
      embattlement: {
        'Blackreach': { level: 0.72, phase: 'embattled', sinceTick: 3, lastTick: 9, note: 'the smugglers of Duskport' },
        'Duskport': { level: 0.31, phase: 'calm', sinceTick: 8, lastTick: 9 }, // below ENTER
      },
      supplyShipments: {
        'Blackreach:smithy:iron': { settlementId: 'Blackreach', sourceId: 'Ironhold', arrivalTick: 11, starving: true },
        'Duskport:market:grain': { settlementId: 'Duskport', sourceId: 'Blackreach', arrivalTick: 10, smuggle: true },
        'Ironhold:forge:coal': { settlementId: 'Ironhold', sourceId: 'Blackreach', arrivalTick: 12 },
      },
      migration: {
        'Blackreach>Duskport@4': { originId: 'Blackreach', destId: 'Duskport', arrivals: 340, departTick: 4, arrivalTick: 9 },
        'Ironhold>Blackreach@5': { originId: 'Ironhold', destId: 'Blackreach', arrivals: 210, departTick: 5, arrivalTick: 10 },
      },
      armyTransit: {
        'army-of-Lord Aldric Thorne': { role: 'march', strength: 800, beliefStaleness: 2, lastTick: 9 },
        'garrison-column': { role: 'reinforcement', strength: 300, beliefStaleness: 0, lastTick: 9 },
      },
      entrepots: { 'Blackreach': { centrality: 0.6, toll: 0.4 } },
      tradeFlow: { 'Blackreach': { in: 5, out: 3 }, 'Duskport': { in: 2, out: 4 } },
      rumorLedgers: { 'Blackreach': { 'trade:evt1': { arrivalTick: 9 } } },
      beliefMaps: { 'Blackreach': { seat: { 'Duskport': { band: 3 } } } },
      moralDrift: { 'Blackreach': { malice: 0.4, lawlessness: 0.2, instigations: 1 } },
      dispatchWillingness: { 'Duskport': { phase: 'refusing', sinceTick: 7, lastTick: 9 } },
      spatialArrivals: { 'imp-1': { arrivalTick: 12, note: 'granary-riot-secret' } },
      // GR-2, and it is the ONE ARRAY-valued sub-ledger in the manifest. Its rows name
      // settlements outright and carry prose term sheets, so feeding it through the
      // canary above proves the extractor reads array INDICES as a count and never the
      // ids or the terms — the hygiene question the record-keyed ledgers cannot ask.
      pactProposals: [
        {
          id: 'pact.4.Blackreach.Duskport.shared_threat',
          from: 'Blackreach', to: 'Duskport', trigger: 'shared_threat',
          sheet: { terms: ['the smugglers of Duskport'] },
          openedTick: 4, answerDueTick: 12, state: 'open', transport: 'envoy',
        },
        {
          id: 'pact.6.Ironhold.Blackreach.trade_demand',
          from: 'Ironhold', to: 'Blackreach', trigger: 'trade_demand',
          sheet: { terms: ['granary-riot-secret'] },
          openedTick: 6, answerDueTick: 14, state: 'open', transport: 'abstract',
        },
      ],
    },
    proposals: [
      { id: 'p1', status: 'pending', outcome: { candidateType: 'strategy_deploy' }, headline: 'the smugglers of Duskport' },
      { id: 'p2', status: 'resolved', outcome: { candidateType: 'coup_succeeded' } },
      { id: 'p3', status: 'pending', outcome: { candidateType: 'coup_succeeded' } },
    ],
  };
}

describe('spatialUsage — privacy canary', () => {
  it('leaks no settlement/npc id, key, or prose into the emitted usage shape', () => {
    const ws = loadedWorldState();
    const out = JSON.stringify(extractSpatialUsage(ws));
    for (const s of SENSITIVE) {
      expect(out, `sensitive string leaked: ${s}`).not.toContain(s);
    }
    // Also assert no ledger KEY (the id) leaked — keys are ids we must never emit.
    for (const key of Object.keys(ws.spatialLedgers.embattlement)) {
      expect(out).not.toContain(key);
    }
  });

  it('the canonize summary leaks nothing either', () => {
    const digest = { settlementIds: ['Blackreach', 'Duskport'], spatialGeometryVersion: 1, costLawVersion: 1, overlayVersion: 2, reserved: { seaLanes: { note: 'the smugglers of Duskport' }, teleportEdges: null, seasonalOverlay: {} } };
    const out = JSON.stringify(extractCanonizeUsage(digest, 3, 61000));
    for (const s of SENSITIVE) expect(out).not.toContain(s);
  });
});

describe('spatialUsage — coarse signal', () => {
  it('counts mover activity id-free + bands the migration population', () => {
    const out = extractSpatialUsage(loadedWorldState());
    expect(out.spatial_active).toBe(true);
    expect(out.spatial_canon_version).toBe(2);
    // embattled = level >= 0.55 only (Duskport 0.31 excluded)
    expect(out.mover_counts.embattled).toBe(1);
    expect(out.mover_counts.caravans).toBe(3);
    expect(out.mover_counts.caravans_starving).toBe(1);
    expect(out.mover_counts.smuggle).toBe(1);
    expect(out.mover_counts.migration_columns).toBe(2);
    expect(out.mover_counts.armies_afield).toBe(2);
    expect(out.mover_counts.armies_cut_off).toBe(1);      // beliefStaleness > 0
    expect(out.mover_counts.dispatch_refusing).toBe(1);
    expect(out.mover_counts.approvals_pending).toBe(2);   // p1 + p3 (p2 resolved)
    // GR-2. THE TRACKED HALF OF THE MANIFEST IS NOT SELF-PROVING, which is why this
    // line exists. The coverage walker (tests/lib/spatialLedgerCoverage.walker.test.js)
    // asserts only that the written-key set equals TRACKED ∪ EXEMPT; `counts` and
    // MOVER_PRESENCE are function-LOCAL and unexported, so listing a key in
    // TRACKED_LEDGER_KEYS alone GREENS that gate while emitting nothing at all — the
    // credit-side enumeration that fails open. An EXEMPT row is self-proving (the reason
    // string is the artifact); a TRACKED row is a promise until something drives the
    // extractor. This drives it: two open proposals, counted off an ARRAY sub-ledger.
    expect(out.mover_counts.pacts_awaiting_answer).toBe(2);
    // migration pop 340 + 210 = 550 -> village_100_500? no, 550 -> small_town_500_2k
    expect(out.migration_pop_band).toBe('small_town_500_2k');
    // movers_active lists only the layers that fired
    expect(out.movers_active).toEqual(expect.arrayContaining([
      'embattlement', 'caravans', 'smuggle', 'migration', 'field_combat',
      'entrepots', 'trade_flow', 'rumor', 'belief', 'moral_drift',
      'dispatch_refusal', 'propagation', 'approval_queue',
      'pact_formation',
    ]));
  });

  it('counts the post-A1 merged-wave movers (lib-infra-copy-1)', () => {
    const ws = {
      spatialCanonVersion: 3,
      simulationRules: { presetId: 'full_simulation', navalEnabled: true, upswingArcsEnabled: true, momentumEnabled: true },
      spatialLedgers: {
        navalTransit: { 'convoy-1': { role: 'convoy' }, 'blockade-2': { role: 'blockade' } },
        epidemic: { 'Sable': { infected: 40 } },
        disinfo: { 'a>b': { potency: 0.5 } },
        credibility: { 'Envoy': { stock: 0.7 } },
        upswing: { 'Sable': { arc: 'reconstruction' } },
        commitments: { 'k1': { kind: 'levy' } },
        interventions: { 'i1': { patron: 'x' } },
        exposedCorruption: { 'guild-1': { severity: 0.6 } },
        satellites: { 's1': { host: 'Sable' } },
        campaignPlans: { 'plan-1': { target: 'Duskport' } },
      },
    };
    const out = extractSpatialUsage(ws);
    expect(out.mover_counts.naval).toBe(2);
    expect(out.mover_counts.epidemic_sites).toBe(1);
    expect(out.mover_counts.disinfo_active).toBe(1);
    expect(out.mover_counts.credibility_tracked).toBe(1);
    expect(out.mover_counts.upswing_arcs).toBe(1);
    expect(out.mover_counts.momentum_committed).toBe(1);
    expect(out.mover_counts.interventions).toBe(1);
    expect(out.mover_counts.corruption_exposed).toBe(1);
    expect(out.mover_counts.satellites).toBe(1);
    expect(out.mover_counts.war_campaigns).toBe(1);
    expect(out.movers_active).toEqual(expect.arrayContaining([
      'naval', 'epidemic', 'disinfo', 'credibility', 'upswing', 'momentum',
      'intervention', 'corruption_exposed', 'satellites', 'war_campaign',
    ]));
    expect(out.sim_config.flags_on).toEqual(expect.arrayContaining(['naval', 'upswingArcs', 'momentum']));
  });

  it('captures preset + info mode + only the ENABLED flags (adoption signal)', () => {
    const cfg = extractSpatialUsage(loadedWorldState()).sim_config;
    expect(cfg.preset_id).toBe('full_simulation');
    expect(cfg.info_mode).toBe('full');
    expect(cfg.world_progression).toBe('autonomous');
    expect(cfg.flags_on).toEqual(expect.arrayContaining(['seasons', 'warLayer', 'commodityFlow', 'allyIntelSharing', 'settlementStrategy']));
    expect(cfg.flags_on).not.toContain('routineMajorApproval'); // false
    expect(cfg.flags_on).not.toContain('faithSpread');          // false
  });
});

describe('spatialUsage — dormant / aspatial', () => {
  it('emits only the light config block when the spatial engine is off', () => {
    const out = extractSpatialUsage({ simulationRules: { presetId: 'realistic_regional' } });
    expect(out.spatial_active).toBe(false);
    expect(out.spatial_canon_version).toBe(0);
    expect(out.sim_config.preset_id).toBe('realistic_regional');
    expect(out.sim_config.info_mode).toBe('omniscient'); // default
    expect(out.sim_config.flags_on).toEqual([]);
    // no heavy mover block for an aspatial, mover-quiet tick
    expect(out.movers_active).toBeUndefined();
    expect(out.mover_counts).toBeUndefined();
  });

  it('tolerates a totally empty / undefined worldState without throwing', () => {
    expect(() => extractSpatialUsage(undefined)).not.toThrow();
    expect(() => extractSpatialUsage({})).not.toThrow();
    const out = extractSpatialUsage({});
    expect(out.spatial_active).toBe(false);
    expect(out.sim_config.info_mode).toBe('omniscient');
  });

  it('reports mover activity even before a spatial canon (movers can predate the digest read path)', () => {
    const out = extractSpatialUsage({ spatialLedgers: { supplyShipments: { 'a:b:c': { starving: false } } } });
    expect(out.spatial_active).toBe(false);
    expect(out.mover_counts.caravans).toBe(1);
    expect(out.movers_active).toContain('caravans');
  });
});

describe('spatialUsage — canonize summary', () => {
  it('marks the spatial path + records lit features and size band', () => {
    const digest = { settlementIds: ['a', 'b', 'c'], spatialGeometryVersion: 1, costLawVersion: 1, overlayVersion: 2, reserved: { airField: null, seaLanes: { edges: [] }, seasonalOverlay: { m: 1 }, teleportEdges: null } };
    const out = extractCanonizeUsage(digest, 1, 47000);
    expect(out.spatial).toBe(true);
    expect(out.spatial_canon_version).toBe(1);
    expect(out.is_recanonize).toBe(false);
    expect(out.has_sea_lanes).toBe(true);
    expect(out.has_seasonal).toBe(true);
    expect(out.has_teleport).toBe(false); // null reserved slot
    expect(out.overlay_version).toBe(2);
    expect(out.digest_bytes_band).toBe('20_60k');
  });

  it('flags a re-canonize (version > 1)', () => {
    const out = extractCanonizeUsage({ settlementIds: [], reserved: {} }, 4, 5000);
    expect(out.is_recanonize).toBe(true);
    expect(out.digest_bytes_band).toBe('lt_20k');
  });
});

describe('spatialUsage — purity (determinism side-channel)', () => {
  it('never mutates the input worldState', () => {
    const ws = loadedWorldState();
    const before = JSON.stringify(ws);
    extractSpatialUsage(ws);
    expect(JSON.stringify(ws)).toBe(before);
  });
});
