/**
 * settlementQuickGuide.js — one deterministic, compact settlement read-model.
 *
 * The generated dossier is intentionally deep. That depth is useful while
 * preparing, but a GM also needs a reliable first screen: one identity sentence,
 * three defining truths, one immediate pressure, three important people, and one
 * entry point. This composer selects those facts from canonical generator output
 * without inventing a second settlement model or persisting derived prose.
 *
 * The result is shared by Summary, Table View, Session Mode, and the PDF. Keeping
 * selection here prevents four presentation layers from quietly disagreeing
 * about who matters, what is urgent, or where play begins.
 */

import { crisisHookFor } from '../crisis/crisisHooks.js';
import { resolveSibling } from '../facts/drawDeclared.js';
import { factsOf } from '../facts/factsOf.js';
import { collectPlotHooks } from '../dossier/plotHooks.js';
import { formatCount } from '../formatNumber.js';
import { institutionDisplayName } from '../display/institutionDisplayName.js';
import { liveInstitutions } from '../institutions/institutionRoster.js';
import { waterAccessKind } from '../tradeRouteSemantics.js';
import { resolveTerrain } from '../resolveTerrain.js';
import { populationBandOf } from '../facts/populationBand.js';
import { pickVariant } from '../../kernel/proseHash.js';
import { voicedLineOf } from './tonightSheet.js';

const INFLUENCE_RANK = Object.freeze({
  high: 0,
  moderate: 1,
  low: 2,
});

/**
 * @typedef {Object} QuickGuideFact
 * @property {string} id
 * @property {string} label
 * @property {string} text
 * @property {string} sourcePath
 */

/**
 * @typedef {Object} QuickGuidePerson
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {string} detail
 * @property {string} sourcePath
 */

/**
 * Narrow source shapes for this read-model. Values remain `unknown` at the
 * persistence boundary and are normalized by cleanText/finiteNumber; the guide
 * does not assume that legacy saves are already schema-perfect.
 *
 * @typedef {Object} QuickGuideFaction
 * @property {unknown} [faction]
 * @property {unknown} [isGoverning]
 *
 * @typedef {Object} QuickGuideStress
 * @property {unknown} [summary]
 * @property {unknown} [description]
 * @property {unknown} [crisisHook]
 * @property {unknown} [label]
 * @property {unknown} [type]
 *
 * @typedef {Object} QuickGuideConflict
 * @property {unknown} [desc]
 * @property {unknown} [description]
 * @property {unknown} [issue]
 * @property {unknown} [tension]
 * @property {unknown} [stakes]
 *
 * @typedef {Object} QuickGuideNpc
 * @property {unknown} [id]
 * @property {unknown} [name]
 * @property {unknown} [role]
 * @property {unknown} [title]
 * @property {unknown} [power]
 * @property {unknown} [influence]
 * @property {string | { short?: unknown, long?: unknown } | null} [goal]
 * @property {string | { tell?: unknown, dominant?: unknown } | null} [personality]
 * @property {string | { what?: unknown } | null} [secret]
 *
 * @typedef {Object} QuickGuideTension
 * @property {unknown} [description]
 * @property {unknown[]} [plotHooks]
 *
 * @typedef {Object} SettlementQuickGuideSource
 * @property {unknown} [name]
 * @property {unknown} [tier]
 * @property {unknown} [population]
 * @property {{ key?: unknown, label?: unknown }} [culturalIdentity]
 * @property {{ label?: unknown }} [culture]
 * @property {unknown} [settlementReason]
 * @property {{
 *   historicalCharacter?: unknown,
 *   founding?: { reason?: unknown },
 *   currentTensions?: QuickGuideTension[],
 * }} [history]
 * @property {{
 *   factions?: QuickGuideFaction[],
 *   governingName?: unknown,
 *   government?: unknown,
 *   stability?: unknown,
 * }} [powerStructure]
 * @property {{
 *   prosperity?: string | { tier?: unknown } | null,
 *   foodSecurity?: { label?: unknown },
 *   primaryExports?: unknown,
 *   situationDesc?: unknown,
 * }} [economicState]
 * @property {unknown} [pressureSentence]
 * @property {QuickGuideStress[]} [stressors]
 * @property {QuickGuideStress[]} [stress]
 * @property {QuickGuideConflict[]} [conflicts]
 * @property {QuickGuideNpc[]} [npcs]
 * @property {Array<{ name?: unknown } | null | undefined>} [institutions]
 */

/**
 * @typedef {Object} SettlementQuickGuide
 * @property {1} version
 * @property {string} identitySentence
 * @property {QuickGuideFact[]} definingTruths
 * @property {QuickGuideFact} immediatePressure
 * @property {QuickGuidePerson[]} importantPeople
 * @property {QuickGuideFact} entryPoint
 */

/**
 * Compose the deliberately small 1 / 3 / 1 / 3 / 1 settlement guide.
 *
 * Complete generated settlements produce all three truths and all three people.
 * Sparse or legacy records remain honest: missing people are not fabricated, and
 * missing pressure or hook data is called out explicitly.
 *
 * @param {SettlementQuickGuideSource | null | undefined} settlement
 * @returns {SettlementQuickGuide}
 */
