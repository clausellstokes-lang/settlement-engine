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
import { faceRing, liveFaces } from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { pointInPolygon } from '../../src/domain/townMap/fabric/fabricGeometry.js';
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

/** Distance from a point to a closed ring's BOUNDARY — the bank, for the clip assertion. */
function distToRingBoundary(p, ring) {
  let best = Infinity;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]; const b = ring[(i + 1) % ring.length];
    const dx = b[0] - a[0]; const dy = b[1] - a[1];
    const L2 = dx * dx + dy * dy;
    const t = L2 > 0 ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / L2)) : 0;
    const d = Math.hypot(p[0] - (a[0] + dx * t), p[1] - (a[1] + dy * t));
    if (d < best) best = d;
  }
  return best;
}

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

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * ⛔⛔⛔ WALL-CURTAIN · ODQ §699.6 — **THE 83→7 RECOVERY GETS A GATE GUARD.**
 *
 * §699.6, verbatim: *"83→7 has NO gate guard at all — `runSignal.mjs` is a harness script and no
 * test asserts a corpus-level run-type count, so the wave's headline number is unprotected
 * against regression."* It was the second of the two guards that entry chartered.
 *
 * ⭐ **WHY A CORPUS AND NOT THE ONE FIXTURE ABOVE.** Everything SPINE-3 proved about carriage was
 * proved on a SINGLE settlement (`spine3-carriage`). Measured here for the first time: run the
 * SAME carriage predicate over six further independent fixtures and it fails on **five of them** —
 * so a claim that held on one leaf was being read as a claim about the producer. That is the
 * `§688.7` family again (a predicate weaker than its name), and the answer is not to weaken the
 * predicate but to give it a POPULATION and pin what it finds.
 *
 * ⚠⚠ **THE LOSSES BELOW ARE INHERITED, NOT THIS LANE'S — AND THAT IS PROVEN, NOT ASSERTED.** The
 * same seven fixtures were measured at the WALL-CURTAIN base (`f8f6456a0`) in a second worktree:
 * **identical lost set, identical 15 lost runs.** The bank clip moved `water-termination` 11 → 16
 * in the right direction and cleared nothing, which is honest and is why the roster is a pinned
 * ruling rather than a cure.
 *
 * ⭐ **AND IT IS A RATCHET, NOT A GOLDEN.** The lost TYPES are pinned exactly (a NEW type lost
 * reds) and the lost RUN COUNT is a ceiling (a widening reds, a cure passes). No per-type count is
 * frozen, because the counts move legitimately whenever the published extent does — as this lane's
 * own cure moved them.
 * ════════════════════════════════════════════════════════════════════════════════════════ */
