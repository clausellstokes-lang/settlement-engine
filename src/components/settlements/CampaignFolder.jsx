import { useState } from 'react';
import {ChevronDown, ChevronRight, Edit3, Check, X, Map as MapIcon, FileText, FolderOpen, Clock} from 'lucide-react';

// Campaign PDF export pulls in jsPDF (~200KB) plus the campaign layout.
// Lazy-load on user action so the Settlements first paint stays light —
// users only need this code when they click "Export Campaign PDF".
const generateCampaignPDF = (...args) =>
  import('../../utils/generateCampaignPDF.js').then(m => m.generateCampaignPDF(...args));
import { GOLD, INK, MUTED, SECOND, BORDER, sans, serif_, FS, swatch } from '../theme.js';
import { isCampaignActive } from '../../lib/campaigns.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import DeleteConfirmation from '../DeleteConfirmation';
import RegionalGraphSummary from '../region/RegionalGraphSummary.jsx';
import { SettlementCard } from './SettlementCard.jsx';
import RealmStrip from './RealmStrip.jsx';
import { regionalCountsForSave } from './helpers.js';

// ── Campaign Folder ──────────────────────────────────────────────────────────
export function CampaignFolder({ campaign, settlements, allModifiers, onViewSettlement, deleteId, setDeleteId, deleteConfirmed, campaigns, addToCampaign, removeFromCampaign, onDeleteCampaign, onRenameCampaign, toggleCollapsed, onDiscoverRegional, onConfirmRegionalChannel, onApplyRegionalImpact, onIgnoreRegionalImpact, onResolveRegionalImpact, onAdvanceRegionalImpacts, onApplyAllRegionalImpacts, onIgnoreAllRegionalImpacts, onReactivate, canReactivate, reactivatingId, canManageCampaigns, onCanonize, onAdvanceTime, worldCanonized, selectMode = false, selectedIds, onToggleSelect }) {
  const worldState = campaign?.worldState || null;
  const regionalGraph = campaign?.regionalGraph || campaign?.worldState?.regionalGraph || null;
  const nameFor = (id) => {
    const match = (settlements || []).find(sv => String(sv?.id) === String(id));
    return match?.name || match?.settlement?.name || String(id);
  };
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
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
        <FolderOpen size={14}/>
        <span style={{ flex:1, fontFamily:serif_, fontWeight:700, color:SECOND }}>{campaign.name}</span>
        <span style={{ fontSize:FS.xxs, fontWeight:700 }}>
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
      {/* Campaign header */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:swatch['#F5EDE0'], borderBottom: collapsed ? 'none' : `1px solid ${BORDER}`, borderTopLeftRadius:8, borderTopRightRadius:8, borderBottomLeftRadius: collapsed ? 8 : 0, borderBottomRightRadius: collapsed ? 8 : 0 }}>
        <IconButton Icon={collapsed ? ChevronRight : ChevronDown} label={collapsed ? 'Expand campaign' : 'Collapse campaign'} onClick={() => toggleCollapsed(campaign.id)} tone="ghost" size="md"/>
        <FolderOpen size={14} color={GOLD}/>
        {editing ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:4 }}>
            <input value={editDraft} onChange={e => setEditDraft(e.target.value)} aria-label="Campaign name"
              onKeyDown={e => { if (e.key === 'Enter') { onRenameCampaign(campaign.id, editDraft); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
              // eslint-disable-next-line jsx-a11y/no-autofocus -- inline rename field appears on user action; focus lets them type the new name immediately
              style={{ flex:1, padding:'2px 6px', border:`1px solid ${GOLD}`, borderRadius:3, fontSize:FS.sm, fontFamily:sans, outline:'none' }} autoFocus/>
            <IconButton Icon={Check} label="Save name" onClick={() => { onRenameCampaign(campaign.id, editDraft); setEditing(false); }} tone="ghost" size="sm"/>
            <IconButton Icon={X} label="Cancel rename" onClick={() => setEditing(false)} tone="danger" size="sm"/>
          </div>
        ) : (
          <span style={{ flex:1, fontSize:FS.md, fontWeight:700, color:INK, fontFamily:serif_ }}>{campaign.name}</span>
        )}
        <span style={{ fontSize:FS.xxs, color:MUTED, fontFamily:sans }}>{settlements.length} settlement{settlements.length !== 1 ? 's' : ''}</span>
        {campaign.mapState && <MapIcon size={11} color={GOLD} title="Map saved"/>}
        {!editing && (
          <div style={{ display:'flex', gap:2, alignItems:'center' }}>
            <Button
              variant="gold"
              size="sm"
              icon={<Clock size={10}/>}
              onClick={(e) => { e.stopPropagation(); onAdvanceTime?.(campaign.id); }}
              disabled={settlements.length === 0 || !worldCanonized}
              title={worldCanonized
                ? 'Advance the campaign world and open Wizard News on the map'
                : 'Canonize this campaign world on the World Map before advancing time'}>
              Advance Time
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={<FileText size={10}/>}
              onClick={(e) => { e.stopPropagation(); generateCampaignPDF(campaign, settlements); }}
              disabled={settlements.length === 0}
              title="Export Campaign PDF">
              PDF
            </Button>
            <IconButton Icon={Edit3} label="Rename campaign" onClick={() => { setEditing(true); setEditDraft(campaign.name); }} tone="ghost" size="sm"/>
            <IconButton Icon={X} label="Delete campaign" onClick={() => setConfirmDelete(!confirmDelete)} tone="danger" size="sm" pressed={confirmDelete}/>
          </div>
        )}
      </div>

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

      {/* Nested settlements */}
      {!collapsed && (
        <div style={{ padding:'6px 8px 8px', display:'flex', flexDirection:'column', gap:4 }}>
          {settlements.length === 0 ? (
            <div style={{ padding:'10px 8px', fontSize:FS.xs, color:MUTED, textAlign:'center', fontStyle:'italic' }}>
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
