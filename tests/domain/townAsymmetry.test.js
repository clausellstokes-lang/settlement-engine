/**
 * townAsymmetry.test.js — SOURCED ASYMMETRY + PROVENANCE (owner directives, #38).
 *
 * "nothing should be perfectly organic… asymmetry from the region, resources, people's
 * habits… plan around it or use it." The v2 engine deforms districts/streets/walls ONLY
 * from NAMED dossier causes (region / resource / habit) — never uniform jitter — and
 * carries the cause of every deformation as a first-class, lookup-by-element provenance
 * map. These pins hold both laws: (a) a deformed element ALWAYS has a recorded cause
 * (which is exactly the no-uniform-jitter enforcement — noise has no per-element cause);
 * (b) a source-less settlement comes out cleanly formal AND seed-independent.
 */
import { describe, expect, it } from 'vitest';

import { buildTownMapModel } from '../../src/domain/townMap/index.js';
import { makeTownFixture } from '../fixtures/townMapFixtures.js';

const V2 = { layoutLawVersion: 2 };
const stable = (v) => JSON.stringify(v);
const FAMILIES = new Set(['region', 'resource', 'habit']);

/** All provenance entries flattened, each tagged with its element id. */
function entries(model) {
  const out = [];
  for (const el of Object.keys(model.provenance || {})) for (const e of model.provenance[el]) out.push({ element: el, ...e });
  return out;
}
/** Does a provenance element id resolve to a real model element? */
function resolves(model, el) {
  // synthetic route/wall/site elements (stage-0 site + habit routes + plan-response wall)
  if (el.startsWith('desire-path:') || el.startsWith('wall-sector:') || el.startsWith('site:')) return true;
  return model.districts.some((d) => d.id === el);
}

describe('sourced asymmetry — NO uniform jitter (the enforcement)', () => {
  // A source-less settlement: flat plains, no water, no walls, no exports, a single
  // category with no high-traffic affinity pair present ⇒ no region/resource/habit source.
  const sourcelessQuarters = [
    { name: 'Forge A', location: '', desc: 'smiths and workshops', landmarks: [] },
    { name: 'Forge B', location: '', desc: 'artisan smiths forge', landmarks: [] },
    { name: 'Forge C', location: '', desc: 'workshops and smiths', landmarks: [] },
  ];
  const sourcelessInsts = [
    { name: 'Craft Guild 0', priorityCategory: 'crafts', catalogId: 'c0' },
    { name: 'Craft Guild 1', priorityCategory: 'crafts', catalogId: 'c1' },
    { name: 'Craft Guild 2', priorityCategory: 'crafts', catalogId: 'c2' },
  ];
  const sourceless = (seed) => makeTownFixture({ tier: 'village', terrain: 'plains', walls: false, water: false, seed, quarters: sourcelessQuarters, institutions: sourcelessInsts });

  it('a source-less settlement has ZERO provenance (nothing deformed ⇒ nothing recorded)', () => {
    const m = buildTownMapModel(sourceless('sl-a'), V2);
    expect(Object.keys(m.provenance)).toEqual([]);
    expect(m.meta.deformedElementCount).toBe(0);
  });

  it('a source-less settlement lays out SEED-INDEPENDENTLY (no hidden noise)', () => {
    // If any uniform jitter existed, two different seeds would diverge. They must not.
    const a = buildTownMapModel(sourceless('seed-A'), V2);
    const b = buildTownMapModel(sourceless('seed-B'), V2);
    expect(stable(a.districts)).toBe(stable(b.districts));
    expect(stable(a.buildings)).toBe(stable(b.buildings));
  });
});

