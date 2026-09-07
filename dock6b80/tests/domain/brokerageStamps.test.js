/**
 * brokerageStamps.test.js — [W-I INFORMATION BROKERAGES] I2, the reliability ladder's unit
 * contract (docs/DESIGN_INFORMATION_BROKERAGES.md §5).
 *
 * The calibration-honesty ENVELOPE lives next door (brokerageCalibration.test.js) and is
 * the theorem. This file pins the machinery the theorem rests on, and in particular the
 * three properties whose loss would make the envelope pass while lying:
 *
 *   1. THE GRADE IS EARNED. It moves with the telling's real provenance and with nothing
 *      else; there is no rng and no constant.
 *   2. COMPETENCE ONLY EVER QUIETENS. A house may decline a channel or refuse the top rung;
 *      no arrangement of houses can LIFT a rung. That direction is what makes "every rung
 *      is true at or above its band" survivable under capping.
 *   3. THE GATE IS THE CANONICAL ONE. brokerageEffectsActive duplicates the reading of
 *      beliefsActive plus infoStatecraftEnabled so a Herald read model need not import the
 *      belief engine. The duplicate is held equal to the originals over a totality table
 *      below, so it cannot drift into a second, laxer gate.
 */
import { describe, expect, it } from 'vitest';

import {
  BROKERAGE_STAMP_TUNING,
  HERALD_SECTION_CHANNEL,
  RELIABILITY_LADDER,
  RELIABILITY_TRUTH_BANDS,
  brokerageEffectsActive,
  brokerageHousesOf,
  heraldChannelOf,
  heraldItemReliability,
  houseChannelCompetence,
  newsReliabilityStamp,
  reliabilityBandOf,
  reliabilityRungOf,
  rungOfHopCount,
} from '../../src/domain/worldPulse/brokerageStamps.js';
import { INFORMATION_CHANNELS, brokerageChannelCompetence } from '../../src/data/informationBrokerageTuning.js';
import { HERALD_SECTIONS } from '../../src/domain/realm/heraldRouting.js';
import { beliefsActive } from '../../src/domain/worldPulse/beliefMap.js';
import { infoStatecraftActive } from '../../src/domain/worldPulse/informationStatecraft.js';
import { getSpatialLedger } from '../../src/domain/spatial/distanceRead.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

// ── Fixtures ────────────────────────────────────────────────────────────────

const POST = Object.freeze({
  name: 'Listening post', tags: ['legal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query'],
});
const EXCHANGE = Object.freeze({
  name: "Chroniclers' exchange", tags: ['legal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed'],
});
const ROOKERY = Object.freeze({
  name: 'Rookery', tags: ['criminal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query'],
});
const MARKET = Object.freeze({
  name: 'Whisper market', tags: ['criminal', 'information', 'brokerage'],
  serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'],
});
const SMITH = Object.freeze({ name: 'Blacksmith', tags: ['crafts'] });
const INN = Object.freeze({ name: 'Wayside inn', tags: ['hospitality'] });

const LEGAL_MAJOR = Object.freeze([{ legality: 'legal', form: 'major' }]);

// ── The closed ladder ───────────────────────────────────────────────────────

describe('[W-I I2] the reliability ladder is a closed, ordered, banded vocabulary', () => {
  it('is four rungs best-first, and every rung declares a truth band', () => {
    expect(RELIABILITY_LADDER).toEqual(['confirmed', 'corroborated', 'reported', 'tavern_talk']);
    expect(Object.keys(RELIABILITY_TRUTH_BANDS).sort()).toEqual([...RELIABILITY_LADDER].sort());
    // The bands must DESCEND with the ladder, or "a better grade promises more" is false
    // and the envelope's monotonicity claim would be checking nothing.
    const bands = RELIABILITY_LADDER.map(reliabilityBandOf);
    for (let i = 1; i < bands.length; i += 1) expect(bands[i]).toBeLessThan(bands[i - 1]);
    expect(bands[0]).toBeLessThanOrEqual(1);
  });

  it('fails closed on anything that is not a rung', () => {
    expect(reliabilityRungOf('gospel')).toBe(-1);
    expect(reliabilityRungOf(null)).toBe(-1);
    expect(reliabilityBandOf('gospel')).toBe(0);
    // A prototype key must not answer as a grade (the hasOwnProperty read).
    expect(reliabilityBandOf('toString')).toBe(0);
  });
});

