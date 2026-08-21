/**
 * tests/domain/townMapWallRuns.test.js — ⭐⭐⭐ §5 W2 · THE WALL, WHOLE.
 *
 * Three mechanisms land together because ODQ §251.4b and §250.5 rule that they cannot be split:
 * the typed run chain, G-42's fabric epochs, and `circuitDemotion`. Every arm below is one of
 * §5 W2's own exit criteria, and every one of them PROVES THE MECHANISM FIRES ON A REAL LEAF
 * (§270.1's standing law) rather than asserting that it exists.
 *
 * ⚠ THE FIXTURES ARE BUILT ONCE AND SHARED. A walled build is 1–3 s and there are ten of them;
 * building per-`it` turned this file into four minutes of the suite's time on its first run.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { buildFabric } from '../../src/domain/townMap/fabric/buildFabric.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import { makeWalledFixture, makeTownFixture } from '../fixtures/townMapFixtures.js';
import {
  RUN_TYPES, RUN_POLICY, TOWER_TYPES, deriveRuns, runBand,
} from '../../src/domain/townMap/fabric/wallRuns.js';
import {
  deriveEpochs, deriveFabricEpochs, EPOCH_CEILING, TIER_EPOCH_CAP, TIER_CIRCUIT_CAP,
} from '../../src/domain/townMap/fabric/epochAxis.js';
import { circuitClaims, circuitRuns, circuitWallLanes } from '../../src/domain/townMap/fabric/wallCircuit.js';
import { FATE_RUNGS, landPressure } from '../../src/domain/townMap/fabric/circuitDemotion.js';
import { claimSegments, claimIndex, deepestPenetration, PENETRATION_EPS } from '../../src/domain/townMap/fabric/reservedGround.js';
import { drawnBodies } from '../../src/domain/townMap/fabric/groundRefusal.js';
import { guardSimpleRing, nestAround, ringPairCrossings, pointInPolygon } from '../../src/domain/townMap/fabric/fabricGeometry.js';

const build = (s) => buildFabric(s, buildTownMapModel(s, null), {});

/** The lane's own small corpus — one walled fixture per shape the exits need. */
const FIXTURES = {
  city: () => makeWalledFixture({ _seed: 'w2-city', tier: 'city', population: 20000 }),
  metropolis: () => makeWalledFixture({ _seed: 'w2-metro', tier: 'metropolis', population: 71000 }),
  town: () => makeWalledFixture({ _seed: 'w2-town', tier: 'town', population: 3500 }),
};

/** @type {Record<string, any>} */ const F = {};
/** @type {Record<string, any>} */ const REAL = {};
/** @type {any} */ let unwalled = null;

beforeAll(async () => {
  for (const k of Object.keys(FIXTURES)) F[k] = build(FIXTURES[k]());
  unwalled = build(makeTownFixture());
  // ⭐ ONE REAL CORPUS LEAF. The exemption arm below needs a wall built along existing property
  // and no synthetic fixture in this repo produces one; the riverside town does.
  const { CORPUS, buildOne } = await import('../../harness/exemplars.mjs');
  for (const key of ['town', 'polycentric']) {
    REAL[key] = buildOne(CORPUS.find((c) => c.key === key)).fabric;
  }
}, 900000);

describe('§5 W2 exit 1 · every circuit is an ENUMERATED CHAIN OF TYPED RUNS', () => {
  it('N ≥ 3 runs on every walled ring, each from the closed set of nine with a cited cause', () => {
    let rings = 0;
    for (const key of Object.keys(F)) {
      for (const ring of F[key].walls) {
        rings++;
        expect(ring.runs.length, `${key}/${ring.kind}: a circuit with fewer than three runs is a shape, not a chain`)
          .toBeGreaterThanOrEqual(3);
        for (const run of ring.runs) {
          expect(RUN_TYPES).toContain(run.type);
          // ⛔ ZERO RUNS WITH CAUSE `null`. The whole point of the chain is that every run is a
          // decision with a reason; an untyped run is the old single trace wearing a list.
          expect(typeof run.cause).toBe('string');
          expect(run.cause.length).toBeGreaterThan(20);
          expect(run.idx.length).toBeGreaterThan(0);
        }
        // The runs PARTITION the ring: every vertex belongs to exactly one run.
        const seen = new Set();
        for (const run of ring.runs) for (const i of run.idx) {
          expect(seen.has(i), `${key}/${ring.kind}: vertex ${i} belongs to two runs`).toBe(false);
          seen.add(i);
        }
        expect(seen.size).toBe(ring.polygon.length);
      }
    }
    expect(rings).toBeGreaterThan(3);
  });

  it('⛔ COUNTERFACTUAL · a boundary that crosses ONE condition yields ONE run, not three', () => {
    // ⭐ THE ARM THAT PROVES `N` IS NOT A FLOOR DRESSED AS A DERIVATION. A perfectly regular
    // ring over flat, dry, empty ground crosses no distinct condition — and the chain says so
    // by returning a single `new-cutting`. A classifier that manufactured three runs here would
    // be a knob with a table in front of it.
    const ring = [];
    for (let i = 0; i < 40; i++) {
      const a = (i / 40) * 2 * Math.PI;
      ring.push([500 + 200 * Math.cos(a), 500 + 200 * Math.sin(a)]);
    }
    const chain = deriveRuns({
      ring, hull: ring, sub: null, water: null, seats: [], margin: 20, roads: [],
      priorRing: null, halfRing: false, form: 'stone',
      spec: { towerEvery: 2, facets: 20, smooth: 0, ditch: true, weight: 4 },
      seeding: { seed: 'flat', variant: 0 }, epoch: 0, threat: 0.5, frontage: 8, laneWidth: 4,
    });
    expect(chain.runs.length).toBe(1);
    expect(chain.runs[0].type).toBe('new-cutting');
  });
});