export function composeSettlementQuickGuide(settlement) {
  const source = settlement && typeof settlement === 'object' ? settlement : {};

  return {
    version: 1,
    identitySentence: composeIdentity(source),
    definingTruths: [
      composeFoundationTruth(source),
      composeAuthorityTruth(source),
      composeMaterialTruth(source),
    ],
    immediatePressure: composePressure(source),
    importantPeople: selectImportantPeople(source),
    entryPoint: composeEntryPoint(source),
  };
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {string}
 */
function composeIdentity(settlement) {
  const name = cleanText(settlement.name) || 'This settlement';
  const tier = cleanText(settlement.tier) || 'settlement';
  const population = finiteNumber(settlement.population);
  const cultureLabel = cleanText(
    settlement.culturalIdentity?.label
      || settlement.culture?.label,
  );
  const cultureKey = cleanText(settlement.culturalIdentity?.key);

  const descriptors = [
    cultureLabel,
    tier.toLowerCase(),
  ].filter(Boolean).join(' ');
  const populationPhrase = population == null
    ? ''
    : ` of ${formatCount(population)} ${population === 1 ? 'person' : 'people'}`;

  const article = articleFor(descriptors);

  // X-43: the seat of government by its real name, here as on the Overview strip.
  const phrase = scopeAtSize(seatIntoPhrase(scopePhrase(cultureKey, settlement), settlement), settlement);
  if (phrase) {
    return sentence(`${name} is ${article} ${descriptors}${populationPhrase}, ${phrase}`);
  }

  // ⛔ NO historicalCharacter FALLBACK (chair ruling T1, S-2, 2026-10-30). It built a comma
  // splice ("…of 37 people, the calendar here is crowded…") and repeated the character line
  // the Overview strip and History already print. A culture with no scope phrase gets the
  // plain sentence.
  return sentence(`${name} is ${article} ${descriptors}${populationPhrase}`);
}

/**
 * THE CULTURE SCOPE LINE, for the Overview identity strip (chair rulings X-5 / T1-1). The
 * scope phrase was the one fact of the DM Summary with no other home; the strip already
 * prints name, tier and population, so this carries only the culture and its phrase.
 * Empty when the culture has no authored phrase (no fallback, by the same ruling).
 * @param {SettlementQuickGuideSource | null | undefined} settlement
 * @returns {string}
 */
export function cultureScopeLine(settlement) {
  const source = settlement && typeof settlement === 'object' ? settlement : {};
  const phrase = scopeAgainstRecord(
    seatIntoPhrase(scopePhrase(cleanText(source.culturalIdentity?.key), source), source),
    source,
  );
  if (!phrase) return '';
  // `culturalIdentity` only: a second `culture` read would join the writerReach culture class.
  const label = cleanText(source.culturalIdentity?.label);
  if (!label) return sentence(upperLead(phrase));
  // THE SEED CHOOSES (WIRING-RULINGS §8(3)): the same town prints the same frame forever; a record
  // with no seed (every hand-built caller) gets frame 0, the line as it always read.
  const seed = cleanText(/** @type {{ _seed?: unknown }} */ (source)._seed);
  // SCOPE_LINE_FRAMES is a frozen five-frame pool, so the pick is never the empty pool's undefined.
  return sentence(/** @type {(label: string, phrase: string) => string} */ (pickVariant(SCOPE_LINE_FRAMES, seed ? `${seed}::culture-scope-line` : null))(label, phrase));
}

/**
 * THE IDENTITY LINE'S FRAMES (STYLE-2-SURFACES A·O2; STYLE-RULINGS-2 B2): five vantages over the
 * same two facts, the culture and its scope phrase as the record allows it. Five, not four: a
 * power-of-two pool aliases under the FNV pick (the origin pools' own pin). Index 0 is the line
 * as it always read. Every frame is FOR THE OWNER'S VETO.
 * @type {ReadonlyArray<(label: string, phrase: string) => string>}
 */
const SCOPE_LINE_FRAMES = Object.freeze([
  // [plain] the line as it always read
  (label, phrase) => `${label}, ${phrase}`,
  // [traveller] what shows on arrival
  (label, phrase) => `${label}, and it shows: ${phrase}`,
  // [local] where people live
  (label, phrase) => `${label}; people here live in a place ${phrase}`,
  // [newcomer] what you are told when you ask
  (label, phrase) => `${label}. Ask about the place and you are told it is ${phrase}`,
  // [official] the plain description, headed
  (label, phrase) => `${label}: ${phrase}`,
]);

/**
 * The ground a settlement stands on, in the scope line's words, from the ONE terrain read.
 * @type {Readonly<Record<string, string>>}
 */
const SCOPE_GROUND = Object.freeze({
  plains: 'on the open plain',
  hills: 'on hillside ground',
  forest: 'in forest country',
  riverside: 'on riverside ground',
  coastal: 'on the coast',
  mountain: 'on mountain ground',
  desert: 'on desert ground',
});

/** The tiers a herding life still fits (A·O2: "pastoral life half-moving" for a metropolis of 93,000). */
const SMALL_TIERS = new Set(['thorp', 'hamlet', 'village']);

/**
 * THE SCOPE PHRASE READ AGAINST THE RECORD BEFORE IT SPEAKS (STYLE-2-SURFACES A·O2, the census law):
 * each clause that claims a fact of the place — a harbour, the ground, the season, a herding life,
 * a guild, a caravan road, earthworks — prints only where the record holds that fact, and is
 * replaced by the record's own fact or struck where it does not. A record with no config is legacy
 * and unread, as `isLandlocked` reads it: its phrase stands as it always did. Display-time only.
 * @param {string} phrase @param {SettlementQuickGuideSource} source @returns {string}
 */
function scopeAgainstRecord(phrase, source) {
  if (!phrase) return phrase;
  const config = /** @type {{ config?: { terrainType?: string | null, terrainOverride?: string | null, tradeRouteAccess?: string | null } | null }} */ (source)?.config;
  const tier = cleanText(source?.tier).toLowerCase();
  const roster = Array.isArray(/** @type {{ institutions?: unknown }} */ (source)?.institutions);
  let out = phrase;
  // the tier: a herding life, and pasture, belong to the small places only
  if (tier && !SMALL_TIERS.has(tier)) {
    out = out.replace('built for a pastoral life half-settled and half-moving', 'built on clan lines')
      .replace(', on pasture and earthwork', '');
  }
  // the guild: "guild and estate" only where the roster holds a guild
  // R2-CODE-B-SIDE item 5: the guild is a HOUSE on the roster, never a power that only contends (rosterHolds below).
  if (roster && out.includes('run by guild and estate') && !rosterHolds(source, GUILD_HOUSE)) {
    out = out.replace('run by guild and estate', 'run by its estates');
  }
  // earthworks: a defence fact of their own
  if (roster && out.includes('on pasture and earthwork') && !factsOf(/** @type {Parameters<typeof factsOf>[0]} */ (source)).defence.walls) {
    out = out.replace('on pasture and earthwork', 'on pasture');
  }
  if (!config || typeof config !== 'object') return scopeAtSize(out, source);
  const terrain = resolveTerrain(config);
  const water = waterAccessKind(terrain, config.tradeRouteAccess);
  const route = cleanText(config.tradeRouteAccess).toLowerCase();
  // the harbour: the sea only (a river town on a road has a landing at most, and the record names none)
  if (water !== 'maritime') out = out.replace('the agora and the harbour', 'the agora');
  // the ground: the record's terrain, never a fixed "hillside"
  if (out.includes('on hillside ground and civic association')) {
    const ground = terrain && Object.hasOwn(SCOPE_GROUND, terrain) ? `${SCOPE_GROUND[terrain]}, ` : '';
    out = out.replace('on hillside ground and civic association', `${ground}and run by civic association`);
  }
  // the season has no record field (factsOf's own note): the Norse water line keeps its kin and oath
  out = out.replace('on assembly and what the season allows', 'on kin, oath and the assembly');
  // the river and the forest: each only where the record holds it
  if (out.includes('between river and forest')) {
    const forest = terrain === 'forest';
    const by = water === 'river'
      ? (forest ? 'between river and forest' : 'by the river')
      : (forest ? 'between the sea and the forest' : 'by the sea');
    out = out.replace('between river and forest', by);
  }
  // the caravan road: the road the record's route names
  if (out.includes('and the caravan road')) {
    out = route === 'isolated'
      ? out.replace(' and the caravan road', '')
      : water === 'maritime' && route === 'port'
        ? out.replace('the caravan road', 'the sea trade')
        : route === 'port' || route === 'river'
          ? out.replace('the caravan road', 'the river trade')
          : out;
  }
  // pasture: a small place's herding ground, only where the record's resources hold grazing land
  if (out.includes(', on pasture') && Array.isArray(/** @type {{ nearbyResources?: unknown }} */ (config).nearbyResources)
    && !(/** @type {{ nearbyResources: unknown[] }} */ (config).nearbyResources).includes('grazing_land')) {
    out = out.replace(', on pasture and earthwork', '').replace(', on pasture', '');
  }
  return scopeAtSize(out, source);
}

/** The tiers in which plural streets, an agora, a civic square or masonry building are a size error. */
const TINY_TIERS = new Set(['thorp', 'hamlet']);

/**
 * THE SCOPE PHRASE AT THE PLACE'S SIZE (R2-CODE-B item 5; the cold list REVIEW-W2A-3 #323 "built in
 * masonry around a civic square" for a hamlet of 41, #365 "built around kin districts" for a hamlet
 * of 53, #498 "in quarters by trade and kin" for a village of 105, #816 "built around the agora"
 * where no market stands). THE CHAIR'S RULING of 2026-11-13 (the instrument lane's standard,
 * registeredWords.js `streets` and `quarters`): plural streets, an agora, a civic or market square,
 * building in masonry, neighbourhoods and suburbs are a size error in a thorp or a hamlet (the
 * record's `tier`); quarters, districts (and wards, the same thing) are a size error below the
 * middling population band (facts/populationBand.js :: populationBandOf). An agora is a market, so
 * it also reads the market fact (factsOf(s).market). The clause that is false is struck or said at
 * the place's size; nothing is added that the record does not hold. A record with no tier or
 * population is legacy and unread. Display-time only.
 * @param {string} phrase @param {SettlementQuickGuideSource} source @returns {string}
 */
function scopeAtSize(phrase, source) {
  if (!phrase) return phrase;
  const tier = cleanText(source?.tier).toLowerCase();
  const tiny = TINY_TIERS.has(tier);
  // R2-CODE-B-SIDE item 5: a village is small by its tier as well as by its people (the chair's ruling: "a village of up
  // to about 350 people included"; a village of 372 is a town by its population band and still a village on its page).
  const small = populationBandOf(/** @type {{ population?: unknown, tier?: unknown }} */ (source)) === 'small' || SMALL_TIERS.has(tier);
  const roster = Array.isArray(/** @type {{ institutions?: unknown }} */ (source)?.institutions);
  const noMarket = roster && factsOf(/** @type {Parameters<typeof factsOf>[0]} */ (source)).market === false;
  let out = phrase;
  if (tiny) {
    out = out.replace('built in masonry around a civic square, and run by', 'run by')
      .replace('built around a civic-ritual plaza, on tribute and the ritual calendar', 'built on tribute and the ritual calendar')
      .replace('built around a civic-ritual plaza, tribute, and market-and-waterworks', 'built on tribute, market and waterworks');
  }
  if (tiny || noMarket) {
    out = out.replace('built around the agora and the harbour', 'built around the harbour')
      .replace('built around the agora, and run by', 'run by')
      .replace('built around the agora, ', 'built ');
  }
  if (small) {
    out = out.replace('built around kin districts and an assembly ground', 'built around kin')
      .replace(', in quarters by trade and kin', ', kin by kin')
      .replace(', in quarters by trade,', ',')
      .replace('built in wards and courtyards', 'built around courtyards')
      // R2-CODE-B-SIDE item 5: a bureau is an office no small place keeps (the increment's hamlet of 31).
      .replace('ordered by bureau and lineage', 'ordered by lineage');
  }
  // R2-CODE-B-SIDE item 5: the houses and the office the phrase names, read against the roster (after the size reads,
  // so a phrase is first said at the place's size). A record with no roster is legacy and unread.
  return roster ? scopeAgainstRoster(out, source) : out;
}

/** A house that is waterworks: a conduit, a cistern, a fountain or a bathhouse (a well or a spring is not). */
const WATERWORKS_HOUSE = /\baqueduct|\bcistern|\bwater system|\bwaterworks|\bfountain|\bbath(?:s|house)?\b/i;
/** A house a gift endows: a church, a temple, a religious house, a school, a hospital or an almshouse (a shrine is not). */
const ENDOWED_HOUSE = /\bchurch|\bcathedral|\btemple|\babbey|\bmonaster|\bfriary|\balmshouse|\bhospital|\bschool|\bcollege|\bacademy|\buniversity|\bmadrasa/i;
/** A house that keeps an office: a court, a customs or tax house, a chancery (the seat of government is read by its own reader). */
const OFFICE_HOUSE = /\bcourt|\bcustoms|\btax|\bchancery|\bbureau|\bmagistra/i;
/** A guild house on the roster (a guild that is only a contending power is not a house: round three's #234). */
const GUILD_HOUSE = /\bguild/i;

/**
 * Does the roster hold a live house of this kind? A road to another place's house ("Access to ...") is not one.
 * @param {SettlementQuickGuideSource} source @param {RegExp} re @returns {boolean}
 */
function rosterHolds(source, re) {
  return liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (source))
    .map((inst) => cleanText(inst?.name))
    .some((n) => !!n && !/^access to/i.test(n) && re.test(n));
}

