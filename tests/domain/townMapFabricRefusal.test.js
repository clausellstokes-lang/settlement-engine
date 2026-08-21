/**
 * tests/domain/townMapFabricRefusal.test.js — lane MF-W1b: §5 W1's EXITS 2, 3 and 6.
 *
 *   EXIT 2  zero drawn bodies on `buildable == false`, censused per leaf, with a PLANTED
 *           violation that reds.
 *   EXIT 3  `waterBearing` on every water-bearing leaf, pinned **DERIVED, NOT STORED**:
 *           perturb the substrate seed and it must move; hold it and it must be
 *           byte-identical.
 *   EXIT 6  the two-scale coastline, with the detail term measurably damped at the worked
 *           waterfront — and a COUNTERFACTUAL that removes the attenuation.
 *
 * ⚠⚠ THE VACUITY THIS FILE IS BUILT AGAINST, NAMED FIRST BECAUSE IT IS THE EASY FAILURE.
 * `groundLaw.js`'s own header records the class in one sentence — **"A CENSUS THAT INHERITS
 * THE LAW'S OWN PREDICATE CANNOT REFUTE THE LAW"** — measured there as 1,299 bodies standing
 * in a carriageway with all three censuses reading 0. The enforcement and the census here DO
 * share `bodyRefusal`, exactly as `enforceGround` and §200's census share `deepestClaim`, so
 * the reading of 0 is worth nothing on its own. **Every arm below therefore plants.** The
 * strongest plant is the SUBSTRATE swap: a finished fabric is re-censused against ground the
 * enforcement never saw, so no repair pass can have absorbed it.
 */
import { describe, it, expect } from 'vitest';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { buildSubstrate } from '../../src/domain/townMap/fabric/substrate.js';
import {
  REFUSAL, REFUSAL_CLAUSES, absoluteGrade, refusalAt, buildableAt, scarpCost,
  buildableMask, bodyRefusal, refusalCensus, drawnBodies, tillageRefusalCensus,
} from '../../src/domain/townMap/fabric/groundRefusal.js';
import { RELIEF_BANDS, shoreContour, SHORE_DETAIL } from '../../src/domain/townMap/fabric/relief.js';
import { waterBearing } from '../../src/domain/townMap/fabric/waterMode.js';
import { makeTownFixture, makeForcedFjordFixture } from '../fixtures/townMapFixtures.js';

const build = (s) => buildFabric(s, buildTownMapModel(s, null), {});
const mountainish = (seed) => makeTownFixture({ _seed: seed, config: { terrainType: 'mountain', tradeRouteAccess: 'moderate' } });
const plainsish = (seed) => makeTownFixture({ _seed: seed, config: { terrainType: 'plains', tradeRouteAccess: 'moderate' } });

