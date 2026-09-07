/**
 * traditionCorpus.js — THE TRADITIONS wave (Engine Lift #4, slice T-1), the
 * NAME + PROSE vocabulary for founding traditions. A PURE DATA leaf (src/data):
 * frozen vocabulary tables only, ZERO behavior — the selection/composition logic
 * lives one layer up in domain/traditions/genesis.js (the data-schema.2 purity
 * discipline: data holds fields, the engine holds draws). No imports at all, so it
 * can never re-introduce RNG capture or an IO leak into the tables.
 *
 * CANONICAL-AT-ZERO discipline (eventProse §canonical-at-zero, carried here as
 * forward-insurance in case any pool is later promoted into the eventProse news
 * registry at T-5): index 0 of every pool is the plain canonical default, so a
 * falsy/absent seed reduces to a stable string. NO calamity substrings anywhere
 * (flood / fire / quake / storm) — the eventProse bucket-neutrality law, enforced
 * by tests/domain/traditionCorpus.test.js so a later promotion is safe.
 *
 * Everything here is TASTE-ADJACENT and vetoable: the motif element/act
 * vocabulary, the name grammar templates, the culture flavour words, the trappings
 * and epithets, and the four flavoured season labels.
 */

/**
 * @typedef {'spring'|'summer'|'autumn'|'winter'} TraditionSeason
 *
 * @typedef {Object} TraditionElement
 * @property {string}   id          motif element key (design §2 vocabulary)
 * @property {string}   glyph       a one-char register glyph (display only; genesis never reads it)
 * @property {string}   noun        the display noun ("Harvest")
 * @property {string}   genitive    the "of …" form ("the Harvest", "the Dead")
 * @property {string}   adjective   the attributive form ("Harvest", "Mourning")
 * @property {TraditionSeason} season  the season this element's window gravitates to
 * @property {ReadonlyArray<string>} terrains  terrains that favour this element
 * @property {ReadonlyArray<string>} econ      economic characters that favour it
 * @property {boolean}  deityFit    a faith-flavoured element (biases deity dedication)
 * @property {boolean}  foundingFit an origin-era element (eligible for the founding core)
 *
 * @typedef {Object} TraditionAct
 * @property {string}   id       act key (design §2: feast|procession|vigil|contest|fair|offering)
 * @property {string}   noun     the display noun ("Feast")
 * @property {boolean}  deityFit a devotional act (offering/vigil) — biases deity dedication
 * @property {boolean}  grand    an act that tends to run the grander two-week window
 */

/**
 * The motif ELEMENTS (design §2 "element" vocabulary). Index 0 (`founding`) is the
 * canonical origin element. Each carries terrain/econ affinities the genesis leaf
 * weights by, and the season its window gravitates to.
 * @type {ReadonlyArray<TraditionElement>}
 */
