# Duplicate-key removal record

Earlier-occurrence definitions removed by `scripts/fix-duplicate-keys.js`.
These had been silently overridden by a later occurrence of the same key (JS object-literal semantics) so the runtime engine was already using the later value. Removing the earlier definition preserves runtime behavior exactly. Recovery: copy any snippet below back into the source file and rename the key if you intended a separate entry.

## src/data/economicData.js
### "Major port" (was at L491, kept later occurrence at L905)
```js
"Major port": {
        resources: [
          "shipbuilding_timber",
          "managed_forest"
        ],
        label: "Timber",
        detail: "timber for port maintenance and shipbuilding",
        svcs: [
          "large vessel berthing",
          "cargo handling",
          "ship repair",
          "shipbuilding"
        ]
      }
```

## src/data/institutionServices.js
### "Adventurers' Charter Hall" (was at L291, kept later occurrence at L415)
```js
"Adventurers' Charter Hall": {
    "Official charters": { on: true, p: 1.0, desc: "Legal authority to clear ruins, claim treasure" },
    "Emergency rescue": { on: true, p: 0.8, desc: "Retrieve lost parties, extract from dungeons" },
    "Monster bounties": { on: true, p: 1.0, desc: "Formal reward system for verified kills" }
  }
```

### "Customs house" (was at L659, kept later occurrence at L792)
```js
"Customs house": {
    "Customs clearance": { on: true, p: 1.0, desc: "Register goods. Pay duty. Collect certificate." },
    "Import/export permits": { on: true, p: 0.9, desc: "Licensed trade in controlled goods." },
    "Contraband search": { on: false, p: 0.5, desc: "Thorough inspection — or avoided, for a fee." }
  }
```

### "Assay office" (was at L654, kept later occurrence at L799)
```js
"Assay office": {
    "Metal purity testing": { on: true, p: 1.0, desc: "Acid and fire assay. Certificate issued." },
    "Gem appraisal": { on: true, p: 0.8, desc: "Weight, clarity, and cut assessment." },
    "Certification": { on: false, p: 0.6, desc: "Official stamp on tested metal." }
  }
```

### "Docks/port facilities" (was at L166, kept later occurrence at L842)
```js
"Docks/port facilities": {
    "Cargo handling": { on: true, p: 1.0, desc: "Load, unload, store goods" },
    "Vessel hire": { on: true, p: 0.9, desc: "Boats, barges, coastal vessels for charter" },
    "Maritime insurance": { on: false, p: 0.5, desc: "Underwrite cargo risk" },
    "Ship repair": { on: true, p: 0.8, desc: "Hull work, rigging, caulking" },
    "Pilotage": { on: true, p: 0.7, desc: "Local knowledge for navigating harbour or river" }
  }
```

### "Stable district" (was at L669, kept later occurrence at L861)
```js
"Stable district": {
    "Horse purchase": { on: true, p: 1.0, desc: "Wide selection — riding, war, cart, palfreys." },
    "Mount hire (daily)": { on: true, p: 0.9, desc: "Ride out in the morning, return by evening." },
    "Cavalry training": { on: false, p: 0.5, desc: "Military horsemanship for soldiers and nobles." },
    "Stabling (long-term)": { on: true, p: 0.8, desc: "Monthly stable, feed, and groom." }
  }
```

### "Post relay station" (was at L664, kept later occurrence at L868)
```js
"Post relay station": {
    "Message relay": { on: true, p: 1.0, desc: "Letters relayed between stations at horse-speed." },
    "Post horse hire": { on: true, p: 0.9, desc: "Fresh horse at each station." },
    "Secure dispatch": { on: false, p: 0.5, desc: "Sealed and bonded courier. Signed receipt at destination." }
  }
```

### "Caravaneer's post" — casing collision with "Caravaneer's Post" (kept earlier "Caravaneer's Post" at L675; this entry was unreachable via case-insensitive lookup)
```js
"Caravaneer's post": {
    "Caravan assembly": { on: true, p: 1.0, desc: "Organize merchants with compatible routes into shared caravans for safety and economy." },
    "Guide hire": { on: true, p: 0.9, desc: "Experienced pathfinders who know the roads, watering holes, and danger spots." },
    "Guard hire": { on: false, p: 0.7, desc: "Armed escorts for vulnerable goods. Rate varies with threat level and cargo value." }
  }
```

### "Smelter" (was at L599, kept later occurrence at L885)
```js
"Smelter": {
    "Refined iron ingots": { on: true, p: 1.0, desc: "Smelted iron ready for the smith. Priced by the pound." },
    "Cast iron goods": { on: true, p: 0.7, desc: "Pots, hinges, brackets — direct-cast items." },
    "Pig iron": { on: false, p: 0.5, desc: "Crude smelted iron for further processing." },
    "Smelting contract": { on: false, p: 0.4, desc: "Bring your ore, we smelt it." }
  }
```

