/** @vitest-environment jsdom */
/**
 * copyGuard.test.js — the content-copy deterrent.
 *
 * Pins the contract: ordinary page text is blocked from copy/cut/right-click
 * and selection is disabled (the html.copy-guard class), while form controls,
 * [data-allow-copy] subtrees, and elevated operators stay fully copyable, and
 * the whole thing no-ops when the flag is off.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';

// Mutable mock store: drive isElevated() + provide subscribeWithSelector.
const state = { isElevated: () => false, auth: { role: 'user' } };
vi.mock('../../src/store/index.js', () => {
  const useStore = { getState: () => state, subscribe: () => () => {} };
  return { useStore };
});

// Flag on by default; one test flips it off before install.
let flagOn = true;
vi.mock('../../src/lib/flags.js', () => ({
  flag: (name) => (name === 'copyGuard' ? flagOn : false),
}));

import { installCopyGuard, removeCopyGuard } from '../../src/lib/copyGuard.js';

// jsdom has no ClipboardEvent; a cancelable Event with a pinned target is
// enough to exercise the capture-phase guard. Returns whether it was blocked.
function fire(type, target) {
  const ev = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperty(ev, 'target', { value: target, configurable: true });
  document.dispatchEvent(ev);
  return ev.defaultPrevented;
}
const el = (tag, attrs = {}) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  document.body.appendChild(n);
  return n;
};

describe('copyGuard', () => {
  beforeEach(() => {
    flagOn = true;
    state.isElevated = () => false;
    document.body.innerHTML = '';
    document.documentElement.classList.remove('copy-guard');
  });
  afterEach(() => removeCopyGuard());

  it('disables selection site-wide (adds the copy-guard class)', () => {
    installCopyGuard();
    expect(document.documentElement.classList.contains('copy-guard')).toBe(true);
  });

  it('blocks copy, cut, and right-click on ordinary content', () => {
    installCopyGuard();
    const p = el('p');
    expect(fire('copy', p)).toBe(true);
    expect(fire('cut', p)).toBe(true);
    expect(fire('contextmenu', p)).toBe(true);
  });

  it('leaves form controls fully copyable', () => {
    installCopyGuard();
    expect(fire('copy', el('input'))).toBe(false);
    expect(fire('copy', el('textarea'))).toBe(false);
  });

  it('leaves [data-allow-copy] subtrees copyable', () => {
    installCopyGuard();
    const wrap = el('div', { 'data-allow-copy': '' });
    const span = document.createElement('span');
    wrap.appendChild(span);
    expect(fire('copy', span)).toBe(false);
  });

  it('exempts elevated operators (full selection + clipboard)', () => {
    state.isElevated = () => true;
    installCopyGuard();
    expect(document.documentElement.classList.contains('copy-guard')).toBe(false);
    expect(fire('copy', el('p'))).toBe(false);
    expect(fire('contextmenu', el('p'))).toBe(false);
  });

  it('no-ops entirely when the flag is off', () => {
    flagOn = false;
    expect(installCopyGuard()).toBeUndefined();
    expect(document.documentElement.classList.contains('copy-guard')).toBe(false);
    expect(fire('copy', el('p'))).toBe(false);
  });
});
