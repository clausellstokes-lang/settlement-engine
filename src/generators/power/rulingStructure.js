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
import { drawCouncilOfAKind } from './rulerKin.js'; // COHERENCE-POWERS 2B
import { applyStressEventFactions } from './stressFactions.js';
import { annotateFactionStanding } from './factionStanding.js';
import { buildGovernanceLabels } from './governanceNarrative.js';
import {
  isMaterializedCustomContent,
  nativeSemanticName,
  nativeSemanticNames,
} from '../../domain/content/customContentSemanticAuthority.js';
import { resolveGenerationWorldLaw } from '../generationContext.js'; import { hasMarketInstitution } from '../economy/viability.js'; import { defenseFactsOf, forceWordsOf } from '../../domain/defense/defenseFacts.js'; import { resolveSibling } from '../../domain/facts/drawDeclared.js'; import { factsOf } from '../../domain/facts/factsOf.js'; import { textOf } from '../../domain/facts/textOf.js'; import { MILITARY_GUARD_LABEL } from '../../data/factionLabelSiblings.js'; import { FACTION_DESC_SIBLINGS, GOV_DESC_OF_UNNAMED_SEAT } from '../../data/powerSiblings.js'; export { FACTION_DESC_SIBLINGS }; // SIZE-3, R6, F1, F10, CENSUS-1c, CENSUS-4f, CENSUS-5c and CENSUS-5e (R-AB: the tables moved to data/powerSiblings.js, re-exported): one line, so no cited line moves

import { renormalizeFactionPower } from './renormalizeFactionPower.js'; export { renormalizeFactionPower }; // LANDING-R2 (ODQ §934.105): moved verbatim to power/renormalizeFactionPower.js, re-exported for its importers
import { normalizeAndAnnotateFactions } from './normalizeAndAnnotateFactions.js';
export { normalizeAndAnnotateFactions }; // COHERENCE-POWERS-3 (F12): moved verbatim to power/normalizeAndAnnotateFactions.js, re-exported for its importers


