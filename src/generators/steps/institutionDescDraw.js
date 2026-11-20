/**
 * steps/institutionDescDraw.js — THE INSTITUTION DESCRIPTION DRAW, DECLARED (CENSUS-1f unit 1b;
 * `docs/DESIGN_POOL_CENSUS.md` Appendix B site 18, H).
 *
 * `assembleInstitutions` picks one description from `[catalogDesc, ...variants]` (or the pool's
 * ship-free subset) by a pure fnv hash of `seed:name` (`kernel/proseHash.js :: pickVariant`, zero
 * rng). That draw is kept EXACTLY — the same hash over the same array — and the drawn text is then
 * RESOLVED through `drawDeclared`: each text is lifted to `{ text, ...declarations }` from the two
 * text-keyed columns beside the table (`institutionDescVariants.js :: DESC_VARIANT_DECLARATIONS`,
 * CENSUS-4c; and the first line of CENSUS-1c's walls sibling sets, `DESC_VARIANT_SIBLINGS`). A
 * refused text takes its walls twin when it has one and the record admits it (the sibling set's
 * own resolution, unchanged), else the hash argmax over the admitted texts, else nothing (the drawn
 * text stays: a description slot is never emptied — the self-check then names it).
 *
 * Pure: no randomness, no clock, no write.
 *
 * @enforced-by tests/generators/institutionDescDraw.test.js
 */
import { DESC_VARIANT_DECLARATIONS, DESC_VARIANT_SIBLINGS } from '../../data/institutionDescVariants.js';
import { drawDeclared, lineText } from '../../domain/facts/drawDeclared.js';
import { pickVariant } from '../../kernel/proseHash.js';

/** @param {string} text @returns {string | { text: string }} */
function lift(text) {
  const own = /** @type {Record<string, any>} */ (DESC_VARIANT_DECLARATIONS)[text];
  const set = /** @type {Record<string, ReadonlyArray<any>>} */ (DESC_VARIANT_SIBLINGS)[text];
  const original = set ? set.find((l) => l && l.text === text && !l.twinOf) : null;
  if (!own && !original) return text;
  /** @param {'needs'|'excludes'|'crisis'} f */
  const both = (f) => [...(own?.[f] ?? []), ...(original?.[f] ?? [])];
  return Object.freeze({ text, needs: both('needs'), excludes: both('excludes'), crisis: both('crisis') });
}

/**
 * @param {ReadonlyArray<string>} texts the pool the site draws from (already the ship-free subset where that applies)
 * @param {unknown} seedKey the site's hash key (`${seed}:${inst.name}`)
 * @param {object | (() => object) | null} facts the birth's facts at the draw
 * @param {string} poolKey the table key (`tier|category|name`), for the ledger
 * @returns {string | undefined}
 */
export function drawInstitutionDesc(texts, seedKey, facts, poolKey) {
  // W2-FIX-DATA-4 item 3: a pool of one text is that text; no hash is read (the cascade's rows resolve here, and the
  // fork census's hash channel counts only real choices).
  const drawnText = texts.length === 1 ? texts[0] : pickVariant(/** @type {string[]} */ ([...texts]), /** @type {string} */ (seedKey));
  const pool = texts.map(lift);
  if (!pool.some((l) => typeof l !== 'string')) return drawnText;
  const at = texts.indexOf(/** @type {string} */ (drawnText));
  const r = drawDeclared(pool, {
    draw: (p) => p[at],
    facts,
    key: String(seedKey),
    poolId: `institutionDescVariants:${poolKey}`,
    surface: 'institutions',
    drawKind: 'H',
    keepRefused: true, // R-AM: the slot is never emptied (CENSUS-1f's site-18 ruling); a kept line is noted
    twin: (line) => {
      const set = /** @type {Record<string, ReadonlyArray<any>>} */ (DESC_VARIANT_SIBLINGS)[lineText(line)];
      return set ? set.find((l) => l && typeof l.twinOf === 'string') ?? null : null;
    },
  });
  return r.line == null ? drawnText : lineText(r.line);
}
