/** @vitest-environment jsdom */
/**
 * npcRowLockToggle.test.jsx — the PER-CHARACTER lock control on the roster row.
 *
 * The locks engine has supported an id array under `locks.npcs` since Phase A
 * (domain/locksPreservation.js normalizes both forms; tests/store/locksEngine and
 * tests/generators/locksSurviveReroll pin the engine), but nothing let a person
 * name an individual. The roster row now can. What is only observable HERE is the
 * wiring and the legibility contract:
 *
 *   ARMS      — the row toggle writes that character's DURABLE id into locks.npcs,
 *               and takes it back out (the key disappears when the last one goes).
 *   SURVIVES  — a locked character comes through a roster reroll driven from the
 *               UI's own action, and the lock follows them to their new id.
 *   DISTINCT  — PIN and LOCK are two promises on one row. Pinning must not lock and
 *               locking must not pin, in either direction.
 *   SECTION   — when the whole roster is locked (the BOOLEAN form of the same key),
 *               the row reports that instead of writing an array over it. Writing
 *               the array would silently unlock the section.
 *   GATED     — the control is only offered to a viewer who may roll the roster,
 *               the same right the Reroll button needs.
 *
 * Uses the REAL store: the point of the test is that a click reaches the store's
 * own setLock and that the store's own regenSection honours what it wrote.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';

// The persist tail fires saves.update when a save is active. No active save here,
// so it is a documented no-op; stubbed anyway so nothing reaches the network.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { useStore } from '../../src/store/index.js';
import { NPCsTab } from '../../src/components/new/tabs/NPCsTab.jsx';

// Kept in lockstep with NPC_LOCK_COPY (src/components/new/npcComponents.jsx).
// Phase B widened the individual promise past "rerolls" to "any new roll" and
// gave the section line its boundary clause; these constants lagged that copy
// change. NOTE the ordering trap that hid it: the both-states test asserts the
// OPEN label first, so a stale LOCK_ON never got the chance to fail.
const LOCK_OPEN = 'Lock this person so they stay through any new roll.';
const LOCK_ON = 'Locked. This person stays through any new roll.';
const LOCK_SECTION = 'The whole roster is locked. Rerolls keep everyone; a brand-new settlement starts a new cast.';

/** A tiny hand-built roster — enough for the wiring assertions. */
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
});

function mount(overrides = {}) {
  const town = overrides.settlement || townOf(roster());
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
  const utils = render(<NPCsTab {...props} />);
  return { ...utils, props };
}

/** The row header button that carries this person's name. */
function rowFor(container, name) {
  const row = [...container.querySelectorAll('button')].find(b => b.textContent.includes(name));
  expect(row, `no roster row for ${name}`).toBeTruthy();
  return row;
}

/** The lock control inside that row (null when the affordance is withheld). */
function lockIn(row) {
  return row.querySelector('[role="button"][aria-label^="Lock"], [role="button"][aria-label^="The whole roster"]');
}

beforeEach(() => {
  useStore.setState({ locks: {}, settlement: null, savedSettlements: [], editMode: false, phase: 'draft' });
});
afterEach(() => {
  cleanup();
  useStore.setState({ locks: {} });
});

