/**
 * domain/coherence/hookTruth.js — DOES A PLOT HOOK SAY SOMETHING TRUE OF THIS PLACE?
 *
 * THE LEAF. It reads a settlement record and classifies one sentence against it, and it
 * imports nothing from the dossier layer — which is what lets the display collector
 * (`src/domain/dossier/plotHooks.js`) and the standalone check
 * (`src/domain/coherence/hookTruthFindings.js`, which must import the collector to read the
 * rendered page) both use ONE classifier without a cycle between them.
 *
 * THE DEFECT (docs/GENERATION_ROOT_CAUSES_2026-11-02.md, trace 1 "Food says several things
 * at once" and trace 4 "Garrisons, walls and hospitals that do not exist"): a hook writer
 * prints one fixed sentence whenever a condition holds, and the condition is not the fact
 * the sentence claims. Measured on this lane's 120-settlement corpus (twenty per tier,
 * seeds `hooks-lane-2026-11-03-<tier>-<i>`), BEFORE any change:
 *   - 42 of 120 settlements read "The settlement is starving. Villagers are turning to
 *     banditry…", and 36 of those 42 are places the engine's own food analysis calls
 *     Import-Dependent with 1.9 months of grain in store. One pound short is enough for
 *     the sentence; the band and the stores are never read.
 *   - 5 of 5 hooks that print "N days of food left / reserves" print the HARVEST SHARE
 *     × 30, not the store: a metropolis with 15 months of grain reads "12 days".
 *   - 21 hooks call the residents of a town, city or metropolis "villagers".
 *   - 4 hooks name "their soldiers" where the record holds no garrison, militia or
 *     mercenary company.
 *
 * WHAT THIS MODULE IS: a reader and a classifier, nothing else. `settlementHookFacts`
 * reads the facts a hook could lie about out of the record as it exists today;
 * `hookTruthViolations` says which of those facts one sentence contradicts. It never
 * rewrites a hook and never scores one — the two callers decide what to do with a finding
 * (the collector drops or rewords; the certification receipt reports).
 *
 * THE CLASSIFIER ONLY EVER SPEAKS WHEN THE RECORD POSITIVELY CONTRADICTS THE SENTENCE.
 * A fixture with no `economicState` is not a fed settlement, it is a settlement whose food
 * is unknown, and an unknown fact licenses nothing: every predicate below is written so
 * that a missing field means NO finding. That is what keeps this module from moving a
 * surface whose fixture never carried the fact in the first place.
 *
 * PURE: no rng, no clock, no store, no React. @see docs/GENERATION_CONTRACTS.md
 */

import { FOOD_SECURITY_BANDS } from '../../data/bandLadders.js';
import { speakTierNoun } from '../display/stateProse/tierVoice.js';
import { foodLedger } from '../foodLedger.js';
import { isLiveInstitution } from '../institutions/institutionRoster.js';
import { tierNounFor } from '../display/stateProse/weaveBlock.js';
import { magicWorksAt } from '../worldPulse/magicWorksAt.js';

/**
 * The bands that license a famine sentence, and the bands that are a real gap short of
 * one — taken from the estate's OWN label ladder (`src/data/bandLadders.js ::
 * FOOD_SECURITY_BANDS`), never re-spelled.
 *
 * ⚠ RE-SPELLING THEM IS HOW THIS CURE NEARLY MISSED ITS OWN TARGET. The first draft
 * compared against the hand-written 'Active Famine'; the band the record actually carries
 * is 'Deficit — Active Famine', so the set would have matched no famine in the estate and
 * the gate would have leaned on a second field to license the one sentence it must allow.
 * Measured on the lane's corpus: 4 of the 6 licensed famines carry exactly that label.
 * @type {ReadonlySet<string>}
 */
const CRISIS_BANDS = new Set([FOOD_SECURITY_BANDS.famine.label, FOOD_SECURITY_BANDS.deficit.label]);

/** @type {ReadonlySet<string>} */
const GAP_BANDS = new Set([FOOD_SECURITY_BANDS.pressured.label, FOOD_SECURITY_BANDS.importDependent.label]);

/**
 * "The stored months are low" (the chair's ruling, 2026-11-03), as a number.
 *
 * TWO MONTHS, and the figure is the engine's own vocabulary rather than a taste: the food
 * record prints `storageNote` as "N months strategic reserve", and a place that can eat
 * for two more months is not a place whose people are turning to banditry this week. Every
 * one of the 36 measured false "starving" hooks sat at 1.9 months — deliberately NOT below
 * this floor, so the cure cannot be read as a threshold tuned to its own corpus: those 36
 * are refused on the BAND (Import-Dependent is not a famine), and the floor is what stops
 * a genuine Deficit place with fifteen months of grain reading as starving.
 */
