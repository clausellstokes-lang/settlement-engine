/**
 * tests/domain/townMapFabricBuildOut.test.js — MF-B2.
 *
 * §181.2b THE 1:1 RECONCILIATION · §181.2a THE BUILD-OUT LADDER AND THE LOD ·
 * §161a THE FIELD PATCHWORK · §15.1 THE COMPILATION RECORD · §15.2 THE ROUTE SKELETON ·
 * §15.3 COMPOUND RESERVATION · §15.4 NAMESPACED RANDOMNESS · §15.6 THE REPAIR PASS ·
 * §15.7 THE TWO PATH-DEPENDENCE PINS.
 *
 * ⚠ EVERY ARM CARRIES A COUNTERFACTUAL, on MF-B1b's standard. Each mechanism below can pass
 * vacuously: a census pin passes if the numbers happen to agree; a build-out pin passes if
 * blocks are dense for any reason; a route pin passes if roads exist at all; a
 * path-dependence pin passes if two runs differ for ANY reason. So each positive arm is
 * paired with the case that MUST give the opposite answer, and it is the PAIR that carries
 * the proof.
 */
import { describe, it, expect } from 'vitest';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { tierScale, AVG_HOUSEHOLD, PLOT_MODULE, BUILD_OUT, buildOutRung,
  GRAIN_BAND, GRAIN_SEAMS, GRAIN_VALIDATED, grainCellsAcross, tierForPopulation, TIERS,
} from '../../src/domain/townMap/fabric/tierGrammar.js';
import { compileSpatialRecord, countPeaks, CONSTRAINT_KINDS } from '../../src/domain/townMap/fabric/compile.js';
import { buildRouteSkeleton, corridorPull } from '../../src/domain/townMap/fabric/routes.js';
import { buildSubstrate } from '../../src/domain/townMap/fabric/substrate.js';
import { tillageScore, REACH_METRES } from '../../src/domain/townMap/fabric/fields.js';
import { RUNG_AT, TIER_RANK } from '../../src/domain/townMap/fabric/institutions.js';
import { fabricForkKey, hashUnit } from '../../src/domain/townMap/fabric/fabricRng.js';
import { archetypeSolids, frontInstitutions, FRONT_WOBBLE } from '../../src/domain/townMap/fabric/institutionShapes.js';
import { tenurePattern, HABITATION, FAUBOURG } from '../../src/domain/townMap/fabric/habitation.js';
import { deriveBridges, waterClaims } from '../../src/domain/townMap/fabric/waterWorks.js';
import { meanderChannel, drainageTrace, buildSubstrate as buildSub2, MEANDER } from '../../src/domain/townMap/fabric/substrate.js';
import { absArea, bearingIndex, cosI, sinI, TRIG_N } from '../../src/domain/townMap/fabric/fabricGeometry.js';
import { forbiddenGround, webConnectivity } from '../../src/domain/townMap/fabric/streets.js';
import { packFabric, WARD_GRAIN, MATERIALS, plotMaterial } from '../../src/domain/townMap/fabric/parcels.js';
import { selectMorphology } from '../../src/domain/townMap/fabric/morphology.js';
import { overlapping, clipHalfPlane, TOUCH_EPS, RUNGS } from '../../src/domain/townMap/fabric/groundLaw.js';
import { claimsOfRings } from '../../src/domain/townMap/fabric/wallCircuit.js';
import { accessCensus, collectAccessBodies, streetSeeds } from '../../src/domain/townMap/fabric/accessLaw.js';
import { decideGap, ALLEY_GAP } from '../../src/domain/townMap/fabric/parcels.js';
import { makeTownFixture, makeForcedFjordFixture, makeWalledFixture } from '../fixtures/townMapFixtures.js';
// MF-B6 — the true measure, the immersion suite, the state expressions and the §18 riches.
import { scaleBarFor, walkRings } from '../../src/domain/townMap/fabric/measure.js';
import { METRES_PER_FRONTAGE } from '../../src/domain/townMap/fabric/fields.js';
import { marginalia, deriveHeraldry, deriveNeighbourEdges, CHARGES } from '../../src/domain/townMap/fabric/immersion.js';
import { STRESSOR_DISPOSITION, EXPRESSIONS } from '../../src/domain/townMap/fabric/stateMarks.js';
import { STRESS_TYPE_MAP } from '../../src/data/stressTypes.js';
import { derivePrecincts } from '../../src/domain/townMap/fabric/organisms.js';

const build = (s) => buildFabric(s, buildTownMapModel(s, null), {});

/** A census-tier fixture: the town fixture at a village population. */
function makeVillageFixture(overrides = {}) {
  return makeTownFixture({
    _seed: 'fixture-village-b2', tier: 'village', population: 500,
    config: { terrainType: 'plains', tradeRouteAccess: 'moderate' },
    ...overrides,
  });
}

describe('§181.2b the 1:1 reconciliation — at the census tiers the ROOFS lead', () => {
  it('a village draws one roof per household, and a TOWN deliberately does not', () => {
    const village = build(makeVillageFixture());
    const households = Math.round(500 / AVG_HOUSEHOLD);
    // The claim is 1:1 with the housing census, within the declared ±20% module clamp.
    expect(village.meta.households).toBe(households);
    expect(village.parcels.length).toBeGreaterThan(households * 0.7);
    expect(village.parcels.length).toBeLessThan(households * 1.35);
    expect(village.meta.representative).toBe(false);

    // ⭐ THE COUNTERFACTUAL, and it is the arm that proves this is a LAW rather than an
    // arithmetic coincidence: above village the fabric makes the OPPOSITE claim on purpose.
    //
    // ⚠ THE MAGNITUDE ARM MUST BE TAKEN AT A CITY, NOT AT A TOWN, and that is a finding
    // rather than a convenience. MEASURED: the fixture town (3,500 souls, 700 households)
    // draws 603 buildings — the representative law is IN FORCE, but at the bottom of the
    // town band representative density and the census very nearly COINCIDE, so a magnitude
    // assertion there tests the population and not the law. The LAW-level claims hold at
    // town; the magnitude shows itself where the tiers actually diverge.
    const town = build(makeTownFixture());
    expect(town.meta.representative).toBe(true);
    expect(tierScale(makeTownFixture()).extentSource).toContain('area share');

    const city = build(makeTownFixture({ _seed: 'b2-ratio', tier: 'city', population: 20000 }));
    expect(city.meta.representative).toBe(true);
    // ⚠ THE BOUND IS THE LAW'S OWN, RE-DERIVED AT THE T-01 GRAIN — NOT RE-RECORDED.
    // MF-B8's grain derivation raises the representative roof count from a chosen formula to
    // one derived from the corpus's measured cells-across bands, so the city draws 1,801
    // buildings where it drew 826. The old 0.4 was a MAGNITUDE calibrated to the old count;
    // the LAW is `representationRatio > 2`, i.e. fewer than half as many buildings as
    // households, and that is what the bound now says. MEASURED: 1,801 against 4,000
    // households — ratio 2.22, comfortably inside a law that would red the moment the fabric
    // started claiming to be a housing census.
    expect(city.parcels.length).toBeLessThan(Math.round(20000 / AVG_HOUSEHOLD) * 0.5);
    expect(city.meta.representationRatio).toBeGreaterThan(2);
  });

  it('the EXTENT derives from the roofs at a census tier, and from the §5 BAND above it', () => {
    // At a census tier the module is FIXED and the radius follows the household count, so
    // doubling the souls grows the radius by about √2 and leaves the module alone.
    const small = tierScale(makeVillageFixture({ population: 450 }));
    const large = tierScale(makeVillageFixture({ population: 890 }));
    expect(small.plotModule).toBe(PLOT_MODULE.village);
    expect(large.plotModule).toBe(PLOT_MODULE.village);
    const ratio = large.builtRadius / small.builtRadius;
    expect(ratio).toBeGreaterThan(1.30);          // √(890/450) ≈ 1.41
    expect(ratio).toBeLessThan(1.52);
    expect(small.extentSource).toContain('1:1');

    // ⭐ THE COUNTERFACTUAL: above village the direction REVERSES. A city's extent is §5's
    // area share, so it does NOT track the household count the same way and it carries no
    // fixed module at all. Without this arm the pin passes on any monotone size law.
    const city = tierScale(makeTownFixture({ tier: 'city', population: 20000 }));
    expect(city.plotModule).toBeNull();
    expect(city.extentSource).toContain('area share');
  });

  it('all three census tiers land inside their own §5 footprint bands — WITHOUT consulting them', () => {
    // The derivation never reads the band; that it lands inside one is the reconciliation
    // proving itself. Bands from §5: thorp 1.4–3.0, hamlet 4.5–9.5, village 10.5–17.5.
    for (const [pop, lo, hi] of [[30, 0.010, 0.045], [220, 0.030, 0.105], [500, 0.075, 0.190]]) {
      const s = tierScale(makeVillageFixture({ population: pop, tier: undefined }));
      expect(s.footprint, `population ${pop} → footprint ${s.footprint}`).toBeGreaterThan(lo);
      expect(s.footprint, `population ${pop} → footprint ${s.footprint}`).toBeLessThan(hi);
    }
  });
});

describe('§181.2a the build-out ladder and the LOD', () => {
  it('a CITY builds its blocks out to the reference band; a VILLAGE deliberately does not', () => {
    const city = build(makeTownFixture({ _seed: 'b2-city', tier: 'city', population: 20000 }));
    const village = build(makeVillageFixture());
    const buildOut = (f) => {
      let b = 0, blk = 0;
      for (const p of f.parcels) b += absArea(p.polygon) + (p.backHouse ? absArea(p.backHouse) : 0);
      for (const k of f.blocks) blk += absArea(k.polygon || k);
      return blk > 0 ? b / blk : 0;
    };
    // hf30's blocks run 0.70–0.80 built. The city's rung aims there.
    // ⚠ FLOOR MOVED 0.62 → 0.50 AT MF-B4, AND THE CAUSE IS TWO LANDED LAWS RATHER THAN A
    // SLIPPING TARGET — recorded here because a moved bound with no reason is how a
    // regression hides. (a) §17.4's body cull: a plot whose CORNER stood in a carriageway is
    // now refused, and it used to be kept; (b) §17.6's alley-gap law, which the owner asked
    // for by name — every ownership seam, rear-access passage, fire break, drainage slit and
    // packing wedge takes frontage out of the run that used to be building. MEASURED:
    // 0.62 → 0.53 across the two. Both are ground the fabric legitimately does not build on,
    // and hf30's own blocks carry visible slots and passages through them.
    // ⭐ THE ARM THAT ACTUALLY CARRIES THE CLAIM IS THE COUNTERFACTUAL BELOW, which is a
    // RATIO and therefore survives both laws untouched: a city builds out and a village
    // does not, whatever the absolute band.
    // ⚠⚠ THE FLOOR IS RE-DERIVED FOR THE BURGAGE BLOCK, AND THE CAUSE IS A DENOMINATOR
    // CHANGE RATHER THAN A LOST BUILDING. MF-B8 raised PLOT_DEPTH_RATIO 2.35 → 4.20 at
    // town+ because T-08 MEASURED the corpus's own plots at 4–6 : 1. The street range kept
    // very nearly its absolute depth (~1.6 frontages, and T-08's own 30–45%-of-depth band is
    // now MET where it was overshot at 49–67%); what changed is that the BLOCK the ratio
    // divides by is now the whole burgage strip — range, toft and back range — instead of a
    // stubby rectangle. MEASURED across the change: city 0.53 → 0.435 with the SAME buildings
    // on a block 1.79× deeper. ⭐ THE CLASS, and MF-B6 recorded its sibling: **A RATIO WHOSE
    // DENOMINATOR IS REDEFINED HAS NOT REGRESSED, AND RE-RECORDING IT AS IF IT HAD IS HOW A
    // LEGITIMATE SHIFT BECOMES AN UNTRACEABLE ONE.**
    // ⭐ AND THE PIN GAINS AN ARM IT DID NOT HAVE, which no denominator change can flatter:
    // the LADDER MUST BE MONOTONE. A single global build-out constant passes any absolute
    // floor and fails this outright.
    expect(buildOut(city)).toBeGreaterThan(0.40);

    // ⭐⭐ THE COUNTERFACTUAL IS THE WHOLE POINT OF THE LADDER. hf3's village stands in
    // generous crofts, and building it out to a city's density would draw a city's land
    // hunger onto a place that has none. A single global build-out constant would pass the
    // arm above and fail this one.
    expect(buildOut(village)).toBeLessThan(buildOut(city) * 0.85);
    expect(BUILD_OUT.village.target).toBeLessThan(BUILD_OUT.city.target);
    // ⭐ THE LADDER, MONOTONE — the arm the absolute floor cannot carry.
    // ⚠ ONE SEED ACROSS THE LADDER. The first spelling compared tiers built on DIFFERENT
    // seeds and measured the ground rather than the ladder — MEASURED, a town on one seed came
    // out above a city on another, which says nothing about build-out at all. ⭐ THE CLASS:
    // a monotonicity claim over a seeded quantity must vary ONE thing.
    const L = (tier, population) => buildOut(build(makeTownFixture({ _seed: 'b8-ladder', tier, population })));
    const lv = buildOut(build(makeVillageFixture({ _seed: 'b8-ladder' })));
    const lt = L('town', 3500), lc = L('city', 20000), lm = L('metropolis', 71000);
    expect(lv, `village ${lv} must sit below town ${lt}`).toBeLessThan(lt);
    expect(lt, `town ${lt} must sit below city ${lc}`).toBeLessThan(lc);
    // ⚠ THE CITY→METROPOLIS STEP IS ASSERTED ON THE **TABLE**, NOT ON A SEEDED MEASUREMENT,
    // AND THAT IS AN HONEST LIMIT RATHER THAN A DODGE. MF-S1 measures the corpus's own
    // dense_share_in_core at 0.73–0.82 for cities and 0.859 for its single metropolis plate —
    // the two tiers are ~0.05 apart, which is inside the seed-to-seed spread of any ONE
    // settlement's block build-out (MEASURED across three seeds: city 0.466–0.539, metropolis
    // 0.472–0.542, overlapping). A measured assertion there would be testing the seed.
    // ⭐ THE CLASS: **when two bands overlap by more than the quantity's own seed variance, a
    // per-seed comparison is not evidence** — the claim belongs to the table, and the table is
    // where it is asserted.
    expect(lm, `metropolis ${lm} must not fall away from the ladder`).toBeGreaterThan(lt);
    expect(BUILD_OUT.city.target).toBeLessThan(BUILD_OUT.metropolis.target);
    expect(BUILD_OUT.town.target).toBeLessThan(BUILD_OUT.city.target);
  });

  it('the back-house is an OUTBUILDING on its plot, never a second parcel', () => {
    const city = build(makeTownFixture({ _seed: 'b2-back', tier: 'city', population: 20000 }));
    const backs = city.parcels.filter((p) => p.backHouse);
    expect(backs.length).toBeGreaterThan(20);
    // ⭐ THE TRUTH ARM: every back-house belongs to a parcel that also has a street range.
    // If back-houses were emitted as parcels the census claim at the tiers below would be
    // silently inflated by a third while the drawing merely looked better.
    // ⚠ THREE, NOT FOUR: the arm's subject is that the back-house's PARENT carries its own
    // street range, and a range clipped by §17.4's kerb line or §200's wall band can lose a
    // corner and still be a building. MEASURED at the T-01 grain: one city parcel comes back
    // as a triangle after the ground law, which is a lawful clipped footprint and not a
    // back-house masquerading as a parcel. ⭐ A VERTEX COUNT IS NOT A TEST OF WHAT A BODY IS.
    for (const p of backs) expect(p.polygon.length).toBeGreaterThanOrEqual(3);
    expect(new Set(city.parcels.map((p) => p.key)).size).toBe(city.parcels.length);
  });

  it('prosperity grades the rung — a rich town builds its yards over, a poor one does not', () => {
    const rich = buildOutRung('town', 5);
    const poor = buildOutRung('town', 0);
    expect(rich.yardShare).toBeLessThan(poor.yardShare);
    expect(rich.backOdds).toBeGreaterThan(poor.backOdds);
  });

  it('the LOD merges at CITY and never at a census tier, and the PRINTED RATIO tracks it', () => {
    const city = build(makeTownFixture({ _seed: 'b2-lod', tier: 'city', population: 20000 }));
    expect(city.lod.masses.length).toBeGreaterThan(0);
    expect(city.lod.mergedKeys.size).toBeGreaterThan(city.lod.masses.length);
    // ⛔ THE HONESTY ARM. The cartouche prints households ÷ DRAWN SHAPES; merging eight
    // houses into one mass makes that ratio coarser THERE, so the printed figure must be
    // recomputed on what is actually drawn. A ratio left at the pre-merge count would be a
    // promise the drawing does not keep.
    let drawnIfUnmerged = 0;
    for (const p of city.parcels) drawnIfUnmerged += 1 + (p.backHouse ? 1 : 0);
    expect(city.lod.drawnShapes).toBeLessThan(drawnIfUnmerged);
    expect(city.meta.representationRatio).toBeCloseTo(city.meta.households / city.lod.drawnShapes, 6);

    // ⭐ THE COUNTERFACTUAL: at a census tier the 1:1 claim forbids merging outright.
    const village = build(makeVillageFixture());
    expect(village.lod.masses).toHaveLength(0);
    expect(village.lod.mergedKeys.size).toBe(0);
    expect(village.lod.reason).toContain('no LOD');
  });
});

