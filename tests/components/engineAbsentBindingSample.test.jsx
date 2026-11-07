/**
 * @vitest-environment jsdom
 */
/**
 * engineAbsentBindingSample.test.jsx — the campaign content-binding review in a build that
 * carries no engine (ENGINE-5 unit 2, path a).
 *
 * The review forges a same-seed sample through the local engine seam's pipeline door, which a
 * VITE_ENGINE_REMOTE build resolves to the refusing twin. The session answers that refusal as a
 * typed `{ ok: false, reason: 'engine_local_absent' }` (never a rejection nothing catches), and
 * the lifecycle panel shows a non-staff viewer the launch teaser on the review control and a
 * staff account the path's one plain sentence.
 */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { storeRef, pipelineDoor } = vi.hoisted(() => ({
  storeRef: { current: {} },
  pipelineDoor: { reject: null },
}));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeRef.current); }
  useStore.getState = () => storeRef.current;
  return { useStore };
});
vi.mock('../../src/lib/localPipeline.js', async (importOriginal) => {
  const real = await importOriginal();
  return {
    ...real,
    loadLocalPipeline: () => (pipelineDoor.reject ? Promise.reject(pipelineDoor.reject) : real.loadLocalPipeline()),
  };
});

import { makeCampaignContentBinding } from '../../src/domain/content/contentEnvironment.js';
import { captureCampaignSession } from '../../src/store/campaignSliceShared.js';
import { previewCampaignContentBindingMigrationSession } from '../../src/store/campaignContentBindingSession.js';
import CampaignContentBindingLifecycle from '../../src/components/contentStudio/CampaignContentBindingLifecycle.jsx';
import { AVAILABLE_AT_LAUNCH } from '../../src/components/primitives/AvailableAtLaunchPill.jsx';
import { CONTENT_BINDING_SAMPLE_ABSENT } from '../../src/lib/engineAbsentPaths.js';

const binding = (name, revision) => makeCampaignContentBinding({
  institutions: [{ name, definitionId: 'definition:guild', revisionId: `revision:guild:${revision}`, localUid: 'lu_guild' }],
});
const CURRENT = binding('Old Guild', 1);
const TARGET = binding('New Guild', 2);
const absent = () => Object.assign(new Error('no engine'), { code: 'engine_local_absent' });

function panelState({ staff, preview }) {
  return {
    activeCampaignId: 'campaign-1',
    campaigns: [{ id: 'campaign-1', contentBinding: CURRENT, contentBindingHistory: [] }],
    isElevated: () => staff,
    previewCampaignContentBindingMigration: vi.fn(preview),
    previewCampaignContentBindingRollback: vi.fn(async () => ({ ok: false, reason: 'x' })),
    applyCampaignContentBindingMigration: vi.fn(),
  };
}

beforeEach(() => { pipelineDoor.reject = null; });
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

describe('the review session answers the absent engine as a typed result', () => {
  it('a door that refuses engine_local_absent resolves { ok: false, reason: engine_local_absent }', async () => {
    pipelineDoor.reject = absent();
    const state = { campaigns: [{ id: 'campaign-1', contentBinding: CURRENT, contentBindingHistory: [] }], savedSettlements: [] };
    const result = await previewCampaignContentBindingMigrationSession({
      get: () => state, campaignId: 'campaign-1', options: { targetBinding: TARGET }, session: captureCampaignSession(state),
    });
    expect(result).toEqual({ ok: false, reason: 'engine_local_absent' });
  });

  it('any other door failure still rejects (only the typed refusal is answered)', async () => {
    pipelineDoor.reject = new Error('chunk failed');
    const state = { campaigns: [{ id: 'campaign-1', contentBinding: CURRENT, contentBindingHistory: [] }], savedSettlements: [] };
    await expect(previewCampaignContentBindingMigrationSession({
      get: () => state, campaignId: 'campaign-1', options: { targetBinding: TARGET }, session: captureCampaignSession(state),
    })).rejects.toThrow('chunk failed');
  });
});

describe('the lifecycle panel in a build without an engine', () => {
  it('non-staff: the review control is the launch teaser and its click opens the dialog with the path sentence', async () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    storeRef.current = panelState({ staff: false, preview: async () => ({ ok: false, reason: 'engine_local_absent' }) });
    render(<CampaignContentBindingLifecycle />);
    fireEvent.click(screen.getByRole('button', { name: 'Manage campaign content' }));
    const review = screen.getByRole('button', { name: /Review active account environment/ });
    expect(review.getAttribute('data-launch-gated')).toBe('');
    fireEvent.click(review);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.textContent).toContain(AVAILABLE_AT_LAUNCH);
    expect(dialog.textContent).toContain(CONTENT_BINDING_SAMPLE_ABSENT);
    expect(storeRef.current.previewCampaignContentBindingMigration).not.toHaveBeenCalled();
  });

  it('staff: the review runs and the absent engine is said in one plain sentence', async () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    storeRef.current = panelState({ staff: true, preview: async () => ({ ok: false, reason: 'engine_local_absent' }) });
    render(<CampaignContentBindingLifecycle />);
    fireEvent.click(screen.getByRole('button', { name: 'Manage campaign content' }));
    const review = screen.getByRole('button', { name: 'Review active account environment' });
    expect(review.hasAttribute('data-launch-gated')).toBe(false);
    fireEvent.click(review);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe(CONTENT_BINDING_SAMPLE_ABSENT));
    expect(storeRef.current.previewCampaignContentBindingMigration).toHaveBeenCalledTimes(1);
  });

  it('flag off: no teaser, the review runs for everyone', async () => {
    storeRef.current = panelState({ staff: false, preview: async () => ({ ok: false, reason: 'x' }) });
    render(<CampaignContentBindingLifecycle />);
    fireEvent.click(screen.getByRole('button', { name: 'Manage campaign content' }));
    const review = screen.getByRole('button', { name: 'Review active account environment' });
    expect(review.hasAttribute('data-launch-gated')).toBe(false);
    fireEvent.click(review);
    await waitFor(() => expect(storeRef.current.previewCampaignContentBindingMigration).toHaveBeenCalledTimes(1));
  });
});
