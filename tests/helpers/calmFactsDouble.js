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
import { ORDER_FORCE_WORDS } from '../../src/domain/facts/factVocabulary.js';

const CALM = Object.freeze({
  types: Object.freeze([]), kinds: Object.freeze([]), conditionKinds: Object.freeze([]),
  families: Object.freeze([]), active: false, has: () => false,
});

export const CALM_FACTS_ADMIT_ALL = Object.freeze({
  crisis: CALM,
  storesMonths: 12,
  defence: Object.freeze({ walls: true, wallKind: 'stone', palisade: true, gate: true, watch: true, militia: true, garrison: true, hospital: true, healer: true, mercenary: true, court: true, prison: true }),
  guardPresence: true,
  water: Object.freeze({ navigable: true, coast: true, river: true }),
  market: true,
  famine: Object.freeze({ famine: false, starvingAllowed: false, band: 'secure' }),
  magic: Object.freeze({ functions: true, level: 'medium' }),
  hasInstitution: () => true,
  warState: 'peace',
  hasOtherNpc: () => true,
  // R2-CODE-A-14 (the chair's ruling (s1)): the pair atom `shared power`; "every presence atom holds".
  sharesPower: () => true,
  // BAR4-PEOPLE (the chair's TI1): the two pair facts of pairPlace.js, answered so every line is admitted
  sharesPlace: () => true,
  loneTie: () => true,
  // TAIL-TIES (the chair's ruling (T5)): the atom `ruling body`; "every presence atom holds".
  rulingBody: true,
  // CENSUS-5b (2026-11-05): CENSUS-1c's delegated getters (R-E) arrived after the double was
  // written; "every presence atom holds" covers them too (`factsOf.js :: soldiers / commander /
  // faith`), so a sweep over a pool that declares `soldiers` or `priest` measures what it did.
  soldiers: true,
  commander: true,
  faith: Object.freeze({ seniorCleric: Object.freeze({ name: 'X' }), hasChurch: true }), // LAST-DECLARE (2026-11-18, the chair's ruling LR4): the `church` atom (faith.hasChurch) holds too
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
  // BAR4-CORPUS-DEF (2026-11-16): three presence atoms arrived after the double. `magic supply` and `criminal income`
  // (`magicSupply.js`, `criminalIncome.js`): "every presence atom holds" covers them, so a `no X` line is refused here
  // exactly as the kernel sweep's pre-cure reference refuses it (`stateProseKernel.test.js :: excludesPresence`).
  // `danger coming` (`dangerComing.js`) is a TROUBLE, read like the crisis above: a calm place has none on its way.
  dangerComing: false,
  magicSupply: true,
  criminalIncome: true,
  // BAR4-CLOSE-SWEEP (2026-11-16): three more presence atoms arrived after the double, unanswered here (so fail-closed, and
  // the kernel sweep's law 5 drifted on DS-ECO-9's two food-source pools, 36 rows): BAR4-CORPUS-ECO 7354471e5's `source spent`
  // and `own plots` (`leadingSourceSpent.js`, `ownPlots.js`) and BAR4-HOUSES 3cf213071's `timber at hand` (`timberAtHand.js`).
  // "Every presence atom holds" covers them, so a `no X` line is refused here exactly as the pre-cure reference refuses it.
  leadingSourceSpent: true,
  ownPlots: true,
  timberAtHand: true,
  // BAR5-SAFETY (2026-11-16): the `law` band (`lawBand.js`, the Foundations row's `Law & order`) arrived after the double. A calm
  // place's law stands in the row's middle rung, so a line declaring `law: > collapsed` is admitted and its Collapsed twin is not.
  lawBand: 'adequate',
  // BAR5-THINGS (2026-11-16): `legal house` and `appointed post` (`legalHouse.js`, `appointedPost.js`) arrived after the double,
  // and `court` (COHERENCE-AGREE-4's defence atom) was never answered here; "every presence atom holds" covers the three.
  legalHouse: true,
  appointedPost: true,
  // DEBT-1 (2026-11-17): fourteen presence atoms landed in factVocabulary.js after the double's last extension (c74829e25),
  // unanswered here, so fail-closed (the kernel sweep's law 5 drifted on 134 pools; the tie draws lost their permutation):
  // `court sits`, `legacy ruin`, `sovereign`, `seat outranked`, `seat members`, `seat held` (a pair fact; see below), `paid watch`, `monster frontier`, `crime wave`, `rival rings`, `exported` (keyed), `food surplus`,
  // `legitimacy crisis`, `force` (keyed: ORDER_FORCE_WORDS); and the goods since given to `trade at work` (keyed). "Every
  // presence atom holds" covers them, so a `no X` line is refused here exactly as the pre-cure reference refuses it.
  courtSits: true,
  // FAULTS-DESKS (2026-11-18, FR6): `court or gaol` (`factsOf.js :: courtOrGaol`): a calm place keeps a court (above)
  courtOrGaol: true,
  legacyRuin: true,
  sovereign: true,
  seatOutranked: true,
  seatMembers: true,
  // `seat held` is only ever EXCLUDED (BAR6-PEOPLE 10d-seat: the creditor asks for a seat it does not hold; no line needs it),
  // so the place that admits every line is one where the pair holds none, as a calm place has no `danger coming`
  seatHeld: () => false,
  paidWatch: true,
  monsterFrontier: true,
  crimeWave: true,
  rivalRings: true,
  goodExported: () => true,
  growsMoreThanEats: true,
  legitimacyCrisis: true,
  orderForce: Object.freeze(Object.fromEntries(ORDER_FORCE_WORDS.map((k) => [k, true]))),
  tradeAtWork: () => true,
  // …and, as BAR5-THINGS found `court`, three older atoms never answered here that pools in the sweep now declare (BAR6-DEFDESK
  // be35850406: `prison`, above, on the legal chain and the Court + Prison row; BAR6-CULTURE batch 2 21a5f2de1: `imports`,
  // `exports` on DS-GEN-5): a list with something on it holds the presence.
  imports: Object.freeze(['goods']),
  exports: Object.freeze(['goods']),
  // BAR8-DESKS-2 (2026-11-18, ruling BR28 (1)): two presence atoms of the round BAR8 arrived after the double, unanswered here,
  // so fail-closed (the kernel sweep's law 5 drifted on DS-ECO-12 CRITICAL IMPORT): DESKS-ECO's `critical import brought in`
  // (`criticalImportBroughtIn.js`) holds, as every presence atom does; DESKS-DEF's `uprising` (`uprising.js`, a live popular
  // rising) is a TROUBLE, read like `danger coming` above: a calm place has none, so DS-POW-4 Stable v3 (`no uprising`) is
  // admitted (law 5 is byte-identical either way: that pool demotes a dimension and is not swept).
  criticalImportBroughtIn: true,
  uprising: false,
  // FAULTS-NEED (FR2): `need not brought in` (`needNotBroughtIn.js`) is a WANT, read like `uprising` above: a calm place meets
  // its needs, so a line that presumes a good is had is admitted
  needNotBroughtIn: Object.freeze({ luxury: false, spice: false, silk: false, precious: false, salt: false, fuel: false, livestock: false, any: false }),
  // FAULTS-ROWS (FR12 (3)): `fish bought in` (`fishBoughtIn.js`): a calm place lands its own catch, so a line that presumes the
  // day's catch is admitted
  fishBoughtIn: false,
});
