/**
 * @vitest-environment jsdom
 *
 * Environment recovery is review-first and confirmation-strict. These tests
 * keep vanilla reset and immutable rollback from becoming silent state flips.
 */

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  makeLibraryContentEnvironmentRevision,
  makeContentEnvironmentRevision,
  VANILLA_CONTENT_ENVIRONMENT,
} from '../../src/domain/content/contentEnvironment.js';

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeRef.current);
  }
  useStore.getState = () => storeRef.current;
  return { useStore };
});

import ContentEnvironmentLifecycle from '../../src/components/contentStudio/ContentEnvironmentLifecycle.jsx';

const ACTIVE = makeContentEnvironmentRevision({
  environmentId: 'environment:active',
  environmentRevisionId: 'environment:active:v2',
  revisionNumber: 2,
  tunables: { priorityEconomy: 72 },
  source: 'personal',
});

const PRIOR = makeContentEnvironmentRevision({
  environmentId: 'environment:active',
  environmentRevisionId: 'environment:active:v1',
  revisionNumber: 1,
  tunables: { priorityEconomy: 61 },
  source: 'personal',
});

function confirmedReceipt() {
  return {
    ok: true,
    status: 'applied',
    persistence: { state: 'confirmed' },
  };
}

beforeEach(() => {
  storeRef.current = {
    activeContentEnvironment: ACTIVE,
    customContentEnvironmentHistory: [ACTIVE, PRIOR],
    loadCustomContentEnvironments: vi.fn(async () => [ACTIVE, PRIOR]),
    previewCustomContentEnvironmentMigration: vi.fn(async target => ({
      ok: true,
      environment: target,
      previewFingerprint: `preview:${target.environmentRevisionId}`,
      changes: [{
        path: 'tunables.priorityEconomy',
        before: 72,
        after: target.tunables.priorityEconomy ?? null,
      }],
    })),
    resetCustomContentEnvironmentToVanilla: vi.fn(
      async () => confirmedReceipt(),
    ),
    migrateCustomContentEnvironment: vi.fn(
      async () => confirmedReceipt(),
    ),
    rollbackCustomContentEnvironment: vi.fn(
      async () => confirmedReceipt(),
    ),
    customContent: {},
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ContentEnvironmentLifecycle', () => {
  it('loads history on demand and confirms a reviewed vanilla reset', async () => {
    render(<ContentEnvironmentLifecycle />);

    expect(storeRef.current.loadCustomContentEnvironments)
      .not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', {
      name: /manage revisions/i,
    }));
    await waitFor(() => {
      expect(storeRef.current.loadCustomContentEnvironments)
        .toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByRole('button', {
      name: /review vanilla reset/i,
    }));
    expect(await screen.findByRole('group', {
      name: /content environment change confirmation/i,
    })).toBeTruthy();
    expect(storeRef.current.resetCustomContentEnvironmentToVanilla)
      .not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', {
      name: /activate reviewed revision/i,
    }));
    await waitFor(() => {
      expect(storeRef.current.resetCustomContentEnvironmentToVanilla)
        .toHaveBeenCalledWith({
          previewFingerprint: `preview:${
            VANILLA_CONTENT_ENVIRONMENT.environmentRevisionId
          }`,
        });
    });
    expect(await screen.findByText(/vanilla generation defaults are active/i))
      .toBeTruthy();
  });

  it('rolls back by immutable revision id only after review', async () => {
    render(<ContentEnvironmentLifecycle />);
    fireEvent.click(screen.getByRole('button', {
      name: /manage revisions/i,
    }));
    fireEvent.click(await screen.findByRole('button', {
      name: /review rollback/i,
    }));
    await screen.findByRole('group', {
      name: /content environment change confirmation/i,
    });

    expect(storeRef.current.rollbackCustomContentEnvironment)
      .not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', {
      name: /activate reviewed revision/i,
    }));
    await waitFor(() => {
      expect(storeRef.current.rollbackCustomContentEnvironment)
        .toHaveBeenCalledWith('environment:active:v1', {
          previewFingerprint: 'preview:environment:active:v1',
        });
    });
    expect(await screen.findByText(/selected immutable setting revision is active/i))
      .toBeTruthy();
  });

  it('never describes an unconfirmed environment write as active', async () => {
    storeRef.current.resetCustomContentEnvironmentToVanilla = vi.fn(async () => ({
      ok: true,
      status: 'applied',
      persistence: { state: 'unconfirmed' },
    }));
    render(<ContentEnvironmentLifecycle />);
    fireEvent.click(screen.getByRole('button', {
      name: /manage revisions/i,
    }));
    fireEvent.click(await screen.findByRole('button', {
      name: /review vanilla reset/i,
    }));
    await screen.findByRole('group', {
      name: /content environment change confirmation/i,
    });
    fireEvent.click(screen.getByRole('button', {
      name: /activate reviewed revision/i,
    }));

    expect((await screen.findByRole('alert')).textContent)
      .toMatch(/revision was not confirmed/i);
    expect(screen.queryByText(/vanilla generation defaults are active/i))
      .toBeNull();
  });

  it('reviews exact authored heads before activating the library', async () => {
    storeRef.current.customContent = {
      institutions: [{
        name: 'Private Guild',
        definitionId: 'definition:private-guild',
        revisionId: 'revision:private-guild:1',
        localUid: 'lu_private_guild',
      }],
    };
    render(<ContentEnvironmentLifecycle />);
    fireEvent.click(screen.getByRole('button', {
      name: /manage revisions/i,
    }));
    fireEvent.click(await screen.findByRole('button', {
      name: /review authored library/i,
    }));
    await screen.findByRole('group', {
      name: /content environment change confirmation/i,
    });

    expect(storeRef.current.migrateCustomContentEnvironment)
      .not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', {
      name: /activate reviewed revision/i,
    }));
    await waitFor(() => {
      expect(storeRef.current.migrateCustomContentEnvironment)
        .toHaveBeenCalledWith(
          expect.objectContaining({
            source: 'personal',
            directDefinitions: [
              expect.objectContaining({
                definitionId: 'definition:private-guild',
                revisionId: 'revision:private-guild:1',
              }),
            ],
          }),
          expect.objectContaining({
            previewFingerprint: expect.any(String),
          }),
        );
    });
    expect(await screen.findByText(/authored-library revision is active/i))
      .toBeTruthy();
  });

  it('surfaces stale exact-head resolution instead of silently running a subset', () => {
    const reviewedLibrary = {
      institutions: [{
        name: 'Private Guild',
        definitionId: 'definition:private-guild',
        revisionId: 'revision:private-guild:1',
        localUid: 'lu_private_guild',
      }],
    };
    storeRef.current.activeContentEnvironment =
      makeLibraryContentEnvironmentRevision(reviewedLibrary);
    storeRef.current.customContent = {
      institutions: [{
        ...reviewedLibrary.institutions[0],
        name: 'Private Guild Revised',
        revisionId: 'revision:private-guild:2',
      }],
    };

    render(<ContentEnvironmentLifecycle />);
    expect(screen.getByRole('alert').textContent)
      .toMatch(/using vanilla until you review/i);
  });
});
