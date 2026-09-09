/** @vitest-environment jsdom */
/**
 * feedbackWidget.test.jsx — the consolidated feedback surface (order W2-a-REVISED).
 *
 * The floating Feedback button was retired; the panel is now opened from the
 * footer's 'Feedback & support' control, which dispatches an app-wide
 * 'sf:open-feedback' event. These tests pin:
 *   · no floating button — nothing renders until the event opens the panel;
 *   · the owner's phrasing carries verbatim in the panel intro;
 *   · a signed-in submission discloses the account attach AND posts the account's
 *     unique id (auth.user.id → support_messages.user_id) server-honest;
 *   · an anonymous submission still works (email field, no account id/disclosure).
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  state: { auth: { user: null }, generationId: null, lastSeed: null, generatedAt: null },
  insert: vi.fn(() => Promise.resolve({ error: null })),
}));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.state);
  useStore.getState = () => mocks.state;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: { from: () => ({ insert: mocks.insert }) },
}));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import FeedbackWidget from '../../src/components/FeedbackWidget.jsx';

afterEach(() => {
  cleanup();
  mocks.insert.mockClear();
  mocks.state.auth = { user: null };
});

function openPanel() {
  act(() => { window.dispatchEvent(new CustomEvent('sf:open-feedback')); });
}

describe('FeedbackWidget — footer-triggered panel (W2-a-REVISED)', () => {
  test('no floating button — nothing renders until the footer opens it', () => {
    render(<FeedbackWidget />);
    expect(screen.queryByRole('dialog')).toBeNull();
    // The old floating "Feedback" trigger button is gone.
    expect(screen.queryByRole('button', { name: /^feedback$/i })).toBeNull();
  });

  test('the sf:open-feedback event opens the panel with the owner phrasing', async () => {
    render(<FeedbackWidget />);
    openPanel();
    expect(await screen.findByRole('dialog')).toBeTruthy();
    expect(screen.getByText('Feedback & support')).toBeTruthy();
    expect(
      screen.getByText(/Feedback, questions, comments, concerns, or troubleshooting\./),
    ).toBeTruthy();
  });

  test('anonymous: an email field shows and there is no account disclosure', async () => {
    render(<FeedbackWidget />);
    openPanel();
    await screen.findByRole('dialog');
    expect(screen.getByLabelText(/your email address/i)).toBeTruthy();
    expect(screen.queryByText(/Sent from your account/)).toBeNull();
  });

  test('signed-in: discloses the account attach and posts user_id server-honest', async () => {
    mocks.state.auth = { user: { id: 'acct-123', email: 'keeper@example.com' } };
    render(<FeedbackWidget />);
    openPanel();
    await screen.findByRole('dialog');
    // The disclosure microcopy (same voice as the settlement-reference line).
    expect(screen.getByText('Sent from your account, so we can follow up.')).toBeTruthy();
    // No email field — the account email is used implicitly.
    expect(screen.queryByLabelText(/your email address/i)).toBeNull();
    // Submit and confirm the payload carries the account's unique id.
    fireEvent.change(screen.getByLabelText(/your feedback/i), { target: { value: 'Great tool' } });
    fireEvent.click(screen.getByRole('button', { name: /send feedback/i }));
    await waitFor(() => expect(mocks.insert).toHaveBeenCalledTimes(1));
    expect(mocks.insert.mock.calls[0][0]).toMatchObject({
      user_id: 'acct-123',
      email: 'keeper@example.com',
    });
  });
});
