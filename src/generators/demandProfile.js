// demandProfile.js — Item 17: Faction and culture driven demand
// Each faction category represents a consumer class with distinct import needs.
// Culture determines which specific goods satisfy those needs.
// Active supply chains suppress imports that are locally produced.

// ── Faction demand by category × culture ─────────────────────────────────────
// Each entry: [goods for this culture, demand weight 1-3]
// Weight drives how many goods appear: 1 = one good, 2 = up to two, 3 = up to three

const FACTION_DEMAND = {
  government: {
    // Nobles, councils, administrators — prestige display goods
    arabic:       [['Spices and rare aromatics', 'Fine silk and brocade', 'Carved ivory and ebony']],
    east_asian:   [['Fine porcelain and lacquerware', 'Silk and embroidered cloth', 'Exotic incense']],
    latin:        [['Fine wine and amphorae', 'Marble and ornamental stone', 'Luxury glassware']],
    germanic:     [['Master-crafted plate armour', 'Imported wine and spices', 'Fine furs and pelts']],
    norse:        [['Silver and hack-silver', 'Fine furs and walrus ivory', 'Imported wine and silk']],
    celtic:       [['Gold and silver torcs', 'Fine wine from southern trade', 'Rare dyes and pigments']],
    slavic:       [['Silver ornaments and coins', 'Imported silk', 'Fine furs from the north']],
    steppe:       [['Fine horses and tack', 'Silk from eastern routes', 'Gold and silver work']],
    south_asian:  [['Precious stones and gems', 'Fine cotton and muslin', 'Sandalwood and teak']],
    greek:        [['Fine wine and olive oil', 'Marble and bronze sculpture', 'Luxury ceramics']],
    mesoamerican: [['Quetzal feathers and jade', 'Fine cacao', 'Obsidian and turquoise work']],
  },
  economy: {
    // Merchants, craft guilds, rising middle class — quality goods and tools of trade
    arabic:       [['Dyed cloth and quality textiles', 'Tin and copper ingots', 'Paper and writing materials']],
    east_asian:   [['Quality paper and ink', 'Fine metalwork tools', 'Dyed and printed cloth']],
    latin:        [['Parchment and wax tablets', 'Quality wool cloth', 'Tin and lead']],
    germanic:     [['Quality iron tools and fittings', 'Fine cloth and dye', 'Barrel-staves and cooperage']],
    norse:        [['Rope and sailcloth', 'Quality iron fittings', 'Wax and tallow']],
    celtic:       [['Bronze fittings and tools', 'Quality wool cloth', 'Tin from western mines']],
    slavic:       [['Amber and beeswax', 'Quality iron tools', 'Flax and linen cloth']],
    steppe:       [['Felt and leather goods', 'Iron fittings and arrowheads', 'Dried and salted provisions']],
    south_asian:  [['Cotton cloth in bulk', 'Iron and steel tools', 'Sesame oil and ghee']],
    greek:        [['Amphora and storage vessels', 'Quality wool cloth', 'Lead and tin']],
    mesoamerican: [['Cacao in bulk', 'Cotton cloth', 'Rubber and copal resin']],
  },
  military: {
    // Guards, garrisons, mercenaries — weapons, provisions, equipment
    arabic:       [['Cavalry horses and tack', 'Laminar armour components', 'Salted provisions and hardtack']],
    east_asian:   [['Lacquered armour fittings', 'Bowstaves and horn', 'Rice and dried provisions']],
    latin:        [['Lorica segmentata fittings', 'Grain and salted pork', 'Cordage and leather']],
    germanic:     [['Mail and iron fittings', 'Salted beef and grain', 'Horses and warhorse stock']],
    norse:        [['Shield-boards and iron rims', 'Salted fish and hardtack', 'Bowstaves and arrows']],
    celtic:       [['Chariot fittings and iron', 'Grain and dried meat', 'Quality horses']],
    slavic:       [['Iron arrowheads and spearheads', 'Grain and salted fish', 'Horses from the steppe']],
    steppe:       [['Composite bow materials', 'Horses and remounts', 'Dried meat and kumiss']],
    south_asian:  [['War elephants and fodder', 'Steel and iron', 'Dried rice and provisions']],
    greek:        [['Bronze armour components', 'Grain and olive oil', 'Horses and cavalry gear']],
    mesoamerican: [['Obsidian for macuahuitl', 'Cotton armour padding', 'Dried provisions and cacao']],
  },
  religious: {
    // Clergy, temples, shrines — ritual goods, sacred materials
    arabic:       [['Incense and frankincense', 'Fine prayer rugs and cloth', 'Calligraphy tools and inks']],
    east_asian:   [['Incense and ritual paper', 'Fine lacquerwork for shrines', 'Bronze casting materials']],
    latin:        [['Incense and ritual oil', 'Fine linen for vestments', 'Lead for pipe organs']],
    germanic:     [['Carved wood and amber', 'Ritual drinking vessels', 'Imported wine for ceremony']],
    norse:        [['Mead and ritual ale ingredients', 'Silver for votive offerings', 'Carved bone and antler']],
    celtic:       [['Bronze for votive offerings', 'Mistletoe and sacred herbs', 'Fine gold wire']],
    slavic:       [['Beeswax candles', 'Imported icons and sacred metals', 'Incense from the east']],
    steppe:       [['Felt for yurt-shrines', 'Ritual fermented mare milk', 'Carved bone idols']],
    south_asian:  [['Sandalwood and camphor', 'Gold and silver leaf', 'Sacred river water vessels']],
    greek:        [['Fine pottery for libations', 'Olive oil for sacred lamps', 'Incense and myrrh']],
    mesoamerican: [['Copal resin incense', 'Jade and turquoise for ritual', 'Obsidian for sacrifice']],
  },
  magic: {
    // Arcane orders, hedge wizards, alchemists — exotic reagents and materials
    arabic:       [['Exotic minerals and salts', 'Rare earths and pigments', 'Manuscripts and star charts']],
    east_asian:   [['Cinnabar and mercury', 'Rare minerals and crystals', 'Medicinal herbs and fungi']],
    latin:        [['Sulfur and alum', 'Parchment and vellum', 'Rare metals and glass vessels']],
    germanic:     [['Rune-worthy bone and antler', 'Rare herbs and roots', 'Quicksilver and lead']],
    norse:        [['Seiðr herbs and mushrooms', 'Carved rune materials', 'Quicksilver from trade']],
    celtic:       [['Druidic herbs and oak bark', 'Silver wire for wards', 'Rare mistletoe and bark']],
    slavic:       [['Folklore herbs and mushrooms', 'Silver for protective charms', 'Beeswax for seals']],
    steppe:       [['Shamanic herbs and bones', 'Carved spirit-tokens', 'Exotic feathers and furs']],
    south_asian:  [['Ritual metals and gemstones', 'Rare spices as reagents', 'Medicinal plants and oils']],
    greek:        [['Sulfur and brimstone', 'Rare earths and pigments', 'Bronze and electrum vessels']],
    mesoamerican: [['Obsidian mirrors', 'Rare feathers for ritual', 'Copal and rubber for sealing']],
  },
  criminal: {
    // Thieves guilds, smugglers, black markets — contraband, easily fenced goods
    // Culture matters less here — what matters is route access and what can be resold
    // Use a single universal set, slightly flavored by culture
    arabic:       [['Undeclared luxury silk', 'Stolen spice shipments', 'Forged bills of trade']],
    east_asian:   [['Smuggled jade and gems', 'Opium and exotic narcotics', 'Forged imperial seals']],
    latin:        [['Stolen silver plate', 'Undeclared wine and oil', 'Forged land titles']],
    germanic:     [['Stolen mail and weapons', 'Undeclared furs and amber', 'Counterfeit coinage']],
    norse:        [['Stolen silver and hack-silver', 'Undeclared furs', 'Enslaved captives']],
    celtic:       [['Stolen bronze work', 'Undeclared cattle', 'Forged clan markers']],
    slavic:       [['Stolen furs and amber', 'Forged documents', 'Undeclared silver']],
    steppe:       [['Stolen horses', 'Undeclared slaves', 'Contraband silk and spice']],
    south_asian:  [['Stolen gems and spices', 'Opium and contraband', 'Forged merchant writs']],
    greek:        [['Stolen silver', 'Undeclared olive oil', 'Forged citizenship documents']],
    mesoamerican: [['Stolen jade and cacao', 'Contraband obsidian', 'Forged tribute records']],
  },
};

