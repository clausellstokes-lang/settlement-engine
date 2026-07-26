/**
 * data/cultureProfiles.js — the canonical meaning of the generator's culture dial.
 *
 * A culture choice must do more than swap personal-name lists. Each profile
 * materializes a bounded fantasy design grammar for civic organization, built
 * form, exchange, foodways, sacred life, defense, and ordinary social texture.
 * Those dimensions are presentation context plus modest institution
 * likelihoods, not a claim to simulate a whole society or to say that a real
 * historical culture was uniform. The generated identity is one local
 * expression of a broad inspiration family, and the settlement's other inputs
 * (terrain, route, institutions, stress, and player overrides) remain
 * authoritative.
 *
 * Two consumers use this module:
 *   - generation materializes a seed-stable culturalIdentity and applies small
 *     institution-probability biases;
 *   - dossier/AI surfaces read the same identity instead of maintaining a
 *     second, stereotype-prone culture paragraph table.
 *
 * Pure and headless. No generator, store, or React dependency.
 */

const freezeList = (values) => Object.freeze([...values]);

/**
 * @param {object} profile
 * @returns {Readonly<object>}
 */
const profile = (profile) => Object.freeze({
  ...profile,
  builtForm: freezeList(profile.builtForm),
  civicPattern: freezeList(profile.civicPattern),
  exchangePattern: freezeList(profile.exchangePattern),
  foodways: freezeList(profile.foodways),
  sacredLife: freezeList(profile.sacredLife),
  defensePattern: freezeList(profile.defensePattern),
  socialTexture: freezeList(profile.socialTexture),
  architecturalDetails: freezeList(profile.architecturalDetails),
  institutionBias: Object.freeze({
    categories: Object.freeze({ ...(profile.institutionBias?.categories || {}) }),
    keywords: Object.freeze({ ...(profile.institutionBias?.keywords || {}) }),
  }),
});

/**
 * These are broad fantasy inspiration families, kept under the existing stable
 * config keys for save compatibility. Text emphasizes institutions and material
 * conditions rather than assigning personality traits to whole peoples.
 */
