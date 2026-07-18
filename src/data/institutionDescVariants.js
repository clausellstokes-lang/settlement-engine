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
  "city|Government|Mayor and council": [
    "An elected council backed by a complete administrative staff.",
    "A civic council put in by vote, with the full apparatus of office beneath it.",
  ],
  "city|Infrastructure|City hall": [
    "A commanding seat of civic government.",
    "An imposing hall for the city's affairs.",
  ],
  "city|Magic|Mages' guild": [
    "A body of spellcasters organised together. A chapter needs 2,000 to 5,000 people.",
    "An association of magic-workers. Sustaining a chapter takes 2,000-5,000 population.",
  ],
  "city|Magic|Wizard's tower": [
    "Home to a powerful spellcaster. A city may hold more than one.",
    "The seat of a high-level mage. Several may stand in a single city.",
  ],
  "city|Religious|Cathedral (10,000+ only)": [
    "The bishop's seat. It wants at least 10,000 people to sustain it, and its presence marks a city as a major one.",
    "Seat of a bishop, and the mark of a first-rank city. Nothing under 10,000 population carries one.",
  ],
  "hamlet|Crafts|Resident smith (part-time)": [
    "Mends tools, shoes horses. Also works a plot.",
    "Tool repair and horseshoeing. Farms on the side.",
  ],
  "hamlet|Criminal|Fence (word of mouth)": [
    "Stolen property passes through the hamlet without fuss. You would know the go-between by sight, never by name.",
    "Lifted goods change hands here discreetly. The contact has a face people recognise and a name they don't use.",
  ],
  "hamlet|Defense|Citizen militia": [
    "Fit residents train and turn out when trouble comes near. Service is part-time.",
    "The able-bodied drill together and assemble against local danger. Nobody does it full-time.",
  ],
  "hamlet|Economy|Alehouse": [
    "Ale brewed at home and sold out of a back room. It doubles as the hamlet's common room — every rumour, quarrel, and bargain passes through it.",
    "Somebody's back room, a barrel of home brew, and a bench. It is where the hamlet hears its news, airs its grievances, and strikes its deals.",
  ],
  "hamlet|Government|Lord's steward": [
    "A lord's man runs the hamlet's holdings, gathers the rents, and speaks for noble authority.",
    "Acting for the lord, he administers the land, takes in rent, and imposes the noble's will.",
  ],
  "hamlet|Government|Village headman": [
    "One well-regarded resident holds sway without a mandate — nobody voted, nobody appointed, everybody accepts it. What gets decided is practical, never ceremonial.",
    "A single trusted figure runs things by common agreement rather than any office. The rulings are matters of sense, not procedure.",
  ],
  "hamlet|Religious|Wayside shrine": [
    "A plain spot for prayer. No clergy.",
    "Modest prayer marker. Unattended.",
  ],
  "metropolis|Criminal|Assassins' guild": [
    "Killing to order, done as a trade. It works through intermediaries and is never owned to in public.",
    "A professional trade in murder, screened behind cutouts and admitted by no one.",
  ],
  "metropolis|Defense|Massive walls and fortifications": [
    "Walls within walls — an outer line, an inner line, and the citadel ring. Garrison districts and gatehouses at every stage.",
    "A defence built in layers: outer wall, inner wall, and the ring about the citadel, with garrisons and gatehouses throughout.",
  ],
  "metropolis|Economy|Banking district": [
    "A whole quarter given to money — banking across borders, credit by letter, and speculation in coin at scale.",
    "The city's finance gathered into one district: international houses, letters of credit, and currency dealing on a grand scale.",
  ],
  "metropolis|Government|Palace/government complex": [
    "The heart of metropolitan or state rule — a palace with its ministries, audience halls, and clerks' bureaux.",
    "Where the metropolis or the state governs from: palace, ministries, halls of audience, and offices without number.",
  ],
  "metropolis|Magic|Academy of magic": [
    "A chartered school of the arcane, with a full course of study, laboratories, and scholars come from abroad.",
    "A formal college of magic — a complete curriculum, rooms for research, and a stream of visiting adepts.",
  ],
  "metropolis|Religious|Great cathedral": [
    "The metropolitan cathedral, seat of the region's highest prelate and a draw for pilgrims.",
    "The great church of the metropolis — the region's chief religious authority sits here, and the faithful travel to it.",
  ],
  "thorp|Criminal|Local fence": [
    "Someone here takes goods and never asks their history. The name is common knowledge. It is simply not spoken aloud.",
    "There is a person who pays for things and skips the question of where they came from. Everyone can point to the house. No one points out loud.",
  ],
  "thorp|Economy|Subsistence farming": [
    "Every household works some 12-16 acres, enough to stay alive and no more.",
    "Each family tills roughly 12-16 acres, all of it for the table.",
  ],
  "thorp|Government|Household elder": [
    "A single household head speaks for the settlement without ever being chosen to — no office, no title, no vote. Simply the door people knock on when a thing has to be settled.",
    "One head of household carries the settlement's voice by common habit rather than any appointment. Nobody named them to it; everybody defers to it anyway.",
  ],
  "thorp|Government|Lord's reeve": [
    "A distant lord's man, set here to watch the settlement and remit what it owes. His writ is legitimate; his welcome is not.",
    "Placed by a lord who never visits, he holds official charge of the settlement. The paperwork backs him. The neighbours do not.",
  ],
  "thorp|Infrastructure|Palisade": [
    "A ring of sharpened stakes around the settlement. Little real defence, but enough to turn away an idle raider.",
    "Pointed stakes driven in a rough circle. They stop nothing determined, yet enough to discourage the casual thief.",
  ],
  "thorp|Religious|Wayside shrine": [
    "A modest prayer marker. No clergy in residence.",
    "Plain wayside shrine for prayer. Unstaffed.",
  ],
  "town|Crafts|Bakers (5-15)": [
    "The town's bread. Prices fixed by the guild.",
    "Bread baked for sale, with the guild setting the price.",
  ],
  "town|Crafts|Blacksmiths (3-10)": [
    "Several smiths, each to his specialty.",
    "A number of smiths, work divided by trade.",
  ],
  "town|Criminal|Street gang": [
    "Pickpockets and bruisers working together. Ten to thirty strong.",
    "An organised crew of cutpurses and toughs, some 10 to 30 of them.",
  ],
  "town|Defense|Town walls": [
    "Gated stone defences. Costly to raise and no cheaper to keep up.",
    "Masonry walls pierced by gates. Dear to build, dearer to maintain.",
  ],
  "town|Defense|Town watch": [
    "Part-time guards who walk the night and hold the gates.",
    "Watchmen serving part-time. Night patrols and gate duty.",
  ],
  "town|Economy|Inn (multiple)": [
    "Beds for merchants on the road.",
    "Lodging for the travelling trade.",
  ],
  "town|Economy|Market square": [
    "The central plaza where the weekly market and the fairs are held. Fifty to a hundred yards to a side.",
    "A broad open square, 50 to 100 yards across, given over to market days and fairs.",
  ],
  "town|Economy|Taverns (5-20)": [
    "Houses for drink. And for company.",
    "Drinking houses, and the town's gathering places.",
  ],
  "town|Economy|Weekly market": [
    "Held by royal charter. The town's chief economic engine.",
    "Requires a charter from the crown. A principal source of the town's trade.",
  ],
  "town|Entertainment|Brothel": [
    "Prostitution, tolerated or licensed.",
    "A house of prostitution, suffered or regulated.",
  ],
  "town|Government|Mayor and council": [
    "The town's leadership, whether elected or named to office.",
    "A mayor and council, come to office by vote or appointment.",
  ],
  "town|Government|Town council": [
    "With no formal government in place, a loose council of leading citizens runs the town. It answers to no one in particular, but it beats having no one at all.",
    "Where nothing official exists, the town's notable men gather and govern by consensus. Less answerable than an elected body, and steadier than the void it fills.",
  ],
  "town|Infrastructure|Town hall": [
    "Where the town meets and its business is done.",
    "The seat of assembly and administration.",
  ],
  "town|Religious|Parish churches (2-5)": [
    "Several parishes, each with its church.",
    "The town divided among a handful of parishes.",
  ],
  "village|Crafts|Blacksmith": [
    "A full-time smith. Indispensable for tools and shoeing.",
    "Works metal full-time. Tools and horseshoes depend on him.",
  ],
  "village|Crafts|Cobbler": [
    "Makes and mends shoes and boots. Everyone needs something on their feet, which keeps this among the steadiest trades going.",
    "Cuts and repairs footwear of every kind. Since no one goes unshod, the work never dries up.",
  ],
  "village|Crafts|Midwife": [
    "Attends births, handles the hard labours, and gives what women's care there is. No medical service in a settlement is called upon more.",
    "Sees mothers through childbirth, works the difficult deliveries, and tends the ordinary complaints of women. The most-used healer anywhere.",
  ],
  "village|Crafts|Mill": [
    "A water- or wind-driven mill holding the sole right to grind. The miller tends to be the richest man in the village, and the least loved.",
    "Milling here is a monopoly, water or wind powered. Its keeper is usually the wealthiest villager and, for that reason, the most begrudged.",
  ],
  "village|Defense|Citizen militia": [
    "A community drawn up for its own defence. It turns out for raids and monster attacks, and holds together better than any hamlet levy.",
    "Organised local defence, mustered against raiders and monsters alike. Steadier than the levies a hamlet can raise.",
  ],
  "village|Economy|Ale house": [
    "Run from the home. The brewing and selling of ale is women's work.",
    "A household trade. Women brew the ale and sell it.",
  ],
  "village|Economy|Travelers' inn": [
    "The village's one inn for the traders, pilgrims, and wayfarers who pass. Beds, a stable, and a shared table.",
    "A lone inn catering to whoever the road brings — merchants, pilgrims, travellers. It offers a room, stabling, and the common meal.",
  ],
  "village|Economy|Weekly market": [
    "Local produce and wares. Held under royal or noble charter.",
    "A weekly sale of local goods. A charter from crown or lord is required.",
  ],
  "village|Government|Village reeve": [
    "Chosen from among the peasants, he arranges the work owed, settles quarrels, and stands for the village before any outside power.",
    "A peasant elected by his own — he parcels out the labour dues, mediates disputes, and speaks for the village to those above it.",
  ],
  "village|Magic|Hedge wizard": [
    "A modest resident spellcaster. 1st to 3rd level spells.",
    "A minor caster who lives here. Spells of 1st through 3rd level.",
  ],
  "village|Religious|Parish church": [
    "The hub of village life. Built in stone. Tithes are compulsory.",
    "Stone-built and central to everything. Tithing is not optional.",
  ],
  "village|Religious|Priest (resident)": [
    "Administers the sacraments and gathers the tithe. Frequently the sole person here who can read.",
    "Says the sacraments, takes the tithe. Usually the one literate soul in the village.",
  ],
});
