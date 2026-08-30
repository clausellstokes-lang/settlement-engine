/**
 * spatialDigest.invariants.test.js — Phase 5.5 KEYSTONE, the pure-module invariant
 * suite (§V.5). These tests ARE half the deliverable: a wrong digest is worse than
 * a late one, so the determinism / locality / freezing properties are pinned
 * up front and gate every downstream spatial wave.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  buildSpatialDigest,
  COST_LAW_VERSION,
  SPATIAL_GEOMETRY_VERSION,
  OVERLAY_VERSION,
  CAPTURE_RECEIPT_VERSION,
  CONFIG_TERRAIN_CLASSES,
  nearestCellTo,
  normalizeSpatialPack,
  CLIMATE_BAND_VERSION,
  CLIMATE_BANDS,
  climateBandOf,
  LAKE_TYPOLOGY_VERSION,
  LAKE_SUBTYPES,
  deriveLakes,
  TERRAIN_AGREEMENT_VERDICTS,
  terrainAgreement,
  terrainClassOf,
} from '../../src/domain/spatial/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import {
  makeGridPack,
  placeSettlements,
  placePortSettlements,
  placeTeleportSettlements,
  makeTiePack,
  makeIslandPack,
  makeDisconnectedWaterPack,
  makeIsthmusPack,
  makePortCoastPack,
  makeLakePack,
} from '../fixtures/spatialPackFixtures.js';

const RESERVED = { airField: null, seaLanes: null, seasonalOverlay: null, teleportEdges: null };
/** The cell a fixture placement sits on, by settlement id (CAP-3 audits the band per seed). */
const placementCellOf = (placements, id) => Number(placements.find((p) => String(p.id) === String(id)).cellId);
const ownerId = (d, cell) => (d.territory[cell] >= 0 ? d.settlementIds[d.territory[cell]] : null);

describe('KEYSTONE invariants — determinism', () => {
  it('same pack + same placements ⇒ byte-identical digest across two extractions', () => {
    const pack = makeGridPack({ cols: 22, rows: 18 });
    const placements = placeSettlements(pack, 12);
    const a = JSON.stringify(buildSpatialDigest({ pack, placements }));
    const b = JSON.stringify(buildSpatialDigest({ pack, placements }));
    expect(a).toBe(b);
  });

  it('placement ORDER does not matter — the digest sorts seeds by id', () => {
    const pack = makeGridPack({ cols: 16, rows: 14 });
    const placements = placeSettlements(pack, 8);
    const shuffled = [...placements].reverse();
    const a = JSON.stringify(buildSpatialDigest({ pack, placements }));
    const b = JSON.stringify(buildSpatialDigest({ pack, placements: shuffled }));
    expect(a).toBe(b);
  });

  it('the version axes + reserved slots are schema-present', () => {
    const pack = makeGridPack({ cols: 12, rows: 10 });
    const d = buildSpatialDigest({ pack, placements: placeSettlements(pack, 4) });
    expect(d.spatialGeometryVersion).toBe(SPATIAL_GEOMETRY_VERSION);
    expect(d.costLawVersion).toBe(COST_LAW_VERSION);
    expect(d.overlayVersion).toBe(OVERLAY_VERSION);
    // Four reserved null slots, exact shape (materializing waves can't schema-break).
    expect(d.reserved).toEqual(RESERVED);
    expect(Object.keys(d.reserved).sort()).toEqual(['airField', 'seaLanes', 'seasonalOverlay', 'teleportEdges']);
  });
});

describe('KEYSTONE invariants — stable tie-breaks', () => {
  it('resolves an EXACT equal-cost tie deterministically (equal tentative ⇒ lower predecessor)', () => {
    const { pack, placements, middleCell } = makeTiePack();
    const d1 = buildSpatialDigest({ pack, placements });
    const d2 = buildSpatialDigest({ pack, placements });
    // The exact-middle cell is equidistant from both ends; it must be assigned
    // and identical across builds.
    expect(ownerId(d1, middleCell)).not.toBeNull();
    expect(ownerId(d1, middleCell)).toBe(ownerId(d2, middleCell));
    // The two flanking cells go to their nearer settlement (sanity on the field).
    expect(ownerId(d1, 1)).toBe('left');
    expect(ownerId(d1, 5)).toBe('right');
  });
});

