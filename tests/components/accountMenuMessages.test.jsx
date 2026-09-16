/** @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

const refreshMessages = vi.hoisted(() => vi.fn(async () => []));

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/components/account/OperatorMessagesProvider.jsx', () => ({
  useOperatorMessages: () => ({ unreadCount: 0, refresh: refreshMessages }),
}));

import AccountMenu from '../../src/components/AccountMenu.jsx';

afterEach(() => {
  cleanup();
  refreshMessages.mockClear();
});

describe('AccountMenu operator-message badge', () => {
  it('caps at 9+, carries the actual count in names, and swaps into the open menu', () => {
    const onMessages = vi.fn();
    render(<AccountMenu isAnon={false} displayName="Alice" unreadCount={12} onMessages={onMessages} />);

    const trigger = screen.getByRole('button', { name: 'Account, 12 unread messages' });
    expect(trigger.parentElement.querySelectorAll('[data-operator-unread-badge="true"]')).toHaveLength(1);
    expect(screen.getByText('9+').getAttribute('aria-hidden')).toBe('true');

    fireEvent.click(trigger);
    expect(refreshMessages).toHaveBeenCalledTimes(1);
    expect(trigger.querySelector('[data-operator-unread-badge="true"]')).toBeNull();
    const messages = screen.getByRole('menuitem', { name: 'Messages, 12 unread messages' });
    expect(messages.querySelector('[data-operator-unread-badge="true"]')).toBeTruthy();
    expect(screen.getAllByText('9+')).toHaveLength(1);

    fireEvent.click(messages);
    expect(onMessages).toHaveBeenCalledTimes(1);
  });

  it('renders no empty badge at either render point', () => {
    render(<AccountMenu isAnon={false} displayName="Alice" unreadCount={0} />);
    const trigger = screen.getByRole('button', { name: 'Account' });
    expect(document.querySelector('[data-operator-unread-badge="true"]')).toBeNull();
    fireEvent.click(trigger);
    expect(document.querySelector('[data-operator-unread-badge="true"]')).toBeNull();
    expect(screen.getByRole('menuitem', { name: 'Messages' })).toBeTruthy();
  });
});
