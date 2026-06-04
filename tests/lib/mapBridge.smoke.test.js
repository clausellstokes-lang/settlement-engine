/**
 * @vitest-environment jsdom
 *
 * Smoke tests for src/lib/mapBridge.js - the typed RPC client for the
 * FMG iframe.
 *
 * What this catches: regressions in the request/response pairing
 * (every command carries a _rid; replies must echo it), timeout
 * behavior, queueing of pre-ready commands, and the event-subscribe
 * surface that React components rely on for push events
 * (burgSelected, settlementPlaced, etc.).
 *
 * Approach: build a fake iframe whose contentWindow.postMessage is
 * captured; simulate the iframe replying by dispatching a `message`
 * event on `window` (which is what the real browser does). This
 * exercises the real handleMessage code without an actual iframe.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMapBridge } from '../../src/lib/mapBridge.js';

// ── Test rig ───────────────────────────────────────────────────────────

/**
 * Build a fake iframe object plus a helper that fires a `message` event
 * on `window` as if the iframe had posted it. mapBridge listens on
 * window and verifies event.source === iframe.contentWindow, so the
 * fake contentWindow needs to be a stable identity used in both spots.
 */
function makeRig() {
  const sent = [];
  const fakeContentWindow = { id: 'fake-iframe-cw' };
  const fakeIframe = {
    contentWindow: {
      ...fakeContentWindow,
      postMessage: (msg, _origin) => { sent.push(msg); },
    },
  };
  // (No reassignment needed - replyFromIframe below uses
  // fakeIframe.contentWindow directly as event.source, so identity holds
  // automatically. The bridge's source-check is `event.source !==
  // iframe.contentWindow`; same reference on both sides passes.)

  function replyFromIframe(data) {
    const ev = new MessageEvent('message', {
      data,
      origin: window.location.origin,
      source: fakeIframe.contentWindow,
    });
    window.dispatchEvent(ev);
  }

  return { fakeIframe, sent, replyFromIframe };
}