export const generatePowerStructure = (
  tier,
  economicState,
  // The bound neighbour RELATIONSHIP — { neighborName, relationshipType } — or
  // null. steps/generatePower.js passes it ONLY for adversarial relationships
  // (an allied neighbour must arrive as null), and economyReconciliation
  // replays it as intent.neighbourRelationship. Its only consumer is
  // buildGovernanceLabels, which reads both fields off it.
  neighbourRelationship,
  config,
  institutions = [],
  projection = {},
) => {
  // `config` is deliberately the sole route authority: this generator takes no
  // positional route at all (the 3rd positional is the neighbour relationship
  // above) and the pipeline writes the resolved route to
  // effectiveConfig.tradeRouteAccess (steps/resolveConfig.js). Do NOT "repair"
  // this into resolveGenerationWorldLaw(null, config, { tradeRoute: … }) fed
  // from the relationship — that stringifies a relationship OBJECT into the
  // route slot, and a non-coastal seaport with a hostile neighbour silently
  // loses its maritime standing (verified: merchant prose falls back from
  // "International merchant houses controlling port licences" to the generic).
  // CENSUS-1e unit 2 (Appendix B item 23, inline T): a base-roster description CENSUS-5b declared in
  // FACTION_DESC_SIBLINGS (data/powerSiblings.js) resolves where it prints, against the native roster's facts — the
  // original where the record holds its atom, else its twin (a set with no twin keeps the original).
  // ⚠ R-Q: the `militia` atom is NOT settled at this step (CENSUS-5c measured the 1,000: militia 33
  // draw/final differences, garrison 9, watch 0), so no line here presumes the militia: the two
  // militia lines print their guard-free wording (R-U, the chair's ruling of 2026-11-05 05:25).
  const said = (/** @type {string} */ line) => resolveSibling(line, FACTION_DESC_SIBLINGS_SETTLED, { facts: () => factsOf({ institutions: nativeInstitutions }), poolId: 'rulingStructure:FACTION_DESC_SIBLINGS', surface: 'power', drawKind: 'T' });
  const generationWorldLaw = resolveGenerationWorldLaw(null, config);
  const nativeInstitutions = (institutions || []).filter(
      institution => !isMaterializedCustomContent(institution),
    ),
    instNames = nativeSemanticNames(nativeInstitutions)
      .map(name => name.toLowerCase()),
    priorities = getPriorities(config),
    instFlags = getInstFlags(config, institutions),
    stressFlags = getStressFlags(config, institutions),
    factions = /** @type {Array<any>} */ ([]),
    baseGovPower = tier === 'metropolis' ? 35 : tier === 'city' ? 33 : tier === 'town' ? 31 : 30,
    merchantPower = Math.round(25 * priorityToMultiplier(instFlags.economyOutput)),
    militaryPower = Math.round(23 * priorityToMultiplier(instFlags.militaryEffective)),
    religiousPower = Math.round(22 * priorityToMultiplier(instFlags.religionInfluence)),
    criminalPower =
      instFlags.criminalEffective > 42 && (tier === 'city' || tier === 'metropolis' || instFlags.criminalEffective > 58) && (!['thorp', 'hamlet', 'village'].includes(tier) || hasMarketInstitution(nativeInstitutions)) // R6: a small place's guild power needs a market
        ? Math.round(12 * priorityToMultiplier(instFlags.criminalEffective))
        : 0,
    craftPower =
      tier !== 'thorp' && tier !== 'hamlet' && (tier !== 'village' || hasMarketInstitution(nativeInstitutions)) // R6: as the Thieves' Guild above
        ? Math.round(17 * priorityToMultiplier(instFlags.economyOutput * 0.75 + 10))
        : 0,
    arcanePower =
      instFlags.magicInfluence > 28 && (tier === 'city' || tier === 'metropolis')
        ? Math.round(14 * priorityToMultiplier(instFlags.magicInfluence))
        : instFlags.magicInfluence > 55 &&
            tier === 'town' &&
            nativeInstitutions.some(function (inst) {
              var nameLower = nativeSemanticName(inst).toLowerCase();
              return nameLower.includes('mage') || nameLower.includes('wizard') || nameLower.includes('alchemist') || nameLower.includes('arcane');
            })
          ? Math.round(9 * priorityToMultiplier(instFlags.magicInfluence))
          : 0,
    hasNobleInst = nativeInstitutions.some((inst) => {
      var nameLower = nativeSemanticName(inst).toLowerCase();
      return (
        nameLower.includes('lord') ||
        nameLower.includes('noble') ||
        nameLower.includes('manor') ||
        nameLower.includes('royal seat') ||
        nameLower.includes('feudal')
      );
    }),
    economyDisplacesNobles = priorities.economy > 70 && !hasNobleInst,
    hasRoyalSeat = nativeInstitutions.some(function (inst) {
      return nativeSemanticName(inst).toLowerCase().includes('royal seat');
    }),
    nobleBasePower = Math.round(22 * priorityToMultiplier(instFlags.militaryEffective * 0.65 + instFlags.economyOutput * 0.1)),
    nobleInstMultiplier = hasNobleInst ? (hasRoyalSeat ? 1.9 : 1.7) : 1,
    nobleEconomyPenalty = economyDisplacesNobles ? 0.55 : 1,
    nobleTownAdjust = tier === 'town' ? (hasNobleInst ? 1.15 : 0.85) : 1,
    noblePower =
      tier === 'thorp'
        ? 0
        : Math.round(
            tier === 'hamlet' || tier === 'village'
              ? nobleBasePower * nobleInstMultiplier * nobleEconomyPenalty * 0.75
              : nobleBasePower * nobleInstMultiplier * nobleEconomyPenalty * nobleTownAdjust
          ),
    lowerInstNames = instNames,
    governanceLabelMap = {
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
      'royal seat': 'Royal Authority', 'town council': tier === 'metropolis' ? 'Grand Council' : tier === 'city' ? 'City Council' : 'Town Council', "lord's reeve": 'Feudal Stewardship', 'village headman': "Headman's Authority", // J23 2026-09-30: seated forms the table never named (docs/URBAN_BAND_INSTITUTIONS.md)
    };
  let govBody = null;
  for (const [key, label] of Object.entries(governanceLabelMap))
    if (lowerInstNames.some((name) => name.includes(key))) {
      govBody = label;
      break;
    }
  const priorityByCategory = {
      military: priorities.military,
      religion: priorities.religion,
      economy: priorities.economy,
      criminal: priorities.criminal,
      magic: priorities.magic,
    },
    topCategory = Object.entries(priorityByCategory).reduce((best, entry) => (best[1] > entry[1] ? best : entry))[0],
    topPriority = priorityByCategory[topCategory];
  // COHERENCE-POWERS 2B: the governing name and its modifier from one category and its priority, drawn through
  // rulerKin.js :: drawCouncilOfAKind
  const chooseGoverning = (/** @type {string} */ topCategory, /** @type {number} */ topPriority) => {
  let governingFaction,
    govModifier = null;
  if (govBody) {
    const modifier =
        topPriority > 65
          ? {
              military: 'military-dominated',
              religion: 'theocratic-aligned',
              economy: 'commerce-driven',
              criminal: 'corruption-riddled',
              magic: 'arcane-advised',
            }[topCategory]
          : null,
      modifierRedundant =
        [
          'Royal Authority',
          'Noble Governorship',
          'Feudal Stewardship',
          'Feudal Appointee',
          'Household Council',
          'Elder Council',
          'Elected Reeve',
        ].includes(govBody) ||
        (govBody === 'Merchant oligarchy' && topCategory === 'economy') ||
        (govBody === 'Merchant Guild Council' && topCategory === 'economy') ||
        (govBody === 'Guild Council' && topCategory === 'economy') ||
        (govBody === 'Democratic assembly' && topCategory === 'religion');
    if (govBody && (govBody === 'Town Council' || govBody === 'City Council' || govBody === 'Grand Council')) {
      const councilName = modifier
        ? {
            military:
              govBody === 'Grand Council'
                ? 'Grand Military Council'
                : govBody === 'City Council'
                  ? 'Military City Council'
                  : 'Military Council',
            religion:
              govBody === 'Grand Council'
                ? 'High Theocratic Council'
                : govBody === 'City Council'
                  ? 'Ecclesiastical Council'
                  : 'Church Council',
            economy:
              govBody === 'Grand Council'
                ? 'Grand Merchant Senate'
                : govBody === 'City Council'
                  ? 'Merchant City Council'
                  : 'Merchant Council',
            criminal:
              govBody === 'Grand Council'
                ? 'Shadow Senate'
                : govBody === 'City Council'
                  ? 'Corrupt City Council'
                  : topPriority > 72
                    ? 'Corrupt Council'
                    : 'Town Council',
            magic: govBody === 'Grand Council' ? 'Arcane Senate' : 'Arcane Council',
          }[topCategory]
        : null;
      governingFaction = (govBody === 'Town Council' || govBody === 'City Council' || govBody === 'Grand Council') && councilName ? councilName : govBody;
    } else governingFaction = govBody;
    govModifier = modifier && !modifierRedundant ? modifier : null;
  } else
    ['thorp', 'hamlet', 'village'].includes(tier)
      ? (governingFaction =
          (topPriority > 65 &&
            {
              military: "Headman's Authority",
              religion: 'Priestly Guidance',
              economy: 'Household Council',
              criminal: 'Elder Council',
              magic: 'Elder Council',
            }[topCategory]) ||
          'Elder Council')
      : tier === 'town'
        ? (governingFaction =
            topPriority > 65
              ? {
                  military: 'Military Council',
                  religion: 'Church Council',
                  economy: 'Merchant Council',
                  criminal: 'Corrupt Council',
                  magic: 'Arcane Council',
                }[topCategory] || 'Town Council'
              : (topPriority > 55 &&
                  {
                    military: 'Military Council',
                    religion: 'Church Council',
                    economy: 'Merchant Council',
                    criminal: 'Corrupt Council',
                    magic: 'Arcane Council',
                  }[topCategory]) ||
                'Town Mayor')
        : (governingFaction =
            tier === 'metropolis'
              ? topPriority > 65
                ? {
                    military: 'Grand Military Council',
                    religion: 'High Theocratic Council',
                    economy: 'Grand Merchant Senate',
                    criminal: 'Shadow Senate',
                    magic: 'Arcane Senate',
                  }[topCategory] || 'Grand Council'
                : (topPriority > 55 &&
                    {
                      military: 'Grand Council',
                      religion: 'Grand Council',
                      economy: 'Grand Council',
                      criminal: 'Grand Council',
                      magic: 'Grand Council',
                    }[topCategory]) ||
                  'Grand Council'
              : tier === 'city' || tier === 'metropolis'
                    ? topPriority > 65
                      ? {
                          military: 'Military City Council',
                          religion: 'Ecclesiastical Council',
                          economy: 'Merchant City Council',
                          criminal: 'Corrupt City Council',
                          magic: 'Arcane Council',
                        }[topCategory] || 'City Council'
                      : (topPriority > 50 &&
                          {
                            military: 'City Council',
                            religion: 'City Council',
                            economy: 'City Council',
                            criminal: 'City Council',
                            magic: 'City Council',
                          }[topCategory]) ||
                        'City Council'
                    : topPriority > 65
                      ? {
                          military: 'Military Council',
                          religion: 'Church Council',
                          economy: 'Merchant Council',
                          criminal: 'Town Council',
                          magic: 'Arcane Council',
                        }[topCategory] || 'Town Council'
                      : (topPriority > 55 &&
                          {
                            military: 'Military Council',
                            religion: 'Church Council',
                            economy: 'Merchant Council',
                            criminal: 'Town Council',
                            magic: 'Arcane Council',
                          }[topCategory]) ||
                        'Town Council');
  return /** @type {[any, any]} */ ([governingFaction, govModifier]);
  };
  const [governingFaction, govModifier] = drawCouncilOfAKind(chooseGoverning, topCategory, topPriority, priorityByCategory, govBody, nativeInstitutions);
  let informalModifier = null;
  govBody ||
    (['thorp', 'hamlet', 'village'].includes(tier) && topPriority > 65
      ? (informalModifier =
          {
            military: 'defended',
            religion: 'church-guided',
            economy: 'merchant-led',
            criminal: 'compromised',
            magic: 'mage-advised',
          }[topCategory] || null)
      : tier === 'town' &&
        topPriority > 55 &&
        topPriority <= 65 &&
        (informalModifier =
          {
            military: 'arms-backed', // CENSUS-5e unit 2 (R-AN): garrison is not settled at this step, so the modifier presumes none (was garrison-backed, with this as its twin)
            religion: 'church-guided',
            economy: 'commerce-driven',
            criminal: 'corruption-riddled',
            magic: 'arcane-advised',
          }[topCategory] || null));
  const resolvedModifier = (typeof govModifier < 'u' ? govModifier : null) || informalModifier,
    govDescByLabel = {
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
        'A full council governs the city: aldermen, guild masters and appointed officials see to its taxes, its laws and its streets.',
      'Grand Council':
        'A grand council of senior officials, guild masters, and appointed magnates governs the metropolis; the council is always split into camps, and real power shifts between blocs.',
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
        'The richest merchant houses of the metropolis sit as its senate, so the houses that control the trade also make the law.',
      'Grand Guild Consortium':
        "A formal consortium of the metropolis's most powerful guild masters holds civic authority; membership in the consortium is itself a prize.",
      'Guild Authority':
        "The guilds have formalised their political control; the city's elected bodies are largely ceremonial.",
      'Military Council':
        'Military commanders and their officers carry the most weight; ordinary business waits on the needs of defence.',
      'Church Council':
        'Priests sit on the council, and church law and the council\'s law are hard to tell apart.',
      'Merchant Council':
        'Prominent merchants dominate the council; trade and taxation policy favour commercial interests.',
      'Corrupt Council':
        'The governing body is systematically compromised; offices are sold and justice is purchasable.',
      'Arcane Council':
        'Mages and scholars hold the offices here; skill in magic is what earns a seat.',
      'Grand Merchant Senate':
        'A senate of the wealthiest merchant houses governs; political influence is measured in coin, trade concessions, and debt.',
      'Grand Military Council':
        'Military commanders and their allies hold power; everything else waits on the needs of the army.',
      'High Theocratic Council':
        'Senior clergy hold civic authority; religious law and civil law are functionally the same.',
      'Arcane Senate': 'A senate of senior mages governs; the stronger the mage, the louder the voice.',
      'Shadow Senate': 'Nominal governance masks a criminal oligarchy; the real decisions happen in back rooms.',
      'Guild Council': 'The guilds govern together; the richer the guild, the more say it has.',
      'Merchant Guild Council':
        'A consortium of guild masters holds power; policy is shaped by trade interests and inter-guild bargaining.',
      'Noble Governorship':
        'A noble governor rules by hereditary or royal appointment; the settlement has little self-governance.',
      'Merchant oligarchy':
        'Wealthy merchants hold exclusive power; political office is effectively purchased through commercial success.',
      'Democratic assembly':
        'An assembly of citizens votes on major decisions; the powers lobby for influence rather than seizing control.',
      'City-State Council':
        'A city-state council governs with considerable autonomy; camps within it compete for control of policy.',
      'Royal Authority':
        'The crown rules here directly. How far its word carries depends on the monarch\'s strength and on whether the nobles stay loyal.',
    },
    govDescByFaction = {
      'Military Council': 'Military commanders hold direct political authority; civic life is subordinate to defence.',
      'Theocratic Council': 'Religious leadership governs directly; doctrine shapes law and policy.',
      'Church Council': 'Clergy hold substantial political authority alongside civic governance.',
      'Merchant oligarchy':
        'Wealthy merchants hold exclusive power; office is effectively purchased through commercial success.',
      'Merchant Council': 'Merchant interests dominate the council; trade policy is the primary concern.',
      'Corrupt Oligarchy': 'Criminal networks have captured governance; official authority is a facade.',
      'Shadowed Council':
        'Criminal influence shapes decisions behind the scenes; officials are systematically compromised.',
      'Arcane Council': 'Mages govern, and their magic is their claim to rule.',
      'Mixed Council': 'This body holds the seat of government here.', // SW-B1 (P50): the fallback claims only the seat it read
      'Elder Council': 'The oldest heads of the community decide things together; people follow them out of respect and custom, not law.',
      'Town Council':
        'An elected or appointed council governs; merchants, guilds, and prominent families compete for seats.',
    },
    // R-AM (CENSUS-1g): resolved where it is CHOSEN, not inside the table (an eager `said` noted a
    // description no birth printed); `said` hands every non-key back untouched, so nothing moves.
    govDesc = said(govDescByLabel[govBody] || govDescByFaction[governingFaction] || govDescByLabel[governingFaction] || GOV_DESC_OF_UNNAMED_SEAT[governingFaction] || govDescByFaction['Mixed Council']), // SW-B1 (P50): the seat's own line, from either table
    priorityBonus = topPriority > 80 ? 18 : topPriority > 65 ? 12 : topPriority > 50 ? 6 : 0,
    govPower = [
      'Theocratic Council',
      'Military Council',
      'Arcane Council',
      'Royal Authority',
      'Merchant oligarchy',
      'Corrupt Oligarchy',
      'City-State Council',
    ].includes(governingFaction)
      ? baseGovPower + 8
      : ['Feudal Stewardship', 'Feudal Appointee', 'Elder Council', 'Household Council', 'Elected Reeve'].includes(governingFaction)
        ? baseGovPower - 4
        : baseGovPower + 2;
  if (
    (factions.push({
      faction: governingFaction,
      modifier: resolvedModifier || null,
      power: govPower + priorityBonus,
      desc: govDesc,
      isGoverning: true,
    }),
    merchantPower > 5 &&
      !(tier === 'thorp' && merchantPower < 12) &&
      (!['thorp', 'hamlet', 'village'].includes(tier) ||
        // SIZE-3 (ODQ §934.104): a real market by the catalogue (economy/viability.js :: hasMarketInstitution),
        // never the shelf ('market' in a name or any Economy row, which "Subsistence farming" always passed).
        hasMarketInstitution(nativeInstitutions)
      ))
  ) {
    const merchantGoverns =
        governingFaction &&
        (governingFaction.includes('Merchant oligarchy') ||
          governingFaction.includes('Merchant Guild Council') ||
          governingFaction.includes('Merchant Council')),
      merchantAdjPower = Math.round(merchantPower * (merchantGoverns ? 1.25 : 1)),
      supportsMaritimeTrade = generationWorldLaw.supportsMaritime(),
      isCrossroads = ((config == null ? void 0 : config.tradeRouteAccess) || 'road') === 'crossroads',
      merchantDesc =
        merchantGoverns && merchantAdjPower >= 12
          ? 'The ruling class and the merchant class are the same people; commercial decisions are political decisions and civic access is purchased.'
          : merchantAdjPower >= 26
            ? supportsMaritimeTrade
              ? 'International merchant houses controlling port licences and import flows; their political leverage is structural, not merely financial.'
              : isCrossroads
                ? 'Dominant commercial class at a trade nexus; they set prices, control warehousing, and fund the council.'
                : 'Dominant commercial class; their capital and networks give them leverage even formal institutions must respect.'
            : merchantAdjPower >= 18
              ? supportsMaritimeTrade
                ? 'Maritime traders and factor houses controlling import and export flows; prosperous, well-connected, and aware of both.'
                : isCrossroads
                  ? "Market merchants who profit from the settlement's position; buy from one direction, sell to another, lobby for both."
                  : 'Established merchant community; fund civic works and expect council access in return.'
              : merchantAdjPower >= 10
                ? 'Merchants with local reach; a consistent civic presence without yet being the dominant commercial voice.'
                : said('A small group of traders who come on market days; they speak up in small disputes but carry little weight beyond them.'),
      // SW-8: "(dominant)" left the name (it printed); the cap reads the dominance itself.
      merchantDominant =
        (economicState == null ? void 0 : economicState.prosperity) === 'Wealthy' ||
        (economicState == null ? void 0 : economicState.prosperity) === 'Thriving',
      merchantLabel = 'Merchant Guilds',
      merchantFinalPower = merchantAdjPower,
      govFullPower = (govPower || baseGovPower) + (priorityBonus || 0),
      merchantCap = merchantDominant ? Math.round(govFullPower * 0.88) : 9999;
    factions.push({
      faction: merchantLabel,
      power: Math.min(merchantFinalPower, merchantCap),
      desc: merchantDesc,
    });
  }
  if (noblePower > (tier === 'town' && !hasNobleInst ? 10 : 5)) {
    const nobleGoverns =
        governingFaction &&
        (governingFaction.includes('Feudal') ||
          governingFaction.includes('Noble') ||
          governingFaction.includes('Royal Authority') ||
          governingFaction.includes('Household Council')),
      merchantAligned =
        governingFaction &&
        (governingFaction.includes('Merchant oligarchy') ||
          governingFaction.includes('Democratic assembly') ||
          governingFaction.includes('Guild Council') ||
          governingFaction.includes('Merchant Guild Council')),
      nobleLabel =
        tier === 'hamlet' || tier === 'village'
          ? 'Manor Household'
          : tier === 'town'
            ? 'Landed Gentry'
            : tier === 'metropolis'
              ? 'Noble Houses'
              : 'Noble Families',
      nobleDesc =
        hasNobleInst && nobleGoverns
          ? priorityToCategory(priorities.military) === 'very_high'
            ? `Hereditary landowners behind the ${governingFaction}; military levies, land rents, and judicial rights all flow through noble title. Their word is law within their demesne.` // SW-B1 (§2·D #7): one governing card, not two
            : noblePower > 20
              ? 'Hereditary landowners whose land rights and military obligations are structurally embedded in governance here; the council works alongside them, not over them.'
              : noblePower > 10
                ? 'Hereditary landowners with genuine but not dominant feudal claims; they shape decisions at the margins more than they command them.'
                : 'Noble families with residual feudal claims; the formal obligations are real, but other powers set the practical agenda day to day.'
          : merchantAligned
            ? priorityToCategory(priorities.economy) === 'very_high'
              ? 'Old landed families being systematically displaced by merchant wealth; they retain hereditary title but little real leverage. A dangerous combination of pride and declining power.'
              : 'Landed families increasingly outpaced by merchant capital; they compete for council seats, marriage alliances, and royal appointments to maintain relevance.'
            : tier === 'hamlet' || tier === 'village'
              ? "The local lord's household; land rights and feudal obligation give them a formal claim to authority, though other powers hold more practical influence day to day."
              : hasNobleInst && governingFaction && governingFaction.includes('Royal Authority')
                ? noblePower > 25
                  ? "The great noble houses are the crown's military and fiscal foundation, and they know it. Royal policy is negotiated with them as much as decreed over them."
                  : noblePower > 15
                    ? 'Hereditary landowners whose cooperation the crown depends on for levies, taxes, and regional order. Not powerful enough to dictate, but essential enough to court.'
                    : 'Noble families nominally loyal to the crown, but watching which way the political wind is blowing before committing resources.'
                : priorityToCategory(priorities.military) === 'very_high'
                  ? "Militarised noble families whose landholdings double as fortified estates; they provide the settlement's heavy cavalry and expect political weight in return."
                  : noblePower > 20
                    ? 'Landed noble families whose hereditary rights, land rents, and marriage networks give them structural influence the elected council cannot easily override.'
                    : noblePower > 10
                      ? tier === 'metropolis'
                        ? 'Hereditary great families with land grants, court appointments, and dynastic marriage networks; structurally embedded in governance even when not formally in power.'
                        : tier === 'city'
                          ? 'Noble families with hereditary land rights and traditional privileges; active in civic politics and competitive with merchant capital.'
                          : 'Gentry families with local landholdings; active in civic politics but outpaced by merchant capital in raw financial leverage'
                      : 'Minor landed families with limited political reach; present in civic life but rarely decisive.';
    factions.push({
      faction: nobleLabel,
      power: noblePower,
      desc: nobleDesc,
    });
  }
  if (militaryPower > 5 && (tier !== 'thorp' || priorities.military > 60)) {
    const militaryDesc = said(
        priorityToCategory(priorities.military) === 'very_high'
          ? militaryPower > 25
            ? ['city', 'metropolis'].includes(tier)
              ? 'Standing army with genuine political weight; command appointments are patronage, and the council knows it.'
              : "Significant military force for this scale; the commander's opinion on civic matters carries institutional weight."
            : 'Significant military presence; officers hold political influence disproportionate to formal civic rank.'
          : priorityToCategory(priorities.military) === 'low'
            ? ['hamlet', 'village', 'thorp'].includes(tier)
              ? 'Part-time armed volunteers with limited organisation; authority is moral rather than institutional.'
              : 'Undermanned and underfunded; unable to enforce law consistently and aware of it.'
            : ['thorp', 'hamlet', 'village'].includes(tier)
              ? "Armed patrol of able-bodied residents; the settlement's primary recourse when disputes turn physical."
              : tier === 'town'
                ? 'Town watch; it enforces ordinances, manages disorder, and reports to the council.'
                : militaryPower > 18
                  ? 'Well-funded city watch; it keeps order reliably and is growing more sure of its own authority.'
                  : 'City watch; law enforcement and external defence, stretched between multiple responsibilities.'),
      militaryDescFinal =
        governingFaction && (governingFaction.toLowerCase().includes('military council') || governingFaction.toLowerCase().includes('martial'))
          ? militaryDesc +
            (forceWordsOf(defenseFactsOf({ institutions: nativeInstitutions })).members === 'soldiers' ? ' Operationally distinct from the command council: these are the soldiers and watchmen, not the officers who govern.' : ` Operationally distinct from the command council: these are the ${forceWordsOf(defenseFactsOf({ institutions: nativeInstitutions })).members}, not the officers who govern.`)
          : militaryDesc,
      militaryCap = governingFaction && governingFaction.includes('Merchant oligarchy') ? Math.round(merchantPower * 0.85) : 9999;
    factions.push({
      faction: textOf(MILITARY_GUARD_LABEL), // CENSUS-4f: declared `guardPresence`, carried (data/factionLabelSiblings.js)
      power: Math.min(militaryPower, militaryCap),
      desc: militaryDescFinal,
    });
  }
  const hasReligiousInst = lowerInstNames.some(
      (name) =>
        !name.startsWith('access to') &&
        (name.includes('parish church') ||
          name.includes('cathedral') ||
          name.includes('monastery') ||
          name.includes('friary') ||
          name.includes('temple') ||
          name.includes('shrine') ||
          name.includes('priest (resident)') ||
          name.includes('graveyard'))
    ),
    religiousGate = ['village', 'town', 'city', 'metropolis'].includes(tier) || hasReligiousInst;
  if (religiousPower > 5 && religiousGate) {
    const religiousDesc =
      priorities.criminal > 70 && priorities.religion < 35 && instFlags.criminalEffective > 60
        ? 'Clergy operate here but the church holds little civic authority; organised crime has crowded out most formal moral influence.'
        : governingFaction && governingFaction.includes('Theocratic Council')
          ? 'Religious law governs directly; clergy are administrators as much as priests, and doctrine shapes civic ordinance.'
          : governingFaction && governingFaction.includes('Church Council')
            ? 'Church authority is the formal source of governing legitimacy here; clergy hold both spiritual and temporal jurisdiction.'
            : religiousPower > 24
              ? lowerInstNames.some((name) => name.includes('cathedral') || name.includes('monastery'))
                ? 'Church institutions hold direct temporal power; tithes, land, and courts are all ecclesiastical.'
                : "Church holds substantial temporal power; tithes fund civic works and the clergy's opinion on appointments carries decisive weight."
              : religiousPower > 17
                ? ['city', 'metropolis'].includes(tier)
                  ? (defenseFactsOf({ institutions: nativeInstitutions }).hasHospital ? 'Major church institutions hold structural influence. Land grants, hospital networks, and moral authority give them leverage across multiple civic domains.' : 'Major church institutions hold structural influence. Land grants, charity, and moral authority give them leverage across multiple civic domains.')
                  : ['hamlet', 'village'].includes(tier)
                    ? 'The village priest is the most educated person for miles; moral authority and practical influence are inseparable at this scale.'
                    : 'Church institutions are well-embedded in civic life; their opinion on appointments, taxation, and law is sought and usually influential.'
                : religiousPower > 10
                  ? ['hamlet', 'village', 'thorp'].includes(tier)
                    ? 'The local clergy serve a real pastoral role; their moral authority has limited political reach but is genuinely respected.'
                    : 'Clergy and church institutions exercise meaningful civic influence through moral authority, land ownership, and popular trust.'
                  : 'Clergy are present but operate at the margins of civic life; their moral authority is real but their political leverage is limited.';
    factions.push({
      faction: 'Religious Authorities',
      power: religiousPower,
      desc: religiousDesc,
    });
  }
  if (
    (craftPower > 5 &&
      priorities.economy > 22 &&
      factions.push({
        faction: 'Craft Guilds',
        power: craftPower,
        desc:
          craftPower > 16
            ? ['city', 'metropolis'].includes(tier)
              ? 'Well-organised craft guilds with established trade monopolies; a persistent civic voice that merchant houses must negotiate with, not ignore.'
              : 'Craft masters controlling production standards and apprenticeships; present in every civic dispute over prices and supply.'
            : craftPower > 10
              ? 'Craft guilds regulating production and apprenticeships; a reliable secondary presence in civic life.'
              : 'Artisan guilds maintaining standards in a thin economy; not politically weak by choice, but by circumstance.',
      }),
    criminalPower > 5)
  ) {
    const criminalDesc =
      criminalPower > 22
        ? 'Underworld effectively controls vice, smuggling, and key officials; the nominal government tolerates this because it cannot currently change it.'
        : criminalPower > 16
          ? 'Criminal organisations have captured significant influence; corruption is systemic, not exceptional.'
          : criminalPower > 10
            ? 'Organised criminal network controls the black market and several informal revenue streams; present in council discussions through intermediaries.'
            : ['hamlet', 'village', 'thorp'].includes(tier)
              ? 'A local protection operation tolerated because the alternative is open conflict with people who know the terrain better.'
              : 'Criminal network operating in shadows; controls illicit trade and profits from the gap between law and enforcement.';
    factions.push({
      faction: "Thieves' Guild",
      power: criminalPower,
      desc: criminalDesc,
    });
  }
  const arcaneAdjPower =
    governingFaction && governingFaction.includes('Arcane Council')
      ? Math.max(arcanePower, Math.max(12, Math.round(14 * priorityToMultiplier(instFlags.magicInfluence))))
      : arcanePower;
  arcaneAdjPower > 5 &&
    factions.push({
      faction: 'Arcane Orders',
      power: arcaneAdjPower,
      desc:
        arcaneAdjPower > 22
          ? 'Arcane institutions hold substantial political leverage here. Contracts, security, and infrastructure all depend on magical services only they provide.'
          : arcaneAdjPower > 16
            ? 'Wizard towers and mage guilds hold genuine political weight; their services are structurally irreplaceable and they know it.'
            : arcaneAdjPower > 10
              ? 'Mages and arcane practitioners hold real influence through monopoly on magical services and the latent fear their capabilities inspire.'
              : 'Magical practitioners are consulted but not formally empowered. Their influence is advisory, transactional, and quietly resented.',
    });
  // CENSUS-1b unit B (the chair's ruling): the power step reads the stress ENTRIES the intent
  // carries — their kinds, and the migration entry's direction — not `config.stressTypes`. A held
  // intent written before the entries were carried falls back to the config's kinds (no entry, so
  // the catalog's direction). At birth the two kind lists are one list, so no birth moves.
  const stressEntries = Array.isArray(projection.stressEntries) ? projection.stressEntries : null;
  const stressType = (config == null ? void 0 : config.stressType) || null,
    stressTypes = stressEntries
      ? stressEntries.map((e) => e.type)
      : (config == null ? void 0 : config.stressTypes) || (stressType ? [stressType] : []),
    hasStress = (s) => stressTypes.includes(s);
  applyStressEventFactions(factions, hasStress, governingFaction, hasNobleInst, config, institutions, stressEntries || []);
  const standingForce = forceWordsOf(defenseFactsOf({ institutions: nativeInstitutions })); normalizeAndAnnotateFactions(factions, standingForce, { annotate: false }); // F1: the standing lines name the force that stands; SW-B1 (P51): annotated below, after the last power write
  // Tag each faction with a category for power-economy correlation
  factions.forEach((f) => {
    if (!f.category) f.category = inferFactionCategory(f.faction || '');
  });
  const { stability, recentConflict } = buildGovernanceLabels({
    factions,
    config,
    stressFlags,
    instFlags,
    neighbourRelationship,
    instNames,
    priorities,
    tier,
    governingFaction,
    hasNobleInstitution: hasNobleInst,
    stressTypes,
    stressEntries: stressEntries || [],
    fallbackStressType: stressType,
  });
  // ── Public legitimacy & faction dynamics ────────────────────────────────
  // At this point defenseProfile isn't computed yet — we use a provisional
  // defense label derived from institution presence for the legitimacy score,
  // and the actual defenseProfile will be added by generateSettlement after.
  const _hasWalls = nativeInstitutions.some(
    (i) =>
      nativeSemanticName(i).toLowerCase().includes('wall') ||
      nativeSemanticName(i).toLowerCase().includes('palisade') ||
      nativeSemanticName(i).toLowerCase().includes('citadel')
  );
  const _hasGarrison = nativeInstitutions.some(
    i => nativeSemanticName(i).toLowerCase().includes('garrison'),
  );
  const _hasMilitia = nativeInstitutions.some(
    (i) => nativeSemanticName(i).toLowerCase().includes('militia')
      || nativeSemanticName(i).toLowerCase().includes('watch')
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

  const legitimacyDefenseLabel = projection.defenseLabel || _provDefLabel;
  const publicLegitimacy = computePublicLegitimacy(
    economicState,
    legitimacyDefenseLabel,
    tier,
  );

  // Apply multipliers before relationship computation (relationships use final powers)
  applyLegitimacyMultipliers(factions, publicLegitimacy, tier);
  annotateFactionStanding(factions, standingForce); // SW-B1 (P51): on the power order the cards print, after the multipliers' re-sort

  const safetyRatio = safetyRatioOf(instFlags);
  // ALLEGIANCE-CAR2 (2026-11-08, the allegiance design §3.4, J-13 — ONE writer): the hall-capture state is
  // no longer written here. It is DERIVED at the coherence seam (domain/people/hallCapture.js ::
  // writeHallCapture, the only writer of `criminalCaptureState` and of the governing row's birth
  // `captureState` seed), from the hidden agents in the ruling three and this step's classifier, kept as the
  // CLIMATE RUNG (`captureClimateOf` below, read over the seam's final roster). The relationships below
  // still read the classifier's verdict for their own lines, as before.
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
    stressTypesArr, defenseFactsOf({ institutions: nativeInstitutions }), // R6: the soldiers line reads the place's forces
  );

  return {
    factions: factions,
    // Canonical "who governs" name. Sim consumers (factionProfile legitimacy
    // inheritance, ruling_authority governing-faction power, hook escalation,
    // simulation spine, world-event legitimacy deltas) key off this field;
    // it must always name the faction entry that carries isGoverning.
    governingName: (factions.find((f) => f.isGoverning) || {}).faction || null,
    // The government TYPE, persisted explicitly. At generation it equals
    // governingName (the governing entry's name doubles as the government
    // type); a transfer of power (domain/rulingPower.js) keeps both in step
    // while previousGovernments records what the seat used to be.
    government: (factions.find((f) => f.isGoverning) || {}).faction || null,
    stability,
    recentConflict,
    publicLegitimacy,
    factionRelationships,
  };
};

