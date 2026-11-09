/**
 * viabilityDeskRead.js — THE VIABILITY TAB'S TWO SEEDED READS, gated (STYLE-RULINGS-2 B10(a);
 * lane SW-B7b PROJECTION, the fourth seat), in the `economyDeskRead.js` idiom.
 *
 * Two sites, both drawn on the owner's record and shipped as text at the save:
 *   `viability`           — DS-DEF-12's isolation lens (`defenseIsolationSupportProse`), whose
 *                           callers are this tab and `printProse.js` (the PDF, never public);
 *   `viewModel:viability` — `deriveViability`'s verdict summary, whose variant is SEEDED
 *                           (`dossierViewModel.js :: viabilitySeed`), shipped as `{summary}`.
 *
 * THE PUBLIC BRANCH. A shared page prints what the owner's player view drew; an absent or
 * stale projection is SILENT, never a seedless re-draw (`publicProse.js`, rules 1 and 2).
 *
 * @enforced-by tests/lint/dossierMountRegistry.walker.test.js (ARM 3)
 * @enforced-by tests/components/publicProseEquality.test.jsx (`viability`, `viewModel:viability`)
 */
import { defenseIsolationSupportProse } from '../../domain/display/stateProse/defenseStateProse.js';
import { deriveViability } from '../../domain/display/dossierViewModel.js';
import { tierNounFor } from '../../domain/display/stateProse/weaveBlock.js';
import { publicProseOf } from '../../domain/display/publicProse.js';

/** THE SILENT DESK (written out). */
export const SILENT_ISOLATION_DESK = Object.freeze({ isolationSupply: null });

/** @param {any} settlement @returns {Readonly<Record<string, any>>} */
function publicIsolationDesk(settlement) {
  const shipped = publicProseOf(settlement, 'viability');
  if (!shipped || typeof shipped !== 'object') return SILENT_ISOLATION_DESK;
  return Object.freeze({ isolationSupply: /** @type {Record<string, unknown>} */ (shipped).isolationSupply ?? null });
}

/**
 * DS-DEF-12, whether a place with no dependable road, river or port can keep itself supplied.
 * @param {any} settlement @param {{publicDossier?: boolean, playerView?: boolean}} [options]
 * @returns {Readonly<Record<string, any>>}
 */
export function isolationDeskRead(settlement, options = {}) {
  if (!settlement) return SILENT_ISOLATION_DESK;
  // ⛔ THE GATE IS IN THE READ'S OWN STATEMENT (ARM 3).
  return options.publicDossier ? publicIsolationDesk(settlement) : defenseIsolationSupportProse(settlement, {
    seed: String(settlement?._seed ?? settlement?.id ?? ''),
    audience: options.playerView ? 'player' : 'dm',
    tierNoun: tierNounFor(settlement.tier),
  });
}

/**
 * The reconciled viability verdict (§1f), gated: the owner's draw, or on a shared page the
 * summary shipped at `viewModel:viability` — and, unstamped, an EMPTY summary (silence), never
 * a re-draw of the seeded variant.
 * @param {any} settlement @param {{publicDossier?: boolean}} [options]
 * @returns {{summary: string}|null} null with no settlement
 */
export function viabilityVerdictRead(settlement, options = {}) {
  if (!settlement) return null;
  if (options.publicDossier) {
    const shipped = publicProseOf(settlement, 'viewModel:viability');
    const summary = shipped && typeof shipped === 'object' ? /** @type {Record<string, unknown>} */ (shipped).summary : null;
    return { summary: typeof summary === 'string' ? summary : '' };
  }
  const verdict = deriveViability(settlement);
  return { summary: String(verdict?.summary ?? '') };
}
