/**
 * livingContentLaw.js — THE VERSION GATE for living-content materialization
 * (ODQ §866: four whole reference-pack categories — stressors, factions,
 * deities, traditions — never materialize into a generated settlement at all,
 * so 26 of the 52 presentation-claim cases discover nothing and half that
 * instrument proves nothing).
 *
 * THE IDIOM IS `densityLaw.js`'s, deliberately and in every detail, and that
 * file in turn copies `layoutLawVersion`'s. All four properties are reproduced
 * here because each one is load-bearing under THE PROMISE ("a seed is a
 * STARTING world forever"):
 *
 *   1. THE DEFAULT IS DORMANT AND THE MARKER IS OMITTED WHEN DEFAULT. A world
 *      whose config carries no `_livingContentLawVersion` is a v1 world, and a
 *      v1 world's settlement is byte-identical to one generated before this law
 *      existed. `newSettlementLivingContentLaw()` returns an EMPTY object while
 *      the dial sits at the default, so even the create boundary writes nothing.
 *      ⭐ THE DIAL IS NO LONGER AT THE DEFAULT (below), so today the mint returns
 *      the marker and a BIRTH is a v2 world. This property still governs every
 *      world born BEFORE that flip: their configs are markerless, the read is a
 *      closed test on the config alone (property 2), and nothing stamps them.
 *   2. THE READ IS A CLOSED MEMBERSHIP TEST, NOT A `>=` COMPARE. Anything that
 *      is not an enabled version — absent, garbage, a future v3 that has not
 *      shipped — coerces to the default. Fail closed.
 *   3. THERE IS NO MIGRATION, DELIBERATELY. An existing world never acquires
 *      the new law by upgrade. Its law travels in its own persisted `config`
 *      (the same bag that carries `_seed`), so a save, a load, a same-seed
 *      regen and an undo all replay the law the world was BORN under.
 *      ⭐⭐ AND THE DIAL WAS LIT ON 2026-09-08 WITH NO MIGRATION AND NO READ-PATH
 *      STAMP, ON THE OWNER'S WORD, BECAUSE EVERY PRE-LIGHTING WORLD WAS TEST
 *      DATA: "There are no true launched settlements or campaigns … All of those
 *      that exist were tests in which case inconsequential". The owner's first
 *      word that day asked for the retroactive half as well; his second
 *      DISCHARGED it, and this property is therefore unchanged rather than
 *      excepted. A world born under law 1 stays law 1 for ever, dark and working,
 *      its record absent; a world born after the flip is law 2; and NOTHING on
 *      any read, save, load, regen, undo or import path stamps a persisted
 *      config. Do not write a migration, a stamp or a provenance line for one.
 *   4. THE DIAL IS ONE LINE. `NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION` is the
 *      sole place a new world's law is chosen, and reverting is the same line.
 *
 * ⭐⭐ THE DIAL IS LIT, ON THE OWNER'S WORD OF 2026-09-08, AND THE SENTENCE IT
 * REPLACES IS KEPT SO THE CHANGE READS AS A DECISION RATHER THAN A DRIFT. This
 * paragraph said "THE DIAL IS AT 1 AND THAT IS THE RULING, NOT AN OMISSION.
 * Lighting this law is a SEPARATE owner decision". That decision was taken: the
 * owner ruled "feel free to land everything lit on", and lane LIGHT lit it after
 * curing the outage that would otherwise have made lighting a total generation
 * failure rather than a roster (see `livingContentSeam.js`'s loader and its
 * caller on the create boundary).
 *
 * ⛔ AND THE REASON THE DECISION WAS THE OWNER'S IS UNCHANGED AND STILL BINDS.
 * The four categories are the estate's LIVING CONTENT, and
 * `tests/fixtures/customContentReferencePack.js` states the governing law in its
 * own header — "the living-content definitions deliberately have no automatic
 * activation event: their presence in a reviewed environment must not make a
 * generated settlement silently adopt a deity, faction, stressor, or tradition."
 * Lighting this dial does not touch that law, because what v2 lights is a RECORD
 * and not an activation; the paragraph below is the whole of why, and it is the
 * paragraph a future widening has to get past.
 *
 * ⭐ MATERIALIZATION IS NOT ADOPTION, AND THE WHOLE DESIGN TURNS ON THAT
 * DISTINCTION. What v2 lights is a roster — `settlement.customContentRoster` —
 * that RECORDS which reviewed living-content definitions were in scope for the
 * run. It is inert: no generator reads it, no mechanic consults it, and it is
 * built after every RNG draw is finished. What v2 emphatically does NOT do is
 * write into `settlement.factions`, `settlement.stressors`,
 * `settlement.traditions` or `config.primaryDeitySnapshot` — the four surfaces
 * `settlementContentProvenance.js` already reads. Those are the MECHANICAL
 * surfaces, and writing a custom definition into any of them is adoption, which
 * is both the fixture's forbidden act and a presentation→mechanical promotion
 * of the F2c tripwire class. That promotion is OWNER-GATED and is not taken
 * here; `tests/domain/livingContentMaterialization.test.js` pins the gap so
 * crossing it reds instead of arriving quietly.
 *
 * Pure. No RNG, no store, no React.
 */