export const LOW_STORED_MONTHS = 2;

/** The tiers whose residents are "villagers". */
const VILLAGER_TIERS = new Set(['thorp', 'hamlet', 'village']);

/**
 * The shape this module READS off a settlement record — written out rather than taken as
 * `any`, so the domain-strict ratchet and the any-cast register both stay at their floors
 * and a reader can see exactly which fields a hook's truth depends on. Every field is
 * optional and typed `unknown` where the record's own writers disagree about its shape.
 * @typedef {Object} HookTruthRecord
 * @property {unknown} [tier]
 * @property {unknown} [name]
 * @property {{ foodSecurity?: unknown, safetyProfile?: { plotHooks?: unknown } }} [economicState]
 * @property {{ institutions?: { walls?: unknown, garrison?: unknown, militia?: unknown,
 *   watch?: unknown, mercenary?: unknown, magicDef?: unknown } }} [defenseProfile]
 * @property {unknown} [institutions]
 * @property {unknown} [npcs]
 * @property {unknown} [conflicts]
 * @property {{ currentTensions?: unknown, historicalEvents?: unknown }} [history]
 * @property {{ plotHooks?: unknown }} [economicViability]
 */

/**
 * @typedef {Object} HookFacts
 * @property {string} tier the settlement's tier token, or '' when the record has none
 * @property {(string|null)} tierNoun the noun the place is called by, or null
 * @property {(string|null)} foodBand the food band's own label, or null when unknown
 * @property {(number|null)} storedMonths months of food in store, or null when unknown
 * @property {boolean} foodKnown does the record carry a food analysis at all?
 * @property {boolean} famineLicensed may a hook here say "starving"/"banditry"?
 * @property {boolean} foodGap is there a real gap short of a famine?
 * @property {boolean} hasArmedForce a garrison, militia or mercenary company exists
 * @property {boolean} hasGarrison a standing garrison exists
 * @property {boolean} hasWalls settlement fortification exists
 * @property {boolean} hasWatch a watch or militia exists
 * @property {boolean} hasHospital a real hospital exists
 * @property {boolean} defenseKnown does the record carry a defence roster at all?
 * @property {boolean} magicFunctions does magic function in this world?
 *   ⚠ NOT SPELLED `magicWorks`, and the reason is machinery rather than taste: two DS-DEF-5
 *   prose pools (`arcane defense PRESENT` / `ABSENT`) branch on a `magicWorks` field that
 *   nothing in the estate produces, and the wiring census indexes producers BY KEY NAME —
 *   so a facts object carrying that spelling flips both rows from `not-produced` to
 *   `measured` and records a producer that feeds neither pool. Measured by running
 *   `node scripts/wiring-census.mjs` with each spelling.
 * @property {boolean} speaksOfVillagers may a hook call the residents villagers?
 */

/**
 * The institution names a defence roster family holds, as plain strings.
 * @param {unknown} family
 * @returns {string[]}
 */
function rosterNames(family) {
  if (!Array.isArray(family)) return [];
  return family
    .map((entry) => {
      if (typeof entry === 'string') return entry;
      const name = /** @type {{ name?: unknown }} */ (entry)?.name;
      return typeof name === 'string' ? name : '';
    })
    .filter((name) => name !== '');
}

/**
 * Read the facts a hook can contradict out of one settlement record.
 *
 * ⚠ THE DEFENCE READER IS LOCAL AND TEMPORARY. The DEFENSE lane is building
 * `src/domain/defense/defenseFacts.js :: defenseFactsOf(settlement)` → `{ hasGarrison,
 * hasWalls, hasWatch, hasMilitia, hasHospital, … }`. Until it lands this reads the
 * record's own defence roster (`defenseProfile.institutions`, the families
 * `defenseGenerator.js` writes: walls, garrison, militia, watch, mercenary, magicDef) and
 * the institution list for a hospital. SWITCH THE BODY BELOW to that leaf at integration;
 * nothing outside this function reads the roster.
 *
 * @param {unknown} settlement
 * @returns {HookFacts}
 */
