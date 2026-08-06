/**
 * domain/certification/couplingRegistryEspionage.js — the ESPIONAGE volume's coupling rows.
 *
 * The registry files are per-volume so that a wave adds its rows without touching another
 * lane's file (the concurrency law). This is ES's first leaf, opened by ES-1; ES-2..ES-7
 * append here rather than reaching into the war, grammar or information registries.
 *
 * WHY A SEPARATE LEAF FROM `couplingRegistryInfo.js` WHEN THE LAYER MAP CALLS BOTH `INFO`.
 * The layer map is about MODULE HOMES — the ES family folds into the INFORMATION program
 * and its leaves are claimed by INFO's directory pattern, which is what stops them being
 * unlayered debt. A registry leaf is about WAVE OWNERSHIP: the couplingId carries the
 * volume prefix `ES`, the rows are appended in ES's wave order, and two lanes building
 * IN-* and ES-* concurrently must not serialize on one file. Both readings are right about
 * different questions.
 *
 * DESIGN_FP_COUPLINGS.md §0.3 — THE SAME-COMMIT OBLIGATION. A cross-layer import is
 * licensed by a registry row landed in the SAME commit as the import, and
 * tests/lint/couplingInclusion.walker.test.js reds until it is.
 */

import { couplingRow } from './couplingRegistrySchema.js';

/** @typedef {import('./couplingRegistrySchema.js').CouplingRegistryRow} CouplingRegistryRow */

/**
 * ES-1 / GRAMMAR→INFO. THE COVERT MISSION IS MINTED THROUGH THE ESTATE'S ONE SPINE.
 *
 * J-SP-2 rules that there is exactly ONE purposeful-travel substrate, and J-ES-1 rules
 * that espionage rides it rather than opening a second covert-travel answer on THE ROADS.
 * The consequence is this read: the espionage mission head reaches into the GRAMMAR layer
 * for the errand family's casting predicate (`castableRoster`, which carries the dispatch
 * refusals) and its covert mission vocabulary, then mints through `mintErrandSpine`.
 *
 * THE COUNTERFORCE IS A REAL REFUSAL AND IT LIVES ON THE OTHER SIDE. `covertMissionRefusal`
 * is the spine's own door: it names, by reason, every covert cargo the mint will not
 * write — a class that is not covert, a row it cannot give a public face to, an itinerary
 * past the cap, a product or demand outside the closed sets, and a `legRefs` naming
 * `pullBand`, the appraisal leg no espionage product can ever fill. The espionage layer
 * cannot talk its way past any of them, because the validation it would have to defeat is
 * the same one the PERSIST side runs on the way back out of a save file.
 *
 * DARK ⇒ NOTHING: the read gates on `espionageEnabled` (through `espionageActive`, whose
 * own conjunction also requires beliefs live and the spine lit) and the mint gates again
 * on `errandSpineEnabled`. With either absent no covert field is read, refused or written.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES1_COVERT_MISSION_MINT_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.ES-1.covert_mission_mint',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageMissions.js#mintCovertMission',
  receiptField: 'worldState.envoyErrands[].covert.{demand,itinerary,legRefs,product,subjectId}',
  counterforce: 'src/domain/worldPulse/errandMint.js#covertMissionRefusal',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-1',
  intendedDesk: 'war',
});

/**
 * ES-1 / GRAMMAR→INFO. THE ARITHMETIC BORROWS THE ROW'S WORDS RATHER THAN AUTHORING THEM.
 *
 * `ESPIONAGE_TUNING` used to author its own demand list and its own itinerary cap. Both
 * are ROW facts before they are arithmetic facts — the errand's persistence DTO matches
 * against them — so ES-1 retired the copies and the tuning now re-exposes the errand
 * vocabulary's one mint. The coupling is small and it is real: if the vocabulary leaf ever
 * moved those words, this file is where a reader learns that the catch arithmetic moves
 * with them.
 *
 * THE COUNTERFORCE is the persistence normalizer. It is the only thing that can refuse a
 * demand or a stop count, and it refuses them on the way IN and on the way OUT — so an
 * arithmetic that drifted a rung away from the vocabulary would be priced against a
 * mission no writer could have created and no save file could carry.
 *
 * DARK ⇒ NOTHING: the leaf is a dark instrument with no production importer outside its
 * own family, and the borrowed constants are inert until ES-2 mounts the catch roll.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES1_MISSION_VOCABULARY_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.ES-1.mission_vocabulary_borrow',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageMath.js#ESPIONAGE_TUNING',
  receiptField: 'worldState.envoyErrands[].covert.{demand,itinerary}',
  counterforce: 'src/domain/worldPulse/envoyErrandRecords.js#normalizeCovertMission',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-1',
  intendedDesk: 'war',
});

/**
 * ES-1 / TRADE→GRAMMAR. THE COVERT TRAVELLER MAY WALK A WAY THE REALM HAS FORGOTTEN.
 *
 * `mayUseHiddenPaths` is the route layer's one statement of J-D9 (d), and it FAILS CLOSED:
 * an unrecognised traveller kind is refused the overgrown road. Every errand this estate
 * has ever priced has been refused it, and not by anyone's decision — `buildEnvoyRoutePlan`
 * passes the kind `'envoy'`, which is not in the franchise. ES-1 gives that one solve a
 * fork: a covert mission travels as `covert_envoy`, which IS in the franchise, and every
 * other errand keeps the word it always had.
 *
 * THE READ IS ONE CONSTANT, AND THAT IS EXACTLY WHY IT IS REGISTERED. Spelling the kind as
 * a literal inside the envoy file would have made the coupling invisible while leaving it
 * just as real: the day the route layer renames or retires the member, an inlined literal
 * stops matching, `mayUseHiddenPaths` fails closed as designed, and covert missions
 * quietly go back to walking the open road with every test still green. The import is the
 * honest spelling and this row is its receipt.
 *
 * THE COUNTERFORCE is the predicate itself. It is the only thing that grants the
 * franchise, it grants it to a closed set, and it refuses everything else including the
 * ordinary envoy — so the widening cannot leak past the one kind it names.
 *
 * DARK ⇒ NOTHING: `covert` is compared `=== true` at the solve and no production caller
 * passes it, so every route plan the estate prices today takes the identical branch.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES1_HIDDEN_FRANCHISE_COUPLING = couplingRow({
  couplingId: 'CPL-22.TRADE_TO_GRAMMAR.ES-1.covert_hidden_franchise',
  pairId: 'CPL-22',
  direction: 'TRADE→GRAMMAR',
  read: 'src/domain/worldPulse/envoyDiplomacy.js#buildEnvoyRoutePlan',
  receiptField: 'worldState.envoyErrands[].legs[].routeRef.{id}',
  counterforce: 'src/domain/worldPulse/routeNetworkConsumers.js#mayUseHiddenPaths',
  flags: Object.freeze([
    'espionageEnabled',
    'routeLifecycleEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-1',
  intendedDesk: 'war',
});

/** Every ESPIONAGE row, in wave order. @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const ES_ESPIONAGE_COUPLINGS = Object.freeze([
  ES1_COVERT_MISSION_MINT_COUPLING,
  ES1_MISSION_VOCABULARY_COUPLING,
  ES1_HIDDEN_FRANCHISE_COUPLING,
]);