describe('WALL-CURTAIN · §699.6 · THE RUN-TYPE RECOVERY, OVER A CORPUS AND NOT ONE LEAF', () => {
  /**
   * Seven settlements spanning village → metropolis and both water modes. ⚠ THE SCOPE IS
   * DECLARED: this is a FIXTURE corpus, not the harness's eighteen leaves, and the 18-leaf figure
   * (`crest` 62→38 · LOST 7, notch alone) is `harness/laneSPINE3/runSignal.mjs`'s. What this arm
   * guards is the LAW the headline rests on — that the site reaches the classifier and the four
   * types SPINE-3 recovered are still being minted — across a population rather than a sample.
   */
  const SPECS = Object.freeze([
    ['rc-town', 'town', 4200], ['rc-city', 'city', 20000], ['rc-metro', 'metropolis', 71000],
    ['rc-town2', 'town', 6500], ['rc-city2', 'city', 34000], ['rc-village', 'village', 900],
    ['spine3-carriage', 'city', 20000],
  ]);

  /**
   * ⛔ THE DECLARED LOSS ROSTER — measured at the base and unmoved at this tip. Each entry is a
   * type the LEGACY producer mints on this fixture corpus and the successor neither mints nor
   * declares. Entries leave by MEASUREMENT (the type fires) and never by convenience.
   */
  const DECLARED_LOST = Object.freeze({
    're-use': 'the successor keys `roadD` on ARTERY-ranked WAY face centroids, and these fixture'
      + ' partitions raise none within a working margin of the circuit; the legacy reads its own'
      + ' road embankments off the trace. Fires 5→5 on the harness corpus, so it is a fixture'
      + ' grounding gap and not a dead classifier',
    'water-termination': 'lost on the two `mode:\'near\'` fixtures only. SPINE-3 cured this class'
      + ' once by asking the §648 channel line as well as the clipped WATER faces; these two are'
      + ' the residue of that cure and are the next lane\'s, not this one\'s',
  });
  /** ⛔ A CEILING, so a widening reds and a cure passes. Measured 15 at base AND at this tip. */
  const LOST_RUN_CEILING = 15;

  /**
   * ⭐⭐⭐ ⟦REG-E1 · ODQ §717⟧ **THE ENCLOSURE FIDELITY BAR, AND WHAT IT IS AND IS NOT.**
   *
   * ⛔⛔ **THIS IS A CEILING ON A KNOWN, OWNER-PARKED DEFECT — NOT AN APPROVAL OF IT.** REG-E1
   * measured the four-reader "needle" defect to its producing call: `raiseWrap` derives a
   * circuit's outline as `convexHull` of the vertices of the pieces standing at the raise
   * (`partitionConstruct.js`, *"THE PIECE ENCLOSURE — the hull of the built pieces' own
   * vertices"*), while DESIGN_SPINE §3c charters *"the wrap is computed **along existing piece
   * boundaries** enclosing the built faces"*. A convex hull spans the GAPS between clumps of
   * pieces, so where the built set is clustered the hull is the clumps' convex span: a sliver
   * where they are near-collinear (metropolis E1 reads 711×31 on the harness corpus) and a
   * mostly-empty enclosure where they are scattered. **Which operator draws our wraps is
   * DESIGN_SPINE §8's OPEN PANEL QUESTION P2** (*"the wrap algorithm — along-piece-edges hull vs
   * the §575 tangential band"*), so it is the owner's call and not a lane's. This arm exists so
   * the class cannot GROW while the panel decides.
   *
   * ⚠ **THE PREDICATE IS RECORD-VERSUS-DRAWING, NOT TASTE.** `frozenRadius` is the only extent the
   * ledger states; `inShare` is the drawn ring's own inscribed radius about the settlement centre
   * over it. Nothing here asserts a SHAPE, so no owner signature is touched.
   *
   * ⛔⛔ **AND HERE IS WHAT THIS ARM CANNOT DO, SAID OUT LOUD SO NOBODY READS MORE INTO A RED.**
   * A low `inShare` is a consequence of narrowness and says NOTHING about its cause: **an honestly
   * elongated settlement, faithfully enclosed, reads exactly the same as an outlier-stretched
   * hull.** REG-E1's skeptic arm refuted the lane's first reading on precisely this point, and the
   * measurement then split the corpus — `metropolis` E1 is an artifact (a ~110-unit core stretched
   * ~6.6× by ~30 outlying pieces) while `city` E0 is HONEST (its central 85 % occupies 96 % of the
   * hull's length). The measure that separates them is `harness/laneE1/needleDiscriminator.mjs`'s
   * `discriminate`, and it needs the raise-epoch piece set, which the partition does not publish.
   * **So this is a REGRESSION CEILING on under-realisation, not a defect detector.**
   *
   * ⚠ DRESS-1b deliberately shipped NO test here — *"Pinning the current geometry as correct would
   * be worse than not pinning it."* That stands: nothing below pins a geometry or calls it correct.
   * These are ceilings that only ever shrink, and a cure lowers them in its own act.
   */
  const ENCLOSURE_FLOOR = 0.25;
  /** ⛔ CEILINGS, measured at THIS base. A cure lowers them; a regression reds. 7 wraps total. */
  const UNENCLOSING_CEILING = 6;
  const CENTRE_OUTSIDE_CEILING = 5;

  /** @type {any} */ let R = null;
  beforeAll(() => {
    const legacyTotals = {}; const sited = {}; const blind = {};
    const lostTypes = new Set(); let lostRuns = 0; let wraps = 0; let circuits = 0;
    let clippedEnds = 0; let worstClipGap = 0; let wetCircuits = 0; let closedOverWater = 0;
    /** ⟦REG-E1⟧ per wrap: does the drawn ring realise the extent its own record froze? */
    const enclosure = [];
    for (const [seed, tier, population] of SPECS) {
      const s = makeWalledFixture({ _seed: seed, tier, population });
      const f = buildFabric(s, buildTownMapModel(s, null), { rampart: true, partition: true });
      const leafLegacy = {};
      for (const w of f.walls || []) {
        circuits++;
        for (const [t, v] of Object.entries(w.runCounts || {})) {
          leafLegacy[t] = (leafLegacy[t] || 0) + v;
          legacyTotals[t] = (legacyTotals[t] || 0) + v;
        }
      }
      if (!f.spinePartition) continue;
      wraps += f.spinePartition.wraps.length;
      /**
       * ⭐⭐⭐ ⟦REG-E1 · ODQ §717⟧ **DOES THE CIRCUIT ENCLOSE WHAT ITS OWN RECORD SAYS IT
       * ENCLOSES?** Measured here because the loop already holds the fabric, so the arm costs no
       * build. `frozenRadius` is the ONLY statement the ledger makes about a circuit's extent —
       * `growthLedger.js`'s own sentence is *"its extent is frozen at the built radius of that
       * year"* — and `inR` is the largest circle about the settlement's own centre that the DRAWN
       * ring contains. A faithful circuit reads `inR/R ≈ 1`.
       */
      for (const w of f.spinePartition.wraps) {
        const ring = w.outer.map((p) => [p[0], p[1]]);
        const c = [f.meta.centre.x, f.meta.centre.y];
        const centreInside = pointInPolygon(c[0], c[1], ring);
        enclosure.push({
          seed,
          wrap: w.index,
          centreInside,
          // ⛔ ZERO, not `distToRingBoundary`, where the centre is OUTSIDE: the distance to a ring
          //    that does not contain you is not an inscribed radius, and reporting it as one would
          //    make the worst case read as the best.
          inShare: centreInside ? distToRingBoundary(c, ring) / w.frozenRadius : 0,
        });
      }
      const o = pubOptsFor(f);
      const p = publishWallWorks(f.spinePartition, o);
      const b = publishWallWorks(f.spinePartition, { ...o, site: null });
      for (const [t, v] of Object.entries(p.counts)) sited[t] = (sited[t] || 0) + v;
      for (const [t, v] of Object.entries(b.counts)) blind[t] = (blind[t] || 0) + v;
      const c = carriageCensus(leafLegacy, p);
      lostRuns += c.lostRuns;
      for (const t of c.lost) lostTypes.add(t);
      // ── WALL-CURTAIN · where the curtain STOPS, measured on every leaf that met water ───────
      const rings = [];
      for (const face of liveFaces(f.spinePartition.arrangement)) {
        if (face.cls !== 'WATER') continue;
        const r = faceRing(f.spinePartition.arrangement, face.id);
        if (r.length >= 3) rings.push(r);
      }
      for (const cir of p.circuits) {
        if (cir.wetVertices <= 0) continue;
        wetCircuits++;
        for (const fr of cir.fragments) {
          if (fr.closed) closedOverWater++;
          /**
           * ⛔ **ONLY AN ENDPOINT IS A BANK CLIP.** `vertexOfRing === −1` means "not a facet
           * vertex", and TWO things carry it: the clip at the bank, and the midpoint `sliceAtBank`
           * inserts to lift a two-point arc to three. MEASURED when the first spelling of this
           * arm counted both: a 0.48-unit piece's midpoint reads **0.242 u** from the bank and
           * reddened an arm whose cure was working perfectly. A predicate that convicts the right
           * code for the wrong reason is as useless as one that acquits.
           */
          const ends = [0, fr.ring.length - 1];
          for (const k of ends) {
            if (fr.vertexOfRing[k] !== -1) continue;
            clippedEnds++;
            const d = rings.length ? Math.min(...rings.map((w) => distToRingBoundary(fr.ring[k], w))) : Infinity;
            if (d > worstClipGap) worstClipGap = d;
          }
        }
      }
    }
    const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
    R = {
      legacyTotals, sited, blind, lostTypes: [...lostTypes].sort(), lostRuns, wraps, circuits,
      legacySum: sum(legacyTotals), sitedSum: sum(sited), blindSum: sum(blind),
      clippedEnds, worstClipGap, wetCircuits, closedOverWater,
      enclosure,
      centreOutside: enclosure.filter((e) => !e.centreInside).length,
      unenclosing: enclosure.filter((e) => e.inShare < ENCLOSURE_FLOOR).length,
    };
  }, 900000);

  it('⭐⭐⭐ THE CURTAIN RUNS TO THE BANK AND STOPS — measured at every clipped end', () => {
    /**
     * ⛔⛔ SPINE-3 stopped the wall being drawn over water by NOT PUBLISHING the whole fragment
     * that contained the wet span. On the harness corpus it dropped **281.2 u to remove 32.5 u**
     * on `town` and **401.3 u to remove 41.6 u** on `highwater`, and its termini stood **25–96 u
     * short of the bank** against facet means of 31–69 — refuting its own stated exit. The cut is
     * now at the crossing itself.
     *
     * ⭐ The predicate is about the END, not about the length, because a length on a fixture is a
     * golden and this is a LAW. An end that exists BECAUSE of water carries `−1` in
     * `vertexOfRing` — an interpolated point on the bank, not a facet vertex — and must stand
     * within `BANK_CLEARANCE`'s own hair of a water face's boundary.
     *
     * ⛔⛔ **AND THE FIRST SPELLING OF THIS ARM WAS VACUOUS, WHICH IS RECORDED RATHER THAN TIDIED.**
     * It was written against the single carriage fixture and opened with an early return for a
     * publication with no wet circuit. MEASURED: `spine3-carriage` has **zero** wet circuits, so
     * the arm returned immediately and passed **27/27 green while proving nothing**. It is the
     * §688.7 family inside a test written to close the §688.7 family, and the cure is the floor
     * below — the arm now names how many clipped ends it must find.
     */
    expect(R.wetCircuits, 'no fixture in the corpus raised a wrap that met water — this arm cannot'
      + ' say anything about where the curtain stops').toBeGreaterThanOrEqual(3);
    expect(R.clippedEnds, 'no clipped end anywhere in the corpus — the cut at the bank never fired,'
      + ' so a green here would be a statement about an empty set').toBeGreaterThanOrEqual(10);
    expect(R.worstClipGap, `the furthest clipped end stands ${R.worstClipGap.toFixed(3)} u from the`
      + ' bank — the curtain must run to the water and stop, not vanish a facet early').toBeLessThan(0.05);
    expect(R.closedOverWater, 'a wrap that met water published a CLOSED cycle — the ring was never'
      + ' opened at all').toBe(0);
  });

  it('⛔ NON-VACUITY FIRST — the corpus actually built walls for both producers', () => {
    // A recovery verdict computed over an empty corpus is the exact failure this arm exists to
    // prevent, so the denominator is asserted before anything is concluded from it.
    expect(R.circuits, 'the legacy producer raised no circuit anywhere in the corpus').toBeGreaterThanOrEqual(7);
    expect(R.wraps, 'the constructor raised no wrap anywhere in the corpus').toBeGreaterThanOrEqual(7);
    expect(R.legacySum, 'the legacy producer minted almost no runs — the corpus is not exercising it')
      .toBeGreaterThanOrEqual(100);
    expect(R.sitedSum, 'the successor minted almost no runs — the publication is not producing')
      .toBeGreaterThanOrEqual(50);
  });

  it('⭐⭐⭐ THE RECOVERY HOLDS — `crest` is minted across the corpus, and the SITE is why', () => {
    /**
     * `crest` carried **62 of the 83 lost runs**, and it is the type that cannot be minted without
     * the heightfield — the §2 spine input nothing ever carried until SPINE-3 routed it. A floor,
     * not a golden: the count moves whenever the published extent does (this lane's own cure moved
     * the 18-leaf figure 41 → 38), and what must never happen again is the collapse to zero.
     */
    expect(R.sited.crest, `the corpus mints ${R.sited.crest || 0} crest run(s) — the site has`
      + ' stopped reaching the classifier, which is exactly the 83-run loss returning')
      .toBeGreaterThanOrEqual(7);
  });

  it('⛔ THE LIVE CONTROL — withholding the SITE must DEGRADE the signal, not merely change it', () => {
    /**
     * ⭐ The sharpest available control, and it says more than "the number moved": with no
     * substrate the crest runs do not VANISH from the circuit, they are re-typed downward — so
     * `crest` must go to an exact **zero** while `new-cutting`, the ladder's fall-through, must
     * RISE. A stub that returned a fixed publication would move neither.
     */
    expect(R.blind.crest, 'the site-blind arm still mints crest — it is being minted from something'
      + ' other than the substrate, and a crest from ring curvature is a manufactured hill').toBe(0);
    expect(R.blindSum, 'the site-blind arm produced no runs at all — it is a broken call, not a'
      + ' control, and its zero above proves nothing').toBeGreaterThanOrEqual(50);
    expect(R.blind['new-cutting'], 'the crest runs did not fall through to `new-cutting` when the'
      + ' site was withheld — the ladder is not re-typing them, so this control is not live')
      .toBeGreaterThan(R.sited['new-cutting']);
  });

  it('⛔⛔ THE CARRIAGE LOSS ROSTER IS PINNED — a NEW lost type reds, a widening reds', () => {
    expect(R.lostTypes, 'the corpus-level carriage census lost a type that is not on the declared'
      + ` roster — mint it or rule it. Declared: ${Object.keys(DECLARED_LOST).sort().join(', ')}`)
      .toEqual(Object.keys(DECLARED_LOST).sort());
    expect(R.lostRuns, `${R.lostRuns} run(s) of signal lost against a ceiling of`
      + ` ${LOST_RUN_CEILING} measured at the WALL-CURTAIN base`).toBeLessThanOrEqual(LOST_RUN_CEILING);
    // ⛔ AND THE ROSTER IS NOT DECORATION: every declared entry must carry a written reason, and
    // a roster naming a type the census does not actually lose is a stale ruling.
    for (const t of Object.keys(DECLARED_LOST)) {
      expect(typeof DECLARED_LOST[t], `${t} is on the roster with no reason`).toBe('string');
      expect(RUN_TYPES, `${t} is ruled lost and is not even a run type`).toContain(t);
    }
    // ⛔ NON-VACUITY: the census must be finding SOMETHING, or "the roster matches" is a statement
    // about two empty sets. This is the one place a green here could be a dead instrument.
    expect(R.lostRuns, 'the corpus-level carriage census found no loss at all — if that is real it'
      + ' is a WIN and the roster must be emptied in the same act; if it is not, the census is dead')
      .toBeGreaterThan(0);
  });

  it('⛔⛔ ⟦REG-E1⟧ THE ENCLOSURE-FIDELITY CEILING — the circuit against the extent its record froze', () => {
    // ⛔ NON-VACUITY FIRST. A ceiling computed over an empty set is the failure this whole file
    //    was written to stop being, so the denominator is asserted before anything is read off it.
    expect(R.enclosure.length, 'no fixture raised a wrap at all — this arm is measuring nothing')
      .toBeGreaterThanOrEqual(7);
    expect(R.unenclosing, 'the enclosure defect has vanished from the fixture corpus. If a cure'
      + ' landed that is a WIN and these ceilings must be lowered in the SAME act; if no cure'
      + ' landed, this arm has gone blind and must not be believed').toBeGreaterThan(0);

    const worst = R.enclosure.reduce((a, b) => (b.inShare < a.inShare ? b : a));
    expect(R.unenclosing, `${R.unenclosing} of ${R.enclosure.length} wrap(s) enclose under`
      + ` ${ENCLOSURE_FLOOR} of the radius their own circuit event froze (ceiling`
      + ` ${UNENCLOSING_CEILING} measured at the REG-E1 base). Worst: ${worst.seed} E${worst.wrap}`
      + ` at ${worst.inShare.toFixed(4)}. ⛔ A RISE HERE IS A REGRESSION IN HOW FAITHFULLY A DRAWN`
      + ' CIRCUIT REALISES ITS OWN RECORD — see DESIGN_SPINE §3c and §8 P2.')
      .toBeLessThanOrEqual(UNENCLOSING_CEILING);
    expect(R.centreOutside, `${R.centreOutside} wrap(s) do not contain the settlement's own centre`
      + ` at all (ceiling ${CENTRE_OUTSIDE_CEILING}). A circuit that excludes the town centre is`
      + ' not a circuit of that town, whatever its record says.')
      .toBeLessThanOrEqual(CENTRE_OUTSIDE_CEILING);
  });
});
