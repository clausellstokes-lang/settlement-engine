/**
 * characterReadModel.test.js — THE READ MODEL AND THE PROSE (W-LIVES car L7).
 *
 * Five things are pinned, and the first two are the feature:
 *
 *   ⭐ REPUTATION AND TRUTH DIFFER IN WHAT A PERSON IS MOST KNOWN FOR, not merely in
 *   wording. The same soul, one crossing on record, reads "above all wrathful,
 *   notably brave" to a god and "notably brave, a little wrathful" to the town — the
 *   TOP-3 ORDER ITSELF changes hands. With nothing on record he still reads
 *   "notably patient", which is `knownCharacter.js`'s headline claim carried all the
 *   way to a sentence for the first time.
 *
 *   ⭐ GAP D'S QUERY EXISTS NOW. `knownCharacterOf` has taken its disclosures as an
 *   argument since car L4 because "the caller runs the query and hands the answer
 *   in" — and no caller did. `disclosuresFor` is that query, and it is asserted to
 *   feed the reader it was written for.
 *
 *   §5's PINNED TOTAL ORDER IS NOT RE-DERIVED, and the test proves the ABSENCE:
 *   this module owns no comparator, and its order is asserted to equal car L3's
 *   `chartOrderOf` on the same chart. A second home would pass every behaviour test
 *   in this file and is exactly what F1 spent a car killing.
 *
 *   THE VOCABULARIES ARE TOTAL BOTH WAYS. Every teaching kind has a reason clause and
 *   the SILENT kind has none; every `AXIS_LEVELS` rung has a level phrase and there
 *   is no fourth. A register that is total in only one direction grows orphans.
 *
 *   DARK BY CONSTRUCTION, AND THE DARK ARM DISCOVERS NOTHING ON ITS OWN. Nothing in
 *   this tree writes `npc.character`, so an absent chart is the ONLY state a real
 *   world can be in today; every arm is therefore driven TWICE — once absent, to pin
 *   that the reader makes no claim, and once on a fixture chart with an injected
 *   projection, to prove the comparator can see. That is car L5's rule and it binds
 *   here.
 *
 * THE PROJECTION IS A FIXTURE, NEVER L1'S CATALOG. Car L1 is on a different unlanded
 * line; importing it would make this car unbuildable alone. The fixture below is a
 * four-axis stand-in with L1's exact signature, and the words are its own.
 *
 * STATICALLY REGISTERED tests rather than a loop around `test()`.
 *
 * @enforced-by this test
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, test } from 'vitest';

import {
  ARTICLE_ACTIONS,
  ARTICLE_REFUSALS,
  CHARACTER_NEWS_REGISTRATION_SEAM,
  CHARACTER_READ_PROVENANCE,
  CLAUSED_KINDS,
  DECAY_CLAUSE,
  EXPERIENCE_CLAUSES,
  LEVEL_PHRASES,
  bandParts,
  biographyOf,
  characterArticles,
  characterDossier,
  chartValuesOf,
  disclosuresFor,
  leadLine,
  readPositions,
  readingOf,
  reasonsOf,
} from '../../../src/domain/npc/characterReadModel.js';
import { AXIS_LEVELS, effectiveCharacter } from '../../../src/domain/npc/characterDrift.js';
import {
  LIVED_EXPERIENCE_KINDS,
  SILENT_EXPERIENCE_KIND,
} from '../../../src/domain/npc/livedExperienceCatalog.js';
import {
  TOP_POSITIONS,
  chartOrderOf,
  effectiveChartOf,
} from '../../../src/domain/npc/livedExperienceFunnel.js';
import { DISCLOSURE_KINDS, knownCharacterOf } from '../../../src/domain/npc/knownCharacter.js';

const HERE = dirname(fileURLToPath(import.meta.url));
const MODULE_PATH = join(HERE, '../../../src/domain/npc/characterReadModel.js');

/**
 * THE FIXTURE PROJECTION — car L1's `wordForAxisPosition` signature, its own words.
 * Four axes is enough to exercise every frame and small enough that a reader can
 * hold the whole vocabulary while reading a failure.
 * @param {{axisId?: string, pole?: string, level?: string}|null|undefined} position
 * @returns {string|null}
 */
function fixtureProjection(position) {
  const words = {
    COURAGE: { virtue: 'brave', vice: 'cowardly' },
    TEMPER: { virtue: 'patient', vice: 'wrathful' },
    TRUST: { virtue: 'trusting', vice: 'suspicious' },
    MERCY: { virtue: 'merciful', vice: 'cruel' },
  };
  if (!position) return null;
  const axis = words[String(position.axisId)];
  if (!axis) return null;
  return axis[String(position.pole)] || null;
}