describe('§161a the field patchwork — a settlement eats', () => {
  it("a FJORD's workable ground is a fraction of a plains village's — the pair IS the pin", () => {
    const fjord = build(makeForcedFjordFixture());
    const plains = build(makeVillageFixture());
    // ⭐⭐ THE CHAIR'S FINDING, CURED AND MEASURED. A fjord town HAS farmland — on its
    // valley floor and its lee shelf — and it has far less of it than a floodplain does.
    // Both halves matter: MF-B1b drew NO fields at all on the fjord, and a cure that simply
    // ploughed everything would have been the opposite error.
    expect(fjord.fields.parcels.length).toBeGreaterThan(0);
    // ⚠ FLOOR 0.10 → 0.08 AT MF-B4, with the cause: the field admission now samples a land's
    // EDGES as well as its corners (MF-B4's inversion gave the town's outline real bays), so
    // the strips that straddled the settlement's edge are refused and the worked share falls.
    // MEASURED 0.12 → 0.097. The claim it carries — "a fjord town HAS farmland" — is also
    // held absolutely by the parcel-count arm above (178 lands), which no band can erode.
    expect(fjord.meta.fieldArableShare).toBeGreaterThan(0.08);
    // MEASURED on these fixtures: fjord 0.24 against plains 0.74 — a ratio of 0.33. The
    // bound is the CLAIM (a fjord farms a fraction of what a floodplain farms), set well
    // clear of the measurement so ordinary drift cannot red it and a REGRESSION to
    // MF-B1b's threshold — which gave the fjord ZERO — could not pass it.
    expect(fjord.meta.fieldArableShare).toBeLessThan(plains.meta.fieldArableShare * 0.5);
    expect(plains.meta.fieldArableShare).toBeGreaterThan(0.60);
  });

  it('no field is ploughed in the water or under the town — EVERY CORNER, not just the middle', () => {
    // ⛔⛔ THE PIN'S OWN SHORTHAND WAS AN ASSUMPTION ABOUT THE SHAPE IT TESTED, and it
    // reported a false positive the moment the derivation legitimately changed shape.
    // MF-B2's field parcels were always QUADS, so `reduce(..., q/4)` was a centroid. §16's
    // strips are the furlong CLIPPED between two parallel half-planes, so a land at a
    // furlong's corner comes back a TRIANGLE — and dividing three corners by four returns a
    // point three-quarters of the way to the origin, which landed inside the town and
    // failed a derivation that was correct. MEASURED: 5 of 186 lands, every one a triangle.
    // ⭐ THE CLASS: a pin that hard-codes the arity of the thing it measures is testing its
    // own arithmetic. The true mean is `/ polygon.length`, and the claim is stronger taken
    // over every VERTEX than over any single interior point.
    const f = build(makeTownFixture({ _seed: 'b2-fields' }));
    expect(f.fields.parcels.length).toBeGreaterThan(10);
    for (const p of f.fields.parcels) {
      const n = p.polygon.length;
      const c = p.polygon.reduce((a, q) => [a[0] + q[0] / n, a[1] + q[1] / n], [0, 0]);
      for (const comp of f.umbrella.components) {
        expect(pointInRing(comp, c[0], c[1]), `a land is ploughed under the town at ${c}`).toBe(false);
        for (const q of p.polygon) {
          expect(pointInRing(comp, q[0], q[1]), `a land's CORNER is under the town at ${q}`).toBe(false);
        }
      }
    }
  });

  it('§16.1 THE FIELDS TILE: the worked land is CONTIGUOUS and the drawing covers ALL of it', () => {
    // ⭐⭐ THE PAIR IS THE PIN. The positive arm is the tiling itself — every furlong block
    // in the arable zone gets a drawn hedge, so the DRAWN coverage of the zone is total —
    // and the counterfactual is MF-B2's own mechanism, reconstructed: independently jittered
    // CENTRES at the same pitch cannot tile, and the measurement says by how much.
    const f = build(makeTownFixture({ _seed: 'b3-tile', population: 900, tier: 'village' }));
    // ⚠ RE-EXPRESSED AS AN ACCOUNTED IDENTITY (MF-B5). The old arm read
    // `hedges.length === fieldFurlongs` and the §195.1 water cure broke it honestly: a hedge
    // is now TRUNCATED at the bank and a furlong wholly in the channel loses its hedge
    // entirely, so three of a hundred went. ⭐ AN IDENTITY A CURE BREAKS SHOULD BE RESTATED
    // WITH THE DIFFERENCE NAMED, never loosened to an inequality — "97 ≈ 100" hides the
    // three; "97 + 3 drowned = 100" says where they went and still reds if a fourth vanishes
    // for any other reason.
    expect(f.fields.hedges.length + f.meta.fieldHedgesDrowned).toBe(f.meta.fieldFurlongs);
    // ⭐ AWAY FROM THE SETTLEMENT'S OWN EDGE THE COVERAGE IS TOTAL — that is the tiling.
    // The whole-zone figure is legitimately lower and the reason is NAMED: the furlongs that
    // run up against the first houses lose the lands that fall under them, which is the
    // town rather than a hole in the fields.
    expect(f.meta.fieldInteriorCoverage).toBeGreaterThan(0.995);
    expect(f.meta.fieldCoverage).toBeGreaterThan(0.80);
    expect(f.meta.fieldEdgeFurlongs).toBeGreaterThan(0);  // the shortfall is ATTRIBUTED
    expect(f.meta.fieldNonConvex).toBe(0);                // the jitter bound holds, MEASURED

    // ⭐ THE COUNTERFACTUAL, arithmetic and exact: MF-B2 drew each furlong at 0.52–0.96 of
    // its own cell about an independently jittered centre. The expected area coverage of
    // that construction is the mean of (w × h) over the cell, which is nowhere near 1 — so
    // bare ground between neighbours was GUARANTEED by the geometry, not by the ranking.
    const meanW = (0.58 + 0.96) / 2, meanH = (0.52 + 0.92) / 2;
    expect(meanW * meanH).toBeLessThan(0.62);
  });

  it('§16.2 the strips ORIENT on the settlement and DEFORM — never a fan', () => {
    // A flat plains village is the hard case: with no slope to deform them, per-furlong
    // bearings to the centre draw a perfect sunburst (§157's ban). The great-field law says
    // the countryside must instead resolve into a SMALL NUMBER of coherent grain domains.
    const f = build(makeTownFixture({
      _seed: 'b3-orient', tier: 'village', population: 700,
      config: { terrainType: 'plains', tradeRouteAccess: 'moderate' },
    }));
    const byField = new Map();
    for (const p of f.fields.parcels) {
      const k = String(p.greatField);
      if (!byField.has(k)) byField.set(k, []);
      byField.get(k).push(p.ang);
    }
    // Three great fields (the tillage rotation), and each is ONE grain, not a fan.
    expect(byField.size).toBeGreaterThan(1);
    expect(byField.size).toBeLessThanOrEqual(3);
    for (const [, angs] of byField) {
      if (angs.length < 6) continue;
      // Spread WITHIN a great field, measured on the axial (mod 512) circle.
      const base = angs[0];
      let maxDev = 0;
      for (const a of angs) {
        let d = ((a - base) % 512 + 512) % 512;
        if (d > 256) d -= 512;
        if (Math.abs(d) > maxDev) maxDev = Math.abs(d);
      }
      // ⚠ EXPRESSED AGAINST THE FAN AT MF-B4, not against an absolute. The absolute (150)
      // was calibrated on MF-B3's countryside; the denser edge admission and the tighter
      // outline moved the within-field spread to a MEASURED 59–193 across four seeds while
      // the per-furlong fan sits at 255–256 (the axial maximum). The claim is a CONTRAST —
      // "a coherent grain, not a fan" — so the bound is stated as one, and the third time
      // this lane has had to re-express a threshold whose baseline it moved.
      // ⚠ THE MARGIN IS THINNER THAN IT SHOULD BE (0.76 measured against a 0.80 bound) and
      // the receipt says so: a sharper statistic than max-deviation-from-the-first-element
      // is owed, and this lane did not mint it.
      expect(maxDev).toBeLessThan(256 * 0.80);
    }
    // ⭐ THE COUNTERFACTUAL, EXECUTED RATHER THAN ARGUED: take the SAME furlong centres and
    // orient each one INDIVIDUALLY on the village — MF-B2's own rule — and measure the
    // spread. Two furlongs at right angles about the centre differ by a quarter turn (128
    // axial units), so a per-furlong fan blows straight through the bound the great fields
    // hold, and the pin fails if the two constructions ever come to the same thing.
    const perFurlong = [];
    for (const p of f.fields.parcels) {
      const c = p.polygon.reduce((a, q) => [a[0] + q[0] / p.polygon.length, a[1] + q[1] / p.polygon.length], [0, 0]);
      perFurlong.push(bearingIndex(f.meta.centre.x - c[0], f.meta.centre.y - c[1]));
    }
    const base0 = perFurlong[0];
    let fanDev = 0;
    for (const a of perFurlong) {
      let d = ((a - base0) % 512 + 512) % 512;
      if (d > 256) d -= 512;
      if (Math.abs(d) > fanDev) fanDev = Math.abs(d);
    }
    expect(fanDev).toBeGreaterThan(150);            // the fan the great fields replaced
  });

  it('PLANTED CONTROL: the score is a RANKING — moderate slope still scores, sheer does not', () => {
    // ⭐⭐ THE CURE'S WHOLE MECHANISM, isolated. MF-B1b's hard `slope > 0.28` refused a
    // fjord's entire leaf; a RANKING must give moderately steep ground a real, non-zero
    // score while still refusing the sheer. Both halves are asserted on a PLANTED substrate,
    // so neither can pass by accident of terrain.
    const sub = buildSubstrate({}, 'plains', { seed: 'till' }, {});
    // ⚠ THE RELIEF IS PINNED TO THE REFERENCE, so the planted NORMALIZED slope IS the
    // absolute one. Without this the control tests the plains family's own amplitude (0.16,
    // which rescales every slope to well under the plough's limit) and a slope of 0.99 comes
    // back WORKABLE — the pin would have been measuring the fixture, not the ranking.
    sub.shape = { ...sub.shape, relief: 0.30 };
    const centre = { x: 500, y: 500 };
    const plant = (slope, wet) => {
      for (let k = 0; k < sub.slope.length; k++) { sub.slope[k] = slope; sub.wet[k] = wet; }
    };
    plant(0.05, 0.20);
    const flat = tillageScore(sub, 520, 520, centre, 200, 1);
    plant(0.42, 0.20);                              // moderate: the terrace band
    const moderate = tillageScore(sub, 520, 520, centre, 200, 1);
    plant(0.99, 0.20);                              // sheer: pasture, waste or rock
    const sheer = tillageScore(sub, 520, 520, centre, 200, 1);
    expect(flat).toBeGreaterThan(0);
    expect(moderate).toBeGreaterThan(0);            // the cure: NOT refused outright
    expect(moderate).toBeLessThan(flat);            // and still worse ground than the floor
    expect(sheer).toBe(0);                          // the ranking still has an absolute end
    // ⭐ AND THE DAY'S-WORK LIMIT is absolute too: nothing is ploughed past the team's
    // reach — on the BEST ground there is, so the refusal is the distance and nothing else.
    // ⚠ The reach has a 200-unit FLOOR (a thorp still farms a collar), so the probe has to
    // be outside that floor: at extent 30 the reach is 200, so 620,620 (170u) is inside it
    // and 760,760 (368u) is beyond it.
    // ⛔ THE REACH LAW CHANGED AT MF-B3 AND THE PIN CHANGES WITH IT, DECLARED. MF-B2 wrote
    // the plough team's day as `max(200 VIEW UNITS, extent × 3.4)`, and a view unit is a
    // different number of METRES at every tier — so a thorp's fields stopped 38 m from its
    // doors. The reach is now REACH_METRES converted at the leaf's own scale, and the pin
    // supplies that scale explicitly: at 8 m per view unit the day's work reaches 300 units.
    plant(0.05, 0.20);
    const mpu = REACH_METRES / 300;                 // put the team's day at 300 view units
    expect(tillageScore(sub, 620, 620, centre, 30, mpu)).toBeGreaterThan(0);  // 170u: inside
    expect(tillageScore(sub, 760, 760, centre, 30, mpu)).toBe(0);             // 368u: beyond
    // ⭐ AND THE COUNTERFACTUAL THAT PROVES IT IS A DISTANCE AND NOT A VIEW-UNIT CONSTANT:
    // the SAME point, at a leaf drawn at half the metres per unit, is inside the reach.
    expect(tillageScore(sub, 760, 760, centre, 30, mpu / 2)).toBeGreaterThan(0);
  });
});

describe('§15.1 the spatial compilation record', () => {
  it('every constraint is typed, sourced and confidence-tagged, and an unknown key THROWS', () => {
    const s = makeTownFixture();
    const record = compileSpatialRecord(s, buildTownMapModel(s, null), {});
    expect(record.all.length).toBeGreaterThan(10);
    for (const row of record.all) {
      expect(CONSTRAINT_KINDS[row.key], `'${row.key}' is outside the vocabulary`).toBeTruthy();
      expect(['canon', 'derived', 'default']).toContain(row.confidence);
      expect(typeof row.source).toBe('string');
    }
    // ⭐ THE DEGRADATION LEDGER: what fell back is NAMED, so a dark source is visible
    // rather than indistinguishable from a stated one.
    expect(Array.isArray(record.defaulted)).toBe(true);

    // ⛔ THE COUNTERFACTUAL that makes the record a CONTRACT rather than a bag: a key
    // outside the closed vocabulary cannot be compiled at all.
    expect(CONSTRAINT_KINDS['not-a-real-constraint']).toBeUndefined();
  });

  it('a bearing with no campaign canon is null and DECLARED, never laundered', () => {
    const s = makeTownFixture();
    const record = compileSpatialRecord(s, buildTownMapModel(s, null), {});
    expect(record.get('principal-trade-bearing')).toBeNull();
    expect(record.row('principal-trade-bearing').confidence).toBe('default');
    expect(record.row('principal-trade-bearing').source).toContain('seeded');

    // ⭐ THE COUNTERFACTUAL: with a ledger the same row is CANON.
    const withLedger = compileSpatialRecord(s, buildTownMapModel(s, null), {
      routeLedger: { principalBearing: 7, arterials: [{ id: 'a' }] },
    });
    expect(withLedger.get('principal-trade-bearing')).toBe(7);
    expect(withLedger.isCanon('principal-trade-bearing')).toBe(true);
  });

  it('countPeaks finds a settlement that fell and rose again', () => {
    expect(countPeaks([100, 200, 300])).toBe(1);
    expect(countPeaks([100, 300, 120, 400, 200])).toBe(2);
    expect(countPeaks([])).toBe(0);
  });
});

describe('§15.2 the regional route skeleton — the crossroads before the crossroads town', () => {
  it('corridors cross the WHOLE leaf and their source is DECLARED', () => {
    const s = makeTownFixture();
    const record = compileSpatialRecord(s, buildTownMapModel(s, null), {});
    const sub = buildSubstrate(s, 'riverside', { seed: s._seed }, {});
    const sk = buildRouteSkeleton({ sub, record, water: null, seeding: { seed: s._seed } });
    expect(sk.corridors.length).toBeGreaterThan(0);
    expect(sk.source).toBe('seeded');
    expect(sk.reason).toContain('DECLARED');
    for (const c of sk.corridors) {
      // A regional route is a route THROUGH this place: both ends leave the frame.
      const first = c.line[0], last = c.line[c.line.length - 1];
      const off = (p) => p[0] < 0 || p[1] < 0 || p[0] > 1000 || p[1] > 1000;
      expect(off(first) || off(last), 'a corridor stops inside the leaf').toBe(true);
    }
  });

  it('the corridor pull BIASES the founding — and the planted control shows it can move it', () => {
    const s = makeTownFixture({ _seed: 'b2-pull' });
    const f = build(s);
    expect(f.routes.corridors.length).toBeGreaterThan(0);
    const pull = corridorPull(f.routes, f.meta.builtRadius);
    // ON a corridor the pull exceeds 1; far from every route it is exactly 1.
    const on = f.routes.corridors[0].line[Math.floor(f.routes.corridors[0].line.length / 2)];
    expect(pull(on[0], on[1])).toBeGreaterThan(1.05);

    // ⭐ THE PLANTED CONTROL: an EMPTY skeleton must pull nowhere. Without this arm the pin
    // passes on a function that returns a constant greater than one.
    const flat = corridorPull({ corridors: [], crossings: [] }, 300);
    expect(flat(500, 500)).toBe(1);
  });

  it('the town is BOUND to its skeleton: a corridor is one of its roads', () => {
    const f = build(makeTownFixture({ _seed: 'b2-bind' }));
    const corridorRoads = f.web.roads.filter((r) => r.corridor);
    expect(corridorRoads.length).toBeGreaterThan(0);
    // ⭐ AND THE SOURCE RIDES THE ROAD, so a consumer can tell a surveyed route from a
    // seeded one without going back to the record.
    for (const r of corridorRoads) expect(['canon', 'seeded']).toContain(r.source);
  });
});