describe('§5 W1 exit 2 — the `buildable` refusal mask', () => {
  it('the refusal is stated in the ABSOLUTE grade, so a pancake refuses nothing and a mountain refuses a lot', () => {
    const flat = buildSubstrate({}, 'plains', { seed: 'mask-flat' }, {});
    const steep = buildSubstrate({}, 'mountain', { seed: 'mask-steep' }, {});
    const mFlat = buildableMask(flat), mSteep = buildableMask(steep);
    // ⭐ THE WHOLE POINT OF THE UNIT. In the NORMALIZED field both leaves have cells at 1.0,
    // so a normalized threshold refuses a comparable share of each — which is why the six
    // private spellings this module replaced refused ground on a floodplain.
    // ⚠ THE ASSERTION IS ON THE **CRAG** ARM, NOT ON THE TOTAL, AND THE FIRST SPELLING GOT
    // THIS WRONG. A pancake genuinely holds standing water — 17 cells of it on this seed —
    // and refusing a bog is the law working, not the unit failing. The claim is about SLOPE.
    expect(mFlat.cragCells).toBe(0);
    expect(mSteep.cragCells).toBeGreaterThan(1000);
    // ⛔ COUNTERFACTUAL, and it is the arm that convicts the OLD unit: the same two leaves
    // measured in NORMALIZED slope are indistinguishable at any threshold.
    const share = (sub, t) => {
      let n = 0;
      for (let k = 0; k < sub.slope.length; k++) if (sub.slope[k] > t) n++;
      return n / sub.slope.length;
    };
    expect(Math.abs(share(flat, 0.8) - share(steep, 0.8))).toBeLessThan(0.05);
    // …while in the absolute unit they are three-quarters of the leaf apart.
    expect(mSteep.share - mFlat.share).toBeGreaterThan(0.2);
  });

  it('the mask is DERIVED, never stored — perturb the substrate seed and it moves; hold it and it is identical', () => {
    const a = buildableMask(buildSubstrate({}, 'mountain', { seed: 'mask-seed-A' }, {}));
    const b = buildableMask(buildSubstrate({}, 'mountain', { seed: 'mask-seed-A' }, {}));
    const c = buildableMask(buildSubstrate({}, 'mountain', { seed: 'mask-seed-B' }, {}));
    expect(Array.from(a.mask)).toEqual(Array.from(b.mask));
    expect(Array.from(a.mask)).not.toEqual(Array.from(c.mask));
    // ⚠ NON-VACUITY: two masks of DIFFERENT leaves would differ even if the mask were a
    // stored constant of the wrong thing, so assert both are real refusals, not all-ones.
    expect(a.refusedCells).toBeGreaterThan(0);
    expect(c.refusedCells).toBeGreaterThan(0);
  });

  it('the wet clause is the DRAWING\'s own marsh line — one number, not two', () => {
    // The law and the picture must agree about water: a body may not stand where the lens
    // draws a reed tuft. `relief.js` imports the number FROM the refusal, so this asserts
    // there is exactly one of it rather than that two happen to match today.
    expect(RELIEF_BANDS.marsh).toBe(REFUSAL.standingWater);
    expect(REFUSAL_CLAUSES).toEqual(['crag', 'standing-water']);
  });

  it('ZERO drawn bodies stand on refused ground, on a leaf whose ground refuses a quarter of itself', () => {
    const f = build(mountainish('refuse-census'));
    const c = refusalCensus({ sub: f.substrate, bodies: drawnBodies(f) });
    expect(c.status).toBe('MEASURED');
    // ⚠ THE LADDER'S FIFTH RUNG IS WHAT MAKES THE 0 READABLE. A leaf whose ground refuses
    // NOTHING reports a perfectly honest 0 that means the law had nothing to refuse; this
    // arm asserts the refusal had a real subject before it accepts the zero.
    expect(c.refusedGroundCells).toBeGreaterThan(500);
    expect(c.bodies).toBeGreaterThan(20);
    expect(c.refused).toBe(0);
  });

  it('⛔ PLANTED VIOLATION — a body moved onto a crag REDS, and the census names the clause', () => {
    const f = build(mountainish('refuse-plant'));
    const sub = f.substrate;
    // Find a genuinely refused cell and put a body on it.
    let px = -1, py = -1;
    for (let j = 0; j < sub.n && px < 0; j++) {
      for (let i = 0; i < sub.n; i++) {
        const x = (i + 0.5) * sub.cell, y = (j + 0.5) * sub.cell;
        if (refusalAt(sub, x, y) === 'crag') { px = x; py = y; break; }
      }
    }
    expect(px).toBeGreaterThan(0);
    const planted = [[px - 3, py - 3], [px + 3, py - 3], [px + 3, py + 3], [px - 3, py + 3]];
    const bodies = drawnBodies(f).concat([{ kind: 'parcel', key: 'PLANT', poly: planted }]);
    const c = refusalCensus({ sub, bodies });
    expect(c.refused).toBe(1);
    expect(c.byClause).toEqual({ crag: 1 });
    expect(c.byKind).toEqual({ parcel: 1 });
    expect(c.worst[0].key).toBe('PLANT');
  });

  it('⛔ PLANTED VIOLATION, THE STRONGER FORM — the SUBSTRATE is raised under a finished fabric', () => {
    // ⭐⭐ THIS IS THE ARM NO ENFORCEMENT CAN ABSORB. The fabric is built and every repair
    // pass has already run; only then is the ground made steeper. A census that could only
    // ever agree with the enforcement would still read 0 here, because the enforcement never
    // saw this ground. It reads hundreds.
    const f = build(plainsish('refuse-plant2'));
    const clean = refusalCensus({ sub: f.substrate, bodies: drawnBodies(f) });
    expect(clean.refused).toBe(0);
    const raised = { ...f.substrate, slopeLocalMax: f.substrate.slopeLocalMax * 40 };
    const dirty = refusalCensus({ sub: raised, bodies: drawnBodies(f) });
    expect(dirty.refusedGroundCells).toBeGreaterThan(clean.refusedGroundCells);
    expect(dirty.refused).toBeGreaterThan(20);
  });

  it('the census is AREA-TRUE, not a centre test — a body whose centre is clear and whose corner is not REDS', () => {
    // ⭐ THIS IS THE ARM THAT CONVICTS THE DEFECT THE WHOLE WAVE TURNED ON. §17.4's own root
    // cause — "the reservation was a test on the plot's CENTRE and the law is about the
    // BUILDING'S BODY" — is why the ploughland tiled the crags: a furlong is 4–11 substrate
    // cells across, so its middle says nothing about its flanks.
    const sub = buildSubstrate({}, 'plains', { seed: 'area-true' }, {});
    // Hand-built ground: one refused cell at (5,5), everything else flat.
    const k = 5 * sub.n + 5;
    sub.slope[k] = 1;
    sub.slopeLocalMax = REFUSAL.crag * 2;
    for (let q = 0; q < sub.slope.length; q++) if (q !== k) sub.slope[q] = 0;
    const cx = (5 + 0.5) * sub.cell, cy = (5 + 0.5) * sub.cell;
    const centre = [cx + sub.cell * 2, cy + sub.cell * 2];
    // A body whose CENTRE is two cells clear of the refusal and whose corner reaches it.
    const body = [
      [centre[0] - sub.cell * 2.4, centre[1] - sub.cell * 2.4],
      [centre[0] + sub.cell * 1.0, centre[1] - sub.cell * 2.4],
      [centre[0] + sub.cell * 1.0, centre[1] + sub.cell * 1.0],
      [centre[0] - sub.cell * 2.4, centre[1] + sub.cell * 1.0],
    ];
    expect(buildableAt(sub, centre[0], centre[1])).toBe(true);   // the CENTRE test passes
    expect(bodyRefusal(sub, body)).not.toBeNull();               // the AREA test does not
    expect(bodyRefusal(sub, body).clause).toBe('crag');
  });

  it('the PLOUGH stops where the ground refuses, and its census is SEPARATE from the bodies\'', () => {
    const f = build(mountainish('refuse-plough'));
    const t = tillageRefusalCensus(f);
    expect(t.status).toBe('MEASURED');
    expect(t.strips).toBeGreaterThan(20);
    expect(t.refused).toBe(0);
    // ⚠ NON-VACUITY: the leaf must actually HAVE ploughland and refused ground, or "0 strips
    // on refused ground" is a statement about an empty set.
    expect(f.meta.buildable.refusedCells).toBeGreaterThan(500);
    // And the refusal is REPORTED, not silent — §15.6's rule.
    expect(f.fields.refusedLands).toBeGreaterThan(0);
    expect(f.fields.reason).toMatch(/REFUSED BY THE GROUND/);
  });

  it('the scarp term is the THINNING and is derived from the same two numbers as the refusal', () => {
    const sub = buildSubstrate({}, 'mountain', { seed: 'scarp' }, {});
    let sawZero = false, sawMid = false, sawOne = false;
    for (let j = 0; j < sub.n; j++) {
      for (let i = 0; i < sub.n; i++) {
        const x = (i + 0.5) * sub.cell, y = (j + 0.5) * sub.cell;
        const g = absoluteGrade(sub, x, y), c = scarpCost(sub, x, y);
        if (g <= REFUSAL.scarp) { expect(c).toBe(0); sawZero = true; }
        else if (g >= REFUSAL.crag) { expect(c).toBe(1); sawOne = true; }
        else { expect(c).toBeGreaterThan(0); expect(c).toBeLessThan(1); sawMid = true; }
      }
    }
    // ⚠ ALL THREE BANDS MUST OCCUR, or the loop above proved one branch and skipped two.
    expect(sawZero && sawMid && sawOne).toBe(true);
  });
});

