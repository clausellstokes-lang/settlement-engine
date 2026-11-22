/**
 * pulseRewindChronicle.test.js — EM-C1c: AN UNDONE ADVANCE RETRACTS THE CHRONICLE LINES
 * IT WROTE, AND NOTHING ELSE (U98; judgment 306; design §12.1 and §2.6; ARCH §6).
 *
 * ⛔ WHAT EM-C1b LEFT, MEASURED AND NOT CURED. EM-C1b unit 2 made an applied decree write
 * its line into the campaign's one `chronicles[]`. Its seat then measured the other half
 * of the lifecycle over the real store and reported it rather than curing it, because the
 * file was another seat's: `[undo=true, chroniclesBefore=1, chroniclesAfter=1,
 * decreeStatus='pending', chronicleRef=undefined]`. The rewind returned the decree to the
 * waiting sequence and correctly took its reference off, and the LINE stayed in the
 * scrollback with nothing pointing at it — an orphan sentence about an act the realm no
 * longer remembers ordering. Case C1c-1 is that measurement, cured.
 *
 * ⛔ WHY THE RETRACTION IS BY ADDRESS AND NEVER BY LENGTH, MEASURED IN CASE C1c-2. The
 * campaign's one writer (`appendCampaignChronicle`) PREPENDS — newest first — so a line
 * the wizard's paid AI prose writes AFTER the advance sits AHEAD of the tick's own line in
 * the array. Any retraction that trusted a count, a length or an index would delete the
 * table's newest paid sentence and keep the one it meant to remove. So the rewind removes
 * exactly the addresses the undone tick minted (`decree:<id>`, EM-E2's own grammar, which
 * the hook writes onto the entry at the instant of application and which
 * `decreeChronicleLine` records the line under), and a line minted by any other hand
 * cannot collide with one: the wizard's entries take the store's `chronicle_<campaign>_…`
 * id, never a decree's.
 *
 * ⛔ AND HISTORY IS NOT RETRACTED, measured in case C1c-3. The address set is derived from
 * the rows themselves and not from a tick RANGE, by exactly the reasoning `rewoundDecrees`
 * already gives for its stale refs: a decree the SNAPSHOT already holds as APPLIED was
 * applied before the state being restored to, so its line is history and stays (THE
 * PROMISE). That is what makes the one chokepoint correct for both of its callers at once
 * — the advance undo rewinding a whole interval, and the proposal undo rewinding no tick.
 *
 * Every arm drives the REAL store over the two real slices, the REAL advance and the REAL
 * `undoLastPulse`, in the shape `tests/simulation/decreeChronicleVoice.test.js` uses, so
 * the claim is about the campaign's own scrollback and not about a helper in isolation.
 *
 * @enforced-by this test
 */
import { describe, expect, it, vi } from 'vitest';

// The durable cloud-write seams a hydrated campaign reaches. Stubbed so this suite is
// headless, in the shape tests/store/advanceFullAutoResolve.test.js already uses.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));
vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = (/** @type {any} */ value) => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: (/** @type {any} */ campaign) => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, clone(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn((/** @type {any} */ campaign) => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});
vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return { ...actual, track: vi.fn() };
});

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { campaigns } from '../../src/lib/campaigns.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import { markApplied, stage } from '../../src/domain/edit/registry.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';

// ── EM-C1b's own fixture: one real town, one real op, one real campaign ─────────────────
const NOW = '2026-04-04T00:00:00.000Z';

/** @param {string[]} roles @param {unknown[]|null} decrees */
const townOf = (roles, decrees) => ({
  name: 'Ashford', tier: 'city', population: 9000,
  economicState: { prosperity: 'Comfortable' },
  powerStructure: { publicLegitimacy: { score: 55 }, factions: [] },
  institutions: roles.map((role, i) => ({ name: `House ${i}`, role })),
  activeConditions: [],
  ...(decrees ? { decrees } : {}),
});

/** ONE staged, pending `add-npc` whose role is a word the town's own institutions offer. */
const stagedAddNpc = (/** @type {string} */ id, /** @type {string} */ role) => stage([], {
  type: 'add-npc', payload: { name: 'Bram', role }, target: { kind: 'npc', id: 'npc-new' },
}, { id, orderedAt: NOW });

