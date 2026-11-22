/** @vitest-environment jsdom */
/**
 * notFoundNotice.test.jsx — A DEAD LINK NO LONGER LOOKS LIKE A LINK THAT WORKED.
 *
 * ── THE DEFECT (REVIEW-P F11, the anonymous public-path walk, 2026-09-20) ─────
 * ⛔ NO GATE REFUSES SILENTLY, AND A ROUTER IS A GATE (ODQ §934.24(c)). The walk opened
 * `/this-page-does-not-exist` on both viewports and measured `href: /create`,
 * `title: SettlementForge`, `notices: []`, `saysNotFound: false`
 * (`J-notfound-{phone,desktop}.png`). `lib/routes.js` had returned `notFound: true` for
 * that address all along; its only consumer was App's canonical-URL upgrade, which
 * rewrote the address and dropped the flag on the floor.
 *
 * ── WHAT IS PROVED HERE, IN TWO REGISTERS ─────────────────────────────────────
 *   THE LATCH  — hooks/useMissedPath.js is driven over the REAL history + route store,
 *                because the whole reason it exists is that `notFound` survives one
 *                render: a test against a hand-held flag would prove the opposite of
 *                the property. The rewrite that erases the flag is performed here
 *                exactly as App performs it, and the fact must outlive it.
 *   THE LINE   — the leaf renders the registered reason with the address in it, derived
 *                through `refusalCopy`, and the reader can close it.
 *
 * ⚠ THE EFFECT ORDER IS THE FRAGILE PART and it has its own arm: both effects run on
 * the first commit, so a clear declared after the latch would wipe the very fact a
 * not-found first paint had just recorded.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { codeOnly } from '../helpers/codeOnlySource.js';

import { REFUSAL_REASONS } from '../../src/lib/refusalReasons.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { t } from '../../src/copy/index.js';

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));

const MISSED = '/this-page-does-not-exist';

afterEach(() => { cleanup(); vi.restoreAllMocks(); window.history.replaceState(null, '', '/'); });

describe('THE LATCH — the fact outlives the flag that carried it', () => {
  /** A probe that renders whatever the hook is holding, so the DOM is the readout. */
  async function mountProbe() {
    const useMissedPath = (await import('../../src/hooks/useMissedPath.js')).default;
    function Probe() {
      const { missedPath, dismiss } = useMissedPath();
      return (
        <div>
          <span data-testid="missed">{missedPath || 'none'}</span>
          <button type="button" onClick={dismiss}>drop it</button>
        </div>
      );
    }
    render(<Probe />);
  }

  test('an unknown address is kept after the URL is canonicalised away', async () => {
    window.history.replaceState(null, '', MISSED);
    await mountProbe();
    expect(screen.getByTestId('missed').textContent).toBe(MISSED);

    // Exactly what App's canonical-URL effect does next, and the reason a notice keyed
    // straight to `notFound` would appear and vanish inside a frame.
    const { replacePath } = await import('../../src/hooks/useRoute.js');
    act(() => { replacePath('/create'); });
    expect(
      screen.getByTestId('missed').textContent,
      'the rewrite erased the fact along with the flag',
    ).toBe(MISSED);
  });

  test('a SECOND unknown address, with no view change between, names the newer one', async () => {
    // ⛔ THIS ARM EXISTS BECAUSE ITS ABSENCE WAS MEASURED (2026-09-20). The red-first proof
    // deleted the latch BRANCH and this file stayed green: every other arm mounts fresh at
    // a bad address, which the hook's INITIAL state covers on its own. The branch is only
    // reachable by a second unknown address arriving while `view` stays the default — the
    // exact sequence a reader produces by mistyping twice — so nothing was proving it.
    const SECOND = '/also-not-a-page';
    window.history.replaceState(null, '', MISSED);
    await mountProbe();
    expect(screen.getByTestId('missed').textContent).toBe(MISSED);

    const { replacePath } = await import('../../src/hooks/useRoute.js');
    act(() => { replacePath('/create'); });          // the canonical rewrite clears the flag
    act(() => { replacePath(SECOND); });             // …and a second dead link arrives
    expect(
      screen.getByTestId('missed').textContent,
      'the second unknown address was swallowed by the first one\'s latch',
    ).toBe(SECOND);
  });

  test('CONTROL: a real page latches nothing', async () => {
    window.history.replaceState(null, '', '/pricing');
    await mountProbe();
    expect(screen.getByTestId('missed').textContent).toBe('none');
  });

  test('the reader can put it down, and a new destination puts it down for them', async () => {
    window.history.replaceState(null, '', MISSED);
    await mountProbe();
    fireEvent.click(screen.getByRole('button', { name: /drop it/i }));
    expect(screen.getByTestId('missed').textContent).toBe('none');

    // …and arriving somewhere new ends the fact by itself: a refusal belongs to the
    // navigation that earned it, the same law App applies to `lastRefusal`.
    window.history.replaceState(null, '', MISSED);
    cleanup();
    await mountProbe();
    expect(screen.getByTestId('missed').textContent).toBe(MISSED);
    const { navigate } = await import('../../src/hooks/useRoute.js');
    // `scroll: false` — jsdom has no scrolling, and the arm is about the route signal.
    act(() => { navigate('pricing', { scroll: false }); });
    expect(screen.getByTestId('missed').textContent).toBe('none');
  });
});

