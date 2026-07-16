/**
 * domain/display/institutionVocabulary.js: Phase 5 Wave 1 institution vocabulary
 * side-car.
 *
 * WHY A SIDE-CAR, NOT INLINE CATALOG FIELDS. Generation spreads the whole
 * catalog def onto each institution instance ({ ...data } in cascadeGenerator /
 * assembleInstitutions) and the golden master hashes JSON.stringify(settlement)
 * WHOLE. Any field added to a catalog entry would ride the spread into output
 * and change every golden hash. So the Phase 5 vocabularies live HERE, in a file
 * that GENERATION NEVER IMPORTS: adding to it is byte-inert to the manifest.
 *
 * WHY domain/display (not src/data). This is UI-consumed content read only by
 * the lazy dossier card (institutionProfile.js). vite.config routes every
 * src/data/* file into the EAGER first-paint 'data' chunk; homing 50 kB of
 * card copy there would blow the first-paint byte budget. Co-located beside its
 * only consumer it rides the lazy InstitutionLink chunk instead. It stays a pure
 * headless leaf (imports NOTHING), so no layer boundary is crossed.
 *
 * WHAT IS READ, AND WHEN.
 *   - INSTITUTION_IDENTITY: UI-read this wave. The InstitutionCard one-liner
 *     (domain/display/institutionProfile.js -> oneLiner). Authored copy; the
 *     ONE generic identity every institution link leads to.
 *   - The four staged vocabularies (moral lean, martial role, war-supply,
 *     flavor) + the badge derivation: DATA only this wave, consumed by the
 *     Phase 5 engine-companion wave and later deity-flavored content. Nothing
 *     here perturbs generation.
 *
 * SINGLE SOURCE + DRIFT PIN. The moral/martial FORM leans that generation reads
 * stay CANONICAL in domain/worldPulse/moralMartialLean.js (a pure, import-free
 * engine leaf). INSTITUTION_MORAL_LEAN is a SUPERSET whose seed-overlap values
 * are pinned equal to that leaf by tests/data/institutionVocabulary.test.js;
 * MARTIAL_ROLE carries role TAGS while the lawful/chaotic disorder stays in the
 * leaf. So there is no second home for a value, only an extension and a pin.
 *
 * KEYS. Every key is an EXACT canonical institution name from
 * data/institutionalCatalog.js. This module imports NOTHING (headless leaf; no
 * catalog import, no cycle). This file IS the source of truth for the vocabulary;
 * edit the maps directly. tests/data/institutionVocabulary.test.js is the guard:
 * it fails on any orphan key, any institution missing an identity, any identity
 * that carries an em-dash / exclamation / no terminal period, and any moral/
 * martial drift from the engine seed. Keep new keys EXACT catalog names and run
 * that test after editing.
 */

/** @typedef {{ cruelty: number, disorder: number }} PlaneLean signed -1..+1 per axis */
/** @typedef {{ name?: string, category?: string, priorityCategory?: string }} InstLike */


/**
 * IDENTITY ONE-LINERS. Keyed by canonical catalog name. House voice: plain,
 * concrete, DM-usable, one idea per sentence, no em-dashes, no deity names.
 * Generic (settlement-agnostic): the card renders this verbatim.
 * @type {Readonly<Record<string, string>>}
 */
