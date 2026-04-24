/**
 * powerGenerator.js
 * Power structure, factions, and conflict generation
 */

import { random as _rng } from './rngContext.js';
import { priorityToCategory } from './economicGenerator.js';
import { computeEffectiveMagicPresence } from './priorityHelpers.js';
import {
  getInstFlags,
  getPriorities,
  getStressFlags,
  pick,
  pickRandom2,
  priorityToMultiplier,
  randInt,
  random01,
} from './helpers.js';
import { FACTION_DESCRIPTORS } from '../data/powerData.js';
import {
  computePublicLegitimacy,
  computeFactionRelationships,
  computeCriminalCaptureState,
  applyLegitimacyMultipliers,
} from './factionDynamics.js';
import { STRESS_ECONOMIC_EFFECTS } from '../data/npcData.js';

// RELATIONSHIP_TYPES
const RELATIONSHIP_TYPES = {
  ally: {
    name: 'Ally',
    description: 'Mutual support and cooperation',
    strength: ['weak', 'moderate', 'strong'],
  },
  rival: {
    name: 'Rival',
    description: 'Competitive opposition, not outright enmity',
    strength: ['professional', 'personal', 'bitter'],
  },
  enemy: {
    name: 'Enemy',
    description: 'Active hostility and opposition',
    strength: ['mild', 'serious', 'mortal'],
  },
  family: {
    name: 'Family',
    description: 'Blood or marriage relation',
    strength: ['distant', 'close', 'inseparable'],
  },
  patron_client: {
    name: 'Patron/Client',
    description: 'One provides support, other provides service',
    strength: ['nominal', 'significant', 'total dependence'],
  },
  lover: {
    name: 'Lover',
    description: 'Romantic or sexual relationship',
    strength: ['casual', 'serious', 'passionate'],
  },
  mentor_student: {
    name: 'Mentor/Student',
    description: 'Teaching and learning relationship',
    strength: ['formal', 'devoted', 'lifelong'],
  },
  debtor_creditor: {
    name: 'Debtor/Creditor',
    description: 'One owes the other money or favour',
    strength: ['minor', 'substantial', 'crushing'],
  },
  political: {
    name: 'Political Alliance',
    description: 'Cooperation for mutual political benefit',
    strength: ['convenience', 'stable', 'unbreakable'],
  },
  respect: {
    name: 'Mutual Respect',
    description: 'Professional regard despite differences',
    strength: ['grudging', 'genuine', 'deep'],
  },
};

// generateSuccessionNarrative

// generateRelationshipNarrative

// ─── Inlined cross-module helpers (cycle-free) ─────────────

// getTierConstraints
const getTierConstraints = (r, s, o, d) => {
  const l = (k) => s.some((f) => f.includes(k)),
    m = ['thorp', 'hamlet', 'village'].includes(o),
    h = l('garrison')
      ? 'the garrison'
      : l('barracks')
        ? 'the barracks guard'
        : l('professional guard')
          ? 'the professional guard'
          : l('city watch') || l('town watch')
            ? 'the watch'
            : l('militia')
              ? 'the militia'
              : l('mercenary')
                ? 'the mercenary company'
                : m
                  ? 'the able-bodied'
                  : 'the guard',
    g =
      d ||
      (m
        ? o === 'thorp'
          ? 'the household heads'
          : 'the village elders'
        : o === 'town'
          ? 'the town council'
          : o === 'city'
            ? 'the city council'
            : o === 'metropolis'
              ? 'the grand council'
              : 'the council'),
    w = l('merchant') || l('guild') || l('market') ? 'the merchants' : m ? 'the wealthiest household' : 'the traders',
    p = l('hospital')
      ? 'the hospital staff'
      : l('monastery') || l('friary')
        ? 'the monastery brothers'
        : l('healer')
          ? 'the healers'
          : l('church') || l('cathedral') || l('parish')
            ? 'the clergy'
            : m
              ? 'the local herbalist'
              : 'the healers',
    b =
      l('city watch') || l('town watch')
        ? 'the watch'
        : l('garrison') || l('guard')
          ? 'the guard'
          : l('militia')
            ? 'the militia'
            : m
              ? 'the neighbours'
              : 'the guard';
  return r
    .replace(/the garrison commander/gi, h.replace(/^the /, 'the ') + "'s commander")
    .replace(/the garrison/gi, h)
    .replace(/the public watch/gi, b)
    .replace(/the watch/gi, b)
    .replace(/the council/gi, g)
    .replace(/a council/gi, g)
    .replace(/council meetings/gi, g.replace(/^the /, '') + ' meetings')
    .replace(/inside the council/gi, 'inside ' + g)
    .replace(/the grain merchants/gi, w)
    .replace(/grain merchants/gi, w)
    .replace(/two healers/gi, 'two ' + p.replace(/^the /, ''))
    .replace(/the healers/gi, p)
    .replace(
      /the mages' quarter/gi,
      l('wizard') || l('mage') || l('alchemist') ? "the mages' quarter" : 'the arcane practitioners'
    );
};

// ─── Private helpers (auto-extracted) ────────────────────

// computeRelTension
// generateEconomicScore
const generateEconomicScore = (r, s, o, d, l) => {
  const m = (d == null ? void 0 : d._govFacName) || '',
    h =
      m.includes('Feudal') || m.includes('Steward') || m.includes('Manor') || m.includes('Noble') || m.includes('Lord'),
    g = m.includes('Church') || m.includes('Theocrat') || m.includes('Clergy') || m.includes('Bishop'),
    w = h ? "the lord's next court hearing" : g ? 'the next chapter assembly' : 'the next council session',
    p = [
      `A neutral figure is being pressured by both ${r.name} and ${s.name} to take a side before ${w}.`,
      'Evidence has surfaced suggesting a third party is deliberately escalating the tension between the two factions.',
    ];
  return (
    l.merchantCriminalBlur &&
      p.push(
        'The dispute is complicated by the fact that key members of both factions share business interests that neither wants exposed during arbitration.'
      ),
    l.stateCrime &&
      p.push(
        "One faction has been using official authority to harass the other's members. The harassment is technically legal."
      ),
    d.criminalEffective > 55 &&
      p.push(
        'Someone is offering to resolve the conflict "permanently" for a price. Both factions have received the offer. Neither has refused yet.'
      ),
    p.slice(0, 3)
  );
};

// random01

// STRESS_FLAVOR
const STRESS_FLAVOR = {
  under_siege: ['debtor_creditor', 'enemy', 'patron_client'],
  famine: ['debtor_creditor', 'patron_client', 'political'],
  occupied: ['ally', 'debtor_creditor', 'enemy'],
  politically_fractured: ['enemy', 'rival', 'political'],
  indebted: ['debtor_creditor', 'patron_client'],
  recently_betrayed: ['ally', 'patron_client', 'enemy'],
  infiltrated: ['ally', 'patron_client'],
  plague_onset: ['patron_client', 'debtor_creditor'],
  succession_void: ['rival', 'enemy', 'political'],
  monster_pressure: ['patron_client', 'debtor_creditor'],
};

// STRESS_RUMORS
const STRESS_RUMORS = [
  (r) => {
    var s;
    return `${r.npc1Name} and ${r.npc2Name} are connected by something neither discusses openly — ${((s = r.description.split('—')[1]) == null ? void 0 : s.trim()) || r.tension}`;
  },
  (r) =>
    `${r.npc1Name}'s relationship with ${r.npc2Name} is more complicated than their public roles suggest. ${r.tension}`,
  (r) => {
    var s;
    return `There is a ${((s = r.typeName) == null ? void 0 : s.toLowerCase()) || 'significant'} between ${r.npc1Name} and ${r.npc2Name}. ${r.tension}`;
  },
  (r) => r.tension,
];

// pickFactionName (local)
const pickFactionName = (r) => {
  var o;
  const s = {};
  return (
    r.forEach((d) => {
      s[d.category] = (s[d.category] || 0) + 1;
    }),
    ((o = Object.entries(s).sort((d, l) => l[1] - d[1])[0]) == null ? void 0 : o[0]) || 'other'
  );
};

export const computeRelTension = (r, s, o, d) => {
  const l = [r.category, s.category].sort().join('_'),
    m = r.power - s.power;
  if (o.merchantCriminalBlur && l.includes('economy') && l.includes('criminal'))
    return _rng() < 0.6 ? STRESS_ECONOMIC_EFFECTS.econ_crim_blur : STRESS_ECONOMIC_EFFECTS.econ_crim_exploitation;
  if (o.stateCrime && l.includes('military') && l.includes('criminal'))
    return STRESS_ECONOMIC_EFFECTS.mil_crim_corruption;
  if (!o.stateCrime && l.includes('military') && l.includes('criminal'))
    return d.militaryEffective > d.criminalEffective
      ? STRESS_ECONOMIC_EFFECTS.mil_crim_suppression
      : STRESS_ECONOMIC_EFFECTS.mil_crim_corruption;
  if (o.merchantArmy && l.includes('economy') && l.includes('military'))
    return STRESS_ECONOMIC_EFFECTS.econ_mil_contract;
  if (o.crusaderSynthesis && l.includes('religious') && l.includes('military'))
    return STRESS_ECONOMIC_EFFECTS.rel_mil_crusader;
  if (o.religiousFraud && l.includes('religious') && l.includes('criminal'))
    return STRESS_ECONOMIC_EFFECTS.rel_crim_fraud;
  if (o.arcaneBlackMarket && l.includes('magic') && l.includes('criminal'))
    return STRESS_ECONOMIC_EFFECTS.mag_crim_market;
  if (l.includes('government') && l.includes('economy') && d.economyOutput > 65)
    return STRESS_ECONOMIC_EFFECTS.gov_econ_dependence;
  if (l.includes('government') && l.includes('military')) {
    const _r = _rng();
    return _r < 0.35
      ? STRESS_ECONOMIC_EFFECTS.gov_mil_friction
      : _r < 0.6
        ? STRESS_ECONOMIC_EFFECTS.wary_alliance
        : _r < 0.8
          ? STRESS_ECONOMIC_EFFECTS.genuine_respect
          : STRESS_ECONOMIC_EFFECTS.peer_rivalry;
  }
  if (Math.abs(m) >= 4) return _rng() < 0.5 ? STRESS_ECONOMIC_EFFECTS.mentor_legacy : STRESS_ECONOMIC_EFFECTS.old_debt;
  const h = (M) => {
      const A = M.personality;
      return A ? (Array.isArray(A) ? A.join(' ') : [A.dominant, A.flaw, A.modifier].filter(Boolean).join(' ')) : '';
    },
    g = h(r),
    w = h(s),
    p = g.includes('arrogant') && w.includes('arrogant'),
    b = g.includes('greedy') && w.includes('greedy'),
    k = g.includes('pragmatic') || w.includes('pragmatic');
  if (p || b || (r.category === s.category && _rng() < 0.2)) return STRESS_ECONOMIC_EFFECTS.peer_rivalry;
  if (k) return STRESS_ECONOMIC_EFFECTS.mutual_leverage;
  const f = [
      {
        archetype: STRESS_ECONOMIC_EFFECTS.wary_alliance,
        weight: 2,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.mutual_leverage,
        weight: 1.8,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.genuine_respect,
        weight: 1.5,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.peer_rivalry,
        weight: 1.5,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.old_debt,
        weight: 1.2,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.bitter_history,
        weight: 0.8 * (d.criminalEffective / 50),
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.family_complication,
        weight: 0.7,
      },
      {
        archetype: STRESS_ECONOMIC_EFFECTS.mentor_legacy,
        weight: 0.8,
      },
    ],
    C = f.reduce((M, A) => M + A.weight, 0);
  let T = _rng() * C;
  for (const { archetype: M, weight: A } of f) if (((T -= A), T <= 0)) return M;
  return STRESS_ECONOMIC_EFFECTS.wary_alliance;
};

