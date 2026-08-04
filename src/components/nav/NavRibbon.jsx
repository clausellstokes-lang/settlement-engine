/**
 * NavRibbon.jsx — the desktop header's primary destination ribbon.
 *
 * THE HALF-SEEN WAR ARROW (owner directive, 2026-08-03 evening; refined the same
 * night from the owner's mockup). The bar is HALF OF AN ARROW IN PROFILE. The arrow
 * lies along the top screen edge and the viewport shows this side's half: the whole
 * header is the SHAFT'S VISIBLE HALF — one honey-tan barrel running the full width,
 * wordmark included, shaded as a cylinder (App.jsx paints it; theme.js SHAFT* owns
 * it) — and Create · Library · Realm are the NEAR SIDE'S FLETCHING rooted on that
 * barrel. Two red-brown silk wraps bracket the band's two ends. ONE object.
 *
 * WHAT THE REFINEMENT CHANGED, and it is more than a repaint. V3 gave each of the
 * three cells its OWN fletch SVG and cut a seam between them. The shipped bar read
 * as three separate dark tabs with bare honey wood between each pair — the exact
 * "feathers on a plank" failure the directive exists to avoid — because the lap was
 * authored per-cell in each cell's own stretched coordinate space and came out at
 * about two screen pixels while the seam between them was ten. There is now ONE
 * continuous band (FletchBand.jsx): one SVG over the whole cluster, three cells
 * SHINGLED in one coordinate space, with a soft contact shadow at every lap and NO
 * internal seams at all. The laps ARE the seams.
 *
 * ⚠️⚠️ AND THEN THE OWNER CORRECTED THE DIRECTION AND THE SHAPE (final, 2026-08-03
 * night). The Z-ORDER ASCENDS INTO REALM: Library's leading edge lies OVER Create's
 * trailing edge and Realm's over Library's, so Realm is topmost, Create bottommost,
 * and every tab reads as FEEDING INTO the next — Create → Library → Realm. The cut
 * before this one stacked them the other way and the cascade pointed BACK at Create.
 * The cells are also SIMPLE SLANTED QUADS now, filled edge to edge with the goose
 * treatment; the tapered points and curved backs that preceded them read as three
 * torn tabs. FletchBand.jsx owns both corrections and the reasoning behind them.
 *
 * ⚠️ THE THREE FLETCH CELLS ARE EQUAL-WIDTH, AND THAT IS GEOMETRY, NOT TIDINESS.
 * The band's vanes live at fixed thirds of one coordinate space, so a label whose
 * cell is wider or narrower than a third would sit off its own feather's calm zone —
 * and the lap boundaries would land inside labels instead of between them. `flex: 1
 * 1 0` on the three makes every lane exactly a third of whatever the band measures,
 * at every font and every zoom, which is what keeps the drawn band and the laid-out
 * labels describing the same object. (It also costs nothing: the band's total width
 * is unchanged, because the two 10px seams it replaced were exactly the slack the
 * two narrower labels take up.)
 *
 * ⚠️ THE BALANCE LAW SURVIVES THE REPAINT (V2 directive §4, still binding). Several
 * emphasis devices stack on the same three cells — the vane's dark fill against the
 * wood, the comb texture, the sheen bands, the contact shadows, the edge-light and
 * the label weight. Each is deliberately dialled to about HALF what it would be
 * carrying the hierarchy alone: the barbs are a hairline at a ~8% tonal drop, the
 * sheen is blurred, the edge-light is a half-opacity whisper, the weight is 600
 * rather than 700. V3 spent one device to buy the goose reading — the gilt hairline
 * is gone entirely — and the refinement spent another: the internal seams. Neither
 * was replaced with a louder one. If a future edit strengthens one of these, it must
 * weaken another.
 *
 * THE BAND'S MEMBERSHIP IS DERIVED, NOT LISTED — unchanged since V1, and the one
 * piece of this file that has survived every repaint. `fletchedRuns` groups NAV by
 * the flow predicate NavFlowArrow owns (routes.js NAV_FLOW): a cell is fletched when
 * it feeds, or is fed by, its rendered neighbour. The band is therefore the maximal
 * declared run, and a future nav insertion or reorder re-files the band
 * automatically instead of leaving a hardcoded trio pointing at the wrong tabs.
 *
 * ⚠️⚠️ THE HANG IS PAINT, NEVER LAYOUT. The vanes reach FLETCH_HANG px below the
 * ribbon's bottom edge. The header is sticky and theme.js derives ANCHOR_OFFSET from
 * CHROME.headerDesktop, so every About / guide / Compendium / dossier in-page anchor
 * in the estate lands on a number this bar must not move. FletchBand buys the hang
 * with `overflow: visible` on a zero-inset absolute box and geometry drawn past the
 * bottom — costing no height, no margin, no border and no offset.
 * tests/components/navFletching.test.jsx pins both halves: the mechanism, and the
 * ABSENCE of any box that spends it. There is no TOP hang: the header is sticky at
 * top:0 and it would clip.
 *
 * ⚠️ NOTHING CLIPPED IS EVER FOCUSABLE. `clip-path` clips an element's whole
 * rendering INCLUDING its outline, and a11y.css draws the global focus ring outside
 * the border box, so clipping a cell's own control would silently swallow the
 * keyboard ring while leaving every visual test green. All clipping lives inside
 * FletchBand's aria-hidden SVG, which is now a SIBLING of the three controls rather
 * than a child of each — so there is not even an ancestor relationship left to get
 * wrong. No ancestor may introduce `overflow: hidden` either. The pin asserts the
 * chain.
 *
 * ACTIVE STATE, in the owner's own words: a BRIGHTENED CELL plus a GOLD UNDERLINE.
 * The whole quad's fill steps one rung up the goose ladder and its sheen bands lift
 * with it, the label brightens to PARCH, and the gold is stroked along the cell's OWN
 * lower edge — so it hangs below the bar with the feather it belongs to instead of
 * ruling across the tab. That is three visual channels plus aria-current="page", none
 * of them colour alone. ⚠️ The brightening is built ENTIRELY from tones already in the
 * ladder, which is why the AA floor did not move: the lightest thing a label can land
 * on is still FLETCH_SHEEN_LIFT. Weight is deliberately not a channel: every fletch
 * label is 600 under the BALANCE LAW. The plain reference tabs keep the underline
 * register, and in V4 they join the fletches in the PARCHMENT one — on cedar there is
 * no ink register left to keep them apart from it (see the cell's own note).
 *
 * THE FLOW MARK MOVED, IT DID NOT DIE. NavFlowArrow no longer renders here; it still
 * draws on the MOBILE bottom nav, where cells have no seam to carry a divider. Both
 * surfaces stay pinned: tests/components/navFlowArrows.test.jsx keeps the mobile arm
 * as its live half, tests/components/navDividers.test.jsx censuses this one.
 *
 * STRETCH CHAIN. `alignSelf: stretch` here (and on the header cluster that holds it)
 * is what lets the band and the wraps span the bar top-to-bottom;
 * `alignItems: center` keeps the PLAIN cells at their natural height so their gold
 * underline stays exactly where it has always sat, while the band's own
 * `alignItems: stretch` fills the fletch cells to bar height — which is what makes
 * the three read as one fletching rather than three chips.
 */