export const INSTITUTION_IDENTITY = Object.freeze({
  'Merchant warehouses': 'Rented storage where merchants hold goods between arrival and sale. The backbone of any settlement that lives by the trade route.',
  'Hireling hall': 'A posting house for paid help: torchbearers, porters, guides, and other non-combatants hired by the day or the job.',
  'Charlatan fortune tellers': 'Tellers of fortunes who trade in cold reading and showmanship rather than real divination. Cheap, convincing, and entirely mundane.',
  'Beast trainers': 'Handlers who break and train common animals for work, hunting, and war. Horses, hounds, and hawks, nothing exotic.',
  "Multiple adventurers' guilds": 'Rival chartered guilds that broker bounties, verify claims, and take a cut of what wanderers haul back. Competition keeps their rates honest and their rivalries loud.',
  'Mercenary quarter': 'A district given over to organized sellsword companies, from escort outfits to field regiments available for hire.',
  'Dungeon delving supply district': 'A cluster of outfitters specializing in gear for the deep places: rope, light, warding charms, and weapons that bite what ordinary steel cannot.',
  "Sage's quarter": 'A quiet district of scholars, researchers, and keepers of obscure knowledge who sell answers to those who can afford the time.',
  'Resident smith (part-time)': 'A villager who works iron between farm chores, mending tools and shoeing horses. Good enough for the ordinary, rarely for the fine.',
  'Carpenter (part-time)': 'A part-time woodworker who frames buildings and mends carts alongside other labour. The first hand called when timber needs joining.',
  "Fisher's landing": 'A rough shore landing with racks for drying and salting the catch. Where a waterside settlement turns fish into food and trade.',
  "Hunter's lodge": 'A gathering place where hunters pool game, pelts, and knowledge of the surrounding wild. Keeps the paths, the seasons, and the dangerous beasts in living memory.',
  'Charcoal burner': 'A woodland trade that slow-burns timber into charcoal, the hot clean fuel a forge and a bakery cannot do without.',
  Maltster: "A tradesman who steeps and dries grain into malt, the raw material of ale. The brewer's necessary supplier.",
  'Peat cutter': "A seasonal trade cutting and drying peat from the marsh for winter fuel. Poor country's answer to firewood.",
  'Stable yard': 'A working yard where travellers leave and hire horses, with fodder, farriery, and a hand who knows the roads.',
  'Mine (open cast)': 'A shallow surface working that scrapes ore, coal, or stone from the ground. Hard, dirty labour for the poorest hands.',
  'Stone quarry': 'A worked face where crews cut and dress building stone. Slow, heavy work that supplies every wall and foundation for miles.',
  'Pack animal trader': 'A dealer in mules, donkeys, and draft beasts who also hires out load-carriers to those bound for the road.',
  'Dairy farmer': 'A holder of cattle or goats kept for milk, butter, and cheese. A steady source of fat and protein when grain runs short.',
  Shepherd: "A keeper of flocks who moves sheep between winter and summer pasture for wool and meat. The textile trade begins at the shepherd's crook.",
  'Salt works': 'A works that evaporates brine into salt, the preservative that keeps meat and fish through the lean season. Viable only near flats or salt springs.',
  Mill: "A water or wind mill that grinds the district's grain, usually under a monopoly. The miller holds a chokehold on bread and is resented for it.",
  Blacksmith: 'A full-time worker of iron who forges and mends the tools, fittings, and blades a community runs on.',
  Carpenter: 'A full-time woodworker who raises houses, builds carts, and makes furniture. Present wherever timber is worked in earnest.',
  Thatcher: 'A roofer who lays and mends thatch, the common covering for house and barn. Skilled work that keeps the weather out.',
  Cooper: "A maker of barrels, casks, and tubs. Nothing is stored or shipped in bulk without the cooper's watertight staves.",
  Apothecary: 'A seller of herbal remedies, poultices, and common cures who works no magic. Knows which roots heal and which mushrooms kill.',
  'Bowyer & fletcher': 'A craftsman who makes bows, crossbows, and arrows and stocks finished shafts by the sheaf. First stop for an empty quiver.',
  Sawmill: 'A powered saw that turns logs into planks and beams, feeding the building and furniture trades faster than any pit-saw.',
  Mine: 'An organized shaft or excavation drawing ore, coal, or stone from deposits. Needs capital and coordination a small settlement cannot muster.',
  Tannery: 'A works that turns raw hides into leather with bark and lime. Foul-smelling and always placed downstream and downwind.',
  Fuller: 'A finisher who cleans and thickens woven cloth, often by water power, turning loose weave into hard-wearing fabric.',
  Dyer: 'A tradesman who colours cloth and yarn. Without the dyer, everything stays the grey of undyed wool.',
  Potter: 'A maker of fired clay vessels for the kitchen and store: plates, jugs, and crocks turned on the wheel and baked in a kiln.',
  Brickmaker: 'A moulder and firer of clay bricks, the material of permanent building. Needs good clay and steady fuel.',
  Brewer: 'A brewer of ale in quantity for alehouses and households. After the baker, the largest buyer of grain in any town.',
  'Stable master': 'A keeper of stabling who trains and boards horses for riding and draft. Essential to any settlement on a road.',
  Beekeeper: 'A keeper of hives for honey and beeswax. Honey sweetens the table, and wax makes candles, seals, and polish.',
  Fishmonger: 'A dealer who buys, salts, and sells fish, standing between the boats and the table. Fresh near water, cured inland.',
  Cobbler: 'A maker and mender of shoes and boots. Steady, universal work, since every person needs something on their feet.',
  Tailor: 'A cutter and sewer of garments from finished cloth, serving the middling sort between home needle and master clothier.',
  Midwife: 'The attendant at births who manages hard labours and tends new mothers. The most used healer in any community.',
  'Village scribe': 'One of the few who can read and write, hired to copy letters, draft contracts, and read documents aloud for the unlettered.',
  Wildfowler: 'A hunter of ducks, geese, and marsh birds with net, trap, and trained fowl, supplying the market with feathered game.',
  Woodcarver: 'A carver who shapes wood into tool handles, furniture, and sacred figures. Handles both the useful and the devotional.',
  "Cartographer's workshop": 'A workshop that draws and sells maps, from road charts to rough sketches of the wild. Rare enough that most places have none.',
  'Mills (2-5)': 'Several mills grinding grain and fulling cloth, the sign of a settlement large enough to need more than one wheel.',
  'Blacksmiths (3-10)': "Several smiths, some specialized, working iron for a whole town's tools, fittings, and arms.",
  'Carpenters (5-15)': "A body of woodworkers handling a town's construction and furniture at a scale beyond any single hand.",
  'Weavers/Textile workers': 'Cloth-makers, often guild-organized, turning spun fibre into woven fabric for local use and trade.',
  Tanners: 'Leatherworkers who cure hides at scale. Their reek keeps them downstream and downwind of everyone else.',
  'Butchers (3-8)': 'Regulated slaughterers and meat-sellers who dress carcasses and supply the market under strict rules of cleanliness.',
  'Bakers (5-15)': "Guild-regulated bakers who bake the town's daily bread at fixed weights and prices.",
  'Apothecary (established)': "A proper apothecary's shop with trained staff, stocked shelves, and a back room for consultations. Some also set bones and dress wounds.",
  'Bowyers & fletchers (guild)': 'A guild of bow and arrow makers producing ammunition by the sheaf and arms to commission. Restocks caravans and outfits militias.',
  Smelter: 'A furnace works that refines raw ore into workable metal, the industrial step between the mine and the smithy.',
  'Sawmill (commercial)': 'A commercial powered mill cutting planks and beams for the building trade at regional scale, with a permanent crew.',
  Brewery: 'A commercial brewhouse supplying taverns and regional trade. A major employer and a heavy consumer of grain.',
  'Tanner (established)': 'A full tannery with many vats and trained hands, producing quality leather for footwear, armour, and harness.',
  "Cobbler's guild": 'An organized body of shoemakers producing footwear for a whole town under regulated standards.',
  "Tailor's guild": 'A guild of master clothiers turning finished cloth into everything from work clothes to livery.',
  Chandler: 'A maker of candles, soap, and rope from tallow and similar stock. The trade that keeps a town lit and clean.',
  Glassblower: 'A worker of molten glass into bottles, panes, and vessels. Needs fine sand, potash, and a skilled hand at the furnace.',
  Mint: 'A chartered works that strikes refined metal into standard coin. A licence from the crown or a lord and a steady source of revenue.',
  'Town crier': 'The official voice of the town, calling proclamations, prices, and news in the square at set hours.',
  Ropemaker: 'A twister of fibre into rope and cordage, indispensable to ships, building sites, and farms alike.',
  'Specialized metalworkers': 'Separate guilds of armourers, swordsmiths, and jewellers whose fine metalwork goes beyond the common smith.',
  'Luxury goods quarter': 'A district trading in silks, spices, and precious goods for those with coin to burn.',
  'Printing house': 'A press turning out books and broadsheets in numbers no scribe could match, where the craft is known.',
  Glassmakers: 'Skilled makers of windows, vessels, and mirrors. Demanding work that only a sizable centre can support.',
  'Craft guilds (100-150+)': 'A guild for nearly every conceivable trade, the mark of a great city where specialization has run to its limit.',
  'Local fence': 'Someone who quietly buys goods without asking their origin. Everyone knows who; no one says it aloud.',
  'Outlaw shelter': 'A discreet arrangement that hides people who need to disappear. A barn, a cellar, and a habit of not asking.',
  'Fence (word of mouth)': 'A buyer of stolen goods known by face rather than name, through whom hot property moves without a word written down.',
  'Bandit affiliate': 'A household or two tied to the bandits who work the surrounding roads, trading shelter and information for a share.',
  'Smuggling waypoint': 'A stop where goods pass to dodge tolls and customs, paid for in a cut of the cargo.',
  'Smuggling network': 'A run of quiet hands moving a particular commodity past tolls and inspection. Usually built around one lucrative good.',
  'Street gang': 'An organized band of pickpockets and toughs who claim a patch of streets and take their tribute from it.',
  'Smuggling operation': 'An organized trade in untaxed and illicit goods that lives on evading the customs house.',
  'Front businesses': 'Legitimate-looking shops and trades that launder coin and cover for what really pays the rent.',
  "Thieves' guild chapter": 'A chartered chapter of organized theft that regulates its members, fences their takings, and enforces its own law.',
  'Multiple criminal factions': 'Rival gangs contesting the same streets, whose turf disputes spill into open violence.',
  'Black market': 'A hidden trade in contraband and forbidden goods, meeting where the watch does not look.',
  'Underground network': 'A dug warren of tunnels and cellars beneath the settlement, used for discreet passage, untaxed storage, and no-questions transport. Everyone knows it exists; no one holds a map.',
  'Contract killer': 'A lone killer or small cell working below the notice of any guild, hired through criminal go-betweens. Deniable and never reliable.',
  'Kidnapping ring': 'A crew that seizes free people and sells them on with forged papers, feeding whatever market will take them.',
  'Human trafficking network': 'A clandestine operation moving people across borders outside all law, with its own safe houses and bought officials.',
  "Thieves' guild (powerful)": 'A dominant criminal syndicate tolerated because open gang war would be worse. It taxes crime and keeps it quiet.',
  'Black market bazaar': 'A permanent underground market for contraband, forged documents, and services no lawful trade will touch.',
  'Underground city': 'Repurposed tunnels and catacombs sheltering criminals, refugees, and everything that needs to stay out of daylight.',
  "Assassins' guild": 'A professional order of killers working through cut-outs and cover, acknowledged by no one and used by many.',
  'Citizen militia': 'Ordinary residents who drill and muster against local threats. Part-time soldiers with their own tools and no pay.',
  'Palisade or earthworks': 'A wooden palisade or earthen bank thrown up to slow raiders and beasts. Rough defence for a place that cannot afford stone.',
  "Veteran's lodge": 'A drinking hall for old soldiers and mercenaries. Informal muscle, tall tales, and the occasional job for a band that needs swords.',
  'Town walls': 'Stone walls and gates ringing a town. Costly to raise and costly to keep, but they decide who gets in.',
  'Town watch': 'Part-time guards who walk the night and hold the gates. Keepers of order rather than a fighting force.',
  'Gates (if walled)': 'Controlled entry points in the wall, manned by gatekeepers who decide what passes and what waits outside.',
  Barracks: "Quarters for the town's guards or a small garrison. Where the armed hand of the settlement sleeps and eats.",
  'Free company hall': 'A billet and contracting office for professional soldiers between campaigns. Trained men who fight in formation for wages, not plunder.',
  'City walls and gates': 'Masonry walls with towers and gatehouses ringing a city. The single largest thing most cities ever build.',
  'Professional city watch': 'A full-time force that polices a city day and night, roughly one in a hundred of its people under arms.',
  Garrison: 'Professional soldiers kept under a noble or royal banner, stationed to hold a place against real armies.',
  Citadel: 'An inner fortress and last refuge, built to hold when the outer walls have fallen.',
  'Massive walls and fortifications': 'Layered wall systems with outer rings, inner keep, and distributed garrisons. A metropolis armoured against the age of siege.',
  'Multiple garrisons': 'Soldiers stationed in separate quarters, because no single barracks can hold a city this size.',
  'Access to external mill': "No mill of its own; the grain is carried to a manor or village wheel, often under a lord's monopoly.",
  'Subsistence farming': 'Households farming just enough to feed themselves, with little or nothing left to trade.',
  'Fishing community': 'A settlement whose living comes off the water, built around nets, traps, and drying racks.',
  'Shepherd collective': 'A community that manages its flocks in common and moves to the rhythm of the grazing calendar.',
  "Woodcutter's camp": 'A seasonal camp felling and stacking timber. The whole place runs on the cut and the haul.',
  Alehouse: 'Ale brewed and sold from a back room, doubling as the gathering place where news and disputes are settled.',
  'Wayside inn': 'A room over the stable and a hot meal for those passing through. It exists only because the road does.',
  Caravanserai: 'A walled waystation offering water, fodder, and safe lodging to merchants and their animals. Without one, hard country cannot be crossed.',
  'Periodic market': 'An occasional trading day held by habit rather than charter, on any flat ground that will hold a crowd.',
  Pawnbroker: 'A lender against pledged goods at steep interest and no questions. Often the only credit a poor household can find.',
  'Common grazing land': "Shared pasture held in common, where the community's livestock feed.",
  Farmland: 'Open-field farmland worked in rotation, the ordinary agricultural base of a settled village.',
  "Travelers' inn": 'A single inn with rooms, stabling, and a common meal for traders and pilgrims on the road.',
  'Weekly market': 'A chartered market held once a week where the district buys and sells its produce and goods.',
  'Ale house': 'A household brew sold on the premises, most often by the women who make it.',
  'River ferry': 'A flat ferry and the family that has held the crossing rights for generations. The short way over water for those who will pay.',
  'River boatyard': 'A yard that builds and mends shallow river craft: barges, punts, and ferries fitted for flat water.',
  'Fish market': "A stall or small covered market selling the day's catch, where prices fall fast because fish will not wait.",
  'Toll bridge': 'A bridge with a toll house whose keeper takes passage fees and does the small repairs. Minor but steady coin.',
  Waystation: 'A fortified overnight stop with stabling, water, and provisions, built for caravans and loaded wagons rather than comfort.',
  'Town granary': 'Communal grain storage that buffers the harvest and holds off famine in a bad year.',
  'Market square': 'The central plaza where weekly markets and fairs are held, the commercial heart of a town.',
  'Annual fair': 'A yearly gathering that draws regional merchants and luxury goods a weekly market never sees.',
  'Merchant guilds (3-8)': 'A handful of merchant guilds that control trade in particular goods and set their own terms.',
  'Craft guilds (5-15)': "Guilds that regulate quality, prices, and apprenticeship across a town's trades.",
  'Money changers': 'Dealers who exchange foreign coin and lend at interest, the seed of banking in a growing town.',
  'Inn (multiple)': 'Several inns lodging the traders who pass through, a sign of real traffic on the roads.',
  'Taverns (5-20)': 'A spread of drinking houses that serve as the everyday social hubs of a busy town.',
  'Docks/port facilities': 'River or coastal docks for loading bulk cargo. The gateway for anything that moves by water.',
  "Carriers' guild": 'A guild of professional carters and teamsters who move goods overland for hire and know every road and toll.',
  'Coaching inn': 'A road inn built around relay horses and scheduled coaches, with fixed meals and a room for waiting passengers.',
  'Public bathhouse': 'A communal bathing house with heated water. A social hub in some cultures, a suspect one in others, and the best place for rumour in either.',
  "Carriers' hiring hall": 'A yard where carters and pack-drivers are hired for the road, and returning ones trade news of its conditions.',
  Shipyard: 'A yard that builds and repairs seagoing merchant ships. A heavy investment demanding timber, iron, and shipwrights.',
  'Slave market': 'A public auction of enslaved people, run openly where the law permits it as ordinary commercial business.',
  'Assay office': 'An office that tests the purity of precious metal for a fee. Necessary groundwork for banking and coinage.',
  'Customs house': 'The office that levies duties on goods moving through the port and roads, run by royal or town officials.',
  'Post relay station': 'A stable of relay horses that carries letters and small packages faster than any traveller on foot.',
  'Stable district': 'A quarter of concentrated stabling, horse trading, and farriery serving merchants, soldiers, and riders.',
  "Caravaneer's post": "A post that assembles caravans, sets departures, and sells route intelligence. The town-scale forerunner of a city's caravan exchange.",
  Jeweller: 'A worker of precious metal and gems into rings, seals, and finery, who also appraises stones and sometimes buys quiet goods.',
  Vintner: 'A maker and cellarer of wine, selling in bulk to taverns and by the bottle to the wealthy. Inland, an importer and blender.',
  'City granaries': 'Multiple large, state-managed grain stores that feed a city and hold against shortage.',
  'Multiple market squares': 'Several permanent market squares serving different districts of a large city.',
  'Daily markets': 'Markets that trade every day in several places at once, the mark of a true urban economy.',
  'Inns and taverns (district)': 'Whole districts of inns and taverns catering to merchants, travellers, and long-staying visitors.',
  'Major annual fairs': 'Great fairs drawing international merchants where letters of credit change hands alongside goods.',
  'Banking houses': 'Houses that lend, exchange coin, and issue letters of credit. Real banking, viable only at city scale.',
  'Merchant guilds (15-40)': 'Powerful merchant guilds whose reach makes them a political force in city affairs.',
  'Craft guilds (30-80)': 'Guilds of extreme specialization, down to the gold-beater and the mirror-maker.',
  'Warehouse district': 'A district of warehouses holding merchant goods between shipment and sale.',
  'Barge and river transport company': 'A company running a fleet of river barges on set and hired routes, carrying bulk cargo, passengers, and supply.',
  "Caravan masters' exchange": 'Permanent offices where caravan masters, merchants, and armed escorts do business: bonded freight, route news, and convoy assembly.',
  'Slave market district': 'A licensed district for commerce in people, with auction halls, holding compounds, and the brokers and clerks that serve them.',
  "Cartographer's guild": "A guild producing the region's most accurate maps and charts, off the shelf or to commission.",
  'Apothecary district': 'A cluster of competing apothecaries whose rivalry breeds specialists in surgery, herbs, and imported medicine.',
  'Mint (official)': 'A chartered mint striking standard coin for a region, and a steady source of revenue for the authority behind it.',
  'Auction house': 'A formal venue for selling high-value goods: estates, ships, art, livestock, and occasionally people, all on a premium.',
  "Harbour master's office": 'The office that governs a port: berths, anchorage fees, and the enforcement of maritime law.',
  "Furrier's district": 'A quarter of fur processors and traders dealing in a high-value luxury good.',
  'District markets (5-10)': 'Several specialized market districts, each given over to one thing: grain, cloth, metals, livestock, or exotica.',
  'Merchant guilds (50-100+)': 'Dozens of merchant guilds forming, in effect, a parliament of trade.',
  'Banking district': 'A whole financial quarter of international banks, letters of credit, and currency speculation at scale.',
  'International trade center': 'A hub for foreign merchant houses, trade arbitration, and commodity exchange.',
  'State granary complex': 'A state-run network of granaries holding strategic reserves against war and famine.',
  'Traveling performers': 'Bards, jugglers, and acrobats who arrive for the fairs and move on when they end.',
  'Gambling den': 'A back-room trade in dice, cards, and small games of chance, and the debts they breed.',
  'Gladiatorial school': 'A school that trains fighters for the arena, drawing on prisoners, debtors, and the desperate. It feeds the blood-sport circuit.',
  'Hired blades': 'Professional fighters for private hire: bodyguard work, debt collection, and the quiet removal of problems.',
  Brothel: 'A tolerated or regulated house of prostitution.',
  Theaters: 'Permanent venues for staged performance, the sign of a city with leisure and coin to spend on it.',
  'Gambling halls': 'Dedicated houses of chance, some licensed and some not, where fortunes turn on a roll.',
  'Brothel (red light district)': 'A tolerated quarter of prostitution set apart from respectable trade.',
  'Fighting pits': 'Underground venues for illegal or barely-legal blood sport, hidden from the authorities that would close them.',
  'Multiple theaters': 'Several standing theatres worked by professional companies, a mark of urban culture.',
  'Colosseum/arena': 'A great arena for gladiatorial games and beast fights, staged at a scale meant to awe a whole city.',
  'Red light district': 'A large, organized quarter given over to the sex trade.',
  'Gambling district': 'A concentration of gaming houses, run under whatever oaths and enforcement keep the play honest.',
  'Opera house': 'A venue of high culture and elite patronage, where wealth displays itself as much as the performance.',
  'Bardic college': 'A formal school of music and performance, with an amphitheatre and dormitories, viable only in a large city.',
  'Planar traders': 'Merchants dealing in goods from other planes of existence, where such traffic is possible.',
  'Dragon resident': 'An ancient wyrm dwelling within the city, whose presence shapes its politics, its fears, and its fortunes.',
  'Golem workforce': 'Constructed servants doing the labour of many, where magic permits their making.',
  'Undead labor': 'Animated corpses set to work. Efficient, tireless, and deeply divisive wherever it is practised.',
  'Dream parlors (high magic)': 'Parlours selling shared and lucid dreams through high magic, for experience or for private communion.',
  'Airship docking (high magic)': 'Mooring towers with warded weather protection for airships, the infrastructure of a sky-trading power.',
  'Message network (high magic)': 'A network of paired sending stones carrying words across great distance for a fee.',
  'Informal elder consensus': 'The eldest or most respected residents guide shared decisions by consensus, without office or title.',
  'Head-of-household consensus': 'Every household head holds an equal voice on common matters. Slower to decide, but broadly shared.',
  "Lord's reeve": 'A steward set over the settlement by a distant lord to collect and oversee. His authority is real and often resented.',
  'Household elder': 'One household head speaks for the settlement by common acknowledgement, with no formal appointment behind it.',
  "Lord's steward": "A lord's agent who manages the land, gathers rents, and enforces noble authority on the ground.",
  'Village headman': 'A single respected figure who acts as authority by acknowledgement rather than election. Decisions are practical, not formal.',
  'Village reeve': 'An officer chosen from the peasantry who organizes labour, settles disputes, and answers to outside authority for the village.',
  'Village elder': 'The oldest or most respected resident who guides decisions where no formal office exists.',
  'Mayor and council': "Elected or appointed leadership governing a town's civic affairs.",
  'Guild governance': 'The guilds run the town, with guildmasters seated on the council and trade interests setting policy.',
  "Lord's appointee": 'An official placed by a lord to govern, whose noble mandate overrides local custom.',
  'Town council': 'An informal council of prominent citizens managing town affairs where no chartered government exists.',
  'Guild consortium': 'A consortium of guild masters holding effective civic power over a city.',
  'Noble governor': 'A royal or ducal appointee governing the city as a noble fief.',
  'Merchant oligarchy': 'Wealthy merchant families holding civic power, where office is effectively bought.',
  'City-state government': 'A city that governs itself and its territory as an independent polity, owing no higher lord.',
  'Democratic assembly': "A citizen assembly holding formal authority, debating and voting on the city's major questions.",
  'Royal seat': 'A city administered directly for the crown by a governor or viceroy. High status and high scrutiny.',
  'City administration': 'A working apparatus of officials, clerks, and ward officers running city affairs by bureaucratic routine.',
  'Palace/government complex': 'The seat of state government, with palace, ministries, and audience halls in one great complex.',
  'Multiple court buildings': 'Separate courts, commercial, criminal, appellate, and religious, sitting at once in a great city.',
  'Dwellings (4-16)': 'A cluster of simple homes in wattle and timber, a room or two to a household.',
  'Water source': 'The well or spring the settlement drinks from. Everything else depends on it.',
  Palisade: 'A ring of sharpened stakes offering the least defence that still deters a casual raider.',
  'Communal root cellar': 'A shared underground store for grain, roots, and preserved food. The buffer that carries a place through a bad harvest.',
  'Dwellings (17-80)': 'Timber-framed, thatch-roofed homes, the housing stock of a small growing settlement.',
  'Multiple water sources': 'Wells and springs spread through the settlement, so no single failure leaves it dry.',
  'Dwellings (80-180)': 'Timber homes on stone foundations, the housing of an established village.',
  'Town hall': "A meeting place and administrative centre where a town's civic business is done.",
  Courthouse: 'A borough court where local justice is heard and judgement handed down.',
  'Small prison/stocks': "Holding cells and public stocks for the town's offenders. Confinement and open shame in one.",
  'Housing (180-1000 structures)': "Multi-storey timber and stone housing packed for a town's growing population.",
  'City hall': "An imposing civic building that houses a city's government and announces its importance.",
  'Multiple courthouses': "Separate commercial, criminal, and religious courts, because one bench cannot hear a city's business.",
  'Large prison': 'A sizable gaol holding debtors, criminals, and political prisoners together.',
  Workhouse: 'A house where the able-bodied poor are given shelter and food in return for hard, compulsory labour. Kept deliberately harsh to discourage dependence.',
  'Sewage system': 'Underground drainage carrying waste away from the streets. Rare, costly, and worth more than its cost in lives.',
  'Housing (1000-5000 structures)': "Dense multi-storey housing and tenements packing a city's population, poorest at the bottom.",
  'Aqueduct or water system': 'Engineered conduits, cisterns, and fountains bringing clean water into a city from beyond it.',
  'Massive prison': 'A state prison complex holding political prisoners, debtors, and criminals in separate wards.',
  'Advanced water infrastructure': "Multiple aqueducts, cisterns, and fountains managing a metropolis's water at scale.",
  'Traveling hedge wizard': 'A wandering caster of the simplest spells who passes through now and then. Present only in passing.',
  "Adventurers' charter hall": 'A rough hall under a regional adventuring charter that posts bounties, shelters monster hunters, and rallies defence when the garrison cannot. Common on hard frontiers.',
  'Hedge wizard': 'A resident caster of modest power who handles the small magics a community occasionally needs.',
  'Druid Circle': 'A circle of druids bound to the land who mind the seasons, the clean streams, and the peace with wild things.',
  'Healer (divine, 1st level)': 'A resident able to mend wounds and sickness through modest divine healing. Rare and valued where it is found.',
  "Wizard's tower": 'The residence and workshop of a single wizard of real ability, viable only where a place is large enough to want one.',
  'Elder Grove Council': "A council of senior druids that governs their circle's dealings with a city, tending hidden groves and speaking for wild places.",
  'Alchemist shop': 'A shop selling potions and alchemical goods, from healing draughts to useful reagents.',
  "Warden's Lodge": 'A ranger station or druid waypost that watches the surrounding wild, keeps the trails, and turns scout in a crisis.',
  'Teleportation circle': 'A rare permanent circle for instant travel, ruinously expensive to build and to keep working.',
  "Mages' guild": 'An organized body of spellcasters that trains, licenses, and polices the arcane within a city.',
  'Alchemist quarter': 'A quarter of alchemical workshops under guild organization, producing potions and compounds at scale.',
  "Enchanter's shop": 'A workshop that crafts magic items, viable only in a large and wealthy city.',
  'Scroll scribe': 'A scribe who prepares and sells spell scrolls, from cheap cantrips to costly higher magic.',
  'Academy of magic': 'A formal institution of arcane learning with a full curriculum, research halls, and visiting scholars.',
  "Mages' district": 'A whole quarter of arcane practitioners: towers, workshops, libraries, and reagent merchants.',
  'Great library': 'The largest store of knowledge for a great distance, holding thousands of volumes and archives.',
  'Planar embassy': 'A standing diplomatic mission from a planar power, dealing in trade, intelligence, and the occasional intervention.',
  'Wayside shrine': 'A simple prayer marker at the roadside with no resident clergy. A place to pause and ask for safe passage.',
  'Access to parish church': 'No church of its own; worshippers walk a few miles to the nearest village church for services.',
  'Parish church': 'The stone-built centre of village life, funded by mandatory tithes and marking every birth, marriage, and death.',
  'Village musician': 'A resident singer or piper who plays the festivals and weddings and carries local history in song.',
  'Priest (resident)': "The settlement's resident clergyman, who performs the rites, collects the tithe, and is often its only literate soul.",
  Graveyard: 'Consecrated ground about the church where the dead are laid.',
  'Parish churches (2-5)': 'Several parish churches, each serving its own quarter of a town.',
  'Monastery or friary': 'A religious community of monks or friars, often running a hospital or school alongside its devotions.',
  'Small hospital': 'A modest house caring for the sick poor, almost always run by a religious order.',
  Almshouse: 'A charitable house sheltering the destitute, the aged, and the disabled who cannot work, funded by endowment and pious donation.',
  'Cathedral (10,000+ only)': "A bishop's seat and the mark of a major city, viable only where the population is large enough to sustain it.",
  'Multiple monasteries': 'Several monastic houses of different orders, each with its own rule and work.',
  'Major hospital': 'A large facility caring for the sick poor, with beds by the score and religious backing.',
  'Foundling home': 'A house that takes in abandoned infants and raises them until they can be placed or apprenticed. Often a wheel in the wall allows a child to be left unseen.',
  'Parish churches (10-30)': 'A parish church for every neighbourhood, so no one lives far from a bell.',
  'Parish churches (50-100+)': 'Hundreds of parish churches across every district, the faith woven into each neighbourhood.',
  'Great cathedral': "A metropolitan cathedral and the seat of the region's highest religious authority, drawing pilgrims from afar.",
  'Major monasteries (5-10)': 'Several great monastic houses whose scholarly, contemplative, and charitable work runs at scale.',
  'Hospital network': 'Multiple hospitals and infirmaries across a metropolis, organized medical care at population scale.',
  // W-C3 item 1: the MORAL FOUNDING set (lifecycle-only, raised post-generation by the
  // patron seat; keyed in the founding catalog, never in the generation catalog).
  Hospice: 'A house of care for the dying and the incurably ill poor, kept by the faithful. No one is turned away for want of coin.',
  Orphanage: 'A house that takes in parentless children and raises them until they can be apprenticed or placed. Order and mercy under the temple hand.',
  'House of healing': 'A free infirmary that tends the sick and injured poor without fee. Mercy made into a standing institution.',
  'Fighting pit': 'A ring where the desperate and the enslaved fight for a paying crowd. Blood for coin, rowdy and cruel.',
  "Debtors' yard": 'A walled yard where those who cannot pay are worked until their debt is cleared. Sanctioned harshness, orderly and profitable.',
});