export const CULTURE_PROFILES = Object.freeze({
  germanic: profile({
    key: 'germanic',
    label: 'Germanic-inspired',
    scope: 'A timber-and-stone, guild-and-estate design grammar.',
    builtForm: [
      'Timber-framed street houses cluster around a market green, with stone reserved for halls, bridges, and defenses.',
      'Farmsteads and craft yards form compact wards around a hall, church, or fortified manor.',
    ],
    civicPattern: [
      'Household heads, landed patrons, and craft associations negotiate authority through customary rights.',
      'A lordly court shares practical administration with guild officers and sworn neighborhood representatives.',
    ],
    exchangePattern: [
      'Guild-regulated craft production and overland fairs organize exchange.',
      'Estate dues, weekly markets, and merchant associations connect farms to specialist workshops.',
    ],
    foodways: [
      'Grain, orchard produce, preserved meat, dairy, and ale anchor the local table.',
      'Rye or barley breads, pottage, smoked foods, and seasonal livestock products dominate ordinary meals.',
    ],
    sacredLife: [
      'Parish observance coexists with household customs, saints, oath sites, and seasonal rites.',
      'The sacred calendar is public and institutional, while wells, groves, and family memorials retain local weight.',
    ],
    defensePattern: [
      'Earthworks and timber palisades mature into gated stone walls as wealth and threat increase.',
      'A militia tradition supports a smaller permanent watch or retinue.',
    ],
    socialTexture: [
      'Household, guild, parish, and estate obligations overlap; authority is visible through office and reciprocal duty.',
      'Craft reputation and customary rights matter almost as much as formal rank in daily disputes.',
    ],
    architecturalDetails: [
      'half-timbered upper floors project above the busier lanes',
      'steep roofs, enclosed craft yards, and carved lintels mark the older wards',
      'a hall-and-market axis organizes the settlement center',
    ],
    institutionBias: {
      categories: { Crafts: 1.12, Economy: 1.05 },
      keywords: { guild: 1.12, hall: 1.08, smith: 1.08, brewery: 1.06 },
    },
  }),

  latin: profile({
    key: 'latin',
    label: 'Latin-inspired',
    scope: 'A masonry, civic-square, patronage-and-law design grammar.',
    builtForm: [
      'Masonry courtyard buildings and tiled roofs gather around public squares and processional streets.',
      'Dense street blocks open into arcades, fountains, markets, and reused monumental precincts.',
    ],
    civicPattern: [
      'Councils, magistrates, patrons, and legal corporations compete through offices, charters, and public works.',
      'Civic office and private patronage are intertwined; public generosity is a recognized route to influence.',
    ],
    exchangePattern: [
      'Contract, warehousing, market tolls, and notarial practice support long-distance commerce.',
      'Urban markets aggregate agricultural estates, workshops, and regional shipping into a documented tax base.',
    ],
    foodways: [
      'Bread grains, pulses, garden produce, oil or rendered fats, wine, and preserved fish form the staple pattern.',
      'Public ovens, neighborhood vendors, and shared dining customs make food distribution visibly civic.',
    ],
    sacredLife: [
      'Shrines, processions, confraternities, and formal priesthoods share the public religious calendar.',
      'Household devotion and civic cult practice overlap in festivals, memorials, and patronage.',
    ],
    defensePattern: [
      'Masonry walls, watch posts, and road gates are maintained as civic infrastructure.',
      'Professional guards supplement levy forces organized by district and patron.',
    ],
    socialTexture: [
      'Public standing is negotiated through family networks, office, clientage, law, and visible contribution to civic life.',
      'Squares and courts make politics unusually public even when decisions are settled through private patronage.',
    ],
    architecturalDetails: [
      'arcaded market fronts define the principal square',
      'warm tile roofs and enclosed courtyards break up the stone streets',
      'fountains, steps, and reused columns give the civic center a layered age',
    ],
    institutionBias: {
      categories: { Government: 1.08, Economy: 1.06, Infrastructure: 1.05 },
      keywords: { council: 1.1, court: 1.08, bath: 1.12, market: 1.06 },
    },
  }),

  celtic: profile({
    key: 'celtic',
    label: 'Celtic-inspired',
    scope: 'A kin-district, assembly, pastoral-and-earthwork design grammar.',
    builtForm: [
      'Older round or oval compounds sit among later rectangular halls, linked by lanes rather than a rigid grid.',
      'A dispersed settlement has grown inward around an assembly green, defended height, or sacred enclosure.',
    ],
    civicPattern: [
      'Kin groups, oath relationships, learned mediators, and an assembly divide political authority.',
      'Leadership depends on hospitality, judgment, and alliance maintenance as much as coercive office.',
    ],
    exchangePattern: [
      'Pastoral wealth, seasonal fairs, metalwork, and gift exchange connect dispersed households.',
      'Market exchange operates beside tribute, fosterage, and reciprocal obligations between kin groups.',
    ],
    foodways: [
      'Oats or barley, dairy, cattle products, woodland foods, fish, and seasonal preserves shape the table.',
      'Herding and mixed farming produce a strongly seasonal food calendar.',
    ],
    sacredLife: [
      'Sacred enclosures, wells, groves, learned keepers, and household observances form a layered ritual landscape.',
      'Ritual authority is distributed among formal sanctuaries, seasonal gatherings, and place-based customs.',
    ],
    defensePattern: [
      'Ditches, banks, timber ramparts, and defensible hills protect clustered households.',
      'War bands and kin levies assemble around a smaller retinue of experienced fighters.',
    ],
    socialTexture: [
      'Kinship and neighborhood obligations carry legal force, while poets, judges, and mediators preserve public memory.',
      'Status is made visible through generosity, oath keeping, and the ability to mobilize relatives and clients.',
    ],
    architecturalDetails: [
      'earth-banked enclosures and older rounded foundations remain visible between newer halls',
      'carved stone and timber markers stand where roads meet the assembly ground',
      'the settlement follows the contours of the land instead of a surveyed grid',
    ],
    institutionBias: {
      categories: { Agriculture: 1.08, Religious: 1.05, Defense: 1.04 },
      keywords: { grove: 1.14, bard: 1.16, earthwork: 1.12, livestock: 1.06 },
    },
  }),

  arabic: profile({
    key: 'arabic',
    label: 'Arabic-inspired',
    scope: 'A courtyard, waterworks, endowed-institution-and-caravan design grammar.',
    builtForm: [
      'Shaded lanes connect inward-looking courtyard buildings, market arcades, gardens, and managed water points.',
      'Dense masonry quarters open onto caravan courts, covered markets, bathhouses, and planted courtyards.',
    ],
    civicPattern: [
      'Judges, market officers, endowed institutions, military households, and merchant notables share administration.',
      'Formal law and charitable endowment sit beside neighborhood mediation and courtly patronage.',
    ],
    exchangePattern: [
      'Caravan organization, brokerage, credit, warehousing, and inspected markets sustain regional exchange.',
      'Merchant partnerships and route intelligence connect local workshops to long-distance trade.',
    ],
    foodways: [
      'Flatbreads, grains, pulses, dates or orchard fruits, dairy, spices, and irrigated garden produce anchor meals.',
      'Water access and preservation skill determine the balance between local produce and caravan-borne staples.',
    ],
    sacredLife: [
      'Daily observance, schools, charitable endowments, pilgrimage traffic, and neighborhood shrines organize sacred life.',
      'Religious institutions also support law, education, hospitality, water, and relief for travelers.',
    ],
    defensePattern: [
      'Controlled gates, towers, citadels, and protected water infrastructure define strategic defense.',
      'Mounted patrols and household troops reinforce ward-based watches.',
    ],
    socialTexture: [
      'Neighborhood, household, legal, charitable, and commercial obligations intersect in markets and courtyards.',
      'Hospitality, reputation, contract, and access to mediation are practical forms of social capital.',
    ],
    architecturalDetails: [
      'shaded arcades and latticed upper windows soften the market streets',
      'courtyard gates reveal planted interiors and carefully managed water',
      'caravan courts and covered lanes make movement through the merchant quarter deliberate',
    ],
    institutionBias: {
      categories: { Economy: 1.1, Infrastructure: 1.08 },
      keywords: { caravan: 1.16, market: 1.08, water: 1.12, bath: 1.08, library: 1.06 },
    },
  }),

  norse: profile({
    key: 'norse',
    label: 'Norse-inspired',
    scope: 'A hall, maritime, assembly-and-seasonal-survival design grammar.',
    builtForm: [
      'Long halls, boat sheds, turf-roofed outbuildings, and timber yards face a landing or sheltered common.',
      'A compact hall-centered settlement stretches along the best shoreline, roadstead, or defensible ridge.',
    ],
    civicPattern: [
      'Household leaders and law speakers bargain in assembly beneath a chieftain or royal representative.',
      'Authority depends on followings, ships, land, judgments, and the public distribution of wealth.',
    ],
    exchangePattern: [
      'Maritime trade, seasonal voyaging, fishing, pastoral production, and portable wealth drive exchange.',
      'Landing places and halls serve as markets before specialized commercial institutions emerge.',
    ],
    foodways: [
      'Barley, dairy, preserved fish or meat, hardy greens, and seasonal livestock products dominate.',
      'Smoking, drying, fermenting, and winter storage are central household technologies.',
    ],
    sacredLife: [
      'Household rites, oath sites, burial memory, feast days, and formal sanctuaries overlap.',
      'Religious authority remains distributed between local ritual specialists and powerful patrons.',
    ],
    defensePattern: [
      'Ringworks, timber walls, beacon systems, and readily mobilized crews protect the settlement.',
      'A warrior following provides the permanent core around which levy and ship crews assemble.',
    ],
    socialTexture: [
      'Law, household reputation, reciprocal gifts, and access to ships or land structure public standing.',
      'Seasonal scarcity makes storage, mutual aid, and dependable leadership visibly political.',
    ],
    architecturalDetails: [
      'carved roof beams and long hall ridges dominate the older quarter',
      'turf roofs and timber sheds gather behind the working waterfront',
      'the assembly ground sits between the principal hall and the landing',
    ],
    institutionBias: {
      categories: { Defense: 1.06, Crafts: 1.05 },
      keywords: { ship: 1.16, dock: 1.1, hall: 1.12, fish: 1.08, militia: 1.06 },
    },
  }),

  slavic: profile({
    key: 'slavic',
    label: 'Slavic-inspired',
    scope: 'A timber-compound, communal-land, river-and-forest design grammar.',
    builtForm: [
      'Timber compounds, kitchen gardens, workshops, and communal greens spread along a riverbank or defensible rise.',
      'A palisaded core is surrounded by farm lanes, bathhouses, sheds, and later market streets.',
    ],
    civicPattern: [
      'Communal assemblies, household elders, service elites, and princely or appointed officers share authority.',
      'Collective land and labor customs coexist with tribute, estate, and court obligations.',
    ],
    exchangePattern: [
      'River trade, forest products, grain, wax, furs, and seasonal fairs connect households to wider routes.',
      'Communal production and itinerant merchants precede more formal guild and warehouse systems.',
    ],
    foodways: [
      'Rye, millet, cabbage, mushrooms, river fish, dairy, and preserved forest foods form the staple pattern.',
      'Fermentation, pickling, drying, and shared ovens stretch the harvest through winter.',
    ],
    sacredLife: [
      'Formal temples or churches coexist with ancestor customs, seasonal festivals, springs, and household rites.',
      'Sacred life follows both an institutional calendar and the agricultural year.',
    ],
    defensePattern: [
      'Palisades, ditches, river barriers, and fortified compounds provide layered defense.',
      'A household levy supports a smaller retinue or garrison.',
    ],
    socialTexture: [
      'Household and communal labor obligations are enforced through reputation, assembly, and local office.',
      'Shared ovens, bathhouses, wells, and seasonal work make private life unusually communal.',
    ],
    architecturalDetails: [
      'painted timber fronts and enclosed garden plots line the older lanes',
      'a communal green, bathhouse, and well bind several household compounds together',
      'palisade lines and river stairs reveal successive stages of expansion',
    ],
    institutionBias: {
      categories: { Agriculture: 1.08, Infrastructure: 1.04 },
      keywords: { timber: 1.1, bath: 1.14, river: 1.08, granary: 1.08, communal: 1.08 },
    },
  }),

  east_asian: profile({
    key: 'east_asian',
    label: 'East-Asian-inspired',
    scope: 'A ward, courtyard, bureaucratic-and-lineage design grammar.',
    builtForm: [
      'Walled compounds, tiled roofs, axial streets, shop houses, and garden courts organize distinct wards.',
      'A planned civic axis links gate, market, administrative compound, temple precinct, and waterworks.',
    ],
    civicPattern: [
      'Administrative officers, lineage organizations, neighborhood heads, guilds, and landed patrons overlap.',
      'Written office and examination or appointment coexist with household, temple, and merchant authority.',
    ],
    exchangePattern: [
      'Regulated markets, guild brokerage, granary systems, canals or roads, and standardized records support exchange.',
      'Merchant associations connect specialist craft wards to agricultural hinterlands and long routes.',
    ],
    foodways: [
      'Rice or millet, wheat foods, soy or pulse products, vegetables, tea, fish, and preserved condiments vary by ecology.',
      'Markets, shared waterworks, fermentation, and intensive garden production structure urban food supply.',
    ],
    sacredLife: [
      'Temple, shrine, household, ancestor, philosophical, and state observances coexist without a single institutional center.',
      'Ritual calendars connect family memorials, neighborhood festivals, pilgrimage, and civic legitimacy.',
    ],
    defensePattern: [
      'Walled wards, controlled gates, watch towers, granaries, and disciplined garrisons support defense in depth.',
      'Militia and professional troops are organized through districts and administrative chains.',
    ],
    socialTexture: [
      'Office, household seniority, lineage, guild membership, education, and neighborhood duty create intersecting hierarchies.',
      'Disputes often move through family, guild, or official intermediaries before becoming public contests.',
    ],
    architecturalDetails: [
      'tiled rooflines and enclosed courts create a measured rhythm along the main axis',
      'ward gates, shop fronts, and planted courtyards divide public from household space',
      'the market street terminates at an administrative or temple precinct',
    ],
    institutionBias: {
      categories: { Government: 1.08, Infrastructure: 1.08, Crafts: 1.06 },
      keywords: { granary: 1.12, guild: 1.08, school: 1.08, canal: 1.12, garden: 1.08 },
    },
  }),

  mesoamerican: profile({
    key: 'mesoamerican',
    label: 'Mesoamerican-inspired',
    scope: 'A civic-ritual plaza, tribute, market-and-waterworks design grammar.',
    builtForm: [
      'Residential compounds and gardens radiate from a raised civic-ritual precinct and broad market plaza.',
      'Causeways, terraces, canals or reservoirs connect dense neighborhoods to monumental public space.',
    ],
    civicPattern: [
      'Ward leaders, tribute officers, priestly institutions, military societies, and dynastic households divide authority.',
      'Markets and neighborhood organizations operate inside a wider system of civic labor and tribute.',
    ],
    exchangePattern: [
      'Large periodic markets, professional merchants, tribute redistribution, and specialist craft production drive exchange.',
      'Porters, canoe traffic where possible, and managed causeways move staple and prestige goods.',
    ],
    foodways: [
      'Maize, beans, squash, chile, tomatoes, greens, cacao, and locally available fish or game form the staple pattern.',
      'Intensive plots, terraces, raised fields, and market redistribution support dense populations.',
    ],
    sacredLife: [
      'Calendar rites, neighborhood temples, household offerings, pilgrimage, and civic ceremony are materially intertwined.',
      'Ritual specialists track agricultural, dynastic, and communal obligations through a public festival cycle.',
    ],
    defensePattern: [
      'Terraces, causeways, controlled approaches, fortified heights, and organized military orders shape defense.',
      'Ward levies reinforce trained warrior societies and palace guards.',
    ],
    socialTexture: [
      'Ward membership, craft specialization, market standing, tribute duty, and ritual office structure public life.',
      'Civic labor and festival obligations make the settlement a visibly collective project.',
    ],
    architecturalDetails: [
      'a raised ceremonial precinct overlooks a broad and intensely used market plaza',
      'terraces, plastered platforms, and residential compounds step with the terrain',
      'causeways and managed water divide the settlement into organized neighborhoods',
    ],
    institutionBias: {
      categories: { Religious: 1.08, Economy: 1.07, Agriculture: 1.07 },
      keywords: { market: 1.1, temple: 1.1, garden: 1.08, causeway: 1.12, reservoir: 1.1 },
    },
  }),

  south_asian: profile({
    key: 'south_asian',
    label: 'South-Asian-inspired',
    scope: 'A tank-and-bazaar, occupational-quarter, temple-and-guild design grammar.',
    builtForm: [
      'Dense bazaar streets, occupational quarters, courtyard homes, shrines, tanks, and shaded arcades interlock.',
      'A temple, court, or fortified precinct anchors neighborhoods organized around wells, workshops, and markets.',
    ],
    civicPattern: [
      'Court officers, councils, merchant and craft corporations, religious endowments, and neighborhood leaders overlap.',
      'Local assemblies and guild institutions negotiate tax, water, ritual, and occupational obligations with rulers.',
    ],
    exchangePattern: [
      'Bazaars, merchant houses, craft corporations, credit, pilgrimage, and caravan or maritime routes support exchange.',
      'Occupational specialization links rural production to dense networks of processing and resale.',
    ],
    foodways: [
      'Rice, wheat or millet, pulses, vegetables, dairy, oils, spices, and regional fruits vary with climate and water.',
      'Irrigation, tanks, market kitchens, preservation, and ritual food rules shape supply and consumption.',
    ],
    sacredLife: [
      'Temple, monastery, shrine, household, philosophical, and pilgrimage traditions share a crowded sacred landscape.',
      'Festival patronage, feeding, waterworks, education, and ritual service make sacred institutions civic actors.',
    ],
    defensePattern: [
      'Fortified precincts, gates, watch towers, protected tanks, and elephant or cavalry yards support strategic defense.',
      'Professional retainers and district levies answer through layered patrons and offices.',
    ],
    socialTexture: [
      'Occupation, neighborhood, household, guild, patronage, and religious affiliation create multiple routes to belonging.',
      'Water access, market standing, ritual service, and credit relationships are everyday political facts.',
    ],
    architecturalDetails: [
      'shaded bazaar fronts open toward tanks, wells, and neighborhood shrines',
      'carved stone, plastered courtyards, and workshop lanes layer sacred and commercial space',
      'occupational quarters cluster around shared water and market infrastructure',
    ],
    institutionBias: {
      categories: { Economy: 1.08, Religious: 1.06, Crafts: 1.08, Infrastructure: 1.06 },
      keywords: { market: 1.08, textile: 1.12, water: 1.1, temple: 1.08, caravan: 1.06 },
    },
  }),

  steppe: profile({
    key: 'steppe',
    label: 'Steppe-inspired',
    scope: 'A pastoral, mobile-sedentary, clan-and-caravan design grammar.',
    builtForm: [
      'Permanent halls, corrals, storehouses, and workshops stand beside seasonal encampment space.',
      'A fortified trade station or river town acts as the settled hinge of a much wider mobile hinterland.',
    ],
    civicPattern: [
      'Clan leaders, assemblies, military followings, trade brokers, and appointed governors negotiate authority.',
      'Political power depends on pasture access, herds, mobility, marriage alliances, and control of caravan corridors.',
    ],
    exchangePattern: [
      'Livestock, horses, felt, leather, transport, tribute, and caravan brokerage dominate exchange.',
      'Seasonal markets connect mobile producers to settled grain, metalwork, textiles, and administration.',
    ],
    foodways: [
      'Meat, dairy, fermented drinks, traded grain, hardy vegetables, and preserved travel foods form the staple pattern.',
      'Herd cycles and winter fodder matter as much as harvests to food security.',
    ],
    sacredLife: [
      'Household, ancestor, sky, land, shrine, and adopted institutional traditions coexist across mobile and settled life.',
      'Ritual authority often travels with households even when major sanctuaries anchor regional gatherings.',
    ],
    defensePattern: [
      'Mounted patrols, mobile musters, earthworks, corrals, and signal systems protect people and herds.',
      'A small permanent guard relies on rapid reinforcement from a dispersed mounted population.',
    ],
    socialTexture: [
      'Clan, household, herd ownership, alliance, military following, and hospitality obligations organize public standing.',
      'The settlement is a meeting point between mobile and sedentary expectations rather than the whole society.',
    ],
    architecturalDetails: [
      'corrals and open assembly ground occupy as much space as the permanent halls',
      'storehouses and caravan yards mark the boundary between settlement and seasonal encampment',
      'broad lanes are sized for herds, carts, and mounted movement',
    ],
    institutionBias: {
      categories: { Defense: 1.06, Economy: 1.05 },
      keywords: { stable: 1.16, horse: 1.16, caravan: 1.14, pasture: 1.12, market: 1.05 },
    },
  }),

  greek: profile({
    key: 'greek',
    label: 'Greek-inspired',
    scope: 'An agora, harbor, civic-association-and-hillside design grammar.',
    builtForm: [
      'Stone and plaster courtyard houses rise around an agora, stoas, shrines, and steep connecting lanes.',
      'A fortified high precinct overlooks the market, theater, and workshops; where geography permits, it also overlooks a working harbor.',
    ],
    civicPattern: [
      'Assemblies, magistrates, councils, patrons, sanctuaries, and civic associations compete through public office.',
      'Citizenship institutions coexist with oligarchic wealth, household patronage, and resident outsider communities.',
    ],
    exchangePattern: [
      'Maritime or regional trade, workshops, contracts, coin exchange, and public markets support the civic economy.',
      'Harbor and hinterland goods meet through brokers, associations, and tax-farming offices.',
    ],
    foodways: [
      'Grain, pulses, olives or other oil crops, wine, vegetables, cheese, and fish vary with terrain and trade.',
      'Market supply and imported grain become politically charged as population grows.',
    ],
    sacredLife: [
      'Household rites, civic festivals, sanctuaries, mystery associations, oracles, and patron cults overlap.',
      'Sacred offices and festival funding are inseparable from civic status and public memory.',
    ],
    defensePattern: [
      'Stone walls, towers, fortified heights, naval assets where relevant, and citizen or district levies provide defense.',
      'Professional guards and mercenaries supplement civic musters during prolonged threats.',
    ],
    socialTexture: [
      'Household, citizenship, association, patronage, public rhetoric, and military service define competing forms of status.',
      'The market and assembly make disagreement public, while wealth and networks shape who is heard.',
    ],
    architecturalDetails: [
      'a colonnaded market edge frames the busiest civic ground',
      'whitewashed courts and stone stairs climb toward a fortified high precinct',
      'workshops, shrines, and meeting halls crowd the approaches to the agora',
    ],
    institutionBias: {
      categories: { Government: 1.08, Economy: 1.06, Entertainment: 1.06 },
      keywords: { council: 1.08, market: 1.08, theater: 1.12, dock: 1.08, academy: 1.06 },
    },
  }),
});