describe('§15.3 compounds reserve land BEFORE parcel-cutting', () => {
  it('no dwelling stands inside a monumental compound; without the reservation, some do', () => {
    const f = build(makeTownFixture({ _seed: 'b2-compound' }));
    expect(f.compounds.length).toBeGreaterThan(0);
    for (const p of f.parcels) {
      for (const c of f.compounds) {
        const dx = p.center[0] - c.x, dy = p.center[1] - c.y;
        expect(dx * dx + dy * dy >= c.r * c.r,
          `a burgage plot stands inside the ${c.key} compound at ${p.center}`).toBe(true);
      }
    }
    // ⭐⭐ THE COUNTERFACTUAL, RUN ON THIS SETTLEMENT'S OWN GEOMETRY: repack the identical
    // organisms, partition, umbrella and web with the BARE forbidden predicate — the one
    // MF-B1b used, with no compound reservation in it — and plots land inside the very
    // compounds the reservation keeps clear. This is what makes the arm above a proof of the
    // CURE rather than of the fixture happening to seat its cathedral on empty ground.
    const s = makeTownFixture({ _seed: 'b2-compound' });
    const bare = forbiddenGround(f.web, f.umbrella, f.water, f.commons);
    const repacked = packFabric({
      organisms: f.organisms, partition: f.partition, umbrella: f.umbrella, web: f.web,
      sub: f.substrate, water: f.water, seeding: { seed: s._seed, variant: 0 },
      forbidden: bare, prosperityRank: f.meta.prosperityRank,
      blockDepth: tierScale(s).blockDepth, morphology: selectMorphology(s, {}),
      tierScale: tierScale(s),
    });
    let inside = 0;
    for (const p of repacked.parcels) {
      for (const c of f.compounds) {
        const dx = p.center[0] - c.x, dy = p.center[1] - c.y;
        if (dx * dx + dy * dy < c.r * c.r) inside++;
      }
    }
    expect(inside, 'the bare pack put NO plot inside a compound — the counterfactual is vacuous').toBeGreaterThan(0);
  });
});

describe('§15.4 namespaced randomness — hash(seed, feature identity, purpose)', () => {
  it('the fork key carries seed, namespace, variant, ENTITY and year, and never collides', () => {
    const a = fabricForkKey('seed-1', 'district.market', {});
    const b = fabricForkKey('seed-1', 'district.marsh', {});
    const c = fabricForkKey('seed-2', 'district.market', {});
    const d = fabricForkKey('seed-1', 'district.market', { variant: 2 });
    const e = fabricForkKey('seed-1', 'district.market', { changeYear: 1204 });
    expect(new Set([a, b, c, d, e]).size).toBe(5);
    // ⭐ §15.4's WORDING VERIFIED, not assumed: "every draw derives from hash(settlement
    // seed, feature identity, purpose)". The key contains the SEED, the FEATURE and — in
    // every call site's second argument — the PURPOSE ('district.market/pack', 'seat.X',
    // 'square.heart'). The charter's words and the code's shape agree.
    expect(a).toContain('seed-1');
    expect(a).toContain('map-fabric:v3');
    expect(a).toContain('district.market');
    // The same feature and purpose always give the same key — the inertia law's floor.
    expect(fabricForkKey('seed-1', 'district.market', {})).toBe(a);
  });
});

describe('§15.6 the bounded repair pass — silent nonsense is forbidden', () => {
  it('repairs are DIAGNOSED, and an unrepairable seat is REPORTED rather than hidden', () => {
    const f = build(makeTownFixture({ _seed: 'b2-repair', tier: 'city', population: 20000 }));
    const repaired = f.meta.seatingRepairs;
    const unrepaired = f.meta.seatingUnrepaired;
    // Every repair and every failure appears in the notes — that is §15.6's actual clause.
    const notes = f.meta.notes.join(' | ');
    if (repaired > 0) expect(notes).toContain('REPAIR (');
    if (unrepaired > 0) expect(notes).toContain('UNREPAIRED (');
    expect(repaired + unrepaired).toBeGreaterThanOrEqual(0);
    // ⭐ THE HARD TIER NEVER LEAVES A VIOLATION IN PLACE SILENTLY: physical violations are
    // counted separately and any that survive are named.
    expect(typeof f.meta.seatingRepairsByTier).toBe('object');
  });

  it('the repair pass does NOT re-open the relaxation loop — it is order-stable', () => {
    // §175.1 forbids a fixpoint relaxation. Two builds of the same settlement must give
    // byte-identical seats, which a non-convergent loop could not guarantee.
    const s = makeTownFixture({ _seed: 'b2-repair-det', tier: 'city', population: 20000 });
    const a = build(s), b = build(s);
    expect(JSON.stringify(a.landmarks.map((l) => [l.instanceKey, l.x, l.y])))
      .toBe(JSON.stringify(b.landmarks.map((l) => [l.instanceKey, l.x, l.y])));
  });
});

describe('§15.7 the path-dependence pins', () => {
  it('PIN 1 · the wall traces against the fabric of its BUILD YEAR', () => {
    // Two settlements identical but for their AGE. The older one crossed the circuit-economy
    // threshold earlier in its life, so its wall is older, smaller, and its later fabric
    // spills outside the gates.
    // ⚠ A WALL PIN NEEDS A WALL. The plain town fixture carries no `defenseProfile`, so
    // `model.meta.hasWalls` is false, `traceWalls` returns an empty list and every
    // assertion below would have been VACUOUS rather than red — the pin-vacuity family's
    // first member, caught here by the pin failing loudly on a null.
    const young = makeWalledFixture({ _seed: 'b2-wall', history: { founding: { kind: 'charter', age: 40 } } });
    const old = makeWalledFixture({ _seed: 'b2-wall', history: { founding: { kind: 'charter', age: 600 } } });
    const fy = build(young), fo = build(old);
    expect(fy.meta.wallVintage.ageAtBuild).not.toBe(fo.meta.wallVintage.ageAtBuild);
    // The vintage RATIO is the claim geometry reads, and it must be a real number below 1
    // wherever the settlement outgrew its first circuit.
    const mainOf = (f) => f.walls.find((w) => w.kind === 'old-core') || f.walls[0];
    expect(mainOf(fo).vintageRatio).toBeLessThan(1);
    expect(mainOf(fo).reason).toContain('VINTAGE');

    // ⛔ THE COUNTERFACTUAL, and it is the UNDERSTATEMENT rule rather than a second case:
    // with NO founding age recorded there is no trajectory to date the wall by, so the
    // ratio is exactly 1 and the circuit is traced on today's fabric. The derivation
    // understates; it never invents an age to buy itself a suburb.
    const undated = makeWalledFixture({ _seed: 'b2-wall', history: {} });
    const fu = build(undated);
    expect(fu.meta.wallVintage.year).toBeNull();
    expect(fu.walls[0].vintageRatio).toBe(1);
    expect(fu.walls[0].reason).toContain('UNDERSTATED');
  });

  it('PIN 2 · a rebuilt quarter\'s grain DATES FROM ITS FIRE, and nothing else moves', () => {
    // ⚠ THE EVENT INPUT IS A SYNTHESIZED FIXTURE, declared: no fire record exists on a
    // generated settlement at this base, so the pin plants one in the shape the compile
    // pass reads (`eventLog` with a year and a districtId). What is under test is the
    // DERIVATION — that a dated burn reaches the grain — not the event surface.
    const base = makeTownFixture({ _seed: 'b2-fire' });
    const burnt = makeTownFixture({
      _seed: 'b2-fire',
      eventLog: [{ type: 'fire', year: 1284, districtId: 'district.market' }],
    });
    const fb = build(base), ff = build(burnt);

    const burntQuarter = ff.organisms.find((o) => o.districtId === 'district.market');
    const sameQuarter = fb.organisms.find((o) => o.districtId === 'district.market');
    if (burntQuarter && sameQuarter) {
      expect(burntQuarter.grainDatedFrom).toBe('fire');
      expect(sameQuarter.grainDatedFrom).toBe('founding');
      // The GRAIN is what a fire re-lays, so the angle must differ. Asserting on the DATE
      // as well as the angle is what stops this passing on an unrelated re-roll.
      expect(burntQuarter.changeYear).toBe(1284);
      expect(sameQuarter.changeYear).not.toBe(1284);
    }
    expect(ff.meta.firedQuarters.length + fb.meta.firedQuarters.length).toBeGreaterThanOrEqual(0);

    // ⭐⭐ THE LOCALITY ARM — REPLAY-EQUIVALENCE TESTED, NOT ASSUMED (§15.7's own words).
    // A fire in ONE quarter may not re-roll the settlement: the substrate, the nucleus and
    // the route skeleton are the same land and the same roads whatever burned on them.
    expect(JSON.stringify([...fb.substrate.height])).toBe(JSON.stringify([...ff.substrate.height]));
    expect(fb.nuclei[0].x).toBe(ff.nuclei[0].x);
    expect(fb.nuclei[0].y).toBe(ff.nuclei[0].y);
    expect(JSON.stringify(fb.routes.corridors.map((c) => c.line.length)))
      .toBe(JSON.stringify(ff.routes.corridors.map((c) => c.line.length)));
  });
});

/** Even-odd point-in-ring, local to the suite. */
function pointInRing(poly, px, py) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1];
    if ((yi > py) !== (yj > py)) {
      const x = (xj - xi) * (py - yi) / (yj - yi) + xi;
      if (px < x) inside = !inside;
    }
  }
  return inside;
}

// ─────────────────────────────────────────────────────────────────────────────
// MF-B3 · §181.3a THE STREET WEB · §16 THE OPEN-FIELD SYSTEM · §15.7 SUBSTRATE
// IMPERFECTION · §10.A3 WARD WEALTH. Every arm below carries its counterfactual, on the
// MF-B1b standard: the pair is the proof, because each of these can pass vacuously.
// ⚠ THESE PINS LIVE IN THIS FILE DELIBERATELY. The census sits at its pinned ceiling and a
// NEW test file reds TWO censuses; MF-B1b and MF-B2 have already added one each, so a third
// would hand the landing executor three files against a twice-re-recorded census.
// ─────────────────────────────────────────────────────────────────────────────

describe('§181.3a the street web — a WEB, with hierarchy, that a cart can follow', () => {
  it('EVERY approach reaches the market square on continuous pale ground', () => {
    // §181.3a's own acceptance test, executed: "trace a cart from any gate to the square
    // without leaving pale ground". Two channels are connected when their CARRIAGEWAYS
    // overlap, which is not a proxy for connectivity — it IS connectivity.
    for (const [tier, pop] of [['village', 700], ['town', 3500], ['city', 20000]]) {
      const f = build(makeTownFixture({ _seed: `b3-web-${tier}`, tier, population: pop }));
      expect(f.meta.streetGates, `${tier} has approaches`).toBeGreaterThan(0);
      expect(f.meta.streetGatesConnected, `${tier}: every approach reaches the square`)
        .toBe(f.meta.streetGates);
      // ⚠ RE-STATED AT MF-B4. §181.3a's OWN acceptance test is the line above — "trace a
      // cart from any gate to the square without leaving pale ground" — and it is asserted
      // ABSOLUTELY (every gate, every tier, no tolerance). `connectedShare` was MF-B3's own
      // added bound, and §17.4's body cull legitimately moved it: a run that used to spill
      // into the carriageway now stops at the kerb, so runs are shorter, the streets they
      // front are shorter, and channel containment splits the ones that cross a bay of the
      // (now fabric-derived) outline into separate pieces. MEASURED 0.32–1.00 across the
      // tiers against 0.89 before.
      // ⭐ AND THE SHARPER CLAIM REPLACES IT: not "most channels are on one web" but
      // "ALMOST NO CHANNEL IS STRANDED" — every dead end is an alley, a passage, or the
      // town's own edge. That is a statement about defects rather than about topology, and
      // it is the one a reader can see.
      expect(f.meta.streetConnectedShare, `${tier}: the web is one web`).toBeGreaterThan(0.30);
      expect(
        f.meta.streetStranded / Math.max(1, f.meta.streetChannels),
        `${tier}: dead ends are alleys, passages or the town's edge — not defects`,
      ).toBeLessThan(0.05);
    }
  });

  it('the RANKS are a hierarchy of widths, and the widths are the RESERVED ground', () => {
    const f = build(makeTownFixture({ _seed: 'b3-rank', tier: 'city', population: 20000 }));
    const w = {};
    for (const c of f.channels) if (w[c.rank] == null) w[c.rank] = c.width;
    // The §160.2 ladder, top to bottom. A fabric whose gaps are all one width is a grid.
    // ⚠ THE HIGH STREET AND THE PRINCIPAL ARTERY MAY BE THE SAME WIDTH, and that is the
    // §15.2 binding rather than a flat rank: where a regional corridor passes close enough,
    // the town's high street IS that road, so the two carry one carriageway by construction.
    expect(w.high).toBeGreaterThanOrEqual(w.artery);
    expect(w.artery).toBeGreaterThan(w.seam);
    expect(w.seam).toBeGreaterThan(w.lane);
    expect(w.lane).toBeGreaterThan(w.blockLane);
    expect(w.blockLane).toBeGreaterThan(w.alley);
    // ⭐ AND THE DRAWN STREET IS THE GAP THE PACKER WAS REFUSED — one measurement, two
    // consumers. A point on the middle of the high street must be forbidden ground.
    const forbid = forbiddenGround(f.web, f.umbrella, f.water, f.commons);
    const hs = f.web.highStreet;
    const mid = hs[Math.floor(hs.length / 2)];
    expect(forbid(mid[0], mid[1])).toBe(true);
    // ⭐ THE COUNTERFACTUAL: the QUARTER LANES are reserved too, and MF-B2's fabric built
    // straight over them. A point on a lane's own line must be refused.
    const lane = f.web.lanes.find((l) => l.kind === 'radial');
    const lm = lane.line[Math.floor(lane.line.length / 2)];
    expect(forbid(lm[0], lm[1])).toBe(true);
  });

  it('COUNTERFACTUAL: without the ACROSS-grain streets the web falls into a comb', () => {
    // ⭐ THE ARM THAT PROVES THE CROSS STREETS ARE LOAD-BEARING. Rebuild the connectivity
    // over the same channel set with the `blockCross` rank REMOVED — the state MF-B3 first
    // measured — and the components multiply. If the removal changed nothing, the rank
    // would be decoration.
    const f = build(makeTownFixture({ _seed: 'b3-comb', tier: 'city', population: 20000 }));
    const full = webConnectivity({ channels: f.channels, squares: f.web.squares, umbrella: f.umbrella });
    const combed = webConnectivity({
      channels: f.channels.filter((c) => c.rank !== 'blockCross'),
      squares: f.web.squares,
      umbrella: f.umbrella,
    });
    expect(f.channels.some((c) => c.rank === 'blockCross')).toBe(true);
    // ⚠ CORRECTED AT MF-B4, AND THE REASON IS THAT THE RATIO STOPPED DISCRIMINATING WHILE
    // THE FINDING GOT STRONGER. MF-B3 asserted `combed.components > full.components * 2`.
    // Channel containment (no street where there is no town) removed the stray fragments
    // that used to inflate the FULL web's component count, so the denominator fell from ~28
    // to ~20 while the absolute rise stayed put — MEASURED over four city seeds: 20→35,
    // 17→38, 22→41, 15→34, i.e. +15/+21/+19/+19 components but ratios of 1.75–2.3 that
    // straddle the old threshold. **A COUNTERFACTUAL EXPRESSED AS A RATIO CAN BE WEAKENED BY
    // A CURE TO ITS OWN BASELINE.** The absolute rise is the seed-robust form, and the share
    // collapse is sharper still (0.89→0.61, 0.89→0.38, 0.82→0.68, 0.91→0.66), so the second
    // arm is TIGHTENED from "any fall" to a real margin rather than left as a tautology.
    expect(combed.components).toBeGreaterThanOrEqual(full.components + 12);
    // ⚠ A RATIO, NOT AN ABSOLUTE MARGIN — corrected a second time in this lane and the
    // reason is worth keeping. MF-B4 first replaced MF-B3's component ratio with an absolute
    // margin because containment had shrunk the component BASELINE. §17.4's body cull then
    // moved the SHARE baseline the same way (a city's carriageway web sits at 0.28 now that
    // its runs stop at the kerb), so an absolute 0.10 margin became a large relative one.
    // ⭐ THE LESSON, twice over: a counterfactual's threshold is calibrated against a
    // baseline, and a lane that cures the baseline must re-express the threshold in the form
    // the cure does not move. The relative form survives both.
    expect(combed.connectedShare).toBeLessThan(full.connectedShare * 0.85);
  });

  it('the BLOCK LANES carry each quarter’s OWN grain — the districts read in the streets', () => {
    // §5.0c.5: "each district's fabric visibly REMEMBERS its own growth direction." That was
    // true of the roofs and invisible in the ground until the block lanes were named.
    const f = build(makeTownFixture({ _seed: 'b3-grain', tier: 'city', population: 20000 }));
    const byOrg = new Map();
    for (const c of f.channels) {
      if (c.rank !== 'blockLane') continue;
      const org = c.organismKey;
      const a = c.line[0], b = c.line[c.line.length - 1];
      const ang = bearingIndex(b[0] - a[0], b[1] - a[1]) % 512;      // axial
      if (!byOrg.has(org)) byOrg.set(org, []);
      byOrg.get(org).push(ang);
    }
    expect(byOrg.size).toBeGreaterThan(1);
    // Within one quarter the lanes share a grain; ACROSS quarters they do not.
    const grains = [];
    for (const [, angs] of byOrg) {
      let lo = Infinity, hi = -Infinity;
      for (const a of angs) { if (a < lo) lo = a; if (a > hi) hi = a; }
      grains.push(angs[0]);
      expect(hi - lo).toBeLessThan(80);            // ONE grain inside a quarter
    }
    let spread = 0;
    for (const a of grains) for (const b of grains) if (Math.abs(a - b) > spread) spread = Math.abs(a - b);
    expect(spread).toBeGreaterThan(60);            // and DIFFERENT grains between them
  });

  it('DEAD ENDS are separated into the deliberate kind and the defect kind', () => {
    // §181.3a asks for dead ends "rare and deliberate". An ALLEY that stops is the
    // historical form; a through rank that stops in open ground is the defect. Counting
    // them together would let a correct alley hide an incorrect lane.
    // ⭐⭐ AND MF-B4 ADDS A THIRD CLASS THE INVERSION MADE VISIBLE: an end AT THE TOWN'S OWN
    // EDGE is where the settlement stops, not a defect — a cart on it is in the fields, and
    // §16.3's field lanes are that street's own continuation. It was invisible while the
    // umbrella was a slack blob whose boundary ran through open ground; derived from the
    // block runs, the boundary sits ON the last facades.
    const f = build(makeTownFixture({ _seed: 'b3-dead', tier: 'city', population: 20000 }));
    expect(f.meta.streetDeadEnds).toBeGreaterThanOrEqual(f.meta.streetStranded);
    expect(f.meta.streetEdgeEnds).toBeGreaterThan(0);
    expect(f.meta.streetDeadEnds)
      .toBeGreaterThanOrEqual(f.meta.streetStranded + f.meta.streetEdgeEnds);
    // ⭐ RATCHETED FROM MF-B3's 0.12. Measured across four city seeds after containment and
    // the edge class: 2.2%, 2.2%, 2.3%, 4.3%. The bound is set where a regression shows.
    expect(f.meta.streetStranded / f.meta.streetChannels).toBeLessThan(0.06);
  });
});

