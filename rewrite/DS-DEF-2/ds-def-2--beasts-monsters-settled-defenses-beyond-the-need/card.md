THE CARD (mechanical sections) — block DS-DEF-2 · pool `Beasts & Monsters: settled, defenses beyond the need` · dir ds-def-2-beasts-monsters-settled-defenses-beyond-the-need

(1) THE KEY AND ITS PREIMAGE
  key function: BEASTS_ROW_POOL (rung table) · site defense.threatAssessment
  census predicate: beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js) === settled country, perimeter
  read family         -> config.monsterThreat                     [CONFIG] writers 0   (resolved through beastsRowPoolKey's call site in the entry point)
  read perimeter      -> institutions[bucket=walls]               [LIVE-ROSTER] writers 38   (resolved through beastsRowPoolKey's call site in the entry point)
  read force          -> institutions[bucket=garrison]            [LIVE-ROSTER] writers 38   (resolved through beastsRowPoolKey's call site in the entry point)
  read force          -> institutions[bucket=militia]             [LIVE-ROSTER] writers 38   (resolved through beastsRowPoolKey's call site in the entry point)
  the key FIXES: monsterThreat="heartland" · perimeter=true · leaves OPEN: force   (beastsRowPoolKey, 2 combination(s))
  preimage on the 768-town rate grid: 118 towns (1536 bp) — thorp 13/128 · village 1/128 · town 18/128 · city 43/128 · metropolis 43/128
  silent tiers: hamlet

(2) THE REQUIRED ROWS (institutionalCatalog required: true) at every preimage tier — bodies a face may not deny or infer away
  thorp (5): Burial ground [Religious] · Dwellings (4-16) [Infrastructure] · Water source [Infrastructure] · Access to external mill [Economy] · Subsistence farming [Economy]
  village (7): Multiple water sources [Infrastructure] · Dwellings (80-180) [Infrastructure] · Farmland [Economy] · Mill [Crafts] · Parish church [Religious] · Priest (resident) [Religious] · Graveyard [Religious]
  town (13): Town granary [Economy] · Market square [Economy] · Weekly market [Economy] · Craft guilds (5-15) [Economy] · Inn (multiple) [Economy] · Taverns (5-20) [Economy] · Mills (2-5) [Crafts] · Parish churches (2-5) [Religious] · Parish burial grounds [Religious] · Town watch [Defense] · Town hall [Infrastructure] · Housing (180-1000 structures) [Infrastructure] · Multiple water sources [Infrastructure]
  city (14): City granaries [Economy] · Multiple market squares [Economy] · Daily markets [Economy] · Inns and taverns (district) [Economy] · Warehouse district [Economy] · Parish churches (10-30) [Religious] · Burial grounds and charnel house [Religious] · City walls and gates [Defense] · Professional city watch [Defense] · Garrison [Defense] · City hall [Infrastructure] · Multiple courthouses [Infrastructure] · Housing (1000-5000 structures) [Infrastructure] · Aqueduct or water system [Infrastructure]
  metropolis (1): Cemetery network [Religious]

(2b) WHAT A FACE MAY NOT DENY OF THE REQUIRED ROWS — the services the engine's own menu turns on at p ≥ 0.8, and the derivation that files the row
  Access to external mill (required at thorp) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Aqueduct or water system (required at city) — a face may not deny: Clean water distribution (p 1) · filed under no closed roster
  Burial ground (required at thorp) — a face may not deny: Burial (p 1) · filed under no closed roster
  Burial grounds and charnel house (required at city) — a face may not deny: Burial (p 1) · filed under no closed roster
  Cemetery network (required at metropolis) — a face may not deny: Burial (p 1) · Central register (p 0.9) · filed under no closed roster
  City granaries (required at city) — a face may not deny: Grain storage (p 1) · filed under the `granary` roster
  City hall (required at city) — a face may not deny: Civic licensing (p 1) · Appeals court (p 0.8) · filed under the `hall` roster · filed under the `court` roster
  City walls and gates (required at city) — a face may not deny: Gate control (p 1) · filed under fortifications (deriveArmedForces) · filed under the `gates` roster
  Craft guilds (5-15) (required at town) — a face may not deny: Quality certification (p 1) · Apprenticeship programs (p 0.8) · filed under no closed roster
  Daily markets (required at city) — a face may not deny: Fresh produce (p 1) · General trade (p 0.9) · Street food (p 0.8) · filed under the `market` roster
  Dwellings (4-16) (required at thorp) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Dwellings (80-180) (required at village) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Farmland (required at village) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Garrison (required at city) — a face may not deny: Defence services (p 1) · filed under standing (deriveArmedForces)
  Graveyard (required at village) — a face may not deny: Burial (p 1) · filed under no closed roster
  Housing (1000-5000 structures) (required at city) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Housing (180-1000 structures) (required at town) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Inn (multiple) (required at town) — a face may not deny: Accommodation (p 1) · Meals and drink (p 0.9) · Stabling (p 0.8) · filed under no closed roster
  Inns and taverns (district) (required at city) — a face may not deny: Full accommodation (p 1) · Entertainment (p 0.8) · filed under no closed roster
  Market square (required at town) — a face may not deny: Weekly market (p 1) · Civic announcements (p 0.8) · filed under the `market` roster
  Mill (required at village) — a face may not deny: Grain milling (p 1) · filed under no closed roster
  Mills (2-5) (required at town) — a face may not deny: Grain grinding (p 1) · filed under no closed roster
  Multiple courthouses (required at city) — a face may not deny: (no service menu at or above the bar) · filed under the `court` roster
  Multiple market squares (required at city) — a face may not deny: District trading (p 1) · filed under the `market` roster
  Multiple water sources (required at village, town) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Parish burial grounds (required at town) — a face may not deny: Burial (p 1) · Register of the dead (p 0.8) · filed under no closed roster
  Parish church (required at village) — a face may not deny: Life ceremonies (p 1) · Religious services (p 1) · filed under the `church` roster
  Parish churches (10-30) (required at city) — a face may not deny: Full religious coverage (p 1) · filed under the `church` roster
  Parish churches (2-5) (required at town) — a face may not deny: Life ceremonies (p 1) · Religious services (p 1) · filed under the `church` roster
  Priest (resident) (required at village) — a face may not deny: Life ceremonies (p 1) · Religious services (p 1) · filed under the `church` roster
  Professional city watch (required at city) — a face may not deny: Law enforcement (p 1) · Crime reporting (p 0.8) · filed under standing (deriveArmedForces) · filed under standing (deriveArmedForces)
  Subsistence farming (required at thorp) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Taverns (5-20) (required at town) — a face may not deny: Drink service (p 1) · Meals (p 0.8) · filed under no closed roster
  Town granary (required at town) — a face may not deny: Grain storage (p 1) · filed under the `granary` roster
  Town hall (required at town) — a face may not deny: Permit applications (p 1) · Tax payment (p 0.9) · Dispute arbitration (p 0.8) · filed under the `hall` roster · filed under the `court` roster
  Town watch (required at town) — a face may not deny: Night patrol (p 1) · Gate duty (p 0.8) · filed under standing (deriveArmedForces)
  Warehouse district (required at city) — a face may not deny: Goods storage (p 1) · filed under no closed roster
  Water source (required at thorp) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Weekly market (required at town) — a face may not deny: General trade (p 1) · Tax collection (p 0.9) · filed under the `market` roster
  ⛔ A SERVICE AT OR ABOVE THE BAR IS A THING THE TOWN'S OWN MODEL SAYS THIS BODY DOES: denying it is floor 1, whatever the face is otherwise about. A row filed under `standing` is UNDER ARMS in the engine's reading even where the key fixes no garrison and no militia.

(2b′) THE OBSERVER'S AND THE PUBLIC'S LIST: what neither may claim to have seen
  Access to external mill (required at thorp) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Aqueduct or water system (required at city) — NOT SEEN is a claim about: Clean water distribution
  Burial ground (required at thorp) — NOT SEEN is a claim about: Burial
  Burial grounds and charnel house (required at city) — NOT SEEN is a claim about: Burial
  Cemetery network (required at metropolis) — NOT SEEN is a claim about: Burial · Central register
  City granaries (required at city) — NOT SEEN is a claim about: Grain storage
  City hall (required at city) — NOT SEEN is a claim about: Civic licensing · Appeals court
  City walls and gates (required at city) — NOT SEEN is a claim about: Gate control
  Craft guilds (5-15) (required at town) — NOT SEEN is a claim about: Quality certification · Apprenticeship programs
  Daily markets (required at city) — NOT SEEN is a claim about: Fresh produce · General trade · Street food
  Dwellings (4-16) (required at thorp) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Dwellings (80-180) (required at village) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Farmland (required at village) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Garrison (required at city) — NOT SEEN is a claim about: Defence services
  Graveyard (required at village) — NOT SEEN is a claim about: Burial
  Housing (1000-5000 structures) (required at city) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Housing (180-1000 structures) (required at town) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Inn (multiple) (required at town) — NOT SEEN is a claim about: Accommodation · Meals and drink · Stabling
  Inns and taverns (district) (required at city) — NOT SEEN is a claim about: Full accommodation · Entertainment
  Market square (required at town) — NOT SEEN is a claim about: Weekly market · Civic announcements
  Mill (required at village) — NOT SEEN is a claim about: Grain milling
  Mills (2-5) (required at town) — NOT SEEN is a claim about: Grain grinding
  Multiple courthouses (required at city) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Multiple market squares (required at city) — NOT SEEN is a claim about: District trading
  Multiple water sources (required at village, town) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Parish burial grounds (required at town) — NOT SEEN is a claim about: Burial · Register of the dead
  Parish church (required at village) — NOT SEEN is a claim about: Life ceremonies · Religious services
  Parish churches (10-30) (required at city) — NOT SEEN is a claim about: Full religious coverage
  Parish churches (2-5) (required at town) — NOT SEEN is a claim about: Life ceremonies · Religious services
  Priest (resident) (required at village) — NOT SEEN is a claim about: Life ceremonies · Religious services
  Professional city watch (required at city) — NOT SEEN is a claim about: Law enforcement · Crime reporting
  Subsistence farming (required at thorp) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Taverns (5-20) (required at town) — NOT SEEN is a claim about: Drink service · Meals
  Town granary (required at town) — NOT SEEN is a claim about: Grain storage
  Town hall (required at town) — NOT SEEN is a claim about: Permit applications · Tax payment · Dispute arbitration
  Town watch (required at town) — NOT SEEN is a claim about: Night patrol · Gate duty
  Warehouse district (required at city) — NOT SEEN is a claim about: Goods storage
  Water source (required at thorp) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Weekly market (required at town) — NOT SEEN is a claim about: General trade · Tax collection
  ⛔ AN OBSERVATION AND A PUBLIC FACE ARE FACTS THEIR SPEAKER CLAIMS (rulings 27 (a), 28 (a)), so neither may INFER INTO A SILENCE a required row denies. On a preimage carrying a `Town watch`, "no member of the watch has walked the wall" is floor 1 in a witness's coat; "no soldier has been seen on the wall" is true on every town that draws a key fixing no garrison and no militia. The PUBLIC's second half — what everyone MAKES of what it saw — is a perception and may be mistaken; the seeing may not.
  ⛔ AND THE FAIR COPY DOES NOT CITE ITSELF (ADDENDUM 18 ruling 40, the owner's): an observation is a BARE PASSIVE with no observer named — never "in the survey's time here", "on the nights the survey kept", "it is observed that", "this office".

(2c) COVERT FIELDS AND THEIR SYMPTOMS ON THIS BLOCK (ADDENDUM 18 ruling 26) — the INVERTED test the refuter judges a `compromised` face under
    hall ← powerStructure.criminalCaptureState at `corrupted` or `capture`
        SYMPTOM: THE PURSE AND THE ACCOUNTS — what the hall says the town's money does, and who decides it. DS-DEF-4 says the fact outright ("the hall's decisions are not the hall's"), so a hall face on a purse pool may reassure that the accounts are in order and may deny NOTHING ELSE.
        marks the pools: Invasion & War: walls with NO force · Economic Survival: STRONG · Economic Survival: ADEQUATE · Economic Survival: WEAK
        this pool is NOT one of them — here the source draws as any source
    watch ← a bloc carrying `covert: true` (settlementPolitics)
        SYMPTOM: THE WATCH'S OWN KEEPING — the circuit, the wage, who is on the walk after dark. A watch face on an internal-security pool may say the patrol is kept as it has always been kept, and may deny nothing about the court, the purse or the walls.
        marks the pools: Internal Security: full legal chain (court AND prison) · Internal Security: detention without process · Internal Security: no legal infrastructure
        this pool is NOT one of them — here the source draws as any source
    court ← a bloc carrying `covert: true` (settlementPolitics)
        SYMPTOM: WHAT REACHES THE LAW AND WHAT IT DOES WITH IT — a court face on a legal-chain pool may hold that matters are heard as they should be, and may deny nothing else.
        marks the pools: Internal Security: full legal chain (court AND prison) · Internal Security: court without detention
        this pool is NOT one of them — here the source draws as any source
  ⛔ THE INVERTED TEST. A face tagged `compromised` is the ONE place the reassurance tell is the point (ruling 26 (a)), and FLOOR 1 IS RE-POINTED FOR IT ALONE (26 (b)): it may deny the VISIBLE SYMPTOM of the very field it is compromised by, in the direction of CONCEALMENT ONLY. It never denies an unrelated field, never a required row, and never names the covert fact. The archiver reports it as flatly as any account: no wink.
  ⛔ THE CONCEALMENT MUST NOT IDENTIFY (26 (f)): offer more than one shape — dismiss · reassure · minimise · change the subject · blame the source of the talk · say nothing beyond the form. An HONEST source may also reassure truthfully on a small share of honest towns, so a reassurance on the page is a question and never an answer.
  ⛔ AND THE SOURCE IS SILENT SOME OF THE TIME (26 (h)): where a compromised source is present on a marked pool, a roll seeded on the world seed, the pool key, the settlement and the CURRENT YEAR decides whether it speaks (0.7) or says nothing. Its silence is a behaviour, and the roll decides WHO SPEAKS and never WHAT IS TRUE.
  ⛔ THE TAG IS REFUSED on any source no covert field can compromise; the table is CLOSED: hall · watch · court.

  PLACEMENTS A FACE MAY NOT ASSERT — where a body STANDS, stated by the data at some preimage tiers and not others, or stated with a hedge
    Burial grounds and charnel house: "inside the walls" — stated only at city — silent at thorp, village, town, metropolis   [the catalog row]
        the data says: "The parish grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next."
    Burial grounds and charnel house: "outside the gates" — stated only at city — silent at thorp, village, town, metropolis   [the catalog row · the `Burial` service]
        the data says: "New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening."
    Market square: "in the square" — stated only at town — silent at thorp, village, city, metropolis   [the `Civic announcements` service]
        the data says: "Official proclamations, wanted notices, and public notices read in the square."
    Parish burial grounds: "beyond the gate" — stated only at town — silent at thorp, village, city, metropolis   [the catalog row]
        the data says: "Each parish keeps its own ground beside its church, and a parish that has filled its ground buries beyond the gate instead."
  ⛔ A FACE DRAWS ON EVERY TOWN OF THE PREIMAGE, so a placement the data states only at the city is an INVENTION on the thorp (floor 2), and a hedged one is a tendency rather than this town's fact.

(2d) THE KEY'S SIBLING RUNGS — what this pool's key would have been had ONE of the fields it fixes been otherwise
    monsterThreat = "heartland" HERE
        monsterThreat = "frontier" -> `Beasts & Monsters: frontier, credible deterrence`
        monsterThreat = "plagued" -> `Beasts & Monsters: plagued, perimeter AND organized force`
  ⛔ A FACE THAT READS AS A NEIGHBOURING RUNG IS A FLOOR-1 FINDING (ADDENDUM 18 ruling 35). These pools have their OWN faces and their own towns: a sentence here that would sit as comfortably on one of them is either saying nothing this key fixes, or is saying something this key fixes is FALSE. The refuter names the rung.

(3) THE SAME-PAGE READ SET — tab `defense`: corpus blocks DS-DEF-3, DS-DEF-2, DS-DEF-5, DS-DEF-1, DS-DEF-8, DS-DEF-11, DS-DEF-4, DS-DEF-6 + machine producers
  defenseProfile.readiness.score                       [SNAPSHOT] writers  0   <- DS-DEF-1
  name                                                 [PULSE] writers 201   <- DS-DEF-1, DS-DEF-4
  config.monsterThreat                                 [CONFIG] writers  0   <- DS-DEF-2, DS-DEF-11, buildThreatAssessment, generateSafetyProfile
  institutions[bucket=walls]                           [LIVE-ROSTER] writers 38   <- DS-DEF-2, DS-DEF-5, DS-DEF-11
  institutions[bucket=garrison]                        [LIVE-ROSTER] writers 38   <- DS-DEF-2, DS-DEF-5
  institutions[bucket=militia]                         [LIVE-ROSTER] writers 38   <- DS-DEF-2, DS-DEF-5
  economicState.compound.inst.hasCourtSystem           [SNAPSHOT] writers  0   <- DS-DEF-2, buildThreatAssessment, deriveSupportingCapabilities
  economicState.compound.inst.hasPrison                [SNAPSHOT] writers  0   <- DS-DEF-2, buildThreatAssessment, deriveSupportingCapabilities
  defenseProfile.scores.economic                       [SNAPSHOT] writers  0   <- DS-DEF-2, buildThreatAssessment, deriveDefenseReadiness, deriveSupportingCapabilities
  economicState.compound.inst.hasGranary               [SNAPSHOT] writers  0   <- DS-DEF-2, DS-DEF-6, buildThreatAssessment, deriveDefenseReadiness, deriveSupportingCapabilities
  economicState.compound.inst.hasHospital              [SNAPSHOT] writers  0   <- DS-DEF-2, buildThreatAssessment, deriveDefenseReadiness, deriveSupportingCapabilities
  economicState.compound.inst.hasChurch                [SNAPSHOT] writers  0   <- DS-DEF-2, buildThreatAssessment, deriveDefenseReadiness, deriveSupportingCapabilities
  economicState.safetyProfile.safetyLabel              [SNAPSHOT] writers  0   <- DS-DEF-3, buildThreatAssessment
  structureKey                                         [SNAPSHOT] writers  0   <- DS-DEF-4
  standingDefenseForces(settlement)                    [LIVE-ROSTER] writers  0   <- DS-DEF-5
  institutions[bucket=watch]                           [LIVE-ROSTER] writers 38   <- DS-DEF-5
  institutions[bucket=mercenary]                       [LIVE-ROSTER] writers 38   <- DS-DEF-5
  institutions[bucket=charter]                         [LIVE-ROSTER] writers 38   <- DS-DEF-5
  magicWorksAt({ settlement })                         [SNAPSHOT] writers  0   <- DS-DEF-5
  economicState.compound.inst.hasPort                  [SNAPSHOT] writers  0   <- DS-DEF-6, deriveSupportingCapabilities
  config.tradeRouteAccess                              [CONFIG] writers  0   <- DS-DEF-6, deriveSupportingCapabilities
  economicState.foodSecurity.stockpile.blockaded       [SNAPSHOT] writers  0   <- DS-DEF-6, deriveSupportingCapabilities
  economicState.compound.inst.hasNavy                  [SNAPSHOT] writers  0   <- DS-DEF-6, deriveSupportingCapabilities
  stress                                               [SNAPSHOT] writers  0   <- DS-DEF-8
  economicViability.viable                             [SNAPSHOT] writers  0   <- DS-DEF-8
  defenseProfile.economicGates.military                [SNAPSHOT] writers  0   <- DS-DEF-11
  tier                                                 [SNAPSHOT] writers  0   <- DS-DEF-11
  defenseProfile                                       [PULSE] writers  1   <- buildThreatAssessment, deriveSupportingCapabilities
  defenseProfile.institutions                          [SNAPSHOT] writers  0   <- buildThreatAssessment, deriveSupportingCapabilities, deriveArmedForces
  defenseProfile.institutions.charter                  [SNAPSHOT] writers  0   <- buildThreatAssessment, deriveArmedForces
  defenseProfile.institutions.garrison                 [SNAPSHOT] writers  0   <- buildThreatAssessment, deriveArmedForces
  defenseProfile.institutions.militia                  [SNAPSHOT] writers  0   <- buildThreatAssessment, deriveArmedForces
  defenseProfile.institutions.walls                    [SNAPSHOT] writers  0   <- buildThreatAssessment, deriveArmedForces
  defenseProfile.scores                                [PULSE] writers  1   <- buildThreatAssessment, deriveDefenseReadiness, deriveSupportingCapabilities
  defenseProfile.scores.internal                       [SNAPSHOT] writers  0   <- buildThreatAssessment, deriveDefenseReadiness
  defenseProfile.scores.military                       [SNAPSHOT] writers  0   <- buildThreatAssessment, deriveDefenseReadiness
  economicState.compound.inst                          [SNAPSHOT] writers  0   <- buildThreatAssessment, deriveDefenseReadiness, deriveSupportingCapabilities
  economicState.safetyProfile                          [SNAPSHOT] writers  0   <- buildThreatAssessment
  defenseProfile.economicGates                         [SNAPSHOT] writers  0   <- deriveDefenseReadiness
  defenseProfile.economicGates.[*]                     [SNAPSHOT] writers  0   <- deriveDefenseReadiness
  defenseProfile.scores.disaster                       [PULSE] writers  1   <- deriveDefenseReadiness
  defenseProfile.scores.monster                        [SNAPSHOT] writers  0   <- deriveDefenseReadiness
  economicState.foodSecurity.resilienceScore           [SNAPSHOT] writers  0   <- deriveDefenseReadiness
  economicState.safetyProfile.guardEffectivenessDesc   [SNAPSHOT] writers  0   <- deriveGuardAssessment
  institutions                                         [LIVE-ROSTER] writers 38   <- deriveCriminalStructure
  defenseProfile.institutions.magicDef                 [SNAPSHOT] writers  0   <- deriveSupportingCapabilities, deriveArmedForces
  defenseProfile.scores.magical                        [SNAPSHOT] writers  0   <- deriveSupportingCapabilities
  economicState.compound.inst.hasMagicInst             [SNAPSHOT] writers  0   <- deriveSupportingCapabilities
  economicState.foodSecurity.stockpile                 [SNAPSHOT] writers  0   <- deriveSupportingCapabilities
  economicState.foodSecurity.stockpile.blockadeBypass  [SNAPSHOT] writers  0   <- deriveSupportingCapabilities
  defenseProfile.institutions.mercenary                [SNAPSHOT] writers  0   <- deriveArmedForces
  defenseProfile.institutions.watch                    [SNAPSHOT] writers  0   <- deriveArmedForces
  config.stressType                                    [CONFIG] writers  0   <- generateSafetyProfile
  config.stressTypes                                   [CONFIG] writers  0   <- generateSafetyProfile
  institutions@generation                              [SNAPSHOT (generation-time input of a stored string)] writers 38   <- generateSafetyProfile
  UNRESOLVED census reads (printed, not normalised): DS-DEF-4 :: structure organized :: key (via CRIMINAL_STRUCTURE_POOL in defenseStateProse.js) ; DS-DEF-4 :: structure semi-organized :: key (via CRIMINAL_STRUCTURE_POOL in defenseStateProse.js) ; DS-DEF-4 :: structure diffuse :: key (via CRIMINAL_STRUCTURE_POOL in defenseStateProse.js)
  producer reads through helpers (generation-time flag builders, tables): row.assess · row.color · row.label · i.name · m.name · c.type · e.condition · getInstFlags(config, institutions).criminalEffective · getInstFlags(config, institutions).inst · getInstFlags(config, institutions).inst.hasAlchemist · getInstFlags(config, institutions).inst.hasCharterHall · getInstFlags(config, institutions).inst.hasChurch · getInstFlags(config, institutions).inst.hasCourtSystem · getInstFlags(config, institutions).inst.hasGangInfra · getInstFlags(config, institutions).inst.hasGarrison · getInstFlags(config, institutions).inst.hasGates · getInstFlags(config, institutions).inst.hasMagesGuild · getInstFlags(config, institutions).inst.hasMagicInst · getInstFlags(config, institutions).inst.hasMercenary · getInstFlags(config, institutions).inst.hasMerchantGuild · getInstFlags(config, institutions).inst.hasMilitaryInst · getInstFlags(config, institutions).inst.hasMilitia · getInstFlags(config, institutions).inst.hasPort · getInstFlags(config, institutions).inst.hasPrison · getInstFlags(config, institutions).inst.hasSmuggling · getInstFlags(config, institutions).inst.hasThievesGuild · getInstFlags(config, institutions).inst.hasWalls · getInstFlags(config, institutions).inst.hasWatch · getInstFlags(config, institutions).inst.hasWizardTower · getInstFlags(config, institutions).militaryEffective · getPriorities(config).economy · getPriorities(config).magic · getStressFlags(config, institutions).arcaneBlackMarket · getStressFlags(config, institutions).crimeIsGovt · getStressFlags(config, institutions).crusaderSynthesis · getStressFlags(config, institutions).merchantArmy · getStressFlags(config, institutions).merchantCriminalBlur · getStressFlags(config, institutions).religiousFraud · getStressFlags(config, institutions).stateCrime
  ⚠ SEAM: the machine rows read defenseProfile.institutions.* (SNAPSHOT) and safetyProfile reads the generation roster; a force key reads the LIVE roster — equal at generation, divergent after a ruin.

(4) THE SIBLING SENTENCES — on-page machine strings that can fire beside this key (excluded only where the predicate is definitely false under the key)
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:94  CAN CO-FIRE (predicate open)
      "Safe heartland: the existing defenses are substantially more than the threat level requires."
      when: !(threat === 'plagued')  AND  !(threat === 'frontier')  AND  hasWalls && hasGarrison
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:96  CAN CO-FIRE (predicate open)
      "Safe heartland with minimal creature activity. Existing defenses are appropriate. The primary threats here are internal."
      when: !(threat === 'plagued')  AND  !(threat === 'frontier')  AND  !(hasWalls && hasGarrison)  AND  hasWalls || hasGarrison || hasMilitia || hasCharter
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:98  CAN CO-FIRE (predicate open)
      "Safe heartland with no organized defense. Acceptable given the threat environment."
      when: !(threat === 'plagued')  AND  !(threat === 'frontier')  AND  !(hasWalls && hasGarrison)  AND  !(hasWalls || hasGarrison || hasMilitia || hasCharter)
  • [buildThreatAssessment -> mil] src/domain/display/threatAssessment.js:115  CAN CO-FIRE (predicate open)
      "Walls and professional garrison provide meaningful deterrence against raiding and conventional assault. Not rated for sustained siege without significant supply stockpiles."
      when: hasWalls && hasGarrison
  • [buildThreatAssessment -> mil] src/domain/display/threatAssessment.js:117  CAN CO-FIRE (predicate open)
      "Walls with citizen militia: credible deterrence against raiders, inadequate against any professional force with siege capability."
      when: !(hasWalls && hasGarrison)  AND  hasWalls && hasMilitia
  • [buildThreatAssessment -> mil] src/domain/display/threatAssessment.js:119  CAN CO-FIRE (predicate open)
      "Walls present but no organized military force to man them. A determined attacker takes the walls if they have ladders and time."
      when: !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  hasWalls
  • [buildThreatAssessment -> mil] src/domain/display/threatAssessment.js:121  CAN CO-FIRE (predicate open)
      "Professional garrison without perimeter walls. Effective against raiders; cannot hold against a siege."
      when: !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  !(hasWalls)  AND  hasGarrison
  • [buildThreatAssessment -> mil] src/domain/display/threatAssessment.js:123  CAN CO-FIRE (predicate open)
      "Armed citizens who know their ground. Effective against disorganized raiders. No counter to a disciplined military force."
      when: !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  !(hasWalls)  AND  !(hasGarrison)  AND  hasMilitia
  • [buildThreatAssessment -> mil] src/domain/display/threatAssessment.js:125  CAN CO-FIRE (predicate open)
      "No walls or garrison. Cannot resist organized military aggression. Survival depends entirely on distance, diplomacy, or irrelevance to the attacker."
      when: !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  !(hasWalls)  AND  !(hasGarrison)  AND  !(hasMilitia)
  • [buildThreatAssessment -> intA] src/domain/display/threatAssessment.js:140  UNCONDITIONAL
      "Internal security: ${sl}. "
  • [buildThreatAssessment -> intA] src/domain/display/threatAssessment.js:142  CAN CO-FIRE (predicate open)
      "Active violence and organized crime make internal order the primary threat. "
      when: sl.includes('Dangerous')
  • [buildThreatAssessment -> intA] src/domain/display/threatAssessment.js:145  CAN CO-FIRE (predicate open)
      "Full legal infrastructure provides enforcement capacity."
      when: f.hasCourtSystem && f.hasPrison
  • [buildThreatAssessment -> intA] src/domain/display/threatAssessment.js:147  CAN CO-FIRE (predicate open)
      "Courts prosecute but limited detention."
      when: !(f.hasCourtSystem && f.hasPrison)  AND  f.hasCourtSystem
  • [buildThreatAssessment -> intA] src/domain/display/threatAssessment.js:149  CAN CO-FIRE (predicate open)
      "Detention without systematic prosecution."
      when: !(f.hasCourtSystem && f.hasPrison)  AND  !(f.hasCourtSystem)  AND  f.hasPrison
  • [buildThreatAssessment -> intA] src/domain/display/threatAssessment.js:151  CAN CO-FIRE (predicate open)
      "No legal infrastructure: order relies on force alone."
      when: !(f.hasCourtSystem && f.hasPrison)  AND  !(f.hasCourtSystem)  AND  !(f.hasPrison)
  • [buildThreatAssessment -> econA] src/domain/display/threatAssessment.js:167  CAN CO-FIRE (predicate open)
      "Strong economic base can absorb a sustained crisis. Tax revenue funds emergency measures and sustains garrison pay during prolonged engagement."
      when: econScore >= 65
  • [buildThreatAssessment -> econA] src/domain/display/threatAssessment.js:169  CAN CO-FIRE (predicate open)
      "Adequate economic resilience for a short-term crisis. A prolonged siege will begin straining reserves within months."
      when: !(econScore >= 65)  AND  econScore >= 40
  • [buildThreatAssessment -> econA] src/domain/display/threatAssessment.js:171  CAN CO-FIRE (predicate open)
      "Chronic underfunding limits emergency response. A sustained crisis will exhaust reserves and undermine garrison morale."
      when: !(econScore >= 65)  AND  !(econScore >= 40)  AND  econScore >= 25
  • [buildThreatAssessment -> econA] src/domain/display/threatAssessment.js:173  CAN CO-FIRE (predicate open)
      "Economic base cannot support crisis response. Any sustained threat quickly overwhelms the capacity to respond."
      when: !(econScore >= 65)  AND  !(econScore >= 40)  AND  !(econScore >= 25)
  • [buildThreatAssessment -> disA] src/domain/display/threatAssessment.js:181  UNCONDITIONAL
      "${?1}${?2}"
      ${?1} when f.hasGranary: "Granary provides food buffer. The community can absorb a bad harvest without immediate hardship."
      ${?1} when !(f.hasGranary): "No food reserves. A crop failure or supply disruption causes immediate hardship."
      ${?2} when f.hasHospital: " Hospital infrastructure enables disease containment and systematic quarantine."
      ${?2} when !(f.hasHospital) && f.hasChurch: " Parish clergy provide basic wound care: better than nothing, worse than a hospital."
      ${?2} when !(f.hasHospital) && !(f.hasChurch): " No medical infrastructure. Plague spreads until it burns out."
  • [(module) -> note] src/domain/display/defenseDisplay.js:163  UNCONDITIONAL
      "A structured criminal hierarchy controls what crime is permitted. Predictable rules, a hierarchy to negotiate with. Or cross. Random violence is suppressed because it draws enforcement. The real danger is systematic: protection, extortion, corruption of officials."
  • [(module) -> note] src/domain/display/defenseDisplay.js:167  UNCONDITIONAL
      "Criminal activity is coordinated enough to maintain routes and territories but lacks a single controlling authority. Multiple factions may be competing. Less predictable than a guild, more structured than street crime."
  • [(module) -> note] src/domain/display/defenseDisplay.js:171  UNCONDITIONAL
      "Opportunistic crime without organizational infrastructure. Fences, bandits, and minor operators work independently. Less politically dangerous but harder to suppress. No single node to threaten or buy off."
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:221  CAN CO-FIRE (predicate open)
      "Full pay, maintained equipment, reserve capacity."
      when: econScore >= 65
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:221  CAN CO-FIRE (predicate open)
      "Adequate upkeep, some shortfalls."
      when: !(econScore >= 65)  AND  econScore >= 40
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:221  CAN CO-FIRE (predicate open)
      "Irregular pay, worn equipment, morale risk."
      when: !(econScore >= 65)  AND  !(econScore >= 40)  AND  econScore >= 25
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:221  CAN CO-FIRE (predicate open)
      "Cannot sustain forces. Systemic breakdown."
      when: !(econScore >= 65)  AND  !(econScore >= 40)  AND  !(econScore >= 25)
  • [deriveSupportingCapabilities -> status] src/domain/display/defenseDisplay.js:225  CAN CO-FIRE (predicate open)
      "Arcane support"
      when: f.hasMagicInst
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:227  CAN CO-FIRE (predicate open)
      "${magicDef.slice(0, 2).map((m) => m.name).join(', ')}. Detection, wards, counterspell."
      when: f.hasMagicInst
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:227  CAN CO-FIRE (predicate open)
      "Conventional defense only. Invisible threats go undetected and unanswered."
      when: !(f.hasMagicInst)
  • [deriveSupportingCapabilities -> status] src/domain/display/defenseDisplay.js:231  CAN CO-FIRE (predicate open)
      "Court + Prison"
      when: f.hasCourtSystem && f.hasPrison
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:233  CAN CO-FIRE (predicate open)
      "Full enforcement chain. Arrest, prosecute, detain."
      when: f.hasCourtSystem && f.hasPrison
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:233  CAN CO-FIRE (predicate open)
      "Courts without detention. Fines and exile only."
      when: !(f.hasCourtSystem && f.hasPrison)  AND  f.hasCourtSystem
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:233  CAN CO-FIRE (predicate open)
      "Detention without process. Arbitrary enforcement."
      when: !(f.hasCourtSystem && f.hasPrison)  AND  !(f.hasCourtSystem)  AND  f.hasPrison
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:233  CAN CO-FIRE (predicate open)
      "No deterrence beyond force."
      when: !(f.hasCourtSystem && f.hasPrison)  AND  !(f.hasCourtSystem)  AND  !(f.hasPrison)
  • [deriveSupportingCapabilities -> status] src/domain/display/defenseDisplay.js:237  CAN CO-FIRE (predicate open)
      "Hospital present"
      when: f.hasHospital
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:239  CAN CO-FIRE (predicate open)
      "Casualty treatment, outbreak containment, recovery capacity."
      when: f.hasHospital
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:239  CAN CO-FIRE (predicate open)
      "Parish care. Basic wound and disease management."
      when: !(f.hasHospital)  AND  f.hasChurch
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:239  CAN CO-FIRE (predicate open)
      "No dedicated healers. Plague burns unchecked."
      when: !(f.hasHospital)  AND  !(f.hasChurch)
  • [deriveSupportingCapabilities -> status] src/domain/display/defenseDisplay.js:243  CAN CO-FIRE (predicate open)
      "Granary present"
      when: f.hasGranary
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:245  CAN CO-FIRE (predicate open)
      "Granary + sea access. Historically the hardest siege posture to break."
      when: f.hasGranary  AND  f.hasPort
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:245  CAN CO-FIRE (predicate open)
      "Granary in isolation. Endurance depends entirely on stored reserves."
      when: f.hasGranary  AND  !(f.hasPort)  AND  tradeAccess === 'isolated'
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:245  CAN CO-FIRE (predicate open)
      "Granary with road supply. Cut the roads, cut the supply."
      when: f.hasGranary  AND  !(f.hasPort)  AND  !(tradeAccess === 'isolated')
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:245  CAN CO-FIRE (predicate open)
      "No reserves, but sea supply continues while port is open."
      when: !(f.hasGranary)  AND  tradeAccess === 'port'
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:245  CAN CO-FIRE (predicate open)
      "No food buffer. Any supply disruption becomes a survival crisis within days."
      when: !(f.hasGranary)  AND  !(tradeAccess === 'port')
  • [deriveSupportingCapabilities -> status] src/domain/display/defenseDisplay.js:259  CAN CO-FIRE (predicate open)
      "Under blockade"
      when: f.hasNavy || f.hasPort  AND  blockaded
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:263  CAN CO-FIRE (predicate open)
      "A hostile fleet blockades the sea approaches. Only a teleportation circle still runs supply past it."
      when: f.hasNavy || f.hasPort  AND  blockaded  AND  bypass === 'teleport'
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:265  CAN CO-FIRE (predicate open)
      "A hostile fleet blockades the sea approaches. Airships run the blockade, impaired by siege countermeasures."
      when: f.hasNavy || f.hasPort  AND  blockaded  AND  !(bypass === 'teleport')  AND  bypass === 'airship'
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:266  CAN CO-FIRE (predicate open)
      "A hostile fleet blockades the sea approaches. The port is choked, and no magical channel runs the line."
      when: f.hasNavy || f.hasPort  AND  blockaded  AND  !(bypass === 'teleport')  AND  !(bypass === 'airship')
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:268  CAN CO-FIRE (predicate open)
      "Naval force controls sea approaches. Amphibious assault requires fleet superiority."
      when: f.hasNavy || f.hasPort  AND  !(blockaded)  AND  f.hasNavy
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:269  CAN CO-FIRE (predicate open)
      "Port facility but no naval force. Sea approaches are accessible to any vessel."
      when: f.hasNavy || f.hasPort  AND  !(blockaded)  AND  !(f.hasNavy)
  • [deriveDefenseReadiness -> fundingNote] src/domain/display/defenseDisplay.js:320  CAN CO-FIRE (predicate open)
      "Upkeep underfunded: ${expense} at ${Math.round(/** @type {number} */ (gate) * 100)}%"
      when: Number.isFinite(gate) && /** @type {number} */ (gate) < 1
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:105  CAN CO-FIRE (predicate open)
      "Movement is restricted and monitored. ${curfewAuthority} curfew and checkpoint protocols. Common crime is suppressed by authoritarian presence. Residents face little risk from thieves and considerably more from informers and occupation officials. Resistance activity operates underground."
      when: hasStress('occupied')
      ${curfewAuthority} when inst.hasGarrison: "The garrison, now under occupier command, enforces"
      ${curfewAuthority} when !(inst.hasGarrison): "Occupation authorities enforce"
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:116  CAN CO-FIRE (predicate open)
      "Siege conditions have transformed the settlement's social character. ${milRef} with increasing severity as supplies run low. Rationing disputes, black market food trading, and desperation theft are rising."
      when: hasStress('under_siege')
      ${milRef} when inst.hasGarrison: "The garrison maintains order"
      ${milRef} when !(inst.hasGarrison): "Military command has assumed civil authority"
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:128  CAN CO-FIRE (predicate open)
      "Hunger has destabilised the normal social order. ${foodRef}. Desperation theft is rampant and difficult to distinguish from survival. Those with food stores face targeted theft or worse."
      when: hasStress('famine')
      ${foodRef} when inst.hasGarrison: "The garrison focuses on food distribution enforcement"
      ${foodRef} when !(inst.hasGarrison): "Authority is increasingly exercised around food access"
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:141  CAN CO-FIRE (predicate open)
      "Disease has reorganised daily life around containment and fear. ${quarRef}, with mixed compliance. Violence against the sick is a genuine risk. Price gouging on medicines and burial services is widespread."
      when: hasStress('plague_onset')
      ${quarRef} when inst.hasGarrison: "The garrison enforces quarantine zones"
      ${quarRef} when !(inst.hasGarrison) && inst.hasWatch: "The watch manages quarantine compliance"
      ${quarRef} when !(inst.hasGarrison) && !(inst.hasWatch): "Informal community enforcement maintains quarantine"
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:152  CAN CO-FIRE (predicate open)
      "The settlement is experiencing organised resistance. Patrol patterns have changed. Movement between districts may be restricted. Loyalties are unclear."
      when: !hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')  AND  hasStress('insurgency')
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:160  CAN CO-FIRE (predicate open)
      "Active armed conflict between revolt participants and security forces in contested districts. Civilians are avoiding specific streets. Normal patrol patterns have been abandoned."
      when: !hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')  AND  hasStress('slave_revolt')
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:168  CAN CO-FIRE (predicate open)
      "War has reorganised daily life. Strangers are viewed with heightened suspicion. Price controls and curfews are sporadically enforced."
      when: !hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')  AND  hasStress('wartime')
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:176  CAN CO-FIRE (predicate open)
      "No stable governing authority. Enforcement is inconsistent; which faction controls a district determines what rules apply."
      when: !hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')  AND  hasStress('politically_fractured')
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:183  CAN CO-FIRE (predicate open)
      "Authority is contested. The watch is uncertain whose orders to follow. Opportunistic crime is rising in the gap."
      when: !hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')  AND  hasStress('succession_void')
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:190  CAN CO-FIRE (predicate open)
      "The settlement is processing a betrayal. Strangers are viewed with heightened suspicion. Informal loyalty checks are common."
      when: !hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')  AND  hasStress('recently_betrayed')
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:197  CAN CO-FIRE (predicate open)
      "Monster pressure from the surrounding region has changed how the settlement operates after dark. Outlying areas are avoided. Night movement is restricted."
      when: !hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')  AND  hasStress('monster_pressure')
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:205  CAN CO-FIRE (predicate open)
      "Debt service obligations shape every civic decision. The creditor representative has effective veto power over enforcement priorities."
      when: !hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')  AND  hasStress('indebted')
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:212  CAN CO-FIRE (predicate open)
      "The settlement is absorbing more people than its infrastructure was built for. Friction between established residents and newcomers is visible. The watch is overwhelmed by unfamiliar faces."
      when: !hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')  AND  hasStress('mass_migration')
  • [generateSafetyProfile -> safetyDescs[]] src/generators/safetyProfile.js:220  CAN CO-FIRE (predicate open)
      "The religious shift has divided the settlement. Each faction suspects the other of reporting to the relevant authority. Enforcement of the new order is inconsistent."
      when: !hasStress('occupied') && !hasStress('under_siege') && !hasStress('famine') && !hasStress('plague_onset')  AND  hasStress('religious_conversion')
  • [generateSafetyProfile -> safetyLabel] src/generators/safetyProfile.js:241  CAN CO-FIRE (predicate open)
      "Controlled — Authoritarian"
      when: !(safetyStrains.length > 0)  AND  stress.stateCrime
  • [generateSafetyProfile -> safetyDesc] src/generators/safetyProfile.js:245  CAN CO-FIRE (predicate open)
      "The streets are unusually quiet. ${visibleAuthority} Residents face little risk from common thieves and considerably more from the authorities themselves. Unofficial disappearances are not discussed openly."
      when: !(safetyStrains.length > 0)  AND  stress.stateCrime
      ${visibleAuthority} when inst.hasGarrison: "The garrison is visible everywhere."
      ${visibleAuthority} when !(inst.hasGarrison): "Armed officials are visible everywhere."
  • [generateSafetyProfile -> safetyLabel] src/generators/safetyProfile.js:248  CAN CO-FIRE (predicate open)
      "Dangerous — Criminal Governance"
      when: !(safetyStrains.length > 0)  AND  !(stress.stateCrime)  AND  stress.crimeIsGovt
  • [generateSafetyProfile -> safetyDesc] src/generators/safetyProfile.js:251  CAN CO-FIRE (predicate open)
      "There is no meaningful distinction between criminal organizations and civil authority here. ${crimeRef} provides order of a sort: its own. Protection must be purchased; those who cannot pay are unprotected.${garNote}"
      when: !(safetyStrains.length > 0)  AND  !(stress.stateCrime)  AND  stress.crimeIsGovt
      ${crimeRef} when inst.hasThievesGuild: "The thieves' guild"
      ${crimeRef} when !(inst.hasThievesGuild): "Organized crime"
      ${garNote} when inst.hasGarrison: " The garrison takes orders from criminal leadership."
      ${garNote} when !(inst.hasGarrison): ""
  • [generateSafetyProfile -> safetyDesc] src/generators/safetyProfile.js:277  CAN CO-FIRE (predicate open)
      "Effective ${lawRef} and low criminal activity make this among the safest settlements in the region. Visitors can move freely at all hours.${wallNote}${charNote}${threatNote}"
      when: !(safetyStrains.length > 0)  AND  !(stress.stateCrime)  AND  !(stress.crimeIsGovt)  AND  effectiveSafety >= 3.5
      ${lawRef} when inst.hasGarrison && inst.hasWatch: "garrison and ${watchLabel}"
      ${lawRef} when inst.hasGarrison && !(inst.hasWatch): "garrison"
      ${lawRef} when !(inst.hasGarrison) && inst.hasWatch: "${watchLabel}"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && inst.hasMilitia: "militia"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia): "law enforcement"
      ${wallNote} when inst.hasWalls: " Walls and controlled entry points reinforce the guard's ability to monitor movement."
      ${wallNote} when !(inst.hasWalls): ""
      ${charNote} when inst.hasCharterHall: " The adventurers' charter hall handles threats the watch cannot."
      ${charNote} when !(inst.hasCharterHall): ""
      ${threatNote} when threat === 'plagued': " The constant monster threat keeps the guard exceptionally well-drilled and alert."
      ${threatNote} when !(threat === 'plagued'): ""
  • [generateSafetyProfile -> safetyDesc] src/generators/safetyProfile.js:284  CAN CO-FIRE (predicate open)
      "Crime exists but is well-managed. ${lawRef} is present and responsive. Petty theft is the primary risk; organized crime has a limited foothold.${courtNote}${wallNote}"
      when: !(safetyStrains.length > 0)  AND  !(stress.stateCrime)  AND  !(stress.crimeIsGovt)  AND  !(effectiveSafety >= 3.5)  AND  effectiveSafety >= 2
      ${lawRef} when inst.hasGarrison: "The garrison"
      ${lawRef} when !(inst.hasGarrison) && inst.hasWatch: "The watch"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && inst.hasMilitia: "The militia"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia): "Local enforcement"
      ${courtNote} when inst.hasCourtSystem: " A functioning court system means organized crime operates with greater caution."
      ${courtNote} when !(inst.hasCourtSystem): ""
      ${wallNote} when inst.hasWalls: " Walls limit access and give the guard leverage over smuggling and movement."
      ${wallNote} when !(inst.hasWalls): ""
  • [generateSafetyProfile -> safetyDesc] src/generators/safetyProfile.js:291  CAN CO-FIRE (predicate open)
      "A mix of safer and more exposed areas. ${lawRef} the main paths; quieter spots after dark carry genuine risk. Residents know which corners to avoid.${wallNote}"
      when: !(safetyStrains.length > 0)  AND  !(stress.stateCrime)  AND  !(stress.crimeIsGovt)  AND  !(effectiveSafety >= 3.5)  AND  !(effectiveSafety >= 2)  AND  effectiveSafety >= 1.2
      ${lawRef} when inst.hasGarrison: "The garrison patrols"
      ${lawRef} when !(inst.hasGarrison) && inst.hasWatch: "The watch covers"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && inst.hasMilitia: "Militia volunteers patrol"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia): "Locals watch over"
      ${wallNote} when inst.hasWalls: " The walls contain the problem somewhat: crime is concentrated inside rather than spilling into the surrounding territory."
      ${wallNote} when !(inst.hasWalls): ""
  • [generateSafetyProfile -> safetyDesc] src/generators/safetyProfile.js:302  CAN CO-FIRE (predicate open)
      "Crime is a persistent and visible problem. ${lawRef} Travelers are advised to move in groups and keep valuables hidden.${wallNote}"
      when: !(safetyStrains.length > 0)  AND  !(stress.stateCrime)  AND  !(stress.crimeIsGovt)  AND  !(effectiveSafety >= 3.5)  AND  !(effectiveSafety >= 2)  AND  !(effectiveSafety >= 1.2)  AND  effectiveSafety >= 0.6
      ${lawRef} when inst.hasGarrison: "The garrison is overwhelmed or corrupt."
      ${lawRef} when !(inst.hasGarrison) && inst.hasWatch: "The watch is stretched far beyond its capacity."
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && inst.hasMilitia: "The militia cannot maintain consistent coverage. They have other jobs to do."
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && inst.hasMercenary: "The mercenary company focuses on protecting those who pay them, not the general population."
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary): "There is no meaningful guard presence."
      ${wallNote} when inst.hasWalls: " Walls slow entry but don't solve what happens inside them."
      ${wallNote} when !(inst.hasWalls): ""
  • [generateSafetyProfile -> safetyDesc] src/generators/safetyProfile.js:313  CAN CO-FIRE (predicate open)
      "Violence and theft are routine. ${lawRef} Residents protect themselves through community networks or tribute paid to whoever controls their street.${courtNote}${wallNote}"
      when: !(safetyStrains.length > 0)  AND  !(stress.stateCrime)  AND  !(stress.crimeIsGovt)  AND  !(effectiveSafety >= 3.5)  AND  !(effectiveSafety >= 2)  AND  !(effectiveSafety >= 1.2)  AND  !(effectiveSafety >= 0.6)
      ${lawRef} when inst.hasGarrison: "The garrison is a formality: present on paper, absent in practice."
      ${lawRef} when !(inst.hasGarrison) && inst.hasWatch: "The watch cannot respond effectively; reports are filed and forgotten."
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && inst.hasMilitia: "The militia musters for emergencies only; day-to-day crime is uncontested."
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && inst.hasMercenary: "The mercenary company has effectively become another criminal faction."
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary): "There is effectively no law enforcement."
      ${courtNote} when inst.hasCourtSystem: ""
      ${courtNote} when !(inst.hasCourtSystem): " With no court system, violence is the primary means of dispute resolution."
      ${wallNote} when inst.hasWalls: " Even the walls provide limited protection. The threat is within."
      ${wallNote} when !(inst.hasWalls): ""
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:340  CAN CO-FIRE (predicate open)
      "The ${lawRef} is well-organized but deployed as an instrument of state extraction rather than public protection. Loyalty is to whoever controls the payroll.${prisonNote}"
      when: inst.hasMilitaryInst  AND  stress.stateCrime
      ${lawRef} when inst.hasGarrison && inst.hasWatch: "garrison and ${watchLabel}"
      ${lawRef} when inst.hasGarrison && !(inst.hasWatch): "garrison"
      ${lawRef} when !(inst.hasGarrison) && inst.hasWatch: "${watchLabel}"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && inst.hasMilitia: "citizen militia"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && inst.hasMercenary: "mercenary company"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary) && inst.hasCharterHall: "adventurers' charter hall"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary) && !(inst.hasCharterHall): "local guard"
      ${prisonNote} when inst.hasCourtSystem && inst.hasPrison: " A functioning court and prison mean crimes carry real consequences."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && inst.hasCourtSystem: " A court exists, though the prison system is limited."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && inst.hasPrison: " Offenders can be jailed, but without a working court system enforcement is arbitrary."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && !(inst.hasPrison): " Without courts or prison, enforcement relies entirely on fines, exile, or summary violence."
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:344  CAN CO-FIRE (predicate open)
      "The ${lawRef} exists on paper. Chronically underpaid and poorly equipped${militiaNote}. Susceptible to bribery; enforcers who can be bought by whoever has coin.${prisonNote}"
      when: inst.hasMilitaryInst  AND  !(stress.stateCrime)  AND  flags.militaryEffective < 30 && pri.economy < 35
      ${lawRef} when inst.hasGarrison && inst.hasWatch: "garrison and ${watchLabel}"
      ${lawRef} when inst.hasGarrison && !(inst.hasWatch): "garrison"
      ${lawRef} when !(inst.hasGarrison) && inst.hasWatch: "${watchLabel}"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && inst.hasMilitia: "citizen militia"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && inst.hasMercenary: "mercenary company"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary) && inst.hasCharterHall: "adventurers' charter hall"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary) && !(inst.hasCharterHall): "local guard"
      ${militiaNote} when inst.hasMilitia: ": these are volunteers with day jobs, not soldiers"
      ${militiaNote} when !(inst.hasMilitia): ""
      ${prisonNote} when inst.hasCourtSystem && inst.hasPrison: " A functioning court and prison mean crimes carry real consequences."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && inst.hasCourtSystem: " A court exists, though the prison system is limited."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && inst.hasPrison: " Offenders can be jailed, but without a working court system enforcement is arbitrary."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && !(inst.hasPrison): " Without courts or prison, enforcement relies entirely on fines, exile, or summary violence."
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:349  CAN CO-FIRE (predicate open)
      "Public law enforcement is largely a formality. ${guildRef} maintain their own ${secRef}: real protection exists, but only for those with the right associations.${prisonNote}"
      when: inst.hasMilitaryInst  AND  !(stress.stateCrime)  AND  !(flags.militaryEffective < 30 && pri.economy < 35)  AND  stress.merchantArmy
      ${guildRef} when inst.hasMerchantGuild: "The merchant guilds"
      ${guildRef} when !(inst.hasMerchantGuild): "Wealthy interests"
      ${secRef} when inst.hasMercenary: "mercenary companies"
      ${secRef} when !(inst.hasMercenary): "private security"
      ${prisonNote} when inst.hasCourtSystem && inst.hasPrison: " A functioning court and prison mean crimes carry real consequences."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && inst.hasCourtSystem: " A court exists, though the prison system is limited."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && inst.hasPrison: " Offenders can be jailed, but without a working court system enforcement is arbitrary."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && !(inst.hasPrison): " Without courts or prison, enforcement relies entirely on fines, exile, or summary violence."
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:353  CAN CO-FIRE (predicate open)
      "The citizen militia is well-organized and motivated. These are people defending their own homes and livelihoods, which counts for something. Coverage is irregular by professional standards, but local knowledge compensates.${prisonNote}${wallNote}"
      when: inst.hasMilitaryInst  AND  !(stress.stateCrime)  AND  !(flags.militaryEffective < 30 && pri.economy < 35)  AND  !(stress.merchantArmy)  AND  inst.hasMilitia && !inst.hasGarrison && !inst.hasWatch  AND  flags.militaryEffective >= 55
      ${prisonNote} when inst.hasCourtSystem && inst.hasPrison: " A functioning court and prison mean crimes carry real consequences."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && inst.hasCourtSystem: " A court exists, though the prison system is limited."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && inst.hasPrison: " Offenders can be jailed, but without a working court system enforcement is arbitrary."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && !(inst.hasPrison): " Without courts or prison, enforcement relies entirely on fines, exile, or summary violence."
      ${wallNote} when inst.hasWalls: " Walls control entry points and give the guard a chokehold on smuggling routes."
      ${wallNote} when !(inst.hasWalls): ""
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:356  CAN CO-FIRE (predicate open)
      "The citizen militia musters when needed but cannot maintain consistent patrol. Volunteers with other work to do; reliable in a crisis, absent during routine crime.${prisonNote}"
      when: inst.hasMilitaryInst  AND  !(stress.stateCrime)  AND  !(flags.militaryEffective < 30 && pri.economy < 35)  AND  !(stress.merchantArmy)  AND  inst.hasMilitia && !inst.hasGarrison && !inst.hasWatch  AND  !(flags.militaryEffective >= 55)
      ${prisonNote} when inst.hasCourtSystem && inst.hasPrison: " A functioning court and prison mean crimes carry real consequences."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && inst.hasCourtSystem: " A court exists, though the prison system is limited."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && inst.hasPrison: " Offenders can be jailed, but without a working court system enforcement is arbitrary."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && !(inst.hasPrison): " Without courts or prison, enforcement relies entirely on fines, exile, or summary violence."
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:360  CAN CO-FIRE (predicate open)
      "A mercenary company provides enforcement: professional and effective, but loyal to the contract, not the community. When the coin stops, so does the protection.${prisonNote}${wallNote}"
      when: inst.hasMilitaryInst  AND  !(stress.stateCrime)  AND  !(flags.militaryEffective < 30 && pri.economy < 35)  AND  !(stress.merchantArmy)  AND  !(inst.hasMilitia && !inst.hasGarrison && !inst.hasWatch)  AND  inst.hasMercenary && !inst.hasGarrison
      ${prisonNote} when inst.hasCourtSystem && inst.hasPrison: " A functioning court and prison mean crimes carry real consequences."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && inst.hasCourtSystem: " A court exists, though the prison system is limited."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && inst.hasPrison: " Offenders can be jailed, but without a working court system enforcement is arbitrary."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && !(inst.hasPrison): " Without courts or prison, enforcement relies entirely on fines, exile, or summary violence."
      ${wallNote} when inst.hasWalls: " Walls control entry points and give the guard a chokehold on smuggling routes."
      ${wallNote} when !(inst.hasWalls): ""
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:363  CAN CO-FIRE (predicate open)
      "The adventurers' charter hall coordinates emergency response to threats. Effective for monster incursions and major disturbances, less so for routine crime prevention. Not a police force.${prisonNote}"
      when: inst.hasMilitaryInst  AND  !(stress.stateCrime)  AND  !(flags.militaryEffective < 30 && pri.economy < 35)  AND  !(stress.merchantArmy)  AND  !(inst.hasMilitia && !inst.hasGarrison && !inst.hasWatch)  AND  !(inst.hasMercenary && !inst.hasGarrison)  AND  inst.hasCharterHall && !inst.hasGarrison && !inst.hasWatch
      ${prisonNote} when inst.hasCourtSystem && inst.hasPrison: " A functioning court and prison mean crimes carry real consequences."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && inst.hasCourtSystem: " A court exists, though the prison system is limited."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && inst.hasPrison: " Offenders can be jailed, but without a working court system enforcement is arbitrary."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && !(inst.hasPrison): " Without courts or prison, enforcement relies entirely on fines, exile, or summary violence."
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:366  CAN CO-FIRE (predicate open)
      "The ${lawRef} is well-funded, properly equipped, and maintains meaningful patrol coverage. Response times are adequate; bribery exists but isn't normalized.${prisonNote}${wallNote}"
      when: inst.hasMilitaryInst  AND  !(stress.stateCrime)  AND  !(flags.militaryEffective < 30 && pri.economy < 35)  AND  !(stress.merchantArmy)  AND  !(inst.hasMilitia && !inst.hasGarrison && !inst.hasWatch)  AND  !(inst.hasMercenary && !inst.hasGarrison)  AND  !(inst.hasCharterHall && !inst.hasGarrison && !inst.hasWatch)  AND  flags.militaryEffective >= 65 && pri.economy >= 50
      ${lawRef} when inst.hasGarrison && inst.hasWatch: "garrison and ${watchLabel}"
      ${lawRef} when inst.hasGarrison && !(inst.hasWatch): "garrison"
      ${lawRef} when !(inst.hasGarrison) && inst.hasWatch: "${watchLabel}"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && inst.hasMilitia: "citizen militia"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && inst.hasMercenary: "mercenary company"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary) && inst.hasCharterHall: "adventurers' charter hall"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary) && !(inst.hasCharterHall): "local guard"
      ${prisonNote} when inst.hasCourtSystem && inst.hasPrison: " A functioning court and prison mean crimes carry real consequences."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && inst.hasCourtSystem: " A court exists, though the prison system is limited."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && inst.hasPrison: " Offenders can be jailed, but without a working court system enforcement is arbitrary."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && !(inst.hasPrison): " Without courts or prison, enforcement relies entirely on fines, exile, or summary violence."
      ${wallNote} when inst.hasWalls: " Walls control entry points and give the guard a chokehold on smuggling routes."
      ${wallNote} when !(inst.hasWalls): ""
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:369  CAN CO-FIRE (predicate open)
      "The ${lawRef} is disciplined but resource-constrained: motivated with inadequate equipment and irregular pay. Effective in a fight; vulnerable to sustained corruption.${prisonNote}${wallNote}"
      when: inst.hasMilitaryInst  AND  !(stress.stateCrime)  AND  !(flags.militaryEffective < 30 && pri.economy < 35)  AND  !(stress.merchantArmy)  AND  !(inst.hasMilitia && !inst.hasGarrison && !inst.hasWatch)  AND  !(inst.hasMercenary && !inst.hasGarrison)  AND  !(inst.hasCharterHall && !inst.hasGarrison && !inst.hasWatch)  AND  !(flags.militaryEffective >= 65 && pri.economy >= 50)  AND  flags.militaryEffective >= 65 && pri.economy < 40
      ${lawRef} when inst.hasGarrison && inst.hasWatch: "garrison and ${watchLabel}"
      ${lawRef} when inst.hasGarrison && !(inst.hasWatch): "garrison"
      ${lawRef} when !(inst.hasGarrison) && inst.hasWatch: "${watchLabel}"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && inst.hasMilitia: "citizen militia"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && inst.hasMercenary: "mercenary company"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary) && inst.hasCharterHall: "adventurers' charter hall"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary) && !(inst.hasCharterHall): "local guard"
      ${prisonNote} when inst.hasCourtSystem && inst.hasPrison: " A functioning court and prison mean crimes carry real consequences."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && inst.hasCourtSystem: " A court exists, though the prison system is limited."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && inst.hasPrison: " Offenders can be jailed, but without a working court system enforcement is arbitrary."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && !(inst.hasPrison): " Without courts or prison, enforcement relies entirely on fines, exile, or summary violence."
      ${wallNote} when inst.hasWalls: " Walls control entry points and give the guard a chokehold on smuggling routes."
      ${wallNote} when !(inst.hasWalls): ""
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:372  CAN CO-FIRE (predicate open)
      "The ${lawRef} maintains standard patrol coverage. Effective against opportunistic crime; less effective against organized operations that can plan around patrol routes.${prisonNote}${wallNote}"
      when: inst.hasMilitaryInst  AND  !(stress.stateCrime)  AND  !(flags.militaryEffective < 30 && pri.economy < 35)  AND  !(stress.merchantArmy)  AND  !(inst.hasMilitia && !inst.hasGarrison && !inst.hasWatch)  AND  !(inst.hasMercenary && !inst.hasGarrison)  AND  !(inst.hasCharterHall && !inst.hasGarrison && !inst.hasWatch)  AND  !(flags.militaryEffective >= 65 && pri.economy >= 50)  AND  !(flags.militaryEffective >= 65 && pri.economy < 40)
      ${lawRef} when inst.hasGarrison && inst.hasWatch: "garrison and ${watchLabel}"
      ${lawRef} when inst.hasGarrison && !(inst.hasWatch): "garrison"
      ${lawRef} when !(inst.hasGarrison) && inst.hasWatch: "${watchLabel}"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && inst.hasMilitia: "citizen militia"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && inst.hasMercenary: "mercenary company"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary) && inst.hasCharterHall: "adventurers' charter hall"
      ${lawRef} when !(inst.hasGarrison) && !(inst.hasWatch) && !(inst.hasMilitia) && !(inst.hasMercenary) && !(inst.hasCharterHall): "local guard"
      ${prisonNote} when inst.hasCourtSystem && inst.hasPrison: " A functioning court and prison mean crimes carry real consequences."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && inst.hasCourtSystem: " A court exists, though the prison system is limited."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && inst.hasPrison: " Offenders can be jailed, but without a working court system enforcement is arbitrary."
      ${prisonNote} when !(inst.hasCourtSystem && inst.hasPrison) && !(inst.hasCourtSystem) && !(inst.hasPrison): " Without courts or prison, enforcement relies entirely on fines, exile, or summary violence."
      ${wallNote} when inst.hasWalls: " Walls control entry points and give the guard a chokehold on smuggling routes."
      ${wallNote} when !(inst.hasWalls): ""
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:376  CAN CO-FIRE (predicate open)
      "No formal enforcement body exists, but a functioning court system provides some deterrence. Disputes that escalate to violence must rely on community pressure or the intervention of whoever is strongest locally."
      when: !(inst.hasMilitaryInst)  AND  inst.hasCourtSystem
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:380  CAN CO-FIRE (predicate open)
      "There is no formal enforcement body. Order is maintained through community social pressure, the authority of established families, and the implicit threat of collective action against those who break the peace. This works until it doesn't."
      when: !(inst.hasMilitaryInst)  AND  !(inst.hasCourtSystem)  AND  ['thorp', 'hamlet', 'village'].includes(tier)
  • [generateSafetyProfile -> guardEffectivenessDesc] src/generators/safetyProfile.js:382  CAN CO-FIRE (predicate open)
      "No functioning enforcement institution exists. The settlement is relying on whatever informal mechanisms remain."
      when: !(inst.hasMilitaryInst)  AND  !(inst.hasCourtSystem)  AND  !(['thorp', 'hamlet', 'village'].includes(tier))
  (excluded as contradicting the key: 10 strings)

