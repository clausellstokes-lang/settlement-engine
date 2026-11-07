/**
 * spatialGenerator.js
 * Settlement spatial layout and district generation.
 */
import { defenseFactsOf } from '../domain/defense/defenseFacts.js';
import { createGenerationWorldLaw } from './generationContext.js';
import { textOf } from '../domain/facts/textOf.js'; // R-C (CENSUS-2d): a declared cell gives back its text; CENSUS-1e's T-branch wiring enforces

/**
 * THE CRISIS-SCOPED FLAGS (CENSUS-2e unit 1, the chair's R-AF): the quarters whose description the ledger
 * (docs/census/declarations/SPATIAL_TEXT.json) opted into the crisis dimension, by quarter name. The T wiring
 * passes `crisisScoped: true` for these cells, read from here; the register pin is the compose's (R-T).
 * @type {ReadonlyArray<string>}
 */
// CENSUS-2f, R-AH: both quarters' cells write `crisis: any` (no calm line), so the inert flag is dropped.
export const SPATIAL_QUARTER_CRISIS_SCOPED = Object.freeze([]);

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
  const worldLaw = createGenerationWorldLaw({}, { tradeRoute, terrainType });
  const instNames = institutions.map(i => i.name);
  const defence = defenseFactsOf({ institutions });
  const has = (keyword) => instNames.some(n => n.includes(keyword));
  /**
   * Roster test for the sacred-house derivation below, in either spelling the catalogue
   * uses ('church' inside a name, 'Church' at its head). It rides the ONE roster scan
   * above rather than opening a second: the label-join census freezes this file's scan
   * sites and a new join must come by catalogue id, not by a fresh pass over the names.
   */
  const holds = (...keywords) => keywords.some((k) => has(k) || has(k.charAt(0).toUpperCase() + k.slice(1)));

  // ⛔ THE SACRED HOUSE IS DERIVED FROM THE ROSTER AT EVERY TIER, NEVER NAMED OUTRIGHT.
  // ── THE FINDING (browser pass 3, 2026-09-19) ───────────────────────────────────────
  // A MESOAMERICAN village read "Church and green above the tideline". Five village lines,
  // the village fallback and the city's riverside line each said 'church' or 'cathedral'
  // outright, so the layout promised a building out of one setting's Christendom on a
  // product whose scope law is SETTING-AGNOSTIC — and promised it to towns whose roster
  // holds no such institution at all.
  //
  // The desert village row had already been cured this way (§767.3(e), which killed the
  // shipped "mosque or chapel" alternation) and the cure was left at ONE row. This makes it
  // the rule for the file: a settlement is described by what it HOLDS. A church, cathedral,
  // monastery, friary, abbey or minster on the roster reads as its church; a temple reads as
  // its temple; a shrine and nothing larger reads as a wayside shrine; a settlement with no
  // sacred institution gets no sacred word, and its line says what is actually there.
  //
  // ⚠ THIS MOVES SAME-SEED TEXT. `layout` is spread onto the hashed settlement, so no
  // read-time seam can reach it — the same position `quarters[].desc` is in, two screens up.
  const sacredHouse = holds('church', 'cathedral', 'monastery', 'friary', 'abbey', 'minster')
    ? 'church'
    : holds('temple') ? 'temple' : null;
  /** A shrine is the sacred house only when nothing larger stands. */
  const waysideShrine = !sacredHouse && holds('shrine');
  /** 'Church' / 'Temple' / 'A wayside shrine' / null — the subject of a layout clause. */
  const sacredSubject = sacredHouse
    ? sacredHouse.charAt(0).toUpperCase() + sacredHouse.slice(1)
    : waysideShrine ? 'A wayside shrine' : null;
  /** The same thing mid-sentence, where the clause supplies its own article or none. */
  const sacredBare = sacredHouse || (waysideShrine ? 'a wayside shrine' : null);

  const quarters = [];

  // Market quarter — present if any market institution
  if (has('Market')) {
    quarters.push({
      name:      'Market Quarter',
      location:  'Central',
      desc:      textOf({ text: 'Bustling center with merchant stalls, money changers, and crowds', excludes: ['crisis: threat', 'crisis: plague_onset'], crisis: ['any'] }),
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
      // ⛔ GENERATED TEXT, NOT A LABEL (ODQ §934.22 item 1(d)). This string is SPREAD ONTO
      // the hashed settlement as `spatialLayout.quarters[].desc`, so no read-time seam can
      // reach it and moving it MOVES THE GOLDEN — the shift is recorded at
      // docs/shift-records/2026-09-19-religious-quarter-text.json. The quarter's own NAME
      // ('Religious Quarter') and its `has('church')` gate are untouched: the gate reads the
      // raw catalogue key, which §934.13 ruled stays the identifier.
      desc:      textOf({ text: 'Houses of worship, cloisters, quiet streets with priests and pilgrims', excludes: ['crisis: unrest'], crisis: ['any'] }),
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
      landmarks: ["Tannery Row", "Slaughterhouse", { text: "Dyer's Bridge", needs: ['river'] }].map(textOf), // kind A: carried (R-C); no record at this site to filter against
    });
  }

  // Waterfront district — only for genuine dock institutions on a water route.
  // The old gate was `has('port') || has('Dock')`, a case-sensitive substring:
  // 'Teleportation circle' and 'Barge and river transport company' both contain
  // 'port', so isolated settlements grew phantom wharves. Real dock institutions
  // ("Docks/port facilities", "Major Port", "Harbour master's office", "Shipyard")
  // are access-gated to port/river in spatialData.js — mirror that here by
  // requiring both a dock-specific name and a water trade route.
  const isDockInstitution = (n) => /docks\/port|major port|harbou?r|shipyard|wharf/i.test(n);
  if (instNames.some(isDockInstitution) && ['port', 'river'].includes(tradeRoute)) {
    const maritime = worldLaw.supportsMaritime();
    quarters.push({
      name:      'Waterfront District',
      location:  maritime ? 'Along the coast' : 'Along the river',
      desc:      maritime
        ? 'Warehouses, docks, sailors, longshoremen, salt, and fish'
        : 'Warehouses, wharves, barges, dockworkers, and river traffic',
      landmarks: maritime
        ? ['Main Wharf', 'Warehouse Row', "Sailors' Quarter"]
        : ['Barge Wharf', 'Warehouse Row', 'River Landing'],
    });
  }

  // Hamlet alehouse / gathering place — present if alehouse institution
  if (tier === 'hamlet' && (has('Alehouse') || has('alehouse') || has('Wayside inn'))) {
    quarters.push({
      name:      'Alehouse & Common',
      location:  'Village centre',
      desc:      'The alehouse and a scrap of common ground: the social heart of the settlement',
      landmarks: ['Common well', 'Alehouse', 'Notice post'],
    });
  }

  // Fishing community spatial feature
  if (has('Fishing community') || has('fishing')) {
    quarters.push({
      name:      'Fishing Landing',
      location:  "At the water's edge",
      desc:      textOf({ text: 'Nets, drying racks, upturned boats, and the perpetual smell of salt and fish', needs: ['coast'] }),
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
      desc:      textOf({ text: 'Towers, arcane shops, strange lights and sounds at night', needs: ['magic'] }),
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
      landmarks: [{ text: "The Rat's Nest (tavern)", needs: ['institution: tavern'] }, 'Blind Alley', 'The Warren (slums)'].map(textOf), // kind A: carried (R-C)
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
    coastal:   { text: 'A handful of cottages above the tideline, nets drying on poles', needs: ['coast'] },
    riverside: { text: 'Dwellings strung along the bank, a small jetty at the ford', needs: ['river'] },
    forest:    'Woodcutters\' clearings ringed by dense tree cover',
    plains:    'An open cluster of farmsteads around a shared well',
    hills:     'Stone-walled holdings climbing a south-facing hillside',
    desert:    'Mud-brick homes clustered around a single shaded well',
    mountain:  'Sheltered below a ridge, paths carved through the rock',
  };
  const LAYOUT_BY_TIER = {
    metropolis:  (() => {
      const metroLayouts = {
        coastal:   { text: 'Imperial port city: fortified harbour, merchant districts, grand boulevard from waterfront to palace', needs: ['coast', 'institution: docks'] },
        riverside: { text: 'River delta metropolis: island districts, bridge-markets, the great river-gate controlling all upstream trade', needs: ['river', 'gate', 'market'] },
        plains:    { text: 'Sprawling imperial capital: walled inner city, vast suburban rings, the palace district above the outer walls', needs: ['walls'] },
        forest:    'Metropolis carved from the forest heart: the old city is stone, the outer rings are timber and smoke',
        hills:     'Hill metropolis on seven rises: each commanding a district, each district a city unto itself',
        desert:    { text: 'Great desert metropolis of white stone: the citadel above the wells, the souk below, caravansaries ringing the walls', needs: ['walls', 'market'] },
        mountain:  { text: 'Mountain capital in a high valley: tiered city climbing from the river floor to the fortress crown', needs: ['river'] },
      };
      return textOf(metroLayouts[terrainType]) || 'Dense urban core with sprawling suburbs';
    })(),
    city:        (() => {
      const cityLayouts = {
        coastal:   { text: 'Walled port city rising from the harbour, suburbs sprawling along the coast road', needs: ['walls', 'coast', 'institution: docks'] },
        riverside: { text: `Great river city: bridge quarter, merchant districts, ${sacredHouse ? `${sacredHouse} hill` : 'the high ground'} above the flood line`, needs: ['river', 'market'] },
        plains:    { text: 'Walled city with sprawling suburbs beyond the gates, outlying wards growing faster than the walls', needs: ['walls', 'gate'] },
        forest:    { text: 'Walled city carved from the forest, timber yards and charcoal depots in the outer rings', needs: ['walls'] },
        hills:     { text: 'Hill city: castle district commanding the heights, market quarter below, poor wards at the base', needs: ['market'] },
        desert:    { text: 'Walled desert city of pale stone, caravanserai outside the east gate, citadel above the wells', needs: ['walls', 'gate'] },
        mountain:  'Mountain city of terraced districts, the citadel at the summit, lower town in the valley',
      };
      return textOf(cityLayouts[terrainType] || { text: 'Walled core with some suburban growth', needs: ['walls'] });
    })(),
    town:        (() => {
      // F1 (rung 1B): a town's layout names walls only where walls stand on its record, and a
      // garrison only where one stands (`defenseFactsOf`). The unwalled lines are VETOABLE.
      if (!defence.hasWalls) {
        const openTownLayouts = {
          coastal:   { text: 'Port town climbing from the harbour, warehouses and chandlers at the waterfront', needs: ['coast', 'institution: docks'] },
          riverside: { text: 'Town straddling the river, a bridge at its commercial heart', needs: ['river'] },
          plains:    { text: 'Compact core, outlying farms and a weekly market field at the edge of town', needs: ['market'] },
          forest:    { text: 'Close-built market town, timber yards and sawpits on the north road', needs: ['market'] },
          hills:     { text: 'Hill town of stone houses climbing above the market quarter', needs: ['market'] },
          desert:    'Trading town around a great well, caravanserai on the south road',
          mountain:  'Pass town strung along the valley floor',
        };
        return textOf(openTownLayouts[terrainType]) || 'Compact core, some outlying farms';
      }
      const townLayouts = {
        coastal:   { text: 'Walled port town climbing from the harbour, warehouses and chandlers at the waterfront', needs: ['coast', 'institution: docks'] },
        riverside: { text: 'Walled town straddling the river, a fortified bridge at its commercial heart', needs: ['river'] },
        plains:    { text: 'Compact within walls, outlying farms and a weekly market field beyond the gates', needs: ['gate', 'market'] },
        forest:    { text: 'Tightly walled market town, timber yards and sawpits outside the north gate', needs: ['gate', 'market'] },
        // "the keep" (was "the castle or keep" — the same unresolved-alternation
        // class as the desert-village row, §767.3(e); no castle-family
        // institution exists at town tier, so the sentence commits to the one
        // word the tier can honestly carry).
        hills:     { text: 'Stone-walled hill town, the keep visible above the market quarter', needs: ['market'] },
        desert:    { text: 'Walled trading town around a great well, caravanserai outside the south gate', needs: ['gate'] },
        mountain:  defence.hasGarrison
          ? 'Fortified pass town, walls cutting across the valley floor, garrison above'
          : 'Fortified pass town, walls cutting across the valley floor',
      };
      return textOf(townLayouts[terrainType]) || 'Compact within walls, some outlying farms';
    })(),
    village:     (() => {
      // Every row here derives its sacred house the way the desert row always has (see the
      // block above `LAYOUT_BY_TIER`): the town is described by what it holds, and a town
      // that holds nothing sacred is described by what else is there.
      const desertSacred = sacredHouse ? ` and its ${sacredHouse}` : waysideShrine ? ' and a wayside shrine' : '';
      const villageLayouts = {
        coastal:   sacredSubject
          ? { text: `${sacredSubject} and green above the tideline, a harbour lane leading down to the water`, needs: ['coast'] }
          : { text: 'A green above the tideline, a harbour lane leading down to the water', needs: ['coast'] },
        riverside: { text: 'Village green beside the mill, the river road running through the centre', needs: ['river', 'institution: mill'] },
        forest:    sacredBare
          ? `A clearing settlement: ${sacredBare}, green, and dwellings ringed by managed woodland`
          : 'A clearing settlement: green and dwellings ringed by managed woodland',
        plains:    sacredBare
          ? `Clustered around ${sacredBare} and green, fields radiating out in open strips`
          : 'Clustered around the green, fields radiating out in open strips',
        // F1: the walled lines stand only where walls do; the open lines are VETOABLE.
        hills:     defence.hasWalls
          ? { text: 'Stone-walled village on a south-facing slope, paths converging at the market cross', needs: ['market'] }
          : { text: 'Stone-built village on a south-facing slope, paths converging at the market cross', needs: ['market'] },
        desert:    defence.hasWalls
          ? `Compact walled settlement around a central well${desertSacred}`
          : `Compact settlement around a central well${desertSacred}`,
        mountain:  sacredHouse
          ? { text: `Close-built stone houses below the ${sacredHouse}, a single defended gate`, needs: ['gate'] }
          : waysideShrine
            ? { text: 'Close-built stone houses below a wayside shrine, a single defended gate', needs: ['gate'] }
            : { text: 'Close-built stone houses below the ridge, a single defended gate', needs: ['gate'] },
      };
      return textOf(villageLayouts[terrainType])
        || (sacredBare ? `Clustered around ${sacredBare} and green` : 'Clustered around the green');
    })(),
    hamlet:      (() => {
      const hamletLayouts = {
        coastal:   { text: 'A straggle of cottages above the tideline, paths worn to the landing', needs: ['coast'] },
        riverside: { text: 'Farmsteads strung along the bank, a ford crossing at the centre', needs: ['river'] },
        forest:    'Clearings connected by beaten tracks through the wood',
        plains:    'Scattered farmsteads along a muddy track, a common at the centre',
        hills:     'Holdings spread across a hillside, paths converging at the well',
        desert:    'Compact mud-brick dwellings clustered around a shared water source',
        mountain:  'Stone holdings on sheltered ledges, a single switchback path between',
      };
      return textOf(hamletLayouts[terrainType]) || 'Scattered farmsteads along a path';
    })(),
    thorp:      textOf(thorpLayouts[terrainType]) || 'Small cluster of homes near water source',
  };

  // ── Trade access descriptions ────────────────────────────────────────────
  const portAccess = worldLaw.supportsMaritime()
    ? { text: 'Coastal port (harbour and shipyards)', needs: ['coast', 'institution: docks'] }
    : { text: 'Inland river port (wharves and barge docks)', needs: ['river', 'institution: docks'] };
  const TRADE_ACCESS_BY_ROUTE = {
    crossroads: { text: 'Major crossroads (multiple gates)', needs: ['gate'] },
    river:      { text: 'River access (water gate and docks)', needs: ['river', 'gate', 'institution: docks'] },
    port:       portAccess,
    road:       { text: 'Single main road (two gates)', needs: ['gate'] },
    isolated:   { text: 'Isolated (one gate, poor road)', needs: ['gate'] },
  };

  return {
    layout:      LAYOUT_BY_TIER[tier]       || 'Scattered rural settlement',
    quarters,
    tradeAccess: textOf(TRADE_ACCESS_BY_ROUTE[tradeRoute]) || tradeRoute,
  };
};
