/**
 * design/lightModel.js — THE ONE FIXED LIGHT of the drawn plane.
 *
 * Every lit surface the product draws reads its light direction from here, so nothing is
 * ever lit from a second side (design §1, "the surveyor's way"): the glyph ink-hatch
 * shadow (design/townGlyphs/glyphCompiler.js), the ground-dress WALL SHADOWS and the
 * landform-flank RELIEF hachures (domain/townMap/groundDress.js), and the building-massing
 * face shading (domain/townMap/massing.js). The arch kernel's per-pixel Lambert model
 * (domain/townMap/arch/rationalTables.js LIGHT_MODEL) is this same direction lifted to
 * three dimensions.
 *
 * WHY IT LIVES ALONE (§725/§748): the constant was declared inside the glyph compiler —
 * a member of the legacy settlement-map draw stack that is being stripped — while the
 * RETAINED massing layer reads it. A shared token is not a glyph-compiler concern, so it
 * gets its own leaf in the sanctioned design-token zone and the glyph registry's removal
 * cannot darken the surfaces that stay.
 */

/**
 * THE ONE FIXED LIGHT — NW. Shadows fall to the SE by this offset direction (dx,dy,
 * both positive ⇒ down-right on screen). The magnitudes are per-glyph-footprint-width
 * for the glyph hatch; every other consumer normalizes and scales as it needs.
 * Freezing keeps it a shared const.
 */
export const SHADOW_DIR = Object.freeze({ dx: 0.16, dy: 0.14 });