// ── Supply chain suppression ─────────────────────────────────────────────────
// If a chain is active (locally producing), suppress goods that chain produces.
// Keyed to partial-match strings against demand good labels.
const CHAIN_SUPPRESSES = {
  grain:           ['grain', 'hardtack', 'malt', 'flour'],
  food_processing: ['salted', 'provisions', 'dried meat', 'preserved', 'hardtack'],
  livestock:       ['cattle', 'horses', 'tack', 'leather', 'hides', 'tallow'],
  textiles:        ['cloth', 'textile', 'linen', 'wool', 'silk', 'cotton', 'felt'],
  leather_goods:   ['leather', 'tack', 'cordage', 'belt'],
  smelting:        ['iron', 'ingot', 'metal', 'steel', 'mail', 'armour', 'fittings'],
  weapons_armor:   ['armour', 'mail', 'plate', 'shield', 'spear', 'arrow'],
  timber:          ['barrel', 'stave', 'cooperage', 'carved wood', 'bowstave'],
  brewing:         ['mead', 'ale', 'wine', 'kumiss', 'beer'],
  alchemy:         ['sulfur', 'alum', 'reagent', 'mineral', 'pigment'],
  glass_print:     ['glass', 'vessel', 'parchment', 'vellum', 'paper', 'ink'],
  precious_metals_mining: ['silver', 'gold', 'gold wire', 'silver work'],
};