export const CULTURE_PROFILE_KEYS = Object.freeze(Object.keys(CULTURE_PROFILES));

const CULTURE_ALIASES = Object.freeze({
  mediterranean: 'latin',
});

/**
 * Resolve legacy and unknown culture tokens without silently pretending an
 * unknown value is Germanic. Unknown values retain their authored token and use
 * the neutral mixed grammar; known legacy "mediterranean" maps to Latin.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function resolveCultureProfileKey(value) {
  const key = String(value || 'germanic').trim().toLowerCase();
  if (key === 'mixed') return 'mixed';
  if (CULTURE_ALIASES[key]) return CULTURE_ALIASES[key];
  return CULTURE_PROFILES[key] ? key : 'mixed';
}

/**
 * @param {readonly string[]} values
 * @param {{ pick?: (values: readonly string[]) => string } | null | undefined} rng
 * @returns {string}
 */
function choose(values, rng) {
  if (!values.length) return '';
  if (rng?.pick) return rng.pick(values) || values[0];
  return values[0];
}

/**
 * @param {string} key
 * @param {{ pick?: (values: readonly string[]) => string } | null | undefined} rng
 */
function materializeOne(key, rng) {
  const source = CULTURE_PROFILES[key] || CULTURE_PROFILES.germanic;
  return Object.freeze({
    key: source.key,
    label: source.label,
    scope: source.scope,
    builtForm: choose(source.builtForm, rng),
    civicPattern: choose(source.civicPattern, rng),
    exchangePattern: choose(source.exchangePattern, rng),
    foodways: choose(source.foodways, rng),
    sacredLife: choose(source.sacredLife, rng),
    defensePattern: choose(source.defensePattern, rng),
    socialTexture: choose(source.socialTexture, rng),
    architecturalDetail: choose(source.architecturalDetails, rng),
  });
}

