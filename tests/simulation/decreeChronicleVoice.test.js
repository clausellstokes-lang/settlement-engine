/**
 * decreeChronicleVoice.test.js — EM-E2b's TWO MEASUREMENTS and EM-C1b's CURE OF THE FIRST
 * (the verifier's FIX-7 / U76 and NOTE-8 / U78; design §2.6, §11, §18 and §19 ruling 2).
 *
 * ⛔ WHAT CASE E2b-1 IS, AND WHY IT STAYS NOW THAT THE CURE IS IN. EM-E2b STOPPED unit 1 on
 * the measurement this arm executes, and EM-C1b built the cure at the one address that
 * measurement admits. The arm is kept because it is the fact that DECIDES where the writer
 * may sit, and it is as true after the cure as before it:
 *
 *   `markApplied` reaches its row through `amendPending`, which amends a PENDING entry and
 *   nothing else (`registry.js`'s own predicate, `row.status === PENDING`). So the ONE
 *   instant at which an entry can be given a `chronicleRef` is the instant it is applied.
 *   The store's `markDecreeApplied` has no production caller; the only application site in
 *   `src/` is `decreeHook.js :: applyDecreesAtTick`. A writer seated anywhere after the
 *   tick hands `chronicleRef` to a verb that has already refused it — silently, with the
 *   registry re-sealed and the key absent, which is the worst shape a missing write can
 *   take. THAT is why EM-C1b's reference is written inside the hook's own apply and
 *   nowhere else, and the arm below still proves a post-tick writer would be declined.
 *
 * Case E2b-2 is unit 2's own fence: the shell's header says what is TRUE of the seal block.
 * ⭐ RE-RECORDED BY EM-E4d (U88), and the cause is that this member BUILT the binder the old
 * wording was waiting for. At EM-E2b's landing the truth was "the reason line is design §18's
 * register, not a reading of this world"; the shell now asks `worldConditionsOf` for every row
 * of that roster, so the same sentence would be the lie NOTE-8 found. The fence is unchanged
 * in kind — it still holds the header to what the block actually does — and what it now
 * requires is the pair judgment 296 made law: a seal opens only when its condition HOLDS and
 * its act is BOUND, and a §18 line is drawn only where a reading was taken.
 *
 * ⭐ THE C1b ARMS ARE THE CURE, AND THEY DRIVE THE REAL PARTS. The reference the hook writes
 * is held EQUAL to what EM-E2's own `decreeChronicleLine` mints for the same row (the hook
 * may not import the prose leaf — E1-8 pins its import list at exactly two — so the grammar
 * is re-spelled there exactly as `EditModeShell.jsx`'s `chronicleHrefFor` re-spells it, and
 * exactly as that one is, it is held equal by an arm that drives the producer). The line
 * itself is composed and appended by a REAL ADVANCE through the REAL STORE, so the claim
 * is about the campaign's one chronicle and not about a composer in isolation.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
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

import { markApplied, stage } from '../../src/domain/edit/registry.js';
import { applyDecreesToSaves } from '../../src/domain/worldPulse/decreeHook.js';
import { decreeChronicleLine } from '../../src/domain/display/stateProse/decreeProse.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SHELL_REL = 'src/components/edit/EditModeShell.jsx';

/** The shell's own leading block comment, whitespace collapsed so a wrap cannot hide a claim. */
function shellHeaderProse() {
  const source = readFileSync(join(REPO_ROOT, SHELL_REL), 'utf8');
  const header = source.slice(0, source.indexOf('*/'));
  return header.replace(/^\s*\*\s?/gm, ' ').replace(/\s+/g, ' ').trim();
}

/** One pending entry, staged through EM-C1's own verb so the shape is the registry's. */
function pendingOne() {
  return stage([], { type: 'set-field' }, { id: 'd1', orderedAt: 'stamp-1' });
}

