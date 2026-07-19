import { useMemo, useState, useRef, useEffect } from 'react';
import {Clock, FolderOpen, ArrowRight, Unlock, BookMarked, ChevronDown, Trash2} from 'lucide-react';

import { EFFECT_CATEGORIES, fmtMod } from '../../lib/relationshipGraph.js';
import { GOLD, GOLD_BG, GOLD_TXT, INK, MUTED, BODY, SECOND, BORDER, CARD, FS, SP, swatch } from '../theme.js';
import { isPlanInactiveSave, isSaveActive } from '../../lib/saveAccess.js';
import { canonPhaseOf } from './helpers.js';
import { settlementSignals, healthPip } from './livingWorldSignals.js';
import LivingWorldSignalRow from './LivingWorldSignalRow.jsx';
import HealthPip from './HealthPip.jsx';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import LifecycleSpine from '../primitives/LifecycleSpine.jsx';
import DeleteConfirmation from '../DeleteConfirmation';
import SettlementCardMapThumb from '../townMap/SettlementCardMapThumb.jsx';
import { useStore } from '../../store/index.js';

// Relationship-type swatch for the neighbour chips (kept inline on OUR floor —
// the shared cross-surface palette adoption is a separate cosmetic dedupe).
const REL_COLORS = { rival:'#8b1a1a', cold_war:'#8b1a1a', hostile:'#8b1a1a', allied:'#1a5a28', secret_alliance:'#1a5a28', trade_partner:'#a0762a', patron:'#2a3a7a', client:'#2a3a7a', criminal_network:'#5a2a8a' };

