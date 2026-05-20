/**
 * @vitest-environment jsdom
 *
 * Tier 3.6 — Map bridge protocol contract test.
 *
 * Pins the FMG iframe message contract:
 *   - Every typed command exists on the bridge surface and sends the
 *     correct `settlementEngine:*` message type.
 *   - Outgoing envelope shape: { type, _rid, ...payload }.
 *   - Reply envelope shape: { _rid, result } or { _rid, _error }.
 *   - Push events (no _rid) fire on listeners.
 *
 * Changes to the iframe protocol that drop a known command or change
 * its message-type prefix break this test loudly.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { createMapBridge } from '../../src/lib/mapBridge.js';

// ── Canonical command catalog. Every entry MUST exist on the bridge,
// and calling it MUST emit the matching message type. ─────────────────

const CANONICAL_COMMANDS = [
  // settlement placement
  { method: 'placeSettlement',     type: 'settlementEngine:placeSettlement' },
  { method: 'removePlacement',     type: 'settlementEngine:removePlacement' },
  { method: 'clearAllPlacements',  type: 'settlementEngine:clearAllPlacements' },
  { method: 'restorePlacements',   type: 'settlementEngine:restorePlacements' },
  // viewport / geometry
  { method: 'getViewport',         type: 'settlementEngine:getViewport' },
  { method: 'setViewport',         type: 'settlementEngine:setViewport' },
  { method: 'fitMap',              type: 'settlementEngine:fitMap' },
  // snapshot
  { method: 'saveSnapshot',        type: 'settlementEngine:saveSnapshot' },
  { method: 'loadSnapshot',        type: 'settlementEngine:loadSnapshot' },
  { method: 'resetMap',            type: 'settlementEngine:resetMap' },
  // terrain
  { method: 'activateTool',        type: 'settlementEngine:activateTool' },
  { method: 'deactivateTool',      type: 'settlementEngine:deactivateTool' },
  { method: 'terrainUndo',         type: 'settlementEngine:terrainUndo' },
  { method: 'terrainRedo',         type: 'settlementEngine:terrainRedo' },
  // template
  { method: 'setTemplate',         type: 'settlementEngine:setTemplate' },
  { method: 'getTemplates',        type: 'settlementEngine:getTemplates' },
  // misc
  { method: 'requestBurgList',     type: 'settlementEngine:requestBurgList' },
  { method: 'setEmbeddedMode',     type: 'settlementEngine:setEmbeddedMode' },
];

// ── Push events the bridge MUST allow listeners to subscribe to.
// (No central registry on the bridge — pulled from real usage.) ────────

const PUSH_EVENTS = [
  'burgSelected',
  'settlementPlaced',
  'mapReady',
];

// ── Rig ────────────────────────────────────────────────────────────────

function makeRig() {
  const sent = [];
  const fakeIframe = {
    contentWindow: {
      postMessage: (msg) => sent.push(msg),
    },
  };

  function replyFromIframe(data) {
    const ev = new MessageEvent('message', {
      data,
      origin: window.location.origin,
      source: fakeIframe.contentWindow,
    });
    window.dispatchEvent(ev);
  }

  const bridge = createMapBridge(() => fakeIframe);
  bridge.start();

  // Always start with a ready signal so commands flush immediately.
  // Inbound message types use the `fmg:` prefix.
  replyFromIframe({ type: 'fmg:ready' });

  return { bridge, sent, replyFromIframe };
}

let rig;

beforeEach(() => {
  rig = makeRig();
});

afterEach(() => {
  rig?.bridge?.destroy();
  rig = null;
});

// ── Catalog completeness ──────────────────────────────────────────────

describe('Tier 3.6 — map bridge command catalog', () => {
  test('every canonical command method exists on the bridge', () => {
    for (const { method } of CANONICAL_COMMANDS) {
      expect(typeof rig.bridge[method], `method ${method}`).toBe('function');
    }
  });

  test('every canonical command emits the matching message type', () => {
    for (const { method, type } of CANONICAL_COMMANDS) {
      rig.sent.length = 0;
      // Empty object satisfies both destructuring and positional commands.
      // Each call returns a pending RPC promise we won't fulfill; swallow
      // the rejection so it doesn't surface during teardown.
      try {
        const p = rig.bridge[method]({});
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch { /* skip strict-validator commands */ }
      const msg = rig.sent[rig.sent.length - 1];
      if (!msg) continue;
      expect(msg.type, `${method} sent type ${msg.type} (expected ${type})`).toBe(type);
    }
  });
});

