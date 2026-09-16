/**
 * informationBrokerageCatalog.test.js — [W-I INFORMATION BROKERAGES] I1, the catalog +
 * vocabulary half (docs/DESIGN_INFORMATION_BROKERAGES.md §0b, §3, §4).
 *
 * I1 ships INERT DATA: four catalog entries, their closed capability keys, the authored
 * channel-competence table, and the rumour-source service tag over the existing talk
 * houses. Nothing in the engine consumes any of it yet, which is precisely why the data
 * needs pinning now: a vocabulary with no consumer rots silently, and the slices that
 * light the effects will trust whatever they find here.
 *
 * WHAT THESE PINS LOCK.
 *   - the four entries sit at their design tier bands and NOWHERE below them;
 *   - their ids are the design's ids, and their tags are governed;
 *   - capability is SERVICE-KEY-DRIVEN, never name-driven: a nameless synthetic
 *     institution declaring the same closed keys resolves to the same form and legality
 *     as the native entry (design §3's custom-content clause, made falsifiable);
 *   - `info_plant` exists on EXACTLY one entry, so "illegal major only" is a property of
 *     the data rather than of a downstream branch someone has to remember to write;
 *   - the tuning table obeys its three structural laws (the legal/illegal inversion, the
 *     minor-to-major growth, and constitutional Law 1's fidelity ceiling) even as the
 *     PROPOSED digits move;
 *   - the rumour-source tag names only REAL catalog institutions, uses every lane it
 *     declares, and never names a brokerage (design §0b: the two roles are distinct).
 *
 * The generation-side pins (tier reachability over a seed family, subsumption through the
 * real pass, the route gate) live in tests/generators/informationBrokerageGeneration.test.js.
 */
import { describe, expect, it } from 'vitest';

import { institutionalCatalog, catalogIdForName } from '../../src/data/institutionalCatalog.js';
import { INSTITUTION_SERVICES } from '../../src/data/institutionServices.js';
import { SUBSUMPTION_RULES, institutionLadderEvicts } from '../../src/data/institutionLadders.js';
import { TAG } from '../../src/data/entityTags.js';
import { INSTITUTION_IDENTITY } from '../../src/domain/display/institutionVocabulary.js';
import { factionArchetype } from '../../src/domain/factionArchetypes.js';
import {
  INFORMATION_CHANNELS,
  BROKERAGE_SERVICE_KEYS,
  BROKERAGE_LEGALITIES,
  BROKERAGE_FORMS,
  INFORMATION_BROKERAGE_TUNING,
  RUMOR_SOURCE_LANES,
  RUMOR_SOURCE_INSTITUTIONS,
  brokerageChannelCompetence,
  brokerageServiceKeys,
  isInformationBrokerage,
  brokerageFormOf,
  brokerageLegalityOf,
  rumorSourceLaneOf,
  rumorSourceCensus,
  brokeragePowerPreconditionMet,
} from '../../src/data/informationBrokerageTuning.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const LISTENING_POST = 'Listening post';
const EXCHANGE = "Chroniclers' exchange";
const ROOKERY = 'Rookery';
const WHISPER_MARKET = 'Whisper market';

/** The design's four, with the band each is authored to occupy (§3). */
const BROKERAGES = Object.freeze([
  { name: LISTENING_POST, category: 'Economy', legality: 'legal', form: 'minor', tiers: ['town', 'city'], id: 'listening_post' },
  { name: EXCHANGE, category: 'Economy', legality: 'legal', form: 'major', tiers: ['city'], id: 'chroniclers_exchange' },
  { name: ROOKERY, category: 'Criminal', legality: 'illegal', form: 'minor', tiers: ['town', 'city'], id: 'rookery' },
  { name: WHISPER_MARKET, category: 'Criminal', legality: 'illegal', form: 'major', tiers: ['city'], id: 'whisper_market' },
]);

/** Tiers below the whole family's band. No brokerage may appear at any of them. */
const BELOW_BAND_TIERS = Object.freeze(['thorp', 'hamlet', 'village']);

/** Every institution name declared at a tier. Derived, never a literal. */
function namesAt(tier) {
  const out = [];
  for (const group of Object.values(institutionalCatalog[tier] || {})) {
    for (const name of Object.keys(group)) out.push(name);
  }
  return out;
}

/** Every institution name in the whole catalog. */
const ALL_CATALOG_NAMES = new Set(
  Object.keys(institutionalCatalog).flatMap((tier) => namesAt(tier)),
);

