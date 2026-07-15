/** @vitest-environment jsdom */
/**
 * mobileTapFloor.test.jsx — the MOBILE-ONLY 44px tap floor + the reactive
 * mobile-flag source of truth.
 *
 * Contract under test:
 *  1. useIsMobile / getIsMobile are backed by ONE shared matchMedia listener and
 *     update reactively when the media query flips (resize / orientation).
 *  2. Button: on mobile, minHeight floors to >=44; on desktop the existing
 *     SIZES (sm 32 / md 40 / lg 44) are UNCHANGED.
 *  3. IconButton: on mobile, the interactive box floors to >=44 in BOTH axes
 *     (min-width + min-height); on desktop the fixed box (sm 24 / md 28 / lg 36
 *     / xl 44) is UNCHANGED.
 *
 * jsdom has no matchMedia, so we install a controllable fake whose `matches`
 * and `change` dispatch we drive directly. The shared store memoises per
 * breakpoint, so each test resets module state via vi.resetModules + a fresh
 * matchMedia registry.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';

// ── Controllable matchMedia fake ─────────────────────────────────────────────
// One MediaQueryList per query string. `setMatches` flips the value and fires
// the registered 'change' listeners, exactly as a real resize/rotate would.
let mqls;
let addEventListenerCalls;

function installMatchMedia(initialMatches) {
  mqls = new Map();
  addEventListenerCalls = 0;
  window.matchMedia = vi.fn((query) => {
    let mql = mqls.get(query);
    if (mql) return mql;
    const listeners = new Set();
    mql = {
      media: query,
      matches: initialMatches,
      addEventListener: (_evt, fn) => { addEventListenerCalls += 1; listeners.add(fn); },
      removeEventListener: (_evt, fn) => { listeners.delete(fn); },
      __listenerCount: () => listeners.size,
      __setMatches: (next) => {
        mql.matches = next;
        listeners.forEach((fn) => fn({ matches: next }));
      },
    };
    mqls.set(query, mql);
    return mql;
  });
}

function setMatches(next) {
  // The hook subscribes at breakpoint 640 → query is `(max-width: 639px)`.
  for (const mql of mqls.values()) act(() => mql.__setMatches(next));
}

async function load() {
  // Fresh module state so the per-breakpoint store does not leak across tests.
  vi.resetModules();
  const useIsMobileMod = await import('../../src/hooks/useIsMobile.js');
  const Button = (await import('../../src/components/primitives/Button.jsx')).default;
  const IconButton = (await import('../../src/components/primitives/IconButton.jsx')).default;
  const { ChevronRight } = await import('lucide-react');
  return { useIsMobileMod, Button, IconButton, Icon: ChevronRight };
}

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('shared reactive mobile flag', () => {
  beforeEach(() => installMatchMedia(false));

  test('getIsMobile reads the shared matchMedia value', async () => {
    const { useIsMobileMod } = await load();
    expect(useIsMobileMod.getIsMobile(640)).toBe(false);
    setMatches(true);
    expect(useIsMobileMod.getIsMobile(640)).toBe(true);
  });

  test('useIsMobile updates reactively on a media-query flip', async () => {
    const { useIsMobileMod } = await load();
    const useIsMobile = useIsMobileMod.default;
    function Probe() {
      const mobile = useIsMobile();
      return <span data-testid="probe">{mobile ? 'mobile' : 'desktop'}</span>;
    }
    render(<Probe />);
    expect(screen.getByTestId('probe').textContent).toBe('desktop');
    setMatches(true);
    expect(screen.getByTestId('probe').textContent).toBe('mobile');
    setMatches(false);
    expect(screen.getByTestId('probe').textContent).toBe('desktop');
  });

  test('many consumers share a SINGLE listener (no per-consumer listener)', async () => {
    const { useIsMobileMod } = await load();
    const useIsMobile = useIsMobileMod.default;
    function Probe() { useIsMobile(); return null; }
    render(<div>{Array.from({ length: 50 }, (_, i) => <Probe key={i} />)}</div>);
    // The store attaches exactly one matchMedia 'change' listener for the 640
    // breakpoint regardless of how many hook instances subscribe.
    expect(addEventListenerCalls).toBe(1);
    const mql = mqls.get('(max-width: 639px)');
    expect(mql.__listenerCount()).toBe(1);
  });

  test('tabConstants.isMobile delegates to the shared source', async () => {
    vi.resetModules();
    const { isMobile } = await import('../../src/components/new/tabConstants.js');
    expect(isMobile()).toBe(false);
    setMatches(true);
    expect(isMobile()).toBe(true);
  });
});

describe('Button mobile tap floor', () => {
  test('desktop minHeight is unchanged per size', async () => {
    installMatchMedia(false);
    const { Button } = await load();
    render(
      <>
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
      </>,
    );
    expect(screen.getByRole('button', { name: 'sm' }).style.minHeight).toBe('32px');
    expect(screen.getByRole('button', { name: 'md' }).style.minHeight).toBe('40px');
    expect(screen.getByRole('button', { name: 'lg' }).style.minHeight).toBe('44px');
  });

  test('mobile floors every size to >=44px', async () => {
    installMatchMedia(true);
    const { Button } = await load();
    render(
      <>
        <Button size="sm">sm</Button>
        <Button size="md">md</Button>
        <Button size="lg">lg</Button>
      </>,
    );
    for (const name of ['sm', 'md', 'lg']) {
      const px = parseInt(screen.getByRole('button', { name }).style.minHeight, 10);
      expect(px).toBeGreaterThanOrEqual(44);
    }
  });

  test('re-floors live when the viewport rotates into mobile', async () => {
    installMatchMedia(false);
    const { Button } = await load();
    render(<Button size="sm">sm</Button>);
    expect(screen.getByRole('button', { name: 'sm' }).style.minHeight).toBe('32px');
    setMatches(true);
    expect(parseInt(screen.getByRole('button', { name: 'sm' }).style.minHeight, 10)).toBeGreaterThanOrEqual(44);
  });
});

describe('IconButton mobile tap floor', () => {
  test('desktop keeps the fixed box per size (both axes)', async () => {
    installMatchMedia(false);
    const { IconButton, Icon } = await load();
    render(
      <>
        <IconButton Icon={Icon} label="sm" size="sm" />
        <IconButton Icon={Icon} label="md" size="md" />
        <IconButton Icon={Icon} label="lg" size="lg" />
        <IconButton Icon={Icon} label="xl" size="xl" />
      </>,
    );
    const expected = { sm: '24px', md: '28px', lg: '36px', xl: '44px' };
    for (const [name, box] of Object.entries(expected)) {
      const el = screen.getByRole('button', { name });
      expect(el.style.width).toBe(box);
      expect(el.style.height).toBe(box);
      // No mobile min-* floor applied on desktop.
      expect(el.style.minWidth).toBe('');
      expect(el.style.minHeight).toBe('');
    }
  });

  test('mobile floors the box to >=44px in BOTH axes', async () => {
    installMatchMedia(true);
    const { IconButton, Icon } = await load();
    render(
      <>
        <IconButton Icon={Icon} label="sm" size="sm" />
        <IconButton Icon={Icon} label="xl" size="xl" />
      </>,
    );
    for (const name of ['sm', 'xl']) {
      const el = screen.getByRole('button', { name });
      expect(parseInt(el.style.minWidth, 10)).toBeGreaterThanOrEqual(44);
      expect(parseInt(el.style.minHeight, 10)).toBeGreaterThanOrEqual(44);
      // Fixed width/height yield to the min-* floor on mobile.
      expect(el.style.width).toBe('');
      expect(el.style.height).toBe('');
    }
  });

  test('preserves aria-label and pressed semantics under the floor', async () => {
    installMatchMedia(true);
    const { IconButton, Icon } = await load();
    render(<IconButton Icon={Icon} label="Toggle" size="md" pressed />);
    const el = screen.getByRole('button', { name: 'Toggle' });
    expect(el.getAttribute('aria-pressed')).toBe('true');
    expect(parseInt(el.style.minHeight, 10)).toBeGreaterThanOrEqual(44);
  });
});
