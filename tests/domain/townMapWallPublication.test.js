/**
 * tests/domain/townMapWallPublication.test.js — ⭐⭐⭐ DRESS-1 · **PA.2's OPENING ACT, PROVEN.**
 *
 * PA.2: *"publish the exact surface that `rampartWorks`/`wallRuns` consume today … proven by a
 * CONTRACT TEST asserting the REG-2 dress renders unchanged against a legacy-node fixture. The
 * dress modules become CONSUMERS, NEVER RE-DERIVERS. Nothing else in this wave starts until that
 * test is green."*
 *
 * ⭐⭐⭐ **WHAT "RENDERS UNCHANGED" IS MADE TO MEAN HERE, AND WHY IT IS THE STRONGEST AVAILABLE
 * CLAIM.** The partition's wrap and the legacy node's ring are DIFFERENT GEOMETRY — the wrap is a
 * convex hull of built piece vertices facet-resampled to `wallForm.facets`, the legacy ring is
 * `traceWalls`' own trace (`partitionConstruct.js:1042`, which says so). So "the same picture" is
 * not available and asserting it would be a lie. What IS available, and is the actual claim PA.2
 * needs, is that the PUBLICATION IS A LOSSLESS CARRIER: feed the adapter the LEGACY node's own
 * values and the dress derived through it must come back **byte-identical** to the dress derived
 * from the legacy call site (`walls.js:718-729`). That proves a dress reading through the
 * publication sees exactly what the legacy dress saw — which is what makes it a consumer.
 *
 * ⛔ AND THE TEST CARRIES ITS OWN PLANTED CONTROLS, because a byte-identity assertion between two
 * expressions of the same values is exactly the shape that passes when the instrument is dead.
 * Three plants, each moving one key of the adapter, each of which MUST break the identity.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { makeWalledFixture } from '../fixtures/townMapFixtures.js';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { deriveRampartWorks, WEAR_GRADES } from '../../src/domain/townMap/fabric/rampartWorks.js';
import { RUN_TYPES, RUN_POLICY, TOWER_TYPES } from '../../src/domain/townMap/fabric/wallRuns.js';
import { wallBand, WALL_MARGIN, WALL_MARGIN_DEFAULT } from '../../src/domain/townMap/fabric/walls.js';
import { keyedRandom } from '../../src/domain/townMap/fabric/fabricRng.js';
import {
  publishWallWorks, rampartArgsFor, legacyAsPublication, ringBand, wearOfCircuit, carriageCensus,
  RAMPART_ARG_KEYS, UNGROUNDED_RUN_TYPES, SITE_GROUNDED_RUN_TYPES, GROUNDED_BUT_UNFIRED,
  CONDITIONAL_RUN_TYPES, WALL_PUBLICATION_SCHEMA_VERSION,
} from '../../src/domain/townMap/fabric/wallPublication.js';

/** A dated ledger with a raise — the same shape SPINE-1's own fixture uses. */
function fixtureLedger() {
  const epochs = [];
  const pops = [1, 60, 240, 700, 1400];
  const years = [0, 20, 55, 110, 200];
  for (let k = 0; k < pops.length; k++) {
    epochs.push({
      index: k, year: years[k], population: pops[k], peakSoFar: pops[k], extentTier: 'town',
      builtRadius: 30 + k * 26,
      plotSetDelta: k === 0 ? 1 : pops[k] - pops[k - 1],
      intramuralDelta: k === 0 ? 1 : pops[k] - pops[k - 1],
      extramuralDelta: 0,
      provenance: k === 0 ? 'recorded' : 'interpolated',
      circuitEvents: k === 3
        ? [{ index: 0, epoch: 3, year: 110, frozenRadius: 108, provenance: 'derived-frozen' }] : [],
      emissions: [], quarterMints: [],
    });
  }
  return { version: 1, epochs, circuitEvents: [], emissions: [], quarterMints: [], annotations: {} };
}

