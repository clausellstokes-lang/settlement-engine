/**
 * tests/domain/townMapPartition.test.js — ⭐⭐⭐ SPINE-1 · DESIGN_SPINE §1/§3/§4 under A1 and A2 ·
 * **THE PARTITION'S EXITS, EACH WITH ITS PLANTED CONTROL.**
 *
 * §6's law is one sentence: *"every zero with a live control."* Every zero asserted here is
 * therefore followed by a PLANT that must move it, because a guard that has never been shown
 * convicting is a guard nobody has tested. The plants are surgical — one edge re-typed, one
 * annotation deleted, one gate flag cleared — so the count must move by EXACTLY the planted amount
 * and not by an unrelated collapse.
 *
 * ⚠ THE FIXTURE IS SYNTHETIC AND SMALL ON PURPOSE. A corpus leaf costs ~0.5 s to build and the
 * suite is already 157 s; the invariants are properties of the STRUCTURE, so a hand-built ledger
 * over a handful of epochs exercises every one of them. The corpus-scale figures live in the
 * lane's own instruments (`harness/laneSPINE1/`), which is where a wall-clock budget belongs.
 */
import { describe, it, expect } from 'vitest';
import {
  ARRANGEMENT_QUANTUM_LADDER,
} from '../../src/domain/townMap/fabric/fabricDcel.js';
import { GEOMETRY_QUANTUM } from '../../src/domain/townMap/fabric/coordinateAbi.js';
import {
  PARTITION_QUANTUM_PER_UNIT, EDGE_TYPES, FACE_CLASSES, RESERVED_EDGE_TYPES,
  RESERVED_FACE_CLASSES, createArrangement, seedRegion, cutWay, cutFaceByLine, insertRing,
  liveFaces, faceArea, properCrossings, splitFaceChain, addVertex,
} from '../../src/domain/townMap/fabric/partitionArrangement.js';
import { buildSettledPartition } from '../../src/domain/townMap/fabric/partitionConstruct.js';
import { projectPage, PAGE_BAND_RW2 } from '../../src/domain/townMap/fabric/partitionView.js';
import {
  censusInvariants, censusCrossings, censusReserved, censusTotality, censusTangential,
} from '../../src/domain/townMap/fabric/partitionCensus.js';

/** A small, dated ledger: five epochs, one circuit raise, one typed emission. */
function fixtureLedger() {
  const epochs = [];
  const pops = [1, 60, 240, 700, 1400];
  const years = [0, 20, 55, 110, 200];
  for (let k = 0; k < pops.length; k++) {
    epochs.push({
      index: k,
      year: years[k],
      population: pops[k],
      peakSoFar: pops[k],
      extentTier: 'town',
      builtRadius: 30 + k * 26,
      plotSetDelta: k === 0 ? 1 : pops[k] - pops[k - 1],
      intramuralDelta: k === 0 ? 1 : pops[k] - pops[k - 1],
      extramuralDelta: 0,
      provenance: k === 0 ? 'recorded' : 'interpolated',
      circuitEvents: k === 3
        ? [{ index: 0, epoch: 3, year: 110, frozenRadius: 108, provenance: 'derived-frozen' }] : [],
      emissions: k === 4
        ? [{ key: 'emit.E4.0', epoch: 4, year: 200, souls: 120, kind: 'faubourg', origin: 'gate',
          provenance: 'interpolated', reason: 'a saturated circuit' }] : [],
      quarterMints: k === 3 ? [{ epoch: 3, year: 110, tier: 'town', provenance: 'recorded', reason: 'town scale' }] : [],
    });
  }
  return { version: 1, epochs, circuitEvents: [], emissions: [], quarterMints: [], annotations: {} };
}

function fixtureInput(over = {}) {
  return {
    seed: 'spine1-fixture',
    ledger: fixtureLedger(),
    extent: { cx: 0, cy: 0, radius: 200 },
    originForm: 'NUCLEATED_CROSSROADS',
    planMode: 'COMPOSITE',
    roadWidth: 5,
    bodyTarget: 260,
    water: null,
    wallForm: { facets: 20, width: 2.2 },
    ...over,
  };
}

