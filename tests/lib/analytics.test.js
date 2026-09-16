/**
 * @vitest-environment jsdom
 *
 * tests/lib/analytics.test.js — Tier 8.8 / 8.9 funnel + tracking contract.
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
import { setConsent } from '../../src/lib/consent.js';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

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
  // track() now gates on consent + DNT (consent.js). Establish a clean baseline
  // so these provider-dispatch assertions don't inherit DNT/consent state a
  // prior file in the same worker may have left set. (The DNT test below sets it
  // deliberately and the others assume telemetry is allowed.)
  try { Object.defineProperty(navigator, 'doNotTrack', { value: null, configurable: true }); } catch { /* ignore */ }
  setConsent({ essential: true, research: true });
});

afterEach(() => {
  window.__sf_analytics_provider = originalProvider;
  vi.restoreAllMocks();
});

// ── Event constants ───────────────────────────────────────────────────────
describe('Tier 8.8 — EVENTS inventory', () => {
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
describe('Tier 8.8 — track()', () => {
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
describe('Tier 8.8 — Funnel helpers', () => {
  // P-fix — Funnel must expose a generic `track` passthrough alongside
  // the four critical helpers. The critique-implementation components
  // call `Funnel.track(EVENTS.X, props)` directly. Without this contract
  // they crash at module-init in production (this regression was caught
  // by the deploy: `m.track is not a function`).
  //
  // Use a real event name from EVENTS — `track` whitelists against the
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
    // SHA-256 hashing is async; both Funnel.signupCompleted dispatches fire as
    // separate microtasks and may resolve in either order. POLL for the expected
    // events rather than a fixed sleep — a fixed wait flakes under full-suite load
    // when the async hash + microtask chain runs long. Assert SET membership
    // (the contract is "these events fire", not "in this exact sequence").
    const eventSet = () => new Set(providerCalls.map(c => c.event));
    const waitForCount = async (n, timeout = 1000) => {
      const start = Date.now();
      while (providerCalls.length < n && Date.now() - start < timeout) {
        await new Promise(r => setTimeout(r, 5));
      }
    };

    Funnel.signupCompleted({ userId: 'u1' });
    await waitForCount(1);
    expect(eventSet()).toEqual(new Set(['signup_completed']));
    // Now mark anon and try again.
    markAnonGenerated();
    providerCalls.length = 0;
    Funnel.signupCompleted({ userId: 'u2' });
    await waitForCount(2);
    expect(eventSet()).toEqual(new Set(['signup_completed', 'signup_after_anon']));
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
describe('Tier 8.8 — Provider dispatch', () => {
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

/**
 * THE EXPORT FUNNEL HAD A NUMERATOR AND NO DENOMINATOR.
 *
 * `PDF_EXPORT_CLICKED` is a frozen constant (analyticsEvents.js:88), is mirrored into
 * the edge bundle, has a row in the generated dictionary, and is asserted by name in
 * the schema pin above — and was EMITTED NOWHERE in src/. Its counterpart
 * `PDF_EXPORT_COMPLETED` fires from inside both exporters, so the funnel could report
 * successes against nothing. The taxonomy doc states the relationship as settled fact
 * ("existing `pdf_export_clicked` = intent, this = success",
 * docs/analytics-event-taxonomy.md:186), which made the gap invisible to a reader:
 * the documentation asserted a denominator that did not exist.
 *
 * A constant, a doc row and a name-assertion are exactly the three things that can all
 * be green while nothing emits, so the guard here is a SOURCE SCAN over the emitters:
 * every component that actually invokes an exporter must also emit the intent event.
 * That is the property that was false, and it is the one a future export surface can
 * silently break by copying a handler without the emit.
 */
describe('the PDF export funnel has a denominator (PDF_EXPORT_CLICKED is emitted)', () => {
  const EXPORT_CALL = /\bawait\s+generate(SettlementPDF|CampaignPDF|WorldBook)\s*\(/;

  function walkComponents(dir, out = []) {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walkComponents(p, out);
      else if (/\.jsx?$/.test(entry)) out.push(p);
    }
    return out;
  }

  const COMPONENTS = join(
    dirname(fileURLToPath(import.meta.url)), '..', '..', 'src', 'components',
  );
  const exportingFiles = walkComponents(COMPONENTS)
    .filter(p => EXPORT_CALL.test(readFileSync(p, 'utf8')))
    .map(p => relative(join(COMPONENTS, '..', '..'), p).replace(/\\/g, '/'))
    .sort();

  it('the scan finds the export surfaces at all (the guard is not vacuous)', () => {
    // anchored: if this ever drops to zero the scan has stopped matching and every
    // assertion below would pass over an empty list.
    expect(exportingFiles.length).toBeGreaterThanOrEqual(5);
  });

  it('every component that invokes an exporter emits PDF_EXPORT_CLICKED', () => {
    const missing = exportingFiles.filter(rel => !readFileSync(
      join(COMPONENTS, '..', '..', rel), 'utf8',
    ).includes('PDF_EXPORT_CLICKED'));
    expect(missing).toEqual([]);
  });

  it('the event is a real registry constant, not a bare string at the call site', () => {
    for (const rel of exportingFiles) {
      const src = readFileSync(join(COMPONENTS, '..', '..', rel), 'utf8');
      expect(src, `${rel} must emit via EVENTS.PDF_EXPORT_CLICKED`)
        .toMatch(/EVENTS\.PDF_EXPORT_CLICKED/);
    }
  });
});
