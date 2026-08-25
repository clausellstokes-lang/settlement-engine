/**
 * leaf.mjs — REG-3's leaf resolution, now a THIN RE-EXPORT of the shared kit.
 *
 * ⭐ ODQ §634.3 · THE KIT CONSOLIDATION. The body of this file moved verbatim to
 * `harness/instruments/leaf.mjs`, where REG-5..9 read it instead of re-writing it. The file
 * stays as a re-export so REG-3's own probes keep their import path and this consolidation
 * proves ZERO behaviour change rather than asking to be believed.
 */
export { CORPUS, buildOne, siteRepresentatives, bothTotals, siteKey, buildLeaf, specOf, artifactName, artifactPath, keysOfTier, tiers, ROOT } from '../instruments/leaf.mjs';
