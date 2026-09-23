/** @vitest-environment jsdom */
/**
 * registryMount.test.jsx — EM-D3c's acceptance over THE MOUNT: the page of decrees hung at
 * the dossier's foot by `src/components/edit/EditModeShell.jsx`, and the bindings that are
 * the only reason it can show anything at all.
 *
 * ⛔ EM-D3 ALREADY PROVES THE PAGE. `tests/components/decreeRegistryPage.test.jsx` drives
 * the container over ten arms; nothing here re-proves a row's markup. What is measured here
 * is the JOIN — that the shell reaches the slice's own readers, binds EM-C4b's own verbs and
 * hands the page an address a reader can follow — because a page that renders perfectly out
 * of props nobody supplies is still a page no account can reach. That was the measured gap.
 *
 * ⛔ NOTHING HERE RE-TYPES A PRODUCER'S ANSWER, which is the same discipline EM-D3's suite
 * holds. The registry is built by EM-C1's OWN verbs (`stage`, `markApplied`, `withdraw`);
 * the moves and the withdrawal are read back off THE STORE the shell wrote through, never
 * off a spy; the gate is the landed `createAuthSlice` composed over this file's fixture, so
 * M3 measures `canEditSettlement()` exactly as it stands today (design §20.4, judgment 268);
 * and the chronicle address is held equal to EM-E2's OWN `decreeChronicleLine`, driven over
 * the very entry the page linked, so the shell's spelling of that grammar cannot drift from
 * the leaf that owns it.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY — set equalities against
 * `[]`, counts against numbers, and each absence measured beside a live presence in the same
 * arm — so no `// anchored:` marker is owed anywhere in this file, exactly as
 * tests/components/editModeShell.test.jsx does it.
 *
 * ⛔ THE FIRST-PAINT HALF IS NOT HERE AND CANNOT BE. Reading
 * `EAGER_FIRST_PAINT_MODULES` pulls vite's own esbuild binding, which refuses to load under
 * jsdom; the page joins the editor's LAZY closure through the shell, whose single
 * `lazy(() => import(...))` edge from `src/App.jsx` is pinned by editModeShell.test.jsx's A5
 * and priced by tests/build/vendorPdfLazy.test.js's editor-train arm. The count was measured
 * at this build and is quoted in the commit body.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { REGISTRY_ACTION_NAMES } from '../../src/components/edit/DecreeRegistryPage.jsx';
import { decreeChronicleLine } from '../../src/domain/display/stateProse/decreeProse.js';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { markApplied, stage, withdraw } from '../../src/domain/edit/registry.js';
import { createAuthSlice } from '../../src/store/authSlice.js';
import { STAFF_ROLES } from '../../src/lib/staffEntitlements.js';
import { t } from '../../src/copy/index.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHELL_PATH = 'src/components/edit/EditModeShell.jsx';
const SHELL_SOURCE = readFileSync(join(ROOT, SHELL_PATH), 'utf8');

const SAVE = 'save-1';
const T0 = '2026-09-23T10:00:00.000Z';
const T1 = '2026-09-23T11:00:00.000Z';

/** One op at the rigid shape `src/domain/edit/types.js` authors. */
const opOf = (type, kind, id) => Object.freeze({
  type,
  target: Object.freeze({ kind, id }),
  payload: Object.freeze({}),
  stage: 'home',
  consequence: 'home',
  requires: Object.freeze([]),
  enables: Object.freeze([]),
  relatedTo: Object.freeze([]),
  conflictsWith: Object.freeze([]),
  duration: null,
});

/**
 * THE RECORD. TWO people, because the reopen seam must open the door on the row the DECREE
 * NAMES rather than on the card's first subject — a fixture with one person could not tell
 * the two apart, and the shell's register opens on the first by design.
 */
