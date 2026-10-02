/** @vitest-environment jsdom */
/**
 * phantomDoor.test.jsx — EM-F3's SURFACE acceptance: the counterparties roster, the plus that
 * opens the door in CREATE mode, and the Forge control on an off-stage row (design §2.8 and
 * §13; the chair's judgment 275).
 *
 * ⭐ WRITTEN AND RUN RED FIRST. Every arm below was executed against `git show HEAD:` copies of
 * the shell and the door planted over the tree, and each reds by title there: the shell at the
 * base renders no counterparties heading at all, and the door at the base takes no `create`
 * seam, so the plus has nothing to open and Confirm does not exist.
 *
 * ⛔ THE GATE IS THE LANDED PREDICATE, NOT A RETYPED ONE. `createAuthSlice` is composed over
 * this file's own store fixture, so the refusal arm measures `canEditSettlement()` exactly as
 * `src/store/authSlice.js` spells it today. This member neither reads a tier literal nor lifts
 * the door: U16 is the owner's single act.
 *
 * ⛔ THE MINT IS OBSERVED, NEVER RE-PROVEN. `mintPhantomIntent` is replaced by a recorder so
 * these arms read what the door hands it; that the real binder writes ONE hidden save through
 * the real save service is EM-F3's own store arm (`tests/store/phantomMint.test.js` S1). Two
 * suites, one fact each. `counterpartiesOf` is the REAL export, so the roster these arms render
 * is the landed reading of a counterparty's reality.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY — set equalities against `[]` and
 * counts against numbers — so no `// anchored:` marker is owed anywhere in this file.
 *
 * @enforced-by this test
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, act } from '@testing-library/react';

import { t } from '../../src/copy/index.js';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { poolValues } from '../../src/domain/edit/pools.js';
import { PHANTOM_TRAIT_POOLS } from '../../src/domain/edit/phantoms.js';
import { raisedHere, refusalOf, REFUSAL_REASONS, REFUSAL_SURFACES } from '../../src/lib/refusalReasons.js';
import { refusalCopy } from '../../src/components/primitives/RefusalNotice.jsx';
import { createAuthSlice } from '../../src/store/authSlice.js';
import { STAFF_ROLES } from '../../src/lib/staffEntitlements.js';

/** The open settlement: one person so the register's other cards still render as they do. */
const TOWN = Object.freeze({
  id: 'save-1', name: 'Ashford', tier: 'town', culture: 'germanic',
  npcs: [Object.freeze({ id: 'npc-1', name: 'Alda', role: 'Reeve', status: 'active', note: '' })],
  institutions: [Object.freeze({ id: 'inst-1', name: 'The Mill', category: 'trade', state: 'sound' })],
  powerStructure: Object.freeze({
    governingName: 'Alda',
    factions: [Object.freeze({ id: 'fac-1', faction: 'The Guild', category: 'trade', power: 40 })],
  }),
  neighbourNetwork: [
    Object.freeze({ id: 'link-1', name: 'Stonebrook' }),
    Object.freeze({ id: 'link-2', name: 'Greymoor' }),
  ],
  config: Object.freeze({ terrainType: 'plains', culture: 'germanic' }),
});

/** The library rows: one real save and one off-stage counterparty EM-F1's predicate resolves. */
const PHANTOM_ROW = Object.freeze({
  id: 'dm:phantom:abc123', name: 'Greymoor', tier: 'village',
  settlement: Object.freeze({
    id: 'dm:phantom:abc123', kind: 'phantom', name: 'Greymoor', seed: 'dm:phantom:seed',
    traits: Object.freeze({ culture: 'germanic', size: 'village', terrain: 'grassland' }),
  }),
});
const TOWN_ROW = Object.freeze({
  id: 'save-1', name: 'Ashford', tier: 'town', settlement: TOWN,
});