/** A soul with an authored chart and no drift. */
function authoredNpc() {
  return {
    id: 'n1',
    name: 'Aldric',
    character: {
      axes: {
        COURAGE: { pole: 'virtue', level: 'marked' },
        TEMPER: { pole: 'vice', level: 'defining' },
        TRUST: { pole: 'virtue', level: 'a_touch' },
        MERCY: { pole: 'vice', level: 'a_touch' },
      },
    },
  };
}

/** The receipt set the article and biography arms read. */
function receiptSet() {
  return [
    {
      kind: 'band_crossing',
      wnpcId: 'w1',
      axisId: 'COURAGE',
      tick: 10,
      crossing: { stockKind: 'character_axis', from: 'virtue_a_touch', to: 'virtue_marked', direction: 'up', cause: 'ordeal', tick: 10 },
      sourceKinds: ['survived_battle'],
      sourceEventIds: ['e1'],
    },
    {
      kind: 'reversal',
      wnpcId: 'w1',
      axisId: 'TEMPER',
      tick: 12,
      crossing: { stockKind: 'character_axis', from: 'virtue_marked', to: 'vice_defining', direction: 'down', cause: 'bond', tick: 12 },
      sourceKinds: ['betrayed_by_friend'],
      sourceEventIds: ['e2'],
    },
    {
      kind: 'displacement',
      wnpcId: 'w1',
      axisId: 'TEMPER',
      overtook: 'COURAGE',
      rank: 0,
      tick: 12,
      sourceKinds: ['betrayed_by_friend'],
      sourceEventIds: ['e2'],
    },
    {
      kind: 'band_crossing',
      wnpcId: 'w1',
      axisId: 'TRUST',
      tick: 40,
      crossing: { stockKind: 'character_axis', from: 'virtue_a_touch', to: 'neutral', direction: 'down', cause: 'homeward_decay', tick: 40 },
      sourceKinds: [],
      sourceEventIds: [],
    },
    // A DIFFERENT SOUL, in the same set. Every query must drop it.
    {
      kind: 'band_crossing',
      wnpcId: 'OTHER',
      axisId: 'MERCY',
      tick: 5,
      crossing: { from: 'neutral', to: 'vice_a_touch', cause: 'ordeal', tick: 5 },
      sourceKinds: ['survived_battle'],
      sourceEventIds: ['e9'],
    },
  ];
}

