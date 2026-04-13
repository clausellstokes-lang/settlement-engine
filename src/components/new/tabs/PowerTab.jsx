import React, { useState } from 'react';
import { serif, Section } from '../Primitives';
import { isMobile } from '../tabConstants';
import { NarrativeNote } from '../NarrativeNote';

export function PowerTab({ powerStructure:r, settlement:s, narrativeNote }) {
  const [expandedFaction, setExpandedFaction] = useState(null);
  const mobile = isMobile();

  if (!r) return <div style={{padding:32,textAlign:'center',color:'#9c8068'}}>No power structure data.</div>;

  const {
    factions:pf = [],
    stability:m,
    recentConflict:h,
    publicLegitimacy:leg,
    factionRelationships:rels = [], // retained for backend use
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
  const REL = {
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
    adversarial: { color:'#4a6a1a', bg:'#f4f8ec', label:'Criminal — Adversarial' },
    equilibrium: { color:'#8a4010', bg:'#fdf6ec', label:'Criminal — Tolerated' },
    corrupted:   { color:'#8b1a1a', bg:'#fdf4f4', label:'Criminal — Corrupted Officials' },
    capture:     { color:'#4a1a4a', bg:'#fdf0fc', label:'Criminal — Governance Captured' },
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
              <div style={{fontSize:9,fontWeight:700,color:leg.color,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>
                Public Legitimacy
              </div>
              <div style={{display:'flex',alignItems:'baseline',gap:8}}>
                <span style={{fontSize:28,fontWeight:800,color:leg.color,lineHeight:1}}>{leg.score}</span>
                <span style={{fontSize:14,fontWeight:700,color:leg.color}}>{leg.label}</span>
              </div>
            </div>
            {/* Breakdown chips */}
            <div style={{flex:1,minWidth:180}}>
              <div style={{fontSize:9,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>
                Score breakdown (base 50)
              </div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {Object.entries(leg.breakdown || {}).map(([k,v]) => (
                  <div key={k} style={{
                    fontSize:10, fontWeight:700, borderRadius:4, padding:'2px 8px',
                    background: v > 0 ? '#f0faf4' : v < 0 ? '#fdf4f4' : '#f5f0e8',
                    color:      v > 0 ? '#1a5a28' : v < 0 ? '#8b1a1a' : '#9c8068',
                    border: `1px solid ${v > 0 ? '#a8d8b0' : v < 0 ? '#e8c0c0' : '#e0d0b0'}`,
                  }}>
                    {k} {v > 0 ? `+${v}` : v}
                  </div>
                ))}
              </div>
              {leg.governanceFractured && (
                <div style={{marginTop:8,background:'#fdf4f4',border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',borderRadius:5,padding:'6px 10px',fontSize:11.5,color:'#5a1a1a',lineHeight:1.4}}>
                  <strong>Governance fractured.</strong> Real decisions are being made informally — the faction that appears to govern is not the faction that governs.
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
            <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>Stability</div>
            <div style={{fontSize:15,fontWeight:700,color:stabilityColor,lineHeight:1.3}}>{m}</div>
          </div>
          {governing && <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:3}}>Governing Authority</div>
            <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
              <span style={{fontSize:14,fontWeight:700,color:'#1c1409'}}>{governing.faction}</span>
              <span style={{fontSize:11,fontWeight:700,color:stabilityColor}}>
                {governing.powerLabel || ''} ({governing.power})
              </span>
              {governing.modifier && (
                <span style={{fontSize:9,fontWeight:600,color:'#5a6a1a',background:'#f0f4e0',border:'1px solid #c8d890',borderRadius:3,padding:'0 5px',textTransform:'uppercase',letterSpacing:'0.03em'}}>
                  {governing.modifier}
                </span>
              )}
            </div>
          </div>}
          {/* Criminal capture state badge */}
          {crimCapture && crimCapture !== 'none' && (
            <div style={{flexShrink:0}}>
              <div style={{fontSize:9,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>Criminal Capture</div>
              <span style={{fontSize:10,fontWeight:700,color:captureStyle.color,background:captureStyle.bg,border:`1px solid ${captureStyle.color}40`,borderRadius:4,padding:'2px 8px'}}>
                {captureStyle.label}
              </span>
            </div>
          )}
        </div>
        {h && <p style={{fontSize:12,color:'#5a3a10',lineHeight:1.5,margin:'8px 0 0',borderTop:`1px solid ${isCritical?'#e8c0c0':isStable?'#c8e8c8':'#e0c860'}`,paddingTop:8,fontStyle:'italic'}}>{h}</p>}
      </div>

      {/* ── POWER DISTRIBUTION ───────────────────────────────────────────── */}
      <Section title={`Power Distribution — ${pf.length} Factions`} collapsible defaultOpen>
        {/* Stacked bar */}
        <div style={{display:'flex',height:22,borderRadius:5,overflow:'hidden',marginBottom:12,gap:1}}>
          {pf.map((f,i) => {
            const pct = Math.round((f.power||0) / total * 100);
            const c   = FACTION_COLORS[i % FACTION_COLORS.length];
            return (
              <div key={i} title={`${f.faction}: ${pct}% (power ${f.power})`}
                style={{flex:pct,background:c,display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',cursor:'pointer'}}
                onClick={() => setExpandedFaction(expandedFaction===i ? null : i)}>
                {pct > 8 && <span style={{fontSize:9,fontWeight:800,color:'#fff',userSelect:'none'}}>{pct}%</span>}
              </div>
            );
          })}
        </div>

        {/* Faction rows */}
        <div style={{display:'flex',flexDirection:'column',gap:2}}>
          {pf.map((f,i) => {
            const c      = FACTION_COLORS[i % FACTION_COLORS.length];
            const isExp  = expandedFaction === i;
            const pct    = Math.round((f.power||0) / total * 100);
            const powerChanged = f.rawPower && f.rawPower !== f.power;
            const mods   = (f.modifiers||[]).concat(f.modifier ? [f.modifier] : []);
            const matchedGroups = factionGroups.filter(fg => fg.powerFactionName === f.faction);

            return (
              <div key={i}>
                <div style={{display:'flex',alignItems:'center',gap:7,padding:'6px 8px',borderRadius:5,
                  background:isExp?'#f5f0e8':f.legitimacyCrisis?'#fdf4f4':'transparent',
                  cursor:f.desc?'pointer':'default',
                  border: f.legitimacyCrisis ? '1px solid #e8c0c0' : '1px solid transparent',
                }}
                  onClick={() => f.desc && setExpandedFaction(isExp ? null : i)}>
                  <div style={{width:11,height:11,borderRadius:2,background:c,flexShrink:0}}/>
                  {f.isGoverning && <span style={{fontSize:11,color:c,flexShrink:0}}></span>}
                  {f.legitimacyCrisis && <span style={{fontSize:10,color:'#8b1a1a',flexShrink:0}}>⚠</span>}
                  <span style={{fontSize:13,fontWeight:700,color:'#1c1409',flex:1,minWidth:0,lineHeight:1.2}}>{f.faction}</span>
                  {/* Power label */}
                  {f.powerLabel && (
                    <span style={{fontSize:9,fontWeight:700,color:powerLabelColor(f.powerLabel),background:`${powerLabelColor(f.powerLabel)}12`,border:`1px solid ${powerLabelColor(f.powerLabel)}30`,borderRadius:3,padding:'1px 5px',flexShrink:0,textTransform:'uppercase',letterSpacing:'0.04em'}}>
                      {f.powerLabel}
                    </span>
                  )}
                  {/* Power with multiplier note if modified */}
                  <span style={{fontSize:11,fontWeight:700,color:c,flexShrink:0,minWidth:44,textAlign:'right'}}>
                    {powerChanged && <span style={{fontSize:9,color:'#9c8068',marginRight:3}}>{f.rawPower}→</span>}
                    {f.power}
                  </span>
                  {matchedGroups.length > 0 && (
                    <span style={{fontSize:9,fontWeight:600,color:c,background:`${c}15`,border:`1px solid ${c}40`,borderRadius:3,padding:'1px 5px',flexShrink:0}}>
                      {matchedGroups.reduce((n,g) => n+(g.members||[]).length, 0)}m
                    </span>
                  )}
                  {f.desc && <span style={{fontSize:10,color:'#9c8068',flexShrink:0}}>{isExp?'▲':'▼'}</span>}
                </div>

                {/* Sub-faction groups */}
                {matchedGroups.map((fg,gi) => (
                  <div key={gi} style={{display:'flex',alignItems:'center',gap:6,padding:'3px 8px 3px 24px',marginTop:1,background:`${c}08`,borderLeft:`2px solid ${c}30`,borderRadius:'0 0 4px 0'}}>
                    <span style={{fontSize:10,color:c}}>↳</span>
                    <span style={{fontSize:11,fontWeight:700,color:'#1c1409',flex:1}}>{fg.name}</span>
                    <span style={{fontSize:10,color:'#6b5340'}}>{(fg.members||[]).length} member{(fg.members||[]).length!==1?'s':''}</span>
                  </div>
                ))}

                {/* Expanded description */}
                {isExp && f.desc && (
                  <div style={{padding:'6px 12px 8px 28px',background:'#faf8f4',borderLeft:`2px solid ${c}`,marginLeft:4,marginBottom:4,marginTop:2,borderRadius:'0 0 4px 4px'}}>
                    <p style={{fontSize:12,color:'#3d2b1a',lineHeight:1.65,margin:'0 0 4px'}}>{f.desc}</p>
                    {f.crisisNote && (
                      <p style={{fontSize:11.5,color:'#8b1a1a',fontStyle:'italic',margin:'6px 0 0',lineHeight:1.4}}>⚠ {f.crisisNote}</p>
                    )}
                    {matchedGroups.length > 0 && (
                      <div style={{marginTop:8}}>
                        <span style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.05em',marginRight:8}}>Associated:</span>
                        {matchedGroups.flatMap(g => g.members||[]).slice(0,5).map((mem,j) => (
                          <span key={j} style={{fontSize:10,color:c,background:`${c}15`,border:`1px solid ${c}35`,borderRadius:8,padding:'1px 7px',marginRight:4,display:'inline-block',marginBottom:2}}>
                            {mem.name} <span style={{color:'#9c8068'}}>({mem.role})</span>
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
              <div key={i} style={{background:'#fdf8e8',border:'1px solid #e0c860',borderLeft:'3px solid #b8860b',borderRadius:6,padding:'9px 13px'}}>
                <p style={{fontSize:13,color:'#3d2b1a',lineHeight:1.5,margin:'0 0 4px'}}>{typeof t==='object'?t.description:t}</p>
                {t.factions?.length > 0 && (
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    {t.factions.map((f,j) => (
                      <span key={j} style={{fontSize:10,fontWeight:600,color:'#7a5010',background:'#f5e8c0',borderRadius:3,padding:'0 6px'}}>{f}</span>
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
              <div key={i} style={{background:'#faf8f4',border:`1px solid ${intColor}40`,borderLeft:`3px solid ${intColor}`,borderRadius:7,padding:'12px 14px',marginBottom:10}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                  <span style={{...serif,fontSize:14,fontWeight:700,color:'#1c1409',flex:1}}>{c.parties?.[0]} vs {c.parties?.[1]}</span>
                  <span style={{fontSize:9,fontWeight:800,color:intColor,background:`${intColor}15`,borderRadius:3,padding:'2px 6px',letterSpacing:'0.05em',flexShrink:0}}>{intLabel}</span>
                </div>
                {c.issue  && <p style={{fontSize:12,color:'#6b5340',margin:'0 0 4px'}}><strong>At issue:</strong> {c.issue}</p>}
                {c.stakes && <p style={{fontSize:12,color:'#6b5340',margin:'0 0 8px'}}><strong>Stakes:</strong> {c.stakes}</p>}
                {c.plotHooks?.length > 0 && (
                  <div style={{borderTop:`1px solid ${intColor}30`,paddingTop:8}}>
                    <div style={{fontSize:10,fontWeight:700,color:'#5a2a8a',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Plot Hooks</div>
                    {c.plotHooks.map((hook,j) => (
                      <div key={j} style={{display:'flex',gap:6,marginBottom:4}}>
                        <span style={{color:'#5a2a8a',flexShrink:0,fontSize:12}}>✦</span>
                        <p style={{fontSize:12,color:'#1c1409',lineHeight:1.45,margin:0}}>{typeof hook==='string'?hook:hook.hook||''}</p>
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

export default PowerTab;
