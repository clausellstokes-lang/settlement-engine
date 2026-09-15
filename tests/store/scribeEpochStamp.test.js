/**
 * tests/store/scribeEpochStamp.test.js — THE EPOCH RECORD IS COMPUTED AT ADVANCE TIME
 * (chair ruling 21; design §5b; W4 car 2).
 *
 * ⛔ THE GAP THIS CLOSES IS ONE W2 WROTE DOWN IN ITS OWN SOURCE: the transport sent `record: null`
 * on every render, because §5b wants epoch k rendered from the prior cards as typed deltas and the
 * past lane is COMPACT by the same design — units only, no card — so the prior card cannot be
 * rebuilt once the settlement has moved. There is exactly one moment at which both sides of the
 * delta exist, and it is the advance. Every arm below is driven through the REAL advance path
 * (`advanceCampaignWorld`, the function the store's own pulse calls and the one `pilot.mjs
 * --epochs 12` drives), because a record measured over a hand-mutated settlement would pin the
 * differ and say nothing about the engine.
 */
import { describe, it, expect } from 'vitest';

import {
  EPOCH_CARD_TAB, epochRecordAcrossAdvance, stampPendingRecord, stampScribeEpochRecords,
} from '../../src/lib/scribeEpochStamp.js';
import {
  landBlock, pendingRecordFor, pendingRecordOf, proseOf, restoreToDepth, setPendingRecord,
} from '../../src/lib/scribeArtefact.js';
import { proseAfterRestore } from '../../src/store/scribeEpochLane.js';
import { epochRecord, mergeEpochRecords } from '../../src/domain/prose/epochRecord.js';
import { townCard } from '../../src/domain/prose/townCard.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

/** A town with a survey already rendered for epoch 0, which is what a record is FOR. */
function scribedTown(seed = 'stamp-1') {
  const s = generateSettlementPipeline(
    { settType: 'town', culture: 'germanic' }, null, { seed, customContent: {} },
  );
  const renderedFor = String(s._seed ?? s.id ?? '');
  return {
    ...s,
    prose: landBlock(null, {
      advanceSeq: 0,
      blockId: 'DS-DEF-2',
      pools: { 'FAMILY: acute crisis': [{ vid: 3, spine: 'The watch keeps a short roll.', faces: [], notebook: [] }] },
      renderedFor,
      renderedAt: '2026-09-14T00:00:00.000Z',
      version: { engine: 'eng1' },
    }),
  };
}

/** One campaign of one member, exactly as the pilot builds one. */
function seat(settlement) {
  return {
    saves: [{
      id: 'a',
      name: settlement.name,
      phase: 'canon',
      settlement,
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }],
    campaign: {
      id: 'c-stamp',
      name: 'Stamp',
      settlementIds: ['a'],
      worldState: { rngSeed: 'c-stamp', tick: 0, stressors: [] },
      wizardNews: { currentTick: 0, entries: [] },
    },
  };
}

/** One `one_season` advance through the REAL path, stamped exactly as the store stamps it. */
async function advanceOnce({ saves, campaign }, { advanceSeq, now }) {
  const before = new Map(saves.map((s) => [String(s.id), s.settlement]));
  const eventLogBySaveId = new Map(saves.map((s) => [String(s.id), s.campaignState.eventLog]));
  const advanced = advanceCampaignWorld({ campaign, saves, interval: 'one_season', now });
  const stamped = await stampScribeEpochRecords(advanced.settlementUpdates || [], {
    before,
    worldBefore: campaign.worldState,
    worldAfter: advanced.worldState,
    eventLogBySaveId,
    advanceSeq,
  });
  const update = (advanced.settlementUpdates || []).find((u) => String(u.saveId) === 'a');
  return {
    stamped,
    update,
    next: {
      saves: [{ ...saves[0], settlement: update.settlement }],
      campaign: { ...campaign, worldState: advanced.worldState, wizardNews: advanced.wizardNews },
    },
  };
}

