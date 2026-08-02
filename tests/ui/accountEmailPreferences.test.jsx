/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const preferenceMocks = vi.hoisted(() => ({
  get: vi.fn(),
  set: vi.fn(),
}));
const storeState = vi.hoisted(() => ({
  auth: {
    user: { id: 'user-1' },
    session: { session_id: 'login-1', access_token: 'token-1' },
    loading: false,
  },
}));

vi.mock('../../src/lib/emailPreferences.js', () => ({
  EMAIL_CATEGORIES: [
    { id: 'product_updates', label: 'Product updates', description: 'Feature notes.' },
    { id: 'referral', label: 'Referral rewards', description: 'Reward notices.' },
    { id: 'lifecycle', label: 'Realm activity', description: 'Realm notices.' },
  ],
  getMyEmailPreferences: (...args) => preferenceMocks.get(...args),
  setMyEmailPreference: (...args) => preferenceMocks.set(...args),
}));
vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  return { useStore };
});

import AccountEmailPreferencesSection from '../../src/components/account/AccountEmailPreferencesSection.jsx';

beforeEach(() => {
  storeState.auth = {
    user: { id: 'user-1' },
    session: { session_id: 'login-1', access_token: 'token-1' },
    loading: false,
  };
  preferenceMocks.get.mockReset().mockResolvedValue({
    product_updates: true,
    referral: true,
    lifecycle: true,
  });
  preferenceMocks.set.mockReset().mockResolvedValue(undefined);
});
afterEach(cleanup);

describe('Account email preferences', () => {
  it('surfaces a load failure without fabricating enabled consent', async () => {
    preferenceMocks.get.mockRejectedValueOnce(new Error('offline'));
    render(<AccountEmailPreferencesSection />);

    expect((await screen.findByRole('alert')).textContent).toMatch(/No consent setting was assumed/i);
    expect(screen.queryByRole('checkbox', { name: 'Product updates' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  });

  it('serializes rapid writes for one category in click order', async () => {
    let releaseFirst;
    preferenceMocks.set
      .mockImplementationOnce(() => new Promise(resolve => { releaseFirst = resolve; }))
      .mockResolvedValueOnce(undefined);
    render(<AccountEmailPreferencesSection />);
    const productUpdates = await screen.findByRole('checkbox', { name: 'Product updates' });

    fireEvent.click(productUpdates); // true -> false
    fireEvent.click(productUpdates); // false -> true
    await waitFor(() => expect(preferenceMocks.set).toHaveBeenCalledTimes(1));
    expect(preferenceMocks.set).toHaveBeenNthCalledWith(1, 'product_updates', false, 'user-1');

    releaseFirst();
    await waitFor(() => expect(preferenceMocks.set).toHaveBeenCalledTimes(2));
    expect(preferenceMocks.set).toHaveBeenNthCalledWith(2, 'product_updates', true, 'user-1');
  });

  it('keeps queued writes through token refresh but drops them after a real re-login', async () => {
    let releaseFirst;
    preferenceMocks.set
      .mockImplementationOnce(() => new Promise(resolve => { releaseFirst = resolve; }))
      .mockResolvedValueOnce(undefined);
    const view = render(<AccountEmailPreferencesSection />);
    const productUpdates = await screen.findByRole('checkbox', { name: 'Product updates' });
    fireEvent.click(productUpdates);
    fireEvent.click(productUpdates);
    await waitFor(() => expect(preferenceMocks.set).toHaveBeenCalledTimes(1));

    storeState.auth = {
      ...storeState.auth,
      session: { session_id: 'login-1', access_token: 'token-refreshed' },
    };
    view.rerender(<AccountEmailPreferencesSection />);
    releaseFirst();
    await waitFor(() => expect(preferenceMocks.set).toHaveBeenCalledTimes(2));

    let releaseThird;
    preferenceMocks.set.mockImplementationOnce(() => new Promise(resolve => { releaseThird = resolve; }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Product updates' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Product updates' }));
    await waitFor(() => expect(preferenceMocks.set).toHaveBeenCalledTimes(3));
    preferenceMocks.get.mockResolvedValueOnce({
      product_updates: false, referral: true, lifecycle: true,
    });
    storeState.auth = {
      ...storeState.auth,
      session: { session_id: 'login-2', access_token: 'token-new-login' },
    };
    view.rerender(<AccountEmailPreferencesSection />);
    releaseThird();
    await waitFor(() => expect(screen.getByRole('checkbox', { name: 'Product updates' }).checked).toBe(false));
    expect(preferenceMocks.set).toHaveBeenCalledTimes(3);
  });
});