describe('KEYSTONE invariants — Voronoi locality (adding an unrelated settlement)', () => {
  it('adding a settlement only STEALS cells into its own territory — no existing-to-existing flip', () => {
    const pack = makeGridPack({ cols: 26, rows: 20 });
    const placements = placeSettlements(pack, 10);
    // A far-corner extra settlement (id sorts last so base indices are stable —
    // but we compare by RESOLVED id, so index shifts would not fool the test).
    const H = pack.cells.h;
    const cols = pack.meta.cols; const rows = pack.meta.rows;
    let corner = -1;
    for (let row = rows - 1; row >= 0 && corner < 0; row--) {
      const i = row * cols + (cols - 1);
      if (H[i] >= 20 && H[i] <= 60) corner = i;
    }
    const extra = { id: 'zzz_extra', cellId: corner };
    const base = buildSpatialDigest({ pack, placements });
    const withExtra = buildSpatialDigest({ pack, placements: [...placements, extra] });

    let changed = 0;
    for (let cell = 0; cell < base.cellCount; cell++) {
      const before = ownerId(base, cell);
      const after = ownerId(withExtra, cell);
      if (before === after) continue;
      changed++;
      // The ONLY ownership changes are cells captured BY the new settlement.
      expect(after).toBe('zzz_extra');
    }
    // The property is non-vacuous: the new settlement actually took some cells.
    expect(changed).toBeGreaterThan(0);
  });

  it('a gate + primary distance between settlements FAR from the new one is byte-identical', () => {
    // Voronoi territories tile the whole map, so a new site always borders
    // SOMEONE — but a boundary FAR from the new site is untouched (the new site
    // captures only cells near itself). So a gate between two settlements neither
    // of which borders the far-corner extra is byte-identical, and their primary
    // distance is frozen. This is "routes unchanged outside its neighbourhood".
    const pack = makeGridPack({ cols: 26, rows: 20 });
    const placements = placeSettlements(pack, 10);
    const H = pack.cells.h; const cols = pack.meta.cols; const rows = pack.meta.rows;
    let corner = -1;
    for (let row = rows - 1; row >= 0 && corner < 0; row--) {
      const i = row * cols + (cols - 1);
      if (H[i] >= 20 && H[i] <= 60) corner = i;
    }
    const extra = { id: 'zzz_extra', cellId: corner };
    const base = buildSpatialDigest({ pack, placements });
    const withExtra = buildSpatialDigest({ pack, placements: [...placements, extra] });
    // The extra's direct territory-neighbours (the only distances it can perturb).
    const extraNbrs = new Set(Object.keys(withExtra.tiers.zzz_extra || {})
      .filter(id => withExtra.tiers.zzz_extra[id] === 1));
    // A base gate whose BOTH endpoints are far from the extra (non-neighbours).
    const farGate = base.gates.find(g => !extraNbrs.has(g.between[0]) && !extraNbrs.has(g.between[1]));
    expect(farGate).toBeTruthy();
    const [X, Y] = farGate.between;
    // That gate exists byte-identically in the with-extra digest (same boundary).
    const afterGate = withExtra.gates.find(g => g.between[0] === X && g.between[1] === Y);
    expect(afterGate).toEqual(farGate);
    // …and their primary distance is frozen.
    expect(withExtra.distanceMatrix[X]?.[Y]).toBe(base.distanceMatrix[X]?.[Y]);
  });
});

describe('KEYSTONE invariants — version-axis FREEZING', () => {
  it('a stored digest is frozen: a costLawVersion change does NOT re-derive it — only re-canonize does', () => {
    const pack = makeGridPack({ cols: 16, rows: 12 });
    const placements = placeSettlements(pack, 6);
    // A digest frozen under (geometry 1, cost-law 1).
    const frozen = buildSpatialDigest({ pack, placements, costLawVersion: 1 });
    // The cost law "changes" (a NEW build under cost-law 2 differs) — the axis is
    // meaningful, not cosmetic.
    const rebuilt = buildSpatialDigest({ pack, placements, costLawVersion: 2 });
    expect(rebuilt.costLawVersion).toBe(2);
    expect(JSON.stringify(rebuilt)).not.toBe(JSON.stringify(frozen));

    // But a stored world carrying the frozen digest survives a load UNCHANGED —
    // ensureWorldState deep-clones the canon data, never recomputes it. So the
    // installed base does not drift when the module's cost law advances.
    const ws = ensureWorldState({
      rngSeed: 'freeze', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z',
      spatialCanonVersion: 1, spatialDigest: frozen,
    });
    expect(ws.spatialCanonVersion).toBe(1);
    expect(ws.spatialDigest.costLawVersion).toBe(1);
    expect(JSON.stringify(ws.spatialDigest)).toBe(JSON.stringify(frozen));
    // Idempotent re-load — still frozen, still byte-identical.
    const ws2 = ensureWorldState(ws);
    expect(JSON.stringify(ws2.spatialDigest)).toBe(JSON.stringify(frozen));
  });
});

