/**
 * economy/economicState.js — assembles the complete economic state for a settlement: income sources, trade goods, chains, dependencies, and prosperity.
 */

import { random as _rng } from '../../kernel/rngContext.js';
import { compareCodepoint } from '../../domain/deterministicSort.js';
import { getInstFlags, getPriorities, getStressFlags, getTradeRouteFeatures, hasTeleportationInfra, priorityToMultiplier } from '../helpers.js';
import { generateSafetyProfile } from '../safetyProfile.js';
import { TRADE_DEPENDENCY_NEEDS } from '../../data/economicData.js';
import { computeActiveChains, deriveExportsFromChains, deriveImportsFromChains, deriveLocalProductionFromChains, deriveInstitutionalServices, deriveServiceExports } from '../computeActiveChains.js';
import { subsumeTradeGoods, reconcileTradeLists } from '../../domain/region/goodsCatalog.js';
import { generateTradeIncomeStreams } from './tradeGoods.js';
import { computeBaseProsperity, deriveEconomicComplexity, deriveProsperityLabel, deriveEconomicSituationDesc } from './prosperity.js';
import { computeFinishedGoodsDemand } from './finishedGoodsDemand.js';


export const generateEconomicState = (tier, institutions, tradeRoute, goodsToggles = {}, config = {}) => {
  const instNames = institutions.map((inst) => inst.name),
    hasInst = (...keywords) => keywords.some((keyword) => instNames.some((name) => name.toLowerCase().includes(keyword))),
    ecoPriorities = getPriorities(config),
    ecoInstFlags = getInstFlags(config, institutions),
    ecoStressFlags = getStressFlags(config, institutions),
    safetyProfile = generateSafetyProfile(config, tier, institutions),
    incomeBuild = [];
  ['thorp', 'hamlet', 'village'].includes(tier)
    ? incomeBuild.push({
        source: 'Agricultural Rents',
        percentage: 65,
        desc: 'Payments in kind or coin from tenant farmers; the primary revenue at this scale.',
      })
    : tier === 'town' &&
      !hasInst('market square', 'weekly market', 'daily market') &&
      incomeBuild.push({
        source: 'Agricultural Rents',
        percentage: 30,
        desc: 'Rural hinterland rents remain significant without large market infrastructure.',
      });
  const isIsolated = tradeRoute === 'isolated';
  const isolatedMagicTrade = isIsolated && hasTeleportationInfra(institutions, config);
  const trulyIsolated = isIsolated && !isolatedMagicTrade;
  const magicRevenueScale = isolatedMagicTrade ? 0.4 : 1;
  // Subsistence gate: isolated thorp/hamlet/village produce for themselves only
  const SUBSISTENCE_TIERS_ECO = ['thorp', 'hamlet', 'village'];
  const isSubsistenceOnly = isIsolated && SUBSISTENCE_TIERS_ECO.includes(tier) && !isolatedMagicTrade;
  // ── Market taxes / magical trade revenue — scaled by market institution tier ──
  if (!trulyIsolated && hasInst('district market', 'multiple market')) {
    incomeBuild.push({
      source: isolatedMagicTrade ? 'Magical Trade Revenue' : 'Market Taxes',
      percentage: Math.round(45 * magicRevenueScale),
      desc: 'District-level duties on specialized goods; primary civic revenue at metropolis scale.',
    });
  } else if (!trulyIsolated && hasInst('daily market')) {
    incomeBuild.push({
      source: isolatedMagicTrade ? 'Magical Trade Revenue' : 'Market Taxes',
      percentage: Math.round(35 * magicRevenueScale),
      desc: isolatedMagicTrade
        ? 'Trade flowing through teleportation channels generates modest fees and arcane duties.'
        : 'Daily market tolls, stall fees, and weights-and-measures inspections.',
    });
  } else if (!trulyIsolated && hasInst('market square', 'weekly market', 'annual fair')) {
    incomeBuild.push({
      source: isolatedMagicTrade ? 'Magical Trade Revenue' : 'Market Taxes',
      percentage: Math.round(22 * magicRevenueScale),
      desc: isolatedMagicTrade
        ? 'Magical trade conduits generate modest fees and arcane duties on transported goods.'
        : 'Market day stall fees and toll collection on goods entering the market.',
    });
  }

  // ── Guild licensing / fees ──
  if (!trulyIsolated && hasInst('craft guilds (100', 'merchant guilds (50')) {
    incomeBuild.push({
      source: 'Guild Licensing',
      percentage: 28,
      desc: 'Charter fees, quality inspection levies, and licensing of all trades and crafts.',
    });
  } else if (!trulyIsolated && hasInst('guild')) {
    incomeBuild.push({
      source: 'Guild Fees',
      percentage: 18,
      desc: 'Annual licensing fees and fines levied by guild oversight.',
    });
  }

  // ── Port duties / river tolls ──
  // Port Duties keys on port institutions the catalog actually generates:
  // 'Docks/port facilities', "Harbour master's office", 'Shipyard'.
  // 'docks/port' (not bare 'dock') so 'Airship docking' never reads as a
  // harbour; 'shipyard' must not match 'River boatyard'.
  if (hasInst('docks/port', 'harbour master', 'shipyard') && tradeRoute === 'port') {
    incomeBuild.push({
      source: 'Port Duties',
      percentage: 35,
      desc: 'Import and export taxes, anchorage fees, and customs inspection on all cargo.',
    });
  } else if (hasInst('docks/port', 'port facilit') && tradeRoute === 'river') {
    incomeBuild.push({
      source: 'River Tolls',
      percentage: 20,
      desc: 'Tolls on river traffic, dock fees, and ferry rights.',
    });
  }

  // ── Financial services / banking fees ──
  if (hasInst('banking district', 'stock exchange')) {
    incomeBuild.push({
      source: 'Financial Services',
      percentage: 22,
      desc: 'Civic taxes on banking operations, letters of credit, and financial transaction fees.',
    });
  } else if (hasInst('banking house', 'money changer')) {
    incomeBuild.push({
      source: 'Banking Fees',
      percentage: 14,
      desc: 'Interest income, currency exchange commissions, and safe deposit charges.',
    });
  }

  // ── Property rents — gated on the tier having built trade-route features ──
  if (getTradeRouteFeatures(tier)) {
    const propertyRentPct = tier === 'metropolis' ? 18 : tier === 'city' ? 14 : 10;
    incomeBuild.push({
      source: 'Property Rents',
      percentage: propertyRentPct,
      desc: 'Ground rents on civic-owned buildings, stalls, and residential plots within the walls.',
    });
  }
  // ── Court fees & fines ──
  if (hasInst('courthouse', 'multiple court', 'city hall')) {
    incomeBuild.push({
      source: 'Court Fees & Fines',
      percentage: 10,
      desc: 'Filing fees, fines levied on offenders, and fees for notarial and legal certification services.',
    });
  }

  // ── Toll revenue / gate tolls ──
  if (!trulyIsolated && tradeRoute === 'crossroads') {
    incomeBuild.push({
      source: 'Toll Revenue',
      percentage: 20,
      desc: 'Passage tolls on all roads and bridges serving the crossroads position.',
    });
  } else if (!trulyIsolated && tradeRoute === 'road' && hasInst('gate', 'town wall', 'city wall')) {
    incomeBuild.push({
      source: 'Gate Tolls',
      percentage: 10,
      desc: 'Entry and exit tolls collected at the town gates from merchants and travellers.',
    });
  }

  // ── Military levy — only where a real garrison meets a militarised priority ──
  if (hasInst('garrison', 'multiple garrison', 'professional guard') && ecoPriorities.military > 55) {
    const militaryLevy = ecoStressFlags.stateCrime
      ? {
          source: 'Military Extraction',
          percentage: 20,
          desc: 'Forced contributions and confiscations collected by the garrison — not formally a tax.',
        }
      : {
          source: 'Military Levy',
          percentage: 12,
          desc: 'Emergency and standing levies on the population to fund garrison upkeep.',
        };
    incomeBuild.push(militaryLevy);
  }
  const hasReligiousInst = institutions.some(function (inst) {
    var name = (inst.name || '').toLowerCase();
    return (
      (name.includes('parish church') ||
        name.includes('cathedral') ||
        name.includes('monastery') ||
        name.includes('friary') ||
        name.includes('temple') ||
        name.includes('graveyard')) &&
      !name.startsWith('access to')
    );
  });
  // ── Church tithes / pilgrim trade — gated on real religious institutions ──
  if (ecoInstFlags.religionInfluence > 55 && hasReligiousInst) {
    if (ecoStressFlags.theocraticEconomy) {
      incomeBuild.push({
        source: 'Church Tithes & Rents',
        percentage: Math.round(ecoInstFlags.religionInfluence / 4),
        desc: 'Mandatory tithes plus rent income from church-owned land dominating the local economy.',
      });
    } else {
      incomeBuild.push({
        source: 'Church Tithes',
        percentage: Math.round(ecoInstFlags.religionInfluence / 5),
        desc: 'Tithes, offerings, and fees for burial and sacramental services collected by resident clergy.',
      });
    }
    if (ecoInstFlags.religionInfluence > 68 && (tradeRoute === 'crossroads' || tradeRoute === 'road')) {
      incomeBuild.push({
        source: 'Pilgrim Trade',
        percentage: Math.round(ecoInstFlags.religionInfluence / 9),
        desc: 'Offerings, hospitality fees, relic sales, and incidental commerce from visiting pilgrims.',
      });
    }
  }
  // ── Three-tier magic economy ──────────────────────────────────────────────
  // Tier thresholds scale with settlement size — small settlements need higher
  // magic density to support commercial arcane activity
  const magPri = ecoInstFlags.magicInfluence; // priorityMagic value (0-100)
  const hasAlch = hasInst('alchemist', 'herbalist', 'apothecary', 'hedge wizard');
  const hasSpell = hasInst('wizard', 'mage', 'spellcasting', 'arcane');
  const hasMagesGuild = hasInst(
    "mages' guild",
    "mages' district",
    'arcane academy',
    'academy of magic',
    "wizard's tower",
    'magical academy'
  );
  const TIER_ORDER_LOCAL = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
  const tierIdx = TIER_ORDER_LOCAL.indexOf(tier);

  if (magPri > 0) {
    // LOW: apothecary / hedge magic — alchemists, herbalists, hedge wizards
    // Available from village+ when any alchemical institution present
    if (magPri >= 15 && hasAlch && tierIdx >= 2) {
      const pct = Math.round(Math.max(4, magPri / 14));
      incomeBuild.push({
        source: magPri < 35 ? 'Herbalist & Apothecary' : 'Apothecary & Alchemy',
        percentage: pct,
        desc:
          magPri < 35
            ? 'Herbal remedies, minor alchemical preparations, and potion sales. The local alchemist supplements conventional trade.'
            : 'A thriving alchemical trade in reagents, preparations, and curative potions draws customers from surrounding settlements.',
      });
    }

    // MEDIUM: commercial spellcasting — identification, divination, minor enchanting
    // Available from town+ when spellcasting institutions present
    if (magPri >= 35 && hasSpell && tierIdx >= 3) {
      const pct = Math.round(Math.max(6, magPri / 10));
      incomeBuild.push({
        source: 'Spellcasting Services',
        percentage: pct,
        desc:
          magPri < 60
            ? 'Fees for identification, minor enchanting, and divination. Adventurers and merchants both pay well for reliable magical services.'
            : 'A busy market for spell services — identification, augury, message sending, and contract-grade enchanting brings steady coin.',
      });
    }

    // HIGH: arcane industry — enchanting contracts, research, magical item market
    // Available from city+ when mages' guild or academy present
    if (magPri >= 65 && hasMagesGuild && tierIdx >= 4) {
      const pct = Math.round(Math.max(10, magPri / 7));
      incomeBuild.push({
        source: ecoStressFlags.magicFillsVoid ? 'Arcane Economy' : 'Arcane Industry',
        percentage: pct,
        desc: ecoStressFlags.magicFillsVoid
          ? 'Magic has absorbed functions normally provided by conventional trade, government, and religion. Arcane licences, guild dues, and service fees constitute the primary revenue base.'
          : "Enchanting contracts, magical research commissions, and the licensing of spellcasting practitioners. The mages' guild contributes meaningfully to civic revenue.",
      });
      // Bonus: enchanting multiplier boosts metalwork/crafts income when present
      // (represented as a cross-chain enhancement note in the existing income entries)
      if (magPri >= 75 && (hasInst('armourer') || hasInst('weaponsmith') || hasInst('jewel'))) {
        incomeBuild.push({
          source: 'Enchanted Goods Premium',
          percentage: Math.round(magPri / 18),
          desc: 'Weapons, armour, and jewellery command a premium once enchanted. The local arcanists increase the margin on craft exports.',
        });
      }
    }
  }
  const tradeStreams = generateTradeIncomeStreams(tier, institutions, tradeRoute, goodsToggles, { ...config });
  // ── Trade-derived income bonuses, security surcharges, criminal economy ──
  const incomeBonuses = tradeStreams.incomeBonuses;
  if (incomeBonuses != null) incomeBonuses.forEach((bonus) => incomeBuild.push(bonus));
  if (ecoStressFlags.merchantArmy) {
    incomeBuild.push({
      source: 'Security Contracts',
      percentage: 12,
      desc: 'Guild-funded private security surcharges — effectively a privatised protection tax on trade.',
    });
  }
  if (safetyProfile.blackMarketCapture > 10) {
    // Unified criminal economy income — uses raw bmc as weight so normalized % matches Shadow Economy section
    const bmc = safetyProfile.blackMarketCapture;
    const crimInsts = safetyProfile.criminalInstitutions || [];
    const hasGuild = crimInsts.some(
      (inst) => inst.toLowerCase().includes('guild') || inst.toLowerCase().includes('thieves')
    );
    const hasMarket = crimInsts.some(
      (inst) => inst.toLowerCase().includes('black market') || inst.toLowerCase().includes('underground')
    );
    const hasSmuggling = crimInsts.some(
      (inst) => inst.toLowerCase().includes('smuggl') || inst.toLowerCase().includes('front')
    );
    const label =
      hasGuild && hasMarket
        ? 'Criminal Syndicate Revenue'
        : hasGuild
          ? "Thieves' Guild Revenue"
          : hasSmuggling
            ? 'Smuggling Network Revenue'
            : bmc >= 20
              ? 'Shadow Economy (untaxed)'
              : 'Black Market Revenue';
    const desc = `An estimated ${bmc}% of economic activity flows through unofficial channels — ${
      hasGuild
        ? 'guild-organised fencing, extortion, and black market trade'
        : hasSmuggling
          ? 'smuggling margins, contraband networks, and protection rackets'
          : 'untaxed trade, fencing, and criminal margins'
    }. This income stays in the settlement but flows to criminal actors, not the public treasury.`;
    incomeBuild.push({ source: label, percentage: bmc, desc, isCriminal: true });
  }
  if (incomeBuild.length === 0) {
    incomeBuild.push({
      source: 'Subsistence Production',
      percentage: 100,
      desc: 'Barter and in-kind exchange; no significant monetary income. Survival is the economy.',
    });
  }
  if (!isSubsistenceOnly) {
    // Resource trade income — only when trade routes exist
    const localProdLower = (tradeStreams.localProduction || []).map(function (good) {
        return (typeof good == 'string' ? good : good.name || '').toLowerCase();
      }),
      exportsLower = (tradeStreams.exports || []).map(function (exp) {
        return (typeof exp == 'object' ? exp.product || exp.chain || '' : exp || '').toLowerCase();
      }),
      hasInstNamed = function (keyword) {
        return institutions.some(function (inst) {
          return (inst.name || '').toLowerCase().includes(keyword);
        });
      },
      hasIncomeSource = function (keyword) {
        return incomeBuild.some(function (entry) {
          return (entry.source || '').toLowerCase().includes(keyword.toLowerCase());
        });
      },
      nearbyResources = config.nearbyResources || [],
      hasNearbyResource = function () {
        var keywords = [].slice.call(arguments);
        return nearbyResources.some(function (res) {
          return keywords.some(function (kw) {
            return res.includes(kw);
          });
        });
      };
    // Each resource stream is an independent gate; earlier pushes are visible to
    // later hasIncomeSource() checks, so the evaluation order is load-bearing.
    if (
      (localProdLower.some(function (good) {
        return good.includes('grain') || good.includes('wheat') || good.includes('rye') || good.includes('barley');
      }) ||
        exportsLower.some(function (exp) {
          return exp.includes('grain') || exp.includes('cereal');
        })) &&
      !hasIncomeSource('grain') &&
      !hasIncomeSource('agricultural')
    ) {
      incomeBuild.push({
        source: 'Grain Sales',
        percentage: Math.max(6, Math.round(ecoInstFlags.economyOutput / 9)),
        desc: hasNearbyResource('grain_field', 'fertile_flood')
          ? 'Surplus from local harvest sold to nearby settlements and passing merchants — steady income tied to the growing season.'
          : 'Grain purchased from farming regions and resold or processed locally; margin depends on stable supply routes.',
      });
    }
    if (
      (localProdLower.some(function (good) {
        return good.includes('wool') || good.includes('fleece') || good.includes('cloth') || good.includes('textile');
      }) ||
        exportsLower.some(function (exp) {
          return exp.includes('wool') || exp.includes('textile') || exp.includes('cloth');
        })) &&
      (hasInstNamed('weav') || hasInstNamed('fuller') || hasInstNamed('cloth')) &&
      !hasIncomeSource('wool') &&
      !hasIncomeSource('textile')
    ) {
      incomeBuild.push({
        source: 'Wool & Textile Trade',
        percentage: Math.max(8, Math.round(ecoInstFlags.economyOutput / 7)),
        desc: hasNearbyResource('grazing_land')
          ? 'Local flocks provide raw wool; weavers and fullers convert it to cloth sold across the region.'
          : 'Wool bought from pastoral regions and processed locally — value-add trade dependent on consistent supply.',
      });
    }
    if (
      (hasNearbyResource('iron_deposit', 'coal_deposit', 'precious_metal') ||
        ((localProdLower.some(function (good) {
          return good.includes('iron') || good.includes('ore');
        }) ||
          exportsLower.some(function (exp) {
            return exp.includes('iron') || exp.includes('ore');
          })) &&
          hasInstNamed('smith'))) &&
      !hasIncomeSource('iron') &&
      !hasIncomeSource('metal')
    ) {
      incomeBuild.push({
        source: 'Iron & Metalwork',
        percentage: Math.max(8, Math.round(ecoInstFlags.economyOutput / 7)),
        desc: hasNearbyResource('iron_deposit', 'coal_deposit', 'precious_metal')
          ? 'Local ore feeds the smithy directly — metalwork income is not trade-route dependent.'
          : 'Iron imported from mining regions and worked locally; this income stream is vulnerable to supply disruption.',
      });
    }
    if (
      hasNearbyResource('managed_forest', 'forest_access', 'timber_rights') &&
      !hasIncomeSource('timber') &&
      !hasIncomeSource('lumber')
    ) {
      incomeBuild.push({
        source: 'Timber Trade',
        percentage: Math.max(7, Math.round(ecoInstFlags.economyOutput / 8)),
        desc: hasNearbyResource('managed_forest', 'shipbuilding_timber', 'hunting_ground')
          ? 'Local forest provides sustainable timber revenue; managed felling and sawmilling keep production consistent.'
          : 'Timber sourced from more distant forests and resold or processed locally — trade route dependent.',
      });
    }
    if (
      (localProdLower.some(function (good) {
        return good.includes('fish') || good.includes('herring') || good.includes('cod') || good.includes('salt');
      }) ||
        exportsLower.some(function (exp) {
          return exp.includes('fish') || exp.includes('herring');
        })) &&
      !hasIncomeSource('fish') &&
      !hasIncomeSource('maritime')
    ) {
      incomeBuild.push({
        source: 'Fish & Maritime Produce',
        percentage: Math.max(8, Math.round(ecoInstFlags.economyOutput / 8)),
        desc: 'Catch landed and sold fresh or preserved; salt fish are a major regional export commodity.',
      });
    }
    if (
      (localProdLower.some(function (good) {
        return good.includes('stone') || good.includes('granite') || good.includes('marble') || good.includes('limestone');
      }) ||
        exportsLower.some(function (exp) {
          return exp.includes('stone') || exp.includes('quarry');
        })) &&
      !hasIncomeSource('stone') &&
      !hasIncomeSource('quarry')
    ) {
      incomeBuild.push({
        source: 'Stone Quarrying',
        percentage: Math.max(6, Math.round(ecoInstFlags.economyOutput / 10)),
        desc: hasNearbyResource('stone_quarry', 'gemstone')
          ? 'Local quarry provides dressed stone to regional builders — reliable income with low transport overhead.'
          : 'Stone masons work imported material; the quarrying income notation reflects processing margin only.',
      });
    }
    // Custom goods the caller has force-toggled on — one income line each.
    if (goodsToggles && Object.keys(goodsToggles).length > 0) {
      const goodTogglePattern = /_good_(.+)$/;
      Object.entries(goodsToggles).forEach(function (entry) {
        const match = entry[0].match(goodTogglePattern);
        if (!match || !entry[1].force) return;
        const goodName = match[1];
        if (
          !hasIncomeSource(goodName) &&
          !incomeBuild.some(function (existing) {
            return (existing.source || '').toLowerCase().includes(goodName.toLowerCase());
          })
        ) {
          incomeBuild.push({
            source: goodName + ' Trade',
            percentage: Math.max(5, Math.round(ecoInstFlags.economyOutput / 12)),
            desc:
              'Revenue from locally produced ' + goodName.toLowerCase() + ' sold to merchants and neighboring settlements.',
          });
        }
      });
    }
  } // ── Stage 3: Income normalization ───────────────────────────────────────────
  const incomeMultiplier = priorityToMultiplier(ecoInstFlags.economyOutput);
  const incomeWeighted = incomeBuild.map((entry) => ({ ...entry, weight: entry.percentage * incomeMultiplier }));
  const incomeTotalWeight = incomeWeighted.reduce((sum, entry) => sum + entry.weight, 0) || 1;
  const incomeNormalized = incomeWeighted.map((entry) => ({
    ...entry,
    percentage: Math.round((entry.weight / incomeTotalWeight) * 100),
    priorityNote: null,
  }));
  // (legacy alias block removed)
  const percentageSum = incomeNormalized.reduce((sum, entry) => sum + entry.percentage, 0);
  if (incomeNormalized.length > 0 && percentageSum !== 100) {
    const largestIdx = incomeNormalized.reduce(
      (bestIdx, entry, idx) => (entry.percentage > incomeNormalized[bestIdx].percentage ? idx : bestIdx),
      0
    );
    incomeNormalized[largestIdx].percentage += 100 - percentageSum;
  }
  const stressTypes = config.stressTypes || [];
  let necessityImports = [...(tradeStreams.necessityImports || [])];
  if (stressTypes.includes('under_siege') || stressTypes.includes('famine')) {
    if (!necessityImports.includes('Grain')) necessityImports.push('Grain');
    if (!necessityImports.includes('Salt')) necessityImports.push('Salt');
  }
  if (stressTypes.includes('under_siege') && !necessityImports.includes('Iron')) {
    necessityImports.push('Iron (weapons)');
  }
  if (stressTypes.includes('plague_onset') && !necessityImports.includes('Medicinal herbs')) {
    necessityImports.push('Medicinal herbs');
  }
  const primaryExports = stressTypes.includes('under_siege')
      ? config.tradeRouteAccess === 'port'
        ? tradeStreams.exports.slice(0, 3).map((exp) => `${exp} (naval route only)`)
        : []
      : stressTypes.includes('occupied')
        ? tradeStreams.exports.slice(0, 5).map((exp) => `${exp} (taxed by occupation)`)
        : [
            ...(['crossroads', 'port', 'river'].includes(tradeRoute)
              ? (tradeStreams.transit || []).map((item) => `${item} (transit)`)
              : []),
          ],
    topImports = tradeStreams.imports.slice(0, 8),
    primaryImports = [
      ...necessityImports
        .map((imp) => imp)
        .filter((imp) => !topImports.some((existing) => existing.toLowerCase().includes(imp.toLowerCase()))),
      ...topImports,
    ].slice(0, 10);
  const isEntrepot = tradeStreams.isEntrepot;
  const transit = tradeStreams.transit;
  if (goodsToggles && Object.keys(goodsToggles).length > 0) {
    const goodTogglePattern = /_good_(.+)$/;
    Object.entries(goodsToggles).forEach(function (entry) {
      const key = entry[0],
        toggle = entry[1],
        match = key.match(goodTogglePattern);
      if (!match) return;
      const goodName = match[1];
      if (toggle.force) {
        if (!primaryExports.some((item) => item.toLowerCase().includes(goodName.toLowerCase()))) {
          primaryExports.push(goodName);
        }
        if (
          tradeStreams.localProduction &&
          !tradeStreams.localProduction.some((item) => item.toLowerCase().includes(goodName.toLowerCase()))
        ) {
          tradeStreams.localProduction.push(goodName);
        }
      } else if (toggle.allow === false) {
        for (let i = primaryExports.length - 1; i >= 0; i--) {
          if (primaryExports[i].toLowerCase().includes(goodName.toLowerCase())) primaryExports.splice(i, 1);
        }
        if (tradeStreams.localProduction) {
          for (let i = tradeStreams.localProduction.length - 1; i >= 0; i--) {
            if (tradeStreams.localProduction[i].toLowerCase().includes(goodName.toLowerCase())) {
              tradeStreams.localProduction.splice(i, 1);
            }
          }
        }
      }
    });
  }
  const tradeDependencies = [];
  {
    const tierIndex = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].indexOf(tier),
      instNamesLower = (institutions || []).map(function (inst) {
        return (inst.name || '').toLowerCase();
      }),
      hasInstKeyword = function (keyword) {
        return instNamesLower.some(function (name) {
          return name.includes(keyword);
        });
      },
      stressList = config.stressTypes || [],
      militaryEff = ecoInstFlags.militaryEffective || 0,
      criminalEff = ecoInstFlags.criminalEffective || 0,
      economyOut = ecoInstFlags.economyOutput || 0;
    // Military services export — village+ with a real armed institution
    if (
      tierIndex >= 2 &&
      militaryEff >= 60 &&
      (hasInstKeyword('mercenary') || hasInstKeyword('garrison') || hasInstKeyword('barracks') || hasInstKeyword('professional guard'))
    ) {
      const militaryExport =
        militaryEff >= 80
          ? 'Military services — standing army leasing, siege engineering, garrison contracts'
          : hasInstKeyword('mercenary')
            ? 'Mercenary services — trained companies available for hire'
            : 'Military services — garrison contracts and armed escort';
      if (
        !primaryExports.some(function (exp) {
          return exp.toLowerCase().includes('military') || exp.toLowerCase().includes('mercenary');
        })
      ) {
        primaryExports.push(militaryExport);
      }
    }
    // Slave trade — probabilistic at town+ scale; the _rng() draw is load-bearing
    const slaveBaseChance = tierIndex >= 4 ? 0.3 : tierIndex === 3 ? 0.1 : 0;
    if (
      slaveBaseChance > 0 &&
      !primaryExports.some(function (exp) {
        return exp.toLowerCase().includes('slave');
      })
    ) {
      const slaveBonusChance = (criminalEff > 55 ? 0.15 : 0) + (stressList.includes('occupied') ? 0.1 : 0),
        slaveChance = Math.min(slaveBaseChance + slaveBonusChance, 0.55);
      if (_rng() < slaveChance) {
        const isSlaveMarket = economyOut > 55 && hasInstKeyword('market'),
          isCaptiveSource = stressList.includes('occupied') || criminalEff > 65,
          slaveTradeLabel =
            isSlaveMarket && isCaptiveSource
              ? 'Slave trade — transit market for human trafficking; imported labour and exported captives'
              : isSlaveMarket
                ? 'Slave labour — purchased workforce for agricultural estates, mines, and domestic service'
                : isCaptiveSource
                  ? 'Captive trade — war captives and debtors sold through established trafficking networks'
                  : 'Slave trade — human trafficking and forced labour; legally tolerated or actively regulated';
        primaryExports.push(slaveTradeLabel);
        if (
          isSlaveMarket &&
          !primaryImports.some(function (imp) {
            return imp.toLowerCase().includes('slave');
          })
        ) {
          primaryImports.push('Enslaved labour — purchased from regional trafficking networks');
        }
      }
    }
  }
  const nearbyResourcesArr = config.nearbyResources || [];
  const hasResource = (resourceKeys) => nearbyResourcesArr.some((res) => resourceKeys.some((key) => res.includes(key)));
  const stressArr = config.stressTypes || [];
  const intendedStressArr = config.intendedStressTypes || [];
  const isUnderStress =
    stressArr.includes('under_siege') ||
    intendedStressArr.includes('under_siege') ||
    (institutions || []).some(function (inst) {
      const name = (inst.name || '').toLowerCase();
      return name.includes('war council') || name.includes('siege') || name.includes('rationing');
    });
  const isIsolatedRoute = tradeRoute === 'isolated';
  // Teleportation infrastructure counts as trade access — don't treat as stockpile-only
  const _hasMagicTradeForDeps = hasTeleportationInfra(institutions || [], config);
  const isEffectivelyIsolated = isIsolatedRoute && !_hasMagicTradeForDeps;
  (institutions || []).forEach(function (inst) {
    const instName = inst.name || '',
      need = TRADE_DEPENDENCY_NEEDS[instName];
    if (
      !need ||
      hasResource(need.resources) ||
      tradeDependencies.some(function (dep) {
        return dep.institution === instName && dep.resource === need.label;
      })
    )
      return;
    const severity = isUnderStress || isEffectivelyIsolated ? 'critical' : 'vulnerable',
      impact = isUnderStress
        ? 'Supply route severed — operating at minimal capacity or shut down.'
        : isEffectivelyIsolated
          ? 'No trade access — running on existing stockpiles only.'
          : _hasMagicTradeForDeps && isIsolatedRoute
            ? 'Supplied via magical trade infrastructure — teleportation imports replace road access.'
            : 'Dependent on trade routes. Siege, road closure, or blockade would impair operations.';
    tradeDependencies.push({
      institution: instName,
      category: inst.category || '',
      resource: need.label,
      detail: need.detail,
      severity: severity,
      impact: impact,
      affectedServices: need.svcs || [],
    });
  }); // ── Stage 4: Chain derivation — compute before return object ─────────────────
  const depletedResources = config.nearbyResourcesDepleted || [];
  const activeChainsList = computeActiveChains(
    institutions || [],
    config.nearbyResources || [],
    tier,
    tradeRoute,
    tradeDependencies,
    depletedResources,
    // Effective magic dial: a dead-magic world is 0 regardless of the slider
    // (mirrors magicLedger) — gates druid/divine/arcane/alchemy substitution.
    config.magicExists === false ? 0 : (config.priorityMagic ?? 50)
  );
  const chainStresses = (config.stressTypes || []).concat(config.intendedStressTypes || []);
  const chainExports = deriveExportsFromChains(
    activeChainsList,
    config.nearbyResources || [],
    tier,
    tradeRoute,
    chainStresses,
    goodsToggles,
    depletedResources,
    institutions || []
  );
  const _hasMagicTrade = hasTeleportationInfra(institutions || [], config);
  const chainImports = deriveImportsFromChains(
    activeChainsList,
    config.nearbyResources || [],
    tier,
    tradeRoute,
    necessityImports,
    _hasMagicTrade
  );
  const chainLocalProd = deriveLocalProductionFromChains(activeChainsList, config.nearbyResources || []);
  const instServices = deriveInstitutionalServices(institutions || []);
  const serviceExports = deriveServiceExports(instServices);

  // Depleted resources at town+ scale: settlement needs to import what it can no longer
  // produce in sufficient quantity — local exhaustion triggers trade dependency
  const TIER_DEPLETED_IMPORT_THRESHOLD = ['town', 'city', 'metropolis'];
  if (depletedResources.length > 0 && TIER_DEPLETED_IMPORT_THRESHOLD.includes(tier)) {
    const DEPLETED_IMPORT_MAP = {
      grain_fields: 'Bulk grain (local fields depleted)',
      iron_deposits: 'Iron ore (local mines exhausted)',
      managed_forest: 'Timber (local forests cleared)',
      grazing_land: 'Livestock and dairy (pastures depleted)',
      river_fish: 'Salted fish (local waters over-fished)',
      fishing_grounds: 'Salted fish (fishing grounds exhausted)',
      coal_deposits: 'Coal and fuel (local seams exhausted)',
      stone_quarry: 'Dressed stone (local quarry depleted)',
      clay_pits: 'Clay and ceramics materials (pits exhausted)',
    };
    depletedResources.forEach((res) => {
      const importLabel = DEPLETED_IMPORT_MAP[res];
      if (importLabel) chainImports.push(importLabel);
    });
  }

  // ── Finished goods demand-gap imports/exports ─────────────────────────────
  // Computes supply/demand gaps for finished goods (arms, ritual supplies, etc.)
  // and pushes results into chainImports / chainExports before final assembly.
  computeFinishedGoodsDemand(tier, tradeRoute, institutions, config.nearbyResources || [], chainExports, chainImports);

  // Override heuristic arrays with chain-derived values (clean mutation — before return)
  primaryExports.length = 0;
  chainExports.forEach((exp) => primaryExports.push(exp));
  serviceExports.forEach((exp) => {
    if (!primaryExports.includes(exp)) primaryExports.push(exp);
  });
  primaryImports.length = 0;
  chainImports.forEach((imp) => primaryImports.push(imp));

  // ── Isolated thorp/hamlet: subsistence economy — no imports or exports ────
  // These settlements have no trade route and cannot participate in external trade.
  // Their economy is purely self-contained subsistence. Clear all trade goods.
  const _isSubsistenceIsolated = ['thorp', 'hamlet'].includes(tier) && tradeRoute === 'isolated';
  if (_isSubsistenceIsolated) {
    primaryExports.length = 0; // no exports
    primaryImports.length = 0; // no imports
    // Also clear active chains that require trade — keep only subsistence-relevant ones
    activeChainsList.forEach((ch, _idx) => {
      // Keep food security chains, remove trade/manufacturing/entrepot chains
      if (ch.entrepot || ch.needKey === 'trade_entrepot') {
        ch.status = 'unexploited';
      }
    });
  }
  if (tradeStreams.localProduction) {
    tradeStreams.localProduction.length = 0;
    chainLocalProd.forEach((prod) => tradeStreams.localProduction.push(prod));
  }
  const activeChains = activeChainsList;

  // ── Neighbour economic bias post-processing ──────────────────────────────
  // Apply competition/complementarity effects based on relationship type.
  // 'compete' mode: boost chance of same exports as neighbour (we fight for same market)
  // 'complement' mode: de-emphasise goods the neighbour already exports (we specialize elsewhere)
  // 'suppress' mode: hostile trade embargo reduces export variety
  // 'dependent' mode: prioritize goods the neighbour needs (patron/client)
  const _econBias = config._neighbourEconBias || {};
  const _econMode = config._neighbourEconMode || 'independent';
  if (Object.keys(_econBias).length > 0 && !_isSubsistenceIsolated) {
    // Apply weights: filter or reorder exports based on bias
    if (_econMode === 'suppress') {
      // Hostile: cap exports to a max of 4 items (trade embargo simulation)
      if (primaryExports.length > 4) primaryExports.splice(4);
    } else if (_econMode === 'complement') {
      // Trade partner/allied: remove exports that compete with neighbour's exports
      const biasKeys = Object.keys(_econBias);
      for (let _bi = primaryExports.length - 1; _bi >= 0; _bi--) {
        const good = primaryExports[_bi].toLowerCase();
        for (const bk of biasKeys) {
          if (_econBias[bk] < 0.8 && good.includes(bk.toLowerCase())) {
            primaryExports.splice(_bi, 1);
            break;
          }
        }
      }
    } else if (_econMode === 'compete') {
      // Rival/cold war: no removal — rivals compete in same space (handled at inst level)
    } else if (_econMode === 'dependent') {
      // Patron/client: ensure we export something the patron needs
      for (const [bk, weight] of Object.entries(_econBias)) {
        if (weight > 1.3 && !primaryExports.some((g) => g.toLowerCase().includes(bk.toLowerCase()))) {
          // Add patron-needed good if we don't already export it
          if (primaryExports.length < 8) primaryExports.push(bk.charAt(0).toUpperCase() + bk.slice(1));
        }
      }
    }
  }

  // ── Trade-goods subsumption ──────────────────────────────────────────────
  // Several label vocabularies feed re/q (chain outputs, tier structural
  // imports, necessity imports, depleted-resource labels, demand-gap labels)
  // and dedupe only on exact strings — so "Grain" and "Bulk grain and
  // foodstuffs" coexist. Collapse each list to one entry per canonical good,
  // then drop exports the settlement simultaneously imports (transit
  // re-exports excepted). Runs after every writer above; economyReconcilePass
  // re-applies it after later passes append imports (factionCorrelationPass's
  // applySubsumption is INSTITUTION subsumption, not this).
  const _subImports = subsumeTradeGoods(primaryImports);
  primaryImports.length = 0;
  _subImports.forEach((g) => primaryImports.push(g));
  const _subExports = reconcileTradeLists(subsumeTradeGoods(primaryExports), primaryImports);
  primaryExports.length = 0;
  _subExports.forEach((g) => primaryExports.push(g));
  if (tradeStreams.localProduction) {
    const _subLocal = subsumeTradeGoods(tradeStreams.localProduction);
    tradeStreams.localProduction.length = 0;
    _subLocal.forEach((g) => tradeStreams.localProduction.push(g));
  }

  // Sort income sources by percentage desc, then by CODEPOINT source order (NOT
  // localeCompare) — this list is persisted in the settlement, so the tiebreak
  // must resolve identically across devices/locales — must be LAST
  incomeNormalized.sort((a, b) => b.percentage - a.percentage || compareCodepoint(a.source, b.source));
  const { label: baseProsperity, foodSecurity: _foodSec } = computeBaseProsperity(
    tier,
    tradeRoute,
    institutions,
    config,
    instNames,
    incomeNormalized
  );
  return {
      tier: tier,
      prosperity: deriveProsperityLabel(baseProsperity, config, institutions),
      situationDesc: deriveEconomicSituationDesc(config, tier, institutions),
      incomeSources: incomeNormalized,
      primaryExports: primaryExports,
      primaryImports: primaryImports,
      transit: transit,
      isEntrepot: isEntrepot,
      localProduction: tradeStreams.localProduction,
      necessityImports: necessityImports,
      tradeAccess: tradeRoute,
      priorities: ecoPriorities,
      compound: ecoInstFlags,
      safetyProfile: safetyProfile,
      tradeDependencies: tradeDependencies,
      institutionalServices: instServices,
      activeChains: activeChains,
      foodSecurity: _foodSec,
      economicComplexity: deriveEconomicComplexity(
        tier,
        incomeNormalized.length,
        primaryExports.length,
        hasInst('market', 'trading', 'merchant', 'guild')
      ),
    };
};
