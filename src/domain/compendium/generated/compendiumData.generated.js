// GENERATED FILE — DO NOT EDIT BY HAND.
// Source of truth: the engine registries (causalState, signalRegistry,
// constants, operationRegistry, townMapStyles, interiorTemplates,
// calamity, simulationRules) + the authored catalogData taxonomy.
// Regenerate: npm run gen:compendium-data
// Pinned by tests/docs/compendiumDataFreshness.test.js (byte-identity + parity).
//
// THE REGISTRY-RENDER LAW: every enumerable and every count the public
// Compendium shows renders from this artifact, so a divergent constant fails CI.

export const COMPENDIUM_DATA = Object.freeze({
  "meta": {
    "demoWorld": {
      "seed": "lf-033",
      "name": "Cnocby",
      "population": 412
    }
  },
  "causal": {
    "variables": ["food_security","labor_capacity","public_legitimacy","ruling_authority","faction_power","trade_connectivity","healing_capacity","defense_readiness","criminal_opportunity","religious_authority","housing_pressure","infrastructure_condition","magical_stability","social_trust","economic_capacity","law_order"],
    "variableCount": 16,
    "variableEntries": [
      {"id":"food_security","label":"Food security","description":"How reliably the settlement can feed its population, weighing food production and stores against demand. It falls toward famine when granaries and trade cannot cover the mouths to feed."},
      {"id":"labor_capacity","label":"Labor capacity","description":"The workforce available for production, services, and building. It reflects population, health, and how much labor is already committed elsewhere."},
      {"id":"public_legitimacy","label":"Public legitimacy","description":"How far the populace accepts the ruling power as rightful. Low legitimacy invites unrest, defiance, and factional challenge."},
      {"id":"ruling_authority","label":"Ruling authority","description":"The reach and grip of the governing power over the settlement. It measures how effectively decisions are enforced, not whether they are welcomed."},
      {"id":"faction_power","label":"Faction power","description":"The collective strength of organized factions competing for influence. When it is high, rival blocs rather than the ruler increasingly set the agenda."},
      {"id":"trade_connectivity","label":"Trade connectivity","description":"How well the settlement is tied into trade routes and partners. It governs the flow of goods in and out, and the wealth that flow brings."},
      {"id":"healing_capacity","label":"Healing capacity","description":"The settlement's ability to treat injury and disease through its healers, temples, and institutions. When it is low, plague and wounds run unchecked."},
      {"id":"defense_readiness","label":"Defense readiness","description":"How prepared the settlement is to withstand attack, from walls and garrison to trained militia. It rises with fortification and falls under siege or neglect."},
      {"id":"criminal_opportunity","label":"Criminal opportunity","description":"How much room the settlement leaves for crime to operate. Higher is worse here: it tracks the gaps in law, wealth, and oversight that let criminal networks thrive."},
      {"id":"religious_authority","label":"Religious authority","description":"The reach of religious institutions over settlement life. It reflects how strongly faith shapes governance, custom, and public order."},
      {"id":"housing_pressure","label":"Housing pressure","description":"Whether the settlement has enough sound housing for its people. It is scored so higher is better, so a low score means crowding, sprawl, and strained shelter."},
      {"id":"infrastructure_condition","label":"Infrastructure condition","description":"The state of the settlement's built fabric: roads, bridges, walls, and public works. It decays without upkeep and limits everything built on top of it."},
      {"id":"magical_stability","label":"Magical stability","description":"How stable and well-governed the settlement's magical forces are. Low stability signals unchecked arcane hazard, leakage, or contested magical authority."},
      {"id":"social_trust","label":"Social trust","description":"The cohesion binding the populace together, the everyday confidence that neighbours and institutions will hold. It frays under stress, division, and betrayal."},
      {"id":"economic_capacity","label":"Economic capacity","description":"The overall productive and financial strength of the settlement's economy. It underwrites what the settlement can afford to build, field, and endure."},
      {"id":"law_order","label":"Law & order","description":"How firmly the rule of law holds day to day, from courts and watch to the plain absence of disorder. It falls as crime, faction violence, and unrest rise."}
    ],
    "bands": ["surplus","adequate","strained","critical","collapsed"],
    "bandCount": 5
  },
  "pressures": {
    "kinds": ["food","disease","conflict","hostility","trade","economy","legitimacy","defense","crime"],
    "count": 9,
    "entries": [
      {"id":"food","label":"Food","description":"Strain from the settlement failing to feed itself, rising as production and stores fall short of demand. It is the pressure behind famine and food riots."},
      {"id":"disease","label":"Disease","description":"Strain from sickness and poor sanitation outpacing the settlement's ability to treat it. It is the pressure behind plague and its social fallout."},
      {"id":"conflict","label":"Conflict","description":"Internal strain from factions, classes, or rivals pulling against each other. It is the pressure behind feuds, unrest, and political fracture."},
      {"id":"hostility","label":"Hostility","description":"External strain from hostile neighbours and threats pressing on the settlement. It is the pressure behind raids, a war footing, and closed gates."},
      {"id":"trade","label":"Trade","description":"Strain from the settlement's trade being disrupted or unable to meet its needs. It rises when routes, partners, or exports falter."},
      {"id":"economy","label":"Economy","description":"Strain from economic weakness, scarcity, or collapse of livelihoods. It is the pressure behind hardship, debt, and decline."},
      {"id":"legitimacy","label":"Legitimacy","description":"Strain from the ruling power losing the populace's acceptance. It is the pressure behind defiance, succession disputes, and revolt."},
      {"id":"defense","label":"Defense","description":"Strain from the settlement being unready to defend itself against the threats it faces. It rises as garrison, walls, and readiness fall behind the danger."},
      {"id":"crime","label":"Crime","description":"Strain from criminal activity the settlement cannot contain. It is the pressure behind smuggling, extortion, and the erosion of order."}
    ]
  },
  "tiers": [
    {"id":"thorp","label":"Thorp","min":8,"max":60},
    {"id":"hamlet","label":"Hamlet","min":61,"max":400},
    {"id":"village","label":"Village","min":401,"max":900},
    {"id":"town","label":"Town","min":901,"max":5000},
    {"id":"city","label":"City","min":5001,"max":25000},
    {"id":"metropolis","label":"Metropolis","min":25001,"max":100000}
  ],
  "prosperity": {
    "tiers": ["Subsistence","Struggling","Poor","Moderate","Comfortable","Prosperous","Wealthy"],
    "count": 7
  },
  "bandLadders": [
    {"id":"prosperity","concept":"Prosperity","blurb":"Derived from export volume, income sources, supply chains, trade route, and safety. Not a dial you set. An output you read.","tab":"economy","anchor":"economy","levels":[{"name":"Subsistence","reading":"Bare survival. The settlement feeds itself and little more, with no cushion for a bad season."},{"name":"Struggling","reading":"Chronically short. Basic needs are met unevenly and any shock is felt at once."},{"name":"Poor","reading":"Getting by. Essentials are covered but there is no surplus to build with or trade on."},{"name":"Moderate","reading":"Steady and ordinary. The settlement supports itself with a thin margin to spare."},{"name":"Comfortable","reading":"Reliable surplus. Trade and craft carry it well past subsistence, and reserves exist."},{"name":"Prosperous","reading":"Visibly well off. Surplus funds its institutions and defenses across a broad web of trade."},{"name":"Wealthy","reading":"Abundant. The settlement commands wide trade and reserves deep enough to outlast most crises."}]},
    {"id":"priority","concept":"Priority Bands","blurb":"The five priority sliders (economy, military, magic, religion, and criminal) run from 5 to 95 and default to 50. The engine reads each slider on these five bands to decide how strongly that domain shapes the settlement. The magic slider also resolves to a separate magic level the world reads (see the Magic and Religion tab).","tab":"economy","anchor":"economy","levels":[{"name":"Very Low","reading":"At or below 15. The engine expects almost nothing of this domain; its institutions are unlikely and its mark on the settlement is faint."},{"name":"Low","reading":"Up to 35. A minor emphasis. A few of this domain's institutions may appear, but it does not steer the settlement."},{"name":"Medium","reading":"Up to 65. The default weight. This domain carries ordinary influence, neither driving the settlement nor absent from it."},{"name":"High","reading":"Up to 85. A strong emphasis. The engine expects this domain's institutions to be present and to leave a mark."},{"name":"Very High","reading":"Above 85. A dominant priority. This domain's institutions are expected in force and can define the settlement's character."}]},
    {"id":"chain-status","concept":"Chain Status","blurb":"Every supply chain the settlement runs carries a status shown as a chip on the dossier. These are the states you will see. Two further engine states, captured and collapsing, are defined but not yet produced by the generator.","tab":"economy","anchor":"economy","levels":[{"name":"Running","reading":"The chain runs normally with all of its inputs available."},{"name":"Vulnerable","reading":"The chain still runs, but under stress; a shock would bite."},{"name":"Impaired","reading":"The chain is producing below its normal output."},{"name":"Broken","reading":"The chain is offline after a hard failure somewhere upstream."},{"name":"Entrepot","reading":"A healthy re-export hub: goods pass through the settlement rather than being made here."},{"name":"Magically Sustained","reading":"The chain runs on a magical supplement, not on its own health."}]},
    {"id":"coherence","concept":"Coherence Check","blurb":"Not a score. The engine checks whether the settlement makes logical sense and returns one of three verdicts. The findings behind a verdict are graded critical (survival-blocking), implausible (breaks historical believability), dependency (relies on open trade), or inefficiency (waste the settlement can survive).","tab":"economy","anchor":"economy","levels":[{"name":"Coherent","reading":"The pieces fit. The settlement holds together with no survival-blocking problem."},{"name":"Marginal Coherence","reading":"Survivable but strained. It works, yet real weaknesses show."},{"name":"Not Coherent","reading":"A critical issue prevents the settlement from surviving as described."}]},
    {"id":"food-security","concept":"Food Security","blurb":"How well the settlement feeds itself, read from local production, imports, and any magical supplement against demand. A famine or a severe deficit caps prosperity no matter how strong the trade.","tab":"economy","anchor":"economy","levels":[{"name":"Surplus","reading":"A food surplus above 40 percent. Reserves cushion a bad season and can lift prosperity."},{"name":"Secure","reading":"The settlement feeds itself with a small margin."},{"name":"Pressured","reading":"A food deficit above 5 percent. The margin is thin and a shock would bite."},{"name":"Import-Dependent","reading":"A food deficit above 15 percent, covered by imports. A cut trade route turns it into a crisis."},{"name":"Deficit","reading":"A food deficit above 40 percent. The settlement cannot feed itself."},{"name":"Active Famine","reading":"Famine. Food has failed outright, and it caps prosperity no matter how strong the trade."}]},
    {"id":"stability","concept":"Settlement Stability","blurb":"How a settlement’s overall health reads at a glance, on a 0 to 100 scale.","tab":"stress","anchor":"stress","levels":[{"name":"Stable","reading":"Healthy. Shocks are absorbed without crisis."},{"name":"Strained","reading":"Functional but stretched. A bad season would hurt."},{"name":"Vulnerable","reading":"One real shock away from failure."},{"name":"Critical","reading":"Already failing. This is plot fuel."}]},
    {"id":"strain","concept":"Capacity Strain","blurb":"How a single capacity such as food, defense, or healing reads against the demand on it.","tab":"stress","anchor":"stress","levels":[{"name":"Surplus","reading":"More capacity than the settlement needs. A cushion against a bad season."},{"name":"Adequate","reading":"Supply meets demand. The settlement is not straining here."},{"name":"Strained","reading":"Demand is outrunning supply; the margin is thin and a shock would bite."},{"name":"Critical","reading":"Supply is far short of demand. This capacity is close to failing."},{"name":"Collapsed","reading":"Demand dwarfs supply; the function has effectively broken down."},{"name":"Absent","reading":"Neither supplied nor demanded. The capacity does not exist here at all."}]},
    {"id":"severity","concept":"Stressor Severity","blurb":"How hard a stressor hits when the DM applies one.","tab":"stress","anchor":"stress","levels":[{"name":"Minor","reading":"A light touch. The stressor nudges the settlement without upending it."},{"name":"Moderate","reading":"A real strain the settlement must reckon with, short of a crisis."},{"name":"Severe","reading":"A heavy blow. The stressor forces the settlement toward crisis."}]},
    {"id":"magnitude","concept":"Relief Magnitude","blurb":"How much an ally gives when it sends relief.","tab":"stress","anchor":"stress","levels":[{"name":"Token","reading":"A gesture: a small share of the giver’s surplus above its own floor."},{"name":"Measured","reading":"A considered gift: a meaningful share of the surplus, kept sustainable."},{"name":"Generous","reading":"An open hand: most of the giver’s surplus above its floor goes out."}]},
    {"id":"safety","concept":"Safety","blurb":"How safe daily life is, read from enforcement against criminal presence. A crisis stress can override the label with a compound form, such as Tense under an active siege.","tab":"stress","anchor":"stress","levels":[{"name":"Very Safe","reading":"Enforcement is at least 3.5 times the criminal presence. Fortress towns and occupations sit here."},{"name":"Safe","reading":"Enforcement is clearly dominant and criminal elements are suppressed."},{"name":"Moderate","reading":"A functional equilibrium; law is present but crime exists."},{"name":"Unsafe","reading":"Criminal activity measurably outpaces enforcement."},{"name":"Dangerous","reading":"Organized crime or a crisis has overwhelmed the watch."}]},
    {"id":"defense-readiness","concept":"Defense Readiness","blurb":"Each of the five defense arms (beasts and monsters, invasion and war, internal security, economic survival, disasters and famine) carries a readiness badge on this scale. The settlement's overall defense reads from well defended down to undefended.","tab":"stress","anchor":"stress","levels":[{"name":"Strong","reading":"Readiness at or above 65. This pressure is well covered."},{"name":"Adequate","reading":"At or above 40. Covered, but with little margin."},{"name":"Weak","reading":"At or above 20. Thinly covered; a real threat would strain it."},{"name":"Critical","reading":"Below 20. Effectively uncovered against this pressure."}]},
    {"id":"legitimacy","concept":"Public Legitimacy","blurb":"How far the populace accepts the ruling power, on a 0 to 100 scale built from prosperity, safety, defense, and food. It scales how well the ruling power performs and, inversely, how much room crime finds.","tab":"power","anchor":"power","levels":[{"name":"Endorsed","reading":"At or above 75. The ruling power is broadly accepted; it governs at full strength and crime finds little room."},{"name":"Approved","reading":"At or above 60. Accepted, with a modest edge in the ruling power's favour."},{"name":"Tolerated","reading":"At or above 45. The ruling power holds on sufferance, with no edge either way."},{"name":"Contested","reading":"At or above 30. Acceptance is fraying; the ruling power weakens and crime gains ground."},{"name":"Legitimacy Crisis","reading":"Below 30. The ruling power has lost the populace; governance can fracture and crime fills the vacuum."}]},
    {"id":"capture","concept":"Criminal Capture","blurb":"How far a criminal interest has taken a seat of power.","tab":"power","anchor":"power","levels":[{"name":"None","reading":"No criminal capture. The seat answers to its lawful holder."},{"name":"Adversarial","reading":"A criminal interest is pushing at the seat, and the seat is pushing back."},{"name":"Equilibrium","reading":"The lawful holder and the criminal interest have reached an uneasy standoff."},{"name":"Corrupted","reading":"The criminal interest now bends the seat to its ends more often than not."},{"name":"Capture","reading":"The seat is captured. The criminal interest owns its decisions outright."}]},
    {"id":"pantheon-rank","concept":"Pantheon Rank","blurb":"A seat is a settlement whose patron is this god. Rank rises with seats (cult to minor at two, minor to major at four) and falls back below them, but a change must hold for two ticks, and at most two ranks change across the whole realm each tick. Rank is earned through spread, so a single custom deity can rise on its own.","tab":"arcane","anchor":"faith","levels":[{"name":"Cult","reading":"A fringe following, with fewer than two settlement seats."},{"name":"Minor","reading":"Two or three settlement seats."},{"name":"Major","reading":"Four or more settlement seats, and only a major god can shift a realm's magic legality."}]},
    {"id":"magic-level","concept":"Magic Level","blurb":"The Magic priority slider resolves to one of these levels. None means magic is disabled in the world, not a slider position. The level sets how available magic is and feeds its legality, risk, and role.","tab":"arcane","anchor":"magic","levels":[{"name":"None","reading":"Magic is disabled in this world. There is no magical economy."},{"name":"Low","reading":"A magic priority at or below 25. Magic is rare and limited."},{"name":"Medium","reading":"A magic priority up to 65. A moderate, everyday presence."},{"name":"High","reading":"A magic priority above 65. Magic is broad and pervasive."}]},
    {"id":"magic-legality","concept":"Magic Legality","blurb":"Where magic exists, its standing in law runs from forbidden to celebrated. Only a major god can shift a realm's legality (see the deity axes above). A world with no magic reads as absent.","tab":"arcane","anchor":"magic","levels":[{"name":"Forbidden","reading":"Magic is outlawed; practicing it is a crime."},{"name":"Restricted","reading":"Magic is tightly controlled, permitted only in narrow licensed forms."},{"name":"Regulated","reading":"Magic is legal but overseen, with rules on who may practice and how."},{"name":"Tolerated","reading":"Magic is accepted as an ordinary part of life."},{"name":"Celebrated","reading":"Magic is embraced and openly honored."}]}
  ],
  "operations": {
    "count": 158,
    "exemptCount": 68,
    "byKlass": {
      "canon": 6,
      "macro": 44,
      "mechanical": 108
    },
    "scopes": ["campaign","global","save"],
    "entries": [
      {"opType":"applyEvent","label":"Apply an event","description":"Applies a chosen event to the active save, writing the change into canon and recording it in the event log. It can be undone with Undo last event.","klass":"canon","slice":"settlementSlice","targetScope":"save","receiptRef":"eventLog-entry","undoToken":"undoLastEvent"},
      {"opType":"undoLastEvent","label":"Undo last event","description":"Reverses the most recent applied event on the active save, rolling canon back to the state before it.","klass":"canon","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"charterUserRoute","label":"Charter a road","description":"Charters a route between the active settlement and another settlement of the same realm. The path and its cost are read from the realm map, and the road is recorded on both settlements in one step.","klass":"canon","slice":"neighbourSlice","targetScope":"save","receiptRef":"eventLog-entry(CREATE_ROUTE)","undoToken":null},
      {"opType":"recordSnapshot","label":"Record a snapshot","description":"Saves a full point-in-time snapshot of the current settlement into its version history, so the state can be returned to later.","klass":"canon","slice":"settlementSlice","targetScope":"save","receiptRef":"versionHistory-snapshot","undoToken":"revertToSnapshot"},
      {"opType":"revertToSnapshot","label":"Revert to a snapshot","description":"Restores the settlement to a previously recorded snapshot from its version history, discarding changes made since.","klass":"canon","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"destroySavedSettlement","label":"Destroy a saved settlement","description":"Marks a saved settlement as destroyed, recording a destroy entry in canon. This is a one-way canon act; it requires the settlement's exact name as confirmName to proceed.","klass":"canon","slice":"settlementSlice","targetScope":"save","receiptRef":"eventLog-entry(DESTROY_SETTLEMENT)","undoToken":null},
      {"opType":"generateSettlement","label":"Generate a settlement","description":"Runs the full generation pipeline to build a new settlement from the current configuration and seed, and records it in the pipeline history.","klass":"macro","slice":"settlementSlice","targetScope":"save","receiptRef":"pipelineHistory","undoToken":null},
      {"opType":"regenSection","label":"Regenerate a section","description":"Rebuilds one section of the settlement (for example its power structure or economy) from the seed, recording the change as a regeneration delta.","klass":"macro","slice":"settlementSlice","targetScope":"save","receiptRef":"regenerationDelta","undoToken":null},
      {"opType":"canonize","label":"Canonize the settlement","description":"Locks the current settlement as canon so later regeneration will not overwrite it. Uncanonize the settlement reverses the lock; an event log it cleared is restored in-session for the same world, gone across reload.","klass":"macro","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":"uncanonize"},
      {"opType":"uncanonize","label":"Uncanonize the settlement","description":"Removes the canon lock from the settlement, allowing it to be regenerated again. The canon event log is cleared; canonizing again restores it in-session for the same world, gone across reload.","klass":"macro","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":"canonize"},
      {"opType":"applyEventBatch","label":"Apply a batch of events","description":"Applies several events to the active save in one pass, recording each in the event log. The last event can be undone.","klass":"macro","slice":"settlementSlice","targetScope":"save","receiptRef":"eventLog-entry(per-event)","undoToken":"undoLastEvent"},
      {"opType":"canonizeSavedSettlement","label":"Canonize a saved settlement","description":"Marks a specific saved settlement as canon in the saved-settlements list.","klass":"macro","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"commitPendingEdits","label":"Commit pending edits","description":"Writes the settlement's queued edits into canon as a committed change and records a version-history snapshot.","klass":"macro","slice":"settlementSlice","targetScope":"save","receiptRef":"versionHistory-snapshot","undoToken":"revertToSnapshot"},
      {"opType":"refreshPendingEdits","label":"Review pending edits again","description":"Revalidates retained pending edits against the active save and current world without applying them.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"importGalleryMapWithCampaign","label":"Import a gallery map with its campaign","description":"Imports a shared gallery map together with a new campaign built around it, recording a gallery-imported entry.","klass":"macro","slice":"campaignSlice","targetScope":"campaign","receiptRef":"GALLERY_IMPORTED","undoToken":null},
      {"opType":"instantWorld","label":"Build an instant world","description":"Creates a campaign and its canon members in one step, standing up a ready-to-play region without the step-by-step wizard.","klass":"macro","slice":"instantWorldSlice","targetScope":"campaign","receiptRef":"campaign+canon-members","undoToken":null},
      {"opType":"importGallerySettlement","label":"Import a gallery settlement","description":"Imports a settlement shared in the gallery into a campaign as a new save, recording the gallery import.","klass":"macro","slice":"campaignSlice","targetScope":"campaign","receiptRef":"gallery-import-id","undoToken":null},
      {"opType":"rebuildCampaignRegionalGraph","label":"Rebuild the regional graph","description":"Recomputes the campaign's regional relationship graph from its current settlements and links.","klass":"macro","slice":"campaignRegionalSlice","targetScope":"campaign","receiptRef":"regionalGraph","undoToken":null},
      {"opType":"injectCampaignStressor","label":"Inject a regional stressor","description":"Adds a normalized stressor, such as a famine or a raid, into the campaign's region to be resolved later. The change can be undone.","klass":"macro","slice":"campaignRegionalSlice","targetScope":"campaign","receiptRef":"normalized-stressor","undoToken":"undoCampaignStressorBridge"},
      {"opType":"resolveCampaignStressor","label":"Resolve a regional stressor","description":"Resolves an active regional stressor, producing residual proposals for its aftermath. The change can be undone.","klass":"macro","slice":"campaignRegionalSlice","targetScope":"campaign","receiptRef":"residual-proposals","undoToken":"undoCampaignStressorBridge"},
      {"opType":"undoCampaignStressorBridge","label":"Undo a stressor change","description":"Reverses the most recent regional stressor injection or resolution on the campaign.","klass":"macro","slice":"campaignRegionalSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"advanceCampaignRegionalImpacts","label":"Advance regional impacts","description":"Steps the campaign's queued regional impacts forward, updating the regional graph as their effects land.","klass":"macro","slice":"campaignRegionalSlice","targetScope":"campaign","receiptRef":"regionalGraph","undoToken":null},
      {"opType":"applyQueuedRegionalImpact","label":"Apply a queued regional impact","description":"Applies one queued regional impact to its target settlement and records the result.","klass":"macro","slice":"campaignRegionalSlice","targetScope":"campaign","receiptRef":"impact-result","undoToken":null},
      {"opType":"resolveRegionalImpact","label":"Resolve a regional impact","description":"Marks a regional impact as resolved and records its outcome.","klass":"macro","slice":"campaignRegionalSlice","targetScope":"campaign","receiptRef":"impact-result","undoToken":null},
      {"opType":"requestNarrative","label":"Request narrative refinement","description":"Sends the settlement for AI narrative refinement and records the result to the chronicle. It can be reverted to the raw generated text.","klass":"macro","slice":"aiSlice","targetScope":"save","receiptRef":"AI_GENERATION_COMPLETED+chronicle","undoToken":"revertCurrentToRaw"},
      {"opType":"requestDailyLife","label":"Request a daily-life account","description":"Requests an AI daily-life account for the settlement. It can be reverted to the raw generated text.","klass":"macro","slice":"aiSlice","targetScope":"save","receiptRef":"AI_GENERATION_COMPLETED","undoToken":"revertCurrentToRaw"},
      {"opType":"requestProgression","label":"Request a progression account","description":"Requests an AI account of how the settlement has progressed and records it to the chronicle. It can be reverted to the raw text.","klass":"macro","slice":"aiSlice","targetScope":"save","receiptRef":"AI_GENERATION_COMPLETED+chronicle","undoToken":"revertCurrentToRaw"},
      {"opType":"applyCosmeticRename","label":"Apply a cosmetic rename","description":"Applies a purely cosmetic rename returned by narrative refinement, without changing any underlying canon.","klass":"macro","slice":"aiSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"revertCurrentToRaw","label":"Revert to the raw text","description":"Discards the AI-refined narrative for the current settlement and restores the raw generated text, recording a chronicle entry.","klass":"macro","slice":"aiSlice","targetScope":"save","receiptRef":"chronicle-entry","undoToken":null},
      {"opType":"applyCustomContentCommand","label":"Apply a custom-content command","description":"Executes one reviewed custom-content mutation through the durable command boundary, preserving immutable revisions and returning a persistence receipt.","klass":"macro","slice":"customContentSlice","targetScope":"global","receiptRef":"application-command-receipt","undoToken":null},
      {"opType":"applyReviewedSupplyChainCommand","label":"Apply a reviewed supply-chain command","description":"Confirms, revises, restores, or removes one derived supply-chain review through its dedicated immutable command boundary.","klass":"macro","slice":"customContentSlice","targetScope":"global","receiptRef":"reviewed-supply-chain-receipt","undoToken":null},
      {"opType":"importCustomContentArchive","label":"Import a custom-content archive","description":"Atomically imports a complete versioned custom-content graph, then refreshes its active, archived, and environment projections after persistence is confirmed.","klass":"macro","slice":"customContentSlice","targetScope":"global","receiptRef":"custom-content-archive-receipt","undoToken":null},
      {"opType":"loadCustomContentFromCloud","label":"Load custom content from the cloud","description":"Loads the account's saved custom content into the store from the cloud.","klass":"macro","slice":"customContentSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"migrateLocalCustomContentToCloud","label":"Migrate local custom content to the cloud","description":"Atomically transfers the anonymous and signed-in browser ledgers into the account's cloud graph, clearing local authorities only after a confirmed receipt.","klass":"macro","slice":"customContentSlice","targetScope":"global","receiptRef":"custom-content-archive-receipt","undoToken":null},
      {"opType":"importAccountData","label":"Import account data","description":"Imports a full account export of campaigns, saves, and custom content into the store, recording a gallery-imported entry.","klass":"macro","slice":"accountImportSlice","targetScope":"global","receiptRef":"GALLERY_IMPORTED","undoToken":null},
      {"opType":"canonizeCampaignWorld","label":"Canonize the campaign world","description":"Commits the campaign's living-world state as canon, recording a world-canonized entry.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":"world_canonized","undoToken":null},
      {"opType":"canonizeCampaignWorldSpatial","label":"Canonize the spatial world","description":"Commits the campaign's spatial map world state as canon and records a spatial digest.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":"spatialDigest","undoToken":null},
      {"opType":"updateCampaignSimulationRules","label":"Update the simulation rules","description":"Changes which living-world systems are enabled for the campaign and records the change in the ruleset log.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":"rulesetLog","undoToken":null},
      {"opType":"advanceCampaignWorld","label":"Advance the world","description":"Runs the world pulse forward, advancing the campaign's region by the chosen span and recording a pulse record. It can be undone with Undo last pulse.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":"pulse-record","undoToken":"undoLastPulse"},
      {"opType":"catchUpCampaignWorld","label":"Catch the world up","description":"Advances the campaign's world through any elapsed time it had fallen behind, without a manual pulse. The whole caught-up span is one step, writes one pulse record, and can be undone with Undo last pulse.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":"pulse-record","undoToken":"undoLastPulse"},
      {"opType":"applyCampaignContentBindingMigration","label":"Apply a campaign content migration","description":"Applies one reviewed immutable content-binding migration or rollback through compare-and-swap persistence, preserving the campaign's prior binding in history.","klass":"macro","slice":"campaignSlice","targetScope":"campaign","receiptRef":"campaign-content-binding-receipt","undoToken":null},
      {"opType":"resolveIntervalMajors","label":"Resolve interval majors","description":"Resolves the major events queued for a world-pulse interval and records them in the pulse record. It can be undone with Undo last pulse.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":"pulse-record","undoToken":"undoLastPulse"},
      {"opType":"applyWorldPulseProposal","label":"Apply a world-pulse proposal","description":"Applies a proposed world-pulse change to campaign canon and records it in the pulse record. It can be undone with Undo a proposal apply for the current session.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":"pulse-record","undoToken":"undoLastProposalApply"},
      {"opType":"recordPartyImpact","label":"Record a party impact","description":"Records the party's effect on the region as a world-pulse entry, so player action becomes part of the living world.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":"pulse-record","undoToken":null},
      {"opType":"recordCanonRelationshipRipple","label":"Record a relationship ripple","description":"Records a ripple change to the canon relationships between settlements. It can be reversed.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":null,"undoToken":"reverseCanonRelationshipRipple"},
      {"opType":"reverseCanonRelationshipRipple","label":"Reverse a relationship ripple","description":"Undoes a previously recorded canon relationship ripple.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"dismissWorldPulseProposal","label":"Dismiss a world-pulse proposal","description":"Rejects a pending world-pulse proposal, recording its dismissed status without applying it.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":"proposal-status","undoToken":null},
      {"opType":"stageRealmVerb","label":"Stage a realm action","description":"Mints a realm-level action as a pending world-pulse proposal for review. Applying or dismissing it uses the pulse-proposal verbs.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":"realm-proposal","undoToken":null},
      {"opType":"undoLastPulse","label":"Undo last pulse","description":"Reverses the most recent world pulse on the campaign, rolling the living world back.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"undoLastProposalApply","label":"Undo a proposal apply","description":"Reverses the most recent applied world-pulse proposal on the campaign, restoring the world and its settlements to just before the apply. The proposal returns to pending review.","klass":"macro","slice":"campaignWorldPulseSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"setSceneQualityMode","label":"Set the portrait quality ceiling","description":"Sets how much detail the 3D settlement portrait is allowed to render on this device. The portrait can still lower detail below the ceiling to stay responsive, and the choice is remembered for this browser.","klass":"mechanical","slice":"displayPrefsSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"setAdvanceAutoResolve","label":"Set the auto-resolve mode","description":"Chooses whether the world resolves major events on its own while time advances. When it is on, advancing time never stops to ask, and every major decision the world raises is settled by the engine and recorded as an engine ruling. When it is off, time stops at the first major decision and those decisions wait for you. The choice is remembered for this browser.","klass":"mechanical","slice":"campaignWorldPulseSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"queueEdit","label":"Queue an edit","description":"Adds a single pending edit to the settlement, to be committed later. The edit can be reverted on its own.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":"revertSingleEdit"},
      {"opType":"revertSingleEdit","label":"Revert a single edit","description":"Removes one queued pending edit from the settlement.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"revertPendingEdits","label":"Revert all pending edits","description":"Discards every queued pending edit on the settlement without committing them.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"setSettlement","label":"Set the settlement","description":"Replaces the active settlement in the store with a given settlement.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"clearSettlement","label":"Clear the settlement","description":"Clears the currently loaded settlement from the store.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"setSavedSettlements","label":"Set the saved settlements","description":"Replaces the full list of saved settlements in the store.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"setActiveSaveId","label":"Set the active save","description":"Selects which saved settlement is the active one.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"clearSavedSettlements","label":"Clear saved settlements","description":"Removes all saved settlements from the store.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"removeSavedSettlement","label":"Remove a saved settlement","description":"Deletes one settlement from the saved-settlements list.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"updateSavedSettlement","label":"Update a saved settlement","description":"Writes changed fields onto one saved settlement in the list.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"renameNPC","label":"Rename an NPC","description":"Renames a named NPC within the settlement and carries the new name through its references.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"renameFaction","label":"Rename a faction","description":"Renames a faction and carries the new name through the settlement: its place in the power structure, the governing seat, every member, the institutions it founded, and any neighbouring settlement that names it.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"applyUserEditAction","label":"Apply a manual edit","description":"Applies a manual user edit to the settlement. It can be reversed with Revert a manual edit.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":"revertUserEditAction"},
      {"opType":"revertUserEditAction","label":"Revert a manual edit","description":"Reverses a previously applied manual user edit.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":"applyUserEditAction"},
      {"opType":"persistActiveSaveEdit","label":"Persist an edit to the active save","description":"Writes an edit to the active save so the change survives a reload.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"markExported","label":"Mark as exported","description":"Flags the settlement as having been exported, for example to a PDF dossier.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"setLock","label":"Set a section lock","description":"Locks a part of the settlement. A locked section refuses to reroll. Locked characters survive any reroll, including a full regenerate, where they take a place in the new town. A full regenerate also keeps the locked name, terrain and history.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"clearLocks","label":"Clear section locks","description":"Removes every lock from the settlement, so nothing is held back from a reroll. To recover a lock, set it again.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"hydrateFromSave","label":"Load state from a save","description":"Rebuilds the working settlement state from a saved settlement.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"renameSettlement","label":"Rename the settlement","description":"Changes the settlement's name.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"applyMapEdit","label":"Apply a map edit","description":"Writes a cosmetic town-map edit, such as a nudge, a reroll, or a legend preference, into the settlement's saved map edits.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"applyFogEdit","label":"Apply a fog-of-war edit","description":"Records a fog-of-war reveal of a district, street, or building into the settlement's per-session fog state.","klass":"mechanical","slice":"fogEditSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"retryOutbox","label":"Retry the sync outbox","description":"Retries any campaign changes that failed to sync to the cloud.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"loadCampaigns","label":"Load campaigns","description":"Loads the account's campaigns into the store.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"clearCampaigns","label":"Clear campaigns","description":"Removes all campaigns from the store.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"invalidateCampaignSession","label":"Invalidate the campaign session","description":"Advances the campaign session boundary and clears in-flight campaign locks so stale asynchronous work cannot commit after credentials change.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"createCampaign","label":"Create a campaign","description":"Creates a new, empty campaign.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"createImportedCampaign","label":"Create an imported campaign","description":"Persists one complete remapped campaign envelope and publishes it locally only after the selected authority confirms the insert.","klass":"macro","slice":"campaignSlice","targetScope":"campaign","receiptRef":"imported-campaign-persistence-receipt","undoToken":null},
      {"opType":"renameCampaign","label":"Rename a campaign","description":"Changes a campaign's name.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"deleteCampaign","label":"Delete a campaign","description":"Removes a campaign and its membership from the store.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"toggleCampaignCollapsed","label":"Collapse or expand a campaign","description":"Toggles whether a campaign is shown collapsed in the list.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"addToCampaign","label":"Add a settlement to a campaign","description":"Adds a saved settlement to a campaign's membership.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"removeFromCampaign","label":"Remove a settlement from a campaign","description":"Removes a settlement from a campaign's membership.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"withSettlementDeletionLock","label":"Guard a settlement deletion","description":"Serializes settlement deletion against campaign advances and membership changes.","klass":"mechanical","slice":"campaignSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"executeImportReconciliationDraft","label":"Apply an import reconciliation command","description":"Executes one reviewed settlement create-or-attach draft through the durable application command plane.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":"application-command-receipt","undoToken":null},
      {"opType":"saveCampaignMap","label":"Save the campaign map","description":"Stores the campaign's map state.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"clearCampaignMap","label":"Clear the campaign map","description":"Removes the stored map from a campaign.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"updateSavedCampaign","label":"Update a campaign","description":"Writes changed fields onto a saved campaign.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"appendCampaignChronicle","label":"Append to the campaign chronicle","description":"Adds an entry to the campaign's chronicle history.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"markCampaignLettersRead","label":"Mark campaign letters read","description":"Marks a campaign's pending letters as read.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"importTableEvents","label":"Import table events","description":"Commits confirmed tabletop events into a campaign's news history at the chosen ticks.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"setActiveCampaign","label":"Set the active campaign","description":"Selects which campaign is the active one.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"queueSettlementEvent","label":"Queue a settlement event","description":"Adds an event to a settlement's queue to be applied at a future tick.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"cancelQueuedEvent","label":"Cancel a queued event","description":"Removes a queued settlement event before it is applied.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"updateQueuedEvent","label":"Update a queued event","description":"Edits a queued settlement event in place before it is applied.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"stageComposerIntent","label":"Stage a composer intent","description":"Stages a target-first intent for the event composer, writing only the transient composer-intent field.","klass":"mechanical","slice":"settlementSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"setRegionalChannelStatus","label":"Set a regional channel status","description":"Sets the status of a channel, such as a trade route or a war front, between two settlements in the region.","klass":"mechanical","slice":"campaignRegionalSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"setCampaignRegionalGraph","label":"Set the regional graph","description":"Replaces the campaign's regional graph with a given graph.","klass":"mechanical","slice":"campaignRegionalSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"setRegionalImpactStatus","label":"Set a regional impact's status","description":"Changes the status of a queued regional impact.","klass":"mechanical","slice":"campaignRegionalSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"setAiSettlement","label":"Set the AI settlement","description":"Stores an AI-refined version of the settlement. It can be reverted to the raw text.","klass":"mechanical","slice":"aiSlice","targetScope":"save","receiptRef":null,"undoToken":"revertCurrentToRaw"},
      {"opType":"clearAiSettlement","label":"Clear the AI settlement","description":"Removes the stored AI-refined settlement.","klass":"mechanical","slice":"aiSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"hydrateAiFromSave","label":"Load AI content from a save","description":"Restores stored AI content from a saved settlement.","klass":"mechanical","slice":"aiSlice","targetScope":"save","receiptRef":null,"undoToken":null},
      {"opType":"setAuth","label":"Set the auth session","description":"Stores the current sign-in session. It can be cleared with Clear the auth session.","klass":"mechanical","slice":"authSlice","targetScope":"global","receiptRef":null,"undoToken":"clearAuth"},
      {"opType":"clearAuth","label":"Clear the auth session","description":"Signs the user out locally by clearing the sign-in session.","klass":"mechanical","slice":"authSlice","targetScope":"global","receiptRef":null,"undoToken":"setAuth"},
      {"opType":"clearDossierEntitlements","label":"Clear dossier entitlements","description":"Removes all stored dossier entitlements.","klass":"mechanical","slice":"authSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"refreshDossierEntitlement","label":"Refresh a dossier entitlement","description":"Re-reads a dossier entitlement's current state.","klass":"mechanical","slice":"authSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"initAuth","label":"Initialize sign-in","description":"Sets up the sign-in session on startup from any stored session.","klass":"mechanical","slice":"authSlice","targetScope":"global","receiptRef":null,"undoToken":"clearAuth"},
      {"opType":"authSignUp","label":"Sign up","description":"Creates a new account and stores the resulting session.","klass":"mechanical","slice":"authSlice","targetScope":"global","receiptRef":null,"undoToken":"clearAuth"},
      {"opType":"authSignIn","label":"Sign in","description":"Signs the user in and stores the resulting session.","klass":"mechanical","slice":"authSlice","targetScope":"global","receiptRef":null,"undoToken":"clearAuth"},
      {"opType":"listCustomContentRevisions","label":"Load custom-content revision history","description":"Loads one custom definition's immutable revision history into the inspection cache without changing its active head.","klass":"mechanical","slice":"customContentSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"loadArchivedCustomContent","label":"Load archived custom content","description":"Loads archived custom-content heads into their separate inspection projection without restoring them to generation.","klass":"mechanical","slice":"customContentSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"loadCustomContentEnvironments","label":"Load custom-content environments","description":"Loads immutable environment history and the durable active-environment pointer into the store.","klass":"mechanical","slice":"customContentSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"rollbackCustomContentEnvironment","label":"Roll back a custom-content environment","description":"Reactivates a reviewed immutable environment revision through the durable command boundary; no environment history is overwritten.","klass":"mechanical","slice":"customContentSlice","targetScope":"global","receiptRef":"application-command-receipt","undoToken":null},
      {"opType":"pinLegacyCampaignContentBindings","label":"Pin legacy campaign content","description":"Captures the correct owner's resolved custom definitions for legacy campaigns so future simulation cannot drift with later library edits.","klass":"mechanical","slice":"campaignSlice","targetScope":"campaign","receiptRef":"campaign-content-binding","undoToken":null},
      {"opType":"clearCloudCustomContent","label":"Clear cloud custom content","description":"Clears the account's cloud custom content. It can be reloaded from the cloud.","klass":"mechanical","slice":"customContentSlice","targetScope":"global","receiptRef":null,"undoToken":"loadCustomContentFromCloud"},
      {"opType":"stageCorpusCandidates","label":"Stage corpus candidates","description":"Adds candidate entries to the custom-content corpus staging catalog for review. A candidate can be removed.","klass":"mechanical","slice":"corpusFactorySlice","targetScope":"global","receiptRef":null,"undoToken":"removeCorpusCandidate"},
      {"opType":"reviewCorpusCandidate","label":"Review a corpus candidate","description":"Records a review decision on a staged corpus candidate.","klass":"mechanical","slice":"corpusFactorySlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"removeCorpusCandidate","label":"Remove a corpus candidate","description":"Removes a candidate from the corpus staging catalog.","klass":"mechanical","slice":"corpusFactorySlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"addPlacement","label":"Add a map placement","description":"Places a marker or feature on the campaign map. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"removePlacementLocal","label":"Remove a map placement","description":"Removes a placement from the campaign map. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"updatePlacement","label":"Update a map placement","description":"Changes a placement on the campaign map.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"clearAllPlacementsLocal","label":"Clear all map placements","description":"Removes every placement from the campaign map. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"applyAutoplacement","label":"Place every settlement at once","description":"Moves the campaign's settlements to the best-fitting ground on the realm map, after the consent popup itemizes each move. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":"wizardNews","undoToken":"mapUndo"},
      {"opType":"addLabel","label":"Add a map label","description":"Adds a text label to the campaign map. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"updateLabel","label":"Update a map label","description":"Changes a label on the campaign map.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"deleteLabel","label":"Delete a map label","description":"Removes a label from the campaign map. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"addMarker","label":"Add a map marker","description":"Adds a marker to the campaign map. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"updateMarker","label":"Update a map marker","description":"Changes a marker on the campaign map.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"deleteMarker","label":"Delete a map marker","description":"Removes a marker from the campaign map. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"addForest","label":"Add a map forest","description":"Adds a forest area to the campaign map. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"updateForest","label":"Update a map forest","description":"Changes a forest area on the campaign map.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"deleteForest","label":"Delete a map forest","description":"Removes a forest area from the campaign map. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"setMapSnapshot","label":"Set the map snapshot","description":"Stores a snapshot of the campaign map's current state.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"setMapBackdrop","label":"Set the map backdrop","description":"Sets the backdrop image for the campaign map.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"clearMapBackdrop","label":"Clear the map backdrop","description":"Removes the campaign map's backdrop image.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"bumpGeometryVersion","label":"Bump the map geometry version","description":"Advances the map geometry version so dependent layers know to recompute.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"replaceMapState","label":"Replace the map state","description":"Replaces the campaign's entire map state with a given state.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"resetMapState","label":"Reset the map state","description":"Clears the campaign map back to an empty state.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":null},
      {"opType":"pushMapUndo","label":"Push a map undo step","description":"Records the current map state as an undo step. It can be undone with the map undo.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"mapUndo","label":"Undo a map change","description":"Reverses the most recent campaign-map change. It can be redone.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapRedo"},
      {"opType":"mapRedo","label":"Redo a map change","description":"Re-applies a campaign-map change that was undone. It can be undone again.","klass":"mechanical","slice":"mapSlice","targetScope":"campaign","receiptRef":null,"undoToken":"mapUndo"},
      {"opType":"clearNeighbour","label":"Clear a neighbour","description":"Removes a settlement's neighbour link data.","klass":"mechanical","slice":"neighbourSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"setCreditBalance","label":"Set the credit balance","description":"Sets the account's narrative-credit balance to a given amount.","klass":"mechanical","slice":"creditsSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"updateConfig","label":"Update the generation settings","description":"Changes the settlement generation settings, such as size, sliders, and options.","klass":"mechanical","slice":"configSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"toggleInstitution","label":"Toggle an institution","description":"Turns one institution on or off in the generation settings.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"setInstitutionToggles","label":"Set institution choices","description":"Replaces the full set of institution on-or-off choices.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"toggleCategory","label":"Toggle a category","description":"Turns a whole institution category on or off in the generation settings.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"setCategoryToggles","label":"Set category choices","description":"Replaces the full set of category on-or-off choices.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"toggleGood","label":"Toggle a trade good","description":"Turns one trade good on or off in the generation settings.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"setGoodsToggles","label":"Set trade-good choices","description":"Replaces the full set of trade-good on-or-off choices.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"toggleService","label":"Toggle a service","description":"Turns one service on or off in the generation settings.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"setServiceToggles","label":"Set service choices","description":"Replaces the full set of service on-or-off choices.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"resetAllToggles","label":"Reset every toggle","description":"Restores all generation choices to their defaults.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"bulkSetInstitutions","label":"Bulk-set institutions","description":"Sets many institution choices at once.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"bulkSetServices","label":"Bulk-set services","description":"Sets many service choices at once.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null},
      {"opType":"bulkSetGoods","label":"Bulk-set trade goods","description":"Sets many trade-good choices at once.","klass":"mechanical","slice":"toggleSlice","targetScope":"global","receiptRef":null,"undoToken":null}
    ]
  },
  "faith": {
    "authorship": "Deities enter a world only through custom-content authoring; there is no premade roster. You author a god on the four axes below, and the living pantheon does the rest as the faith spreads.",
    "temperNote": "Temperament is not a dial you set. The engine derives it from the alignment and law axes: evil and chaos push a god warlike, good and law push it peacelike.",
    "axes": [
      {"id":"alignment","label":"Alignment","lines":["Good, and purges corruption, installing incorruptible successors","Evil, and corrupts the faithful even without organized crime"]},
      {"id":"law","label":"Law","lines":["Lawful, and strengthens law and order","Chaotic, and erodes order, tolerating corruption"]},
      {"id":"rank","label":"Rank","lines":["Major, and anchors religious authority (a lift of 18)","Minor, and lends modest religious authority (a lift of 10)","Cult: a fringe following with little authority (a lift of 5)"]},
      {"id":"temperament","label":"Temperament","derived":true,"lines":["Warlike, and raises the realm's aggression","Peacelike, and tempers the realm's aggression"]}
    ]
  },
  "terrain": [
    {"id":"riverside","reading":"On a river. Mills, ferries, and cheap bulk trade, and floods are its calamity."},
    {"id":"coastal","reading":"On the sea. Fishing, ports, and maritime trade, and storms are its calamity."},
    {"id":"mountain","reading":"High and rugged. Ore and strong defense, though low agriculture leans on imports, and quakes are its calamity."},
    {"id":"hills","reading":"Rolling high ground. Stone and defensible sites, though low agriculture leans on imports, and quakes are its calamity."},
    {"id":"forest","reading":"Wooded country. Timber and game, and fire is its calamity."},
    {"id":"plains","reading":"Open, arable land. Strong agriculture, and fire is its calamity."},
    {"id":"desert","reading":"Arid land. Sparse agriculture and hard travel, and storms are its calamity."}
  ],
  "cultures": {
    "values": [
      {"id":"mixed","label":"Mixed"},
      {"id":"germanic","label":"Germanic"},
      {"id":"latin","label":"Latin"},
      {"id":"celtic","label":"Celtic"},
      {"id":"arabic","label":"Arabic"},
      {"id":"norse","label":"Norse"},
      {"id":"slavic","label":"Slavic"},
      {"id":"east_asian","label":"East Asian"},
      {"id":"mesoamerican","label":"Mesoamerican"},
      {"id":"south_asian","label":"South Asian"},
      {"id":"steppe","label":"Steppe"},
      {"id":"greek","label":"Greek"}
    ],
    "note": "Culture shapes flavour more than math: the names of settlements and NPCs, the adjectives on traditions, the demand profile, and which gods a world tends to seed at the start. Mixed is the default, with no single culture. This is distinct from the culture-distance the living world derives to measure how alike two settlements behave."
  },
  "factionArchetypes": [
    {"id":"government","label":"Government","reading":"The ruling administration and its offices."},
    {"id":"noble","label":"Noble","reading":"Landed or hereditary elites."},
    {"id":"military","label":"Military","reading":"The garrison, guard, or standing force."},
    {"id":"merchant","label":"Merchant","reading":"Trade houses, guilds, and commercial interests."},
    {"id":"religious","label":"Religious","reading":"Temples, clergy, and faith institutions."},
    {"id":"criminal","label":"Criminal","reading":"Organized crime and the black market."},
    {"id":"arcane","label":"Arcane","reading":"Mages, academies, and arcane orders."},
    {"id":"craft","label":"Craft","reading":"Artisans and production guilds."},
    {"id":"labor","label":"Labor","reading":"Workers, labourers, and their organizations."},
    {"id":"outsider","label":"Outsider","reading":"A foreign or external power with a foothold."},
    {"id":"occupation","label":"Occupation","reading":"An occupying force holding the settlement."},
    {"id":"civic","label":"Civic","reading":"Civic bodies and community institutions."},
    {"id":"other","label":"Other","reading":"A faction that fits none of the above."}
  ],
  "governance": {
    "labels": [
      {"label":"Stable","reading":"Settled governance with no dominant strain."},
      {"label":"Ordered","reading":"Stable under a strong military presence."},
      {"label":"Tense","reading":"Stable but under external threat or monster pressure."},
      {"label":"Fragile","reading":"Held by private security, with no public law."},
      {"label":"Vulnerable","reading":"Prosperous but underdefended."},
      {"label":"Unstable","reading":"Pervasive organized crime, up to outright criminal governance."},
      {"label":"Enforced Order","reading":"Authoritarian control."},
      {"label":"Rigid","reading":"A militant theocracy."}
    ],
    "note": "An active stress overrides the base label with a compound form (for example Critical under an active siege, Suppressed under occupation, or Fractured, Shaken, and Desperate under others)."
  },
  "lenses": {
    "count": 5,
    "entries": [
      {"id":"parchment","label":"Parchment","reading":"The default hand-drawn plate."},
      {"id":"watercolor","label":"Watercolor","reading":"Soft washes and muted colour."},
      {"id":"darkFantasy","label":"Dark Fantasy","reading":"Grim, high-contrast linework."},
      {"id":"vtt","label":"VTT","reading":"A bare grid and scale bar for virtual tabletops."},
      {"id":"accessible","label":"Accessible","reading":"Colourblind-safe, high-contrast linework (Okabe-Ito)."}
    ],
    "illustratedNote": "A sixth lens, Illustrated, re-shapes the map geometry rather than re-skinning it, so it sits outside the five-lens re-skin family above.",
    "schema": {
      "furniture": ["wash","cartouche","compass","grid","scaleBar"],
      "hazardGlyphs": ["triangle","diamond","pin"],
      "anchorGlyphs": ["disc","ring","star"],
      "contrastLevels": ["soft","normal","high"]
    }
  },
  "districts": {
    "wealth": [
      {"label":"Destitute","reading":"The poorest quarter; want is the rule."},
      {"label":"Poor","reading":"Getting by, with little to spare."},
      {"label":"Modest","reading":"Ordinary means."},
      {"label":"Comfortable","reading":"Reliable means and some surplus."},
      {"label":"Wealthy","reading":"Visibly well off."},
      {"label":"Opulent","reading":"The richest quarter; conspicuous wealth."}
    ],
    "safety": [
      {"label":"Lawless","reading":"No effective law; the quarter is left to itself."},
      {"label":"Unsafe","reading":"Crime outpaces what watch there is."},
      {"label":"Watched","reading":"A watch is present but stretched."},
      {"label":"Orderly","reading":"Law holds day to day."},
      {"label":"Fortified","reading":"Heavily secured and closely held."}
    ],
    "categories": ["religious","merchant","military","craft","noble","civic","arcane","criminal","foreign","industrial","residential"],
    "note": "District wealth grades one quarter of a town; the settlement-wide economy is graded by Prosperity, which happens to share the words Poor, Comfortable, and Wealthy."
  },
  "lifecycle": {
    "remnants": [
      {"label":"Relic ruin","reading":"A settlement that peaked at city or larger; a privileged resettlement site."},
      {"label":"Abandoned site","reading":"A settlement that died before it ever reached city."}
    ],
    "satellites": "A satellite thorp grows into a hamlet and can charter at village scale; a starving satellite returns its people to the parent, and adjacent steadings converge into one. Every step moves population in conserved amounts."
  },
  "npcGoals": {
    "entries": [
      {"id":"secure_office","label":"Secure office","reading":"Win or hold a seat of power."},
      {"id":"protect_followers","label":"Protect followers","reading":"Shield the NPC's people from harm."},
      {"id":"expand_influence","label":"Expand influence","reading":"Grow reach and standing."},
      {"id":"settle_rivalry","label":"Settle a rivalry","reading":"Resolve a feud, by force or otherwise."},
      {"id":"restore_order","label":"Restore order","reading":"Put down disorder and reassert control."},
      {"id":"profit_from_change","label":"Profit from change","reading":"Turn upheaval to advantage."},
      {"id":"control_institution","label":"Control an institution","reading":"Capture a key body."},
      {"id":"win_public_legitimacy","label":"Win public legitimacy","reading":"Earn the populace's acceptance."},
      {"id":"bind_external_patron","label":"Bind an external patron","reading":"Secure a foreign backer."},
      {"id":"survive_crisis","label":"Survive a crisis","reading":"Get through an immediate threat."}
    ],
    "note": "An NPC acts toward a short-term and a long-term goal; a goal culminates once it reaches high progress."
  },
  "powerStructure": {
    "transferCauses": [
      {"id":"coup","label":"Coup","reading":"Seized by force."},
      {"id":"election","label":"Election","reading":"Chosen by a vote."},
      {"id":"succession","label":"Succession","reading":"Inherited or handed down."},
      {"id":"conquest","label":"Conquest","reading":"Imposed by an outside conqueror."},
      {"id":"appointment","label":"Appointment","reading":"Installed by a higher authority."}
    ],
    "note": "A settlement's government type is the name of its governing faction. Power changes hands by one of these causes, which the chronicle stamps on each regime change."
  },
  "corruption": {
    "vectors": [
      {"label":"Greed","reading":"Bought with wealth."},
      {"label":"Hunger for status","reading":"Lured with rank and honour."},
      {"label":"Fear","reading":"Coerced by threat."},
      {"label":"Forbidden patron","reading":"Bound to a forbidden backer."}
    ],
    "note": "An institution reads compromised in two ways: covertly, as a hidden stooge homed inside it, or revealed, as a scandal-bearing impairment. It needs a corruptible flaw and a criminal institution present; organic exposure is the counter-force that can clean it up over time."
  },
  "facets": {
    "natures": ["faith","security","trade","craft","learning","vice","civic"],
    "interiorKinds": ["faith","security","trade","craft","learning","vice","civic","generic"],
    "roomKinds": ["nave","sanctuary","vestry","muster","armory","cells","quarters","hall","counting","strongroom","stall","workfloor","store","kiln","reading","stacks","study","common","kitchen","cellar","lodging","chamber","records","dais","main","back","evidence","concealed"],
    "furnishingKinds": ["table","bench","pew","altar","brazier","shelf","lectern","desk","counter","strongbox","ledger","workbench","hearth","rack","crate","barrel","bar","bed","bunk","dais","cell","cauldron"]
  },
  "calamity": {
    "flavors": [
      {"key":"flood","title":"Great Flood"},
      {"key":"fire","title":"Great Fire"},
      {"key":"quake","title":"Great Quake"},
      {"key":"storm","title":"Great Storm"}
    ],
    "severityBands": [
      {"key":"minor","scale":0.7,"kFactor":0.5},
      {"key":"moderate","scale":1,"kFactor":1},
      {"key":"severe","scale":1.3,"kFactor":1}
    ],
    "terrainMap": [
      {"terrain":"riverside","type":"flood"},
      {"terrain":"coastal","type":"storm"},
      {"terrain":"mountain","type":"quake"},
      {"terrain":"hills","type":"quake"},
      {"terrain":"forest","type":"fire"},
      {"terrain":"plains","type":"fire"},
      {"terrain":"desert","type":"storm"}
    ]
  },
  "systems": [
    {"id":"doctrine","label":"Doctrine — supply-web warfare","flag":"supplyWebWarfareEnabled","blurb":"Lets a warring power fight indirectly by striking the enemy's supply villages, through raids, occupation, embargo, tolls, and interdiction, instead of meeting its army head on. The strangled supply can force an early peace, and preying on innocents drifts the aggressor's reputation.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"momentum","label":"Momentum","flag":"momentumEnabled","blurb":"Tracks each power's public commitment to a course of action, built up by visible acts like sieges and mobilizations. Once commitment runs high it resists the rational exit, modelling sunk cost and the cost of losing face.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"upswing","label":"Upswing arcs","flag":"upswingArcsEnabled","blurb":"Drives recovery and growth: rebuilding after calamity or siege, boom and bust from sustained trade, and bounded golden ages. Every gain is paid for from a real source, never conjured.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"resources","label":"Resource dynamics","flag":"resourceDynamicsEnabled","blurb":"Lets a settlement's resource nodes change over time, with rare discovery of a new terrain-appropriate resource and the loss of a nonrenewable one that has stayed depleted too long.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"generosity","label":"Constructive flows — generosity","flag":"constructiveFlowsEnabled","blurb":"Models whether an ally gives or withholds relief to a settlement in need, weighing bond and conscience against its own margin and risks. Aid is a conserved transfer with a granary floor it never crosses, and every choice is remembered as an obligation.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"peace","label":"The peace engine","flag":"peaceEngineEnabled","blurb":"When a war ends in a suit for peace, the victor imposes treaty terms, from tribute and forced alliance to demilitarization and a puppet seat. Terms run on believed strength, can be cheated under fog, and a broken treaty becomes the cause of the next war.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"navy","label":"The naval layer","flag":"navalEnabled","blurb":"Adds sea power to a mapped realm: convoys carry armies to reachable ports, hostile fleets fight where they share a sea lane, and a blockade can put a port under siege. It stays inert until a realm is placed on the map.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"convergence","label":"Foreign intervention","flag":"interventionEnabled","blurb":"Lets a foreign power throw its weight into another settlement's internal struggle, currently a coup, to tip the outcome toward the side it favours. Feasibility and motive decide whether the gamble pays off.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"lifecycle","label":"Settlement lifecycle","flag":"settlementLifecycleEnabled","blurb":"Lets settlements be born and die on their own: crowded, prosperous towns spawn satellite thorps that grow, starve, or merge, and a failing settlement can reach a terminal death, leaving a resettlable ruin only if it once grew large. Population and food move in conserved amounts at every step.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"corruption","label":"The corruption web","flag":"corruptionWebEnabled","blurb":"Lets a foreign patron covertly turn a corruptible official inside a rival settlement, buying sight into it and a measure of hidden influence. It is off in every default preset today and wakes only under a custom ruleset.","presetGated":false,"dormant":true,"presets":[]},
    {"id":"infoStatecraft","label":"Information statecraft","flag":"infoStatecraftEnabled","blurb":"Gives each power a credibility standing and the ability to plant a lie, which can spread, be contradicted, and finally be exposed for a reputational cost. It is off in every default preset today and wakes only under a custom ruleset.","presetGated":false,"dormant":true,"presets":[]},
    {"id":"distancePricedNews","label":"News pays for distance","flag":"distancePricedNewsEnabled","blurb":"Makes reports from farther settlements arrive effectively older, with additional delay when a route is embattled. It stays inert without a canonized realm map or when the campaign uses omniscient information.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"reframe","label":"Gifts and debts remembered","flag":"reframeEnabled","blurb":"Lets a settlement reinterpret an old gift, tribute, or dependence as relationships change, while leaving the underlying receipt untouched. Meaning can sour or reconcile; recorded facts are never rewritten.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"spatialConsequence","label":"Spatial consequence","flag":"spatialConsequenceEnabled","blurb":"On a mapped realm, it decides where a calamity's toll, a siege's breach, and corruption's creep actually fall across districts, without changing any totals.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"provenance","label":"The provenance ledger","flag":"provenanceLedgerEnabled","blurb":"Records the true parent cause of each durable outcome into a ledger, so the chronicle can mark a link as genuinely recorded rather than merely inferred from time and place.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"urbanFabric","label":"Urban fabric","flag":"urbanFabricEnabled","blurb":"Gives each district a slowly decaying sense of prominence, so old power and wealth linger after a regime or economy shifts instead of flipping at once. It also tracks a gradual alignment grain and fading scars from past disasters.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"npcGrowth","label":"NPC growth","flag":"npcGrowthEnabled","blurb":"Lets NPCs slowly change: lived events like calamity, betrayal, or a golden age build pressure that can, rarely, add an acquired trait over an NPC's authored core, never overwriting it.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"npcLadder","label":"The contested court","flag":"npcLadderEnabled","blurb":"Gives each faction a persistent rank ladder. NPCs rise by displacing a named rival and fall when displaced, so advancement changes the court without creating titles or resolving anyone's fate.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"traditions","label":"Living traditions","flag":"traditionsEnabled","blurb":"Gives every settlement recurring observances with a durable origin, an accountable keeper, and outcomes shaped by the local economy. Traditions can flourish, fail, migrate, or be imposed without losing their history.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"roads","label":"Named travellers on the roads","flag":"roadsEnabled","blurb":"Lets named NPCs travel for diplomacy, trade, dominion, and observance across a canonized realm. Journeys take time and can lead to capture, ransom, rescue, or return, but the engine never resolves a traveller's life.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","living_realm","full_simulation"]},
    {"id":"calamity","label":"The Great Calamity","flag":"disastersEnabled","blurb":"A rare seeded disaster can strike a settlement, knocking out a few of its non-essential institutions and killing a bounded share of its people. The aftermath, from severed supply chains to exodus and unrest, emerges from the other systems rather than being scripted.","presetGated":true,"dormant":false,"presets":["dramatic_campaign","full_simulation"]}
  ],
  "presets": [
    {"id":"quiet_local","label":"Quiet Local","isDefault":false,"summary":"A quiet local game. Time passes, but the wider region stays still.","intensity":"conservative","autonomy":"routine","autonomyLabel":"routine acts run, big moves come to you","lights":[]},
    {"id":"realistic_regional","label":"Realistic Regional","isDefault":true,"summary":"The default. The region evolves at a measured, realistic pace.","intensity":"conservative","autonomy":"routine","autonomyLabel":"routine acts run, big moves come to you","lights":[]},
    {"id":"dramatic_campaign","label":"Dramatic Campaign","isDefault":false,"summary":"A high-drama campaign. Events land hard and the world runs itself.","intensity":"dramatic","autonomy":"full","autonomyLabel":"fully autonomous","lights":["supplyWebWarfareEnabled","momentumEnabled","upswingArcsEnabled","resourceDynamicsEnabled","constructiveFlowsEnabled","peaceEngineEnabled","navalEnabled","interventionEnabled","settlementLifecycleEnabled","distancePricedNewsEnabled","reframeEnabled","spatialConsequenceEnabled","provenanceLedgerEnabled","urbanFabricEnabled","npcGrowthEnabled","npcLadderEnabled","traditionsEnabled","roadsEnabled","disastersEnabled"]},
    {"id":"static_campaign","label":"Static Campaign","isDefault":false,"summary":"Nothing moves without you. The world waits on your every decision.","intensity":"conservative","autonomy":"dm_only","autonomyLabel":"you decide everything","lights":[]},
    {"id":"narrative_campaign","label":"Narrative Campaign","isDefault":false,"summary":"A quiet stage that proposes changes but waits for your approval.","intensity":"conservative","autonomy":"recommendations","autonomyLabel":"it proposes, you approve","lights":[]},
    {"id":"living_realm","label":"Living Realm","isDefault":false,"summary":"A fully alive realm that runs the region on its own.","intensity":"conservative","autonomy":"routine","autonomyLabel":"routine acts run, big moves come to you","lights":["supplyWebWarfareEnabled","momentumEnabled","upswingArcsEnabled","resourceDynamicsEnabled","constructiveFlowsEnabled","peaceEngineEnabled","navalEnabled","interventionEnabled","settlementLifecycleEnabled","distancePricedNewsEnabled","reframeEnabled","spatialConsequenceEnabled","provenanceLedgerEnabled","urbanFabricEnabled","npcGrowthEnabled","npcLadderEnabled","traditionsEnabled","roadsEnabled"]},
    {"id":"full_simulation","label":"Full Simulation","isDefault":false,"summary":"Everything on. The most complete and demanding simulation.","intensity":"normal","autonomy":"full","autonomyLabel":"fully autonomous","lights":["supplyWebWarfareEnabled","momentumEnabled","upswingArcsEnabled","resourceDynamicsEnabled","constructiveFlowsEnabled","peaceEngineEnabled","navalEnabled","interventionEnabled","settlementLifecycleEnabled","distancePricedNewsEnabled","reframeEnabled","spatialConsequenceEnabled","provenanceLedgerEnabled","urbanFabricEnabled","npcGrowthEnabled","npcLadderEnabled","traditionsEnabled","roadsEnabled","disastersEnabled"]}
  ],
  "archetypes": {
    "count": 30,
    "authored": true,
    "categories": ["Economic","Military","Religious","Magic","Criminal","Balanced"],
    "entries": [
      {"cat":"Economic","name":"Merchant Republic","cond":"Economy ≥65, Military ≤45, Religion ≤45","desc":"Merchant guilds control governance. Trade law is the law."},
      {"cat":"Economic","name":"Trade Crossroads","cond":"Economy ≥60, route: crossroads or port","desc":"Entreport economy. Profits from flow, not production. High service density."},
      {"cat":"Economic","name":"Merchant Army","cond":"Economy ≥68, Military ≤38","desc":"Wealthy settlement replaces public guard with private security."},
      {"cat":"Economic","name":"Theocratic Economy","cond":"Religion ≥70, Economy ≤42","desc":"Church dominates economic life. Sacred goods trade x1.55."},
      {"cat":"Military","name":"Military Fortress","cond":"Military ≥72, threat: plagued","desc":"Defense first. Civilian economy secondary to garrison supply."},
      {"cat":"Military","name":"Frontier Outpost","cond":"Military ≥60, tier: thorp or hamlet, threat: frontier","desc":"Exists to hold a line. Austere, disciplined, expendable."},
      {"cat":"Military","name":"Besieged Holdout","cond":"Stress: Under Siege active","desc":"Under siege. Supply constrained. Morale is a resource."},
      {"cat":"Military","name":"Secular Brutalism","cond":"Military ≥70, Religion ≤25","desc":"No religious institutions. Military fills moral and legal vacuum."},
      {"cat":"Military","name":"State Crime","cond":"Military ≥70, Economy ≤32","desc":"Military predates on the population. Extractions, disappearances, selective enforcement."},
      {"cat":"Religious","name":"Theocracy","cond":"Religion ≥72, Military ≤45","desc":"Church is the government. Civil and religious law unified."},
      {"cat":"Religious","name":"Holy Sanctuary","cond":"Religion ≥65, Criminal ≤30, threat: heartland","desc":"Pilgrimage destination. Protected status. Trade in relics and indulgences."},
      {"cat":"Religious","name":"Crusader Synthesis","cond":"Military ≥68, Religion ≥68","desc":"Church and military fused. Sacred war is civic duty."},
      {"cat":"Religious","name":"Heresy Suppression","cond":"Religion ≥65, Magic ≤38","desc":"Church persecutes arcane practitioners. Magic goods suppressed x0.25."},
      {"cat":"Religious","name":"Religious Fraud","cond":"Religion ≥60, Criminal ≥55","desc":"Church hierarchy is corrupt. Indulgences, false relics, protection rackets."},
      {"cat":"Religious","name":"Crusader Chapter","cond":"Military ≥68, Religion ≥60, threat: plagued","desc":"Martial religious order holds the settlement against monster threat."},
      {"cat":"Magic","name":"Mage City","cond":"Magic ≥70, Economy ≥55","desc":"Arcane institutions dominate. Magic is commerce. High reagent import demand."},
      {"cat":"Magic","name":"Arcane Academy","cond":"Magic ≥72, Religion ≤40","desc":"Learning institution at center. Magic is scholarship, not faith."},
      {"cat":"Magic","name":"Magic Fills Void","cond":"Magic ≥68, Economy ≤35","desc":"Arcane supply substitutes for missing material infrastructure."},
      {"cat":"Magic","name":"Arcane Black Market","cond":"Magic ≥52, Criminal ≥58","desc":"Sophisticated magical criminal ecosystem. Import demand x1.45."},
      {"cat":"Magic","name":"Mage Theocracy","cond":"Magic ≥70, Religion ≥65","desc":"Magic and faith unified. Arcane clergy governs."},
      {"cat":"Magic","name":"Magic Militarized","cond":"Magic ≥60, Military ≥65","desc":"Arcane power weaponized. Military holds mages on retainer."},
      {"cat":"Criminal","name":"Crime Fills Vacuum","cond":"Criminal ≥62, Military ≤32","desc":"Weak enforcement lets criminal organizations become de facto governance."},
      {"cat":"Criminal","name":"Criminal Haven","cond":"Criminal ≥72, Military ≤42","desc":"Settlement actively shelters criminal networks. Law is performative."},
      {"cat":"Criminal","name":"Merchant-Criminal Blur","cond":"Economy ≥65, Criminal ≥58","desc":"Legitimate and criminal commerce are indistinguishable. Guilds run protection."},
      {"cat":"Criminal","name":"Lawless Frontier","cond":"Criminal ≥60, Military ≤30","desc":"Beyond the reach of law. Survival is personal."},
      {"cat":"Balanced","name":"Safe Province Capital","cond":"All sliders 40-65, threat: heartland","desc":"Stable, diverse, prosperous. The baseline of successful governance."},
      {"cat":"Balanced","name":"Balanced","cond":"No slider exceeds 60","desc":"No dominant faction. Power distributed. Politics negotiated."},
      {"cat":"Balanced","name":"Merchant Hunters Lodge","cond":"Military ≥60, threat: plagued","desc":"Organized monster hunters are a significant institution."},
      {"cat":"Balanced","name":"Mining Colony","cond":"Resource: ore or stone nearby, isolated","desc":"Exists to extract a resource. Company-town dynamics."},
      {"cat":"Balanced","name":"Plague of Beasts","cond":"Stress: Beast & Raider Threat active","desc":"Under active monster pressure. Civilian life constrained to fortified areas."}
    ]
  },
  "relationships": {
    "count": 8,
    "authored": true,
    "entries": [
      {"id":"trade_partner","label":"Trade Partner","color":"#1a5a28","effect":"Exports shift toward what the neighbour imports. Supply chains partially share. Complements rather than competes."},
      {"id":"allied","label":"Allied","color":"#1a3a7a","effect":"Military and economic cooperation. Elevated garrison institutions and shared defense logic on both sides."},
      {"id":"patron","label":"Patron","color":"#4a1a6a","effect":"The generating settlement is client-dependent. Economy shaped by patron demands. Fewer autonomous institutions."},
      {"id":"client","label":"Client","color":"#6a3a1a","effect":"Production biased toward what the patron needs. Trade dependency embedded in exports."},
      {"id":"rival","label":"Rival","color":"#8a5010","effect":"Competing for the same markets. Exports tend to mirror the rival and stay contested. Criminal presence elevated."},
      {"id":"cold_war","label":"Cold War","color":"#8a3010","effect":"Covert conflict. Intelligence infrastructure elevated. Criminal and military institutions higher on both sides."},
      {"id":"hostile","label":"Hostile","color":"#8b1a1a","effect":"Open conflict. Military dominates. Exports embargoed. Safety degraded. Criminal infiltration likely."},
      {"id":"neutral","label":"Neutral","color":"#6b5340","effect":"No generation influence. Minor economic contact only."}
    ]
  },
  "corpus": {
    "count": 0,
    "authored": true,
    "kinds": ["institutionDesc","npcVoice","traditionMotif"],
    "byKind": {
      "institutionDesc": 0,
      "npcVoice": 0,
      "traditionMotif": 0
    },
    "entries": []
  },
  "institutions": {
    "tierCount": 6,
    "entryCount": 305,
    "distinctNames": 272
  }
});
