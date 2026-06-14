/** @vitest-environment jsdom */
/**
 * wizardNextSteps.test.jsx — P134 / W-4 component contract.
 *
 * The pure builder is exercised in wizardNextSteps.test.js (node). This
 * file pins the presentational shell: the no-settlement gate, store
 * wiring, and that the derived guide surfaces in the DOM (headline +
 * step labels, with state-aware save framing).
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';

vi.mock('../../src/store/index.js', () => {
  const data = {
    settlement: { tier: 'Village' },
    canSave: () => false,
    auth: { tier: 'anon' },
  };
  function useStore(selector) { return selector(data); }
  useStore.getState = () => data;
  useStore.__set = (next) => Object.assign(data, next);
  return { useStore };
});

import WizardNextSteps from '../../src/components/generate/WizardNextSteps.jsx';
import { useStore } from '../../src/store/index.js';

describe('WizardNextSteps — W-4 post-generate guide', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* no-op */ }
    useStore.__set({
      settlement: { tier: 'Village' },
      canSave: () => false,
      auth: { tier: 'anon' },
    });
  });
  afterEach(() => cleanup());

  it('renders nothing when there is no settlement', () => {
    useStore.__set({ settlement: null });
    const { container } = render(<WizardNextSteps />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the labelled guide with the tier headline and all steps', () => {
    render(<WizardNextSteps />);
    expect(screen.getByRole('group', { name: "What's next" })).toBeTruthy();
    expect(screen.getByText('Your Village is ready.')).toBeTruthy();
    expect(screen.getByText('Export a PDF')).toBeTruthy();
    expect(screen.getByText('Refine the details')).toBeTruthy();
    expect(screen.getByText('Place it on your world map')).toBeTruthy();
    expect(screen.getByText('Generate another')).toBeTruthy();
  });

  it('shows the free-account save framing for anonymous users', () => {
    render(<WizardNextSteps />);
    expect(screen.getByText(/create a free account/i)).toBeTruthy();
  });

  it('shows the library save framing for signed-in users who can save', () => {
    useStore.__set({ canSave: () => true, auth: { tier: 'premium' } });
    render(<WizardNextSteps />);
    expect(screen.getByText(/Save it to your library/i)).toBeTruthy();
  });

  it('"Got it" dismisses the guide and persists the dismissal', () => {
    const first = render(<WizardNextSteps />);
    fireEvent.click(screen.getByRole('button', { name: /dismiss what's next/i }));
    // Gone immediately…
    expect(first.container.firstChild).toBeNull();
    expect(localStorage.getItem('sf:dismissed_whats_next')).toBe('1');
    // …and stays gone on a fresh mount (persisted).
    cleanup();
    const second = render(<WizardNextSteps />);
    expect(second.container.firstChild).toBeNull();
  });
});
