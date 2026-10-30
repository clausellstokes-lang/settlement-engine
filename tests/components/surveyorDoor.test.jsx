/**
 * @vitest-environment jsdom
 *
 * surveyorDoor.test.jsx — THE ONE DOOR contract (C13, owner ruling 2026-07-18), as the
 * simple floating chat the owner ruled on 2026-10-30 (X-22).
 *
 * Pins the laws of the door:
 *   1. ENTITLEMENT (owner ruling 2026-07-19, FINAL) — the marker renders ONLY for a
 *      live Surveyor entitlement, a Founder, or an elevated role (via the isSurveyorTier
 *      chokepoint): no lock-tease — the margin is EMPTY for anon/free AND for
 *      Cartographer 'premium' (the discriminator: 'premium' alone is insufficient).
 *   2. ONE DOOR — every prompt goes through the one router; the destinations receive
 *      the staged prompt.
 *   3. CONTEXT-FIRST — the log shows the visible anchor (what the Surveyor reads).
 *   4. X-22 — the first open is ONE composer with a rotating placeholder of suggested
 *      first questions (no chips, no send button, no register links; Enter sends); the
 *      first send grows it into a floating log in the coach's chrome (movable by its
 *      header, remembered per device, Escape and a header tap fold it to a pill, the one
 *      close retires it); the chat is non-modal.
 *
 * The shell is presentation: it never reaches the router, a provider, or the store, and
 * its draft and the door's log live and die with the mounted door.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within, waitFor } from '@testing-library/react';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mobileRef.current = false;
  delete window.visualViewport;
});
beforeEach(() => {
  try { localStorage.clear(); } catch { /* jsdom always has it */ }
});

const { storeRef, entitledRef, mobileRef } = vi.hoisted(() => ({
  storeRef: { current: { auth: {} } },
  entitledRef: { current: true },
  mobileRef: { current: false },
}));

// The ONE shared viewport authority (src/hooks/useIsMobile.js). The shell reads it for
// the bottom-sheet form; the Button and IconButton primitives read the same hook for
// their mobile tap floor.
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
// Destinations are stubbed: this file pins the DOOR's routing, not the panels.
vi.mock('../../src/components/AiAnalystPanel.jsx', () => ({
  default: ({ open, initialQuestion }) => (
    <div data-testid="dest-analyst" data-open={String(!!open)} data-q={initialQuestion} />
  ),
}));
vi.mock('../../src/components/surveyor/SurveyorWorkshop.jsx', () => ({
  default: ({ open, initialStage, initialPrompt, initialScope }) => (
    <div data-testid="dest-workshop" data-open={String(!!open)} data-stage={initialStage} data-prompt={initialPrompt} data-scope={initialScope || ''} />
  ),
}));

import SurveyorDoor, { isSurveyorTier } from '../../src/components/surveyor/SurveyorDoor.jsx';
import SurveyorTextIntentShell, { CHAT_POS_KEY } from '../../src/components/surveyor/SurveyorTextIntentShell.jsx';

const setEntitled = (v) => { entitledRef.current = v; };
const composer = () => screen.getByLabelText(/ask the surveyor about this page/i);
const pressEnter = () => fireEvent.keyDown(composer(), { key: 'Enter' });
const doorTab = () => screen.getByRole('button', { name: /ask the surveyor$/i });
const chat = () => screen.getByRole('dialog', { name: 'The Surveyor' });
const turnTexts = () => within(screen.getByRole('log'))
  .queryAllByTestId('surveyor-turn')
  .map((n) => n.textContent);

function openDoor() {
  render(<SurveyorDoor />);
  fireEvent.click(doorTab());
}

/** X-22: no send button; Enter is the send key. */
function typeAndSend(text) {
  fireEvent.change(composer(), { target: { value: text } });
  pressEnter();
}

/** Stub the layout-only scrollHeight jsdom never computes. */
function stubScrollHeight(el, px) {
  Object.defineProperty(el, 'scrollHeight', { configurable: true, get: () => px });
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
    const tab = doorTab();
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

  it('PRIVACY FLOOR: a non-entitled user gets no shell at all — not even a closed one', () => {
    setEntitled(false);
    const { container } = render(<SurveyorDoor />);
    expect(container.innerHTML).toBe('');
    expect(screen.queryByRole('log')).toBeNull();
    expect(screen.queryByLabelText(/ask the surveyor about this page/i)).toBeNull();
  });
});