(5) THE CLOSED ROSTERS THIS KEY DOES NOT FIX
  watch      OPEN — required only at town, city; open at thorp, village, metropolis   [town: Town watch ; city: Professional city watch]
  garrison   OPEN — required only at city; open at thorp, village, town, metropolis   [city: Professional city watch, Garrison]
  militia    OPEN — the key does not fix it and no required row seats it
  mercenary  OPEN — the key does not fix it and no required row seats it
  charter    OPEN — the key does not fix it and no required row seats it
  walls      OPEN — required only at city; open at thorp, village, town, metropolis   [city: City walls and gates]
  gates      OPEN — required only at city; open at thorp, village, town, metropolis   [city: City walls and gates]
  granary    OPEN — required only at town, city; open at thorp, village, metropolis   [town: Town granary ; city: City granaries]
  hospital   OPEN — the key does not fix it and no required row seats it
  market     OPEN — required only at town, city; open at thorp, village, metropolis   [town: Market square, Weekly market ; city: Multiple market squares, Daily markets]
  hall       OPEN — required only at town, city; open at thorp, village, metropolis   [town: Town hall ; city: City hall]
  court      OPEN — required only at town, city; open at thorp, village, metropolis   [town: Town hall ; city: City hall, Multiple courthouses]
  prison     OPEN — the key does not fix it and no required row seats it
  church     OPEN — required only at village, town, city; open at thorp, metropolis   [village: Parish church, Priest (resident) ; town: Parish churches (2-5) ; city: Parish churches (10-30)]
  ⚠ `court` is hasCourtSystem and its keyword list includes 'town hall' and 'city hall': a required Town hall seats a court in the engine's model.

