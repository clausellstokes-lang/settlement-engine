/**
 * faithDeepening.test.js — W-FAITH F7c: the faith tab's deepening read-model.
 *
 * The load-bearing claims, each with its own arm so a mutation reds by name:
 *   1. THE PINNED TOTAL ORDER — level rank descending, then codepoint axis id,
 *      then virtue before vice (the L7 idiom over authored positions).
 *   2. SET MEMBERSHIP EVERYWHERE — a malformed token or an off-vocabulary
 *      channel/strength contributes NOTHING rather than being coerced.
 *   3. THE JEALOUS MARKER DERIVES THROUGH THE FLAW REGISTER — the boon-side
 *      axis comes from FLAW_EFFECTS, and only a VICE position on it marks.
 *   4. THE FIELD BANDS AND FLOOR DERIVE FROM THE TUNING SURFACE — thresholds
 *      are computed HERE from FAITH_FIELD_TUNING (a forked constant reds), and
 *      the audibility floor is the substrate's own faithChannelLift zero.
 *   5. HONEST ABSENCE — absent everything answers empty, and no display string
 *      ever carries a numeral.
 */
import { describe, test, expect } from 'vitest';
import {
  characterTop3, boonBaneRows, fieldEffectRows, faithDeepeningOf,
} from '../../../src/domain/display/faithDeepening.js';
import { FAITH_FIELD_TUNING } from '../../../src/domain/worldPulse/faithTuningSurface.js';
import { FLAW_EFFECTS } from '../../../src/domain/worldPulse/deityFlaws.js';

const STRENGTH = /** @type {Record<string, number>} */ (
  /** @type {unknown} */ (FAITH_FIELD_TUNING.STRENGTH));
const SWING = FAITH_FIELD_TUNING.CAUSAL_SWING;

// The boon-side modulation axis, derived from the register exactly as the leaf
// derives it — so this suite and the leaf can only disagree if one of them
// stops reading the register.
const BOON_AXIS = Object.keys(FLAW_EFFECTS).find((a) => FLAW_EFFECTS[a].modulates === 'boon_term');
const WITNESS_AXIS = Object.keys(FLAW_EFFECTS).find((a) => FLAW_EFFECTS[a].modulates === 'witness_pull');

describe('characterTop3 — the pinned total order over authored positions', () => {
  test('level rank descending, then codepoint axis id; the fourth position is dropped', () => {
    const rows = characterTop3({
      characterAxes: [
        'GENEROSITY:virtue:a_touch',
        'MERCY:virtue:marked',
        'TEMPER:vice:defining',
        'CANDOR:vice:marked',
      ],
    });
    expect(rows.map((r) => `${r.axisId}:${r.pole}:${r.level}`)).toEqual([
      'TEMPER:vice:defining',
      'CANDOR:vice:marked',
      'MERCY:virtue:marked',
    ]);
    // The catalog words for those poles, with the level in display words.
    expect(rows[0]).toMatchObject({ word: 'wrathful', levelWord: 'defining' });
    expect(rows[1]).toMatchObject({ word: 'deceitful', levelWord: 'marked' });
    expect(rows[2]).toMatchObject({ word: 'compassionate', levelWord: 'marked' });
  });

  test('a level tie on ONE axis breaks virtue before vice', () => {
    const rows = characterTop3({ characterAxes: ['COURAGE:vice:marked', 'COURAGE:virtue:marked'] });
    expect(rows.map((r) => r.pole)).toEqual(['virtue', 'vice']);
    expect(rows.map((r) => r.word)).toEqual(['brave', 'cowardly']);
  });

  test('the level display word loses its underscore', () => {
    const rows = characterTop3({ characterAxes: 'GENEROSITY:virtue:a_touch' });
    expect(rows).toHaveLength(1);
    expect(rows[0].levelWord).toBe('a touch');
    expect(rows[0].word).toBe('generous');
  });

  test('set membership on every token part — nothing is coerced', () => {
    expect(characterTop3({ characterAxes: [
      'TEMPER:vice',                 // two parts
      'NOPE:vice:marked',            // unknown axis
      'TEMPER:middling:marked',      // pole outside virtue/vice
      'TEMPER:vice:extreme',         // level outside the ladder
      '', 42, null,                  // junk entries
    ] }).length).toBe(0);
    expect(characterTop3({ characterAxes: 42 })).toEqual([]);
    expect(characterTop3({})).toEqual([]);
    expect(characterTop3(null)).toEqual([]);
  });

  test('exact duplicate tokens collapse to one row', () => {
    expect(characterTop3({ characterAxes: ['TEMPER:vice:defining', 'TEMPER:vice:defining'] }))
      .toHaveLength(1);
  });
});

