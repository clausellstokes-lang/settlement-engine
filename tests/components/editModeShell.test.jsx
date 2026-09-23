/** @vitest-environment jsdom */
/**
 * editModeShell.test.jsx — EM-D1's acceptance cases over the edit-mode shell, its mount
 * and the library's door into it.
 *
 * ⭐ WRITTEN AND RUN BEFORE THE SHELL EXISTED. With `src/components/edit/EditModeShell.jsx`
 * absent this file cannot even collect, so no arm here was ever green before its subject
 * was built; the gate batch re-proves it by moving the leaf aside and back, and the two
 * source arms are re-proved by planting `git show HEAD:src/App.jsx` and
 * `git show HEAD:src/components/settlements/SettlementCard.jsx` over the tree.
 *
 * ⛔ THE GATE IS THE LANDED PREDICATE, NOT A RETYPED ONE. `createAuthSlice` is composed
 * over this file's own store fixture, so A1 measures `canEditSettlement()` exactly as
 * `src/store/authSlice.js` spells it today — the staff-dark conjunct included. An arm
 * that retyped the rule would go on passing the day the owner deletes that conjunct,
 * which is the one act this member must not anticipate (design §20.4, judgment 268).
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY — set equalities against
 * `[]`, counts against numbers, scanners driven over a control source in the same arm —
 * so no `// anchored:` marker is owed anywhere in this file, exactly as
 * tests/components/cardEditorDialog.test.jsx does it.
 *
 * ⛔ THE WRITER IS OBSERVED, NEVER RE-PROVEN. `applyPlainEditIntent` is replaced by a
 * recorder so A3 reads the four coordinates the door hands it; that the real binder moves
 * the draft through the one generic adapter is EM-C4b's own landed arm
 * (tests/store/editSlice.test.js, "A7 — the dialog's four-coordinate intent reaches the
 * writer THROUGH the one generic adapter"). Two arms, one fact each.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import { codeOnly } from '../helpers/codeOnlySource.js';
import { en } from '../../src/copy/en.js';
import { t } from '../../src/copy/index.js';
import { declarationsFor, FIELD_DECLARATIONS } from '../../src/domain/edit/fieldDeclarations.js';
import { createAuthSlice } from '../../src/store/authSlice.js';
import { STAFF_ROLES } from '../../src/lib/staffEntitlements.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SHELL_PATH = 'src/components/edit/EditModeShell.jsx';
const SHELL_SOURCE = readFileSync(join(ROOT, SHELL_PATH), 'utf8');
const APP_SOURCE = readFileSync(join(ROOT, 'src/App.jsx'), 'utf8');
const CARD_SOURCE = readFileSync(join(ROOT, 'src/components/settlements/SettlementCard.jsx'), 'utf8');

/** The record the shell reads: one person, one institution, one faction, one seat. */
const NPC_ID = 'npc-1';
const SETTLEMENT = Object.freeze({
  id: 'save-1',
  name: 'Stoneford',
  tier: 'town',
  culture: 'germanic',
  npcs: [Object.freeze({ id: NPC_ID, name: 'Alda', role: 'Reeve', status: 'active', note: '' })],
  institutions: [Object.freeze({ id: 'inst-1', name: 'The Mill', category: 'trade', state: 'sound' })],
  powerStructure: Object.freeze({
    governingName: 'Alda',
    factions: [Object.freeze({ id: 'fac-1', faction: 'The Guild', category: 'trade', power: 40 })],
  }),
  config: Object.freeze({ terrainType: 'plains', culture: 'germanic' }),
});

/** The mutable store every mount reads through the fake `useStore` below. */
const storeState = {};
/** Every `setUserPref` the surfaces under test made, in order. */
const prefWrites = [];
/** Every intent the door handed the binder, in order. */
const intents = [];
/** Every row the library card asked to open, in order. */
const opened = [];

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) {
    return selector(storeState);
  }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  useStore.setState = (recipe) => recipe(storeState);
  return { useStore };
});