### "Mine (open cast)" (was at L462, kept later occurrence at L891)
```js
"Mine (open cast)": {
    "Iron ore": { on: true, p: 1.0, desc: "Raw ore from surface excavation. Needs smelting." },
    "Quarried stone": { on: true, p: 0.7, desc: "Rough-cut building stone." },
    "Coal": { on: true, p: 0.6, desc: "Raw coal for fuel." },
    "Mining labour hire": { on: false, p: 0.5, desc: "Recruit experienced miners for a dig." }
  }
```

### "Salt works" (was at L490, kept later occurrence at L896)
```js
"Salt works": {
    "Sea salt": { on: true, p: 1.0, desc: "Evaporated salt from coastal pans." },
    "Salt for preservation": { on: true, p: 0.9, desc: "Coarser salt for curing meat and fish." },
    "Salt (bulk trade)": { on: false, p: 0.5, desc: "Large-volume salt for merchants." }
  }
```

### "Stone quarry" (was at L468, kept later occurrence at L901)
```js
"Stone quarry": {
    "Quarried stone": { on: true, p: 1.0, desc: "Cut stone blocks for construction." },
    "Dressed stone": { on: true, p: 0.7, desc: "Finished stone for walls and floors." },
    "Gravel and rubble": { on: false, p: 0.6, desc: "Road fill and foundation material." }
  }
```

### "Fisher's landing" — casing collision with "Fisher's Landing" (kept earlier "Fisher's Landing" at L433; this entry was unreachable via case-insensitive lookup)
```js
"Fisher's landing": {
    "Fresh fish": { on: true,  p: 1.0, desc: "Daily catch sold dockside. Price and selection vary by season and weather." },
    "Dried and salted fish": { on: true,  p: 0.8, desc: "Preserved catch for inland trade and winter stores." },
    "Fishing equipment": { on: false, p: 0.4, desc: "Nets, lines, traps, and boat maintenance supplies." }
  }
```

### "Sawmill" (was at L500, kept later occurrence at L913)
```js
"Sawmill": {
    "Milled timber": { on: true, p: 1.0, desc: "Planks and beams to dimension." },
    "Sawing timber (custom)": { on: false, p: 0.7, desc: "Bring your own logs. Mill cuts to spec." },
    "Sawdust and offcuts": { on: false, p: 0.5, desc: "Cheap fuel and animal bedding." }
  }
```

### "Merchant warehouses" (was at L188, kept later occurrence at L918)
```js
"Merchant warehouses": {
    "Goods storage": { on: true, p: 1.0, desc: "Secure warehousing for merchants" },
    "Cold storage": { on: false, p: 0.4, desc: "Ice cellars for perishables" },
    "Bonded storage": { on: true, p: 0.7, desc: "Customs-controlled goods pending duty" }
  }
```

### "Brewery" (was at L605, kept later occurrence at L923)
```js
"Brewery": {
    "Ale (barrel)": { on: true, p: 1.0, desc: "Commercial ale in standard barrel." },
    "Beer (barrel)": { on: true, p: 0.8, desc: "Hopped beer — cleaner, better preserved than ale." },
    "Ale (wholesale)": { on: true, p: 0.7, desc: "Volume pricing for innkeepers and merchants." },
    "Malt (surplus)": { on: false, p: 0.4, desc: "Excess malt sold when brewing ahead of schedule." }
  }
```

### "Adventurers' charter hall" — casing collision with "Adventurers' Charter Hall" (kept earlier "Adventurers' Charter Hall" at L291; this entry was unreachable via case-insensitive lookup)
```js
"Adventurers' charter hall": {
    "Quest board": { on: true,  p: 1.0, desc: "Posted bounties, missing persons, monster extermination contracts, and exploration commissions." },
    "Contract registration": { on: true, p: 0.9, desc: "Legally binding adventuring contracts. Protects client and party." },
    "Party licensing": { on: false, p: 0.7, desc: "Register a party for liability purposes. Required before some contracts." },
    "Bounty claims": { on: false, p: 0.7, desc: "Submit proof of completion and collect bounty payment." },
    "Equipment storage": { on: false, p: 0.4, desc: "Secure storage for large or hazardous adventuring gear between contracts." }
  }
```

### "Banking district" (was at L269, kept later occurrence at L1005)
```js
"Banking district": {
    "International finance": { on: true, p: 1.0, desc: "Letters of credit across kingdoms" },
    "Investment banking": { on: true, p: 0.8, desc: "Underwrite ventures, take equity" },
    "Currency speculation": { on: false, p: 0.5, desc: "Exchange rates, arbitrage" },
    "Institutional lending": { on: true, p: 0.9, desc: "Large loans to guilds, noble houses, cities" }
  }
```