export function settlementHookFacts(settlement) {
  const record = /** @type {HookTruthRecord} */ (
    settlement && typeof settlement === 'object' ? settlement : {}
  );
  const tier = typeof record.tier === 'string' ? record.tier : '';
  // THE BAND IS THE RECORD'S OWN ANSWER and the stored months come through the estate's
  // declared food accessor (`foodLedger`), so this module re-derives neither. The band
  // label already carries the famine case (the ladder puts famine first), which is why the
  // famine flag is not read a second time here: one fact, one home.
  const band = /** @type {{ label?: unknown }} */ (record.economicState?.foodSecurity || {});
  const foodBand = typeof band.label === 'string' && band.label !== '' ? band.label : null;
  const ledger = foodLedger(/** @type {Parameters<typeof foodLedger>[0]} */ (settlement));
  const storedMonths = ledger.present ? ledger.storageMonths : null;
  const foodKnown = foodBand !== null;
  // A FAMINE SENTENCE NEEDS BOTH HALVES: the band says the food has failed, and the
  // granaries agree. An unknown band licenses the sentence rather than refusing it,
  // because this classifier may only speak where the record contradicts the hook.
  const famineLicensed = !foodKnown
    || (CRISIS_BANDS.has(foodBand)
      && (storedMonths === null || storedMonths < LOW_STORED_MONTHS));
  const foodGap = foodKnown && (GAP_BANDS.has(foodBand) || CRISIS_BANDS.has(foodBand));

  const roster = /** @type {Record<string, unknown>} */ (
    record.defenseProfile?.institutions && typeof record.defenseProfile.institutions === 'object'
      ? record.defenseProfile.institutions
      : {}
  );
  const defenseKnown = Boolean(
    record.defenseProfile?.institutions && typeof record.defenseProfile.institutions === 'object',
  );
  const garrison = rosterNames(roster.garrison);
  const militia = rosterNames(roster.militia);
  const mercenary = rosterNames(roster.mercenary);
  const watch = rosterNames(roster.watch);
  const walls = rosterNames(roster.walls);
  // THE ROSTER READ GOES THROUGH THE RUIN FILTER (`isLiveInstitution`, the estate's one
  // liveness predicate): a hospital that burned down is not a hospital a hook may send
  // somebody to. A hook asking "does the thing exist" is asking about a STANDING thing.
  /** @type {unknown[]} */
  const institutions = Array.isArray(record.institutions) ? record.institutions : [];
  const hasHospital = institutions.some((inst) => {
    const name = /** @type {{ name?: unknown }} */ (inst)?.name;
    if (typeof name !== 'string' || !/\bhospital\b/i.test(name)) return false;
    return isLiveInstitution(/** @type {Parameters<typeof isLiveInstitution>[0]} */ (inst));
  });

  return Object.freeze({
    tier,
    tierNoun: tierNounFor(tier),
    foodBand,
    storedMonths,
    foodKnown,
    famineLicensed,
    foodGap,
    hasGarrison: garrison.length > 0,
    hasArmedForce: garrison.length > 0 || militia.length > 0 || mercenary.length > 0,
    hasWalls: walls.length > 0,
    hasWatch: watch.length > 0 || militia.length > 0,
    hasHospital,
    defenseKnown,
    magicFunctions: magicWorksAt(/** @type {Parameters<typeof magicWorksAt>[0]} */ (settlement)),
    speaksOfVillagers: tier === '' || VILLAGER_TIERS.has(tier),
  });
}

/**
 * The word classes a hook can claim. Each one is spelled as narrowly as the measurement
 * allowed, because a display gate that over-matches DROPS true content:
 *   - FAMINE: the measured sentence's own two words.
 *   - ARMED_FORCE: a standing force. "guard captain" is NOT here — a watch captain is a
 *     person, not a garrison, and the criminal-network hooks that name one are true.
 *   - WALLS: settlement fortification only. Bare "walls" is deliberately excluded: the
 *     measured corpus prints "Something was sealed inside the walls during construction"
 *     for a thorp, and those are a BUILDING's walls. Gating on it would delete a true hook.
 *   - HOSPITAL / MAGIC / VILLAGERS as named in the rulings.
 * @type {Readonly<Record<string, RegExp>>}
 */
const WORDS = Object.freeze({
  famine: /\bstarv(?:ing|ation|es|ed|e)\b|\bbanditry\b|\bfamine\b/i,
  armedForce: /\bgarrisons?\b|\bbarracks\b|\bsoldiers?\b|\bmen[- ]at[- ]arms\b/i,
  walls: /\b(?:town|city|settlement|curtain) walls?\b|\bthe walls of the (?:town|city|settlement)\b|\bramparts?\b|\bbattlements?\b|\bgatehouse\b|\bpalisade\b/i,
  watch: /\bthe (?:city |town )?watch\b|\bwatchmen\b|\bwatchman\b/i,
  hospital: /\bhospitals?\b/i,
  magic: /\bmagic(?:al|s)?\b|\bmages?\b|\bwizards?\b|\bspell(?:s|caster|casters)?\b|\barcane\b|\bsorcer\w*\b|\benchant\w*\b|\bconjur\w*\b|\bthaumat\w*\b/i,
  villagers: /\bvillagers?\b/i,
});

