/** @vitest-environment jsdom */
/**
 * postGenCoach.test.jsx — the post-generate coach's presentational shell (C4).
 *
 * PostGenCoach is the revived HOST of the guidance registry's single
 * `wizard-postgen` whisper (the component swap that replaced the standalone
 * WizardNextSteps card). The pure next-step builder is exercised in
 * wizardNextSteps.test.js (node); this file pins the coach itself:
 *   - the no-settlement gate + the dismissed gate,
 *   - each forward "what's next" move (save → export → refine → place) renders
 *     as its OWN step, with state-aware save framing,
 *   - "Generate another" (the detached footer) is never a coach step,
 *   - dismissal rides the UNIFIED sf:guidance store (not master's bespoke
 *     sf.postGenCoachDismissedAt), and the legacy sf:dismissed_whats_next
 *     dismissal read-once-migrates (WizardNextSteps' retained behaviour).
 *
 * ⭐ AND THE PAGE OF ORIGIN (owner order, ODQ §934.29). This coach was the order's own
 * case: mounted in the App shell, it floated over every route in the product until
 * dismissed. The `describe` at the foot walks the owner's four clauses through the real
 * component — leave and it goes, return and it comes back, close and it is gone for good
 * — driving the REAL router (window.history + the shell's own `sf:navigate` event) rather
 * than a stubbed route, so the pin measures the wiring and not a prop.
 *
 * ⚠ jsdom's default location is `/`, which src/lib/routes.js resolves to DEFAULT_VIEW
 * ('generate') — the coach's page of origin. That is why the pins above need no
 * navigation; it is asserted outright in the origin block so the convenience cannot
 * quietly become the reason they pass.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {
    settlement: { tier: 'Village' },
    canSave: () => false,
    auth: { tier: 'anon' },
    activeSaveId: null,
    savedSettlements: [],
  };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  useStore.__set = (next) => Object.assign(data, next);
  return { useStore };
});

import PostGenCoach from '../../src/components/PostGenCoach.jsx';
import { useStore } from '../../src/store/index.js';

// Walk the coach forward by clicking "Next" until the matcher resolves or the
// final ("Done") step is reached. The forward moves appear in order, so a
// forward-only walk lands on each in turn.
function clickNextUntil(matcher) {
  let guard = 0;
  while (!matcher() && guard < 10) {
    const next = screen.queryByRole('button', { name: 'Next' });
    if (!next) break;
    fireEvent.click(next);
    guard += 1;
  }
}

describe('PostGenCoach — what\'s-next steps', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* no-op */ }
    useStore.__set({
      settlement: { tier: 'Village' },
      canSave: () => false,
      auth: { tier: 'anon' },
      activeSaveId: null,
      savedSettlements: [],
    });
  });
  afterEach(() => cleanup());

  it('renders nothing when there is no settlement', () => {
    useStore.__set({ settlement: null });
    const { container } = render(<PostGenCoach />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when the whisper was already dismissed (unified key)', () => {
    localStorage.setItem('sf:guidance:wizard_next_steps', '1');
    const { container } = render(<PostGenCoach />);
    expect(container.firstChild).toBeNull();
  });

  it('renders each forward move (save/export/refine/place) as its own step', () => {
    render(<PostGenCoach />);
    // Save is the first forward move; for an anon user it carries the
    // free-account framing.
    clickNextUntil(() => screen.queryByText(/create a free account/i));
    expect(screen.getByText(/create a free account/i)).toBeTruthy();
    // Each subsequent move is its own step.
    clickNextUntil(() => screen.queryByText('Export a PDF'));
    expect(screen.getByText('Export a PDF')).toBeTruthy();
    clickNextUntil(() => screen.queryByText('Refine the details'));
    expect(screen.getByText('Refine the details')).toBeTruthy();
    clickNextUntil(() => screen.queryByText('Place it on your world map'));
    expect(screen.getByText('Place it on your world map')).toBeTruthy();
    // The last forward move is the final step — "Done" replaces "Next".
    expect(screen.getByRole('button', { name: 'Done' })).toBeTruthy();
    // "Generate another" is the detached footer, never a coach step.
    expect(screen.queryByText('Generate another')).toBeNull();
  });

  it('shows the free-account save framing for anonymous users', () => {
    render(<PostGenCoach />);
    clickNextUntil(() => screen.queryByText(/create a free account/i));
    expect(screen.getByText(/create a free account/i)).toBeTruthy();
  });

  it('shows the library save framing for signed-in users who can save', () => {
    useStore.__set({ canSave: () => true, auth: { tier: 'premium' } });
    // THE PAGE BUDGET (§934.29): a signed-in newborn's first dossier is taught by the
    // callouts band, which outranks this coach 60 to 50 on the same page. The band is
    // dismissed here so the coach's own framing is what this pin measures — the ordering
    // itself is pinned in the origin block below.
    localStorage.setItem('sf:guidance:dossier_first_callouts', '1');
    render(<PostGenCoach />);
    clickNextUntil(() => screen.queryByText(/Save it to your library/i));
    expect(screen.getByText(/Save it to your library/i)).toBeTruthy();
  });

  it('"Done" on the final step dismisses the coach and persists via the unified key', () => {
    const first = render(<PostGenCoach />);
    let guard = 0;
    while (!screen.queryByRole('button', { name: 'Done' }) && guard < 10) {
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      guard += 1;
    }
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    // Gone immediately…
    expect(first.container.firstChild).toBeNull();
    // …persisted through the unified sf:guidance store (not the legacy key).
    expect(localStorage.getItem('sf:guidance:wizard_next_steps')).toBe('1');
    // …and stays gone on a fresh mount.
    cleanup();
    const second = render(<PostGenCoach />);
    expect(second.container.firstChild).toBeNull();
  });

  it('the ghost "got it" control dismisses from any step and persists', () => {
    const view = render(<PostGenCoach />);
    fireEvent.click(screen.getByRole('button', { name: /got it from here/i }));
    expect(view.container.firstChild).toBeNull();
    expect(localStorage.getItem('sf:guidance:wizard_next_steps')).toBe('1');
  });

  it('a legacy sf:dismissed_whats_next dismissal read-once-migrates to the unified key', () => {
    // The pre-consolidation WizardNextSteps dismissal carries forward — a keeper
    // who already dismissed the What's-next guide is never re-taught.
    localStorage.setItem('sf:dismissed_whats_next', '1');
    const view = render(<PostGenCoach />);
    expect(view.container.firstChild).toBeNull();
    expect(localStorage.getItem('sf:guidance:wizard_next_steps')).toBe('1');
  });
});