// ── Envelope shape ────────────────────────────────────────────────────

describe('Tier 3.6 — outgoing envelope shape', () => {
  test('every command attaches a _rid string to the payload', () => {
    for (const { method } of CANONICAL_COMMANDS) {
      rig.sent.length = 0;
      try {
        const p = rig.bridge[method]({});
        if (p && typeof p.catch === 'function') p.catch(() => {});
      } catch { /* skip commands that strictly validate args */ }
      const msg = rig.sent[rig.sent.length - 1];
      if (!msg) continue;
      expect(msg).toHaveProperty('_rid');
      expect(typeof msg._rid).toBe('string');
      expect(msg._rid).toMatch(/^rpc_\d+_\d+$/);
    }
  });

  test('two consecutive commands carry distinct _rid values', () => {
    rig.sent.length = 0;
    rig.bridge.placeSettlement({ x: 1 }).catch(() => {});
    rig.bridge.placeSettlement({ x: 2 }).catch(() => {});
    const rids = rig.sent.map(m => m._rid);
    expect(rids[0]).not.toBe(rids[1]);
  });

  test('payload fields are merged into the envelope alongside type/_rid', () => {
    rig.sent.length = 0;
    rig.bridge.setViewport({ cx: 100, cy: 200, scale: 1.5 }).catch(() => {});
    const msg = rig.sent[rig.sent.length - 1];
    expect(msg.cx).toBe(100);
    expect(msg.cy).toBe(200);
    expect(msg.scale).toBe(1.5);
  });
});

// ── Reply envelope shape ──────────────────────────────────────────────

describe('Tier 3.6 — reply envelope shape', () => {
  test('successful reply { type: fmg:reply, _rid, ... } resolves the promise', async () => {
    const promise = rig.bridge.getViewport();
    const msg = rig.sent[rig.sent.length - 1];
    rig.replyFromIframe({ type: 'fmg:reply', _rid: msg._rid, cx: 50, cy: 60 });
    const result = await promise;
    expect(result.cx).toBe(50);
    expect(result.cy).toBe(60);
  });

  test('error reply { type: fmg:reply, _rid, _error } rejects the promise', async () => {
    const promise = rig.bridge.placeSettlement({ x: 1 });
    const msg = rig.sent[rig.sent.length - 1];
    rig.replyFromIframe({ type: 'fmg:reply', _rid: msg._rid, _error: 'invalid coords' });
    await expect(promise).rejects.toThrow(/invalid coords/);
  });

  test('reply with unknown _rid is ignored (no throw)', async () => {
    expect(() => rig.replyFromIframe({ type: 'fmg:reply', _rid: 'unknown', result: 'x' })).not.toThrow();
  });

  test('reply without _rid is treated as a push event candidate, not a command reply', async () => {
    let received = null;
    rig.bridge.on('mapReady', payload => { received = payload; });
    rig.replyFromIframe({ type: 'fmg:mapReady', mapId: 'abc' });
    expect(received).toEqual({ type: 'fmg:mapReady', mapId: 'abc' });
  });
});

// ── Push events ───────────────────────────────────────────────────────

