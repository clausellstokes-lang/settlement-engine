/**
 * Certification-only ownership metadata for selected world-state ledgers.
 *
 * Every module and symbol is stored as text. This manifest imports and executes
 * nothing, and no runtime writer reads it. `allowed_writer_family` and
 * `ordered_multi_writer` are deliberately distinct from `single_writer`: the
 * metadata records the live architecture instead of pretending it is simpler.
 */

export const LEDGER_OWNERSHIP_MANIFEST_VERSION = 2;

/** @param {string} module @param {string} symbol @param {string} evidence */
const ref = (module, symbol, evidence) => Object.freeze({ module, symbol, evidence });
/** @param {ReadonlyArray<Readonly<{module:string,symbol:string,evidence:string}>>} rows */
const refs = (rows) => Object.freeze([...rows]);
/** @param {string} module @param {string} symbol @param {string[]} tokens */
const orderEvidence = (module, symbol, tokens) => Object.freeze({
  module, symbol, tokens: Object.freeze([...tokens]),
});

export const LEDGER_OWNERSHIP_MANIFEST = Object.freeze([
  Object.freeze({
    id: 'envoy_errands',
    storage: 'worldState.envoyErrands',
    ownership: 'single_writer',
    readers: refs([
      ref('src/domain/worldPulse/envoyErrandRecords.js', 'envoyErrandsOf', 'ENVOY_ERRAND_LEDGER_KEY'),
    ]),
    writers: refs([
      ref('src/domain/worldPulse/envoyErrandLedger.js', 'writeErrands', 'ENVOY_ERRAND_LEDGER_KEY'),
    ]),
    normalizers: refs([
      ref('src/domain/worldPulse/envoyErrandRecords.js', 'normalizeEnvoyErrands', 'MAX_TERMINAL_ENVOY_HISTORY'),
    ]),
    lifecycle: refs([
      ref('src/domain/worldPulse/worldState.js', 'ensureWorldStateWithEnvoyNormalizer', 'normalizeEnvoyRows'),
      ref('src/domain/worldPulse/worldStateHydration.js', 'hydratePersistedWorldState', 'normalizeEnvoyErrands'),
    ]),
    dropWhenEmpty: 'canonical_writer',
    ordering: 'normalizeEnvoyErrands before compare and persist',
    orderEvidence: Object.freeze([orderEvidence(
      'src/domain/worldPulse/envoyErrandLedger.js', 'writeErrands', [
        'const prior = normalizeEnvoyErrands', 'const next = normalizeEnvoyErrands',
        'delete out[ENVOY_ERRAND_LEDGER_KEY]', 'return { ...state, [ENVOY_ERRAND_LEDGER_KEY]: next }',
      ],
    )]),
  }),
  Object.freeze({
    id: 'treaties',
    storage: 'worldState.spatialLedgers.treaties',
    ownership: 'allowed_writer_family',
    readers: refs([
      ref('src/domain/worldPulse/treatyEnforcement.js', 'treatyLedgerOf', "getSpatialLedger(worldState, 'treaties')"),
    ]),
    writers: refs([
      ref('src/domain/worldPulse/peaceTerms.js', 'advanceTreaties', "setSpatialLedger(out, 'treaties'"),
      ref('src/domain/worldPulse/pactFormation.js', 'signPactProposal', "setSpatialLedger(worldState, 'treaties'"),
      ref('src/domain/worldPulse/pactAmendment.js', 'closeTermsBrokenByWar', "setSpatialLedger(worldState, 'treaties'"),
      ref('src/domain/worldPulse/peaceTermsSale.js', 'mintSovereigntySaleTreaties', "setSpatialLedger(worldState, 'treaties'"),
      ref('src/domain/worldPulse/treatyBreach.js', 'repudiateTreaty', "setSpatialLedger(worldState, 'treaties'"),
    ]),
    normalizers: refs([]),
    lifecycle: refs([
      ref('src/domain/worldPulse/worldState.js', 'ensureWorldState', 'ensureWorldStateWithEnvoyNormalizer'),
      ref('src/domain/worldPulse/worldStateHydration.js', 'hydratePersistedWorldState', 'ensureWorldStateWithEnvoyNormalizer'),
    ]),
    dropWhenEmpty: 'writer_family_specific',
    ordering: 'no global writer order; every writer owns its local deterministic ordering',
    orderEvidence: Object.freeze([]),
  }),
  Object.freeze({
    id: 'belief_maps',
    storage: 'worldState.spatialLedgers.beliefMaps',
    ownership: 'ordered_multi_writer',
    readers: refs([
      ref('src/domain/worldPulse/beliefMap.js', 'beliefRecord', "getSpatialLedger(worldState, 'beliefMaps')"),
      ref('src/domain/worldPulse/beliefMap.js', 'advanceBeliefMaps', 'const prior = hasSpatialLedger'),
    ]),
    writers: refs([
      ref('src/domain/worldPulse/pulseKernel.js', 'simulateCampaignWorldPulse', "setSpatialLedger(memoryState, 'beliefMaps'"),
      ref('src/domain/worldPulse/beliefMap.js', 'applyEnvoySilenceInference', "setSpatialLedger(worldState, 'beliefMaps'"),
      ref('src/domain/worldPulse/beliefMap.js', 'clearEnvoySilenceInference', "setSpatialLedger(worldState, 'beliefMaps'"),
      ref('src/domain/worldPulse/informationStatecraft.js', 'advanceInformationStatecraft', "setSpatialLedger(state, 'beliefMaps'"),
      ref('src/domain/worldPulse/generosityKernel.js', 'advanceGenerosity', "setSpatialLedger(nextWorldState, 'beliefMaps'"),
      ref('src/domain/worldPulse/espionage/espionageProducts.js', 'landEspionageProduct', "'beliefMaps', nextMaps"),
    ]),
    normalizers: refs([]),
    lifecycle: refs([
      ref('src/domain/worldPulse/worldState.js', 'ensureWorldState', 'ensureWorldStateWithEnvoyNormalizer'),
      ref('src/domain/worldPulse/worldStateHydration.js', 'hydratePersistedWorldState', 'ensureWorldStateWithEnvoyNormalizer'),
    ]),
    dropWhenEmpty: 'pulse_stage_owned',
    ordering: 'pulse writers only: belief commit -> envoy silence apply -> envoy silence clear -> information statecraft -> generosity; landEspionageProduct is an authored out-of-band espionage seam with no global order against that chain',
    orderEvidence: Object.freeze([
      orderEvidence('src/domain/worldPulse/pulseKernel.js', 'simulateCampaignWorldPulse', [
        'if (beliefs.changed) {', 'advanceEnvoyDiplomacyPulse({',
        'advanceInformationStatecraft({', 'advanceGenerosity({',
      ]),
      orderEvidence('src/domain/worldPulse/envoyPulse.js', 'advanceEnvoyDiplomacyPulse', [
        'applyEnvoySilenceInference({', 'clearEnvoySilenceInference({',
      ]),
    ]),
  }),
]);
