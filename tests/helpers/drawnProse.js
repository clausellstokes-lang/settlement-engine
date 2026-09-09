/**
 * tests/helpers/drawnProse.js — THE DRAW-FOLLOWING ANCHOR (REWRITE car 8a-13).
 *
 * ⛔ THE CLASS, FIXED BY HAND THREE TIMES BEFORE ITS HABITAT WAS REMOVED. A liveness
 * anchor on state prose — the `before` half of `expectPresentThenAbsent`, the sibling of
 * `expectAbsentWithAnchor` — pins a SENTENCE the corpus draws. Which sentence a pool draws
 * is a function of the fixture's seed and of the draw rule
 * (`stateProseKernel.js` `drawVariant`, keyed `seed::blockId::poolKey::v<vid>` since car
 * 8a-1's index-stable draw), so a change to EITHER moves the drawn member without moving
 * one byte of the desk, the corpus contract or the paid-surface gate those arms exist to
 * prove — and every literal anchor reds at once while the thing it guards is perfectly
 * well. The bill so far:
 *
 *   car 8a-1   the index-stable draw (ARCH §13 row 22, SIGNED at SITTING §N.2; RE-INDEXED
 *              43,685 of 73,284 cells = 59.61 %) re-seeded THREE desk pins by hand.
 *   car 8a-12  the same draw's §919 whole-suite proof reported NINE red arms in `tests/ui`;
 *              the pins behind them were SIXTEEN (a `for` loop throws on the first and hides
 *              the rest). Six fixtures took a searched seed; one search cost 111,965
 *              candidates, because a fixture's seed must satisfy every pin drawn off it AT
 *              ONCE.
 *   the standing cost, measured at 8a-12: `SPEAKING` alone pins eight pools, NEVER TRIM
 *              means every block car of the REWRITE appends a wording, and appending to an
 *              n-member pool moves about 1/(n+1) of its reads — so one or two anchors fall
 *              due PER BLOCK CAR, for ever.
 *
 * ⭐ THE CURE (structural-prevention, the third same-shape fix: remove the habitat). An
 * anchor becomes a FUNCTION OF THE SEED, computed through the SHIPPED READ PATH at test
 * time. A re-index moves the member and the anchor together; a rewrite of the drawn wording
 * moves both; an appended wording that wins the draw moves both. What CANNOT move together
 * is the thing the arm is really about — that this block, at this pool, over this state,
 * reaches the reader privately and is silent on a free dossier — so the arm keeps its whole
 * force and loses only its false brittleness.
 *
 *   const GROUND = drawnMember({
 *     leaf: 'general', blockId: 'DS-GEN-12', poolKey: 'HIGH-GROUND',
 *     seed: SPEAKING._seed, slots: { settlement: 'Steinmark' },
 *   });
 *   expectPresentThenAbsent(priv, pub, GROUND, 'DS-GEN-12 the ground');
 *
 * ⛔ THIS IS THE ONLY LAWFUL WAY TO ANCHOR A TEST ON DRAWN STATE PROSE, and
 * `tests/lint/proseDrawnAnchors.walker.test.js` is what keeps it so: a NEW literal
 * state-prose fragment inside `toContain(` / `toMatch(` / `queryByText(` / `toBe(` or an
 * anchored-negative call reds by name against the six leaves' own texts.
 *
 * ⚠ WHAT THIS IS NOT. It is NOT "ask the desk what it says and check it said that". The
 * TEST still declares the block, the pool, the audience and the slot bag — the whole
 * semantic claim — and a desk that stopped drawing that pool still reds on the liveness
 * half, because the helper computes from the CORPUS and the render comes from the DESK.
 * The two meet only at the assertion. A helper that took a settlement and returned "what
 * the desk would say" would be the vacuous shape; this one cannot be, because it never
 * sees the settlement.
 *
 * ⚠ AND IT IS NOT A RE-IMPLEMENTATION OF THE DRAW. Nothing here hashes, indexes or filters.
 * `composeStateProse` (composeStateProse.js) is the desk's own call at all eleven general
 * sites and everywhere else a rung is built; `readStateProse` (stateProseKernel.js) is the
 * kernel grain beneath it. BOTH are driven on every call and the composed unit is REFUSED
 * unless it still carries the spine — so a composer that stopped composing its own spine
 * reds here rather than quietly handing every anchor a different sentence.
 *
 * Pure helper module: no describe/test here (a test file's exports re-register its suites in
 * every importer — see tests/helpers/dormancyOracle.js for the incident).
 *
 * @enforced-by tests/lint/proseDrawnAnchors.walker.test.js
 */