/**
 * MORAL PLANE LEAN {cruelty, disorder}, signed -1..+1. Staged data. The
 * seed-overlap with moralMartialLean.js is pinned equal; the rest extends the
 * plane to the fuller catalog (courts/gaols lawful-not-evil; charity the mercy
 * pole; vice disorder-led). Absent = neutral {0,0}.
 * @type {Readonly<Record<string, PlaneLean>>}
 */
export const INSTITUTION_MORAL_LEAN = Object.freeze({
  'Slave market': { cruelty: 0.9, disorder: -0.4 },
  'Slave market district': { cruelty: 0.9, disorder: -0.4 },
  Workhouse: { cruelty: 0.5, disorder: -0.5 },
  'Colosseum/arena': { cruelty: 0.55, disorder: 0.85 },
  'Fighting pits': { cruelty: 0.55, disorder: 0.85 },
  'Gladiatorial school': { cruelty: 0.55, disorder: 0.85 },
  Almshouse: { cruelty: -0.7, disorder: -0.2 },
  'Red light district': { cruelty: 0.2, disorder: 0.6 },
  'Brothel (red light district)': { cruelty: 0.2, disorder: 0.6 },
  'Gambling den': { cruelty: 0.1, disorder: 0.7 },
  'Gambling halls': { cruelty: 0.1, disorder: 0.7 },
  'Gambling district': { cruelty: 0.1, disorder: 0.7 },
  Brothel: { cruelty: 0.2, disorder: 0.6 },
  'Kidnapping ring': { cruelty: 0.85, disorder: 0.5 },
  'Human trafficking network': { cruelty: 0.9, disorder: 0.4 },
  'Contract killer': { cruelty: 0.7, disorder: 0.3 },
  "Assassins' guild": { cruelty: 0.7, disorder: 0.1 },
  'Hired blades': { cruelty: 0.35, disorder: 0.25 },
  'Street gang': { cruelty: 0.3, disorder: 0.6 },
  'Multiple criminal factions': { cruelty: 0.35, disorder: 0.7 },
  'Undead labor': { cruelty: 0.5, disorder: 0.2 },
  'Black market': { cruelty: 0.2, disorder: 0.7 },
  'Black market bazaar': { cruelty: 0.2, disorder: 0.7 },
  'Small hospital': { cruelty: -0.6, disorder: -0.1 },
  'Major hospital': { cruelty: -0.6, disorder: -0.1 },
  'Hospital network': { cruelty: -0.6, disorder: -0.1 },
  'Foundling home': { cruelty: -0.6, disorder: -0.1 },
  'Monastery or friary': { cruelty: -0.3, disorder: -0.2 },
  'Multiple monasteries': { cruelty: -0.3, disorder: -0.2 },
  'Major monasteries (5-10)': { cruelty: -0.3, disorder: -0.2 },
  Courthouse: { cruelty: 0, disorder: -0.6 },
  'Multiple courthouses': { cruelty: 0, disorder: -0.6 },
  'Multiple court buildings': { cruelty: 0, disorder: -0.6 },
  'Small prison/stocks': { cruelty: 0.1, disorder: -0.6 },
  'Large prison': { cruelty: 0.1, disorder: -0.6 },
  'Massive prison': { cruelty: 0.1, disorder: -0.6 },
  // W-C3 item 1: the MORAL FOUNDING set. These values are the SINGLE SOURCE shared with
  // domain/worldPulse/foundingCatalog.js (the founding-lane engine coding); pinned equal
  // by tests/data/institutionVocabulary.test.js. Where a name also matches the frozen
  // moralMartialLean regex (Hospice, Fighting pit, Almshouse-above) the value is identical
  // to it, so a founded instance reads the same lean by stamp or by name.
  Hospice: { cruelty: -0.8, disorder: -0.1 },
  Orphanage: { cruelty: -0.7, disorder: -0.2 },
  'House of healing': { cruelty: -0.6, disorder: -0.1 },
  'Fighting pit': { cruelty: 0.55, disorder: 0.85 },
  "Debtors' yard": { cruelty: 0.6, disorder: -0.6 },
});

