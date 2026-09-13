THE CARD (mechanical sections) — block DS-DEF-2 · pool `Economic Survival: WEAK` · dir ds-def-2-economic-survival-weak

(1) THE KEY AND ITS PREIMAGE
  key function: ECONOMIC_ROW_POOL (rung table) · site defense.threatAssessment
  census predicate: scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js) === WEAK
  read economicScore  -> defenseProfile.scores.economic           [SNAPSHOT] writers 0   (resolved through economicRowPoolKey's call site in the entry point)
  the key FIXES: economicScore:range=[20,39] · leaves OPEN: economicScore   (economicRowPoolKey, 20 combination(s))
  preimage on the 768-town rate grid: 259 towns (3372 bp) — thorp 106/128 · hamlet 95/128 · village 55/128 · town 1/128 · city 2/128
  silent tiers: metropolis

(2) THE REQUIRED ROWS (institutionalCatalog required: true) at every preimage tier — bodies a face may not deny or infer away
  thorp (5): Burial ground [Religious] · Dwellings (4-16) [Infrastructure] · Water source [Infrastructure] · Access to external mill [Economy] · Subsistence farming [Economy]
  hamlet (7): Access to parish church [Religious] · Burial ground [Religious] · Dwellings (17-80) [Infrastructure] · Water source [Infrastructure] · Access to external mill [Economy] · Subsistence farming [Economy] · Common grazing land [Economy]
  village (7): Multiple water sources [Infrastructure] · Dwellings (80-180) [Infrastructure] · Farmland [Economy] · Mill [Crafts] · Parish church [Religious] · Priest (resident) [Religious] · Graveyard [Religious]
  town (13): Town granary [Economy] · Market square [Economy] · Weekly market [Economy] · Craft guilds (5-15) [Economy] · Inn (multiple) [Economy] · Taverns (5-20) [Economy] · Mills (2-5) [Crafts] · Parish churches (2-5) [Religious] · Parish burial grounds [Religious] · Town watch [Defense] · Town hall [Infrastructure] · Housing (180-1000 structures) [Infrastructure] · Multiple water sources [Infrastructure]
  city (14): City granaries [Economy] · Multiple market squares [Economy] · Daily markets [Economy] · Inns and taverns (district) [Economy] · Warehouse district [Economy] · Parish churches (10-30) [Religious] · Burial grounds and charnel house [Religious] · City walls and gates [Defense] · Professional city watch [Defense] · Garrison [Defense] · City hall [Infrastructure] · Multiple courthouses [Infrastructure] · Housing (1000-5000 structures) [Infrastructure] · Aqueduct or water system [Infrastructure]

(2b) WHAT A FACE MAY NOT DENY OF THE REQUIRED ROWS — the services the engine's own menu turns on at p ≥ 0.8, and the derivation that files the row
  Access to external mill (required at thorp, hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Access to parish church (required at hamlet) — a face may not deny: Sunday mass (p 1) · Baptism (p 0.9) · Last rites (p 0.9) · Marriage ceremony (p 0.9) · filed under the `church` roster
  Aqueduct or water system (required at city) — a face may not deny: Clean water distribution (p 1) · filed under no closed roster
  Burial ground (required at thorp, hamlet) — a face may not deny: Burial (p 1) · filed under no closed roster
  Burial grounds and charnel house (required at city) — a face may not deny: Burial (p 1) · filed under no closed roster
  City granaries (required at city) — a face may not deny: Grain storage (p 1) · filed under the `granary` roster
  City hall (required at city) — a face may not deny: Civic licensing (p 1) · Appeals court (p 0.8) · filed under the `hall` roster · filed under the `court` roster
  City walls and gates (required at city) — a face may not deny: Gate control (p 1) · filed under fortifications (deriveArmedForces) · filed under the `gates` roster
  Common grazing land (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Craft guilds (5-15) (required at town) — a face may not deny: Quality certification (p 1) · Apprenticeship programs (p 0.8) · filed under no closed roster
  Daily markets (required at city) — a face may not deny: Fresh produce (p 1) · General trade (p 0.9) · Street food (p 0.8) · filed under the `market` roster
  Dwellings (17-80) (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
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
  Subsistence farming (required at thorp, hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Taverns (5-20) (required at town) — a face may not deny: Drink service (p 1) · Meals (p 0.8) · filed under no closed roster
  Town granary (required at town) — a face may not deny: Grain storage (p 1) · filed under the `granary` roster
  Town hall (required at town) — a face may not deny: Permit applications (p 1) · Tax payment (p 0.9) · Dispute arbitration (p 0.8) · filed under the `hall` roster · filed under the `court` roster
  Town watch (required at town) — a face may not deny: Night patrol (p 1) · Gate duty (p 0.8) · filed under standing (deriveArmedForces)
  Warehouse district (required at city) — a face may not deny: Goods storage (p 1) · filed under no closed roster
  Water source (required at thorp, hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Weekly market (required at town) — a face may not deny: General trade (p 1) · Tax collection (p 0.9) · filed under the `market` roster
  ⛔ A SERVICE AT OR ABOVE THE BAR IS A THING THE TOWN'S OWN MODEL SAYS THIS BODY DOES: denying it is floor 1, whatever the face is otherwise about. A row filed under `standing` is UNDER ARMS in the engine's reading even where the key fixes no garrison and no militia.

(2b′) THE OBSERVER'S AND THE PUBLIC'S LIST: what neither may claim to have seen
  Access to external mill (required at thorp, hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Access to parish church (required at hamlet) — NOT SEEN is a claim about: Sunday mass · Baptism · Last rites · Marriage ceremony
  Aqueduct or water system (required at city) — NOT SEEN is a claim about: Clean water distribution
  Burial ground (required at thorp, hamlet) — NOT SEEN is a claim about: Burial
  Burial grounds and charnel house (required at city) — NOT SEEN is a claim about: Burial
  City granaries (required at city) — NOT SEEN is a claim about: Grain storage
  City hall (required at city) — NOT SEEN is a claim about: Civic licensing · Appeals court
  City walls and gates (required at city) — NOT SEEN is a claim about: Gate control
  Common grazing land (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Craft guilds (5-15) (required at town) — NOT SEEN is a claim about: Quality certification · Apprenticeship programs
  Daily markets (required at city) — NOT SEEN is a claim about: Fresh produce · General trade · Street food
  Dwellings (17-80) (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
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
  Subsistence farming (required at thorp, hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Taverns (5-20) (required at town) — NOT SEEN is a claim about: Drink service · Meals
  Town granary (required at town) — NOT SEEN is a claim about: Grain storage
  Town hall (required at town) — NOT SEEN is a claim about: Permit applications · Tax payment · Dispute arbitration
  Town watch (required at town) — NOT SEEN is a claim about: Night patrol · Gate duty
  Warehouse district (required at city) — NOT SEEN is a claim about: Goods storage
  Water source (required at thorp, hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
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
    Burial ground: "at the edge" — stated only at hamlet — silent at thorp, village, town, city   [the catalog row]
        the data says: "A walled plot at the edge of the settlement, gated against livestock and kept by the households in turn."
    Burial grounds and charnel house: "inside the walls" — stated only at city — silent at thorp, hamlet, village, town   [the catalog row]
        the data says: "The parish grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next."
    Burial grounds and charnel house: "outside the gates" — stated only at city — silent at thorp, hamlet, village, town   [the catalog row · the `Burial` service]
        the data says: "New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening."
    Market square: "in the square" — stated only at town — silent at thorp, hamlet, village, city   [the `Civic announcements` service]
        the data says: "Official proclamations, wanted notices, and public notices read in the square."
    Parish burial grounds: "beyond the gate" — stated only at town — silent at thorp, hamlet, village, city   [the catalog row]
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
  watch      OPEN — required only at town, city; open at thorp, hamlet, village   [town: Town watch ; city: Professional city watch]
  garrison   OPEN — required only at city; open at thorp, hamlet, village, town   [city: Professional city watch, Garrison]
  militia    OPEN — the key does not fix it and no required row seats it
  mercenary  OPEN — the key does not fix it and no required row seats it
  charter    OPEN — the key does not fix it and no required row seats it
  walls      OPEN — required only at city; open at thorp, hamlet, village, town   [city: City walls and gates]
  gates      OPEN — required only at city; open at thorp, hamlet, village, town   [city: City walls and gates]
  granary    OPEN — required only at town, city; open at thorp, hamlet, village   [town: Town granary ; city: City granaries]
  hospital   OPEN — the key does not fix it and no required row seats it
  market     OPEN — required only at town, city; open at thorp, hamlet, village   [town: Market square, Weekly market ; city: Multiple market squares, Daily markets]
  hall       OPEN — required only at town, city; open at thorp, hamlet, village   [town: Town hall ; city: City hall]
  court      OPEN — required only at town, city; open at thorp, hamlet, village   [town: Town hall ; city: City hall, Multiple courthouses]
  prison     OPEN — the key does not fix it and no required row seats it
  church     OPEN — required only at hamlet, village, town, city; open at thorp   [hamlet: Access to parish church ; village: Parish church, Priest (resident) ; town: Parish churches (2-5) ; city: Parish churches (10-30)]
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
  thorp: the hall: — · the tavern: — · the guilds: — · the register (parish): Burial ground · the elders: —
  hamlet: the hall: — · the tavern: — · the guilds: — · the register (parish): Access to parish church, Burial ground · the elders: —
  village: the hall: — · the tavern: — · the guilds: — · the register (parish): Parish church, Priest (resident), Graveyard · the elders: —
  town: the hall: Town hall · the tavern: Taverns (5-20) · the guilds: Craft guilds (5-15) · the register (parish): Parish churches (2-5), Parish burial grounds · the elders: —
  city: the hall: City hall · the tavern: Inns and taverns (district) · the guilds: — · the register (parish): Parish churches (10-30), Burial grounds and charnel house · the elders: —
  the key on the force buckets and the gates: watch: OPEN · garrison: OPEN · militia: OPEN · mercenary: OPEN · charter: OPEN · gates: OPEN

================================================================================
THE MARKER'S SECTIONS BEGIN HERE. Everything above is `node scripts/prose-mark-card.mjs
DS-DEF-2 'Economic Survival: WEAK'` run read-only in the dock, verbatim, unedited.
================================================================================

(7) THE SPEAKERS

⛔ READ THIS FIRST — THREE THINGS THE INSTRUMENT'S OWN LINES ESTABLISH, AND TWO IT CANNOT.

  A. **THE PREIMAGE IS SMALL TIERS, ALMOST ENTIRELY.** thorp 106/128 · hamlet 95/128 ·
     village 55/128 · **town 1/128 · city 2/128**; silent at metropolis. This is the mirror
     image of the STRONG desk. The brief's town-and-above roster — the hall, the tavern, the
     guilds, the register — **is not seated here**; the ELDERS are, and almost nothing else is.
  B. **THE KEY FIXES EXACTLY ONE FIELD** — `defenseProfile.scores.economic` in [20,39] — and
     section (2d) confirms it enumerates no sibling rung. Everything else on the page is OPEN.
  C. **THAT ONE FIELD IS FROZEN** (writers 0). It is the key's own read AND a zero-writer read,
     so ruling 11 licenses the perfect and the durative over it twice over.
  D. What the instrument cannot print, and the marker measured: **the band is cut in half by a
     machine threshold the key does not fix** (`econScore >= 25`), so two mutually opposite
     machine sentences fire across one pool and a face may deny neither.
  E. And: **not one roster row by name stands on all 260 towns of this preimage.** Not one.

--- ⭐ THE MARKER'S MEASUREMENT (executed, read-only, in the dock) ---

  Method: `rateGrid()` from `scripts/prose-rate-corpus.mjs` (768 rows), each generated through
  `generateSettlementPipeline(config, null, {seed, customContent: {}})`, then filtered to
  `defenseProfile.scores.economic` in [20,39]. **N = 260** (thorp 106 · hamlet 96 · village 55 ·
  town 1 · city 2), against the instrument's 259 — a one-row tier-resolution gap, not a
  different population. Nothing was written; every figure below is a count over those 260.
  Measured score: min 20 · median 23 · max 39.

  ⭐⭐ **THE BAND STRADDLES THE ENGINE'S OWN 25-POINT THRESHOLD.** `econScore < 25` on **133**
     of 260 and `>= 25` on **127**. So BOTH arms of `threatAssessment.js:171/:173` fire across
     this single pool — "Chronic underfunding limits emergency response. A sustained crisis
     will exhaust reserves and undermine garrison morale." on 127, and "Economic base cannot
     support crisis response. Any sustained threat quickly overwhelms the capacity to respond."
     on 133 — and so do both arms of `defenseDisplay.js:221`, "Irregular pay, worn equipment,
     morale risk." against "Cannot sustain forces. Systemic breakdown."
     ⛔ **A FACE DRAWS ON ALL 260 AND MAY DENY NEITHER.** "There is still something in hand, it
     simply will not last" is refused by 133 towns; "there is nothing at all to spend" is
     refused by 127. What is licensed across the whole preimage is the SHORTFALL ITSELF and its
     consequence, never a reading of how much is left.

  ⭐⭐ **NO ROSTER ROW BY NAME IS UNIVERSAL.** The intersection over 260 towns is EMPTY. The
     best-held single row is `Subsistence farming` at 221. Universal only by CLASS:
       a burial place 260/260  (`Burial ground` 202 · `Graveyard` 55 · `Parish burial grounds` 1
                                · `Burial grounds and charnel house` 2)
       water          260/260  (`Water source` 202 · `Multiple water sources` 56 · aqueduct 2)
       dwellings      260/260  · food grown or stored 260/260 · a mill of some kind 258/260
       a faith place or resident priest 252/260
     And the brief's named sources, measured: **a drinking house 122/260 · a market of any kind
     73/260 · a hall as a BUILDING 3/260 · a guild row 3/260.** Under half, an eighth, and one
     percent. Every named body on this card is conditional.

  ⭐⭐ **THE GOVERNING BODY IS A CONSENSUS, NOT A ROOM.** `Informal elder consensus` 104 ·
     `Lord's steward` 70 · `Village reeve` 34 · `Head-of-household consensus` 33 · `Lord's
     reeve` 3 · `Village headman` 2 · `City hall` 2 · `Mayor and council` 1 · `Town hall` 1 —
     and **11 towns carry no governing row at all**. The governing NAME reads Elder Council 77 ·
     Feudal Stewardship 70 · Free Elder Council 43 · Elected Reeve 34 · Household Council 33 ·
     Merchant Guild Council 2 · Town Council 1. [F1-20 is live on 257 of 260 towns.]

  ⭐ **THE PURSE.** `economicGates.economic` present 260/260 and **below ×1.0 on 210** (min
     0.67), so the Defense tab prints `Upkeep underfunded: crisis logistics at 67-99%`
     (`defenseDisplay.js:320`, `:282`) **on this pool's own row** on four towns in five; monster
     and disaster likewise 210. `economicGates.military` is present on only **134** (below 1 on
     100, min 0.76) — on the other 126 there is no funded force for it to gate. `internal` is
     present on 3. ⚠ F4-19 still binds: where the military gate exists it IS the watch's pay.

  FLAGS (of 260): hasChurch 252 · hasWalls 103 · hasGates 103 · hasMilitaryInst 71 ·
     hasMilitia 60 · hasCharterHall 35 · hasMercenary 16 · hasMagicInst 15 · hasHospital 9 ·
     **hasWatch 3 · hasGranary 3 · hasCourtSystem 3 · hasGarrison 2 · hasPrison 2** ·
     hasMerchantGuild 2 · hasGangInfra 2 · hasPort 1 · hasThievesGuild 1 · hasSmuggling 1 ·
     **hasNavy 0**.
  BUCKETS (`standingDefenseForces`): walls 103 · militia 60 · charter 34 · magicDef 15 ·
     watch 3 · garrison 2.
  FORCE ROWS BY NAME: `Citizen militia` 60 · `Household levy` 45 · `Adventurers' charter hall`
     32 · `Professional city watch` 2 · `Garrison` 2 · `Town watch` 1. **144 towns carry no
     force row of any kind.**
  WALL ROWS: `Palisade or earthworks` 51 · `Palisade` 50 · `City walls and gates` 2 ·
     `Citadel` 2. ⚠ V-06 keeps the material bar at the POOL grain: the pool is 101 timber towns
     and 2 masonry ones, so no wall material may stand for the pool [F1-32].
  ⚠ **THE `Household levy` IS THE §1.4 W-02 WIRING ROW, ON 45 TOWNS** — a force row on the
     roster (`institutionalCatalog.js:104-110`) that the buckets do not see. No face may be
     charged on those towns in either direction.
  PROSPERITY: Poor 129 · Moderate 57 · **Comfortable 38 · Prosperous 4** · Struggling 32. So
     161 are Poor-or-Struggling — and **"this is a poor place" is contradicted on 42**.
  FOOD: `Import-Dependent` 110 · `Pressured` 58 · `Deficit` 50 · `Secure` 42 [F1-44 — `Secure`
     is not "feeds itself"]. `storageMonths` 1.9 on 202 · 1.3 on 55 · 7 on 2 · 6.3 on 1.
     ⚠ **W-07 IS THIS POOL'S OWN CONDITION**: a granary READING prints with no granary row
     (`foodStockpile.js:190-193`) — about two months of food stored, and a granary BUILDING on
     three towns. `economicViability.viable` is false on 47.
  STRESS: none 204 · monster_pressure 9 · infiltrated 8 · succession_void 8 ·
     politically_fractured 7 · wartime 6 · recently_betrayed 4 · mass_migration 4 ·
     under_siege 3 · religious_conversion 2 · insurgency 2 · occupied 2 · plague_onset 1.
     ⭐ **`famine` and `slave_revolt` never occur on this preimage.**
  THREAT: frontier 97 · heartland 92 · **plagued 71** [F4-05: monsters, never disease].
  ROUTE: road 52 · none 42 · mountain_pass 40 · river 37 · port 37 · crossroads 27 ·
     isolated 25 — ⚠ and `hasPort` fires on ONE town, so `port` here is a river dock or a
     landing [F1-18]. CULTURE: all eleven profiles, 19 to 27 towns each [F3-05].
  CAPTURE: none 257 · equilibrium 2 · adversarial 1 — **`corrupted` 0 and `capture` 0**.

--- ⭐⭐ THE MACHINE SENTENCES THAT ACTUALLY PRINT (measured, not predicted) ---

  `guardEffectivenessDesc` over the 260:
     **189** — "There is no formal enforcement body. Order is maintained through community
               social pressure, the authority of established families, and the implicit threat
               of collective action against those who break the peace. This works until it
               doesn't."  (`safetyProfile.js:380`)
      58 — the citizen militia musters when needed but cannot maintain consistent patrol
       7 — the adventurers' charter hall coordinates emergency response
       2 — garrison and city watch · 2 — a well-organised militia · 2 — a mercenary company
  `safetyDesc` over the 260: **"Locals watch over the main paths" on 142** · "Militia
     volunteers patrol the main paths" on 43 · "There is effectively no law enforcement" on 19 ·
     "There is no meaningful guard presence" on 4 · the rest are the stress arms.

  ⛔⛔ **THIS IS THE SITTING'S NAMED FAILURE MODE AND IT SITS ON 189 OF 260 TOWNS.** "Nobody is
  set up to respond", "nothing here is arranged for it", "there is no one whose business it is",
  "the town has no answer to anything" are **FLOOR 1 BY INFERENCE** on this desk: the machine's
  own sentence on the same tab says order IS maintained — by community pressure, by the
  authority of established families, by the threat of collective action — and on 142 towns says
  the locals DO watch the main paths. The absence this key licenses is of a FUNDED, PAID,
  STANDING body. It is never an absence of arrangement, of people, or of anybody caring.

--- ⭐⭐ THE RECORD MEASUREMENT, AND THE RULING THAT FOLLOWS FROM IT ---

  `holdersOf(kind, settlement)` over all twelve `HOLDER_KINDS` on the 260:

      treasury  23/260      elders  13/260      watch  2/260      court  2/260
      parish     1/260      market   1/260      road   1/260
      **muster 0 · census 0 · toll-bar 0 · tradition 0 · office 0**

  ⛔⛔ **NOT ONE KIND REACHES A TENTH OF THIS PREIMAGE.** The best-held record in the engine's
  whole table stands on nine percent of these towns. A face draws on every town of the preimage,
  so **THE WRITERS MAY CITE NO RECORD BY NAME ON THIS POOL AT ALL** — not the accounts, not the
  toll book, not the parish register, not the record of custom, not the market's book, and above
  all **not a muster roll, which resolves to nobody on all 260** [F1-24, §R-8, V-01, and the
  sitting's own named failure mode]. Attribution here runs to PEOPLE and never to books. The
  record WORDS stay free in a sentence that does not cite one as a source (W24 is struck): a
  reeve may keep a tally, and the households may be asked what they owe.

--- THE SPEAKERS THE BRIEF SEATS ON EVERY TOWN OF THIS PREIMAGE ---

  1. **THE STRANGER** — seated by the brief, needing no row. On this card the ONLY speaker with
     no condition on it at all. INTEREST: arrives at a place that is visibly working and
     visibly short, where there is nobody to complain to and nothing organised to complain
     about, and can say so because nobody here has to.
     ⚠ bounded by (2b′): a stranger reports what could be SEEN, and may not have failed to see
     the service of a row the tier requires.

  2. ⭐ **THE ELDERS** — the brief's below-town source, and this pool's own trap.
     SEATED: `Informal elder consensus` 104 + `Head-of-household consensus` 33 = 137 of 260 as
     a governing row; the governing NAME reads an elder or household council on 153; and the
     engine's own council label at these tiers is **"the household heads"** at thorp and **"the
     village elders"** at hamlet and village (`governanceNarrative.js:101-105`) — which is
     F1-22's own exception, so the word is the engine's here and not the writer's.
     INTEREST: they are the body that decides without a purse, a room, or a record. On a pool
     whose whole subject is a shortfall, the elders are the source that must say WHAT WAS NOT
     DONE and who bore it.
     ⛔⛔ **THE `elders` RECORD RESOLVES ON 13 OF 260** (`Household elder` · `Village elder` ·
     `Village headman`), so the elders SPEAK and never cite a record of custom [F1-24].
     ⛔⛔ **AND "Elder" IS A MINTED NPC ON EVERY THORP AND EVERY HAMLET — 202 OF 260**
     (`npcGenerator.js:1512-1513`). The PLURAL is the source; the singular "the elder" is a
     generated person on the next tab with a personality and a secret [F3-06]. Say "the village
     elders", "the household heads", "those the place listens to" — never "the elder", never
     "the headman" (a roster row on two towns).

  3. **THE TOWN'S OWN PEOPLE** — the public, for what everyone saw at once. The engine's own
     words for them at these tiers are worth having: **"The community"** is the defence group
     label on every small tier (`governanceNarrative.js:499-506`) and **"the able-bodied"** is
     the watch label where no force row stands (`:95-98`). ⚠ the `[public]` tag stays under
     NOTES until car 18n lands.

--- CONDITIONAL SPEAKERS (with the field that seats each, and how often it does) ---

  ⭐ **THE LORD'S MAN** — `Lord's steward` 70 · `Village reeve` 34 · `Lord's reeve` 3 = **107 of
    260**, the second-best-seated source on the whole card and the most under-used.
    INTEREST: ⭐ **HE IS NOT THE TOWN'S OFFICER.** His stake is what LEAVES — the dues, the
    render, the lord's share — where every other mouth on this pool is complaining about what
    does not come in. On a desk whose subject is a shortfall, a source whose interest runs the
    other way is worth more than a fourth voice agreeing. And F3-06 is SILENT on him: no tier
    and no stress on this preimage mandates a Reeve or a Steward NPC (measured: `House Steward`
    appears on 8 villages as an ordinary roll, never as a mandated office).
    ADDENDUM 18's archaism licence fits him exactly: "the reeve" is welcome in a sentence that
    shows the reeve collecting.

  **THE DRINKING HOUSE** — `Alehouse` 84 · `Wayside inn` 60 · `Travelers' inn` 50 · `Ale house`
    47 · the town and city rows 4; **122 of 260 carry one**. The brief's "tavern" is a
    town-and-above source and here it is CONDITIONAL, on under half the preimage. Where a row
    seats it, name the row's own kind — the alehouse, the wayside inn — and never assume it.
    INTEREST: who turns out, and who is owed. Safety label reads `Moderate` on 185.

  **THE FAITH** — 252 of 260 by class. ⚠ but **`Access to parish church` (192 towns) is a WALK
    OF TWO TO FIVE KILOMETRES TO SOMEBODY ELSE'S CHURCH** (`institutionalCatalog.js:50-54`;
    F1-11), so on three towns in four the church IS NOT HERE. `Parish church` + `Priest
    (resident)` stand on the 55 villages; `Wayside shrine` on 28 thorps, with no clergy.
    INTEREST: the rites, the burial ground, and what a place with nothing to spare still puts
    by for its dead. ⛔ `Parish Priest` is MINTED on all 96 hamlets and under plague_onset and
    religious_conversion; `Village Priest` and `High Priestess` are rolled besides. Say "those
    who keep the ground", "whoever says the words over them" — never "the priest".

  **THE MUSTER** — `Citizen militia` 60 (the bucket's only row) and `Household levy` 45 (the
    W-02 wiring row). At most 105 towns, and the `muster` KIND resolves on **0 of 260** — no
    muster roll, no levy roll, no list of any kind, anywhere [F1-03, F1-24].
    ⛔⛔ **AND NEITHER OF THEM IS PAID** — see (8); this is the card's sharpest single row.

  **WHOEVER HOLDS THE WAY THROUGH** — `hasGates` 103/260, fired off the palisade rows. ⚠ F1-08
    binds BOTH directions, and the `toll-bar` kind resolves on **0 of 260**: the gate speaks and
    never cites a toll book.
  **THE WALLS' KEEPERS** — 103/260, timber on 101 of them.
  **THE CHARTER HALL** 34 · **THE SMITH** 103 · **A MARKET of any kind** 73 · **THE MILL** — a
    mill of some kind on 258, but `Access to external mill` (219) is the MANOR'S mill, up the
    road and not the town's [F1-15]; a `Mill` the town owns stands on the 55 villages.
  **A WATCH** 3 · **A GARRISON** 2 · **A GRANARY** 3 · **A COURT** 3 · **A PRISON** 2 ·
    **A HOSPITAL** 9 · **A PORT** 1 · **A NAVY** 0.

  ⛔ **NOT SPEAKERS ANYWHERE HERE:** the HALL, as a body or a room — the governing institution
    at thorp and hamlet is a CONSENSUS and a hall BUILDING stands on 3 of 260 [F1-20] · the
    GUILDS (3 of 260) · the crown's assessor (no typed producer, the brief) · and every record
    in the engine's table, by the measurement above.

--- THE NAMED OFFICES A SPEAKER MUST NEVER BE (`npcGenerator.js:1511-1537`, F3-06) ---

  thorp (106):  **Elder** + a derived second role (`npc/thorpSecondRole.js:13`) — measured:
                Fisherman 49 · Miller 24 · Woodcutter 23 · Shepherd 18 · Widowed Farmer 9 ·
                Blacksmith 6 · Village Priest 4 · Wounded Soldier 4 · Shrine Keeper 3 …
  hamlet (96):  **Elder · Parish Priest** (both on all 96)
  village (55): **Mayor** (55) · **Guard Captain** (42; `worldLaw.allowsRole` filters the rest)
  town (1):     Mayor · Guard Captain · High Priest
  city (2):     Mayor · Guard Captain · High Priest · Wealthiest Merchant
  and by the stresses that actually occur here: monster_pressure → Garrison Commander, Retired
  Adventurer · succession_void → Council Member, Chief Magistrate · politically_fractured →
  Council Member ×2 · wartime → Garrison Commander, Guild Master · recently_betrayed → Chief
  Magistrate · mass_migration → Guild Master, Healer · under_siege → Garrison Commander, Guard
  Captain · insurgency → Chief Magistrate, Corrupt Official · occupied → Corrupt Official ·
  religious_conversion → Parish Priest, Council Member · plague_onset → Healer, Parish Priest.

  ⛔⛔ **THE TRAP THIS POOL WALKS INTO IS THE ELDER AND THE TRADE.** The brief's own safe
  below-town source is "the elders" and its SINGULAR is minted on 202 of 260 towns. And the
  thorp's second mandated NPC is drawn from the town's own trades — a Fisherman on 49, a Miller
  on 24, a Woodcutter on 23, a Shepherd on 18 — which is exactly the pool of concrete,
  particular people a writer reaching for texture on a thorp will reach for first. **The plural
  and the trade stay free; the singular with a doing does not.** "the households that still have
  seed to hold back" · "those who grind for the rest" · "the ones who are owed" — never "the
  miller", "the shepherd", "the elder", "the mayor", "the guard captain", "the parish priest".

--- THE TWO NPC SEAMS THE WRITERS MUST KNOW ABOUT ---

  ⚠ **EVERY VILLAGE MINTS A MAYOR, AND 42 OF 55 MINT A GUARD CAPTAIN**, while the watch bucket
  stands on 3 towns of the whole preimage and the militia bucket on 60. There IS a person whose
  office is this town's defence, on the next tab. There is frequently no body under him. Write
  the shortfall as the body's pay and the body's absence — never as "there is nobody in charge".
  ⚠ **EVERY THORP AND HAMLET MINTS AN ELDER** while the `elders` record resolves on 13. The
  people are seated; the book is not. Nothing here is written down, and that is the licence.

  ⭐ **THE `compromised` TAG IS A DEAD LETTER ON THIS POOL.** Section (2c) marks `Economic
  Survival: WEAK` for the hall under `criminalCaptureState` `corrupted`/`capture`. Measured over
  the 260: none 257 · equilibrium 2 · adversarial 1 — **`corrupted` 0, `capture` 0** — and a
  hall stands as a body on three towns. The (2c) row is right about the pool's NAME and blind to
  its towns: the same key at town-and-above would carry it, and this preimage is 257/260 below
  town. The writers should offer no `[hall · compromised]` candidate here; a refuter asked to
  judge one should ask which town it stands on.

--------------------------------------------------------------------------------

(8) WHAT WOULD BE FALSE

The pool's subject is a shortfall and its single richest trap is that **the bodies which would
be short are, on this preimage, bodies the engine says are not paid at all**: `Citizen militia`
is glossed "Part-time soldiers with their own tools and no pay" (`institutionVocabulary.js:153`)
and `Household levy` musters with hunting bows, spears and farm tools (`institutionalCatalog.js:
104-110`), and those two rows are **105 of the 116 force-carrying towns** measured, with 144
towns carrying no force row at all — so **no wage, no arrears, no "already owed", no "irregular
pay" may be predicated of the force on this pool** [V-09, and the shipped spines walk into it
twice: "the pay is irregular" and "The people who would have to hold {settlement} through
something are already owed"], while F4-19 keeps the military gate's shortfall real wherever a
funded body exists (present on 134 of 260, below ×1.0 on 100) and F4-04 forbids the other
extreme absolutely — short, late, thin are licensed, "nothing has been paid", "there is nobody
left to pay" are not, because every gate has a floor and `communityMilBase` is exempt
(`defenseGenerator.js:186-192`); V-04 allows a thin muster as a STANDING STATE and never as a
course; F4-02 keeps wall-keeping and wages in ONE purse (`:182`, `:189-192`) so the palisade
maintained while the muster goes without is false, and F4-03 keeps the four gates differing in
degree and never in direction. The second great hazard is the one the instrument cannot see:
**the band straddles `econScore >= 25`**, so `threatAssessment.js:171` ("Chronic underfunding …
will exhaust reserves and undermine garrison morale") fires on 127 towns and `:173` ("Economic
base cannot support crisis response") on 133, and `defenseDisplay.js:221` splits the same way —
a face may deny neither, so both "there is still a little in hand" and "there is nothing to
spend" are refused, and what survives is the shortfall itself without a reading of how much
remains. The third is the sitting's own named failure mode and it is quantified here:
**`guardEffectivenessDesc` prints "There is no formal enforcement body. Order is maintained
through community social pressure, the authority of established families, and the implicit
threat of collective action" on 189 of 260**, and `safetyDesc` prints "Locals watch over the
main paths" on 142, so "nobody is set up to respond", "nothing here is arranged for it", "there
is no one whose business it is" are floor 1 BY INFERENCE on three towns in four [V.0 floor 1,
F1-25, F1-30 — write AROUND an absence, never assert it]. On the rosters the closed lists bite
almost entirely as bodies a face may not INVENT, because this preimage has so few: a watch on 3
towns [F1-01, V-23 — any watch as a body below town contradicts `hasWatch` false], a garrison on
2 [F1-02], "the guard" as a body where `hasMilitaryInst` is false on 189 [F1-04], a militia or a
muster ROLL [F1-03], a mercenary company on 16 [F1-05], a charter hall on 34 [F1-06], walls on
103 and their denial equally barred on the other 157 [F1-07, F1-25], a gate and the denial of
one both [F1-08], **a GRANARY BUILDING on 3 towns while about two months of grain is stored on
all of them** — W-07 is this pool's own condition, the reading prints with no row
(`foodStockpile.js:190-193`) so write the store and never the building [F1-09] — a market on 73
[F1-10], a church standing HERE where 192 towns hold only `Access to parish church`, a walk of
two to five kilometres [F1-11], a trial, sentence or courthouse where `hasCourtSystem` is true
on 3 [F1-12], a gaol on 2 [F1-13], a hospital or infirmary on 9 [F1-14], a grain mill the town
owns where 219 hold only the manor's [F1-15], a guild on 3 [F1-16], the sea on a preimage whose
`hasPort` fires once [F1-18], a warehouse [F1-19], and above all **a HALL, chamber or council
room as a PLACE, which is false on 257 of 260 because the governing institution below town is a
consensus and not a room** [F1-20], with THE ELDERS as a body governed by F1-22's own exception
(the engine says "the village elders" and "the household heads" at these tiers, so the words are
its own). The record rule is absolute here and sharper than on any sibling desk: `holdersOf`
over all twelve kinds returns treasury 23 · elders 13 · watch 2 · court 2 · parish 1 · market 1 ·
road 1 · **muster, census, toll-bar, tradition and office 0** — **no kind reaches a tenth of the
preimage**, so a face may name NO record whatever [F1-24, §R-8, V-01], attribution runs to people
and never to books, and the record WORDS remain free where they cite nothing (W24 struck). On
floor 2 this pool is a magnet for every barred form because its subject is quantity and its
tense wants to be the past: no count, share, sum, price or headcount in a digit or a word — "two
months' grain", "a handful of households", "most of what it owes" are magnitudes [F2-01]; no
date, season or arrears period — "since the winter", "three months behind", "a bad season"
[F2-02]; no founding or raising narrated [F2-03, V-05]; no event the record did not run — a
harvest that failed, a levy that was called, a store that was opened, a man who left [F2-04, and
note `famine` and `slave_revolt` occur on NO town of this preimage, so a face turning on either
describes a town this key does not select]; no elapsed course over a live field — "no longer",
"thinner than it was", "again" [F2-05]; no rate — "most winters", "more often than not", "every
spring" [F2-06]; no trend [F2-08]; and nothing alluding to a past this key cannot read [F2-09].
⭐ Against all that, the licence, and it is large: `scores.economic` is the key's OWN read and
carries **zero pulse writers**, and so do `hasGranary`, `hasHospital`, `hasChurch`,
`hasCourtSystem`, `hasPrison`, `hasPort`, `tradeRouteAccess`, `monsterThreat`, `stress`,
`safetyLabel`, `guardEffectivenessDesc`, every `economicGates` leaf, `foodSecurity.
resilienceScore`, the `stockpile` fields and every `defenseProfile.institutions.*` flag — **the
perfect and the durative are lawful over all of these** (ruling 11b): "nobody has been asked to
open the store", "the households have never been called out together", "no one has had to find
the bottom of it" are licensed sentences on this desk. They are NOT lawful over `institutions`
at any bucket grain (38 writers), over `name` (201), or over `defenseProfile` / `scores` /
`scores.disaster` (1 each) — the instrument's ⚠ SEAM says why: the flags are frozen while the
live roster can lose a row to a ruin, so write the durative over the STATE and never over the
BODY. On floor 3 the office list is long and this pool's own entry heads it — **Elder, minted on
202 of 260** — with Parish Priest on 96, Mayor on 55, Guard Captain on 42, and the thorp's
trade-drawn second role (Fisherman, Miller, Woodcutter, Shepherd) on all 106, so the singular of
any of them with a doing is [F3-06]; the culture bar stands at eleven profiles, all of them
present here in near-equal numbers, so no thatch, no churchyard, no market green, no snow on the
road [F3-05]; nothing may be predicated of a deity, the followers act and the god does not
[F3-02, ADDENDUM 15]; the tier word may not be spelled [F1-31, V-03]; and the approach may not
be named against `tradeRouteAccess`, which runs road 52 · none 42 · mountain_pass 40 · river 37 ·
port 37 · crossroads 27 · isolated 25 [F1-102, V-08]. On floor 4, besides the purse rows: no
decay clock and no permanence over fabric, and note that the purse's own distress closure
reaches `Palisade or earthworks` (`institutionLifecycle.js:1016`), which is 51 of this
preimage's 103 wall rows [F4-01, V.0 floor 4]; `plagued` is MONSTERS and 71 of these towns carry
it [F4-05]; a blockade does close the sea supply [F4-09, V-24]; occupation diminishes the town's
own force and never removes it [V-16, on 2 towns]; naming any of the six buckets on a no-force
key is [F4-18]; and a covert fact never reaches a player face [F4-13] — which on this pool means
nothing at all, since `criminalCaptureState` reads `corrupted` and `capture` on **no town of the
preimage**. Last, the shipped rows themselves, since the writers will have read them: all three
predicate pay or debt on forces that are unpaid by definition or absent entirely [V-09]; "the
pay is irregular" is also a rate [F2-06]; "each season of it removes a little more" is both a
rate and an elapsed course [F2-05, F2-06]; "chronic rather than sudden" is a trend [F2-08]; and
`{settlement}` stands in all three, where ruling 12 allows it in at most one unit of the pool
and never in a face.

--------------------------------------------------------------------------------

(9) WHERE THE FLAVOUR IS

  WHAT IS IN USE. Everything, and none of it spare. This is a preimage of thorps and hamlets —
  a hundred and six of one, ninety-six of the other — where the universal facts are a burial
  place, water, roofs, a field, and a mill that on two hundred and nineteen towns belongs to
  somebody else and is up the road. About two months of food is stored, and there is no granary
  to store it in: it is in cellars and lofts and under the floor, and the engine says so by
  printing the reading with no building behind it. The tools are the flavour — the levy musters
  with hunting bows, spears and farm tools, the palisade is a ring of sharpened stakes on fifty
  towns, the alehouse is on fewer than half of them and the lord's steward is on a hundred and
  seven. Nothing here is institutional, so every concrete noun a writer wants has to be a thing
  a household owns.

  WHAT IS IN DISPUTE. Who bears it, since there is no purse to argue over. On four towns in
  five the page says the crisis logistics are funded somewhere between two-thirds and
  all-but-nothing, while the people who would answer a crisis are the able-bodied of the place
  and are owed nothing because they were never promised anything. That is the pool's real
  quarrel, and it belongs to mouths that disagree about duty rather than about money: the
  village elders who decide without a treasury and must say what was not done, the lord's
  steward whose interest runs the other way entirely — what leaves, not what fails to arrive —
  the households that turned out last time and the households that did not, and a stranger who
  can see in an afternoon what nobody here has any reason to put into words. And underneath it,
  quietly, the fact that forty-two of these towns are Comfortable or Prosperous on their own
  Economics tab while wearing a badge that reads WEAK: being poor and being unprovided are two
  different facts, and this key fixes only the second.

  WHAT THE ABSENCE LOOKS LIKE ON THE GROUND. Not emptiness — informality. Order IS kept here:
  the machine's own sentence on a hundred and eighty-nine of these towns says community
  pressure, the authority of established families, and the implicit threat of collective action,
  and on a hundred and forty-two says the locals watch the main paths. What is missing is
  anything written down and anybody paid. Not one record-keeping kind in the engine's table
  stands on a tenth of these towns, so the whole arrangement lives in what people know and what
  they will admit to knowing, and every obligation on this desk is a custom rather than a
  contract. The hook is the untested custom: enough food for about two months, an arrangement
  that has never been called on, and no one in the place who could say whose job it would be if
  it were.

================================================================================
END OF THE MARKER'S SECTIONS. The instruments were run READ-ONLY in the dock; the
marker's measurement was an inline `node --input-type=module -e` over `rateGrid()`,
`generateSettlementPipeline`, `holdersOf` and `standingDefenseForces`, wrote no file,
and touched no dock state. This packet file is the only file written.
================================================================================