/** The ruler kinds (facts/rulerKind.js) whose rule is not a civic association. */
const NOT_CIVIC_RULE = new Set(['lord', 'priest', 'occupier']);

/**
 * THE SCOPE PHRASE'S HOUSES READ AGAINST THE ROSTER (R2-CODE-B-SIDE item 5; round three's #1 "built around courtyards
 * and waterworks, on endowed institutions" in a thorp of 16 with neither, #234 "under temple and guild" with no guild,
 * #513 "run by civic association" under a lord's appointee, the increment's "ordered by bureau and lineage" in a hamlet
 * of 31; CENSUS-2's 57 lines of kind (a)). THE RULING: a frame that names an institution, a quarter or an office reads
 * the roster; a frame that cannot be made true in a small place is not printed there. Each clause is struck where the
 * roster (its live houses, never an "Access to ..." road to another place's) holds no such house (the office is
 * struck in every small place by scopeAtSize itself). Nothing is added the record does not hold. Display-time only.
 * @param {string} phrase @param {SettlementQuickGuideSource} source @returns {string}
 */
function scopeAgainstRoster(phrase, source) {
  const holds = (/** @type {RegExp} */ re) => rosterHolds(source, re);
  const facts = factsOf(/** @type {Parameters<typeof factsOf>[0]} */ (source));
  let out = phrase;
  if (!holds(WATERWORKS_HOUSE)) {
    out = out.replace('built around courtyards and waterworks', 'built around courtyards')
      .replace('tribute, and market-and-waterworks', 'tribute and market')
      .replace('built on tribute, market and waterworks', 'built on tribute and market');
  }
  if (!holds(ENDOWED_HOUSE)) out = out.replace(', on endowed institutions and ', ', on ').replace(', on endowed institutions', '');
  if (!holds(GUILD_HOUSE)) out = out.replace(', under temple and guild', ', under the temple');
  if (!(governmentSeatName(/** @type {Parameters<typeof governmentSeatName>[0]} */ (source)) || holds(OFFICE_HOUSE))) {
    out = out.replace('ordered by bureau and lineage', 'ordered by lineage');
  }
  if (NOT_CIVIC_RULE.has(String(facts.rulerKind))) {
    out = out.replace(', and run by civic association', '').replace(' and civic association', '');
  }
  return out;
}

/**
 * THE SEAT OF GOVERNMENT BY ITS REAL NAME (X-43, the owner 2026-11-02: "replace the hall by the
 * actual name of the institution representing the government … the building that actually
 * where they make decisions at where that's appropriate. Like the palace or the Guild Hall").
 * The catalogue's seats are buildings, in order of weight; the first the roster carries is the
 * seat. A body (a council, an oligarchy, a governor) is who governs, not where, so it is never
 * the seat; with no seat building the authored phrase stands as written.
 * @type {ReadonlyArray<string>}
 */
const GOVERNMENT_SEATS = Object.freeze(['Palace/government complex', 'City hall', 'Town hall']);

/**
 * The display name of the settlement's seat of government, or null.
 * @param {SettlementQuickGuideSource | null | undefined} settlement
 * @returns {string | null}
 */
export function governmentSeatName(settlement) {
  // the seat is a LIVE house: a ruined palace is not where decisions are made
  const roster = liveInstitutions(settlement);
  const names = new Set(roster.map((inst) => cleanText(inst?.name)).filter(Boolean));
  const seat = GOVERNMENT_SEATS.find((name) => names.has(name));
  return seat ? institutionDisplayName(seat) : null;
}

