import { SlidersHorizontal, X } from 'lucide-react';

import useIsMobile from '../../hooks/useIsMobile.js';
import BottomSheet from '../primitives/BottomSheet.jsx';
import Button from '../primitives/Button.jsx';
import { BORDER, CARD_ALT, FS, GOLD, INK, SP, sans } from '../theme.js';

/**
 * SidebarSection — the shared section header for a gallery filter facet: an
 * uppercase rubric plus an optional active-count badge. Every gallery tab's
 * filter body uses this so the group headers read identically (owner order
 * 2026-07-22 — the Settlements / Maps / Campaigns filter panels must be one design).
 */
export function SidebarSection({ title, count = 0, children }) {
  return (
    <section style={{ display: 'grid', gap: 8 }}>
      <h3 style={{
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        color: INK,
        fontFamily: sans,
        fontSize: FS.xs,
        fontWeight: 950,
        textTransform: 'uppercase',
        letterSpacing: 0,
      }}>
        {title}
        {count > 0 && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 16,
            height: 16,
            padding: '0 5px',
            borderRadius: 999,
            background: GOLD,
            color: INK,
            fontFamily: sans,
            fontSize: FS.xxs,
            fontWeight: 950,
          }}>
            {count}
          </span>
        )}
      </h3>
      {children}
    </section>
  );
}

/**
 * GalleryFilterShell — the shared chrome for every gallery tab's filter facets.
 *
 * Owner order (2026-07-22): the Settlements, Maps, and Campaigns filter panels
 * used to differ (only Settlements had the SlidersHorizontal icon + a bordered
 * aside; Maps / Campaigns were a plain, border-less panel with differently-sized
 * section headers). They now share this one shell: on desktop a bordered CARD_ALT
 * aside with a SlidersHorizontal + "Filters" header and a Clear control; on mobile
 * the SAME facet body behind a single "Filters (N)" BottomSheet trigger. Each tab
 * supplies its own facet body as `children`; the active-count + Clear wiring is
 * shared here.
 *
 * Gallery-chunk home (see galleryMapsFilters.js's closure law): imported ONLY by
 * the gallery-tab sidebars, so this primitive never leaves the gallery chunk and
 * the first-paint byte budget is unaffected.
 *
 * @param {object} props
 * @param {number} [props.activeCount]  count driving the badge + Clear visibility
 * @param {() => void} props.onClear
 * @param {React.ReactNode} props.children  the tab's facet body
 */
export default function GalleryFilterShell({ activeCount = 0, onClear, children }) {
  const isMobile = useIsMobile();

  if (isMobile) {
    // Mobile: one Filters (N) trigger opens the sheet; the facet body + a Clear
    // control live inside it. Button already floors the trigger at 44px.
    return (
      <div style={{ marginBottom: SP.md }}>
        <BottomSheet title="Filters" triggerLabel="Filters" count={activeCount} fullWidthTrigger>
          <div style={{ display: 'grid', gap: SP.lg }}>
            {activeCount > 0 && (
              <Button
                variant="ghost"
                icon={<X size={12} />}
                onClick={onClear}
                aria-label={`Clear all ${activeCount} active filters`}
                style={{ justifySelf: 'start', color: GOLD }}
              >
                Clear
              </Button>
            )}
            {children}
          </div>
        </BottomSheet>
      </div>
    );
  }

  return (
    <aside className="gallery-sidebar-panel" style={{
      display: 'grid',
      gap: SP.lg,
      alignSelf: 'start',
      padding: SP.md,
      border: `1px solid ${BORDER}`,
      background: CARD_ALT,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SlidersHorizontal size={15} color={GOLD} />
        <h2 style={{ margin: 0, color: INK, fontFamily: sans, fontSize: FS.sm, fontWeight: 950 }}>
          Filters
        </h2>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            icon={<X size={12} />}
            onClick={onClear}
            style={{ marginLeft: 'auto', color: GOLD }}
          >
            Clear
          </Button>
        )}
      </div>
      {children}
    </aside>
  );
}
