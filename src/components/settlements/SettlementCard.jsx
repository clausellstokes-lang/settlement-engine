import { useMemo, useState, useRef, useEffect } from 'react';
import {Clock, FolderOpen, ArrowRight, Unlock, BookMarked, ChevronDown, Trash2, FileText} from 'lucide-react';

// AUDIT-2.2 — the paid-rights floor: a lapsed plan can always extract what it
// made. A retention-frozen card keeps a read-only PDF export. Lazy so the jsPDF
// chunk stays out of the Library first paint (mirrors CampaignFolder's export).
const generateSettlementPDF = (...args) =>
  import('../../utils/generateSettlementPDF.js').then(m => m.generateSettlementPDF(...args));
import { EFFECT_CATEGORIES, fmtMod } from '../../lib/relationshipGraph.js';
import { GOLD, GOLD_BG, GOLD_TXT, INK, MUTED, BODY, SECOND, BORDER, CARD, FS, SP, swatch, sans, serif_ } from '../theme.js';
import { isPlanInactiveSave, isSaveActive } from '../../lib/saveAccess.js';
import { canonPhaseOf } from './helpers.js';
import { settlementSignals, healthPip } from './livingWorldSignals.js';
import LivingWorldSignalRow from './LivingWorldSignalRow.jsx';
import HealthPip from './HealthPip.jsx';
import Button from '../primitives/Button.jsx';
import IconButton from '../primitives/IconButton.jsx';
import DeleteConfirmation from '../DeleteConfirmation';
import SettlementCardMapThumb from '../townMap/SettlementCardMapThumb.jsx';
import { emblem } from '../../design/organic/ornament/compose.js';
import { useStore } from '../../store/index.js';

// Relationship-type swatch for the neighbour chips (kept inline on OUR floor —
// the shared cross-surface palette adoption is a separate cosmetic dedupe).
const REL_COLORS = { rival:'#8b1a1a', cold_war:'#8b1a1a', hostile:'#8b1a1a', allied:'#1a5a28', secret_alliance:'#1a5a28', trade_partner:'#a0762a', patron:'#2a3a7a', client:'#2a3a7a', criminal_network:'#5a2a8a' };

