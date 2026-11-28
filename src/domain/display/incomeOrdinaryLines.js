/**
 * domain/display/incomeOrdinaryLines.js — THE TRADE'S ORDINARY INCOME LINES, AS A LEAF (BAR8 J-INCOME item 1, the sixth
 * chair's BRIEF-BAR8, 2026-11-17). `ordinaryIncomeLineOf` and exactly the lines it reads, moved here unchanged from
 * `generators/economy/incomeLineSiblings.js`, which imports them from this leaf and re-exports each under its own name
 * (so no importer of that module changes, and `INCOME_STATE_SIBLINGS` there declares the same texts). The printed export
 * (`src/pdf`) may not import `src/generators` (the layer law, `tests/architecture`); it may read this leaf. No line's text
 * moves. The chair's ruling of 2026-11-18 (after the move): the roster is read LIVE, through the one ruin filter
 * (`institutions/institutionRoster.js :: liveInstitutions`, itself import-free and on the eager side: ruling EG1 holds): a
 * ruined house weaves or saws nothing. No record of the census's populations holds a non-live house (measured), so no page moves.
 */

import { liveInstitutions } from '../institutions/institutionRoster.js';

/** The cloth lines (the record's short twin and the trade's ordinary line where a weaving or fulling house stands). */
export const CLOTH_SHORT_LINE = 'Little cloth is made here while the cloth trade is short of what it needs.';
export const CLOTH_WORKED_LINE = 'Cloth is woven or finished here.';

/** The metal lines read by `METAL_WORK_LINES` (each says metal is smelted or worked here, or that the forges burn). */
/** The metalwork line where coal stands and no iron does (COHERENCE-AGREE cure 7); it says the iron is bought in. */
export const LOCAL_COAL_LINE = 'Local coal fires the forges, but the iron is bought in; this income stream leans on the trade route.';
export const LOCAL_ORE_LINE = 'Local ore feeds the smithy directly. Metalwork income is not trade-route dependent.';
export const IRON_IMPORTED_LINE = 'Iron imported from mining regions and worked locally; this income stream is vulnerable to supply disruption.';
export const METAL_WORKED_LINE = 'Metal is smelted or worked here.';
/** BAR7-ECON item 1 (8f; vetoable by the owner): the metal line's twin where the metal chain is impaired, as the cloth line's is. */
export const METAL_SHORT_LINE = 'Little metal is worked here while the metal trade is short of what it needs.';
/** LEFT-CHAIN L7 (BRIEF-LEFT, 2026-11-17; vetoable by the owner): the metal lines' twin where every smelting or working house of
 * the trade is marked short and a mine of the trade is at work (`economicsCrisisMarks.js :: forgeIdleHere`, read at print by
 * `ordinaryIncomeLineOf`): the mine is worked; the metalworking is not. */
export const METAL_FORGE_IDLE_LINE = 'The digging goes on here, but the metalworking stands idle, short of what it needs.';

/** The roster's forge houses, as a name word (the census's "metal house"): the coal line's gate, and (the chair's ruling of
 * 2026-11-18, BR33 (2)) the metal arm's live house that smelts or works metal. Moved here unchanged from `incomeLineSiblings.js`. */
export const FORGE_HOUSE_WORDS = Object.freeze(['smith', 'forge', 'foundr', 'smelt', 'metal', 'armor', 'armour', 'weapon']);

/** The timber lines (the trade's ordinary line, with or without a sawmill, and the short twin). */
export const TIMBER_PLAIN_LINE = 'Local forest provides timber revenue.';
/** BAR2-LABELS LB6: the timber line's twin where a sawmill stands and no managed woodland does (vetoable by the owner). */
export const TIMBER_SAWN_LINE = 'Local forest provides timber revenue, and the timber is sawn here.';
/** BAR7-ECON item 1 (8f.chain; vetoable by the owner): the timber line's twin where the timber chain is impaired. */
export const TIMBER_SHORT_LINE = 'Little timber is worked here while the timber trade is short of what it needs.';

/**
 * THE TRADE'S ORDINARY LINE IN PLACE OF A STORED SHORT TWIN (BAR7-ECON after the second reader, the chair's point (1),
 * 2026-11-17; vetoable by the owner). The three short twins (`CLOTH_SHORT_LINE`, `METAL_SHORT_LINE`, `TIMBER_SHORT_LINE`) are
 * drawn by the chain's STORED status, so "Little metal is worked here …" stood where the smiths are fed by an import and the page
 * marks no house. The page reads it at print (`economicsCrisisMarks.js :: incomeDescShown`): a short twin prints only where the
 * share takes a mark; where it takes none, this gives the trade's ordinary line, a declared twin of the same family that claims
 * only what the roster holds: "Cloth is woven or finished here." where a weaving or fulling house stands (else no sentence),
 * "Metal is smelted or worked here." (the twin is drawn only beside a forge house), "Local forest provides timber revenue, and
 * the timber is sawn here." where a sawmill stands, else "Local forest provides timber revenue.". The record does not hold the
 * line the draw began from, so this is the family's plain line, not always the exact one (no "managed felling", no flocks, no
 * trade route: none of them is read here). Pure; no draw. Not a short twin: null. LEFT-CHAIN L7: handed `reading.forgeIdle`, a
 * metal line that says metal is worked (`METAL_WORK_LINES`) gives `METAL_FORGE_IDLE_LINE`.
 * @param {unknown} desc the stored line @param {{ institutions?: unknown } | null | undefined} town
 * @param {{ forgeIdle?: boolean } | null} [reading] the display layer's reading of the share's houses
 * @returns {string | null}
 */
export function ordinaryIncomeLineOf(desc, town, reading = null) {
  // LEFT-CHAIN L7: a metal line that says metal is smelted or worked here, on an unmarked share whose every working house is
  // marked short beside a mine at work (`reading.forgeIdle`, the display layer's `economicsCrisisMarks.js :: forgeIdleHere`)
  if (reading?.forgeIdle === true && METAL_WORK_LINES.has(/** @type {string} */ (desc))) return METAL_FORGE_IDLE_LINE;
  if (desc !== CLOTH_SHORT_LINE && desc !== METAL_SHORT_LINE && desc !== TIMBER_SHORT_LINE) return null;
  const roster = liveInstitutions(/** @type {Parameters<typeof liveInstitutions>[0]} */ (town)).map((i) => String(i?.name ?? '').toLowerCase());
  const has = (/** @type {RegExp} */ re) => roster.some((n) => re.test(n));
  if (desc === CLOTH_SHORT_LINE) return has(/weav|fuller/) ? CLOTH_WORKED_LINE : '';
  // BR33 (2): a live house that smelts or works metal, as the cloth and timber arms ask the live roster for theirs; else no sentence
  if (desc === METAL_SHORT_LINE) return FORGE_HOUSE_WORDS.some((w) => roster.some((n) => n.includes(w))) ? METAL_WORKED_LINE : '';
  return has(/sawmill|lumber/) ? TIMBER_SAWN_LINE : TIMBER_PLAIN_LINE;
}

/** The metal lines that say metal is smelted or worked here, or that the forges burn (LEFT-CHAIN L7's twin answers each). */
const METAL_WORK_LINES = new Set([METAL_WORKED_LINE, METAL_SHORT_LINE, LOCAL_ORE_LINE, IRON_IMPORTED_LINE, LOCAL_COAL_LINE]);
