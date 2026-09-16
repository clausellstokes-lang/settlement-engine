import React, { useEffect, useRef, useState } from 'react';
import { FS, MUTED, swatch } from '../../theme.js';
import { serif, Section, TabIntro } from '../Primitives';
import { NarrativeNote } from '../NarrativeNote';
import { FACTION_COLORS } from '../tabConstants';
import { useStore } from '../../../store/index.js';
import { factionIdFromName } from '../../../lib/entities.js';
import { hasLadder, ladderRungsOf, ladderInstabilityOf, ladderFactionKeyOf } from '../../../domain/townMap/ladderRead.js';
import { PowerStrata } from './power/PowerStrata.jsx';

export function PowerTab({ powerStructure:r, settlement:s, narrativeNote }) {
  const [expandedFaction, setExpandedFaction] = useState(null);

  // Dossier hyperlink focus. When a link navigates to a faction (e.g. from an
  // NPC's affiliation), expand that faction's roster row and scroll it into view.
  // The focused row's ref scrolls itself once mounted, so it lands even on a
  // freshly mounted lazy tab. Keyed on focus `ts` so a repeat click re-fires.
  // Computed from `r` directly (not the destructured `pf` below) so it runs
  // BEFORE the early return and keeps hooks order stable.
  const focusedEntity = useStore(state => state.focusedEntity);
  const focusedRowRef = useRef(null);
  const focusFactionList = r?.factions || [];
  const focusIndex = focusedEntity?.id
    ? focusFactionList.findIndex(f => factionIdFromName(f.faction) === focusedEntity.id)
    : -1;
  useEffect(() => {
    if (focusIndex < 0) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- expand-on-hyperlink-focus is the intended additive affordance; keyed on `ts` to re-fire on repeat clicks
    setExpandedFaction(focusIndex);
    focusedRowRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, [focusedEntity?.ts, focusIndex]);

  if (!r) return <div style={{padding:32,textAlign:'center',color:MUTED}}>No power structure data.</div>;

  const {
    factions:pf = [],
    stability:m,
    recentConflict:h,
    publicLegitimacy:leg,
    criminalCaptureState:crimCapture,
  } = r;

  const conflicts     = s?.conflicts || [];
  const tensions      = s?.history?.currentTensions || [];

  const isStable   = (m||'').toLowerCase().includes('stable') && !(m||'').toLowerCase().includes('unstable');
  const isCritical = (m||'').toLowerCase().includes('critical') || m?.includes('siege') || m?.includes('Desperate');
  const stabilityColor = isCritical ? '#8b1a1a' : isStable ? '#1a5a28' : '#a0762a';
  const governing  = pf.find(f => f.isGoverning) || pf[0];

  // ── Criminal capture state display ─────────────────────────────────────────
  const CAPTURE = {
    none:        { color:'#1a5a28', bg:'#f0faf4', label:'No organised crime' },
    adversarial: { color:'#4a6a1a', bg:'#f4f8ec', label:'Criminal: Adversarial' },
    equilibrium: { color:'#8a4010', bg:'#fdf6ec', label:'Criminal: Tolerated' },
    corrupted:   { color:'#8b1a1a', bg:'#fdf4f4', label:'Criminal: Corrupted Officials' },
    capture:     { color:'#4a1a4a', bg:'#fdf0fc', label:'Criminal: Governance Captured' },
  };
  const captureStyle = CAPTURE[crimCapture] || CAPTURE.none;

  return (
    <div style={{paddingBottom:16}}>
      <TabIntro tabKey="power" />
      <NarrativeNote note={narrativeNote} />

      {/* ── PUBLIC LEGITIMACY BANNER ──────────────────────────────────────── */}
      {leg && (
        <div style={{
          background: leg.bg || '#faf8ec',
          border: `1px solid ${leg.color}40`,
          borderLeft: `4px solid ${leg.color}`,
          padding: '12px 16px', marginBottom: 14,
        }}>
          <div style={{display:'flex', alignItems:'flex-start', gap:16, flexWrap:'wrap'}}>
            {/* Score + label */}
            <div style={{flexShrink:0}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:leg.color,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>
                Public Legitimacy
              </div>
              <div style={{display:'flex',alignItems:'baseline',gap:8}}>
                <span style={{fontSize: FS['28'],fontWeight:800,color:leg.color,lineHeight:1}}>{leg.score}</span>
                <span style={{fontSize: FS['14'],fontWeight:700,color:leg.color}}>{leg.label}</span>
              </div>
            </div>
            {/* Breakdown chips */}
            <div style={{flex:1,minWidth:180}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>
                Score breakdown (base 50)
              </div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {Object.entries(leg.breakdown || {}).map(([k,v]) => (
                  <div key={k} style={{
                    fontSize:FS.xxs, fontWeight:700, padding:'2px 8px',
                    background: v > 0 ? '#f0faf4' : v < 0 ? '#fdf4f4' : '#f5f0e8',
                    color:      v > 0 ? '#1a5a28' : v < 0 ? '#8b1a1a' : '#9c8068',
                    border: `1px solid ${v > 0 ? '#a8d8b0' : v < 0 ? '#e8c0c0' : '#e0d0b0'}`,
                  }}>
                    {k} {v > 0 ? `+${v}` : v}
                  </div>
                ))}
              </div>
              {leg.governanceFractured && (
                <div style={{marginTop:8,background:swatch['#FAF8F4'],border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',padding:'6px 10px',fontSize: FS['11.5'],color:swatch['#5A1A1A'],lineHeight:1.4}}>
                  <strong>Governance fractured.</strong> Real decisions are being made informally. The faction that appears to govern is not the faction that governs.
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* ── STABILITY + GOVERNING AUTHORITY HEADER ───────────────────────── */}
      <div style={{
        background: isCritical?'#fdf4f4': isStable?'#f0faf4':'#fdf8e8',
        border: `1px solid ${isCritical?'#e8c0c0':isStable?'#a8d8b0':'#e0c860'}`,
        borderLeft: `4px solid ${stabilityColor}`,
        padding:'12px 16px', marginBottom:14,
      }}>
        <div style={{display:'flex',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>Stability</div>
            <div style={{fontSize:FS.lg,fontWeight:700,color:stabilityColor,lineHeight:1.3}}>{m}</div>
          </div>
          {governing && <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>Governing Authority</div>
            <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
              <span style={{fontSize: FS['14'],fontWeight:700,color:swatch.inkMag}}>{governing.faction}</span>
              <span style={{fontSize:FS.xs,fontWeight:700,color:stabilityColor}}>
                {governing.powerLabel || ''} ({governing.power})
              </span>
              {governing.modifier && (
                <span style={{fontSize:FS.micro,fontWeight:600,color:swatch['#5A6A1A'],background:swatch['#F0F4E0'],border:'1px solid #c8d890',padding:'0 5px',textTransform:'uppercase',letterSpacing:'0.03em'}}>
                  {governing.modifier}
                </span>
              )}
            </div>
          </div>}
          {/* Criminal capture state badge */}
          {crimCapture && crimCapture !== 'none' && (
            <div style={{flexShrink:0}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>Criminal Capture</div>
              <span style={{fontSize:FS.xxs,fontWeight:700,color:captureStyle.color,background:captureStyle.bg,border:`1px solid ${captureStyle.color}40`,padding:'2px 8px'}}>
                {captureStyle.label}
              </span>
            </div>
          )}
        </div>
        {h && <p style={{fontSize:FS.sm,color:swatch['#5A3A10'],lineHeight:1.5,margin:'8px 0 0',borderTop:`1px solid ${isCritical?'#e8c0c0':isStable?'#c8e8c8':'#e0c860'}`,paddingTop:8,fontStyle:'italic'}}>{h}</p>}
      </div>

      {/* ── THE THREE STRATA (owner order 2026-07-22) ─────────────────────────
          The flat "Power Distribution" list is replaced by three semantically
          distinct strata: THE POWERS (the seat + its contenders, dominant),
          THE FACTIONS (the full roster, lighter), THE WEB (the typed ties
          between them). Derived read-only from the settlement's own data.
          PowerTab keeps the roster expand/focus state so the NPC-faction-link
          focus affordance keeps landing on the right row. */}
      <PowerStrata
        settlement={s}
        powerStructure={r}
        expandedFaction={expandedFaction}
        setExpandedFaction={setExpandedFaction}
        focusIndex={focusIndex}
        focusedRowRef={focusedRowRef}
      />

      {/* ── THE LADDER (intra-faction standings; hidden when the ladder is dark) ──
          Wires the secrets-safe DM read-model (ladderRead / mirrorOf) into its declared
          host. Renders ONLY rung name + normalized standing (0..1) — never nids, covert
          marks, goals, or contest internals (the mirror already withholds those; the
          §13 secrets seam). Absent mirror ⇒ hasLadder false ⇒ section hidden ⇒ a dark
          world renders byte-identically. Lazy chunk (PowerTab is lazy). [game-feel-1] */}
      {hasLadder(s) && (() => {
        const rows = pf
          .map((f, i) => {
            const key = ladderFactionKeyOf(f);
            return { f, i, rungs: ladderRungsOf(s, key), instab: ladderInstabilityOf(s, key) };
          })
          .filter((row) => row.rungs.length > 0);
        if (!rows.length) return null;
        return (
          <Section title="The Ladder" collapsible defaultOpen>
            <div style={{fontSize:FS.xxs,color:MUTED,marginBottom:8,lineHeight:1.4}}>
              Who is rising within each faction: standing on the internal ladder, top rung first.
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:10}}>
              {rows.map(({ f, i, rungs, instab }) => {
                const c = FACTION_COLORS[i % FACTION_COLORS.length];
                return (
                  <div key={i}>
                    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
                      <div style={{width:9,height:9,background:c,flexShrink:0}}/>
                      <span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{f.faction}</span>
                      {instab > 0.05 && (
                        // Churn badge: the explainer rides aria-label (screen-reader-complete,
                        // touch-safe) — never a native title (the shrink-only title= census).
                        <span aria-label="Leadership churn: recent turnover at the top erodes effective power"
                          style={{fontSize:FS.micro,fontWeight:700,color:swatch.danger,background:`${swatch.danger}12`,border:`1px solid ${swatch.danger}40`,padding:'0 5px'}}>
                          unstable {Math.round(instab*100)}%
                        </span>
                      )}
                    </div>
                    <div style={{display:'flex',flexDirection:'column',gap:2}}>
                      {rungs.map((rung, j) => (
                        <div key={rung.npcId} style={{display:'flex',alignItems:'center',gap:8,padding:'1px 0 1px 15px'}}>
                          <span style={{fontSize:FS.micro,color:MUTED,width:14,flexShrink:0,textAlign:'right'}}>{j+1}</span>
                          <span style={{fontSize:FS.xs,fontWeight:j===0?700:600,color:swatch.inkMag2,flex:'0 0 42%',minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{rung.name}</span>
                          <div style={{flex:1,height:6,background:`${c}20`,overflow:'hidden'}}>
                            <div style={{width:`${Math.round(rung.standing*100)}%`,height:'100%',background:c}}/>
                          </div>
                          <span style={{fontSize:FS.micro,color:MUTED,width:28,flexShrink:0,textAlign:'right'}}>{Math.round(rung.standing*100)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </Section>
        );
      })()}

      {/* ── CURRENT TENSIONS ─────────────────────────────────────────────── */}
      {tensions.length > 0 && (
        <Section title={`Current Tensions (${tensions.length})`} collapsible defaultOpen accent="#b8860b">
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {tensions.map((t,i) => (
              <div key={i} style={{background:swatch['#FDF8E8'],border:'1px solid #e0c860',borderLeft:'3px solid #b8860b',padding:'9px 13px'}}>
                <p style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.5,margin:'0 0 4px'}}>{typeof t==='object'?t.description:t}</p>
                {t.factions?.length > 0 && (
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    {t.factions.map((f,j) => (
                      <span key={j} style={{fontSize:FS.xxs,fontWeight:600,color:swatch['#7A5010'],background:swatch['#F5E8C0'],padding:'0 6px'}}>{f}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* ── ACTIVE CONFLICTS ─────────────────────────────────────────────── */}
      {conflicts.length > 0 && (
        <Section title={`Active Conflicts (${conflicts.length})`} collapsible defaultOpen accent="#8b1a1a">
          {conflicts.map((c,i) => {
            const iHigh = c.intensity==='high', iLow = c.intensity==='low';
            const intColor = iHigh?'#8b1a1a':iLow?'#1a5a28':'#a0762a';
            const intLabel = iHigh?'HIGH TENSION':iLow?'LOW TENSION':'MODERATE';
            return (
              <div key={i} style={{background:swatch['#FAF8F4'],border:`1px solid ${intColor}40`,borderLeft:`3px solid ${intColor}`,padding:'12px 14px',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                  <span style={{...serif,fontSize: FS['14'],fontWeight:700,color:swatch.inkMag,flex:1}}>{c.parties?.[0]} vs {c.parties?.[1]}</span>
                  <span style={{fontSize:FS.micro,fontWeight:800,color:intColor,background:`${intColor}15`,padding:'2px 6px',letterSpacing:'0.05em',flexShrink:0}}>{intLabel}</span>
                </div>
                {c.issue  && <p style={{fontSize:FS.sm,color:swatch.inkMag3,margin:'0 0 4px'}}><strong>At issue:</strong> {c.issue}</p>}
                {c.stakes && <p style={{fontSize:FS.sm,color:swatch.inkMag3,margin:'0 0 8px'}}><strong>Stakes:</strong> {c.stakes}</p>}
                {c.plotHooks?.length > 0 && (
                  <div style={{borderTop:`1px solid ${intColor}30`,paddingTop:8}}>
                    <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.magic,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Plot Hooks</div>
                    {c.plotHooks.map((hook,j) => (
                      <div key={j} style={{display:'flex',gap:6,marginBottom:4}}>
                        <span style={{color:swatch.magic,flexShrink:0,fontSize:FS.sm}}>✦</span>
                        <p style={{fontSize:FS.sm,color:swatch.inkMag,lineHeight:1.45,margin:0}}>{typeof hook==='string'?hook:hook.hook||''}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </Section>
      )}

    </div>
  );
}

export default React.memo(PowerTab);
