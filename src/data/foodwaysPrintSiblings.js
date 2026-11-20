/**
 * data/foodwaysPrintSiblings.js — A FOODWAYS SENTENCE READ WHERE IT PRINTS (BAR4-HOUSES, kind H1 (iv) and (v), REVIEW-BAR-4
 * C19810, C47050, C48079, 2026-11-16; vetoable by the owner).
 *
 * A culture's foodways sentence (`cultureProfiles.js :: CULTURE_PROFILES[*].foodways`) is chosen with the food record, where
 * neither the crisis nor the food's settled band is in the facts it is read with (`foodGenerator.js :: cultureFoodwaysOf`
 * hands the tier, the roster and the configuration; a row's `market` need is read there). THE ONE READER
 * (`domain/foodways.js :: foodwaysLineOf`) resolves each sentence of the stored line that is a key here against the food
 * record's own readings (`foodwaysFactsOf`: the crises it was made under, its band) and prints the twin where the original is
 * refused. The draw never reads this table (no pick moves). The keys are the profile rows' own texts, spelled again here:
 * this leaf imports nothing because the reader rides the eager engine core, and the culture corpus stays off first paint
 * (`tests/build/cultureProfilesLazy.test.js`, FP-G16); `tests/generators/bar4HousesPresumptions.test.js` holds each key
 * equal to a profile row.
 *   · the market's vendors and its supply presume a market trading: under a siege nothing comes in to sell (C19810, a
 *     besieged hamlet's Periodic market "Stopped by the siege" beside its vendors);
 *   · the preserving that "stretch[es] the harvest through winter" presumes a harvest in store: refused where the food
 *     record's band is famine or deficit (C47050: three days in the larder; C48079: the harvest lost a second season).
 * Each twin says what is true in that state: the shared tables, the food supply argued over, the preserving the households
 * still do with what they have (the measure's rule 3: a town in want is told what it still has).
 *
 * @enforced-by tests/generators/bar4HousesPresumptions.test.js
 */
const MARKET_VENDORS = 'Market vendors and shared dining customs make food distribution visibly civic.';
const MARKET_SUPPLY = 'Market supply and imported grain become politically charged as population grows.';
const HARVEST_KEPT = 'Fermentation, pickling, and drying stretch the harvest through winter.';
// BAR5-WORLD (the chair's ruling WS1, 2026-11-16; LAW 5): the arabic profile's foodways presumes the caravans come; under a
// siege none does (60 towns of the 720 print it, 2 besieged; 27 of the fresh 300, 6 besieged, at 600b7683a).
const CARAVAN_STAPLES = 'Water access and preservation skill determine the balance between local produce and caravan-borne staples.';

/** @type {Readonly<Record<string, ReadonlyArray<Readonly<{ text: string, needs?: ReadonlyArray<string>, excludes?: ReadonlyArray<string>, twinOf?: string }>>>>} */
export const FOODWAYS_PRINT_SIBLINGS = Object.freeze({
  [MARKET_VENDORS]: Object.freeze([
    Object.freeze({ text: MARKET_VENDORS, excludes: Object.freeze(['crisis: under_siege']) }),
    Object.freeze({ text: 'Shared dining customs make food distribution visibly civic.', twinOf: MARKET_VENDORS }),
  ]),
  [MARKET_SUPPLY]: Object.freeze([
    Object.freeze({ text: MARKET_SUPPLY, excludes: Object.freeze(['crisis: under_siege']) }),
    Object.freeze({ text: 'Food supply and the grain stores become politically charged as population grows.', twinOf: MARKET_SUPPLY }),
  ]),
  [CARAVAN_STAPLES]: Object.freeze([
    Object.freeze({ text: CARAVAN_STAPLES, excludes: Object.freeze(['crisis: under_siege']) }),
    Object.freeze({ text: 'Water access and preservation skill decide how long local produce must last while no caravan can come.', twinOf: CARAVAN_STAPLES }),
  ]),
  [HARVEST_KEPT]: Object.freeze([
    Object.freeze({ text: HARVEST_KEPT, needs: Object.freeze(['food: > deficit']) }),
    Object.freeze({ text: 'Fermentation, pickling, and drying are how the households make what food they have last.', twinOf: HARVEST_KEPT }),
  ]),
});
