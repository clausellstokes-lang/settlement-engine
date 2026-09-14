# CARD — DS-DEF-1 · pool `readiness STRONG` · marker seat: opus

*Sections (1)–(6) below are the verbatim output of the instrument, run in the dock:*
`node scripts/prose-mark-card.mjs DS-DEF-1 'readiness STRONG'` *(laneRW-DEF1, 2026-09-14). Sections (7), (8) and (9) are the marker's.*

---

THE CARD (mechanical sections) — block DS-DEF-1 · pool `readiness STRONG` · dir ds-def-1-readiness-strong

(1) THE KEY AND ITS PREIMAGE
  key function: READINESS_ROW_POOL (rung table) · site defense.postureHeader
  census predicate: scoreBand(readinessScore) (via READINESS_ROW_POOL in defenseStateProse.js) === STRONG
  read readinessScore -> defenseProfile.readiness.score           [SNAPSHOT] writers 0   (resolved through posturePoolKey's call site in the entry point)
  the key FIXES: readinessScore:range=[65,100] · leaves OPEN: readinessScore   (posturePoolKey, 36 combination(s))
  preimage on the 768-town rate grid: 193 towns (2513 bp) — town 27/128 · city 64/128 · metropolis 102/128
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
    (none: no covert field of the engine marks a symptom pool on this block, so no face of this block may carry the `compromised` tag)
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
  court      OPEN — required only at town, city; open at metropolis   [town: Town hall ; city: City hall, Multiple courthouses]
  prison     OPEN — the key does not fix it and no required row seats it
  church     OPEN — required only at town, city; open at metropolis   [town: Parish churches (2-5) ; city: Parish churches (10-30)]
  ⚠ `court` is hasCourtSystem and its keyword list includes 'town hall' and 'city hall': a required Town hall seats a court in the engine's model.

(6) THE FROZEN FIELDS (writers under src/domain/worldPulse/, field grain)
  defenseProfile.readiness.score                       writers  0  FROZEN [SNAPSHOT]
  name                                                 writers 201  LIVE   [PULSE]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulse.js:1312, src/domain/worldPulse/applyWorldPulseOccupationAuthority.js:164, src/domain/worldPulse/applyWorldPulsePrimitives.js:38, src/domain/worldPulse/brokeragePatronage.js:178 … +197
  config.monsterThreat                                 writers  0  FROZEN [CONFIG]
  institutions[bucket=walls]                           writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=garrison]                        writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
  institutions[bucket=militia]                         writers 38  LIVE   [LIVE-ROSTER]  ⚠ root-grain (one segment)  src/domain/worldPulse/applyWorldPulseFactionRoster.js:146, src/domain/worldPulse/blockadeTransport.js:72, src/domain/worldPulse/calamityKernel.js:290, src/domain/worldPulse/calamityKernel.js:399 … +34
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
  the key on the force buckets and the gates: watch: OPEN · garrison: OPEN · militia: OPEN · mercenary: OPEN · charter: OPEN · gates: OPEN

---

# (7) THE SPEAKER ROSTER

## ⛔ (7.0) THE MARKER'S CORRECTION TO SECTIONS (2), (2b), (5) AND (7) — READ THIS BEFORE THE ROSTER

The mechanical sections read the `metropolis` block of `src/data/institutionalCatalog.js` RAW. The product does not. `src/generators/steps/assembleInstitutions.js:244` builds the metropolis catalogue as `mergeCatalogs(institutionalCatalog['city'], institutionalCatalog['metropolis'])`, and `mergeCatalogs` (`:117-124`) is a shallow per-category spread — so **every `required: true` row of the CITY carries at metropolis unless a metropolis row of the same NAME overrides it.** Executed against the two blocks, exactly one does: `Daily markets` (metropolis `institutionalCatalog.js:2468-2474`, `required: false`, `baseChance: 0`, desc "Superseded at metropolis scale."). `Massive walls and fortifications`, `Multiple garrisons`, `Parish churches (50-100+)`, `State granary complex`, `Multiple court buildings` and `Advanced water infrastructure` are all DIFFERENT names carrying `required: false`, so they override nothing.