import { Fragment } from 'react';
import { NAV } from '../../lib/routes.js';
import NavDivider from './NavDivider.jsx';
import { flowsInto } from './NavFlowArrow.jsx';
import FletchBand from './FletchBand.jsx';
import ShaftWrap from './ShaftWrap.jsx';
import { GILT, PARCH, PARCH_100, SP, FS, sans } from '../theme.js';

/**
 * Group NAV into consecutive runs, marking each run fletched or plain. A cell is
 * fletched when the declared flow enters or leaves it AT ITS RENDERED NEIGHBOUR —
 * the same adjacency guard the flow mark uses, so a surface that renders the trio
 * out of order grows no fletching it has not earned.
 * @returns {{ fletched: boolean, items: ReadonlyArray<{id: string, label: string}> }[]}
 */
function fletchedRuns() {
  const fletched = NAV.map((n, i) =>
    flowsInto(n.id, NAV[i + 1]?.id) || flowsInto(NAV[i - 1]?.id, n.id));
  const runs = [];
  NAV.forEach((item, i) => {
    const last = runs[runs.length - 1];
    if (last && last.fletched === fletched[i]) last.items.push(item);
    else runs.push({ fletched: fletched[i], items: [item] });
  });
  return runs;
}

/**
 * THE GLOBAL FOCUS RING'S WIDTH, in px — a11y.css draws `outline: 3px solid
 * var(--sf-focus)`, and the fletch cells inset the ring by exactly that so the whole
 *3px lands inside their own box (see the cell's own note). ⚠️ IF a11y.css EVER
 * RE-WEIGHTS THE RING THIS MUST FOLLOW IT: a smaller inset than the ring's width would
 * put part of it back outside the box and above the viewport, which is the defect.
 * tests/components/navFletching.test.jsx reads the stylesheet and pins the two
 * together rather than trusting this comment.
 */
