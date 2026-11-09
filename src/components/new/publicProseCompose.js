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
import { criminalStructureOf, economicsDeskArgs, impairedInstitutionOf, overviewStressesOf } from './deskHostArgs.js';
import { overviewIdentityOf } from './overviewIdentity.js';
import { generalDeskLines } from './generalDeskRead.js';
import { stressorsDeskRead } from './stressorsDeskRead.js';
import { defenseDeskRead, DEFENSE_LENSES } from './defenseDeskRead.js';
import { faithDeskReadings, warFaithDeskRungs } from './tabs/WarFaithDesk.jsx';
import { magicDeskRead } from './magicDeskRead.js';
import { isolationDeskRead, viabilityVerdictRead } from './viabilityDeskRead.js';
import { flag } from '../../lib/flags.js';
import { POWER_BLOC_RUNGS, governanceAccountRead, powerDeskRead, powerDeskReadings, powerLadderRead, powerLadderRowsOf } from './powerDeskRead.js';
import { populationTrendBand } from '../../domain/display/trendLens.js';
import { computeChainSets } from './tabHelpers.js';
import { isPhantomRecord } from '../../domain/edit/phantoms.js';


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
  // The Overview's identity line (the culture scope and "Governed by"): composed owner-side, since
  // the culture phrase reads fields the projection strips (overviewIdentity.js).
  ['overview:identity', (s, publicDossier) => {
    const identity = overviewIdentityOf(s, { publicDossier });
    return identity.scope || identity.governs ? identity : null;
  }],
  // THE STRESSORS DESK (stressorsDeskRead.js is its one caller): the Overview's crisis and
  // condition positions. The world stressor is campaign-only and ships null (owner-only).
  ['stressors:overview', (s, publicDossier) => stressorsDeskRead(s, {
    publicDossier, playerView: true, stresses: overviewStressesOf(s), tier: s?.tier, worldStressor: null,
  })],
  // THE DEFENSE DESK (defenseDeskRead.js is its one caller): one site per lens, the Defense
  // tab's eight reads. The owner's record carries no veil, so the criminal lens is drawn on the
  // owner's own classification; a veiled block is dropped on the way out (galleryVeil.js).
  ...DEFENSE_LENSES.map((lens) => /** @type {const} */ ([`defense:${lens}`, (/** @type {any} */ s, /** @type {boolean} */ publicDossier) => defenseDeskRead(s, {
    publicDossier, playerView: true, tier: s?.tier, crimStructure: criminalStructureOf(s)?.key ?? null,
  })[lens]])),
  // THE POWER DESK (powerDeskRead.js is its one caller). The blocs (DS-POW-7) read the played
  // world's politics ledger: campaign-only, so their rungs are never shipped (owner-only).
  ['power:desk', (s, publicDossier) => withoutRungs(powerDeskRead(s, {
    publicDossier, playerView: true, readings: powerDeskReadings(s, { playerView: true }),
  }), POWER_BLOC_RUNGS)],
  // The governance account paragraph (OWNER-WORDS-DOSSIER item 3), as text.
  ['power:governance', (s, publicDossier) => governanceAccountRead(s, { publicDossier })],
  // DS-POW-3, one line per faction with a ladder, as a list (a faction's NAME never becomes a
  // key, so the projection's key denylist cannot strip one).
  ['power:ladder', (s, publicDossier) => {
    const rows = powerLadderRowsOf(s, s?.powerStructure?.factions)
      .map(({ f, rungs, instab }) => ({
        faction: f.faction,
        rung: powerLadderRead(s, { publicDossier, playerView: true, factionName: f.faction, rungs, instability: instab }),
      }))
      .filter((row) => row.rung);
    return rows.length ? rows : null;
  }],
  // THE WAR & FAITH DESK from FaithTab (WarFaithDesk.jsx :: warFaithDeskRungs is its one caller):
  // the panel model's readings, no world, so every war rung is null. WarTab is campaign-only and
  // owner-only: it names no site, so its shared page is SILENT.
  ['warFaith:faith', (s, publicDossier) => warFaithDeskRungs({
    settlement: s, publicDossier, playerView: true, readings: faithDeskReadings(s),
  })],
  // THE MAGIC TAB's DS-DEF-9 lens (magicDeskRead.js); nothing ships where magic does not function.
  ['magic', (s, publicDossier) => magicDeskRead(s, { publicDossier, playerView: true })],
  // THE VIABILITY TAB's DS-DEF-12 isolation lens (viabilityDeskRead.js).
  ['viability', (s, publicDossier) => isolationDeskRead(s, { publicDossier, playerView: true })],
  // `deriveViability`'s SEEDED verdict (viabilitySeed), shipped as `{summary}` text; behind
  // canonicalViewModel exactly as ViabilityTab reads it (off, the tab prints the record's datum).
  ['viewModel:viability', (s, publicDossier) => (flag('canonicalViewModel') ? viabilityVerdictRead(s, { publicDossier }) : null)],
].map((entry) => Object.freeze(entry)));

/**
 * A drawn desk with the named rungs nulled (an owner-only lens the save must not ship).
 * @param {any} desk @param {ReadonlyArray<string>} keys @returns {any}
 */
function withoutRungs(desk, keys) {
  if (!desk || typeof desk !== 'object') return desk;
  return { ...desk, ...Object.fromEntries(keys.map((key) => [key, null])) };
}

/**
 * The projection for one owner record, or null with no record.
 * @param {any} settlement the OWNER's record (seed and all)
 * @param {{publicDossier?: boolean}} [gate] the save boundary passes none: the owner draws. A
 *   caller that says `publicDossier: true` gets every site SILENT, as the readers' gate rules.
 * @returns {{v: string, blocks: Record<string, unknown>}|null} null with no record, or for a
 *   phantom stub
 */
export function composePublicProse(settlement, { publicDossier = false } = {}) {
  if (!settlement || typeof settlement !== 'object' || Array.isArray(settlement)) return null;
  // A phantom counterparty is EM-F1's frozen five-key stub, not a dossier: nothing is shared
  // from it, so the save stamps nothing and its persisted shape stays the mint's.
  if (isPhantomRecord(settlement)) return null;
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
