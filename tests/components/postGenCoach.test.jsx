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
 * ⭐ AND THE TWO REVIEW-P LAWS (ODQ §934.63). The last two describes carry F5 and F6: the
 * coach may not appear before the forge's reveal has reached its readable end (it reads the
 * store's `pipelineRevealActive`, never a timer), and its card docks in the page's own flow
 * at every width instead of taking a fixed bottom-right box that covered 244 px of the
 * dossier's reading column at 1440x900 and its whole 340 px width at 1024. The overlap
 * block carries its own control: it reconstructs the PRE-CURE box from the constants it used
 * and asserts that box really did overlap, so "no overlap" is a cure and not a tautology.
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
    // The forge's reveal, quiet by default: every pin above measures the settled dossier.
    // The REVIEW-P F5 block below drives this field itself.
    pipelineRevealActive: false,
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

  it('the whisper is eligible here, so the REVEAL block below measures the reveal and nothing else', () => {
    // The control for the two REVIEW-P blocks: with the reveal quiet, this exact state
    // renders. Without it, "absent while the reveal runs" could be passing for any of the
    // other five gates and nobody would know.
    useStore.__set({ pipelineRevealActive: false });
    const { container } = render(<PostGenCoach />);
    expect(container.firstChild).not.toBeNull();
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

// ── THE FORGE FINISHES FIRST, AND THE CARD DOCKS CLEAR (REVIEW-P F5/F6, ODQ §934.63) ──
// REVIEW-P measured the coach claiming "<town> is ready. STEP 1 OF 4" at storeMs 785, over
// the establishing painting, while the forge's sixteen-step rail was on step 2 and the
// dossier was still 7,700 ms (desktop) / 8,990 ms (phone) away. The settlement exists long
// before the reveal has said what it is. The cure reads the reveal's OWN store field rather
// than a timer, so these pins drive that field directly: `pipelineRevealActive` is what
// settlementGenerateAction arms and what PipelineReveal clears through dismissPipelineReveal().
describe('PostGenCoach — the coach waits for the forge (REVIEW-P F5)', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* no-op */ }
    navigateTo('/create');
    useStore.__set({
      settlement: { tier: 'Village', name: 'Erdenkul' },
      canSave: () => false,
      auth: { tier: 'anon' },
      activeSaveId: null,
      savedSettlements: [],
      pipelineRevealActive: false,
    });
  });
  afterEach(() => { cleanup(); navigateTo('/'); });

  it('ABSENT while the reveal is still playing, even though the settlement is in the store', () => {
    // This is the measured defect exactly: a settlement, on the page of origin, undismissed,
    // budget-free — and the forge still speaking.
    useStore.__set({ pipelineRevealActive: true });
    const { container } = render(<PostGenCoach />);
    expect(
      container.firstChild,
      'the coach announced the town was ready while the forge was still forging it',
    ).toBeNull();
  });

  it('PRESENT once the reveal clears, and it is the reveal that decides', () => {
    // Mount mid-reveal, then let the reveal finish under the mounted component — the same
    // order the product runs in (the coach is mounted by the shell, the reveal ends later).
    useStore.__set({ pipelineRevealActive: true });
    const view = render(<PostGenCoach />);
    expect(view.container.firstChild).toBeNull();
    useStore.__set({ pipelineRevealActive: false });
    view.rerender(<PostGenCoach />);
    expect(
      view.container.firstChild,
      'the coach never arrived after the forge finished',
    ).not.toBeNull();
    expect(screen.getByText(/Erdenkul is ready\./)).toBeTruthy();
  });

  it('the gate is the reveal FIELD, not a settlement-shaped proxy', () => {
    // A guard against the cure decaying into "wait for a name" or "wait for a tier": the
    // settlement is fully formed in both arms; only the reveal flag differs.
    const full = { tier: 'Village', name: 'Erdenkul' };
    useStore.__set({ settlement: full, pipelineRevealActive: true });
    const during = render(<PostGenCoach />);
    expect(during.container.firstChild).toBeNull();
    cleanup();
    useStore.__set({ settlement: full, pipelineRevealActive: false });
    const after = render(<PostGenCoach />);
    expect(after.container.firstChild).not.toBeNull();
  });
});

