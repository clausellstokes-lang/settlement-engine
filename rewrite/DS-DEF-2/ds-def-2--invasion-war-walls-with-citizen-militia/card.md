THE CARD (mechanical sections) — block DS-DEF-2 · pool `Invasion & War: walls with citizen militia` · dir ds-def-2-invasion-war-walls-with-citizen-militia

(1) THE KEY AND ITS PREIMAGE
  key function: INVASION_ROW_POOL (rung table) · site defense.threatAssessment
  census predicate: invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js) === walls, citizen militia
  read walls          -> institutions[bucket=walls]               [LIVE-ROSTER] writers 38   (resolved through invasionRowPoolKey's call site in the entry point)
  read garrison       -> institutions[bucket=garrison]            [LIVE-ROSTER] writers 38   (resolved through invasionRowPoolKey's call site in the entry point)
  read militia        -> institutions[bucket=militia]             [LIVE-ROSTER] writers 38   (resolved through invasionRowPoolKey's call site in the entry point)
  the key FIXES: walls=true · garrison=false · militia=true   (invasionRowPoolKey, 1 combination(s))
  preimage on the 768-town rate grid: 79 towns (1029 bp) — hamlet 36/128 · village 43/128
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
    walls = true HERE
        walls = false -> `Invasion & War: militia only`
    garrison = false HERE
        garrison = true -> `Invasion & War: walls AND professional garrison`
    militia = true HERE
        militia = false -> `Invasion & War: walls with NO force`
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
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:59  CAN CO-FIRE (predicate open)
      "Palisade and citizen militia provide a viable but demanding posture in an embattled region. Watch rotations are thin. Simultaneous incursions will break coverage. ${?1}"
      when: threat === 'plagued'  AND  !(hasWalls && hasGarrison)  AND  hasWalls && hasMilitia
      ${?1} when hasCharter: "Charter hall provides specialist backup."
      ${?1} when !(hasCharter): "No specialist monster hunters."
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:80  CAN CO-FIRE (predicate open)
      "Palisade and militia are standard frontier resilience. Effective against most creature threats, strained by simultaneous incursions. ${?1}Honest posture for a frontier settlement."
      when: !(threat === 'plagued')  AND  threat === 'frontier'  AND  !(hasWalls && hasGarrison)  AND  hasWalls && hasMilitia
      ${?1} when hasCharter: "Charter hall provides specialist backup. "
      ${?1} when !(hasCharter): ""
  • [buildThreatAssessment -> mon] src/domain/display/threatAssessment.js:96  CAN CO-FIRE (predicate open)
      "Safe heartland with minimal creature activity. Existing defenses are appropriate. The primary threats here are internal."
      when: !(threat === 'plagued')  AND  !(threat === 'frontier')  AND  !(hasWalls && hasGarrison)  AND  hasWalls || hasGarrison || hasMilitia || hasCharter
  • [buildThreatAssessment -> mil] src/domain/display/threatAssessment.js:117  FIRES ON EVERY PREIMAGE TOWN
      "Walls with citizen militia: credible deterrence against raiders, inadequate against any professional force with siege capability."
      when: !(hasWalls && hasGarrison)  AND  hasWalls && hasMilitia
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
  (excluded as contradicting the key: 15 strings)

(5) THE CLOSED ROSTERS THIS KEY DOES NOT FIX
  watch      OPEN — the key does not fix it and no required row seats it
  garrison   FIXED FALSE by the key
  militia    FIXED TRUE by the key
  mercenary  OPEN — the key does not fix it and no required row seats it
  charter    OPEN — the key does not fix it and no required row seats it
  walls      FIXED TRUE by the key
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
THE MARKER'S SECTIONS (seat: opus) — written against the instrument above, every figure below
EXECUTED over the key's own 79-town preimage via `findTownsWhereKeyFires('DS-DEF-2', 'Invasion
& War: walls with citizen militia', 999)` (returns exactly 79 = the rate row's own count).
────────────────────────────────────────────────────────────────────────────────────────────

(7) THE SPEAKER ROSTER

  ⛔⛔ READ THIS FIRST: THIS PREIMAGE IS ENTIRELY BELOW TOWN. hamlet 36 · village 43 · nothing
  else. Every habit carried over from the walled-garrison and walled-no-force packets is wrong
  here, because those pools live at town, city and metropolis. MEASURED on the 79: **ZERO hall
  rows. ZERO guild rows. ZERO watch rows. ZERO garrison rows. ZERO market-as-a-body on 33 of
  79.** The hall, the guilds and the watch are NOT speakers on this pool and never will be —
  the brief seats them "at town and above", and this pool never reaches town.

  ⭐⭐ AND THE ROSTER IS TWO ROWS WIDE. Of every institution in the catalogue, EXACTLY TWO stand
  on all 79 towns:
      79/79  `Citizen militia`        — the whole of the force
      79/79  `Palisade or earthworks` — the whole of the fabric
  Nothing else is universal. Not the church building, not the priest, not the mill, not the
  market, not the smith, not the tavern. A face draws on every town of the preimage, so ONLY
  these two rows and the flags below may be leaned on without a hedge.

  ── THE ENGINE'S OWN TWO SENTENCES, which are this pool entire (`institutionVocabulary.js`
     :153, :155, imported by `defenseStateProse.js` — the pool's own module) ──
    `Citizen militia`        "Ordinary residents who drill and muster against local threats.
                             Part-time soldiers with their own tools and no pay."
    `Palisade or earthworks` "A wooden palisade or earthen bank thrown up to slow raiders and
                             beasts. Rough defence for a place that cannot afford stone."
  ⛔ THOSE TWO SENTENCES DECIDE MOST OF SECTION (8). No pay. Their own tools. Cannot afford
  stone. Each is a field that DENIES the sentence a writer reaches for by reflex.

  ── UNIVERSAL SPEAKERS (present, or seated by a p 1.0 service, on all 79) ──

  • ⭐ THE MUSTER — `Citizen militia`, 79/79, the key's own read. Its service `Emergency
    defense` is on at p 1.0 on all 79: "Armed citizen response to external threats and raids."
    ITS INTEREST IS NOT A WAGE, BECAUSE IT HAS NONE. It is the TURN, the TIME and the TOOLS:
    who stands, whose night it is, whose field goes unworked while he stands, and whose own
    spear is being carried. The class word "the muster" is free; so are "the turnout", "those
    who stand", "the households that turn out".
    ⛔ AND IT KEEPS NO RECORD. EXECUTED: `holdersOf('muster', s)` returns NOTHING on 79 of 79,
    because the muster's only qualifying service `Muster training` is `on: false, p: 0.5`
    (`institutionServices.js:837`) and instantiated on ZERO of the 79. The holder table's own
    note (`holderTable.js:279-288`) predicted a garrison town with "men under arms and no roll
    of them"; MEASURED, this is worse and sharper — **this town has the militia itself and
    still no roll of it.** A cited muster roll is F1-24 / §R-8 / V-01 here exactly as on the
    garrison pool, and the writer will feel far more entitled to it. There is no roll.

  • ⭐ WHOEVER HOLDS THE WAY THROUGH — seated by the palisade itself. `hasGates` is TRUE on
    79/79 because `priorityHelpers.js:53` matches the substring 'palisade'. The palisade's own
    service `Gated entry` is on at p 1.0 on all 79: "Controlled access through the perimeter.
    Strangers must state business." So a controlled entrance, and a person at it, exist on
    every town; denying either is floor 1.
    ⛔⛔ BUT IT IS NOT A TILL, AND THIS IS THE EXACT INVERSE OF THE GARRISON POOL. There is no
    `Gates (if walled)` row at these tiers (it is a TOWN row), so no `Toll collection`, no
    `Entry inspection`, no `Gate control`. EXECUTED: `holdersOf('toll-bar')` NONE on 79/79.
    **The way through on this pool takes no money and keeps no book.** Every gate-as-revenue
    hook the walled-garrison packet is built on is an invention here.

  • THE HOUSEHOLDS, AND THEY ARE THE SAME PEOPLE AS THE MUSTER. The militia IS the households
    ("Ordinary residents"; catalog "All able-bodied citizens obligated to defend"). And at
    hamlet the `Burial ground` row is "kept by the households in turn" — the same rota logic
    on the other end of life. A genuinely universal collective speaker with a real stake.

  • THE PUBLIC (ruling 28) and THE STRANGER (always). The stranger is unusually well seated
    here: the gate's own text makes the stranger the person the procedure is ABOUT ("Strangers
    must state business"), and four stress branches on this preimage print heightened suspicion
    of strangers.

  • SOMEONE WHO SPEAKS FOR THE PLACE — 79/79 by union, but NEVER as "the hall". MEASURED:
    `Lord's steward` 41 · `Village reeve` 24 · `Informal elder consensus` 13 · `Village headman`
    1. Zero towns with no governance row.
    ⛔ THE FOUR ARE NOT INTERCHANGEABLE AND TWO ARE OPPOSITES. `Lord's steward` is "A lord's
    agent [who] manages the lands, collects rents, and enforces noble authority"; `Informal
    elder consensus` is "A FREE hamlet with NO lord's representative." A face may not assume a
    lord and may not assume there is none. Write the function ("whoever answers for the place",
    "those who decide such things", "the elders") and never the seat.

  • A HOUSE OF THE FAITH — `hasChurch` true 79/79, and burial is universal (`Graveyard` 43 +
    `Burial ground` 36 = 79). BUT THE BUILDING AND THE PRIEST ARE NOT. At the 36 hamlets the
    row is `Access to parish church`, whose desc is "Walk 2-5km to village church for
    services" — **there is no church building in the settlement and no resident clergy**;
    `Priest (resident)` stands on 43 of 79, the villages only. And EXECUTED, `holdersOf('parish')`
    is NONE on 79/79: no town of this pool keeps a register of any kind.
    So: the dead are buried here on every town; worship on 36 of them is a walk out of the
    place; and nothing anywhere is written down. Burial is the safe universal; the bell, the
    churchyard, the priest and the register are not.

  ── CONDITIONAL SPEAKERS (the field that seats each, measured) ──
    the tavern / the alehouse   67/79  (`Alehouse` 40 · `Travelers' inn` 39 · `Ale house` 34 ·
                                `Wayside inn` 31 · `Waystation` 11 · `Caravanserai` 9) — 12
                                towns have NO drinking house at all. Interest: the safety
                                label and who came off the walk with a thirst.
    the smith                   63/79 — ⭐ the best-seated conditional speaker on this pool,
                                because the militia carries ITS OWN TOOLS and he is the one who
                                makes and mends them. His interest is being paid for war-work
                                by people who are not paid to do the war.
    a market                    46/79 (`hasMarket`) — "the market" as a BODY is F1-10 on 33.
    the charter hall            39/79 — and the threat row PRINTS its presence or absence on the
                                same page: "Charter hall provides specialist backup." /
                                "No specialist monster hunters." Interest: it is the professional
                                answer standing beside the amateur one.
    a healer / midwife / apothecary  37/79 ; `hasHospital` 13/79.
    `Veteran's lodge`            9/79 — "A drinking hall for old soldiers and mercenaries."
                                ⚠⚠ W-01 / V-34 LIVES ON EXACTLY THESE NINE TOWNS: the lodge sets
                                `hasMercenary: true` (`priorityHelpers.js:49` lists "veteran's
                                lodge") while the mercenary BUCKET stays FALSE (measured: no
                                bucket row on any of the 79). Two engine surfaces disagree; NO
                                FACE MAY BE CHARGED EITHER WAY on those towns, and no face
                                should lean on either reading.

  ── NEVER A SPEAKER, AND NEVER A BODY, ON THIS KEY ──
  • ⛔⛔ THE WATCH. `hasWatch` FALSE on 79/79; no `Town watch` row exists in the catalogue at
    hamlet or village at all. **V-23 is explicit and was re-cut FOR this case: "any watch as a
    body below town contradicts `hasWatch` false", and the old "'local watch' — use it"
    permission is WITHDRAWN by name.** No watch, no watchman, no watch captain, no "the gate's
    watch" (V-02 — a possessive may not seat a body the roster denies).
    ⚠ AND THE PAGE WILL ARGUE WITH YOU, WHICH IS A SEAM AND NOT A LICENCE: the same-tab machine
    prints "Watch rotations are thin" on 76/79, "The watch is uncertain whose orders to follow"
    on 3, and "The watch is overwhelmed by unfamiliar faces" on 2. Those are engine-side mints
    of the W-19 / W-22 family. The ROTATIONS are real and are the MILITIA'S — write the turn,
    the rota, who stands tonight. The WATCH as a body is still refused.
  • ⛔ THE HALL, and every hall-shaped word. Zero hall rows on 79/79 (F1-20; V-29 names "the
    hall at a hamlet" as a surviving label trap). No town hall, no moot house, no chamber, no
    long table, no clerk in the hall.
  • ⛔ THE GUILDS. Zero guild rows on 79/79. Not a speaker, not a body, not a stake.
  • ⛔ THE GARRISON, SOLDIERS OF THE TOWN'S OWN, A BARRACKS. `hasGarrison` false 79/79; the key
    fixes it. And "soldiers" is wrong even of the militia in the ordinary sense — the engine
    calls them "Part-time soldiers with their own tools and no pay", which is a phrase the ROW
    owns, not a licence to write a soldiery.
  • ⛔ A MERCENARY COMPANY (F1-05) · A PRISON, A COURT, A GAOL (`hasCourtSystem` and `hasPrison`
    FALSE 79/79) · A GRANARY OR ANY STORE (`hasGranary` FALSE 79/79) · A PORT (FALSE 79/79) ·
    A CITADEL, an inner keep, a last refuge (F1-07; no such row at these tiers).
  • ⛔ THE CROWN'S ASSESSOR — the engine has no typed crown collector anywhere, and a
    `Lord's steward` on 41 towns makes one feel natural. It is not a speaker.

  ── THE NAMED OFFICES A SPEAKER MUST NEVER BE (`npcGenerator.js:1511-1537`) ──
    hamlet  (36/79)   **Elder** · **Parish Priest**
    village (43/79)   **Mayor** · **Guard Captain**
  ⛔⛔ THIS POOL'S FLOOR-3 TRAP IS SHARPER THAN ANY WALLED POOL'S, FOR THREE REASONS.
    (a) **'Elder' is a mandatory NPC at every hamlet.** The brief seats "the elders" below town
        as a safe speaker and it stays safe AS A PLURAL CLASS — but "the elder", "the oldest
        here", "the one they defer to" is Elder ⟨Name⟩ on the next tab, with a personality and
        a secret. Keep it plural, always.
    (b) **'Guard Captain' is mandatory at every one of the 43 villages** — on a town with no
        garrison, no watch and no paid force whatever. So "whoever calls the muster out",
        "the one who says where they stand", "whoever decides who is let through" all read as
        Guard Captain ⟨Name⟩. Write the muster acting for itself, or a plural, or a bystander.
    (c) **'Parish Priest' is mandatory at every hamlet** — the same 36 towns where the
        institution roster holds NO resident clergy and the church is a 2-5km walk. The engine
        seats a priest NPC where the roster seats no priest. Do not resolve that seam in prose:
        never "the priest", and the register is barred independently.
  Stress adds more, and these fired ON THIS PREIMAGE (measured): `under_siege` 3 → Garrison
  Commander + Guard Captain · famine 5 → Healer + Guild Master · succession_void 3 → Council
  Member + Chief Magistrate · politically_fractured 2 → Council Member ×2 · recently_betrayed 2
  → Chief Magistrate · insurgency 2 → Chief Magistrate + Corrupt Official · mass_migration 2 →
  Guild Master + Healer · wartime 2 → Garrison Commander + Guild Master · plague_onset 2 →
  Healer + Parish Priest · monster_pressure 1 → Garrison Commander + Retired Adventurer ·
  religious_conversion 1 → Parish Priest + Council Member.
  ⚠ Note the engine emits a GARRISON COMMANDER on siege/wartime/monster-pressure towns of a
  pool whose key fixes no garrison. Another W-19-family seam: do not write him, do not deny him.

(8) WHAT WOULD BE FALSE

  Start from the two sentences the engine prints about the only two rows this pool universally
  holds, because between them they kill the three hooks a writer arrives carrying. **THE
  MILITIA HAS NO PAY** — `institutionVocabulary.js:153` "Part-time soldiers with their own tools
  and no pay", and V-09 is the sitting's own row on exactly this, splitting W16e to keep "no
  wage, pay or arrears predicated of a `Citizen militia`" as a floor-1 finding. So "the muster
  is paid late", "the wage is short", "the coin never reaches the men on the bank", "they are
  owed for the winter" are ALL contradictions here, and they are the walled-garrison packet's
  central hook imported wholesale: on that pool the wage IS the flavour, on this one there is no
  wage to be short. **THEIR TOOLS ARE THEIR OWN** — so an armoury, a town store of arms, issued
  spears, a rack by the gate, anything the place hands out, is an invention against the row.
  **THE PLACE CANNOT AFFORD STONE** — `institutionVocabulary.js:155`, "A wooden palisade or
  earthen bank thrown up to slow raiders and beasts. Rough defence for a place that cannot
  afford stone" — so the stone ring, the masonry, the curtain wall, the parapet, the wall-walk,
  the stair to the walk, the battlements, the towers, the gatehouse are not merely unlicensed,
  they are the printed row's opposite (V-06, F1-32; and F1-33 still bars the SOURCE of any
  material). MEASURED, the fabric is `Palisade or earthworks` on 79 of 79 and `Town walls`
  never; the same-tab Beasts row prints the word **"Palisade"** on all 79, so *palisade*,
  *bank*, *earthwork*, *berm*, *stakes* are the page's own vocabulary and safe — but the row is
  ONE row covering a timber palisade OR an earthen bank, so a face that predicates timber of it
  is asserting half a disjunction the record leaves open, and a face that predicates a WALK, a
  height a man stands on, or an inside-and-outside of a berm is inventing a shape. Going the
  other way, the denials are worse, because the four same-page producers fire in the engine's
  own hand on every town: `threatAssessment` prints **"Walls with citizen militia: credible
  deterrence against raiders, inadequate against any professional force with siege capability"
  on 79/79**, the palisade's `Gated entry` service is on at p 1.0 on 79/79 ("Controlled access
  through the perimeter. Strangers must state business"), and the militia's `Emergency defense`
  is on at p 1.0 on 79/79 ("Armed citizen response to external threats and raids"). So "nobody
  is set up to respond", "nothing here is organised", "there is no one at the way in", "the bank
  is decoration", "anyone may walk in" are floor-1 negations of printed rows — and "the militia
  patrols reliably", "the turns are well kept", "they hold the line" are the OPPOSITE floor-1
  error, because `guardEffectivenessDesc` prints on 77/79 "The citizen militia musters when
  needed but cannot maintain consistent patrol. Volunteers with other work to do; reliable in a
  crisis, absent during routine crime." The lawful band is that sentence's own shape and nothing
  wider: **turnout in a crisis, absence in the routine.** ⛔ AND THE NIGHT IS THE ONE THING THIS
  POOL MAY NOT SETTLE IN EITHER DIRECTION: the palisade's `Night watch` service ("Basic patrol
  of the perimeter after dark") instantiated on only **29 of 79** towns, so asserting a nightly
  patrol invents it on 50 and denying one contradicts 29 — write the night as a question, a
  dispute or a silence, never as a fact, and note that `safetyDesc` on 54/79 independently says
  "Militia volunteers patrol the main paths; quieter spots after dark carry genuine risk", which
  a face claiming either an empty night or a covered one contradicts. **NOTHING ON THIS POOL IS
  WRITTEN DOWN, AND THIS IS THE HARDEST BAR ON THE CARD** (ruling 40, F1-24, §R-8, V-01):
  EXECUTED over the 79, every single record-holder kind resolves to NOBODY — `muster` NONE
  79/79, `parish` NONE 79/79, `toll-bar` NONE 79/79, `census` NONE 79/79, `court` NONE 79/79,
  `market` NONE 79/79, `road` NONE 79/79, `tradition` NONE 79/79, `watch` NONE 79/79, with
  `treasury` resolving on 12 (`Weekly market`) and `elders` on 1 (`Village headman`). **NO
  NAMED RECORD MAY BE CITED ANYWHERE ON THIS POOL** — not the muster roll (the militia is here
  and still keeps none), not the parish register, not the toll book, not the accounts, not the
  returns, not "the books". Every account names its source through a ROLE, and there is no
  exception on this key. Then the bodies the roster denies outright, all measured FALSE on
  79/79: a court, a trial, a sentence, a magistrate hearing, a gaol or stocks (`hasCourtSystem`
  and `hasPrison` false; and the same tab prints **"No legal infrastructure: order relies on
  force alone"** on 79/79 and "Without courts or prison, enforcement relies entirely on fines,
  exile, or summary violence" on 79/79 — F1-12, F1-13, §R-4, the WORD court still free); a
  granary, a store, a reserve, provisioning for a siege (`hasGranary` false, and the Disasters
  row prints **"No food reserves"** on 79/79 — F1-09, and it means a siege face may not have the
  place stocked); a port or anything by sea (`hasPort` false 79/79, so F4-09's blockade re-cut
  cannot arise); smuggling as an activity (`hasSmuggling` false 79/79, which makes the 2/79
  "chokehold on smuggling routes" clause engine-side only); a hall, a guild, a market as a body
  on the 33 without one (F1-20, F1-10, V-29); a mercenary company (F1-05), with the nine
  `Veteran's lodge` towns unchargeable either way under W-01 / V-34; a charter hall on the 40
  without one, whose absence the threat row PRINTS. On floor 2 this key invites every row and
  the preimage's spread refuses the easy ones: **F1-31 the tier word is wrong on part of the
  preimage whatever you choose**, since hamlet 36 and village 43 both draw the same face — "a
  place this size" is the form, never a village, never a hamlet; no magnitude in digit or word
  (no headcount of the muster, no "a handful on the bank", no length of the perimeter, no
  distance — and note the hamlet church row's own "2-5km" is the ROW's figure and never the
  writer's, F2-01); no date, season or duration (F2-02); no raising of the bank narrated, which
  is the single most tempting sentence available here since the row says it was "thrown up"
  (F2-03); no event the record did not run — no raid turned back, no night the bank held, no
  beast killed at the ditch (F2-04); no rate — "the gate is shut at dusk" is lawful, "most
  nights" is not (F2-06, §S-3); no age of the fabric (F2-07); no trend (F2-08); no history at
  all, this key reading no history field (F2-09); and no elapsed course over a LIVE field
  (F2-05) — though **V-04 / R-9's thin-muster permission IS live on this key** (it is refused
  only "on a no-force key" and this key fixes a force), so "the muster is thin", "turns stand
  unfilled" are lawful as a STANDING STATE, never as "thinner than it was". The perfect and
  durative are otherwise licensed exactly over the frozen census at (6) and over the key's own
  three LIVE reads by ruling 11a. Floor 3: the OFFICE RIDER of section (7) is this pool's
  likeliest failure by a wide margin, with **Guard Captain mandatory on all 43 villages and
  Elder and Parish Priest on all 36 hamlets** (F3-06, V-22); no named character's fate (F3-01);
  nothing predicated of a deity (F3-02, D-04–D-10); and **all ELEVEN culture profiles fire on
  this preimage (measured: germanic 9, slavic 9, arabic 8, celtic 8, east_asian 8, greek 7,
  latin 7, mesoamerican 7, norse 7, steppe 5, south_asian 4)**, so no thatch — even though a
  `Thatcher` row stands on 33 towns — no churchyard, no market green, no snow, and none of the
  exemplar pack's north-European furniture (F3-05, and a palisaded farming settlement is
  precisely where a writer reaches for it by reflex). On floor 4: F4-01 bars both halves of the
  fabric question and bites unusually hard here, because **`institutionLifecycle.js:1016`
  reaches `Palisade or earthworks` BY NAME** in the purse's economic-distress closure (§V.0
  floor 4; only `City walls and gates` is exempt) — so no decay clock AND no permanence, and a
  face calling this bank a thing that will outlast them is denying a modelled removal path;
  F4-02 bars the split purse and F4-19 / V-07 put every defence on the one military line, which
  on this key compounds with V-09 into a double falsity ("they spent it on the bank instead of
  the men" splits a purse that is one AND pays men who are not paid); F4-04 bars the total
  collapse, `communityMilBase` being exempt by name at `defenseGenerator.js:186-193` — which is
  precisely this pool's unpaid militia, so "nothing has been paid" is wrong twice over; F4-06
  bars explaining the readiness band by the works (measured spread 7 to 49 across the 79, so no
  readiness word survives the preimage anyway); F4-07 bars the terrain doing nothing; F4-08
  bars magic where it does not work; and **F4-05 is live and dangerous here: `monsterThreat` is
  `plagued` on 76 of 79 and `frontier` on 3, with NO `settled` town at all — `plagued` is
  MONSTERS, never disease**, while two separate towns carry `plague_onset` stress and a
  "Restricted — Plague Conditions" label, so the two readings genuinely collide on the same
  page and a face must not fuse them. F1-34's totality bar holds in both directions (label
  spread: Moderate 54, then Strained ×8 kinds, Unsafe 4, Dangerous 1, Restricted 2, Tense 2 —
  so neither "safe enough" nor "a place under siege" is true of the pool). Ruling 35 last: the
  neighbours are `Invasion & War: militia only` (walls false), `walls AND professional garrison`
  (garrison true) and `walls with NO force` (militia false), so a face about a bare bank with
  nobody behind it belongs to the third, a face about a turnout with nothing to stand behind
  belongs to the first, and a face here must need BOTH the perimeter AND the unpaid citizen
  force to be true. **And what is NOT a finding, by name:** that the card does not license it;
  "keep every claim, add none"; the same claim set on every face; the always-safe spelling
  lists; the layer bar; the record-word bar as a class (accounts, duties, returns, minutes are
  free WORDS — it is the CITED record with no resolving holder that is barred here, and on this
  pool that is all of them); the per-face taste bands; the person bar beyond floor 3 — an
  unnamed person may act, hold a key, refuse, be resented, be slow, be absent from his turn, so
  long as the tier does not emit that office as an NPC; and DULLNESS, which is a pool-grain
  craft verdict and never a face-grain finding.