describe('§5 W2 exit 2 · CONCENTRICITY IS REFUTED BY MEASUREMENT, not by eye', () => {
  it('no two rings of a multi-ring leaf share a radius profile OR a bay-and-lobe signature', () => {
    // The existing pin compares the METROPOLIS's two rings; §5 W2 extends it to ALL rings on
    // every multi-ring leaf, and adds the second half: scale-removed profiles can differ while
    // the SHAPE is still a scaled copy, so the bay-and-lobe signature is asked separately.
    let compared = 0;
    for (const key of Object.keys(F)) {
      const rings = F[key].walls;
      if (rings.length < 2) continue;
      const profiles = rings.map((r) => normalizedProfile(r.polygon));
      for (let i = 0; i < profiles.length; i++) {
        for (let j = i + 1; j < profiles.length; j++) {
          compared++;
          const d = profileDistance(profiles[i], profiles[j]);
          expect(d, `${key}: rings ${i} and ${j} are the SAME SHAPE at two scales — the §157 concentric-decoration defect`)
            .toBeGreaterThan(0.02);
          // THE BAY-AND-LOBE SIGNATURE: where the profile crosses its own mean, and how often.
          expect(lobeSignature(profiles[i])).not.toEqual(lobeSignature(profiles[j]));
        }
      }
    }
    expect(compared, 'no multi-ring leaf in the fixture set — the arm would be vacuous').toBeGreaterThan(0);
  });
});

describe('§5 W2 exit 3 · THE FLANK GRAMMAR, and the per-run tower policy', () => {
  it('⭐⭐ `none` on terrain-surrender and water runs — ZERO towers, measured', () => {
    let bare = 0, towered = 0;
    for (const key of Object.keys(F)) {
      for (const run of circuitRuns(F[key].wallCircuit)) {
        if (run.type === 'terrain-surrender' || run.type === 'water-termination') {
          expect(run.towers.length,
            `${key}: a ${run.type} run carries towers — §205.3 says a cliff flank needs NO wall`).toBe(0);
          bare++;
        } else if (run.towers.length) towered++;
      }
    }
    // ⚠ BOTH HALVES OR THE PIN IS VACUOUS: there must BE a bare run and there must BE a
    // towered one, or "zero towers on the bare flank" is a statement about an empty set.
    expect(bare, 'no terrain-surrender or water run in the fixture set').toBeGreaterThan(0);
    expect(towered).toBeGreaterThan(0);
  });

  it('the policy table is exhaustive over RUN_TYPES and every row is reachable', () => {
    for (const t of RUN_TYPES) {
      expect(RUN_POLICY[t], `no policy row for run type '${t}'`).toBeTruthy();
      expect(['none', 'sparse', 'clustered']).toContain(RUN_POLICY[t].towers);
      expect(typeof RUN_POLICY[t].lane).toBe('boolean');
    }
    expect(Object.keys(RUN_POLICY).sort()).toEqual([...RUN_TYPES].sort());
  });

  it('⭐⭐ TOWER POSITIONS ARE SEEDED-IRREGULAR — the even-index spacing is GONE', () => {
    // ⚠⚠ THIS IS EXIT 9's SECOND BRANCH, PINNED. §259.3's corner rule (SUB-3) is HELD because
    // `laneMFW0-receipt.md` §6.2 reports G-40(i) ⛔ NO INSTRUMENT, so the seeded-irregular
    // policy stands — but what stood BEFORE was neither policy: `i += spec.towerEvery` is EVEN
    // SPACING BY INDEX, ATLAS banned prior #7 by name. The pin measures the spacing CV along
    // each ring and asserts it is not the near-zero a fixed index stride produces.
    for (const key of Object.keys(F)) {
      for (const ring of F[key].walls) {
        if (ring.towers.length < 4) continue;
        const gaps = [];
        for (let i = 1; i < ring.towers.length; i++) {
          gaps.push(Math.hypot(ring.towers[i][0] - ring.towers[i - 1][0], ring.towers[i][1] - ring.towers[i - 1][1]));
        }
        const mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        const cv = Math.sqrt(gaps.reduce((a, b) => a + (b - mean) * (b - mean), 0) / gaps.length) / Math.max(1e-9, mean);
        expect(cv, `${key}/${ring.kind}: tower spacing CV ${cv.toFixed(3)} — this reads as machine-set`)
          .toBeGreaterThan(0.10);
      }
    }
  });

  it('a tower is a TYPE — every drawn tower carries one from the closed set', () => {
    const seen = new Set();
    for (const key of Object.keys(F)) {
      for (const ring of F[key].walls) {
        expect(ring.towerTypes.length).toBe(ring.towers.length);
        for (const t of ring.towerTypes) { expect(TOWER_TYPES).toContain(t); seen.add(t); }
      }
    }
    // ⚠ MORE THAN ONE KIND MUST ACTUALLY OCCUR, or "a tower is a type" is a field nobody reads.
    expect(seen.size).toBeGreaterThan(1);
  });
});