/**
 * ⛔ THE GATE ITSELF LIVES IN `livingContentLawVersion.js`, NOT HERE, AND THIS
 * FILE ONLY READS IT — SO THERE IS EXACTLY ONE SPELLING OF THE LAW.
 *
 * The version vocabulary is the sliver of this law the generator engine carries:
 * the pipeline must decide DORMANT-or-LIT synchronously, before anything is
 * loaded, so the version constants and the closed membership test have to sit on
 * the engine side of the lazy boundary. Everything below — the buckets, the dial
 * and the create-boundary fragment — is only ever read on the lit path or at the
 * create boundary, both of which are already lazy, so it rides the lazy chunk
 * with the roster. Reading the leaf rather than re-declaring is what keeps a
 * second, drifting copy of `_livingContentLawVersion` from ever existing (see
 * `livingContentSeam.js` for the measured reason the boundary exists at all).
 *
 * ⚠ IT USED TO IMPORT THESE FROM `livingContentSeam.js`, AND THAT EDGE IS WHAT
 * MADE THE CYCLE. Seam →(dynamic) roster →(static) law →(static) seam is a
 * strongly-connected component of size 3, and `layerBoundaries.test.js` counts
 * the dynamic specifier as an edge. The vocabulary moved to a dependency-free
 * leaf; this import moved with it, and nothing else about this file changed.
 */
import {
  LIVING_CONTENT_LAW_CONFIG_KEY,
  DEFAULT_LIVING_CONTENT_LAW_VERSION,
  ROSTER_LIVING_CONTENT_LAW_VERSION,
} from './livingContentLawVersion.js';

// ⛔ AND IT IS DELIBERATELY NOT RE-EXPORTED FROM HERE. A convenience
// `export { … } from './livingContentLawVersion.js'` block was written first and
// MEASURED against the seam: because this file rides the lazy roster chunk and
// the vocabulary rides the engine side, re-exporting seven symbols forces the
// engine side to keep all seven live for the roster chunk to forward — the
// engine chunk grew by ~1,047 B on the day the payload is retained, against a
// 677 B ceiling margin. Gate consumers therefore import from
// `livingContentLawVersion.js` directly, which is also the honest edge: the gate
// is engine-side vocabulary, not lazy vocabulary.

/** ⭐⭐ THE ONE DIAL — the living-content law a NEWLY-created world mints under.
 *  LIT on 2026-09-08, on the owner's word ("feel free to land everything lit
 *  on"), and reverting is the same one line: put
 *  DEFAULT_LIVING_CONTENT_LAW_VERSION back. EXISTING worlds are untouched either
 *  way — they never pass through create again, and nothing on any read path
 *  stamps a persisted config (property 3 below).
 *
 *  ⛔ THE `@type {number}` IS LOAD-BEARING AND WAS EARNED BY A STRICT RED, NOT
 *  ADDED FOR TIDINESS. Without it TypeScript infers the LITERAL type of whatever
 *  the dial happens to hold, so `newSettlementLivingContentLaw`'s dormant branch
 *  becomes `2 === 1` and the strict kernel convicts it: "This comparison appears
 *  to be unintentional because the types '2' and '1' have no overlap" (TS2367,
 *  `check-domain-strict`, on the day the dial was lit). The comparison is not
 *  unintentional; it is the whole mechanism, and it is what keeps the dormant
 *  branch reachable so the revert stays one line. A dial's declared type must be
 *  the SPACE of law versions and never today's setting, or every reader of it
 *  becomes a reader of one build's configuration. The sibling density dial needs
 *  no annotation ONLY because it sits at the default, where the comparison's two
 *  literals happen to overlap; it will need this the day it is lit.
 *  @type {number} */
