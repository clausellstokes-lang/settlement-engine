/**
 * NavRibbon.jsx — the desktop header's primary destination ribbon (LD-2).
 *
 * Lifted VERBATIM out of App.jsx when LD-2 gave the ribbon its seam marks: the
 * header sits at a frozen size ceiling (scripts/.size-baseline.json), so new
 * chrome logic lands as a leaf rather than growing the shell. The cell markup,
 * the active-underline register and the click contract are unchanged by the
 * move — only the seam between cells is new.
 *
 * THE SEAM. Every adjacent pair of cells carries a NavDivider whose kind is
 * DERIVED from lib/routes.js (NAV order + NAV_FLOW), so the Create → Library →
 * Realm journey draws chevrons and every other boundary draws a plain rule
 * without any surface restating the boundary list. The trailing cell carries no
 * divider — the Sign In region beyond it is a different register and the order
 * puts no mark there.
 *
 * THE FLOW MARK MOVED, IT DID NOT DIE. NavFlowArrow no longer renders here (the
 * chevron divider says the same thing at bar height), but it still draws on the
 * MOBILE bottom nav, where cells have no seam to carry a divider. Both surfaces
 * stay pinned: tests/components/navFlowArrows.test.jsx keeps the mobile arm as
 * its live half, tests/components/navDividers.test.jsx censuses this one.
 *
 * STRETCH CHAIN. `alignSelf: stretch` here (and on the header cluster that
 * holds it) is what lets a divider span the bar top-to-bottom; `alignItems:
 * center` keeps the CELLS at their natural height so the active tab's gold
 * underline stays exactly where it has always sat.
 */
import { Fragment } from 'react';
import { NAV } from '../../lib/routes.js';
import NavDivider, { dividerKind } from './NavDivider.jsx';
import { GOLD, PARCH_100, SP, FS, sans } from '../theme.js';

export default function NavRibbon({ view, onNavClick }) {
  return (
    // gap:0 — the divider IS the seam (see NavDivider's width/clearance note).
    <nav style={{ display: 'flex', gap: 0, alignItems: 'center', alignSelf: 'stretch' }}>
      {NAV.map(({ id, label }, i) => {
        const active = view === id;
        const next = NAV[i + 1]?.id;
        return (
          <Fragment key={id}>
            <button
              type="button"
              onClick={() => onNavClick(id)}
              aria-current={active ? 'page' : undefined}
              style={{
                // Active tab is a wayfinding marker, not a CTA: a gold
                // underline + weight, not a filled cartouche, so the Sign
                // In chip stays the region's single filled-gold focal point.
                display: 'flex', alignItems: 'center', gap: SP.xs,
                padding: `${SP.sm}px ${SP.lg}px`,
                background: 'transparent',
                border: 'none',
                borderBottom: active ? `2px solid ${GOLD}` : '2px solid transparent',
                borderRadius: 0, cursor: 'pointer', position: 'relative',
                color: active ? GOLD : PARCH_100,
                fontSize: FS.sm, fontWeight: active ? 700 : 500,
                fontFamily: sans,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
            {next && <NavDivider kind={dividerKind(id, next)} from={id} to={next} />}
          </Fragment>
        );
      })}
    </nav>
  );
}
