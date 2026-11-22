/**
 * @vitest-environment jsdom
 *
 * Immutable custom-content lifecycle UI. These tests pin the honesty boundary:
 * inspection is read-only, recovery is forward-only, and success language
 * appears only after the store returns a confirmed persistence receipt.
 */
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeRef.current);
  }
  useStore.getState = () => storeRef.current;
  return { useStore };
});

import {
  ArchivedContentLibrary,
  ContentDefinitionHistory,
} from '../../src/components/contentStudio/CustomContentLifecycle.jsx';

const ITEM = {
  id: 'definition-1',
  definitionId: 'definition-1',
  revisionId: 'revision-2',
  name: 'The Lantern Guild',
};

const HISTORY = [
  {
    id: 'revision-2',
    revisionNumber: 2,
    createdAt: '2026-07-25T12:00:00.000Z',
    isHead: true,
    data: { name: 'The Lantern Guild', description: 'Current description.' },
  },
  {
    id: 'revision-1',
    revisionNumber: 1,
    createdAt: '2026-07-24T12:00:00.000Z',
    isHead: false,
    data: { name: 'Lantern Keepers', description: 'Original description.' },
  },
];

const ARCHIVED = {
  institutions: [{
    ...ITEM,
    archivedAt: '2026-07-25T13:00:00.000Z',
    description: 'An archived civic institution.',
  }],
};

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((onResolve, onReject) => {
    resolve = onResolve;
    reject = onReject;
  });
  return { promise, resolve, reject };
}

function confirmedReceipt() {
  return {
    ok: true,
    status: 'applied',
    persistence: { state: 'confirmed' },
  };
}

beforeEach(() => {
  storeRef.current = {
    customContentArchived: {},
    customContentArchivedLoading: false,
    customContentError: null,
    listCustomContentRevisions: vi.fn(async () => HISTORY),
    rollbackCustomItem: vi.fn(async () => confirmedReceipt()),
    loadArchivedCustomContent: vi.fn(async () => ARCHIVED),
    restoreCustomItem: vi.fn(async () => confirmedReceipt()),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ContentDefinitionHistory', () => {
  it('loads one definition history only when its disclosure opens', async () => {
    const pending = deferred();
    storeRef.current.listCustomContentRevisions = vi.fn(() => pending.promise);
    render(<ContentDefinitionHistory category="institutions" item={ITEM} />);

    expect(storeRef.current.listCustomContentRevisions).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', {
      name: /version history for the lantern guild/i,
    }));
    expect(screen.getByRole('status').textContent).toMatch(/loading immutable history/i);
    expect(storeRef.current.listCustomContentRevisions)
      .toHaveBeenCalledWith('definition-1');

    await act(async () => pending.resolve(HISTORY));
    expect(await screen.findByText('Version 2')).toBeTruthy();
    expect(screen.getByText('Version 1')).toBeTruthy();
    expect(screen.getByText(/loaded 2 immutable versions/i)).toBeTruthy();
    expect(screen.getByText('Current')).toBeTruthy();
  });

  it('creates a forward rollback and reports it only after confirmation', async () => {
    const rollbackPending = deferred();
    const nextHistory = [{
      ...HISTORY[0],
      id: 'revision-3',
      revisionNumber: 3,
    }, ...HISTORY.map(revision => ({ ...revision, isHead: false }))];
    storeRef.current.listCustomContentRevisions = vi.fn()
      .mockResolvedValueOnce(HISTORY)
      .mockResolvedValueOnce(nextHistory);
    storeRef.current.rollbackCustomItem = vi.fn(() => rollbackPending.promise);
    render(<ContentDefinitionHistory category="institutions" item={ITEM} />);

    fireEvent.click(screen.getByRole('button', {
      name: /version history for the lantern guild/i,
    }));
    await screen.findByText('Version 1');
    fireEvent.click(screen.getByRole('button', {
      name: /restore version 1 as new revision/i,
    }));
    const confirm = screen.getByRole('button', {
      name: /create forward revision/i,
    });
    fireEvent.click(confirm);

    expect(confirm.disabled).toBe(true);
    expect(screen.queryByText(/copied into a new, confirmed/i)).toBeNull();
    expect(storeRef.current.rollbackCustomItem).toHaveBeenCalledWith(
      'institutions',
      'definition-1',
      'revision-1',
      'revision-2',
    );

    await act(async () => rollbackPending.resolve(confirmedReceipt()));
    expect(await screen.findByText(/copied into a new, confirmed current revision/i))
      .toBeTruthy();
    expect(await screen.findByText('Version 3')).toBeTruthy();
    expect(storeRef.current.listCustomContentRevisions).toHaveBeenCalledTimes(2);
  });

  it('never turns an unconfirmed command receipt into a success claim', async () => {
    storeRef.current.rollbackCustomItem = vi.fn(async () => ({
      ok: true,
      status: 'applied',
      persistence: { state: 'unconfirmed' },
    }));
    render(<ContentDefinitionHistory category="institutions" item={ITEM} />);

    fireEvent.click(screen.getByRole('button', {
      name: /version history for the lantern guild/i,
    }));
    await screen.findByText('Version 1');
    fireEvent.click(screen.getByRole('button', {
      name: /restore version 1 as new revision/i,
    }));
    fireEvent.click(screen.getByRole('button', {
      name: /create forward revision/i,
    }));

    expect((await screen.findByRole('alert')).textContent).toMatch(
      /forward revision was not confirmed/i,
    );
    expect(screen.queryByText(/copied into a new, confirmed/i)).toBeNull();
  });

  it('surfaces history-load errors without inventing an empty history', async () => {
    storeRef.current.listCustomContentRevisions = vi.fn(async () => {
      throw new Error('History service unavailable');
    });
    render(<ContentDefinitionHistory category="institutions" item={ITEM} />);

    fireEvent.click(screen.getByRole('button', {
      name: /version history for the lantern guild/i,
    }));
    expect((await screen.findByRole('alert')).textContent).toMatch(
      /history service unavailable/i,
    );
    expect(screen.queryByText(/no revision history is available/i)).toBeNull();
  });
});