import { composeStateProse } from '../../src/domain/display/stateProse/composeStateProse.js';
import {
  readStateProse, eligibleVariants, fillSlots,
} from '../../src/domain/display/stateProse/stateProseKernel.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../../src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../../src/data/dossierStateProse/economy.generated.js';
import { DOSSIER_STATE_PROSE_DEFENSE } from '../../src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_POWER } from '../../src/data/dossierStateProse/power.generated.js';
import { DOSSIER_STATE_PROSE_STRESSORS } from '../../src/data/dossierStateProse/stressors.generated.js';
import { DOSSIER_STATE_PROSE_WAR_FAITH } from '../../src/data/dossierStateProse/warFaith.generated.js';

/**
 * The six STATE leaves by their desk's short name — the only corpus whose members carry a
 * `vid` and therefore the only corpus the index-stable draw can move (the causal register
 * carries none on any of its 468 variants and keeps the modulus; car 8a-1's fallback).
 * @type {Readonly<Record<string, Record<string, any>>>}
 */
export const STATE_LEAVES = Object.freeze({
  general: DOSSIER_STATE_PROSE_GENERAL,
  economy: DOSSIER_STATE_PROSE_ECONOMY,
  defense: DOSSIER_STATE_PROSE_DEFENSE,
  power: DOSSIER_STATE_PROSE_POWER,
  stressors: DOSSIER_STATE_PROSE_STRESSORS,
  warFaith: DOSSIER_STATE_PROSE_WAR_FAITH,
});

/**
 * @typedef {object} DrawnProseSpec
 * @property {string} [leaf] one of `STATE_LEAVES`' keys — the desk whose leaf holds the block
 * @property {Record<string, any>} [corpus] a leaf passed directly, for a fixture corpus
 * @property {string} blockId e.g. `DS-GEN-12`
 * @property {string} poolKey the pool the desk's own key function resolved, e.g. `HIGH-GROUND`
 * @property {string} [seed] the fixture's `_seed` — EXACTLY what the desk passes
 *   (`generalDeskRead.js`: `String(r?._seed ?? r?.id ?? '')`). Absent or empty is
 *   canonical-at-zero (kernel law 4), which is a real and stable answer, not a fallback.
 * @property {string} [audience] `dm` (the private dossier) or `player`; defaults to `dm`
 * @property {Record<string, unknown>} [slots] every fill the desk hands this block — the
 *   WHOLE bag, not only the slots today's drawn variant names, because a re-index can draw a
 *   sibling that names others
 * @property {Record<string, string>} [dimensions] the demoted STATE dimensions this pool
 *   partitions itself by (kernel law 5) — `severity`, `deficit`, `anchor`
 */

/** @param {DrawnProseSpec} spec @param {string} fn @returns {Record<string, any>} */
function corpusOf(spec, fn) {
  if (spec && spec.corpus) return spec.corpus;
  const leaf = spec ? spec.leaf : undefined;
  const found = typeof leaf === 'string' ? STATE_LEAVES[leaf] : undefined;
  if (!found) {
    throw new Error(
      `${fn}: no corpus. Pass \`leaf\` as one of ${Object.keys(STATE_LEAVES).join(', ')}`
      + ` (the desk whose leaf holds ${spec && spec.blockId ? spec.blockId : 'the block'}), or`
      + ` \`corpus\` for a fixture leaf. Received leaf=${JSON.stringify(leaf)}.`,
    );
  }
  return found;
}