### "Bardic college" (was at L200, kept later occurrence at L1018)
```js
"Bardic college": {
    "Musical education": { on: true, p: 1.0, desc: "Instrument training, voice, composition" },
    "Magical entertainment": { on: true, p: 0.8, desc: "Bardic spellcasting woven into performance" },
    "Historical research": { on: true, p: 0.7, desc: "Lore collection, ballads as historical record" },
    "Diplomatic services": { on: false, p: 0.4, desc: "Skilled negotiators, silver-tongued envoys" }
  }
```

### "Black market" (was at L239, kept later occurrence at L1037)
```js
"Black market": {
    "Contraband goods": { on: false, p: 1.0, desc: "Banned items, untaxed goods, smuggled luxuries" },
    "Forged documents": { on: false, p: 0.7, desc: "Letters of passage, guild membership, titles" },
    "Illegal services": { on: false, p: 0.6, desc: "Hired violence, forbidden magic, poison" }
  }
```

### "Charcoal burner" (was at L445, kept later occurrence at L1109)
```js
"Charcoal burner": {
    "Charcoal": { on: true, p: 1.0, desc: "Kiln-fired charcoal for smithing and smelting." },
    "Firewood (seasoned)": { on: true, p: 0.8, desc: "Pre-cut and dried firewood." }
  }
```

### "Citizen militia" (was at L404, kept later occurrence at L1113)
```js
"Citizen militia": {
    "Emergency muster": { on: true, p: 1.0, desc: "In crisis, all able-bodied residents bear arms. No cost — but no reliability either." },
    "Watch rotation": { on: true, p: 0.6, desc: "Rotating gate and patrol duty. Provides basic deterrence." }
  }
```

### "Cobbler's guild" — casing collision with "Cobbler's Guild" (kept earlier "Cobbler's Guild" at L616; this entry was unreachable via case-insensitive lookup)
```js
"Cobbler's guild": {
    "Custom footwear": { on: true,  p: 1.0, desc: "Shoes and boots made to measure. Last quality significantly longer than ready-made." },
    "Boot repair": { on: true, p: 0.9, desc: "Resole, restitch, and recondition worn boots. Cheaper than replacement." },
    "Guild certification": { on: false, p: 0.4, desc: "Certified work meets guild quality standards. Mark of reliable craft." }
  }
```

### "Contract killer" (was at L726, kept later occurrence at L1139)
```js
"Contract killer": {
    "Contract killing": { on: false, p: 0.9, desc: "Target, method, and timing negotiated. No receipts." },
    "Disappearance services": { on: false, p: 0.6, desc: "Make someone vanish without a body." }
  }
```

### "Dairy farmer" (was at L479, kept later occurrence at L1168)
```js
"Dairy farmer": {
    "Fresh milk": { on: true, p: 1.0, desc: "Daily milk from cattle or goats. Perishable." },
    "Butter": { on: true, p: 0.9, desc: "Churned and salted. Keeps longer than milk." },
    "Soft cheese": { on: true, p: 0.8, desc: "Fresh curds and rennet cheese." },
    "Aged cheese": { on: false, p: 0.5, desc: "Hard rind cheese. Seasons over months." }
  }
```

### "Dragon resident" (was at L334, kept later occurrence at L1180)
```js
"Dragon resident": {
    "Draconic counsel": { on: false, p: 0.5, desc: "Ancient knowledge at considerable cost" },
    "Aerial deterrence": { on: false, p: 0.6, desc: "Enemies think twice" },
    "Hoard access (rumoured)": { on: false, p: 0.2, desc: "Possibly fictional" }
  }
```

### "Fish market" (was at L570, kept later occurrence at L1203)
```js
"Fish market": {
    "Fresh fish": { on: true, p: 1.0, desc: "Morning auction of the catch. First come, best choice." },
    "Fish prices (market rate)": { on: true, p: 0.9, desc: "Day's price posted at the stall." }
  }
```

### "Foundling home" (was at L767, kept later occurrence at L1208)
```js
"Foundling home": {
    "Child placement": { on: true, p: 1.0, desc: "Place abandoned infants and children with approved families or institutions." },
    "Anonymous deposit": { on: true, p: 0.9, desc: "The wheel in the wall. No questions asked. Child received, recorded, cared for." },
    "Apprenticeship placement": { on: false, p: 0.5, desc: "Place older children with tradespeople. Provides training; reduces costs for the home." }
  }
```

