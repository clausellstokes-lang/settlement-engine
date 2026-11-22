/** @vitest-environment jsdom */
/**
 * exportLaunchTeaser.test.jsx - every export control outside the gallery, before launch.
 *
 * THE OWNER (2026-11-03), three words in order:
 *   "Oh and export (outside of gallery) buttons are not to work are to say available at launch
 *    and have the purple gold combination as well."
 *   "In essence for right now. Anyone that is not a developer can only have access to the free
 *    account version."
 *   "Actually change it. Every purple gold button should say what ot is but have a pill once
 *    hovered that says available at launch. Or opens a pop up ( everything outside of the pop up
 *    goes dark opaque) that in theme that says available at launch. They can click an okay
 *    button or the close button to the pop up or outside if the pop up to close it and continue
 *    on."
 *
 * For a NON-STAFF account in a closed build each control keeps its own label, wears the launch
 * skin, is not disabled, is described by the "Available at launch" pill, and a click opens the
 * Available-at-launch dialog while its real handler never fires (a spy, or the synchronous
 * PDF_EXPORT_CLICKED intent every PDF export emits first). For a STAFF account, and in an OPEN
 * build for anyone, each control works as before.
 */
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';

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
vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true, supabase: null }));
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn(), paidAction: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));
// ExportDraftButton's real handler opens the variant sheet; the stand-in records that it did.
const { sheetOpened } = vi.hoisted(() => ({ sheetOpened: { count: 0 } }));
vi.mock('../../src/components/settlement/ExportSheet.jsx', () => ({
  default: (props) => { if (props.open) sheetOpened.count += 1; return null; },
}));
vi.mock('../../src/utils/generateSettlementPDF.js', () => ({ generateSettlementPDF: vi.fn(() => Promise.resolve()), default: vi.fn(() => Promise.resolve()) }));

import { track } from '../../src/lib/analytics.js';
import { SettlementCard } from '../../src/components/settlements/SettlementCard.jsx';
import { CampaignFolder } from '../../src/components/settlements/CampaignFolder.jsx';
import BulkActionBar from '../../src/components/settlements/BulkActionBar.jsx';
import SettlementDetailActions from '../../src/components/settlementDetail/SettlementDetailActions.jsx';
import NextActionRail from '../../src/components/settlement/NextActionRail.jsx';
import ExportDraftButton from '../../src/components/generate/ExportDraftButton.jsx';

afterEach(() => { cleanup(); vi.clearAllMocks(); });
beforeEach(() => { gate.open = false; sheetOpened.count = 0; });

/** Let a lazy chunk and a dynamic import settle. */
const settle = () => act(async () => { for (let i = 0; i < 5; i += 1) await new Promise(r => setTimeout(r, 0)); });

const PILL = 'Available at launch';
const SETTLEMENT = Object.freeze({ id: 'f1', name: 'Stoneford', tier: 'town', npcs: [], factions: [], neighbourNetwork: [] });

/** A premium owner (every non-staff export door open), staff or not. */
function owner(staff) {
  storeRef.current = {
    auth: { tier: 'premium', user: { id: 'u1' } },
    isElevated: () => staff, canExport: () => true, canSave: () => true,
    dossierEntitlements: {}, refreshDossierEntitlement: () => {}, setActiveSaveId: () => {},
    phase: 'canon', eventLog: [], aiSettlement: null, aiDailyLife: null, settlement: SETTLEMENT,
    savedSettlements: [], campaigns: [], advanceInFlight: [], campaignMutationLocks: [],
    getSettlementDeletionBlock: () => null, getCampaignMutationBlock: () => null, getCampaignMembershipBlock: () => null,
    isAdvanceInFlight: () => false, isCampaignMutationLocked: () => false, markExported: vi.fn(),
  };
}

