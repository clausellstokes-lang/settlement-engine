// computeActiveChains.js
// Derives which supply chains are running in a settlement based on
// actual institutions present and nearby resources selected.
// Used by the economic generator to enrich the Economics tab output.

import {SUPPLY_CHAIN_NEEDS, RESOURCE_TO_CHAINS} from '../data/supplyChainData.js';
import {TIER_ORDER} from '../data/constants.js';
import {applyMagicSubstitution} from './chainMagicSubstitution.js';
import {RESOURCE_DATA} from '../data/resourceData.js';

// Map resource labels → RESOURCE_DATA keys for matching
// Uses fuzzy word overlap: 'Grain fields' matches 'grain_fields' key via shared words
function resourceLabelToKey(label) {
  if (!label) return null;
  const words = label.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  let bestKey = null, bestScore = 0;
  Object.keys(RESOURCE_DATA).forEach(key => {
    const keyWords = key.toLowerCase().split('_');
    const score = words.filter(w => keyWords.some(kw => kw.startsWith(w) || w.startsWith(kw))).length;
    if (score > bestScore) { bestScore = score; bestKey = key; }
  });
  return bestScore > 0 ? bestKey : null;
}

/**
 * Given a settlement's institutions, nearby resources, and trade route,
 * return an array of active production chains with enriched context.
 *
 * @param {Array} institutions  - settlement.institutions array
 * @param {Array} resources     - config.nearbyResources array of resource keys (e.g. ['grain_fields'])
 * @param {string} tier         - settlement tier
 * @param {string} tradeRoute   - trade route key
 * @returns {Array} activeChains
 */
// Income source labels → chain IDs for linkage display
const INCOME_TO_CHAINS = {
  'Grain Sales':          ['food_security.grain', 'manufacturing.food_processing'],
  'Wool & Textile Trade': ['manufacturing.textiles'],
  'Iron & Metalwork':     ['manufacturing.weapons_armor', 'raw_extraction.iron'],
  'Timber Trade':         ['raw_extraction.timber'],
  'Fish Trade':           ['food_security.fish'],
  'Entrepôt Trade':       ['trade_entrepot.spices_dyes', 'trade_entrepot.silk_luxury_textiles', 'trade_entrepot.furs_north', 'trade_entrepot.wine_spirits'],
  'Banking Fees':         ['trade_entrepot.transit_finance'],
  'Toll Revenue':         ['trade_entrepot.warehouse_logistics'],
  'Market Taxes':         ['food_security.grain', 'manufacturing.food_processing', 'manufacturing.textiles'],
  'Guild Fees':           ['manufacturing.weapons_armor', 'manufacturing.textiles', 'manufacturing.leather'],
};