### "Free company hall" (was at L389, kept later occurrence at L1213)
```js
"Free company hall": {
    "Caravan escort (armed)": { on: true, p: 1.0, desc: "Trained soldiers riding with your goods from gate to gate. Day-rate per sword, cheaper in bulk." },
    "Bodyguard hire": { on: true, p: 0.8, desc: "Personal protection for merchants, nobles, or anyone with enemies. Retainer or daily rate." },
    "Garrison contract": { on: true, p: 0.7, desc: "Supplement a town watch or noble household. Short-term contracts for walls and gates." },
    "Armed patrol": { on: true, p: 0.6, desc: "Sweep the roads or district for bandits and threats. Fee per patrol radius." },
    "Fortification consulting": { on: false, p: 0.4, desc: "Veterans who have stormed and defended walls advise on defensive construction and weak points." },
    "Siege specialist hire": { on: false, p: 0.3, desc: "Engineers, sappers, and bolt-thrower crews for offensive or defensive siege work." }
  }
```

### "Furrier's district" — casing collision with "Furrier's District" (kept earlier "Furrier's District" at L721; this entry was unreachable via case-insensitive lookup)
```js
"Furrier's district": {
    "Premium pelts": { on: true,  p: 1.0, desc: "Quality furs from arctic regions, rare animals, and master trappers." },
    "Fur garments": { on: true, p: 0.9, desc: "Lined cloaks, trim, and full fur coats. Status goods." },
    "Hide processing": { on: false, p: 0.6, desc: "Prepare and tan raw hides into usable pelts." }
  }
```

### "Gambling den" (was at L214, kept later occurrence at L1224)
```js
"Gambling den": {
    "Games of chance": { on: true, p: 1.0, desc: "Dice, cards, wheel — house always wins" },
    "Bookmaking": { on: true, p: 0.8, desc: "Take bets on arena fights, races, events" },
    "Private rooms": { on: false, p: 0.6, desc: "Discreet high-stakes games for wealthy clients" }
  }
```

### "Gambling district" (was at L220, kept later occurrence at L1234)
```js
"Gambling district": {
    "Games of chance (all kinds)": { on: true, p: 1.0, desc: "Every form of gambling under one roof district" },
    "High-stakes gambling": { on: true, p: 0.8, desc: "Significant sums change hands nightly" },
    "Bookmaking on all events": { on: true, p: 0.9, desc: "Wager on fights, races, elections, weather" }
  }
```

### "Gladiatorial school" (was at L694, kept later occurrence at L1239)
```js
"Gladiatorial school": {
    "Combat training": { on: true, p: 1.0, desc: "Sword, shield, and net from former fighters." },
    "Exhibition bouts": { on: true, p: 0.8, desc: "Demonstration fights at markets and festivals." },
    "Fighter hire": { on: false, p: 0.5, desc: "Hire trained fighters for security or entertainment." }
  }
```

### "Golem workforce" (was at L346, kept later occurrence at L1250)
```js
"Golem workforce": {
    "Automated labour": { on: true, p: 0.9, desc: "Heavy lifting, repetitive tasks, construction" },
    "Golem construction": { on: false, p: 0.5, desc: "Commission custom constructs for specific purposes" }
  }
```

### "Great library" (was at L297, kept later occurrence at L1261)
```js
"Great library": {
    "Research access": { on: true, p: 1.0, desc: "Vast collection, scholarly staff" },
    "Rare texts": { on: true, p: 0.7, desc: "Unique manuscripts, ancient records" },
    "Magical references": { on: true, p: 0.6, desc: "Spell theory, enchantment formulae" },
    "Copying services": { on: true, p: 0.8, desc: "Commission copies of documents" }
  }
```

### "Harbour master's office" — casing collision with "Harbour Master's Office" (kept earlier "Harbour Master's Office" at L715; this entry was unreachable via case-insensitive lookup)
```js
"Harbour master's office": {
    "Berth assignment": { on: true,  p: 1.0, desc: "Allocate dock space to incoming vessels based on size, cargo, and priority." },
    "Navigation records": { on: true, p: 0.8, desc: "Log arrivals, departures, cargo manifests, and vessel identities." },
    "Tide tables and charts": { on: false, p: 0.6, desc: "Provide current tide tables and local navigational information." },
    "Port authority enforcement": { on: false, p: 0.5, desc: "Enforce harbour regulations, inspect vessels, and collect port dues." }
  }
```

### "Hedge wizard" (was at L124, kept later occurrence at L1283)
```js
"Hedge wizard": {
    "Cantrips and minor magic": { on: true, p: 1.0, desc: "Light, mending, prestidigitation for coin" },
    "Fortune telling": { on: true, p: 0.8, desc: "Divination of variable reliability" },
    "Curse removal (claimed)": { on: true, p: 0.6, desc: "May or may not work" },
    "Herbal remedies": { on: true, p: 0.7, desc: "Folk medicine, minor healing" }
  }
```

