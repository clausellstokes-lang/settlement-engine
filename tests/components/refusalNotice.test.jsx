/** @vitest-environment jsdom */
/**
 * refusalNotice.test.jsx — EVERY REGISTERED REASON, THROUGH THE STORE AND ONTO A
 * SURFACE.
 *
 * The sibling walker (tests/lint/refusalNoticeCoverage.walker.test.js) proves the
 * WIRING is total: every registered reason has copy, a raiser and a render site. It
 * cannot prove that a reason actually reaches a reader, because it never runs the
 * lane and never mounts a component. That is this file.
 *
 * ── WHAT IS RUN, AND WHAT IS NOT MOCKED ────────────────────────────────────────
 * The generation lane is the REAL module (store/settlementGenerateAction.js) driven
 * against a hand-built store, so the gates under test are the gates that ship. The
 * anonymous counter is the REAL module too (lib/anonGenCounter.js) reading real
 * localStorage: a stubbed `anonAtCap: () => true` would pass just as happily against
 * a lane that had stopped asking it, which is the vacuity this whole car is about.
 *
 * Only the ENGINE is stubbed (`runGeneration`), because a real pipeline run per case
 * would put a minute on the gate and prove nothing about refusals.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

import { REFUSAL_REASONS, REFUSAL_REASON_IDS, refusalOf } from '../../src/lib/refusalReasons.js';
import { GENERATION_INTENT_SAMPLE_FORK } from '../../src/lib/generationIntent.js';
import RefusalNotice, { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import {
  DEFAULT_DAILY_REROLL_CAP, anonAtCap, getAnonFullCount, getAnonRerollCount,
  incrementAnonFull, incrementAnonReroll, resetAnonGenCounter,
} from '../../src/lib/anonGenCounter.js';

// The engine, stubbed at the transport seam the lane actually calls.
const engine = vi.hoisted(() => ({ run: vi.fn() }));
vi.mock('../../src/lib/generationClient.js', () => ({
  runGeneration: (...args) => engine.run(...args),
}));

beforeEach(() => {
  window.localStorage.clear();
  resetAnonGenCounter();
  engine.run = vi.fn(async () => ({
    result: {
      settlement: { name: 'Forged', tier: 'town' },
      preservation: null,
      resolvedConfig: { settType: 'town' },
      pipelineHistory: [],
    },
  }));
});
afterEach(() => { cleanup(); window.localStorage.clear(); vi.restoreAllMocks(); });

/**
 * A store the lane can drive: immer-free `set(fn)` over a plain object, which is all
 * the lane uses it for.
 */
function makeStore({ tier = 'anon', maxTier = 'town', settType = 'town' } = {}) {
  const RANK = { thorp: 0, hamlet: 1, village: 2, town: 3, city: 4, capital: 5, metropolis: 5 };
  const state = {
    config: { settType },
    institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
    importedNeighbour: null, settlement: null, locks: null, activeSaveId: null,
    randomSliderMode: false, auth: { tier, user: null }, lastRefusal: null,
    maxAllowedTier: () => maxTier,
    isTierAllowed: (t) => t === 'random' || t === 'custom' || RANK[t] <= RANK[maxTier],
  };
  const set = (fn) => { fn(state); };
  const get = () => state;
  return { state, set, get };
}

async function runLane(store, seed, options) {
  const { generateSettlementAction } = await import('../../src/store/settlementGenerateAction.js');
  try {
    return await generateSettlementAction(store.set, store.get, seed, options);
  } catch {
    return null;                               // the lane re-throws; the record is what matters
  }
}

