/**
 * domain/facts/causeHouses.js — THE HOUSES A TROUBLE'S CAUSE NAMES STAND (PAGE-7, the brief CAUSES-DATA at 9e4ba24b6 and
 * the chair's rulings of 15:18; `docs/DESIGN_POOL_CENSUS.md` §1: ONE FACT, ONE HOME). A leaf, named in the
 * `factsOf` getter `causeHouses` (addendum 3; its layer row in `factLayers.js`); the vocabulary's `house: thieves_guild` and
 * `house: smuggling` read it there, and `display/tensionCauseHolds.js` reads it here.
 *
 *   causeHouseStands(record, key)   a house of the group `key` stands on the LIVE roster (`institutionRoster.js ::
 *                                   liveInstitutions`: a ruined, removed, destroyed or remnant house is no cause), BY ITS
 *                                   CATALOGUE IDENTITY: its native name (`nativeSemanticName`, '' for a DM's own house, so
 *                                   a custom house is never matched by its name) is one of the catalogue's own names for
 *                                   the group, exactly. "Black Market Tavern" is no black market.
 *
 * THE GROUPS are the houses `measures/page-5/sim.mjs`'s `inst` patterns found in the catalogue
 * (`data/institutionalCatalog.js`), copied so that this leaf does not carry the catalogue; the guard pins each copy to the
 * catalogue both ways (`tests/domain/facts/causeHouses.test.js`). The docks are not here: a house that keeps ships is the
 * institutions home's `docks` (`institutions.js :: hasInstitution`), read there.
 *
 * Layer 1 (over the roster). Pure: no randomness, no clock, no write.
 * @enforced-by tests/domain/facts/causeHouses.test.js
 */
import { liveInstitutionNames } from './liveInstitutionNames.js';

/**
 * group → the catalogue's own names of its houses (lower case), each a KEY of its row (a name, never a line).
 * @type {Readonly<Record<string, Readonly<Record<string, true>>>>}
 */
const NAMES = Object.freeze({
  // the crime houses (HIDEABLE: the security reader's list, `data/tensionCauses.js`)
  thievesGuild: { "thieves' guild chapter": true, "thieves' guild (powerful)": true },
  smuggling: { 'smuggling waypoint': true, 'smuggling operation': true, 'smuggling network': true },
  underground: { 'underground network': true, 'underground city': true },
  assassins: { 'contract killer': true, "assassins' guild": true },
  blackMarket: { 'black market': true, 'black market bazaar': true },
  whisperMarket: { 'whisper market': true },
  outlaws: { 'local fence': true, 'fence (word of mouth)': true, 'outlaw shelter': true, 'bandit affiliate': true },
  // the houses where trade passes (the guild's quarrel)
  caravans: { caravanserai: true, "caravaneer's post": true, "caravan masters' exchange": true },
  fair: { 'annual fair': true, 'major annual fairs': true },
  exchange: { 'international trade center': true, 'auction house': true, 'money changers': true },
  luxuryQuarter: { 'luxury goods quarter': true },
});

/** group → the set of its houses' names. @type {Readonly<Record<string, ReadonlySet<string>>>} */
export const CAUSE_HOUSES = Object.freeze(Object.fromEntries(
  Object.entries(NAMES).map(([group, names]) => [group, Object.freeze(new Set(Object.keys(names)))])));

/** The groups a reader may ask. @type {ReadonlyArray<string>} */
export const CAUSE_HOUSE_GROUPS = Object.freeze(Object.keys(CAUSE_HOUSES));

/**
 * Every group at once, for `factsOf(record).causeHouses` (the vocabulary's `house: <key>` reads its group here).
 * @param {{ institutions?: unknown } | null | undefined} record
 * @returns {Readonly<Record<string, boolean>>}
 */
export function causeHousesOf(record) {
  return Object.freeze(Object.fromEntries(CAUSE_HOUSE_GROUPS.map((g) => [g, causeHouseStands(record, g)])));
}

/**
 * THE ONE READER.
 * @param {{ institutions?: unknown } | null | undefined} record a settlement record (or the document in hand)
 * @param {string} key a key of CAUSE_HOUSES
 * @returns {boolean}
 */
export function causeHouseStands(record, key) {
  const names = CAUSE_HOUSES[key];
  if (!names) throw new Error(`causeHouseStands: unknown house group '${key}'`);
  return liveInstitutionNames(record).some((n) => names.has(n.trim().toLowerCase()));
}
