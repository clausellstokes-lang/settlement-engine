/** @vitest-environment jsdom */
/**
 * tests/ui/warRemembranceReader.test.jsx — RR-2, THE REMEMBRANCE READER.
 *
 * `warMemoryEnabled` writes a typed, prose-free record of every war that ended and
 * until this car nothing read one. This file pins the reader that closes that gap
 * and the two surfaces it feeds: the Herald's Remembrance door and the World Book's
 * State of the Realm chapter.
 *
 * WHAT IT PROVES, IN THE ORDER IT MATTERS:
 *   1. DARK IS SILENT, AND THE SILENCE IS STRUCTURAL. The flag is dark by default,
 *      so the ledger key is absent, the roster is empty and BOTH surfaces render
 *      exactly what they render today. The door's markup is compared as a STRING,
 *      because "unchanged" that is not compared byte-for-byte is an opinion.
 *   2. THE MACHINERY WORKS WITH THE DOOR FORCED. Every lit arm is driven through
 *      W-MEM's REAL writer with `warMemoryEnabled: true`, never through a
 *      hand-built record: a fixture assembled by hand proves a shape nobody ships.
 *   3. ONE RESOLVER OWNS THE ENDING. The reader asks `classifyWarEnding` and has a
 *      telling for every key in its two closed vocabularies, checked by
 *      enumeration rather than by a list somebody typed.
 *   4. THE LAWS. No number reaches a sentence, no engine token leaks, the secrets
 *      seam NEVER BUILDS the receipt half for an unproven session, and no sentence
 *      anywhere decides or reports a named person's fate.
 *
 * ⚠ ANTI-VACUITY IS EXPLICIT. Each dormancy arm has a control that fires the same
 * comparator over the LIT case, so a proof that compared nothing cannot pass.
 */

