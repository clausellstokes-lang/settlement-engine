THE CARD (mechanical sections) — block DS-DEF-2 · pool `Invasion & War: walls AND professional garrison` · dir ds-def-2-invasion-war-walls-and-professional-garrison

(1) THE KEY AND ITS PREIMAGE
  key function: INVASION_ROW_POOL (rung table) · site defense.threatAssessment
  census predicate: invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js) === walls, professional garrison
  read walls          -> institutions[bucket=walls]               [LIVE-ROSTER] writers 38   (resolved through invasionRowPoolKey's call site in the entry point)
  read garrison       -> institutions[bucket=garrison]            [LIVE-ROSTER] writers 38   (resolved through invasionRowPoolKey's call site in the entry point)
  read militia        -> institutions[bucket=militia]             [LIVE-ROSTER] writers 38   (resolved through invasionRowPoolKey's call site in the entry point)
  the key FIXES: walls=true · garrison=true · leaves OPEN: militia   (invasionRowPoolKey, 2 combination(s))
  preimage on the 768-town rate grid: 306 towns (3984 bp) — town 50/128 · city 128/128 · metropolis 128/128
  silent tiers: thorp, hamlet, village

(2) THE REQUIRED ROWS (institutionalCatalog required: true) at every preimage tier — bodies a face may not deny or infer away
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
  Garrison (required at city) — a face may not deny: Defence services (p 1) · filed under standing (deriveArmedForces)
  Housing (1000-5000 structures) (required at city) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Housing (180-1000 structures) (required at town) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Inn (multiple) (required at town) — a face may not deny: Accommodation (p 1) · Meals and drink (p 0.9) · Stabling (p 0.8) · filed under no closed roster
  Inns and taverns (district) (required at city) — a face may not deny: Full accommodation (p 1) · Entertainment (p 0.8) · filed under no closed roster
  Market square (required at town) — a face may not deny: Weekly market (p 1) · Civic announcements (p 0.8) · filed under the `market` roster
  Mills (2-5) (required at town) — a face may not deny: Grain grinding (p 1) · filed under no closed roster
  Multiple courthouses (required at city) — a face may not deny: (no service menu at or above the bar) · filed under the `court` roster
  Multiple market squares (required at city) — a face may not deny: District trading (p 1) · filed under the `market` roster
  Multiple water sources (required at town) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Parish burial grounds (required at town) — a face may not deny: Burial (p 1) · Register of the dead (p 0.8) · filed under no closed roster
  Parish churches (10-30) (required at city) — a face may not deny: Full religious coverage (p 1) · filed under the `church` roster
  Parish churches (2-5) (required at town) — a face may not deny: Life ceremonies (p 1) · Religious services (p 1) · filed under the `church` roster
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
  Garrison (required at city) — NOT SEEN is a claim about: Defence services
  Housing (1000-5000 structures) (required at city) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Housing (180-1000 structures) (required at town) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Inn (multiple) (required at town) — NOT SEEN is a claim about: Accommodation · Meals and drink · Stabling
  Inns and taverns (district) (required at city) — NOT SEEN is a claim about: Full accommodation · Entertainment
  Market square (required at town) — NOT SEEN is a claim about: Weekly market · Civic announcements
  Mills (2-5) (required at town) — NOT SEEN is a claim about: Grain grinding
  Multiple courthouses (required at city) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Multiple market squares (required at city) — NOT SEEN is a claim about: District trading
  Multiple water sources (required at town) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Parish burial grounds (required at town) — NOT SEEN is a claim about: Burial · Register of the dead
  Parish churches (10-30) (required at city) — NOT SEEN is a claim about: Full religious coverage
  Parish churches (2-5) (required at town) — NOT SEEN is a claim about: Life ceremonies · Religious services
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
    Burial grounds and charnel house: "inside the walls" — stated only at city — silent at town, metropolis   [the catalog row]
        the data says: "The parish grounds inside the walls filled generations ago, so the dead are lifted once their term is up and their bones stacked in the charnel house to make room for the next."
    Burial grounds and charnel house: "outside the gates" — stated only at city — silent at town, metropolis   [the catalog row · the `Burial` service]
        the data says: "New ground has been bought outside the gates, and the carts that go out at dusk are a fixed part of the city's evening."
    Market square: "in the square" — stated only at town — silent at city, metropolis   [the `Civic announcements` service]
        the data says: "Official proclamations, wanted notices, and public notices read in the square."
    Parish burial grounds: "beyond the gate" — stated only at town — silent at city, metropolis   [the catalog row]
        the data says: "Each parish keeps its own ground beside its church, and a parish that has filled its ground buries beyond the gate instead."
  ⛔ A FACE DRAWS ON EVERY TOWN OF THE PREIMAGE, so a placement the data states only at the city is an INVENTION on the thorp (floor 2), and a hedged one is a tendency rather than this town's fact.

(2d) THE KEY'S SIBLING RUNGS — what this pool's key would have been had ONE of the fields it fixes been otherwise
    walls = true HERE
        walls = false -> `Invasion & War: force with NO walls`
    garrison = true HERE
        garrison = false -> `Invasion & War: walls with citizen militia`
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
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:74  CAN CO-FIRE (predicate open)
      "Active frontier. Walls and garrison provide credible deterrence: most creature threats will not press a defended perimeter. ${?1}Adequate for the threat level."
      when: !(threat === 'plagued')  AND  threat === 'frontier'  AND  hasWalls && hasGarrison
      ${?1} when hasCharter: "Charter hall handles anything above the garrison usual remit. "
      ${?1} when !(hasCharter): ""
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:94  CAN CO-FIRE (predicate open)
      "Safe heartland: the existing defenses are substantially more than the threat level requires."
      when: !(threat === 'plagued')  AND  !(threat === 'frontier')  AND  hasWalls && hasGarrison
  • [buildThreatAssessment -> mil] src/domain/display/threatAssessment.js:115  FIRES ON EVERY PREIMAGE TOWN
      "Walls and professional garrison provide meaningful deterrence against raiding and conventional assault. Not rated for sustained siege without significant supply stockpiles."
      when: hasWalls && hasGarrison
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
  (excluded as contradicting the key: 19 strings)

(5) THE CLOSED ROSTERS THIS KEY DOES NOT FIX
  watch      OPEN — required only at town, city; open at metropolis   [town: Town watch ; city: Professional city watch]
  garrison   FIXED TRUE by the key   [city: Professional city watch, Garrison]
  militia    OPEN — the key does not fix it and no required row seats it
  mercenary  OPEN — the key does not fix it and no required row seats it
  charter    OPEN — the key does not fix it and no required row seats it
  walls      FIXED TRUE by the key   [city: City walls and gates]
  gates      OPEN — required only at city; open at town, metropolis   [city: City walls and gates]
  granary    OPEN — required only at town, city; open at metropolis   [town: Town granary ; city: City granaries]
  hospital   OPEN — the key does not fix it and no required row seats it
  market     OPEN — required only at town, city; open at metropolis   [town: Market square, Weekly market ; city: Multiple market squares, Daily markets]
  hall       OPEN — required only at town, city; open at metropolis   [town: Town hall ; city: City hall]
  court      OPEN — required only at town, city; open at metropolis   [town: Town hall ; city: City hall, Multiple courthouses]
  prison     OPEN — the key does not fix it and no required row seats it
  church     OPEN — required only at town, city; open at metropolis   [town: Parish churches (2-5) ; city: Parish churches (10-30)]
  ⚠ `court` is hasCourtSystem and its keyword list includes 'town hall' and 'city hall': a required Town hall seats a court in the engine's model.

(6) THE FROZEN FIELDS (writers under src/domain/worldPulse/, field grain)
  institutions[bucket=walls]                           writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=garrison]                        writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=militia]                         writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  defenseProfile.readiness.score                       writers  0  FROZEN [SNAPSHOT]
  name                                                 writers 201  LIVE   [PULSE]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulse.js:1312, src/domain/worldPulse/applyWorldPulseOccupationAuthority.js:164, src/domain/worldPulse/applyWorldPulsePrimitives.js:38, src/domain/worldPulse/brokeragePatronage.js:178 … +197
  config.monsterThreat                                 writers  0  FROZEN [CONFIG]
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
  town: the hall: Town hall · the tavern: Taverns (5-20) · the guilds: Craft guilds (5-15) · the register (parish): Parish churches (2-5), Parish burial grounds · the elders: —
  city: the hall: City hall · the tavern: Inns and taverns (district) · the guilds: — · the register (parish): Parish churches (10-30), Burial grounds and charnel house · the elders: —
  metropolis: the hall: — · the tavern: — · the guilds: — · the register (parish): Cemetery network · the elders: —
  the key on the force buckets and the gates: watch: OPEN · garrison: FIXED TRUE by the key · militia: OPEN · mercenary: OPEN · charter: OPEN · gates: OPEN


(7) THE SOURCES

  ⛔⛔ READ THIS BEFORE ANYTHING ELSE — **THE INSTRUMENT UNDER-REPORTS THE METROPOLIS, AND IT
  UNDER-REPORTS IT IN EXACTLY THE DIRECTION THE SITTING SAID THE PROSE FAILS.** Section (2)
  above prints `metropolis (1): Cemetery network`, and section (5) prints watch, hall, court,
  market, granary and gates OPEN at metropolis. That is the metropolis catalogue read ALONE.
  The assembler does not read it alone: `assembleInstitutions.js:243-245` builds the
  metropolis from `mergeCatalogs(institutionalCatalog['city'], institutionalCatalog['metropolis'])`,
  a per-category shallow merge (`:117-124`) in which a metropolis row of the same NAME
  overrides and every other CITY row carries through with its `required` flag intact.
  EXECUTED over the merged catalogue, the metropolis carries **FOURTEEN required rows**, not
  one:

      Defense        City walls and gates · Garrison · Professional city watch
      Economy        City granaries · Multiple market squares · Inns and taverns (district) · Warehouse district
      Religious      Parish churches (10-30) · Burial grounds and charnel house · Cemetery network
      Infrastructure City hall · Multiple courthouses · Housing (1000-5000 structures) · Aqueduct or water system

  (`Daily markets` is the one city requirement the merge DOES drop: the metropolis row of that
  name is `baseChance 0`, "Superseded at metropolis scale", and overrides the city's required
  row.) So a writer who trusted the printed (2) would believe a metropolis of this preimage
  has no hall, no watch, no market, no granary and no tavern, and would write "nobody is set
  up to respond" or "there is no hall to ask" — **the sitting's named failure mode, floor 1 by
  inference, handed to the writer by the card itself.** Every row above is a body a face may
  not deny and may not infer away at ANY tier of this preimage.

  ⛔ AND THE CONSEQUENCE THAT MATTERS MOST: with the merge applied, the preimage's three tiers
  agree on nearly every BODY. The hall, the tavern, the market, the granary, the parish
  church, the burial ground, the housing and **the watch** stand on every town this pool can
  draw. The wall and the garrison are fixed TRUE by the key. What the three tiers do NOT agree
  on is which RECORD can be cited — see the register below, which is the sharpest thing on
  this card.

  ⭐ THE KEY, RESTATED FROM THE ROSTER. `walls` and `garrison` are `standingDefenseForces`
  buckets over the LIVE roster (`defenseStateProse.js:658-660`; `defenseInstitutionBuckets.js:169-182`).
  What actually seats them, tier by tier (executed against `partitionDefenseInstitutions`):

      town        walls    ← `Town walls` (opt 0.5, "Stone fortifications with gates")
                             OR `Gates (if walled)` (opt 0.5) — the bucket matches the
                             substring 'wall' inside "wall**ed**", so THE GATE ROW ALONE
                             SEATS THE WALLS BUCKET
                  garrison ← `Barracks` (opt 0.3, "Housing for guards or small garrison")
                             and nothing else at this tier
      city        walls    ← `City walls and gates` (REQUIRED, "Masonry walls with towers.
                             Multiple gatehouses") · `Citadel` (opt 0.4)
                  garrison ← `Garrison` (REQUIRED, "Professional soldiers. Noble or royal.")
                             · `Professional city watch` (REQUIRED — ONE ROW IN BOTH THE
                             GARRISON AND THE WATCH BUCKETS)
      metropolis  walls    ← `City walls and gates` (REQUIRED via the merge) ·
                             `Massive walls and fortifications` (opt 0.5)
                  garrison ← `Garrison` · `Professional city watch` (both REQUIRED via the
                             merge) · `Multiple garrisons` (opt 0.75)

  ⛔ **THE TOWN'S WALL MAY BE A GATE AND NOTHING ELSE.** On the town slice (50 of 128) the key
  can fire with `Gates (if walled)` as the only walls-bucket row — "Controlled entry points
  with gatekeepers", `institutionalCatalog.js:1356-1362`, with NO wall dependency enforced
  anywhere in the assembler. There is no `Town walls` row on that town. A face that asserts a
  CIRCUIT — a ring, a line around the place, an inside and an outside, a wall-walk, a
  perimeter, stone to be kept — is an invention there. What is safe on every preimage town is
  the CONTROLLED WAY THROUGH, because `hasGates` fires on 'gates', 'town walls', 'city walls',
  'massive walls' and 'palisade' (`priorityHelpers.js:53`) and one of those stands on every
  native town of this preimage. ⚠ The row's own printed description does say "Controlled entry
  points **in the wall**" (`institutionVocabulary.js:159`) — that is engine PROSE against an
  absent ROW, so by §R-1 the ROW is the record and the circuit is still unsayable; a face that
  neither asserts nor denies a circuit is the only form true on all 306 towns.

  ⛔ **THE FILLS, AND ONE OF THEM IS A TRAP.** This pool is in `WALLED_DEF2_POOLS`
  (`defenseStateProse.js:506-524`), so `{defwork}` and `{defmaterial}` are offered here
  (ADDENDUM 18 ruling 10). EXECUTED over the preimage's rosters:

      Town walls (+ Gates)            {defwork} "town walls"                    {defmaterial} "stone"
      Gates (if walled) ALONE         {defwork} "gates (if walled)"  ⛔          {defmaterial} —
      City walls and gates (+Citadel) {defwork} "city walls and gates"          {defmaterial} "masonry"
      Massive walls ALONE             {defwork} "massive walls and fortifications"  {defmaterial} —
      Citadel ALONE                   {defwork} "citadel"                       {defmaterial} —

  `{defwork}` on a gates-only town renders **"the gates (if walled)"** — a catalogue
  parenthesis on the player page. `bareCommonFill` (`:1073-1082`) rejects determiners, dashes,
  digits and sentence punctuation and lets the round bracket through. That is a WIRING row for
  the chair, not a writer's fault; until it is cured, **a face using `{defwork}` on this pool
  must be written so it still reads if the slot renders that string, or the pool should not
  use the slot at all.** `{defmaterial}` is absent on three of the five rosters, so any face
  naming it is dropped on those towns by the kernel's anchored liveness (R-DST-K) — that is
  the designed behaviour, and it means a material face costs the pool coverage rather than
  truth. V-06's pool-grain material bar bites here in its own way: the pool draws stone towns,
  masonry towns and towns with no material at all, so a BAKED material word ("the stone ring",
  "the masonry") is a pool-grain finding; the slot or silence are the two lawful forms.

  ── UNIVERSAL (exists on every town this pool can draw: town 50/128 · city 128/128 ·
     metropolis 128/128, with the metropolis merge applied) ──

  • THE ARCHIVER / THE OFFICE — the compiled dossier itself, seated by construction
    (`holderTable.js:78-81`, `OFFICE_KIND`). INTEREST: none, and that is its stake.
    ⛔ RULING 40: a fact the engine holds stands BARE in the archiver's own hand — "The walls
    are kept and the town pays soldiers to stand behind them." NEVER "the survey finds", "so
    far as the record goes", "entered here as", "this office", "in the survey's time here".
    The office reports; it does not cite itself. Its conjecture and its feeling live in the
    dm-only notebook and nowhere else.

  • THE STRANGER / a traveller — seated by the road kind (`holderTable.js:233-234`), needing
    no roster row.
    INTEREST: what is visible on arrival, and on this key what is visible is a CONTROLLED WAY
    THROUGH and ARMED MEN BEHIND IT. He is the only source who meets the town in the order the
    town means him to: stopped first, counted second, admitted third. `Entry inspection`
    ("Check travelers and cargoes for contraband or wanted persons", on, p 0.8) and
    `Gate control` ("Control who enters and exits. Levy tolls on goods", on, p 1.0) are the
    engine's own words for what happens to him. Write him at the bar, not at a wall.

  • WHOEVER HOLDS THE WAY THROUGH — `hasGates` TRUE on every native preimage town
    (`priorityHelpers.js:53`, and the walls bucket cannot be non-empty here without one of its
    trigger names standing). Services by tier: `Town walls` → `Gate control` (on, p 1.0);
    `Gates (if walled)` → `Toll collection` (on, p 1.0) + `Entry inspection` (on, p 0.8) +
    `Curfew enforcement` (off, p 0.5); `City walls and gates` → `Gate control` — "Multiple
    gated access points. Customs checks and toll collection" (on, p 1.0).
    INTEREST: **the wall is an income, not only a defence.** Every wall row in this preimage
    levies at its gate in the engine's own service text. The gate is the one place where the
    defence and the purse touch the same hand, which is this pool's best pair material and its
    best notebook material both.
    ⚠ ⛔ BUT THE TOLL BOOK IS NOT CITABLE. The toll-bar holder kind's services are
    `Toll collection` · `Customs brokerage` · `Market charter and tolls` (`holderTable.js:302-309`),
    and only `Gates (if walled)` (opt 0.5, TOWN only), `Town council` (opt 0.9, town) and a
    `Major Port` carry one. `City walls and gates` collects tolls in its DESCRIPTION and offers
    the service under the name `Gate control`, which is in no holder kind's list — so at CITY
    and METROPOLIS `holdersOf('toll-bar')` returns NOTHING. A cited toll book is F1-24 / §R-8 /
    V-01 on two of the three tiers. Write the man on the bar; do not write his book.

  • THE GARRISON / the soldiers — FIXED TRUE by the key, so present by construction.
    Services: at town `Barracks` → `Military escort` ("Armed escort within the settlement's
    jurisdiction", on, p 0.8) + `Guard hire` ("Soldiers available for static guard duty on
    contract", on, p 0.9); at city and metropolis `Garrison` → `Defence services` — "Patrol,
    wall-walking, gate duty" (on, p 1.0) + `Mercenary hire` — "Off-duty soldiers available for
    escort" (on, p 0.6) + `Equipment purchase` — "Standard military equipment at cost" (on,
    p 0.7); `Multiple garrisons` where it stands → `District security` (on, p 1.0) +
    `Rapid response` (on, p 0.8).
    INTEREST: the wage, the wall-walk, and **the hire.** The engine's own menu says these men
    escort, guard on contract, and sell their off-duty hours — so the town's professionals are
    also a service the town's traders can buy, out of the same pockets that fill the purse that
    pays them. ⛔ Plural and unnamed ALWAYS: "the soldiers", "the men on the walk", never an
    officer (see the named offices below — this is the pool's likeliest floor-3 failure).
    ⚠ The town's garrison is a BARRACKS and the word means housing: no fortress, no camp
    outside the town, no soldiers' quarter, no citadel unless the `Citadel` row stands.

  • THE WATCH — `Town watch` REQUIRED at town; `Professional city watch` REQUIRED at city and,
    via the merge, at metropolis. A body on every town of the preimage.
    INTEREST: **the pay and the comparison, and the comparison differs by tier.** At town the
    watch is "Part-time guards. Night patrol and gate duty" (`institutionalCatalog.js:1348-1354`;
    `Night patrol` on p 1.0, `Gate duty` on p 0.8) standing beside professionals in the
    barracks — F1-27 forbids calling that watch professional, full-time or soldiers. At city
    and metropolis the watch IS full-time ("~1% of population"; `Law enforcement` on p 1.0,
    `Crime reporting` on p 0.8) and `Professional city watch` sits in BOTH the watch and the
    garrison bucket. F4-19 / V-07: the military upkeep gate reaches the watch, so watch and
    garrison are paid off ONE line at every tier.
    ⛔⛔ SO THE CONTRAST IS TIER-SPLIT AND THE FACE IS DRAWN ON ALL THREE TIERS. "The garrison
    relieves the watch" is two rows at every city (§V.2's correction to F1-29) and two rows at
    every town (Barracks + Town watch) — but on a city whose required `Garrison` row has been
    ruined, `Professional city watch` is the ONLY garrison-bucket row and the two words name
    ONE body, and the face contradicts itself there. Write the two as a pair of DUTIES (the
    nights, the way through, the walk) and not as two organisations relieving each other.
    ⚠ The watch HOLDER kind (`Crime reporting` · `Crime response` · `Missing persons`) resolves
    at city and metropolis and is only a 0.7 chance at town, where `Town watch`'s `Crime
    response` is off by default. A cited watch record is safe at city and metropolis, not at
    town.

  • THE HALL / a clerk in the hall — `Town hall` REQUIRED at town; `City hall` REQUIRED at city
    and metropolis.
    INTEREST: **the one purse, and on this key it is the only invasion rung where the purse has
    BOTH things to pay for.** `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)`
    (`defenseGenerator.js:189`) covers "garrison wages, wall maintenance" TOGETHER, applied at
    `:190-191` over the funded portion above the exempt `communityMilBase`; `hasAnyDefense` is
    TRUE here twice over (`:177-178`). Every economic band the page can print lands on that one
    line — `threatAssessment.js:167-173` and `defenseDisplay.js:221` ("Full pay, maintained
    equipment, reserve capacity" / "Adequate upkeep, some shortfalls" / "Irregular pay, worn
    equipment, morale risk" / "Cannot sustain forces. Systemic breakdown").
    ⚠ AND THE ACCOUNTS ARE CITABLE ONLY AT TOWN. The treasury kind (`Tax collection` ·
    `Tax payment` · `Taxation and tolls` · `Tithe and dues`) resolves at town on `Town hall`'s
    `Tax payment` (on, p 0.9) and the `Weekly market`'s `Tax collection` (on, p 0.9). `City
    hall`'s menu is `Civic licensing` · `Appeals court` · `Public record access` · `Contract
    witnessing` — NO tax service — so at city and metropolis the treasury resolves only through
    the optional `City administration` (0.92). "The accounts" cited as a record is town-safe
    and a chance elsewhere.
    ⛔ "the hall", "a clerk in the hall" — never "the clerk", never the Mayor.

  • THE TAVERN — `Taverns (5-20)` + `Inn (multiple)` REQUIRED at town; `Inns and taverns
    (district)` REQUIRED at city and metropolis.
    INTEREST: the safety label, the stranger traffic, and — peculiar to this key — **the men
    come off the walk and drink here.** `Information` (off, p 0.7) / `Information hub` (off,
    p 0.7) are the engine's own words for what the room is for. The tavern holds no record;
    write it as talk, and let it be the source that knows the soldiers as people.

  • THE MARKET AND THE GRANARY — `Market square` + `Weekly market` + `Town granary` REQUIRED at
    town; `Multiple market squares` + `City granaries` REQUIRED at city and metropolis.
    INTEREST: **the siege arithmetic, which the page states beside the prose.** The machine's
    own military row ends "Not rated for sustained siege without significant supply
    stockpiles" (`threatAssessment.js:115`) and `defenseDisplay.js:245` prints the granary's
    reading — "Granary + sea access. Historically the hardest siege posture to break." /
    "Granary in isolation. Endurance depends entirely on stored reserves." / "Granary with road
    supply. Cut the roads, cut the supply." The wall and the men are the half the town built;
    the stores are the half the page keeps score of.
    ⚠ The market HOLDER kind (`Weekly market` · `Public auctions`) resolves at TOWN only
    (`Market square`'s `Weekly market` service, on, p 1.0); `Multiple market squares` offers
    `District trading` and `Specialty markets`, neither of which is a market-kind service. A
    cited market record is town-only.

  • THE REGISTER / THE SEXTON — `Parish churches (2-5)` + `Parish burial grounds` REQUIRED at
    town; `Parish churches (10-30)` + `Burial grounds and charnel house` REQUIRED at city and
    metropolis; `Cemetery network` REQUIRED at metropolis.
    ⛔⛔ **AND THE REGISTER IS THE CARD'S SHARPEST SPLIT.** The parish kind's services are
    `Register of the dead` · `Central register` · `Records`. EXECUTED: `Parish burial grounds`
    carries `Register of the dead` (on, p 0.8) → resolves at TOWN. `Cemetery network` carries
    `Central register` — "Parish rolls copied into one office, because no parish can any longer
    say where its own dead are" (on, p 0.9) → resolves at METROPOLIS. `Burial grounds and
    charnel house` carries `Burial` · `Lifting and ossuary` · `Perpetual plot` · `Memorial
    inscription`, and `Parish churches (10-30)` carries `Full religious coverage` · `Network
    coordination` — **NONE of them a parish-kind service. At CITY the register resolves to
    NOBODY.** A cited parish register, a sexton's book, "the register has it" is lawful at town
    and metropolis and is F1-24 at city. The BODY is universal; the BOOK is not.
    INTEREST: the dead, and the creed's own standing where the card prints one (D-04–D-10 bind:
    the zeal is the FOLLOWERS', follows their standing, never the pantheon rank, never the god).
    ⛔ "the register", "the sexton" — never "the priest" (the tier emits a High Priest as a
    named NPC at every preimage tier).
    ⚠ AND THE TWO BURIAL ROWS CONTRADICT EACH OTHER AT METROPOLIS: `Burial grounds and charnel
    house` says "The parish grounds INSIDE THE WALLS filled generations ago" and `Cemetery
    network` says "Burial has left the walls ENTIRELY: grounds beyond every gate" — both
    required there. A face that places the dead relative to the wall picks a side of an engine
    self-contradiction. Do not place the dead.

  • THE HOUSEHOLDS — `Housing (180-1000 structures)` REQUIRED at town; `Housing (1000-5000
    structures)` REQUIRED at city and metropolis.
    INTEREST: `communityMilBase` (`defenseGenerator.js:138-159`) is the unpaid community
    baseline the upkeep gate EXEMPTS ENTIRELY (`:190-191`) — the engine's own model of a
    defence that costs the purse nothing because it costs the households instead. Plural and
    unnamed only.

  ── CONDITIONAL (the field that seats each) ──

  • THE GUILDS / a guild's factor — REQUIRED only at TOWN (`Craft guilds (5-15)`,
    `Quality certification` on p 1.0, `Apprenticeship programs` on p 0.8). At city
    `Craft guilds (30-80)` is 0.98 and `Merchant guilds (15-40)` 0.95; at metropolis
    `Craft guilds (100-150+)` and `Merchant guilds (50-100+)` are 0.7 each. Very likely,
    never certain. INTEREST: they pay tolls at the gate AND into the purse that keeps the
    gate, and they can hire the same soldiers by the day (`Guard hire`, `Mercenary hire`).
    Write them from their influence rank where the card prints one (ruling 18).

  • THE ELDERS / A COUNCIL — `Town council` opt 0.9 at TOWN and the only seat of the elders
    kind (`Record of custom`, `holderTable.js:332-336`) anywhere in this preimage; at city and
    metropolis no row carries it at all. Not universal, and absent above town.

  • A COURT — `Multiple courthouses` REQUIRED at city and metropolis; `Courthouse` opt 0.6 at
    town. `hasCourtSystem` is TRUE on EVERY preimage town regardless, because it fires on
    'town hall' and 'city hall' (`priorityHelpers.js:55`), so `threatAssessment.js:145-151` and
    `defenseDisplay.js:233` print a legal-chain reading beside the prose.
    ⚠ AND THE COURT RECORD IS CITABLE ALMOST NOWHERE: `Multiple courthouses` — the row REQUIRED
    at city and metropolis — has **no service row at all** in `institutionServices.js`, so the
    court holder kind resolves only through `Courthouse` (town, 0.6) or `Multiple court
    buildings` (metropolis, 0.65). The building stands; the record has no keeper.

  • A CITADEL — `Citadel` opt 0.4 at city (`Last refuge` on p 1.0), `Massive walls and
    fortifications` opt 0.5 at metropolis (`Perimeter defense` on p 1.0). Never assert an inner
    keep, a last refuge or a layered ring: F1-07 is explicit that a citadel is INNER and not a
    line, and here it is also optional.

  • A PRISON — `Large prison` opt 0.7 at city, `Massive prison` opt 0.5 at metropolis,
    `Small prison/stocks` opt 0.7 at town. F1-13; and DS-DEF-6 prints "Legal Infrastructure:
    None" beside the prose where the flag is false.

  • THE WAREHOUSES AND THE WATER — `Warehouse district` and `Aqueduct or water system`
    REQUIRED at city and metropolis, absent from the town catalogue. `Clean water distribution`
    (on, p 1.0) is a thing a face may not deny above town and may not assert at town.

  ── NEVER A SPEAKER ON THIS KEY ──

  • ⛔⛔ **THE MUSTER, AND THIS POOL IS THE ENGINE'S OWN NAMED EXAMPLE.** The muster holder
    kind's single service is `Muster training` and its single institution in the whole shipped
    roster is `Citizen militia`. The table's own note (`holderTable.js:279-288`) reads: *"ONE
    institution in the whole shipped roster keeps a muster: the Citizen militia. A town with a
    Garrison and no militia has men under arms and no roll of them, which is the sharpest
    wiring debt this table found."* **This pool IS that town, at every tier.** At town the
    required `Town watch` and `Citizen militia` share `exclusiveGroup: 'civilianDefense'` and
    the required row evicts the optional one; at city and metropolis no militia row exists in
    the catalogue at all. EXECUTED: `holdersOf('muster')` returns NOTHING on every native town
    of this preimage. A CITED muster roll is F1-24 / §R-8 / V-01. The CLASS WORD "the muster"
    stays free everywhere (F1-03); the ROLL as a record does not, and neither does a name on
    it, a number on it, or a clerk who keeps it.

  • A MILITIA as a standing body (F1-03) — never assert; and never assert its absence either
    (F1-30 protects a custom row). F1-26 bars militia-and-watch together at town in any case.

  • A MERCENARY COMPANY (F1-05). ⚠ **W-01 LIVES ON THE TOWN SLICE.** `Hireling hall` (opt 0.5)
    and `Free company hall` (opt 0.3) are town rows that set `hasMercenary: true`
    (`priorityHelpers.js:49`) while the mercenary BUCKET (`defenseInstitutionBuckets.js:98-100`)
    stays false. Two engine surfaces disagree; no face may be charged on such a town either
    way, and no face should lean on either reading. At city `Mercenary quarter` (0.6) sets
    both and the disagreement does not arise.

  • A CHARTER HALL / specialist recourse (F1-06) — `Adventurers' charter hall` opt 0.3 at town,
    `Multiple adventurers' guilds` opt 0.7 at city. ⚠ The threat row PRINTS the charter's
    presence or absence beside the prose on `plagued` and `frontier` towns
    (`threatAssessment.js:54-80`): "Charter hall coordinates specialist monster response." /
    "No specialist monster hunters on retainer: the garrison handles everything."

  • THE CROWN'S ASSESSOR — the engine has no typed crown collector anywhere. Not a speaker,
    at any tier, however naturally a garrison "Noble or royal" invites one.

  ── THE NAMED OFFICES A SPEAKER MUST NEVER BE (`npcGenerator.js:1511-1537`) ──
    town        Mayor · **GUARD CAPTAIN** · High Priest
    city        Mayor · **GUARD CAPTAIN** · High Priest · Wealthiest Merchant
    metropolis  Governor · **CITY WATCH CHIEF** · High Priest · Guild Archmage · Wealthiest Merchant
    Stress adds more, and four of them are stresses a walled garrison town readily carries:
    `under_siege` → Garrison Commander + Guard Captain · `wartime` → Garrison Commander + Guild
    Master · `monster_pressure` → Garrison Commander + Retired Adventurer · `slave_revolt` →
    Garrison Commander + Guard Captain. Also Corrupt Official (`occupied`, `insurgency`),
    Healer (`famine`, `plague_onset`), Moneylender (`indebted`), Chief Magistrate
    (`recently_betrayed`, `succession_void`), Council Member, Parish Priest.
  ⛔⛔ **THIS POOL'S TRAP IS THE MAN ON THE GATE AND THE MAN WHO COMMANDS THE WALK.** The key
  hands the writer a controlled entrance and a body of paid soldiers, and the two most natural
  sentences in the language are "whoever decides what passes" and "the one who says where the
  men stand". Both read, to every reader, as predicates on Guard Captain ⟨Name⟩ (or City Watch
  Chief ⟨Name⟩, or Garrison Commander ⟨Name⟩) on the NPC tab, each of whom carries a generated
  personality, disposition, behaviour hook and secret. That is F3-06 across all 306 towns.
  Gatekeepers are PLURAL here in the engine's own row ("Controlled entry points with
  gatekeepers"); write them plural, or write a bystander, a carter, a guild factor, a clerk.

(8) WHAT WOULD BE FALSE

  This is the one invasion rung where the town has BOTH halves, so almost every finding here
  is a denial rather than an invention, and the sitting's failure mode — a body inferred into a
  key's silence that a required row denies — is the live risk twice over: once because the
  preimage's fourteen-to-fourteen required rows seat a hall, a tavern, a market, a granary, a
  parish church, a burial ground, housing and a WATCH on every single town, and once because
  the instrument's own section (2) hides eleven of them at metropolis (the merge, above). So
  "nobody is set up to respond", "nothing here is organised", "no one keeps the nights", "there
  is no hall to ask", "the town has no soldiers of its own" are F1-25 negations of printed rows
  — and at city and metropolis the last of them is F1-28 by name, since `Garrison` is
  `required: true` there. The same-page producers deny them again in the engine's own hand:
  `threatAssessment.js:115` FIRES ON EVERY PREIMAGE TOWN — "Walls and professional garrison
  provide meaningful deterrence against raiding and conventional assault. Not rated for
  sustained siege without significant supply stockpiles." — DS-DEF-5 prints `walls PRESENT` and
  `garrison PRESENT` on the same tab, DS-DEF-11 prints a WALLED-* rationale, and the safety
  branches print "The garrison" as the responsive law body at every effectiveness rung
  (`safetyProfile.js:277`, `:284`, `:291`, `:302`, `:313`, `:366-372`, and the `wallNote`
  clauses "Walls and controlled entry points reinforce the guard's ability to monitor movement"
  / "Walls control entry points and give the guard a chokehold on smuggling routes"). Going the
  other way, do not seat what the key is silent about: a MUSTER ROLL cited as a record (F1-24,
  §R-8, V-01 — `holdersOf('muster')` returns nothing on every native town here, and the holder
  table's own note names this exact town as the debt); a militia (F1-03, F1-26) and equally not
  its absence (F1-30); a mercenary company (F1-05, with W-01 making a `Hireling hall` or
  `Free company hall` town unchargeable either way); a charter hall (F1-06); a citadel, an
  inner keep, a last refuge or a layered ring (optional rows, and F1-07 rules a citadel inner
  and not a line); a prison, a criminal trial, a sentence, a gaoling or a courthouse BUILDING
  at town where only the hall seats `hasCourtSystem` (F1-12, F1-13, §R-4 — the WORD court is
  free); a warehouse or an aqueduct at town (F1-19; both are city-and-up rows); a customs house
  or a toll bridge as an asset (F1-21); a granary below the roster's own reading (F1-09). **THE
  WALL IS THE TWO-WAY TRAP ON THIS KEY, AND IT IS THE INVERSE OF THE UNWALLED POOLS' GATE
  TRAP:** the key fixes the walls BUCKET, not a wall, and on the town slice that bucket can be
  seated by `Gates (if walled)` alone with no `Town walls` row behind it — so a CIRCUIT, a
  ring, a line around the place, an inside and an outside, a wall-walk, a parapet, a stair to
  the walk, stone to be kept, or anything a face predicates of a perimeter is an invention
  there (F1-07 read as the record, per §R-1, against the gate row's own "in the wall" prose);
  while DENYING a gate, a bar, a checkpoint or a controlled entrance is F1-08 everywhere, since
  `hasGates` is true on every native preimage town. Write the WAY THROUGH, which is universal;
  write the LINE only through `{defwork}`, and know that `{defwork}` renders "gates (if walled)"
  on a gates-only town and that `{defmaterial}` is absent on three of the five rosters — a
  baked material word ("the stone ring", "the masonry", "timber") is a pool-grain finding
  (V-06, F1-32) and its SOURCE ("cut from its own quarries", "the stone of the country") is
  F1-33 wherever the fortification chain runs. On the purse, F4-02 bars the SPLIT and this is
  the only pool where the split is tempting, because both halves exist: one multiplier covers
  "garrison wages, wall maintenance" TOGETHER (`defenseGenerator.js:189`, `:190-191`), so "the
  wall was kept and the men were not", "the wages went to stone", "they paid for the wall
  instead of the soldiers", and any source ASSERTING that split, are all the two-purses-at-birth
  claim; what is lawful is a disagreement about whether the GATE'S TAKINGS reach the purse,
  which is a different question the record leaves open. F4-03 bars splitting the four gates'
  direction (the watch provisioned while the garrison starves, or the reverse; F4-19 and V-07
  put the watch on the SAME military line); F4-04 bars the total collapse (every gate has a
  floor and `communityMilBase` is exempt — short, late and thin are licensed, "nothing has been
  paid" is not; men drifting off slowly IS the model's own word at `:186-187`, but a headcount
  is F2-01 and a COURSE is F2-05 — "the muster is thin", "posts stand unfilled" as a standing
  state, never "thinner than it was", per V-04 and R-9); F4-01 bars BOTH halves of the fabric
  question, which on this key is live in a way it is on no other rung, because a wall is the
  thing standing here: no decay clock (no rot, no weathering, no erosion, no "stone endures")
  AND no permanence, because calamity (`calamityKernel.js:96-151`), razing and the purse's own
  economic-distress closure (`institutionLifecycle.js:792-848`) demote and ruin built fabric —
  and note that only `City walls and gates` is exempt from the purse's closure, so a TOWN's
  `Town walls` row can be closed out from under a face that called it permanent. F4-06 bars
  explaining the readiness band by the works (`readiness = avgScore + tierBonus −
  threatPenalty`, `:510`; W-10 warns the key and the badge are computed from different inputs);
  F4-07 bars the river or the coast doing nothing; F4-08 bars magic in a world where magic does
  not work; F4-05 bars `plagued` read as disease — and note `safetyProfile.js:276` can print
  "The constant monster threat keeps the guard exceptionally well-drilled and alert" beside the
  prose, so a slack or cowed garrison contradicts it, while `threatAssessment.js:94` can print
  "Safe heartland: the existing defenses are substantially more than the threat level requires"
  on a settled town, so a face pleading that the wall and the men are barely enough contradicts
  THAT. Floor 2 is decidable from the grammar and this pool invites every row: no magnitude in
  digit or word — no headcount of the garrison, no "a handful on the walk", no "half the wall",
  no "most of the gates", no circuit length, no distance (F2-01; and `Barracks`'s own "small
  garrison" and `Professional city watch`'s "~1% of population" are the ROWS' words, never the
  writer's); no date, season, month or duration (F2-02); no founding, raising or first narrated
  — and a WALL is the single most tempting thing in the product to narrate the building of
  (F2-03); no event the record did not run — no siege survived, no assault turned back, no
  contract taken, no gate forced (F2-04); no RATE — "the gate is barred at dusk" is lawful,
  "most nights" is not (F2-06, §S-3); no age of fabric stated as an age (F2-07); no trend
  (F2-08); no historical allusion at all, since this key reads no history field (F2-09); and
  **no elapsed course over a LIVE field** (F2-05) — BUT the perfect and the durative ARE
  licensed over the key's own reads (ruling 11a: a face is drawn only while walls and garrison
  hold) and over the FROZEN fields the census at (6) prints, which on this tab is most of the
  page: `safetyLabel`, `guardEffectivenessDesc`, `scores.military`, `scores.internal`,
  `economicGates.military`, `config.monsterThreat`, `config.tradeRouteAccess`, `stress`,
  `economicState.compound.inst.*` and every `defenseProfile.institutions.*` carry ZERO pulse
  writers. ⚠ THE THREE LIVE ONES ARE THE KEY'S OWN: `institutions[bucket=walls|garrison|militia]`
  carry 38 writers each — licensed by 11a because they are the key's reads, and by nothing else.
  Floor 3: no named character's fate (F3-01); nothing predicated of a deity, the followers act
  and the god does not (F3-02, with the creed's zeal following the FOLLOWERS' standing per
  D-04–D-10); no culture furniture the profile denies across the **eleven** shipped profiles —
  germanic, latin, celtic, arabic, norse, slavic, east_asian, mesoamerican, south_asian, steppe,
  greek (executed) — so no thatch, no churchyard, no market green, no snow on the road, and none
  of the exemplar pack's north-European furniture (F3-05, the finding most likely to recur in
  every block, and a WALLED town is where a writer reaches for a medieval-European gatehouse by
  reflex); and the OFFICER RIDER above, which is F3-06 and is this pool's likeliest floor-3
  failure by a wide margin. The smaller rows this key genuinely reaches: F1-31 the tier word
  (the identity strip prints Town / City / Metropolis beside the name, and this preimage spans
  all three, so ANY size word is wrong on two thirds of it — "a place this size" is the form);
  F1-34 a totality of safety, since an `Invasion & War` row is built for every town and
  `settled` only multiplies threat DOWN; F1-35 `Controlled — Authoritarian` read as
  well-policed; F1-36 `Quarantined` / `Restricted` read as a crime lockdown; F1-37 and F4-15 the
  capture rungs read at their English sense or the wrong threshold; F1-38 the criminal structure
  label; F1-40 and F1-107 outrunning or borrowing the readiness badge; F1-102 / V-08 the
  approach against `config.terrainType` and `tradeRouteAccess`; F1-79 "nothing moves through the
  gates" on a besieged PORT town; F1-121 "the garrison" bare for an OCCUPIER's force under
  `occupied` (the occupation record has no garrison field; it costs one possessive) together
  with V-16 / F1-78, that the town's own force STANDS under occupation, diminished (×0.40, −35)
  and never removed and never at full strength; F1-117 and F1-118 a clause arguing with a
  rendered `{seat}` or `{counterpart}` fill; F1-126 a minted proper name — a person, a tavern, a
  lane, a family, a gate — which prints identically across every one of the 306 towns; F4-09 as
  V-24 re-cuts it, a blockade DOES close the sea supply absent teleport or airship; F4-13 a
  covert fact on a player face (and note (2c): NO covert field marks this pool, so no
  `compromised` tag is available here and the tag would be refused). Ruling 35 adds the last
  one: the neighbouring rungs are `Invasion & War: force with NO walls` (walls false) and
  `Invasion & War: walls with citizen militia` (garrison false), so a face that would sit as
  comfortably on either is either saying nothing this key fixes or denying something it does —
  the force must be a PAID, standing one and never a turnout, and the way through must be
  CONTROLLED and never merely a road into an open town. **And what is NOT a finding, by name:**
  that the card does not license it; "keep every claim, add none"; the same claim set on every
  face; the always-safe spelling lists; the layer bar; the record-word bar (accounts, returns,
  duties, ledgers, manifests, minutes, a writ, a licence are all free where a holder resolves);
  the per-face taste bands; the person bar beyond floor 3 — an unnamed person may act, hold a
  key, refuse, be resented, be paid late, be hired away by a guild, so long as the tier does not
  emit that office as an NPC; and DULLNESS, which is a pool-grain craft verdict and never a
  face-grain finding.

(9) WHERE THE FLAVOUR IS

  • WHAT IS IN USE — THE WAY THROUGH, AND IT IS A TILL. Every wall row in this preimage earns
    at its gate in the engine's own service text: `Town walls` → `Gate control`, "Control who
    enters and exits. **Levy tolls on goods**" (on, p 1.0); `Gates (if walled)` →
    `Toll collection`, "Levy on goods and travelers passing through the gates" (on, p 1.0) and
    `Entry inspection`, "Check travelers and cargoes for contraband or wanted persons" (on,
    p 0.8); `City walls and gates` → `Gate control`, "Multiple gated access points. **Customs
    checks and toll collection**" (on, p 1.0). And the soldiers are equally a service the town
    can be sold back to itself: `Guard hire`, "Soldiers available for static guard duty on
    contract" (on, p 0.9) at town; `Mercenary hire`, "Off-duty soldiers available for escort"
    (on, p 0.6) and `Equipment purchase`, "Standard military equipment at cost" (on, p 0.7)
    above it. So the concrete, particular, disputable things in front of a speaker are a cart
    being opened at the bar, a coin counted for passing, a guild factor hiring the town's own
    soldier for the day out of the same pocket that pays him anyway, and armour sold at cost to
    whoever has the cost. Write what the wall and the men are USED for, not what they are FOR.

  • WHAT IS IN DISPUTE — ONE PURSE WITH TWO THINGS IN IT, AND A GATE THAT TAKES MONEY. This is
    the only invasion rung where the single military line (`defenseGenerator.js:189-191`,
    "garrison wages, wall maintenance") actually has both halves to cover, and the one rung
    where the defence collects revenue of its own. The record fixes that the two are paid
    together and leaves entirely open whether what the gate takes is what the hall records —
    which is a real disagreement between real powers with real stakes: the hall defending the
    purse, the guilds paying at the bar and again through the purse, the soldiers on the walk
    whose wage rides the same multiplier as the part-time watch beside them (F4-19), the tavern
    counting who came off duty with coin. Two sources can read that honestly and oppositely,
    the archiver can weigh in without settling it (ruling 22 — the weighing OPENS), and nothing
    in the engine closes it, which is exactly the shape the owner asked for: a plot hook, not a
    receipt.

  • WHAT THE ABSENCE LOOKS LIKE ON THE GROUND — MEN UNDER ARMS AND NO ROLL OF THEM. This pool
    has no missing half, so its absence is a record rather than a thing: the holder table's own
    note says it plainly — one institution in the whole shipped roster keeps a muster, the
    `Citizen militia`, and this key is the town that has professional soldiers and no militia.
    EXECUTED, `holdersOf('muster')` is empty at all three tiers. Beside it sit two more
    absences the tiers create: at CITY the parish register resolves to nobody (the charnel
    house and the parish churches carry no register service), and at CITY and METROPOLIS the
    toll book has no keeper though the wall's own description says it collects. So the town
    counts what comes through the gate and files it somewhere the dossier cannot name; it buries
    its dead and, in a city, no book says where; and it pays soldiers whose names are on no
    list. That is a whole notebook's worth of conjecture, and every word of it is the engine's
    own arithmetic rather than the writer's invention.
