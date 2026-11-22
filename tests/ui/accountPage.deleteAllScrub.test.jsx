/**
 * @vitest-environment jsdom
 *
 * accountPage.deleteAllScrub.test.jsx — EM-F3d-c: THE ACCOUNT DOOR'S "DELETE ALL" PERSISTS
 * THE SCRUB ON EVERY BRANCH IT WRITES (the verifier's pass 2b, FIX-9; U112).
 *
 * THE GAP THESE ARMS CONVICT, measured by pass 2b and re-executed in F1 below. There are
 * exactly TWO product callers of the delete chokepoint `removeSavedSettlement`: the Library's
 * act (`createLibraryDeleteHandlers`, whose durable half EM-F3d-b landed) and this page's
 * `handleDeleteAllSettlements`. EM-F3d-b declared this second door OUT on the reason that it
 * "deletes EVERY row and then `clearSavedSettlements()`, so the scrub has no surviving
 * registry to write" — which is true on the SUCCESS path and FALSE on the PARTIAL-FAILURE
 * path the same function writes. A row whose server delete is REJECTED survives the wipe,
 * the chokepoint still runs for every id that succeeded, and `scrubDeletedCounterparty`
 * withdraws that survivor's pending decrees in the LIVE VIEW — while this door's only write
 * is `savesService.delete`, so the withdrawal never reaches the store. NOTE-10's own class,
 * on a door U110's cure does not reach.
 *
 * ⛔ THE TWO BRANCHES ARE READ SEPARATELY, AND THE WHOLE-LIBRARY ONE IS MEASURED RATHER THAN
 * ASSUMED. F2 is a golden by copy over the success path: every cached row is named by the
 * act, so no survivor is left that could name a deleted id, the identity diff is empty, and
 * the door sends exactly the batches it sent before — none. That is the arm which would red
 * if this cure ever started writing on a path it has no business writing on.
 *
 * ⛔ AND THE ORDER'S COUNTERFORCE IS PINNED (F3), EM-F3d-b's D8 for this door: a
 * `target_deleted` withdrawal written for a delete that never happened is design §20.3's
 * reason saying something FALSE about a save that is still there. Only ids the server
 * actually deleted reach the chokepoint, so a refused delete withdraws nothing anywhere.
 *
 * Substrate: LOCAL mode (the supabase mock below) with the estate's REAL settlement slice,
 * REAL edit lane and REAL save service, and the page rendered by the product's own component
 * — so the handler under test is `AccountPage`'s own closure rather than a replica of it.
 * The reload is `saves.list()` itself, exactly as `deleteScrub.test.js` D6/D9 read it.
 *
 * ⛔ EVERY WOULD-BE NEGATIVE IS SPELLED AS A POSITIVE EQUALITY — one string against another,
 * counts against numbers, status lists against status lists — so no `// anchored:` marker is
 * owed anywhere in this file.
 *
 * @enforced-by this test
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

afterEach(cleanup);

// Force LOCAL mode: the save service binds localStorage, never a network client.
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: null,
  isConfigured: false,
  setSessionPersistence: () => {},
  hasActiveRecoveryFlow: () => false,
  consumeRecoveryFlow: () => null,
}));

/** Analytics is a transport with its own suites; the mount path only needs it quiet. */
vi.mock('../../src/lib/analytics.js', () => ({
  track: vi.fn(),
  Funnel: { track: vi.fn() },
  EVENTS: new Proxy({}, { get: (_target, key) => String(key) }),
}));

/**
 * The Data & Privacy panel is stood in for so the page's own handler is driven directly —
 * its rejection is the assertion target, not an unhandled escape through the child's confirm
 * flow. `accountPage.deleteAllSettlements.test.jsx`'s own idiom, kept identical.
 */
let dataSectionProps = null;
vi.mock('../../src/components/account/AccountDataPrivacySection.jsx', () => ({
  default: (props) => { dataSectionProps = props; return null; },
}));

/**
 * ⛔ THE ONE PIECE OF ASSEMBLY STOOD IN FOR. The page reaches the store through the app's
 * SINGLETON (`src/store/index.js`), which composes every slice in the estate. This seat hands
 * it THIS file's own composed store: the same real settlement slice, the same real edit lane,
 * the same real save service. The component under test is the product's, unchanged.
 */
const storeSeat = vi.hoisted(() => ({ current: /** @type {any} */ (null) }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(storeSeat.current.getState());
  useStore.getState = () => storeSeat.current.getState();
  useStore.subscribe = () => () => {};
  return { useStore };
});

import { saves } from '../../src/lib/saves.js';
import { makeOp, OP_TYPES } from '../../src/domain/edit/operations.js';
import { DELETE_SCRUB_REASONS } from '../../src/store/editSlice.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';

const OWNER = 'u1';
const OPEN_ID = 'row-ashford';
const COUNTERPARTY_ID = 'row-greymoor';
const MEMBER_ID = 'row-bramford';

const OPEN_RECORD = Object.freeze({
  _seed: 'seed-ashford', id: 'set-ashford', name: 'Ashford', tier: 'town', npcs: [], factions: [],
});