// ── Tier demand weight ───────────────────────────────────────────────────────
// How many demand goods to add per qualifying faction, by tier
const TIER_DEMAND_BUDGET = {
  thorp: 0, hamlet: 0, village: 1, town: 2, city: 3, metropolis: 4,
};

// Power threshold for a faction to qualify for demand contribution
const DEMAND_POWER_THRESHOLD = 8;

/**
 * computeDemandImports — main entry point.
 * Returns culture × faction driven import labels, suppressed by active chains.
 *
 * @param {Array}  factions      - powerStructure.factions
 * @param {string} culture       - settlement culture key
 * @param {Array}  activeChains  - economicState.activeChains
 * @param {string} tier          - settlement tier
 * @param {Array}  existingImports - already-derived imports (to avoid duplicates)
 * @returns {string[]} new import labels to append
 */
export function computeDemandImports(factions, culture, activeChains, tier, existingImports = []) {
  const budget = TIER_DEMAND_BUDGET[tier] || 0;
  if (budget === 0 || !factions?.length) return [];

  // Build suppression set from active chains
  const activeChainIds = new Set((activeChains || []).map(c => c.chainId));
  const suppressed = new Set();
  activeChainIds.forEach(id => {
    (CHAIN_SUPPRESSES[id] || []).forEach(kw => suppressed.add(kw.toLowerCase()));
  });

  // Build existing set (case-insensitive, partial match)
  const existingSet = new Set(
    (existingImports || []).map(i =>
      (typeof i === 'string' ? i : i?.name || '').toLowerCase()
    )
  );

  const isSuppressed = (good) => {
    const gl = good.toLowerCase();
    if (existingSet.has(gl)) return true;
    for (const kw of suppressed) {
      if (gl.includes(kw)) return true;
    }
    return false;
  };

  // Sort factions by power descending, filter to those above threshold
  const qualifying = [...factions]
    .filter(f => (f.power || 0) >= DEMAND_POWER_THRESHOLD && f.category)
    .sort((a, b) => (b.power || 0) - (a.power || 0));

  const results = [];
  const cultureKey = culture || 'latin';

  for (const faction of qualifying) {
    if (results.length >= budget) break;

    const cat = (faction.category === 'government' && !faction.isGoverning) ? 'government' : faction.category || 'government';
    const catDemand = FACTION_DEMAND[cat];
    if (!catDemand) continue;

    const cultureGoods = catDemand[cultureKey] || catDemand['latin'] || [];
    if (!cultureGoods.length) continue;

    // Pick goods from this faction's demand list that aren't suppressed
    // Each faction contributes at most 1 good to avoid any one faction dominating
    for (const good of cultureGoods[0]) {
      if (results.length >= budget) break;
      if (!isSuppressed(good)) {
        results.push(good);
        // Add to existing set so next faction won't duplicate
        existingSet.add(good.toLowerCase());
        break; // one per faction
      }
    }
  }

  return results;
}
