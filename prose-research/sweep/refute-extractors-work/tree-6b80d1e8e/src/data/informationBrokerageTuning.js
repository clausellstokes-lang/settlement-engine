/**
 * data/informationBrokerageTuning.js — [W-I INFORMATION BROKERAGES] I1, the authored
 * vocabulary + tuning + census leaf (docs/DESIGN_INFORMATION_BROKERAGES.md §0b, §3, §4).
 *
 * WHAT THIS FILE IS FOR. The brokerage wave splits one word, "information", into two
 * institutional roles the design forbids conflating:
 *
 *   RUMOUR SOURCES are WHERE TALK HAPPENS. Inns, bathhouses, brothels, gambling houses,
 *   fences. They give the rumour plane its volume and its colour. They already exist in
 *   the catalog; this file only TAGS them, so the plane's own sources become census-able
 *   for the first time (design §0b, the data pass).
 *
 *   BROKERAGES are HOW TALK IS WEIGHED. Four new catalog entries whose competence per
 *   channel decides how sharply a settlement's derived view of the world can be graded.
 *   Their capability is declared by CLOSED SERVICE KEYS on the catalog entry, never by
 *   name, so a custom brokerage-class institution declaring the same keys behaves
 *   identically to a native one (design §3, the custom-content clause).
 *
 * WHY THE RUMOUR-SOURCE TAGS LIVE HERE AND NOT ON THE CATALOG ENTRIES. Generation spreads
 * the whole catalog definition onto every institution instance and the golden master
 * hashes the settlement WHOLE, so a field added to an EXISTING catalog entry changes every
 * golden row that entry appears in. The brokerage entries are new, so their own
 * `serviceKeys` field costs nothing extra; tagging the twenty-two existing talk houses
 * inline would have moved a large share of the corpus for a census with no consumer yet.
 * This is the same reason domain/display/institutionVocabulary.js is a side-car. Keys here
 * are EXACT canonical catalog names and the pin
 * (tests/data/informationBrokerageCatalog.test.js) fails on any orphan.
 *
 * DORMANCY + PURITY. I1 is INERT: nothing in the engine reads this file yet. It imports
 * NOTHING (headless data leaf, no eager importer, so it rides 'data-lazy' and costs zero
 * first-paint bytes), holds no rng, no clock, and no tier or entitlement read. Every
 * accessor is total and fails CLOSED: an unknown legality, form, channel, or name reads as
 * absent rather than as a default competence.
 *
 * TUNING STATUS: PROPOSED. Every number below is an authored first draft in the
 * soak-vetoable band idiom (the aiSpendAlarm precedent). The structural properties are
 * what the pins actually lock: the competence inversion between legal and illegal houses,
 * strict growth from the minor form to the major form, and the fidelity ceiling that keeps
 * constitutional Law 1 true (distance is bent, never abolished). The individual digits are
 * expected to move under owner-signed tuning; the structure is not.
 */

// ── Closed vocabularies (design §3, §4) ──────────────────────────────────────

/**
 * What a house can be good at. Six channels, closed. `persons` carries wanderer
 * reputation (the NPC-consequences doc §6b), which is the mechanical bridge that makes a
 * stranger's story harder to outrun where listeners live.
 * @type {readonly string[]}
 */
export const INFORMATION_CHANNELS = Object.freeze([
  'trade', 'war', 'politics', 'faith', 'crime', 'persons',
]);

/**
 * The closed capability vocabulary a brokerage catalog entry declares in `serviceKeys`.
 * Effects are service-key-driven and never name-driven, so this list, not a regex over
 * institution names, is what a later slice switches on.
 *
 *   info_calibration  the passive reliability grading a brokerage settlement gains
 *   info_query        the paid per-question sharp-truth service
 *   info_feed         the standing patron contract (major forms only)
 *   info_plant        commissioning a lie through the house (illegal major only)
 *
 * @type {readonly string[]}
 */
