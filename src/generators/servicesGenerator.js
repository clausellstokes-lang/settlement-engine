import { random as _rng } from './rngContext.js';
import { getInstFlags, getPriorities, getStressFlags } from './helpers.js';
import { ARCANE_INST_KW as _ARCANE_SVC_KW } from '../domain/magicFilter.js';
import { generateSafetyProfile } from './safetyProfile.js';

/**
 * servicesGenerator.js
 * Available services generation — public entry point.
 *
 * This file was split into focused submodules under ./services/ (a pure
 * reorganization, zero behavior change). It keeps `generateAvailableServices`
 * defined here (the public orchestrator) and RE-EXPORTS `SERVICE_TIER_DATA`
 * unchanged so every existing importer is unaffected:
 *   - ./services/serviceTierData.js    — SERVICE_TIER_DATA + SERVICE_TIER_CHANCE
 *   - ./services/serviceResolution.js  — getServiceTierInfo, getServicesForInstitution
 *   - ./services/serviceCategory.js    — category lookups, criminal vocab, categorizeService
 */

// Public data table — re-exported unchanged for external importers
// (e.g. components/TradeDynamicsPanel.jsx).
export { SERVICE_TIER_DATA } from './services/serviceTierData.js';

import { getServiceTierInfo, getServicesForInstitution } from './services/serviceResolution.js';
import { categorizeService, _CRIMINAL_INST_KW, _isCriminalProvider } from './services/serviceCategory.js';

