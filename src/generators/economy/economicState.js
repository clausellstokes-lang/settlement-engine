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
  // Parameter aliases (original minified names)

  var ne;
  const instNames = institutions.map((ee) => ee.name),
    hasInst = (...ee) => ee.some((E) => instNames.some((_) => _.toLowerCase().includes(E))),
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
  const f = tradeRoute === 'isolated';
  const C = f && hasTeleportationInfra(institutions, config);
  const T = f && !C;
  const M = C ? 0.4 : 1;
  // Subsistence gate: isolated thorp/hamlet/village produce for themselves only
  const SUBSISTENCE_TIERS_ECO = ['thorp', 'hamlet', 'village'];
  const isSubsistenceOnly = f && SUBSISTENCE_TIERS_ECO.includes(tier) && !C;
  if (
    (!T && hasInst('district market', 'multiple market')
      ? incomeBuild.push({
          source: C ? 'Magical Trade Revenue' : 'Market Taxes',
          percentage: Math.round(45 * M),
          desc: 'District-level duties on specialized goods; primary civic revenue at metropolis scale.',
        })
      : !T && hasInst('daily market')
        ? incomeBuild.push({
            source: C ? 'Magical Trade Revenue' : 'Market Taxes',
            percentage: Math.round(35 * M),
            desc: C
              ? 'Trade flowing through teleportation channels generates modest fees and arcane duties.'
              : 'Daily market tolls, stall fees, and weights-and-measures inspections.',
          })
        : !T &&
          hasInst('market square', 'weekly market', 'annual fair') &&
          incomeBuild.push({
            source: C ? 'Magical Trade Revenue' : 'Market Taxes',
            percentage: Math.round(22 * M),
            desc: C
              ? 'Magical trade conduits generate modest fees and arcane duties on transported goods.'
              : 'Market day stall fees and toll collection on goods entering the market.',
          }),
    !T && hasInst('craft guilds (100', 'merchant guilds (50')
      ? incomeBuild.push({
          source: 'Guild Licensing',
          percentage: 28,
          desc: 'Charter fees, quality inspection levies, and licensing of all trades and crafts.',
        })
      : !T &&
        hasInst('guild') &&
        incomeBuild.push({
          source: 'Guild Fees',
          percentage: 18,
          desc: 'Annual licensing fees and fines levied by guild oversight.',
        }),
    // Port Duties keys on port institutions the catalog actually generates:
    // 'Docks/port facilities', "Harbour master's office", 'Shipyard'.
    // 'docks/port' (not bare 'dock') so 'Airship docking' never reads as a
    // harbour; 'shipyard' must not match 'River boatyard'.
    hasInst('docks/port', 'harbour master', 'shipyard') && tradeRoute === 'port'
      ? incomeBuild.push({
          source: 'Port Duties',
          percentage: 35,
          desc: 'Import and export taxes, anchorage fees, and customs inspection on all cargo.',
        })
      : hasInst('docks/port', 'port facilit') &&
        tradeRoute === 'river' &&
        incomeBuild.push({
          source: 'River Tolls',
          percentage: 20,
          desc: 'Tolls on river traffic, dock fees, and ferry rights.',
        }),
    hasInst('banking district', 'stock exchange')
      ? incomeBuild.push({
          source: 'Financial Services',
          percentage: 22,
          desc: 'Civic taxes on banking operations, letters of credit, and financial transaction fees.',
        })
      : hasInst('banking house', 'money changer') &&
        incomeBuild.push({
          source: 'Banking Fees',
          percentage: 14,
          desc: 'Interest income, currency exchange commissions, and safe deposit charges.',
        }),
    getTradeRouteFeatures(tier))
  ) {
    const ee = tier === 'metropolis' ? 18 : tier === 'city' ? 14 : 10;
    incomeBuild.push({
      source: 'Property Rents',
      percentage: ee,
      desc: 'Ground rents on civic-owned buildings, stalls, and residential plots within the walls.',
    });
  }
  if (
    (hasInst('courthouse', 'multiple court', 'city hall') &&
      incomeBuild.push({
        source: 'Court Fees & Fines',
        percentage: 10,
        desc: 'Filing fees, fines levied on offenders, and fees for notarial and legal certification services.',
      }),
    !T && tradeRoute === 'crossroads'
      ? incomeBuild.push({
          source: 'Toll Revenue',
          percentage: 20,
          desc: 'Passage tolls on all roads and bridges serving the crossroads position.',
        })
      : !T &&
        tradeRoute === 'road' &&
        hasInst('gate', 'town wall', 'city wall') &&
        incomeBuild.push({
          source: 'Gate Tolls',
          percentage: 10,
          desc: 'Entry and exit tolls collected at the town gates from merchants and travellers.',
        }),
    hasInst('garrison', 'multiple garrison', 'professional guard') && ecoPriorities.military > 55)
  ) {
    const ee = ecoStressFlags.stateCrime
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
    incomeBuild.push(ee);
  }
  const A = institutions.some(function (ee) {
    var E = (ee.name || '').toLowerCase();
    return (
      (E.includes('parish church') ||
        E.includes('cathedral') ||
        E.includes('monastery') ||
        E.includes('friary') ||
        E.includes('temple') ||
        E.includes('graveyard')) &&
      !E.startsWith('access to')
    );
  });
  ecoInstFlags.religionInfluence > 55 &&
    A &&
    (ecoStressFlags.theocraticEconomy
      ? incomeBuild.push({
          source: 'Church Tithes & Rents',
          percentage: Math.round(ecoInstFlags.religionInfluence / 4),
          desc: 'Mandatory tithes plus rent income from church-owned land dominating the local economy.',
        })
      : incomeBuild.push({
          source: 'Church Tithes',
          percentage: Math.round(ecoInstFlags.religionInfluence / 5),
          desc: 'Tithes, offerings, and fees for burial and sacramental services collected by resident clergy.',
        }),
    ecoInstFlags.religionInfluence > 68 &&
      A &&
      (tradeRoute === 'crossroads' || tradeRoute === 'road') &&
      incomeBuild.push({
        source: 'Pilgrim Trade',
        percentage: Math.round(ecoInstFlags.religionInfluence / 9),
        desc: 'Offerings, hospitality fees, relic sales, and incidental commerce from visiting pilgrims.',
      })); // ── Three-tier magic economy ──────────────────────────────────────────────
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
  const v = generateTradeIncomeStreams(tier, institutions, tradeRoute, goodsToggles, { ...config });
  ((ne = v.incomeBonuses) == null || ne.forEach((ee) => incomeBuild.push(ee)),
    ecoStressFlags.merchantArmy &&
      incomeBuild.push({
        source: 'Security Contracts',
        percentage: 12,
        desc: 'Guild-funded private security surcharges — effectively a privatised protection tax on trade.',
      }),
    safetyProfile.blackMarketCapture > 10 &&
      (() => {
        // Unified criminal economy income — uses raw bmc as weight so normalized % matches Shadow Economy section
        const bmc = safetyProfile.blackMarketCapture;
        const crimInsts = safetyProfile.criminalInstitutions || [];
        const hasGuild = crimInsts.some(
          (i) => i.toLowerCase().includes('guild') || i.toLowerCase().includes('thieves')
        );
        const hasMarket = crimInsts.some(
          (i) => i.toLowerCase().includes('black market') || i.toLowerCase().includes('underground')
        );
        const hasSmuggling = crimInsts.some(
          (i) => i.toLowerCase().includes('smuggl') || i.toLowerCase().includes('front')
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
      })(),
    incomeBuild.length === 0 &&
      incomeBuild.push({
        source: 'Subsistence Production',
        percentage: 100,
        desc: 'Barter and in-kind exchange; no significant monetary income. Survival is the economy.',
      }));
  if (!isSubsistenceOnly) {
    // Resource trade income — only when trade routes exist
    const ee = (v.localProduction || []).map(function (K) {
        return (typeof K == 'string' ? K : K.name || '').toLowerCase();
      }),
      E = (v.exports || []).map(function (K) {
        return (typeof K == 'object' ? K.product || K.chain || '' : K || '').toLowerCase();
      }),
      _ = function (K) {
        return institutions.some(function (V) {
          return (V.name || '').toLowerCase().includes(K);
        });
      },
      O = function (K) {
        return incomeBuild.some(function (V) {
          return (V.source || '').toLowerCase().includes(K.toLowerCase());
        });
      },
      F = config.nearbyResources || [],
      X = function () {
        var K = [].slice.call(arguments);
        return F.some(function (V) {
          return K.some(function (de) {
            return V.includes(de);
          });
        });
      };
    if (
      ((ee.some(function (K) {
        return K.includes('grain') || K.includes('wheat') || K.includes('rye') || K.includes('barley');
      }) ||
        E.some(function (K) {
          return K.includes('grain') || K.includes('cereal');
        })) &&
        !O('grain') &&
        !O('agricultural') &&
        incomeBuild.push({
          source: 'Grain Sales',
          percentage: Math.max(6, Math.round(ecoInstFlags.economyOutput / 9)),
          desc: X('grain_field', 'fertile_flood')
            ? 'Surplus from local harvest sold to nearby settlements and passing merchants — steady income tied to the growing season.'
            : 'Grain purchased from farming regions and resold or processed locally; margin depends on stable supply routes.',
        }),
      (ee.some(function (K) {
        return K.includes('wool') || K.includes('fleece') || K.includes('cloth') || K.includes('textile');
      }) ||
        E.some(function (K) {
          return K.includes('wool') || K.includes('textile') || K.includes('cloth');
        })) &&
        (_('weav') || _('fuller') || _('cloth')) &&
        !O('wool') &&
        !O('textile') &&
        incomeBuild.push({
          source: 'Wool & Textile Trade',
          percentage: Math.max(8, Math.round(ecoInstFlags.economyOutput / 7)),
          desc: X('grazing_land')
            ? 'Local flocks provide raw wool; weavers and fullers convert it to cloth sold across the region.'
            : 'Wool bought from pastoral regions and processed locally — value-add trade dependent on consistent supply.',
        }),
      (X('iron_deposit', 'coal_deposit', 'precious_metal') ||
        ((ee.some(function (K) {
          return K.includes('iron') || K.includes('ore');
        }) ||
          E.some(function (K) {
            return K.includes('iron') || K.includes('ore');
          })) &&
          _('smith'))) &&
        !O('iron') &&
        !O('metal') &&
        incomeBuild.push({
          source: 'Iron & Metalwork',
          percentage: Math.max(8, Math.round(ecoInstFlags.economyOutput / 7)),
          desc: X('iron_deposit', 'coal_deposit', 'precious_metal')
            ? 'Local ore feeds the smithy directly — metalwork income is not trade-route dependent.'
            : 'Iron imported from mining regions and worked locally; this income stream is vulnerable to supply disruption.',
        }),
      X('managed_forest', 'forest_access', 'timber_rights') &&
        !O('timber') &&
        !O('lumber') &&
        incomeBuild.push({
          source: 'Timber Trade',
          percentage: Math.max(7, Math.round(ecoInstFlags.economyOutput / 8)),
          desc: X('managed_forest', 'shipbuilding_timber', 'hunting_ground')
            ? 'Local forest provides sustainable timber revenue; managed felling and sawmilling keep production consistent.'
            : 'Timber sourced from more distant forests and resold or processed locally — trade route dependent.',
        }),
      (ee.some(function (K) {
        return K.includes('fish') || K.includes('herring') || K.includes('cod') || K.includes('salt');
      }) ||
        E.some(function (K) {
          return K.includes('fish') || K.includes('herring');
        })) &&
        !O('fish') &&
        !O('maritime') &&
        incomeBuild.push({
          source: 'Fish & Maritime Produce',
          percentage: Math.max(8, Math.round(ecoInstFlags.economyOutput / 8)),
          desc: 'Catch landed and sold fresh or preserved; salt fish are a major regional export commodity.',
        }),
      (ee.some(function (K) {
        return K.includes('stone') || K.includes('granite') || K.includes('marble') || K.includes('limestone');
      }) ||
        E.some(function (K) {
          return K.includes('stone') || K.includes('quarry');
        })) &&
        !O('stone') &&
        !O('quarry') &&
        incomeBuild.push({
          source: 'Stone Quarrying',
          percentage: Math.max(6, Math.round(ecoInstFlags.economyOutput / 10)),
          desc: X('stone_quarry', 'gemstone')
            ? 'Local quarry provides dressed stone to regional builders — reliable income with low transport overhead.'
            : 'Stone masons work imported material; the quarrying income notation reflects processing margin only.',
        }),
      goodsToggles && Object.keys(goodsToggles).length > 0)
    ) {
      const K = /_good_(.+)$/;
      Object.entries(goodsToggles).forEach(function (V) {
        const de = V[0].match(K);
        if (!de || !V[1].force) return;
        const fe = de[1];
        !O(fe) &&
          !incomeBuild.some(function (ge) {
            return (ge.source || '').toLowerCase().includes(fe.toLowerCase());
          }) &&
          incomeBuild.push({
            source: fe + ' Trade',
            percentage: Math.max(5, Math.round(ecoInstFlags.economyOutput / 12)),
            desc:
              'Revenue from locally produced ' + fe.toLowerCase() + ' sold to merchants and neighboring settlements.',
          });
      });
    }
  } // ── Stage 3: Income normalization ───────────────────────────────────────────
  const incomeMultiplier = priorityToMultiplier(ecoInstFlags.economyOutput);
  const incomeWeighted = incomeBuild.map((ee) => ({ ...ee, weight: ee.percentage * incomeMultiplier }));
  const incomeTotalWeight = incomeWeighted.reduce((sum, e) => sum + e.weight, 0) || 1;
  const incomeNormalized = incomeWeighted.map((ee) => ({
    ...ee,
    percentage: Math.round((ee.weight / incomeTotalWeight) * 100),
    priorityNote: null,
  }));
  // (legacy alias block removed)
  const D = incomeNormalized.reduce((ee, E) => ee + E.percentage, 0);
  if (incomeNormalized.length > 0 && D !== 100) {
    const ee = incomeNormalized.reduce((E, _, O) => (_.percentage > incomeNormalized[E].percentage ? O : E), 0);
    incomeNormalized[ee].percentage += 100 - D;
  }
  const W = config.stressTypes || [];
  let U = [...(v.necessityImports || [])];
  ((W.includes('under_siege') || W.includes('famine')) &&
    (U.includes('Grain') || U.push('Grain'), U.includes('Salt') || U.push('Salt')),
    W.includes('under_siege') && (U.includes('Iron') || U.push('Iron (weapons)')),
    W.includes('plague_onset') && (U.includes('Medicinal herbs') || U.push('Medicinal herbs')));
  const re = W.includes('under_siege')
      ? config.tradeRouteAccess === 'port'
        ? v.exports.slice(0, 3).map((ee) => `${ee} (naval route only)`)
        : []
      : W.includes('occupied')
        ? v.exports.slice(0, 5).map((ee) => `${ee} (taxed by occupation)`)
        : [
            ...(['crossroads', 'port', 'river'].includes(tradeRoute)
              ? (v.transit || []).map((ee) => `${ee} (transit)`)
              : []),
          ],
    ie = v.imports.slice(0, 8),
    q = [...U.map((ee) => ee).filter((ee) => !ie.some((E) => E.toLowerCase().includes(ee.toLowerCase()))), ...ie].slice(
      0,
      10
    );
  const P = v.isEntrepot;
  const I = v.transit;
  if (goodsToggles && Object.keys(goodsToggles).length > 0) {
    const ee = /_good_(.+)$/;
    Object.entries(goodsToggles).forEach(function (E) {
      const _ = E[0],
        O = E[1],
        F = _.match(ee);
      if (!F) return;
      const X = F[1];
      if (O.force)
        (re.some(function (K) {
          return K.toLowerCase().includes(X.toLowerCase());
        }) || re.push(X),
          v.localProduction &&
            !v.localProduction.some(function (K) {
              return K.toLowerCase().includes(X.toLowerCase());
            }) &&
            v.localProduction.push(X));
      else if (O.allow === false) {
        for (let K = re.length - 1; K >= 0; K--) re[K].toLowerCase().includes(X.toLowerCase()) && re.splice(K, 1);
        if (v.localProduction)
          for (let K = v.localProduction.length - 1; K >= 0; K--)
            v.localProduction[K].toLowerCase().includes(X.toLowerCase()) && v.localProduction.splice(K, 1);
      }
    });
  }
  const H = [];
  {
    const E = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].indexOf(tier),
      _ = (institutions || []).map(function (fe) {
        return (fe.name || '').toLowerCase();
      }),
      O = function (fe) {
        return _.some(function (ge) {
          return ge.includes(fe);
        });
      },
      F = config.stressTypes || [],
      X = ecoInstFlags.militaryEffective || 0,
      K = ecoInstFlags.criminalEffective || 0,
      V = ecoInstFlags.economyOutput || 0;
    if (E >= 2 && X >= 60 && (O('mercenary') || O('garrison') || O('barracks') || O('professional guard'))) {
      const fe =
        X >= 80
          ? 'Military services — standing army leasing, siege engineering, garrison contracts'
          : O('mercenary')
            ? 'Mercenary services — trained companies available for hire'
            : 'Military services — garrison contracts and armed escort';
      re.some(function (ge) {
        return ge.toLowerCase().includes('military') || ge.toLowerCase().includes('mercenary');
      }) || re.push(fe);
    }
    const de = E >= 4 ? 0.3 : E === 3 ? 0.1 : 0;
    if (
      de > 0 &&
      !re.some(function (fe) {
        return fe.toLowerCase().includes('slave');
      })
    ) {
      const fe = (K > 55 ? 0.15 : 0) + (F.includes('occupied') ? 0.1 : 0),
        ge = Math.min(de + fe, 0.55);
      if (_rng() < ge) {
        const ke = V > 55 && O('market'),
          dt = F.includes('occupied') || K > 65,
          Gt =
            ke && dt
              ? 'Slave trade — transit market for human trafficking; imported labour and exported captives'
              : ke
                ? 'Slave labour — purchased workforce for agricultural estates, mines, and domestic service'
                : dt
                  ? 'Captive trade — war captives and debtors sold through established trafficking networks'
                  : 'Slave trade — human trafficking and forced labour; legally tolerated or actively regulated';
        (re.push(Gt),
          ke &&
            !q.some(function (Me) {
              return Me.toLowerCase().includes('slave');
            }) &&
            q.push('Enslaved labour — purchased from regional trafficking networks'));
      }
    }
  }
  const nearbyResourcesArr = config.nearbyResources || [];
  const hasResource = (V) => nearbyResourcesArr.some((de) => V.some((fe) => de.includes(fe)));
  const stressArr = config.stressTypes || [];
  const intendedStressArr = config.intendedStressTypes || [];
  const isUnderStress =
    stressArr.includes('under_siege') ||
    intendedStressArr.includes('under_siege') ||
    (institutions || []).some(function (V) {
      const de = (V.name || '').toLowerCase();
      return de.includes('war council') || de.includes('siege') || de.includes('rationing');
    });
  const isIsolatedRoute = tradeRoute === 'isolated';
  // Teleportation infrastructure counts as trade access — don't treat as stockpile-only
  const _hasMagicTradeForDeps = hasTeleportationInfra(institutions || [], config);
  const isEffectivelyIsolated = isIsolatedRoute && !_hasMagicTradeForDeps;
  (institutions || []).forEach(function (V) {
    const de = V.name || '',
      fe = TRADE_DEPENDENCY_NEEDS[de];
    if (
      !fe ||
      hasResource(fe.resources) ||
      H.some(function (dt) {
        return dt.institution === de && dt.resource === fe.label;
      })
    )
      return;
    const ge = isUnderStress || isEffectivelyIsolated ? 'critical' : 'vulnerable',
      ke = isUnderStress
        ? 'Supply route severed — operating at minimal capacity or shut down.'
        : isEffectivelyIsolated
          ? 'No trade access — running on existing stockpiles only.'
          : _hasMagicTradeForDeps && isIsolatedRoute
            ? 'Supplied via magical trade infrastructure — teleportation imports replace road access.'
            : 'Dependent on trade routes. Siege, road closure, or blockade would impair operations.';
    H.push({
      institution: de,
      category: V.category || '',
      resource: fe.label,
      detail: fe.detail,
      severity: ge,
      impact: ke,
      affectedServices: fe.svcs || [],
    });
  }); // ── Stage 4: Chain derivation — compute before return object ─────────────────
  const depletedResources = config.nearbyResourcesDepleted || [];
  const activeChainsList = computeActiveChains(
    institutions || [],
    config.nearbyResources || [],
    tier,
    tradeRoute,
    H,
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
    U,
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
  re.length = 0;
  chainExports.forEach((e) => re.push(e));
  serviceExports.forEach((e) => {
    if (!re.includes(e)) re.push(e);
  });
  q.length = 0;
  chainImports.forEach((i) => q.push(i));

  // ── Isolated thorp/hamlet: subsistence economy — no imports or exports ────
  // These settlements have no trade route and cannot participate in external trade.
  // Their economy is purely self-contained subsistence. Clear all trade goods.
  const _isSubsistenceIsolated = ['thorp', 'hamlet'].includes(tier) && tradeRoute === 'isolated';
  if (_isSubsistenceIsolated) {
    re.length = 0; // no exports
    q.length = 0; // no imports
    // Also clear active chains that require trade — keep only subsistence-relevant ones
    activeChainsList.forEach((ch, _idx) => {
      // Keep food security chains, remove trade/manufacturing/entrepot chains
      if (ch.entrepot || ch.needKey === 'trade_entrepot') {
        ch.status = 'unexploited';
      }
    });
  }
  if (v.localProduction) {
    v.localProduction.length = 0;
    chainLocalProd.forEach((p) => v.localProduction.push(p));
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
      if (re.length > 4) re.splice(4);
    } else if (_econMode === 'complement') {
      // Trade partner/allied: remove exports that compete with neighbour's exports
      const biasKeys = Object.keys(_econBias);
      for (let _bi = re.length - 1; _bi >= 0; _bi--) {
        const good = re[_bi].toLowerCase();
        for (const bk of biasKeys) {
          if (_econBias[bk] < 0.8 && good.includes(bk.toLowerCase())) {
            re.splice(_bi, 1);
            break;
          }
        }
      }
    } else if (_econMode === 'compete') {
      // Rival/cold war: no removal — rivals compete in same space (handled at inst level)
    } else if (_econMode === 'dependent') {
      // Patron/client: ensure we export something the patron needs
      for (const [bk, weight] of Object.entries(_econBias)) {
        if (weight > 1.3 && !re.some((g) => g.toLowerCase().includes(bk.toLowerCase()))) {
          // Add patron-needed good if we don't already export it
          if (re.length < 8) re.push(bk.charAt(0).toUpperCase() + bk.slice(1));
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
  const _subImports = subsumeTradeGoods(q);
  q.length = 0;
  _subImports.forEach((g) => q.push(g));
  const _subExports = reconcileTradeLists(subsumeTradeGoods(re), q);
  re.length = 0;
  _subExports.forEach((g) => re.push(g));
  if (v.localProduction) {
    const _subLocal = subsumeTradeGoods(v.localProduction);
    v.localProduction.length = 0;
    _subLocal.forEach((g) => v.localProduction.push(g));
  }

  // Sort income sources by percentage desc, then by CODEPOINT source order (NOT
  // localeCompare) — this list is persisted in the settlement, so the tiebreak
  // must resolve identically across devices/locales — must be LAST
  incomeNormalized.sort((a, b) => b.percentage - a.percentage || compareCodepoint(a.source, b.source));
  const { label: Z, foodSecurity: _foodSec } = computeBaseProsperity(
    tier,
    tradeRoute,
    institutions,
    config,
    instNames,
    incomeNormalized
  );
  return {
      tier: tier,
      prosperity: deriveProsperityLabel(Z, config, institutions),
      situationDesc: deriveEconomicSituationDesc(config, tier, institutions),
      incomeSources: incomeNormalized,
      primaryExports: re,
      primaryImports: q,
      transit: I,
      isEntrepot: P,
      localProduction: v.localProduction,
      necessityImports: U,
      tradeAccess: tradeRoute,
      priorities: ecoPriorities,
      compound: ecoInstFlags,
      safetyProfile: safetyProfile,
      tradeDependencies: H,
      institutionalServices: instServices,
      activeChains: activeChains,
      foodSecurity: _foodSec,
      economicComplexity: deriveEconomicComplexity(
        tier,
        incomeNormalized.length,
        re.length,
        hasInst('market', 'trading', 'merchant', 'guild')
      ),
    };
};