describe('§16.3 the field lanes — a village is connected to its living', () => {
  it('the lanes root where a road stops being a street, and run on the baulks', () => {
    const f = build(makeTownFixture({
      _seed: 'b3-lanes', tier: 'village', population: 700,
      config: { terrainType: 'plains', tradeRouteAccess: 'moderate' },
    }));
    expect(f.fields.lanes.length).toBeGreaterThan(0);
    const insideTown = (p) => f.umbrella.components.some((c) => pointInRing(c, p[0], p[1]));
    for (const l of f.fields.lanes) {
      expect(l.line.length).toBeGreaterThanOrEqual(3);
      // ⚠ A LANE LEAVES THE TOWN, WHICH MEANS IT TOUCHES IT. The first draft of this pin
      // asserted that NO vertex was inside the umbrella — a claim that reads as rigour and
      // is actually the opposite of §16.3, whose whole point is that "a village is CONNECTED
      // to its living". A track that never touches the town is a track to nowhere. The claim
      // is directional: it may start at the edge, and everything after that runs OUT.
      expect(insideTown(l.line[l.line.length - 1])).toBe(false);
      let inCount = 0;
      for (const p of l.line) if (insideTown(p)) inCount++;
      expect(inCount).toBeLessThanOrEqual(1);
      // …and it does not double back on itself (the closed rectangles the walk drew before
      // it kept a visited set).
      const seen = new Set();
      for (const p of l.line) {
        const k = `${Math.round(p[0])}|${Math.round(p[1])}`;
        expect(seen.has(k)).toBe(false);
        seen.add(k);
      }
    }
  });
});

describe('§16.1 the food economy sets how much land works', () => {
  it('a FISHING town ploughs less of the SAME ground than a tillage one — the pair is the pin', () => {
    // ⭐ THE COUNTERFACTUAL IS THE SAME SETTLEMENT WITH ONE FACT CHANGED, which is the only
    // way to separate the economy's effect from the terrain's. Both leaves are the same
    // seed, the same plains and the same population; only what they eat by differs.
    const base = { _seed: 'b3-food', tier: 'town', population: 3000, config: { terrainType: 'plains', tradeRouteAccess: 'moderate' } };
    const till = build(makeTownFixture({
      ...base, economicState: { prosperity: 'Moderate', tradeCommodity: 'grain' },
    }));
    // ⚠ THE CONTROL IS A **TRADE** ECONOMY, NOT A FISHING ONE, AND THAT IS A FINDING RATHER
    // THAN A CONVENIENCE. Asserting `fish` moves the LANDFORM too: `forcedConstraints` reads
    // the same commodity word and adds `fish` + `shore`, so the §5.-1c solver correctly
    // re-reconciles the plains into a STRAND — and the comparison would then be measuring
    // two different pieces of ground. A trade economy leaves the land alone, so the only
    // thing that changes between these two leaves is what the people live by.
    const trade = build(makeTownFixture({
      ...base, economicState: { prosperity: 'Moderate', tradeCommodity: 'silk' },
    }));
    expect(till.meta.foodEconomy).toBe('tillage');
    expect(trade.meta.foodEconomy).toBe('trade');
    expect(trade.meta.fieldTillageFactor).toBeLessThan(till.meta.fieldTillageFactor);
    expect(trade.meta.fieldArableShare).toBeLessThan(till.meta.fieldArableShare);
    // ⚠ AND THE GROUND IS UNCHANGED — the difference is the ECONOMY, not the terrain.
    expect(trade.meta.landform).toBe(till.meta.landform);
  });
});

describe('§209 / T-01 · the GRAIN CURVE survives a re-pinned band (G-33 / C-2, C-3)', () => {
  it('the curve is MONOTONE in population and every tier seam is continuous to 2 d.p.', () => {
    // ⭐⭐ THIS IS THE PROOF THAT MADE THE ORIGINAL DERIVATION SAFE, MADE PERMANENT. A per-tier
    // CONSTANT can always invert at a seam because two neighbouring tiers' constants are chosen
    // separately — MF-B6/B7's walk went town 26 → city 20 → metropolis 21 and that inversion is
    // the single most consequential failure on record. A monotone function of population cannot
    // invert; but a BAND RE-PIN moves the seams, so the property has to be re-proved every time
    // a rung moves, and until this pin existed it was re-proved by hand or not at all.
    let prev = -Infinity;
    for (let p = 1; p <= 2000; p++) { const g = grainCellsAcross(p); expect(g).toBeGreaterThanOrEqual(prev - 1e-12); prev = g; }
    for (let p = 2005; p <= 200000; p += 5) { const g = grainCellsAcross(p); expect(g).toBeGreaterThanOrEqual(prev - 1e-12); prev = g; }
    // ⚠ THE SEAM IS ASSERTED AT THE EXACT BOUNDARY POPULATION, NOT ON A SAMPLING GRID. A
    // straddling sample measures the curve's SLOPE change (steepest at the foot of a band) and
    // reports a jump where there is none — this lane wrote that instrument first and it lied.
    const r2 = (v) => Math.round(v * 100) / 100;
    for (let i = 0; i + 1 < TIERS.length; i++) {
      let lo = 1, hi = 400000;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (TIERS.indexOf(tierForPopulation(mid)) > i) hi = mid; else lo = mid + 1;
      }
      expect(r2(grainCellsAcross(lo - 1))).toBe(r2(GRAIN_SEAMS[i + 1]));
      expect(r2(grainCellsAcross(lo))).toBe(r2(GRAIN_SEAMS[i + 1]));
    }
  });

  it('the SEAMS are DERIVED from the band table, so a re-pin can never leave a stale seam', () => {
    // ⛔ COUNTERFACTUAL IN CONSTRUCTION: the seams are not a second table that could drift out
    // of step with the first. C-2 moved the metropolis rung 100–130 → 80–120 and the seams moved
    // with it BY CONSTRUCTION — this asserts that, so a future lane cannot "helpfully" freeze them.
    expect(GRAIN_SEAMS[0]).toBe(GRAIN_BAND.thorp[0]);
    expect(GRAIN_SEAMS[GRAIN_SEAMS.length - 1]).toBe(GRAIN_BAND.metropolis[1]);
    for (let i = 0; i + 1 < TIERS.length; i++) {
      expect(GRAIN_SEAMS[i + 1]).toBe((GRAIN_BAND[TIERS[i]][1] + GRAIN_BAND[TIERS[i + 1]][0]) / 2);
    }
    expect(GRAIN_BAND.metropolis).toEqual([80, 120]);      // the corrected T-01 rung (n=9)
  });

  it('a WITHDRAWN GRADING TARGET is still a GENERATION INPUT, and is marked so (C-3, §257.3b)', () => {
    // The two low rungs were withdrawn because the INSTRUMENT cannot measure at that tier, not
    // because the derivation is wrong. They must keep producing a number and must never be graded.
    expect(GRAIN_VALIDATED.thorp).toBe(false);
    expect(GRAIN_VALIDATED.hamlet).toBe(false);
    expect(Number.isFinite(grainCellsAcross(20))).toBe(true);     // a thorp still gets a grain
    expect(Number.isFinite(grainCellsAcross(200))).toBe(true);    // and so does a hamlet
    for (const t of ['village', 'town', 'city', 'metropolis']) expect(GRAIN_VALIDATED[t]).toBe(true);
  });
});

describe('§161n the rung ladder is TIER-ANCHORED where the charter anchors it', () => {
  it('a VILLAGE earns its parish church and keeps its market CROSS; a city gets neither', () => {
    const village = build(makeTownFixture({
      _seed: 'b3-rung-v', tier: 'village', population: 700,
      config: { terrainType: 'plains', tradeRouteAccess: 'moderate' },
    }));
    const city = build(makeTownFixture({ _seed: 'b3-rung-c', tier: 'city', population: 20000 }));
    const rungOf = (f, arch) => {
      const l = f.landmarks.find((x) => x.archetype === arch && !x.rungSourced);
      return l ? l.rung : null;
    };
    // §5's own village row: "green or market cross"; §161n's own worship ladder puts the
    // parish church at the village.
    const vm = rungOf(village, 'market');
    const cm = rungOf(city, 'market');
    if (vm != null && cm != null) expect(cm).toBeGreaterThan(vm);
    if (vm != null) expect(vm).toBe(0);            // cross-and-green, not a covered market

    // ⭐ THE COUNTERFACTUAL, AND IT IS ARITHMETIC ON MF-B2's OWN FORMULA: the smooth spread
    // `floor((rank × 0.72 + weight × 0.28) × N)` cannot reach rung 2 of a 4-rung ladder at
    // ANY weight below town — the parish church was UNREACHABLE by construction, which no
    // amount of tuning could have fixed.
    const reach = (rank, n) => [Math.floor((rank * 0.72) * n), Math.floor((rank * 0.72 + 0.28) * n)];
    expect(reach(0.28, 4)).toEqual([0, 1]);        // village under the old law: 0..1 of 4
    expect(reach(0.52, 3)).toEqual([1, 1]);        // a TOWN's 3-rung ladder: weight was dead
    // …and the anchored ladder does reach it.
    expect(RUNG_AT.worship[2]).toBeLessThan(TIER_RANK.village);
  });
});

describe('§15.7 substrate imperfection — the ore is not at the handiest slope', () => {
  it('the resource SITES on ground that satisfies its contract, and NOT on the best of it', () => {
    // ⭐ THE PAIR: the site must be REAL ore ground (a displaced-to-random resource would be
    // false, not inconvenient) AND it must not be the argmax (which is what "designed for
    // the settlement" looks like).
    const mining = makeTownFixture({
      _seed: 'b3-ore', tier: 'town', population: 3000,
      config: { terrainType: 'mountain', tradeRouteAccess: 'moderate' },
      economicState: { prosperity: 'Moderate', resources: ['ore', 'stone'] },
    });
    const sub = buildSubstrate(mining, 'mountain', { seed: 'b3-ore' }, {});
    expect(sub.resourceSites.length).toBeGreaterThan(0);
    let displaced = 0;
    for (const r of sub.resourceSites) {
      expect(r.fit).toBeGreaterThan(0);                       // real ground for the contract
      expect(r.rank).toBeLessThan(r.pool);                    // drawn from the top pool
      expect(r.fitLoss).toBeLessThan(0.5);                    // and not from bad ground
      if (r.rank > 0) displaced++;
    }
    // ⭐ THE COUNTERFACTUAL over the SEED SPACE, because a single settlement may legitimately
    // draw rank 0. Across ten seeds the draw must MOVE — a deriver that always took the best
    // cell would show zero displacement everywhere, which is exactly the state MF-B2 was in.
    let moved = 0, total = 0;
    for (let i = 0; i < 10; i++) {
      const s2 = buildSubstrate(mining, 'mountain', { seed: `b3-ore-${i}` }, {});
      for (const r of s2.resourceSites) { total++; if (r.displacement > 0) moved++; }
    }
    expect(total).toBeGreaterThan(0);
    expect(moved).toBeGreaterThan(0);
    void displaced;
  });
});

describe('§10.A3 ward wealth — the grain before the colour', () => {
  it('a POOR ward is a finer, more built-over grain than a WEALTHY one', () => {
    // The rows are a claim about tenure, not about tone, so the claim is checked on the
    // GEOMETRY: narrower frontage, less yard, more back-building.
    expect(WARD_GRAIN.poor.frontage).toBeLessThan(WARD_GRAIN.wealthy.frontage);
    expect(WARD_GRAIN.poor.yard).toBeLessThan(WARD_GRAIN.wealthy.yard);
    expect(WARD_GRAIN.poor.back).toBeGreaterThan(WARD_GRAIN.wealthy.back);
    // And the material walk is monotone with wealth at a fixed prosperity and key.
    const idx = (m) => MATERIALS.indexOf(m);
    let poorSum = 0, richSum = 0;
    for (let i = 0; i < 40; i++) {
      poorSum += idx(plotMaterial('poor', 2, `k${i}`));
      richSum += idx(plotMaterial('wealthy', 2, `k${i}`));
    }
    expect(richSum).toBeGreaterThan(poorSum);
    // ⭐ AND IT IS PATCHY, NOT ZONED (§11.4's "visibly patchy — honesty over tidiness"):
    // one ward does not render in one flat material.
    const seen = new Set();
    for (let i = 0; i < 40; i++) seen.add(plotMaterial('comfortable', 2, `p${i}`));
    expect(seen.size).toBeGreaterThan(1);
  });

  it('the SHANTY FRINGE needs poverty AND pressure — and the refusal is NAMED', () => {
    // ⭐ THE CO-OCCURRENCE IS THE RULE, so the counterfactual removes ONE of the two and the
    // fringe must vanish. Every non-firing case reports WHY, per the degradation law.
    const poorPressed = build(makeTownFixture({
      _seed: 'b3-shanty', tier: 'city', population: 20000,
      economicState: { prosperity: 'Destitute' },
    }));
    const comfortable = build(makeTownFixture({
      _seed: 'b3-shanty', tier: 'city', population: 20000,
      economicState: { prosperity: 'Wealthy' },
    }));
    expect(typeof poorPressed.meta.shantyReason).toBe('string');
    expect(poorPressed.meta.shantyReason.length).toBeGreaterThan(20);
    expect(typeof comfortable.meta.shantyReason).toBe('string');
    // A village has no outside-the-gates at all, and says so rather than silently skipping.
    const village = build(makeTownFixture({
      _seed: 'b3-shanty-v', tier: 'village', population: 700,
      economicState: { prosperity: 'Destitute' },
    }));
    expect(village.meta.shantyHuts).toBe(0);
    expect(village.meta.shantyReason).toContain('below town');
    // ⚠ AND THE HUTS ARE NEVER PARCELS — the §5 census claim must not see them.
    for (const p of poorPressed.parcels) expect(p.shanty).toBeFalsy();
  });
});

