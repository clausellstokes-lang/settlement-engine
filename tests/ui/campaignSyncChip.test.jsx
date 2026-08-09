/**
 * @vitest-environment jsdom
 *
 * campaignSyncChip.test.jsx — Track K §C3 pin: the outbox status chip.
 *
 * The pre-C3 CampaignSyncBanner (a boolean fail banner keyed on campaignSyncError)
 * evolves into the durable-outbox reconcile surface. This migrates + extends its
 * contract:
 *   • silent when nothing is queued and nothing failed;
 *   • a POLITE live region while writes are merely syncing (no Retry needed);
 *   • an ASSERTIVE alert with the failed count + a Retry action when writes park;
 *   • Retry / Dismiss wire to the store actions.
 * a11y posture is preserved: it stays a live region throughout.
 */
import { afterEach, describe, test, expect, vi } from 'vitest';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { useStore } from '../../src/store/index.js';
import CampaignSyncBanner from '../../src/components/CampaignSyncBanner.jsx';

afterEach(() => {
  cleanup();
  // Restore a clean, non-alerting store state between tests.
  useStore.setState({
    campaignSyncError: null,
    campaignLoadError: null,
    outboxStatus: { queued: 0, failed: 0, inflight: 0 },
  });
});

describe('CampaignSyncBanner — outbox status chip', () => {
  test('renders nothing when nothing is queued and nothing failed', () => {
    useStore.setState({ campaignSyncError: null, outboxStatus: { queued: 0, failed: 0, inflight: 0 } });
    const { container } = render(<CampaignSyncBanner />);
    expect(container.firstChild).toBeNull();
  });

  test('while syncing (no failures) it is a POLITE live region with no Retry', () => {
    useStore.setState({ campaignSyncError: null, outboxStatus: { queued: 2, failed: 0, inflight: 1 } });
    render(<CampaignSyncBanner />);
    const region = screen.getByRole('status');
    expect(region.getAttribute('aria-live')).toBe('polite');
    // 2 queued + 1 inflight = 3 syncing.
    expect(region.textContent).toMatch(/3 syncing/);
    expect(screen.queryByText('Retry')).toBeNull();
  });

  test('on failure it is an ASSERTIVE alert with the failed count + Retry + Dismiss', () => {
    useStore.setState({
      campaignSyncError: 'Some changes could not be saved to the cloud. ',
      outboxStatus: { queued: 0, failed: 2, inflight: 0 },
    });
    render(<CampaignSyncBanner />);
    const region = screen.getByRole('alert');
    expect(region.getAttribute('aria-live')).toBe('assertive');
    expect(region.textContent).toMatch(/2 failed/);
    expect(region.textContent).toMatch(/could not be saved/);
    expect(screen.getByText('Retry')).toBeTruthy();
    expect(screen.getByLabelText('Dismiss cloud-sync warning')).toBeTruthy();
  });

  test('failed count alone (no message) still raises the alert with Retry', () => {
    useStore.setState({ campaignSyncError: null, outboxStatus: { queued: 1, failed: 1, inflight: 0 } });
    render(<CampaignSyncBanner />);
    const region = screen.getByRole('alert');
    expect(region.textContent).toMatch(/1 syncing/);
    expect(region.textContent).toMatch(/1 failed/);
    expect(screen.getByText('Retry')).toBeTruthy();
  });

  test('Retry and Dismiss invoke the store actions', () => {
    const retryOutbox = vi.fn();
    const clearCampaignSyncError = vi.fn();
    useStore.setState({
      campaignSyncError: 'boom',
      outboxStatus: { queued: 0, failed: 1, inflight: 0 },
      retryOutbox,
      clearCampaignSyncError,
    });
    render(<CampaignSyncBanner />);
    fireEvent.click(screen.getByText('Retry'));
    fireEvent.click(screen.getByLabelText('Dismiss cloud-sync warning'));
    expect(retryOutbox).toHaveBeenCalledTimes(1);
    expect(clearCampaignSyncError).toHaveBeenCalledTimes(1);
  });

  test('strict campaign admission failure is visible and Retry reloads safely', () => {
    const loadCampaigns = vi.fn(async () => []);
    const retryOutbox = vi.fn(async () => []);
    useStore.setState({
      campaignSyncError: null,
      campaignLoadError: {
        code: 'campaign_admission_unavailable',
        message: 'Campaign data could not be safely loaded.',
      },
      outboxStatus: { queued: 0, failed: 0, inflight: 0 },
      loadCampaigns,
      retryOutbox,
    });

    render(<CampaignSyncBanner />);
    expect(screen.getByRole('alert').textContent).toMatch(/safely loaded/i);
    fireEvent.click(screen.getByText('Retry'));
    expect(loadCampaigns).toHaveBeenCalledTimes(1);
    expect(retryOutbox).toHaveBeenCalledTimes(1);
  });
});
