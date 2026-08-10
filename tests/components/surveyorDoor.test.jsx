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
 *   4. RETENTION — the promptless register links keep the retired launchers' open-
 *      without-a-prompt capability reachable.
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
vi.mock('../../src/components/surveyor/useSurveyorContext.js', () => ({
  useSurveyorContext: () => ({ anchorLabel: 'Reading: Test Town' }),
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
  it('shows the visible anchor (context-first made tangible) in the slip', () => {
    setEntitled(true);
    openDoor();
    expect(screen.getByTestId('surveyor-anchor').textContent).toBe('Reading: Test Town');
  });

  it('routes a question to the ANALYST with the question staged', () => {
    setEntitled(true);
    openDoor();
    fireEvent.change(screen.getByLabelText(/ask the surveyor about this page/i), {
      target: { value: 'why is bread so expensive here?' },
    });
    fireEvent.click(screen.getByRole('button', { name: /take it to the surveyor/i }));
    const dest = screen.getByTestId('dest-analyst');
    expect(dest.getAttribute('data-open')).toBe('true');
    expect(dest.getAttribute('data-q')).toBe('why is bread so expensive here?');
    // the slip closed; the one door is not a second panel
    expect(screen.queryByLabelText(/ask the surveyor about this page/i)).toBeNull();
  });

  it('routes a making-prompt to the WORKSHOP with the stage pre-selected and the prompt seeded', () => {
    setEntitled(true);
    openDoor();
    fireEvent.change(screen.getByLabelText(/ask the surveyor about this page/i), {
      target: { value: 'reskin the map in a woodcut style' },
    });
    fireEvent.click(screen.getByRole('button', { name: /take it to the surveyor/i }));
    const dest = screen.getByTestId('dest-workshop');
    expect(dest.getAttribute('data-stage')).toBe('style');
    expect(dest.getAttribute('data-prompt')).toBe('reskin the map in a woodcut style');
  });

  it('RETENTION: the promptless register links open the analyst / the workshop directly', () => {
    setEntitled(true);
    openDoor();
    fireEvent.click(screen.getByRole('button', { name: /open the workshop/i }));
    expect(screen.getByTestId('dest-workshop').getAttribute('data-stage')).toBe('content');
    expect(screen.getByTestId('dest-workshop').getAttribute('data-prompt')).toBe('');
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
const sendButton = () => screen.getByRole('button', { name: /take it to the surveyor/i });
const doorTab = () => screen.getByRole('button', { name: /ask the surveyor$/i });
const turnTexts = () => within(screen.getByRole('log'))
  .queryAllByTestId('surveyor-turn')
  .map((n) => n.textContent);

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
    fireEvent.click(sendButton());

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

  it('A2 — a making-prompt still reaches the workshop with the unchanged stage, prompt, and scope', () => {
    setEntitled(true);
    openDoor();
    fireEvent.change(composer(), { target: { value: 'reskin the map in a woodcut style' } });
    fireEvent.click(sendButton());
    const dest = screen.getByTestId('dest-workshop');
    expect(dest.getAttribute('data-stage')).toBe('style');
    expect(dest.getAttribute('data-prompt')).toBe('reskin the map in a woodcut style');
    expect(dest.getAttribute('data-scope')).toBe('settlement');
  });

  it('A3 — empty and whitespace-only drafts are ABSENCE: Send is dead, Enter is a no-op, nothing is logged', () => {
    setEntitled(true);
    openDoor();
    expect(sendButton().disabled).toBe(true);
    fireEvent.change(composer(), { target: { value: '   \n\t ' } });
    expect(sendButton().disabled).toBe(true);
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
        onOpenAnalyst={() => {}}
        onOpenInterview={() => {}}
        onOpenWorkshop={() => {}}
      />,
    );
    fireEvent.change(composer(), { target: { value: '   \n\t ' } });
    fireEvent.keyDown(composer(), { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: /take it to the surveyor/i }));
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

  it('on mobile Enter inserts a newline — only Send submits', () => {
    setEntitled(true);
    mobileRef.current = true;
    stubVisualViewport();
    openDoor();
    fireEvent.change(composer(), { target: { value: 'reskin the map in a woodcut style' } });
    fireEvent.keyDown(composer(), { key: 'Enter' });
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
    fireEvent.click(sendButton());
    expect(screen.getByTestId('dest-workshop').getAttribute('data-stage')).toBe('style');
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
