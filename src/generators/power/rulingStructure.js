/**
 * power/rulingStructure.js — the core assembly of generatePowerStructure:
 * governing-body determination, the base faction roster (merchant, noble,
 * military, religious, craft, criminal, arcane), power normalisation, then
 * legitimacy and faction-dynamics coupling. Stress reweighting, standing
 * prose and the governance-text layer are delegated to sibling modules.
 */
import { priorityToCategory } from '../economicGenerator.js';
import { getInstFlags, getPriorities, getStressFlags, priorityToMultiplier } from '../helpers.js';
import {
  applyLegitimacyMultipliers,
  computeCriminalCaptureState,
  computeFactionRelationships,
  computePublicLegitimacy,
} from '../factionDynamics.js';
import { inferFactionCategory } from './factionCategories.js';
import { applyStressEventFactions } from './stressFactions.js';
import { annotateFactionStanding } from './factionStanding.js';
import { buildGovernanceLabels } from './governanceNarrative.js';

export const generatePowerStructure = (tier, economicState, tradeRoute, config, institutions = []) => {
  const instNames = (institutions || []).map((N) => (N.name || '').toLowerCase()),
    priorities = getPriorities(config),
    instFlags = getInstFlags(config, institutions),
    stressFlags = getStressFlags(config, institutions),
    factions = /** @type {Array<any>} */ ([]),
    b = tier === 'metropolis' ? 35 : tier === 'city' ? 33 : tier === 'town' ? 31 : 30,
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
    topPriority = re[ie];
  let P,
    I = null;
  if (U) {
    const N =
        topPriority > 65
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
                  : topPriority > 72
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
          (topPriority > 65 &&
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
            topPriority > 65
              ? {
                  military: 'Military Council',
                  religion: 'Church Council',
                  economy: 'Merchant Council',
                  criminal: 'Corrupt Council',
                  magic: 'Arcane Council',
                }[ie] || 'Town Council'
              : (topPriority > 55 &&
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
              ? topPriority > 65
                ? {
                    military: 'Grand Military Council',
                    religion: 'High Theocratic Council',
                    economy: 'Grand Merchant Senate',
                    criminal: 'Shadow Senate',
                    magic: 'Arcane Senate',
                  }[ie] || 'Grand Council'
                : (topPriority > 55 &&
                    {
                      military: 'Grand Council',
                      religion: 'Grand Council',
                      economy: 'Grand Council',
                      criminal: 'Grand Council',
                      magic: 'Grand Council',
                    }[ie]) ||
                  'Grand Council'
              : tier === 'city' || tier === 'metropolis'
                    ? topPriority > 65
                      ? {
                          military: 'Military City Council',
                          religion: 'Ecclesiastical Council',
                          economy: 'Merchant City Council',
                          criminal: 'Corrupt City Council',
                          magic: 'Arcane Council',
                        }[ie] || 'City Council'
                      : (topPriority > 50 &&
                          {
                            military: 'City Council',
                            religion: 'City Council',
                            economy: 'City Council',
                            criminal: 'City Council',
                            magic: 'City Council',
                          }[ie]) ||
                        'City Council'
                    : topPriority > 65
                      ? {
                          military: 'Military Council',
                          religion: 'Church Council',
                          economy: 'Merchant Council',
                          criminal: 'Town Council',
                          magic: 'Arcane Council',
                        }[ie] || 'Town Council'
                      : (topPriority > 55 &&
                          {
                            military: 'Military Council',
                            religion: 'Church Council',
                            economy: 'Merchant Council',
                            criminal: 'Town Council',
                            magic: 'Arcane Council',
                          }[ie]) ||
                        'Town Council');
  let H = null;
  U ||
    (['thorp', 'hamlet', 'village'].includes(tier) && topPriority > 65
      ? (H =
          {
            military: 'defended',
            religion: 'church-guided',
            economy: 'merchant-led',
            criminal: 'compromised',
            magic: 'mage-advised',
          }[ie] || null)
      : tier === 'town' &&
        topPriority > 55 &&
        topPriority <= 65 &&
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
    _ = topPriority > 80 ? 18 : topPriority > 65 ? 12 : topPriority > 50 ? 6 : 0,
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
    (factions.push({
      faction: P,
      modifier: Z || null,
      power: O + _,
      desc: E,
      isGoverning: true,
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
    factions.push({
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
    factions.push({
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
      De = P && P.includes('Merchant oligarchy') ? Math.round(k * 0.85) : 9999;
    factions.push({
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
    factions.push({
      faction: 'Religious Authorities',
      power: C,
      desc: ye,
    });
  }
  if (
    (M > 5 &&
      priorities.economy > 22 &&
      factions.push({
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
    factions.push({
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
    factions.push({
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
  applyStressEventFactions(factions, ke, P, S, config, institutions);
  const dt = factions.reduce((N, ye) => N + ye.power, 0);
  (factions.forEach((N) => {
    N.power = Math.round((N.power / dt) * 100);
  }),
    factions.sort((N, ye) => (N.isGoverning ? -1 : ye.isGoverning ? 1 : ye.power - N.power)),
  annotateFactionStanding(factions));
  // Tag each faction with a category for power-economy correlation
  factions.forEach((f) => {
    if (!f.category) f.category = inferFactionCategory(f.faction || '');
  });
  const { stability: Me, recentConflict: We } = buildGovernanceLabels({
    factions,
    config,
    stressFlags,
    instFlags,
    tradeRoute,
    instNames,
    priorities,
    tier,
    P,
    S,
    ge,
    fe,
  });
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
  applyLegitimacyMultipliers(factions, publicLegitimacy, tier);

  const safetyRatio = instFlags?.inst ? instFlags.militaryEffective / Math.max(8, instFlags.criminalEffective) : 1.0;
  const criminalCaptureState = computeCriminalCaptureState(factions, safetyRatio, instFlags.inst || {});
  // Wave 7 #1 — birth seeds the play-time ladder: a settlement born at
  // equilibrium+ stamps the rung onto the GOVERNING faction entry, which
  // ensureFactionStates reads (faction.captureState) when it mints the
  // §corruption Phase 2 faction state. Without the stamp, the first pulse's
  // settlementCaptureState rollup (worst faction rung, all born 'none')
  // would silently reset the dossier's criminalCaptureState to 'none'.
  // 'adversarial' is not seeded — it asserts enforcement is WINNING, i.e.
  // no faction is on a capture arc.
  if (['equilibrium', 'corrupted', 'capture'].includes(criminalCaptureState)) {
    const govEntry = factions.find((N) => N.isGoverning);
    if (govEntry && !govEntry.captureState) govEntry.captureState = criminalCaptureState;
  }
  const stressTypesArr = config?.stressTypes || (config?.stressType ? [config.stressType] : []);
  const factionRelationships = computeFactionRelationships(
    factions,
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
    factions: factions,
    // Canonical "who governs" name. Sim consumers (factionProfile legitimacy
    // inheritance, ruling_authority governing-faction power, hook escalation,
    // simulation spine, world-event legitimacy deltas) key off this field;
    // it must always name the faction entry that carries isGoverning.
    governingName: (factions.find((N) => N.isGoverning) || {}).faction || null,
    // The government TYPE, persisted explicitly. At generation it equals
    // governingName (the governing entry's name doubles as the government
    // type); a transfer of power (domain/rulingPower.js) keeps both in step
    // while previousGovernments records what the seat used to be.
    government: (factions.find((N) => N.isGoverning) || {}).faction || null,
    stability: Me,
    recentConflict: We,
    publicLegitimacy,
    factionRelationships,
    criminalCaptureState,
  };
};
