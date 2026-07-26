import { useState, useId, useRef, useEffect, lazy, Suspense } from 'react';
import {ChevronDown, ChevronRight, Edit3, Check, X, Map as MapIcon, FileText, FolderOpen, Clock, ScrollText, BookOpen} from 'lucide-react';

// Campaign PDF export pulls in jsPDF (~200KB) plus the campaign layout.
// Lazy-load on user action so the Settlements first paint stays light —
// users only need this code when they click "Export Campaign PDF".
const generateCampaignPDF = (...args) =>
  import('../../utils/generateCampaignPDF.js').then(m => m.generateCampaignPDF(...args));
// R-4 THE WORLD BOOK — the bound-book export (chronicle + dossiers + map + realm +
// receipts). Same lazy jsPDF path, its own module; loaded only on user action.
const generateWorldBook = (...args) =>
  import('../../utils/generateWorldBook.js').then(m => m.generateWorldBook(...args));
// V-17 THE CAMPAIGN IMPORT — the paste/upload → review → commit surface. Lazy so
// its schema wall + review UI stay off the Settlements first paint.
const CampaignImportPanel = lazy(() => import('./CampaignImportPanel.jsx'));
import { GOLD, INK, MUTED, SECOND, BORDER, CARD, RED, RED_BG, sans, serif_, FS, PROSE_MAX, swatch } from '../theme.js';
import { isCampaignActive } from '../../lib/campaigns.js';
import { flag } from '../../lib/flags.js';
import { useStore } from '../../store/index.js';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import DeleteConfirmation from '../DeleteConfirmation';
import useIsMobile from '../../hooks/useIsMobile.js';
import RegionalGraphSummary from '../region/RegionalGraphSummary.jsx';
import { SettlementCard } from './SettlementCard.jsx';
import RealmStrip from './RealmStrip.jsx';
import { regionalCountsForSave } from './helpers.js';

// Screen-reader-only clip (the hidden caption + column heads) and a zero-box
// <th> style so the folder table carries accessible column semantics without
// painting a visible header row.
const SR_ONLY = { position:'absolute', width:1, height:1, padding:0, margin:-1, overflow:'hidden', clip:'rect(0 0 0 0)', whiteSpace:'nowrap', border:0 };
const HIDDEN_TH = { padding:0, border:0, height:0, lineHeight:0 };

/** One row in the "Books and export" disclosure — a label over a one-line
 *  description, so each export door's purpose reads on the surface instead of in
 *  a code comment. A ghost menuitem Button (native focus + keyboard). */
function ExportItem({ Icon, label, desc, disabled, onClick }) {
  return (
    <Button
      variant="ghost"
      fullWidth
      role="menuitem"
      disabled={disabled}
      icon={<Icon size={13} color={GOLD} />}
      onClick={onClick}
      style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6 }}
    >
      <span style={{ display:'flex', flexDirection:'column', minWidth:0 }}>
        <span style={{ fontSize:FS.sm, color:INK, fontWeight:600 }}>{label}</span>
        <span style={{ fontSize:FS.xxs, color:MUTED, fontWeight:400 }}>{desc}</span>
      </span>
    </Button>
  );
}