export const TRADITION_ELEMENTS = Object.freeze([
  { id: 'founding',      glyph: '⌂', noun: 'Founding',   genitive: 'the Founding',        adjective: 'Founding', season: 'spring', terrains: Object.freeze([]),                          econ: Object.freeze([]),                        deityFit: false, foundingFit: true },
  { id: 'first-landing', glyph: '⚓', noun: 'Landfall',   genitive: 'the First Landing',   adjective: 'Landing',  season: 'spring', terrains: Object.freeze(['coastal', 'riverside']),     econ: Object.freeze(['port', 'river']),         deityFit: false, foundingFit: true },
  { id: 'charter',       glyph: '✒', noun: 'Charter',    genitive: 'the Charter',         adjective: 'Charter',  season: 'spring', terrains: Object.freeze([]),                          econ: Object.freeze(['crossroads']),            deityFit: false, foundingFit: true },
  { id: 'hearth',        glyph: '▲', noun: 'Hearth',     genitive: 'the Hearth',          adjective: 'Hearth',   season: 'winter', terrains: Object.freeze([]),                          econ: Object.freeze([]),                        deityFit: false, foundingFit: false },
  { id: 'harvest',       glyph: '❦', noun: 'Harvest',    genitive: 'the Harvest',         adjective: 'Harvest',  season: 'autumn', terrains: Object.freeze(['plains', 'hills']),          econ: Object.freeze([]),                        deityFit: false, foundingFit: false },
  { id: 'river',         glyph: '≈', noun: 'River',      genitive: 'the River',           adjective: 'River',    season: 'summer', terrains: Object.freeze(['riverside']),                econ: Object.freeze(['river']),                 deityFit: false, foundingFit: false },
  { id: 'stone',         glyph: '◆', noun: 'Standing Stone', genitive: 'the Standing Stones', adjective: 'Stone', season: 'winter', terrains: Object.freeze(['mountain', 'hills']),     econ: Object.freeze([]),                        deityFit: false, foundingFit: false },
  { id: 'the-dead',      glyph: '☾', noun: 'Dead',       genitive: 'the Dead',            adjective: 'Mourning', season: 'autumn', terrains: Object.freeze([]),                          econ: Object.freeze([]),                        deityFit: true,  foundingFit: false },
  { id: 'field',         glyph: '▦', noun: 'Furrow',     genitive: 'the Fields',          adjective: 'Field',    season: 'spring', terrains: Object.freeze(['plains']),                   econ: Object.freeze([]),                        deityFit: false, foundingFit: false },
  { id: 'forge',         glyph: '⚒', noun: 'Forge',      genitive: 'the Forge',           adjective: 'Forge',    season: 'winter', terrains: Object.freeze([]),                          econ: Object.freeze(['road']),                  deityFit: false, foundingFit: false },
  { id: 'market',        glyph: '⚖', noun: 'Market',     genitive: 'the Market',          adjective: 'Market',   season: 'summer', terrains: Object.freeze([]),                          econ: Object.freeze(['crossroads', 'port', 'road']), deityFit: false, foundingFit: false },
  { id: 'hunt',          glyph: '➹', noun: 'Hunt',       genitive: 'the Hunt',            adjective: 'Hunt',     season: 'autumn', terrains: Object.freeze(['forest']),                   econ: Object.freeze(['isolated']),              deityFit: false, foundingFit: false },
  { id: 'long-sun',      glyph: '☀', noun: 'Long Sun',   genitive: 'the Long Sun',        adjective: 'Sun',      season: 'summer', terrains: Object.freeze(['desert']),                   econ: Object.freeze([]),                        deityFit: false, foundingFit: false },
  { id: 'tide',          glyph: '∿', noun: 'Tide',       genitive: 'the Tide',            adjective: 'Tide',     season: 'summer', terrains: Object.freeze(['coastal']),                  econ: Object.freeze(['port']),                  deityFit: false, foundingFit: false },
  { id: 'greening',      glyph: '✿', noun: 'Greening',   genitive: 'the Greening',        adjective: 'Green',    season: 'spring', terrains: Object.freeze(['forest', 'plains']),         econ: Object.freeze([]),                        deityFit: false, foundingFit: false },
  { id: 'stars',         glyph: '✦', noun: 'Stars',      genitive: 'the Stars',           adjective: 'Star',     season: 'winter', terrains: Object.freeze([]),                          econ: Object.freeze([]),                        deityFit: true,  foundingFit: false },
]);

/**
 * The motif ACTS (design §2 "act" vocabulary — exactly the six). Index 0 (`feast`)
 * is the canonical act. `deityFit` marks the devotional acts; `grand` marks the
 * acts that tend to a two-week window.
 * @type {ReadonlyArray<TraditionAct>}
 */
export const TRADITION_ACTS = Object.freeze([
  { id: 'feast',      noun: 'Feast',      deityFit: false, grand: false },
  { id: 'procession', noun: 'Procession', deityFit: false, grand: true  },
  { id: 'vigil',      noun: 'Vigil',      deityFit: true,  grand: false },
  { id: 'contest',    noun: 'Contest',    deityFit: false, grand: true  },
  { id: 'fair',       noun: 'Fair',       deityFit: false, grand: true  },
  { id: 'offering',   noun: 'Offering',   deityFit: true,  grand: false },
]);

/**
 * Name grammar templates. Tokens: {En} element noun · {Eg} element genitive ·
 * {An} act noun · {Adj} generic adjective · {Cadj} culture adjective. Index 0 is
 * the canonical plain form.
 * @type {ReadonlyArray<string>}
 */