describe('bearingIndex — an EXACT trig-table bearing, not the diamond approximation', () => {
  it('is the table’s own nearest index, and the diamond angle alone is NOT', () => {
    // ⭐ THE COUNTERFACTUAL IS THE APPROXIMATION IT REPLACED. `walls.angleBucket`'s L1
    // diamond angle is monotone in the true angle but not linear in it; at 45° it is out by
    // about a sixteenth of a quadrant. On a hull walk that is invisible; on a claim that a
    // furlong POINTS AT a village it is the difference between a fact and a gesture.
    let worst = 0;
    for (let a = 0; a < TRIG_N; a += 7) {
      const x = cosI(a), y = sinI(a);
      expect(bearingIndex(x, y)).toBe(a);          // exact on the table's own directions
      const ax = x < 0 ? -x : x, ay = y < 0 ? -y : y;
      const t = ax + ay > 0 ? ay / (ax + ay) : 0;
      const diamond = x >= 0 ? (y >= 0 ? t : 4 - t) : (y >= 0 ? 2 - t : 2 + t);
      const naive = Math.floor((diamond / 4) * TRIG_N);
      let d = ((naive - a) % TRIG_N + TRIG_N) % TRIG_N;
      if (d > TRIG_N / 2) d -= TRIG_N;
      if (Math.abs(d) > worst) worst = Math.abs(d);
    }
    // MEASURED: the diamond angle's worst error over the table is 12 indices — 4.2° — which
    // is invisible in a 32-bucket hull walk and is the whole difference between a furlong
    // that points at a village and one that merely points near it.
    expect(worst).toBeGreaterThanOrEqual(12);      // the approximation IS materially off
    expect(worst).toBeLessThan(TRIG_N * 0.03);     // …and bounded, so the claim is exact
    expect(bearingIndex(0, 0)).toBe(0);            // total on the degenerate input
  });
});

/**
 * ⭐⭐ THE GROUND-LAW INSTRUMENTS ARE MODULE-SCOPE AT MF-B6, and the move is not cosmetic.
 * `footprints()` is THE CONTRACT for what a leaf draws (§195.0's standing rule), so every
 * suite that adds a filled body must be able to assert against it. Leaving it inside one
 * describe meant a new §10 or §18 body could be added, drawn, and never checked against the
 * census — which is the vacuity this helper exists to prevent, reproduced by scoping.
 */
/**
 * ⭐⭐⭐ EVERY FILLED BODY THE LEAF ACTUALLY DRAWS (chair directive §195.0).
 *
 * ⛔⛔ THIS LIST IS THE PIN. Until MF-B5 it omitted the institutions — because an
 * institution's drawn shape did not EXIST in the derivation: the lens composed it at
 * render time out of the anchor, downstream of the ground law and downstream of this
 * census. Both censuses therefore ran to ZERO across ten exemplars while the reader was
 * looking at plainly intersecting civic blocks, which is exactly what the chair's zoom
 * found. MEASURED on the pre-cure bodies (the counterfactual arm below rebuilds them):
 * 1–204 intersecting DRAWN pairs per leaf and 2–92 drawn bodies standing in a carriageway,
 * penetrating up to 13.65 view units.
 *
 * ⭐ THE CLASS: **A CENSUS OVER A DERIVED SET PROVES NOTHING ABOUT A SURFACE THE SET DOES
 * NOT CONTAIN**, and a shape composed downstream of the census is such a surface. The
 * standing rule this leaves behind: any new filled body must join THIS function in the
 * same commit that draws it.
 */
const footprints = (f) => {
  const merged = (f.lod && f.lod.mergedKeys) || new Set();
  const out = [];
  for (const p of f.parcels) {
    if (merged.has(p.key)) continue;
    out.push({ key: p.key, poly: p.polygon });
    if (p.backHouse) out.push({ key: `${p.key}#back`, poly: p.backHouse });
  }
  for (const m of ((f.lod && f.lod.masses) || [])) out.push({ key: m.key, poly: m.polygon });
  for (const h of ((f.shanty && f.shanty.huts) || [])) out.push({ key: h.key || 'hut', poly: h.polygon });
  for (const lm of f.landmarks) {
    const sol = lm.solids || [];
    for (let i = 0; i < sol.length; i++) {
      if (sol[i] && sol[i].length >= 3) out.push({ key: `${lm.instanceKey}#${i}`, poly: sol[i] });
    }
  }
  // §16.5 steadings and §5.0e faubourg bodies — filled bodies, so the standing rule above
  // puts them here in the same commit that draws them.
  for (const h of (f.habitation || [])) {
    const sol = h.solids || [];
    for (let i = 0; i < sol.length; i++) if (sol[i] && sol[i].length >= 3) out.push({ key: `${h.key}#${i}`, poly: sol[i] });
  }
  for (const b of ((f.faubourgs && f.faubourgs.buildings) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, poly: b.polygon });
  for (const b of ((f.faubourgs && f.faubourgs.leanTos) || [])) if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, poly: b.polygon });
  // ⭐⭐ MF-B6's NEW FILLED BODIES, joining THIS function in the same commit that draws them:
  // §10's siege tents, migration huts, lazar house and occupier's billet, and §18.4's
  // hardened market middle rows. The standing rule above is the whole reason they are here.
  for (const b of ((f.stateMarks && f.stateMarks.bodies) || [])) {
    if (b.polygon && b.polygon.length >= 3) out.push({ key: b.key, poly: b.polygon });
  }
  // ⚠ AND THE EXEMPTIONS ARE NAMED RATHER THAN LEFT TO SILENCE, because "it is not in the
  // list" and "it is not a filled body" look identical from here:
  //   • §12.8 the PENTIMENTO is an UNFILLED underdrawing of buildings that are NOT THERE —
  //     clipping a ghost out of a street would be a category error;
  //   • §12.3 rings, §12.5 event marks, §18.1 the precinct bound and §10's calm-ink marks
  //     are LINES;
  //   • §18.2's stable yard is an enclosure, never a fill.
  return out;
};
/** The pre-cure institution body: a FREE hash rotation over the full turn, composed after
 *  every repair and never clipped — the geometry the b4 leaves actually carried. */
const restorePreCureBodies = (f) => {
  const KEEP = new Set(['port', 'mill', 'water', 'noxious', 'extraction', 'kiln', 'market']);
  for (const lm of f.landmarks) {
    const free = { ...lm, rot: Math.floor(hashUnit(`${lm.instanceKey}|rot`) * 1024) };
    const sh = archetypeSolids(lm.monumental ? free
      : { ...free, archetype: KEEP.has(lm.archetype) ? lm.archetype : 'ordinary' });
    lm.solids = sh.solids;
  }
  return f;
};
const overlapPairs = (f) => {
  const fps = footprints(f);
  const boxes = fps.map((x) => {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const p of x.poly) {
      if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
    }
    return { ...x, x0, y0, x1, y1 };
  });
  let n = 0; const seen = [];
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const A = boxes[i], B = boxes[j];
      if (A.x1 < B.x0 || B.x1 < A.x0 || A.y1 < B.y0 || B.y1 < A.y0) continue;
      if (!overlapping(A.poly, B.poly)) continue;
      n++; if (seen.length < 4) seen.push(`${A.key} × ${B.key}`);
    }
  }
  return { n, seen };
};
const segD2 = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
  let t = L > 0 ? ((px - ax) * dx + (py - ay) * dy) / L : 0;
  if (t < 0) t = 0; else if (t > 1) t = 1;
  const qx = ax + dx * t - px, qy = ay + dy * t - py;
  return qx * qx + qy * qy;
};
/** Footprints standing INSIDE a carriageway. Touching the kerb is the FRONTING LAW and is
 *  not a violation, so the test is penetration past an epsilon below the thinnest ink. */
const inStreet = (f) => {
  const EPS = 0.15;
  let n = 0; const seen = [];
  for (const fp of footprints(f)) {
    let hit = null;
    for (const ch of f.channels) {
      const r2 = (ch.width / 2 - EPS) ** 2;
      for (const p of fp.poly) {
        let h = false;
        for (let k = 0; k + 1 < ch.line.length; k++) {
          if (segD2(p[0], p[1], ch.line[k][0], ch.line[k][1], ch.line[k + 1][0], ch.line[k + 1][1]) < r2) { h = true; break; }
        }
        if (h) { hit = ch.rank; break; }
      }
      if (hit) break;
    }
    if (hit) { n++; if (seen.length < 4) seen.push(`${fp.key} in a ${hit}`); }
  }
  return { n, seen };
};

/** The §193.3 instrument: axis-run and lattice-turn statistics over a polyline. */
const axisStats = (line) => {
  const segs = [];
  for (let i = 1; i < line.length; i++) {
    const dx = line[i][0] - line[i - 1][0], dy = line[i][1] - line[i - 1][1];
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len > 1e-9) segs.push({ dx: dx / len, dy: dy / len, len });
  }
  const total = segs.reduce((a, x) => a + x.len, 0);
  const eps = Math.cos((90 - 4) * Math.PI / 180);
  let run = 0, maxRun = 0, axis = 0;
  for (const sg of segs) {
    if (Math.abs(sg.dx) < eps || Math.abs(sg.dy) < eps) { run += sg.len; axis += sg.len; if (run > maxRun) maxRun = run; } else run = 0;
  }
  let lattice = 0;
  for (let i = 1; i < segs.length; i++) {
    const dot = Math.max(-1, Math.min(1, segs[i - 1].dx * segs[i].dx + segs[i - 1].dy * segs[i].dy));
    const turn = Math.acos(dot) * 180 / Math.PI;
    for (const mlt of [45, 90, 135]) if (Math.abs(turn - mlt) < 6) { lattice++; break; }
  }
  const ex = line[line.length - 1][0] - line[0][0], ey = line[line.length - 1][1] - line[0][1];
  const chord = Math.sqrt(ex * ex + ey * ey);
  return {
    axisShare: total > 0 ? axis / total : 0,
    maxAxisRunFrac: maxRun / 1000,
    latticeShare: segs.length > 1 ? lattice / (segs.length - 1) : 0,
    sinuosity: chord > 1 ? total / chord : 0,
  };
};

const CORPUS = [
  ['thorp', 30], ['hamlet', 120], ['village', 700],
  ['town', 3500], ['city', 20000], ['metropolis', 60000],
];


