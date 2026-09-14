THE CARD (mechanical sections) — block DS-DEF-2 · pool `Invasion & War: militia only` · dir ds-def-2-invasion-war-militia-only

(1) THE KEY AND ITS PREIMAGE
  key function: INVASION_ROW_POOL (rung table) · site defense.threatAssessment
  census predicate: invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js) === no walls, citizen militia
  read walls          -> institutions[bucket=walls]               [LIVE-ROSTER] writers 38   (resolved through invasionRowPoolKey's call site in the entry point)
  read garrison       -> institutions[bucket=garrison]            [LIVE-ROSTER] writers 38   (resolved through invasionRowPoolKey's call site in the entry point)
  read militia        -> institutions[bucket=militia]             [LIVE-ROSTER] writers 38   (resolved through invasionRowPoolKey's call site in the entry point)
  the key FIXES: walls=false · garrison=false · militia=true   (invasionRowPoolKey, 1 combination(s))
  preimage on the 768-town rate grid: 27 towns (352 bp) — hamlet 14/128 · village 13/128
  silent tiers: thorp, town, city, metropolis

(2) THE REQUIRED ROWS (institutionalCatalog required: true) at every preimage tier — bodies a face may not deny or infer away
  hamlet (7): Access to parish church [Religious] · Burial ground [Religious] · Dwellings (17-80) [Infrastructure] · Water source [Infrastructure] · Access to external mill [Economy] · Subsistence farming [Economy] · Common grazing land [Economy]
  village (7): Multiple water sources [Infrastructure] · Dwellings (80-180) [Infrastructure] · Farmland [Economy] · Mill [Crafts] · Parish church [Religious] · Priest (resident) [Religious] · Graveyard [Religious]

(2b) WHAT A FACE MAY NOT DENY OF THE REQUIRED ROWS — the services the engine's own menu turns on at p ≥ 0.8, and the derivation that files the row
  Access to external mill (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Access to parish church (required at hamlet) — a face may not deny: Sunday mass (p 1) · Baptism (p 0.9) · Last rites (p 0.9) · Marriage ceremony (p 0.9) · filed under the `church` roster
  Burial ground (required at hamlet) — a face may not deny: Burial (p 1) · filed under no closed roster
  Common grazing land (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Dwellings (17-80) (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Dwellings (80-180) (required at village) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Farmland (required at village) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Graveyard (required at village) — a face may not deny: Burial (p 1) · filed under no closed roster
  Mill (required at village) — a face may not deny: Grain milling (p 1) · filed under no closed roster
  Multiple water sources (required at village) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Parish church (required at village) — a face may not deny: Life ceremonies (p 1) · Religious services (p 1) · filed under the `church` roster
  Priest (resident) (required at village) — a face may not deny: Life ceremonies (p 1) · Religious services (p 1) · filed under the `church` roster
  Subsistence farming (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  Water source (required at hamlet) — a face may not deny: (no service menu at or above the bar) · filed under no closed roster
  ⛔ A SERVICE AT OR ABOVE THE BAR IS A THING THE TOWN'S OWN MODEL SAYS THIS BODY DOES: denying it is floor 1, whatever the face is otherwise about. A row filed under `standing` is UNDER ARMS in the engine's reading even where the key fixes no garrison and no militia.

(2b′) THE OBSERVER'S AND THE PUBLIC'S LIST: what neither may claim to have seen
  Access to external mill (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Access to parish church (required at hamlet) — NOT SEEN is a claim about: Sunday mass · Baptism · Last rites · Marriage ceremony
  Burial ground (required at hamlet) — NOT SEEN is a claim about: Burial
  Common grazing land (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Dwellings (17-80) (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Dwellings (80-180) (required at village) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Farmland (required at village) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Graveyard (required at village) — NOT SEEN is a claim about: Burial
  Mill (required at village) — NOT SEEN is a claim about: Grain milling
  Multiple water sources (required at village) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Parish church (required at village) — NOT SEEN is a claim about: Life ceremonies · Religious services
  Priest (resident) (required at village) — NOT SEEN is a claim about: Life ceremonies · Religious services
  Subsistence farming (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
  Water source (required at hamlet) — NOT SEEN is a claim about: (no service menu at or above the bar)
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
    Burial ground: "at the edge" — stated only at hamlet — silent at village   [the catalog row]
        the data says: "A walled plot at the edge of the settlement, gated against livestock and kept by the households in turn."
  ⛔ A FACE DRAWS ON EVERY TOWN OF THE PREIMAGE, so a placement the data states only at the city is an INVENTION on the thorp (floor 2), and a hedged one is a tendency rather than this town's fact.

(2d) THE KEY'S SIBLING RUNGS — what this pool's key would have been had ONE of the fields it fixes been otherwise
    walls = false HERE
        walls = true -> `Invasion & War: walls with citizen militia`
    garrison = false HERE
        garrison = true -> `Invasion & War: force with NO walls`
    militia = true HERE
        militia = false -> `Invasion & War: neither walls nor force`
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
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:64  CAN CO-FIRE (predicate open)
      "No perimeter, but the charter hall provides specialist response for coordinated threats. Creatures that get past initial response reach homes directly."
      when: threat === 'plagued'  AND  !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  hasCharter
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:70  CAN CO-FIRE (predicate open)
      "embattled region with no organized defense and no perimeter. Survival depends on terrain, luck, and the ability to flee. This settlement is in extreme danger."
      when: threat === 'plagued'  AND  !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  !(hasCharter)  AND  !(hasWalls)  AND  !(hasGarrison)
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:86  CAN CO-FIRE (predicate open)
      "Active frontier with ${?1} but no perimeter. Defense is reactive. Attackers choose the point of engagement. Adequate for routine threats; exposed to anything coordinated."
      when: !(threat === 'plagued')  AND  threat === 'frontier'  AND  !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  hasGarrison || hasMilitia
      ${?1} when hasGarrison: "a garrison"
      ${?1} when !(hasGarrison): "a militia"
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:96  CAN CO-FIRE (predicate open)
      "Safe heartland with minimal creature activity. Existing defenses are appropriate. The primary threats here are internal."
      when: !(threat === 'plagued')  AND  !(threat === 'frontier')  AND  !(hasWalls && hasGarrison)  AND  hasWalls || hasGarrison || hasMilitia || hasCharter
  • [buildThreatAssessment -> mil] src/domain/display/threatAssessment.js:123  FIRES ON EVERY PREIMAGE TOWN
      "Armed citizens who know their ground. Effective against disorganized raiders. No counter to a disciplined military force."
      when: !(hasWalls && hasGarrison)  AND  !(hasWalls && hasMilitia)  AND  !(hasWalls)  AND  !(hasGarrison)  AND  hasMilitia
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
  (excluded as contradicting the key: 14 strings)

(5) THE CLOSED ROSTERS THIS KEY DOES NOT FIX
  watch      OPEN — the key does not fix it and no required row seats it
  garrison   FIXED FALSE by the key
  militia    FIXED TRUE by the key
  mercenary  OPEN — the key does not fix it and no required row seats it
  charter    OPEN — the key does not fix it and no required row seats it
  walls      FIXED FALSE by the key
  gates      OPEN — the key does not fix it and no required row seats it
  granary    OPEN — the key does not fix it and no required row seats it
  hospital   OPEN — the key does not fix it and no required row seats it
  market     OPEN — the key does not fix it and no required row seats it
  hall       OPEN — the key does not fix it and no required row seats it
  court      OPEN — the key does not fix it and no required row seats it
  prison     OPEN — the key does not fix it and no required row seats it
  church     TRUE on every preimage town (a required row seats it at every preimage tier)   [hamlet: Access to parish church ; village: Parish church, Priest (resident)]
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
  hamlet: the hall: — · the tavern: — · the guilds: — · the register (parish): Access to parish church, Burial ground · the elders: —
  village: the hall: — · the tavern: — · the guilds: — · the register (parish): Parish church, Priest (resident), Graveyard · the elders: —
  the key on the force buckets and the gates: watch: OPEN · garrison: FIXED FALSE by the key · militia: FIXED TRUE by the key · mercenary: OPEN · charter: OPEN · gates: OPEN

────────────────────────────────────────────────────────────────────────────────────────────
THE MARKER'S SECTIONS (seat: opus) — written against the instrument above. EVERY FIGURE BELOW
IS EXECUTED, not reasoned: `findTownsWhereKeyFires('DS-DEF-2', 'Invasion & War: militia only',
999)` returns exactly **27** towns, which is the rate row's own count (352 bp). All counts are
over those 27. Where a count and a habit disagree, the count governs.
────────────────────────────────────────────────────────────────────────────────────────────

(7) THE SPEAKER ROSTER

  ⛔⛔ READ THIS FIRST — THIS PREIMAGE IS ENTIRELY BELOW TOWN, AND IT IS THE POOREST PREIMAGE
  ON THE DESK. MEASURED: **hamlet 14 · village 13 · nothing else.** Every speaker habit carried
  over from the walled-garrison, walls-with-no-force and internal-security packets is wrong
  here, because those pools live at town and above. MEASURED over the 27:

      hasWalls 0/27 · hasGarrison 0/27 · hasWatch 0/27 · hasGates 0/27 · hasCourtSystem 0/27
      hasPrison 0/27 · hasGranary 0/27 · hasPort 0/27 · hasNavy 0/27 · hasWarehouse 0/27
      hasSmuggling 0/27 · hasMerchantGuild 0/27 · hasThievesGuild 0/27 · hasGangInfra 0/27
      hasMilitaryInst 27/27 · hasMilitia 27/27 · hasChurch 27/27 · hasMarket 14/27
      hasCharterHall 10/27 · hasMercenary 4/27 · hasMagicInst 2/27 · hasHospital 1/27

  ⭐⭐ **THE HALL IS NOT A SPEAKER. THE GUILDS ARE NOT SPEAKERS. THE WATCH IS NOT A SPEAKER.
  THE GATE IS NOT A SPEAKER.** The brief seats the hall, the tavern and the guilds "at town and
  above"; this pool never reaches town. There is no hall row at hamlet or village in the
  catalogue at all (F1-20: below town the governing institution is a CONSENSUS, not a room),
  no watch-bucket row below town (V-23, and `defenseInstitutionBuckets.js:95-97` seats the
  watch only on `town watch` / `city watch` / `professional city watch`), and no guild row.

  ⛔⛔ **AND THERE IS NO GATE — THIS IS THE EXACT INVERSE OF THE `walls with citizen militia`
  PACKET AND THE TRAP MOST LIKELY TO BE IMPORTED.** `priorityHelpers.js:53` sets `hasGates` off
  the substrings `gates · town walls · city walls · massive walls · palisade`. Every one of
  those except the bare word `gates` already carries a walls-bucket keyword, and the key fixes
  walls FALSE; the only two catalogue rows whose NAME carries `gate` are `Gates (if walled)`
  (`institutionalCatalog.js:1356`, a TOWN row) and `City walls and gates` (`:1910`, a CITY row),
  and neither tier is in this preimage. MEASURED: **`hasGates` 0/27.** On the sibling pool the
  palisade turns the flag ON and the gate is that packet's central hook; here there is no
  perimeter to have an opening in. `safetyProfile.js:463-464` prints the engine's own words for
  this state — "The lack of controlled entry points makes movement relatively easy; no gates to
  bribe and no checkpoints to avoid." A gate, a bar, a checkpoint, a toll, a person who holds
  the way through, a stranger who states his business at an entrance, a place that is shut at
  dusk: **all of it is F1-08 on this key.** There is no way through, because there is no wall
  for a way to pass through.

  ⭐⭐ AND THE ROSTER IS **ONE ROW WIDE**. Of every institution in the catalogue, EXACTLY ONE
  stands on all 27 towns:

      27/27  `Citizen militia`   — the whole of the force, the whole of the fabric, the whole
                                   of the civic apparatus this pool can lean on without a hedge

  Nothing else is a universal ROW. Not the church building (13/27), not the market (14/27), not
  a drinking house (24/27), not a smith (25/27), not even the water source or the dwellings by
  NAME (the tiers spell them differently: `Water source` 14 vs `Multiple water sources` 13;
  `Dwellings (17-80)` 14 vs `Dwellings (80-180)` 13). Four CLASSES are universal by union and
  are the writer's only other safe ground: a burial place 27/27, a mill of some kind 27/27, a
  church of some kind 27/27, and somebody who speaks for the place 27/27 — **and three of those
  four are traps, because at hamlet the thing is somewhere else or somebody else's.** See below.

  ── THE ENGINE'S OWN SENTENCE, WHICH IS THIS POOL ENTIRE ──
    `Citizen militia`  (`institutionVocabulary.js:153`, imported by the pool's own module)
      "Ordinary residents who drill and muster against local threats. Part-time soldiers with
       their own tools and no pay."
    catalogue, hamlet (`institutionalCatalog.js:335-341`)
      "Able-bodied residents drill and muster against local threats. Part-time service."
    catalogue, village (`:867-873`)
      "Organised community defense. Musters for raids and monster incursions. More reliable
       than hamlet levies."
  ⛔ THOSE THREE DECIDE MOST OF SECTION (8). **No pay. Their own tools. Ordinary residents.**
  And note the two tiers disagree in emphasis — the village row says "Organised", the hamlet
  row does not — so a face that predicates either disorder or drill-ground order of the muster
  is speaking for half the preimage.

  ── UNIVERSAL SPEAKERS (present, or seated by a p 1.0 service, on all 27) ──

  • ⭐⭐ **THE MUSTER** — `Citizen militia`, 27/27, the key's own read. Its one service
    `Emergency defense` is instantiated at p 1.0 on **27/27**: "Armed citizen response to
    external threats and raids." The class word "the muster" is free everywhere (F1-03), and so
    are "the turnout", "those who stand", "the households that turn out", "the people who come
    out when the horn goes".
    ⛔ **ITS INTEREST IS NOT A WAGE, BECAUSE IT HAS NONE.** V-09 is the sitting's own row on
    exactly this. The interest is **THE TURN, THE TIME AND THE TOOLS**: whose night it is, whose
    field goes unworked while he stands, whose own spear is being carried and whose own spear
    got broken, who never takes a turn and is still counted a neighbour. That is the grievance
    this pool has instead of arrears, and it is a better one, because it is owed to the man next
    door and not to a purse.
    ⛔ **AND IT KEEPS NO ROLL.** EXECUTED: `holdersOf('muster', s)` returns NOTHING on **27 of
    27**, because the muster kind's only qualifying service is `Muster training` and it is
    instantiated on ZERO of the 27. The holder table's own note (`holderTable.js:279-288`)
    predicted "men under arms and no roll of them"; here it is sharper than on any other pool —
    **this town IS the militia and still keeps no roll of itself.** A cited muster roll is
    F1-24 / §R-8 / V-01 here, and the writer will feel more entitled to it on this key than on
    any other on the desk. There is no roll.

  • ⭐ **THE HOUSEHOLDS, AND THEY ARE THE SAME PEOPLE AS THE MUSTER.** The militia IS the
    households — "Ordinary residents", "Able-bodied residents". The dwellings row is required at
    both tiers, the food-land classes (`Subsistence farming` / `Farmland` / `Common grazing
    land`) stand 27/27, and at hamlet the `Burial ground` is "kept by the households in turn"
    (`:308-312`) — the same rota logic on the other end of life. This is the pool's strongest
    collective speaker and it costs nothing to seat: the man who stands the night and the man
    whose barley is standing are one man.

  • ⭐ **SOMEBODY WHO SPEAKS FOR THE PLACE — 27/27 BY UNION, AND NEVER "THE HALL".** MEASURED:
    `Lord's steward` **11** · `Village reeve` **9** · `Informal elder consensus` **7**. Zero
    towns with no governance row; the three share `exclusiveGroup: 'government'`, so exactly one
    stands per town.
    ⛔⛔ **THE THREE ARE NOT INTERCHANGEABLE AND TWO OF THEM ARE OPPOSITES.** `Lord's steward`
    is a lord's agent who collects rents and enforces noble authority; `Informal elder
    consensus` is, in the catalogue's own words, "A **free** hamlet with **no lord's
    representative**" (`:274-281`). So "the lord's man" is FALSE on 16 of 27, "no lord's man
    here" is FALSE on 11, and "the elders decide it" is FALSE on 20. **Write the office as a
    person doing a thing, never as the town's settled constitution** — "whoever answers for the
    place", "the man who is asked first", "the one they send to" — or offer a face per band and
    tag it, which is what ruling 18 is for.
    ⛔ AND `holdersOf('elders')` is **0/27**: the elders keep no tradition record either
    (F1-22 — "the elders" as a BODY, and the consensus is not a room, F1-20).

  • **THE PUBLIC** (ruling 28) — the townsfolk as a whole, universal by definition and unusually
    apt here, because on this pool what everyone saw at once IS the subject: who came out, who
    did not, and how long it took. Keep candidates under NOTES until car 18n/28 lands.

  • **THE STRANGER** (always) — and well seated: `tradeRouteAccess` spans `port` 6 · `road` 4 ·
    `isolated` 4 · `none` 4 · `crossroads` 3 · `river` 3 · `mountain_pass` 3, so travellers
    reach 19 of 27 by a named way, and the stranger's stake is exactly the one this pool
    creates — **he is the person no one is posted to meet.** There is no gate to state his
    business at, and `safetyDesc` on 18/27 tells him "quieter spots after dark carry genuine
    risk". ⛔ But do not write the road as a universal: 8 of 27 are `isolated` or `none`, and
    `holdersOf('road')` is 0/27.

  • **THE ARCHIVER** (ruling 27, `[archiver · observed]`) and the observed face — kept under
    NOTES until car 18n lands. Section (2b′) of the instrument is the observer's bar; note that
    on this pool the observer may safely say **no soldier has been seen, no wall has been
    walked, nobody has been posted** (all three are key-fixed false on 27/27) and may NOT say
    nobody buries the dead, nobody grinds corn, no rite is said, or nobody answers for the place
    — all four of those are required-row classes standing 27/27.

  ── CONDITIONAL SPEAKERS (the field that seats each, MEASURED) ──

  • ⛔⛔ **THE PARISH / THE REGISTER — VILLAGE ONLY, 13/27, AND THIS IS THE SITTING'S OWN NAMED
    FAILURE MODE.** The instrument's own section (7) seats "the register (parish)" at BOTH
    tiers off `Access to parish church` + `Burial ground`. **§V GOVERNS AND CORRECTS IT:** V-29
    lists "the parish register at a hamlet whose church is 2–5 km away (F1-11)" as a floor-1
    row by name. MEASURED: the `Parish church` BUILDING stands on **13/27** (the villages) and
    `Priest (resident)` on the same 13; on the 14 hamlets the required row is `Access to parish
    church` — "**Travel to village church. 2-5km distance typical.**" (`:300-307`) — and the
    hamlet `Burial ground` row says in the engine's own hand "**The rite is held when a priest
    comes through, and the burial itself does not wait for one.**" So on 14 of 27 towns THE
    CHURCH IS IN ANOTHER SETTLEMENT AND NO CLERGY LIVES HERE, while `hasChurch` reads TRUE on
    all 27 and the service menu (Sunday mass, Baptism, Last rites, Marriage) sits at or above
    the bar on all 27. **Both directions are floor 1 on a face that draws across the preimage:**
    "a priest lives here" is false on 14, "no priest ever comes" is false on 27, "there is no
    church" contradicts the flag on 27, "the church stands at the middle of the place" is false
    on 14. The lawful shape is the VISIT and the WALK — a priest who comes through, a burial
    that does not wait, a service that is a journey — which is the engine's own text on both
    tiers and is far better flavour than a register.
    ⛔ AND EVEN AT VILLAGE THERE IS NO REGISTER: `holdersOf('parish')` is **0/27**. The parish
    register may not be CITED anywhere on this pool (F1-24). Say "a priest", "whoever says the
    words", "the sexton" only where a face is village-tagged — never "the parish register".

  • **A DRINKING HOUSE — 24/27, NOT universal.** `Alehouse` 16 (hamlet) · `Ale house` 11
    (village) · `Wayside inn` 12 · `Travelers' inn` 12 · `Caravanserai` 2; union 24. Three towns
    have nowhere to drink. The brief seats "the tavern" at town and above, and the class word
    here should be the roster's own: **the alehouse**. Its stake is the safety label and who
    turns out; it is the only place on this pool where the town argues in public.

  • **THE MARKET — 14/27** (`Weekly market` 10 · `Periodic market` 4 · `Fish market` 7 by
    union 14 on the flag). `holdersOf('market')` 0/27; `holdersOf('treasury')` resolves on only
    **6/27**, all six to `Weekly market`. F1-10 binds: the market is a body on barely half this
    preimage and keeps no book on any of it. Note the `Periodic market` row's own words —
    "**No charter. Just habit, proximity, and a flat piece of ground.**"

  • **THE CHARTER HALL — 10/27** (`Adventurers' charter hall`, `:325` hamlet / `:837` village).
    Real on this preimage, and it changes the same-page machine text: `threatAssessment.js:64`
    fires the charter-hall branch on the `plagued` towns that carry it. Conditional, tagged.
    ⚠ F1-06's ground line reads "no garrison or charter row exists at hamlet/village" — its own
    two citations `:325` and `:837` ARE the hamlet and village charter rows, and the flag
    measures 10/27, so read the row as barring the charter on the 17 that lack it, not as
    denying the row's existence at these tiers.

  • **A MERCENARY PRESENCE — 4/27** (`Veteran's lodge`, the village row `:884`: "A drinking hall
    where retired soldiers and mercenaries gather. Informal security, bar brawls, and the
    occasional job offer"). ⛔ F1-05 still bars a mercenary **COMPANY**; what stands here is a
    lodge with old soldiers in it, which is a far better hook on a pool whose whole subject is
    that nobody here has ever stood in a line.

  • **AN ARMS-MAKER — 25/27** (`Blacksmith` / `Resident smith (part-time)` / `Bowyer &
    fletcher` 11/27). The bowyer is the sharpest conditional speaker on the pool: he is the one
    person whose trade is the militia's tools, on a force that supplies its own.

  • **A MILL — 27/27 BY UNION AND A TRAP LIKE THE CHURCH.** `Mill` (required, village) 13 ·
    `Access to external mill` 20. F1-15 and the row's own text: at hamlet the corn goes to the
    manor mill, somewhere else. A miller is a speaker at village; at hamlet the speaker is the
    person who makes the journey.

  • Others, all tagged and none above a third: `Midwife` 5 · `Apothecary` 11 · `Hedge wizard` 2 ·
    `Druid Circle` 2 · `Healer (divine, 1st level)` 1 · `Village scribe` **1/27** (so a written
    hand is all but absent even as a person) · `Toll bridge` 2 (⛔ and a toll BRIDGE is not a
    toll bar — F1-21, and `holdersOf('toll-bar')` is 0/27).

  ── THE NAMED OFFICES A SPEAKER MAY NEVER BE (floor 3, F3-06; `npcGenerator.js:1511-1537`) ──
  MEASURED over the 27 NPC rosters: **`Parish Priest` 15 · `Elder` 14 · `Mayor` 13 · `Guard
  Captain` 13** — the tier mandate is `hamlet: ['Elder', 'Parish Priest']` and `village:
  ['Mayor', 'Guard Captain']`, so the Elder and the Parish Priest are on every hamlet and the
  Mayor and the Guard Captain on every village. Plus, by stress: `Garrison Commander`,
  `Healer`, `Guild Master`, `Moneylender`, `Chief Magistrate`, `Council Member`, `Corrupt
  Official`, `Retired Adventurer`. None of these may act, decide, be blamed or be quoted in a
  face; they are on the next tab with a personality and a secret.
  ⭐⭐ **AND THE GUARD CAPTAIN IS THE FLOOR-1-BY-INFERENCE TRAP OF THIS POOL.** Every one of
  the 13 villages emits a `Guard Captain` NPC on a town with no walls, no garrison and no watch
  — he commands the citizen militia and nothing else. **So "nobody is in charge of them",
  "there is no one to give the order", "they answer to nobody", "no one has ever been put over
  them" is FALSE on 13 of 27 towns**, and it is precisely the sentence this key invites. The
  same shape at hamlet: an `Elder` and a `Parish Priest` stand on all 14, so "nobody speaks for
  the place" and "no priest is ever here" are false there.
  ⚠ WIRING, NOT A FACE CHARGE: a `Watch Captain` NPC is minted on **4/27** towns with
  `hasWatch` false, and `safetyProfile.js:183` prints "The watch is uncertain whose orders to
  follow" on the 1 succession-void town. This is the W-19 / W-22 family (`governanceNarrative.js`
  minting a guard where no force row exists). A face may not lean on it; a refuter may not
  charge a face for it.

(8) WHAT WOULD BE FALSE

  Begin where the engine begins, with the one row this pool universally holds and the one
  sentence it prints about it, because between them they kill every hook a writer arrives
  carrying from the pools above town. **THE MUSTER HAS NO PAY** — `institutionVocabulary.js:153`
  reads "Part-time soldiers with their own tools and no pay", and V-09 is the sitting's own
  reversal keeping "no wage, pay or arrears predicated of a `Citizen militia` / `Household levy`"
  as a floor-1 finding — so "the muster is paid late", "the wage is short", "they are owed for
  the winter", "the purse that pays them runs thin", "nothing has reached them since the
  spring" are ALL contradictions here, and they are the walled-garrison packet's central hook
  imported wholesale: on that pool the wage IS the flavour, on this one **there is no wage to be
  short**, and F4-02's split purse cannot even arise because there is no second thing to pay for.
  **THEIR TOOLS ARE THEIR OWN** — so an armoury, a town store of arms, issued spears, a rack by
  the door, a stand of weapons anybody hands out, is an invention against the row's own words.
  **AND THERE IS NO PERIMETER AND NO WAY THROUGH** — `hasWalls` and `hasGates` both 0/27, so a
  wall, a bank, a palisade, a stockade, a ditch, a line, a circuit, a gate, a bar, a
  checkpoint, a toll, a stair, a walk, a place the town is shut at night, and **anybody posted
  at an entrance**, are F1-07 and F1-08 on every town of this preimage; `safetyProfile.js:463`
  prints the engine's own reading of the state, "no gates to bribe and no checkpoints to avoid".
  **NOTHING ON THIS POOL IS WRITTEN DOWN, AND THIS IS THE HARDEST BAR ON THE CARD** (ruling 40,
  F1-24, §R-8, V-01): EXECUTED over the 27, **every record-holder kind resolves to NOBODY** —
  `muster` NONE 27/27, `parish` NONE 27/27, `toll-bar` NONE 27/27, `census` NONE 27/27, `court`
  NONE 27/27, `market` NONE 27/27, `watch` NONE 27/27, `elders` NONE 27/27, `road` NONE 27/27,
  `tradition` NONE 27/27, `office` NONE 27/27, with `treasury` resolving on only 6 (all to
  `Weekly market`). **NO NAMED RECORD MAY BE CITED ANYWHERE ON THIS POOL** — not the muster roll
  (the militia is here and still keeps none, and this key will tempt the writer harder than any
  other), not the parish register, not the toll book, not the accounts, not the returns, not
  "the books". Every account names its source through a ROLE. Then the bodies the roster denies
  outright, measured FALSE on 27/27 and each with a same-page machine sentence firing beside the
  face: a garrison, soldiers of the town's own, a professional or full-time guard, a standing
  rotation (F1-02, F1-04, V-27, V-30 — and `threatAssessment.js:123` prints "Armed citizens who
  know their ground. Effective against disorganized raiders. **No counter to a disciplined
  military force.**" on 27/27); a watch, a night patrol as a body, "the watch" in any
  possessive (F1-01, V-02, V-23); a court, a trial, a sentence, a magistrate, a gaol, cells,
  stocks (F1-12, F1-13 — and `guardEffectivenessDesc` prints "**Without courts or prison,
  enforcement relies entirely on fines, exile, or summary violence**" on 27/27 and
  `threatAssessment.js:151` "No legal infrastructure: order relies on force alone"); a granary,
  a store, a reserve, provisioning for a siege (F1-09, no granary row exists below town at all,
  and the Disasters row prints "No food reserves. A crop failure or supply disruption causes
  immediate hardship." on 27/27); a warehouse or yard (F1-19); a merchant or craft guild, a
  guildhall (F1-16); smuggling as an activity (F1-24's neighbour, `hasSmuggling` 0/27); the sea,
  a harbour, ocean traffic (F1-18, `hasPort` 0/27 though `tradeRouteAccess` reads `port` on 6 —
  the access is a route, not a body); and a HALL, a chamber, a council room, a long table, a
  place the town's business is done in (F1-20 — below town the governance row is a consensus or
  one man, never a room). **NOW THE NEGATION DIRECTION, WHICH IS WHERE THIS RE-CUT ACTUALLY
  FAILS** (F1-25, and the sitting's own one-sentence finding): the same page carries
  `guardEffectivenessDesc` identically on **27/27** — "The citizen militia musters when needed
  but cannot maintain consistent patrol. Volunteers with other work to do; reliable in a crisis,
  absent during routine crime." — and `safetyDesc` on 18/27 — "Militia volunteers patrol the
  main paths; quieter spots after dark carry genuine risk." So "nobody is set up to respond",
  "nothing here is organised", "there is no one who would come", "no one has ever been put over
  them", "the town has no answer of any kind" are floor-1 negations of printed rows, and the
  Guard Captain on 13/27 and the Elder on 14/27 deny the command half by a required NPC row.
  Going the other way, "the muster holds the ground", "the turns are well kept", "they patrol
  reliably", "they would stand against a company" are the OPPOSITE floor-1 error against the
  same two sentences. **The lawful band is exactly those sentences' own shape and nothing
  wider: turnout in a crisis, absence in the routine, competence on their own ground, nothing
  at all against a disciplined force.** On floor 2, this pool's live reads are the three
  institution buckets (`institutions[bucket=walls|garrison|militia]`, 38 writers each, LIVE) so
  an elapsed course over the FORCE is refused — no "has stood", "still", "no longer", "again",
  "thinner than it was" (F2-05, and V-04 permits a thinning muster only as a STANDING state:
  "the muster is thin", "posts stand unfilled") — while the perfect and durative ARE licensed
  over the key's own reads and over the frozen fields the instrument lists (`safetyLabel`,
  `guardEffectivenessDesc`, `scores.military`, `economicGates.military`, `config.monsterThreat`,
  `stress`, `structureKey`, every `defenseProfile.institutions.*`), so "nobody has been asked to
  stand at a wall here" is lawful and "the muster has thinned since the winter" is not; and no
  count, share, distance or duration in digit or word (F2-01, F2-02, F2-06) — **not "the walk to
  the church is two miles", which the hamlet row states and a face may not restate as a
  magnitude**, and not a rate on how often they turn out. On floors 3 and 4: F3-05's eleven
  culture profiles bind as §V.0 states them, so thatch, the churchyard, the market green and the
  whole north-European village kit are refused on a face drawing across the preimage (⚠ NOT
  MEASURED — the probe read no culture field off these 27; the writer treats F3-05 as binding on
  its own authority, not on a count from this card). What IS measured is the TERRAIN, and it
  bars the same furniture independently: `riverside` 7 · `hills` 6 · `coastal` 5 · `forest` 5 ·
  `desert` 2 · `mountain` 1 · `plains` 1 — so woods, snow, a river, a shore or a hillside are
  each false on most of the preimage and none of them may be baked into a face; 8 of 27 carry a
  stress (`wartime` 2,
  `monster_pressure` 2, `under_siege` 1, `plague_onset` 1, `religious_conversion` 1,
  `succession_void` 1, `infiltrated` 1) so "nothing has ever come here" is false on those and
  F2-04 bars narrating any event on the other 19; `plagued` is MONSTERS not disease (F4-05); no
  decay clock and no permanence on any fabric (F4-01) — which on this pool mostly means **do not
  reach for a ruined or fallen wall to explain why there is none**, since the record says there
  never was one; and the covert table's three sources (hall, watch, court) are all absent here,
  so **no `compromised` face may be offered on this pool at all** and the tag would be refused.

(9) WHERE THE FLAVOUR IS

  • **WHAT IS IN USE: the turn, and the tools that are somebody's own.** The only body this pool
    universally holds is a force that is also the farmers, arming itself out of its own sheds
    and standing its nights out of its own time. The concrete particulars are a man's own spear
    and his own billhook, whose night it is, whose barley stands unreaped while he stands, the
    horn or the bell that calls them (the service is `Emergency defense`, "armed citizen response
    to external threats and raids"), and the bowyer on 11 of 27 who made half of what they carry
    and is owed for some of it. This is a pool about TIME AND TOOLS, never about coin, because
    there is no coin in it.

  • **WHAT IS IN DISPUTE: who turns out, and what the turning out is worth.** The page prints
    both halves of the argument itself — they are reliable in a crisis and absent in the routine
    — so the town's real quarrel is about the gap between those, and it has three or four
    genuinely opposed parties already seated: the households who come out against the ones who
    never do; the man who answers for the place (a lord's steward on 11, a reeve on 9, a free
    hamlet's consensus on 7 — and the steward's interest is his lord's, not the town's) against
    the people whose time he is spending; the alehouse on 24, where the counting of who came out
    actually happens; and a `Veteran's lodge` on 4, where men who HAVE stood in a line watch men
    who have not. Nobody here can settle it by producing a document, because **nothing is written
    down** — which makes every dispute on this pool a matter of what people remember and who is
    believed, and that is the best thing this key gives a game master.

  • **WHAT THE ABSENCE LOOKS LIKE ON THE GROUND: an open place, and a walk.** There is no line
    around this town and no opening in one — a road simply arrives, and nobody is posted where
    it does; a stranger is not stopped, asked, or written down, and 18 of 27 towns tell him the
    quiet corners after dark are his own risk. The other absence is the WALK: on the 14 hamlets
    the church is two to five kilometres off and the corn goes to somebody else's mill, so the
    rite waits until a priest comes through and the burial does not wait for the rite, and the
    town buries its own in a plot the households keep in turn. A place that can raise every
    able-bodied adult in an afternoon and cannot produce a single sheet of paper, a wall, a cell
    or a resident clergyman is not a poor version of a town — it is its own thing, and the
    dossier should read like it.
