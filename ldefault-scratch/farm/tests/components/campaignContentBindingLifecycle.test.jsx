/**
 * @vitest-environment jsdom
 */

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import {
  makeCampaignContentBinding,
} from '../../src/domain/content/contentEnvironment.js';

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeRef.current);
  }
  return { useStore };
});

import CampaignContentBindingLifecycle from '../../src/components/contentStudio/CampaignContentBindingLifecycle.jsx';

function binding(name, revision) {
  return makeCampaignContentBinding({
    institutions: [{
      name,
      definitionId: 'definition:guild',
      revisionId: `revision:guild:${revision}`,
      localUid: 'lu_guild',
    }],
  });
}

const CURRENT = binding('Old Guild', 1);
const TARGET = binding('New Guild', 2);

function review(kind = 'campaign.content-binding.migrate') {
  return {
    ok: true,
    schemaVersion: 1,
    plan: {
      campaignId: 'campaign-1',
      kind,
      targetBinding: TARGET,
    },
    definitionChanges: [{
      definitionId: 'definition:guild',
      category: 'institutions',
      change: 'revision-changed',
    }],
    environmentChanges: [],
    sameSeedSample: {
      seed: 'same-seed',
      sameSeed: true,
      saved: false,
      before: { institutions: [{ name: 'Old Guild' }] },
      after: { institutions: [{ name: 'New Guild' }] },
    },
    previewFingerprint: 'preview-fingerprint',
  };
}

beforeEach(() => {
  storeRef.current = {
    activeCampaignId: 'campaign-1',
    campaigns: [{
      id: 'campaign-1',
      contentBinding: CURRENT,
      contentBindingHistory: [],
    }],
    previewCampaignContentBindingMigration: vi.fn(async () => review()),
    previewCampaignContentBindingRollback: vi.fn(async () => (
      review('campaign.content-binding.rollback')
    )),
    applyCampaignContentBindingMigration: vi.fn(async () => ({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    })),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('CampaignContentBindingLifecycle', () => {
  test('requires a same-seed review before applying the account environment', async () => {
    render(<CampaignContentBindingLifecycle />);
    fireEvent.click(screen.getByRole('button', {
      name: /manage campaign content/i,
    }));
    fireEvent.click(screen.getByRole('button', {
      name: /review active account environment/i,
    }));

    expect(await screen.findByRole('group', {
      name: /campaign content binding confirmation/i,
    })).toBeTruthy();
    expect(screen.getByText(/same-seed unsaved sample/i).textContent)
      .toMatch(/same-seed/i);
    expect(storeRef.current.applyCampaignContentBindingMigration)
      .not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', {
      name: /apply reviewed campaign binding/i,
    }));
    await waitFor(() => {
      expect(storeRef.current.applyCampaignContentBindingMigration)
        .toHaveBeenCalledWith('campaign-1', expect.objectContaining({
          previewFingerprint: 'preview-fingerprint',
        }));
    });
    expect(await screen.findByText(/now pinned to this campaign/i))
      .toBeTruthy();
  });

  test('never claims activation when persistence is unconfirmed', async () => {
    storeRef.current.applyCampaignContentBindingMigration = vi.fn(async () => ({
      ok: true,
      status: 'applied',
      persistence: { state: 'failed' },
    }));
    render(<CampaignContentBindingLifecycle />);
    fireEvent.click(screen.getByRole('button', {
      name: /manage campaign content/i,
    }));
    fireEvent.click(screen.getByRole('button', {
      name: /review active account environment/i,
    }));
    await screen.findByRole('group', {
      name: /campaign content binding confirmation/i,
    });
    fireEvent.click(screen.getByRole('button', {
      name: /apply reviewed campaign binding/i,
    }));

    expect(await screen.findByRole('alert')).toBeTruthy();
    expect(screen.queryByText(/now pinned to this campaign/i)).toBeNull();
  });

  test('explains a cross-tab conflict and retains the review', async () => {
    storeRef.current.applyCampaignContentBindingMigration = vi.fn(async () => ({
      ok: false,
      status: 'stale',
      reason: 'campaign_content_binding_conflict',
      persistence: { state: 'conflict' },
    }));
    render(<CampaignContentBindingLifecycle />);
    fireEvent.click(screen.getByRole('button', {
      name: /manage campaign content/i,
    }));
    fireEvent.click(screen.getByRole('button', {
      name: /review active account environment/i,
    }));
    await screen.findByRole('group', {
      name: /campaign content binding confirmation/i,
    });
    fireEvent.click(screen.getByRole('button', {
      name: /apply reviewed campaign binding/i,
    }));

    expect((await screen.findByRole('alert')).textContent)
      .toMatch(/another tab or device changed this campaign binding first/i);
    expect(screen.getByRole('group', {
      name: /campaign content binding confirmation/i,
    })).toBeTruthy();
  });

  test('explains an ambiguous response as an idempotent retry', async () => {
    storeRef.current.applyCampaignContentBindingMigration = vi.fn(async () => ({
      ok: false,
      status: 'failed',
      reason: 'campaign_content_persistence_unknown',
      retryable: true,
      persistence: { state: 'unknown' },
    }));
    render(<CampaignContentBindingLifecycle />);
    fireEvent.click(screen.getByRole('button', {
      name: /manage campaign content/i,
    }));
    fireEvent.click(screen.getByRole('button', {
      name: /review active account environment/i,
    }));
    await screen.findByRole('group', {
      name: /campaign content binding confirmation/i,
    });
    fireEvent.click(screen.getByRole('button', {
      name: /apply reviewed campaign binding/i,
    }));

    expect((await screen.findByRole('alert')).textContent)
      .toMatch(/retry this exact review/i);
    expect(screen.getByRole('group', {
      name: /campaign content binding confirmation/i,
    })).toBeTruthy();
  });
});
