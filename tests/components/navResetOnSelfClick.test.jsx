/**
 * @vitest-environment jsdom
 *
 * tests/components/navResetOnSelfClick.test.jsx — LD-11, NAV RESET-ON-SELF-CLICK
 * (owner-ordered 2026-08-02; built by LT38 car 5).
 *
 * THE ORDER: clicking a ribbon cell while ALREADY on its page returns that section
 * to its registered default, and THE MAP IS DATA ON THE ROUTE REGISTRY — "no
 * scattered per-page hacks". Before this car the tree had exactly one such hack,
 * an inline `settlements` case in App.jsx's handleNavClick, with a note beside it
 * promising "a store nonce that has not landed yet". So this suite pins the
 * DERIVATION, not a list: every ribbon section declares a reset kind on the same
 * `nav` block NAV itself is derived from, and the dispatch reads that declaration.
 *
 * WHAT EACH ARM IS FOR, and why it is shaped this way:
 *
 *   TOTALITY (both directions). Every NAV member declares a kind, and every
 *     declaration names a REAL nav member. A one-way check would pass a table that
 *     had grown a row for a tab that no longer exists, which is how a registry
 *     starts lying.
 *   THE DISPATCH. `navigateSelfClick` is the one chokepoint, so the route-kind and
 *     section-kind behaviours are exercised through it rather than through five
 *     component mounts that would each only prove their own wiring.
 *   THE DIRTY GUARD is the order's one BINDING SAFETY LAW ("reset NEVER silently
 *     discards work"), so it is driven on the REAL GenerateWizard through the REAL
 *     store: a generated-but-unsaved draft must raise the existing leave-confirm,
 *     and a clean section must reset with no dialog at all.
 *   PERSISTED PREFERENCES SURVIVE. The order splits navigation state from settings
 *     ("settings are not navigation; the two laws compose"), so a reset must leave
 *     a persisted preference standing.
 *   THE NEGATIVE CONTROL. An OFF-PAGE click must never reset, and it is the arm
 *     that keeps the rest honest: without it, a dispatch that reset on every click
 *     would pass every positive arm above.
 *
 * ⚠ THE ROUTE-KIND ARMS DRIVE THE REAL ROUTER over jsdom's history, not a mock.
 * The property under test is precisely that ONE act of re-navigation drops a
 * drill-in, a facet hub AND every query param, and a mocked `navigate` would have
 * asserted only that we called it — the exact vacuity this estate calls a false
 * instrument.
 */

import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';

import { NAV, NAV_RESETS, resetKindFor, RESET_ROUTE, RESET_SECTION, viewToPath } from '../../src/lib/routes.js';
import { navigateSelfClick } from '../../src/hooks/useRoute.js';

// The house idiom for store-touching mounts: analytics is stubbed so its lazy
// event-dictionary import can never race environment teardown (the welcomeJourney
// precedent).
//
// ⚠ `Funnel` IS A PROXY OF MEMOISED NO-OPS, not a hand-listed object, and the
// reason is a real failure this file took: a CLEAN reset lands on the Create
// landing, which mounts HomeHero, which calls `Funnel.homepageView()` — a method
// no hand-list would have thought to include, surfacing as an uncaught
// TypeError AFTER the assertions had already passed. A hand-listed stub of a
// namespace object is a list that goes stale silently; the proxy cannot.
vi.mock('../../src/lib/analytics.js', () => {
  const fns = new Map();
  return {
    track: vi.fn(),
    Funnel: new Proxy({}, {
      get: (_t, k) => {
        if (!fns.has(k)) fns.set(k, vi.fn());
        return fns.get(k);
      },
    }),
    EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
  };
});