// ── Ledger cell rhythm (C3 — THE LEDGER) ──────────────────────────────────────
// The Library list is a surveyor's ledger: a real <table> whose rows share
// column tracks. A feint top rule per cell is the row hairline; cells top-align
// so the tall Settlement cell governs the row height (MANIFEST 05 — generous, never
// cramped). No rounded fills, no elevation: depth is a rule of ink, not a shadow.
const LEDGER_CELL = { padding: `${SP.sm}px ${SP.md}px`, borderTop: `1px solid ${BORDER}`, verticalAlign: 'top' };
// The small-caps rubric — the ledger's head/marker voice (Organic Craft law §2).
const RUBRIC = { fontFamily: sans, fontSize: FS.xs, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' };
// Visually-hidden but focusable/clickable — the real checkbox behind the inked
// margin tally. The label wraps both input + glyph, so a click on the glyph (or
// keyboard focus + space) toggles the input; the tally is a pure visual re-vehicle.
const TALLY_INPUT_HIDDEN = { position: 'absolute', width: 1, height: 1, margin: -1, padding: 0, overflow: 'hidden', clip: 'rect(0 0 0 0)', border: 0, whiteSpace: 'nowrap' };

// ── Settlement Card — a ledger row (reused in campaigns + unassigned) ──────────
// Renders a <tr>: both call sites (the unassigned pile + each CampaignFolder) wrap
// it in a <table class ledger>, so a bare-mounted card is a <tr> under the test's
// container (jsdom-tolerant; every query is by text/label/testid, not tag).
export function SettlementCard({ s, allModifiers, onView, deleteId, setDeleteId, deleteConfirmed, campaigns, addToCampaign, removeFromCampaign, currentCampaignId, regionalCounts, onReactivate, canReactivate, reactivatingId, onCanonize, worldState = null, regionalGraph = null, nameFor, onAdvanceTime, onCreateCampaign, onNavigate, canManageCampaigns = false, selectMode = false, selected = false, onToggleSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const ts = (t) => {
    // An absent or unparseable timestamp must NEVER render the literal "Invalid
    // Date": new Date(undefined).toLocaleDateString() returns that string WITHOUT
    // throwing, so the try/catch alone never fires. Guard on getTime() NaN and
    // return '' so the caller can drop the whole line. (Owner-spotted defect 7b:
    // local/anon saves stamp only the numeric `savedAt`, never a top-level
    // `timestamp` — see saves.js localSaveEntry — so a fresh draft's `timestamp`
    // is undefined. The render below falls back to `savedAt`, which IS present.)
    const d = new Date(t);
    if (Number.isNaN(d.getTime())) return '';
    try { return d.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'}); } catch { return ''; }
  };
  const active = isSaveActive(s);
  const planInactive = isPlanInactiveSave(s);
  const isCanon = canonPhaseOf(s) === 'canon';
  const retentionUntil = s.retentionExpiresAt ? ts(s.retentionExpiresAt) : null;
  // The saved-on line: prefer the durable `timestamp` (Supabase updated_at), fall
  // back to the numeric `savedAt` epoch that the local save path always stamps.
  const savedWhen = ts(s.timestamp ?? s.savedAt);
  const campaignMutationVersion = useStore(state => {
    const advances = (state.advanceInFlight || []).map(String).join(',');
    const deletions = (state.campaignMutationLocks || []).map(lock => lock.token).join(',');
    return `${advances}|${deletions}`;
  });
  const mutationBlocks = useMemo(() => {
    // The version string is a cheap subscription trigger; the actual guarded
    // actions are read fresh so this card never closes over stale store methods.
    void campaignMutationVersion;
    const state = useStore.getState();
    return {
      deletion: !!state.getSettlementDeletionBlock?.([s.id]),
      removal: !!(currentCampaignId && state.getCampaignMutationBlock?.(currentCampaignId)),
      target: campaignId => !!state.getCampaignMembershipBlock?.(campaignId, s.id),
    };
  }, [campaignMutationVersion, currentCampaignId, s.id]);

  // AUDIT-2.2 — read-only PDF extraction for a retention-frozen save. Exports the
  // STORED settlement (never the live store, no worldState, no faith chapter, no
  // reactivation), so it can never resume the simulation — the lapsed-plan owner
  // gets out exactly what they made. Busy/error tracked so the click is never
  // silent (mirrors CampaignFolder.handleExportPdf).
  const [exportBusy, setExportBusy] = useState(false);
  const [exportError, setExportError] = useState(null);
  const handleExportFrozen = async () => {
    if (exportBusy) return;
    setExportError(null);
    setExportBusy(true);
    try {
      await generateSettlementPDF(s.settlement, { phase: canonPhaseOf(s) });
    } catch (err) {
      setExportError(err?.message ? `PDF export failed: ${err.message}` : 'PDF export failed. Please try again.');
    } finally {
      setExportBusy(false);
    }
  };

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

  // The settlement's own seeded medallion (16px), memoized per name — the same
  // ornament composer the dossier header + colophon draw from, so a settlement
  // carries ONE mark across every surface. Decorative (aria-hidden); the name
  // beside it is the accessible label.
  const medallion = useMemo(() => emblem(s.name || 'settlement', { mode: 'light', size: 16 }), [s.name]);

  // Memo-line — the settlement's active stressor, the SAME situation summary the
  // dossier header consumes (OutputContainer's stressObj derivation feeds
  // DossierHeaderRow, which renders stressObj.label). Read-only projection over the
  // live settlement blob; a settlement with no active stressor shows no memo-line.
  const stressObj = s.settlement?.stress
    ? (Array.isArray(s.settlement.stress) ? s.settlement.stress[0] : s.settlement.stress)
    : null;
  const memoLine = stressObj?.label || null;

  // The row's "world" after the interpunct — its owning campaign's name (the
  // ledger idiom "name · world"), resolved from the campaigns roster. Null for an
  // unassigned row (no campaign ⇒ just the name).
  const campaignName = currentCampaignId ? (campaigns || []).find(c => c.id === currentCampaignId)?.name : null;

  // Whole-row click is a MOUSE-ONLY convenience: the explicit Open button (and,
  // in select mode, the checkbox) is the real accessible affordance, so the row
  // carries no role/tabindex. Clicks from inside the action cluster, the kebab
  // menu, the select checkbox, the link chips, or the delete confirmation own
  // their own behaviour, so we early-return when the event came from within.
  const fromInteractive = (e) => !!e.target.closest?.('[data-card-actions], [data-card-select], [role="menu"], input, button, a');
  const handleCardActivate = (e) => {
    if (!active || fromInteractive(e)) return;
    if (selectMode) { onToggleSelect?.(s.id); return; }
    onView?.(s);
  };

  // Crisis/war drives a red semantic rail; canon a gold rail; selection wins with
  // gold; otherwise a transparent 3px keeps every row's text on one column edge.
  // Two-channel encoding: the rail is a second cue alongside the pips/checkbox, so
  // phase / crisis is readable from the row edge. Reads the SAME model the pips
  // render (signals.war + health.severity). severity >= 2 == Vulnerable/Critical.
  const inCrisis = !!signals?.war || (health?.severity ?? 0) >= 2;
  const railColor = inCrisis ? swatch.danger : (isCanon ? GOLD : null);
  const leadRail = selected ? `3px solid ${GOLD}` : railColor ? `3px solid ${railColor}` : `3px solid transparent`;
  // Row ground: inactive keeps its muted grey-tan; active rows sit on the page
  // parchment (no card fill — the ledger idiom is rows on the ground, parted by
  // rules, not boxes). Selection reads off the gold rail + the checked box, so no
  // fill is needed (elevation/tint are never spent here — kill-list).
  const rowBg = active ? undefined : swatch['#EEE9DF'];
  // Column count for the full-width confirmation / recovery rows. The tally column
  // exists only in select mode: [tally?] settlement · tier · phase · standing · actions.
  const colCount = (selectMode ? 1 : 0) + 4 + 1;

  return (
    <>
      {/* Mouse-only convenience: keyboard/SR users open via the explicit "Open"
          button, so the row carries NO role/tabindex — a keyboard handler here
          would re-create a nested-interactive ARIA violation. */}
      <tr
        data-testid="settlement-card"
        onClick={handleCardActivate}
        style={{ background: rowBg, cursor: active ? 'pointer' : 'default', opacity: active ? 1 : 0.68 }}
      >
        {selectMode && (
          // The margin tally — the select checkbox re-vehicled to the ledger's
          // left margin (SAME handler). The padded label widens the ~16px box
          // toward the ~44px target without changing the visible control.
          <td style={{ ...LEDGER_CELL, borderLeft: leadRail, width: 1, whiteSpace: 'nowrap' }}>
            <label
              data-card-select
              htmlFor={`select-${s.id}`}
              style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', padding:SP.xs, cursor: active ? 'pointer' : 'not-allowed' }}
            >
              {/* The margin tally — the select control re-vehicled to an inked
                  ledger tick (SAME input + handler). The native checkbox chrome is
                  visually hidden behind an inked square; the input stays the
                  accessible, focusable control. */}
              <input
                id={`select-${s.id}`}
                type="checkbox"
                checked={selected}
                disabled={!active}
                onChange={() => active && onToggleSelect?.(s.id)}
                aria-label={`Select ${s.name}`}
                style={TALLY_INPUT_HIDDEN}
              />
              <span aria-hidden="true" style={{ width:14, height:14, flexShrink:0, display:'inline-flex', alignItems:'center', justifyContent:'center', border:`1px solid ${selected ? GOLD : BORDER}`, color:GOLD, fontSize:FS.xs, fontWeight:800, lineHeight:1, opacity: active ? 1 : 0.5 }}>{selected ? '✓' : ''}</span>
            </label>
          </td>
        )}

        {/* ── Settlement — medallion + name lead the row; the retained living-world
            detail stacks below (self-gating, byte-identical when dormant). */}
        <td style={selectMode ? LEDGER_CELL : { ...LEDGER_CELL, borderLeft: leadRail }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:SP.sm, minWidth:0 }}>
            <span aria-hidden="true" style={{ flexShrink:0, lineHeight:0, alignSelf:'center' }} dangerouslySetInnerHTML={{ __html: medallion }} />
            {/* The name is a real heading so screen-reader users navigate row-by-row. */}
            <h3 style={{ margin:0, fontSize:FS.lg, fontWeight:700, color:INK, fontFamily:serif_, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', minWidth:0 }}>{s.name}</h3>
            {/* "name · world" — the owning campaign after the interpunct. */}
            {campaignName && <span style={{ fontSize:FS.sm, color:SECOND, whiteSpace:'nowrap', flexShrink:0 }}><span aria-hidden="true">· </span>{campaignName}</span>}
          </div>
          {/* Memo-line — the settlement's live situation, in the surveyor's italic. */}
          {memoLine && <div style={{ marginTop:2, fontStyle:'italic', fontSize:FS.sm, color:SECOND }}>{memoLine}</div>}

          {/* Living-world detail — retained verbatim; the row is self-gating so a
              peaceful, non-campaign, deity-free card shows only the identity line. */}
          <div style={{ marginTop:SP.sm, display:'flex', flexDirection:'column', gap:SP.xs }}>
            {/* SM-4 — the lazy, cached town-map thumbnail. Self-collapses to nothing
                for a map-less settlement / a canvas-less env. IT-3: worldState threads
                the owning campaign's season/state dress (null ⇒ seasonless base bytes). */}
            {s.settlement && <SettlementCardMapThumb settlement={s.settlement} worldState={worldState} />}
            {/* Living-world signal row (self-gating — nothing for a peaceful card). */}
            <LivingWorldSignalRow model={signals} />
            {!active && (
              <div style={{ fontSize:FS.xs, color:GOLD_TXT, background:GOLD_BG, padding:'2px 6px', display:'inline-flex', alignItems:'center', gap:4, fontWeight:700, alignSelf:'flex-start' }}>
                Frozen{retentionUntil ? ` until ${retentionUntil}` : ''}. Reactivate or export.
              </div>
            )}
            {/* AUDIT-2.2 — a failed read-only export is surfaced here (not silent). */}
            {exportError && (
              <div role="alert" style={{ fontSize:FS.xs, color:swatch.danger, fontFamily:sans }}>{exportError}</div>
            )}
            {/* Blocked-reactivation recovery — when the slots are full, the reason +
                the path forward render as a VISIBLE line (not the hover-only title),
                scoped to the blocked state so reactivatable/active rows stay clean. */}
            {!active && planInactive && !canReactivate && (
              <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', fontSize:FS.xs, color:BODY }}>
                <span>Active-save slots are full.</span>
                <Button variant="ghost" size="sm" onClick={() => onNavigate?.('pricing')}
                  style={{ padding:'6px 10px', fontSize:FS.xs, color:GOLD_TXT, fontWeight:700 }}>
                  Free a slot or Upgrade
                </Button>
              </div>
            )}

            {/* Connections + network metadata — STATIC reference detail. Ordered
                neighbours → effects → regional counts. */}
            {(s.settlement?.neighbourNetwork?.length > 0
              || allModifiers.get(s.id)?.sources?.length > 0
              || (regionalCounts && (regionalCounts.queued || regionalCounts.applied || regionalCounts.resolved) > 0)) && (
              <div style={{ display:'flex', flexDirection:'column', gap:SP.xs }}>
                {(s.settlement?.neighbourNetwork?.length > 0) && (
                  <div style={{ display:'flex', gap:SP.xs, flexWrap:'wrap' }}>
                    {(s.settlement.neighbourNetwork||[]).slice(0,3).map((n,ni) => {
                      const nc = REL_COLORS[n.relationshipType] || MUTED;
                      return <span key={ni} style={{ fontSize:FS.xs, fontWeight:500, color:SECOND, background:`${nc}12`, padding:'1px 6px', whiteSpace:'nowrap' }}>
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
                      return <span key={c.key} title={`${c.label} ${fmtMod(v)}`} style={{ fontSize:FS.xs, fontWeight:500, color:pos?swatch.success:swatch.danger, background:pos?swatch.successBg:swatch.dangerBg, padding:'1px 5px', whiteSpace:'nowrap' }}>
                        {c.label}: {pos ? 'helped' : 'hurt'}
                      </span>;
                    })}
                  </div>;
                })()}
                {regionalCounts && (regionalCounts.queued || regionalCounts.applied || regionalCounts.resolved) > 0 && (
                  <div style={{ display:'flex', gap:SP.xs, flexWrap:'wrap' }}>
                    {regionalCounts.queued > 0 && (
                      <span style={{ fontSize:FS.xs, fontWeight:500, color:SECOND, background:GOLD_BG, padding:'1px 6px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:2 }}>
                        {regionalCounts.queued} changes queued
                      </span>
                    )}
                    {regionalCounts.applied > 0 && (
                      <span style={{ fontSize:FS.xs, fontWeight:500, color:SECOND, background:swatch.successBg, padding:'1px 6px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:2 }}>
                        {regionalCounts.applied} applied
                      </span>
                    )}
                    {regionalCounts.resolved > 0 && (
                      <span style={{ fontSize:FS.xs, fontWeight:500, color:SECOND, background:swatch.infoBg, padding:'1px 6px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:2 }}>
                        {regionalCounts.resolved} resolved
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* The compact 1-5 LifecycleSpine dots were removed here (legibility
                wave, 2026-07-22): unlabeled numbered dots contradicted the Phase
                column two cells away (a Draft save read Phase 'Draft' while the
                spine marked stage-2 'Saved' as current). The Phase column is now
                the single lifecycle encoding on a row. LifecycleSpine keeps its
                labelled non-compact uses elsewhere. */}
            {/* Save metadata — the LEAST table-relevant fact, pushed below.
                Dropped entirely when no parseable timestamp exists, so an absent
                or malformed date never renders as "Invalid Date" (defect 7b). */}
            {savedWhen && (
              <div style={{ fontSize:FS.xs, color:BODY, display:'flex', alignItems:'center', gap:6 }}>
                <Clock size={10}/> {savedWhen}
              </div>
            )}
          </div>
        </td>

        {/* ── Tier */}
        <td style={LEDGER_CELL}>
          <span style={{ fontSize:FS.sm, color:BODY, textTransform:'capitalize', whiteSpace:'nowrap' }}>{s.tier}</span>
        </td>

        {/* ── Phase — CANON as a small-caps rubric; drafts read quiet. */}
        <td style={LEDGER_CELL}>
          {isCanon
            ? <span style={{ ...RUBRIC, color:GOLD_TXT }}>Canon</span>
            : <span style={{ fontSize:FS.sm, color:SECOND }}>Draft</span>}
        </td>

        {/* ── Health — the worst health-band word (Stable / Strained / Vulnerable
            / Critical), each a click-to-learn glossary term via HealthPip. The
            bare dash previously swallowed every non-attention band (a Strained
            town read as blank); now a settlement with derivable state always
            carries its plain band word (legibility wave, 2026-07-22). The dash
            remains only when no system-state can be derived. */}
        <td style={{ ...LEDGER_CELL, whiteSpace:'nowrap' }}>
          {health
            ? <HealthPip pip={health}/>
            : <span aria-hidden="true" style={{ color:MUTED }}>–</span>}
        </td>

        {/* ── Action cluster — ONE primary (Open), rare actions behind a kebab
            overflow, destructive Delete demoted to a separated small ghost icon.
            Reactivation replaces Open for plan-inactive saves. */}
        <td data-card-actions style={{ ...LEDGER_CELL, textAlign:'right', whiteSpace:'nowrap' }}>
          <div style={{ display:'inline-flex', gap:SP.xs, alignItems:'center' }}>
          {!active && planInactive ? (
            <>
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
              {/* AUDIT-2.2 — read-only extraction, always available on a frozen
                  save even without an active plan. Subordinate to the gold
                  Reactivate: a quiet outline that never resumes the simulation. */}
              <Button
                variant="info"
                size="sm"
                onClick={handleExportFrozen}
                disabled={exportBusy}
                busy={exportBusy}
                icon={<FileText size={12}/>}
                title="Export this settlement as a PDF, yours to keep even while frozen"
              >
                {exportBusy ? 'Exporting…' : 'Export PDF'}
              </Button>
            </>
          ) : (
            <>
              {/* The whole row is the primary open target; this is the explicit,
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
                    <div role="menu" style={{ position:'absolute', right:0, top:'100%', marginTop:4, zIndex:20, background:CARD, border:`1px solid ${BORDER}`, boxShadow:'0 4px 16px rgba(0,0,0,0.15)', minWidth:200, padding:4, display:'flex', flexDirection:'column', gap:1, textAlign:'left' }}>
                      {/* Canonize (draft → canon) or a static Canon marker. */}
                      {!isCanon ? (
                        <Button variant="ghost" fullWidth onClick={() => { onCanonize?.(s); setMenuOpen(false); }}
                          icon={<BookMarked size={13} color={GOLD}/>}
                          title="Canonize: lock names and start the campaign timeline"
                          style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6, fontSize:FS.sm, color:INK, fontWeight:500 }}>
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
                          style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6, fontSize:FS.sm, color:GOLD_TXT, fontWeight:500 }}>
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
                            style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6, fontSize:FS.sm, color:INK, fontWeight:500 }}>
                            Advance Time
                          </Button>

                          <div style={{ height:1, background:BORDER, margin:'2px 4px' }} />

                          {/* Constructive campaign membership — add / move. */}
                          {campaigns.map(c => c.id === currentCampaignId ? null : (
                            <Button variant="ghost" fullWidth key={c.id} disabled={mutationBlocks.target(c.id)} onClick={() => {
                              const result = addToCampaign(c.id, s.id);
                              if (result?.ok !== false) setMenuOpen(false);
                            }}
                              icon={<FolderOpen size={13} color={GOLD}/>}
                              title={currentCampaignId ? `Move to ${c.name}` : `Add to ${c.name}`}
                              style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6, fontSize:FS.sm, color:INK, fontWeight:500 }}>
                              {currentCampaignId ? 'Move to' : 'Add to'} {c.name}
                            </Button>
                          ))}
                          {/* Premium but no campaigns yet: route to the create-campaign
                              input in SettlementsPanel (was a path-less dead-end). */}
                          {canManageCampaigns && campaigns.length === 0 && (
                            <Button variant="ghost" fullWidth onClick={() => { setMenuOpen(false); onCreateCampaign?.(); }}
                              icon={<ArrowRight size={13} color={GOLD}/>}
                              title="Create a campaign to organize this settlement"
                              style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', gap:6, fontSize:FS.sm, color:INK, fontWeight:500 }}>
                              Create a campaign
                            </Button>
                          )}
                        </>
                      )}

                      {/* Destructive removal sits last, behind its own divider. */}
                      {currentCampaignId && (
                        <>
                          <div style={{ height:1, background:BORDER, margin:'2px 4px' }} />
                          <Button variant="ghost" fullWidth disabled={mutationBlocks.removal} onClick={() => {
                            const result = removeFromCampaign(currentCampaignId, s.id);
                            if (result?.ok !== false) setMenuOpen(false);
                          }}
                            style={{ justifyContent:'flex-start', textAlign:'left', padding:'6px 8px', fontSize:FS.sm, color:swatch.danger, fontWeight:500 }}>
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
                  disabled={!active || mutationBlocks.deletion}
                  pressed={deleteId === s.id}
                  onClick={() => active && setDeleteId(deleteId === s.id ? null : s.id)}
                />
              </span>
            </>
          )}
          </div>
        </td>
      </tr>

      {/* Delete confirmation — a full-width ledger row. DeleteConfirmation carries
          its own frame + confirm/cancel controls. */}
      {deleteId === s.id && (
        <tr>
          <td colSpan={colCount} style={{ padding:0 }}>
            <DeleteConfirmation
              entityName={s.name}
              details={(s.settlement?.neighbourNetwork||[]).length > 0
                ? `This settlement has ${s.settlement.neighbourNetwork.length} neighbour link(s). Deleting it will remove those relationships from linked settlements. This settlement will be gone for good. Export a copy first if you want to keep one.`
                : 'This settlement will be gone for good. Export a copy first if you want to keep one.'}
              onConfirm={() => deleteConfirmed(s.id)}
              onCancel={() => setDeleteId(null)}
            />
          </td>
        </tr>
      )}
    </>
  );
}