const fixtureInput = () => ({
  seed: 'dress1-fixture',
  ledger: fixtureLedger(),
  extent: { cx: 0, cy: 0, radius: 200 },
  originForm: 'NUCLEATED_CROSSROADS',
  planMode: 'COMPOSITE',
  roadWidth: 5,
  bodyTarget: 260,
  water: null,
  wallForm: { facets: 20, width: 2.2 },
});

/** @type {any} */ let legacy = null;
/** @type {any} */ let P = null;
/** @type {any} */ let pub = null;
/** @type {any} */ let both = null;
/** @type {any} */ let bothPub = null;
/** @type {any} */ let bothPubBlind = null;
/** @type {Record<string,number>} */ let bothLegacyCounts = {};

/**
 * ⭐⭐ **THE CARRIAGE FIXTURE — ONE SETTLEMENT, BOTH PRODUCERS.** The losslessness fixture above
 * compares two EXPRESSIONS of the legacy's own values, which is the right test for the adapter and
 * the wrong one for the producer. This arms `--rampart` and `--partition` on the SAME settlement,
 * so `fabric.walls` is the legacy classifier's output and `fabric.spinePartition` is the ground
 * the successor classifies — the only shape in which "carries what the legacy carried" is even a
 * question that can be asked.
 */
function pubOptsFor(f) {
  return {
    form: 'stone',
    frontage: (f.meta.streetWidths && f.meta.streetWidths.organism) || 5,
    seed: String(f.meta.seed),
    year: f.meta.snapshotYear != null ? f.meta.snapshotYear : f.meta.settlementAge,
    site: f.substrate,
    water: f.water && f.water.width ? { width: f.water.width, line: f.water.line } : null,
    margin: (WALL_MARGIN[f.meta.tier] || WALL_MARGIN_DEFAULT) * f.meta.builtRadius,
  };
}

beforeAll(() => {
  const s = makeWalledFixture({ _seed: 'dress1-legacy', tier: 'city', population: 20000 });
  legacy = buildFabric(s, buildTownMapModel(s, null), { rampart: true });
  P = buildSettledPartition(fixtureInput());
  pub = publishWallWorks(P, { form: 'stone', frontage: 5, seed: 'dress1-fixture', year: 200 });

  const b = makeWalledFixture({ _seed: 'spine3-carriage', tier: 'city', population: 20000 });
  both = buildFabric(b, buildTownMapModel(b, null), { rampart: true, partition: true });
  for (const w of both.walls || []) {
    for (const t of Object.keys(w.runCounts || {})) bothLegacyCounts[t] = (bothLegacyCounts[t] || 0) + w.runCounts[t];
  }
  const o = pubOptsFor(both);
  bothPub = publishWallWorks(both.spinePartition, o);
  // ⛔ THE CONTROL ARM: the same call with the SITE WITHHELD and the declaration suppressed.
  bothPubBlind = publishWallWorks(both.spinePartition, { ...o, site: null });
}, 900000);

