/**
 * tests/domain/epochRecord.test.js — THE EPOCH RECORD'S PINS (W1 deliverable 2).
 *
 * The delta is a LICENCE, not a summary: `refuteUnit.js`'s EPOCH arm reads `delta.fields` and
 * FAILS an elapsed course over a field that did not move. So the two properties that matter are
 * the two asserted hardest here: it names every field that moved, and it names NOTHING ELSE.
 * A delta that over-reports licenses a false history; one that under-reports refuses a true one.
 *
 * ⭐ THE GOLDEN IS DRIVEN THROUGH THE REAL ADVANCE PATH, not a hand-built pair of cards.
 * `advanceCampaignWorld` is what the product calls, the settlement it returns is the one the next
 * card is built from, and the whole two-epoch run is re-executed twice in one arm to prove the
 * path is deterministic before anything is compared to a file. A golden over a fixture pair would
 * have pinned the differ and said nothing about the engine.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  cardDelta, deltaValue, epochRecord, epochRecordJson, DERIVED_PATHS, EPOCH_RECORD_SCHEMA,
  KEYED_LISTS,
} from '../../src/domain/prose/epochRecord.js';
import { townCard } from '../../src/domain/prose/townCard.js';
import { refuteUnit } from '../../src/domain/prose/refuteUnit.js';
import { advanceCampaignWorld } from '../../src/domain/worldPulse/index.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { goldenCorpus } from '../helpers/goldenMasterCorpus.js';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const STATIC_CARD = JSON.parse(readFileSync(join(ROOT, 'docs/content/scribe-static-card.json'), 'utf8'));
const GOLDEN = join(ROOT, 'tests/fixtures/scribe-epoch-record.golden.json');
const RECORD = process.env.UPDATE_SCRIBE_EPOCH_GOLDEN === '1';

const cardOf = (s, world) => townCard(s, {
  tab: 'defense', audience: 'dm', staticCard: STATIC_CARD, world,
});

/**
 * ⭐ THE FIRST GOLDEN-MASTER TOWN, ADVANCED ONE SEASON TWICE THROUGH THE REAL PATH.
 * Every input is pinned: the corpus row's own seed, the campaign's `rngSeed`, and the two `now`
 * stamps. Nothing here reads a clock.
 * @returns {{cards: object[], campaignState: object}}
 */
function twoEpochs() {
  const { _seed, ...cfg } = goldenCorpus()[0];
  const settlement = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
  let saves = [{
    id: 'a',
    name: settlement.name,
    phase: 'canon',
    settlement,
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  }];
  let campaign = {
    id: 'scribe-epoch',
    name: 'Epoch',
    settlementIds: ['a'],
    worldState: { rngSeed: 'scribe-epoch-seed', tick: 0, stressors: [] },
    wizardNews: { currentTick: 0, entries: [] },
  };
  const cards = [cardOf(saves[0].settlement, campaign.worldState)];
  for (let k = 0; k < 2; k += 1) {
    const advanced = advanceCampaignWorld({
      campaign, saves, interval: 'one_season', now: `2026-06-0${k + 1}T00:00:00.000Z`,
    });
    const update = (advanced.settlementUpdates || []).find((u) => String(u.saveId) === 'a');
    if (update) saves = [{ ...saves[0], settlement: update.settlement }];
    campaign = { ...campaign, worldState: advanced.worldState, wizardNews: advanced.wizardNews };
    cards.push(cardOf(saves[0].settlement, campaign.worldState));
  }
  return { cards, campaignState: saves[0].campaignState };
}

