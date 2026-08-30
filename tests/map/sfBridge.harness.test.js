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
