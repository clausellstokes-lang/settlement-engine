/** @vitest-environment jsdom */
/**
 * postGenCoach.test.jsx — the post-generate coach's presentational shell.
 *
 * The pure next-step builder is exercised in wizardNextSteps.test.js (node).
 * This file pins the coach itself: the no-settlement gate, the dismissed gate,
 * and that each forward "what's next" move (save -> export -> refine -> place)
 * renders as its OWN coach step, with state-aware save framing.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

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

  it('renders nothing when the coach was already dismissed', () => {
    localStorage.setItem('sf.postGenCoachDismissedAt', String(123));
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
    render(<PostGenCoach />);
    clickNextUntil(() => screen.queryByText(/Save it to your library/i));
    expect(screen.getByText(/Save it to your library/i)).toBeTruthy();
  });

  it('"Done" on the final step dismisses the coach and persists the dismissal', () => {
    const first = render(<PostGenCoach />);
    let guard = 0;
    while (!screen.queryByRole('button', { name: 'Done' }) && guard < 10) {
      fireEvent.click(screen.getByRole('button', { name: 'Next' }));
      guard += 1;
    }
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    // Gone immediately…
    expect(first.container.firstChild).toBeNull();
    expect(localStorage.getItem('sf.postGenCoachDismissedAt')).toBeTruthy();
    // …and stays gone on a fresh mount (persisted).
    cleanup();
    const second = render(<PostGenCoach />);
    expect(second.container.firstChild).toBeNull();
  });
});
