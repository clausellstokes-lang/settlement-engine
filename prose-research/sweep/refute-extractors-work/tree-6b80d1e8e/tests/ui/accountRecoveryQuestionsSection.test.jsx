/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountRecoveryQuestionsSection.test.jsx — Finding #4 regression.
 *
 * The set-answers RPC used to be reachable ONLY from the fragile post-signup
 * polling path, leaving OAuth / window-closed / confirmed-elsewhere accounts
 * unable to enroll, despite copy promising they could "later". This section is
 * the durable, signed-in home for that enrollment. The test pins:
 *   • Status reads from authGetSecurityQuestionIds and lists the current
 *     questions when set ("already set" status reflected).
 *   • A not-set account shows the nudge + "not set" status.
 *   • Saving calls authSetSecurityAnswers with the chosen questions/answers and
 *     re-reads status afterward.
 *
 * Without the new section (RPC only callable from signup), none of this is
 * reachable — the test would have nothing to render.
 */
import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent, waitFor, screen } from '@testing-library/react';

afterEach(cleanup);

// Mutable store bag drives the two actions the section reads.
const authSetSecurityAnswers = vi.fn().mockResolvedValue(undefined);
const authGetSecurityQuestionIds = vi.fn();
const storeState = { authSetSecurityAnswers, authGetSecurityQuestionIds };
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

let AccountRecoveryQuestionsSection;

beforeEach(async () => {
  vi.clearAllMocks();
  ({ default: AccountRecoveryQuestionsSection } = await import('../../src/components/account/AccountRecoveryQuestionsSection.jsx'));
});

describe('AccountRecoveryQuestionsSection — already-set status', () => {
  it('reads the stored question ids and lists the current questions', async () => {
    authGetSecurityQuestionIds.mockResolvedValue([
      { slot: 1, questionId: 'first_pet' },
      { slot: 2, questionId: 'birth_city' },
    ]);
    render(<AccountRecoveryQuestionsSection />);

    expect(authGetSecurityQuestionIds).toHaveBeenCalled();
    await screen.findByText('Your recovery questions are set.');
    // Display text for the stored ids is resolved and listed.
    expect(screen.getByText(/name of your first pet/i)).toBeTruthy();
    expect(screen.getByText(/what city were you born/i)).toBeTruthy();
    // When set, the control offers to replace, not first-time set.
    expect(screen.getByText('Replace recovery questions')).toBeTruthy();
  });
});

describe('AccountRecoveryQuestionsSection — not-set nudge', () => {
  it('shows the not-set status and the gentle nudge', async () => {
    authGetSecurityQuestionIds.mockResolvedValue([]);
    render(<AccountRecoveryQuestionsSection />);

    await screen.findByText('You have not set any recovery questions yet.');
    expect(screen.getByText(/Set up account recovery questions/i)).toBeTruthy();
    expect(screen.getByText('Set recovery questions')).toBeTruthy();
  });
});

describe('AccountRecoveryQuestionsSection — saving', () => {
  it('calls authSetSecurityAnswers with the chosen questions and answers', async () => {
    authGetSecurityQuestionIds.mockResolvedValue([]);
    render(<AccountRecoveryQuestionsSection />);

    fireEvent.click(await screen.findByText('Set recovery questions'));

    // Two question pickers appear (labelled by SecurityQuestionsFields).
    fireEvent.change(screen.getByLabelText('First question'), { target: { value: 'first_pet' } });
    fireEvent.change(screen.getByLabelText('Second question'), { target: { value: 'birth_city' } });
    fireEvent.change(screen.getByLabelText('Answer to the first question'), { target: { value: '  Rex ' } });
    fireEvent.change(screen.getByLabelText('Answer to the second question'), { target: { value: 'Leeds' } });

    // After a successful save the section re-reads status as already-set.
    authGetSecurityQuestionIds.mockResolvedValue([
      { slot: 1, questionId: 'first_pet' },
      { slot: 2, questionId: 'birth_city' },
    ]);

    fireEvent.click(screen.getByText('Save recovery questions'));

    await waitFor(() => expect(authSetSecurityAnswers).toHaveBeenCalledTimes(1));
    expect(authSetSecurityAnswers).toHaveBeenCalledWith({
      q1: 'first_pet', a1: 'Rex', q2: 'birth_city', a2: 'Leeds',
    });
    await screen.findByText('Your recovery questions are saved.');
  });
});
