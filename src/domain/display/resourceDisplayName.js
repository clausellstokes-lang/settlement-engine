/**
 * domain/display/resourceDisplayName.js — THE NATIVE-RESOURCE LABEL SEAM.
 *
 * ── WHAT THE BROWSER PASS FOUND, AND WHAT THE CENSUS SAID ────────────────────────────
 * ODQ §934.22's second pass on the consist read the Economics tab's Trade Profile and met
 * this, in one list, on one settlement:
 *
 *   camel_herds · hot_springs_mineral · mountain_timber · clay · spices ·
 *   Quality iron fittings · Salt
 *
 * Three raw catalogue KEYS, two bare lower-case commodity words, and two authored phrases —
 * the reader is being shown the engine's identifiers next to its prose and asked to tell
 * which is which. The census traced every one of them to ONE persisted field,
 * `resourceAnalysis.imports.critical` (`buildViabilityReport`, resourceGenerator.js:243):
 * it is filled from `terrain.mustImport` (bare commodity words, spaced and lower-case) and
 * from `RESOURCE_CHAINS[*].rawResource` (which is sometimes a bare word and sometimes a
 * `RESOURCE_DATA` key). Measured over the 525-config golden corpus: FIFTEEN distinct raw
 * values reach a reader, `metals` on 206 settlements, `hot_springs_mineral` on 203,
 * `mountain_timber` on 52, `clay` on 39, `camel_herds` on 13.
 *
 * ⛔ SO THE CURE IS A READ-TIME SEAM, NOT A GENERATOR FIX, and that is measured rather than
 * preferred. The field is SPREAD ONTO the hashed settlement, so re-spelling it at the
 * producer would move the golden master and strand every saved world on the old spelling —
 * and `availableResourceSatisfies`, `tokensReconcile` and `resourceKeyForLabel` all MATCH
 * against these very strings. The same line `institutionDisplayName.js` draws, for the same
 * reason: a PRINT goes through the seam, a MATCH never does.
 *
 * ⛔ IT DOES NOT IMPORT THE CATALOGUE, DELIBERATELY, and this is the one place a reader will
 * want to argue. `src/domain/resourceSemantics.js` already holds `RESOURCE_DATA` and a
 * key/label resolver, so importing it would spare the table below. It would also put
 * `src/data/resourceData.js` (plus `customContentSemanticAuthority.js`) inside the PDF
 * worker bundle the moment `src/pdf` calls this seam — a bundle whose ceiling was raised by
 * measurement four days ago (§934.19) and is priced on every gate run by
 * tests/build/vendorPdfLazy.test.js. `institutionDisplayName.js` refused the same edge for
 * the same reason and paid the same price: the table is NOT the runtime source of the
 * enumeration, it is the TEST's, and tests/lint/resourceLabelSeam.census.test.js re-derives
 * every row from `RESOURCE_DATA` and reds if one falls behind. The duplication cannot go
 * quiet.
 *
 * ── CASE IS THIS MODULE'S JOB, UNLIKE THE INSTITUTION SEAM ───────────────────────────
 * The institution catalogue is authored in sentence case throughout ('Parish church',
 * 'Monastery or friary'), so its seam could leave case alone. The RESOURCE catalogue is not:
 * it carries 'Fishing Grounds' and 'Salt Flats' beside 'Stone quarry', and the raw values
 * that reach the same list are lower-case ('iron ore', 'animal hides'). Three casings in one
 * pill row. So every value leaves here through the ladder's own `tokenCase` — rung 3,
 * sentence case, estate initialisms preserved word-wise — which is the case the owner named
 * as correct when they quoted 'Quality iron fittings' and 'Salt' as the labels the raw keys
 * sat beside.
 *
 * @enforced-by tests/lint/resourceLabelSeam.census.test.js
 */
import { tokenCase } from './labelCase.js';

