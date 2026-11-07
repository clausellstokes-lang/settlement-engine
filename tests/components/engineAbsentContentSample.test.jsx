/**
 * @vitest-environment jsdom
 */
/**
 * engineAbsentContentSample.test.jsx — the custom-content sample in a build that carries no
 * engine (ENGINE-5 unit 2, path c).
 *
 * The sample worker forges with reviewed homebrew, which the engine service does not take, and
 * a VITE_ENGINE_REMOTE build's worker reaches only the refusing twin. In that build the
 * "Forge unsaved sample" control is the launch teaser for a non-staff viewer and, for staff,
 * the path's one plain sentence lands where the sample's failure lands; the worker is never
 * started either way. Both hosts: the Surveyor's CustomContentPanel and the compendium editor.
 */
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { storeRef, compileRef, previewRef } = vi.hoisted(() => ({
  storeRef: { current: {} },
  compileRef: { fn: null },
  previewRef: { fn: null },
}));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeRef.current); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeRef.current;
  return { useStore };
});
vi.mock('../../src/hooks/useRoute.js', () => ({ useRoute: () => ({ view: 'home', params: {} }), navigate: () => {} }));
vi.mock('../../src/lib/surveyorWrite.js', () => ({ compileCustomContent: (...a) => compileRef.fn(...a) }));
vi.mock('../../src/lib/customContentPreviewClient.js', () => ({
  runCustomContentPreview: (...a) => previewRef.fn(...a),
}));
// The compendium's heavy neighbours, stubbed as tests/components/customContentManualTasteGate.test.jsx stubs them.
vi.mock('../../src/components/compendium/ContentPackBar.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/compendium/SupplyChainsManager.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/compendium/PantheonActivationStrip.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/compendium/FactionEventBanner.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/contentStudio/CustomContentLifecycle.jsx', () => ({
  ArchivedContentLibrary: () => null,
  ContentDefinitionHistory: () => null,
}));
vi.mock('../../src/components/contentStudio/ContentEnvironmentLifecycle.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/contentStudio/CampaignContentBindingLifecycle.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/compendium/Dependencies.jsx', () => ({
  DependencySummary: () => null,
  DependenciesSection: () => null,
}));
vi.mock('../../src/components/primitives/CategorySelect.jsx', () => ({ default: () => null }));

import CustomContentPanel from '../../src/components/surveyor/CustomContentPanel.jsx';
import { CustomContentManager } from '../../src/components/compendium/CustomContent.jsx';
import { AVAILABLE_AT_LAUNCH } from '../../src/components/primitives/AvailableAtLaunchPill.jsx';
import { CONTENT_PREVIEW_ABSENT } from '../../src/lib/engineAbsentPaths.js';

const DRAFT = {
  entries: [{
    bucket: 'institutions',
    entry: { name: 'The Ashford Ring', essential: true },
    fieldLabels: [{ field: 'name', kind: 'flavor' }, { field: 'essential', kind: 'mechanical' }],
    label: 'inferred', rationale: 'You asked for a smuggling ring.', sourced: false,
  }],
  unsupported: [],
};
const EMPTY_LIBRARY = {
  institutions: [], services: [], resources: [], stressors: [], tradeGoods: [],
  deities: [], traditions: [], factions: [], supplyChains: [],
};

function stateFor(staff) {
  return {
    settlement: null, savedSettlements: [], campaigns: [], activeCampaignId: null,
    selectedSettlementId: null, activeSaveId: null, creditBalance: 20,
    customContent: EMPTY_LIBRARY,
    isElevated: () => staff,
    addCustomItem: vi.fn(), updateCustomItem: vi.fn(), deleteCustomItem: vi.fn(),
    applyCustomContentCommand: vi.fn(),
    canUseCustomContent: () => true,
    auth: { tier: 'premium', user: { id: 'author' } },
    customContentLoading: false, customContentError: null, loadCustomContentFromCloud: vi.fn(),
  };
}

beforeEach(() => {
  compileRef.fn = vi.fn(async () => ({ ok: true, draft: DRAFT }));
  previewRef.fn = vi.fn(async () => { throw new Error('the worker must not start'); });
});
afterEach(() => { cleanup(); vi.unstubAllEnvs(); vi.clearAllMocks(); });

async function surveyorAtForge(staff) {
  storeRef.current = stateFor(staff);
  render(<CustomContentPanel />);
  fireEvent.change(screen.getByLabelText(/describe the custom content/i), { target: { value: 'a smuggling ring' } });
  fireEvent.click(screen.getByRole('button', { name: /draft it/i }));
  await waitFor(() => screen.getByTestId('content-entry-0'));
  fireEvent.click(screen.getByRole('button', { name: /approve this entry/i }));
  fireEvent.click(screen.getByRole('button', { name: /inspect effect map/i }));
  return screen.getByRole('button', { name: /forge unsaved sample/i });
}

function compendiumAtForge(staff) {
  storeRef.current = stateFor(staff);
  render(<CustomContentManager search="" />);
  fireEvent.click(screen.getByRole('button', { name: /add custom institution/i }));
  fireEvent.change(document.querySelector('#ccm-field-name'), { target: { value: 'Astral Observatory' } });
  return screen.getByRole('button', { name: /forge unsaved sample/i });
}

describe('the Surveyor\'s content sample in a build without an engine', () => {
  it('non-staff: the forge control is the launch teaser; its click opens the dialog and starts no worker', async () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    const forge = await surveyorAtForge(false);
    expect(forge.getAttribute('data-launch-gated')).toBe('');
    fireEvent.click(forge);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.textContent).toContain(AVAILABLE_AT_LAUNCH);
    expect(dialog.textContent).toContain(CONTENT_PREVIEW_ABSENT);
    expect(previewRef.fn).not.toHaveBeenCalled();
  });

  it('staff: the path sentence is the sample\'s failure; no worker starts', async () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    const forge = await surveyorAtForge(true);
    expect(forge.hasAttribute('data-launch-gated')).toBe(false);
    fireEvent.click(forge);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe(CONTENT_PREVIEW_ABSENT));
    expect(previewRef.fn).not.toHaveBeenCalled();
  });
});

describe('the compendium editor\'s content sample in a build without an engine', () => {
  it('non-staff: the forge control is the launch teaser; its click opens the dialog and starts no worker', async () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    const forge = compendiumAtForge(false);
    expect(forge.getAttribute('data-launch-gated')).toBe('');
    fireEvent.click(forge);
    const dialog = await screen.findByRole('dialog');
    expect(dialog.textContent).toContain(CONTENT_PREVIEW_ABSENT);
    expect(previewRef.fn).not.toHaveBeenCalled();
  });

  it('staff: the path sentence is the sample\'s failure; no worker starts', async () => {
    vi.stubEnv('VITE_ENGINE_REMOTE', 'true');
    const forge = compendiumAtForge(true);
    expect(forge.hasAttribute('data-launch-gated')).toBe(false);
    fireEvent.click(forge);
    await waitFor(() => expect(screen.getByText(CONTENT_PREVIEW_ABSENT)).toBeTruthy());
    expect(previewRef.fn).not.toHaveBeenCalled();
  });

  it('flag off: the forge control is plain and reaches the worker', async () => {
    const forge = compendiumAtForge(false);
    expect(forge.hasAttribute('data-launch-gated')).toBe(false);
    fireEvent.click(forge);
    await waitFor(() => expect(previewRef.fn).toHaveBeenCalledTimes(1));
  });
});
