/**
 * power/quarrelPick.js — THE EVERYDAY QUARREL, PICKED BY KEYED HASH WITH NO NEW DRAW (BUILD-CONFLICT, DEPTH-2,
 * 2026-11-20; the chair's word of 16:08 UTC; the lines `docs/chair/2026-11-20/content/depth/lines/CONFLICT-LINES.md`, the
 * measure `docs/chair/2026-11-20/content/depth/conflict/CONFLICT-MEASURE.md`).
 *
 * Three rungs of `governanceNarrative.js :: deriveBaselineConflict` printed one sentence each in most places of their size.
 * Where such a rung's line PRINTS (the site's own rule: no primary-stress narrative overrides it, or the `infiltrated` one
 * carries it), the site hands it here, and the place's quarrel is chosen from the rung's pool
 * (`data/powerSiblings.js :: QUARREL_POOLS`, keyed by `QUARREL_POOL_OF_RUNG`, and the field rotation the site hands in
 * beside: its literal stays at the site, where the presumption-classes register banks it): the argmax of
 * `hashKey(<seed>::governanceNarrative:<POOL>::<id>)` over the lines whose needs the place holds.
 *
 * NO ROLL. The seed is read off the active stream and nothing is drawn from it (`safetyProfile.js :: voiceOf`'s idiom), so
 * no other line of the birth moves. With no seed (a fixture or a gallery call) the rung's own line prints, as before:
 * index 0 at the levies and the default rungs, the field rotation at the market rung.
 *
 * THE TWINS. Index 0 of each pool is today's line byte for byte: the thorp twin (`BASELINE_CONFLICT_SIBLINGS`, resolved by
 * the site after this) and the boycott rewrite (`factionDynamics.js :: boycottReadsRelation`) key on its text, and the
 * no-grazing twin (`noGrazingQuarrelOf`, handed in as `noGrazing`) stands in for GRAZING's index 0 wherever it is picked,
 * as it stood in for the default rung's line.
 *
 * THE LEDGER. The pick goes through `drawDeclared` (drawKind H), so it is noted with its atoms and the birth self-check
 * re-asserts them against the final record.
 *
 * A module of its own: `governanceNarrative.js` stands at the `power/` line ceiling, which is cured by a split, never
 * packed (`tests/generators/powerStructure.test.js`).
 *
 * Pure apart from reading the active stream's seed; draws nothing.
 * @enforced-by tests/generators/power/conflictQuarrelPick.test.js
 */
import { QUARREL_POOLS, QUARREL_POOL_OF_RUNG } from '../../data/powerSiblings.js';
import { drawDeclared } from '../../domain/facts/drawDeclared.js';
import { declarationAdmits, declarationOf } from '../../domain/facts/factVocabulary.js';
import { hashKey } from '../../domain/display/stateProse/stateProseKernel.js';
import { getActiveRng } from '../../kernel/rngContext.js';

/** @typedef {{ id: string, text: string | null, needs: ReadonlyArray<string> }} Quarrel */

/**
 * The admitted line with the highest `hashKey(key::id)`, or null when none is admitted.
 * @param {ReadonlyArray<Quarrel>} lines @param {(line: Quarrel) => boolean} admitted @param {string} key
 * @returns {Quarrel | null}
 */
function argmaxOf(lines, admitted, key) {
  let best = null;
  let bestKey = -1;
  for (const line of lines) {
    if (!admitted(line)) continue;
    const k = hashKey(`${key}::${line.id}`);
    if (k > bestKey) {
      best = line;
      bestKey = k;
    }
  }
  return best;
}

/**
 * The place's everyday quarrel, where the ladder's line is a rung line of a pool.
 * @template T
 * @param {T} baseline the line the ladder chose, where it prints
 * @param {{ facts: () => object | null, noGrazing?: string | null, fieldRotation?: string | null }} site the site's facts
 *   (roster, tier and config) as a thunk; the no-grazing twin the power step read off the place (`noGrazingQuarrelOf`), if
 *   any; and the field-rotation rung's own line (`governanceNarrative.js :: FIELD_ROTATION_QUARREL`), the text of GRAZING's
 *   row that carries none
 * @returns {T | string} the picked quarrel's text; the baseline untouched where it is no rung line, or no seed is active
 */
export function pickQuarrel(baseline, { facts, noGrazing = null, fieldRotation = null }) {
  if (typeof baseline !== 'string') return baseline;
  const rungPool = Object.prototype.hasOwnProperty.call(QUARREL_POOL_OF_RUNG, baseline) ? QUARREL_POOL_OF_RUNG[baseline] : null;
  const grazingRung = (noGrazing && baseline === noGrazing) || (fieldRotation && baseline === fieldRotation);
  const poolName = rungPool ?? (grazingRung ? 'GRAZING' : null);
  const seed = getActiveRng()?.seed;
  if (!poolName || !seed) return baseline;
  const pool = /** @type {ReadonlyArray<Quarrel>} */ (QUARREL_POOLS[/** @type {'GRAZING'|'LEVIES'} */ (poolName)]);
  // a row with no text is the site's own line (the field rotation): it prints the text handed in, and with none it is
  // never picked
  const textOf = (/** @type {Quarrel} */ line) => (line.text === null ? fieldRotation : line.text);
  /** @type {object | null | undefined} */
  let held;
  const read = () => {
    if (held === undefined) held = facts();
    return held;
  };
  const key = `${seed}::governanceNarrative:${poolName}`;
  const admitted = (/** @type {Quarrel} */ line) => typeof textOf(line) === 'string'
    && declarationAdmits(declarationOf(line), /** @type {import('../../domain/facts/factVocabulary.js').FactsLike} */ (read())).admitted;
  const picked = drawDeclared(pool, {
    draw: (lines) => argmaxOf(lines, admitted, key),
    facts: read,
    key,
    poolId: `governanceNarrative:${poolName}`,
    surface: 'power',
    drawKind: 'H',
  });
  const text = picked.line ? textOf(picked.line) : null;
  if (typeof text !== 'string') return baseline;
  return picked.line === pool[0] && noGrazing ? noGrazing : text;
}