describe('§5 W2 exit 4 · §200 READS 0 WITH THE RUN-TYPE EXEMPTION, AND THE EXEMPTION IS NON-VACUOUS', () => {
  it('the drawn census is 0 against the PER-RUN claim set, area-true', () => {
    for (const key of Object.keys(F)) {
      const f = F[key];
      const claims = circuitClaims(f.wallCircuit);
      const segs = claimSegments(claims);
      const idx = claimIndex(segs);
      let n = 0;
      for (const b of drawnBodies(f)) if (deepestPenetration(b.poly, segs, idx).pen > PENETRATION_EPS) n++;
      expect(n, `${key}: bodies standing in the wall's reserved band`).toBe(0);
    }
  });

  it('⛔⛔ COUNTERFACTUAL · WITHDRAW THE RUN-TYPE EXEMPTION AND THE ABUTTING RUNS RED', () => {
    // ⭐⭐⭐ THE ARM THAT MAKES THE 0 ABOVE WORTH SOMETHING. §239.2's wall-side street is a
    // PER-RUN policy — 7/7 walled plates show it on SOME runs, 0/7 on EVERY run — so a global
    // intervallum reserves a band the corpus never draws. The exemption is DOING WORK only if
    // re-imposing the full intervallum on the runs that abut convicts real bodies.
    // ⚠ THE COUNTERFACTUAL IS THE LAW'S OWN FUNCTION WITH ONE FLAG FLIPPED, not a second
    // implementation — `laneMFB8b`'s standing contract: independence bought by counterfactual.
    // ⚠⚠ THE SUBJECT IS A **REAL CORPUS LEAF**, NOT A FIXTURE, AND THAT IS A MEASUREMENT
    // RATHER THAN A PREFERENCE. MEASURED at MF-W2: on `makeWalledFixture` every abutting run
    // is a WATER TERMINATION — the wall stands where the river is and no body was ever going
    // to stand there — so the counterfactual convicted nobody and the arm would have been
    // VACUOUS while looking green. The riverside town carries two TOFT-BACKS runs with 58
    // bodies inside its inner face, which is the population the exemption exists to forgive.
    // ⭐ THE CLASS: **A COUNTERFACTUAL RUN ON A SUBJECT THAT CANNOT EXHIBIT THE DEFECT IS NOT
    // A COUNTERFACTUAL** — `laneMFB8b`'s "confounded population" lesson, one surface out.
    let convicted = 0, abutting = 0;
    for (const key of Object.keys(REAL)) {
      const f = REAL[key];
      /** @type {Array<any>} */ const cf = [];
      for (const ring of f.walls) {
        for (let j = 0; j < ring.runs.length; j++) {
          const run = ring.runs[j];
          if (run.lane) continue;                       // already carries the full intervallum
          abutting++;
          // The SAME band function, asked as if this run carried the lane it does not.
          const rb = runBand(ring.bandParts, { ...run, lane: true });
          const line = run.idx.map((k) => ring.claimLine[k % ring.claimLine.length]).filter(Boolean);
          if (line.length >= 2) cf.push({ key: `cf.${ring.kind}.${j}`, line, width: rb.width });
        }
      }
      if (!cf.length) continue;
      const segs = claimSegments(cf);
      const idx = claimIndex(segs);
      for (const b of drawnBodies(f)) if (deepestPenetration(b.poly, segs, idx).pen > PENETRATION_EPS) convicted++;
    }
    expect(abutting, 'no abutting run in the fixture set — the exemption would be about nothing')
      .toBeGreaterThan(0);
    expect(convicted,
      'withdrawing the run-type exemption convicts NOBODY — the exemption is hiding no defect AND doing no work')
      .toBeGreaterThan(0);
  });

  it('⭐ the wall-side lane is a SETBACK, not a drawn lane laid on top of one', () => {
    // §258.2's substitution rule: the lane is the ground the band already reserves. Its
    // carriageway must lie INSIDE the run's own reservation, or the drawing has invented
    // ground the law never took.
    for (const key of Object.keys(F)) {
      const lanes = circuitWallLanes(F[key].wallCircuit);
      for (const lane of lanes) {
        const ring = F[key].walls.find((r) => (r.wallLanes || []).some((l) => l.key === lane.key));
        expect(ring).toBeTruthy();
        for (const p of lane.line) {
          const d = distToRing(ring.polygon, p[0], p[1]);
          expect(d, `${key}: the wall lane runs outside the band it is made of`)
            .toBeLessThanOrEqual(ring.bandParts.stone / 2 + ring.bandParts.inner + 1e-6);
        }
      }
    }
  });
});