describe('the refusal register reaches a reader', () => {
  test('every registered reason resolves to real words (no dotted key, no blank)', () => {
    expect(REFUSAL_REASON_IDS.length).toBeGreaterThanOrEqual(5);
    for (const reason of REFUSAL_REASON_IDS) {
      const copy = refusalCopy(reason, { size: 'City', max: 'Town' });
      expect(copy, `${reason} resolves to nothing`).not.toBeNull();
      expect(copy.rubric.length, `${reason} rubric is blank`).toBeGreaterThan(2);
      expect(copy.body.length, `${reason} body is blank`).toBeGreaterThan(20);
      // A dotted key path is what `t()` renders when it cannot resolve.
      expect(/^[a-z]+(\.[a-zA-Z]+)+$/.test(copy.body), `${reason} body is a raw key`).toBe(false);
      // An un-substituted placeholder is loud on purpose in `t()`; it must not ship.
      // A miss here is a real absence of `{placeholder}` in a real body, never an empty string:
      // anchored: copy.body is proven present and longer than 20 characters three lines up.
      expect(copy.body, `${reason} body has an unfilled placeholder`).not.toMatch(/\{[a-z]+\}/i);
    }
  });

  test('every registered reason RENDERS as an announced notice', () => {
    for (const reason of REFUSAL_REASON_IDS) {
      const { unmount } = render(<RefusalNotice refusal={refusalOf(reason, { size: 'City', max: 'Town' })} />);
      const alert = screen.getByRole('alert');
      expect(alert.textContent, `${reason} rendered nothing`).toContain(refusalCopy(reason).rubric);
      unmount();
    }
  });

  test('an unknown reason renders NOTHING rather than a key or an empty alert', () => {
    const { container } = render(<RefusalNotice refusal={{ reason: 'notARegisteredReason' }} />);
    expect(container.textContent).toBe('');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  test('no refusal at all renders nothing', () => {
    const { container } = render(<RefusalNotice refusal={null} />);
    expect(container.textContent).toBe('');
  });
});

describe('the lane records a reason for every gate it closes', () => {
  test('DAILY CAP: an anon at cap is refused, and the reason is recorded', async () => {
    incrementAnonFull();
    for (let i = 0; i < DEFAULT_DAILY_REROLL_CAP; i += 1) incrementAnonReroll();
    expect(anonAtCap(), 'the real counter did not reach its cap').toBe(true);

    const store = makeStore();
    const result = await runLane(store);
    expect(result).toBeNull();
    expect(store.state.lastRefusal).toEqual(refusalOf(REFUSAL_REASONS.DAILY_CAP));
    expect(engine.run, 'the engine ran despite the cap').not.toHaveBeenCalled();
  });

  test('TIER: a size above the ceiling is refused BEFORE the engine, naming the size and the ceiling', async () => {
    const store = makeStore({ settType: 'city', maxTier: 'town' });
    const result = await runLane(store);
    expect(result).toBeNull();
    expect(store.state.lastRefusal.reason).toBe(REFUSAL_REASONS.TIER);
    expect(store.state.lastRefusal.vars).toMatchObject({ size: 'City', max: 'Town' });
    expect(engine.run).not.toHaveBeenCalled();
    // …and it renders as words a reader can act on.
    render(<RefusalNotice refusal={store.state.lastRefusal} />);
    const said = screen.getByRole('alert').textContent;
    expect(said).toContain('City');
    expect(said).toContain('Town');
    expect(said).toMatch(/sign in/i);
  });

  test('GENERATION FAILED: a throw is recorded before it propagates', async () => {
    engine.run = vi.fn(async () => { throw new Error('the engine fell over'); });
    const store = makeStore({ tier: 'free', maxTier: 'capital' });
    await runLane(store);
    expect(store.state.lastRefusal.reason).toBe(REFUSAL_REASONS.GENERATION_FAILED);
  });

  test('STALE BUILD: a chunk failure is told apart from an ordinary one', async () => {
    // "Try once more" is FALSE advice for a tab that outlived a deploy.
    engine.run = vi.fn(async () => {
      throw new Error('Failed to fetch dynamically imported module: /assets/engine-abc.js');
    });
    const store = makeStore({ tier: 'free', maxTier: 'capital' });
    await runLane(store);
    expect(store.state.lastRefusal.reason).toBe(REFUSAL_REASONS.STALE_BUILD);
    render(<RefusalNotice refusal={store.state.lastRefusal} />);
    expect(screen.getByRole('alert').textContent).toMatch(/reload/i);
  });

  test('a fresh attempt clears the previous reason', async () => {
    const store = makeStore({ settType: 'city', maxTier: 'town' });
    await runLane(store);
    expect(store.state.lastRefusal).not.toBeNull();
    store.state.config.settType = 'town';
    await runLane(store);
    expect(store.state.lastRefusal, 'a stale accusation survived a successful run').toBeNull();
  });
});

describe('a sample fork is a curated seed, not a free generation (ODQ §934.24(b))', () => {
  test('UNDER AN EXHAUSTED CAP a fork lands, and the counter is BYTE-IDENTICAL after', async () => {
    incrementAnonFull();
    for (let i = 0; i < DEFAULT_DAILY_REROLL_CAP; i += 1) incrementAnonReroll();
    expect(anonAtCap()).toBe(true);
    const before = { full: getAnonFullCount(), reroll: getAnonRerollCount() };

    const store = makeStore();
    const forged = await runLane(store, 'seed-x', { intent: GENERATION_INTENT_SAMPLE_FORK });

    expect(forged, 'the fork was refused under the cap').not.toBeNull();
    expect(store.state.lastRefusal).toBeNull();
    // ⛔ BOTH LIFECYCLE PATHS. Skipping the READ without skipping the WRITE would let a
    // fork through and still burn the reader's allowance — the exemption passing its
    // first path and failing its second.
    expect({ full: getAnonFullCount(), reroll: getAnonRerollCount() })
      .toEqual(before);
  });

  test('THE TIER GATE STILL APPLIES to a fork', async () => {
    const store = makeStore({ settType: 'city', maxTier: 'town' });
    const forged = await runLane(store, 'seed-x', { intent: GENERATION_INTENT_SAMPLE_FORK });
    expect(forged).toBeNull();
    expect(store.state.lastRefusal.reason).toBe(REFUSAL_REASONS.TIER);
  });

  test('A REAL GENERATION under the cap still refuses — and still says so', async () => {
    incrementAnonFull();
    for (let i = 0; i < DEFAULT_DAILY_REROLL_CAP; i += 1) incrementAnonReroll();
    const store = makeStore();
    const result = await runLane(store);            // no intent: an ordinary generation
    expect(result).toBeNull();
    expect(store.state.lastRefusal.reason).toBe(REFUSAL_REASONS.DAILY_CAP);
  });

  test('the exemption FAILS CLOSED: an unrecognised intent is still capped', async () => {
    incrementAnonFull();
    for (let i = 0; i < DEFAULT_DAILY_REROLL_CAP; i += 1) incrementAnonReroll();
    const store = makeStore();
    // A typo, or an options bag from an older build.
    const result = await runLane(store, 'seed-x', { intent: 'sample-fork' });
    expect(result, 'a mistyped intent bought an exemption').toBeNull();
    expect(store.state.lastRefusal.reason).toBe(REFUSAL_REASONS.DAILY_CAP);
  });

  test('an ORDINARY anonymous generation still SPENDS the allowance', async () => {
    // The other half of the exemption: it must not have un-capped everything.
    const store = makeStore();
    const forged = await runLane(store);
    expect(forged).not.toBeNull();
    expect(getAnonFullCount(), 'a real generation no longer spends the allowance').toBe(1);
  });
});