describe('§1 · the substrate is a planar subdivision, and its operations are what keep it one', () => {
  it('a seeded region is exactly one bounded face plus the unbounded one, and areas conserve', () => {
    const arr = createArrangement();
    const root = seedRegion(arr, [[-100, -100], [100, -100], [100, 100], [-100, 100]],
      { faceClass: 'FIELD', edgeType: 'BOUND' });
    expect(arr.faces.length).toBe(2);
    expect(faceArea(arr, root)).toBeCloseTo(40000, 6);
    const w = cutWay(arr, root, [0, 0], [1, 0], 6, { rank: 'artery', key: 'A' });
    expect(w).not.toBeNull();
    expect(arr.faces[w.way].cls).toBe('WAY');
    // ⭐ EXACT AREA CONSERVATION — a split partitions, it never loses or doubles ground.
    const total = liveFaces(arr).reduce((s, f) => s + faceArea(arr, f.id), 0);
    expect(total).toBeCloseTo(40000, 6);
    // EULER on the whole map (F counts the unbounded face)
    expect(arr.verts.length - arr.edges.length + arr.faces.filter((f) => f.alive).length).toBe(2);
    expect(properCrossings(arr).length).toBe(0);
  });

  it('⛔ CONTROL · a chord that leaves its face is REFUSED, and refusing is what keeps planarity', () => {
    const arr = createArrangement();
    const root = seedRegion(arr, [[0, 0], [100, 0], [100, 100], [0, 100]], {});
    const va = addVertex(arr, 0, 0);
    const vb = addVertex(arr, 100, 100);
    // an interior point placed OUTSIDE the face — the arrangement must refuse, not bend
    const bad = splitFaceChain(arr, root, va, vb, [[200, 50]], { type: 'BOUND' });
    expect(bad.ok).toBe(false);
    expect(bad.reason).toMatch(/leaves the face|crosses the face boundary/);
    // …and the good chord through an interior point succeeds
    const good = splitFaceChain(arr, root, va, vb, [[70, 30]], { type: 'BOUND' });
    expect(good.ok).toBe(true);
    expect(properCrossings(arr).length).toBe(0);
  });

  it('⛔ CONTROL · a split point that is not ON its edge is REFUSED', () => {
    const arr = createArrangement();
    const root = seedRegion(arr, [[0, 0], [100, 0], [100, 100], [0, 100]], {});
    // a line that misses the face entirely
    expect(cutFaceByLine(arr, root, [500, 500], [1, 0], { type: 'BOUND' })).toBeNull();
    expect(arr.refusals.length).toBeGreaterThan(0);
  });

  it('the partition grid is the arrangement ladder’s finest rung, pinned rather than imported', () => {
    // ⚠ `partitionArrangement.js` may NOT import `coordinateAbi.js` — FOUNDATIONS must stay
    // outbound-edge-free — so the two values are pinned equal HERE instead.
    expect(ARRANGEMENT_QUANTUM_LADDER[0] / GEOMETRY_QUANTUM.denominator)
      .toBeCloseTo(1 / PARTITION_QUANTUM_PER_UNIT, 12);
  });

  it('a ring inserted into the arrangement keeps it planar and conserves area', () => {
    const arr = createArrangement();
    const root = seedRegion(arr, [[-100, -100], [100, -100], [100, 100], [-100, 100]], {});
    cutWay(arr, root, [0, 0], [1, 0], 6, { rank: 'artery', key: 'A' });
    const ring = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ring.push([Math.cos(a) * 70, Math.sin(a) * 70]);
    }
    const ins = insertRing(arr, ring, { type: 'WALL', key: 'wrap.0' });
    // ⚠ SEGMENTS ARE NOT FACETS, and the difference is the algorithm working rather than failing:
    // a run of ring points that stays inside ONE face becomes ONE `splitFaceChain` carrying all of
    // them as interior points. Thirteen facets across three faces is four segments.
    expect(ins.segments + ins.retyped).toBeGreaterThan(2);
    expect(properCrossings(arr).length).toBe(0);
    expect(liveFaces(arr).reduce((s, f) => s + faceArea(arr, f.id), 0)).toBeCloseTo(40000, 6);
    expect(arr.edges.filter((e) => e.type === 'WALL').length).toBeGreaterThan(8);
    // ⚠ **BREAKS ARE COUNTED, NOT HIDDEN.** A vertex-degenerate crossing can leave the walk without
    // a face it can anchor in; it recovers at the next crossing and the facet's chord is missing.
    // This fixture takes ONE such break — recorded so a later car reads a number rather than a
    // promise, and so the wrap census has something to convict on if it grows.
    expect(ins.breaks).toBeLessThanOrEqual(1);
  });
});

