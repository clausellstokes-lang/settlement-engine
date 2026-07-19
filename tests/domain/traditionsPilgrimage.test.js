/**
 * traditionsPilgrimage.test.js — THE TRADITIONS wave, Wave C seam 5: CROSS-SETTLEMENT PILGRIMAGE.
 *
 * Pins:
 *   • drawsPilgrims — only a GRAND crowd-drawing observance (procession/offering/fair at town+,
 *     or any metropolis spectacle) draws pilgrims.
 *   • pilgrimageDraw — a bounded, deterministic attendance lift over the frozen spatial digest;
 *     ASPATIAL (no digest) ⇒ 0 (the byte-identity source); more/closer/bigger neighbours ⇒ more draw.
 *   • THE MOVER WIRING — a lit SPATIAL campaign lifts a host observance's outcome vs the same
 *     ASPATIAL campaign, and the aspatial run is byte-identical to the pre-pilgrimage baseline.
 */
import { describe, expect, it } from 'vitest';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { pilgrimageDraw, drawsPilgrims } from '../../src/domain/traditions/pilgrimage.js';
import { advanceTraditions, successScore, outcomeForDraw, TRADITION_OUTCOME } from '../../src/domain/worldPulse/traditionsKernel.js';
import { createPRNG } from '../../src/kernel/prng.js';

function fixtureDigest(count = 8) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, count);
  return buildSpatialDigest({ pack, placements });
}

/** A grand crowd-drawing observance. */
const grandRec = (o = {}) => ({
  id: 'tradition.host.0', coreMotif: { element: 'founding', act: 'procession' }, name: 'The Great Procession',
  window: { startWeekOfYear: 10, weeks: 1 }, scaleBand: 5, ownerKey: null, ownerKind: null, deityRef: null,
  expression: { trappings: [], epithet: '' }, mutationLog: [], lastHeldYear: null, lastOutcome: null,
  suppressedBy: null, adoptedFrom: null, ...o,
});

describe('§16 pilgrimage — drawsPilgrims (only grand crowd-drawing rites)', () => {
  it('a grand procession/offering/fair draws pilgrims; a small or non-drawing rite does not', () => {
    expect(drawsPilgrims(grandRec({ coreMotif: { element: 'x', act: 'procession' }, scaleBand: 3 }))).toBe(true);
    expect(drawsPilgrims(grandRec({ coreMotif: { element: 'x', act: 'fair' }, scaleBand: 4 }))).toBe(true);
    expect(drawsPilgrims(grandRec({ coreMotif: { element: 'x', act: 'feast' }, scaleBand: 6 }))).toBe(true); // metropolis spectacle
    // NOT drawing: a small procession, a big-but-quiet feast below the spectacle band
    expect(drawsPilgrims(grandRec({ coreMotif: { element: 'x', act: 'procession' }, scaleBand: 2 }))).toBe(false);
    expect(drawsPilgrims(grandRec({ coreMotif: { element: 'x', act: 'feast' }, scaleBand: 4 }))).toBe(false);
  });
});

describe('§16 pilgrimage — pilgrimageDraw (bounded attendance over the digest)', () => {
  const digest = fixtureDigest(8);
  const ids = digest.settlementIds;
  const host = ids[0];
  const settlements = ids.map((id) => ({ id, settlement: { population: 5000 } }));

  it('ASPATIAL (no digest) ⇒ 0 (the byte-identity source)', () => {
    expect(pilgrimageDraw({ hostId: host, hostRec: grandRec(), settlements, digest: null })).toBe(0);
  });

  it('a non-grand rec ⇒ 0 even with a digest + neighbours', () => {
    expect(pilgrimageDraw({ hostId: host, hostRec: grandRec({ scaleBand: 1, coreMotif: { act: 'feast' } }), settlements, digest })).toBe(0);
  });

  it('an unmapped host ⇒ 0', () => {
    expect(pilgrimageDraw({ hostId: 'ghost', hostRec: grandRec(), settlements, digest })).toBe(0);
  });

  it('a grand rite with mapped neighbours ⇒ a bounded, positive, deterministic draw', () => {
    const d1 = pilgrimageDraw({ hostId: host, hostRec: grandRec(), settlements, digest });
    const d2 = pilgrimageDraw({ hostId: host, hostRec: grandRec(), settlements, digest });
    expect(d1).toBeGreaterThan(0);
    expect(d1).toBeLessThanOrEqual(0.1); // PILGRIM_MAX
    expect(d1).toBe(d2); // deterministic
  });

  it('bigger neighbours draw more pilgrims (monotone in attendance), still bounded', () => {
    const small = ids.map((id) => ({ id, settlement: { population: 800 } }));
    const big = ids.map((id) => ({ id, settlement: { population: 12000 } }));
    const dSmall = pilgrimageDraw({ hostId: host, hostRec: grandRec(), settlements: small, digest });
    const dBig = pilgrimageDraw({ hostId: host, hostRec: grandRec(), settlements: big, digest });
    expect(dBig).toBeGreaterThan(dSmall);
    expect(dBig).toBeLessThanOrEqual(0.1);
  });
});

