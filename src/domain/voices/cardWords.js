/**
 * domain/voices/cardWords.js — A CARD-LEVEL WORD, ANSWERED BY THE CARD (S-G1; the eleventh chair's ruling G1-1 point 2:
 * "a card-level word is answered by the card, not by a new atom").
 *
 * Some of the writer's `needs` words name what KIND of house the card is (a mill, not a granary; a church that buries,
 * not a wayside shrine; a force that keeps weapons, not a wall). The vocabulary's atoms are the TOWN's, so none can say
 * what one card is. The card answers it from its OWN identity: the house's CATALOGUE ID, against the ids each word holds
 * for below, every id read off the catalogue (`data/institutionalCatalog.js`; the leaf's test holds each to it), never
 * off a name's spelling. A custom house (no catalogue id) answers no card word. A version that names a card word is
 * eligible on a card only where every card word it names holds.
 *
 *   cardWordHolds(word, catalogId)   true where the catalogue id is one the word holds for
 *   cardNotHolds(word, catalogId)    true where the house is known and is NOT one the negated word names (G1-9)
 *   powerWordHolds(word, archetype)  true where the power card's kind holds the word (G1-9)
 *   cardAdmits(version, card)        every word a version names holds for its card
 *
 * Pure data and one reader. Imports nothing.
 * @enforced-by tests/domain/voices/voicePlan.test.js
 */

/** the inn family's houses that serve food and drink (writer B's list, G1-9) */
const FOOD_AND_DRINK = Object.freeze(['wayside_inn', 'alehouse', 'ale_house', 'travelers_inn', 'inn_multiple', 'taverns_5_20', 'coaching_inn',
  'inns_and_taverns_district', 'caravanserai', 'waystation']);

/** @type {Readonly<Record<string, ReadonlyArray<string>>>} the word → the catalogue ids it holds for */
export const CARD_WORDS = Object.freeze({
  // a healer, an apothecary or a hospital (not an almshouse or a foundling home)
  medicine: Object.freeze(['apothecary', 'apothecary_established', 'apothecary_district', 'small_hospital', 'major_hospital',
    'hospital_network', 'healer_divine_1st_level', 'midwife']),
  // farmland or grazing (not a hunter or a beast trainer)
  fences: Object.freeze(['subsistence_farming', 'farmland', 'common_grazing_land', 'shepherd', 'shepherd_collective', 'dairy_farmer']),
  // a mill or a bakery (not a granary or a root cellar)
  'flour or bread': Object.freeze(['mill', 'mills_2_5', 'bakers_5_15']),
  // a hall with a staff: the seat's offices and the courts
  clerks: Object.freeze(['town_hall', 'city_hall', 'courthouse', 'multiple_courthouses', 'multiple_court_buildings', 'city_administration',
    'palace_government_complex', 'royal_seat', 'town_council', 'mayor_and_council', 'city_state_government']),
  // a church, a churchyard or a burial ground (not a shrine or a grove)
  burials: Object.freeze(['parish_church', 'parish_churches_2_5', 'parish_churches_10_30', 'parish_churches_50_100', 'cathedral_10_000_only',
    'great_cathedral', 'burial_ground', 'graveyard', 'parish_burial_grounds', 'burial_grounds_and_charnel_house', 'cemetery_network']),
  // a house that marries: a church and its priest
  weddings: Object.freeze(['parish_church', 'parish_churches_2_5', 'parish_churches_10_30', 'parish_churches_50_100', 'cathedral_10_000_only',
    'great_cathedral', 'priest_resident']),
  // a force (not walls or a palisade)
  'weapons kept': Object.freeze(['village_watch', 'town_watch', 'professional_city_watch', 'garrison', 'multiple_garrisons', 'barracks',
    'citadel', 'citizen_militia', 'household_levy', 'free_company_hall', 'mercenary_quarter', 'hired_blades', 'warden_s_lodge']),
  // a fishing house (not a ferry or a boatyard)
  fish: Object.freeze(['fishing_community', 'fisher_s_landing', 'fishmonger', 'fish_market']),
  // THE SECOND LINES (writer B; the chair's ruling G1-9): the inn family's houses by what they serve, the ids exactly as B
  // lists them (`survey/lines-2/INN-CARD-B.tsv`, read off houseFamilyOf over the catalogue). A stable, a toll bridge, a
  // carrier, a pack-animal trader or a stable district holds none of them.
  // a house that beds travellers
  lodging: Object.freeze(['wayside_inn', 'caravanserai', 'travelers_inn', 'waystation', 'inn_multiple', 'coaching_inn', 'post_relay_station',
    'inns_and_taverns_district']),
  // a house that serves food and drink
  'food and drink': Object.freeze(FOOD_AND_DRINK),
  // a house where people sit and talk: the food-and-drink houses and the bathhouse
  company: Object.freeze([...FOOD_AND_DRINK, 'public_bathhouse']),
});

