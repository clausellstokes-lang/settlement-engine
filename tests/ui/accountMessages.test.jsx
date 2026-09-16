/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const storeState = {
  auth: { user: { id: 'user-a' }, session: { access_token: 'session-a' }, loading: false },
};
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));

import OperatorMessagesProvider, { useOperatorMessages } from '../../src/components/account/OperatorMessagesProvider.jsx';
import AccountMessagesSection from '../../src/components/account/AccountMessagesSection.jsx';

afterEach(cleanup);
beforeEach(() => {
  storeState.auth = { user: { id: 'user-a' }, session: { access_token: 'session-a' }, loading: false };
});

const directMessage = {
  id: 'direct-1', kind: 'direct', messageClass: 'service', senderRole: 'admin',
  subject: 'A note about your gallery item',
  body: '<img src=x onerror=alert(1)>\nPlease reply with context.',
  createdAt: '2026-08-02T12:00:00.000Z', deliveredAt: null, readAt: null, dismissedAt: null,
};

function CountProbe() {
  const { unreadCount } = useOperatorMessages();
  return <output aria-label="Unread probe">{unreadCount}</output>;
}

function DoubleMarkProbe({ messageId }) {
  const { markRead } = useOperatorMessages();
  return (
    <button type="button" onClick={() => { markRead(messageId); markRead(messageId); }}>
      Mark twice
    </button>
  );
}