const entryAt = (tier, category, name) => institutionalCatalog[tier]?.[category]?.[name];

describe('[W-I I1] the four brokerage catalog entries', () => {
  it('each sits at every tier of its design band', () => {
    for (const brokerage of BROKERAGES) {
      for (const tier of brokerage.tiers) {
        expect(
          entryAt(tier, brokerage.category, brokerage.name),
          `${brokerage.name} missing from ${tier}.${brokerage.category}`,
        ).toBeTruthy();
      }
    }
  });

  it('the metropolis catalog inherits the city forms through the existing merge', () => {
    // mergeCatalogs(city, metropolis) is how assembleInstitutions builds the top tier, so
    // a city entry reaches metropolis without a duplicated definition. Pin the source of
    // that inheritance rather than the merge itself (which metropolisCatalogReachable owns).
    for (const brokerage of BROKERAGES) {
      expect(
        entryAt('city', brokerage.category, brokerage.name),
        `${brokerage.name} must be defined at city for metropolis to inherit it`,
      ).toBeTruthy();
    }
  });

  it('none of the four is declared below its band (anchored per tier)', () => {
    for (const tier of BELOW_BAND_TIERS) {
      const names = namesAt(tier);
      // The anchor is drawn FROM the tier being searched, so a tier that lost its whole
      // catalog reds on the anchor rather than passing the exclusion vacuously.
      const anchor = names[0];
      for (const brokerage of BROKERAGES) {
        expectAbsentWithAnchor(names, brokerage.name, anchor, `${brokerage.name} at ${tier}`);
      }
    }
  });

  it('resolves the design ids, and the id index is collision-free', () => {
    for (const brokerage of BROKERAGES) {
      expect(catalogIdForName(brokerage.name), brokerage.name).toBe(brokerage.id);
    }
    // buildCatalogIdIndex throws at module load on a slug collision, so a successful
    // import is the collision proof; this keeps the claim visible.
    expect(new Set(BROKERAGES.map((b) => b.id)).size).toBe(BROKERAGES.length);
  });

  it('carries governed tags and the house priority categories', () => {
    for (const brokerage of BROKERAGES) {
      for (const tier of brokerage.tiers) {
        const entry = entryAt(tier, brokerage.category, brokerage.name);
        expect(entry.tags, `${brokerage.name}@${tier}`).toContain(TAG.INFORMATION);
        expect(entry.tags, `${brokerage.name}@${tier}`).toContain(TAG.BROKERAGE);
        expect(entry.tags, `${brokerage.name}@${tier}`).toContain(
          brokerage.legality === 'illegal' ? TAG.CRIMINAL : TAG.LEGAL,
        );
        expect(entry.priorityCategory, `${brokerage.name}@${tier}`).toBe(
          brokerage.legality === 'illegal' ? 'criminal' : 'economy',
        );
      }
    }
  });

  it('the legal pair is route-gated (information follows roads); the illegal pair is not', () => {
    for (const tier of ['town', 'city']) {
      expect(entryAt(tier, 'Economy', LISTENING_POST).forbiddenTradeRoutes)
        .toEqual(expect.arrayContaining(['isolated', 'none']));
    }
    expect(entryAt('city', 'Economy', EXCHANGE).forbiddenTradeRoutes)
      .toEqual(expect.arrayContaining(['isolated', 'none']));
    // A covert house does not need a road to exist; its precondition is a criminal power.
    expect(entryAt('town', 'Criminal', ROOKERY).forbiddenTradeRoutes).toBeUndefined();
    expect(entryAt('city', 'Criminal', WHISPER_MARKET).forbiddenTradeRoutes).toBeUndefined();
  });

  it('every entry carries a service menu and an authored identity one-liner', () => {
    for (const brokerage of BROKERAGES) {
      const menu = INSTITUTION_SERVICES[brokerage.name];
      expect(menu, `${brokerage.name} has no service menu`).toBeTruthy();
      expect(Object.keys(menu).length, brokerage.name).toBeGreaterThanOrEqual(3);
      const identity = INSTITUTION_IDENTITY[brokerage.name];
      expect(typeof identity, brokerage.name).toBe('string');
      expect(identity.length, brokerage.name).toBeGreaterThan(20);
    }
  });
});