// ── Campaign Folder ──────────────────────────────────────────────────────────
export function CampaignFolder({
  campaign,
  settlements,
  allModifiers,
  onViewSettlement,
  deleteId,
  setDeleteId,
  deleteConfirmed,
  campaigns,
  addToCampaign,
  removeFromCampaign,
  onDeleteCampaign,
  onRenameCampaign,
  toggleCollapsed,
  onDiscoverRegional,
  onConfirmRegionalChannel,
  onApplyRegionalImpact,
  onIgnoreRegionalImpact,
  onResolveRegionalImpact,
  onAdvanceRegionalImpacts,
  onApplyAllRegionalImpacts,
  onIgnoreAllRegionalImpacts,
  onReactivate,
  canReactivate,
  reactivatingId,
  canManageCampaigns,
  onCanonize,
  onAdvanceTime,
  onCreateCampaign,
  onNavigate,
  worldCanonized,
  selectMode = false,
  selectedIds,
  onToggleSelect,
}) {
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
  const settlementDeletionInFlight = useStore(
    s => s.isCampaignMutationLocked?.(campaign?.id) || false,
  );
  const advanceBlocked = advanceInFlight || settlementDeletionInFlight;
  // ITEM 1 (owner order 2026-07-22: "there should be an autoresolver in the library
  // advance time as well, it should sync with the realm's"). The Library advance
  // already routes through the SAME chokepoint as the Realm — advanceCampaignWorld →
  // get().advanceAutoResolve — so the SETTING is one shared store value, never a
  // forked copy. This exposes it on the Library surface too. Flag-gated identically
  // to the Realm toggle (auto-resolve only rides the multi-tick advance path).
  const advanceAutoResolve = useStore(s => s.advanceAutoResolve);
  const setAdvanceAutoResolve = useStore(s => s.setAdvanceAutoResolve);
  const multiTickOn = flag('advanceMultiTick');
  const autoResolveId = useId();
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  // Campaign PDF export is async (lazy-loaded jsPDF). Without a handler that
  // awaits + catches, a throw (malformed save, jsPDF fault) became a silent
  // unhandled rejection — the user clicked "PDF" and nothing happened. Track
  // busy + error so the click always has visible feedback.
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState(null);
  // V-17 THE CAMPAIGN IMPORT — the import surface opens on demand (lazy-mounted).
  const [importOpen, setImportOpen] = useState(false);
  // R-4 THE WORLD BOOK — busy/error for the bound-book export (both faces).
  const [wbBusy, setWbBusy] = useState(false);
  const [wbError, setWbError] = useState(null);
  const handleWorldBook = (mode) => async (e) => {
    e.stopPropagation();
    if (wbBusy) return;
    setWbError(null);
    setWbBusy(true);
    try {
      await generateWorldBook(campaign, settlements, { mode });
    } catch (err) {
      setWbError(err?.message ? `World Book failed: ${err.message}` : 'World Book export failed. Please try again.');
    } finally {
      setWbBusy(false);
    }
  };
  // How far one Advance Time step carries the campaign world. Mirrors the World
  // Map toolbar's interval picker (one_week..one_year), defaulting to one month —
  // the same default the store's advanceCampaignWorld uses.
  const [advanceInterval, setAdvanceInterval] = useState('one_month');
  const advanceTitle = !worldCanonized
    ? 'Canonize this campaign world on the World Map before advancing time'
    : advanceInFlight
      ? 'Advancing the world…'
      : settlementDeletionInFlight
        ? 'Finishing a settlement deletion…'
        : 'Advance the campaign world and open the Realm';
  const handleAdvance = (event) => {
    event.stopPropagation();
    if (!advanceBlocked) {
      onAdvanceTime?.(campaign.id, advanceInterval);
    }
  };
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
  // "Books and export" disclosure — the four export/import doors (World Book /
  // Player Book / Campaign PDF / Import) fold into one menu (legibility wave,
  // 2026-07-22). Closes on Escape / outside click, mirroring the SettlementCard
  // kebab menu grammar (tabbable items, no focus trap). zIndex sits in the local
  // band (<=20), so no Z_LAYERS manifest entry is needed.
  const [exportOpen, setExportOpen] = useState(false);
  const exportMenuRef = useRef(null);
  useEffect(() => {
    if (!exportOpen) return;
    const onDoc = (e) => { if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) setExportOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setExportOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [exportOpen]);

  const collapsed = campaign.collapsed;
  const retainedInactive = !isCampaignActive(campaign);
  const active = !retainedInactive && canManageCampaigns;

  if (!active) {
    const retainedUntil = campaign.retentionExpiresAt
      ? new Date(campaign.retentionExpiresAt).toLocaleDateString('en-US')
      : null;
    return (
      <div style={{
        display:'flex', alignItems:'center', gap:8, padding:'12px 14px',
        background:swatch['#EEE9DF'], border:'1px solid #c9c0b2',
        opacity:0.72, color:MUTED, fontFamily:sans,
      }}>
        <FolderOpen size={14}/>
        <span style={{ flex:1, fontFamily:serif_, fontWeight:700, color:SECOND }}>{campaign.name}</span>
        <span style={{ fontSize:FS.xxs, fontWeight:700 }}>
          {retainedInactive
            ? `Frozen${retainedUntil ? ` until ${retainedUntil}` : ''}`
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
    <div style={{ background:'rgba(255,251,245,0.96)', border:`1px solid ${BORDER}` }}>
      {/* Campaign header. On mobile the row wraps (flexWrap) so the campaign name
          isn't crushed by the trailing controls (Advance Time / PDF / Rename /
          Delete): the name claims a full-width line and the control cluster
          reflows below it. Desktop keeps the single non-wrapping row. */}
      <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap: isMobile ? 'wrap' : undefined, padding:'10px 12px', background:swatch['#F5EDE0'], borderBottom: collapsed ? 'none' : `1px solid ${BORDER}`, borderTopLeftRadius:8, borderTopRightRadius:8, borderBottomLeftRadius: collapsed ? 8 : 0, borderBottomRightRadius: collapsed ? 8 : 0 }}>
        <IconButton Icon={collapsed ? ChevronRight : ChevronDown} label={collapsed ? 'Expand campaign' : 'Collapse campaign'} onClick={() => toggleCollapsed(campaign.id)} tone="ghost" size="md"/>
        <FolderOpen size={14} color={GOLD}/>
        {editing ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:4 }}>
            <input value={editDraft} onChange={e => setEditDraft(e.target.value)} aria-label="Campaign name"
              onKeyDown={e => { if (e.key === 'Enter') { onRenameCampaign(campaign.id, editDraft); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
              // eslint-disable-next-line jsx-a11y/no-autofocus -- inline rename field appears on user action; focus lets them type the new name immediately
              style={{ flex:1, padding:'2px 6px', border:`1px solid ${GOLD}`, fontSize:FS.sm, fontFamily:sans, outline:'none' }} autoFocus/>
            <IconButton Icon={Check} label="Save name" onClick={() => { onRenameCampaign(campaign.id, editDraft); setEditing(false); }} tone="ghost" size="sm"/>
            <IconButton Icon={X} label="Cancel rename" onClick={() => setEditing(false)} tone="danger" size="sm"/>
          </div>
        ) : (
          <span style={{ flex:1, minWidth: isMobile ? '60%' : undefined, fontSize:FS.md, fontWeight:700, color:INK, fontFamily:serif_ }}>{campaign.name}</span>
        )}
        <span style={{ fontSize:FS.xxs, color:MUTED, fontFamily:sans }}>{settlements.length} settlement{settlements.length !== 1 ? 's' : ''}</span>
        {campaign.mapState && <MapIcon size={11} color={GOLD} title="Map saved"/>}
        {!editing && (
          <div style={{ display:'flex', gap:2, alignItems:'center' }}>
            {/* ITEM 1 — the Library's auto-resolve switch. ONE shared store value with
                the Realm toggle (advanceAutoResolve/setAdvanceAutoResolve): setting it
                here changes the Realm advance too, and vice-versa. A real checkbox
                styled as a switch (keyboard + screen-reader operable). Flag-gated like
                the Realm toggle; a global preference, so it stays operable regardless
                of this folder's advanceability. Stops propagation so it never toggles
                the folder. */}
            {multiTickOn && (
              <label
                htmlFor={`${autoResolveId}-ar`}
                style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:FS.xs, fontFamily:sans, color:INK, padding:'0 4px', userSelect:'none', cursor:'pointer' }}>
                <input
                  id={`${autoResolveId}-ar`}
                  type="checkbox"
                  role="switch"
                  checked={!!advanceAutoResolve}
                  aria-checked={!!advanceAutoResolve}
                  aria-label="Auto-resolve every change"
                  title="Auto-resolve every change when advancing, or pause at the big forks. Shared with the Realm advance."
                  onChange={(e) => setAdvanceAutoResolve(e.target.checked)}
                  // stopPropagation on the INTERACTIVE input (defensive, matching the
                  // interval select) — never on the wrapping label (a11y lint).
                  onClick={(e) => e.stopPropagation()}
                  style={{ cursor:'pointer', margin:0 }}/>
                Auto-resolve
              </label>
            )}
            {/* Advance by (interval) — a visible micro-label makes the dropdown's
                purpose legible at a glance (was title=-only). The select keeps its
                aria-label so its accessible name is unchanged. Disabled in lockstep
                with the button; stops propagation so the dropdown never toggles the
                folder. */}
            <span aria-hidden="true" style={{ fontSize:FS.xxs, color:MUTED, fontFamily:sans }}>Advance by</span>
            <select
              aria-label="Advance interval"
              value={advanceInterval}
              onChange={(e) => setAdvanceInterval(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              disabled={settlements.length === 0 || !worldCanonized || advanceBlocked}
              title="How far one Advance Time step carries the campaign world"
              style={{
                fontSize: FS.xs,
                fontFamily: sans,
                color: INK,
                background: CARD,
                border: `1px solid ${BORDER}`,
                padding: '4px 6px',
                cursor: advanceBlocked ? 'default' : 'pointer',
              }}
            >
              <option value="one_week">Week</option>
              <option value="one_month">Month</option>
              <option value="one_season">Season</option>
              <option value="one_year">Year</option>
            </select>
            {/* Advance Time — the folder's prominent primary verb, now the sole
                full action button beside the collapsed export menu. Premium gate:
                the whole folder only renders (active) for canManageCampaigns.
                Disabled until the world is canonized. */}
            <Button
              variant="secondary"
              size="sm"
              icon={<Clock size={10}/>}
              onClick={handleAdvance}
              disabled={settlements.length === 0 || !worldCanonized || advanceBlocked}
              title={advanceTitle}
            >
              {advanceInFlight ? 'Advancing…' : 'Advance Time'}
            </Button>
            {/* Books and export — one disclosure folds the four sibling export/
                import doors (World Book / Player Book / Campaign PDF / Import).
                Each row carries a one-line description so the differences read on
                the surface, not in code comments. The trigger stays enabled (Import
                works on an empty campaign); the busy label mirrors an in-flight
                export. The old red variant=danger on PDF is gone with it, so red
                means destructive-only again on this header (Delete keeps it). */}
            <div ref={exportMenuRef} style={{ position:'relative' }}>
              <Button
                variant="secondary"
                size="sm"
                icon={<BookOpen size={10}/>}
                aria-haspopup="menu"
                aria-expanded={exportOpen}
                onClick={(e) => { e.stopPropagation(); setExportOpen(o => !o); }}>
                {wbBusy ? 'Binding…' : pdfBusy ? 'Exporting…' : 'Books and export'} <span aria-hidden="true">{exportOpen ? '▴' : '▾'}</span>
              </Button>
              {exportOpen && (
                <div role="menu" style={{ position:'absolute', right:0, top:'100%', marginTop:4, zIndex:20, background:CARD, border:`1px solid ${BORDER}`, minWidth:240, padding:4, display:'flex', flexDirection:'column', gap:1, textAlign:'left' }}>
                  <ExportItem
                    Icon={BookOpen}
                    label={wbBusy ? 'Binding…' : 'World Book'}
                    desc="the full record, for your eyes"
                    disabled={settlements.length === 0 || wbBusy}
                    onClick={(e) => { setExportOpen(false); handleWorldBook('dm')(e); }} />
                  <ExportItem
                    Icon={BookOpen}
                    label="Player Book"
                    desc="safe to hand across the table"
                    disabled={settlements.length === 0 || wbBusy}
                    onClick={(e) => { setExportOpen(false); handleWorldBook('player')(e); }} />
                  <ExportItem
                    Icon={FileText}
                    label={pdfBusy ? 'Exporting…' : 'Campaign PDF'}
                    desc="a printable dossier"
                    disabled={settlements.length === 0 || pdfBusy}
                    onClick={(e) => { setExportOpen(false); handleExportPdf(e); }} />
                  <ExportItem
                    Icon={ScrollText}
                    label="Import"
                    desc="bring an existing chronicle in"
                    disabled={false}
                    onClick={(e) => { e.stopPropagation(); setExportOpen(false); setImportOpen(true); }} />
                </div>
              )}
            </div>
            <IconButton Icon={Edit3} label="Rename campaign" onClick={() => { setEditing(true); setEditDraft(campaign.name); }} tone="ghost" size="sm"/>
            <IconButton Icon={X} label="Delete campaign" onClick={() => setConfirmDelete(!confirmDelete)} tone="danger" size="sm" pressed={confirmDelete}/>
          </div>
        )}
      </div>

      {/* Export error — inline alert so a failed export is never silent. One alert
          serves both the campaign PDF and the R-4 World Book (they never run at once). */}
      {(pdfError || wbError) && (
        <div
          role="alert"
          style={{ padding:'6px 12px', fontSize:FS.xs, color:RED, background:RED_BG, fontFamily:sans }}
        >
          {pdfError || wbError}
        </div>
      )}

      {/* State-of-the-realm strip — self-hides when the world is dormant (not
          canonized), so it's byte-identical for a non-simulated campaign. It
          renders BEFORE the delete-confirm block so the realm summary stays
          anchored under the header and a confirm dialog slides in below it. */}
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

      {/* Nested settlements — the campaign's own ledger table. Its rows share the
          same ledger idiom as the unassigned pile; the folder header already
          states the campaign, so the table carries a hidden caption rather than
          repeating the column heads. The scroll wrapper is capped at PROSE_MAX
          (the UnassignedLedger idiom) so the member NAME always shows in full
          on a wide viewport (R3-h's restored member-name cap carried into the
          C3 ledger structure). */}
      {!collapsed && (
        <div style={{ padding:'6px 8px 8px' }}>
          {settlements.length === 0 ? (
            <div style={{ padding:'10px 8px', fontSize:FS.xs, color:MUTED, textAlign:'center', fontStyle:'italic' }}>
              No settlements in this campaign yet. Use the arrow button to move settlements here.
            </div>
          ) : (
          <div style={{ overflowX:'auto', maxWidth:PROSE_MAX }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <caption style={SR_ONLY}>Settlements in {campaign.name}</caption>
              {/* Column heads are stated for screen readers but kept visually
                  hidden — the folder header already names the campaign, so the
                  design does not repeat the heads on screen. Mirrors the visible
                  UnassignedLedger head (same SettlementCard columns) so both
                  ledgers announce identical column semantics. */}
              <thead>
                <tr>
                  {selectMode && <th scope="col" style={HIDDEN_TH}><span style={SR_ONLY}>Select</span></th>}
                  <th scope="col" style={HIDDEN_TH}><span style={SR_ONLY}>Settlement</span></th>
                  <th scope="col" style={HIDDEN_TH}><span style={SR_ONLY}>Size</span></th>
                  <th scope="col" style={HIDDEN_TH}><span style={SR_ONLY}>Status</span></th>
                  <th scope="col" style={HIDDEN_TH}><span style={SR_ONLY}>Health</span></th>
                  <th scope="col" style={HIDDEN_TH}><span style={SR_ONLY}>Actions</span></th>
                </tr>
              </thead>
              <tbody>
          {settlements.map(settlement => (
            <SettlementCard
              key={settlement.id}
              s={settlement}
              allModifiers={allModifiers}
              onView={onViewSettlement}
              deleteId={deleteId}
              setDeleteId={setDeleteId}
              deleteConfirmed={deleteConfirmed}
              campaigns={campaigns}
              addToCampaign={addToCampaign}
              removeFromCampaign={removeFromCampaign}
              currentCampaignId={campaign.id}
              regionalCounts={regionalCountsForSave(campaign, settlement.id)}
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
              selected={!!selectedIds?.has?.(String(settlement.id))}
              onToggleSelect={onToggleSelect}
            />
          ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {/* V-17 THE CAMPAIGN IMPORT — lazy-mounted overlay; nothing loads until opened */}
      {importOpen && (
        <Suspense fallback={null}>
          <CampaignImportPanel
            campaign={campaign}
            settlements={settlements}
            onClose={() => setImportOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