// ── The grade is EARNED (provenance, never a constant) ──────────────────────

describe('[W-I I2] the grade is a derivation of real provenance', () => {
  it('descends monotonically with relay hops and never leaves the ladder', () => {
    const rungs = [0, 1, 2, 3, 4, 5, 9, 40].map(rungOfHopCount);
    for (let i = 1; i < rungs.length; i += 1) expect(rungs[i]).toBeGreaterThanOrEqual(rungs[i - 1]);
    expect(rungs[0]).toBe(0);
    expect(rungs[rungs.length - 1]).toBe(RELIABILITY_LADDER.length - 1);
  });

  it('fails closed to the bottom rung on an absent or unreadable hop count', () => {
    for (const bad of [undefined, null, NaN, 'three', {}, -1]) {
      expect(rungOfHopCount(bad)).toBe(bad === -1 ? 0 : RELIABILITY_LADDER.length - 1);
    }
  });

  it('is NOT a constant: the same house grades two tellings differently', () => {
    const near = newsReliabilityStamp({ houses: LEGAL_MAJOR, channel: 'trade', provenance: { hopCount: 0 } });
    const far = newsReliabilityStamp({ houses: LEGAL_MAJOR, channel: 'trade', provenance: { hopCount: 6 } });
    expect(near?.grade).toBe('confirmed');
    expect(far?.grade).toBe('tavern_talk');
  });

  it('a discredited source costs a rung, and the demotion can never leave the ladder', () => {
    const T = BROKERAGE_STAMP_TUNING;
    const trusted = newsReliabilityStamp({
      houses: LEGAL_MAJOR, channel: 'trade', provenance: { hopCount: 0, credibility01: 1 },
    });
    const liar = newsReliabilityStamp({
      houses: LEGAL_MAJOR, channel: 'trade', provenance: { hopCount: 0, credibility01: T.DEMOTING_CREDIBILITY - 0.01 },
    });
    expect(trusted?.grade).toBe('confirmed');
    expect(liar?.grade).toBe('corroborated');
    const bottomLiar = newsReliabilityStamp({
      houses: LEGAL_MAJOR, channel: 'trade', provenance: { hopCount: 20, credibility01: 0 },
    });
    expect(RELIABILITY_LADDER).toContain(bottomLiar?.grade);
  });
});

// ── Competence only ever quietens (the envelope's structural guarantee) ─────

describe('[W-I I2] competence can only make a house quieter', () => {
  it('below the vouch floor the house declines the channel outright', () => {
    // The Rookery reads the underworld and not the granary. Anchored by the SAME house on
    // the channel it does master, so a house that stopped reading anything reds here.
    const houses = brokerageHousesOf([ROOKERY]);
    expect(newsReliabilityStamp({ houses, channel: 'crime', provenance: { hopCount: 0 } })).not.toBeNull();
    expect(houseChannelCompetence(houses, 'faith')).toBeLessThan(BROKERAGE_STAMP_TUNING.CHANNEL_VOUCH_FLOOR);
    expect(newsReliabilityStamp({ houses, channel: 'faith', provenance: { hopCount: 0 } })).toBeNull();
  });

  it('below the sharp floor the house cannot award the top rung, whatever the provenance', () => {
    const failures = collectSeedFailures(INFORMATION_CHANNELS, (channel) => {
      for (const house of [[POST], [EXCHANGE], [ROOKERY], [MARKET]]) {
        const houses = brokerageHousesOf(house);
        const competence = houseChannelCompetence(houses, channel);
        const stamp = newsReliabilityStamp({ houses, channel, provenance: { hopCount: 0 } });
        if (competence < BROKERAGE_STAMP_TUNING.CHANNEL_VOUCH_FLOOR) {
          expect(stamp, `${house[0].name}/${channel} vouched below its floor`).toBeNull();
        } else if (competence < BROKERAGE_STAMP_TUNING.SHARP_VOUCH_FLOOR) {
          expect(stamp?.grade, `${house[0].name}/${channel} claimed the top rung`).not.toBe('confirmed');
        } else {
          expect(stamp?.grade, `${house[0].name}/${channel} refused a firsthand telling`).toBe('confirmed');
        }
      }
    });
    expectNoSeedFailures(failures, 'every house grades every channel within its competence');
  });

  it('adding a house NEVER raises a rung above what the provenance earned', () => {
    // The load-bearing direction. Sweep every hop depth and every roster combination: the
    // graded rung must be at or below (numerically at or after) the hop-derived rung.
    const rosters = [[POST], [EXCHANGE], [ROOKERY], [MARKET], [POST, MARKET], [EXCHANGE, ROOKERY], [EXCHANGE, MARKET]];
    const cases = rosters.flatMap((roster) => [0, 1, 2, 3, 4, 7].flatMap(
      (hopCount) => INFORMATION_CHANNELS.map((channel) => ({ roster, hopCount, channel })),
    ));
    const failures = collectSeedFailures(cases, ({ roster, hopCount, channel }) => {
      const stamp = newsReliabilityStamp({
        houses: brokerageHousesOf(roster), channel, provenance: { hopCount },
      });
      if (!stamp) return;
      expect(
        reliabilityRungOf(stamp.grade),
        `${roster.map((r) => r.name).join('+')}/${channel}/hop${hopCount} was LIFTED above its provenance`,
      ).toBeGreaterThanOrEqual(rungOfHopCount(hopCount));
    });
    expectNoSeedFailures(failures, 'no roster lifts a rung above the provenance that earned it');
  });
});