const FIRST_NPC = 'npc-1';
const SECOND_NPC = 'npc-2';
const SECOND_NOTE = 'Owes the miller two sacks';
function recordOf(decrees) {
  return {
    id: SAVE,
    name: 'Stoneford',
    tier: 'town',
    culture: 'germanic',
    npcs: [
      { id: FIRST_NPC, name: 'Alda', role: 'Reeve', status: 'active', note: '' },
      { id: SECOND_NPC, name: 'Bern', role: 'Miller', status: 'active', note: SECOND_NOTE },
    ],
    institutions: [{ id: 'inst-1', name: 'The Mill', category: 'trade', state: 'sound' }],
    powerStructure: {
      governingName: 'Alda',
      factions: [{ id: 'fac-1', faction: 'The Guild', category: 'trade', power: 40 }],
    },
    config: { terrainType: 'plains', culture: 'germanic' },
    decrees,
  };
}

/**
 * THE REGISTRY UNDER TEST, BUILT BY EM-C1's OWN VERBS: two left waiting, one applied WITH a
 * recorded chronicle reference, one applied WITHOUT one, one withdrawn. The order indices are
 * the ones `stage` assigned, never numbers typed here.
 */
const REGISTRY = (() => {
  let rows = [];
  rows = stage(rows, opOf('set-field', 'npc', FIRST_NPC), { id: 'd_alpha', orderedAt: T0 });
  rows = stage(rows, opOf('set-field', 'npc', SECOND_NPC), { id: 'd_beta', orderedAt: T0 });
  rows = stage(rows, opOf('set-field', 'institution', 'inst-1'), { id: 'd_gamma', orderedAt: T0 });
  rows = stage(rows, opOf('set-field', 'faction', 'fac-1'), { id: 'd_delta', orderedAt: T0 });
  rows = stage(rows, opOf('set-field', 'npc', FIRST_NPC), { id: 'd_epsilon', orderedAt: T0 });
  rows = markApplied(rows, 'd_gamma', { appliedAt: T1, tickRef: 'tick_7', chronicleRef: 'chron_7' });
  rows = markApplied(rows, 'd_delta', { appliedAt: T1, tickRef: 'tick_7' });
  rows = withdraw(rows, 'd_epsilon', { kind: 'vocabulary-moved', missing: 'pool-value', was: 'Reeve' });
  return rows;
})();

/** The mutable store every mount reads through the fake `useStore` below. */
const storeState = {};
/** Every `setUserPref` the shell made, in order. */
const prefWrites = [];

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  useStore.setState = (recipe) => recipe(storeState);
  return { useStore };
});

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn(), paidAction: vi.fn() },
  EVENTS: new Proxy({}, { get: (_target, key) => String(key) }),
}));

/** The landed predicate, composed over this fixture rather than retyped. */
const authSlice = createAuthSlice(() => {}, () => storeState);

/** The store as one session: the editor mode ON, a live record, and the real gate. */
function seatState(tier, role, decrees = REGISTRY) {
  for (const key of Object.keys(storeState)) delete storeState[key];
  Object.assign(storeState, {
    auth: { tier, role, user: role === null ? null : { id: 'u1' } },
    userPrefs: { editorMode: 'plain' },
    settlement: recordOf(decrees),
    activeSaveId: SAVE,
    lastSeed: 'seed-1',
    phase: 'draft',
    canEditSettlement: authSlice.canEditSettlement,
    isElevated: () => false,
    setUserPref: (key, value) => prefWrites.push([key, value]),
    advanceInFlight: [],
    campaignMutationLocks: [],
    getSettlementDeletionBlock: () => null,
    getCampaignMutationBlock: () => null,
    getCampaignMembershipBlock: () => null,
    setPurchaseModalOpen: () => {},
  });
}

/**
 * Mount the shell. The import is dynamic so every mock above is installed first, and the
 * component itself comes back beside the render result because this fixture's `useStore`
 * holds no subscription: a write through `useStore.setState` really moves the store, and the
 * REDRAW is asked for explicitly. That split is what lets an arm assert the store moved and
 * then, separately, that the page reads the moved store.
 */
