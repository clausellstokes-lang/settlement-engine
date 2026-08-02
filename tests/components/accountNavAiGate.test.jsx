/** @vitest-environment jsdom */
/**
 * accountNavAiGate.test.jsx — the "AI & keys" row is Surveyor-gated.
 *
 * Owner ruling 2026-07-19: the BYOK surface renders only for the Surveyor-
 * entitled; the nav row is hidden entirely otherwise (no lock-tease). AccountPage
 * passes showAiKeys=isSurveyorTier(auth); these pins lock the row's visibility.
 */
import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import AccountNav from '../../src/components/account/AccountNav.jsx';

afterEach(cleanup);

describe('AccountNav — AI & keys row gate', () => {
  it('shows the AI & keys row when entitled', () => {
    render(<AccountNav section="profile" setSection={() => {}} showAiKeys />);
    expect(screen.getByText('AI & keys')).toBeTruthy();
  });

  it('hides the AI & keys row when not entitled', () => {
    render(<AccountNav section="profile" setSection={() => {}} showAiKeys={false} />);
    expect(screen.queryByText('AI & keys')).toBeNull();
    // the other rows are unaffected
    expect(screen.getByText('Profile')).toBeTruthy();
    expect(screen.getByText('Subscription')).toBeTruthy();
  });

  it('keeps Messages present and gives its shared count an accessible label', () => {
    render(<AccountNav section="profile" setSection={() => {}} showAiKeys={false} unreadCount={3} />);
    const messages = screen.getByRole('button', { name: 'Messages, 3 unread messages' });
    expect(messages.querySelector('[data-operator-unread-badge="true"]')).toBeTruthy();
  });
});
