/**
 * @vitest-environment jsdom
 *
 * tests/ui/settlementDetailPdfThreading.test.jsx — W4f dead-path fix pin.
 *
 * THE DEFECT THIS PINS AGAINST: the premium PDF "Faith & War" chapter is gated
 * by faithChapterVisible (variants.js) on `faithUnlocked && hasLiveWorld` — but
 * SettlementDetail's handlePdfExport never threaded `campaign` or
 * `faithUnlocked` to generateSettlementPDF, so a PREMIUM user exporting a canon
 * campaign settlement never received the chapter they paid for (dead-pathed in
 * the safe direction).
 *
 * Pins, via a mounted SettlementDetail driving a mocked generateSettlementPDF:
 *   (a) premium + campaign membership → faithUnlocked:true and a `campaign`
 *       payload with a PLAIN-OBJECT nameById (F41: NO function-valued field
 *       anywhere in the options — a nameFor function would DataCloneError the
 *       worker postMessage and silently demote every export to the main-thread
 *       fallback). Membership is String-normalized (number/string id mixes).
 *   (b) free / anon → faithUnlocked:false, and the threaded value keeps
 *       faithChapterVisible shut. The gate stays load-bearing.
 *
 * Idioms follow tests/ui/settlementdetail.smoke.test.jsx: mocked store
 * singleton + mocked analytics; ExportSheet is mocked down to a button that
 * fires onExport so the export path runs without the picker chrome.
 */

import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { faithChapterVisible } from '../../src/pdf/variants.js';

afterEach(cleanup);

// Analytics is fire-and-forget; stub it so the mount path stays quiet.
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_t, k) => String(k) }),
}));

// Pricing moments fire after a canon export — stub so no localStorage/upsell
// wiring runs inside the test.
vi.mock('../../src/lib/pricingMoments.js', () => ({
  triggerPricingMoment: vi.fn(),
}));

// The unit under test is handlePdfExport's OPTIONS, not the PDF render.
// vi.mock intercepts SettlementDetail's dynamic import of this module too.
const generateSettlementPDF = vi.fn(() => Promise.resolve());
vi.mock('../../src/utils/generateSettlementPDF.js', () => ({
  generateSettlementPDF: (...args) => generateSettlementPDF(...args),
}));

// ExportSheet → a bare trigger so the test can fire onExport without driving
// the variant-picker chrome.
vi.mock('../../src/components/settlement/ExportSheet.jsx', () => ({
  default: ({ onExport }) => (
    <button data-testid="mock-export-trigger" onClick={() => onExport('canon_dossier')}>
      export
    </button>
  ),
}));

// Store mock — a mutable singleton drives every selector; useStore.getState()
// returns it for handlePdfExport's imperative reads. Reset per test.
const storeState = {};
const baseState = () => ({
  hydrateAiFromSave: vi.fn(),
  hydrateFromSave: vi.fn(),
  revertCurrentToRaw: vi.fn(() => Promise.resolve()),
  clearAiSettlement: vi.fn(),
  aiSettlement: null,
  aiDailyLife: null,
  phase: 'canon',
  editMode: false,
  toggleEditMode: vi.fn(),
  isSettlementEdited: () => false,
  countSettlementEdits: () => 0,
  auth: { tier: 'anon', user: null },
  isElevated: () => false,
  setPurchaseModalOpen: vi.fn(),
  setEditMode: vi.fn(),
  systemState: {},
  eventLog: [],
  isFounder: () => false,
  markExported: vi.fn(),
  // The live campaign world this fix threads. settlementIds mixes a string and
  // a NUMBER on purpose — membership and nameById must String-normalize.
  campaigns: [
    {
      id: 'c1',
      name: 'The Ember March',
      settlementIds: ['save-1', 2],
      worldState: { canonizedAt: '2026-01-01T00:00:00.000Z', tick: 12 },
      regionalGraph: { edges: [] },
    },
    // A second campaign this save does NOT belong to — must not be picked.
    { id: 'c2', name: 'Elsewhere', settlementIds: ['save-9'], worldState: { canonizedAt: 'x' } },
  ],
  savedSettlements: [
    { id: 'save-1', name: 'Stoneford', settlement: { id: 'save-1', name: 'Stoneford' } },
    { id: 2, settlement: { id: 2, name: 'Mossbridge' } },
    // Non-member — must be filtered OUT of campaign.settlements / nameById.
    { id: 'save-9', name: 'Farhold', settlement: { id: 'save-9', name: 'Farhold' } },
  ],
});

beforeEach(() => {
  generateSettlementPDF.mockClear();
  for (const k of Object.keys(storeState)) delete storeState[k];
  Object.assign(storeState, baseState());
});

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