/**
 * A scope phrase that says "the hall" names the seat instead when the roster has one.
 * @param {string} phrase @param {SettlementQuickGuideSource} source
 * @returns {string}
 */
function seatIntoPhrase(phrase, source) {
  if (!phrase || !phrase.includes('the hall')) return phrase;
  const seat = governmentSeatName(source);
  return seat ? phrase.replace('the hall', `the ${seat}`) : phrase;
}

/**
 * WHO GOVERNS, as one glance line for the Overview strip (X-5 / T1-1): the governing name
 * and the stability band, joined by a middle dot. Reads the same fields, in the same order
 * of preference, as the composer's "Who holds power" truth. Empty when neither is recorded.
 * @param {SettlementQuickGuideSource | null | undefined} settlement
 * @returns {string}
 */
export function governsLine(settlement) {
  const source = settlement && typeof settlement === 'object' ? settlement : {};
  const factions = Array.isArray(source.powerStructure?.factions) ? source.powerStructure.factions : [];
  const governing = cleanText(
    source.powerStructure?.governingName
      || source.powerStructure?.government
      || factions.find((faction) => faction?.isGoverning)?.faction,
  );
  const stability = cleanText(source.powerStructure?.stability);
  return [governing, stability].filter(Boolean).join(' · ');
}

/**
 * THE ARTICLE THE IDENTITY SENTENCE TAKES, per LEAD WORD.
 *
 * ⚠ IT WAS HARDCODED 'a', so every Arabic-inspired and East-Asian-inspired settlement
 * read "is a Arabic-inspired village" on the DM's first screen. ⚠ AND THE OBVIOUS
 * REPAIR IS ALSO WRONG: `/^[aeiou]/` gives "an European" and "an one-street hamlet",
 * because English takes the article from the SOUND and not from the letter.
 *
 * So the words the product actually mints are listed, and nothing is inferred for
 * them: the eleven authored culture labels and the six tiers. The rule below is a
 * fallback for a label this file did not write - a legacy save, a custom identity -
 * where being right most of the time is the best available and being wrong is no
 * worse than the hardcoded article it replaces.
 *
 * @type {Readonly<Record<string, 'a' | 'an'>>}
 */
const ARTICLE_BY_LEAD = Object.freeze({
  'Germanic-inspired': 'a',
  'Latin-inspired': 'a',
  'Celtic-inspired': 'a',
  'Arabic-inspired': 'an',
  'Norse-inspired': 'a',
  'Slavic-inspired': 'a',
  'East-Asian-inspired': 'an',
  'Mesoamerican-inspired': 'a',
  'South-Asian-inspired': 'a',
  'Steppe-inspired': 'a',
  'Greek-inspired': 'a',
  thorp: 'a',
  hamlet: 'a',
  village: 'a',
  town: 'a',
  city: 'a',
  metropolis: 'a',
  settlement: 'a',
});

/**
 * ⛔ WHOLE WORDS, NOT PREFIXES. The first spelling of this rule matched `/^(?:eu|one|uni|…)/`
 * and over-fired on every word that merely STARTS that way: "a uninhabited hamlet",
 * "a unimportant village", "a Oneiric-inspired town". A prefix cannot tell `unified`
 * (/juː/, takes 'a') from `uninhabited` (/ʌ/, takes 'an'), because the distinction is
 * the vowel that follows, not the letters that open. Both lists are therefore keyed on
 * the lead's first WORD and are kept as short as the defect allows.
 */
/**
 * ⭐⭐ THE RULE IS INVERTED FROM HERE ON (review 10, 2026-09-18), and the measurement is the
 * whole argument. The previous cut asked "does this look like a consonant-sound word?" with a
 * `uni-` PREFIX behind an eighteen-word exception set — a NEGATIVE list against an open class.
 * Measured against a dictionary: 538 of 542 `un` + vowel words came out wrong ("a uninspired",
 * "a unintended", "a unimaginable"), because the exception set can only ever name the handful
 * somebody thought of, and `un-` is the most productive negating prefix in English.
 *
 * So the polarity is reversed. `an` is now the DEFAULT for a written vowel, which is right for
 * the whole open `un-` class at once, and the words that break it are POSITIVE lists that can
 * only shrink the answer where somebody has actually looked. A missing entry now costs one
 * wrong article on one unusual word instead of an entire word class.
 */

/**
 * Whole words that open with a written vowel and a CONSONANT sound — exact spellings the
 * stems below cannot safely reach, because their own prefix is shared with a word that takes
 * the other article ("one" against "oneiric", "ewe" against "ewer" is fine but "ew" is not).
 */
const CONSONANT_SOUND_WORDS = new Set([
  'one', 'ones', 'oneself', 'once', 'ewe', 'ewer', 'ouija',
]);

/**
 * ⭐ THE POSITIVE LIST, AS STEMS — every written-vowel opening that is really said with a
 * consonant, enumerated rather than guessed. Each stem is chosen so that NO word starting
 * with it takes 'an': `unit` reaches unit/unite/unity/united/unitary, `univ` reaches
 * universe/universal/university/univalent/univocal, `use` reaches use/used/useful/user, and
 * none of them can be reached by `un` + a vowel-initial word.
 *
 * ⛔ WHY THERE IS NO BARE `uni` STEM, WHICH IS THE WHOLE LESSON. `uni` cannot tell `uniform`
 * (/juː/) from `uninspired` (/ʌn/ + `inspired`), because the sound is decided by what FOLLOWS
 * and both are followed by a consonant letter. The old spelling kept the bare prefix and tried
 * to subtract the exceptions; this one never admits the ambiguous prefix in the first place.
 * A `uni-` word the list misses falls to 'an', which is wrong for that ONE word rather than
 * for the five hundred the prefix was swallowing.
 *
 * `ur[aeio]` is the /jʊər/ family — urine, uranium, urea, ureter, urology — and it requires the
 * vowel, so `urn`, `urban` and `urge` are untouched and still take 'an'/'a' by the rules below.
 */
const CONSONANT_SOUND_STEMS =
  /^(?:eu|ewe|ouija|ubiq|ufo|uku|unanim|unicam|unicel|unico(?:de|rn)|unicycl|unifi|unifor|unify|unilater|unilingu|unio|uniqu|unisex|unison|unit|univ|ur[aeio]|usa|use|usu|ute|util|utop)/;

/**
 * The other positive list: written CONSONANTS that open with a vowel sound, so they take 'an'.
 * The silent h, plus the American `herb`. Exact words, never a stem — `her`, `herd`, `Herbert`
 * and `honeycomb` all open with the ordinary consonant and must not be caught.
 */
const VOWEL_SOUND_WORDS = new Set([
  'heir', 'heiress', 'heirloom', 'honest', 'honesty', 'honestly',
  'honour', 'honor', 'honourable', 'honorable', 'honorary', 'honorific',
  'hour', 'hourglass', 'hourly', 'herb', 'herbs', 'herbal', 'herbalist', 'herbaceous',
]);

/**
 * ⭐ AN INITIALISM IS READ LETTER BY LETTER, so its article answers to the NAME of its first
 * letter and not to the letter itself. Nine of the twenty-six were wrong before this existed:
 * "a FMG" (ef), "an URL" (you), "a SOS" (es). These twelve letter names open with a vowel
 * sound — ay, ee, ef, aitch, eye, el, em, en, oh, ar, es, ex — and every other letter, `U`
 * included, opens with a consonant one.
 */