describe('cardDelta — it names what moved and nothing else', () => {
  const { cards } = twoEpochs();

  it('a card against itself is EMPTY, on every tab of the same town', () => {
    const { _seed, ...cfg } = goldenCorpus()[0];
    const s = generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} });
    for (const tab of ['defense', 'power', 'overview', 'economics']) {
      const c = townCard(s, { tab, audience: 'dm', staticCard: STATIC_CARD });
      const d = cardDelta(c, c);
      expect(d.empty, `${tab} reports a move against itself`).toBe(true);
      expect(d.moved).toEqual([]);
      expect(d.added).toEqual([]);
      expect(d.removed).toEqual([]);
    }
  });

  it('a one-field change names exactly that field and no other', () => {
    const before = cards[0];
    const after = JSON.parse(JSON.stringify(before));
    after.town.tier = 'city';
    const d = cardDelta(before, after);
    expect(d.moved.map((m) => m.path)).toEqual(['town.tier']);
    expect(d.moved[0].before).toBe(before.town.tier);
    expect(d.moved[0].after).toBe('city');
    expect(d.fields['town.tier']).toEqual({ after: 'city', before: before.town.tier });
    expect(d.empty).toBe(false);
  });

  it('a roster row is added and removed BY NAME, never by position', () => {
    const before = cards[0];
    expect(before.town.institutions.length).toBeGreaterThan(1);
    const after = JSON.parse(JSON.stringify(before));
    // Drop the FIRST row. A positional diff would report every row below it as changed.
    const dropped = after.town.institutions.shift();
    const d = cardDelta(before, after);
    expect(d.rosterRemoved).toEqual([dropped.name]);
    expect(d.rosterAdded).toEqual([]);
    expect(d.moved.filter((m) => m.path.startsWith('town.institutions')).map((m) => m.path)).toEqual([]);
  });

  it('a pool that stops firing is named, and its siblings are not disturbed', () => {
    const before = cards[0];
    expect(before.pools.length).toBeGreaterThan(1);
    const after = JSON.parse(JSON.stringify(before));
    const gone = after.pools.shift();
    const d = cardDelta(before, after);
    expect(d.poolsStopped).toEqual([`${gone.blockId} :: ${gone.poolKey}`]);
    expect(d.poolsStarted).toEqual([]);
    expect(d.moved.filter((m) => m.path.startsWith('pools')).map((m) => m.path)).toEqual([]);
  });

  it('the page is DERIVED and is reported as a line count, never as fields', () => {
    expect(DERIVED_PATHS).toContain('page');
    const before = cards[0];
    const after = JSON.parse(JSON.stringify(before));
    after.page[0].text = 'a different sentence entirely';
    const d = cardDelta(before, after);
    expect(d.moved.filter((m) => m.path.startsWith('page'))).toEqual([]);
    expect(d.pageLines).toEqual({ after: after.page.length, before: before.page.length });
  });

  it('the keyed-list rules are frozen and each names a key the card actually carries', () => {
    expect(Object.isFrozen(KEYED_LISTS)).toBe(true);
    const first = cards[0];
    expect(first.pools[0].blockId).toBeDefined();
    expect(first.town.institutions[0].name).toBeDefined();
    expect(first.town.roles[0].source).toBeDefined();
  });

  it('a container value is summarised, never inlined, so a delta row stays a licence', () => {
    expect(deltaValue(null)).toBe(null);
    expect(deltaValue('x')).toBe('x');
    expect(deltaValue(4)).toBe(4);
    expect(deltaValue([1, 2, 3])).toBe('[3 rows]');
    expect(deltaValue({ b: 1, a: 2 })).toBe('{a, b}');
  });

  it('the delta is deterministic and key-sorted', () => {
    const a = JSON.stringify(cardDelta(cards[0], cards[1]));
    const b = JSON.stringify(cardDelta(cards[0], cards[1]));
    expect(a).toBe(b);
    const paths = cardDelta(cards[0], cards[1]).moved.map((m) => m.path);
    expect([...paths].sort()).toEqual(paths);
  });
});