describe('LD-11 — the reset map is DATA on the route registry', () => {
  test('TOTALITY, both directions: every ribbon section declares a kind, and every declaration names a real section', () => {
    const navIds = NAV.map((n) => n.id).sort();
    const declaredIds = Object.keys(NAV_RESETS).sort();

    // ANTI-VACUITY FIRST. If NAV were ever empty, every arm below would hold over
    // nothing at all and this file would be decoration.
    expect(navIds.length).toBeGreaterThanOrEqual(5);

    expect(
      declaredIds,
      'the declared reset map and the ribbon must be the same set of sections. A NAV'
      + ' member with no `reset` cannot be reset (the dispatch fails closed and the tab'
      + ' just re-navigates); a declaration for a section that is no longer in the'
      + ' ribbon is a row that has started lying.',
    ).toEqual(navIds);

    for (const id of navIds) {
      expect(
        [RESET_ROUTE, RESET_SECTION],
        `${id} declares an unknown reset kind ${JSON.stringify(resetKindFor(id))}`,
      ).toContain(resetKindFor(id));
    }
  });

  test('a view that is not a ribbon section declares nothing, and the dispatch says so', () => {
    // THE NEGATIVE CONTROL FOR THE TABLE ITSELF: `resetKindFor` must be reading the
    // nav blocks rather than answering for anything it is handed. `pricing`, `home`
    // and `account` are real routes that are deliberately NOT ribbon cells.
    for (const view of ['pricing', 'home', 'account', 'terms']) {
      expect(resetKindFor(view), `${view} is not a ribbon section and must declare no reset`).toBeUndefined();
    }
    expect(resetKindFor('not-a-view-at-all')).toBeUndefined();
  });

  test('Create is the only SECTION-kind row, and its reason is that its state is not in the URL', () => {
    // Recorded as an assertion rather than a comment because it is the load-bearing
    // half of the design: every other ribbon section's navigation state IS the URL,
    // so re-navigating is its whole reset. If a second section ever needs the
    // request channel, this arm is where that decision becomes visible.
    const sectionKind = NAV.map((n) => n.id).filter((id) => resetKindFor(id) === RESET_SECTION);
    expect(sectionKind).toEqual(['generate']);
  });
});

describe('LD-11 — the dispatch, driven over the real router', () => {
  const at = (href) => window.history.replaceState(null, '', href);

  beforeEach(() => {
    at('/');
    vi.restoreAllMocks();
  });

  test('a ROUTE-kind self-click drops a drill-in, a facet hub and every query param in one act', () => {
    // One act, three kinds of residue. Driving the real router is the point: a
    // mocked navigate could only have proved that we called it.
    const cases = [
      ['/settlements/abc-123', 'settlements'],
      ['/compendium/tannery', 'compendium'],
      ['/gallery/some-dossier-slug', 'gallery'],
      ['/gallery?tab=maps', 'gallery'],
      ['/compendium?mode=custom&cat=trade', 'compendium'],
      ['/about/what-this-is#how-we-compare', 'about-what-this-is'],
    ];
    for (const [href, view] of cases) {
      at(href);
      expect(navigateSelfClick(view, vi.fn()), `${href} must be handled`).toBe(true);
      expect(
        window.location.pathname + window.location.search + window.location.hash,
        `a self-click on ${view} from ${href} must land on the bare route`,
      ).toBe(viewToPath(view));
    }
  });

  test('ALREADY AT THE DEFAULT: the click scrolls to top instead of being swallowed', () => {
    // This is the order's "already-at-default self-click = scroll to top" clause,
    // and it exists because navigate() returns EARLY on an identical URL — without
    // this branch the click would do literally nothing and read as a dead button.
    const scrollTo = vi.fn();
    vi.stubGlobal('scrollTo', scrollTo);
    at('/gallery');
    expect(navigateSelfClick('gallery', vi.fn())).toBe(true);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(window.location.pathname).toBe('/gallery');
    vi.unstubAllGlobals();
  });

  test('a SECTION-kind self-click publishes a request and navigates nothing', () => {
    const requestNavReset = vi.fn();
    at('/create');
    expect(navigateSelfClick('generate', requestNavReset)).toBe(true);
    expect(requestNavReset).toHaveBeenCalledWith('generate');
    expect(window.location.pathname).toBe('/create');
  });

  test('FAIL-CLOSED: an undeclared view is NOT handled, so its caller navigates as it always did', () => {
    // The whole safety property of the dispatch. A section that never declared a
    // reset must not be reset in some guessed way — it must fall through.
    const requestNavReset = vi.fn();
    at('/pricing');
    expect(navigateSelfClick('pricing', requestNavReset)).toBe(false);
    expect(requestNavReset).not.toHaveBeenCalled(); // anchored: the two SECTION-kind arms above prove this same spy IS called when a declaration exists
  });

  test('a SECTION-kind click with no request channel is NOT handled rather than silently lost', () => {
    at('/create');
    expect(navigateSelfClick('generate', undefined)).toBe(false);
  });
});

