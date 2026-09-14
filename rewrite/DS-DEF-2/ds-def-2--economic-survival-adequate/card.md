THE CARD (mechanical sections) — block DS-DEF-2 · pool `Economic Survival: ADEQUATE` · dir ds-def-2-economic-survival-adequate

(1) THE KEY AND ITS PREIMAGE
  key function: ECONOMIC_ROW_POOL (rung table) · site defense.threatAssessment
  census predicate: scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js) === ADEQUATE
  read economicScore  -> defenseProfile.scores.economic           [SNAPSHOT] writers 0   (resolved through economicRowPoolKey's call site in the entry point)
  the key FIXES: economicScore:range=[40,64] · leaves OPEN: economicScore   (economicRowPoolKey, 25 combination(s))
  preimage on the 768-town rate grid: 99 towns (1289 bp) — hamlet 9/128 · village 46/128 · town 25/128 · city 11/128 · metropolis 8/128
  silent tiers: thorp

(2) THE REQUIRED ROWS (institutionalCatalog required: true) at every preimage tier — bodies a face may not deny or infer away
  hamlet (7): Access to parish church [Religious] · Burial ground [Religious] · Dwellings (17-80) [Infrastructure] · Water source [Infrastructure] · Access to external mill [Economy] · Subsistence farming [Economy] · Common grazing land [Economy]
  village (7): Multiple water sources [Infrastructure] · Dwellings (80-180) [Infrastructure] · Farmland [Economy] · Mill [Crafts] · Parish church [Religious] · Priest (resident) [Religious] · Graveyard [Religious]
  town (13): Town granary [Economy] · Market square [Economy] · Weekly market [Economy] · Craft guilds (5-15) [Economy] · Inn (multiple) [Economy] · Taverns (5-20) [Economy] · Mills (2-5) [Crafts] · Parish churches (2-5) [Religious] · Parish burial grounds [Religious] · Town watch [Defense] · Town hall [Infrastructure] · Housing (180-1000 structures) [Infrastructure] · Multiple water sources [Infrastructure]
  city (14): City granaries [Economy] · Multiple market squares [Economy] · Daily markets [Economy] · Inns and taverns (district) [Economy] · Warehouse district [Economy] · Parish churches (10-30) [Religious] · Burial grounds and charnel house [Religious] · City walls and gates [Defense] · Professional city watch [Defense] · Garrison [Defense] · City hall [Infrastructure] · Multiple courthouses [Infrastructure] · Housing (1000-5000 structures) [Infrastructure] · Aqueduct or water system [Infrastructure]
  metropolis (1): Cemetery network [Religious]

(2b) WHAT A FACE MAY NOT DENY OF THE REQUIRED ROWS — the services the engine's own menu turns on at p ≥ 0.8, and the derivation that files the row
  Access to external mill (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Access to parish church (required at hamlet) — a face may not deny: Sunday mass (p 1) · Baptism (p 0.9) · Last rites (p 0.9) · Marriage ceremony (p 0.9) · filed under the `church` roster
  Aqueduct or water system (required at city) — a face may not deny: Clean water distribution (p 1) · filed under no closed roster
  Burial ground (required at hamlet) — a face may not deny: Burial (p 1) · filed under no closed roster
  Burial grounds and charnel house (required at city) — a face may not deny: Burial (p 1) · filed under no closed roster
  Cemetery network (required at metropolis) — a face may not deny: Burial (p 1) · Central register (p 0.9) · filed under no closed roster
  City granaries (required at city) — a face may not deny: Grain storage (p 1) · filed under the `granary` roster
  City hall (required at city) — a face may not deny: Civic licensing (p 1) · Appeals court (p 0.8) · filed under the `hall` roster · filed under the `court` roster
  City walls and gates (required at city) — a face may not deny: Gate control (p 1) · filed under fortifications (deriveArmedForces) · filed under the `gates` roster
  Common grazing land (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Craft guilds (5-15) (required at town) — a face may not deny: Quality certification (p 1) · Apprenticeship programs (p 0.8) · filed under no closed roster
  Daily markets (required at city) — a face may not deny: Fresh produce (p 1) · General trade (p 0.9) · Street food (p 0.8) · filed under the `market` roster
  Dwellings (17-80) (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
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
  Subsistence farming (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Taverns (5-20) (required at town) — a face may not deny: Drink service (p 1) · Meals (p 0.8) · filed under no closed roster
  Town granary (required at town) — a face may not deny: Grain storage (p 1) · filed under the `granary` roster
  Town hall (required at town) — a face may not deny: Permit applications (p 1) · Tax payment (p 0.9) · Dispute arbitration (p 0.8) · filed under the `hall` roster · filed under the `court` roster
  Town watch (required at town) — a face may not deny: Night patrol (p 1) · Gate duty (p 0.8) · filed under standing (deriveArmedForces)
  Warehouse district (required at city) — a face may not deny: Goods storage (p 1) · filed under no closed roster
  Water source (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Weekly market (required at town) — a face may not deny: General trade (p 1) · Tax collection (p 0.9) · filed under the `market` roster
  ⛔ A SERVICE AT OR ABOVE THE BAR IS A THING THE TOWN'S OWN MODEL SAYS THIS BODY DOES: denying it is floor 1, whatever the face is otherwise about. A row filed under `standing` is UNDER ARMS in the engine's reading even where the key fixes no garrison and no militia.

(2b′) THE OBSERVER'S AND THE PUBLIC'S LIST: what neither may claim to have seen
  Access to external mill (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Access to parish church (required at hamlet) — NOT SEEN is a claim about: Sunday mass · Baptism · Last rites · Marriage ceremony
  Aqueduct or water system (required at city) — NOT SEEN is a claim about: Clean water distribution
  Burial ground (required at hamlet) — NOT SEEN is a claim about: Burial
  Burial grounds and charnel house (required at city) — NOT SEEN is a claim about: Burial
  Cemetery network (required at metropolis) — NOT SEEN is a claim about: Burial · Central register
  City granaries (required at city) — NOT SEEN is a claim about: Grain storage
  City hall (required at city) — NOT SEEN is a claim about: Civic licensing · Appeals court
  City walls and gates (required at city) — NOT SEEN is a claim about: Gate control
  Common grazing land (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Craft guilds (5-15) (required at town) — NOT SEEN is a claim about: Quality certification · Apprenticeship programs
  Daily markets (required at city) — NOT SEEN is a claim about: Fresh produce · General trade · Street food
  Dwellings (17-80) (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
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
  Subsistence farming (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Taverns (5-20) (required at town) — NOT SEEN is a claim about: Drink service · Meals
  Town granary (required at town) — NOT SEEN is a claim about: Grain storage
  Town hall (required at town) — NOT SEEN is a claim about: Permit applications · Tax payment · Dispute arbitration
  Town watch (required at town) — NOT SEEN is a claim about: Night patrol · Gate duty
  Warehouse district (required at city) — NOT SEEN is a claim about: Goods storage
  Water source (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Weekly market (required at town) — NOT SEEN is a claim about: General trade · Tax collection
  ⛔ AN OBSERVATION AND A PUBLIC FACE ARE FACTS THEIR SPEAKER CLAIMS (rulings 27 (a), 28 (a)), so neither may INFER INTO A SILENCE a required row denies. On a preimage carrying a `Town watch`, "no member of the watch has walked the wall" is floor 1 in a witness's coat; "no soldier has been seen on the wall" is true on every town that draws a key fixing no garrison and no militia. The PUBLIC's second half — what everyone MAKES of what it saw — is a perception and may be mistaken; the seeing may not.
  ⛔ AND THE FAIR COPY DOES NOT CITE ITSELF (ADDENDUM 18 ruling 40, the owner's): an observation is a BARE PASSIVE with no observer named — never "in the survey's time here", "on the nights the survey kept", "it is observed that", "this office".

(2c) COVERT FIELDS AND THEIR SYMPTOMS ON THIS BLOCK (ADDENDUM 18 ruling 26) — the INVERTED test the refuter judges a `compromised` face under
    hall ← powerStructure.criminalCaptureState at `corrupted` or `capture`
        SYMPTOM: THE PURSE AND THE ACCOUNTS — what the hall says the town's money does, and who decides it. DS-DEF-4 says the fact outright ("the hall's decisions are not the hall's"), so a hall face on a purse pool may reassure that the accounts are in order and may deny NOTHING ELSE.
        marks the pools: Invasion & War: walls with NO force · Economic Survival: STRONG · Economic Survival: ADEQUATE · Economic Survival: WEAK
        ⭐ THIS POOL IS ONE OF THEM
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
    Burial ground: "at the edge" — stated only at hamlet — silent at village, town, city, metropolis   [the catalog row]
        the data says: "A walled plot at the edge of the settlement, gated against livestock and kept by the households in turn."
    Burial grounds and charnel house: "inside the walls" — stated only at city — silent at hamlet, village, town, metropolis   [the catalog row]
        the data says: "The parish grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next."
    Burial grounds and charnel house: "outside the gates" — stated only at city — silent at hamlet, village, town, metropolis   [the catalog row · the `Burial` service]
        the data says: "New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening."
    Market square: "in the square" — stated only at town — silent at hamlet, village, city, metropolis   [the `Civic announcements` service]
        the data says: "Official proclamations, wanted notices, and public notices read in the square."
    Parish burial grounds: "beyond the gate" — stated only at town — silent at hamlet, village, city, metropolis   [the catalog row]
        the data says: "Each parish keeps its own ground beside its church, and a parish that has filled its ground buries beyond the gate instead."
  ⛔ A FACE DRAWS ON EVERY TOWN OF THE PREIMAGE, so a placement the data states only at the city is an INVENTION on the thorp (floor 2), and a hedged one is a tendency rather than this town's fact.

(2d) THE KEY'S SIBLING RUNGS — what this pool's key would have been had ONE of the fields it fixes been otherwise
    (none: no field this key fixes has a small declared domain, so no neighbour can be enumerated)
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
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:54  CAN CO-FIRE (predicate open)
      "Embattled region: constant creature pressure. Walls and garrison have established a survivable posture. Defense is an ongoing operational necessity. ${?1}"
      when: threat === 'plagued'  AND  hasWalls && hasGarrison
      ${?1} when hasCharter: "Charter hall coordinates specialist monster response."
      ${?1} when !(hasCharter): "No specialist monster hunters on retainer: the garrison handles everything."
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:59  CAN CO-FIRE (predicate open)
      "Palisade and citizen militia provide a viable but demanding posture in an embattled region. Watch rotations are thin. Simultaneous incursions will break coverage. ${?1}"
      when: threat === 'plagued'  AND  !(hasWalls && hasGarrison)  AND  hasWalls && hasMilitia
      ${?1} when hasCharter: "Charter hall provides specialist backup."
      ${?1} when !(hasCharter): "No specialist monster hunters."
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:64  CAN CO-FIRE (predicate open)
      "No perimeter, but the charter hall provides specialist response for coordinated threats. Creatures that get past initial response reach homes directly."
      when: threat === 'plagued'  AND  !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  hasCharter
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:66  CAN CO-FIRE (predicate open)
      "Walls exist but no organized force to sustain a watch rotation. The palisade creates a chokepoint but holding it requires people, and there are not enough for sustained watch."
      when: threat === 'plagued'  AND  !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  !(hasCharter)  AND  hasWalls
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:68  CAN CO-FIRE (predicate open)
      "Military force present but no perimeter walls. The garrison engages in the open. Creatures can approach from any direction."
      when: threat === 'plagued'  AND  !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  !(hasCharter)  AND  !(hasWalls)  AND  hasGarrison
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:70  CAN CO-FIRE (predicate open)
      "embattled region with no organized defense and no perimeter. Survival depends on terrain, luck, and the ability to flee. This settlement is in extreme danger."
      when: threat === 'plagued'  AND  !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  !(hasCharter)  AND  !(hasWalls)  AND  !(hasGarrison)
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
  (excluded as contradicting the key: 0 strings)

(5) THE CLOSED ROSTERS THIS KEY DOES NOT FIX
  watch      OPEN — required only at town, city; open at hamlet, village, metropolis   [town: Town watch ; city: Professional city watch]
  garrison   OPEN — required only at city; open at hamlet, village, town, metropolis   [city: Professional city watch, Garrison]
  militia    OPEN — the key does not fix it and no required row seats it
  mercenary  OPEN — the key does not fix it and no required row seats it
  charter    OPEN — the key does not fix it and no required row seats it
  walls      OPEN — required only at city; open at hamlet, village, town, metropolis   [city: City walls and gates]
  gates      OPEN — required only at city; open at hamlet, village, town, metropolis   [city: City walls and gates]
  granary    OPEN — required only at town, city; open at hamlet, village, metropolis   [town: Town granary ; city: City granaries]
  hospital   OPEN — the key does not fix it and no required row seats it
  market     OPEN — required only at town, city; open at hamlet, village, metropolis   [town: Market square, Weekly market ; city: Multiple market squares, Daily markets]
  hall       OPEN — required only at town, city; open at hamlet, village, metropolis   [town: Town hall ; city: City hall]
  court      OPEN — required only at town, city; open at hamlet, village, metropolis   [town: Town hall ; city: City hall, Multiple courthouses]
  prison     OPEN — the key does not fix it and no required row seats it
  church     OPEN — required only at hamlet, village, town, city; open at metropolis   [hamlet: Access to parish church ; village: Parish church, Priest (resident) ; town: Parish churches (2-5) ; city: Parish churches (10-30)]
  ⚠ `court` is hasCourtSystem and its keyword list includes 'town hall' and 'city hall': a required Town hall seats a court in the engine's model.

(6) THE FROZEN FIELDS (writers under src/domain/worldPulse/, field grain)
  defenseProfile.scores.economic                       writers  0  FROZEN [SNAPSHOT]
  defenseProfile.readiness.score                       writers  0  FROZEN [SNAPSHOT]
  name                                                 writers 201  LIVE   [PULSE]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulse.js:1312, src/domain/worldPulse/applyWorldPulseOccupationAuthority.js:164, src/domain/worldPulse/applyWorldPulsePrimitives.js:38, src/domain/worldPulse/brokeragePatronage.js:178 … +197
  config.monsterThreat                                 writers  0  FROZEN [CONFIG]
  institutions[bucket=walls]                           writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=garrison]                        writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=militia]                         writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  economicState.compound.inst.hasCourtSystem           writers  0  FROZEN [SNAPSHOT]
  economicState.compound.inst.hasPrison                writers  0  FROZEN [SNAPSHOT]
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
  hamlet: the hall: — · the tavern: — · the guilds: — · the register (parish): Access to parish church, Burial ground · the elders: —
  village: the hall: — · the tavern: — · the guilds: — · the register (parish): Parish church, Priest (resident), Graveyard · the elders: —
  town: the hall: Town hall · the tavern: Taverns (5-20) · the guilds: Craft guilds (5-15) · the register (parish): Parish churches (2-5), Parish burial grounds · the elders: —
  city: the hall: City hall · the tavern: Inns and taverns (district) · the guilds: — · the register (parish): Parish churches (10-30), Burial grounds and charnel house · the elders: —
  metropolis: the hall: — · the tavern: — · the guilds: — · the register (parish): Cemetery network · the elders: —
  the key on the force buckets and the gates: watch: OPEN · garrison: OPEN · militia: OPEN · mercenary: OPEN · charter: OPEN · gates: OPEN

--------------------------------------------------------------------------------

(7) THE SPEAKERS

⛔ READ THIS FIRST — FIVE THINGS, TWO OF WHICH THE INSTRUMENT CANNOT PRINT.

  A. **THIS PREIMAGE IS CUT IN HALF BY THE TOWN LINE, AND ALMOST NOTHING CROSSES IT.**
     village 46 · town 25 · city 11 · hamlet 9 · metropolis 8; silent at thorp. **55 towns
     below town and 44 at town and above.** The brief's town-and-above roster — the hall, the
     guilds, the granary, the watch — stands on the 44 and on NONE of the 55. Measured: a hall
     as a BUILDING 44/99 (town 25 · city 11 · metropolis 8, and not one village or hamlet); a
     guild row 44/99; a granary building 44/99 (the same 44, exactly); a `Town watch` or
     `Professional city watch` row 44/99. This desk is two towns wearing one badge.
  B. **THE KEY FIXES EXACTLY ONE FIELD** — `defenseProfile.scores.economic` in [40,64] — and
     (2d) confirms it enumerates no sibling rung. Everything else on the page is OPEN.
  C. **THAT ONE FIELD IS FROZEN** (writers 0). It is the key's own read AND a zero-writer read,
     so ADDENDUM 18 ruling 11 licenses the perfect and the durative over it twice over.
  D. ⭐⭐ What the instrument cannot print, and the marker measured: **THE BAND STRADDLES NO
     MACHINE THRESHOLD.** Measured score min 40 · median 47 · max 64; `econScore >= 65` on 0 and
     `>= 25` on 99. This is the OPPOSITE of the WEAK desk's condition. **One machine sentence,
     and only one, fires on all 99 towns from this pool's own read** — and it is the single most
     load-bearing line on the card.
  E. And: **the ELDERS are not a source on this desk.** `Informal elder consensus` stands on 2
     of 99. The below-town governing row here is the LORD'S MAN — `Village reeve` 30 +
     `Lord's steward` 22 = **52 of 99**, and every one of them below town.

--- ⭐ THE MARKER'S MEASUREMENT (executed, read-only, in the dock) ---

  Method: `rateGrid()` from `scripts/prose-rate-corpus.mjs` (768 rows), each generated through
  `generateSettlementPipeline(config, null, {seed, customContent: {}})`, then filtered to
  `defenseProfile.scores.economic` in [40,64]. **N = 99**, against the instrument's 99 — exact
  agreement. Tiers: village 46 · town 25 · city 11 · hamlet 9 · metropolis 8 · thorp 0.
  Nothing was written; every figure below is a count over those 99.
  Measured score: min 40 · median 47 · max 64.

  ⭐⭐ **THE POOL'S OWN MACHINE ROW IS UNIFORM, AND IT SAYS BOTH THINGS AT ONCE.** On every one
     of the 99, `threatAssessment.js:169` prints **"Adequate economic resilience for a
     short-term crisis. A prolonged siege will begin straining reserves within months."** and
     `defenseDisplay.js:221` prints **"Adequate upkeep, some shortfalls."**
     ⛔ **SO BOTH EXTREMES ARE FLOOR 1 ON EVERY TOWN OF THE PREIMAGE, NOT ON HALF OF IT.**
     "Nothing here is short" · "the purse covers what it is asked for" · "no one has any
     complaint of the money" contradict *some shortfalls*. And "there is nothing to spend" ·
     "the town cannot pay for anything" · "the purse is empty" contradict *adequate economic
     resilience*. **What is licensed on all 99 is the SHORTFALL THAT IS NOT A FAILURE** — a
     thing that works, and works with gaps in it, and has a limit nobody has walked up to.
     This is the pool's whole subject and the writers should be told it in one line.

  ⭐⭐ **THE UNDERFUNDED LINE FOLLOWS THE TIER, NOT THE SCORE.** `economicGates.economic` is
     present 99/99 and **below ×1.0 on 48** (min 0.67) — and those 48 are **all 44 town-and-above
     towns plus 4 below**. So `defenseDisplay.js:320` prints `Upkeep underfunded: crisis
     logistics at 67-99%` on every town, city and metropolis of this preimage and on almost no
     village. Monster and disaster gates split the same way (below 1 on 48; min 0.82 and 0.73).
     `economicGates.military` is present on **80** (below 1 on 48, min 0.76) — on the other 19
     there is no funded force for it to gate. `internal` is present on 44, below 1 on all 44.
     ⚠ F4-19 binds: where the military gate exists it IS the watch's pay.

  ⭐ **WHAT STANDS ON ALL 99.** Unlike the WEAK desk, this preimage HAS a universal roster.
     Measured intersection over 99 towns:
       a burial place        99/99  (`Graveyard` 46 · `Parish burial grounds` 25 ·
                                     `Burial grounds and charnel house` · `Cemetery network` 8)
       a market or fair      99/99  (`Weekly market` 71 · `Fish market` 54 · `Market square` 28
                                     · `Annual fair` 27; `inst.hasMarket` true 99/99)
       water                 99/99  · dwellings 99/99 · `inst.hasChurch` 99/99
       a drinking house      95/99  (4 short: 2 villages, 2 hamlets)
       a church standing HERE 90/99 (`Access to parish church` — the 2-5 km walk — on the 9
                                     hamlets only; `Parish church` + `Priest (resident)` on all
                                     46 villages) [F1-11 bites on nine towns, not on ninety]
       a mill the town owns  71/99  (`Access to external mill`, the manor's, on 31) [F1-15]
       a smith               71/99

  FLAGS (of 99): hasChurch 99 · hasMarket 99 · hasMilitaryInst 74 · hasWalls 62 · hasGates 62 ·
     hasCharterHall 55 · hasWatch 44 · hasGranary 44 · hasCourtSystem 44 · hasHospital 41 ·
     hasMercenary 41 · hasMerchantGuild 40 · hasGangInfra 36 · hasGarrison 34 · hasPrison 33 ·
     hasSmuggling 28 · hasMilitia 25 · hasMagicInst 24 · hasThievesGuild 16 · hasAlchemist 9 ·
     hasPort 6 · hasMagesGuild 3 · hasWizardTower 2 · **hasNavy 0**.
  BUCKETS (`standingDefenseForces`): walls 62 · charter 53 · watch 44 · garrison 34 ·
     militia 25 · magicDef 23 · mercenary 13.
  FORCE ROWS BY NAME: `Adventurers' charter hall` 34 · `Citizen militia` 25 · `Town watch` 25 ·
     `Professional city watch` 19 (sits in BOTH the watch and garrison buckets) · `Garrison` 19
     · `Multiple adventurers' guilds` 19 · `Barracks` 15 · `Mercenary quarter` 13 ·
     `Multiple garrisons` 7. **`Household levy` 0 on this preimage** — the §1.4 W-02 wiring row
     does not reach this desk at all.
  ⚠ **`Citizen militia` AND `Town watch` NEVER CO-OCCUR** (measured overlap 0 of 99): the
     `civilianDefense` exclusive group [F1-26]. 25 towns have the one, 25 the other.
  WALL ROWS: `Palisade or earthworks` 24 · `City walls and gates` 19 · `Town walls` 15 ·
     `Gates (if walled)` 15 · `Citadel` 13. ⚠ V-06 keeps the material bar at the POOL grain:
     24 timber towns against 34 masonry ones, so **no wall material may stand for the pool**
     [F1-32].
  GOVERNING ROWS: `Village reeve` 30 · `Town hall` 25 · `Lord's steward` 22 · `Mayor and
     council` 21 · `City hall` 19 · `Guild governance` 10 · `Elder Grove Council` 3 ·
     `Town council` 2 · `Informal elder consensus` 2. One town carries none of them.
  PROSPERITY: Moderate 29 · **Comfortable 26 · Prosperous 19** · Struggling 13 · Poor 12. So
     **45 of 99 are Comfortable or Prosperous and only 25 are Poor or Struggling** — "this is a
     poor place" is contradicted on three towns in four.
  FOOD: `Import-Dependent` 41 · `Pressured` 23 · `Secure` 19 · `Deficit` 11 · `Deficit — Active
     Famine` 5 [F1-44 — `Secure` is not "feeds itself"]. `economicViability.viable` false on 20.
  READINESS BAND: 40-64 on 42 · 25-39 on 38 · <25 on 13 · >=65 on 6. ⚠ R-2: the readiness badge
     and this key are two clocks and neither refutes the other.
  STRESS: none 63 · indebted 9 · plague_onset 6 · politically_fractured 5 · famine 5 ·
     mass_migration 3 · under_siege 2 · wartime 2 · insurgency 2 · succession_void 1 ·
     recently_betrayed 1 · infiltrated 1. ⭐ `occupied`, `slave_revolt` and `religious_conversion`
     never occur on this preimage.
  SAFETY LABEL: `Moderate` 63 · `Tense — Debt Crisis` 8 · `Dangerous — Plague Unrest — Plague
     Conditions` 6 · `Dangerous — Famine Conditions` 5 · the rest singletons.
  THREAT: heartland 38 · frontier 36 · **plagued 25** [F4-05: monsters, never disease].
  ROUTE: crossroads 24 · port 19 · isolated 14 · mountain_pass 14 · river 11 · none 9 · road 8
     — ⚠ and `hasPort` fires on SIX towns, so `port` here is a river dock or a landing on most
     of the nineteen [F1-18]. CULTURE: all eleven profiles, 6 to 14 towns each [F3-05].
  CAPTURE: none 71 · **equilibrium 18 · corrupted 7** · adversarial 3.

--- ⭐⭐ THE MACHINE SENTENCES THAT ACTUALLY PRINT (measured, not predicted) ---

  `guardEffectivenessDesc` over the 99, by family:
     **25** — "The citizen militia musters when needed but cannot maintain consistent patrol.
              Volunteers with other work to do; reliable in a crisis, absent during routine
              crime." (`safetyProfile.js` militia arm)
     **25** — "There is no formal enforcement body. Order is maintained through community social
              pressure, the authority of established families, and the implicit threat of
              collective action against those who break the peace." (`safetyProfile.js:380`)
              — measured tiers: **village 22 · hamlet 3**, and NOT ONE town-and-above town.
     **35** — the "maintains standard patrol coverage" arm (garrison and city watch 19 ·
              garrison and town watch 11 · town watch 5, across eight `prisonNote`/`wallNote`
              spellings)
       7 — a mercenary company provides enforcement · 4 — well-funded, properly equipped ·
       3 — the adventurers' charter hall coordinates emergency response
       (25 + 25 + 35 + 7 + 4 + 3 = 99)
  `safetyDesc` over the 99: "Locals watch over the main paths" on 26 · "Militia volunteers
     patrol the main paths" on 22 · "The garrison patrols the main paths" on 11 · "The watch
     covers the main paths" on 2 · the remaining 38 are the stress arms (debt 8, famine 5,
     plague 5, fracture 4, migration 3, siege 2 …).

  ⛔⛔ **THE SITTING'S NAMED FAILURE MODE SITS ON 25 OF 99, AND IT IS A TIER FACT.** "Nobody is
  set up to respond", "nothing here is arranged for it", "there is no one whose business it is"
  are **FLOOR 1 BY INFERENCE** on the 22 villages and 3 hamlets where `safetyProfile.js:380`
  prints that order IS maintained — by community pressure, by established families, by the
  threat of collective action. And the mirror error is just as live on the other side of the
  town line: on the 44 town-and-above towns a **`Town watch` or `Professional city watch` and a
  `Town hall` or `City hall` are REQUIRED rows** (section 2), so "there is no watch", "no one
  keeps a round", "there is no hall to take it to" is floor 1 outright [F1-01, F1-20, F1-25].
  The absence this key licenses is never an absence of arrangement, of people, or of anybody
  caring — it is a LIMIT on what the arrangement can be asked for.

--- ⭐⭐ THE RECORD MEASUREMENT, AND THE RULING THAT FOLLOWS FROM IT ---

  `holdersOf(kind, settlement)` over all twelve `HOLDER_KINDS` on the 99:

      treasury  42/99      court   37/99      market  28/99      parish   17/99
      toll-bar  17/99      watch    8/99      road     6/99
      **muster 0 · census 0 · elders 0 · tradition 0 · office 0**

  By name: `Weekly market` (treasury) 31 · `Market square` (market) 28 · `Multiple courthouses`
  19 · `Courthouse` 18 · `Gates (if walled)` (toll-bar) 15 · `Town hall` (treasury) 14 ·
  `Parish burial grounds` (parish) 11 · `Professional city watch` (watch) 8 ·
  `Multiple court buildings` 8 · `Cemetery network` (parish) 6 · `Listening post` (road) 6.

  ⛔⛔ **NOT ONE KIND REACHES HALF THIS PREIMAGE, AND THE MUSTER RESOLVES TO NOBODY ON ALL 99.**
  The best-held record is the treasury at 42 percent. A face draws on every town of the preimage,
  so **THE WRITERS MAY CITE NO RECORD BY NAME ON THIS POOL** — not the accounts, not the toll
  book, not the parish register, not the market's book, and above all **not a muster roll, which
  resolves to nobody on all 99** [F1-24, §R-8, V-01, and the sitting's own named failure mode].
  Attribution runs to PEOPLE and never to books. The record WORDS stay free in a sentence that
  does not cite one as a source (W24 is struck): a reeve may keep a tally; the hall may be asked
  what it owes.
  ⚠ AND THE `elders` KIND RESOLVES ON **0 OF 99** — the WEAK desk's thirteen are thorps and this
  desk has none.

--- THE SPEAKERS THE BRIEF SEATS ON EVERY TOWN OF THIS PREIMAGE (universal) ---

  1. **THE STRANGER** — seated by the brief, needing no row. INTEREST: arrives at a place that
     is plainly working, plainly provided for, and plainly stopping short of something — and can
     name the stopping-short because nobody who lives here has to.
     ⚠ bounded by (2b′): a stranger reports what could be SEEN, and may not have failed to see
     the service of a row the tier requires.

  2. **THE TOWN'S OWN PEOPLE** — the public, for what everyone saw at once and nobody disputes.
     Seated everywhere by definition. ⚠ the `[public]` tag stays under NOTES until car 18n lands.

  3. ⭐ **WHOEVER KEEPS THE BURIAL GROUND** — a burial place stands on **99 of 99**, the single
     best-held roster class on the card and the only body-bearing row that crosses the town line
     intact (`Graveyard` 46 · `Parish burial grounds` 25 · `Burial grounds and charnel house` ·
     `Cemetery network` 8). INTEREST: the one duty on this desk that is performed whatever the
     purse says, and the one cost nobody proposes to trim. On a pool about a limit, the source
     that is never asked to wait is worth more than a fourth voice about money.
     ⛔ the `parish` kind resolves on 17 of 99, so they SPEAK and cite no register [F1-24].
     ⛔ say "those who keep the ground", "the sexton", "whoever says the words over them" —
     never "the priest" (`Parish Priest` minted on 19, `High Priest` on 48) [F3-06].

  4. ⭐ **WHOEVER SELLS** — a market or fair stands on **99 of 99** and `inst.hasMarket` is true
     on all 99, so F1-10 does not bite anywhere on this desk. The rows differ, and the writers
     should say the row's own kind where they can: `Weekly market` 71 · `Fish market` 54 ·
     `Market square` 28 (town only) · `Annual fair` 27. INTEREST: the stall pays the tax and
     hears the complaint; where the tax is `Weekly market`'s own `Tax collection` service the
     seller is the first person the shortfall is passed to.
     ⚠ `market` as a HOLDER resolves on 28, so the stallholders speak and cite no book.

  5. **A DRINKING HOUSE** — `Travelers' inn` 50 · `Ale house` 35 · `Alehouse` 31 · `Inn
     (multiple)` 25 · `Taverns (5-20)` 25 · `Wayside inn` 22 · `Inns and taverns (district)` 19
     · `Coaching inn` 16; **95 of 99**. Four short of universal (2 villages, 2 hamlets), so the
     selector may treat it as near-universal and the refuter should not fail it as invented —
     but name the row's own kind where a variant can, and never assume a "tavern" below town.
     INTEREST: who turns out, who is owed, and who was heard saying so. `Moderate` safety on 63.

--- CONDITIONAL SPEAKERS (with the field that seats each, and how often it does) ---

  ⭐⭐ **THE TOWN LINE IS THE CONDITION ON ALMOST EVERYTHING.** Read every row below as
  "town-and-above 44" or "below-town 55" before reading its number.

  ⭐ **THE HALL** — a hall as a BUILDING on **44 of 99**, and it is EXACTLY the town-and-above
    set: `Town hall` 25 (required at town) · `City hall` 19 · `Mayor and council` 21 ·
    `Town council` 2. **On the 55 villages and hamlets there is no hall, no chamber and no
    council room** [F1-20], and there the governing row is a PERSON. INTEREST: the purse
    (`defenseGenerator.js:177-192`) and its own standing; on this desk the hall is the body that
    must explain a line the page already prints — *Upkeep underfunded: crisis logistics at
    67-99%* — on every single town where the hall exists. That is the card's sharpest pairing:
    **the hall is seated on the 44 towns and the underfunded line prints on those same 44.**

  ⭐ **THE LORD'S MAN** — `Village reeve` 30 + `Lord's steward` 22 = **52 of 99**, and all 52
    below town. The best-seated single source on the card after the universal four, and the
    below-town counterpart to the hall. INTEREST: ⭐ **HE IS NOT THE TOWN'S OFFICER.** His stake
    is what LEAVES — the dues, the render, the lord's share — where every other mouth on this
    pool is measuring what comes in against what it must cover. On a desk whose subject is a
    limit, a source whose interest runs the other way is worth more than a fourth agreement.
    F3-06 is nearly silent on him: `Reeve` is rolled as an ordinary NPC on 8 towns and is
    mandated by no tier and no stress here. ADDENDUM 18's archaism licence fits him exactly —
    "the reeve" is welcome in a sentence that shows the reeve collecting.

  **THE GUILDS** — a guild row on **44 of 99**, the same town-and-above set: `Craft guilds
    (5-15)` 25 (required at town) · `Bowyers & fletchers (guild)` 24 · `Merchant guilds (3-8)`
    22 · `Carriers' guild` 22 · `Tailor's guild` 21 · `Cobbler's guild` 18 · `Cartographer's
    guild` 18 · `Thieves' guild chapter` 16 · `Multiple adventurers' guilds` 19. INTEREST: the
    quality certification and the apprenticeship the catalogue says they run (2b), and what a
    civic shortfall costs a trade that is asked to make it up. ⛔ **`Guild Master` is MINTED on
    67 of 99** — the plural is the source, the singular is a person on the next tab [F3-06].
    ⚠ `hasGuild` fires on `Thieves' guild chapter` too [F1-16]: the roster prints which.

  **THE FAITH** — a church standing HERE on **90 of 99**; `Access to parish church`, the 2-5 km
    walk, on the 9 hamlets only. `Parish church` + `Priest (resident)` on all 46 villages;
    `Parish churches (2-5)` 25; `Parish churches (10-30)` 19; `Cathedral (10,000+ only)` 7;
    `Great cathedral` 4; `Multiple monasteries` 8. INTEREST: the rites and the ground, and what
    a place that can pay for most things still will not put a price on. ⛔ `High Priest` is
    minted on 48, `Parish Priest` on 19, `High Priestess` on 13 [F3-06]. A face writes "a local
    priest", "the register", "those who keep the ground" — never "the priest".

  **THE WATCH** — `Town watch` 25 (required at town, part-time by its own row, F1-27) +
    `Professional city watch` 19 (required at city, and it sits in the GARRISON bucket too,
    F1-29) = **44 of 99, the town-and-above set again.** INTEREST: `economicGates.military`,
    which is below ×1.0 on every one of those 44 [F4-19 — the gate IS the watch's pay]. ⛔ on
    the 55 below-town towns **a watch as a body is floor 1** [F1-01, V-23].

  **THE MUSTER** — `Citizen militia` on **25 of 99**, and never on a town that has a `Town
    watch` [F1-26]. ⛔⛔ **IT IS NOT PAID**: "Part-time soldiers with their own tools and no pay"
    (`institutionVocabulary.js:153`), so **no wage, no arrears, no "already owed" may be
    predicated of the militia** [V-09] — and the `muster` holder kind resolves on 0 of 99, so
    no roll, no list, no count [F1-03, F1-24]. INTEREST: it turns out for nothing and knows it.

  **THE GARRISON** — `Garrison` 19 (required at city) + `Barracks` 15 (§R-3: a Barracks licenses
    "the garrison") + `Multiple garrisons` 7; `inst.hasGarrison` 34. ⛔ at CITY tier a face may
    not say the town has no soldiers of its own [F1-28].
  **WHOEVER HOLDS THE WAY THROUGH** — `hasGates` 62/99, fired off the palisade rows as well as
    the city walls. ⚠ F1-08 binds BOTH directions; `toll-bar` resolves on 17, so the gate speaks
    and cites no toll book on the other 82.
  **THE WALLS' KEEPERS** 62 · **THE CHARTER HALL** 53 (`Adventurers' charter hall` 34,
    `Multiple adventurers' guilds` 19) · **A MERCENARY COMPANY** 41 by flag, 13 by bucket
    (`Mercenary quarter`) — ⚠ §1.4 W-01, the flag and the bucket disagree; charge neither way ·
    **A COURT** 44 by flag but a courthouse BUILDING on 37 [F1-12: the flag fires on a hall] ·
    **A GAOL** 33 [F1-13] · **A HOSPITAL or infirmary** 15 by row, 41 by flag [F1-14: the flag
    fires on a healer, a person] · **A GRANARY building** 44, the town-and-above set [F1-09] ·
    **A WAREHOUSE** 39 [F1-19] · **A SMITH** 71 · **A MILL the town owns** 71 (the manor's, on
    31) [F1-15] · **A PORT** 6 [F1-18] · **A NAVY 0**.

  ⛔ **NOT SPEAKERS ANYWHERE HERE:** the ELDERS (`Informal elder consensus` 2 of 99, the
    `elders` kind 0 of 99 — F1-22's exception does not reach this preimage, which has no thorp
    and almost no consensus row) · the crown's assessor (no typed producer, the brief) · and
    every record in the engine's table, by the measurement above.

--- ⭐ THE `compromised` TAG IS LIVE ON THIS POOL, AND IT IS SMALL AND CLEAN ---

  Section (2c) marks `Economic Survival: ADEQUATE` for the HALL under `criminalCaptureState`
  `corrupted`/`capture`. **Measured over the 99: none 71 · equilibrium 18 · corrupted 7 ·
  capture 0** — and **all 7 corrupted towns are town-and-above (town 3 · city 2 · metropolis 2)
  and all 7 carry a hall building.** So unlike the WEAK desk, where the row was a dead letter,
  here the tag has real towns under it: one town in fourteen of the whole preimage, one in six
  of the hall-carrying half. The writers should offer `[hall · compromised]` candidates, in MORE
  THAN ONE SHAPE (dismiss · reassure · minimise · change the subject · blame the talk), each
  concealing only about THE PURSE AND THE ACCOUNTS and denying nothing else (2c's inverted
  test), and one HONEST reassurance untagged, since the field genuinely holds on 92 towns.
  ⚠ `equilibrium` on 18 is NOT a compromising field [F4-15: three thresholds, three facts], and
  `PowerTab.jsx:163-169` prints "Criminal: Tolerated" for it on the same dossier.

--- THE NAMED OFFICES A SPEAKER MUST NEVER BE (`npcGenerator.js:1511-1537`, F3-06) ---

  by tier: village (46) **Mayor · Guard Captain** · town (25) **Mayor · Guard Captain · High
  Priest** · city (11) + **Wealthiest Merchant** · metropolis (8) **Governor · City Watch Chief
  · High Priest · Guild Archmage · Wealthiest Merchant** · hamlet (9) **Elder · Parish Priest**.
  MEASURED over the 99 NPC rosters: **Mayor 83 · Guard Captain 74 · Guild Master 67 · High
  Priest 48 · Wealthiest Merchant 20 · Parish Priest 19 · Healer 17 · Elder 16 · High Priestess
  13 · Lord Mayor 11 · Governor 10 · Moneylender 9 · Reeve 8 · City Watch Chief 8 · Guild
  Archmage 8 · Council Member 8 · Chief Magistrate, Tax Collector, Grain Factor besides.**
  By the stresses that occur here: indebted → **Moneylender** (9) · famine → Healer, Guild Master
  · plague_onset → Healer, Parish Priest · politically_fractured → Council Member ×2 ·
  under_siege → Garrison Commander, Guard Captain · wartime → Garrison Commander, Guild Master ·
  succession_void → Council Member, Chief Magistrate · recently_betrayed → Chief Magistrate ·
  insurgency → Chief Magistrate, Corrupt Official · mass_migration → Guild Master, Healer.

  ⛔⛔ **THE TRAP THIS POOL WALKS INTO IS THE MAYOR AND THE GUILD MASTER.** The brief's own safe
  town-and-above sources are "the hall" and "the guilds", and their SINGULARS are minted on 83
  and 67 of 99 — the two most-minted offices on the card. "The mayor says the purse is thin" and
  "the guild master says the bar costs them" both read, to every reader, as statements about a
  generated person with a personality and a secret on the next tab. **The plural and the room
  stay free; the singular with a doing does not.** Write "a clerk in the hall", "at the hall they
  say", "the guilds were asked and say", "those who set out a stall" — never "the mayor", "the
  guild master", "the guard captain", "the high priest", "the elder", "the moneylender".
  ⚠ AND NOTE THE SEAM: **every village mints a Mayor and a Guard Captain while no village on
  this preimage has a hall or a watch row.** There is a person whose office is this town's
  defence, on the next tab; below town there is frequently no body under him. Write the limit as
  the body's funding and the body's reach — never as "there is nobody in charge".

--------------------------------------------------------------------------------

(8) WHAT WOULD BE FALSE

The single fact that governs this whole desk is that **the pool's own machine row is uniform and
says two things at once**: `threatAssessment.js:169` prints "Adequate economic resilience for a
short-term crisis. A prolonged siege will begin straining reserves within months." and
`defenseDisplay.js:221` prints "Adequate upkeep, some shortfalls." on **all 99** towns of the
preimage (measured: `econScore >= 65` on 0, `>= 25` on 99 — this band straddles no machine
threshold, which is the exact opposite of the WEAK desk's condition), so **both extremes are
floor 1 everywhere and not on half the towns**: a face that says nothing here is short, that the
purse covers what it is asked for, that no one has a complaint of the money, contradicts *some
shortfalls*; and a face that says there is nothing to spend, that the town cannot pay for
anything, that the purse is empty or the reserves are gone, contradicts *adequate economic
resilience* [F1-107, and V.0 floor 1's same-page quantifier]. What survives on all 99 is the
shortfall that is not a failure — a provision that works, works with gaps, and has an edge
nobody has walked up to — and the writers must be given that in one line or they will write one
of the two banned poles. The second great fact is that **this preimage is cut in half by the
town line and almost nothing crosses it**: 55 villages and hamlets against 44 towns, cities and
metropolises, and a hall as a building, a guild row, a granary building and a watch row all
stand on exactly the same 44 and on not one of the 55 (measured, four separate counts). So a hall,
chamber or council room as a PLACE is false on 55 of 99 [F1-20]; a granary building is false on
55 [F1-09]; a guild is false on 55 [F1-16]; **and a watch as a body below town is false on 55**
[F1-01, V-23] while on the other 44 a `Town watch` or `Professional city watch` is a REQUIRED row
and its denial is equally false [F1-25, F1-28 at city]. The mirror of that is the sitting's own
named failure mode, and here it is a tier fact: `safetyProfile.js:380` prints "There is no formal
enforcement body. Order is maintained through community social pressure, the authority of
established families, and the implicit threat of collective action" on **25 of 99 — 22 villages
and 3 hamlets, and no town-and-above town at all** — so "nobody is set up to respond", "nothing
here is arranged for it", "there is no one whose business it is" are FLOOR 1 BY INFERENCE on a
quarter of the desk [V.0 floor 1, F1-25, F1-30 — write AROUND an absence, never assert it], while
`safetyDesc` prints locals, militia volunteers, the garrison or the watch over the main paths on
61 of the 99. The third is the purse, and it is the row a writer reaching for the obvious will
break: **`economicGates.economic` is below ×1.0 on 48 towns and those 48 are all 44 town-and-above
towns plus 4 below**, so `defenseDisplay.js:320`'s `Upkeep underfunded: crisis logistics at
67-99%` prints on the whole hall-carrying half and on almost no village — a shortfall face
written as a civic-budget fact is true where the hall is and is an invention where the reeve is.
On that purse the standing bars hold absolutely: **F4-02 keeps wall-keeping and wages in ONE
purse** (`defenseGenerator.js:182`, `:189-192`) so the walls maintained while the watch goes short
is false; **F4-03 keeps the four gates differing in degree and never in direction** (measured
here: economic 48 below 1, monster 48, disaster 48, internal 44 of 44, military 48 of 80 present);
**F4-04 forbids the collapse pole absolutely** — short, late, thin are licensed, "nothing has been
paid", "there is nobody left to pay" are not, because every gate has a floor and `communityMilBase`
is exempt (`:186-192`); **F4-19 keeps the military gate reaching the watch**; and **V-09 forbids
any wage, pay or arrears predicated of the `Citizen militia`** ("Part-time soldiers with their own
tools and no pay", `institutionVocabulary.js:153`) on the 25 towns that carry one, where the
militia and a `Town watch` never co-occur [F1-26, measured overlap 0]. On the rosters the closed
lists bite in BOTH directions on this desk, because half the preimage has the body and half does
not: a watch [F1-01, V-23], a garrison [F1-02, and F1-28 forbids denying one at city], "the guard"
where `hasMilitaryInst` is false on 25 [F1-04], a militia or a muster ROLL [F1-03], a mercenary
company on 41 by flag and 13 by bucket [F1-05, and §1.4 W-01 — charge neither way], a charter hall
on 53 [F1-06], walls on 62 and their denial equally barred on the other 37 [F1-07, F1-25], a gate
and the denial of one both [F1-08, `hasGates` 62], a market — **which does NOT bite here, since
`inst.hasMarket` is true on 99 of 99** [F1-10, and the class admits a `Fish market` and an `Annual
fair`, so name the row's kind] — a church standing HERE, which bites on only the 9 hamlets whose
row is `Access to parish church`, a 2-5 km walk [F1-11], a criminal TRIAL, sentence, gallows or
courthouse BUILDING where `hasCourtSystem` fires off a `Town hall` on 44 and a courthouse row
stands on 37 [F1-12, §R-4 — the WORD is free], a gaol on 33 [F1-13], a hospital or infirmary
BUILDING where the flag fires on a healer, a person, on 41 while a building stands on 15 [F1-14],
a grain mill the town owns where 31 hold only the manor's [F1-15], a guild [F1-16], wards or
counterspells on 24 [F1-17], **the sea on a preimage whose `hasPort` fires on six towns while
`route: port` is configured on nineteen** [F1-18], a warehouse on 39 [F1-19], and a wall MATERIAL,
which V-06 keeps barred at the POOL grain because this key pools 24 timber towns against 34
masonry ones [F1-32] with the material SOURCE barred besides [F1-33]. The record rule is absolute:
`holdersOf` over all twelve kinds returns treasury 42 · court 37 · market 28 · parish 17 ·
toll-bar 17 · watch 8 · road 6 · **muster, census, elders, tradition and office 0** — **no kind
reaches half the preimage and the muster resolves to nobody on all 99** — so a face may name NO
record whatever [F1-24, §R-8, V-01], attribution runs to people and never to books, and the record
WORDS remain free where they cite nothing (W24 struck). On floor 2 this pool is a magnet for every
barred form, because its subject is a quantity and its tense wants to be the future: **no
magnitude in a digit or a word** — "a few months", "a season's worth", "two-thirds of what it
needs", "a handful of shortfalls" are magnitudes, and so is the machine's own *within months*,
which the machine may print and a face may not restate [F2-01, V-26]; no date, season or period
[F2-02]; no founding or raising narrated [F2-03, V-05]; **no event the record did not run** — a
crisis that came, a reserve that was opened, a wage that went unpaid, a levy that was called
[F2-04]; no elapsed course over a LIVE field — "no longer", "thinner than it was", "again"
[F2-05]; **no rate** — "most years", "every spring", "more often than not" [F2-06]; no trend —
"worse than last season", "it has grown" [F2-08]; and nothing alluding to a past this key cannot
read [F2-09]. ⭐ Against all that the licence is large and it is this desk's best asset:
`scores.economic` is the key's OWN read and carries **zero pulse writers**, and so do every
`economicGates` leaf, `hasGranary`, `hasHospital`, `hasChurch`, `hasCourtSystem`, `hasPrison`,
`hasPort`, `hasNavy`, `tradeRouteAccess`, `config.monsterThreat`, `stress`, `safetyLabel`,
`guardEffectivenessDesc`, `structureKey`, `economicViability.viable`, `foodSecurity.resilienceScore`,
the `stockpile` fields, `standingDefenseForces`, `magicWorksAt`, `tier`, `readiness.score` and every
`defenseProfile.institutions.*` flag — **the perfect and the durative are lawful over all of these**
(ruling 11b): "the edge of what the town can pay for has never been found", "nobody has had to ask
the hall for more than it keeps ready", "the store has not been opened for anything but the
ordinary" are licensed sentences on this desk, and they are the exact shape the pool wants. They
are NOT lawful over `institutions` at any bucket grain (38 writers), over `name` (201), or over
`defenseProfile` / `scores` / `scores.disaster` (1 each) — the instrument's ⚠ SEAM says why: the
flags are frozen while the live roster can lose a row to a ruin, so write the durative over the
STATE and never over the BODY. On floor 3 the office list is long and this pool's own entry heads
it — **Mayor minted on 83 of 99 and Guild Master on 67**, with Guard Captain on 74, High Priest on
48, Wealthiest Merchant on 20, Parish Priest on 19, Elder on 16, Governor on 10 and Moneylender on
the 9 `indebted` towns — so the singular of any of them with a doing is [F3-06]; the culture bar
stands at eleven profiles, all present here in near-equal numbers, so no thatch, no churchyard, no
market green, no snow on the road [F3-05]; nothing may be predicated of a deity, the followers act
and the god does not [F3-02, ADDENDUM 15]; the tier word may not be spelled [F1-31, V-03]; and the
approach may not be named against `tradeRouteAccess`, which runs crossroads 24 · port 19 · isolated
14 · mountain_pass 14 · river 11 · none 9 · road 8 [F1-102, V-08]. On floor 4, besides the purse
rows: no decay clock and no permanence over fabric, and the purse's own distress closure reaches
`Palisade or earthworks` and `Town walls` (`institutionLifecycle.js:1016`), which is 39 of this
preimage's wall rows [F4-01, V.0 floor 4]; `plagued` is MONSTERS and 25 of these towns carry it
while `plague_onset` is the separate disease stress on 6 [F4-05]; the readiness badge is a
different clock from this key and neither refutes the other [R-2, F4-06]; a blockade DOES close
the sea supply [F4-09, V-24]; and a covert fact never reaches a player face [F4-13] — which on
this pool is LIVE and not a dead letter: `criminalCaptureState` reads `corrupted` on **7 towns,
all of them town-and-above and all carrying a hall**, so the `[hall · compromised]` candidates
(2c's inverted test) are owed, in more than one shape, concealing only about the purse and the
accounts, while `equilibrium` on 18 is a different fact the Power tab prints as "Criminal:
Tolerated" [F4-15]. Last, the shipped rows themselves, since the writers will have read them and
this pool's three spines are UNCHANGED from the shipped corpus: "within a few months" and "a few
months past the beginning of one" are magnitudes and durations [F2-01, F2-02]; "every season of
pressure" is a rate [F2-06]; "moves the finite part closer" is a trend [F2-08]; and `{settlement}`
stands in two of the three, where ruling 12 allows it in at most one unit of the pool and never in
a face.

--------------------------------------------------------------------------------

(9) WHERE THE FLAVOUR IS

  WHAT IS IN USE. Everything that ought to be, and one notch below what it was built for. This
  is the only defense desk whose preimage has a universal roster: a burial place on every one of
  the ninety-nine towns, a market or a fair on every one, water on every one, a drinking house on
  ninety-five, a church standing in the place itself on ninety. Half the towns have a hall, a
  granary, a guild and a watch; the other half have a reeve or a steward and a field. Forty-five
  of the ninety-nine are Comfortable or Prosperous on their own Economics tab and only twenty-five
  are Poor or Struggling — **this is not a poor place, and that is the point**. The flavour is in
  the ordinary object that is provided but not spare: the granary's own doors on the forty-four
  towns that have them, the stall that pays its share at the weekly market, the wall that is
  kept and the stair to its walk, the reeve's tally on the fifty-two towns where the reeve is
  the government. A writer wanting texture should reach for a thing in regular use with a
  shortfall behind it, not for a thing missing.

  WHAT IS IN DISPUTE. What the edge is, and who would find it. The page itself says the town can
  carry a short crisis and that a long one begins straining reserves, and on every town with a
  hall it also prints that the upkeep is funded somewhere between two-thirds and all-but-entirely
  — so the quarrel is not whether there is money but what it stops short of, and nobody in the
  town has been asked to settle it. That puts the hall against the guilds on the forty-four
  (the hall defending a purse whose shortfall is printed on the same page; the guilds counting
  what a civic gap costs a trade), the reeve against everyone on the fifty-two (his interest is
  what LEAVES — the dues, the render, the lord's share — where every other mouth is measuring
  what comes in), whoever keeps the ground against both (the one duty performed whatever the
  purse says), and the stranger, who can see in an afternoon the gap the town has stopped
  noticing. And on seven towns the hall is captured and its account of the accounts is a
  concealment — one town in fourteen, so a reassurance on this page is a question and never an
  answer.

  WHAT THE ABSENCE LOOKS LIKE ON THE GROUND. Not want — LIMIT. Nothing here is missing that a
  town of this size should have; what is missing is the margin, and the margin has never been
  tested, because `economicViability.viable` is false on only twenty and the record has run no
  crisis on any of them. The hook is the untested edge: a store that has never been opened for
  anything but the ordinary, a wall kept up by a purse that the page says is short, a watch
  whose pay comes out of a gate below one, and no one in the place who could say where the line
  actually falls — because on this desk the machine's own words are *adequate* and *some
  shortfalls* in the same breath, and neither of those has a number behind it.

================================================================================
END OF THE MARKER'S SECTIONS. The instruments were run READ-ONLY in the dock
(`node scripts/prose-mark-card.mjs DS-DEF-2 'Economic Survival: ADEQUATE'`, pasted verbatim
above as sections 1-6); the marker's measurement was an inline `node --input-type=module -e`
over `rateGrid()`, `generateSettlementPipeline`, `standingDefenseForces` and `holdersOf`,
wrote no file, and touched no dock state. This packet file is the only file written.
================================================================================