/**
 * Materialize the settlement's local cultural expression. The supplied RNG is
 * expected to be a named child stream, so adding a prose variant here cannot
 * shift unrelated generation decisions.
 *
 * @param {unknown} culture
 * @param {{ pick?: (values: readonly string[]) => string } | null} [rng]
 */
export function materializeCulturalIdentity(culture, rng = null) {
  const resolvedKey = resolveCultureProfileKey(culture);
  if (resolvedKey !== 'mixed') return materializeOne(resolvedKey, rng);

  const firstKey = choose(CULTURE_PROFILE_KEYS, rng) || 'germanic';
  const remaining = CULTURE_PROFILE_KEYS.filter((key) => key !== firstKey);
  const secondKey = choose(remaining, rng) || 'latin';
  const first = materializeOne(firstKey, rng);
  const second = materializeOne(secondKey, rng);

  return Object.freeze({
    key: 'mixed',
    label: `${first.label} + ${second.label}`,
    scope: 'A locally blended design grammar; both traditions remain visible rather than collapsing into a generic fallback.',
    sourceKeys: Object.freeze([first.key, second.key]),
    builtForm: `${first.builtForm} ${second.builtForm}`,
    civicPattern: `${first.civicPattern} ${second.civicPattern}`,
    exchangePattern: `${first.exchangePattern} ${second.exchangePattern}`,
    foodways: `${first.foodways} ${second.foodways}`,
    sacredLife: `${first.sacredLife} ${second.sacredLife}`,
    defensePattern: `${first.defensePattern} ${second.defensePattern}`,
    socialTexture: `${first.socialTexture} ${second.socialTexture}`,
    architecturalDetail: `${first.architecturalDetail}; ${second.architecturalDetail}`,
  });
}

