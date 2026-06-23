/**
 * WorldMapToolbar.jsx — top toolbar row for the world map.
 *
 * Structure (UI/UX overhaul): the bar is grouped into spacing-separated
 * clusters rather than one undifferentiated wall of equal pills:
 *   [Mode]  ·  [Campaign + Save state]  · · ·  [Campaign clock: interval +
 *   Advance Realm + Undo]  ·  [View utilities + More overflow + Inspector]
 *
 * Advance Realm is the SINGLE gold primary (the action that makes the
 * simulation the hero); Save is demoted to a neutral secondary because the
 * AutoSaveChip already reassures persistence. Rare/expert actions (Rules,
 * presets, custom image, island template, Regenerate, Clear map) live behind a
 * "More" overflow so the everyday actions win the squint test. The toolbar
 * Pulse / News / Pantheon openers were removed: they duplicated the Realm
 * Inspector tabs, so navigation now flows through the single Inspector toggle.
 *
 * Render-optimization (2026-06): store-derived values (mapMode/setMapMode,
 * mapLoading, mapError, imageMode) are read directly via useStore selectors;
 * the component is wrapped in React.memo.
 */

import { memo, Suspense, lazy, useState, useRef, useEffect } from 'react';
import {
  FolderOpen, Save, Trash2, RefreshCw, Layers, Loader, Map as MapIcon, Globe,
  SlidersHorizontal, Zap, HelpCircle, Image as ImageIcon, X as XIcon, Share2, Undo2,
  PanelRight, MoreHorizontal,
} from 'lucide-react';
import { useStore } from '../../store/index.js';
import { GOLD, GOLD_SOFT, GOLD_TXT, INK, MUTED, BODY, SECOND, AMBER, RED, BORDER, BORDER_STRONG, CARD, CARD_ALT, ELEV, PARCH_100, sans, FS, SP, R } from '../theme.js';
import Button from '../primitives/Button.jsx';
import { ModeSwitch } from './ModeSwitch.jsx';
import { IconButton } from './IconButton.jsx';

const AutoSaveChip = lazy(() => import('./AutoSaveChip.jsx'));

/** A spacing-only group separator. Replaces the 1px hairline dividers — grouping
 *  is now carried by whitespace (P5), and `flex:1` spacers push the clock and
 *  utility clusters to a stable right edge. */
function Spacer({ grow = false }) {
  return <div style={{ flex: grow ? 1 : '0 0 auto', width: grow ? undefined : SP.md }} />;
}

/** Inline eyebrow that front-loads a control's meaning (e.g. "Advance by" on the
 *  interval select). Keyword-first, uppercase, muted (P6). */