const FOCUS_RING_PX = 3;

/** Everything both cell registers share: metrics, type, and the settle. */
const CELL_BASE = {
  display: 'flex', alignItems: 'center', gap: SP.xs,
  padding: `${SP.sm}px ${SP.lg}px`,
  background: 'transparent',
  border: 'none', borderRadius: 0, cursor: 'pointer',
  fontSize: FS.sm, fontFamily: sans,
  letterSpacing: '0.14em', textTransform: 'uppercase',
  transition: 'all 0.2s',
};

export default function NavRibbon({ view, onNavClick }) {
  /** One nav cell — a fletch riding the band, or a plain reference tab. */
  const cell = ({ id, label }, fletchedCell) => {
    const active = view === id;
    return (
      <button
        key={id}
        type="button"
        onClick={() => onNavClick(id)}
        aria-current={active ? 'page' : undefined}
        data-nav-cell={fletchedCell ? 'feather' : 'plain'}
        style={{
          ...CELL_BASE,
          // `relative` + z-index lifts the label above the band that paints behind it.
          position: 'relative', zIndex: 1,
          ...(fletchedCell
            // A fletch label rides the DARK GOOSE VANE, so it stays in the pale
            // register even though the shaft under the fletching is light wood.
            // Weight 600, never 700: under the BALANCE LAW weight separates the
            // fletching from the shelf (600 vs the reference tabs' 500) and says
            // nothing about active-ness, which the brightened sheen, the gold edge,
            // the brighter label and aria-current already carry between them.
            // The equal-lane law — see the header note. ⚠️ AUTHORED AS LONGHANDS,
            // not as the `flex` shorthand: jsdom's cssstyle does not implement the
            // shorthand and drops it SILENTLY, so the shorthand renders correctly in
            // a browser while every jsdom pin on it reads back the empty string and
            // has to be weakened to nothing. Longhands are legible to both.
            ? {
              alignSelf: 'stretch', justifyContent: 'center',
              flexGrow: 1, flexShrink: 1, flexBasis: 0,
              color: active ? PARCH : PARCH_100, fontWeight: 600,
              // ⚠️⚠️ THE FOCUS RING GOES INSIDE THIS CELL, AND BOTH HALVES OF THAT ARE
              // REPAIRS. The PB verifier's F5, quoted: "the fletch cells take `outline:
              // rgb(244,234,208) solid 3px` at outline-offset 0 on a box spanning
              // y=0..38 inside a sticky top:0 header, so the ring's top 3px is drawn at
              // y=-3..0 and is off-viewport... The lapped cell's ring is visible on
              // three sides only."
              //
              // 1 — THE OFFSET. A fletch cell is `alignSelf: stretch`, so its box IS the
              // bar: top 0, bottom 38, inside a header stuck at top 0. An OUTSET ring
              // has nowhere to go — it is drawn above the viewport's own top edge and
              // simply does not exist. Every other cure spends something the ribbon
              // cannot spend: padding the header moves ANCHOR_OFFSET and every in-page
              // anchor in the estate, and a ring layer inside the band would put a
              // focus indicator inside the aria-hidden decoration. A NEGATIVE offset
              // costs nothing and is drawn in full. The label is untouched: its ink runs
              // 14.35..25.25px of the 38px bar and the ring occupies 0..3 and 35..38.
              //
              // 2 — THE COLOUR, and it was failing SC 1.4.11 whether or not you could
              // see the top edge. The house ring is `--sf-focus` #a0762a, a bronze
              // chosen for parchment; on the dark goose vane it measures 2.41:1, under
              // the 3:1 a focus indicator owes. PARCH measures 8.9:1 on the same ground.
              //
              // ⚠️ BOTH ARE SET THROUGH a11y.css's OWN VARIABLES, which is the sanctioned
              // mechanism and not a workaround: that file's rule is "components must NOT
              // override this with `outline: none`; if the design needs a different ring
              // colour, override --sf-focus only". Nothing here suppresses the ring, adds
              // a second one, or touches the global rule — the cell states its ground and
              // the global rule keeps drawing the ring.
              '--sf-focus': PARCH,
              '--sf-focus-ring-offset': `-${FOCUS_RING_PX}px`,
            }
            : {
              // ⚠️⚠️ THE PLAIN REGISTER FLIPPED WHOLESALE IN V4, AND IT IS THE SAME
              // MOVE THE FLETCH LABELS MADE THREE VERSIONS AGO. These labels sit on
              // BARE WOOD, and the wood is now cedar: INK_DEEP measures 1.97:1 on it
              // and BODY 1.36:1, so the ink register is not retunable, it is gone. The
              // shelf joins the journey in the parchment register — resting PARCH_100
              // (5.75:1 on the tab's own lightest ground), active PARCH (6.33:1).
              //
              // ⚠️ AND THE UNDERLINE LEFT THE HOUSE GOLD FAMILY WITH IT. GOLD_TXT is
              // 1.06:1 on cedar — a dark gold on dark wood is the same failure the
              // labels had. The active rule takes GILT, the leaf's own body stop, at
              // 3.75:1: still a BOUNDARY beside an already-legible label, never the
              // thing carrying the state alone, and now the same metal as the wordmark
              // and the quill-line indicator rather than a fourth gold.
              borderBottom: active ? `2px solid ${GILT}` : '2px solid transparent',
              color: active ? PARCH : PARCH_100,
              fontWeight: active ? 700 : 500,
            }),
        }}
      >
        <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      </button>
    );
  };

  const runs = fletchedRuns();
  return (
    // gap:0 — outside the band the divider IS the seam (see NavDivider's width note);
    // inside it there are no seams at all, because the laps are the seams.
    <nav style={{ display: 'flex', gap: 0, alignItems: 'center', alignSelf: 'stretch' }}>
      {runs.map((run, ri) => {
        const nextHead = runs[ri + 1]?.items[0];
        const activeLane = run.items.findIndex((it) => it.id === view);
        return (
          <Fragment key={run.items[0].id}>
            {run.fletched ? (
              <span
                data-testid="nav-fletch-band"
                style={{
                  // `relative` is what the band paint and the two wraps hang off: the
                  // SVG fills this box exactly, and the wraps position OUTSIDE it, on
                  // bare barrel, bracketing the cluster.
                  position: 'relative', display: 'flex', gap: 0,
                  // stretch on BOTH axes of the chain: the cluster fills the bar,
                  // and its fletch cells fill the cluster.
                  alignItems: 'stretch', alignSelf: 'stretch',
                }}
              >
                <ShaftWrap side="lead" />
                <FletchBand id={`fletch-${run.items[0].id}`} activeLane={activeLane} />
                {run.items.map((item) => cell(item, true))}
                <ShaftWrap side="trail" />
              </span>
            ) : run.items.map((item, i) => (
              <Fragment key={item.id}>
                {i > 0 && <NavDivider from={run.items[i - 1].id} to={item.id} />}
                {cell(item, false)}
              </Fragment>
            ))}
            {nextHead && <NavDivider from={run.items[run.items.length - 1].id} to={nextHead.id} />}
          </Fragment>
        );
      })}
    </nav>
  );
}
