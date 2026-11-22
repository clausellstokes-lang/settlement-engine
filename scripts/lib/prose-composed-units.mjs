/**
 * scripts/lib/prose-composed-units.mjs — EVERY COMPOSED UNIT A CORPUS LICENSES.
 *
 * WHAT THIS IS. The composed-prose instruments need the same input: the set of units a corpus
 * can produce, with the spine and the modifier APART and each carrying its own relation and
 * seat. A desk return cannot supply that — it hands back an ARRANGED string, and by then the
 * joint has already been spelled and the two halves cannot be told apart again.
 *
 * ⛔ ITS REAL CONSUMERS, NAMED AND KEPT TRUE (REWRITE car 8a-11, SITTING §U c-2). This docblock
 * claimed the wave's gate as a consumer from the day it was written, and for one whole car it
 * was not: 8a-5 landed `scripts/prose-wave-gate.mjs` with its OWN `unitsOfPool` beside this
 * one, and the two diverged on shipped input the first time anybody drove both
 * (`DS-DEF-11 :: WALLED-STRAINED` gate 2 / lib 0 · `WALLED-QUIET` 3 / 0 ·
 * `DS-DEF-2 :: Disasters & Famine: granary AND hospital` 3 / 0), with nothing cross-checking
 * them and both feeding the same sitting. There is now ONE implementation and it is this one.
 * The consumers, by grep and not by claim:
 *   `scripts/prose-shape-report.mjs`   the distribution table (REWRITE car 8a-2)
 *   `scripts/prose-wave-gate.mjs`      the wave's gate (8a-5), with `bareSpine: true`
 * `tests/lint/proseWaveGate.walker.test.js` drives BOTH exports over the same roster and
 * asserts they agree pool by pool, so a third implementation cannot arrive quietly.
 *
 * ⛔ THE UNITS COME FROM `poolMeta.attach`, NOT FROM A RUN OF TOWNS, and the difference is the
 * one the taste's own refutations found twice. A run measures the units the towns it generated
 * happened to fire; the attach set is what the CORPUS LICENSES, which is the population an
 * authoring instrument is judging. A rate belongs to a run; a distribution over shapes,
 * relations and constructions belongs here.
 *
 * ⛔ THE ARRANGEMENT IS THE COMPOSER'S RULE AND NOT THIS FILE'S GUESS. Every attach-bearing
 * pool at the tip this was written against is an `addition` at the SENTENCE seat, whose
 * connective list holds exactly the EMPTY OPENER (ARCH §4.5, E-F10), and `arrange` down-cases
 * the modifier's first token only after a NON-EMPTY opener. So the unit is
 * `spine + ' ' + modifier`, verbatim. A caller that needs the real composer's output on a real
 * town drives `composeStateProse` instead; this is the corpus-grain reader.
 *
 * READ-ONLY. Pure given the corpus it is handed.
 */

/** A variant's faces: the authored text, then its wordings. */
export const facesOf = (variant) => [
  variant.text, ...(Array.isArray(variant.wordings) ? variant.wordings : []),
];