describe('LD-11 — the dirty guard, on the real wizard and the real store', () => {
  afterEach(() => cleanup());

  /**
   * Drive the request the way App does — through the store action the dispatch
   * calls — and let the section answer. Nothing here reaches into the component.
   */
  async function mountWizardAndRequestReset(seed) {
    const { useStore } = await import('../../src/store/index.js');
    const { default: GenerateWizard } = await import('../../src/components/GenerateWizard.jsx');
    useStore.setState(seed, false);
    render(<GenerateWizard isMobile={false} onSignIn={() => {}} onNavigate={() => {}} />);
    useStore.getState().requestNavReset('generate');
    return useStore;
  }

  test('a generated-but-unsaved draft raises the EXISTING leave-confirm — reset never silently discards work', async () => {
    const useStore = await mountWizardAndRequestReset({
      wizardMode: 'advanced',
      settlement: { id: 'draft-1', name: 'Thornwatch', tier: 'town' },
      activeSaveId: null,
      auth: { ...(await import('../../src/store/index.js')).useStore.getState().auth, tier: 'free' },
    });

    // The order's binding safety law, and it is satisfied by REUSING the wizard's
    // own confirm rather than by a second copy of it that could drift.
    const dialog = await screen.findByText(/Leave this settlement\?/i);
    expect(dialog).toBeTruthy();
    // The draft is still there: the dialog asked, it did not act.
    expect(useStore.getState().settlement).toBeTruthy();
    // And the request was consumed, so it cannot re-fire on an unrelated render.
    expect(useStore.getState().navResetRequest).toBeNull();
  });

  test('a CLEAN section resets instantly, with no dialog', async () => {
    const useStore = await mountWizardAndRequestReset({
      wizardMode: 'advanced',
      settlement: null,
      activeSaveId: null,
    });

    await waitFor(() => expect(useStore.getState().wizardMode).toBeNull());
    expect(useStore.getState().wizardStep).toBe(0);
    expect(screen.queryByText(/Leave this settlement\?/i)).toBeNull();
    expect(useStore.getState().navResetRequest).toBeNull();
  });

  test('a PERSISTED PREFERENCE survives the reset — settings are not navigation', async () => {
    // TC-0's law, stated by the order in as many words: reset returns NAVIGATION
    // state to the section default and never erases a persisted preference. The
    // wizard's own config is the persisted thing on this surface, and the product
    // promises it explicitly ("your configuration is kept so you can regenerate").
    const { useStore } = await import('../../src/store/index.js');
    const configBefore = JSON.stringify(useStore.getState().config);

    await mountWizardAndRequestReset({ wizardMode: 'advanced', settlement: null, activeSaveId: null });
    await waitFor(() => expect(useStore.getState().wizardMode).toBeNull());

    expect(
      JSON.stringify(useStore.getState().config),
      'a self-click reset moved persisted config. Reset returns navigation state only.',
    ).toBe(configBefore);
  });

  test('NEGATIVE CONTROL: a request for a DIFFERENT section leaves Create untouched', async () => {
    // The arm that keeps every positive arm above honest. If the wizard answered
    // any request rather than its own, clicking Library while deep in Advanced
    // Config would blow the wizard away.
    const { useStore } = await import('../../src/store/index.js');
    const { default: GenerateWizard } = await import('../../src/components/GenerateWizard.jsx');
    useStore.setState({ wizardMode: 'advanced', settlement: null, activeSaveId: null }, false);
    render(<GenerateWizard isMobile={false} onSignIn={() => {}} onNavigate={() => {}} />);

    useStore.getState().requestNavReset('settlements');
    await new Promise((r) => setTimeout(r, 0));

    expect(
      useStore.getState().wizardMode,
      'the Create section answered a request addressed to another section',
    ).toBe('advanced');
  });
});