const LETTER_NAME_TAKES_AN = new Set(['A', 'E', 'F', 'H', 'I', 'L', 'M', 'N', 'O', 'R', 'S', 'X']);

/**
 * ⭐ THE VOWEL LEADS, BY LETTER RATHER THAN BY ASCII RANGE (review 12).
 *
 * The default below used to ask `/^[aeiou]/`, which is a question about five ASCII bytes and
 * not about vowels. A settlement label is the most likely string in the product to carry a
 * letter outside that range — Île-de-France, Ürümqi, Ægir, Ærie, Ørsted, Óbuda, Åland — and
 * every one of them came out "a". The set is the ASCII five plus the accented and ligature
 * forms a Latin-script label actually reaches, so the rule answers about the letter the
 * reader says. `ñ`, `š`, `ç` and `ý` are deliberately absent: they are consonants, and `y`
 * is a consonant lead in English whatever diacritic it carries.
 */
const VOWEL_LEADS = new Set([
  'a', 'e', 'i', 'o', 'u',
  'à', 'á', 'â', 'ã', 'ä', 'å', 'æ', 'ā', 'ă', 'ą',
  'è', 'é', 'ê', 'ë', 'ē', 'ĕ', 'ė', 'ę', 'ě',
  'ì', 'í', 'î', 'ï', 'ĩ', 'ī', 'ĭ', 'į', 'ı',
  'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ō', 'ŏ', 'ő', 'œ',
  'ù', 'ú', 'û', 'ü', 'ũ', 'ū', 'ŭ', 'ů', 'ű', 'ų',
]);

/**
 * The authored map, read again without regard to case.
 *
 * ⚠ IT IS A SECOND LOOKUP AND NOT A REPLACEMENT. The exact read above stays first so authored
 * copy is decided byte-for-byte as it always was; this one catches the same authored words in
 * a custom label's own casing — `METROPOLIS`, `Village`, `ARABIC-INSPIRED` — which would
 * otherwise fall through to the initialism rule and be spelled out letter by letter.
 * @type {Readonly<Record<string, 'a' | 'an'>>}
 */
const ARTICLE_BY_LEAD_LOWER = Object.freeze(Object.fromEntries(
  Object.entries(ARTICLE_BY_LEAD).map(([lead, article]) => [lead.toLowerCase(), article]),
));

/**
 * The article the identity sentence takes, decided in six steps: the words the product mints
 * (exactly, then in any casing), the two sound lists, the letter name of an initialism, and
 * finally the written vowel — which now means 'an'.
 *
 * ⚠ THE ONE CLASS IT STILL GETS WRONG, said plainly rather than left to be discovered: an
 * ORDINARY WORD written in full capitals and absent from both sound lists is read as an
 * initialism, so a custom label of "MARKET TOWN" is decided on the name of `M` and comes out
 * "an MARKET TOWN". The two sound lists and the authored map are consulted FIRST precisely to
 * keep the common cases out of that branch (`HONEST`, `HOUR`, `EUROPEAN`, `USA`, `VILLAGE` and
 * every authored culture label are all decided before the letter name is ever asked for), and
 * the alternative — dropping the letter-name rule — is nine wrong articles across the
 * twenty-six single letters and every acronym the product will ever be handed.
 *
 * @param {string} descriptors
 * @returns {'a' | 'an'}
 */
function articleFor(descriptors) {
  const lead = descriptors.split(' ')[0] || '';
  // ⛔ `Object.hasOwn`, NEVER A BARE LOOKUP. `descriptors` carries a user-derived
  // `culturalIdentity.label`, and a plain-object read of it returns Object.prototype's
  // members for a label leading with `constructor`, `toString`, `valueOf` or
  // `hasOwnProperty` - each of them TRUTHY, so the function itself was returned and
  // printed: "X is function Object() { [native code] } constructor village of 9 people."
  if (Object.hasOwn(ARTICLE_BY_LEAD, lead)) return ARTICLE_BY_LEAD[lead];
  const leadLower = lead.toLowerCase();
  if (Object.hasOwn(ARTICLE_BY_LEAD_LOWER, leadLower)) return ARTICLE_BY_LEAD_LOWER[leadLower];
  // ⚠ ANCHORED, AND UNICODE-AWARE. An unanchored run takes the first letters ANYWHERE in
  // the lead, so "8-Isle" was decided on `Isle` and came out "an 8-Isle" - the article has
  // to answer to the character the reader actually says first. ⛔ AND THE CLASS IS `\p{L}`,
  // NOT `[a-z]`: the ASCII spelling treated every accented letter as a SEPARATOR, so
  // "Île-de-France" skipped past `Î` and was decided on `le`, and "Ægir" on `gir` - both
  // consonants, both wrong, and wrong in a way no ASCII test could ever show.
  const raw = lead.match(/^[^\p{L}]*(\p{L}+)/u)?.[1] || '';
  const word = raw.toLowerCase();
  if (VOWEL_SOUND_WORDS.has(word)) return 'an';
  if (CONSONANT_SOUND_WORDS.has(word) || CONSONANT_SOUND_STEMS.test(word)) return 'a';
  // THE INITIALISM, decided on the first letter's NAME. A run written entirely in capitals
  // that neither sound list claims is spelled out by a reader, so `FMG` is "ef-em-gee".
  // ⚠ THE TEST STAYS ASCII ON PURPOSE. `LETTER_NAME_TAKES_AN` holds the names of the
  // twenty-six English letters and can answer for nothing else, so an all-capital run
  // carrying a letter it has no name for - "ÜRÜMQI" - is better read as a WORD and sent to
  // the vowel rule below, which gets it right, than spelled out against a name that does
  // not exist.
  if (/^[A-Z]+$/.test(raw)) return LETTER_NAME_TAKES_AN.has(raw[0]) ? 'an' : 'a';
  // THE DEFAULT, AND THE INVERSION: a vowel LETTER takes 'an' unless something above knew
  // better. This is the line that gets the whole open `un-` class right, and since review 12
  // it asks `VOWEL_LEADS` rather than an ASCII range, so an accented or ligature vowel is a
  // vowel here too.
  return VOWEL_LEADS.has(word[0]) ? 'an' : 'a';
}