describe('THE REAL ADVANCE PATH LEAVES A RECORD OF WHAT MOVED', () => {
  it('a one_season advance on a scribed town parks a pendingRecord whose delta names moved fields', async () => {
    const { stamped, update } = await advanceOnce(seat(scribedTown()), {
      advanceSeq: 1, now: '2026-06-01T00:00:00.000Z',
    });
    expect(stamped).toBe(1);
    const record = pendingRecordOf(proseOf(update.settlement));
    expect(record).not.toBe(null);
    expect(record.advanceSeq).toBe(1);
    expect(record.from).toBe(0);
    expect(record.to).toBe(1);
    expect(record.delta.counts.moved).toBeGreaterThan(0);
    // The engine's own clock moved, and the record says so in the engine's own path vocabulary.
    expect(record.delta.fields['epoch.tick']).toEqual({ before: 0, after: 1 });
    expect(record.delta.empty).toBe(false);
  }, 60_000);

  it('the record is read BY EPOCH, so a render of another epoch is told nothing moved', async () => {
    const { update } = await advanceOnce(seat(scribedTown()), {
      advanceSeq: 1, now: '2026-06-01T00:00:00.000Z',
    });
    const prose = proseOf(update.settlement);
    expect(pendingRecordFor(prose, 1)).not.toBe(null);
    expect(pendingRecordFor(prose, 0)).toBe(null);
    expect(pendingRecordFor(prose, 2)).toBe(null);
  }, 60_000);

  it('a town with NO survey gets no record: there is nothing for a delta to be SINCE', async () => {
    const plain = generateSettlementPipeline(
      { settType: 'town', culture: 'germanic' }, null, { seed: 'stamp-2', customContent: {} },
    );
    const { stamped, update } = await advanceOnce(seat(plain), {
      advanceSeq: 1, now: '2026-06-01T00:00:00.000Z',
    });
    expect(stamped).toBe(0);
    expect(proseOf(update.settlement)).toBe(null);
    expect(update.settlement.prose).toBe(undefined);
  }, 60_000);

  it('TWO advances and ONE survey compose into the delta of the whole stretch', async () => {
    // Rule 14: a settlement is rendered only when its dossier is OPENED, so a realm advanced twice
    // before Ashford is opened has two advances and one survey. The record must span both.
    const first = await advanceOnce(seat(scribedTown('stamp-3')), {
      advanceSeq: 1, now: '2026-06-01T00:00:00.000Z',
    });
    const one = pendingRecordOf(proseOf(first.update.settlement));
    const second = await advanceOnce(first.next, { advanceSeq: 2, now: '2026-06-02T00:00:00.000Z' });
    const two = pendingRecordOf(proseOf(second.update.settlement));
    expect(one.from).toBe(0);
    expect(one.to).toBe(1);
    // The composed record still starts where the SURVEY is, not where the last advance started.
    expect(two.from).toBe(0);
    expect(two.to).toBe(2);
    expect(two.advanceSeq).toBe(2);
    expect(two.delta.fields['epoch.tick']).toEqual({ before: 0, after: 2 });
    expect(two.delta.counts.moved).toBeGreaterThanOrEqual(one.delta.counts.moved);
  }, 90_000);
});

describe('THE CARD PAIR IS THE TAB-FREE CARD, and that narrowing is stated rather than hidden', () => {
  it('the tab-free card carries the town and the epoch whole and fires no pool', () => {
    const s = scribedTown('stamp-4');
    const card = townCard(s, { tab: EPOCH_CARD_TAB, audience: 'dm', world: null });
    expect(EPOCH_CARD_TAB).toBe('');
    expect(card.pools).toEqual([]);
    expect(card.page).toEqual([]);
    expect(card.town.id).toBe(String(s.id));
    expect(Array.isArray(card.town.institutions)).toBe(true);
    expect(card.epoch).toBeTruthy();
  });

  it('the builder is injected, so the record can be read without the six prose leaves', () => {
    const calls = [];
    const record = epochRecordAcrossAdvance({ id: 'a' }, { id: 'a' }, { advanceSeq: 7 }, {
      townCard: (s, o) => { calls.push(o.tab); return { epoch: { tick: 1 }, town: { id: 'a' } }; },
      epochRecord: (prev, next, cs) => ({ advanceSeq: cs.advanceSeq, prev, next }),
    });
    expect(calls).toEqual(['', '']);
    expect(record.advanceSeq).toBe(7);
  });
});