### "Hired blades" (was at L699, kept later occurrence at L1289)
```js
"Hired blades": {
    "Bodyguard hire": { on: true, p: 1.0, desc: "Personal protection. Daily or weekly rate." },
    "Debt enforcement": { on: true, p: 0.8, desc: "Collect what is owed. Persuasion first." },
    "Private contract work": { on: false, p: 0.5, desc: "Ask carefully. Answer varies by job." }
  }
```

### "Hireling hall" (was at L422, kept later occurrence at L1295)
```js
"Hireling hall": {
    "Torchbearer hire": { on: true, p: 1.0, desc: "Brave (or desperate) locals for light-carrying, door-opening, and trap-springing. 1 GP/session." },
    "Porter hire": { on: true, p: 1.0, desc: "Carries your gear. Refuses to carry it into rooms with monsters." },
    "Local guide hire": { on: true, p: 0.7, desc: "Someone who knows the local terrain, ruins, and which caves smell like death." },
    "Animal handler hire": { on: false, p: 0.4, desc: "Handles pack animals, mounts, or captured creatures. Not responsible for bites." }
  }
```

### "Hunter's lodge" — casing collision with "Hunter's Lodge" (kept earlier "Hunter's Lodge" at L438; this entry was unreachable via case-insensitive lookup)
```js
"Hunter's lodge": {
    "Hunting guide": { on: true,  p: 1.0, desc: "Expert guides for hunting trips. Knowledge of terrain, quarry, and technique." },
    "Wild game sales": { on: true, p: 0.9, desc: "Fresh and preserved game from professional hunters." },
    "Pest control": { on: true, p: 0.8, desc: "Control wildlife threatening livestock or settlements. Wolves, boar, deer." },
    "Tracking services": { on: false, p: 0.5, desc: "Track humans or animals across difficult terrain." },
    "Trophy mounting": { on: false, p: 0.3, desc: "Preserve and mount notable kills for display." }
  }
```

### "Mercenary quarter" (was at L159, kept later occurrence at L1374)
```js
"Mercenary quarter": {
    "Armed escort": { on: true, p: 1.0, desc: "Caravan guards, bodyguards, dungeon retinues" },
    "Siege specialists": { on: true, p: 0.6, desc: "Engineers, sappers, artillery crews" },
    "Training services": { on: true, p: 0.7, desc: "Combat training for civilians" },
    "Contract negotiation": { on: true, p: 0.9, desc: "Broker mercenary contracts" }
  }
```

### "Mint (official)" (was at L704, kept later occurrence at L1394)
```js
"Mint (official)": {
    "Coin minting": { on: true, p: 1.0, desc: "Official coinage. Certified weight and purity." },
    "Bullion exchange": { on: true, p: 0.9, desc: "Convert gold and silver to standard coin." },
    "Assay certification": { on: true, p: 0.8, desc: "Official purity certificate for banking." }
  }
```

### "Multiple criminal factions" (was at L257, kept later occurrence at L1422)
```js
"Multiple criminal factions": {
    "Comprehensive black market": { on: false, p: 0.9, desc: "Full criminal economy — everything available" },
    "Faction hire": { on: false, p: 0.7, desc: "Employ one faction against another" },
    "Criminal sanctuary": { on: false, p: 0.6, desc: "Lay low, find allies, access network" }
  }
```

### "Pack animal trader" (was at L473, kept later occurrence at L1451)
```js
"Pack animal trader": {
    "Mule purchase": { on: true, p: 1.0, desc: "Working mules for transport and farm labour." },
    "Donkey purchase": { on: true, p: 0.9, desc: "Pack donkeys — cheaper to feed than mules." },
    "Draft horse purchase": { on: true, p: 0.7, desc: "Heavy horses for plowing and haulage." },
    "Animal hire (daily)": { on: true, p: 0.8, desc: "Rent a pack animal by the day. Deposit required." }
  }
```

### "Peat cutter" (was at L453, kept later occurrence at L1480)
```js
"Peat cutter": {
    "Peat fuel": { on: true, p: 1.0, desc: "Dried peat blocks for domestic heating." },
    "Peat (bulk)": { on: false, p: 0.4, desc: "Bulk peat for kilns and industrial fuel." }
  }
```

### "Planar embassy" (was at L322, kept later occurrence at L1483)
```js
"Planar embassy": {
    "Diplomatic access": { on: true, p: 1.0, desc: "Formal contact with extraplanar powers" },
    "Planar services": { on: true, p: 0.7, desc: "Arranged transport, summonings, pact brokerage" },
    "Extraplanar goods": { on: true, p: 0.8, desc: "Official import of planar materials" }
  }
```

### "Planar traders" (was at L316, kept later occurrence at L1488)
```js
"Planar traders": {
    "Extraplanar goods": { on: true, p: 0.9, desc: "Items from other planes, rare materials" },
    "Creature components": { on: true, p: 0.7, desc: "Parts from extraplanar beings" },
    "Planar travel information": { on: false, p: 0.5, desc: "Routes, dangers, political conditions of other planes" }
  }
```

