/**
 * domain/display/tierStockImage.js — THE STOCK PORTRAIT OF A SETTLEMENT'S TIER.
 *
 * Owner order (ODQ §934.32, 2026-09-19): "we have stock images of different
 * tiers to represent them and they should be the default image when they are
 * shared on the gallery and our landing page until an owner replaces that
 * image" — corrected the same day to THREE paintings across the six rungs:
 * "use the thorpe image for thorpe and hamlets, village for village and towns,
 * and city for cities and metropolises."
 *
 * Until now every card that showed a settlement WITHOUT an owner-supplied image
 * fell back to something weaker, and each surface invented its own weaker thing:
 * a single serif INITIAL on a gradient (the gallery card), a painted backdrop
 * from a private six-to-three map (the landing's gallery row), or no image at
 * all (the curated sample cards on /create and in the Library). A shared town
 * therefore looked different depending on which page you met it on.
 *
 * ⛔ WHY ONE MODULE AND NOT A CONSTANT PER SURFACE. The six-to-three map already
 * existed — LandingBelowFold's SCENE_FOR_TIER — and a second copy was about to
 * be written for the gallery, a third for the sample cards and a fourth for the
 * share meta. The failure mode of N copies is not ugliness, it is DISAGREEMENT:
 * a reader sees one painting for a village on the landing and another on its
 * gallery page, and the product looks like it does not know what it generated.
 * The PRECEDENCE rule (the owner's own image always wins) lives here for the
 * same reason — four call sites spelling `a || b` is four chances to spell it
 * `b || a`, and that one is silent and permanent.
 *
 * ⚠ THE LADDER IS READ, NOT RETYPED. The keys come from TIER_ORDER, so a rung
 * added to or renamed in src/data/constants.js cannot leave a card silently
 * imageless: tests/domain/tierStockImage.test.js walks the ladder, asserts every
 * rung resolves, asserts the file is on disk, and pins the owner's pairing
 * (thorp+hamlet / village+town / city+metropolis) rung by rung.
 *
 * ⚠ THE TWO SPELLINGS, RECONCILED HERE AND NOWHERE ELSE. `thorpe` is the
 * PAINTING's spelling (public/backgrounds/thorpe.jpg, and the scene list in
 * scripts/optimize-landing-backgrounds.mjs) while the ladder says `thorp`; and
 * `capital` reaches display code as a settlement tier (curated sample data, the
 * size-label map in humanizeEngineTokens) although the ladder's top rung is
 * `metropolis`. Both are accepted as aliases so that no caller needs to know and
 * no caller may keep its own map.
 *
 * ⚠ THESE ARE THE 1400px ORIGINALS, DELIBERATELY, AND THE COST IS NAMED. They
 * are the SAME three files the landing already paints its sections with, so on
 * the landing a card costs zero new bytes (one cache entry, already fetched).
 * Off the landing — the gallery grid, the Library shelf — a card pulls 228-304
 * kB for a 150-170px box, which is real. Card-sized variants are a DELIBERATE
 * DEFERRAL, not an oversight: they must come out of the declared sharp pipeline
 * (scripts/optimize-landing-backgrounds.mjs, already in SHARP_SCRIPTS) with
 * provenance rows for the outputs, and that is a separate act from choosing the
 * default. Every call site lazy-loads, so nothing here touches first paint.
 *
 * PURE LEAF: one import-free data import, no store, no clock, no rng, no DOM.
 */
import { TIER_ORDER } from '../../data/constants.js';

/** Where the paintings live, as the browser addresses them. */
export const TIER_STOCK_IMAGE_DIR = '/backgrounds/landing';

/**
 * THE OWNER'S PAIRING, VERBATIM: thorpe covers thorp and hamlet, village covers
 * village and town, city covers city and metropolis. `thorpe` and `capital` are
 * the alias spellings described above and resolve to the same two scenes.
 * @type {Readonly<Record<string, string>>}
 */
export const TIER_STOCK_SCENE = Object.freeze({
  thorp: 'thorpe',
  thorpe: 'thorpe',
  hamlet: 'thorpe',
  village: 'village',
  town: 'village',
  city: 'city',
  metropolis: 'city',
  capital: 'city',
});

/** The three scenes, as URLs. @type {Readonly<Record<string, string>>} */
export const TIER_STOCK_IMAGES = Object.freeze({
  thorpe: `${TIER_STOCK_IMAGE_DIR}/thorpe-1400.jpg`,
  village: `${TIER_STOCK_IMAGE_DIR}/village-1400.jpg`,
  city: `${TIER_STOCK_IMAGE_DIR}/city-1400.jpg`,
});

/** Every rung the ladder carries, for walkers and exhaustiveness checks. */
export const TIER_STOCK_LADDER = Object.freeze([...TIER_ORDER]);

/**
 * The stock painting for a tier, or null when the value is not a tier at all.
 *
 * NULL IS A REAL ANSWER and every caller keeps its own empty state for it: a row
 * with no tier is a row we know nothing about, and guessing one would put a
 * city's painting on a thorp. Total on garbage (non-string, blank, unknown).
 *
 * @param {unknown} tier
 * @returns {string | null}
 */
export function tierStockImage(tier) {
  const key = typeof tier === 'string' ? tier.trim().toLowerCase() : '';
  if (!key) return null;
  const scene = TIER_STOCK_SCENE[key];
  return scene ? TIER_STOCK_IMAGES[scene] : null;
}

/**
 * THE PRECEDENCE RULE, spelled once: an owner's own image always wins, and the
 * tier's stock painting is what stands in until they supply one.
 *
 * @param {unknown} ownerImageUrl  whatever the record carries (gallery_image_url,
 *   thumb_url, image_url, a cropped upload) — a blank string counts as absent.
 * @param {unknown} tier
 * @returns {string | null}
 */
export function settlementCardImage(ownerImageUrl, tier) {
  const owned = typeof ownerImageUrl === 'string' ? ownerImageUrl.trim() : '';
  return owned || tierStockImage(tier);
}
