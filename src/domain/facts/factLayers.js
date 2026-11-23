/**
 * domain/facts/factLayers.js — THE LAYER TABLE (W2-A-LEAVES, 2026-11-12; the second wave's charter, the
 * amendment of record 292; the procedure `SOP-POOLS-AND-CONDITIONS` §1–§2; the layer map's §1, §2a and §5).
 *
 * ONE FACT, ONE LEAF, ONE LAYER. Every fact a line may state or presume has one home (a leaf) and a
 * LAYER: one above the highest thing it reads. This file is the one place each leaf's layer and each
 * leaf's reads are written down. Its tests read it; the walker
 * (`tests/lint/factLayers.walker.test.js`) holds it to the source.
 *
 * THE TWO SCALES, ONE RULE.
 *   A STRATUM is a stored part of the settlement record. Its layer is 1 + the highest layer its writing
 *   step reads (the layer map's §1, measured): the base is 0; the economy 1; the powers and the defence
 *   profile 2; the cast and the history 3; what assembly writes from the cast 4.
 *   A LEAF (a fact) reads strata. Its layer is 1 + the highest stratum it reads — except a leaf that only
 *   HANDS ON one stored value as it is (`stored: true`), which takes that stratum's own layer.
 *   A LINE (a pool) reads leaves; its layer is 1 + the highest leaf it reads. So a line that reads the
 *   base facts (walls, the tier, a crisis kind; all layer 1) is layer 2. The layer map numbers its pools
 *   by the stratum their key reads (its "L1" pool reads the base); the walker's pool table keeps the
 *   map's number + 1, the procedure's scale, and says so on every row it took from the map.
 *   THE RULE: nothing reads at or above its own layer. A leaf that touches a stratum at or above its
 *   layer, and a pool whose lines declare or name a fact at or above its layer, are red, unless banked
 *   in the walker's shrink-only register (`tests/lint/factLayers.register.json`).
 *
 * WHAT A LEAF'S `reads` IS. The strata the leaf TOUCHES on the walker's grid of births, traced by a
 * proxy over the record (the layer map's read-tracer, `facts.mjs`). Touch is wider than value: a leaf
 * that bundles two layers (the layer map's §2c, item 3) touches the higher one. That is the fault the
 * walker exists to find, so touch is what is declared and checked. An undeclared touch is red (the
 * table is wrong); a declared touch at or above the leaf's layer is a violation (banked or red).
 *
 * IMPORT-FREE ON PURPOSE, as the vocabulary is: a table, never a reader. The walker imports each leaf by
 * the `module` and `exported` written here.
 *
 * Pure data.
 *
 * @enforced-by tests/lint/factLayers.walker.test.js
 */

/**
 * THE STRATA: a stored path of the settlement record → its layer. The longest matching prefix wins, so a
 * field written back at assembly from a higher layer into a lower stratum's object (the layer map's
 * §1, "four fields are written at assembly") carries its own, higher layer. A top-level field not
 * listed here is red in the walker: a new stored field is placed before anything reads it.
 * @type {Readonly<Record<string, number>>}
 */
export const STRATA = Object.freeze({
  // ── layer 0: the base (resolveConfig … assembleInstitutions; the layer map's §1) ──
  name: 0, tier: 0, population: 0, institutions: 0, neighborRelationship: 0, config: 0, _config: 0,
  stress: 0, stressors: 0, activeConditions: 0, culturalIdentity: 0, culturalNotes: 0, userCanon: 0,
  _seed: 0, id: 0, schemaVersion: 0, simulationVersion: 0, generatorVersion: 0, aiOverlays: 0,
  // ── layer 1: the economy and what is read off it with the roster ──
  economicState: 1, spatialLayout: 1, availableServices: 1, isolationSupport: 1,
  structuralViolations: 1, structuralSuggestions: 1,
  // ── layer 2: the powers; the defence profile, by value (the layer map's `readiness.mjs`) ──
  powerStructure: 2, defenseProfile: 2,
  // ── layer 3: the cast, the history, and the analyses written with them ──
  npcs: 3, relationships: 3, history: 3, settlementReason: 3, resourceAnalysis: 3, economicViability: 3,
  // ── layer 4: what assembly writes from the cast, and the stored lines ──
  'powerStructure.criminalCaptureState': 4, conflicts: 4, 'powerStructure.conflicts': 4,
  arrivalScene: 4, pressureSentence: 4, prominentRelationship: 4, coherenceNotes: 4,
  simulationTrace: 4, generationCoherenceReceipt: 4,
  // ── the back-writes at assembly: a higher layer inside a lower stratum's object ──
  'economicState.safetyProfile': 3, // its crime lines are settled to the crime signal (the powers, layer 2)
  'culturalIdentity.foodways': 2, // the foodways line is read off the economy (layer 1)
});

