import { describe, expect, test } from 'vitest';

import {
  applyReviewedCampaignContentBindingChange,
  previewCampaignContentBindingChange,
} from '../../src/domain/content/campaignContentLifecycle.js';
import {
  makeCampaignContentBinding,
} from '../../src/domain/content/contentEnvironment.js';

function binding(name, revisionNumber) {
  return makeCampaignContentBinding({
    institutions: [{
      name,
      definitionId: 'definition:guild',
      revisionId: `revision:guild:${revisionNumber}`,
      localUid: 'lu_guild',
    }],
  }, { source: `fixture:${revisionNumber}` });
}

function sample(seed = 'campaign-content-same-seed') {
  return {
    schemaVersion: 1,
    seed,
    sameSeed: true,
    saved: false,
    before: { institutions: ['Old Guild'] },
    after: { institutions: ['New Guild'] },
  };
}

describe('campaign content binding lifecycle', () => {
  test('preview identity binds the exact head, target, and same-seed evidence', () => {
    const current = binding('Old Guild', 1);
    const target = binding('New Guild', 2);
    const first = previewCampaignContentBindingChange({
      campaignId: 'campaign-1',
      currentBinding: current,
      targetBinding: target,
      sameSeedSample: sample(),
    });
    const second = previewCampaignContentBindingChange({
      campaignId: 'campaign-1',
      currentBinding: current,
      targetBinding: target,
      sameSeedSample: sample(),
    });

    expect(first.ok).toBe(true);
    expect(first.previewFingerprint).toBe(second.previewFingerprint);
    expect(first.plan).toMatchObject({
      expectedBindingHash: current.bindingHash,
      targetBindingHash: target.bindingHash,
      sampleSeed: 'campaign-content-same-seed',
    });
    expect(first.definitionChanges).toEqual([
      expect.objectContaining({
        definitionId: 'definition:guild',
        change: 'revision-changed',
      }),
    ]);
  });

  test('apply is exact-head CAS and never accepts a stale reviewed preview', () => {
    const current = binding('Old Guild', 1);
    const target = binding('New Guild', 2);
    const concurrent = binding('Concurrent Guild', 3);
    const preview = previewCampaignContentBindingChange({
      campaignId: 'campaign-1',
      currentBinding: current,
      targetBinding: target,
      sameSeedSample: sample(),
    });

    expect(applyReviewedCampaignContentBindingChange({
      campaignId: 'campaign-1',
      currentBinding: concurrent,
      contentBindingHistory: [current, concurrent],
      preview,
    })).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'campaign_content_binding_stale',
    });
  });

  test('rollback is a forward activation and retains both immutable snapshots', () => {
    const first = binding('Old Guild', 1);
    const second = binding('New Guild', 2);
    const preview = previewCampaignContentBindingChange({
      campaignId: 'campaign-1',
      currentBinding: second,
      contentBindingHistory: [first, second],
      targetBinding: first,
      sameSeedSample: sample('rollback-seed'),
      kind: 'campaign.content-binding.rollback',
    });
    const applied = applyReviewedCampaignContentBindingChange({
      campaignId: 'campaign-1',
      currentBinding: second,
      contentBindingHistory: [first, second],
      preview,
    });

    expect(applied).toMatchObject({
      ok: true,
      status: 'applied',
      bindingHash: first.bindingHash,
      previousBindingHash: second.bindingHash,
    });
    expect(applied.history.map(entry => entry.bindingHash))
      .toEqual([first.bindingHash, second.bindingHash]);
  });

  test('rollback cannot activate a binding outside canonical campaign history', () => {
    const current = binding('New Guild', 2);
    const unknown = binding('Unknown Guild', 9);
    expect(previewCampaignContentBindingChange({
      campaignId: 'campaign-1',
      currentBinding: current,
      contentBindingHistory: [current],
      targetBinding: unknown,
      sameSeedSample: sample(),
      kind: 'campaign.content-binding.rollback',
    })).toMatchObject({
      ok: false,
      reason: 'campaign_content_rollback_target_unavailable',
    });
  });
});