/**
 * MARTIAL ROLE TAGS. The role an institution plays in readiness/supply; the
 * lawful/chaotic FORM (disorder) stays canonical in moralMartialLean.js.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const INSTITUTION_MARTIAL_ROLE = Object.freeze({
  'Citizen militia': ['militia'],
  'Palisade or earthworks': ['fortification'],
  Palisade: ['fortification'],
  'Town walls': ['fortification'],
  'Gates (if walled)': ['fortification'],
  'City walls and gates': ['fortification'],
  'Massive walls and fortifications': ['fortification'],
  Citadel: ['fortification'],
  "Veteran's lodge": ['irregular', 'veterans'],
  'Town watch': ['watch'],
  'Professional city watch': ['watch'],
  Barracks: ['garrison'],
  Garrison: ['garrison', 'standing'],
  'Multiple garrisons': ['garrison', 'standing'],
  'Free company hall': ['mercenary', 'irregular'],
  'Mercenary quarter': ['mercenary', 'irregular'],
  'Hired blades': ['mercenary', 'irregular'],
  'Contract killer': ['irregular'],
  "Assassins' guild": ['irregular'],
  "Adventurers' charter hall": ['irregular', 'adventuring'],
  "Multiple adventurers' guilds": ['irregular', 'adventuring'],
  'Hireling hall': ['irregular', 'support'],
  'Gladiatorial school': ['training'],
});

/**
 * WAR-SUPPLY WEB membership. Which link of the ore -> smelting -> weapons /
 * leather / horses / timber -> siege / provisioning / medicine / irregular
 * chain an institution supplies. Staged for the deployed-quality tilt.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const INSTITUTION_WAR_SUPPLY = Object.freeze({
  'Mine (open cast)': ['ore'],
  Mine: ['ore'],
  'Stone quarry': ['stone', 'siege'],
  Smelter: ['smelting'],
  'Charcoal burner': ['smelting'],
  Blacksmith: ['weapons'],
  'Blacksmiths (3-10)': ['weapons'],
  'Specialized metalworkers': ['weapons'],
  'Bowyer & fletcher': ['weapons'],
  'Bowyers & fletchers (guild)': ['weapons'],
  Tannery: ['leather'],
  'Tanner (established)': ['leather'],
  Tanners: ['leather'],
  'Stable yard': ['horses'],
  'Stable master': ['horses'],
  'Stable district': ['horses'],
  'Pack animal trader': ['horses'],
  Caravanserai: ['horses'],
  "Woodcutter's camp": ['timber'],
  Sawmill: ['timber', 'siege'],
  'Sawmill (commercial)': ['timber', 'siege'],
  Ropemaker: ['siege'],
  'Salt works': ['provisioning'],
  'Communal root cellar': ['provisioning'],
  'Town granary': ['provisioning'],
  'City granaries': ['provisioning'],
  'State granary complex': ['provisioning'],
  'Small hospital': ['medicine'],
  'Major hospital': ['medicine'],
  'Hospital network': ['medicine'],
  'Healer (divine, 1st level)': ['medicine'],
  Apothecary: ['medicine'],
  'Apothecary (established)': ['medicine'],
  'Mercenary quarter': ['irregular'],
  'Free company hall': ['irregular'],
  "Adventurers' charter hall": ['irregular'],
  "Multiple adventurers' guilds": ['irregular'],
  'Hired blades': ['irregular'],
  'Hireling hall': ['irregular'],
});

/**
 * PORTFOLIO FLAVOR AFFINITY. Lowercase theme hints for later deity-flavored
 * content selection. Not exhaustive; absent = no strong thematic pull.
 * @type {Readonly<Record<string, ReadonlyArray<string>>>}
 */