describe('W-LIVES L7 — the read model (§5)', () => {
  test('the top-3 IS car L3\'s pinned total order — this module owns no comparator', () => {
    const npc = authoredNpc();
    const chart = effectiveChartOf(npc, null);
    // THE ORDER IS L3's, ASSERTED RATHER THAN RE-IMPLEMENTED. If this file ever grows
    // its own sort, this equality is the thing that breaks.
    expect(readingOf({ npc }).map((row) => row.axisId))
      .toEqual([...chartOrderOf(chart)].slice(0, TOP_POSITIONS));
    // anchored: the chart really has more axes than the window, so the slice is doing work
    expect(Object.keys(chart).length).toBeGreaterThan(TOP_POSITIONS);
  });

  test('the ABSENCE of a second comparator is asserted on the source', () => {
    const source = readFileSync(MODULE_PATH, 'utf8');
    const RE_DERIVED = /Math\.abs\([^)]*\)\s*-\s*Math\.abs\(/;
    // ⭐ THE DETECTOR IS PROVED TO FIRE before it is trusted to stay silent: the very
    // comparator this test forbids LIVES in car L3's funnel, so the regex is matched
    // positively against the one file that legitimately holds it. A scan that had
    // stopped seeing things would fail HERE rather than passing forever below.
    const funnel = readFileSync(join(HERE, '../../../src/domain/npc/livedExperienceFunnel.js'), 'utf8');
    expect(funnel).toMatch(RE_DERIVED);
    // anchored: the line above proves this exact regex fires on a real re-derivation
    expect(source).not.toMatch(RE_DERIVED);
    // and it really does call L3's, so this is not passing on a file that sorts nothing
    expect(source).toContain('chartOrderOf(');
  });

  test('magnitude leads, then band rank, then codepoint — and neutral axes are excluded', () => {
    // MERCY and TRUST are both at magnitude 1; MERCY wins on codepoint. TRUST is
    // therefore pushed out of the window entirely, and CONTENT (neutral) never enters.
    const npc = authoredNpc();
    npc.character.axes.CONTENT = {};
    const rows = readingOf({ npc, project: fixtureProjection });
    expect(rows.map((row) => row.axisId)).toEqual(['TEMPER', 'COURAGE', 'MERCY']);
    expect(rows.map((row) => row.band)).toEqual(['vice_defining', 'virtue_marked', 'vice_a_touch']);
  });

  test('an all-neutral soul reads EMPTY, not as three neutral rows', () => {
    const rows = readingOf({ npc: { character: { axes: { COURAGE: {}, TRUST: {} } } }, project: fixtureProjection });
    expect(rows).toEqual([]);
    expect(leadLine(rows)).toBe('');
  });

  test('the two entries into the read model agree for the same soul', () => {
    // effectiveChartOf(npc, drift) and chartValuesOf(a composed chart) are different
    // doors; a soul must read the same through both or the KNOWN and TRUE surfaces
    // would disagree for a reason that has nothing to do with sight.
    const npc = authoredNpc();
    const drift = { TEMPER: { offset: -1, updatedTick: 4 } };
    const viaNpc = readingOf({ npc, drift, project: fixtureProjection });
    const viaChart = readPositions({
      chart: chartValuesOf(effectiveCharacter(npc, drift)),
      project: fixtureProjection,
    });
    expect(viaChart).toEqual(viaNpc);
    // anchored: the drift really moved something, so this is not two empties agreeing
    expect(viaNpc.length).toBeGreaterThan(0);
  });

  test('DARK ARM: no projection ⇒ words and phrases are empty, and the lead makes no claim', () => {
    const rows = readingOf({ npc: authoredNpc() });
    expect(rows.length).toBe(TOP_POSITIONS);
    expect(rows.map((row) => row.word)).toEqual(['', '', '']);
    expect(rows.map((row) => row.phrase)).toEqual(['', '', '']);
    // ⚠ NOT a fallback to the axis id. An empty lead is the honest answer; an id in
    // reader prose is the one thing the presentation boundary exists to stop.
    expect(leadLine(rows)).toBe('');
  });

  test('LIT ARM: the same soul, projected, reads as a sentence', () => {
    expect(leadLine(readingOf({ npc: authoredNpc(), project: fixtureProjection })))
      .toBe('above all wrathful, notably brave, a little cruel.');
  });

  test('a projection that throws or returns a non-string yields NO WORD, never a guess', () => {
    const rows = readingOf({ npc: authoredNpc(), project: () => 42 });
    expect(rows.map((row) => row.word)).toEqual(['', '', '']);
    expect(readingOf({ npc: authoredNpc(), project: 'not a function' }).map((row) => row.word))
      .toEqual(['', '', '']);
  });
});

describe('W-LIVES L7 — the vocabularies are total BOTH ways', () => {
  test('every AXIS_LEVELS rung has a level phrase, and there is no fourth', () => {
    expect(Object.keys(LEVEL_PHRASES).sort()).toEqual([...AXIS_LEVELS].sort());
  });

  test('every TEACHING kind has a reason clause, and the SILENT kind has none', () => {
    expect(CLAUSED_KINDS.filter((kind) => !EXPERIENCE_CLAUSES[kind])).toEqual([]);
    expect(Object.keys(EXPERIENCE_CLAUSES).filter((kind) => !CLAUSED_KINDS.includes(kind))).toEqual([]);
    // the silent kind is deliberately unclaused — a phrase for it would describe an
    // event that cannot appear in any article
    expect(EXPERIENCE_CLAUSES[SILENT_EXPERIENCE_KIND]).toBeUndefined();
    // anchored: the roster is real and the silent kind really is in it
    expect(LIVED_EXPERIENCE_KINDS).toContain(SILENT_EXPERIENCE_KIND);
    expect(CLAUSED_KINDS.length).toBe(LIVED_EXPERIENCE_KINDS.length - 1);
  });

  test('the typed actions ARE the funnel\'s own receipt kinds — no fourth spelling', () => {
    expect([...ARTICLE_ACTIONS].sort()).toEqual([...DISCLOSURE_KINDS].sort());
  });

  test('no clause carries a terminal stop or a leading capital, so one register serves both frames', () => {
    const STOP = /[.!?]$/;
    const CAPITAL = /^[A-Z]/;
    // the detectors are proved to fire on a counter-example before they are trusted
    expect('A clause.').toMatch(STOP);
    expect('A clause.').toMatch(CAPITAL);
    // and the register really is populated, so the loop below is not zero iterations
    expect(Object.keys(EXPERIENCE_CLAUSES).length).toBe(CLAUSED_KINDS.length);
    for (const [kind, clause] of Object.entries(EXPERIENCE_CLAUSES)) {
      // anchored: the two lines above prove both matchers fire and the register is non-empty
      expect(clause, kind).not.toMatch(STOP);
      // anchored: same pair of controls
      expect(clause, kind).not.toMatch(CAPITAL);
    }
    // anchored: the STOP control above proves this matcher fires
    expect(DECAY_CLAUSE).not.toMatch(STOP);
  });
});

