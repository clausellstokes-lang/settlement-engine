import { describe, expect, test } from 'vitest';

import {
  makeCampaignContentBinding,
} from '../../src/domain/content/contentEnvironment.js';
import { fingerprintContent } from '../../src/domain/content/contentFingerprint.js';
import {
  admitCampaignContentBindingCasReceipt,
  applyLocalCampaignContentBindingCas,
  makeCampaignContentBindingCasCommand,
  sameCampaignContentBindingCasCommand,
} from '../../src/lib/campaignContentBindingCas.js';

const CAMPAIGN_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

function binding(magicExists) {
  return makeCampaignContentBinding({}, {
    source: 'test',
    tunables: { magicExists },
  });
}

function command(current, target, history = [current, target]) {
  return makeCampaignContentBindingCasCommand({
    campaignId: CAMPAIGN_ID,
    expectedBindingHash: current.bindingHash,
    targetBinding: target,
    contentBindingHistory: history,
    previewFingerprint: fingerprintContent({
      campaignId: CAMPAIGN_ID,
      current: current.bindingHash,
      target: target.bindingHash,
    }),
  });
}

describe('campaign content binding compare-and-swap command', () => {
  test('constructs one deterministic identity from the admitted command core', () => {
    const current = binding(false);
    const target = binding(true);
    const first = command(current, target);
    const second = command(current, target);

    expect(sameCampaignContentBindingCasCommand(first, second)).toBe(true);
    expect(first).toMatchObject({
      schemaVersion: 1,
      kind: 'campaign.content-binding.cas',
      campaignId: CAMPAIGN_ID,
      expectedBindingHash: current.bindingHash,
      targetBinding: target,
      contentBindingHistory: [current, target],
    });
    expect(first.commandId).toMatch(/^campaign-content-binding:[0-9a-f]{64}$/);
    expect(first.fingerprint).toMatch(/^[0-9a-f]{64}$/);
  });

  test('applies once, replays an already-active target, and preserves other fields', () => {
    const current = binding(false);
    const target = binding(true);
    const reviewed = command(current, target);
    const original = [{
      id: CAMPAIGN_ID,
      name: 'The Unchanged Realm',
      mapState: { marker: 'preserve-me' },
      contentBinding: current,
      contentBindingHistory: [current],
    }];

    const first = applyLocalCampaignContentBindingCas(
      original,
      reviewed,
      '2026-07-25T12:00:00.000Z',
    );
    expect(first.receipt).toMatchObject({
      ok: true,
      status: 'applied',
      replayed: false,
      bindingHash: target.bindingHash,
    });
    expect(first.campaigns[0]).toMatchObject({
      name: 'The Unchanged Realm',
      mapState: { marker: 'preserve-me' },
      contentBinding: target,
      contentBindingHistory: [current, target],
    });

    const replay = applyLocalCampaignContentBindingCas(
      first.campaigns,
      reviewed,
      '2026-07-25T12:01:00.000Z',
    );
    expect(replay.campaigns).toBe(first.campaigns);
    expect(replay.receipt).toMatchObject({
      ok: true,
      status: 'applied',
      replayed: true,
    });
  });

  test('returns the winning remote binding instead of overwriting it', () => {
    const expected = binding(false);
    const requested = binding(true);
    const winning = makeCampaignContentBinding({}, {
      source: 'test',
      tunables: { magicExists: false, priorityEconomy: 72 },
    });
    const reviewed = command(expected, requested);
    const campaigns = [{
      id: CAMPAIGN_ID,
      contentBinding: winning,
      contentBindingHistory: [expected, winning],
    }];

    const result = applyLocalCampaignContentBindingCas(campaigns, reviewed);

    expect(result.campaigns).toBe(campaigns);
    expect(result.receipt).toMatchObject({
      ok: false,
      status: 'stale',
      expectedBindingHash: expected.bindingHash,
      actualBindingHash: winning.bindingHash,
      remoteBinding: winning,
      remoteBindingHistory: [expected, winning],
    });
  });

  test('rejects an ABA match that would truncate intervening history', () => {
    const first = binding(false);
    const second = binding(true);
    const intervening = makeCampaignContentBinding({}, {
      source: 'test',
      tunables: { magicExists: false, priorityEconomy: 72 },
    });
    const staleRollback = command(second, first, [first, second]);
    const campaigns = [{
      id: CAMPAIGN_ID,
      contentBinding: second,
      contentBindingHistory: [first, second, intervening],
    }];

    const result = applyLocalCampaignContentBindingCas(
      campaigns,
      staleRollback,
      '2026-07-25T12:02:00.000Z',
    );

    expect(result.campaigns).toBe(campaigns);
    expect(result.receipt).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'campaign_content_binding_history_conflict',
      expectedBindingHash: second.bindingHash,
      actualBindingHash: second.bindingHash,
      remoteBinding: second,
      remoteBindingHistory: [first, second, intervening],
    });
  });

  test('rejects a tampered or cross-command server receipt', () => {
    const current = binding(false);
    const target = binding(true);
    const reviewed = command(current, target);

    expect(() => admitCampaignContentBindingCasReceipt({
      schemaVersion: 1,
      status: 'applied',
      replayed: false,
      commandId: reviewed.commandId,
      fingerprint: 'f'.repeat(64),
      campaignId: CAMPAIGN_ID,
      previousBindingHash: current.bindingHash,
      bindingHash: target.bindingHash,
    }, reviewed)).toThrow(/mismatched receipt/i);
  });
});