export const NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION =
  ROSTER_LIVING_CONTENT_LAW_VERSION;

/**
 * ⛔ THE FOUR LIVING-CONTENT BUCKETS, AND WHY THESE FOUR.
 *
 * They are not a taste grouping. They are exactly the authorable buckets whose
 * definitions reach no generated settlement (§866, re-measured by TE-INSTR-1 as
 * 26 of 52 presentation cases), and exactly the buckets the reference-pack
 * fixture calls living content. The other four authorable buckets —
 * institutions, services, resources, tradeGoods — are SETTLEMENT-BEARING: they
 * already materialize through their own generators and must never appear here,
 * because a second materialization path for an already-materializing bucket
 * would produce two truths about one definition.
 *
 * @type {ReadonlyArray<string>}
 */
export const LIVING_CONTENT_BUCKETS = Object.freeze([
  'deities',
  'factions',
  'stressors',
  'traditions',
]);

/**
 * The config fragment a NEWLY-created world is minted with, to be spread into
 * the fresh config at the settlement-CREATE boundary.
 *
 * Returns an EMPTY object while the dial sits at the default — so a create
 * boundary can call this unconditionally and write not one byte, and the flip
 * needs no second edit at the call site.
 *
 * ⭐ THIS IS WIRED (lane L-MAT). `src/domain/density/densityCreateBoundary.js`
 * classifies every module that can reach the settlement pipeline as BIRTH /
 * DERIVED / PREVIEW / EXECUTOR, `birthConfig` is its one mint, both BIRTH
 * callers go through it, and `tests/lint/densityCreateBoundary.walker.test.js`
 * holds the manifest to the tree. `birthConfig` spreads THIS mint beside the
 * density one, so every classified BIRTH mints this law and nothing else can.
 * Re-derivation goes through `regenSection`, which reads `settlement.config`
 * FIRST and so replays the law the world was born under.
 *
 * ⭐ AND IT IS NOW LIT AS WELL AS WIRED (2026-09-08). This paragraph said "AND
 * WIRING IT IS NOT LIGHTING IT. The dial above stays at the dormant default, so
 * this function returns `{}`", and that was true for the whole of the law's
 * dormant life. The dial is at the roster version now, so this function returns
 * the marker and every classified BIRTH mints a v2 world. The function's SHAPE
 * is unchanged, and that is what keeps the flip one line in either direction: it
 * reads the dial and nothing else, so reverting the dial reverts the mint.
 *
 * ⛔⛔ THE BLOCKER THAT HELD THIS UNWIRED WAS BYTES, AND THE CURE WAS NOT THE ONE
 * PREDICTED. The record here said the mint belonged on "the LAZY engine side
 * that the birth caller already awaits", with an excision row for this file.
 * Both halves were measured wrong and are kept as a correction rather than
 * deleted: the generation lane never awaits `loadEngine()` (that loader lives in
 * `settlementSlice.js` and serves `regenSection`; the lane reaches the core
 * through its own dynamic import of `src/workers/generationRequest.js`), and an
 * excision row for this file would be inert because `ENGINE_SHARED_DOMAIN` is
 * seeded from `src/generators` only and this module is not one of its 68
 * members. What was true is that the boundary module's ONLY eager edge was a
 * `birthConfig` re-export through an eager store leaf whose two real callers are
 * both lazy. Cutting it took `src/main.jsx`'s static closure from 239 modules to
 * 238, dropped the boundary out of it, and changed NO EMITTED DIST FILE'S SIZE
 * (658 of 1,377 files changed BYTES — the entry chunk's content hash moves and every
 * file naming it is re-hashed; this sentence used to read "left every emitted dist
 * file byte-identical", which was FALSE, and it is the third and last home of that
 * wording, corrected at §913) — so the import below this comment is a lazy -> lazy
 * edge and first paint pays nothing.
 *
 * @returns {Record<string, number>}
 */
export function newSettlementLivingContentLaw() {
  return NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION
    === DEFAULT_LIVING_CONTENT_LAW_VERSION
    ? {}
    : {
      [LIVING_CONTENT_LAW_CONFIG_KEY]:
          NEW_SETTLEMENT_LIVING_CONTENT_LAW_VERSION,
    };
}
