/**
 * @vitest-environment jsdom
 *
 * Security regression — the embedded FMG bridge (public/map/sf-bridge.js)
 * must only accept postMessage commands from its own origin AND from its
 * embedder (window.parent). Before the fix the listener validated only
 * `data.type.startsWith('settlementEngine:')`, so any window holding a ref
 * to the iframe could drive resetMap/loadSnapshot/etc.
 *
 * The bridge is a vanilla <script> IIFE that early-returns unless embedded
 * (window.parent !== window) and replies to every command via
 * window.parent.postMessage. We rig a distinct fake parent, load the IIFE
 * into this jsdom window, then dispatch crafted MessageEvents and assert
 * the handler only runs for {origin === own, source === window.parent}.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Resolved from the repo root (vitest cwd); jsdom rewrites import.meta.url
// to an http URL, so fileURLToPath would reject it here.
const BRIDGE_SRC = readFileSync(
  resolve(process.cwd(), 'public/map/sf-bridge.js'),
  'utf8',
);

/** Dispatch a getTemplates command; returns whether a reply was posted. */
function dispatchCommand({ origin, source }) {
  const event = new window.MessageEvent('message', {
    data: { type: 'settlementEngine:getTemplates', _rid: 'rid-1' },
  });
  // jsdom does not let MessageEvent carry a synthetic origin/source through
  // the constructor in a way the listener reads, so we pin them directly.
  Object.defineProperty(event, 'origin', { value: origin, configurable: true });
  Object.defineProperty(event, 'source', { value: source, configurable: true });
  window.dispatchEvent(event);
}

describe('sf-bridge postMessage origin + source validation', () => {
  let parentPostMessage;
  let fakeParent;
  let realParentDescriptor;

  beforeEach(() => {
    parentPostMessage = vi.fn();
    fakeParent = { postMessage: parentPostMessage };

    // Make the IIFE see itself as embedded (parent !== self) with a
    // controllable parent we can spy on.
    realParentDescriptor = Object.getOwnPropertyDescriptor(window, 'parent');
    Object.defineProperty(window, 'parent', { value: fakeParent, configurable: true });

    // Run the bridge IIFE against this window. window.eval binds globals to
    // the jsdom window so the 'message' listener registers here.
    window.eval(BRIDGE_SRC);

    // The IIFE may post load-time events (ready/burg-list hooks). Reset the
    // spy so each test only sees what its own dispatched command produces.
    parentPostMessage.mockClear();
  });

  afterEach(() => {
    if (realParentDescriptor) Object.defineProperty(window, 'parent', realParentDescriptor);
    vi.restoreAllMocks();
  });

  test('drops commands whose source is not the embedder (window.parent)', () => {
    // A stray window (popup / sibling iframe) with a ref to us, same origin.
    const attacker = { postMessage: vi.fn() };
    dispatchCommand({ origin: window.location.origin, source: attacker });
    expect(parentPostMessage).not.toHaveBeenCalled();
  });

  test('drops commands whose origin is not our own', () => {
    dispatchCommand({ origin: 'https://evil.example', source: fakeParent });
    expect(parentPostMessage).not.toHaveBeenCalled();
  });

  test('accepts a command from the embedder at our own origin', () => {
    dispatchCommand({ origin: window.location.origin, source: fakeParent });
    const reply = parentPostMessage.mock.calls
      .map(([payload]) => payload)
      .find((payload) => payload?._rid === 'rid-1');
    expect(reply).toMatchObject({ type: 'fmg:getTemplatesReply', _rid: 'rid-1' });
  });
});
