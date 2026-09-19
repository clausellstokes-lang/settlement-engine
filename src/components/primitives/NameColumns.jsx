/**
 * primitives/NameColumns — a list of SHORT rows laid in responsive columns.
 *
 * ⭐ THE ORDER (owner, 2026-09-19, on the Power tab's "Institutions behind this
 * power (25)"): "could we also have sections like these be in two or three
 * columns to conserve space?". Twenty-five institution names, each on its own
 * full-width line, is twenty-five lines of page for twenty-five words. The names
 * are the list; the page should read them the way a roster reads.
 *
 * ── WHY CSS MULTI-COLUMN AND NOT A GRID ──────────────────────────────────────
 * Both keep DOM order, so the tab order and a screen reader's traversal are the
 * source order either way. They differ in WHERE the reader's eye goes:
 *
 *   • `columnCount` flows DOWN a column and then across to the next. A list that
 *     arrives sorted (the derivation's order, or alphabetical) still reads in
 *     that order when you read it the way a column is read.
 *   • a plain `grid` with `repeat(N, 1fr)` fills ACROSS — item 1, 2, 3 land on
 *     the FIRST ROW — so the sorted order runs left-to-right and the columns are
 *     not lists at all. Recovering down-then-across needs `gridAutoFlow: column`
 *     plus an explicit row count, which means computing ceil(n / columns) here
 *     and re-computing it at every breakpoint.
 *
 * So: multi-column. DOM order is reading order down each column, and nothing has
 * to know how many rows there are.
 *
 * ── THE ROWS STAY BLOCK CONTAINERS, AND THAT IS LOAD-BEARING ─────────────────
 * This takes the caller's EXISTING row nodes as children and wraps nothing. That
 * is deliberate: `InstitutionLink` returns a FRAGMENT — the inline trigger and,
 * BESIDE IT, the `InstitutionCard` dialog rendered in place rather than portalled
 * (see that primitive's docblock and `tests/components/institutionLinkBlockContainer.test.jsx`).
 * A row that is a `<div>` today keeps being a `<div>`; a caller that wrapped its
 * rows in `<p>` would nest block content in a paragraph the moment a reader opens
 * a card, and this component neither causes nor cures that.
 *
 * `breakInside: 'avoid'` on the wrapper is what keeps a row from being sliced in
 * half across a column boundary. It is declared here rather than asked of every
 * caller, because a caller that forgets it produces a page that looks right until
 * one name wraps to two lines.
 *
 * ── THE LADDER AND WHERE THE WIDTH COMES FROM ────────────────────────────────
 * Three columns at ≥ 900px, two at ≥ 600px, one below — `COLUMN_LADDER`, which is
 * the single source both paths read, so they cannot drift.
 *
 *   • BY DEFAULT the width is the VIEWPORT's, read through `useIsMobile(bp)` —
 *     the estate's shared matchMedia store, ONE listener per breakpoint for the
 *     whole app however many lists render. No measurement, no ResizeObserver, no
 *     layout read. The dossier's panel is the viewport minus its chrome, so the
 *     ladder is about the reader's screen rather than about this box.
 *   • A CALLER INSIDE A NARROWER BOX passes `width` (px) and the same ladder is
 *     applied to that number instead. The tests drive both paths.
 *
 * ⚠ NO `fontSize` IS DECLARED HERE, deliberately. The rows keep their own steps,
 * so the phone floors (src/design/proseScale.js) stay the caller's business and
 * this primitive adds nothing for the source census to judge.
 *
 * @enforced-by tests/components/nameColumns.test.jsx
 * @enforced-by tests/lint/nameListColumns.walker.test.js
 */

import { Children } from 'react';
import { SP } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';

/**
 * THE LADDER, widest first — the one place the breakpoints and their column
 * counts are written. Read by `columnsForWidth` (the explicit-width path) and by
 * the viewport path below, so a change here moves both at once.
 *
 * `minWidth` is the width AT WHICH the count applies; the last row is the floor
 * and must be 0, which the primitive's own test asserts.
 * @type {ReadonlyArray<{minWidth: number, columns: number}>}
 */
