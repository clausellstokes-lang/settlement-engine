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
 *
 * URBAN BAND (2026-09-30): re-keyed to the registry's tiers and shelves. A row that moved
 * shelf carries its variants to the new key; a tier entry that reuses another tier's
 * canonical desc reuses that desc's variants; the 28 descs new that day were authored in
 * the same register, prices stated relatively (the price-heuristics law, ODQ §776).
 *
 * ONE COPY PER VARIANT PAIR (2026-09-30): a tier entry that reuses another tier's canonical desc
 * reuses that desc's variants, so the same pair would otherwise be spelled once per tier (518 keys,
 * 332 distinct pairs). Each pair is spelled once in PAIRS and every key that shares it points at
 * the same array; the exported object is deep-equal to the spelled-out table, key for key and
 * string for string, so no reader and no draw can tell the difference. The generation worker
 * carries this file, and its byte ceiling is signed.
 */
const PAIRS = [
  [
    "Every household works just enough land to stay alive, and no more.",
    "Each family tills a small holding, all of it for the table.",
  ],
  [
    "A shared cellar for grain, roots, and preserved food. It is what stands between the thorp and a failed harvest.",
    "Grain, roots, and preserves kept in a common underground store. The settlement's guard against a bad year.",
  ],
  [
    "Nets, traps, and racks for drying. Whoever fishes the water here keeps them.",
    "The nets, the traps, the drying racks, worked by the fishing households whenever fish can be had.",
  ],
  [
    "The flock is held and worked in common, and the thorp keeps time by the grazing calendar.",
    "One shared flock, tended together. The grazing seasons set the rhythm of the place.",
  ],
  [
    "Felling and stacking timber by the season. The whole camp smells of fresh sawdust and pine resin.",
    "Timber cut and stacked when the season allows, and the air over the thorp is all sawdust and resin.",
  ],
  [
    "Grain goes to the manor or village mill; grinding it at home is commonly against the law.",
    "No mill of its own. The manor's or the village's must serve, and milling at home is often forbidden.",
  ],
  [
    "A modest prayer marker. No clergy in residence.",
    "Plain wayside shrine for prayer. Unstaffed.",
  ],
  [
    "Services mean a walk of a few miles to the village house of worship.",
    "The nearest house of worship is the village's, a walk of a few miles away for services.",
  ],
  [
    "A turf-banked corner of the holding, kept out of the plough and marked with fieldstones. No clergy is near enough to speak, so the words fall to whoever knew the dead best.",
    "Fieldstones on a low bank at the edge of the ploughland. The rites are said by neighbours because there is nobody else to say them, and the weathered markers are kept clear regardless.",
  ],
  [
    "The oldest or best-regarded farmer steers the common decisions, and does it by agreement.",
    "Communal matters fall to the eldest or most respected farmer, who guides them to consensus.",
  ],
  [
    "Every head of household has an equal say in shared concerns. Slower to decide, but the fairer for it.",
    "Common matters are settled by all the family heads together, each voice equal. It is unhurried, and the more egalitarian for that.",
  ],
  [
    "A distant lord's officer, set here to watch the settlement and remit what it owes. The writ is legitimate; the welcome is not.",
    "Placed by a lord who never visits, this officer holds official charge of the settlement. The paperwork backs the office. The neighbours do not.",
  ],
  [
    "A single household head speaks for the settlement without ever being chosen to. No office, no title, no vote. Simply the door people knock on when a thing has to be settled.",
    "One head of household carries the settlement's voice by common habit, with no appointment behind it. Nobody named them to it; everybody defers to it anyway.",
  ],
  [
    "Wattle-and-daub or timber, one or two rooms to a household.",
    "Timber or wattle-and-daub houses, each of a room or two.",
  ],
  [
    "A well or a spring, yielding at least a bucketful a person each day.",
    "Water from a well or spring, barely a bucketful per person each day.",
  ],
  [
    "A ring of sharpened stakes around the settlement. Little real defence, but enough to turn away an idle raider.",
    "Pointed stakes driven in a rough circle. They stop nothing determined, yet enough to discourage the casual thief.",
  ],
  [
    "When danger reaches the fields, each household sends one able-bodied adult with a hunting bow, spear, or whatever farm tool can serve as a weapon.",
    "One fit adult musters from every household when the alarm is raised. Their arms are hunting bows, spears, and sharpened tools; no one has a soldier's kit.",
  ],
  [
    "Someone here takes goods and never asks their history. The name is common knowledge. It is simply not spoken aloud.",
    "There is a person who pays for things and skips the question of where they came from. Everyone can point to the house. No one points out loud.",
  ],
  [
    "Someone here will hide a person who needs to vanish. A barn, a cellar, a bargain no one speaks of.",
    "There is cover here for those who must disappear: a loft, a cellar, an understanding that stays unspoken.",
  ],
  [
    "Strips worked in the open fields.",
    "Open-field farming, parcelled into strips.",
  ],
  [
    "Open pasture the hamlet grazes in common.",
    "Common ground where the settlement's beasts are pastured together.",
  ],
  [
    "A crude landing hung with racks for drying and salting the catch. Near water, and whenever fish can be had, it is the chief source of protein.",
    "A rough jetty and its salting-and-drying racks, where the hamlet's catch is landed and cured whenever fish can be had.",
  ],
  [
    "Keeps flocks of sheep for wool and mutton, driving them by season between the low winter pastures and the high summer grazing. Wool is what the flocks are chiefly kept for.",
    "Runs sheep for their wool and meat, moving the flocks with the seasons: down to the lowland in winter, up to the hills in summer. Wool is the first of what the flocks yield.",
  ],
  [
    "Milk, butter, and cheese from cattle or goats, whenever livestock can be had. The work is seasonal, and heaviest in summer.",
    "A dairy for milk, butter, and cheese, from a herd of cattle or goats, whenever livestock can be had. Seasonal work, cresting in the summer months.",
  ],
  [
    "A forest-edge camp of fellers and a yard where the logs are stacked. Timber and the hauling of it are the camp's whole living.",
    "Axe crews work the treeline and stack their cut in a yard nearby. The crews live by timber and the carting of it.",
  ],
  [
    "Tends kilns out in the nearby woods, supplying the fuel that smiths and bakers burn. The necessary link between forest and forge.",
    "Works kilns in the woodland close by, turning timber into the fuel that burns hottest. Without the kilns nothing gets from the trees to the fire.",
  ],
  [
    "Cuts peat from the marsh nearby and dries it into blocks for the hearth. Seasonal work: what it sells is winter warmth.",
    "Digs and dries peat blocks from the neighbouring marshland to burn at home. The trade is seasonal, and the thing sold is warmth against the winter.",
  ],
  [
    "A shallow working or shaft sunk for iron ore, coal, or stone. It takes on the poorest hands, and the work is dangerous, filthy, and indispensable.",
    "Iron ore, coal, or stone dug from a shallow pit or shaft. The labour falls to the poorest, and it is perilous, grimy, and needed all the same.",
  ],
  [
    "A stone quarry, its blocks cut and dressed by a gang of quarrymen with picks and wedges. Slow going, and the only proper building material the place has had.",
    "A quarry opened with picks and wedges, its stone cut and dressed for building by hand. Slow work, and the only real building stone the place has known.",
  ],
  [
    "Boils or dries saline brine whenever brine can be had, yielding the raw salt that preserves food. It works best where workable brine lies close by.",
    "Evaporates brine, whenever brine can be had, to leave salt behind: the raw mineral used to preserve nearly everything. A strong brine source close by serves it best.",
  ],
  [
    "Hunters share what they know, dress their game, and sell the pelts. Among them they keep the routes, the seasons, and the beasts worth avoiding.",
    "A gathering of hunters who trade knowledge, butcher game, and deal in furs, keeping account of trails, seasons, and which animals mean harm.",
  ],
  [
    "A trading day held monthly or by season. There is no charter behind it, only habit, nearness, and a flat patch of ground.",
    "Monthly or seasonal, the market gathers without any charter to sanction it. Sustained by custom, by convenience, and by a level piece of earth.",
  ],
  [
    "Lends against goods left in pledge, at steep interest and no questions asked. For peasants and small craftsmen it is the only credit going.",
    "Money advanced on pawned goods, dear in interest and incurious as to origin. The one source of credit a peasant or a minor craftsman can reach.",
  ],
  [
    "A room over the stable and a shared meal for whoever the road brings through. It exists because the road does.",
    "Lodging above the stable and a common table for passing travellers. Were there no road, there would be no inn.",
  ],
  [
    "Ale brewed at home and sold out of a back room. It doubles as the hamlet's common room. Every rumour, quarrel, and bargain passes through it.",
    "Somebody's back room, a barrel of home brew, and a bench. It is where the hamlet hears its news, airs its grievances, and strikes its deals.",
  ],
  [
    "A walled waystation offering merchants, their beasts, and their goods a safe night's rest. It is the hinge of the desert trade (water, fodder, and protection, all for a fee), and without it no caravan crosses the country around in safety.",
    "Behind its walls, merchants shelter their animals and cargo overnight in security. Water, fodder, and guard are had here for payment, and it stands at the heart of the desert trade; lacking one, no caravan can safely make the surrounding passage.",
  ],
  [
    "Deals in mules, donkeys, and draft horses, buying and selling, and hires them out to travellers and merchants who need something to carry a load down the road.",
    "Buys and sells mules, donkeys, and draft horses, and rents them to whoever on the road wants carrying power. Traveller or merchant alike.",
  ],
  [
    "A shared stable where travellers may leave their horses, the stableman offering rough farriery and fodder.",
    "A common stable for travellers to lodge their mounts; the stableman sees to basic shoeing and feed.",
  ],
  [
    "The hamlet's grain is carried elsewhere to be ground.",
    "Nothing is ground here; the grain goes out of the hamlet for grinding.",
  ],
  [
    "Turns barley into malt for the brewers. A small concern feeding the local alehouses, and one that only runs when grain is in surplus.",
    "Malts barley for brewing on a modest scale, supplying the alehouses nearby. It needs grain to spare before it can work at all.",
  ],
  [
    "Mends tools, shoes horses. Also works a plot.",
    "Tool repair and horseshoeing. Farms on the side.",
  ],
  [
    "Puts up buildings and mends them, and makes tools besides.",
    "Raises and repairs both structures and tools.",
  ],
  [
    "A plain spot for prayer. No clergy.",
    "Modest prayer marker. Unattended.",
  ],
  [
    "The nearest house of worship is the village's, usually a few miles off.",
    "None of its own; the village's lies usually a few miles away.",
  ],
  [
    "A walled plot gated against livestock, kept by the households in turn. The rite waits for a priest passing through; the burial does not.",
    "A gated ground at the settlement edge, tended household by household. Families lie in rows by house, whatever their standing; that is custom here, not want.",
  ],
  [
    "A free hamlet, with no lord's man set over it; the elders, agreeing among themselves, settle what the community holds in common.",
    "No lord's representative stands here. The hamlet is free, and its shared affairs are decided by the common consent of its elders.",
  ],
  [
    "A lord's agent runs the hamlet's holdings, gathers the rents, and speaks for noble authority.",
    "The office acts for the lord: it administers the land, takes in rent, and imposes the noble's will.",
  ],
  [
    "One well-regarded resident holds sway without a mandate. Nobody voted, nobody appointed, everybody accepts it. What gets decided is practical, never ceremonial.",
    "A single trusted figure runs things by common agreement, holding no office. The rulings are matters of sense, not procedure.",
  ],
  [
    "Timber-framed houses under thatch.",
    "Frames of timber, roofed with thatch.",
  ],
  [
    "A dug well, or a spring within reach.",
    "Water drawn from a well or a nearby spring.",
  ],
  [
    "A plain wooden palisade, or a bank of earth. Enough to slow a raid or a wandering beast, no more.",
    "A rough timber palisade or an earthen berm. It checks raiders and creatures without stopping them.",
  ],
  [
    "Fit residents train and turn out when trouble comes near. Service is part-time.",
    "The able-bodied drill together and assemble against local danger. Nobody does it full-time.",
  ],
  [
    "Turns up now and then. Nothing above the smallest spells.",
    "Comes by on occasion. The smallest magic and no higher.",
  ],
  [
    "A plain hall held under a regional adventurers' charter. It posts bounties, houses monster hunters, and takes up the local defence no garrison is here to keep. You find them along dangerous frontiers.",
    "Chartered by the region's adventuring order and little more than a rough hall for it. Bounties go up on its board, monster hunters bed down inside, and with no garrison to call on it musters the defence. A frontier fixture where the country is dangerous.",
  ],
  [
    "Stolen property passes through the hamlet without fuss. You would know the go-between by sight, never by name.",
    "Lifted goods change hands here discreetly. The contact has a face people recognise and a name they don't use.",
  ],
  [
    "A household or two here keep quiet ties to the bandits who work the roads about. News, shelter, and goods pass in both directions.",
    "Somewhere among these homes are people bound to the road-bandits nearby. What flows between them (word, refuge, supply) flows both ways.",
  ],
  [
    "Goods route through the hamlet to slip past the toll roads and customs posts. It is paid for the service in kind, and glad of it.",
    "Contraband moves through here, skirting the tolls and the customs checks. The hamlet takes its cut in goods, not coin.",
  ],
  [
    "Open fields worked in rotation.",
    "Farmed in open fields, the crops rotated.",
  ],
  [
    "Pasture the whole village grazes in common, lying beside the open fields.",
    "Common grazing held by the village as a whole, next to the open fields, for every household's beasts.",
  ],
  [
    "Buys fish whenever fish can be had, salts it, and sells it on. The trade that carries fish from the net to the table. By the water it comes fresh; inland, dried or salted.",
    "Deals in fish, whenever fish can be had: bought, salted, and sold. It bridges the fisherman and the eater. Near water the stock is fresh, further inland dried or salted.",
  ],
  [
    "An open stall or small roofed market for selling the day's catch. The price falls quickly, for fish keeps no better than a day.",
    "Where the day's catch is sold, from an open stall or a small covered market. Prices sink fast. Fish will not wait.",
  ],
  [
    "Milk, butter, and soft cheese from cattle or goats, whenever livestock can be had. What isn't used is sold on.",
    "A herd of cattle or goats, whenever livestock can be had, for milk, butter, and soft cheese. Any surplus is sold on.",
  ],
  [
    "Keeps hives for their honey and wax. The honey sweetens; the beeswax goes to candles, seals, and polish.",
    "Tends bees for honey and beeswax alike. One to sweeten food, the other for candles, wax seals, and polish.",
  ],
  [
    "Takes waterfowl and game birds with nets, traps, and trained hunting birds, bringing ducks, geese, and pigeons to market.",
    "Catches wildfowl (using snares, nets, and trained birds) to stock the market with duck, goose, and pigeon.",
  ],
  [
    "Works kilns out in the surrounding woods, producing the fuel for smiths, bakers, and hearths. Where timber runs plentiful, no fuel source is steadier.",
    "Tends charcoal kilns in the nearby woodland to feed the forge, the oven, and the fire. When timber is abundant, it is the settlement's surest supply of fuel.",
  ],
  [
    "A shaft or working dug for iron ore, coal, or stone. It demands capital and order beyond a thorp's means, though a village on good deposits can bear it. The labour falls to the poorest.",
    "Ore, coal, or stone is won from a shaft or open cut here. The capital and organisation are more than a thorp could carry, but a village near the seams manages it, working its poorest hands.",
  ],
  [
    "A building-stone quarry laid out in an ordered working. A village sitting on good quarry ground can furnish half a region's building, and the quarry master is well aware of the fact.",
    "A quarry for building stone, opened with method. Set on the right ground, a village can meet half a region's need for it. Something the quarry master never forgets.",
  ],
  [
    "Evaporation pans and brine-works for making salt whenever brine can be had, and no household does without salt.",
    "Broad evaporation pans, where salt is won from brine whenever brine can be had. Salt is a necessity in every home.",
  ],
  [
    "Musters hunting parties across the lands about the settlement, selling venison, pelts, and game at market. It is also where the wilderness is known best: which trails are safe and which are not.",
    "Whenever game can be had, it sends out hunting parties over the surrounding country and brings back venison, pelts, and game to sell. It doubles as the local authority on the wilds, the safe trails and the treacherous ones.",
  ],
  [
    "Local produce and wares. Held under charter.",
    "A weekly sale of local goods. A charter from crown or lord is required.",
  ],
  [
    "The village's one inn for the traders, pilgrims, and wayfarers who pass. Beds, a stable, and a shared table.",
    "A lone inn catering to whoever the road brings: merchants, pilgrims, travellers. It offers a room, stabling, and the common meal.",
  ],
  [
    "Run from the home. Ale is brewed and sold under the same roof.",
    "A household trade. The ale is brewed at home and sold there.",
  ],
  [
    "A large walled compound built for desert traders: camel stabling, storage under lock, a well, and beds for fifty. Where caravans come, it is the desert settlement's economic heart.",
    "A stout walled enclosure for the desert merchant, with stabling for camels, locked stores, a well, and sleeping room for fifty. Any desert settlement on a caravan route turns about it.",
  ],
  [
    "A fortified halt for the night, with stabling, a well, and plain provisions. It serves merchant caravans and travellers going far. Unlike the inn, it is made for beasts and loaded wagons, not for comfort.",
    "An overnight stop behind walls, offering stabling, a well, and basic supplies to caravans and long-haul travellers. Where the inn sees to comfort, this sees to the animals and the laden wagons.",
  ],
  [
    "A yard where carters, teamsters, and pack-drivers take on road work. Drivers back from the road trade news of the way and of bandits over ale. A matter of hire, not of guild.",
    "Here one hires carters, teamsters, and pack-drivers for a journey. Those lately returned swap road conditions and bandit sightings over a cup. Transactional, never institutional.",
  ],
  [
    "Keeps the stables and breaks horses to saddle and harness. Any settlement on a road needs one.",
    "Maintains stabling and trains horses for the saddle and the traces. Indispensable wherever a road runs through.",
  ],
  [
    "A flat-bottomed ferry over the river, the crossing rights held in one family. Carts, beasts and walkers wait their turn on the bank.",
    "The river is crossed here by a flat-bottomed ferry, worked by the family that holds the right to it.",
  ],
  [
    "Builds and mends flat-bottomed river craft: barges, punts, ferries, fishing boats. The work turns on river-boat knowledge: shallow draft, a hull that flexes, parts made to be replaced.",
    "River boats, all flat-bottomed, made and repaired here: barges, punts, ferries, and fishing craft. It takes a specialist's hand. Shallow in the draft, supple in the hull, and built so parts can be swapped out.",
  ],
  [
    "A bridge with a toll house upon it. The keeper takes the passage fees and sees to simple upkeep. The income is small but never fails.",
    "A toll house guards this bridge; its keeper gathers the crossing fees and handles the basic repairs. Modest revenue, but steady.",
  ],
  [
    "Water or wind drives the grindstones, and with them goes the sole right to grind. Whoever keeps them tends to be the richest in the village, and the least loved.",
    "Milling here is a monopoly, water or wind powered. Its keeper is usually the wealthiest villager and, for that reason, the most begrudged.",
  ],
  [
    "A full-time smith. Indispensable for tools and shoeing.",
    "Works metal full-time. Tools and horseshoes depend on this work.",
  ],
  [
    "Houses, carts, and furniture, all of it made here.",
    "Raises houses, builds carts, makes furniture.",
  ],
  [
    "Lays roofs and mends them.",
    "Builds and repairs thatch.",
  ],
  [
    "Builds barrels for storing and hauling goods.",
    "Casks for storage and carriage, all made here.",
  ],
  [
    "Herbal medicines, poultices, and everyday remedies for sale. Nothing magical here, no acid flasks. The proprietor knows the roots that break a fever and the mushrooms that end a life. Herbalism supplies on hand.",
    "Sells poultices, common cures, and medicines drawn from herbs. Magical compounds and acid are no part of this trade. Its keeper can name which root treats fever and which mushroom kills, and keeps herbalism supplies in stock.",
  ],
  [
    "Bows, crossbows, and arrows all made here. Finished ammunition sells off the shelf, and custom bows are made to order. Any adventurer with an empty quiver comes here first.",
    "Turns out bows, crossbows, and arrows, selling ready-made ammunition and taking commissions for bespoke bows. The first door an adventurer knocks on when the quiver runs dry.",
  ],
  [
    "A saw driven by water or ox, for cutting raw logs into planks and beams whenever logs can be had, for building and furniture-making.",
    "Powered by water or ox, the saw reduces logs to planks and beams whenever logs can be had, for building timber and furniture.",
  ],
  [
    "Turns malted grain into ale by the barrel. Only bread takes more of the grain. It supplies both alehouses and homes.",
    "Makes ale in bulk from malted grain. The second-greatest draw on the grain supply after bread. Alehouses and households alike are stocked from here.",
  ],
  [
    "Turns hides to leather with oak bark, whenever hides can be had. The stink of it keeps it downstream. Without it there are no shoes, no harness, no straps.",
    "Hides become leather here whenever hides can be had, cured with oak bark. It reeks, and so it sits downstream, but shoes, harness, and straps all depend on it.",
  ],
  [
    "Finishes woven cloth, cleaning and thickening it, the work often driven by water. Raw weave leaves as hard-wearing textile.",
    "Cleans and felts fresh-woven cloth to finish it, frequently by water power, turning loose weave into a durable fabric.",
  ],
  [
    "Colours cloth, whether raw fibre or finished weave. Without it there is nothing but undyed grey wool.",
    "Puts colour into wool and cloth, raw or woven. Anything beyond plain grey wool depends on the work.",
  ],
  [
    "Pottery for the household (plates, jugs, vessels for storage), thrown at the wheel and fired in a small kiln whenever clay can be had.",
    "A wheel and a modest kiln for domestic ware: plates, jugs, and storage jars, made whenever clay can be had.",
  ],
  [
    "Shapes and fires clay into bricks for building, whenever clay can be had. With them, structures can be made to last. Clay and fuel are needed.",
    "Moulds and a kiln for building brick, fired whenever clay can be had; brick allows sturdier, more lasting construction. The work depends on clay and fuel.",
  ],
  [
    "Makes and mends shoes and boots. Everyone needs something on their feet, which keeps this among the steadiest trades going.",
    "Cuts and repairs footwear of every kind. Since no one goes unshod, the work never dries up.",
  ],
  [
    "Cuts and stitches finished cloth into clothes, filling the middle ground between the home seamstress and the master clothier.",
    "Makes garments from finished cloth, serving those above the household seamstress but below the master clothier.",
  ],
  [
    "Attends births, handles the hard labours, and gives what women's care there is. No medical service in a settlement is called upon more.",
    "Sees mothers through childbirth, works the difficult deliveries, and tends the ordinary complaints of women. The most-used healer anywhere.",
  ],
  [
    "Works wood into the useful and the ornamental alike (tool handles, holy figures, inlay for furniture) and makes the sacred images and reliquaries the church requires.",
    "Carves both plain and decorative pieces from wood: handles for tools, religious figures, furniture inlay. Sacred images and reliquaries are carved here too.",
  ],
  [
    "One of the few here who can read and write: letters copied, plain contracts set down, documents read out for those who cannot. Usually schooled at a monastery, or by whoever here could teach.",
    "Literate where most are not: copying correspondence, drawing up simple contracts, and reading papers aloud for the unlettered. As often as not the priest's assistant or a monastery-taught layman.",
  ],
  [
    "A mapmaker's workshop, drawing and selling road maps of the region, property surveys, and rough sketches of the wilds pieced from travellers' tales. Uncommon enough that most villages lack one.",
    "Here a craftsman renders and sells maps: regional roads, land surveys, and crude wilderness charts drawn from what travellers report. Few enough exist that the average village has none.",
  ],
  [
    "A small shrine by the road at the edge of the parish. No priest keeps it.",
    "A prayer marker set beside the road where the parish ends, with no clergy of its own.",
  ],
  [
    "The hub of village life. Built in stone. Tithes are compulsory.",
    "Stone-built and central to everything. Tithing is not optional.",
  ],
  [
    "Hallowed ground about the church.",
    "Consecrated earth ringing the church.",
  ],
  [
    "Administers the sacraments and gathers the tithe. Frequently the sole person here who can read.",
    "Says the sacraments, takes the tithe. Usually the one literate soul in the village.",
  ],
  [
    "A circle of druids bound to the land. They keep the seasons in order, treat with wild things when they trouble men, and know which streams run clean. Most at home in forest or in isolation, they still adapt. Some tend gardens in the city, or groves hidden within it.",
    "Druids gathered in a circle and rooted to the country around them, ordering the seasons, mediating quarrels with wild creatures, and knowing the clean streams from the foul. Forested and remote places suit them best, yet they bend to circumstance. A few keep city gardens or concealed urban groves.",
  ],
  [
    "Shared business is settled by the elders together. There is no reeve and no steward; the old families decide among themselves.",
    "No reeve, no steward. The village's old families meet as elders and settle common affairs between them.",
  ],
  [
    "A steward in the lord's service, gathering the rents and pressing the manor's authority on a village that is bound to it.",
    "Acting for the lord, the steward takes in the rents and holds the manor's writ over the bound village.",
  ],
  [
    "Chosen from among the peasants to arrange the work owed, settle quarrels, and stand for the village before any outside power.",
    "A peasant elected by the others, to parcel out the labour dues, mediate disputes, and speak for the village to those above it.",
  ],
  [
    "The oldest or most respected villager steers the decisions on standing alone, holds no office, and is heeded all the same.",
    "The eldest or best-regarded resident guides what the village decides: an authority of regard, not of office.",
  ],
  [
    "Built of timber on stone footings.",
    "Timber-framed, raised on stone foundations.",
  ],
  [
    "Wells and springs across the village.",
    "Several wells and springs, spread through the village.",
  ],
  [
    "A palisade or an earthen berm around the edge. It governs the approaches and slows an attack.",
    "Perimeter stakes or a raised bank of earth, set to control the ways in and blunt an assault.",
  ],
  [
    "A community drawn up for its own defence. It turns out for raids and monster attacks, and holds together better than any hamlet levy.",
    "Organised local defence, mustered against raiders and monsters alike. Steadier than the levies a hamlet can raise.",
  ],
  [
    "A drinking hall for old soldiers and mercenaries put out to pasture. It offers rough security, the odd brawl, and now and then work for a party in want of swords.",
    "Where retired soldiers and sellswords do their drinking. Security of a sort, the occasional brawl, and, from time to time, a job for anyone needing hired blades.",
  ],
  [
    "A modest resident spellcaster. Minor spells only.",
    "A minor caster who lives here. Minor spells and no greater.",
  ],
  [
    "Casts basic healing spells. Closing a wound costs more than most households earn in a month.",
    "A healer of simple spells, whose fee for closing a wound is more than a household sees in a month.",
  ],
  [
    "A licensed hall that posts bounties, coordinates the hunting of monsters, and musters armed help in emergencies across the surrounding land. Commoner out on the frontier.",
    "Chartered under licence, the hall sets bounties, organises monster-hunts, and answers armed emergencies for the territory about it. Found more often in frontier country.",
  ],
  [
    "The one to see when stolen goods need moving without noise. The dealing is done from behind a legitimate trade.",
    "A quiet local hand for shifting lifted goods, screened by another line of business.",
  ],
  [
    "Passages dug beneath the village, through which goods move unseen.",
    "A handful of tunnels under the houses, cut to slip contraband past the law.",
  ],
  [
    "A singer, fiddler, or piper who lives here, playing the festivals and the weddings, and in song keeping the local history alive.",
    "The village's own singer, fiddler, or piper, heard at every festival and wedding. Through those songs the settlement's history is remembered.",
  ],
  [
    "Covered stalls under the wardens' eye, selling the morning's catch or the week's salted barrels by weight whenever fish can be had, each checked for rot.",
    "The market wardens keep a roofed fish market where, whenever fish can be had, fresh catch and salted barrels are weighed out and inspected before sale.",
  ],
  [
    "Crews tend kilns out in the woods and sell charcoal to smelters, smiths, and bakers. The metal trades here use up a forest a generation.",
    "Charcoal from woodland kilns feeds the smelters, the smithies, and the bake ovens. At this pace of metalwork, a forest lasts a generation.",
  ],
  [
    "A mine of shafts and adits, with winding gear and ore carts at the head, worked whenever ore can be had.",
    "A shaft driven into the deposits, with winding gear and ore carts at the pithead, worked whenever ore can be had.",
  ],
  [
    "A stone quarry, with yards beside it for dressing the stone, worked whenever good stone can be had.",
    "Yards for dressing stone stand beside the quarry face, at work whenever good stone can be had.",
  ],
  [
    "Held by charter. The heart of the town's trade.",
    "Requires a market charter. A principal source of the town's trade.",
  ],
  [
    "The central plaza where the weekly market and the fairs are held.",
    "A broad open square given over to market days and fairs.",
  ],
  [
    "Merchants from across the region, and luxuries to be had.",
    "A yearly draw for regional traders, with fine goods on offer.",
  ],
  [
    "Each holds a grip on the trade in its particular wares.",
    "Trade in certain goods runs through their hands alone.",
  ],
  [
    "Foreign coin exchanged. The first stirrings of banking.",
    "They change coin from abroad. Banking in its infancy.",
  ],
  [
    "Takes pledges and lends at steep interest, no questions asked. It is the only credit for labourers, journeymen, and whoever the banks refuse.",
    "High-interest loans against pledged goods, with no questions. For labourers, journeymen, and anyone the banks will not serve, it is the only lender.",
  ],
  [
    "Beds for merchants on the road.",
    "Lodging for the travelling trade.",
  ],
  [
    "Houses for drink. And for company.",
    "Drinking houses, and the town's gathering places.",
  ],
  [
    "Built for the road: relay stabling, coaches on a schedule, meals at set hours, and a room for waiting passengers. Horses are changed here, not merely rested.",
    "A house made for travellers by coach: fresh horses stabled, departures timed, fixed mealtimes, and a passengers' waiting room. The teams are swapped out, not just given a rest.",
  ],
  [
    "Coordinates caravan assembly, departure times, and word of the roads. Merchants register cargo, take on guards, and pool ventures here.",
    "Where regional caravans are mustered, scheduled, and briefed on their routes. Traders enrol their goods, hire escorts, and strike joint ventures.",
  ],
  [
    "A guild of carters, teamsters, and pack-drivers who haul goods overland for pay. They know every road, every toll, and every road shut by season, and price their work by it.",
    "Professional carters and teamsters, organised, moving cargo across country for hire. Every route, levy, and winter closure is known to them, and billed for.",
  ],
  [
    "Stabling, horse-dealing, and farriery gathered in one quarter, serving merchants, soldiers, and travellers in want of a fresh mount.",
    "A district given to stables, horse-trade, and the farrier's craft, for any merchant, soldier, or traveller needing a new mount.",
  ],
  [
    "Horses, dogs and falcons, broken and trained to order.",
    "Horses, dogs, and falcons, each trained for its work.",
  ],
  [
    "Keeps relay horses at the coaching inn for fast message riders. Letters and small parcels move far faster than anyone on foot.",
    "A relay of fresh horses stabled at the coaching inn carries letters and small packages far faster than foot traffic could.",
  ],
  [
    "Builds and mends ocean-going merchantmen. It wants a steady supply of timber, iron fittings, and skilled shipwrights. A great employer, and a heavy investment of capital.",
    "Sea-going trade vessels are built and repaired here, on a footing of constant timber, iron fittings, and specialist labour. It employs many and ties up much capital.",
  ],
  [
    "A fleet of river barges working scheduled and commissioned runs. It carries bulk cargo, passengers, and military supply along the river network.",
    "River barges run in fleet, some to a schedule and some to order. Bulk freight, passengers, and army supply all move on them through the river network.",
  ],
  [
    "A dock on river or coast. Bulk trade and river carriage depend on it.",
    "Coastal or riverside wharfage, without which no heavy water-borne trade moves.",
  ],
  [
    "It orders waterborne traffic, gathers anchorage fees, assigns the berths, and enforces port law.",
    "Traffic is regulated here, anchorage fees collected, berths handed out, and sea-law enforced.",
  ],
  [
    "Duties are taken here on goods passing through the port or the main roads. Royal or municipal officers run it.",
    "Levies charged on all trade in and out by road or harbour, collected by officials of crown or town.",
  ],
  [
    "Shared grain stores that even out the harvests and hold off famine.",
    "Grain kept in common, a hedge against lean harvests and hunger.",
  ],
  [
    "Storage for merchants' goods held back for sale, transit, or the season's distribution. No trade-route settlement does without it.",
    "Warehouses where traders keep stock awaiting sale, shipment, or seasonal release. Indispensable to any town on a trade route.",
  ],
  [
    "Heated water for communal bathing. Some places treat it as a gathering-house, others eye it as a den of vice, but nowhere in town carries more rumour and news.",
    "A shared bath fed with heated water, prized as a social hub in one culture and mistrusted as a haunt of vice in another. Whichever it is, it is where the town's talk collects.",
  ],
  [
    "Enslaved people sold at public auction. Taken in war, ruined by debt, condemned by court, or trafficked. Where the law permits slavery, this counts as civic commerce.",
    "A public sale of the enslaved: war captives, debtors, convicts, and the trafficked. In places where slavery is lawful, it stands as ordinary commercial infrastructure.",
  ],
  [
    "A formal house for the sale of costly goods: estates, ships, livestock, art, and now and then a whole household's goods. It takes a premium from buyer and seller both.",
    "The recognised venue for high-value lots, be they estates, ships, livestock, art, or on occasion a debtor's whole house. Both buyer and seller pay its premium.",
  ],
  [
    "Tests the purity of precious metals brought in. Infrastructure without which banking and minting cannot work. It charges by the assay.",
    "Precious metals are proved here for their fineness, a necessity for any bank or mint. A fee is taken on each test.",
  ],
  [
    "Turns refined precious metal into standard coin. It runs only under noble or royal charter, and earns the granting authority no small revenue.",
    "Coin of uniform standard struck from refined precious metal. A noble or royal charter is required, and the grant brings its holder considerable revenue.",
  ],
  [
    "A small licensed register office among much larger trades. It pays for arrivals and writes them down: who, from where, and carrying word of what.",
    "The modest end of the news trade. A paid register of who came into the city and what they reported, kept openly and taxed like any other counter.",
  ],
  [
    "Several sites grind the town's grain.",
    "The town's grain is ground at a handful of sites.",
  ],
  [
    "Several ironworkers, each to a specialty.",
    "A number of smiths, work divided by trade.",
  ],
  [
    "Sets precious metal and gemstones into rings, necklaces, seals, and other luxuries. The work is to commission; stones are valued, and now and then bought from customers who keep quiet about provenance.",
    "Rings, necklaces, seals, and finery, worked from gold and gemstone. Orders are taken, stones appraised, and the occasional purchase from a discreet seller is not refused.",
  ],
  [
    "Builders and makers of furniture.",
    "They raise buildings and craft furniture both.",
  ],
  [
    "A proper shop kept by a trained herbalist, its shelves stocked and a back room set aside for consultations. It sells herbalism kit supplies, common antidotes, medicinal herbs, and basic surgical dressings. A few of its keepers also work as chirurgeons.",
    "An established herbalist's shop, well stocked, with a back room for private consultation. On offer are herbalism kit supplies, common antidotes, medicinal herbs, and simple surgical dressings, and some apothecaries here double as chirurgeons.",
  ],
  [
    "Several craftsmen banded into a guild. Standard arrows by the sheaf, specialty broadheads, and composite bows made to order. They restock the merchant caravans and arm their guards.",
    "A guild of bowyers and fletchers. Arrows come by the sheaf, broadheads to specialty, and composite bows on commission. Enough to resupply the caravans and outfit their guards.",
  ],
  [
    "A mill driven by water or ox, cutting planks and beams for builders. Sited near timber, it can meet a whole region's building needs. The crew is permanent.",
    "Water or ox power turns logs into planks and beams for the construction trade. A town with timber to hand supplies the region's building work, and keeps a standing crew to do it.",
  ],
  // BAR3-PLACES (H4, 2026-11-15): no beer sent beyond the town (a brewery stands where no beer is exported): both texts
  // claim the taverns, the grain and the hands only.
  [
    "Ale and beer brewed at commercial scale, supplying the town's taverns. It eats grain and hires hands in quantity.",
    "A brewery working at commercial scale. It keeps the taverns stocked, and stands among the larger buyers of grain and employers in the town.",
  ],
  [
    "A cellar of presses and casks for wine, from grapes grown near or must brought in, whenever either can be had. Such wine as it holds goes by the barrel, and by the bottle to the rich.",
    "Wine pressed and matured from local fruit or imported must, when either comes to the cellar, and sold in bulk or direct to wealthy houses.",
  ],
  [
    "Leather-making. Kept downstream and downwind wherever the ground allows.",
    "The making of leather. Sited downwind and downstream of the rest where a town can manage it.",
  ],
  [
    "A full tannery of many vats and a guild-trained workforce, turning out fine leather for shoes, armour, and saddlery.",
    "Multiple vats, trained hands from the guild. A proper tannery whose leather is good enough for footwear, armour, and saddlery.",
  ],
  [
    "The making of cloth, usually under a guild.",
    "Cloth-work, more often than not guild-run.",
  ],
  [
    "A guild of shoemakers turning out boots, shoes, and sandals for the townsfolk. Its quality is strictly regulated.",
    "Organised cobblers who shoe the town in boots, shoes, and sandals, with quality kept under strict regulation.",
  ],
  [
    "Master clothiers cutting garments from finished cloth, working clothes and household livery alike.",
    "A guild of master clothiers who make up finished cloth into everything from labourers' wear to noble livery.",
  ],
  [
    "Meat dressed and sold, under close regulation.",
    "The butchering trade, strictly overseen.",
  ],
  [
    "The town's bread. Prices fixed by the guild.",
    "Bread baked for sale, with the guild setting the price.",
  ],
  [
    "Charcoal furnaces reduce raw ore to refined metal. It stands between the mine and the smithy.",
    "Refines crude ore into workable metal over charcoal fire. The industrial step from what the mine yields to what the smith uses.",
  ],
  [
    "Candles from tallow and beeswax, and soap and rope besides from much the same stock. Without it there is no light.",
    "Makes candles of tallow and beeswax, and turns like materials to soap and rope. The town depends on it for lighting.",
  ],
  [
    "Glass worked on a small scale, whenever sand reaches the furnace: bottles, window panes, goblets. It calls for silica sand, potash, and a skilled hand at the furnace.",
    "A modest glassworks for bottles, panes, and goblets, dependent on silica sand, potash, and a practised furnace operator.",
  ],
  [
    "Spins hemp, flax, and other plant fibres into rope and cordage. Ships, building work, and farming all depend on it.",
    "Rope and cordage twisted from hemp, flax, or whatever plant fibre comes to hand. Nothing sails, rises, or is harvested without it.",
  ],
  [
    "Books and broadsheets, where the technology has arrived.",
    "Printed books and broadsheets, struck off by the sheet.",
  ],
  [
    "Sells road maps, regional surveys, and coastal charts, and takes commissions to survey estates or sketch dungeons. An older collection is kept for reference. Adventurers, merchants, and army scouts all stop here.",
    "Road maps, regional surveys, and coastal charts for sale; estate surveys and dungeon sketches to order; a reference shelf of older maps to consult. A usual call for anyone who travels with purpose: adventurer, merchant, or scout.",
  ],
  [
    "They set the standard of work, the prices, and the terms of apprenticeship.",
    "Quality, price, and apprenticeship all fall under their rule.",
  ],
  [
    "Sells potions and alchemical goods. A plain healing draught runs about a labourer's week of wages.",
    "A shop of alchemical wares and potions, where the simplest healing draught costs roughly a week of a labourer's pay.",
  ],
  [
    "Several quarters, each with its house of worship.",
    "The town divided among a handful of congregations.",
  ],
  [
    "A ground for each congregation, and burial out beyond the houses where a ground has filled. The sexton's register of who lies where is the town's longest unbroken record.",
    "Each congregation buries its own, and the sexton keeps the roll that inheritance disputes are settled from. Guilds buy plots together so their members lie among their trade.",
  ],
  [
    "A community of the religious. Sometimes runs a hospital or school.",
    "An order living in common. It may keep a hospital or a school.",
  ],
  [
    "Tends the sick poor. Generally in religious hands.",
    "The ailing poor are nursed here, most often by a religious order.",
  ],
  [
    "A charity house sheltering the destitute poor, the aged, and the disabled who cannot work. Church endowment and wealthy donors pay for it. Board and lodging are given; prayers for the benefactors are returned.",
    "Kept for the poor, the old, and the crippled who have no work in them, funded by church endowment and rich patrons. It feeds and houses its residents, who repay the kindness in prayer for those who gave it.",
  ],
  [
    "Takes in abandoned infants and small children and keeps them in basic care until they are apprenticed, placed with families, or raised on within its walls. The church usually runs it. A turning wheel set in the wall lets a child be left anonymously after dark.",
    "Abandoned babies and young children are received here and given plain care until apprenticeship, a family placement, or a childhood spent in the house itself. Generally a church foundation. The wheel in the wall admits a child by night, no name asked.",
  ],
  [
    "Senior druids who govern how their circle deals with the town. They may keep a grove hidden beneath the streets, hold the line between the town's spread and the wild, or advise its rulers on the land.",
    "A council of elder druids charged with their circle's standing in the town: sometimes tending a concealed grove below the streets, sometimes mediating between expansion and wild ground, sometimes counselling those in power on ecological matters.",
  ],
  [
    "One of the lord's choosing governs, and noble authority overrides whatever the town was accustomed to.",
    "Rule falls to the lord's appointee, whose noble warrant stands above local custom.",
  ],
  [
    "A loose council of leading citizens sees to the town's common business. It answers to no one in particular, but the work gets done.",
    "The town's notables gather and settle its common business by consensus. Less answerable than an elected body, but steady.",
  ],
  [
    "The town's leadership, whether elected or named to office.",
    "A mayor and council, come to office by vote or appointment.",
  ],
  [
    "The guilds hold the town's politics, their masters seated on the council.",
    "Town rule belongs to the guilds; it is the guildmasters who fill the council's chairs.",
  ],
  [
    "Civic power belongs solely to the wealthy merchant families, and office is bought in all but name.",
    "A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases.",
  ],
  [
    // BAR4-HOUSES (H1 (i), REVIEW-BAR-4 C37943, 2026-11-16): the crier is named by the office, never by a pronoun: a woman holds
    // the post in 5 of the 8 towns of the census's 720 that print these (and in bar0-town-calm-rand-23); was "pays his wage", "he stands …
    // His employer is the town"
    "The official voice, reading proclamations, market prices, and news at set hours in the market square. Town or guild pays the wage.",
    "At fixed times the proclamations, the prices, and the news are called out in the market square. The town pays for it, or else a guild.",
  ],
  [
    "Buildings of several storeys, in timber and stone.",
    "Timber and stone, raised to more than one floor.",
  ],
  [
    "Water from wells, fountains, or pipe.",
    "Wells and fountains, or water carried in by pipe.",
  ],
  [
    "Where the town meets and its business is done.",
    "The seat of assembly and administration.",
  ],
  [
    "The borough's court, where local justice is done.",
    "A borough court for the settling of local matters.",
  ],
  [
    "Cells to hold prisoners, and stocks to shame them.",
    "A few cells, and a place for punishment in public view.",
  ],
  [
    "The able-bodied poor are given shelter and food, and made to earn it at compulsory labour: textile work, grinding, construction. It is not a prison, though the distinction is thin. It thins the ranks of vagrants and turns out goods besides, and its conditions are kept harsh on purpose, so that none grow too content to leave.",
    "In return for a roof and a meal, the able-bodied poor are set to forced work: textiles, milling, construction. Not quite a gaol, but the line blurs. It cuts vagrancy and yields product, and the deliberately grim conditions are the point: dependency is meant to sting.",
  ],
  [
    "Gated stone defences. Costly to raise and no cheaper to keep up.",
    "Masonry walls pierced by gates. Dear to build, dearer to maintain.",
  ],
  [
    "Guarded ways in and out, each with its keeper.",
    "Entry controlled at fixed points, gatekeepers posted.",
  ],
  [
    "Part-time guards who walk the night and hold the gates.",
    "Watchmen serving part-time. Night patrols and gate duty.",
  ],
  [
    "Quarters for the guard or a small garrison.",
    "Lodging for guardsmen, or a modest garrison.",
  ],
  [
    "The inner fortress, and the last refuge when a siege closes in.",
    "An innermost stronghold, the city's final hold under siege.",
  ],
  [
    "A billet and hiring office for professional soldiers idle between campaigns. Caravan escort, garrison work, and short-term hire go at day-wages here. Cheaper than a standing army and steadier than a mob. These are salaried men who fight in formation, not for plunder.",
    "Where a band of soldiers lodges and takes contracts between wars. They hire out by the day for escort, garrison duty, and brief campaigns: less costly than keeping an army, more dependable than a rabble. They form up for a wage, not for treasure.",
  ],
  [
    "A ranger post. Those here watch the wilds, keep the trails, and follow the movements of beasts. In a crisis they turn scout and tracker.",
    "Rangers keep this lodge, minding the wilderness about the town, tending its trails, and marking where the beasts migrate. When trouble comes they scout and track for the town.",
  ],
  [
    "One wizard's home.",
    "A single wizard's residence.",
  ],
  [
    "A body of spellcasters organised together.",
    "An association of magic-workers.",
  ],
  [
    "Sells spell scrolls. A minor charm costs a craftsman a month's earnings; a greater working, a merchant's year.",
    "Scrolls of spells across the counter: the smallest charm at a craftsman's month of pay, a greater working at a merchant's year.",
  ],
  [
    "A permanent circle, and a rare one. Dear to build and dearer to keep, calling for magical skill past what a town usually commands.",
    "Rarely seen: a fixed teleportation circle whose construction and upkeep cost enormously, and which demands expertise beyond the ordinary town's means.",
  ],
  [
    "A chartered hall that serves as the region's chief adventuring hub. It posts contracts, grades the monster threats, keeps gear in repair, and runs the large operations no militia could handle.",
    "The region's principal adventuring hub, working under charter. Contracts are posted here, monster threats graded, equipment maintained, and the great operations beyond any militia coordinated from its floor.",
  ],
  [
    "A board where torchbearers and porters sign on by the session at a day labourer's wage.",
    "Torchbearers and porters take work here by the session, paid what a day labourer earns.",
  ],
  [
    "Professional fighters, alone or in small bands, taking private work: guarding a person, collecting a debt, or quietly ending a difficulty.",
    "Fighters for private hire, singly or in small groups: bodyguarding, debt-collection, and the discreet removal of problems.",
  ],
  [
    "Contraband moved, and the duty on it never paid.",
    "Trade in forbidden goods, kept off the tax rolls.",
  ],
  [
    "Pickpockets and bruisers working together. Ten to thirty strong.",
    "An organised crew of cutpurses and toughs, some 10 to 30 of them.",
  ],
  [
    "Honest-looking trades that mask the dishonest kind.",
    "Lawful businesses standing cover for unlawful work.",
  ],
  [
    "Tunnels and false cellars, dug and linked to move contraband beneath the streets.",
    "A network of excavated passages joining cellars and yards to the town's edge. None of it on any map.",
  ],
  [
    "Message birds kept above a city yard by people who declare nothing. The word arrives unsigned and moves faster than the watch.",
    "An undeclared loft in the roofs. Unsigned messages in and out, protected by whichever organization currently holds the street.",
  ],
  [
    "Bards, jugglers, and acrobats, come for the festivals.",
    "The festivals bring bards, jugglers, and acrobats through.",
  ],
  [
    "Fixed houses for performance.",
    "Standing venues for the stage.",
  ],
  [
    "Dice, cards, and the plainer games of chance.",
    "Games of chance: dice and cards, nothing elaborate.",
  ],
  [
    "Prostitution, tolerated or licensed.",
    "A house of prostitution, suffered or regulated.",
  ],
  [
    "Combat outside the law, or barely within it, held underground.",
    "Fights unlawful or half-lawful, staged in hidden places.",
  ],
  [
    "Trains fighters for the crowd's amusement, drawn from prisoners, debtors, and volunteers. It supplies the arena circuit.",
    "Prisoners, debtors, and the willing are made into fighters for public show, and sent on to feed the arenas.",
  ],
  [
    "'Divination' with no magic in it, done by Deception, a few coins a reading.",
    "Fortunes told by Deception, with no real magic in them, for a few coins each.",
  ],
  [
    "Fur processors, traders, and retailers gathered into one quarter. It is high-value work, for good fur is a luxury good.",
    "Those who dress, trade, and sell fur, all pressed into one district. The trade runs high, quality pelts being luxuries.",
  ],
  [
    "Trade that never closes, spread across several sites.",
    "Standing markets in more than one quarter, open every day.",
  ],
  [
    "Several standing market squares, one to a district.",
    "Permanent markets in more than one square, each serving its own quarter.",
  ],
  [
    "Merchants from abroad. Letters of credit are honoured.",
    "Foreign traders attend, and credit by letter is taken.",
  ],
  [
    "Much of the city's trade is in their hands.",
    "Between them they handle much of the city's trade.",
  ],
  [
    "Loans, coin exchange, and letters of credit. The beginnings of banking.",
    "Lending, currency exchange, and credit by letter. Rudimentary banking.",
  ],
  [
    "Several inn districts, given over to merchants, travellers, and those who stay long.",
    "More than one quarter of inns, serving the merchant, the traveller, and the lingering guest.",
  ],
  [
    "Permanent offices where caravan masters, merchants, and armed escorts do business. It handles bonded freight, route intelligence, the assembly of armed convoys, and the settling of commercial disputes.",
    "A city-scale exchange with standing offices, where caravan masters meet merchants and armed escorts to transact. Bonded freight, route intelligence, armed convoy assembly, and commercial dispute resolution are all conducted here.",
  ],
  [
    "A city-scale yard building large merchant ships and warships alike. It holds several dry docks, a ropewalk, a sail loft, and its own ironworks. It employs many, and matters to the state's defence.",
    "Here large merchant and war vessels are built at city scale, across multiple dry docks, with ropewalk, sail loft, and dedicated ironworks besides. A major employer, and a strategic military asset.",
  ],
  [
    "Where there is coast or river to reach. Bulk trade cannot do without them.",
    "Present only with sea or river access, and indispensable to trade in bulk.",
  ],
  [
    "Several large grain stores feed the city between them. The state keeps them.",
    "Grain held in large state-run stores and given out across the city.",
  ],
  [
    "Where merchant goods are stored.",
    "Storage set aside for the merchants' stock.",
  ],
  [
    "Heated communal baths. Some cultures make them a social hub, others suspect them of vice; either way they are the district's best place for rumour and news.",
    "A public bathhouse with hot water, a gathering place in some cultures and a suspected den of vice in others. Nowhere in the district hears more news.",
  ],
  [
    "A settled auction block with holding pens, registered brokers, and papers of provenance. Commerce in persons, sanctioned by law, taxed and regulated and woven into the city's economy.",
    "An established block for the sale of persons, with holding facilities, licensed brokers, and provenance documents. The law permits it; it is taxed, regulated, and set deep in the city economy.",
  ],
  [
    "A standing, licensed quarter for the trade in persons: auction halls, holding compounds, broker offices, and the legal and financial apparatus around them. It works at a scale no single market block could reach.",
    "A permanent district, licensed for commerce in persons, with auction halls, holding compounds, broker offices, and the attendant legal and financial infrastructure. The scale runs well beyond one market block.",
  ],
  [
    "Tests precious metal brought to market for purity, charging by the assay. Banking and minting depend on it.",
    "An office that assays the purity of gold and silver brought to market, for a fee each time. Minting and banking cannot work without it.",
  ],
  [
    "Coin struck under state or noble charter. It sets a single standard of currency across the region and returns a steady revenue through seigniorage.",
    "Chartered by state or noble to make coin, it standardises the region's currency and yields significant ongoing revenue by seigniorage.",
  ],
  [
    "A guild house of the listening trade. Correspondents kept on several roads, an archive that sets one report against another, and a fixed price for an answer in writing. Costly, and the only counter that grades a claim before selling it.",
    "A chartered house of correspondents. Reports arrive from several roads and are checked against each other before anything is sold. The written answer carries a standing rate and a grade.",
  ],
  [
    "Wheels turn on every usable stream, many licensed by guild or city.",
    "Every workable watercourse turns a wheel, most under a guild's or the city's licence.",
  ],
  [
    "General forges, farriers, and toolsmiths in each quarter.",
    "Every quarter has its forges: farriers, toolsmiths, and general smiths.",
  ],
  [
    "Armourers, swordsmiths, and jewellers, each in its own guild.",
    "Swordsmiths, armourers, jewellers. The trades kept to separate guilds.",
  ],
  [
    "Silks, spices, and other precious goods.",
    "The trade in silk, spice, and precious things.",
  ],
  [
    "Guild-organised carpenters, joiners, and furniture makers for building and fitting out.",
    "Builders' carpenters, joiners, and furniture makers, each trade organised under its guild.",
  ],
  [
    "Apothecary shops crowded into one quarter, where competition forces each to specialise. One leans to chirurgery, another to herbal preparations, a third to imported medicines. Between them they carry herbalism kits, medicinal herbs, surgical supplies, and basic antidotes.",
    "A cluster of apothecaries pressed close enough that competition drives them apart in trade, some to surgery, some to herb-work, some to medicines brought from abroad. Herbalism kits, medicinal herbs, surgical supplies, and basic antidotes are all to be had.",
  ],
  [
    "Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite bows to order, supplying the watch, the garrison, and the caravans.",
    "Arrows by the sheaf, specialty broadheads, and commissioned composite bows from the guild's bowyers and fletchers. The watch, the garrison, and the caravans buy here.",
  ],
  [
    "Planks and beams for the building trade, sawn by water or ox power at a mill with a permanent crew.",
    "A mill turned by water or oxen that saws planks and beams for construction and keeps a standing crew.",
  ],
  [
    "Brews ale and beer at commercial scale for the taverns and for regional sale. A major employer and a heavy buyer of grain.",
    "Commercial brewing of ale and beer supplies the taverns and ships across the region, employing many and consuming grain in bulk.",
  ],
  [
    "Meat markets and shambles kept under strict civic rules.",
    "The shambles and meat markets, closely regulated by the city.",
  ],
  [
    "Every ward has its bakehouses, with weights and prices set by the guild.",
    "Bakehouses throughout the wards, the loaf's weight and price fixed by guild rule.",
  ],
  [
    "Windows, vessels, and mirrors. The craft demands real skill.",
    "Glass for windows, vessels, and mirrors. Expert work, not casual.",
  ],
  [
    "A guild of professional cartographers turning out regional maps, sea charts, property surveys, and military reconnaissance. It sells ready-made maps and works to commission. No maps in the region are more accurate than the city's.",
    "Professional cartographers, guild-organised, producing regional maps, sea charts, property surveys, and reconnaissance maps for the army. Some sell off the shelf, others are drawn to order. The city's are the most accurate maps the region has.",
  ],
  [
    "Specialisation carried to an extreme, down to gold-beaters and mirror-makers.",
    "Trades split so finely they yield gold-beaters and mirror-makers.",
  ],
  [
    "Several alchemical workshops, run under a guild.",
    "A cluster of alchemists' workshops, organised into a guild.",
  ],
  [
    "A house of worship to every quarter.",
    "One for each neighbourhood.",
  ],
  [
    "The grounds inside the walls filled generations back, so the dead are lifted when their term is up and their bones stacked to make room. New ground lies outside the gates.",
    "Carts go out at dusk to ground bought beyond the walls, and the charnel house holds what the old plots gave up. What a family endowed decides who is lifted and who is left.",
  ],
  [
    "Several houses, each of a different order.",
    "More than one monastery, and no two of the same order.",
  ],
  [
    "The bishop's seat, and its presence marks a city as a major one.",
    "Seat of a bishop, and the mark of a first-rank city.",
  ],
  [
    "A large house for the sick poor, of 50 to 100 beds.",
    "Fifty to a hundred beds, given over to the ailing poor.",
  ],
  [
    "A governor appointed by king or duke holds sway, and the city runs as a noble fief.",
    "Rule falls to a royal or ducal appointee, the city being worked as a noble's fief.",
  ],
  [
    "Officials, clerks, and ward officers do the city's daily business between them, whoever gives the orders. It runs by the momentum of its own paperwork.",
    "A standing body of officials, clerks, and ward officers carries out the city's administration, functional whatever rules above it. What moves it is bureaucratic inertia.",
  ],
  [
    "A civic council backed by a complete administrative staff.",
    "A civic council with the full apparatus of office beneath it.",
  ],
  [
    "Effective power over the city sits with a consortium of guild masters.",
    "The guild masters, banded into a consortium, hold the real civic power.",
  ],
  [
    "The settlement rules itself and the land around it as a sovereign polity, answering to no higher lord and holding no external charter.",
    "An independent state in its own right, governing both itself and its hinterland. No overlord above it, no charter granted from outside.",
  ],
  [
    "Formal power rests with an assembly of citizens; those entitled to vote argue and decide the major ordinances and appointments.",
    "A citizens' assembly wields the formal authority, its eligible voters debating and settling the larger ordinances and the appointments to office.",
  ],
  [
    "The crown governs the city from here, in person or through a royal governor. The standing is high, and so is the scrutiny.",
    "The crown governs here at first hand, whether the monarch sits in it or a viceroy does. Great prestige, and no less watchfulness.",
  ],
  [
    "The official announcer, reading proclamations, market prices, and news in the market squares at set hours, paid by the city or a guild.",
    "Employed by the city or a guild to call proclamations, prices, and news in the market squares at fixed times.",
  ],
  [
    "Buildings of several storeys. Tenements house the poor.",
    "Multi-storey construction, with tenements for the poor.",
  ],
  [
    "A built water supply: conduits, cisterns, and fountains.",
    "Engineered waterworks: conduits feeding cisterns and fountains.",
  ],
  [
    "A commanding seat of civic government.",
    "An imposing hall for the city's affairs.",
  ],
  [
    "Separate courts for trade, for crime, and for the church.",
    "Commercial, criminal, and ecclesiastical benches, each in its own house.",
  ],
  [
    "Holds debtors, criminals, and political prisoners alike.",
    "For debtors, for criminals, and for the politically inconvenient.",
  ],
  [
    "Drains laid underground. Uncommon, and vital to public health.",
    "Buried drainage. A rarity, and one the city's health depends on.",
  ],
  [
    "Towered stone walls. Several gatehouses along their length.",
    "Masonry ramparts studded with towers and pierced by many gates.",
  ],
  [
    "A standing force of the law, roughly one in a hundred residents.",
    "Full-time keepers of order, about one for every hundred people in the city.",
  ],
  [
    "A professional force, kept under arms for pay.",
    "A standing force, paid to bear arms.",
  ],
  [
    "Sellsword companies under proper organisation, mustering hundreds to thousands.",
    "Organised bands of hired blades. Major forces, hundreds to thousands strong.",
  ],
  [
    "Home to a powerful spellcaster. A city may hold more than one.",
    "The seat of a high-level mage. Several may stand in a single city.",
  ],
  [
    "Magic items made to order.",
    "Where magic items are crafted.",
  ],
  [
    "A permanent teleportation circle. Its use is restricted and its upkeep dear, but any settlement fortunate enough to hold one is transformed by it.",
    "A fixed teleportation circle, guarded in its access and costly to keep. For the rare settlement that has one, it changes everything.",
  ],
  [
    "Rival organisations.",
    "Guilds set against one another.",
  ],
  [
    "Specialised kit for the delving trade. Warded weapons, silver weapons, and the like.",
    "Gear for those who go underground. Warded weapons, silver weapons, and such.",
  ],
  [
    "Scholars and researchers, gathered in number.",
    "A cluster of learned men and their researches.",
  ],
  [
    "An organised trade in contraband.",
    "Contraband, moved by an organised hand.",
  ],
  [
    "Rival gangs, forever disputing their turf.",
    "Several gangs at odds, quarrelling over ground.",
  ],
  [
    "A chapter of organised crime. Thirty to a hundred members.",
    "An arm of the wider criminal order, 30 to 100 strong.",
  ],
  [
    "Warehouses, taverns, and shops that mask criminal work.",
    "Criminal operations screened behind honest-looking warehouses, taverns, and shops.",
  ],
  [
    "A warren of tunnels beneath the city, wide enough for cargo and old enough that no one alive knows every branch.",
    "Excavated ways running under walls and wards alike; whole shipments pass below the city without touching a street.",
  ],
  [
    "A covert guild. Brokers deal in knowledge by the piece, attach a grade to it, and will build a claim to order for a patron with the coin. It settles where the talk already runs thickest.",
    "A hidden guild of information brokers. They sell by the piece, grade what they sell, and take commissions to put a story into circulation. Always sited among the fences and the houses that keep late hours.",
  ],
  [
    "Trade in forbidden goods, conducted out of sight.",
    "Illicit wares, bought and sold in hidden places.",
  ],
  [
    "A lone hand or small cell with no assassins guild behind it. Work comes through criminal go-betweens: less dependable, but deniable.",
    "One killer, or a handful, answering to no assassins guild. Contracts arrive by way of criminal intermediaries, less reliable and for that reason harder to trace back.",
  ],
  [
    "It seizes free persons and slips them into slavery on forged provenance papers. No lawful market stands here to absorb them, so it keeps its own holding and its own routes.",
    "Free persons are taken and passed into slavery through counterfeit provenance documents. With no lawful market to lean on, it moves them through its own apparatus.",
  ],
  [
    "A wholly hidden operation that moves persons across borders outside any legal channel. It runs its own logistics, its own safe houses, and its own bought border officials.",
    "An entirely clandestine trade in persons, carried across jurisdictions beyond the reach of law. Separate logistics, safe houses, and corrupted border infrastructure hold it together.",
  ],
  [
    "Music taught in the formal way, with an amphitheatre and dormitories.",
    "A formal schooling in music: amphitheatre, dormitories, and all.",
  ],
  [
    "Houses given wholly to play. Not all of them lawful.",
    "Establishments for gambling and nothing else, some of them illegal.",
  ],
  [
    "A prostitution quarter, lawful or merely suffered.",
    "A quarter given to prostitution, whether licensed or just tolerated.",
  ],
  [
    "A large prostitution quarter, and an organised one.",
    "Prostitution on a large and organised scale, held to one quarter.",
  ],
  [
    "Constructed servants, put to the heavy work.",
    "Servants made, not born, if magic permits it.",
  ],
  [
    "Corpses raised to labour. Not everyone approves.",
    "Reanimated dead put to work. A contested practice.",
  ],
  [
    "Between five and ten standing market districts, each to its own trade: grain, livestock, cloth, metals, exotica.",
    "Five to ten permanent quarters given over to markets, sorted by ware: grain, livestock, cloth, metals, and the exotic.",
  ],
  [
    "Where foreign merchant agents gather, trade disputes are arbitrated, and commodities change hands.",
    "A centre for overseas trade representatives, the settling of commercial disputes, and dealing in commodities.",
  ],
  [
    "Dozens of merchant guilds, one for each major good and route, convened as a formal parliament of trade.",
    "Every principal commodity and trade route has its guild, scores of them in all, sitting together as a chartered guild parliament.",
  ],
  [
    "A whole quarter given to money: banking across borders, credit by letter, and speculation in coin at scale.",
    "The city's finance gathered into one district: international houses, letters of credit, and currency dealing on a grand scale.",
  ],
  [
    "A network of granaries run by the state, holding reserves against emergency.",
    "State-managed grain stores, kept as a strategic reserve.",
  ],
  [
    "More than a hundred separate craft specialisations, each with a guild. No trade goes unrepresented.",
    "A guild for every trade imaginable, well past a hundred distinct crafts in all.",
  ],
  [
    "Parishes by the score, anywhere from fifty to past a hundred. No street of the city is far from the faith.",
    "Every quarter keeps its own parish, so that faith runs through every part of the city.",
  ],
  [
    "Burial has left the walls: grounds beyond every gate, each with its road and its gatekeepers, and a trade in plots the revenue office keeps an eye on.",
    "One central roll now holds what the local grounds can no longer track. Wards are assigned to grounds, so a family that moves across the city may find itself divided by the assignment.",
  ],
  [
    "Between five and ten great monastic houses, each given to scholarship, contemplation, and charity at scale.",
    "Five to ten major monasteries, their scholarly, contemplative, and charitable work carried out on a grand scale.",
  ],
  [
    "The metropolitan cathedral, seat of the region's highest prelate and a draw for pilgrims.",
    "The great church of the metropolis. The region's chief religious authority sits here, and the faithful travel to it.",
  ],
  [
    "Hospitals and infirmaries across the districts, medical care organised for a city's numbers.",
    "A spread of hospitals and infirmaries throughout the quarters, ordered medical care at population scale.",
  ],
  [
    "Tall, crowded blocks and tenement courts, with suburbs spreading beyond the walls.",
    "Multi-story blocks packed around tenement courts, and suburbs that have outgrown the walls.",
  ],
  [
    "Aqueducts, cisterns, and fountains throughout. Water managed across the whole city at scale.",
    "Several aqueducts feed cisterns and fountains spread across the districts, a water system built for a city's size.",
  ],
  [
    "The heart of metropolitan or state rule. A palace with its ministries, audience halls, and clerks' bureaux.",
    "Where the metropolis or the state governs from: palace, ministries, halls of audience, and offices without number.",
  ],
  [
    "Several courts sitting at once, each to its province: commercial, criminal, appellate, ecclesiastical.",
    "Commercial, criminal, appellate, and ecclesiastical courts, all in session at the same time.",
  ],
  [
    "A state prison of some size, keeping its political prisoners, debtors, and convicts apart from one another.",
    "A vast state gaol where the political, the indebted, and the convicted are each held separately.",
  ],
  [
    "The region's greatest store of learning: thousands of volumes, archives of maps, and the historical record.",
    "No larger collection of knowledge exists in the region: thousands of books, a map archive, and the histories.",
  ],
  [
    "Walls within walls: an outer line and an inner line, with gatehouses at every stage.",
    "A defence built in layers, an outer wall and an inner wall, with gatehouses throughout.",
  ],
  [
    "Garrisons spread through the quarters; no single barracks could secure a city this size.",
    "Troops quartered in several places at once, a metropolis being far too large for one garrison.",
  ],
  [
    "A whole quarter of arcane practitioners, all towers, workshops, libraries, and reagent sellers.",
    "The magic-workers keep to one district. Its towers, workshops, libraries, and reagent merchants mark it out.",
  ],
  [
    "A chartered school of the arcane, with a full course of study, laboratories, and scholars come from abroad.",
    "A formal college of magic. A complete curriculum, rooms for research, and a stream of visiting adepts.",
  ],
  [
    "A formal legation from a power of another plane. It trades, it gathers word, and now and then it intervenes.",
    "The standing diplomatic mission of a planar power: commerce, intelligence, and the occasional intervention.",
  ],
  [
    "The criminal syndicate the city has never rooted out, for fear that open gang war would be worse.",
    "An underworld power the city has never rooted out, the alternative being the bloodshed of rival gangs.",
  ],
  [
    "Miles of tunnel and catacomb turned to shelter for criminals and refugees alike.",
    "An old warren of catacombs and passages, repurposed as a sanctuary for the hunted and the hiding.",
  ],
  [
    "A standing underground market dealing contraband, forged papers, and services no law permits.",
    "Contraband, forged documents, and illicit services, traded at a permanent underground bazaar.",
  ],
  [
    "Killing to order, done as a trade. It works through intermediaries and is never owned to in public.",
    "A professional trade in murder, screened behind cutouts and admitted by no one.",
  ],
  [
    "Standing venues, worked by professional companies.",
    "Permanent playhouses with companies that make their living at it.",
  ],
  [
    "High culture, kept by elite patrons.",
    "A house of high art, sustained by the patronage of the elite.",
  ],
  [
    "Gaming houses packed together, kept honest by compelled truth.",
    "A concentration of gaming houses, with compelled truth to enforce fair play.",
  ],
  [
    "Gladiators, or beasts set to fight, on a massive scale.",
    "Games of the arena, gladiatorial bouts or monster fights, staged at great size.",
  ],
  [
    "Wares carried in from other planes.",
    "Merchants dealing in goods from beyond this plane.",
  ],
  [
    "An ancient wyrm that dwells within the city.",
    "The city is home to an ancient dragon.",
  ],
  [
    "Experiences worked by dream-walking magic: lucid dreams shared between minds, and speech within them.",
    "Dream-walking magic sold as experience, offering shared lucid dreaming and communication through it.",
  ],
  [
    "Mooring towers, warded against the weather by magic.",
    "Towers to moor airships, with magical protection from the elements.",
  ],
  [
    "A network of paired Speaking Stones. A station costs as much as a merchant house, so only the richest powers keep them.",
    "Speaking Stones, paired and linked into a network, each station priced like a merchant's house and held only by the crown or the great guilds.",
  ],
  [
    "Each household takes its turn walking the lanes after dark, a lantern kept burning at the crossroads and the alarm raised at the first sign of trouble. Nobody is paid, and the households hold the rota.",
    "A rota of unpaid householders who walk the lanes by night, keep a lantern lit at the crossroads, and raise the alarm. Whose turn it is, the rota decides.",
  ],
];

