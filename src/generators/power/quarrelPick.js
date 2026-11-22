/**
 * power/quarrelPick.js — THE EVERYDAY QUARREL, PICKED BY KEYED HASH WITH NO NEW DRAW (BUILD-CONFLICT, DEPTH-2,
 * 2026-11-20; the chair's word of 16:08 UTC; the lines `docs/chair/2026-11-20/content/depth/lines/CONFLICT-LINES.md`, the
 * measure `docs/chair/2026-11-20/content/depth/conflict/CONFLICT-MEASURE.md`).
 *
 * Three rungs of `governanceNarrative.js :: deriveBaselineConflict` printed one sentence each in most places of their size.
 * Where such a rung's line PRINTS (the site's own rule: no primary-stress narrative overrides it, or the `infiltrated` one
 * carries it), the site hands it here, and the place's quarrel is chosen from the rung's pool
 * (`data/powerSiblings.js :: QUARREL_POOLS`, keyed by `QUARREL_POOL_OF_RUNG`, and the field rotation the site hands in
 * beside: its literal stays at the site, where the presumption-classes register banks it; the pool is composed here with
 * it in its slot, `FIELD_ROTATION_SLOT`, which keeps the row's id and needs). THE MIXED PICK (the chair's
 * rule of 17:18 UTC: a keyed pool not yet built takes it from the start): `pickVariantMixed(<the lines whose needs the
 * place holds, in pool order>, '<seed>::governanceNarrative:<POOL>')` (`kernel/proseHash.js`: the FNV hash, mixed by a
 * 32-bit finalizer before the modulo; the per-line argmax it replaced is gone).
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
import { FIELD_ROTATION_SLOT, QUARREL_POOLS, QUARREL_POOL_OF_RUNG } from '../../data/powerSiblings.js';
import { drawDeclared } from '../../domain/facts/drawDeclared.js';
import { declarationAdmits, declarationOf } from '../../domain/facts/factVocabulary.js';
import { pickVariantMixed } from '../../kernel/proseHash.js';
import { getActiveRng } from '../../kernel/rngContext.js';

/** @typedef {{ id: string, text: string | null, needs: ReadonlyArray<string> }} Quarrel */
/** @typedef {{ id: string, text?: string, needs: ReadonlyArray<string> }} PoolRow a data row, or the field rotation's slot */

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
  const rows = /** @type {ReadonlyArray<PoolRow>} */ (QUARREL_POOLS[/** @type {'GRAZING'|'LEVIES'} */ (poolName)]);
  // the field rotation's slot takes the site's own line (the text handed in), in the slot's place, with its id and
  // needs; with none handed in it carries no text and is never picked
  const rotation = /** @type {Quarrel} */ ({ id: FIELD_ROTATION_SLOT.id, text: fieldRotation, needs: FIELD_ROTATION_SLOT.needs });
  const pool = rows.map((row) => (row === FIELD_ROTATION_SLOT ? rotation : /** @type {Quarrel} */ (row)));
  /** @type {object | null | undefined} */
  let held;
  const read = () => {
    if (held === undefined) held = facts();
    return held;
  };
  const seedKey = `${seed}::governanceNarrative:${poolName}`;
  const admitted = (/** @type {Quarrel} */ line) => typeof line.text === 'string'
    && declarationAdmits(declarationOf(line), /** @type {import('../../domain/facts/factVocabulary.js').FactsLike} */ (read())).admitted;
  const picked = drawDeclared(pool, {
    draw: (lines) => pickVariantMixed(lines.filter(admitted), seedKey) ?? null,
    facts: read,
    key: seedKey,
    poolId: `governanceNarrative:${poolName}`,
    surface: 'power',
    drawKind: 'H',
  });
  const text = picked.line ? picked.line.text : null;
  if (typeof text !== 'string') return baseline;
  // the no-grazing twin stands in for GRAZING's index 0 only: it is read off every place, a town's included (the merge read of da16f2f4b)
  return poolName === 'GRAZING' && picked.line === pool[0] && noGrazing ? noGrazing : text;
}
