/**
 * The child origin resolver is a classic script, not an ES module, because it
 * loads inside the vendored FMG document. Exercise the real bytes in isolated
 * JSDOM windows so deployed-host failure and localhost fallback are behavioral
 * facts rather than source-shape assertions.
 */

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { JSDOM } from 'jsdom';
import { describe, expect, it, vi } from 'vitest';

const SOURCE = readFileSync(resolve(process.cwd(), 'public/map/sf-origin.js'), 'utf8');

function boot(url) {
  const dom = new JSDOM('<!doctype html><body></body>', {
    url,
    runScripts: 'outside-only',
  });
  const postMessage = vi.fn();
  const fakeParent = { postMessage };
  Object.defineProperty(dom.window, 'parent', {
    configurable: true,
    value: fakeParent,
  });
  dom.window.eval(SOURCE);
  return {
    dom,
    contract: dom.window.__sfBridgeOrigin,
    fakeParent,
    postMessage,
  };
}

describe('public/map/sf-origin.js', () => {
  it('pins an explicit HTTPS parent and posts only to that exact origin', () => {
    const rig = boot(
      'https://map.settlementforge.com/map/index.html'
      + '?parentOrigin=https%3A%2F%2Fsettlementforge.com',
    );
    try {
      expect(rig.contract.parentOrigin).toBe('https://settlementforge.com');
      expect(rig.contract.postToParent({ type: 'fmg:ready' })).toBe(true);
      expect(rig.postMessage).toHaveBeenCalledWith(
        { type: 'fmg:ready' },
        'https://settlementforge.com',
      );
    } finally {
      rig.dom.window.close();
    }
  });

  it.each([
    'https://map.settlementforge.com/map/index.html',
    'https://map.settlementforge.com/map/index.html?parentOrigin=',
    'https://map.settlementforge.com/map/index.html?parentOrigin=javascript%3Aalert(1)',
    'https://map.settlementforge.com/map/index.html?parentOrigin=http%3A%2F%2Fevil.example',
    'https://map.settlementforge.com/map/index.html?parentOrigin=https%3A%2F%2Fsettlementforge.com%2Fworld',
    'https://map.settlementforge.com/map/index.html?parentOrigin=https%3A%2F%2Fsettlementforge.com&parentOrigin=https%3A%2F%2Fwww.settlementforge.com',
  ])('fails closed on a deployed host for %s', (url) => {
    const rig = boot(url);
    try {
      expect(rig.contract.parentOrigin).toBeNull();
      expect(rig.contract.postToParent({ type: 'fmg:ready' })).toBe(false);
      expect(rig.postMessage).not.toHaveBeenCalled();
    } finally {
      rig.dom.window.close();
    }
  });

  it('retains the no-query same-origin fallback on loopback only', () => {
    const rig = boot('http://localhost:4173/map/index.html');
    try {
      expect(rig.contract.parentOrigin).toBe('http://localhost:4173');
      rig.contract.postToParent({ type: 'fmg:ready' });
      expect(rig.postMessage).toHaveBeenCalledWith(
        { type: 'fmg:ready' },
        'http://localhost:4173',
      );
    } finally {
      rig.dom.window.close();
    }
  });
});
