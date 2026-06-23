/**
 * WorldMapStage.jsx — main body of the world map (sidebar + map / campaign panels).
 *
 * Extracted verbatim from WorldMap.jsx (no logic change). Pure presentational:
 * it renders either a campaign panel (Wizard News / World Pulse) or the
 * settlement palette + map container + overlays + layers panel.
 *
 * Render-optimization (2026-06): the store-derived values this shell needs
 * (mapMode, isDraggingOver, mapReady, imageMode, placements) are now read
 * directly via useStore selectors instead of being prop-drilled. Only
 * parent-owned refs/handlers/state remain as props. The component is wrapped in
 * React.memo so an unrelated parent re-render no longer re-renders the stage.
 * Rendered DOM is unchanged.
 */

import { memo, Suspense, lazy } from 'react';
import { Loader, AlertTriangle, RefreshCw } from 'lucide-react';
import { flag } from '../../lib/flags.js';
import { Funnel, EVENTS } from '../../lib/analytics.js';
import { useStore } from '../../store/index.js';
import { MAP_MODES } from '../../store/mapSlice.js';
import { GOLD, INK, MUTED, SECOND, RED, BORDER, CARD, PARCH, FS, SP, R, swatch, PARCH_100 } from '../theme.js';
import Button from '../primitives/Button.jsx';

const MapOverlay     = lazy(() => import('../MapOverlay.jsx'));
const PlacementDetailCard = lazy(() => import('./PlacementDetailCard.jsx'));
const QuickInspector  = lazy(() => import('./QuickInspector.jsx'));
const LayersPanel     = lazy(() => import('./LayersPanel.jsx'));
const SettlementPalette = lazy(() => import('./SettlementPalette.jsx'));
const WizardNewsPanel = lazy(() => import('./WizardNewsPanel.jsx'));
const WorldPulsePanel = lazy(() => import('./WorldPulsePanel.jsx'));
const PantheonPanel   = lazy(() => import('./PantheonPanel.jsx'));
const MapLegend       = lazy(() => import('./MapLegend.jsx'));

// Cachebuster bumped whenever public/map/* changes so browsers don't serve
// a stale iframe bundle (e.g. old drop handler missing the settlementforge
// path). Bump this when you edit anything under /public/map.
const FMG_URL = '/map/index.html?v=sfdrop12';