async function mountShell() {
  const Shell = (await import('../../src/components/edit/EditModeShell.jsx')).default;
  return { ...render(<Shell />), Shell };
}

const page = (container) => container.querySelector('[data-testid="decree-registry-page"]');
const idsIn = (container, testId) => [...container.querySelectorAll(`[data-testid="${testId}"] [data-testid="decree-entry"]`)]
  .map((node) => node.getAttribute('data-entry-id'));
const nodes = (container, testId) => [...container.querySelectorAll(`[data-testid="${testId}"]`)];
const rowFor = (container, entryId) => container.querySelector(`[data-entry-id="${entryId}"]`);
const linkIn = (container, entryId) => rowFor(container, entryId)
  .querySelector('[data-testid="decree-chronicle-link"]').getAttribute('href');
/** The live registry as the STORE holds it, never as a spy saw it. */
const live = () => storeState.settlement.decrees;
const rowOf = (id) => live().find((row) => row.id === id);

/** Every registry verb the mount binds, read off the shell's source as a scanner sees it. */
const boundVerbsIn = (src) => [...src.matchAll(/DECREE_ACTIONS\.([a-zA-Z]+)\(/g)].map((hit) => hit[1]).sort();

beforeEach(() => {
  prefWrites.length = 0;
  seatState('premium', STAFF_ROLES[0]);
});
afterEach(() => cleanup());

describe('EM-D3c — the page of decrees, mounted at the dossier foot', () => {
  it('M1: the shell renders the page with the store own live registry, waiting first and in the DM own order', async () => {
    const { container } = await mountShell();

    // The register above it is still the register — or the page below proves nothing.
    expect(container.textContent.includes(t('edit.shell.indicator'))).toBe(true);
    expect(page(container)).not.toBe(null);

    // The store's rows, grouped and ordered by the page's own reading of `orderIndex`.
    expect(idsIn(container, 'decree-registry-pending')).toEqual(['d_alpha', 'd_beta']);
    expect(idsIn(container, 'decree-registry-applied')).toEqual(['d_gamma', 'd_delta']);
    expect(idsIn(container, 'decree-registry-withdrawn')).toEqual(['d_epsilon']);
    expect(rowFor(container, 'd_alpha').querySelector('[data-testid="decree-entry-summary"]').textContent)
      .toBe(`set-field · npc ${FIRST_NPC}`);

    // A RECORD WITH NO REGISTRY reads as the shared empty one, and the page says so rather
    // than vanishing: the mount is unconditional, the CONTENT is the store's.
    cleanup();
    seatState('premium', STAFF_ROLES[0], undefined);
    delete storeState.settlement.decrees;
    const bare = (await mountShell()).container;
    expect(page(bare)).not.toBe(null);
    expect(idsIn(bare, 'decree-registry-pending')).toEqual([]);
    expect(bare.querySelector('[data-testid="decree-registry-empty"]')).not.toBe(null);
  });

  it('M2: move and withdraw reach EM-C4b own verbs bound with the store get/set, and the STORE registry moves', async () => {
    const { container, rerender, Shell } = await mountShell();

    // MOVE DOWN on the first waiting entry: the landed verb permuted the real rows, and the
    // three that were not pending kept the slots they held.
    fireEvent.click(nodes(container, 'decree-move-down')[0]);
    expect([rowOf('d_beta').orderIndex, rowOf('d_alpha').orderIndex]).toEqual([0, 1]);
    expect([rowOf('d_gamma').orderIndex, rowOf('d_delta').orderIndex, rowOf('d_epsilon').orderIndex])
      .toEqual([2, 3, 4]);
    rerender(<Shell />);
    expect(idsIn(container, 'decree-registry-pending')).toEqual(['d_beta', 'd_alpha']);

    // WITHDRAW: the entry is kept for the record, never deleted, and the page re-groups it.
    const before = live().length;
    fireEvent.click(nodes(container, 'decree-withdraw')[0]);
    expect(live().length).toBe(before);
    expect(rowOf('d_beta').status).toBe('withdrawn');
    rerender(<Shell />);
    expect(idsIn(container, 'decree-registry-pending')).toEqual(['d_alpha']);
    expect(idsIn(container, 'decree-registry-withdrawn')).toEqual(['d_beta', 'd_epsilon']);

    // THE BOUND VOCABULARY IS THE PAGE'S OWN DECLARED PAIR, in both directions, and the
    // shell names each verb where a scanner can see it rather than resolving one at run time.
    expect(boundVerbsIn(SHELL_SOURCE)).toEqual([...REGISTRY_ACTION_NAMES].sort());
    expect(boundVerbsIn('DECREE_ACTIONS.reorder(get, set, r); DECREE_ACTIONS.withdraw(get, set, r);'))
      .toEqual(['reorder', 'withdraw']);
  });

  it('M3: the account the landed gate refuses gets the refusal and NO page of decrees', async () => {
    seatState('free', null);
    const refused = (await mountShell()).container;
    expect(screen.queryAllByRole('alert').length).toBe(1);
    expect(page(refused)).toBe(null);
    expect(nodes(refused, 'decree-entry')).toEqual([]);
    cleanup();

    seatState('anon', null);
    const anon = (await mountShell()).container;
    expect(page(anon)).toBe(null);
    cleanup();

    // The account it ADMITS today, so the two absences above are a gate rather than a
    // mount that never renders at all.
    seatState('premium', STAFF_ROLES[0]);
    expect(page((await mountShell()).container)).not.toBe(null);
  });

  it('M4: an applied entry links to EM-E2 own chronicle reference, recorded or minted, driven over the real producer', async () => {
    const { container } = await mountShell();
    const world = storeState.settlement;

    // THE RECORDED REFERENCE. The entry carries the line it was written under.
    const recorded = decreeChronicleLine(rowOf('d_gamma'), world);
    expect(recorded).not.toBe(null);
    expect(linkIn(container, 'd_gamma')).toBe(`#chronicle-${recorded.id}`);
    expect(recorded.id).toBe('chron_7');

    // THE MINTED ONE. An entry applied before any line was recorded still has ONE address,
    // and it is the producer's own mint rather than a second grammar spelled at the mount.
    const minted = decreeChronicleLine(rowOf('d_delta'), world);
    expect(minted).not.toBe(null);
    expect(linkIn(container, 'd_delta')).toBe(`#chronicle-${minted.id}`);
    expect(minted.id).toBe('decree:d_delta');

    // A WAITING ENTRY HAS NO LINE YET, and the page carries none for it — measured beside
    // the two live links above rather than against an empty page.
    expect(nodes(container, 'decree-chronicle-link').length).toBe(2);
    expect(rowFor(container, 'd_alpha').querySelector('[data-testid="decree-chronicle-link"]')).toBe(null);
  });

  it('M5: reopen opens the door on the row the decree NAMES, and writes no decree at all', async () => {
    const { container } = await mountShell();
    const note = declarationsFor('npc').filter((row) => row.field === 'note')[0];
    const beforeRows = live();

    // The SECOND waiting entry names the SECOND person; the register's own pencil opens on
    // the first, so the value below can only come from the decree's own target.
    fireEvent.click(nodes(container, 'decree-reopen')[1]);
    expect(screen.queryAllByText(t('edit.dialog.title')).length).toBeGreaterThan(0);
    expect(screen.getByLabelText(note.label).value).toBe(SECOND_NOTE);

    // THE CLICK IS A SEAM, NOT A WRITE: the registry the store holds is the identical
    // array, so nothing was staged, reordered, reopened or marked.
    expect(live()).toBe(beforeRows);
    expect(live().map((row) => row.status))
      .toEqual(beforeRows.map((row) => row.status));
  });
});