### "Public bathhouse" (was at L761, kept later occurrence at L1512)
```js
"Public bathhouse": {
    "Bathing": { on: true, p: 1.0, desc: "Hot water, soap, and a scraping stone. Pay by the hour or the day." },
    "Barber services": { on: true, p: 0.8, desc: "Shave, haircut, minor tooth-pulling, and bloodletting. All one trade." },
    "Rumour and news": { on: true, p: 0.9, desc: "The bathhouse hears everything. An hour with a garrulous bather is worth a week of asking around." },
    "Companionship services": { on: false, p: 0.5, desc: "The line between bathhouse and brothel blurs in some quarters." }
  }
```

### "Red light district" (was at L226, kept later occurrence at L1518)
```js
"Red light district": {
    "Companionship services": { on: false, p: 1.0, desc: "Officially tolerated or ignored by authorities" },
    "Discreet meeting venues": { on: true, p: 0.8, desc: "Private rooms, no questions asked" },
    "Black market access": { on: false, p: 0.6, desc: "Connections to fence networks and illicit goods" }
  }
```

### "Shepherd" (was at L485, kept later occurrence at L1542)
```js
"Shepherd": {
    "Raw wool": { on: true, p: 1.0, desc: "Unwashed fleece from shearing." },
    "Livestock (sheep)": { on: true, p: 0.8, desc: "Breeding ewes, rams, wethers for mutton." },
    "Lanolin": { on: false, p: 0.4, desc: "Wool fat for medicines and waterproofing." }
  }
```

### "Smuggling operation" (was at L245, kept later occurrence at L1552)
```js
"Smuggling operation": {
    "Import/export bypass": { on: false, p: 1.0, desc: "Move goods past customs without paying duty" },
    "Contraband transport": { on: false, p: 0.8, desc: "Ship anything, anywhere, for a price" },
    "Safe houses": { on: false, p: 0.6, desc: "Shelter for fugitives, wanted persons" }
  }
```

### "Stable master" (was at L534, kept later occurrence at L1567)
```js
"Stable master": {
    "Horse training": { on: true, p: 1.0, desc: "Saddle-breaking and basic training." },
    "Horse purchase": { on: true, p: 0.9, desc: "Riding and cart horses. Prices negotiable." },
    "Stabling (long-term)": { on: true, p: 0.8, desc: "Monthly stabling with exercise and grooming." },
    "Farriery": { on: true, p: 0.9, desc: "Shoeing, hoof care, lameness diagnosis." }
  }
```

### "Stable yard" (was at L457, kept later occurrence at L1572)
```js
"Stable yard": {
    "Horse stabling": { on: true, p: 1.0, desc: "Overnight stabling with feed and water." },
    "Horseshoeing": { on: true, p: 0.9, desc: "Basic farriery — reshoe, check for lameness." },
    "Pack animal hire": { on: true, p: 0.7, desc: "Rent a mule or donkey for short hauls." }
  }
```

### "Street gang" (was at L251, kept later occurrence at L1576)
```js
"Street gang": {
    "Intimidation services": { on: false, p: 0.9, desc: "Scare off rivals, collect debts, rough up targets" },
    "Territory protection": { on: false, p: 0.7, desc: "Pay them or suffer" },
    "Petty theft and pickpocketing": { on: false, p: 0.8, desc: "Opportunistic crime in their turf" }
  }
```

### "Tailor's guild" — casing collision with "Tailor's Guild" (kept earlier "Tailor's Guild" at L622; this entry was unreachable via case-insensitive lookup)
```js
"Tailor's guild": {
    "Custom clothing": { on: true,  p: 1.0, desc: "Garments made to measure. Fashion-conscious clients expect the best." },
    "Livery": { on: true, p: 0.8, desc: "Matching uniforms and livery for households, guilds, and institutions." },
    "Ceremonial dress": { on: false, p: 0.5, desc: "Wedding clothes, funeral garments, and formal regalia." },
    "Alterations": { on: false, p: 0.7, desc: "Take in, let out, and repair existing garments." }
  }
```

### "Tanner (established)" (was at L611, kept later occurrence at L1587)
```js
"Tanner (established)": {
    "Quality leather": { on: true, p: 1.0, desc: "Full-grain tanned leather for armour and fine goods." },
    "Saddlery leather": { on: true, p: 0.9, desc: "Heavy leather for saddles and harness." },
    "Leather armour": { on: false, p: 0.5, desc: "Boiled and shaped leather armour." }
  }
```

