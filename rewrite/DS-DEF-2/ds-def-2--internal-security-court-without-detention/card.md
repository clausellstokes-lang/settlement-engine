THE CARD (mechanical sections) — block DS-DEF-2 · pool `Internal Security: court without detention` · dir ds-def-2-internal-security-court-without-detention

(1) THE KEY AND ITS PREIMAGE
  key function: internalRowPoolKey (rung literal) · site defense.threatAssessment
  census predicate: court truthy (no literal)
  read court          -> economicState.compound.inst.hasCourtSystem [SNAPSHOT] writers 0   (resolved through internalRowPoolKey's call site in the entry point)
  read prison         -> economicState.compound.inst.hasPrison    [SNAPSHOT] writers 0   (resolved through internalRowPoolKey's call site in the entry point)
  the key FIXES: court=true · prison=false   (internalRowPoolKey, 1 combination(s))
  preimage on the 768-town rate grid: 80 towns (1042 bp) — town 34/128 · city 34/128 · metropolis 12/128
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
        ⭐ THIS POOL IS ONE OF THEM
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
    court = true HERE
        court = false -> `Internal Security: no legal infrastructure`
    prison = false HERE
        prison = true -> `Internal Security: full legal chain (court AND prison)`
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
  • [buildThreatAssessment -> intA] src/domain/display/threatAssessment.js:147  FIRES ON EVERY PREIMAGE TOWN
      "Courts prosecute but limited detention."
      when: !(f.hasCourtSystem && f.hasPrison)  AND  f.hasCourtSystem
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
  • [deriveSupportingCapabilities -> note] src/domain/display/defenseDisplay.js:233  FIRES ON EVERY PREIMAGE TOWN
      "Courts without detention. Fines and exile only."
      when: !(f.hasCourtSystem && f.hasPrison)  AND  f.hasCourtSystem
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
  (excluded as contradicting the key: 9 strings)

(5) THE CLOSED ROSTERS THIS KEY DOES NOT FIX
  watch      OPEN — required only at town, city; open at metropolis   [town: Town watch ; city: Professional city watch]
  garrison   OPEN — required only at city; open at town, metropolis   [city: Professional city watch, Garrison]
  militia    OPEN — the key does not fix it and no required row seats it
  mercenary  OPEN — the key does not fix it and no required row seats it
  charter    OPEN — the key does not fix it and no required row seats it
  walls      OPEN — required only at city; open at town, metropolis   [city: City walls and gates]
  gates      OPEN — required only at city; open at town, metropolis   [city: City walls and gates]
  granary    OPEN — required only at town, city; open at metropolis   [town: Town granary ; city: City granaries]
  hospital   OPEN — the key does not fix it and no required row seats it
  market     OPEN — required only at town, city; open at metropolis   [town: Market square, Weekly market ; city: Multiple market squares, Daily markets]
  hall       OPEN — required only at town, city; open at metropolis   [town: Town hall ; city: City hall]
  court      FIXED TRUE by the key   [town: Town hall ; city: City hall, Multiple courthouses]
  prison     FIXED FALSE by the key
  church     OPEN — required only at town, city; open at metropolis   [town: Parish churches (2-5) ; city: Parish churches (10-30)]
  ⚠ `court` is hasCourtSystem and its keyword list includes 'town hall' and 'city hall': a required Town hall seats a court in the engine's model.

(6) THE FROZEN FIELDS (writers under src/domain/worldPulse/, field grain)
  economicState.compound.inst.hasCourtSystem           writers  0  FROZEN [SNAPSHOT]
  economicState.compound.inst.hasPrison                writers  0  FROZEN [SNAPSHOT]
  defenseProfile.readiness.score                       writers  0  FROZEN [SNAPSHOT]
  name                                                 writers 201  LIVE   [PULSE]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulse.js:1312, src/domain/worldPulse/applyWorldPulseOccupationAuthority.js:164, src/domain/worldPulse/applyWorldPulsePrimitives.js:38, src/domain/worldPulse/brokeragePatronage.js:178 … +197
  config.monsterThreat                                 writers  0  FROZEN [CONFIG]
  institutions[bucket=walls]                           writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=garrison]                        writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=militia]                         writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
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
  the key on the force buckets and the gates: watch: OPEN · garrison: OPEN · militia: OPEN · mercenary: OPEN · charter: OPEN · gates: OPEN