export const INSTITUTION_FLAVOR_AFFINITY = Object.freeze({
  'Slave market': ['bondage', 'domination', 'commerce'],
  'Slave market district': ['bondage', 'domination', 'commerce'],
  'Kidnapping ring': ['bondage', 'fear'],
  'Human trafficking network': ['bondage', 'shadow'],
  Almshouse: ['charity', 'mercy', 'shelter'],
  'Small hospital': ['mercy', 'healing'],
  'Major hospital': ['mercy', 'healing'],
  'Hospital network': ['mercy', 'healing'],
  'Foundling home': ['mercy', 'children'],
  Blacksmith: ['forge', 'fire', 'craft'],
  'Blacksmiths (3-10)': ['forge', 'fire', 'craft'],
  Smelter: ['forge', 'fire'],
  'Specialized metalworkers': ['forge', 'war', 'craft'],
  'Bowyer & fletcher': ['war', 'craft'],
  'Bowyers & fletchers (guild)': ['war', 'craft'],
  'Colosseum/arena': ['blood', 'spectacle', 'glory'],
  'Fighting pits': ['blood', 'spectacle'],
  'Gladiatorial school': ['blood', 'discipline', 'glory'],
  Garrison: ['war', 'order', 'discipline'],
  'Multiple garrisons': ['war', 'order'],
  Barracks: ['war', 'discipline'],
  'Town walls': ['protection', 'order'],
  'City walls and gates': ['protection', 'order'],
  Citadel: ['protection', 'war'],
  'Citizen militia': ['protection', 'community'],
  'Town watch': ['order', 'vigilance'],
  'Professional city watch': ['order', 'vigilance'],
  Courthouse: ['justice', 'order'],
  'Multiple courthouses': ['justice', 'order'],
  'Multiple court buildings': ['justice', 'order'],
  'Large prison': ['justice', 'confinement'],
  'Massive prison': ['justice', 'confinement'],
  'Small prison/stocks': ['justice', 'confinement'],
  'Wayside shrine': ['travel', 'devotion'],
  'Parish church': ['devotion', 'community'],
  'Cathedral (10,000+ only)': ['devotion', 'authority'],
  'Great cathedral': ['devotion', 'authority', 'pilgrimage'],
  'Monastery or friary': ['devotion', 'contemplation', 'charity'],
  Graveyard: ['death', 'rest'],
  'Gambling den': ['fortune', 'vice', 'chance'],
  'Gambling halls': ['fortune', 'vice', 'chance'],
  'Gambling district': ['fortune', 'vice', 'chance'],
  Brothel: ['pleasure', 'vice'],
  'Red light district': ['pleasure', 'vice'],
  'Brothel (red light district)': ['pleasure', 'vice'],
  "Assassins' guild": ['shadow', 'death', 'secrecy'],
  'Contract killer': ['shadow', 'death'],
  'Black market': ['shadow', 'commerce'],
  'Black market bazaar': ['shadow', 'commerce'],
  "Thieves' guild chapter": ['shadow', 'trickery'],
  "Thieves' guild (powerful)": ['shadow', 'trickery'],
  Farmland: ['harvest', 'earth'],
  'Common grazing land': ['harvest', 'earth', 'beasts'],
  'Subsistence farming': ['harvest', 'earth'],
  'Dairy farmer': ['harvest', 'beasts'],
  Shepherd: ['beasts', 'harvest'],
  Beekeeper: ['harvest', 'craft'],
  'Fishing community': ['sea', 'harvest'],
  "Fisher's landing": ['sea', 'harvest'],
  Shipyard: ['sea', 'craft', 'war'],
  'Docks/port facilities': ['sea', 'commerce', 'travel'],
  "Harbour master's office": ['sea', 'order'],
  'Market square': ['commerce', 'community'],
  'Weekly market': ['commerce', 'community'],
  'Merchant guilds (3-8)': ['commerce', 'ambition'],
  'Merchant guilds (15-40)': ['commerce', 'ambition'],
  'Banking houses': ['commerce', 'ambition'],
  'Banking district': ['commerce', 'ambition'],
  Mint: ['commerce', 'craft', 'authority'],
  'Traveling performers': ['revelry', 'story'],
  Theaters: ['story', 'revelry'],
  'Opera house': ['story', 'revelry', 'luxury'],
  'Bardic college': ['story', 'music', 'lore'],
  'Village musician': ['music', 'story'],
  "Mages' guild": ['arcane', 'knowledge', 'ambition'],
  "Mages' district": ['arcane', 'knowledge'],
  'Academy of magic': ['arcane', 'knowledge'],
  "Wizard's tower": ['arcane', 'secrecy'],
  'Great library': ['knowledge', 'lore'],
  "Sage's quarter": ['knowledge', 'lore'],
  'Druid Circle': ['nature', 'wild', 'balance'],
  'Elder Grove Council': ['nature', 'wild', 'balance'],
  "Warden's Lodge": ['nature', 'wild', 'vigilance'],
  'Undead labor': ['death', 'shadow', 'taboo'],
  'Planar traders': ['planar', 'commerce', 'strange'],
  'Planar embassy': ['planar', 'authority', 'strange'],
  'Dragon resident': ['power', 'fear', 'greed'],
});

