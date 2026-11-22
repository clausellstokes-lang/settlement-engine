/**
 * A `factsOf`-shaped test double for a CALM place that holds every presence fact (CENSUS-5,
 * 2026-11-05). The kernel reads a pool whose lines declare fact atoms only against `facts`
 * (`stateProseKernel.js :: eligibleVariants`, law 5 generalised: fail-closed), and every desk
 * hands `factsOf(record)` in at its entry (`facts/factsAnswered.js`). A sweep that calls the
 * kernel directly and means "the state this pool is about, nothing else in the way" hands THIS:
 * no crisis is active, every presence atom holds, so every declared line is admitted and the
 * sweep measures exactly what it measured before any pool declared. A sweep that means to test
 * the gate itself births a real record and hands `factsOf(record)` instead.
 */
const CALM = Object.freeze({
  types: Object.freeze([]), kinds: Object.freeze([]), conditionKinds: Object.freeze([]),
  families: Object.freeze([]), active: false, has: () => false,
});

export const CALM_FACTS_ADMIT_ALL = Object.freeze({
  crisis: CALM,
  storesMonths: 12,
  defence: Object.freeze({ walls: true, wallKind: 'stone', palisade: true, gate: true, watch: true, militia: true, garrison: true, hospital: true, healer: true, mercenary: true }),
  guardPresence: true,
  water: Object.freeze({ navigable: true, coast: true, river: true }),
  market: true,
  famine: Object.freeze({ famine: false, starvingAllowed: false, band: 'secure' }),
  magic: Object.freeze({ functions: true, level: 'medium' }),
  hasInstitution: () => true,
  warState: 'peace',
  hasOtherNpc: () => true,
  // CENSUS-5b (2026-11-05): CENSUS-1c's delegated getters (R-E) arrived after the double was
  // written; "every presence atom holds" covers them too (`factsOf.js :: soldiers / commander /
  // faith`), so a sweep over a pool that declares `soldiers` or `priest` measures what it did.
  soldiers: true,
  commander: true,
  faith: Object.freeze({ seniorCleric: Object.freeze({ name: 'X' }) }),
  // CENSUS-5c (2026-11-05): CENSUS-3b's `crime` getter (R-E); "every presence atom holds" makes
  // `organised crime` hold, so the band reads its top rung (`factVocabulary.js :: CRIME_WORDS`).
  crime: 'organized',
  // CENSUS-5d (2026-11-05): CENSUS-1f's composite `sacredHouse` (R-AE); "every presence atom holds".
  sacredHouse: true,
  // LANDING-R2 (2026-11-07): the food-source atoms (`fish`, `grain`, `game`, `livestock`; census-3c unit 4, e3295d168) and
  // `guild` (census-3f unit 3 525084dfe / census-3g unit 2 b6caa5e1a) arrived after the double; "every presence atom
  // holds" covers them too (`factVocabulary.js :: FOOD_SOURCE_ATOMS`, `guild`).
  foodSources: Object.freeze(['fish', 'grain', 'game', 'livestock']),
  guild: true,
});
