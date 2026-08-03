/**
 * NavRibbon.jsx — the desktop header's primary destination ribbon.
 *
 * THE HALF-SEEN WAR ARROW (owner directive, 2026-08-03 evening; RIBBON V3, from a
 * reference photo plus two live clarifications). The bar is HALF OF AN ARROW IN
 * PROFILE. The arrow lies along the top screen edge and the viewport shows this
 * side's half: the whole header is the SHAFT'S VISIBLE HALF — one honey-tan barrel
 * running the full width, wordmark included, shaded as a cylinder (App.jsx paints
 * it; theme.js SHAFT* owns it) — and Create · Library · Realm are the NEAR SIDE'S
 * THREE FLETCHES rooted on that barrel, quill bases at the shaft line, vanes
 * sweeping toward Realm. Two red-brown silk wraps frame the cluster. ONE object.
 *
 * WHAT CHANGED FROM V2, and it is more than a repaint. V2 drew three GILT-EDGED
 * PARALLELOGRAMS on a cream plank: a band with one silhouette, a gold hairline
 * around it, a gold bloom, and a shared clip. All of that is retired. The vanes are
 * now shield-cut goose primaries with their own paths, their own gradients and their
 * own shadows (GooseFletch.jsx), the plank became a modelled cylinder, and the
 * fletching is bound down by whipping (ShaftWrap.jsx) instead of edged in gold.
 * The owner also corrected the SPECIES — turkey → grey goose, the English war-arrow
 * feather — which is why the vane is cooler, more uniform and far more quietly
 * marked than V2's; that quiet is what lets three labels ride three feathers.
 *
 * ⚠️ THE BALANCE LAW SURVIVES THE REPAINT (V2 directive §4, still binding). Several
 * emphasis devices stack on the same three cells — the vane's dark fill against the
 * wood, the comb texture, the sheen bands, the shadow, and the label weight. Each is
 * deliberately dialled to about HALF what it would be carrying the hierarchy alone:
 * the barbs are a hairline at a ~6.6% tonal drop, the sheen is blurred, the weight is
 * 600 rather than 700. V3 actually SPENT one device to buy the goose reading — the
 * gilt hairline is gone entirely — and did not replace it with a louder one. If a
 * future edit strengthens one of these, it must weaken another.
 *
 * THE BAND'S MEMBERSHIP IS DERIVED, NOT LISTED — unchanged from V1, and the one
 * piece of this file that has survived every repaint. `fletchedRuns` groups NAV by
 * the flow predicate NavFlowArrow owns (routes.js NAV_FLOW): a cell is fletched when
 * it feeds, or is fed by, its rendered neighbour. The band is therefore the maximal
 * declared run, and a future nav insertion or reorder re-files the band
 * automatically instead of leaving a hardcoded trio pointing at the wrong tabs. The
 * same derivation answers the seam marks (NavDivider.dividerKind), so the band and
 * its internal seams cannot disagree about where the flow is.
 *
 * ⚠️⚠️ THE OVERHANG IS PAINT, NEVER LAYOUT. The vanes' lower edges peek
 * FLETCH.overhang px below the ribbon's bottom border. The header is sticky and
 * theme.js derives ANCHOR_OFFSET from CHROME.headerDesktop, so every About / guide /
 * Compendium / dossier in-page anchor in the estate lands on a number this bar must
 * not move. GooseFletch buys the peek with `overflow: visible` on a zero-inset
 * absolute box and geometry drawn past the bottom — costing no height, no margin, no
 * border and no offset. tests/components/navFletching.test.jsx pins both halves: the
 * mechanism, and the ABSENCE of any box that spends the overhang. There is no TOP
 * overhang: the header is sticky at top:0 and it would clip.
 *
 * ⚠️ MEASURED, NOT ASSUMED — CHROME.headerDesktop IS THE LIVE HEIGHT. V1 recorded
 * the constant at 60 while the bar measured 124 and left it alone. V2 found the
 * mechanism: NavDivider's decorative SVG was in flow asking for `height="100%"`
 * against an indefinite parent, fell back to its own viewBox height of 100, and THAT
 * set the header's flex line. The SVG is out of flow now, the header spends
 * CHROME.headerDesktop as its own min-height, and the bar measures exactly 48 — so
 * ANCHOR_OFFSET's derivation is true rather than merely tidy. Do not reintroduce an
 * in-flow percentage-height decoration.
 *
 * ⚠️ NOTHING CLIPPED IS EVER FOCUSABLE. `clip-path` clips an element's whole
 * rendering INCLUDING its outline, and a11y.css draws the global focus ring outside
 * the border box, so clipping a cell's own control would silently swallow the
 * keyboard ring while leaving every visual test green. All clipping lives inside
 * GooseFletch's aria-hidden SVG; no control and no ancestor of one is clipped, and
 * no ancestor may introduce `overflow: hidden` either. The pin asserts the chain.
 *
 * ACTIVE STATE. The old affordance was a gold underline at label height; it has now
 * been translated three times and never replaced. The active fletch LIGHTENS — its
 * sheen bands brighten to FLETCH_SHEEN_LIFT — brightens its label to PARCH, and
 * takes the gold stroked along the vane's OWN lower silhouette, so the gold follows
 * the rounded war-fletch back instead of drawing a rectangle across it. That is
 * three visual channels plus aria-current="page", none of them colour alone. Weight
 * is deliberately NOT among them: V2 fixed every fletch label at 600 under the
 * BALANCE LAW and V3 keeps it there. The plain reference tabs keep the underline
 * register, re-inked for the honey barrel.
 *
 * THE FLOW MARK MOVED, IT DID NOT DIE. NavFlowArrow no longer renders here; it still
 * draws on the MOBILE bottom nav, where cells have no seam to carry a divider. Both
 * surfaces stay pinned: tests/components/navFlowArrows.test.jsx keeps the mobile arm
 * as its live half, tests/components/navDividers.test.jsx censuses this one.
 *
 * STRETCH CHAIN. `alignSelf: stretch` here (and on the header cluster that holds it)
 * is what lets the fletches and the wraps span the bar top-to-bottom;
 * `alignItems: center` keeps the PLAIN cells at their natural height so their gold
 * underline stays exactly where it has always sat, while the band's own
 * `alignItems: stretch` fills the fletches to bar height — which is what makes the
 * three read as one fletching rather than three chips.
 */
