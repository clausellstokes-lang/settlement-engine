import { describe, expect, it, vi } from 'vitest';
import {
  makeCampaignContentBinding,
} from '../../src/domain/content/contentEnvironment.js';
import {
  customContentForActiveContext,
} from '../../src/store/activeCustomContentContext.js';
import {
  setPrimaryDeityImpl,
} from '../../src/store/settlementDeityHelpers.js';

function deity(localUid, name, alignmentAxis) {
  return {
    localUid,
    name,
    alignmentAxis,
    lawAxis: alignmentAxis === 'evil' ? 'chaotic' : 'lawful',
    temperamentAxis: alignmentAxis === 'evil' ? 'warlike' : 'peacelike',
    rankAxis: 'major',
  };
}

describe('active custom-content execution context', () => {
  it('projects campaign definitions instead of later account-library heads', () => {
    const pinned = deity('lu_pinned', 'Pinned Saint', 'good');
    const moving = deity('lu_moving', 'Moving Library God', 'evil');
    const binding = makeCampaignContentBinding({ deities: [pinned] });
    const state = {
      activeCampaignId: 'campaign-1',
      campaigns: [{ id: 'campaign-1', contentBinding: binding }],
      customContent: { deities: [moving] },
    };

    const first = customContentForActiveContext(state);
    const second = customContentForActiveContext(state);

    expect(first).toBe(second);
    expect(first.deities).toEqual([
      expect.objectContaining({
        localUid: pinned.localUid,
        name: pinned.name,
      }),
    ]);
    expect(first.deities).not.toEqual([
      expect.objectContaining({ localUid: moving.localUid }),
    ]);
  });

  it('resolves deity canon edits only from the active campaign binding', () => {
    const pinned = deity('lu_pinned', 'Pinned Saint', 'good');
    const moving = deity('lu_moving', 'Moving Library God', 'evil');
    const binding = makeCampaignContentBinding({ deities: [pinned] });
    const applyEvent = vi.fn(event => event);
    const state = {
      activeCampaignId: 'campaign-1',
      campaigns: [{ id: 'campaign-1', contentBinding: binding }],
      customContent: { deities: [moving] },
      settlement: { config: {} },
      applyEvent,
    };
    const get = () => state;

    const applied = setPrimaryDeityImpl(get, `custom:${pinned.localUid}`);
    const refused = setPrimaryDeityImpl(get, `custom:${moving.localUid}`);

    expect(applied).toMatchObject({
      type: 'SET_PRIMARY_DEITY',
      payload: {
        snapshot: {
          name: pinned.name,
          alignmentAxis: pinned.alignmentAxis,
        },
      },
    });
    expect(refused).toBeNull();
    expect(applyEvent).toHaveBeenCalledTimes(1);
  });

  it('fails a malformed campaign binding closed instead of using account content', () => {
    const content = customContentForActiveContext({
      activeCampaignId: 'campaign-1',
      campaigns: [{ id: 'campaign-1', contentBinding: { schemaVersion: -1 } }],
      customContent: {
        deities: [deity('lu_moving', 'Moving Library God', 'evil')],
      },
    });

    expect(content.deities).toEqual([]);
  });
});