describe('boonBaneRows — band words, and the register-derived jealous marker', () => {
  test('an authored boon and bane render as their band words, boon first', () => {
    const rows = boonBaneRows({
      boonChannel: 'harvest', boonStrength: 'firm',
      baneChannel: 'war_readiness', baneStrength: 'heavy',
    });
    expect(rows).toEqual([
      { kind: 'boon', channel: 'harvest', channelWord: 'harvest', strengthWord: 'firm', flaw: null },
      { kind: 'bane', channel: 'war_readiness', channelWord: 'war readiness', strengthWord: 'heavy', flaw: null },
    ]);
  });

  test('an UNBOUND channel still displays — authored faith is cultural emphasis (D3)', () => {
    const rows = boonBaneRows({ boonChannel: 'sea', boonStrength: 'faint' });
    expect(rows).toEqual([
      { kind: 'boon', channel: 'sea', channelWord: 'sea', strengthWord: 'faint', flaw: null },
    ]);
  });

  test('an off-vocabulary channel or strength contributes NO row', () => {
    expect(boonBaneRows({ boonChannel: 'luck', boonStrength: 'firm' })).toEqual([]);
    expect(boonBaneRows({ boonChannel: 'harvest', boonStrength: 'overwhelming' })).toEqual([]);
    expect(boonBaneRows(null)).toEqual([]);
    expect(boonBaneRows({})).toEqual([]);
  });

  test('a VICE position on the boon-flaw axis marks the boon with the register word', () => {
    const rows = boonBaneRows({
      boonChannel: 'harvest', boonStrength: 'heavy',
      characterAxes: [`${BOON_AXIS}:vice:marked`],
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].flaw).toBe('jealous');
  });

  test('the marker does NOT fire for a virtue pole, the witness-side axis, or the bane', () => {
    // Virtue pole on the modulating axis: no marker.
    expect(boonBaneRows({
      boonChannel: 'harvest', boonStrength: 'firm',
      characterAxes: [`${BOON_AXIS}:virtue:marked`],
    })[0].flaw).toBeNull();
    // The OTHER modulating axis (the witness-pull side) is not the boon's.
    expect(boonBaneRows({
      boonChannel: 'harvest', boonStrength: 'firm',
      characterAxes: [`${WITNESS_AXIS}:vice:defining`],
    })[0].flaw).toBeNull();
    // The bane never carries the marker even when the deity IS jealous —
    // the charter says the BOON weakens.
    const baneOnly = boonBaneRows({
      baneChannel: 'trade', baneStrength: 'firm',
      characterAxes: [`${BOON_AXIS}:vice:defining`],
    });
    expect(baneOnly).toHaveLength(1);
    expect(baneOnly[0].kind).toBe('bane');
    expect(baneOnly[0].flaw).toBeNull();
  });
});