describe('KEYSTONE invariants — the domain stays TIER-BLIND', () => {
  it('no tier / auth / entitlement / premium read anywhere under src/domain/spatial', () => {
    const here = dirname(fileURLToPath(import.meta.url));
    const dir = resolve(here, '../../src/domain/spatial');
    const files = readdirSync(dir).filter(f => f.endsWith('.js'));
    expect(files.length).toBeGreaterThan(0);
    const forbidden = /\b(tier|premium|entitle|entitled|entitlement|auth|isPremium|subscription)\b/;
    for (const f of files) {
      const src = readFileSync(join(dir, f), 'utf-8');
      // Strip line comments so a doc mention ("the domain stays tier-blind")
      // doesn't false-positive; assert no CODE reads a tier/auth signal.
      const code = src.split('\n').map(l => l.replace(/\/\/.*$/, '')).join('\n')
        .replace(/\/\*[\s\S]*?\*\//g, '');
      expect(forbidden.test(code), `${f} must not read tier/auth`).toBe(false);
    }
  });
});

describe('KEYSTONE — digest SIZE report (5 / 15 / 30 settlements, ~8k-cell map)', () => {
  it('stays well under the ~200KB save-bloat ruling at every settlement count', () => {
    const pack = makeGridPack({ cols: 100, rows: 80 }); // ~8000 cells ≈ a real map
    for (const N of [5, 15, 30]) {
      const d = buildSpatialDigest({ pack, placements: placeSettlements(pack, N) });
      const bytes = JSON.stringify(d).length;
      console.log(`[KEYSTONE size] N=${String(N).padStart(2)}  ${(bytes / 1024).toFixed(1)}KB  (cells=${d.cellCount}, land=${d.landCellCount})`);
      expect(bytes).toBeLessThan(200_000);
    }
  });
});

// ─── W-SEAM SEAM-1 ────────────────────────────────────────────────────────────

describe('SEAM-1 (S3) — terrainAgreement, the mapping the two vocabularies were missing', () => {
  // The engine speaks plains|hills|forest|riverside|coastal|mountain|desert; the map
  // speaks water|desert|grassland|forest|wetland|tundra|glacier|mountain. Nothing
  // could compare them before, so a settlement's declared terrain and the ground
  // under it could disagree forever, silently.
  const packOf = (h, biome, r, c) => ({ h, biome, r, c, cellCount: h.length });
  // Two cells, mutual neighbours. Cell 0 is the subject; cell 1 is the context that
  // makes it coastal (ocean) or inland (land).
  const inland = (h0, b0, r0) => packOf([h0, 40], [b0, 4], [r0, 0], [[1], [0]]);
  const shore = (h0, b0, r0) => packOf([h0, 10], [b0, 4], [r0, 0], [[1], [0]]);

  it('confirms a declared terrain the ground agrees with', () => {
    expect(terrainAgreement('plains', inland(40, 4, 0), 0)).toBe('agrees');
    expect(terrainAgreement('forest', inland(40, 6, 0), 0)).toBe('agrees');
    expect(terrainAgreement('desert', inland(40, 1, 0), 0)).toBe('agrees');
    expect(terrainAgreement('mountain', inland(78, 4, 0), 0)).toBe('agrees');
  });

  it('contradicts a declared terrain the ground refutes, counterpart by counterpart', () => {
    expect(terrainAgreement('plains', inland(40, 6, 0), 0)).toBe('disagrees');   // a forest
    expect(terrainAgreement('forest', inland(40, 4, 0), 0)).toBe('disagrees');   // grassland
    expect(terrainAgreement('desert', inland(40, 6, 0), 0)).toBe('disagrees');   // a forest
    expect(terrainAgreement('mountain', inland(40, 4, 0), 0)).toBe('disagrees'); // flat
  });

  it('says a settlement standing in the sea disagrees with every land terrain it could declare', () => {
    for (const declared of CONFIG_TERRAIN_CLASSES) {
      expect(terrainAgreement(declared, inland(10, 4, 0), 0), declared).toBe('disagrees');
    }
  });

  it('decides coastal and riverside by the water reads, not by the class table', () => {
    // THE repro from the seam report: a `coastal` settlement dropped mid-plain is fed
    // as a port by the economy forever while the sea-lane derivation reads coastal:false.
    expect(terrainAgreement('coastal', shore(40, 4, 0), 0)).toBe('agrees');
    expect(terrainAgreement('coastal', inland(40, 4, 0), 0)).toBe('disagrees');
    expect(terrainAgreement('riverside', inland(40, 4, 1), 0)).toBe('agrees');
    expect(terrainAgreement('riverside', inland(40, 4, 0), 0)).toBe('disagrees');
    // The two are independent: a river cell away from any shore is NOT coastal.
    expect(terrainAgreement('coastal', inland(40, 4, 1), 0)).toBe('disagrees');
  });

  it('answers unknown where the two vocabularies genuinely cannot speak, and never guesses', () => {
    // terrainClassOf has NO hills class — relief between LAND_HEIGHT and the mountain
    // knee is invisible to it, so claiming either verdict would invent a comparison.
    expect(terrainAgreement('hills', inland(45, 4, 0), 0)).toBe('unknown');
    // Classes with no config counterpart stay silent rather than manufacturing a fault.
    expect(terrainAgreement('plains', inland(40, 12, 0), 0)).toBe('unknown'); // wetland
    expect(terrainAgreement('plains', inland(40, 10, 0), 0)).toBe('unknown'); // tundra
    // A word the config vocabulary does not contain is never scored (finite semantics).
    expect(terrainAgreement('swamp', inland(40, 4, 0), 0)).toBe('unknown');
    expect(terrainAgreement(null, inland(40, 4, 0), 0)).toBe('unknown');
    expect(terrainAgreement('auto', inland(40, 4, 0), 0)).toBe('unknown');
    // Off the map is not a disagreement — resolveSeeds already reports that as off_map.
    expect(terrainAgreement('plains', inland(40, 4, 0), 99)).toBe('unknown');
    expect(terrainAgreement('plains', inland(40, 4, 0), 1.5)).toBe('unknown');
  });

  it('is TOTAL over the config vocabulary — every word has a verdict, none throws', () => {
    for (const declared of CONFIG_TERRAIN_CLASSES) {
      const verdict = terrainAgreement(declared, inland(40, 4, 0), 0);
      expect(TERRAIN_AGREEMENT_VERDICTS, declared).toContain(verdict);
    }
  });
});

describe('SEAM-1 — the additive capture receipt is ABSENT unless there is something to report', () => {
  it('omits the key entirely when no placement declares a terrain', () => {
    const pack = makeGridPack({ cols: 16, rows: 14 });
    const d = buildSpatialDigest({ pack, placements: placeSettlements(pack, 6) });
    expect('captureReceipt' in d).toBe(false);
  });

  it('omits the key when every declared terrain agrees with the ground', () => {
    const pack = makeGridPack({ cols: 16, rows: 14 });
    const placements = placeSettlements(pack, 6).map(p => ({
      ...p,
      // The grid's land cells are grassland/desert/forest/wetland by quadrant; ask each
      // seed for the class it is actually on, so every row agrees by construction.
      terrainType: terrainClassOf(pack.cells.h[p.cellId], pack.cells.biome[p.cellId]) === 'grassland'
        ? 'plains' : terrainClassOf(pack.cells.h[p.cellId], pack.cells.biome[p.cellId]),
    })).filter(p => ['plains', 'forest', 'desert', 'mountain'].includes(p.terrainType));
    const d = buildSpatialDigest({ pack, placements });
    const disagreements = (d.captureReceipt?.terrainDisagreements) || [];
    expect(disagreements).toEqual([]);
  });

  it('records the disagreement, in id order, with both truths named', () => {
    const pack = makeGridPack({ cols: 16, rows: 14 });
    const base = placeSettlements(pack, 4);
    // Declare every one a mountain settlement; the grid seats them on non-mountain land.
    const placements = base.map(p => ({ ...p, terrainType: 'mountain' }));
    const d = buildSpatialDigest({ pack, placements });
    expect(d.captureReceipt.version).toBe(CAPTURE_RECEIPT_VERSION);
    expect(d.captureReceipt.terrainDisagreements.length).toBe(base.length);
    const ids = d.captureReceipt.terrainDisagreements.map(r => r.id);
    expect(ids).toEqual([...ids].sort());
    for (const row of d.captureReceipt.terrainDisagreements) {
      expect(row.configTerrain).toBe('mountain');
      expect(row.mapTerrain).not.toBe('mountain');
    }
  });

  it('never rewrites the settlement terrain — the receipt reports, it does not repair', () => {
    const pack = makeGridPack({ cols: 12, rows: 10 });
    const placements = placeSettlements(pack, 3).map(p => ({ ...p, terrainType: 'mountain' }));
    const before = JSON.stringify(placements);
    buildSpatialDigest({ pack, placements });
    expect(JSON.stringify(placements)).toBe(before);
  });
});

describe('SEAM-1 — RAW-BYTE dormancy: no existing canon moves a byte', () => {
  // §713.2 — a dormancy claim is a BIT claim, and the honest comparator is
  // base-dormant vs tip-dormant over the SAME fixtures. These nine sha256s were
  // measured against pristine 73f5dfc02 (the build tip this seam branched from) by
  // building each fixture digest with node and hashing JSON.stringify of the result.
  // Every one is reproduced here at the tip. A hash that moves means an existing
  // canon's bytes moved — which is a defect, not a re-record, unless the act that
  // moved it declares the cause.
  // ── RE-RECORDED BY W-CAP CAP-2 (river navigability), 2026-08-29 — A DECLARED SHIFT ──
  // FIVE of the nine moved and FOUR did not, and the split is the proof rather than a
  // coincidence: exactly the five whose fixtures actually LIGHT the seaLanes slot moved,
  // because CAP-2 stamps SEA_LANE_VERSION 2 there. The four unmoved ones keep their
  // ORIGINAL sha character for character — grid22x18-12-plain and tie carry no sea lanes
  // at all, grid24x18-teleport's placements hold circles rather than docks, and
  // grid22x18-12-allslots opts INTO seaLanes but has no dock-carrying settlement, so its
  // slot is null. A version bump that had leaked anywhere else would have moved one of
  // those four.
  // ⭐ AND THE SHIFT IS PINNED AT LEAF GRANULARITY, not merely at the hash. An instrument
  // built every fixture pack × every opt-in combination the production canonize uses (44
  // digests) at base and at tip and diffed them leaf by leaf. Across ALL 18 moved cases the
  // complete set of differing leaves is ONE:
  //     .reserved.seaLanes.version   1 -> 2
  // Not one port, edge, cost, gate or geometry byte moved. The port/edge COUNTS are
  // likewise unchanged (grid24x18-ports still 5 ports / 4 edges) — which is expected, since
  // these fixture packs carry no captured flux, every river band therefore reads `unknown`,
  // and the amended rule collapses to the pre-CAP `r != 0` verdict exactly.
  // ⚠ THE FROZEN CANONS DO NOT MOVE AT ALL. A canon's seaLanes slot is authored ONCE at
  // canonize and never recomputed (freeze-first), so an existing campaign keeps its v1 slot
  // and its v1 port verdicts forever. This re-record describes what a NEW canonize builds.
  const EXPECTED = Object.freeze({
    'grid22x18-12-plain': '437a47ef780ac6b156ec8cfed27448d0f0bff1e41b4b25ff0559b50a5f446ddb',
    'grid22x18-12-allslots': '324d68b0161a3bd79ebd66b053844708310f72537e3f7cd0ae6022d034b10f39',
    'grid24x18-ports': '099a24e51cb7201a1b38a96ff9df65259a7f6bc0b22d4b8496aedce949d8e703',
    'grid24x18-teleport': '65f7181ad1d435577586613dabc5c0ce4f9b0ce863a3e18a242724a9e1cd57dc',
    island: 'c6d084e03616c83c280a1369c57e04f6d66762b2f6adf312ca5db45f5302272f',
    'disconnected-water': '2b5037c4ebf88c8d91a2c3a5cd4d936d84852e53b9ee490da5445e2236c4352e',
    isthmus: '640e35bc67e427f4d4e70f32a4932e52cb4fef77b75b58391a833c9087f6dfce',
    tie: 'c27487d0b8e1264eca7932af948710f6a7c421d785c58f59762ee39f3cd92c10',
    'port-coast-20': '783221edbc4c809cf7cec8fd8f21263bc8b8355301ae97a0d7c178c3e6f42cf5',
  });
  const sha = v => createHash('sha256').update(JSON.stringify(v)).digest('hex');

  it('reproduces every pre-SEAM fixture digest byte for byte', () => {
    /** @type {Record<string, unknown>} */
    const built = {};
    const g22 = makeGridPack({ cols: 22, rows: 18 });
    built['grid22x18-12-plain'] = buildSpatialDigest({ pack: g22, placements: placeSettlements(g22, 12) });
    built['grid22x18-12-allslots'] = buildSpatialDigest({
      pack: g22, placements: placeSettlements(g22, 12),
      seasonalRoads: true, seaLanes: true, teleport: true, biomeTexture: true,
    });
    const g24 = makeGridPack({ cols: 24, rows: 18 });
    built['grid24x18-ports'] = buildSpatialDigest({
      pack: g24, placements: placePortSettlements(g24, { nCoastal: 3, nRiver: 2, nInland: 3 }),
      seasonalRoads: true, seaLanes: true, teleport: true,
    });
    built['grid24x18-teleport'] = buildSpatialDigest({
      pack: g24, placements: placeTeleportSettlements(g24, { nCircle: 3, nPlain: 4 }),
      seasonalRoads: true, seaLanes: true, teleport: true,
    });
    const isle = makeIslandPack();
    built.island = buildSpatialDigest({ pack: isle.pack, placements: isle.placements, seaLanes: true, seasonalRoads: true });
    const dw = makeDisconnectedWaterPack();
    built['disconnected-water'] = buildSpatialDigest({ pack: dw.pack, placements: dw.placements, seaLanes: true });
    const isth = makeIsthmusPack();
    built.isthmus = buildSpatialDigest({ pack: isth.pack, placements: isth.placements, seaLanes: true });
    const tie = makeTiePack();
    built.tie = buildSpatialDigest({ pack: tie.pack, placements: tie.placements });
    const pc = makePortCoastPack(20);
    built['port-coast-20'] = buildSpatialDigest({ pack: pc.pack, placements: pc.placements, seaLanes: true });

    for (const [name, expected] of Object.entries(EXPECTED)) {
      expect(sha(built[name]), `${name} digest bytes moved`).toBe(expected);
      expect('captureReceipt' in /** @type {any} */ (built[name]), `${name} grew a receipt key`).toBe(false);
    }
  });
});

describe('W-CAP CAP-1 — the widened capture surface SURVIVES NORMALIZE', () => {
  // D1's binding clause: normalizeSpatialPack SILENTLY DROPS every key it does not
  // name, so a capture field that reaches it unhandled is invisible rather than
  // broken. Every capture assertion in this program is therefore a SURVIVES-NORMALIZE
  // assertion — asserting the bridge emitted a field proves nothing about whether the
  // engine can read it.
  const captured = () => makeGridPack({ cols: 8, rows: 6, capture: true });

  it('fl / g / temp / prec all survive, and NEITHER count is driven by them', () => {
    const pack = captured();
    const n = normalizeSpatialPack(pack);
    expect(n.fl).toBe(pack.cells.fl);
    expect(n.g).toBe(pack.cells.g);
    expect(n.temp).toBe(pack.grid.temp);
    expect(n.prec).toBe(pack.grid.prec);
    // cellCount is still min(h, p, c) — the r/biome precedent. The new PACK arrays
    // do not shrink the map, and the GRID arrays are not even in that space.
    expect(n.cellCount).toBe(Math.min(pack.cells.h.length, pack.cells.p.length, pack.cells.c.length));
    expect(n.cellCount).toBe(8 * 6);
    // …and the grid denominator is its own, strictly coarser here (2:1 downsample).
    expect(n.gridCellCount).toBe(4 * 6);
    expect(n.gridCellCount).toBeLessThan(n.cellCount);
  });

  it('a RAGGED or ABSENT new array reads EMPTY and never truncates the map', () => {
    // The failure this forbids: a pack whose flux array is short (a partially-generated
    // river pass) silently shrinking cellCount, which would drop real cells out of the
    // territory partition — a canon-corrupting bug behind an optional field.
    const pack = captured();
    const ragged = { cells: { ...pack.cells, fl: [1, 2] }, grid: { temp: [1], prec: [] } };
    const n = normalizeSpatialPack(ragged);
    expect(n.cellCount).toBe(8 * 6);           // unchanged by the short flux array
    expect(n.gridCellCount).toBe(0);           // min(1, 0) — prec is empty
    const bare = normalizeSpatialPack({ cells: { h: [40], p: [[0, 0]], c: [[]] } });
    expect(bare.fl).toEqual([]);
    expect(bare.g).toEqual([]);
    expect(bare.temp).toEqual([]);
    expect(bare.prec).toEqual([]);
    expect(bare.gridCellCount).toBe(0);
    expect(bare.cellCount).toBe(1);
    // Non-array garbage in the new slots is normalized away, never propagated.
    const junk = normalizeSpatialPack({ cells: { h: [40], p: [[0, 0]], c: [[]], fl: 'nope', g: 7 }, grid: 5 });
    expect(junk.fl).toEqual([]);
    expect(junk.g).toEqual([]);
    expect(junk.temp).toEqual([]);
  });

  it('`g` is the ONLY bridge from pack space to grid space, and it lands in range', () => {
    // §711.6 — an undeclared unit acquires a different one at every consumer. The
    // fixture's grid space is deliberately COARSER than its pack space, so a reader
    // that indexed temp/prec with a PACK id would be reading another cell entirely;
    // under an identity mapping that mistake is invisible. This pins the contract the
    // climate consumers (CAP-3) must route through.
    const pack = captured();
    const n = normalizeSpatialPack(pack);
    expect(n.g.length).toBe(n.cellCount);
    for (let cell = 0; cell < n.cellCount; cell++) {
      expect(n.g[cell], `pack cell ${cell} maps into grid space`).toBeGreaterThanOrEqual(0);
      expect(n.g[cell]).toBeLessThan(n.gridCellCount);
    }
    // The mapping is genuinely many-to-one — otherwise this fixture could not catch
    // the confusion it exists to catch.
    expect(new Set(n.g).size).toBeLessThan(n.cellCount);
  });

  it('the capture opt-in is OFF by default — a default fixture pack is byte-identical', () => {
    // The fixture default is load-bearing: every pre-CAP digest in the estate is built
    // from this pack, and a pack that silently grew a flux array would light CAP-2's
    // navigability rule underneath suites that never asked for it.
    const plain = makeGridPack({ cols: 8, rows: 6 });
    expect('fl' in plain.cells).toBe(false);
    expect('g' in plain.cells).toBe(false);
    expect('grid' in plain).toBe(false);
    const n = normalizeSpatialPack(plain);
    expect(n.fl).toEqual([]);
    expect(n.gridCellCount).toBe(0);
    // The digest built from a capture-widened pack is byte-identical to the plain one:
    // CAP-1 carries the fields, it does not yet read them anywhere.
    const placements = placeSettlements(plain, 6);
    const widened = makeGridPack({ cols: 8, rows: 6, capture: true });
    expect(JSON.stringify(buildSpatialDigest({ pack: widened, placements })))
      .toBe(JSON.stringify(buildSpatialDigest({ pack: plain, placements })));
  });
});

describe('W-CAP CAP-3 — the CLIMATE BAND sub-digest (opt-in; dark ⇒ byte-identical)', () => {
  const captured = () => makeGridPack({ cols: 24, rows: 18, capture: true });

  it('OMITTED (default) ⇒ NO climate key ⇒ byte-identical to climateTexture:false', () => {
    const pack = captured();
    const placements = placeSettlements(pack, 8);
    const d = buildSpatialDigest({ pack, placements });
    expect('climate' in d).toBe(false);
    expect(JSON.stringify(d))
      .toBe(JSON.stringify(buildSpatialDigest({ pack, placements, climateTexture: false })));
  });

  it('lit ⇒ every seeded settlement carries a band from the CLOSED vocabulary + its readings', () => {
    const pack = captured();
    const placements = placeSettlements(pack, 8);
    const d = buildSpatialDigest({ pack, placements, climateTexture: true });
    expect(d.climate.version).toBe(CLIMATE_BAND_VERSION);
    for (const id of d.settlementIds) {
      const row = d.climate.bySettlement[id];
      expect(row, `settlement ${id} carries a climate row`).toBeTruthy();
      expect(CLIMATE_BANDS).toContain(row.band);
      // The raw readings ride along so a reader can AUDIT the verdict rather than trust it.
      expect(typeof row.temp).toBe('number');
      expect(typeof row.prec).toBe('number');
      expect(row.band).toBe(climateBandOf(normalizeSpatialPack(pack), placementCellOf(placements, id)));
    }
    // Deterministic extraction: a second build is byte-identical.
    expect(JSON.stringify(d.climate))
      .toBe(JSON.stringify(buildSpatialDigest({ pack, placements, climateTexture: true }).climate));
  });

  it('the band reads the GRID cell through `g`, never the pack cell directly', () => {
    // §711.6, the bug this whole capture shape exists to forbid. The fixture's grid space
    // is deliberately COARSER than its pack space (a 2:1 downsample), so indexing temp/prec
    // with a PACK id reads a DIFFERENT cell — and under an identity mapping that mistake
    // would be invisible. Here it is observable: the band must equal what the settlement's
    // own GRID row says, and the two disagree for most cells.
    const pack = captured();
    const n = normalizeSpatialPack(pack);
    let disagreements = 0;
    for (let cell = 0; cell < n.cellCount; cell++) {
      const viaG = n.temp[n.g[cell]];
      const viaPackId = n.temp[cell];
      if (viaG !== viaPackId) disagreements++;
    }
    expect(disagreements, 'the fixture must be able to catch a denominator confusion')
      .toBeGreaterThan(0);
    // …and the reading recorded for a settlement is the one via `g`.
    const placements = placeSettlements(pack, 4);
    const d = buildSpatialDigest({ pack, placements, climateTexture: true });
    for (const pl of placements) {
      const row = d.climate.bySettlement[String(pl.id)];
      if (!row) continue; // resolveSeeds legitimately dropped it
      expect(row.temp).toBe(n.temp[n.g[pl.cellId]]);
      expect(row.prec).toBe(n.prec[n.g[pl.cellId]]);
    }
  });

  it('an UNCAPTURED climate is typed `unknown`, never guessed', () => {
    // A1.2.14 mandates the word, and the point is that it is a verdict rather than a hole:
    // the pack simply carries no grid climate, and saying `standard` would be a fabrication.
    const plain = makeGridPack({ cols: 12, rows: 9 });          // no capture surface at all
    const placements = placeSettlements(plain, 4);
    const d = buildSpatialDigest({ pack: plain, placements, climateTexture: true });
    expect(d.climate.version).toBe(CLIMATE_BAND_VERSION);
    for (const id of d.settlementIds) {
      expect(d.climate.bySettlement[id]).toEqual({ band: 'unknown', temp: null, prec: null });
    }
    // A ragged grid array reaches the same honest answer rather than throwing.
    const ragged = { cells: { ...captured().cells }, grid: { temp: [1], prec: [] } };
    const r = buildSpatialDigest({ pack: ragged, placements: placeSettlements(captured(), 3), climateTexture: true });
    for (const id of r.settlementIds) expect(r.climate.bySettlement[id].band).toBe('unknown');
  });

  it('the cuts are FMG\'s own lines, and every band is reachable', () => {
    // Each constant is read out of FMG's `Biomes.getId`; the test states which line each
    // one is, so a later reader can check the claim rather than take it.
    const at = (temp, prec) => climateBandOf(
      { g: [0], temp: [temp], prec: [prec], gridCellCount: 1 }, 0,
    );
    expect(at(-6, 200)).toBe('harsh');   // FMG: temperature < -5 ⇒ Glacier
    expect(at(15, 4)).toBe('harsh');     // FMG: moisture band 0 (< 5) ⇒ the desert ROW
    expect(at(26, 7)).toBe('harsh');     // FMG: temp >= 25 && moisture < 8 ⇒ Hot desert
    expect(at(12, 40)).toBe('mild');     // temperate + wet: FMG's habitability-90 corner
    expect(at(30, 60)).toBe('mild');     // hot but WET is a rainforest, not a desert
    expect(at(10, 6)).toBe('standard');  // watered enough to live, not enough to be mild
    expect(at(0, 50)).toBe('standard');  // cold + wet (taiga): a growing year, unlike ice
    // The ordering is part of the law: harsh is decided first, so hot+dry beats temperate.
    expect(at(25, 7)).toBe('harsh');
    // ⚠ AND THE TWO MOISTURE CUTS ARE NOT THE SAME NUMBER — this arm exists because the
    // first draft of this test assumed they were. FMG's hot-desert predicate stops at
    // moisture 8; its "wet enough to leave the desert/savanna rows" band starts at 10. The
    // gap 8..9 is neither desert nor mild, and `standard` is the honest answer there.
    expect(at(25, 8)).toBe('standard');
    expect(at(25, 9)).toBe('standard');
    expect(at(25, 10)).toBe('mild');
    // An absent grid row is a verdict, not a throw.
    expect(climateBandOf({ g: [], temp: [], prec: [], gridCellCount: 0 }, 0)).toBe('unknown');
    expect(climateBandOf({ g: [99], temp: [1], prec: [1], gridCellCount: 1 }, 0)).toBe('unknown');
  });

  it('the climate key sits between `biomes` and `captureReceipt` — a FIXED shape', () => {
    const pack = captured();
    const placements = placeSettlements(pack, 6);
    const keys = Object.keys(buildSpatialDigest({
      pack, placements, biomeTexture: true, climateTexture: true,
    }));
    expect(keys.slice(-3)).toEqual(['reserved', 'biomes', 'climate']);
    // …and with biomes dark, climate still follows `reserved` directly.
    const lean = Object.keys(buildSpatialDigest({ pack, placements, climateTexture: true }));
    expect(lean.slice(-2)).toEqual(['reserved', 'climate']);
  });
});

describe('W-CAP CAP-4 — LAKE TYPOLOGY (opt-in; dark ⇒ byte-identical)', () => {
  it('OMITTED (default) ⇒ NO lakes key ⇒ byte-identical to lakes:false', () => {
    const pack = makeLakePack({});
    const placements = placeSettlements(pack, 6);
    const d = buildSpatialDigest({ pack, placements });
    expect('lakes' in d).toBe(false);
    expect(JSON.stringify(d)).toBe(JSON.stringify(buildSpatialDigest({ pack, placements, lakes: false })));
  });

  it('an INTERIOR body is a lake; a body touching the map frame is OCEAN and never appears', () => {
    // The whole distinction: both are connected `h < 20` components, and ONLY their
    // relationship to the map frame separates them. The fixture carries one of each.
    const pack = makeLakePack({});
    const lakes = deriveLakes(normalizeSpatialPack(pack));
    expect(lakes.version).toBe(LAKE_TYPOLOGY_VERSION);
    expect(lakes.bodies.length, 'exactly the interior blob — the ocean column is excluded').toBe(1);
    expect(lakes.bodies[0].cells).toBe(9);
    // …and the standard grid pack's ocean BAY reaches the frame, so it yields NO lakes at
    // all. Without this arm, "found a lake" could just mean "found water".
    expect(deriveLakes(normalizeSpatialPack(makeGridPack({ cols: 24, rows: 18 })))).toBeNull();
  });

  it('the shoreline is the LAND ring, and it is what a site consumer can join on', () => {
    const pack = makeLakePack({});
    const n = normalizeSpatialPack(pack);
    const body = deriveLakes(n).bodies[0];
    expect(body.shoreline.length).toBeGreaterThan(0);
    for (const cell of body.shoreline) {
      expect(n.h[cell], `shoreline cell ${cell} is LAND`).toBeGreaterThanOrEqual(20);
      // …and every shoreline cell actually touches the lake.
      expect(n.c[cell].some((v) => n.h[v] < 20)).toBe(true);
    }
    // Sorted + unique, so the frozen bytes are stable.
    expect(body.shoreline).toEqual([...new Set(body.shoreline)].sort((a, b) => a - b));
  });

  it('the subtype comes from FMG\'s water budget, and every band of the vocabulary is reachable', () => {
    const subtypeOf = (climate) => deriveLakes(normalizeSpatialPack(makeLakePack({ climate }))).bodies[0];
    expect(subtypeOf('temperate').subtype).toBe('freshwater');
    expect(subtypeOf('frozen').subtype).toBe('frozen');   // FMG: lake.temp < -3
    expect(subtypeOf('arid').subtype).toBe('dry');        // FMG: evaporation > flux * 4
    // …and the budget readings ride along, so the verdict is auditable rather than stated.
    const wet = subtypeOf('temperate');
    expect(typeof wet.temp).toBe('number');
    expect(typeof wet.flux).toBe('number');
    expect(typeof wet.evaporation).toBe('number');
    for (const body of [subtypeOf('temperate'), subtypeOf('frozen'), subtypeOf('arid')]) {
      expect(LAKE_SUBTYPES).toContain(body.subtype);
    }
    // ⛔ `salt` IS REFUSED and must stay refused: it needs FMG's river-DIRECTION topology
    // (`!outlet`), which the capture cannot carry, and emitting it would be a fabrication.
    expect(LAKE_SUBTYPES).not.toContain('salt'); // anchored: LAKE_SUBTYPES is asserted non-empty and its four members are each asserted reachable above, so this cannot pass against an empty list
  });

  it('an UNCAPTURED climate types the lake `unknown` — the A1.2.14 word, not a guess', () => {
    const bare = makeLakePack({ capture: false });
    const body = deriveLakes(normalizeSpatialPack(bare)).bodies[0];
    expect(body).toMatchObject({ subtype: 'unknown', temp: null, flux: null, evaporation: null });
    // The lake itself is still FOUND — geometry is captured even when climate is not, and
    // conflating "no climate" with "no lake" would lose real map truth.
    expect(body.cells).toBe(9);
    expect(body.shoreline.length).toBeGreaterThan(0);
  });

  it('the lakes key sits after `climate`, and the digest stays far under the size cap', () => {
    const pack = makeLakePack({});
    const placements = placeSettlements(pack, 6);
    const keys = Object.keys(buildSpatialDigest({
      pack, placements, biomeTexture: true, climateTexture: true, lakes: true,
    }));
    expect(keys.slice(-4)).toEqual(['reserved', 'biomes', 'climate', 'lakes']);
    // The charter's size ruling: ids + shoreline ids + subtype, never per-cell rosters.
    // A lake records its cell COUNT, not its cells.
    const lit = buildSpatialDigest({ pack, placements, lakes: true });
    expect('cells' in lit.lakes.bodies[0]).toBe(true);
    expect(typeof lit.lakes.bodies[0].cells).toBe('number');
    expect(JSON.stringify(lit).length).toBeLessThan(400_000); // the canonize hard cap
  });
});

describe('SEAM-2 — nearestCellTo, the ONE cell-resolution law', () => {
  // Amendment A1.2 §9 makes this the single resolution law for TWO consumers: the
  // capture's cell re-resolution and the territory view's flood seeds. Two
  // implementations would drift, so the spec is pinned here, not just the behaviour.
  const P = [[0, 0], [10, 0], [0, 10], [10, 10]];

  it('answers the nearest centroid', () => {
    expect(nearestCellTo(1, 1, P, P.length)).toBe(0);
    expect(nearestCellTo(9, 1, P, P.length)).toBe(1);
    expect(nearestCellTo(1, 9, P, P.length)).toBe(2);
    expect(nearestCellTo(9, 9, P, P.length)).toBe(3);
  });

  it('resolves an EXACT tie to the LOWEST index, matching the digest tie-break law', () => {
    // Dead centre: all four centroids are equidistant. A strict `<` keeps the first.
    expect(nearestCellTo(5, 5, P, P.length)).toBe(0);
    // A two-way tie on the top edge resolves to the earlier of the two.
    expect(nearestCellTo(5, 0, P, P.length)).toBe(0);
    // Order is the ONLY discriminator, so reversing the points reverses the answer —
    // which is what proves the rule is "first minimum", not "smallest index overall".
    expect(nearestCellTo(5, 5, [...P].reverse(), P.length)).toBe(0);
    expect(nearestCellTo(5, 0, [[10, 0], [0, 0]], 2)).toBe(0);
  });

  it('respects the cellCount bound so a ragged capture cannot resolve past it', () => {
    // Cell 3 is the true nearest, but the bound excludes it.
    expect(nearestCellTo(9, 9, P, 2)).toBe(1);
    expect(nearestCellTo(9, 9, P, 0)).toBeNull();
  });

  it('returns null rather than a fallback cell when there is nothing honest to answer', () => {
    expect(nearestCellTo(NaN, 1, P, P.length)).toBeNull();
    expect(nearestCellTo(1, undefined, P, P.length)).toBeNull();
    expect(nearestCellTo(1, 1, [], 0)).toBeNull();
    expect(nearestCellTo(1, 1, null, 4)).toBeNull();
    // A pack whose centroids are all unusable yields null, never index 0.
    expect(nearestCellTo(1, 1, [null, [NaN, 0]], 2)).toBeNull();
  });

  it('skips unusable centroids without letting them shift the answer', () => {
    expect(nearestCellTo(9, 9, [null, [10, 10], [0, 0]], 3)).toBe(1);
  });

  it('compares SQUARED distance — no sqrt, no hypot in the law itself', () => {
    // A structural guard, not a behavioural one: both are correctly rounded, so a
    // sqrt would not change today's answers — it would just add an operation two
    // consumers could round differently later. The spec says squared; pin the spec.
    const src = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../src/domain/spatial/spatialDigest.js'), 'utf-8');
    const body = src.slice(src.indexOf('export function nearestCellTo'));
    const fn = body.slice(0, body.indexOf('\n}\n') + 3);
    // The PRESENT half runs first and is the anchor for the two absent halves below:
    // if the slice ever stops being the real function body (renamed, moved, or the
    // slice arithmetic drifting), this line reds rather than letting the negatives
    // pass vacuously against an empty string.
    expect(fn).toContain('dx * dx + dy * dy');
    // anchored: the toContain above proves `fn` is the live nearestCellTo body
    expect(fn).not.toContain('Math.sqrt');
    // anchored: the toContain above proves `fn` is the live nearestCellTo body
    expect(fn).not.toContain('Math.hypot');
  });
});

describe('SEAM-2 — the cellResolution receipt rides the same additive envelope', () => {
  it('stays absent when the capture reports nothing', () => {
    const pack = makeGridPack({ cols: 12, rows: 10 });
    const d = buildSpatialDigest({ pack, placements: placeSettlements(pack, 4), cellResolution: [] });
    expect('captureReceipt' in d).toBe(false);
    const d2 = buildSpatialDigest({ pack, placements: placeSettlements(pack, 4), cellResolution: null });
    expect(JSON.stringify(d2)).toBe(JSON.stringify(d));
  });

  it('carries the rows verbatim, under the shared receipt version', () => {
    const pack = makeGridPack({ cols: 12, rows: 10 });
    const rows = [{ id: 's000', from: 3, to: 7, reason: 'cell_remapped' }];
    const d = buildSpatialDigest({ pack, placements: placeSettlements(pack, 4), cellResolution: rows });
    expect(d.captureReceipt.version).toBe(CAPTURE_RECEIPT_VERSION);
    expect(d.captureReceipt.cellResolution).toEqual(rows);
    expect('terrainDisagreements' in d.captureReceipt).toBe(false);
  });

  it('shares one envelope with the terrain receipt, in a fixed key order', () => {
    const pack = makeGridPack({ cols: 12, rows: 10 });
    const placements = placeSettlements(pack, 3).map(p => ({ ...p, terrainType: 'mountain' }));
    const rows = [{ id: 's000', from: 3, to: 7, reason: 'cell_remapped' }];
    const d = buildSpatialDigest({ pack, placements, cellResolution: rows });
    expect(Object.keys(d.captureReceipt)).toEqual(['version', 'cellResolution', 'terrainDisagreements']);
    // The digest's own key order is fixed too: the receipt is appended LAST.
    expect(Object.keys(d).at(-1)).toBe('captureReceipt');
  });
});
