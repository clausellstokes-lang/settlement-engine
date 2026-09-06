/**
 * @vitest-environment jsdom
 *
 * Content-pack import is deliberately two-phase: a file is parsed and reviewed
 * before its fingerprinted command runs, and pack setting defaults require a
 * second environment confirmation after definitions are durable.
 */

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildContentPack } from '../../src/lib/contentPacks.js';

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: {} } }));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeRef.current);
  }
  useStore.getState = () => storeRef.current;
  return { useStore };
});

import ContentPackBar from '../../src/components/compendium/ContentPackBar.jsx';

function confirmedReceipt() {
  return {
    ok: true,
    status: 'applied',
    persistence: { state: 'confirmed' },
    perEntry: [{
      definitionId: 'definition:forge',
      revisionId: 'revision:forge:1',
      category: 'institutions',
      packEntryId: 'forge-entry',
      status: 'created',
    }],
    result: {
      items: [{
        id: 'definition:forge',
        definitionId: 'definition:forge',
        revisionId: 'revision:forge:1',
        contentHash: 'c'.repeat(64),
        name: 'Dragonbone Foundry',
      }],
    },
  };
}

beforeEach(() => {
  storeRef.current = {
    customContent: {
      institutions: [],
      services: [],
      resources: [],
      stressors: [],
      tradeGoods: [],
      factions: [],
      deities: [],
      traditions: [],
    },
    applyCustomContentCommand: vi.fn(async () => confirmedReceipt()),
    previewCustomContentEnvironmentMigration: vi.fn(async environment => ({
      ok: true,
      environment,
      previewFingerprint: 'environment-preview-fingerprint',
      changes: [{ path: 'tunables.priorityEconomy', before: null, after: 72 }],
    })),
    migrateCustomContentEnvironment: vi.fn(async () => confirmedReceipt()),
  };
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ContentPackBar reviewed import', () => {
  it('does not write before confirmation and separately confirms setting defaults', async () => {
    const pack = buildContentPack({
      institutions: [{
        name: 'Dragonbone Foundry',
        localUid: 'lu_dragonbone',
        packEntryId: 'forge-entry',
      }],
    }, {
      name: 'Dragonbone Setting',
      packVersion: '1.2.0',
      tunables: { priorityEconomy: 72 },
    });
    const file = new File(
      [JSON.stringify(pack)],
      'dragonbone-setting.json',
      { type: 'application/json' },
    );
    Object.defineProperty(file, 'text', {
      value: vi.fn(async () => JSON.stringify(pack)),
    });
    render(<ContentPackBar />);

    fireEvent.change(screen.getByLabelText(/import content pack file/i), {
      target: { files: [file] },
    });

    expect(await screen.findByRole('group', {
      name: /reviewed content pack/i,
    })).toBeTruthy();
    expect(storeRef.current.applyCustomContentCommand).not.toHaveBeenCalled();
    expect(screen.getByText(/1 validated entry/i)).toBeTruthy();
    expect(screen.getByText(/1 setting defaults/i)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', {
      name: /apply reviewed pack/i,
    }));
    await waitFor(() => {
      expect(storeRef.current.applyCustomContentCommand).toHaveBeenCalledTimes(1);
    });
    const request = storeRef.current.applyCustomContentCommand.mock.calls[0][0];
    expect(request.kind).toBe('content.pack.import');
    expect(request.previewFingerprint).toMatch(/^[0-9a-f]{64}$/);

    expect(await screen.findByRole('group', {
      name: /pack setting migration review/i,
    })).toBeTruthy();
    expect(storeRef.current.migrateCustomContentEnvironment)
      .not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', {
      name: /apply setting defaults/i,
    }));
    await waitFor(() => {
      expect(storeRef.current.migrateCustomContentEnvironment)
        .toHaveBeenCalledTimes(1);
    });
    expect(storeRef.current.migrateCustomContentEnvironment)
      .toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'imported-pack',
          tunables: { priorityEconomy: 72 },
        }),
        { previewFingerprint: 'environment-preview-fingerprint' },
      );
    expect(await screen.findByText(/setting defaults are now active/i))
      .toBeTruthy();
  });

  it('can retain current defaults after applying definitions', async () => {
    const pack = buildContentPack({
      resources: [{ name: 'Moon Salt', localUid: 'lu_moon_salt' }],
    }, {
      name: 'Moon Salt Pack',
      tunables: { priorityMagic: 65 },
    });
    const file = new File(
      [JSON.stringify(pack)],
      'moon-salt.json',
      { type: 'application/json' },
    );
    Object.defineProperty(file, 'text', {
      value: vi.fn(async () => JSON.stringify(pack)),
    });
    render(<ContentPackBar />);

    fireEvent.change(screen.getByLabelText(/import content pack file/i), {
      target: { files: [file] },
    });
    fireEvent.click(await screen.findByRole('button', {
      name: /apply reviewed pack/i,
    }));
    fireEvent.click(await screen.findByRole('button', {
      name: /keep current defaults/i,
    }));

    expect(storeRef.current.migrateCustomContentEnvironment)
      .not.toHaveBeenCalled();
    expect(await screen.findByText(/existing setting defaults retained/i))
      .toBeTruthy();
  });
});