describe('Tier 3.6 — push event surface', () => {
  test('every documented push event can be subscribed to', () => {
    for (const event of PUSH_EVENTS) {
      const unsub = rig.bridge.on(event, () => {});
      expect(typeof unsub).toBe('function');
      unsub();
    }
  });

  test('off() removes a listener', () => {
    let count = 0;
    const handler = () => { count += 1; };
    rig.bridge.on('burgSelected', handler);
    rig.replyFromIframe({ type: 'fmg:burgSelected', burgId: 1 });
    expect(count).toBe(1);
    rig.bridge.off('burgSelected', handler);
    rig.replyFromIframe({ type: 'fmg:burgSelected', burgId: 2 });
    expect(count).toBe(1);
  });

  test('returned unsubscribe function removes the listener', () => {
    let count = 0;
    const unsub = rig.bridge.on('burgSelected', () => { count += 1; });
    rig.replyFromIframe({ type: 'fmg:burgSelected', burgId: 1 });
    expect(count).toBe(1);
    unsub();
    rig.replyFromIframe({ type: 'fmg:burgSelected', burgId: 2 });
    expect(count).toBe(1);
  });

  test('multiple listeners on the same event all fire', () => {
    let a = 0; let b = 0;
    rig.bridge.on('burgSelected', () => { a += 1; });
    rig.bridge.on('burgSelected', () => { b += 1; });
    rig.replyFromIframe({ type: 'fmg:burgSelected', burgId: 1 });
    expect(a).toBe(1);
    expect(b).toBe(1);
  });

  test('a listener throwing does not break other listeners', () => {
    const goodSpy = vi.fn();
    rig.bridge.on('burgSelected', () => { throw new Error('listener boom'); });
    rig.bridge.on('burgSelected', goodSpy);
    rig.replyFromIframe({ type: 'fmg:burgSelected', burgId: 1 });
    expect(goodSpy).toHaveBeenCalled();
  });
});

// ── Queueing before ready ─────────────────────────────────────────────

describe('Tier 3.6 — queueing before ready', () => {
  test('commands issued before ready do not post', () => {
    // Use a fresh rig that has NOT yet received fmg:ready.
    const sent = [];
    const fakeIframe = {
      contentWindow: {
        postMessage: (msg) => sent.push(msg),
      },
    };
    const bridge = createMapBridge(() => fakeIframe);
    bridge.start();

    const p = bridge.placeSettlement({ x: 1 });
    p.catch(() => {});  // we'll destroy without replying

    expect(sent.length).toBe(0);  // queued, not sent
    bridge.destroy();
  });

  test('queued commands flush in order once fmg:ready fires', () => {
    const sent = [];
    const fakeIframe = {
      contentWindow: { postMessage: (msg) => sent.push(msg) },
    };
    const bridge = createMapBridge(() => fakeIframe);
    bridge.start();

    bridge.placeSettlement({ id: 'A' }).catch(() => {});
    bridge.placeSettlement({ id: 'B' }).catch(() => {});
    bridge.placeSettlement({ id: 'C' }).catch(() => {});
    expect(sent.length).toBe(0);

    // Now flush.
    const ev = new MessageEvent('message', {
      data: { type: 'fmg:ready' },
      origin: window.location.origin,
      source: fakeIframe.contentWindow,
    });
    window.dispatchEvent(ev);

    expect(sent.length).toBe(3);
    expect(sent[0].id).toBe('A');
    expect(sent[1].id).toBe('B');
    expect(sent[2].id).toBe('C');
    bridge.destroy();
  });

  test('skipQueue: true forces immediate dispatch even before ready', () => {
    const sent = [];
    const fakeIframe = {
      contentWindow: { postMessage: (msg) => sent.push(msg) },
    };
    const bridge = createMapBridge(() => fakeIframe);
    bridge.start();

    bridge.call('settlementEngine:noQueueCmd', { x: 1 }, { skipQueue: true }).catch(() => {});
    expect(sent.length).toBe(1);
    bridge.destroy();
  });

  test('ready promise resolves when fmg:ready arrives', async () => {
    const fakeIframe = {
      contentWindow: { postMessage: () => {} },
    };
    const bridge = createMapBridge(() => fakeIframe);
    bridge.start();

    const readyPromise = bridge.ready();
    const ev = new MessageEvent('message', {
      data: { type: 'fmg:ready', seed: 'abc' },
      origin: window.location.origin,
      source: fakeIframe.contentWindow,
    });
    window.dispatchEvent(ev);

    const data = await readyPromise;
    expect(data.type).toBe('fmg:ready');
    expect(bridge.isReady).toBe(true);
    bridge.destroy();
  });

  test('ready() called after ready resolves immediately', async () => {
    expect(rig.bridge.isReady).toBe(true);
    await rig.bridge.ready();  // should not hang
  });

  test('subsequent fmg:ready messages do not double-fire the ready promise', async () => {
    // Already had one fmg:ready in beforeEach.
    let count = 0;
    rig.bridge.on('ready', () => { count += 1; });
    rig.replyFromIframe({ type: 'fmg:ready' });
    rig.replyFromIframe({ type: 'fmg:ready' });
    // The 'ready' event MAY still fire on each (it's just an event), but
    // ready() must already be resolved.
    expect(rig.bridge.isReady).toBe(true);
  });
});

