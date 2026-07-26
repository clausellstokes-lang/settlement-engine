import { compareCodepoint } from '../domain/deterministicSort.js';
import { getInstFlags, getStressFlags } from './helpers.js';
import { generateSafetyProfile } from './safetyProfile.js';
import {
  materializeInstitutionServiceRolls,
} from './services/serviceRollMaterialization.js';
import {
  isMaterializedCustomContent,
  nativeSemanticName,
} from '../domain/content/customContentSemanticAuthority.js';
import {
  resolveGenerationWorldLaw,
} from './generationContext.js';

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

const _CRIMINAL_INST_KW = [
  'thieves',
  'black market',
  'smuggl',
  'street gang',
  'front business',
  'assassin',
  'gambling den',
  'underground',
  'red light',
  'criminal faction',
];
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
  });
  const hasCriminalInst = institutions.some((inst) => {
      if (isMaterializedCustomContent(inst)) return false;
      const name = nativeSemanticName(inst).toLowerCase();
      return _CRIMINAL_INST_KW.some((kw) => name.includes(kw));
    }),
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
          name: 'No law, bring coin',
          desc: 'There is no official recourse here. Disputes end with whoever can apply more violence or pay more for protection.',
          institution: '(lawless)',
        },
        {
          name: 'Protection (informal)',
          desc: 'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.',
          institution: '(informal)',
        }
      );
    } else {
      buckets.criminal.push(
        {
          name: 'Fence (word of mouth)',
          desc: 'Ask around at the right tavern. Someone moves goods without questions.',
          institution: '(covert)',
        },
        {
          name: 'Hired muscle',
          desc: 'Informal, no contract. Violence available for coin to those who know where to ask.',
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
            name: 'No law, bring coin',
            desc: 'There is no official recourse here. Disputes end with whoever can apply more violence or pay more for protection.',
            institution: '(lawless)',
          },
          {
            name: 'Protection (informal)',
            desc: 'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.',
            institution: '(informal)',
          }
        );
      } else {
        buckets.criminal.push(
          {
            name: 'Fence (word of mouth)',
            desc: 'Ask around at the right tavern. Someone moves goods without questions.',
            institution: '(covert)',
          },
          {
            name: 'Hired muscle',
            desc: 'Informal, no contract. Violence available for coin to those who know where to ask.',
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
        desc: 'Those who know the right people can arrange to vanish from the official register — for a price.',
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
    [
      {
        name: 'Dispute resolution (guild)',
        desc: 'The guild adjudicates conflicts. Their judgment is final; resistance is inadvisable.',
      },
      {
        name: 'Extortion (structured)',
        desc: 'The rate is posted. Everyone pays. It is not officially called extortion.',
      },
      {
        name: 'Contraband licensing',
        desc: 'The organization decides what flows through here. Operators without authorization are removed.',
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
        desc: 'Practitioners working outside guild oversight — cheaper, less traceable, and legally inadvisable.',
      },
      {
        name: 'Magical forgery',
        desc: 'Identification papers, writs, and seals with genuine magical authentication — fraudulently applied.',
      },
    ].forEach((item) => {
      if (!buckets.criminal.some((existing) => existing.name === item.name)) {
        buckets.criminal.push({
          ...item,
          institution: '(arcane underground)',
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
        desc: 'Formal church forgiveness, delivered by clergy with flexible interpretations of canon.',
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
        desc: 'Commercial disputes resolved outside the courts — faster, cheaper, and more reliably enforced.',
      },
      {
        name: 'Gray market goods',
        desc: 'Legitimately produced goods moving through channels that avoid inspection, duty, or guild oversight.',
      },
      {
        name: 'Front company formation',
        desc: 'Establish a legitimate face for operations that benefit from appearing above board.',
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
      'Fence (word of mouth)',
      'No questions asked — stolen goods move through back channels for a fraction of value.',
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
      'Rough up a target, intimidate a debtor, move a problem — informal, no contract.',
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
      'Magical practitioners outside guild oversight — identity work, scrying, targeted effects. Available if you know where to ask.',
      '(arcane underground)'
    );
  }
  if (crimeTypes.has('Lawlessness')) {
    addCrimeService(
      'No law, bring coin',
      'There is no official recourse here. Disputes end with whoever can apply more violence or pay more for protection.',
      '(lawless)'
    );
    addCrimeService(
      'Protection (informal)',
      'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.',
      '(informal)'
    );
  }
  if (crimeTypes.has('Organized guild crime')) {
    addCrimeService('Fence (stolen goods)', 'Move recovered goods, no questions — expect 30-50% of value.', '(thieves guild)');
  }
  if (crimeTypes.has('Background crime')) {
    addCrimeService(
      'Fence (word of mouth)',
      'Ask around at the right tavern. Someone moves goods without questions.',
      '(covert)'
    );
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