(6) THE FROZEN FIELDS (writers under src/domain/worldPulse/, field grain)
  config.monsterThreat                                 writers  0  FROZEN [CONFIG]
  institutions[bucket=walls]                           writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=garrison]                        writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=militia]                         writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  defenseProfile.readiness.score                       writers  0  FROZEN [SNAPSHOT]
  name                                                 writers 201  LIVE   [PULSE]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulse.js:1312, src/domain/worldPulse/applyWorldPulseOccupationAuthority.js:164, src/domain/worldPulse/applyWorldPulsePrimitives.js:38, src/domain/worldPulse/brokeragePatronage.js:178 … +197
  economicState.compound.inst.hasCourtSystem           writers  0  FROZEN [SNAPSHOT]
  economicState.compound.inst.hasPrison                writers  0  FROZEN [SNAPSHOT]
  defenseProfile.scores.economic                       writers  0  FROZEN [SNAPSHOT]
  economicState.compound.inst.hasGranary               writers  0  FROZEN [SNAPSHOT]
  economicState.compound.inst.hasHospital              writers  0  FROZEN [SNAPSHOT]
  economicState.compound.inst.hasChurch                writers  0  FROZEN [SNAPSHOT]
  economicState.safetyProfile.safetyLabel              writers  0  FROZEN [SNAPSHOT]
  structureKey                                         writers  0  FROZEN [SNAPSHOT]  ⚠ root-grain (one segment)
  standingDefenseForces(settlement)                    writers  0  FROZEN [LIVE-ROSTER]  ⚠ root-grain (one segment)
  institutions[bucket=watch]                           writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=mercenary]                       writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=charter]                         writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  magicWorksAt({ settlement })                         writers  0  FROZEN [SNAPSHOT]  ⚠ root-grain (one segment)
  economicState.compound.inst.hasPort                  writers  0  FROZEN [SNAPSHOT]
  config.tradeRouteAccess                              writers  0  FROZEN [CONFIG]
  economicState.foodSecurity.stockpile.blockaded       writers  0  FROZEN [SNAPSHOT]
  economicState.compound.inst.hasNavy                  writers  0  FROZEN [SNAPSHOT]
  stress                                               writers  0  FROZEN [SNAPSHOT]  ⚠ root-grain (one segment)
  economicViability.viable                             writers  0  FROZEN [SNAPSHOT]
  defenseProfile.economicGates.military                writers  0  FROZEN [SNAPSHOT]
  defenseProfile                                       writers  1  LIVE   [PULSE]  ⚠ root-grain (one segment)  src/domain/worldPulse/foodStockpile.js:471
  defenseProfile.institutions                          writers  0  FROZEN [SNAPSHOT]
  defenseProfile.institutions.charter                  writers  0  FROZEN [SNAPSHOT]
  defenseProfile.institutions.garrison                 writers  0  FROZEN [SNAPSHOT]
  defenseProfile.institutions.militia                  writers  0  FROZEN [SNAPSHOT]
  defenseProfile.institutions.walls                    writers  0  FROZEN [SNAPSHOT]
  defenseProfile.scores                                writers  1  LIVE   [PULSE]  src/domain/worldPulse/foodStockpile.js:473
  defenseProfile.scores.internal                       writers  0  FROZEN [SNAPSHOT]
  defenseProfile.scores.military                       writers  0  FROZEN [SNAPSHOT]
  economicState.compound.inst                          writers  0  FROZEN [SNAPSHOT]
  economicState.safetyProfile                          writers  0  FROZEN [SNAPSHOT]
  defenseProfile.economicGates                         writers  0  FROZEN [SNAPSHOT]
  defenseProfile.economicGates.[*]                     writers  0  FROZEN [SNAPSHOT]
  defenseProfile.scores.disaster                       writers  1  LIVE   [PULSE]  src/domain/worldPulse/foodStockpile.js:473
  defenseProfile.scores.monster                        writers  0  FROZEN [SNAPSHOT]
  economicState.foodSecurity.resilienceScore           writers  0  FROZEN [SNAPSHOT]
  economicState.safetyProfile.guardEffectivenessDesc   writers  0  FROZEN [SNAPSHOT]
  institutions                                         writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  defenseProfile.institutions.magicDef                 writers  0  FROZEN [SNAPSHOT]
  defenseProfile.scores.magical                        writers  0  FROZEN [SNAPSHOT]
  economicState.compound.inst.hasMagicInst             writers  0  FROZEN [SNAPSHOT]
  economicState.foodSecurity.stockpile                 writers  0  FROZEN [SNAPSHOT]
  economicState.foodSecurity.stockpile.blockadeBypass  writers  0  FROZEN [SNAPSHOT]
  defenseProfile.institutions.mercenary                writers  0  FROZEN [SNAPSHOT]
  defenseProfile.institutions.watch                    writers  0  FROZEN [SNAPSHOT]
  config.stressType                                    writers  0  FROZEN [CONFIG]
  config.stressTypes                                   writers  0  FROZEN [CONFIG]
  FROZEN => the perfect and the durative are licensed over it (ruling 11b); LIVE => refused unless the key's own read (11a).