const storeState = {};
/** Every value bag the door handed the mint, in order. */
const minted = [];
/** Every (seedOverride, options) pair the Forge control handed the generation lane, in order. */
const forged = [];
/** Every preference write, so the refusal arm can say the surface did nothing at all. */
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

// The WRITER, recorded; the READ is the real export.
vi.mock('../../src/store/phantomMintAction.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    mintPhantomIntent: (_get, _set, values) => {
      minted.push(values);
      return Promise.resolve(mintAnswer);
    },
  };
});

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));

/** What the recorded mint answers next. Set per arm. */
let mintAnswer = { ok: true, id: 'dm:phantom:abc123' };

const authSlice = createAuthSlice(() => {}, () => storeState);

/** @param {string} tier @param {string|null} role */
function seatState(tier, role) {
  for (const key of Object.keys(storeState)) delete storeState[key];
  Object.assign(storeState, {
    auth: { tier, role, user: role === null ? null : { id: 'u1' } },
    userPrefs: { editorMode: 'plain' },
    settlement: TOWN,
    savedSettlements: [TOWN_ROW, PHANTOM_ROW],
    activeSaveId: 'save-1',
    lastSeed: 'seed-1',
    phase: 'draft',
    canEditSettlement: authSlice.canEditSettlement,
    isElevated: () => false,
    setUserPref: (key, value) => prefWrites.push([key, value]),
    generateSettlement: (seedOverride, options) => {
      forged.push([seedOverride, options]);
      return Promise.resolve(null);
    },
  });
}

async function mountShell() {
  const EditModeShell = (await import('../../src/components/edit/EditModeShell.jsx')).default;
  return render(<EditModeShell />);
}

const buttonNames = () => screen.queryAllByRole('button')
  .map((node) => (node.getAttribute('aria-label') || node.textContent || '').trim()).sort();
const labelsOf = (c) => [...c.querySelectorAll('label span')].map((n) => n.textContent);
const controlsOf = (c) => [...c.querySelectorAll('label')].map((l) => {
  const el = l.querySelector('input, select, textarea');
  return el === null ? 'none' : el.tagName.toLowerCase();
});
const fieldAt = (c, index) => [...c.querySelectorAll('label')][index].querySelector('input, select, textarea');

const PHANTOM_ROWS = declarationsFor('phantom');

beforeEach(() => {
  minted.length = 0;
  forged.length = 0;
  prefWrites.length = 0;
  mintAnswer = { ok: true, id: 'dm:phantom:abc123' };
  seatState('premium', STAFF_ROLES[0]);
});
afterEach(() => cleanup());