describe('sourced asymmetry — provenance completeness + shape', () => {
  const rich = {
    ...makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'prov-rich' }),
    economicState: { prosperity: { label: 'comfortable' }, exports: ['cured leather', 'stone', 'raw wool'] },
  };
  const m = buildTownMapModel(rich, V2);

  it('meta.deformedElementCount === the provenance map size', () => {
    expect(m.meta.deformedElementCount).toBe(Object.keys(m.provenance).length);
    expect(m.meta.deformedElementCount).toBeGreaterThan(0);
  });

  it('every provenance element resolves to a real element; every entry is well-formed', () => {
    for (const el of Object.keys(m.provenance)) {
      expect(resolves(m, el), `unresolved element ${el}`).toBe(true);
      for (const e of m.provenance[el]) {
        expect(FAMILIES.has(e.sourceFamily), `bad family ${e.sourceFamily}`).toBe(true);
        expect(typeof e.sourceRef === 'string' && e.sourceRef.length > 0).toBe(true);
        expect(typeof e.effect === 'string' && e.effect.length > 0).toBe(true);
      }
    }
  });

  it('the provenance map is deterministic (byte-identical across regenerations)', () => {
    expect(stable(buildTownMapModel(rich, V2).provenance)).toBe(stable(m.provenance));
  });
});

describe('sourced asymmetry — each source family produces its predicted deformation', () => {
  it('REGION — a coastal town drifts its waterfront quarters toward the water', () => {
    const m = buildTownMapModel(makeTownFixture({ tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'region-water' }), V2);
    const water = entries(m).filter((e) => e.sourceFamily === 'region' && /waterfront/.test(e.sourceRef) && e.effect === 'district-drift');
    expect(water.length).toBeGreaterThan(0);
  });

  it('RESOURCE — a stone export sites a quarry that drifts the industrial quarter', () => {
    const quarry = {
      ...makeTownFixture({
        tier: 'town', terrain: 'plains', walls: false, water: false, seed: 'resource-stone',
        quarters: [
          { name: 'Tannery Flats', location: 'downwind edge', desc: 'tanneries and warehouses', landmarks: ['Warehouse Row'] },
          { name: 'Market Row', location: 'center', desc: 'bazaar and exchange', landmarks: ['Grand Bazaar'] },
          { name: 'Council Green', location: 'center', desc: 'court and chancery', landmarks: ['Town Hall'] },
        ],
      }),
      economicState: { prosperity: { label: 'comfortable' }, exports: ['stone'] },
    };
    const m = buildTownMapModel(quarry, V2);
    const res = entries(m).filter((e) => e.sourceFamily === 'resource' && /quarry/.test(e.sourceRef) && e.effect === 'district-drift');
    expect(res.length).toBeGreaterThan(0);
  });

  it('HABIT — a civic + merchant town wears a desire path with a convergence square', () => {
    const m = buildTownMapModel(makeTownFixture({ tier: 'town', terrain: 'plains', walls: false, water: false, seed: 'habit-desire' }), V2);
    const es = entries(m);
    expect(es.some((e) => e.effect === 'desire-path')).toBe(true);
    expect(es.some((e) => e.effect === 'square-at-convergence')).toBe(true);
    // desire-path elements are synthetic route ids
    expect(Object.keys(m.provenance).some((k) => k.startsWith('desire-path:'))).toBe(true);
  });

  it('PLAN-RESPONSE — a harbor wall KINKS to embrace the waterfront market it pulled out', () => {
    const harbor = makeTownFixture({
      tier: 'city', terrain: 'coastal', walls: true, water: true, seed: 'harbor-embrace',
      quarters: [
        { name: 'Foreign Quarter', location: 'docks', desc: 'expatriate immigrant traders', landmarks: ['Consulate'] },
        { name: 'Market Row', location: 'docks', desc: 'bazaar exchange harbor', landmarks: ['Grand Bazaar'] },
        { name: 'Council Green', location: 'center', desc: 'court chancery', landmarks: ['Town Hall'] },
        { name: 'Temple Ward', location: 'central', desc: 'shrines cloisters', landmarks: ['Cathedral'] },
        { name: 'Tannery Flats', location: 'downwind edge', desc: 'tanneries warehouses', landmarks: ['Warehouse'] },
      ],
    });
    const m = buildTownMapModel(harbor, V2);
    const embrace = entries(m).filter((e) => e.effect === 'wall-embrace');
    expect(embrace.length, 'the wall should kink to embrace a waterfront quarter').toBeGreaterThan(0);
    expect(embrace.every((e) => e.element.startsWith('wall-sector:'))).toBe(true);
  });
});
