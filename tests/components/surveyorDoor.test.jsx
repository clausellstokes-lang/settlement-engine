/**
 * @vitest-environment jsdom
 *
 * surveyorDoor.test.jsx — THE ONE DOOR contract (C13, owner ruling 2026-07-18).
 *
 * Pins the four laws of the door:
 *   1. ENTITLEMENT (owner ruling 2026-07-19, FINAL) — the marker renders ONLY for a
 *      live Surveyor entitlement, a Founder, or an elevated role (via the isSurveyorTier
 *      chokepoint): no lock-tease — the margin is EMPTY for anon/free AND for
 *      Cartographer 'premium' (the discriminator: 'premium' alone is insufficient).
 *   2. ONE DOOR — the tab opens a prompt slip; prompts route to DESTINATIONS (the
 *      analyst / a workshop stage); the destinations receive the staged prompt.
 *   3. CONTEXT-FIRST — the slip shows the visible anchor (what the Surveyor reads).
 *   4. X-22 (the owner, 2026-10-30) — the first open is ONE composer with a rotating
 *      placeholder of suggested first questions; the promptless register links, the
 *      send button and the chips are gone (Enter sends).
 *
 * SC-1A adds the EPHEMERAL TEXT-INTENT SHELL (A1–A5): the slip's prompt block became a
 * transient chat-shaped surface — a user-turn log plus a bottom-anchored auto-growing
 * composer — while the door kept every ownership it already had (entitlement, focus
 * trap, routing, destination state). The shell is presentation: it never reaches the
 * router, a provider, or the store, and its draft/log live and die with the mounted door.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mobileRef.current = false;
  delete window.visualViewport;
});

const { storeRef, entitledRef, mobileRef } = vi.hoisted(() => ({
  storeRef: { current: { auth: {} } },
  entitledRef: { current: true },
  mobileRef: { current: false },
}));

// The ONE shared viewport authority (src/hooks/useIsMobile.js). The shell reads it for
// the Enter-submits / Enter-newlines split and the bottom-sheet form; the Button and
// IconButton primitives read the same hook for their mobile tap floor.
vi.mock('../../src/hooks/useIsMobile.js', () => ({
  default: () => mobileRef.current,
  getIsMobile: () => mobileRef.current,
}));

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeRef.current),
}));
// The Surveyor gate is resolved by the lazy useSurveyorEntitled hook; mock it so
// the door renders synchronously here. The chokepoint predicate (isSurveyorTier)
// is re-exported real from the door module and tested directly below.
vi.mock('../../src/components/surveyor/useSurveyorEntitled.js', () => ({
  useSurveyorEntitled: () => entitledRef.current,
}));
// X-22: the door derives the composer's rotating placeholder from this context (a page
// with nothing specific in view, so the suggestions are the world-scope set).
const NO_PAGE_CTX = { view: '', params: {}, settlement: null, savedSettlements: [], activeCampaign: null, worldState: null };
const WORLD_SUGGESTIONS = [
  'What is happening in my world right now?',
  'Which settlements are under the most pressure?',
  'What can I share with my players?',
  'What should I prepare for next session?',
];
vi.mock('../../src/components/surveyor/useSurveyorContext.js', () => ({
  useSurveyorContext: () => ({ anchorLabel: 'Reading: Test Town', ctx: NO_PAGE_CTX }),
}));
// Destinations are stubbed: this file pins the DOOR's routing, not the panels
// (their contracts live in the surveyor*/aiAnalyst* suites).
vi.mock('../../src/components/AiAnalystPanel.jsx', () => ({
  // The stub exposes onClose so a test can return the door to its marker state and
  // reopen it — the only way to observe that the shell's transient log SURVIVED a
  // close/reopen round trip within one mount.
  default: ({ open, initialQuestion, onClose }) => (
    <div data-testid="dest-analyst" data-open={String(!!open)} data-q={initialQuestion}>
      <button type="button" onClick={onClose}>close the analyst</button>
    </div>
  ),
}));
vi.mock('../../src/components/surveyor/SurveyorWorkshop.jsx', () => ({
  default: ({ open, initialStage, initialPrompt, initialScope }) => (
    <div data-testid="dest-workshop" data-open={String(!!open)} data-stage={initialStage} data-prompt={initialPrompt} data-scope={initialScope || ''} />
  ),
}));