describe('ArchivedContentLibrary', () => {
  it('loads archived heads on demand without claiming they are active', async () => {
    const pending = deferred();
    storeRef.current.loadArchivedCustomContent = vi.fn(() => pending.promise);
    render(<ArchivedContentLibrary />);

    expect(storeRef.current.loadArchivedCustomContent).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', {
      name: /^archived definitions$/i,
    }));
    expect(screen.getByRole('status').textContent).toMatch(
      /loading archived definitions/i,
    );

    await act(async () => pending.resolve(ARCHIVED));
    expect(await screen.findByText('The Lantern Guild')).toBeTruthy();
    expect(screen.getByText(/loaded 1 archived definition/i)).toBeTruthy();
    expect(screen.getByText(/excluded from future generations/i)).toBeTruthy();
  });

  it('restores an archived head only after confirmed persistence', async () => {
    const restorePending = deferred();
    storeRef.current.loadArchivedCustomContent = vi.fn()
      .mockResolvedValueOnce(ARCHIVED)
      .mockResolvedValueOnce({});
    storeRef.current.restoreCustomItem = vi.fn(() => restorePending.promise);
    render(<ArchivedContentLibrary />);

    fireEvent.click(screen.getByRole('button', {
      name: /^archived definitions$/i,
    }));
    await screen.findByText('The Lantern Guild');
    fireEvent.click(screen.getByRole('button', { name: /^restore definition$/i }));
    const confirm = screen.getByRole('button', { name: /confirm restore/i });
    fireEvent.click(confirm);

    expect(confirm.disabled).toBe(true);
    expect(screen.queryByText(/restored after persistence was confirmed/i)).toBeNull();
    expect(storeRef.current.restoreCustomItem).toHaveBeenCalledWith(
      'institutions',
      'definition-1',
      'revision-2',
    );

    await act(async () => restorePending.resolve(confirmedReceipt()));
    expect(await screen.findByText(/restored after persistence was confirmed/i))
      .toBeTruthy();
    await waitFor(() => {
      expect(screen.queryByText('The Lantern Guild')).toBeNull();
    });
    expect(storeRef.current.loadArchivedCustomContent).toHaveBeenCalledTimes(2);
  });

  it('shows archive-load errors and keeps an explicit retry path', async () => {
    storeRef.current.loadArchivedCustomContent = vi.fn(async () => {
      throw new Error('Archive service unavailable');
    });
    render(<ArchivedContentLibrary />);

    fireEvent.click(screen.getByRole('button', {
      name: /^archived definitions$/i,
    }));
    expect((await screen.findByRole('alert')).textContent).toMatch(
      /archive service unavailable/i,
    );
    fireEvent.click(screen.getByRole('button', { name: /retry archive load/i }));
    await waitFor(() => {
      expect(storeRef.current.loadArchivedCustomContent).toHaveBeenCalledTimes(2);
    });
  });
});