describe('§5 W2 exit 5 · EVERY SUPERSEDED CIRCUIT EMITS GEOMETRY INTO THE CURRENT FABRIC', () => {
  it('a ring street matching the superseded trace, plus at least one other fossil', () => {
    let demoted = 0;
    for (const key of Object.keys(F)) {
      const f = F[key];
      const old = f.walls.filter((r) => r.kind === 'old-core');
      for (const ring of old) {
        demoted++;
        const street = f.demotion.ringStreets.find((s) => s.epoch === ring.epoch);
        expect(street, `${key}: superseded circuit E${ring.epoch} emitted NOTHING`).toBeTruthy();
        // ⭐ "WITHIN THE TOPOLOGY QUANTUM" IS A THEOREM HERE, NOT A TOLERANCE: the ring street
        // IS the superseded polygon, closed. Asserting equality is the honest reading of a
        // construction that copies rather than approximates.
        expect(street.line.length).toBe(ring.polygon.length + 1);
        for (let i = 0; i < ring.polygon.length; i++) {
          expect(street.line[i][0]).toBe(ring.polygon[i][0]);
          expect(street.line[i][1]).toBe(ring.polygon[i][1]);
        }
        const others = f.demotion.dwellings.filter((d) => d.epoch === ring.epoch).length
          + f.demotion.gardens.filter((g) => g.epoch === ring.epoch).length
          + f.demotion.widenings.filter((w) => w.epoch === ring.epoch).length;
        expect(others, `${key}: E${ring.epoch} emitted a street and nothing else`).toBeGreaterThan(0);
      }
    }
    expect(demoted, 'no superseded circuit in the fixture set — the arm is vacuous').toBeGreaterThan(0);
  });

  it('the ring street is IN THE WEB — a demoted wall is an input to the street stage', () => {
    for (const key of Object.keys(F)) {
      const f = F[key];
      for (const s of f.demotion.ringStreets) {
        expect(f.channels.some((c) => c.key === s.key),
          `${key}: ${s.key} was emitted and never joined the street web`).toBe(true);
      }
    }
  });

  it('the FATE LADDER is weighted by land pressure and every rung is a member of the ladder', () => {
    for (const key of Object.keys(F)) {
      for (const fate of F[key].demotion.fates) {
        expect(FATE_RUNGS).toContain(fate.rung);
        expect(fate.pressure).toBeGreaterThanOrEqual(0);
        expect(fate.pressure).toBeLessThanOrEqual(1);
      }
    }
    // ⛔ COUNTERFACTUAL — pressure is DERIVED: a ring deep inside a large prosperous town is
    // under more pressure than one just inside a poor town's current wall.
    const deep = landPressure({ extent: 0.4, prosperityRank: 5, demoted: false });
    const shallow = landPressure({ extent: 0.98, prosperityRank: 1, demoted: false });
    expect(deep).toBeGreaterThan(shallow);
    expect(landPressure({ extent: 0.4, prosperityRank: 5, demoted: true }))
      .toBeLessThan(deep);
  });
});