import SurveyorDoor, { isSurveyorTier } from '../../src/components/surveyor/SurveyorDoor.jsx';
import SurveyorTextIntentShell from '../../src/components/surveyor/SurveyorTextIntentShell.jsx';

const setEntitled = (v) => { entitledRef.current = v; };

function openDoor() {
  render(<SurveyorDoor />);
  fireEvent.click(screen.getByRole('button', { name: /ask the surveyor/i }));
}

/** X-22: no send button; Enter is the send key. */
function typeAndSend(text) {
  const box = screen.getByLabelText(/ask the surveyor about this page/i);
  fireEvent.change(box, { target: { value: text } });
  fireEvent.keyDown(box, { key: 'Enter' });
}

describe('SurveyorDoor — entitlement (the marker law)', () => {
  it('renders NOTHING for a non-entitled user — empty margin, no lock-tease', () => {
    setEntitled(false);
    const { container } = render(<SurveyorDoor />);
    expect(container.innerHTML).toBe('');
  });

  it('renders the tab for an entitled user, no visible text until hover (aria-label carries the name)', () => {
    setEntitled(true);
    render(<SurveyorDoor />);
    const tab = screen.getByRole('button', { name: /ask the surveyor/i });
    expect(tab.getAttribute('aria-label')).toBe('Ask the Surveyor');
    // the reveal label is aria-hidden (AT hears the aria-label, sighted users hover)
    expect(tab.querySelector('[aria-hidden="true"]')?.textContent).toBe('Ask the Surveyor');
  });

  it('isSurveyorTier chokepoint: entitlement OR founder OR elevated role; Cartographer premium excluded', () => {
    expect(isSurveyorTier({ hasSurveyorEntitlement: true })).toBe(true);
    expect(isSurveyorTier({ isFounder: true })).toBe(true);
    expect(isSurveyorTier({ role: 'admin' })).toBe(true);
    expect(isSurveyorTier({ role: 'developer' })).toBe(true);
    expect(isSurveyorTier({ tier: 'premium' })).toBe(false); // Cartographer — no door
    expect(isSurveyorTier({ tier: 'free' })).toBe(false);
    expect(isSurveyorTier(null)).toBe(false);
  });

  it('respects the route-level visible gate (auth/checkout chrome)', () => {
    setEntitled(true);
    const { container } = render(<SurveyorDoor visible={false} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('SurveyorDoor — the prompt slip routes to destinations', () => {
  it('X-22 FIRST OPEN: one composer and nothing else (no heading, anchor, chips or buttons)', () => {
    setEntitled(true);
    openDoor();
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getAllByRole('textbox')).toHaveLength(1);
    expect(within(dialog).queryAllByRole('button')).toEqual([]);
    expect(within(dialog).queryByRole('log')).toBeNull();
    expect(within(dialog).queryByTestId('surveyor-anchor')).toBeNull();
    expect(dialog.textContent).toBe('');
  });

  it('X-22: the empty composer rotates through the suggested first questions, and a draft stops it', () => {
    vi.useFakeTimers();
    try {
      setEntitled(true);
      openDoor();
      const box = screen.getByLabelText(/ask the surveyor about this page/i);
      expect(box.getAttribute('placeholder')).toBe(WORLD_SUGGESTIONS[0]);
      act(() => { vi.advanceTimersByTime(4000); });
      expect(box.getAttribute('placeholder')).toBe(WORLD_SUGGESTIONS[1]);
      fireEvent.change(box, { target: { value: 'a draft' } });
      act(() => { vi.advanceTimersByTime(8000); });
      expect(box.getAttribute('placeholder')).toBe(WORLD_SUGGESTIONS[1]);
    } finally {
      vi.useRealTimers();
    }
  });

  it('routes a question to the ANALYST with the question staged', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('why is bread so expensive here?');
    const dest = screen.getByTestId('dest-analyst');
    expect(dest.getAttribute('data-open')).toBe('true');
    expect(dest.getAttribute('data-q')).toBe('why is bread so expensive here?');
    // the slip closed; the one door is not a second panel
    expect(screen.queryByLabelText(/ask the surveyor about this page/i)).toBeNull();
  });

  // ⚠ THE PROMPT MOVED, THE CLAIM DID NOT (ODQ §763.2). This arm used to drive
  // 'reskin the map in a woodcut style' → stage 'style'. That capability is retired, so the
  // prompt now reaches the analyst and would prove nothing here. It is re-pointed at a
  // CONSTRUCT prompt rather than a content one ON PURPOSE: 'content' is STAGES[0], the
  // workshop's unknown-id fallback, so a content-routed arm cannot tell "pre-selected the
  // right stage" from "fell back to the default" — which is exactly the silent failure this
  // whole wave exists to avoid. The retired prompt's new destination is asserted below.
  it('routes a making-prompt to the WORKSHOP with the stage pre-selected and the prompt seeded', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('build me a new town on the river');
    const dest = screen.getByTestId('dest-workshop');
    expect(dest.getAttribute('data-stage')).toBe('construct');
    expect(dest.getAttribute('data-prompt')).toBe('build me a new town on the river');
  });

  it('RETIRED styleOverhaul: a map-style prompt reaches the ANALYST and opens no write stage', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('reskin the map in a woodcut style');
    // POSITIVE first — the door still routed it somewhere, so the absence below is a
    // routing decision and not a door that simply stopped working.
    const dest = screen.getByTestId('dest-analyst');
    expect(dest.getAttribute('data-open')).toBe('true');
    expect(dest.getAttribute('data-q')).toBe('reskin the map in a woodcut style');
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
  });

  // ⚰ THE PROMPTLESS REGISTER LINKS WENT WITH X-22 ("no buttons inside"). This arm used
  // to open the workshop from a link; it now pins that the links are gone, anchored on
  // the composer so an empty render cannot pass it.
  it('X-22: the promptless register links are gone; the composer is the only way in', () => {
    setEntitled(true);
    openDoor();
    expect(screen.getByLabelText(/ask the surveyor about this page/i)).toBeTruthy();
    for (const name of [/open the analyst/i, /ask the world/i, /open the workshop/i, /take it to the surveyor/i]) {
      expect(screen.queryByRole('button', { name })).toBeNull();
    }
  });
});

describe('SurveyorDoor — the slip is a real modal dialog (a11y-1)', () => {
  it('the open slip is aria-modal and moves focus into itself (not orphaned on <body>)', () => {
    setEntitled(true);
    openDoor();
    const dialog = screen.getByRole('dialog');
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('Escape closes the slip and restores focus to the door tab (never orphaned)', () => {
    setEntitled(true);
    render(<SurveyorDoor />);
    const tab = screen.getByRole('button', { name: /ask the surveyor/i });
    tab.focus(); // the trigger holds focus when the slip opens
    fireEvent.click(tab);
    expect(screen.getByRole('dialog')).toBeTruthy();

    // The shared hook's window keydown handler dismisses on Escape.
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    // Focus returns to the still-mounted trigger, not to <body>.
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /ask the surveyor/i }));
  });
});