const envelope = (id, name, seed, record = {}) => ({
  id, name, tier: 'town', seed,
  settlement: {
    _seed: seed, id: `set-${name.toLowerCase()}`, name, tier: 'town', npcs: [], factions: [], ...record,
  },
  config: { settType: 'town' }, aiData: {}, versionHistory: [],
});

/**
 * One off-stage decree, built through the CATALOGUE's own constructor at the row's declared
 * target kind — `deleteScrub.test.js`'s road, so no arm here depends on a hand-built op.
 */
const pendingAgainst = (counterparty) => ([{
  id: 'd_far', status: 'pending', addedBy: 'dm', orderIndex: 0, orderedAt: '2026-09-23T00:00:00.000Z',
  op: makeOp('declare-war', { kind: OP_TYPES['declare-war'].target, id: counterparty }, { counterparty }),
}]);

/** The base the slice is composed onto: the ~12 selectors the page reads and nothing else. */
const stubSlice = () => ({
  auth: {
    user: { id: OWNER, email: 'tester@example.com' },
    session: { access_token: 'session-u1' },
    loading: false, tier: 'free', role: 'user', displayName: 'Tester', avatarUrl: '',
    emailNotifications: true, modelPreference: null, isFounder: false,
  },
  creditBalance: 0,
  isElevated: () => false,
  isDeveloper: () => false,
  maxSaves: () => 3,
  canSave: () => true,
  campaigns: [],
  authSignOut: () => {},
  deleteCampaign: () => {},
  importAccountData: () => {},
  setAuth: () => {},
  productPrefs: {},
  setProductPref: () => {},
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
});

async function seatedStore() {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
  const rows = await saves.list();
  store.setState((state) => {
    state.settlement = { ...OPEN_RECORD };
    state.activeSaveId = OPEN_ID;
    state.savedSettlements = rows;
    state.savedSettlementsLoaded = true;
    state.savedSettlementsOwnerId = OWNER;
    state.savedSettlementsHydrationGeneration = 0;
    // The deletion LOCK is campaignSlice's and this file does not compose that slice, so it
    // is seated with the one thing the act asks of it — a mutation token. Its refusals are
    // `accountPage.deleteAllSettlements.test.jsx`'s own ground and are not re-proved here.
    state.withSettlementDeletionLock = async (_ids, operation) =>
      operation({ mutationToken: 'em-f3d-c-lock', campaignIds: [] });
  });
  storeSeat.current = store;
  return store;
}

async function mountDataSection() {
  dataSectionProps = null;
  const AccountPage = (await import('../../src/components/AccountPage.jsx')).default;
  render(<AccountPage routeSection="data" onNavigateAdmin={() => {}} />);
  expect(dataSectionProps).not.toBeNull();
  return dataSectionProps;
}

/** THE RELOAD: one row's registry as the next boot reads it, from the save service itself. */
async function persistedStatusesOf(saveId) {
  const row = (await saves.list()).find((entry) => String(entry.id) === String(saveId));
  return (row?.settlement?.decrees || []).map((entry) => `${entry.id}:${entry.status}`);
}

/** The same registry on the LIVE view, off the store the page just wrote. */
function viewStatusesOf(store, saveId) {
  const row = (store.getState().savedSettlements || []).find((entry) => String(entry.id) === String(saveId));
  return (row?.settlement?.decrees || []).map((entry) => `${entry.id}:${entry.status}`);
}

/**
 * The scrub rides a DYNAMIC import (the edit lane is kept out of first paint), so at the base
 * nothing awaits it. Draining a macrotask before the view is read is what makes the base's
 * live-view line deterministic — and it is exactly the reading pass 2b's probe took.
 */
const settleScrub = () => new Promise((resolve) => { setTimeout(resolve, 0); });

/** The one delete the server refuses, with every other id going through the real backend. */
function refuseDeleteOf(refused) {
  const realDelete = saves.delete;
  return vi.spyOn(saves, 'delete').mockImplementation((id, ...rest) => (
    refused.includes(String(id))
      ? Promise.reject(new Error('row-level security violation'))
      : realDelete(id, ...rest)
  ));
}

beforeEach(async () => {
  globalThis.localStorage.clear();
  await saves.save(envelope(OPEN_ID, 'Ashford', 'seed-ashford'));
  await saves.save(envelope(COUNTERPARTY_ID, 'Greymoor', 'seed-greymoor'));
  await saves.save(envelope(MEMBER_ID, 'Bramford', 'seed-bramford', {
    decrees: pendingAgainst(COUNTERPARTY_ID),
  }));
});