describe('W-LIVES L7 — the articles (the news address law)', () => {
  const address = ['Kaldmark', 'Elhollow'];

  function compose(overrides = {}) {
    const npc = authoredNpc();
    return characterArticles({
      receipts: receiptSet(),
      wnpcId: 'w1',
      name: 'Aldric',
      address,
      chart: effectiveChartOf(npc, null),
      project: fixtureProjection,
      ...overrides,
    });
  }

  test('every frame composes, in tick order, and the other soul is dropped', () => {
    const { articles, refusals } = compose();
    expect(refusals).toEqual([]);
    expect(articles.map((a) => a.line)).toEqual([
      'Aldric is now notably brave.',
      'Aldric runs more wrathful now than brave.',
      'Where Aldric was patient, Aldric is now wrathful.',
      'Aldric is no longer trusting.',
    ]);
    expect(articles.every((a) => a.wnpcId === 'w1')).toBe(true);
  });

  test('all four parts of the address law are present on every article', () => {
    for (const article of compose().articles) {
      expect(article.address).toEqual(address);            // ADDRESS CHAIN
      expect(ARTICLE_ACTIONS).toContain(article.action);   // TYPED ACTION
      expect(article.subject).toBe('Aldric');              // NAMES
      expect(article.reasons.length).toBeGreaterThan(0);   // REASON
    }
  });

  test('the reason is the bound evidence, and the homeward walk names itself', () => {
    const byAxis = Object.fromEntries(compose().articles.map((a) => [`${a.action}:${a.axisId}`, a.reasons]));
    expect(byAxis['band_crossing:COURAGE']).toEqual(['a battle survived']);
    expect(byAxis['reversal:TEMPER']).toEqual(["a friend's betrayal"]);
    // an axis no lesson touched was moved by decay, and the crossing's own CAUSE says so
    expect(byAxis['band_crossing:TRUST']).toEqual([DECAY_CLAUSE]);
  });

  test('a crossing INTO neutral inverts the frame rather than naming a pole it has not got', () => {
    expect(compose().articles.find((a) => a.axisId === 'TRUST').line)
      .toBe('Aldric is no longer trusting.');
  });

  test('⛔ MUTATION PLANT #9\'s CURE: the reasons DEDUPLICATE and sort', () => {
    // Every receipt in the standard set carries ONE source kind, so dropping the
    // dedupe-and-sort changed nothing any assertion could see. Two lessons of the
    // same kind in one tick are ONE reason, and the order is the record's, not the
    // adapter's.
    const receipts = [{
      kind: 'band_crossing', wnpcId: 'w1', axisId: 'COURAGE', tick: 10,
      crossing: { from: 'virtue_a_touch', to: 'virtue_marked', cause: 'ordeal', tick: 10 },
      sourceKinds: ['survived_battle', 'betrayed_by_friend', 'survived_battle'],
      sourceEventIds: ['e1', 'e2'],
    }];
    expect(compose({ receipts }).articles[0].reasons)
      .toEqual(['a battle survived', "a friend's betrayal"]);
  });

  test('⛔ MUTATION PLANT #15\'s CURE: a chart value that is NOT A NUMBER is refused', () => {
    // §711.6's family. `Number('-3')` is a perfectly good −3, so a numeric guard would
    // name the man wrathful on the strength of a string nobody promised was a chart
    // value. The displacement is the only frame that reads the chart, so it is where
    // the type check is observable.
    const receipts = receiptSet().filter((row) => row.kind === 'displacement');
    expect(receipts.length).toBe(1);
    const refused = compose({ receipts, chart: { TEMPER: '-3', COURAGE: 2 } });
    expect(refused.articles).toEqual([]);
    expect(refused.refusals.map((r) => r.reason)).toEqual(['no_word']);
    // anchored: the SAME receipt composes when the same values are real numbers, so
    // this is the TYPE being refused and not the displacement being broken
    expect(compose({ receipts, chart: { TEMPER: -3, COURAGE: 2 } }).articles[0].line)
      .toBe('Aldric runs more wrathful now than brave.');
  });

  test('⛔ NO ENGINE TOKEN, NO NUMERAL AND NO PRONOUN reaches a composed line', () => {
    const NUMERAL = /[0-9]/;
    const TOKEN = /_/;
    const AXIS_ID = /\b(?:COURAGE|TEMPER|TRUST|MERCY)\b/;
    const PRONOUN = /\b(?:he|she|his|her|him|hers|they|their|them)\b/i;
    // ⭐ ALL FOUR DETECTORS ARE PROVED TO FIRE on the sentence they exist to forbid —
    // §5's own illustrative line, which is exactly the shape a careless composer would
    // produce. Without this, four regexes that had stopped matching anything would pass
    // silently forever.
    //
    // ⚠ AND WRITING THE CONTROL FOUND A HOLE IN THE DETECTOR ITSELF, WHICH IS THE
    // WHOLE ARGUMENT FOR CONTROLS: the first draft of BAD read `TEMPER_vice_defining`,
    // and AXIS_ID did NOT match it — `_` is a word character, so `\bTEMPER\b` has no
    // boundary after it. An axis id buried in a compound token is invisible to the id
    // detector and is caught only by TOKEN. Both are kept, and the control now names an
    // axis id standing alone so each detector is proved on the case it actually owns.
    const BAD = 'TEMPER overtook his patience at tick 12 (vice_defining)';
    for (const detector of [NUMERAL, TOKEN, AXIS_ID, PRONOUN]) expect(BAD).toMatch(detector);
    const articles = compose().articles;
    expect(articles.length).toBeGreaterThan(0);
    for (const article of articles) {
      // anchored: every detector is proved to fire on BAD above, and the list is non-empty
      expect(article.line).not.toMatch(NUMERAL);
      // anchored: same four proved detectors
      expect(article.line).not.toMatch(TOKEN);
      // anchored: same four proved detectors
      expect(article.line).not.toMatch(AXIS_ID);
      // anchored: same four proved detectors
      expect(article.line).not.toMatch(PRONOUN);
    }
  });

  test('REFUSED, not guessed: no name', () => {
    const { articles, refusals } = compose({ name: '   ' });
    expect(articles).toEqual([]);
    expect([...new Set(refusals.map((r) => r.reason))]).toEqual(['no_name']);
  });

  test('REFUSED, not guessed: no projection ⇒ no prose at all', () => {
    const { articles, refusals } = compose({ project: undefined });
    expect(articles).toEqual([]);
    expect([...new Set(refusals.map((r) => r.reason))]).toEqual(['no_projection']);
  });

  test('REFUSED, not guessed: a displacement with NO CHART cannot name either side', () => {
    const { articles, refusals } = compose({ chart: undefined });
    // the two crossings and the reversal still compose — they carry their own bands
    expect(articles.map((a) => a.action)).toEqual(['band_crossing', 'reversal', 'band_crossing']);
    expect(refusals).toEqual([{ reason: 'no_word', action: 'displacement', wnpcId: 'w1', axisId: 'TEMPER' }]);
  });

  test('REFUSED, not guessed: an unreadable tick is DROPPED, never filed at tick zero', () => {
    const receipts = receiptSet().map((row) => (row.axisId === 'COURAGE' ? { ...row, tick: null } : row));
    const { articles, refusals } = compose({ receipts });
    expect(articles.some((a) => a.axisId === 'COURAGE')).toBe(false);
    expect(refusals.map((r) => r.reason)).toEqual(['no_tick']);
    // ⚠ THE HAZARD THIS PINS: Number(null) is 0 and 0 is finite, so a numeric guard
    // would have filed a whole life at the beginning of the world.
    expect(articles.every((a) => a.tick > 0)).toBe(true);
  });

  test('REFUSED, not guessed: an unknown action and a receipt with no axis', () => {
    const { articles, refusals } = compose({
      receipts: [
        { kind: 'gossip', wnpcId: 'w1', axisId: 'COURAGE', tick: 3 },
        { kind: 'band_crossing', wnpcId: 'w1', axisId: '', tick: 3, crossing: { to: 'virtue_marked' } },
      ],
    });
    expect(articles).toEqual([]);
    expect(refusals.map((r) => r.reason)).toEqual(['unknown_action', 'no_axis']);
  });

  test('every refusal reason is a member of the closed vocabulary', () => {
    const seen = [
      ...compose({ name: '' }).refusals,
      ...compose({ project: undefined }).refusals,
      ...compose({ chart: undefined }).refusals,
      ...compose({ receipts: [{ kind: 'gossip', wnpcId: 'w1', axisId: 'X', tick: 1 }] }).refusals,
    ];
    expect(seen.length).toBeGreaterThan(0);
    for (const row of seen) expect(ARTICLE_REFUSALS).toContain(row.reason);
  });

  test('an axis the fixture projection does not home refuses rather than inventing a word', () => {
    const receipts = [{
      kind: 'band_crossing', wnpcId: 'w1', axisId: 'INDUSTRY', tick: 7,
      crossing: { from: 'neutral', to: 'virtue_marked', cause: 'career', tick: 7 },
      sourceKinds: ['promotion_won'], sourceEventIds: ['e5'],
    }];
    const { articles, refusals } = compose({ receipts });
    expect(articles).toEqual([]);
    expect(refusals.map((r) => r.reason)).toEqual(['no_word']);
  });
});

