/** @vitest-environment jsdom */
import { Suspense } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import FeatureErrorBoundary from '../../src/components/FeatureErrorBoundary.jsx';
import {
  createRetryableCampaignLazy,
  createRetryableLazy,
} from '../../src/store/campaignRuntimeView.js';

vi.mock('../../src/lib/errorReporter.js', () => ({
  reportError: vi.fn(),
}));

let errorSpy;

beforeEach(() => {
  errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  errorSpy.mockRestore();
  cleanup();
});

describe('retryable campaign runtime view', () => {
  test('a generic lazy view retries its importer after an explicit recovery', async () => {
    const importer = vi.fn()
      .mockRejectedValueOnce(new Error('transient stage transport failure'))
      .mockResolvedValueOnce({ default: () => <div>Stage ready</div> });
    const StageView = createRetryableLazy(importer);

    render(
      <FeatureErrorBoundary label="test.stage-view">
        <StageView />
      </FeatureErrorBoundary>,
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Stage ready')).toBeTruthy();
    expect(importer).toHaveBeenCalledTimes(2);
  });

  test('an error-boundary retry creates a fresh lazy load after rejection', async () => {
    const importer = vi.fn(async () => ({
      default: ({ label }) => <div>{label}</div>,
    }));
    const loadView = vi.fn()
      .mockRejectedValueOnce(new Error('transient runtime transport failure'))
      .mockImplementation((_store, nextImporter) => nextImporter());
    const CampaignView = createRetryableCampaignLazy(
      { name: 'test-store' },
      importer,
      { loadView },
    );

    render(
      <FeatureErrorBoundary label="test.campaign-view">
        <Suspense fallback={<div>Loading campaign…</div>}>
          <CampaignView label="Campaign ready" />
        </Suspense>
      </FeatureErrorBoundary>,
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Campaign ready')).toBeTruthy();
    expect(loadView).toHaveBeenCalledTimes(2);
    expect(importer).toHaveBeenCalledTimes(1);
  });
});