describe('[W-I I1] capability is service-key-driven, never name-driven', () => {
  it('every declared key is inside the closed set', () => {
    for (const brokerage of BROKERAGES) {
      for (const tier of brokerage.tiers) {
        const entry = entryAt(tier, brokerage.category, brokerage.name);
        expect(Array.isArray(entry.serviceKeys), `${brokerage.name}@${tier}`).toBe(true);
        for (const key of entry.serviceKeys) {
          expect(BROKERAGE_SERVICE_KEYS, `${brokerage.name}@${tier}`).toContain(key);
        }
      }
    }
  });

  it('calibration and query are universal; feed marks the major form', () => {
    for (const brokerage of BROKERAGES) {
      const entry = entryAt(brokerage.tiers[0], brokerage.category, brokerage.name);
      expect(entry.serviceKeys, brokerage.name).toContain('info_calibration');
      expect(entry.serviceKeys, brokerage.name).toContain('info_query');
      expect(entry.serviceKeys.includes('info_feed'), brokerage.name)
        .toBe(brokerage.form === 'major');
      expect(brokerageFormOf(entry), brokerage.name).toBe(brokerage.form);
      expect(brokerageLegalityOf(entry), brokerage.name).toBe(brokerage.legality);
    }
  });

  it('info_plant is declared by EXACTLY one catalog entry, the illegal major form', () => {
    // Derived from the whole catalog, not from the BROKERAGES literal: a fifth entry that
    // quietly granted the lie-mint would be caught here rather than by review.
    const planters = new Set();
    for (const tier of Object.keys(institutionalCatalog)) {
      for (const group of Object.values(institutionalCatalog[tier])) {
        for (const [name, def] of Object.entries(group)) {
          if (brokerageServiceKeys(def).includes('info_plant')) planters.add(name);
        }
      }
    }
    expect([...planters]).toEqual([WHISPER_MARKET]);
  });

  it('a nameless synthetic institution declaring the same keys resolves identically', () => {
    // The custom-content clause (design §3): effects read the keys, so a custom brokerage
    // that declares them behaves exactly like a native entry. If any accessor ever starts
    // consulting the name, this pin reds.
    const syntheticMajorCovert = { serviceKeys: ['info_calibration', 'info_query', 'info_feed', 'info_plant'], tags: ['criminal', 'information', 'brokerage'] };
    const syntheticMinorLicensed = { serviceKeys: ['info_calibration', 'info_query'], tags: ['legal', 'information', 'brokerage'] };
    expect(brokerageFormOf(syntheticMajorCovert)).toBe('major');
    expect(brokerageLegalityOf(syntheticMajorCovert)).toBe('illegal');
    expect(brokerageFormOf(syntheticMinorLicensed)).toBe('minor');
    expect(brokerageLegalityOf(syntheticMinorLicensed)).toBe('legal');
  });

  it('the accessors fail closed on non-brokerages and on invented keys', () => {
    const fence = entryAt('village', 'Criminal', 'Fence (word of mouth)');
    expect(fence, 'the anchor institution must exist').toBeTruthy();
    expect(isInformationBrokerage(fence)).toBe(false);
    expect(brokerageFormOf(fence)).toBeNull();
    expect(brokerageLegalityOf(fence)).toBeNull();
    expect(isInformationBrokerage(null)).toBe(false);
    expect(brokerageServiceKeys({ serviceKeys: ['info_omniscience', 'info_query'] }))
      .toEqual(['info_query']);
    expect(brokerageServiceKeys({ serviceKeys: 'info_query' })).toEqual([]);
  });
});

describe('[W-I I1] the subsumption ladders (design §3)', () => {
  const ruleFor = (greater) => SUBSUMPTION_RULES.find((rule) => rule.greater === greater);

  it('each guild form declares its minor form as a lesser', () => {
    expect(ruleFor("chroniclers' exchange")?.lesser).toContain('listening post');
    expect(ruleFor('whisper market')?.lesser).toContain('rookery');
  });

  it('the shared ladder predicate agrees, and the families do not cross', () => {
    expect(institutionLadderEvicts(EXCHANGE, LISTENING_POST)).toBe(true);
    expect(institutionLadderEvicts(WHISPER_MARKET, ROOKERY)).toBe(true);
    // A covert guild does not absorb a licensed house and vice versa: they answer to
    // different patrons and grade by different competences.
    expect(institutionLadderEvicts(WHISPER_MARKET, LISTENING_POST)).toBe(false);
    expect(institutionLadderEvicts(EXCHANGE, ROOKERY)).toBe(false);
    // …and a minor form never evicts its own guild.
    expect(institutionLadderEvicts(LISTENING_POST, EXCHANGE)).toBe(false);
    expect(institutionLadderEvicts(ROOKERY, WHISPER_MARKET)).toBe(false);
  });
});

