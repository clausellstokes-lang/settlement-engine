/** @vitest-environment jsdom */
/**
 * renameConsolidation.test.jsx — the single inline header rename (UX overhaul
 * Phase 6, plan §4.3). The three old settlement-name edit places collapse into
 * ONE inline edit on the dossier header. This pins:
 *   • In the saved-dossier editor (readOnly OutputContainer), allowRename +
 *     onRenameSettlement make the header name inline-editable, and a commit
 *     routes to onRenameSettlement (the consolidated applyRename('settlement', …)).
 *   • Without allowRename, the saved-dossier header name stays plain text.
 *
 * The read/edit surface split (2026-06-24) moved the read dossier OUT of edit
 * mode, so the inline settlement-rename was RELOCATED from the dossier header to
 * SettlementDetail's always-visible persistent header card's <h1>. The second
 * describe-block below pins that new home: in edit mode (owner) the header <h1>
 * is inline-editable and a commit routes through handleApplyRename('settlement',
 * …) → queueChange; it stays plain text in read mode and for free users.
 */

import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

import DossierHeaderRow from '../../src/components/dossier/DossierHeaderRow.jsx';

const settlement = { name: 'Stoneford', tier: 'town', population: 1200, config: {} };
const REROLLABLE = {};

afterEach(cleanup);

describe('Rename consolidation — single inline header edit', () => {
  it('ignores allowRename in the read-only viewer — the saved-editor inline rename is master-only', () => {
    // LINEAGE NOTE (master merge W6): RF's DossierHeaderRow has NO allowRename /
    // onRenameSettlement path (its signature is readOnly/queueEdit/settlement/…).
    // Inline settlement rename is gated purely on `!readOnly && queueEdit` — the
    // LIVE generation editor; the readOnly SAVED-dossier header stays plain text.
    // Master's "saved editor allowRename → onRenameSettlement" affordance is not on
    // this lineage, so passing allowRename must NOT make a readOnly header editable.
    const onRenameSettlement = vi.fn();
    render(
      <DossierHeaderRow
        readOnly
        queueEdit={null}
        settlement={settlement}
        saveId="save-1"
        REROLLABLE={REROLLABLE}
        allowRename
        onRenameSettlement={onRenameSettlement}
      />,
    );
    // No editable trigger — readOnly wins; allowRename is inert on RF.
    expect(screen.queryByRole('button', { name: /Edit settlement name/i })).toBeNull();
    expect(screen.getByText('Stoneford')).toBeTruthy();
    expect(onRenameSettlement).not.toHaveBeenCalled();
  });

  it('keeps the header name plain text in the read-only viewer (no allowRename)', () => {
    render(
      <DossierHeaderRow
        readOnly
        queueEdit={null}
        settlement={settlement}
        saveId="save-1"
        REROLLABLE={REROLLABLE}
      />,
    );
    // No editable trigger — the name is static.
    expect(screen.queryByRole('button', { name: /Edit settlement name/i })).toBeNull();
    expect(screen.getByText('Stoneford')).toBeTruthy();
  });

  it('falls back to queueEdit in the live editor (not readOnly, no allowRename)', () => {
    const queueEdit = vi.fn();
    render(
      <DossierHeaderRow
        readOnly={false}
        queueEdit={queueEdit}
        settlement={settlement}
        saveId="save-1"
        REROLLABLE={REROLLABLE}
      />,
    );
    const trigger = screen.getByRole('button', { name: /Edit settlement name/i });
    fireEvent.click(trigger);
    const input = screen.getByLabelText('Edit settlement name');
    fireEvent.change(input, { target: { value: 'Live Edit' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(queueEdit).toHaveBeenCalledWith('rename-settlement', { newName: 'Live Edit' });
  });
});

// ── Relocated home: the persistent header card's <h1> ────────────────────────
// A controllable store singleton drives every selector; queueChange is the sink
// the settlement-rename routes to for a non-simulated (standalone) save.
const queueChange = vi.fn();
const storeState = {
  hydrateAiFromSave: vi.fn(),
  hydrateFromSave: vi.fn(),
  revertCurrentToRaw: vi.fn(() => Promise.resolve()),
  clearAiSettlement: vi.fn(),
  aiSettlement: null,
  aiDailyLife: null,
  phase: 'draft',
  queueChange,
  canonize: vi.fn(),
  isSettlementClockBound: () => false, // standalone save → change-queue active
  editMode: true,
  toggleEditMode: vi.fn(),
  isSettlementEdited: () => false,
  countSettlementEdits: () => 0,
  auth: { tier: 'premium', user: { id: 'u1' } }, // owner → canEdit true
  isElevated: () => false,
  setPurchaseModalOpen: vi.fn(),
  setEditMode: vi.fn(),
  savedSettlements: [],
  systemState: {},
  eventLog: [],
  isFounder: () => false,
  requestNarrative: vi.fn(() => Promise.resolve()),
  markExported: vi.fn(),
  getCost: () => 1,
  credits: 0,
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

const headerDetail = {
  name: 'Stoneford',
  settlement: { name: 'Stoneford', npcs: [], factions: [], neighbourNetwork: [] },
  saveData: { id: 'save-1' },
  config: {},
  institutionToggles: {},
  categoryToggles: {},
};
const noop = () => {};

async function renderHeaderDetail() {
  vi.resetModules();
  const SettlementDetail = (await import('../../src/components/SettlementDetail.jsx')).default;
  return render(
    <SettlementDetail
      detail={headerDetail}
      setDetail={noop}
      saves={[]}
      linking={false}
      setLinking={noop}
      editNamesOpen={false}
      setEditNamesOpen={noop}
      handleLink={noop}
      removeNeighbour={noop}
      applyRename={noop}
    />,
  );
}

describe('Rename relocation — persistent header card <h1> (read/edit split)', () => {
  it('the persistent header name is plain text in edit mode — no inline-header settlement rename on RF', async () => {
    // LINEAGE NOTE (master merge W6): RF's SettlementDetail persistent header
    // renders the settlement name as a plain <span> (SettlementDetail.jsx:422), not
    // an inline-editable EditableInline. The master read/edit-split relocation
    // (header <h1> inline rename → handleApplyRename('settlement', …) → queueChange)
    // is not on this lineage: RF's Edit-Names panel renames only NPCs/factions, and
    // settlement rename lives in the LIVE editor's DossierHeaderRow queueEdit path.
    // So there is no "Edit settlement name" trigger in the persistent header,
    // edit mode or not, and no queueChange fires from just opening it.
    storeState.editMode = true;
    storeState.auth = { tier: 'premium', user: { id: 'u1' } };
    await renderHeaderDetail();
    expect(screen.queryByRole('button', { name: /Edit settlement name/i })).toBeNull();
    // The name still renders as static header text.
    expect(screen.getAllByText('Stoneford').length).toBeGreaterThan(0);
    expect(queueChange).not.toHaveBeenCalled();
  });

  it('the header name stays plain text for a free user (cannot edit) in read mode', async () => {
    queueChange.mockClear();
    storeState.editMode = false;
    storeState.auth = { tier: 'anon', user: null };
    await renderHeaderDetail();
    // No editable trigger — free users (and read mode) see static text.
    expect(screen.queryByRole('button', { name: /Edit settlement name/i })).toBeNull();
    // Restore the owner default for any later cases.
    storeState.editMode = true;
    storeState.auth = { tier: 'premium', user: { id: 'u1' } };
  });
});
