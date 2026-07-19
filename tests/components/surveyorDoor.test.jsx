/**
 * @vitest-environment jsdom
 *
 * surveyorDoor.test.jsx — THE ONE DOOR contract (C13, owner ruling 2026-07-18).
 *
 * Pins the four laws of the door:
 *   1. ENTITLEMENT — the marker renders ONLY for the Surveyor tier ('premium' via the
 *      isSurveyorTier chokepoint): no lock-tease, no placeholder — the margin is EMPTY
 *      for anon/free.
 *   2. ONE DOOR — the tab opens a prompt slip; prompts route to DESTINATIONS (the
 *      analyst / a workshop stage); the destinations receive the staged prompt.
 *   3. CONTEXT-FIRST — the slip shows the visible anchor (what the Surveyor reads).
 *   4. RETENTION — the promptless register links keep the retired launchers' open-
 *      without-a-prompt capability reachable.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

afterEach(() => { cleanup(); vi.clearAllMocks(); });

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => ({
  useStore: (selector) => selector(storeRef.current),
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

const setTier = (tier) => { storeRef.current = { auth: { tier } }; };

function openDoor() {
  render(<SurveyorDoor />);
  fireEvent.click(screen.getByRole('button', { name: /ask the surveyor/i }));
}

describe('SurveyorDoor — entitlement (the marker law)', () => {
  it('renders NOTHING for anon and free tiers — an empty margin, no lock-tease', () => {
    for (const tier of ['anon', 'free']) {
      setTier(tier);
      const { container, unmount } = render(<SurveyorDoor />);
      expect(container.innerHTML, `tier "${tier}" must see an empty margin`).toBe('');
      unmount();
    }
  });

  it('renders the tab for the Surveyor tier, with no visible text until hover (aria-label carries the name)', () => {
    setTier('premium');
    render(<SurveyorDoor />);
    const tab = screen.getByRole('button', { name: /ask the surveyor/i });
    expect(tab.getAttribute('aria-label')).toBe('Ask the Surveyor');
    // the reveal label is aria-hidden (AT hears the aria-label, sighted users hover)
    expect(tab.querySelector('[aria-hidden="true"]')?.textContent).toBe('Ask the Surveyor');
  });

  it('isSurveyorTier is the one chokepoint: premium only', () => {
    expect(isSurveyorTier('premium')).toBe(true);
    expect(isSurveyorTier('free')).toBe(false);
    expect(isSurveyorTier('anon')).toBe(false);
  });

  it('respects the route-level visible gate (auth/checkout chrome)', () => {
    setTier('premium');
    const { container } = render(<SurveyorDoor visible={false} />);
    expect(container.innerHTML).toBe('');
  });
});

describe('SurveyorDoor — the prompt slip routes to destinations', () => {
  it('shows the visible anchor (context-first made tangible) in the slip', () => {
    setTier('premium');
    openDoor();
    expect(screen.getByTestId('surveyor-anchor').textContent).toBe('Reading: Test Town');
  });

  it('routes a question to the ANALYST with the question staged', () => {
    setTier('premium');
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
    setTier('premium');
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
    setTier('premium');
    openDoor();
    fireEvent.click(screen.getByRole('button', { name: /open the workshop/i }));
    expect(screen.getByTestId('dest-workshop').getAttribute('data-stage')).toBe('content');
    expect(screen.getByTestId('dest-workshop').getAttribute('data-prompt')).toBe('');
  });
});