/**
 * THE ELEVEN AUTHORED CULTURE PROFILES, each with the phrase the identity sentence
 * carries — KEYED ON THE PROFILE'S IDENTITY (`culturalIdentity.key`), never on its
 * authored prose.
 *
 * A culture profile's `scope` (src/data/cultureProfiles.js) is authored as
 * `<article> <terms> design grammar.`, and the guide used to read the whole string
 * out - "expressed through civic-ritual plaza, tribute, market-and-waterworks design
 * grammar" - which puts the engine's own filing word in front of a reader.
 *
 * ⚠ LIFTING THE TERMS MECHANICALLY IS WHAT THIS REPLACES, AND WHY. Four of the
 * eleven profiles carry ADJECTIVE STACKS in their scope, not noun lists: germanic,
 * norse, east_asian and steppe all modify the head noun the parse was throwing away,
 * so "built around a timber-and-stone and guild-and-estate" came out a dangling
 * modifier. A derived rule cannot tell the two shapes apart, and the shapes are a
 * property of authored copy rather than of the grammar. So the phrase is AUTHORED
 * per profile, once, here - display only.
 *
 * ⛔ AND IT IS KEYED ON THE PROFILE KEY BECAUSE A CORPUS SENTENCE MAY BE MINTED IN
 * EXACTLY ONE SOURCE MODULE (FP-G16, tests/build/cultureProfilesLazy.test.js). This
 * map used to be keyed on the authored scope STRING, which made this file a SECOND
 * mint of the corpus's fingerprint and read the law red. The key is the same identity
 * `domain/resolveCulture.js` reads, `generators/steps/assembleSettlement.js` stamps on
 * the settlement root and `pdf/lib/generationContracts.js` projects; `materializeOne`
 * writes it on EVERY materialized identity beside the scope it replaces, so the read
 * is output-identical to the scope read and no persisted shape changed.
 *
 * ⚠ THE PROPERTY THE STRING KEY BOUGHT IS NOT LOST, IT MOVED. A reworded scope no
 * longer falls out of this map by itself, so tests/domain/settlementQuickGuide.test.js
 * holds the key set BOTH WAYS against the corpus and a digest of each authored scope:
 * reword one and the pin reds, naming the profile whose paraphrase below must be
 * re-read before the digest is re-recorded.
 *
 * ⚠ AND A RECORD WITH NO `key` AT ALL TAKES THE SAME DOOR, WHICH IS THE POINT OF PUTTING
 * THE FALL-THROUGH BELOW A MISSING LOOKUP RATHER THAN BESIDE IT. No writer produces one -
 * `materializeOne` stamps `key` on every identity it makes - but an imported or
 * hand-edited save is not this leaf's to trust, and the answer for it must be a WHOLE
 * SENTENCE. Measured, on a record carrying `label` and `scope` and no `key`: with a
 * historical character it reads "… of 400 people, founded at a ford and never moved.",
 * and without one it stops at the population, which is the same terminal form a
 * settlement carrying no culture at all has always taken. Both are pinned in
 * tests/domain/settlementQuickGuide.test.js.
 *
 * ⛔ THE MIXED PROFILE IS DELIBERATELY ABSENT. `materializeCulturalIdentity`
 * synthesises it at generation time under `key: 'mixed'` - it is not in the corpus -
 * and its scope is a sentence about blending rather than a term list, while its
 * `label` already says "Germanic-inspired + Latin-inspired", so the blend is on the
 * page either way. An unmapped key yields '' and the identity sentence falls through
 * to the historical-character form it already uses for a settlement carrying no
 * culture at all.
 *
 * The map is NOT derived from CULTURE_PROFILES here on purpose: this module is a
 * headless leaf and src/data/cultureProfiles.js is lazily chunked away from the
 * first paint (tests/build/cultureProfilesLazy.test.js). The coverage pin lives in
 * tests/domain/settlementQuickGuide.test.js, which imports the corpus and asserts
 * every authored profile but the blend has a phrase here.
 *
 * @type {Readonly<Record<string, string>>}
 */
const SCOPE_PHRASE = Object.freeze({
  germanic: 'built in timber and stone, and run by guild and estate',
  latin: 'built in masonry around a civic square, and run by patronage and law',
  celtic: 'built around kin districts and an assembly ground, on pasture and earthwork',
  arabic: 'built around courtyards and waterworks, on endowed institutions and the caravan road',
  norse: 'built around the hall and the water, on assembly and what the season allows',
  slavic: 'built in timber compounds on common land, between river and forest',
  east_asian: 'built in wards and courtyards, ordered by bureau and lineage',
  mesoamerican: 'built around a civic-ritual plaza, tribute, and market-and-waterworks',
  south_asian: 'built around the tank and the bazaar, in quarters by trade, under temple and guild',
  steppe: 'built for a pastoral life half-settled and half-moving, held by clan and caravan',
  greek: 'built around the agora and the harbour, on hillside ground and civic association',
});

/**
 * ⛔ `Object.hasOwn`, NEVER A BARE LOOKUP - the hazard `articleFor` above carries,
 * on the same kind of string. The key comes off a PERSISTED record, so a save
 * carrying `key: 'constructor'` (or `toString`, `valueOf`, `hasOwnProperty`) reads
 * Object.prototype's member through a bare index, and every one of them is TRUTHY:
 * the function itself would be printed into the reader's first sentence.
 *
 * @param {string} cultureKey
 * @param {SettlementQuickGuideSource} settlement
 * @returns {string}
 */
function scopePhrase(cultureKey, settlement) {
  if (!Object.hasOwn(SCOPE_PHRASE, cultureKey)) return '';
  if (WATERSIDE_SCOPES.has(cultureKey)) {
    // R-AS (amended): the three waterside scopes read the record's water HERE (chair ruling 5:
    // inland → the inland phrase; a river keeps the Greek harbour; a record with no config reads as
    // it always did), and every atom they declare is a water atom — the branch is their gate.
    // RUNG-2 LANDING phase B (the chair's 10:0x): the inland form goes through the declared
    // channel — a declared inland phrase (`excludes: navigable`) is admitted by the draw only where
    // the record holds no water. Phase C unit 4: all three inland forms declare it (Greek aligned).
    if (isLandlocked(settlement)) {
      return Object.hasOwn(INLAND_SCOPE_PHRASE, cultureKey) ? declaredClause(INLAND_SCOPE_PHRASE[cultureKey], settlement) : '';
    }
    return SCOPE_PHRASE[cultureKey];
  }
  return declaredClause(SCOPE_PHRASE[cultureKey], settlement);
}

/**
 * THE T WIRING (CENSUS-1h unit 6, Appendix B row 95): a printed clause that is a key of
 * `QUICK_GUIDE_SIBLINGS` is resolved against the record it describes; refused with no admitted
 * twin, the clause DROPS (R-AU, kind A) and the sentence is built without it. The facts are read
 * only when the clause declares. Display-time: pages move, records do not.
 * @param {string} clause
 * @param {SettlementQuickGuideSource} settlement
 * @returns {string}
 */
function declaredClause(clause, settlement) {
  const resolved = resolveSibling(clause, QUICK_GUIDE_SIBLINGS, {
    facts: () => factsOf(/** @type {Parameters<typeof factsOf>[0]} */ (settlement)),
    poolId: 'QUICK_GUIDE_CLAUSES',
    surface: 'overview',
    crisisScoped: QUICK_GUIDE_CRISIS_SCOPED.includes(clause),
    dropRefused: true,
  });
  return typeof resolved === 'string' ? resolved : '';
}

/**
 * THE SCOPE PHRASES THAT CLAIM A HARBOUR (soak 1000 row 7, A-11: "Greek-inspired, built around
 * the agora and the harbour" in 43 landlocked settlements). Such a phrase is printed only where
 * the record's own water fact (`waterAccessKind` over `config.terrainType` and
 * `config.tradeRouteAccess`, the world law's rule) says the place has water. Its pool holds no
 * landlocked alternative, so inland the identity sentence takes the plain form (chair ruling T1:
 * no fallback). A record with no config is legacy and unread: the phrase stands as it always did.
 * @type {ReadonlySet<string>}
 */
/**
 * A waterside scope's landlocked form, where one is authored (2026-11-04, under the owner's
 * delegation): the Greek phrase without its harbour. A culture with none takes the plain sentence.
 * The Norse and Slavic forms (RUNG-2 LANDING phase B, the chair's ruling of 2026-11-05 10:0x: the
 * slot was mute in 38 of 98 Norse and 30 of 82 Slavic births on the 1,000) presume no water and
 * no season, and declare it (`excludes: navigable`, `QUICK_GUIDE_SIBLINGS`); the Greek form declares the
 * same since phase C unit 4.
 * @type {Readonly<Record<string, string>>}
 */