describe('§5 W1 exit 3 — `waterBearing`, DERIVED and not stored', () => {
  it('every water-bearing leaf publishes a bearing and every DRY leaf publishes none', () => {
    const river = build(makeTownFixture({ _seed: 'wb-river', config: { terrainType: 'riverside', tradeRouteAccess: 'river' } }));
    const dry = build(plainsish('wb-dry'));
    expect(river.meta.waterMode).not.toBe('dry');
    expect(river.meta.waterBearing).toBeTruthy();
    expect(river.meta.waterBearing.deg).toBeGreaterThanOrEqual(0);
    expect(river.meta.waterBearing.deg).toBeLessThan(360);
    expect(river.meta.waterBearing.chord).toBeGreaterThan(100);
    // ⚠ A DRY LEAF PUBLISHES `null`, NOT `0`. A bearing of 0° on a leaf with no water is a
    // fabricated world fact, and THE PROMISE governs those.
    expect(dry.meta.waterMode).toBe('dry');
    expect(dry.meta.waterBearing).toBeNull();
  });

  it('⭐⭐ DERIVED, NOT STORED — perturb the substrate seed and the bearing MOVES; hold it and it is BYTE-IDENTICAL', () => {
    // The criterion's own words. `waterBearing` is called on the same water object with two
    // substrates, so nothing but the ground can be responsible for the difference.
    const mk = (seed) => {
      const s = makeTownFixture({ _seed: seed, config: { terrainType: 'riverside', tradeRouteAccess: 'river' } });
      return build(s);
    };
    const a = mk('wb-seed-A');
    const b = mk('wb-seed-A');
    const c = mk('wb-seed-B');
    expect(JSON.stringify(a.meta.waterBearing)).toBe(JSON.stringify(b.meta.waterBearing));
    expect(a.meta.waterBearing.deg).not.toBe(c.meta.waterBearing.deg);
    // ⛔ AND THE STRONGEST FORM: the bearing is a function of the GROUND, so re-deriving it
    // from a perturbed substrate with the SAME water object must move it too. A stored value
    // would be blind to this.
    const perturbed = buildSubstrate({}, 'riverside', { seed: 'wb-perturb' }, {});
    const reread = waterBearing(a.water, perturbed);
    expect(reread).toBeTruthy();
    // A river's bearing is the channel's chord and the channel is not re-traced here, so the
    // river arm is INVARIANT under a substrate swap by construction — which is why the COAST
    // arm below is the one that carries this claim.
    expect(reread.deg).toBe(a.meta.waterBearing.deg);
  });

  it('⭐ THE COAST ARM MOVES WITH THE GROUND — two substrate seeds, two bearings', () => {
    // ⛔ THE FIRST SPELLING OF THIS PIN ASKED FOR THE WRONG THING AND FAILED HONESTLY, which
    // is worth recording: it re-derived the bearing from the SAME sea body against a
    // DIFFERENT substrate and expected it to move. It cannot, and it SHOULD not — the coast
    // bearing is the dry ground's centroid against the traced sea body's, and both are
    // functions of the BODY once the body exists. ⭐ The substrate reaches the bearing through
    // the TRACE, not around it, so the criterion's perturbation is a perturbation of the
    // SEED, which re-traces the contour. That is what this arm does.
    const a = build(makeForcedFjordFixture());
    const b = build({ ...makeForcedFjordFixture(), _seed: 'fixture-fjord-02' });
    expect(a.meta.waterBearing.kind).toBe('coast');
    expect(b.meta.waterBearing.kind).toBe('coast');
    expect(a.meta.waterBearing.source).toMatch(/traced sea body/);
    expect(a.meta.waterBearing.deg).not.toBe(b.meta.waterBearing.deg);
    // ⚠ NON-VACUITY: the two seas must be genuinely different traces, or two different
    // bearings prove only that two different numbers exist.
    expect(a.water.body.length).toBeGreaterThan(8);
    expect(JSON.stringify(a.water.body)).not.toBe(JSON.stringify(b.water.body));
  });

  it('⭐⭐ NOT STORED — the published bearing is byte-equal to a FRESH derivation from the fabric', () => {
    // The other half of "derived, not stored": a value that is recomputed on demand and comes
    // back identical is a derivation; a value that only exists because somebody wrote it down
    // cannot be reproduced this way. `waterBearing` is called again, from the test, on the
    // fabric's own water and substrate.
    const f = build(makeForcedFjordFixture());
    const fresh = waterBearing(f.water, f.substrate);
    expect(JSON.stringify(fresh)).toBe(JSON.stringify(f.meta.waterBearing));
  });

  it('the bearing carries NO runtime trigonometry — the compass is a rational reduction', () => {
    // The fabric's purity law. Asserted behaviourally: the four cardinal directions must come
    // back exact, which a polynomial atan does and a wrong octant reduction does not.
    const at = (dx, dy) => waterBearing({ kind: 'river', line: [[500, 500], [500 + dx * 300, 500 + dy * 300]] }, null).deg;
    expect(Math.round(at(0, -1))).toBe(0);      // up the page = north
    expect(Math.round(at(1, 0))).toBe(90);      // right = east
    expect(Math.round(at(0, 1))).toBe(180);
    expect(Math.round(at(-1, 0))).toBe(270);
    // And an off-axis bearing lands in the right octant rather than on the axis.
    const ne = at(1, -1);
    expect(ne).toBeGreaterThan(43);
    expect(ne).toBeLessThan(47);
  });
});