describe('§5 W2 exit 8 · G-42 · EPOCHS ARE FABRIC EPOCHS, NOT CIRCUIT EPOCHS', () => {
  it('every leaf carries a measured fabric-epoch count inside PLAN §6.1s ladder', () => {
    const LADDER = { thorp: [1, 1], hamlet: [1, 1], village: [1, 2], town: [2, 3], city: [2, 4], metropolis: [3, 4] };
    for (const key of Object.keys(F).concat(['unwalled'])) {
      const f = key === 'unwalled' ? unwalled : F[key];
      const band = LADDER[f.meta.extentTier];
      expect(band, `no ladder row for ${f.meta.extentTier}`).toBeTruthy();
      expect(f.meta.fabricEpochs).toBeLessThanOrEqual(band[1]);
      expect(f.meta.fabricEpochs).toBeLessThanOrEqual(EPOCH_CEILING);
      expect(f.meta.fabricEpochs).toBeGreaterThanOrEqual(1);
    }
  });

  it('⭐⭐⭐ AN UNWALLED LEAF STOPS READING 1 BY CONSTRUCTION', () => {
    // The defect §257.3(a) ruled: `epochAxis` minted one epoch per CIRCUIT, so six of sixteen
    // exemplar leaves could not express a vintage at all. A town-extent settlement that grew
    // over two centuries has two or three vintages and, if it never walled, no circuit.
    expect(unwalled.walls.length).toBe(0);
    expect(unwalled.meta.fabricEpochs).toBeGreaterThanOrEqual(2);
    const ladder = deriveFabricEpochs({
      hasWalls: false, extentTier: 'village', builtRadius: 179, vintage: null, foundingAge: 240,
    });
    expect(ladder.boundaries.length).toBe(2);
  });

  it('the CIRCUIT ladder is provably a SUBSET of the EPOCH ladder', () => {
    for (const key of Object.keys(F)) {
      const epochs = F[key].wallCircuit.epochs;
      const walled = epochs.filter((e) => e.walled);
      expect(walled.length).toBe(F[key].walls.length);
      // zero circuits without an epoch…
      for (const ring of F[key].walls) {
        expect(epochs.some((e) => e.index === ring.epoch && e.walled),
          `${key}: ring E${ring.epoch} has no epoch`).toBe(true);
      }
      // …and epochs without circuits are EXPECTED rather than exceptional.
      expect(epochs.length).toBeGreaterThanOrEqual(walled.length);
    }
    expect(Object.keys(F).some((k) => F[k].wallCircuit.epochs.length > F[k].walls.length)).toBe(true);
  });

  it('⛔ COUNTERFACTUAL (ii) · A FIFTH EPOCH REDS', () => {
    // PLAN §6.1 measured no fifth legible epoch over 313 plates, and §263.2's whole
    // differentiator over Fantasy Town Generator rests on our knowing that number.
    expect(EPOCH_CEILING).toBe(4);
    for (const t of Object.keys(TIER_EPOCH_CAP)) expect(TIER_EPOCH_CAP[t]).toBeLessThanOrEqual(4);
    // A tier whose cap somehow exceeded the ceiling must never reach the output: the ladder
    // clamps to the ceiling and throws if it ever could not.
    const wide = deriveFabricEpochs({
      hasWalls: true, extentTier: 'metropolis', builtRadius: 442, vintage: null, foundingAge: 640,
    });
    expect(wide.boundaries.length).toBeLessThanOrEqual(EPOCH_CEILING);
  });

  it('⛔ COUNTERFACTUAL (i) · AN EPOCH COUNT FROM A KNOB REDS AT THE DOOR', () => {
    const ok = { hasWalls: true, extentTier: 'city', builtRadius: 392, vintage: null, foundingAge: 104 };
    expect(() => deriveEpochs(ok)).not.toThrow();
    expect(() => deriveEpochs({ ...ok, fabricEpochs: 4 })).toThrow(/DERIVED, never dialled/);
    expect(() => deriveEpochs({ ...ok, population: 20000 })).toThrow(/undeclared input/);
  });

  it('§240.2 · a below-town settlement earns ZERO circuits; a stated wall is a TRUTH OVERRIDE', () => {
    const v = deriveEpochs({ hasWalls: true, extentTier: 'village', builtRadius: 179, vintage: { ageAtBuild: 40, year: 200 }, foundingAge: 240 });
    expect(v.truthOverride).toBe(true);
    expect(v.circuits).toBe(1);
    expect(v.reason).toMatch(/TRUTH OVERRIDE/);
    expect(TIER_CIRCUIT_CAP.metropolis).toBe(3);
  });
});

/* ── helpers ─────────────────────────────────────────────────────────────────────────────── */

