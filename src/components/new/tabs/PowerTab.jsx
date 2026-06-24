import React, { useState, useEffect, useRef } from 'react';
import { FS, MUTED, swatch } from '../../theme.js';
import { serif, Section, TabIntro } from '../Primitives';
import { NarrativeNote } from '../NarrativeNote';
import { PowerSuccessionSection } from '../../dossier/EngineSections.jsx';
import { entityAnchor, entityIdFor } from '../../../domain/dossier/entityLinks.js';
import { factionIdFromName } from '../../../lib/entities.js';
import { useStore } from '../../../store/index.js';
import EntityLink from '../../primitives/EntityLink.jsx';

export function PowerTab({ powerStructure:r, settlement:s, narrativeNote }) {
  const [expandedFaction, setExpandedFaction] = useState(null);

  // Dossier hyperlink focus. When a link navigates to a faction (e.g. from an
  // NPC's affiliation), expand that faction's row and scroll it into view. The
  // row's own ref scrolls itself once mounted, so it lands even on a freshly
  // mounted lazy tab. Keyed on focus `ts` so a repeat click re-fires.
  const focusedEntity = useStore(state => state.focusedEntity);
  const focusedRowRef = useRef(null);

  // Resolve the focused faction's row index (or -1). Computed from `r` directly
  // so this runs before the early return below and keeps hooks order stable.
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
    factionRelationships:_rels = [], // retained for backend use
    criminalCaptureState:crimCapture,
  } = r;

  const conflicts     = s?.conflicts || [];
  const factionGroups = s?.factions  || [];
  const tensions      = s?.history?.currentTensions || [];

  const FACTION_COLORS = ['#a0762a','#8b1a1a','#1a4a2a','#2a3a7a','#5a2a8a','#3a1a6a','#6a3a1a'];
  const total = pf.reduce((n,f) => n + (f.power||0), 0) || 100;

  const isStable   = (m||'').toLowerCase().includes('stable') && !(m||'').toLowerCase().includes('unstable');
  const isCritical = (m||'').toLowerCase().includes('critical') || m?.includes('siege') || m?.includes('Desperate');
  const stabilityColor = isCritical ? '#8b1a1a' : isStable ? '#1a5a28' : '#a0762a';
  const governing  = pf.find(f => f.isGoverning) || pf[0];

  // ── Relationship type config ────────────────────────────────────────────────
  const _REL = {
    symbiotic:   { color:'#1a5a28', bg:'#f0faf4', border:'#a8d8b0', icon:'⇌', label:'Symbiotic'   },
    dependent:   { color:'#1a3a6a', bg:'#f0f4fa', border:'#a8c0d8', icon:'↔', label:'Dependent'   },
    subordinate: { color:'#4a6a1a', bg:'#f4f8ec', border:'#b8d8a0', icon:'↓', label:'Subordinate' },
    tense:       { color:'#8a4010', bg:'#fdf6ec', border:'#e0c070', icon:'~', label:'Tense'       },
    competitive: { color:'#8b1a1a', bg:'#fdf4f4', border:'#e8c0c0', icon:'X', label:'Competitive' },
    corrupted:   { color:'#4a1a4a', bg:'#fdf0fc', border:'#d8a0d8', icon:'!', label:'Corrupted'   },
  };

  // ── Criminal capture state display ─────────────────────────────────────────
  const CAPTURE = {
    none:        { color:'#1a5a28', bg:'#f0faf4', label:'No organised crime' },
    adversarial: { color:'#4a6a1a', bg:'#f4f8ec', label:'Criminal: Adversarial' },
    equilibrium: { color:'#8a4010', bg:'#fdf6ec', label:'Criminal: Tolerated' },
    corrupted:   { color:'#8b1a1a', bg:'#fdf4f4', label:'Criminal: Corrupted Officials' },
    capture:     { color:'#4a1a4a', bg:'#fdf0fc', label:'Criminal: Governance Captured' },
  };
  const captureStyle = CAPTURE[crimCapture] || CAPTURE.none;

  // ── Power label colour ─────────────────────────────────────────────────────
  const powerLabelColor = lbl =>
    lbl === 'Dominant'    ? '#1a3a6a' :
    lbl === 'Strong'      ? '#1a5a28' :
    lbl === 'Significant' ? '#a0762a' :
    lbl === 'Minor'       ? '#6b5340' : '#9c8068';

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
          borderRadius: 8, padding: '12px 16px', marginBottom: 14,
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
                    fontSize:FS.xxs, fontWeight:700, borderRadius:4, padding:'2px 8px',
                    background: v > 0 ? '#f0faf4' : v < 0 ? '#fdf4f4' : '#f5f0e8',
                    color:      v > 0 ? '#1a5a28' : v < 0 ? '#8b1a1a' : '#9c8068',
                    border: `1px solid ${v > 0 ? '#a8d8b0' : v < 0 ? '#e8c0c0' : '#e0d0b0'}`,
                  }}>
                    {k} {v > 0 ? `+${v}` : v}
                  </div>
                ))}
              </div>
              {leg.governanceFractured && (
                <div style={{marginTop:8,background:swatch.dangerBg,border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',borderRadius:5,padding:'6px 10px',fontSize: FS['11.5'],color:swatch['#5A1A1A'],lineHeight:1.4}}>
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
        borderRadius:8, padding:'12px 16px', marginBottom:14,
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
                <span style={{fontSize:FS.micro,fontWeight:600,color:swatch['#5A6A1A'],background:swatch['#F0F4E0'],border:'1px solid #c8d890',borderRadius:3,padding:'0 5px',textTransform:'uppercase',letterSpacing:'0.03em'}}>
                  {governing.modifier}
                </span>
              )}
            </div>
          </div>}
          {/* Criminal capture state badge */}
          {crimCapture && crimCapture !== 'none' && (
            <div style={{flexShrink:0}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>Criminal Capture</div>
              <span style={{fontSize:FS.xxs,fontWeight:700,color:captureStyle.color,background:captureStyle.bg,border:`1px solid ${captureStyle.color}40`,borderRadius:4,padding:'2px 8px'}}>
                {captureStyle.label}
              </span>
            </div>
          )}
        </div>
        {h && <p style={{fontSize:FS.sm,color:swatch['#5A3A10'],lineHeight:1.5,margin:'8px 0 0',borderTop:`1px solid ${isCritical?'#e8c0c0':isStable?'#c8e8c8':'#e0c860'}`,paddingTop:8,fontStyle:'italic'}}>{h}</p>}
      </div>

      {/* ── POWER DISTRIBUTION ───────────────────────────────────────────── */}
      <Section title={`Power Distribution · ${pf.length} Factions`} collapsible defaultOpen>
        {/* Stacked bar */}
        <div style={{display:'flex',height:22,borderRadius:5,overflow:'hidden',marginBottom:12,gap:1}}>
          {pf.map((f,i) => {
            const pct = Math.round((f.power||0) / total * 100);
            const c   = FACTION_COLORS[i % FACTION_COLORS.length];
            return (
              <div key={i} title={`${f.faction}: ${pct}% (power ${f.power})`}
                role="button" tabIndex={0} aria-label={`${f.faction}: ${pct}% (power ${f.power})`}
                style={{flex:pct,background:c,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',cursor:'pointer'}}
                onClick={() => setExpandedFaction(expandedFaction===i ? null : i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedFaction(expandedFaction===i ? null : i); } }}>
                {pct > 8 && <span style={{fontSize:FS.micro,fontWeight:800,color:swatch.white,userSelect:'none'}}>{pct}%</span>}
              </div>
            );
          })}
        </div>

        {/* Faction rows */}
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {pf.map((f,i) => {
            const c      = FACTION_COLORS[i % FACTION_COLORS.length];
            const isExp  = expandedFaction === i;
            const _pct    = Math.round((f.power||0) / total * 100);
            const powerChanged = f.rawPower && f.rawPower !== f.power;
            const _mods   = (f.modifiers||[]).concat(f.modifier ? [f.modifier] : []);
            const matchedGroups = factionGroups.filter(fg => fg.powerFactionName === f.faction);

            return (
              <div
                key={i}
                id={entityAnchor('faction', f, f.faction)}
                ref={i === focusIndex ? focusedRowRef : null}
              >
                <div style={{display:'flex',alignItems:'center',gap:7,padding:'6px 8px',borderRadius:5,
                  background:isExp?'#f5f0e8':f.legitimacyCrisis?'#fdf4f4':'transparent',
                  cursor:f.desc?'pointer':'default',
                  border: f.legitimacyCrisis ? '1px solid #e8c0c0' : '1px solid transparent',
                }}
                  {...(f.desc ? {
                    role: 'button',
                    tabIndex: 0,
                    'aria-label': `${f.faction} faction details`,
                    onClick: () => setExpandedFaction(isExp ? null : i),
                    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedFaction(isExp ? null : i); } },
                  } : {})}>
                  <div style={{width:11,height:11,borderRadius:2,background:c,flexShrink:0}}/>
                  {f.isGoverning && <span style={{fontSize:FS.xs,color:c,flexShrink:0}}></span>}
                  {f.legitimacyCrisis && <span style={{fontSize:FS.xxs,color:swatch.danger,flexShrink:0}}>⚠</span>}
                  <span style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag,flex:1,minWidth:0,lineHeight:1.2}}>{f.faction}</span>
                  {/* Power label */}
                  {f.powerLabel && (
                    <span style={{fontSize:FS.micro,fontWeight:700,color:powerLabelColor(f.powerLabel),background:`${powerLabelColor(f.powerLabel)}12`,border:`1px solid ${powerLabelColor(f.powerLabel)}30`,borderRadius:3,padding:'1px 5px',flexShrink:0,textTransform:'uppercase',letterSpacing:'0.04em'}}>
                      {f.powerLabel}
                    </span>
                  )}
                  {/* Power with multiplier note if modified */}
                  <span style={{fontSize:FS.xs,fontWeight:700,color:c,flexShrink:0,minWidth:44,textAlign:'right'}}>
                    {powerChanged && <span style={{fontSize:FS.micro,color:MUTED,marginRight:3}}>{f.rawPower}→</span>}
                    {f.power}
                  </span>
                  {matchedGroups.length > 0 && (
                    <span style={{fontSize:FS.micro,fontWeight:600,color:c,background:`${c}15`,border:`1px solid ${c}40`,borderRadius:3,padding:'1px 5px',flexShrink:0}}>
                      {matchedGroups.reduce((n,g) => n+(g.members||[]).length, 0)}m
                    </span>
                  )}
                  {f.desc && <span style={{fontSize:FS.xxs,color:MUTED,flexShrink:0}}>{isExp?'▲':'▼'}</span>}
                </div>

                {/* Sub-faction groups */}
                {matchedGroups.map((fg,gi) => (
                  <div key={gi} style={{display:'flex',alignItems:'center',gap:6,padding:'3px 8px 3px 24px',marginTop:1,background:`${c}08`,borderLeft:`2px solid ${c}30`,borderRadius:'0 0 4px 0'}}>
                    <span style={{fontSize:FS.xxs,color:c}}>↳</span>
                    <span style={{fontSize:FS.xs,fontWeight:700,color:swatch.inkMag,flex:1}}>{fg.name}</span>
                    <span style={{fontSize:FS.xxs,color:swatch.inkMag3}}>{(fg.members||[]).length} member{(fg.members||[]).length!==1?'s':''}</span>
                  </div>
                ))}

                {/* Expanded description */}
                {isExp && f.desc && (
                  <div style={{padding:'6px 12px 8px 28px',background:swatch['#FAF8F4'],borderLeft:`2px solid ${c}`,marginLeft:4,marginBottom:4,marginTop:2,borderRadius:'0 0 4px 4px'}}>
                    <p style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.65,margin:'0 0 4px'}}>{f.desc}</p>
                    {f.crisisNote && (
                      <p style={{fontSize: FS['11.5'],color:swatch.danger,fontStyle:'italic',margin:'6px 0 0',lineHeight:1.4}}>⚠ {f.crisisNote}</p>
                    )}
                    {matchedGroups.length > 0 && (
                      <div style={{marginTop:8}}>
                        <span style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.05em',marginRight:8}}>Associated:</span>
                        {matchedGroups.flatMap(g => g.members||[]).slice(0,5).map((mem,j) => (
                          <span key={j} style={{fontSize:FS.xxs,color:c,background:`${c}15`,border:`1px solid ${c}35`,borderRadius:8,padding:'1px 7px',marginRight:4,display:'inline-block',marginBottom:2}}>
                            {/* Sub-faction member → its NPC card (rename-safe; plain text if no NPC record). */}
                            <EntityLink id={entityIdFor('npc', mem, mem.name)} type="npc" fallback={mem.name} style={{color:c,textDecorationColor:`${c}80`}} /> <span style={{color:MUTED}}>({mem.role})</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>



      {/* ── CURRENT TENSIONS ─────────────────────────────────────────────── */}
      {tensions.length > 0 && (
        <Section title={`Current Tensions (${tensions.length})`} collapsible defaultOpen accent="#b8860b">
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {tensions.map((t,i) => (
              <div key={i} style={{background:swatch['#FDF8E8'],border:'1px solid #e0c860',borderLeft:'3px solid #b8860b',borderRadius:6,padding:'9px 13px'}}>
                <p style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.5,margin:'0 0 4px'}}>{typeof t==='object'?t.description:t}</p>
                {t.factions?.length > 0 && (
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    {t.factions.map((f,j) => (
                      <span key={j} style={{fontSize:FS.xxs,fontWeight:600,color:swatch['#7A5010'],background:swatch['#F5E8C0'],borderRadius:3,padding:'0 6px'}}>
                        {/* Structured faction ref → its Power row (rename-safe; plain text if absent). */}
                        <EntityLink id={factionIdFromName(f)} type="faction" fallback={f} style={{color:swatch['#7A5010'],textDecorationColor:`${swatch['#7A5010']}80`}} />
                      </span>
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
              <div key={i} style={{background:swatch['#FAF8F4'],border:`1px solid ${intColor}40`,borderLeft:`3px solid ${intColor}`,borderRadius:7,padding:'12px 14px',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                  {/* Conflict parties are structured faction refs → their Power
                      rows (rename-safe; each degrades to plain text if its
                      faction is absent from the index). The plot-hook prose
                      below is intentionally NOT linked — structured refs only. */}
                  <span style={{...serif,fontSize: FS['14'],fontWeight:700,color:swatch.inkMag,flex:1}}>
                    <EntityLink id={factionIdFromName(c.parties?.[0])} type="faction" fallback={c.parties?.[0] || ''} style={{...serif,color:swatch.inkMag}} />
                    {c.parties?.[1] ? <> vs <EntityLink id={factionIdFromName(c.parties[1])} type="faction" fallback={c.parties[1]} style={{...serif,color:swatch.inkMag}} /></> : null}
                  </span>
                  <span style={{fontSize:FS.micro,fontWeight:800,color:intColor,background:`${intColor}15`,borderRadius:3,padding:'2px 6px',letterSpacing:'0.05em',flexShrink:0}}>{intLabel}</span>
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

      {/* UX overhaul Phase 2 — ruler identity, coup-risk forecast (coupContenders),
          government lineage (previousGovernments / conquest provenance). Self-gates
          to nothing for a placeholder with no ruler, challengers, or lineage. */}
      <PowerSuccessionSection settlement={s} />

    </div>
  );
}

export default React.memo(PowerTab);