/** @type {Readonly<Record<string, string>>} */
const BADGE_BY_GROUP = Object.freeze({
  Government: 'Governance',
  Religious: 'Faith',
  Criminal: 'Underworld',
  Infrastructure: 'Infrastructure',
  Economy: 'Commerce',
  Crafts: 'Craft',
  Magic: 'Arcane',
  Defense: 'Defense',
  Adventuring: 'Adventuring',
  Entertainment: 'Leisure',
  Exotic: 'Exotic',
});

/**
 * IDENTITY-BADGE overrides for institutions whose identity outruns their
 * catalog group (an almshouse is Charity, not Faith; a gaol is Justice, not
 * Infrastructure). Absent -> the group default below.
 * @type {Readonly<Record<string, string>>}
 */
export const INSTITUTION_BADGE_OVERRIDES = Object.freeze({
  Almshouse: 'Charity',
  'Small hospital': 'Charity',
  'Major hospital': 'Charity',
  'Hospital network': 'Charity',
  'Foundling home': 'Charity',
  Courthouse: 'Justice',
  'Multiple courthouses': 'Justice',
  'Multiple court buildings': 'Justice',
  'Small prison/stocks': 'Justice',
  'Large prison': 'Justice',
  'Massive prison': 'Justice',
  'Slave market': 'Bondage',
  'Slave market district': 'Bondage',
  Brothel: 'Vice',
  'Brothel (red light district)': 'Vice',
  'Red light district': 'Vice',
  'Gambling den': 'Vice',
  'Gambling halls': 'Vice',
  'Gambling district': 'Vice',
  'Fighting pits': 'Vice',
  'Colosseum/arena': 'Vice',
  'Gladiatorial school': 'Vice',
  'Contract killer': 'Underworld',
  "Assassins' guild": 'Underworld',
  'Kidnapping ring': 'Underworld',
  'Human trafficking network': 'Underworld',
  'Black market bazaar': 'Underworld',
  'Underground city': 'Underworld',
  "Thieves' guild (powerful)": 'Underworld',
});