// ── SC-1A: the ephemeral text-intent shell ───────────────────────────────────
const composer = () => screen.getByLabelText(/ask the surveyor about this page/i);
const pressEnter = () => fireEvent.keyDown(composer(), { key: 'Enter' });
const doorTab = () => screen.getByRole('button', { name: /ask the surveyor$/i });
// X-22: before the first turn there is no log at all (one composer), so read the turns
// wherever they are rather than requiring the log to exist.
const turnTexts = () => screen.queryAllByTestId('surveyor-turn').map((n) => n.textContent);

/** Stub the layout-only scrollHeight jsdom never computes. */
function stubScrollHeight(el, px) {
  Object.defineProperty(el, 'scrollHeight', { configurable: true, get: () => px });
}

describe('SurveyorDoor — A1/A2/A3: the shell routes, records, and treats blank as absence', () => {
  it('A1 — a question routes to the analyst verbatim, logs ONE trimmed turn, and clears the draft', () => {
    setEntitled(true);
    openDoor();

    // A half-written draft survives a plain close/reopen: the shell is kept mounted by
    // the door, so dismissing the slip is not the same as throwing the sentence away.
    fireEvent.change(composer(), { target: { value: 'why is bread' } });
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    fireEvent.click(doorTab());
    expect(composer().value).toBe('why is bread');

    fireEvent.change(composer(), { target: { value: '  why is bread so expensive here?  ' } });
    pressEnter();

    // The destination writer is unchanged: the trimmed question, staged exactly.
    const dest = screen.getByTestId('dest-analyst');
    expect(dest.getAttribute('data-open')).toBe('true');
    expect(dest.getAttribute('data-q')).toBe('why is bread so expensive here?');
    expect(screen.queryByRole('dialog')).toBeNull();

    // Return to the marker and reopen: the shell stayed MOUNTED, so its transient log
    // survived — one user turn, trimmed, under the existing "You asked" register.
    fireEvent.click(screen.getByRole('button', { name: /close the analyst/i }));
    fireEvent.click(doorTab());
    expect(turnTexts()).toEqual(['why is bread so expensive here?']);
    expect(screen.getByRole('log').textContent).toContain('You asked');
    // A successful route clears the draft; it does not re-stage the same text.
    expect(composer().value).toBe('');
  });

  // ⚠ Re-pointed off the retired styleOverhaul prompt (ODQ §763.2) onto a CONSTRUCT one,
  // for the same non-vacuity reason as the arm above: 'content' is the workshop's fallback
  // stage, so only a non-default stage id proves the composer carried the routing through.
  it('A2 — a making-prompt still reaches the workshop with the unchanged stage, prompt, and scope', () => {
    setEntitled(true);
    openDoor();
    fireEvent.change(composer(), { target: { value: 'build me a new town on the river' } });
    pressEnter();
    const dest = screen.getByTestId('dest-workshop');
    expect(dest.getAttribute('data-stage')).toBe('construct');
    expect(dest.getAttribute('data-prompt')).toBe('build me a new town on the river');
    expect(dest.getAttribute('data-scope')).toBe('settlement');
  });

  it('A3 — empty and whitespace-only drafts are ABSENCE: Enter is a no-op, nothing is logged', () => {
    setEntitled(true);
    openDoor();
    pressEnter();
    fireEvent.change(composer(), { target: { value: '   \n\t ' } });
    fireEvent.keyDown(composer(), { key: 'Enter' });
    expect(screen.queryByTestId('dest-analyst')).toBeNull();
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
    expect(turnTexts()).toEqual([]);
    // The slip is still open — an absent prompt is not a dismissal.
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it("A3 — absence stops IN THE SHELL: a blank draft never reaches the door's router at all", () => {
    // The door refuses an empty prompt too, which makes the shell's own absence arm
    // invisible through the door. Driven directly, with the route stubbed TRUTHY, the
    // shell has to be the thing that stops — otherwise an empty turn would be logged.
    const onRoute = vi.fn(() => ({ destination: 'analyst', scope: 'settlement' }));
    render(
      <SurveyorTextIntentShell
        open
        dialogRef={{ current: null }}
        anchorLabel="Reading: Test Town"
        onClose={() => {}}
        onRoute={onRoute}
      />,
    );
    fireEvent.change(composer(), { target: { value: '   \n\t ' } });
    fireEvent.keyDown(composer(), { key: 'Enter' });
    expect(onRoute).not.toHaveBeenCalled();
    expect(turnTexts()).toEqual([]);
  });
});

describe('SurveyorDoor — A4: desktop keyboard + the composer that grows upward', () => {
  it('only a plain desktop Enter submits — Shift+Enter and an IME composition do not', () => {
    setEntitled(true);
    mobileRef.current = false;
    openDoor();
    fireEvent.change(composer(), { target: { value: 'why is bread so expensive here?' } });

    fireEvent.keyDown(composer(), { key: 'Enter', shiftKey: true });
    expect(screen.queryByTestId('dest-analyst')).toBeNull();
    fireEvent.keyDown(composer(), { key: 'Enter', isComposing: true });
    expect(screen.queryByTestId('dest-analyst')).toBeNull();

    fireEvent.keyDown(composer(), { key: 'Enter' });
    expect(screen.getByTestId('dest-analyst').getAttribute('data-q')).toBe('why is bread so expensive here?');
  });

  it('the composer grows to its content and CLAMPS at 144px, scrolling only at the cap', () => {
    setEntitled(true);
    openDoor();
    const area = composer();

    stubScrollHeight(area, 80);
    fireEvent.change(area, { target: { value: 'two lines\nof draft' } });
    expect(area.style.height).toBe('80px');
    expect(area.style.overflowY).toBe('hidden');

    stubScrollHeight(area, 300);
    fireEvent.change(area, { target: { value: 'a much longer draft that overruns the cap' } });
    expect(area.style.height).toBe('144px');
    expect(area.style.overflowY).toBe('auto');
  });
});

describe('SurveyorDoor — A5: mobile, the keyboard inset, and the privacy floor', () => {
  function stubVisualViewport({ height = 500, offsetTop = 0 } = {}) {
    const listeners = { resize: [], scroll: [] };
    const vv = {
      height,
      offsetTop,
      addEventListener: vi.fn((type, fn) => { (listeners[type] ||= []).push(fn); }),
      removeEventListener: vi.fn((type, fn) => {
        listeners[type] = (listeners[type] || []).filter((f) => f !== fn);
      }),
    };
    Object.defineProperty(window, 'visualViewport', { configurable: true, writable: true, value: vv });
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 800 });
    return { vv, listeners };
  }

  // X-22 retired the send button, so the phone's Return key is the send key and the
  // box says so (enterKeyHint). Shift+Enter still breaks the line on a hardware keyboard.
  it('on mobile the Return key sends (enterKeyHint="send"); Shift+Enter does not', () => {
    setEntitled(true);
    mobileRef.current = true;
    stubVisualViewport();
    openDoor();
    expect(composer().getAttribute('enterkeyhint')).toBe('send');
    fireEvent.change(composer(), { target: { value: 'build me a new town on the river' } });
    fireEvent.keyDown(composer(), { key: 'Enter', shiftKey: true });
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
    pressEnter();
    expect(screen.getByTestId('dest-workshop').getAttribute('data-stage')).toBe('construct');
  });

  it('publishes the keyboard inset as a CSS custom property, updates it, and removes BOTH listeners on close', () => {
    setEntitled(true);
    mobileRef.current = true;
    const { vv, listeners } = stubVisualViewport({ height: 500, offsetTop: 0 });
    openDoor();

    const dialog = screen.getByRole('dialog');
    expect(dialog.style.getPropertyValue('--sf-door-kbd-inset')).toBe('300px');
    expect(vv.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(vv.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));

    act(() => {
      vv.height = 640;
      vv.offsetTop = 0;
      listeners.resize.forEach((fn) => fn());
    });
    expect(dialog.style.getPropertyValue('--sf-door-kbd-inset')).toBe('160px');

    fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(vv.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(vv.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(listeners.resize).toHaveLength(0);
    expect(listeners.scroll).toHaveLength(0);
  });

  it('with no visualViewport API the inset is zero — the shell degrades, it never throws', () => {
    setEntitled(true);
    mobileRef.current = true;
    openDoor();
    expect(screen.getByRole('dialog').style.getPropertyValue('--sf-door-kbd-inset')).toBe('0px');
  });

  it('PRIVACY FLOOR: a non-entitled user gets no shell at all — not even a closed one', () => {
    setEntitled(false);
    const { container } = render(<SurveyorDoor />);
    expect(container.innerHTML).toBe('');
    expect(screen.queryByRole('log')).toBeNull();
    expect(screen.queryByLabelText(/ask the surveyor about this page/i)).toBeNull();
  });
});