**The metropolis's required rows are therefore the city's thirteen survivors plus `Cemetery network`** — not the one row section (2) prints. Both directions change:

- Section (5)'s `OPEN … open at metropolis` on **watch · garrison · walls · gates · granary · market · hall · court · church** is an ARTEFACT of the raw read. Those bodies are required at CITY **and** at METROPOLIS. Only **town** leaves them open.
- The rosters therefore stay **OPEN across the preimage as a whole** — a face draws on the 27 town rows too, so a baked wall, gate or garrison word is still an invention and section (5)'s verdict is right where it matters most. But **the NEGATION direction is transformed**: denying walls, gates, a garrison, a professional watch, a hall, a court, parish churches, a granary or a market is floor 1 (**F1-25**, and **F1-28** by name) on **166 of this pool's 193 towns**, not on 64.

⚠ The one escape hatch, and it is not a licence: a user's `toggle.forceExclude` can strip a required row (`assembleInstitutions.js:279`) and a custom row is invisible to the flags. That is the **F1-30 / §1.4 W-03** custom-content class, whose standing disposition is *"write around an absence rather than asserting it"* and whose findings are WIRING. It does not license asserting the absence either.

## (7a) UNIVERSAL — the speakers a required row seats on EVERY town this pool can draw

| speaker | the required row that seats it (town / city / metropolis) | its interest, in one line |
|---|---|---|
| **the hall** — *'the hall', 'a clerk in the hall', 'at the hall they say'* | `Town hall` / `City hall` / `City hall` (all `required: true`) | It holds **the one military purse** — `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)` over the wall's keeping and the soldiers' wages TOGETHER (`defenseGenerator.js:182`, `:189-192`) — and `defenseProfile.economicGates.military` prints `Upkeep underfunded: … at N%` beside this very header at any value under 1 (`defenseDisplay.js:320`). On a STRONG town the hall's account is that the arrangement is affordable; its stake is that it is the body that has to keep affording it. |
| **the hall as the court** | the same rows: `hasCourtSystem` matches `'town hall'` and `'city hall'` (`priorityHelpers.js:55`) | The hall IS the court on this preimage, and `hasPrison` is seated by no required row anywhere on it — so the hall's recorded interest is fining and releasing, never holding (see F1-12/F1-13 at (8)). |
| ⭐ **the watch** — *'the watch', 'one of the watch', 'asked at the watch'* | `Town watch` / `Professional city watch` / `Professional city watch` (all `required: true`; both filed under `standing` in `deriveArmedForces`) | **THE FINDING THAT MOST CHANGES THE WRITING.** The standing brief seats the muster, the watch and the gate "only where the key fixes their seat" — and on THIS preimage a `required: true` row fixes the watch at every tier. The watch is a universal speaker here **and it is the only force that is.** Its interest: the pay gate reaches it (**F4-19**; `defenseGenerator.js:177-178`, `:189-191`; `fieldSynonyms.js:51` calls the gate *"the town's pay for its watch"*), so the watch's stake is the hall's purse seen from the other end. ⚠ **The two seats are different people**: town = *"Part-time guards. Night patrol and gate duty."*, city = *"Full-time law enforcement."* A face drawing on both may call them **neither** (F1-27). Write what the watch **does**, never what it **is**. |
| **the tavern** — *'at the tavern they say'* | `Taverns (5-20)` / `Inns and taverns (district)` / same | Keyed to the safety label and to who turns out: `economicState.safetyProfile.safetyLabel` and `safetyDesc` are FROZEN, print on this tab, and range from *"among the safest settlements in the region"* to *"Violence and theft are routine"* at values this key admits. The tavern's stake is trade — a town that feels safe is a town people drink in. |
| **the register of the dead** — *'the register', 'whoever keeps the ground'* | `Parish churches (2-5)` + `Parish burial grounds` / `Parish churches (10-30)` + `Burial grounds and charnel house` / those plus `Cemetery network` (whose menu carries `Central register`, p 0.9) | The one body on this preimage that counts what the arrangement did **not** prevent, and it is owed to nobody's purse. ⚠ never *'the priest'* (High Priest / Parish Priest are NPCs at every preimage tier) and never *'the sexton'* (42c). |
| **the market and its traders** — *'a trader at the market', 'at the market they say'* | `Market square` + `Weekly market` / `Multiple market squares` (+ `Daily markets` at city only) / `Multiple market squares` | The market pays the tax the hall spends — `Weekly market` carries the service `Tax collection` at p 0.9 — so traders feel the purse before the hall reports it. ⚠ the placement *'in the square'* is stated **only at town** (the `Civic announcements` service; section 2c), so it is an invention at city and metropolis: a face of this pool may put nothing *in the square*. |
| **the granary's keeper** | `Town granary` / `City granaries` / `City granaries` | The stores are what a defended town is defended FOR, and the same page prints *"Granary with road supply. Cut the roads, cut the supply."* beside a STRONG header at any non-port `tradeRouteAccess`. |
| **the stranger** | seated by nothing — a stranger needs no roster row | Only what is visible on arrival. ⭐ **Where most of this pool's safe flavour lives**, because a stranger may report an APPEARANCE without asserting the body behind it. ⚠ but bound by (2b′) on what it claims to have SEEN — and **never *'from the road'***: that string matches the PROVENANCE shape in `moveGrammar.js` and raised a shrink-only corpus ceiling once already (measured, batch 3). |
| **the households** | `Housing (180-1000)` / `Housing (1000-5000)` / same, plus `Multiple water sources` / `Aqueduct or water system` | The engine models them by name: `communityMilBase` is **exempt from the pay gate entirely** (`defenseGenerator.js:186-192`), so armed households are the part of a STRONG town's readiness that costs nothing and answers to nobody. |