import { Fragment } from 'react';
import { NAV } from '../../lib/routes.js';
import NavDivider, { dividerKind } from './NavDivider.jsx';
import { flowsInto } from './NavFlowArrow.jsx';
import GooseFletch from './GooseFletch.jsx';
import ShaftWrap from './ShaftWrap.jsx';
import { BODY, GOLD_TXT, INK_DEEP, PARCH, PARCH_100, SP, FS, sans } from '../theme.js';

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
  /** One nav cell — a fletch on the shaft, or a plain reference tab. */
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
          // `relative` is the vane's positioning context; z-index lifts the label
          // above the fletch that paints behind it.
          position: 'relative', zIndex: 1,
          ...(fletchedCell
            // A fletch label rides the DARK GOOSE VANE, so it stays in the pale
            // register even though the shaft under the fletching is light wood.
            // Weight 600, never 700: under the BALANCE LAW weight separates the
            // fletching from the shelf (600 vs the reference tabs' 500) and says
            // nothing about active-ness, which the brightened sheen, the gold edge,
            // the brighter label and aria-current already carry between them.
            ? { alignSelf: 'stretch', color: active ? PARCH : PARCH_100, fontWeight: 600 }
            : {
              // The plain register, RE-INKED for the honey barrel. These labels sit
              // on bare wood, and the wood went from cream to honey-tan — GOLD_TXT
              // was the V2 active tone at 5.75:1 on cream and is 3.38:1 here, which
              // fails AA as text. So the label takes INK_DEEP (7.06:1) and GOLD_TXT
              // stays only as the UNDERLINE, where 3.38:1 clears SC 1.4.11's 3:1
              // floor for a boundary sitting beside an already-legible ink label.
              borderBottom: active ? `2px solid ${GOLD_TXT}` : '2px solid transparent',
              color: active ? INK_DEEP : BODY,
              fontWeight: active ? 700 : 500,
            }),
        }}
      >
        {fletchedCell && <GooseFletch id={id} active={active} />}
        <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
      </button>
    );
  };

  /** A run's cells with the derived seam mark between each adjacent pair. */
  const withSeams = (items, fletchedRun) => items.map((item, i) => {
    const next = items[i + 1];
    return (
      <Fragment key={item.id}>
        {cell(item, fletchedRun)}
        {next && <NavDivider kind={dividerKind(item.id, next.id)} from={item.id} to={next.id} />}
      </Fragment>
    );
  });

  const runs = fletchedRuns();
  return (
    // gap:0 — the divider IS the seam (see NavDivider's width/clearance note).
    <nav style={{ display: 'flex', gap: 0, alignItems: 'center', alignSelf: 'stretch' }}>
      {runs.map((run, ri) => {
        const tail = run.items[run.items.length - 1];
        const nextHead = runs[ri + 1]?.items[0];
        const body = withSeams(run.items, run.fletched);
        return (
          <Fragment key={run.items[0].id}>
            {run.fletched ? (
              <span
                data-testid="nav-fletch-band"
                style={{
                  // `relative` is what the two wraps hang off: they position
                  // OUTSIDE this box, on bare barrel, framing the cluster.
                  position: 'relative', display: 'flex', gap: 0,
                  // stretch on BOTH axes of the chain: the cluster fills the bar,
                  // and its fletches fill the cluster.
                  alignItems: 'stretch', alignSelf: 'stretch',
                }}
              >
                <ShaftWrap side="lead" />
                {body}
                <ShaftWrap side="trail" />
              </span>
            ) : body}
            {nextHead && (
              <NavDivider kind={dividerKind(tail.id, nextHead.id)} from={tail.id} to={nextHead.id} />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