describe('PA.2 · THE CONTRACT TEST — the REG-2 dress derives UNCHANGED through the publication', () => {
  it('the legacy node has a rampart to be a fixture for', () => {
    expect(legacy.walls.length, 'the walled fixture built no circuit — there is no fixture').toBeGreaterThan(0);
    const c = legacy.walls[0];
    expect(c.runs.length).toBeGreaterThanOrEqual(3);
    expect(c.rampart, 'the --rampart arm did not publish works on the legacy circuit').toBeTruthy();
  });

  it('⭐⭐⭐ works derived THROUGH the publication are BYTE-IDENTICAL to the legacy derivation', () => {
    for (const c of legacy.walls) {
      const band = wallBand(c, legacy.web.plotFrontage, true);
      const seeding = { seed: legacy.meta.seed };
      // the legacy call site, restated exactly as `walls.js:718-729` builds it
      const direct = deriveRampartWorks({
        ring: c.polygon, runs: c.runs || [], runOfVertex: c.runOfVertex || [],
        runBands: c.runBands || [], gates: c.gates || [], towers: c.towers || [],
        towerTypes: c.towerTypes || [], terminalWorks: c.cliffTermini || [],
        halfRing: c.halfRing, form: c.form, cliffs: null, water: null,
        stone: band.stone, seeding, epoch: c.epoch,
      });
      // the same values, carried by the publication and mapped by its ONE adapter
      const { fragment, circuit } = legacyAsPublication(c, band);
      const through = deriveRampartWorks(rampartArgsFor(fragment, circuit, { seeding }));
      expect(JSON.stringify(through), `circuit ${c.kind}/E${c.epoch}: the publication is LOSSY`)
        .toBe(JSON.stringify(direct));
    }
  });

  it('⛔ THE CONTROLS — each plant moves ONE adapter key and MUST break the identity', () => {
    const c = legacy.walls[0];
    const band = wallBand(c, legacy.web.plotFrontage, true);
    const seeding = { seed: legacy.meta.seed };
    const { fragment, circuit } = legacyAsPublication(c, band);
    const good = JSON.stringify(deriveRampartWorks(rampartArgsFor(fragment, circuit, { seeding })));

    const plants = [
      ['stone', () => deriveRampartWorks({ ...rampartArgsFor(fragment, circuit, { seeding }), stone: band.stone * 1.4 })],
      ['gates', () => deriveRampartWorks({ ...rampartArgsFor(fragment, circuit, { seeding }), gates: (c.gates || []).slice(1) })],
      ['towers', () => deriveRampartWorks({ ...rampartArgsFor(fragment, circuit, { seeding }), towers: (c.towers || []).slice(1) })],
    ];
    for (const [name, run] of plants) {
      expect(JSON.stringify(run()), `plant '${name}' did not move the derivation — this test cannot convict`)
        .not.toBe(good);
    }
    // and the un-planted call still agrees, so the plants moved the plant and not the world
    expect(JSON.stringify(deriveRampartWorks(rampartArgsFor(fragment, circuit, { seeding })))).toBe(good);
  });

  it('the adapter\'s key set IS the consumer\'s key set — no dead key, no missing key', () => {
    const c = legacy.walls[0];
    const { fragment, circuit } = legacyAsPublication(c, wallBand(c, legacy.web.plotFrontage, true));
    const keys = Object.keys(rampartArgsFor(fragment, circuit)).sort();
    expect(keys).toEqual([...RAMPART_ARG_KEYS].sort());
  });
});

