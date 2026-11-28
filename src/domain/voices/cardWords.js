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
 *
 * Pure data and one reader. Imports nothing.
 * @enforced-by tests/domain/voices/voicePlan.test.js
 */

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
});

/**
 * @param {string} word @param {string | null | undefined} catalogId the card's house's catalogue id
 * @returns {boolean}
 */
export function cardWordHolds(word, catalogId) {
  return !!catalogId && Object.hasOwn(CARD_WORDS, word) && CARD_WORDS[word].includes(catalogId);
}
