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
 *   5. X-22(d)(e)(f) — the routing goes invisible: an analyst answer and a workshop
 *      proposal both arrive as MESSAGES in the one log; a proposal is accepted by a typed
 *      yes and lands as PENDING decrees in the registry (edit mode owns approval), with
 *      the protected-consent barrier holding; the audience is chosen BY PHRASE (a
 *      player-framed question POSTs the player projection, and the reply is labelled);
 *      the cost is one muted line under the first reply; nothing in the log is a button
 *      except the one close.
 *
 * The analyst runs END TO END here, real transport and real slicers, with only the
 * network edge (lib/supabase.js) stubbed, so the audience pins read what would be POSTed.
 * The proposal hand-off runs the real review, the real bridge and the registry's real one
 * write site; only the compile's network call (lib/surveyorWrite.js) is stubbed.
 *
 * The shell is presentation: it never reaches the router, a provider, or the store, and
 * its draft and the door's log live and die with the mounted door.
 */
import { describe, it, expect, afterEach, beforeAll, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, act, within, waitFor, configure } from '@testing-library/react';
import { isPlayerSafeSource } from '../../src/domain/briefs/citations.js';

// A reply crosses two dynamic imports and an awaited edge; give each wait room under load.
configure({ asyncUtilTimeout: 4000 });

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  mobileRef.current = false;
  delete window.visualViewport;
});
beforeEach(() => {
  try { localStorage.clear(); } catch { /* jsdom always has it */ }
});

const { storeRef, entitledRef, mobileRef, invokeRef, compileRef } = vi.hoisted(() => ({
  storeRef: { current: { auth: {} } },
  entitledRef: { current: true },
  mobileRef: { current: false },
  invokeRef: { fn: null },
  compileRef: { fn: null },
}));

const ANSWER = {
  answer: 'Thornwall leads a commerce sphere.',
  claims: [{ text: 'Thornwall leads a commerce sphere.', source: 'x', sourced: true }],
  musings: [{ text: 'You could stage a betrayal at the next council.' }],
  citationCoverage: 1,
  registerPurity: 1,
  byok: false,
};
const RECAP_OPS = [
  { opType: 'npc_death', params: { npc: 'Mara' }, label: 'inferred', protectedFlags: [] },
  { opType: 'faction_shift', params: { faction: 'Guild' }, label: 'inferred', protectedFlags: ['named_fate'] },
];

function freshStore(extra = {}) {
  storeRef.current = {
    auth: {},
    settlement: { id: 's1', name: 'Test Town', decrees: [] },
    savedSettlements: [],
    campaigns: [],
    activeCampaignId: null,
    selectedSettlementId: null,
    activeSaveId: 'save-1',
    creditBalance: 7,
    phase: 'draft',
    // EM-D1's tier gate, the one edit mode reads: admitted unless an arm says otherwise.
    canEditSettlement: () => true,
    ...extra,
  };
}
beforeAll(async () => {
  // The door reaches the transport, the review, the bridge and the registry by DYNAMIC
  // import (off first paint). Warm them once so each arm's wait measures the door, not
  // the first cold import of the brief-composer graph.
  await Promise.all([
    import('../../src/lib/aiAnalyst.js'),
    import('../../src/domain/intent/opVocabulary.js'),
    import('../../src/domain/intent/interpretReview.js'),
    import('../../src/lib/intent/interpretApply.js'),
    import('../../src/store/editSlice.js'),
  ]);
}, 60000);
beforeEach(() => {
  freshStore();
  // The edge answers with the audience it was POSTed (the server echoes it).
  invokeRef.fn = vi.fn(async (_name, { body }) => ({ data: { ...ANSWER, audience: body.audience }, error: null }));
  compileRef.fn = vi.fn(async () => ({ ok: true, interpretation: { ops: RECAP_OPS.map((op) => ({ ...op })) }, seed: 1, interpretRef: 'ref' }));
});

