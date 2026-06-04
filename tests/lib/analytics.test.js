/**
 * @vitest-environment jsdom
 *
 * tests/lib/analytics.test.js - Tier 8.8 / 8.9 funnel + tracking contract.
 *
 * Verifies:
 *   1. EVENTS constants exist with the locked names (renames here break
 *      downstream dashboards, so we pin them).
 *   2. track() respects the whitelist + DNT.
 *   3. Funnel helpers fire the right combination of events given the
 *      anon-prior localStorage state.
 *   4. The provider dispatch hook fires when installed on window.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  EVENTS, track, Funnel, markAnonGenerated, hasPriorAnonGeneration,
} from '../../src/lib/analytics.js';

let providerCalls;
let originalProvider;

beforeEach(() => {
  // Replace the provider with a spy each test so we can assert
  // exactly which events fired and what props they carried.
  providerCalls = [];
  originalProvider = window.__sf_analytics_provider;
  window.__sf_analytics_provider = (event, props) => {
    providerCalls.push({ event, props });
  };
  // Clear storage between tests so anon-prior flags don't leak.
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch { /* ignore */ }
});

afterEach(() => {
  window.__sf_analytics_provider = originalProvider;
  vi.restoreAllMocks();
});

// ── Event constants ───────────────────────────────────────────────────────
describe('Tier 8.8 - EVENTS inventory', () => {
  it('exposes the minimum 4-event funnel', () => {
    expect(EVENTS.HOMEPAGE_VIEW).toBe('homepage_view');
    expect(EVENTS.ANONYMOUS_GENERATION_COMPLETED).toBe('anonymous_generation_completed');
    expect(EVENTS.SIGNUP_AFTER_ANON).toBe('signup_after_anon');
    expect(EVENTS.PAID_AFTER_ANON).toBe('paid_after_anon');
  });

  it('exposes the full Tier 8.9 schema (19 total)', () => {
    const required = [
      'HOMEPAGE_VIEW',
      'ANONYMOUS_GENERATION_STARTED', 'ANONYMOUS_GENERATION_COMPLETED',
      'DOSSIER_PREVIEW_VIEWED', 'HOW_SIMULATED_OPENED',
      'SIGNUP_GATE_SEEN', 'SIGNUP_STARTED', 'SIGNUP_COMPLETED', 'SIGNUP_AFTER_ANON',
      'SETTLEMENT_SAVED', 'PDF_EXPORT_CLICKED',
      'SINGLE_DOSSIER_CHECKOUT_STARTED', 'SINGLE_DOSSIER_PURCHASED',
      'PREMIUM_MODAL_SEEN', 'PREMIUM_CHECKOUT_STARTED', 'PREMIUM_PURCHASED',
      'AI_NARRATIVE_CLICKED', 'AI_NARRATIVE_COMPLETED', 'CREDITS_EXHAUSTED',
      'NEIGHBOR_PREVIEW_CLICKED', 'UPGRADE_AFTER_NEIGHBOR_CLICKED',
      'PAID_AFTER_ANON',
    ];
    for (const k of required) {
      expect(EVENTS).toHaveProperty(k);
      expect(typeof EVENTS[k]).toBe('string');
    }
  });

  it('event names are snake_case stable strings', () => {
    for (const [, value] of Object.entries(EVENTS)) {
      expect(value).toMatch(/^[a-z][a-z0-9_]*$/);
    }
  });
});

// ── track() ───────────────────────────────────────────────────────────────
describe('Tier 8.8 - track()', () => {
  it('fires known events through the provider', () => {
    track(EVENTS.HOMEPAGE_VIEW);
    expect(providerCalls).toHaveLength(1);
    expect(providerCalls[0].event).toBe('homepage_view');
  });

  it('passes props to the provider', () => {
    track(EVENTS.ANONYMOUS_GENERATION_COMPLETED, { tier: 'town' });
    expect(providerCalls[0].props).toEqual({ tier: 'town' });
  });

  it('rejects unknown events (catches call-site typos)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    track('mistyped_event_name', { foo: 1 }); // eslint-disable-line analytics/funnel-event-contract -- intentional raw string: this test proves the runtime whitelist drops unknown events
    expect(providerCalls).toHaveLength(0);
    expect(warn).toHaveBeenCalled();
  });

  it('ignores empty / non-string events', () => {
    track(null);
    track(undefined);
    track(''); // eslint-disable-line analytics/funnel-event-contract -- intentional empty string: this test proves track() ignores falsy/non-string events
    track(42);
    expect(providerCalls).toHaveLength(0);
  });

  it('respects DNT when set', () => {
    Object.defineProperty(navigator, 'doNotTrack', { value: '1', configurable: true });
    track(EVENTS.HOMEPAGE_VIEW);
    expect(providerCalls).toHaveLength(0);
    Object.defineProperty(navigator, 'doNotTrack', { value: null, configurable: true });
  });
});