/** @param {DrawnProseSpec} spec @param {string} fn @returns {ReadonlyArray<any>} */
function poolOf(spec, fn) {
  const corpus = corpusOf(spec, fn);
  const block = corpus[spec.blockId];
  if (!block) {
    throw new Error(
      `${fn}: the leaf carries no block ${JSON.stringify(spec.blockId)}. The block was renamed`
      + ` or the wrong leaf was named — the anchor is not "stale", the corpus moved.`,
    );
  }
  const pool = block.pools ? block.pools[spec.poolKey] : undefined;
  if (!Array.isArray(pool) || pool.length === 0) {
    throw new Error(
      `${fn}: ${spec.blockId} carries no pool ${JSON.stringify(spec.poolKey)}. Pools on this`
      + ` block: ${Object.keys(block.pools || {}).map((k) => JSON.stringify(k)).join(', ')}.`,
    );
  }
  return pool;
}

/** The read options every entry point assembles the same way, once. */
function optionsOf(spec) {
  return {
    slots: spec.slots || {},
    seed: typeof spec.seed === 'string' ? spec.seed : '',
    audience: spec.audience === 'player' ? 'player' : 'dm',
    dimensions: spec.dimensions || {},
  };
}

/** A spec, rendered for a failure message. */
function describeSpec(spec) {
  const read = optionsOf(spec);
  return `${spec.blockId} :: ${spec.poolKey} · seed ${JSON.stringify(read.seed)}`
    + ` · audience ${read.audience}`
    + ` · slots {${Object.keys(read.slots).join(', ')}}`
    + (Object.keys(read.dimensions).length ? ` · dimensions ${JSON.stringify(read.dimensions)}` : '');
}

/**
 * ⭐ THE ANCHOR. The sentence the desk renders for this block, this pool, this state and
 * this seed — computed through the shipped read path, never re-derived.
 *
 * A `null` read is a HARD ERROR rather than an empty string, and that is the whole liveness
 * discipline moved one step earlier: an anchor that silently became `''` would make every
 * `toContain` downstream pass vacuously, which is the exact defect
 * `tests/helpers/anchoredNegatives.js` exists to prevent. The message names the four things
 * that make a read null so the next seat repairs the SPEC rather than deleting the anchor.
 *
 * @param {DrawnProseSpec} spec
 * @returns {string} the composed unit's text — what the desk puts on the page
 */
export function drawnMember(spec) {
  const corpus = corpusOf(spec, 'drawnMember');
  poolOf(spec, 'drawnMember');
  const read = optionsOf(spec);
  // The kernel grain: the spine sentence alone, exactly as `drawPiece` reads it.
  const spine = readStateProse(corpus, spec.blockId, spec.poolKey, read);
  if (!spine || !spine.text) {
    const pool = poolOf(spec, 'drawnMember');
    const eligible = eligibleVariants(pool, read);
    throw new Error(
      `drawnMember: NOTHING DRAWS at ${describeSpec(spec)}. The pool holds ${pool.length}`
      + ` variant(s) and ${eligible.length} are eligible for this read. A null read has four`
      + ` causes and each is repaired in the SPEC, never by deleting the anchor: (1) a slot the`
      + ` drawn variant names has no fill — pass the WHOLE bag the desk passes, not only the`
      + ` slots today's member happens to name; (2) the pool partitions itself by a demoted`
      + ` STATE dimension (severity / deficit / anchor) this spec did not answer (kernel law 5);`
      + ` (3) the audience is 'player' and every eligible member is dm-only (kernel law 2 —`
      + ` fail-closed, and correct); (4) the pool key is not this block's.`,
    );
  }
  // The desk's own grain: every rung in the estate is built by `composeStateProse`, and an
  // empty candidate list composes to the kernel's own draw (SEAM car 3g).
  const unit = composeStateProse(corpus, spec.blockId, { ...read, spineKey: spec.poolKey });
  if (!unit || !unit.text) {
    throw new Error(
      `drawnMember: the KERNEL drew a sentence at ${describeSpec(spec)} and the COMPOSER drew`
      + ` nothing. The two read paths have diverged — that is a composer defect, not an anchor`
      + ` one, and it would silence the same position on the page.`,
    );
  }
  // ⛔ THE COMPOSED UNIT MUST STILL CARRY ITS SPINE. `arrange` puts the spine first in both
  // seats — the clause seat only strips its final stop — so this holds however many modifiers
  // a later car attaches, and it is what makes BOTH read paths load-bearing here rather than
  // one of them decorative.
  const stem = spine.text.replace(/[.?]\s*$/, '');
  if (!unit.text.startsWith(stem)) {
    throw new Error(
      `drawnMember: the composed unit at ${describeSpec(spec)} does not open on the spine the`
      + ` kernel drew.\n  kernel:   ${spine.text}\n  composed: ${unit.text}\nOne of the two`
      + ` read paths is drawing a different member, which no anchor can paper over.`,
    );
  }
  return unit.text;
}