describe('epochRecord — the typed record of one advance', () => {
  const { cards, campaignState } = twoEpochs();

  it('the shape is the design\'s, and the epoch key is the campaign tick', () => {
    const r = epochRecord(cards[0], cards[1], campaignState);
    expect(r.schema).toBe(EPOCH_RECORD_SCHEMA);
    expect(r.from).toBe(cards[0].epoch.tick);
    expect(r.to).toBe(cards[1].epoch.tick);
    expect(r.to).toBeGreaterThan(r.from);
    expect(r.advanceSeq).toBe(r.to);
    expect(r.isFirstEpoch).toBe(false);
    expect(Array.isArray(r.events)).toBe(true);
    expect(r.delta.empty).toBe(false);
  });

  it('the pulse is the card\'s OWN lastAdvance, so record and card cannot disagree', () => {
    const r = epochRecord(cards[0], cards[1], campaignState);
    expect(r.pulse).toBe(cards[1].lastAdvance);
    expect(r.pulse).not.toBeNull();
  });

  it('a first epoch says so and carries the whole card as the delta', () => {
    const r = epochRecord(null, cards[0], campaignState);
    expect(r.isFirstEpoch).toBe(true);
    expect(r.from).toBe(null);
    expect(r.delta.counts.moved).toBeGreaterThan(0);
  });

  it('the event log is filtered to THIS town and to THIS epoch\'s span', () => {
    const townId = cards[1].town.id;
    const state = {
      eventLog: [
        { id: 'mine-in', tick: cards[1].epoch.tick, settlementId: townId, type: 'x' },
        { id: 'mine-before', tick: cards[0].epoch.tick, settlementId: townId, type: 'x' },
        { id: 'mine-after', tick: cards[1].epoch.tick + 99, settlementId: townId, type: 'x' },
        { id: 'not-mine', tick: cards[1].epoch.tick, settlementId: 'some-other-town', type: 'x' },
      ],
    };
    const r = epochRecord(cards[0], cards[1], state);
    expect(r.events.map((e) => e.id)).toEqual(['mine-in']);
  });

  it('it carries no prose: every value is a primitive, a list or a typed record', () => {
    const r = epochRecord(cards[0], cards[1], campaignState);
    const round = JSON.parse(epochRecordJson(r));
    expect(round).toEqual(JSON.parse(JSON.stringify(r)));
    expect(epochRecordJson(r)).toBe(epochRecordJson(epochRecord(cards[0], cards[1], campaignState)));
  });

  it('⭐ the delta licenses the refuter\'s elapsed course, which is what it is FOR', () => {
    const delta = cardDelta(cards[0], cards[1]);
    expect(Object.keys(delta.fields)).toContain('epoch.tick');
    const card = cards[1];
    const unit = {
      text: 'The tick has grown since the last survey.',
      stance: 'spine',
      blockId: '',
      poolKey: '',
    };
    const licensed = refuteUnit(unit, card, { options: { delta } });
    expect(licensed.findings.filter((f) => f.arm === 'EPOCH' && f.channel === 'FAIL')).toEqual([]);
    // AND THE NEGATIVE CONTROL: the same clause about a field that did NOT move.
    const unmoved = refuteUnit(
      { ...unit, text: 'The zzzunmovedfield has grown since the last survey.' },
      card,
      { options: { delta: { fields: {} } } },
    );
    expect(unmoved.findings.some((f) => f.arm === 'EPOCH' && f.channel === 'FAIL')).toBe(true);
  });
});

describe('epochRecord — the two-epoch golden', () => {
  it('the real advance path is deterministic before anything is compared to a file', () => {
    const a = twoEpochs();
    const b = twoEpochs();
    const recordsOf = (r) => epochRecordJson([
      epochRecord(r.cards[0], r.cards[1], r.campaignState),
      epochRecord(r.cards[1], r.cards[2], r.campaignState),
    ]);
    expect(recordsOf(a)).toBe(recordsOf(b));
  }, 300_000);

  it('two epochs of the first golden town match the committed golden exactly', () => {
    const { cards, campaignState } = twoEpochs();
    const records = [
      epochRecord(cards[0], cards[1], campaignState),
      epochRecord(cards[1], cards[2], campaignState),
    ];
    if (RECORD) {
      writeFileSync(GOLDEN, `${JSON.stringify(records, null, 2)}\n`);
    }
    expect(
      existsSync(GOLDEN),
      'golden missing - for an APPROVED shift run: UPDATE_SCRIBE_EPOCH_GOLDEN=1 npx vitest run tests/domain/epochRecord.test.js',
    ).toBe(true);
    const committed = JSON.parse(readFileSync(GOLDEN, 'utf8'));
    // ⛔ THE SHIFT RECORD DISCIPLINE. A re-record needs a WRITTEN CAUSE in the commit body, the
    // same rule the generator golden master keeps. The message says so rather than offering the
    // command as a first resort.
    expect(
      JSON.parse(JSON.stringify(records)),
      '\nThe epoch record moved. A re-record needs a written cause in the commit body: say WHAT changed in the engine and WHY it is legitimate, then run UPDATE_SCRIBE_EPOCH_GOLDEN=1.\n',
    ).toEqual(committed);
  }, 300_000);
});

describe('epochRecord — the module is headless', () => {
  it('it imports nothing from src/components and nothing from a test file', () => {
    const source = readFileSync(join(ROOT, 'src/domain/prose/epochRecord.js'), 'utf8');
    const imports = [...source.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
    expect(imports).toEqual(['../deterministicSort.js']);
  });

  it('no string it emits carries an em dash or an exclamation mark', () => {
    const { cards, campaignState } = twoEpochs();
    const spoken = JSON.stringify(epochRecord(cards[0], cards[1], campaignState));
    expect(spoken.includes('—')).toBe(false);
    expect(spoken.includes('!')).toBe(false);
  });
});
