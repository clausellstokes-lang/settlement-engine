/**
 * domain/facts/causeHouses.js — THE HOUSES A TROUBLE'S CAUSE NAMES STAND (PAGE-7, the brief CAUSES-DATA at 9e4ba24b6 and
 * the chair's rulings of 15:18; `docs/DESIGN_POOL_CENSUS.md` §1: ONE FACT, ONE HOME). A new leaf, named in no getter of
 * `factsOf` (its layer row is the facts' owners'); `display/tensionCauseHolds.js` reads it here.
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

/** group → the catalogue's own names of its houses (lower case). @type {Readonly<Record<string, ReadonlySet<string>>>} */
export const CAUSE_HOUSES = Object.freeze({
  // the crime houses (HIDEABLE: the security reader's list, `data/tensionCauses.js`)
  thievesGuild: Object.freeze(new Set(["thieves' guild chapter", "thieves' guild (powerful)"])),
  smuggling: Object.freeze(new Set(['smuggling waypoint', 'smuggling operation', 'smuggling network'])),
  underground: Object.freeze(new Set(['underground network', 'underground city'])),
  assassins: Object.freeze(new Set(['contract killer', "assassins' guild"])),
  blackMarket: Object.freeze(new Set(['black market', 'black market bazaar'])),
  whisperMarket: Object.freeze(new Set(['whisper market'])),
  outlaws: Object.freeze(new Set(['local fence', 'fence (word of mouth)', 'outlaw shelter', 'bandit affiliate'])),
  // the houses where trade passes (the guild's quarrel)
  caravans: Object.freeze(new Set(['caravanserai', "caravaneer's post", "caravan masters' exchange"])),
  fair: Object.freeze(new Set(['annual fair', 'major annual fairs'])),
  exchange: Object.freeze(new Set(['international trade center', 'auction house', 'money changers'])),
  luxuryQuarter: Object.freeze(new Set(['luxury goods quarter'])),
});

/** The groups a reader may ask. @type {ReadonlyArray<string>} */
export const CAUSE_HOUSE_GROUPS = Object.freeze(Object.keys(CAUSE_HOUSES));

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
