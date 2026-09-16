/**
 * spatialDigest.invariants.test.js — Phase 5.5 KEYSTONE, the pure-module invariant
 * suite (§V.5). These tests ARE half the deliverable: a wrong digest is worse than
 * a late one, so the determinism / locality / freezing properties are pinned
 * up front and gate every downstream spatial wave.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import {
  buildSpatialDigest,
  COST_LAW_VERSION,
  SPATIAL_GEOMETRY_VERSION,
  OVERLAY_VERSION,
} from '../../src/domain/spatial/index.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { makeGridPack, placeSettlements, makeTiePack } from '../fixtures/spatialPackFixtures.js';

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