describe('[W-I I1] the channel-competence tuning table (design §4)', () => {
  const CELLS = BROKERAGE_LEGALITIES.flatMap((legality) => BROKERAGE_FORMS.flatMap(
    (form) => INFORMATION_CHANNELS.map((channel) => ({ legality, form, channel })),
  ));

  it('is TOTAL over legality x form x channel, with no fall-through', () => {
    expect(CELLS.length).toBe(2 * 2 * 6);
    for (const cell of CELLS) {
      const value = brokerageChannelCompetence(cell.legality, cell.form, cell.channel);
      expect(Number.isFinite(value), JSON.stringify(cell)).toBe(true);
      expect(value, JSON.stringify(cell)).toBeGreaterThan(0);
    }
  });

  it('honours constitutional Law 1: no cell exceeds the fidelity ceiling, and the ceiling bites', () => {
    const ceiling = INFORMATION_BROKERAGE_TUNING.FIDELITY_CEILING;
    expect(ceiling).toBeGreaterThan(0);
    expect(ceiling).toBeLessThan(1);
    const values = CELLS.map((c) => brokerageChannelCompetence(c.legality, c.form, c.channel));
    for (const value of values) expect(value).toBeLessThanOrEqual(ceiling);
    // A ceiling nothing reaches is a decoration. The best house in its best channel sits
    // AT it, so the bound is load-bearing rather than aspirational.
    expect(Math.max(...values)).toBe(ceiling);
  });

  it('the guild form is strictly better than the minor form in every channel', () => {
    for (const legality of BROKERAGE_LEGALITIES) {
      for (const channel of INFORMATION_CHANNELS) {
        const minor = brokerageChannelCompetence(legality, 'minor', channel);
        const major = brokerageChannelCompetence(legality, 'major', channel);
        expect(major, `${legality}/${channel}`).toBeGreaterThan(minor);
      }
    }
  });

  it('legal and illegal houses INVERT: each family beats the other in the channels it masters', () => {
    const mastered = INFORMATION_BROKERAGE_TUNING.MASTERED_CHANNELS;
    // The mastery declaration must itself partition the closed channel vocabulary, or the
    // inversion claim below could be true while quietly ignoring a channel.
    expect([...mastered.legal, ...mastered.illegal].sort())
      .toEqual([...INFORMATION_CHANNELS].sort());
    for (const form of BROKERAGE_FORMS) {
      for (const channel of mastered.legal) {
        expect(brokerageChannelCompetence('legal', form, channel), `overt ${form}/${channel}`)
          .toBeGreaterThan(brokerageChannelCompetence('illegal', form, channel));
      }
      for (const channel of mastered.illegal) {
        expect(brokerageChannelCompetence('illegal', form, channel), `covert ${form}/${channel}`)
          .toBeGreaterThan(brokerageChannelCompetence('legal', form, channel));
      }
    }
  });

  it('reads 0 for any axis outside its closed vocabulary (fails closed)', () => {
    expect(brokerageChannelCompetence('legal', 'major', 'weather')).toBe(0);
    expect(brokerageChannelCompetence('grey', 'major', 'trade')).toBe(0);
    expect(brokerageChannelCompetence('legal', 'imperial', 'trade')).toBe(0);
    expect(brokerageChannelCompetence(null, undefined, 'trade')).toBe(0);
  });
});

