/**
 * Declarative topology of the composed one-week pulse.
 *
 * `pulseKernel.js` remains the execution authority. This manifest records the
 * causal phases that must remain ordered while the coordinator is extracted
 * incrementally. It is not a plugin registry: reordering a simulation by array
 * edit would make behavior too easy to change accidentally.
 *
 * A phase may move behind a function/module boundary only when its inputs and
 * outputs are explicit and the composed determinism/soak receipts remain
 * unchanged.
 */

export const PULSE_STAGE_MANIFEST_VERSION = 1;

export const PULSE_STAGE_TOPOLOGY = Object.freeze([
  Object.freeze({
    id: 'bootstrap',
    after: Object.freeze([]),
    owns: Object.freeze(['simulation rules', 'tick', 'calendar', 'rng', 'initial snapshot']),
    purpose: 'Normalize the incoming world and mint deterministic pulse identity.',
  }),
  Object.freeze({
    id: 'actor_memory',
    after: Object.freeze(['bootstrap']),
    owns: Object.freeze(['relationship states', 'npc states', 'faction states', 'political memory']),
    purpose: 'Age and update slow actor state before conditions and movers read it.',
  }),
  Object.freeze({
    id: 'condition_aging',
    after: Object.freeze(['actor_memory']),
    owns: Object.freeze(['stressor transitions', 'residual outcomes', 'graduations']),
    purpose: 'Advance existing pressures and convert resolved conditions into consequences.',
  }),
  Object.freeze({
    id: 'settlement_clock',
    after: Object.freeze(['condition_aging']),
    owns: Object.freeze(['local settlement copies', 'food and seasons', 'tick-state streaks']),
    purpose: 'Advance every member settlement without mutating persisted inputs.',
  }),
  Object.freeze({
    id: 'mover_planes',
    after: Object.freeze(['settlement_clock']),
    owns: Object.freeze(['war', 'trade', 'religion', 'spatial', 'institution', 'lifecycle planes']),
    purpose: 'Compose gated domain planes over the post-time realm.',
  }),
  Object.freeze({
    id: 'candidate_selection',
    after: Object.freeze(['mover_planes']),
    owns: Object.freeze(['candidate set', 'tempo budget', 'roll explanations']),
    purpose: 'Select deterministic and stochastic changes under the tempo budget.',
  }),
  Object.freeze({
    id: 'permission_and_apply',
    after: Object.freeze(['candidate_selection']),
    owns: Object.freeze(['major/minor partition', 'dismissal filter', 'proposals', 'applied outcomes']),
    purpose: 'Apply only outcomes authorized for the current advance mode.',
  }),
  Object.freeze({
    id: 'consequence_fold',
    after: Object.freeze(['permission_and_apply']),
    owns: Object.freeze(['memory ratchets', 'news', 'secondary ledgers', 'settlement projections']),
    purpose: 'Fold landed outcomes through dependent consequence and explanation planes.',
  }),
  Object.freeze({
    id: 'finalize_receipt',
    after: Object.freeze(['consequence_fold']),
    owns: Object.freeze(['pulse history', 'provenance', 'residue assertion', 'return envelope']),
    purpose: 'Commit the immutable pulse receipt and expose the next-state envelope.',
  }),
]);

/**
 * Exact integration contracts for the three ordering-sensitive substages in
 * the consequence fold. Reads name the caller-to-callee ports and their direct
 * host sources, never transitive mover reads; writes name only host-visible
 * commits. All references are certification data, and `pulseKernel.js` remains
 * the sole execution and ordering authority.
 */
export const PULSE_SUBSTAGE_MANIFEST_VERSION = 2;

/** @param {string} port @param {string[]} sources */
const readPort = (port, sources) => Object.freeze({ port, sources: Object.freeze([...sources]) });
/** @param {string} target @param {string[]} evidence */
const writeTarget = (target, evidence) => Object.freeze({ target, evidence: Object.freeze([...evidence]) });
/** @param {string} module @param {string} symbol @param {string} evidence */
const check = (module, symbol, evidence) => Object.freeze({ module, symbol, evidence });
/** @param {string} id @param {string} mode @param {{module:string,symbol:string}|null} predicate @param {ReadonlyArray<Readonly<{module:string,symbol:string,evidence:string}>>} checks */
const scopedGate = (id, mode, predicate, checks) => Object.freeze({
  id,
  mode,
  predicate: predicate ? Object.freeze({ ...predicate }) : null,
  checks: Object.freeze([...checks]),
});