## (7b) CONDITIONAL — the field that seats each, and where it is open

- **the garrison** — `Garrison` `required: true` at city and metropolis (*"Professional soldiers. Noble or royal."*, `institutionalCatalog.js:1925-1930`); **OPEN at town**. And at city/metropolis `Professional city watch` sits in the garrison bucket TOO (`defenseInstitutionBuckets.js:88-91` lists `'professional city watch'`), so §V.2's correction to **F1-29** holds: the watch and the garrison are two real rows at every city, and the contrast between them is refused only at town. A garrison face cannot be written for this pool, because the pool cannot tier itself away from town.
- **whoever holds the way through** — `hasGates` (`priorityHelpers.js:53`) fires on `City walls and gates` at city and metropolis; at town it needs a `Gates (if walled)` (baseChance 0.5) or a walls row. **OPEN at town** ⇒ no gate speaker, no toll, no bar at dusk, no gatehouse on this pool.
- ⚠ **the guilds** — `Craft guilds (5-15)` is `required: true` at **TOWN ONLY**. Every guild row in the city and metropolis blocks is `required: false`. **This is the opposite of the usual shape and it contradicts the standing brief line** (*"at town and above … the guilds"*): on THIS block the guilds are a town-only guarantee and are CONDITIONAL at city and metropolis (`hasGuild`, `priorityHelpers.js:57`).
- **the mills** — `Mills (2-5)` required at town only.
- **no required row at any preimage tier**, so all open: the hospital · the prison · the mercenary company · the charter hall · the port · the navy · the arcane · the warehouse (city+ only).

## ⛔ (7c) THE MUSTER DOES NOT EXIST ON THIS POOL — the sharpest single fact on this card