describe('[W-I I1] the rumour-source service tag (design §0b, the data pass)', () => {
  const TAGGED = Object.keys(RUMOR_SOURCE_INSTITUTIONS);

  it('names only REAL catalog institutions (no orphan keys)', () => {
    const orphans = TAGGED.filter((name) => !ALL_CATALOG_NAMES.has(name));
    expect(orphans, `orphan rumour-source keys: ${orphans.join(', ')}`).toEqual([]);
  });

  it('uses the closed lane vocabulary, and every lane is alive (no dead lane)', () => {
    const used = new Set(Object.values(RUMOR_SOURCE_INSTITUTIONS));
    for (const lane of used) expect(RUMOR_SOURCE_LANES, `unknown lane ${lane}`).toContain(lane);
    for (const lane of RUMOR_SOURCE_LANES) {
      expect(used.has(lane), `lane "${lane}" is declared but nothing carries it`).toBe(true);
    }
  });

  it('is a non-trivial census (the pins above are not vacuous)', () => {
    expect(TAGGED.length).toBeGreaterThanOrEqual(20);
  });

  it('NEVER names a brokerage: sources host talk, brokerages weigh it', () => {
    for (const brokerage of BROKERAGES) {
      // The anchor is a real tagged talk house on the same table, so an emptied or
      // re-keyed table reds on the anchor instead of passing this exclusion for free.
      expectAbsentWithAnchor(TAGGED, brokerage.name, 'Coaching inn', `${brokerage.name} is not a rumour source`);
      expect(rumorSourceLaneOf(brokerage.name), brokerage.name).toBeNull();
    }
  });

  it('the market squares are deliberately EXCLUDED (the density signal must discriminate)', () => {
    // Recorded as a decision, not an oversight: a market exists in nearly every settlement
    // above a hamlet, so tagging it would flatten the density the covert guild's presence
    // weighting is meant to read. The anchor proves the table is live and correctly keyed.
    for (const market of ['Market square', 'Daily markets', 'Periodic market', 'Weekly market']) {
      expect(ALL_CATALOG_NAMES.has(market), `${market} must exist for this exclusion to mean anything`).toBe(true);
      expectAbsentWithAnchor(TAGGED, market, 'Brothel', `${market} excluded from rumour sources`);
    }
  });

  it('censuses a roster by lane, dropping lanes that are absent', () => {
    const census = rumorSourceCensus(['Coaching inn', 'Brothel', 'Local fence', 'Blacksmith', 'Coaching inn']);
    expect(census.total).toBe(4);
    expect(census.byLane).toEqual({ road: 2, vice: 1, underworld: 1 });
    expect(census.sources).toEqual(['Brothel', 'Coaching inn', 'Coaching inn', 'Local fence']);
    // Drop-when-empty: 'hearth' produced nothing, so it is absent rather than a zero.
    expect(Object.prototype.hasOwnProperty.call(census.byLane, 'hearth')).toBe(false);
  });

  it('an empty or junk roster censuses to nothing rather than throwing', () => {
    for (const input of [[], null, undefined, ['Blacksmith'], [null, 42, {}]]) {
      const census = rumorSourceCensus(/** @type {any} */ (input));
      expect(census.total, JSON.stringify(input)).toBe(0);
      expect(census.byLane, JSON.stringify(input)).toEqual({});
    }
  });
});

describe('[W-I I1] the Rookery criminal-power precondition (design §3)', () => {
  // The predicate is authored here because the institution catalog is walked BEFORE any
  // power exists, so no catalog field could carry the rule. It is composed with the
  // CANONICAL archetype detector rather than a hand-rolled regex, which is the whole
  // point of factionArchetypes.js being a single writer.
  const archetypesOf = (factions) => factions.map((faction) => factionArchetype(faction));

  it('is met when the settlement carries a criminal organization', () => {
    const factions = [
      { name: 'The Merchant Concord', category: 'merchant' },
      { name: 'The Quiet Hands', category: 'criminal' },
    ];
    expect(archetypesOf(factions)).toContain('criminal');
    expect(brokeragePowerPreconditionMet(archetypesOf(factions))).toBe(true);
  });

  it('is NOT met when no power is criminal (the anchored negative)', () => {
    const factions = [
      { name: 'The Merchant Concord', category: 'merchant' },
      { name: 'The Town Council', category: 'government' },
      { name: 'The Chapel of the Long Watch', category: 'religious' },
    ];
    const archetypes = archetypesOf(factions);
    // Anchored: 'merchant' proves the detector ran and produced real archetypes, so the
    // missing 'criminal' below is an exclusion rather than an empty derivation.
    expectAbsentWithAnchor(archetypes, 'criminal', 'merchant', 'no criminal power present');
    expect(brokeragePowerPreconditionMet(archetypes)).toBe(false);
  });

  it('fails closed on an absent, empty, or malformed power structure', () => {
    for (const input of [null, undefined, [], [null], ['other'], 'criminal']) {
      expect(brokeragePowerPreconditionMet(/** @type {any} */ (input)), JSON.stringify(input)).toBe(false);
    }
  });
});
