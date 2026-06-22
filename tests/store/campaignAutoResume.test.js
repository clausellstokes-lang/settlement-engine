/** @vitest-environment jsdom */
/**
 * campaignAutoResume.test.js — the Realm "resume my last campaign + map" logic.
 *
 * Two halves:
 *   - resumeCampaignTarget(): the pure pick — last-used if it still exists, else
 *     the most-recently-updated campaign (the list arrives updated_at-desc), else
 *     null. A stale / cross-user pointer falls through safely.
 *   - setActiveCampaign(): records lastActiveCampaignId (the persisted pointer)
 *     on a real open, and never forgets it on a blank (null) selection.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { resumeCampaignTarget } from '../../src/store/campaignSliceShared.js';
import { useStore } from '../../src/store/index.js';

const C = (id) => ({ id });

describe('resumeCampaignTarget — which campaign the Realm reopens', () => {
  it('returns null when there are no campaigns', () => {
    expect(resumeCampaignTarget([], 'x')).toBeNull();
    expect(resumeCampaignTarget(undefined, 'x')).toBeNull();
  });

  it('resumes the last-used campaign when it still exists', () => {
    expect(resumeCampaignTarget([C('a'), C('b'), C('c')], 'b')).toBe('b');
  });

  it('falls back to the most-recent campaign when there is no last-used pointer', () => {
    expect(resumeCampaignTarget([C('a'), C('b')], null)).toBe('a');
  });

  it('falls back to the most-recent campaign when the last-used id is stale or cross-user', () => {
    expect(resumeCampaignTarget([C('a'), C('b')], 'deleted-or-other-users-id')).toBe('a');
  });
});

describe('setActiveCampaign — persisted last-used pointer', () => {
  beforeEach(() => {
    useStore.setState({ campaigns: [{ id: 'a' }, { id: 'b' }], activeCampaignId: null, lastActiveCampaignId: null });
  });

  it('records the last campaign opened and keeps it through a blank selection', () => {
    const { setActiveCampaign } = useStore.getState();

    setActiveCampaign('a');
    expect(useStore.getState().activeCampaignId).toBe('a');
    expect(useStore.getState().lastActiveCampaignId).toBe('a');

    // Blanking the map clears the active id but must NOT forget what to resume.
    setActiveCampaign(null);
    expect(useStore.getState().activeCampaignId).toBeNull();
    expect(useStore.getState().lastActiveCampaignId).toBe('a');

    // Opening another campaign advances the pointer.
    setActiveCampaign('b');
    expect(useStore.getState().lastActiveCampaignId).toBe('b');
  });

  it('does not record a pointer for an unknown / stale id', () => {
    const { setActiveCampaign } = useStore.getState();
    setActiveCampaign('nope');
    expect(useStore.getState().activeCampaignId).toBeNull();
    expect(useStore.getState().lastActiveCampaignId).toBeNull();
  });
});