/** "N days of food left" / "N days of reserves" — the figure and its noun. */
export const STORED_DAYS = /(\d[\d,]*)\s+days of (food left|reserves)/i;

/**
 * The generic-noun shape `speakTierNoun` rewrites, asked as a question. Kept in step with
 * `src/domain/display/stateProse/stateProseKernel.js :: speakTierNoun` by construction: the
 * finding below is raised only where that function would CHANGE the line, so the two can
 * never disagree about what "says town" means.
 */
const TOWN_NOUN = /(^|[^\p{L}\p{N}_])(?:The|the|This|this) town(?:['’]s)?(?=[^\p{L}\p{N}_]|$)/u;

/**
 * @typedef {Object} HookTruthFinding
 * @property {string} code the violated fact, from a closed vocabulary
 * @property {string} text the hook sentence that claims it
 * @property {string} detail what the record says instead
 */

/**
 * Which facts of this place does one hook sentence contradict?
 *
 * @param {unknown} text one hook sentence, as the DM would read it
 * @param {HookFacts} facts the place's facts, from `settlementHookFacts`
 * @returns {HookTruthFinding[]} empty when the sentence says nothing untrue
 */
export function hookTruthViolations(text, facts) {
  const line = typeof text === 'string' ? text : '';
  if (line === '') return [];
  /** @type {HookTruthFinding[]} */
  const out = [];
  const add = (/** @type {string} */ code, /** @type {string} */ detail) => {
    out.push({ code, text: line, detail });
  };

  if (WORDS.famine.test(line) && !facts.famineLicensed) {
    add(
      'famine_words_on_a_fed_place',
      `food band ${facts.foodBand ?? 'unknown'}${
        facts.storedMonths === null ? '' : ` with ${facts.storedMonths} months stored`}`,
    );
  }
  const days = STORED_DAYS.exec(line);
  if (days && facts.storedMonths !== null) {
    const printed = Number(days[1].replace(/,/g, ''));
    const stored = Math.round(facts.storedMonths * 30);
    if (printed !== stored) {
      add('stored_days_contradict_the_store', `${days[1]} days printed; ${facts.storedMonths} months stored is ${stored} days`);
    }
  }
  if (facts.defenseKnown && WORDS.armedForce.test(line) && !facts.hasArmedForce) {
    add('armed_force_without_one', 'no garrison, militia or mercenary company on the defence roster');
  }
  if (facts.defenseKnown && WORDS.walls.test(line) && !facts.hasWalls) {
    add('walls_without_walls', 'no fortification on the defence roster');
  }
  if (facts.defenseKnown && WORDS.watch.test(line) && !facts.hasWatch) {
    add('watch_without_a_watch', 'no watch or militia on the defence roster');
  }
  if (WORDS.hospital.test(line) && !facts.hasHospital) {
    add('hospital_without_a_hospital', 'no hospital among the institutions');
  }
  if (!facts.magicFunctions && WORDS.magic.test(line)) {
    add('magic_words_where_magic_is_off', 'the world law says magic does not function here');
  }
  if (WORDS.villagers.test(line) && !facts.speaksOfVillagers) {
    add('villagers_in_a_large_place', `the place is a ${facts.tier}`);
  }
  if (facts.tierNoun !== null && facts.tierNoun !== 'town' && TOWN_NOUN.test(line)) {
    add('town_for_a_place_that_is_not_one', `the place is a ${facts.tierNoun}`);
  }
  return out;
}


/**
 * THE TWO REWRITES. Two of the measured defects are a sentence that is RIGHT about its
 * subject and wrong about one word in it, and dropping those costs the DM a true hook for
 * no reason:
 *   - the stored figure: "the settlement has 12 days of reserves" on a place holding 15
 *     months becomes "450 days of reserves" (the engine's stored months, converted);
 *   - the noun: "the town's leaders" in a thorp becomes "the thorp's leaders", through the
 *     estate's ONE substitution (`speakTierNoun`), never a second spelling of it.
 * Everything else the classifier finds is a claim the record contradicts outright, and a
 * display layer may not invent the fact that would make it true — so those are refused.
 *
 * @param {unknown} text one hook sentence
 * @param {HookFacts} facts
 * @returns {string} the sentence as this place may say it
 */
export function speakHookTruthfully(text, facts) {
  let line = typeof text === 'string' ? text : '';
  if (line === '') return '';
  if (facts.storedMonths !== null) {
    line = line.replace(
      STORED_DAYS,
      (_match, _printed, noun) => `${Math.round(/** @type {number} */ (facts.storedMonths) * 30)} days of ${noun}`,
    );
  }
  return speakTierNoun(line, facts.tierNoun);
}