================================================================================
(7) THE SOURCES
================================================================================

  ⛔ READ THIS FIRST — WHAT THE KEY FIXES, AND WHICH HALF OF IT CARRIES THE POOL.
  The preimage is TOWN, CITY and METROPOLIS and nothing else (thorp, hamlet and
  village are silent): 80 towns of the 768-town grid, town 34/128 · city 34/128 ·
  metropolis 12/128. Every town this pool draws is large and fully rostered — a
  hall, a tavern, a market, a granary, a parish and a WATCH by requirement.

  ⭐ THE KEY IS TWO FLAGS AND ONLY ONE OF THEM SAYS ANYTHING.
  `hasCourtSystem` (`priorityHelpers.js:55`) fires on any of
  `['courthouse','court buildings','democratic assembly','city hall','town hall']`.
  `hasPrison` (`:54`) fires on any of `['prison','stocks','large prison',
  'massive prison']`. The key fixes court TRUE and prison FALSE.
  ⛔ **court = TRUE IS AUTOMATIC ON EVERY TOWN OF THE PREIMAGE AND CARRIES NO
  INFORMATION AT ALL.** `Town hall` is `required: true` at town; `City hall` AND
  `Multiple courthouses` are `required: true` at city and (by the merge) at
  metropolis. Nothing this key fixes is discovered by saying a court is here.
  ⭐⭐ **prison = FALSE IS THE WHOLE OF THIS POOL'S CONTENT.** All three prison
  rows are `required: false` — town `Small prison/stocks` 0.7, city `Large
  prison` 0.7, metropolis `Large prison` 0.7 + `Massive prison` 0.5 — and the key
  fixes EVERY ONE OF THEM ABSENT. The pool is not about the court. It is about
  the room that is not there, and the machine says so in its own words on every
  preimage town: **"Courts without detention. Fines and exile only."**
  (`defenseDisplay.js:233`) and **"Courts prosecute but limited detention."**
  (`threatAssessment.js:147`), under the status word **"Court only"** (`:231`).
  ⇒ §2d, ADDENDUM 18 ruling 35: a face whose whole content is "there is a court
  here" sits as comfortably on `full legal chain (court AND prison)` and is a
  floor-1 finding by construction. The sibling rung is one flag away.

  ⛔⛔ THE FOUR THINGS THE ABSENT PRISON ROW TAKES WITH IT — the writer's first
  four reaches, all of them false here:
    (a) THE STOCKS AND THE PILLORY ARE GONE. `stocks` is itself a `hasPrison`
        token, and `Public punishment` — "Stocks and pillory for public shaming
        and minor offenses" — belongs to `Small prison/stocks` and to NOTHING
        ELSE in the shipped roster (`institutionServices.js:1637`). "They have no
        gaol, so they use the stocks" is floor 1 on every town of the preimage,
        and it is the sentence this pool will attract most.
    (b) THE HOLDING CELL IS GONE. `Holding cells` (p 1.0) — "Short-term detention
        pending trial or payment of fines" — is the same row's service (`:1636`).
        No cell, no lock-up, no night in a room, not even pending a hearing.
    (c) THE FINE HAS NO TAKER. `Fine payment` (p 0.9) — "Pay fines to secure
        release from detention" — is ALSO a `Small prison/stocks` service and the
        only fine service anywhere in `institutionServices.js`. ⇒ The engine's own
        "Fines and exile only" has NO ROSTER ROW BEHIND IT on this preimage. Under
        §R-1 the printed sibling sentence is the record for the WORD, so a face
        that says a fine or the road STANDS; but nothing licenses a place where a
        fine is paid, a book it is entered in, or an officer who takes it. Say the
        sentence, never the machinery of it.
    (d) THERE IS NO GALLOWS, GIBBET, HANGING OR EXECUTIONER ANYWHERE IN THE
        ESTATE. Grepped across `src/data/` and `src/domain/display/`: zero hits;
        the single "executions" string is an `Arena` row's `Venue hire`, p 0.4 and
        OFF. F1-12 names the gallows by name. A capital sentence is an invention
        on every town this pool can draw, and "they cannot hold him so they hang
        him" is the second sentence this pool will attract.
    ⇒ EXILE stands on the same footing as the fine: the printed sibling sentence
      and nothing more. No row, no service, no officer, no register of the sent-
      away. The word is licensed; the apparatus is not.

  ⭐⭐ THE TIER SPLIT — WHAT THE COURT ACTUALLY IS, ROW BY ROW.
    · TOWN. The court may be nothing but the required `Town hall` — "Meeting
      place and administrative center" (`institutionalCatalog.js:1550`). Above the
      bar: `Permit applications` p 1.0, `Tax payment` p 0.9, `Dispute arbitration`
      p 0.8 — **"Bring COMMERCIAL AND CIVIL disputes before a magistrate."** A
      `Courthouse` row (0.6, "Borough court for local justice", `Civil disputes`
      p 1.0 + `Criminal trials` p 1.0 + `Notary services` p 0.9) is a COIN, not a
      requirement. ⇒ A CRIMINAL TRIAL AT TOWN, off a hall-only roster, is F1-12.
    · CITY. `Multiple courthouses` is `required: true` — "Commercial, criminal,
      and ecclesiastical courts." A criminal court genuinely stands and DENYING it
      is floor 1. `City hall` required: `Civic licensing` p 1.0, `Appeals court`
      p 0.8 — "Appeal decisions of lower magistrates and officials."
    · METROPOLIS. City's rows by the merge, plus `Cemetery network`; `Multiple
      court buildings` (Government, 0.65 — "Specialized courts … operating
      simultaneously") is a coin.

  ⛔⛔ THE CARD'S §2, §2b, §2b′, §5 AND THE INSTRUMENT'S §7 ARE WRONG ABOUT THE
  METROPOLIS AND A REFUTER MUST NOT USE THEM. They read the metropolis BLOCK;
  `assembleInstitutions.js:244` builds the metropolis catalogue as
  `mergeCatalogs(institutionalCatalog.city, institutionalCatalog.metropolis)`,
  merging by CATEGORY then by NAME (`:117-124`). EXECUTED against the shipped
  data, the metropolis carries FOURTEEN required rows, not one:
    City granaries · Multiple market squares · Inns and taverns (district) ·
    Warehouse district · Parish churches (10-30) · Burial grounds and charnel
    house · Cemetery network · City walls and gates · PROFESSIONAL CITY WATCH ·
    GARRISON · City hall · MULTIPLE COURTHOUSES · Housing (1000-5000 structures) ·
    Aqueduct or water system
  (`Daily markets` is the one city required row the metropolis block overrides
  away.) So the WATCH, the GARRISON, the WALLS, the HALL and the COURTHOUSES all
  stand at metropolis. Take the required rows, the closed rosters and the
  observer's list from THIS correction; a refuter charging a face on §5's
  authority is charging the truthful party (§R-1).

  ⭐⭐ THE ARREST WITH NOWHERE TO PUT IT — THIS POOL'S ENGINE-TRUE CENTRE.
  At CITY and METROPOLIS `Professional city watch` is required, and its services
  above the bar are `Law enforcement` p 1.0 — **"Patrol, arrest, and basic
  investigation of crimes."** — and `Crime reporting` p 0.8 — **"Accept and record
  crime reports. ISSUE WARRANTS."** (`institutionServices.js:1207-1208`). So on
  two thirds of the preimage the engine positively models ARREST and WARRANTS
  beside a key that fixes no room to hold anyone. §2b's bar applies: denying the
  arrest, the patrol or the warrant is floor 1 whatever the face is otherwise
  about. **Describing what happens next is the pool.**
  At TOWN the watch is `Town watch` — "Part-time guards. Night patrol and gate
  duty." — `Night patrol` p 1.0 ("Patrol the streets after dark. Deter crime and
  respond to incidents"), `Gate duty` p 0.8 ("Check travelers entering and
  leaving. Note unusual visitors"), and `Crime response` p 0.7 **OFF** ("Respond
  to reported crimes and pursue fleeing suspects"). F1-27 is explicit: a town
  watch described as professional, full-time or as soldiers is a finding.
  ⇒ THE WATCH IS A RESOLVING RECORD-KEEPER AT CITY AND ABOVE AND NOT AT TOWN.
    The `watch` kind's services are `Crime reporting · Crime response · Missing
    persons` (`holderTable.js`); at town the only one is OFF by default. A
    warrant, a filed report, "what the watch has written down" is F1-24 on a
    town-tier town unless the card's roster prints `Crime response`.

  ⭐⭐ THE COURT IS A PRESENCE EVERYWHERE AND A RECORD-KEEPER ALMOST NOWHERE.
  `HOLDER_RECORDS`' `court` kind resolves on the service names `Criminal trials ·
  Civil disputes · Notary services · Criminal proceedings · Civil litigation ·
  Appeals`, cited to `Courthouse` and `Multiple court buildings` — **and to
  nothing else.** The REQUIRED `Multiple courthouses` carries NO SERVICE MENU AT
  ALL (§2b prints it); `Town hall` and `City hall` carry none of those names.
  `holdersOf` reads instantiated service rows against the LIVE roster (`:599-615`).
    ⛔ ON A CITY, WHERE THE KEY IS SATISFIED BY A REQUIRED `Multiple courthouses`,
      THE `court` HOLDER KIND DOES NOT RESOLVE. "The court's book", "what the court
      entered", "the record of the hearing" is F1-24 / §R-8.
    ✔ The COURT may SPEAK as a source everywhere. It may not be CITED AS A RECORD
      unless the card's roster prints a `Courthouse` or a `Multiple court
      buildings` row.
  ⛔ There is no gaol holder kind at all — `HOLDER_KINDS` is closed (`treasury ·
  muster · census · parish · toll-bar · market · watch · court · elders ·
  tradition · road · office`) — which on this pool is moot twice over, since there
  is no gaol either.

  ⚠ THE ENGINE CONTRADICTS ITSELF ON THIS KEY, IN PRINT, AND THE FACE STANDS.
  On one branch `safetyProfile.js:283` appends, for any town where
  `hasCourtSystem` is true, " A functioning court system means organized crime
  operates with greater caution."; on another, `:435` and `:507` take their ELSE
  arms on exactly this key and print " With no reliable court system to fear,
  operations are conducted openly enough to be an open secret." and " The lack of
  reliable courts and detention means most offenders face no meaningful
  consequences."; and `:330` hedges it as " A court exists, though the prison
  system is limited." on a town with no prison at all. These are three engine
  prose surfaces disagreeing about the same fact. **§R-1 governs: where the
  denying surface is engine PROSE, the face stands and a WIRING row is filed.** A
  refuter may not fail a face for agreeing with any one of them, in either
  direction, and may not fail "there is nowhere to hold anyone" for being
  stronger than ":330's limited" — the FLAG is the record and the flag is false.

  ── UNIVERSAL (exists on every one of the 80 towns this pool can draw) ──

  • THE HALL — `Town hall` (town) / `City hall` (city, metropolis), all
    `required: true`. **This is the body that satisfies the court half of the key
    on most of the preimage**, so it is both the richest source here and the
    sharpest trap.
    INTEREST: THE PURSE, AND THE PURSE IS ONE. `defenseGenerator.js:244-253` —
    `internalUpkeepMult = min(1, 0.65 + econOutput/50 × 0.35)` over **"watch
    wages, court and gaol funding"** together, floor 0.65, community self-policing
    exempt; the military gate `:177-192` (floor 0.6) is the same shape on the same
    input. F4-02 / F4-03 make any SPLIT of direction a finding. ⭐ AND THIS POOL
    CARRIES THE ENGINE'S OWN JOKE: the comment names "court and gaol funding" as
    one line on a town that has no gaol to fund. The hall's honest grievance is
    DEGREE — short, late, thin; F4-04 fixes the extreme at never none.
    ⛔ Say "the hall" or "a clerk in the hall", never "the mayor": `Mayor` is a
    `TIER_MANDATORY_ROLES` NPC at town and city, `Governor` at metropolis, each
    with a personality, a disposition and a secret on the next tab (F3-06).
    ⛔ The hall's own record services are `Record filing` (town, p 0.6) and
    `Public record access` (city, p 0.6) — **both OFF by default**, so the `office`
    kind is CONDITIONAL. `Tax payment` (town, p 0.9, ON) DOES seat the `treasury`
    kind at town; the city hall carries no `Tax payment`. Cite the accounts only
    where the card's roster prints the service.
    ⛔ NOT a compromised source on this pool — §2c marks the hall on the purse
    pools (walls-with-no-force, and the three Economic Survival rungs), not here.

  • THE COURT — fixed present by the key at every tier. A speaker everywhere; a
    citable record only where `Courthouse` / `Multiple court buildings` prints.
    INTEREST: it can name a wrong and cannot keep the person who did it. At town
    its recorded procedure may be CIVIL ONLY (`Dispute arbitration` — commercial
    and civil), so a town court's grievance is jurisdiction; at city its criminal
    court is required and its grievance is what the watch brings it and what it is
    left able to do with them.
    ⭐⭐ THE ONE COMPROMISED SOURCE ON THIS POOL (§2c, ruling 26; car 18m NOT YET
      LANDED). The court's covert bloc marks exactly two pools and this is one of
      them. Offer ONE extra candidate per variant tagged `[court · compromised]`,
      concealing about WHAT REACHES THE LAW AND WHAT IT DOES WITH IT and denying
      nothing else — in more than one shape across the variants (dismiss ·
      reassure · minimise · change the subject · blame the talk · say nothing
      beyond the form), reported as flatly as any account, never naming the covert
      fact. One honest, TRUE reassurance per pool may be offered untagged.
    ⛔ Never "the magistrate" as a singular office where a `Chief Magistrate` is
      mandated (`recently_betrayed`, `succession_void`, `insurgency`) — F3-06. "A
      magistrate" is the `Dispute arbitration` service's OWN word and is safe, as
      are "those who hear it", "whoever sits that day".

  • THE WATCH — `Town watch` required at town; `Professional city watch` required
    at city AND metropolis. ⭐ REQUIRED ON EVERY TOWN OF THE PREIMAGE. A body, a
    speaker, and a `standing` bucket member in `deriveArmedForces`, so §2b's bar
    applies to its services.
    ⭐ AND ON THIS POOL THE WATCH IS **NOT** COMPROMISED. §2c marks the watch on
      the other three internal-security pools — full legal chain, detention
      without process, no legal infrastructure — and explicitly not on this one.
      A writer coming off the full-legal-chain packet will reach for a
      `[watch · compromised]` candidate out of habit; the tag is REFUSED here.
    INTEREST: it is the body that touches both ends of a chain with no far end —
    it takes a person up and there is nowhere to put them — and the same purse
    that pays it pays the court.
    ⛔ Never "the guard captain": `Guard Captain` is mandated at town and city,
      `City Watch Chief` at metropolis (`npcGenerator.js:1511-1517`).
    ⛔ F1-29 as §V.2 corrects it: at CITY and METROPOLIS, `Garrison` and
      `Professional city watch` are BOTH required with different names and
      `dedupByName` cannot merge them — so "the garrison relieves the watch" IS
      two rows there. The contrast is refused only at TOWN, where one row seats
      both buckets.

  • THE TAVERN — `Taverns (5-20)` required at town; `Inns and taverns (district)`
    required at city and metropolis. `Information` (p 0.7, OFF) is the town row's
    own word for it: "Drinking loosens tongues."
    INTEREST: the safety label from below, and the distributive fact the panel
    cannot print — who can pay a fine and who takes the road instead.

  • THE REGISTER / THE PARISH — `Parish churches (2-5)` + `Parish burial grounds`
    (town); `Parish churches (10-30)` + `Burial grounds and charnel house` (city,
    metropolis); `Cemetery network` (metropolis). Required at every tier. The
    `parish` kind resolves on `Register of the dead` (town, p 0.8, ON) and
    `Central register` (metropolis `Cemetery network`, p 0.9, ON) — so unlike the
    court, the parish IS a resolving record-keeper across the preimage.
    INTEREST: the parish keeps a book the law here does not. `Parish burial
    grounds`' own row-text calls the sexton's register "the town's longest
    unbroken record and the one it reaches for in an inheritance dispute" — a
    private settling standing where the public one stops. Write the parish from
    the creed's STANDING where the card prints one (ruling 18; D-04–D-10 bind —
    the zeal is the followers', never the god's).
    ⛔ Say "the register" or "the sexton", never "the priest": `High Priest` is
      mandated at town, city and metropolis; `Parish Priest` under `plague_onset`
      and `religious_conversion`.

  • THE MARKET AND THE GRANARY — `Market square` + `Weekly market` + `Town
    granary` (town); `Multiple market squares` + `Daily markets` + `City
    granaries` (city); at metropolis `Multiple market squares` + `City granaries`
    but NOT `Daily markets` (the merge overrides it away). Places and speaker
    families both.
    ⛔ PLACEMENT (§2b′): "in the square" is stated by the town's `Civic
      announcements` service ONLY and is silent at city and metropolis; a
      proclamation or a shaming read in the square draws on towns where the data
      does not say it.

  • THE STRANGER / THE TRAVELLER — seated by the road; needs no roster row.
    INTEREST: he is the person this machinery falls on hardest and most legibly.
    A man with no house here cannot be fined into anything, and the one sentence
    the town can carry out against him costs it nothing and him everything. His
    sharpest content is the SEAM — he was taken up by one body and handed to
    another and then let go, and he can report the join without claiming to know
    either side's record.

  • THE PUBLIC (ruling 28) and THE ARCHIVER AS WITNESS (ruling 27) — available on
    every town, kept under NOTES until car 18n lands.
    ⚠ READ §2b′ FIRST, corrected for the metropolis above. A watch is required on
      EVERY town of the preimage, so "nobody comes when it is reported", "nobody
      has been seen on the street after dark" is floor 1 in a witness's coat; a
      garrison and walls are required at city AND metropolis, so "no soldier has
      been seen" is a finding on two thirds of this pool. **The safe observed
      facts here are the ones the key itself fixes:** a door with no lock on the
      outside, a room with nothing in it to hold anyone, a bench outside a chamber
      with nobody keeping it, a man walking out the same door he was brought in by.
    ⛔ BARE PASSIVE, NO OBSERVER NAMED (ruling 40): never "in the survey's time
      here", "on the nights the survey kept", "this office", "the record has".

  ── CONDITIONAL (with the field that seats each) ──

  • THE GUILDS' FACTOR — ⚠ REQUIRED ONLY AT TOWN (`Craft guilds (5-15)`). At city
    and metropolis NO guild row is required, so the guilds are CONDITIONAL on two
    thirds of the preimage. F1-16: `hasGuild` is the bare token `guild` and fires
    on a `Thieves' guild`; the roster prints which.
    INTEREST (where seated): `Dispute resolution` (p 0.6, OFF) — "Arbitrate
    disputes between guild members and their clients." Where the town's court can
    name a wrong and fine it and no more, a private settling that CAN reach a
    member's trade is the stronger sanction. **This is the pool's best two-source
    disagreement** and it is available only where the card's roster seats it.

  • THE GARRISON — `Garrison` required at CITY and METROPOLIS ("Professional
    soldiers. Noble or royal."; `Defence services` p 1.0 "Patrol, wall-walking,
    gate duty"); OPEN at TOWN. F1-28: at city tier, denying the town has soldiers
    of its own is a finding. §R-3: a `Barracks` licenses "the garrison".
    INTEREST: it is paid from the OTHER gate (`:177-192`, the wall and the wages
    together) and it is NOT the body that takes people up for crimes — that is the
    watch. Its stake here is the overlap and the fact that nothing of this is its
    problem until it is.

  • WHOEVER HOLDS THE WAY THROUGH — `City walls and gates` required at CITY and
    METROPOLIS; `hasGates` OPEN at TOWN (it fires on `gates · town walls · city
    walls · massive walls · palisade`). `Gates (if walled)` carries `Toll
    collection`, which seats the `toll-bar` holder kind.
    ⛔ F1-08 CUTS BOTH WAYS: asserting a gate on a town-tier town with no gated row
      is a finding, and DENYING one at city or metropolis is the same finding
      reversed. ⚠ W-08: `Town watch`'s `Gate duty` is ON while
      `safetyProfile.js:463-464` can print "no gates to bribe and no checkpoints to
      avoid" — a WIRING row; a writer agreeing with EITHER surface cannot be failed.
    INTEREST: ⭐ ON THIS POOL THE GATE IS THE ONLY BODY ON THE PAGE THAT CAN CARRY
    OUT WHAT THE COURT DECIDES. Exile is a sentence executed at a gate. The gate is
    also where a person is stopped before any of the machinery touches them.

  • THE WORKHOUSE — city and metropolis, `required: false`, p 0.25. A COIN and
    never assumable, but the sharpest conditional this pool has: "The able-bodied
    poor receive shelter and food in exchange for compulsory labour… **Not a
    prison but the line is blurry.** Conditions are deliberately harsh…"
    (`institutionalCatalog.js`), with `Vagrancy enforcement` p 0.8 ON — "Remove
    vagrants from the streets. Resident in exchange for work."
    ⛔ It does NOT set `hasPrison` (no token match), so it stands lawfully beside
    this key — but ONLY where the card's own roster prints the row, and a face that
    leans on it draws on the three quarters of cities that have none.

  • THE MILITIA · THE MERCENARY · THE CHARTER HALL · THE HOSPITAL — ⛔ THE FOUR
    GENUINELY OPEN ROSTERS across the whole preimage. Seat none of them without the
    card's own roster row: F1-03 (a militia as a standing body, or a muster ROLL
    cited — the class word "the muster" is free), F1-05 (a mercenary company; ⚠
    W-01, the flag and the bucket disagree on three rows), F1-06 (a charter hall),
    F1-14 (a hospital BUILDING — `hasHospital` fires on a HEALER, a monastery or a
    friary). ⛔ F1-26: `Citizen militia` and `Town watch` share `exclusiveGroup:
    'civilianDefense'` and the militia row's own text is "Present only when no
    professional watch exists" — so on a town whose watch is REQUIRED, a citizen
    militia beside it is a contradiction in the catalogue's own terms.

  • ⛔ THE ELDERS ARE NOT A SPEAKER ANYWHERE IN THIS POOL. The `elders` kind
    resolves `Household elder · Village elder · Village headman · Town council` and
    NONE is required at any preimage tier. This is the exact inverse of the
    below-town `no legal infrastructure` pool, whose shipped rows lean on the
    elders in eight faces: here the hall is yours and the elders are not.

  • ⛔ THE CROWN'S ASSESSOR is not a speaker anywhere. The engine has no typed
    crown collector and no producer mints one.

  ── THE NAMED OFFICES A SPEAKER MUST NEVER BE (`npcGenerator.js:1511-1537`) ──
    town:        Mayor · GUARD CAPTAIN · High Priest
    city:        Mayor · GUARD CAPTAIN · High Priest · Wealthiest Merchant
    metropolis:  Governor · CITY WATCH CHIEF · High Priest · Guild Archmage ·
                 Wealthiest Merchant
    plus, by the town's PRIMARY stress: Garrison Commander + Guard Captain
    (`under_siege`, `wartime`, `slave_revolt`, `monster_pressure`) · Healer +
    Guild Master (`famine`, `mass_migration`) · CORRUPT OFFICIAL (`occupied`,
    `insurgency`) · Council Member ×2 (`politically_fractured`) · Moneylender
    (`indebted`) · CHIEF MAGISTRATE (`recently_betrayed`, `succession_void`,
    `insurgency`) · Parish Priest + Healer (`plague_onset`) · Retired Adventurer
    (`monster_pressure`).
    ⭐⭐ THIS POOL'S F3-06 TRAPS ARE AMONG THE WORST IN THE BLOCK, because the
    singular offices the tier emits are exactly the people the subject is about. A
    Guard Captain (or City Watch Chief) and a Mayor stand on EVERY town of the
    preimage, and a Chief Magistrate on every `recently_betrayed`,
    `succession_void` or `insurgency` town. So "the one who decides what is
    charged", "whoever sits in judgment", "the officer who brings them in", "the
    man who lets him go again" all read as statements about a named NPC with a
    disposition and a secret on the next tab. Use a plural, a trade, a bystander,
    or an office the roster does not seat: "a clerk in the hall", "those who sit
    that day", "the men of the night patrol", "whoever is at the bar that morning".
    ⚠ F1-111 and F4-14: clean hands, an unbought office or an unreachable seat is
    FALSE where `occupied` / `insurgency` mandates a `Corrupt Official` — and that
    role string is OPENLY ROSTERED, so calling that corruption hidden is F4-14 in
    the other direction.