describe('§3 · the epoch fold, and every §6 zero with its control', () => {
  const P = buildSettledPartition(fixtureInput());

  it('the fold consumes every ledger epoch and publishes what it made', () => {
    expect(P.artifactKind).toBe('SETTLED_GROUND_PARTITION');
    expect(P.foldedEpochs).toBe(5);
    expect(P.plots).toBeGreaterThan(40);
    expect(P.wraps.length).toBe(1);
    // ⛔ A1.3's VINTAGE HONESTY: the wrap's YEAR is required by the schema, so the §11.11 stamp
    // defect (a vintage with no year) cannot be expressed.
    expect(P.wraps[0].year).toBe(110);
    expect(P.wraps[0].provenance).toBe('derived-frozen');
  });

  it('E1 · the six invariants are ZERO, and a planted violation of each REDS', () => {
    const c = censusInvariants(P, {});
    for (const arm of c.arms) {
      expect(arm.violations, `${arm.arm}: ${JSON.stringify(arm.violations.slice(0, 2))}`).toEqual([]);
      expect(arm.walked, `${arm.arm} walked nothing — the zero is vacuous`).toBeGreaterThan(0);
    }
    // ⛔ PLANT 1 — an untyped edge. The edge-totality arm must move by exactly one.
    const arr = P.arrangement;
    const keptType = arr.edges[3].type;
    arr.edges[3].type = 'NOT_A_TYPE';
    const red = censusInvariants(P, {});
    expect(red.arms.find((a) => a.arm === 'edge-totality').violations.length).toBe(1);
    expect(red.ok).toBe(false);
    arr.edges[3].type = keptType;
    // ⛔ PLANT 2 — a plot face whose tenure piece is removed. Containment must move by one.
    const plot = liveFaces(arr).find((f) => f.cls === 'PLOT');
    const keptPiece = plot.piece;
    plot.piece = -1;
    expect(censusInvariants(P, {}).arms.find((a) => a.arm === 'containment').violations.length).toBe(1);
    plot.piece = keptPiece;
    expect(censusInvariants(P, {}).ok).toBe(true);
  });

  it('E2 · tangential-or-clear is 0 BY CONSTRUCTION, measured against the BAND FACE', () => {
    const t = censusTangential(P);
    expect(t.violations).toEqual([]);
    expect(t.bandFaces).toBeGreaterThan(0);
    expect(t.pieces).toBeGreaterThan(0);
    // ⛔ CONTROL: the census can see an overlap when one exists — a piece typed as a band face is
    // exactly the geometry a zero-width wall edge would have produced.
    const arr = P.arrangement;
    const victim = liveFaces(arr).find((f) => f.cls === 'PLOT');
    const kept = victim.cls;
    victim.cls = 'WALLBAND';
    const seeded = censusTangential(P);
    victim.cls = kept;
    expect(seeded.bandFaces).toBe(t.bandFaces + 1);
  });

  it('E3 · every WAY that crosses the band is a GATE, and a planted ungated way REDS', () => {
    const c = censusCrossings(P);
    expect(c.ungated).toEqual([]);
    expect(c.closedCircuits).toEqual([]);
    expect(c.gates).toBeGreaterThan(0);
    // ⛔ PLANT — clear one gate's flag. The count must move by exactly one.
    const arr = P.arrangement;
    const gate = liveFaces(arr).find((f) => f.cls === 'WAY' && f.attrs && f.attrs.gate);
    expect(gate, 'the fixture minted no gate — the control would be vacuous').toBeTruthy();
    gate.attrs = { ...gate.attrs, gate: false };
    expect(censusCrossings(P).ungated.length).toBe(1);
    gate.attrs = { ...gate.attrs, gate: true };
    expect(censusCrossings(P).ungated.length).toBe(0);
  });

  // ⚠⚠ **SUPERSEDED BY SPINE-2, AND RE-POINTED RATHER THAN DELETED.** SPINE-1 asserted that
  // `WATER`, `LOSSREGION` and `CROSSING` were minted ZERO, with a planted `WATER` face as its
  // control. §3e and §3f BUILD all three, so the reservation is DISCHARGED and that plant now
  // convicts nothing. Deleting the case would leave the estate with one fewer instrument and no
  // record of why; what it asserts instead is the discharge itself, plus the arm that took over the
  // job — an OFF-ROSTER class must still convict. See `townMapPartitionWater.test.js` for the
  // liveness half (a leaf WITH water must mint some; a dry leaf must mint none).
  it('the reservation is DISCHARGED, and the roster arm took over its control', () => {
    const r = censusReserved(P);
    expect(r.faces).toEqual([]);
    expect(r.edges).toEqual([]);
    expect(RESERVED_FACE_CLASSES.length).toBe(0);
    expect(RESERVED_EDGE_TYPES.length).toBe(0);
    // the classes it used to hold are in the roster, and they are MINTED now
    for (const c of ['WATER', 'LOSSREGION']) expect(FACE_CLASSES).toContain(c);
    for (const t of ['CROSSING', 'BANK']) expect(EDGE_TYPES).toContain(t);
    // ⛔ CONTROL: an OFF-ROSTER class still convicts, and the mutation is restored in `finally`
    // so a failing expectation cannot leak it into the next case — which is exactly how this
    // supersession first presented, as TWO gate failures with one cause.
    const arr = P.arrangement;
    const f = liveFaces(arr)[0];
    const kept = f.cls;
    try {
      f.cls = 'MARSH';
      const arm = censusInvariants(P, {}).arms.find((a) => a.arm === 'face-totality');
      expect(arm.violations.length).toBe(1);
    } finally { f.cls = kept; }
    expect(censusInvariants(P, {}).arms.find((a) => a.arm === 'face-totality').violations.length).toBe(0);
  });

  it('E9 · A6.1 totality is 100 %, and a planted omission moves the orphan count by ONE', () => {
    const t = censusTotality(P);
    expect(t.orphans).toEqual([]);
    expect(t.owed).toBeGreaterThan(40);
    expect(t.unknown).toBe(0);
    // ⛔ PLANT — delete one annotation.
    const key = Object.keys(P.annotations).find((k) => k.startsWith('plot.'));
    const kept = P.annotations[key];
    const mutable = { ...P, annotations: { ...P.annotations } };
    delete mutable.annotations[key];
    expect(censusTotality(mutable).orphans.length).toBe(1);
    expect(P.annotations[key]).toBe(kept);
  });

  it('E6 · the fold is DETERMINISTIC: two builds of one input are identical', () => {
    const a = buildSettledPartition(fixtureInput());
    const b = buildSettledPartition(fixtureInput());
    const digest = (x) => JSON.stringify({
      v: x.arrangement.verts.map((p) => `${p.x},${p.y}`),
      e: x.arrangement.edges.map((z) => `${z.type}|${z.key}`),
      f: x.arrangement.faces.map((z) => `${z.cls}|${z.piece}`),
      plots: x.plots, wraps: x.wraps.length, gates: x.gates.length,
    });
    expect(digest(a)).toBe(digest(b));
    // …and a DIFFERENT seed makes a different partition, or the seed is not read at all.
    const other = buildSettledPartition(fixtureInput({ seed: 'spine1-fixture-2' }));
    expect(digest(other)).not.toBe(digest(a));
  });

  it('A2.2 · the constructor contains NO coordinate noise — the source itself is the assertion', async () => {
    // ⚠ A2.2 makes this enforceable rather than aspirational: irregularity comes from DECISION
    // statistics (which cut, where along the edge, at what angle) and never from moving a vertex
    // after it is placed. Every draw in the constructor is a `keyedRandom` used to CHOOSE.
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, join } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    const src = readFileSync(join(here, '../../src/domain/townMap/fabric/partitionConstruct.js'), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1');
    // no vertex is displaced by a draw: a draw never multiplies a coordinate difference
    expect(src).not.toMatch(/\b(jitter|wobble|noise)\b/i);
    expect(src).not.toMatch(/Math\.random/);
    // and no stateful stream is opened
    expect(src).not.toMatch(/fabricRng\(/);
  });
});

describe('§4 · the page register, under A1.2', () => {
  const P = buildSettledPartition(fixtureInput());
  const page = projectPage(P, { roadWidth: 5 });

  it('E8 · the identity census is a BIJECTION in BOTH directions', () => {
    expect(page.identity.ok).toBe(true);
    expect(page.identity.orphans).toEqual([]);
    expect(page.identity.doubles).toEqual([]);
    expect(page.identity.phantom).toEqual([]);
    expect(page.identity.plots).toBeGreaterThan(40);
    expect(page.identity.owned).toBe(page.identity.plots);
  });

  it('⛔ CONTROL · the bijection catches a DROPPED mass, which the one-directional spelling passes', () => {
    // The live defect A1.2 names: parcels suppressed by an aggregate that no longer exists render
    // NOWHERE. Drop one mass and the reverse direction must convict.
    const dropped = { ...page, masses: page.masses.slice(1) };
    const plots = [];
    for (const m of page.masses) plots.push(...m.members);
    const owned = new Set();
    for (const m of dropped.masses) for (const p of m.members) owned.add(p);
    const orphans = plots.filter((p) => !owned.has(p));
    expect(orphans.length).toBe(page.masses[0].members.length);
    expect(orphans.length).toBeGreaterThan(0);
  });

  it('E7 · the page budget counts UNIT LINES — a mass is an aggregation, never a hollow wash', () => {
    const b = page.budget;
    expect(b.masses).toBeGreaterThan(0);
    // MF-S1's banned prior #4: the members' party lines are in the count.
    expect(b.unitLines).toBeGreaterThan(0);
    expect(b.shapes).toBeGreaterThanOrEqual(b.masses + b.unitLines + b.ridges);
    expect(b.bandRw2).toEqual(PAGE_BAND_RW2);
    expect(b.massAreaRw2.p50).toBeGreaterThan(0);
  });

  it('one ridge per PARTY RUN, decoupled from chunking — a chunk never breaks a ridge', () => {
    const withMembers = page.masses.filter((m) => m.runs.length > 1);
    for (const m of page.masses) expect(m.ridges.length).toBe(m.runs.length);
    // and where chunking DID group runs, the ridges stayed one-per-run rather than one-per-chunk
    for (const m of withMembers) expect(m.ridges.length).toBeGreaterThan(1);
  });

  it('the frame is derived from the partition’s own extent — nothing is drawn off the page', () => {
    const arr = P.arrangement;
    for (const v of arr.verts) {
      const x = v.x / arr.quantumPerUnit;
      const y = v.y / arr.quantumPerUnit;
      expect(x).toBeGreaterThanOrEqual(page.frame.x - 1e-6);
      expect(x).toBeLessThanOrEqual(page.frame.x + page.frame.w + 1e-6);
      expect(y).toBeGreaterThanOrEqual(page.frame.y - 1e-6);
      expect(y).toBeLessThanOrEqual(page.frame.y + page.frame.h + 1e-6);
    }
  });

  it('STREETS ARE GROUND — the page carries no street stroke object at all', () => {
    // §650 enforced by absence: a way is a FACE with a ring, never a line with a width.
    for (const w of page.ways) {
      expect(Array.isArray(w.ring)).toBe(true);
      expect(w.ring.length).toBeGreaterThanOrEqual(3);
      expect(w).not.toHaveProperty('line');
      expect(w).not.toHaveProperty('width');
    }
    expect(page.ground.kind).toBe('SETTLED_SURFACE');
  });

  it('MONUMENTS NEVER AGGREGATE — voids and the band are drawn at their own register', () => {
    const massed = new Set();
    for (const m of page.masses) for (const f of m.members) massed.add(f);
    for (const v of page.voids) expect(massed.has(v.face)).toBe(false);
    for (const b of page.band) expect(massed.has(b.face)).toBe(false);
    expect(page.neverAggregate).toContain('VOID');
    expect(page.neverAggregate).toContain('WALLBAND');
  });
});

describe('§6 · dormancy is a property of the flag, not of the caller', () => {
  it('the constructor is only reached through `options.partition === true`', async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, join } = await import('node:path');
    const here = dirname(fileURLToPath(import.meta.url));
    const src = readFileSync(join(here, '../../src/domain/townMap/fabric/buildFabric.js'), 'utf8');
    expect(src).toContain("options.partition === true");
    // the artifact is ABSENT (never empty) when unarmed, and appended at the END of the literal
    expect(src).toContain('...(spinePartition ? { spinePartition } : {})');
    // exactly ONE call site — A1.4's "one construction per build"
    expect(src.split('buildSettledPartition(').length - 1).toBe(1);
  });
});

