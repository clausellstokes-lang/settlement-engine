/** @vitest-environment jsdom */
/**
 * editShellPlusDoor.test.jsx — EM-D1c's acceptance: the PLUS on each roster root opens the
 * editor door in CREATE mode over the op's own payload, and Confirm leaves a new roster row
 * waiting in the page of decrees as an add-decree (design §2.5's registry row, §12's ops).
 *
 * ⭐ WRITTEN AND RUN RED FIRST. Every arm below was executed against `git show HEAD:` copies of
 * the shell, the door and the copy registry planted over the tree, and each reds by title
 * there: at the base the three pluses are DISABLED buttons, so the door never opens, nothing is
 * staged, and the door exports no roster-refusal vocabulary at all.
 *
 * ⛔ THE WRITER IS THE REAL ONE. Nothing here records the binder: `stageAddDecreeIntent` runs as
 * it stands and the entry is read back OFF THE STORE it wrote through, which is what the brief
 * asks for and what a recorder could never show. Only `addOpPayloadFor` is intercepted, and only
 * in D4, to seat a roster root the catalogue carries no add-op for — a state the tip cannot
 * reach today and the one the disabled plus exists for.
 *
 * ⛔ NOTHING HERE RE-TYPES A PRODUCER'S ANSWER. The field list, the labels, the control kinds
 * and the pool members are read by CALLING `addOpPayloadFor`, `declarationsFor` and
 * `poolValues`; the refusal vocabularies are imported from the two store leaves that own them;
 * the gate is the landed `createAuthSlice` composed over this file's fixture, so D4 measures
 * `canEditSettlement()` exactly as it stands today (design §20.4, judgment 268).
 *
 * ⛔ THE NEWCOMER'S ID POLICY IS NOT RE-PROVEN HERE. That the minted id is stable, unique and
 * inside the DM's own namespace is EM-E8's own store arm (tests/store/addDecreeIntent.test.js);
 * what is measured here is the JOIN — that the entry the page shows names the same subject the
 * op does. Two suites, one fact each.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY — set equalities against `[]`,
 * counts against numbers, and each absence measured beside a live presence in the same arm — so
 * no `// anchored:` marker is owed anywhere in this file, exactly as
 * tests/components/editModeShell.test.jsx does it.
 *
 * @enforced-by this test
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, act } from '@testing-library/react';

import { en } from '../../src/copy/en.js';
import { t } from '../../src/copy/index.js';
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { poolValues } from '../../src/domain/edit/pools.js';
import { DECREE_AUTHORS } from '../../src/domain/edit/registry.js';
import { ADD_DECREE_REFUSALS, addOpPayloadFor, selectDecrees } from '../../src/store/editSlice.js';
import { MINT_REFUSALS } from '../../src/store/phantomMintAction.js';
import { createAuthSlice } from '../../src/store/authSlice.js';
import { STAFF_ROLES } from '../../src/lib/staffEntitlements.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHELL_SOURCE = readFileSync(join(ROOT, 'src/components/edit/EditModeShell.jsx'), 'utf8');
const DOOR_REL = 'src/components/edit/CardEditorDialog.jsx';
const DOOR_SOURCE = readFileSync(join(ROOT, DOOR_REL), 'utf8');

/** The three roster roots the register draws a plus on, in the register's own order. */
const ROSTER_CARDS = ['npc', 'institution', 'faction'];

/** EM-D0d's landed rule, quoted: a pooled row takes a select, a join key a single-line input. */
const CONTROL_BY_KIND = { pool: 'select', free: 'textarea', 'free-cascade': 'input' };

const SAVE = 'save-1';
const SEED = 'seed-em-d1c';

/**
 * THE RECORD, and it is deliberately NOT frozen: the registry's one write site assigns
 * `settlement.decrees` through the store's own recipe, and this fixture is the store.
 */
function recordOf() {
  return {
    id: SAVE,
    _seed: SEED,
    name: 'Stoneford',
    tier: 'town',
    culture: 'germanic',
    npcs: [{ id: 'npc-1', name: 'Alda', role: 'Reeve', status: 'active', note: '' }],
    institutions: [
      { id: 'inst-1', name: 'The Mill', category: 'trade', state: 'sound', role: 'Miller' },
      { id: 'inst-2', name: 'The Hall', category: 'civic', state: 'sound', role: 'Reeve' },
    ],
    powerStructure: {
      governingName: 'Alda',
      factions: [{ id: 'fac-1', faction: 'The Guild', category: 'trade', power: 40 }],
    },
    config: { terrainType: 'plains', culture: 'germanic' },
  };
}