// ── Settlement Card (reused in campaigns + unassigned) ────────────────────
export function SettlementCard({ s, allModifiers, onView, deleteId, setDeleteId, deleteConfirmed, campaigns, addToCampaign, removeFromCampaign, currentCampaignId, regionalCounts, onReactivate, canReactivate, reactivatingId, onCanonize, worldState = null, regionalGraph = null, nameFor, onAdvanceTime, onCreateCampaign, onNavigate, canManageCampaigns = false, selectMode = false, selected = false, onToggleSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const ts = (t) => { try { return new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'}); } catch { return ''; } };
  const active = isSaveActive(s);
  const planInactive = isPlanInactiveSave(s);
  const isCanon = canonPhaseOf(s) === 'canon';
  const retentionUntil = s.retentionExpiresAt ? ts(s.retentionExpiresAt) : null;

  // Lifecycle spine stage — pure derivation from fields/selectors already in
  // scope, no new store fields (mirrors OutputContainer's derivation). A library
  // card is at least 'saved'; canonPhaseOf returns 'draft' for un-canonized
  // saves, but the spine floor is 'saved' since the card is in the library. We
  // surface the FURTHEST-reached stage. The clock-bound selector null-guards.
  const isSettlementClockBound = useStore(st => st.isSettlementClockBound);
  const simulated = typeof isSettlementClockBound === 'function' && isSettlementClockBound(s.id);
  const lifecycleStage = s.is_public ? 'shared' : (simulated ? 'simulated' : (isCanon ? 'canon' : 'saved'));

  // Close the overflow menu on an outside click / Escape so it behaves like a
  // standard menu rather than a sticky panel.
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [menuOpen]);

  // Living-world signal model — REUSES the dossier's read-models (settlementSignals
  // over warStatus + the embedded deity snapshot + computeAggressiveness). Self-
  // gates: hasLiveWorld is false for a peaceful, non-campaign, deity-free card, so
  // LivingWorldSignalRow renders nothing and the card looks exactly as today.
  const signals = useMemo(() => settlementSignals({
    settlement: s.settlement,
    settlementId: s.id,
    worldState,
    regionalGraph,
    nameFor,
  }), [s.settlement, s.id, worldState, regionalGraph, nameFor]);
  const health = useMemo(() => healthPip(s.settlement), [s.settlement]);

  // Whole-card click is a MOUSE-ONLY convenience: the explicit Open button (and,
  // in select mode, the checkbox) is the real accessible affordance, so the
  // wrapper is a plain <div> — no role="button"/tabIndex. Clicks from inside the
  // action cluster, the kebab menu, the select checkbox, the link chips, or the
  // delete confirmation own their own behaviour, so we early-return when the event
  // came from within.
  const fromInteractive = (e) => !!e.target.closest?.('[data-card-actions], [data-card-select], [role="menu"], input, button, a');
  const handleCardActivate = (e) => {
    if (!active || fromInteractive(e)) return;
    if (selectMode) { onToggleSelect?.(s.id); return; }
    onView?.(s);
  };

  // Crisis/war drives a red semantic rail; canon a gold rail; otherwise NONE
  // (a dormant / peaceful card keeps its plain 1px border — byte-quiet). Two-
  // channel encoding: the rail is a second cue alongside the pips, so phase /
  // crisis is readable at a glance from the card edge. Reads the SAME model the
  // pips render (signals.war + health.severity). severity >= 2 == Vulnerable/
  // Critical (the bands the "Needs attention" sort + the health pip surface).
  const inCrisis = !!signals?.war || (health?.severity ?? 0) >= 2;
  const railColor = inCrisis ? swatch.danger : (isCanon ? GOLD : null);
  const railStyle = selected
    ? { borderLeft: `3px solid ${GOLD}`, boxShadow: `0 0 0 1px ${GOLD}` }
    : railColor
      ? { borderLeft: `3px solid ${railColor}` }
      : {};

  // No overflow:hidden on the wrapper — would clip the action overflow menu
  // that opens below the kebab. DeleteConfirmation below carries its own
  // rounded corners + top margin, so nothing visually escapes.
  return (
    // Mouse-only convenience: keyboard/SR users open via the explicit "Open"
    // button (the real affordance), so the wrapper carries NO role/tabindex —
    // adding a keyboard handler here would re-create a nested-interactive ARIA
    // violation. The lint disable is therefore intentional.
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
    <div
      data-testid="settlement-card"
      onClick={handleCardActivate}
      style={{
        background: active ? 'rgba(255,251,245,0.96)' : swatch['#EEE9DF'],
        cursor: active ? 'pointer' : 'default',
        // Inactive cards keep their original muted grey-tan edge (#c9c0b2).
        border:`1px solid ${selected ? GOLD : (active ? BORDER : '#c9c0b2')}`,
        borderRadius:7, opacity: active ? 1 : 0.68,
        ...railStyle,
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:SP.sm, padding:`${SP.sm}px ${SP.md}px` }}>
        {selectMode && (
          // Padded label widens the ~16px checkbox hit area toward the ~44px
          // usability target (24px WCAG floor) without changing the visible box.
          <label
            data-card-select
            htmlFor={`select-${s.id}`}
            style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', padding:SP.sm, margin:`-${SP.sm}px`, flexShrink:0, cursor: active ? 'pointer' : 'not-allowed' }}
          >
            <input
              id={`select-${s.id}`}
              type="checkbox"
              checked={selected}
              disabled={!active}
              onChange={() => active && onToggleSelect?.(s.id)}
              aria-label={`Select ${s.name}`}
              style={{ width:16, height:16, flexShrink:0, cursor: active ? 'pointer' : 'not-allowed', accentColor: GOLD }}
            />
          </label>
        )}
        {/* SM-4 — the lazy, cached town-map thumbnail (leading identity cue). Self-
            collapses to nothing for a map-less settlement / a canvas-less env, so
            a card without map data keeps its exact prior layout. */}
        {s.settlement && <SettlementCardMapThumb settlement={s.settlement} worldState={worldState} />}
        {/* minWidth floor (not 0): the flexShrink:0 action cluster is the only
            other item on this row, so without a floor this column collapses
            toward 0 and the name ellipsis-clips to a single character. */}
        <div style={{ flex:1, minWidth:140 }}>
          {/* Identity tier — name + tier suffix + health, tight. The name is a
              real heading so screen-reader users can navigate card-by-card. */}
          <div style={{ display:'flex', alignItems:'baseline', gap:SP.sm, minWidth:0 }}>
            <h3 style={{ margin:0, fontSize:FS.xl, fontWeight:700, color:INK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', minWidth:0 }}>{s.name}</h3>
            <span style={{ fontSize:FS.xs, color:BODY, textTransform:'capitalize', flexShrink:0 }}>{s.tier}</span>
            {/* Health pip — DORMANCY-QUIET: only surfaces once the worst band
                reaches the attention threshold (Vulnerable/Critical). A healthy /
                peaceful town shows no pip, so its card stays byte-identical. */}
            {health && health.severity >= 2 && <span style={{ flexShrink:0, alignSelf:'center' }}><HealthPip pip={health}/></span>}
          </div>
          {/* Living-world tier — the live, change-bearing state leads, directly
              under the name (top-left = most scannable). */}
          <div style={{ marginTop:SP.sm, display:'flex', flexDirection:'column', gap:SP.xs }}>
            {/* Signal cluster — the live, change-bearing state. */}
            <div style={{ display:'flex', flexDirection:'column', gap:SP.xs }}>
              {/* Living-world signal row (self-gating — nothing for a peaceful card). */}
              <LivingWorldSignalRow model={signals} />
              {!active && (
                <div style={{ fontSize:FS.xs, color:GOLD_TXT, background:GOLD_BG, borderRadius:8, padding:'2px 6px', display:'inline-flex', alignItems:'center', gap:4, fontWeight:700, alignSelf:'flex-start' }}>
                  Retained inactive{retentionUntil ? ` until ${retentionUntil}` : ''}
                </div>
              )}
            </div>

            {/* Connections + network metadata — STATIC reference detail, demoted
                to the supporting middle tier. Ordered neighbours → effects →
                regional counts. */}
            {(s.settlement?.neighbourNetwork?.length > 0
              || allModifiers.get(s.id)?.sources?.length > 0
              || (regionalCounts && (regionalCounts.queued || regionalCounts.applied || regionalCounts.resolved) > 0)) && (
              <div style={{ marginTop:SP.xs, display:'flex', flexDirection:'column', gap:SP.xs }}>
                {(s.settlement?.neighbourNetwork?.length > 0) && (
                  <div style={{ display:'flex', gap:SP.xs, flexWrap:'wrap' }}>
                    {(s.settlement.neighbourNetwork||[]).slice(0,3).map((n,ni) => {
                      const nc = REL_COLORS[n.relationshipType] || MUTED;
                      return <span key={ni} style={{ fontSize:FS.xs, fontWeight:500, color:SECOND, background:`${nc}12`, borderRadius:8, padding:'1px 6px', whiteSpace:'nowrap' }}>
                        {n.neighbourName||n.name} · {(n.displayRelationshipType||n.localRelationshipRole||n.relationshipType||'linked').replace(/_/g,' ')}
                      </span>;
                    })}
                    {(s.settlement.neighbourNetwork||[]).length > 3 && <span style={{fontSize:FS.xs,color:BODY}}>+{s.settlement.neighbourNetwork.length - 3} more</span>}
                  </div>
                )}
                {/* Network effect badges — kept their semantic green/red at weight 500. */}
                {(() => {
                  const m = allModifiers.get(s.id);
                  if (!m || m.sources.length === 0) return null;
                  const badges = EFFECT_CATEGORIES.filter(c => Math.abs(m.totals[c.key]) >= 0.05);
                  if (!badges.length) return null;
                  return <div style={{display:'flex',gap:SP.xs,flexWrap:'wrap'}}>
                    {badges.map(c => {
                      const v = m.totals[c.key]; const pos = v >= 0;
                      return <span key={c.key} style={{ fontSize:FS.xs, fontWeight:500, color:pos?swatch.success:swatch.danger, background:pos?swatch.successBg:swatch.dangerBg, borderRadius:8, padding:'1px 5px', whiteSpace:'nowrap' }}>
                        {c.label} {fmtMod(v)}
                      </span>;
                    })}
                  </div>;
                })()}
                {regionalCounts && (regionalCounts.queued || regionalCounts.applied || regionalCounts.resolved) > 0 && (
                  <div style={{ display:'flex', gap:SP.xs, flexWrap:'wrap' }}>
                    {regionalCounts.queued > 0 && (
                      <span style={{ fontSize:FS.xs, fontWeight:500, color:SECOND, background:GOLD_BG, borderRadius:8, padding:'1px 6px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:2 }}>
                        {regionalCounts.queued} queued
                      </span>
                    )}
                    {regionalCounts.applied > 0 && (
                      <span style={{ fontSize:FS.xs, fontWeight:500, color:SECOND, background:swatch.successBg, borderRadius:8, padding:'1px 6px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:2 }}>
                        {regionalCounts.applied} applied
                      </span>
                    )}
                    {regionalCounts.resolved > 0 && (
                      <span style={{ fontSize:FS.xs, fontWeight:500, color:SECOND, background:swatch.infoBg, borderRadius:8, padding:'1px 6px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:2 }}>
                        {regionalCounts.resolved} resolved
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Lifecycle at a glance — the compact 1-5 stepper (Draft, Saved,
                Canon, In the Realm, Shared). Non-interactive (no onStep) so it
                adds no tab stops to the dense card. Gated to active saves. */}
            {active && (
              <div style={{ marginTop:SP.xs }}>
                <LifecycleSpine stage={lifecycleStage} compact />
              </div>
            )}
            {/* Save metadata — the LEAST table-relevant fact, pushed below. */}
            <div style={{ fontSize:FS.xs, color:BODY, display:'flex', alignItems:'center', gap:6, marginTop:SP.xs }}>
              <Clock size={10}/> {ts(s.timestamp)}
            </div>
          </div>
        </div>
        {/* Action cluster — ONE primary (Open), rare actions behind a kebab
            overflow, destructive Delete demoted to a separated small ghost icon.
            Reactivation replaces Open for plan-inactive saves. */}
        <div data-card-actions style={{ display:'flex', gap:SP.xs, alignItems:'center', flexShrink:0 }}>
          {!active && planInactive ? (
            <Button
              variant="gold"
              size="sm"
              onClick={() => onReactivate?.(s)}
              disabled={!canReactivate || reactivatingId === s.id}
              busy={reactivatingId === s.id}
              icon={<Unlock size={12}/>}
              title={canReactivate ? 'Reactivate this retained settlement' : undefined}
            >
              {reactivatingId === s.id ? 'Restoring...' : 'Reactivate'}
            </Button>
          ) : (
            <>
              {/* The whole card is the primary open target; this is the explicit,
                  subordinate echo of that action — outline, not solid. */}
              <Button variant="info" size="sm" disabled={!active} onClick={() => active && onView(s)} aria-label={`Open ${s.name}`}>Open</Button>

              {/* Overflow: campaign / canonize / advance — infrequent, disclosed. */}
              {active && (
                <div ref={menuRef} style={{ position:'relative' }}>
                  <IconButton
                    Icon={ChevronDown}
                    label="More actions"
                    tone="ghost"
                    size="md"
                    pressed={menuOpen}
                    onClick={() => setMenuOpen(o => !o)}
                  />
                  {menuOpen && (
                    <div role="menu" style={{ position:'absolute', right:0, top:'100%', marginTop:4, zIndex:20, background:CARD, border:`1px solid ${BORDER}`, borderRadius:6, boxShadow:'0 4px 16px rgba(0,0,0,0.15)', minWidth:200, padding:4, display:'flex', flexDirection:'column', gap:1 }}>
                      {/* Canonize (draft → canon) or a static Canon marker. */}
                      {!isCanon ? (
                        <Button variant="ghost" fullWidth onClick={() => { onCanonize?.(s); setMenuOpen(false); }}
                          icon={<BookMarked size={13} color={GOLD}/>}
                          title="Canonize: lock names and start the campaign timeline"
                          style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6, fontSize:FS.sm, color:INK, fontWeight:500, borderRadius:3 }}>
                          Canonize
                        </Button>
                      ) : (
                        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'6px 8px', fontSize:FS.xs, fontWeight:700, color:GOLD_TXT }}>
                          <BookMarked size={12}/> Canon. Names locked
                        </div>
                      )}
                      {/* Free tier (no campaign management): Advance Time + campaigns
                          are impossible, so collapse the inert stub + the path-less
                          "No campaigns yet" into ONE upgrade-preview row at the
                          moment of intent (limits → previews, no dead-end). */}
                      {!currentCampaignId && !canManageCampaigns && campaigns.length === 0 ? (
                        <Button variant="ghost" fullWidth
                          onClick={() => { setMenuOpen(false); onNavigate?.('pricing'); }}
                          icon={<Clock size={13} color={GOLD}/>}
                          style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6, fontSize:FS.sm, color:GOLD_TXT, fontWeight:500, borderRadius:3 }}>
                          Advance time and run campaigns. Upgrade
                        </Button>
                      ) : (
                        <>
                          {/* Advance Time — in a campaign it deep-links the advance
                              flow. Standalone (premium, has campaigns) it is a
                              disabled-with-reason item — an honest dead-state rather
                              than an enabled no-op. */}
                          <Button variant="ghost" fullWidth
                            disabled={!currentCampaignId}
                            onClick={() => { setMenuOpen(false); onAdvanceTime?.(currentCampaignId); }}
                            icon={<Clock size={13} color={GOLD}/>}
                            title={currentCampaignId
                              ? 'Advance the campaign world and open the post-advance results'
                              : 'Add this settlement to a campaign below to advance its world.'}
                            style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6, fontSize:FS.sm, color:INK, fontWeight:500, borderRadius:3 }}>
                            Advance Time
                          </Button>

                          <div style={{ height:1, background:BORDER, margin:'2px 4px' }} />

                          {/* Constructive campaign membership — add / move. */}
                          {campaigns.map(c => c.id === currentCampaignId ? null : (
                            <Button variant="ghost" fullWidth key={c.id} onClick={() => { addToCampaign(c.id, s.id); setMenuOpen(false); }}
                              icon={<FolderOpen size={13} color={GOLD}/>}
                              title={currentCampaignId ? `Move to ${c.name}` : `Add to ${c.name}`}
                              style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6, fontSize:FS.sm, color:INK, fontWeight:500, borderRadius:3 }}>
                              {currentCampaignId ? 'Move to' : 'Add to'} {c.name}
                            </Button>
                          ))}
                          {/* Premium but no campaigns yet: route to the create-campaign
                              input in SettlementsPanel (was a path-less dead-end). */}
                          {canManageCampaigns && campaigns.length === 0 && (
                            <Button variant="ghost" fullWidth onClick={() => { setMenuOpen(false); onCreateCampaign?.(); }}
                              icon={<ArrowRight size={13} color={GOLD}/>}
                              title="Create a campaign to organize this settlement"
                              style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6, fontSize:FS.sm, color:INK, fontWeight:500, borderRadius:3 }}>
                              Create a campaign
                            </Button>
                          )}
                        </>
                      )}

                      {/* Destructive removal sits last, behind its own divider. */}
                      {currentCampaignId && (
                        <>
                          <div style={{ height:1, background:BORDER, margin:'2px 4px' }} />
                          <Button variant="ghost" fullWidth onClick={() => { removeFromCampaign(currentCampaignId, s.id); setMenuOpen(false); }}
                            style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', fontSize:FS.sm, color:swatch.danger, fontWeight:500, borderRadius:3 }}>
                            Remove from campaign
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Destructive: quiet icon-only, separated by a scale-based gap. */}
              <span style={{ marginLeft:SP.sm, display:'inline-flex', flexShrink:0 }}>
                <IconButton
                  Icon={Trash2}
                  label={`Delete ${s.name}`}
                  tone="danger"
                  size="md"
                  disabled={!active}
                  pressed={deleteId === s.id}
                  onClick={() => active && setDeleteId(deleteId === s.id ? null : s.id)}
                />
              </span>
            </>
          )}
        </div>
      </div>
      {/* Blocked-reactivation recovery — when the slots are full, the reason +
          the path forward render as a VISIBLE line (not the hover-only title),
          scoped to the blocked state so reactivatable/active cards stay clean. */}
      {!active && planInactive && !canReactivate && (
        <div data-card-actions style={{ padding:`0 ${SP.md}px ${SP.sm}px`, display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', fontSize:FS.xs, color:BODY }}>
          <span>Active-save slots are full.</span>
          <Button variant="ghost" size="sm" onClick={() => onNavigate?.('pricing')}
            style={{ padding:'6px 10px', fontSize:FS.xs, color:GOLD_TXT, fontWeight:700 }}>
            Free a slot or Upgrade
          </Button>
        </div>
      )}
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
