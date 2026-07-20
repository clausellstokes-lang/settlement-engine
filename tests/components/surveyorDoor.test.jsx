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
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const { storeRef, entitledRef } = vi.hoisted(() => ({
  storeRef: { current: { auth: {} } },
  entitledRef: { current: true },
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