export function computeActiveChains(institutions = [], resources = [], tier = 'village', tradeRoute = 'road', tradeDependencies = [], depletedResources = [], magicPriority = 50) {
  const instNames = institutions.map(i => (i.name || '').toLowerCase());

  // Helper: does this settlement have an institution matching any of the names?
  const hasInst = (...patterns) => patterns.some(p =>
    instNames.some(n => n.includes(p.toLowerCase()))
  );

  // Active resource keys
  const activeResourceKeys   = new Set(resources);
  const depletedResourceKeys = new Set(depletedResources);

  // Internal helper — checks if a resource key is in the depleted set
  const isResourceDepleted = (key) => !!key && depletedResourceKeys.has(key);

  // Tradition detection — which magical traditions are present?
  // instNames already declared above
  const hasTradition = (...kws) => instNames.some(n => kws.some(kw => n.includes(kw)));

  const traditions = {
    druid:   magicPriority >= 30 && hasTradition("druid circle","grove shrine","elder grove","warden's lodge","sacred grove"),
    divine:  hasTradition("cathedral","monastery","great cathedral","parish church","friary") &&
             // religionInfluence check not available here, use institution presence as proxy
             hasTradition("priest","cathedral","monastery","friary","great cathedral"),
    arcane:  magicPriority >= 35 && hasTradition("wizard","mages","arcane","enchant","spellcasting","academy of magic"),
    alchemy: magicPriority >= 15 && hasTradition("alchemist","apothecary district","alchemist quarter"),
  };
  // Depleted: resource is present but over-exploited — chains run locally but cannot 
  // Which resource keys activate which chains (reverse lookup)
  const chainActivatedByResource = new Set();
  activeResourceKeys.forEach(rk => {
    (RESOURCE_TO_CHAINS[rk] || []).forEach(c => chainActivatedByResource.add(c));
  });

  const activeChains = [];

  Object.entries(SUPPLY_CHAIN_NEEDS).forEach(([needKey, need]) => {
    need.chains.forEach(chain => {
      const chainId = `${needKey}.${chain.id}`;

      // Check tier gate
      const TIER_ORDER = ['thorp','hamlet','village','town','city','metropolis'];
      const tierIdx = TIER_ORDER.indexOf(tier);
      const minTierIdx = TIER_ORDER.indexOf(chain.minTier || 'thorp');
      if (tierIdx < minTierIdx) return;

      // No-magic gate: suppress arcane chains entirely at magic=0
      const ARCANE_CHAIN_IDS = ['alchemy','spellcasting','magical_goods','planar'];
      const isArcaneChain = ARCANE_CHAIN_IDS.includes(chain.id) ||
        (chain.label || '').toLowerCase().includes('arcane') ||
        (chain.label || '').toLowerCase().includes('magic') ||
        (chain.label || '').toLowerCase().includes('spell');
      if (isArcaneChain && magicPriority === 0) return;

      // Check institution presence — chain is active if settlement has ≥1 processor
      const matchedInsts = chain.processingInstitutions.filter(p =>
        instNames.some(n => n.includes(p.toLowerCase().slice(0, 12)))
      );
      if (matchedInsts.length === 0) return;

      // Check resource availability
      const resourceKey = resourceLabelToKey(chain.resource);
      const resourceActive = !chain.resource || activeResourceKeys.has(resourceKey);
      const resourceAvailable = !chain.resource; // chains without a resource requirement are always available

      // Entrepôt boost: crossroads/port settlements can run entrepôt chains
      // even without local resource, as long as they have the logistics institutions
      const isEntrepotRoute = ['crossroads', 'port', 'river'].includes(tradeRoute);

      // Substitution: if primary resource missing, check if a substitute covers the gap
      const substitutes = chain.resourceSubstitutes || [];
      const substituteActive = !resourceActive && substitutes.length > 0 && substitutes.some(sub => {
        const subKey = resourceLabelToKey(sub);
        return activeResourceKeys.has(subKey);
      });
      const runnableViaSubstitute = substituteActive;

      // Entrepôt-only chains (entrepot:true, resource:null) are pure transit goods —
      // they REQUIRE a trade hub route (crossroads/port/river). They do NOT fire on road/isolated.
      const isEntrepotOnly = chain.entrepot && !chain.resource;
      const runnable = isEntrepotOnly
        ? (isEntrepotRoute && matchedInsts.length > 0)
        : (resourceActive || resourceAvailable || substituteActive ||
           (chain.entrepot && isEntrepotRoute && matchedInsts.length > 0));

      if (!runnable) return;

      // External mill detection: if the settlement has "Access to external mill" but no
      // actual local mill institution, the grain chain functions (food security is real)
      // but surplus cannot be exported — the lord's mill toll captures any excess.
      // NOTE: can't use matchedInsts for this check because the fuzzy slice(0,12) match
      // causes "Mill" processingInstitution to match "access to external mill" in instNames.
      // Instead check actual institution names directly.
      const hasLocalMill = instNames.some(n =>
        (n === 'mill' || n.startsWith('mills (') || n === 'maltster' || n === 'sawmill')
      );
      const hasExternalMill = instNames.some(n => n.includes('access to external mill'));
      const externalMillOnly = hasExternalMill && !hasLocalMill;
      const effectiveExportable = externalMillOnly ? false : chain.exportable;
      const externalMillNote = externalMillOnly
        ? 'Grain is processed at the lord\'s mill under feudal monopoly (banalité). ' +
          'Local food security is maintained but surplus flour cannot be exported — ' +
          'the mill toll captures any excess. Loss of mill access would break this chain.'
        : null;

      activeChains.push({
        needKey,
        needLabel: need.label,
        needIcon: need.icon,
        needColor: need.color,
        chainId: chain.id,
        label: chain.label,
        upstreamChains: chain.upstreamChains || [],
        resourceIcon: chain.resourceIcon,
        resource: chain.resource,
        resourceActive: activeResourceKeys.has(resourceKey),
        processingInstitutions: matchedInsts,
        outputs: chain.outputs.slice(0, 4),
        services: chain.services,
        exportable: effectiveExportable,
        entrepot: chain.entrepot,
        entrepotNote: chain.entrepotNote || null,
        externalMillNote,
        activatedByResource: chainActivatedByResource.has(chainId),
        substituteActive: runnableViaSubstitute || false,
        resourceDepleted: isResourceDepleted(resourceLabelToKey(chain.resource)),
      });
    });
  });

  // Enrich each chain with dependency status by cross-referencing tradeDependencies
  if (tradeDependencies.length > 0) {
    activeChains.forEach(chain => {
      // Find matching trade dependency for any processing institution in this chain
      const dep = tradeDependencies.find(d =>
        chain.processingInstitutions.some(p =>
          d.institution.toLowerCase().includes(p.toLowerCase().slice(0, 10)) ||
          p.toLowerCase().includes(d.institution.toLowerCase().slice(0, 10))
        )
      );
      if (dep) {
        chain.dependency = {
          institution: dep.institution,
          resource: dep.resource,
          severity: dep.severity,
          impact: dep.impact,
          affectedServices: dep.affectedServices || [],
        };
        chain.status = dep.severity === 'critical' ? 'impaired'
          : dep.severity === 'high' ? 'vulnerable'
          : 'vulnerable';
      } else {
        chain.status = chain.substituteActive ? 'vulnerable'
          : chain.activatedByResource ? 'running'
          : chain.entrepot ? 'entrepot'
          : 'operational';
      }
    });
  } else {
    activeChains.forEach(chain => {
      chain.status = chain.substituteActive ? 'vulnerable'
        : chain.activatedByResource ? 'running'
        : chain.entrepot ? 'entrepot'
        : 'operational';
    });
  }

  // Sort: impaired first, then running (resource-activated), then entrepôt, then operational
  activeChains.sort((a, b) => {
    const rank = { impaired: 0, vulnerable: 1, running: 2, entrepot: 3, operational: 4 };
    const ra = rank[a.status] ?? 5, rb = rank[b.status] ?? 5;
    if (ra !== rb) return ra - rb;
    if (a.activatedByResource !== b.activatedByResource)
      return a.activatedByResource ? -1 : 1;
    return a.needLabel.localeCompare(b.needLabel);
  });

  // ── Inter-chain dependency cascade ─────────────────────────────────────────────
  // Upstream chain status propagates to downstream chains that depend on them.
  // brewing ← grain | smelting ← fuel | leather_goods ← livestock/hunting
  // textile_finishing ← textiles | ceramics_brick ← fuel | weapons_armor ← smelting
  const chainById = Object.fromEntries(activeChains.map(c => [c.chainId, c]));

  const CHAIN_DEPS = {
    brewing:          ['grain'],
    food_processing:  ['grain'],
    animal_husbandry: ['livestock','forage'],
    smelting:         ['fuel','timber'],
    weapons_armor:    ['iron','smelting'],
    ceramics_brick:   ['fuel','reed_marsh'],
    textile_finishing:['textiles'],
    leather_goods:    ['leather','livestock','hunting'],
    bowyer_fletcher:  ['timber'],
    shipbuilding:     ['timber'],
    beekeeping_wax:   ['forage'],
    precious_metals_mining: ['fuel'],
    caravan_trade:    ['animal_husbandry','grain'],
  };

  Object.entries(CHAIN_DEPS).forEach(([downstreamId, upstreamIds]) => {
    const downstream = chainById[downstreamId];
    if (!downstream) return;
    const impaired = upstreamIds.some(uid => {
      const up = chainById[uid];
      return up && (up.status === 'impaired' || up.resourceDepleted);
    });
    const vulnerable = !impaired && upstreamIds.some(uid => {
      const up = chainById[uid];
      return up && up.status === 'vulnerable';
    });
    if (impaired && downstream.status === 'running') {
      downstream.status = 'vulnerable';
      downstream.upstreamNote = `Upstream supply chain impaired — ${upstreamIds.join(' or ')} disrupted`;
    } else if (vulnerable && downstream.status === 'running') {
      // vulnerable upstream makes downstream slightly at risk — don't change status, just note
      downstream.upstreamNote = `Dependent on stressed upstream: ${upstreamIds.join(' or ')}`;
    }
  });

  // Magic substitution — delegated to chainMagicSubstitution.js
  applyMagicSubstitution(activeChains, traditions, magicPriority, tier);

  // ── Multi-order chain resolution ─────────────────────────────────────────────
  // For each active chain, check if its upstream dependencies are also active.
  // Missing upstream → chain is impaired (must import intermediate goods).
  // Impaired upstream → chain is vulnerable (inherits upstream weakness).
  // This runs after magic substitution so magic recovery already applied.

  const activeChainIds = new Set(activeChains.map(c => c.chainId));

  activeChains.forEach(chain => {
    const upstream = chain.upstreamChains || [];
    if (upstream.length === 0) return;

    const missingUpstream = upstream.filter(uid => !activeChainIds.has(uid));
    const impairedUpstream = upstream.filter(uid => {
      const up = activeChains.find(c => c.chainId === uid);
      return up && (up.status === 'impaired' || up.status === 'vulnerable');
    });

    if (missingUpstream.length > 0) {
      // Upstream chain not present → must import intermediate goods
      // Downgrade status unless already impaired/entrepot
      if (chain.status === 'running' || chain.status === 'operational') {
        chain.status = 'vulnerable';
        chain.upstreamNote = `Needs imported ${missingUpstream.join(', ')} — no local source`;
        chain.upstreamMissing = missingUpstream;
      }
    } else if (impairedUpstream.length > 0) {
      // Upstream is active but weak → inherit vulnerability
      if (chain.status === 'running' || chain.status === 'operational') {
        chain.status = 'vulnerable';
        chain.upstreamNote = `Upstream ${impairedUpstream.join(', ')} chain is impaired`;
        chain.upstreamWeak = impairedUpstream;
      }
    }
  });
  // ─────────────────────────────────────────────────────────────────────────────

  // Second pass: propagate vulnerability from impaired upstream to dependents
  // (needed because first pass may not process chains in dependency order)
  activeChains.forEach(chain => {
    const upstream = chain.upstreamChains || [];
    if (upstream.length === 0) return;
    if (chain.status === 'vulnerable' || chain.status === 'impaired') return; // already downgraded
    const impairedUpstream = upstream.filter(uid => {
      const up = activeChains.find(c => c.chainId === uid);
      return up && (up.status === 'impaired' || up.status === 'vulnerable');
    });
    if (impairedUpstream.length > 0) {
      chain.status = 'vulnerable';
      chain.upstreamNote = chain.upstreamNote ||
        `Upstream ${impairedUpstream.join(', ')} chain is impaired`;
      chain.upstreamWeak = impairedUpstream;
    }
  });

  return activeChains;
}

