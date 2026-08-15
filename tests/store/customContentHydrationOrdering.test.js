/**
 * Cloud custom-content hydration has two authorities: immutable definitions and
 * the owner's active environment pointer. A legacy campaign cutoff is permanent,
 * so it may be minted only after both reads succeeded. Initial-state vanilla is
 * not evidence that the owner deliberately selected vanilla.
 */

import {
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const control = vi.hoisted(() => ({
  active: null,
  events: [],
  failEnvironment: false,
  observed: null,
}));

vi.mock('../../src/lib/customContent.js', () => ({
  customContentService: {
    isConfigured: true,
    list: async () => {
      control.events.push('definitions');
      return {
        institutions: [{
          id: 'definition-cloud',
          definitionId: 'definition-cloud',
          revisionId: 'revision-cloud-1',
          revisionNumber: 1,
          localUid: 'lu_cloud',
          name: 'Cloud Hall',
          isCustom: true,
        }],
      };
    },
    listContentEnvironmentRevisions: async () => {
      control.events.push('environment-history');
      if (control.failEnvironment) throw new Error('environment history offline');
      return control.active ? [control.active] : [];
    },
    loadActiveContentEnvironment: async () => {
      control.events.push('environment-active');
      if (control.failEnvironment) throw new Error('environment pointer offline');
      return control.active;
    },
    resolveContentEnvironment: async environment => {
      control.events.push('environment-resolution');
      return {
        ok: true,
        environment,
        customContent: { institutions: [] },
      };
    },
  },
}));

import {
  makeContentEnvironmentRevision,
} from '../../src/domain/content/contentEnvironment.js';
import { createCustomContentSlice } from '../../src/store/customContentSlice.js';

function installLocalStorage() {
  const values = new Map();
  globalThis.localStorage = {
    getItem: key => values.get(String(key)) ?? null,
    setItem: (key, value) => values.set(String(key), String(value)),
    removeItem: key => values.delete(String(key)),
    clear: () => values.clear(),
  };
}

function makeStore() {
  return create(immer((set, get, api) => ({
    ...createCustomContentSlice(set, get, api),
    auth: { user: { id: 'owner-cloud' }, tier: 'premium' },
    canUseCustomContent: () => true,
    campaigns: [{
      id: 'legacy-campaign',
      contentBindingStatus: 'legacy-inferred-pending',
    }],
    pinLegacyCampaignContentBindings: content => {
      control.events.push('pin');
      const state = get();
      control.observed = {
        environmentRevisionId:
          state.activeContentEnvironment.environmentRevisionId,
        institution: content.institutions?.[0]?.name || null,
      };
      return true;
    },
  })));
}

describe('custom-content cloud hydration ordering', () => {
  beforeEach(() => {
    installLocalStorage();
    control.events.length = 0;
    control.failEnvironment = false;
    control.observed = null;
    control.active = makeContentEnvironmentRevision({
      environmentId: 'personal:cloud',
      environmentRevisionId: 'personal:cloud:v2',
      revisionNumber: 2,
      tunables: { priorityEconomy: 72 },
      source: 'personal',
    });
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  test('hydrates the active environment before minting a legacy campaign cutoff', async () => {
    const store = makeStore();

    await store.getState().loadCustomContentFromCloud();

    expect(control.events).toContain('definitions');
    expect(control.events).toContain('environment-history');
    expect(control.events).toContain('environment-active');
    expect(control.events).toContain('environment-resolution');
    expect(control.events.indexOf('pin'))
      .toBeGreaterThan(control.events.indexOf('environment-history'));
    expect(control.events.indexOf('pin'))
      .toBeGreaterThan(control.events.indexOf('environment-active'));
    expect(store.getState()).toMatchObject({
      customContentEnvironmentHydrated: true,
      customContentEnvironmentError: null,
    });
    expect(control.observed).toEqual({
      environmentRevisionId: 'personal:cloud:v2',
      institution: 'Cloud Hall',
    });
  });

  test('keeps legacy campaigns pending when environment hydration fails', async () => {
    control.failEnvironment = true;
    const store = makeStore();

    await store.getState().loadCustomContentFromCloud();

    expect(control.events).not.toContain('pin');
    expect(store.getState().customContent.institutions[0].name)
      .toBe('Cloud Hall');
    expect(store.getState().customContentSyncedAt).not.toBeNull();
    expect(store.getState()).toMatchObject({
      customContentEnvironmentHydrated: false,
      customContentEnvironmentError: 'environment history offline',
      campaigns: [{
        contentBindingStatus: 'legacy-inferred-pending',
      }],
    });
  });
});