// genSuccessionNarr
export const genSuccessionNarr = (r) => {
  var o, d, l, m;
  const s = [];
  return (
    r.topTension === 'succession_crisis' &&
      s.push(
        `${r.name}'s ruler is ageing and the succession is contested; ${r.topFaction || 'the dominant faction'} has already positioned for the transition.`
      ),
    r.topTension === 'corruption_scandal' &&
      s.push(
        `Evidence of corruption in ${r.govFaction || 'the council'} has surfaced; ${r.topNPCName ? r.topNPCName + ', the ' + r.topNPCRole + ',' : 'the most senior official'} is part of the answer and part of the problem.`
      ),
    r.topTension === 'outside_debt' &&
      s.push(
        `${r.name}'s debt obligations are becoming visible in its decisions; the creditor hasn't moved yet, but the calculation of when to move is being made.`
      ),
    r.topTension === 'infiltration_fear' &&
      s.push(
        `Rumours of enemy agents in ${r.name} have made the settlement paranoid in ways that are being exploited by at least one of the factions paranoia is supposed to protect against.`
      ),
    !r.isViable &&
      r.viabilityIssues?.length > 0 &&
      s.push(
        `${r.name} has a structural problem it hasn't solved — ${((o = r.viabilityIssues[0].message) == null ? void 0 : o.toLowerCase()) || 'an economic vulnerability'} — that will eventually force a decision.`
      ),
    r.hasNeighborConflict &&
      r.neighbor &&
      s.push(
        `The relationship with ${r.neighbor} has deteriorated to the point where ${r.name}'s ${r.topNPCRole || 'leadership'} is making decisions with one eye on what conflict would cost.`
      ),
    (r.prosperity === 'Wealthy' || r.prosperity === 'Thriving') &&
      s.push(
        `${r.name} is prosperous enough that the real conflicts are about who controls the surplus — ${r.topFaction || 'the dominant faction'} has the most and wants more.`
      ),
    r.prosperity === 'Poor' &&
      s.push(
        `${r.name} is poor enough that every resource decision is a political one; ${r.govFaction || 'the council'} and ${r.topFaction || 'the merchant class'} disagree about who bears the cost.`
      ),
    r.commodity &&
      r.isCrossroads &&
      s.push(
        `${r.name} sits where trade roads cross; its ${r.commodity} trade moves through it in both directions, and whoever controls the tariff controls the settlement's revenue — a fact not lost on ${r.topFaction || 'the guilds'}.`
      ),
    r.commodity &&
      r.isPort &&
      s.push(
        `${r.name}'s port handles more ${r.commodity} than the official records show; the gap between what arrives and what is taxed is understood by ${r.topFaction || 'the merchant class'} and the guard alike.`
      ),
    (((d = r.stability) != null && d.includes('Unstable')) ||
      ((l = r.stability) != null && l.includes('Fractured')) ||
      ((m = r.stability) != null && m.includes('Volatile'))) &&
      s.push(
        `${r.name} looks stable from the outside; the relationship between ${r.topFaction || 'the dominant faction'} and ${r.govFaction || 'the council'} is more contested than it appears.`
      ),
    r.topTension === 'economic_disparity' &&
      s.push(
        `The wealth gap in ${r.name} has become a fact of daily life — ${r.topFaction || 'the merchant class'} controls the surplus and ${r.govFaction || 'the council'} cannot or will not force redistribution. Resentment is structural now, not episodic.`
      ),
    r.topTension === 'religious_tension' &&
      s.push(
        `Two versions of faith are competing in ${r.name}; both claim legitimacy and both have the ear of someone powerful. ${r.govFaction || 'The council'} has avoided taking sides so far, which means both factions resent it equally.`
      ),
    r.topTension === 'guild_conflict' &&
      s.push(
        `The guild dispute in ${r.name} is not about craft standards — it is about who controls access to the market. ${r.topFaction || 'The dominant guild'} has held the advantage long enough that the challengers have stopped playing by guild rules.`
      ),
    r.topTension === 'external_threat' &&
      r.neighbor &&
      s.push(
        `${r.name} is watching ${r.neighbor} and does not like what it sees. ${r.govFaction || 'The council'} and ${r.milForce || 'the garrison'} disagree about what to do about it, and that disagreement is now public.`
      ),
    r.topTension === 'external_threat' &&
      !r.neighbor &&
      s.push(
        `The threat approaching ${r.name} is not yet visible to most residents. ${r.topNPCName || 'The most senior figure'} knows the intelligence and has not shared it. The decision about when to share it — and how — is the real crisis.`
      ),
    r.topTension === 'resource_scarcity' &&
      r.commodity &&
      s.push(
        `${r.name}'s ${r.commodity} supply is tighter than the official position acknowledges. ${r.topFaction || 'The merchant class'} knows the real numbers. ${r.govFaction || 'The council'} has been told a different version.`
      ),
    r.topTension === 'resource_scarcity' &&
      !r.commodity &&
      s.push(
        `Something essential in ${r.name} is running short — food, water, or coin. The shortage is being managed through allocation decisions that are, functionally, political decisions. ${r.govFaction || 'The council'} controls the allocation.`
      ),
    r.topTension === 'crime_wave' &&
      s.push(
        `${r.name}'s criminal problem has grown past the point ${r.milForce || 'the guard'} can contain through normal enforcement. The question is whether ${r.govFaction || 'the council'} brings in more force, negotiates, or finds a scapegoat. Someone powerful benefits from each option.`
      ),
    r.topTension === 'magical_controversy' &&
      s.push(
        `Magic in ${r.name} has done something recently that people cannot agree on how to interpret. ${r.govFaction || 'The council'} is being pressured to regulate — by people who disagree about what regulation means.`
      ),
    r.topTension === 'generational_divide' &&
      s.push(
        `In ${r.name} the older residents and the younger ones are not arguing about the same things. The older generation thinks the argument is about values; the younger thinks it is about access. Both are right.`
      ),
    r.topTension === 'occupation_legacy' &&
      s.push(
        `${r.name} carries the memory of an occupation that officially ended. Collaborators and resisters still share the same streets, the same market, the same ${r.govFaction || 'council'}. The official position is that this is resolved.`
      ),
    r.topTension === 'disputed_land' &&
      s.push(
        `A land dispute in ${r.name} that was dormant is now active — someone filed a claim, or found a document, or simply started pressing. ${r.govFaction || 'The council'} has delayed ruling because there is no outcome that does not cost them something.`
      ),
    r.topTension === 'population_friction' &&
      s.push(
        `${r.name} is absorbing people it did not plan for, or losing people it expected to keep. Either way, the settlement's social assumptions no longer match its actual composition, and ${r.govFaction || 'the council'} is governing for the settlement that used to exist.`
      ),
    r.topTension === 'leadership_vacuum' &&
      s.push(
        `${r.name} has not had a strong authority since ${r.topNPCName || 'the last leader'} left or died. The pretense of normal governance is maintained. Every decision of consequence is being deferred or made informally by ${r.topFaction || 'the faction with the most to gain'}.`
      ),
    s.push(
      `The most important thing happening in ${r.name} right now is happening below the surface — ${r.topNPCName ? r.topNPCName + ', the ' + r.topNPCRole + ',' : 'the most senior figure'} knows it and isn't discussing it.`
    ),
    s
  );
};

// genRelNarrative
export const genRelNarrative = (r) => {
  var p, b;
  const { relationships: s = [], stress: o, config: d = {} } = r;
  if (!s.length || random01(0.4)) return null;
  const l = ((p = (o ? (Array.isArray(o) ? o : [o]) : [])[0]) == null ? void 0 : p.type) || null,
    m = l ? STRESS_FLAVOR[l] || [] : [],
    h = s.map((k) => {
      let f = _rng() * 0.5;
      return (
        m.includes(k.type) && (f += 2),
        k.flagDriven && (f += 1),
        k.tension && k.tension.length > 30 && (f += 0.5),
        {
          r: k,
          score: f,
        }
      );
    });
  h.sort((k, f) => f.score - k.score);
  const g = (b = h[0]) == null ? void 0 : b.r;
  if (!g) return null;
  const w = pickRandom2(STRESS_RUMORS)(g);
  return {
    npc1: g.npc1Name,
    npc2: g.npc2Name,
    type: g.typeName,
    phrasing: w,
    full: g.description,
    tension: g.tension,
  };
};

// ─────────────────────────────────────────────────────────

// generatePowerStructure

// ─────────────────────────────────────────────────────────

// generatePowerStructure

// inferFactionCategory — map faction name → category for economy correlation
const FACTION_CATEGORY_KEYWORDS = {
  military: [
    'Military',
    'Guard',
    'War Council',
    'Garrison',
    'Mercenary',
    'Occupation',
    'Resistance',
    'Monster Hunter',
    'Adventurer',
    'Charter',
    'Watch',
    'Knight',
    'Soldier',
    'Huscarl',
    'Huskarl',
    'Hird',
  ],
  religious: [
    'Religious',
    'Faith',
    'Church',
    'Temple',
    'Congregation',
    'Shrine',
    'Clergy',
    'Conversion',
    'Old Faith',
    'Ecclesiastical',
    'Diocese',
    'Bishop',
    'Patriarch',
    'Holy',
    'Theocrat',
    'Priestly',
    'Devout',
    'Friar',
    'Monastery',
    'Cathedral',
  ],
  criminal: [
    'Thiev',
    'Criminal',
    'Smuggl',
    'Underground',
    'Cartel',
    'Corrupt',
    'Bandit',
    'Assassin',
    'Shadow',
    'Hidden Hand',
    'Black Circle',
    'Underworld',
  ],
  magic: ['Arcane', 'Mage', 'Wizard', 'Sorcerer', 'Alchemist', 'Occult', 'Hedge', 'Enchant', 'Tower', 'Spellcast'],
  economy: [
    'Merchant',
    'Craft',
    'Guild',
    'Trade',
    'Market',
    'Banking',
    'Grain',
    'Farmer',
    'Cloth',
    'Commerce',
    'Factor',
    'Artisan',
    'Ledger',
    'Compact',
    'Consortium',
    'Bloc',
    'Oligarch',
  ],
  government: [
    'Council',
    'Authority',
    'Administration',
    'Governor',
    'Steward',
    'Assembly',
    'Senate',
    'Civic',
    'Municipal',
    'Electoral',
    'Democratic',
    'Alderman',
    'Magistrate',
    'Court',
    'Chancery',
  ],
  noble: [
    'Noble',
    'Aristocrat',
    'Lord',
    'Lady',
    'Manor',
    'Landed',
    'Gentry',
    'Feudal',
    'Ducal',
    'Royal',
    'House',
    'Estate',
    'Heritage',
  ],
};

const inferFactionCategory = (factionName) => {
  for (const [cat, keywords] of Object.entries(FACTION_CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => factionName.includes(kw))) return cat;
  }
  return 'other'; // changed: 'other' not 'government' — prevents governing dump
};