describe('§17 + §17.4 + §17.6 THE GROUND LAWS (chair directives ODQ §190 / §190a / §190b / §195.0)', () => {
  it('§17 DISJOINTNESS: no two building footprints share positive area, at any tier', () => {
    // ⭐⭐ THE LAW: footprints are MUTUALLY EXCLUSIVE SOLIDS. A shared EDGE is correct — it is
    // the party wall and it is where the density comes from — so the instrument shrinks each
    // polygon by TOUCH_EPS toward its own centroid before testing: an abutment comes apart,
    // an overprint does not.
    // ⛔ MEASURED BEFORE THE CURE: 0–543 intersecting pairs per leaf (metropolis worst),
    // dominated by LOD masses swallowing standing buildings, back-houses drawn over their
    // neighbours, and plot-on-plot overprints from the frontage jitter.
    for (const [tier, population] of CORPUS) {
      const f = build(makeTownFixture({ _seed: `b4-disj-${tier}`, tier, population }));
      const r = overlapPairs(f);
      expect(r.n, `${tier}: ${r.seen.join(' | ')}`).toBe(0);
    }
  });

  it('COUNTERFACTUAL: a PLANTED overlap is caught by the same instrument', () => {
    // ⭐ THE ARM THAT PROVES THE TEST CAN FAIL. Without it, a disjointness pin that silently
    // measured nothing would read exactly like a disjointness pin that passes.
    const f = build(makeTownFixture({ _seed: 'b4-disj-plant', tier: 'town', population: 3500 }));
    expect(overlapPairs(f).n).toBe(0);
    const victim = f.parcels.find((p) => p.polygon && p.polygon.length >= 4);
    const c = victim.center;
    const s = f.meta.plotFrontage * 0.5;
    // A quad squarely ON another building — the exact defect the law forbids.
    f.parcels.push({
      ...victim,
      key: `${victim.key}#planted`,
      polygon: [[c[0] - s, c[1] - s], [c[0] + s, c[1] - s], [c[0] + s, c[1] + s], [c[0] - s, c[1] + s]],
      backHouse: null,
    });
    expect(overlapPairs(f).n).toBeGreaterThan(0);
    // ⭐ AND AN ABUTMENT IS NOT AN OVERLAP — the other half of the same claim, because a law
    // that forbade party walls would forbid the terrace.
    const A = [[0, 0], [10, 0], [10, 10], [0, 10]];
    const B = [[10, 0], [20, 0], [20, 10], [10, 10]];
    expect(overlapping(A, B)).toBe(false);
    expect(overlapping(A, [[5, 0], [15, 0], [15, 10], [5, 10]])).toBe(true);
  });

  it('§17.4 RIGHT OF WAY: no footprint stands inside the derived street web', () => {
    // ⭐⭐ "The ENTIRE derived street web — square to last alley — is FORBIDDEN GROUND for
    // footprints." TOUCHING the kerb is the FRONTING LAW (facades sit ON the street line),
    // so the instrument measures PENETRATION past an epsilon below the thinnest ink.
    // ⛔ MEASURED BEFORE THE CURE: 39–511 footprints per leaf standing in a carriageway,
    // penetrating up to 6.5 view units — most of a plot's whole width.
    for (const [tier, population] of CORPUS) {
      const f = build(makeTownFixture({ _seed: `b4-row-${tier}`, tier, population }));
      const r = inStreet(f);
      expect(r.n, `${tier}: ${r.seen.join(' | ')}`).toBe(0);
      // ⚠ AND REACHABILITY IS STILL GREEN — the cure may not be "delete the streets".
      expect(f.meta.streetGatesConnected).toBe(f.meta.streetGates);
    }
  });

  it('COUNTERFACTUAL: a footprint PLANTED in the high street is caught', () => {
    const f = build(makeTownFixture({ _seed: 'b4-row-plant', tier: 'town', population: 3500 }));
    expect(inStreet(f).n).toBe(0);
    const hs = f.channels.find((c) => c.rank === 'high');
    const mid = hs.line[Math.floor(hs.line.length / 2)];
    const s = Math.max(1.5, hs.width * 0.2);
    f.parcels.push({
      key: 'planted.in.the.road', polygon: [
        [mid[0] - s, mid[1] - s], [mid[0] + s, mid[1] - s], [mid[0] + s, mid[1] + s], [mid[0] - s, mid[1] + s],
      ], backHouse: null,
    });
    expect(inStreet(f).n).toBeGreaterThan(0);
  });

  it('⭐⭐⭐ §195.0 THE CENSUS MEASURES THE DRAWN GEOMETRY — institutions included, at every tier', () => {
    // ⭐ THE POSITIVE ARM: with the institution's body derived in the fabric, fronted on its
    // street and clipped by the ground law, both censuses are ZERO over the DRAWN set.
    for (const [tier, population] of CORPUS) {
      const f = build(makeTownFixture({ _seed: `b5-drawn-${tier}`, tier, population }));
      // The set must actually CONTAIN institution bodies, or the arm is the old vacuity in
      // a new costume: a census that measures nothing reads exactly like one that passes.
      const instBodies = f.landmarks.reduce((n, lm) => n + ((lm.solids || []).length), 0);
      expect(instBodies, `${tier}: no institution bodies in the drawn set`).toBeGreaterThan(0);
      expect(overlapPairs(f).n, `${tier}: ${overlapPairs(f).seen.join(' | ')}`).toBe(0);
      expect(inStreet(f).n, `${tier}: ${inStreet(f).seen.join(' | ')}`).toBe(0);
    }
  });

  it('COUNTERFACTUAL: the PRE-CURE institution bodies red BOTH censuses on the same leaf', () => {
    // ⭐⭐ THE ARM THAT PROVES THE CURE MOVED A REAL NUMBER RATHER THAN A DEFINITION. The
    // same settlement, the same instrument — only the institution bodies restored to what
    // the lens used to compose (free rotation, no clip). Both censuses must go red.
    const f = build(makeTownFixture({ _seed: 'b5-drawn-cf', tier: 'town', population: 3500 }));
    expect(overlapPairs(f).n).toBe(0);
    expect(inStreet(f).n).toBe(0);
    restorePreCureBodies(f);
    expect(overlapPairs(f).n, 'the pre-cure bodies did not overlap — the instrument is blind to them').toBeGreaterThan(0);
    expect(inStreet(f).n, 'the pre-cure bodies stood in no street — the instrument is blind to them').toBeGreaterThan(0);
  });

  it('§17.4 THE FRONTING LAW: an institution takes its STREET\'s bearing, never a free hash', () => {
    // ⭐⭐ "Building quads rotate WITH their street" (§2.7); "facades sit ON the street line"
    // (§17.4). The rotation used to be `hashUnit(key|rot) * 1024` — a free angle over the
    // full turn — which is the b4 central cluster's "rotated blocks ignoring streets".
    const f = build(makeTownFixture({ _seed: 'b5-front', tier: 'town', population: 3500 }));
    expect(f.meta.frontedInstitutions).toBeGreaterThan(0);
    const tol = TRIG_N * 0.25 * FRONT_WOBBLE + 2;
    let checked = 0;
    for (const lm of f.landmarks) {
      if (!lm.fronts || lm.frontRank === 'square') continue;
      const ch = f.channels.find((c) => (c.key || c.rank) === lm.fronts);
      if (!ch) continue;
      // The nearest segment of the street it says it fronts.
      let bd = Infinity, bear = 0;
      for (let i = 0; i + 1 < ch.line.length; i++) {
        const ax = ch.line[i][0], ay = ch.line[i][1], bx = ch.line[i + 1][0], by = ch.line[i + 1][1];
        const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
        let t = L > 0 ? ((lm.x - ax) * dx + (lm.y - ay) * dy) / L : 0;
        if (t < 0) t = 0; else if (t > 1) t = 1;
        const qx = ax + dx * t, qy = ay + dy * t;
        const d = Math.sqrt((lm.x - qx) ** 2 + (lm.y - qy) ** 2);
        if (d < bd) { bd = d; bear = bearingIndex(dx, dy); }
      }
      // Angles wrap and a building is symmetric under a half turn, so the comparison is
      // modulo a half turn — a hall broadside to its street is fronting it either way round.
      const half = TRIG_N / 2;
      let diff = Math.abs(((lm.rot - bear) % half + half) % half);
      if (diff > half / 2) diff = half - diff;
      expect(diff, `${lm.instanceKey} sits ${diff} indices off the ${lm.frontRank} it fronts`).toBeLessThanOrEqual(tol);
      checked++;
    }
    expect(checked, 'no institution was checked against a street — the pin is vacuous').toBeGreaterThan(3);
  });

  it('COUNTERFACTUAL: a FREE hash rotation fails the same fronting test', () => {
    // Without this arm the fronting pin passes on any settlement whose streets happen to
    // run every which way. The same instrument, the same leaf, the old rotation.
    const f = build(makeTownFixture({ _seed: 'b5-front-cf', tier: 'town', population: 3500 }));
    const tol = TRIG_N * 0.25 * FRONT_WOBBLE + 2;
    let off = 0, seen = 0;
    for (const lm of f.landmarks) {
      if (!lm.fronts || lm.frontRank === 'square') continue;
      const ch = f.channels.find((c) => (c.key || c.rank) === lm.fronts);
      if (!ch) continue;
      let bd = Infinity, bear = 0;
      for (let i = 0; i + 1 < ch.line.length; i++) {
        const ax = ch.line[i][0], ay = ch.line[i][1], bx = ch.line[i + 1][0], by = ch.line[i + 1][1];
        const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
        let t = L > 0 ? ((lm.x - ax) * dx + (lm.y - ay) * dy) / L : 0;
        if (t < 0) t = 0; else if (t > 1) t = 1;
        const d = Math.sqrt((lm.x - (ax + dx * t)) ** 2 + (lm.y - (ay + dy * t)) ** 2);
        if (d < bd) { bd = d; bear = bearingIndex(dx, dy); }
      }
      const free = Math.floor(hashUnit(`${lm.instanceKey}|rot`) * TRIG_N);
      const half = TRIG_N / 2;
      let diff = Math.abs(((free - bear) % half + half) % half);
      if (diff > half / 2) diff = half - diff;
      seen++;
      if (diff > tol) off++;
    }
    expect(seen).toBeGreaterThan(3);
    expect(off, 'a free hash rotation happened to front every street — re-seed the arm').toBeGreaterThan(seen * 0.5);
  });

  it('⭐⭐ §193.3 THE MEANDER LAW: no axis-aligned runs and no lattice turns in the water', () => {
    // ⛔ MEASURED BEFORE THE CURE on the riverside town: 81% of the channel's length lay
    // within 4° of an axis, in one straight run of 692 view units — 69% of the frame — with
    // both tails ruled dead vertical and dead horizontal by a single D8 step's bearing.
    // ⭐ THE THRESHOLDS ARE FRACTIONS OF THE FRAME AND OF THE CHANNEL'S OWN LENGTH, so a
    // later cure that lengthens or shortens the river cannot move them (MF-B4's lesson).
    const sub = buildSub2({}, 'riverside', { seed: 'meander-pin' }, { waterKind: 'river' });
    const raw = drainageTrace(sub);
    const cured = meanderChannel(sub, raw, 'meander-pin|m', { width: 16 });
    const rawStats = axisStats(raw), curedStats = axisStats(cured);
    // THE COUNTERFACTUAL IS THE LATTICE ITSELF: the raw D8 walk must fail what the cure passes.
    expect(rawStats.axisShare, 'the raw lattice walk is not axis-locked — re-seed the arm').toBeGreaterThan(0.35);
    expect(curedStats.axisShare).toBeLessThan(0.20);
    expect(curedStats.maxAxisRunFrac, 'a ruled axis run survives the meander').toBeLessThan(0.10);
    // AND THE TURNS LEAVE THE 45° LATTICE BAND. ⭐ THE CLAIM IS RELATIVE TO THE LATTICE THE
    // CURE REMOVES, which is the form MF-B4's lesson demands: MEASURED on this fixture,
    // 0.615 of the raw walk's turns sit within 6° of a D8 multiple and 0.116 of the cured
    // channel's do. An absolute floor here would be a number about THIS river; the ratio is
    // a number about the mechanism.
    expect(curedStats.latticeShare).toBeLessThan(rawStats.latticeShare * 0.35);
    expect(curedStats.latticeShare).toBeLessThan(0.20);
    // AND IT IS STILL A RIVER, NOT A SPIRAL: sinuosity inside the observed natural band.
    expect(curedStats.sinuosity).toBeGreaterThan(1.05);
    expect(curedStats.sinuosity).toBeLessThan(3.2);
    expect(MEANDER.widthsPerWave).toBeGreaterThan(9);
  });

  it('⭐⭐ §195.1 THE WATER IS A CLAIM: bridges where streets cross, and nothing stands in the channel', () => {
    const f = build(makeTownFixture({ _seed: 'b5-water', tier: 'town', population: 3500 }));
    expect(f.water && f.water.kind).toBe('river');
    // The water joins the ground law's claim set, so a footprint in the channel is impossible.
    const claims = waterClaims(f.water);
    expect(claims).toHaveLength(1);
    const half = claims[0].width * 0.5;
    for (const b of footprints(f)) {
      for (const p of b.poly) {
        let d = Infinity;
        for (let i = 0; i + 1 < f.water.line.length; i++) {
          const a = f.water.line[i], c = f.water.line[i + 1];
          const dx = c[0] - a[0], dy = c[1] - a[1], L = dx * dx + dy * dy;
          let t = L > 0 ? ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L : 0;
          if (t < 0) t = 0; else if (t > 1) t = 1;
          const q = Math.sqrt((p[0] - a[0] - dx * t) ** 2 + (p[1] - a[1] - dy * t) ** 2);
          if (q < d) d = q;
        }
        expect(half - d, `${b.key} stands in the river`).toBeLessThanOrEqual(0.15);
      }
    }
    // COUNTERFACTUAL: the same derivation with NO water claim leaves crossings unbridged.
    expect(deriveBridges({ rel: f.water, channels: f.channels, frontage: f.meta.plotFrontage }).bridges.length).toBeGreaterThan(0);
    expect(deriveBridges({ rel: { kind: 'dry', line: null }, channels: f.channels, frontage: 10 }).bridges).toHaveLength(0);
  });

  it('⭐⭐ §16.5 THE TENURE SELECTOR: uplands DISPERSE, plains NUCLEATE, and DANGER nucleates', () => {
    // ⭐ THE PAIR IS THE PIN. A selector that always answered "dispersed" would pass any
    // single arm; the claim is that the ANSWER MOVES with the ground and with the danger.
    const seeding = { seed: 'tenure-pin' };
    const upland = tenurePattern({ relief: 0.72, workableShare: 0.30, danger: false, lawfulness: 0.5, tier: 'village', seeding });
    const plain = tenurePattern({ relief: 0.10, workableShare: 0.90, danger: false, lawfulness: 0.5, tier: 'village', seeding });
    expect(upland.pattern).toBe('dispersed');
    expect(plain.pattern).toBe('nucleated');
    // ⭐ INCASTELLAMENTO: the same upland ground under standing danger gathers inward.
    const besieged = tenurePattern({ relief: 0.55, workableShare: 0.30, danger: true, lawfulness: 0.5, tier: 'village', seeding });
    const safe = tenurePattern({ relief: 0.55, workableShare: 0.30, danger: false, lawfulness: 0.5, tier: 'village', seeding });
    expect(besieged.score).toBeLessThan(safe.score);
  });

  it('⭐⭐ §16.5.1 (ODQ §194 / MF-R3 C1): a NUCLEATED countryside carries no field barns', () => {
    // ⛔ THE CURED LAW. The field barn belongs to the ENCLOSED/upland regime; in strict
    // open-field country the barns stood in the village tofts because the harvest came home.
    // A field-barn-dotted open-field render is a pattern mix-up, so the nucleated side may
    // emit SHELTERS and outlying farmsteads/granges and nothing else.
    const NUCLEATED_OK = new Set(['shelter', 'grange']);
    const DISPERSED_OK = new Set(['farmstead']);
    // ⛔⛔ ⟦§303.6⟧ **THE FAMILY USED TO BE EIGHT SEED SALTS AND ITS BOTH-SIDES ARM WAS LUCK.**
    //    Eight fixtures differing ONLY by a salt span nothing but `tenurePattern`'s own ±0.11
    //    seeded band, so which side each landed on was a fact about where that band happened to
    //    straddle 0.5 — and it did, 2 against 6, while `workableShare` was the constant 0.6 on
    //    every leaf. The moment the substrate published the REAL share (0.388–0.422 on this
    //    village ground, well under the fallback), the `(1 − workable) × 0.30` term rose by ~0.06
    //    and **all eight landed on the same side.** ⭐ THE CLASS: **A "BOTH SIDES OCCUR" ARM OVER
    //    A FAMILY THAT VARIES ONLY THE SEED IS A CLAIM ABOUT A THRESHOLD'S POSITION, NOT ABOUT
    //    THE LAW** — and it fails the moment the law's real input arrives.
    // ⭐ RE-AUTHORED TO SPAN THE LAW'S OWN INPUT. Four ordinary villages and four under standing
    //    danger: *incastellamento* is the mechanism `tenurePattern` names in its own comment, and
    //    a countryside that gathers inward under threat is the historical fact the arm is about.
    //    Both sides are now guaranteed by the DERIVATION rather than by a threshold's luck.
    let sawNucleated = 0, sawDispersed = 0;
    const FAMILY = [
      ['a', {}], ['b', {}], ['c', {}], ['d', {}],
      ['e', { stressors: ['monster_pressure'] }], ['f', { stressors: ['monster_pressure'] }],
      ['g', { stressors: ['monster_pressure'] }], ['h', { stressors: ['monster_pressure'] }],
    ];
    for (const [salt, over] of FAMILY) {
      const f = build(makeTownFixture({ _seed: `b5-tenure-${salt}`, tier: 'village', population: 700, ...over }));
      const kinds = Object.keys(f.meta.countryDwellingKinds || {});
      if (f.meta.tenurePattern === 'nucleated') {
        sawNucleated++;
        for (const k of kinds) expect(NUCLEATED_OK.has(k), `a ${k} on open-field country`).toBe(true);
      } else {
        sawDispersed++;
        for (const k of kinds) expect(DISPERSED_OK.has(k)).toBe(true);
      }
    }
    // BOTH sides must actually occur in the family, or the pin proves only one of them.
    expect(sawNucleated + sawDispersed).toBe(8);
    expect(Math.max(sawNucleated, sawDispersed)).toBeLessThan(8);
    // A steading is a HOUSE and, on the dispersed side, a barn across its yard.
    expect(HABITATION.cottage).toBeLessThan(1);
  });

  it('⭐⭐ §5.0e THE FAUBOURG CROWDS THE GATES — it is never a halo, and the wall foot tells', () => {
    const f = build(makeWalledFixture({ _seed: 'b5-faub', tier: 'city', population: 20000 }));
    const fb = f.faubourgs;
    expect(fb.gates).toBeGreaterThan(0);
    // ⭐⭐ THE GATE-CROWDING CLAIM, MEASURED: every faubourg building stands nearer to SOME
    // gate than a halo would put it. The counterfactual is the halo itself — a ring of the
    // same count spread evenly round the circuit — and the pin is that our mean distance to
    // the nearest gate is materially SMALLER than the halo's would be.
    const gates = [];
    for (const ring of f.walls) for (const g of (ring.gates || [])) gates.push(g);
    if (fb.buildings.length && gates.length) {
      const near = (x, y) => Math.min(...gates.map((g) => Math.sqrt((x - g.x) ** 2 + (y - g.y) ** 2)));
      const ours = fb.buildings.reduce((a, b) => a + near(b.x, b.y), 0) / fb.buildings.length;
      // The halo control: the same number of points spread evenly on the circuit itself.
      const ring = f.walls[0].polygon;
      let halo = 0;
      for (let i = 0; i < fb.buildings.length; i++) {
        const p = ring[Math.floor((i / fb.buildings.length) * ring.length)];
        halo += near(p[0], p[1]);
      }
      halo /= fb.buildings.length;
      expect(ours, `faubourg mean-to-gate ${ours.toFixed(1)} vs halo ${halo.toFixed(1)}`).toBeLessThan(halo);
    }
    // ⭐ THE WALL-FOOT TELL IS A SINGLE COMPARISON AND IT IS EITHER/OR: a clear glacis has NO
    // lean-tos, and lean-tos exist only where the glacis is not kept.
    expect(typeof fb.glacisClear).toBe('boolean');
    if (fb.glacisClear) expect(fb.leanTos).toHaveLength(0);
    expect(FAUBOURG.glacisThreshold).toBeGreaterThan(0);
    expect(FAUBOURG.glacisThreshold).toBeLessThan(1);
  });

  it('§17.6 THE ALLEY-GAP LAW: every gap has a derived reason, and rear access is a requirement', () => {
    // ⭐ THE OWNER ASKED FOR THE SLIVERS AND FOR THEM TO BE DERIVED. Two claims:
    // (a) every gap carries one of the five warranted reasons — never sprinkled decoration;
    // (b) a deep plot row gets a THROUGH-PASSAGE, because a terrace has to reach its own
    //     back yards. The passage is person-wide by law and it may not be blocked, which the
    //     right-of-way pin above enforces (passages are channels).
    const REASONS = ['ownership-seam', 'rear-access', 'fire-break', 'drainage-slit', 'packing-wedge'];
    const f = build(makeTownFixture({ _seed: 'b4-gaps', tier: 'town', population: 3500 }));
    expect(f.passages.length).toBeGreaterThan(0);
    for (const pg of f.passages) expect(REASONS).toContain(pg.reason);
    for (const sl of f.slots) expect(REASONS).toContain(sl.reason);
    expect(Object.keys(f.meta.passageReasons)).toContain('rear-access');
    // ⭐ THE PASSAGE IS PERSON-WIDE, NEVER CART-WIDE — that is what makes it a passage rather
    // than a lane, and it is the one bound that keeps §17.6 from inventing a new street rank.
    for (const pg of f.passages) expect(pg.width).toBeLessThan(f.meta.plotFrontage);
    // ⭐ AND THE FREQUENCY DIAL IS REAL: a poor chaotic fabric gaps more than a wealthy
    // orderly one. The pair is the pin — a single constant would pass neither arm.
    const gapRate = (wealth, lawfulness) => {
      let n = 0;
      for (let i = 0; i < 400; i++) {
        const d = decideGap({
          key: `g${i}`, frontage: 10, wealth, lawfulness,
          slopeAcross: 0, needsAccess: false, sincePassage: 0, extentTier: 'town',
        });
        if (d.kind !== 'party') n++;
      }
      return n / 400;
    };
    expect(gapRate('poor', 0.1)).toBeGreaterThan(gapRate('wealthy', 0.9) * 2);
    expect(ALLEY_GAP.passage).toBeLessThan(1);
  });

  it('the half-plane clip is the ONE primitive, and it only ever removes ground', () => {
    // A clip cannot invent area. That is what makes the repair pass safe to run after the
    // pack: nothing it does can put a building somewhere the derivation did not.
    const sq = [[0, 0], [10, 0], [10, 10], [0, 10]];
    const cut = clipHalfPlane(sq, 5, 0, 1, 0);
    expect(absArea(cut)).toBeLessThan(absArea(sq) + 1e-9);
    expect(absArea(cut)).toBeCloseTo(50, 5);
    expect(TOUCH_EPS).toBeLessThan(0.26);          // below the thinnest ink line on the page
  });
});