/** A ring's radius profile about its own mean, SCALE REMOVED, resampled to 64 bins. */
function normalizedProfile(poly) {
  let cx = 0, cy = 0;
  for (const p of poly) { cx += p[0]; cy += p[1]; }
  cx /= poly.length; cy /= poly.length;
  const bins = new Array(64).fill(0);
  const hits = new Array(64).fill(0);
  for (const p of poly) {
    const dx = p[0] - cx, dy = p[1] - cy;
    const r = Math.sqrt(dx * dx + dy * dy);
    // The bin is the point's own turn about the centre, from a rational octant reduction —
    // no runtime trig in a test that measures a fabric whose law forbids it.
    const t = angleBin(dx, dy, 64);
    bins[t] += r; hits[t]++;
  }
  let sum = 0, n = 0;
  for (let i = 0; i < 64; i++) if (hits[i]) { bins[i] /= hits[i]; sum += bins[i]; n++; }
  const mean = sum / Math.max(1, n);
  for (let i = 0; i < 64; i++) bins[i] = hits[i] ? bins[i] / mean : 1;
  return bins;
}

function angleBin(dx, dy, n) {
  const ax = dx < 0 ? -dx : dx, ay = dy < 0 ? -dy : dy;
  const t = ax + ay === 0 ? 0 : ay / (ax + ay);          // monotone in the angle, no trig
  let oct = dx >= 0 ? (dy >= 0 ? t : 4 - t) : (dy >= 0 ? 2 - t : 2 + t);
  oct = oct < 0 ? oct + 4 : oct;
  return Math.min(n - 1, Math.floor((oct / 4) * n));
}

function profileDistance(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s / a.length;
}

/** Where a profile crosses its own mean — the bay-and-lobe signature. */
function lobeSignature(p) {
  const out = [];
  for (let i = 0; i < p.length; i++) {
    const a = p[i] >= 1, b = p[(i + 1) % p.length] >= 1;
    if (a !== b) out.push(i);
  }
  return out;
}

function distToRing(poly, px, py) {
  let best = Infinity;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const dx = b[0] - a[0], dy = b[1] - a[1], L = dx * dx + dy * dy;
    let t = L > 0 ? ((px - a[0]) * dx + (py - a[1]) * dy) / L : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const d = Math.hypot(px - (a[0] + dx * t), py - (a[1] + dy * t));
    if (d < best) best = d;
  }
  return best;
}

/**
 * ⭐⭐⭐ §287.12 / SPEC §7.8 D0 · **THE SELF-INTERSECTION CENSUS — NOW A STANDING PIN AT ZERO,
 * OVER EVERY RING THE FABRIC PUBLISHES.**
 *
 * ⛔⛔ WHAT THIS REPLACES, AND WHY THE REPLACEMENT IS NOT A RELAXATION. MF-W2 left an
 * ONLY-SHRINKS RATCHET here with two arms: a per-fixture ceiling (`city 3, metropolis 0,
 * town 0`) and a NON-VACUITY arm that asserted at least one ring still crossed itself, carrying
 * its own instruction — *"if a later wave cures the trace this arm goes vacuous and must be
 * DELETED rather than kept green."* MF-D0 cured the trace, so that arm is **deleted, as it
 * asked to be**, and the ceiling is replaced by the only ceiling worth pinning: **zero.**
 *
 * ⚠⚠ AND THE SUBJECT IS WIDER THAN THE RATCHET'S WAS, WHICH IS THE LANE'S SHARPEST FINDING.
 * The ratchet asked the question of `walls[].polygon` alone and the corpus census read 12
 * crossing segments on 5 leaves. The offset kernel emits FOUR more ring families on the same
 * leaves — the ditch, the demotion's ditch gardens, the closed pre-water-flank circuit and the
 * claim line — and NOTHING had ever asked them. Asked of all of them, the sealed W2 base carries
 * **38 crossing segments over 24 rings** (`laneMFD0-rings-base.log`): the wall polygon was 32% of
 * the defect. ⭐ THE STANDING LAW, and this pin is its enforcement: **a census over a derived set
 * proves nothing about a surface it does not contain.**
 *
 * ⛔ WHY ZERO IS THE RIGHT CEILING RATHER THAN A SMALLER RATCHET. A ring that crosses itself does
 * not bound a solid: extrude it and the wall has no inside, light it and the silhouette is
 * undefined, census it volume-true and the predicate has nothing to answer. The kernel
 * (`guardSimpleRing`) cannot emit one, so any number above zero here is a NEW producer that
 * bypassed the kernel — which is exactly what this pin should catch.
 */