describe('THE LANDING CLEARS THE RECORD IT WAS OWED', () => {
  const scribed = (seq) => landBlock(null, {
    advanceSeq: seq,
    blockId: 'DS-DEF-2',
    pools: { p: [{ vid: 1, spine: 'a line', faces: [], notebook: [] }] },
    renderedFor: 'seed-a',
    renderedAt: 'now',
    version: { engine: 'eng1' },
  });

  it('a block landing for the record\'s own epoch removes it, so the NEXT render is not handed it', () => {
    const withRecord = setPendingRecord(scribed(0), { advanceSeq: 1, delta: { counts: { moved: 3 } } });
    const landed = landBlock(withRecord, {
      advanceSeq: 1,
      blockId: 'DS-DEF-5',
      pools: { q: [{ vid: 2, spine: 'another', faces: [], notebook: [] }] },
      renderedFor: 'seed-a',
      renderedAt: 'later',
    });
    expect(pendingRecordOf(landed)).toBe(null);
    expect('pendingRecord' in landed).toBe(false);
  });

  it('a block landing for an EARLIER epoch leaves it alone', () => {
    const withRecord = setPendingRecord(scribed(0), { advanceSeq: 5, delta: {} });
    const landed = landBlock(withRecord, {
      advanceSeq: 0,
      blockId: 'DS-DEF-5',
      pools: { q: [{ vid: 2, spine: 'another', faces: [], notebook: [] }] },
      renderedFor: 'seed-a',
      renderedAt: 'later',
    });
    expect(pendingRecordOf(landed)?.advanceSeq).toBe(5);
  });
});

describe('THE UNDO DROPS THE PENDING RECORD WITH THE EPOCH IT BELONGS TO (§5b UNDO)', () => {
  const artefact = (currentSeq, recordSeq) => setPendingRecord(landBlock(null, {
    advanceSeq: currentSeq,
    blockId: 'DS-DEF-2',
    pools: { p: [{ vid: 1, spine: 'a line', faces: [], notebook: [] }] },
    renderedFor: 'seed-a',
    renderedAt: 'now',
    version: { engine: 'eng1' },
  }), { advanceSeq: recordSeq, delta: { counts: { moved: 9 } } });

  it('an advance reverted takes its record with it: the world never took that step', () => {
    const restored = restoreToDepth(artefact(2, 3), { advanceSeq: 2, at: 'x', nonce: 'n' });
    expect(pendingRecordOf(restored)).toBe(null);
    // And the prose of the epochs at or below the restored depth is NOT deleted, as always.
    expect(restored.current?.advanceSeq).toBe(2);
  });

  it('a record at or below the restored depth is untouched', () => {
    const restored = restoreToDepth(artefact(2, 2), { advanceSeq: 2, at: 'x', nonce: 'n' });
    expect(pendingRecordOf(restored)?.advanceSeq).toBe(2);
  });

  it('the chokepoint the store actually calls carries the same rule', () => {
    const live = { id: 't', prose: artefact(3, 3) };
    const moved = proseAfterRestore(live, { advanceSeq: 2, at: 'x', nonce: 'n' });
    expect(pendingRecordOf(moved)).toBe(null);
    expect(moved.epochs.map((e) => e.state)).toEqual(['undone']);
  });
});