describe('EM-E2b — the chronicle voice: where its writer must sit, and what the seal block says', () => {
  it('E2b-1 a `chronicleRef` is writable ONLY at the instant of application — an APPLIED entry can never acquire one, and the refusal is silent', () => {
    const pending = pendingOne();
    expect(pending.length, 'one entry was staged').toBe(1);
    expect(pending[0].status, 'and it is pending').toBe('pending');

    // THE ONE INSTANT. `markApplied` writes the reference when the caller supplies it, which
    // is the shape `registry.js` documents ("`chronicleRef` is written only when supplied").
    const applied = markApplied(pending, 'd1', {
      appliedAt: 'stamp-2', tickRef: 'tick-1', chronicleRef: 'line-7',
    });
    expect(applied[0].status, 'the entry is applied').toBe('applied');
    expect(applied[0].chronicleRef, 'and carries the line the caller minted').toBe('line-7');

    // THE MEASUREMENT THAT STOPS UNIT 1. A second call over the SAME entry — a writer seated
    // after the tick, holding the tick's causes and the lines it drew — changes nothing at
    // all, because `amendPending` has already declined the row. The registry comes back
    // sealed and the caller is told nothing: there is no refusal to read and no throw.
    const afterTheTick = markApplied(applied, 'd1', {
      appliedAt: 'stamp-3', tickRef: 'tick-1', chronicleRef: 'line-9',
    });
    expect(afterTheTick[0].chronicleRef, 'the later write is declined, not applied').toBe('line-7');
    expect(afterTheTick[0].appliedAt, 'and no other word of the applied entry moved').toBe('stamp-2');

    // AND AN ENTRY APPLIED WITHOUT A REFERENCE STAYS WITHOUT ONE, FOREVER. This is today's
    // tree: `applyDecreesAtTick` spells `{ appliedAt: now, tickRef }`, so every entry the
    // pulse applies reaches `applied` with no line, and no later verb can give it one.
    const bare = markApplied(pendingOne(), 'd1', { appliedAt: 'stamp-2', tickRef: 'tick-1' });
    expect(Object.hasOwn(bare[0], 'chronicleRef'), 'the key is ABSENT, not empty').toBe(false);
    const repaired = markApplied(bare, 'd1', {
      appliedAt: 'stamp-2', tickRef: 'tick-1', chronicleRef: 'line-7',
    });
    expect(Object.hasOwn(repaired[0], 'chronicleRef'), 'and it stays absent after the tick').toBe(false);
  });

  it('E2b-2 the shell\'s header says a seal opens only when its §18 condition holds AND its act is bound, and that the reason line is a reading drawn only where one was taken', () => {
    const prose = shellHeaderProse();
    expect(prose.length, 'the header was read').toBeGreaterThan(0);
    expect(prose, 'the pair judgment 296 made law is declared')
      .toContain('A SEAL OPENS ONLY WHEN ITS CONDITION HOLDS **AND** ITS ACT IS BOUND');
    expect(prose, 'and the §18 line is named as the reading it now is, with the fence on where'
      + ' it may be drawn')
      .toContain('THE §18 LINE IS NOW A READING, AND IT IS SHOWN ONLY WHERE ONE WAS TAKEN');
    expect(prose, 'and the header says a seal with no act draws its own line rather than a'
      + ' finding about this town')
      .toContain('never a finding about this town');
    // AND THE SUPERSEDED CLAIM IS GONE RATHER THAN LEFT STANDING BESIDE ITS SUCCESSOR: a
    // header that said both would be a file describing two different surfaces.
    expect(prose, 'EM-E2b\'s wording was REPLACED, not appended to')
      .not.toContain('IT READS NO WORLD PREDICATE AT THIS LANDING'); // anchored: the toContain arms above prove `prose` is the live header, never an empty read
  });
});

// ── EM-C1b's fixture: one real town, one real op, one real campaign ─────────────────────
const NOW = '2026-04-04T00:00:00.000Z';
const TICK_REF = 'world_pulse.c1b.1';

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
      worldState: { rngSeed: 'c1b::chronicle', tick: 1, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
  return store;
}

const campaignOf = (/** @type {any} */ store) => store.getState().campaigns[0];