describe('THE LINE — the address is quoted back, and it can be closed', () => {
  test('the notice names the address the router had no page for', async () => {
    const NotFoundNotice = (await import('../../src/components/NotFoundNotice.jsx')).default;
    render(<NotFoundNotice path={MISSED} onDismiss={() => {}} />);

    const said = (await screen.findByRole('alert')).textContent;
    expect(said).toContain(refusalCopy(REFUSAL_REASONS.PAGE_NOT_FOUND, { path: MISSED }).rubric);
    expect(said).toContain(MISSED);
    // anchored: `said` is proven two lines up to contain the rubric AND the address, so the collection is live.
    expect(said, 'the sentence left a placeholder at a reader').not.toMatch(/\{[a-z]+\}/i);
  });

  test('the line has an exit, and the exit is the reader\'s', async () => {
    const onDismiss = vi.fn();
    const NotFoundNotice = (await import('../../src/components/NotFoundNotice.jsx')).default;
    render(<NotFoundNotice path={MISSED} onDismiss={onDismiss} />);

    fireEvent.click(screen.getByRole('button', { name: t('common.close') }));
    expect(onDismiss).toHaveBeenCalled();
  });
});

describe('WIRING — the app really mounts it, and lazily', () => {
  // ⚠ READ OFF THE SOURCE, because mounting the whole application to observe one branch
  // buys a far larger harness than the claim is worth — the idiom refusalDoesNotTravel
  // uses for App's route effect. The matcher is driven over DOCTORED source in its own
  // arm, so a matcher that stopped matching reds here rather than in production.
  const APP_VIEWS = readFileSync(join(process.cwd(), 'src/AppViews.jsx'), 'utf8');

  /**
   * Does this source latch the missed path AND render the notice from it, LAZILY?
   * @param {string} raw
   */
  function mountsNotFoundNotice(raw) {
    const src = codeOnly(raw);
    // ⛔ THE LAZY CLAUSE READS RAW SOURCE, AND THAT IS NOT AN OVERSIGHT. `codeOnly` blanks
    // string CONTENTS on purpose (a call cannot execute from inside a quoted literal), and
    // a module specifier IS a string — so a path clause run through it can never match and
    // silently turns the whole matcher false, which is what happened on the first cut here:
    // every guard-the-guard below passed VACUOUSLY while the live arm convicted a cured
    // tree. The three USE claims read code; the DECLARATION claim reads the comment-stripped
    // source, where the specifier still exists.
    const declared = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
    return /useMissedPath\(\)/.test(src)
      && /\{\s*missedPath\s*&&/.test(src)
      && /<NotFoundNotice\b/.test(src)
      && /lazy\(\(\)\s*=>\s*import\('\.\/components\/NotFoundNotice\.jsx'\)\)/.test(declared);
  }

  test('AppViews latches the address and says the line', () => {
    expect(
      mountsNotFoundNotice(APP_VIEWS),
      'the view table no longer mounts the not-found line, so an unknown address is '
      + 'rewritten to /create with nothing said — REVIEW-P F11 is live again',
    ).toBe(true);
  });

  test('GUARD-THE-GUARD: the matcher convicts the four ways this could rot', () => {
    // The latch unbound.
    expect(mountsNotFoundNotice(APP_VIEWS.replace('useMissedPath()', 'noMissedPath()'))).toBe(false);
    // The mount deleted.
    expect(mountsNotFoundNotice(APP_VIEWS.replace('<NotFoundNotice', '<NothingHere'))).toBe(false);
    // The guard dropped, which would mount the leaf on every route.
    expect(mountsNotFoundNotice(APP_VIEWS.replace('{missedPath &&', '{true &&'))).toBe(false);
    // ⛔ MADE EAGER — the refusal machinery (RefusalNotice → ClerkNote → the copy
    // registry) would join this file's FIRST-PAINT closure, which is the reason
    // StaffOnlyPage beside it is lazy too.
    expect(mountsNotFoundNotice(APP_VIEWS.replace(
      "lazy(() => import('./components/NotFoundNotice.jsx'))",
      "require('./components/NotFoundNotice.jsx')"))).toBe(false);
  });
});
