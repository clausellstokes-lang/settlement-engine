/** @vitest-environment jsdom */
/**
 * npcRowLockToggle.test.jsx — THE PADLOCKS ARE GONE, and a stored lock shows nothing.
 *
 * OWNER ORDER 2026-09-17 (after the "What a new roll keeps" section was removed):
 * "remove the other padlocks". This file used to pin the per-character padlock on the
 * roster row ("Lock this person so they stay through any new roll.") end to end. It
 * now pins the removal on every surface that carried a lock control, over the REAL
 * store holding a stored lock in each form, so a surviving branch would have
 * something to show:
 *
 *   ROW      — no roster row offers a padlock or speaks a lock sentence; the PIN, a
 *              different promise (the AI leaves the prose alone), stays beside it.
 *   NPCS     — the NPCs tab has no "Keep these people" / "Allow rerolls" control and
 *              no lock sentence; its Reroll stays, enabled, and dispatches.
 *   HISTORY  — the History tab has no "Keep this history" control; its Reroll stays.
 *   GATED    — a viewer who may not roll sees no Reroll, and no lock row either (the
 *              old section control rendered its sentence and button even then).
 *
 * (The file keeps its name so the registers that enumerate test files do not churn.)
 * The store half (the writers retired, a stored map read by nothing) is pinned in
 * tests/store/locksEngine.test.js.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';
import { useStore } from '../../src/store/index.js';
import { NPCsTab } from '../../src/components/new/tabs/NPCsTab.jsx';
import { HistoryTab } from '../../src/components/new/tabs/HistoryTab.jsx';

/** Every word the retired lock controls ever said, section and row. */
const RETIRED_LOCK_WORDS = Object.freeze([
  'Keep these people',
  'Keep this history',
  'Allow rerolls',
  'Lock this person so they stay through any new roll.',
  'Locked. This person stays through any new roll.',
  'The whole roster is locked. Rerolls keep everyone; a brand-new settlement starts a new cast.',
  'Rerolls can replace the people here.',
  'Rerolls can rewrite this history.',
  'Locked. Rerolls keep this history.',
]);

/** Each stored form a lock ever took, so a surviving control has state to render. */
const STORED_LOCK_MAPS = Object.freeze([
  { npcs: ['npc_1'] },
  { npcs: true, history: true },
]);

const roster = () => [
  { id: 'npc_0', name: 'Alda Reeve', role: 'reeve', influence: 'high', factionAffiliation: 'Council' },
  { id: 'npc_1', name: 'Bran Smith', role: 'smith', influence: 'low', factionAffiliation: 'Council' },
];

const townOf = (npcs) => ({
  id: 'town-1',
  name: 'Testford',
  npcs,
  relationships: [],
  powerStructure: { factions: [{ faction: 'Council', category: 'civic' }], conflicts: [] },
  history: {
    age: 140, founding: null, historicalCharacter: '', eventsTimeline: [], currentTensions: [], historicalEvents: [],
  },
});

function mountNpcs(overrides = {}) {
  const town = townOf(roster());
  const props = {
    npcs: town.npcs,
    settlement: town,
    narrativeNote: null,
    pinnedIds: new Set(),
    onTogglePin: vi.fn(),
    canAuthorNpc: true,
    onRerollNPCs: vi.fn(),
    ...overrides,
  };
  return { ...render(<NPCsTab {...props} />), props };
}

/** Every accessible name and title a control in the container carries, plus its text. */
function controlWords(container) {
  const nodes = [...container.querySelectorAll('button, [role="button"]')];
  return nodes.flatMap((node) => [
    node.textContent.trim(),
    node.getAttribute('aria-label') || '',
    node.getAttribute('title') || '',
  ]).filter(Boolean);
}

beforeEach(() => {
  useStore.setState({ locks: {}, settlement: null, savedSettlements: [], editMode: false, phase: 'draft' });
});
afterEach(() => {
  cleanup();
  useStore.setState({ locks: {} });
});