// ── THE PAGE OF ORIGIN (ODQ §934.29) ──────────────────────────────────────────────
// Driven through the real router: `navigateTo` pushes a path and fires the same
// `sf:navigate` event src/hooks/useRoute.js subscribes to, so a mounted coach re-renders
// exactly as it does in the product.
function navigateTo(path) {
  // ⛔ WRAPPED IN act(). `useRoute` is a useSyncExternalStore subscription, so the event
  // below is an EXTERNAL store update: React schedules the re-render but testing-library
  // never flushes it, and the assertion that follows reads the pre-navigation DOM. The
  // first draft of these pins failed exactly that way — the coach "followed" the reader
  // to /gallery in the test while behaving correctly in the product.
  act(() => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new Event('sf:navigate'));
  });
}

describe('PostGenCoach — the page of origin (ODQ §934.29)', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* no-op */ }
    navigateTo('/create');
    useStore.__set({
      settlement: { tier: 'Village' },
      canSave: () => false,
      auth: { tier: 'anon' },
      activeSaveId: null,
      savedSettlements: [],
    });
  });
  afterEach(() => { cleanup(); navigateTo('/'); });

  it('the unnavigated default really is /create (the convenience, stated outright)', () => {
    navigateTo('/');
    const { container } = render(<PostGenCoach />);
    expect(container.firstChild, 'the bare root resolves to the coach\'s own page').not.toBeNull();
  });

  it('LEAVE — a mounted coach disappears the moment the route changes', () => {
    const view = render(<PostGenCoach />);
    expect(view.container.firstChild).not.toBeNull();
    navigateTo('/settlements');
    expect(view.container.firstChild, 'the coach followed the reader to the Library').toBeNull();
    navigateTo('/gallery');
    expect(view.container.firstChild, 'the coach followed the reader to the Gallery').toBeNull();
  });

  it('RETURN — it comes back on /create, undismissed', () => {
    const view = render(<PostGenCoach />);
    navigateTo('/gallery');
    expect(view.container.firstChild).toBeNull();
    navigateTo('/create');
    expect(view.container.firstChild, 'leaving the page must not retire the coach').not.toBeNull();
    expect(localStorage.getItem('sf:guidance:wizard_next_steps')).toBeNull();
  });

  it('DISMISS — the explicit close retires it, and returning does NOT bring it back', () => {
    const view = render(<PostGenCoach />);
    fireEvent.click(screen.getByRole('button', { name: /got it from here/i }));
    expect(view.container.firstChild).toBeNull();
    navigateTo('/gallery');
    navigateTo('/create');
    expect(view.container.firstChild).toBeNull();
    // …and on a fresh mount, which is what a reload is.
    cleanup();
    const reloaded = render(<PostGenCoach />);
    expect(reloaded.container.firstChild).toBeNull();
  });

  it('a dossier route that is NOT this whisper\'s origin shows nothing either', () => {
    // /settlements/:id mounts the same dossier the forge opens onto, and the callouts band
    // is registered for it — but the forward MOVES belong to the forge. A saved dossier is
    // not a just-forged one.
    navigateTo('/settlements/westhollow');
    const { container } = render(<PostGenCoach />);
    expect(container.firstChild).toBeNull();
  });

  it('THE BUDGET — a signed-in newborn sees the callouts band first, the coach after', () => {
    useStore.__set({ canSave: () => true, auth: { tier: 'free' }, savedSettlements: [] });
    const blocked = render(<PostGenCoach />);
    expect(
      blocked.container.firstChild,
      'the coach stacked beside the higher-priority first-dossier teaching band',
    ).toBeNull();
    cleanup();
    localStorage.setItem('sf:guidance:dossier_first_callouts', '1');
    const freed = render(<PostGenCoach />);
    expect(freed.container.firstChild, 'the coach never arrived after the band was closed').not.toBeNull();
  });
});