// ── Trade derivation from chains ──────────────────────────────────────────────
// These replace the heuristic export/import/localProduction computation in
// generateEconomicState with chain-first derivation.

/**
 * Derive primaryExports from active chains + nearby resource tradeGoods.
 * Three sources: raw resource outputs, chain processed outputs, entrepôt transit.
 */

// Institution gates for resource-derived trade goods.
// If a good appears here, it can only be exported if the settlement has
// an institution whose name includes the specified keyword.
// Goods NOT in this map are raw/extractable without processing.
const RESOURCE_GOOD_INST_GATES = {
  'shipbuilding_timber': { 'Milled lumber': 'sawmill' },
  'river_mills':         { 'Milled flour': 'mill', 'Processed grain': 'mill', 'Fulled cloth': 'fuller' },
  'river_clay':          { 'Fired brick': 'brickmaker', 'Pottery and ceramics': 'potter', 'Roof tiles': 'brickmaker' },
  'managed_forest':      { 'Milled timber': 'sawmill', 'Hardwood beams': 'carpenter', 'Charcoal': 'charcoal' },
  'foraging_areas':      { 'Alchemical reagents': 'alchemist' },
  'grain_fields':        { 'Milled flour': 'mill' },
  'grazing_land':        { 'Dairy products': 'dairy', 'Leather goods': 'tannery' },
  'iron_deposits':       { 'Basic metalwork': 'blacksmith', 'Weapons and armour': 'blacksmith' },
  'stone_quarry':        { 'Building materials': 'mason' },
  'precious_metals':     { 'Coin minting': 'mint', 'Jewellery': 'jewel' },
  'gemstone_deposits':   { 'Cut gemstones': 'jewel', 'Luxury goods': 'jewel' },
  'ancient_ruins':       { 'Rare texts': 'sage' },
  'magical_node':        { 'Arcane reagents': 'alchemist', 'Magical services': 'wizard' },
};

