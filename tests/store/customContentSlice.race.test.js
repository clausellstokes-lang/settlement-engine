/**
 * customContentSlice — durable command ordering and compare-and-swap.
 *
 * The old suite exercised an optimistic local-id/cloud-id repair path. Custom
 * content no longer has an optimistic projection: the slice sends a reviewed
 * immutable command to one persistence authority and projects only an
 * `applied` receipt. These tests hold that authority open so the boundary is
 * observable, then exercise two edits that share an expected head.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import {
  confirmCustomSupplyChainReview,
} from '../../src/domain/content/customSupplyChainReview.js';
import {
  contentRevisionHash,
} from '../../src/domain/content/customContentVersioning.js';
import {
  reviewedSupplyChainContentHash,
} from '../../src/domain/content/reviewedSupplyChainPersistence.js';
import { inferSupplyChains } from '../../src/domain/inferSupplyChains.js';

const h = vi.hoisted(() => {
  let pending = [];
  let pendingReviewed = [];
  let revisionSequence = 0;
  const definitions = new Map();

  function receipt(commandId, status, {
    reason = null,
    items = [],
    perEntry = [],
  } = {}) {
    return {
      ok: status === 'applied',
      status,
      commandId,
      reason,
      persistence: {
        state: status === 'applied' ? 'confirmed' : 'not-required',
        authority: 'test-transaction',
      },
      result: { items },
      perEntry,
    };
  }

  function applyQueued({ preview, options }) {
    const { plan } = preview;
    const commandId = options.commandId;

    if (plan.kind === 'content.definition.archive') {
      const existing = definitions.get(plan.definitionId);
      if (!existing) {
        return receipt(commandId, 'failed', {
          reason: 'definition_unavailable',
        });
      }
      if (
        plan.expectedHeadRevisionId
        && plan.expectedHeadRevisionId !== existing.revisionId
      ) {
        return receipt(commandId, 'stale', {
          reason: 'definition_head_changed',
        });
      }
      existing.archived = true;
      return receipt(commandId, 'applied', {
        perEntry: [{
          definitionId: existing.definitionId,
          revisionId: existing.revisionId,
          status: 'archived',
          category: existing.category,
        }],
      });
    }

    const items = [];
    const perEntry = [];
    for (const entry of plan.entries) {
      const existing = definitions.get(entry.definitionId);
      if (
        existing
        && entry.expectedHeadRevisionId !== existing.revisionId
      ) {
        return receipt(commandId, 'stale', {
          reason: 'definition_head_changed',
        });
      }
      const revisionId = `revision_${++revisionSequence}`;
      const revisionNumber = (existing?.revisionNumber || 0) + 1;
      const projected = {
        ...entry.data,
        id: entry.definitionId,
        definitionId: entry.definitionId,
        revisionId,
        revisionNumber,
        localUid: entry.data.localUid || existing?.localUid
          || `lu_test_${revisionSequence}`,
        isCustom: true,
      };
      definitions.set(entry.definitionId, {
        ...projected,
        category: entry.category,
        archived: false,
      });
      items.push(projected);
      perEntry.push({
        definitionId: entry.definitionId,
        revisionId,
        status: existing ? 'updated' : 'created',
        category: entry.category,
      });
    }
    return receipt(commandId, 'applied', { items, perEntry });
  }

  return {
    definitions,
    service: {
      isConfigured: true,
      executeCommand: (preview, options) => new Promise(resolve => {
        pending.push({ preview, options, resolve });
      }),
      executeReviewedSupplyChainCommand:
        (preview, options) => new Promise(resolve => {
          pendingReviewed.push({ preview, options, resolve });
        }),
      resolveReviewedSupplyChainIdentity: vi.fn(async () => null),
    },
    confirmNext() {
      const queued = pending.shift();
      if (!queued) throw new Error('No custom-content command is pending.');
      queued.resolve(applyQueued(queued));
    },
    resolveNext(receipt) {
      const queued = pending.shift();
      if (!queued) throw new Error('No custom-content command is pending.');
      queued.resolve(receipt);
    },
    pendingCount() {
      return pending.length;
    },
    resolveReviewedAt(index, receipt) {
      const [queued] = pendingReviewed.splice(index, 1);
      if (!queued) throw new Error('No reviewed command is pending.');
      queued.resolve(receipt);
    },
    pendingReviewedCount() {
      return pendingReviewed.length;
    },
    reviewedQueued(index) {
      return pendingReviewed[index] || null;
    },
    reset() {
      pending = [];
      pendingReviewed = [];
      revisionSequence = 0;
      definitions.clear();
    },
  };
});

vi.mock('../../src/lib/customContent.js', () => ({
  customContentService: h.service,
}));

const { createCustomContentSlice } = await import(
  '../../src/store/customContentSlice.js'
);

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => {
      data.set(String(key), String(value));
    },
    removeItem: key => {
      data.delete(String(key));
    },
    clear: () => {
      data.clear();
    },
  };
}

function reviewedChainFixture() {
  const resource = {
    name: 'Race Resin',
    localUid: 'race-resin',
    category: 'forest',
    tierMax: 'metropolis',
    yields: ['custom:race-lacquer'],
    definitionId: 'race-resource-definition',
    revisionId: 'race-resource-revision',
    revisionNumber: 1,
  };
  resource.contentHash = contentRevisionHash('resources', resource);
  const good = {
    name: 'Race Lacquer',
    localUid: 'race-lacquer',
    requiredResources: ['custom:race-resin'],
    definitionId: 'race-good-definition',
    revisionId: 'race-good-revision',
    revisionNumber: 1,
  };
  good.contentHash = contentRevisionHash('tradeGoods', good);
  return confirmCustomSupplyChainReview(inferSupplyChains({
    resources: [resource],
    tradeGoods: [good],
  })[0]);
}

function reviewedAppliedReceipt({
  commandId,
  preview,
  artifactId,
  item = null,
  archivedItem = null,
}) {
  return {
    ok: true,
    status: 'applied',
    commandId,
    fingerprint: preview.fingerprint,
    persistence: {
      state: 'confirmed',
      authority: 'test-transaction',
    },
    result: {
      artifactId,
      item,
      archivedItem,
      headRevisionId: (item || archivedItem).revisionId,
    },
    perEntry: [],
  };
}

function makeStore() {
  return create(immer((...args) => ({
    auth: { user: { id: 'user_a' }, tier: 'premium' },
    canUseCustomContent: () => true,
    ...createCustomContentSlice(...args),
  })));
}

async function waitForPending(count, store = null) {
  // The first command imports the manifest, command adapter, and registry.
  // Production intentionally pays that cost lazily, so the test waits for the
  // writer boundary rather than assuming a particular module-load duration.
  for (let attempt = 0; attempt < 400; attempt += 1) {
    if (h.pendingCount() >= count) return;
    await new Promise(resolve => setTimeout(resolve, 5));
  }
  const diagnostic = store
    ? ` Last receipt: ${JSON.stringify(
        store.getState().customContentLastCommandReceipt,
      )}; error: ${String(store.getState().customContentError)}.`
    : '';
  throw new Error(
    `Expected ${count} pending custom-content command(s).${diagnostic}`,
  );
}

describe('customContentSlice durable command race', () => {
  beforeEach(() => {
    installLocalStorage();
    h.reset();
  });

  test('does not project or mirror a create before persistence confirms it', async () => {
    const store = makeStore();
    const pendingCreate = store.getState().addCustomItem(
      'institutions',
      { name: 'Patient Hall' },
    );

    await waitForPending(1, store);
    expect(store.getState().getCustomItems('institutions')).toEqual([]);
    expect(localStorage.getItem('sf_custom_content:user_a')).toBeNull();

    h.confirmNext();
    const created = await pendingCreate;

    expect(created).toMatchObject({
      name: 'Patient Hall',
      revisionNumber: 1,
      isCustom: true,
    });
    expect(store.getState().getCustomItems('institutions')).toHaveLength(1);
    expect(
      JSON.parse(localStorage.getItem('sf_custom_content:user_a'))
        .institutions[0].name,
    ).toBe('Patient Hall');
    expect(
      store.getState().customContentLastCommandReceipt.persistence.state,
    ).toBe('confirmed');
  });

  test('a delayed reviewed response cannot rewind a newer archive', async () => {
    const store = makeStore();
    const chain = reviewedChainFixture();
    const artifactId = 'race-reviewed-artifact';
    const base = {
      ...chain,
      id: artifactId,
      definitionId: artifactId,
      revisionId: 'race-reviewed:r1',
      revisionNumber: 1,
      contentHash: reviewedSupplyChainContentHash(chain),
      reviewedLifecycleVersion: 1,
      archivedAt: null,
    };
    store.setState(state => ({
      customContent: {
        ...state.customContent,
        supplyChains: [base],
      },
    }));

    const delayedUpdate = store.getState().applyReviewedSupplyChainCommand({
      kind: 'content.reviewed-supply-chain.confirm',
      artifactId,
      expectedHeadRevisionId: base.revisionId,
      expectedLifecycleVersion: 1,
      chain,
    });
    const newerArchive = store.getState().applyReviewedSupplyChainCommand({
      kind: 'content.reviewed-supply-chain.remove',
      artifactId,
      expectedHeadRevisionId: 'race-reviewed:r2',
      expectedLifecycleVersion: 2,
      chain: null,
    });
    for (let attempt = 0; attempt < 400; attempt += 1) {
      if (h.pendingReviewedCount() === 2) break;
      await new Promise(resolve => setTimeout(resolve, 5));
    }
    expect(h.pendingReviewedCount()).toBe(2);
    const delayed = h.reviewedQueued(0);
    const archive = h.reviewedQueued(1);
    const updatedItem = {
      ...base,
      revisionId: 'race-reviewed:r2',
      revisionNumber: 2,
      reviewedLifecycleVersion: 2,
    };
    const archivedItem = {
      ...updatedItem,
      reviewedLifecycleVersion: 3,
      archivedAt: '2026-07-25T00:00:03.000Z',
    };
    h.resolveReviewedAt(1, reviewedAppliedReceipt({
      commandId: archive.options.commandId,
      preview: archive.preview,
      artifactId,
      archivedItem,
    }));
    expect(await newerArchive).toMatchObject({ ok: true });
    h.resolveReviewedAt(0, reviewedAppliedReceipt({
      commandId: delayed.options.commandId,
      preview: delayed.preview,
      artifactId,
      item: updatedItem,
    }));

    expect(await delayedUpdate).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'reviewed_supply_chain_response_superseded',
    });
    expect(store.getState().customContent.supplyChains).toEqual([]);
    expect(store.getState().customContentArchived.supplyChains)
      .toEqual([archivedItem]);
  });

  test('does not project a success-shaped receipt without durable confirmation', async () => {
    const store = makeStore();
    const pendingCreate = store.getState().addCustomItem(
      'institutions',
      { name: 'Phantom Hall' },
    );

    await waitForPending(1, store);
    h.resolveNext({
      ok: true,
      status: 'applied',
      commandId: 'ambiguous-custom-content-command',
      persistence: {
        state: 'unconfirmed',
        authority: 'test-transaction',
      },
      result: {
        items: [{
          name: 'Phantom Hall',
          definitionId: 'definition_phantom',
          revisionId: 'revision_phantom',
        }],
      },
      perEntry: [{
        definitionId: 'definition_phantom',
        revisionId: 'revision_phantom',
        category: 'institutions',
      }],
    });

    expect(await pendingCreate).toBeNull();
    expect(store.getState().getCustomItems('institutions')).toEqual([]);
    expect(localStorage.getItem('sf_custom_content:user_a')).toBeNull();
    expect(store.getState().customContentLastCommandReceipt).toMatchObject({
      ok: false,
      status: 'reconcile-required',
      persistence: { state: 'unconfirmed' },
    });
  });

  test('two edits from one head apply once and classify the loser as stale', async () => {
    const store = makeStore();
    const pendingCreate = store.getState().addCustomItem(
      'institutions',
      { name: 'Original Hall' },
    );
    await waitForPending(1, store);
    h.confirmNext();
    const created = await pendingCreate;

    const firstEdit = store.getState().updateCustomItem(
      'institutions',
      created.definitionId,
      { name: 'First Edit' },
    );
    const competingEdit = store.getState().updateCustomItem(
      'institutions',
      created.definitionId,
      { name: 'Competing Edit' },
    );
    await waitForPending(2, store);

    h.confirmNext();
    const winner = await firstEdit;
    h.confirmNext();
    const loser = await competingEdit;

    expect(winner).toMatchObject({
      name: 'First Edit',
      revisionNumber: 2,
    });
    expect(loser).toBeNull();
    expect(store.getState().getCustomItems('institutions')[0]).toMatchObject({
      name: 'First Edit',
      revisionNumber: 2,
    });
    expect(store.getState().customContentLastCommandReceipt).toMatchObject({
      ok: false,
      status: 'stale',
      reason: 'definition_head_changed',
    });
    expect(h.definitions.get(created.definitionId)).toMatchObject({
      name: 'First Edit',
      revisionNumber: 2,
    });
  });

  test('keeps an archived definition active until archive confirmation', async () => {
    const store = makeStore();
    const pendingCreate = store.getState().addCustomItem(
      'institutions',
      { name: 'Remembered Hall' },
    );
    await waitForPending(1, store);
    h.confirmNext();
    const created = await pendingCreate;

    const pendingArchive = store.getState().deleteCustomItem(
      'institutions',
      created.definitionId,
    );
    await waitForPending(1, store);

    expect(store.getState().getCustomItems('institutions')).toHaveLength(1);
    expect(
      JSON.parse(localStorage.getItem('sf_custom_content:user_a'))
        .institutions,
    ).toHaveLength(1);

    h.confirmNext();
    const archiveReceipt = await pendingArchive;

    expect(archiveReceipt).toMatchObject({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    });
    expect(store.getState().getCustomItems('institutions')).toEqual([]);
    expect(
      JSON.parse(localStorage.getItem('sf_custom_content:user_a'))
        .institutions,
    ).toEqual([]);
    expect(h.definitions.get(created.definitionId).archived).toBe(true);
  });
});
