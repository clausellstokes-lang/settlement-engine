import { random as _rng } from './rngContext.js';
import { compareCodepoint } from '../domain/deterministicSort.js';
import { getInstFlags, getStressFlags, getPriorities } from './helpers.js';
import { ARCANE_INST_KW as _ARCANE_SVC_KW } from '../domain/magicFilter.js';
import { generateSafetyProfile } from './safetyProfile.js';
import { classifyService } from './services/serviceClassifier.js';
import { getServiceTierInfo } from './services/serviceAvailability.js';
import { getServicesForInstitution } from './services/institutionServices.js';

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

// Criminal-institution vocabulary — shared by the crime-scaled service gate
// and the synthetic informal-crime fallback so the two stay in sync.
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
// The crime-scaled gate models ILLICIT supply tracking criminal presence.
// It only applies to services offered by criminal institutions: a legitimate
// provider's services (garrison patrols, a tavern back room) must not vanish
// because the settlement is lawful — the institution already exists.
const _isCriminalProvider = (inst) => {
  if ((inst.category || '').toLowerCase() === 'criminal') return true;
  const n = (inst.name || '').toLowerCase();
  return _CRIMINAL_INST_KW.some((kw) => n.includes(kw));
};

// generateAvailableServices — roll each institution's services into categorized
// buckets, then layer in crime/stress-driven informal services. The seeded
// _rng() call sequence is load-bearing (see inline notes): any branch that
// consumes _rng() must preserve its order for output to stay reproducible.
export const generateAvailableServices = (tier, institutions, opts = {}, config = {}) => {
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
    },
    criminalEffective = getInstFlags(config, institutions).criminalEffective,
    seen = new Set(),
    mergedOpts = Object.assign({}, opts, {
      _tradeRoute: config._tradeRoute || '',
    });
  // Filter out magic/supernatural institutions when magic doesn't exist in this world
  const noMagic = config.magicExists === false || (config.priorityMagic || 50) === 0;
  const filteredInsts = noMagic
    ? institutions.filter((inst) => {
        const name = (inst.name || '').toLowerCase();
        const cat = (inst.category || '').toLowerCase();
        if (cat === 'magic' || cat === 'exotic') return false;
        return !_ARCANE_SVC_KW.some((kw) => name.includes(kw));
      })
    : institutions;
  filteredInsts.forEach((inst) => {
    getServicesForInstitution(inst.name, tier, mergedOpts).forEach((svc) => {
      const svcName = svc.name;
      if (seen.has(svcName)) return;
      seen.add(svcName);
      const demandMultiplier = getServiceTierInfo(svc.name, inst.name, config, institutions),
        category = classifyService(svc.name, inst.name); // Skip magic-category services in no-magic worlds
      if (category === 'magic' && noMagic) return;
      // Same short-circuit order as the old `a || b || push` chain so the
      // seeded _rng() call sequence (and thus generation output) is stable.
      if (
        !(category === 'criminal' && _isCriminalProvider(inst) && _rng() > Math.min(1, (criminalEffective / 100) * 1.5)) &&
        !((svc.p || 1) < 1 && demandMultiplier < 1 && _rng() > demandMultiplier) &&
        buckets[category]
      ) {
        buckets[category].push({
          name: svc.name,
          desc: svc.desc,
          institution: inst.name,
        });
        // Cross-list, don't move: inn/tavern food lines ('Food and drink
        // (all grades)', 'Basic provisions') belong on the lodging page,
        // but the settlement genuinely HAS food — without a `food` entry,
        // deriveNotableAbsences flagged "Food & Drink" as a notable absence
        // while the lodging list advertised food two lines up.
        if (category === 'lodging' && /food|drink|provision|meal/i.test(svc.name)) {
          buckets.food.push({
            name: svc.name,
            desc: svc.desc,
            institution: inst.name,
          });
        }
      }
    });
  });
  const hasCriminalInst = institutions.some((inst) => {
      const name = (inst.name || '').toLowerCase();
      return _CRIMINAL_INST_KW.some((kw) => name.includes(kw));
    }),
    securityRatio = getInstFlags(config, institutions).militaryEffective / Math.max(8, criminalEffective);
  !hasCriminalInst &&
    (criminalEffective >= 38 || securityRatio < 1.2) &&
    buckets.criminal.length === 0 &&
    !['thorp', 'hamlet', 'village'].includes(config.settType || config.tier || 'village') &&
    (securityRatio < 0.6
      ? buckets.criminal.push(
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
        )
      : buckets.criminal.push(
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
        ),
    !hasCriminalInst &&
      criminalEffective >= 55 &&
      securityRatio < 0.5 &&
      buckets.criminal.length === 0 &&
      ['village'].includes(config.settType || config.tier || '') &&
      (securityRatio < 0.4
        ? buckets.criminal.push(
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
          )
        : buckets.criminal.push(
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
          )),
    criminalEffective >= 55 &&
      buckets.criminal.push({
        name: 'Contraband',
        desc: 'Untaxed or restricted goods available through back-channel contacts.',
        institution: '(covert)',
      }));
  const stressFlags = getStressFlags(config, institutions);
  (stressFlags.stateCrime &&
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
      buckets.criminal.some((existing) => existing.name === item.name) ||
        buckets.criminal.push({
          ...item,
          institution: '(state apparatus)',
        });
    }),
    stressFlags.crimeIsGovt &&
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
        buckets.criminal.some((existing) => existing.name === item.name) ||
          buckets.criminal.push({
            ...item,
            institution: '(criminal governance)',
          });
      }),
    stressFlags.arcaneBlackMarket &&
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
        buckets.criminal.some((existing) => existing.name === item.name) ||
          buckets.criminal.push({
            ...item,
            institution: '(arcane underground)',
          });
      }),
    stressFlags.religiousFraud &&
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
        buckets.criminal.some((existing) => existing.name === item.name) ||
          buckets.criminal.push({
            ...item,
            institution: '(religious fraud)',
          });
      }),
    stressFlags.merchantCriminalBlur &&
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
        buckets.criminal.some((existing) => existing.name === item.name) ||
          buckets.criminal.push({
            ...item,
            institution: '(commercial crime)',
          });
      }));
  const safetyProfile = generateSafetyProfile(config, tier, institutions),
    instFlags = getInstFlags(config, institutions);
  (getPriorities(config), instFlags.inst, instFlags.criminalEffective);
  const crimeTypes = new Set((safetyProfile.crimeTypes || []).map((entry) => entry.type)),
    addCrimeService = (name, desc, institution) => {
      seen.has(name) ||
        (seen.add(name),
        buckets.criminal.some((existing) => existing.name === name) ||
          buckets.criminal.push({
            name,
            desc,
            institution,
          }));
    };
  return (
    crimeTypes.has('Survival crime') &&
      addCrimeService(
        'Fence (word of mouth)',
        'No questions asked — stolen goods move through back channels for a fraction of value.',
        '(covert)'
      ),
    crimeTypes.has('Street gang activity') &&
      (addCrimeService(
        'Protection racket',
        'Pay or have your premises damaged. The gangs are territorial and consistent.',
        '(street gang)'
      ),
      addCrimeService(
        'Muscle for hire',
        'Rough up a target, intimidate a debtor, move a problem — informal, no contract.',
        '(street gang)'
      )),
    crimeTypes.has('Smuggling') &&
      addCrimeService(
        'Contraband transport',
        'Goods move past checkpoints. The routes exist; the operators know the schedules.',
        '(smuggling)'
      ),
    crimeTypes.has('Magical crime') &&
      addCrimeService(
        'Arcane services (illicit)',
        'Magical practitioners outside guild oversight — identity work, scrying, targeted effects. Available if you know where to ask.',
        '(arcane underground)'
      ),
    crimeTypes.has('Lawlessness') &&
      (addCrimeService(
        'No law, bring coin',
        'There is no official recourse here. Disputes end with whoever can apply more violence or pay more for protection.',
        '(lawless)'
      ),
      addCrimeService(
        'Protection (informal)',
        'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.',
        '(informal)'
      )),
    crimeTypes.has('Organized guild crime') &&
      addCrimeService('Fence (stolen goods)', 'Move recovered goods, no questions — expect 30-50% of value.', '(thieves guild)'),
    crimeTypes.has('Background crime') &&
      addCrimeService(
        'Fence (word of mouth)',
        'Ask around at the right tavern. Someone moves goods without questions.',
        '(covert)'
      ),
    Object.keys(buckets).forEach(function (category) {
      buckets[category].sort(function (a, b) {
        return compareCodepoint(a.name, b.name);
      });
    }),
    buckets
  );
};