export const BROKERAGE_SERVICE_KEYS = Object.freeze([
  'info_calibration', 'info_query', 'info_feed', 'info_plant',
]);

/** The two institutional families. @type {readonly string[]} */
export const BROKERAGE_LEGALITIES = Object.freeze(['legal', 'illegal']);

/** The two tier-scaled forms: a small house, and the guild that subsumes it. @type {readonly string[]} */
export const BROKERAGE_FORMS = Object.freeze(['minor', 'major']);

/**
 * The service key that marks the MAJOR form. The guild form is the one that can run a
 * standing patron contract; a minor house sells piecework only. Deriving the form from a
 * declared key rather than from the entry's name is what keeps custom brokerage content
 * on the same footing as native content.
 */
const MAJOR_FORM_SERVICE_KEY = 'info_feed';

/** The tag that marks a catalog entry as a brokerage rather than a rumour source. */
const BROKERAGE_TAG = 'brokerage';

// ── The authored tuning table (PROPOSED) ─────────────────────────────────────

/**
 * Constitutional Law 1, expressed as a number: no house, in any channel, in any form, may
 * exceed this competence. Distance decay is bent by a brokerage and never abolished, so
 * omniscience has to be unreachable by construction rather than by careful tuning.
 */
const FIDELITY_CEILING = 0.9;

/**
 * INFORMATION_BROKERAGE_TUNING — the authored channel-competence table (design §4).
 *
 * Legal houses master the overt channels (trade, war, politics, faith) and read the covert
 * ones poorly. Illegal houses invert it: crime and persons are their trade, and the open
 * channels reach them second-hand. Faith is the sharpest split, because a covert house has
 * no seat in any congregation.
 *
 * Read it through `brokerageChannelCompetence`, which is total and fails closed.
 */
export const INFORMATION_BROKERAGE_TUNING = Object.freeze({
  /** Law 1's ceiling. Every cell below is at or under it, pinned. */
  FIDELITY_CEILING,

  /** legality -> form -> channel -> competence in (0, FIDELITY_CEILING]. */
  CHANNEL_COMPETENCE: Object.freeze({
    legal: Object.freeze({
      minor: Object.freeze({
        trade: 0.50, war: 0.34, politics: 0.40, faith: 0.36, crime: 0.18, persons: 0.16,
      }),
      major: Object.freeze({
        trade: 0.82, war: 0.62, politics: 0.74, faith: 0.60, crime: 0.30, persons: 0.28,
      }),
    }),
    illegal: Object.freeze({
      minor: Object.freeze({
        trade: 0.26, war: 0.22, politics: 0.26, faith: 0.12, crime: 0.56, persons: 0.50,
      }),
      major: Object.freeze({
        trade: 0.44, war: 0.38, politics: 0.46, faith: 0.22, crime: 0.90, persons: 0.84,
      }),
    }),
  }),

  /**
   * The channels each family is authored to MASTER. The pins assert the table actually
   * obeys this split, so a future tuning edit that quietly flattens the inversion reds
   * instead of shipping.
   */
  MASTERED_CHANNELS: Object.freeze({
    legal: Object.freeze(['trade', 'war', 'politics', 'faith']),
    illegal: Object.freeze(['crime', 'persons']),
  }),
});

// ── The rumour-source census (design §0b, the data pass) ─────────────────────

/**
 * The lanes talk travels in. Closed vocabulary; every lane below is used by at least one
 * institution, and the pin fails on a dead lane.
 *
 *   road        strangers arrive carrying news of somewhere else
 *   hearth      the settlement talking to itself, at length and in public
 *   vice        houses where tongues loosen and nobody is keeping minutes
 *   underworld  talk that is traded but never surfaces
 *
 * @type {readonly string[]}
 */
export const RUMOR_SOURCE_LANES = Object.freeze(['road', 'hearth', 'vice', 'underworld']);

