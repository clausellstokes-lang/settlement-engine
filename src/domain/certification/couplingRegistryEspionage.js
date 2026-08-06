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

/**
 * ES-2 / GRAMMAR→INFO. THE GAUNTLET READS THE ERRAND LEDGER TO FIND WHO IS STANDING STILL.
 *
 * The stay-detection stage walks `envoyErrandsOf` and asks each row where its traveller is
 * — which is a GRAMMAR read, and it is the ONLY way the question can be asked, because the
 * itinerary is expressed as multi-leg outbound routing rather than as a second clock (ES
 * §1). The dwell is the gap between one leg's arrival and the next leg's departure and
 * nothing else knows where that gap is.
 *
 * ⚠ THE READ IS DELIBERATELY THE ROW'S `covert` SUB-RECORD AND NEVER THE THREE FACE FIELDS.
 * `errandSpineBlock` writes `covert` only onto a row whose RESOLVED class is covert, so the
 * sub-record IS the class test — and taking it that way keeps this file outside the reserved
 * set `tests/lint/errandConsumerRegistry.walker.test.js` grants to the errand family alone.
 * One read, two laws honoured; the alternative would have been a strictly weaker test that
 * also broke the estate's one-reader law.
 *
 * THE COUNTERFORCE IS THE PERSISTENCE NORMALIZER, on the far side of the same seam. Nothing
 * this stage reads can exist unless `normalizeCovertMission` accepted it on the way into the
 * ledger and will accept it again on the way out of a save file — so a gauntlet reading a
 * mission shape no writer authored is not a state the ledger can hold.
 *
 * DARK ⇒ NOTHING: the stage refuses at `espionageActive` before it walks anything, and it
 * WRITES NOTHING in either state (the custody arm is owner-gated on the encounter shape —
 * see the stage header's measured stop-report), so the coupling is a read and only a read.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES2_GAUNTLET_DWELL_READ_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.ES-2.gauntlet_dwell_read',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageGauntlet.js#covertDwellRead',
  receiptField: 'worldState.envoyErrands[].{legs,state,covert.itinerary}',
  counterforce: 'src/domain/worldPulse/envoyErrandRecords.js#normalizeCovertMission',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-2',
  intendedDesk: 'war',
});

/**
 * ES-2 / GRAMMAR→INFO. THE SCHEDULE CURSOR IS BORROWED, NEVER RE-DERIVED.
 *
 * `scheduledEnvoyPosition` is the errand family's ONE statement of where a traveller stands
 * at one cut, and it evaluates the shared leg law exactly once so a boundary arrival cannot
 * also hop onto a later leg. The gauntlet needs precisely that answer — an arrived-but-not-
 * complete cursor IS the dwell — and computing it here would have minted a second position
 * fraction, which law M forbids for exactly this reason: a covert errand and a peace embassy
 * cannot disagree about where anybody is.
 *
 * THE COUNTERFORCE is the transit seam itself. `envoyErrandTransit.js` is a registered
 * injected-plan validator with no import through which a local speed floor could grow, so a
 * borrowed cursor cannot become a private clock without that file changing first.
 *
 * DARK ⇒ NOTHING: reached only past `espionageActive`, and the borrowed read is pure.
 * @type {Readonly<CouplingRegistryRow>}
 */
export const ES2_GAUNTLET_TRANSIT_CURSOR_COUPLING = couplingRow({
  couplingId: 'CPL-19.GRAMMAR_TO_INFO.ES-2.gauntlet_transit_cursor',
  pairId: 'CPL-19',
  direction: 'GRAMMAR→INFO',
  read: 'src/domain/worldPulse/espionage/espionageGauntlet.js#covertDwellRead',
  receiptField: 'worldState.envoyErrands[].positionRef.{legIndex,progressBand,toId}',
  counterforce: 'src/domain/worldPulse/envoyErrandTransit.js#scheduledEnvoyPosition',
  flags: Object.freeze([
    'errandSpineEnabled',
    'espionageEnabled',
  ]),
  owningVolume: 'ESPIONAGE',
  owningWave: 'ES-2',
  intendedDesk: 'war',
});

/** Every ESPIONAGE row, in wave order. @type {ReadonlyArray<Readonly<CouplingRegistryRow>>} */
export const ES_ESPIONAGE_COUPLINGS = Object.freeze([
  ES1_COVERT_MISSION_MINT_COUPLING,
  ES1_MISSION_VOCABULARY_COUPLING,
  ES1_HIDDEN_FRANCHISE_COUPLING,
  ES2_GAUNTLET_DWELL_READ_COUPLING,
  ES2_GAUNTLET_TRANSIT_CURSOR_COUPLING,
]);