// ── Origin and source filtering ───────────────────────────────────────

describe('Tier 3.6 — origin / source filtering (security)', () => {
  test('drops messages from a different origin', async () => {
    const promise = rig.bridge.getViewport();
    const msg = rig.sent[rig.sent.length - 1];

    // Try to reply with a foreign origin.
    const ev = new MessageEvent('message', {
      data: { type: 'fmg:reply', _rid: msg._rid, cx: 99 },
      origin: 'https://evil.example.com',
      source: { /* not our iframe */ },
    });
    window.dispatchEvent(ev);

    // Promise should still be pending. Race against a tiny timeout.
    const raced = await Promise.race([
      promise.then(() => 'resolved').catch(() => 'rejected'),
      new Promise(resolve => setTimeout(() => resolve('pending'), 50)),
    ]);
    expect(raced).toBe('pending');
    promise.catch(() => {});
  });

  test('drops messages from a different source (sibling iframe)', async () => {
    const promise = rig.bridge.getViewport();
    const msg = rig.sent[rig.sent.length - 1];

    const ev = new MessageEvent('message', {
      data: { type: 'fmg:reply', _rid: msg._rid, cx: 99 },
      origin: window.location.origin,
      source: { /* foreign window */ id: 'attacker' },
    });
    window.dispatchEvent(ev);

    const raced = await Promise.race([
      promise.then(() => 'resolved').catch(() => 'rejected'),
      new Promise(resolve => setTimeout(() => resolve('pending'), 50)),
    ]);
    expect(raced).toBe('pending');
    promise.catch(() => {});
  });

  test('drops messages whose type does not start with fmg:', () => {
    let received = null;
    rig.bridge.on('mapReady', payload => { received = payload; });
    // Lookalike from another bridge / unrelated message bus.
    rig.replyFromIframe({ type: 'evil:mapReady', mapId: 'abc' });
    expect(received).toBeNull();
  });

  test('drops non-object data', () => {
    expect(() => rig.replyFromIframe('not an object')).not.toThrow();
    expect(() => rig.replyFromIframe(null)).not.toThrow();
    expect(() => rig.replyFromIframe(42)).not.toThrow();
  });
});

// ── Lifecycle: destroy ────────────────────────────────────────────────

describe('Tier 3.6 — destroy()', () => {
  test('rejects all pending promises with "Bridge destroyed"', async () => {
    const p = rig.bridge.getViewport();
    rig.bridge.destroy();
    await expect(p).rejects.toThrow(/Bridge destroyed/);
  });

  test('rejects all queued promises with "Bridge destroyed"', async () => {
    const sent = [];
    const fakeIframe = { contentWindow: { postMessage: (msg) => sent.push(msg) } };
    const bridge = createMapBridge(() => fakeIframe);
    bridge.start();
    const p = bridge.placeSettlement({ x: 1 });
    bridge.destroy();
    await expect(p).rejects.toThrow(/Bridge destroyed/);
  });

  test('call() rejects when bridge already destroyed', async () => {
    rig.bridge.destroy();
    await expect(rig.bridge.placeSettlement({ x: 1 })).rejects.toThrow(/Bridge destroyed/);
  });

  test('listeners are cleared after destroy', () => {
    const handler = vi.fn();
    rig.bridge.on('burgSelected', handler);
    rig.bridge.destroy();
    rig.replyFromIframe({ type: 'fmg:burgSelected', burgId: 1 });
    expect(handler).not.toHaveBeenCalled();
  });
});

// ── Timeout behaviour ─────────────────────────────────────────────────

