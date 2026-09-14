THE CARD (mechanical sections) — block DS-DEF-2 · pool `Beasts & Monsters: frontier, credible deterrence` · dir ds-def-2-beasts-monsters-frontier-credible-deterrence

(1) THE KEY AND ITS PREIMAGE
  key function: BEASTS_ROW_POOL (rung table) · site defense.threatAssessment
  census predicate: beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js) === frontier country, perimeter and force
  read family         -> config.monsterThreat                     [CONFIG] writers 0   (resolved through beastsRowPoolKey's call site in the entry point)
  read perimeter      -> institutions[bucket=walls]               [LIVE-ROSTER] writers 38   (resolved through beastsRowPoolKey's call site in the entry point)
  read force          -> institutions[bucket=garrison]            [LIVE-ROSTER] writers 38   (resolved through beastsRowPoolKey's call site in the entry point)
  read force          -> institutions[bucket=militia]             [LIVE-ROSTER] writers 38   (resolved through beastsRowPoolKey's call site in the entry point)
  the key FIXES: monsterThreat="frontier" · perimeter=true · force=true   (beastsRowPoolKey, 1 combination(s))
  preimage on the 768-town rate grid: 119 towns (1549 bp) — village 3/128 · town 20/128 · city 47/128 · metropolis 49/128
  silent tiers: thorp, hamlet

(2) THE REQUIRED ROWS (institutionalCatalog required: true) at every preimage tier — bodies a face may not deny or infer away
  village (7): Multiple water sources [Infrastructure] · Dwellings (80-180) [Infrastructure] · Farmland [Economy] · Mill [Crafts] · Parish church [Religious] · Priest (resident) [Religious] · Graveyard [Religious]
  town (13): Town granary [Economy] · Market square [Economy] · Weekly market [Economy] · Craft guilds (5-15) [Economy] · Inn (multiple) [Economy] · Taverns (5-20) [Economy] · Mills (2-5) [Crafts] · Parish churches (2-5) [Religious] · Parish burial grounds [Religious] · Town watch [Defense] · Town hall [Infrastructure] · Housing (180-1000 structures) [Infrastructure] · Multiple water sources [Infrastructure]
  city (14): City granaries [Economy] · Multiple market squares [Economy] · Daily markets [Economy] · Inns and taverns (district) [Economy] · Warehouse district [Economy] · Parish churches (10-30) [Religious] · Burial grounds and charnel house [Religious] · City walls and gates [Defense] · Professional city watch [Defense] · Garrison [Defense] · City hall [Infrastructure] · Multiple courthouses [Infrastructure] · Housing (1000-5000 structures) [Infrastructure] · Aqueduct or water system [Infrastructure]
  metropolis (1): Cemetery network [Religious]

(2b) WHAT A FACE MAY NOT DENY OF THE REQUIRED ROWS — the services the engine's own menu turns on at p ≥ 0.8, and the derivation that files the row
  Aqueduct or water system (required at city) — a face may not deny: Clean water distribution (p 1) · filed under no closed roster
  Burial grounds and charnel house (required at city) — a face may not deny: Burial (p 1) · filed under no closed roster
  Cemetery network (required at metropolis) — a face may not deny: Burial (p 1) · Central register (p 0.9) · filed under no closed roster
  City granaries (required at city) — a face may not deny: Grain storage (p 1) · filed under the `granary` roster
  City hall (required at city) — a face may not deny: Civic licensing (p 1) · Appeals court (p 0.8) · filed under the `hall` roster · filed under the `court` roster
  City walls and gates (required at city) — a face may not deny: Gate control (p 1) · filed under fortifications (deriveArmedForces) · filed under the `gates` roster
  Craft guilds (5-15) (required at town) — a face may not deny: Quality certification (p 1) · Apprenticeship programs (p 0.8) · filed under no closed roster
  Daily markets (required at city) — a face may not deny: Fresh produce (p 1) · General trade (p 0.9) · Street food (p 0.8) · filed under the `market` roster
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
  Taverns (5-20) (required at town) — a face may not deny: Drink service (p 1) · Meals (p 0.8) · filed under no closed roster
  Town granary (required at town) — a face may not deny: Grain storage (p 1) · filed under the `granary` roster
  Town hall (required at town) — a face may not deny: Permit applications (p 1) · Tax payment (p 0.9) · Dispute arbitration (p 0.8) · filed under the `hall` roster · filed under the `court` roster
  Town watch (required at town) — a face may not deny: Night patrol (p 1) · Gate duty (p 0.8) · filed under standing (deriveArmedForces)
  Warehouse district (required at city) — a face may not deny: Goods storage (p 1) · filed under no closed roster
  Weekly market (required at town) — a face may not deny: General trade (p 1) · Tax collection (p 0.9) · filed under the `market` roster
  ⛔ A SERVICE AT OR ABOVE THE BAR IS A THING THE TOWN'S OWN MODEL SAYS THIS BODY DOES: denying it is floor 1, whatever the face is otherwise about. A row filed under `standing` is UNDER ARMS in the engine's reading even where the key fixes no garrison and no militia.

(2b′) THE OBSERVER'S AND THE PUBLIC'S LIST: what neither may claim to have seen
  Aqueduct or water system (required at city) — NOT SEEN is a claim about: Clean water distribution
  Burial grounds and charnel house (required at city) — NOT SEEN is a claim about: Burial
  Cemetery network (required at metropolis) — NOT SEEN is a claim about: Burial · Central register
  City granaries (required at city) — NOT SEEN is a claim about: Grain storage
  City hall (required at city) — NOT SEEN is a claim about: Civic licensing · Appeals court
  City walls and gates (required at city) — NOT SEEN is a claim about: Gate control
  Craft guilds (5-15) (required at town) — NOT SEEN is a claim about: Quality certification · Apprenticeship programs
  Daily markets (required at city) — NOT SEEN is a claim about: Fresh produce · General trade · Street food
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
  Taverns (5-20) (required at town) — NOT SEEN is a claim about: Drink service · Meals
  Town granary (required at town) — NOT SEEN is a claim about: Grain storage
  Town hall (required at town) — NOT SEEN is a claim about: Permit applications · Tax payment · Dispute arbitration
  Town watch (required at town) — NOT SEEN is a claim about: Night patrol · Gate duty
  Warehouse district (required at city) — NOT SEEN is a claim about: Goods storage
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
    Burial grounds and charnel house: "inside the walls" — stated only at city — silent at village, town, metropolis   [the catalog row]
        the data says: "The parish grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next."
    Burial grounds and charnel house: "outside the gates" — stated only at city — silent at village, town, metropolis   [the catalog row · the `Burial` service]
        the data says: "New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening."
    Market square: "in the square" — stated only at town — silent at village, city, metropolis   [the `Civic announcements` service]
        the data says: "Official proclamations, wanted notices, and public notices read in the square."
    Parish burial grounds: "beyond the gate" — stated only at town — silent at village, city, metropolis   [the catalog row]
        the data says: "Each parish keeps its own ground beside its church, and a parish that has filled its ground buries beyond the gate instead."
  ⛔ A FACE DRAWS ON EVERY TOWN OF THE PREIMAGE, so a placement the data states only at the city is an INVENTION on the thorp (floor 2), and a hedged one is a tendency rather than this town's fact.

(2d) THE KEY'S SIBLING RUNGS — what this pool's key would have been had ONE of the fields it fixes been otherwise
    monsterThreat = "frontier" HERE
        monsterThreat = "heartland" -> `Beasts & Monsters: settled, defenses beyond the need`
        monsterThreat = "plagued" -> `Beasts & Monsters: plagued, perimeter AND organized force`
    perimeter = true HERE
        perimeter = false -> `Beasts & Monsters: frontier, force without a perimeter`
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
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:74  CAN CO-FIRE (predicate open)
      "Active frontier. Walls and garrison provide credible deterrence: most creature threats will not press a defended perimeter. ${?1}Adequate for the threat level."
      when: !(threat === 'plagued')  AND  threat === 'frontier'  AND  hasWalls && hasGarrison
      ${?1} when hasCharter: "Charter hall handles anything above the garrison usual remit. "
      ${?1} when !(hasCharter): ""
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:80  CAN CO-FIRE (predicate open)
      "Palisade and militia are standard frontier resilience. Effective against most creature threats, strained by simultaneous incursions. ${?1}Honest posture for a frontier settlement."
      when: !(threat === 'plagued')  AND  threat === 'frontier'  AND  !(hasWalls && hasGarrison)  AND  hasWalls && hasMilitia
      ${?1} when hasCharter: "Charter hall provides specialist backup. "
      ${?1} when !(hasCharter): ""
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:86  CAN CO-FIRE (predicate open)
      "Active frontier with ${?1} but no perimeter. Defense is reactive. Attackers choose the point of engagement. Adequate for routine threats; exposed to anything coordinated."
      when: !(threat === 'plagued')  AND  threat === 'frontier'  AND  !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  hasGarrison || hasMilitia
      ${?1} when hasGarrison: "a garrison"
      ${?1} when !(hasGarrison): "a militia"
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:90  CAN CO-FIRE (predicate open)
      "Active frontier with no organized defense. Vulnerable to any monster of moderate capability."
      when: !(threat === 'plagued')  AND  threat === 'frontier'  AND  !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  !(hasGarrison || hasMilitia)
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
  (excluded as contradicting the key: 9 strings)

(5) THE CLOSED ROSTERS THIS KEY DOES NOT FIX
  watch      OPEN — required only at town, city; open at village, metropolis   [town: Town watch ; city: Professional city watch]
  garrison   OPEN — required only at city; open at village, town, metropolis   [city: Professional city watch, Garrison]
  militia    OPEN — the key does not fix it and no required row seats it
  mercenary  OPEN — the key does not fix it and no required row seats it
  charter    OPEN — the key does not fix it and no required row seats it
  walls      OPEN — required only at city; open at village, town, metropolis   [city: City walls and gates]
  gates      OPEN — required only at city; open at village, town, metropolis   [city: City walls and gates]
  granary    OPEN — required only at town, city; open at village, metropolis   [town: Town granary ; city: City granaries]
  hospital   OPEN — the key does not fix it and no required row seats it
  market     OPEN — required only at town, city; open at village, metropolis   [town: Market square, Weekly market ; city: Multiple market squares, Daily markets]
  hall       OPEN — required only at town, city; open at village, metropolis   [town: Town hall ; city: City hall]
  court      OPEN — required only at town, city; open at village, metropolis   [town: Town hall ; city: City hall, Multiple courthouses]
  prison     OPEN — the key does not fix it and no required row seats it
  church     OPEN — required only at village, town, city; open at metropolis   [village: Parish church, Priest (resident) ; town: Parish churches (2-5) ; city: Parish churches (10-30)]
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
  village: the hall: — · the tavern: — · the guilds: — · the register (parish): Parish church, Priest (resident), Graveyard · the elders: —
  town: the hall: Town hall · the tavern: Taverns (5-20) · the guilds: Craft guilds (5-15) · the register (parish): Parish churches (2-5), Parish burial grounds · the elders: —
  city: the hall: City hall · the tavern: Inns and taverns (district) · the guilds: — · the register (parish): Parish churches (10-30), Burial grounds and charnel house · the elders: —
  metropolis: the hall: — · the tavern: — · the guilds: — · the register (parish): Cemetery network · the elders: —
  the key on the force buckets and the gates: watch: OPEN · garrison: OPEN · militia: OPEN · mercenary: OPEN · charter: OPEN · gates: OPEN

(7) THE SOURCES

  ⛔⛔ READ THIS FIRST — A CORRECTION TO THE INSTRUMENT'S OWN SECTIONS (2), (2b), (2b'), (5) AND (7).
  The mechanical head prints `metropolis (1): Cemetery network` as the metropolis's whole
  required set. THAT IS WRONG, and it is wrong about the LARGEST SLICE OF THIS PREIMAGE
  (metropolis 49/128 of 119 towns). `scripts/lib/prose-mark-fields.mjs:522` reads
  `catalog[tier]` raw, but the generator does not: `src/generators/steps/assembleInstitutions.js:243-245`
  builds the metropolis roster from `mergeCatalogs(institutionalCatalog['city'],
  institutionalCatalog['metropolis'])` (the merge is at `:116-124`). SO EVERY CITY REQUIRED ROW
  IS ALSO REQUIRED AT METROPOLIS: City walls and gates · Professional city watch · Garrison ·
  City hall · Multiple courthouses · City granaries · Multiple market squares · Daily markets ·
  Inns and taverns (district) · Warehouse district · Parish churches (10-30) · Burial grounds
  and charnel house · Housing · Aqueduct — plus Cemetery network. Read section (2)'s metropolis
  line as "the city's fourteen, plus Cemetery network". CONFIRMED by source; reported to the chair.

  ── WHAT THE KEY ACTUALLY FIXES, AND WHAT IT ONLY SEEMS TO ──

  `defenseStateProse.js:712` — `beastsRowPoolKey(config.monsterThreat, walls, garrison || militia)`.
  The key fixes THREE things and no more: `config.monsterThreat === 'frontier'`, the WALLS bucket
  non-empty, and the GARRISON bucket OR the MILITIA bucket non-empty. It does NOT fix which of
  the two carries the force, and section (5) is right to print garrison OPEN and militia OPEN.
  ⚠ AND THE SILENCE IS THE CORPUS'S: `beastsRowSituation` (`:431-434`) returns `''` for
  `frontier + perimeter + NO force`, so there is no neighbouring rung to bleed into on the force
  side; the only sibling rung is `perimeter = false` → `frontier, force without a perimeter`.
  A face that would sit as comfortably on that pool is saying nothing this key fixes (ruling 35).

  WHAT THE ROSTER THEN SEATS, TIER BY TIER — this is the whole card in four lines:

  • VILLAGE (3/128). The village catalogue's Defense section holds exactly two rows this key can
    fire on: `Palisade or earthworks` ("Perimeter palisade or earthwork berm. Controls approach,
    slows attackers", `institutionalCatalog.js:874-880`) and `Citizen militia` ("Organised
    community defense. Musters for raids and monster incursions", `:867-873`). THERE IS NO OTHER
    WALL ROW AND NO OTHER FORCE ROW BELOW TOWN. So on a village of this pool the perimeter is
    TIMBER OR EARTH and the force is CITIZEN VOLUNTEERS — and there is NO hall, NO tavern, NO
    guild, NO watch, NO market, NO granary, NO court on the required roster (section (2): seven
    rows, all water, dwellings, farmland, mill, church, priest, graveyard).
  • TOWN (20/128). `Town watch` is `required: true` AND carries `exclusiveGroup: 'civilianDefense'`,
    which `Citizen militia` shares (`institutionalCatalog.js:1340-1354`) — so A TOWN OF THIS POOL
    CANNOT HAVE A MILITIA (F1-26). The force is therefore the garrison bucket, and the town
    catalogue's only garrison-bucket row is `Barracks` — "Housing for guards or small garrison"
    (`:1363-1369`; bucket keyword `'barracks'`, `defenseInstitutionBuckets.js:88-91`). The word "the
    garrison" is LAWFUL off it (§R-3). The perimeter is `Town walls` — "Stone fortifications with
    gates" (`:1332-1339`) — or, on its own, `Gates (if walled)`, which lands in the walls bucket
    because `'wall'` is a substring of `'walled'` (`defenseInstitutionBuckets.js:84`).
    ⇒ EVERY TOWN OF THIS POOL CARRIES BOTH A TOWN WATCH AND A BARRACKS, as two distinct rows.
  • CITY (47/128). `City walls and gates` ("Masonry walls with towers. Multiple gatehouses"),
    `Professional city watch` ("Full-time law enforcement", and it sits in BOTH the watch and the
    garrison buckets) and `Garrison` ("Professional soldiers. Noble or royal") are ALL
    `required: true` (`:1910-1930`). The key adds NOTHING at city that the roster did not already
    guarantee: at city this pool is `monsterThreat === 'frontier'` and nothing else.
  • METROPOLIS (49/128). The city's fourteen (above), plus the optional `Massive walls and
    fortifications` and `Multiple garrisons`. `Massive walls` fixes no material (F1-32).

  ── UNIVERSAL (exists on every town this pool can draw) ──

  • THE ARCHIVER / THE OFFICE — the compiled dossier itself (`holderTable.js:78-84`, `OFFICE_KIND`).
    INTEREST: none, and that is its stake. ⛔ RULING 40: a fact the engine holds STANDS BARE in the
    archiver's hand — "The line is kept and there are men to stand on it." NEVER "the survey finds",
    "this office", "so far as the record goes". Its conjecture and its feeling live in the notebook.

  • THE STRANGER / the traveller — the road kind (`holderTable.js:232-234`: `terrainType` and
    `monsterThreat` are the road's records), which needs no roster row. INTEREST: what is visible on
    arrival, and THIS POOL GIVES HIM THE ONE THING NO OTHER BEASTS RUNG DOES — he was STOPPED. Every
    perimeter row this key can fire on turns an entry service ON at or above the bar (below), so on a
    village he states his business at a gap in a timber ring, and at a city he is inspected at a
    gatehouse. `monsterThreat` is HIS record: the frontier is the road's fact, not the hall's.

  • WHOEVER HOLDS THE WAY THROUGH — UNIVERSAL ON THIS POOL, and this is the card's one gift.
    `hasGates` (`priorityHelpers.js:53`) fires on `'gates'`, `'town walls'`, `'city walls'`,
    `'massive walls'`, `'palisade'` — which is every catalogue row that can put this key's perimeter
    in the walls bucket. And each of those rows turns a way-through service ON at or above the bar:
    `Palisade or earthworks` → **Gated entry** (p 1) "Controlled access through the perimeter.
    Strangers must state business" AND **Night watch** (p 0.8) "Basic patrol of the perimeter after
    dark"; `Town walls` → **Gate control** (p 1) "Control who enters and exits. Levy tolls on goods";
    `City walls and gates` → **Gate control** (p 1) "Multiple gated access points. Customs checks and
    toll collection"; `Gates (if walled)` → **Toll collection** (p 1) + **Entry inspection** (p 0.8)
    (`institutionServices.js:1457-1468`, `:1545-1554`). INTEREST: who comes in, what they carry, and
    what the bar is worth. ⛔ A face may NOT deny the gate or its keeping (F1-08 bars the denial as
    well as the assertion), and at a VILLAGE may not deny a perimeter patrol after dark.

  • THE MUSTER — universal as an INTEREST, never as a BODY WORD. The key fixes that somebody is under
    arms; the roster decides who, and it is a different body at every tier (village: citizen
    volunteers; town: a barracks; city and metropolis: a garrison and a professional watch).
    "The muster" is the class word and is free everywhere (F1-03). INTEREST: the pay, and it is
    ASYMMETRIC ACROSS THIS PREIMAGE — at a village the force is a `Citizen militia`, of which no
    wage, pay or arrears may be predicated at all (V-09; the row's own desc is part-time service);
    at town and above the barracks and the garrison are on the one military purse
    (`defenseGenerator.js:182`, `:189-192`).

  • THE REGISTER / a house of the faith — a church-class row is required at EVERY preimage tier
    (`Parish church` + `Priest (resident)` at village; `Parish churches (2-5)` at town; `Parish
    churches (10-30)` at city and metropolis), so the SPEAKER is universal. INTEREST: the dead and
    the observance, and on a frontier the two are the same interest. ⚠ ITS RECORD IS NOT UNIVERSAL —
    see (8).

  • THE PUBLIC `[public]` and THE ARCHIVER OBSERVING `[archiver · observed]` — always available,
    kept under NOTES until cars 18n land. The public's seeing must clear section (2b'); its
    MAKING-OF may be mistaken. The observation is a bare passive with no observer named.

  ── CONDITIONAL (and the field that seats each) ──

  • THE HALL — `Town hall` at town, `City hall` at city and metropolis (required). ⛔ ABSENT AT
    VILLAGE: F1-20 bars a hall as a place below town. INTEREST: the purse. ONE multiplier covers
    "garrison wages, wall maintenance" TOGETHER — `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)`
    (`defenseGenerator.js:182`, applied `:190-192` over the funded portion above the exempt
    `communityMilBase`) — and this is the ONE beasts rung that has BOTH things on that line at once.
    The hall is the source with the strongest reason to call the arrangement adequate.
  • THE TAVERN — `Taverns (5-20)` at town, `Inns and taverns (district)` at city and metropolis.
    ABSENT AT VILLAGE. INTEREST: the safety label (`economicState.safetyProfile.safetyLabel`, FROZEN)
    and who actually turns out.
  • THE GUILDS — `Craft guilds (5-15)` required at TOWN ONLY; not required at city or metropolis and
    not seated at village. INTEREST: what the bar costs them against what the country would.
  • THE WATCH — `Town watch` at town (part-time, "Night patrol" p 1 + "Gate duty" p 0.8), `Professional
    city watch` at city and metropolis (p 1 "Law enforcement"). ABSENT AT VILLAGE (V-23: any watch as a
    body below town contradicts `hasWatch` false). INTEREST: it is paid from the SAME military gate the
    soldiers are (F4-19), and at town it is the part-time body standing beside the paid one.
  • THE ELDERS — below town only, i.e. the 3/128 village slice. INTEREST: the custom that says who owes
    work on the ring. ⛔ F1-22 bars them as a body anywhere else.
  • THE MARKET, THE GRANARY, THE COURT — town and above only (`Market square`/`Weekly market`;
    `Town granary`/`City granaries`; `hasCourtSystem` via the hall row, R-4). None at village.
  • THE CHARTER HALL — OPEN at every tier, required nowhere. Where it stands the page prints it in the
    engine's own hand beside this pool's row: "Charter hall handles anything above the garrison usual
    remit." (`threatAssessment.js:74`). A face may not assert it and may not deny it (F1-06).
  • THE MERCENARY / a free company — OPEN. ⚠ W-01: the flag and the bucket disagree on three rows, so
    NO FACE MAY BE CHARGED on such a town — and none may be written on one either.
  • THE CROWN'S ASSESSOR — NOT A SPEAKER. The engine has no typed crown collector anywhere.

  ── THE NAMED OFFICES A SPEAKER MUST NEVER BE (F3-06; `npcGenerator.js:1511-1537`) ──
    village: Mayor · Guard Captain
    town: Mayor · Guard Captain · High Priest
    city: Mayor · Guard Captain · High Priest · Wealthiest Merchant
    metropolis: Governor · CITY WATCH CHIEF (not a Guard Captain; §V.0 floor 3) · High Priest ·
      Guild Archmage · Wealthiest Merchant
    AND BY STRESS, on a pool whose country is `frontier`: `monster_pressure` mandates a GARRISON
    COMMANDER and a RETIRED ADVENTURER (`:1530`). Both are exactly the people this pool's prose
    reaches for. Use a plural, a trade, or a bystander: "a man of the barracks", "those who keep the
    bar", "one of the volunteers" — never "the captain", "the commander", "the mayor".

(8) WHAT WOULD BE FALSE

  The claim that kills this pool is the MATERIAL ONE, and it is not close: the preimage pools a
  timber-or-earth village ring, a stone town wall, a masonry city circuit with towers, and a
  metropolis's unspecified massive works into ONE draw, so "the stone ring", "the palisade", "the
  timber", "the masonry", "the earth bank", "the towers" and "the gatehouse" are each false on some
  town the face will be drawn on — V-06 keeps the material bar AT THE POOL GRAIN until `{defmaterial}`
  lands, and F1-32 names the four rows whose own printed descriptions fix it
  (`institutionVocabulary.js:155`, `:157`, `:162`, `:278`), while F1-33 bars the material's SOURCE
  wherever a fortification chain runs; write the line, the ring, the perimeter, the works, the way
  through, and let the fill carry the substance. The second killer is the ROLL: the only institution
  in the shipped roster that keeps a muster is `Citizen militia` through `Muster training`
  (`holderTable.js:279-288`), that service is `on: false, p: 0.5` even where the militia stands
  (`institutionServices.js:837`), and the militia is EXCLUDED at town by the required `Town watch`
  (F1-26) and absent from the city and metropolis catalogues entirely — so a cited muster roll is
  unresolved on at least 116 of the 119 preimage towns and is F1-24 / F1-03, which is the sitting's
  own named failure mode word for word; a roll may be MENTIONED, never CITED (R-8), and never carries
  a number (F2-01). The same trap runs through the other records: the PARISH REGISTER is at or above
  the bar only at town (`Parish burial grounds` → Register of the dead, p 0.8) and at metropolis
  (`Cemetery network` → Central register, p 0.9) — at village the `Parish church`'s menu tops out at
  Life ceremonies and Religious services, and the city's `Burial grounds and charnel house` gives only
  Burial — so "the parish register" cited as a record is unresolved on the village and city slices;
  and the TOLL BOOK resolves only where a `Gates (if walled)` row stands (Toll collection p 1,
  `institutionServices.js:1550`), never off `Town walls` or `City walls and gates`, whose service is
  Gate control. Next, the BODY WORDS: "the militia" is false at town, city and metropolis (116/119);
  "the garrison", "the soldiers", "the barracks" are false at village (F1-02); "the watch" is false at
  village (F1-01, V-23); "the guard" is free wherever any law body stands and false nowhere here
  (R-5), and "the muster" as the class word is free everywhere — so the class words are the only
  bodies a face may name without a hedge, and the tier-specific ones belong in the fill. At TOWN the
  watch may not be called professional, full-time, or soldiers (F1-27; the row reads "Part-time
  guards"), while at CITY a watch and a garrison ARE two distinct required rows and the contrast is
  LAWFUL there (§V.2's correction to F1-29). NO PAY, WAGE OR ARREARS may be predicated of the village's
  citizen militia (V-09), and nothing may split the purse: the wall's keeping and the soldiers' wages
  run through ONE multiplier over ONE input (F4-02, `defenseGenerator.js:182`, `:189-192`), the four
  gates differ in degree and never in direction (F4-03), and a TOTAL failure of pay is refused — the
  gate has a floor of 0.6 and the community baseline is exempt, so "short", "late", "thin" and men
  drifting off slowly are the licensed extreme and "nothing has been paid", "there is no one left"
  are not (F4-04, R-9). On the FABRIC: no rot, no weathering, no erosion, no "timber rots", no "stone
  endures" — and equally no PERMANENCE, because calamity, razing and the purse's own economic-distress
  closure all remove built rows and the upgrade chain DEMOTES `City walls and gates` → `Town walls` →
  `Palisade or earthworks` (F4-01 as §V.0 re-cuts it; `institutionLifecycle.js:792-848` reaches both
  the palisade and the town walls, and only `City walls and gates` is exempt). NOTHING MAY DENY WHAT
  THE PERIMETER'S OWN MENU TURNS ON: the way through is controlled and strangers state their business
  on every town of this preimage, and at a village the perimeter is patrolled after dark (Night watch,
  p 0.8) even though `hasWatch` is false — so "nobody watches the line", "the way is open to anyone",
  "there is no one on the perimeter at night" are floor 1 against the services panel, and "there are
  no gates" is floor 1 against F1-08 in the denial direction. Nothing may deny a required row's
  services anywhere in section (2b), and a face may not INFER a body into the key's silence that a
  required row denies — no "nobody is set up to answer" at town or above, where a Town watch or a
  Professional city watch and a hall are required. On the READING of the state: `frontier` is the
  MIDDLE rung, not the worst — `MONSTER_THREAT_TIERS` is `['heartland', 'frontier', 'plagued']`
  calmest to most dangerous and names `heartland` "the calm baseline" in its own comment
  (`src/data/monsterThreat.js:20-28`; the corpus family word for `heartland` is `settled`,
  `defenseStateProse.js:328-332`), so the country here is ACTIVE and the arrangement is ADEQUATE, which is the engine's own
  word beside the face ("Adequate for the threat level", `threatAssessment.js:74`); a face that writes
  the town as besieged, cowed or losing reads as the `plagued` rung (ruling 35 names it), and a face
  that writes it as quiet, over-provided or ceremonial reads as `settled, defenses beyond the need`.
  `plagued` is MONSTERS and never disease (F4-05), and no face may claim a TOTALITY of safety —
  "nothing gets through", "nothing threatens the town" — because the same page builds an Invasion &
  War row for every town (F1-34). On TIME: no date, no season, no duration, no founding, no raising,
  no event the record did not run, no trend, no rate — "most nights", "every spring", "seldom", "more
  often than not" are all refused (F2-01 through F2-08, F2-06 named twice because the gate invites
  it), and no history may be alluded to at all because this key reads no history field (F2-09). BUT
  THE PERFECT AND THE DURATIVE ARE LICENSED HERE, and widely: `config.monsterThreat`,
  `economicState.safetyProfile.*`, `defenseProfile.scores.military`, `defenseProfile.institutions.*`,
  `economicState.compound.inst.*`, `defenseProfile.economicGates.*` and `stress` all carry ZERO
  writers under `src/domain/worldPulse/` (section (6)) — so "the country has been active for as long
  as the arrangement has answered it" is lawful over the frozen reads, while ANY elapsed course over
  the walls, garrison, militia, watch, mercenary or charter buckets is REFUSED, because those are the
  LIVE roster with 38 writers. ⛔ AND ONE ROW OF SECTION (6) MUST NOT BE READ AS IT PRINTS:
  `standingDefenseForces(settlement)` shows `writers 0 FROZEN`, but it is a FUNCTION, not a field —
  `defenseInstitutionBuckets.js:169-170` partitions `liveInstitutions(settlement)` on every call, so
  it carries the live roster's 38 writers and the perfect and the durative are REFUSED over it. The
  zero is the instrument counting writers against a call expression it cannot resolve to a path. On SCOPE: no named character's fate, nothing predicated of a deity
  (the followers act, the god does not, F3-02), and no cultural furniture the profile denies — eleven
  culture profiles ship and no defense pool reads one, so no thatch, no churchyard, no market green,
  no snow on the road, no north-European village (F3-05, the row most likely to recur). No singular
  tiered office may act (F3-06 and the roster above). And the COVERT bar: section (2c) prints that
  NONE of this block's three covert fields mark this pool, so no `compromised` tag may be offered
  here at all and the tag would be refused on any source (26 (h)); nothing covert reaches a player
  face (F4-13). Finally the SHAPE bars that red the build: no em dash, no exclamation mark, no digit,
  no `{settlement}` inside a `[face]` sub-row and at most one unit in the pool naming the town at all
  (ruling 12), four faces per variant each a different sentence, one or two sentences per face, and
  no tell — no which-clause closer, no summarising close, no antithesis pair, no reassurance, no
  clever last beat.

(9) WHERE THE FLAVOUR IS

  WHAT IS IN USE: the way through, on every town of this preimage, and it is the one concrete thing
  the whole pool shares — a stranger states his business at a gap in a berm or is inspected at a
  gatehouse, goods are counted through, and the bar is worth something to whoever holds it. This is
  the only beasts rung where the perimeter is USED rather than argued about, and the engine's own
  service words are the vocabulary: controlled access, entry inspection, customs, tolls, a patrol of
  the perimeter after dark. Second: the town's arrangements are ORDINARY. `frontier` is the country's
  middle rung and the face beside this pool says adequate — so the flavour is competence at rest, a
  thing done so long it is done without discussion, and the sharpest faces are about the ROUTINE
  rather than the danger.

  WHAT IS IN DISPUTE: the ONE PURSE with TWO things on it. This is the only beasts rung whose key
  fixes both a perimeter and a force, so the hall's military line buys the keeping of a thing that
  outlasts the year AND the wages of men who do not, out of one multiplier (`defenseGenerator.js:189`).
  Every source has a different stake in which half is short: the hall defending the line as adequate;
  the guilds paying into it and counting the bar as a cost against a country they do not see; at town
  the part-time watch standing beside the paid barracks on the same gate; at village the volunteers
  who muster for raids and are owed nothing for it. Two sources may read one fact differently and the
  archiver sets both down — that disagreement is the session, and here it has a purse behind it.

  WHAT THE ABSENCE LOOKS LIKE ON THE GROUND: there is no absence of defence on this pool, and that is
  the trap — the absence here is of ALARM. What is missing is the thing a frontier is supposed to
  produce: nobody is frightened, the arrangement is not discussed, the country outside is real and
  routine at once, and the interesting silence is what the people who keep it are NOT asking for.
  Downward, the absences are institutional and tier-shaped: at a village there is no hall to appeal
  to, no watch, no market, no granary and no court — a timber ring, volunteers, a mill, a church and
  a graveyard, and every question about who decides anything goes to the elders and the custom.