/**
 * THE CLOSED RUMOUR-SOURCE SERVICE TAG. Exact canonical catalog name -> lane.
 *
 * Membership rule, applied deliberately: an institution belongs here when unofficial talk
 * is its DISTINCTIVE function, not merely a side effect of people being present. That is
 * why the market squares are absent even though a market's own service menu advertises
 * "News and information": a market exists in essentially every settlement above a hamlet,
 * so including it would flatten the density signal the Whisper market's presence weighting
 * is supposed to read (design §0b, the synergy clause). Traders' halls that exist to
 * exchange ROUTE INTELLIGENCE are in, because that is the whole point of the counter.
 *
 * @type {Readonly<Record<string, string>>}
 */
export const RUMOR_SOURCE_INSTITUTIONS = Object.freeze({
  // road — the news that walks in from somewhere else
  'Wayside inn': 'road',
  "Travelers' inn": 'road',
  'Coaching inn': 'road',
  Caravanserai: 'road',
  Waystation: 'road',
  "Caravaneer's post": 'road',
  "Caravan masters' exchange": 'road',
  'Post relay station': 'road',
  "Carriers' hiring hall": 'road',
  "Carriers' guild": 'road',

  // hearth — the settlement talking to itself
  'Inn (multiple)': 'hearth',
  'Taverns (5-20)': 'hearth',
  'Inns and taverns (district)': 'hearth',
  'Public bathhouse': 'hearth',

  // vice — where tongues loosen
  Brothel: 'vice',
  'Brothel (red light district)': 'vice',
  'Gambling den': 'vice',
  'Gambling halls': 'vice',
  'Gambling district': 'vice',

  // underworld — traded, never surfaced
  'Local fence': 'underworld',
  'Fence (word of mouth)': 'underworld',
  'Black market': 'underworld',
  'Black market bazaar': 'underworld',
  'Front businesses': 'underworld',
});

// ── Total, fail-closed accessors ─────────────────────────────────────────────

/** @param {unknown} v @returns {string} */
function text(v) {
  return typeof v === 'string' ? v : String(v == null ? '' : v);
}

/**
 * The authored competence of a house in one channel, or 0 when any of the three axes is
 * outside its closed vocabulary. Fails CLOSED on purpose: an unrecognized form must read
 * as "this house cannot grade that channel", never as a silent default.
 *
 * @param {unknown} legality one of BROKERAGE_LEGALITIES
 * @param {unknown} form one of BROKERAGE_FORMS
 * @param {unknown} channel one of INFORMATION_CHANNELS
 * @returns {number} competence in [0, FIDELITY_CEILING]
 */