describe('W-LIVES L7 — GAP D: biography is a query, not a store', () => {
  test('⭐ disclosuresFor is the query knownCharacterOf has been waiting for', () => {
    const disclosures = disclosuresFor({ receipts: receiptSet(), wnpcId: 'w1' });
    expect(disclosures.map((row) => row.axisId)).toEqual(['COURAGE', 'TEMPER', 'TEMPER', 'TRUST']);
    // and it really feeds the reader it was written for
    const reading = knownCharacterOf({
      npc: authoredNpc(), disclosures, worldState: {}, subjectNpcKey: 'k1', tick: 50,
    });
    expect(reading.disclosedAxes).toEqual(['COURAGE', 'TEMPER', 'TRUST']);
    expect(reading.confidence).toBeGreaterThan(0);
  });

  test('the query is a property of the record SET, not of its arrival order', () => {
    const forward = disclosuresFor({ receipts: receiptSet(), wnpcId: 'w1' });
    const reversed = disclosuresFor({ receipts: [...receiptSet()].reverse(), wnpcId: 'w1' });
    expect(reversed).toEqual(forward);
  });

  test('a foreign subject, an unreadable tick and a non-disclosure kind are all dropped', () => {
    const receipts = [
      ...receiptSet(),
      { kind: 'band_crossing', wnpcId: 'w1', axisId: 'MERCY', tick: '40', crossing: { to: 'vice_marked' } },
      { kind: 'character_legacy', wnpcId: 'w1', axisId: 'MERCY', tick: 41 },
    ];
    const out = disclosuresFor({ receipts, wnpcId: 'w1' });
    expect(out.every((row) => row.wnpcId === 'w1')).toBe(true);
    expect(out.every((row) => DISCLOSURE_KINDS.includes(row.kind))).toBe(true);
    expect(out.length).toBe(4);
    // anchored: the dropped rows were really in the input
    expect(receipts.length).toBe(7);
  });

  test('an absent subject asks nothing and gets nothing', () => {
    expect(disclosuresFor({ receipts: receiptSet(), wnpcId: '' })).toEqual([]);
    expect(disclosuresFor({ receipts: undefined, wnpcId: 'w1' })).toEqual([]);
  });

  test('⭐ the biography is chronological, and its MARKS are GAP D\'s own sentence', () => {
    const bio = biographyOf({ receipts: receiptSet(), wnpcId: 'w1' });
    expect(bio.lived).toBe(true);
    expect(bio.entries.map((row) => row.tick)).toEqual([10, 12, 12, 40]);
    // deduplicated across the whole life, in FIRST-ARRIVAL order — a biography is
    // chronological and a set is not
    expect(bio.marks).toEqual(['a battle survived', "a friend's betrayal", DECAY_CLAUSE]);
  });

  test('⛔ MUTATION PLANT #17\'s CURE: the marks are CHRONOLOGICAL, on a case where that differs from sorted', () => {
    // ⚠ THE ORDERING TEST ABOVE WAS VACUOUS AND ONLY A PLANT FOUND IT: the standard
    // set's three clauses happen to arrive in alphabetical order, so sorting them
    // changed nothing. That is car L5's own law one car later — an ordering assertion
    // proves nothing unless the two orders actually differ. This fixture inverts them.
    const receipts = [
      {
        kind: 'band_crossing', wnpcId: 'w1', axisId: 'TEMPER', tick: 5,
        crossing: { from: 'neutral', to: 'virtue_marked', cause: 'creed', tick: 5 },
        sourceKinds: ['took_holy_orders'], sourceEventIds: ['e1'],
      },
      {
        kind: 'band_crossing', wnpcId: 'w1', axisId: 'COURAGE', tick: 9,
        crossing: { from: 'neutral', to: 'virtue_marked', cause: 'ordeal', tick: 9 },
        sourceKinds: ['survived_battle'], sourceEventIds: ['e2'],
      },
    ];
    const marks = biographyOf({ receipts, wnpcId: 'w1' }).marks;
    expect(marks).toEqual(['the taking of holy orders', 'a battle survived']);
    // anchored: the two orders really are different here, which is what the assertion
    // above is worth — sorted would put the battle first
    expect([...marks].sort()).not.toEqual(marks);
  });

  test('a soul the record never names has no biography, and says so', () => {
    const bio = biographyOf({ receipts: receiptSet(), wnpcId: 'nobody' });
    expect(bio.lived).toBe(false);
    expect(bio.entries).toEqual([]);
    expect(bio.marks).toEqual([]);
  });

  test('no store is minted: the receipt set is byte-identical after every query', () => {
    const receipts = receiptSet();
    const before = JSON.stringify(receipts);
    disclosuresFor({ receipts, wnpcId: 'w1' });
    biographyOf({ receipts, wnpcId: 'w1' });
    characterArticles({ receipts, wnpcId: 'w1', name: 'Aldric', project: fixtureProjection });
    expect(JSON.stringify(receipts)).toBe(before);
  });
});