describe('mapBridge', () => {
  let rig;
  let bridge;

  // Track promises that are intentionally left pending (e.g. timeout
  // tests that await rejection at the test level - but with the bridge
  // around them, destroy() will reject any orphaned ones). Catching all
  // of them here keeps the test output clean.
  let trackedPromises = [];

  beforeEach(() => {
    rig = makeRig();
    bridge = createMapBridge(() => rig.fakeIframe, { timeoutMs: 1000, debug: false });
    bridge.start();
    trackedPromises = [];
  });

  // Always destroy and swallow "Bridge destroyed" rejections from any
  // pending calls so the runner doesn't surface them as unhandled.
  afterEach(() => {
    for (const p of trackedPromises) p.catch(() => {});
    bridge.destroy();
  });

  // Helper: any call() promise the test creates should pass through
  // here so its eventual rejection (from destroy) is swallowed.
  function tracked(p) { trackedPromises.push(p); return p; }

  // Legacy no-op for tests that previously called teardown() explicitly -
  // the afterEach hook handles it now.
  function teardown() { /* no-op */ }

  // ── Ready handshake ──────────────────────────────────────────────────
  test('ready() resolves on first fmg:ready message', async () => {
    const readyPromise = bridge.ready();
    rig.replyFromIframe({ type: 'fmg:ready', seed: 'abc', templates: ['default'] });
    await expect(readyPromise).resolves.toBeDefined();
    expect(bridge.isReady).toBe(true);
    teardown();
  });

  test('ready() returns same promise on repeated calls before resolve', async () => {
    const p1 = bridge.ready();
    const p2 = bridge.ready();
    expect(p1).toBe(p2);
    rig.replyFromIframe({ type: 'fmg:ready' });
    await Promise.all([p1, p2]);
    teardown();
  });

  // ── Call / reply round-trip ─────────────────────────────────────────
  test('call() pairs request _rid with reply _rid and resolves', async () => {
    rig.replyFromIframe({ type: 'fmg:ready' });
    const callPromise = bridge.call('settlementEngine:fitMap');
    // Inspect what was sent to capture the _rid
    expect(rig.sent).toHaveLength(1);
    const sent = rig.sent[0];
    expect(sent.type).toBe('settlementEngine:fitMap');
    expect(sent._rid).toMatch(/^rpc_/);

    // Reply with the same _rid - must use fmg: prefix per the bridge's
    // input filter (handleMessage drops anything not starting with fmg:).
    rig.replyFromIframe({ type: 'fmg:reply', _rid: sent._rid, ok: true });

    const result = await callPromise;
    expect(result.ok).toBe(true);
    teardown();
  });

  test('call() rejects with the typed error on _error replies', async () => {
    rig.replyFromIframe({ type: 'fmg:ready' });
    const p = bridge.call('settlementEngine:placeSettlement', { x: 1, y: 2 });
    const sent = rig.sent[rig.sent.length - 1];
    rig.replyFromIframe({ type: 'fmg:reply', _rid: sent._rid, _error: 'no such burg' });
    await expect(p).rejects.toThrow(/placeSettlement: no such burg/);
    teardown();
  });

  test('call() rejects with timeout error when no reply arrives', async () => {
    rig.replyFromIframe({ type: 'fmg:ready' });
    const p = bridge.call('settlementEngine:fitMap', {}, { timeout: 50 });
    await expect(p).rejects.toThrow(/RPC timeout/);
    teardown();
  });

  // ── Pre-ready queueing ───────────────────────────────────────────────
  test('calls issued before ready are queued and drained on ready', async () => {
    // Issue two calls before any ready message
    const p1 = bridge.call('settlementEngine:fitMap');
    const p2 = bridge.call('settlementEngine:getViewport');
    // Nothing should have been sent yet
    expect(rig.sent).toHaveLength(0);

    // Fire ready → queue drains
    rig.replyFromIframe({ type: 'fmg:ready' });
    expect(rig.sent).toHaveLength(2);
    expect(rig.sent[0].type).toBe('settlementEngine:fitMap');
    expect(rig.sent[1].type).toBe('settlementEngine:getViewport');

    // Reply to both (fmg: prefix required by the input filter)
    rig.replyFromIframe({ type: 'fmg:reply', _rid: rig.sent[0]._rid, ok: true });
    rig.replyFromIframe({ type: 'fmg:reply', _rid: rig.sent[1]._rid, scale: 1.5, tx: 10, ty: 20 });

    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1.ok).toBe(true);
    expect(r2.scale).toBe(1.5);
    teardown();
  });

  test('skipQueue dispatches immediately even before ready', async () => {
    // Track the unresolved promise so afterEach's destroy()-induced
    // rejection doesn't surface as an unhandled rejection.
    tracked(bridge.call('settlementEngine:ping', {}, { skipQueue: true }));
    expect(rig.sent).toHaveLength(1);
    expect(rig.sent[0].type).toBe('settlementEngine:ping');
  });

  // ── Event emitter ────────────────────────────────────────────────────
  test('on() receives push events with the prefix stripped from the type', () => {
    const seen = [];
    const off = bridge.on('burgSelected', (data) => seen.push(data));
    rig.replyFromIframe({ type: 'fmg:burgSelected', burg: { id: 42, name: 'Test' } });
    expect(seen).toHaveLength(1);
    expect(seen[0].burg.id).toBe(42);
    // off() returned from on() unsubscribes the listener
    off();
    rig.replyFromIframe({ type: 'fmg:burgSelected', burg: { id: 43 } });
    expect(seen).toHaveLength(1);  // unchanged
    teardown();
  });

  test('on(ready) fires every time, not just the first', () => {
    const seen = [];
    bridge.on('ready', (data) => seen.push(data));
    rig.replyFromIframe({ type: 'fmg:ready', seed: 's1' });
    rig.replyFromIframe({ type: 'fmg:ready', seed: 's2' });
    // Both ready messages fire the listener - even though ready() promise
    // only resolves once. Useful for components that want to react to map
    // reloads.
    expect(seen).toHaveLength(2);
    expect(seen[0].seed).toBe('s1');
    expect(seen[1].seed).toBe('s2');
    teardown();
  });

  // ── Origin / source guards ──────────────────────────────────────────
  test('messages from a different origin are dropped', async () => {
    rig.replyFromIframe({ type: 'fmg:ready' });
    const p = bridge.call('settlementEngine:fitMap', {}, { timeout: 50 });
    const sent = rig.sent[rig.sent.length - 1];
    // Reply but with the wrong origin - should be ignored, so the call times out.
    const ev = new MessageEvent('message', {
      data: { type: 'fmg:reply', _rid: sent._rid, ok: true },
      origin: 'https://evil.example.com',
      source: rig.fakeIframe.contentWindow,
    });
    window.dispatchEvent(ev);
    await expect(p).rejects.toThrow(/RPC timeout/);
    teardown();
  });

  test('messages without an fmg: prefix are dropped', () => {
    const seen = [];
    bridge.on('burgSelected', (data) => seen.push(data));
    // Send a burgSelected without the fmg: prefix - should be ignored
    const ev = new MessageEvent('message', {
      data: { type: 'burgSelected', burg: { id: 1 } },
      origin: window.location.origin,
      source: rig.fakeIframe.contentWindow,
    });
    window.dispatchEvent(ev);
    expect(seen).toHaveLength(0);
    teardown();
  });

  // ── notify() fire-and-forget ────────────────────────────────────────
  test('notify() does not queue and does not register a pending entry', async () => {
    rig.replyFromIframe({ type: 'fmg:ready' });
    const ok = bridge.notify('settlementEngine:viewport', { tx: 5, ty: 10, scale: 1 });
    expect(ok).toBe(true);
    expect(rig.sent).toHaveLength(1);
    // notifications have no _rid
    expect(rig.sent[0]._rid).toBeUndefined();
    teardown();
  });

  test('notify() before ready is dropped (would be stale)', () => {
    const ok = bridge.notify('settlementEngine:viewport', { tx: 0, ty: 0, scale: 1 });
    expect(ok).toBe(false);
    expect(rig.sent).toHaveLength(0);
    teardown();
  });

  // ── destroy() cleanup ───────────────────────────────────────────────
  test('destroy() rejects pending calls and unbinds the window listener', async () => {
    rig.replyFromIframe({ type: 'fmg:ready' });
    const p = bridge.call('settlementEngine:fitMap', {}, { timeout: 5000 });

    bridge.destroy();
    await expect(p).rejects.toThrow(/Bridge destroyed/);
    expect(bridge.isReady).toBe(false);

    // Further calls also reject
    await expect(bridge.call('whatever')).rejects.toThrow(/Bridge destroyed/);
  });
});