describe('PostGenCoach — the dock is clear of the reading column (REVIEW-P F5/F6)', () => {
  // The dossier body is `maxWidth: PAGE_MAX, margin: '0 auto'` (GenerateWizard), inside
  // <main>, whose desktop side padding is SP.xxl (24). The card was `position: fixed;
  // right: 24; width: 340`, so at the two rungs REVIEW-P walked:
  //   1440: column [120,1320] vs card [1076,1416]  → 244 px of live prose covered
  //   1024: column  [24,1000] vs card  [660,1000]  → the card's whole 340 px, 34.8% of it
  // A viewport-anchored card clears a CENTRED column only when the column is under 712 px
  // at 1440 and under 616 px at 1024; it is 1200 and 976. There is no placement to move it
  // to, so the card leaves the viewport layer and joins the flow, where it cannot overlap.
  const RUNGS = [1440, 1024];
  const MAIN_PAD = 24;   // src/App.jsx <main> paddingLeft/Right = SP.xxl on desktop
  const OLD_CARD_W = 340;
  const OLD_CARD_RIGHT = 24;

  beforeEach(() => {
    try { localStorage.clear(); } catch { /* no-op */ }
    navigateTo('/create');
    useStore.__set({
      settlement: { tier: 'Village', name: 'Erdenkul' },
      canSave: () => false,
      auth: { tier: 'anon' },
      activeSaveId: null,
      savedSettlements: [],
      pipelineRevealActive: false,
    });
  });
  afterEach(() => { cleanup(); navigateTo('/'); });

  it('the card takes NO viewport layer: not fixed, no z-index, no bottom anchor', () => {
    const { container } = render(<PostGenCoach />);
    const card = container.firstChild;
    expect(card).not.toBeNull();
    expect(card.style.position).toBe('relative');
    expect(card.style.zIndex).toBe('');
    expect(card.style.bottom).toBe('');
    expect(card.style.right).toBe('');
  });

  it('it shares the dossier column\'s own frame (PAGE_MAX, auto margins)', () => {
    const { container } = render(<PostGenCoach />);
    const card = container.firstChild;
    // The same two declarations GenerateWizard gives the dossier body, so the card lands
    // directly below the reading column and on its measure.
    expect(card.style.maxWidth).toBe('1200px');
    expect(card.style.marginLeft).toBe('auto');
    expect(card.style.marginRight).toBe('auto');
    expect(card.style.width).toBe('100%');
  });

  it('NO OVERLAP at 1440 and at 1024, where the old fixed box overlapped by 244 and 340', () => {
    const { container } = render(<PostGenCoach />);
    const card = container.firstChild;
    const cardMax = Number(card.style.maxWidth.replace('px', ''));
    const inFlow = card.style.position !== 'fixed';

    for (const vw of RUNGS) {
      const content = vw - MAIN_PAD * 2;
      const colW = Math.min(1200, content);
      const col = [MAIN_PAD + (content - colW) / 2, MAIN_PAD + (content - colW) / 2 + colW];

      // The control: the PRE-CURE box, reconstructed from the constants it used, really did
      // overlap — so "no overlap" below is a cure and not a tautology about an empty probe.
      const old = [vw - OLD_CARD_RIGHT - OLD_CARD_W, vw - OLD_CARD_RIGHT];
      const oldOverlap = Math.max(0, Math.min(col[1], old[1]) - Math.max(col[0], old[0]));
      expect(oldOverlap, `the fixed box at ${vw} should have overlapped`).toBeGreaterThan(0);
      expect(oldOverlap).toBe(vw === 1440 ? 244 : 340);

      // The cure: the card is in the flow, so it occupies its own band BELOW the column and
      // its horizontal frame is the column's own. A flow box cannot intersect the box it
      // follows, and its measure never exceeds the column's.
      expect(inFlow, `the card re-entered the viewport layer at ${vw}`).toBe(true);
      expect(Math.min(cardMax, content), `the card outgrew the column at ${vw}`)
        .toBe(colW);
    }
  });

  it('it is a labelled REGION, not a dialog (REVIEW-P F6)', () => {
    const { container } = render(<PostGenCoach />);
    const card = container.firstChild;
    // The estate spends role="dialog" on modals and trapped popovers; CommandPalette and
    // WorldMap both discriminate on [role="dialog"][aria-modal="true"]. This card is
    // deliberately non-modal and untrapped (§934.31), and in the page's own flow, which is
    // FirstDossierCallouts' labelled-region shape.
    expect(card.getAttribute('role')).toBe('region');
    expect(card.getAttribute('aria-modal')).toBeNull();
    expect(card.getAttribute('aria-label')).toBeTruthy();
    // And the accessible name is stable: paging forward must not rename the landmark.
    const name = card.getAttribute('aria-label');
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(card.getAttribute('aria-label')).toBe(name);
  });
});