describe('W-LIVES L7 — the dossier surface (§7) and the sight ruling', () => {
  function driftedCase() {
    const npc = {
      id: 'n1',
      name: 'Aldric',
      character: {
        axes: {
          COURAGE: { pole: 'virtue', level: 'marked' },
          TEMPER: { pole: 'virtue', level: 'marked' },
        },
      },
    };
    return {
      npc,
      // TEMPER has curdled all the way through the midpoint.
      drift: { TEMPER: { offset: -5, updatedTick: 12 } },
      receipts: [{
        kind: 'band_crossing', wnpcId: 'w1', axisId: 'TEMPER', tick: 12,
        crossing: { from: 'virtue_marked', to: 'vice_defining', direction: 'down', cause: 'bond', tick: 12 },
        sourceKinds: ['betrayed_by_friend'], sourceEventIds: ['e2'],
      }],
    };
  }

  function dossier(extra) {
    const { npc, drift, receipts } = driftedCase();
    return characterDossier({
      npc, drift, receipts, wnpcId: 'w1', name: 'Aldric',
      worldState: {}, subjectNpcKey: 'k1', tick: 20, project: fixtureProjection, ...extra,
    });
  }

  test('⭐⭐ the god and the town do not merely word it differently — the LEAD CHANGES HANDS', () => {
    expect(dossier({ viewer: 'deity' }).lead).toBe('above all wrathful, notably brave.');
    expect(dossier({ viewer: 'mortal' }).lead).toBe('notably brave, a little wrathful.');
    // the ORDER is what moved, not only the level word
    expect(dossier({ viewer: 'deity' }).positions[0].axisId).toBe('TEMPER');
    expect(dossier({ viewer: 'mortal' }).positions[0].axisId).toBe('COURAGE');
  });

  test('⭐ UNRECEIPTED DRIFT STAYS PRIVATE, all the way to the sentence', () => {
    // Same curdled soul, nothing on record: the town still reads him as patient.
    expect(dossier({ viewer: 'mortal', receipts: [] }).lead)
      .toBe('notably brave, notably patient.');
    // and the true chart really has moved, so this cannot pass on a quiet fixture
    expect(dossier({ viewer: 'deity', receipts: [] }).lead)
      .toBe('above all wrathful, notably brave.');
  });

  test('the viewer FAILS CLOSED — an absent or unknown viewer reads as a mortal', () => {
    const known = dossier({ viewer: 'mortal' }).lead;
    expect(dossier({ viewer: undefined }).lead).toBe(known);
    expect(dossier({ viewer: 'archivist' }).lead).toBe(known);
    expect(dossier({ viewer: 'DEITY' }).lead).toBe(known);
  });

  test('the dossier carries the biography beside the chart, from the same receipts', () => {
    const block = dossier({ viewer: 'deity' });
    expect(block.biography.marks).toEqual(["a friend's betrayal"]);
    expect(block.subject).toBe('Aldric');
  });

  test('DARK ARM: a soul with no chart yields an empty block that claims nothing', () => {
    const block = characterDossier({
      npc: { id: 'x' }, wnpcId: 'w1', name: 'Nobody', receipts: [], project: fixtureProjection,
    });
    expect(block.positions).toEqual([]);
    expect(block.lead).toBe('');
    expect(block.biography.lived).toBe(false);
  });
});