describe('EM-C1b — an applied decree writes its chronicle line, cause = the table\'s hand', () => {
  it('C1b-1 THE ENTRY KEEPS ITS `chronicleRef` FROM THE ONE INSTANT IT CAN BE GIVEN ONE, and the reference is EM-E2\'s OWN address for that decree rather than a second grammar', () => {
    const saves = [saveOf('a', ['Steward', 'Reeve'], stagedAddNpc('d1', 'Steward'))];
    const tick = /** @type {any} */ (applyDecreesToSaves({ tick: 1 }, saves, TICK_REF, { now: NOW }));
    const entry = tick.saves[0].settlement.decrees[0];
    // The anchor for everything below: the tick really applied it, so an absent reference
    // would be a missing write and not an unreached branch.
    expect(entry.status, 'the tick did not apply the entry at all').toBe('applied');
    expect(entry.tickRef).toBe(TICK_REF);
    expect(entry.chronicleRef, 'the applied entry names no chronicle line').toBe('decree:d1');

    // ⭐ HELD EQUAL TO THE PRODUCER, DRIVEN OVER THE SAME ROW WITH THE REFERENCE TAKEN OFF.
    // `decreeChronicleLine` mints a line's id from the entry's RECORDED reference when it
    // has one and from the decree's own id when it does not, so showing it the bare row is
    // what proves the hook re-spelled the LEAF'S grammar and not one of its own. This is
    // the same equality `EditModeShell.jsx`'s `chronicleHrefFor` is held to, for the same
    // reason: the prose leaf has no `src/` importer that could carry the word instead.
    const { chronicleRef: _recorded, ...bare } = entry;
    const minted = decreeChronicleLine(bare, saves[0].settlement, {});
    expect(minted, 'the producer said nothing at all over this row').not.toBe(null);
    expect(/** @type {any} */ (minted).id, 'the hook wrote an address the prose leaf does not own')
      .toBe(entry.chronicleRef);
    // And shown the row AS APPLIED, the leaf records the line under that same reference —
    // so the entry's `chronicleRef` and the chronicle entry's id are one address.
    expect(/** @type {any} */ (decreeChronicleLine(entry, saves[0].settlement, {})).id)
      .toBe(entry.chronicleRef);

    // ⛔ AND THE POST-TICK WRITER IS STILL DECLINED (case E2b-1's measurement, restated over
    // the cured row): the entry is applied, so no later verb can move its reference.
    expect(markApplied([entry], 'd1', {
      appliedAt: 'later', tickRef: TICK_REF, chronicleRef: 'decree:somewhere-else',
    })[0].chronicleRef, 'a writer after the tick moved the line reference').toBe('decree:d1');
  });

  it('C1b-2 A REAL ADVANCE PUTS THE LINE IN THE CAMPAIGN\'S ONE CHRONICLE, under the id the decree names and in the words the prose leaf wrote', async () => {
    const store = storeWith(saveOf('a', ['Steward', 'Reeve'], stagedAddNpc('d1', 'Steward')));
    expect(campaignOf(store).chronicles, 'the campaign started with a chronicle').toBe(undefined);

    await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });

    const applied = store.getState().savedSettlements[0].settlement.decrees[0];
    // The anchor: the advance really applied the decree, so an empty chronicle below is a
    // missing line and not a tick that never happened.
    expect(applied.status, 'the advance did not apply the decree').toBe('applied');

    const chronicles = campaignOf(store).chronicles || [];
    expect(chronicles.length, 'the applied decree wrote no chronicle line').toBe(1);
    const row = chronicles[0];
    // ⭐ THE ID IS THE ONE THE DECREE NAMES, which is what makes the shell's
    // `chronicleHrefFor` (it prefers the recorded reference) resolve to this very row.
    expect(row.id, 'the line and the decree do not name one address').toBe(applied.chronicleRef);
    // ⭐ AND THE WORDS ARE THE PROSE LEAF'S OWN, driven here over the same applied row
    // rather than transcribed — a drift in the corpus reds this arm instead of passing.
    const expected = /** @type {any} */ (decreeChronicleLine(
      applied, store.getState().savedSettlements[0].settlement, { registry: [applied], cause: 'table' },
    ));
    expect(row.prose, 'the chronicle says something the decree voice never wrote').toBe(expected.prose);
    expect(String(row.prose).length, 'the line is empty, so the equality above is vacuous').toBeGreaterThan(0);
    // The tick is the one the entry itself names, not the advance's landing tick by default.
    expect(row.tick, 'the line was filed at a tick the decree did not apply at')
      .toBe(campaignOf(store).worldState.tick);
    // ⛔ ONE WRITER, ONE LIST: the campaign's existing `chronicles[]`, in its existing
    // four-key shape. No key was minted on the entry — `cause` and `decreeId` live on the
    // prose leaf's return and are deliberately NOT persisted (U93 is the owner's).
    expect(Object.keys(row).sort()).toEqual(['createdAt', 'id', 'prose', 'tick']);
  });

  it('C1b-3 AN ADVANCE OVER A REALM WITH NO DECREE APPENDS NOTHING AT ALL — the chronicle key is never minted and the tick reaches no composer', async () => {
    const store = storeWith(saveOf('a', ['Steward', 'Reeve'], null));
    const result = /** @type {any} */ (await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW }));
    // anchored: the advance really ran (it moved the world clock), so the absence below is
    // a dormant path and not a refused advance.
    expect(campaignOf(store).worldState.tick, 'the advance did not run').toBeGreaterThan(1);
    expect(campaignOf(store).chronicles, 'a decree-free tick minted a chronicle').toBe(undefined);
    expect(Object.hasOwn(result?.pulseRecord || {}, 'decreeCauses'),
      'a decree-free tick claimed a decree cause').toBe(false);
  });
});
