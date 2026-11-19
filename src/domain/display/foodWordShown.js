/**
 * domain/display/foodWordShown.js — THE FOOD WORD EVERY SURFACE PRINTS (SURFACES-2 item 1; the chair's ruling (r2) of
 * 2026-11-14, ONE READER FOR ONE FACT ON EVERY SURFACE).
 *
 * The town's food status printed in three vocabularies: the Tonight sheet, Daily Life and the quick guide print the
 * food band's ONE home (`summary/tonightSheet.js :: foodBandOf` over `economicState.foodSecurity.foodRecord`); the
 * Overview's Systems Health "Food Security" row and the Substrate tab's Foundations "Food security" row printed the
 * record's stored label ("Secure" beside the band's "Pressured", 159 of 772 births: r2r-thorp-4, -10, -16); the PDF's
 * Identity block printed its own words, Deficit, Surplus or Balanced, off the view model's daily figures (729 of 772:
 * "Surplus" beside the PDF's own Tonight page's "Secure", r2r-thorp-0). Each of those sites now prints this leaf.
 *
 * The word is the band's (`foodBandOf`: the band, except where the record makes the band's word false) and the colour
 * beside it is the band's. A record with no band (a save older than the food record) keeps its stored label and colour.
 * null where neither is held: the surface prints no food word (a surface with no word prints less, never another).
 *
 * Pure: no randomness, no clock, no write.
 */
import { foodBandOf } from '../summary/tonightSheet.js';

/**
 * @param {unknown} settlement the settlement record
 * @returns {{ label: string, color: string | null } | null}
 */
export function foodWordShown(settlement) {
  const fs = /** @type {{ economicState?: { foodSecurity?: { label?: unknown, color?: unknown, foodRecord?: Parameters<typeof foodBandOf>[0] } | null } | null } | null | undefined} */ (settlement)
    ?.economicState?.foodSecurity;
  const band = foodBandOf(fs?.foodRecord);
  if (band) return { label: band.label, color: band.color };
  const label = typeof fs?.label === 'string' ? fs.label.trim() : '';
  if (!label) return null;
  return { label, color: typeof fs?.color === 'string' && fs.color ? fs.color : null };
}
