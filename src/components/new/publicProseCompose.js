/**
 * components/new/publicProseCompose.js — THE PUBLIC PROSE PROJECTION'S COMPOSER (STYLE-RULINGS-2
 * B10(a); lane SW-B7b PROJECTION). The leaf it writes for is `domain/display/publicProse.js`.
 *
 * `composePublicProse(settlement)` runs on the OWNER's record at the save boundary
 * (`lib/saves.js`), calls each call site's ONE desk caller exactly as the owner's player view
 * calls it (`playerView: true, publicDossier: false`), and returns the drawn rungs as text keyed
 * by site. So the seed is read HERE, owner-side, and never shipped; the public page prints what
 * the owner's player view prints.
 *
 * ⛔ NEVER A SECOND DERIVATION. Where a host tab computes arguments for its desk call (the food
 * balance, the impaired house, the power readings, …), that computation is EXTRACTED from the
 * tab into an exported pure helper which the tab and this composer both call. A site whose
 * arguments this module re-derived would ship a sentence the owner never saw.
 *
 * ⛔ LOADED LAZILY, ONLY BY THE SAVE PATH. It reaches every desk's corpus leaf, which is the
 * weight the tab chunks pay one at a time; `saves.js` sits in the eager first-paint chain, so
 * it reaches this module by a dynamic import alone (the zero-slack ceiling).
 *
 * FAIL-CLOSED PER SITE. A site whose caller throws ships nothing, and its public block prints
 * SILENT (publicProse.js, rule 1); a save never fails on the projection.
 *
 * Each desk family registers its sites below in its own cause, with its public branch lit in
 * the same commit.
 */
import { PUBLIC_PROSE_VERSION, shippedProseOf } from '../../domain/display/publicProse.js';

/**
 * THE SITES: one entry per desk call site whose public branch reads `publicProseOf(r, site)`.
 * Each composes the owner's player-view draw for that site from the owner's record.
 * @type {ReadonlyArray<readonly [string, (settlement: any) => any]>}
 */
export const PUBLIC_PROSE_SITES = Object.freeze([]);

/**
 * The projection for one owner record, or null with no record.
 * @param {any} settlement the OWNER's record (seed and all)
 * @returns {{v: string, blocks: Record<string, unknown>}|null}
 */
export function composePublicProse(settlement) {
  if (!settlement || typeof settlement !== 'object' || Array.isArray(settlement)) return null;
  /** @type {Record<string, unknown>} */
  const blocks = {};
  for (const [site, draw] of PUBLIC_PROSE_SITES) {
    try {
      const shipped = shippedProseOf(draw(settlement));
      if (shipped !== null && shipped !== undefined) blocks[site] = shipped;
    } catch {
      // The site prints SILENT on the public page; the owner's own view is untouched.
    }
  }
  return { v: PUBLIC_PROSE_VERSION, blocks };
}
