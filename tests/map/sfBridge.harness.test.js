/** @vitest-environment jsdom */
/**
 * sfBridge.harness.test.js — behavioral coverage for public/map/sf-bridge.js
 * ([build-tooling-docs-4]).
 *
 * sf-bridge.js is ~1,266 lines of FIRST-PARTY bridge logic — including the Phase 5.5
 * spatial-capture seam whose bytes the parent freezes into the constitutional spatial
 * digest — yet it was outside every gate except an acorn parse (public/** is eslint-
 * ignored; validate-map-fork only syntax-checks it). A silent regression here (aliasing
 * live pack state, dropping a capture field, a broken origin gate) corrupts digests at
 * canonize time, and freeze-first makes that corruption PERMANENT in the campaign; the
 * fmg-fork runbook rests on "reapply sf-bridge.js as-is", so nothing re-verifies it
 * after an FMG bump either.
 *
 * The bridge is a closure IIFE (helpers are private, and it early-returns unless
 * window.parent !== window), so this harness EVALUATES it in jsdom with stubbed FMG
 * globals + a parent-postMessage spy and drives it through the real message protocol.
 * It pins the load-bearing behaviors: the getSpatialPack COPY-NOT-ALIAS + field-set +
 * TypedArray→plain conversion, the exportThumb best-effort reply shape, and the
 * receive-side ORIGIN/SOURCE fail-closed trust boundary.
 */