// Extraction gates for raw resource access.
// Even the raw form of a resource cannot be commercially exported unless the settlement
// has at least one institution capable of extracting it at a commercial scale.
// Surface-collectable resources (salt flats, foraging, hot springs) have no gate.
// Positional resources (crossroads, defended pass) have no gate.
const RESOURCE_EXTRACTION_GATES = {
  // Subterranean — require active mining/smithing to reach ore
  // At city+ scale: "multiple courthouses", "warehouse district" etc. don't mine.
  // Smelter, blacksmith, or any mine variant counts.
  'iron_deposits':      ['mine', 'smelter', 'blacksmith', 'forge'],
  'stone_quarry':       ['quarry', 'mason', 'stonemason', 'construction'],
  // coal_deposits: no extraction gate — resource desc explicitly 'Surface-accessible fuel'
  // Peat and surface coal seams are gathered like foraging, not mined.
  'precious_metals':    ['mine', 'smelter'],  // requires actual mining — jewellers buy refined metal, don't mine
  'gemstone_deposits':  ['mine'],                              // requires mining to extract gems from rock
  // Water — require organized fishing infrastructure at any tier.
  // Includes "fish market" (village), "fisher's landing" (hamlet), "fishmonger" (village),
  // "docks/port facilities" (town+), "harbour master's office" (city).
  'fishing_grounds':    ['fishmonger', 'dock', 'fishing', "fisher's", 'fishery', 'fish market', 'harbour', 'barge'],
  'river_fish':         ['fishmonger', "fisher's", 'fishing', 'dock', 'fish market', 'harbour', 'barge', 'ferry'],
  'river_mills':        ['mill'],  // the mill IS the extraction — without it, the mill site is unused
  'deep_harbour':       ['dock', 'port', 'harbour', 'shipyard'],
  // Timber — require organized harvesting at commercial scale
  'managed_forest':     ['sawmill', 'woodcutter', 'charcoal', 'carpenter', 'lumber'],
  'shipbuilding_timber':['sawmill', 'carpenter', 'shipyard'],
  // Hunting — require organized hunting or trapping operation
  'hunting_grounds':    ['hunter', 'wildfowl', 'warden', 'furrier'],
  // Desert terrain resources
  'camel_herds':        ['stable', 'caravanserai', 'market'],
  // Mountain timber — requires logging operation
  'mountain_timber':    ['sawmill', 'charcoal', 'carpenter', 'lumber'],
  // No gate: salt_flats, foraging_areas, ancient_grove, grain_fields, grazing_land,
  //          crossroads_position, defended_pass, ancient_ruins, hot_springs, magical_node,
  //          marshlands, fertile_floodplain, river_clay, oasis_water, date_palms,
  //          glass_sand, desert_salt, alpine_pasture, hot_springs_mineral
};