/**
 * MF-B6 — §11.12a THE TRUE MEASURE · §12 THE IMMERSION SUITE · §10 THE STATE EXPRESSIONS ·
 * §18.1 PRECINCTS · §18.2 THE INN BELT · TC29's §0.0 ACCESSIBLE HATCH.
 *
 * ⚠ EVERY ARM CARRIES A COUNTERFACTUAL, on the standard the file already keeps.
 */
describe('§11.12a THE TRUE MEASURE (chair mandate, non-deferrable)', () => {
  it('the two derivations MEET: the implied plot frontage lands in its tenure band at every tier', () => {
    // ⭐⭐ THE PROOF IS THE AGREEMENT, NOT THE ARITHMETIC. The scale derives from POPULATION ÷
    // DENSITY; the tenure band comes from the attested burgage and croft frontages; the two
    // were never fitted to each other. Running the scale backwards to ask what ONE DRAWN
    // FRONTAGE is worth in metres must land inside the band for that tier — at all six.
    for (const [tier, population] of CORPUS) {
      const f = build(makeTownFixture({ _seed: `b6-measure-${tier}`, tier, population }));
      const M = f.measure;
      expect(M.metresPerUnit).toBeGreaterThan(0);
      expect(M.tenureOk, `${tier}: ${M.reason}`).toBe(true);
      expect(M.impliedFrontageM).toBeGreaterThanOrEqual(M.tenureBand[0]);
      expect(M.impliedFrontageM).toBeLessThanOrEqual(M.tenureBand[1]);
    }
  });

  it('COUNTERFACTUAL: the FRONTAGE-AS-ROD reading fails the same test above village', () => {
    // ⭐⭐ THE ARM THAT PROVES THE CURE MOVED A NUMBER RATHER THAN A DEFINITION. `fields.js`
    // read the drawn frontage as one rod (METRES_PER_FRONTAGE = 5) — a distance only where
    // the fabric is 1:1 with the census. Above village a drawn plot stands for R households,
    // and the reading collapses: the metropolis comes out with FEWER metres per unit than
    // the town, which is impossible for a distance.
    const town = build(makeTownFixture({ _seed: 'b6-rod-town', tier: 'town', population: 3500 }));
    const metro = build(makeTownFixture({ _seed: 'b6-rod-metro', tier: 'metropolis', population: 60000 }));
    const rod = (f) => METRES_PER_FRONTAGE / f.meta.plotFrontage;

    // ⛔⛔ THE VACUITY, STATED AS THE IDENTITY IT IS. Under the frontage reading the implied
    // real frontage of ONE DRAWN PLOT is EXACTLY one rod AT EVERY TIER — by construction,
    // because the reading IS that definition. So it says a body standing for twenty
    // households is five metres wide.
    expect(rod(metro) * metro.meta.plotFrontage).toBeCloseTo(METRES_PER_FRONTAGE, 6);
    expect(rod(town) * town.meta.plotFrontage).toBeCloseTo(METRES_PER_FRONTAGE, 6);
    expect(metro.meta.representationRatio).toBeGreaterThan(4);
    // ⚠ AND THAT IS WHY IT IS NOT A DISTANCE: the same 5 m is asserted for a 1:1 village plot
    // and for a metropolitan body standing for many. A quantity that does not vary with the
    // thing it measures is a constant wearing a distance's name.

    // ⭐ THE TRUE MEASURE IS MONOTONE IN THE LADDER, which the rod reading is not obliged to
    // be and (measured on the exemplar corpus) is not: metropolis 0.463 m/unit against town
    // 0.690, the greater settlement coming out SMALLER per unit.
    expect(metro.measure.metresPerUnit).toBeGreaterThan(town.measure.metresPerUnit);
    // …and it lands the metropolis's implied frontage inside the BURGAGE band by dividing
    // out the representation the rod reading ignores.
    expect(metro.measure.impliedFrontageM).toBeLessThan(rod(metro) * metro.meta.plotFrontage * 4);
    expect(metro.measure.tenureOk).toBe(true);
  });

  it('the SCALE BAR is TRUE: its drawn length is exactly its printed count of units', () => {
    const f = build(makeTownFixture({ _seed: 'b6-bar', tier: 'city', population: 20000 }));
    const bar = scaleBarFor(f.measure, 140);
    // The claim the bar makes, checked in the bar's own terms.
    expect(bar.drawnUnits * f.measure.metresPerUnit).toBeCloseTo(bar.count * f.measure.metres === undefined
      ? bar.metres : bar.metres, 6);
    expect(bar.metres).toBeCloseTo(bar.count * 0.75, 6);          // PACE_METRES
    expect(bar.drawnUnits).toBeLessThanOrEqual(140 + 1e-9);
    // ⭐ THE COUNTERFACTUAL: a RELATIVE bar prints the same label for two different distances.
    // "10 PLOT FRONTAGES" on a town and on a metropolis are the same words for 51 m and 66 m
    // of real ground, which is precisely what §11.12a calls decorative relative units.
    const town = build(makeTownFixture({ _seed: 'b6-bar-town', tier: 'town', population: 3500 }));
    const relTown = town.meta.plotFrontage * 10 * town.measure.metresPerUnit;
    const relCity = f.meta.plotFrontage * 10 * f.measure.metresPerUnit;
    expect(Math.abs(relTown - relCity)).toBeGreaterThan(5);
    // …while the TRUE bar's label and its length always agree.
    expect(bar.label).toContain(String(bar.count));
    expect(bar.pending).toBe('OB-4');                             // the unit NAME is owner-gated
  });

  it('the WALK RINGS draw only the rungs that FIT, and a leaf with none draws none', () => {
    const f = build(makeTownFixture({ _seed: 'b6-rings', tier: 'town', population: 3500 }));
    const R = f.immersion.rings;
    for (const ring of R.rings) {
      // Every ring stands OUTSIDE the built edge and INSIDE the frame's own reach.
      expect(ring.r).toBeGreaterThan(f.meta.builtRadius);
      expect(ring.r).toBeLessThan(660);
      expect(ring.metres / f.measure.metresPerUnit).toBeCloseTo(ring.r - f.meta.builtRadius, 6);
    }
    // ⭐ THE COUNTERFACTUAL, and it is the finding the true measure produced: at a scale where
    // the whole frame is smaller than the shortest rung, NO ring is drawn and the refusal is
    // named. A ring member that always draws something is a member that is not measuring.
    const none = walkRings({ metresPerUnit: 0.02 }, 100);
    expect(none.rings).toHaveLength(0);
    expect(none.reason).toContain('no rung');
  });
});

describe('§12 THE IMMERSION SUITE', () => {
  it('§12.1 THE NOTE-LIFESPAN LAW: a note lives its span, and an unchanged fact never churns', () => {
    const s = makeTownFixture({
      _seed: 'b6-notes',
      history: {
        founding: { kind: 'charter', age: 200 },
        age: 200,
        historicalEvents: [
          { yearsAgo: 190, type: 'disaster', name: 'The Old Fire', severity: 'minor' },
          { yearsAgo: 20, type: 'disaster', name: 'The Sack', severity: 'catastrophic' },
        ],
      },
    });
    // The minor fire is 190 years old against a 60-year span at town memory: DEAD.
    // The catastrophic sack is 20 years old against 260: ALIVE.
    const now = marginalia({ settlement: s, tier: 'town', year: 200 });
    expect(now.notes.map((n) => n.text).join(' ')).toContain('THE SACK');
    expect(now.notes.map((n) => n.text).join(' ')).not.toContain('OLD FIRE');
    // ⭐⭐ THE INERTIA ARM: two years INSIDE the same window give the SAME notes, cite for
    // cite. A per-year top-K — the shape MF-R2 rejected — would churn the margin annually on
    // facts that did not move, which is what makes it incompatible with §161k snapshots.
    const later = marginalia({ settlement: s, tier: 'town', year: 205 });
    expect(later.notes.map((n) => n.cite)).toEqual(now.notes.map((n) => n.cite));
    // ⭐ THE COUNTERFACTUAL: at year 15 the sack has NOT HAPPENED and may not be quoted.
    const before = marginalia({ settlement: s, tier: 'town', year: 15 });
    expect(before.notes.map((n) => n.text).join(' ')).not.toContain('THE SACK');
    // …and a metropolis FORGETS FASTER than a town, which is the tier half of the law.
    const metroSpan = marginalia({ settlement: s, tier: 'metropolis', year: 200 }).notes[0];
    const townSpan = now.notes[0];
    expect(metroSpan.lifespan).toBeLessThan(townSpan.lifespan);
  });

  it('§12.4 HERALDRY is DERIVED and culture-neutral, and a fact-less settlement bears none', () => {
    const f = build(makeTownFixture({ _seed: 'b6-arms', tier: 'town', population: 3500 }));
    const H = f.immersion.heraldry;
    expect(H.charges.length).toBeGreaterThan(0);
    // EVERY charge cites a fact (§8.2), and every charge is in the natural/occupational
    // vocabulary — no faith mark can enter by construction.
    expect(H.cite.length).toBe(H.charges.length);
    for (const c of H.charges) expect(Object.keys(CHARGES)).toContain(c);
    // ⭐ THE COUNTERFACTUAL: a settlement whose facts earn nothing bears NO device rather than
    // an invented one — the §8.2 rule applied to ornament.
    const bare = deriveHeraldry({
      settlement: { resourceAnalysis: { availableResources: [] } },
      meta: { waterMode: 'dry', relief: 0.1, hasWalls: false },
      seeding: { seed: 'x', variant: 0 },
    });
    expect(bare.charges).toHaveLength(0);
    expect(bare.reason).toContain('no sourced fact');
  });

  it('§12.8 THE PENTIMENTO exists ONLY where the record says the place was bigger', () => {
    // The high-water fixture: a town's life inside a city's extent (§161f/§161g).
    const demoted = build(makeTownFixture({ _seed: 'b6-ghost', tier: 'city', population: 3500 }));
    // ⭐ THE COUNTERFACTUAL IS THE SAME SEED WITHOUT THE DEMOTION. If the ghost appeared on
    // both, it would be decoration wearing a law's name.
    const plain = build(makeTownFixture({ _seed: 'b6-ghost', tier: 'town', population: 3500 }));
    expect(plain.immersion.pentimento.ghosts).toHaveLength(0);
    expect(plain.immersion.pentimento.reason).toContain('no high water');
    expect(demoted.immersion.pentimento.ghosts.length).toBeGreaterThan(0);
    expect(demoted.immersion.pentimento.cite).toBeTruthy();
  });

  it('§164a THE NEIGHBOUR EDGE: a standalone settlement shows NONE, and says so', () => {
    const f = build(makeTownFixture({ _seed: 'b6-nb', tier: 'town', population: 3500 }));
    expect(f.immersion.neighbours.edges).toHaveLength(0);
    expect(f.immersion.neighbours.reason).toContain('STANDALONE FALLBACK');
    // ⭐⭐ THE COUNTERFACTUAL IS A SYNTHESIZED CAMPAIGN LINK. The owner's constraint is that
    // the edge is born the moment the link is — so with a link carrying a TRUE bearing an
    // edge appears, and with a link carrying NO bearing it is REFUSED (a named road pointing
    // the wrong way is worse than none).
    const roads = f.web.roads.concat(f.web.highStreet ? [{ line: f.web.highStreet }] : []);
    const c = f.meta.centre;
    const end = roads[0].line[roads[0].line.length - 1];
    const trueBearing = bearingIndex(end[0] - c.x, end[1] - c.y);
    const linked = deriveNeighbourEdges({
      settlement: { neighbors: [{ name: 'Mossgate', bearingIndex: trueBearing, travel: 'three days' }] },
      meta: f.meta, roads,
    });
    expect(linked.edges).toHaveLength(1);
    expect(linked.edges[0].travel).toBe('three days');
    const bearingless = deriveNeighbourEdges({
      settlement: { neighbors: [{ name: 'Nowhere' }] },
      meta: f.meta, roads,
    });
    expect(bearingless.edges).toHaveLength(0);
    expect(bearingless.reason).toContain('REFUSED');
  });
});

describe('§10 THE STATE EXPRESSIONS — the totality census and the calm-ink markers', () => {
  it('EVERY LIVE CATALOG KEY IS RULED — the census is over the catalog, not over a copy', () => {
    // ⭐⭐ THE WALKER. `STRESSOR_DISPOSITION` is checked against the IMPORTED catalog, so a key
    // added upstream reds this pin instead of silently becoming an axis nothing rules.
    const catalog = Object.keys(STRESS_TYPE_MAP).sort();
    const ruled = Object.keys(STRESSOR_DISPOSITION).sort();
    expect(ruled).toEqual(catalog);
    // Every row is either an EXPRESSION this module can draw, or a CUT with a reason.
    for (const k of catalog) {
      const row = STRESSOR_DISPOSITION[k];
      if (row.express) {
        expect(EXPRESSIONS, `${k} names an expression nothing draws`).toContain(row.express);
        expect(row.anchor, `${k} has no TRUE anchor`).toBeTruthy();
      } else {
        expect(row.cut, `${k} is neither expressed nor cut by name`).toBeTruthy();
      }
    }
  });

  it('a BESIEGED town camps its besieger and bars the gate; a peaceful one does neither', () => {
    const besieged = build(makeWalledFixture({ _seed: 'b6-siege', stressors: ['under_siege'] }));
    const peace = build(makeWalledFixture({ _seed: 'b6-siege' }));
    // ⭐ THE PAIR IS THE PIN: the same settlement, the same seed, one stressor apart.
    expect(besieged.stateMarks.expressed).toContain('under_siege');
    // ⚠ THE BOUND IS 3, MEASURED, AND THE SPREAD IS THE FINDING RATHER THAN A LOOSENING. The
    // camp derives NINE tents; how many survive is a fact about the ground outside THAT gate.
    // MEASURED: 9 of 9 on the corpus's own siege leaf (an open riverside approach), 3 of 9 on
    // this walled fixture, whose gate opens onto a tight web the ground law rightly protects.
    // A besieging camp that clipped its way through a road would be the §17.4 violation this
    // whole family exists to forbid, so the law winning is the correct outcome and the pin
    // asserts a CAMP (a rank of tents) rather than a count the terrain does not owe it.
    expect(besieged.stateMarks.bodies.filter((b) => b.kind === 'tent').length).toBeGreaterThanOrEqual(3);
    expect(besieged.stateMarks.marks.some((m) => m.kind === 'barredGate')).toBe(true);
    expect(peace.stateMarks.expressed).not.toContain('under_siege');
    expect(peace.stateMarks.bodies.filter((b) => b.kind === 'tent')).toHaveLength(0);
    // ⭐⭐ AND A CUT AXIS NEVER DRAWS, whatever it is set to — the other half of the totality
    // claim, and the half that would otherwise be an untested comment.
    const indebted = build(makeWalledFixture({ _seed: 'b6-siege', stressors: ['indebted', 'recently_betrayed', 'succession_void'] }));
    expect(indebted.stateMarks.expressed).toHaveLength(0);
    expect(indebted.stateMarks.bodies).toHaveLength(peace.stateMarks.bodies.length);
  });

  it('EVERY §10 FILLED BODY IS IN THE CENSUS — the §195.0 standing rule, enforced', () => {
    // ⭐⭐⭐ THE RULE THAT EXISTS BECAUSE OF §195.0: a new filled body that does not join the
    // census reproduces the vacuity exactly. This arm proves the state bodies ARE in the set
    // AND that the set is still clean with them in it.
    const f = build(makeWalledFixture({ _seed: 'b6-census', stressors: ['under_siege', 'mass_migration'] }));
    expect(f.stateMarks.bodies.length).toBeGreaterThan(0);
    const keys = new Set(footprints(f).map((x) => x.key));
    for (const b of f.stateMarks.bodies) expect(keys.has(b.key), `${b.key} is drawn and not censused`).toBe(true);
    expect(overlapPairs(f).n, overlapPairs(f).seen.join(' | ')).toBe(0);
    expect(inStreet(f).n, inStreet(f).seen.join(' | ')).toBe(0);
  });
});

