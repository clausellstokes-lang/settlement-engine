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

import { evaluateGuards, GUARD_OFFERS } from '../../src/domain/edit/guards.js';
import { makeGuardRuleSet } from '../../src/domain/edit/guardRules.js';
import { OP_TYPES } from '../../src/domain/edit/operations.js';
import { renormalizeFactionPower } from '../../src/generators/power/rulingStructure.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';
import { REGISTRY_ACTION_NAMES } from '../../src/components/edit/DecreeRegistryPage.jsx';
import { decreeChronicleLine } from '../../src/domain/display/stateProse/decreeProse.js';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { markApplied, stage, withdraw } from '../../src/domain/edit/registry.js';
import { createAuthSlice } from '../../src/store/authSlice.js';
import { PULSE_UNDO_CAP } from '../../src/store/pulseUndoCap.js';
import { PULSE_UNDO_CAP as PULSE_UNDO_CAP_VIA_SESSION } from '../../src/store/campaignAdvanceSession.js';
import { STAFF_ROLES } from '../../src/lib/staffEntitlements.js';
import { t } from '../../src/copy/index.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHELL_PATH = 'src/components/edit/EditModeShell.jsx';
const SHELL_SOURCE = readFileSync(join(ROOT, SHELL_PATH), 'utf8');

const SAVE = 'save-1';
const T0 = '2026-09-23T10:00:00.000Z';
const T1 = '2026-09-23T11:00:00.000Z';

/** One op at the rigid shape `src/domain/edit/types.js` authors. ⭐ EM-C4c WIDENS THE PAYLOAD
 *  PARAMETER IN PLACE, BY ADDITION: an absent one is the empty payload every arm above already
 *  builds, so their registry is byte-identical and only M6 supplies one. */