(7) THE UNIVERSAL SOURCES the required rows seat at each preimage tier (the marker adds the interests and the named offices)
  thorp: the hall: — · the tavern: — · the guilds: — · the register (parish): Burial ground · the elders: —
  village: the hall: — · the tavern: — · the guilds: — · the register (parish): Parish church, Priest (resident), Graveyard · the elders: —
  town: the hall: Town hall · the tavern: Taverns (5-20) · the guilds: Craft guilds (5-15) · the register (parish): Parish churches (2-5), Parish burial grounds · the elders: —
  city: the hall: City hall · the tavern: Inns and taverns (district) · the guilds: — · the register (parish): Parish churches (10-30), Burial grounds and charnel house · the elders: —
  metropolis: the hall: — · the tavern: — · the guilds: — · the register (parish): Cemetery network · the elders: —
  the key on the force buckets and the gates: watch: OPEN · garrison: OPEN · militia: OPEN · mercenary: OPEN · charter: OPEN · gates: OPEN

────────────────────────────────────────────────────────────────────────
THE MARKER'S SECTIONS (seat: opus · written against brief ADDENDUM 14/18
and CONTRADICTION-TABLE §V, which governs where it and an earlier row disagree)
────────────────────────────────────────────────────────────────────────

⛔⛔ TWO CORRECTIONS TO THE MECHANICAL SECTIONS ABOVE — READ BEFORE ANYTHING ELSE.
The instrument resolves a key's fixed fields through `PARAM_OF_NAME` (`prose-mark-card.mjs:127-140`),
which knows the param name `walls` and NOT this key's param name `perimeter`
(`beastsRowPoolKey(monsterThreat, perimeter, force)`, `defenseStateProse.js:444`). Two
printed sections are therefore wrong on this pool ONLY, and both in the same direction:

  (5) prints `walls  OPEN — required only at city`. ⛔ FALSE. The key FIXES WALLS TRUE.
      The call site passes `forces.walls.present` (`defenseStateProse.js:660`, `:712`) —
      the LIVE walls bucket — and `beastsRowSituation` returns this pool only on
      `perimeter === true` (`:436`). Section (1) has it right; section (5) does not.

  (4) prints four branches as "CAN CO-FIRE (predicate open)" that are EXCLUDED here,
      because it could not evaluate `hasWalls`. `buildThreatAssessment` reads
      `defenseProfile.institutions.walls` (`threatAssessment.js:34`, `:39`) — the
      generation-time snapshot — and a ruin only ever REMOVES a row, so a live wall row
      implies a snapshot wall row. These four cannot fire beside this key:
        threatAssessment.js:98  "Safe heartland with no organized defense. Acceptable given the threat environment."
        threatAssessment.js:121 "Professional garrison without perimeter walls. …"
        threatAssessment.js:123 "Armed citizens who know their ground. …"
        threatAssessment.js:125 "No walls or garrison. Cannot resist organized military aggression. …"
      ⚠ ONE SEAM SURVIVES (§1.4): `institutions` carries 38 world-pulse writers, so a wall
      row ADDED after generation reads live-true and snapshot-false, and those four strings
      could then print beside this key. Write no face that depends on their absence.

  ⇒ WHAT ACTUALLY STANDS BESIDE A FACE OF THIS POOL, on every town of the preimage:
      one of  :94 "Safe heartland: the existing defenses are substantially more than the
                    threat level requires."                         (hasWalls && hasGarrison)
        or    :96 "Safe heartland with minimal creature activity. Existing defenses are
                    appropriate. The primary threats here are internal."   (otherwise)
      and one of :115 (walls + professional garrison) · :117 (walls + citizen militia)
        or       :119 "Walls present but no organized military force to man them. A
                       determined attacker takes the walls if they have ladders and time."

