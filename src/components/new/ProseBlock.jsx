/**
 * ProseBlock.jsx — THE ONE RENDERER FOR A DOSSIER POSITION THAT IS A PARAGRAPH.
 *
 * ── WHY IT EXISTS (owner finding, 2026-09-18) ────────────────────────────────────────
 * Fifty-six dossier mounts draw corpus prose, fifty-one of them at the SENTENCE rung, and
 * every stacked one of them rendered ONE `<p>` PER SENTENCE with no joiner:
 *
 *   {lines.map((line,i)=>(<p key={i} style={{fontSize:i===0?FS.md:FS.sm, …}}>{line}</p>))}
 *
 * That idiom was copied to nine files. It has two defects and they compound. The reader gets
 * a column of one-sentence paragraphs where the desk composed one reading; and because 72%
 * of the corpus's variants name `{settlement}` and 25% OPEN on it, those paragraphs begin
 * "Vallepagus… Vallepagus… Vallepagus". This renders the position as ONE paragraph through
 * `weaveBlock`, which joins the sentences and stands the REPEATED opening name down to the
 * tier noun.
 *
 * ⛔ THE ARRANGEMENT IS THE RENDERER'S, THE WORDS ARE THE CORPUS'S. Not one authored word is
 * added here and no composer, pool, candidate leaf, mount row or `legibilityRung` string
 * moves for it: the desks draw exactly the sentences they drew before, `drawnAtMount` still
 * rules on every one of them, and the dossier-prose manifest cannot see this file. The weave
 * itself is a pure headless leaf (`domain/display/stateProse/weaveBlock.js`) so it can be
 * tested and reasoned about without a DOM, and so THE PROMISE stays where it already lives.
 *
 * ── WHAT THE CALL SITE STILL OWNS ────────────────────────────────────────────────────
 * THE SKIN. Every position sits inside its own card with its own rule, tint and accent, and
 * this component has no opinion about any of that: it takes the `<p>` style the site already
 * wrote for its FIRST line and renders the woven paragraph in it. A stack's second-and-later
 * lines used to render smaller and greyer than the first; with one paragraph there is one
 * voice, and the first line's own style is the one that survives.
 *
 * THE DRAW. The site resolves its own rungs through `drawnAtMount` and hands over STRINGS.
 * A position the registry glances, a corpus that was silent, or a desk that was never called
 * all arrive here as an empty list and render NOTHING (R-DST-K) — which is why there is no
 * empty-state branch.
 *
 * ⚠ PHONE SIZING IS A FLOOR, NEVER A RESIZE. At ≤640px the paragraph reads at the phone
 * prose floor or the site's own size, whichever is LARGER; above the breakpoint the site's
 * size is untouched to the pixel. The floor itself is THE ONE the rest of the dossier uses —
 * `design/proseScale.js`, the zero-import leaf the dossier-UI car gave every prose call site —
 * so a phone reader meets one floor everywhere, and a site that already reads above it is
 * never pulled DOWN (the floor is a max and not an assignment).
 */
import { FS } from '../theme.js';
import useIsMobile from '../../hooks/useIsMobile.js';
import { proseFontSize } from '../../design/proseScale.js';
import { tierNounFor, weaveBlock } from '../../domain/display/stateProse/weaveBlock.js';

/**
 * One mounted position, woven into one paragraph.
 *
 * @param {object} props
 * @param {ReadonlyArray<string|null|undefined>|null|undefined} props.lines the sentences the
 *   site drew, in the order the desk built them; blanks and nulls are dropped by the weave.
 * @param {unknown} [props.settlementName] the town's own name — `settlement.name`. Absent,
 *   the sentences still join and nothing is renamed.
 * @param {unknown} [props.tier] the town's tier token — `settlement.tier`. A tier this build
 *   does not know substitutes nothing (see `tierNounFor`).
 * @param {object} [props.style] the `<p>` style of the site this replaces — its FIRST line's.
 * @param {string} [props.testId] a `data-testid`, where the site already carried one.
 */
export default function ProseBlock({ lines, settlementName, tier, style, testId }) {
  const mobile = useIsMobile();
  const { paragraph } = weaveBlock(lines, {
    settlementName, tierNoun: tierNounFor(tier),
  });
  if (!paragraph) return null;
  const base = typeof style?.fontSize === 'number' ? style.fontSize : FS.md;
  return (
    <p data-testid={testId} style={{ ...style, fontSize: proseFontSize(base, mobile) }}>
      {paragraph}
    </p>
  );
}