describe('ARMS — the row toggle writes and clears the id', () => {
  test('clicking the lock puts that character\'s durable id in locks.npcs', () => {
    const { container } = mount();
    fireEvent.click(lockIn(rowFor(container, 'Bran Smith')));
    expect(useStore.getState().locks.npcs).toEqual(['npc_1']);
  });

  test('a second character joins the same array rather than replacing it', () => {
    const { container } = mount();
    fireEvent.click(lockIn(rowFor(container, 'Bran Smith')));
    fireEvent.click(lockIn(rowFor(container, 'Alda Reeve')));
    expect([...useStore.getState().locks.npcs].sort()).toEqual(['npc_0', 'npc_1']);
  });

  test('clicking again disarms it, and the last one out removes the key entirely', () => {
    const { container } = mount();
    const lock = () => lockIn(rowFor(container, 'Bran Smith'));
    fireEvent.click(lock());
    expect(useStore.getState().locks.npcs).toEqual(['npc_1']);
    fireEvent.click(lock());
    expect(useStore.getState().locks.npcs).toBeUndefined();
  });

  test('the control says which promise it is making, in both states', () => {
    const { container } = mount();
    const before = lockIn(rowFor(container, 'Bran Smith'));
    expect(before.getAttribute('aria-label')).toBe(LOCK_OPEN);
    expect(before.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(before);
    const after = lockIn(rowFor(container, 'Bran Smith'));
    expect(after.getAttribute('aria-label')).toBe(LOCK_ON);
    expect(after.getAttribute('aria-pressed')).toBe('true');
  });

  test('a legacy NPC with no durable id gets no lock (an id is what the engine matches)', () => {
    const { container } = mount({
      settlement: townOf([{ name: 'Nameless Wanderer', influence: 'low' }]),
      npcs: [{ name: 'Nameless Wanderer', influence: 'low' }],
    });
    expect(lockIn(rowFor(container, 'Nameless Wanderer'))).toBeNull();
  });
});

describe('DISTINCT — pinning is not locking, in either direction', () => {
  test('locking a person does not pin them', () => {
    const { container, props } = mount();
    fireEvent.click(lockIn(rowFor(container, 'Bran Smith')));
    expect(props.onTogglePin).not.toHaveBeenCalled();
  });

  test('pinning a person does not lock them', () => {
    const { container, props } = mount();
    const row = rowFor(container, 'Bran Smith');
    const pin = [...row.querySelectorAll('[role="button"]')]
      .find(n => (n.getAttribute('title') || '').startsWith('Pin this NPC'));
    expect(pin, 'the pin affordance is still on the row').toBeTruthy();
    fireEvent.click(pin);
    expect(props.onTogglePin).toHaveBeenCalledWith('npc_1');
    expect(useStore.getState().locks.npcs).toBeUndefined();
  });

  test('the two controls never say each other\'s word', () => {
    const { container } = mount();
    const row = rowFor(container, 'Bran Smith');
    const lockLabel = lockIn(row).getAttribute('aria-label');
    const pinTitle = [...row.querySelectorAll('[role="button"]')]
      .map(n => n.getAttribute('title') || '')
      .find(t => t.startsWith('Pin this NPC'));
    expect(lockLabel.toLowerCase()).not.toContain('pin');
    expect(pinTitle.toLowerCase()).not.toContain('lock');
  });
});

describe('SECTION — the boolean form is reported, never overwritten', () => {
  test('a whole-roster lock reads locked on the row and the click is refused', () => {
    useStore.setState({ locks: { npcs: true } });
    const { container } = mount();
    const control = lockIn(rowFor(container, 'Bran Smith'));
    expect(control.getAttribute('aria-label')).toBe(LOCK_SECTION);
    expect(control.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(control);
    // Still the boolean. An array here would have unlocked the whole section.
    expect(useStore.getState().locks.npcs).toBe(true);
  });
});

describe('GATED — the control follows the roster authoring right', () => {
  test('a viewer who may not roll the roster is offered no lock', () => {
    const { container } = mount({ canAuthorNpc: false });
    expect(lockIn(rowFor(container, 'Bran Smith'))).toBeNull();
  });
});

describe('SURVIVES — the locked character comes through the UI reroll', () => {
  test('a locked NPC survives regenSection and the lock takes their new id', async () => {
    const { generateSettlementPipeline } = await import('../../src/generators/generateSettlementPipeline.js');
    const town = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
      null, { seed: 'npc-row-lock-ui', customContent: {} },
    );
    useStore.setState({ settlement: town, config: town.config, locks: {}, phase: 'draft' });
    const target = town.npcs[2];

    const { container } = mount({ settlement: town, npcs: town.npcs });
    fireEvent.click(lockIn(rowFor(container, target.name)));
    expect(useStore.getState().locks.npcs).toEqual([String(target.id)]);

    // The same action the row's Reroll button dispatches.
    await useStore.getState().regenSection('npcs');

    const after = useStore.getState();
    const survivor = after.settlement.npcs.find(n => String(n.name) === String(target.name));
    expect(survivor, 'the locked character survived the reroll').toBeTruthy();
    expect(after.locks.npcs).toEqual([String(survivor.id)]);
  }, 120_000);
});