/** The power step's safety ratio (military over criminal, floored at 8; 1 with no flags). @param {any} instFlags @returns {number} */
function safetyRatioOf(instFlags) {
  return instFlags?.inst ? instFlags.militaryEffective / Math.max(8, instFlags.criminalEffective) : 1.0;
}

/**
 * THE CLIMATE RUNG (ALLEGIANCE-CAR2, the design §3.4): the strengths-only classifier (factionDynamics.js ::
 * computeCriminalCaptureState) over a settlement's CURRENT powers, institutions and config; draw-free. The
 * seam hands it to domain/people/hallCapture.js :: hallCaptureOf, which caps it at 'equilibrium'.
 * @param {{ config?: any, institutions?: any[], powerStructure?: { factions?: any[] } }} settlement
 * @returns {'none'|'adversarial'|'equilibrium'|'corrupted'|'capture'}
 */
export function captureClimateOf(settlement) {
  const instFlags = getInstFlags(settlement?.config || {}, settlement?.institutions || []);
  const factions = Array.isArray(settlement?.powerStructure?.factions) ? settlement.powerStructure.factions : [];
  return computeCriminalCaptureState(factions, safetyRatioOf(instFlags), instFlags.inst || {});
}

/** The sets this step can answer (R-Q): every set whose atoms are settled before the power step. */
const FACTION_DESC_SIBLINGS_SETTLED = Object.freeze(Object.fromEntries(Object.entries(FACTION_DESC_SIBLINGS)
  .filter(([, set]) => !set.some((l) => [...(/** @type {any} */ (l).needs || []), ...(/** @type {any} */ (l).excludes || [])].includes('militia')))));