export const PULSE_SUBSTAGE_CONTRACTS = Object.freeze([
  Object.freeze({
    id: 'belief_maps', phase: 'consequence_fold', after: Object.freeze([]),
    host: Object.freeze({ module: 'src/domain/worldPulse/pulseKernel.js', symbol: 'simulateCampaignWorldPulse' }),
    call: Object.freeze({ module: 'src/domain/worldPulse/beliefMap.js', symbol: 'advanceBeliefMaps' }),
    gates: Object.freeze([scopedGate('belief_activation', 'callee',
      { module: 'src/domain/worldPulse/beliefMap.js', symbol: 'beliefsActive' },
      [check('src/domain/worldPulse/beliefMap.js', 'advanceBeliefMaps', 'if (!beliefsActive(worldState))')])]),
    reads: Object.freeze([
      readPort('snapshot', ['postTimeSnapshot']), readPort('pressureIdx', ['pIndex']),
      readPort('worldState', ['memoryState']), readPort('tick', ['worldState.tick']),
      readPort('commitmentDiscountFor', ['memoryState', 'worldState.tick', 'momentumCliffOf']),
      readPort('allyIntel', ['simulationRules.allyIntelSharingEnabled', 'postTimeSnapshot', 'memoryState']),
      readPort('credibilityOf', ['memoryState', 'worldState.tick']), readPort('sightOf', ['memoryState']),
    ]),
    writes: Object.freeze([writeTarget('memoryState.spatialLedgers.beliefMaps', [
      "setSpatialLedger(memoryState, 'beliefMaps'", "dropSpatialLedger(memoryState, 'beliefMaps'",
    ])]),
    result: Object.freeze({ kind: 'next_changed', fields: Object.freeze(['next', 'changed']), commonEnvelope: false }),
  }),
  Object.freeze({
    id: 'information_statecraft', phase: 'consequence_fold', after: Object.freeze(['belief_maps']),
    host: Object.freeze({ module: 'src/domain/worldPulse/pulseKernel.js', symbol: 'simulateCampaignWorldPulse' }),
    call: Object.freeze({ module: 'src/domain/worldPulse/informationStatecraft.js', symbol: 'advanceInformationStatecraft' }),
    gates: Object.freeze([scopedGate('information_statecraft_activation', 'host_and_callee',
      { module: 'src/domain/worldPulse/informationStatecraft.js', symbol: 'infoStatecraftActive' }, [
        check('src/domain/worldPulse/pulseKernel.js', 'simulateCampaignWorldPulse', 'if (infoStatecraftActive(memoryState))'),
        check('src/domain/worldPulse/informationStatecraft.js', 'advanceInformationStatecraft', 'if (!infoStatecraftActive(worldState))'),
      ])]),
    reads: Object.freeze([
      readPort('snapshot', ['postTimeSnapshot']), readPort('worldState', ['memoryState']),
      readPort('graph', ['applied.regionalGraph']), readPort('rng', ['rng']),
      readPort('tick', ['worldState.tick']), readPort('now', ['now']),
      readPort('strengthOf', ['postTimeSnapshot', 'pIndex']),
      readPort('alignmentOf', ['postTimeSnapshot', 'memoryState']), readPort('nameFor', ['settlementNameFor']),
    ]),
    writes: Object.freeze([
      writeTarget('memoryState', ['if (infowar.changed) memoryState =']),
      writeTarget('wizardNews', ['wizardNews = appendObservedWizardNewsEntries(']),
      writeTarget('newsReceiptSink', ['appendObservedWizardNewsEntries(wizardNews, infowar.newsEntries, { now }, newsReceiptSink)']),
    ]),
    result: Object.freeze({ kind: 'world_state_mover', fields: Object.freeze(['worldState', 'changed', 'newsEntries', 'envoyPicturePatches']), commonEnvelope: false }),
  }),
  Object.freeze({
    id: 'treaties', phase: 'consequence_fold', after: Object.freeze(['information_statecraft']),
    host: Object.freeze({ module: 'src/domain/worldPulse/pulseKernel.js', symbol: 'simulateCampaignWorldPulse' }),
    call: Object.freeze({ module: 'src/domain/worldPulse/dispositionChannels.js', symbol: 'advanceTreatiesWithDisposition' }),
    gates: Object.freeze([
      scopedGate('peace_causality', 'nested_callee',
        { module: 'src/domain/worldPulse/warReasons.js', symbol: 'peaceCausalActive' },
        [check('src/domain/worldPulse/peaceTerms.js', 'advanceTreaties', 'if (!peaceCausalActive(')]),
      scopedGate('disposition_channels', 'host_argument_and_wrapper', null, [
        check('src/domain/worldPulse/pulseKernel.js', 'simulateCampaignWorldPulse', 'dispositionEnabled: simulationRules.dispositionChannelsEnabled === true'),
        check('src/domain/worldPulse/dispositionChannels.js', 'advanceTreatiesWithDisposition', 'enabled: args.dispositionEnabled === true'),
        check('src/domain/worldPulse/dispositionChannels.js', 'advanceTreatiesWithDisposition', 'const dispositionNews = args.dispositionEnabled === true'),
      ]),
    ]),
    reads: Object.freeze([
      readPort('snapshot', ['postTimeSnapshot']), readPort('worldState', ['memoryState']),
      readPort('settlementUpdates', ['settlementUpdates']), readPort('graph', ['applied.regionalGraph']),
      readPort('pIndex', ['pIndex']), readPort('tick', ['worldState.tick']), readPort('now', ['now']),
      readPort('dispositionEnabled', ['simulationRules.dispositionChannelsEnabled']),
      readPort('dispositionTransitions', ['dispositionTransitions']),
    ]),
    writes: Object.freeze([
      writeTarget('treatyCoalitionEvidence', ['treatyCoalitionEvidence = mergeWarCoalitionEvidence(treatyAdvance.coalitionEvidence)']),
      writeTarget('memoryState', ['({ worldState: memoryState, settlementUpdates, wizardNews } = applyPulseMover({']),
      writeTarget('settlementUpdates', ['({ worldState: memoryState, settlementUpdates, wizardNews } = applyPulseMover({']),
      writeTarget('wizardNews', ['({ worldState: memoryState, settlementUpdates, wizardNews } = applyPulseMover({']),
      writeTarget('newsReceiptSink', ['}, memoryState, settlementUpdates, wizardNews, now, newsReceiptSink));']),
    ]),
    result: Object.freeze({ kind: 'world_state_mover', fields: Object.freeze(['worldState', 'changed', 'newsEntries', 'settlementUpdates', 'coalitionEvidence', 'dispositionDeltas']), commonEnvelope: false }),
  }),
]);