export const INSTITUTION_DESC_VARIANTS = Object.freeze({
  "thorp|Economy|Subsistence farming": PAIRS[0],
  "thorp|Economy|Communal root cellar": PAIRS[1],
  "thorp|Economy|Fishing community": PAIRS[2],
  "thorp|Economy|Shepherd collective": PAIRS[3],
  "thorp|Economy|Woodcutter's camp": PAIRS[4],
  "thorp|Crafts|Access to external mill": PAIRS[5],
  "thorp|Religious|Wayside shrine": PAIRS[6],
  "thorp|Religious|Access to parish church": PAIRS[7],
  "thorp|Religious|Burial ground": PAIRS[8],
  "thorp|Government|Informal elder consensus": PAIRS[9],
  "thorp|Government|Head-of-household consensus": PAIRS[10],
  "thorp|Government|Lord's reeve": PAIRS[11],
  "thorp|Government|Household elder": PAIRS[12],
  "thorp|Infrastructure|Dwellings (1-8)": PAIRS[13],
  "thorp|Infrastructure|Water source": PAIRS[14],
  "thorp|Defense|Palisade": PAIRS[15],
  "thorp|Defense|Household levy": PAIRS[16],
  "thorp|Criminal|Local fence": PAIRS[17],
  "thorp|Criminal|Outlaw shelter": PAIRS[18],
  "hamlet|Economy|Subsistence farming": PAIRS[19],
  "hamlet|Economy|Common grazing land": PAIRS[20],
  "hamlet|Economy|Fisher's landing": PAIRS[21],
  "hamlet|Economy|Shepherd": PAIRS[22],
  "hamlet|Economy|Dairy farmer": PAIRS[23],
  "hamlet|Economy|Woodcutter's camp": PAIRS[24],
  "hamlet|Economy|Charcoal burner": PAIRS[25],
  "hamlet|Economy|Peat cutter": PAIRS[26],
  "hamlet|Economy|Mine (open cast)": PAIRS[27],
  "hamlet|Economy|Stone quarry": PAIRS[28],
  "hamlet|Economy|Salt works": PAIRS[29],
  "hamlet|Economy|Hunter's lodge": PAIRS[30],
  "hamlet|Economy|Periodic market": PAIRS[31],
  "hamlet|Economy|Pawnbroker": PAIRS[32],
  "hamlet|Economy|Wayside inn": PAIRS[33],
  "hamlet|Economy|Alehouse": PAIRS[34],
  "hamlet|Economy|Caravanserai": PAIRS[35],
  "hamlet|Economy|Pack animal trader": PAIRS[36],
  "hamlet|Economy|Stable yard": PAIRS[37],
  "hamlet|Crafts|Access to external mill": PAIRS[38],
  "hamlet|Crafts|Maltster": PAIRS[39],
  "hamlet|Crafts|Resident smith (part-time)": PAIRS[40],
  "hamlet|Crafts|Carpenter (part-time)": PAIRS[41],
  "hamlet|Religious|Wayside shrine": PAIRS[42],
  "hamlet|Religious|Access to parish church": PAIRS[43],
  "hamlet|Religious|Burial ground": PAIRS[44],
  "hamlet|Government|Informal elder consensus": PAIRS[45],
  "hamlet|Government|Lord's steward": PAIRS[46],
  "hamlet|Government|Village headman": PAIRS[47],
  "hamlet|Infrastructure|Dwellings (5-25)": PAIRS[48],
  "hamlet|Infrastructure|Water source": PAIRS[49],
  "hamlet|Defense|Palisade or earthworks": PAIRS[50],
  "hamlet|Defense|Citizen militia": PAIRS[51],
  "hamlet|Magic|Traveling hedge wizard": PAIRS[52],
  "hamlet|Adventuring|Adventurers' charter hall": PAIRS[53],
  "hamlet|Criminal|Fence (word of mouth)": PAIRS[54],
  "hamlet|Criminal|Bandit affiliate": PAIRS[55],
  "hamlet|Criminal|Smuggling waypoint": PAIRS[56],
  "village|Economy|Farmland": PAIRS[57],
  "village|Economy|Common grazing land": PAIRS[58],
  "village|Economy|Fisher's landing": PAIRS[21],
  "village|Economy|Fishmonger": PAIRS[59],
  "village|Economy|Fish market": PAIRS[60],
  "village|Economy|Shepherd": PAIRS[22],
  "village|Economy|Dairy farmer": PAIRS[61],
  "village|Economy|Beekeeper": PAIRS[62],
  "village|Economy|Wildfowler": PAIRS[63],
  "village|Economy|Woodcutter's camp": PAIRS[24],
  "village|Economy|Charcoal burner": PAIRS[64],
  "village|Economy|Peat cutter": PAIRS[26],
  "village|Economy|Mine": PAIRS[65],
  "village|Economy|Stone quarry": PAIRS[66],
  "village|Economy|Salt works": PAIRS[67],
  "village|Economy|Hunter's lodge": PAIRS[68],
  "village|Economy|Weekly market": PAIRS[69],
  "village|Economy|Pawnbroker": PAIRS[32],
  "village|Economy|Travelers' inn": PAIRS[70],
  "village|Economy|Ale house": PAIRS[71],
  "village|Economy|Caravanserai": PAIRS[72],
  "village|Economy|Waystation": PAIRS[73],
  "village|Economy|Carriers' hiring hall": PAIRS[74],
  "village|Economy|Pack animal trader": PAIRS[36],
  "village|Economy|Stable master": PAIRS[75],
  "village|Economy|River ferry": PAIRS[76],
  "village|Economy|River boatyard": PAIRS[77],
  "village|Economy|Toll bridge": PAIRS[78],
  "village|Crafts|Mill": PAIRS[79],
  "village|Crafts|Maltster": PAIRS[39],
  "village|Crafts|Blacksmith": PAIRS[80],
  "village|Crafts|Carpenter": PAIRS[81],
  "village|Crafts|Thatcher": PAIRS[82],
  "village|Crafts|Cooper": PAIRS[83],
  "village|Crafts|Apothecary": PAIRS[84],
  "village|Crafts|Bowyer & fletcher": PAIRS[85],
  "village|Crafts|Sawmill": PAIRS[86],
  "village|Crafts|Brewer": PAIRS[87],
  "village|Crafts|Tannery": PAIRS[88],
  "village|Crafts|Fuller": PAIRS[89],
  "village|Crafts|Dyer": PAIRS[90],
  "village|Crafts|Potter": PAIRS[91],
  "village|Crafts|Brickmaker": PAIRS[92],
  "village|Crafts|Cobbler": PAIRS[93],
  "village|Crafts|Tailor": PAIRS[94],
  "village|Crafts|Midwife": PAIRS[95],
  "village|Crafts|Woodcarver": PAIRS[96],
  "village|Crafts|Village scribe": PAIRS[97],
  "village|Crafts|Cartographer's workshop": PAIRS[98],
  "village|Religious|Wayside shrine": PAIRS[99],
  "village|Religious|Parish church": PAIRS[100],
  "village|Religious|Graveyard": PAIRS[101],
  "village|Religious|Priest (resident)": PAIRS[102],
  "village|Religious|Druid Circle": PAIRS[103],
  "village|Government|Informal elder consensus": PAIRS[104],
  "village|Government|Lord's steward": PAIRS[105],
  "village|Government|Village headman": PAIRS[47],
  "village|Government|Village reeve": PAIRS[106],
  "village|Government|Village elder": PAIRS[107],
  "village|Infrastructure|Dwellings (15-100)": PAIRS[108],
  "village|Infrastructure|Multiple water sources": PAIRS[109],
  "village|Defense|Palisade or earthworks": PAIRS[110],
  "village|Defense|Citizen militia": PAIRS[111],
  "village|Defense|Veteran's lodge": PAIRS[112],
  "village|Defense|Village watch": PAIRS[332],
  "village|Magic|Hedge wizard": PAIRS[113],
  "village|Magic|Healer (divine, 1st level)": PAIRS[114],
  "village|Adventuring|Adventurers' charter hall": PAIRS[115],
  "village|Criminal|Fence (word of mouth)": PAIRS[116],
  "village|Criminal|Bandit affiliate": PAIRS[55],
  "village|Criminal|Smuggling waypoint": PAIRS[56],
  "village|Criminal|Underground network": PAIRS[117],
  "village|Entertainment|Village musician": PAIRS[118],
  "town|Economy|Fish market": PAIRS[119],
  "town|Economy|Charcoal burner": PAIRS[120],
  "town|Economy|Mine": PAIRS[121],
  "town|Economy|Stone quarry": PAIRS[122],
  "town|Economy|Salt works": PAIRS[67],
  "town|Economy|Hunter's lodge": PAIRS[68],
  "town|Economy|Weekly market": PAIRS[123],
  "town|Economy|Market square": PAIRS[124],
  "town|Economy|Annual fair": PAIRS[125],
  "town|Economy|Merchant guilds (3-8)": PAIRS[126],
  "town|Economy|Money changers": PAIRS[127],
  "town|Economy|Pawnbroker": PAIRS[128],
  "town|Economy|Inn (multiple)": PAIRS[129],
  "town|Economy|Taverns (5-20)": PAIRS[130],
  "town|Economy|Coaching inn": PAIRS[131],
  "town|Economy|Caravanserai": PAIRS[72],
  "town|Economy|Caravaneer's post": PAIRS[132],
  "town|Economy|Carriers' guild": PAIRS[133],
  "town|Economy|Stable district": PAIRS[134],
  "town|Economy|Beast trainers": PAIRS[135],
  "town|Economy|Post relay station": PAIRS[136],
  "town|Economy|River ferry": PAIRS[76],
  "town|Economy|River boatyard": PAIRS[77],
  "town|Economy|Shipyard": PAIRS[137],
  "town|Economy|Barge and river transport company": PAIRS[138],
  "town|Economy|Docks/port facilities": PAIRS[139],
  "town|Economy|Harbour master's office": PAIRS[140],
  "town|Economy|Toll bridge": PAIRS[78],
  "town|Economy|Customs house": PAIRS[141],
  "town|Economy|Town granary": PAIRS[142],
  "town|Economy|Merchant warehouses": PAIRS[143],
  "town|Economy|Public bathhouse": PAIRS[144],
  "town|Economy|Slave market": PAIRS[145],
  "town|Economy|Auction house": PAIRS[146],
  "town|Economy|Assay office": PAIRS[147],
  "town|Economy|Mint": PAIRS[148],
  "town|Economy|Listening post": PAIRS[149],
  "town|Crafts|Mills (2-5)": PAIRS[150],
  "town|Crafts|Blacksmiths (3-10)": PAIRS[151],
  "town|Crafts|Jeweller": PAIRS[152],
  "town|Crafts|Carpenters (5-15)": PAIRS[153],
  "town|Crafts|Cooper": PAIRS[83],
  "town|Crafts|Apothecary (established)": PAIRS[154],
  "town|Crafts|Bowyers & fletchers (guild)": PAIRS[155],
  "town|Crafts|Sawmill (commercial)": PAIRS[156],
  "town|Crafts|Brewery": PAIRS[157],
  "town|Crafts|Vintner": PAIRS[158],
  "town|Crafts|Tanners": PAIRS[159],
  "town|Crafts|Tanner (established)": PAIRS[160],
  "town|Crafts|Fuller": PAIRS[89],
  "town|Crafts|Dyer": PAIRS[90],
  "town|Crafts|Weavers/Textile workers": PAIRS[161],
  "town|Crafts|Potter": PAIRS[91],
  "town|Crafts|Brickmaker": PAIRS[92],
  "town|Crafts|Cobbler's guild": PAIRS[162],
  "town|Crafts|Tailor's guild": PAIRS[163],
  "town|Crafts|Butchers (3-8)": PAIRS[164],
  "town|Crafts|Bakers (5-15)": PAIRS[165],
  "town|Crafts|Smelter": PAIRS[166],
  "town|Crafts|Chandler": PAIRS[167],
  "town|Crafts|Glassblower": PAIRS[168],
  "town|Crafts|Ropemaker": PAIRS[169],
  "town|Crafts|Midwife": PAIRS[95],
  "town|Crafts|Woodcarver": PAIRS[96],
  "town|Crafts|Printing house": PAIRS[170],
  "town|Crafts|Cartographer's workshop": PAIRS[171],
  "town|Crafts|Craft guilds (5-15)": PAIRS[172],
  "town|Crafts|Alchemist shop": PAIRS[173],
  "town|Religious|Parish churches (2-5)": PAIRS[174],
  "town|Religious|Parish burial grounds": PAIRS[175],
  "town|Religious|Monastery or friary": PAIRS[176],
  "town|Religious|Small hospital": PAIRS[177],
  "town|Religious|Almshouse": PAIRS[178],
  "town|Religious|Foundling home": PAIRS[179],
  "town|Religious|Elder Grove Council": PAIRS[180],
  "town|Government|Lord's appointee": PAIRS[181],
  "town|Government|Town council": PAIRS[182],
  "town|Government|Mayor and council": PAIRS[183],
  "town|Government|Guild governance": PAIRS[184],
  "town|Government|Merchant oligarchy": PAIRS[185],
  "town|Government|Town crier": PAIRS[186],
  "town|Infrastructure|Housing (75-650 households)": PAIRS[187],
  "town|Infrastructure|Multiple water sources": PAIRS[188],
  "town|Infrastructure|Town hall": PAIRS[189],
  "town|Infrastructure|Courthouse": PAIRS[190],
  "town|Infrastructure|Small prison/stocks": PAIRS[191],
  "town|Infrastructure|Workhouse": PAIRS[192],
  "town|Defense|Town walls": PAIRS[193],
  "town|Defense|Gates (if walled)": PAIRS[194],
  "town|Defense|Town watch": PAIRS[195],
  "town|Defense|Barracks": PAIRS[196],
  "town|Defense|Citadel": PAIRS[197],
  "town|Defense|Free company hall": PAIRS[198],
  "town|Defense|Veteran's lodge": PAIRS[112],
  "town|Defense|Warden's Lodge": PAIRS[199],
  "town|Magic|Wizard's tower": PAIRS[200],
  "town|Magic|Mages' guild": PAIRS[201],
  "town|Magic|Scroll scribe": PAIRS[202],
  "town|Magic|Teleportation circle": PAIRS[203],
  "town|Adventuring|Adventurers' charter hall": PAIRS[204],
  "town|Adventuring|Hireling hall": PAIRS[205],
  "town|Adventuring|Hired blades": PAIRS[206],
  "town|Criminal|Fence (word of mouth)": PAIRS[116],
  "town|Criminal|Smuggling operation": PAIRS[207],
  "town|Criminal|Street gang": PAIRS[208],
  "town|Criminal|Front businesses": PAIRS[209],
  "town|Criminal|Underground network": PAIRS[210],
  "town|Criminal|Rookery": PAIRS[211],
  "town|Entertainment|Traveling performers": PAIRS[212],
  "town|Entertainment|Theaters": PAIRS[213],
  "town|Entertainment|Gambling den": PAIRS[214],
  "town|Entertainment|Brothel": PAIRS[215],
  "town|Entertainment|Fighting pits": PAIRS[216],
  "town|Entertainment|Gladiatorial school": PAIRS[217],
  "town|Entertainment|Charlatan fortune tellers": PAIRS[218],
  "city|Economy|Fish market": PAIRS[119],
  "city|Economy|Charcoal burner": PAIRS[120],
  "city|Economy|Mine": PAIRS[121],
  "city|Economy|Stone quarry": PAIRS[122],
  "city|Economy|Salt works": PAIRS[67],
  "city|Economy|Furrier's district": PAIRS[219],
  "city|Economy|Daily markets": PAIRS[220],
  "city|Economy|Multiple market squares": PAIRS[221],
  "city|Economy|Major annual fairs": PAIRS[222],
  "city|Economy|Merchant guilds (15-40)": PAIRS[223],
  "city|Economy|Banking houses": PAIRS[224],
  "city|Economy|Pawnbroker": PAIRS[128],
  "city|Economy|Inns and taverns (district)": PAIRS[225],
  "city|Economy|Coaching inn": PAIRS[131],
  "city|Economy|Caravanserai": PAIRS[72],
  "city|Economy|Caravan masters' exchange": PAIRS[226],
  "city|Economy|Stable district": PAIRS[134],
  "city|Economy|Beast trainers": PAIRS[135],
  "city|Economy|Post relay station": PAIRS[136],
  "city|Economy|River ferry": PAIRS[76],
  "city|Economy|River boatyard": PAIRS[77],
  "city|Economy|Shipyard": PAIRS[227],
  "city|Economy|Barge and river transport company": PAIRS[138],
  "city|Economy|Docks/port facilities": PAIRS[228],
  "city|Economy|Harbour master's office": PAIRS[140],
  "city|Economy|Toll bridge": PAIRS[78],
  "city|Economy|Customs house": PAIRS[141],
  "city|Economy|City granaries": PAIRS[229],
  "city|Economy|Warehouse district": PAIRS[230],
  "city|Economy|Public bathhouse": PAIRS[231],
  "city|Economy|Slave market": PAIRS[232],
  "city|Economy|Slave market district": PAIRS[233],
  "city|Economy|Auction house": PAIRS[146],
  "city|Economy|Assay office": PAIRS[234],
  "city|Economy|Mint (official)": PAIRS[235],
  "city|Economy|Listening post": PAIRS[149],
  "city|Economy|Chroniclers' exchange": PAIRS[236],
  "city|Crafts|Mills (2-5)": PAIRS[237],
  "city|Crafts|Blacksmiths (3-10)": PAIRS[238],
  "city|Crafts|Specialized metalworkers": PAIRS[239],
  "city|Crafts|Luxury goods quarter": PAIRS[240],
  "city|Crafts|Carpenters (5-15)": PAIRS[241],
  "city|Crafts|Cooper": PAIRS[83],
  "city|Crafts|Apothecary district": PAIRS[242],
  "city|Crafts|Bowyers & fletchers (guild)": PAIRS[243],
  "city|Crafts|Sawmill (commercial)": PAIRS[244],
  "city|Crafts|Brewery": PAIRS[245],
  "city|Crafts|Vintner": PAIRS[158],
  "city|Crafts|Tanners": PAIRS[159],
  "city|Crafts|Tanner (established)": PAIRS[160],
  "city|Crafts|Fuller": PAIRS[89],
  "city|Crafts|Dyer": PAIRS[90],
  "city|Crafts|Weavers/Textile workers": PAIRS[161],
  "city|Crafts|Potter": PAIRS[91],
  "city|Crafts|Brickmaker": PAIRS[92],
  "city|Crafts|Cobbler's guild": PAIRS[162],
  "city|Crafts|Tailor's guild": PAIRS[163],
  "city|Crafts|Butchers (3-8)": PAIRS[246],
  "city|Crafts|Bakers (5-15)": PAIRS[247],
  "city|Crafts|Smelter": PAIRS[166],
  "city|Crafts|Chandler": PAIRS[167],
  "city|Crafts|Glassmakers": PAIRS[248],
  "city|Crafts|Ropemaker": PAIRS[169],
  "city|Crafts|Midwife": PAIRS[95],
  "city|Crafts|Woodcarver": PAIRS[96],
  "city|Crafts|Printing house": PAIRS[170],
  "city|Crafts|Cartographer's guild": PAIRS[249],
  "city|Crafts|Craft guilds (30-80)": PAIRS[250],
  "city|Crafts|Alchemist quarter": PAIRS[251],
  "city|Religious|Parish churches (10-30)": PAIRS[252],
  "city|Religious|Burial grounds and charnel house": PAIRS[253],
  "city|Religious|Multiple monasteries": PAIRS[254],
  "city|Religious|Cathedral (10,000+ only)": PAIRS[255],
  "city|Religious|Major hospital": PAIRS[256],
  "city|Religious|Almshouse": PAIRS[178],
  "city|Religious|Foundling home": PAIRS[179],
  "city|Religious|Elder Grove Council": PAIRS[180],
  "city|Government|Noble governor": PAIRS[257],
  "city|Government|City administration": PAIRS[258],
  "city|Government|Mayor and council": PAIRS[259],
  "city|Government|Guild consortium": PAIRS[260],
  "city|Government|Merchant oligarchy": PAIRS[185],
  "city|Government|City-state government": PAIRS[261],
  "city|Government|Democratic assembly": PAIRS[262],
  "city|Government|Royal seat": PAIRS[263],
  "city|Government|Town crier": PAIRS[264],
  "city|Infrastructure|Housing (500-4000 households)": PAIRS[265],
  "city|Infrastructure|Aqueduct or water system": PAIRS[266],
  "city|Infrastructure|City hall": PAIRS[267],
  "city|Infrastructure|Multiple courthouses": PAIRS[268],
  "city|Infrastructure|Large prison": PAIRS[269],
  "city|Infrastructure|Workhouse": PAIRS[192],
  "city|Infrastructure|Sewage system": PAIRS[270],
  "city|Defense|City walls and gates": PAIRS[271],
  "city|Defense|Professional city watch": PAIRS[272],
  "city|Defense|Garrison": PAIRS[273],
  "city|Defense|Citadel": PAIRS[197],
  "city|Defense|Mercenary quarter": PAIRS[274],
  "city|Defense|Veteran's lodge": PAIRS[112],
  "city|Magic|Wizard's tower": PAIRS[275],
  "city|Magic|Mages' guild": PAIRS[201],
  "city|Magic|Enchanter's shop": PAIRS[276],
  "city|Magic|Scroll scribe": PAIRS[202],
  "city|Magic|Teleportation circle": PAIRS[277],
  "city|Adventuring|Multiple adventurers' guilds": PAIRS[278],
  "city|Adventuring|Hireling hall": PAIRS[205],
  "city|Adventuring|Hired blades": PAIRS[206],
  "city|Adventuring|Dungeon delving supply district": PAIRS[279],
  "city|Adventuring|Sage's quarter": PAIRS[280],
  "city|Criminal|Smuggling network": PAIRS[281],
  "city|Criminal|Multiple criminal factions": PAIRS[282],
  "city|Criminal|Thieves' guild chapter": PAIRS[283],
  "city|Criminal|Front businesses": PAIRS[284],
  "city|Criminal|Underground network": PAIRS[285],
  "city|Criminal|Rookery": PAIRS[211],
  "city|Criminal|Whisper market": PAIRS[286],
  "city|Criminal|Black market": PAIRS[287],
  "city|Criminal|Contract killer": PAIRS[288],
  "city|Criminal|Kidnapping ring": PAIRS[289],
  "city|Criminal|Human trafficking network": PAIRS[290],
  "city|Entertainment|Theaters": PAIRS[213],
  "city|Entertainment|Bardic college": PAIRS[291],
  "city|Entertainment|Gambling halls": PAIRS[292],
  "city|Entertainment|Brothel (red light district)": PAIRS[293],
  "city|Entertainment|Red light district": PAIRS[294],
  "city|Entertainment|Fighting pits": PAIRS[216],
  "city|Entertainment|Gladiatorial school": PAIRS[217],
  "city|Entertainment|Charlatan fortune tellers": PAIRS[218],
  "city|Exotic|Golem workforce": PAIRS[295],
  "city|Exotic|Undead labor": PAIRS[296],
  "metropolis|Economy|Fish market": PAIRS[119],
  "metropolis|Economy|Charcoal burner": PAIRS[120],
  "metropolis|Economy|Mine": PAIRS[121],
  "metropolis|Economy|Stone quarry": PAIRS[122],
  "metropolis|Economy|Salt works": PAIRS[67],
  "metropolis|Economy|Furrier's district": PAIRS[219],
  "metropolis|Economy|District markets (5-10)": PAIRS[297],
  "metropolis|Economy|Multiple market squares": PAIRS[221],
  "metropolis|Economy|Major annual fairs": PAIRS[222],
  "metropolis|Economy|International trade center": PAIRS[298],
  "metropolis|Economy|Merchant guilds (50-100+)": PAIRS[299],
  "metropolis|Economy|Banking district": PAIRS[300],
  "metropolis|Economy|Pawnbroker": PAIRS[128],
  "metropolis|Economy|Inns and taverns (district)": PAIRS[225],
  "metropolis|Economy|Coaching inn": PAIRS[131],
  "metropolis|Economy|Caravanserai": PAIRS[72],
  "metropolis|Economy|Caravan masters' exchange": PAIRS[226],
  "metropolis|Economy|Stable district": PAIRS[134],
  "metropolis|Economy|Beast trainers": PAIRS[135],
  "metropolis|Economy|Post relay station": PAIRS[136],
  "metropolis|Economy|River ferry": PAIRS[76],
  "metropolis|Economy|River boatyard": PAIRS[77],
  "metropolis|Economy|Shipyard": PAIRS[227],
  "metropolis|Economy|Barge and river transport company": PAIRS[138],
  "metropolis|Economy|Docks/port facilities": PAIRS[228],
  "metropolis|Economy|Harbour master's office": PAIRS[140],
  "metropolis|Economy|Toll bridge": PAIRS[78],
  "metropolis|Economy|Customs house": PAIRS[141],
  "metropolis|Economy|State granary complex": PAIRS[301],
  "metropolis|Economy|Warehouse district": PAIRS[230],
  "metropolis|Economy|Public bathhouse": PAIRS[231],
  "metropolis|Economy|Slave market": PAIRS[232],
  "metropolis|Economy|Slave market district": PAIRS[233],
  "metropolis|Economy|Auction house": PAIRS[146],
  "metropolis|Economy|Assay office": PAIRS[234],
  "metropolis|Economy|Mint (official)": PAIRS[235],
  "metropolis|Economy|Listening post": PAIRS[149],
  "metropolis|Economy|Chroniclers' exchange": PAIRS[236],
  "metropolis|Crafts|Mills (2-5)": PAIRS[237],
  "metropolis|Crafts|Blacksmiths (3-10)": PAIRS[238],
  "metropolis|Crafts|Specialized metalworkers": PAIRS[239],
  "metropolis|Crafts|Luxury goods quarter": PAIRS[240],
  "metropolis|Crafts|Carpenters (5-15)": PAIRS[241],
  "metropolis|Crafts|Cooper": PAIRS[83],
  "metropolis|Crafts|Apothecary district": PAIRS[242],
  "metropolis|Crafts|Bowyers & fletchers (guild)": PAIRS[243],
  "metropolis|Crafts|Sawmill (commercial)": PAIRS[244],
  "metropolis|Crafts|Brewery": PAIRS[245],
  "metropolis|Crafts|Vintner": PAIRS[158],
  "metropolis|Crafts|Tanners": PAIRS[159],
  "metropolis|Crafts|Tanner (established)": PAIRS[160],
  "metropolis|Crafts|Fuller": PAIRS[89],
  "metropolis|Crafts|Dyer": PAIRS[90],
  "metropolis|Crafts|Weavers/Textile workers": PAIRS[161],
  "metropolis|Crafts|Potter": PAIRS[91],
  "metropolis|Crafts|Brickmaker": PAIRS[92],
  "metropolis|Crafts|Cobbler's guild": PAIRS[162],
  "metropolis|Crafts|Tailor's guild": PAIRS[163],
  "metropolis|Crafts|Butchers (3-8)": PAIRS[246],
  "metropolis|Crafts|Bakers (5-15)": PAIRS[247],
  "metropolis|Crafts|Smelter": PAIRS[166],
  "metropolis|Crafts|Chandler": PAIRS[167],
  "metropolis|Crafts|Glassmakers": PAIRS[248],
  "metropolis|Crafts|Ropemaker": PAIRS[169],
  "metropolis|Crafts|Midwife": PAIRS[95],
  "metropolis|Crafts|Woodcarver": PAIRS[96],
  "metropolis|Crafts|Printing house": PAIRS[170],
  "metropolis|Crafts|Cartographer's guild": PAIRS[249],
  "metropolis|Crafts|Craft guilds (100-150+)": PAIRS[302],
  "metropolis|Crafts|Alchemist quarter": PAIRS[251],
  "metropolis|Religious|Parish churches (50-100+)": PAIRS[303],
  "metropolis|Religious|Cemetery network": PAIRS[304],
  "metropolis|Religious|Major monasteries (5-10)": PAIRS[305],
  "metropolis|Religious|Great cathedral": PAIRS[306],
  "metropolis|Religious|Hospital network": PAIRS[307],
  "metropolis|Religious|Almshouse": PAIRS[178],
  "metropolis|Religious|Foundling home": PAIRS[179],
  "metropolis|Religious|Elder Grove Council": PAIRS[180],
  "metropolis|Government|Noble governor": PAIRS[257],
  "metropolis|Government|City administration": PAIRS[258],
  "metropolis|Government|Mayor and council": PAIRS[259],
  "metropolis|Government|Guild consortium": PAIRS[260],
  "metropolis|Government|Merchant oligarchy": PAIRS[185],
  "metropolis|Government|City-state government": PAIRS[261],
  "metropolis|Government|Democratic assembly": PAIRS[262],
  "metropolis|Government|Royal seat": PAIRS[263],
  "metropolis|Government|Town crier": PAIRS[264],
  "metropolis|Infrastructure|Housing (3500+ households)": PAIRS[308],
  "metropolis|Infrastructure|Advanced water infrastructure": PAIRS[309],
  "metropolis|Infrastructure|City hall": PAIRS[267],
  "metropolis|Infrastructure|Palace/government complex": PAIRS[310],
  "metropolis|Infrastructure|Multiple court buildings": PAIRS[311],
  "metropolis|Infrastructure|Massive prison": PAIRS[312],
  "metropolis|Infrastructure|Workhouse": PAIRS[192],
  "metropolis|Infrastructure|Sewage system": PAIRS[270],
  "metropolis|Infrastructure|Great library": PAIRS[313],
  "metropolis|Defense|Massive walls and fortifications": PAIRS[314],
  "metropolis|Defense|Professional city watch": PAIRS[272],
  "metropolis|Defense|Multiple garrisons": PAIRS[315],
  "metropolis|Defense|Citadel": PAIRS[197],
  "metropolis|Defense|Mercenary quarter": PAIRS[274],
  "metropolis|Defense|Veteran's lodge": PAIRS[112],
  "metropolis|Magic|Wizard's tower": PAIRS[275],
  "metropolis|Magic|Mages' district": PAIRS[316],
  "metropolis|Magic|Academy of magic": PAIRS[317],
  "metropolis|Magic|Enchanter's shop": PAIRS[276],
  "metropolis|Magic|Scroll scribe": PAIRS[202],
  "metropolis|Magic|Teleportation circle": PAIRS[277],
  "metropolis|Magic|Planar embassy": PAIRS[318],
  "metropolis|Adventuring|Multiple adventurers' guilds": PAIRS[278],
  "metropolis|Adventuring|Hireling hall": PAIRS[205],
  "metropolis|Adventuring|Hired blades": PAIRS[206],
  "metropolis|Adventuring|Dungeon delving supply district": PAIRS[279],
  "metropolis|Adventuring|Sage's quarter": PAIRS[280],
  "metropolis|Criminal|Smuggling network": PAIRS[281],
  "metropolis|Criminal|Multiple criminal factions": PAIRS[282],
  "metropolis|Criminal|Thieves' guild (powerful)": PAIRS[319],
  "metropolis|Criminal|Front businesses": PAIRS[284],
  "metropolis|Criminal|Underground network": PAIRS[285],
  "metropolis|Criminal|Underground city": PAIRS[320],
  "metropolis|Criminal|Rookery": PAIRS[211],
  "metropolis|Criminal|Whisper market": PAIRS[286],
  "metropolis|Criminal|Black market bazaar": PAIRS[321],
  "metropolis|Criminal|Contract killer": PAIRS[288],
  "metropolis|Criminal|Assassins' guild": PAIRS[322],
  "metropolis|Criminal|Kidnapping ring": PAIRS[289],
  "metropolis|Criminal|Human trafficking network": PAIRS[290],
  "metropolis|Entertainment|Multiple theaters": PAIRS[323],
  "metropolis|Entertainment|Opera house": PAIRS[324],
  "metropolis|Entertainment|Bardic college": PAIRS[291],
  "metropolis|Entertainment|Gambling district": PAIRS[325],
  "metropolis|Entertainment|Brothel (red light district)": PAIRS[293],
  "metropolis|Entertainment|Red light district": PAIRS[294],
  "metropolis|Entertainment|Fighting pits": PAIRS[216],
  "metropolis|Entertainment|Gladiatorial school": PAIRS[217],
  "metropolis|Entertainment|Colosseum/arena": PAIRS[326],
  "metropolis|Entertainment|Charlatan fortune tellers": PAIRS[218],
  "metropolis|Exotic|Planar traders": PAIRS[327],
  "metropolis|Exotic|Dragon resident": PAIRS[328],
  "metropolis|Exotic|Golem workforce": PAIRS[295],
  "metropolis|Exotic|Undead labor": PAIRS[296],
  "metropolis|Exotic|Dream parlors (high magic)": PAIRS[329],
  "metropolis|Exotic|Airship docking (high magic)": PAIRS[330],
  "metropolis|Exotic|Message network (high magic)": PAIRS[331],
});