// The ONE shared viewport authority (src/hooks/useIsMobile.js). The shell reads it for
// the bottom-sheet form; the Button and IconButton primitives read the same hook for
// their mobile tap floor.
vi.mock('../../src/hooks/useIsMobile.js', () => ({
  default: () => mobileRef.current,
  getIsMobile: () => mobileRef.current,
}));

// The store as the registry's one write site sees it: get/set over a plain object, the
// immer-style recipe applied in place.
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  useStore.setState = (recipe) => {
    const next = typeof recipe === 'function' ? recipe(storeRef.current) : recipe;
    if (next && next !== storeRef.current) Object.assign(storeRef.current, next);
  };
  return { useStore };
});
// The network edge only: the transport, the slicers and the audience rule run real.
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: { functions: { invoke: (...a) => invokeRef.fn(...a) } },
}));
vi.mock('../../src/lib/analytics.js', () => ({
  track: () => {},
  EVENTS: new Proxy({}, { get: (_, key) => String(key) }),
}));
// The compile's network call only: the review, the bridge and the registry run real.
vi.mock('../../src/lib/surveyorWrite.js', () => ({
  compileInterpretation: (...a) => compileRef.fn(...a),
}));
// The Surveyor gate is resolved by the lazy useSurveyorEntitled hook; mock it so
// the door renders synchronously here. The chokepoint predicate (isSurveyorTier)
// is re-exported real from the door module and tested directly below.
vi.mock('../../src/components/surveyor/useSurveyorEntitled.js', () => ({
  useSurveyorEntitled: () => entitledRef.current,
}));
// X-22: the composer's rotating placeholder is the analyst's zero-cost suggested
// questions for the page in view: here the generate page with Test Town on it (no
// factions, no people), so the settlement-scope set, in its own order.
const NO_PAGE_CTX = { view: '', params: {}, settlement: null, savedSettlements: [], activeCampaign: null, worldState: null };
const TOWN_SUGGESTIONS = [
  'What is the state of Test Town this week?',
  'What can I tell the players about Test Town?',
  'What tensions are building in Test Town?',
];
vi.mock('../../src/components/surveyor/useSurveyorContext.js', () => ({
  useSurveyorContext: () => ({ anchorLabel: 'Reading: Test Town', ctx: NO_PAGE_CTX }),
}));
// The Interview PANEL is stubbed too (its file is untouched and has its own contract);
// the chair's ruling gives it a PHRASE, so the door must open it from the chat.
vi.mock('../../src/components/InterviewPanel.jsx', () => ({
  default: ({ open, initialQuestion }) => (
    <div data-testid="dest-interview" data-open={String(!!open)} data-q={initialQuestion} />
  ),
}));
// The workshop PANEL is stubbed (its stages have their own suites); its proposal hand-off,
// message and note stay real.
vi.mock('../../src/components/surveyor/SurveyorWorkshop.jsx', async (importOriginal) => ({
  ...(await importOriginal()),
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

/** X-22: on the desktop Enter is the send key; on a phone the composer's one send glyph. */
function typeAndSend(text) {
  fireEvent.change(composer(), { target: { value: text } });
  if (mobileRef.current) fireEvent.click(screen.getByRole('button', { name: 'Send' }));
  else pressEnter();
}

/** The bodies POSTed to the analyst edge, oldest first. */
const posted = () => invokeRef.fn.mock.calls.map(([, { body }]) => body);
/** Send a question and wait for its reply to land in the log. */
async function askAndWait(text, count = 1) {
  typeAndSend(text);
  await waitFor(() => expect(screen.getAllByTestId('analyst-reply')).toHaveLength(count));
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
      expect(box.getAttribute('placeholder')).toBe(TOWN_SUGGESTIONS[0]);
      act(() => { vi.advanceTimersByTime(4000); });
      expect(box.getAttribute('placeholder')).toBe(TOWN_SUGGESTIONS[1]);
      fireEvent.change(box, { target: { value: 'a draft' } });
      act(() => { vi.advanceTimersByTime(8000); });
      expect(box.getAttribute('placeholder')).toBe(TOWN_SUGGESTIONS[1]);
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

describe('SurveyorDoor — X-22(d): the analyst answers IN THE LOG', () => {
  it('a question goes through the router to the analyst and its reply lands in the log', async () => {
    setEntitled(true);
    openDoor();
    await askAndWait('why is bread so expensive here?');
    expect(posted()).toHaveLength(1);
    expect(posted()[0].question).toBe('why is bread so expensive here?');
    const reply = screen.getByTestId('analyst-reply');
    expect(within(screen.getByRole('log')).getByTestId('analyst-reply')).toBe(reply);
    expect(reply.textContent).toContain('Thornwall leads a commerce sphere.');
    // §3b TWO-VOICES survive the move: the musing register is its own block.
    expect(within(reply).getByTestId('analyst-musings').textContent).toMatch(/suggestions, not the record/i);
    expect(reply.textContent).toMatch(/Cited 1\/1/);
    // no second panel: the analyst is a message, not a destination window
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
  });

  it('X-22(f): the cost is one muted line under the FIRST reply only, never a control', async () => {
    setEntitled(true);
    openDoor();
    await askAndWait('why is bread so expensive here?');
    expect(screen.getAllByTestId('surveyor-cost').map((n) => n.textContent)).toEqual(['3 credits per answer · 7 left']);
    await askAndWait('who keeps the granary?', 2);
    expect(screen.getAllByTestId('surveyor-cost')).toHaveLength(1);
    expect(within(screen.getByTestId('surveyor-cost')).queryAllByRole('button')).toEqual([]);
  });

  it('RETIRED styleOverhaul: a map-style prompt reaches the ANALYST and opens no write stage', async () => {
    setEntitled(true);
    openDoor();
    await askAndWait('reskin the map in a woodcut style');
    expect(posted()[0].question).toBe('reskin the map in a woodcut style');
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
  });

  it('one turn at a time: a send while a reply is on its way is refused and keeps its draft', async () => {
    let release;
    invokeRef.fn = vi.fn((_name, { body }) => new Promise((resolve) => {
      release = () => resolve({ data: { ...ANSWER, audience: body.audience }, error: null });
    }));
    setEntitled(true);
    openDoor();
    typeAndSend('why is bread so expensive here?');
    await waitFor(() => expect(screen.getByTestId('surveyor-busy')).toBeTruthy());
    await waitFor(() => expect(invokeRef.fn).toHaveBeenCalledTimes(1));
    typeAndSend('and the granary?');
    expect(composer().value).toBe('and the granary?');
    await act(async () => { release(); });
    await waitFor(() => expect(screen.getAllByTestId('analyst-reply')).toHaveLength(1));
    expect(turnTexts()).toEqual(['why is bread so expensive here?']);
  });
});

describe('SurveyorDoor — X-22(e): the audience by phrase', () => {
  it('a player-framed question POSTs the PLAYER projection, and the reply is labelled player-safe', async () => {
    setEntitled(true);
    openDoor();
    await askAndWait('answer this for my players: who rules here?');
    const body = posted()[0];
    // The structural rule decided from the words: the request asked for 'dm' and the
    // slicers downgraded it, so what left the browser is the player projection only.
    expect(body.audience).toBe('player');
    expect(body.slices.length).toBeGreaterThan(0);
    expect(body.slices.every((slice) => isPlayerSafeSource(slice.source))).toBe(true);
    const reply = screen.getByTestId('analyst-reply');
    expect(reply.getAttribute('data-audience')).toBe('player');
    expect(within(reply).getByTestId('analyst-audience').textContent).toMatch(/^Player-safe/);
  });

  it('a plain question stays the DM\'s full-truth answer and wears no player label (the anchor)', async () => {
    setEntitled(true);
    openDoor();
    await askAndWait('who rules here?');
    expect(posted()[0].audience).toBe('dm');
    expect(screen.getByTestId('analyst-reply').getAttribute('data-audience')).toBe('dm');
    expect(screen.queryByTestId('analyst-audience')).toBeNull();
  });

  it('the Segmented audience toggle is gone (no "Answer audience" control anywhere)', async () => {
    setEntitled(true);
    openDoor();
    await askAndWait('who rules here?');
    expect(screen.queryByRole('radiogroup')).toBeNull();
    expect(screen.queryByLabelText(/answer audience/i)).toBeNull();
    expect(screen.queryByRole('button', { name: /helpful/i })).toBeNull();
  });
});

describe('SurveyorDoor — X-22(d): a workshop proposal is a message, accepted by a typed yes', () => {
  const recap = 'The party sacked the customs house last session and Mara died.';

  it('a session recap compiles to proposed ops in the log, with no control on them', async () => {
    setEntitled(true);
    openDoor();
    typeAndSend(recap);
    const proposal = await waitFor(() => screen.getByTestId('surveyor-proposal'));
    expect(compileRef.fn).toHaveBeenCalledTimes(1);
    expect(compileRef.fn.mock.calls[0][0].sessionText).toBe(recap);
    expect([...proposal.querySelectorAll('li')].map((li) => li.getAttribute('data-op-type'))).toEqual(['npc_death', 'faction_shift']);
    expect(proposal.textContent).toContain('(protected)');
    expect(proposal.textContent).toMatch(/Say yes to add them to the decree registry\./);
    expect(within(proposal).queryAllByRole('button')).toEqual([]);
    // the analyst was not asked: the router sent this to the write stage
    expect(invokeRef.fn).not.toHaveBeenCalled();
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
  });

  it('"yes, add it" stages PENDING surveyor decrees through the registry; the protected op is held back', async () => {
    setEntitled(true);
    openDoor();
    typeAndSend(recap);
    await waitFor(() => screen.getByTestId('surveyor-proposal'));
    typeAndSend('yes, add it');
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('Added 1 to the decree registry.'));
    const decrees = storeRef.current.settlement.decrees;
    expect(decrees).toHaveLength(1);
    expect(decrees[0]).toMatchObject({ status: 'pending', addedBy: 'surveyor', op: { type: 'npc_death', payload: { npc: 'Mara' } } });
    expect(screen.getByRole('log').textContent).toContain('Held back as protected: faction_shift.');
    // the chat only hands off: nothing was applied, the analyst was not asked
    expect(invokeRef.fn).not.toHaveBeenCalled();
  });

  it('any other reply lets the proposal lapse: nothing is staged and the reply is routed as a prompt', async () => {
    setEntitled(true);
    openDoor();
    typeAndSend(recap);
    await waitFor(() => screen.getByTestId('surveyor-proposal'));
    await askAndWait('no, why did Mara die?');
    expect(storeRef.current.settlement.decrees).toEqual([]);
    expect(posted()[0].question).toBe('no, why did Mara die?');
    // and a later yes has nothing to accept: it is just a prompt
    await askAndWait('yes', 2);
    expect(storeRef.current.settlement.decrees).toEqual([]);
  });

  it('with no open save the registry has nowhere to live: the log says so and the proposal stays open', async () => {
    freshStore({ activeSaveId: null });
    setEntitled(true);
    openDoor();
    typeAndSend(recap);
    await waitFor(() => screen.getByTestId('surveyor-proposal'));
    typeAndSend('yes');
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('lives on a saved settlement'));
    expect(storeRef.current.settlement.decrees).toEqual([]);
    storeRef.current.activeSaveId = 'save-1';
    typeAndSend('yes');
    await waitFor(() => expect(storeRef.current.settlement.decrees).toHaveLength(1));
  });

  // THE CHAIR'S RULING (2026-10-30): the hand-off is CONFIRMED WITH THE GATE KEPT. "yes,
  // add it" calls the same gated writer edit mode uses; where the account's tier does not
  // admit edit mode, nothing is written and the proposal is noted for when it opens.
  it('GATE KEPT: where edit mode is not admitted, a yes writes NOTHING and the proposal is noted', async () => {
    freshStore({ canEditSettlement: () => false });
    setEntitled(true);
    openDoor();
    typeAndSend(recap);
    await waitFor(() => screen.getByTestId('surveyor-proposal'));
    typeAndSend('yes, add it');
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('Noted.'));
    expect(screen.getByRole('log').textContent).toContain('becomes addable when edit mode opens for your account');
    expect(storeRef.current.settlement.decrees).toEqual([]);
    // the proposal stays open: once the gate admits the account, the same yes stages it
    storeRef.current.canEditSettlement = () => true;
    typeAndSend('yes');
    await waitFor(() => expect(storeRef.current.settlement.decrees).toHaveLength(1));
  });

  it('GATE KEPT: a store without the gate reads as NOT admitted (fail closed), never as a bypass', async () => {
    freshStore({ canEditSettlement: undefined });
    setEntitled(true);
    openDoor();
    typeAndSend(recap);
    await waitFor(() => screen.getByTestId('surveyor-proposal'));
    typeAndSend('yes');
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('Noted.'));
    expect(storeRef.current.settlement.decrees).toEqual([]);
  });

  it('NO BUTTON INSIDE: with a reply and a proposal in the log, the one control is the close', async () => {
    setEntitled(true);
    openDoor();
    await askAndWait('why is bread so expensive here?');
    typeAndSend(recap);
    await waitFor(() => screen.getByTestId('surveyor-proposal'));
    expect(within(chat()).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Close the Surveyor']);
  });

  // ⚠ Re-pointed off the retired styleOverhaul prompt (ODQ §763.2) onto a CONSTRUCT one:
  // 'content' is the workshop's fallback stage, so only a non-default stage id proves the
  // composer carried the routing through.
  it('a making-prompt still opens the WORKSHOP (stage, prompt, scope); the log says so and folds beside it', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('build me a new town on the river');
    const dest = screen.getByTestId('dest-workshop');
    expect(dest.getAttribute('data-stage')).toBe('construct');
    expect(dest.getAttribute('data-prompt')).toBe('build me a new town on the river');
    expect(dest.getAttribute('data-scope')).toBe('settlement');
    expect(screen.queryByRole('log')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'The Surveyor' }));
    expect(screen.getByRole('log').textContent).toContain('Opening the workshop.');
    expect(within(chat()).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Close the Surveyor']);
  });

  // THE CHAIR'S RULING (2026-10-30): the Interview keeps a way in BY PHRASE, never a silent
  // retirement. "interview" / "ask the world" open its panel from the chat; the log says so.
  it('the Interview opens by PHRASE from the chat ("ask the world …"), seeded, and the log says so', () => {
    setEntitled(true);
    openDoor();
    typeAndSend('ask the world why the river road is closed');
    const dest = screen.getByTestId('dest-interview');
    expect(dest.getAttribute('data-open')).toBe('true');
    expect(dest.getAttribute('data-q')).toBe('ask the world why the river road is closed');
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
    expect(invokeRef.fn).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'The Surveyor' }));
    expect(screen.getByRole('log').textContent).toContain('Opening the Interview.');
  });

  it('"interview" names it too; a plain question still goes to the analyst (the anchor)', async () => {
    setEntitled(true);
    openDoor();
    typeAndSend('interview the harbourmaster about the fire');
    expect(screen.getByTestId('dest-interview').getAttribute('data-q')).toBe('interview the harbourmaster about the fire');
    fireEvent.click(screen.getByRole('button', { name: 'The Surveyor' }));
    await askAndWait('why is bread so expensive here?');
    expect(posted()[0].question).toBe('why is bread so expensive here?');
  });
});