export const COLUMN_LADDER = Object.freeze([
  Object.freeze({ minWidth: 900, columns: 3 }),
  Object.freeze({ minWidth: 600, columns: 2 }),
  Object.freeze({ minWidth: 0, columns: 1 }),
]);

/**
 * The column count this ladder gives a container of `width` px.
 * @param {number} width
 * @returns {number}
 */
export function columnsForWidth(width) {
  const px = Number.isFinite(width) ? width : 0;
  const rung = COLUMN_LADDER.find((step) => px >= step.minWidth);
  return rung ? rung.columns : 1;
}

/**
 * ⭐ A COLUMN IS ONLY A COLUMN IF IT HOLDS A FEW ROWS. Six names in three columns
 * is a caption with three pairs of orphans under it, not a roster — the space
 * saved is paid for twice in how hard the thing is to read. So the count is
 * capped at one column per this many rows, which is why a six-row list takes two
 * columns on the widest screen and a sixteen-row list takes three.
 */
export const MIN_ROWS_PER_COLUMN = 3;

/**
 * A list of short rows in responsive columns.
 *
 * Renders NOTHING extra when the list is short: `min` (default 6) is the length
 * at which columns start to pay, because three rows in three columns is a header
 * with three orphans under it rather than a list.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.children the caller's own row nodes
 * @param {number} [props.count] how many rows `children` holds; below `min` the
 *   list renders single-column. Pass the array length the caller mapped over when
 *   the two could differ; omitted, the rendered child count is used.
 * @param {number} [props.min=6] the shortest list that takes columns
 * @param {number} [props.width] the container's width in px, when the caller
 *   knows it. Omitted, the viewport is used (see the docblock).
 * @param {number} [props.max] cap the ladder — e.g. 2 for a half-width panel.
 * @param {import('react').CSSProperties} [props.style] extra style for the box
 */
export default function NameColumns({ children, count, min = 6, width, max, style }) {
  // The two viewport rungs, read off the shared store. Hooks run unconditionally
  // and above every branch, so the hook order is stable whatever the ladder says.
  const belowWide = useIsMobile(COLUMN_LADDER[0].minWidth);
  const belowMid = useIsMobile(COLUMN_LADDER[1].minWidth);

  const n = Number.isFinite(count) ? count : Children.count(children);
  const ladder = Number.isFinite(width)
    ? columnsForWidth(width)
    // The SAME ladder, expressed over the two flags: not below 600 and not below
    // 900 ⇒ the widest rung; below 900 but not below 600 ⇒ the middle one.
    : (belowMid ? COLUMN_LADDER[2].columns
      : belowWide ? COLUMN_LADDER[1].columns
        : COLUMN_LADDER[0].columns);
  const capped = Number.isFinite(max) ? Math.min(ladder, max) : ladder;
  const columns = n < min
    ? 1
    : Math.max(1, Math.min(capped, Math.floor(n / MIN_ROWS_PER_COLUMN)));

  return (
    <div
      data-name-columns={columns}
      style={{
        // `columnCount: 1` is the identity layout, so a short list and a phone
        // render exactly what they rendered before this primitive existed.
        columnCount: columns,
        columnGap: SP.md,
        ...style,
      }}
    >
      {/* ⛔ THE BREAK RULE GOES ON EACH ROW, AND ONE WRAPPER ROUND THE WHOLE LIST
          WOULD BE THE OPPOSITE OF THIS COMPONENT. `break-inside: avoid` on a single
          box holding all twenty-five names makes the list one unbreakable block, so
          the browser lays it in column one and leaves the other two empty — the
          layout would look exactly like the defect it was written to cure.

          ⚠ EACH WRAPPER IS A `<div>`, WHICH IS ALSO WHY THE ROWS KEEP WORKING. A row
          holding `InstitutionLink` needs a BLOCK container, because that primitive
          returns the trigger AND the `InstitutionCard` dialog beside it (its own
          docblock; tests/components/institutionLinkBlockContainer.test.jsx). A
          `<span>` here would put a `<section role="dialog">` inside inline content
          the moment a reader opened a card. */}
      {Children.map(children, (child) => (
        <div style={{ breakInside: 'avoid', WebkitColumnBreakInside: 'avoid' }}>{child}</div>
      ))}
    </div>
  );
}