/**
 * DECLARED SIBLINGS (CENSUS-1c unit 1; `docs/DESIGN_POOL_CENSUS.md` §3.1, the twin tables
 * dissolved): the walls-free twin of the waystation's second variant (its own yard, read as the town's walls; F10 unit 4). Each set is the original line, declaring what it presumes, and beside it its
 * twin with the complementary atom (`twinOf` the original). The original stays where this table's
 * string consumers read it; the draw site resolves a drawn key through
 * `domain/facts/drawDeclared.js :: resolveSibling` (the original if the record admits it, else the
 * twin). Retired from the text-keyed tables `defenceTwinLines.js` / `inlandHookLines.js` (F5, F10),
 * every twin to the byte. VETOABLE wording, as before (the owner's).
 */
export const DESC_VARIANT_SIBLINGS = Object.freeze({
  'An overnight stop behind walls, offering stabling, a well, and basic supplies to caravans and long-haul travellers. Where the inn sees to comfort, this sees to the animals and the laden wagons.': Object.freeze([
    Object.freeze({ text: 'An overnight stop behind walls, offering stabling, a well, and basic supplies to caravans and long-haul travellers. Where the inn sees to comfort, this sees to the animals and the laden wagons.', needs: Object.freeze(['walls']) }),
    Object.freeze({ text: 'An overnight stop inside a fenced yard, offering stabling, a well, and basic supplies to caravans and long-haul travellers. Where the inn sees to comfort, this sees to the animals and the laden wagons.', twinOf: 'An overnight stop behind walls, offering stabling, a well, and basic supplies to caravans and long-haul travellers. Where the inn sees to comfort, this sees to the animals and the laden wagons.', excludes: Object.freeze(['walls']) }),
  ]),
  // W2-FIX-DATA (2026-11-13; the REVIEW-W2B cold list): each line the cold read found false declares what makes it
  // false, and its twin, in the same voice, says what is true in that case (VETOABLE wording, the owner's).
  "Converts barley into malt for brewing. Small operation supplying local alehouses. Requires grain surplus.": Object.freeze([
    Object.freeze({ text: "Converts barley into malt for brewing. Small operation supplying local alehouses. Requires grain surplus.", needs: Object.freeze(["institution: tavern"]) }),
    Object.freeze({ text: "Converts barley into malt for brewing. A small operation; the households brew their own ale from it. Requires grain surplus.", twinOf: "Converts barley into malt for brewing. Small operation supplying local alehouses. Requires grain surplus.", excludes: Object.freeze(["institution: tavern"]) }),
  ]),
  "Turns barley into malt for the brewers. A small concern feeding the local alehouses, and one that only runs when grain is in surplus.": Object.freeze([
    Object.freeze({ text: "Turns barley into malt for the brewers. A small concern feeding the local alehouses, and one that only runs when grain is in surplus.", needs: Object.freeze(["institution: tavern"]) }),
    Object.freeze({ text: "Turns barley into malt for the households that brew at home. A small concern, and one that only runs when grain is in surplus.", twinOf: "Turns barley into malt for the brewers. A small concern feeding the local alehouses, and one that only runs when grain is in surplus.", excludes: Object.freeze(["institution: tavern"]) }),
  ]),
  "Malts barley for brewing on a modest scale, supplying the alehouses nearby. It needs grain to spare before it can work at all.": Object.freeze([
    Object.freeze({ text: "Malts barley for brewing on a modest scale, supplying the alehouses nearby. It needs grain to spare before it can work at all.", needs: Object.freeze(["institution: tavern"]) }),
    Object.freeze({ text: "Malts barley on a modest scale for brewing at home. It needs grain to spare before it can work at all.", twinOf: "Malts barley for brewing on a modest scale, supplying the alehouses nearby. It needs grain to spare before it can work at all.", excludes: Object.freeze(["institution: tavern"]) }),
  ]),
  // W2-FIX-DATA-8 (2026-11-14; HANDBACK-6 section 8 row 3, ROUND-3-CUT-INCREMENT ww-1415): the village brewer's three lines
  // name the alehouses it supplies; each needs one on the roster, and its twin, in the same voice, supplies the households
  // (VETOABLE wording, the owner's). The twins presume no alehouse either way (the Town watch's shape): the cascade adds
  // an Ale house AFTER the description draw (r2r-village-24, -54: 2 of the census's 6 brewer villages with one), so a twin
  // that excluded it would be false there by the final record.
  "Converts malted grain to ale in quantity. The largest consumer of grain after bread. Supplies alehouses and households.": Object.freeze([
    Object.freeze({ text: "Converts malted grain to ale in quantity. The largest consumer of grain after bread. Supplies alehouses and households.", needs: Object.freeze(["institution: tavern"]) }),
    Object.freeze({ text: "Converts malted grain to ale in quantity. The largest consumer of grain after bread. Supplies the households.", twinOf: "Converts malted grain to ale in quantity. The largest consumer of grain after bread. Supplies alehouses and households." }),
  ]),
  "Turns malted grain into ale by the barrel. Only bread takes more of the grain. It supplies both alehouses and homes.": Object.freeze([
    Object.freeze({ text: "Turns malted grain into ale by the barrel. Only bread takes more of the grain. It supplies both alehouses and homes.", needs: Object.freeze(["institution: tavern"]) }),
    Object.freeze({ text: "Turns malted grain into ale by the barrel. Only bread takes more of the grain. It supplies the homes hereabouts.", twinOf: "Turns malted grain into ale by the barrel. Only bread takes more of the grain. It supplies both alehouses and homes." }),
  ]),
  "Makes ale in bulk from malted grain. The second-greatest draw on the grain supply after bread. Alehouses and households alike are stocked from here.": Object.freeze([
    Object.freeze({ text: "Makes ale in bulk from malted grain. The second-greatest draw on the grain supply after bread. Alehouses and households alike are stocked from here.", needs: Object.freeze(["institution: tavern"]) }),
    Object.freeze({ text: "Makes ale in bulk from malted grain. The second-greatest draw on the grain supply after bread. The households are stocked from here.", twinOf: "Makes ale in bulk from malted grain. The second-greatest draw on the grain supply after bread. Alehouses and households alike are stocked from here." }),
  ]),
  "Part-time guards. Night patrol and gate duty.": Object.freeze([
    Object.freeze({ text: "Part-time guards. Night patrol and gate duty.", needs: Object.freeze(["gate"]) }),
    Object.freeze({ text: "Part-time guards. Night patrols through the lanes.", twinOf: "Part-time guards. Night patrol and gate duty." }),
  ]),
  "Part-time guards who walk the night and hold the gates.": Object.freeze([
    Object.freeze({ text: "Part-time guards who walk the night and hold the gates.", needs: Object.freeze(["gate"]) }),
    Object.freeze({ text: "Part-time guards who walk the night and keep the peace.", twinOf: "Part-time guards who walk the night and hold the gates." }),
  ]),
  "Watchmen serving part-time. Night patrols and gate duty.": Object.freeze([
    Object.freeze({ text: "Watchmen serving part-time. Night patrols and gate duty.", needs: Object.freeze(["gate"]) }),
    Object.freeze({ text: "Men and women serving part-time, walking the night rounds.", twinOf: "Watchmen serving part-time. Night patrols and gate duty." }),
  ]),
  "Kiln crews in the surrounding woodland supply charcoal to the smelters, smiths, and bakers. Metalworking here burns through a forest a generation.": Object.freeze([
    Object.freeze({ text: "Kiln crews in the surrounding woodland supply charcoal to the smelters, smiths, and bakers. Metalworking here burns through a forest a generation.", needs: Object.freeze(["terrain: forest"]) }),
    Object.freeze({ text: "Turf-covered kilns for burning wood slowly down to charcoal whenever wood can be had: the fuel that burns hottest.", twinOf: "Kiln crews in the surrounding woodland supply charcoal to the smelters, smiths, and bakers. Metalworking here burns through a forest a generation.", excludes: Object.freeze(["terrain: forest"]) }),
  ]),
  "Crews tend kilns out in the woods and sell charcoal to smelters, smiths, and bakers. The metal trades here use up a forest a generation.": Object.freeze([
    Object.freeze({ text: "Crews tend kilns out in the woods and sell charcoal to smelters, smiths, and bakers. The metal trades here use up a forest a generation.", needs: Object.freeze(["terrain: forest"]) }),
    Object.freeze({ text: "Charcoal kilns, tended day and night while a burn lasts, whenever wood can be had. Charcoal feeds the hottest fires.", twinOf: "Crews tend kilns out in the woods and sell charcoal to smelters, smiths, and bakers. The metal trades here use up a forest a generation.", excludes: Object.freeze(["terrain: forest"]) }),
  ]),
  "Charcoal from woodland kilns feeds the smelters, the smithies, and the bake ovens. At this pace of metalwork, a forest lasts a generation.": Object.freeze([
    Object.freeze({ text: "Charcoal from woodland kilns feeds the smelters, the smithies, and the bake ovens. At this pace of metalwork, a forest lasts a generation.", needs: Object.freeze(["terrain: forest"]) }),
    Object.freeze({ text: "A collier's kilns under their turf, turning wood into charcoal whenever wood can be had: the fuel that burns hottest.", twinOf: "Charcoal from woodland kilns feeds the smelters, the smithies, and the bake ovens. At this pace of metalwork, a forest lasts a generation.", excludes: Object.freeze(["terrain: forest"]) }),
  ]),
  "Operates kilns in the surrounding woodland, supplying fuel for smithing, baking, and heating. The settlement's most reliable fuel source when timber is abundant.": Object.freeze([
    Object.freeze({ text: "Operates kilns in the surrounding woodland, supplying fuel for smithing, baking, and heating. The settlement's most reliable fuel source when timber is abundant.", needs: Object.freeze(["terrain: forest"]) }),
    Object.freeze({ text: "Turf-covered kilns for burning wood slowly down to charcoal whenever wood can be had: the fuel that burns hottest.", twinOf: "Operates kilns in the surrounding woodland, supplying fuel for smithing, baking, and heating. The settlement's most reliable fuel source when timber is abundant.", excludes: Object.freeze(["terrain: forest"]) }),
  ]),
  "Works kilns out in the surrounding woods, producing the fuel for smiths, bakers, and hearths. Where timber runs plentiful, no fuel source is steadier.": Object.freeze([
    Object.freeze({ text: "Works kilns out in the surrounding woods, producing the fuel for smiths, bakers, and hearths. Where timber runs plentiful, no fuel source is steadier.", needs: Object.freeze(["terrain: forest"]) }),
    Object.freeze({ text: "Charcoal kilns, tended day and night while a burn lasts, whenever wood can be had. Charcoal feeds the hottest fires.", twinOf: "Works kilns out in the surrounding woods, producing the fuel for smiths, bakers, and hearths. Where timber runs plentiful, no fuel source is steadier.", excludes: Object.freeze(["terrain: forest"]) }),
  ]),
  "Tends charcoal kilns in the nearby woodland to feed the forge, the oven, and the fire. When timber is abundant, it is the settlement's surest supply of fuel.": Object.freeze([
    Object.freeze({ text: "Tends charcoal kilns in the nearby woodland to feed the forge, the oven, and the fire. When timber is abundant, it is the settlement's surest supply of fuel.", needs: Object.freeze(["terrain: forest"]) }),
    Object.freeze({ text: "A collier's kilns under their turf, turning wood into charcoal whenever wood can be had: the fuel that burns hottest.", twinOf: "Tends charcoal kilns in the nearby woodland to feed the forge, the oven, and the fire. When timber is abundant, it is the settlement's surest supply of fuel.", excludes: Object.freeze(["terrain: forest"]) }),
  ]),
  "Operates kilns in nearby woodland. Supplies fuel for smithing and baking. Essential intermediate step between forest and forge.": Object.freeze([
    Object.freeze({ text: "Operates kilns in nearby woodland. Supplies fuel for smithing and baking. Essential intermediate step between forest and forge.", needs: Object.freeze(["terrain: forest"]) }),
    Object.freeze({ text: "Turf-covered kilns for burning wood slowly down to charcoal whenever wood can be had: the fuel that burns hottest.", twinOf: "Operates kilns in nearby woodland. Supplies fuel for smithing and baking. Essential intermediate step between forest and forge.", excludes: Object.freeze(["terrain: forest"]) }),
  ]),
  "Tends kilns out in the nearby woods, supplying the fuel that smiths and bakers burn. The necessary link between forest and forge.": Object.freeze([
    Object.freeze({ text: "Tends kilns out in the nearby woods, supplying the fuel that smiths and bakers burn. The necessary link between forest and forge.", needs: Object.freeze(["terrain: forest"]) }),
    Object.freeze({ text: "Charcoal kilns, tended day and night while a burn lasts, whenever wood can be had. Charcoal feeds the hottest fires.", twinOf: "Tends kilns out in the nearby woods, supplying the fuel that smiths and bakers burn. The necessary link between forest and forge.", excludes: Object.freeze(["terrain: forest"]) }),
  ]),
  "Works kilns in the woodland close by, turning timber into the fuel that burns hottest. Without the kilns nothing gets from the trees to the fire.": Object.freeze([
    Object.freeze({ text: "Works kilns in the woodland close by, turning timber into the fuel that burns hottest. Without the kilns nothing gets from the trees to the fire.", needs: Object.freeze(["terrain: forest"]) }),
    Object.freeze({ text: "A collier's kilns under their turf, turning wood into charcoal whenever wood can be had: the fuel that burns hottest.", twinOf: "Works kilns in the woodland close by, turning timber into the fuel that burns hottest. Without the kilns nothing gets from the trees to the fire.", excludes: Object.freeze(["terrain: forest"]) }),
  ]),
  "Levies duties on goods entering and leaving via the port or main roads. Run by royal or municipal officials.": Object.freeze([
    Object.freeze({ text: "Levies duties on goods entering and leaving via the port or main roads. Run by royal or municipal officials.", needs: Object.freeze(["institution: docks"]) }),
    Object.freeze({ text: "Levies duties on goods entering and leaving by the main roads. Run by royal or municipal officials.", twinOf: "Levies duties on goods entering and leaving via the port or main roads. Run by royal or municipal officials.", excludes: Object.freeze(["institution: docks"]) }),
  ]),
  "Duties are taken here on goods passing through the port or the main roads. Royal or municipal officers run it.": Object.freeze([
    Object.freeze({ text: "Duties are taken here on goods passing through the port or the main roads. Royal or municipal officers run it.", needs: Object.freeze(["institution: docks"]) }),
    Object.freeze({ text: "Duties are taken here on goods passing along the main roads. Royal or municipal officers run it.", twinOf: "Duties are taken here on goods passing through the port or the main roads. Royal or municipal officers run it.", excludes: Object.freeze(["institution: docks"]) }),
  ]),
  "Levies charged on all trade in and out by road or harbour, collected by officials of crown or town.": Object.freeze([
    Object.freeze({ text: "Levies charged on all trade in and out by road or harbour, collected by officials of crown or town.", needs: Object.freeze(["institution: docks"]) }),
    Object.freeze({ text: "Levies charged on all trade in and out by road, collected by officials of crown or town.", twinOf: "Levies charged on all trade in and out by road or harbour, collected by officials of crown or town.", excludes: Object.freeze(["institution: docks"]) }),
  ]),
  "Lends against pledged goods at high interest and asks no questions. The only credit open to labourers, journeymen, and anyone the banks turn away.": Object.freeze([
    Object.freeze({ text: "Lends against pledged goods at high interest and asks no questions. The only credit open to labourers, journeymen, and anyone the banks turn away.", needs: Object.freeze(["institution: bank"]) }),
    Object.freeze({ text: "Lends against pledged goods at high interest and asks no questions. For labourers and journeymen it is the only credit there is.", twinOf: "Lends against pledged goods at high interest and asks no questions. The only credit open to labourers, journeymen, and anyone the banks turn away.", excludes: Object.freeze(["institution: bank"]) }),
  ]),
  "Takes pledges and lends at steep interest, no questions asked. It is the only credit for labourers, journeymen, and whoever the banks refuse.": Object.freeze([
    Object.freeze({ text: "Takes pledges and lends at steep interest, no questions asked. It is the only credit for labourers, journeymen, and whoever the banks refuse.", needs: Object.freeze(["institution: bank"]) }),
    Object.freeze({ text: "Takes pledges and lends at steep interest, no questions asked. Labourers and journeymen have nowhere else to borrow.", twinOf: "Takes pledges and lends at steep interest, no questions asked. It is the only credit for labourers, journeymen, and whoever the banks refuse.", excludes: Object.freeze(["institution: bank"]) }),
  ]),
  "High-interest loans against pledged goods, with no questions. For labourers, journeymen, and anyone the banks will not serve, it is the only lender.": Object.freeze([
    Object.freeze({ text: "High-interest loans against pledged goods, with no questions. For labourers, journeymen, and anyone the banks will not serve, it is the only lender.", needs: Object.freeze(["institution: bank"]) }),
    Object.freeze({ text: "High-interest loans against pledged goods, with no questions. For labourers and journeymen it is the only lender going.", twinOf: "High-interest loans against pledged goods, with no questions. For labourers, journeymen, and anyone the banks will not serve, it is the only lender.", excludes: Object.freeze(["institution: bank"]) }),
  ]),
  "Communal grain storage. Buffers harvests, prevents famine.": Object.freeze([
    Object.freeze({ text: "Communal grain storage. Buffers harvests, prevents famine.", excludes: Object.freeze(["crisis: famine"]) }),
    Object.freeze({ text: "Communal grain storage, meant to carry the town through bad harvests. This year it has not been enough.", twinOf: "Communal grain storage. Buffers harvests, prevents famine.", crisis: Object.freeze(["famine"]) }),
  ]),
  "Shared grain stores that even out the harvests and hold off famine.": Object.freeze([
    Object.freeze({ text: "Shared grain stores that even out the harvests and hold off famine.", excludes: Object.freeze(["crisis: famine"]) }),
    Object.freeze({ text: "Shared grain stores, built to even out the harvests. The famine is drawing them down faster than any harvest could refill them.", twinOf: "Shared grain stores that even out the harvests and hold off famine.", crisis: Object.freeze(["famine"]) }),
  ]),
  "The old grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next. New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening. Who is lifted and who is left where they lie is settled by what a family endowed.": Object.freeze([
    Object.freeze({ text: "The old grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next. New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening. Who is lifted and who is left where they lie is settled by what a family endowed.", needs: Object.freeze(["walls","gate"]), excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "The old grounds filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next. Since the siege closed the roads, no cart goes out to the new ground, and the newly dead wait in the charnel house. Who is lifted and who is left where they lie is settled by what a family endowed.", twinOf: "The old grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next. New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening. Who is lifted and who is left where they lie is settled by what a family endowed.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "Carts go out at dusk to ground bought beyond the walls, and the charnel house holds what the old plots gave up. What a family endowed decides who is lifted and who is left.": Object.freeze([
    Object.freeze({ text: "Carts go out at dusk to ground bought beyond the walls, and the charnel house holds what the old plots gave up. What a family endowed decides who is lifted and who is left.", needs: Object.freeze(["walls"]), excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "The charnel house holds what the old plots gave up, and with the roads cut it now holds the newly dead as well. What a family endowed decides who is lifted and who is left.", twinOf: "Carts go out at dusk to ground bought beyond the walls, and the charnel house holds what the old plots gave up. What a family endowed decides who is lifted and who is left.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "Organized sellsword companies. Major forces (hundreds to thousands).": Object.freeze([
    Object.freeze({ text: "Organized sellsword companies. Major forces (hundreds to thousands).", needs: Object.freeze(["tier: = metropolis","mercenary"]) }),
    Object.freeze({ text: "Organized sellsword companies. Real forces, a few score to a few hundred blades apiece.", twinOf: "Organized sellsword companies. Major forces (hundreds to thousands).", needs: Object.freeze(["mercenary"]) }),
  ]),
  "Sellsword companies under proper organisation, mustering hundreds to thousands.": Object.freeze([
    Object.freeze({ text: "Sellsword companies under proper organisation, mustering hundreds to thousands.", needs: Object.freeze(["tier: = metropolis","mercenary"]) }),
    Object.freeze({ text: "Sellsword companies under proper organisation, each mustering a few score blades, the largest some hundreds.", twinOf: "Sellsword companies under proper organisation, mustering hundreds to thousands.", needs: Object.freeze(["mercenary"]) }),
  ]),
  "Organised bands of hired blades. Major forces, hundreds to thousands strong.": Object.freeze([
    Object.freeze({ text: "Organised bands of hired blades. Major forces, hundreds to thousands strong.", needs: Object.freeze(["tier: = metropolis","mercenary"]) }),
    Object.freeze({ text: "Organised bands of hired blades, a few score to a few hundred strong.", twinOf: "Organised bands of hired blades. Major forces, hundreds to thousands strong.", needs: Object.freeze(["mercenary"]) }),
  ]),
  "A covered fish market under the market wardens. Whenever fish can be had, the morning's catch or the week's salted barrels are sold by weight and inspected for rot.": Object.freeze([
    Object.freeze({ text: "A covered fish market under the market wardens. Whenever fish can be had, the morning's catch or the week's salted barrels are sold by weight and inspected for rot.", needs: Object.freeze(["navigable","market"]) }),
    Object.freeze({ text: "A covered fish market under the market wardens. Salted, smoked and dried fish come in by cart whenever fish can be had, sold by weight and inspected for rot.", twinOf: "A covered fish market under the market wardens. Whenever fish can be had, the morning's catch or the week's salted barrels are sold by weight and inspected for rot.", needs: Object.freeze(["market"]), excludes: Object.freeze(["navigable"]) }),
  ]),
  "Covered stalls under the wardens' eye, selling the morning's catch or the week's salted barrels by weight whenever fish can be had, each checked for rot.": Object.freeze([
    Object.freeze({ text: "Covered stalls under the wardens' eye, selling the morning's catch or the week's salted barrels by weight whenever fish can be had, each checked for rot.", needs: Object.freeze(["navigable","market"]) }),
    Object.freeze({ text: "Covered stalls under the wardens' eye, selling salt fish and dried fish carted in by the barrel whenever fish can be had, each checked for rot.", twinOf: "Covered stalls under the wardens' eye, selling the morning's catch or the week's salted barrels by weight whenever fish can be had, each checked for rot.", needs: Object.freeze(["market"]), excludes: Object.freeze(["navigable"]) }),
  ]),
  "The market wardens keep a roofed fish market where, whenever fish can be had, fresh catch and salted barrels are weighed out and inspected before sale.": Object.freeze([
    Object.freeze({ text: "The market wardens keep a roofed fish market where, whenever fish can be had, fresh catch and salted barrels are weighed out and inspected before sale.", needs: Object.freeze(["navigable","market"]) }),
    Object.freeze({ text: "The market wardens keep a roofed fish market where, whenever fish can be had, carted barrels of salt fish are weighed out and inspected before sale.", twinOf: "The market wardens keep a roofed fish market where, whenever fish can be had, fresh catch and salted barrels are weighed out and inspected before sale.", needs: Object.freeze(["market"]), excludes: Object.freeze(["navigable"]) }),
  ]),
  // W2-FIX-DATA-4 (2026-11-13; REVIEW-W2A-3 #502, #508): the river's boatyard and ferry stand in coastal ports with no river (the catalogue admits them by a port route); each text that names the river declares it, and its twin speaks of the water. VETOABLE wording (the owner's).
  "Builds and repairs flat-bottomed river craft: barges, punts, ferries, fishing boats. Specialist knowledge of river construction: shallow draft, flexible hull, replaceable parts.": Object.freeze([
    Object.freeze({ text: "Builds and repairs flat-bottomed river craft: barges, punts, ferries, fishing boats. Specialist knowledge of river construction: shallow draft, flexible hull, replaceable parts.", needs: Object.freeze(["river"]) }),
    Object.freeze({ text: "Builds and repairs flat-bottomed craft for shallow water: punts, ferries, fishing boats. Specialist knowledge: shallow draft, flexible hull, replaceable parts.", twinOf: "Builds and repairs flat-bottomed river craft: barges, punts, ferries, fishing boats. Specialist knowledge of river construction: shallow draft, flexible hull, replaceable parts.", excludes: Object.freeze(["river"]) }),
  ]),
  "Builds and mends flat-bottomed river craft: barges, punts, ferries, fishing boats. The work turns on river-boat knowledge: shallow draft, a hull that flexes, parts made to be replaced.": Object.freeze([
    Object.freeze({ text: "Builds and mends flat-bottomed river craft: barges, punts, ferries, fishing boats. The work turns on river-boat knowledge: shallow draft, a hull that flexes, parts made to be replaced.", needs: Object.freeze(["river"]) }),
    Object.freeze({ text: "Builds and mends flat-bottomed boats for shallow water: punts, ferries, fishing craft. The work turns on a shallow draft, a hull that flexes, and parts made to be replaced.", twinOf: "Builds and mends flat-bottomed river craft: barges, punts, ferries, fishing boats. The work turns on river-boat knowledge: shallow draft, a hull that flexes, parts made to be replaced.", excludes: Object.freeze(["river"]) }),
  ]),
  "River boats, all flat-bottomed, made and repaired here: barges, punts, ferries, and fishing craft. It takes a specialist's hand. Shallow in the draft, supple in the hull, and built so parts can be swapped out.": Object.freeze([
    Object.freeze({ text: "River boats, all flat-bottomed, made and repaired here: barges, punts, ferries, and fishing craft. It takes a specialist's hand. Shallow in the draft, supple in the hull, and built so parts can be swapped out.", needs: Object.freeze(["river"]) }),
    Object.freeze({ text: "Shallow-water boats, all flat-bottomed, made and repaired here: punts, ferries, and fishing craft. It takes a specialist's hand. Shallow in the draft, supple in the hull, and built so parts can be swapped out.", twinOf: "River boats, all flat-bottomed, made and repaired here: barges, punts, ferries, and fishing craft. It takes a specialist's hand. Shallow in the draft, supple in the hull, and built so parts can be swapped out.", excludes: Object.freeze(["river"]) }),
  ]),
  "A flat-bottomed ferry crossing the river. The ferryman's family holds the crossing rights, and every crossing pays the family its fare.": Object.freeze([
    Object.freeze({ text: "A flat-bottomed ferry crossing the river. The ferryman's family holds the crossing rights, and every crossing pays the family its fare.", needs: Object.freeze(["river"]) }),
    Object.freeze({ text: "A flat-bottomed ferry across the water. The ferryman's family holds the crossing rights, and every crossing pays the family its fare.", twinOf: "A flat-bottomed ferry crossing the river. The ferryman's family holds the crossing rights, and every crossing pays the family its fare.", excludes: Object.freeze(["river"]) }),
  ]),
  "A flat-bottomed ferry over the river, the crossing rights held in one family. Carts, beasts and walkers wait their turn on the bank.": Object.freeze([
    Object.freeze({ text: "A flat-bottomed ferry over the river, the crossing rights held in one family. Carts, beasts and walkers wait their turn on the bank.", needs: Object.freeze(["river"]) }),
    Object.freeze({ text: "A flat-bottomed ferry over the water, the crossing rights held in one family. Carts, beasts and walkers wait their turn at the landing.", twinOf: "A flat-bottomed ferry over the river, the crossing rights held in one family. Carts, beasts and walkers wait their turn on the bank.", excludes: Object.freeze(["river"]) }),
  ]),
  "The river is crossed here by a flat-bottomed ferry, worked by the family that holds the right to it.": Object.freeze([
    Object.freeze({ text: "The river is crossed here by a flat-bottomed ferry, worked by the family that holds the right to it.", needs: Object.freeze(["river"]) }),
    Object.freeze({ text: "The water is crossed here by a flat-bottomed ferry, worked by the family that holds the right to it.", twinOf: "The river is crossed here by a flat-bottomed ferry, worked by the family that holds the right to it.", excludes: Object.freeze(["river"]) }),
  ]),
  // W2-FIX-DATA-11 (2026-11-14; REVIEW-BAR-0 #185): the smelter's two variants "between the mine and the smithy" where
  // the town has no mine or no smith (every smelter town of the census prints one of three such texts; 159 of 241 lack a
  // house). Each text declares both houses; its twin names neither. The catalogue's own text ("The industrial intermediate
  // between mine and smithy") is not keyed here: its literal would be a new `house: mine` line (PARKED, HANDBACK-11).
  // VETOABLE wording (the owner's).
  "Charcoal furnaces reduce raw ore to refined metal. It stands between the mine and the smithy.": Object.freeze([
    Object.freeze({ text: "Charcoal furnaces reduce raw ore to refined metal. It stands between the mine and the smithy.", needs: Object.freeze(["institution: mine", "institution: smith"]) }),
    Object.freeze({ text: "Charcoal furnaces for reducing raw ore to refined metal whenever ore can be had, cast in bars for whoever will buy them.", twinOf: "Charcoal furnaces reduce raw ore to refined metal. It stands between the mine and the smithy." }),
  ]),
  "Refines crude ore into workable metal over charcoal fire. The industrial step from what the mine yields to what the smith uses.": Object.freeze([
    Object.freeze({ text: "Refines crude ore into workable metal over charcoal fire. The industrial step from what the mine yields to what the smith uses.", needs: Object.freeze(["institution: mine", "institution: smith"]) }),
    Object.freeze({ text: "Refines crude ore into workable metal over charcoal fire whenever ore can be had, and sells it on by the bar.", twinOf: "Refines crude ore into workable metal over charcoal fire. The industrial step from what the mine yields to what the smith uses." }),
  ]),
  // W2-FIX-DATA-5 (2026-11-13; REVIEW-W2A-3 #973, #238; the cell of ROUND-3-CUT-INCREMENT ww-494): the Annual fair's merchants
  // and the toll bridge's steady fees under a siege that cuts every road. Each text declares the siege off; its twin says
  // the roads are held. VETOABLE wording (the owner's).
  "Regional merchants. Luxury goods available.": Object.freeze([
    Object.freeze({ text: "Regional merchants. Luxury goods available.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "A yearly fair for regional merchants. None can reach it while the roads are held.", twinOf: "Regional merchants. Luxury goods available.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "Merchants from across the region, and luxuries to be had.": Object.freeze([
    Object.freeze({ text: "Merchants from across the region, and luxuries to be had.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "A yearly gathering of the region's merchants, cut off while the siege holds the roads.", twinOf: "Merchants from across the region, and luxuries to be had.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "A yearly draw for regional traders, with fine goods on offer.": Object.freeze([
    Object.freeze({ text: "A yearly draw for regional traders, with fine goods on offer.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "A yearly draw for regional traders, though none can come while the roads are held.", twinOf: "A yearly draw for regional traders, with fine goods on offer.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "A bridge with a toll house. The keeper collects passage fees and performs basic maintenance. Minor but steady revenue.": Object.freeze([
    Object.freeze({ text: "A bridge with a toll house. The keeper collects passage fees and performs basic maintenance. Minor but steady revenue.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "A bridge with a toll house. The keeper collects passage fees and performs basic maintenance. With the roads held, no one crosses and nothing is taken.", twinOf: "A bridge with a toll house. The keeper collects passage fees and performs basic maintenance. Minor but steady revenue.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "A bridge with a toll house upon it. The keeper takes the passage fees and sees to simple upkeep. The income is small but never fails.": Object.freeze([
    Object.freeze({ text: "A bridge with a toll house upon it. The keeper takes the passage fees and sees to simple upkeep. The income is small but never fails.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "A bridge with a toll house upon it. The keeper takes the passage fees and sees to simple upkeep, though no one has crossed since the roads were cut.", twinOf: "A bridge with a toll house upon it. The keeper takes the passage fees and sees to simple upkeep. The income is small but never fails.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "A toll house guards this bridge; its keeper gathers the crossing fees and handles the basic repairs. Modest revenue, but steady.": Object.freeze([
    Object.freeze({ text: "A toll house guards this bridge; its keeper gathers the crossing fees and handles the basic repairs. Modest revenue, but steady.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "A toll house guards this bridge; its keeper gathers the crossing fees and handles the basic repairs. Since the siege closed the roads, there are none to gather.", twinOf: "A toll house guards this bridge; its keeper gathers the crossing fees and handles the basic repairs. Modest revenue, but steady.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  // W2-FIX-DATA-5 (2026-11-13; ROUND-3-CUT #17): the thorp's burial ground says no clergy is near enough to speak, in a thorp
  // whose people go to a neighbour's parish church ("Access to parish church", whose Last rites the parish priest comes to say).
  // Each such text declares the faith reading's access answer (`church access`, faithReading.js :: accessOnly) on its excludes
  // side, and its twin says the words wait for a priest when one can be fetched in time. The twin is true whether or not
  // the access survives the roster's later trim (it does not in about a quarter of these thorps): it claims no priest
  // near, and no want of one. VETOABLE wording (the owner's).
  "A corner of the holding left out of the plough, banked with turf and marked with fieldstones. No clergy lives near enough to speak over anyone, so the words are said by whoever knew the dead best. The oldest markers have lost their names to the weather and are kept clear anyway.": Object.freeze([
    Object.freeze({ text: "A corner of the holding left out of the plough, banked with turf and marked with fieldstones. No clergy lives near enough to speak over anyone, so the words are said by whoever knew the dead best. The oldest markers have lost their names to the weather and are kept clear anyway.", excludes: Object.freeze(["church access"]) }),
    Object.freeze({ text: "A corner of the holding left out of the plough, banked with turf and marked with fieldstones. A priest says the words when one can be brought in time; when one cannot, whoever knew the dead best says them. The oldest markers have lost their names to the weather and are kept clear anyway.", twinOf: "A corner of the holding left out of the plough, banked with turf and marked with fieldstones. No clergy lives near enough to speak over anyone, so the words are said by whoever knew the dead best. The oldest markers have lost their names to the weather and are kept clear anyway.", needs: Object.freeze(["church access"]) }),
  ]),
  "A turf-banked corner of the holding, kept out of the plough and marked with fieldstones. No clergy is near enough to speak, so the words fall to whoever knew the dead best.": Object.freeze([
    Object.freeze({ text: "A turf-banked corner of the holding, kept out of the plough and marked with fieldstones. No clergy is near enough to speak, so the words fall to whoever knew the dead best.", excludes: Object.freeze(["church access"]) }),
    Object.freeze({ text: "A turf-banked corner of the holding, kept out of the plough and marked with fieldstones. A priest speaks when one can be fetched in time; otherwise the words fall to whoever knew the dead best.", twinOf: "A turf-banked corner of the holding, kept out of the plough and marked with fieldstones. No clergy is near enough to speak, so the words fall to whoever knew the dead best.", needs: Object.freeze(["church access"]) }),
  ]),
  "Fieldstones on a low bank at the edge of the ploughland. The rites are said by neighbours because there is nobody else to say them, and the weathered markers are kept clear regardless.": Object.freeze([
    Object.freeze({ text: "Fieldstones on a low bank at the edge of the ploughland. The rites are said by neighbours because there is nobody else to say them, and the weathered markers are kept clear regardless.", excludes: Object.freeze(["church access"]) }),
    Object.freeze({ text: "Fieldstones on a low bank at the edge of the ploughland. The rites wait for a priest when one can be fetched in time, and the neighbours say them when not; the weathered markers are kept clear regardless.", twinOf: "Fieldstones on a low bank at the edge of the ploughland. The rites are said by neighbours because there is nobody else to say them, and the weathered markers are kept clear regardless.", needs: Object.freeze(["church access"]) }),
  ]),
  // TAIL-HOUSES-2 batch 4 (2026-11-15; READ-ALL WORKLIST-HOUSES 02662, the chair's H7): the cartographers' guild names SEA
  // CHARTS, false in a city with no coast (147 of the 176 census towns that print one). Each text needs the coast; its twin,
  // in the same voice, names no sea charts. VETOABLE wording (the owner's).
  "A guild of professional cartographers producing regional maps, sea charts, property surveys, and military reconnaissance maps. Sells off-the-shelf maps and takes commissions. The city's maps are the most accurate in the region.": Object.freeze([
    Object.freeze({ text: "A guild of professional cartographers producing regional maps, sea charts, property surveys, and military reconnaissance maps. Sells off-the-shelf maps and takes commissions. The city's maps are the most accurate in the region.", needs: Object.freeze(["coast"]) }),
    Object.freeze({ text: "A guild of professional cartographers producing regional maps, property surveys, and military reconnaissance maps. Sells off-the-shelf maps and takes commissions. The city's maps are the most accurate in the region.", twinOf: "A guild of professional cartographers producing regional maps, sea charts, property surveys, and military reconnaissance maps. Sells off-the-shelf maps and takes commissions. The city's maps are the most accurate in the region.", excludes: Object.freeze(["coast"]) }),
  ]),
  "A guild of professional cartographers turning out regional maps, sea charts, property surveys, and military reconnaissance. It sells ready-made maps and works to commission. No maps in the region are more accurate than the city's.": Object.freeze([
    Object.freeze({ text: "A guild of professional cartographers turning out regional maps, sea charts, property surveys, and military reconnaissance. It sells ready-made maps and works to commission. No maps in the region are more accurate than the city's.", needs: Object.freeze(["coast"]) }),
    Object.freeze({ text: "A guild of professional cartographers turning out regional maps, property surveys, and military reconnaissance. It sells ready-made maps and works to commission. No maps in the region are more accurate than the city's.", twinOf: "A guild of professional cartographers turning out regional maps, sea charts, property surveys, and military reconnaissance. It sells ready-made maps and works to commission. No maps in the region are more accurate than the city's.", excludes: Object.freeze(["coast"]) }),
  ]),
  "Professional cartographers, guild-organised, producing regional maps, sea charts, property surveys, and reconnaissance maps for the army. Some sell off the shelf, others are drawn to order. The city's are the most accurate maps the region has.": Object.freeze([
    Object.freeze({ text: "Professional cartographers, guild-organised, producing regional maps, sea charts, property surveys, and reconnaissance maps for the army. Some sell off the shelf, others are drawn to order. The city's are the most accurate maps the region has.", needs: Object.freeze(["coast"]) }),
    Object.freeze({ text: "Professional cartographers, guild-organised, producing regional maps, property surveys, and reconnaissance maps for the army. Some sell off the shelf, others are drawn to order. The city's are the most accurate maps the region has.", twinOf: "Professional cartographers, guild-organised, producing regional maps, sea charts, property surveys, and reconnaissance maps for the army. Some sell off the shelf, others are drawn to order. The city's are the most accurate maps the region has.", excludes: Object.freeze(["coast"]) }),
  ]),
});

/**
 * THE DECLARATION COLUMN (CENSUS-4c unit 5; docs/DESIGN_POOL_CENSUS.md; the phase-A ledger
 * docs/census/declarations/institutionDescVariants.INSTITUTION_DESC_VARIANTS.json). A variant that
 * presumes a record fact the key does not guarantee declares it HERE, keyed by its exact text — the
 * shape R-P(3) accepted for the sibling sets above: six string consumers read the pairs (the ship
 * filter, the tier-noun walkers, the dossier corpus), and the resolver reads by text. A variant with
 * no row declares nothing (the key guarantees the institution and the tier). The draw
 * (`steps/assembleInstitutions.js` pickVariant, Appendix B site 18, H) is CENSUS-1d's to wire:
 * lift a drawn text to `{ text, ...DESC_VARIANT_DECLARATIONS[text] }`, resolve after the draw.
 * Each key is held live by tests/generators/institutionProseDeclared.test.js.
 *
 * WAITING ON ORDER (R-Q, not declared): Town watch #0/#1 presume a
 * GATE, which the cascade can add after the description draw (4 of 1,525 measured births). The town Parish burial
 * grounds #0 named a gate too; it names none since TAIL-HOUSES-2 batch 3 (true with a gate or without).
 */
export const DESC_VARIANT_DECLARATIONS = Object.freeze({
  "A rough jetty and its salting-and-drying racks, where the hamlet's catch is landed and cured whenever fish can be had.": Object.freeze({ needs: Object.freeze(["tier: ≤ hamlet"]) }), // hamlet|Economy|Fisher's landing#1
  "Tends kilns out in the nearby woods, supplying the fuel that smiths and bakers burn. The necessary link between forest and forge.": Object.freeze({ needs: Object.freeze(["terrain: forest"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Works kilns in the woodland close by, turning timber into the fuel that burns hottest. Without the kilns nothing gets from the trees to the fire.": Object.freeze({ needs: Object.freeze(["terrain: forest"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "A plain hall held under a regional adventurers' charter. It posts bounties, houses monster hunters, and takes up the local defence no garrison is here to keep. You find them along dangerous frontiers.": Object.freeze({ excludes: Object.freeze(["garrison"]) }), // hamlet|Adventuring|Adventurers' charter hall#0
  "Chartered by the region's adventuring order and little more than a rough hall for it. Bounties go up on its board, monster hunters bed down inside, and with no garrison to call on it musters the defence. A frontier fixture where the country is dangerous.": Object.freeze({ excludes: Object.freeze(["garrison"]) }), // hamlet|Adventuring|Adventurers' charter hall#1
  "Goods route through the hamlet to slip past the toll roads and customs posts. It is paid for the service in kind, and glad of it.": Object.freeze({ needs: Object.freeze(["tier: ≤ hamlet"]) }), // hamlet|Criminal|Smuggling waypoint#0
  "Contraband moves through here, skirting the tolls and the customs checks. The hamlet takes its cut in goods, not coin.": Object.freeze({ needs: Object.freeze(["tier: ≤ hamlet"]) }), // hamlet|Criminal|Smuggling waypoint#1
  "An open stall or small roofed market for selling the day's catch. The price falls quickly, for fish keeps no better than a day.": Object.freeze({ needs: Object.freeze(["navigable"]) }), // village|Economy|Fish market#0
  "Where the day's catch is sold, from an open stall or a small covered market. Prices sink fast. Fish will not wait.": Object.freeze({ needs: Object.freeze(["navigable"]) }), // village|Economy|Fish market#1
  "Milk, butter, and soft cheese from cattle or goats, whenever livestock can be had. What isn't used is sold on.": Object.freeze({ needs: Object.freeze(["market"]) }), // village|Economy|Dairy farmer#0
  "A herd of cattle or goats, whenever livestock can be had, for milk, butter, and soft cheese. Any surplus is sold on.": Object.freeze({ needs: Object.freeze(["market"]) }), // village|Economy|Dairy farmer#1
  "Catches wildfowl (using snares, nets, and trained birds) to stock the market with duck, goose, and pigeon.": Object.freeze({ needs: Object.freeze(["market"]) }), // village|Economy|Wildfowler#1
  "Works kilns out in the surrounding woods, producing the fuel for smiths, bakers, and hearths. Where timber runs plentiful, no fuel source is steadier.": Object.freeze({ needs: Object.freeze(["terrain: forest"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Tends charcoal kilns in the nearby woodland to feed the forge, the oven, and the fire. When timber is abundant, it is the settlement's surest supply of fuel.": Object.freeze({ needs: Object.freeze(["terrain: forest"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "A flat-bottomed ferry over the river, the crossing rights held in one family. Carts, beasts and walkers wait their turn on the bank.": Object.freeze({ needs: Object.freeze(["river"]) }), // village|Economy|River ferry#0
  "The river is crossed here by a flat-bottomed ferry, worked by the family that holds the right to it.": Object.freeze({ needs: Object.freeze(["river"]) }), // village|Economy|River ferry#1
  "Builds and mends flat-bottomed river craft: barges, punts, ferries, fishing boats. The work turns on river-boat knowledge: shallow draft, a hull that flexes, parts made to be replaced.": Object.freeze({ needs: Object.freeze(["river"]) }), // village|Economy|River boatyard#0
  "River boats, all flat-bottomed, made and repaired here: barges, punts, ferries, and fishing craft. It takes a specialist's hand. Shallow in the draft, supple in the hull, and built so parts can be swapped out.": Object.freeze({ needs: Object.freeze(["river"]) }), // village|Economy|River boatyard#1
  "Turns hides to leather with oak bark, whenever hides can be had. The stink of it keeps it downstream. Without it there are no shoes, no harness, no straps.": Object.freeze({ needs: Object.freeze(["river"]) }), // village|Crafts|Tannery#0
  "Hides become leather here whenever hides can be had, cured with oak bark. It reeks, and so it sits downstream, but shoes, harness, and straps all depend on it.": Object.freeze({ needs: Object.freeze(["river"]) }), // village|Crafts|Tannery#1
  "Crews tend kilns out in the woods and sell charcoal to smelters, smiths, and bakers. The metal trades here use up a forest a generation.": Object.freeze({ needs: Object.freeze(["terrain: forest"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Charcoal from woodland kilns feeds the smelters, the smithies, and the bake ovens. At this pace of metalwork, a forest lasts a generation.": Object.freeze({ needs: Object.freeze(["terrain: forest"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Builds and mends ocean-going merchantmen. It wants a steady supply of timber, iron fittings, and skilled shipwrights. A great employer, and a heavy investment of capital.": Object.freeze({ needs: Object.freeze(["coast"]) }), // town|Economy|Shipyard#0
  "Sea-going trade vessels are built and repaired here, on a footing of constant timber, iron fittings, and specialist labour. It employs many and ties up much capital.": Object.freeze({ needs: Object.freeze(["coast"]) }), // town|Economy|Shipyard#1
  "A fleet of river barges working scheduled and commissioned runs. It carries bulk cargo, passengers, and military supply along the river network.": Object.freeze({ needs: Object.freeze(["river"]) }), // town|Economy|Barge and river transport company#0
  "River barges run in fleet, some to a schedule and some to order. Bulk freight, passengers, and army supply all move on them through the river network.": Object.freeze({ needs: Object.freeze(["river"]) }), // town|Economy|Barge and river transport company#1
  "Traffic is regulated here, anchorage fees collected, berths handed out, and sea-law enforced.": Object.freeze({ needs: Object.freeze(["coast"]) }), // town|Economy|Harbour master's office#1
  "The modest end of the news trade. A paid register of who came into the city and what they reported, kept openly and taxed like any other counter.": Object.freeze({ needs: Object.freeze(["tier: ≥ city"]) }), // town|Economy|Listening post#1
  "A full tannery of many vats and a guild-trained workforce, turning out fine leather for shoes, armour, and saddlery.": Object.freeze({ needs: Object.freeze(["guild"]) }), // town|Crafts|Tanner (established)#0
  "Multiple vats, trained hands from the guild. A proper tannery whose leather is good enough for footwear, armour, and saddlery.": Object.freeze({ needs: Object.freeze(["guild"]) }), // town|Crafts|Tanner (established)#1
  "The town's bread. Prices fixed by the guild.": Object.freeze({ needs: Object.freeze(["guild"]) }), // town|Crafts|Bakers (5-15)#0
  "Bread baked for sale, with the guild setting the price.": Object.freeze({ needs: Object.freeze(["guild"]) }), // town|Crafts|Bakers (5-15)#1
  "Each congregation buries its own, and the sexton keeps the roll that inheritance disputes are settled from. Guilds buy plots together so their members lie among their trade.": Object.freeze({ needs: Object.freeze(["guild"]) }), // town|Religious|Parish burial grounds#1
  "The official voice, reading proclamations, market prices, and news at set hours in the market square. Town or guild pays the wage.": Object.freeze({ needs: Object.freeze(["market"]) }), // town|Government|Town crier#0
  "At fixed times the proclamations, the prices, and the news are called out in the market square. The town pays for it, or else a guild.": Object.freeze({ needs: Object.freeze(["market"]) }), // town|Government|Town crier#1
  "An innermost stronghold, the city's final hold under siege.": Object.freeze({ needs: Object.freeze(["tier: ≥ city"]) }), // town|Defense|Citadel#1
  "Message birds kept above a city yard by people who declare nothing. The word arrives unsigned and moves faster than the watch.": Object.freeze({ needs: Object.freeze(["watch","tier: ≥ city"]) }), // town|Criminal|Rookery#0
  "Bards, jugglers, and acrobats, come for the festivals.": Object.freeze({ needs: Object.freeze(["market"]) }), // town|Entertainment|Traveling performers#0
  "The festivals bring bards, jugglers, and acrobats through.": Object.freeze({ needs: Object.freeze(["market"]) }), // town|Entertainment|Traveling performers#1
  "Armourers, swordsmiths, and jewellers, each in its own guild.": Object.freeze({ needs: Object.freeze(["guild"]) }), // city|Crafts|Specialized metalworkers#0
  "Swordsmiths, armourers, jewellers. The trades kept to separate guilds.": Object.freeze({ needs: Object.freeze(["guild"]) }), // city|Crafts|Specialized metalworkers#1
  "Guild-organised carpenters, joiners, and furniture makers for building and fitting out.": Object.freeze({ needs: Object.freeze(["guild"]) }), // city|Crafts|Carpenters (5-15)#0
  "Builders' carpenters, joiners, and furniture makers, each trade organised under its guild.": Object.freeze({ needs: Object.freeze(["guild"]) }), // city|Crafts|Carpenters (5-15)#1
  "Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite bows to order, supplying the watch, the garrison, and the caravans.": Object.freeze({ needs: Object.freeze(["watch","garrison"]) }), // city|Crafts|Bowyers & fletchers (guild)#0
  "Arrows by the sheaf, specialty broadheads, and commissioned composite bows from the guild's bowyers and fletchers. The watch, the garrison, and the caravans buy here.": Object.freeze({ needs: Object.freeze(["watch","garrison"]) }), // city|Crafts|Bowyers & fletchers (guild)#1
  "Every ward has its bakehouses, with weights and prices set by the guild.": Object.freeze({ needs: Object.freeze(["guild"]) }), // city|Crafts|Bakers (5-15)#0
  "Bakehouses throughout the wards, the loaf's weight and price fixed by guild rule.": Object.freeze({ needs: Object.freeze(["guild"]) }), // city|Crafts|Bakers (5-15)#1
  "Several alchemical workshops, run under a guild.": Object.freeze({ needs: Object.freeze(["guild"]) }), // city|Crafts|Alchemist quarter#0
  "A cluster of alchemists' workshops, organised into a guild.": Object.freeze({ needs: Object.freeze(["guild"]) }), // city|Crafts|Alchemist quarter#1
  "The grounds inside the walls filled generations back, so the dead are lifted when their term is up and their bones stacked to make room. New ground lies outside the gates.": Object.freeze({ needs: Object.freeze(["walls","gate"]) }), // city|Religious|Burial grounds and charnel house#0
  "Carts go out at dusk to ground bought beyond the walls, and the charnel house holds what the old plots gave up. What a family endowed decides who is lifted and who is left.": Object.freeze({ needs: Object.freeze(["walls"]), excludes: Object.freeze(["crisis: under_siege"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "The official announcer, reading proclamations, market prices, and news in the market squares at set hours, paid by the city or a guild.": Object.freeze({ needs: Object.freeze(["market"]) }), // city|Government|Town crier#0
  "Employed by the city or a guild to call proclamations, prices, and news in the market squares at fixed times.": Object.freeze({ needs: Object.freeze(["market"]) }), // city|Government|Town crier#1
  "Excavated ways running under walls and wards alike; whole shipments pass below the city without touching a street.": Object.freeze({ needs: Object.freeze(["walls"]) }), // city|Criminal|Underground network#1
  "Burial has left the walls: grounds beyond every gate, each with its road and its gatekeepers, and a trade in plots the revenue office keeps an eye on.": Object.freeze({ needs: Object.freeze(["walls","gate"]) }), // metropolis|Religious|Cemetery network#0
  "Tall, crowded blocks and tenement courts, with suburbs spreading beyond the walls.": Object.freeze({ needs: Object.freeze(["walls"]) }), // metropolis|Infrastructure|Housing (3500+ households)#0
  "Multi-story blocks packed around tenement courts, and suburbs that have outgrown the walls.": Object.freeze({ needs: Object.freeze(["walls"]) }), // metropolis|Infrastructure|Housing (3500+ households)#1
  "Walls within walls: an outer line and an inner line, with gatehouses at every stage.": Object.freeze({ needs: Object.freeze(["garrison"]) }), // metropolis|Defense|Massive walls and fortifications#0
  "A defence built in layers, an outer wall and an inner wall, with gatehouses throughout.": Object.freeze({ needs: Object.freeze(["garrison"]) }), // metropolis|Defense|Massive walls and fortifications#1
  "Turns barley into malt for the brewers. A small concern feeding the local alehouses, and one that only runs when grain is in surplus.": Object.freeze({ needs: Object.freeze(["institution: tavern"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Turns malted grain into ale by the barrel. Only bread takes more of the grain. It supplies both alehouses and homes.": Object.freeze({ needs: Object.freeze(["institution: tavern"]) }), // W2-FIX-DATA-8 row 3 (ww-1415)
  "Makes ale in bulk from malted grain. The second-greatest draw on the grain supply after bread. Alehouses and households alike are stocked from here.": Object.freeze({ needs: Object.freeze(["institution: tavern"]) }), // W2-FIX-DATA-8 row 3 (ww-1415)
  "Malts barley for brewing on a modest scale, supplying the alehouses nearby. It needs grain to spare before it can work at all.": Object.freeze({ needs: Object.freeze(["institution: tavern"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Duties are taken here on goods passing through the port or the main roads. Royal or municipal officers run it.": Object.freeze({ needs: Object.freeze(["institution: docks"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Levies charged on all trade in and out by road or harbour, collected by officials of crown or town.": Object.freeze({ needs: Object.freeze(["institution: docks"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Takes pledges and lends at steep interest, no questions asked. It is the only credit for labourers, journeymen, and whoever the banks refuse.": Object.freeze({ needs: Object.freeze(["institution: bank"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "High-interest loans against pledged goods, with no questions. For labourers, journeymen, and anyone the banks will not serve, it is the only lender.": Object.freeze({ needs: Object.freeze(["institution: bank"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Shared grain stores that even out the harvests and hold off famine.": Object.freeze({ excludes: Object.freeze(["crisis: famine"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Sellsword companies under proper organisation, mustering hundreds to thousands.": Object.freeze({ needs: Object.freeze(["tier: = metropolis","mercenary"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Organised bands of hired blades. Major forces, hundreds to thousands strong.": Object.freeze({ needs: Object.freeze(["tier: = metropolis","mercenary"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "Covered stalls under the wardens' eye, selling the morning's catch or the week's salted barrels by weight whenever fish can be had, each checked for rot.": Object.freeze({ needs: Object.freeze(["navigable","market"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
  "The market wardens keep a roofed fish market where, whenever fish can be had, fresh catch and salted barrels are weighed out and inspected before sale.": Object.freeze({ needs: Object.freeze(["navigable","market"]) }), // W2-FIX-DATA (REVIEW-W2B cold list)
});

/**
 * THE LATE SIBLINGS (TAIL-HOUSES-5, the chair's ruling H20 of 2026-11-15; vetoable by the owner): a house's description
 * whose claim is true or false BY THE POWERS (who governs, what standing a power has) is drawn before the powers exist
 * (`birthFactsOf` holds no power structure), so it cannot be resolved at the draw. Each set here is keyed by the WHOLE
 * drawn description: the original, declaring what it needs of the settled record, and its twin (`twinOf` the original),
 * true where the original is refused. THE DRAW NEVER READS THIS TABLE (the text is drawn and resolved as before: no draw
 * moves); THE LATE RE-READ (`steps/assembleSettlement.js :: readHouseDescsLate`, after the last roster write) resolves a
 * stored description that is a key here against the settled record and stores the twin where the original is refused.
 * A text keyed here is not a colour line (`institutionDescColour.js`). VETOABLE wording (the owner's).
 *
 * @enforced-by tests/generators/houseDescLateReRead.test.js
 */
export const DESC_LATE_SIBLINGS = Object.freeze({
  // TAIL-HOUSES-5 batch 8 (H20 (ii)): the Household elder speaks for the settlement ALONE: true only under one elder ruler
  // (a headman), never under an Elder or a Household Council (37 of the census's 37 Household elders); the twin claims
  // the house's standing, not who governs. BAR3-PLACES-2 (C24313, 2026-11-15): the twin is the line under a council (37 of
  // the census's 37 Household elders stand beside a governing Elder or Household Council), so it claims no "no office, no
  // title, no vote" and no "no title" (false where the household head ranks first of the council that governs): it says
  // only whose door is knocked on first. The third twin claims habit only and stands.
  "One household head acts as de facto voice for the settlement. No formal appointment, no title. Just the person everyone goes to when something needs deciding.": Object.freeze([
    Object.freeze({ text: "One household head acts as de facto voice for the settlement. No formal appointment, no title. Just the person everyone goes to when something needs deciding.", needs: Object.freeze(['ruler: elder']), excludes: Object.freeze(['ruling body']) }),
    Object.freeze({ text: "One household head is the person everyone goes to first when something needs deciding.", twinOf: "One household head acts as de facto voice for the settlement. No formal appointment, no title. Just the person everyone goes to when something needs deciding." }),
  ]),
  "A single household head speaks for the settlement without ever being chosen to. No office, no title, no vote. Simply the door people knock on when a thing has to be settled.": Object.freeze([
    Object.freeze({ text: "A single household head speaks for the settlement without ever being chosen to. No office, no title, no vote. Simply the door people knock on when a thing has to be settled.", needs: Object.freeze(['ruler: elder']), excludes: Object.freeze(['ruling body']) }),
    Object.freeze({ text: "A single household head is the door people knock on first when a thing has to be settled.", twinOf: "A single household head speaks for the settlement without ever being chosen to. No office, no title, no vote. Simply the door people knock on when a thing has to be settled." }),
  ]),
  "One head of household carries the settlement's voice by common habit, with no appointment behind it. Nobody named them to it; everybody defers to it anyway.": Object.freeze([
    Object.freeze({ text: "One head of household carries the settlement's voice by common habit, with no appointment behind it. Nobody named them to it; everybody defers to it anyway.", needs: Object.freeze(['ruler: elder']), excludes: Object.freeze(['ruling body']) }),
    Object.freeze({ text: "One head of household is heard first on the settlement's common matters, out of habit and with no appointment. Nobody named them to it.", twinOf: "One head of household carries the settlement's voice by common habit, with no appointment behind it. Nobody named them to it; everybody defers to it anyway." }),
  ]),
  // TAIL-HOUSES-5 batch 8 (H20 (ii)): the Merchant oligarchy holds civic power ALONE ("solely", "monopolise", "exclusive"):
  // false where another power stands at Significant or above (`rival power`: 23 of the census's 37); the twin claims the
  // merchants' hold on the offices, true under their own government (37 of 37), not that no other power stands.
  "Wealthy merchant families hold exclusive civic power; political office is effectively purchased.": Object.freeze([
    Object.freeze({ text: "Wealthy merchant families hold exclusive civic power; political office is effectively purchased.", excludes: Object.freeze(['rival power']) }),
    Object.freeze({ text: "Wealthy merchant families hold the civic offices; political office is effectively purchased.", twinOf: "Wealthy merchant families hold exclusive civic power; political office is effectively purchased." }),
  ]),
  "Civic power belongs solely to the wealthy merchant families, and office is bought in all but name.": Object.freeze([
    Object.freeze({ text: "Civic power belongs solely to the wealthy merchant families, and office is bought in all but name.", excludes: Object.freeze(['rival power']) }),
    Object.freeze({ text: "Civic power rests with the wealthy merchant families, and office is bought in all but name.", twinOf: "Civic power belongs solely to the wealthy merchant families, and office is bought in all but name." }),
  ]),
  "A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases.": Object.freeze([
    Object.freeze({ text: "A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases.", excludes: Object.freeze(['rival power']) }),
    Object.freeze({ text: "A handful of rich merchant houses hold the seat of power here; a political post is, in practice, something one purchases.", twinOf: "A handful of rich merchant houses monopolise power here; a political post is, in practice, something one purchases." }),
  ]),
  // TAIL-HOUSES-5 batch 11 (the three rows left; READ-ALL B11971, B06555): the customs house's no-docks twins name "the main
  // roads" where the town is isolated (6 of 71, 1 of 36). A twin's own twin is not read at the draw (it takes the first
  // `twinOf` only), so the third text is resolved here, at the late re-read, on the route (draw-free; the route is final).
  "Levies duties on goods entering and leaving by the main roads. Run by royal or municipal officials.": Object.freeze([
    Object.freeze({ text: "Levies duties on goods entering and leaving by the main roads. Run by royal or municipal officials.", excludes: Object.freeze(['route: isolated']) }),
    Object.freeze({ text: "Levies duties on goods entering and leaving by road. Run by royal or municipal officials.", twinOf: "Levies duties on goods entering and leaving by the main roads. Run by royal or municipal officials." }),
  ]),
  "Duties are taken here on goods passing along the main roads. Royal or municipal officers run it.": Object.freeze([
    Object.freeze({ text: "Duties are taken here on goods passing along the main roads. Royal or municipal officers run it.", excludes: Object.freeze(['route: isolated']) }),
    Object.freeze({ text: "Duties are taken here on goods passing along the road. Royal or municipal officers run it.", twinOf: "Duties are taken here on goods passing along the main roads. Royal or municipal officers run it." }),
  ]),
  // BAR4-HOUSES (kind H1 (ii), REVIEW-BAR-4 C40862, 2026-11-16; vetoable by the owner): the commercial sawmill "supplies the
  // region's building work" from "timber to hand" only where the town works timber of its own (`timber at hand`: its Timber &
  // Lumber chain working its input, `facts/timberAtHand.js`); the chains are settled after the draw, so the late re-read
  // reads it. 11 of the 19 towns of the census's 720 that print the two lines have none (the woodland cleared or never there);
  // the twin claims the mill's own trade on whatever logs reach it, true wherever a sawmill stands.
  "A mill driven by water or ox, cutting planks and beams for builders. Sited near timber, it can meet a whole region's building needs. The crew is permanent.": Object.freeze([
    Object.freeze({ text: "A mill driven by water or ox, cutting planks and beams for builders. Sited near timber, it can meet a whole region's building needs. The crew is permanent.", needs: Object.freeze(['timber at hand']) }),
    Object.freeze({ text: "A saw driven by water or ox, cutting planks and beams for builders whenever logs can be had. The crew is permanent.", twinOf: "A mill driven by water or ox, cutting planks and beams for builders. Sited near timber, it can meet a whole region's building needs. The crew is permanent." }),
  ]),
  "Water or ox power turns logs into planks and beams for the construction trade. A town with timber to hand supplies the region's building work, and keeps a standing crew to do it.": Object.freeze([
    Object.freeze({ text: "Water or ox power turns logs into planks and beams for the construction trade. A town with timber to hand supplies the region's building work, and keeps a standing crew to do it.", needs: Object.freeze(['timber at hand']) }),
    Object.freeze({ text: "Water or ox power turns logs into planks and beams for the construction trade whenever logs can be had, and a standing crew works it.", twinOf: "Water or ox power turns logs into planks and beams for the construction trade. A town with timber to hand supplies the region's building work, and keeps a standing crew to do it." }),
  ]),
  // BAR4-HOUSES (kind H1 (iii), REVIEW-BAR-4 C39560, 2026-11-16; vetoable by the owner): the town council that "answers to no
  // one in particular" is false under an occupation, where the page says the town's own officials take the occupiers' orders
  // (the crisis home's `occupied`, or an occupier ruling: settled after the draw, read late). The twin says the occupation. (The
  // city-state's "no higher lord" lines are not keyed: no occupied town of the 1,050 measured holds a City-state government.)
  "A loose council of leading citizens sees to the town's common business. It answers to no one in particular, but the work gets done.": Object.freeze([
    Object.freeze({ text: "A loose council of leading citizens sees to the town's common business. It answers to no one in particular, but the work gets done.", excludes: Object.freeze(['crisis: occupied', 'ruler: occupier']) }),
    Object.freeze({ text: "A loose council of leading citizens sees to the town's common business. It takes its orders from the occupiers now, but the work gets done.", twinOf: "A loose council of leading citizens sees to the town's common business. It answers to no one in particular, but the work gets done.", crisis: Object.freeze(['occupied']) }),
  ]),
  // BAR5-MARKS (2026-11-16): A CRISIS'S TWINS, READ LATE. A siege or a famine drawn at random is settled after the description
  // draw (r2r-metropolis-14: the bowyers' caravans printed beside the siege), so these sets are resolved here, against the
  // settled record, by the late re-read (no draw moves; the twin is stored where the crisis refuses the original).
  // BAR5-MARKS (LAW 2's `L2.siege.abroad`, 2026-11-16; vetoable by the owner): the bowyers' lines that sell to the caravans.
  // The house is not stopped or curtailed by a siege (the watch and the garrison buy more: the chair's S8), so each line
  // that names the caravans declares the siege it is false in, and its twin, in the same voice, says where the arrows go.
  "Multiple craftsmen organized under a guild. Standard arrows by the sheaf, specialty broadheads, composite bows to commission. Restocks merchant caravans and outfits their guards.": Object.freeze([
    Object.freeze({ text: "Multiple craftsmen organized under a guild. Standard arrows by the sheaf, specialty broadheads, composite bows to commission. Restocks merchant caravans and outfits their guards.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "Multiple craftsmen organized under a guild. Standard arrows by the sheaf, specialty broadheads, composite bows to commission. While the siege holds the roads no caravan comes, and the arrows go to the town's defence.", twinOf: "Multiple craftsmen organized under a guild. Standard arrows by the sheaf, specialty broadheads, composite bows to commission. Restocks merchant caravans and outfits their guards.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "Several craftsmen banded into a guild. Standard arrows by the sheaf, specialty broadheads, and composite bows made to order. They restock the merchant caravans and arm their guards.": Object.freeze([
    Object.freeze({ text: "Several craftsmen banded into a guild. Standard arrows by the sheaf, specialty broadheads, and composite bows made to order. They restock the merchant caravans and arm their guards.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "Several craftsmen banded into a guild. Standard arrows by the sheaf, specialty broadheads, and composite bows made to order. With the roads held there are no caravans to restock, and the arrows go to the town's defence.", twinOf: "Several craftsmen banded into a guild. Standard arrows by the sheaf, specialty broadheads, and composite bows made to order. They restock the merchant caravans and arm their guards.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "A guild of bowyers and fletchers. Arrows come by the sheaf, broadheads to specialty, and composite bows on commission. Enough to resupply the caravans and outfit their guards.": Object.freeze([
    Object.freeze({ text: "A guild of bowyers and fletchers. Arrows come by the sheaf, broadheads to specialty, and composite bows on commission. Enough to resupply the caravans and outfit their guards.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "A guild of bowyers and fletchers. Arrows come by the sheaf, broadheads to specialty, and composite bows on commission. No caravan comes while the siege lasts, and every sheaf goes to the town's defence.", twinOf: "A guild of bowyers and fletchers. Arrows come by the sheaf, broadheads to specialty, and composite bows on commission. Enough to resupply the caravans and outfit their guards.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "Guild bowyers and fletchers: standard arrows by the sheaf, specialty broadheads, composite bows to commission. Supplies the watch, the garrison, and the caravans.": Object.freeze([
    Object.freeze({ text: "Guild bowyers and fletchers: standard arrows by the sheaf, specialty broadheads, composite bows to commission. Supplies the watch, the garrison, and the caravans.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "Guild bowyers and fletchers: standard arrows by the sheaf, specialty broadheads, composite bows to commission. While the siege lasts it supplies the town's defenders, and no caravan.", twinOf: "Guild bowyers and fletchers: standard arrows by the sheaf, specialty broadheads, composite bows to commission. Supplies the watch, the garrison, and the caravans.", needs: Object.freeze(["guardPresence"]), crisis: Object.freeze(["under_siege"]) }),
  ]),
  "Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite bows to order, supplying the watch, the garrison, and the caravans.": Object.freeze([
    Object.freeze({ text: "Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite bows to order, supplying the watch, the garrison, and the caravans.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite bows to order. With the roads cut, all of it goes to the town's defence.", twinOf: "Guild bowyers and fletchers selling arrows by the sheaf, special broadheads, and composite bows to order, supplying the watch, the garrison, and the caravans.", crisis: Object.freeze(["under_siege"]) }),
  ]),
  "Arrows by the sheaf, specialty broadheads, and commissioned composite bows from the guild's bowyers and fletchers. The watch, the garrison, and the caravans buy here.": Object.freeze([
    Object.freeze({ text: "Arrows by the sheaf, specialty broadheads, and commissioned composite bows from the guild's bowyers and fletchers. The watch, the garrison, and the caravans buy here.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "Arrows by the sheaf, specialty broadheads, and commissioned composite bows from the guild's bowyers and fletchers. With the caravans cut off by the siege, the town's defenders buy all of it.", twinOf: "Arrows by the sheaf, specialty broadheads, and commissioned composite bows from the guild's bowyers and fletchers. The watch, the garrison, and the caravans buy here.", needs: Object.freeze(["guardPresence"]), crisis: Object.freeze(["under_siege"]) }),
  ]),
  // BAR5-MARKS (LAW 5, 2026-11-16; vetoable by the owner): the free company's caravan escort and the great cathedral's pilgrims,
  // false under a siege that closes the roads; neither house is stopped (the garrison work and the rites go on: the chair's
  // S8 for the cathedral), so each line declares the siege and its twin says what goes on.
  // LAST-DECLARE (2026-11-18; vetoable by the owner): each line also declares the thing it names, so the presumed-things
  // walker reads it without a register row: the company's soldiers `mercenary` (the house is the free company, whose roster
  // name answers the atom), the cathedral's `church` and its metropolitan size `population: ≥ middling`; the bowyers' twins
  // above, their defenders `guardPresence`. Each holds wherever its line prints (the 900, the 525, 700 besieged births), so no
  // line moves.
  "A billet and contracting office for a band of professional soldiers available between campaigns. Offers caravan escort, garrison contracts, and short-term military hire at day-wage rates. Cheaper than a standing army, more reliable than a mob. These men fight in formation on salary, not for treasure.": Object.freeze([
    Object.freeze({ text: "A billet and contracting office for a band of professional soldiers available between campaigns. Offers caravan escort, garrison contracts, and short-term military hire at day-wage rates. Cheaper than a standing army, more reliable than a mob. These men fight in formation on salary, not for treasure.", needs: Object.freeze(["mercenary"]), excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "A billet and contracting office for a band of professional soldiers available between campaigns. With the roads held there is no caravan to escort, and garrison contracts and short-term military hire go at day-wage rates. Cheaper than a standing army, more reliable than a mob. These men fight in formation on salary, not for treasure.", twinOf: "A billet and contracting office for a band of professional soldiers available between campaigns. Offers caravan escort, garrison contracts, and short-term military hire at day-wage rates. Cheaper than a standing army, more reliable than a mob. These men fight in formation on salary, not for treasure.", needs: Object.freeze(["mercenary"]), crisis: Object.freeze(["under_siege"]) }),
  ]),
  "A billet and hiring office for professional soldiers idle between campaigns. Caravan escort, garrison work, and short-term hire go at day-wages here. Cheaper than a standing army and steadier than a mob. These are salaried men who fight in formation, not for plunder.": Object.freeze([
    Object.freeze({ text: "A billet and hiring office for professional soldiers idle between campaigns. Caravan escort, garrison work, and short-term hire go at day-wages here. Cheaper than a standing army and steadier than a mob. These are salaried men who fight in formation, not for plunder.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "A billet and hiring office for professional soldiers idle between campaigns. No caravan leaves while the siege holds the roads, so garrison work and short-term hire go at day-wages here. Cheaper than a standing army and steadier than a mob. These are salaried men who fight in formation, not for plunder.", twinOf: "A billet and hiring office for professional soldiers idle between campaigns. Caravan escort, garrison work, and short-term hire go at day-wages here. Cheaper than a standing army and steadier than a mob. These are salaried men who fight in formation, not for plunder.", needs: Object.freeze(["mercenary"]), crisis: Object.freeze(["under_siege"]) }),
  ]),
  "Where a band of soldiers lodges and takes contracts between wars. They hire out by the day for escort, garrison duty, and brief campaigns: less costly than keeping an army, more dependable than a rabble. They form up for a wage, not for treasure.": Object.freeze([
    Object.freeze({ text: "Where a band of soldiers lodges and takes contracts between wars. They hire out by the day for escort, garrison duty, and brief campaigns: less costly than keeping an army, more dependable than a rabble. They form up for a wage, not for treasure.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "Where a band of soldiers lodges and takes contracts between wars. While the siege holds the roads they hire out by the day for garrison duty and the town's defence: less costly than keeping an army, more dependable than a rabble. They form up for a wage, not for treasure.", twinOf: "Where a band of soldiers lodges and takes contracts between wars. They hire out by the day for escort, garrison duty, and brief campaigns: less costly than keeping an army, more dependable than a rabble. They form up for a wage, not for treasure.", needs: Object.freeze(["mercenary"]), crisis: Object.freeze(["under_siege"]) }),
  ]),
  "Metropolitan cathedral. Seat of the highest regional religious authority. Pilgrimage destination.": Object.freeze([
    Object.freeze({ text: "Metropolitan cathedral. Seat of the highest regional religious authority. Pilgrimage destination.", needs: Object.freeze(["population: ≥ middling"]), excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "Metropolitan cathedral. Seat of the highest regional religious authority. Its pilgrims cannot reach it while the siege holds.", twinOf: "Metropolitan cathedral. Seat of the highest regional religious authority. Pilgrimage destination.", needs: Object.freeze(["church","population: ≥ middling"]), crisis: Object.freeze(["under_siege"]) }),
  ]),
  "The metropolitan cathedral, seat of the region's highest prelate and a draw for pilgrims.": Object.freeze([
    Object.freeze({ text: "The metropolitan cathedral, seat of the region's highest prelate and a draw for pilgrims.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "The metropolitan cathedral, seat of the region's highest prelate. No pilgrim reaches it while the siege holds the roads.", twinOf: "The metropolitan cathedral, seat of the region's highest prelate and a draw for pilgrims.", needs: Object.freeze(["church","population: ≥ middling"]), crisis: Object.freeze(["under_siege"]) }),
  ]),
  "The great church of the metropolis. The region's chief religious authority sits here, and the faithful travel to it.": Object.freeze([
    Object.freeze({ text: "The great church of the metropolis. The region's chief religious authority sits here, and the faithful travel to it.", excludes: Object.freeze(["crisis: under_siege"]) }),
    Object.freeze({ text: "The great church of the metropolis. The region's chief religious authority sits here, and the faithful of the city fill it while the siege keeps the rest away.", twinOf: "The great church of the metropolis. The region's chief religious authority sits here, and the faithful travel to it.", needs: Object.freeze(["church"]), crisis: Object.freeze(["under_siege"]) }),
  ]),
  // BAR5-MARKS (LAW 2's `L2.famine.work`, 2026-11-16; vetoable by the owner): the cobbler's three lines of a trade that
  // never wants for work, false where the page says no one earns a normal living while the famine lasts. Each declares
  // the famine; its twin says the shoes still wear out and few can pay.
  "Makes and repairs shoes and boots. Every person needs footwear. One of the most reliable and consistent trades.": Object.freeze([
    Object.freeze({ text: "Makes and repairs shoes and boots. Every person needs footwear. One of the most reliable and consistent trades.", excludes: Object.freeze(["crisis: famine"]) }),
    Object.freeze({ text: "Makes and repairs shoes and boots. Every person needs footwear, though in the famine few can pay for it.", twinOf: "Makes and repairs shoes and boots. Every person needs footwear. One of the most reliable and consistent trades.", crisis: Object.freeze(["famine"]) }),
  ]),
  "Makes and mends shoes and boots. Everyone needs something on their feet, which keeps this among the steadiest trades going.": Object.freeze([
    Object.freeze({ text: "Makes and mends shoes and boots. Everyone needs something on their feet, which keeps this among the steadiest trades going.", excludes: Object.freeze(["crisis: famine"]) }),
    Object.freeze({ text: "Makes and mends shoes and boots. Everyone needs something on their feet, but in the famine the mending waits while every coin goes on food.", twinOf: "Makes and mends shoes and boots. Everyone needs something on their feet, which keeps this among the steadiest trades going.", crisis: Object.freeze(["famine"]) }),
  ]),
  "Cuts and repairs footwear of every kind. Since no one goes unshod, the work never dries up.": Object.freeze([
    Object.freeze({ text: "Cuts and repairs footwear of every kind. Since no one goes unshod, the work never dries up.", excludes: Object.freeze(["crisis: famine"]) }),
    Object.freeze({ text: "Cuts and repairs footwear of every kind. Shoes still wear out in the famine, though few can pay to have them mended.", twinOf: "Cuts and repairs footwear of every kind. Since no one goes unshod, the work never dries up.", crisis: Object.freeze(["famine"]) }),
  ]),
  // BAR6-HOUSES (THE CHAIR'S RULING SV1, 2026-11-16; vetoable by the owner): A SOVEREIGN NAMED, READ LATE. A house's line that names
  // a crown or a lord its own house does not give presumes the town has one (`facts/sovereign.js`: the government, a power, a
  // house, a person or the founding names one, or a war or an occupation supplies it). The powers, the cast and the history are
  // born after the description draw, so the set is resolved here, by the late re-read; the twin names no sovereign.
  'A weekly sale of local goods. A charter from crown or lord is required.': Object.freeze([
    Object.freeze({ text: 'A weekly sale of local goods. A charter from crown or lord is required.', needs: Object.freeze(['sovereign']) }),
    Object.freeze({ text: 'A weekly sale of local goods, held under a charter.', twinOf: 'A weekly sale of local goods. A charter from crown or lord is required.', excludes: Object.freeze(['sovereign']) }),
  ]),
  "Speaking Stones, paired and linked into a network, each station priced like a merchant's house and held only by the crown or the great guilds.": Object.freeze([
    Object.freeze({ text: "Speaking Stones, paired and linked into a network, each station priced like a merchant's house and held only by the crown or the great guilds.", needs: Object.freeze(['sovereign']) }),
    Object.freeze({ text: "Speaking Stones, paired and linked into a network, each station priced like a merchant's house and held only by the richest powers.", twinOf: "Speaking Stones, paired and linked into a network, each station priced like a merchant's house and held only by the crown or the great guilds.", excludes: Object.freeze(['sovereign']) }),
  ]),
  // BAR6-HOUSES (LAW 5 WIDENED, 2026-11-16; the wide read's C16139, bar0-city-under_siege+famine-rand-33; vetoable by the owner): the
  // brewery's catalogue lines send its ale out to "regional distribution", which nothing reaches while a siege holds the roads (an
  // occupation and a monster frontier close no road, so the siege alone is declared). Read late, as the crisis twins above: a siege
  // drawn at random is settled after the description draw. The brewery's grain mark is the mark leaf's (BAR6-MARKS).
  // SEAM-DESKS (2026-11-17, SEAM-LIST's HOUSES item; vetoable by the owner): each line that names the taverns declares a
  // tavern (`institution: tavern`, the maltster's form above). No third twin: the late re-read tries a refused original's
  // first twin only, so a brewery of these lines with no tavern (none: 15 of the 150 and 90 of the 720 print them, every one
  // beside a tavern) keeps its original, noted for the birth check.
  "Commercial-scale ale and beer production supplying taverns and regional distribution. Major grain consumer and employer.": Object.freeze([
    Object.freeze({ text: "Commercial-scale ale and beer production supplying taverns and regional distribution. Major grain consumer and employer.", needs: Object.freeze(['institution: tavern']), excludes: Object.freeze(['crisis: under_siege']) }),
    Object.freeze({ text: "Commercial-scale ale and beer production for the taverns; while the siege holds the roads none of it goes further. Major grain consumer and employer.", twinOf: "Commercial-scale ale and beer production supplying taverns and regional distribution. Major grain consumer and employer.", needs: Object.freeze(['institution: tavern']), crisis: Object.freeze(['under_siege']) }),
  ]),
  "Commercial-scale ale and beer production. Supplies the town's taverns and regional distribution. Major grain consumer and employer.": Object.freeze([
    Object.freeze({ text: "Commercial-scale ale and beer production. Supplies the town's taverns and regional distribution. Major grain consumer and employer.", needs: Object.freeze(['institution: tavern']), excludes: Object.freeze(['crisis: under_siege']) }),
    Object.freeze({ text: "Commercial-scale ale and beer production. Supplies the town's taverns; while the siege holds the roads none of it goes further. Major grain consumer and employer.", twinOf: "Commercial-scale ale and beer production. Supplies the town's taverns and regional distribution. Major grain consumer and employer.", needs: Object.freeze(['institution: tavern']), crisis: Object.freeze(['under_siege']) }),
  ]),
  // FAULTS-ROWS (the sixth chair's BRIEF-FAULTS ruling FR3, 2026-11-18; vetoable by the owner): THE FAIR'S LUXURIES. The Annual
  // fair's two lines offer luxuries the town's own need list says are not brought in ("Needed, and not brought in: luxury goods.",
  // bar0-town-calm-rand-45, C32296; r2r-town-10, -56, -57). The need list is the resource analysis's, settled after the
  // description draw, so each line is read here, late, on `need not brought in: luxury` (`facts/needNotBroughtIn.js`), and its
  // twin, in its siege twin's form, says the fair is held and names no luxury as to be had. THE ORDER OF THE TWO DECLARATIONS:
  // the siege is the draw's (`DESC_VARIANT_SIBLINGS` above): a town under siege at the draw stores the siege twin, which is no key
  // here, so the late re-read never reaches it (r2s-under_siege-town-2: the siege twin beside "Needed, and not brought in: Quality
  // textiles."); each late member declares the siege off too, so a siege settled after the draw keeps the original as before,
  // noted for the birth check, and never takes this twin's "held". No draw moves.
  "Regional merchants. Luxury goods available.": Object.freeze([
    Object.freeze({ text: "Regional merchants. Luxury goods available.", excludes: Object.freeze(['crisis: under_siege', 'need not brought in: luxury']) }),
    Object.freeze({ text: "A yearly fair for regional merchants. The luxuries the town wants do not reach it.", twinOf: "Regional merchants. Luxury goods available.", needs: Object.freeze(['need not brought in: luxury']), excludes: Object.freeze(['crisis: under_siege']) }),
  ]),
  "Merchants from across the region, and luxuries to be had.": Object.freeze([
    Object.freeze({ text: "Merchants from across the region, and luxuries to be had.", excludes: Object.freeze(['crisis: under_siege', 'need not brought in: luxury']) }),
    Object.freeze({ text: "A yearly gathering of the region's merchants, though the luxuries the town wants do not come with them.", twinOf: "Merchants from across the region, and luxuries to be had.", needs: Object.freeze(['need not brought in: luxury']), excludes: Object.freeze(['crisis: under_siege']) }),
  ]),
  // FAULTS-ROWS (the sixth chair's ruling FR12 (1), 2026-11-18; vetoable by the owner): the fair's third line, its "fine goods on
  // offer" beside "Needed, and not brought in: luxury goods." (bar0-town-calm-rand-46, bar0-town-occupied-rand-46, -47). The
  // same form as the two above: read late on the atom, the siege off on both members, ONE TWIN.
  "A yearly draw for regional traders, with fine goods on offer.": Object.freeze([
    Object.freeze({ text: "A yearly draw for regional traders, with fine goods on offer.", excludes: Object.freeze(['crisis: under_siege', 'need not brought in: luxury']) }),
    Object.freeze({ text: "A yearly draw for regional traders, though the fine goods the town wants do not reach it.", twinOf: "A yearly draw for regional traders, with fine goods on offer.", needs: Object.freeze(['need not brought in: luxury']), excludes: Object.freeze(['crisis: under_siege']) }),
  ]),
  // FAULTS-ROWS (the sixth chair's rulings FR3 and FR12 (2), 2026-11-18; vetoable by the owner): THE LUXURY QUARTER'S TWO LINES
  // trade in the silk and the spice the town's own need list says are not brought in ("Needed, and not brought in: spices.",
  // r2r-city-29, r2r-city-17). Each was marked a colour line (`institutionDescColour.js`: struck, in CL18's form). Read late on
  // `need not brought in: spice` and `: silk`; the draw declares no siege, so none is declared here. ONE TWIN each, naming no
  // good as to be had. A town whose only unmet good is another (copper ore, gold/silver ore: the mint's want) keeps its line.
  "Silks, spices, and other precious goods.": Object.freeze([
    Object.freeze({ text: "Silks, spices, and other precious goods.", excludes: Object.freeze(['need not brought in: spice', 'need not brought in: silk']) }),
    Object.freeze({ text: "Fine goods of every kind, though the spice or silk the town wants never arrives.", twinOf: "Silks, spices, and other precious goods." }),
  ]),
  "The trade in silk, spice, and precious things.": Object.freeze([
    Object.freeze({ text: "The trade in silk, spice, and precious things.", excludes: Object.freeze(['need not brought in: spice', 'need not brought in: silk']) }),
    Object.freeze({ text: "Fine things are traded here, though the spice or silk the town wants does not reach it.", twinOf: "The trade in silk, spice, and precious things." }),
  ]),
  // FAULTS-ROWS (the sixth chair's rulings FR4 and FR12 (3), 2026-11-18; vetoable by the owner): THE FISH MARKET'S CARD follows
  // its row. Where the fish is bought in (`fish bought in`, `facts/fishBoughtIn.js`: the one fact BAR8-FISH-ROWS's swap reads to
  // give the market its "Preserved fish"), "the day's catch" is false (bar0-village-calm-rand-47); the imports are written after
  // the draw, so the card is read here. ONE TWIN: salted and dried fish, no catch of the day. An idle town (nothing brought in)
  // and a live fishery keep the line; its draw declaration (`navigable`, DESC_VARIANT_DECLARATIONS) stands as it was.
  "Where the day's catch is sold, from an open stall or a small covered market. Prices sink fast. Fish will not wait.": Object.freeze([
    Object.freeze({ text: "Where the day's catch is sold, from an open stall or a small covered market. Prices sink fast. Fish will not wait.", excludes: Object.freeze(['fish bought in']) }),
    Object.freeze({ text: "Salted and dried fish is sold here, from an open stall or under a small roof. No fresh catch comes in.", twinOf: "Where the day's catch is sold, from an open stall or a small covered market. Prices sink fast. Fish will not wait.", needs: Object.freeze(['fish bought in']) }),
  ]),
  // FAULTS-ROWS (the chair's ruling FR20 (2), 2026-11-18; vetoable by the owner; the twins' words are the chair's): the card's two
  // siblings of the village Fish market's draw pool, the catalogue line (`institutionalCatalog.js`) and the pool's #0, in the same
  // form (r2r-village-11: the catalogue line beside "Preserved fish").
  "An open-air stall or small covered market where the day's catch is sold. Prices drop fast. Fish doesn't wait.": Object.freeze([
    Object.freeze({ text: "An open-air stall or small covered market where the day's catch is sold. Prices drop fast. Fish doesn't wait.", excludes: Object.freeze(['fish bought in']) }),
    Object.freeze({ text: "An open-air stall or small covered market where salted and dried fish is sold. No fresh catch is landed here.", twinOf: "An open-air stall or small covered market where the day's catch is sold. Prices drop fast. Fish doesn't wait.", needs: Object.freeze(['fish bought in']) }),
  ]),
  "An open stall or small roofed market for selling the day's catch. The price falls quickly, for fish keeps no better than a day.": Object.freeze([
    Object.freeze({ text: "An open stall or small roofed market for selling the day's catch. The price falls quickly, for fish keeps no better than a day.", excludes: Object.freeze(['fish bought in']) }),
    Object.freeze({ text: "An open stall or small roofed market for salted and dried fish, brought in from elsewhere. The catch is no longer landed here.", twinOf: "An open stall or small roofed market for selling the day's catch. The price falls quickly, for fish keeps no better than a day.", needs: Object.freeze(['fish bought in']) }),
  ]),
});
