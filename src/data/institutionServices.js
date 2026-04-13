/**
 * institutionServices.js
 * Service definitions for all catalogued institutions.
 * Format: { "Institution Name": { "Service Name": { on, p, desc } } }
 * Separated from tradeGoodsData.js to keep that file manageable.
 */

export const INSTITUTION_SERVICES = {
  "Market": {
    "Price discovery": { on: true, p: 1.0, desc: "Fair pricing through competition" },
    "Trade facilitation": { on: true, p: 1.0, desc: "Connect buyers and sellers" },
    "Quality standards": { on: true, p: 0.8, desc: "Prevent fraud and poor goods" },
    "News and information": { on: true, p: 0.7, desc: "Gossip, trade news, opportunities" }
  },
  
  "Guild Hall": {
    "Quality control": { on: true, p: 1.0, desc: "Maintain craft standards" },
    "Apprenticeship programs": { on: true, p: 0.9, desc: "Train next generation" },
    "Trade regulation": { on: true, p: 1.0, desc: "Enforce monopolies and rules" },
    "Member support": { on: true, p: 0.8, desc: "Funeral funds, disability aid" },
    "Price fixing": { on: false, p: 0.6, desc: "Coordinate pricing (may be illegal)" }
  },



  "Inn/Tavern": {
    "Lodging": { on: true, p: 1.0, desc: "Rooms for travelers" },
    "Meals and drink": { on: true, p: 1.0, desc: "Food and ale" },
    "Stabling": { on: true, p: 0.8, desc: "Horse care" },
    "Message relay": { on: true, p: 0.7, desc: "Informal postal service" },
    "Gambling": { on: false, p: 0.4, desc: "Dice, cards (may be illegal)" },
    "Hiring hall": { on: true, p: 0.6, desc: "Find workers, mercenaries" }
  },

  "Church/Temple": {
    "Religious services": { on: true, p: 1.0, desc: "Mass, prayer, rituals" },
    "Education (basic)": { on: true, p: 0.8, desc: "Reading, writing for some" },
    "Poor relief": { on: true, p: 0.9, desc: "Charity for destitute" },
    "Record keeping": { on: true, p: 1.0, desc: "Births, deaths, marriages" },
    "Sanctuary": { on: true, p: 0.9, desc: "Legal protection on holy ground" },
    "Medical care (basic)": { on: true, p: 0.6, desc: "Herbalism, prayer healing" }
  },

  "Mill": {
    "Grain milling": { on: true, p: 1.0, desc: "Process grain to flour" },
    "Fulling cloth": { on: false, p: 0.4, desc: "Textile processing (if water mill)" },
    "Sawing timber": { on: false, p: 0.3, desc: "Lumber production (if saw mill)" }
  },

  "Courthouse": {
    "Civil disputes": { on: true, p: 1.0, desc: "Settle contract/property issues" },
    "Criminal trials": { on: true, p: 1.0, desc: "Judge crimes" },
    "Notary services": { on: true, p: 0.9, desc: "Witness contracts, wills" },
    "Legal education": { on: false, p: 0.5, desc: "Train lawyers" }
  },

  "Banking House": {
    "Money changing": { on: true, p: 1.0, desc: "Currency exchange" },
    "Loans": { on: true, p: 0.9, desc: "Provide credit (at interest)" },
    "Deposit accounts": { on: true, p: 0.8, desc: "Store wealth safely" },
    "Letters of credit": { on: true, p: 0.7, desc: "Long-distance payments" },
    "Insurance": { on: false, p: 0.4, desc: "Risk pooling for merchants" }
  },

  "University": {
    "Higher education": { on: true, p: 1.0, desc: "Degrees in theology, law, medicine, arts" },
    "Research": { on: true, p: 0.7, desc: "Advance knowledge" },
    "Publishing": { on: true, p: 0.6, desc: "Produce scholarly texts" },
    "Certification": { on: true, p: 1.0, desc: "Validate professional credentials" }
  },

  "Hospital": {
    "Medical treatment": { on: true, p: 1.0, desc: "Care for sick and injured" },
    "Surgery": { on: true, p: 0.6, desc: "Basic surgical procedures" },
    "Quarantine": { on: true, p: 0.8, desc: "Isolate contagious diseases" },
    "Medical training": { on: true, p: 0.5, desc: "Train physicians" }
  }
,

  "Blacksmith": {
    "Tool repair": { on: true, p: 1.0, desc: "Fix agricultural implements and household tools" },
    "Horseshoeing": { on: true, p: 1.0, desc: "Essential for transport and cavalry" },
    "Weapon creation": { on: true, p: 0.7, desc: "Simple arms, hunting knives, farm tools" },
    "Armour repair": { on: true, p: 0.6, desc: "Patch chainmail, straighten plate" },
    "Metalworking training": { on: true, p: 0.5, desc: "Take on apprentices" }
  },

  "Specialist Craftsmen": {
    "Quality weapons and armour": { on: true, p: 0.9, desc: "Professional-grade arms for wealthy clients" },
    "Fine metalwork": { on: true, p: 0.8, desc: "Jewellery, decorative pieces, precision instruments" },
    "Custom commissions": { on: true, p: 0.7, desc: "Bespoke work to specification" },
    "Masterwork items": { on: false, p: 0.4, desc: "Exceptional quality, sought by adventurers" }
  },

  "Craft Guild District": {
    "Manufactured goods (bulk)": { on: true, p: 1.0, desc: "Cloth, leather, pottery, woodwork in volume" },
    "Processed textiles": { on: true, p: 0.9, desc: "Finished fabrics, dyed cloth" },
    "Trade goods for export": { on: true, p: 0.8, desc: "Guild-certified goods for regional markets" },
    "Apprenticeship and training": { on: true, p: 0.7, desc: "Multiple craft disciplines" }
  },

  "Wizard Tower": {
    "Spellcasting (1st-3rd level)": { on: true, p: 0.8, desc: "Cantrips, light spells, minor enchantments for coin" },
    "Magical identification": { on: true, p: 0.9, desc: "Identify magical items, detect curses" },
    "Magical research access": { on: false, p: 0.5, desc: "Use library, consult wizard" },
    "Arcane scribing": { on: true, p: 0.6, desc: "Scroll creation, spell copying" }
  },

  "Mages District": {
    "Spellcasting services (1st-6th)": { on: true, p: 0.9, desc: "Wide range of arcane services for hire" },
    "Magical item market": { on: true, p: 0.8, desc: "Buy, sell, trade enchanted goods" },
    "Arcane research": { on: true, p: 0.7, desc: "Library access, consultation with specialists" },
    "Enchanting services": { on: true, p: 0.7, desc: "Imbue items with magical properties" },
    "Alchemical products": { on: true, p: 0.8, desc: "Potions, reagents, transmuted materials" }
  },

  "Alchemist": {
    "Potions and elixirs": { on: true, p: 1.0, desc: "Healing potions, antidotes, stimulants" },
    "Alchemical reagents": { on: true, p: 0.9, desc: "Components for spellcasting and crafting" },
    "Poisons (discreet)": { on: false, p: 0.4, desc: "Available to trusted customers" },
    "Smoke and flash powder": { on: true, p: 0.6, desc: "Signalling, distraction, mining use" }
  },

  "Hedge wizard": {
    "Cantrips and minor magic": { on: true, p: 1.0, desc: "Light, mending, prestidigitation for coin" },
    "Fortune telling": { on: true, p: 0.8, desc: "Divination of variable reliability" },
    "Curse removal (claimed)": { on: true, p: 0.6, desc: "May or may not work" },
    "Herbal remedies": { on: true, p: 0.7, desc: "Folk medicine, minor healing" }
  },

  "Enchanter": {
    "Weapon enchantment": { on: true, p: 0.8, desc: "+1 quality, elemental attunement, sharpness" },
    "Armour warding": { on: true, p: 0.7, desc: "Resistance runes, deflection charms" },
    "Utility enchantments": { on: true, p: 0.9, desc: "Warmth, waterproofing, light emission" },
    "Custom commissions": { on: false, p: 0.5, desc: "Complex bespoke enchantments" }
  },

  "Spellcasting Services": {
    "Spellcasting (1st-8th level)": { on: true, p: 0.9, desc: "Near-full arcane capability available for hire" },
    "Teleportation": { on: false, p: 0.5, desc: "Long-distance instant travel for paying clients" },
    "Divination and scrying": { on: true, p: 0.7, desc: "Locate persons, find objects, read intentions" },
    "Resurrection services": { on: false, p: 0.4, desc: "Raise dead — expensive, not guaranteed" }
  },

  "Academy": {
    "Advanced education": { on: true, p: 1.0, desc: "Degrees in arcane arts, natural philosophy, history" },
    "Research facilities": { on: true, p: 0.8, desc: "Laboratories, observatories, libraries" },
    "Scholarly community": { on: true, p: 0.9, desc: "Network of learned minds, consultation" },
    "Magical training": { on: true, p: 0.7, desc: "Structured arcane education" }
  },

  "Garrison": {
    "Defence services": { on: true, p: 1.0, desc: "Patrol, wall-walking, gate duty" },
    "Mercenary hire": { on: true, p: 0.6, desc: "Off-duty soldiers available for escort" },
    "Weapons training": { on: false, p: 0.5, desc: "Drill yard access for coin" },
    "Equipment purchase": { on: true, p: 0.7, desc: "Standard military equipment at cost" }
  },

  "Mercenary quarter": {
    "Armed escort": { on: true, p: 1.0, desc: "Caravan guards, bodyguards, dungeon retinues" },
    "Siege specialists": { on: true, p: 0.6, desc: "Engineers, sappers, artillery crews" },
    "Training services": { on: true, p: 0.7, desc: "Combat training for civilians" },
    "Contract negotiation": { on: true, p: 0.9, desc: "Broker mercenary contracts" }
  },

  "Docks/port facilities": {
    "Cargo handling": { on: true, p: 1.0, desc: "Load, unload, store goods" },
    "Vessel hire": { on: true, p: 0.9, desc: "Boats, barges, coastal vessels for charter" },
    "Maritime insurance": { on: false, p: 0.5, desc: "Underwrite cargo risk" },
    "Ship repair": { on: true, p: 0.8, desc: "Hull work, rigging, caulking" },
    "Pilotage": { on: true, p: 0.7, desc: "Local knowledge for navigating harbour or river" }
  },

  "Major Port": {
    "International shipping": { on: true, p: 1.0, desc: "Long-haul cargo routes across seas" },
    "Passenger vessel": { on: true, p: 0.9, desc: "Passage to distant ports for coin" },
    "Warehousing (bonded)": { on: true, p: 0.8, desc: "Secure storage pending customs clearance" },
    "Ship chandlery": { on: true, p: 1.0, desc: "Provisions, rope, canvas, all nautical supplies" },
    "Customs brokerage": { on: true, p: 0.7, desc: "Navigate tariffs and port fees" }
  },

  "Navy": {
    "Convoy escort": { on: false, p: 0.6, desc: "Armed escort for merchant vessels" },
    "Privateer licensing": { on: false, p: 0.4, desc: "Letters of marque for commerce raiding" },
    "Shipyard access": { on: false, p: 0.5, desc: "Naval construction and repair" }
  },

  "Merchant warehouses": {
    "Goods storage": { on: true, p: 1.0, desc: "Secure warehousing for merchants" },
    "Cold storage": { on: false, p: 0.4, desc: "Ice cellars for perishables" },
    "Bonded storage": { on: true, p: 0.7, desc: "Customs-controlled goods pending duty" }
  },

  "Theater": {
    "Performances": { on: true, p: 1.0, desc: "Plays, comedies, tragedies, seasonal shows" },
    "Music and song": { on: true, p: 0.9, desc: "Concerts, ballads, travelling bards" },
    "Private hire": { on: false, p: 0.5, desc: "Company available for noble functions" }
  },

  "Bardic college": {
    "Musical education": { on: true, p: 1.0, desc: "Instrument training, voice, composition" },
    "Magical entertainment": { on: true, p: 0.8, desc: "Bardic spellcasting woven into performance" },
    "Historical research": { on: true, p: 0.7, desc: "Lore collection, ballads as historical record" },
    "Diplomatic services": { on: false, p: 0.4, desc: "Skilled negotiators, silver-tongued envoys" }
  },

  "Arena": {
    "Gladiatorial combat": { on: true, p: 1.0, desc: "Scheduled fights, betting, noble patronage" },
    "Monster exhibitions": { on: true, p: 0.7, desc: "Caged creatures, beast fights" },
    "Training facility": { on: false, p: 0.5, desc: "Gladiatorial school, combat instruction" },
    "Public games": { on: true, p: 0.8, desc: "Athletic competitions, races, spectacle" }
  },

  "Gambling den": {
    "Games of chance": { on: true, p: 1.0, desc: "Dice, cards, wheel — house always wins" },
    "Bookmaking": { on: true, p: 0.8, desc: "Take bets on arena fights, races, events" },
    "Private rooms": { on: false, p: 0.6, desc: "Discreet high-stakes games for wealthy clients" }
  },

  "Gambling district": {
    "Games of chance (all kinds)": { on: true, p: 1.0, desc: "Every form of gambling under one roof district" },
    "High-stakes gambling": { on: true, p: 0.8, desc: "Significant sums change hands nightly" },
    "Bookmaking on all events": { on: true, p: 0.9, desc: "Wager on fights, races, elections, weather" }
  },

  "Red light district": {
    "Companionship services": { on: false, p: 1.0, desc: "Officially tolerated or ignored by authorities" },
    "Discreet meeting venues": { on: true, p: 0.8, desc: "Private rooms, no questions asked" },
    "Black market access": { on: false, p: 0.6, desc: "Connections to fence networks and illicit goods" }
  },

  "Thieves Guild": {
    "Fencing stolen goods": { on: false, p: 0.9, desc: "Move hot merchandise, take cut" },
    "Burglary services": { on: false, p: 0.7, desc: "Professional break-ins, retrievals" },
    "Information brokerage": { on: false, p: 0.8, desc: "What thieves see, they sell" },
    "Guild protection": { on: false, p: 0.6, desc: "Pay dues, they leave you alone" }
  },

  "Black market": {
    "Contraband goods": { on: false, p: 1.0, desc: "Banned items, untaxed goods, smuggled luxuries" },
    "Forged documents": { on: false, p: 0.7, desc: "Letters of passage, guild membership, titles" },
    "Illegal services": { on: false, p: 0.6, desc: "Hired violence, forbidden magic, poison" }
  },

  "Smuggling operation": {
    "Import/export bypass": { on: false, p: 1.0, desc: "Move goods past customs without paying duty" },
    "Contraband transport": { on: false, p: 0.8, desc: "Ship anything, anywhere, for a price" },
    "Safe houses": { on: false, p: 0.6, desc: "Shelter for fugitives, wanted persons" }
  },

  "Street gang": {
    "Intimidation services": { on: false, p: 0.9, desc: "Scare off rivals, collect debts, rough up targets" },
    "Territory protection": { on: false, p: 0.7, desc: "Pay them or suffer" },
    "Petty theft and pickpocketing": { on: false, p: 0.8, desc: "Opportunistic crime in their turf" }
  },

  "Multiple criminal factions": {
    "Comprehensive black market": { on: false, p: 0.9, desc: "Full criminal economy — everything available" },
    "Faction hire": { on: false, p: 0.7, desc: "Employ one faction against another" },
    "Criminal sanctuary": { on: false, p: 0.6, desc: "Lay low, find allies, access network" }
  },

  "Assassins Guild": {
    "Contract killing": { on: false, p: 0.9, desc: "Verified, deniable, professional" },
    "Intimidation only": { on: false, p: 0.7, desc: "Scare targets without killing — cheaper" },
    "Poison supply": { on: false, p: 0.6, desc: "Custom preparations, untraceable" }
  },

  "Banking district": {
    "International finance": { on: true, p: 1.0, desc: "Letters of credit across kingdoms" },
    "Investment banking": { on: true, p: 0.8, desc: "Underwrite ventures, take equity" },
    "Currency speculation": { on: false, p: 0.5, desc: "Exchange rates, arbitrage" },
    "Institutional lending": { on: true, p: 0.9, desc: "Large loans to guilds, noble houses, cities" }
  },

  "Monastery": {
    "Religious services": { on: true, p: 1.0, desc: "Mass, prayer, spiritual counsel" },
    "Illuminated manuscripts": { on: true, p: 0.7, desc: "Copied texts, religious art" },
    "Hospitality for travellers": { on: true, p: 0.9, desc: "Free or cheap accommodation" },
    "Medical care": { on: true, p: 0.8, desc: "Infirmary, herbalism, charity medicine" },
    "Agricultural produce": { on: true, p: 0.7, desc: "Monastery farms sell surplus grain, wine, herbs" }
  },

  "Adventurers Guild": {
    "Contract board": { on: true, p: 1.0, desc: "Posted bounties, dungeon expeditions, monster hunts" },
    "Equipment hire": { on: true, p: 0.8, desc: "Torches, rope, rations, basic tools" },
    "Information exchange": { on: true, p: 0.9, desc: "Dungeon maps, monster lore, rumour board" },
    "Party matching": { on: true, p: 0.7, desc: "Connect solo adventurers, fill gaps in groups" }
  },

  "Adventurers' Charter Hall": {
    "Official charters": { on: true, p: 1.0, desc: "Legal authority to clear ruins, claim treasure" },
    "Emergency rescue": { on: true, p: 0.8, desc: "Retrieve lost parties, extract from dungeons" },
    "Monster bounties": { on: true, p: 1.0, desc: "Formal reward system for verified kills" }
  },

  "Great library": {
    "Research access": { on: true, p: 1.0, desc: "Vast collection, scholarly staff" },
    "Rare texts": { on: true, p: 0.7, desc: "Unique manuscripts, ancient records" },
    "Magical references": { on: true, p: 0.6, desc: "Spell theory, enchantment formulae" },
    "Copying services": { on: true, p: 0.8, desc: "Commission copies of documents" }
  },

  "Message Network": {
    "Long-distance messages": { on: true, p: 1.0, desc: "Magical or fast-relay messaging across regions" },
    "Secure communications": { on: false, p: 0.6, desc: "Encoded, magically sealed messages" },
    "Intelligence services": { on: false, p: 0.5, desc: "Who has the network, knows everything" }
  },

  "Magic Item": {
    "Magic item sales": { on: true, p: 1.0, desc: "Curated inventory of enchanted goods" },
    "Consignment sales": { on: true, p: 0.8, desc: "Sell your finds through the shop, take percentage" },
    "Appraisal": { on: true, p: 0.9, desc: "Expert valuation of magical objects" }
  },

  "Planar traders": {
    "Extraplanar goods": { on: true, p: 0.9, desc: "Items from other planes, rare materials" },
    "Creature components": { on: true, p: 0.7, desc: "Parts from extraplanar beings" },
    "Planar travel information": { on: false, p: 0.5, desc: "Routes, dangers, political conditions of other planes" }
  },

  "Planar embassy": {
    "Diplomatic access": { on: true, p: 1.0, desc: "Formal contact with extraplanar powers" },
    "Planar services": { on: true, p: 0.7, desc: "Arranged transport, summonings, pact brokerage" },
    "Extraplanar goods": { on: true, p: 0.8, desc: "Official import of planar materials" }
  },

  "Airship": {
    "Passenger transport": { on: true, p: 0.8, desc: "Fast long-distance travel bypassing terrain" },
    "Cargo shipping": { on: true, p: 0.7, desc: "Expensive but fast freight delivery" },
    "Aerial reconnaissance": { on: false, p: 0.5, desc: "Survey territory, scout positions" }
  },

  "Dragon resident": {
    "Draconic counsel": { on: false, p: 0.5, desc: "Ancient knowledge at considerable cost" },
    "Aerial deterrence": { on: false, p: 0.6, desc: "Enemies think twice" },
    "Hoard access (rumoured)": { on: false, p: 0.2, desc: "Possibly fictional" }
  },

  "Dream Parlor": {
    "Lucid dream experiences": { on: false, p: 0.9, desc: "Curated magical visions, entertainment" },
    "Memory access": { on: false, p: 0.5, desc: "Retrieve suppressed memories, relive the past" },
    "Prophetic dreams": { on: false, p: 0.4, desc: "Divination through induced vision states" }
  },

  "Golem workforce": {
    "Automated labour": { on: true, p: 0.9, desc: "Heavy lifting, repetitive tasks, construction" },
    "Golem construction": { on: false, p: 0.5, desc: "Commission custom constructs for specific purposes" }
  },

  "Undead labor": {
    "Skeletal labour": { on: false, p: 0.9, desc: "Tireless workers, no wages, socially controversial" },
    "Necromantic services": { on: false, p: 0.5, desc: "Raise the dead for various purposes" }
  },

  "Front Business": {
    "Legitimate facade": { on: true, p: 1.0, desc: "Normal-seeming shop concealing criminal activity" },
    "Money laundering": { on: false, p: 0.8, desc: "Clean criminal proceeds through the books" }
  },

  "Underground city": {
    "Black market (comprehensive)": { on: false, p: 1.0, desc: "Below the streets, everything is available" },
    "Fugitive housing": { on: false, p: 0.9, desc: "Those who cannot exist above ground" },
    "Illegal arena fights": { on: false, p: 0.6, desc: "Unsanctioned combat, high stakes" }
  },

  "Exotic Beast Trainers": {
    "Exotic creatures for sale": { on: true, p: 0.8, desc: "Rare animals, magical beasts, pets for the wealthy" },
    "Animal training": { on: true, p: 0.9, desc: "Guard animals, messenger birds, war mounts" },
    "Monster handling": { on: false, p: 0.5, desc: "Tame or neutralise problematic creatures" }
  },

  "Monster Part Dealers": {
    "Monster components": { on: true, p: 1.0, desc: "Dragon scales, basilisk eyes, troll blood" },
    "Alchemical ingredients": { on: true, p: 0.9, desc: "Magical reagents sourced from kills" },
    "Taxidermy and trophies": { on: true, p: 0.6, desc: "Mounted heads, full mounts, hides" }
  },

  "Inn/Tavern District": {
    "Lodging (all grades)": { on: true, p: 1.0, desc: "Flophouse to private suite — multiple establishments" },
    "Food and drink (all grades)": { on: true, p: 1.0, desc: "Street food to formal dining" },
    "Entertainment": { on: true, p: 0.9, desc: "Music, games, storytelling every night" },
    "Hiring hall": { on: true, p: 0.8, desc: "Workers, mercenaries, guides available" },
    "Black market access": { on: false, p: 0.5, desc: "Someone in here knows someone" }
  }

,

  "Free company hall": {
    "Caravan escort (armed)": { on: true, p: 1.0, desc: "Trained soldiers riding with your goods from gate to gate. Day-rate per sword, cheaper in bulk." },
    "Bodyguard hire": { on: true, p: 0.8, desc: "Personal protection for merchants, nobles, or anyone with enemies. Retainer or daily rate." },
    "Garrison contract": { on: true, p: 0.7, desc: "Supplement a town watch or noble household. Short-term contracts for walls and gates." },
    "Armed patrol": { on: true, p: 0.6, desc: "Sweep the roads or district for bandits and threats. Fee per patrol radius." },
    "Fortification consulting": { on: false, p: 0.4, desc: "Veterans who have stormed and defended walls advise on defensive construction and weak points." },
    "Siege specialist hire": { on: false, p: 0.3, desc: "Engineers, sappers, and bolt-thrower crews for offensive or defensive siege work." }
  },

  "Veteran's Lodge": {
    "Armed escort": { on: true, p: 0.7, desc: "Small group of experienced fighters for hire. Cheaper than a full company, better than nothing." },
    "Night watch hire": { on: true, p: 0.6, desc: "Retired soldiers supplementing the village watch. Reliable, cheap, and unwilling to be bribed." },
    "Combat instruction": { on: false, p: 0.4, desc: "Basic weapons training for village militia. They will not be knights, but they will not die in the first volley." }
  },

  "Citizen militia": {
    "Emergency muster": { on: true, p: 1.0, desc: "In crisis, all able-bodied residents bear arms. No cost — but no reliability either." },
    "Watch rotation": { on: true, p: 0.6, desc: "Rotating gate and patrol duty. Provides basic deterrence." }
  },

  "Town watch": {
    "Patrol and watch": { on: true, p: 1.0, desc: "Regular night patrols, gate inspection, and response to public disturbances." },
    "Prisoner holding": { on: true, p: 0.8, desc: "Short-term custody pending trial or ransom. Fee for extended holds." },
    "Investigation services": { on: true, p: 0.5, desc: "The watch investigates crimes within its jurisdiction. Effectiveness varies by funding." }
  },

  "Adventurers' Charter Hall": {
    "Monster bounties": { on: true, p: 1.0, desc: "Posted bounties for verified monster kills. Bring proof — claw, ear, or head." },
    "Armed escort": { on: true, p: 0.8, desc: "Adventuring party escort through dangerous territory. Higher cost, higher capability than guards." },
    "Dungeon clearance": { on: true, p: 0.6, desc: "Full site clearance of dangerous locations. Quoted per job." },
    "Rescue operations": { on: false, p: 0.4, desc: "Recovery of persons taken by monsters, bandits, or worse. No guarantee of success." }
  },

  "Hireling hall": {
    "Torchbearer hire": { on: true, p: 1.0, desc: "Brave (or desperate) locals for light-carrying, door-opening, and trap-springing. 1 GP/session." },
    "Porter hire": { on: true, p: 1.0, desc: "Carries your gear. Refuses to carry it into rooms with monsters." },
    "Local guide hire": { on: true, p: 0.7, desc: "Someone who knows the local terrain, ruins, and which caves smell like death." },
    "Animal handler hire": { on: false, p: 0.4, desc: "Handles pack animals, mounts, or captured creatures. Not responsible for bites." }
  }

,

  // ── New institutions added in v181-v182 ─────────────────────────────────────

  "Fisher's Landing": {
    "Fresh fish": { on: true, p: 1.0, desc: "Catch of the day — buy and cook same-day." },
    "Salted fish": { on: true, p: 0.8, desc: "Preserved fish for travel or winter." },
    "Fish oil": { on: false, p: 0.4, desc: "Rendered fish oil for lamps and waterproofing." }
  },
  "Hunter's Lodge": {
    "Game meat": { on: true, p: 1.0, desc: "Venison, boar, rabbit — seasonal and fresh." },
    "Hunting guide hire": { on: true, p: 0.9, desc: "A tracker who knows the territory." },
    "Furs and pelts": { on: true, p: 0.8, desc: "Raw pelts ready for tanning." },
    "Hunting trophies": { on: false, p: 0.4, desc: "Heads, antlers, and tusks for noble halls." },
    "Trapping services": { on: false, p: 0.5, desc: "Set and manage trap lines across the territory." }
  },
  "Charcoal burner": {
    "Charcoal": { on: true, p: 1.0, desc: "Kiln-fired charcoal for smithing and smelting." },
    "Firewood (seasoned)": { on: true, p: 0.8, desc: "Pre-cut and dried firewood." }
  },
  "Maltster": {
    "Malted barley": { on: true, p: 1.0, desc: "Sprouted and kiln-dried barley — the basis of all ale." },
    "Malt (surplus)": { on: false, p: 0.5, desc: "Excess malt for sale to other brewers." }
  },
  "Peat cutter": {
    "Peat fuel": { on: true, p: 1.0, desc: "Dried peat blocks for domestic heating." },
    "Peat (bulk)": { on: false, p: 0.4, desc: "Bulk peat for kilns and industrial fuel." }
  },
  "Stable yard": {
    "Horse stabling": { on: true, p: 1.0, desc: "Overnight stabling with feed and water." },
    "Horseshoeing": { on: true, p: 0.9, desc: "Basic farriery — reshoe, check for lameness." },
    "Pack animal hire": { on: true, p: 0.7, desc: "Rent a mule or donkey for short hauls." }
  },
  "Mine (open cast)": {
    "Iron ore": { on: true, p: 1.0, desc: "Raw ore from surface excavation. Needs smelting." },
    "Quarried stone": { on: true, p: 0.7, desc: "Rough-cut building stone." },
    "Coal": { on: true, p: 0.6, desc: "Raw coal for fuel." },
    "Mining labour hire": { on: false, p: 0.5, desc: "Recruit experienced miners for a dig." }
  },
  "Stone quarry": {
    "Quarried stone": { on: true, p: 1.0, desc: "Cut stone blocks for construction." },
    "Dressed stone": { on: true, p: 0.7, desc: "Finished stone for walls and floors." },
    "Gravel and rubble": { on: false, p: 0.6, desc: "Road fill and foundation material." }
  },
  "Pack animal trader": {
    "Mule purchase": { on: true, p: 1.0, desc: "Working mules for transport and farm labour." },
    "Donkey purchase": { on: true, p: 0.9, desc: "Pack donkeys — cheaper to feed than mules." },
    "Draft horse purchase": { on: true, p: 0.7, desc: "Heavy horses for plowing and haulage." },
    "Animal hire (daily)": { on: true, p: 0.8, desc: "Rent a pack animal by the day. Deposit required." }
  },
  "Dairy farmer": {
    "Fresh milk": { on: true, p: 1.0, desc: "Daily milk from cattle or goats. Perishable." },
    "Butter": { on: true, p: 0.9, desc: "Churned and salted. Keeps longer than milk." },
    "Soft cheese": { on: true, p: 0.8, desc: "Fresh curds and rennet cheese." },
    "Aged cheese": { on: false, p: 0.5, desc: "Hard rind cheese. Seasons over months." }
  },
  "Shepherd": {
    "Raw wool": { on: true, p: 1.0, desc: "Unwashed fleece from shearing." },
    "Livestock (sheep)": { on: true, p: 0.8, desc: "Breeding ewes, rams, wethers for mutton." },
    "Lanolin": { on: false, p: 0.4, desc: "Wool fat for medicines and waterproofing." }
  },
  "Salt works": {
    "Sea salt": { on: true, p: 1.0, desc: "Evaporated salt from coastal pans." },
    "Salt for preservation": { on: true, p: 0.9, desc: "Coarser salt for curing meat and fish." },
    "Salt (bulk trade)": { on: false, p: 0.5, desc: "Large-volume salt for merchants." }
  },
  "Pawnbroker": {
    "Loans (secured)": { on: true, p: 1.0, desc: "Short-term loans against pledged goods. High interest." },
    "Goods purchase": { on: true, p: 0.9, desc: "Buy almost anything. Price is low." },
    "Appraisal": { on: true, p: 0.7, desc: "Informal valuation before selling elsewhere." }
  },
  "Sawmill": {
    "Milled timber": { on: true, p: 1.0, desc: "Planks and beams to dimension." },
    "Sawing timber (custom)": { on: false, p: 0.7, desc: "Bring your own logs. Mill cuts to spec." },
    "Sawdust and offcuts": { on: false, p: 0.5, desc: "Cheap fuel and animal bedding." }
  },
  "Tannery": {
    "Tanned leather": { on: true, p: 1.0, desc: "Oak-bark tanned hides. Ready for the cobbler or saddler." },
    "Rawhide": { on: true, p: 0.7, desc: "Untanned hide for bindings and drums." },
    "Hide processing": { on: false, p: 0.6, desc: "Bring your own hide. Tannery processes it." }
  },
  "Fuller": {
    "Fulled cloth": { on: true, p: 1.0, desc: "Washed and thickened cloth. Felted and durable." },
    "Fulling (contract)": { on: false, p: 0.8, desc: "Bring woven cloth to be finished. Charged per yard." }
  },
  "Dyer": {
    "Dyed cloth": { on: true, p: 1.0, desc: "Coloured fabric. Madder red cheapest, indigo expensive." },
    "Custom dyeing": { on: false, p: 0.7, desc: "Dye cloth to specification." },
    "Dye materials": { on: false, p: 0.5, desc: "Raw dyes — mordants, plant matter, mineral pigments." }
  },
  "Potter": {
    "Pottery and ceramics": { on: true, p: 1.0, desc: "Plates, jugs, storage crocks. Functional and cheap." },
    "Fired brick": { on: true, p: 0.5, desc: "Kiln-fired clay bricks for construction." },
    "Custom pottery": { on: false, p: 0.6, desc: "Commissions accepted." }
  },
  "Brickmaker": {
    "Fired brick": { on: true, p: 1.0, desc: "Standard-size fired clay bricks by the cartload." },
    "Roof tiles": { on: true, p: 0.8, desc: "Curved and flat clay tiles." },
    "Drainage pipe": { on: false, p: 0.4, desc: "Clay pipes for field drainage." }
  },
  "Brewer": {
    "Ale (jug)": { on: true, p: 1.0, desc: "Small batch ale sold by the jug." },
    "Ale (barrel)": { on: true, p: 0.9, desc: "Bulk supply to alehouses. Priced by barrel." },
    "Mead": { on: false, p: 0.4, desc: "Honey wine. Seasonal." }
  },
  "Stable master": {
    "Horse training": { on: true, p: 1.0, desc: "Saddle-breaking and basic training." },
    "Horse purchase": { on: true, p: 0.9, desc: "Riding and cart horses. Prices negotiable." },
    "Stabling (long-term)": { on: true, p: 0.8, desc: "Monthly stabling with exercise and grooming." },
    "Farriery": { on: true, p: 0.9, desc: "Shoeing, hoof care, lameness diagnosis." }
  },
  "Beekeeper": {
    "Honey": { on: true, p: 1.0, desc: "Raw honey by the jar. Seasonal." },
    "Beeswax": { on: true, p: 0.9, desc: "Refined wax for candles and seals." },
    "Mead (small batch)": { on: false, p: 0.5, desc: "Honey wine brewed in small batches." }
  },
  "Fishmonger": {
    "Fresh fish": { on: true, p: 1.0, desc: "Today's catch. Buy early." },
    "Salted fish": { on: true, p: 0.9, desc: "Salt-cured fish. Weeks of shelf life." },
    "Smoked fish": { on: false, p: 0.6, desc: "Cold-smoked. Longest shelf life, richest flavour." }
  },
  "Cobbler": {
    "Boot repair": { on: true, p: 1.0, desc: "Re-sole, re-stitch, patch. Same-day for simple jobs." },
    "Shoes (standard)": { on: true, p: 0.9, desc: "Working shoes and boots. Durable construction." },
    "Custom boots": { on: false, p: 0.6, desc: "Measured and made to order." }
  },
  "Tailor": {
    "Garment repair": { on: true, p: 1.0, desc: "Mending, patching, letting-out." },
    "Working clothes": { on: true, p: 0.9, desc: "Practical tunics, breeches, smocks." },
    "Custom garments": { on: false, p: 0.6, desc: "Measured and cut to your cloth." }
  },
  "Wildfowler": {
    "Waterfowl": { on: true, p: 1.0, desc: "Ducks, geese, and pigeons — fresh or dressed." },
    "Feathers": { on: false, p: 0.5, desc: "Down and quill feathers for bedding and fletching." },
    "Wildfowling hire": { on: false, p: 0.5, desc: "Guide and trained birds for a day's fowling." }
  },
  "Woodcarver": {
    "Carved goods": { on: true, p: 1.0, desc: "Spoons, bowls, handles, toys — functional items." },
    "Religious carvings": { on: true, p: 0.8, desc: "Crucifixes, reliquaries, saints' images." },
    "Custom carving": { on: false, p: 0.5, desc: "Decorative commissions — furniture inlays, structural details." }
  },
  "Fish market": {
    "Fresh fish": { on: true, p: 1.0, desc: "Morning auction of the catch. First come, best choice." },
    "Fish prices (market rate)": { on: true, p: 0.9, desc: "Day's price posted at the stall." }
  },
  "Toll bridge": {
    "River crossing": { on: true, p: 1.0, desc: "Foot and livestock crossing. Charged per head or per cart." },
    "Boat hire": { on: false, p: 0.4, desc: "Skiff for crossing goods that can't walk." }
  },
  "Waystation": {
    "Overnight stabling": { on: true, p: 1.0, desc: "Secure enclosure for pack animals. Feed included." },
    "Basic provisions": { on: true, p: 0.9, desc: "Grain, hay, hardtack, water. Caravan pricing." },
    "Way-bill registration": { on: false, p: 0.6, desc: "Record cargo manifest for customs." }
  },
  "Village musician": {
    "Performances (events)": { on: true, p: 1.0, desc: "Weddings, festivals, funerals. Book in advance." },
    "Music lessons": { on: false, p: 0.4, desc: "Basic instruction on fiddle, pipe, or drum." }
  },
  "Midwife": {
    "Birth assistance": { on: true, p: 1.0, desc: "Experienced midwifery. Available day and night." },
    "Basic wound care": { on: true, p: 0.9, desc: "Clean wounds, set minor fractures, reduce fever." },
    "Herbal remedies": { on: true, p: 0.8, desc: "Tinctures and poultices for common ailments." },
    "Discreet services": { on: false, p: 0.5, desc: "Treatments she does not discuss publicly." }
  },
  "Village scribe": {
    "Letter writing": { on: true, p: 1.0, desc: "Dictate, she writes. Simple correspondence and contracts." },
    "Document copying": { on: true, p: 0.9, desc: "Copy deeds, charters, and texts." },
    "Reading aloud": { on: true, p: 0.8, desc: "Read official documents to the illiterate." },
    "Simple contract drafting": { on: false, p: 0.5, desc: "Basic legal agreements. Not a lawyer." }
  },
  "Smelter": {
    "Refined iron ingots": { on: true, p: 1.0, desc: "Smelted iron ready for the smith. Priced by the pound." },
    "Cast iron goods": { on: true, p: 0.7, desc: "Pots, hinges, brackets — direct-cast items." },
    "Pig iron": { on: false, p: 0.5, desc: "Crude smelted iron for further processing." },
    "Smelting contract": { on: false, p: 0.4, desc: "Bring your ore, we smelt it." }
  },
  "Brewery": {
    "Ale (barrel)": { on: true, p: 1.0, desc: "Commercial ale in standard barrel." },
    "Beer (barrel)": { on: true, p: 0.8, desc: "Hopped beer — cleaner, better preserved than ale." },
    "Ale (wholesale)": { on: true, p: 0.7, desc: "Volume pricing for innkeepers and merchants." },
    "Malt (surplus)": { on: false, p: 0.4, desc: "Excess malt sold when brewing ahead of schedule." }
  },
  "Tanner (established)": {
    "Quality leather": { on: true, p: 1.0, desc: "Full-grain tanned leather for armour and fine goods." },
    "Saddlery leather": { on: true, p: 0.9, desc: "Heavy leather for saddles and harness." },
    "Leather armour": { on: false, p: 0.5, desc: "Boiled and shaped leather armour." }
  },
  "Cobbler's Guild": {
    "Standard boots": { on: true, p: 1.0, desc: "Guild-certified boots. Quality-marked, price-regulated." },
    "Military boots": { on: true, p: 0.8, desc: "Thick-soled marching boots." },
    "Custom footwear": { on: false, p: 0.7, desc: "Measured and made to specification." },
    "Shoe repair": { on: true, p: 0.9, desc: "Full guild workshop — any repair." }
  },
  "Tailor's Guild": {
    "Livery and uniforms": { on: true, p: 1.0, desc: "House colours, guild uniforms, city watch livery." },
    "Fine garments": { on: true, p: 0.9, desc: "Quality cloth, expert cut." },
    "Working clothes (bulk)": { on: true, p: 0.8, desc: "Practical clothing for soldiers and servants." },
    "Tailoring (bespoke)": { on: false, p: 0.6, desc: "Full commission from cloth to delivery." }
  },
  "Chandler": {
    "Tallow candles": { on: true, p: 1.0, desc: "Standard household candles." },
    "Beeswax candles": { on: true, p: 0.8, desc: "Premium candles — cleaner burn, better light." },
    "Soap": { on: true, p: 0.9, desc: "Lye and tallow soap." },
    "Rope": { on: true, p: 0.7, desc: "Hemp rope in standard lengths." }
  },
  "Glassblower": {
    "Glass vessels": { on: true, p: 1.0, desc: "Bottles, flasks, and cups." },
    "Window glass": { on: true, p: 0.8, desc: "Small panes for shuttered windows." },
    "Custom glasswork": { on: false, p: 0.5, desc: "Lens grinding, decorative and coloured glass." }
  },
  "Mint": {
    "Coin exchange": { on: true, p: 1.0, desc: "Convert bullion to coin. Seigniorage fee charged." },
    "Assay (informal)": { on: true, p: 0.8, desc: "Test metal purity before coining." },
    "Coin blank purchase": { on: false, p: 0.3, desc: "Unstruck blanks for authorised purchasers only." }
  },
  "Town crier": {
    "Public announcements": { on: true, p: 1.0, desc: "Hear ye. Official proclamations and market prices." },
    "Message delivery": { on: true, p: 0.8, desc: "Carry a message across town." },
    "Advertisement (shouted)": { on: false, p: 0.5, desc: "Pay the crier to mention your business." }
  },
  "Ropemaker": {
    "Rope (standard)": { on: true, p: 1.0, desc: "Hemp rope in coils. Standard gauges stocked." },
    "Cordage (specialty)": { on: true, p: 0.8, desc: "Rigging rope, trace rope, bow strings." },
    "Rope repair": { on: false, p: 0.5, desc: "Splice and re-lay worn rope." }
  },
  "Assay office": {
    "Metal purity testing": { on: true, p: 1.0, desc: "Acid and fire assay. Certificate issued." },
    "Gem appraisal": { on: true, p: 0.8, desc: "Weight, clarity, and cut assessment." },
    "Certification": { on: false, p: 0.6, desc: "Official stamp on tested metal." }
  },
  "Customs house": {
    "Customs clearance": { on: true, p: 1.0, desc: "Register goods. Pay duty. Collect certificate." },
    "Import/export permits": { on: true, p: 0.9, desc: "Licensed trade in controlled goods." },
    "Contraband search": { on: false, p: 0.5, desc: "Thorough inspection — or avoided, for a fee." }
  },
  "Post relay station": {
    "Message relay": { on: true, p: 1.0, desc: "Letters relayed between stations at horse-speed." },
    "Post horse hire": { on: true, p: 0.9, desc: "Fresh horse at each station." },
    "Secure dispatch": { on: false, p: 0.5, desc: "Sealed and bonded courier. Signed receipt at destination." }
  },
  "Stable district": {
    "Horse purchase": { on: true, p: 1.0, desc: "Wide selection — riding, war, cart, palfreys." },
    "Mount hire (daily)": { on: true, p: 0.9, desc: "Ride out in the morning, return by evening." },
    "Cavalry training": { on: false, p: 0.5, desc: "Military horsemanship for soldiers and nobles." },
    "Stabling (long-term)": { on: true, p: 0.8, desc: "Monthly stable, feed, and groom." }
  },
  "Caravaneer's Post": {
    "Caravan assembly": { on: true, p: 1.0, desc: "Register to join an outgoing caravan." },
    "Route intelligence": { on: true, p: 0.9, desc: "Road conditions, bandit reports, toll schedules." },
    "Guard hire (caravan)": { on: true, p: 0.8, desc: "Hire armed escort for the route." },
    "Way-bill services": { on: false, p: 0.6, desc: "Cargo manifest and bonded documentation." }
  },
  "Jeweller": {
    "Jewellery purchase": { on: true, p: 1.0, desc: "Rings, necklaces, brooches — precious metalwork." },
    "Custom commission": { on: true, p: 0.8, desc: "Design your own piece." },
    "Gem purchase": { on: true, p: 0.7, desc: "Cut and uncut gemstones." },
    "Jewellery appraisal": { on: true, p: 0.9, desc: "Valuation for insurance, sale, or inheritance." },
    "Discreet purchase": { on: false, p: 0.4, desc: "No questions about provenance." }
  },
  "Vintner": {
    "Table wine": { on: true, p: 1.0, desc: "House wine by the jug or bottle." },
    "Aged wine": { on: false, p: 0.5, desc: "Cellar stock. Significantly more expensive." },
    "Wine wholesale": { on: true, p: 0.8, desc: "Supply to taverns and inns. Contract pricing." },
    "Wine appraisal": { on: false, p: 0.4, desc: "Identify vintage and origin." }
  },
  "Gladiatorial school": {
    "Combat training": { on: true, p: 1.0, desc: "Sword, shield, and net from former fighters." },
    "Exhibition bouts": { on: true, p: 0.8, desc: "Demonstration fights at markets and festivals." },
    "Fighter hire": { on: false, p: 0.5, desc: "Hire trained fighters for security or entertainment." }
  },
  "Hired blades": {
    "Bodyguard hire": { on: true, p: 1.0, desc: "Personal protection. Daily or weekly rate." },
    "Debt enforcement": { on: true, p: 0.8, desc: "Collect what is owed. Persuasion first." },
    "Private contract work": { on: false, p: 0.5, desc: "Ask carefully. Answer varies by job." }
  },
  "Mint (official)": {
    "Coin minting": { on: true, p: 1.0, desc: "Official coinage. Certified weight and purity." },
    "Bullion exchange": { on: true, p: 0.9, desc: "Convert gold and silver to standard coin." },
    "Assay certification": { on: true, p: 0.8, desc: "Official purity certificate for banking." }
  },
  "Auction house": {
    "Auction services": { on: true, p: 1.0, desc: "Consign goods for public auction. Buyer's and seller's premium." },
    "Estate sales": { on: true, p: 0.8, desc: "Liquidate a deceased's estate." },
    "Private treaty sales": { on: false, p: 0.6, desc: "Negotiate a sale confidentially." },
    "Slave auction": { on: false, p: 0.5, desc: "Auction of enslaved persons. Legally licensed where applicable." }
  },
  "Harbour Master's Office": {
    "Berth assignment": { on: true, p: 1.0, desc: "Register vessel and be assigned a berth." },
    "Pilotage": { on: true, p: 0.9, desc: "Pilot to guide through harbour approaches." },
    "Maritime clearance": { on: true, p: 0.9, desc: "Departure clearance — duty paid, manifest checked." },
    "Ship chandlery": { on: false, p: 0.6, desc: "Rope, pitch, sailcloth, provisions at the quayside." }
  },
  "Furrier's District": {
    "Quality furs": { on: true, p: 1.0, desc: "Processed and dressed furs — ermine, marten, fox, beaver." },
    "Fur garments": { on: true, p: 0.9, desc: "Fur-lined cloaks, hats, gloves." },
    "Raw pelts (bulk)": { on: false, p: 0.5, desc: "Unprocessed pelts for merchant resale." }
  },
  "Contract killer": {
    "Contract killing": { on: false, p: 0.9, desc: "Target, method, and timing negotiated. No receipts." },
    "Disappearance services": { on: false, p: 0.6, desc: "Make someone vanish without a body." }
  },
  "Grove Shrine": {
    "Nature blessing": { on: true, p: 1.0, desc: "Blessings for crops, livestock, safe journeys." },
    "Herbal medicines": { on: true, p: 0.8, desc: "Remedies from the grove's plants." },
    "Weather reading": { on: false, p: 0.6, desc: "Read signs for planting, harvest, and travel." }
  },
  "Druid Circle": {
    "Nature magic services": { on: true, p: 1.0, desc: "Speak with Animals, Detect Poison, Purify Food, Pass Without Trace." },
    "Seasonal rituals": { on: true, p: 0.9, desc: "Solstice and equinox ceremonies." },
    "Wilderness guidance": { on: true, p: 0.8, desc: "Route guidance through dangerous wilderness." },
    "Healing (nature)": { on: false, p: 0.6, desc: "Cure Wounds, Lesser Restoration. Slower than divine." },
    "Weather forecasting": { on: false, p: 0.7, desc: "Accurate short-term weather prediction." }
  },
  "Warden's Lodge": {
    "Wilderness scouting": { on: true, p: 1.0, desc: "Track, map, and surveil the surrounding territory." },
    "Monster threat assessment": { on: true, p: 0.9, desc: "Current threat map for surrounding wilderness." },
    "Hunting guide hire": { on: true, p: 0.8, desc: "Expert tracker. Knows the best ground and seasons." },
    "Trail maintenance": { on: false, p: 0.5, desc: "Cleared and marked trails in lodge territory." }
  },
  "Elder Grove Council": {
    "Nature arbitration": { on: true, p: 1.0, desc: "Mediate disputes — logging rights, water access, beast encroachment." },
    "Druidic consultation": { on: true, p: 0.9, desc: "Advise city authorities on ecological matters." },
    "High-level nature magic": { on: false, p: 0.6, desc: "Commune with Nature, Control Weather, Awaken." },
    "Urban grove access": { on: false, p: 0.5, desc: "Permission to use the hidden urban grove." }
  }

,
  "Almshouse": {
    "Poor relief": { on: true, p: 1.0, desc: "Food, shelter, and basic care for the destitute poor and aged." },
    "Charitable giving": { on: true, p: 0.8, desc: "Accept and distribute donations. Tax-advantageous for wealthy donors." },
    "Burial of the poor": { on: false, p: 0.6, desc: "Dignified interment for those who cannot afford a funeral." }
  },
  "Public bathhouse": {
    "Bathing": { on: true, p: 1.0, desc: "Hot water, soap, and a scraping stone. Pay by the hour or the day." },
    "Barber services": { on: true, p: 0.8, desc: "Shave, haircut, minor tooth-pulling, and bloodletting. All one trade." },
    "Rumour and news": { on: true, p: 0.9, desc: "The bathhouse hears everything. An hour with a garrulous bather is worth a week of asking around." },
    "Companionship services": { on: false, p: 0.5, desc: "The line between bathhouse and brothel blurs in some quarters." }
  },
  "Foundling home": {
    "Child placement": { on: true, p: 1.0, desc: "Place abandoned infants and children with approved families or institutions." },
    "Anonymous deposit": { on: true, p: 0.9, desc: "The wheel in the wall. No questions asked. Child received, recorded, cared for." },
    "Apprenticeship placement": { on: false, p: 0.5, desc: "Place older children with tradespeople. Provides training; reduces costs for the home." }
  },
  "Workhouse": {
    "Textile labour": { on: true, p: 1.0, desc: "Processed textiles from compulsory pauper labour. Cheaper than guild rates." },
    "Vagrancy enforcement": { on: true, p: 0.8, desc: "Remove vagrants from the streets. Resident in exchange for work." },
    "Poor assessment": { on: false, p: 0.5, desc: "Determine who qualifies for outdoor relief versus indoor confinement." }
  },
  // ── Newly visible institutions (catalog fix v211) ───────────────────────

  "Slave market": {
    "Slave auction": { on: true,  p: 1.0, desc: "Public auction of enslaved persons. War captives, debtors, convicted criminals." },
    "Appraisal": { on: true, p: 0.9, desc: "Assessment of a slave's skills, health, and market value before sale." },
    "Labor placement": { on: false, p: 0.6, desc: "Match buyers with suitable enslaved workers for specific trades or households." },
    "Restraint equipment": { on: false, p: 0.4, desc: "Sale of chains, manacles, and handling equipment." }
  },

  "Weekly market": {
    "General trade": { on: true,  p: 1.0, desc: "Agricultural produce, household goods, livestock. The economic heartbeat of the week." },
    "Tax collection": { on: true, p: 0.9, desc: "Toll collected on goods sold. A percentage to the lord or municipality." },
    "Price reporting": { on: false, p: 0.6, desc: "Written record of prevailing prices sent to larger markets and guild registers." }
  },

  "Customs house": {
    "Duties and tariffs": { on: true,  p: 1.0, desc: "Assessment and collection of import and export duties on all goods." },
    "Cargo inspection": { on: true, p: 0.9, desc: "Check manifests against actual goods. Flag contraband and undervalued shipments." },
    "Import permits": { on: false, p: 0.7, desc: "Issue permits required to bring restricted goods — spices, weapons, exotic animals — into the settlement." },
    "Smuggling investigation": { on: false, p: 0.5, desc: "Investigate suspected evasion of duties. Informants and rewards involved." }
  },

  "Assay office": {
    "Metal purity testing": { on: true,  p: 1.0, desc: "Determine the exact silver or gold content of coins, ingots, and jewellery." },
    "Hallmarking": { on: true, p: 0.9, desc: "Stamp certified purity marks on tested metals. Legally required for trade in many places." },
    "Coin assessment": { on: false, p: 0.7, desc: "Detect clipped, forged, or debased coinage. Vital for large transactions." }
  },

  "Coaching inn": {
    "Lodging": { on: true,  p: 1.0, desc: "Beds, meals, and stabling for travelers on the road. Priced by quality." },
    "Horse change": { on: true, p: 0.9, desc: "Fresh relay horses for coaches and dispatch riders. Reduces travel time significantly." },
    "Parcel forwarding": { on: false, p: 0.6, desc: "Accept and forward parcels and letters along the coaching route." },
    "Route information": { on: false, p: 0.5, desc: "Conditions of the road ahead, bandit reports, river crossings." }
  },

  "Merchant guilds (3-8)": {
    "Trade brokerage": { on: true,  p: 1.0, desc: "Facilitate large commercial transactions between distant parties." },
    "Credit letters": { on: true, p: 0.8, desc: "Issue letters of credit honored at affiliated guilds in other cities." },
    "Guild arbitration": { on: false, p: 0.6, desc: "Settle disputes between merchants. Binding decision from guild council." },
    "Market intelligence": { on: false, p: 0.5, desc: "Price reports from distant markets. Useful for timing purchases and sales." }
  },

  "Merchant guilds (15-40)": {
    "Trade brokerage": { on: true,  p: 1.0, desc: "Large-scale commercial facilitation across regional markets." },
    "Credit letters": { on: true, p: 0.9, desc: "Issue letters of credit honored across the entire trade network." },
    "Investment pooling": { on: true, p: 0.8, desc: "Pool capital from multiple guild members to finance large ventures." },
    "Caravan organization": { on: false, p: 0.7, desc: "Organize and insure shared merchant caravans for long-distance trade." },
    "Guild arbitration": { on: false, p: 0.6, desc: "Binding dispute resolution with teeth — guild membership at stake." }
  },

  "Blacksmiths (3-10)": {
    "Tool manufacture": { on: true,  p: 1.0, desc: "Axes, ploughs, hinges, nails. The foundation of agricultural and construction work." },
    "Weapon smithing": { on: true, p: 0.8, desc: "Swords, spearheads, daggers. Military-grade work requires a skilled smith." },
    "Horseshoeing": { on: true, p: 0.9, desc: "Essential service for any settlement with working horses. Routine maintenance." },
    "Repairs": { on: true, p: 1.0, desc: "Reforge broken tools, re-edge blades, mend ironwork. Often more valuable than new." },
    "Commission work": { on: false, p: 0.5, desc: "Custom metalwork to specification. Locks, mechanisms, custom fittings." }
  },

  "Butchers (3-8)": {
    "Fresh meat": { on: true,  p: 1.0, desc: "Beef, pork, mutton. Slaughtered and dressed on premises or nearby." },
    "Offal and by-products": { on: true, p: 0.8, desc: "Tripe, tallow, bone, hide. Nothing wasted. By-products sold to chandlers and tanners." },
    "Salting and preservation": { on: false, p: 0.6, desc: "Salt-cure meat for storage and travel. Essential before winter." },
    "Sausage and charcuterie": { on: false, p: 0.5, desc: "Processed meat products. Use lesser cuts and offal. Profitable margins." }
  },

  "Docks/port facilities": {
    "Cargo loading and unloading": { on: true, p: 1.0, desc: "Longshoremen and crane equipment for shifting goods between ship and shore." },
    "Vessel mooring": { on: true, p: 1.0, desc: "Berth assignment and dock fees. Main revenue of port administration." },
    "Cargo storage": { on: true, p: 0.8, desc: "Short-term warehousing on the dockside while goods await customs clearance." },
    "Ship chandlery": { on: false, p: 0.6, desc: "Provision ships with food, rope, tar, and consumables for the next voyage." }
  },

  "Shipyard": {
    "Ship construction": { on: true, p: 1.0, desc: "Build ocean-going vessels from keel up. Months of skilled labor and materials." },
    "Repair and refit": { on: true, p: 0.9, desc: "Hull repairs, caulking, mast replacement. Cheaper than new and often urgent." },
    "Dry dock": { on: false, p: 0.7, desc: "Haul vessels out of water for hull inspection and below-waterline repairs." }
  },

  "River boatyard": {
    "Barge construction": { on: true, p: 1.0, desc: "Flat-bottomed cargo barges for river transport. Simpler than sea vessels." },
    "Boat repair": { on: true, p: 0.9, desc: "Hull patching, oar replacement, caulking. River traffic takes constant punishment." },
    "Ferry service": { on: false, p: 0.6, desc: "Regular crossing service for foot traffic and small goods." }
  },

  "Stable district": {
    "Horse hire": { on: true, p: 1.0, desc: "Rent horses for single journeys or extended travel. Quality varies by price." },
    "Livery and boarding": { on: true, p: 0.9, desc: "Board privately owned horses. Feed, care, and exercise included." },
    "Horse trading": { on: false, p: 0.6, desc: "Buy and sell horses. Warhorses, draft animals, and palfreys all command different prices." },
    "Carriage hire": { on: false, p: 0.5, desc: "Hire coaches and drivers for urban transport or longer journeys." }
  },

  "Post relay station": {
    "Message relay": { on: true, p: 1.0, desc: "Pass dispatches and letters along the relay chain. Fresh horses at each station." },
    "Parcel forwarding": { on: true, p: 0.8, desc: "Small parcels transported between relay points. Slower than messages, cheaper than couriers." },
    "Emergency dispatch": { on: false, p: 0.5, desc: "Priority riders for urgent military or government communications. High cost." }
  },

  "Caravaneer's post": {
    "Caravan assembly": { on: true, p: 1.0, desc: "Organize merchants with compatible routes into shared caravans for safety and economy." },
    "Guide hire": { on: true, p: 0.9, desc: "Experienced pathfinders who know the roads, watering holes, and danger spots." },
    "Guard hire": { on: false, p: 0.7, desc: "Armed escorts for vulnerable goods. Rate varies with threat level and cargo value." }
  },

  "Mining settlement": {
    "Raw ore extraction": { on: true, p: 1.0, desc: "Extraction and basic sorting of raw ore from the seam. Volume determines value." },
    "Assay service": { on: false, p: 0.6, desc: "On-site testing of ore quality and vein richness. Crucial for investment decisions." }
  },

  "Smelter": {
    "Iron refining": { on: true,  p: 1.0, desc: "Smelt raw ore into pig iron and refined ingots ready for smithing." },
    "Alloy production": { on: false, p: 0.6, desc: "Produce bronze, brass, and steel through controlled alloying. Specialist knowledge." },
    "Slag disposal": { on: false, p: 0.4, desc: "Handle toxic slag byproduct. Irresponsible disposal causes downstream problems." }
  },

  "Mine (open cast)": {
    "Raw extraction": { on: true,  p: 1.0, desc: "Surface-level ore extraction. Lower yield than shaft mining but cheaper to operate." },
    "Labor hire": { on: false, p: 0.6, desc: "Hire out mine workers to other operations during off-season." }
  },

  "Salt works": {
    "Salt production": { on: true,  p: 1.0, desc: "Evaporation, boiling, or mining to produce raw salt. Essential preservative." },
    "Cured goods": { on: false, p: 0.5, desc: "Process fish and meat using produced salt. Vertical integration of the salt operation." }
  },

  "Stone quarry": {
    "Cut stone": { on: true,  p: 1.0, desc: "Dressed stone blocks for construction. Consistency and size matter for fortifications." },
    "Rubble and aggregate": { on: true,  p: 0.8, desc: "Rough stone for road beds and fill. Bulk sale, low value per unit." },
    "Millstone cutting": { on: false, p: 0.4, desc: "Specialized production of millstones. Rare skill; high unit value." }
  },

  "Fisher's landing": {
    "Fresh fish": { on: true,  p: 1.0, desc: "Daily catch sold dockside. Price and selection vary by season and weather." },
    "Dried and salted fish": { on: true,  p: 0.8, desc: "Preserved catch for inland trade and winter stores." },
    "Fishing equipment": { on: false, p: 0.4, desc: "Nets, lines, traps, and boat maintenance supplies." }
  },

  "Sawmill": {
    "Lumber milling": { on: true,  p: 1.0, desc: "Raw logs into planks and beams. Essential input for all construction." },
    "Custom dimensioning": { on: false, p: 0.6, desc: "Cut timber to specific dimensions for shipbuilding or complex construction." }
  },

  "Merchant warehouses": {
    "Goods storage": { on: true,  p: 1.0, desc: "Secure, dry storage for trade goods awaiting sale or onward shipment." },
    "Inventory management": { on: false, p: 0.6, desc: "Track stock, arrange inspection, prepare manifests for customs." }
  },

  "Brewery": {
    "Ale production": { on: true,  p: 1.0, desc: "Bulk ale for taverns and households. Staple beverage where water is unsafe." },
    "Seasonal specialties": { on: false, p: 0.4, desc: "Stronger or flavored brews for feast days and premium trade." }
  },
  // ── Complete service coverage pass ──────────────────────────────────────

  "Academy of magic": {
    "Arcane instruction": { on: true,  p: 1.0, desc: "Formal magical education. Foundational theory, component handling, safe casting." },
    "Spell research": { on: true, p: 0.8, desc: "Access to research facilities and experienced mages for collaborative spell development." },
    "Magical consultation": { on: false, p: 0.7, desc: "Expert opinion on magical phenomena, curses, items, and planar questions." },
    "Library access": { on: false, p: 0.6, desc: "Access to an extensive collection of arcane texts, grimoires, and magical records." },
    "Apprenticeship placement": { on: false, p: 0.5, desc: "Match promising students with master mages for extended mentorship." }
  },
  "Advanced water infrastructure": {
    "Clean water supply": { on: true,  p: 1.0, desc: "Reliable piped or channeled clean water throughout the settlement." },
    "Wastewater removal": { on: true, p: 0.9, desc: "Drainage and sewer systems reduce disease and improve sanitation." },
    "Fire suppression": { on: false, p: 0.5, desc: "Water pressure sufficient for firefighting through cisterns and standpipes." }
  },
  "Adventurers' charter hall": {
    "Quest board": { on: true,  p: 1.0, desc: "Posted bounties, missing persons, monster extermination contracts, and exploration commissions." },
    "Contract registration": { on: true, p: 0.9, desc: "Legally binding adventuring contracts. Protects client and party." },
    "Party licensing": { on: false, p: 0.7, desc: "Register a party for liability purposes. Required before some contracts." },
    "Bounty claims": { on: false, p: 0.7, desc: "Submit proof of completion and collect bounty payment." },
    "Equipment storage": { on: false, p: 0.4, desc: "Secure storage for large or hazardous adventuring gear between contracts." }
  },
  "Airship docking (high magic)": {
    "Airship berths": { on: true,  p: 1.0, desc: "Mooring masts, lift-gas refills, and hull maintenance for flying vessels." },
    "Cargo loading": { on: true, p: 0.9, desc: "Crane and winch equipment for loading and unloading airship cargo." },
    "Passenger boarding": { on: true, p: 0.8, desc: "Ticketed passenger service on scheduled and charter airship routes." },
    "Weather and wind consulting": { on: false, p: 0.6, desc: "Specialized weather magic and wind chart services for safe routing." }
  },
  "Alchemist quarter": {
    "Alchemical components": { on: true,  p: 1.0, desc: "Bulk supply of rare and common alchemical ingredients." },
    "Potion production": { on: true, p: 0.9, desc: "District-scale potion output. Volume discounts for bulk orders." },
    "Experimental commissions": { on: false, p: 0.5, desc: "Hire alchemists for novel compound development. Results not guaranteed." },
    "Hazardous material disposal": { on: false, p: 0.4, desc: "Safe disposal of unstable, toxic, or explosive alchemical byproducts." }
  },
  "Alchemist shop": {
    "Potion brewing": { on: true,  p: 1.0, desc: "Healing potions, antidotes, and alchemical compounds on request." },
    "Component identification": { on: true, p: 0.8, desc: "Identify unknown substances, reagents, and monster byproducts." },
    "Ingredient sourcing": { on: false, p: 0.6, desc: "Locate and procure rare components for complex formulae." },
    "Experimental compounds": { on: false, p: 0.4, desc: "Cutting-edge or dangerous work. May require advance deposit." }
  },
  "Ale house": {
    "Drink service": { on: true,  p: 1.0, desc: "Ale, cider, and common spirits. Often home-brewed. Cheap." },
    "Basic food": { on: true, p: 0.7, desc: "Pottage, bread, and whatever was leftover from the household pot." },
    "Local gossip": { on: false, p: 0.9, desc: "Everyone talks here. Information flows freely with the ale." },
    "Dice games": { on: false, p: 0.5, desc: "Informal gambling. Stakes are low, disputes are loud." }
  },
  "Annual fair": {
    "Seasonal trading": { on: true,  p: 1.0, desc: "Once-a-year market drawing merchants from across the region." },
    "Livestock auction": { on: true, p: 0.9, desc: "Major livestock sales. Breeding stock, draft animals, slaughter cattle." },
    "Entertainment": { on: true, p: 0.8, desc: "Performers, contests, games, and spectacle. The social event of the year." },
    "Exotic goods": { on: false, p: 0.6, desc: "Merchants bring unusual imports unavailable at regular markets." },
    "Hiring day": { on: false, p: 0.5, desc: "Seasonal laborers and servants present themselves for hire." }
  },
  "Apothecary (established)": {
    "Herbal remedies": { on: true,  p: 1.0, desc: "Tinctures, poultices, and dried herbs for common ailments." },
    "Medicines and compounds": { on: true, p: 0.9, desc: "Prepared medicines for fever, pain, infection, and chronic conditions." },
    "Consultation": { on: false, p: 0.7, desc: "Diagnosis and treatment advice. Not a physician but often the closest thing available." },
    "Poison antidotes": { on: false, p: 0.4, desc: "Prepared antidotes for known poisons. Kept discreetly." }
  },
  "Apothecary district": {
    "Herbal remedies": { on: true,  p: 1.0, desc: "Wholesale and retail herbs, tinctures, and prepared medicines." },
    "Specialist compounds": { on: true, p: 0.8, desc: "Rare medications and treatments available through district-wide sourcing." },
    "Medical consultation": { on: false, p: 0.6, desc: "Multiple qualified apothecaries offering second opinions and specialist advice." }
  },
  "Aqueduct or water system": {
    "Clean water distribution": { on: true,  p: 1.0, desc: "Reliable clean water delivered throughout the settlement via channels and pipes." },
    "Mill power": { on: false, p: 0.5, desc: "Water flow diverted to power mills and workshops." }
  },
  "Assassins' guild": {
    "Assassination contracts": { on: true,  p: 1.0, desc: "Discreet elimination of targets. Staged as accidents when possible." },
    "Infiltration": { on: false, p: 0.7, desc: "Place an agent inside a household, organisation, or court." },
    "Intelligence gathering": { on: false, p: 0.6, desc: "Surveillance and information extraction from targets." },
    "Witness removal": { on: false, p: 0.5, desc: "Ensure testimony never reaches the magistrate." }
  },
  "Bandit affiliate": {
    "Protection racket": { on: true,  p: 0.9, desc: "Pay or have accidents. Simple arrangement." },
    "Contraband fencing": { on: false, p: 0.7, desc: "Move stolen goods with no questions asked." },
    "Road intelligence": { on: false, p: 0.5, desc: "Know which caravans are carrying what and when. Sellable information." }
  },
  "Banking district": {
    "Large loans": { on: true,  p: 1.0, desc: "Capital loans for major ventures, construction, and war financing." },
    "Currency exchange": { on: true, p: 1.0, desc: "Exchange foreign coinage and bullion at posted rates." },
    "Letters of credit": { on: true, p: 0.9, desc: "Internationally accepted letters allowing funds to be drawn at distant branches." },
    "Safe deposit": { on: false, p: 0.7, desc: "Secure storage for valuables, documents, and sensitive materials." },
    "Investment brokering": { on: false, p: 0.6, desc: "Connect investors with ventures seeking capital." }
  },
  "Banking houses": {
    "Deposit accounts": { on: true,  p: 1.0, desc: "Secure holding of funds. Earns interest or charged for safety." },
    "Commercial loans": { on: true, p: 0.9, desc: "Business financing with assessed interest rates based on risk." },
    "Currency exchange": { on: true, p: 0.8, desc: "Convert foreign coinage and bullion." },
    "Letters of credit": { on: false, p: 0.7, desc: "Portable proof of creditworthiness accepted by partner institutions." }
  },
  "Bardic college": {
    "Musical training": { on: true,  p: 1.0, desc: "Instrument tuition, vocal training, and music theory." },
    "Performance": { on: true, p: 0.9, desc: "Concerts, recitals, and formal entertainments for patrons." },
    "Historical research": { on: false, p: 0.6, desc: "Access to oral histories, genealogical records, and regional lore." },
    "Composition commission": { on: false, p: 0.5, desc: "Commission an original work — ballad, epic, elegy, or ceremonial piece." },
    "Rumour collection": { on: false, p: 0.7, desc: "Bards travel everywhere and hear everything. Useful for intelligence." }
  },
  "Barge and river transport company": {
    "Cargo freight": { on: true,  p: 1.0, desc: "Bulk cargo transport along navigable rivers. Grain, stone, timber, goods." },
    "Passenger transport": { on: true, p: 0.8, desc: "Scheduled passenger barges between river settlements." },
    "River piloting": { on: false, p: 0.7, desc: "Experienced pilots for hazardous stretches of river." },
    "Freight insurance": { on: false, p: 0.5, desc: "Cover against loss by flood, theft, or accident." }
  },
  "Beast trainers": {
    "Animal training": { on: true,  p: 1.0, desc: "Train animals for specific purposes — guard, hunt, war, labour, entertainment." },
    "Exotic animal sales": { on: true, p: 0.7, desc: "Unusual animals sourced from distant regions. Status symbols and curiosities." },
    "Veterinary care": { on: true, p: 0.8, desc: "Treatment of animal illness and injury." },
    "Beast acquisition": { on: false, p: 0.5, desc: "Commission sourcing of specific animals from remote suppliers." }
  },
  "Black market": {
    "Contraband goods": { on: true,  p: 1.0, desc: "Restricted, stolen, or untaxed goods. Price reflects the risk." },
    "No-questions sales": { on: true, p: 0.9, desc: "Buy and sell without provenance checks or paperwork." },
    "Underground connections": { on: false, p: 0.7, desc: "Introduction to criminal specialists, smugglers, and black market suppliers." }
  },
  "Black market bazaar": {
    "Contraband goods": { on: true,  p: 1.0, desc: "Large-scale illicit market. Greater selection, greater risk of attention." },
    "Stolen goods": { on: true, p: 0.9, desc: "Fenced items from across the region. Recognizable pieces a risk to buyers." },
    "Illicit services": { on: false, p: 0.7, desc: "Not just goods — services that cannot be advertised in the open market." },
    "Information brokerage": { on: false, p: 0.5, desc: "People know things here that they won't say elsewhere." }
  },
  "Bowyer & fletcher": {
    "Bow crafting": { on: true,  p: 1.0, desc: "Short bows, longbows, and hunting bows to commission or stock." },
    "Arrow and bolt production": { on: true, p: 0.9, desc: "Matched arrows with correct spine and fletching. Bulk orders for militia." },
    "Bow maintenance": { on: true, p: 0.8, desc: "Re-string, limb repair, and re-finishing to keep bows functional." },
    "Custom orders": { on: false, p: 0.4, desc: "Bespoke work for hunters and military officers. Longer wait, higher cost." }
  },
  "Bowyers & fletchers (guild)": {
    "Military supply": { on: true,  p: 1.0, desc: "Contract supply of bows and arrows to garrison and militia. Volume pricing." },
    "Quality bows": { on: true, p: 0.9, desc: "Guild-certified bows meeting standardized draw weights and lengths." },
    "Arrow production": { on: true, p: 0.9, desc: "Consistent, high-volume arrow production for military and hunting." },
    "Apprenticeship": { on: false, p: 0.5, desc: "Formal training in bow-making and fletching craft." }
  },
  "Brothel (red light district)": {
    "Companionship": { on: true,  p: 1.0, desc: "Paid companionship. Rates and quality vary considerably." },
    "Private rooms": { on: true, p: 0.9, desc: "Secure, discreet rooms for meetings that cannot occur elsewhere." },
    "Information": { on: false, p: 0.7, desc: "Clients talk. Workers listen. A good madam knows everyone's secrets." }
  },
  "Caravan masters' exchange": {
    "Caravan organization": { on: true,  p: 1.0, desc: "Assemble merchants with compatible routes into shared caravans for safety and economy." },
    "Route planning": { on: true, p: 0.9, desc: "Experienced route planners select roads based on threat, season, and cargo type." },
    "Caravan insurance": { on: false, p: 0.6, desc: "Cover against bandit attack, weather loss, and contract default." },
    "Merchant networking": { on: false, p: 0.5, desc: "Connect merchants with complementary goods for mutually beneficial arrangements." }
  },
  "Carpenter (part-time)": {
    "Basic repairs": { on: true,  p: 1.0, desc: "Fix broken furniture, doors, wagons, and farm equipment." },
    "Simple construction": { on: true, p: 0.8, desc: "Sheds, fences, and basic structures. Not fine work." }
  },
  "Carpenters (5-15)": {
    "Furniture making": { on: true,  p: 1.0, desc: "Tables, chairs, chests, beds, and cabinetry for household and commercial use." },
    "Building construction": { on: true, p: 0.9, desc: "Framing, roofing, flooring, and internal fitting-out of structures." },
    "Wagon and cart work": { on: true, p: 0.8, desc: "Build and repair wagons, carts, and barrows." },
    "Custom commissions": { on: false, p: 0.5, desc: "Decorative or specialist work for wealthier clients." }
  },
  "Carriers' guild": {
    "Freight haulage": { on: true,  p: 1.0, desc: "Organised road transport for goods between towns. Reliable, guild-backed." },
    "Delivery contracts": { on: true, p: 0.9, desc: "Scheduled delivery runs on established routes." },
    "Porterage": { on: false, p: 0.6, desc: "Short-distance carrying within a town or at a port." },
    "Cargo storage": { on: false, p: 0.5, desc: "Temporary warehousing while goods await onward transport." }
  },
  "Carriers' hiring hall": {
    "Driver hire": { on: true,  p: 1.0, desc: "Hire experienced cart drivers and teamsters for single journeys." },
    "Pack animal hire": { on: true, p: 0.9, desc: "Mules, donkeys, and oxen for hire with or without handler." },
    "Labour hire": { on: false, p: 0.7, desc: "Manual freight handlers for loading and unloading." }
  },
  "Cartographer's guild": {
    "Commissioned maps": { on: true,  p: 1.0, desc: "Accurate maps of regions, trade routes, coastlines, and interiors." },
    "Survey expeditions": { on: true, p: 0.7, desc: "Send guild surveyors to map unknown or poorly-documented regions." },
    "Sea charts": { on: false, p: 0.6, desc: "Navigational charts with soundings, hazards, and port approaches." },
    "Map archive access": { on: false, p: 0.5, desc: "Search the guild's archive of historical and regional maps." }
  },
  "Cartographer's workshop": {
    "Map making": { on: true,  p: 1.0, desc: "Custom maps to order. Accurate, legible, and durably produced." },
    "Copying and reproduction": { on: true, p: 0.8, desc: "Copy existing maps for distribution or client records." },
    "Route consultation": { on: false, p: 0.5, desc: "Advice on the best routes based on available map data." }
  },
  "Cathedral (10,000+ only)": {
    "Major religious services": { on: true,  p: 1.0, desc: "High mass, feast day observances, and sacraments for the entire diocese." },
    "Pilgrimage destination": { on: true, p: 0.9, desc: "Attracts pilgrims from across the region. Economic and spiritual significance." },
    "Dispensations and annulments": { on: false, p: 0.5, desc: "Church rulings on marriages, vows, and religious obligations. Often requires payment." },
    "Sanctuary": { on: false, p: 0.4, desc: "Refuge within the cathedral walls. Limited but ancient right." }
  },
  "Charcoal burner": {
    "Charcoal supply": { on: true,  p: 1.0, desc: "Produce and sell charcoal for smithing, heating, and industrial use." },
    "Wood management": { on: false, p: 0.5, desc: "Coppice and manage woodland for sustainable charcoal production." }
  },
  "Citizen militia": {
    "Emergency defense": { on: true,  p: 1.0, desc: "Armed citizen response to external threats and raids." },
    "Muster training": { on: false, p: 0.5, desc: "Regular training days to maintain readiness without full-time soldiery." }
  },
  "City granaries": {
    "Grain storage": { on: true,  p: 1.0, desc: "Large-scale municipal grain reserves against famine and siege." },
    "Rationing": { on: false, p: 0.6, desc: "Controlled distribution in times of shortage. Prevents hoarding." },
    "Grain loans": { on: false, p: 0.4, desc: "Advance grain to farmers against next harvest. Interest in kind." }
  },
  "City-state government": {
    "Civic law enforcement": { on: true,  p: 1.0, desc: "Courts, magistrates, and watch maintaining order within city-state territory." },
    "Trade licensing": { on: true, p: 0.9, desc: "Issue licences for merchants, markets, guilds, and regulated trades." },
    "Diplomatic functions": { on: false, p: 0.6, desc: "Receive foreign emissaries and negotiate inter-city treaties." },
    "Tax collection": { on: false, p: 0.8, desc: "Collect revenues from trade, property, and population to fund city functions." }
  },
  "Cobbler's guild": {
    "Custom footwear": { on: true,  p: 1.0, desc: "Shoes and boots made to measure. Last quality significantly longer than ready-made." },
    "Boot repair": { on: true, p: 0.9, desc: "Resole, restitch, and recondition worn boots. Cheaper than replacement." },
    "Guild certification": { on: false, p: 0.4, desc: "Certified work meets guild quality standards. Mark of reliable craft." }
  },
  "Colosseum/arena": {
    "Gladiatorial combat": { on: true,  p: 1.0, desc: "Scheduled gladiatorial fights. Ticket prices vary by seat and event." },
    "Sporting events": { on: true, p: 0.9, desc: "Athletics, chariot races, and team competitions." },
    "Animal spectacles": { on: false, p: 0.7, desc: "Beast fights, animal hunts, and exotic creature exhibitions." },
    "Venue hire": { on: false, p: 0.4, desc: "Hire arena for private events, executions, or large assemblies." }
  },
  "Contract killer": {
    "Assassination": { on: true,  p: 1.0, desc: "Discreet killing of a specified target. No questions answered." },
    "Staging accidents": { on: false, p: 0.7, desc: "Death designed to look natural or accidental. Premium service." },
    "Evidence removal": { on: false, p: 0.5, desc: "Eliminate witnesses, destroy documents, remove incriminating evidence." }
  },
  "Craft guilds (5-15)": {
    "Quality certification": { on: true,  p: 1.0, desc: "Guild mark indicating goods meet agreed standards." },
    "Apprenticeship programs": { on: true, p: 0.8, desc: "Formal training under a master craftsperson. Multi-year commitment." },
    "Dispute resolution": { on: false, p: 0.6, desc: "Arbitrate disputes between guild members and their clients." },
    "Trade regulation": { on: false, p: 0.5, desc: "Enforce production standards and prevent unlicensed competition." }
  },
  "Craft guilds (30-80)": {
    "Quality certification": { on: true,  p: 1.0, desc: "Multi-guild certification systems across a range of trades." },
    "Apprenticeship programs": { on: true, p: 0.9, desc: "Extensive apprenticeship network placing workers across multiple crafts." },
    "Market access": { on: false, p: 0.7, desc: "Guild membership opens access to restricted markets and contracts." },
    "Political lobbying": { on: false, p: 0.5, desc: "Organised guilds exert pressure on government for favourable trade conditions." }
  },
  "Craft guilds (100-150+)": {
    "Market monopoly enforcement": { on: true,  p: 0.9, desc: "Maintain exclusive production rights for guild trades. Non-members prosecuted." },
    "Standards body": { on: true, p: 1.0, desc: "Set and enforce quality standards across all guild crafts." },
    "Major contracts": { on: true, p: 0.8, desc: "Only guild members can bid on large civic and military supply contracts." },
    "Political power": { on: false, p: 0.6, desc: "Guilds at this scale wield significant civic and political influence." }
  },
  "Daily markets": {
    "Fresh produce": { on: true,  p: 1.0, desc: "Fruit, vegetables, dairy, and eggs. Available every morning." },
    "General trade": { on: true, p: 0.9, desc: "Household goods, small crafts, and everyday items." },
    "Street food": { on: true, p: 0.8, desc: "Hot food sold to working people. Pies, stews, roasted meats." },
    "Wholesale purchasing": { on: false, p: 0.5, desc: "Early morning bulk buying by tavern keepers and institutional buyers." }
  },
  "Dairy farmer": {
    "Fresh milk": { on: true,  p: 1.0, desc: "Daily milk from cattle, goats, or sheep depending on region." },
    "Cheese": { on: true, p: 0.8, desc: "Aged or fresh cheese. Often a staple food for non-wealthy households." },
    "Butter": { on: true, p: 0.8, desc: "Churned butter for cooking and table use." },
    "Cream": { on: false, p: 0.5, desc: "Separated cream for wealthy households and pastry production." }
  },
  "Democratic assembly": {
    "Civic voting": { on: true,  p: 1.0, desc: "Eligible citizens vote on laws, leadership, and major decisions." },
    "Petitions": { on: true, p: 0.8, desc: "Formal submission of citizen grievances for assembly consideration." },
    "Public debate": { on: false, p: 0.7, desc: "Open debate sessions where citizens can speak to the assembly." },
    "Citizen registration": { on: false, p: 0.5, desc: "Register as a citizen entitled to vote and hold property." }
  },
  "Dragon resident": {
    "Draconic consultation": { on: false, p: 0.4, desc: "If the dragon is cooperative, its knowledge of history and magic is unmatched." },
    "Treasure appraisal": { on: false, p: 0.3, desc: "Dragons know the value of everything. They will insist on telling you." },
    "Aerial deterrence": { on: true, p: 0.8, desc: "No raiding force approaches a settlement with a visible dragon. Powerful deterrent." }
  },
  "Dream parlors (high magic)": {
    "Dream walking": { on: true,  p: 1.0, desc: "Guided experience in manufactured dream environments. Recreation or therapy." },
    "Memory extraction": { on: false, p: 0.5, desc: "Recover suppressed or forgotten memories. Used in investigations and trauma treatment." },
    "Nightmare removal": { on: false, p: 0.6, desc: "Purge recurring nightmares from the unconscious mind. High demand." },
    "Prophetic consultation": { on: false, p: 0.3, desc: "Induce prophetic dream states. Visions are real but not always interpretable." }
  },
  "Enchanter's shop": {
    "Enchantment services": { on: true,  p: 1.0, desc: "Apply magical properties to weapons, armour, tools, and objects to commission." },
    "Item identification": { on: true, p: 0.9, desc: "Identify the properties and history of magical items." },
    "Magic item repair": { on: false, p: 0.6, desc: "Restore faded or damaged magical properties. Complex work." },
    "Rune inscription": { on: false, p: 0.5, desc: "Inscribe permanent magical runes for warding, binding, or detection." }
  },
  "Fighting pits": {
    "Combat entertainment": { on: true,  p: 1.0, desc: "Unarmed or armed fights for crowd entertainment. Stakes and rules vary." },
    "Betting": { on: true, p: 0.9, desc: "Wager on fight outcomes. House takes a cut." },
    "Grudge matches": { on: false, p: 0.4, desc: "Arrange a private fight to settle a personal dispute in front of witnesses." },
    "Recruitment screening": { on: false, p: 0.3, desc: "Talent scouts watch the pits for capable fighters." }
  },
  "Fish market": {
    "Fresh fish retail": { on: true,  p: 1.0, desc: "Fish sold daily from the morning catch. Selection varies by season." },
    "Wholesale trade": { on: true, p: 0.8, desc: "Bulk purchase by taverns, institutions, and inland traders." },
    "Preserved fish": { on: false, p: 0.6, desc: "Smoked, dried, and salt-preserved fish for storage and inland trade." }
  },
  "Foundling home": {
    "Child care": { on: true,  p: 1.0, desc: "Care for abandoned and orphaned children." },
    "Adoption placement": { on: false, p: 0.5, desc: "Match children with suitable families." },
    "Apprenticeship placement": { on: false, p: 0.6, desc: "Arrange trade apprenticeships for older children." }
  },
  "Free company hall": {
    "Mercenary hire": { on: true,  p: 1.0, desc: "Hire trained soldiers for military campaigns, garrison duty, and escorts." },
    "Escort contracts": { on: true, p: 0.9, desc: "Armed escort for valuable shipments, merchants, and travelers." },
    "Military training": { on: false, p: 0.6, desc: "Professional soldiers available to train militia or household guards." },
    "Intelligence": { on: false, p: 0.4, desc: "Sell military intelligence from recent campaigns and scouting." }
  },
  "Furrier's district": {
    "Premium pelts": { on: true,  p: 1.0, desc: "Quality furs from arctic regions, rare animals, and master trappers." },
    "Fur garments": { on: true, p: 0.9, desc: "Lined cloaks, trim, and full fur coats. Status goods." },
    "Hide processing": { on: false, p: 0.6, desc: "Prepare and tan raw hides into usable pelts." }
  },
  "Gambling den": {
    "Games of chance": { on: true,  p: 1.0, desc: "Dice, cards, and other games of chance. House always wins in aggregate." },
    "Private rooms": { on: false, p: 0.5, desc: "Private gaming for wealthy clients. Higher stakes, better service." },
    "Loans": { on: false, p: 0.6, desc: "Advance credit for losing players. Rates are punishing." }
  },
  "Gambling halls": {
    "Organised games": { on: true,  p: 1.0, desc: "Multiple tables running simultaneous games. Managed and refereed." },
    "High-stakes tables": { on: false, p: 0.5, desc: "Tables with high minimum bets for serious players." },
    "Tournament events": { on: false, p: 0.4, desc: "Organized gambling tournaments with buy-ins and prize pools." }
  },
  "Gambling district": {
    "Full gambling services": { on: true,  p: 1.0, desc: "Every form of gambling available across multiple establishments." },
    "Bookmaking": { on: true, p: 0.8, desc: "Place and take bets on external events — races, fights, elections." },
    "Money changing": { on: false, p: 0.7, desc: "Convert winnings and losses across currencies. Ubiquitous in gambling districts." }
  },
  "Gladiatorial school": {
    "Gladiator training": { on: true,  p: 1.0, desc: "Professional training of fighters in arena combat styles and techniques." },
    "Gladiator hire": { on: true, p: 0.9, desc: "Rent trained gladiators for arena performances or private display." },
    "Combat instruction": { on: false, p: 0.5, desc: "Sell combat training to wealthy private clients and bodyguard services." }
  },
  "Glassmakers": {
    "Window glass": { on: true,  p: 1.0, desc: "Flat glass for windows. A sign of prosperity in any building." },
    "Glassware": { on: true, p: 0.8, desc: "Cups, bottles, vials, and tableware. Practical and decorative." },
    "Optical lenses": { on: false, p: 0.4, desc: "Lenses for spectacles, telescopes, and magnifying glasses." },
    "Stained glass": { on: false, p: 0.3, desc: "Coloured decorative glass for religious and prestige buildings." }
  },
  "Golem workforce": {
    "Heavy labour": { on: true,  p: 1.0, desc: "Golems perform dangerous, repetitive, or heavy physical work without complaint." },
    "Construction work": { on: true, p: 0.8, desc: "Tireless construction assistants. No food, no sleep, no pay." },
    "Guard duty": { on: false, p: 0.5, desc: "Stationary or patrol guard service. Immune to bribery." }
  },
  "Great cathedral": {
    "High religious ceremony": { on: true,  p: 1.0, desc: "The most significant religious observances. Major feast days and state occasions." },
    "Pilgrimage services": { on: true, p: 0.9, desc: "Accommodate and process pilgrims. Relics, blessings, and indulgences." },
    "Ecclesiastical courts": { on: false, p: 0.6, desc: "Church legal proceedings for matters within clerical jurisdiction." },
    "Dispensations": { on: false, p: 0.5, desc: "Church permission for forbidden actions — marriages, business practices, oaths." }
  },
  "Great library": {
    "Research access": { on: true,  p: 1.0, desc: "Access to an enormous collection of texts, scrolls, and records." },
    "Copying services": { on: true, p: 0.8, desc: "Commission copies of texts for a fee. Weeks of a scribe's time." },
    "Archival search": { on: false, p: 0.7, desc: "Librarian-assisted search for specific historical information." },
    "Expert consultation": { on: false, p: 0.5, desc: "Staff scholars available for consultation on specialist subjects." }
  },
  "Guild consortium": {
    "Inter-guild arbitration": { on: true,  p: 1.0, desc: "Resolve disputes between different guilds without going to civil courts." },
    "Joint ventures": { on: false, p: 0.5, desc: "Coordinate large contracts requiring multiple guild types." },
    "Political lobbying": { on: false, p: 0.6, desc: "Unified guild voice in civic politics. More powerful than individual guilds." }
  },
  "Guild governance": {
    "Trade regulation": { on: true,  p: 1.0, desc: "Enforce production standards and prevent unlicensed trade within the settlement." },
    "Standard setting": { on: true, p: 0.8, desc: "Define quality benchmarks and weights and measures for guild trades." },
    "Member discipline": { on: false, p: 0.5, desc: "Sanction guild members who violate standards or engage in dishonest trade." }
  },
  "Harbour master's office": {
    "Berth assignment": { on: true,  p: 1.0, desc: "Allocate dock space to incoming vessels based on size, cargo, and priority." },
    "Navigation records": { on: true, p: 0.8, desc: "Log arrivals, departures, cargo manifests, and vessel identities." },
    "Tide tables and charts": { on: false, p: 0.6, desc: "Provide current tide tables and local navigational information." },
    "Port authority enforcement": { on: false, p: 0.5, desc: "Enforce harbour regulations, inspect vessels, and collect port dues." }
  },
  "Hedge wizard": {
    "Minor spells": { on: true,  p: 1.0, desc: "Small practical magic — light, mending, cleaning, minor wards. Day-to-day use." },
    "Curse removal": { on: true, p: 0.7, desc: "Break minor curses and hexes. Stronger magic beyond their capability." },
    "Fortune telling": { on: false, p: 0.8, desc: "Reading signs and portents. Accuracy varies wildly." },
    "Hedge medicine": { on: false, p: 0.5, desc: "Combination of herbal knowledge and minor magic for common ailments." }
  },
  "Hired blades": {
    "Bodyguard service": { on: true,  p: 1.0, desc: "Personal protection for merchants, officials, and travelers." },
    "Escort": { on: true, p: 0.9, desc: "Armed accompaniment for valuable shipments and vulnerable travelers." },
    "Bounty hunting": { on: false, p: 0.5, desc: "Track and return fugitives. Payment on delivery." },
    "Muscle for hire": { on: false, p: 0.4, desc: "Intimidation, debt collection, and problem resolution. No questions." }
  },
  "Hireling hall": {
    "Laborer hire": { on: true,  p: 1.0, desc: "Unskilled and semi-skilled laborers for day work." },
    "Specialist hire": { on: true, p: 0.8, desc: "Skilled trades and specialist workers for contract periods." },
    "Domestic staff": { on: false, p: 0.6, desc: "Servants, cooks, and household staff for wealthy employers." },
    "Seasonal workers": { on: false, p: 0.5, desc: "Agricultural and harvest workers available for seasonal contracts." }
  },
  "Hospital network": {
    "Emergency treatment": { on: true,  p: 1.0, desc: "Rapid response to injuries, accidents, and sudden illness." },
    "Specialist care": { on: true, p: 0.8, desc: "Referral to physicians with expertise in specific conditions." },
    "Long-term recovery": { on: false, p: 0.7, desc: "Extended wards for patients requiring prolonged treatment." },
    "Medical training": { on: false, p: 0.4, desc: "Clinical training for apprentice physicians and surgeons." }
  },
  "Hunter's lodge": {
    "Hunting guide": { on: true,  p: 1.0, desc: "Expert guides for hunting trips. Knowledge of terrain, quarry, and technique." },
    "Wild game sales": { on: true, p: 0.9, desc: "Fresh and preserved game from professional hunters." },
    "Pest control": { on: true, p: 0.8, desc: "Control wildlife threatening livestock or settlements. Wolves, boar, deer." },
    "Tracking services": { on: false, p: 0.5, desc: "Track humans or animals across difficult terrain." },
    "Trophy mounting": { on: false, p: 0.3, desc: "Preserve and mount notable kills for display." }
  },
  "Inn (multiple)": {
    "Accommodation": { on: true,  p: 1.0, desc: "Beds from dormitory to private room. Quality varies by establishment." },
    "Meals and drink": { on: true, p: 0.9, desc: "Hot meals and a range of drinks at multiple venues." },
    "Stabling": { on: true, p: 0.8, desc: "Horse care, feed, and overnight stabling." },
    "Message receipt": { on: false, p: 0.5, desc: "Receive and hold messages and parcels for guests and travelers." }
  },
  "Inns and taverns (district)": {
    "Full accommodation": { on: true,  p: 1.0, desc: "All price points and quality levels represented across the district." },
    "Entertainment": { on: true, p: 0.8, desc: "Performers, games, and live music at multiple venues nightly." },
    "Information hub": { on: false, p: 0.7, desc: "Travelers pass through constantly. News and rumors flow freely." }
  },
  "Kidnapping ring": {
    "Abduction for hire": { on: true,  p: 0.9, desc: "Seize and hold a specific target on contract." },
    "Ransom facilitation": { on: false, p: 0.7, desc: "Negotiate ransom payment and arrange safe release. Cut taken." },
    "Safe houses": { on: false, p: 0.5, desc: "Secure locations to hold victims or shelter fugitives." }
  },
  "Lord's appointee": {
    "Administrative orders": { on: true,  p: 1.0, desc: "Implement the lord's directives at local level." },
    "Tax collection": { on: true, p: 0.9, desc: "Collect rents and taxes owed to the lord." },
    "Legal representation": { on: false, p: 0.5, desc: "Represent the lord's interests in local disputes." }
  },
  "Lord's steward": {
    "Estate management": { on: true,  p: 1.0, desc: "Oversee the lord's properties, staff, and revenues." },
    "Record keeping": { on: true, p: 0.9, desc: "Maintain accounts, rental rolls, and estate documents." },
    "Supplier contracts": { on: false, p: 0.5, desc: "Negotiate supply contracts for the lord's household." }
  },
  "Luxury goods quarter": {
    "High-end retail": { on: true,  p: 1.0, desc: "Jewellery, fine clothing, rare spices, and luxury goods from across the world." },
    "Custom commissions": { on: true, p: 0.8, desc: "Bespoke luxury items made to the client's specification." },
    "Exotic imports": { on: false, p: 0.6, desc: "Goods sourced from distant regions unavailable elsewhere." },
    "Appraisal": { on: false, p: 0.5, desc: "Professional valuation of luxury goods, heirlooms, and estate items." }
  },
  "Mages' guild": {
    "Spell services": { on: true,  p: 1.0, desc: "Contracted magical services — scrying, communication, transport, warding." },
    "Arcane training": { on: true, p: 0.8, desc: "Structured magical education for members and paying students." },
    "Magic item appraisal": { on: false, p: 0.7, desc: "Assess the nature and value of magical items." },
    "Research access": { on: false, p: 0.5, desc: "Member access to the guild library and research resources." }
  },
  "Major annual fairs": {
    "Large-scale trading": { on: true,  p: 1.0, desc: "The largest trading event of the year. Merchants from distant regions." },
    "Livestock auctions": { on: true, p: 0.9, desc: "Major livestock sales across all species and quality grades." },
    "Entertainment and spectacle": { on: true, p: 0.8, desc: "Major performances, competitions, and public spectacles." },
    "Foreign merchants": { on: false, p: 0.6, desc: "International traders bring goods unavailable year-round." }
  },
  "Major hospital": {
    "Surgical procedures": { on: true,  p: 1.0, desc: "Operations for injuries, tumours, and structural problems. Survival rates variable." },
    "Specialist physicians": { on: true, p: 0.9, desc: "Physicians specialised in specific conditions, diseases, and treatments." },
    "Recovery wards": { on: true, p: 0.8, desc: "Long-term wards for patients recovering from illness or surgery." },
    "Medical training": { on: false, p: 0.5, desc: "Clinical education for the next generation of physicians." }
  },
  "Market square": {
    "Weekly market": { on: true,  p: 1.0, desc: "Regular market days with produce, goods, and livestock." },
    "Public auctions": { on: false, p: 0.5, desc: "Auction of goods, animals, and estates on market days." },
    "Civic announcements": { on: true, p: 0.8, desc: "Official proclamations, wanted notices, and public notices read in the square." }
  },
  "Mayor and council": {
    "Civic administration": { on: true,  p: 1.0, desc: "Day-to-day governance of the settlement. Planning, budgeting, and dispute resolution." },
    "Trade licensing": { on: true, p: 0.9, desc: "Issue permits for market stalls, new businesses, and regulated trades." },
    "Legal appeals": { on: false, p: 0.6, desc: "Hear appeals against magistrate decisions and resolve serious disputes." }
  },
  "Mercenary quarter": {
    "Mercenary hire": { on: true,  p: 1.0, desc: "Multiple companies offering soldiers for hire. Compare rates and reputations." },
    "Veteran expertise": { on: true, p: 0.8, desc: "Experienced former soldiers available for specialist military consulting." },
    "Equipment purchase": { on: false, p: 0.6, desc: "Military equipment, weapons, and armour from specialist suppliers." }
  },
  "Merchant oligarchy": {
    "Trade monopoly access": { on: true,  p: 0.8, desc: "Access to goods controlled by the oligarchy's exclusive trade rights." },
    "Investment": { on: false, p: 0.5, desc: "Investment opportunities in oligarchy-controlled ventures. High return, restricted access." },
    "Political influence": { on: false, p: 0.4, desc: "The oligarchy shapes policy. Access to their network has value." }
  },
  "Message network (high magic)": {
    "Instant messaging": { on: true,  p: 1.0, desc: "Near-instant magical message delivery to any node in the network." },
    "Secure communications": { on: true, p: 0.8, desc: "Encrypted or warded messages that cannot be intercepted." },
    "Magical courier": { on: false, p: 0.5, desc: "Physical items transported via magical means on the network." }
  },
  "Mills (2-5)": {
    "Grain grinding": { on: true,  p: 1.0, desc: "Grind grain into flour for bread and other foods." },
    "Fulling cloth": { on: false, p: 0.4, desc: "Some mills repurposed for fulling wool cloth." },
    "Sawing timber": { on: false, p: 0.3, desc: "Water-powered sawmill function at some larger mills." }
  },
  "Mint (official)": {
    "Coin production": { on: true,  p: 1.0, desc: "Strike official coinage from bullion. Quality and weight guaranteed by authority." },
    "Bullion exchange": { on: true, p: 0.8, desc: "Convert raw silver and gold into official coin at the assayed rate." },
    "Coin inspection": { on: false, p: 0.5, desc: "Verify coin quality and detect forgeries. Official certification available." }
  },
  "Monastery or friary": {
    "Religious services": { on: true,  p: 1.0, desc: "Masses, prayers, and sacraments. Open to locals and pilgrims." },
    "Hospitality": { on: true, p: 0.8, desc: "Food and shelter for travelers and pilgrims. Often free or by donation." },
    "Copyist services": { on: true, p: 0.7, desc: "Copy manuscripts and documents. Primary source of book production." },
    "Herbalism and healing": { on: false, p: 0.5, desc: "Monastic herb gardens and healing knowledge serve the local population." },
    "Education": { on: false, p: 0.4, desc: "Teach reading, writing, and arithmetic. Often the only education available." }
  },
  "Money changers": {
    "Currency exchange": { on: true,  p: 1.0, desc: "Convert between different currencies at posted rates. Margin taken on each transaction." },
    "Coin appraisal": { on: true, p: 0.8, desc: "Assess weight and purity of coins. Identify clipped or debased currency." },
    "Safekeeping": { on: false, p: 0.4, desc: "Short-term secure storage of funds. Less formal than banking." },
    "Small loans": { on: false, p: 0.3, desc: "Short-term credit at high rates. Useful in emergencies." }
  },
  "Multiple adventurers' guilds": {
    "Quest coordination": { on: true,  p: 1.0, desc: "Multiple guilds post contracts of different types and risk levels." },
    "Equipment and supply": { on: true, p: 0.8, desc: "Specialist adventuring supply shops adjacent to guild halls." },
    "Training": { on: false, p: 0.6, desc: "Guilds offer specialised training in dungeoneering, monster lore, and survival." }
  },
  "Multiple court buildings": {
    "Civil litigation": { on: true,  p: 1.0, desc: "Handle commercial disputes, property claims, inheritance, and contracts." },
    "Criminal proceedings": { on: true, p: 0.9, desc: "Prosecute crimes from petty theft to capital offenses." },
    "Appeals": { on: false, p: 0.6, desc: "Higher courts review decisions from lower magistrate courts." }
  },
  "Multiple criminal factions": {
    "Protection rackets": { on: true,  p: 0.9, desc: "Multiple gangs running protection in different districts." },
    "Illicit goods": { on: true, p: 0.8, desc: "Contraband, stolen goods, and prohibited services across multiple networks." },
    "Faction information": { on: false, p: 0.5, desc: "Information about criminal operations — loyalties, territories, and rivalries." }
  },
  "Multiple garrisons": {
    "District security": { on: true,  p: 1.0, desc: "Military presence distributed across multiple districts." },
    "Rapid response": { on: true, p: 0.8, desc: "Multiple garrison points allow fast response to threats anywhere in the city." },
    "Military training grounds": { on: false, p: 0.5, desc: "Garrison facilities used for ongoing training of soldiers and militia." }
  },
  "Multiple market squares": {
    "District trading": { on: true,  p: 1.0, desc: "Each district has its own market square serving local needs." },
    "Specialty markets": { on: false, p: 0.6, desc: "Different squares specialize — livestock here, cloth there, luxury goods elsewhere." }
  },
  "Multiple monasteries": {
    "Religious network": { on: true,  p: 1.0, desc: "Multiple religious orders provide diverse spiritual services across the city." },
    "Educational network": { on: true, p: 0.7, desc: "Monastic schools provide literacy and basic education across districts." },
    "Information network": { on: false, p: 0.5, desc: "Monasteries communicate across their networks. Useful for intelligence." }
  },
  "Multiple theaters": {
    "Regular performances": { on: true,  p: 1.0, desc: "Multiple venues offering plays, concerts, and entertainment nightly." },
    "Diverse programming": { on: true, p: 0.9, desc: "Comedy, tragedy, opera, and spectacle across different venues." },
    "Venue hire": { on: false, p: 0.4, desc: "Hire a theater for private performances or special events." }
  },
  "Noble governor": {
    "Noble administration": { on: true,  p: 1.0, desc: "Govern in the name of the crown or great noble house." },
    "Court access": { on: false, p: 0.5, desc: "Introduction to noble court circles. Useful for ambitious petitioners." },
    "Patronage": { on: false, p: 0.4, desc: "Noble patronage for artists, scholars, and loyal subjects." }
  },
  "Pack animal trader": {
    "Pack animal sales": { on: true,  p: 1.0, desc: "Mules, donkeys, and oxen for sale. Draft work and cargo carrying." },
    "Pack animal hire": { on: true, p: 0.9, desc: "Rent animals with or without handler for journeys." },
    "Tack and equipment": { on: false, p: 0.7, desc: "Pack saddles, harness, and carrying equipment." }
  },
  "Palace/government complex": {
    "State administration": { on: true,  p: 1.0, desc: "Central administration of the entire state or region." },
    "Diplomatic functions": { on: true, p: 0.7, desc: "Receive foreign ambassadors and conduct state diplomacy." },
    "Royal audiences": { on: false, p: 0.3, desc: "Formal petitions to the ruler or their appointed representatives." }
  },
  "Parish church": {
    "Religious services": { on: true,  p: 1.0, desc: "Mass, sacraments, and seasonal observances." },
    "Life ceremonies": { on: true, p: 1.0, desc: "Births, marriages, and funerals. Essential community functions." },
    "Community gathering": { on: false, p: 0.7, desc: "The church space serves as a community meeting hall for non-religious purposes." },
    "Records": { on: false, p: 0.5, desc: "Parish birth, marriage, and death records. The only civic record-keeping in many areas." }
  },
  "Parish churches (2-5)": {
    "Religious services": { on: true,  p: 1.0, desc: "Multiple parishes covering different districts or communities." },
    "Life ceremonies": { on: true, p: 1.0, desc: "Births, marriages, and funerals across multiple parishes." },
    "Record keeping": { on: false, p: 0.6, desc: "Centralised or distributed parish records for the whole settlement." }
  },
  "Parish churches (10-30)": {
    "Full religious coverage": { on: true,  p: 1.0, desc: "Every district has a church. Religious observance accessible to all." },
    "Network coordination": { on: false, p: 0.5, desc: "Multiple parishes coordinate on feast days and city-wide observances." }
  },
  "Parish churches (50-100+)": {
    "Citywide religious infrastructure": { on: true,  p: 1.0, desc: "Comprehensive religious network across the entire city." },
    "Ecclesiastical hierarchy": { on: false, p: 0.5, desc: "Complex church hierarchy managing resources and appointments." }
  },
  "Peat cutter": {
    "Peat fuel supply": { on: true,  p: 1.0, desc: "Cut and dried peat blocks for fuel. Important where wood is scarce." }
  },
  "Planar embassy": {
    "Extraplanar relations": { on: true,  p: 1.0, desc: "Formal diplomatic relations with extraplanar entities and factions." },
    "Portal access": { on: false, p: 0.5, desc: "Access to planar portals for travel and trade. Restricted and regulated." },
    "Planar trade brokerage": { on: false, p: 0.4, desc: "Broker trade deals for extraplanar goods and services." }
  },
  "Planar traders": {
    "Exotic extraplanar goods": { on: true,  p: 1.0, desc: "Goods from other planes unavailable by any other means." },
    "Rare materials": { on: true, p: 0.8, desc: "Planar components — stardust, shadow silk, elemental crystals." },
    "Dimensional storage": { on: false, p: 0.5, desc: "Bag of holding and portable hole services. Useful for merchants." },
    "Planar information": { on: false, p: 0.4, desc: "Knowledge of other planes — geography, factions, and dangers." }
  },
  "Priest (resident)": {
    "Religious services": { on: true,  p: 1.0, desc: "Daily prayers, blessings, and religious counsel." },
    "Healing": { on: true, p: 0.7, desc: "Divine healing magic for the sick and injured." },
    "Life ceremonies": { on: true, p: 1.0, desc: "Births, marriages, and funerals." },
    "Spiritual counsel": { on: false, p: 0.6, desc: "Guidance on moral and spiritual matters." }
  },
  "Printing house": {
    "Document printing": { on: true,  p: 1.0, desc: "Print official documents, contracts, and broadsides in quantity." },
    "Book reproduction": { on: true, p: 0.8, desc: "Reproduce existing texts in print runs. Dramatically reduces book costs." },
    "Broadsheet publication": { on: false, p: 0.5, desc: "Regular printed news or opinion sheets. Precursor to newspapers." },
    "Custom printing": { on: false, p: 0.4, desc: "Print custom announcements, invitations, and promotional materials." }
  },
  "Professional city watch": {
    "Law enforcement": { on: true,  p: 1.0, desc: "Patrol, arrest, and basic investigation of crimes." },
    "Crime reporting": { on: true, p: 0.8, desc: "Accept and record crime reports. Issue warrants." },
    "Missing persons": { on: false, p: 0.4, desc: "Investigate missing persons cases. Success rate variable." },
    "Escort service": { on: false, p: 0.3, desc: "Official escort for valuable transfers or high-risk individuals." }
  },
  "Public bathhouse": {
    "Bathing": { on: true,  p: 1.0, desc: "Hot and cold baths available for a small fee. Essential in cities." },
    "Grooming": { on: true, p: 0.8, desc: "Haircuts, shaving, and basic grooming services." },
    "Massage": { on: false, p: 0.5, desc: "Therapeutic massage by trained attendants." },
    "Social gathering": { on: false, p: 0.6, desc: "Business and social conversations conducted in the bathhouse." }
  },
  "Red light district": {
    "Paid companionship": { on: true,  p: 1.0, desc: "Multiple establishments offering companionship services at various price points." },
    "Entertainment venues": { on: true, p: 0.8, desc: "Shows, music, and entertainment catering to desires not met elsewhere." },
    "Discreet information": { on: false, p: 0.6, desc: "Workers hear everything. A well-placed question yields results." }
  },
  "Resident smith (part-time)": {
    "Basic smithing": { on: true,  p: 1.0, desc: "Simple ironwork, repairs, and basic tool making." },
    "Horseshoeing": { on: true, p: 0.8, desc: "Essential service for working horses." }
  },
  "River ferry": {
    "River crossing": { on: true,  p: 1.0, desc: "Transport foot travelers and small goods across the river." },
    "Small cargo": { on: false, p: 0.6, desc: "Move small amounts of cargo across the river." }
  },
  "Royal seat": {
    "State governance": { on: true,  p: 1.0, desc: "Centre of royal administration and decision-making." },
    "Noble registration": { on: false, p: 0.5, desc: "Register noble titles, land grants, and hereditary claims." },
    "Royal audience": { on: false, p: 0.2, desc: "Rare opportunity to petition the monarch directly." }
  },
  "Scroll scribe": {
    "Document writing": { on: true,  p: 1.0, desc: "Write contracts, letters, and official documents for illiterate clients." },
    "Legal documents": { on: true, p: 0.8, desc: "Properly formatted wills, deeds, and binding contracts." },
    "Letter drafting": { on: true, p: 0.9, desc: "Compose letters on behalf of clients. Discretion assured." },
    "Copying": { on: false, p: 0.6, desc: "Copy existing texts and documents. Slower and more expensive than printing." }
  },
  "Shepherd": {
    "Livestock management": { on: true,  p: 1.0, desc: "Tend, protect, and move flocks between pastures." },
    "Wool shearing": { on: true, p: 0.8, desc: "Annual fleece harvesting. Seasonal work." },
    "Livestock sales": { on: false, p: 0.5, desc: "Sell sheep and lambs for meat, breeding, and leather." }
  },
  "Small hospital": {
    "Wound treatment": { on: true,  p: 1.0, desc: "Clean, stitch, and dress wounds. Prevent infection where possible." },
    "Fever and illness": { on: true, p: 0.8, desc: "Treat common diseases and fevers with the knowledge available." },
    "Midwifery": { on: true, p: 0.9, desc: "Assist with difficult births and postnatal complications." }
  },
  "Smuggling operation": {
    "Contraband transport": { on: true,  p: 1.0, desc: "Move restricted goods across borders and through customs." },
    "Safe passage": { on: false, p: 0.6, desc: "Move people who cannot travel openly — fugitives, spies, deserters." },
    "Hidden storage": { on: false, p: 0.4, desc: "Conceal goods in false walls, underground caches, and decoy shipments." }
  },
  "Smuggling waypoint": {
    "Route handoff": { on: true,  p: 1.0, desc: "Receive and pass on goods along the smuggling chain." },
    "Safe house": { on: false, p: 0.5, desc: "Temporary safe shelter for smugglers and their cargo." }
  },
  "Specialized metalworkers": {
    "Precision metalwork": { on: true,  p: 1.0, desc: "Complex metal components for clocks, mechanisms, and specialist tools." },
    "Alloy production": { on: true, p: 0.8, desc: "Bronze, brass, steel, and specialist alloys to commission." },
    "Technical consulting": { on: false, p: 0.5, desc: "Engineering advice on structural metalwork and mechanical systems." },
    "Specialty repairs": { on: false, p: 0.4, desc: "Repair precision instruments, magical devices, and complex mechanisms." }
  },
  "Stable master": {
    "Horse boarding": { on: true,  p: 1.0, desc: "Feed, water, and shelter privately-owned horses." },
    "Grooming and care": { on: true, p: 0.9, desc: "Full groom, exercise, and health monitoring for boarded horses." },
    "Horse hire": { on: false, p: 0.6, desc: "Rent horses for local or short-distance travel." }
  },
  "Stable yard": {
    "Basic horse care": { on: true,  p: 1.0, desc: "Feed and shelter for traveler's horses during stays." },
    "Overnight boarding": { on: true, p: 0.8, desc: "Full overnight care for horses." }
  },
  "Street gang": {
    "Petty crime": { on: true,  p: 0.9, desc: "Pickpocketing, muggings, and opportunistic theft in their territory." },
    "Local intelligence": { on: false, p: 0.7, desc: "Know who goes where in their district. Sellable information." },
    "Low-level enforcement": { on: false, p: 0.4, desc: "Apply muscle for local criminals who need a task done cheaply." }
  },
  "Tailor's guild": {
    "Custom clothing": { on: true,  p: 1.0, desc: "Garments made to measure. Fashion-conscious clients expect the best." },
    "Livery": { on: true, p: 0.8, desc: "Matching uniforms and livery for households, guilds, and institutions." },
    "Ceremonial dress": { on: false, p: 0.5, desc: "Wedding clothes, funeral garments, and formal regalia." },
    "Alterations": { on: false, p: 0.7, desc: "Take in, let out, and repair existing garments." }
  },
  "Tanner (established)": {
    "Leather production": { on: true,  p: 1.0, desc: "Convert raw hides into finished leather ready for cobblers, saddlers, and armourers." },
    "Leather goods": { on: true, p: 0.7, desc: "Belts, bags, and basic leather items produced in-house." },
    "Hide sourcing": { on: false, p: 0.5, desc: "Source hides from butchers and slaughterhouses at scale." }
  },
  "Tanners": {
    "Hide processing": { on: true,  p: 1.0, desc: "Basic tanning of animal hides into usable leather." },
    "Bulk leather": { on: false, p: 0.7, desc: "High-volume leather production for large contracts." }
  },
  "Taverns (5-20)": {
    "Drink service": { on: true,  p: 1.0, desc: "Ale, wine, and spirits across multiple establishments." },
    "Meals": { on: true, p: 0.8, desc: "Hot food in most establishments. Quality ranges from pottage to roasted meats." },
    "Short accommodation": { on: true, p: 0.6, desc: "Beds or floor space available in most taverns." },
    "Information": { on: false, p: 0.7, desc: "Drinking loosens tongues. Useful for gathering news and rumour." }
  },
  "Theaters": {
    "Performances": { on: true,  p: 1.0, desc: "Plays, comedies, tragedies, and spectacles performed by professional companies." },
    "Rehearsal space hire": { on: false, p: 0.4, desc: "Hire theater space during off-hours for private performances or rehearsals." },
    "Costume and prop hire": { on: false, p: 0.3, desc: "Theatrical wardrobes and props available for hire." }
  },
  "Thieves' guild (powerful)": {
    "Burglary": { on: true,  p: 0.9, desc: "Targeted theft of specific items. Professional and discreet." },
    "Fence services": { on: true, p: 1.0, desc: "Move stolen goods through legitimate-seeming channels." },
    "Intelligence network": { on: false, p: 0.7, desc: "Information on individuals, security arrangements, and valuables." },
    "Criminal protection": { on: false, p: 0.5, desc: "Pay the guild and small criminal operations are left alone." }
  },
  "Thieves' guild chapter": {
    "Theft coordination": { on: true,  p: 0.8, desc: "Coordinate pickpocketing, burglary, and robbery within the district." },
    "Fencing": { on: true, p: 0.9, desc: "Local fence network for chapter members." },
    "Protection": { on: false, p: 0.4, desc: "Chapter-level protection for allied criminal operations." }
  },
  "Toll bridge": {
    "Crossing fee": { on: true,  p: 1.0, desc: "Collect toll from all who cross. Rate varies by load and cargo." },
    "Cargo inspection": { on: false, p: 0.3, desc: "Check loads for contraband or unpaid duties." }
  },
  "Town crier": {
    "Official announcements": { on: true,  p: 1.0, desc: "Proclaim laws, royal decrees, and official notices to the public." },
    "Commercial announcements": { on: false, p: 0.6, desc: "Paid announcements for merchants, events, and wanted notices." }
  },
  "Town watch": {
    "Night patrol": { on: true,  p: 1.0, desc: "Patrol the streets after dark. Deter crime and respond to incidents." },
    "Gate duty": { on: true, p: 0.8, desc: "Check travelers entering and leaving. Note unusual visitors." },
    "Crime response": { on: false, p: 0.7, desc: "Respond to reported crimes and pursue fleeing suspects." }
  },
  "Travelers' inn": {
    "Accommodation": { on: true,  p: 1.0, desc: "Beds for travelers. Range from dormitory to private room." },
    "Meals": { on: true, p: 0.9, desc: "Hot meals suited to travelers. Hearty portions." },
    "Route information": { on: false, p: 0.6, desc: "Innkeepers know the roads. Ask about conditions, hazards, and distances." }
  },
  "Traveling hedge wizard": {
    "Minor spells for hire": { on: true,  p: 1.0, desc: "Small practical spells performed for a fee. Mending, light, messages." },
    "Fortune telling": { on: true, p: 0.8, desc: "Divination and portent reading. Accuracy uncertain." },
    "Exotic components": { on: false, p: 0.4, desc: "Sell unusual ingredients and components acquired on travels." }
  },
  "Undead labor": {
    "Heavy labor": { on: true,  p: 1.0, desc: "Skeletons and zombies perform dangerous or exhausting physical work. No pay, no food, no complaints." },
    "Night work": { on: true, p: 0.8, desc: "Undead don't need light or rest. Valuable for night-shift operations." },
    "Hazardous tasks": { on: false, p: 0.5, desc: "Tasks too dangerous for living workers. Toxic environments, unstable structures." }
  },
  "Veteran's lodge": {
    "Military consulting": { on: true,  p: 1.0, desc: "Veterans sell tactical expertise, campaign knowledge, and military advice." },
    "Combat training": { on: true, p: 0.8, desc: "Hard-won practical training from people who've used it in anger." },
    "Veteran networking": { on: false, p: 0.6, desc: "Connect with other veterans. Mutual aid, job referrals, and shared intelligence." }
  },
  "Village musician": {
    "Music and entertainment": { on: true,  p: 1.0, desc: "Songs, dances, and music for celebrations and gatherings." },
    "Music lessons": { on: false, p: 0.3, desc: "Basic instruction for interested students." }
  },
  "Village reeve": {
    "Administrative oversight": { on: true,  p: 1.0, desc: "Manage village affairs on behalf of the lord. Allocate strips and common access." },
    "Dispute resolution": { on: true, p: 0.8, desc: "Settle minor disputes before they require higher authority." },
    "Tax collection": { on: false, p: 0.7, desc: "Collect dues owed to the lord and accounting for common resources." }
  },
  "Village scribe": {
    "Letter writing": { on: true,  p: 1.0, desc: "Write letters for illiterate villagers." },
    "Document reading": { on: true, p: 0.9, desc: "Read official documents and explain their contents." },
    "Contract recording": { on: false, p: 0.4, desc: "Write down and witness simple agreements between parties." }
  },
  "Weavers/Textile workers": {
    "Cloth production": { on: true,  p: 1.0, desc: "Weave wool, linen, and other fibres into cloth for clothing and trade." },
    "Custom weaving": { on: false, p: 0.5, desc: "Weave to specific patterns and specifications for wealthy clients." },
    "Dyeing": { on: false, p: 0.4, desc: "Colour cloth in a range of shades. Bright dyes are expensive." }
  },
  "Wildfowler": {
    "Wild game sales": { on: true,  p: 1.0, desc: "Waterfowl, snipe, and upland birds caught in season." },
    "Trapping": { on: true, p: 0.8, desc: "Set and maintain traps across marshes and woodland." },
    "Feather trade": { on: false, p: 0.4, desc: "Collect and sell feathers for fletching, bedding, and quill pens." }
  },
  "Sage\'s quarter": {
    "Scholarly research": { on: true,  p: 1.0, desc: "Detailed research into history, lore, natural philosophy, and obscure topics." },
    "Historical consultation": { on: true, p: 0.8, desc: "Expert opinion on historical events, genealogy, and ancient records." },
    "Translation": { on: false, p: 0.6, desc: "Translate ancient languages, foreign scripts, and obscure dialects." },
    "Expert testimony": { on: false, p: 0.4, desc: "Provide expert opinion in legal proceedings or formal inquiries." }
  },
  "Slave market district": {
    "Slave auction": { on: true,  p: 1.0, desc: "Large-scale regularized slave auctions with multiple blocks and licensed auctioneers." },
    "Brokerage": { on: true, p: 0.9, desc: "Commission-based intermediary between slave traders and buyers." },
    "Registry": { on: true, p: 0.8, desc: "Official record of owned persons, transfers of title, and manumission papers." },
    "Import processing": { on: false, p: 0.7, desc: "Receive, quarantine, and process incoming slave shipments from distant regions." },
    "Skilled labor matching": { on: false, p: 0.6, desc: "Premium matching of skilled enslaved artisans, scribes, and tutors to buyers." }
  },
  "Human trafficking network": {
    "Disappearances": { on: true,  p: 0.9, desc: "People go missing. Usually blamed on bandits or the river." },
    "Document forgery": { on: false, p: 0.7, desc: "False freedom papers, altered identities, forged ownership documents." },
    "Transport routes": { on: false, p: 0.6, desc: "Safe houses and handoff points moving persons without attracting attention." }
  },
  // ── Remaining institutions with services ─────────────────────────────────
  "Carpenter": {
    "Basic carpentry": { on: true,  p: 1.0, desc: "Furniture, shelving, and basic woodwork. Jack of all wooden trades." },
    "Building repairs": { on: true, p: 0.9, desc: "Fix structural problems, patch roofs, and replace rotted timbers." }
  },
  "Thatcher": {
    "Thatching": { on: true,  p: 1.0, desc: "Apply and maintain reed or straw thatch roofing. The primary roofing material for common buildings." },
    "Roof inspection": { on: false, p: 0.5, desc: "Assess existing thatch condition and plan replacement timing." }
  },
  "Cooper": {
    "Barrel making": { on: true,  p: 1.0, desc: "Watertight barrels for ale, wine, salted meat, and fish. Essential packaging for trade." },
    "Cask repair": { on: true, p: 0.8, desc: "Re-coopering and repair of used barrels. Cheaper than new for small leaks." },
    "Custom containers": { on: false, p: 0.4, desc: "Specialty containers — butter churns, water buckets, storage vats." }
  },
  "Apothecary": {
    "Herbal remedies": { on: true,  p: 1.0, desc: "Dried herbs, tinctures, and simple remedies for common ailments." },
    "Compound medicines": { on: true, p: 0.8, desc: "Prepared medicines for fever, pain, and infection." },
    "Consultation": { on: false, p: 0.6, desc: "Basic diagnosis and treatment advice." }
  },
  "Graveyard": {
    "Burial": { on: true,  p: 1.0, desc: "Prepare and inter the dead. Religious rites included where applicable." },
    "Memorial inscription": { on: false, p: 0.5, desc: "Grave markers and carved memorial stones." },
    "Grave maintenance": { on: false, p: 0.3, desc: "Ongoing care of family plots. Purchased in advance." }
  },
  "Town granary": {
    "Grain storage": { on: true,  p: 1.0, desc: "Municipal grain reserves. Buffers the settlement against poor harvests." },
    "Milling service": { on: false, p: 0.5, desc: "Some granaries include milling capacity." }
  },
  "Bakers (5-15)": {
    "Fresh bread": { on: true,  p: 1.0, desc: "Daily bread. The staple food of most people. Quality and price vary." },
    "Pastries": { on: true, p: 0.7, desc: "Pies, tarts, and pastries. More expensive, available to those who can afford it." },
    "Batch baking": { on: false, p: 0.5, desc: "Bake customers' own dough for a fee. Common where ovens are scarce." }
  },
  "Warehouse district": {
    "Goods storage": { on: true,  p: 1.0, desc: "Secure, dry storage for large quantities of trade goods." },
    "Bonded storage": { on: false, p: 0.6, desc: "Customs-sealed storage for goods awaiting duty payment." },
    "Cold storage": { on: false, p: 0.3, desc: "Cool cellars for perishables. Rare but valuable." }
  },
  "Auction house": {
    "Public auction": { on: true,  p: 1.0, desc: "Open competitive bidding for goods, property, livestock, and estates." },
    "Estate sales": { on: true, p: 0.8, desc: "Liquidate the possessions of a deceased or bankrupt party." },
    "Commission sales": { on: false, p: 0.6, desc: "Consign goods for auction. Fee taken from sale price." }
  },
  "Informal elder consensus": {
    "Community mediation": { on: true,  p: 0.8, desc: "The elder hears disputes and suggests resolution. No enforcement, but social pressure is real." }
  },
  "Head-of-household consensus": {
    "Family decisions": { on: true,  p: 0.7, desc: "Matters affecting multiple families go to a council of heads. Slow but broadly legitimate." }
  },
  "Subsistence farming": {
    "Surplus sale": { on: false, p: 0.4, desc: "In good years, small surpluses sold at market. Rare and seasonal." }
  },
  "Town walls": {
    "Gate control": { on: true,  p: 1.0, desc: "Control who enters and exits. Levy tolls on goods." },
    "Refuge in crisis": { on: false, p: 0.5, desc: "The walls provide refuge for the rural population during raids." }
  },
  "City walls and gates": {
    "Gate control": { on: true,  p: 1.0, desc: "Multiple gated access points. Customs checks and toll collection." },
    "Patrol service": { on: false, p: 0.5, desc: "Manned towers and wall walks patrol for threats." }
  },
  "Citadel": {
    "Last refuge": { on: true,  p: 1.0, desc: "The final defensible point in the city. Holds the essential population if the rest falls." },
    "Military command": { on: false, p: 0.6, desc: "Command and coordination centre for the city's defense." }
  },
  "Massive walls and fortifications": {
    "Perimeter defense": { on: true,  p: 1.0, desc: "The city's primary military asset. Keeps out everything short of a major siege." }
  },
  "State granary complex": {
    "Strategic grain reserves": { on: true,  p: 1.0, desc: "City-scale grain storage for siege survival and famine prevention." },
    "Price stabilisation": { on: false, p: 0.5, desc: "Release stored grain to cap prices during shortages." }
  },






  // ── Additional institutions ───────────────────────────────────────────────
    "Wayside shrine": {
    "Wayside blessing": { on: true, p: 1.0, desc: "A brief blessing for travelers on the road. Costs nothing; donations welcomed." },
    "Traveller's prayer": { on: false, p: 0.8, desc: "Spoken prayer for safe passage and fair weather." },
    "Donation accepted": { on: false, p: 0.5, desc: "Small offerings left at the shrine. Accumulated and forwarded to the parish." }
  },
  "Access to parish church": {
    "Sunday mass": { on: true, p: 1.0, desc: "Weekly mass. Attendance expected of all residents." },
    "Baptism": { on: true, p: 0.9, desc: "Sacrament of entry into the faith. Required for most civil recognition." },
    "Marriage ceremony": { on: true, p: 0.9, desc: "Church-sanctioned marriage, legally binding." },
    "Last rites": { on: true, p: 0.9, desc: "Funeral rites and burial. The church manages the graveyard." },
    "Confession": { on: false, p: 0.6, desc: "Private confession to the priest. Absolution granted." }
  },
  "Monastery": {
    "Pilgrim shelter": { on: true, p: 1.0, desc: "Food and a bed for pilgrims and travelers. Free or by donation." },
    "Healing herbs": { on: true, p: 0.8, desc: "Herbal remedies from the monastic garden for common ailments." },
    "Copyist services": { on: false, p: 0.6, desc: "Monks copy manuscripts and documents. Slow but accurate." },
    "Silent retreat": { on: false, p: 0.4, desc: "Spiritual retreat in the monastery. Silence required." },
    "Alms": { on: true, p: 0.7, desc: "Distribution of food and aid to the poor on feast days." }
  },
  "Major monasteries (5-10)": {
    "Advanced scribing": { on: true, p: 0.9, desc: "High-quality manuscript copying across multiple scriptoria." },
    "Rare texts": { on: false, p: 0.6, desc: "Access to unusual texts and scholarly works held by the monasteries." },
    "Higher healing": { on: false, p: 0.5, desc: "More advanced divine healing from senior clerics." },
    "Reliquary access": { on: false, p: 0.4, desc: "Access to venerated relics and shrines for pilgrims." }
  },
  "Local fence": {
    "Sell stolen goods": { on: true, p: 0.9, desc: "Buy stolen items at 20-40% of value. No questions asked." },
    "Appraisal (unofficial)": { on: true, p: 0.7, desc: "Assess the black-market value of items. Discretion guaranteed." },
    "Buyer introductions": { on: false, p: 0.4, desc: "Connect sellers with specific buyers for higher-value items." }
  },
  "Fence (word of mouth)": {
    "Discreet sale": { on: true, p: 0.9, desc: "Move stolen goods quietly through a trusted referral network." },
    "Contraband purchase": { on: true, p: 0.8, desc: "Purchase restricted or illegal goods without documentation." },
    "Rumour brokering": { on: false, p: 0.5, desc: "Trade information — this fence hears everything." }
  },
  "Outlaw shelter": {
    "Hideout rental": { on: true, p: 0.9, desc: "Secure hiding place for fugitives. Paid in advance." },
    "Forged travel papers": { on: false, p: 0.6, desc: "Passable forgeries for crossing checkpoints." },
    "Underground contacts": { on: false, p: 0.4, desc: "Introduction to other outlaws and criminal specialists." }
  },
  "Front businesses": {
    "Money laundering": { on: true, p: 0.9, desc: "Move illicit proceeds through legitimate-looking commercial activity." },
    "Legitimate cover documents": { on: false, p: 0.6, desc: "Provide paperwork backing a false business identity." },
    "Goods movement": { on: false, p: 0.5, desc: "Ship goods without triggering customs inspection." }
  },
  "Smuggling network": {
    "Contraband delivery": { on: true, p: 1.0, desc: "Move restricted goods along established smuggling routes." },
    "Customs bypass": { on: true, p: 0.8, desc: "Get shipments past checkpoints without inspection." },
    "Untaxed goods import": { on: false, p: 0.6, desc: "Bring in taxable goods without paying duties." }
  },
  "Underground city": {
    "Black market bazaar": { on: true, p: 1.0, desc: "Full criminal marketplace for goods and services unavailable above ground." },
    "Hidden quarter access": { on: true, p: 0.8, desc: "Navigate the underground without getting lost or robbed." },
    "Criminal arbitration": { on: false, p: 0.5, desc: "Resolve disputes between criminal parties without involving authorities." }
  },
  "Palisade or earthworks": {
    "Gated entry": { on: true, p: 1.0, desc: "Controlled access through the perimeter. Strangers must state business." },
    "Night watch": { on: true, p: 0.8, desc: "Basic patrol of the perimeter after dark." },
    "Emergency shelter": { on: false, p: 0.5, desc: "Refuge for the rural population during raids or attacks." }
  },
  "Gates (if walled)": {
    "Toll collection": { on: true, p: 1.0, desc: "Levy on goods and travelers passing through the gates." },
    "Entry inspection": { on: true, p: 0.8, desc: "Check travelers and cargoes for contraband or wanted persons." },
    "Curfew enforcement": { on: false, p: 0.5, desc: "Enforce curfew and close gates at nightfall." }
  },
  "Barracks": {
    "Military escort": { on: true, p: 0.8, desc: "Armed escort within the settlement's jurisdiction." },
    "Guard hire": { on: true, p: 0.9, desc: "Soldiers available for static guard duty on contract." },
    "Contract witnessing": { on: false, p: 0.5, desc: "An officer witnesses and validates commercial agreements." },
    "Lost property": { on: false, p: 0.4, desc: "Report and recover lost or stolen property." }
  },
  "Watchtower": {
    "Signal fire": { on: true, p: 0.9, desc: "Signal to neighbouring settlements or the garrison of approaching threats." },
    "Approaching threat warning": { on: true, p: 1.0, desc: "Early warning of raiders, armies, or other threats." },
    "Night watch": { on: true, p: 0.8, desc: "Continuous observation through the night." }
  },
  "Healer (divine, 1st level)": {
    "Cure light wounds": { on: true, p: 1.0, desc: "Basic divine healing. Closes cuts, reduces fever, eases pain." },
    "Purify food and water": { on: true, p: 0.8, desc: "Remove contamination from food and water through divine blessing." },
    "Remove minor disease": { on: false, p: 0.6, desc: "Treat common illnesses through divine intervention." },
    "Bless": { on: false, p: 0.5, desc: "Divine blessing for journeys, battles, or important undertakings." }
  },
  "Wizard's tower": {
    "Arcane identification": { on: true, p: 1.0, desc: "Identify the properties of magical items and substances." },
    "Spell consultation": { on: true, p: 0.8, desc: "Advice on magical phenomena, ward design, and arcane questions." },
    "Component sourcing": { on: false, p: 0.6, desc: "Locate and supply rare spell components." },
    "Scrying (limited)": { on: false, p: 0.4, desc: "Scrying service for locating persons or places. Expensive." }
  },
  "Teleportation circle": {
    "Long-distance teleportation": { on: true, p: 1.0, desc: "Transport people and goods to other permanent circles instantly." },
    "Planar transit": { on: false, p: 0.5, desc: "Access to planar destinations via the circle network." },
    "Emergency extraction": { on: false, p: 0.4, desc: "Rapid evacuation via teleportation in emergencies." }
  },
  "Mages' district": {
    "Full spell services": { on: true, p: 1.0, desc: "The complete range of arcane services from multiple practitioners." },
    "Custom enchanting": { on: true, p: 0.8, desc: "Commission enchantment of items to specification." },
    "Research access": { on: false, p: 0.6, desc: "Access to district libraries and research facilities." },
    "Item appraisal": { on: false, p: 0.7, desc: "Magical item identification and valuation." }
  },
  "Charlatan fortune tellers": {
    "Cold reading": { on: true, p: 0.9, desc: "Convincing but fraudulent personality readings." },
    "Fake prophecy": { on: true, p: 0.8, desc: "Dramatic but meaningless predictions. Occasionally accidentally accurate." },
    "Lucky charms": { on: false, p: 0.7, desc: "Sell talismans and charms of no actual magical value." }
  },
  "Dungeon delving supply district": {
    "Specialist equipment": { on: true, p: 1.0, desc: "Ropes, grapples, torches, pole weapons, and adventuring gear." },
    "Dungeon maps": { on: true, p: 0.7, desc: "Maps of known dungeon complexes. Accuracy varies." },
    "Hired porters": { on: false, p: 0.6, desc: "Hire human porters to carry equipment into the dungeon." },
    "Antitoxins": { on: false, p: 0.5, desc: "Prepared antidotes for common dungeon poisons." }
  },
  "Sage's quarter": {
    "Monster lore": { on: true, p: 0.9, desc: "Detailed information on creature weaknesses, habits, and habitats." },
    "Historical research": { on: true, p: 0.8, desc: "Research into historical events, figures, and locations." },
    "Language translation": { on: false, p: 0.6, desc: "Translate ancient, foreign, or obscure languages." },
    "Map reading": { on: false, p: 0.5, desc: "Interpret and explain complex or archaic maps." }
  },
  "Traveling performers": {
    "Public performance": { on: true, p: 1.0, desc: "Street and square performances — juggling, music, comedy, acrobatics." },
    "Private entertainment": { on: true, p: 0.8, desc: "Hire the troupe for private events and festivals." },
    "Festival coordination": { on: false, p: 0.5, desc: "Organize and manage entertainment for a major festival." }
  },
  "Brothel": {
    "Companionship": { on: true, p: 1.0, desc: "Paid companionship services." },
    "Private rooms": { on: true, p: 0.8, desc: "Secure, discreet rooms for meetings requiring privacy." },
    "Rumour brokering": { on: false, p: 0.6, desc: "Information gathered from indiscreet clients. Valuable currency." },
    "Neutral meeting space": { on: false, p: 0.4, desc: "A place where parties from rival factions can meet quietly." }
  },
  "Opera house": {
    "Performance tickets": { on: true, p: 1.0, desc: "Purchase tickets for scheduled performances." },
    "Private box hire": { on: false, p: 0.6, desc: "Hire a private box for exclusive viewing. Status symbol." },
    "Patron sponsorship": { on: false, p: 0.4, desc: "Commission or sponsor a production or performer." },
    "Commissions": { on: false, p: 0.3, desc: "Commission an original operatic work." }
  },
  "Town hall": {
    "Permit applications": { on: true, p: 1.0, desc: "Apply for construction, business, and trade permits." },
    "Dispute arbitration": { on: true, p: 0.8, desc: "Bring commercial and civil disputes before a magistrate." },
    "Tax payment": { on: true, p: 0.9, desc: "Pay annual and quarterly taxes and levies." },
    "Record filing": { on: false, p: 0.6, desc: "File and register contracts, deeds, and official documents." }
  },
  "City hall": {
    "Civic licensing": { on: true, p: 1.0, desc: "License all commercial and civic activities in the city." },
    "Appeals court": { on: true, p: 0.8, desc: "Appeal decisions of lower magistrates and officials." },
    "Public record access": { on: false, p: 0.6, desc: "Access the city's archive of documents and records." },
    "Contract witnessing": { on: false, p: 0.5, desc: "Official witnessing of commercial and legal contracts." }
  },
  "Small prison/stocks": {
    "Holding cells": { on: true, p: 1.0, desc: "Short-term detention pending trial or payment of fines." },
    "Public punishment": { on: true, p: 0.8, desc: "Stocks and pillory for public shaming and minor offenses." },
    "Fine payment": { on: true, p: 0.9, desc: "Pay fines to secure release from detention." }
  },
  "Large prison": {
    "Long-term incarceration": { on: true, p: 1.0, desc: "Hold convicted criminals for extended sentences." },
    "Hard labour contracts": { on: false, p: 0.6, desc: "Assign prisoners to labour contracts for public works." },
    "Bail hearings": { on: false, p: 0.5, desc: "Formal hearings to set or deny bail for detained persons." },
    "Visitor permits": { on: false, p: 0.4, desc: "Obtain a permit to visit an incarcerated person." }
  }

};
