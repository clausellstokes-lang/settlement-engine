/**
 * spatialSubstrate.test.js — DOOR 1 substrate derivation determinism + both-layout-
 * version pins + breach determinism + the synthesised weight tables.
 *
 * The substrate is a pure projection of the settlement's ACTIVE town layout
 * (buildTownMapModel, which the canonize body feeds to deriveSpatialSubstrate). These
 * pins fix: (1) it is byte-deterministic in (settlement, mapEdits); (2) it coheres
 * with BOTH layout versions (v1 default + v2 opt-in); (3) the wall breach is a
 * deterministic weakest-facing pick; (4) flammability/adjacency/wall-strength are
 * synthesised sanely.
 */
import { describe, it, expect } from 'vitest';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { deriveSpatialSubstrate } from '../../src/domain/spatial/spatialSubstrate.js';
import { substrateSignatureOf } from '../../src/lib/spatialSubstrateDerive.js';
import { resolveBreachSegment, approachOctant, diffuseField, substrateOf } from '../../src/domain/spatial/spatialSubstrateRead.js';

/** A walled city with six quarters — the substrate's canonical exercise fixture. */
function walledCity(overrides = {}) {
  return {
    _seed: 'sub-fixture-1', id: 's1', name: 'Ashford', tier: 'city', population: 9000,
    config: { tradeRouteAccess: 'road', economicBase: 'trade', terrainType: 'plains' },
    defenseProfile: { hasWalls: true, fortificationLevel: 'walled' },
    spatialLayout: { quarters: [
      { name: 'Temple Ward', location: 'central', category: 'religious' },
      { name: 'Merchant Row', location: 'east', category: 'merchant' },
      { name: 'The Tanneries', location: 'south', category: 'industrial' },
      { name: 'Garrison', location: 'north', category: 'military' },
      { name: 'Shadow Docks', location: 'west', category: 'criminal' },
      { name: 'High Manor', location: 'hilltop', category: 'noble' },
    ] },
    institutions: [
      { name: 'Grand Temple', category: 'religious', status: 'active' },
      { name: 'Town Hall', category: 'civic', required: true, status: 'active' },
    ],
    economicState: { prosperity: 'Comfortable', exports: ['leather'] },
    powerStructure: { factions: [{ name: 'Guild', isGoverning: true }] },
    ...overrides,
  };
}
const deriveFor = (s, mapEdits = null) => deriveSpatialSubstrate(buildTownMapModel(s, mapEdits));

describe('spatial substrate — derivation', () => {
  it('is byte-deterministic in the settlement (same in ⇒ byte-identical out)', () => {
    const s = walledCity();
    const a = deriveFor(s);
    const b = deriveFor(s);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a).not.toBeNull();
    expect(a.d.length).toBeGreaterThan(1);
  });

  it('coheres with the ACTIVE layout version — v1 default AND v2 opt-in', () => {
    const s = walledCity();
    const v1 = deriveFor(s, null);
    const v2 = deriveFor({ ...s, mapEdits: { layoutLawVersion: 2 } }, { layoutLawVersion: 2 });
    expect(v1.lyr).toBe(1);
    expect(v2.lyr).toBe(2);
    // Both are structurally complete (districts + adjacency + walls); the coherence
    // guarantee is that each mirrors the geometry its OWN layout version renders.
    for (const sub of [v1, v2]) {
      expect(sub.d.length).toBeGreaterThan(1);
      expect(Object.keys(sub.adj).length).toBeGreaterThan(0);
      expect(sub.w.length).toBeGreaterThan(0);
    }
  });

  it('never leaves a district isolated (every quarter has ≥1 neighbour)', () => {
    const sub = deriveFor(walledCity());
    for (const d of sub.d) expect((sub.adj[d.id] || []).length).toBeGreaterThan(0);
  });

  it('adjacency is symmetric (a↔b)', () => {
    const sub = deriveFor(walledCity());
    for (const [id, nbrs] of Object.entries(sub.adj)) {
      for (const nb of nbrs) expect(sub.adj[nb]).toContain(id);
    }
  });

  it('flammability ranks timber trades above stone temples, and clamps 0..1', () => {
    const sub = deriveFor(walledCity());
    for (const d of sub.d) { expect(d.flam).toBeGreaterThanOrEqual(0); expect(d.flam).toBeLessThanOrEqual(1); }
    const industrial = sub.d.find((d) => d.cat === 'industrial');
    const religious = sub.d.find((d) => d.cat === 'religious');
    if (industrial && religious) expect(industrial.flam).toBeGreaterThan(religious.flam);
  });

  it('a mapless dossier ⇒ null (honest-null, no substrate)', () => {
    const bare = { _seed: 'bare', id: 'x', tier: 'thorp', population: 20, institutions: [], spatialLayout: { quarters: [] } };
    const model = buildTownMapModel(bare, null);
    // Even the synthetic hamlet floor yields ≥1 district; a truly district-less model ⇒ null.
    const sub = deriveSpatialSubstrate({ ...model, districts: [] });
    expect(sub).toBeNull();
  });
});

