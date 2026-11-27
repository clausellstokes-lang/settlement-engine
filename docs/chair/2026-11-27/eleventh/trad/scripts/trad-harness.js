// TRAD-MEASURE harness: bundled by build-trad.mjs against a TREE (plain node, no vitest). Exports the tree's own readers.
export { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
export { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
export { deriveFoundingTraditions, traditionCountCap, fieldRiteRefused } from 'TREE/src/domain/traditions/genesis.js';
export { shownTraditionsOf, sharedTraditionRowsOf, motifNeeds, descriptionSetOf } from 'TREE/src/domain/traditions/shownTraditions.js';
export { describeTraditions, withoutFunction } from 'TREE/src/domain/traditions/traditionDescription.js';
export { liveInstitutions } from 'TREE/src/domain/institutions/institutionRoster.js';
export { isHideableHouse } from 'TREE/src/domain/people/cardVeil.js';
export { factsOf } from 'TREE/src/domain/facts/factsOf.js';
export { atomHolds } from 'TREE/src/domain/facts/factVocabulary.js';
export { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
export { resolveTerrain } from 'TREE/src/domain/resolveTerrain.js';
export { waterAccessKind } from 'TREE/src/domain/tradeRouteSemantics.js';
