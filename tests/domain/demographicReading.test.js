/**
 * demographicReading.test.js — CAPACITY C2, THE READING.
 *
 * The crowding line answers "what just happened here". This leaf answers the question a
 * reader actually arrives with, at any year, with nothing having just happened: HOW MUCH
 * ROOM DOES THIS TOWN HAVE LEFT? These arms pin that the answer is a sentence a person can
 * read, that it is honest when the mechanism is dark, that it never invents a famine out of
 * an uncounted harvest, and that no engine word leaks onto the surface.
 *
 * Every band expectation below is derived from the LIVE exported vocabulary rather than
 * restated, so a ladder change moves the expectation with the code instead of reddening a
 * transcription.
 */
import { describe, expect, test } from 'vitest';
import {
  CHIP_LABELS,
  DEMOGRAPHIC_READING_SENTINEL,
  OCCUPANCY_SENTENCES,
  READING_VOCABULARIES,
  demographicReadingViewOf,
  readingChipsOf,
} from '../../src/domain/display/demographicReading.js';
import { OVERFLOW_BANDS } from '../../src/domain/worldPulse/demographicsResponses.js';

const LIT = Object.freeze({ simulationRules: { demographicsEnabled: true } });
const DARK = Object.freeze({ simulationRules: {} });

/** A settlement carrying real food physics. `food: false` is a settlement whose harvest
 *  was never counted, which is a different thing from a settlement that is starving. */
function place({
  tier = 'town', terrain = 'plains', population = 1200, dailyProduction = 6000,
  importDependency = 0.2, deficitPct = 0, name = 'Ashford', food = true,
} = {}) {
  return {
    population,
    tier,
    name,
    config: { tier, terrainType: terrain },
    ...(food
      ? {
        economicState: {
          foodSecurity: {
            dailyNeed: population * 2,
            dailyProduction,
            deficitPct,
            surplusPct: 5,
            importDependency,
            storageMonths: 6,
            resilienceScore: 60,
          },
        },
      }
      : {}),
    npcs: [],
  };
}
const read = (settlement, worldState = LIT) => demographicReadingViewOf({
  settlement, worldState, settlementId: 'ashford',
});

