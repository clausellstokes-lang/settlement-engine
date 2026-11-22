/**
 * Canonical identity for a discovered supply-chain topology.
 *
 * Discovery, strict persistence admission, archive remap, and SQL parity all
 * address the same ordered node path. Keeping that identity primitive neutral
 * prevents inference from depending on a persistence implementation.
 */

import { fingerprintContent } from './contentFingerprint.js';
import { slugify } from '../../kernel/slugify.js';

/** @param {unknown} value */
function chainSlug(value) {
  // JavaScript and PostgreSQL use different Unicode case tables (for example,
  // dotted I and Kelvin sign). The canonical primitive's ASCII-only mode
  // preserves the database identity contract before stripping non-ASCII text.
  return slugify(value, { asciiLower: true });
}

/**
 * @param {ReadonlyArray<unknown>} nodeUids
 */
export function reviewedSupplyChainIdForNodeUids(nodeUids) {
  const uids = nodeUids.map(uid => String(uid));
  const readable = (chainSlug(uids.join('-')) || 'chain')
    .slice(0, 120)
    .replace(/-+$/g, '');
  return [
    'discovered',
    readable || 'chain',
    fingerprintContent({ nodeUids: uids }),
  ].join('.');
}