describe('EM-F3 — the counterparties roster, the plus and the Forge control', () => {
  it('F1: the shell lists the neighbour network\'s partners, marks the off-stage one, and offers the plus', async () => {
    const { container } = await mountShell();
    const body = container.textContent;

    expect(body.includes(t('edit.shell.counterpartiesHead')), 'the roster has its own heading').toBe(true);
    expect(body.includes('Stonebrook'), 'a partner the town names is listed').toBe(true);
    expect(body.includes('Greymoor'), 'and so is the counterparty').toBe(true);
    expect(body.includes(t('edit.shell.counterparty.offStage')), 'the counterparty wears the off-stage mark').toBe(true);
    expect(body.includes(t('edit.shell.counterparty.real')), 'and the real partner wears the other one').toBe(true);
    expect(body.includes(t('edit.shell.counterparty.note')), 'with §13\'s own note above them').toBe(true);

    const names = buttonNames();
    expect(names.filter((name) => name === t('edit.shell.counterparty.add')), 'the plus is offered once')
      .toEqual([t('edit.shell.counterparty.add')]);
    // The FORGE control is on the OFF-STAGE row and on no other: one row of two is a phantom,
    // so exactly one Forge control exists.
    expect(names.filter((name) => name === t('edit.shell.counterparty.forge')), 'one Forge control, on the one off-stage row')
      .toEqual([t('edit.shell.counterparty.forge')]);

    // AND WITH NO COUNTERPARTY AT ALL the roster says so rather than rendering an empty block.
    cleanup();
    storeState.savedSettlements = [TOWN_ROW];
    storeState.settlement = { ...TOWN, neighbourNetwork: [] };
    const empty = await mountShell();
    expect(empty.container.textContent.includes(t('edit.shell.counterparty.none'))).toBe(true);
    expect(buttonNames().filter((name) => name === t('edit.shell.counterparty.forge')), 'and no Forge control')
      .toEqual([]);
  });

  it('F2: the plus opens the door on EXACTLY the phantom card\'s declared fields, and Confirm hands the mint all of them at once', async () => {
    const { container } = await mountShell();
    expect(minted, 'nothing is minted before the DM confirms').toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: t('edit.shell.counterparty.add') }));

    // (i) THE GENERATED FORM is the declaration table's own rows, in its authored order, and no
    // undeclared control: a set equality against EM-A1's table rather than a retyped list.
    expect(labelsOf(container)).toEqual(PHANTOM_ROWS.map((row) => row.label));
    // The control per kind is EM-D0d's own landed rule, quoted from its header rather than
    // guessed: a pooled row takes a select, and a `free` row a textarea (a `free-cascade` row is
    // the one that takes a single-line input, and no row of this card is one — the §6.2 shape law
    // reserves that kind for a declared KEY rename surface, which a card with no outputKey has
    // none of).
    const CONTROL_BY_KIND = { pool: 'select', free: 'textarea', 'free-cascade': 'input' };
    expect(controlsOf(container)).toEqual(PHANTOM_ROWS.map((row) => CONTROL_BY_KIND[row.kind]));
    expect(PHANTOM_ROWS.map((row) => row.kind), 'the card is one free name and one pooled size')
      .toEqual(['free', 'pool']);

    // (ii) THE POOL IS THE MINT'S OWN. The size control offers the `tier` vocabulary, which is
    // exactly the pool EM-F1 rolls a phantom's size from — joined, never re-typed.
    const sizeRow = PHANTOM_ROWS.filter((row) => row.field === 'size')[0];
    expect(sizeRow.pool).toBe(PHANTOM_TRAIT_POOLS.size);
    const ladder = poolValues(sizeRow.pool, TOWN);
    const select = fieldAt(container, 1);
    expect([...select.querySelectorAll('option')].map((o) => o.value)).toEqual(['', ...ladder]);

    // (iii) CONFIRM: ONE call, carrying EVERY declared field, whether the DM touched it or not.
    fireEvent.change(fieldAt(container, 0), { target: { value: 'Harrowfen' } });
    fireEvent.change(select, { target: { value: ladder[1] } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: t('edit.dialog.confirm') }));
    });
    expect(minted).toEqual([{ name: 'Harrowfen', size: ladder[1] }]);
    expect(minted.map((bag) => Object.keys(bag).sort()), 'exactly the declared field names')
      .toEqual([PHANTOM_ROWS.map((row) => row.field).sort()]);
    expect(screen.queryAllByText(t('edit.dialog.title')).length, 'and the door closed on the ok').toBe(0);

    // (iv) THE EDITOR'S OWN SAVE CONTROL IS NOT ON THIS ERRAND: a create form has one Confirm.
    expect(buttonNames().filter((name) => name === t('edit.dialog.save'))).toEqual([]);
  });

  it('F3: a refusal is shown in the door\'s own shape and the door stays open, and an unknown word takes the one fallback', async () => {
    mintAnswer = { ok: false, reason: 'off_pool' };
    const { container } = await mountShell();
    fireEvent.click(screen.getByRole('button', { name: t('edit.shell.counterparty.add') }));
    fireEvent.change(fieldAt(container, 0), { target: { value: 'Harrowfen' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: t('edit.dialog.confirm') }));
    });
    expect(container.textContent.includes(
      t('edit.dialog.refusalMintOffPool', { field: t('edit.dialog.createSubject') }),
    ), 'the refusal names its own state').toBe(true);
    expect(screen.queryAllByText(t('edit.dialog.title')).length > 0, 'and the door is still open').toBe(true);

    mintAnswer = { ok: false, reason: 'no_such_reason' };
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: t('edit.dialog.confirm') }));
    });
    expect(container.textContent.includes(
      t('edit.dialog.refusalUnknown', { field: t('edit.dialog.createSubject') }),
    ), 'an unknown word takes the ONE fallback line and invents nothing').toBe(true);
    expect(minted.length, 'both confirms reached the seam').toBe(2);
  });

  it('F4: the Forge control hands the generation lane the row\'s own id under promote, and NOTHING else', async () => {
    await mountShell();
    expect(forged, 'nothing is forged before the DM asks').toEqual([]);

    fireEvent.click(screen.getByRole('button', { name: t('edit.shell.counterparty.forge') }));
    expect(forged.length, 'exactly one call').toBe(1);
    const [seedOverride, options] = forged[0];
    expect(seedOverride, 'no seed is passed: the forge takes the counterparty\'s OWN seed').toBe(undefined);
    // THE OPTIONS ARE THE ROW ID AND THE SURFACE STAMP, AND NOTHING ELSE. `at` changes nothing
    // about the generation — the lane's own contract says it "is stamped on any refusal this
    // call records" — and it is what lets arm F6 prove the refusal is said HERE rather than on
    // some other mount of the one store slot. No intent, no config and no seed ride with it.
    expect(options, 'the options carry the row id under promote and the surface stamp, and nothing else')
      .toEqual({ promote: PHANTOM_ROW.id, at: REFUSAL_SURFACES.EDIT_FORGE });
    expect(Object.keys(options).sort()).toEqual(['at', 'promote']);
    expect(minted, 'and forging mints nothing').toEqual([]);
  });

  it('F6: a forge the lane refuses is SAID where the DM clicked, and a refusal raised elsewhere is not repeated here', async () => {
    // (i) THE ESTATE'S OWN RECORD, raised at THIS surface, rendered in the one notice idiom.
    const mine = refusalOf(REFUSAL_REASONS.DAILY_CAP, null, REFUSAL_SURFACES.EDIT_FORGE);
    storeState.lastRefusal = mine;
    const said = await mountShell();
    const words = refusalCopy(mine.reason, mine.vars);
    expect(typeof words?.body, 'the reason really resolves to words, or the arm below proves nothing').toBe('string');
    const alerts = [...said.container.querySelectorAll('[role="alert"]')].map((node) => node.textContent);
    expect(alerts.length, 'exactly one notice, and it is the refusal').toBe(1);
    expect(alerts[0].includes(words.body), 'carrying the reason\'s own sentence').toBe(true);
    expect(raisedHere(mine, REFUSAL_SURFACES.EDIT_FORGE), 'the record really is this surface\'s').toBe(true);
    cleanup();

    // (ii) THE SAME RECORD RAISED SOMEWHERE ELSE is not repeated here: one click, one sentence,
    // on the surface that raised it. That is REVIEW-P F12's law, measured on this mount.
    storeState.lastRefusal = refusalOf(REFUSAL_REASONS.DAILY_CAP, null, REFUSAL_SURFACES.HOME_HERO);
    const elsewhere = await mountShell();
    expect([...elsewhere.container.querySelectorAll('[role="alert"]')], 'no notice on a foreign record').toEqual([]);
    cleanup();

    // (iii) AND WITH NO RECORD AT ALL the shell says nothing, so (i) measured the record rather
    // than a notice that is always up.
    storeState.lastRefusal = null;
    const quiet = await mountShell();
    expect([...quiet.container.querySelectorAll('[role="alert"]')]).toEqual([]);
  });

  it('F5: the landed gate is READ and never lifted: a refused account gets the roster, the plus and the Forge control NOT AT ALL', async () => {
    seatState('free', null);
    const refused = await mountShell();
    expect(buttonNames(), 'a refused account sees no control at all').toEqual([]);
    expect(refused.container.textContent.includes(t('edit.shell.counterpartiesHead')), 'and no roster').toBe(false);
    expect(forged, 'nothing was forged').toEqual([]);
    expect(minted, 'and nothing was minted').toEqual([]);
    expect(prefWrites, 'and no preference moved').toEqual([]);
    cleanup();

    seatState('anon', null);
    await mountShell();
    expect(buttonNames()).toEqual([]);
    cleanup();

    // The account the predicate ADMITS today, as the control that keeps the two arms above from
    // measuring a surface that simply never renders.
    seatState('premium', STAFF_ROLES[0]);
    const admitted = await mountShell();
    expect(admitted.container.textContent.includes(t('edit.shell.counterpartiesHead'))).toBe(true);
  });
  it('F7: the door opens only over a SAVED settlement: with no active save the plus is shut, says why, and mints nothing', async () => {
    // ⛔ THE RED THIS ARM WAS WRITTEN FOR (the verifier's NOTE-11). Design §1 makes edit mode a
    // state of a SAVED settlement's dossier and never an anonymous draft, and every other editor
    // writer refuses `no_save` at its own door. The plus did not: on a draft it opened the form
    // and founded a counterparty rooted at the draft's seed and owned by no settlement.
    //
    // ⛔ THE GATE IS THE SAVE AND NOTHING ELSE. `canEditSettlement()` is untouched above and the
    // roster's own reading of a counterparty's reality is untouched below: part (i) proves the
    // register, the roster and the Forge control all still stand on the very same seat.
    storeState.activeSaveId = null;
    const draft = await mountShell();

    // (i) NOTHING ELSE IS TAKEN AWAY: the roster stands and the off-stage row keeps its forge.
    expect(draft.container.textContent.includes(t('edit.shell.counterpartiesHead')), 'the roster still stands').toBe(true);
    expect(buttonNames().filter((name) => name === t('edit.shell.counterparty.forge')), 'and the Forge control is unmoved')
      .toEqual([t('edit.shell.counterparty.forge')]);

    // (ii) THE PLUS IS SHUT, AND THE REGISTER SAYS WHY IN ITS OWN IDIOM — the same shape a roster
    // whose newcomer no op can express already wears.
    const plus = screen.getByRole('button', { name: t('edit.shell.counterparty.add') });
    expect(plus.hasAttribute('disabled'), 'the plus is shut over a dossier that was never saved').toBe(true);
    expect(draft.container.textContent.split(t('edit.shell.counterparty.addReason')).length, 'and the line says why, once')
      .toBe(2);

    // (iii) AND THE SEAM IS UNREACHABLE: the click opens no door, so nothing can be minted.
    fireEvent.click(plus);
    expect(screen.queryAllByText(t('edit.dialog.title')).length, 'no door opened').toBe(0);
    expect(minted, 'and nothing was minted').toEqual([]);
    cleanup();

    // (iv) THE CONTROL, on the SAME seat with the save put back: the plus opens and the line is
    // gone, so (ii) measured the save rather than a plus that is always shut.
    seatState('premium', STAFF_ROLES[0]);
    const saved = await mountShell();
    const open = screen.getByRole('button', { name: t('edit.shell.counterparty.add') });
    expect(open.hasAttribute('disabled'), 'a saved dossier keeps its plus').toBe(false);
    expect(saved.container.textContent.split(t('edit.shell.counterparty.addReason')).length, 'and shows no line at all')
      .toBe(1);
    fireEvent.click(open);
    expect(screen.queryAllByText(t('edit.dialog.title')).length, 'and the door opens').toBe(1);
  });
});