// ── Funnel helpers ────────────────────────────────────────────────────────
describe('Tier 8.8 - Funnel helpers', () => {
  // P-fix - Funnel must expose a generic `track` passthrough alongside
  // the four critical helpers. The critique-implementation components
  // call `Funnel.track(EVENTS.X, props)` directly. Without this contract
  // they crash at module-init in production (this regression was caught
  // by the deploy: `m.track is not a function`).
  //
  // Use a real event name from EVENTS - `track` whitelists against the
  // registry to catch typos, so a synthetic event name would be dropped.
  it('exposes generic track() passthrough', () => {
    expect(typeof Funnel.track).toBe('function');
    Funnel.track(EVENTS.WOW_REVEAL_SHOWN, { foo: 'bar' });
    const matching = providerCalls.find(c => c.event === EVENTS.WOW_REVEAL_SHOWN);
    expect(matching).toBeTruthy();
    expect(matching.props).toEqual({ foo: 'bar' });
  });

  it('homepageView fires once per session, not per call', () => {
    Funnel.homepageView();
    Funnel.homepageView();
    Funnel.homepageView();
    expect(providerCalls.filter(c => c.event === 'homepage_view')).toHaveLength(1);
  });

  it('anonGenerationCompleted marks the anon-prior flag', () => {
    expect(hasPriorAnonGeneration()).toBe(false);
    Funnel.anonGenerationCompleted({ tier: 'hamlet' });
    expect(hasPriorAnonGeneration()).toBe(true);
    expect(providerCalls[0].event).toBe('anonymous_generation_completed');
    expect(providerCalls[0].props).toEqual({ tier: 'hamlet' });
  });

  it('signupCompleted fires SIGNUP_AFTER_ANON only when anon-prior is true', async () => {
    // SHA-256 hashing is async; both Funnel.signupCompleted dispatches
    // fire as separate microtasks and may resolve in either order.
    // Assert SET membership rather than array order - the contract is
    // "these events fire", not "in this exact sequence."
    Funnel.signupCompleted({ userId: 'u1' });
    await new Promise(r => setTimeout(r, 10));
    expect(new Set(providerCalls.map(c => c.event))).toEqual(new Set(['signup_completed']));
    // Now mark anon and try again.
    markAnonGenerated();
    providerCalls.length = 0;
    Funnel.signupCompleted({ userId: 'u2' });
    await new Promise(r => setTimeout(r, 10));
    expect(new Set(providerCalls.map(c => c.event)))
      .toEqual(new Set(['signup_completed', 'signup_after_anon']));
  });

  it('paidAction fires PAID_AFTER_ANON only when anon-prior is true', () => {
    Funnel.paidAction({ kind: 'single_dossier' });
    expect(providerCalls).toHaveLength(0);  // no anon prior → no event

    markAnonGenerated();
    Funnel.paidAction({ kind: 'single_dossier' });
    expect(providerCalls).toHaveLength(1);
    expect(providerCalls[0].event).toBe('paid_after_anon');
    expect(providerCalls[0].props).toEqual({ kind: 'single_dossier' });
  });
});

// ── Provider dispatch ─────────────────────────────────────────────────────
describe('Tier 8.8 - Provider dispatch', () => {
  it('does not throw when no provider is installed', () => {
    delete window.__sf_analytics_provider;
    // In dev this logs; in prod it's silent. Either way no throw.
    expect(() => track(EVENTS.HOMEPAGE_VIEW)).not.toThrow();
  });

  it('isolates provider errors (a failing provider does not break track)', () => {
    window.__sf_analytics_provider = () => { throw new Error('boom'); };
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => track(EVENTS.HOMEPAGE_VIEW)).not.toThrow();
    expect(warn).toHaveBeenCalled();
  });
});