import { describe, test, expect, afterEach, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';

import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

afterEach(cleanup);

// ── Store mock (a single mutable object behind every selector) ───────────────
const storeState = {
  auth: { user: { id: 'owner-1' } },
};

vi.mock('../../src/store/index.js', () => {
  function useStore(selector) { return selector(storeState); }
  useStore.getState = () => storeState;
  useStore.subscribe = () => () => {};
  return { useStore };
});

import HeraldRemembrance from '../../src/components/map/HeraldRemembrance.jsx';
import {
  WAR_ENDING_TELLINGS,
  concludedWarRows,
  warRemembranceChapterLines,
  warTurningBandKey,
} from '../../src/domain/display/warRemembrance.js';
import {
  WAR_ENDING_PRECEDENCE,
  WAR_ENDING_UNCLASSIFIED_REASONS,
} from '../../src/domain/certification/warEndingClassifier.js';
import { recordConcludedWars } from '../../src/domain/worldPulse/concludedWars.js';
import { collectWorldBook } from '../../src/utils/generateWorldBook.js';

// ── Driving the REAL writer (the concludedWarsWriter fixture shape) ──────────
const LIT = { warMemoryEnabled: true, warLayerEnabled: true };
const TICK = 40;

const edge = (over = {}) => ({
  attackerId: 'ashford',
  targetId: 'kelby',
  outcome: 'withdrawal',
  deployment: {
    targetId: 'kelby',
    sinceTick: 12,
    maxStartStrength: 60,
    currentEffectiveStrength: 24,
    recalled: { cause: 'sue_for_peace', tick: TICK },
    casusReasons: [{ type: 'grievance', score: 3, receipt: 'the old wrong', atTick: 12 }],
  },
  ...over,
});

const baseWorld = (over = {}) => ({ tick: TICK, deployments: {}, warExhaustion: {}, ...over });

/** Drive W-MEM's writer with the door FORCED and return the world it wrote onto. */
function litWorld(over = {}) {
  const ledger = recordConcludedWars({
    worldState: baseWorld(),
    resolvedDeployments: [edge()],
    appliedOutcomes: [],
    newsEntries: [],
    tick: TICK,
    rules: LIT,
    deferred: false,
    ...over,
  });
  if (!ledger) throw new Error('the writer wrote nothing where this test needs a record');
  return baseWorld({ concludedWars: ledger });
}

const SAVES = [
  { id: 'ashford', name: 'Ashford', settlement: { id: 'ashford', name: 'Ashford' } },
  { id: 'kelby', name: 'Kelby', settlement: { id: 'kelby', name: 'Kelby' } },
];

const campaignOf = (worldState) => ({
  id: 'c1',
  name: 'The Marches',
  settlementIds: ['ashford', 'kelby'],
  worldState,
});

const namesFromSaves = (id) => (SAVES.find(s => s.id === String(id))?.settlement.name || '');

const allSentences = (row) => [
  row.name, row.line, row.endingLine, row.whenLabel, row.ranLabel,
  row.costLine, row.stagedNote, ...row.territory, ...row.engagements,
].filter(Boolean);

describe('RR-2 — a dark world is silent, and the silence is structural', () => {
  test('a world that never opened the ledger yields no rows at all', () => {
    // The reader never reads the flag: the writer's own gate means the key is simply
    // absent, so dormancy here is the absence of a key rather than a branch.
    expect(concludedWarRows({ worldState: baseWorld() })).toEqual([]);
    expect(concludedWarRows({ worldState: baseWorld({ concludedWars: {} }) })).toEqual([]);
    expect(concludedWarRows({})).toEqual([]);
    expect(concludedWarRows()).toEqual([]);
  });

  test('the Herald door renders the SAME MARKUP it rendered before this car', () => {
    // Compared as a string, not by eyeball: the war section must be ABSENT rather
    // than an empty box, because an empty box would have changed a live door for
    // every GM on the day a dormant flag shipped.
    const dark = render(<HeraldRemembrance campaign={campaignOf(baseWorld())} saves={SAVES} />);
    const darkHtml = dark.container.innerHTML;
    // The graveyard heading is the anchor: it travels the SAME render, so a door that
    // failed to mount at all reds on the anchor instead of passing this exclusion.
    expectAbsentWithAnchor(darkHtml, 'The wars that ended', 'What the realm has lost', 'the dark door');
    expect(dark.queryByTestId('herald-war-remembrance')).toBeNull();
    cleanup();
    const emptied = render(
      <HeraldRemembrance campaign={campaignOf(baseWorld({ concludedWars: {} }))} saves={SAVES} />,
    );
    expect(emptied.container.innerHTML).toBe(darkHtml);
  });

  test('ANTI-VACUITY CONTROL: the same render DOES grow when a war is remembered', () => {
    const dark = render(<HeraldRemembrance campaign={campaignOf(baseWorld())} saves={SAVES} />);
    const darkHtml = dark.container.innerHTML;
    cleanup();
    const lit = render(<HeraldRemembrance campaign={campaignOf(litWorld())} saves={SAVES} />);
    expect(lit.container.innerHTML).not.toBe(darkHtml);
    expect(lit.getByTestId('herald-war-remembrance')).toBeTruthy();
  });

  test('the World Book binds no war chapter for a dark campaign', () => {
    const book = collectWorldBook(campaignOf(baseWorld()), SAVES, { mode: 'dm' });
    expect(book.warsEnded).toEqual([]);
    expect(book.sections.warsEnded).toBe(false);
  });
});

describe("RR-2 — the door FORCED, driven through W-MEM's real writer", () => {
  test('one concluded war becomes one addressed row', () => {
    const rows = concludedWarRows({ worldState: litWorld(), nameFor: namesFromSaves });
    expect(rows).toHaveLength(1);
    const [row] = rows;
    expect(row.id).toBe('war.ashford.kelby.12.0');
    // The news address law: the two courts by NAME, in their true roles, and the reason.
    expect(row.line).toContain('Ashford');
    expect(row.line).toContain('Kelby');
    expect(row.line).toContain('against');
    expect(row.name.length).toBeGreaterThan(0);
  });

  test('the ending is the one the resolver returns, said in world words', () => {
    // The pinned road here is sue_for_peace with no treaty and no terminal outcome,
    // which the classifier reports as an honest absence rather than guessing terms.
    const [row] = concludedWarRows({ worldState: litWorld(), nameFor: namesFromSaves });
    expect(row.endingKey).toBeNull();
    expect(row.endingLine).toBe(WAR_ENDING_TELLINGS.no_terminal_evidence);
  });

  test('a treaty written for the pair moves the ending to terms', () => {
    const world = litWorld();
    const key = 'war.ashford.kelby.12.0';
    const record = world.concludedWars[key];
    world.concludedWars = {
      [key]: { ...record, fact: { ...record.fact, treatyWritten: true } },
    };
    const [row] = concludedWarRows({ worldState: world, nameFor: namesFromSaves });
    expect(row.endingKey).toBe('terms');
    expect(row.endingLine).toBe(WAR_ENDING_TELLINGS.terms);
  });

  test('a conquest names the VICTOR, and names it rather than identifying it', () => {
    const world = litWorld();
    const key = 'war.ashford.kelby.12.0';
    const record = world.concludedWars[key];
    world.concludedWars = {
      [key]: {
        ...record,
        victorId: 'ashford',
        fact: {
          ...record.fact,
          terminalOutcomes: [{ id: 'o1', candidateType: 'conquest', targetSaveId: 'kelby', tick: TICK }],
        },
      },
    };
    const [row] = concludedWarRows({ worldState: world, nameFor: namesFromSaves });
    expect(row.endingKey).toBe('conquest');
    expect(row.endingLine).toContain('Ashford');
    // The victor's NAME is the anchor for both exclusions: an unfilled mold and a raw id
    // are the two ways this telling can go wrong, and neither survives a live name.
    expectAbsentWithAnchor(row.endingLine, '{victor}', 'Ashford', 'the conquest mold is filled');
    expectAbsentWithAnchor(row.endingLine, 'ashford', 'Ashford', 'a name, never an id');
  });
});

describe('RR-2 — one resolver owns the ending, and every key it can return is said', () => {
  test("the tellings are TOTAL over both of the classifier's closed vocabularies", () => {
    // Enumerated from the resolver itself, never from a list typed here: a ninth
    // ending or a fourth unclassified reason reds this arm the day it is minted.
    for (const key of WAR_ENDING_PRECEDENCE) {
      expect(typeof WAR_ENDING_TELLINGS[key], `no telling for ending ${key}`).toBe('string');
    }
    for (const reason of WAR_ENDING_UNCLASSIFIED_REASONS) {
      expect(typeof WAR_ENDING_TELLINGS[reason], `no telling for reason ${reason}`).toBe('string');
    }
    expect(Object.keys(WAR_ENDING_TELLINGS)).toHaveLength(
      WAR_ENDING_PRECEDENCE.length + WAR_ENDING_UNCLASSIFIED_REASONS.length,
    );
  });

  test('STATE, NEVER FATE — the annihilation telling speaks of a seat, not a person', () => {
    const world = litWorld();
    const key = 'war.ashford.kelby.12.0';
    const record = world.concludedWars[key];
    world.concludedWars = {
      [key]: { ...record, fact: { ...record.fact, loserDied: true } },
    };
    const [row] = concludedWarRows({ worldState: world, nameFor: namesFromSaves });
    expect(row.endingKey).toBe('annihilation');
    for (const word of ['died', 'killed', 'slain', 'death', 'executed', 'murdered']) {
      // anchored: the annihilation telling is anchored on the SAME string by 'seat', which
      // travels this exact branch, so an absent or empty telling cannot pass silently.
      expectAbsentWithAnchor(row.endingLine.toLowerCase(), word, 'seat', 'STATE, NEVER FATE');
    }
  });
});

describe('RR-2 — the legibility law', () => {
  test('no sentence carries a digit, an em dash, an exclamation point or a raw token', () => {
    const world = litWorld();
    const key = 'war.ashford.kelby.12.0';
    const record = world.concludedWars[key];
    world.concludedWars = {
      [key]: {
        ...record,
        territorialOutcomes: [{ settlementId: 'kelby', kind: 'occupied', occupierId: 'ashford', tick: TICK }],
        notableEngagements: [{ kind: 'siege_relieved', tick: TICK, settlementIds: ['ashford', 'kelby'] }],
      },
    };
    const [row] = concludedWarRows({ worldState: world, nameFor: namesFromSaves });
    const sentences = allSentences(row);
    expect(sentences.length).toBeGreaterThan(4);
    for (const sentence of sentences) {
      // anchored: `sentences` is filtered non-empty and its LENGTH is asserted above, and
      // each sentence is proven to carry real words by the positive match on this line, so
      // a collection that drifted away or emptied reds before any exclusion is reached.
      expect(sentence, `not a sentence: "${sentence}"`).toMatch(/[a-zA-Z]{3}/);
      expect(sentence, `digit in "${sentence}"`).not.toMatch(/[0-9]/); // anchored: the positive match one line above proves this string is live prose
      expect(sentence, `em dash in "${sentence}"`).not.toContain('—'); // anchored: same live-prose anchor
      expect(sentence, `exclamation in "${sentence}"`).not.toContain('!'); // anchored: same live-prose anchor
      expect(sentence, `engine token in "${sentence}"`).not.toMatch(/[a-z]_[a-z]/); // anchored: same live-prose anchor
    }
  });

  test('the age of a war is TURNINGS, over one ladder with pinned floors', () => {
    expect(warTurningBandKey(null)).toBe('unrecorded');
    expect(warTurningBandKey(Number.NaN)).toBe('unrecorded');
    expect(warTurningBandKey(-3)).toBe('this_turning');
    expect(warTurningBandKey(0)).toBe('this_turning');
    expect(warTurningBandKey(1)).toBe('last_turning');
    expect(warTurningBandKey(4)).toBe('a_few');
    expect(warTurningBandKey(5)).toBe('some');
    expect(warTurningBandKey(13)).toBe('some');
    expect(warTurningBandKey(14)).toBe('long_before');
  });

  test('a band key this build does not know contributes silence, never a wrong band', () => {
    const world = litWorld();
    const key = 'war.ashford.kelby.12.0';
    const record = world.concludedWars[key];
    const known = concludedWarRows({ worldState: world, nameFor: namesFromSaves })[0];
    expect(known.costLine.length).toBeGreaterThan(0);
    world.concludedWars = {
      [key]: {
        ...record,
        cost: { attackerRemainingBand: 'a_band_from_the_future', exhaustionBands: { ashford: 'also_unknown' } },
      },
    };
    const [row] = concludedWarRows({ worldState: world, nameFor: namesFromSaves });
    // Exact, not an exclusion: the KNOWN-band assertion above is the liveness anchor, and
    // an empty string cannot smuggle an unknown token past a `toBe`.
    expect(row.costLine).toBe('');
  });
});

describe('RR-2 — the secrets seam is NEVER BUILT, not hidden', () => {
  test("an unproven session reads the war and never the keeper's record", () => {
    const [row] = concludedWarRows({ worldState: litWorld(), nameFor: namesFromSaves });
    expect(row.receipts).toEqual([]);
    expect(row.receiptsRedacted).toBe(true);
    // The war itself still reads: a war two courts fought is the world's own history.
    expect(row.line).toContain('Ashford');
  });

  test('a proven owner session gets the ledger key and the road it closed on', () => {
    const [row] = concludedWarRows({
      worldState: litWorld(), nameFor: namesFromSaves, seesSecrets: true,
    });
    expect(row.receiptsRedacted).toBe(false);
    const byId = Object.fromEntries(row.receipts.map(r => [r.id, r.detail]));
    expect(byId.ledger).toBe('war.ashford.kelby.12.0');
    expect(byId.road).toBe('sue for peace');
  });
});

describe('RR-2 — a name outlives the record, and an id never reaches the page', () => {
  test('a rename re-titles the war', () => {
    const [row] = concludedWarRows({
      worldState: litWorld(),
      nameFor: (id) => (String(id) === 'ashford' ? 'Ashford-on-Wold' : namesFromSaves(id)),
    });
    expect(row.line).toContain('Ashford-on-Wold');
  });

  test('a court the library no longer holds falls back to the name it carried', () => {
    const world = litWorld();
    const key = 'war.ashford.kelby.12.0';
    const record = world.concludedWars[key];
    world.concludedWars = {
      [key]: {
        ...record,
        participants: record.participants.map(p => (
          p.id === 'kelby' ? { ...p, label: 'Kelby of the Fens' } : p
        )),
      },
    };
    const [row] = concludedWarRows({
      worldState: world,
      nameFor: (id) => (String(id) === 'kelby' ? '' : namesFromSaves(id)),
    });
    // The recorded label is the anchor: if the fallback stopped firing there would be no
    // label in the line at all, and the exclusion below could not tell that from success.
    expectAbsentWithAnchor(row.line, 'kelby', 'Kelby of the Fens', 'a recorded label, never an id');
  });
});

describe('RR-2 — the Herald war section', () => {
  test('a remembered war reaches the door as a row, with its account', () => {
    const view = render(<HeraldRemembrance campaign={campaignOf(litWorld())} saves={SAVES} />);
    expect(view.getAllByTestId('concluded-war-row')).toHaveLength(1);
    const text = view.getByTestId('herald-war-remembrance').textContent || '';
    expect(text).toContain('Ashford');
    expect(text).toContain('Kelby');
    expect(text).toContain('turning');
  });
});

describe('RR-2 — the World Book chapter', () => {
  test('the bound book carries one line per remembered war', () => {
    const book = collectWorldBook(campaignOf(litWorld()), SAVES, { mode: 'dm' });
    expect(book.sections.warsEnded).toBe(true);
    expect(book.warsEnded).toHaveLength(1);
    expect(book.warsEnded[0]).toContain('Ashford');
    expect(book.warsEnded[0]).toContain('Kelby');
  });

  test("the PLAYER face keeps the war and drops the keeper's record", () => {
    // The chapter lines never carry receipts in either face; the seam is proven on the
    // rows the same collector reads, so the two faces cannot disagree by accident.
    const player = collectWorldBook(campaignOf(litWorld()), SAVES, { mode: 'player' });
    expect(player.sections.warsEnded).toBe(true);
    expect(player.warsEnded[0]).toContain('Ashford');
    for (const line of player.warsEnded) {
      expectAbsentWithAnchor(line, 'war.ashford.kelby', 'Ashford', 'the player face carries no ledger key');
    }
  });

  test("one deriver, two renders: the chapter lines are folded from the door's rows", () => {
    const rows = concludedWarRows({ worldState: litWorld(), nameFor: namesFromSaves });
    const lines = warRemembranceChapterLines(rows);
    expect(lines).toHaveLength(rows.length);
    expect(lines[0]).toContain(rows[0].line);
    expect(lines[0]).toContain(rows[0].endingLine);
    expect(warRemembranceChapterLines([])).toEqual([]);
    expect(warRemembranceChapterLines(null)).toEqual([]);
  });
});
