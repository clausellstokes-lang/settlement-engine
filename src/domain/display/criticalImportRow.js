/**
 * domain/display/criticalImportRow.js — THE CRITICAL IMPORT THE RECORD HOLDS SHORT, AND THE TWO FILLS IT IS SPOKEN IN: A LEAF
 * (RULING 122-B-2, F7, the eleventh chair, 2026-11-28).
 *
 * WHY A LEAF. `display/tensionDescriptionShown.js` (R6) names the good the scarcity tension is about with the economy desk's
 * own reader, `criticalImportRow`; imported from the desk, it carried the desk and its corpus (`economy.generated.js`) into
 * the PDF render worker and Foundry's export (+124,696 B and +124,210 B minified, the independent reader's proxy). The reader
 * and what it needs (the desk's bare-common and proper fills and the generator's two reason shapes) live here, moved word for
 * word; the desk (`stateProse/economyStateProse.js`) imports them back and keeps exporting `criticalImportRow`, so no other
 * caller changes. It imports no desk and no corpus: only `data/houseSentenceName.js` (a pure leaf).
 * @enforced-by tests/architecture/helperCarriesNoDesk.test.js
 */
import { houseSentenceName } from '../../data/houseSentenceName.js';

/** @param {unknown} value @returns {string} */
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * A `bare-common` fill, or `undefined` — the desk's own half of the shape contract.
 *
 * The refusal is scoped to the BARE-COMMON class on purpose. That is the class whose
 * violation produces broken English at every seam that carries it ("the Highly diversified
 * — multiple major revenue streams keeps more hands busy"), and refusing is the correct
 * behaviour under R-DST-K: the kernel's anchored liveness drops the variants that name the
 * slot and the pool degrades to the ones that never needed it. A `proper` fill is NOT
 * refused — a name is a name, an odd one still reads, and blanking a whole page over a
 * generator quirk would trade a small wrong for a large silence.
 *
 * The rules mirror `fillShapeViolation` in scripts/lib/dossier-slot-shapes.mjs, and the
 * contract test proves the two agree over a probe corpus rather than trusting that they do.
 * @param {string|undefined} value
 * @returns {string|undefined}
 */
export function bareCommonFill(value) {
  if (!value) return undefined;
  if (/^(?:the|a|an|its|his|her|their|our|this|that|these|those)\b/i.test(value)) return undefined;
  if (/[—–]/.test(value)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(value)) return undefined;
  if (/[0-9]/.test(value)) return undefined;
  if (/[a-z]+_[a-z]+/.test(value)) return undefined;
  return /^[a-z]/.test(value) ? value : undefined;
}

/**
 * A `proper` fill, or `undefined`. The sibling of `bareCommonFill` for the one slot class
 * this desk now supplies a NAME to (`{institution}` — a house on the settlement's roster).
 *
 * THE FILE'S OWN OLD NOTE SAID A PROPER FILL IS NOT REFUSED, and this narrows it rather
 * than reversing it. A name being odd is still a name and still reads; what is refused here
 * is a value that is not a name at all — §0d's digit ban and VOICE_AND_TONE's dash ban apply
 * at the FILL for EVERY shape, which is what `fillShapeViolation` says and what the register
 * §0c states above its own table. MEASURED at this tip over 24 generated settlements: of the
 * 25 distinct `processingInstitutions` values the resource generator writes, exactly ONE is
 * refused — `Bakers (5-15)`, which carries the roster's own count range — so the refusal
 * costs one variant on one row rather than a class.
 * @param {string|undefined} value
 * @returns {string|undefined}
 */
export function properFill(value) {
  if (!value) return undefined;
  value = houseSentenceName(value); // BAR7-DESKS (5x.slash): a slash label takes its prose form (`data/houseSentenceName.js`)
  if (/[—–]/.test(value)) return undefined;
  if (/[.!?]\s|[.!?]$/.test(value)) return undefined;
  if (/[0-9]/.test(value)) return undefined;
  if (/[a-z]+_[a-z]+/.test(value)) return undefined;
  return /^[A-Z]/.test(value) ? value : undefined;
}

/** The generator's own reason shape for a house-required import: `Required by <House> but …`. */
const REQUIRED_BY_RE = /^Required by (.+?) but not available\b/;

/** The generator's own reason shape for a terrain-only import. */
export const TERRAIN_ONLY_RE = /terrain cannot produce this locally$/;

/**
 * DS-ECO-12's critical import (construction C6): ONE critical import with its reason, the
 * house-requires form first (the worklist's lead), then the terrain form. `{good}` is the
 * import's own key in bare-common form (a parenthesised gloss is refused), never the export bag.
 * @param {{critical?: unknown, reasons?: Record<string, unknown>|null}|null|undefined} imports
 * @returns {{good: string, reason: string, institution: string|undefined}|null}
 */
export function criticalImportRow(imports) {
  const critical = Array.isArray(imports?.critical) ? imports.critical : [];
  const rows = critical.map((item) => {
    const raw = text(item);
    const reason = text(imports?.reasons?.[raw]);
    const house = REQUIRED_BY_RE.exec(reason);
    return { good: raw.includes('(') ? '' : bareCommonFill(raw) || '', reason, institution: house ? properFill(house[1]) : undefined };
  }).filter((row) => row.good && row.reason);
  return rows.find((row) => row.institution) || rows.find((row) => TERRAIN_ONLY_RE.test(row.reason)) || null;
}