`Citizen militia` and `Town watch` share `exclusiveGroup: 'civilianDefense'` (`institutionalCatalog.js:1340-1354`) and `Town watch` is `required: true`. Required rows are placed FIRST and claim the group (`assembleInstitutions.js:282-293`); a later row in a claimed group is skipped unless it declares `exclusiveGroupCoexists` (`:345-346`), which the militia does not. **So no town of this preimage ever carries a Citizen militia.** The CITY Defense block has no militia row at all (`institutionalCatalog.js:1909-1937` — City walls and gates, Professional city watch, Garrison, Citadel), and the metropolis merge inherits that block, so neither does a city or a metropolis.

⇒ On every one of this pool's **193** towns: the muster is **not a body** (**F1-03**), a **muster roll has no holder** and citing it is a finding (**F1-24 / §R-8 / V-01**), and *"the muster would stand the wall tomorrow if the wall were paid for"* — the brief's own example of a muster's feeling — is **unwritable here**. Only the bare class word, predicated of nobody, survives. (The `toggle.require` / custom-row caveat at (7.0) applies and is not a licence: do not write the absence either.)

## (7d) THE NAMED OFFICES A SPEAKER MUST NEVER BE (`npcGenerator.js:1511-1537`; **F3-06** as §V.0 floor 3 amends it)

- **town**: Mayor · Guard Captain · High Priest
- **city**: Mayor · Guard Captain · High Priest · Wealthiest Merchant
- **metropolis**: Governor · **City Watch Chief** (not a Guard Captain) · High Priest · Guild Archmage · Wealthiest Merchant
- the key fixes no stress, so every `STRESS_MANDATORY_ROLES` office is live too: Garrison Commander · Healer · Guild Master · Corrupt Official · Council Member · Moneylender · Chief Magistrate · Retired Adventurer · Parish Priest.

⇒ **the union a face must avoid in the singular across this preimage**: the mayor / governor · the guard captain / watch chief · the high priest / parish priest · the wealthiest merchant · the guild archmage · the guild master · the healer · the moneylender · the chief magistrate · the corrupt official · the garrison commander · the council member · the retired adventurer. *A clerk in the hall*, *one of the watch*, *a trader at the market*, *whoever keeps the ground*, *a traveller* are all free — F3-06 reaches the singular OFFICE, not the unnamed person (W22a/W22b are struck).

---

# (8) WHAT WOULD BE FALSE