// Institution gates for chain-derived output goods.
// Even if a chain is active, some of its outputs are byproducts that require
// a specific additional institution to actually produce and export.
const CHAIN_OUTPUT_INST_GATES = {
  'Leather goods':          'tannery',
  'Leather armour':         'tannery',
  'Boots and shoes':        'tannery',
  'Saddles and harness':    'tannery',
  'Tanned leather':         'tannery',
  'Milled flour':           'mill',
  'Milled timber':          'sawmill',
  'Milled lumber':          'sawmill',
  'Fired brick':            'brickmaker',
  'Pottery and ceramics':   'potter',
  'Roof tiles':             'brickmaker',
  'Hardwood beams':         'carpenter',
  'Coin minting':           'mint',
  'Jewellery':              'jewel',
  'Cut gemstones':          'jewel',
  'Alchemical reagents':    'alchemist',
  'Basic metalwork':        'blacksmith',
  'Weapons and armour':     'blacksmith',
  'Building materials':     'mason',
  'Dairy products':         'dairy',
  'Fulled cloth':           'fuller',
  // Mining outputs — require active extraction, not just working purchased metal
  'Precious metals':        ['mine', 'smelter'],
  'Raw gemstones':          ['mine'],
  'Iron ore':               ['mine', 'smelter', 'blacksmith'],
  'Quarried stone':         ['quarry', 'mason', 'stonemason'],
  // Hunting outputs — require organized hunting or trapping
  'Game meat':              ['hunter', 'wildfowl', 'warden', 'furrier'],
  'Furs and pelts':         ['hunter', 'wildfowl', 'warden', 'furrier'],
  'Hunting trophies':       ['hunter', 'wildfowl', 'warden'],
  // Fish outputs — require organized fishing infrastructure
  'Salted fish':            ['fishmonger', "fisher's", 'fishing', 'dock', 'fish market', 'harbour', 'barge'],
  'Smoked seafood':         ['fishmonger', "fisher's", 'fishing', 'dock', 'fish market', 'harbour'],
  'River fish':             ['fishmonger', "fisher's", 'fishing', 'dock', 'fish market', 'harbour', 'barge', 'ferry'],
  'Freshwater catch':       ['fishmonger', "fisher's", 'fishing', 'dock', 'fish market', 'harbour', 'barge', 'ferry'],
};


