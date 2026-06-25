/**
 * aiSlice.protoPollutionAndDeadCode.test.js
 *
 * Three guards on the AI slice:
 *
 *   - Prototype-pollution (LOW): a streamed narrative field path of
 *     `__proto__.x` flows through setNestedPath into aiSettlement. Without the
 *     guard it writes THROUGH Object.prototype. The fix rejects
 *     __proto__/constructor/prototype segments before descending.
 *
 *   - Dead-code removal (MEDIUM): requestDailyLife was dead (no call sites) but
 *     issued a real paid spend; a future re-wire would double-charge. It is now
 *     removed — the action must no longer exist on the slice.
 *
 *   - Stale partial-failure banner (LOW): requestProgression must clear
 *     aiPartialFailure at START so a banner from a PRIOR partial run does not
 *     persist into the next progression. (Confirms requestNarrative parity.)
 */
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Controllable generate: resolves after the test inspects mid-flight state.
let gate;
let gateResolve;
function armGate() {
  gate = new Promise((res) => { gateResolve = res; });
}

vi.mock('../../src/lib/ai.js', () => ({
  generateNarrative: vi.fn(async (type, _settlement, _settlementId, opts = {}) => {
    if (type === 'narrative') {
      // Stream a hostile dotted path through onField — this is the setNestedPath
      // entry point the guard protects.
      opts.onField?.('__proto__.polluted', 'pwned');
      opts.onField?.('thesis', 'A clean thesis.');
      return {
        result: { thesis: 'A clean thesis.', name: 'Ashford' },
        dailyLife: null,
        creditsRemaining: 90,
        type: 'narrative',
        partialFailure: false,
        failedFields: [],
        succeededFields: [],
      };
    }
    // progression
    await gate;
    return {
      result: { thesis: 'Evolved.' },
      creditsRemaining: 90,
      type: 'progression',
      partialFailure: false,
      failedFields: [],
    };
  }),
}));

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(async () => ({})) },
}));

import { createAiSlice } from '../../src/store/aiSlice.js';

const settlement = {
  id: 'save.a', name: 'Ashford', tier: 'town', population: 2200,
  activeConditions: [], institutions: [], npcs: [],
};

function stubSlice() {
  return {
    activeSaveId: 'save.a',
    settlement,
    savedSettlements: [
      { id: 'save.a', name: 'Ashford', phase: 'canon', settlement, aiData: {} },
    ],
    campaigns: [],
    auth: { modelPreference: 'anthropic_claude_opus_4_8' },
    creditBalance: 100,
    isElevated: () => false,
    isPremium: () => true,
    setPurchaseModalOpen: () => {},
    updateSavedSettlement: vi.fn(),
    getCampaignForSettlement: () => null,
    _appendChronicleEntry: async () => {},
  };
}

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createAiSlice(...a) })));
}

describe('aiSlice — prototype pollution / dead code / stale banner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    armGate();
    delete Object.prototype.polluted;
  });

  test('a streamed __proto__ field path does not pollute Object.prototype', async () => {
    const store = makeStore();
    await store.getState().requestNarrative('save.a');

    // Guard held: nothing walked the prototype chain.
    expect(({}).polluted).toBeUndefined();
    expect(Object.prototype.polluted).toBeUndefined();
    // The legit narrative still committed.
    expect(store.getState().aiSettlement).toMatchObject({ thesis: 'A clean thesis.' });

    delete Object.prototype.polluted; // belt-and-suspenders cleanup
  });

  test('requestDailyLife is removed from the slice (dead paid-spend action)', () => {
    const store = makeStore();
    expect(store.getState().requestDailyLife).toBeUndefined();
  });

  test('requestProgression clears a stale aiPartialFailure banner at start', async () => {
    const store = makeStore();
    // A prior partial run left a banner up, and there is an existing narrative
    // to progress.
    store.setState((s) => {
      s.aiSettlement = { thesis: 'prior' };
      s.aiPartialFailure = { failedFields: ['npcs'] };
    });

    const pending = store.getState().requestProgression('save.a', {
      changeType: 'addStressor',
      changeLabel: 'A new pressure',
    });

    // Mid-flight (before the generate resolves), the stale banner must already
    // be cleared — it should NOT linger from the prior run.
    expect(store.getState().aiPartialFailure).toBeNull();

    gateResolve();
    await pending;
    expect(store.getState().aiPartialFailure).toBeNull();
  });
});