const detail = {
  name: 'Stoneford',
  settlement: { id: 'save-1', name: 'Stoneford', npcs: [], factions: [], neighbourNetwork: [] },
  saveData: { id: 'save-1' },
  config: {},
  institutionToggles: {},
  categoryToggles: {},
};

const noop = () => {};

async function mountAndExport() {
  const SettlementDetail = (await import('../../src/components/SettlementDetail.jsx')).default;
  const utils = render(
    <SettlementDetail
      detail={detail}
      setDetail={noop}
      saves={[]}
      _setSaves={noop}
      linking={false}
      setLinking={noop}
      editNamesOpen={false}
      setEditNamesOpen={noop}
      handleLink={noop}
      removeNeighbour={noop}
      applyRename={noop}
      onLoad={noop}
    />,
  );
  fireEvent.click(utils.getAllByTestId('mock-export-trigger')[0]);
  await waitFor(() => expect(generateSettlementPDF).toHaveBeenCalledTimes(1));
  return generateSettlementPDF.mock.calls[0];
}

/** Deep-walk for function-valued fields — the F41 worker-cloneability pin. */
function findFunctionPaths(value, path = 'options', out = [], seen = new Set()) {
  if (typeof value === 'function') {
    out.push(path);
    return out;
  }
  if (!value || typeof value !== 'object' || seen.has(value)) return out;
  seen.add(value);
  for (const [k, v] of Object.entries(value)) {
    findFunctionPaths(v, `${path}.${k}`, out, seen);
  }
  return out;
}

describe('SettlementDetail handlePdfExport — W4f campaign/faith threading', () => {
  test('premium + campaign membership threads faithUnlocked:true and a plain-data campaign (nameById, never nameFor)', async () => {
    storeState.auth = { tier: 'premium', user: { id: 'u1' } };
    const [settlementArg, options] = await mountAndExport();

    expect(settlementArg).toBe(detail.settlement);
    expect(options.faithUnlocked).toBe(true);
    expect(options.variant).toBe('canon_dossier');

    // The owning campaign resolved by String-normalized membership.
    const c = options.campaign;
    expect(c).toBeTruthy();
    expect(c.settlementId).toBe('save-1');
    expect(c.worldState).toBe(storeState.campaigns[0].worldState);
    expect(c.regionalGraph).toBe(storeState.campaigns[0].regionalGraph);

    // Members only (string 'save-1' + NUMBER 2), non-member 'save-9' excluded.
    expect(c.settlements.map(e => String(e.id)).sort()).toEqual(['2', 'save-1']);

    // nameById is a PLAIN OBJECT keyed by String(id) — not a Map, not a function.
    expect(Object.getPrototypeOf(c.nameById)).toBe(Object.prototype);
    expect(c.nameById).toEqual({ 'save-1': 'Stoneford', 2: 'Mossbridge' });
    expect(c.nameFor).toBeUndefined();

    // F41: NOTHING function-valued crosses generateSettlementPDF's options —
    // a function would DataCloneError the worker postMessage.
    expect(findFunctionPaths(options)).toEqual([]);
    // And the whole options bag survives an actual structured clone.
    expect(() => structuredClone(options)).not.toThrow();
  });

  test('free / anon export threads faithUnlocked:false — the chapter gate stays shut', async () => {
    storeState.auth = { tier: 'anon', user: null };
    const [, options] = await mountAndExport();

    expect(options.faithUnlocked).toBe(false);
    // Close the loop on the gate itself: even with the live world threaded
    // (hasLiveWorld true), the value this export path passed keeps the
    // Faith & War chapter hidden.
    expect(faithChapterVisible({
      variant: 'canon_dossier',
      phase: 'canon',
      hasLiveWorld: !!options.campaign,
      faithUnlocked: options.faithUnlocked,
    })).toBe(false);
    // Still plain data on the free path too.
    expect(findFunctionPaths(options)).toEqual([]);
  });

  test('a settlement outside every campaign threads campaign:null (byte-identical off-state)', async () => {
    storeState.campaigns = [
      { id: 'c2', name: 'Elsewhere', settlementIds: ['save-9'], worldState: { canonizedAt: 'x' } },
    ];
    storeState.auth = { tier: 'premium', user: { id: 'u1' } };
    const [, options] = await mountAndExport();

    expect(options.campaign).toBeNull();
    // Premium alone doesn't conjure a chapter — no live world, no chapter.
    expect(faithChapterVisible({
      variant: 'canon_dossier',
      phase: 'canon',
      hasLiveWorld: !!options.campaign,
      faithUnlocked: options.faithUnlocked,
    })).toBe(false);
  });
});