export function deriveExportsFromChains(activeChains, nearbyResources, tier, route, stressTypes = [], goodsToggles = {}, depletedResources = [], institutions = []) {
  // Isolated low-tier settlements are subsistence only — nothing leaves, no trade route exists
  const SUBSISTENCE_TIERS = ['thorp', 'hamlet', 'village'];
  if (route === 'isolated' && SUBSISTENCE_TIERS.includes(tier)) {
    return []; // no exports — produce for local consumption only
  }

  const isSieged   = stressTypes.includes('under_siege');
  const isOccupied = stressTypes.includes('occupied');
  const exports    = new Set();

  const depletedKeys = new Set(depletedResources);
  const chainIsDepleted = (chain) =>
    chain.resourceDepleted || (chain.resource && depletedKeys.has(resourceLabelToKey(chain.resource)));

  // 1. Raw material exports from nearby resources (what the land provides directly)
  // Skip depleted resources — they're consumed locally, nothing available to export
  // For processed goods (e.g. "Weapons and armour" from iron_deposits), check that the
  // settlement has the required institution before adding to exports.
  // Use actual settlement institution names for gating processed exports.
  // This prevents "Access to external mill" from passing the 'mill' keyword check —
  // we match only the institution name as a whole, not substrings of longer names.
  const _settlementInstNames = institutions.map(i => (i.name || '').toLowerCase());
  const _hasInstForGate = (keyword) => {
    const kw = keyword.toLowerCase();
    // Special case: "mill" keyword should NOT match "access to external mill"
    // Only match institutions that ARE the processing unit, not access to one elsewhere
    if (kw === 'mill') {
      return _settlementInstNames.some(n =>
        (n === 'mill' || n.startsWith('mills (') || n === 'maltster' || n === 'sawmill') &&
        !n.includes('access to external')
      );
    }
    return _settlementInstNames.some(n => n.includes(kw));
  };

  nearbyResources.forEach(rk => {
    if (depletedKeys.has(rk)) return; // depleted: no surplus to export
    const rd = RESOURCE_DATA[rk];
    if (!rd?.tradeGoods) return;
    // Extraction gate: some resources require an institution to access at commercial scale.
    // Without a mine you can't export iron ore; without a sawmill/woodcutter you can't export timber.
    const extractionKws = RESOURCE_EXTRACTION_GATES[rk];
    if (extractionKws && !extractionKws.some(kw => _hasInstForGate(kw))) return;
    // Processing gate: finished goods within this resource require specific institutions.
    const gatesForResource = RESOURCE_GOOD_INST_GATES[rk] || {};
    rd.tradeGoods.forEach(g => {
      const requiredInst = gatesForResource[g];
      if (requiredInst && !_hasInstForGate(requiredInst)) return; // institution not present
      exports.add(g);
    });
  });

  // 2. Processed outputs from non-impaired, exportable chains
  // Skip chains whose primary resource is depleted (consumed locally, nothing left to export)
  // Also gate byproduct outputs that require a specific additional institution.
  activeChains
    .filter(ch => ch.exportable && ch.status !== 'impaired' && !chainIsDepleted(ch))
    .forEach(chain => chain.outputs.slice(0, 2).forEach(o => {
      const requiredInst = CHAIN_OUTPUT_INST_GATES[o];
      if (requiredInst) {
        const kws = Array.isArray(requiredInst) ? requiredInst : [requiredInst];
        if (!kws.some(kw => _hasInstForGate(kw))) return;
      }
      exports.add(o);
    }));

  // 3. Entrepôt transit goods — flagged distinctively
  activeChains
    .filter(c => c.entrepot && c.status !== 'impaired')
    .forEach(chain => chain.outputs.slice(0, 1).forEach(o => exports.add(`${o} (transit)`)));

  // Apply stress: siege collapses exports, occupation taxes them
  let list = [...exports];
  if (isSieged) {
    list = route === 'port'
      ? list.slice(0, 3).map(e => `${e} (naval route only)`)
      : [];
  } else if (isOccupied) {
    list = list.slice(0, 5).map(e => `${e} (taxed by occupation)`);
  }

  // Apply forced/excluded goods from DM toggles
  if (goodsToggles && Object.keys(goodsToggles).length > 0) {
    const rx = /_good_(.+)$/;
    Object.entries(goodsToggles).forEach(([key, val]) => {
      const m = key.match(rx);
      if (!m) return;
      const name = m[1];
      if (val.force && !list.some(e => e.toLowerCase().includes(name.toLowerCase()))) {
        list.push(name);
      } else if (val.allow === false) {
        list = list.filter(e => !e.toLowerCase().includes(name.toLowerCase()));
      }
    });
  }

  // Deduplicate (transit versions may duplicate raw versions)
  const seen = new Set();
  list = list.filter(e => {
    const base = e.replace(' (transit)', '').replace(' (naval route only)', '').replace(' (taxed by occupation)', '').toLowerCase();
    if (seen.has(base)) return false;
    seen.add(base);
    return true;
  });

  return list.slice(0, 12);
}