describe('CAPACITY C2 — THE READING: how much room does this town have left', () => {
  test('DARK: a settlement in a world without the flag reads null, and so does an absent world', () => {
    // A display of a dark mechanism must be honest ABSENCE. A hedged sentence would tell a
    // reader something about a term that is not running.
    expect(read(place(), DARK)).toBeNull();
    expect(read(place(), {})).toBeNull();
    expect(read(place(), null)).toBeNull();
    expect(demographicReadingViewOf({})).toBeNull();
    expect(demographicReadingViewOf()).toBeNull();
    // THE POSITIVE CONTROL, without which every arm above passes against a function that
    // returns null unconditionally.
    expect(read(place())).not.toBeNull();
  });

  test('LIT: a town well inside its granary reads easy, granary, and a sentence that names the fields', () => {
    const view = read(place({ population: 400 }));
    expect(view).not.toBeNull();
    // anchored: the non-null assertion above proves the reads below are of a real view
    expect(view.occupancy).toBe('easy');
    expect(view.binding).toBe('granary');
    expect(view.foodKnown).toBe(true);
    expect(view.foodFlow).toBe('ample');
    expect(view.urbanLoad).toBe('open');
    expect(view.births).toBe('fruitful');
    expect(view.deaths).toBe('ordinary');
    expect(view.sentence).toContain('room to grow');
    expect(view.sentence).toContain('fields');
  });

  test('LIT: a town that has outgrown its walls reads overflowing, walls, and a sentence that names the walls', () => {
    const view = read(place({ tier: 'thorp', population: 200, dailyProduction: 200 }));
    expect(view).not.toBeNull();
    // anchored: the non-null assertion above proves the reads below are of a real view
    expect(view.occupancy).toBe('overflowing');
    expect(view.binding).toBe('walls');
    expect(view.urbanLoad).toBe('overspilled');
    expect(view.sentence).toContain('walls');
    expect(view.sentence).toContain('Some will leave');
    // and the DENSITY wall and the GRANARY wall produce DIFFERENT sentences, which is the
    // whole reason `binding` is in the key
    const hungry = read(place({ population: 3000, dailyProduction: 400, deficitPct: 40 }));
    expect(hungry.binding).toBe('granary');
    expect(hungry.foodFlow).toBe('famished');
    expect(hungry.sentence).not.toBe(view.sentence);
    // anchored: both sentences are asserted non-empty members of the authored table below
    expect(Object.values(OCCUPANCY_SENTENCES)).toContain(hungry.sentence);
  });

  test('LIT: unknown food never reads as famine, and the ground itself is the wall', () => {
    // ⛔ THE CLASS THIS ARM EXISTS FOR. A fixture with no food physics is not a starving
    // town; it is a town nobody measured. A view that read the absence as a deficit would
    // print a famine into every un-generated settlement in the estate.
    const view = read(place({ food: false }));
    expect(view).not.toBeNull();
    // anchored: the non-null assertion above proves the reads below are of a real view
    expect(view.foodKnown).toBe(false);
    expect(view.sentence).toContain('Nobody has counted the harvest');
    for (const famineWord of ['famine', 'starv', 'hunger', 'hungry']) {
      expect(view.sentence.toLowerCase().includes(famineWord),
        `an uncounted harvest was narrated as famine: ${view.sentence}`).toBe(false);
    }
    // and the two binding values COLLAPSE when the harvest is uncounted, because a town
    // whose food was never measured cannot honestly be told its granaries are the wall
    expect(OCCUPANCY_SENTENCES['easy|granary|false']).toBe(OCCUPANCY_SENTENCES['easy|walls|false']);
    expect(OCCUPANCY_SENTENCES['overflowing|granary|false']).toBe(OCCUPANCY_SENTENCES['overflowing|walls|false']);
  });

  test('every sentence in the table is authored: no digit, ratio, band token or id reaches it', () => {
    const sentences = Object.values(OCCUPANCY_SENTENCES);
    // Sixteen keys, twelve distinct sentences: the four food-unknown pairs collapse.
    expect(Object.keys(OCCUPANCY_SENTENCES)).toHaveLength(16);
    expect(new Set(sentences).size).toBe(12);
    expect(Object.isFrozen(OCCUPANCY_SENTENCES)).toBe(true);
    // anchored: the two counts above prove the loop below runs over a real, full table
    for (const sentence of sentences) {
      expect(sentence.length).toBeGreaterThan(60);
      // anchored: the length assertion on the line above proves this is real sentence text
      expect(sentence, `a raw digit reached the surface: ${sentence}`).not.toMatch(/[0-9]/);
      // anchored: same string, asserted long two lines above
      expect(sentence, `a ratio reached the surface: ${sentence}`).not.toMatch(/%/);
      // ⛔ NO RUNG OF THE OVERFLOW LADDER, CASE-INSENSITIVELY. That ladder is where this
      // view's headline band comes from, so its four words are the ones a reader could
      // mistake for a label. The other five vocabularies are NOT scanned here and the
      // omission is deliberate and stated: their members are ordinary English words
      // (`open`, `settled`, `short`, `thin`, `deep`, `bare`, `walls`) that an authored
      // sentence must be free to use. The defect the law names is a RAW TOKEN rendered as
      // a label, and the chips arm below tests exactly that, directly.
      for (const rung of OVERFLOW_BANDS) {
        expect(sentence.toLowerCase().includes(rung),
          `the ladder rung ${rung} reached the surface: ${sentence}`).toBe(false);
      }
      for (const id of ['pressure01', 'foodKnown', 'urbanLoad', 'binding', 'settlementId']) {
        expect(sentence.includes(id), `the field id ${id} reached the surface: ${sentence}`).toBe(false);
      }
      // ONE IDEA PER SENTENCE: every cell is exactly two sentences.
      expect(sentence.split('. '), `not two sentences: ${sentence}`).toHaveLength(2);
    }
  });

  test('the view speaks only frozen vocabularies, and every band word is a member of its ladder', () => {
    // FINITE SEMANTICS: this leaf mints no ladder. Every word it reports already existed,
    // and the composition of those ladders IS the view.
    const fixtures = [
      place({ population: 400 }),
      place(),
      place({ tier: 'thorp', population: 200, dailyProduction: 200 }),
      place({ tier: 'city', population: 40000, dailyProduction: 900000 }),
      place({ population: 3000, dailyProduction: 400, deficitPct: 40 }),
      place({ food: false }),
    ];
    const seen = new Set();
    for (const settlement of fixtures) {
      const view = read(settlement);
      expect(view, 'every fixture here is placed and lit and must read').not.toBeNull();
      // anchored: the non-null assertion above proves the loop body reads a real view
      expect(Object.isFrozen(view)).toBe(true);
      for (const [field, ladder] of Object.entries(READING_VOCABULARIES)) {
        expect(ladder, `${field}: ${view[field]} is not a member of its ladder`).toContain(view[field]);
      }
      expect(Object.keys(view).sort()).toEqual(
        ['binding', 'births', 'deaths', 'foodFlow', 'foodKnown', 'occupancy', 'reserve', 'sentence', 'urbanLoad'],
      );
      seen.add(view.occupancy);
    }
    // The fixtures reach more than one rung, so the arm above is not pinning one cell.
    expect(seen.size).toBeGreaterThanOrEqual(3);
  });

  test('no band token reaches the surface: the four chips render CHIP_LABELS text, never a ladder word', () => {
    const view = read(place({ tier: 'city', population: 40000, dailyProduction: 900000 }));
    expect(view).not.toBeNull();
    // anchored: the non-null assertion above proves the chips below come from a real view
    const chips = readingChipsOf(view);
    expect(chips).toHaveLength(4);
    expect(chips.map((c) => c.key)).toEqual([view.occupancy, view.binding, view.foodFlow, view.urbanLoad]);
    for (const chip of chips) {
      // ⛔ THE LAW: the rendered text is the AUTHORED label, and it does not merely differ
      // from its token, it does not CONTAIN it. A chip reading `walls` or `pressed` beside
      // the sentence is a label with its noun missing.
      expect(chip.label).not.toBe(chip.key);
      expect(chip.label.toLowerCase().includes(chip.key.toLowerCase()),
        `the chip for ${chip.key} renders its own raw token: ${chip.label}`).toBe(false);
      expect(chip.label.length).toBeGreaterThan(5);
    }
    // AND THE LAW HOLDS FOR EVERY LABEL IN THE TABLE, not only the four this fixture reached.
    expect(Object.keys(CHIP_LABELS)).toHaveLength(14);
    expect(Object.isFrozen(CHIP_LABELS)).toBe(true);
    for (const [token, label] of Object.entries(CHIP_LABELS)) {
      expect(label.toLowerCase().includes(token.toLowerCase()),
        `CHIP_LABELS.${token} contains its own raw token: ${label}`).toBe(false);
      // anchored: the includes() assertion above proves `label` is real, non-empty label text
      expect(label, `CHIP_LABELS.${token} must carry no digit`).not.toMatch(/[0-9]/);
    }
    // a dark or absent view has no chips at all, so the section renders nothing
    expect(readingChipsOf(null)).toEqual([]);
    expect(readingChipsOf(undefined)).toEqual([]);
    expect(readingChipsOf({})).toEqual([]);
  });

  test('INERT-NOT-CRASH: a garbage settlement and a garbage ledger read null', () => {
    // A display leaf that throws takes a tab down with it, so every corner returns rather
    // than raising. The positive control at the end proves the leaf still reads a real one.
    expect(read(null)).toBeNull();
    expect(read(undefined)).toBeNull();
    expect(read({})).toBeNull();
    expect(read('nonsense')).toBeNull();
    expect(read(42)).toBeNull();
    expect(read([])).toBeNull();
    expect(read({ population: 'many', economicState: 'gone' })).toBeNull();
    expect(read({ population: -5, tier: 'nowhere', economicState: { foodSecurity: null } })).toBeNull();
    expect(() => read({ economicState: { foodSecurity: { dailyNeed: NaN, dailyProduction: NaN } } })).not.toThrow();
    // anchored: every corner above returned rather than raising, and a real settlement still reads
    expect(read(place())).not.toBeNull();
    // the placement sentinel is a real, greppable string a build arm can ask for
    expect(DEMOGRAPHIC_READING_SENTINEL).toBe('demographic-reading-lazy-leaf-sentinel');
  });
});
