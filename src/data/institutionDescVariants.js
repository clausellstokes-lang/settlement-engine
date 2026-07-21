/**
 * institutionDescVariants.js — CONTENT-GT lane: extra description variants for the
 * institution catalog, keyed by the exact `${tier}|${category}|${name}` catalog path.
 * These are the NON-canonical variants ONLY; the catalog's own `desc` stays the
 * canonical index-0 entry, and assembleInstitutions selects among
 * [canonicalDesc, ...variants] with a pure fnv hash of (settlement seed + institution
 * name) — ZERO rng draws (kernel/proseHash.pickVariant, canonical-at-zero). A
 * settlement without a matching key keeps its single catalog desc unchanged.
 *
 * CONTENT-GT-FINAL (Charge 2): grown from the taste-approved 56-institution sample to
 * the EXHAUSTIVE catalog (every institution bearing a desc), 2 variants each, in the
 * approved register — every stated fact (population gates, counts, prices, part-time/
 * full-time status, charter/monopoly clauses) preserved verbatim in meaning. Guarded by
 * tests/generators/dossierContent.test.js (walker + register + canonical-at-zero).
 */
export const INSTITUTION_DESC_VARIANTS = Object.freeze({
  "city|Adventuring|Dungeon delving supply district": [
    "Specialised kit for the delving trade. +1 weapons, silver weapons, and the like.",
    "Gear for those who go underground. +1 weapons, silver weapons, and such.",
  ],
  "city|Adventuring|Mercenary quarter": [
    "Sellsword companies under proper organisation, mustering hundreds to thousands.",
    "Organised bands of hired blades. Major forces, hundreds to thousands strong.",
  ],
  "city|Adventuring|Multiple adventurers' guilds": [
    "Rival organisations.",
    "Guilds set against one another.",
  ],
  "city|Adventuring|Sage's quarter": [
    "Scholars and researchers, gathered in number.",
    "A cluster of learned men and their researches.",
  ],
  "city|Crafts|Glassmakers": [
    "Windows, vessels, and mirrors. The craft demands real skill.",
    "Glass for windows, vessels, and mirrors. Expert work, not casual.",
  ],
  "city|Crafts|Luxury goods quarter": [
    "Silks, spices, and other precious goods.",
    "The trade in silk, spice, and precious things.",
  ],
  "city|Crafts|Printing house": [
    "Books and broadsheets, where the technology has arrived.",
    "Printed books and broadsheets, only if the craft exists at all.",
  ],
  "city|Crafts|Specialized metalworkers": [
    "Armourers, swordsmiths, and jewellers, each in its own guild.",
    "Swordsmiths, armourers, jewellers. The trades kept to separate guilds.",
  ],
  "city|Criminal|Black market": [
    "Trade in forbidden goods, conducted out of sight.",
    "Illicit wares, bought and sold in hidden places.",
  ],
  "city|Criminal|Contract killer": [
    "A lone hand or small cell, working below the level that would sustain an assassins guild. Work comes through criminal go-betweens: less dependable, but deniable.",
    "One killer, or a handful, operating beneath the threshold an assassins guild would need. Contracts arrive by way of criminal intermediaries, less reliable and for that reason harder to trace back.",
  ],
  "city|Criminal|Front businesses": [
    "Warehouses, taverns, and shops that mask criminal work.",
    "Criminal operations screened behind honest-looking warehouses, taverns, and shops.",
  ],
  "city|Criminal|Human trafficking network": [
    "A wholly hidden operation that moves persons across borders outside any legal channel. It arises only where no lawful slave market stands. It runs its own logistics, its own safe houses, and its own bought border officials.",
    "An entirely clandestine trade in persons, carried across jurisdictions beyond the reach of law. It appears only where no legal slave market exists to absorb the traffic. Separate logistics, safe houses, and corrupted border infrastructure hold it together.",
  ],
  "city|Criminal|Kidnapping ring": [
    "It seizes free persons and slips them into slavery on forged provenance papers. Where a legal market stands it borrows that infrastructure; where none does, it works alone.",
    "Free persons are taken and passed into slavery through counterfeit provenance documents. It leans on the legal market's apparatus wherever one exists, and runs its own where it does not.",
  ],
  "city|Criminal|Multiple criminal factions": [
    "Rival gangs, forever disputing their turf.",
    "Several gangs at odds, quarrelling over ground.",
  ],
  "city|Criminal|Smuggling network": [
    "An organised trade in contraband.",
    "Contraband, moved by an organised hand.",
  ],
  "city|Criminal|Thieves' guild chapter": [
    "A chapter of organised crime, workable only past 10,000 people. Thirty to a hundred members.",
    "An arm of the wider criminal order, 30 to 100 strong. It needs a city of 10,000 or more to survive.",
  ],
  "city|Criminal|Underground network": [
    "A warren of tunnels beneath the city, wide enough for cargo and old enough that no one alive knows every branch.",
    "Excavated ways running under walls and wards alike; whole shipments pass below the city without touching a street.",
  ],
  "city|Defense|Citadel": [
    "The inner fortress, and the last refuge when a siege closes in.",
    "An innermost stronghold, the city's final hold under siege.",
  ],
  "city|Defense|City walls and gates": [
    "Towered stone walls. Several gatehouses along their length.",
    "Masonry ramparts studded with towers and pierced by many gates.",
  ],
  "city|Defense|Garrison": [
    "Professional soldiers, kept by noble or crown.",
    "A standing body of soldiers, in noble or royal pay.",
  ],
  "city|Defense|Professional city watch": [
    "A standing force of the law, roughly one in a hundred residents.",
    "Full-time keepers of order, numbering about 1% of the city.",
  ],
  "city|Economy|Apothecary district": [
    "Apothecary shops crowded into one quarter, where competition forces each to specialise. One leans to chirurgery, another to herbal preparations, a third to imported medicines. Between them they carry herbalism kits, medicinal herbs, surgical supplies, and basic antidotes.",
    "A cluster of apothecaries pressed close enough that competition drives them apart in trade, some to surgery, some to herb-work, some to medicines brought from abroad. Herbalism kits, medicinal herbs, surgical supplies, and basic antidotes are all to be had.",
  ],
  "city|Economy|Auction house": [
    "A formal house for the sale of costly goods: estates, ships, livestock, art, and now and then persons. It takes a premium from buyer and seller both.",
    "The recognised venue for high-value lots, be they estates, ships, livestock, art, or on occasion persons. Both buyer and seller pay its premium.",
  ],
  "city|Economy|Banking houses": [
    "Loans, coin exchange, and letters of credit. The beginnings of banking, viable above 5,000 souls.",
    "Lending, currency exchange, and credit by letter. Rudimentary banking, and only past 5,000 population.",
  ],
  "city|Economy|Barge and river transport company": [
    "A fleet of river barges working scheduled and commissioned runs. It carries bulk cargo, passengers, and military supply along the river network.",
    "River barges run in fleet, some to a schedule and some to order. Bulk freight, passengers, and army supply all move on them through the river network.",
  ],
  "city|Economy|Caravan masters' exchange": [
    "The city-scale form: permanent offices where caravan masters, merchants, and armed escorts do business. It handles bonded freight, route intelligence, the assembly of armed convoys, and the settling of commercial disputes.",
    "A city-scale exchange with standing offices, where caravan masters meet merchants and armed escorts to transact. Bonded freight, route intelligence, armed convoy assembly, and commercial dispute resolution are all conducted here.",
  ],
  "city|Economy|Cartographer's guild": [
    "A guild of professional cartographers turning out regional maps, sea charts, property surveys, and military reconnaissance. It sells ready-made maps and works to commission. No maps in the region are more accurate than the city's.",
    "Professional cartographers, guild-organised, producing regional maps, sea charts, property surveys, and reconnaissance maps for the army. Some sell off the shelf, others are drawn to order. The city's are the most accurate maps the region has.",
  ],
  "city|Economy|City granaries": [
    "Several large grain stores feed the city between them. The state keeps them.",
    "Grain held in large state-run stores and given out across the city.",
  ],
  "city|Economy|Craft guilds (30-80)": [
    "Specialisation carried to an extreme, down to gold-beaters and mirror-makers.",
    "Trades split so finely they yield gold-beaters and mirror-makers.",
  ],
  "city|Economy|Daily markets": [
    "Trade that never closes, spread across several sites.",
    "Standing markets in more than one quarter, open every day.",
  ],
  "city|Economy|Docks/port facilities": [
    "Where there is coast or river to reach. Bulk trade cannot do without them.",
    "Present only with sea or river access, and indispensable to trade in bulk.",
  ],
  "city|Economy|Furrier's district": [
    "Fur processors, traders, and retailers gathered into one quarter. It is high-value work, for good fur is a luxury good.",
    "Those who dress, trade, and sell fur, all pressed into one district. The trade runs high, quality pelts being luxuries.",
  ],
  "city|Economy|Harbour master's office": [
    "It orders port traffic, gathers anchorage fees, assigns the berths, and holds the maritime law. Port cities only.",
    "Traffic is regulated here, anchorage fees collected, berths handed out, and sea-law enforced. Found only in port cities.",
  ],
  "city|Economy|Inns and taverns (district)": [
    "Several inn districts, given over to merchants, travellers, and those who stay long.",
    "More than one quarter of inns, serving the merchant, the traveller, and the lingering guest.",
  ],
  "city|Economy|Major annual fairs": [
    "Merchants from abroad. Letters of credit are honoured.",
    "Foreign traders attend, and credit by letter is taken.",
  ],
  "city|Economy|Merchant guilds (15-40)": [
    "A force to be reckoned with in politics.",
    "Politically, a power in their own right.",
  ],
  "city|Economy|Mint (official)": [
    "Coin struck under state or noble charter. It sets a single standard of currency across the region and returns a steady revenue through seigniorage.",
    "Chartered by state or noble to make coin, it standardises the region's currency and yields significant ongoing revenue by seigniorage.",
  ],
  "city|Economy|Multiple market squares": [
    "Several standing market squares, one to a district.",
    "Permanent markets in more than one square, each serving its own quarter.",
  ],
  "city|Economy|Shipyard": [
    "A city-scale yard building large merchant ships and warships alike. It holds several dry docks, a ropewalk, a sail loft, and its own ironworks. It employs many, and matters to the state's defence.",
    "Here large merchant and war vessels are built at city scale, across multiple dry docks, with ropewalk, sail loft, and dedicated ironworks besides. A major employer, and a strategic military asset.",
  ],
  "city|Economy|Slave market": [
    "A settled auction block with holding pens, registered brokers, and papers of provenance. Commerce in persons, sanctioned by law, taxed and regulated and woven into the city's economy.",
    "An established block for the sale of persons, with holding facilities, licensed brokers, and provenance documents. The law permits it; it is taxed, regulated, and set deep in the city economy.",
  ],
  "city|Economy|Slave market district": [
    "A standing, licensed quarter for the trade in persons: auction halls, holding compounds, broker offices, and the legal and financial apparatus around them. It works at a scale no single market block could reach.",
    "A permanent district, licensed for commerce in persons, with auction halls, holding compounds, broker offices, and the attendant legal and financial infrastructure. The scale runs well beyond one market block.",
  ],
  "city|Economy|Warehouse district": [
    "Where merchant goods are stored.",
    "Storage set aside for the merchants' stock.",
  ],
  "city|Entertainment|Bardic college": [
    "Music taught in the formal way, with an amphitheatre and dormitories. Even a small campus wants 10,000 or more people.",
    "A formal schooling in music: amphitheatre, dormitories, and all. Nothing under 10,000 sustains even a small campus.",
  ],
  "city|Entertainment|Brothel (red light district)": [
    "A prostitution quarter, lawful or merely suffered.",
    "A quarter given to prostitution, whether licensed or just tolerated.",
  ],
  "city|Entertainment|Colosseum/arena": [
    "Gladiators, or beasts set to fight, on a massive scale.",
    "Games of the arena, gladiatorial bouts or monster fights, staged at great size.",
  ],
  "city|Entertainment|Fighting pits": [
    "Combat outside the law, or barely within it, held underground.",
    "Fights unlawful or half-lawful, staged in hidden places.",
  ],
  "city|Entertainment|Gambling district": [
    "Gaming houses packed together, kept honest by Zone of Truth.",
    "A concentration of gaming houses, with Zone of Truth to enforce fair play.",
  ],
  "city|Entertainment|Gambling halls": [
    "Houses given wholly to play. Not all of them lawful.",
    "Establishments for gambling and nothing else, some of them illegal.",
  ],
  "city|Entertainment|Multiple theaters": [
    "Standing venues, worked by professional companies.",
    "Permanent playhouses with companies that make their living at it.",
  ],
  "city|Entertainment|Opera house": [
    "High culture, kept by elite patrons.",
    "A house of high art, sustained by the patronage of the elite.",
  ],
  "city|Entertainment|Red light district": [
    "A large prostitution quarter, and an organised one.",
    "Prostitution on a large and organised scale, held to one quarter.",
  ],
  "city|Entertainment|Theaters": [
    "Fixed houses for performance.",
    "Standing venues for the stage.",
  ],
  "city|Exotic|Airship docking (high magic)": [
    "Mooring towers, warded against the weather by magic. Eberron-style.",
    "Towers to moor airships, with magical protection from the elements, in the Eberron manner.",
  ],
  "city|Exotic|Dragon resident": [
    "An ancient wyrm that dwells within the city.",
    "The city is home to an ancient dragon.",
  ],
  "city|Exotic|Dream parlors (high magic)": [
    "Experiences worked by the 5th level Dream spell: lucid dreams shared between minds, and speech within them.",
    "The 5th level Dream spell sold as experience, offering shared lucid dreaming and communication through it.",
  ],
  "city|Exotic|Golem workforce": [
    "Constructed servants, where the magic allows them.",
    "Servants made rather than born, if magic permits it.",
  ],
  "city|Exotic|Message network (high magic)": [
    "A network of Sending Stones, or else Speaking Stones. A station runs 250 to 10,000 GP.",
    "Paired Sending Stones or Speaking Stones, wired into a network. Each station costs from 250 to 10,000 GP.",
  ],
  "city|Exotic|Planar traders": [
    "Wares carried in from other planes.",
    "Merchants dealing in goods from beyond this plane.",
  ],
  "city|Exotic|Undead labor": [
    "Corpses raised to labour. Not everyone approves.",
    "Reanimated dead put to work. A contested practice.",
  ],
  "city|Government|City administration": [
    "Officials, clerks, and ward officers run the city's affairs between them. A looser arrangement than a council, but one that works. It governs by the momentum of its own paperwork.",
    "The city is administered by a standing body of officials, clerks, and ward officers, less formally constituted than a council yet functional all the same. What moves it is bureaucratic inertia.",
  ],
  "city|Government|City-state government": [
    "The settlement rules itself and the land around it as a sovereign polity, answering to no higher lord and holding no external charter.",
    "An independent state in its own right, governing both itself and its hinterland. No overlord above it, no charter granted from outside.",
  ],
  "city|Government|Democratic assembly": [
    "Formal power rests with an assembly of citizens; those entitled to vote argue and decide the major ordinances and appointments.",
    "A citizens' assembly wields the formal authority, its eligible voters debating and settling the larger ordinances and the appointments to office.",
  ],
  "city|Government|Guild consortium": [
    "Effective power over the city sits with a consortium of guild masters.",
    "The guild masters, banded into a consortium, hold the real civic power.",
  ],
  "city|Government|Mayor and council": [
    "An elected council backed by a complete administrative staff.",
    "A civic council put in by vote, with the full apparatus of office beneath it.",
  ],
  "city|Government|Merchant oligarchy": [
    "Civic power belongs solely to the wealthy merchant families, and office is bought in all but name.",
    "A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases.",
  ],
  "city|Government|Noble governor": [
    "A governor appointed by king or duke holds sway, and the city runs as a noble fief.",
    "Rule falls to a royal or ducal appointee, the city being worked as a noble's fief.",
  ],
  "city|Government|Royal seat": [
    "A royal governor or viceroy administers the city directly for the crown. The standing is high, and so is the scrutiny.",
    "The crown governs here at first hand, through a royal governor or viceroy. Great prestige, and no less watchfulness.",
  ],
  "city|Infrastructure|Aqueduct or water system": [
    "A built water supply: conduits, cisterns, and fountains.",
    "Engineered waterworks: conduits feeding cisterns and fountains.",
  ],
  "city|Infrastructure|City hall": [
    "A commanding seat of civic government.",
    "An imposing hall for the city's affairs.",
  ],
  "city|Infrastructure|Housing (1000-5000 structures)": [
    "Buildings of several storeys. Tenements house the poor.",
    "Multi-storey construction, with tenements for the poor.",
  ],
  "city|Infrastructure|Large prison": [
    "Holds debtors, criminals, and political prisoners alike.",
    "For debtors, for criminals, and for the politically inconvenient.",
  ],
  "city|Infrastructure|Multiple courthouses": [
    "Separate courts for trade, for crime, and for the church.",
    "Commercial, criminal, and ecclesiastical benches, each in its own house.",
  ],
  "city|Infrastructure|Sewage system": [
    "Drains laid underground. Uncommon, and vital to public health.",
    "Buried drainage. A rarity, and one the city's health depends on.",
  ],
  "city|Infrastructure|Workhouse": [
    "The able-bodied poor are given shelter and food, and made to earn it at compulsory labour: textile work, grinding, construction. It is not a prison, though the distinction is thin. It thins the ranks of vagrants and turns out goods besides, and its conditions are kept harsh on purpose, so that none grow too content to leave.",
    "In return for a roof and a meal, the able-bodied poor are set to forced work: textiles, milling, construction. Not quite a gaol, but the line blurs. It cuts vagrancy and yields product, and the deliberately grim conditions are the point: dependency is meant to sting.",
  ],
  "city|Magic|Alchemist quarter": [
    "Several alchemical workshops, run under a guild.",
    "A cluster of alchemists' workshops, organised into a guild.",
  ],
  "city|Magic|Enchanter's shop": [
    "Magic items made to order. It wants a population of 5,000 or more, as a rule.",
    "Where magic items are crafted. Typically past 5,000 people.",
  ],
  "city|Magic|Mages' guild": [
    "A body of spellcasters organised together. A chapter needs 2,000 to 5,000 people.",
    "An association of magic-workers. Sustaining a chapter takes 2,000-5,000 population.",
  ],
  "city|Magic|Scroll scribe": [
    "Spell scrolls sold across the counter, from 25 GP for a cantrip to 500 GP and up for a 3rd-level spell.",
    "Scrolls for sale: a cantrip runs 25 GP, a 3rd-level spell 500 GP or more.",
  ],
  "city|Magic|Teleportation circle": [
    "A permanent teleportation circle. Its use is restricted and its upkeep dear, but any settlement fortunate enough to hold one is transformed by it.",
    "A fixed teleportation circle, guarded in its access and costly to keep. For the rare settlement that has one, it changes everything.",
  ],
  "city|Magic|Wizard's tower": [
    "Home to a powerful spellcaster. A city may hold more than one.",
    "The seat of a high-level mage. Several may stand in a single city.",
  ],
  "city|Religious|Cathedral (10,000+ only)": [
    "The bishop's seat. It wants at least 10,000 people to sustain it, and its presence marks a city as a major one.",
    "Seat of a bishop, and the mark of a first-rank city. Nothing under 10,000 population carries one.",
  ],
  "city|Religious|Foundling home": [
    "Takes in abandoned infants and small children and keeps them in basic care until they are apprenticed, placed with families, or raised on within its walls. The church usually runs it. A turning wheel set in the wall lets a child be left anonymously after dark.",
    "Abandoned babies and young children are received here and given plain care until apprenticeship, a family placement, or a childhood spent in the house itself. Generally a church foundation. The wheel in the wall admits a child by night, no name asked.",
  ],
  "city|Religious|Major hospital": [
    "A large house for the sick poor, of 50 to 100 beds.",
    "Fifty to a hundred beds, given over to the ailing poor.",
  ],
  "city|Religious|Multiple monasteries": [
    "Several houses, each of a different order.",
    "More than one monastery, and no two of the same order.",
  ],
  "city|Religious|Parish churches (10-30)": [
    "A church to every quarter.",
    "One for each neighbourhood.",
  ],
  "hamlet|Crafts|Carpenter (part-time)": [
    "Puts up buildings and mends them, and makes tools besides.",
    "Raises and repairs both structures and tools.",
  ],
  "hamlet|Crafts|Charcoal burner": [
    "Tends kilns out in the nearby woods, supplying the fuel that smiths and bakers burn. The necessary link between forest and forge.",
    "Works his kilns in the woodland close by, turning timber into the fuel for forge and oven. Without him nothing gets from the trees to the fire.",
  ],
  "hamlet|Crafts|Dairy farmer": [
    "Runs cattle or goats for their milk, butter, and cheese. The one dependable fat and protein when the grain runs short. The work is seasonal, and heaviest in summer.",
    "Keeps a herd of cattle or goats for milk, butter, and cheese. In a bad grain year it is the only fat and protein to be had. Seasonal work, cresting in the summer months.",
  ],
  "hamlet|Crafts|Fisher's landing": [
    "A crude landing hung with racks for drying and salting the catch. Near water, it is the chief source of protein.",
    "A rough jetty and its salting-and-drying racks. Where there is water, the fish are what the hamlet lives on.",
  ],
  "hamlet|Crafts|Hunter's lodge": [
    "Hunters share what they know, dress their game, and sell the pelts. Among them they keep the routes, the seasons, and the beasts worth avoiding.",
    "A gathering of hunters who trade knowledge, butcher game, and deal in furs, keeping account of trails, seasons, and which animals mean harm.",
  ],
  "hamlet|Crafts|Maltster": [
    "Turns barley into malt for the brewers. A small concern feeding the local alehouses, and one that only runs when grain is in surplus.",
    "Malts barley for brewing on a modest scale, supplying the alehouses nearby. It needs grain to spare before it can work at all.",
  ],
  "hamlet|Crafts|Mine (open cast)": [
    "A shallow working or shaft sunk for iron ore, coal, or stone. It takes on the poorest hands, and the work is dangerous, filthy, and indispensable.",
    "Iron ore, coal, or stone dug from a shallow pit or shaft. The labour falls to the poorest, and it is perilous, grimy, and needed all the same.",
  ],
  "hamlet|Crafts|Pack animal trader": [
    "Deals in mules, donkeys, and draft horses, buying and selling, and hires them out to travellers and merchants who need something to carry a load down the road.",
    "Buys and sells mules, donkeys, and draft horses, and rents them to whoever on the road wants carrying power. Traveller or merchant alike.",
  ],
  "hamlet|Crafts|Peat cutter": [
    "Cuts peat from the marsh nearby and dries it into blocks for the hearth. Seasonal work: what he sells is winter warmth.",
    "Digs and dries peat blocks from the neighbouring marshland to burn at home. The trade is seasonal, and the thing sold is warmth against the winter.",
  ],
  "hamlet|Crafts|Resident smith (part-time)": [
    "Mends tools, shoes horses. Also works a plot.",
    "Tool repair and horseshoeing. Farms on the side.",
  ],
  "hamlet|Crafts|Salt works": [
    "Boils or dries salt out of seawater or brine springs, yielding the raw salt that preserves food. It works only where there are salt flats or a way to the coast.",
    "Evaporates coastal water or brine to leave salt behind. The raw salt everything is preserved with. Nowhere but by salt flats or the sea can it be done.",
  ],
  "hamlet|Crafts|Shepherd": [
    "Keeps flocks of sheep for wool and mutton, driving them by season between the low winter pastures and the high summer grazing. He is a mainstay of the cloth trade.",
    "Runs sheep for their wool and meat, moving the flocks with the seasons: down to the lowland in winter, up to the hills in summer. The textile trade leans on him.",
  ],
  "hamlet|Crafts|Stable yard": [
    "A shared stable where travellers may leave their horses, the stableman offering rough farriery and fodder.",
    "A common stable for travellers to lodge their mounts; the stableman sees to basic shoeing and feed.",
  ],
  "hamlet|Crafts|Stone quarry": [
    "Cuts and dresses building stone into blocks. A gang of quarrymen work it with picks and wedges. Slow going, but the only source of proper building material there is.",
    "Quarrymen with picks and wedges cut and dress the stone for building. It is slow, and it is the sole way to come by real building material.",
  ],
  "hamlet|Criminal|Bandit affiliate": [
    "A household or two here keep quiet ties to the bandits who work the roads about. News, shelter, and goods pass in both directions.",
    "Somewhere among these homes are people bound to the road-bandits nearby. What flows between them (word, refuge, supply) flows both ways.",
  ],
  "hamlet|Criminal|Fence (word of mouth)": [
    "Stolen property passes through the hamlet without fuss. You would know the go-between by sight, never by name.",
    "Lifted goods change hands here discreetly. The contact has a face people recognise and a name they don't use.",
  ],
  "hamlet|Criminal|Smuggling waypoint": [
    "Goods route through the hamlet to slip past the toll roads and customs posts. It is paid for the service in kind, and glad of it.",
    "Contraband moves through here, skirting the tolls and the customs checks. The hamlet takes its cut in goods rather than coin.",
  ],
  "hamlet|Defense|Citizen militia": [
    "Fit residents train and turn out when trouble comes near. Service is part-time.",
    "The able-bodied drill together and assemble against local danger. Nobody does it full-time.",
  ],
  "hamlet|Defense|Palisade or earthworks": [
    "A plain wooden palisade, or a bank of earth. Enough to slow a raid or a wandering beast, no more.",
    "A rough timber palisade or an earthen berm. It checks raiders and creatures without stopping them.",
  ],
  "hamlet|Economy|Access to external mill": [
    "A manor mill holding the sole right to grind (the banalité).",
    "The lord's mill, and by banalité the only one grain may lawfully be ground at.",
  ],
  "hamlet|Economy|Alehouse": [
    "Ale brewed at home and sold out of a back room. It doubles as the hamlet's common room. Every rumour, quarrel, and bargain passes through it.",
    "Somebody's back room, a barrel of home brew, and a bench. It is where the hamlet hears its news, airs its grievances, and strikes its deals.",
  ],
  "hamlet|Economy|Caravanserai": [
    "A walled waystation offering merchants, their beasts, and their goods a safe night's rest. It is the hinge of the desert trade (water, fodder, and protection, all for a fee), and without it no caravan crosses the country around in safety.",
    "Behind its walls, merchants shelter their animals and cargo overnight in security. Water, fodder, and guard are had here for payment, and it stands at the heart of the desert trade; lacking one, no caravan can safely make the surrounding passage.",
  ],
  "hamlet|Economy|Common grazing land": [
    "Open pasture the village grazes in common.",
    "Common ground where the settlement's beasts are pastured together.",
  ],
  "hamlet|Economy|Pawnbroker": [
    "Lends against goods left in pledge, at steep interest and no questions asked. For peasants and small craftsmen it is the only credit going.",
    "Money advanced on pawned goods, dear in interest and incurious as to origin. The one source of credit a peasant or a minor craftsman can reach.",
  ],
  "hamlet|Economy|Periodic market": [
    "A trading day held monthly or by season. There is no charter behind it, only habit, nearness, and a flat patch of ground.",
    "Monthly or seasonal, the market gathers without any charter to sanction it. Sustained by custom, by convenience, and by a level piece of earth.",
  ],
  "hamlet|Economy|Subsistence farming": [
    "Strips worked in the open fields.",
    "Open-field farming, parcelled into strips.",
  ],
  "hamlet|Economy|Wayside inn": [
    "A room over the stable and a shared meal for whoever the road brings through. It exists because the road does.",
    "Lodging above the stable and a common table for passing travellers. Were there no road, there would be no inn.",
  ],
  "hamlet|Government|Informal elder consensus": [
    "A free hamlet, with no lord's man set over it; the elders, agreeing among themselves, settle what the community holds in common.",
    "No lord's representative stands here. The hamlet is free, and its shared affairs are decided by the common consent of its elders.",
  ],
  "hamlet|Government|Lord's steward": [
    "A lord's man runs the hamlet's holdings, gathers the rents, and speaks for noble authority.",
    "Acting for the lord, he administers the land, takes in rent, and imposes the noble's will.",
  ],
  "hamlet|Government|Village headman": [
    "One well-regarded resident holds sway without a mandate. Nobody voted, nobody appointed, everybody accepts it. What gets decided is practical, never ceremonial.",
    "A single trusted figure runs things by common agreement rather than any office. The rulings are matters of sense, not procedure.",
  ],
  "hamlet|Infrastructure|Dwellings (17-80)": [
    "Timber-framed houses under thatch.",
    "Frames of timber, roofed with thatch.",
  ],
  "hamlet|Infrastructure|Water source": [
    "A dug well, or a spring within reach.",
    "Water drawn from a well or a nearby spring.",
  ],
  "hamlet|Magic|Adventurers' charter hall": [
    "A plain hall held under a regional adventurers' charter. It posts bounties, houses monster hunters, and takes up the local defence the garrison cannot manage. You find them along dangerous frontiers.",
    "Chartered by the region's adventuring order and little more than a rough hall for it. Bounties go up on its board, monster hunters bed down inside, and when the garrison falls short it musters the defence. A frontier fixture where the country is dangerous.",
  ],
  "hamlet|Magic|Traveling hedge wizard": [
    "Turns up now and then. Nothing above 1st-level spells.",
    "Comes by on occasion. 1st-level magic and no higher.",
  ],
  "hamlet|Religious|Access to parish church": [
    "The nearest church is the village's, a typical 2-5km off.",
    "No church of its own; the village one lies a usual 2-5km away.",
  ],
  "hamlet|Religious|Wayside shrine": [
    "A plain spot for prayer. No clergy.",
    "Modest prayer marker. Unattended.",
  ],
  "metropolis|Crafts|Craft guilds (100-150+)": [
    "More than a hundred separate craft specialisations, each with a guild. No trade goes unrepresented.",
    "A guild for every trade imaginable, well past a hundred distinct crafts in all.",
  ],
  "metropolis|Criminal|Assassins' guild": [
    "Killing to order, done as a trade. It works through intermediaries and is never owned to in public.",
    "A professional trade in murder, screened behind cutouts and admitted by no one.",
  ],
  "metropolis|Criminal|Black market bazaar": [
    "A standing underground market dealing contraband, forged papers, and services no law permits.",
    "Contraband, forged documents, and illicit services, traded at a permanent underground bazaar.",
  ],
  "metropolis|Criminal|Thieves' guild (powerful)": [
    "The ruling criminal syndicate, suffered because open gang war would be worse.",
    "A dominant underworld power the city tolerates, the alternative being the bloodshed of rival gangs.",
  ],
  "metropolis|Criminal|Underground city": [
    "Miles of tunnel and catacomb turned to shelter for criminals and refugees alike.",
    "An old warren of catacombs and passages, repurposed as a sanctuary for the hunted and the hiding.",
  ],
  "metropolis|Defense|Massive walls and fortifications": [
    "Walls within walls: an outer line, an inner line, and the citadel ring. Garrison districts and gatehouses at every stage.",
    "A defence built in layers: outer wall, inner wall, and the ring about the citadel, with garrisons and gatehouses throughout.",
  ],
  "metropolis|Defense|Multiple garrisons": [
    "Garrisons spread through the quarters; no single barracks could secure a city this size.",
    "Troops quartered in several places at once, a metropolis being far too large for one garrison.",
  ],
  "metropolis|Economy|Banking district": [
    "A whole quarter given to money: banking across borders, credit by letter, and speculation in coin at scale.",
    "The city's finance gathered into one district: international houses, letters of credit, and currency dealing on a grand scale.",
  ],
  "metropolis|Economy|Daily markets": [
    "Outgrown at metropolitan scale.",
    "The scale of the metropolis has left it behind.",
  ],
  "metropolis|Economy|District markets (5-10)": [
    "Between five and ten standing market districts, each to its own trade: grain, livestock, cloth, metals, exotica.",
    "Five to ten permanent quarters given over to markets, sorted by ware: grain, livestock, cloth, metals, and the exotic.",
  ],
  "metropolis|Economy|International trade center": [
    "Where foreign merchant agents gather, trade disputes are arbitrated, and commodities change hands.",
    "A centre for overseas trade representatives, the settling of commercial disputes, and dealing in commodities.",
  ],
  "metropolis|Economy|Merchant guilds (50-100+)": [
    "Dozens of merchant guilds, one for each major good and route, convened as a formal parliament of trade.",
    "Every principal commodity and trade route has its guild, scores of them in all, sitting together as a chartered guild parliament.",
  ],
  "metropolis|Economy|State granary complex": [
    "A network of granaries run by the state, holding reserves against emergency.",
    "State-managed grain stores, kept as a strategic reserve.",
  ],
  "metropolis|Government|Multiple court buildings": [
    "Several courts sitting at once, each to its province: commercial, criminal, appellate, ecclesiastical.",
    "Commercial, criminal, appellate, and ecclesiastical courts, all in session at the same time.",
  ],
  "metropolis|Government|Palace/government complex": [
    "The heart of metropolitan or state rule. A palace with its ministries, audience halls, and clerks' bureaux.",
    "Where the metropolis or the state governs from: palace, ministries, halls of audience, and offices without number.",
  ],
  "metropolis|Infrastructure|Advanced water infrastructure": [
    "Aqueducts, cisterns, and fountains throughout. Water managed across the whole city at scale.",
    "Several aqueducts feed cisterns and fountains spread across the districts, a water system built for a city's size.",
  ],
  "metropolis|Infrastructure|Massive prison": [
    "A state prison of some size, keeping its political prisoners, debtors, and convicts apart from one another.",
    "A vast state gaol where the political, the indebted, and the convicted are each held separately.",
  ],
  "metropolis|Magic|Academy of magic": [
    "A chartered school of the arcane, with a full course of study, laboratories, and scholars come from abroad.",
    "A formal college of magic. A complete curriculum, rooms for research, and a stream of visiting adepts.",
  ],
  "metropolis|Magic|Great library": [
    "The region's greatest store of learning: thousands of volumes, archives of maps, and the historical record.",
    "No larger collection of knowledge exists in the region: thousands of books, a map archive, and the histories.",
  ],
  "metropolis|Magic|Mages' district": [
    "A whole quarter of arcane practitioners, all towers, workshops, libraries, and reagent sellers.",
    "The magic-workers keep to one district. Its towers, workshops, libraries, and reagent merchants mark it out.",
  ],
  "metropolis|Magic|Planar embassy": [
    "A formal legation from a power of another plane. It trades, it gathers word, and now and then it intervenes.",
    "The standing diplomatic mission of a planar power: commerce, intelligence, and the occasional intervention.",
  ],
  "metropolis|Religious|Great cathedral": [
    "The metropolitan cathedral, seat of the region's highest prelate and a draw for pilgrims.",
    "The great church of the metropolis. The region's chief religious authority sits here, and the faithful travel to it.",
  ],
  "metropolis|Religious|Hospital network": [
    "Hospitals and infirmaries across the districts, medical care organised for a city's numbers.",
    "A spread of hospitals and infirmaries throughout the quarters, ordered medical care at population scale.",
  ],
  "metropolis|Religious|Major monasteries (5-10)": [
    "Between five and ten great monastic houses, each given to scholarship, contemplation, and charity at scale.",
    "Five to ten major monasteries, their scholarly, contemplative, and charitable work carried out on a grand scale.",
  ],
  "metropolis|Religious|Parish churches (50-100+)": [
    "Parish churches in the hundreds, across every district. No neighbourhood is without the faith.",
    "Hundreds of parishes, one church to each, so that faith runs through every quarter of the city.",
  ],
  "thorp|Criminal|Local fence": [
    "Someone here takes goods and never asks their history. The name is common knowledge. It is simply not spoken aloud.",
    "There is a person who pays for things and skips the question of where they came from. Everyone can point to the house. No one points out loud.",
  ],
  "thorp|Criminal|Outlaw shelter": [
    "Someone here will hide a person who needs to vanish. A barn, a cellar, a bargain no one speaks of.",
    "There is cover here for those who must disappear: a loft, a cellar, an understanding that stays unspoken.",
  ],
  "thorp|Economy|Access to external mill": [
    "Grain goes to the manor or village mill; grinding it at home is commonly against the law.",
    "No mill of its own. The manor's or the village's must serve, and milling at home is often forbidden.",
  ],
  "thorp|Economy|Fishing community": [
    "Nets, traps, and racks for drying. The thorp lives by the water and cannot be parted from it.",
    "Its livelihood is the water itself. The nets, the traps, the drying racks are the whole of the economy.",
  ],
  "thorp|Economy|Shepherd collective": [
    "The flock is held and worked in common, and the thorp keeps time by the grazing calendar.",
    "One shared flock, tended together. The grazing seasons set the rhythm of the place.",
  ],
  "thorp|Economy|Subsistence farming": [
    "Every household works some 12-16 acres, enough to stay alive and no more.",
    "Each family tills roughly 12-16 acres, all of it for the table.",
  ],
  "thorp|Economy|Woodcutter's camp": [
    "Felling and stacking timber by the season. The whole camp smells of fresh sawdust and pine resin.",
    "Timber cut and stacked when the season allows, and the air over the thorp is all sawdust and resin.",
  ],
  "thorp|Government|Head-of-household consensus": [
    "Every head of household has an equal say in shared concerns. Slower to decide, but the fairer for it.",
    "Common matters are settled by all the family heads together, each voice equal. It is unhurried, and the more egalitarian for that.",
  ],
  "thorp|Government|Household elder": [
    "A single household head speaks for the settlement without ever being chosen to. No office, no title, no vote. Simply the door people knock on when a thing has to be settled.",
    "One head of household carries the settlement's voice by common habit rather than any appointment. Nobody named them to it; everybody defers to it anyway.",
  ],
  "thorp|Government|Informal elder consensus": [
    "The oldest or best-regarded farmer steers the common decisions, and does it by agreement.",
    "Communal matters fall to the eldest or most respected farmer, who guides them to consensus.",
  ],
  "thorp|Government|Lord's reeve": [
    "A distant lord's man, set here to watch the settlement and remit what it owes. His writ is legitimate; his welcome is not.",
    "Placed by a lord who never visits, he holds official charge of the settlement. The paperwork backs him. The neighbours do not.",
  ],
  "thorp|Infrastructure|Communal root cellar": [
    "A shared cellar for grain, roots, and preserved food. It is what stands between the thorp and a failed harvest.",
    "Grain, roots, and preserves kept in a common underground store. The settlement's guard against a bad year.",
  ],
  "thorp|Infrastructure|Dwellings (4-16)": [
    "Wattle-and-daub or timber, one or two rooms to a household.",
    "Timber or wattle-and-daub houses, each of a room or two.",
  ],
  "thorp|Infrastructure|Palisade": [
    "A ring of sharpened stakes around the settlement. Little real defence, but enough to turn away an idle raider.",
    "Pointed stakes driven in a rough circle. They stop nothing determined, yet enough to discourage the casual thief.",
  ],
  "thorp|Infrastructure|Water source": [
    "A well or a spring, yielding at least 2-4 gallons a person each day.",
    "Water from a well or spring, a bare 2-4 gallons per person daily.",
  ],
  "thorp|Religious|Access to parish church": [
    "Services mean a 2-5km walk to the village church.",
    "The nearest church is the village's, a 2-5km walk away for services.",
  ],
  "thorp|Religious|Wayside shrine": [
    "A modest prayer marker. No clergy in residence.",
    "Plain wayside shrine for prayer. Unstaffed.",
  ],
  "town|Adventuring|Adventurers' charter hall": [
    "A chartered hall that serves as the region's chief adventuring hub. It posts contracts, grades the monster threats, keeps gear in repair, and runs the large operations no militia could handle.",
    "The region's principal adventuring hub, working under charter. Contracts are posted here, monster threats graded, equipment maintained, and the great operations beyond any militia coordinated from its floor.",
  ],
  "town|Adventuring|Beast trainers": [
    "Ordinary beasts only: horses, dogs, falcons.",
    "Horses, dogs, and falcons. Nothing more exotic.",
  ],
  "town|Adventuring|Charlatan fortune tellers": [
    "'Divination' with no magic in it, worked by Deception. 1-5 GP.",
    "Fortunes told by Deception rather than any real magic. A charge of 1-5 GP.",
  ],
  "town|Adventuring|Hireling hall": [
    "A board hiring out torchbearers at 1 GP a session and porters at 5.",
    "Where torchbearers (1 GP/session) and porters (5 GP/session) take on work.",
  ],
  "town|Adventuring|Merchant warehouses": [
    "Storage for merchants' goods held back for sale, transit, or the season's distribution. No trade-route settlement does without it.",
    "Warehouses where traders keep stock awaiting sale, shipment, or seasonal release. Indispensable to any town on a trade route.",
  ],
  "town|Crafts|Apothecary (established)": [
    "A proper shop kept by a trained herbalist, its shelves stocked and a back room set aside for consultations. It sells herbalism kit supplies, common antidotes, medicinal herbs, and basic surgical dressings. A few of its keepers also work as chirurgeons.",
    "An established herbalist's shop, well stocked, with a back room for private consultation. On offer are herbalism kit supplies, common antidotes, medicinal herbs, and simple surgical dressings, and some apothecaries here double as chirurgeons.",
  ],
  "town|Crafts|Bakers (5-15)": [
    "The town's bread. Prices fixed by the guild.",
    "Bread baked for sale, with the guild setting the price.",
  ],
  "town|Crafts|Blacksmiths (3-10)": [
    "Several smiths, each to his specialty.",
    "A number of smiths, work divided by trade.",
  ],
  "town|Crafts|Bowyers & fletchers (guild)": [
    "Several craftsmen banded into a guild. Standard arrows by the sheaf, specialty broadheads, and composite bows made to order. They restock the merchant caravans and arm the town militias.",
    "A guild of bowyers and fletchers. Arrows come by the sheaf, broadheads to specialty, and composite bows on commission. Enough to resupply the caravans and outfit the militias.",
  ],
  "town|Crafts|Brewery": [
    "Ale and beer brewed at commercial scale, supplying the town's taverns and the wider region. It eats grain and hires hands in quantity.",
    "A brewery working at commercial scale. It keeps the taverns stocked and sends beer across the region, and stands among the larger buyers of grain and employers in the town.",
  ],
  "town|Crafts|Butchers (3-8)": [
    "Meat dressed and sold, under close regulation.",
    "The butchering trade, strictly overseen.",
  ],
  "town|Crafts|Carpenters (5-15)": [
    "Builders and makers of furniture.",
    "They raise buildings and craft furniture both.",
  ],
  "town|Crafts|Chandler": [
    "Candles from tallow and beeswax, and soap and rope besides from much the same stock. Without it there is no light.",
    "Makes candles of tallow and beeswax, and turns like materials to soap and rope. The town depends on it for lighting.",
  ],
  "town|Crafts|Cobbler's guild": [
    "A guild of shoemakers turning out boots, shoes, and sandals for the townsfolk. Its quality is strictly regulated.",
    "Organised cobblers who shoe the town in boots, shoes, and sandals, with quality kept under strict regulation.",
  ],
  "town|Crafts|Glassblower": [
    "Glass worked on a small scale: bottles, window panes, goblets. It calls for silica sand, potash, and a skilled hand at the furnace.",
    "A modest glassworks making bottles, panes, and goblets, dependent on silica sand, potash, and a practised furnace operator.",
  ],
  "town|Crafts|Mills (2-5)": [
    "Several mills, some for grain, some for fulling cloth.",
    "A handful of mills, grinding grain and fulling cloth.",
  ],
  "town|Crafts|Mint": [
    "Turns refined precious metal into standard coin. It runs only under noble or royal charter, and earns the granting authority no small revenue.",
    "Coin of uniform standard struck from refined precious metal. A noble or royal charter is required, and the grant brings its holder considerable revenue.",
  ],
  "town|Crafts|Ropemaker": [
    "Spins hemp, flax, and other plant fibres into rope and cordage. Ships, building work, and farming all depend on it.",
    "Rope and cordage twisted from hemp, flax, or whatever plant fibre comes to hand. Nothing sails, rises, or is harvested without it.",
  ],
  "town|Crafts|Sawmill (commercial)": [
    "A mill driven by water or ox, cutting planks and beams for builders. Sited near timber, it can meet a whole region's building needs. The crew is permanent.",
    "Water or ox power turns logs into planks and beams for the construction trade. A town with timber to hand supplies the region's building work, and keeps a standing crew to do it.",
  ],
  "town|Crafts|Smelter": [
    "Charcoal furnaces reduce raw ore to refined metal. It stands between the mine and the smithy.",
    "Refines crude ore into workable metal over charcoal fire. The industrial step from what the mine yields to what the smith uses.",
  ],
  "town|Crafts|Tailor's guild": [
    "Master clothiers cutting garments from finished cloth, working clothes and household livery alike.",
    "A guild of master clothiers who make up finished cloth into everything from labourers' wear to noble livery.",
  ],
  "town|Crafts|Tanner (established)": [
    "A full tannery of many vats and a guild-trained workforce, turning out fine leather for shoes, armour, and saddlery.",
    "Multiple vats, trained hands from the guild. A proper tannery whose leather is good enough for footwear, armour, and saddlery.",
  ],
  "town|Crafts|Tanners": [
    "Leather-making. Kept downstream and downwind, always.",
    "The making of leather. It must sit downwind and downstream of everything else.",
  ],
  "town|Crafts|Town crier": [
    "The official voice, reading proclamations, market prices, and news at set hours in the market square. Town or guild pays his wage.",
    "At fixed times he stands in the market square and calls out the proclamations, the prices, and the news. His employer is the town, or else a guild.",
  ],
  "town|Crafts|Weavers/Textile workers": [
    "The making of cloth, usually under a guild.",
    "Cloth-work, more often than not guild-run.",
  ],
  "town|Criminal|Front businesses": [
    "Honest-looking trades that mask the dishonest kind.",
    "Lawful businesses standing cover for unlawful work.",
  ],
  "town|Criminal|Smuggling operation": [
    "Contraband moved, and the duty on it never paid.",
    "Trade in forbidden goods, kept off the tax rolls.",
  ],
  "town|Criminal|Street gang": [
    "Pickpockets and bruisers working together. Ten to thirty strong.",
    "An organised crew of cutpurses and toughs, some 10 to 30 of them.",
  ],
  "town|Criminal|Underground network": [
    "Tunnels and false cellars, dug and linked to move contraband beneath the streets.",
    "A network of excavated passages joining cellars and yards to the town's edge. None of it on any map.",
  ],
  "town|Defense|Barracks": [
    "Quarters for the guard or a small garrison.",
    "Lodging for guardsmen, or a modest garrison.",
  ],
  "town|Defense|Citizen militia": [
    "Every able-bodied townsman is bound to take up the town's defence, part-time. It exists only where no professional watch does.",
    "The obligation of defence falls on all who are fit, served part-time. Found only in towns without a professional watch.",
  ],
  "town|Defense|Free company hall": [
    "A billet and hiring office for professional soldiers idle between campaigns. Caravan escort, garrison work, and short-term hire go at day-wages here. Cheaper than a standing army and steadier than a mob. These are salaried men who fight in formation, not for plunder.",
    "Where a band of soldiers lodges and takes contracts between wars. They hire out by the day for escort, garrison duty, and brief campaigns: less costly than keeping an army, more dependable than a rabble. They form up for a wage, not for treasure.",
  ],
  "town|Defense|Gates (if walled)": [
    "Guarded ways in and out, each with its keeper.",
    "Entry controlled at fixed points, gatekeepers posted.",
  ],
  "town|Defense|Town walls": [
    "Gated stone defences. Costly to raise and no cheaper to keep up.",
    "Masonry walls pierced by gates. Dear to build, dearer to maintain.",
  ],
  "town|Defense|Town watch": [
    "Part-time guards who walk the night and hold the gates.",
    "Watchmen serving part-time. Night patrols and gate duty.",
  ],
  "town|Economy|Annual fair": [
    "Merchants from across the region, and luxuries to be had.",
    "A yearly draw for regional traders, with fine goods on offer.",
  ],
  "town|Economy|Assay office": [
    "Tests the purity of precious metals brought in. Infrastructure without which banking and minting cannot work. It charges by the assay.",
    "Precious metals are proved here for their fineness, a necessity for any bank or mint. A fee is taken on each test.",
  ],
  "town|Economy|Caravaneer's post": [
    "Coordinates caravan assembly, departure times, and word of the roads. Merchants register cargo, take on guards, and pool ventures here. The town's forerunner to the city's Caravan masters' exchange.",
    "Where regional caravans are mustered, scheduled, and briefed on their routes. Traders enrol their goods, hire escorts, and strike joint ventures, on the scale that precedes a city's Caravan masters' exchange.",
  ],
  "town|Economy|Carriers' guild": [
    "A guild of carters, teamsters, and pack-drivers who haul goods overland for pay. They know every road, every toll, and every road shut by season, and price their work by it.",
    "Professional carters and teamsters, organised, moving cargo across country for hire. Every route, levy, and winter closure is known to them, and billed for.",
  ],
  "town|Economy|Carriers' hiring hall": [
    "A yard where carters, teamsters, and pack-drivers take on road work. Drivers back from the road trade news of the way and of bandits over ale. A matter of hire, not of guild.",
    "Here one hires carters, teamsters, and pack-drivers for a journey. Those lately returned swap road conditions and bandit sightings over a cup. Transactional, never institutional.",
  ],
  "town|Economy|Cartographer's workshop": [
    "Sells road maps, regional surveys, and coastal charts, and takes commissions to survey estates or sketch dungeons. An older collection is kept for reference. Adventurers, merchants, and army scouts all stop here.",
    "Road maps, regional surveys, and coastal charts for sale; estate surveys and dungeon sketches to order; a reference shelf of older maps to consult. A usual call for anyone who travels with purpose: adventurer, merchant, or scout.",
  ],
  "town|Economy|Coaching inn": [
    "Built for the road: relay stabling, coaches on a schedule, meals at set hours, and a room for waiting passengers. Horses are changed here, not merely rested.",
    "A house made for travellers by coach: fresh horses stabled, departures timed, fixed mealtimes, and a passengers' waiting room. The teams are swapped out, not just given a rest.",
  ],
  "town|Economy|Craft guilds (5-15)": [
    "They set the standard of work, the prices, and the terms of apprenticeship.",
    "Quality, price, and apprenticeship all fall under their rule.",
  ],
  "town|Economy|Customs house": [
    "Duties are taken here on goods passing through the port or the main roads. Royal or municipal officers run it.",
    "Levies charged on all trade in and out by road or harbour, collected by officials of crown or town.",
  ],
  "town|Economy|Docks/port facilities": [
    "A dock on river or coast. Bulk trade and river carriage depend on it.",
    "Coastal or riverside wharfage, without which no heavy water-borne trade moves.",
  ],
  "town|Economy|Inn (multiple)": [
    "Beds for merchants on the road.",
    "Lodging for the travelling trade.",
  ],
  "town|Economy|Jeweller": [
    "Sets precious metal and gemstones into rings, necklaces, seals, and other luxuries. He works to commission, values stones, and now and then buys from customers who keep quiet about provenance.",
    "Rings, necklaces, seals, and finery, worked from gold and gemstone. He takes orders, appraises stones, and is not above the occasional purchase from a discreet seller.",
  ],
  "town|Economy|Market square": [
    "The central plaza where the weekly market and the fairs are held. Fifty to a hundred yards to a side.",
    "A broad open square, 50 to 100 yards across, given over to market days and fairs.",
  ],
  "town|Economy|Merchant guilds (3-8)": [
    "Each holds a grip on the trade in its particular wares.",
    "Trade in certain goods runs through their hands alone.",
  ],
  "town|Economy|Money changers": [
    "Foreign coin exchanged. The first stirrings of banking, past 3,000 people.",
    "They change coin from abroad. Banking in its infancy, and only above 3,000 population.",
  ],
  "town|Economy|Post relay station": [
    "Keeps a string of horses for fast relay of messages. Letters and small parcels outpace any courier on foot. It needs a coaching inn to run.",
    "Fresh horses stand ready to carry messages onward at speed, letters and small packages moving far quicker than a man walking. A coaching inn is required.",
  ],
  "town|Economy|Public bathhouse": [
    "Heated water for communal bathing. Some places treat it as a gathering-house, others eye it as a den of vice, but nowhere in town carries more rumour and news.",
    "A shared bath fed with heated water, prized as a social hub in one culture and mistrusted as a haunt of vice in another. Whichever it is, it is where the town's talk collects.",
  ],
  "town|Economy|Shipyard": [
    "Builds and mends ocean-going merchantmen. It wants a steady supply of timber, iron fittings, and skilled shipwrights. A great employer, and a heavy investment of capital.",
    "Sea-going trade vessels are built and repaired here, on a footing of constant timber, iron fittings, and specialist labour. It employs many and ties up much capital.",
  ],
  "town|Economy|Slave market": [
    "Enslaved people sold at public auction. Taken in war, ruined by debt, condemned by court, or trafficked. Where the law permits slavery, this counts as civic commerce.",
    "A public sale of the enslaved: war captives, debtors, convicts, and the trafficked. In places where slavery is lawful, it stands as ordinary commercial infrastructure.",
  ],
  "town|Economy|Stable district": [
    "Stabling, horse-dealing, and farriery gathered in one quarter, serving merchants, soldiers, and travellers in want of a fresh mount.",
    "A district given to stables, horse-trade, and the farrier's craft, for any merchant, soldier, or traveller needing a new mount.",
  ],
  "town|Economy|Taverns (5-20)": [
    "Houses for drink. And for company.",
    "Drinking houses, and the town's gathering places.",
  ],
  "town|Economy|Town granary": [
    "Shared grain stores that even out the harvests and hold off famine.",
    "Grain kept in common, a hedge against lean harvests and hunger.",
  ],
  "town|Economy|Vintner": [
    "Makes and ages wine, whether from grapes grown near or must brought in. He sells by the barrel to taverns and by the bottle to the rich. Where no vine grows, he imports and blends instead.",
    "Wine pressed and matured, from local fruit or imported must, sold in bulk to the taverns and direct to wealthy houses. In a region without vines, the vintner turns importer and blender.",
  ],
  "town|Economy|Weekly market": [
    "Held by royal charter. The town's chief economic engine.",
    "Requires a charter from the crown. A principal source of the town's trade.",
  ],
  "town|Entertainment|Brothel": [
    "Prostitution, tolerated or licensed.",
    "A house of prostitution, suffered or regulated.",
  ],
  "town|Entertainment|Gambling den": [
    "Dice, cards, and the plainer games of chance.",
    "Games of chance: dice and cards, nothing elaborate.",
  ],
  "town|Entertainment|Gladiatorial school": [
    "Trains fighters for the crowd's amusement, drawn from prisoners, debtors, and volunteers. It supplies the arena circuit.",
    "Prisoners, debtors, and the willing are made into fighters for public show, and sent on to feed the arenas.",
  ],
  "town|Entertainment|Hired blades": [
    "Professional fighters, alone or in small bands, taking private work: guarding a person, collecting a debt, or quietly ending a difficulty.",
    "Fighters for private hire, singly or in small groups: bodyguarding, debt-collection, and the discreet removal of problems.",
  ],
  "town|Entertainment|Traveling performers": [
    "Bards, jugglers, and acrobats, come for the fairs.",
    "The fairs bring bards, jugglers, and acrobats through.",
  ],
  "town|Government|Guild governance": [
    "The guilds hold the town's politics, their masters seated on the council.",
    "Town rule belongs to the guilds; it is the guildmasters who fill the council's chairs.",
  ],
  "town|Government|Lord's appointee": [
    "A man of the lord's choosing governs, and noble authority overrides whatever the town was accustomed to.",
    "Rule falls to the lord's appointee, whose noble warrant stands above local custom.",
  ],
  "town|Government|Mayor and council": [
    "The town's leadership, whether elected or named to office.",
    "A mayor and council, come to office by vote or appointment.",
  ],
  "town|Government|Town council": [
    "With no formal government in place, a loose council of leading citizens runs the town. It answers to no one in particular, but it beats having no one at all.",
    "Where nothing official exists, the town's notable men gather and govern by consensus. Less answerable than an elected body, and steadier than the void it fills.",
  ],
  "town|Infrastructure|Courthouse": [
    "The borough's court, where local justice is done.",
    "A borough court for the settling of local matters.",
  ],
  "town|Infrastructure|Housing (180-1000 structures)": [
    "Buildings of several storeys, in timber and stone.",
    "Timber and stone, raised to more than one floor.",
  ],
  "town|Infrastructure|Multiple water sources": [
    "Water from wells, fountains, or pipe.",
    "Wells and fountains, or water carried in by pipe.",
  ],
  "town|Infrastructure|Small prison/stocks": [
    "Cells to hold prisoners, and stocks to shame them.",
    "A few cells, and a place for punishment in public view.",
  ],
  "town|Infrastructure|Town hall": [
    "Where the town meets and its business is done.",
    "The seat of assembly and administration.",
  ],
  "town|Magic|Alchemist shop": [
    "Potions and alchemical wares. A basic healing draught runs 50 GP.",
    "Alchemy and its bottled results, healing potions among them at 50 GP for the plain sort.",
  ],
  "town|Magic|Elder Grove Council": [
    "Senior druids who govern how their circle deals with the city. They may keep a grove hidden beneath the streets, hold the line between the city's spread and the wild, or advise its rulers on the land. Found where a city has come to terms with nature's magic.",
    "A council of elder druids charged with their circle's standing in the city: sometimes tending a concealed grove below the streets, sometimes mediating between expansion and wild ground, sometimes counselling those in power on ecological matters. It arises only in cities at peace with nature magic.",
  ],
  "town|Magic|Teleportation circle": [
    "A permanent circle, and a rare one. Dear to build and dearer to keep, calling for magical skill past what a town usually commands.",
    "Rarely seen: a fixed teleportation circle whose construction and upkeep cost enormously, and which demands expertise beyond the ordinary town's means.",
  ],
  "town|Magic|Warden's Lodge": [
    "A ranger post or druid waystation. Those here watch the wilds, keep the trails, and follow the movements of beasts. In a crisis they turn scout and tracker.",
    "Rangers or druids keep this lodge, minding the wilderness about the town, tending its trails, and marking where the beasts migrate. When trouble comes they scout and track for the town.",
  ],
  "town|Magic|Wizard's tower": [
    "One wizard's home. It holds only past 1,000 people.",
    "A single wizard's residence, viable once the town passes 1,000.",
  ],
  "town|Religious|Almshouse": [
    "A charity house sheltering the destitute poor, the aged, and the disabled who cannot work. Church endowment and wealthy donors pay for it. Board and lodging are given; prayers for the benefactors are returned.",
    "Kept for the poor, the old, and the crippled who have no work in them, funded by church endowment and rich patrons. It feeds and houses its residents, who repay the kindness in prayer for those who gave it.",
  ],
  "town|Religious|Monastery or friary": [
    "A community of the religious. Sometimes runs a hospital or school.",
    "An order living in common. It may keep a hospital or a school.",
  ],
  "town|Religious|Parish churches (2-5)": [
    "Several parishes, each with its church.",
    "The town divided among a handful of parishes.",
  ],
  "town|Religious|Small hospital": [
    "Tends the sick poor. Generally in religious hands.",
    "The ailing poor are nursed here, most often by a religious order.",
  ],
  "village|Crafts|Apothecary": [
    "Herbal medicines, poultices, and everyday remedies for sale. Not to be confused with the alchemist. Nothing magical here, no acid flasks. The proprietor knows the roots that break a fever and the mushrooms that end a life. Herbalism supplies on hand.",
    "Sells poultices, common cures, and medicines drawn from herbs. Where the alchemist deals in magical compounds and acid, this trade does not. Its keeper can name which root treats fever and which mushroom kills, and keeps herbalism supplies in stock.",
  ],
  "village|Crafts|Beekeeper": [
    "Keeps hives for their honey and wax. The honey sweetens; the beeswax goes to candles, seals, and polish.",
    "Tends bees for honey and beeswax alike. One to sweeten food, the other for candles, wax seals, and polish.",
  ],
  "village|Crafts|Blacksmith": [
    "A full-time smith. Indispensable for tools and shoeing.",
    "Works metal full-time. Tools and horseshoes depend on him.",
  ],
  "village|Crafts|Bowyer & fletcher": [
    "Bows, crossbows, and arrows all made here. Finished ammunition sells off the shelf, and custom bows are made to order. Any adventurer with an empty quiver comes here first.",
    "Turns out bows, crossbows, and arrows, selling ready-made ammunition and taking commissions for bespoke bows. The first door an adventurer knocks on when the quiver runs dry.",
  ],
  "village|Crafts|Brewer": [
    "Turns malted grain into ale by the barrel. After the bakers, no trade eats more grain. It supplies both alehouses and homes.",
    "Makes ale in bulk from malted grain. The second-greatest draw on the grain supply after bread. Alehouses and households alike are stocked from here.",
  ],
  "village|Crafts|Brickmaker": [
    "Shapes and fires clay into bricks for building. With them, structures can be made to last. Clay deposits and fuel are needed.",
    "Clay is moulded and fired into building brick here, which allows sturdier, more lasting construction. The work depends on clay beds and fuel.",
  ],
  "village|Crafts|Carpenter": [
    "Houses, carts, and furniture, all his work.",
    "Raises houses, builds carts, makes furniture.",
  ],
  "village|Crafts|Cartographer's workshop": [
    "A mapmaker who draws and sells his work: road maps of the region, property surveys, and rough sketches of the wilds pieced from travellers' tales. Uncommon enough that most villages lack one.",
    "Here a craftsman renders and sells maps: regional roads, land surveys, and crude wilderness charts drawn from what travellers report. Few enough exist that the average village has none.",
  ],
  "village|Crafts|Charcoal burner": [
    "Works kilns out in the surrounding woods, producing the fuel for smiths, bakers, and hearths. Where timber runs plentiful, no fuel source is steadier.",
    "Tends charcoal kilns in the nearby woodland to feed the forge, the oven, and the fire. When timber is abundant, it is the settlement's surest supply of fuel.",
  ],
  "village|Crafts|Cobbler": [
    "Makes and mends shoes and boots. Everyone needs something on their feet, which keeps this among the steadiest trades going.",
    "Cuts and repairs footwear of every kind. Since no one goes unshod, the work never dries up.",
  ],
  "village|Crafts|Cooper": [
    "Builds barrels for storing and hauling goods.",
    "Casks for storage and carriage, all his making.",
  ],
  "village|Crafts|Dairy farmer": [
    "Runs cattle or goats for their milk, butter, and soft cheese. Vital protein and fat when the grain runs thin. What isn't used goes to the weekly market.",
    "Keeps a herd of cattle or goats, yielding milk, butter, and soft cheese; in the lean grain months these are the settlement's protein and fat. The surplus is sold at the weekly market.",
  ],
  "village|Crafts|Dyer": [
    "Colours cloth, whether raw fibre or finished weave. Without it there is nothing but undyed grey wool.",
    "Puts colour into wool and cloth, raw or woven. Anything beyond plain grey wool depends on the work.",
  ],
  "village|Crafts|Fishmonger": [
    "Buys the catch, salts it, and sells it on. The trade that carries fish from the net to the table. By the water it comes fresh; inland, dried or salted.",
    "Deals in fish: bought, salted, and sold. It bridges the fisherman and the eater. Near water the stock is fresh, further inland dried or salted.",
  ],
  "village|Crafts|Fuller": [
    "Finishes woven cloth, cleaning and thickening it, the work often driven by water. Raw weave leaves as hard-wearing textile.",
    "Cleans and felts fresh-woven cloth to finish it, frequently by water power, turning loose weave into a durable fabric.",
  ],
  "village|Crafts|Hunter's lodge": [
    "Musters hunting parties across the lands about the settlement, selling venison, pelts, and game at market. It is also where the wilderness is known best: which trails are safe and which are not.",
    "Sends out hunting parties over the surrounding country and brings venison, pelts, and game to sell. It doubles as the local authority on the wilds, the safe trails and the treacherous ones.",
  ],
  "village|Crafts|Midwife": [
    "Attends births, handles the hard labours, and gives what women's care there is. No medical service in a settlement is called upon more.",
    "Sees mothers through childbirth, works the difficult deliveries, and tends the ordinary complaints of women. The most-used healer anywhere.",
  ],
  "village|Crafts|Mill": [
    "A water- or wind-driven mill holding the sole right to grind. The miller tends to be the richest man in the village, and the least loved.",
    "Milling here is a monopoly, water or wind powered. Its keeper is usually the wealthiest villager and, for that reason, the most begrudged.",
  ],
  "village|Crafts|Mine": [
    "A shaft or working dug for iron ore, coal, or stone. It demands capital and order beyond a thorp's means, though a village on good deposits can bear it. The labour falls to the poorest.",
    "Ore, coal, or stone is won from a shaft or open cut here. The capital and organisation are more than a thorp could carry, but a village near the seams manages it, working its poorest hands.",
  ],
  "village|Crafts|Potter": [
    "Throws pottery at the wheel for the household (plates, jugs, vessels for storage) and fires it in a small kiln.",
    "Domestic ware thrown on the wheel: plates, jugs, and storage jars, all fired in a modest kiln.",
  ],
  "village|Crafts|Salt works": [
    "Evaporation pans or brine-works set along the coast or the riverbank. By weight, salt is the most traded thing the settlement produces. No household does without it.",
    "Salt won from brine or evaporation pans by the shore or river. It is the settlement's most-traded good by weight, wanted in every home.",
  ],
  "village|Crafts|Sawmill": [
    "A saw driven by water or ox, cutting raw logs into planks and beams. It lifts what building and furniture-making the village can do.",
    "Powered by water or ox, the saw reduces logs to planks and beams, widening the settlement's output of building timber and furniture.",
  ],
  "village|Crafts|Stable master": [
    "Keeps the stables and breaks horses to saddle and harness. Any settlement on a road needs one.",
    "Maintains stabling and trains horses for the saddle and the traces. Indispensable wherever a road runs through.",
  ],
  "village|Crafts|Stone quarry": [
    "Building stone cut in an ordered working. A village sitting on good quarry ground can furnish half a region's building, and the quarry master is well aware of the fact.",
    "The methodical winning of building stone. Set on the right ground, a village can meet half a region's need for it. Something the quarry master never forgets.",
  ],
  "village|Crafts|Tailor": [
    "Cuts and stitches finished cloth into clothes, filling the middle ground between the home seamstress and the master clothier.",
    "Makes garments from finished cloth, serving those above the household seamstress but below the master clothier.",
  ],
  "village|Crafts|Tannery": [
    "Turns hides to leather with oak bark. The stink of it keeps it downstream. Without it there are no shoes, no harness, no straps.",
    "Hides become leather here, cured with oak bark. It reeks, and so it sits downstream, but shoes, harness, and straps all depend on it.",
  ],
  "village|Crafts|Thatcher": [
    "Lays roofs and mends them.",
    "Builds and repairs thatch.",
  ],
  "village|Crafts|Village scribe": [
    "One of the few here who can read and write. He copies letters, sets down plain contracts, and reads out documents for those who cannot. Usually the priest's helper or a layman schooled at a monastery.",
    "Literate where most are not: copying correspondence, drawing up simple contracts, and reading papers aloud for the unlettered. As often as not the priest's assistant or a monastery-taught layman.",
  ],
  "village|Crafts|Wildfowler": [
    "Takes waterfowl and game birds with nets, traps, and trained hunting birds, bringing ducks, geese, and pigeons to market.",
    "Catches wildfowl (using snares, nets, and trained birds) to stock the market with duck, goose, and pigeon.",
  ],
  "village|Crafts|Woodcarver": [
    "Works wood into the useful and the ornamental alike (tool handles, holy figures, inlay for furniture) and makes the sacred images and reliquaries the church requires.",
    "Carves both plain and decorative pieces from wood: handles for tools, religious figures, furniture inlay. For the church he shapes sacred images and reliquaries.",
  ],
  "village|Criminal|Fence (word of mouth)": [
    "The one to see when stolen goods need moving without noise. He works from behind a legitimate trade.",
    "A quiet local hand for shifting lifted goods, screened by another line of business.",
  ],
  "village|Criminal|Smuggling network": [
    "Goods pass through the village while dodging tolls and the eyes of the law. Commonly built around one particular commodity.",
    "A route by which wares slip past tolls and legal notice, usually fixed to a single commodity.",
  ],
  "village|Criminal|Underground network": [
    "Passages dug beneath the village, through which goods move unseen.",
    "A handful of tunnels under the houses, cut to slip contraband past the law.",
  ],
  "village|Defense|Citizen militia": [
    "A community drawn up for its own defence. It turns out for raids and monster attacks, and holds together better than any hamlet levy.",
    "Organised local defence, mustered against raiders and monsters alike. Steadier than the levies a hamlet can raise.",
  ],
  "village|Defense|Palisade or earthworks": [
    "A palisade or an earthen berm around the edge. It governs the approaches and slows an attack.",
    "Perimeter stakes or a raised bank of earth, set to control the ways in and blunt an assault.",
  ],
  "village|Defense|Veteran's lodge": [
    "A drinking hall for old soldiers and mercenaries put out to pasture. It offers rough security, the odd brawl, and now and then work for a party in want of swords.",
    "Where retired soldiers and sellswords do their drinking. Security of a sort, the occasional brawl, and, from time to time, a job for anyone needing hired blades.",
  ],
  "village|Economy|Ale house": [
    "Run from the home. The brewing and selling of ale is women's work.",
    "A household trade. Women brew the ale and sell it.",
  ],
  "village|Economy|Caravanserai": [
    "A large walled compound built for desert traders: camel stabling, storage under lock, a well, and beds for fifty. Where caravans come, it is the desert settlement's economic heart.",
    "A stout walled enclosure for the desert merchant, with stabling for camels, locked stores, a well, and sleeping room for fifty. Any desert settlement on a caravan route turns about it.",
  ],
  "village|Economy|Farmland": [
    "Open fields worked in rotation.",
    "Farmed in open fields, the crops rotated.",
  ],
  "village|Economy|Fish market": [
    "An open stall or small roofed market for selling the day's catch. The price falls quickly, for fish keeps no better than a day.",
    "Where the day's catch is sold, from an open stall or a small covered market. Prices sink fast. Fish will not wait.",
  ],
  "village|Economy|River boatyard": [
    "Builds and mends flat-bottomed river craft: barges, punts, ferries, fishing boats. The work turns on river-boat knowledge: shallow draft, a hull that flexes, parts made to be replaced.",
    "River boats, all flat-bottomed, made and repaired here: barges, punts, ferries, and fishing craft. It takes a specialist's hand. Shallow in the draft, supple in the hull, and built so parts can be swapped out.",
  ],
  "village|Economy|River ferry": [
    "A flat-bottomed ferry over the river, the crossing rights held in one family for generations. Anyone unwilling to walk the distance to the nearest bridge depends on it.",
    "The river is crossed by a flat-bottomed ferry, worked by a family that has held the right to it for generations. Without it, the nearest bridge is a long walk off.",
  ],
  "village|Economy|Toll bridge": [
    "A bridge with a toll house upon it. The keeper takes the passage fees and sees to simple upkeep. The income is small but never fails.",
    "A toll house guards this bridge; its keeper gathers the crossing fees and handles the basic repairs. Modest revenue, but steady.",
  ],
  "village|Economy|Travelers' inn": [
    "The village's one inn for the traders, pilgrims, and wayfarers who pass. Beds, a stable, and a shared table.",
    "A lone inn catering to whoever the road brings: merchants, pilgrims, travellers. It offers a room, stabling, and the common meal.",
  ],
  "village|Economy|Waystation": [
    "A fortified halt for the night, with stabling, a well, and plain provisions. It serves merchant caravans and travellers going far. Unlike the inn, it is made for beasts and loaded wagons, not for comfort.",
    "An overnight stop behind walls, offering stabling, a well, and basic supplies to caravans and long-haul travellers. Where the inn sees to comfort, this sees to the animals and the laden wagons.",
  ],
  "village|Economy|Weekly market": [
    "Local produce and wares. Held under royal or noble charter.",
    "A weekly sale of local goods. A charter from crown or lord is required.",
  ],
  "village|Government|Lord's steward": [
    "A steward in the lord's service, gathering the rents and pressing the manor's authority on a village that is bound to it.",
    "Acting for the lord, the steward takes in the rents and holds the manor's writ over the bound village.",
  ],
  "village|Government|Village elder": [
    "In the want of any formal power, the oldest or most respected villager steers the decisions. Less official than a reeve, but better than no one at all.",
    "Where no formal authority exists, the eldest or best-regarded resident guides what the village decides. Short of a reeve in standing, yet steadier than a vacancy.",
  ],
  "village|Government|Village reeve": [
    "Chosen from among the peasants, he arranges the work owed, settles quarrels, and stands for the village before any outside power.",
    "A peasant elected by his own. He parcels out the labour dues, mediates disputes, and speaks for the village to those above it.",
  ],
  "village|Infrastructure|Dwellings (80-180)": [
    "Built of timber on stone footings.",
    "Timber-framed, raised on stone foundations.",
  ],
  "village|Infrastructure|Multiple water sources": [
    "Wells and springs across the village.",
    "Several wells and springs, spread through the village.",
  ],
  "village|Magic|Adventurers' charter hall": [
    "A licensed hall that posts bounties, coordinates the hunting of monsters, and musters armed help in emergencies across the surrounding land. Commoner out on the frontier.",
    "Chartered under licence, the hall sets bounties, organises monster-hunts, and answers armed emergencies for the territory about it. Found more often in frontier country.",
  ],
  "village|Magic|Druid Circle": [
    "A circle of druids bound to the land. They keep the seasons in order, treat with wild things when they trouble men, and know which streams run clean. Most at home in forest or in isolation, they still adapt. Some tend gardens in the city, or groves hidden within it.",
    "Druids gathered in a circle and rooted to the country around them, ordering the seasons, mediating quarrels with wild creatures, and knowing the clean streams from the foul. Forested and remote places suit them best, yet they bend to circumstance. A few keep city gardens or concealed urban groves.",
  ],
  "village|Magic|Healer (divine, 1st level)": [
    "Simple healing prayers. Cure Wounds runs 10 GP.",
    "Basic curative magic. A Cure Wounds costs 10 GP.",
  ],
  "village|Magic|Hedge wizard": [
    "A modest resident spellcaster. 1st to 3rd level spells.",
    "A minor caster who lives here. Spells of 1st through 3rd level.",
  ],
  "village|Religious|Graveyard": [
    "Hallowed ground about the church.",
    "Consecrated earth ringing the church.",
  ],
  "village|Religious|Parish church": [
    "The hub of village life. Built in stone. Tithes are compulsory.",
    "Stone-built and central to everything. Tithing is not optional.",
  ],
  "village|Religious|Priest (resident)": [
    "Administers the sacraments and gathers the tithe. Frequently the sole person here who can read.",
    "Says the sacraments, takes the tithe. Usually the one literate soul in the village.",
  ],
  "village|Religious|Village musician": [
    "A singer, fiddler, or piper who lives here, playing the festivals and the weddings, and in his songs keeping the local history alive.",
    "The village's own singer, fiddler, or piper, heard at every festival and wedding. Through his songs the settlement's history is remembered.",
  ],
});
