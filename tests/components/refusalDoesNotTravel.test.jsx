/** @vitest-environment jsdom */
/**
 * refusalDoesNotTravel.test.jsx — A REFUSAL BELONGS TO THE CLICK THAT RAISED IT.
 *
 * ── THE DEFECT (adversarial review of the second wave, MATERIAL) ────────────────
 * `lastRefusal` is ONE record on the store, and every surface that can receive a
 * refusal renders it on MOUNT. Only the surfaces that RAISE one clear it, and only at
 * click time. So a reader who was refused a city fork in the Library, and then opened
 * /create, met a standing accusation about a click they had made on another page —
 * a sentence with no cause anywhere in front of them.
 *
 * ── THE CURE, IN TWO HALVES, EACH PROVED SEPARATELY ────────────────────────────
 * The record is cleared on ROUTE CHANGE, in App's own `[view]` effect family (the
 * auth guard, the document head and the canonical-URL upgrade all key on the same
 * signal). That is two claims, and one arm each:
 *
 *   MECHANISM — clearing the record really takes the notice off a mounted surface.
 *     Driven against a REAL zustand store and a real surface, so it measures the
 *     render path rather than a mock's opinion of it.
 *   WIRING    — App really calls the clearer from an effect keyed on `view`. Read off
 *     App's source, because mounting the whole application to observe one effect buys
 *     a far larger harness than the claim is worth. The matcher is driven over a
 *     DOCTORED source in the same arm, so a matcher that stopped matching reds here.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, act } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { REFUSAL_REASONS, refusalOf } from '../../src/lib/refusalReasons.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { codeOnly } from '../helpers/codeOnlySource.js';

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));

/**
 * A REAL zustand store carrying the two keys the record lives on, so a component
 * subscribes the way it does in the app and a `clearRefusal()` from anywhere re-renders
 * every surface that was showing the reason.
 */
const useStore = create(immer((set) => ({
  generateSettlement: async () => null,
  updateConfig: () => {},
  auth: { tier: 'anon', user: null },
  lastRefusal: null,
  clearRefusal: () => set((s) => { s.lastRefusal = null; }),
})));
vi.mock('../../src/store/index.js', () => ({ useStore }));

afterEach(() => { cleanup(); });

describe('MECHANISM — clearing the record takes the sentence off the page', () => {
  test('a surface showing a refusal goes quiet when the record is cleared', async () => {
    const FoundingWorlds = (await import('../../src/components/generate/FoundingWorlds.jsx')).default;
    act(() => {
      useStore.setState((s) => { s.lastRefusal = refusalOf(REFUSAL_REASONS.TIER, { size: 'City', max: 'Town' }); });
    });
    render(<FoundingWorlds onNavigate={() => {}} />);

    // The reader arrives on a surface that did not raise this, and is accused anyway.
    expect(screen.getByRole('alert').textContent)
      .toContain(refusalCopy(REFUSAL_REASONS.TIER).rubric);

    // …which is exactly what App's route effect calls when the reader moves.
    act(() => { useStore.getState().clearRefusal(); });
    // anchored: the same query is proven on the three lines above to FIND the notice on
    // this very mount, so its absence here is the clearing rather than a dead selector.
    expect(screen.queryByRole('alert'), 'the refusal survived the route change').toBeNull();
  });
});

describe('WIRING — App clears it on every route change', () => {
  const APP = readFileSync(fileURLToPath(new URL('../../src/App.jsx', import.meta.url)), 'utf8');

  /**
   * Does this source bind the store's clearer AND call it from an effect keyed on `view`?
   * A function so the doctored controls below drive the same matcher the live arm does.
   * @param {string} raw
   */
  function clearsRefusalOnRoute(raw) {
    const src = codeOnly(raw);
    if (!/const\s+clearRefusal\s*=\s*useStore\(/.test(src)) return false;
    // Every useEffect body with its dependency array, non-greedily.
    const effects = src.match(/useEffect\(\s*\(\)\s*=>\s*\{[\s\S]*?\},\s*\[[^\]]*\]\s*\)/g) || [];
    return effects.some((block) => {
      const deps = block.slice(block.lastIndexOf('['));
      return /\bclearRefusal\??\.?\(/.test(block) && /\bview\b/.test(deps);
    });
  }

  test('the route effect is there, and it is keyed on the router\'s own signal', () => {
    expect(
      clearsRefusalOnRoute(APP),
      'App no longer clears `lastRefusal` on route change, so a refusal raised on one page '
      + 'follows the reader to the next and is rendered there with no cause in front of them',
    ).toBe(true);
  });

  test('GUARD-THE-GUARD: the matcher convicts the three ways this could rot', () => {
    // The binding removed.
    expect(clearsRefusalOnRoute(APP.replace(/const\s+clearRefusal\s*=\s*useStore\(/, 'const gone = useStore('))).toBe(false);
    // The effect re-keyed off the route (it would then run once and never again).
    expect(clearsRefusalOnRoute(APP.replace('  }, [view, clearRefusal]);', '  }, [clearRefusal]);'))).toBe(false);
    // The call commented out — and this is why the matcher reads CODE, not raw source.
    expect(clearsRefusalOnRoute(APP.replace('    clearRefusal?.();', '    // clearRefusal?.();'))).toBe(false);
  });
});