describe('PA.2 · THE PUBLICATION OVER THE PARTITION — the band face publishes the same surface', () => {
  it('a walled partition publishes at least one circuit, as ordered cycles', () => {
    expect(pub.artifactKind).toBe('WALL_SUCCESSOR_PUBLICATION');
    expect(pub.schemaVersion).toBe(WALL_PUBLICATION_SCHEMA_VERSION);
    expect(P.wraps.length, 'the fixture raised no wrap — nothing to publish').toBeGreaterThan(0);
    expect(pub.circuits.length).toBe(P.wraps.length);
    for (const c of pub.circuits) {
      expect(c.fragments.length, 'a circuit with no fragment publishes nothing').toBeGreaterThan(0);
      for (const f of c.fragments) expect(f.ring.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('⭐ A1.3 S2-M4 · VINTAGE HONESTY — every circuit carries its year and its provenance', () => {
    for (const c of pub.circuits) {
      expect(Number.isFinite(c.vintage), 'a circuit with no year is the §11.11 stamp defect').toBe(true);
      expect(typeof c.provenance).toBe('string');
    }
  });

  it('every published run is one of the closed nine, with the TABLE\'S OWN cause verbatim', () => {
    let runs = 0;
    for (const c of pub.circuits) for (const f of c.fragments) for (const r of f.runs) {
      runs++;
      expect(RUN_TYPES).toContain(r.type);
      expect(r.cause, `run ${r.key} re-worded its cause`).toBe(RUN_POLICY[r.type].cause);
      expect(typeof r.key).toBe('string');
    }
    expect(runs, 'no run was published at all').toBeGreaterThan(0);
  });

  it('⭐ runOfVertex is TOTAL and the runs PARTITION the fragment — every vertex in exactly one run', () => {
    for (const c of pub.circuits) for (const f of c.fragments) {
      expect(f.runOfVertex.length).toBe(f.ring.length);
      const seen = new Set();
      for (const [ri, r] of f.runs.entries()) for (const i of r.idx) {
        expect(seen.has(i), `vertex ${i} belongs to two runs`).toBe(false);
        seen.add(i);
        expect(f.runOfVertex[i]).toBe(ri);
      }
      expect(seen.size, 'a vertex belongs to no run').toBe(f.ring.length);
    }
  });

  it('⛔ zero towers on a run whose policy is `none` (§205.3 — a cliff flank needs no wall)', () => {
    for (const c of pub.circuits) for (const f of c.fragments) {
      for (const t of f.towerJoints) {
        const r = f.runs[f.runOfVertex[t.at]];
        expect(r.towerPolicy, `a tower stands on a ${r.type} run`).not.toBe('none');
      }
      expect(f.towers.length).toBe(f.towerTypes.length);
      for (const t of f.towers) expect(Array.isArray(t) && t.length === 2).toBe(true);
      for (const k of f.towerTypes) expect(TOWER_TYPES).toContain(k);
    }
  });

  it('the runBands come from `wallRuns.runBand` and honour the run\'s own lane exemption', () => {
    for (const c of pub.circuits) for (const f of c.fragments) {
      expect(f.runBands.length).toBe(f.runs.length);
      for (const [i, b] of f.runBands.entries()) {
        const r = f.runs[i];
        expect(b.stone).toBeCloseTo(c.band.stone * r.thickness, 9);
        expect(b.lane).toBe(r.lane);
        if (!r.lane) expect(typeof b.exempt).toBe('string');
      }
    }
  });

  it('⭐ the band\'s `stone` IS the wrap\'s own bandWidth — read, never re-derived', () => {
    for (const [i, c] of pub.circuits.entries()) {
      expect(c.band.stone).toBe(P.wraps[i].bandWidth);
    }
    // and the side arithmetic is `wallBand`'s, restated on the read thickness
    const b = ringBand(2.2, 5, true);
    expect(b.width).toBeCloseTo(b.stone + b.inner + b.outer, 9);
    expect(b.inner).toBeGreaterThan(0);
  });

  it('⭐ PA.4 · WEAR derives from the ledger\'s facts × age, at the two provisional cuts', () => {
    for (const c of pub.circuits) {
      expect(WEAR_GRADES).toContain(c.wear.grade);
      expect(c.wear.provisional).toBe(true);
    }
    // the grade MOVES with age, which is the claim "derives" makes — and the null case is named
    const w = (year) => wearOfCircuit({ year: 100, provenance: 'recorded' }, { year }).grade;
    expect(w(110)).toBe('kept');
    expect(w(180)).toBe('weathered');
    expect(w(300)).toBe('crumbling');
    expect(wearOfCircuit({ year: 100, provenance: 'recorded' }, {}).age).toBe(null);
    // an unrecorded circuit carries no testimony of upkeep and ages faster — a named factor
    expect(wearOfCircuit({ year: 100, provenance: 'derived-frozen' }, { year: 100 }).kept).toBeLessThan(1);
  });

  it('⛔ the ONE type ungrounded BY RULING is declared and minted nowhere', () => {
    // A1.5 holds CAR-SEATING, so no institution roster exists to double back around.
    expect(Object.keys(UNGROUNDED_RUN_TYPES).sort()).toEqual(['notch']);
    for (const t of Object.keys(UNGROUNDED_RUN_TYPES)) {
      expect(pub.counts[t], `${t} was minted from an input the partition does not carry`).toBe(0);
    }
    for (const [, why] of Object.entries(UNGROUNDED_RUN_TYPES)) expect(why.length).toBeGreaterThan(30);
    // ⭐ and the SITE-DEPENDENT pair is a fact about the CALL, not about the partition: this
    // publication was made without a site, so both must be declared on it.
    expect(Object.keys(SITE_GROUNDED_RUN_TYPES).sort()).toEqual(['crest', 'terrain-surrender']);
    for (const t of Object.keys(SITE_GROUNDED_RUN_TYPES)) {
      expect(Object.keys(pub.ungrounded), `${t} must be declared on a site-blind publication`).toContain(t);
      expect(pub.counts[t]).toBe(0);
    }
    // ⚠ and the OTHER zeroes are separated by name — a refusal and an unfired classifier are
    // different facts, and a single table of noughts hides which is which.
    expect(GROUNDED_BUT_UNFIRED.every((t) => RUN_TYPES.includes(t))).toBe(true);
    expect(CONDITIONAL_RUN_TYPES).toEqual(['bad-closure']);
    for (const t of GROUNDED_BUT_UNFIRED.concat(CONDITIONAL_RUN_TYPES)) {
      expect(Object.keys(UNGROUNDED_RUN_TYPES), `${t} is not ungrounded`).not.toContain(t);
    }
  });

  it('the gate roster carries the WATER gates as their own class (A1.3 S2-M1)', () => {
    for (const [i, c] of pub.circuits.entries()) {
      expect(c.waterGateCount).toBe(P.wraps[i].waterGates.length);
      const water = c.gates.filter((g) => g.water);
      expect(water.length).toBe(c.waterGateCount);
      for (const g of water) expect(g.rank).toBe('water');
    }
  });

  it('⭐ SPINE-3 · the classifier is the ESTATE\'S ONE LADDER, not a second spelling', async () => {
    // The publication must not carry its own priority order. `wallRuns` owns it; this file calls
    // it. A re-introduced local ladder would show up here as an un-imported classifier.
    const src = await import('../../src/domain/townMap/fabric/wallPublication.js');
    expect(typeof src.carriageCensus).toBe('function');
    const wr = await import('../../src/domain/townMap/fabric/wallRuns.js');
    expect(typeof wr.runCuts, 'the ladder\'s cuts must be exported from wallRuns').toBe('function');
    expect(typeof wr.runTypeAt, 'the ladder must be exported from wallRuns').toBe('function');
    // and the ladder is TOTAL over the closed nine minus the two it never assigns
    const cuts = wr.runCuts([{ grade: 0, segLen: 1, turn: 0.1 }], { water: null });
    const t = wr.runTypeAt({
      grade: 0, refused: false, terminus: false, waterD: Infinity, hullD: Infinity,
      seatD: Infinity, workD: Infinity, roadD: Infinity, priorD: Infinity, margin: 10,
      segLen: 1, turn: 0.1,
    }, cuts, {});
    expect(RUN_TYPES).toContain(t);
    expect(t, 'a vertex with no positive fact is the residual').toBe('new-cutting');
  });

  it('⭐ DETERMINISM — two publications of one partition are byte-identical', () => {
    const a = publishWallWorks(P, { form: 'stone', frontage: 5, seed: 'dress1-fixture', year: 200 });
    const b = publishWallWorks(P, { form: 'stone', frontage: 5, seed: 'dress1-fixture', year: 200 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    /**
     * ⛔⛔ **AND THE SEED CONTROL IS RE-SPELLED, BECAUSE ITS FIRST SPELLING PASSED BY LUCK.**
     * It asserted that ONE other seed moves the publication. This fixture reaches exactly two
     * `chance(0.68)` rolls, so two arbitrary seeds land on the same side of the cut about 56 % of
     * the time — the control was a coin flip, and it happened to come up heads at the DRESS-1 and
     * DRESS-1b seals. A control that passes by luck reads identically to one that is live (§693.3,
     * on blanket sentences true by accident), which is the same class as this wave's own charter.
     *
     * The re-spelling has two halves, both deterministic:
     *   (i) the DRAW itself is seed-sensitive — asserted directly, so it cannot be luck;
     *  (ii) SOME seed of a fixed, named set moves the publication — with the set stated, so a
     *       reader can see the size of the claim rather than trusting one sample.
     */
    const draws = ['dress1-fixture', 'dress1-other'].map((s) => keyedRandom(s, 'wallpub.E0.F0', 'kind', 0));
    expect(draws[0], 'keyedRandom is not seed-sensitive — every draw in this file is decorative')
      .not.toBe(draws[1]);
    const alts = ['dress1-other', 'dress1-alt', 'dress1-third', 'dress1-fourth'];
    const moved = alts.filter((seed) => JSON.stringify(
      publishWallWorks(P, { form: 'stone', frontage: 5, seed, year: 200 }),
    ) !== JSON.stringify(a));
    expect(a.circuits.some((x) => x.fragments.some((f) => f.towers.length)),
      'no towers exist, so there is no seeded draw for a seed to move').toBe(true);
    expect(moved.length,
      `none of the ${alts.length} alternative seeds moved the publication — the stream is not seeded`)
      .toBeGreaterThan(0);
  });
});

/**
 * ⭐⭐⭐ **SPINE-3 · THE CARRIAGE CENSUS — THE PREDICATE PA.2's CONTRACT TEST WAS NAMED FOR AND
 * DID NOT ASSERT** (ODQ §692.6(ii); the §688.7 class, third appearance).
 *
 * ⛔⛔ Everything above this line proves *"the ADAPTER is lossless"* — feed it the legacy's own
 * values and the dress comes back byte-identical. True, useful, and **strictly weaker than
 * "the publication carries what the legacy producer carried"**, because it never ran the
 * successor's own PRODUCER against the legacy's. MEASURED at the DRESS-1b seal, with the block
 * above fully green: **the successor produced 0 of the 83 runs the legacy producer classifies as
 * `crest`/`notch`/`terrain-surrender`/`detour-to-work` on the same corpus.**
 *
 * The predicate below is the one the name always claimed: for every run type the LEGACY producer
 * mints on THIS settlement, the publication must MINT IT TOO or DECLARE IT UNGROUNDED with a
 * reason. And it carries the control that convicts — the same call with the SITE WITHHELD, which
 * must lose types the sited call carries. A carriage test that cannot fail proves nothing.
 */
describe('SPINE-3 · CARRIAGE — the publication carries what the legacy producer carried', () => {
  it('the carriage fixture arms BOTH producers on ONE settlement', () => {
    expect(both.walls.length, 'no legacy circuit — there is nothing to carry').toBeGreaterThan(0);
    expect(both.spinePartition, 'the --partition arm published nothing').toBeTruthy();
    expect(both.spinePartition.wraps.length, 'the partition raised no wrap').toBeGreaterThan(0);
    expect(both.substrate, 'the site must exist for the site arm to mean anything').toBeTruthy();
    expect(Object.keys(bothLegacyCounts).length, 'the legacy minted no typed run').toBeGreaterThan(1);
  });

  it('⭐⭐⭐ EVERY type the legacy producer mints is MINTED or DECLARED by the publication', () => {
    const c = carriageCensus(bothLegacyCounts, bothPub);
    expect(c.ok, c.reason).toBe(true);
    expect(c.lostRuns, `${c.lostRuns} run(s) of signal dropped — ${c.reason}`).toBe(0);
    // and the census actually walked something: a carriage verdict over zero rows is vacuous
    expect(c.rows.length, 'the carriage census walked no type at all').toBeGreaterThan(2);
  });

  it('⛔ THE CONTROL — the same call with the SITE WITHHELD must LOSE what the sited call carries', () => {
    // The blind publication still DECLARES the two site-dependent types, so carriage still holds
    // for it — that is the declaration doing its job, and it is asserted here rather than assumed.
    const blind = carriageCensus(bothLegacyCounts, bothPubBlind);
    expect(blind.ok, `the blind call broke carriage by losing ${blind.lost.join(',')}`).toBe(true);
    for (const t of Object.keys(SITE_GROUNDED_RUN_TYPES)) {
      expect(Object.keys(bothPubBlind.ungrounded), `${t} must be declared when no site is given`).toContain(t);
    }
    // ⛔ AND THE CENSUS MUST CONVICT A PUBLICATION THAT NEITHER MINTS NOR DECLARES. Strip the
    // declaration off the blind call and the same predicate must now FAIL — otherwise the whole
    // block above is a test that cannot fail.
    const stripped = { counts: bothPubBlind.counts, ungrounded: {} };
    const bad = carriageCensus(bothLegacyCounts, stripped);
    expect(bad.ok, 'the carriage census PASSED a publication that carries nothing — it is DEAD').toBe(false);
    expect(bad.lostRuns, 'the census reported no lost runs on a publication that lost them').toBeGreaterThan(0);
    // and the sited call genuinely mints more signal than the blind one — the site is load-bearing
    const sited = Object.entries(bothPub.counts).filter(([, v]) => v > 0).map(([k]) => k);
    const dark = Object.entries(bothPubBlind.counts).filter(([, v]) => v > 0).map(([k]) => k);
    expect(sited.length,
      'the site changed no run type at all — it is not reaching the classifier').toBeGreaterThan(dark.length);
  });

  it('⭐ the SITE reaches the classifier and the publication SAYS whether it did', () => {
    expect(bothPub.site).toMatch(/supplied a substrate/);
    expect(bothPubBlind.site).toMatch(/NO SITE SUPPLIED/);
    // grade response is real: at least one crest run exists on a leaf whose ring has relief
    const crest = bothPub.counts.crest;
    expect(crest + bothPub.counts['terrain-surrender'],
      'neither site-grounded type fired anywhere — the substrate read nothing').toBeGreaterThan(0);
    expect(bothPubBlind.counts.crest).toBe(0);
    expect(bothPubBlind.counts['terrain-surrender']).toBe(0);
  });

  it('⭐ PA.4 · WEAR reads a real AGE on a real fixture — not the null case', () => {
    // ⛔ MEASURED at the DRESS-1b tip: every harness driver passed `year: fabric.meta.presentYear`,
    // a key `buildFabric` does not publish, so `age` was `null` and every circuit in the corpus
    // reported the NULL grade. The tests were green because they called `wearOfCircuit` directly.
    for (const c of bothPub.circuits) {
      expect(Number.isFinite(c.wear.age), 'the wear age is null — the present year did not arrive').toBe(true);
      expect(c.wear.age).toBeGreaterThanOrEqual(0);
    }
  });

  it('⛔ the WRAP RING\'S OWN WET READING is published, because this seam does not cure it', () => {
    // The publication stops the curtain at the bank; it does NOT move the wrap. A consumer that
    // wants the constructor defect reads this number rather than re-deriving it.
    expect(typeof bothPub.wrapVerticesInWater).toBe('number');
    for (const c of bothPub.circuits) expect(typeof c.wetVertices).toBe('number');
    // and no PUBLISHED fragment stands in the water, whatever the wrap does
    for (const c of bothPub.circuits) {
      for (const f of c.fragments) {
        if (c.wetVertices > 0) expect(f.closed, 'a wrap that met water published a CLOSED cycle').toBe(false);
      }
    }
  });
});