const INLAND_SCOPE_PHRASE = Object.freeze({
  greek: 'built around the agora, on hillside ground and civic association',
  norse: 'built around the hall, on kin, oath and the assembly',
  slavic: 'built in timber compounds on land held in common, kin by kin',
});

const WATERSIDE_SCOPES = new Set(['greek', 'norse', 'slavic']); // norse "the hall and the water", slavic "between river and forest" (chair ruling 5)

/** @param {SettlementQuickGuideSource} settlement */
function isLandlocked(settlement) {
  const config = /** @type {{ config?: { terrainType?: string | null, tradeRouteAccess?: string | null } | null }} */ (settlement)?.config;
  if (!config || typeof config !== 'object') return false;
  return waterAccessKind(config.terrainType, config.tradeRouteAccess) === 'none';
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeFoundationTruth(settlement) {
  const statedReason = firstText(settlement.settlementReason);
  const foundingReason = cleanText(settlement.history?.founding?.reason);
  const text = statedReason || foundingReason;

  return fact(
    'foundation',
    'Why it exists',
    text ? sentence(text) : 'Its founding purpose is not recorded.',
    statedReason ? 'settlementReason[0]' : (foundingReason
      ? 'history.founding.reason'
      : 'settlementReason'),
  );
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeAuthorityTruth(settlement) {
  const factions = Array.isArray(settlement.powerStructure?.factions)
    ? settlement.powerStructure.factions
    : [];
  const governing = cleanText(
    settlement.powerStructure?.governingName
      || settlement.powerStructure?.government
      || factions.find((faction) => faction?.isGoverning)?.faction,
  );
  const stability = cleanText(settlement.powerStructure?.stability);

  let text = 'No governing authority is recorded.';
  if (governing && stability) {
    text = `${governing} governs; the balance of power is ${stability.toLowerCase()}.`;
  } else if (governing) {
    text = `${governing} governs.`;
  } else if (stability) {
    text = `The balance of power is ${stability.toLowerCase()}.`;
  }

  return fact(
    'authority',
    'Who holds power',
    text,
    governing
      ? 'powerStructure.governingName'
      : 'powerStructure.stability',
  );
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeMaterialTruth(settlement) {
  const economy = settlement.economicState || {};
  const prosperity = cleanText(
    typeof economy.prosperity === 'object'
      ? economy.prosperity?.tier
      : economy.prosperity,
  );
  const food = cleanText(economy.foodSecurity?.label);
  const topExport = cleanText(firstText(economy.primaryExports));
  const situation = cleanText(economy.situationDesc);

  // The three fields were spliced in as bare labels and joined with "and", which
  // printed the generator's own vocabulary at the reader: "Struggling economy and
  // deficit — active famine food security." Each field becomes a clause of an
  // actual sentence instead. The fields, their precedence and the source path are
  // unchanged — only the rendering.
  const clauses = [];
  if (prosperity) clauses.push(`the economy is ${prosperity.toLowerCase()}`);
  const foodClause = food ? foodSecurityClause(food, settlement) : '';
  if (foodClause) clauses.push(foodClause);

  let text = clauses.length ? upperLead(clauses.join('; ')) : '';
  if (topExport) {
    const exportClause = `Its leading export is ${lowerLead(topExport)}`;
    text = text ? `${sentence(text)} ${exportClause}` : exportClause;
  }

  return fact(
    'material_life',
    'How it lives',
    text
      ? sentence(text)
      : (situation ? sentence(situation) : 'Its material condition is not yet recorded.'),
    text
      ? 'economicState.prosperity|foodSecurity|primaryExports'
      : 'economicState.situationDesc',
  );
}

/**
 * THE SIX LABELS `generateFoodSecurity` CAN EMIT (src/generators/foodGenerator.js),
 * each as the clause a sentence can carry. Keyed by the label lowercased with its
 * dash normalized, so a legacy save's hyphen cannot miss the famine row. A label
 * outside the ladder names itself rather than vanishing.
 *
 * @type {Readonly<Record<string, string>>}
 */
const FOOD_SECURITY_CLAUSE = Object.freeze({
  'deficit - active famine': 'food is in deficit and famine is active',
  deficit: 'food is in deficit',
  'import-dependent': 'the food supply depends on imports',
  pressured: 'the food supply is under pressure',
  surplus: 'there is food to spare',
  secure: 'the food supply is secure',
});

/**
 * THE DECLARED CLAUSES (CENSUS-2d unit 3; Phase A's ledger QUICK_GUIDE_CLAUSES.json), in the
 * dissolved-twin shape keyed by the original's text (R-P 3): SCOPE_PHRASE and FOOD_SECURITY_CLAUSE
 * stay strings for `scopePhrase` / `foodSecurityClause`; the T wiring (CENSUS-1e, Appendix B row
 * 95) resolves a printed clause through `resolveSibling`. The food band's calm clauses are the
 * ledger's `{crisis-scoped}` pool: `crisis: any` with the hunger denial.
 * @type {Readonly<Record<string, ReadonlyArray<Readonly<{ text: string, needs?: string[], excludes?: string[], crisis?: string[] }>>>>}
 */
export const QUICK_GUIDE_SIBLINGS = Object.freeze({
  [SCOPE_PHRASE.norse]: Object.freeze([Object.freeze({ text: SCOPE_PHRASE.norse, needs: ['navigable'] })]),
  // CENSUS-2g unit 7 (R-AY): a self-gated line declares only what `scopePhrase` verifies (the record's
  // water) — the Slavic line's `river` is dropped (and with it its set: it declares nothing), the Greek
  // harbour declares `navigable`, not `coast`.
  // CENSUS-2g unit 7 (the chair's ruling of 09:29, R-G): row 95 drops a refused scope, so each declared
  // scope takes ONE twin that presumes nothing (share: the refused births only — 38 of 92 mesoamerican,
  // 44 of 95 south-asian on the 1,000).
  [SCOPE_PHRASE.mesoamerican]: Object.freeze([
    Object.freeze({ text: SCOPE_PHRASE.mesoamerican, needs: ['market'] }),
    Object.freeze({ text: 'built around a civic-ritual plaza, on tribute and the ritual calendar', twinOf: SCOPE_PHRASE.mesoamerican }),
  ]),
  [SCOPE_PHRASE.south_asian]: Object.freeze([
    Object.freeze({ text: SCOPE_PHRASE.south_asian, needs: ['market', 'institution: temple'] }),
    Object.freeze({ text: 'built around the tank, in quarters by trade and kin', twinOf: SCOPE_PHRASE.south_asian }),
  ]),
  [SCOPE_PHRASE.greek]: Object.freeze([Object.freeze({ text: SCOPE_PHRASE.greek, needs: ['navigable'] })]),
  // RUNG-2 LANDING phase B (the chair's 10:0x): the two inland waterside forms presume NO water —
  // `excludes: navigable`, the very fact `scopePhrase`'s branch reads (R-AY) — so the draw admits
  // them where the sea lines are withheld. Phase C unit 4: the Greek inland form is aligned with
  // them (it declared nothing; 0 of 41 inland Greek births on the 1,000 carry water: no page moves).
  [INLAND_SCOPE_PHRASE.greek]: Object.freeze([Object.freeze({ text: INLAND_SCOPE_PHRASE.greek, excludes: ['navigable'] })]),
  [INLAND_SCOPE_PHRASE.norse]: Object.freeze([Object.freeze({ text: INLAND_SCOPE_PHRASE.norse, excludes: ['navigable'] })]),
  [INLAND_SCOPE_PHRASE.slavic]: Object.freeze([Object.freeze({ text: INLAND_SCOPE_PHRASE.slavic, excludes: ['navigable'] })]),
  [FOOD_SECURITY_CLAUSE.surplus]: Object.freeze([Object.freeze({ text: FOOD_SECURITY_CLAUSE.surplus, excludes: ['crisis: hunger'], crisis: ['any'] })]),
  [FOOD_SECURITY_CLAUSE.secure]: Object.freeze([Object.freeze({ text: FOOD_SECURITY_CLAUSE.secure, excludes: ['crisis: hunger'], crisis: ['any'] })]),
});

/**
 * THE CRISIS-SCOPED FLAGS (CENSUS-2e unit 1, the chair's R-AF): the food band's calm clauses, the ledger's opted
 * pools, by their sibling key. The T wiring passes `crisisScoped: true` for these; the pin is the compose's (R-T).
 * @type {ReadonlyArray<string>}
 */
// CENSUS-2f, R-AH: the surplus and secure clauses write `crisis: any` (no calm line), so the inert flag is dropped.
export const QUICK_GUIDE_CRISIS_SCOPED = Object.freeze([]);

/** @param {string} label @param {SettlementQuickGuideSource} settlement @returns {string} */
function foodSecurityClause(label, settlement) {
  const key = label.toLowerCase().replace(/[\u2013\u2014]/g, '-');
  return Object.hasOwn(FOOD_SECURITY_CLAUSE, key)
    ? declaredClause(FOOD_SECURITY_CLAUSE[key], settlement)
    : `the food supply is ${label.toLowerCase()}`;
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composePressure(settlement) {
  const direct = cleanText(settlement.pressureSentence);
  if (direct) {
    return fact(
      'immediate_pressure',
      'What is urgent',
      sentence(direct),
      'pressureSentence',
    );
  }

  const stressors = Array.isArray(settlement.stressors)
    ? settlement.stressors
    : (Array.isArray(settlement.stress) ? settlement.stress : []);
  const stress = stressors.find(Boolean);
  const stressText = cleanText(
    stress?.summary
      || stress?.description
      || crisisHookFor(settlement, stress)
      || stress?.label
      || stress?.type,
  );
  if (stressText) {
    return fact(
      'immediate_pressure',
      'What is urgent',
      sentence(stressText),
      'stressors[0]',
    );
  }

  const conflicts = Array.isArray(settlement.conflicts)
    ? settlement.conflicts
    : [];
  const conflict = conflicts.find(Boolean);
  const conflictText = cleanText(
    conflict?.desc
      || conflict?.description
      || conflict?.issue
      || conflict?.tension
      || conflict?.stakes,
  );

  return fact(
    'immediate_pressure',
    'What is urgent',
    conflictText
      ? sentence(conflictText)
      : 'No immediate pressure is currently recorded.',
    conflictText ? 'conflicts[0]' : 'pressureSentence',
  );
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuidePerson[]}
 */
function selectImportantPeople(settlement) {
  const npcs = Array.isArray(settlement.npcs) ? settlement.npcs : [];
  return npcs
    .map((npc, index) => ({ npc, index }))
    .filter(({ npc }) => npc && typeof npc === 'object')
    .sort((left, right) => {
      const powerDelta = numericPower(right.npc) - numericPower(left.npc);
      if (powerDelta !== 0) return powerDelta;

      const influenceDelta = influenceRank(left.npc) - influenceRank(right.npc);
      return influenceDelta !== 0 ? influenceDelta : left.index - right.index;
    })
    .slice(0, 3)
    .map(({ npc, index }) => ({
      id: cleanText(npc.id) || `npc-${index + 1}`,
      name: cleanText(npc.name) || 'Unnamed person',
      role: cleanText(npc.role || npc.title) || 'Notable local',
      detail: personDetail(npc),
      sourcePath: `npcs[${index}]`,
    }));
}

/**
 * @param {SettlementQuickGuideSource} settlement
 * @returns {QuickGuideFact}
 */
function composeEntryPoint(settlement) {
  const hook = collectPlotHooks(
    /** @type {Parameters<typeof collectPlotHooks>[0]} */ (settlement),
  )[0];
  if (hook?.text) {
    return fact(
      'entry_point',
      'Where play begins',
      sentence(hook.text),
      `plotHooks:${hook.category || 'unknown'}`,
    );
  }

  const tension = settlement.history?.currentTensions?.find?.(Boolean);
  const tensionText = cleanText(tension?.description || tension?.plotHooks?.[0]);
  return fact(
    'entry_point',
    'Where play begins',
    tensionText
      ? sentence(tensionText)
      : 'No immediate entry point is currently recorded.',
    tensionText
      ? 'history.currentTensions[0]'
      : 'plotHooks',
  );
}

/**
 * @param {QuickGuideNpc} npc
 * @returns {string}
 */
function personDetail(npc) {
  // R11: the ONE choice of what a person is voiced with (tonightSheet.js :: voicedLineOf, the
  // chair's ruling): the goal only when it is voiceable, else the secret, else the temperament.
  const { says, text } = voicedLineOf(/** @type {Parameters<typeof voicedLineOf>[0]} */ (npc));
  if (text && says === 'want') return sentence(`Wants to ${text}`);
  if (text && says === 'secret') return sentence(`Secret: ${lowerLead(text)}`);
  // X-48: the temperament, never the nervous habit (`tell`), which prints nowhere.
  if (text) return sentence(text);

  return 'No immediate agenda is recorded.';
}

/**
 * @param {string} id
 * @param {string} label
 * @param {string} text
 * @param {string} sourcePath
 * @returns {QuickGuideFact}
 */
function fact(id, label, text, sourcePath) {
  return { id, label, text, sourcePath };
}

/** @param {unknown} value @returns {string} */
function cleanText(value) {
  return typeof value === 'string'
    ? value.replace(/\s+/g, ' ').trim()
    : '';
}

/** @param {unknown} value @returns {string} */
function firstText(value) {
  if (Array.isArray(value)) {
    return cleanText(value.find((entry) => cleanText(entry)));
  }
  return cleanText(value);
}

/** @param {unknown} value @returns {number | null} */
function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

/** @param {QuickGuideNpc} npc @returns {number} */
function numericPower(npc) {
  const power = Number(npc?.power);
  return Number.isFinite(power) ? power : 0;
}

/** @param {QuickGuideNpc} npc @returns {number} */
function influenceRank(npc) {
  const influence = cleanText(npc.influence);
  if (influence === 'high' || influence === 'moderate' || influence === 'low') {
    return INFLUENCE_RANK[influence];
  }
  return 3;
}

/** @param {string} value @returns {string} */
function lowerLead(value) {
  return value ? value[0].toLowerCase() + value.slice(1) : '';
}

/** @param {string} value @returns {string} */
function upperLead(value) {
  return value ? value[0].toUpperCase() + value.slice(1) : '';
}

/** @param {string} value @returns {string} */
function sentence(value) {
  const text = cleanText(value);
  if (!text) return '';
  return /[.!?]$/.test(text) ? text : `${text}.`;
}
