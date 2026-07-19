import { SECOND, BORDER, sans, FS, SP, PROSE_MAX } from '../theme.js';
import { SettlementCard } from './SettlementCard.jsx';

// ── The ledger's column heads (C3 — THE LEDGER) ───────────────────────────────
// Stated ONCE over the unassigned pile (MANIFEST 05 "head treatment"): a small-
// caps rubric on a feint baseline rule, left-aligned to the row cells below.
const LEDGER_TH = { textAlign:'left', fontFamily:sans, fontSize:FS.xs, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:SECOND, padding:`0 ${SP.md}px 6px`, borderBottom:`1px solid ${BORDER}`, verticalAlign:'bottom', whiteSpace:'nowrap' };
const SR_ONLY = { position:'absolute', width:1, height:1, padding:0, margin:-1, overflow:'hidden', clip:'rect(0 0 0 0)', whiteSpace:'nowrap', border:0 };

/**
 * UnassignedLedger — the library's flat settlement ledger (the unassigned pile).
 *
 * A real <table> whose rows are re-vehicled SettlementCards (each a <tr>). The
 * column heads are stated once here; the feint per-row rules live on the cells.
 * Extracted from SettlementsPanel (a hot file at the max-lines ceiling) as a
 * presentational leaf — every value/handler arrives via props, no store reads.
 */
export default function UnassignedLedger({
  saves, campaignsExist,
  allModifiers, onView, deleteId, setDeleteId, deleteConfirmed,
  campaigns, addToCampaign, removeFromCampaign,
  onReactivate, canReactivate, reactivatingId,
  onCanonize, onAdvanceTime, onCreateCampaign, onNavigate,
  canManageCampaigns, selectMode, selectedIds, onToggleSelect,
}) {
  return (
    <section>
      {/* Unassigned settlements — a real <h2> for 5-second orientation +
          screen-reader landmarking. 'Settlements (n)' when there are no
          campaigns, 'Unassigned (n)' when they exist. */}
      <h2 style={{ margin:'0 0 6px', paddingLeft:4, fontSize:FS.xs, fontWeight:700, color:SECOND, textTransform:'uppercase', letterSpacing:'0.06em', fontFamily:sans }}>
        {campaignsExist ? 'Unassigned' : 'Settlements'} ({saves.length})
      </h2>
      {/* The ledger — a real table (a genuinely tabular comparison surface),
          capped at PROSE_MAX so the action cluster stays near the name on a wide
          monitor. Headers stated once; feint row rules live on the cells
          (SettlementCard). overflow-x-in-container is the sanctioned narrow
          behaviour for a table. */}
      <div style={{ overflowX:'auto', maxWidth:PROSE_MAX }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <caption style={SR_ONLY}>Saved settlements</caption>
          <thead>
            <tr>
              {selectMode && <th scope="col" style={{ ...LEDGER_TH, width:1 }}><span style={SR_ONLY}>Select</span></th>}
              <th scope="col" style={LEDGER_TH}>Settlement</th>
              <th scope="col" style={LEDGER_TH}>Tier</th>
              <th scope="col" style={LEDGER_TH}>Phase</th>
              <th scope="col" style={LEDGER_TH}>Standing</th>
              <th scope="col" style={{ ...LEDGER_TH, textAlign:'right' }}><span style={SR_ONLY}>Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {saves.map(s => (
              <SettlementCard key={s.id} s={s} allModifiers={allModifiers}
                onView={onView} deleteId={deleteId} setDeleteId={setDeleteId}
                deleteConfirmed={deleteConfirmed} campaigns={campaigns}
                addToCampaign={addToCampaign} removeFromCampaign={removeFromCampaign}
                currentCampaignId={null}
                onReactivate={onReactivate}
                canReactivate={canReactivate}
                reactivatingId={reactivatingId}
                onCanonize={onCanonize}
                onAdvanceTime={onAdvanceTime}
                onCreateCampaign={onCreateCampaign}
                onNavigate={onNavigate}
                canManageCampaigns={canManageCampaigns}
                selectMode={selectMode}
                selected={selectedIds.has(s.id)}
                onToggleSelect={onToggleSelect}/>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