/**
 * @typedef {object} LeafRow
 * @property {number} layer the fact's layer (the layer map's §2a value layer, unless the row says otherwise)
 * @property {string} module the leaf's module, from `src/`
 * @property {string} exported the export the walker calls; `factsOf.<getter>` for a vocabulary home
 * @property {'record'|'crimeLists'|'factsGetter'|'factsCall'|'perChain'|'perHouse'} call how the walker calls it on a
 *   record (`perChain`: once per active chain, `(chain, record)`; `perHouse`: once per chain's house, `(record, name)`)
 * @property {ReadonlyArray<string>} reads the strata it touches (keys of STRATA)
 * @property {boolean} [stored] it hands on one stored value as it is: it may read its own stratum
 * @property {string} [note] where this table differs from the layer map, and why
 */

/** @param {LeafRow} r @returns {Readonly<LeafRow>} */
const leaf = (r) => Object.freeze({ ...r, reads: Object.freeze([...r.reads]) });

/** A vocabulary home: `factsOf(record).<getter>` (or its function, called with the walker's argument). */
/** @param {string} getter @param {number} layer @param {ReadonlyArray<string>} reads @param {Partial<LeafRow>} [more] */
const home = (getter, layer, reads, more = {}) => leaf({
  layer, module: 'domain/facts/factsOf.js', exported: `factsOf.${getter}`, call: 'factsGetter', reads, ...more,
});

/**
 * THE LEAVES. Every `home` a vocabulary dimension names (`factVocabulary.js :: FACT_DIMENSIONS[d].home`)
 * is a row here, under its getter's name; so is every other home the class table names. A dimension's
 * layer is its home's.
 * @type {Readonly<Record<string, Readonly<LeafRow>>>}
 */