describe('SurveyorDoor — absence, the keyboard, and the composer that grows upward', () => {
  it('empty and whitespace-only drafts are ABSENCE: Enter is a no-op, nothing is logged', () => {
    setEntitled(true);
    openDoor();
    pressEnter();
    fireEvent.change(composer(), { target: { value: '   \n\t ' } });
    pressEnter();
    expect(invokeRef.fn).not.toHaveBeenCalled();
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
    expect(screen.queryByRole('log')).toBeNull();
    fireEvent.keyDown(composer(), { key: 'Enter', isComposing: true });
    expect(screen.queryByRole('log')).toBeNull();
    pressEnter();
    expect(turnTexts()).toEqual(['why is bread so expensive here?']);
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

describe('SurveyorDoor — mobile: the keyboard inset and the bottom sheet', () => {
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

  // THE CHAIR'S RULING (2026-10-30): on a phone Return inserts a newline (people type a
  // paragraph on the on-screen keyboard) and ONE send glyph inside the composer sends: the
  // single exception to "no buttons", for input only. The desktop keeps Enter to send.
  it('on mobile Return inserts a newline and the ONE send glyph in the composer sends', () => {
    setEntitled(true);
    mobileRef.current = true;
    stubVisualViewport();
    openDoor();
    expect(composer().getAttribute('enterkeyhint')).toBe('enter');
    // the composer-only first open on a phone: the box and its one send glyph, nothing else
    expect(within(chat()).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Send']);
    expect(screen.getByRole('button', { name: 'Send' }).disabled).toBe(true);
    fireEvent.change(composer(), { target: { value: 'build me a new town on the river' } });
    pressEnter();
    expect(screen.queryByTestId('dest-workshop')).toBeNull();
    expect(composer().value).toBe('build me a new town on the river');
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByTestId('dest-workshop').getAttribute('data-stage')).toBe('construct');
  });

  it('on the desktop there is no send glyph: Enter sends, and the box says so', () => {
    setEntitled(true);
    openDoor();
    expect(composer().getAttribute('enterkeyhint')).toBe('send');
    expect(screen.queryByRole('button', { name: 'Send' })).toBeNull();
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

  it('X-22(c) PHONE: the log is a bottom sheet (no floating anchor, no fixed width), lifted over the keyboard', async () => {
    setEntitled(true);
    mobileRef.current = true;
    stubVisualViewport({ height: 500, offsetTop: 0 });
    openDoor();
    await askAndWait('why is bread so expensive here?');
    const sheet = chat();
    expect(sheet.className).toContain('sf-door-panel--sheet');
    expect(sheet.style.position).toBe('');
    expect(sheet.style.width).toBe('');
    expect(sheet.style.getPropertyValue('--sf-door-kbd-inset')).toBe('300px');
    // the phone's two controls: the close, and the composer's one send glyph (input only)
    expect(within(sheet).getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual(['Close the Surveyor', 'Send']);
  });

  it('PHONE: a drag on the sheet header neither moves it nor writes the memory; a tap still folds it', async () => {
    setEntitled(true);
    mobileRef.current = true;
    openDoor();
    await askAndWait('why is bread so expensive here?');
    const head = within(chat()).getByText('The Surveyor');
    fireEvent.pointerDown(head, { clientX: 100, clientY: 700, button: 0, pointerType: 'touch' });
    fireEvent.pointerMove(window, { clientX: 100, clientY: 300 });
    fireEvent.pointerUp(window, { clientX: 100, clientY: 300 });
    expect(chat().style.top).toBe('');
    expect(localStorage.getItem(CHAT_POS_KEY)).toBeNull();
    fireEvent.pointerDown(within(chat()).getByText('The Surveyor'), { clientX: 100, clientY: 700, button: 0, pointerType: 'touch' });
    fireEvent.pointerUp(window, { clientX: 100, clientY: 700 });
    expect(screen.queryByRole('log')).toBeNull();
    expect(screen.getByRole('button', { name: 'The Surveyor' })).toBeTruthy();
  });

  it('with no visualViewport API the inset is zero — the shell degrades, it never throws', () => {
    setEntitled(true);
    mobileRef.current = true;
    openDoor();
    expect(chat().style.getPropertyValue('--sf-door-kbd-inset')).toBe('0px');
  });
});
