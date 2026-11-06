/** @vitest-environment jsdom */
/**
 * exportLaunchTeaserMapPack.test.jsx - the realm map's "Download map (PNG)" and the compendium's
 * content-pack "Export" are export buttons too.
 *
 * THE OWNER (2026-11-03): "Oh and export (outside of gallery) buttons are not to work are to say
 * available at launch and have the purple gold combination as well." / "In essence for right
 * now. Anyone that is not a developer can only have access to the free account version." /
 * "Actually change it. Every purple gold button should say what ot is but have a pill once
 * hovered that says available at launch. Or opens a pop up ..." The chair (2026-11-03): gate
 * these two as well, with the same staff and launched exceptions.
 *
 * Non-staff, closed build: label kept, launch skin, described by the pill, a click opens the
 * Available-at-launch dialog and the export never runs (the map's handler spy; the pack's
 * URL.createObjectURL, the first step of its download). The map's More menu stays open beneath
 * the dialog. Staff, and an open build: the export runs.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

const { storeRef, gate } = vi.hoisted(() => ({ storeRef: { current: {} }, gate: { open: false } }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeRef.current);
  useStore.getState = () => storeRef.current;
  useStore.subscribe = () => () => {};
  return { useStore };
});
vi.mock('../../src/lib/launchGate.js', () => ({
  purchasesOpen: () => gate.open,
  PURCHASES_CLOSED_CODE: 'purchases_not_open',
  purchasesClosedError: () => new Error('closed'),
}));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import { WorldMapToolbar } from '../../src/components/map/WorldMapToolbar.jsx';
import ContentPackBar from '../../src/components/compendium/ContentPackBar.jsx';

const PILL = 'Available at launch';
const createObjectURL = vi.fn(() => 'blob:pack');

beforeEach(() => {
  gate.open = false;
  URL.createObjectURL = createObjectURL;
  URL.revokeObjectURL = vi.fn();
});
afterEach(() => { cleanup(); vi.clearAllMocks(); });

function account(staff) {
  storeRef.current = {
    auth: { tier: 'premium', user: { id: 'u1' } },
    isElevated: () => staff,
    mapMode: 'view', setMapMode: vi.fn(), mapLoading: false, mapError: null,
    mapState: { customBackdrop: null },
    customContent: { institutions: [{ name: 'Dragonbone Foundry', localUid: 'lu_1' }] },
    activeContentEnvironment: { tunables: {}, visualSelection: {} },
    applyCustomContentCommand: vi.fn(), getInstalledContentPackState: vi.fn(() => null),
    previewCustomContentEnvironmentMigration: vi.fn(), migrateCustomContentEnvironment: vi.fn(),
  };
}

const TOOLBAR = {
  canManageCampaigns: true,
  activeCampaign: { id: 'c1', name: 'Realm', worldState: {} },
  activeCampaignId: 'c1', handleSelectCampaign: vi.fn(), activeCampaigns: [{ id: 'c1', name: 'Realm' }],
  handleSaveMapToCampaign: vi.fn(), handleClearMapFromCampaign: vi.fn(), savingMap: false,
  setShowSimulationRules: vi.fn(), showSimulationRules: false, worldPulseInterval: 'one_year',
  setWorldPulseInterval: vi.fn(), handleAdvanceRealm: vi.fn(), worldPulseBusy: false, canUndoPulse: false,
  handleUndoRealm: vi.fn(), setShowLayersPanel: vi.fn(), showLayersPanel: false, setTourOpen: vi.fn(),
  handleClearImage: vi.fn(), handleImportImage: vi.fn(), handleShareMap: vi.fn(), sharingMap: false,
  mapTemplates: [], currentTemplate: '', handleTemplateChange: vi.fn(), handleFit: vi.fn(),
  handleRegenerate: vi.fn(), inspectorOpen: false, onToggleInspector: vi.fn(), unreviewedCount: 0,
};

const CONTROLS = {
  'WorldMapToolbar :: Download map (PNG)': () => {
    const handleExportMap = vi.fn();
    render(<WorldMapToolbar {...TOOLBAR} handleExportMap={handleExportMap} exportingMap={false} />);
    fireEvent.click(screen.getByRole('button', { name: /More/ }));
    return { control: screen.getByRole('button', { name: /Download map \(PNG\)/ }), label: 'Download map (PNG)', fired: () => handleExportMap.mock.calls.length };
  },
  'ContentPackBar :: Export': () => {
    render(<ContentPackBar />);
    return { control: screen.getByRole('button', { name: /^Export/ }), label: 'Export', fired: () => createObjectURL.mock.calls.length };
  },
};

function description(control) {
  return (control.getAttribute('aria-describedby') || '').split(' ')
    .map(id => document.getElementById(id)?.textContent || '').join(' ');
}

describe('map PNG and content-pack export, NON-STAFF, before launch', () => {
  for (const [name, mount] of Object.entries(CONTROLS)) {
    it(`${name}: keeps its label, wears the launch skin, the pill describes it, a click opens the launch dialog and the export never runs`, () => {
      account(false);
      const { control, label, fired } = mount();
      expect(control.textContent).toContain(label);
      expect(control.textContent).not.toContain(PILL); // anchored: the line above reads the control's own label in this same text
      expect(control.disabled).toBe(false);
      expect(control.getAttribute('data-skin')).toBe('launch');
      expect(description(control)).toContain(PILL);
      fireEvent.click(control);
      const dialog = screen.getByRole('dialog', { name: PILL });
      expect(fired()).toBe(0);
      // A press inside the dialog leaves its host (the map's More menu) open beneath it.
      fireEvent.mouseDown(dialog);
      fireEvent.click(screen.getByRole('button', { name: 'OK' }));
      expect(screen.queryByRole('dialog')).toBeNull();
      expect(screen.getByRole('button', { name: new RegExp(label.replace(/[()]/g, '\\$&')) })).toBeTruthy();
    });
  }
});

describe('map PNG and content-pack export, STAFF, before launch: they work', () => {
  for (const [name, mount] of Object.entries(CONTROLS)) {
    it(`${name}: no launch skin, no pill, the export runs`, () => {
      account(true);
      const { control, fired } = mount();
      expect(control.getAttribute('data-skin')).not.toBe('launch');
      expect(description(control)).not.toContain(PILL); // anchored: the gated arm above reads PILL through this same description() on these mounts
      fireEvent.click(control);
      expect(screen.queryByRole('dialog', { name: PILL })).toBeNull();
      expect(fired()).toBe(1);
    });
  }
});

describe('map PNG and content-pack export, NON-STAFF, purchases OPEN: they work', () => {
  for (const [name, mount] of Object.entries(CONTROLS)) {
    it(`${name}: no launch skin, no pill, the export runs`, () => {
      gate.open = true;
      account(false);
      const { control, fired } = mount();
      expect(control.getAttribute('data-skin')).not.toBe('launch');
      fireEvent.click(control);
      expect(screen.queryByRole('dialog', { name: PILL })).toBeNull();
      expect(fired()).toBe(1);
    });
  }
});