export function brokerageChannelCompetence(legality, form, channel) {
  const byForm = /** @type {Record<string, Record<string, Record<string, number>>>} */ (
    INFORMATION_BROKERAGE_TUNING.CHANNEL_COMPETENCE
  )[text(legality)];
  if (!byForm) return 0;
  const byChannel = byForm[text(form)];
  if (!byChannel) return 0;
  const value = byChannel[text(channel)];
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

/**
 * The closed service keys an institution actually declares, in the canonical order of
 * BROKERAGE_SERVICE_KEYS. Anything outside the closed set is dropped, so a custom
 * definition cannot invent a capability by spelling one.
 *
 * @param {{ serviceKeys?: unknown }|null|undefined} institution
 * @returns {readonly string[]}
 */
export function brokerageServiceKeys(institution) {
  const raw = institution && typeof institution === 'object' ? institution.serviceKeys : null;
  if (!Array.isArray(raw)) return Object.freeze([]);
  const declared = new Set(raw.map(text));
  return Object.freeze(BROKERAGE_SERVICE_KEYS.filter((key) => declared.has(key)));
}

/**
 * True when the institution declares at least one closed brokerage service key. This, not
 * the name and not the tag, is the predicate every later effect switches on.
 * @param {{ serviceKeys?: unknown }|null|undefined} institution @returns {boolean}
 */
export function isInformationBrokerage(institution) {
  return brokerageServiceKeys(institution).length > 0;
}

/**
 * 'major' when the house declares the standing-feed key, 'minor' when it declares any
 * other brokerage key, null when it is not a brokerage at all.
 * @param {{ serviceKeys?: unknown }|null|undefined} institution @returns {string|null}
 */
export function brokerageFormOf(institution) {
  const keys = brokerageServiceKeys(institution);
  if (keys.length === 0) return null;
  return keys.includes(MAJOR_FORM_SERVICE_KEY) ? 'major' : 'minor';
}

/**
 * 'legal' or 'illegal' for a brokerage, null for anything else. Read off the governed
 * catalog tags: a brokerage carrying the criminal tag is an illegal house, otherwise it is
 * a licensed one.
 * @param {{ serviceKeys?: unknown, tags?: unknown }|null|undefined} institution
 * @returns {string|null}
 */
export function brokerageLegalityOf(institution) {
  if (!isInformationBrokerage(institution)) return null;
  const tags = institution && Array.isArray(institution.tags) ? institution.tags.map(text) : [];
  if (!tags.includes(BROKERAGE_TAG)) return null;
  return tags.includes('criminal') ? 'illegal' : 'legal';
}

/**
 * The rumour lane of a NATIVE institution name, or null.
 *
 * CALLER CONTRACT: pass the NATIVE semantic name. A materialized custom institution's
 * display label is presentation, not identity, and must be resolved through the custom
 * content semantic authority before it reaches this table, exactly as the generation
 * passes do. This leaf stays import-free so it can never take that dependency itself.
 *
 * @param {unknown} nativeName @returns {string|null}
 */
export function rumorSourceLaneOf(nativeName) {
  const key = text(nativeName).trim();
  if (!key) return null;
  return Object.prototype.hasOwnProperty.call(RUMOR_SOURCE_INSTITUTIONS, key)
    ? /** @type {Record<string, string>} */ (RUMOR_SOURCE_INSTITUTIONS)[key]
    : null;
}

/**
 * The rumour-source census of a roster, given its NATIVE institution names (same caller
 * contract as `rumorSourceLaneOf`). `byLane` carries ONLY the lanes actually present, the
 * drop-when-empty idiom, so an absent lane is absent rather than a zero.
 *
 * @param {readonly unknown[]|null|undefined} nativeNames
 * @returns {{ total: number, byLane: Readonly<Record<string, number>>, sources: readonly string[] }}
 */
export function rumorSourceCensus(nativeNames) {
  /** @type {Record<string, number>} */
  const byLane = {};
  /** @type {string[]} */
  const sources = [];
  for (const candidate of Array.isArray(nativeNames) ? nativeNames : []) {
    const lane = rumorSourceLaneOf(candidate);
    if (!lane) continue;
    byLane[lane] = (byLane[lane] || 0) + 1;
    sources.push(text(candidate).trim());
  }
  sources.sort();
  return Object.freeze({
    total: sources.length,
    byLane: Object.freeze(byLane),
    sources: Object.freeze(sources),
  });
}

/**
 * THE ROOKERY PRECONDITION (design §3). An illegal information house cannot stand without
 * a criminal organization behind it: someone has to protect the loft. Expressed here as a
 * pure predicate over already-resolved faction archetypes because the institution catalog
 * is walked BEFORE any power exists, so no catalog field could carry this rule. The slice
 * that owns patron binding composes it with the canonical `factionArchetype` detector and
 * the settlement's power structure.
 *
 * Fails CLOSED: an absent, empty, or unrecognizable archetype list means no backing.
 *
 * @param {readonly unknown[]|null|undefined} factionArchetypes canonical archetype values
 * @returns {boolean}
 */
export function brokeragePowerPreconditionMet(factionArchetypes) {
  if (!Array.isArray(factionArchetypes)) return false;
  return factionArchetypes.some((archetype) => text(archetype) === 'criminal');
}