/**
 * THE NEGATED HOUSE WORDS (writer B; the chair's ruling G1-9): `card-not: <word>`. A version so marked prints only on a house
 * whose catalogue id is OUTSIDE the word's ids; a custom house (no catalogue id) is not known not to, so it is refused.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const CARD_NOT_WORDS = Object.freeze({
  // a house that works its good itself: it is short of what it digs, cuts, catches or grows, never of a delivery
  'digs or grows its own': Object.freeze(['mine', 'mine_open_cast', 'stone_quarry', 'salt_works', 'peat_cutter', 'woodcutter_s_camp',
    'fishing_community', 'fisher_s_landing', 'subsistence_farming', 'farmland', 'common_grazing_land', 'shepherd', 'shepherd_collective',
    'dairy_farmer', 'hunter_s_lodge', 'beekeeper', 'wildfowler']),
});

/**
 * THE POWER-KIND WORDS (writer A; the chair's ruling G1-9): a power card answers from its KIND, the canonical archetype the
 * card reads through `domain/factionArchetypes.js :: factionArchetype` (the stored category first, the name after;
 * `cardsOf.js` puts it on the card as `archetype`). Point 124's K3 will make that reader's NAME fallback read `kindNameOf`;
 * these words read whatever `factionArchetype` returns. `any`: the kinds that hold it; `not`: the kinds that refuse it.
 * @type {Readonly<Record<string, Readonly<{ any?: ReadonlyArray<string>, not?: ReadonlyArray<string> }>>>}
 */
export const POWER_WORDS = Object.freeze({
  // members, dues and meetings: never military, occupation, criminal, noble, outsider or other
  'a body with members and meetings': Object.freeze({ any: Object.freeze(['government', 'civic', 'merchant', 'craft', 'labor', 'religious', 'arcane']) }),
  // an occupier is not shut out of the decisions it makes
  'not an occupier': Object.freeze({ not: Object.freeze(['occupation']) }),
  // old-fashioned ways only where the power's nature is so: elders, an old faith, a noble house
  'an old order': Object.freeze({ any: Object.freeze(['noble', 'religious', 'civic']) }),
});

/**
 * @param {string} word @param {string | null | undefined} catalogId the card's house's catalogue id
 * @returns {boolean}
 */
export function cardWordHolds(word, catalogId) {
  return !!catalogId && Object.hasOwn(CARD_WORDS, word) && CARD_WORDS[word].includes(catalogId);
}

/**
 * @param {string} word @param {string | null | undefined} catalogId
 * @returns {boolean} true where the house is known (a catalogue id) and is NOT one the negated word names
 */
export function cardNotHolds(word, catalogId) {
  return !!catalogId && Object.hasOwn(CARD_NOT_WORDS, word) && !CARD_NOT_WORDS[word].includes(catalogId);
}

/**
 * @param {string} word @param {string | null | undefined} archetype the power card's kind (`factionArchetype`)
 * @returns {boolean}
 */
export function powerWordHolds(word, archetype) {
  if (!archetype || !Object.hasOwn(POWER_WORDS, word)) return false;
  const w = POWER_WORDS[word];
  if (w.any && !w.any.includes(archetype)) return false;
  if (w.not && w.not.includes(archetype)) return false;
  return true;
}

/**
 * Whether a version fits a card: every house word it names holds for the card's catalogue id, every negated house word
 * holds, and every power word holds for the card's kind.
 * @param {{ card?: ReadonlyArray<string>, cardNot?: ReadonlyArray<string>, power?: ReadonlyArray<string> }} version
 * @param {{ catalogId?: string | null, archetype?: string | null }} card
 * @returns {boolean}
 */
export function cardAdmits(version, card) {
  return (version.card || []).every((w) => cardWordHolds(w, card.catalogId))
    && (version.cardNot || []).every((w) => cardNotHolds(w, card.catalogId))
    && (version.power || []).every((w) => powerWordHolds(w, card.archetype));
}
