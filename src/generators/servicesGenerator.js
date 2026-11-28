import { compareCodepoint } from '../domain/deterministicSort.js';
import { getInstFlags, getStressFlags } from './helpers.js';
import { generateSafetyProfile } from './safetyProfile.js';
import {
  hasCriminalInstitution,
  lawlessRow,
  materializeInstitutionServiceRolls,
} from './services/serviceRollMaterialization.js';
import {
  resolveGenerationWorldLaw,
} from './generationContext.js';
import { hasInstitution } from '../domain/facts/institutions.js';
import { courtHoldersOf } from '../domain/facts/defence.js'; // FAULTS-WATCH item 7 (FR22 (3)): the Legal row's own court
// Shared phrases hoisted once (train EM-T16's worker buy-back, judgment 214c): each is spelled here and referenced below; every emitted value is byte-identical.
const ASK_AROUND_AT_THE_RIGHT_TAVERN_SOMEONE_MOVES_GOODS_WITHOUT_QUESTIONS = 'Ask around at the right tavern. Someone moves goods without questions.';
// R3-CODE-C-3 (CENSUS-2 a, r2r-village-19): "the right tavern" reads the roster (facts/institutions.js `tavern`); else its twin.
const ASK_AROUND_QUIETLY_SOMEONE_MOVES_GOODS_WITHOUT_QUESTIONS = 'Ask around quietly. Someone moves goods without questions.';
// The chair, 23:40Z: a service never takes the name of a house the roster lacks. The fallback's row names no house at
// all (R3-CODE-C-6: a name test of the roster for the fence house, outside the crime fact's home, is no reading of it).
const FENCING_STOLEN_GOODS = 'Fencing stolen goods';
const INFORMAL_NO_CONTRACT_VIOLENCE_AVAILABLE_FOR_COIN_TO_THOSE_WHO_KNOW_WHERE_TO_ASK = 'Informal, no contract. Violence available for coin to those who know where to ask.';
// COHERENCE-PRESUME (the chair's ruling A, 2026-11-11): the row DENIED the law ("No law", "There is no
// official recourse here") in towns with a watch and a hall, court or council (22 of the 360 corpus
// towns, every one). Every town this generator births has some law, so the row says what it meant:
// the law is there and coin beats it. One row, reworded; no twin (the thought holds everywhere).
const NO_LAW_BRING_COIN = 'Weak law, bring coin';
const PAY_A_LOCAL_STRONGMAN_A_NEIGHBOR_OR_A_GANG_FOR_SOME_MEASURE_OF_SAFETY_NO_CONTRACTS_NO_GUARANTEES = 'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.';
const PROTECTION_INFORMAL = 'Protection (informal)';
const _ARCANE_UNDERGROUND = '(arcane underground)';
// FAULTS-WATCH item 7 (the chair's FR22 (3), 2026-11-18; the twin's words are the chair's, vetoable by the owner): the Small
// prison/stocks' "Holding cells" (`institutionServices.js`) holds "pending trial" where no court sits to try anyone.
const HOLDING_CELLS_PENDING_TRIAL = 'Short-term detention pending trial or payment of fines.';
const HOLDING_CELLS_UNTIL_FINE = 'Short-term detention until a fine is paid.';

/**
 * servicesGenerator.js
 * Available-services generation — public entry point.
 *
 * The heavy lifting lives in cohesive modules under ./services/:
 *   - serviceCategoryTables.js  service→category / institution→category data
 *   - serviceClassifier.js      classifyService() keyword heuristic
 *   - serviceAvailability.js    getServiceTierInfo() demand multiplier
 *   - institutionServices.js    getServicesForInstitution() rolls
 * This file orchestrates them and re-exports generateAvailableServices.
 */

