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
  migration: home('migration', 1, ['stress', 'stressors']),
  warState: home('warState', 1, ['stress', 'stressors', 'activeConditions', 'economicState'], {
    note: 'it reads the crisis home (`crisisOf`), so it carries the crisis leaf\'s bundle: the hunger family touches the economy',
  }),
  crisis: home('crisis', 1, ['stress', 'stressors', 'activeConditions', 'economicState'], {
    note: 'the kinds are layer 1 (the crises in force); the hunger FAMILY is read off the food band (layer 2): the second bundled leaf of the layer map\'s §2c',
  }),
  defence: home('defence', 1, ['institutions', 'economicState'], {
    note: 'walls, gate, watch are layer 1 by value; `defenseFactsOf` computes the stores in the same object, so every defence atom touches the economy: the first bundled leaf of the layer map\'s §2c',
  }),
  guardPresence: home('guardPresence', 1, ['institutions', 'economicState']),
  soldiers: home('soldiers', 1, ['institutions', 'economicState']),
  commander: home('commander', 1, ['institutions', 'economicState']),
  // ── layer 2: over the economy ──
  famine: home('famine', 2, ['economicState']),
  foodSources: home('foodSources', 2, ['economicState']),
  storesMonths: home('storesMonths', 2, ['economicState']),
  imports: home('imports', 2, ['economicState']),
  exports: home('exports', 2, ['economicState']),
  prosperity: home('prosperity', 2, ['economicState']),
  magicDependents: leaf({ layer: 2, module: 'domain/magicReliance.js', exported: 'magicDependents', call: 'record', reads: ['economicState'] }),
  foodEndurance: leaf({ layer: 2, module: 'domain/defense/defenseFacts.js', exported: 'foodEnduranceOf', call: 'record', reads: ['economicState'] }),
  chainCarrier: leaf({ layer: 2, module: 'domain/facts/chainCarrier.js', exported: 'chainCarrierOf', call: 'perChain', reads: ['config', 'economicState'] }),
  readiness: leaf({ layer: 2, module: 'domain/facts/factLayers.js', exported: 'defenseProfile.readiness', call: 'record', reads: ['defenseProfile'], stored: true,
    note: 'the stored readiness: the defence profile is layer 2 by value; born at assembly (NEW-1\'s step order)' }),
  // ── layer 3: over the powers ──
  rulerKind: home('rulerKind', 3, ['powerStructure']),
  guild: home('guild', 3, ['powerStructure', 'institutions']),
  crime: home('crime', 3, ['_seed', 'economicState', 'economicState.safetyProfile', 'institutions', 'powerStructure'], {
    note: '`deriveCriminalStructure` reads the safety profile\'s crime lines, which assembly settles to the crime signal (a back-write at layer 3): it reads its own layer',
  }),
  crimeSignal: leaf({ layer: 3, module: 'domain/crimeSignal.js', exported: 'crimeSignalOf', call: 'crimeLists', reads: ['powerStructure', 'institutions'] }),
  faith: home('faith', 3, ['institutions', 'config', 'economicState', 'powerStructure', 'npcs'], {
    note: 'its value reads the config, the roster, the income and the factions (layer 3); it touches the cast (layer 3), banked',
  }),
  beastsReadiness: leaf({ layer: 3, module: 'domain/facts/beastsReadiness.js', exported: 'beastsReadinessOf', call: 'record', reads: ['config', 'defenseProfile'] }),
  leaderLead: leaf({ layer: 3, module: 'domain/facts/leaderLead.js', exported: 'leaderLeadOfRecord', call: 'record', reads: ['powerStructure'] }),
  powersList: leaf({ layer: 3, module: 'domain/dossier/powerStrata.js', exported: 'derivePowerStrata', call: 'record', reads: ['powerStructure'],
    note: 'the one derivation of both lists the Power tab prints (the contenders and the roster); the fault of 16b is that both are titled alike, not a second derivation' }),
  // ── layer 4: over the cast ──
  importsAsPrinted: leaf({ layer: 4, module: 'domain/display/tradeListDisplay.js', exported: 'importsAsPrinted', call: 'record', reads: ['economicState', 'resourceAnalysis', 'tier'] }),
  founder: leaf({ layer: 4, module: 'domain/facts/founder.js', exported: 'founderOf', call: 'record', reads: ['history'] }),
  hasOtherNpc: home('hasOtherNpc', 4, ['npcs'], { call: 'factsCall' }),
  magicPractitioners: leaf({ layer: 4, module: 'domain/magicReliance.js', exported: 'magicPractitioners', call: 'record', reads: ['institutions', 'npcs'] }),
  magicReliance: leaf({ layer: 4, module: 'domain/magicReliance.js', exported: 'deriveMagicReliance', call: 'record', reads: ['config', 'economicState', 'institutions', 'npcs'] }),
  magicSource: leaf({ layer: 4, module: 'domain/facts/magicSource.js', exported: 'magicSourceOf', call: 'record', reads: ['config', 'economicState', 'institutions', 'npcs'],
    note: 'where the magic the place relies on comes from (census row 3): the practitioners, then the houses that supply a dependent chain' }),
  captureClimate: leaf({ layer: 4, module: 'domain/facts/factLayers.js', exported: 'powerStructure.criminalCaptureState', call: 'record', reads: ['powerStructure.criminalCaptureState'], stored: true,
    note: 'the stored capture climate, written at assembly from the cast (a back-write)' }),
  // ── layer 5 ──
  hallCapture: leaf({ layer: 5, module: 'domain/people/hallCapture.js', exported: 'hallCaptureOf', call: 'record', reads: ['npcs', 'powerStructure', 'powerStructure.criminalCaptureState'] }),
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
