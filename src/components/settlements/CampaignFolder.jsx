import { useState } from 'react';
import {ChevronDown, ChevronRight, Edit3, Check, X, FileText, Clock} from 'lucide-react';

// Campaign PDF export pulls in jsPDF (~200KB) plus the campaign layout.
// Lazy-load on user action so the Settlements first paint stays light —
// users only need this code when they click "Export Campaign PDF".
const generateCampaignPDF = (...args) =>
  import('../../utils/generateCampaignPDF.js').then(m => m.generateCampaignPDF(...args));
import { GOLD_TXT, INK, MUTED, BODY, SECOND, BORDER, BORDER_STRONG, RED, RED_BG, CARD, sans, serif_, FS, SP, PROSE_MAX, swatch } from '../theme.js';
import { isCampaignActive } from '../../lib/campaigns.js';
import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import DeleteConfirmation from '../DeleteConfirmation';
import useIsMobile from '../../hooks/useIsMobile.js';
import RegionalGraphSummary from '../region/RegionalGraphSummary.jsx';
import { SettlementCard } from './SettlementCard.jsx';
import RealmStrip from './RealmStrip.jsx';
import { regionalCountsForSave } from './helpers.js';

// ── Campaign Folder ──────────────────────────────────────────────────────────
export function CampaignFolder({ campaign, settlements, allModifiers, onViewSettlement, deleteId, setDeleteId, deleteConfirmed, campaigns, addToCampaign, removeFromCampaign, onDeleteCampaign, onRenameCampaign, toggleCollapsed, onDiscoverRegional, onConfirmRegionalChannel, onApplyRegionalImpact, onIgnoreRegionalImpact, onResolveRegionalImpact, onAdvanceRegionalImpacts, onApplyAllRegionalImpacts, onIgnoreAllRegionalImpacts, onReactivate, canReactivate, reactivatingId, canManageCampaigns, onCanonize, onAdvanceTime, onCreateCampaign, onNavigate, worldCanonized, selectMode = false, selectedIds, onToggleSelect }) {
  const worldState = campaign?.worldState || null;
  const regionalGraph = campaign?.regionalGraph || campaign?.worldState?.regionalGraph || null;
  const nameFor = (id) => {
    const match = (settlements || []).find(sv => String(sv?.id) === String(id));
    return match?.name || match?.settlement?.name || String(id);
  };
  const isMobile = useIsMobile();
  // Disable Advance while a tick is already running for THIS campaign — the store
  // also no-ops a re-entrant advance, but greying the button stops the double-click
  // from queuing a second intent + gives the DM visible feedback the tick is busy.
  const advanceInFlight = useStore(s => s.isAdvanceInFlight(campaign?.id));
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Campaign PDF export is async (lazy-loaded jsPDF). Without a handler that
  // awaits + catches, a throw (malformed save, jsPDF fault) became a silent
  // unhandled rejection — the user clicked "PDF" and nothing happened. Track
  // busy + error so the click always has visible feedback.
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  // How far one Advance Time step carries the campaign world. Mirrors the World
  // Map toolbar's interval picker (one_week..one_year), defaulting to one month —
  // the same default the hardcoded handler used before this picker existed.
  const [advanceInterval, setAdvanceInterval] = useState('one_month');
  const handleExportPdf = async (e) => {
    e.stopPropagation();
    if (pdfBusy) return;
    setPdfError(null);
    setPdfBusy(true);
    try {
      await generateCampaignPDF(campaign, settlements);
    } catch (err) {
      setPdfError(err?.message ? `PDF export failed: ${err.message}` : 'PDF export failed. Please try again.');
    } finally {
      setPdfBusy(false);
    }
  };
  const collapsed = campaign.collapsed;
  const retainedInactive = !isCampaignActive(campaign);
  const active = !retainedInactive && canManageCampaigns;

  if (!active) {
    const retainedUntil = campaign.retentionExpiresAt
      ? new Date(campaign.retentionExpiresAt).toLocaleDateString()
      : null;
    return (
      <div style={{
        display:'flex', alignItems:'center', gap:8, padding:'12px 14px',
        background:swatch['#EEE9DF'], border:'1px solid #c9c0b2', borderRadius:8,
        opacity:0.72, color:MUTED, fontFamily:sans,
      }}>
        <span style={{ flex:1, fontFamily:serif_, fontWeight:700, color:SECOND }}>{campaign.name}</span>
        <span style={{ fontSize:FS.xs, fontWeight:700, color:BODY }}>
          {retainedInactive
            ? `Retained inactive${retainedUntil ? ` until ${retainedUntil}` : ''}`
            : 'Available again with Premium'}
        </span>
      </div>
    );
  }

  // No overflow:hidden on the wrapper — would clip the "move to campaign"
  // popover on cards inside this section. The header's top corners are
  // rounded explicitly to match the parent so the cream background doesn't
  // poke outside the rounded outer border.
  return (
    <div style={{ background:'rgba(255,251,245,0.96)', border:`1px solid ${BORDER}`, borderRadius:8 }}>
      {/* Campaign header. On mobile the row wraps (flexWrap) so the campaign name
          isn't crushed by the four trailing controls (Advance Time / PDF /
          Rename / Delete); the name claims a full-width line and the control
          cluster reflows below it. Desktop keeps the single non-wrapping row. */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap: isMobile ? 'wrap' : undefined, padding:'10px 12px', background:swatch['#F5EDE0'], borderBottom: collapsed ? 'none' : `1px solid ${BORDER}`, borderTopLeftRadius:8, borderTopRightRadius:8, borderBottomLeftRadius: collapsed ? 8 : 0, borderBottomRightRadius: collapsed ? 8 : 0 }}>
        <IconButton Icon={collapsed ? ChevronRight : ChevronDown} label={collapsed ? 'Expand campaign' : 'Collapse campaign'} onClick={() => toggleCollapsed(campaign.id)} tone="ghost" size="md"/>
        {editing ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:4 }}>
            <input value={editDraft} onChange={e => setEditDraft(e.target.value)} aria-label="Campaign name"
              onKeyDown={e => { if (e.key === 'Enter') { onRenameCampaign(campaign.id, editDraft); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
              // eslint-disable-next-line jsx-a11y/no-autofocus -- inline rename field appears on user action; focus lets them type the new name immediately
              style={{ flex:1, padding:'2px 6px', border:`1px solid ${BORDER_STRONG}`, borderRadius:3, fontSize:FS.sm, fontFamily:sans, outline:'none' }} autoFocus/>
            <IconButton Icon={Check} label="Save name" onClick={() => { onRenameCampaign(campaign.id, editDraft); setEditing(false); }} tone="ghost" size="sm"/>
            <IconButton Icon={X} label="Cancel rename" onClick={() => setEditing(false)} tone="danger" size="sm"/>
          </div>
        ) : (
          <span style={{ flex:1, minWidth: isMobile ? '60%' : undefined, fontSize:FS.md, fontWeight:700, color:INK, fontFamily:serif_ }}>{campaign.name}</span>
        )}
        <span style={{ fontSize:FS.xs, color:MUTED, fontFamily:sans }}>{settlements.length} settlement{settlements.length !== 1 ? 's' : ''}</span>
        {campaign.mapState && <span style={{ fontSize:FS.xs, fontWeight:700, color:GOLD_TXT, fontFamily:sans }}>Map saved</span>}
        {!editing && (
          <div style={{ display:'flex', gap:2, alignItems:'center' }}>
            {/* Interval picker for the advance — Week/Month/Season/Year, mirroring
                the World Map toolbar so the DM can choose how far one step carries
                the campaign world. Disabled in lockstep with the button; stops
                propagation so opening the dropdown never toggles the folder. */}
            <select
              aria-label="Advance interval"
              value={advanceInterval}
              onChange={(e) => setAdvanceInterval(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              disabled={settlements.length === 0 || !worldCanonized || advanceInFlight}
              title="How far one Advance Time step carries the campaign world"
              style={{ fontSize:FS.xs, fontFamily:sans, color:INK, background:CARD, border:`1px solid ${BORDER}`, borderRadius:5, padding:'4px 6px', cursor: advanceInFlight ? 'default' : 'pointer' }}>
              <option value="one_week">Week</option>
              <option value="one_month">Month</option>
              <option value="one_season">Season</option>
              <option value="one_year">Year</option>
            </select>
            {/* Advance Time is a per-CAMPAIGN action, not the page's first-click
                task — demoted from solid primary to secondary (outline) so the
                page header's "New Settlement" stays the only solid primary on the
                list region (P4/P8 one-primary-per-region). The Zeigarnik pull back
                to advancing time already lives in the RealmStrip news/crisis pips. */}
            <Button
              variant="secondary"
              size="sm"
              icon={<Clock size={10}/>}
              onClick={(e) => { e.stopPropagation(); if (!advanceInFlight) onAdvanceTime?.(campaign.id, advanceInterval); }}
              disabled={settlements.length === 0 || !worldCanonized || advanceInFlight}
              title={!worldCanonized
                ? 'Canonize this campaign world on the World Map before advancing time'
                : advanceInFlight
                  ? 'Advancing the world…'
                  : 'Advance the campaign world and open Wizard News on the map'}>
              {advanceInFlight ? 'Advancing…' : 'Advance Time'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<FileText size={10}/>}
              onClick={handleExportPdf}
              disabled={settlements.length === 0 || pdfBusy}
              title="Export Campaign PDF">
              {pdfBusy ? 'Exporting…' : 'PDF'}
            </Button>
            <IconButton Icon={Edit3} label="Rename campaign" onClick={() => { setEditing(true); setEditDraft(campaign.name); }} tone="ghost" size="md"/>
            <IconButton Icon={X} label="Delete campaign" onClick={() => setConfirmDelete(!confirmDelete)} tone="danger" size="md" pressed={confirmDelete}/>
          </div>
        )}
      </div>

      {/* Campaign PDF export error — inline alert so a failed export is never silent */}
      {pdfError && (
        <div
          role="alert"
          style={{ padding:'6px 12px', fontSize:FS.xs, color:RED, background:RED_BG, fontFamily:sans }}
        >
          {pdfError}
        </div>
      )}

      {/* State-of-the-realm strip — self-hides when the world is dormant
          (not canonized). Byte-identical for a non-simulated campaign. */}
      {!collapsed && <RealmStrip campaign={campaign} settlements={settlements} />}

      {/* Campaign delete confirmation */}
      {confirmDelete && (
        <DeleteConfirmation
          entityName={campaign.name}
          details={`This campaign contains ${settlements.length} settlement(s). They will become unassigned, not deleted.${campaign.mapState ? ' The saved map state will be lost.' : ''}`}
          onConfirm={() => { onDeleteCampaign(campaign.id); setConfirmDelete(false); }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {!collapsed && (
        <RegionalGraphSummary
          campaign={campaign}
          settlementCount={settlements.length}
          onDiscover={onDiscoverRegional}
          onConfirmChannel={onConfirmRegionalChannel}
          onApplyImpact={onApplyRegionalImpact}
          onIgnoreImpact={onIgnoreRegionalImpact}
          onResolveImpact={onResolveRegionalImpact}
          onAdvanceImpacts={onAdvanceRegionalImpacts}
          onApplyAllImpacts={onApplyAllRegionalImpacts}
          onIgnoreAllImpacts={onIgnoreAllRegionalImpacts}
        />
      )}

      {/* Nested settlements — a single readable column capped at PROSE_MAX so the
          member-card NAME always shows in full (matching the unassigned pile fix;
          the prior 2-up grid clipped names to 1-2 chars). The header / RealmStrip /
          RegionalGraphSummary above keep full folder width. Empty falls back to a
          centered note. */}
      {!collapsed && (
        <div style={{ padding:`${SP.md}px 8px 8px`, display: settlements.length === 0 ? 'flex' : 'grid', flexDirection:'column', gridTemplateColumns: settlements.length === 0 ? undefined : '1fr', maxWidth: settlements.length === 0 ? undefined : PROSE_MAX, gap:SP.sm }}>
          {settlements.length === 0 ? (
            <div style={{ padding:'10px 8px', fontSize:FS.xs, color:BODY, textAlign:'center', fontStyle:'italic', maxWidth:'60ch', marginLeft:'auto', marginRight:'auto' }}>
              No settlements in this campaign yet. Use the arrow button to move settlements here.
            </div>
          ) : settlements.map(s => (
            <SettlementCard key={s.id} s={s} allModifiers={allModifiers}
              onView={onViewSettlement} deleteId={deleteId} setDeleteId={setDeleteId}
              deleteConfirmed={deleteConfirmed} campaigns={campaigns}
              addToCampaign={addToCampaign} removeFromCampaign={removeFromCampaign}
              currentCampaignId={campaign.id}
              regionalCounts={regionalCountsForSave(campaign, s.id)}
              onReactivate={onReactivate}
              canReactivate={canReactivate}
              reactivatingId={reactivatingId}
              onCanonize={onCanonize}
              onAdvanceTime={onAdvanceTime}
              onCreateCampaign={onCreateCampaign}
              onNavigate={onNavigate}
              canManageCampaigns={canManageCampaigns}
              worldState={worldState}
              regionalGraph={regionalGraph}
              nameFor={nameFor}
              selectMode={selectMode}
              selected={!!selectedIds?.has?.(s.id)}
              onToggleSelect={onToggleSelect}/>
          ))}
        </div>
      )}
    </div>
  );
}
