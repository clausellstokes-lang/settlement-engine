/**
 * magicDeskRead.js — THE MAGIC TAB'S DESK READ (DS-DEF-9, the arcane-reliance lens), gated
 * (STYLE-RULINGS-2 B10(a); lane SW-B7b PROJECTION, the fourth seat), in the
 * `economyDeskRead.js` idiom.
 *
 * WHY A MODULE: the Magic tab's one lens now has two readers — the tab, and the public prose
 * composer (`publicProseCompose.js`), which draws the owner's player view at the save — and the
 * mount registry's ARM 3 grades every corpus read where it sits. One gated read here serves both.
 *
 * THE PUBLIC BRANCH. A shared page prints the lens the owner's player view drew, shipped as text
 * at the owner's save (`magic`); an absent or stale projection is SILENT, never a re-draw.
 * Where magic does not function nothing here is true (T2-24), so the desk is not drawn on any
 * page.
 *
 * @enforced-by tests/lint/dossierMountRegistry.walker.test.js (ARM 3)
 * @enforced-by tests/components/publicProseEquality.test.jsx (`magic`)
 */
import { defenseMagicDependencyProse } from '../../domain/display/stateProse/defenseStateProse.js';
import { magicRelianceDeskSettlement } from '../../domain/display/dossierViewModel.js';
import { tierNounFor } from '../../domain/display/stateProse/weaveBlock.js';
import { magicWorksAt } from '../../domain/worldPulse/magicWorksAt.js';
import { publicProseOf } from '../../domain/display/publicProse.js';

/** THE SILENT DESK (written out). */
export const SILENT_MAGIC_DESK = Object.freeze({ arcaneReliance: null });

/** @param {any} settlement @returns {Readonly<Record<string, any>>} */
function publicMagicDesk(settlement) {
  const shipped = publicProseOf(settlement, 'magic');
  if (!shipped || typeof shipped !== 'object') return SILENT_MAGIC_DESK;
  return Object.freeze({ arcaneReliance: /** @type {Record<string, unknown>} */ (shipped).arcaneReliance ?? null });
}

/**
 * Read DS-DEF-9 for the Magic tab, gated. The desk is handed the settlement with its reliance
 * flag READ FROM the view model's one reading (`magicRelianceDeskSettlement`, lane MAGIC's
 * ruling 2), never the siege-time frozen flag.
 * @param {any} settlement
 * @param {{publicDossier?: boolean, playerView?: boolean}} [options]
 * @returns {Readonly<Record<string, any>>}
 */
export function magicDeskRead(settlement, options = {}) {
  if (!settlement || magicWorksAt({ settlement }) === false) return SILENT_MAGIC_DESK;
  // ⛔ THE GATE IS IN THE READ'S OWN STATEMENT (ARM 3).
  return options.publicDossier ? publicMagicDesk(settlement) : defenseMagicDependencyProse(magicRelianceDeskSettlement(settlement), {
    seed: String(settlement?._seed ?? settlement?.id ?? ''),
    audience: options.playerView ? 'player' : 'dm',
    tierNoun: tierNounFor(settlement.tier),
  });
}