(9) WHERE THE FLAVOUR IS

  • WHAT IS IN USE — A BANK OF EARTH, A WAY THROUGH THAT TAKES NO MONEY, AND TOOLS THAT GO
    HOME AT NIGHT. The engine's own words are "thrown up to slow raiders and beasts" and
    "rough defence for a place that cannot afford stone", and the way through it runs on one
    p 1.0 service: "Controlled access through the perimeter. Strangers must state business."
    That is the whole apparatus — a bank, a gap in it, and somebody standing in the gap asking
    a stranger what he wants. **And unlike every walled pool above town, nothing is collected
    there**: no toll row exists at these tiers, `holdersOf('toll-bar')` is empty on all 79, and
    no book is kept. The concrete particulars are therefore a person and a question, not a coin
    and a ledger: who was asked and who was not, who was let through because he was known, whose
    own spear is leaning by the gap because the man carrying it owns it and will want it back
    for the hedging. Write what the bank and the turnout are USED for, and remember the smith
    on 63 of 79 towns is the one mending the tools nobody is paid to carry.

  • WHAT IS IN DISPUTE — THE TURN, NEVER THE WAGE. This is the pool's signature and the thing
    that makes it not the garrison pool: there is no wage to argue about (V-09), so the whole
    argument is about WHOSE NIGHT IT IS and WHOSE WORK STOPS. The engine hands the disagreement
    over ready-made and prints it on the same page: "musters when needed but cannot maintain
    consistent patrol. Volunteers with other work to do; reliable in a crisis, absent during
    routine crime." Two honest sources read that oppositely and both are right — the muster
    saying it will stand tomorrow and does stand when it matters, and anyone whose quiet corner
    goes unwalked on a Tuesday saying it does not stand at all. **And the night is genuinely
    unsettled in the record** (the perimeter patrol fires on 29 of 79), so the archiver can set
    both accounts down and weigh in without closing it, which is exactly ruling 22's shape: the
    weighing OPENS. Beside it sits the same rota logic on the other end of life — the burial
    ground "kept by the households in turn" — and the charter hall on 39 of 79, the paid
    professional answer standing next to the unpaid amateur one, whose presence or absence the
    threat row prints beside the prose.

  • WHAT THE ABSENCE LOOKS LIKE ON THE GROUND — NOTHING IS WRITTEN DOWN, AND NOTHING CAN BE
    LOOKED UP. This pool's absence is not a missing body; it is a missing PAPER, and it is
    total. Executed over 79 towns, not one keeps a muster roll, a parish register, a toll book,
    a court record, a census or a road book; the treasury resolves on 12 and the elders on 1.
    The militia stands on every town and no list says who is on it. The church is universal and
    keeps no register — on the 36 hamlets it is not even a building here, but a two-to-five
    kilometre walk to somebody else's village. There is no court and no gaol on any of the 79,
    and the tab says plainly what fills the gap: "order relies on force alone… fines, exile, or
    summary violence." There is no granary on any of them either: "No food reserves." So a
    dispute is settled by whoever turns out, a debt is remembered rather than recorded, a
    stranger is judged at the gap in the bank by a person with no book to check him against,
    and a bad winter has nothing behind it. That is a whole notebook of conjecture available to
    the archiver, and every word of it is the engine's own arithmetic rather than the writer's
    invention.