/**
 * EVERY `RESOURCE_DATA` KEY → ITS AUTHORED LABEL, transcribed from
 * `src/data/resourceData.js`. Thirty-three rows; the census re-derives all of them and reds
 * on a missing, extra or disagreeing row, so this cannot silently fall behind the catalogue.
 *
 * ⚠ THE LABELS ARE COPIED VERBATIM, IN THE CATALOGUE'S OWN CASE, and re-cased on the way
 * OUT rather than here — so a reader diffing this table against `resourceData.js` compares
 * like with like, and the case rule stays in exactly one place.
 * @type {Readonly<Record<string, string>>}
 */
export const RESOURCE_DISPLAY_LABELS = Object.freeze({
  fishing_grounds:      'Fishing Grounds',
  salt_flats:           'Salt Flats',
  deep_harbour:         'Deep Natural Harbour',
  shipbuilding_timber:  'Coastal Timber',
  river_mills:          'Mill Sites',
  river_clay:           'Clay Deposits',
  fertile_floodplain:   'Fertile Floodplain',
  river_fish:           'River Fisheries',
  hunting_grounds:      'Hunting Grounds',
  managed_forest:       'Managed Woodland',
  foraging_areas:       'Wild Foraging Areas',
  ancient_grove:        'Ancient Grove',
  grain_fields:         'Extensive Grain Fields',
  grazing_land:         'Open Grazing Land',
  crossroads_position:  'Strategic Crossroads',
  iron_deposits:        'Iron Ore Deposits',
  stone_quarry:         'Stone quarry',
  precious_metals:      'Precious Metal Veins',
  gemstone_deposits:    'Gemstone Deposits',
  coal_deposits:        'Coal or Peat Deposits',
  ancient_ruins:        'Ancient Ruins',
  hot_springs:          'Hot Springs / Healing Waters',
  magical_node:         'Magical Ley Line Node',
  defended_pass:        'Mountain Pass',
  marshlands:           'Marshlands',
  oasis_water:          'Oasis and Water Rights',
  date_palms:           'Date Palms and Orchards',
  glass_sand:           'Fine Glass Sand',
  desert_salt:          'Salt Pans',
  camel_herds:          'Camel Herds',
  alpine_pasture:       'Alpine Pastures',
  mountain_timber:      'Mountain Timber',
  hot_springs_mineral:  'Mineral Hot Springs',
});

/**
 * The key form of an arbitrary value: lower-cased, and SPACES READ AS UNDERSCORES.
 *
 * ⭐ THE SPACE RULE IS NOT COSMETIC, and it was measured before it was written. One
 * generated town's critical-imports list carried BOTH `'glass sand'` (from
 * `terrain.mustImport`) and `'glass_sand'` (from a chain's `rawResource`) — one resource,
 * two spellings, in one pill row. Folding the separator makes the two resolve to the one
 * label instead of printing as two different things the settlement is short of.
 *
 * ⛔ IT DOES NOT FUZZY-MATCH, and `resourceSemantics.js` says why at its own resolver: a
 * "best word overlap" made the answer depend on catalogue ORDER, so 'Coastal Timber' could
 * resolve to `managed_forest`. An unrecognised value is returned as itself, cased.
 * @param {string} value
 * @returns {string}
 */
function keyForm(value) {
  return value.trim().toLowerCase().replace(/\s+/g, '_');
}

/**
 * The label a reader should see for a native resource, a terrain-critical import, or any
 * other value drawn from that family.
 *
 * Anything the catalogue does not name passes through `tokenCase` UNCHANGED IN WORDS — so an
 * authored phrase ('Bulk grain and flour', 'Quality iron fittings') and the user's own
 * custom resource keep their words, and only the case is made one.
 *
 * @param {unknown} value a resource key, an authored label, or a bare commodity word
 * @returns {string} the label a reader sees, or '' for nothing
 */
export function resourceDisplayName(value) {
  if (typeof value !== 'string' || value.trim() === '') return '';
  const authored = RESOURCE_DISPLAY_LABELS[keyForm(value)];
  return /** @type {string} */ (tokenCase(authored ?? value.trim()));
}

export default resourceDisplayName;