describe('EM-F3d-c — the account page\'s delete-all persists the scrub on every branch it writes', () => {
  test('F1: THE PARTIAL FAILURE — a survivor scrubbed on the view reaches the STORE in the same act', async () => {
    const store = await seatedStore();

    // THE KEY IS ALREADY CARRIED, MEASURED BEFORE THE ACT: `decrees` round-trips through the
    // save service today, so this cure asks for NO persisted-shape change — only that the
    // rows the scrub moved go down in the act that moved them.
    expect(await persistedStatusesOf(MEMBER_ID),
      'the persisted registry names the counterparty, pending').toEqual(['d_far:pending']);

    // The MEMBER's delete is the one the server refuses, so it SURVIVES the wipe holding a
    // pending decree that names a row the same act DID delete.
    const refused = refuseDeleteOf([MEMBER_ID]);
    const props = await mountDataSection();
    await expect(props.onDeleteAllSettlements(),
      'the door refuses to report a clean wipe that did not happen').rejects.toThrow(/1 of 3/);
    refused.mockRestore();
    await settleScrub();

    // ⭐ THE TWO LINES THE VERIFIER'S PROBE PRINTED, IN ITS OWN WORDS. At the base the second
    // read `VP2b ON DISK : d_far:pending` — the scrub reached the view and never the store.
    expect(`VP2b LIVE VIEW : ${viewStatusesOf(store, MEMBER_ID).join(',')}`)
      .toBe('VP2b LIVE VIEW : d_far:withdrawn');
    expect(`VP2b ON DISK : ${(await persistedStatusesOf(MEMBER_ID)).join(',')}`)
      .toBe('VP2b ON DISK : d_far:withdrawn');

    const reloaded = await saves.list();
    const entry = reloaded.find((row) => String(row.id) === MEMBER_ID).settlement.decrees[0];
    expect(entry.withdrawnReason, 'with design §20.3\'s reason, naming the id that went')
      .toEqual({ kind: 'target_deleted', missing: 'target', was: COUNTERPARTY_ID });
    expect(entry.withdrawnReason.kind, 'and the one closed reason this door may produce')
      .toBe(DELETE_SCRUB_REASONS[0]);
    expect([entry.id, entry.orderIndex], 'the entry is KEPT, in its own place (design §2.5a)')
      .toEqual(['d_far', 0]);
    expect(String(entry.op?.payload?.counterparty ?? ''),
      'and the DM\'s own words are unedited on the persisted row').toBe(COUNTERPARTY_ID);

    // THE SURVIVOR IS STILL A SURVIVOR: the refused row stays in the library, on the view and
    // on disk, so the DM's "they remain in your library. Try again." is true.
    expect(reloaded.map((row) => String(row.id)), 'only the server-confirmed rows left the library')
      .toEqual([MEMBER_ID]);
    expect((store.getState().savedSettlements || []).map((row) => String(row.id)),
      'and the cache kept exactly the same one').toEqual([MEMBER_ID]);
  });

  test('F2: THE WHOLE-LIBRARY BRANCH — every row is named, so the act is byte-equal to today', async () => {
    const store = await seatedStore();
    const batch = vi.spyOn(saves, 'mutateBatch');
    const props = await mountDataSection();

    await expect(props.onDeleteAllSettlements(),
      'every server delete fulfilled, so the door reports a clean wipe').resolves.toBeUndefined();
    const sent = batch.mock.calls.length;
    batch.mockRestore();
    await settleScrub();

    // ⭐ MEASURED, NOT ASSUMED — this is EM-F3d-b's declared-out reason, read rather than
    // argued. Every cached row was named by the act, so nothing survives that could name a
    // deleted id, the identity diff is empty and this branch sends the batches it always
    // sent: none. A cure that wrote here would red this arm.
    expect(sent, 'no further batch goes down when the whole library goes').toBe(0);
    expect(JSON.stringify(await saves.list()),
      'and the persisted library is empty, exactly as it was before this cure').toBe('[]');
    expect(store.getState().savedSettlements,
      'the cache was cleared wholesale by the success branch').toEqual([]);
  });

  test('F3: THE COUNTERFORCE — a delete the server refused withdraws nothing, on the view or on disk', async () => {
    const store = await seatedStore();

    // The COUNTERPARTY's delete is refused this time, and the member's with it, so both rows
    // survive: the decree naming a row that is STILL THERE must stay pending everywhere.
    const refused = refuseDeleteOf([COUNTERPARTY_ID, MEMBER_ID]);
    const batch = vi.spyOn(saves, 'mutateBatch');
    const props = await mountDataSection();
    await expect(props.onDeleteAllSettlements(),
      'the door names how many rows remain').rejects.toThrow(/2 of 3/);
    const sent = batch.mock.calls.length;
    refused.mockRestore();
    batch.mockRestore();
    await settleScrub();

    // ⛔ THIS IS WHY ONLY SERVER-CONFIRMED IDS REACH THE CHOKEPOINT. A `target_deleted`
    // withdrawal written for a delete that never happened is design §20.3's reason saying
    // something FALSE about a save that is still there.
    expect(viewStatusesOf(store, MEMBER_ID),
      'the counterparty was never deleted, so its decree stands on the view').toEqual(['d_far:pending']);
    expect(await persistedStatusesOf(MEMBER_ID),
      'and nothing false was written to disk').toEqual(['d_far:pending']);
    expect(sent, 'the act sent no scrub batch at all').toBe(0);
    expect((await saves.list()).map((row) => String(row.id)).sort(),
      'both refused rows are still in the library').toEqual([MEMBER_ID, COUNTERPARTY_ID].sort());
  });
});