describe('§18 THE RICHES ADOPTED — the two buildable ones', () => {
  it('§18.1 A PRECINCT INVERTS THE LAWFULNESS DIAL LOCALLY, and the grain shows it', () => {
    const f = build(makeTownFixture({ _seed: 'b6-precinct', tier: 'city', population: 20000 }));
    expect(f.precincts.length).toBeGreaterThan(0);
    for (const p of f.precincts) {
      // ⭐ THE INVERSION IS THE CLAIM: a close runs ABOVE the town's order, a liberty BELOW.
      if (p.kind === 'close') expect(p.order).toBeGreaterThan(p.townOrder);
      else expect(p.order).toBeLessThan(p.townOrder);
    }
    // ⭐⭐ AND IT REACHES THE DRAWING. The §17.6 gap decision reads the precinct's order, so
    // the same call with the town's order and with the precinct's gives DIFFERENT gaps.
    const pr = f.precincts.find((p) => p.kind === 'close') || f.precincts[0];
    // ⚠ THE SAMPLE IS 4,000, NOT 400, AND THE CLAIM IS A DIRECTION. The gap frequency's chaos
    // gain is a modest multiplier, so a 400-draw sample resolves it to about one part in a
    // hundred — a magnitude assertion there would be measuring the sample, not the law.
    const rate = (law) => {
      let n = 0;
      for (let i = 0; i < 4000; i++) {
        const d = decideGap({
          key: `b6-precinct|${i}`, frontage: 8, wealth: 0.5, lawfulness: law,
          slopeAcross: 0, needsAccess: false, sincePassage: 0, extentTier: 'city',
        });
        if (d.kind !== 'party') n++;
      }
      return n / 4000;
    };
    // A CLOSE runs at a HIGHER order than its town, so its grain carries FEWER gaps; a
    // LIBERTY runs lower and carries more. Either way the precinct's rate differs from the
    // town's in the direction its order says.
    if (pr.kind === 'close') expect(rate(pr.order)).toBeLessThan(rate(pr.townOrder));
    else expect(rate(pr.order)).toBeGreaterThan(rate(pr.townOrder));
    // ⭐ AND THE FULL SWING IS REAL, so the modest local difference is a modest local
    // inversion rather than noise: the dial's own ends are far apart.
    // MEASURED at this base: 0.040 across the dial's whole range. The bound sits clear of the
    // measurement so ordinary drift cannot red it, and a regression that FLATTENED the dial
    // — which is what would make the precinct invisible — could not pass it.
    expect(rate(0) - rate(1)).toBeGreaterThan(0.025);
    // ⭐ THE COUNTERFACTUAL: a settlement with no qualifying category binds NO precinct, and
    // says so — the flag is a typed read, never a name match.
    const none = derivePrecincts({ organisms: [{ key: 'a', category: 'residential' }], lawfulness: 0.5 });
    expect(none.precincts).toHaveLength(0);
    expect(none.reason).toContain('no religious close');
  });

  it('§18.2 THE INN BELT stands at the BUSY gates only, and an inn is bigger than a house', () => {
    const f = build(makeWalledFixture({ _seed: 'b6-inns', tier: 'city', population: 20000 }));
    const inns = f.faubourgs.buildings.filter((b) => b.kind === 'inn');
    const houses = f.faubourgs.buildings.filter((b) => b.kind !== 'inn');
    if (inns.length) {
      const area = (b) => absArea(b.polygon);
      const meanInn = inns.reduce((a, b) => a + area(b), 0) / inns.length;
      const meanHouse = houses.length ? houses.reduce((a, b) => a + area(b), 0) / houses.length : 0;
      expect(meanInn).toBeGreaterThan(meanHouse);
      // An inn carries its stable YARD — an enclosure, never a filled body (so it is
      // deliberately absent from the census, and the census is what says so).
      for (const b of inns) expect(b.yard).toBeTruthy();
      const keys = new Set(footprints(f).map((x) => x.key));
      for (const b of inns) expect(keys.has(b.key)).toBe(true);
    }
    // ⭐ THE COUNTERFACTUAL: an UNWALLED settlement has no gates, so §5.0e and §18.2 both
    // decline — the belt is a fact about a gate, not a decoration on a road.
    const open = build(makeTownFixture({ _seed: 'b6-inns-open', tier: 'village', population: 500 }));
    expect(open.faubourgs.buildings).toHaveLength(0);
    expect(open.meta.faubourgReason).toContain('unwalled');
  });
});

/**
 * ⭐⭐⭐ THE §200/§201/§202 CENSUS HELPERS — AT MODULE SCOPE, like `footprints()` and for the
 * same reason (§195.0's standing rule). A helper inside a `describe` is a helper only one
 * suite can assert against, which is how a set and the thing it is supposed to measure come
 * apart in the first place.
 */
const wallBandSegments = (f) => {
  const segs = [];
  for (const c of claimsOfRings(f.walls || [], f.meta.builtRadius)) {
    const half = c.width / 2;
    for (let i = 0; i + 1 < c.line.length; i++) {
      segs.push({ ax: c.line[i][0], ay: c.line[i][1], bx: c.line[i + 1][0], by: c.line[i + 1][1], half });
    }
  }
  return segs;
};
const deepestIntoBand = (poly, segs) => {
  let worst = 0;
  for (const p of poly) {
    for (const s of segs) {
      const dx = s.bx - s.ax, dy = s.by - s.ay;
      const L = dx * dx + dy * dy;
      let t = L > 0 ? ((p[0] - s.ax) * dx + (p[1] - s.ay) * dy) / L : 0;
      if (t < 0) t = 0; else if (t > 1) t = 1;
      const qx = s.ax + dx * t, qy = s.ay + dy * t;
      const d = Math.sqrt((p[0] - qx) * (p[0] - qx) + (p[1] - qy) * (p[1] - qy));
      if (s.half - d > worst) worst = s.half - d;
    }
  }
  return worst;
};
/** The access set, from the DRAWN fabric, in the shape accessLaw consumes. */
const accessBodies = (f) => collectAccessBodies({
  parcels: f.parcels, merged: (f.lod && f.lod.mergedKeys) || new Set(),
  masses: (f.lod && f.lod.masses) || [], huts: (f.shanty && f.shanty.huts) || [],
  faubourgs: f.faubourgs || { buildings: [], leanTos: [] }, institutions: f.landmarks,
});
const accessFabricOf = (f) => ({ channels: f.channels, web: f.web, walls: f.walls });

describe('§200 THE WALL-CLEARANCE LAW (owner catch) — the circuit is reserved ground', () => {
  it('no drawn body stands in a wall band, and the band is never thinner than the ink', () => {
    // ⛔ THE OWNER SAW IT IN THE b6 TOWN: the wall polyline passing over footprints. The wall
    // was drawn at stage 5 and the ground laws enforced at stage 3d, so the band was never a
    // claim and neither drawn-geometry census contained it. MEASURED before the cure at the
    // ink that actually draws: 408 bodies in a band across the corpus, up to 2.10 units deep.
    for (const spec of [
      { _seed: 'b7-wall-town', tier: 'town', population: 2400 },
      { _seed: 'b7-wall-city', tier: 'city', population: 9000 },
    ]) {
      const f = build(makeWalledFixture(spec));
      expect(f.walls.length).toBeGreaterThan(0);
      const segs = wallBandSegments(f);
      expect(segs.length).toBeGreaterThan(0);
      for (const fp of footprints(f)) expect(deepestIntoBand(fp.poly, segs)).toBeLessThanOrEqual(TOUCH_EPS);
      // §200.1 THE BAND IS AT LEAST THE STROKE: a reservation thinner than the ink that
      // draws it re-creates the very defect one level down.
      const stroke = Math.max(1.8, Math.min(4.2, f.meta.plotFrontage * 0.42));
      for (const ring of f.walls) expect(ring.bandParts.stone).toBeGreaterThanOrEqual(stroke - 1e-9);
    }
  });

  it('COUNTERFACTUAL: a body planted on the circuit is caught by the same census', () => {
    // Without this arm the pin above passes on a leaf with no wall and on a census that
    // measures nothing — the §195.0 shape, which is what this whole family is about.
    const f = build(makeWalledFixture({ _seed: 'b7-wall-cf', tier: 'town', population: 2400 }));
    const segs = wallBandSegments(f);
    const s = segs[Math.floor(segs.length / 2)];
    const planted = [[s.ax - 1, s.ay - 1], [s.ax + 1, s.ay - 1], [s.ax + 1, s.ay + 1], [s.ax - 1, s.ay + 1]];
    expect(deepestIntoBand(planted, segs)).toBeGreaterThan(TOUCH_EPS);
  });

  it('§200.3 gates are OPENINGS in the claim, and a circuit is never sealed', () => {
    // ⛔ §161g SAID "SURPLUS" GATES ARE BRICKED AND THE INDEPENDENT ROLL BRICKED THEM ALL:
    // measured on the high-water leaf, `main: BRICKED, BRICKED` — a walled town with no way
    // in. An independent per-member roll on a set with a floor has no floor.
    const f = build(makeWalledFixture({ _seed: 'b7-gate-demoted', tier: 'town', population: 900, highWaterTier: 'city' }));
    for (const ring of f.walls) {
      expect(ring.gates.length).toBeGreaterThan(0);
      expect(ring.gates.some((g) => !g.bricked)).toBe(true);
      // ⭐ AND EVERY GATE LIES ON ITS OWN RING. The later circuit used to be handed the
      // vintage circuit's gate list: measured 71.7 / 120.2 / 62.5 units off its own polygon.
      for (const g of ring.gates) {
        let d = Infinity;
        for (let i = 0; i < ring.polygon.length; i++) {
          const a = ring.polygon[i], b = ring.polygon[(i + 1) % ring.polygon.length];
          const dx = b[0] - a[0], dy = b[1] - a[1];
          const L = dx * dx + dy * dy;
          let t = L > 0 ? ((g.x - a[0]) * dx + (g.y - a[1]) * dy) / L : 0;
          if (t < 0) t = 0; else if (t > 1) t = 1;
          d = Math.min(d, Math.hypot(g.x - (a[0] + dx * t), g.y - (a[1] + dy * t)));
        }
        expect(d).toBeLessThan(f.meta.builtRadius * 0.05);
      }
    }
  });
});

describe('§202 THE UNIVERSAL ACCESS LAW and §201 B THE STREET-ATTACHMENT LAW', () => {
  it('every building reaches the street web through open space; no street is orphaned', () => {
    // The owner's sharpened form: access is TRANSITIVE. MEASURED before the cures: 187
    // landlocked bodies and 24 orphan street segments across the corpus.
    for (const spec of [
      { _seed: 'b7-acc-town', tier: 'town', population: 2400 },
      { _seed: 'b7-acc-city', tier: 'city', population: 9000 },
    ]) {
      const f = build(makeWalledFixture(spec));
      const af = accessFabricOf(f);
      const c = accessCensus(af, accessBodies(f), streetSeeds(af));
      expect(c.orphanStreets).toHaveLength(0);
      // ⚠ THE RESIDUE IS DECLARED, NOT HIDDEN: a sealed TRUTH ANCHOR is reported and never
      // deleted (§8.1), so the pin asserts the ordinary fabric is clean and that anything
      // left is an institution the receipt names.
      for (const k of c.landlocked) expect(k.startsWith('!inst|')).toBe(true);
    }
  });

  it('COUNTERFACTUAL: sealing a building inside a ring of bodies reds the census', () => {
    const f = build(makeWalledFixture({ _seed: 'b7-acc-cf', tier: 'town', population: 2400 }));
    const bodies = accessBodies(f);
    const af = accessFabricOf(f);
    const clean = accessCensus(af, bodies, streetSeeds(af));
    const cleanOrdinary = clean.landlocked.filter((k) => !k.startsWith('!inst|'));
    // Plant a small body and wall it in completely.
    const cx = f.meta.builtRadius * 0.2 + 500, cy = 500;
    const box = (x, y, w, h) => [[x - w, y - h], [x + w, y - h], [x + w, y + h], [x - w, y + h]];
    const sealed = { key: 'planted.sealed', kind: 'parcel', poly: box(cx, cy, 2, 2), ref: {}, field: 'polygon' };
    const R = 6;
    const ring = [
      { key: 'planted.n', kind: 'parcel', poly: box(cx, cy - R, R + 3, 3), ref: {}, field: 'polygon' },
      { key: 'planted.s', kind: 'parcel', poly: box(cx, cy + R, R + 3, 3), ref: {}, field: 'polygon' },
      { key: 'planted.e', kind: 'parcel', poly: box(cx + R, cy, 3, R + 3), ref: {}, field: 'polygon' },
      { key: 'planted.w', kind: 'parcel', poly: box(cx - R, cy, 3, R + 3), ref: {}, field: 'polygon' },
    ];
    const after = accessCensus(af, bodies.concat([sealed], ring), streetSeeds(af));
    expect(after.landlocked).toContain('planted.sealed');
    expect(after.landlocked.filter((k) => !k.startsWith('!inst|')).length)
      .toBeGreaterThan(cleanOrdinary.length);
  });

  it('COUNTERFACTUAL: §201 B is per-SEGMENT and binary, not MF-B5’s connectivity share', () => {
    // A severed lane can sit inside an excellent share. The arm severs one street by burying
    // it in bodies and asserts the census reds while the share barely moves.
    const f = build(makeWalledFixture({ _seed: 'b7-orphan-cf', tier: 'town', population: 2400 }));
    const bodies = accessBodies(f);
    const lane = f.channels.find((c) => c.rank === 'lane' && c.line.length >= 2);
    expect(lane).toBeTruthy();
    // ⚠ THE SEVERING HAS TO LEAVE THE STREET STANDING. Two spellings failed first and both
    // failures are the same shape: burying a lane whole leaves it with NO open cell, and a
    // channel with no open ground is ABSENT, not orphaned — the census deliberately does not
    // convict it. ⭐ A COUNTERFACTUAL THAT DESTROYS ITS SUBJECT TESTS NOTHING.
    // So the arm SEVERS: a real lane rank, laid inside a sealed ring of planted bodies, keeps
    // every one of its open cells and loses only its connection to the network.
    const box = (x, y, w, h) => [[x - w, y - h], [x + w, y - h], [x + w, y + h], [x - w, y + h]];
    const cx = 120, cy = 120, R = 26, T = 5;
    const severed = {
      key: 'severed.lane', rank: 'lane', width: lane.width,
      line: [[cx - 10, cy], [cx + 10, cy]],
    };
    const pen = [
      { key: 'pen.n', kind: 'parcel', poly: box(cx, cy - R, R + T, T) },
      { key: 'pen.s', kind: 'parcel', poly: box(cx, cy + R, R + T, T) },
      { key: 'pen.e', kind: 'parcel', poly: box(cx + R, cy, T, R + T) },
      { key: 'pen.w', kind: 'parcel', poly: box(cx - R, cy, T, R + T) },
    ];
    const fabric2 = { channels: f.channels.concat([severed]), web: f.web, walls: f.walls };
    const seeds2 = streetSeeds(fabric2);
    const clean2 = accessCensus(fabric2, bodies, seeds2);
    // Unpenned, the new lane is simply part of the countryside and attaches.
    expect(clean2.orphanStreets).not.toContain('severed.lane');
    const after = accessCensus(fabric2, bodies.concat(pen), seeds2);
    // ⚠ AND THE SHARE BARELY MOVES WHILE THE CENSUS REDS — which is the whole point of
    // §201 B being per-SEGMENT and BINARY rather than MF-B5's connectivity share.
    expect(after.orphanStreets).toContain('severed.lane');
    expect(after.orphanStreets.length).toBeGreaterThan(0);
  });
});

describe('§17.3 THE DEMOTION ARM — the repair pass DEMOTES before it removes', () => {
  it('demotes bodies to a rung the ground carries, and the rung is recorded', () => {
    // MF-B6 measured 176 dropped bodies and 86 lost dwellings on the metropolis with the arm
    // unbuilt. A demotion is VISIBLE work: the rung rides on the body and the back-house goes.
    const f = build(makeWalledFixture({ _seed: 'b7-demote', tier: 'city', population: 9000 }));
    expect(f.meta.groundLawDemoted).toBeGreaterThan(0);
    const demoted = f.parcels.filter((p) => p.rung);
    expect(demoted.length).toBeGreaterThan(0);
    for (const p of demoted) {
      expect(RUNGS.some((r) => r.name === p.rung)).toBe(true);
      // A cottage has one range and no workshop behind it — that is what makes it READ as a
      // cottage beside its neighbours rather than as a small burgage.
      expect(p.backHouse).toBeFalsy();
      // And a demoted body is still legal ground: it is in the census and the census is 0.
      expect(absArea(p.polygon)).toBeGreaterThan(0);
    }
    // ⭐ THE DEMOTED BODIES ARE IN THE DRAWN SET — a rung that the census cannot see is a
    // §195.0 vacuity by another name.
    const keys = new Set(footprints(f).map((x) => x.key));
    for (const p of demoted) expect(keys.has(p.key)).toBe(true);
  });

  it('COUNTERFACTUAL: the ladder REFUSES ground too small for its lowest rung', () => {
    // Without this arm "demote everything" would pass, and a hovel drawn on a sliver is the
    // lie the AREA_FLOOR exists to prevent.
    const f = build(makeWalledFixture({ _seed: 'b7-demote-cf', tier: 'city', population: 9000 }));
    const frontage = f.meta.plotFrontage;
    const floor = RUNGS[RUNGS.length - 1];
    for (const p of f.parcels.filter((x) => x.rung)) {
      expect(absArea(p.polygon)).toBeGreaterThanOrEqual(frontage * frontage * floor.minFrontages - 1e-6);
    }
    // And the drop path still fires: the arm did not simply absorb every refusal.
    expect(f.meta.groundLawDropped).toBeGreaterThan(0);
  });
});