/** @param {string} id @param {string[]} roles @param {unknown[]|null} decrees */
const saveOf = (id, roles, decrees) => ({
  id, name: `Save ${id}`, phase: 'canon',
  settlement: townOf(roles, decrees),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = /** @type {any} */ ({
    getItem: (/** @type {any} */ key) => data.get(String(key)) ?? null,
    setItem: (/** @type {any} */ key, /** @type {any} */ value) => { data.set(String(key), String(value)); },
    removeItem: (/** @type {any} */ key) => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  });
}

/** A real store over the two real slices, seeded with one campaign and its one member. */
function storeWith(/** @type {any} */ save) {
  installLocalStorage();
  const store = create(immer((/** @type {any[]} */ ...a) => ({
    savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
    eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
    ...createCampaignSlice(...a), ...createCampaignWorldPulseSlice(...a),
  })));
  store.setState((/** @type {any} */ state) => {
    state.savedSettlements = [save];
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: [save.id],
      regionalGraph: { edges: [] },
      wizardNews: { currentTick: 1, entries: [] },
      worldState: { rngSeed: 'c1c::rewind', tick: 1, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
  return store;
}

const campaignOf = (/** @type {any} */ store) => store.getState().campaigns[0];
const decreesOf = (/** @type {any} */ store) => store.getState().savedSettlements[0].settlement.decrees || [];
const chronicleIds = (/** @type {any} */ store) => (campaignOf(store).chronicles || []).map((/** @type {any} */ c) => c.id);
/** The scrollback as the PERSIST path left it — the record a reload would read back. */
const cachedChronicleIds = () => (/** @type {any} */ (campaigns.loadCached('anon'))[0]?.chronicles || [])
  .map((/** @type {any} */ c) => c.id);

/**
 * A registry holding one decree ALREADY APPLIED at an earlier tick (with the line reference
 * that tick minted) plus one still pending — the shape a realm wears when the DM's second
 * order is waiting and the first is already history. Both verbs are EM-C1's own.
 */
const HISTORIC_TICK_REF = 'world_pulse.c1c.0';
function registryWithHistory() {
  const staged = stage(stagedAddNpc('d1', 'Steward'), {
    type: 'add-npc', payload: { name: 'Mereth', role: 'Steward' }, target: { kind: 'npc', id: 'npc-two' },
  }, { id: 'd2', orderedAt: NOW });
  return markApplied(staged, 'd1', {
    appliedAt: NOW, tickRef: HISTORIC_TICK_REF, chronicleRef: 'decree:d1',
  });
}

describe('EM-C1c — an undone advance retracts the chronicle lines it wrote', () => {
  it('C1c-1 THE ORPHAN IS CURED: the undone tick\'s line leaves the scrollback with the reference that pointed at it', async () => {
    const store = storeWith(saveOf('a', ['Steward', 'Reeve'], stagedAddNpc('d1', 'Steward')));
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });

    // THE ANCHORS. The advance really applied the decree and really filed its line, so an
    // empty chronicle after the undo is a retraction and not a tick that never happened.
    const applied = decreesOf(store)[0];
    expect(applied.status, 'the advance did not apply the decree').toBe('applied');
    const address = applied.chronicleRef;
    expect(address, 'the applied entry names no chronicle line').toBe('decree:d1');
    const before = (campaignOf(store).chronicles || []).length;
    expect(before, 'the applied decree wrote no chronicle line to retract').toBe(1);
    const idsBefore = chronicleIds(store);
    // The CACHED record as the advance left it — the anti-vacuity half of the persistence
    // claim below: the line must really have reached the cache, or "it is gone from the
    // cache" would pass over a cache that was never written at all.
    const cachedIdsBefore = cachedChronicleIds();

    const undone = await store.getState().undoLastPulse('camp-1');
    expect(undone, 'the rewind refused the advance').toBe(true);

    // EM-C1b's registry half, unchanged: the decree is back in the waiting sequence and its
    // reference is gone — this is what made the surviving line an ORPHAN.
    const rewound = decreesOf(store)[0];
    expect(rewound.status, 'the rewind did not return the decree to pending').toBe('pending');
    expect(Object.hasOwn(rewound, 'chronicleRef'), 'the retracted entry kept a line reference').toBe(false);

    // ⭐ AND THE LINE IS GONE WITH IT. EM-C1b measured `chroniclesAfter=1` here.
    const after = (campaignOf(store).chronicles || []).length;
    expect(after, `the undone tick's chronicle line survived the rewind [before=${before}, after=${after}]`).toBe(0);
    // The address itself, through the estate's own liveness anchor: it was really there
    // before the rewind, and it is really gone after — not a list that drifted away.
    expectPresentThenAbsent(idsBefore, chronicleIds(store), address, 'the undone tick\'s line');

    // ⛔ AND IT SURVIVES THE PERSIST PATH, not only the draft. The rewind caches the campaign
    // record through `cacheCampaignState`, so a retraction that lived only in memory would
    // come back at the next reload — the exact shape of write that survives one path and
    // ghosts another. The cached record is the one the reload reads, and the anchor is the
    // cache's OWN before-state, so this cannot pass over a cache nobody wrote.
    expectPresentThenAbsent(cachedIdsBefore, cachedChronicleIds(), address, 'the CACHED campaign record');
  });

  it('C1c-2 THE WIZARD\'S OWN LINES ARE NOT THE TICK\'S — one written before the advance and one written AFTER it both survive, in their order', async () => {
    const store = storeWith(saveOf('a', ['Steward', 'Reeve'], stagedAddNpc('d1', 'Steward')));
    // The paid Chronicle button's own write, through the campaign slice's one writer.
    store.getState().appendCampaignChronicle('camp-1', { tick: 1, prose: 'Before the tick, the wizard wrote of a quiet season.' });
    const wizardBefore = chronicleIds(store)[0];

    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });
    const address = decreesOf(store)[0].chronicleRef;
    expect(address, 'the advance did not apply the decree').toBe('decree:d1');

    // …and the table asks the wizard for another line AFTER the advance has landed.
    store.getState().appendCampaignChronicle('camp-1', { tick: 2, prose: 'After the tick, the wizard wrote of the road south.' });
    const wizardAfter = chronicleIds(store)[0];

    // ⛔ THE MEASUREMENT THAT DECIDES THE MECHANISM. The writer PREPENDS, so the order is
    // [the wizard's later line, the tick's line, the wizard's earlier line] — the tick's
    // line is NOT at either end, and the newest entry is not the tick's. A retraction by
    // length, by count or by index would take the table's newest paid sentence.
    expect(chronicleIds(store), 'the writer stopped prepending — the interleave measurement below is about a different list')
      .toEqual([wizardAfter, address, wizardBefore]);

    expect(await store.getState().undoLastPulse('camp-1'), 'the rewind refused the advance').toBe(true);

    expect(chronicleIds(store), 'the rewind took a line the wizard wrote, or left the one the tick wrote')
      .toEqual([wizardAfter, wizardBefore]);
    const proses = (campaignOf(store).chronicles || []).map((/** @type {any} */ c) => c.prose);
    expect(proses[0], 'the wizard\'s later line lost its words').toContain('the road south');
    expect(proses[1], 'the wizard\'s earlier line lost its words').toContain('a quiet season');
  });

  it('C1c-3 AN EARLIER TICK\'S LINE IS HISTORY: the rewind retracts only the line the UNDONE tick wrote and leaves the decree the snapshot already held as applied', async () => {
    const store = storeWith(saveOf('a', ['Steward', 'Reeve'], registryWithHistory()));
    // The earlier tick's line is already in the scrollback, under the address that tick minted.
    store.getState().appendCampaignChronicle('camp-1', {
      id: 'decree:d1', tick: 1, prose: 'At the table\'s word, a steward was seated.', createdAt: NOW,
    });
    expect(chronicleIds(store), 'the historic line was not seeded').toEqual(['decree:d1']);

    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });
    const applied = decreesOf(store).find((/** @type {any} */ row) => row.id === 'd2');
    expect(applied?.status, 'the advance did not apply the waiting decree').toBe('applied');
    expect(chronicleIds(store), 'the tick did not file its own line beside the historic one')
      .toEqual(['decree:d2', 'decree:d1']);

    expect(await store.getState().undoLastPulse('camp-1'), 'the rewind refused the advance').toBe(true);

    // ⭐ ONE TICK'S WORTH, AND NO MORE. The older decree was ALREADY APPLIED in the restored
    // snapshot, so it is history (THE PROMISE): it keeps its status, its reference and its
    // line, while the decree this tick applied loses all three.
    const rows = decreesOf(store);
    const historic = rows.find((/** @type {any} */ row) => row.id === 'd1');
    expect(historic?.status, 'the rewind un-applied a decree from an earlier tick').toBe('applied');
    expect(historic?.chronicleRef, 'the rewind took the reference off a historic decree').toBe('decree:d1');
    expect(rows.find((/** @type {any} */ row) => row.id === 'd2')?.status, 'the rewind did not return the undone decree to pending').toBe('pending');
    expect(chronicleIds(store), 'the rewind retracted history, or kept the line it undid').toEqual(['decree:d1']);
  });

  it('C1c-4 DORMANT BY CONSTRUCTION: a rewind that retracts no decree mints no chronicle key, and leaves a wizard-only scrollback byte-identical', async () => {
    const store = storeWith(saveOf('a', ['Steward', 'Reeve'], null));
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });
    expect(campaignOf(store).chronicles, 'a decree-free tick minted a chronicle').toBe(undefined);

    expect(await store.getState().undoLastPulse('camp-1'), 'the rewind refused the advance').toBe(true);
    expect(campaignOf(store).chronicles, 'the rewind MINTED a chronicle key on a realm that had none').toBe(undefined);

    // …and the same rewind over a realm whose only lines are the wizard's touches nothing.
    const second = storeWith(saveOf('a', ['Steward', 'Reeve'], null));
    second.getState().appendCampaignChronicle('camp-1', { tick: 1, prose: 'The wizard wrote of a quiet season.' });
    await second.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });
    const kept = JSON.stringify(campaignOf(second).chronicles);
    expect(await second.getState().undoLastPulse('camp-1'), 'the rewind refused the advance').toBe(true);
    expect(JSON.stringify(campaignOf(second).chronicles), 'the rewind touched a scrollback the tick never wrote to').toBe(kept);
  });
});