import { describe, it, expect, beforeAll, beforeEach, afterAll, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { normalizeSpatialPack } from '../../src/domain/spatial/spatialDigest.js';

const SRC = readFileSync(resolve(process.cwd(), 'public/map/sf-bridge.js'), 'utf-8');
const ORIGIN_SRC = readFileSync(resolve(process.cwd(), 'public/map/sf-origin.js'), 'utf-8');
const EMBEDDER_ORIGIN = 'https://settlementforge.com';

/** Messages the bridge posts to the parent (rid-correlated replies + push events). */
let posted = [];
let postedTargets = [];
const fakeParent = {
  postMessage: (msg, targetOrigin) => {
    posted.push(msg);
    postedTargets.push(targetOrigin);
  },
};

/** Dispatch a settlementEngine:* command as the embedding parent would, and return
 *  the rid-correlated reply the bridge posts back (or undefined if it stayed silent). */
function sendCommand(type, data = {}, { origin = EMBEDDER_ORIGIN, source = window.parent } = {}) {
  posted = [];
  const rid = `rid-${Math.random().toString(36).slice(2)}`;
  const ev = new MessageEvent('message', { data: { type, _rid: rid, ...data }, origin, source });
  window.dispatchEvent(ev);
  return posted.find((m) => m && m._rid === rid);
}

beforeAll(() => {
  // The IIFE only wires up when embedded (window.parent !== window). Shadow jsdom's
  // window.parent with a spy BEFORE eval so isEmbedded is true and postToParent's
  // target is captured. Fake timers neutralize the 500ms ready-poll setInterval.
  vi.useFakeTimers();
  Object.defineProperty(window, 'parent', { value: fakeParent, configurable: true, writable: true });
  window.history.replaceState(
    {},
    '',
    `/map/index.html?parentOrigin=${encodeURIComponent(EMBEDDER_ORIGIN)}`,
  );
  // Indirect eval runs in GLOBAL scope, so the IIFE's bare FMG-global reads (`pack`,
  // `window.*`, `document.*`) resolve against the jsdom globalThis.
  (0, eval)(ORIGIN_SRC);
  (0, eval)(SRC);
});

afterAll(() => { vi.useRealTimers(); });

beforeEach(() => {
  posted = [];
  postedTargets = [];
  globalThis.pack = undefined;
  globalThis.grid = undefined; // W-CAP CAP-1 reads it; keep the isolation total
});

describe('sf-bridge.js harness', () => {
  it('loads + initializes in an embedded document without throwing (beyond the acorn parse)', () => {
    // If the IIFE threw during init, beforeAll would have failed. Prove the message
    // listener is live by exercising an unknown command (silently ignored, no throw).
    expect(() => sendCommand('settlementEngine:definitelyNotACommand')).not.toThrow();
  });

  describe('settlementEngine:getSpatialPack — the constitutional capture seam', () => {
    it('copies pack cell arrays out (COPY-NOT-ALIAS) with the {h,biome,r,p,c,fl,g} field set and TypedArray→plain', () => {
      const h = new Float32Array([0.1, 0.9, 0.5]);
      const biome = new Uint8Array([1, 2, 3]);
      const r = new Uint8Array([0, 1, 0]);
      const p = [[10, 20], [30, 40], [50, 60]];
      const c = [[1, 2], [0, 2], [0, 1]];
      const fl = new Uint16Array([0, 240, 12]);
      const g = new Uint16Array([0, 0, 1]);
      globalThis.pack = { cells: { i: [0, 1, 2], h, biome, r, p, c, fl, g } };

      const reply = sendCommand('settlementEngine:getSpatialPack');
      expect(reply).toBeTruthy();
      expect(reply.type).toBe('fmg:spatialPackReply');
      const cells = reply.pack.cells;
      // Field set is exactly the seven PACK-indexed arrays the digest builder consumes
      // (W-CAP CAP-1 added fl + g to the keystone five).
      expect(Object.keys(cells).sort()).toEqual(['biome', 'c', 'fl', 'g', 'h', 'p', 'r']);
      // TypedArray → plain Array conversion (parent's normalizeSpatialPack uses Array.isArray).
      expect(Array.isArray(cells.h)).toBe(true);
      expect(Array.isArray(cells.biome)).toBe(true);
      expect(Array.isArray(cells.r)).toBe(true);
      expect(Array.isArray(cells.fl)).toBe(true);
      expect(Array.isArray(cells.g)).toBe(true);
      expect(cells.h).toEqual([0.1, 0.9, 0.5].map((n) => Math.fround(n)));
      expect(cells.biome).toEqual([1, 2, 3]);
      expect(cells.fl).toEqual([0, 240, 12]);
      expect(cells.g).toEqual([0, 0, 1]);
      // COPY-NOT-ALIAS: the reply must not hand out references to live pack state, so
      // a later FMG mutation of the pack can't retro-alter an already-sent capture.
      expect(cells.h).not.toBe(h);
      expect(cells.fl).not.toBe(fl);
      expect(cells.g).not.toBe(g);
      expect(cells.p).not.toBe(p);
      expect(cells.p[0]).not.toBe(p[0]);      // inner [x,y] pairs deep-copied
      expect(cells.c[0]).not.toBe(c[0]);      // inner neighbour arrays deep-copied
      expect(cells.p).toEqual(p);
      expect(cells.c).toEqual(c);
    });

    it('CAP-1: the GRID-indexed climate arrays ride a SEPARATE `grid` key, copied not aliased', () => {
      // The denominators genuinely differ: FMG generates temp/prec on the GRID
      // (main.js `const cells = grid.cells;`) and never re-projects them onto the pack,
      // so a two-pack-cell map can sit on a one-grid-cell climate row. Carrying them
      // under `cells` would make an off-by-denominator read spellable and silent.
      const temp = new Int8Array([21, -4]);
      const prec = new Uint8Array([80, 3]);
      globalThis.pack = {
        cells: {
          i: [0, 1, 2],
          h: new Float32Array([40, 40, 40]),
          biome: new Uint8Array([4, 4, 4]),
          r: new Uint8Array([0, 0, 0]),
          p: [[0, 0], [10, 0], [20, 0]],
          c: [[1], [0, 2], [1]],
          fl: new Uint16Array([0, 0, 0]),
          g: new Uint16Array([0, 0, 1]),   // three PACK cells over two GRID cells
        },
      };
      globalThis.grid = { cells: { temp, prec } };
      try {
        const reply = sendCommand('settlementEngine:getSpatialPack');
        expect(Object.keys(reply.pack).sort()).toEqual(['cells', 'grid']);
        expect(reply.pack.grid.temp).toEqual([21, -4]);
        expect(reply.pack.grid.prec).toEqual([80, 3]);
        expect(reply.pack.grid.temp).not.toBe(temp);
        expect(reply.pack.grid.prec).not.toBe(prec);
        // The grid arrays are SHORTER than the pack arrays — the shape carries the
        // two denominators honestly rather than padding one to the other.
        expect(reply.pack.grid.temp.length).toBe(2);
        expect(reply.pack.cells.h.length).toBe(3);
      } finally {
        globalThis.grid = undefined;
      }
    });

    it('CAP-1: an absent `grid` global degrades to empty climate arrays, never a failed capture', () => {
      // A capture can be requested before the grid exists (and a bare read of a missing
      // global would throw a ReferenceError the handler would turn into replyError —
      // taking the WHOLE capture down over an optional field). Absent ⇒ empty.
      globalThis.grid = undefined;
      globalThis.pack = {
        cells: {
          i: [0], h: new Float32Array([40]), biome: new Uint8Array([4]),
          r: new Uint8Array([0]), p: [[1, 2]], c: [[0]],
        },
      };
      const reply = sendCommand('settlementEngine:getSpatialPack');
      expect(reply.type).toBe('fmg:spatialPackReply');
      expect(reply.pack.grid).toEqual({ temp: [], prec: [] });
      // …and an absent flux/grid-index array reads empty too (a hand-edited heightmap
      // before the river pass), exactly as biome/r already do.
      expect(reply.pack.cells.fl).toEqual([]);
      expect(reply.pack.cells.g).toEqual([]);
    });

    it('CAP-1: the reply SURVIVES the parent normalizer — the two halves of D1 joined', () => {
      // The only test in the estate that runs the ACTUAL bridge output through the
      // ACTUAL parent normalizer. Either half can be right alone and the pair still
      // broken: normalizeSpatialPack silently drops keys it does not name, so a bridge
      // that emits a field the normalizer never learned is a field that does not exist.
      globalThis.pack = {
        cells: {
          i: [0, 1, 2],
          h: new Float32Array([40, 40, 40]),
          biome: new Uint8Array([4, 4, 4]),
          r: new Uint8Array([0, 1, 0]),
          p: [[0, 0], [10, 0], [20, 0]],
          c: [[1], [0, 2], [1]],
          fl: new Uint16Array([0, 320, 0]),
          g: new Uint16Array([0, 0, 1]),
        },
      };
      globalThis.grid = { cells: { temp: new Int8Array([18, -2]), prec: new Uint8Array([64, 200]) } };
      try {
        const reply = sendCommand('settlementEngine:getSpatialPack');
        const n = normalizeSpatialPack(reply.pack);
        expect(n.cellCount).toBe(3);
        expect(n.gridCellCount).toBe(2);
        expect(n.fl).toEqual([0, 320, 0]);
        expect(n.g).toEqual([0, 0, 1]);
        expect(n.temp).toEqual([18, -2]);
        expect(n.prec).toEqual([64, 200]);
        // …and the pack-to-grid bridge resolves: cell 1's climate is grid row g[1].
        expect(n.temp[n.g[1]]).toBe(18);
      } finally {
        globalThis.grid = undefined;
      }
    });

    it('replies pack:null when the pack has no usable cells (fail-soft, no throw)', () => {
      globalThis.pack = { cells: null };
      const reply = sendCommand('settlementEngine:getSpatialPack');
      expect(reply).toMatchObject({ type: 'fmg:spatialPackReply', pack: null });
    });
  });

  describe('settlementEngine:exportThumb — best-effort thumbnail', () => {
    it('replies { dataUrl: null } (never throws) when there is no rendered #map', () => {
      // No #map element in the jsdom document ⇒ the best-effort contract: reply a null
      // dataUrl so the caller falls back to the terrain placeholder, never throwing
      // across the bridge or blocking a share.
      const reply = sendCommand('settlementEngine:exportThumb', { size: 480 });
      expect(reply).toMatchObject({ type: 'fmg:exportThumbReply', dataUrl: null });
    });
  });

  // ── WEAVE NET-1 · the road router ────────────────────────────────────────
  // The bridge's A* is the second half of NET-1: `computeRoadEdges` (parent-side)
  // decides WHICH pairs get a road, and this handler decides the LINE each road
  // takes. All four NET-1 changes live inside the cost function and the sea exit,
  // so they are only observable through the emitted polyline — which is exactly
  // what this harness can see, by driving the real message protocol over a
  // synthetic pack whose terrain is legible by construction.
  describe('settlementEngine:computeRoadNetwork — the NET-1 road router', () => {
    const SPACING = 10;

    /**
     * A cols×rows 4-neighbour grid pack. `water(c, r)` decides the sea; `burgs`
     * plants burg cells. `t` (FMG's distance field) and `haven` are derived the
     * way markupPack derives them — coast cells ±1, everything else ±2 — so the
     * fixture speaks the same vocabulary as a real pack rather than a guess at it.
     */
    function gridPack({ cols, rows, water = () => false, burgs = [], omit = [], xs = SPACING, ys = SPACING }) {
      const n = cols * rows;
      const idx = (c, r) => r * cols + c;
      const colOf = (i) => i % cols;
      const rowOf = (i) => Math.floor(i / cols);
      const h = new Array(n), p = new Array(n), C = new Array(n);
      const biome = new Array(n).fill(4);   // grassland everywhere: terrain is flat,
      const r = new Array(n).fill(0);       // so only the NET-1 terms can move a road
      const t = new Array(n).fill(0), haven = new Array(n).fill(0), burg = new Array(n).fill(0);
      for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
        const i = idx(col, row);
        p[i] = [col * xs, row * ys];
        h[i] = water(col, row) ? 10 : 40;
        const nb = [];
        if (col > 0) nb.push(idx(col - 1, row));
        if (col < cols - 1) nb.push(idx(col + 1, row));
        if (row > 0) nb.push(idx(col, row - 1));
        if (row < rows - 1) nb.push(idx(col, row + 1));
        C[i] = nb;
      }
      // `t` the way markupPack builds it: the coast is ±1, then a breadth-first
      // sweep outward incrementing (+1 inland, -1 seaward). A two-value stand-in
      // would make the coast-grading assertion below unable to fail.
      const queue = [];
      for (let i = 0; i < n; i++) {
        const wet = water(colOf(i), rowOf(i));
        if (C[i].some((nb) => water(colOf(nb), rowOf(nb)) !== wet)) {
          t[i] = wet ? -1 : 1;
          queue.push(i);
        }
      }
      for (let qi = 0; qi < queue.length; qi++) {
        const cur = queue[qi];
        for (const nb of C[cur]) {
          if (t[nb] !== 0) continue;
          const wet = water(colOf(nb), rowOf(nb));
          if (wet !== (t[cur] < 0)) continue;
          t[nb] = t[cur] + (wet ? -1 : 1);
          queue.push(nb);
        }
      }
      for (let i = 0; i < n; i++) {
        if (t[i] === 1) {
          // FMG's own rule (markupPack): the water neighbour NEAREST THE CENTROID,
          // which on a non-square grid is deliberately NOT the first one in the
          // adjacency array — that difference is what makes the haven pin bite.
          let best = -1, bestD = Infinity;
          for (const nb of C[i]) {
            if (!water(colOf(nb), rowOf(nb))) continue;
            const d = (p[nb][0] - p[i][0]) ** 2 + (p[nb][1] - p[i][1]) ** 2;
            if (d < bestD) { bestD = d; best = nb; }
          }
          if (best >= 0) haven[i] = best;
        }
      }
      for (const [c, rr] of burgs) burg[idx(c, rr)] = 1;
      const cells = { i: [...Array(n).keys()], h, biome, r, p, c: C, t, haven, burg };
      for (const key of omit) delete cells[key];
      return { cells, idx, cols, rows, xs, ys };
    }

    const edge = (id, from, to, preferSea = false, g = null) => ({
      id,
      fromX: from[0] * (g ? g.xs : SPACING), fromY: from[1] * (g ? g.ys : SPACING),
      toX: to[0] * (g ? g.xs : SPACING),     toY: to[1] * (g ? g.ys : SPACING),
      preferSea,
    });

    /** Drive the real handler and return its `paths` map. */
    function routeOn(g, edges) {
      globalThis.pack = { cells: g.cells };
      globalThis.findCell = undefined;   // force the handler's own centroid scan
      const reply = sendCommand('settlementEngine:computeRoadNetwork', { edges });
      expect(reply && reply.type).toBe('fmg:roadNetworkReply');
      return reply.paths;
    }

    /** A path's cells, recovered from its polyline (the grid is a bijection). */
    const cellsOf = (g, path) =>
      (path && path.points ? path.points : []).map((pt) => g.idx(pt.x / g.xs, pt.y / g.ys));

    it('corridor re-use bends a later road onto an earlier one (×0.5 per shared hop)', () => {
      // Two parallel north-south roads two columns apart on flat ground. Alone,
      // each runs dead straight. Routed together, the second pays two sideways
      // hops to join the first's corridor and rides it at half price — which is
      // cheaper than twenty-one full-price hops of its own.
      const g = gridPack({ cols: 6, rows: 21 });
      const first  = edge('A', [0, 0], [0, 20]);
      const second = edge('B', [2, 0], [2, 20]);

      const alone = cellsOf(g, routeOn(g, [second]).B).map((c) => c % 6);
      expect(new Set(alone)).toEqual(new Set([2]));          // straight down its own column

      const together = routeOn(g, [first, second]);
      const joined = cellsOf(g, together.B).map((c) => c % 6);
      expect(joined[0]).toBe(2);                              // starts where it started
      expect(joined[joined.length - 1]).toBe(2);              // and ends where it ended
      expect(joined).toContain(0);                            // but travels the first road's column
      // Most of the journey is now shared, not merely a touch of it.
      expect(joined.filter((c) => c === 0).length).toBeGreaterThan(alone.length / 2);
      // The first road is unmoved — re-use is a discount for FOLLOWERS only.
      expect(new Set(cellsOf(g, together.A).map((c) => c % 6))).toEqual(new Set([0]));
    });

    it('the corridor set is PER REQUEST — it never leaks from one call into the next', () => {
      // `usedCellPairs` is the only state NET-1 carries across edges, and it lives
      // inside the handler on purpose. Hoisted one scope out it would become a
      // module-lifetime accumulator: every re-route after a regenerate or a
      // snapshot load would inherit the corridors of a map that no longer exists,
      // and the roads would drift a little further from the terrain each time.
      // Routing the SAME lone edge before and after a batch that banks a corridor
      // right beside it must give the same line both times.
      const g = gridPack({ cols: 6, rows: 21 });
      const solo = cellsOf(g, routeOn(g, [edge('B', [2, 0], [2, 20])]).B);
      routeOn(g, [edge('A', [0, 0], [0, 20]), edge('B', [2, 0], [2, 20])]);
      const soloAgain = cellsOf(g, routeOn(g, [edge('B', [2, 0], [2, 20])]).B);
      expect(soloAgain).toEqual(solo);
      // Anti-vacuity: the batch in the middle really does move B, so "unchanged"
      // above is a statement about isolation and not about an inert fixture.
      const batched = cellsOf(g, routeOn(g, [edge('A', [0, 0], [0, 20]), edge('B', [2, 0], [2, 20])]).B);
      expect(batched).not.toEqual(solo);
    });

    it('the off-burg multiplier strings a road through the small places on the way', () => {
      // A straight run along row 2 is eight flat hops. One row up sits a chain of
      // seven burgs. At ×3 for open country the detour is cheaper despite being
      // longer, which is the whole point: roads go where people are.
      const g = gridPack({ cols: 9, rows: 5, burgs: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1]] });
      const withBurgs = cellsOf(g, routeOn(g, [edge('E', [0, 2], [8, 2])]).E);
      const rows = withBurgs.map((c) => Math.floor(c / 9));
      expect(rows).toContain(1);
      expect(rows.filter((r) => r === 1).length).toBeGreaterThanOrEqual(7);

      // Anti-vacuity: the SAME geometry with no burgs runs dead straight, so the
      // detour above is the burg term and not something about the grid.
      const bare = gridPack({ cols: 9, rows: 5 });
      const noBurgs = cellsOf(bare, routeOn(bare, [edge('E', [0, 2], [8, 2])]).E);
      expect(new Set(noBurgs.map((c) => Math.floor(c / 9)))).toEqual(new Set([2]));
    });

    it('a sea route leaves through the burg\'s HAVEN, not through whatever ocean is nearest in the adjacency list', () => {
      // THE DISCRIMINATION THIS FIXTURE EXISTS FOR. A one-cell SPIT at (6,5) juts
      // into the bay with water on three sides. The old breadth-first exit walked
      // the adjacency array and took the FIRST water it met — the western
      // neighbour. FMG's `haven` is the water nearest the cell's centroid, and on
      // this deliberately non-square grid (x pitch 40, y pitch 10) that is the
      // NORTHERN neighbour instead. So the two answers differ, and which one the
      // route leaves through is directly readable off the polyline.
      // A strait across rows 2..6, bridged by land only at the far eastern column,
      // with a one-cell SPIT at (6,1) that has water west, east and south of it.
      const water = (c, r) => (r >= 2 && r <= 6 && c !== 12) || ((c === 5 || c === 7) && r === 1);
      const g = gridPack({ cols: 13, rows: 9, water, xs: 40, ys: 10 });
      const spit = g.idx(6, 1);
      const firstInAdjacency = g.cells.c[spit].find((nb) => g.cells.h[nb] < 20);
      const haven = g.cells.haven[spit];
      expect(firstInAdjacency).toBe(g.idx(5, 1));   // what the old BFS exit returned
      expect(haven).toBe(g.idx(6, 2));              // what FMG actually recorded
      expect(haven).not.toBe(firstInAdjacency);     // anchored: both values asserted above

      const path = routeOn(g, [edge('S', [6, 1], [6, 7], true, g)]).S;
      expect(path.mode).toBe('sea');
      const cells = cellsOf(g, path);
      expect(cells[0]).toBe(spit);
      expect(cells[1]).toBe(haven);          // the haven, not the first-in-adjacency water
      expect(cells[cells.length - 1]).toBe(g.idx(6, 7));
    });

    it('sea cost grades on the coast, so a lane follows the shore instead of cutting across open water', () => {
      // TWO SHORES with genuinely deep water between them: a 41x13 strait whose
      // middle row is six bands from either coast. The two harbours sit at
      // OPPOSITE ENDS of OPPOSITE shores, so every water route is 51 cells long
      // whichever way it goes — the hop count cannot distinguish them and only
      // the depth term can. MEASURED on this fixture: graded mean depth 1.49 with
      // 42 cells right on the shoreline; the same route with the depth term
      // switched off climbs into open water a third of the way along and
      // measures 1.98. That gap is what these two assertions sit inside.
      const g = gridPack({ cols: 41, rows: 13, water: (c, r) => r > 0 && r < 12 });
      expect(g.cells.t[g.idx(20, 6)]).toBe(-6);      // the fixture really is deep
      const path = routeOn(g, [edge('S', [0, 0], [40, 12], true)]).S;
      expect(path.mode).toBe('sea');
      const wet = cellsOf(g, path).filter((c) => g.cells.h[c] < 20);
      const depths = wet.map((c) => -g.cells.t[c]);
      expect(wet.length).toBeGreaterThan(40);
      expect(depths.filter((d) => d === 1).length).toBeGreaterThanOrEqual(40);
      const mean = depths.reduce((a, b) => a + b, 0) / depths.length;
      expect(mean).toBeLessThan(1.6);
    });

    it('a pack with no t / haven / burg arrays still routes (the pre-NET-1 degradation)', () => {
      // A hand-edited or pre-markup pack carries none of the three NET-1 reads.
      // Each must degrade to the old rule on its own, not fail the request.
      const g = gridPack({
        cols: 13, rows: 9, water: (c, r) => c >= 3 && c <= 9 && r <= 5,
        omit: ['t', 'haven', 'burg'],
      });
      const paths = routeOn(g, [edge('L', [0, 7], [12, 7]), edge('S', [2, 2], [10, 2], true)]);
      expect(paths.L.points.length).toBeGreaterThan(2);
      expect(paths.S.mode).toBe('sea');
      // The BFS fallback found water even with no haven array.
      expect(cellsOf(g, paths.S).some((c) => g.cells.h[c] < 20)).toBe(true);
    });

    it('is deterministic: the same request twice yields byte-identical paths', () => {
      const g = gridPack({ cols: 9, rows: 9, burgs: [[4, 4], [5, 5]] });
      const edges = [
        edge('a', [0, 0], [8, 8]), edge('b', [0, 8], [8, 0]),
        edge('c', [4, 0], [4, 8]), edge('d', [0, 4], [8, 4]),
      ];
      const first = JSON.stringify(routeOn(g, edges));
      for (let i = 0; i < 5; i++) expect(JSON.stringify(routeOn(g, edges))).toBe(first);
    });

    it('routes a realm-sized pack without exhausting the iteration guard', () => {
      // 150×100 = 15,000 cells, twenty long diagonal crossings — larger than an
      // FMG default pack. Every edge must resolve; a MAX_ITER exhaustion returns
      // null and the road silently vanishes from the map.
      const g = gridPack({ cols: 150, rows: 100 });
      const edges = [];
      for (let k = 0; k < 20; k++) {
        edges.push(edge('e' + k, [(k * 7) % 149, 0], [149 - ((k * 7) % 149), 99]));
      }
      const paths = routeOn(g, edges);
      expect(Object.keys(paths).length).toBe(edges.length);
      for (const id of Object.keys(paths)) expect(paths[id].points.length).toBeGreaterThan(50);
    });
  });

  describe('receive-side trust boundary — ORIGIN + SOURCE fail-closed', () => {
    it('runs the handler only for the configured parent origin AND the embedding parent', () => {
      globalThis.pack = { cells: { i: [0], h: new Float32Array([0.5]), biome: new Uint8Array([1]), r: new Uint8Array([0]), p: [[1, 2]], c: [[0]] } };
      // Baseline: a cross-origin, parent-sourced command IS handled.
      expect(sendCommand('settlementEngine:getSpatialPack')).toBeTruthy();
      expect(new Set(postedTargets)).toEqual(new Set([EMBEDDER_ORIGIN]));
    });

    it('rejects a command from a FOREIGN origin (no reply)', () => {
      globalThis.pack = { cells: { i: [0], h: new Float32Array([0.5]), biome: new Uint8Array([1]), r: new Uint8Array([0]), p: [[1, 2]], c: [[0]] } };
      const reply = sendCommand('settlementEngine:getSpatialPack', {}, { origin: 'https://evil.example.com' });
      expect(reply).toBeUndefined();
    });

    it('rejects a command whose source is NOT the embedding parent (no reply)', () => {
      globalThis.pack = { cells: { i: [0], h: new Float32Array([0.5]), biome: new Uint8Array([1]), r: new Uint8Array([0]), p: [[1, 2]], c: [[0]] } };
      const notTheParent = { postMessage: () => {} };
      const reply = sendCommand('settlementEngine:getSpatialPack', {}, { source: notTheParent });
      expect(reply).toBeUndefined();
    });
  });
});
