/**
 * spatialGenerator.js
 * Settlement spatial layout and district generation.
 */

// ─── generateSpatialLayout ────────────────────────────────────────────────────

/**
 * Generate a list of named settlement quarters/districts based on the
 * institutions present, then return a summary layout object.
 *
 * @param {string} tier         - Settlement tier
 * @param {Array}  institutions - Institution objects
 * @param {string} tradeRoute   - Trade route type string
 * @returns {{ layout: string, quarters: Array, tradeAccess: string }}
 */
export const generateSpatialLayout = (tier, institutions, tradeRoute, terrainType = 'plains') => {
  const instNames = institutions.map(i => i.name);
  const has = (keyword) => instNames.some(n => n.includes(keyword));

  const quarters = [];

  // Market quarter — present if any market institution
  if (has('Market')) {
    quarters.push({
      name:      'Market Quarter',
      location:  'Central',
      desc:      'Bustling center with merchant stalls, money changers, and crowds',
      landmarks: instNames
        .filter(n => n.includes('Market') || n.includes('Guild') || n.includes('Bank'))
        .slice(0, 3),
    });
  }

  // Religious quarter — present if any church/monastery institution
  if (has('church') || has('Cathedral') || has('monastery')) {
    quarters.push({
      name:      'Religious Quarter',
      location:  'Eastern district (traditional)',
      desc:      'Churches, monasteries, quiet streets with priests and pilgrims',
      landmarks: instNames
        .filter(n => n.includes('church') || n.includes('Cathedral') ||
                     n.includes('monastery') || n.includes('Hospital'))
        .slice(0, 3),
    });
  } else if (has('shrine') || has('Shrine')) {
    quarters.push({
      name:      'Roadside Shrine',
      location:  'At the settlement edge',
      desc:      'A simple marker or cairn where travellers leave offerings',
      landmarks: instNames.filter(n => n.toLowerCase().includes('shrine')).slice(0,1),
    });
  }

  // Noxious trades — tanneries, butchers, slaughterhouses go downwind
  if (has('Tanner') || has('Butcher') || has('Slaughter')) {
    quarters.push({
      name:      'Noxious Trades Quarter',
      location:  'Downstream/downwind',
      desc:      'Smelly, dirty area with tanneries, butchers, and dyers',
      landmarks: ["Tannery Row", "Slaughterhouse", "Dyer's Bridge"],
    });
  }

  // Waterfront district
  if (has('port') || has('Dock')) {
    quarters.push({
      name:      'Waterfront District',
      location:  'Along river/coast',
      desc:      'Warehouses, docks, sailors, longshoremen, fish smell',
      landmarks: ['Main Wharf', 'Warehouse Row', "Sailors' Quarter"],
    });
  }

  // Hamlet alehouse / gathering place — present if alehouse institution
  if (tier === 'hamlet' && (has('Alehouse') || has('alehouse') || has('Wayside inn'))) {
    quarters.push({
      name:      'Alehouse & Common',
      location:  'Village centre',
      desc:      'The alehouse and a scrap of common ground — the social heart of the settlement',
      landmarks: ['Common well', 'Alehouse', 'Notice post'],
    });
  }

  // Fishing community spatial feature
  if (has('Fishing community') || has('fishing')) {
    quarters.push({
      name:      'Fishing Landing',
      location:  "At the water's edge",
      desc:      'Nets, drying racks, upturned boats, and the perpetual smell of salt and fish',
      landmarks: ['Drying racks', 'Net mending post', 'Beaching ground'],
    });
  }

  // Woodcutters' camp
  if (has('Woodcutter')) {
    quarters.push({
      name:      "Woodcutters' Ground",
      location:  'At the forest edge',
      desc:      'Stacked timber, sawdust paths, and sheds for tools and sleds',
      landmarks: ['Timber stacks', 'Tool shed', 'Charcoal pit'],
    });
  }

  // Artisan quarter — craft guilds (excluding merchant guilds)
  if (has('craft') || (has('guild') && !has('Merchant'))) {
    quarters.push({
      name:      'Artisan Quarter',
      location:  'Between market and residential',
      desc:      'Workshops, guild halls, apprentices learning trades',
      landmarks: instNames
        .filter(n => n.includes('Smith') || n.includes('Weaver') || n.includes('guild hall'))
        .slice(0, 3),
    });
  }

  // Government quarter
  if (has('Palace') || has('City hall') || has('Courthouse')) {
    quarters.push({
      name:      'Government Quarter',
      location:  'Defensible high ground',
      desc:      'Official buildings, courts, administrative offices',
      landmarks: instNames
        .filter(n => n.includes('hall') || n.includes('Court') || n.includes('Palace'))
        .slice(0, 3),
    });
  }

  // Mages' quarter — isolated for safety
  if (has('Wizard') || has('Mage') || has('Magic')) {
    quarters.push({
      name:      "Mages' Quarter",
      location:  'Isolated area (safety concerns)',
      desc:      'Towers, arcane shops, strange lights and sounds at night',
      landmarks: instNames
        .filter(n => n.includes('Wizard') || n.includes('Mage') ||
                     n.includes('Enchanter') || n.includes('Alchemist'))
        .slice(0, 3),
    });
  }

  // Underworld district
  if (has('Thieves') || has('criminal') || has('Black market')) {
    quarters.push({
      name:      'Shadows District',
      location:  'Old town or slums',
      desc:      'Narrow alleys, hidden markets, criminal activity',
      landmarks: ["The Rat's Nest (tavern)", 'Blind Alley', 'The Warren (slums)'],
    });
  }

  // City/metropolis get residential tiers
  if (tier === 'city' || tier === 'metropolis') {
    quarters.push({
      name:      'Wealthy Residential',
      location:  'High ground, good views',
      desc:      'Stone townhouses, private gardens, clean streets',
      landmarks: ["Noble's Row", 'Merchant Estates', 'Garden District'],
    });
    quarters.push({
      name:      'Common Residential',
      location:  'Spread throughout',
      desc:      'Dense timber tenements, narrow streets, crowded',
      landmarks: ["Tanners' Lane", "Weavers' Street", "Cooper's Close"],
    });
  }

  // ── Layout descriptions by tier ─────────────────────────────────────────
  // Thorps get terrain-specific layout descriptions
  const thorpLayouts = {
    coastal:   'A handful of cottages above the tideline, nets drying on poles',
    riverside: 'Dwellings strung along the bank, a small jetty at the ford',
    forest:    'Woodcutters\' clearings ringed by dense tree cover',
    plains:    'An open cluster of farmsteads around a shared well',
    hills:     'Stone-walled holdings climbing a south-facing hillside',
    desert:    'Mud-brick homes clustered around a single shaded well',
    mountain:  'Sheltered below a ridge, paths carved through the rock',
  };
  const LAYOUT_BY_TIER = {
    metropolis:  (() => {
      const metroLayouts = {
        coastal:   'Imperial port city: fortified harbour, merchant districts, grand boulevard from waterfront to palace',
        riverside: 'River delta metropolis: island districts, bridge-markets, the great river-gate controlling all upstream trade',
        plains:    'Sprawling imperial capital: walled inner city, vast suburban rings, the palace district above the outer walls',
        forest:    'Metropolis carved from the forest heart: the old city is stone, the outer rings are timber and smoke',
        hills:     'Hill metropolis on seven rises: each commanding a district, each district a city unto itself',
        desert:    'Great desert metropolis of white stone: the citadel above the wells, the souk below, caravansaries ringing the walls',
        mountain:  'Mountain capital in a high valley: tiered city climbing from the river floor to the fortress crown',
      };
      return metroLayouts[terrainType] || 'Dense urban core with sprawling suburbs';
    })(),
    city:        (() => {
      const cityLayouts = {
        coastal:   'Walled port city rising from the harbour, suburbs sprawling along the coast road',
        riverside: 'Great river city: bridge quarter, merchant districts, cathedral hill above the flood line',
        plains:    'Walled city with sprawling suburbs beyond the gates, outlying wards growing faster than the walls',
        forest:    'Walled city carved from the forest, timber yards and charcoal depots in the outer rings',
        hills:     'Hill city: castle district commanding the heights, market quarter below, poor wards at the base',
        desert:    'Walled desert city of pale stone, caravanserai outside the east gate, citadel above the wells',
        mountain:  'Mountain city of terraced districts, the citadel at the summit, lower town in the valley',
      };
      return cityLayouts[terrainType] || 'Walled core with some suburban growth';
    })(),
    town:        (() => {
      const townLayouts = {
        coastal:   'Walled port town climbing from the harbour, warehouses and chandlers at the waterfront',
        riverside: 'Walled town straddling the river, a fortified bridge at its commercial heart',
        plains:    'Compact within walls, outlying farms and a weekly market field beyond the gates',
        forest:    'Tightly walled market town, timber yards and sawpits outside the north gate',
        hills:     'Stone-walled hill town, the castle or keep visible above the market quarter',
        desert:    'Walled trading town around a great well, caravanserai outside the south gate',
        mountain:  'Fortified pass town, walls cutting across the valley floor, garrison above',
      };
      return townLayouts[terrainType] || 'Compact within walls, some outlying farms';
    })(),
    village:     (() => {
      const villageLayouts = {
        coastal:   'Church and green above the tideline, a harbour lane leading down to the water',
        riverside: 'Village green beside the mill, the river road running through the centre',
        forest:    'A clearing settlement: church, green, and dwellings ringed by managed woodland',
        plains:    'Clustered around church and green, fields radiating out in open strips',
        hills:     'Stone-walled village on a south-facing slope, paths converging at the market cross',
        desert:    'Compact walled settlement around a central well and mosque or chapel',
        mountain:  'Close-built stone houses below the church, a single defended gate',
      };
      return villageLayouts[terrainType] || 'Clustered around church and green';
    })(),
    hamlet:      (() => {
      const hamletLayouts = {
        coastal:   'A straggle of cottages above the tideline, paths worn to the landing',
        riverside: 'Farmsteads strung along the bank, a ford crossing at the centre',
        forest:    'Clearings connected by beaten tracks through the wood',
        plains:    'Scattered farmsteads along a muddy track, a common at the centre',
        hills:     'Holdings spread across a hillside, paths converging at the well',
        desert:    'Compact mud-brick dwellings clustered around a shared water source',
        mountain:  'Stone holdings on sheltered ledges, a single switchback path between',
      };
      return hamletLayouts[terrainType] || 'Scattered farmsteads along a path';
    })(),
    thorp:      thorpLayouts[terrainType] || 'Small cluster of homes near water source',
  };

  // ── Trade access descriptions ────────────────────────────────────────────
  const TRADE_ACCESS_BY_ROUTE = {
    crossroads: 'Major crossroads (multiple gates)',
    river:      'River access (water gate and docks)',
    port:       'Coastal port (harbor and shipyards)',
    road:       'Single main road (two gates)',
    isolated:   'Isolated (one gate, poor road)',
  };

  return {
    layout:      LAYOUT_BY_TIER[tier]       || 'Scattered rural settlement',
    quarters,
    tradeAccess: TRADE_ACCESS_BY_ROUTE[tradeRoute] || tradeRoute,
  };
};