// The writer, RECORDED. Everything else the slice exports is the real export, so the
// shell's mode reader, its preference key and its named OFF are the landed ones.
vi.mock('../../src/store/editSlice.js', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    applyPlainEditIntent: (get, set, intent) => {
      intents.push(intent);
      return Promise.resolve({ ok: true, saveId: 'save-1', keys: [], layer: {} });
    },
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

/**
 * The store as one session: an editor mode that is ON, a live draft, and the real gate.
 * @param {string} tier @param {string|null} role
 */
function seatState(tier, role) {
  for (const key of Object.keys(storeState)) delete storeState[key];
  Object.assign(storeState, {
    auth: { tier, role, user: role === null ? null : { id: 'u1' } },
    userPrefs: { editorMode: 'plain' },
    settlement: SETTLEMENT,
    activeSaveId: 'save-1',
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

/** Mount the shell. The import is dynamic so every mock above is installed first. */
async function mountShell() {
  const EditModeShell = (await import('../../src/components/edit/EditModeShell.jsx')).default;
  return render(<EditModeShell />);
}

/** Mount one library row, in the table shape both of its call sites wrap it in. */
async function mountLibraryRow() {
  const { SettlementCard } = await import('../../src/components/settlements/SettlementCard.jsx');
  return render(
    <table>
      <tbody>
        <SettlementCard
          s={{ id: 'save-1', name: 'Stoneford', settlement: SETTLEMENT, savedAt: 1 }}
          allModifiers={new Map()}
          onView={(row) => opened.push(row)}
          deleteId={null}
          setDeleteId={() => {}}
          deleteConfirmed={() => {}}
          campaigns={[]}
          addToCampaign={() => {}}
          removeFromCampaign={() => {}}
          currentCampaignId={null}
          regionalCounts={{}}
          onReactivate={() => {}}
          canReactivate={false}
          reactivatingId={null}
          onCanonize={() => {}}
        />
      </tbody>
    </table>,
  );
}

/** Every accessible button name on the mounted surface, sorted. */
const buttonNames = () => screen.queryAllByRole('button')
  .map((node) => (node.getAttribute('aria-label') || node.textContent || '').trim()).sort();

/** Every literal first argument of a `t(` call in one source, de-duplicated and sorted. */
const copyKeysIn = (src) => [...new Set([...src.matchAll(/\bt\(\s*'([^']+)'/g)].map((hit) => hit[1]))].sort();

/** Every literal copy key held in one of the shell's own frozen key maps. */
const mappedKeysIn = (src) => [...new Set([...src.matchAll(/'(edit\.shell\.[a-zA-Z.]+)'/g)].map((hit) => hit[1]))].sort();

/** One dotted key resolved against `en`, or undefined. */
const resolve = (key) => key.split('.').reduce((branch, part) => (branch == null ? branch : branch[part]), en);

/**
 * Every tier fact a gate-flipping shell would have to spell. The scan reads CODE through
 * the estate's shared comment strip, so the shell may RECORD in prose what it must not
 * DO, which is exactly the boundary judgment 268 draws.
 */
const TIER_WORDS = ['premium', 'settlementEditor', 'isStaffRole', 'TIER_GATE'];
const tierWordsIn = (src) => TIER_WORDS.filter((word) => codeOnly(src).includes(word));

/** The pencil marker judgment 264c forbids, and the scanner that looks for it. */
const PENCIL_MARKER = 'data-edit-pencil';
const markerHitsIn = (src) => (src.includes(PENCIL_MARKER) ? [PENCIL_MARKER] : []);

/** Every card type EM-A1 declares, read from the landed table and never retyped. */
const DECLARED_CARDS = Object.keys(FIELD_DECLARATIONS).sort();
/**
 * ⭐ EM-F3's CREATE-ONLY CARD, NAMED RATHER THAN FILTERED BY A SHAPE. The phantom card is
 * declared like any other, and it wears NO pencil: its subject is a SAVE OF ITS OWN rather than
 * a row of this record (design §2.8), so the shell's register does not name it and the only door
 * onto it is the counterparties roster's plus, which EM-F3's own suite proves. Naming it here
 * keeps A2's set equality EXACT in both directions — a card that stopped being create-only, or a
 * new one that quietly took a pencil, still reds.
 */
const CREATE_ONLY_CARDS = ['phantom'];
const PENCIL_CARDS = DECLARED_CARDS.filter((card) => !CREATE_ONLY_CARDS.includes(card));
/** Of those, the ones whose subjects live in a roster (an `outputKey` with a `[]`). */
const ROSTER_CARDS = DECLARED_CARDS
  .filter((card) => declarationsFor(card).some((row) => String(row.outputKey || '').includes('[]')))
  .sort();

beforeEach(() => {
  prefWrites.length = 0;
  intents.length = 0;
  opened.length = 0;
  seatState('premium', STAFF_ROLES[0]);
});
afterEach(() => cleanup());

describe('EM-D1 — the edit-mode shell', () => {
  it('A1: the landed gate refuses anon and free in the house shape, and the account it admits enters', async () => {
    seatState('anon', null);
    const anon = await mountShell();
    const anonAlerts = screen.queryAllByRole('alert');
    expect(anonAlerts.length).toBe(1);
    expect(anonAlerts[0].textContent).toContain(t('edit.shell.refusalGated'));
    expect(buttonNames()).toEqual([]);
    expect(anon.container.textContent.includes(t('edit.shell.indicator'))).toBe(false);
    cleanup();

    seatState('free', null);
    await mountShell();
    expect(screen.queryAllByRole('alert').length).toBe(1);
    expect(buttonNames()).toEqual([]);
    cleanup();

    // The account the predicate ADMITS today. This is the one arm that would change the
    // day the owner opens the door, and it changes by measurement, not by an edit here.
    seatState('premium', STAFF_ROLES[0]);
    const admitted = await mountShell();
    expect(screen.queryAllByRole('alert').length).toBe(0);
    expect(screen.getByRole('region', { name: t('edit.shell.title') })).toBe(
      admitted.container.querySelector('section'),
    );
    expect(admitted.container.textContent.includes(t('edit.shell.indicator'))).toBe(true);
    expect(buttonNames().includes(t('edit.shell.done'))).toBe(true);
  });

  it('A2: the register wears a pencil on every DECLARED card and on no other, a plus on every roster, a seal with its herald line on each process card, the provenance note and Done', async () => {
    await mountShell();
    const names = buttonNames();

    // (i) THE PENCILS, as a positive SET EQUALITY against EM-A1's own five card types.
    //     An undeclared row of the shell's register (war, trade, rumour, chronicle,
    //     goods, services) cannot appear here without breaking this equality.
    const wantedPencils = PENCIL_CARDS
      .map((card) => t('edit.shell.pencil', { card: t(`edit.shell.card.${card}`) })).sort();
    expect(names.filter((name) => wantedPencils.includes(name)).sort()).toEqual(wantedPencils);
    expect(wantedPencils.length).toBe(5);
    // ⭐ EM-F3: the create-only card really is declared (so the exclusion above is a MEASUREMENT
    // of the register rather than a list that silently covers a missing declaration), and every
    // one of its rows carries no outputKey at all, which is what makes it uncollectable and
    // therefore unpencilled.
    expect(CREATE_ONLY_CARDS.filter((card) => !DECLARED_CARDS.includes(card))).toEqual([]);
    expect(CREATE_ONLY_CARDS.flatMap((card) => declarationsFor(card))
      .filter((row) => Object.hasOwn(row, 'outputKey'))).toEqual([]);

    // (ii) THE PLUSES, one per roster root and no more.
    const wantedPluses = ROSTER_CARDS
      .map((card) => t('edit.shell.plus', { card: t(`edit.shell.card.${card}`) })).sort();
    expect(names.filter((name) => wantedPluses.includes(name)).sort()).toEqual(wantedPluses);
    expect(ROSTER_CARDS).toEqual(['faction', 'institution', 'npc']);

    // (iii) THE SEALS. Design §17's five process cards, each act rendered and DISABLED,
    //       each beside the §18 line naming the state it needs.
    const sealNames = Object.keys(en.edit.shell.seal).map((seal) => en.edit.shell.seal[seal]).sort();
    expect(names.filter((name) => sealNames.includes(name)).sort()).toEqual(sealNames);
    expect(sealNames.length).toBe(16);
    const disabled = sealNames
      .map((name) => screen.getByRole('button', { name }).hasAttribute('disabled'));
    expect(disabled).toEqual(sealNames.map(() => true));
    const body = document.body.textContent;
    const reasons = Object.keys(en.edit.shell.reason).map((id) => en.edit.shell.reason[id]);
    expect(reasons.map((line) => body.includes(line))).toEqual(reasons.map(() => true));
    expect(body.includes(t('edit.shell.actsNote'))).toBe(true);

    // (iv) §14's PROVENANCE NOTE on the two derived cards, and DONE.
    const worldFacts = t('edit.shell.card.worldFact');
    expect(body.includes(t('edit.shell.provenance', { source: worldFacts }))).toBe(true);
    expect(body.includes(t('edit.shell.card.goods'))).toBe(true);
    expect(body.includes(t('edit.shell.card.services'))).toBe(true);
    expect(names.includes(t('edit.shell.done'))).toBe(true);

    // (v) DONE LEAVES THE MODE, through the slice's own key and its NAMED off.
    const slice = await import('../../src/store/editSlice.js');
    fireEvent.click(screen.getByRole('button', { name: t('edit.shell.done') }));
    expect(prefWrites).toEqual([[slice.EDITOR_MODE_PREF_KEY, slice.EDITOR_MODE_OFF]]);
  });

  it('A3: a pencil opens the door, and the door hands applyPlainEditIntent the four coordinates of the edited field', async () => {
    await mountShell();
    expect(intents).toEqual([]);

    const person = t('edit.shell.card.npc');
    fireEvent.click(screen.getByRole('button', { name: t('edit.shell.pencil', { card: person }) }));

    // The door is EM-D0e's real generated surface: its title and its Save control are up,
    // and it generated a control for the person card's own declared rows.
    expect(screen.queryAllByText(t('edit.dialog.title')).length).toBeGreaterThan(0);
    const note = declarationsFor('npc').filter((row) => row.field === 'note')[0];
    fireEvent.change(screen.getByLabelText(note.label), { target: { value: 'Owes the miller' } });
    fireEvent.click(screen.getByRole('button', { name: t('edit.dialog.save') }));

    await vi.waitFor(() => expect(intents.length).toBe(1));
    expect(intents).toEqual([
      { cardType: 'npc', entityId: NPC_ID, field: note.field, value: 'Owes the miller' },
    ]);
  });

  it('A4: the library row offers Edit behind the landed gate alone, and entering sets the editor mode and opens the same dossier', async () => {
    seatState('free', null);
    await mountLibraryRow();
    expect(buttonNames().filter((name) => name === t('edit.shell.enterNamed', { name: 'Stoneford' }))).toEqual([]);
    cleanup();

    seatState('premium', STAFF_ROLES[0]);
    await mountLibraryRow();
    const enter = screen.getByRole('button', { name: t('edit.shell.enterNamed', { name: 'Stoneford' }) });
    expect(enter.textContent.trim()).toBe(t('edit.shell.enter'));
    fireEvent.click(enter);

    const slice = await import('../../src/store/editSlice.js');
    await vi.waitFor(() => expect(prefWrites.length).toBe(1));
    await vi.waitFor(() => expect(opened.length).toBe(1));
    expect(prefWrites).toEqual([[slice.EDITOR_MODE_PREF_KEY, 'plain']]);
    expect(slice.EDITOR_MODES.filter((mode) => mode === 'plain')).toEqual(['plain']);
    expect(opened[0].id).toBe('save-1');
  });

  it('A5: the App root reaches the shell through exactly one lazy edge and no static one, which is the whole of the +0 first-paint price', () => {
    // ⛔ THE MEMBERSHIP HALF OF THIS CASE LIVES IN A NODE ENVIRONMENT, not here: reading
    //    `EAGER_FIRST_PAINT_MODULES` pulls vite's own esbuild binding, which refuses to
    //    load under jsdom. EM-D1 therefore widened the editor-train arm of
    //    tests/build/vendorPdfLazy.test.js with this file's path, where the eager set is
    //    read from the build config's own exported derivation. What is measured HERE is
    //    the FORM of the edge that makes that membership true, off the root's own source.
    const lazyEdge = "lazy(() => import('./components/edit/EditModeShell.jsx'))";
    expect(APP_SOURCE.split(lazyEdge).length).toBe(2);
    expect(APP_SOURCE.split("from './components/edit/").length).toBe(1);
    // GUARD-THE-GUARD: the same split convicts a source that DOES carry a static edge.
    expect("import Shell from './components/edit/EditModeShell.jsx';"
      .split("from './components/edit/").length).toBe(2);
    // The shell is mounted exactly once, and behind the preference the entry writes.
    expect(APP_SOURCE.split('<EditModeShell />').length).toBe(2);

    // ⛔ AND THE BOUNDARY IS NARRATED, NOT SILENT (the witnessed-wait ratchet,
    // tests/lint/loadingNarrationRatchet.test.js). This fallback really paints: the
    // chunk is fetched over the network the first time a DM enters edit mode, so the
    // wait is perceptible and the ratchet's justify-imperceptible door does not apply.
    const mountBlock = APP_SOURCE.split('<EditModeShell />')[0].split('{editorMode ?')[1];
    expect(mountBlock.includes('role="status"')).toBe(true);
    expect(mountBlock.includes('fallback={null}')).toBe(false);
    // GUARD-THE-GUARD: the same slice of a silent boundary reads the other way.
    expect('{editorMode ? (<Suspense fallback={null}>'.includes('fallback={null}')).toBe(true);
  });

  it('A6: every string the two surfaces render comes from en.js through t(), and every key the shell maps resolves', async () => {
    const slice = await import('../../src/store/editSlice.js');
    const shellKeys = [...new Set([...copyKeysIn(SHELL_SOURCE), ...mappedKeysIn(SHELL_SOURCE)])].sort();
    const values = shellKeys.map((key) => resolve(key));
    expect(values.map((value) => typeof value)).toEqual(shellKeys.map(() => 'string'));
    expect(values.map((value, index) => value === shellKeys[index])).toEqual(shellKeys.map(() => false));
    expect(values.map((value) => String(value).includes('—') || String(value).includes('!')))
      .toEqual(shellKeys.map(() => false));
    expect(shellKeys.filter((key) => key.startsWith('edit.')).length).toBe(shellKeys.length);

    // The library door's own two keys, and the join that keeps App.jsx's bare preference
    // read spelled exactly as the slice's own key: a rename there reds HERE.
    expect(copyKeysIn(CARD_SOURCE).filter((key) => key.startsWith('edit.')))
      .toEqual(['edit.shell.enter', 'edit.shell.enterNamed']);
    expect(APP_SOURCE.split(`s.userPrefs?.${slice.EDITOR_MODE_PREF_KEY}`).length).toBe(2);

    // ⛔ THE WAIT LINE'S JOIN. Its one home is the registry; the EAGER root spells it as
    // a literal because reaching `t()` there would pull copy/index.js and en.js into the
    // first-paint closure (measured 270 -> 272 modules), which the editor-train arm
    // refuses. This equality is what keeps the two from drifting apart.
    expect(typeof en.edit.shell.opening).toBe('string');
    expect(APP_SOURCE.split(en.edit.shell.opening).length).toBe(2);
    expect(en.edit.shell.opening.includes('\u2014') || en.edit.shell.opening.includes('!')).toBe(false);
    expect(CARD_SOURCE.split("import('../../store/editSlice.js')").length).toBe(2);
  });

  it('A7: the shell spells no tier fact and mints no pencil marker, each scanner driven over a control in the same arm', () => {
    expect(tierWordsIn(SHELL_SOURCE)).toEqual([]);
    expect(tierWordsIn('const gate = TIER_GATE.premium.settlementEditor;'))
      .toEqual(['premium', 'settlementEditor', 'TIER_GATE']);
    expect(markerHitsIn(SHELL_SOURCE)).toEqual([]);
    expect(markerHitsIn('<span data-edit-pencil="npc" />')).toEqual([PENCIL_MARKER]);

    // The mutation path: the shell reaches the declaration table and nothing else of the
    // edit volume, so no op producer and no layer can enter through it.
    const domainEdges = [...SHELL_SOURCE.matchAll(/from '\.\.\/\.\.\/domain\/edit\/([a-zA-Z]+)\.js'/g)]
      .map((hit) => hit[1]).sort();
    expect(domainEdges).toEqual(['fieldDeclarations']);
  });

  it('A8: the mode the slice reads as OFF renders nothing at all', async () => {
    const slice = await import('../../src/store/editSlice.js');
    storeState.userPrefs = { editorMode: slice.EDITOR_MODE_OFF };
    const off = await mountShell();
    expect(off.container.innerHTML).toBe('');
    cleanup();

    // An unknown stored word is OFF by the slice's own reader, so the shell is silent
    // there too, and the control below proves the mount is otherwise live.
    storeState.userPrefs = { editorMode: 'not-a-mode' };
    const unknown = await mountShell();
    expect(unknown.container.innerHTML).toBe('');
    cleanup();

    storeState.userPrefs = { editorMode: 'plain' };
    const on = await mountShell();
    expect(on.container.innerHTML.length).toBeGreaterThan(0);
  });
});