// ── The presence gate (service keys, never names) ───────────────────────────

describe('[W-I I2] the presence gate reads declared capability, never a name', () => {
  it('finds the houses on a roster and nothing else', () => {
    const houses = brokerageHousesOf([SMITH, EXCHANGE, INN, MARKET]);
    expect(houses).toEqual([
      { legality: 'illegal', form: 'major' },
      { legality: 'legal', form: 'major' },
    ]);
    expect(brokerageHousesOf([SMITH, INN])).toEqual([]);
    expect(brokerageHousesOf(null)).toEqual([]);
  });

  it('a custom institution declaring the closed keys counts exactly as a native one', () => {
    const custom = { name: 'The Quiet Table', tags: ['criminal', 'information', 'brokerage'], serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'] };
    expect(brokerageHousesOf([custom])).toEqual(brokerageHousesOf([MARKET]));
  });

  it('an institution that merely LOOKS informational is not a house', () => {
    const impostor = { name: 'Whisper market', tags: ['criminal', 'information'], serviceKeys: [] };
    const roster = brokerageHousesOf([impostor, EXCHANGE]).map((h) => `${h.legality}:${h.form}`);
    expectAbsentWithAnchor(roster, 'illegal:major', 'legal:major', 'a name without keys is not a house');
  });

  it('a RUINED house is not a standing house (the ruin filter, coherence audit R3)', () => {
    // A calamity-flattened, abandoned or economically-closed brokerage keeps SITTING in the
    // roster, and crediting it would let a burnt-out register grade the realm's news — the
    // same reasoning K1 recorded for hasPrison (a flattened gaol holds no prisoner). Every
    // inactivation spelling is swept; the LIVE row is the anchor, so a gate that stopped
    // finding anything at all cannot pass this vacuously.
    expect(brokerageHousesOf([EXCHANGE])).toEqual([{ legality: 'legal', form: 'major' }]);
    const inactivations = [
      { _worldPulseInactive: true },
      { status: 'ruined' }, { status: 'removed' }, { status: 'destroyed' }, { status: 'remnant' },
    ];
    const failures = collectSeedFailures(inactivations, (mark) => {
      const ruined = { ...EXCHANGE, ...mark };
      expect(brokerageHousesOf([ruined]), JSON.stringify(mark)).toEqual([]);
      expect(houseChannelCompetence(brokerageHousesOf([ruined]), 'war'), JSON.stringify(mark)).toBe(0);
      // The ruin cannot stamp, while the live house on the same roster still can.
      expect(newsReliabilityStamp({
        houses: brokerageHousesOf([ruined]), channel: 'war', provenance: { hopCount: 0 },
      }), JSON.stringify(mark)).toBeNull();
      expect(brokerageHousesOf([ruined, EXCHANGE])).toEqual([{ legality: 'legal', form: 'major' }]);
    });
    expectNoSeedFailures(failures, 'no inactivation spelling leaves a house standing');
    // IMPAIRED IS NOT INACTIVE: a corrupt house still trades, corruptly (the accessor's
    // own rule, restated here so a future "tighten the filter" edit reds instead of
    // silently silencing every compromised broker in the realm).
    expect(brokerageHousesOf([{ ...EXCHANGE, status: 'impaired' }]))
      .toEqual([{ legality: 'legal', form: 'major' }]);
  });

  it('the best house in a channel wins, and the competence never exceeds the authored ceiling', () => {
    const failures = collectSeedFailures(INFORMATION_CHANNELS, (channel) => {
      const both = houseChannelCompetence(brokerageHousesOf([EXCHANGE, MARKET]), channel);
      const legal = brokerageChannelCompetence('legal', 'major', channel);
      const illegal = brokerageChannelCompetence('illegal', 'major', channel);
      expect(both, channel).toBe(Math.max(legal, illegal));
    });
    expectNoSeedFailures(failures, 'the sharpest standing house sets the channel competence');
    expect(houseChannelCompetence(brokerageHousesOf([EXCHANGE]), 'not_a_channel')).toBe(0);
  });
});

// ── The section-to-channel join is total against the Herald's own vocabulary ─

describe('[W-I I2] the section-to-channel map is total against HERALD_SECTIONS', () => {
  it('covers every Herald section, and invents none', () => {
    // Both directions. The map is a local copy kept out of heraldRouting.js so the leaf
    // stays light; this is what stops the copy from rotting when a door is added.
    for (const section of HERALD_SECTIONS) {
      expect(Object.keys(HERALD_SECTION_CHANNEL), `section ${section} has no channel`).toContain(section);
      expect(INFORMATION_CHANNELS).toContain(HERALD_SECTION_CHANNEL[section]);
    }
    for (const [section, channel] of Object.entries(HERALD_SECTION_CHANNEL)) {
      expect(INFORMATION_CHANNELS, `${section} maps outside the channel vocabulary`).toContain(channel);
    }
  });

  it('a named person overrides the door, and an unreadable section yields no channel', () => {
    expect(heraldChannelOf('trade', ['settlement', 'npc'])).toBe('persons');
    expect(heraldChannelOf('trade', ['settlement'])).toBe('trade');
    expect(heraldChannelOf('trade', [])).toBe('trade');
    expect(heraldChannelOf('gossip', [])).toBeNull();
    expect(heraldChannelOf('constructor', [])).toBeNull();
  });
});

// ── The gate parity (the duplicated reading cannot drift) ───────────────────

describe('[W-I I2] the local gate equals the canonical predicates, case for case', () => {
  const MARKERS = [undefined, 0, -1, '1', 1, 3];
  const MODES = [undefined, 'omniscient', 'perfect_delayed', 'delayed', 'unreliable', 'full', 'nonsense'];
  const FLAGS = [
    {},
    { infoStatecraftEnabled: true },
    { informationBrokeragesEnabled: true },
    { infoStatecraftEnabled: true, informationBrokeragesEnabled: true },
    { infoStatecraftEnabled: true, informationBrokeragesEnabled: 'true' },
  ];

  it('is exactly infoStatecraftActive AND the virtual brokerage flag, over the whole table', () => {
    const rows = MARKERS.flatMap((marker) => MODES.flatMap((infoMode) => FLAGS.map((flags) => ({
      spatialCanonVersion: marker,
      simulationRules: { infoMode, ...flags },
    }))));
    let lit = 0;
    const failures = collectSeedFailures(rows, (worldState) => {
      const canonical = infoStatecraftActive(worldState)
        && worldState.simulationRules.informationBrokeragesEnabled === true;
      const local = brokerageEffectsActive(worldState);
      if (canonical) lit += 1;
      expect(local, JSON.stringify(worldState)).toBe(canonical);
      // The statecraft predicate is itself beliefsActive plus a flag; assert the chain so a
      // change to EITHER upstream predicate reds here rather than silently widening us.
      if (local) expect(beliefsActive(worldState)).toBe(true);
    });
    expectNoSeedFailures(failures, 'the local brokerage gate matches the canonical conjunction');
    // NON-VACUITY: a table on which nothing is ever lit would pass the equality trivially.
    expect(lit, 'the parity table never lit the gate').toBeGreaterThan(0);
    expect(lit, 'the parity table lit the gate everywhere').toBeLessThan(rows.length);
  });

  it('is false on garbage input rather than throwing', () => {
    for (const bad of [null, undefined, 'world', 42, []]) expect(brokerageEffectsActive(bad)).toBe(false);
  });
});

// ── The Herald seam ─────────────────────────────────────────────────────────

const LIT_RULES = Object.freeze({ infoMode: 'unreliable', infoStatecraftEnabled: true, informationBrokeragesEnabled: true });

/** A world whose settlement `sid` holds one telling of `ref` at `hopCount`. */
function worldWith({ sid = 'a', ref = 'evt1', hopCount = 0, roots = 1, rules = LIT_RULES } = {}) {
  return {
    spatialCanonVersion: 1,
    simulationRules: { ...rules },
    spatialLedgers: {
      rumorLedgers: {
        [sid]: {
          [`trade:${ref}`]: {
            eventRef: ref, hopCount, corroborationRoots: Array.from({ length: roots }, (_, i) => `t0:${ref}@w${i}`),
          },
        },
      },
    },
  };
}

const settlementsWith = (roster) => new Map([['a', { id: 'a', institutions: roster }]]);
const SUBJECT_A = [{ kind: 'settlement', id: 'a' }];
const SOURCE = { id: 'wizard_news.5.applied.evt1', sourceEventId: 'evt1' };

describe('[W-I I2] the Herald seam stamps only where a house stands and a telling arrived', () => {
  it('stamps an item in a brokerage settlement, naming the grader', () => {
    const stamp = heraldItemReliability({
      worldState: worldWith({}), settlements: settlementsWith([EXCHANGE]),
      section: 'trade', subjects: SUBJECT_A, source: SOURCE,
    });
    expect(stamp?.grade).toBe('confirmed');
    expect(stamp?.graderId).toBe('a');
    expect(stamp?.channel).toBe('trade');
  });

  it('emits NOTHING where no house stands, and nothing when the telling never arrived', () => {
    // The anchor for both negatives is the SAME call with the house restored: an empty
    // result would otherwise be indistinguishable from a seam that stopped working.
    const anchored = heraldItemReliability({
      worldState: worldWith({}), settlements: settlementsWith([EXCHANGE]),
      section: 'trade', subjects: SUBJECT_A, source: SOURCE,
    });
    expect(anchored, 'the positive control must stamp').not.toBeNull();
    expect(heraldItemReliability({
      worldState: worldWith({}), settlements: settlementsWith([SMITH, INN]),
      section: 'trade', subjects: SUBJECT_A, source: SOURCE,
    })).toBeNull();
    expect(heraldItemReliability({
      worldState: worldWith({ ref: 'other' }), settlements: settlementsWith([EXCHANGE]),
      section: 'trade', subjects: SUBJECT_A, source: SOURCE,
    })).toBeNull();
  });

  it('emits nothing while the virtual flag is dark, however many houses stand', () => {
    const dark = worldWith({ rules: { infoMode: 'unreliable', infoStatecraftEnabled: true } });
    expect(heraldItemReliability({
      worldState: dark, settlements: settlementsWith([EXCHANGE, MARKET]),
      section: 'trade', subjects: SUBJECT_A, source: SOURCE,
    })).toBeNull();
  });

  it('takes the SHARPEST telling when several carriers brought the same event', () => {
    const world = worldWith({});
    world.spatialLedgers.rumorLedgers.a['army:evt1'] = { eventRef: 'evt1', hopCount: 4, corroborationRoots: ['t0:evt1@z'] };
    world.spatialLedgers.rumorLedgers.a['trade:evt1'].hopCount = 2;
    const stamp = heraldItemReliability({
      worldState: world, settlements: settlementsWith([EXCHANGE]),
      section: 'trade', subjects: SUBJECT_A, source: SOURCE,
    });
    expect(stamp?.grade).toBe('reported');
  });

  it('reads the rumour ledgers exactly as getSpatialLedger does, over a tolerance table', () => {
    // The leaf reads worldState.spatialLedgers.rumorLedgers inline rather than importing
    // the 53 kB frozen-digest reader into the Herald chunk. This is what stops the copy
    // from becoming a second, laxer reading.
    const rows = [
      null, undefined, 42, [], {},
      { spatialLedgers: null }, { spatialLedgers: [] }, { spatialLedgers: {} },
      { spatialLedgers: { rumorLedgers: null } }, { spatialLedgers: { rumorLedgers: [] } },
      { spatialLedgers: { rumorLedgers: { a: { 'trade:e': { eventRef: 'e' } } } } },
    ];
    let present = 0;
    const failures = collectSeedFailures(rows, (worldState) => {
      const canonical = getSpatialLedger(worldState, 'rumorLedgers');
      const usable = canonical != null && typeof canonical === 'object' && !Array.isArray(canonical);
      if (usable && Object.keys(canonical).length > 0) present += 1;
      const stamped = heraldItemReliability({
        worldState: { spatialCanonVersion: 1, simulationRules: { ...LIT_RULES }, ...(worldState || {}) },
        settlements: settlementsWith([EXCHANGE]),
        section: 'trade',
        subjects: [{ kind: 'settlement', id: 'a' }],
        source: { id: 'e' },
      });
      expect(stamped !== null, JSON.stringify(worldState)).toBe(usable && !!(canonical && canonical.a));
    });
    expectNoSeedFailures(failures, 'the inline ledger read matches getSpatialLedger');
    expect(present, 'the tolerance table never carried a real ledger').toBeGreaterThan(0);
  });
});

// ── The prose (legibility law: prose, never numbers) ────────────────────────

describe('[W-I I2] the stamp speaks in prose and never in numbers', () => {
  it('carries a glance label and a sentence, with no digits in either', () => {
    const rosters = [[POST], [EXCHANGE], [ROOKERY], [MARKET]];
    const cases = rosters.flatMap((roster) => [0, 1, 2, 3, 5].flatMap(
      (hopCount) => [1, 2, 3, 5].map((roots) => ({ roster, hopCount, roots })),
    ));
    const failures = collectSeedFailures(cases, ({ roster, hopCount, roots }) => {
      for (const channel of INFORMATION_CHANNELS) {
        const stamp = newsReliabilityStamp({
          houses: brokerageHousesOf(roster), channel, provenance: { hopCount, independentSources: roots },
        });
        if (!stamp) continue;
        expect(stamp.label, `${channel} label`).not.toMatch(/[0-9]/); // anchored: the label is asserted non-empty on the next line
        expect(stamp.label.length).toBeGreaterThan(0);
        expect(stamp.detail, `${channel} detail`).not.toMatch(/[0-9]/); // anchored: the detail is asserted non-empty on the next line
        expect(stamp.detail.length).toBeGreaterThan(20);
      }
    });
    expectNoSeedFailures(failures, 'every stamp reads as prose');
  });

  it('the SOURCE sentence tracks the road even when the house grades itself down', () => {
    // The honesty split. A guildless house reading a firsthand telling must not be made to
    // say the tale came from one road away just because it graded the tale cautiously.
    const capped = newsReliabilityStamp({
      houses: brokerageHousesOf([EXCHANGE]), channel: 'faith', provenance: { hopCount: 0 },
    });
    const uncapped = newsReliabilityStamp({
      houses: brokerageHousesOf([EXCHANGE]), channel: 'trade', provenance: { hopCount: 0 },
    });
    expect(capped?.grade).toBe('corroborated');
    expect(uncapped?.grade).toBe('confirmed');
    expect(capped?.detail).toContain('its own ears');
    expect(uncapped?.detail).toContain('its own ears');
  });

  it('reports other roads only when other roads carried it', () => {
    const alone = newsReliabilityStamp({ houses: LEGAL_MAJOR, channel: 'trade', provenance: { hopCount: 2, independentSources: 1 } });
    const twice = newsReliabilityStamp({ houses: LEGAL_MAJOR, channel: 'trade', provenance: { hopCount: 2, independentSources: 2 } });
    const many = newsReliabilityStamp({ houses: LEGAL_MAJOR, channel: 'trade', provenance: { hopCount: 2, independentSources: 4 } });
    expectAbsentWithAnchor(String(alone?.detail).split('. '), 'It came in again on another road', 'The house passes this on as it came', 'a single road claimed company');
    expect(twice?.detail).toContain('another road');
    expect(many?.detail).toContain('other roads');
    // Corroboration changes the SENTENCE and never the grade (the measurement in the leaf
    // header: independent roots do not predict truth under the current merge rule).
    expect(twice?.grade).toBe(alone?.grade);
    expect(many?.grade).toBe(alone?.grade);
  });
});