This key fixes ONE number and nothing else — `defenseProfile.readiness.score` ≥ 65, which `defenseGenerator.js:510` computes as `avgScore(military, monster, internal, economic, magical) + tierBonus − threatPenalty` — so nearly every trap on this card is a writer treating a high AVERAGE as a high anything-in-particular. **F4-06** is the pool's own row and the one a refuter finds first: the band is explained by nothing on the roster, it moves while every wall, gate and force row is unchanged, and `:491` hands a town +2 merely for being cheap to defend, so any face that explains the readiness BY THE WORKS ("the walls are why it holds", "a force this size is what keeps it") is false at the field; **F1-34** is the second, because a STRONG header invites *"nothing threatens the town"* while `threatAssessment.js:113-130` builds an `Invasion & War` row for every town and `settled` only multiplies threat DOWN — ease at the town's own grain is free, a totality of safety is not. Because the score is a MEAN, the same page can print `Economic base cannot support crisis response` (`threatAssessment.js:173`), `Chronic underfunding limits emergency response` (`:171`), `Irregular pay, worn equipment, morale risk` (`defenseDisplay.js:221`), `Upkeep underfunded: … at N%` (`:320`), `No food buffer. Any supply disruption becomes a survival crisis within days.` (`:245`), `Conventional defense only. Invisible threats go undetected and unanswered.` (`:227`), `No deterrence beyond force.` (`:233`) and — at `effectiveSafety < 0.6`, with the required watch and no garrison — `The watch is stretched far beyond its capacity.` or `The watch cannot respond effectively; reports are filed and forgotten.` (`safetyProfile.js:302`, `:313`) BESIDE a STRONG header, so a face asserting a responsive, well-paid, well-found, well-drilled or untroubled watch, a full purse, a stocked larder, or arrangements that are not strained is denied by a field at a value the key admits (floor 1 under §V.0's same-page quantifier, which is the whole test). On the rosters: **F1-07 / F1-08 / F1-02 / F1-05 / F1-06** — walls, gates, a garrison, a mercenary company and a charter hall are required at city and metropolis (the first three) or nowhere, and all are OPEN at TOWN, so a baked wall, circuit, rampart, gatehouse, toll, bar-at-dusk, garrison or company word is an invention on the 27 town rows of the preimage; **F1-25 / F1-28** run the other way and are now the likelier failure per (7.0) — denying a body that 166 of the 193 towns are REQUIRED to hold (no walls, no soldiers of the town's own, no court, no church, no market, no granary, *"nobody is set up to respond"*) is the same floor from the other side, and F1-28 names the city case by hand; **F1-03 / F1-24** — the muster and the muster roll are unwritable here for the reason at (7c), and a roll cited with no holder is the exact shape the sitting found the re-cut prose actually failing on; **F1-27** — never call the watch professional, full-time, drilled or soldiers, because on 27 of these rosters it is the part-time row; **F1-29 as §V.2 re-cuts it** — *"the garrison relieves the watch"* is two real rows at city and a false contrast at town, so the pair is unwritable across the preimage; **F1-26** — never a militia and a watch as two standing bodies; **F1-12 / F1-13** — the hall seats `hasCourtSystem` at every preimage tier but NO required row anywhere seats `hasPrison`, so a gaoling, a cell, a sentence, a gallows or a criminal trial is false wherever the prison rolls off, while a fine, a release and a court that has nowhere to hold anyone are the engine's own reading; **F1-32 / F1-33** — the wall MATERIAL is fixed by each row's own printed description (masonry at `City walls and gates`, stone at `Town walls`, stakes at a palisade) and a pooled key spanning them may name none of them, and the material's SOURCE is refused wherever a fortification chain runs; **F1-09 / F1-10 / F1-11 / F1-14 / F1-15 / F1-16 / F1-18 / F1-19** — granary, market, church, hospital, mill, guild, sea and warehouse each fire off a surprising row, so name what the body DOES and let the roster name the body; **F1-31** — never spell the tier and never spell the band word STRONG; **F1-126** — no minted proper name on a face that 193 towns draw. Floor 2 is decidable from the grammar alone and this key hands the writer almost nothing: **F2-01** no magnitude at all, in a digit or a word (*a handful*, *most of them*, *a dozen on the walk*), **F2-02 / F2-06 / F2-08** no date, season, duration, rate (*most nights*, *every spring*) or trend, **F2-03 / F2-04** no raising, building or first, and no event the record did not run, **F2-07** no age of fabric against the printed age — BUT this is a pool with an unusually WIDE floor-2b licence, because `defenseProfile.readiness.score` is the key's OWN read and carries ZERO writers under `worldPulse/` (section (6); §V.0 floor 2): the perfect and the durative ARE licensed over the readiness state itself and over the frozen reads section (6) lists — `config.monsterThreat`, `economicState.compound.inst.*`, `safetyLabel`, `guardEffectivenessDesc`, `scores.{military,monster,internal,economic,magical}`, `economicGates.*`, `stress`, `structureKey`, `config.tradeRouteAccess`, `foodSecurity.*` — and REFUSED over `institutions` and `institutions[bucket=*]` (38 pulse writers), over `name` (201) and over `defenseProfile.scores.disaster` (one writer, `foodStockpile.js:473`), so *"nobody has had to find out"* is lawful where *"the wall has stood since"* is not, and ⚠ the trap the instrument's own SEAM note flags: `standingDefenseForces` prints `writers 0` while reading `liveInstitutions(settlement)`, so it is frozen only in the census's grain and **a durative predicated of a FORCE or a BUILDING is refused**. Floor 3: **F3-05** the culture profile — eleven ship, none read by this block — bars thatch, the churchyard, the market green, hearth-smoke, a north-European village and snow on the road, and it is the chair's own "most likely to recur in every block"; **F3-06** the offices at (7d); **F3-01** no named character's fate; **F3-02** nothing predicated of a deity. Floor 4: **F4-02 / F4-03** ONE military purse and four gates that never split direction — never the wall kept while the wages fail, never the watch paid and the works not, never *"spending on repair rather than on holding"* (V-17); **F4-04** no total collapse of pay (short, late, thin — never none, never an emptied town), with V-04/§R-9's standing-state licence moot here because there is no muster to thin; **F4-19** the pay gate DOES reach the watch, so denying that is the finding, not asserting it; **F4-01** no material decay clock AND no permanence; **F4-05** `plagued` is MONSTERS, and the same page can print that the constant monster threat keeps the guard exceptionally well-drilled; **F4-07** the river and the coast do help the defence; **F4-08** `scores.magical` reads a WORLD, so a magical shortfall is never the town's own failing; **F4-13** no covert fact on a player face — and section (2c) reports this block marks **no covert symptom pool at all**, so **no `compromised` face may be offered on this pool** and the `compromised` tag is refused outright. Finally the header list's dead ends, so a refuter trained on the old law does not smuggle them back: *"the card does not license it"* is not a finding; the layer bar, the record-word bar, the citation budget, the always-safe spelling list, the person bar beyond floor 3 and the stance rules are struck — an unnamed clerk, officer, trader or traveller may act, refuse, keep a key and be resented, and the hall's accounts may be cited BY NAME because a hall is required at every preimage tier. The one live citation hazard is the measured one: **never spend a record this pool's shipped rows did not already carry** — the shipped four cite none — and never *"from the road"*.