const storeState = {};
/** Every preference write, so the gate arm can say the refused surface did nothing at all. */
const prefWrites = [];

/** The cards D4 seats as having no add-op. Hoisted so the module factory below may read it. */
const payloadGate = vi.hoisted(() => ({ blocked: [] }));

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  useStore.setState = (recipe) => recipe(storeState);
  return { useStore };
});

// THE BINDER IS THE REAL ONE (see the header). Only the catalogue READ is intercepted, and
// only for the cards D4 names, so every other arm runs against the landed table.
vi.mock('../../src/store/editSlice.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    addOpPayloadFor: (cardType) => (payloadGate.blocked.includes(cardType)
      ? []
      : actual.addOpPayloadFor(cardType)),
  };
});

vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false, getIsMobile: () => false }));

vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn(), paidAction: vi.fn() },
  EVENTS: new Proxy({}, { get: (_target, key) => String(key) }),
}));

/** The landed predicate, composed over this fixture rather than retyped. */
const authSlice = createAuthSlice(() => {}, () => storeState);

/** @param {string} tier @param {string|null} role */
function seatState(tier, role) {
  for (const key of Object.keys(storeState)) delete storeState[key];
  Object.assign(storeState, {
    auth: { tier, role, user: role === null ? null : { id: 'u1' } },
    userPrefs: { editorMode: 'plain' },
    settlement: recordOf(),
    savedSettlements: [],
    activeSaveId: SAVE,
    lastSeed: SEED,
    phase: 'draft',
    canEditSettlement: authSlice.canEditSettlement,
    isElevated: () => false,
    setUserPref: (key, value) => prefWrites.push([key, value]),
    generateSettlement: () => Promise.resolve(null),
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
const rollButtons = () => screen.queryAllByRole('button')
  .filter((b) => b.textContent === t('edit.field.rollAnother'));
const plusName = (card) => t('edit.shell.plus', { card: t(`edit.shell.card.${card}`) });

/** EM-A1's declared rows for one card, kept to the field names the card's add-op declares. */
const createRowsOf = (card) => {
  const fields = addOpPayloadFor(card).map((row) => row.field);
  return declarationsFor(card).filter((row) => fields.includes(row.field));
};

/** Open the register and click one roster root's plus. */
async function openPlus(card) {
  const mounted = await mountShell();
  fireEvent.click(screen.getByRole('button', { name: plusName(card) }));
  return mounted;
}

beforeEach(() => {
  payloadGate.blocked = [];
  prefWrites.length = 0;
  seatState('premium', STAFF_ROLES[0]);
});
afterEach(() => cleanup());

describe('EM-D1c — the plus opens the door, and a new roster row waits in the registry', () => {
  it('D1: the plus opens the door in CREATE mode on EXACTLY the op payload fields, joined to EM-A1 own rows', async () => {
    // (i) THE JOIN, measured before anything is rendered: every payload field the catalogue
    //     declares is a field EM-A1 declares for the same card, under the SAME pool where it
    //     names one. That is what lets the door draw the op's fields with the table's own
    //     labels and limits instead of inventing either.
    const joins = ROSTER_CARDS.map((card) => {
      const payload = addOpPayloadFor(card);
      const rows = declarationsFor(card);
      return payload.map((spec) => {
        const row = rows.filter((candidate) => candidate.field === spec.field)[0];
        return {
          field: spec.field,
          declared: row !== undefined,
          pool: row === undefined ? null : (row.pool ?? null),
          wanted: spec.pool ?? null,
        };
      });
    });
    expect(joins.map((rows) => rows.map((row) => row.declared)))
      .toEqual(joins.map((rows) => rows.map(() => true)));
    expect(joins.map((rows) => rows.map((row) => row.pool)))
      .toEqual(joins.map((rows) => rows.map((row) => row.wanted)));
    expect(joins.map((rows) => rows.length)).toEqual([2, 2, 2]);

    // (ii) THE FORM, per roster root: the declared rows the payload names, in the TABLE's
    //      authored order, and no other control at all.
    for (const card of ROSTER_CARDS) {
      const wanted = createRowsOf(card);
      const { container } = await openPlus(card);
      expect(labelsOf(container), `${card}: the door shows the op own fields`)
        .toEqual(wanted.map((row) => row.label));
      expect(controlsOf(container), `${card}: one control per declared kind`)
        .toEqual(wanted.map((row) => CONTROL_BY_KIND[row.kind]));
      // The pooled field takes the roll affordance, and the free one does not.
      expect(rollButtons().length, `${card}: one roller, on the pooled row`)
        .toBe(wanted.filter((row) => row.kind === 'pool').length);
      // It is a CREATE form: one Confirm, and the editor's Save control is not on this errand.
      expect(buttonNames().filter((name) => name === t('edit.dialog.confirm')))
        .toEqual([t('edit.dialog.confirm')]);
      expect(buttonNames().filter((name) => name === t('edit.dialog.save'))).toEqual([]);
      cleanup();
    }

    // (iii) THE COUNTERFORCE: the same card's PENCIL still opens the whole card, so (ii)
    //       measured the errand's own restriction and not a door that lost its other rows.
    const whole = await mountShell();
    fireEvent.click(screen.getByRole('button', {
      name: t('edit.shell.pencil', { card: t('edit.shell.card.npc') }),
    }));
    expect(labelsOf(whole.container)).toEqual(declarationsFor('npc').map((row) => row.label));
  });

  it('D2: Confirm stages ONE add-decree through the real store, and the page of decrees shows it waiting', async () => {
    const { container } = await openPlus('npc');
    expect(selectDecrees(storeState), 'nothing is ordered before the DM confirms').toEqual([]);

    const rows = createRowsOf('npc');
    const roles = poolValues('npc.role', storeState.settlement);
    expect(roles.length > 0, 'the fixture really offers a role, or the arm proves nothing').toBe(true);
    fireEvent.change(fieldAt(container, 0), { target: { value: 'Mara' } });
    fireEvent.change(fieldAt(container, 1), { target: { value: roles[0] } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: t('edit.dialog.confirm') }));
    });

    // (i) THE STORE'S OWN REGISTRY: one entry, pending, the DM's, and its op is the card's
    //     add-op carrying exactly the values the DM saw.
    const staged = selectDecrees(storeState);
    expect(staged.length, 'exactly one entry').toBe(1);
    const entry = staged[0];
    expect({
      type: entry.op.type,
      kind: entry.op.target.kind,
      payload: entry.op.payload,
      status: entry.status,
      addedBy: entry.addedBy,
      sameSubject: entry.id === entry.op.target.id,
      named: entry.id.length > 0,
    }).toEqual({
      type: 'add-npc',
      kind: 'npc',
      payload: { [rows[0].field]: 'Mara', [rows[1].field]: roles[0] },
      status: 'pending',
      addedBy: DECREE_AUTHORS[0],
      sameSubject: true,
      named: true,
    });
    expect(screen.queryAllByText(t('edit.dialog.title')).length, 'and the door closed on the ok').toBe(0);

    // (ii) AND THE REGISTER SHOWS IT WAITING. The page is the shell's own mount, so a fresh
    //      reading of the same store draws the entry the confirm left behind.
    cleanup();
    const again = await mountShell();
    const entries = [...again.container.querySelectorAll('[data-testid="decree-entry"]')];
    expect(entries.length, 'one row on the page of decrees').toBe(1);
    const summary = entries[0].querySelector('[data-testid="decree-entry-summary"]').textContent;
    expect({
      naming: summary.includes('add-npc'),
      subject: summary.includes(entry.op.target.id),
    }).toEqual({ naming: true, subject: true });
  });

  it('D3: a payload the writer refuses shows the writer own reason and orders nothing, and the two CREATE vocabularies are one lookup', async () => {
    const door = await import('../../src/components/edit/CardEditorDialog.jsx');
    const { container } = await openPlus('npc');

    // A required pooled field left unset is not a member of its pool, which is the writer's
    // own reading through EM-C1's resolver and never a rule this door makes.
    fireEvent.change(fieldAt(container, 0), { target: { value: 'Mara' } });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: t('edit.dialog.confirm') }));
    });
    expect(selectDecrees(storeState), 'nothing was ordered').toEqual([]);
    expect(container.textContent.includes(
      t('edit.dialog.refusalAddStaleVocabulary', { field: t('edit.dialog.createSubject') }),
    ), 'the refusal names its own state').toBe(true);
    expect(screen.queryAllByText(t('edit.dialog.title')).length > 0, 'and the door stays open').toBe(true);

    // THE VOCABULARY, in both directions: the door's two CREATE maps are DISJOINT and their
    // union is exactly the two landed refusal sets, so every word either writer can say has
    // one line and no word has two.
    const mint = Object.keys(door.CREATE_REFUSAL_COPY_KEYS);
    const add = Object.keys(door.ADD_REFUSAL_COPY_KEYS);
    const union = [...new Set([...mint, ...add])].sort();
    const landed = [...new Set([...MINT_REFUSALS, ...ADD_DECREE_REFUSALS])].sort();
    expect(union).toEqual(landed);
    expect(add.filter((word) => mint.includes(word)), 'the one shared word lives in ONE map')
      .toEqual([]);

    // Every one of the roster writer's words resolves to a real sentence, and none of them
    // falls through to the one fallback line.
    const lines = [...ADD_DECREE_REFUSALS].map((word) => t(
      door.CREATE_REFUSAL_COPY_KEYS[word] ?? door.ADD_REFUSAL_COPY_KEYS[word],
      { field: t('edit.dialog.createSubject') },
    ));
    const fallback = t(door.REFUSAL_FALLBACK_KEY, { field: t('edit.dialog.createSubject') });
    expect(lines.map((line) => typeof line)).toEqual(ADD_DECREE_REFUSALS.map(() => 'string'));
    expect(lines.map((line) => line === fallback)).toEqual(ADD_DECREE_REFUSALS.map(() => false));
    expect(lines.map((line) => line.includes('—') || line.includes('!')))
      .toEqual(ADD_DECREE_REFUSALS.map(() => false));
  });

  it('D4: the landed gate is READ and never lifted, and a roster root with no add-op keeps the disabled plus and its reason', async () => {
    // (i) THE GATE. A refused account gets the house refusal and no control at all, so the
    //     plus this member lights is inside the one conjunct the owner owns.
    seatState('free', null);
    const refused = await mountShell();
    expect(buttonNames(), 'a refused account sees no control at all').toEqual([]);
    expect(refused.container.textContent.includes(t('edit.shell.refusalGated'))).toBe(true);
    expect(selectDecrees(storeState), 'and nothing was ordered').toEqual([]);
    expect(prefWrites, 'and no preference moved').toEqual([]);
    cleanup();

    // (ii) THE WRITERLESS ROSTER, beside a live one in the same render: a card the catalogue
    //      carries no add-op for keeps the DISABLED plus and the line that says why, and the
    //      others are open, so the reason line is a measurement and not a leftover.
    seatState('premium', STAFF_ROLES[0]);
    payloadGate.blocked = ['faction'];
    const mixed = await mountShell();
    const disabled = ROSTER_CARDS.map((card) => screen
      .getByRole('button', { name: plusName(card) }).hasAttribute('disabled'));
    expect(disabled).toEqual([false, false, true]);
    expect(mixed.container.textContent.includes(t('edit.shell.plusReason'))).toBe(true);

    // The disabled plus opens nothing when it is clicked anyway.
    fireEvent.click(screen.getByRole('button', { name: plusName('faction') }));
    expect(screen.queryAllByText(t('edit.dialog.title')).length).toBe(0);

    // AND WITH EVERY ADD-OP IN PLACE the reason line is gone from the register entirely,
    // which is the counterforce for the line above.
    cleanup();
    payloadGate.blocked = [];
    const open = await mountShell();
    expect(open.container.textContent.includes(t('edit.shell.plusReason'))).toBe(false);
    expect(ROSTER_CARDS.map((card) => screen
      .getByRole('button', { name: plusName(card) }).hasAttribute('disabled')))
      .toEqual(ROSTER_CARDS.map(() => false));
  });

  it('D5: the two leaves keep their edges: the door names no store address and the shell reaches only the declaration table', async () => {
    // The door still resolves no catalogue and no store of its own: what it draws and what it
    // hands back are the mount's, which is the whole reason the plus could be wired at all.
    const STORE_WORDS = ['src/store/', 'makeOp', 'OP_TYPES', 'applyEdit', 'addOpPayloadFor'];
    const namesIn = (src) => STORE_WORDS.filter((word) => src.includes(word));
    expect(namesIn(DOOR_SOURCE)).toEqual([]);
    expect(namesIn("import { makeOp } from 'src/store/editSlice.js'; addOpPayloadFor(card); OP_TYPES; applyEdit;"))
      .toEqual(STORE_WORDS);

    // And the shell's edge set into the edit volume is unmoved by this member.
    const domainEdges = [...SHELL_SOURCE.matchAll(/from '\.\.\/\.\.\/domain\/edit\/([a-zA-Z]+)\.js'/g)]
      .map((hit) => hit[1]).sort();
    expect(domainEdges).toEqual(['fieldDeclarations']);

    // The two new copy keys the shell leans on resolve, and the door's own new map resolves
    // through the registry rather than through a literal the leaf carries.
    const door = await import('../../src/components/edit/CardEditorDialog.jsx');
    const keys = Object.values(door.ADD_REFUSAL_COPY_KEYS);
    const resolved = keys.map((key) => key.split('.')
      .reduce((branch, part) => (branch == null ? branch : branch[part]), en));
    expect(resolved.map((value) => typeof value)).toEqual(keys.map(() => 'string'));
    expect(resolved.map((value, index) => value === keys[index])).toEqual(keys.map(() => false));
  });
});
