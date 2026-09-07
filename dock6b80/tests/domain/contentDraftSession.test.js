import { describe, expect, it } from 'vitest';
import {
  CONTENT_STUDIO_STAGE,
  CONTENT_STUDIO_STATUS,
  contentDraftProgress,
  createContentDraftSession,
  reduceContentDraftSession,
} from '../../src/domain/content/contentDraftSession.js';

describe('custom-content studio session', () => {
  it('requires a draft and interpretation before later workflow stages', () => {
    const initial = createContentDraftSession({ intent: 'A haunted glassworks' });
    expect(reduceContentDraftSession(initial, { type: 'effects.viewed' })).toBe(initial);
    expect(reduceContentDraftSession(initial, { type: 'sample.started' })).toBe(initial);
    expect(reduceContentDraftSession(initial, { type: 'approval.reviewed' })).toBe(initial);
  });

  it('tracks the complete inspect, preview, sample, approval, receipt sequence', () => {
    let state = createContentDraftSession({ intent: 'A haunted glassworks' });
    state = reduceContentDraftSession(state, { type: 'compile.started' });
    expect(state.status).toBe(CONTENT_STUDIO_STATUS.WORKING);

    state = reduceContentDraftSession(state, {
      type: 'compile.succeeded',
      draft: { entries: [{ bucket: 'institutions', entry: { name: 'Glassworks' } }] },
    });
    expect(state.stage).toBe(CONTENT_STUDIO_STAGE.INSPECT);

    state = reduceContentDraftSession(state, {
      type: 'effects.viewed',
      interpretation: { totals: { mechanical: 1 } },
    });
    state = reduceContentDraftSession(state, { type: 'sample.started' });
    state = reduceContentDraftSession(state, {
      type: 'sample.succeeded',
      sample: { seed: 'content-preview-1' },
    });
    expect(state.stage).toBe(CONTENT_STUDIO_STAGE.REVISE);
    state = reduceContentDraftSession(state, { type: 'approval.reviewed' });
    state = reduceContentDraftSession(state, { type: 'approval.started' });
    state = reduceContentDraftSession(state, {
      type: 'approval.received',
      receipt: {
        ok: true,
        status: 'applied',
        commandId: 'cmd-1',
        persistence: { state: 'confirmed' },
      },
    });

    expect(state.stage).toBe(CONTENT_STUDIO_STAGE.RECEIPT);
    expect(contentDraftProgress(state)).toEqual({
      current: 7,
      total: 7,
      stage: 'receipt',
      complete: true,
    });
  });

  it('does not complete on an unconfirmed success-shaped writer receipt', () => {
    let state = createContentDraftSession();
    state = reduceContentDraftSession(state, {
      type: 'compile.succeeded',
      draft: { entries: [{ bucket: 'resources', entry: { name: 'Moon salt' } }] },
    });
    state = reduceContentDraftSession(state, {
      type: 'effects.viewed',
      interpretation: { totals: {} },
    });
    state = reduceContentDraftSession(state, { type: 'sample.started' });
    state = reduceContentDraftSession(state, {
      type: 'sample.succeeded',
      sample: { seed: 'content-preview-1' },
    });
    state = reduceContentDraftSession(state, { type: 'approval.reviewed' });
    state = reduceContentDraftSession(state, { type: 'approval.started' });
    state = reduceContentDraftSession(state, {
      type: 'approval.received',
      receipt: {
        ok: true,
        status: 'applied',
        persistence: { state: 'unconfirmed' },
      },
    });

    expect(state).toMatchObject({
      stage: CONTENT_STUDIO_STAGE.RECEIPT,
      status: CONTENT_STUDIO_STATUS.FAILED,
      receipt: {
        ok: false,
        status: 'reconcile-required',
        persistence: { state: 'unconfirmed' },
      },
    });
    expect(contentDraftProgress(state).complete).toBe(false);
  });

  it('invalidates an earlier sample when an author changes a decision', () => {
    let state = createContentDraftSession();
    state = reduceContentDraftSession(state, {
      type: 'compile.succeeded',
      draft: { entries: [{ bucket: 'resources', entry: { name: 'Moon salt' } }] },
    });
    state = reduceContentDraftSession(state, {
      type: 'effects.viewed',
      interpretation: { totals: {} },
    });
    state = reduceContentDraftSession(state, { type: 'sample.started' });
    state = reduceContentDraftSession(state, {
      type: 'sample.succeeded',
      sample: { seed: 'old' },
    });
    state = reduceContentDraftSession(state, {
      type: 'decision.changed',
      index: 0,
      decision: { action: 'edit', editedFields: { name: 'Sun salt' } },
    });

    expect(state.sample).toBeNull();
    expect(state.interpretation).toBeNull();
    expect(state.stage).toBe(CONTENT_STUDIO_STAGE.INSPECT);
    expect(state.decisions[0].editedFields.name).toBe('Sun salt');
  });

  it('requires a new sample when the active preview baseline changes', () => {
    let state = createContentDraftSession();
    state = reduceContentDraftSession(state, {
      type: 'compile.succeeded',
      draft: { entries: [{ bucket: 'resources', entry: { name: 'Moon salt' } }] },
    });
    state = reduceContentDraftSession(state, {
      type: 'effects.viewed',
      interpretation: { totals: {} },
    });
    state = reduceContentDraftSession(state, { type: 'sample.started' });
    state = reduceContentDraftSession(state, {
      type: 'sample.succeeded',
      sample: { seed: 'old-baseline' },
    });
    state = reduceContentDraftSession(state, { type: 'baseline.changed' });

    expect(state).toMatchObject({
      stage: CONTENT_STUDIO_STAGE.EFFECTS,
      status: CONTENT_STUDIO_STATUS.READY,
      sample: null,
      receipt: null,
    });
    expect(state.interpretation).toEqual({ totals: {} });
  });

  it('ignores stale sample packets and refuses approval without current evidence', () => {
    let state = createContentDraftSession();
    state = reduceContentDraftSession(state, {
      type: 'compile.succeeded',
      draft: { entries: [{ bucket: 'resources', entry: { name: 'Moon salt' } }] },
    });
    state = reduceContentDraftSession(state, {
      type: 'effects.viewed',
      interpretation: { totals: {} },
    });
    state = reduceContentDraftSession(state, { type: 'sample.started' });
    state = reduceContentDraftSession(state, {
      type: 'decision.changed',
      index: 0,
      decision: { action: 'approve' },
    });

    const afterLatePacket = reduceContentDraftSession(state, {
      type: 'sample.succeeded',
      sample: { seed: 'stale-preview' },
    });
    expect(afterLatePacket).toBe(state);
    expect(reduceContentDraftSession(
      state,
      { type: 'approval.reviewed' },
    )).toBe(state);
  });
});