describe('W-LIVES L7 — totality, purity and the declared seam', () => {
  test('every export is total on garbage rather than throwing', () => {
    expect(() => readPositions({ chart: null })).not.toThrow();
    expect(readPositions({ chart: 'nonsense' })).toEqual([]);
    expect(leadLine(null)).toBe('');
    expect(leadLine('nonsense')).toBe('');
    expect(reasonsOf(null)).toEqual([]);
    expect(bandParts(null)).toEqual({ pole: '', level: '' });
    expect(bandParts('virtue_shouted')).toEqual({ pole: '', level: '' });
    expect(bandParts('neutral')).toEqual({ pole: '', level: '' });
    // ⛔ MUTATION PLANT #4's CURE. The three rows above all fail on the LEVEL, so
    // dropping the POLE check entirely left every one of them green — a malformed
    // disclosure could carry `pole: 'sideways'` into the projection unchallenged.
    // A valid level with an invalid pole is the only shape that tests the pole check.
    expect(bandParts('sideways_marked')).toEqual({ pole: '', level: '' });
    expect(bandParts('virtue_marked')).toEqual({ pole: 'virtue', level: 'marked' });
    expect(chartValuesOf(undefined)).toEqual({});
    expect(() => characterArticles({ receipts: null, wnpcId: '', name: '' })).not.toThrow();
    expect(() => biographyOf({ receipts: 'nonsense', wnpcId: 'w1' })).not.toThrow();
  });

  test('every returned collection is frozen', () => {
    const rows = readingOf({ npc: authoredNpc(), project: fixtureProjection });
    expect(Object.isFrozen(rows)).toBe(true);
    expect(Object.isFrozen(rows[0])).toBe(true);
    const out = characterArticles({
      receipts: receiptSet(), wnpcId: 'w1', name: 'Aldric', project: fixtureProjection,
    });
    expect(Object.isFrozen(out)).toBe(true);
    expect(Object.isFrozen(out.articles)).toBe(true);
    expect(Object.isFrozen(biographyOf({ receipts: receiptSet(), wnpcId: 'w1' }))).toBe(true);
  });

  test('the module is PURE on its face — no clock, no PRNG, no store, no I/O', () => {
    const source = readFileSync(MODULE_PATH, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*$/gm, '$1');
    // the file really was read and comments really were stripped, so an empty string
    // cannot pass this loop
    expect(source.length).toBeGreaterThan(2000);
    expect(source).toContain('export function readPositions');
    for (const banned of ['Date.now', 'Math.random', 'new Date', 'localStorage', 'process.env']) {
      // anchored: the two lines above prove `source` is the real, non-empty module body
      expect(source, banned).not.toContain(banned);
    }
  });

  test('the provenance is CANDIDATE and UNSIGNED, and names the frames as an owner row', () => {
    expect(CHARACTER_READ_PROVENANCE.signedBy).toBeNull();
    expect(CHARACTER_READ_PROVENANCE.status).toContain('CANDIDATE');
    expect(CHARACTER_READ_PROVENANCE.ownerRows.length).toBeGreaterThanOrEqual(5);
    expect(CHARACTER_READ_PROVENANCE.ownerRows.join(' ')).toMatch(/FRAMES/i);
  });

  test('the herald registration is PRICED and deliberately not taken', () => {
    // The seam must name the two instruments a wiring car has to satisfy, so the bill
    // cannot be re-discovered by whoever takes it.
    expect(CHARACTER_NEWS_REGISTRATION_SEAM.census).toContain('newsAuthoringCensus');
    expect(CHARACTER_NEWS_REGISTRATION_SEAM.routing).toContain('heraldRouting');
    expect(CHARACTER_NEWS_REGISTRATION_SEAM.owed.length).toBeGreaterThanOrEqual(3);
    // and this file really does mint no news: no authoring site exists in it. The
    // detector is proved against the estate's own news writer, which legitimately has
    // one — so a regex that had stopped matching would red here, not pass below.
    const HEADLINE_SITE = /^\s*headline\s*:/m;
    expect(readFileSync(join(HERE, '../../../src/domain/worldPulse/dispositionNews.js'), 'utf8'))
      .toMatch(HEADLINE_SITE);
    const source = readFileSync(MODULE_PATH, 'utf8');
    // anchored: the line above proves this exact matcher fires on a real authoring site
    expect(source).not.toMatch(HEADLINE_SITE);
  });
});