### "Toll bridge" (was at L574, kept later occurrence at L1618)
```js
"Toll bridge": {
    "River crossing": { on: true, p: 1.0, desc: "Foot and livestock crossing. Charged per head or per cart." },
    "Boat hire": { on: false, p: 0.4, desc: "Skiff for crossing goods that can't walk." }
  }
```

### "Town crier" (was at L644, kept later occurrence at L1622)
```js
"Town crier": {
    "Public announcements": { on: true, p: 1.0, desc: "Hear ye. Official proclamations and market prices." },
    "Message delivery": { on: true, p: 0.8, desc: "Carry a message across town." },
    "Advertisement (shouted)": { on: false, p: 0.5, desc: "Pay the crier to mention your business." }
  }
```

### "Town watch" (was at L409, kept later occurrence at L1626)
```js
"Town watch": {
    "Patrol and watch": { on: true, p: 1.0, desc: "Regular night patrols, gate inspection, and response to public disturbances." },
    "Prisoner holding": { on: true, p: 0.8, desc: "Short-term custody pending trial or ransom. Fee for extended holds." },
    "Investigation services": { on: true, p: 0.5, desc: "The watch investigates crimes within its jurisdiction. Effectiveness varies by funding." }
  }
```

### "Undead labor" (was at L351, kept later occurrence at L1641)
```js
"Undead labor": {
    "Skeletal labour": { on: false, p: 0.9, desc: "Tireless workers, no wages, socially controversial" },
    "Necromantic services": { on: false, p: 0.5, desc: "Raise the dead for various purposes" }
  }
```

### "Veteran's lodge" — casing collision with "Veteran's Lodge" (kept earlier "Veteran's Lodge" at L398; this entry was unreachable via case-insensitive lookup)
```js
"Veteran's lodge": {
    "Military consulting": { on: true,  p: 1.0, desc: "Veterans sell tactical expertise, campaign knowledge, and military advice." },
    "Combat training": { on: true, p: 0.8, desc: "Hard-won practical training from people who've used it in anger." },
    "Veteran networking": { on: false, p: 0.6, desc: "Connect with other veterans. Mutual aid, job referrals, and shared intelligence." }
  }
```

### "Village musician" (was at L583, kept later occurrence at L1651)
```js
"Village musician": {
    "Performances (events)": { on: true, p: 1.0, desc: "Weddings, festivals, funerals. Book in advance." },
    "Music lessons": { on: false, p: 0.4, desc: "Basic instruction on fiddle, pipe, or drum." }
  }
```

### "Village scribe" (was at L593, kept later occurrence at L1660)
```js
"Village scribe": {
    "Letter writing": { on: true, p: 1.0, desc: "Dictate, she writes. Simple correspondence and contracts." },
    "Document copying": { on: true, p: 0.9, desc: "Copy deeds, charters, and texts." },
    "Reading aloud": { on: true, p: 0.8, desc: "Read official documents to the illiterate." },
    "Simple contract drafting": { on: false, p: 0.5, desc: "Basic legal agreements. Not a lawyer." }
  }
```

### "Wildfowler" (was at L560, kept later occurrence at L1670)
```js
"Wildfowler": {
    "Waterfowl": { on: true, p: 1.0, desc: "Ducks, geese, and pigeons — fresh or dressed." },
    "Feathers": { on: false, p: 0.5, desc: "Down and quill feathers for bedding and fletching." },
    "Wildfowling hire": { on: false, p: 0.5, desc: "Guide and trained birds for a day's fowling." }
  }
```

### "Auction house" (was at L709, kept later occurrence at L1731)
```js
"Auction house": {
    "Auction services": { on: true, p: 1.0, desc: "Consign goods for public auction. Buyer's and seller's premium." },
    "Estate sales": { on: true, p: 0.8, desc: "Liquidate a deceased's estate." },
    "Private treaty sales": { on: false, p: 0.6, desc: "Negotiate a sale confidentially." },
    "Slave auction": { on: false, p: 0.5, desc: "Auction of enslaved persons. Legally licensed where applicable." }
  }
```

### "Monastery" (was at L276, kept later occurrence at L1783)
```js
"Monastery": {
    "Religious services": { on: true, p: 1.0, desc: "Mass, prayer, spiritual counsel" },
    "Illuminated manuscripts": { on: true, p: 0.7, desc: "Copied texts, religious art" },
    "Hospitality for travellers": { on: true, p: 0.9, desc: "Free or cheap accommodation" },
    "Medical care": { on: true, p: 0.8, desc: "Infirmary, herbalism, charity medicine" },
    "Agricultural produce": { on: true, p: 0.7, desc: "Monastery farms sell surplus grain, wine, herbs" }
  }
```

