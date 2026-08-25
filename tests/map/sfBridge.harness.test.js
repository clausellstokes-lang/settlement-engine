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

const SRC = readFileSync(resolve(process.cwd(), 'public/map/sf-bridge.js'), 'utf-8');

/** Messages the bridge posts to the parent (rid-correlated replies + push events). */
let posted = [];
const fakeParent = { postMessage: (msg /*, targetOrigin */) => { posted.push(msg); } };

/** Dispatch a settlementEngine:* command as the embedding parent would, and return
 *  the rid-correlated reply the bridge posts back (or undefined if it stayed silent). */
function sendCommand(type, data = {}, { origin = window.location.origin, source = window.parent } = {}) {
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
  // Indirect eval runs in GLOBAL scope, so the IIFE's bare FMG-global reads (`pack`,
  // `window.*`, `document.*`) resolve against the jsdom globalThis.
  (0, eval)(SRC);
});

afterAll(() => { vi.useRealTimers(); });

beforeEach(() => { posted = []; globalThis.pack = undefined; });

describe('sf-bridge.js harness', () => {
  it('loads + initializes in an embedded document without throwing (beyond the acorn parse)', () => {
    // If the IIFE threw during init, beforeAll would have failed. Prove the message
    // listener is live by exercising an unknown command (silently ignored, no throw).
    expect(() => sendCommand('settlementEngine:definitelyNotACommand')).not.toThrow();
  });

  describe('settlementEngine:getSpatialPack — the constitutional capture seam', () => {
    it('copies pack cell arrays out (COPY-NOT-ALIAS) with the {h,biome,r,p,c} field set and TypedArray→plain', () => {
      const h = new Float32Array([0.1, 0.9, 0.5]);
      const biome = new Uint8Array([1, 2, 3]);
      const r = new Uint8Array([0, 1, 0]);
      const p = [[10, 20], [30, 40], [50, 60]];
      const c = [[1, 2], [0, 2], [0, 1]];
      globalThis.pack = { cells: { i: [0, 1, 2], h, biome, r, p, c } };

      const reply = sendCommand('settlementEngine:getSpatialPack');
      expect(reply).toBeTruthy();
      expect(reply.type).toBe('fmg:spatialPackReply');
      const cells = reply.pack.cells;
      // Field set is exactly the five the digest builder consumes.
      expect(Object.keys(cells).sort()).toEqual(['biome', 'c', 'h', 'p', 'r']);
      // TypedArray → plain Array conversion (parent's normalizeSpatialPack uses Array.isArray).
      expect(Array.isArray(cells.h)).toBe(true);
      expect(Array.isArray(cells.biome)).toBe(true);
      expect(Array.isArray(cells.r)).toBe(true);
      expect(cells.h).toEqual([0.1, 0.9, 0.5].map((n) => Math.fround(n)));
      expect(cells.biome).toEqual([1, 2, 3]);
      // COPY-NOT-ALIAS: the reply must not hand out references to live pack state, so
      // a later FMG mutation of the pack can't retro-alter an already-sent capture.
      expect(cells.h).not.toBe(h);
      expect(cells.p).not.toBe(p);
      expect(cells.p[0]).not.toBe(p[0]);      // inner [x,y] pairs deep-copied
      expect(cells.c[0]).not.toBe(c[0]);      // inner neighbour arrays deep-copied
      expect(cells.p).toEqual(p);
      expect(cells.c).toEqual(c);
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
    it('runs the handler only for our own origin AND the embedding parent', () => {
      globalThis.pack = { cells: { i: [0], h: new Float32Array([0.5]), biome: new Uint8Array([1]), r: new Uint8Array([0]), p: [[1, 2]], c: [[0]] } };
      // Baseline: a same-origin, parent-sourced command IS handled.
      expect(sendCommand('settlementEngine:getSpatialPack')).toBeTruthy();
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