export const generatePowerStructure = (tier, economicState, tradeRoute, config, institutions = []) => {
  var oa;
  const instNames = (institutions || []).map((N) => (N.name || '').toLowerCase()),
    priorities = getPriorities(config),
    instFlags = getInstFlags(config, institutions),
    stressFlags = getStressFlags(config, institutions),
    p = [],
    b = tier === 'metropolis' || tier === 'metropolis' ? 35 : tier === 'city' ? 33 : tier === 'town' ? 31 : 30,
    k = Math.round(25 * priorityToMultiplier(instFlags.economyOutput)),
    f = Math.round(23 * priorityToMultiplier(instFlags.militaryEffective)),
    C = Math.round(22 * priorityToMultiplier(instFlags.religionInfluence)),
    T =
      instFlags.criminalEffective > 42 && (tier === 'city' || tier === 'metropolis' || instFlags.criminalEffective > 58)
        ? Math.round(12 * priorityToMultiplier(instFlags.criminalEffective))
        : 0,
    M =
      tier !== 'thorp' && tier !== 'hamlet'
        ? Math.round(17 * priorityToMultiplier(instFlags.economyOutput * 0.75 + 10))
        : 0,
    A =
      instFlags.magicInfluence > 28 && (tier === 'city' || tier === 'metropolis')
        ? Math.round(14 * priorityToMultiplier(instFlags.magicInfluence))
        : instFlags.magicInfluence > 55 &&
            tier === 'town' &&
            (institutions || []).some(function (N) {
              var ye = (N.name || '').toLowerCase();
              return ye.includes('mage') || ye.includes('wizard') || ye.includes('alchemist') || ye.includes('arcane');
            })
          ? Math.round(9 * priorityToMultiplier(instFlags.magicInfluence))
          : 0,
    S = (institutions || []).some((N) => {
      var ye = (N.name || '').toLowerCase();
      return (
        ye.includes('lord') ||
        ye.includes('noble') ||
        ye.includes('manor') ||
        ye.includes('royal seat') ||
        ye.includes('feudal')
      );
    }),
    y = priorities.economy > 70 && !S,
    v = (institutions || []).some(function (N) {
      return (N.name || '').toLowerCase().includes('royal seat');
    }),
    j = Math.round(22 * priorityToMultiplier(instFlags.militaryEffective * 0.65 + instFlags.economyOutput * 0.1)),
    z = S ? (v ? 1.9 : 1.7) : 1,
    $ = y ? 0.55 : 1,
    Y = tier === 'town' ? (S ? 1.15 : 0.85) : 1,
    J = tier === 'thorp' ? 0 : Math.round(tier === 'hamlet' || tier === 'village' ? j * z * $ * 0.75 : j * z * $ * Y),
    D = institutions.map((N) => (N.name || '').toLowerCase()),
    W = {
      'head-of-household consensus': tier === 'hamlet' ? 'Elder Consensus' : 'Household Council',
      'informal elder consensus': tier === 'hamlet' ? 'Free Elder Council' : 'Elder Council',
      'village reeve': 'Elected Reeve',
      "lord's steward": 'Feudal Stewardship',
      "lord's appointee": 'Feudal Appointee',
      'mayor and council': tier === 'metropolis' ? 'Grand Council' : tier === 'city' ? 'City Council' : 'Town Council',
      'guild governance':
        tier === 'metropolis' ? 'Grand Guild Council' : tier === 'city' ? 'Guild Authority' : 'Guild Council',
      'guild consortium': tier === 'metropolis' ? 'Grand Guild Consortium' : 'Merchant Guild Council',
      'noble governor': tier === 'metropolis' ? 'Ducal Governorship' : 'Noble Governorship',
      'merchant oligarchy': tier === 'metropolis' ? 'Grand Merchant Oligarchy' : 'Merchant oligarchy',
      'democratic assembly': 'Democratic assembly',
      'city-state government': 'City-State Council',
      'royal seat': 'Royal Authority',
    };
  let U = null;
  for (const [N, ye] of Object.entries(W))
    if (D.some((he) => he.includes(N))) {
      U = ye;
      break;
    }
  const re = {
      military: priorities.military,
      religion: priorities.religion,
      economy: priorities.economy,
      criminal: priorities.criminal,
      magic: priorities.magic,
    },
    ie = Object.entries(re).reduce((N, ye) => (N[1] > ye[1] ? N : ye))[0],
    q = re[ie];
  let P,
    I = null;
  if (U) {
    const N =
        q > 65
          ? {
              military: 'military-dominated',
              religion: 'theocratic-aligned',
              economy: 'commerce-driven',
              criminal: 'corruption-riddled',
              magic: 'arcane-advised',
            }[ie]
          : null,
      ye =
        [
          'Royal Authority',
          'Noble Governorship',
          'Feudal Stewardship',
          'Feudal Appointee',
          'Household Council',
          'Elder Council',
          'Elected Reeve',
        ].includes(U) ||
        (U === 'Merchant oligarchy' && ie === 'economy') ||
        (U === 'Merchant Guild Council' && ie === 'economy') ||
        (U === 'Guild Council' && ie === 'economy') ||
        (U === 'Democratic assembly' && ie === 'religion');
    if (U && (U === 'Town Council' || U === 'City Council' || U === 'Grand Council')) {
      const he = N
        ? {
            military:
              U === 'Grand Council'
                ? 'Grand Military Council'
                : U === 'City Council'
                  ? 'Military City Council'
                  : 'Military Council',
            religion:
              U === 'Grand Council'
                ? 'High Theocratic Council'
                : U === 'City Council'
                  ? 'Ecclesiastical Council'
                  : 'Church Council',
            economy:
              U === 'Grand Council'
                ? 'Grand Merchant Senate'
                : U === 'City Council'
                  ? 'Merchant City Council'
                  : 'Merchant Council',
            criminal:
              U === 'Grand Council'
                ? 'Shadow Senate'
                : U === 'City Council'
                  ? 'Corrupt City Council'
                  : q > 72
                    ? 'Corrupt Council'
                    : 'Town Council',
            magic: U === 'Grand Council' ? 'Arcane Senate' : 'Arcane Council',
          }[ie]
        : null;
      P = (U === 'Town Council' || U === 'City Council' || U === 'Grand Council') && he ? he : U;
    } else P = U;
    I = N && !ye ? N : null;
  } else
    ['thorp', 'hamlet', 'village'].includes(tier)
      ? (P =
          (q > 65 &&
            {
              military: "Headman's Authority",
              religion: 'Priestly Guidance',
              economy: 'Household Council',
              criminal: 'Elder Council',
              magic: 'Elder Council',
            }[ie]) ||
          'Elder Council')
      : tier === 'town'
        ? (P =
            q > 65
              ? {
                  military: 'Military Council',
                  religion: 'Church Council',
                  economy: 'Merchant Council',
                  criminal: 'Corrupt Council',
                  magic: 'Arcane Council',
                }[ie] || 'Town Council'
              : (q > 55 &&
                  {
                    military: 'Military Council',
                    religion: 'Church Council',
                    economy: 'Merchant Council',
                    criminal: 'Corrupt Council',
                    magic: 'Arcane Council',
                  }[ie]) ||
                'Town Mayor')
        : (P =
            tier === 'metropolis'
              ? q > 65
                ? {
                    military: 'Grand Military Council',
                    religion: 'High Theocratic Council',
                    economy: 'Grand Merchant Senate',
                    criminal: 'Shadow Senate',
                    magic: 'Arcane Senate',
                  }[ie] || 'Grand Council'
                : (q > 55 &&
                    {
                      military: 'Grand Council',
                      religion: 'Grand Council',
                      economy: 'Grand Council',
                      criminal: 'Grand Council',
                      magic: 'Grand Council',
                    }[ie]) ||
                  'Grand Council'
              : (P =
                  tier === 'city' || tier === 'metropolis'
                    ? q > 65
                      ? {
                          military: 'Military City Council',
                          religion: 'Ecclesiastical Council',
                          economy: 'Merchant City Council',
                          criminal: 'Corrupt City Council',
                          magic: 'Arcane Council',
                        }[ie] || 'City Council'
                      : (q > 50 &&
                          {
                            military: 'City Council',
                            religion: 'City Council',
                            economy: 'City Council',
                            criminal: 'City Council',
                            magic: 'City Council',
                          }[ie]) ||
                        'City Council'
                    : q > 65
                      ? {
                          military: 'Military Council',
                          religion: 'Church Council',
                          economy: 'Merchant Council',
                          criminal: 'Town Council',
                          magic: 'Arcane Council',
                        }[ie] || 'Town Council'
                      : (q > 55 &&
                          {
                            military: 'Military Council',
                            religion: 'Church Council',
                            economy: 'Merchant Council',
                            criminal: 'Town Council',
                            magic: 'Arcane Council',
                          }[ie]) ||
                        'Town Council'));
  let H = null;
  U ||
    (['thorp', 'hamlet', 'village'].includes(tier) && q > 65
      ? (H =
          {
            military: 'defended',
            religion: 'church-guided',
            economy: 'merchant-led',
            criminal: 'compromised',
            magic: 'mage-advised',
          }[ie] || null)
      : tier === 'town' &&
        q > 55 &&
        q <= 65 &&
        (H =
          {
            military: 'garrison-backed',
            religion: 'church-guided',
            economy: 'commerce-driven',
            criminal: 'corruption-riddled',
            magic: 'arcane-advised',
          }[ie] || null));
  const Z = (typeof I < 'u' ? I : null) || H,
    ne = {
      'Household Council':
        'Settlement governed by heads of household; decisions by informal consensus among property owners.',
      'Elder Council': 'Respected elders guide the community; authority is moral and traditional rather than formal.',
      'Elected Reeve': 'A reeve elected from the peasantry manages labour and mediates disputes under noble oversight.',
      'Feudal Stewardship':
        "A lord's steward administers the settlement; authority flows downward from the noble, not upward from residents.",
      'Feudal Appointee':
        'A lord-appointed official governs; all authority is delegated from above and revocable at will.',
      'Town Council':
        'An elected or appointed council governs; merchants, guilds, and prominent families compete for seats.',
      'City Council':
        'A full civic council governs the city; aldermen, guild representatives, and appointed officials manage taxation, law, and infrastructure at scale.',
      'Grand Council':
        'A grand council of senior officials, guild masters, and appointed magnates governs the metropolis; internal factions are constant, and real power shifts between blocs.',
      'Military City Council':
        'Military officers hold decisive influence over civilian governance; the council ratifies what the commanders decide.',
      'Ecclesiastical Council':
        'Senior clergy hold effective civic authority alongside elected aldermen; religious law shapes civil policy.',
      'Merchant City Council': 'Wealthy merchants dominate council seats; trade interests drive policy and taxation.',
      'Corrupt City Council':
        'Nominally elected, effectively purchased; council seats are openly traded among criminal and commercial interests.',
      'Ducal Governorship':
        'A duke or duchess governs the metropolis by royal appointment; the city is the administrative capital of a large territory.',
      'Grand Merchant Oligarchy':
        'The wealthiest merchant houses of the metropolis form a formal oligarchic senate; political power is inseparable from commercial dominance.',
      'Grand Guild Consortium':
        "A formal consortium of the metropolis's most powerful guild masters holds civic authority; membership in the consortium is itself a prize.",
      'Guild Authority':
        "The guilds have formalised their political control; the city's elected bodies are largely ceremonial.",
      'Military Council':
        'Military commanders and garrison officers hold decisive political weight; civic matters defer to security priorities.',
      'Church Council':
        'Religious authorities hold formal civic influence; canonical law and civil ordinance are intertwined.',
      'Merchant Council':
        'Prominent merchants dominate the council; trade and taxation policy favour commercial interests.',
      'Corrupt Council':
        'The governing body is systematically compromised; offices are sold and justice is purchasable.',
      'Arcane Council':
        'Mages and scholars hold formal civic positions; arcane expertise confers political legitimacy.',
      'Grand Merchant Senate':
        'A senate of the wealthiest merchant houses governs; political influence is measured in coin, trade concessions, and debt.',
      'Grand Military Council':
        'Military commanders and their political allies hold power; civilian governance is subordinate to the needs of the war machine.',
      'High Theocratic Council':
        'Senior clergy hold civic authority; religious law and civil law are functionally the same.',
      'Arcane Senate': 'A senate of senior mages governs; magical expertise confers political legitimacy.',
      'Shadow Senate': 'Nominal governance masks a criminal oligarchy; the real decisions happen in back rooms.',
      'Guild Council': 'The guilds collectively govern; economic power directly translates to political authority.',
      'Merchant Guild Council':
        'A consortium of guild masters holds power; policy is shaped by trade interests and inter-guild bargaining.',
      'Noble Governorship':
        'A noble governor rules by hereditary or royal appointment; the settlement has little self-governance.',
      'Merchant oligarchy':
        'Wealthy merchants hold exclusive power; political office is effectively purchased through commercial success.',
      'Democratic assembly':
        'An assembly of citizens votes on major decisions; factions lobby for influence rather than seizing control.',
      'City-State Council':
        'A city-state council governs with considerable autonomy; internal factions compete for control of policy.',
      'Royal Authority':
        'A royal seat concentrates formal authority at the apex of the realm. How much real power the monarch exercises depends on their strength, the loyalty of the nobility, and whether anyone is currently contesting that loyalty.',
    },
    ee = {
      'Military Council': 'Military commanders hold direct political authority; civic life is subordinate to defence.',
      'Theocratic Council': 'Religious leadership governs directly; doctrine shapes law and policy.',
      'Church Council': 'Clergy hold substantial political authority alongside civic governance.',
      'Merchant oligarchy':
        'Wealthy merchants hold exclusive power; office is effectively purchased through commercial success.',
      'Merchant Council': 'Merchant interests dominate the council; trade policy is the primary concern.',
      'Corrupt Oligarchy': 'Criminal networks have captured governance; official authority is a facade.',
      'Shadowed Council':
        'Criminal influence shapes decisions behind the scenes; officials are systematically compromised.',
      'Arcane Council': 'Magical practitioners govern; arcane power legitimises political authority.',
      'Mixed Council': 'Power is distributed across multiple factions without a clear dominant authority.',
      'Elder Council': 'Community elders guide decisions by consensus; authority is moral and traditional, not formal.',
      'Town Council':
        'An elected or appointed council governs; merchants, guilds, and prominent families compete for seats.',
    },
    E = ne[U] || ee[P] || ee['Mixed Council'],
    _ = q > 80 ? 18 : q > 65 ? 12 : q > 50 ? 6 : 0,
    O = [
      'Theocratic Council',
      'Military Council',
      'Arcane Council',
      'Royal Authority',
      'Merchant oligarchy',
      'Corrupt Oligarchy',
      'City-State Council',
    ].includes(P)
      ? b + 8
      : ['Feudal Stewardship', 'Feudal Appointee', 'Elder Council', 'Household Council', 'Elected Reeve'].includes(P)
        ? b - 4
        : b + 2;
  if (
    (p.push({
      faction: P,
      modifier: Z || null,
      power: O + _,
      desc: E,
      isGoverning: !0,
    }),
    k > 5 &&
      !(tier === 'thorp' && k < 12) &&
      (!['thorp', 'hamlet', 'village'].includes(tier) ||
        (institutions || []).some(function (N) {
          var ye = (N.name || '').toLowerCase();
          return ye.includes('market') || N.category === 'Economy';
        })))
  ) {
    const N =
        P &&
        (P.includes('Merchant oligarchy') || P.includes('Merchant Guild Council') || P.includes('Merchant Council')),
      he = Math.round(k * (N ? 1.25 : 1)),
      De = ((config == null ? void 0 : config.tradeRouteAccess) || 'road') === 'port',
      Mi = ((config == null ? void 0 : config.tradeRouteAccess) || 'road') === 'crossroads',
      cr =
        N && he >= 12
          ? 'The ruling class and the merchant class are the same people; commercial decisions are political decisions and civic access is purchased.'
          : he >= 26
            ? De
              ? 'International merchant houses controlling port licences and import flows; their political leverage is structural, not merely financial.'
              : Mi
                ? 'Dominant commercial class at a trade nexus; they set prices, control warehousing, and fund the council.'
                : 'Dominant commercial class; their capital and networks give them leverage even formal institutions must respect.'
            : he >= 18
              ? De
                ? 'Maritime traders and factor houses controlling import and export flows; prosperous, well-connected, and aware of both.'
                : Mi
                  ? "Market merchants who profit from the settlement's position; buy from one direction, sell to another, lobby for both."
                  : 'Established merchant community; fund civic works and expect council access in return.'
              : he >= 10
                ? 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.'
                : 'A small trader community present at market days; politically active in minor disputes, limited in broader leverage.',
      bt =
        (economicState == null ? void 0 : economicState.prosperity) === 'Wealthy' ||
        (economicState == null ? void 0 : economicState.prosperity) === 'Thriving'
          ? 'Merchant Guilds (dominant)'
          : 'Merchant Guilds',
      tr = he,
      ft = (O || b) + (_ || 0),
      Fr = bt.includes('dominant') ? Math.round(ft * 0.88) : 9999;
    p.push({
      faction: bt,
      power: Math.min(tr, Fr),
      desc: cr,
    });
  }
  if (J > (tier === 'town' && !S ? 10 : 5)) {
    const N =
        P &&
        (P.includes('Feudal') ||
          P.includes('Noble') ||
          P.includes('Royal Authority') ||
          P.includes('Household Council')),
      ye =
        P &&
        (P.includes('Merchant oligarchy') ||
          P.includes('Democratic assembly') ||
          P.includes('Guild Council') ||
          P.includes('Merchant Guild Council')),
      he =
        tier === 'hamlet' || tier === 'village'
          ? 'Manor Household'
          : tier === 'town'
            ? 'Landed Gentry'
            : tier === 'metropolis'
              ? 'Noble Houses'
              : 'Noble Families',
      De =
        S && N
          ? priorityToCategory(priorities.military) === 'very_high'
            ? 'Hereditary landowners who are the governing authority here; military levies, land rents, and judicial rights all flow through noble title. Their word is law within their demesne.'
            : J > 20
              ? 'Hereditary landowners whose land rights and military obligations are structurally embedded in governance here; the council works alongside them, not over them.'
              : J > 10
                ? 'Hereditary landowners with genuine but not dominant feudal claims; they shape decisions at the margins more than they command them.'
                : 'Noble families with residual feudal claims; the formal obligations are real, but other factions set the practical agenda day to day.'
          : ye
            ? priorityToCategory(priorities.economy) === 'very_high'
              ? 'Old landed families being systematically displaced by merchant wealth; they retain hereditary title but little real leverage. A dangerous combination of pride and declining power.'
              : 'Landed families increasingly outpaced by merchant capital; they compete for council seats, marriage alliances, and royal appointments to maintain relevance.'
            : tier === 'hamlet' || tier === 'village'
              ? "The local lord's household; land rights and feudal obligation give them a formal claim to authority, though other factions hold more practical influence day to day."
              : S && P && P.includes('Royal Authority')
                ? J > 25
                  ? "The great noble houses are the crown's military and fiscal foundation — and they know it. Royal policy is negotiated with them as much as decreed over them."
                  : J > 15
                    ? 'Hereditary landowners whose cooperation the crown depends on for levies, taxes, and regional order. Not powerful enough to dictate, but essential enough to court.'
                    : 'Noble families nominally loyal to the crown, but watching which way the political wind is blowing before committing resources.'
                : priorityToCategory(priorities.military) === 'very_high'
                  ? "Militarised noble families whose landholdings double as fortified estates; they provide the settlement's heavy cavalry and expect political weight in return."
                  : J > 20
                    ? 'Landed noble families whose hereditary rights, land rents, and marriage networks give them structural influence the elected council cannot easily override.'
                    : J > 10
                      ? tier === 'metropolis'
                        ? 'Hereditary great families with land grants, court appointments, and dynastic marriage networks; structurally embedded in governance even when not formally in power.'
                        : tier === 'city'
                          ? 'Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital.'
                          : 'Gentry families with local landholdings; active in civic politics but outpaced by merchant capital in raw financial leverage'
                      : 'Minor landed families with limited political reach; present in civic life but rarely decisive.';
    p.push({
      faction: he,
      power: J,
      desc: De,
    });
  }
  if (f > 5 && (tier !== 'thorp' || priorities.military > 60)) {
    const N =
        priorityToCategory(priorities.military) === 'very_high'
          ? f > 25
            ? ['city', 'metropolis'].includes(tier)
              ? 'Standing army with genuine political weight; command appointments are patronage, and the council knows it.'
              : "Significant military force for this scale; the commander's opinion on civic matters carries institutional weight."
            : 'Significant military presence; officers hold political influence disproportionate to formal civic rank.'
          : priorityToCategory(priorities.military) === 'low'
            ? ['hamlet', 'village', 'thorp'].includes(tier)
              ? 'Part-time militia with limited organisation; authority is moral rather than institutional.'
              : 'Undermanned and underfunded; unable to enforce law consistently and aware of it.'
            : ['thorp', 'hamlet', 'village'].includes(tier)
              ? "Armed patrol and informal militia; the settlement's primary recourse when disputes turn physical."
              : tier === 'town'
                ? 'Town watch and militia; enforce ordinances, manage disorder, and report to the council.'
                : f > 18
                  ? 'Well-funded garrison and city watch; a reliable instrument of civic order with growing institutional confidence.'
                  : 'Garrison and city watch; law enforcement and external defence, stretched between multiple responsibilities.',
      he =
        P && (P.toLowerCase().includes('military council') || P.toLowerCase().includes('martial'))
          ? N +
            ' Operationally distinct from the command council — these are the soldiers and watchmen, not the officers who govern.'
          : N,
      De = P && P.includes('Merchant oligarchy') ? Math.round((typeof _bFinal < 'u' ? _bFinal : k) * 0.85) : 9999;
    p.push({
      faction: 'Military/Guard',
      power: Math.min(f, De),
      desc: he,
    });
  }
  const X = D.some(
      (N) =>
        !N.startsWith('access to') &&
        (N.includes('parish church') ||
          N.includes('cathedral') ||
          N.includes('monastery') ||
          N.includes('friary') ||
          N.includes('temple') ||
          N.includes('shrine') ||
          N.includes('priest (resident)') ||
          N.includes('graveyard'))
    ),
    K = ['village', 'town', 'city', 'metropolis'].includes(tier) || X;
  if (C > 5 && K) {
    const ye =
      priorities.criminal > 70 && priorities.religion < 35 && instFlags.criminalEffective > 60
        ? 'Clergy operate here but the church holds little civic authority; organised crime has crowded out most formal moral influence.'
        : P && P.includes('Theocratic Council')
          ? 'Religious law governs directly; clergy are administrators as much as priests, and doctrine shapes civic ordinance.'
          : P && P.includes('Church Council')
            ? 'Church authority is the formal source of governing legitimacy here; clergy hold both spiritual and temporal jurisdiction.'
            : C > 24
              ? D.some((he) => he.includes('cathedral') || he.includes('monastery'))
                ? 'Church institutions hold direct temporal power; tithes, land, and courts are all ecclesiastical.'
                : "Church holds substantial temporal power; tithes fund civic works and the clergy's opinion on appointments carries decisive weight."
              : C > 17
                ? ['city', 'metropolis'].includes(tier)
                  ? 'Major church institutions hold structural influence — land grants, hospital networks, and moral authority give them leverage across multiple civic domains.'
                  : ['hamlet', 'village'].includes(tier)
                    ? 'The parish priest is the most educated person for miles; moral authority and practical influence are inseparable at this scale.'
                    : 'Church institutions are well-embedded in civic life; their opinion on appointments, taxation, and law is sought and usually influential.'
                : C > 10
                  ? ['hamlet', 'village', 'thorp'].includes(tier)
                    ? 'The local clergy serve a real pastoral role; their moral authority has limited political reach but is genuinely respected.'
                    : 'Clergy and church institutions exercise meaningful civic influence through moral authority, land ownership, and popular trust.'
                  : 'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.';
    p.push({
      faction: 'Religious Authorities',
      power: C,
      desc: ye,
    });
  }
  if (
    (M > 5 &&
      priorities.economy > 22 &&
      p.push({
        faction: 'Craft Guilds',
        power: M,
        desc:
          M > 16
            ? ['city', 'metropolis'].includes(tier)
              ? 'Well-organised craft guilds with established trade monopolies; a persistent civic voice that merchant houses must negotiate with, not ignore.'
              : 'Craft masters controlling production standards and apprenticeships; present in every civic dispute over prices and supply.'
            : M > 10
              ? 'Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life.'
              : 'Artisan guilds maintaining standards in a thin economy; not politically weak by choice, but by circumstance.',
      }),
    T > 5)
  ) {
    const N =
      T > 22
        ? 'Underworld effectively controls vice, smuggling, and key officials; the nominal government tolerates this because it cannot currently change it.'
        : T > 16
          ? 'Criminal organisations have captured significant influence; corruption is systemic, not exceptional.'
          : T > 10
            ? 'Organised criminal network controls the black market and several informal revenue streams; present in council discussions through intermediaries.'
            : ['hamlet', 'village', 'thorp'].includes(tier)
              ? 'A local protection operation tolerated because the alternative is open conflict with people who know the terrain better.'
              : 'Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement.';
    p.push({
      faction: "Thieves' Guild",
      power: T,
      desc: N,
    });
  }
  const de =
    P && P.includes('Arcane Council')
      ? Math.max(A, Math.max(12, Math.round(14 * priorityToMultiplier(instFlags.magicInfluence))))
      : A;
  de > 5 &&
    p.push({
      faction: 'Arcane Orders',
      power: de,
      desc:
        de > 22
          ? 'Arcane institutions hold substantial political leverage here — contracts, security, and infrastructure all depend on magical services only they provide.'
          : de > 16
            ? 'Wizard towers and mage guilds hold genuine political weight; their services are structurally irreplaceable and they know it.'
            : de > 10
              ? 'Mages and arcane practitioners hold real influence through monopoly on magical services and the latent fear their capabilities inspire.'
              : 'Magical practitioners are consulted but not formally empowered — their influence is advisory, transactional, and quietly resented.',
    });
  const fe = (config == null ? void 0 : config.stressType) || null,
    ge = (config == null ? void 0 : config.stressTypes) || (fe ? [fe] : []),
    ke = (N) => ge.includes(N);
  (ke('under_siege') &&
    (p.forEach((N) => {
      ((N.faction.toLowerCase().includes('military') || N.faction.toLowerCase().includes('guard')) &&
        (N.power = Math.round(N.power * 2)),
        N.isGoverning && (N.power = Math.round(N.power * 1.5)),
        (N.faction.toLowerCase().includes('merchant') || N.faction.toLowerCase().includes('guild')) &&
          (N.power = Math.round(N.power * 0.5)));
    }),
    p.push({
      faction: 'War Council',
      power: 25,
      desc: 'Emergency committee with authority over rationing, conscription, and defence spending; not accountable to normal governance.',
    })),
    ke('occupied') &&
      (p.forEach((N) => {
        (N.isGoverning && ((N.modifiers = [...(N.modifiers || []), 'occupied']), (N.power = Math.round(N.power * 0.6))),
          (N.faction.toLowerCase().includes('military') || N.faction.toLowerCase().includes('guard')) &&
            (N.power = Math.round(N.power * 0.3)),
          !N.isGoverning &&
            N.faction !== 'Occupation Authority' &&
            N.faction !== 'Resistance Network' &&
            !N.faction.toLowerCase().includes('military') &&
            !N.faction.toLowerCase().includes('guard') &&
            (N.power = Math.round(N.power * 0.82)),
          (N.faction === 'Noble Families' || N.faction === 'Noble Houses' || N.faction === 'Landed Gentry') &&
            ((N.power = Math.round(N.power * 0.7)),
            (N.desc =
              (N.desc || '') +
              ' Under occupation, several noble families have made private accommodations with the new authority. Others have not, and are watched.')));
      }),
      p.push({
        faction: 'Occupation Authority',
        power: 20,
        desc: 'External administrative body; all significant decisions require approval or reversal. Locally hated. Their actual power depends on how many soldiers they have here, which varies.',
      }),
      p.push({
        faction: 'Resistance Network',
        power: 8,
        desc: 'Distributed cells operating through existing social structures; no formal hierarchy. Currently cautious.',
      })),
    ke('politically_fractured') &&
      (p.forEach((N) => {
        (N.isGoverning &&
          ((N.power = Math.round(N.power * 0.4)), (N.modifiers = [...(N.modifiers || []), 'contested'])),
          (N.faction === 'Noble Families' || N.faction === 'Noble Houses' || N.faction === 'Landed Gentry') &&
            (N.power = Math.round(N.power * 1.4)));
      }),
      p.push({
        faction: P && P.includes('Royal Authority') ? 'Loyalist Noble Bloc' : 'Rival Faction B',
        power: 20,
        desc:
          P && P.includes('Royal Authority')
            ? 'Noble houses backing the current crown line; their support is conditional on continued royal favour and land grants.'
            : 'Claims legitimate authority through different means; controls a distinct district or institution.',
      }),
      p.push({
        faction: P && P.includes('Royal Authority') ? 'Reform Noble Bloc' : 'Third Bloc (Neutrals)',
        power: 15,
        desc:
          P && P.includes('Royal Authority')
            ? 'Noble houses that want a renegotiation of feudal obligations; not openly rebellious, but not cooperative.'
            : 'Would support stability — if a price can be agreed. Currently being courted by both sides.',
      })),
    ke('indebted') &&
      (p.push({
        faction:
          P && P.includes('Royal Authority') && S ? 'Crown Creditors (Noble Coalition)' : "Creditor's Representative",
        power: P && P.includes('Royal Authority') && S ? 22 : 18,
        desc:
          P && P.includes('Royal Authority') && S
            ? "A coalition of noble houses that hold the crown's debt. They are owed money, military obligations, and political appointments. They are in no hurry to be repaid."
            : 'Resident agent of the external creditor; formally an observer, in practice a veto on fiscal decisions.',
      }),
      p.forEach((N) => {
        ((N.faction.toLowerCase().includes('merchant') || N.faction.toLowerCase().includes('guild')) &&
          (N.power = Math.round(N.power * 1.3)),
          P &&
            P.includes('Royal Authority') &&
            (N.faction === 'Noble Families' || N.faction === 'Noble Houses') &&
            ((N.power = Math.round(N.power * 1.5)),
            (N.desc = (N.desc || '') + ' Several of these houses hold crown debt and are positioning accordingly.')));
      })),
    ke('recently_betrayed') &&
      (p.push({
        faction: 'Investigation Faction',
        power: 12,
        desc: 'Informal coalition demanding answers; politically inconvenient to governance; growing.',
      }),
      p.forEach((N) => {
        N.isGoverning && (N.power = Math.round(N.power * 0.7));
      })),
    ke('infiltrated') &&
      p.push({
        faction: 'Unknown Faction (hidden)',
        power: 15,
        desc: 'An external interest with embedded assets in at least two factions. Its presence is not known to the settlement.',
      }),
    ke('succession_void') &&
      (p.forEach((N) => {
        (N.isGoverning && ((N.power = Math.round(N.power * 0.5)), (N.modifiers = [...(N.modifiers || []), 'vacant'])),
          (N.faction === 'Noble Families' ||
            N.faction === 'Noble Houses' ||
            N.faction === 'Landed Gentry' ||
            N.faction === 'Manor Household') &&
            ((N.power = Math.round(N.power * 1.8)),
            (N.desc =
              (N.desc || '') +
              ' The succession crisis has transformed latent noble power into active leverage — every claimant needs their backing.')));
      }),
      p.push({
        faction: P && P.includes('Royal Authority') ? 'Noble Claimant (Senior Line)' : 'Claimant Bloc A',
        power: P && P.includes('Royal Authority') ? 22 : 18,
        desc:
          P && P.includes('Royal Authority')
            ? 'A noble house with a plausible hereditary claim; controls several key military levies. Legally strongest. Not universally liked.'
            : 'Hereditary or institutional claim; has legal arguments; lacks popular support.',
      }),
      p.push({
        faction: P && P.includes('Royal Authority') ? 'Noble Claimant (Reform Faction)' : 'Claimant Bloc B',
        power: P && P.includes('Royal Authority') ? 17 : 15,
        desc:
          P && P.includes('Royal Authority')
            ? 'A rival noble house backed by popular sentiment and merchant capital; weaker bloodline claim but stronger coalition. Moving fast.'
            : 'Popular support; questionable legitimacy; moving fast.',
      })),
    ke('famine') &&
      (p.push({
        faction: 'Grain Holders',
        power: 20,
        desc: 'Whoever controls the remaining food reserves holds more real power than any formal authority.',
      }),
      p.forEach((N) => {
        N.faction.toLowerCase().includes('religious') && (N.power = Math.round(N.power * 1.4));
      })),
    ke('plague_onset') &&
      (p.push({
        faction: 'Quarantine Council',
        power: 15,
        desc: 'Healers, clerics, and pragmatists with emergency health powers. Unpopular. Probably right.',
      }),
      p.forEach((N) => {
        (N.faction.toLowerCase().includes('religious') && (N.power = Math.round(N.power * 1.5)),
          (N.faction.toLowerCase().includes('merchant') || N.faction.toLowerCase().includes('trade')) &&
            (N.power = Math.round(N.power * 0.7)));
      })),
    ke('monster_pressure') &&
      (p.forEach((N) => {
        (N.faction.toLowerCase().includes('military') || N.faction.toLowerCase().includes('guard')) &&
          (N.power = Math.round(N.power * 1.6));
      }),
      p.push({
        faction: 'Monster Hunters / Adventurers',
        power: 10,
        desc: 'Outside professionals brought in or passing through; temporarily powerful because they are useful.',
      })),
    ke('insurgency') &&
      (function () {
        const N = typeof getInstFlags == 'function' ? getInstFlags(config || {}, institutions || []) : {},
          ye = (N.criminalEffective || 0) > (N.militaryEffective || 0) && (N.economyOutput || 50) < 48;
        ((
          p.find(function (De) {
            return De.isGoverning;
          }) || {}
        ).faction,
          p.forEach(function (De) {
            (De.isGoverning &&
              ((De.power = Math.round(De.power * 0.72)),
              (De.modifiers = [...(De.modifiers || []), 'contested legitimacy'])),
              (De.faction.toLowerCase().includes('thieves') || De.faction.toLowerCase().includes('criminal')) &&
                (De.power = Math.round(De.power * 1.3)),
              (De.faction.toLowerCase().includes('religious') || De.faction.toLowerCase().includes('church')) &&
                ((De.power = Math.round(De.power * 1.15)),
                (De.desc =
                  (De.desc || '') +
                  ' Currently under pressure from both sides to publicly endorse the legitimate authority.')));
          }));
        const he = ye
          ? P && P.includes('Royal Authority')
            ? "Commons' Reform Assembly"
            : P && P.includes('Merchant')
              ? "Journeymen's League"
              : "People's Council"
          : P && P.includes('Royal Authority')
            ? 'Loyalist Noble Opposition'
            : P && P.includes('Feudal')
              ? "Reform Stewards' Coalition"
              : 'Reformist Faction';
        p.push({
          faction: he,
          power: ye ? 18 : 22,
          desc: ye
            ? "Organised common-population movement challenging the governing authority's legitimacy. Growing quickly. No unified leadership yet — which makes negotiation impossible."
            : 'Elite faction that has concluded the current governing arrangement is no longer viable. Pursuing institutional change through strategic non-cooperation, coalition-building, and selective pressure.',
        });
      })(),
    ke('mass_migration') &&
      (function () {
        ((typeof getInstFlags == 'function' ? getInstFlags(config || {}, institutions || []) : {}).economyOutput ||
          50) >= 50
          ? (p.push({
              faction: "Newcomers' Settlement",
              power: 12,
              desc: 'The incoming population has begun self-organising — informal leadership, mutual aid networks, collective negotiation with landlords and employers. Not yet a formal political force, but cohesive enough to matter.',
            }),
            p.forEach(function (he) {
              ((he.faction.toLowerCase().includes('religious') ||
                he.faction.toLowerCase().includes('church') ||
                he.faction.toLowerCase().includes('monastery')) &&
                ((he.power = Math.round(he.power * 1.3)),
                (he.desc =
                  (he.desc || '') +
                  " The institution's charitable work among new arrivals has dramatically expanded its community standing.")),
                (he.faction.toLowerCase().includes('craft') || he.faction.toLowerCase().includes('guild')) &&
                  ((he.power = Math.round(he.power * 0.85)),
                  (he.desc =
                    (he.desc || '') +
                    ' The arrival of skilled workers outside guild structures is an existential concern being discussed at every chapter meeting.')));
            }))
          : (p.push({
              faction: 'Departure Committee',
              power: 8,
              desc: "Informal group coordinating group departures, selling assets, and managing the logistics of relocation. Their existence is a public statement about the settlement's prospects.",
            }),
            p.forEach(function (he) {
              he.isGoverning &&
                ((he.power = Math.round(he.power * 0.85)),
                (he.desc =
                  (he.desc || '') +
                  ' Managing the emigration crisis while maintaining the appearance that it is not a crisis.'));
            }));
      })(),
    ke('wartime') &&
      (function () {
        (
          p.find(function (he) {
            return he.isGoverning;
          }) || {}
        ).faction;
        const N = typeof getInstFlags == 'function' ? getInstFlags(config || {}, institutions || []) : {},
          ye = (N.militaryEffective || 50) >= 55 && (N.economyOutput || 50) >= 45;
        (p.forEach(function (he) {
          ((he.faction.toLowerCase().includes('military') ||
            he.faction.toLowerCase().includes('guard') ||
            he.faction.toLowerCase().includes('garrison')) &&
            ((he.power = Math.round(he.power * 1.5)),
            (he.desc =
              (he.desc || '') +
              ' Wartime has transformed this faction from a civic institution into a primary power centre — crown authority flows through military channels now.')),
            (he.faction.toLowerCase().includes('merchant') || he.faction.toLowerCase().includes('guild')) &&
              (ye
                ? ((he.power = Math.round(he.power * 1.2)),
                  (he.desc =
                    (he.desc || '') +
                    ' War contracts have made the well-connected wealthy. The faction is divided between those profiting and those whose trade routes are severed.'))
                : ((he.power = Math.round(he.power * 0.8)),
                  (he.desc =
                    (he.desc || '') +
                    ' Trade disruption and requisition are hurting the bottom line. The faction is lobbying for compensation and receiving promises.'))),
            (he.faction.toLowerCase().includes('religious') || he.faction.toLowerCase().includes('church')) &&
              ((he.power = Math.round(he.power * 1.2)),
              (he.desc =
                (he.desc || '') +
                " The pastoral burden of wartime — soldiers praying before departure, families grieving — has made the institution indispensable in a way it wasn't before.")));
        }),
          p.push({
            faction: 'War Council',
            power: ye ? 20 : 25,
            desc: ye
              ? "Crown-appointed emergency body coordinating supply, conscription, and military contracting. Currently functioning smoothly — the war is going well enough that its authority isn't contested."
              : 'Crown-appointed emergency body with powers over requisition, conscription, and price controls. Unpopular. Accused of favouritism in contract awards. Probably correct on the military decisions.',
          }),
          ye ||
            p.push({
              faction: 'Peace Faction',
              power: 10,
              desc: 'Merchants, clergy, and common voices arguing that the cost of continued war exceeds any achievable gain. Not traitors — pragmatists. Growing.',
            }));
      })(),
    ke('religious_conversion') &&
      (function () {
        const N =
            (
              p.find(function (he) {
                return he.isGoverning;
              }) || {}
            ).faction || null,
          ye = N ? N.length % 3 : Math.floor(_rng() * 3);
        (p.forEach(function (he) {
          ((he.faction.toLowerCase().includes('religious') ||
            he.faction.toLowerCase().includes('church') ||
            he.faction.toLowerCase().includes('clergy') ||
            he.faction.toLowerCase().includes('temple')) &&
            ((he.power = Math.round(he.power * (ye === 2 ? 0.5 : 0.7))),
            (he.modifiers = [...(he.modifiers || []), 'contested legitimacy']),
            (he.desc =
              (he.desc || '') +
              (ye === 0
                ? ' Losing congregation to the new faith faster than leadership acknowledges publicly.'
                : ye === 1
                  ? ' One of two competing factions claiming the legitimate succession — legal standing of their records is contested.'
                  : ' Formally compliant with the conversion order. Actual compliance among the congregation is harder to assess.'))),
            he.isGoverning &&
              ((he.power = Math.round(he.power * 0.88)),
              (he.desc =
                (he.desc || '') +
                ' Under pressure from both religious factions to make a formal declaration of support. Has so far avoided doing so.')),
            (he.faction.toLowerCase().includes('thieves') || he.faction.toLowerCase().includes('criminal')) &&
              (he.power = Math.round(he.power * 1.25)));
        }),
          ye === 0
            ? p.push({
                faction: 'New Faith Community',
                power: 14,
                desc: 'Growing movement without formal institutions — meeting in homes, sharing resources, organising mutual aid. Politically naive but numerically significant and increasingly confident.',
              })
            : ye === 1
              ? p.push({
                  faction: 'Reform Congregation',
                  power: 16,
                  desc: 'The breakaway faction in the religious schism. Claims doctrinal legitimacy and holds parallel services. Legal standing of its records and sacraments is disputed by the established institution.',
                })
              : (p.push({
                  faction: 'Conversion Enforcement Office',
                  power: 18,
                  desc: 'External or crown-appointed body with authority to verify compliance with the conversion order. Uses informants. Its definition of compliance is stricter than the governing faction anticipated.',
                }),
                p.push({
                  faction: 'Underground Old Faith',
                  power: 7,
                  desc: "Not officially a faction — officially it doesn't exist. In practice it is the most cohesive social network in the settlement. Its membership overlaps with several other factions in ways nobody discusses.",
                })));
      })(),
    ke('slave_revolt') &&
      (function () {
        ((
          p.find(function (N) {
            return N.isGoverning;
          }) || {}
        ).faction,
          p.forEach(function (N) {
            (N.isGoverning &&
              ((N.power = Math.round(N.power * 0.65)),
              (N.modifiers = [...(N.modifiers || []), 'authority contested']),
              (N.desc =
                (N.desc || '') +
                ' Managing an active slave revolt — the public posture is control, the private reality is containment at best.')),
              (N.faction.toLowerCase().includes('military') ||
                N.faction.toLowerCase().includes('guard') ||
                N.faction.toLowerCase().includes('garrison')) &&
                ((N.power = Math.round(N.power * 1.5)),
                (N.desc =
                  (N.desc || '') +
                  ' Fully deployed for containment. Soldiers are being asked to do things that will complicate their relationship with the civilian population.')),
              (N.faction.toLowerCase().includes('merchant') || N.faction.toLowerCase().includes('guild')) &&
                ((N.power = Math.round(N.power * 0.85)),
                (N.desc =
                  (N.desc || '') +
                  ' The revolt has disrupted labour supply and market operations. The faction is divided between those demanding immediate suppression and those quietly calculating whether a negotiated settlement might be cheaper.')),
              (N.faction.toLowerCase().includes('religious') || N.faction.toLowerCase().includes('church')) &&
                ((N.power = Math.round(N.power * 1.2)),
                (N.desc =
                  (N.desc || '') +
                  ' Under pressure from both sides to publicly declare the revolt either just or sacrilegious. Has so far avoided a direct statement.')));
          }),
          p.push({
            faction: 'Revolt Leadership',
            power: 18,
            desc: 'Organised leadership of the enslaved population — distributed, resilient, and holding territory. Has demands. Has not yet committed to whether those demands are negotiable.',
          }),
          p.push({
            faction: 'Abolitionist Network',
            power: 7,
            desc: 'Free citizens, clergy, and outside agitators who have been supporting the revolt covertly — shelter, information, supplies. Their involvement is not yet public.',
          }));
      })());
  const dt = p.reduce((N, ye) => N + ye.power, 0);
  (p.forEach((N) => {
    N.power = Math.round((N.power / dt) * 100);
  }),
    p.sort((N, ye) => (N.isGoverning ? -1 : ye.isGoverning ? 1 : ye.power - N.power)),
    (function () {
      var N = p.map(function (qt) {
          return qt.faction;
        }),
        ye = function (qt) {
          return N.some(function (Ct) {
            return Ct.toLowerCase().includes(qt.toLowerCase());
          });
        },
        he = p[0] ? p[0].faction : null;
      p[1] && p[1].faction;
      var De = p[0] ? p[0].power : 0,
        Mi = p[1] ? p[1].power : 0,
        cr = De - Mi,
        bt = ye('Merchant'),
        tr = ye('Craft Guild'),
        ft = ye('Thieves'),
        Fr = ye('Military') || ye('Guard'),
        la =
          ye('Manor Household') || ye('Landed Gentry') || ye('Noble Famil') || ye('Great Famil') || ye('Noble House'),
        Rn = ye('Feudal Stewardship') || ye('Feudal Appointee'),
        vr = ye('Religious Authorities'),
        ei = ye('Arcane Orders');
      p.forEach(function (qt, Ct) {
        var at = qt.power,
          Mt = qt.faction,
          wt = Mt.toLowerCase(),
          Gr = Ct > 0 ? p[Ct - 1] : null,
          ti = Ct < p.length - 1 ? p[Ct + 1] : null,
          _r = Gr ? Gr.power - at : 0,
          _e = ti ? at - ti.power : 99,
          ve = '';
        if (
          (Ct === 1 &&
            !qt.isGoverning &&
            (cr <= 6
              ? (ve = he
                  ? 'The gap between them and ' +
                    (he && he.toLowerCase().includes('council') ? 'the governing council' : he) +
                    ' is narrow — a single shift in patronage, scandal, or armed muscle could swap their positions.'
                  : 'The dominant order is genuinely contested; a single shift in circumstance could reorder everything.')
              : cr <= 14
                ? (ve = he
                    ? 'They operate in the shadow of ' +
                      (he && he.toLowerCase().includes('council') ? 'the governing council' : he) +
                      ' but not comfortably — they are watching for leverage, not deferring.'
                    : 'Close enough to the top to resist, far enough behind to be cautious.')
                : (ve = he
                    ? 'Behind ' +
                      (he && he.toLowerCase().includes('council') ? 'the governing council' : he) +
                      ' by enough margin that direct challenge is not viable — they route their influence through procedure, not confrontation.'
                    : 'The hierarchy is settled for now; their energy goes into consolidating second place, not chasing first.')),
          Ct === 2 &&
            (_r <= 5 && _e <= 5
              ? (ve =
                  'Genuinely three-way territory — no faction has decisively broken from the pack; every council vote is negotiated.')
              : _r <= 10
                ? (ve =
                    'Close enough to the two above that their support is worth buying; they play ' +
                    (Gr ? Gr.faction : 'the second faction') +
                    ' and ' +
                    (p[0] ? p[0].faction : 'the top faction') +
                    ' against each other when they can.')
                : (ve =
                    'A reliable third presence — too significant to exclude from negotiations, not strong enough to set their own terms.')),
          Ct === p.length - 1 &&
            at < 7 &&
            _r >= 5 &&
            (ve =
              'Their leverage is narrow and issue-specific; on broader questions they follow whoever is willing to deal with them that week.'),
          bt && tr)
        ) {
          if (wt.includes('merchant')) {
            var Se = p.find(function (Ue) {
              return Ue.faction.includes('Craft Guild');
            });
            if (Se) {
              var me =
                Se.power > at
                  ? 'The craft guilds currently outweigh them in raw political numbers — an uncomfortable inversion the merchants are working to correct.'
                  : Se.power > at - 8
                    ? 'The craft guilds are close behind, contesting every pricing and quality-standard decision they try to push through council.'
                    : 'The craft guilds are present but outpaced; merchants set prices, craft masters object, and merchants win more often than not.';
              ve = ve ? ve + ' ' + me : me;
            }
          }
          if (wt.includes('craft guild')) {
            var He = p.find(function (Ue) {
              return Ue.faction.includes('Merchant');
            });
            if (He) {
              var be =
                He.power > at + 8
                  ? 'The merchants consistently outvote them on pricing and labour standards — craft masters have learned to attach riders to deals rather than fight directly.'
                  : He.power > at
                    ? 'Running close behind the merchant guilds in a sustained dispute over who sets the terms for finished goods.'
                    : 'Ahead of the merchant guilds in current influence — an unusual position they intend to hold.';
              ve = ve ? ve + ' ' + be : be;
            }
          }
        }
        if (ft && Fr) {
          if (wt.includes('thieves')) {
            var Zt = p.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('military') || Ue.faction.toLowerCase().includes('guard');
            });
            if (Zt) {
              var Xt =
                Zt.power > at + 10
                  ? 'The garrison outweighs them institutionally — they survive by corrupting the lower ranks and making enforcement selectively unprofitable.'
                  : Zt.power < at - 10
                    ? 'They currently outflank the military in real leverage; there are officers on payroll and commanders who know better than to ask questions.'
                    : 'Running roughly even with the military in actual influence — the garrison can arrest individuals, the guild can make the investigation expensive.';
              ve = ve ? ve + ' ' + Xt : Xt;
            }
          }
          if (wt.includes('military') || wt.includes('guard')) {
            var Xe = p.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('thieves');
            });
            if (Xe) {
              var et =
                Xe.power > at + 10
                  ? 'The guild has more real leverage than they do — selective enforcement is the only tool that still works, and everyone knows it.'
                  : Xe.power < at - 10
                    ? 'They outmatch the guild institutionally, which keeps the criminal operation suppressed rather than eliminated — there is a difference.'
                    : 'Running a slow institutional war with the guild: arrests happen, networks rebuild, deals are struck and quietly violated.';
              ve = ve ? ve + ' ' + et : et;
            }
          }
        }
        if (bt && ft && wt.includes('merchant')) {
          var Rt = p.find(function (Ue) {
            return Ue.faction.toLowerCase().includes('thieves');
          });
          if (Rt && Rt.power > 10) {
            var Ri =
              Rt.power > at
                ? 'The criminal network has more operational reach than the merchant guilds right now — some merchants are paying protection; others have become silent partners.'
                : "They tolerate the guild's cut because fighting it costs more than paying it; the arrangement is not advertised.";
            ve = ve ? ve + ' ' + Ri : Ri;
          }
        }
        if (
          la &&
          bt &&
          (wt.includes('manor') ||
            wt.includes('landed gentry') ||
            wt.includes('noble famil') ||
            wt.includes('great famil') ||
            wt.includes('noble house'))
        ) {
          var ca = p.find(function (Ue) {
            return Ue.faction.includes('Merchant');
          });
          if (ca) {
            var qs =
              ca.power > at + 12
                ? 'The merchant guilds now hold more functional leverage — the noble families retain title, hereditary land, and social precedence, but the money has moved.'
                : ca.power > at
                  ? 'The merchants are closing the gap; the noble families are using every legal and social mechanism to slow a transition that looks increasingly inevitable.'
                  : 'Still ahead of merchant interests in real influence — for now. They know the gap is narrowing and are arranging marriages accordingly.';
            ve = ve ? ve + ' ' + qs : qs;
          }
        }
        if (Rn && la && (wt.includes('manor household') || wt.includes('landed gentry'))) {
          var Pa = p.find(function (Ue) {
            return (
              (Ue.faction.includes('Feudal Stewardship') || Ue.faction.includes('Feudal Appointee')) &&
              Ue.faction !== qt.faction
            );
          });
          if (Pa) {
            var da = Math.floor(at * 7 + Pa.power * 3) % 3,
              _i =
                Pa.power > at + 10
                  ? da === 0
                    ? "The steward administers in the lord's name — the household is the source of that authority, not a rival to it, but the practical question of who signs what has become genuinely complicated."
                    : 'The steward holds the day-to-day authority; the household provides the legitimacy. In practice the line between them blurs whenever a petitioner finds one more receptive than the other.'
                  : Pa.power < at - 10
                    ? da === 0
                      ? 'They hold more direct influence than the steward appointed to govern in their name, which raises questions about why the steward exists at all.'
                      : 'The steward nominally governs but defers here more than the arrangement was designed to allow.'
                    : da === 0
                      ? 'Overlapping claims with the steward create an ambiguity that everyone exploits: petitioners approach whichever authority is more likely to give the answer they want.'
                      : da === 1
                        ? 'The steward and the household have developed a working arrangement, but its terms are renegotiated whenever something important is at stake.'
                        : 'Which one actually governs depends on the day and the question; both would say themselves.';
            ve = ve ? ve + ' ' + _i : _i;
          }
        }
        if (vr && ei) {
          if (wt.includes('religious')) {
            var qa = p.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('arcane');
            });
            if (qa) {
              var ri =
                qa.power > at
                  ? 'The arcane orders currently hold more practical influence, which the clergy finds spiritually troubling and politically unacceptable.'
                  : "The arcane orders are present but operate in the clergy's shadow — questions of what is sanctioned magic and what is heresy remain deliberately unresolved.";
              ve = ve ? ve + ' ' + ri : ri;
            }
          }
          if (wt.includes('arcane')) {
            var ii = p.find(function (Ue) {
              return Ue.faction.toLowerCase().includes('religious');
            });
            if (ii) {
              var Li =
                ii.power > at
                  ? 'The clergy hold more civic influence — the arcane orders operate by navigating rather than challenging religious authority.'
                  : 'Ahead of the religious authorities in current influence, which they hold carefully: too much visible power invites accusations that they prefer to avoid.';
              ve = ve ? ve + ' ' + Li : Li;
            }
          }
        }
        if (vr && ft && wt.includes('religious')) {
          var Dr = p.find(function (Ue) {
            return Ue.faction.toLowerCase().includes('thieves');
          });
          if (Dr && Dr.power > 10) {
            var Tt =
              Dr.power > at
                ? "The criminal network currently outweighs them — the clergy's moral authority is loud and largely unheeded."
                : 'They denounce the guild from the pulpit; the guild funds two charitable institutions and makes the denunciations look selective.';
            ve = ve ? ve + ' ' + Tt : Tt;
          }
        }
        if (Fr && vr && (wt.includes('military') || wt.includes('guard'))) {
          var _n = p.find(function (Ue) {
            return Ue.faction.toLowerCase().includes('religious');
          });
          if (_n && Math.abs(_n.power - at) < 10) {
            var Ln =
              'They and the religious authorities operate parallel systems of social control — the garrison handles bodies, the clergy handles minds, and both would prefer the other operated at lower volume.';
            ve = ve ? ve + ' ' + Ln : Ln;
          }
        }
        (Ct === 1 && !qt.isGoverning && cr <= 8, ve && (qt.desc = qt.desc ? qt.desc + ' ' + ve : ve));
      });
    })());
  const Gt = (config == null ? void 0 : config.monsterThreat) || 'frontier';
  let Me;
  (stressFlags.stateCrime
    ? (Me = 'Enforced Order (authoritarian)')
    : stressFlags.crimeIsGovt
      ? (Me = 'Unstable — criminal governance')
      : stressFlags.crusaderSynthesis
        ? (Me = 'Rigid (militant theocracy)')
        : stressFlags.merchantArmy
          ? (Me = 'Fragile (private security, no public law)')
          : instFlags.criminalEffective > 75 && instFlags.militaryEffective < instFlags.criminalEffective - 8
            ? (Me = 'Unstable (pervasive organized crime)')
            : instFlags.militaryEffective > 70 && instFlags.economyOutput < 32
              ? (Me = 'Tense (militarised, chronically underfunded)')
              : stressFlags.theocraticEconomy
                ? (Me = 'Stable (theocratic governance)')
                : (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'Hostile rival' ||
                    (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'hostile_rival' ||
                    (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'cold_war' ||
                    (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'Cold war' ||
                    (tradeRoute == null ? void 0 : tradeRoute.relationshipType) === 'tense'
                  ? (Me = 'Tense (external threat)')
                  : instFlags.economyOutput > 68 && instFlags.militaryEffective < 30
                    ? (Me = 'Vulnerable (prosperous but underdefended)')
                    : instFlags.militaryEffective > 68
                      ? (Me = 'Ordered (strong military presence)')
                      : (Me = 'Stable'),
    ke('under_siege')
      ? (Me = 'Critical (active siege — survival priority)')
      : ke('occupied')
        ? (Me = 'Suppressed (under occupation — resistance simmers)')
        : ke('politically_fractured')
          ? (Me = 'Fractured — no stable governing authority')
          : ke('recently_betrayed')
            ? (Me = 'Shaken — institutional trust collapsed')
            : ke('famine')
              ? (Me = 'Desperate — hunger is eroding order')
              : ke('plague_onset')
                ? (Me = 'Anxious — disease is overriding normal authority')
                : ke('succession_void')
                  ? (Me = 'Volatile — power is available to whoever moves first')
                  : ke('infiltrated')
                    ? (Me = Me)
                    : ke('indebted')
                      ? Me.includes('Unstable') || (Me = 'Strained — debt obligations constrain every decision')
                      : ke('monster_pressure') &&
                        (Me.toLowerCase().includes('tense') ||
                          (Me = 'Tense (monster pressure from surrounding region)')),
    (Gt === 'embattled' || Gt === 'high') &&
      (Me = [
        'tense',
        'unstable',
        'fragile',
        'rigid',
        'vulnerable',
        'enforced',
        'desperate',
        'anxious',
        'volatile',
        'shaken',
        'suppressed',
        'fractured',
        'critical',
        'strained',
        'ordered',
      ].some((N) => Me.toLowerCase().includes(N))
        ? Me + '; monster threat active'
        : 'Tense — regional monster threat'));
  let We;
  const At = instNames.some(function (N) {
      return (
        N.includes('garrison') ||
        N.includes('barracks') ||
        N.includes('militia') ||
        N.includes('watch') ||
        N.includes('guard') ||
        N.includes('mercenary')
      );
    }),
    Qt = instNames.some(function (N) {
      return (
        N.includes('guild') ||
        N.includes('market district') ||
        N.includes('merchant house') ||
        N.includes('trading company')
      );
    }),
    aa = instNames.some(function (N) {
      return N.includes('mage') || N.includes('wizard') || N.includes('arcane') || N.includes('alchemist');
    }),
    Le = instNames.some(function (N) {
      return (
        N.includes('council') ||
        N.includes('court') ||
        N.includes('magistrate') ||
        N.includes('hall') ||
        N.includes('charter') ||
        N.includes('guild hall')
      );
    }),
    br = instNames.some(function (N) {
      return N.includes('market') || N.includes('merchant') || N.includes('guild') || N.includes('trading');
    }),
    Re = instNames.some(function (N) {
      return (
        N.includes('church') ||
        N.includes('cathedral') ||
        N.includes('monastery') ||
        N.includes('temple') ||
        N.includes('parish') ||
        N.includes('shrine')
      );
    }),
    Hr = P && P.includes('Royal Authority'),
    Jr =
      S ||
      p.some(function (N) {
        return (
          N.faction === 'Noble Families' ||
          N.faction === 'Noble Houses' ||
          N.faction === 'Landed Gentry' ||
          N.faction === 'Manor Household'
        );
      });
  stressFlags.stateCrime
    ? (We = At
        ? 'Several households disappeared following a tax audit. The garrison commander has not been available for comment.'
        : 'Several households stopped paying what they owe. The person collecting those payments has not been seen since.')
    : stressFlags.crimeIsGovt
      ? (We =
          Qt || Le
            ? 'The guild and the district council both claim authority over the new market. Violence has settled some of the disputes; more is expected.'
            : 'Two of the stronger families have been resolving disputes between themselves rather than involving the elders. The rest of the community is watching nervously.')
      : stressFlags.crusaderSynthesis
        ? (We = At
            ? 'The commander-prelate has declared a heresy investigation into a rival settlement. The garrison is mobilizing.'
            : 'The local priest has declared a neighbouring settlement heretical. Relations between the two communities have broken down entirely.')
        : stressFlags.merchantArmy
          ? (We =
              Qt && At
                ? "A guild's private soldiers arrested a rival's factor. The public watch is refusing to intervene in what they call a 'merchant matter'."
                : "One household's hired hands roughed up a rival's farmhand over a grazing dispute. Neither side will involve the elders.")
          : stressFlags.heresySuppression
            ? (We = aa
                ? "A hedge wizard was dragged before the ecclesiastical court. The mages' quarter is very quiet at the moment."
                : Re && Le
                  ? 'The priest has summoned someone before the church court. The village is divided on whether they deserved it.'
                  : "The priest has been asking questions about a local family's practices. The family has become very quiet.")
            : stressFlags.merchantCriminalBlur
              ? (We = Qt
                  ? "Two guild masters are having each other's warehouses robbed. Both deny it publicly. Both are losing patience."
                  : "Two households have been undercutting each other on market day for months. Last week someone's cart was damaged. No one saw anything.")
              : tradeRoute
                ? (We = `Ongoing tensions with ${tradeRoute.neighborName}`)
                : instFlags.criminalEffective > 65
                  ? (We =
                      At || Le
                        ? 'Crime rates are rising; several merchants have been found murdered, and the guard is being accused of inaction.'
                        : 'Someone has been stealing from the communal stores. Everyone suspects someone. No one is saying anything.')
                  : Hr && Jr && priorities.military > 55
                    ? (We =
                        priorities.economy < 40
                          ? 'The crown has called in military levies from the noble houses. Two houses have complied. One has not, and has not explained why.'
                          : priorities.military > 70
                            ? 'A noble house has begun recruiting its own soldiers beyond its traditional levy obligation. The crown has noticed and has not yet decided what to say about it.'
                            : "The crown's relationship with the noble houses is transactional and increasingly strained. The last royal directive was delayed six weeks while passing through noble intermediaries.")
                    : Jr && instFlags.economyOutput > 55
                      ? (We =
                          priorities.economy > 65
                            ? 'The merchant class is outbuying noble landholdings. Three estates have changed hands in the last decade. The families that lost them have not forgotten.'
                            : "A noble family is contesting a merchant's right to operate in their traditional market territory. The council is hearing the case and wishes it were not.")
                      : instFlags.militaryEffective > 68
                        ? (We = At
                            ? 'The military commanders are pushing for expanded authority over civilian courts — and the council is losing ground.'
                            : Le
                              ? 'The village militia captain is pushing for authority over disputes that the reeve used to handle.'
                              : "The strongest armed household has started making decisions on everyone's behalf without asking.")
                        : instFlags.religionInfluence > 68
                          ? (We = Le
                              ? 'The church is demanding veto power over council appointments. The council has not yet refused publicly.'
                              : Re
                                ? 'The church wants approval rights over market day activities. The village reeve disagrees.'
                                : 'The priest has been insisting on a say in who can marry whom and what gets planted when. Several families are unhappy.')
                          : instFlags.economyOutput > 68
                            ? (We = Qt
                                ? 'Two rival guilds are contesting control of the main trade route. Neither side will back down and the council is avoiding the question.'
                                : br
                                  ? 'The miller and the largest farming household are in dispute over prices and access.'
                                  : 'The household that sells the most at market has been throwing its weight around in community decisions.')
                            : (config == null ? void 0 : config.monsterThreat) === 'plagued'
                              ? (We = At
                                  ? 'A monster incursion last season destroyed outlying farms. The garrison is stretched thin and the council cannot agree on whether to raise a levy or hire mercenaries.'
                                  : Le
                                    ? 'Monster attacks on the outlying farms have not stopped. The village is debating whether to build proper defences or petition the nearest lord for help.'
                                    : 'Farms nearby have been abandoned after attacks. The community cannot agree on whether to shelter in place, build defences, or leave.')
                              : (We =
                                  Le || Qt
                                    ? 'The council has been debating market levies for three months. The merchants have stopped attending the sessions. Both sides are now acting as if the other has already lost.'
                                    : br
                                      ? 'A dispute over field rotation and grazing rights has divided the village for most of this season.'
                                      : 'A dispute over grazing rights and water access has been running for two seasons. It has stopped being about grazing rights and water access.');
  const na = ge.length
      ? [
          'under_siege',
          'occupied',
          'famine',
          'plague_onset',
          'politically_fractured',
          'recently_betrayed',
          'succession_void',
          'indebted',
          'infiltrated',
          'monster_pressure',
          'insurgency',
          'mass_migration',
          'wartime',
          'religious_conversion',
          'slave_revolt',
        ].find((N) => ge.includes(N)) || ge[0]
      : fe,
    Ie = ((oa = p.find((N) => N.isGoverning)) == null ? void 0 : oa.faction) || null,
    Na = instNames.some(function (N) {
      return N.includes('garrison');
    })
      ? 'The garrison'
      : instNames.some(function (N) {
            return N.includes('militia');
          })
        ? 'The militia'
        : instNames.some(function (N) {
              return N.includes('watch');
            })
          ? 'The watch'
          : instNames.some(function (N) {
                return N.includes('mercenary');
              })
            ? 'The mercenary company'
            : ['thorp', 'hamlet', 'village'].includes(tier)
              ? 'The community'
              : 'The guard',
    sa = {
      under_siege:
        'The settlement is under active siege. Every resource decision is a military decision. The debate is no longer about policy — it is about survival.',
      famine:
        At || Le || br
          ? 'Food shortages have sharpened every tension in the settlement. Those with stocks are not advertising the fact. Those without are watching those with.'
          : 'The last harvest failed badly. What remains is being rationed by whoever holds the stores. Neighbours who shared meals last winter are watching each other carefully.',
      occupied:
        'An occupying officer arrested a local elder for "seditious speech". ' +
        Ie +
        ' filed a formal protest. The protest was returned unread.',
      politically_fractured:
        Le || At || Qt
          ? 'Two of the three factions are no longer attending joint council meetings. Decisions are being made unilaterally and contradicted by rivals within days.'
          : 'The community is split. Two households are not speaking to each other or to anyone who sides with the other. Everything requiring collective decision has stopped.',
      indebted:
        Hr && Jr
          ? "The crown's debt to the noble houses has become structural. Three major policy decisions this year were reversed after private meetings with creditor lords. No one publicly acknowledges the connection."
          : "The creditor's representative blocked the infrastructure repair budget. Publicly they cited fiscal responsibility. Privately they cited a clause in the debt agreement.",
      recently_betrayed:
        Hr && Jr
          ? 'A noble house passed intelligence to a rival power. The crown knows. The house denies it. The crown cannot yet afford to act — it needs their levies.'
          : Le
            ? (function () {
                var N = [
                    'Elected Reeve',
                    'Feudal Appointee',
                    'Feudal Stewardship',
                    'Noble Governorship',
                    'Royal Authority',
                    'Household Council',
                  ],
                  ye = N.includes(Ie) ? 'within the office of the ' : 'inside ',
                  he = N.includes(Ie) ? Ie.toLowerCase() : Ie;
                return (
                  'The investigation into the betrayal has been obstructed twice. The obstruction came from ' +
                  ye +
                  he +
                  '. No one will say who.'
                );
              })()
            : 'Someone talked. Information that should have stayed inside the settlement reached an outside party. No one has admitted it. Everyone suspects someone.',
      infiltrated: We,
      plague_onset:
        'The quarantine has been imposed on the affected district. Compliance is partial. Two people who attempted to enforce it were assaulted.',
      succession_void: Hr
        ? Jr
          ? 'Two noble houses are contesting the succession. Both have legal arguments. Both have soldiers. The settlement is watching which house the other noble families back, because that is what will decide it.'
          : 'The throne is vacant and the council of succession has deadlocked. Every faction that benefits from the current stalemate is quietly prolonging it.'
        : Le
          ? 'Two candidates for the vacant position each held separate public assemblies on the same day. Both claimed the other was illegal.'
          : 'The elder who kept the peace is gone. No one has stepped forward to take that role. Small disputes that would have been settled quickly are now sitting open.',
      monster_pressure: At
        ? 'A farmstead three miles out was destroyed last night. The farmer and his family are unaccounted for. ' +
          Na +
          ' is not going out to look.'
        : 'A farmstead a short walk from here was destroyed last night. The family is gone. No one is going to look for them.',
      insurgency: (function () {
        return (instFlags.criminalEffective || 0) > (instFlags.militaryEffective || 0) &&
          (instFlags.economyOutput || 50) < 48
          ? "The commons no longer accept the authority's account of events. Inflammatory pamphlets are being distributed. Two guild masters refused to attend the last civic assembly. The governing faction has intelligence about cells meeting at night — but hasn't moved, because moving publicly would confirm what it officially denies."
          : 'The challenge to the governing faction is institutional, not popular. Key officials are slow-walking orders. Revenue is being collected but held rather than forwarded. ' +
              Ie +
              ' is conducting meetings with people who should not be meeting privately. The governing faction has noticed and is considering whether to act before the coalition is complete.';
      })(),
      wartime: (function () {
        return (instFlags.militaryEffective || 50) >= 55 && (instFlags.economyOutput || 50) >= 45
          ? 'The war is present here as money and absence. The garrison has doubled in size and is well-supplied — the crown is paying for this one. Contracts for grain, leather, and ironwork are flowing to anyone with the capacity to fill them. The men who left to fight have not returned, which is a grief that runs beneath the commerce. ' +
              Ie +
              ' is navigating the difference between what it can extract for the war effort and what the settlement can actually spare.'
          : 'The war is present here as scarcity and fear. Conscription has taken workers, not soldiers — the farms and workshops feel their absence. Supply caravans pass through on crown requisition and local needs come second. Prices have risen and will rise further. A crown officer arrived last week and left with a list of what will be requisitioned next month. The governing faction signed the order. There was no alternative that anyone could see.';
      })(),
      religious_conversion: (function () {
        const N = Ie ? Ie.length % 3 : 0;
        return N === 0
          ? 'The new faith does not yet have a building. It has kitchens, meeting rooms in private homes, and a preacher who travels a circuit. The old institution has the building, the records, the accumulated donations, and a congregation that is quietly redistributing itself. Neither party is ready to force a confrontation. Both are watching the numbers.'
          : N === 1
            ? 'The schism is now formal. Two priests, two congregations, two sets of records — births, deaths, marriages — that may or may not be recognised depending on which authority the other party acknowledges. ' +
              (Ie || 'The governing authority') +
              ' has not declared which succession is legitimate, which means every legal document dependent on religious sanction is in a grey zone.'
            : 'The conversion order came from ' +
              (Ie || 'outside authority') +
              ' and was formally acknowledged within the week. The speed of the formal compliance was remarkable. The depth of the actual compliance is a different question. The old faith does not hold services openly. It is not clear it has stopped holding them.';
      })(),
      mass_migration: (function () {
        return (instFlags.economyOutput || 50) >= 50
          ? 'The settlement is receiving more people than its infrastructure was built for. New arrivals come faster than housing, food, and employment can absorb them. The old residents and the new ones are not yet the same community. ' +
              Ie +
              ' is being asked to do something about it and cannot agree what that something is.'
          : 'Three families left this week. Two more last week. The departure is quiet and orderly — which makes it worse. The people leaving have thought it through. What remains is those who cannot leave, those who choose to stay, and institutions running on fewer people than they were designed for.';
      })(),
      slave_revolt: (function () {
        return (
          'The revolt began at ' +
          (instNames.some(function (he) {
            return he.includes('slave market');
          })
            ? 'the slave market'
            : "the settlement's labour system") +
          " and has not been contained. The security response has been slow, partly because no one in authority wanted to admit publicly how organised the resistance was. Buildings controlled by the revolt's leadership are marked. Movement in and out of certain districts is contested. The governing faction's official position is that this is being handled. Its private position involves considerably more urgency."
        );
      })(),
    };
  // Tag each faction with a category for power-economy correlation
  p.forEach((f) => {
    if (!f.category) f.category = inferFactionCategory(f.faction || '');
  });
  if (We) We = getTierConstraints(We, instNames, tier, Ie);
  if (na && sa[na]) We = getTierConstraints(sa[na], instNames, tier, Ie);
  // ── Public legitimacy & faction dynamics ────────────────────────────────
  // At this point defenseProfile isn't computed yet — we use a provisional
  // defense label derived from institution presence for the legitimacy score,
  // and the actual defenseProfile will be added by generateSettlement after.
  const _hasWalls = (institutions || []).some(
    (i) =>
      (i.name || '').toLowerCase().includes('wall') ||
      (i.name || '').toLowerCase().includes('palisade') ||
      (i.name || '').toLowerCase().includes('citadel')
  );
  const _hasGarrison = (institutions || []).some((i) => (i.name || '').toLowerCase().includes('garrison'));
  const _hasMilitia = (institutions || []).some(
    (i) => (i.name || '').toLowerCase().includes('militia') || (i.name || '').toLowerCase().includes('watch')
  );
  const _provDefLabel =
    _hasWalls && _hasGarrison
      ? 'Well-Defended'
      : _hasWalls || _hasGarrison
        ? 'Defensible'
        : _hasMilitia
          ? 'Lightly Defended'
          : ['thorp', 'hamlet'].includes(tier)
            ? 'Vulnerable'
            : 'Undefended';

  const publicLegitimacy = computePublicLegitimacy(economicState, _provDefLabel, tier);

  // Apply multipliers before relationship computation (relationships use final powers)
  applyLegitimacyMultipliers(p, publicLegitimacy, tier);

  const safetyRatio = instFlags?.inst ? instFlags.militaryEffective / Math.max(8, instFlags.criminalEffective) : 1.0;
  const criminalCaptureState = computeCriminalCaptureState(p, safetyRatio, instFlags.inst || {});
  const stressTypesArr = config?.stressTypes || (config?.stressType ? [config.stressType] : []);
  const factionRelationships = computeFactionRelationships(
    p,
    tier,
    {
      ...instFlags.inst,
      economyOutput: instFlags.economyOutput,
      safetyRatio,
    },
    publicLegitimacy,
    stressTypesArr
  );

  return {
    factions: p,
    stability: Me,
    recentConflict: We,
    publicLegitimacy,
    factionRelationships,
    criminalCaptureState,
  };
};

// generateFactions
export const generateFactions = (r, s) => {
  if (!(r != null && r.length)) return [];
  const o = new Map(r.map((m) => [m.id, new Set()]));
  s.forEach((m) => {
    var h, g;
    ['ally', 'political', 'patron_client', 'respect'].includes(m.type) &&
      ((h = o.get(m.npc1Id)) == null || h.add(m.npc2Id), (g = o.get(m.npc2Id)) == null || g.add(m.npc1Id));
  });
  const d = new Set(),
    l = [];
  return (
    r.forEach((m) => {
      var w;
      if (d.has(m.id)) return;
      const h = [],
        g = [m.id];
      for (; g.length; ) {
        const p = g.shift();
        if (d.has(p)) continue;
        d.add(p);
        const b = r.find((k) => k.id === p);
        (b && h.push(b),
          (w = o.get(p)) == null ||
            w.forEach((k) => {
              d.has(k) || g.push(k);
            }));
      }
      if (h.length >= 1) {
        const p = pickFactionName(h),
          b = FACTION_DESCRIPTORS[p] || FACTION_DESCRIPTORS.other;
        (() => {
          const usedNames = new Set(l.map((f) => f.name));
          let chosenName = pick(b);
          // Retry up to 5 times to avoid duplicate faction names
          for (let attempt = 0; attempt < 5 && usedNames.has(chosenName); attempt++) {
            chosenName = pick(b);
          }
          // If still duplicate after retries, append a distinguishing suffix
          if (usedNames.has(chosenName)) {
            const suffixes = ['Inner Circle', 'Bloc', 'Alliance', 'Faction', 'Assembly'];
            chosenName = chosenName + ' ' + pick(suffixes);
          }
          l.push({ name: chosenName, members: h, dominantCategory: p });
        })();
      }
    }),
    l.sort((m, h) => h.members.length - m.members.length)
  );
};

// generateConflicts
export const generateConflicts = (r, s, o = {}, d = []) => {
  if (r.length < 2) return [];
  const l = getInstFlags(o, d),
    m = getStressFlags(o, d),
    h = [],
    g = Math.min(randInt(1, 3), Math.floor(r.length / 2)),
    w = [
      {
        issue: 'Control of the market licensing process',
        stakes: 'Commercial supremacy',
        flag: null,
      },
      {
        issue: 'Jurisdiction over a disputed arrest',
        stakes: 'Institutional authority',
        flag: 'stateCrime',
      },
      {
        issue: 'Church land claims on guild property',
        stakes: 'Institutional power',
        flag: 'theocraticEconomy',
      },
      {
        issue: 'Arcane research permit regulations',
        stakes: 'Magical autonomy',
        flag: 'heresySuppression',
      },
      {
        issue: 'Control of the dock taxation authority',
        stakes: 'Port revenue',
        flag: null,
      },
      {
        issue: 'Military conscription of guild apprentices',
        stakes: 'Labor control',
        flag: null,
      },
      {
        issue: "Access to the criminal network's intelligence",
        stakes: 'Operational advantage',
        flag: 'merchantCriminalBlur',
      },
      {
        issue: 'Succession to a council seat',
        stakes: 'Political influence',
        flag: null,
      },
      {
        issue: 'A mercenary contract being disputed by both parties',
        stakes: 'Military contract rights',
        flag: 'merchantArmy',
      },
      {
        issue: 'Control of a key trade route checkpoint',
        stakes: 'Economic leverage',
        flag: null,
      },
    ],
    p = o.stressTypes || (o.stressType ? [o.stressType] : []);
  (p.includes('wartime') &&
    w.push(
      {
        issue: 'Rights to a lucrative war supply contract',
        stakes: 'Economic windfall',
        flag: null,
      },
      {
        issue: 'Authority over military conscription lists',
        stakes: 'Labour and loyalty control',
        flag: null,
      },
      {
        issue: 'Control of the requisition enforcement apparatus',
        stakes: 'Political leverage',
        flag: null,
      }
    ),
    p.includes('insurgency') &&
      w.push(
        {
          issue: 'Legitimacy of the current governing authority',
          stakes: 'Political survival',
          flag: null,
        },
        {
          issue: 'Whether to open back-channel negotiations with the insurgency',
          stakes: 'Settlement stability',
          flag: null,
        },
        {
          issue: 'Control of the intelligence on insurgent cells',
          stakes: 'Operational advantage',
          flag: null,
        }
      ),
    p.includes('mass_migration') &&
      w.push(
        {
          issue: 'Allocation of housing and resources between established residents and newcomers',
          stakes: 'Social cohesion',
          flag: null,
        },
        {
          issue: 'Control of the documentation and registration process for new arrivals',
          stakes: 'Legal and financial leverage',
          flag: null,
        }
      ),
    p.includes('religious_conversion') &&
      w.push(
        {
          issue: "Custody of the settlement's religious records and property",
          stakes: 'Institutional legitimacy',
          flag: null,
        },
        {
          issue: 'Whether the governing authority should formally declare a religious allegiance',
          stakes: 'Political and legal authority',
          flag: null,
        }
      ),
    p.includes('slave_revolt') &&
      w.push(
        {
          issue: 'Whether to suppress, contain, or negotiate with the revolt leadership',
          stakes: 'Settlement order and precedent',
          flag: null,
        },
        {
          issue: 'Accountability for the conditions that produced the revolt',
          stakes: 'Political survival',
          flag: null,
        },
        {
          issue: 'Control of the escape routes and networks supporting the revolt',
          stakes: 'Security and leverage',
          flag: null,
        }
      ),
    p.includes('occupied') &&
      w.push({
        issue: 'Degree of collaboration with the occupying authority',
        stakes: 'Survival vs dignity',
        flag: null,
      }),
    p.includes('famine') &&
      w.push({
        issue: 'Control of the remaining grain stores',
        stakes: 'Survival',
        flag: null,
      }));
  for (let b = 0; b < g && b < r.length - 1; b++) {
    const k = r[b],
      f = r[b + 1],
      C = s.filter((S) => {
        const y = k.members.some((j) => j.id === S.npc1Id || j.id === S.npc2Id),
          v = f.members.some((j) => j.id === S.npc1Id || j.id === S.npc2Id);
        return y && v && ['rival', 'enemy'].includes(S.type);
      });
    if (C.length === 0 && _rng() < 0.4) continue;
    const T = w.filter((S) => !S.flag || m[S.flag]),
      M = pick(T.length ? T : w),
      A = C.length > 1 ? 'high' : C.length === 1 ? 'moderate' : 'low';
    h.push({
      parties: [k.name, f.name],
      issue: M.issue,
      stakes: M.stakes,
      intensity: A,
      desc: `${k.name} and ${f.name} are in ${A} conflict over ${M.issue.toLowerCase()}. The stakes are ${M.stakes.toLowerCase()}.`,
      plotHooks: generateEconomicScore(k, f, M, l, m),
    });
  }
  return h;
};