describe('⭐⭐⭐ §287.12 · EVERY PUBLISHED RING IS SIMPLE — the D0 census, pinned at zero', () => {
  // ⚠ THE PREDICATE IS THIS FILE'S OWN COPY AND THAT IS DELIBERATE. `fabricGeometry`'s
  // `ringSelfCrossings` is the kernel the CURE consults; a pin that imported it would be grading
  // the cure with the cure's own arithmetic. This spelling is the independent second reading, and
  // it is character-for-character the corpus instrument's (`MFW2-simple.mjs`, `laneMFD0-rings.mjs`).
  const crosses = (P) => {
    if (!P || P.length < 4) return 0;
    const m = P.length;
    let c = 0;
    const x = (a, b, cc, d) => {
      const den = (b[0] - a[0]) * (d[1] - cc[1]) - (b[1] - a[1]) * (d[0] - cc[0]);
      if (den === 0) return false;
      const t = ((cc[0] - a[0]) * (d[1] - cc[1]) - (cc[1] - a[1]) * (d[0] - cc[0])) / den;
      const u = ((cc[0] - a[0]) * (b[1] - a[1]) - (cc[1] - a[1]) * (b[0] - a[0])) / den;
      return t > 1e-9 && t < 1 - 1e-9 && u > 1e-9 && u < 1 - 1e-9;
    };
    for (let i = 0; i < m; i++) {
      for (let j = i + 2; j < m; j++) {
        if (i === 0 && j === m - 1) continue;
        if (x(P[i], P[(i + 1) % m], P[j], P[(j + 1) % m])) c++;
      }
    }
    return c;
  };

  /** Every closed ring a leaf publishes, named by its family — the census's SUBJECT, stated. */
  const ringsOf = (f) => {
    const out = [];
    for (const w of f.walls || []) {
      out.push([`wall.${w.kind}.E${w.epoch}`, w.polygon]);
      if (w.closedPolygon && w.closedPolygon !== w.polygon) out.push([`closedWall.${w.kind}.E${w.epoch}`, w.closedPolygon]);
      if (w.ditch) out.push([`ditch.${w.kind}.E${w.epoch}`, w.ditch]);
      if (w.claimLine && w.claimLine !== w.polygon) out.push([`claimLine.${w.kind}.E${w.epoch}`, w.claimLine]);
      if (w.epochHull) out.push([`epochHull.${w.kind}.E${w.epoch}`, w.epochHull]);
    }
    for (const g of (f.demotion && f.demotion.gardens) || []) out.push([`ditchGarden.${g.key}`, g.polygon]);
    return out;
  };

  it('no published ring crosses itself, on any fixture, in any family', () => {
    let examined = 0;
    for (const key of Object.keys(F)) {
      for (const [name, poly] of ringsOf(F[key])) {
        examined++;
        expect(crosses(poly), `${key}: ${name} crosses itself — a ring that crosses itself does not bound a solid`)
          .toBe(0);
      }
    }
    // ⛔ NON-VACUITY, AND IT IS THE ARM THAT MATTERS: a subject list that silently went empty
    // would report a clean zero forever. The fixtures publish rings in more than one family.
    expect(examined, 'the census examined NOTHING — the subject list has gone empty').toBeGreaterThan(10);
  });

  it('⛔ COUNTERFACTUAL — the predicate CONVICTS a ring that folds, so the zero above is a fact', () => {
    // A bow tie: the smallest ring that crosses itself. If this reads 0 the pin above is vacuous
    // and every "0 crossings" line in the receipt is worthless.
    expect(crosses([[0, 0], [10, 10], [10, 0], [0, 10]])).toBeGreaterThan(0);
    // …and a square does not, so the predicate is not simply always-true.
    expect(crosses([[0, 0], [10, 0], [10, 10], [0, 10]])).toBe(0);
  });

  it('⭐⭐⭐ §301.5 THE RING-NESTING LAW — no two circuits of one leaf cross each other', () => {
    // ⭐⭐ A DIFFERENT LAW FROM SELF-INTERSECTION, AND THE PROGRAMME WAS BLIND TO IT. Two rings
    // can each be perfectly simple and still be drawn through one another; containment, §200,
    // §232's straddlers and W2's concentricity pin (which compares radius PROFILES) are ALL
    // satisfied by an intersecting pair. MEASURED: the sealed W2 base shipped 20 such crossings
    // and MF-D0's kernel halved them to 10 as a side effect — both on the metropolis.
    let pairs = 0;
    for (const key of Object.keys(F)) {
      const W = (F[key].walls || []);
      for (let a = 0; a < W.length; a++) {
        for (let b = a + 1; b < W.length; b++) {
          pairs++;
          expect(
            ringPairCrossings(W[a].polygon, W[b].polygon),
            `${key}: ${W[a].kind}.E${W[a].epoch} × ${W[b].kind}.E${W[b].epoch} — a superseded`
            + ' circuit must lie strictly INSIDE its successor, not through it',
          ).toBe(0);
        }
      }
    }
    // ⛔ NON-VACUITY: a fixture set with no multi-ring leaf would report a clean zero forever.
    expect(pairs, 'no fixture publishes two circuits — the nesting census has no subject').toBeGreaterThan(0);
  });

  it('⛔ COUNTERFACTUAL — `nestAround` is EXCEPTION-ONLY and its predicate CONVICTS', () => {
    // The predicate sees a crossing pair and clears a nested pair — without this the zero above
    // is a statement about an inert function.
    const outer = [[0, 0], [100, 0], [100, 100], [0, 100]];
    const inside = [[20, 20], [80, 20], [80, 80], [20, 80]];
    const straddling = [[50, 50], [150, 50], [150, 150], [50, 150]];
    expect(ringPairCrossings(inside, outer)).toBe(0);
    expect(ringPairCrossings(straddling, outer)).toBeGreaterThan(0);
    // ⭐ EXCEPTION-ONLY, BY IDENTITY — a pair that already nests is not touched, which is why
    // every leaf whose circuits never crossed is byte-identical across this cure.
    expect(nestAround(outer, inside)).toBe(outer);
    // ⭐⭐ AND THE **LATER** RING IS THE ONE THAT MOVES (§240.4, the inertia seam): the superseded
    // ring comes back untouched and the successor grows around it. A repair in the other
    // direction reds §240.4 — measured, not argued.
    const grown = nestAround(outer, straddling);
    expect(grown).not.toBe(outer);
    expect(ringPairCrossings(straddling, grown)).toBe(0);
    // …and the repaired ring is still a ring: the guard runs inside the push loop.
    expect(crosses(grown)).toBe(0);
  });

  it('⭐⭐ NESTING IS ENFORCED FROM BOTH SIDES — a successor NOTCH dipping in is caught too', () => {
    // ⛔ THE MEASURED RESIDUAL THAT FORCED ARM 2: with only the "pull a vertex that stands
    // outside back in" arm, every inner vertex was inside its successor (0 of 24 outside) and
    // SIX crossings still stood, because the successor carries a re-entrant notch that dips
    // into the superseded ring. ⭐ THE CLASS: **"A ⊂ B" is not one predicate, and a repair that
    // enforces one half of it halts at the other.**
    // ⚠ THE NOTCH IS SHALLOW ON PURPOSE, AND THE BOUND IS PART OF THE CLAIM. `nestInside` is a
    // bounded LOCAL repair in the shape of `boundEpoch`'s sweep, not a polygon-boolean solver:
    // it retreats the inner boundary past an intruding successor vertex. A notch driven far
    // enough into the inner ring is outside its reach and the corpus census is what would say
    // so — measured on the real corpus, the intrusions are ONE OR TWO vertices deep.
    const notched = [[0, 0], [100, 0], [100, 100], [55, 100], [55, 75], [45, 75], [45, 100], [0, 100]];
    const inner = [[20, 20], [80, 20], [80, 80], [20, 80]];
    // every inner vertex is inside the notched outer…
    for (const p of inner) expect(pointInPolygon(p[0], p[1], notched)).toBe(true);
    // …and the pair still crosses, which is exactly the case arm 1 alone cannot reach.
    expect(ringPairCrossings(inner, notched)).toBeGreaterThan(0);
    const fixed = nestAround(notched, inner);
    expect(ringPairCrossings(inner, fixed)).toBe(0);
  });

  it('⭐⭐ THE KERNEL IS EXCEPTION-ONLY — a simple ring comes back as the SAME OBJECT', () => {
    // ⭐ THIS IS THE BYTE-PRESERVATION LAW AS A PIN (§287.12 / SPEC §10.16(2)): *preserve the
    // legacy simple-offset output exactly when valid.* Identity, not equality — an equal COPY
    // would still be a correct offset and would still be a different object, and only identity
    // proves that the repair path did not run.
    const square = [[0, 0], [10, 0], [10, 10], [0, 10]];
    expect(guardSimpleRing(square)).toBe(square);
    // …and a folded ring is repaired into a simple one rather than returned as it came.
    const bow = [[0, 0], [10, 10], [10, 0], [0, 10]];
    const fixed = guardSimpleRing(bow);
    expect(fixed).not.toBe(bow);
    expect(crosses(fixed)).toBe(0);
  });
});