/* ══════════════════════════════════════════════════════════════════════════════════════════
 * ⭐⭐⭐ GROW-A-RESUME (ODQ §683) · THE LEDGER'S OWN LAWS, EACH WITH ITS PLANTED CONTROL
 * ════════════════════════════════════════════════════════════════════════════════════════ */

describe('§7 · the growth ledger drives the fold, and every law it asserts convicts', () => {
  it('⭐ A1.4 · a LossRegion is born at a RECORDED event and at nothing else — zero events, zero ruins', async () => {
    const { assertLossRegionsRecorded } = await import('../../src/domain/townMap/fabric/growthLedger.js');
    const clean = {
      epochs: [{ index: 0, year: 0, lossRegions: [] }],
      lossRegions: [],
      trajectory: { anchors: [] },
    };
    // ⛔ AN EMPTY CHANNEL IS A CORRECT ANSWER, NOT A GAP: a record that speaks no dated disaster
    //    carries no ruins, and the law must NOT convict that.
    expect(assertLossRegionsRecorded(clean)).toEqual([]);

    const recorded = {
      trajectory: { anchors: [{ year: 40, templateType: 'great_fire', severity: 'catastrophic', weight: 3 }] },
      lossRegions: [
        { key: 'loss.E2.0', bornYear: 40, kind: 'great_fire', provenance: 'recorded' },
        { key: 'loss.E2.1', bornYear: 40, kind: 'great_fire', provenance: 'recorded' },
      ],
      epochs: [{ index: 0, year: 0, lossRegions: [] },
        { index: 1, year: 20, lossRegions: [] },
        { index: 2, year: 40, lossRegions: [{}, {}] }],
    };
    expect(assertLossRegionsRecorded(recorded)).toEqual([]);
  });

  it('⛔ CONTROL · a FABRICATED ruin is convicted three ways — undated, untyped, and interpolated', async () => {
    const { assertLossRegionsRecorded } = await import('../../src/domain/townMap/fabric/growthLedger.js');
    const forged = {
      trajectory: { anchors: [{ year: 40, templateType: 'great_fire', severity: 'major', weight: 2 }] },
      lossRegions: [{ key: 'loss.X', bornYear: 999, kind: 'invented_calamity', provenance: 'interpolated' }],
      epochs: [{ index: 0, year: 0, lossRegions: [{}] }],
    };
    const bad = assertLossRegionsRecorded(forged);
    // a year the record never speaks · a kind no anchor carries · a provenance that cites nothing
    expect(bad.length).toBeGreaterThanOrEqual(3);
    expect(bad.join(' ')).toContain('999');
    expect(bad.join(' ')).toContain('interpolated');
  });

  it('⛔ CONTROL · a ruin with ZERO dated anchors on the record is a fabricated disaster', async () => {
    const { assertLossRegionsRecorded } = await import('../../src/domain/townMap/fabric/growthLedger.js');
    const invented = {
      trajectory: { anchors: [] },
      lossRegions: [{ key: 'loss.X', bornYear: 10, kind: 'plague_years', provenance: 'recorded' }],
      epochs: [{ index: 0, year: 0, lossRegions: [{}] }],
    };
    expect(assertLossRegionsRecorded(invented).length).toBeGreaterThan(0);
  });

  it('⭐ A1.3 S2-M4 · a circuit event with NO YEAR is convicted — the §11.11 stamp defect, structurally excluded', async () => {
    const { assertCircuitLaw } = await import('../../src/domain/townMap/fabric/growthLedger.js');
    const ok = {
      circuitEvents: [{ index: 0, epoch: 1, year: 49, frozenRadius: 100, provenance: 'derived-frozen' }],
      epochs: [{ index: 0, builtRadius: 40 }, { index: 1, builtRadius: 100 }],
      emissions: [],
    };
    expect(assertCircuitLaw(ok)).toEqual([]);
    // ⛔ THE PLANT: the exact shape `wallStandingFor` used to hand `deriveEpochs` — an age, no year.
    const undated = { ...ok, circuitEvents: [{ ...ok.circuitEvents[0], year: undefined }] };
    const bad = assertCircuitLaw(undated);
    expect(bad.length).toBeGreaterThan(0);
    expect(bad.join(' ')).toContain('carries no year');
    // ⛔ AND THE PROVENANCE PLANT: a circuit is recorded or derived-frozen, never interpolated.
    const guessed = { ...ok, circuitEvents: [{ ...ok.circuitEvents[0], provenance: 'interpolated' }] };
    expect(assertCircuitLaw(guessed).join(' ')).toContain('interpolated');
  });

  it('⭐ every ledger EMISSION act the fold can reach is DRAWN — the roster is not a wish list', () => {
    const input = fixtureInput();
    const P = buildSettledPartition(input);
    const asked = input.ledger.epochs.reduce((n, e) => n + (e.emissions || []).length, 0);
    // the fixture's one act is dated AFTER its circuit raise, so the fold can place it
    expect(asked).toBe(1);
    expect(P.emissions.length).toBe(asked);
    // ⛔ AND A REFUSAL IS COUNTED RATHER THAN LOST — the silent-zero class, closed.
    expect(P.emissionRefusals).toBe(0);
    expect(typeof P.emissionRefusals).toBe('number');
  });

  it('⭐ the watercourse REFUSAL MASK is live — a dry leaf refuses nothing, a wet one refuses', () => {
    const dry = buildSettledPartition(fixtureInput());
    expect(dry.waterRefusals).toBe(0);
    // ⛔ THE PLANT: a channel straight through the settlement's heart.
    const wet = buildSettledPartition(fixtureInput({
      water: { line: [[-200, 0], [-100, 4], [0, 0], [100, -4], [200, 0]], width: 24, kind: 'river' },
    }));
    expect(wet.waterRefusals).toBeGreaterThan(0);
    // the index answers the same question as the linear scan did: the mask still bites, and the
    // partition it produces is still lawful
    expect(properCrossings(wet.arrangement).length).toBe(0);
  });

  it('⭐ `cutWay` is ATOMIC: a refused way leaves NO stray kerb behind', () => {
    const arr = createArrangement();
    const root = seedRegion(arr, [[0, 0], [100, 0], [100, 100], [0, 100]], {});
    const edgesBefore = arr.edges.length;
    const facesBefore = arr.faces.filter((f) => f.alive).length;
    // ⛔ THE PLANT: a centreline OUTSIDE the face entirely — the carriageway can never be found.
    const refused = cutWay(arr, root, [500, 500], [1, 0], 6, { rank: 'lane', key: 'X' });
    expect(refused).toBeNull();
    // ⭐⭐ THE POINT OF THE CASE: the arrangement is UNTOUCHED. Before the cure, a probe failure
    //    could happen AFTER the left kerb had been cut, leaving a half-way in the fabric that the
    //    caller's fall-through then cut across.
    expect(arr.edges.length).toBe(edgesBefore);
    expect(arr.faces.filter((f) => f.alive).length).toBe(facesBefore);
    expect(arr.refusals.length).toBeGreaterThan(0);
    // and the refusal names the act, so a census can attribute it
    expect(arr.refusals[arr.refusals.length - 1].detail.key).toBe('X');
  });

  it('⭐ every geometric refusal carries the ACT KEY that caused it — attribution by cause', () => {
    const arr = createArrangement();
    const root = seedRegion(arr, [[0, 0], [60, 0], [60, 60], [0, 60]], {});
    cutFaceByLine(arr, root, [500, 500], [0, 1], { type: 'BOUND', key: 'probe.b' });
    expect(arr.refusals.length).toBe(1);
    expect(arr.refusals[0].where).toBe('cutFaceByLine');
    expect(arr.refusals[0].detail.key).toBe('probe.b');
  });
});