⛔ AND THE THIRD FACT THE CARD MUST STATE IN ITS OWN RIGHT — THE KEY DOES NOT READ THE FORCE.
`beastsRowSituation`'s own comment says it in terms: *"`settled country, perimeter`
deliberately does not consult the force at all"* (`defenseStateProse.js:419-422`). The key
fixes TWO facts and two only: `config.monsterThreat` normalises to `heartland`
(`monsterThreat.js:57`; `MONSTER_FAMILY_OF.heartland === 'settled'`, `:276-281`), and a live
walls-bucket row stands. Garrison, militia, watch, mercenary, charter and gates are ALL open.
This is the whole discipline of the pool: it is the one Beasts pool that knows a country and a
wall and knows NOTHING about who is on it.

(7) THE SOURCES

  ⛔ READ THIS FIRST. The preimage runs thorp 13 · village 1 · town 18 · city 43 · metropolis 43
  of 128 rate-grid towns (118 towns, 1536 bp), and hamlet is silent. SEVENTY-THREE PER CENT OF
  THIS POOL IS CITY OR METROPOLIS. That is the opposite shape to every other DS-DEF-2 pool
  worked so far, and it moves every judgment on this card. But the two ends do not share a
  roster: a CITY carries fourteen required rows including `City walls and gates`, a `Garrison`,
  a `Professional city watch`, a `City hall`, `Multiple courthouses`, `City granaries` and
  `Parish churches (10-30)`; a METROPOLIS carries exactly ONE required row, `Cemetery network`;
  a THORP carries five, none of them a hall, a church, a market or any force. So the pool's
  largest tier and its second-largest tier have ALMOST NOTHING REQUIRED IN COMMON, and the
  thorp has nothing in common with either. A face written for "the whole pool" can rest on
  three things only: the wall the key fixes, the burial ground (required at every preimage
  tier — `Burial ground` · `Graveyard` · `Parish burial grounds` · `Burial grounds and charnel
  house` · `Cemetery network`), and the road.

  ── UNIVERSAL (resolves on every town this pool can draw) ──
  The engine's own roster of sources is `faceSources.js` `sourcesOf`, and exactly TWO words in
  it are seated by nothing (`ALWAYS_SOURCES = UNIVERSAL_SOURCES`, `stateProseKernel.js:517`;
  `faceSources.js:78`, `:128-130`). There are two universal speakers on this pool and no third.

  • THE STRANGER — `UNIVERSAL_SOURCE` (`stateProseKernel.js:505`); an untagged face is his.
    INTEREST: what is visible on arrival, and the arithmetic he is the only one who does — he
    has come from the quiet country the key fixes, and he is looking at built work that faces
    it. He is this pool's sharpest source for the same reason the pool exists: the gap between
    what the country asks and what the town has standing is a thing a newcomer sees at once and
    a resident stopped seeing.
    ⚠ He may be stopped, or not. `hasGates` is OPEN across the preimage (below), so his arrival
    is either a toll and a question or nothing at all, and a face may bake neither.

  • THE PUBLIC — the town's people as a whole (`PUBLIC_SOURCE`, ruling 28), seated by nothing
    and owed to no power; roles follow the tier (`PUBLIC_ROLES_BY_TIER`), plural always.
    INTEREST: none, and that is the point — it is the collective perceived truth. On this pool
    it is the richest of the two, because what everyone here SAW (built work kept, a quiet
    country) and what everyone MAKES OF IT (that it will never be wanted) are exactly the
    seeing and the perception ruling 28 separates, and the second half may be wrong.
    ⛔ Still under NOTES until car 8b-W-18n lands — though the sibling pool `Invasion & War:
    walls with NO force` already carries a `[public]` face on the shipped rows.

  • THE ARCHIVER is not a source and never draws alone (`stateProseKernel.js:519-530`): the
    hand of every bare statement of a recorded fact, the joins, the notebook, the weighing row
    on a pair, and the one `[archiver · observed]` candidate per variant (ruling 27; car 18n).

  ── CONDITIONAL (the field that seats each — `faceSources.js:128-175`) ──

  • THE GATE / whoever holds the way through — seated by `GATE_NAMES`
    (`gates · town walls · city walls · massive walls · palisade`, `faceSources.js:94`,
    verbatim from `priorityHelpers.js:53`). ⛔ NOT SEATED BY THE KEY. The walls bucket admits
    `citadel`, `inner citadel` and `earthwork` (`defenseInstitutionBuckets.js:84-87`), none of
    which is in the gate list — so a town whose only wall-class row is a `Citadel` draws this
    pool WITH NO GATE, and `safetyProfile.js:463-464` prints "no gates to bribe and no
    checkpoints to avoid" on the same tab. Where it IS seated the engine seats it hard:
    `City walls and gates` → "Gate control" on, p 1.0; `Palisade or earthworks` → "Gated entry"
    on, p 1.0. BOTH DIRECTIONS ARE FINDINGS (F1-08).
    INTEREST: the toll and the discretion — and on this pool, the boredom of a bar nothing has
    ever come to. He is the one person whose duty is the country and whose experience of the
    country is that it is empty.

  • THE HALL / a clerk in the hall — `Town hall` (required at town), `City hall` (required at
    city). NOT required at metropolis and no hall row below town (F1-20 bars a hall, chamber or
    council room as a PLACE below town). So: 61 of 118, and silent on the thorp, the village and
    the metropolis.
    INTEREST: the purse, and it is ONE purse. `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)`
    covers "garrison wages, wall maintenance" together (`defenseGenerator.js:177-192`), so the
    hall is defending a line of spending that buys built work in a country that does not press.
    That is this pool's central argument and the hall is the party to it with the most to lose.
    ⛔ "the hall" or "a clerk in the hall" — NEVER "the clerk", never the Mayor.

  • THE COURT — `hasCourtSystem` fires on `town hall` and `city hall` as well as a courthouse
    (`faceSources.js:99`; `priorityHelpers.js:55`), so it is seated wherever the hall is, plus
    `Multiple courthouses` at city. Same 61 towns.
    INTEREST: what is disputed. On this pool the dispute that reaches it is not danger — it is
    cost, boundary and who owes work.

  • THE TAVERN — `Taverns (5-20)` / `Inn (multiple)` at town, `Inns and taverns (district)` at
    city (`TAVERN_NAMES`, `INN_RE`, `faceSources.js:86-87`). Town and city only.
    INTEREST: the safety label and the stranger traffic — and on this pool, the account of a
    town that has stopped rehearsing. The tavern is the source whose view of the works is about
    people rather than about stone.

  • THE GUILDS / a guild's factor — `craft guild` (`faceSources.js:88`). `Craft guilds (5-15)`
    is required at TOWN ONLY in this preimage; the city's required list does not carry one.
    Eighteen towns by requirement, more by draw.
    INTEREST: influence and the town's prosperity; they pay into the purse that keeps built work
    against a country that is not coming. Write them from their influence rank (ruling 18).

  • THE REGISTER / THE SEXTON — a parish, church, temple, abbey, monastery or friary row that
    STANDS HERE (`REGISTER_NAMES`, `faceSources.js:90-92`). Required at village
    (`Parish church`, `Priest (resident)`), town (`Parish churches (2-5)`) and city
    (`Parish churches (10-30)`). ⛔ NOT at THORP — the thorp's religious row is a
    `Burial ground` and nothing else, and `Access to parish church` is explicitly excluded as
    "a walk to someone else's register" (`REGISTER_EXCLUDE_PREFIX`). NOT required at metropolis.
    INTEREST: the ground and the dead. ⚠ AND THE BURIAL GROUND IS NOT THE REGISTER. The burial
    row is required at every preimage tier but seats NO source word; only at metropolis does its
    row carry a record at all (`Cemetery network` → "Central register", p 0.9) and at town
    ("Register of the dead", p 0.8). "Whoever digs the ground" is a person and is safe
    everywhere; "the register shows" on a thorp is F1-24 with no holder.

  • THE MARKET — `hasMarket` (`faceSources.js:97`); `Market square` + `Weekly market` at town,
    `Multiple market squares` + `Daily markets` at city. Town and city only; F1-10 for the class.

  • THE WATCH — `Town watch` required at town (part-time: "Part-time guards. Night patrol and
    gate duty." — calling them professional, full-time or soldiers is F1-27), `Professional city
    watch` required at city. OPEN at thorp, village and metropolis, where any watch as a body is
    F1-01 / V-23. Seated by the watch BUCKET (`standingDefenseForces`), not by a keyword
    (`faceSources.js:140`).
    INTEREST: the pay, and the boredom. The military upkeep gate DOES reach the watch
    (F4-19, V-07: `defenseGenerator.js:177-178`, `:190`; `fieldSynonyms.js:51`), so where a watch
    stands somebody is thinly paid to keep a circuit nothing tests.

  • THE GARRISON — the garrison bucket (`garrison · barracks · professional guard ·
    professional city watch · multiple garrison`, `defenseInstitutionBuckets.js:88-91`).
    ⛔ REQUIRED AT CITY: `Garrison` — "Professional soldiers. Noble or royal."
    (`institutionalCatalog.js:1925-1930`) — so at CITY, 43 of 118 towns, DENYING THE TOWN
    SOLDIERS OF ITS OWN IS F1-28, and the same page prints :94 "substantially more than the
    threat level requires" and :115 beside the face. Open elsewhere; a `Barracks` sets it (§R-3).
    ⚠ F1-29 as §V.2 corrects it: at city `Garrison` and `Professional city watch` are two
    required rows with different names that `dedupByName` cannot merge — do not write them as
    one body relieving the other.
    INTEREST: paid soldiers in a country that has not asked anything of them. This is the pool's
    most particular speaker and it exists on nearly half its towns.

  • THE MUSTER — the militia bucket only. Never required anywhere in this preimage, and
    `Citizen militia` carries `exclusiveGroup: 'civilianDefense'` — "Present only when no
    professional watch exists" (`institutionalCatalog.js:1340-1347`), so it CANNOT stand beside
    a `Town watch` or a `Professional city watch` (F1-26). On this preimage that leaves it to
    the thorp, the village and the metropolis. "The muster" as the class word is free everywhere;
    a muster ROLL as a cited record needs a `Citizen militia` to keep it (F1-03, F1-24, §R-8).
    INTEREST: no pay, ever — V-09 bars any wage, pay or arrears predicated of a `Citizen militia`
    or a `Household levy` ("Part-time soldiers with their own tools and no pay").

  • THE ELDERS — thorp and village only (`ELDER_TIERS`, `faceSources.js:81`; the tier's
    "Record of custom"). Fourteen of 118 towns. At town and above the kind resolves only through
    a `Town council`, which is not a required row (F1-22).
    INTEREST: the works as a boundary and a customary obligation — "Record of custom" is the
    memory of boundaries and old agreements, which is what built work becomes when nothing tests
    it.

  • NEVER A SPEAKER ON THIS KEY: the mercenary company and the charter hall (open, never
    assert — F1-05, F1-06, and W-01's flag/bucket collision means no face may be charged on a
    Hireling-hall town either way); THE CROWN'S ASSESSOR (no typed collector exists anywhere in
    the engine).

  ── NO COMPROMISED CANDIDATES ON THIS POOL (ruling 26; card section (2c)) ──
  The covert table is closed at hall · watch · court, and this pool is on none of their marked
  lists. Every source here draws as an ordinary source; a `[<source> · compromised]` tag is
  refused on this card. An HONEST reassurance is still offered (ruling 26's untagged true
  reassurance), and on this pool a true reassurance is easy to come by and therefore cheap.

  ── THE NAMED OFFICES A SPEAKER MUST NEVER BE (`npcGenerator.js:1511-1537`, this preimage) ──
    thorp: Elder + a derived second role
    village: Mayor, GUARD CAPTAIN
    town: Mayor, GUARD CAPTAIN, High Priest
    city: Mayor, GUARD CAPTAIN, High Priest, Wealthiest Merchant
    metropolis: Governor, CITY WATCH CHIEF, High Priest, Guild Archmage, Wealthiest Merchant
  ⛔⛔ THE TRAP IS THE PERSON IN CHARGE OF SOMETHING NOBODY NEEDS. Village, town and city each
  emit exactly ONE Guard Captain, and the metropolis one City Watch Chief, as named NPCs with a
  personality, a disposition and a secret — that is 105 of 118 preimage towns. Every "the one
  whose job the walls are", "whoever is supposed to give the order", "the man with nothing to
  command" reads as a predicate on that NPC on the next tab, and §V.0 floor 3 widens F3-06 to
  name the metropolis's City Watch Chief by title. Write the households, the hall, the gate's
  holder, the soldiers as a body, or nobody.
  Stress adds more (`STRESS_MANDATORY_ROLES`): Garrison Commander, Corrupt Official, Healer,
  Moneylender, Chief Magistrate, Guild Master, Council Member, Retired Adventurer.

  ── THE SLOTS THIS CALL SITE ACTUALLY FILLS ──
  `{settlement}` and `{defmaterial}` — and nothing else. The bag is
  `{ settlement: properFill(name) }` plus `defmaterial` for the walled pools
  (`defenseStateProse.js:657`, `:669`, `:708`); the block's declared `{band}` and `{route}` are
  NOT minted on this entry point, so a face naming either has its variant dropped by the
  kernel's anchored liveness. `{defmaterial}` fills `stakes` · `timber or earth` · `stone` ·
  `masonry` from the row's own printed description (`DEFMATERIAL_OF`, `:1140-1145`) and is
  `undefined` on a `Citadel`, a `Massive walls and fortifications` and a `Gates (if walled)`
  town (`DEFMATERIAL_UNFIXED_ROWS`, `:1154-1156`) — which is most of the metropolis end of this
  preimage. A face that needs the material is a face 43 towns will not draw.

(8) WHAT WOULD BE FALSE

  The key fixes a quiet country and a standing wall, and it reads nothing else, so every finding
  this pool walks into is one of two over-readings: reading the QUIET as safety, or reading the
  WALL as a perimeter with nobody on it. Take the country first. F1-34 is this pool's own row
  and it is the single most likely finding on the card: `heartland` is "the calm baseline"
  (`monsterThreat.js:20-28`) and it only MULTIPLIES threat DOWN — monster and siege stress by
  ×0.3, occupation ×0.4, war ×0.4 (`stressGenerator.js:118-125`, `:168`, `:231`) — so a
  `monster_pressure` strain CAN stand on a heartland town, and where it does
  `safetyProfile.js:197` prints "Monster pressure from the surrounding region has changed how
  the settlement operates after dark. Outlying areas are avoided. Night movement is restricted."
  beside the face. "Nothing comes out of the country", "there is nothing out there", "no danger
  here", "the country has never given the town any trouble" are all F1-34 and several are also
  F2-05's elapsed course; the machine's own words for this state are the ceiling —
  "minimal creature activity" (`threatAssessment.js:96`), never none — and F4-05 bars reading
  `plagued` as disease anywhere near it. Now the wall. THE KEY DOES NOT FIX A PERIMETER: the
  walls bucket admits `citadel` and `inner citadel` (`defenseInstitutionBuckets.js:84-87`) and
  F1-07 rules that "a CITADEL is inner and a GATE is a point — neither is a line around the
  town", so "the ring", "the circuit", "the line round the place", "it goes all the way round",
  "where the town ends" are findings on the citadel-only towns of this preimage, and the gate
  cuts both ways beside them (F1-08: asserting a gate where `hasGates` is false contradicts
  `safetyProfile.js:463-464`'s printed "no gates to bribe and no checkpoints to avoid", denying
  one where a `City walls and gates` or `Palisade` row stands contradicts that row's own
  on-by-default Gate control / Gated entry service). V-06 keeps the MATERIAL bar at the POOL
  grain — "the stone", "the timber", "the bank of earth" are wrong on some town that draws the
  face, and the fix is the `{defmaterial}` slot rather than a chosen word (F1-32 for the row's
  own description, F1-33 for the material's SOURCE outright). THE FORCE IS THE OTHER HALF AND IT
  IS OPEN IN BOTH DIRECTIONS, which is what makes this pool harder than its walls-with-no-force
  sibling: the key consults no force bucket at all, so NOTHING may be asserted of who mans the
  works (a garrison F1-02, a militia or a cited muster roll F1-03, a watch as a body below town
  F1-01 / V-23, a mercenary company F1-05, a charter hall F1-06, "the guard" as a body F1-04) and
  NOTHING may be denied either — at CITY, 43 of 118 towns, `Garrison` and `Professional city
  watch` are both `required: true`, so "there are no soldiers here", "nobody is paid to stand on
  it", "nobody walks it after dark", "no one would answer" are F1-28 and F1-25 outright, the
  watch's own services carry Night patrol (p 1.0) and Gate duty (p 0.8) at town, the military
  purse reaches the watch (F4-19, V-07), and V-27 charges an ORGANISED or STANDING manning in the
  other direction where no force row resolves. On this key the honest sentence about the force is
  NO SENTENCE ABOUT THE FORCE; what is safe is what the town DOES with the works, not who stands
  on them. Do not seat the tier's other bodies into the key's silence either — the sitting's own
  finding is that this is where the re-cut prose actually fails — so no hall, chamber or council
  room below town (F1-20) and none at metropolis, whose required roster is ONE row; no granary,
  market or craft guild below town (F1-09, F1-10, F1-16); no church standing in a thorp, whose only
  required religious row is a burial ground (F1-11); no record cited to a keeper this town's roster
  does not resolve (F1-24, §R-8) — and never spend a citation the pool did not already carry, the
  shipped rows here carrying none at all. Floor 2 is decidable from the grammar and this pool
  invites every row: no magnitude in digit or word, no headcount on a wall, no length of it, not
  "a handful", not "most of it" (F2-01); no date, season or duration (F2-02); no raising narrated
  — "built when the country was worse", "raised in the old trouble" is F2-03 and, on a key that
  reads no history field, F2-09 as well, which is the single most tempting sentence this pool
  offers and must be refused every time; no event the record did not run (F2-04); no RATE
  (F2-06); no age of fabric against the printed `{hist.age} years old` — "the old wall" is F2-07;
  and no elapsed course over a LIVE field (F2-05) — BUT the perfect and the durative ARE licensed
  over the key's own reads (`config.monsterThreat` is FROZEN, writers 0) and over every frozen
  field listed at (6), so "nothing has come out of the country that the works were built against"
  is lawful on the country and "the works have stood unasked" is NOT, the walls bucket carrying
  38 pulse writers. F4-01 as §V.0 re-cuts it bars BOTH halves of the fabric: no decay clock (no
  rot, no weathering, no erosion, not even where sense agrees) AND no permanence — calamity,
  razing and the purse's own economic-distress closure (`institutionLifecycle.js:792-848`) all
  remove built fabric, which is exactly the sentence this pool most wants to write ("stone keeps
  itself", which DS-DEF-11's own shipped `WALLED-STRAINED` row still says and ADDENDUM 13A
  struck). F4-02 bars the split purse — one multiplier covers the wall's keeping and any wages
  together, so "the town pays for the wall and not for men" as a CHOICE is false, F4-03 bars
  splitting the four gates' direction, F4-04 bars the total collapse (every gate has a floor and
  the community baseline is exempt), F4-06 bars explaining the readiness badge by the works, and
  F1-40 / F1-107 bar outrunning it. ⛔ AND THE SAME PAGE ALREADY SAYS THIS POOL'S SENTENCE: DS-DEF-11's
  `WALLED-QUIET` fires on exactly these towns whenever the upkeep gate is whole
  (`wallRationalePoolKey`, `defenseStateProse.js:1206-1213`) and prints "{settlement} keeps a
  {defwork} the present peace does not obviously require", "The {defwork} stands ahead of any
  present need", "The town pays little for its {defwork} now that it asks little of it" — and
  `WALLED-STRAINED` replaces it where the gate is impaired, printing a watch that should man the
  works and a muster thinning behind them. A face that restates either is a duplicate, and a face
  that argues with `WALLED-STRAINED`'s watch is floor 1. Floor 3: no named character's fate
  (F3-01) and the Guard-Captain / City-Watch-Chief rider above on 105 of 118 towns
  (F3-03 / F3-06 as §V.0 widens it); nothing predicated of a god (F3-02 — the followers act);
  no culture furniture the profile denies across eleven profiles (F3-05: no thatch, no churchyard,
  no market green, no snow on the road, and each profile carries a printed `defensePattern` this
  desk does not read). And the smaller ones this key can genuinely reach: F1-31 the tier word, on
  a preimage spanning thorp to metropolis; F1-102 the approach against `terrainType` /
  `tradeRouteAccess`; F4-07 the river or the coast doing nothing for the defence; F4-08 magic
  written into a world where it does not work; F4-13 a covert fact on a player face; F1-126 a
  minted proper name; F1-117 / F1-118 a clause arguing with a rendered `{seat}` fill; ruling 35,
  a face that would sit as comfortably on `frontier, credible deterrence` or `plagued, perimeter
  AND organized force` — the card's own (2d) names the two neighbours. What is NOT a finding, by
  name: that the card does not license it; "keep every claim, add none"; the same claim set on
  every face; the always-safe spelling lists; the layer bar; the record-word bar; the person bar
  beyond floor 3 — an unnamed person may hold a key, refuse, be resented, be laughed at, so long
  as the tier does not emit that office as an NPC.

(9) WHERE THE FLAVOUR IS

  • WHAT IS IN USE. Built work in a quiet country does not stop being used; it stops being used
    for what it was built for, and the engine says so in SERVICE rows rather than defence rows.
    `City walls and gates` levies at its gatehouses ("Gate control", on, p 1.0); a
    `Palisade or earthworks` makes strangers state their business and offers refuge in crisis;
    a `Town watch` does gate duty. Everything else the works do here is domestic and is the
    pool's own vein: the line stock does not cross, the thing the burial ground lies outside of
    — and the burial ground is the one body required on every tier of this preimage, from the
    thorp's `Burial ground` to the metropolis's `Cemetery network` with its central roll — the
    windbreak, the wall a household stacks against, the walk that is a path because people cross
    it. At city the granaries, the markets, the courthouses and the hall are all inside it, and
    a garrison of professional soldiers is quartered in a place nothing has come to.

  • WHAT IS IN DISPUTE. Not danger — cost, and standing. One purse keeps the works and pays any
    wages, the community baseline is exempt, and the country makes no case for either: so the
    hall defends a line of spending with no event behind it, the guilds pay into it and want it
    elsewhere, the soldiers or the watch are paid to be ready for a thing the same page calls
    minimal, and the gate's holder takes a toll that funds it. The stranger sees a town armed
    against nothing; the tavern says the town stopped noticing years back and the archiver may
    not write "years back". Two sources reading one fact differently IS the session, and here
    the fact is that the works are ahead of the need and nobody can say by how much.

  • WHAT THE EXCESS LOOKS LIKE ON THE GROUND. Not ruin, not emptiness, not neglect — all three
    are barred. It is a kept thing with no occasion: a gate that is barred because it is barred
    at dusk; a soldier's post that is a place to sit out of the wind; the country people who
    know they are to come inside and have never been asked to; a bell or a horn bracket and no
    living memory of it sounding, which is F2-07 if the writer says so and lawful if the writer
    shows the bracket. The absence on this pool is not of people or of pay — both may stand —
    it is of the EVENT. That is the distinction the pool turns on, and it is where every lawful
    hook in it lives.