/**
 * ⭐ EVERY COMPOSED UNIT ONE MODIFIER POOL CAN PRODUCE: each spine of its attach set, times
 * each variant of that spine, times each variant of the pool, times each FACE of each.
 *
 * ⭐⭐ `bareSpine` — THE REWRITE'S OWN UNIT, BEHIND A FLAG (REWRITE car 8a-5's finding, moved
 * here whole at 8a-11 under SITTING §U c-2). The taste walked MODIFIER pools, whose unit is the
 * cartesian above; the REWRITE's first writing workflow rewrites a DESK SECTION's SPINE pools
 * and grows their faces, and a spine's attach set is empty BY CONSTRUCTION (the SHIFT REGISTER
 * pins `attach-set` at 0 on all 708). Under the cartesian alone such a pool composes NOTHING,
 * so the gate had no subject at all for the very pools the REWRITE rewrites.
 *
 * ⛔ A BARE SPINE IS ONE PIECE AND SAYS SO. The row carries `role: 'spine'` and no modifier, no
 * relation and no seat, so every composed-only arm (A1's overlap, A2's joint, A3's contrast,
 * the thread) declares NOT-EXECUTABLE on it rather than inventing a second piece to have
 * something to compare. The ENTRY arms — the claim classes, the digits, the em dash, the
 * fragment form — are what judge a spine face, and they are what the REWRITE is graded on.
 *
 * ⛔ AND IT IS A FLAG RATHER THAN A DEFAULT, because the two populations answer two different
 * questions. The shape report's subject is the units a corpus LICENSES, and a bare spine has no
 * shape question at all; the gate's subject is the faces a wave is rewriting. A default would
 * have silently widened one of them.
 * @param {Record<string, {pools?: Record<string, ReadonlyArray<object>>, poolMeta?: Record<string, object>}>} corpus
 * @param {string} blockId
 * @param {string} poolKey
 * @param {{bareSpine?: boolean}} [options]
 * @returns {Array<object>} composed unit rows in the walker's own shape
 */
export function unitsOfPool(corpus, blockId, poolKey, options = {}) {
  const block = corpus[blockId];
  const meta = block && block.poolMeta ? block.poolMeta[poolKey] : undefined;
  const pool = (block && block.pools ? block.pools[poolKey] : undefined) || [];
  /** @type {Array<object>} */
  const units = [];
  if (options.bareSpine && (!Array.isArray(meta && meta.attach) || meta.attach.length === 0)) {
    for (const variant of pool) {
      for (const face of facesOf(variant)) {
        units.push({
          blockId,
          poolKey,
          text: face,
          pieces: [{
            role: 'spine',
            key: poolKey,
            text: face,
            slots: variant.slots || [],
            marks: variant.marks || [],
          }],
        });
      }
    }
    return units;
  }
  for (const spineKey of (meta && meta.attach) || []) {
    const spinePool = (block.pools || {})[spineKey] || [];
    for (const spine of spinePool) {
      for (const spineFace of facesOf(spine)) {
        for (const variant of pool) {
          for (const face of facesOf(variant)) {
            units.push({
              blockId,
              poolKey: spineKey,
              modifierKey: poolKey,
              text: `${spineFace} ${face}`,
              spineText: spineFace,
              modifierText: face,
              pieces: [
                {
                  role: 'spine',
                  key: spineKey,
                  text: spineFace,
                  vid: spine.vid,
                  slots: spine.slots || [],
                  marks: spine.marks || [],
                },
                {
                  role: 'modifier',
                  key: poolKey,
                  text: face,
                  vid: variant.vid,
                  slots: variant.slots || [],
                  marks: variant.marks || [],
                  relation: meta.relation || 'addition',
                  declaredRelation: meta.relation || 'addition',
                  seat: meta.seat || 'sentence',
                },
              ],
            });
          }
        }
      }
    }
  }
  return units;
}

/**
 * Every attach-bearing pool of a corpus, with its block.
 * @param {Record<string, object>} corpus
 * @returns {Array<{blockId: string, poolKey: string, meta: object}>}
 */
export function attachBearingPools(corpus) {
  /** @type {Array<{blockId: string, poolKey: string, meta: object}>} */
  const out = [];
  for (const [blockId, block] of Object.entries(corpus)) {
    for (const [poolKey, meta] of Object.entries((block && block.poolMeta) || {})) {
      if (Array.isArray(meta.attach) && meta.attach.length > 0) out.push({ blockId, poolKey, meta });
    }
  }
  return out.sort((a, b) => (`${a.blockId} :: ${a.poolKey}` < `${b.blockId} :: ${b.poolKey}` ? -1 : 1));
}

/**
 * Every composed unit a corpus licenses, over every attach-bearing pool.
 * @param {Record<string, object>} corpus
 * @returns {Array<object>}
 */
export function unitsOfCorpus(corpus) {
  return attachBearingPools(corpus)
    .flatMap(({ blockId, poolKey }) => unitsOfPool(corpus, blockId, poolKey));
}
