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
import { wallBand } from '../../src/domain/townMap/fabric/walls.js';
import {
  publishWallWorks, rampartArgsFor, legacyAsPublication, ringBand, wearOfCircuit,
  RAMPART_ARG_KEYS, UNGROUNDED_RUN_TYPES, GROUNDED_BUT_UNFIRED, CONDITIONAL_RUN_TYPES,
  WALL_PUBLICATION_SCHEMA_VERSION,
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

beforeAll(() => {
  const s = makeWalledFixture({ _seed: 'dress1-legacy', tier: 'city', population: 20000 });
  legacy = buildFabric(s, buildTownMapModel(s, null), { rampart: true });
  P = buildSettledPartition(fixtureInput());
  pub = publishWallWorks(P, { form: 'stone', frontage: 5, seed: 'dress1-fixture', year: 200 });
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

  it('⛔ the two STRUCTURALLY ungrounded run types are DECLARED and MINTED NOWHERE', () => {
    expect(Object.keys(UNGROUNDED_RUN_TYPES).sort()).toEqual(['crest', 'notch']);
    for (const t of Object.keys(UNGROUNDED_RUN_TYPES)) {
      expect(pub.counts[t], `${t} was minted from an input the partition does not carry`).toBe(0);
    }
    for (const [, why] of Object.entries(UNGROUNDED_RUN_TYPES)) expect(why.length).toBeGreaterThan(30);
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

  it('⭐ DETERMINISM — two publications of one partition are byte-identical', () => {
    const a = publishWallWorks(P, { form: 'stone', frontage: 5, seed: 'dress1-fixture', year: 200 });
    const b = publishWallWorks(P, { form: 'stone', frontage: 5, seed: 'dress1-fixture', year: 200 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    // and a control: a different seed must move the stream, or the seeding is decorative
    const c = publishWallWorks(P, { form: 'stone', frontage: 5, seed: 'dress1-other', year: 200 });
    expect(JSON.stringify(c) === JSON.stringify(a)
      && a.circuits.some((x) => x.fragments.some((f) => f.towers.length)),
    'the seed changed nothing and towers exist — the stream is not seeded').toBe(false);
  });
});