// generateAvailableServices
export const generateAvailableServices = (r, s, o = {}, d = {}) => {
    const l = {
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
      m = getInstFlags(d, s).criminalEffective,
      h = categorizeService,
      g = new Set(),
      w = Object.assign({}, o, {
        _tradeRoute: d._tradeRoute || '',
      });
    // Filter out magic/supernatural institutions when magic doesn't exist in this world
    const _noMagicSvcs = d.magicExists === false || (d.priorityMagic || 50) === 0;
    const _filteredInsts = _noMagicSvcs
      ? s.filter((A) => {
          const n = (A.name || '').toLowerCase();
          const cat = (A.category || '').toLowerCase();
          if (cat === 'magic' || cat === 'exotic') return false;
          return !_ARCANE_SVC_KW.some((kw) => n.includes(kw));
        })
      : s;
    _filteredInsts.forEach((A) => {
      getServicesForInstitution(A.name, r, w).forEach((S) => {
        const y = S.name;
        if (g.has(y)) return;
        g.add(y);
        const v = getServiceTierInfo(S.name, A.name, d, s),
          j = h(S.name, A.name); // Skip magic-category services in no-magic worlds
        if (j === 'magic' && _noMagicSvcs) return;
        // Same short-circuit order as the old `a || b || push` chain so the
        // seeded _rng() call sequence (and thus generation output) is stable.
        if (
          !(j === 'criminal' && _isCriminalProvider(A) && _rng() > Math.min(1, (m / 100) * 1.5)) &&
          !((S.p || 1) < 1 && v < 1 && _rng() > v) &&
          l[j]
        ) {
          l[j].push({
            name: S.name,
            desc: S.desc,
            institution: A.name,
          });
          // Cross-list, don't move: inn/tavern food lines ('Food and drink
          // (all grades)', 'Basic provisions') belong on the lodging page,
          // but the settlement genuinely HAS food — without a `food` entry,
          // deriveNotableAbsences flagged "Food & Drink" as a notable absence
          // while the lodging list advertised food two lines up.
          if (j === 'lodging' && /food|drink|provision|meal/i.test(S.name)) {
            l.food.push({
              name: S.name,
              desc: S.desc,
              institution: A.name,
            });
          }
        }
      });
    });
    const p = s.some((A) => {
        const S = (A.name || '').toLowerCase();
        return _CRIMINAL_INST_KW.some((kw) => S.includes(kw));
      }),
      b = getInstFlags(d, s).militaryEffective / Math.max(8, m);
    !p &&
      (m >= 38 || b < 1.2) &&
      l.criminal.length === 0 &&
      !['thorp', 'hamlet', 'village'].includes(d.settType || d.tier || 'village') &&
      (b < 0.6
        ? l.criminal.push(
            {
              name: 'No law, bring coin',
              desc: 'There is no official recourse here. Disputes end with whoever can apply more violence or pay more for it.',
              institution: '(lawless)',
            },
            {
              name: 'Protection (informal)',
              desc: 'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.',
              institution: '(informal)',
            }
          )
        : l.criminal.push(
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
      !p &&
        m >= 55 &&
        b < 0.5 &&
        l.criminal.length === 0 &&
        ['village'].includes(d.settType || d.tier || '') &&
        (b < 0.4
          ? l.criminal.push(
              {
                name: 'No law, bring coin',
                desc: 'There is no official recourse here. Disputes end with whoever can apply more violence or pay more for it.',
                institution: '(lawless)',
              },
              {
                name: 'Protection (informal)',
                desc: 'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.',
                institution: '(informal)',
              }
            )
          : l.criminal.push(
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
      m >= 55 &&
        l.criminal.push({
          name: 'Contraband',
          desc: 'Untaxed or restricted goods available through back-channel contacts.',
          institution: '(covert)',
        }));
    const k = getStressFlags(d, s);
    (k.stateCrime &&
      [
        {
          name: 'Bribe a guard',
          desc: 'Payments to officials are the cost of operating here. Rates are understood if not advertised.',
        },
        {
          name: 'Disappear quietly',
          desc: 'Those who know the right people can arrange to vanish from the official register. For a price.',
        },
        {
          name: 'Intelligence on officials',
          desc: 'Knowing who can be bought, who is watched, and who reports to whom is worth coin.',
        },
      ].forEach((A) => {
        l.criminal.some((S) => S.name === A.name) ||
          l.criminal.push({
            ...A,
            institution: '(state apparatus)',
          });
      }),
      k.crimeIsGovt &&
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
        ].forEach((A) => {
          l.criminal.some((S) => S.name === A.name) ||
            l.criminal.push({
              ...A,
              institution: '(criminal governance)',
            });
        }),
      k.arcaneBlackMarket &&
        [
          {
            name: 'Forbidden components',
            desc: 'Rare and restricted magical ingredients available to those who do not ask where they come from.',
          },
          {
            name: 'Unlicensed enchantment',
            desc: 'Practitioners working outside guild oversight: cheaper, less traceable, and legally inadvisable.',
          },
          {
            name: 'Magical forgery',
            desc: 'Identification papers, writs, and seals with genuine magical authentication, fraudulently applied.',
          },
        ].forEach((A) => {
          l.criminal.some((S) => S.name === A.name) ||
            l.criminal.push({
              ...A,
              institution: '(arcane underground)',
            });
        }),
      k.religiousFraud &&
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
        ].forEach((A) => {
          l.criminal.some((S) => S.name === A.name) ||
            l.criminal.push({
              ...A,
              institution: '(religious fraud)',
            });
        }),
      k.merchantCriminalBlur &&
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
            desc: 'Establish a legitimate face for operations that benefit from appearing above board.',
          },
        ].forEach((A) => {
          l.criminal.some((S) => S.name === A.name) ||
            l.criminal.push({
              ...A,
              institution: '(commercial crime)',
            });
        }));
    const f = generateSafetyProfile(d, r, s),
      C = getInstFlags(d, s);
    (getPriorities(d), C.inst, C.criminalEffective);
    const T = new Set((f.crimeTypes || []).map((A) => A.type)),
      M = (A, S, y) => {
        g.has(A) ||
          (g.add(A),
          l.criminal.some((v) => v.name === A) ||
            l.criminal.push({
              name: A,
              desc: S,
              institution: y,
            }));
      };
    return (
      T.has('Survival crime') &&
        M(
          'Fence (word of mouth)',
          'No questions asked. Stolen goods move through back channels for a fraction of value.',
          '(covert)'
        ),
      T.has('Street gang activity') &&
        (M(
          'Protection racket',
          'Pay or have your premises damaged. The gangs are territorial and consistent.',
          '(street gang)'
        ),
        M(
          'Muscle for hire',
          'Rough up a target, intimidate a debtor, move a problem. Informal, no contract.',
          '(street gang)'
        )),
      T.has('Smuggling') &&
        M(
          'Contraband transport',
          'Goods move past checkpoints. The routes exist; the operators know the schedules.',
          '(smuggling)'
        ),
      T.has('Magical crime') &&
        M(
          'Arcane services (illicit)',
          'Magical practitioners outside guild oversight: identity work, scrying, targeted effects. Available if you know where to ask.',
          '(arcane underground)'
        ),
      T.has('Lawlessness') &&
        (M(
          'No law, bring coin',
          'There is no official recourse here. Disputes end with whoever can apply more violence or pay more for it.',
          '(lawless)'
        ),
        M(
          'Protection (informal)',
          'Pay a local strongman, a neighbor, or a gang for some measure of safety. No contracts, no guarantees.',
          '(informal)'
        )),
      T.has('Organized guild crime') &&
        M('Fence (stolen goods)', 'Move recovered goods, no questions. Expect 30-50% of value.', '(thieves guild)'),
      T.has('Background crime') &&
        M(
          'Fence (word of mouth)',
          'Ask around at the right tavern. Someone moves goods without questions.',
          '(covert)'
        ),
      Object.keys(l).forEach(function (A) {
        l[A].sort(function (S, y) {
          // Codepoint-stable, NOT localeCompare: this output feeds the hashed
          // golden master, so a locale-/ICU-dependent sort would make the SAME
          // seed emit a DIFFERENT service order across machines.
          var Sn = S.name,
            yn = y.name;
          return Sn < yn ? -1 : Sn > yn ? 1 : 0;
        });
      }),
      l
    );
  };