describe('fieldEffectRows — bands and floor DERIVED from the tuning surface', () => {
  test('the band ladder is the STRENGTH table read back as words', () => {
    const rows = fieldEffectRows({ channels: {
      harvest: STRENGTH.heavy,                       // exactly heavy
      trade: (STRENGTH.firm + STRENGTH.heavy) / 2,   // between firm and heavy
      craft: STRENGTH.firm,                          // exactly firm
      healing: (STRENGTH.faint + STRENGTH.firm) / 2, // audible, below firm
    } });
    const bands = Object.fromEntries(rows.map((r) => [r.channel, r.band]));
    expect(bands).toEqual({ harvest: 'heavy', trade: 'firm', craft: 'firm', healing: 'faint' });
  });

  test('the display floor is the substrate audibility — a total the lift rounds away is silent', () => {
    // Derived, not hardcoded: just under and just over half a score point.
    const silent = 0.4 / SWING;   // rounds to zero lift
    const audible = 0.6 / SWING;  // rounds to one point
    expect(Math.round(silent * SWING)).toBe(0);
    expect(Math.round(audible * SWING)).toBe(1);
    expect(fieldEffectRows({ channels: { harvest: silent } })).toEqual([]);
    const rows = fieldEffectRows({ channels: { harvest: audible } });
    expect(rows).toHaveLength(1);
    expect(rows[0].band).toBe('faint');
  });

  test('sign is direction: negative totals read as burdened', () => {
    const rows = fieldEffectRows({ channels: { trade: -STRENGTH.firm, harvest: STRENGTH.firm } });
    expect(rows.map((r) => [r.channel, r.direction])).toEqual([
      ['harvest', 'blessed'],
      ['trade', 'burdened'],
    ]);
  });

  test('rows come codepoint-ordered by channel', () => {
    const rows = fieldEffectRows({ channels: { trade: 0.2, craft: 0.2, order: 0.2 } });
    expect(rows.map((r) => r.channel)).toEqual(['craft', 'order', 'trade']);
  });

  test('unknown and unbound channels in a record are skipped, never invented', () => {
    expect(fieldEffectRows({ channels: { luck: 0.5 } })).toEqual([]);
    // `sea` is a real channel word but names no causal variable, so the lift is
    // zero and the display refuses to claim an effect the world cannot feel.
    expect(fieldEffectRows({ channels: { sea: 0.5 } })).toEqual([]);
  });

  test('honest absence — no record, no channels, no rows', () => {
    expect(fieldEffectRows(null)).toEqual([]);
    expect(fieldEffectRows({})).toEqual([]);
    expect(fieldEffectRows({ channels: null })).toEqual([]);
  });

  test('war_readiness displays without its underscore', () => {
    const rows = fieldEffectRows({ channels: { war_readiness: STRENGTH.heavy } });
    expect(rows[0].channelWord).toBe('war readiness');
  });
});

describe('faithDeepeningOf — the per-settlement join', () => {
  const PATRON = Object.freeze({
    name: 'Sunlord Aurelian',
    characterAxes: ['TEMPER:vice:defining'],
    boonChannel: 'harvest', boonStrength: 'firm',
  });
  const CULT = Object.freeze({
    name: 'The Quiet Tide',
    baneChannel: 'trade', baneStrength: 'faint',
  });

  test('patron and cults enroll by name; a deity with nothing authored has no entry', () => {
    const model = faithDeepeningOf({
      patron: PATRON,
      cults: [CULT, { name: 'The Unwritten' }],
      field: { channels: { harvest: 0.2 } },
    });
    expect(Object.keys(model.byName).sort()).toEqual(['Sunlord Aurelian', 'The Quiet Tide']);
    expect(model.byName['Sunlord Aurelian'].top3).toHaveLength(1);
    expect(model.byName['Sunlord Aurelian'].gifts[0].kind).toBe('boon');
    expect(model.byName['The Quiet Tide'].gifts[0].kind).toBe('bane');
    expect(model.fieldRows).toHaveLength(1);
  });

  test('the patron wins a name collision', () => {
    const model = faithDeepeningOf({
      patron: PATRON,
      cults: [{ name: 'Sunlord Aurelian', baneChannel: 'trade', baneStrength: 'heavy' }],
    });
    expect(model.byName['Sunlord Aurelian'].gifts[0].kind).toBe('boon');
  });

  test('honest absence — empty in, empty out', () => {
    expect(faithDeepeningOf({})).toEqual({ byName: {}, fieldRows: [] });
    expect(faithDeepeningOf()).toEqual({ byName: {}, fieldRows: [] });
    expect(faithDeepeningOf({ patron: { name: '' }, cults: [null], field: null }))
      .toEqual({ byName: {}, fieldRows: [] });
  });

  test('NO NUMERAL ever reaches a display string', () => {
    const model = faithDeepeningOf({
      patron: { ...PATRON, characterAxes: ['TEMPER:vice:defining', 'GENEROSITY:virtue:a_touch', 'CONTENT:vice:marked'] },
      cults: [CULT],
      field: { channels: { harvest: 0.2, trade: -0.06, war_readiness: 0.3 } },
    });
    const strings = [];
    for (const depth of Object.values(model.byName)) {
      for (const r of depth.top3) strings.push(r.word, r.levelWord);
      for (const g of depth.gifts) strings.push(g.channelWord, g.strengthWord, g.flaw ?? '');
    }
    for (const r of model.fieldRows) strings.push(r.channelWord, r.direction, r.band);
    expect(strings.length).toBeGreaterThan(0);   // anchored: the fixture above authors rows
    for (const s of strings) expect(s).not.toMatch(/\d/);
  });
});
