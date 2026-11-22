/**
 * domain/display/stateProse/legibilityRung.js — the three rungs, as one shape.
 *
 * THE LEGIBILITY LAW: every surface reads at three depths — a GLANCE (the band word the
 * eye lands on), a SENTENCE (what it means, in the town's own voice), and a DETAIL (the
 * rows a DM checks when the sentence raised a question). A panel that offers only the
 * first is a wall of enum words; one that offers only the third is a spreadsheet.
 *
 * THE GAME-GRADE DOCTRINE rides on top of it: the detail rung TRANSLATES, it never shows
 * the formula. A row reads `Approach · over the pass`, never `tradeAccess: mountain_pass`
 * and never `economyOutput: 41`. The engine token is the thing the reader must never be
 * made to decode, so `rungDetail` takes label/value pairs that are already prose.
 *
 * A rung with no sentence is still a rung: the glance and the detail stand on their own,
 * and the corpus being silent about a state (R-DST-K) must never blank the surface that
 * was already rendering. That asymmetry is the whole reason this is a constructor rather
 * than an object literal at each call site.
 *
 * PURE HEADLESS LEAF: no imports.
 *
 * @enforced-by tests/domain/economyStateProseDesk.test.js
 */

/**
 * @typedef {object} LegibilityRung
 * @property {string} glance the band word, already in reader-facing spelling
 * @property {string|null} sentence the corpus line, or null when the corpus is silent
 * @property {ReadonlyArray<{label: string, value: string}>} detail translated rows
 * @property {{blockId: string, poolKey: string, angle: string,
 *   pieces?: ReadonlyArray<object>}|null} provenance
 */

/**
 * Build one rung.
 *
 * ⭐⭐ `pieces` RIDES THE PROVENANCE, AND ARCH §4.1 SAYS SO IN TERMS (TASTE car M-3):
 * "`legibilityRung.sentence` stays one string; `provenance` grows `pieces` INSIDE the object
 * `drawnAtMount` strips on a glance row".
 *
 * ⛔ WHY IT MATTERS AND WHAT WAS BROKEN WITHOUT IT. The composed-prose manifest classifies
 * every cell of every signed car, and its ADDITIVE verdict is "the unit grew a piece and the
 * spine did not move". The recorder can only see what the RUNG carries, and the rung was
 * dropping the composer's `pieces` on the floor — so the recorder synthesised a one-piece
 * array on every cell and ADDITIVE was UNREACHABLE THROUGH THE SHIPPED INSTRUMENT, whatever
 * the composer did. Worse: a composed unit's rendered sentence is two variants concatenated,
 * so the recorder's template reader could not identify the spine either and the cell would
 * have recorded `vid: null` and classified RE-INDEXED — the STOP verdict — on every town a
 * modifier reached. The taste (car 6) is accepted on "every affected cell ADDITIVE", and
 * before this line no car could have met that criterion.
 *
 * ⛔ EMITTED ONLY WHERE THE LINE CARRIES IT, so a caller that hands over a bare
 * `{blockId, poolKey, angle, text}` — every non-composed line in the estate — gets the
 * byte-identical object it got before.
 * @param {string} glance
 * @param {{blockId: string, poolKey: string, angle: string, text: string,
 *   pieces?: ReadonlyArray<object>}|null} [line]
 * @param {ReadonlyArray<{label: string, value: string}>} [detail]
 * @returns {LegibilityRung}
 */
export function legibilityRung(glance, line = null, detail = []) {
  return Object.freeze({
    glance,
    sentence: line?.text ?? null,
    detail: Object.freeze(detail.filter((row) => row
      && typeof row.label === 'string' && row.label !== ''
      && typeof row.value === 'string' && row.value !== '')),
    provenance: line
      ? Object.freeze({
        blockId: line.blockId,
        poolKey: line.poolKey,
        angle: line.angle,
        ...(Array.isArray(line.pieces) ? { pieces: line.pieces } : {}),
      })
      : null,
  });
}

/**
 * A rung is worth rendering when it has anything to say at any depth. A surface whose
 * glance is empty and whose corpus is silent is a surface that should not appear.
 * @param {LegibilityRung|null|undefined} rung
 * @returns {boolean}
 */
export function rungSpeaks(rung) {
  if (!rung) return false;
  return Boolean(rung.glance) || Boolean(rung.sentence) || rung.detail.length > 0;
}