describe('SurveyorDoor — X-22 first open: one composer', () => {
  it('one composer and nothing else (no heading, anchor, chips, log or buttons)', () => {
    setEntitled(true);
    openDoor();
    const box = chat();
    expect(within(box).getAllByRole('textbox')).toHaveLength(1);
    expect(within(box).queryAllByRole('button')).toEqual([]);
    expect(within(box).queryByRole('log')).toBeNull();
    expect(within(box).queryByTestId('surveyor-anchor')).toBeNull();
    expect(box.textContent).toBe('');
  });

  it('the empty composer rotates through the suggested first questions, and a draft stops it', () => {
    vi.useFakeTimers();
    try {
      setEntitled(true);
      openDoor();
      const box = composer();
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

  // ⚰ THE PROMPTLESS REGISTER LINKS WENT WITH X-22 ("no buttons inside"). This arm used
  // to open the workshop from a link; it now pins that the links are gone, anchored on
  // the composer so an empty render cannot pass it.
  it('the promptless register links and the send button are gone; the composer is the only way in', () => {
    setEntitled(true);
    openDoor();
    expect(composer()).toBeTruthy();
    for (const name of [/open the analyst/i, /ask the world/i, /open the workshop/i, /take it to the surveyor/i]) {
      expect(screen.queryByRole('button', { name })).toBeNull();
    }
  });

  it('the composer takes focus on open; the chat is NON-modal (a dialog without aria-modal)', async () => {
    setEntitled(true);
    openDoor();
    await waitFor(() => expect(document.activeElement).toBe(composer()));
    expect(chat().getAttribute('aria-modal')).toBeNull();
  });

  it('Escape puts the composer away, keeps the draft, and hands focus back to the door tab', async () => {
    setEntitled(true);
    render(<SurveyorDoor />);
    doorTab().focus();
    fireEvent.click(doorTab());
    await waitFor(() => expect(document.activeElement).toBe(composer()));
    fireEvent.change(composer(), { target: { value: 'why is bread' } });
    fireEvent.keyDown(composer(), { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'The Surveyor' })).toBeNull();
    expect(document.activeElement).toBe(doorTab());
    fireEvent.click(doorTab());
    expect(composer().value).toBe('why is bread');
  });
});

describe('SurveyorDoor — X-22 the first send grows the composer into the floating log', () => {
  it('composer-only before the first send; the log, the anchor and the turn after it', () => {
    setEntitled(true);
    openDoor();
    expect(screen.queryByRole('log')).toBeNull();
    const box = composer();
    box.focus();
    typeAndSend('  why is bread so expensive here?  ');
    expect(turnTexts()).toEqual(['why is bread so expensive here?']);
    expect(screen.getByRole('log').textContent).toContain('You asked');
    expect(within(chat()).getByTestId('surveyor-anchor').textContent).toBe('Reading: Test Town');
    // THE SAME NODE: the box grew into the log, it was not replaced, so the caret stayed.
    expect(composer()).toBe(box);
    expect(document.activeElement).toBe(box);
    expect(box.value).toBe('');
  });

  it('the log is a fixed card on the floating-panel layer, about 320 px, lifted over the footer', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('why is bread so expensive here?');
    const card = chat();
    expect(card.style.position).toBe('fixed');
    expect(card.style.width).toBe('320px');
    expect(card.style.zIndex).toBe('60');
    expect(card.style.bottom).toMatch(/calc|px/);
  });

  it('the only button inside the log is the one close', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('why is bread so expensive here?');
    expect(within(chat()).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Close the Surveyor']);
  });

  it('Escape folds the log to a pill; the pill unfolds it with the log intact', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('why is bread so expensive here?');
    fireEvent.keyDown(composer(), { key: 'Escape' });
    expect(screen.queryByRole('log')).toBeNull();
    const pill = screen.getByRole('button', { name: 'The Surveyor' });
    expect(pill.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(pill);
    expect(turnTexts()).toEqual(['why is bread so expensive here?']);
  });

  it('a tap on the header folds it (the header is a handle, not a button)', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('why is bread so expensive here?');
    const head = within(chat()).getByText('The Surveyor');
    fireEvent.pointerDown(head, { clientX: 100, clientY: 100, button: 0, pointerType: 'mouse' });
    fireEvent.pointerUp(window, { clientX: 100, clientY: 100 });
    expect(screen.queryByRole('log')).toBeNull();
    expect(screen.getByRole('button', { name: 'The Surveyor' })).toBeTruthy();
  });

  it('a drag by the header moves the log and remembers where, per device', () => {
    setEntitled(true);
    Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: 1440 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: 900 });
    openDoor();
    typeAndSend('why is bread so expensive here?');
    const card = chat();
    card.getBoundingClientRect = () => ({ left: 24, top: 500, width: 320, height: 300, right: 344, bottom: 800 });
    const head = within(card).getByText('The Surveyor');
    fireEvent.pointerDown(head, { clientX: 100, clientY: 510, button: 0, pointerType: 'mouse' });
    fireEvent.pointerMove(window, { clientX: 300, clientY: 310 });
    fireEvent.pointerUp(window, { clientX: 300, clientY: 310 });
    expect(chat().style.left).toBe('224px');
    expect(chat().style.top).toBe('300px');
    expect(JSON.parse(localStorage.getItem(CHAT_POS_KEY))).toEqual({ left: 224, top: 300 });
    // still open: a drag is not a fold
    expect(screen.getByRole('log')).toBeTruthy();
  });

  it('the close retires the conversation for the visit: the next open is one composer again', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('why is bread so expensive here?');
    fireEvent.click(within(chat()).getByRole('button', { name: 'Close the Surveyor' }));
    expect(screen.queryByRole('dialog', { name: 'The Surveyor' })).toBeNull();
    fireEvent.click(doorTab());
    expect(screen.queryByRole('log')).toBeNull();
    expect(within(chat()).getAllByRole('textbox')).toHaveLength(1);
  });
});

