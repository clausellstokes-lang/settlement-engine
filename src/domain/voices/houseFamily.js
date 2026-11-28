/**
 * domain/voices/houseFamily.js — A HOUSE'S FAMILY, as the voices' lines are keyed (S-G1; VOICES-LINES' `survey/lines/A-keys.md`
 * §1 and its addendum, as the chair ruled L-1 to L-4: `blades` merged into `watch`; the healer family is `care`, holding the
 * almshouse and the foundling home; the brewery and the brewer are `workshop`; the listening post is `watch`).
 *
 *   houseFamilyOf(inst)   'workshop' | 'market' | 'temple' | 'inn' | 'hall' | 'watch' | 'grain' | 'learning' | 'field' | 'show'
 *                         | 'pit' | 'care' | 'water', or a SILENT family: 'criminal' | 'works' | 'exotic' | 'access'
 *
 * A Government row is the seat's own (`hall`); any other by name first (the rules below, first match wins, in this order),
 * else by the catalogue category. A silent family's
 * card never speaks: a criminal house (no public mouth names it), the works of the place (water, housing, sewers: no
 * keeper), an exotic house (too few to write for), and an "Access to …" row (no house in the place).
 *
 * Pure: no randomness, no clock, no write. Imports nothing.
 * @enforced-by tests/domain/voices/voicePlan.test.js
 */

/** The families a line may be keyed on. */
export const SPEAKING_FAMILIES = Object.freeze(['workshop', 'market', 'temple', 'inn', 'hall', 'watch', 'grain', 'learning',
  'field', 'show', 'pit', 'care', 'water']);
/** The families whose cards stay the surveyor's alone. */
export const SILENT_FAMILIES = Object.freeze(['criminal', 'works', 'exotic', 'access']);

/** @type {ReadonlyArray<readonly [string, RegExp]>} by name, first match wins */
const BY_NAME = Object.freeze([
  ['access', /^access to /i],
  ['works', /dwellings|housing|water source|sewage|aqueduct|water infrastructure|water system/i],
  ['care', /hospital|apothecar|midwife|healer|alchemist|almshouse|foundling/i],
  ['learning', /library|sage|scribe|printing|cartographer|chronicler|wizard|mage|enchanter|academy|planar|teleportation/i],
  ['watch', /watch\b|garrison|militia|levy|walls|citadel|barracks|warden|palisade|earthworks|gates|fortification|listening post|mercenar|free company|hired blades|adventurer|hireling|veteran/i],
  ['temple', /church|cathedral|monaster|friary|shrine|grove|burial|graveyard|cemetery|charnel|priest|druid/i],
  ['pit', /\bmine\b|quarry|salt works|peat|charcoal|woodcutter|sawmill|smelter/i],
  ['grain', /\bmills?\b|baker|granar|root cellar|maltster/i],
  ['water', /fish|landing|docks|harbour|ferry|boatyard|shipyard|barge/i],
  ['field', /farm|grazing|shepherd|dairy|beekeeper|hunter|wildfowler|beast trainer|furrier/i],
  ['show', /theat|arena|colosseum|fighting pit|gladiator|gambling|performer|musician|bardic|brothel|red light|opera|fortune teller/i],
  ['market', /market|fair|merchant|warehouse|auction|bank|money changer|\bmint\b|assay|customs|pawnbroker|exchange|trade center|supply/i],
  ['inn', /\binns?\b|tavern|alehouse|ale house|bathhouse|stable|post relay|toll bridge|carrier|caravanserai|waystation|caravaneer|coaching|pack animal/i],
  ['hall', /\bhall\b|court|prison|stocks|workhouse|crier|palace|reeve|steward|elder|headman|council|mayor|governor|administration|assembly|royal seat|oligarchy|appointee/i],
]);

/** @type {Readonly<Record<string, string>>} the catalogue category's family, where no name rule answers */
const BY_CATEGORY = Object.freeze({
  Economy: 'market', Crafts: 'workshop', Religious: 'temple', Government: 'hall', Infrastructure: 'hall', Defense: 'watch',
  Adventuring: 'watch', Entertainment: 'show', Magic: 'learning', Criminal: 'criminal', Exotic: 'exotic',
});

/**
 * A house's family. A criminal or exotic house is silent by its category before any name is read.
 * @param {{ name?: unknown, category?: unknown } | null | undefined} inst
 * @returns {string | null} null for no house
 */
export function houseFamilyOf(inst) {
  if (!inst || typeof inst !== 'object') return null;
  const category = typeof inst.category === 'string' ? inst.category : '';
  if (category === 'Criminal') return 'criminal';
  if (category === 'Exotic') return 'exotic';
  if (category === 'Government') return 'hall'; // the seat's own forms ("Merchant oligarchy", "Guild consortium")
  const name = typeof inst.name === 'string' ? inst.name : '';
  for (const [family, re] of BY_NAME) if (re.test(name)) return family;
  return Object.hasOwn(BY_CATEGORY, category) ? BY_CATEGORY[category] : 'workshop';
}
