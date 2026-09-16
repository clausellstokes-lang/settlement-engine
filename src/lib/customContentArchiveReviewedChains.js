/**
 * Cross-ledger authority proof for reviewed chains inside an archive.
 *
 * Exact chain shape is necessary but insufficient: every custom node must name
 * one coherent source definition/revision tuple. Historical reviewed revisions
 * may pin historical or archived authorable revisions, but the pair must still
 * agree on category, local identity, lineage number, and canonical content
 * hash. One reviewed artifact also retains one immutable chain identity across
 * its history, and current heads remain owner-unique even when archived.
 */

import {
  contentRevisionHash,
} from '../domain/content/customContentVersioning.js';
import {
  isReviewedDerivedContentCategory,
} from '../domain/content/reviewedSupplyChainPersistence.js';

const CATEGORY_BY_KIND = Object.freeze({
  institution: 'institutions',
  service: 'services',
  resource: 'resources',
  good: 'tradeGoods',
});

/**
 * @param {{
 *   definitions:Array<Record<string, any>>,
 *   revisions:Array<Record<string, any>>,
 *   definitionById:Map<string, Record<string, any>>,
 *   revisionById:Map<string, Record<string, any>>,
 * }} graph
 */
export function validateReviewedSupplyChainArchiveGraph(graph) {
  /** @type {Map<string, string>} */
  const chainIdByDefinition = new Map();
  for (const reviewedRevision of graph.revisions) {
    if (!isReviewedDerivedContentCategory(reviewedRevision.category)) continue;
    const chainId = reviewedRevision.data.chainId;
    const priorChainId = chainIdByDefinition.get(reviewedRevision.definitionId);
    if (priorChainId != null && priorChainId !== chainId) {
      throw new TypeError(
        'A reviewed artifact cannot change canonical chain identity.',
      );
    }
    chainIdByDefinition.set(reviewedRevision.definitionId, chainId);

    for (const node of reviewedRevision.data.discovered.nodes) {
      if (node.source !== 'custom') continue;
      const definition = graph.definitionById.get(node.definitionId);
      const revision = graph.revisionById.get(node.revisionId);
      const expectedCategory = CATEGORY_BY_KIND[node.kind];
      if (
        !definition
        || !revision
        || definition.category !== expectedCategory
        || definition.localUid !== node.uid
        || revision.definitionId !== definition.id
        || revision.category !== expectedCategory
        || revision.revisionNumber !== node.revisionNumber
        || revision.contentHash !== node.contentHash
        || contentRevisionHash(expectedCategory, revision.data)
          !== node.contentHash
      ) {
        throw new TypeError(
          'A reviewed chain custom-node revision tuple is incoherent.',
        );
      }
    }
  }

  const definitionByCurrentChainId = new Map();
  for (const definition of graph.definitions) {
    if (!isReviewedDerivedContentCategory(definition.category)) continue;
    const head = graph.revisionById.get(definition.headRevisionId);
    const chainId = head?.data?.chainId;
    if (!chainId) {
      throw new TypeError('A reviewed artifact head is unavailable.');
    }
    const existing = definitionByCurrentChainId.get(chainId);
    if (existing && existing !== definition.id) {
      throw new TypeError(
        'Archive reviewed artifact head identity is duplicated.',
      );
    }
    definitionByCurrentChainId.set(chainId, definition.id);
  }
}