// generateAvailableServices — roll each institution's services into categorized
// buckets, then layer in crime/stress-driven informal services. The seeded
// _rng() call sequence is load-bearing (see inline notes): any branch that
// consumes _rng() must preserve its order for output to stay reproducible.
export const generateAvailableServices = (
  tier,
  institutions,
  opts = {},
  config = {},
  generationContext = null,
  upkeep = null,
) => {
  const worldLaw = resolveGenerationWorldLaw(
    generationContext,
    config,
  );
  const buckets = {
      lodging: [],
      food: [],
      equipment: [],
      magic: [],
      information: [],
      healing: [],
      transport: [],
      legal: [],
      employment: [],
      entertainment: [],
      criminal: [],
    };
  const { criminalEffective, seen } = materializeInstitutionServiceRolls({
    buckets,
    tier,
    institutions,
    opts,
    config,
    worldLaw,
    upkeep,
  });
  const roster = { institutions };
  const fenceAskLine = hasInstitution(roster, 'tavern') // R3-CODE-C-3: the tavern only where one stands
    ? ASK_AROUND_AT_THE_RIGHT_TAVERN_SOMEONE_MOVES_GOODS_WITHOUT_QUESTIONS : ASK_AROUND_QUIETLY_SOMEONE_MOVES_GOODS_WITHOUT_QUESTIONS;
  const hasCriminalInst = hasCriminalInstitution(institutions), // a criminal house by name (services/serviceRollMaterialization.js)
    securityRatio = getInstFlags(config, institutions).militaryEffective / Math.max(8, criminalEffective);
  // Synthetic informal-crime fallback — a lawless-enough settlement offers
  // criminal services even when no criminal institution was rolled.
  // NOTE: this unwinds the original minified grouping FAITHFULLY — the village
  // fallback and the contraband push were NESTED inside the outer (town+) gate,
  // so they only evaluate when it passed. The village fallback's own conditions
  // can never hold here (non-village outer gate; first push fills the bucket);
  // preserved as-is (same tier-before-sentinel read as the outer gate).
  // Resolve the real tier first: config.settType may be the 'random'/'custom'
  // sentinel (a non-tier string that slips past this small-tier gate), while
  // resolveConfig writes the true tier to config.tier. Prefer config.tier —
  // mirrors institutionProbability.js.
  if (
    !hasCriminalInst &&
    (criminalEffective >= 38 || securityRatio < 1.2) &&
    buckets.criminal.length === 0 &&
    !['thorp', 'hamlet', 'village'].includes(config.tier || config.settType || 'village')
  ) {
    if (securityRatio < 0.6) {
      buckets.criminal.push(
        {
          name: NO_LAW_BRING_COIN,
          ...lawlessRow(institutions, buckets),
          institution: '(lawless)',
        },
        {
          name: PROTECTION_INFORMAL,
          desc: PAY_A_LOCAL_STRONGMAN_A_NEIGHBOR_OR_A_GANG_FOR_SOME_MEASURE_OF_SAFETY_NO_CONTRACTS_NO_GUARANTEES,
          institution: '(informal)',
        }
      );
    } else {
      buckets.criminal.push(
        {
          name: FENCING_STOLEN_GOODS,
          desc: fenceAskLine,
          institution: '(covert)',
        },
        {
          name: 'Hired muscle',
          desc: INFORMAL_NO_CONTRACT_VIOLENCE_AVAILABLE_FOR_COIN_TO_THOSE_WHO_KNOW_WHERE_TO_ASK,
          institution: '(covert)',
        }
      );
    }
    if (
      !hasCriminalInst &&
      criminalEffective >= 55 &&
      securityRatio < 0.5 &&
      buckets.criminal.length === 0 &&
      ['village'].includes(config.tier || config.settType || '')
    ) {
      if (securityRatio < 0.4) {
        buckets.criminal.push(
          {
            name: NO_LAW_BRING_COIN,
            ...lawlessRow(institutions, buckets),
            institution: '(lawless)',
          },
          {
            name: PROTECTION_INFORMAL,
            desc: PAY_A_LOCAL_STRONGMAN_A_NEIGHBOR_OR_A_GANG_FOR_SOME_MEASURE_OF_SAFETY_NO_CONTRACTS_NO_GUARANTEES,
            institution: '(informal)',
          }
        );
      } else {
        buckets.criminal.push(
          {
            name: FENCING_STOLEN_GOODS,
            desc: fenceAskLine,
            institution: '(covert)',
          },
          {
            name: 'Hired muscle',
            desc: INFORMAL_NO_CONTRACT_VIOLENCE_AVAILABLE_FOR_COIN_TO_THOSE_WHO_KNOW_WHERE_TO_ASK,
            institution: '(covert)',
          }
        );
      }
    }
    if (criminalEffective >= 55) {
      buckets.criminal.push({
        name: 'Contraband',
        desc: 'Untaxed or restricted goods available through back-channel contacts.',
        institution: '(covert)',
      });
    }
  }
  // Stress-driven criminal service menus — one block per structural stress flag.
  const stressFlags = getStressFlags(config, institutions);
  if (stressFlags.stateCrime) {
    [
      {
        name: 'Bribe a guard',
        desc: 'Payments to officials are the cost of operating here. Rates are understood if not advertised.',
      },
      {
        name: 'Disappear quietly',
        desc: 'Those who know the right people can arrange to vanish from the official register: for a price.',
      },
      {
        name: 'Intelligence on officials',
        desc: 'Knowing who can be bought, who is watched, and who reports to whom is worth coin.',
      },
    ].forEach((item) => {
      if (!buckets.criminal.some((existing) => existing.name === item.name)) {
        buckets.criminal.push({
          ...item,
          institution: '(state apparatus)',
        });
      }
    });
  }
  if (stressFlags.crimeIsGovt) {
    // BAR3-SERVICES (S2, 2026-11-15): the rows name no body the town may lack. The stress fires where the only criminal
    // house is a smuggling waypoint (no guild, no organization of the town's own) as where a Thieves' Guild stands, so the
    // guild's and the organization's rows are reworded to what both bear: those who run the crime here.
    [
      {
        name: 'Dispute resolution (criminal)',
        desc: 'Quarrels are settled by those who run the crime here. Their judgment is final, and resisting it is unwise.',
      },
      {
        name: 'Extortion (structured)',
        desc: 'The rate is posted. Everyone pays. It is not officially called extortion.',
      },
      {
        name: 'Contraband licensing',
        desc: 'Those who run the crime here decide what moves through. Anyone who moves goods without their leave is removed.',
      },
    ].forEach((item) => {
      if (!buckets.criminal.some((existing) => existing.name === item.name)) {
        buckets.criminal.push({
          ...item,
          institution: '(criminal governance)',
        });
      }
    });
  }
  if (stressFlags.arcaneBlackMarket) {
    [
      {
        name: 'Forbidden components',
        desc: 'Rare and restricted magical ingredients available to those who do not ask where they come from.',
      },
      {
        name: 'Unlicensed enchantment',
        desc: 'Practitioners working outside guild oversight: cheaper, harder to trace, and against the law.',
      },
      {
        name: 'Magical forgery',
        desc: 'Identification papers, writs, and seals with genuine magical authentication: fraudulently applied.',
      },
    ].forEach((item) => {
      if (!buckets.criminal.some((existing) => existing.name === item.name)) {
        buckets.criminal.push({
          ...item,
          institution: _ARCANE_UNDERGROUND,
        });
      }
    });
  }
  if (stressFlags.religiousFraud) {
    [
      {
        name: 'Relics (dubious provenance)',
        desc: 'Sacred objects with impeccable documentation. The documentation was written last week.',
      },
      {
        name: 'Indulgences and dispensations',
        // BAR3-SERVICES (S2): delivered by the town's own clergy only where a house of worship of its own stands; where
        // the town has only access to a neighbour's, its twin names no body the town lacks.
        desc: hasInstitution(roster, 'temple')
          ? 'Formal church forgiveness, delivered by clergy with flexible interpretations of canon.'
          : "Absolution on paper, sealed in a distant authority's name and sold to whoever will pay.",
      },
      {
        name: 'False prophecy',
        desc: 'Readings, visions, and omens from practitioners who know what the client wants to hear.',
      },
    ].forEach((item) => {
      if (!buckets.criminal.some((existing) => existing.name === item.name)) {
        buckets.criminal.push({
          ...item,
          institution: '(religious fraud)',
        });
      }
    });
  }
  if (stressFlags.merchantCriminalBlur) {
    [
      {
        name: 'Unofficial arbitration',
        desc: 'Commercial disputes resolved outside the courts: faster, cheaper, and more reliably enforced.',
      },
      {
        name: 'Gray market goods',
        desc: 'Legitimately produced goods moving through channels that avoid inspection, duty, or guild oversight.',
      },
      {
        name: 'Front company formation',
        desc: 'Establish a legitimate face for work that needs to look above board.',
      },
    ].forEach((item) => {
      if (!buckets.criminal.some((existing) => existing.name === item.name)) {
        buckets.criminal.push({
          ...item,
          institution: '(commercial crime)',
        });
      }
    });
  }
  const safetyProfile = generateSafetyProfile(config, tier, institutions);
  // Crime-type service menu — one entry per crime type the safety profile reports.
  const crimeTypes = new Set((safetyProfile.crimeTypes || []).map((entry) => entry.type)),
    addCrimeService = (name, desc, institution) => {
      if (seen.has(name)) return;
      seen.add(name);
      if (!buckets.criminal.some((existing) => existing.name === name)) {
        buckets.criminal.push({
          name,
          desc,
          institution,
        });
      }
    };
  if (crimeTypes.has('Survival crime')) {
    addCrimeService(
      FENCING_STOLEN_GOODS,
      'No questions asked. Stolen goods move through back channels for a fraction of value.',
      '(covert)'
    );
  }
  if (crimeTypes.has('Street gang activity')) {
    addCrimeService(
      'Protection racket',
      'Pay or have your premises damaged. The gangs are territorial and consistent.',
      '(street gang)'
    );
    addCrimeService(
      'Muscle for hire',
      'Rough up a target, intimidate a debtor, move a problem: informal, no contract.',
      '(street gang)'
    );
  }
  if (crimeTypes.has('Smuggling')) {
    addCrimeService(
      'Contraband transport',
      'Goods move past checkpoints. The routes exist; the operators know the schedules.',
      '(smuggling)'
    );
  }
  if (crimeTypes.has('Magical crime')) {
    addCrimeService(
      'Arcane services (illicit)',
      'Magical practitioners outside guild oversight: identity work, scrying, targeted effects. Available if you know where to ask.',
      _ARCANE_UNDERGROUND
    );
  }
  if (crimeTypes.has('Lawlessness')) {
    addCrimeService(
      NO_LAW_BRING_COIN,
      lawlessRow(institutions, buckets).desc, // FAULTS-WATCH item 1 (r2r-city-41): the overlay's own reading, as its two push sites read it
      '(lawless)'
    );
    addCrimeService(
      PROTECTION_INFORMAL,
      PAY_A_LOCAL_STRONGMAN_A_NEIGHBOR_OR_A_GANG_FOR_SOME_MEASURE_OF_SAFETY_NO_CONTRACTS_NO_GUARANTEES,
      '(informal)'
    );
  }
  if (crimeTypes.has('Organized guild crime')) {
    addCrimeService('Fence (stolen goods)', 'Move recovered goods, no questions: expect a third to half of their value.', '(thieves guild)');
  }
  if (crimeTypes.has('Background crime')) {
    addCrimeService(
      FENCING_STOLEN_GOODS,
      fenceAskLine,
      '(covert)'
    );
  }
  // FAULTS-WATCH item 7: the Legal row's court (`defence.js :: courtHoldersOf`, the atom `court sits`), read over the services
  // drawn, as the lawless row reads it (`lawlessRow`); where none sits the Holding cells take their twin (label kept)
  if (courtHoldersOf({ institutions, availableServices: buckets }).length === 0) {
    for (const list of Object.values(buckets)) for (const svc of list) if (svc?.name === 'Holding cells' && svc.desc === HOLDING_CELLS_PENDING_TRIAL) svc.desc = HOLDING_CELLS_UNTIL_FINE;
  }
  // Deterministic bucket order — codepoint sort, stable across devices/locales.
  Object.keys(buckets).forEach(function (category) {
    // This final projection catches synthetic overlays as well as catalog
    // services. In particular, a healing-category service whose description
    // promises divine magic cannot evade the law merely because its bucket is
    // not named "magic".
    buckets[category] = buckets[category]
      .filter(service => worldLaw.allowsService(
        service,
        service.source === 'custom' || service.custom === true
          ? {
              name: service.institution,
              source: 'custom',
              custom: true,
            }
          : service.institution,
        category,
      ))
      .sort(function (a, b) {
      return compareCodepoint(a.name, b.name);
    });
  });
  return buckets;
};