/**
 * Small, bounded institution weighting. Culture changes likelihood, never
 * eligibility: world law, tier, route, resources, and explicit toggles remain
 * the hard constraints.
 *
 * @param {unknown} culture
 * @param {unknown} category
 * @param {unknown} institutionName
 * @returns {number}
 */
export function cultureInstitutionMultiplier(culture, category, institutionName) {
  const key = resolveCultureProfileKey(culture);
  if (key === 'mixed') return 1;
  const bias = CULTURE_PROFILES[key]?.institutionBias;
  if (!bias) return 1;

  const categoryText = String(category || '').toLowerCase();
  const nameText = String(institutionName || '').toLowerCase();
  let multiplier = 1;

  for (const [candidate, weight] of Object.entries(bias.categories)) {
    if (categoryText.includes(candidate.toLowerCase())) multiplier *= Number(weight) || 1;
  }
  for (const [candidate, weight] of Object.entries(bias.keywords)) {
    if (nameText.includes(candidate.toLowerCase())) multiplier *= Number(weight) || 1;
  }

  // A profile provides texture, not destiny. Keep even stacked matches inside a
  // narrow band so the common simulation rules remain dominant.
  return Math.max(0.8, Math.min(1.3, multiplier));
}

/**
 * One compact paragraph for legacy consumers that accept only culturalNotes.
 *
 * @param {ReturnType<typeof materializeCulturalIdentity> | null | undefined} identity
 * @returns {string|null}
 */
export function culturalNotesFor(identity) {
  if (!identity) return null;
  return `${identity.socialTexture} ${identity.builtForm}`;
}