export const LEAVES = Object.freeze({
  // ── layer 1: the base facts ──
  presenceOnCard: leaf({ layer: 1, module: 'domain/facts/presence.js', exported: 'houseHere', call: 'perHouse', reads: ['institutions'] }),
  terrain: home('terrain', 1, ['config']),
  route: home('route', 1, ['config']),
  water: home('water', 1, ['config']),
  culture: home('culture', 1, ['config']),
  magic: home('magic', 1, ['config']),
  tier: home('tier', 1, ['tier']),
  populationBand: home('populationBand', 1, ['population']),
  hasInstitution: home('hasInstitution', 1, ['institutions'], { call: 'factsCall' }),
  sacredHouse: home('sacredHouse', 1, ['institutions']),
  market: home('market', 1, ['institutions']),
  legalHouse: home('legalHouse', 2, ['availableServices', 'institutions']), // BAR5-THINGS (LAW 4): a house of written law (`legalHouse.js`); layer 2: it reads the services (CLOSE-SWEEP S2)
  paidWatch: home('paidWatch', 1, ['institutions']), // BAR6-PEOPLE (10e-house): someone is paid to keep order (`guardPay.js`)
  forceWalksByDay: home('forceWalksByDay', 1, ['institutions']), // BAR8-K-WATCH (13e): the force walks by day, by its own text (`forceHours.js`)
  courtSits: home('courtSits', 2, ['availableServices', 'institutions']), // BAR6-CULTURE (6d-court): a court on the live roster (`defence.js :: courtHoldersOf`)
  courtOrGaol: home('courtOrGaol', 2, ['availableServices', 'institutions', 'economicState'], { // FAULTS-DESKS (13d, FR6): `court sits` or the defence home's `prison`
    note: 'it reads the live roster\'s drawn services (layer 2) and a defence-home atom, which bundles the economy as every defence atom does',
  }),
  appointedPost: home('appointedPost', 1, ['institutions']), // BAR5-THINGS (LAW 4): a post someone is named to (`appointedPost.js`)
  migration: home('migration', 1, ['stress', 'stressors']),
  warState: home('warState', 1, ['stress', 'stressors', 'activeConditions', 'economicState'], {
    note: 'it reads the crisis home (`crisisOf`), so it carries the crisis leaf\'s bundle: the hunger family touches the economy',
  }),
  crisis: home('crisis', 1, ['stress', 'stressors', 'activeConditions', 'economicState'], {
    note: 'the kinds are layer 1 (the crises in force); the hunger FAMILY is read off the food band (layer 2): the second bundled leaf of the layer map\'s §2c',
  }),
  siegeMotion: home('siegeMotion', 1, ['stress', 'activeConditions']), // BAR4-SAFETY (F2): the siege condition's own status (`siegeMotion.js`)
  defence: home('defence', 1, ['institutions', 'economicState'], {
    note: 'walls, gate, watch are layer 1 by value; `defenseFactsOf` computes the stores in the same object, so every defence atom touches the economy: the first bundled leaf of the layer map\'s §2c',
  }),
  guardPresence: home('guardPresence', 1, ['institutions', 'economicState']),
  soldiers: home('soldiers', 1, ['institutions', 'economicState']),
  commander: home('commander', 1, ['institutions', 'economicState']),
  // ── layer 2: over the economy ──
  famine: home('famine', 2, ['economicState']),
  foodSources: home('foodSources', 2, ['economicState']),
  // BAR4-SCENES (kind A1): the food source the famine failed (`sceneSupply.js`)
  failedSource: home('failedSource', 2, ['economicState']),
  // BAR4-CORPUS-ECO (BRIEF-BAR4 amendment 5b): the leading food source's grounds all spent: the food record against the config's resources
  leadingSourceSpent: home('leadingSourceSpent', 2, ['economicState', 'config']),
  // BAR4-CORPUS-ECO (the chair's FW1): a subsistence house tills for the table beside a food record with no grain
  ownPlots: home('ownPlots', 2, ['economicState', 'institutions']),
  storesMonths: home('storesMonths', 2, ['economicState']),
  growsMoreThanEats: home('growsMoreThanEats', 2, ['economicState']), // BAR6-DEFDESK (9c.nothing-over): the food record's flag
  imports: home('imports', 2, ['economicState']),
  exports: home('exports', 2, ['economicState']),
  prosperity: home('prosperity', 2, ['economicState']),
  // BAR4-CORPUS-DEF (D2): goods arrive by magic, an isolated route whose trade needs are met (`magicSupply.js`)
  magicSupply: home('magicSupply', 2, ['economicState']),
  // BAR5-MAGIC (rule 1a): the reliance word the page prints (`magicProvisionShown.js :: relianceShownOf`); the reads as the grid measures them
  magicRelianceShown: home('magicRelianceShown', 4, ['config', 'defenseProfile', 'economicState', 'institutions', 'npcs', 'resourceAnalysis']),
  // BAR4-CORPUS-DEF (C24893): a criminal revenue on the income list (`criminalIncome.js`)
  criminalIncome: home('criminalIncome', 2, ['availableServices', 'economicState']),
  // BAR2-PLACES (the chair's grant VW2): iron worked here (the chains) or imported past no siege (the crisis kinds)
  ironAtHand: home('ironAtHand', 2, ['economicState', 'stress', 'stressors', 'activeConditions']),
  // BAR4-HOUSES (H1 (ii)) and BAR4-SCENES (kind A1), ONE HOME (BAR4-SCENES-2, the chair's ruling of 2026-11-16 12:16 UTC):
  // how timber reaches the town's sawyers, by BAR4-RECORD's one reading (`houseInputAtHand.js`), in `timberAtHand.js`:
  // `timber at hand` its own ground (`local`); `timber reaches the saws` any kind (local or imported)
  // layer 4 (CLOSE-SWEEP S2): both read the resource analysis (layer 3), as `tradeAtWork` does
  timberAtHand: home('timberAtHand', 4, ['config', 'economicState', 'institutions', 'resourceAnalysis']),
  timberReachesSawmill: home('timberReachesSawmill', 4, ['config', 'economicState', 'institutions', 'resourceAnalysis']),
  // BAR4-SCENES (kind A1): enchanting among the services (`sceneSupply.js`)
  enchanting: home('enchanting', 2, ['availableServices']),
  // BAR4-SCENES-2 (HW1): a trade the scene shows is at work (`tradeAtWork.js`, on `houseInputAtHand.js :: housesShortOf`)
  tradeAtWork: home('tradeAtWork', 4, ['institutions', 'resourceAnalysis', 'economicViability', 'config', 'economicState', 'stress', 'stressors', 'activeConditions'], { call: 'factsCall' }), // layer 4: it reads the resource analysis's gaps (layer 3); and the viability (layer 3, CLOSE-SWEEP S2)
  // BAR6-SCENES (6b): the goods of a scene of goods leaving are on the export list (`goodExported.js`)
  goodExported: home('goodExported', 2, ['economicState'], { call: 'factsCall' }),
  // TAIL-CLOSE-SRC-2 (the chair's SR2): what the place can keep up (`keep.js :: keepOf`, d7d7f7787), read off the prosperity label
  keep: home('keep', 2, ['economicState']),
  magicDependents: leaf({ layer: 2, module: 'domain/magicReliance.js', exported: 'magicDependents', call: 'record', reads: ['economicState'] }),
  foodEndurance: leaf({ layer: 2, module: 'domain/defense/defenseFacts.js', exported: 'foodEnduranceOf', call: 'record', reads: ['economicState'] }),
  // BAR4-CORPUS-ECO (the chair's FS1): a chain the rites hold up and that still runs (the fished-out income line reads it)
  ritesHoldAChain: leaf({ layer: 2, module: 'domain/facts/chainRites.js', exported: 'ritesHoldAChain', call: 'record', reads: ['economicState'] }),
  chainCarrier: leaf({ layer: 2, module: 'domain/facts/chainCarrier.js', exported: 'chainCarrierOf', call: 'perChain', reads: ['config', 'economicState'] }),
  readiness: leaf({ layer: 2, module: 'domain/facts/factLayers.js', exported: 'defenseProfile.readiness', call: 'record', reads: ['defenseProfile'], stored: true,
    note: 'the stored readiness: the defence profile is layer 2 by value; born at assembly (NEW-1\'s step order)' }),
  // ── layer 3: over the powers ──
  rulerKind: home('rulerKind', 3, ['powerStructure']),
  // BAR6-SCENES (9f): the public legitimacy in its crisis band (`legitimacyCrisis.js`)
  legitimacyCrisis: home('legitimacyCrisis', 3, ['powerStructure']),
  // TAIL-TIES (the chair's ruling (T5)): ruled by a body of more than one, read off the government's label
  rulingBody: home('rulingBody', 3, ['powerStructure']),
  guild: home('guild', 3, ['powerStructure', 'institutions']),
  // TAIL-CRISIS-2 (the chair's ruling K6): a power not the governing one, by its own standing
  rivalPower: home('rivalPower', 3, ['powerStructure']),
  // BAR5-POWERS (the chair's ruling SO1): a power above the seat, by its own standing
  seatOutranked: home('seatOutranked', 3, ['powerStructure']),
  // BAR6-POWERS (6d-members): the seat's members as the page counts them (the cast's memberships), else the government's label
  seatMembers: home('seatMembers', 4, ['npcs', 'powerStructure']),
  // TAIL-TIES-9 (the chair's ruling (T28)): the crime fact's LEAF is the criminal structure's key, moved out of the display
  // (`deriveCriminalStructure` calls it and keeps its labels and the ring note's vantages, which read `_seed` and the tier).
  crime: leaf({ layer: 3, module: 'domain/facts/criminalStructureKey.js', exported: 'criminalStructureKeyOf', call: 'record', reads: ['availableServices', 'economicState', 'economicState.safetyProfile', 'institutions', 'powerStructure'], // BAR4-SAFETY (F3): the covert criminal services (`covertCrimeHeld`)
    note: 'the key reads the safety profile\'s crime lines, which assembly settles to the crime signal (a back-write at layer 3): it reads its own layer',
  }),
  // BAR5-SAFETY (L2.law.collapsed; amendment 5b; vetoable by the owner): the law's band as the Foundations row prints it, read
  // off the finished record (`lawBand.js`); read where a line prints (the guard assessment's one reader), never at a draw.
  lawBand: home('lawBand', 4, ['activeConditions', 'config', 'defenseProfile', 'economicState.safetyProfile', 'history', 'institutions', 'powerStructure', 'stress', 'stressors']), // BAR5-BAND: the floor reads the crisis container (LB1 (b))
  // BAR6-CRIME (BRIEF-BAR6 (b) (d)): the crime wave's one reading (`lawBand.js :: crimeWaveStands`, the live tensions) and the
  // force that keeps order (`orderForce.js`: the live roster, the funded gate, the cast under arms); read where a line prints.
  crimeWave: home('crimeWave', 4, ['history']),
  orderForce: home('orderForce', 4, ['defenseProfile', 'institutions', 'npcs']),
  // BAR7-DESKS (9i.crews): rival rings stand as the criminal structure's key reads them (`rivalRings.js`: `corruption.js ::
  // rivalRingsOf` over the live roster, and the key's own `semi-organized`): over the crime key (layer 3, which reads the
  // safety profile's back-write at its own layer), so one layer above it
  rivalRings: home('rivalRings', 4, ['availableServices', 'economicState', 'economicState.safetyProfile', 'institutions', 'powerStructure']),
  // BAR8-DESKS-ECO (11c): the good the critical-import lens names is brought in (`criticalImportBroughtIn.js`: the resource
  // analysis's critical list and reasons, stored at layer 3, and the economy's imports)
  criticalImportBroughtIn: home('criticalImportBroughtIn', 4, ['resourceAnalysis', 'economicState']),
  // FAULTS-NEED (FR2): the page's own need list names a need of the family (`needNotBroughtIn.js`: the resource analysis's
  // critical list and gap rows, stored at layer 3, the economy's lists and chains, the live roster and its service rows, the
  // tier the luxury class's band reads, and the config the failed venture's pick reads)
  needNotBroughtIn: home('needNotBroughtIn', 4, ['resourceAnalysis', 'economicState', 'institutions', 'availableServices', 'config', 'tier']),
  // FAULTS-ROWS (FR12 (3)): the town's fish is bought in (`fishBoughtIn.js`: the grounds read from the config's resource record
  // and the roster, the imports the narratives step writes at layer 3; the swap of the service rows reads the same function)
  fishBoughtIn: home('fishBoughtIn', 4, ['config', 'economicState', 'institutions', 'resourceAnalysis']),
  crimeSignal: leaf({ layer: 3, module: 'domain/crimeSignal.js', exported: 'crimeSignalOf', call: 'crimeLists', reads: ['powerStructure', 'institutions'] }),
  faith: home('faith', 3, ['institutions', 'config', 'economicState', 'powerStructure', 'npcs', 'stress'], {
    note: 'its value reads the config, the roster, the income and the factions (layer 3); it touches the cast (layer 3), banked; '
      + 'it reads the crisis container (stress, layer 0) for a siege that bars the road to the next village\'s church (R2-CODE-B-SIDE item 7, 8b27458cd; declared at the line\'s merge, R2-CODE-B-7)',
  }),
  beastsReadiness: leaf({ layer: 3, module: 'domain/facts/beastsReadiness.js', exported: 'beastsReadinessOf', call: 'record', reads: ['config', 'defenseProfile'] }),
  leaderLead: leaf({ layer: 3, module: 'domain/facts/leaderLead.js', exported: 'leaderLeadOfRecord', call: 'record', reads: ['powerStructure'] }),
  // ── layer 4: over the cast ──
  powersList: leaf({ layer: 4, module: 'domain/dossier/powerStrata.js', exported: 'derivePowerStrata', call: 'record', reads: ['powerStructure', 'config', '_config', 'economicState', 'npcs', 'stress', 'stressors', 'tier'],
    note: 'the one derivation of both lists the Power tab prints (the contenders and the roster); the fault of 16b is that both are titled alike, not a second derivation' }),
  importsAsPrinted: leaf({ layer: 4, module: 'domain/display/tradeListDisplay.js', exported: 'importsAsPrinted', call: 'record', reads: ['activeConditions', 'availableServices', 'config', 'economicState', 'economicViability', 'institutions', 'resourceAnalysis', 'stress', 'stressors', 'tier'] }), // W2-C-LEAVES-4 item 2: the pills read the chain cards' crisis state (chainStateShown.js :: crisisOf); W2-C-LEAVES R2: a need the town makes (its live roster, through localProductionAsPrinted); W2-C-LEAVES-3 P1-a: the chain leaf's WORKED_BY_HOUSE reads the town's own live resources (config); CLOSE-SWEEP S2: and the viability (layer 3); BAR8 J-INCOME item 4: a live house's printed service row (dealtInHere reads availableServices, stratum 1)
  // BAR6-HOUSES (the chair's ruling SV1): a sovereign given by the government, a power, a house, a person or the founding, or a
  // war or an occupation (`sovereign.js`); read at the settled record (the houses' late re-read)
  sovereign: home('sovereign', 4, ['history', 'institutions', 'npcs', 'powerStructure', 'stress', 'stressors']),
  founder: leaf({ layer: 4, module: 'domain/facts/founder.js', exported: 'founderOf', call: 'record', reads: ['history'] }),
  // BAR4-CORPUS-DEF (D1): a danger from outside on its way, a live external-threat tension of the history (`dangerComing.js`)
  dangerComing: home('dangerComing', 4, ['history']),
  // BAR8-DESKS-DEF (12e): the common people press, or have risen, against those in charge, a live popular-uprising tension (`uprising.js`)
  uprising: home('uprising', 4, ['history']),
  // BAR6-DEFDESK (7a): the page itself prints the country's beasts as a threat (`monsterFrontier.js`: the config and the monster score)
  monsterFrontier: home('monsterFrontier', 3, ['config', 'defenseProfile']),
  // BAR6-CULTURE (10g-legacy): the blow the record's top legacy names destroyed something (`legacyRuin.js`)
  legacyRuin: home('legacyRuin', 4, ['history']),
  // W2-A-LEAVES-2 (REVIEW-W2A F3): an official in a criminal's pay, the cast's own fact; the crime desk's lines
  // about bought officials are struck by it (`display/stateProse/crimeLineDisqualifiers.js`)
  officialsInPay: leaf({ layer: 4, module: 'domain/facts/officialsInPay.js', exported: 'officialsInCriminalPayOf', call: 'record', reads: ['npcs', 'powerStructure'] }),
  hasOtherNpc: home('hasOtherNpc', 4, ['npcs'], { call: 'factsCall' }),
  // R2-CODE-A-14 (the chair's ruling (s1)): a PAIR's fact — the two cards' memberships (the cast, layer 3)
  sharesPower: home('sharesPower', 4, ['npcs'], { call: 'factsCall' }),
  // BAR4-PEOPLE (the chair's TI1 and its ruling of 11:07): two more PAIR facts, read off the final record by `factsOf` (the presumption
  // check re-reads a drawn line's needs there), and at the draw by `people/ties.js :: withPairTies` from its drafts: the two cards'
  // houses and ranks (the cast, layer 3); the ties between them (layer 3)
  sharesPlace: home('sharesPlace', 4, ['npcs'], { call: 'factsCall' }),
  loneTie: home('loneTie', 4, ['npcs', 'relationships'], { call: 'factsCall' }),
  seatHeld: home('seatHeld', 4, ['npcs', 'powerStructure'], { call: 'factsCall' }), // BAR6-PEOPLE (10d-seat): the pair's memberships against the governing power (`seatHeld.js`)
  magicPractitioners: leaf({ layer: 4, module: 'domain/magicReliance.js', exported: 'magicPractitioners', call: 'record', reads: ['institutions', 'npcs'] }),
  magicReliance: leaf({ layer: 4, module: 'domain/magicReliance.js', exported: 'deriveMagicReliance', call: 'record', reads: ['config', 'economicState', 'institutions', 'npcs'] }),
  magicSource: leaf({ layer: 4, module: 'domain/facts/magicSource.js', exported: 'magicSourceOf', call: 'record', reads: ['config', 'economicState', 'economicViability', 'institutions', 'npcs'],
    note: 'where the magic the place relies on comes from (census row 3): the practitioners, then the houses that supply a dependent chain; '
      + 'the magic food channel\'s word from the viability metrics (`economicViability.metrics.foodBalance.magicFoodNote`, layer 3; f9b957cbd, declared TAIL-CLOSE-SRC-2)' }),
  captureClimate: leaf({ layer: 4, module: 'domain/facts/factLayers.js', exported: 'powerStructure.criminalCaptureState', call: 'record', reads: ['powerStructure.criminalCaptureState'], stored: true,
    note: 'the stored capture climate, written at assembly from the cast (a back-write)' }),
  // ── layer 5 ──
  hallCapture: leaf({ layer: 5, module: 'domain/people/hallCapture.js', exported: 'hallCaptureOf', call: 'record', reads: ['npcs', 'powerStructure', 'powerStructure.criminalCaptureState'] }),
  // ── appended ──
  // PAGE-7 (CAUSES-DATA addendum 3): the houses a trouble's cause names, on the live roster by catalogue identity
  // (`causeHouses.js`); layer 1, the roster's: a criminal or covert house the shared document hides is gone from it there
  causeHouses: home('causeHouses', 1, ['institutions']),
  // PAGE-7 (CAUSES-DATA addendum 4): goods pass through here, the economy's stored mark (`entrepot.js`; layer 2 over the economy)
  entrepot: home('entrepot', 2, ['economicState']),
  // DAILY-3 B3 L8 (the chair's E82): the office the place is governed by, the governing row's form (`officeForms.js`; layer 3 over the powers)
  office: home('office', 3, ['powerStructure']),
});

