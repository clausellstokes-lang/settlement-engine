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
import { textOf } from '../domain/facts/textOf.js';

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
 *
 * A `defensePattern` line is drawn in resolveConfig, before any institution exists, so it
 * cannot see the roster. Each line therefore names no garrison, soldiers or walls as present:
 * it says what the tradition does as a place grows (lane DEFENSE-2, 2026-11-03;
 * pinned by tests/domain/defenseRosterLines.test.js).
 */
export const CULTURE_PROFILES = Object.freeze({
  germanic: profile({
    key: 'germanic',
    label: 'Germanic-inspired',
    scope: 'A timber-and-stone, guild-and-estate design grammar.',
    builtForm: [
      { text: 'Timber-framed street houses cluster around a market green, with stone reserved for halls, bridges, and defenses.', needs: ['market', 'walls'] },
      'Farmsteads and craft yards form compact wards around a hall, church, or fortified manor.',
    ],
    civicPattern: [
      'Household heads, landed patrons, and craft associations negotiate authority through customary rights.',
      { text: 'A lordly court shares practical administration with guild officers and sworn neighborhood representatives.', needs: ['ruler: lord'] },
    ],
    exchangePattern: [
      'Guild-regulated craft production and overland fairs organize exchange.',
      { text: 'Estate dues, weekly markets, and merchant associations connect farms to specialist workshops.', needs: ['market'] },
    ],
    foodways: [
      'Grain, orchard produce, preserved meat, dairy, and ale anchor the local table.',
      'Rye or barley breads, pottage, smoked foods, and seasonal livestock products dominate ordinary meals.',
    ],
    sacredLife: [
      { text: 'Parish observance coexists with household customs, saints, oath sites, and seasonal rites.', needs: ['institution: temple'] },
      { text: 'The sacred calendar is public and institutional, while wells, groves, and family memorials retain local weight.', needs: ['institution: temple'] },
    ],
    defensePattern: [
      'Defense starts with earthworks and timber palisades and turns to gated stone only as wealth and threat increase.',
      { text: 'A militia tradition supports a smaller permanent watch or retinue.', needs: ['guardPresence'] },
    ],
    socialTexture: [
      'Household, guild, parish, and estate obligations overlap; authority is visible through office and reciprocal duty.',
      'Craft reputation and customary rights matter almost as much as formal rank in daily disputes.',
    ],
    architecturalDetails: [
      'half-timbered upper floors project above the busier lanes',
      'steep roofs, enclosed craft yards, and carved lintels mark the older wards',
      { text: 'a hall-and-market axis organizes the settlement center', needs: ['market'] },
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
      { text: 'Dense street blocks open into arcades, fountains, markets, and reused monumental precincts.', needs: ['market'] },
    ],
    civicPattern: [
      'Councils, magistrates, patrons, and legal corporations compete through offices, charters, and public works.',
      'Civic office and private patronage are intertwined; public generosity is a recognized route to influence.',
    ],
    exchangePattern: [
      { text: 'Contract, warehousing, market tolls, and notarial practice support long-distance commerce.', needs: ['market'] },
      { text: 'Urban markets aggregate agricultural estates, workshops, and regional shipping into a documented tax base.', needs: ['market', 'navigable'] },
    ],
    foodways: [
      'Bread grains, pulses, garden produce, oil or rendered fats, wine, and preserved fish form the staple pattern.',
      'Public ovens, neighborhood vendors, and shared dining customs make food distribution visibly civic.',
    ],
    sacredLife: [
      { text: 'Shrines, processions, confraternities, and formal priesthoods share the public religious calendar.', needs: ['institution: temple'] },
      'Household devotion and civic cult practice overlap in festivals, memorials, and patronage.',
    ],
    defensePattern: [
      'Where a place can pay for them, masonry defenses, watch posts, and road gates are kept as civic infrastructure.',
      { text: 'Professional guards supplement levy forces organized by district and patron.', needs: ['militia', 'guardPresence'] },
    ],
    socialTexture: [
      'Public standing is negotiated through family networks, office, clientage, law, and visible contribution to civic life.',
      'Squares and courts make politics unusually public even when decisions are settled through private patronage.',
    ],
    architecturalDetails: [
      { text: 'arcaded market fronts define the principal square', needs: ['market'] },
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
      { text: 'Market exchange operates beside tribute, fosterage, and reciprocal obligations between kin groups.', needs: ['market'] },
    ],
    foodways: [
      'Oats or barley, dairy, cattle products, woodland foods, fish, and seasonal preserves shape the table.',
      'Herding and mixed farming produce a strongly seasonal food calendar.',
    ],
    sacredLife: [
      'Sacred enclosures, wells, groves, learned keepers, and household observances form a layered ritual landscape.',
      { text: 'Ritual authority is distributed among formal sanctuaries, seasonal gatherings, and place-based customs.', needs: ['institution: temple'] },
    ],
    defensePattern: [
      { text: 'Ditches, banks, timber ramparts, and defensible hills protect clustered households.', needs: ['palisade'] },
      { text: 'War bands and kin levies assemble around a smaller retinue of experienced fighters.', needs: ['militia'] },
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
      { text: 'Shaded lanes connect inward-looking courtyard buildings, market arcades, gardens, and managed water points.', needs: ['market'] },
      { text: 'Dense masonry quarters open onto caravan courts, covered markets, bathhouses, and planted courtyards.', needs: ['market', 'institution: bathhouse'] },
    ],
    civicPattern: [
      { text: 'Judges, market officers, endowed institutions, military households, and merchant notables share administration.', needs: ['market'] },
      'Formal law and charitable endowment sit beside neighborhood mediation and courtly patronage.',
    ],
    exchangePattern: [
      { text: 'Caravan organization, brokerage, credit, warehousing, and inspected markets sustain regional exchange.', needs: ['market'] },
      'Merchant partnerships and route intelligence connect local workshops to long-distance trade.',
    ],
    foodways: [
      'Flatbreads, grains, pulses, dates or orchard fruits, dairy, spices, and irrigated garden produce anchor meals.',
      'Water access and preservation skill determine the balance between local produce and caravan-borne staples.',
    ],
    sacredLife: [
      { text: 'Daily observance, schools, charitable endowments, pilgrimage traffic, and neighborhood shrines organize sacred life.', needs: ['institution: school'] },
      { text: 'Religious institutions also support law, education, hospitality, water, and relief for travelers.', needs: ['institution: temple'] },
    ],
    defensePattern: [
      { text: 'Controlled gates, towers, citadels, and protected water infrastructure define strategic defense.', needs: ['gate'] },
      { text: 'Mounted patrols and household troops reinforce ward-based watches.', needs: ['watch'] },
    ],
    socialTexture: [
      { text: 'Neighborhood, household, legal, charitable, and commercial obligations intersect in markets and courtyards.', needs: ['market'] },
      'Hospitality, reputation, contract, and access to mediation are practical forms of social capital.',
    ],
    architecturalDetails: [
      { text: 'shaded arcades and latticed upper windows soften the market streets', needs: ['market'] },
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
      { text: 'Long halls, boat sheds, turf-roofed outbuildings, and timber yards face a landing or sheltered common.', needs: ['navigable'] },
      'A compact hall-centered settlement stretches along the best shoreline, roadstead, or defensible ridge.',
    ],
    civicPattern: [
      'Household leaders and law speakers bargain in assembly beneath a chieftain or royal representative.',
      { text: 'Authority depends on followings, ships, land, judgments, and the public distribution of wealth.', needs: ['navigable'] },
    ],
    exchangePattern: [
      { text: 'Maritime trade, seasonal voyaging, fishing, pastoral production, and portable wealth drive exchange.', needs: ['coast'] },
      { text: 'Landing places and halls serve as markets before specialized commercial institutions emerge.', needs: ['navigable'] },
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
      'Readily mobilized crews come first; ringworks, timber ramparts, and beacon systems follow where a place can man them.',
      { text: 'A warrior following provides the permanent core around which levy and ship crews assemble.', needs: ['navigable'] },
    ],
    socialTexture: [
      'Law, household reputation, reciprocal gifts, and access to ships or land structure public standing.',
      'Seasonal scarcity makes storage, mutual aid, and dependable leadership visibly political.',
    ],
    architecturalDetails: [
      'carved roof beams and long hall ridges dominate the older quarter',
      { text: 'turf roofs and timber sheds gather behind the working waterfront', needs: ['navigable'] },
      { text: 'the assembly ground sits between the principal hall and the landing', needs: ['navigable'] },
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
      { text: 'A palisaded core is surrounded by farm lanes, bathhouses, sheds, and later market streets.', needs: ['palisade', 'institution: bathhouse', 'market'] },
    ],
    civicPattern: [
      'Communal assemblies, household elders, service elites, and princely or appointed officers share authority.',
      'Collective land and labor customs coexist with tribute, estate, and court obligations.',
    ],
    exchangePattern: [
      { text: 'River trade, forest products, grain, wax, furs, and seasonal fairs connect households to wider routes.', needs: ['river'] },
      'Communal production and itinerant merchants precede more formal guild and warehouse systems.',
    ],
    foodways: [
      { text: 'Rye, millet, cabbage, mushrooms, river fish, dairy, and preserved forest foods form the staple pattern.', needs: ['river'] },
      'Fermentation, pickling, drying, and shared ovens stretch the harvest through winter.',
    ],
    sacredLife: [
      { text: 'Formal temples or churches coexist with ancestor customs, seasonal festivals, springs, and household rites.', needs: ['institution: temple'] },
      'Sacred life follows both an institutional calendar and the agricultural year.',
    ],
    defensePattern: [
      { text: 'Palisades, ditches, river barriers, and fortified compounds provide layered defense.', needs: ['palisade', 'river'] },
      'A household levy is the common defense; a retinue stands beside it only where a lord can keep one.',
    ],
    socialTexture: [
      'Household and communal labor obligations are enforced through reputation, assembly, and local office.',
      { text: 'Shared ovens, bathhouses, wells, and seasonal work make private life unusually communal.', needs: ['institution: bathhouse'] },
    ],
    architecturalDetails: [
      'painted timber fronts and enclosed garden plots line the older lanes',
      { text: 'a communal green, bathhouse, and well bind several household compounds together', needs: ['institution: bathhouse'] },
      { text: 'palisade lines and river stairs reveal successive stages of expansion', needs: ['palisade', 'river'] },
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
      { text: 'A planned civic axis links gate, market, administrative compound, temple precinct, and waterworks.', needs: ['gate', 'market', 'institution: temple'] },
    ],
    civicPattern: [
      'Administrative officers, lineage organizations, neighborhood heads, guilds, and landed patrons overlap.',
      'Written office and examination or appointment coexist with household, temple, and merchant authority.',
    ],
    exchangePattern: [
      { text: 'Regulated markets, guild brokerage, granary systems, canals or roads, and standardized records support exchange.', needs: ['market', 'institution: granary'] },
      'Merchant associations connect specialist craft wards to agricultural hinterlands and long routes.',
    ],
    foodways: [
      'Rice or millet, wheat foods, soy or pulse products, vegetables, tea, fish, and preserved condiments vary by ecology.',
      { text: 'Markets, shared waterworks, fermentation, and intensive garden production structure urban food supply.', needs: ['market'] },
    ],
    sacredLife: [
      'Temple, shrine, household, ancestor, philosophical, and state observances coexist without a single institutional center.',
      'Ritual calendars connect family memorials, neighborhood festivals, pilgrimage, and civic legitimacy.',
    ],
    defensePattern: [
      'Where the state reaches, enclosed wards, controlled gates, watch towers, granaries, and disciplined troops give defense in depth.',
      { text: 'Militia and professional troops are organized through districts and administrative chains.', needs: ['militia'] },
    ],
    socialTexture: [
      'Office, household seniority, lineage, guild membership, education, and neighborhood duty create intersecting hierarchies.',
      'Disputes often move through family, guild, or official intermediaries before becoming public contests.',
    ],
    architecturalDetails: [
      'tiled rooflines and enclosed courts create a measured rhythm along the main axis',
      'ward gates, shop fronts, and planted courtyards divide public from household space',
      { text: 'the market street terminates at an administrative or temple precinct', needs: ['market'] },
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
      { text: 'Residential compounds and gardens radiate from a raised civic-ritual precinct and broad market plaza.', needs: ['market'] },
      'Causeways, terraces, canals or reservoirs connect dense neighborhoods to monumental public space.',
    ],
    civicPattern: [
      'Ward leaders, tribute officers, priestly institutions, military societies, and dynastic households divide authority.',
      { text: 'Markets and neighborhood organizations operate inside a wider system of civic labor and tribute.', needs: ['market'] },
    ],
    exchangePattern: [
      { text: 'Large periodic markets, professional merchants, tribute redistribution, and specialist craft production drive exchange.', needs: ['market'] },
      'Porters, canoe traffic where possible, and managed causeways move staple and prestige goods.',
    ],
    foodways: [
      'Maize, beans, squash, chile, tomatoes, greens, cacao, and locally available fish or game form the staple pattern.',
      { text: 'Intensive plots, terraces, raised fields, and market redistribution support dense populations.', needs: ['population: ≥ middling'] },
    ],
    sacredLife: [
      { text: 'Calendar rites, neighborhood temples, household offerings, pilgrimage, and civic ceremony are materially intertwined.', needs: ['institution: temple'] },
      'Ritual specialists track agricultural, dynastic, and communal obligations through a public festival cycle.',
    ],
    defensePattern: [
      'Terraces, causeways, controlled approaches, fortified heights, and organized military orders shape defense.',
      { text: 'Ward levies reinforce trained warrior societies and palace guards.', needs: ['militia', 'guardPresence'] },
    ],
    socialTexture: [
      { text: 'Ward membership, craft specialization, market standing, tribute duty, and ritual office structure public life.', needs: ['market'] },
      'Civic labor and festival obligations make the settlement a visibly collective project.',
    ],
    architecturalDetails: [
      { text: 'a raised ceremonial precinct overlooks a broad and intensely used market plaza', needs: ['market'] },
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
      { text: 'Dense bazaar streets, occupational quarters, courtyard homes, shrines, tanks, and shaded arcades interlock.', needs: ['market'] },
      { text: 'A temple, court, or fortified precinct anchors neighborhoods organized around wells, workshops, and markets.', needs: ['market'] },
    ],
    civicPattern: [
      'Court officers, councils, merchant and craft corporations, religious endowments, and neighborhood leaders overlap.',
      'Local assemblies and guild institutions negotiate tax, water, ritual, and occupational obligations with rulers.',
    ],
    exchangePattern: [
      { text: 'Bazaars, merchant houses, craft corporations, credit, pilgrimage, and caravan or maritime routes support exchange.', needs: ['market'] },
      'Occupational specialization links rural production to dense networks of processing and resale.',
    ],
    foodways: [
      'Rice, wheat or millet, pulses, vegetables, dairy, oils, spices, and regional fruits vary with climate and water.',
      { text: 'Irrigation, tanks, market kitchens, preservation, and ritual food rules shape supply and consumption.', needs: ['market'] },
    ],
    sacredLife: [
      { text: 'Temple, monastery, shrine, household, philosophical, and pilgrimage traditions share a crowded sacred landscape.', needs: ['institution: temple'] },
      { text: 'Festival patronage, feeding, waterworks, education, and ritual service make sacred institutions civic actors.', needs: ['institution: temple'] },
    ],
    defensePattern: [
      { text: 'Fortified precincts, gates, watch towers, protected tanks, and elephant or cavalry yards support strategic defense.', needs: ['gate'] },
      { text: 'Professional retainers and district levies answer through layered patrons and offices.', needs: ['militia'] },
    ],
    socialTexture: [
      'Occupation, neighborhood, household, guild, patronage, and religious affiliation create multiple routes to belonging.',
      { text: 'Water access, market standing, ritual service, and credit relationships are everyday political facts.', needs: ['market'] },
    ],
    architecturalDetails: [
      { text: 'shaded bazaar fronts open toward tanks, wells, and neighborhood shrines', needs: ['market', 'institution: temple'] },
      'carved stone, plastered courtyards, and workshop lanes layer sacred and commercial space',
      { text: 'occupational quarters cluster around shared water and market infrastructure', needs: ['market'] },
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
      { text: 'Seasonal markets connect mobile producers to settled grain, metalwork, textiles, and administration.', needs: ['market'] },
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
      { text: 'Mounted patrols, mobile musters, earthworks, corrals, and signal systems protect people and herds.', needs: ['militia'] },
      { text: 'A small permanent guard relies on rapid reinforcement from a dispersed mounted population.', needs: ['guardPresence'] },
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
      { text: 'Stone and plaster courtyard houses rise around an agora, stoas, shrines, and steep connecting lanes.', needs: ['market'] },
      { text: 'A fortified high precinct overlooks the market, theater, and workshops; where geography permits, it also overlooks a working harbor.', needs: ['market'] },
    ],
    civicPattern: [
      'Assemblies, magistrates, councils, patrons, sanctuaries, and civic associations compete through public office.',
      'Citizenship institutions coexist with oligarchic wealth, household patronage, and resident outsider communities.',
    ],
    exchangePattern: [
      { text: 'Maritime or regional trade, workshops, contracts, coin exchange, and public markets support the civic economy.', needs: ['market'] },
      { text: 'Harbor and hinterland goods meet through brokers, associations, and tax-farming offices.', needs: ['coast'] },
    ],
    foodways: [
      'Grain, pulses, olives or other oil crops, wine, vegetables, cheese, and fish vary with terrain and trade.',
      { text: 'Market supply and imported grain become politically charged as population grows.', needs: ['market'] },
    ],
    sacredLife: [
      'Household rites, civic festivals, sanctuaries, mystery associations, oracles, and patron cults overlap.',
      'Sacred offices and festival funding are inseparable from civic status and public memory.',
    ],
    defensePattern: [
      'Citizen or district levies provide defense; stone enclosures, towers, fortified heights, and naval assets where relevant follow as a place grows.',
      'Professional guards and mercenaries supplement civic musters during prolonged threats.',
    ],
    socialTexture: [
      'Household, citizenship, association, patronage, public rhetoric, and military service define competing forms of status.',
      { text: 'The market and assembly make disagreement public, while wealth and networks shape who is heard.', needs: ['market'] },
    ],
    architecturalDetails: [
      { text: 'a colonnaded market edge frames the busiest civic ground', needs: ['market'] },
      'whitewashed courts and stone stairs climb toward a fortified high precinct',
      { text: 'workshops, shrines, and meeting halls crowd the approaches to the agora', needs: ['market', 'institution: temple'] },
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
 * @param {readonly (string | { text: string })[]} values a profile list (a row may be declared: R-C)
 * @param {{ pick?: (values: readonly any[]) => any } | null | undefined} rng
 * @returns {string}
 */
function choose(values, rng) {
  if (!values.length) return '';
  // R-C (CENSUS-2d): a declared row `{ text, needs?, excludes? }` gives back its text; the pick is
  // over the same array, so no roll moves. CENSUS-1e's wiring enforces the declarations.
  if (rng?.pick) return textOf(rng.pick(values) || values[0]);
  return textOf(values[0]);
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
