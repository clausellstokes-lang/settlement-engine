/**
 * scripts/lib/prose-composed-units.mjs — EVERY COMPOSED UNIT A CORPUS LICENSES.
 *
 * WHAT THIS IS. The composed-prose instruments (the shape report at REWRITE car 8a-2, the
 * wave's gate at 8a-5) all need the same input: the set of units a corpus can produce, with
 * the spine and the modifier APART and each carrying its own relation and seat. A desk return
 * cannot supply that — it hands back an ARRANGED string, and by then the joint has already
 * been spelled and the two halves cannot be told apart again.
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
 * @param {Record<string, {pools?: Record<string, ReadonlyArray<object>>, poolMeta?: Record<string, object>}>} corpus
 * @param {string} blockId
 * @param {string} poolKey
 * @returns {Array<object>} composed unit rows in the walker's own shape
 */
export function unitsOfPool(corpus, blockId, poolKey) {
  const block = corpus[blockId];
  const meta = block && block.poolMeta ? block.poolMeta[poolKey] : undefined;
  const pool = (block && block.pools ? block.pools[poolKey] : undefined) || [];
  /** @type {Array<object>} */
  const units = [];
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
