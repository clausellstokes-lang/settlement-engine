/**
 * seatVocabularyUnification.walker.test.js — CR-ES-3's both-vocab equality pin, and the
 * one-spelling scan that keeps the estate at ONE law-band vocabulary.
 *
 * ═══ WHAT WAS BROKEN, MEASURED RATHER THAN DESCRIBED ═══
 *
 * `warSeatBooks.readWarSeatBooks` PRODUCES three seat-character bands. Two built leaves
 * CONSUME them through exact-key normalizers with frozen closed sets:
 * `ransomChoices.normalizeCaptorCourt` / `normalizeHomeCourt` and
 * `envoyTestimony.normalizeTestimonySeat`. Before CR-ES-3 the producer and the consumers
 * agreed on every rung BUT ONE APIECE:
 *
 *     lawfulness   producer `chaotic`     consumers `lawless`
 *     morality     producer `benevolent`  consumers `merciful`
 *     security     producer `contested`   consumers `holding`
 *
 * `closedValue` returns null for a non-member and each normalizer then returns null for
 * the WHOLE ROW, so a wired producer->consumer row would not have been mis-graded — it
 * would have VANISHED. Latent only because no src producer wired them; espionage is the
 * first subsystem with a reason to (a caught spy's captor reads its own seat character).
 * `envoyTestimony`'s credibility-first arm already tested
 * `court.lawfulnessBand === 'lawless'`, a value the producer could not emit: a dead arm
 * in the tree, shipped.
 *
 * ═══ WHY THIS FILE AND NOT A UNIT TEST ═══
 *
 * The equality has to be measured in BOTH directions and at the level where it can rot.
 * A unit test on the producer would pin transcribed words; a unit test on the consumer
 * would pin its own frozen set. What matters is the JOIN: a row this producer really
 * emits must survive the normalizer that really receives it, and the retired words must
 * really be rejected — which is what proves this file is measuring the break rather than
 * agreeing with itself.
 *
 * ⚠ AND THE SWEEP TRAP IS PINNED TOO. `warSeatBooks.js` also parses D&D ALIGNMENT TOKENS
 * with `token.includes('chaotic')`, and `settlementPolitics.js` and `piety.js` do the
 * same on their own inputs. Those are a DIFFERENT vocabulary. A text sweep of 'chaotic'
 * would break them silently, so this file asserts those token parses are still present:
 * the retarget is by SYMBOL, never by word.
 */