describe('Account Messages reader', () => {
  it('does not clear on section visit, marks only on open, escapes body text, and offers direct reply', async () => {
    const service = {
      listMyOperatorMessages: vi.fn().mockResolvedValue([directMessage]),
      getMyOperatorUnreadCount: vi.fn().mockResolvedValue(1),
      markOperatorMessageRead: vi.fn().mockResolvedValue('2026-08-02T12:05:00.000Z'),
    };
    const onReply = vi.fn();
    render(
      <OperatorMessagesProvider service={service}>
        <CountProbe />
        <AccountMessagesSection onReply={onReply} />
      </OperatorMessagesProvider>,
    );

    const row = await screen.findByRole('button', { name: /A note about your gallery item, unread/i });
    expect(service.markOperatorMessageRead).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Unread probe').textContent).toBe('1');

    fireEvent.click(row);
    expect(screen.getByText('<img src=x onerror=alert(1)>', { exact: false })).toBeTruthy();
    expect(document.querySelector('img')).toBeNull();
    await waitFor(() => expect(service.markOperatorMessageRead).toHaveBeenCalledWith('direct-1'));
    await waitFor(() => expect(screen.getByLabelText('Unread probe').textContent).toBe('0'));

    fireEvent.click(screen.getByRole('button', { name: /Reply via Feedback & support/i }));
    expect(onReply).toHaveBeenCalledWith(expect.objectContaining({ id: 'direct-1', kind: 'direct' }));
  });

  it('keeps a late account-A response out of account B', async () => {
    let resolveA;
    const pendingA = new Promise(resolvePending => { resolveA = resolvePending; });
    const service = {
      listMyOperatorMessages: vi.fn()
        .mockImplementationOnce(() => pendingA)
        .mockResolvedValueOnce([{ ...directMessage, id: 'direct-b', subject: 'For B', readAt: '2026-08-02T12:05:00.000Z' }]),
      getMyOperatorUnreadCount: vi.fn()
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0),
      markOperatorMessageRead: vi.fn(),
    };
    const view = render(
      <OperatorMessagesProvider service={service}>
        <AccountMessagesSection />
      </OperatorMessagesProvider>,
    );

    storeState.auth = { user: { id: 'user-b' }, session: { access_token: 'session-b' }, loading: false };
    view.rerender(
      <OperatorMessagesProvider service={service}>
        <AccountMessagesSection />
      </OperatorMessagesProvider>,
    );
    expect(await screen.findByText('For B')).toBeTruthy();
    resolveA([directMessage]);
    await Promise.resolve();
    expect(screen.queryByText('A note about your gallery item')).toBeNull();
  });

  it('uses the receipt count rather than under-counting the loaded page', async () => {
    const service = {
      listMyOperatorMessages: vi.fn().mockResolvedValue([directMessage]),
      getMyOperatorUnreadCount: vi.fn().mockResolvedValue(137),
      markOperatorMessageRead: vi.fn().mockResolvedValue('2026-08-02T12:05:00.000Z'),
    };
    render(
      <OperatorMessagesProvider service={service}>
        <CountProbe />
        <AccountMessagesSection />
      </OperatorMessagesProvider>,
    );

    await waitFor(() => expect(screen.getByLabelText('Unread probe').textContent).toBe('137'));
    fireEvent.click(screen.getByRole('button', { name: /A note about your gallery item, unread/i }));
    await waitFor(() => expect(screen.getByLabelText('Unread probe').textContent).toBe('136'));
  });

  it('loads beyond the first 100 rows with the complete tuple cursor', async () => {
    const page = Array.from({ length: 100 }, (_, index) => ({
      ...directMessage,
      id: `message-${String(index).padStart(3, '0')}`,
      subject: `Message ${index}`,
      createdAt: new Date(Date.parse('2026-08-02T12:00:00.000Z') - index * 1000).toISOString(),
      readAt: '2026-08-02T13:00:00.000Z',
    }));
    const older = {
      ...directMessage,
      id: 'message-100',
      subject: 'The oldest loaded message',
      createdAt: '2026-08-02T11:58:20.000Z',
      readAt: '2026-08-02T13:00:00.000Z',
    };
    const service = {
      listMyOperatorMessages: vi.fn().mockResolvedValueOnce(page).mockResolvedValueOnce([older]),
      getMyOperatorUnreadCount: vi.fn().mockResolvedValue(0),
      markOperatorMessageRead: vi.fn(),
    };
    render(
      <OperatorMessagesProvider service={service}>
        <AccountMessagesSection />
      </OperatorMessagesProvider>,
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Load more messages' }));
    expect(await screen.findByText('The oldest loaded message')).toBeTruthy();
    expect(service.listMyOperatorMessages).toHaveBeenNthCalledWith(2, {
      limit: 100,
      beforeCreatedAt: page[99].createdAt,
      beforeId: page[99].id,
    });
  });

  it('does not start an old-cursor page while a shifted first-page refresh is active', async () => {
    const makePage = (newest) => Array.from({ length: 100 }, (_, index) => ({
      ...directMessage,
      id: `message-${newest - index}`,
      subject: `Message ${newest - index}`,
      createdAt: new Date(Date.parse('2026-08-02T12:00:00.000Z') - index * 1000).toISOString(),
      readAt: '2026-08-02T13:00:00.000Z',
    }));
    const firstPage = makePage(200);
    const shiftedPage = makePage(201);
    let releaseRefresh;
    const service = {
      listMyOperatorMessages: vi.fn()
        .mockResolvedValueOnce(firstPage)
        .mockImplementationOnce(() => new Promise(resolve => { releaseRefresh = resolve; }))
        .mockResolvedValueOnce([{ ...directMessage, id: 'message-101', subject: 'Cursor-safe 101', createdAt: shiftedPage[99].createdAt }]),
      getMyOperatorUnreadCount: vi.fn().mockResolvedValue(0),
      markOperatorMessageRead: vi.fn(),
    };
    render(
      <OperatorMessagesProvider service={service}>
        <AccountMessagesSection />
      </OperatorMessagesProvider>,
    );
    const loadMore = await screen.findByRole('button', { name: 'Load more messages' });
    window.dispatchEvent(new Event('focus'));
    await waitFor(() => expect(service.listMyOperatorMessages).toHaveBeenCalledTimes(2));
    expect(loadMore.disabled).toBe(true);
    fireEvent.click(loadMore);
    expect(service.listMyOperatorMessages).toHaveBeenCalledTimes(2);

    releaseRefresh(shiftedPage);
    await waitFor(() => expect(screen.getByText('Message 201')).toBeTruthy());
    fireEvent.click(screen.getByRole('button', { name: 'Load more messages' }));
    await waitFor(() => expect(service.listMyOperatorMessages).toHaveBeenCalledTimes(3));
    expect(service.listMyOperatorMessages).toHaveBeenNthCalledWith(3, {
      limit: 100,
      beforeCreatedAt: shiftedPage[99].createdAt,
      beforeId: shiftedPage[99].id,
    });
  });

  it('does not let a delayed refresh resurrect an unread row or count', async () => {
    let releaseMessages;
    let releaseCount;
    const service = {
      listMyOperatorMessages: vi.fn()
        .mockResolvedValueOnce([directMessage])
        .mockImplementationOnce(() => new Promise(resolvePending => { releaseMessages = resolvePending; })),
      getMyOperatorUnreadCount: vi.fn()
        .mockResolvedValueOnce(1)
        .mockImplementationOnce(() => new Promise(resolvePending => { releaseCount = resolvePending; })),
      markOperatorMessageRead: vi.fn().mockResolvedValue('2026-08-02T12:05:00.000Z'),
    };
    render(
      <OperatorMessagesProvider service={service}>
        <CountProbe />
        <AccountMessagesSection />
      </OperatorMessagesProvider>,
    );
    const row = await screen.findByRole('button', { name: /A note about your gallery item, unread/i });
    window.dispatchEvent(new Event('focus'));
    await waitFor(() => expect(service.listMyOperatorMessages).toHaveBeenCalledTimes(2));
    fireEvent.click(row);
    await waitFor(() => expect(screen.getByLabelText('Unread probe').textContent).toBe('0'));

    releaseMessages([directMessage]);
    releaseCount(1);
    await Promise.resolve();
    await Promise.resolve();
    expect(screen.getByLabelText('Unread probe').textContent).toBe('0');
  });

  it('deduplicates concurrent read calls and decrements exactly once', async () => {
    let releaseMark;
    const service = {
      listMyOperatorMessages: vi.fn().mockResolvedValue([directMessage]),
      getMyOperatorUnreadCount: vi.fn().mockResolvedValue(1),
      markOperatorMessageRead: vi.fn().mockImplementation(() => new Promise(resolve => { releaseMark = resolve; })),
    };
    render(
      <OperatorMessagesProvider service={service}>
        <CountProbe />
        <DoubleMarkProbe messageId="direct-1" />
      </OperatorMessagesProvider>,
    );
    await waitFor(() => expect(screen.getByLabelText('Unread probe').textContent).toBe('1'));
    fireEvent.click(screen.getByRole('button', { name: 'Mark twice' }));
    expect(service.markOperatorMessageRead).toHaveBeenCalledTimes(1);
    releaseMark('2026-08-02T12:05:00.000Z');
    await waitFor(() => expect(screen.getByLabelText('Unread probe').textContent).toBe('0'));
    expect(service.markOperatorMessageRead).toHaveBeenCalledTimes(1);
  });

  it('keeps the reality/fiction firewall and raw-HTML seam structural', () => {
    const source = readFileSync(resolve(process.cwd(), 'src/components/account/AccountMessagesSection.jsx'), 'utf8');
    expect(source).toMatch(/export default function AccountMessagesSection/);
    // anchored: the live export assertion above proves this source read is the shipped reader component.
    expect(source).not.toMatch(/WizardNews|Herald|dangerouslySetInnerHTML/);
  });
});