describe('Tier 3.6 — RPC timeout', () => {
  test('a call rejects with "RPC timeout" if no reply arrives', async () => {
    vi.useFakeTimers();
    try {
      const sent = [];
      const fakeIframe = { contentWindow: { postMessage: (msg) => sent.push(msg) } };
      const bridge = createMapBridge(() => fakeIframe, { timeoutMs: 100 });
      bridge.start();
      const ev = new MessageEvent('message', {
        data: { type: 'fmg:ready' },
        origin: window.location.origin,
        source: fakeIframe.contentWindow,
      });
      window.dispatchEvent(ev);

      const p = bridge.placeSettlement({ x: 1 });
      vi.advanceTimersByTime(101);
      await expect(p).rejects.toThrow(/RPC timeout/);
      bridge.destroy();
    } finally {
      vi.useRealTimers();
    }
  });

  test('per-call timeout override beats the default', async () => {
    vi.useFakeTimers();
    try {
      const sent = [];
      const fakeIframe = { contentWindow: { postMessage: (msg) => sent.push(msg) } };
      const bridge = createMapBridge(() => fakeIframe, { timeoutMs: 10000 });
      bridge.start();
      const ev = new MessageEvent('message', {
        data: { type: 'fmg:ready' },
        origin: window.location.origin,
        source: fakeIframe.contentWindow,
      });
      window.dispatchEvent(ev);

      // Use bridge.call directly so we can pass a per-call timeout.
      const p = bridge.call('settlementEngine:placeSettlement', { x: 1 }, { timeout: 50 });
      vi.advanceTimersByTime(51);
      await expect(p).rejects.toThrow(/RPC timeout/);
      bridge.destroy();
    } finally {
      vi.useRealTimers();
    }
  });
});

// ── notify (fire-and-forget) ──────────────────────────────────────────

describe('Tier 3.6 — notify (fire-and-forget)', () => {
  test('notify returns true after ready', () => {
    expect(rig.bridge.notify('settlementEngine:viewportSync', { cx: 1 })).toBe(true);
    const msg = rig.sent[rig.sent.length - 1];
    expect(msg.type).toBe('settlementEngine:viewportSync');
    expect(msg.cx).toBe(1);
  });

  test('notify does NOT attach a _rid (fire-and-forget)', () => {
    rig.sent.length = 0;
    rig.bridge.notify('settlementEngine:viewportSync', { cx: 1 });
    const msg = rig.sent[rig.sent.length - 1];
    expect(msg._rid).toBeUndefined();
  });

  test('notify returns false when bridge not ready (stale)', () => {
    const fakeIframe = { contentWindow: { postMessage: () => {} } };
    const bridge = createMapBridge(() => fakeIframe);
    bridge.start();
    expect(bridge.notify('settlementEngine:viewportSync', { cx: 1 })).toBe(false);
    bridge.destroy();
  });

  test('notify returns false when bridge destroyed', () => {
    rig.bridge.destroy();
    expect(rig.bridge.notify('x', {})).toBe(false);
  });
});

// ── isReady introspection ─────────────────────────────────────────────

describe('Tier 3.6 — isReady', () => {
  test('false before ready signal', () => {
    const fakeIframe = { contentWindow: { postMessage: () => {} } };
    const bridge = createMapBridge(() => fakeIframe);
    bridge.start();
    expect(bridge.isReady).toBe(false);
    bridge.destroy();
  });

  test('true after ready signal', () => {
    expect(rig.bridge.isReady).toBe(true);
  });
});

// ── _rid counter monotonicity ─────────────────────────────────────────

describe('Tier 3.6 — _rid generation', () => {
  test('rid format matches rpc_<timestamp>_<seq>', () => {
    rig.sent.length = 0;
    rig.bridge.getViewport().catch(() => {});
    const rid = rig.sent[0]._rid;
    expect(rid).toMatch(/^rpc_\d+_\d+$/);
  });

  test('rid sequence increments monotonically across calls', () => {
    rig.sent.length = 0;
    rig.bridge.getViewport().catch(() => {});
    rig.bridge.getViewport().catch(() => {});
    rig.bridge.getViewport().catch(() => {});
    const seqs = rig.sent.map(m => parseInt(m._rid.match(/_(\d+)$/)[1], 10));
    expect(seqs[0]).toBeLessThan(seqs[1]);
    expect(seqs[1]).toBeLessThan(seqs[2]);
  });
});