const opOf = (type, kind, id, payload = {}) => Object.freeze({
  type,
  target: Object.freeze({ kind, id }),
  payload: Object.freeze({ ...payload }),
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

/**
 * ⭐ EM-C4c: THE RULE SET, AND NOTHING ELSE, IS SUPPLIED (design §7 C; EM-D3c's own header).
 *
 * `selectGuards(state)` at its default answers `EMPTY_RULE_SET`'s honest empty verdict, and the
 * MOUNT supplies no rule set on purpose — composing `makeGuardRuleSet` in the shell would put a
 * second `src/domain/edit/` edge on a file whose edge set is pinned, and would need the two
 * generator writers injected from a leaf that reaches no generator. "The wiring lights the day
 * a rule set arrives"; this is that day, in one suite. Only the READER is replaced, with the
 * REAL engine over the REAL rule set and the REAL injected writers, reading the store's own
 * registry and record: the writer under test (`takeGuardOffer`), the registry verbs and the
 * store all stay the landed ones, spread from the actual module.
 *
 * ⛔ IT CHANGES NOTHING FOR M1 TO M5, and that is measured rather than hoped: every entry of
 * their registry is a `set-field` with an empty payload on its own target, which no rule of the
 * five can speak about, so their verdict is empty either way. M6 seats its own rows.
 */
vi.mock('../../src/store/editSlice.js', async (importOriginal) => {
  const actual = await importOriginal();
  const [engine, rules, catalogue, validator, power] = await Promise.all([
    import('../../src/domain/edit/guards.js'),
    import('../../src/domain/edit/guardRules.js'),
    import('../../src/domain/edit/operations.js'),
    import('../../src/generators/structuralValidator.js'),
    import('../../src/generators/power/rulingStructure.js'),
  ]);
  const ruleSet = rules.makeGuardRuleSet({
    checkStructuralValidity: validator.checkStructuralValidity,
    renormalizeFactionPower: power.renormalizeFactionPower,
  });
  return {
    ...actual,
    selectGuards: (state) => engine.evaluateGuards(
      actual.selectDecrees(state), state?.settlement ?? null, catalogue.OP_TYPES, ruleSet,
    ),
  };
});

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

  it('M6: the guard offer is a CONTROL and it drives EM-C4c own verb through the real store — proceed records the guard own id on the entry and the badge comes back marked, keep the first withdraws the judged entry', async () => {
    // TWO WAITING ENTRIES SETTING ONE FACT, so the real rule set has something to say. The rows
    // are EM-C1's own `stage` over the catalogue's own shape, exactly as REGISTRY is.
    let clashing = stage([], opOf('set-field', 'npc', FIRST_NPC, { field: 'note', value: 'one' }),
      { id: 'd_one', orderedAt: T0 });
    clashing = stage(clashing, opOf('set-field', 'npc', FIRST_NPC, { field: 'note', value: 'two' }),
      { id: 'd_two', orderedAt: T0 });
    seatState('premium', STAFF_ROLES[0], clashing);

    // THE FINDING, from the REAL engine over the REAL rule set — the same answer the mount
    // reads, derived here rather than typed, so the id below is the product's own mint.
    const ruleSet = makeGuardRuleSet({ checkStructuralValidity, renormalizeFactionPower });
    const verdict = () => evaluateGuards(live(), storeState.settlement, OP_TYPES, ruleSet);
    const finding = verdict().guards[0];
    expect(verdict().guards.length).toBe(1);
    expect([finding.entryId, finding.relatedEntryId]).toEqual(['d_two', 'd_one']);

    const { container, rerender, Shell } = await mountShell();
    const badge = () => rowFor(container, 'd_two').querySelector('[data-testid="decree-guard"]');
    const controls = () => [...rowFor(container, 'd_two')
      .querySelectorAll('[data-testid="decree-guard-offer"]')];

    // AN OFFER WITH A WRITER IS A CONTROL, not words: each is a real button and carries an
    // offer the engine minted, so no control can offer a word the vocabulary does not hold.
    expect(controls().map((node) => node.tagName)).toEqual(['BUTTON', 'BUTTON', 'BUTTON']);
    expect(controls().map((node) => node.getAttribute('data-offer'))).toEqual([...finding.offers]);
    expect(controls().filter((node) => !GUARD_OFFERS.includes(node.getAttribute('data-offer'))))
      .toEqual([]);
    expect(badge().getAttribute('data-guard-overridden')).toBe('no');

    // PROCEED: the click reaches the landed verb, and the STORE — never a spy — carries the
    // guard's own id on the entry the guard judged, and on no other.
    const proceed = controls().find((node) => node.getAttribute('data-offer') === GUARD_OFFERS[4]);
    fireEvent.click(proceed);
    expect(rowOf('d_two').overrode).toEqual([finding.id]);
    expect(Object.hasOwn(rowOf('d_one'), 'overrode')).toBe(false);
    expect(live().map((row) => row.status)).toEqual(['pending', 'pending']);

    // THE FINDING STANDS, MARKED. The page reads the moved store and says so, which is the
    // whole of "the DM's word stands beside the guard's" as a reader meets it.
    rerender(<Shell />);
    expect(verdict().guards.map((guard) => [guard.id, guard.overridden]))
      .toEqual([[finding.id, true]]);
    expect(badge().getAttribute('data-guard-overridden')).toBe('yes');

    // KEEP THE FIRST: the entry the guard JUDGED is withdrawn and kept for the record, and the
    // page re-groups it — one more offer, the same binding, the same store.
    const keepFirst = controls().find((node) => node.getAttribute('data-offer') === GUARD_OFFERS[2]);
    fireEvent.click(keepFirst);
    expect([rowOf('d_two').status, rowOf('d_one').status]).toEqual(['withdrawn', 'pending']);
    expect(live().length).toBe(2);
    rerender(<Shell />);
    expect(idsIn(container, 'decree-registry-pending')).toEqual(['d_one']);
    expect(idsIn(container, 'decree-registry-withdrawn')).toEqual(['d_two']);

    // THE BINDING IS SPELLED WHERE A SCANNER CAN SEE IT, and it is the DOOR rather than one of
    // `DECREE_ACTIONS`' verbs — so the page's own `REGISTRY_ACTION_NAMES` pair is unmoved.
    expect(SHELL_SOURCE.includes('onGuardOffer={guardOffer}')).toBe(true);
    expect(SHELL_SOURCE.includes('takeGuardOffer(useStore.getState, useStore.setState,')).toBe(true);
    expect(boundVerbsIn(SHELL_SOURCE)).toEqual([...REGISTRY_ACTION_NAMES].sort());
  });

  it('M7: the mount tells the page the rewind own reach, from the estate one home, and the page states it', async () => {
    // ⭐ U73 (the verifier's FIX-5). Design §12: "The registry page states the rewind's own
    // limit ('available for the last ten advances of this session')." Lane C's U8 exported the
    // cap for exactly this and the mount never passed it, so the page drew its figure-less
    // branch at every tip and the number reached no DM. THE ARM READS THE PRODUCT'S BINDING:
    // the shell is rendered, and the sentence it produces is composed from the ESTATE'S
    // constant rather than from a prop this suite supplies.
    const { container } = await mountShell();
    const rewind = page(container).querySelector('[data-testid="decree-registry-rewind"]');
    expect(rewind, 'the page stopped drawing its rewind line').not.toBe(null);
    expect(Number.isInteger(PULSE_UNDO_CAP) && PULSE_UNDO_CAP > 0, 'the estate exports a real cap').toBe(true);
    expect(rewind.textContent).toBe('A rewind returns the decrees of a tick to the waiting list'
      + ` in their own order. It reaches the last ${PULSE_UNDO_CAP} advances of this session,`
      + ' and a reload clears it.');
    // GUARD-THE-GUARD: the figure-less branch is a real branch the page still carries, so the
    // assertion above is not vacuously true of both.
    expect(rewind.textContent.includes('this session only'), 'the page drew its told-nothing branch').toBe(false);

    // ⛔ ONE FACT, ONE HOME, TWO READERS. The advance session — which evicts past the cap —
    // and this mount must read the SAME declaration, or the sentence and the behaviour drift.
    // The session re-exports the leaf, so the two bindings are one value by identity.
    expect(PULSE_UNDO_CAP_VIA_SESSION).toBe(PULSE_UNDO_CAP);

    // THE BINDING IS SPELLED WHERE A SCANNER CAN SEE IT, and it names the constant rather
    // than a number — a mount that re-typed the figure would pass the render arm above.
    expect(SHELL_SOURCE.includes('rewindLimit={PULSE_UNDO_CAP}')).toBe(true);
    expect(/rewindLimit=\{\s*\d/.test(SHELL_SOURCE), 'the mount typed a literal figure').toBe(false);
  });
});