/**
 * Derive primaryImports from chain dependency gaps + tier-based necessities.
 * Imports = what chains need but the settlement doesn't have locally.
 */
export function deriveImportsFromChains(activeChains, nearbyResources, tier, route, necessityImports = [], hasMagicTrade = false) {
  // Isolated low-tier settlements have no trade route — nothing comes in
  const SUBSISTENCE_TIERS = ['thorp', 'hamlet', 'village'];
  if (route === 'isolated' && SUBSISTENCE_TIERS.includes(tier)) {
    return []; // no imports — self-sufficient or going without
  }

  const imports = new Set();

  // 1. Resources required by active chains not covered by nearby resources
  // Clean compound labels ("Iron + fuel") to the primary resource only
  activeChains.forEach(chain => {
    if (chain.dependency) {
      const raw = chain.dependency.resource || '';
      // Take only the first part if compound (e.g. "Iron + fuel" → "Iron")
      const clean = raw.split(/\s*[\+\/]\s*/)[0].trim();
      if (clean) imports.add(clean);
    }
  });

  // 2. Legacy necessity imports (things generator flagged as always-needed)
  necessityImports.forEach(i => imports.add(i));

  // 3. Upstream dependency imports — chains running without their upstream chain
  // These represent intermediate goods that must be imported to sustain the chain
  const UPSTREAM_IMPORT_LABELS = {
    'iron':              'Iron ore',
    'fuel':              'Charcoal and fuel',
    'grain':             'Grain and malt',
    'livestock':         'Raw hides and animal products',
    'textiles':          'Raw cloth',
    'clay':              'Clay and raw materials',
    'food_processing':   'Preserved provisions',
    'smelting':          'Refined iron and metalwork',
    'warehouse_logistics': 'Warehousing and logistics services',
    'cartography':       'Route maps and intelligence',
    'hunting':           'Raw furs and pelts',
    'precious_metals_mining': 'Precious metals and bullion',
    'stone':             'Cut stone and masonry',
  };
  activeChains.forEach(chain => {
    if (!chain.upstreamMissing || chain.upstreamMissing.length === 0) return;
    if (route === 'isolated' && !hasMagicTrade) return; // isolated can't import (unless magic trade)
    chain.upstreamMissing.forEach(missingId => {
      const label = UPSTREAM_IMPORT_LABELS[missingId];
      if (label) imports.add(label);
    });
  });

  // 4. Tier-based structural imports not yet covered
  if (['town','city','metropolis'].includes(tier)) {
    const hasGrain = nearbyResources.some(r => r.includes('grain') || r.includes('floodplain'));
    if (!hasGrain) imports.add('Bulk grain and foodstuffs');
  }
  if (['city','metropolis'].includes(tier)) {
    imports.add('Luxury textiles and exotic goods');
  }
  if (tier === 'metropolis') {
    imports.add('Bulk raw materials and agricultural goods');
  }

  // Remove anything already in exports (avoid import=export duplicates)
  // Also filter abstract/internal labels that aren't real tradeable goods
  const ABSTRACT_IMPORTS = new Set([
    'Magical ley lines', 'Trade access', 'Ley line access', 'Arcane energy',
    'Planar energy', 'Divine favor', 'Spiritual energy',
    'Trade access + grain', 'Trade access + commodities',
    'Trade access + harbour', 'Trade route access',
  ]);
  const importList = [...imports].filter(i => Boolean(i) && !ABSTRACT_IMPORTS.has(i));
  return importList.slice(0, 10);
}

/**
 * Derive localProduction from nearby resource commodities + locally-run chains.
 */
export function deriveLocalProductionFromChains(activeChains, nearbyResources) {
  const local = new Set();

  // 1. Terrain commodities — what the land intrinsically provides
  nearbyResources.forEach(rk => {
    const rd = RESOURCE_DATA[rk];
    if (rd?.commodities) rd.commodities.forEach(c => local.add(c.replace(/_/g, ' ')));
  });

  // 2. Outputs from chains activated by a local resource
  activeChains
    .filter(c => c.activatedByResource && c.status !== 'impaired')
    .forEach(chain => chain.outputs.slice(0, 2).forEach(o => local.add(o)));

  return [...local];
}

// ── Institutional Services ────────────────────────────────────────────────────
// Tertiary economy — services generated by institutions without a production chain.
// These contribute to exports and income sources independently of the chain system.