/** Each export control: mount it, return the control and the spy its real handler reaches. */
const CONTROLS = {
  'SettlementCard :: frozen Export PDF': () => {
    const save = { id: 'f1', name: 'Stoneford', accessState: 'inactive_plan', settlement: SETTLEMENT, campaignState: { phase: 'canon', eventLog: [], locks: {} }, savedAt: 1 };
    render(<table><tbody><SettlementCard s={save} allModifiers={new Map()} onView={() => {}} deleteId={null} setDeleteId={() => {}} deleteConfirmed={() => {}} campaigns={[]} addToCampaign={() => {}} removeFromCampaign={() => {}} currentCampaignId={null} regionalCounts={{}} onReactivate={() => {}} canReactivate reactivatingId={null} onCanonize={() => {}} nameFor={String} onCreateCampaign={() => {}} onNavigate={() => {}} canManageCampaigns /></tbody></table>);
    return { control: screen.getByRole('button', { name: /^Export PDF/ }), label: 'Export PDF', fired: () => track.mock.calls.length };
  },
  'BulkActionBar :: Export JSON': () => {
    const exportBulk = vi.fn();
    render(<BulkActionBar bulk={{ selectedIds: new Set(['a']), exportBulk, addToCampaignBulk: vi.fn(), canonizeBulk: vi.fn(), setDeleteConfirm: vi.fn(), clear: vi.fn(), confirmDelete: vi.fn(), deleteConfirm: false, exportError: null }} campaigns={[]} canManageCampaigns={false} />);
    return { control: screen.getByRole('button', { name: /^Export JSON/ }), label: 'Export JSON', fired: () => exportBulk.mock.calls.length };
  },
  ...Object.fromEntries(['World Book', 'Player Book', 'Campaign PDF'].map((name) => [`CampaignFolder :: ${name}`, () => {
    render(<CampaignFolder campaign={{ id: 'c1', name: 'Realm', collapsed: true }} settlements={[{ id: 's1', name: 'A', settlement: SETTLEMENT }]} canManageCampaigns toggleCollapsed={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /Books and export/ }));
    return { control: screen.getByRole('menuitem', { name: new RegExp(`^${name}`) }), label: name, fired: () => track.mock.calls.length };
  }])),
  'SettlementDetailActions :: Export Dossier': () => {
    const onOpenExportSheet = vi.fn();
    render(<SettlementDetailActions settlement={SETTLEMENT} saveId="s1" canEdit editMode toggleEditMode={() => {}} exportAllowed exporting={false} onOpenExportSheet={onOpenExportSheet} />);
    return { control: screen.getByRole('button', { name: /^Export Dossier/ }), label: 'Export Dossier', fired: () => onOpenExportSheet.mock.calls.length };
  },
  'NextActionRail :: Export rung': () => {
    const onExport = vi.fn();
    render(<NextActionRail settlement={SETTLEMENT} save={{ id: 's1' }} handlers={{ onExport }} canEdit />);
    return { control: screen.getByRole('button', { name: /^Export Dossier/ }), label: 'Export Dossier', fired: () => onExport.mock.calls.length };
  },
  'ExportDraftButton :: Export PDF': () => {
    render(<ExportDraftButton />);
    return { control: screen.getByRole('button', { name: /^Export PDF/ }), label: 'Export PDF', fired: () => sheetOpened.count };
  },
};

/** The text of the tooltip that describes the control. */
function description(control) {
  return (control.getAttribute('aria-describedby') || '').split(' ')
    .map(id => document.getElementById(id)?.textContent || '').join(' ');
}

describe('export controls outside the gallery, NON-STAFF, before launch', () => {
  for (const [name, mount] of Object.entries(CONTROLS)) {
    it(`${name}: keeps its label, wears the launch skin, the pill describes it, a click opens the launch dialog and the export never fires`, async () => {
      owner(false);
      const { control, label, fired } = mount();
      expect(control.textContent).toContain(label);
      expect(control.textContent).not.toContain(PILL); // anchored: the line above reads the control's own label in this same text
      expect(control.disabled).toBe(false);
      expect(control.getAttribute('data-skin') === 'launch' || control.getAttribute('data-launch-skin') === '').toBe(true);
      expect(description(control)).toContain(PILL);
      fireEvent.click(control);
      await settle();
      expect(screen.getByRole('dialog', { name: PILL })).toBeTruthy();
      expect(fired()).toBe(0);
      // OK closes the dialog, and its click ends there: the host (a menu, a folder header)
      // is left as it was, so the control is still on the page.
      fireEvent.mouseDown(screen.getByRole('dialog', { name: PILL }));
      fireEvent.click(screen.getByRole('button', { name: 'OK' }));
      expect(screen.queryByRole('dialog', { name: PILL })).toBeNull();
      expect(screen.getAllByRole(control.getAttribute('role') || 'button').some(b => b.textContent.includes(label))).toBe(true);
      expect(fired()).toBe(0);
    });
  }
});

describe('export controls, STAFF account, before launch: they work', () => {
  for (const [name, mount] of Object.entries(CONTROLS)) {
    it(`${name}: no launch skin, no pill, the export fires`, async () => {
      owner(true);
      const { control, fired } = mount();
      expect(control.getAttribute('data-skin')).not.toBe('launch');
      expect(description(control)).not.toContain(PILL); // anchored: the gated arm above reads PILL through this same description() on these mounts
      fireEvent.click(control);
      await settle();
      expect(screen.queryByRole('dialog', { name: PILL })).toBeNull();
      expect(fired()).toBeGreaterThan(0);
    });
  }
});

describe('export controls, NON-STAFF, purchases OPEN (launch): they work', () => {
  for (const [name, mount] of Object.entries(CONTROLS)) {
    it(`${name}: no launch skin, no pill, the export fires`, async () => {
      gate.open = true;
      owner(false);
      const { control, fired } = mount();
      expect(control.getAttribute('data-skin')).not.toBe('launch');
      expect(description(control)).not.toContain(PILL); // anchored: the gated arm above reads PILL through this same description() on these mounts
      fireEvent.click(control);
      await settle();
      expect(screen.queryByRole('dialog', { name: PILL })).toBeNull();
      expect(fired()).toBeGreaterThan(0);
    });
  }
});