export const TRADITION_NAME_TEMPLATES = Object.freeze([
  'The {En} {An}',
  'The {An} of {Eg}',
  'The {Cadj} {An}',
  'The {Adj} {En} {An}',
  'The {Adj} {An}',
]);

/**
 * Generic adjectives for the name grammar. Index 0 canonical.
 * @type {ReadonlyArray<string>}
 */
export const TRADITION_ADJECTIVES = Object.freeze([
  'Great', 'Long', 'Old', 'Quiet', 'Bright', 'Common', 'Lesser',
]);

/**
 * Culture-flavoured adjectives, keyed by the config culture. `default` seeds the
 * fallback. Index 0 of each list is the canonical/plain choice. Read-only.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const TRADITION_CULTURE_FLAVOR = Object.freeze({
  germanic:     Object.freeze(['Elder', 'Old', 'Ninth']),
  celtic:       Object.freeze(['Green', 'Hollow', 'Hallowed']),
  norse:        Object.freeze(['Long', 'Wolf', 'Iron']),
  latin:        Object.freeze(['Golden', 'High', 'Elder']),
  mediterranean:Object.freeze(['Golden', 'High', 'Laurel']),
  greek:        Object.freeze(['Golden', 'Laurel', 'High']),
  arabic:       Object.freeze(['Lantern', 'Amber', 'Silk']),
  slavic:       Object.freeze(['Deep', 'Elder', 'Frost']),
  east_asian:   Object.freeze(['Lantern', 'Moon', 'Silk']),
  mesoamerican: Object.freeze(['Sun', 'Feathered', 'Jade']),
  south_asian:  Object.freeze(['Saffron', 'Lantern', 'Monsoon']),
  steppe:       Object.freeze(['Horse', 'Wind', 'Open']),
  mixed:        Object.freeze(['Old', 'Elder', 'Great']),
  default:      Object.freeze(['Old', 'Elder', 'Great']),
});

/**
 * Physical trappings of each act — the concrete festival dress the dossier voices.
 * Keyed by act id; index 0 canonical. No calamity substrings.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const TRADITION_TRAPPINGS = Object.freeze({
  feast:      Object.freeze(['long tables set in the square', 'shared bread and the common cup', 'the guild ovens working through the night', 'a whole ox turned on the spit']),
  procession: Object.freeze(['masked walkers and carried effigies', 'the banners of every quarter', 'the old road walked end to end', 'drums and the ringing of the bells']),
  vigil:      Object.freeze(['candles kept through the dark hours', 'lantern-boats set adrift on the water', 'the long silence before dawn', 'the old names read aloud from the rolls']),
  contest:    Object.freeze(["the roped lists and the champions' ring", 'wagers laid on the favourites', "the victor's garland of oak", 'trials of arm and wind']),
  fair:       Object.freeze(['stalls crowding the high street', 'travelling players and their booths', 'the toll-gate thrown open to all', 'beasts and goods driven in from the hinterland']),
  offering:   Object.freeze(['first-fruits laid on the altar', 'the smoke of the censer', 'tithes carried up the temple steps', 'a garland left at the shrine']),
});

/**
 * Epithets for the tradition's expression line. Index 0 canonical.
 * @type {ReadonlyArray<string>}
 */
export const TRADITION_EPITHETS = Object.freeze([
  'a custom older than the walls',
  'the day the whole quarter shutters its doors',
  'kept since the first stone was laid',
  'older than any charter the town can show',
  'the one day the roads all lead home',
  'remembered when little else is',
]);

/**
 * The four flavoured SEASON LABELS the window phrase reads ("Harvest, the third
 * week"). autumn = "Harvest" per design §10. Taste-adjacent, vetoable.
 * @type {Readonly<Record<TraditionSeason, string>>}
 */
export const TRADITION_SEASON_LABELS = Object.freeze({
  spring: 'Seedtime',
  summer: 'Highsun',
  autumn: 'Harvest',
  winter: 'Deepwinter',
});

/**
 * Ordinal words for weekOfSeason 1..13 (index 0 = "first", the 1st week). Spelled
 * out so the window phrase stays prose, never a bare number.
 * @type {ReadonlyArray<string>}
 */
export const WEEK_ORDINALS = Object.freeze([
  'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
  'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth',
]);