/**
 * The same, for a set of pools read off ONE fixture. Returns the shape it was given — an
 * array for an array, an object keyed the same way for an object — so a caller can name its
 * anchors instead of counting them.
 *
 * @template {Record<string, DrawnProseSpec>|ReadonlyArray<DrawnProseSpec>} T
 * @param {T} specs
 * @param {Partial<DrawnProseSpec>} [shared] fields every spec inherits — the leaf, the seed,
 *   the audience and the slot bag are usually one fixture's
 * @returns {T extends ReadonlyArray<any> ? string[] : Record<string, string>}
 */
export function drawnMembers(specs, shared = {}) {
  if (Array.isArray(specs)) {
    return /** @type {any} */ (specs.map((spec) => drawnMember({ ...shared, ...spec })));
  }
  return /** @type {any} */ (Object.fromEntries(
    Object.entries(specs).map(([name, spec]) => [name, drawnMember({ ...shared, ...spec })]),
  ));
}

/**
 * ONE NAMED VARIANT'S OWN TEXT, selected by its STABLE ID and not by seed luck.
 *
 * For the arm whose subject is a PARTICULAR wording rather than whatever the pool happens to
 * draw — "this variant's seam fills without doubling an article", "the default line this
 * block would otherwise have printed must not appear". `vid` is the annex row number frozen
 * at SEAM car 4 (`poolMeta.vids`); it is the one field that names a variant across a rewrite,
 * which is exactly why the draw keys on it.
 *
 * @param {DrawnProseSpec & {vid: number}} spec
 * @returns {string} the variant's text with this spec's slots filled
 */
export function variantByVid(spec) {
  const pool = poolOf(spec, 'variantByVid');
  const found = pool.filter((variant) => variant && variant.vid === spec.vid);
  if (found.length !== 1) {
    throw new Error(
      `variantByVid: ${describeSpec(spec)} carries ${found.length} variants with vid`
      + ` ${spec.vid} (expected exactly one). The pool's vids are`
      + ` [${pool.map((v) => v && v.vid).join(', ')}]. A vid is never renumbered and never`
      + ` reused, so a miss means the row was removed — which NEVER TRIM forbids.`,
    );
  }
  const text = fillSlots(found[0].text, spec.slots || {});
  if (text === null) {
    throw new Error(
      `variantByVid: vid ${spec.vid} of ${describeSpec(spec)} names slots`
      + ` [${(found[0].slots || []).join(', ')}] and this spec's bag cannot fill them, so the`
      + ` variant has no rendered form to assert on.`,
    );
  }
  return text;
}

/**
 * EVERY member of a pool, filled — for the arm that says "no wording of this pool reaches the
 * page". Stronger than naming one of them: a member appended tomorrow is covered the day it
 * lands, which is what NEVER TRIM makes a certainty rather than a risk.
 *
 * Members whose slots this bag cannot fill are DROPPED (they cannot render either, so they
 * cannot be the defect), and a bag that fills none is a hard error — an empty roster would
 * make every `not.toContain` over it pass vacuously.
 *
 * @param {DrawnProseSpec} spec
 * @returns {string[]} one filled sentence per renderable member, in the pool's own order
 */
export function poolMemberTexts(spec) {
  const pool = poolOf(spec, 'poolMemberTexts');
  const read = optionsOf(spec);
  const texts = pool
    .map((variant) => fillSlots(variant.text, read.slots))
    .filter((text) => typeof text === 'string' && text !== '');
  if (texts.length === 0) {
    throw new Error(
      `poolMemberTexts: not one of the ${pool.length} members of ${describeSpec(spec)} can be`
      + ` filled from this slot bag, so the roster is empty and every assertion over it would`
      + ` pass vacuously. Widen the bag rather than accepting the empty list.`,
    );
  }
  return texts;
}
