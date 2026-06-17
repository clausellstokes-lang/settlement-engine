/**
 * WorldMapToolbar.jsx — top toolbar row for the world map.
 *
 * Extracted verbatim from WorldMap.jsx (no logic change). Pure presentational:
 * mode switcher + campaign controls + utility buttons + status line. All state,
 * handlers, and refs live in the parent WorldMap and are passed in as props.
 */

import { Suspense, lazy } from 'react';
import {
  FolderOpen, Save, Trash2, RefreshCw, Layers, Loader, Map as MapIcon, Globe,
  Newspaper, SlidersHorizontal, Zap, HelpCircle, Image as ImageIcon, X as XIcon, Share2, Undo2,
} from 'lucide-react';
import { GOLD, GOLD_BG, INK, MUTED, BORDER, BORDER2, CARD, sans, FS, SP, R, swatch } from '../theme.js';
import { ModeSwitch } from './ModeSwitch.jsx';
import { IconButton } from './IconButton.jsx';

const AutoSaveChip = lazy(() => import('./AutoSaveChip.jsx'));

export function WorldMapToolbar({
  showingCampaignPanel,
  showingWizardNews,
  mapMode,
  setMapMode,
  imageMode,
  canManageCampaigns,
  activeCampaign,
  activeCampaignId,
  handleSelectCampaign,
  activeCampaigns,
  handleSaveMapToCampaign,
  handleClearMapFromCampaign,
  campaignWorkspace,
  setCampaignWorkspace,
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
  mapLoading,
  mapError,
}) {
  return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: SP.sm, flexWrap: 'wrap',
        padding: `${SP.sm}px ${SP.md}px`,
        background: CARD, borderRadius: R.lg, border: `1px solid ${BORDER}`,
      }}>
        {/* Mode switcher */}
        {!showingCampaignPanel ? (
          <span data-tour="mode" style={{ display: 'inline-flex' }}>
            <ModeSwitch mapMode={mapMode} setMapMode={setMapMode} imageMode={imageMode} />
          </span>
        ) : showingWizardNews ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            border: `1px solid ${BORDER}`,
            borderRadius: R.sm,
            background: GOLD_BG,
            color: GOLD,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 800,
          }}>
            <Newspaper size={13} />
            Wizard News
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 10px',
            border: `1px solid ${BORDER}`,
            borderRadius: R.sm,
            background: GOLD_BG,
            color: GOLD,
            fontFamily: sans,
            fontSize: FS.sm,
            fontWeight: 800,
          }}>
            <Zap size={13} />
            World Pulse
          </div>
        )}

        <div style={{ width: 1, height: 24, background: BORDER2 }} />

        {/* Campaign controls */}
        {canManageCampaigns && (
          <>
            <FolderOpen size={14} color={activeCampaign ? GOLD : MUTED} />
            <select
              data-tour="campaign"
              value={activeCampaignId || ''}
              onChange={e => handleSelectCampaign(e.target.value || null)}
              style={{
                padding: '5px 10px',
                border: `1px solid ${BORDER}`, borderRadius: R.sm,
                background: CARD, fontSize: FS.sm, fontFamily: sans, color: INK,
                cursor: 'pointer', minWidth: 180,
              }}
            >
              <option value="">— No campaign</option>
              {activeCampaigns.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}{c.mapState ? ' ●' : ''}
                  {c.settlementIds?.length ? ` (${c.settlementIds.length})` : ''}
                </option>
              ))}
            </select>
            {activeCampaignId && (
              <>
                <IconButton data-tour="save" onClick={handleSaveMapToCampaign} title="Save map to campaign" primary>
                  <Save size={13} /> Save
                </IconButton>
                <Suspense fallback={null}>
                  <AutoSaveChip />
                </Suspense>
                {activeCampaign?.mapState && (
                  <IconButton onClick={handleClearMapFromCampaign} title="Clear campaign map">
                    <Trash2 size={13} />
                  </IconButton>
                )}
                <div style={{ width: 1, height: 24, background: BORDER2 }} />
                <IconButton
                  onClick={() => setCampaignWorkspace('map')}
                  title="Show campaign map"
                  active={campaignWorkspace === 'map'}
                  aria-pressed={campaignWorkspace === 'map'}
                >
                  <MapIcon size={13} /> Map
                </IconButton>
                <IconButton
                  data-tour="pulse"
                  onClick={() => setCampaignWorkspace('pulse')}
                  title="Show World Pulse"
                  active={campaignWorkspace === 'pulse'}
                  aria-pressed={campaignWorkspace === 'pulse'}
                >
                  <Zap size={13} /> Pulse
                </IconButton>
                <IconButton
                  onClick={() => setShowSimulationRules(true)}
                  title="Simulation rules"
                  active={showSimulationRules}
                  aria-pressed={showSimulationRules}
                >
                  <SlidersHorizontal size={13} /> Rules
                </IconButton>
                <IconButton
                  data-tour="news"
                  onClick={() => setCampaignWorkspace('news')}
                  title="Show Wizard News"
                  active={campaignWorkspace === 'news'}
                  aria-pressed={campaignWorkspace === 'news'}
                >
                  <Newspaper size={13} /> News
                </IconButton>
                <select
                  value={worldPulseInterval}
                  onChange={e => setWorldPulseInterval(e.target.value)}
                  title="Realm advancement interval"
                  style={{
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
                  <Zap size={13} /> {worldPulseBusy ? 'Advancing' : 'Advance Realm'}
                </IconButton>
                {canUndoPulse && (
                  <IconButton
                    onClick={handleUndoRealm}
                    title="Undo the last realm advance — restores the pre-pulse world and every settlement"
                    disabled={worldPulseBusy}
                  >
                    <Undo2 size={13} /> Undo Advance
                  </IconButton>
                )}
              </>
            )}
            <div style={{ width: 1, height: 24, background: BORDER2 }} />
          </>
        )}

        {/* Utility buttons */}
        {!showingCampaignPanel && (
          <>
            <IconButton
              data-tour="layers"
              onClick={() => setShowLayersPanel(v => !v)}
              title="Toggle layer visibility"
              active={showLayersPanel}
            >
              <Layers size={13} /> Layers
            </IconButton>
            <IconButton
              data-tour="help"
              onClick={() => setTourOpen(true)}
              title="Guided tour of the world map"
            >
              <HelpCircle size={13} /> Help
            </IconButton>
            {/* Canon-only is enforced (only canon settlements can be placed),
                so the former Canon / All Phases toggle was removed. */}
            {/* Custom map image (premium + active campaign). Import enters image
                mode; Clear reverts to generated terrain. */}
            {canManageCampaigns && activeCampaignId && (
              imageMode ? (
                <IconButton onClick={handleClearImage} title="Revert to generated terrain">
                  <XIcon size={13} /> Clear Image
                </IconButton>
              ) : (
                <IconButton onClick={handleImportImage} title="Import a custom image to use as the map">
                  <ImageIcon size={13} /> Import Image
                </IconButton>
              )
            )}
            {canManageCampaigns && activeCampaignId && (
              <IconButton onClick={() => handleShareMap('map')} disabled={sharingMap} title="Share this map to the gallery as a reusable blank canvas">
                <Share2 size={13} /> {sharingMap ? 'Sharing…' : 'Share Map'}
              </IconButton>
            )}
            {canManageCampaigns && activeCampaignId && (activeCampaign?.settlementIds?.length > 0) && (
              <IconButton onClick={() => handleShareMap('map_with_campaign')} disabled={sharingMap} title="Share this map WITH its settlements (public-safe dossiers)">
                <Share2 size={13} /> Share + Settlements
              </IconButton>
            )}
            {/* Island shape picker — terrain generation, hidden in image mode */}
            {!imageMode && mapTemplates.length > 0 && (
              <>
                <Globe size={14} color={MUTED} />
                <select
                  value={currentTemplate}
                  onChange={e => handleTemplateChange(e.target.value)}
                  title="Island shape for next regeneration"
                  style={{
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
                <div style={{ width: 1, height: 24, background: BORDER2 }} />
              </>
            )}

            <IconButton onClick={handleFit} title="Fit entire map in view">
              <MapIcon size={13} /> Fit
            </IconButton>
            {!imageMode && (
              <IconButton onClick={handleRegenerate} title="Regenerate a new world">
                <RefreshCw size={13} /> Regenerate
              </IconButton>
            )}
          </>
        )}

        <div style={{ flex: 1 }} />

        {/* Status line */}
        {!showingCampaignPanel && mapLoading && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: MUTED, fontSize: FS.xs }}>
            <Loader size={12} className="sf-spin" /> Loading…
          </span>
        )}
        {!showingCampaignPanel && mapError && (
          <span style={{ color: swatch['#C54A4A'], fontSize: FS.xs, fontWeight: 700 }}>
            {String(mapError)}
          </span>
        )}
      </div>
  );
}
