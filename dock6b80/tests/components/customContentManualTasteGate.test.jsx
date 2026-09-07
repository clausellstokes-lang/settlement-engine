/**
 * @vitest-environment jsdom
 *
 * The manual editor uses the same exact-draft taste gate as the Surveyor lane.
 * A field change after preview must make the old sample ineligible for commit.
 */

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const { previewRef, storeState } = vi.hoisted(() => ({
  previewRef: { fn: null },
  storeState: {
    customContent: {
      institutions: [],
      services: [],
      resources: [],
      stressors: [],
      tradeGoods: [],
      deities: [],
      traditions: [],
      factions: [],
      supplyChains: [],
    },
    addCustomItem: vi.fn(),
    updateCustomItem: vi.fn(),
    deleteCustomItem: vi.fn(),
    applyCustomContentCommand: vi.fn(),
    canUseCustomContent: () => true,
    auth: { tier: 'premium', user: { id: 'manual-author' } },
    customContentLoading: false,
    customContentError: null,
    loadCustomContentFromCloud: vi.fn(),
  },
}));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});
vi.mock('../../src/lib/customContentPreviewClient.js', () => ({
  runCustomContentPreview: (...args) => previewRef.fn(...args),
}));
vi.mock('../../src/components/compendium/ContentPackBar.jsx', () => ({
  default: () => null,
}));
vi.mock('../../src/components/compendium/SupplyChainsManager.jsx', () => ({
  default: () => null,
}));
vi.mock('../../src/components/compendium/PantheonActivationStrip.jsx', () => ({
  default: () => null,
}));
vi.mock('../../src/components/compendium/FactionEventBanner.jsx', () => ({
  default: () => null,
}));
vi.mock('../../src/components/contentStudio/CustomContentLifecycle.jsx', () => ({
  ArchivedContentLibrary: () => null,
  ContentDefinitionHistory: () => null,
}));
vi.mock(
  '../../src/components/contentStudio/ContentEnvironmentLifecycle.jsx',
  () => ({ default: () => null }),
);
vi.mock(
  '../../src/components/contentStudio/CampaignContentBindingLifecycle.jsx',
  () => ({ default: () => null }),
);
vi.mock('../../src/components/compendium/Dependencies.jsx', () => ({
  DependencySummary: () => null,
  DependenciesSection: ({ setDraft }) => (
    <button
      type="button"
      onClick={() => setDraft(current => ({
        ...current,
        requires: ['custom:linked-resource'],
      }))}
    >
      Add test dependency
    </button>
  ),
}));
vi.mock('../../src/components/primitives/CategorySelect.jsx', () => ({
  default: () => null,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  delete storeState.activeContentEnvironmentContent;
});

describe('manual custom-content taste gate', () => {
  it('invalidates a successful sample when the admitted draft changes', async () => {
    const activeEnvironmentContent = {
      institutions: [{ name: 'Pinned Baseline Hall' }],
    };
    storeState.activeContentEnvironmentContent = activeEnvironmentContent;
    previewRef.fn = vi.fn(async request => ({
      schemaVersion: 1,
      seed: request.seed,
      saved: false,
      diff: {
        scalarChanges: [],
        materialized: {},
        addedExports: [],
      },
      forced: [],
      dormant: [],
    }));
    const { CustomContentManager } = await import(
      '../../src/components/compendium/CustomContent.jsx'
    );
    render(<CustomContentManager search="" />);

    fireEvent.click(screen.getByRole('button', {
      name: /add custom institution/i,
    }));
    const name = document.querySelector('#ccm-field-name');
    fireEvent.change(name, { target: { value: 'Astral Observatory' } });

    const commit = screen.getByRole('button', {
      name: /add versioned definition/i,
    });
    expect(commit.disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', {
      name: /forge unsaved sample/i,
    }));
    await screen.findByTestId('content-sample-receipt');
    expect(commit.disabled).toBe(false);
    expect(previewRef.fn.mock.calls[0][0].baseContent)
      .toBe(activeEnvironmentContent);

    fireEvent.change(name, { target: { value: 'Astral Orrery' } });
    await waitFor(() => {
      expect(commit.disabled).toBe(true);
      expect(screen.queryByTestId('content-sample-receipt')).toBeNull();
    });
  });

  it('reviews and commits dependency fields registered outside the scalar form', async () => {
    previewRef.fn = vi.fn(async request => ({
      schemaVersion: 1,
      seed: request.seed,
      saved: false,
      diff: {
        scalarChanges: [],
        materialized: {},
        addedExports: [],
      },
      forced: [],
      dormant: [],
    }));
    storeState.applyCustomContentCommand.mockResolvedValue({
      ok: true,
      status: 'applied',
      persistence: { state: 'confirmed' },
    });
    const { CustomContentManager } = await import(
      '../../src/components/compendium/CustomContent.jsx'
    );
    render(<CustomContentManager search="" />);

    fireEvent.click(screen.getByRole('button', {
      name: /add custom institution/i,
    }));
    fireEvent.change(document.querySelector('#ccm-field-name'), {
      target: { value: 'Linked Observatory' },
    });
    fireEvent.click(screen.getByRole('button', {
      name: /add test dependency/i,
    }));
    fireEvent.click(screen.getByRole('button', {
      name: /forge unsaved sample/i,
    }));
    await screen.findByTestId('content-sample-receipt');

    expect(previewRef.fn.mock.calls[0][0].accepted[0].entry.requires)
      .toEqual(['custom:linked-resource']);
    fireEvent.click(screen.getByRole('button', {
      name: /add versioned definition/i,
    }));
    await waitFor(() => {
      expect(storeState.applyCustomContentCommand).toHaveBeenCalledTimes(1);
    });
    expect(
      storeState.applyCustomContentCommand.mock.calls[0][0].entries[0].item.requires,
    ).toEqual(['custom:linked-resource']);
  });

  it('invalidates a manual sample when the active environment changes', async () => {
    previewRef.fn = vi.fn(async request => ({
      schemaVersion: 1,
      seed: request.seed,
      saved: false,
      diff: {
        scalarChanges: [],
        materialized: {},
        addedExports: [],
      },
      forced: [],
      dormant: [],
    }));
    const { CustomContentManager } = await import(
      '../../src/components/compendium/CustomContent.jsx'
    );
    const view = render(<CustomContentManager search="" />);

    fireEvent.click(screen.getByRole('button', {
      name: /add custom institution/i,
    }));
    fireEvent.change(document.querySelector('#ccm-field-name'), {
      target: { value: 'Environment Observatory' },
    });
    fireEvent.click(screen.getByRole('button', {
      name: /forge unsaved sample/i,
    }));
    await screen.findByTestId('content-sample-receipt');

    storeState.activeContentEnvironmentContent = {
      institutions: [{ name: 'A newly activated baseline' }],
    };
    view.rerender(<CustomContentManager search="" />);

    await waitFor(() => {
      expect(screen.queryByTestId('content-sample-receipt')).toBeNull();
      expect(screen.getByRole('button', {
        name: /add versioned definition/i,
      }).disabled).toBe(true);
    });
  });

  it('fails closed when the immutable command writer is unavailable', async () => {
    previewRef.fn = vi.fn(async request => ({
      schemaVersion: 1,
      seed: request.seed,
      saved: false,
      diff: {
        scalarChanges: [],
        materialized: {},
        addedExports: [],
      },
      forced: [],
      dormant: [],
    }));
    const commandWriter = storeState.applyCustomContentCommand;
    storeState.applyCustomContentCommand = undefined;
    try {
      const { CustomContentManager } = await import(
        '../../src/components/compendium/CustomContent.jsx'
      );
      render(<CustomContentManager search="" />);

      fireEvent.click(screen.getByRole('button', {
        name: /add custom institution/i,
      }));
      fireEvent.change(document.querySelector('#ccm-field-name'), {
        target: { value: 'Unwritten Observatory' },
      });
      fireEvent.click(screen.getByRole('button', {
        name: /forge unsaved sample/i,
      }));
      await screen.findByTestId('content-sample-receipt');
      fireEvent.click(screen.getByRole('button', {
        name: /add versioned definition/i,
      }));

      expect((await screen.findByRole('alert')).textContent).toMatch(
        /immutable content writer is unavailable/i,
      );
      expect(storeState.addCustomItem).not.toHaveBeenCalled();
    } finally {
      storeState.applyCustomContentCommand = commandWriter;
    }
  });
});
