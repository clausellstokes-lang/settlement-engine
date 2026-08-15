/** @vitest-environment jsdom */

import { beforeEach, describe, expect, test } from 'vitest';

import {
  clearHeraldCommandSession,
  readHeraldCommandSession,
  writeHeraldCommandSession,
} from '../../src/components/map/heraldCommandSession.js';

describe('Herald command session return context', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  test('round-trips bounded presentation state inside one campaign namespace', () => {
    writeHeraldCommandSession('campaign-1', {
      open: true,
      section: 'trade',
      timeLens: 'campaign',
      query: 'eastern levy',
      attentionOn: true,
      filterBand: 'critical',
      showFilters: true,
      scrollTop: 84,
      focusKey: 'save-1:npc-1',
      commandReturn: {
        section: 'dashboard',
        label: 'Briefing',
        itemId: 'decision-1',
        scrollTop: 42,
      },
      sceneContext: {
        action: 'inspect-scene-provenance',
        settlementId: 'save-1',
        sceneId: 'building:market',
        entityKind: 'building',
        label: 'The Covered Market',
        canonicalRef: {
          kind: 'institution',
          id: 'market',
          catalogId: 'market',
          inventedRoute: 'realm-item:fake',
        },
        provenanceRefs: ['provenance:terrain', 'provenance:habit'],
        provenance: [{
          id: 'provenance:habit',
          effect: 'square-at-convergence',
          family: 'habit',
          sourceRef: 'market desire path',
          displayText: 'square-at-convergence: market desire path',
        }, {
          id: 'provenance:unrelated',
          effect: 'must be dropped',
        }, {
          id: 'provenance:terrain',
          effect: 'regional-grain',
          family: 'region',
          sourceRef: 'river terrace',
        }],
      },
      ignoredEngineState: { tick: 99 },
    });

    expect(readHeraldCommandSession('campaign-1')).toEqual({
      version: 1,
      campaignId: 'campaign-1',
      open: true,
      section: 'trade',
      timeLens: 'campaign',
      query: 'eastern levy',
      attentionOn: true,
      filterBand: 'critical',
      showFilters: true,
      scrollTop: 84,
      focusKey: 'save-1:npc-1',
      commandReturn: {
        section: 'dashboard',
        label: 'Briefing',
        itemId: 'decision-1',
        scrollTop: 42,
      },
      sceneContext: {
        action: 'inspect-scene-provenance',
        settlementId: 'save-1',
        sceneId: 'building:market',
        entityKind: 'building',
        label: 'The Covered Market',
        canonicalRef: {
          kind: 'institution',
          id: 'market',
          catalogId: 'market',
        },
        provenanceRefs: ['provenance:terrain', 'provenance:habit'],
        provenance: [{
          id: 'provenance:terrain',
          effect: 'regional-grain',
          family: 'region',
          sourceRef: 'river terrace',
          displayText: null,
        }, {
          id: 'provenance:habit',
          effect: 'square-at-convergence',
          family: 'habit',
          sourceRef: 'market desire path',
          displayText: 'square-at-convergence: market desire path',
        }],
      },
    });
    expect(readHeraldCommandSession('campaign-2')).toBeNull();
  });

  test('rejects malformed state, normalizes unsafe values, and clears exactly one campaign', () => {
    window.sessionStorage.setItem(
      'sf.herald-command-session.v1:campaign-1',
      JSON.stringify({ version: 99, campaignId: 'campaign-1' }),
    );
    expect(readHeraldCommandSession('campaign-1')).toBeNull();

    writeHeraldCommandSession('campaign-1', {
      section: '',
      timeLens: 'prophecy',
      scrollTop: -20,
      commandReturn: { itemId: 'missing-section' },
    });
    writeHeraldCommandSession('campaign-2', { section: 'events' });

    expect(readHeraldCommandSession('campaign-1')).toMatchObject({
      section: 'dashboard',
      timeLens: 'advance',
      scrollTop: 0,
      commandReturn: null,
      sceneContext: null,
    });

    clearHeraldCommandSession('campaign-1');
    expect(readHeraldCommandSession('campaign-1')).toBeNull();
    expect(readHeraldCommandSession('campaign-2')?.section).toBe('events');
  });

  test('normalizes legacy numeric campaign identities into the same string namespace', () => {
    writeHeraldCommandSession(17, { open: true, section: 'trade' });

    expect(readHeraldCommandSession(17)).toMatchObject({
      campaignId: '17',
      open: true,
      section: 'trade',
    });
    expect(readHeraldCommandSession('17')?.campaignId).toBe('17');
  });

  test('bounds portrait causes and never promotes partial references into identities', () => {
    const provenanceRefs = Array.from(
      { length: 40 },
      (_, index) => `provenance:${index}`,
    );
    writeHeraldCommandSession('campaign-1', {
      section: 'events',
      sceneContext: {
        action: 'inspect-scene-provenance',
        sceneId: 'building:market',
        label: 'x'.repeat(400),
        canonicalRef: { kind: 'institution' },
        provenanceRefs,
        provenance: provenanceRefs.map((id) => ({
          id,
          effect: `effect-${id}`,
          hiddenEngineObject: { seed: 99 },
        })),
      },
    });

    const context = readHeraldCommandSession('campaign-1')?.sceneContext;
    expect(context?.provenanceRefs).toHaveLength(24);
    expect(context?.provenance).toHaveLength(24);
    expect(context?.label).toHaveLength(120);
    expect(context?.canonicalRef).toBeNull();
    expect(context?.provenance[0]).toEqual({
      id: 'provenance:0',
      effect: 'effect-provenance:0',
      family: null,
      sourceRef: null,
      displayText: null,
    });
    expect(context?.provenance[0]).not.toHaveProperty('hiddenEngineObject');

    writeHeraldCommandSession('campaign-1', {
      sceneContext: {
        action: 'unsupported-action',
        sceneId: 'building:market',
      },
    });
    expect(readHeraldCommandSession('campaign-1')?.sceneContext).toBeNull();

    writeHeraldCommandSession('campaign-1', {
      sceneContext: {
        action: 'inspect-scene-provenance',
        sceneId: 'building:legacy-market',
        canonicalRef: {
          kind: 'institution',
          id: 7,
          districtIds: [3, '4'],
        },
      },
    });
    expect(readHeraldCommandSession('campaign-1')?.sceneContext?.canonicalRef)
      .toEqual({
        kind: 'institution',
        id: '7',
        districtIds: ['3', '4'],
      });
  });
});