### "Underground city" (was at L361, kept later occurrence at L1821)
```js
"Underground city": {
    "Black market (comprehensive)": { on: false, p: 1.0, desc: "Below the streets, everything is available" },
    "Fugitive housing": { on: false, p: 0.9, desc: "Those who cannot exist above ground" },
    "Illegal arena fights": { on: false, p: 0.6, desc: "Unsanctioned combat, high stakes" }
  }
```

### "Sage's quarter" (was at L1675, kept later occurrence at L1881)
```js
"Sage\'s quarter": {
    "Scholarly research": { on: true,  p: 1.0, desc: "Detailed research into history, lore, natural philosophy, and obscure topics." },
    "Historical consultation": { on: true, p: 0.8, desc: "Expert opinion on historical events, genealogy, and ancient records." },
    "Translation": { on: false, p: 0.6, desc: "Translate ancient languages, foreign scripts, and obscure dialects." },
    "Expert testimony": { on: false, p: 0.4, desc: "Provide expert opinion in legal proceedings or formal inquiries." }
  }
```

## src/data/servicesData.js
### "hospitality district" (was at L10, kept later occurrence at L14)
```js
"hospitality district": "Inn/Tavern District"
```

### "inns and taverns (district)" (was at L11, kept later occurrence at L15)
```js
"inns and taverns (district)": "Inn/Tavern District"
```

### "inn (multiple)" (was at L12, kept later occurrence at L16)
```js
"inn (multiple)": "Inn/Tavern"
```

### "citizen militia" (was at L65, kept later occurrence at L71)
```js
"citizen militia": "Garrison"
```

### "adventurers' charter hall" (was at L13, kept later occurrence at L72)
```js
"adventurers' charter hall": "Adventurers' Charter Hall"
```

### "thieves' guild (powerful)" (was at L109, kept later occurrence at L129)
```js
"thieves' guild (powerful)": "Thieves Guild"
```

### "assassins' guild" (was at L110, kept later occurrence at L130)
```js
"assassins' guild": "Assassins Guild"
```

### "black market bazaar" (was at L107, kept later occurrence at L133)
```js
"black market bazaar": "Black Market"
```

### "underground city" (was at L108, kept later occurrence at L134)
```js
"underground city": "Underground City"
```

### "gambling den" (was at L106, kept later occurrence at L135)
```js
"gambling den": "Gambling Den"
```

### "gambling halls" (was at L105, kept later occurrence at L136)
```js
"gambling halls": "Gambling District"
```

### "red light district" (was at L104, kept later occurrence at L141)
```js
"red light district": "Red Light District"
```

### "dream parlors (high magic)" (was at L111, kept later occurrence at L142)
```js
"dream parlors (high magic)": "Dream Parlor"
```

### "message network (high magic)" (was at L85, kept later occurrence at L143)
```js
"message network (high magic)": "Message Network"
```

### "airship docking (high magic)" (was at L86, kept later occurrence at L144)
```js
"airship docking (high magic)": "Airship"
```

### "magic item consignment" (was at L87, kept later occurrence at L145)
```js
"magic item consignment": "Magic Item"
```

### "multiple court buildings" (was at L59, kept later occurrence at L160)
```js
"multiple court buildings": "Courthouse"
```

### "lord's appointee" (was at L153, kept later occurrence at L161)
```js
"lord's appointee": "Courthouse"
```

### "town hall" (was at L57, kept later occurrence at L162)
```js
"town hall": "Courthouse"
```

### "city hall" (was at L58, kept later occurrence at L163)
```js
"city hall": "Courthouse"
```

### "stock exchange (early)" (was at L56, kept later occurrence at L175)
```js
"stock exchange (early)": "Banking District"
```

### "hireling hall" (was at L73, kept later occurrence at L176)
```js
"hireling hall": "Hireling Hall"
```

### "carpenter" (was at L25, kept later occurrence at L190)
```js
carpenter: "Blacksmith"
```

### "cooper" (was at L27, kept later occurrence at L191)
```js
cooper: "Craft Guild District"
```

### "glassmakers" (was at L33, kept later occurrence at L192)
```js
glassmakers: "Specialist Craftsmen"
```

### "tanners" (was at L29, kept later occurrence at L193)
```js
tanners: "Craft Guild District"
```

### "thatcher" (was at L26, kept later occurrence at L194)
```js
thatcher: "Craft Guild District"
```

### "barracks" (was at L68, kept later occurrence at L204)
```js
barracks: "Garrison"
```

### "brothel" (was at L103, kept later occurrence at L227)
```js
brothel: "Red Light District"
```

### "colosseum/arena" (was at L91, kept later occurrence at L228)
```js
"colosseum/arena": "Arena"
```

### "multiple theaters" (was at L94, kept later occurrence at L229)
```js
"multiple theaters": "Theater"
```

### "opera house" (was at L95, kept later occurrence at L230)
```js
"opera house": "Theater"
```