// Lowercase index for tolerant identity resolution (instance names match the
// catalog exactly, but custom/legacy content may drift in case).
const IDENTITY_BY_LOWER = new Map(
  Object.entries(INSTITUTION_IDENTITY).map(([k, v]) => [k.toLowerCase(), v]),
);

/**
 * The authored one-liner for an institution, or null when none is authored
 * (custom / DM institutions honestly render no line). Matches by exact name,
 * then case-insensitively.
 * @param {InstLike | null | undefined} inst
 * @returns {string | null}
 */
export function identityForInstitution(inst) {
  const name = inst && typeof inst.name === 'string' ? inst.name : '';
  if (!name) return null;
  if (Object.prototype.hasOwnProperty.call(INSTITUTION_IDENTITY, name)) {
    return INSTITUTION_IDENTITY[name];
  }
  return IDENTITY_BY_LOWER.get(name.toLowerCase()) ?? null;
}

/**
 * The identity-badge label for an institution: an explicit override, else the
 * catalog group (instance.category), else the priorityCategory, else a
 * neutral fallback. Always a non-empty string.
 * @param {InstLike | null | undefined} inst
 * @returns {string}
 */
export function badgeForInstitution(inst) {
  const name = inst && typeof inst.name === 'string' ? inst.name : '';
  if (name && Object.prototype.hasOwnProperty.call(INSTITUTION_BADGE_OVERRIDES, name)) {
    return INSTITUTION_BADGE_OVERRIDES[name];
  }
  const group = inst && typeof inst.category === 'string' ? inst.category : '';
  if (group && Object.prototype.hasOwnProperty.call(BADGE_BY_GROUP, group)) {
    return BADGE_BY_GROUP[group];
  }
  const pc = inst && typeof inst.priorityCategory === 'string' ? inst.priorityCategory : '';
  /** @type {Record<string, string>} */
  const byPc = {
    government: 'Governance', religion: 'Faith', criminal: 'Underworld',
    infrastructure: 'Infrastructure', economy: 'Commerce', crafts: 'Craft',
    magic: 'Arcane', defense: 'Defense', military: 'Martial',
    adventuring: 'Adventuring', entertainment: 'Leisure', exotic: 'Exotic',
  };
  return byPc[pc] || 'Institution';
}