describe('SurveyorDoor — every prompt goes through the one router', () => {
  it('routes a question to the ANALYST with the question staged', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('why is bread so expensive here?');
    const dest = screen.getByTestId('dest-analyst');
    expect(dest.getAttribute('data-open')).toBe('true');
    expect(dest.getAttribute('data-q')).toBe('why is bread so expensive here?');
  });

  // ⚠ Re-pointed off the retired styleOverhaul prompt (ODQ §763.2) onto a CONSTRUCT one:
  // 'content' is the workshop's fallback stage, so only a non-default stage id proves the
  // composer carried the routing through.
  it('routes a making-prompt to the WORKSHOP (stage, prompt, scope) and folds the log beside it', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('build me a new town on the river');
    const dest = screen.getByTestId('dest-workshop');
    expect(dest.getAttribute('data-stage')).toBe('construct');
    expect(dest.getAttribute('data-prompt')).toBe('build me a new town on the river');
    expect(dest.getAttribute('data-scope')).toBe('settlement');
    expect(screen.queryByRole('log')).toBeNull();
    expect(screen.getByRole('button', { name: 'The Surveyor' })).toBeTruthy();
  });

  it('RETIRED styleOverhaul: a map-style prompt reaches the ANALYST and opens no write stage', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('reskin the map in a woodcut style');
    // POSITIVE first — the door still routed it somewhere, so the absence below is a
    // routing decision and not a door that simply stopped working.
    expect(screen.getByTestId('dest-analyst').getAttribute('data-q')).toBe('reskin the map in a woodcut style');
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
  });
});

describe('SurveyorDoor — absence, the keyboard, and the composer that grows upward', () => {
  it('empty and whitespace-only drafts are ABSENCE: Enter is a no-op, nothing is logged', () => {
    setEntitled(true);
    openDoor();
    pressEnter();
    fireEvent.change(composer(), { target: { value: '   \n\t ' } });
    pressEnter();
    expect(screen.queryByTestId('dest-analyst')).toBeNull();
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
    expect(screen.queryByRole('log')).toBeNull();
    // still open — an absent prompt is not a dismissal
    expect(composer()).toBeTruthy();
  });

  it("absence stops IN THE SHELL: a blank draft never reaches the door's send at all", () => {
    // Driven directly, with the send stubbed TRUTHY, the shell has to be the thing that stops.
    const onSend = vi.fn(() => true);
    render(<SurveyorTextIntentShell open anchorLabel="Reading: Test Town" onSend={onSend} />);
    fireEvent.change(composer(), { target: { value: '   \n\t ' } });
    pressEnter();
    expect(onSend).not.toHaveBeenCalled();
  });

  it('a send the door refuses keeps the draft (the box clears only when the turn left it)', () => {
    const onSend = vi.fn(() => false);
    render(<SurveyorTextIntentShell open anchorLabel="Reading: Test Town" onSend={onSend} />);
    typeAndSend('why is bread so expensive here?');
    expect(onSend).toHaveBeenCalledWith('why is bread so expensive here?');
    expect(composer().value).toBe('why is bread so expensive here?');
  });

  it('only a plain Enter submits — Shift+Enter and an IME composition do not', () => {
    setEntitled(true);
    openDoor();
    fireEvent.change(composer(), { target: { value: 'why is bread so expensive here?' } });
    fireEvent.keyDown(composer(), { key: 'Enter', shiftKey: true });
    expect(screen.queryByTestId('dest-analyst')).toBeNull();
    fireEvent.keyDown(composer(), { key: 'Enter', isComposing: true });
    expect(screen.queryByTestId('dest-analyst')).toBeNull();
    pressEnter();
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

describe('SurveyorDoor — mobile, the keyboard inset', () => {
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

    const sheet = chat();
    expect(sheet.style.getPropertyValue('--sf-door-kbd-inset')).toBe('300px');
    expect(vv.addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(vv.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));

    act(() => {
      vv.height = 640;
      vv.offsetTop = 0;
      listeners.resize.forEach((fn) => fn());
    });
    expect(sheet.style.getPropertyValue('--sf-door-kbd-inset')).toBe('160px');

    fireEvent.keyDown(composer(), { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'The Surveyor' })).toBeNull();
    expect(vv.removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(vv.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(listeners.resize).toHaveLength(0);
    expect(listeners.scroll).toHaveLength(0);
  });

  it('with no visualViewport API the inset is zero — the shell degrades, it never throws', () => {
    setEntitled(true);
    mobileRef.current = true;
    openDoor();
    expect(chat().style.getPropertyValue('--sf-door-kbd-inset')).toBe('0px');
  });
});