// ── THE MOVER WIRING: a spatial campaign lifts an outcome; aspatial is byte-identical ──
const NOW = '2026-01-01T00:00:00.000Z';

describe('§16 pilgrimage — the mover wiring', () => {
  const digest = fixtureDigest(8);
  const ids = digest.settlementIds;      // the host + neighbours use REAL digest ids so pathCost resolves
  const HOST_ID = ids[0];
  const neighbours = ids.slice(1).map((id) => ({ id, pop: 14000 }));

  function runAt({ rngSeed, spatial }) {
    const host = { name: 'Host', tier: 'metropolis', population: 12000, economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 }, factions: [] }, activeConditions: [] };
    const rec = grandRec({ id: `tradition.${HOST_ID}.0` });
    const items = [{ id: HOST_ID, name: 'Host', settlement: { ...host, traditions: [rec] } },
      ...neighbours.map((n) => ({ id: n.id, name: n.id, settlement: { population: n.pop } }))];
    const worldState = {
      rngSeed, tick: 10, calendar: { elapsedWeeks: 9 },
      simulationRules: { traditionsEnabled: true }, stressors: [],
      spatialLedgers: { traditions: { [HOST_ID]: [rec] } },
    };
    if (spatial) { worldState.spatialCanonVersion = 1; worldState.spatialDigest = digest; }
    const settlementUpdates = [{ saveId: HOST_ID, settlement: { ...host, traditions: [rec] } }];
    const res = advanceTraditions({ snapshot: { settlements: items }, worldState, settlementUpdates, tick: 10, now: NOW });
    return res.worldState?.spatialLedgers?.traditions?.[HOST_ID]?.[0]?.lastOutcome;
  }

  it('the aspatial run equals the no-pilgrimage baseline for EVERY seed (byte-identity)', () => {
    // Baseline = the raw score→outcome with NO pilgrim bonus (what the pre-seam mover produced).
    const rec = grandRec({ id: `tradition.${HOST_ID}.0` });
    const settlement = { economicState: { prosperity: 'Comfortable' }, powerStructure: { publicLegitimacy: { score: 55 } } };
    for (let i = 0; i < 60; i += 1) {
      const rngSeed = `pil-${i}`;
      const score = successScore({ rec, settlement, worldState: { rngSeed }, sid: HOST_ID, year: 1, warTypes: new Set() });
      const r = createPRNG(`${rngSeed}::tradition:${rec.id}:1`).random();
      const baseline = outcomeForDraw(score, r);
      expect(runAt({ rngSeed, spatial: false })).toBe(baseline);
    }
  });

  it('a lit SPATIAL campaign CHANGES at least one host outcome (pilgrimage reaches the score)', () => {
    let differed = false;
    for (let i = 0; i < 120 && !differed; i += 1) {
      const rngSeed = `pil-${i}`;
      if (runAt({ rngSeed, spatial: true }) !== runAt({ rngSeed, spatial: false })) differed = true;
    }
    expect(differed, 'pilgrimage never altered any outcome — the bonus is not wired into the score').toBe(true);
  });

  it('the spatial run is deterministic (two runs, same seed ⇒ same outcome)', () => {
    const a = runAt({ rngSeed: 'pil-det', spatial: true });
    const b = runAt({ rngSeed: 'pil-det', spatial: true });
    expect(a).toBe(b);
  });
});