---

# (9) WHERE THE FLAVOUR IS

**What is in use.** The one body under arms on every town of this pool is **the watch**, and the engine hands you its work as concrete nouns rather than adjectives: night patrol and gate duty at town, full-time law enforcement and a named `Crime reporting` service at city, and a pay gate that reaches it. The particular things are the hours it keeps, the round it walks, the door it tries, the report somebody files and what happens to the report — and at town, that the people walking it have day work. Beside it sit the two other things every town of this pool actually has: a hall that fines because it has nowhere to hold anyone, and a granary with a road behind it.

**What is in dispute.** The purse — and it is a genuine disagreement between speakers who are all telling the truth. `defenseProfile.economicGates.military` prints `Upkeep underfunded` as a percentage beside this header; `defenseDisplay.js:221` prints the same number as *Full pay* / *Adequate upkeep, some shortfalls* / *Irregular pay, worn equipment, morale risk*; the hall holds it, the market traders pay the tax that fills it, and the watch is paid out of it. Three accounts of one number: the hall's that it is affordable, the market's that it is already paid for, the watch's that it arrives late. **That is the disagree pair this pool is built for**, it is symmetric, and neither side is lying — which is exactly what makes it a session rather than a verdict.

**What the absence looks like on the ground.** A STRONG town is a town that has not been tested, and the score is a MEAN, so the absence is always a SPECIFIC arm sitting low under a confident header: a larder with only a road behind it, a page that says conventional defense only, a court with no cell, quiet at the gate because nothing came rather than because anything was stopped. The safe and vivid shape for this pool is **a thing not being used** — a stair with stores stacked on it, a muster ground bigger than anything that musters on it, a bell with no cause to ring, a key nobody has asked for. ⭐ And the shipped four faces are the counterexample the rewrite exists to replace: all four are a verdict about the town as a whole, in the archiver's bare voice, with no source, no stake, and a second clause explaining the first (*"and the reason is not complacency"*, *"and the absence is not luck"*). The whole job on this pool is to put a person with something to lose in front of each of those facts.