function ClockLabel({ children }) {
  return (
    <span style={{
      fontSize: FS.xs, fontWeight: 700, color: SECOND,
      textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

/** Section heading inside the "More" overflow — chunks the heterogeneous items
 *  into scannable groups (P6) and provides the spacing that separates the
 *  destructive block from benign config (P8). */
function MenuHeader({ children }) {
  return (
    <span style={{
      marginTop: SP.xs, paddingTop: SP.xs,
      fontSize: FS.xxs, fontWeight: 800, color: BODY,
      textTransform: 'uppercase', letterSpacing: '0.07em',
      fontFamily: sans,
    }}>
      {children}
    </span>
  );
}

/** "More" overflow — a lightweight popover holding the rare/expert actions so
 *  the main bar stays scannable. Self-contained: a toggle button + an
 *  absolutely-positioned panel + an outside-click dismiss. */
function MoreMenu({ children }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onDoc(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={wrapRef} style={{ position: 'relative', display: 'inline-flex' }}>
      <IconButton
        onClick={() => setOpen(v => !v)}
        title="More map tools"
        active={open}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreHorizontal size={13} /> More
      </IconButton>
      {open && (
        // a11y: presentational popover whose onClick only DISMISSES the menu
        // after a contained Button (a real focusable control) is activated; it
        // adds no interactive behavior of its own, so no role/key handler.
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
        <div
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 30,
            display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: SP.xs,
            minWidth: 200, padding: SP.sm,
            background: CARD_ALT, border: `1px solid ${BORDER_STRONG}`, borderRadius: R.lg,
            boxShadow: ELEV[2],
          }}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </span>
  );
}

function WorldMapToolbarImpl({
  canManageCampaigns,
  activeCampaign,
  activeCampaignId,
  handleSelectCampaign,
  activeCampaigns,
  handleSaveMapToCampaign,
  handleClearMapFromCampaign,
  savingMap,
  setShowSimulationRules,
  showSimulationRules,
  worldPulseInterval,
  setWorldPulseInterval,
  handleAdvanceRealm,
  worldPulseBusy,
  canUndoPulse,
  handleUndoRealm,
  setShowLayersPanel,
  showLayersPanel,
  setTourOpen,
  handleClearImage,
  handleImportImage,
  handleShareMap,
  sharingMap,
  mapTemplates,
  currentTemplate,
  handleTemplateChange,
  handleFit,
  handleRegenerate,
  inspectorOpen,
  onToggleInspector,
  unreviewedCount = 0,
  activePresetId,
  handleApplyPreset,
}) {
  // Store-derived values read directly (formerly prop-drilled from WorldMap).
  const mapMode    = useStore(s => s.mapMode);
  const setMapMode = useStore(s => s.setMapMode);
  const mapLoading = useStore(s => s.mapLoading);
  const mapError   = useStore(s => s.mapError);
  const imageMode  = useStore(s => !!s.mapState.customBackdrop?.imageUrl);

  const campaignActive = canManageCampaigns && activeCampaignId;

  return (
      // No border / card fill of its own: WorldMap wraps this row + the active
      // contextual row in ONE shared bordered card so the chrome reads as a
      // single toolbar surface, not stacked boxes (P5 — flatten to one
      // elevation). This row only owns its internal flex + padding.
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
        padding: `${SP.sm}px ${SP.md}px`,
      }}>
        {/* ── Group 1 · Mode ───────────────────────────────────────────── */}
        <span data-tour="mode" style={{ display: 'inline-flex' }}>
          <ModeSwitch mapMode={mapMode} setMapMode={setMapMode} imageMode={imageMode} />
        </span>

        {/* ── Group 2 · Campaign + save state ──────────────────────────── */}
        {canManageCampaigns && (
          <>
            <Spacer />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs, flexWrap: 'wrap' }}>
              <FolderOpen size={14} color={activeCampaign ? GOLD : SECOND} />
              {/* First-click discipline (P8): with no campaign chosen, the map has
                  no primary task yet — placing settlements and Advance Realm are
                  both gated on it. So the EMPTY picker is promoted to the bar's
                  primary cue (gold ring + soft-gold fill + a one-line scent),
                  and Advance Realm doesn't render until a campaign is active, so
                  the two states never show two golds at once. */}
              <select
                data-tour="campaign"
                aria-label="Active campaign"
                value={activeCampaignId || ''}
                onChange={e => handleSelectCampaign(e.target.value || null)}
                style={{
                  minHeight: 40,
                  padding: '5px 10px',
                  border: `1px solid ${activeCampaignId ? BORDER : GOLD}`,
                  borderRadius: R.sm,
                  background: activeCampaignId ? CARD : GOLD_SOFT,
                  fontSize: FS.sm, fontFamily: sans,
                  color: activeCampaignId ? INK : GOLD_TXT,
                  fontWeight: activeCampaignId ? 400 : 700,
                  cursor: 'pointer', minWidth: 180,
                }}
              >
                {!activeCampaignId && <option value="">Choose a campaign to begin</option>}
                {activeCampaignId && <option value="">No campaign</option>}
                {activeCampaigns.map(c => (
                  <option key={c.id} value={c.id}>
                    {/* Self-describing "deployed map" cue (P2): a lone middot read
                        as a typo; the word names the causal state instead. */}
                    {c.name}{c.mapState ? ' (mapped)' : ''}
                    {c.settlementIds?.length ? ` (${c.settlementIds.length})` : ''}
                  </option>
                ))}
              </select>
              {activeCampaignId && (
                <>
                  {/* Save demoted to neutral secondary — the AutoSaveChip carries
                      reassurance, so Save no longer competes with Advance Realm. */}
                  <IconButton data-tour="save" onClick={handleSaveMapToCampaign} title="Save map to campaign" disabled={savingMap}>
                    <Save size={13} /> Save
                  </IconButton>
                  <Suspense fallback={null}>
                    <AutoSaveChip saving={savingMap} />
                  </Suspense>
                </>
              )}
            </div>
          </>
        )}

        {/* ── Group 3 · Campaign clock (right-anchored) ────────────────── */}
        {campaignActive && (
          <>
            <Spacer grow />
            <div data-tour="pulse" style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs, flexWrap: 'nowrap' }}>
              {/* Front-loaded interval label (P6): the bare Week/Month/Season/Year
                  was an orphan noun beside Advance Realm with the "advance-by"
                  meaning buried in a title. The inline eyebrow names the unit so
                  the cluster scans as one phrase. */}
              <ClockLabel>Advance by</ClockLabel>
              <select
                value={worldPulseInterval}
                onChange={e => setWorldPulseInterval(e.target.value)}
                title="Realm advancement interval"
                aria-label="Realm advancement interval"
                style={{
                  minHeight: 40,
                  padding: '5px 9px',
                  border: `1px solid ${BORDER}`, borderRadius: R.sm,
                  background: CARD, fontSize: FS.xs, fontFamily: sans, color: INK,
                  cursor: 'pointer',
                }}
              >
                <option value="one_week">Week</option>
                <option value="one_month">Month</option>
                <option value="one_season">Season</option>
                <option value="one_year">Year</option>
              </select>
              <IconButton
                onClick={handleAdvanceRealm}
                title="Advance realm simulation"
                primary
                disabled={worldPulseBusy}
              >
                {/* Larger icon than the 13px utility glyphs — the focal CTA earns a
                    second emphasis channel (size) beyond its gold fill (P4). */}
                <Zap size={16} /> {worldPulseBusy ? 'Advancing' : 'Advance Realm'}
              </IconButton>
              {canUndoPulse && (
                <IconButton
                  onClick={handleUndoRealm}
                  title="Undo the last realm advance. Restores the pre-pulse world and every settlement. This undo is available for the current session only. The advance cannot be undone after the page reloads."
                  disabled={worldPulseBusy}
                >
                  <Undo2 size={13} /> Undo Advance
                </IconButton>
              )}
            </div>
          </>
        )}

        {/* ── Group 4 · View utilities + overflow + Inspector ──────────── */}
        <>
            <Spacer grow={!campaignActive} />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: SP.xs, flexWrap: 'nowrap' }}>
              <IconButton
                data-tour="layers"
                onClick={() => setShowLayersPanel(v => !v)}
                title="Toggle layer visibility"
                active={showLayersPanel}
              >
                <Layers size={13} /> Layers
              </IconButton>
              <IconButton onClick={handleFit} title="Fit entire map in view">
                <MapIcon size={13} /> Fit
              </IconButton>
              <IconButton
                data-tour="help"
                onClick={() => setTourOpen(true)}
                title="Guided tour of the world map"
              >
                <HelpCircle size={13} /> Help
              </IconButton>

              {/* Overflow — rare / expert actions. Keeps the main bar to the
                  handful of everyday controls. */}
              {/* The overflow mixes three unlike action classes; keyword headers
                  chunk them and a gapped, danger-tinted block isolates the two
                  world-altering items so a preset chip never reads as a peer of
                  Clear Map (P6 scan / P8 destructive small + separated). */}
              <MoreMenu>
                {campaignActive && (
                  <>
                    <MenuHeader>Simulation</MenuHeader>
                    <IconButton
                      onClick={() => setShowSimulationRules(true)}
                      title="Simulation rules"
                      active={showSimulationRules}
                      aria-pressed={showSimulationRules}
                    >
                      <SlidersHorizontal size={13} /> Rules
                    </IconButton>
                    {/* Preset chips — one-click Quiet / Realistic / Dramatic. */}
                    {typeof handleApplyPreset === 'function' && (
                      [
                        ['quiet_local', 'Quiet'],
                        ['realistic_regional', 'Realistic'],
                        ['dramatic_campaign', 'Dramatic'],
                      ].map(([id, label]) => {
                        const active = activePresetId === id;
                        return (
                          <IconButton
                            key={id}
                            onClick={() => handleApplyPreset(id)}
                            aria-pressed={active}
                            active={active}
                            title={`Apply the ${label} simulation preset`}
                          >
                            {label}
                          </IconButton>
                        );
                      })
                    )}
                  </>
                )}

                {campaignActive && (
                  <>
                    <MenuHeader>Map &amp; sharing</MenuHeader>
                    {/* Custom map image (premium + active campaign). */}
                    {imageMode ? (
                      <IconButton onClick={handleClearImage} title="Revert to generated terrain">
                        <XIcon size={13} /> Clear Image
                      </IconButton>
                    ) : (
                      <IconButton onClick={handleImportImage} title="Import a custom image to use as the map">
                        <ImageIcon size={13} /> Import Image
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleShareMap('map')} disabled={sharingMap} title="Share this map to the gallery as a reusable blank canvas">
                      <Share2 size={13} /> {sharingMap ? 'Sharing…' : 'Share Map'}
                    </IconButton>
                    {(activeCampaign?.settlementIds?.length > 0) && (
                      <IconButton onClick={() => handleShareMap('map_with_campaign')} disabled={sharingMap} title="Share this map WITH its settlements (public-safe dossiers)">
                        <Share2 size={13} /> Share + Settlements
                      </IconButton>
                    )}
                  </>
                )}

                {/* World generation + destructive actions — separated by a gap and
                    rendered last so the two items that wipe work sit apart from
                    the benign config above. */}
                {((!imageMode) || (campaignActive && activeCampaign?.mapState)) && (
                  <>
                    <MenuHeader>World</MenuHeader>
                    {/* Island shape picker — terrain generation, hidden in image mode */}
                    {!imageMode && mapTemplates.length > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        <Globe size={14} color={MUTED} />
                        <select
                          value={currentTemplate}
                          onChange={e => handleTemplateChange(e.target.value)}
                          title="Island shape for next regeneration"
                          aria-label="Island shape for next regeneration"
                          style={{
                            flex: 1,
                            minHeight: 40,
                            padding: '5px 10px',
                            border: `1px solid ${BORDER}`, borderRadius: R.sm,
                            background: CARD, fontSize: FS.xs, fontFamily: sans, color: INK,
                            cursor: 'pointer',
                          }}
                        >
                          <option value="">Random island</option>
                          {mapTemplates.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </select>
                      </span>
                    )}
                    {/* Destructive — danger variant + spacing so they never read
                        as peers of the config chips above (P8). */}
                    {!imageMode && (
                      <Button variant="danger" size="sm" onClick={handleRegenerate} icon={<RefreshCw size={13} />} title="Regenerate a new world">
                        Regenerate
                      </Button>
                    )}
                    {campaignActive && activeCampaign?.mapState && (
                      <Button variant="danger" size="sm" onClick={handleClearMapFromCampaign} icon={<Trash2 size={13} />} title="Clear campaign map">
                        Clear Map
                      </Button>
                    )}
                  </>
                )}
              </MoreMenu>

            </div>

            {/* Realm Inspector toggle — the single gateway to the living-world
                payoff (Pulse / War / Pantheon / Chronicle live as its tabs).
                Isolated from the view-utility trio by a deliberate wide gap so
                it reads as its own tier-2 affordance (P4/P6), not a peer of
                Layers / Fit / Help. */}
            {typeof onToggleInspector === 'function' && (
              <>
                <div style={{ width: SP.sm }} />
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  <IconButton
                    data-tour="inspector"
                    onClick={onToggleInspector}
                    title={unreviewedCount > 0
                      ? `Toggle the Realm Inspector. ${unreviewedCount} pulse proposal${unreviewedCount === 1 ? '' : 's'} awaiting review`
                      : 'Toggle the Realm Inspector'}
                    // Always tier-2 (secondary), with the inset shadow added only
                    // while open — so it reads as its own affordance above the
                    // ghost Layers/Fit/Help trio (P4) and ON-state still carries
                    // in two channels (shadow + aria-pressed).
                    tier2
                    active={inspectorOpen}
                    aria-pressed={inspectorOpen}
                  >
                    <PanelRight size={13} /> Inspector
                  </IconButton>
                  {/* Persistent unreviewed-pulse signal (P3): the proposal count
                      is the differentiator — the living world MOVED — and it must
                      outlive the 2.6s toast. Sourced from the durable
                      worldState.proposals(status:pending), it clears as the GM
                      resolves them in the Inspector. Two channels: amber dot +
                      digit. aria-hidden — the count is spoken via the button title. */}
                  {unreviewedCount > 0 && (
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        minWidth: 16, height: 16, padding: '0 4px',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: AMBER, color: PARCH_100,
                        borderRadius: 8, fontSize: FS.xxs, fontWeight: 800,
                        fontFamily: sans, lineHeight: 1,
                        boxShadow: ELEV[1],
                      }}
                    >
                      {unreviewedCount > 9 ? '9+' : unreviewedCount}
                    </span>
                  )}
                </span>
              </>
            )}
        </>

        {/* Status line */}
        {mapLoading && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: BODY, fontSize: FS.xs }}>
            <Loader size={12} className="sf-spin" /> Loading…
          </span>
        )}
        {/* Error text routes through the danger RED token (6.6:1 on CARD) so it
            matches every other error surface with comfortable AA headroom,
            instead of the marginal one-off #C54A4A (4.57:1) (P7). */}
        {mapError && (
          <span style={{ color: RED, fontSize: FS.xs, fontWeight: 700 }}>
            {String(mapError)}
          </span>
        )}
      </div>
  );
}

/**
 * Memoized so an unrelated parent re-render (e.g. toast/drag state churn in
 * WorldMap) doesn't re-render this shell. The remaining props are either
 * parent-owned state or callbacks the parent stabilizes with useCallback.
 */
export const WorldMapToolbar = memo(WorldMapToolbarImpl);
