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
} from '../fixtures/spatialPackFixtures.js';

const RESERVED = { airField: null, seaLanes: null, seasonalOverlay: null, teleportEdges: null };
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
  const EXPECTED = Object.freeze({
    'grid22x18-12-plain': '437a47ef780ac6b156ec8cfed27448d0f0bff1e41b4b25ff0559b50a5f446ddb',
    'grid22x18-12-allslots': '324d68b0161a3bd79ebd66b053844708310f72537e3f7cd0ae6022d034b10f39',
    'grid24x18-ports': '1ba924842559f12e6d191e943a1982a10d5bf771d8bc1b4472cafa5266d6abe9',
    'grid24x18-teleport': '65f7181ad1d435577586613dabc5c0ce4f9b0ce863a3e18a242724a9e1cd57dc',
    island: 'b7affc5903ce5d62a59ca6b590746ca9ffc1838f7e963c6c8ce32c103ef3a3c8',
    'disconnected-water': '99758d508d17a599bcba465a0d3052e9016e0150f3e9c4e0df5d94d379b924de',
    isthmus: 'c86bf0edaa7ca2f11d33b98377b692fc052a86b504b737c33ea74f7c03d7fa05',
    tie: 'c27487d0b8e1264eca7932af948710f6a7c421d785c58f59762ee39f3cd92c10',
    'port-coast-20': '2f7b5736fe478cf7b24d6d97029a7055f8ae9faea5d12d9a34880a89b10443ff',
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