describe('§5 W1 exit 6 — the two-scale coastline', () => {
  const coastal = (seed) => {
    const s = makeForcedFjordFixture();
    return build({ ...s, _seed: seed });
  };

  it('the coastline carries TWO measurable scales — the traced shape and the detail on it', () => {
    const f = coastal('shore-two-scale');
    const sc = f.water.scales;
    expect(sc).toBeTruthy();
    expect(sc.status).toBe('MEASURED');
    // ⭐ BOTH SINUOSITIES ARE TAKEN AT THE SAME WINDOW. Comparing two windows measures the
    // window; the first spelling of this pin did exactly that and returned "the large shape
    // is wrigglier than the small one".
    expect(sc.window.fine).toBeLessThan(sc.window.coarse);
    expect(sc.coarseSinuosity).toBeGreaterThan(1);
    expect(sc.detailSinuosity).toBeGreaterThan(sc.coarseSinuosity);
    expect(sc.detailExcess).toBeGreaterThan(0);
    // The LARGE shape is a real shape and not a straight edge — a "two scale" claim on a
    // ruled coastline plus wobble would be one scale and a texture.
    expect(sc.bodyCoarseSinuosity).toBeGreaterThan(1.01);
  });

  it('⭐⭐ the DETAIL is damped at the worked waterfront and HOLDS away from it', () => {
    const f = coastal('shore-damped');
    const sc = f.water.scales;
    expect(sc.status).toBe('MEASURED');
    expect(sc.samples.near).toBeGreaterThan(30);
    expect(sc.samples.far).toBeGreaterThan(30);
    // The criterion's own words: sinuosity FALLS where the fabric meets it, HOLDS away.
    expect(sc.excessFar).toBeGreaterThan(0);
    expect(sc.excessNear).toBeLessThan(sc.excessFar);
    // And the fall is a real one, not a rounding: at least half the detail is gone.
    expect(sc.excessNear).toBeLessThan(sc.excessFar * 0.5);
  });

  it('⛔ COUNTERFACTUAL — remove the attenuation and the near/far difference MUST collapse', () => {
    // ⭐⭐ THIS IS THE ARM THAT MAKES THE DAMPING A MECHANISM RATHER THAN A COINCIDENCE. The
    // same substrate, the same seed, the same trace, the same worked reach — only the
    // attenuation is withdrawn (`shoreContour` with no worked reach at all). If the near/far
    // split survived that, the difference was coming from the LARGE SHAPE and not from us.
    const f = coastal('shore-cf');
    const worked = f.water.worked;
    expect(worked).toBeTruthy();
    const damped = shoreContour(f.substrate, { seed: f.meta.seed || 'shore-cf' }, worked);
    const wild = shoreContour(f.substrate, { seed: f.meta.seed || 'shore-cf' }, null);
    expect(damped).toBeTruthy();
    expect(wild).toBeTruthy();
    expect(damped.scales.status).toBe('MEASURED');
    // The undamped shore cannot report a near/far split at all — it has no worked reach —
    // so the honest counterfactual is the DETAIL EXCESS ITSELF, which must RISE.
    expect(wild.scales.status).toMatch(/NOT APPLICABLE/);
    expect(wild.scales.detailExcess).toBeGreaterThan(damped.scales.detailExcess);
    // ⚠ AND THE LARGE SHAPE MUST NOT HAVE MOVED. If withdrawing the detail changed the coarse
    // reading, the two "scales" were one thing and the pin above proved nothing.
    expect(wild.scales.coarseSinuosity).toBeCloseTo(damped.scales.coarseSinuosity, 10);
  });

  it('the quay is the point of the shore nearest the seat, not the seat itself', () => {
    // ⛔ THE MEASURED DEFECT THIS PINS: keying the damping on the settlement's CENTRE left the
    // coastal city's nearest shore 197 units out, at a damping of 0.479 — a 14% reduction the
    // large shape's own variation swamped. The quay is ON the water by construction.
    const f = coastal('shore-quay');
    const q = f.water.detail.quay;
    expect(q).toBeTruthy();
    let best = Infinity;
    for (const p of f.water.line) {
      const d = Math.sqrt((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2);
      if (d < best) best = d;
    }
    expect(best).toBeLessThan(f.substrate.cell * 2);
    expect(SHORE_DETAIL.workedFloor).toBeGreaterThan(0);      // a quay still bends
    expect(SHORE_DETAIL.workedFloor).toBeLessThan(0.3);
  });
});