describe('spatial substrate — the wall ring + breach (consumer b geometry)', () => {
  it('a walled town yields wall segments with per-segment strength + a protected district', () => {
    const sub = deriveFor(walledCity());
    expect(sub.w.length).toBeGreaterThanOrEqual(3);
    for (const seg of sub.w) {
      expect(seg.str).toBeGreaterThanOrEqual(0);
      expect(seg.str).toBeLessThanOrEqual(1);
      expect(typeof seg.i).toBe('number');
    }
    // Per-segment strength is NOT uniform (the gate-weakening + district standing vary it).
    const strengths = new Set(sub.w.map((w) => w.str));
    expect(strengths.size).toBeGreaterThan(1);
  });

  it('a gate weakens the segment it pierces (gated < an ungated peer)', () => {
    const sub = deriveFor(walledCity());
    const gatedSegs = new Set(sub.g.map((g) => g.seg));
    const gatedStr = sub.w.filter((w) => gatedSegs.has(w.i)).map((w) => w.str);
    const ungatedStr = sub.w.filter((w) => !gatedSegs.has(w.i)).map((w) => w.str);
    if (gatedStr.length && ungatedStr.length) {
      expect(Math.min(...gatedStr)).toBeLessThan(Math.max(...ungatedStr));
    }
  });

  it('breach is deterministic and picks a weak segment facing the attacker', () => {
    const sub = deriveFor(walledCity());
    const oct = approachOctant('the-horde', 's1');
    const b1 = resolveBreachSegment(sub, oct);
    const b2 = resolveBreachSegment(sub, oct);
    expect(b1).not.toBeNull();
    expect(b1).toEqual(b2); // deterministic
    // The breached segment is no stronger than the town's median wall (weakest-facing).
    const sorted = sub.w.map((w) => w.str).sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    const breached = sub.w.find((w) => w.i === b1.wallSegmentId);
    expect(breached.str).toBeLessThanOrEqual(median + 0.001);
    expect(typeof b1.districtId === 'string' || b1.districtId === null).toBe(true);
  });

  it('approachOctant is a stable, symmetric per-pair 0..7', () => {
    for (let i = 0; i < 20; i++) {
      const o = approachOctant(`a${i}`, `b${i}`);
      expect(o).toBeGreaterThanOrEqual(0);
      expect(o).toBeLessThan(8);
      expect(approachOctant(`a${i}`, `b${i}`)).toBe(approachOctant(`b${i}`, `a${i}`)); // unordered
    }
  });

  it('a wall-less town ⇒ no segments, breach null (honest-null)', () => {
    const sub = deriveFor(walledCity({ defenseProfile: null }));
    expect(sub.w.length).toBe(0);
    expect(resolveBreachSegment(sub, 3)).toBeNull();
  });
});

describe('spatial substrate — the signature (re-derive invalidation)', () => {
  it('is stable for an unchanged settlement, and changes when the roster changes', () => {
    const s = walledCity();
    expect(substrateSignatureOf(s)).toBe(substrateSignatureOf(s));
    const s2 = walledCity({ institutions: [...s.institutions, { name: 'New Guildhall', category: 'craft', status: 'active' }] });
    expect(substrateSignatureOf(s2)).not.toBe(substrateSignatureOf(s));
  });

  it('changes when the layout version marker changes (v1 ⇒ v2)', () => {
    const s = walledCity();
    expect(substrateSignatureOf({ ...s, mapEdits: { layoutLawVersion: 2 } })).not.toBe(substrateSignatureOf(s));
  });
});

describe('spatial substrate — the diffusion field (consumers a + c geometry)', () => {
  it('normalises to a WHERE partition (max 1) that spreads to neighbours, honest-null when empty', () => {
    const sub = deriveFor(walledCity());
    const seed = { [sub.d[0].id]: 1 };
    const field = diffuseField(sub, seed, { hops: 2, leash: 0.55, flammable: true });
    const vals = Object.values(field);
    expect(vals.length).toBeGreaterThan(1); // spread beyond the seed
    expect(Math.max(...vals)).toBe(1); // normalised
    for (const v of vals) { expect(v).toBeGreaterThan(0); expect(v).toBeLessThanOrEqual(1); }
    expect(diffuseField(sub, {}, {})).toEqual({}); // no seed ⇒ empty
  });
});

describe('spatial substrate — substrateOf reads the sidecar', () => {
  it('reads a stored substrate, null when absent', () => {
    const sub = deriveFor(walledCity());
    const ws = { spatialLedgers: { spatialSubstrate: { s1: sub } } };
    expect(substrateOf(ws, 's1')).not.toBeNull();
    expect(substrateOf(ws, 'nope')).toBeNull();
    expect(substrateOf({}, 's1')).toBeNull();
  });
});