describe('COMPOSING TWO RECORDS — the arithmetic, in isolation', () => {
  // Built as literals rather than differed, because the arithmetic under test is the COMPOSITION
  // and a pair of real cards would test `cardDelta` again instead. The shape is the one
  // `epochRecord` returns, pinned as such by the arm below.
  const rec = (from, to, moved, added = [], removed = []) => ({
    schema: 'scribe-epoch-record/1',
    advanceSeq: to,
    from,
    to,
    delta: {
      moved, added, removed, pageLines: { before: 0, after: 0 },
      fields: {}, counts: { moved: moved.length, added: added.length, removed: removed.length },
      empty: false,
    },
    events: [],
    pulse: null,
    isFirstEpoch: false,
  });

  it('the literal above is the shape `epochRecord` really returns', () => {
    const real = epochRecord(
      { epoch: { tick: 0 }, page: [] },
      { epoch: { tick: 1 }, page: [], town: { id: 'a' } },
      { advanceSeq: 1, eventLog: [] },
    );
    expect(Object.keys(real).sort()).toEqual(Object.keys(rec(0, 1, [])).sort());
    expect(Object.keys(real.delta).sort()).toEqual([
      'added', 'counts', 'empty', 'fields', 'moved', 'pageLines', 'poolsStarted', 'poolsStopped',
      'removed', 'rosterAdded', 'rosterRemoved', 'schema',
    ]);
  });

  it('keeps the OLDER before and the NEWER after, which is what "since the last survey" means', () => {
    const merged = mergeEpochRecords(
      rec(0, 1, [{ path: 'town.tier', before: 'village', after: 'town' }]),
      rec(1, 2, [{ path: 'town.tier', before: 'town', after: 'city' }]),
    );
    expect(merged.from).toBe(0);
    expect(merged.to).toBe(2);
    expect(merged.delta.moved).toEqual([{ path: 'town.tier', before: 'village', after: 'city' }]);
    expect(merged.delta.fields['town.tier']).toEqual({ before: 'village', after: 'city' });
  });

  it('a field that moved and moved BACK is not a move, and drops out', () => {
    const merged = mergeEpochRecords(
      rec(0, 1, [{ path: 'town.tier', before: 'town', after: 'city' }]),
      rec(1, 2, [{ path: 'town.tier', before: 'city', after: 'town' }]),
    );
    expect(merged.delta.moved).toEqual([]);
    expect(merged.delta.counts.moved).toBe(0);
    expect(merged.delta.empty).toBe(true);
  });

  it('a row added then removed cancels, and the summaries are re-derived from the survivors', () => {
    const merged = mergeEpochRecords(
      rec(0, 1, [], ['town.institutions[The Mill]', 'pools[DS-DEF-2 :: x]'], []),
      rec(1, 2, [], [], ['town.institutions[The Mill]']),
    );
    expect(merged.delta.added).toEqual(['pools[DS-DEF-2 :: x]']);
    expect(merged.delta.removed).toEqual([]);
    expect(merged.delta.rosterAdded).toEqual([]);
    expect(merged.delta.poolsStarted).toEqual(['DS-DEF-2 :: x']);
  });

  it('either side missing is the other side, so a first record composes with nothing', () => {
    const only = rec(0, 1, [{ path: 'p', before: 1, after: 2 }]);
    expect(mergeEpochRecords(null, only)).toBe(only);
    expect(mergeEpochRecords(only, null)).toBe(only);
  });
});

describe('THE TRANSPORT SENDS IT, AND SENDS IT AS THE EDGE READS IT', () => {
  it('the POST body carries the record under the name the edge function reads', async () => {
    const { tabRequestBody } = await import('../../src/store/scribeTransport.js');
    const record = { advanceSeq: 4, delta: { counts: { moved: 2 } } };
    const body = tabRequestBody({
      saveId: 's', advanceSeq: 4, renderedFor: 'seed-a', engineVersion: 'eng1', guidance: 'g',
    }, 'defense', { tab: 'defense', pools: [] }, record);
    expect(body).toMatchObject({
      saveId: 's', advanceSeq: 4, renderedFor: 'seed-a', engineVersion: 'eng1',
      tab: 'defense', record, guidance: 'g',
    });
    // NEGATIVE CONTROL — no record is `null`, never absent, so the edge's own reader is unambiguous.
    expect(tabRequestBody({ saveId: 's' }, 'defense', {}, null).record).toBe(null);
  });

  it('⛔ AND IT IS STILL A CARD THAT CROSSES, never a settlement blob', async () => {
    const { tabRequestBody } = await import('../../src/store/scribeTransport.js');
    const body = tabRequestBody({ saveId: 's' }, 'defense', { tab: 'defense' }, null);
    expect(Object.keys(body).sort()).toEqual([
      'advanceSeq', 'card', 'engineVersion', 'guidance', 'record', 'renderedFor', 'saveId', 'tab',
    ]);
  });
});

describe('STAMPING ONE SETTLEMENT — the pure half', () => {
  it('a settlement with no current render is the SAME reference back', () => {
    const plain = { id: 't' };
    expect(stampPendingRecord(plain, { advanceSeq: 1 }, mergeEpochRecords)).toBe(plain);
  });

  it('a null record changes nothing, so a failed computation cannot blank a parked one', () => {
    const town = { id: 't', prose: landBlock(null, {
      advanceSeq: 0, blockId: 'B', pools: { p: [{ vid: 1, spine: 's', faces: [], notebook: [] }] },
      renderedFor: 'seed-a', renderedAt: 'now', version: { engine: 'e' },
    }) };
    expect(stampPendingRecord(town, null, mergeEpochRecords)).toBe(town);
  });
});