================================================================================
(8) WHAT WOULD BE FALSE
================================================================================

  The machine states this pool's whole subject on every town of the preimage in
  three places — "Courts prosecute but limited detention." (`threatAssessment.js:
  147`), the status word "Court only" and the note "Courts without detention.
  Fines and exile only." (`defenseDisplay.js:231`, `:233`) — so the writer's
  content is not the statement but what it looks like on the ground, and the
  findings gather in two shapes: FURNISHING THE MISSING ROOM ANYWAY, and READING
  THE COURT AS ORDER. Taking them by field: no STOCKS, pillory or public shaming
  ANYWHERE on this preimage, since `stocks` is itself a `hasPrison` token and
  `Public punishment` belongs to `Small prison/stocks` alone (F1-13, F1-12); no
  holding cell, lock-up, night in a room, or detention pending anything, the same
  row's `Holding cells` being the only one in the roster (F1-13); no gaol book,
  committal roll or list of the held, since `HOLDER_KINDS` is closed and carries
  no prison kind (F1-24); no gallows, gibbet, hanging or executioner, which exist
  nowhere in the estate (F1-12 names the gallows); no PLACE, book or officer that
  takes a fine, `Fine payment` being a prison service this key fixes absent —
  though the WORD fine and the WORD exile stand on the printed sibling sentence
  under §R-1; no criminal TRIAL, sentence or verdict at TOWN, where the court flag
  is seated by the required `Town hall` whose only procedure above the bar is
  `Dispute arbitration`, commercial and civil, and where a `Courthouse` is a 0.6
  coin (F1-12, §R-4 — the WORD court is free, the criminal PROCEDURE is the
  finding); no DENIAL of the criminal court at CITY or METROPOLIS, where `Multiple
  courthouses` is required and reads "Commercial, criminal, and ecclesiastical
  courts" (F1-25, §2b); no cited COURT RECORD where the roster's court row is that
  required `Multiple courthouses`, which carries no service menu and seats no
  `court` holder (F1-24 / §R-8, this pool's signature citation finding); no
  WARRANT or filed crime report at TOWN, where `Crime response` is OFF by default,
  and no DENIAL of the warrant, the arrest or the patrol at city and metropolis,
  where `Law enforcement` and `Crime reporting` are both ON (F1-24; F1-25 with
  §2b); no professional, full-time or soldierly TOWN WATCH (F1-27) and no denial of
  the watch anywhere, it being required at all three tiers (F1-25, V-23 reversed);
  no militia beside the required watch (F1-26), no mercenary company (F1-05, ⚠
  W-01), no charter hall (F1-06), no hospital BUILDING (F1-14), no WORKHOUSE
  without its 0.25 row; no denial of the GARRISON, the WALLS or the GATES at city
  or metropolis (F1-28, F1-07, F1-08 reversed) and no assertion of them at town
  without the row; no "the garrison relieves the watch" AT TOWN, where one row
  seats both buckets (F1-29 as §V.2 corrects it — TRUE at city and metropolis); no
  second unnamed governing body (F1-59); and no hall, market, granary, mill, inn,
  tavern, parish, burial ground, water supply or housing denied anywhere (F1-25,
  §2b), taking the metropolis from the fourteen-row correction in §7 and never
  from §5. Reading the court as ORDER is the subtler half: the key is INDEPENDENT
  of `safetyLabel`, so a town with a court and no prison can print `Dangerous` —
  "Violence and theft are routine… tribute paid to whoever controls their street"
  — beside the face, and equally `Very Safe` — "among the safest settlements in
  the region" — so a face asserting either that the law holds or that it is a dead
  letter can contradict the printed band (F1-107, F1-34 for any TOTALITY of
  safety); the capture rungs are their own trap, `none` not being "no crime",
  `equilibrium` printing as "Criminal: Tolerated" and `adversarial` asserting
  enforcement is WINNING (F1-37, F4-15), while "no organized crime here" off a
  `null` structure is F1-38. ⚠ BUT the engine disagrees with itself here in print —
  `safetyProfile.js:283` credits the court with making crime cautious while `:435`
  and `:507` take their ELSE arms on this very key and say offenders face no
  meaningful consequences, and `:330` hedges a town with no prison as one whose
  "prison system is limited" — so under §R-1 a face agreeing with ANY of those
  surfaces stands, in either direction, and a WIRING row is filed instead. The
  PURSE is one and its direction cannot be split: `defenseGenerator.js:244-253`
  funds "watch wages, court and gaol funding" on ONE multiplier (floor 0.65) and
  `:177-192` funds the garrison and the wall on another (floor 0.6), same shape,
  same input, so the court kept while the watch starves, or any of the four gates
  pointed against another, is F4-02 / F4-03; a TOTAL collapse of pay is F4-04
  (short, late and thin is the licensed extreme; men drifting off slowly is the
  model's own word per §R-9); and the pay gate DOES reach the watch, so denying
  that is F4-19. Floor 2 binds and this subject invites every row of it: no count
  of the heard, the charged, the fined, the sent away or the watch (F2-01 — a band
  word is the only licensed magnitude); no term, arrears, season or date (F2-02);
  no founding or raising of the hall or the courthouse, and no narrating that a
  gaol was never built or was pulled down (F2-03, F2-04); no event the record did
  not run — a trial held, a man exiled, a fine remitted, an officer dismissed
  (F2-04); no TREND and no reputation charted over time — ⭐ the pool's CURRENT
  spine 3 breaches this by name ("Each judgment {settlement} cannot enforce costs
  the next one a little of its weight, and the town's courts are spending down a
  reputation they cannot replace" — F2-08, and an `[unfolding]` stance tag that is
  none of the three); no elapsed course over a LIVE field (F2-05) — ⭐ BUT
  `hasCourtSystem`, `hasPrison`, `safetyLabel`, `guardEffectivenessDesc`,
  `scores.internal`, `compound.inst` and `economicGates.military` all carry ZERO
  writers under `src/domain/worldPulse/` (§6), so THE PERFECT AND THE DURATIVE ARE
  LICENSED OVER THEM: "nobody has been kept here overnight", "the town has never
  had a room for it", "no lock has ever been wanted on that door" are lawful
  sentences on this pool; and no RATE — "most nights", "every assize", "more often
  than not" (F2-06). Floor 3: no named character's fate (F3-01), nothing predicated
  of a deity (F3-02), and the row most likely to recur, NO CULTURAL FURNITURE THE
  TOWN'S PROFILE DENIES (F3-05, eleven profiles ship) — no churchyard, no market
  green, no thatch, and on this pool no assize, no shire, no borough-and-county
  apparatus, no ducking stool and no parish constable, all of which are
  north-European by construction and are exactly what a writer reaches for when
  writing a court. F3-06's rider is transcribed in §7 and is this pool's worst
  trap. Two placements the data states at one tier only bind as §2b′ prints them:
  "in the square" (the town's `Civic announcements`) and the burial placements at
  city. ⛔ Finally §2d and ruling 35: a face that would sit as comfortably on
  `full legal chain (court AND prison)` or on `no legal infrastructure` is a
  floor-1 finding — and because the court flag is AUTOMATIC at every preimage tier,
  ANY FACE WHOSE WHOLE CONTENT IS "THERE IS A COURT HERE" is that finding by
  construction. ⛔ And ruling 12: `{settlement}` may appear in at most one unit of
  the pool and never in a `[face]` sub-row; the pool's current rows name it in two
  of three spines.

================================================================================
(9) WHERE THE FLAVOUR IS
================================================================================

  WHAT IS IN USE. The machinery that DOES stand is unusually concrete and it is
  all printed: at city and metropolis a required watch that patrols, arrests,
  takes down reports and issues warrants, and required courthouses sorted into
  commercial, criminal and ecclesiastical work; at town a hall where commercial
  and civil disputes go before a magistrate, permits are applied for and taxes are
  paid over the same counter. Around the edges sit the things a coin may put on
  the roster and usually does not — a borough courthouse, a workhouse whose own
  description says the line between it and a prison is blurry — and the bodies
  that keep what the law here does not: the sexton's register, the guilds'
  arbitration among their own, the gate that can turn a man out and the road that
  takes him.

  WHAT IS IN DISPUTE. Every source on this page has a different answer to the same
  question — what happens to the person after he is taken up — and no two of them
  are answering from the same interest. The hall holds one purse for the watch,
  the court and a gaol that does not exist. The watch brings people in and hands
  them to a court that can name the wrong and not keep the man. The guilds, where
  they are seated, can reach a member's trade in a way the town's own sanction
  cannot, and know it. The gate is the only body that can actually carry out what
  is decided. The tavern knows which people a fine touches and which it does not,
  and the stranger is the one it touches least and worst. That disagreement is the
  session, and the archiver's job is to set two of them down and leave it open.

  WHAT THE ABSENCE LOOKS LIKE ON THE GROUND. It is not a ruin and not a scandal;
  it is a shape missing from a building that is otherwise complete. A chamber with
  a door that locks from the inside only. A bench outside it with nobody set to
  keep anyone on it. A man brought in at one door and leaving by the same one
  before the afternoon is out, with a sum named against him or a direction given.
  Nothing to point at when a stranger asks where such a person is held, and no
  local expectation that there should be. The strongest faces here are the ones
  that put a reader in a room and let them notice what is not in it.