import { describe, expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { readWarSeatBooks } from '../../src/domain/worldPulse/warSeatBooks.js';
import {
  RANSOM_SEAT_LAWFULNESS,
  RANSOM_SEAT_MORALITY,
  RANSOM_SEAT_SECURITY,
  normalizeCaptorCourt,
  normalizeHomeCourt,
} from '../../src/domain/worldPulse/ransomChoices.js';
import {
  TESTIMONY_SEAT_LAWFULNESS,
  TESTIMONY_SEAT_MORALITY,
  TESTIMONY_SEAT_SECURITY,
  normalizeTestimonySeat,
} from '../../src/domain/worldPulse/envoyTestimony.js';
import { LAW_WORDS, lawWordFor } from '../../src/domain/worldPulse/espionage/espionageDoctrine.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

const RULES = Object.freeze({ settlementPoliticsEnabled: true, factionCompetitionEnabled: true });

/** The WR-5 harness shape, kept minimal: this file is about words, not about weights. */
function ruler(overrides = {}) {
  return {
    id: 'ruler',
    name: 'Lady Arin',
    importance: 'pillar',
    factionAffiliation: 'Crown',
    personality: { dominant: 'principled', flaw: 'patient', modifier: 'diplomatic' },
    facets: { alignment: 'lawful_good', goal: 'protect_followers' },
    ...overrides,
  };
}

function item({ legitimacy = 75, crownPower = 70, npcs = [ruler()] } = {}) {
  return {
    id: 'a',
    name: 'Aster',
    settlement: {
      name: 'Aster',
      tier: 'city',
      npcs,
      powerStructure: {
        governingName: 'Crown',
        publicLegitimacy: { score: legitimacy },
        previousGovernments: [],
        factions: [
          { id: 'fac.crown', faction: 'Crown', power: crownPower, isGoverning: true },
          { id: 'fac.rival', faction: 'Rival House', power: 30 },
        ],
      },
    },
  };
}

function world() {
  return {
    simulationRules: { ...RULES },
    spatialLedgers: { npcLadder: { a: { factions: { 'fac.crown': { rungs: ['a:ruler'] } }, npcs: { 'a:ruler': { stock: 7 } } } } },
  };
}

/** Real producer output across the alignment and legitimacy space this harness reaches. */
const PRODUCED = [];
for (const alignment of ['lawful_good', 'chaotic_evil', 'neutral', 'lawful_evil', 'chaotic_good']) {
  for (const legitimacy of [1, 30, 50, 75, 99]) {
    const actor = item({ legitimacy, npcs: [ruler({ facets: { alignment, goal: 'protect_followers' } })] });
    PRODUCED.push(readWarSeatBooks({
      worldState: world(),
      snapshot: { settlements: [actor], byId: new Map([['a', actor]]) },
      actorId: 'a',
      opponentId: 'b',
    }));
  }
}
// And the no-ruler realm arm, which emits its own three words.
const REALM_ARM = readWarSeatBooks({
  worldState: { simulationRules: { ...RULES }, spatialLedgers: { npcLadder: {} } },
  snapshot: (() => { const a = item(); return { settlements: [a], byId: new Map([['a', a]]) }; })(),
  actorId: 'a',
  opponentId: 'b',
});
const ALL_ROWS = [...PRODUCED, REALM_ARM];

/** The exact-key rows the two consumers demand, built from a producer row. */
const captorRowFrom = (books) => ({
  settlementId: 'a',
  rulerPresent: true,
  lawfulnessBand: books.lawfulnessBand,
  moralityBand: books.moralityBand,
  securityBand: books.securityBand,
  leverageBand: 'useful',
});
const homeRowFrom = (books) => ({
  settlementId: 'a',
  rulerPresent: true,
  lawfulnessBand: books.lawfulnessBand,
  moralityBand: books.moralityBand,
  securityBand: books.securityBand,
  meansBand: 'comfortable',
  regardBand: 'valued',
});
const seatRowFrom = (books) => ({
  settlementId: 'a',
  rulerPresent: true,
  lawfulnessBand: books.lawfulnessBand,
  moralityBand: books.moralityBand,
  securityBand: books.securityBand,
  desiredOutcome: 'peace',
});

describe('the two consumer vocabularies are one vocabulary', () => {
  test('ransom and testimony froze the SAME three sets', () => {
    // If these ever diverge, "the consumer vocabulary" stops being a single thing and
    // CR-ES-3's unification target becomes ambiguous.
    expect([...RANSOM_SEAT_LAWFULNESS]).toEqual([...TESTIMONY_SEAT_LAWFULNESS]);
    expect([...RANSOM_SEAT_MORALITY]).toEqual([...TESTIMONY_SEAT_MORALITY]);
    expect([...RANSOM_SEAT_SECURITY]).toEqual([...TESTIMONY_SEAT_SECURITY]);
    expect([...RANSOM_SEAT_LAWFULNESS]).toEqual(['lawless', 'balanced', 'lawful']);
    expect([...RANSOM_SEAT_MORALITY]).toEqual(['merciful', 'balanced', 'malicious']);
    expect([...RANSOM_SEAT_SECURITY]).toEqual(['unseated', 'precarious', 'holding', 'secure']);
  });

  test('the minted law word set IS the consumer law set (order aside)', () => {
    expect([...LAW_WORDS].sort()).toEqual([...RANSOM_SEAT_LAWFULNESS].sort());
    // Executed, not transcribed: the function really returns those words.
    expect(new Set([lawWordFor(0), lawWordFor(0.5), lawWordFor(1)]))
      .toEqual(new Set(RANSOM_SEAT_LAWFULNESS));
  });
});

describe('THE BOTH-VOCAB EQUALITY PIN — a real producer row survives the real consumers', () => {
  test('the corpus is real and reaches more than one rung (guard the guard)', () => {
    expect(ALL_ROWS.length).toBeGreaterThan(20);
    expect(new Set(ALL_ROWS.map((r) => r.lawfulnessBand)).size).toBeGreaterThan(1);
    expect(new Set(ALL_ROWS.map((r) => r.moralityBand)).size).toBeGreaterThan(1);
    expect(new Set(ALL_ROWS.map((r) => r.securityBand)).size).toBeGreaterThan(1);
  });

  test('every band the producer emits is a member of the consumer sets', () => {
    for (const books of ALL_ROWS) {
      expect(RANSOM_SEAT_LAWFULNESS, `producer emitted ${books.lawfulnessBand}`).toContain(books.lawfulnessBand);
      expect(RANSOM_SEAT_MORALITY, `producer emitted ${books.moralityBand}`).toContain(books.moralityBand);
      expect(RANSOM_SEAT_SECURITY, `producer emitted ${books.securityBand}`).toContain(books.securityBand);
      // The patron books carry the same two ladders and must move with them.
      if (books.patronLawfulnessBand !== undefined) {
        expect(RANSOM_SEAT_LAWFULNESS).toContain(books.patronLawfulnessBand);
        expect(RANSOM_SEAT_MORALITY).toContain(books.patronMoralityBand);
      }
    }
  });

  test('THE JOIN: a wired row does not vanish in any of the three normalizers', () => {
    for (const books of ALL_ROWS) {
      expect(normalizeCaptorCourt(captorRowFrom(books)), 'the captor row vanished').not.toBeNull();
      expect(normalizeHomeCourt(homeRowFrom(books)), 'the home row vanished').not.toBeNull();
      expect(normalizeTestimonySeat(seatRowFrom(books)), 'the testimony seat vanished').not.toBeNull();
    }
  });

  test('THE NEGATIVE CONTROL: the RETIRED producer words are still rejected', () => {
    // anchored: this is what proves the join above measures something. Each retired word
    // is fed alone, so a normalizer that had quietly widened its set would red here
    // rather than making the positive test trivially true.
    const base = ALL_ROWS[0];
    for (const [field, retired] of [
      ['lawfulnessBand', 'chaotic'],
      ['moralityBand', 'benevolent'],
      ['securityBand', 'contested'],
    ]) {
      expect(normalizeCaptorCourt({ ...captorRowFrom(base), [field]: retired }),
        `${retired} was accepted — the consumer set widened instead of the producer moving`).toBeNull();
      expect(normalizeTestimonySeat({ ...seatRowFrom(base), [field]: retired })).toBeNull();
    }
  });

  test('the credibility-first arm that was DEAD is now reachable', () => {
    // `envoyTestimony` tests `court.lawfulnessBand === 'lawless'`. Before the retarget no
    // producer could supply that value. This asserts the producer can now reach it —
    // through the minted word function, on a real alignment.
    expect(lawWordFor(0.1)).toBe('lawless');
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/envoyTestimony.js'), 'utf8');
    expect(source, "the arm this retarget revived was deleted — re-point this pin or drop it")
      .toContain("lawfulnessBand === 'lawless'");
  });
});

describe('THE ONE-SPELLING SCAN — no fourth law-band vocabulary', () => {
  const seatBooks = readFileSync(join(ROOT, 'src/domain/worldPulse/warSeatBooks.js'), 'utf8');

  test('warSeatBooks retired its private lawfulness band to the minted leaf', () => {
    // anchored: the two positive assertions below prove this source was really read and
    // really carries the new import, so the absence of the retired private function is a
    // measurement rather than an empty-file pass.
    expect(seatBooks, 'warSeatBooks still declares a private law-band function')
      .not.toMatch(/function\s+lawfulnessBand\s*\(/); // anchored: the toContain below reads the same source
    expect(seatBooks).toContain('lawWordFor');
    // THE ONE HOME is the shared-vocabulary leaf, NOT the espionage program's own
    // doctrine file. A law word is spelled by four ports; homing it inside one of them
    // would make every other port's reading of "lawful" a cross-layer coupling — the
    // argument tests/lint/couplingInclusion.walker.test.js already records for its two
    // SP substrate leaves, applied one rung down.
    expect(seatBooks, 'the import must come from the ONE home')
      .toMatch(/from\s+'\.\/lawWord\.js'/);
  });

  test('the producer no longer emits any retired seat-band word as a band VALUE', () => {
    // Scoped to the band-returning code, not to the file: the alignment token parse
    // below legitimately contains the word 'chaotic'.
    // anchored: each retired word is checked against the SURVIVING spelling of the same
    // shape in the same file, so a source that stopped containing band returns entirely
    // reds on the positive half instead of passing all three negatives vacuously.
    expect(seatBooks, 'the morality ladder stopped returning bands').toMatch(/return\s+'malicious'/);
    expect(seatBooks, 'the security ladder stopped emitting bands').toMatch(/\?\s*'holding'\s*:/);
    // anchored: the two toMatch assertions above prove this source still returns bands.
    expect(seatBooks).not.toMatch(/return\s+'chaotic'/); // anchored: see the two toMatch above
    expect(seatBooks).not.toMatch(/return\s+'benevolent'/); // anchored: see the two toMatch above
    expect(seatBooks).not.toMatch(/\?\s*'contested'\s*:/); // anchored: see the two toMatch above
  });

  test('DO NOT SWEEP THE WORD: the alignment TOKEN parses are untouched', () => {
    // anchored: a text sweep of 'chaotic' would silently break three token parsers that
    // read a DIFFERENT vocabulary. The retarget is by symbol; these three must survive it.
    expect(seatBooks, 'warSeatBooks alignment token parse was swept').toContain("token.includes('chaotic')");
    for (const rel of ['src/domain/worldPulse/settlementPolitics.js', 'src/domain/worldPulse/piety.js']) {
      const source = readFileSync(join(ROOT, rel), 'utf8');
      expect(source, `${rel}: its own alignment token vocabulary was swept`).toMatch(/'chaotic'/);
    }
  });
});

describe('THE FOURTH CONSUMER — the one the ruling did not name', () => {
  test('warRulingsNews BAND_WORD covers every security rung the producer can emit', () => {
    // MEASURED, NOT INHERITED. CR-ES-3's cost note named three consumer files; a fourth
    // exists. `warRulingsNews.js` looks the security band up in a WORD table:
    //   BAND_WORD[row.band || row.refusalCostBand || row.rulerSecurityBand] || ''
    // and `rulerSecurityBand` really does reach it — `peaceDecisionRulingEvidence` spreads
    // the whole warTermination receipt onto every evidence row. A retarget that moved the
    // producer's rung without moving this key would drop the `{band}` interp slot out of
    // the WR-5 receipts silently: no exception, no red, just a poorer sentence. Because
    // the key moved WITH the word, the rendered prose is byte-identical for the same world.
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/warRulingsNews.js'), 'utf8');
    const start = source.indexOf('const BAND_WORD');
    const table = source.slice(start, source.indexOf('});', start));
    for (const rung of RANSOM_SEAT_SECURITY) {
      expect(table, `BAND_WORD has no word for the security rung ${rung}`).toContain(`${rung}:`);
    }
    // anchored: the loop above proves every live security rung IS keyed in this same
    // slice, so the absence of the retired key is measured against a populated table.
    // anchored: the rung loop above proves this table slice is populated.
    expect(table, 'the retired rung is still keyed — one of the two is now dead').not.toContain('contested:');
  });

  test('the negotiation press builder reads the RETARGETED morality word', () => {
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/envoyNegotiationPictureBuilder.js'), 'utf8');
    // The three toContain assertions below prove this source really carries the press
    // ladder's other reads, so the retired one being absent is a measurement.
    expect(source, "the press builder still reads the retired 'benevolent' — its merciful arm is dead")
      .not.toContain("books.moralityBand === 'benevolent'"); // anchored: three toContain assertions below read this source
    expect(source).toContain("books.moralityBand === 'merciful'");
    // The two rungs CR-ES-3 does not move must still be read, or this pin would pass on
    // a file that had simply deleted the arm.
    expect(source).toContain("books.moralityBand === 'malicious'");
    expect(source).toContain("books.lawfulnessBand === 'lawful'");
  });

  test('`natureWordFor` was NOT retargeted — benevolent lives in TWO ladders', () => {
    // The word `benevolent` belongs to the estate's ONE MORAL ladder as well as to
    // warSeatBooks' seat morality. Only the seat one moves. A retarget that followed the
    // WORD instead of the SYMBOL would break the espionage doctrine's own targeting arm.
    const source = readFileSync(join(ROOT, 'src/domain/worldPulse/conquestDoctrineStage.js'), 'utf8');
    expect(source, 'natureWordFor was swept — the estate moral ladder must be untouched')
      .toContain("'benevolent'");
  });
});
