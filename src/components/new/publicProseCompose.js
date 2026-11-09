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
import { PUBLIC_PROSE_VERSION, aliasRepeatedRungs, shippedProseOf } from '../../domain/display/publicProse.js';
import { economyDeskRead } from './economyDeskRead.js';
import { economicsDeskArgs, impairedInstitutionOf, overviewStressesOf } from './deskHostArgs.js';
import { generalDeskLines } from './generalDeskRead.js';
import { populationTrendBand } from '../../domain/display/trendLens.js';
import { computeChainSets } from './tabHelpers.js';


/**
 * THE SITES: one entry per desk call site whose public branch reads `publicProseOf(r, site)`.
 * Each composes the owner's player-view draw for that site from the owner's record: every call
 * hands its desk reader the `publicDossier` this module RECEIVES (false at the save boundary,
 * so the reader draws; the mount registry's ARM 3 reads the flag at the call) and
 * `playerView: true` (the shared pages are player audiences).
 * @type {ReadonlyArray<readonly [string, (settlement: any, publicDossier: boolean) => any]>}
 */
export const PUBLIC_PROSE_SITES = Object.freeze([
  // THE ECONOMY DESK, one site per host (economyDeskRead.js is its one caller).
  ['economy:economics', (s, publicDossier) => economyDeskRead(s, { publicDossier, playerView: true, tier: s?.tier, ...economicsDeskArgs(s) })],
  ['economy:services', (s, publicDossier) => economyDeskRead(s, {
    publicDossier, playerView: true, tier: s?.tier,
    impairedInstitution: impairedInstitutionOf(s?.availableServices, computeChainSets(s).impaired),
  })],
  ['economy:resources', (s, publicDossier) => economyDeskRead(s, { publicDossier, playerView: true, tier: s?.tier })],
  ['economy:daily_life', (s, publicDossier) => economyDeskRead(s, { publicDossier, playerView: true, tier: s?.tier })],
  // THE GENERAL DESK, one site per host group (generalDeskRead.js is its one caller). The
  // Overview states no tier, exactly as OverviewTab's call does.
  ['general:overview', (s, publicDossier) => generalDeskLines(s, {
    publicDossier, playerView: true, stresses: overviewStressesOf(s),
    populationTrend: populationTrendBand(s?.populationHistory),
  }).overview],
  ['general:history', (s, publicDossier) => generalDeskLines(s, { publicDossier, playerView: true, tier: s?.tier }).history],
  ['general:viability', (s, publicDossier) => generalDeskLines(s, { publicDossier, playerView: true, tier: s?.tier }).viability],
  ['general:economics', (s, publicDossier) => generalDeskLines(s, { publicDossier, playerView: true, tier: s?.tier }).economics],
].map((entry) => Object.freeze(entry)));

/**
 * The projection for one owner record, or null with no record.
 * @param {any} settlement the OWNER's record (seed and all)
 * @param {{publicDossier?: boolean}} [gate] the save boundary passes none: the owner draws. A
 *   caller that says `publicDossier: true` gets every site SILENT, as the readers' gate rules.
 * @returns {{v: string, blocks: Record<string, unknown>}|null}
 */
export function composePublicProse(settlement, { publicDossier = false } = {}) {
  if (!settlement || typeof settlement !== 'object' || Array.isArray(settlement)) return null;
  /** @type {Record<string, unknown>} */
  const blocks = {};
  for (const [site, draw] of PUBLIC_PROSE_SITES) {
    try {
      const shipped = shippedProseOf(draw(settlement, publicDossier));
      if (shipped !== null && shipped !== undefined) blocks[site] = shipped;
    } catch {
      // The site prints SILENT on the public page; the owner's own view is untouched.
    }
  }
  return { v: PUBLIC_PROSE_VERSION, blocks: aliasRepeatedRungs(blocks) };
}
