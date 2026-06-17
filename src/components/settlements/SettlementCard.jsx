import { useState } from 'react';
import {Link2, Clock, FolderOpen, ArrowRight, GitBranch, Unlock} from 'lucide-react';

import { EFFECT_CATEGORIES, fmtMod } from '../../lib/relationshipGraph.js';
import { GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, CARD, sans, FS, swatch } from '../theme.js';
import { isPlanInactiveSave, isSaveActive } from '../../lib/saveAccess.js';
import DeleteConfirmation from '../DeleteConfirmation';

const REL_COLORS = { rival:'#8b1a1a', cold_war:'#8b1a1a', hostile:'#8b1a1a', allied:'#1a5a28', secret_alliance:'#1a5a28', trade_partner:'#a0762a', patron:'#2a3a7a', client:'#2a3a7a', criminal_network:'#5a2a8a' };
const _REL_TYPES = ['neutral','trade_partner','allied','rival','cold_war','patron','client','criminal_network'];

// ── Settlement Card (reused in campaigns + unassigned) ────────────────────
export function SettlementCard({ s, allModifiers, onView, _onDelete, deleteId, setDeleteId, deleteConfirmed, campaigns, addToCampaign, removeFromCampaign, currentCampaignId, regionalCounts, onReactivate, canReactivate, reactivatingId }) {
  const [moveOpen, setMoveOpen] = useState(false);
  const ts = (t) => { try { return new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'}); } catch { return ''; } };
  const active = isSaveActive(s);
  const planInactive = isPlanInactiveSave(s);
  const retentionUntil = s.retentionExpiresAt ? ts(s.retentionExpiresAt) : null;

  // No overflow:hidden on the wrapper — would clip the "move to campaign"
  // popover that opens below the arrow button. DeleteConfirmation below
  // carries its own rounded corners + top margin, so nothing visually escapes.
  return (
    <div style={{ background: active ? 'rgba(255,251,245,0.96)' : '#eee9df', border:`1px solid ${active ? BORDER : '#c9c0b2'}`, borderRadius:7, opacity: active ? 1 : 0.68 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:FS.md, fontWeight:700, color:INK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</div>
          <div style={{ fontSize:FS.xxs, color:MUTED, display:'flex', alignItems:'center', gap:6, marginTop:1, flexWrap:'wrap' }}>
            <Clock size={10}/> {ts(s.timestamp)} · {s.tier}
          </div>
          {!active && (
            <div style={{ fontSize:FS.micro, color:GOLD, background:GOLD_BG, border:`1px solid ${BORDER}`, borderRadius:8, padding:'2px 6px', display:'inline-flex', alignItems:'center', gap:4, marginTop:4, fontWeight:700 }}>
              Retained inactive{retentionUntil ? ` until ${retentionUntil}` : ''}
            </div>
          )}
          {(s.settlement?.neighbourNetwork?.length > 0) && (
            <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:3 }}>
              {(s.settlement.neighbourNetwork||[]).slice(0,3).map((n,ni) => {
                const nc = REL_COLORS[n.relationshipType] || MUTED;
                return <span key={ni} style={{ fontSize:FS.micro, fontWeight:700, color:nc, background:`${nc}18`, border:`1px solid ${nc}40`, borderRadius:8, padding:'1px 6px', whiteSpace:'nowrap' }}>
                  <Link2 size={8} style={{display:'inline',verticalAlign:'middle',marginRight:2}}/>{n.neighbourName||n.name} · {(n.displayRelationshipType||n.localRelationshipRole||n.relationshipType||'linked').replace(/_/g,' ')}
                </span>;
              })}
              {(s.settlement.neighbourNetwork||[]).length > 3 && <span style={{fontSize:FS.micro,color:MUTED}}>+{s.settlement.neighbourNetwork.length - 3} more</span>}
            </div>
          )}
          {/* Network effect badges */}
          {(() => {
            const m = allModifiers.get(s.id);
            if (!m || m.sources.length === 0) return null;
            const badges = EFFECT_CATEGORIES.filter(c => Math.abs(m.totals[c.key]) >= 0.05);
            if (!badges.length) return null;
            return <div style={{display:'flex',gap:3,flexWrap:'wrap',marginTop:3}}>
              {badges.map(c => {
                const v = m.totals[c.key]; const pos = v >= 0;
                return <span key={c.key} style={{ fontSize:FS.micro, fontWeight:700, color:pos?'#1a5a28':'#8b1a1a', background:pos?'#e8f5e8':'#fde8e8', border:`1px solid ${pos?'#a0d0a0':'#e0b0b0'}`, borderRadius:8, padding:'1px 5px', whiteSpace:'nowrap' }}>
                  {c.label} {fmtMod(v)}
                </span>;
              })}
            </div>;
          })()}
          {regionalCounts && (regionalCounts.queued || regionalCounts.applied || regionalCounts.resolved) > 0 && (
            <div style={{ display:'flex', gap:3, flexWrap:'wrap', marginTop:3 }}>
              {regionalCounts.queued > 0 && (
                <span style={{ fontSize:FS.micro, fontWeight:700, color:GOLD, background:GOLD_BG, border:`1px solid ${BORDER}`, borderRadius:8, padding:'1px 6px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:2 }}>
                  <GitBranch size={8}/> {regionalCounts.queued} queued
                </span>
              )}
              {regionalCounts.applied > 0 && (
                <span style={{ fontSize:FS.micro, fontWeight:700, color:swatch.success, background:swatch.successBg, border:`1px solid ${BORDER}`, borderRadius:8, padding:'1px 6px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:2 }}>
                  <GitBranch size={8}/> {regionalCounts.applied} applied
                </span>
              )}
              {regionalCounts.resolved > 0 && (
                <span style={{ fontSize:FS.micro, fontWeight:700, color:SECOND, background:swatch.infoBg, border:`1px solid ${BORDER}`, borderRadius:8, padding:'1px 6px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:2 }}>
                  <GitBranch size={8}/> {regionalCounts.resolved} resolved
                </span>
              )}
            </div>
          )}
        </div>
        <div style={{ display:'flex', gap:4, alignItems:'center', flexShrink:0 }}>
          {/* Move to campaign */}
          <div style={{ position:'relative' }}>
            <button disabled={!active} onClick={() => active && setMoveOpen(!moveOpen)} title={active ? (currentCampaignId ? 'Move to...' : 'Add to campaign') : 'Reactivate to use campaigns'} style={{ padding:'4px 6px', background:active ? GOLD_BG : '#ddd5c8', color:active ? GOLD : MUTED, border:`1px solid rgba(160,118,42,0.3)`, borderRadius:4, cursor:active ? 'pointer' : 'not-allowed', fontSize:FS.xxs, fontWeight:700, fontFamily:sans, display:'flex', alignItems:'center', gap:3 }}>
              <ArrowRight size={10}/> {currentCampaignId ? 'Move' : 'Add to Campaign'}
            </button>
            {moveOpen && (
              <div style={{ position:'absolute', right:0, top:'100%', marginTop:4, zIndex:20, background:CARD, border:`1px solid ${BORDER}`, borderRadius:6, boxShadow:'0 4px 16px rgba(0,0,0,0.15)', minWidth:160, padding:4 }}>
                {currentCampaignId && (
                  <button onClick={() => { removeFromCampaign(currentCampaignId, s.id); setMoveOpen(false); }} style={{ width:'100%', textAlign:'left', padding:'5px 8px', border:'none', background:'none', cursor:'pointer', fontSize:FS.xs, color:swatch.danger, fontFamily:sans, borderRadius:3 }}
                    onMouseEnter={e => e.target.style.background='#fdf4f4'} onMouseLeave={e => e.target.style.background='none'}>
                    Remove from campaign
                  </button>
                )}
                {campaigns.map(c => c.id === currentCampaignId ? null : (
                  <button key={c.id} onClick={() => { addToCampaign(c.id, s.id); setMoveOpen(false); }} style={{ width:'100%', textAlign:'left', padding:'5px 8px', border:'none', background:'none', cursor:'pointer', fontSize:FS.xs, color:INK, fontFamily:sans, borderRadius:3, display:'flex', alignItems:'center', gap:4 }}
                    onMouseEnter={e => e.target.style.background='#f5ede0'} onMouseLeave={e => e.target.style.background='none'}>
                    <FolderOpen size={10} color={GOLD}/> {c.name}
                  </button>
                ))}
                {campaigns.length === 0 && <div style={{ padding:'5px 8px', fontSize:FS.xxs, color:MUTED }}>No campaigns yet</div>}
              </div>
            )}
          </div>
          {!active && planInactive && (
            <button
              onClick={() => onReactivate?.(s)}
              disabled={!canReactivate || reactivatingId === s.id}
              style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 10px', background:canReactivate ? GOLD_BG : '#e0d8ca', color:canReactivate ? GOLD : MUTED, border:`1px solid ${BORDER}`, borderRadius:4, cursor:canReactivate ? 'pointer' : 'not-allowed', fontSize:FS.xs, fontWeight:700, fontFamily:sans }}
            >
              <Unlock size={11}/>{reactivatingId === s.id ? 'Restoring...' : 'Reactivate'}
            </button>
          )}
          <button disabled={!active} onClick={() => active && onView(s)} style={{ padding:'4px 10px', background:active ? swatch.infoBg : '#ddd5c8', color:active ? swatch.info : MUTED, border:'1px solid #c0c8e8', borderRadius:4, cursor:active ? 'pointer' : 'not-allowed', fontSize:FS.xs, fontWeight:700, fontFamily:sans }}>View</button>
          <button
            disabled={!active}
            onClick={() => active && setDeleteId(deleteId === s.id ? null : s.id)}
            style={{ padding:'4px 10px', background:active ? swatch.dangerBg : '#ddd5c8', color:active ? swatch.danger : MUTED, border:'1px solid #e8c0c0', borderRadius:4, cursor:active ? 'pointer' : 'not-allowed', fontSize:FS.xs, fontWeight:700, fontFamily:sans }}
          >
            Delete
          </button>
        </div>
      </div>
      {deleteId === s.id && (
        <DeleteConfirmation
          entityName={s.name}
          details={(s.settlement?.neighbourNetwork||[]).length > 0
            ? `This settlement has ${s.settlement.neighbourNetwork.length} neighbour link(s). Deleting it will remove those relationships from linked settlements. Any data not exported as JSON will be permanently lost.`
            : 'All data not physically exported as a JSON file will be permanently lost.'}
          onConfirm={() => deleteConfirmed(s.id)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}