/**
 * THE LEAVES THE CLASS TABLE NAMES AND THE SOURCE DOES NOT HAVE YET, with the layer each will take (the
 * layer map's §2b, READ). A row leaves this list the commit its leaf is written, and joins LEAVES. W2-A-LEAVES
 * wrote seven (presence on a card, the chain's carrier, beasts readiness, the leader's lead, the powers' lists,
 * the imports as printed, the founder); the eighth is the agreement lane's F4, built there.
 * @type {Readonly<Record<string, { layer: number, reads: ReadonlyArray<string>, owner: string }>>}
 */
export const LEAVES_OWED = Object.freeze({
  workedHere: Object.freeze({ layer: 2, reads: Object.freeze(['economicState', 'institutions']), owner: 'COHERENCE-AGREE (F4)' }),
});

/**
 * The layer of a stored path (the longest STRATA prefix), or undefined for a path no row places.
 * @param {string} path a dotted path (`economicState.foodSecurity.foodRecord`)
 * @returns {number|undefined}
 */
export function stratumLayerOf(path) {
  const parts = String(path).split('.');
  for (let n = parts.length; n > 0; n--) {
    const key = parts.slice(0, n).join('.');
    if (Object.prototype.hasOwnProperty.call(STRATA, key)) return STRATA[key];
  }
  return undefined;
}

/**
 * The stratum key a path falls in (the longest STRATA prefix), or undefined.
 * @param {string} path
 * @returns {string|undefined}
 */
export function stratumOf(path) {
  const parts = String(path).split('.');
  for (let n = parts.length; n > 0; n--) {
    const key = parts.slice(0, n).join('.');
    if (Object.prototype.hasOwnProperty.call(STRATA, key)) return key;
  }
  return undefined;
}

/**
 * The layer of a vocabulary dimension: its home leaf's (`FACT_DIMENSIONS[dimension].home`).
 * @param {string} homeName the dimension's `home`
 * @returns {number|undefined}
 */
export function leafLayerOf(homeName) {
  return LEAVES[homeName]?.layer;
}
