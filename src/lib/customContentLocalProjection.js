/**
 * Pure read projections for the browser-local immutable content ledger.
 */

import {
  detachContentJson,
} from '../domain/content/contentFingerprint.js';
import {
  projectDefinitionHead,
} from '../domain/content/customContentVersioning.js';
import {
  REVIEWED_SUPPLY_CHAIN_CATEGORY,
  projectReviewedSupplyChainDefinitionHead,
  reviewedSupplyChainRevisionEntry,
} from '../domain/content/reviewedSupplyChainPersistence.js';
import { compareCodepoint } from '../domain/deterministicSort.js';
import {
  EMPTY_CUSTOM_CONTENT,
  emptyCustomContentGroups,
} from './customContentEmpty.js';

export { EMPTY_CUSTOM_CONTENT, emptyCustomContentGroups };

export function groupedFromLocalLedger(
  ledger,
  { includeArchived = false, onlyArchived = false } = {},
) {
  const grouped = emptyCustomContentGroups();
  const definitions = Object.values(ledger.definitions || {})
    .sort((left, right) => compareCodepoint(
      String(right.updatedAt || ''),
      String(left.updatedAt || ''),
    ));
  for (const definition of definitions) {
    if (onlyArchived && !definition.archivedAt) continue;
    if (definition.archivedAt && !includeArchived) continue;
    const revision = ledger.revisions?.[definition.headRevisionId];
    if (!revision) continue;
    if (!grouped[definition.category]) grouped[definition.category] = [];
    let projection;
    if (definition.category === REVIEWED_SUPPLY_CHAIN_CATEGORY) {
      try {
        // This read model is a trust boundary: a legacy/corrupt reviewed row
        // must not become active merely because it occupies the right bucket.
        projection = projectReviewedSupplyChainDefinitionHead(
          definition,
          revision,
        );
        reviewedSupplyChainRevisionEntry(projection);
      } catch {
        continue;
      }
    } else {
      projection = projectDefinitionHead(definition, revision);
    }
    grouped[definition.category].push(projection);
  }
  return grouped;
}

export function revisionHistoryFromLocalLedger(ledger, definitionId) {
  const definition = ledger.definitions?.[String(definitionId)];
  if (!definition) return [];
  return Object.values(ledger.revisions || {})
    .filter(revision => String(revision.definitionId) === String(definitionId))
    .sort((left, right) => (
      Number(right.revisionNumber || 0) - Number(left.revisionNumber || 0)
      || compareCodepoint(String(right.id || ''), String(left.id || ''))
    ))
    .map(revision => Object.freeze({
      .../** @type {Record<string, unknown>} */ (detachContentJson(revision)),
      isHead: String(revision.id) === String(definition.headRevisionId),
      definitionArchivedAt: definition.archivedAt || null,
    }));
}
