/**
 * design/lightModel.js — THE ONE FIXED LIGHT of the drawn plane.
 *
 * Every lit surface the product draws reads its light direction from here, so nothing is
 * ever lit from a second side (design §1, "the surveyor's way"). Its live readers today are
 * the building-massing face shading (domain/townMap/massing.js) and, lifted to three
 * dimensions, the arch kernel's per-pixel Lambert model
 * (domain/townMap/arch/rationalTables.js LIGHT_MODEL).
 *
 * WHY IT LIVES ALONE (§725/§748, and the reason held): the constant was declared inside the
 * glyph compiler — a member of the legacy settlement-map draw stack — while the RETAINED
 * massing layer read it. It was given its own leaf in the design-token zone precisely so the
 * draw stack's removal could not darken the surfaces that stay. ⭐ THAT REMOVAL HAS NOW
 * HAPPENED (§772): the glyph hatch, the ground-dress wall shadows and the landform relief
 * hachures all left with it, and this leaf and its two remaining readers are untouched —
 * which is the pre-sever doing exactly the job it was minted for.
 */

/**
 * THE ONE FIXED LIGHT — NW. Shadows fall to the SE by this offset direction (dx,dy,
 * both positive ⇒ down-right on screen). The magnitudes are per-glyph-footprint-width
 * for the glyph hatch; every other consumer normalizes and scales as it needs.
 * Freezing keeps it a shared const.
 */
export const SHADOW_DIR = Object.freeze({ dx: 0.16, dy: 0.14 });