const INSTITUTIONAL_SERVICE_MAP = [
  // Banking & Finance
  { patterns:['banking house','banking district','money changer'],
    output:'Financial services', exportLabel:'Financial services (letters of credit)',
    incomeLabel:'Banking & Finance', exportable:true, icon:'', color:'#2a3a7a' },
  // Legal
  { patterns:['courthouse','multiple courthouse','court building'],
    output:'Legal services', exportLabel:'Legal services (contracts, notarial)',
    incomeLabel:'Legal Services', exportable:true, icon:'️', color:'#3a3a3a' },
  // Religious / Pilgrimage
  { patterns:['cathedral','major monaster','monastery','pilgrim'],
    output:'Religious services', exportLabel:'Pilgrimage & religious tourism',
    incomeLabel:'Religious Revenue', exportable:true, icon:'', color:'#5a3a1a' },
  // Education
  { patterns:['university','academy of magic','academy'],
    output:'Higher education', exportLabel:'Educational services (degrees, training)',
    incomeLabel:'Education & Scholarship', exportable:true, icon:'', color:'#1a3a7a' },
  // Military / Mercenary — requires substantial military infrastructure (city+)
  { patterns:['mercenary quarter','multiple garrison','professional city watch'],
    output:'Armed escort & mercenary hire', exportLabel:'Military contract services',
    incomeLabel:'Military Contracts', exportable:true, icon:'', color:'#8b1a1a' },
  // Arcane
  { patterns:['mages\' guild','mages district','academy of magic','spellcasting service'],
    output:'Arcane & spellcasting services', exportLabel:'Arcane services (identification, enchanting)',
    incomeLabel:'Arcane Services', exportable:true, icon:'', color:'#5a2a8a' },
  // Medical
  { patterns:['major hospital','hospital network','small hospital'],
    output:'Medical & surgical services', exportLabel:null,
    incomeLabel:'Medical Services', exportable:false, icon:'️', color:'#8b1a1a' },
  // Entertainment / Culture
  { patterns:['colosseum','arena','bardic college','opera house','multiple theater'],
    output:'Entertainment & cultural tourism', exportLabel:'Cultural tourism revenue',
    incomeLabel:'Entertainment & Culture', exportable:true, icon:'', color:'#7a3a1a' },
  // Port / Maritime
  { patterns:['docks/port','major port','navy'],
    output:'Port & maritime services', exportLabel:'Maritime services (cargo, pilotage)',
    incomeLabel:'Port Revenue', exportable:true, icon:'', color:'#1a4a6a' },
  // Library / Knowledge
  { patterns:['great library','sage'],
    output:'Research & scholarly services', exportLabel:'Scholarly services (research access, rare texts)',
    incomeLabel:'Scholarly Revenue', exportable:true, icon:'', color:'#2a4a2a' },
  // Alchemy
  { patterns:['alchemist quarter','alchemist shop'],
    output:'Alchemical products & services', exportLabel:'Alchemical trade (potions, reagents)',
    incomeLabel:'Alchemical Trade', exportable:true, icon:'️', color:'#5a2a8a' },
  // Planar
  { patterns:['planar trader','planar embassy'],
    output:'Extraplanar goods & services', exportLabel:'Planar trade access',
    incomeLabel:'Planar Commerce', exportable:true, icon:'', color:'#1a1a5a' },
];

/**
 * Derive institutional service entries from the settlement's actual institutions.
 * Returns entries suitable for Economic Flows display and income source contribution.
 * @param {Array} institutions  - settlement.institutions array
 * @returns {Array} serviceEntries
 */
export function deriveInstitutionalServices(institutions = []) {
  const instNames = institutions.map(i => (i.name || '').toLowerCase());
  const services = [];
  const usedLabels = new Set();

  INSTITUTIONAL_SERVICE_MAP.forEach(def => {
    const matched = instNames.filter(n => def.patterns.some(p => n.includes(p)));
    if (matched.length === 0) return;
    if (usedLabels.has(def.incomeLabel)) return;
    usedLabels.add(def.incomeLabel);

    services.push({
      type: 'institutional_service',
      label: def.incomeLabel,
      icon: def.icon,
      color: def.color,
      output: def.output,
      exportLabel: def.exportLabel,
      exportable: def.exportable,
      institutions: matched.slice(0, 2),
      status: 'operational', // services don't impair unless institution itself is gone
    });
  });

  return services;
}

/**
 * Derive service-economy exports from institutional services.
 * Only exports from institutions that can actually attract external demand.
 */
export function deriveServiceExports(institutionalServices) {
  return institutionalServices
    .filter(s => s.exportable && s.exportLabel)
    .map(s => s.exportLabel);
}