describe('ROW — no roster row carries a padlock (owner order 2026-09-17)', () => {
  test('a stored lock in either form puts no lock control on a row, while the pin stays', () => {
    for (const locks of STORED_LOCK_MAPS) {
      useStore.setState({ locks });
      const { container } = mountNpcs();
      const row = [...container.querySelectorAll('button')].find((b) => b.textContent.includes('Bran Smith'));
      expect(row, 'no roster row for Bran Smith').toBeTruthy();
      const rowControls = [...row.querySelectorAll('[role="button"]')];
      const names = rowControls.map((n) => n.getAttribute('aria-label') || n.getAttribute('title') || '');
      // THE ANCHOR is the pin, which lives in the same row header the padlock sat in.
      const pinTitle = names.find((t) => t.startsWith('Pin this NPC'));
      expect(pinTitle, 'the pin affordance is still on the row').toBeTruthy();
      expect(rowControls.length, `a second row control is back under ${JSON.stringify(locks)}`).toBe(1);
      for (const retired of RETIRED_LOCK_WORDS) {
        expectAbsentWithAnchor(names, retired, pinTitle, `row padlock copy under ${JSON.stringify(locks)}`);
      }
      cleanup();
    }
  });
});

describe('NPCS — the section lock is gone and the Reroll stays', () => {
  test('no lock control or sentence renders over a stored lock; the Reroll is enabled and dispatches', () => {
    for (const locks of STORED_LOCK_MAPS) {
      useStore.setState({ locks });
      const { container, props } = mountNpcs();
      const words = controlWords(container);
      // THE ANCHOR: the Reroll the section control used to wrap.
      expect(words).toContain('↺ Reroll');
      for (const retired of RETIRED_LOCK_WORDS) {
        expectAbsentWithAnchor(words, retired, '↺ Reroll', `NPCs tab under ${JSON.stringify(locks)}`);
        expectAbsentWithAnchor(container.textContent, retired, 'Key Figures', `NPCs tab text under ${JSON.stringify(locks)}`);
      }
      const reroll = [...container.querySelectorAll('button')].find((b) => b.textContent.trim() === '↺ Reroll');
      expect(reroll.disabled, `a stored ${JSON.stringify(locks)} still disarmed the Reroll`).toBe(false);
      fireEvent.click(reroll);
      expect(props.onRerollNPCs).toHaveBeenCalledTimes(1);
      cleanup();
    }
  });
});

describe('HISTORY — "Keep this history" is gone and the Reroll stays', () => {
  test('no lock control or sentence renders over a stored history lock', () => {
    useStore.setState({ locks: { history: true } });
    const onReroll = vi.fn();
    const { container } = render(<HistoryTab settlement={townOf(roster())} onReroll={onReroll} />);
    const words = controlWords(container);
    expect(words).toContain('↺ Reroll');
    for (const retired of RETIRED_LOCK_WORDS) {
      expectAbsentWithAnchor(words, retired, '↺ Reroll', 'History tab controls');
      expectAbsentWithAnchor(container.textContent, retired, 'Testford', 'History tab text');
    }
    const reroll = [...container.querySelectorAll('button')].find((b) => b.textContent.trim() === '↺ Reroll');
    expect(reroll.disabled).toBe(false);
    fireEvent.click(reroll);
    expect(onReroll).toHaveBeenCalledTimes(1);
  });
});

describe('GATED — a viewer who may not roll sees neither a Reroll nor a lock row', () => {
  test('the NPCs and History tabs without a reroll handler render no reroll and no lock copy', () => {
    useStore.setState({ locks: { npcs: true, history: true } });
    const npcs = mountNpcs({ onRerollNPCs: null, canAuthorNpc: false });
    const npcText = npcs.container.textContent;
    expectAbsentWithAnchor(npcText, '↺ Reroll', 'Key Figures', 'NPCs tab without a reroll handler');
    for (const retired of RETIRED_LOCK_WORDS) {
      expectAbsentWithAnchor(npcText, retired, 'Key Figures', 'NPCs tab lock copy without a reroll handler');
    }
    cleanup();
    const history = render(<HistoryTab settlement={townOf(roster())} onReroll={null} />);
    const historyText = history.container.textContent;
    expectAbsentWithAnchor(historyText, '↺ Reroll', 'Testford', 'History tab without a reroll handler');
    for (const retired of RETIRED_LOCK_WORDS) {
      expectAbsentWithAnchor(historyText, retired, 'Testford', 'History tab lock copy without a reroll handler');
    }
  });
});