function WorldMapStageImpl({
  showingWizardNews,
  showingWorldPulse,
  showingPantheon,
  activeCampaign,
  activeSaves,
  mapContainerRef,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  iframeRef,
  bridgeReady,
  bridgeRef,
  overlayTransformRef,
  onNavigate,
  showLayersPanel,
  setShowLayersPanel,
  mapReloadKey = 0,
  onReloadMap,
  onCreateCampaign,
  onSelectCampaign,
  hasCampaigns = false,
}) {
  // Store-derived values read directly (formerly prop-drilled from WorldMap).
  const placements    = useStore(s => s.mapState.placements);
  const isDraggingOver = useStore(s => s.isDraggingOver);
  const mapMode       = useStore(s => s.mapMode);
  const mapReady      = useStore(s => s.mapReady);
  const mapError      = useStore(s => s.mapError);
  const setMapMode    = useStore(s => s.setMapMode);
  const imageMode     = useStore(s => !!s.mapState.customBackdrop?.imageUrl);
  return (
      showingWizardNews ? (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Suspense fallback={<div style={{ padding: SP.md, color: MUTED, fontSize: FS.sm }}>Loading…</div>}>
            <WizardNewsPanel campaign={activeCampaign} />
          </Suspense>
        </div>
      ) : showingWorldPulse ? (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Suspense fallback={<div style={{ padding: SP.md, color: MUTED, fontSize: FS.sm }}>Loading…</div>}>
            <WorldPulsePanel campaign={activeCampaign} />
          </Suspense>
        </div>
      ) : showingPantheon ? (
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          <Suspense fallback={<div style={{ padding: SP.md, color: MUTED, fontSize: FS.sm }}>Loading…</div>}>
            <PantheonPanel campaign={activeCampaign} />
          </Suspense>
        </div>
      ) : (
      <div style={{ display: 'flex', gap: SP.sm, flex: 1, minHeight: 0 }}>
        {/* Settlement palette — left sidebar. The framed-column shell (the ONE
            elevation each sidebar is allowed) is owned HERE by SidebarShell, the
            SAME owner as the right LayersPanel, so the two flanking sidebars share
            one systematic frame recipe instead of each self-framing with a
            duplicated width/border/radius literal (P5). */}
        <SidebarShell>
          <Suspense fallback={<div style={{ padding: SP.md, color: MUTED, fontSize: FS.sm }}>Loading…</div>}>
            <SettlementPalette
              saves={activeSaves}
              placements={placements}
              activeCampaign={activeCampaign}
              onNavigate={onNavigate}
              onCreateCampaign={onCreateCampaign}
              onSelectCampaign={onSelectCampaign}
              hasCampaigns={hasCampaigns}
            />
          </Suspense>
        </SidebarShell>

        {/* Map container */}
        {/* a11y: passive drag-and-drop target (settlements are dragged from the
            palette); no keyboard-clickable widget semantics apply to the map shell. */}
        {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
        <div
          ref={mapContainerRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            flex: 1,
            position: 'relative',
            background: PARCH,
            border: `2px solid ${isDraggingOver ? GOLD : BORDER}`,
            borderRadius: R.lg,
            overflow: 'hidden',
            minHeight: 0,
          }}
        >
          {/* Custom image backdrop mode skips FMG entirely — MapOverlay renders
              the image + owns pan/zoom. Otherwise the FMG iframe is the bottom plane. */}
          {!imageMode && (
            <iframe
              // Keyed on mapReloadKey so the "Reload map" recovery action drops
              // the dead iframe and mounts a fresh one (P10).
              key={mapReloadKey}
              ref={iframeRef}
              data-tour="map"
              src={FMG_URL}
              title="Fantasy Map"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
                pointerEvents: mapMode === MAP_MODES.ANNOTATE ? 'none' : 'auto',
              }}
            />
          )}
          {(bridgeReady || imageMode) && (
            <Suspense fallback={null}>
              {/* bridgeRef.current is read during render to pass into the overlay.
                  Strictly a react-hooks/refs violation, but the bridge is
                  constructed once during the bridge-init effect and never
                  reassigned for the lifetime of this WorldMap instance. In image
                  mode there is no bridge (the overlay self-drives). */}
              {/* eslint-disable-next-line react-hooks/refs */}
              <MapOverlay bridge={imageMode ? null : bridgeRef.current} transformOut={overlayTransformRef} />
            </Suspense>
          )}
          <Suspense fallback={null}>
            <PlacementDetailCard
              onOpenDetail={(_settlementId) => {
                // SettlementsPanel reads `selectedSettlementId` from the store
                // on mount and opens the matching save in detail view. So we
                // just need to navigate — the id is already in the store from
                // the map click that opened this card.
                if (typeof onNavigate === 'function') onNavigate('settlements');
              }}
            />
          </Suspense>
          {/* Hover peek. Self-gated; renders nothing
              when no hover-id is set or when click-selection wins. */}
          <Suspense fallback={null}>
            <QuickInspector />
          </Suspense>
          {/* UX Phase 5 — persistent collapsible legend (channel/relationship colors,
              war glyphs, impact-magnitude scale). Default-collapsed; bottom-left so it
              never collides with the right-dock Realm Inspector. */}
          <Suspense fallback={null}>
            <MapLegend />
          </Suspense>
          {/* Recovery panel (P10): a failed/timed-out load replaces the
              perpetual loader with a plain-language message + a primary
              "Reload map" CTA and a secondary "Continue without terrain"
              path, so the GM is never stranded on an endless spinner. */}
          {mapError && !imageMode ? (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(247,240,228,0.92)', backdropFilter: 'blur(2px)',
              flexDirection: 'column', gap: SP.sm, padding: SP.lg, textAlign: 'center',
            }}>
              <AlertTriangle size={30} color={RED} />
              <div style={{ fontSize: FS.md, fontWeight: 800, color: INK }}>
                {String(mapError)}
              </div>
              <div style={{ fontSize: FS.sm, color: SECOND, maxWidth: 360, lineHeight: 1.4 }}>
                The terrain engine couldn't start. Reload it, or keep working with
                annotations on a blank canvas.
              </div>
              <div style={{ display: 'flex', gap: SP.sm, marginTop: SP.xs }}>
                <Button variant="primary" size="md" icon={<RefreshCw size={14} />} onClick={onReloadMap}>
                  Reload map
                </Button>
                <Button variant="ghost" size="md" onClick={() => setMapMode(MAP_MODES.ANNOTATE)}>
                  Continue without terrain
                </Button>
              </div>
            </div>
          ) : !mapReady && !imageMode && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(247,240,228,0.7)', backdropFilter: 'blur(2px)',
              flexDirection: 'column', gap: SP.sm, pointerEvents: 'none',
            }}>
              <Loader size={32} color={GOLD} className="sf-spin" />
              <div style={{ fontSize: FS.md, fontWeight: 700, color: SECOND }}>
                Summoning the world…
              </div>
            </div>
          )}
          {isDraggingOver && mapMode !== MAP_MODES.ANNOTATE && (
            <>
              <div style={{
                position: 'absolute', inset: 12, border: `3px dashed ${GOLD}`,
                borderRadius: R.lg, background: 'rgba(160,118,42,0.06)',
                pointerEvents: 'none',
              }} />
              {/* Drop preview tooltip. Shows during drag with
                  the data the user needs to decide if this is a sensible
                  placement: terrain hint + trade-route candidacy +
                  proximity to existing placements. We render a static
                  hint card (top-right) under the flag — a future
                  iteration can hover-follow the cursor with live FMG
                  cell data. */}
              {flag('mapDropPreview') && (
                // a11y: presentational hint card (pointerEvents:'none'); the
                // onMouseEnter is fire-and-forget analytics, not a user control.
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  onMouseEnter={() => {
                    Funnel.track(EVENTS.MAP_DROP_PREVIEW_SHOWN);
                  }}
                  style={{
                    position: 'absolute', top: 24, right: 24,
                    padding: '8px 12px', background: INK,
                    color: PARCH_100,
                    border: `1px solid ${GOLD}`, borderRadius: R.sm,
                    fontSize: FS.xs, lineHeight: 1.45,
                    boxShadow: '0 12px 32px rgba(0,0,0,0.40)',
                    pointerEvents: 'none', maxWidth: 220,
                  }}
                >
                  <div style={{
                    fontWeight: 700, color: GOLD, fontSize: FS.sm,
                    marginBottom: 4,
                  }}>
                    Drop to place
                  </div>
                  <div style={{ color: swatch['#C8B098'] }}>
                    Settlements land at the nearest valid cell. Trade-route
                    candidates auto-link to neighbours within 2 days.
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Layers panel — right sidebar (toggleable). Same SidebarShell owner as
            the left palette so both sidebars carry one frame, not two. */}
        {showLayersPanel && (
          <SidebarShell>
            <Suspense fallback={null}>
              <LayersPanel onClose={() => setShowLayersPanel(false)} />
            </Suspense>
          </SidebarShell>
        )}
      </div>
      )
  );
}

// The ONE framed-column shell for both flanking map sidebars (P5): width + the
// single allowed border/radius/overflow live here so the palette and the layers
// panel are pure content and the frame recipe can't drift between two owners.
function SidebarShell({ children }) {
  return (
    <div style={{
      width: 240, minHeight: 0, display: 'flex', flexDirection: 'column',
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: R.lg,
      overflow: 'hidden',
    }}>
      {children}
    </div>
  );
}

/**
 * Memoized so an unrelated parent re-render (e.g. toast/inspector state churn in
 * WorldMap) doesn't re-render this shell. The remaining props are stable refs,
 * parent-owned state, and callbacks the parent stabilizes with useCallback.
 */
export const WorldMapStage = memo(WorldMapStageImpl);
