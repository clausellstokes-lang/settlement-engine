import React, { useState } from 'react';
import { FS, swatch, MUTED, GOLD_TINT, GOLD_DEEP } from '../../theme.js';
import {Ti, serif, Section, TabIntro} from '../Primitives';
import {PROSPERITY_COLORS, BODY} from '../tabConstants';
import {isMobile} from '../tabConstants';

import WhatChangedPanel from '../../settlement/WhatChangedPanel.jsx';
import Button from '../../primitives/Button.jsx';
import { displayInstitutionName } from '../../../domain/display/institutionDisplay.js';

// Shared no-value placeholder — an absent value reads as a deliberate
// 'not computed' state, not garbled ', ' output. Matches DefenseTab's
// 'Unknown' convention. (P2 coherence / P11 consistency.)
const NO_VALUE = 'Unknown';

// ── Module-scope helper components ─────────────────────────────────────
// React Hooks plugin v7 flags components defined inside render functions
// because each render creates a new component identity, defeating
// memoization and breaking React Compiler's optimization assumptions.
// Extracting these two (ScoreRow, StatusTag) to module scope resolves
// 9 react-hooks/static-components errors. Both are purely presentational
// and have no closure dependency on OverviewTab state beyond their
// props, so the lift is mechanical.

// Score severity tier — `tier` carries the qualitative band in a SECOND,
// non-color channel (a one-word qualifier) so green/amber/red isn't the sole
// signal; `alert` marks the sub-strong bands that earn saturated color while
// healthy rows stay muted so the anomaly is the loud one. (P7 / P3.)
function scoreTier(n) {
  if (n >= 70) return { c: '#1a5a28', word: 'Strong', alert: false };
  if (n >= 45) return { c: '#a0762a', word: 'Fair', alert: false };
  if (n >= 25) return { c: '#8a4010', word: 'Weak', alert: true };
  return { c: '#8b1a1a', word: 'Critical', alert: true };
}
function ScoreRow({ label, score, icon }) {
  const n = Math.min(100, Math.max(0, score || 0));
  const t = scoreTier(n);
  const c = t.alert ? t.c : BODY;            // mute healthy rows; color the anomaly
  // The fixed Military→Magical order is kept for comparison, so the weak system
  // wins a SECOND channel beyond fill color: an alert row gets a ⚠ glyph + a
  // heavier (700) label so the one bar a GM must not miss survives the squint
  // test without color alone. (P4 ≥2 levers / P7.)
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
        <span style={{ fontSize: FS.xs, color: t.alert ? c : swatch.inkMag2, fontWeight: t.alert ? 700 : 600 }}>{t.alert && <span aria-hidden="true" style={{ marginRight: 3 }}>{'⚠'}</span>}{icon} {label}</span>
        <span style={{ fontSize: FS.xs, fontWeight: 700, color: c }}>
          <span style={{ fontWeight: 600, marginRight: 5 }}>{t.word}</span>{Math.round(n)}
        </span>
      </div>
      <div style={{ height: 6, background: swatch['#E8DCC8'], borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${n}%`, background: c, borderRadius: 3, transition: 'width 0.4s' }} />
      </div>
    </div>
  );
}

// Health-status qualifier vocabulary — the SAME good/warn/bad glyph+word channel
// the sibling SummaryTab's SitTile uses, factored here so a GM toggling
// Overview↔DM Summary reads ONE health grammar across the Summary group, not two
// (P11 cross-surface consistency). The glyph+word is the non-color second
// channel (P7); color alone never carries the band.
const TAG_TIER = { good: { glyph: '✓', word: 'Stable' }, warn: { glyph: '•', word: 'Strained' }, bad: { glyph: '!', word: 'Critical' } };

// `alert` (default true) means this tag carries a genuine warning/critical
// signal and may use its saturated accent. When `alert` is false the tag is a
// healthy/neutral reading and is rendered in muted aged-ink so it does not
// compete with the one band a GM must not miss — reserve saturated color for
// the anomaly. (P3 / P4 / checklist 6.) `tier` ('good'|'warn'|'bad') drives the
// shared qualifier; it defaults from `alert` so callers that only know
// alert/no-alert still get a band word.
function StatusTag({ label, value, accent, alert = true, tier }) {
  const shown = alert ? accent : null;
  const band = tier ? TAG_TIER[tier] : (alert ? TAG_TIER.bad : TAG_TIER.good);
  return (
    <div style={{ flex: '1 1 130px', background: shown ? `${shown}0d` : '#faf8f4', border: `1px solid ${shown ? `${shown}35` : '#e0d0b0'}`, borderLeft: `3px solid ${shown || '#c8b89a'}`, borderRadius: 6, padding: '7px 10px', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5, marginBottom: 3 }}>
        <span style={{ fontSize: FS.micro, fontWeight: 700, color: shown || BODY, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        {band && <span style={{ fontSize: FS.micro, fontWeight: 700, color: shown || BODY, marginLeft: 'auto' }} title={band.word}>{band.glyph} {band.word}</span>}
      </div>
      <div style={{ fontSize: FS.sm, fontWeight: 700, color: swatch.inkMag, lineHeight: 1.3 }}>{value || NO_VALUE}</div>
    </div>
  );
}

export function OverviewTab({ settlement:r, hideIdentity=false, onNavigateTab}) {
  const [instOpen, setInstOpen] = useState(false);
  if (!r) return null;
  const mobile = isMobile();

  const eco = r.economicState || {};
  const dp = r.defenseProfile || {};
  const scores = dp.scores || {};
  const via = r.economicViability || {};
  const sp = eco.safetyProfile || {};
  const hist = r.history || {};
  const ra = r.resourceAnalysis || {};
  const stresses = (Array.isArray(r.stress) ? r.stress : r.stress ? [r.stress] : []).filter(Boolean);
  const foodBal = via.metrics?.foodBalance;

  // Institution layout — guard `r.institutions` because sparse saves
  // (mid-migration, partial gen) can land here without an institutions
  // array. The smoke test in tests/ui/tabs.smoke.test.js caught this.
  const byCategory = (r.institutions || []).reduce((acc,m)=>((acc[m.category]=acc[m.category]||[]).push(m),acc),{});
  const catColors2 = {government:'#2a3a7a',military:'#8b1a1a',economy:'#a0762a',religious:'#1a5a28',magic:'#5a2a8a',criminal:'#4a1a4a',other:'#5a4a2a',Essential:'#6b5340',Crafts:'#7a4a1a',Infrastructure:'#1a4a5a',Defense:'#8b1a1a',Entertainment:'#7a1a5a',Adventuring:'#1a5a3a'};
  const getCatColor = c => catColors2[c] || '#6b5340';

  // ScoreRow and StatusTag are defined at module scope above. Lifting
  // them out of the render function (was here originally) fixed 9
  // react-hooks/static-components errors and gives React Compiler the
  // identity stability it expects.

  return (
    <div>
      <TabIntro tabKey="overview" />
      {/* The per-tab narrative lens for Overview is owned by DossierNarrativeBanner
          (overview ∈ THESIS_TABS), painted ABOVE this tab's content. The in-tab
          NarrativeNote was fed a hardcoded null from OutputContainer — a dead
          prop path — so it is removed; the banner is the single source. (P2.) */}

      {/* ── IDENTITY + KEY FACTS STRIP ─────────────────────────────────────
          Suppressed when the dossier's own dark DossierHeaderRow already paints
          name/tier/pop (the saved + live owner views pass hideIdentity); then
          the Overview body opens directly on the crisis / what-changed content
          instead of re-stating identity within one viewport. (P2 redundancy /
          P4 one focal point.) When hideHeader is true (the wizard embed) this
          stays — identity isn't lost.
          The strip is the page header, not a semantic category, so it carries
          NO left accent — its gradient tint + looser bottom margin do the
          grouping (the neutral grey-brown rule taught nothing). (P5.) */}
      {!hideIdentity && (
      <div style={{background:'linear-gradient(to right,#f5ede0,#ede3cc)',padding:'8px 14px',marginBottom:14,borderRadius:6}}>
        <div style={{display:'flex',alignItems:'baseline',gap:10,flexWrap:'wrap',marginBottom:6}}>
          <span style={{...serif,fontSize:FS.xxl,fontWeight:600,color:swatch.inkMag}}>{r.name}</span>
          <span style={{fontSize:FS.md,color:BODY,textTransform:'capitalize'}}>{r.tier}</span>
          <span style={{fontSize:FS.sm,color:MUTED}}>·</span>
          <span style={{fontSize:FS.sm,color:BODY}}>{r.population?.toLocaleString()} pop.</span>
          {r.config?.tradeRouteAccess&&<><span style={{fontSize:FS.sm,color:MUTED}}>·</span><span style={{fontSize:FS.sm,color:BODY,textTransform:'capitalize'}}>{r.config.tradeRouteAccess.replace(/_/g,' ')}</span></>}
          {hist.age&&<><span style={{fontSize:FS.sm,color:MUTED}}>·</span><span style={{fontSize:FS.sm,color:BODY}}>{hist.age} years old</span></>}
        </div>
        {/* Row 2: character + spatial — quote held to the prose measure so it
            doesn't run edge-to-edge across a wide dossier column. (P12.) */}
        <div style={{display:'flex',gap:16,flexWrap:'wrap'}}>
          {hist.historicalCharacter&&<p style={{fontSize:FS.sm,color:swatch['#5A3A1A'],fontStyle:'italic',margin:0,flex:'2 1 200px',maxWidth:'48em',lineHeight:1.5}}>"{hist.historicalCharacter}"</p>}
          <div style={{display:'flex',gap:8,flex:'1 1 160px',alignItems:'flex-start',flexWrap:'wrap'}}>
            {ra.terrain&&<span style={{fontSize:FS.xs,color:swatch['#1A4A2A'],background:swatch['#E8F0E8'],border:'1px solid #a8d0a8',borderRadius:4,padding:'2px 8px',fontWeight:600}}>{ra.terrain}</span>}
            {r.spatialLayout?.layout&&<span style={{fontSize:FS.xs,color:swatch.inkMag2,background:swatch['#F0EAD8'],border:'1px solid #d0c090',borderRadius:4,padding:'2px 8px'}}>{r.spatialLayout.layout}</span>}
          </div>
        </div>
      </div>
      )}

      {/* ── ACTIVE CRISIS (the table-night driver — single saturated focal point) ──
          Reordered ABOVE What Changed and quieted to the accent-left idiom (3px
          left border + tint, no 2px full box, no white-on-color badge) so the
          crisis is the ONE saturated block that owns the top of the tab; What
          Changed below reads as the supporting 'why it got here' causal context.
          Two saturated full-emphasis regions firing back-to-back flattened P4's
          one-focal-point. Self-gates (renders nothing at peace). (P3 / P4.) */}
      {stresses.length>0&&<div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:14}}>
        {stresses.map((v,i)=>(
          <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',background:`${v.colour}0e`,borderLeft:`3px solid ${v.colour}`,padding:'10px 14px'}}>
            <span style={{fontSize: FS['18'],flexShrink:0}}>{v.icon}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                <span style={{...serif,fontSize:FS.lg,fontWeight:700,color:v.colour}}>{v.label}</span>
                <span style={{fontSize:FS.micro,fontWeight:800,color:v.colour,textTransform:'uppercase',letterSpacing:'0.06em'}}>Active Crisis</span>
              </div>
              <p style={{fontSize: FS['12.5'],color:swatch.inkMag,lineHeight:1.5,margin:'0 0 4px'}}>{v.summary}</p>
              <p style={{fontSize:FS.xs,color:swatch['#3A2A10'],fontStyle:'italic',margin:0}}><span style={{fontWeight:700,fontStyle:'normal',color:v.colour}}>Hook: </span>{v.crisisHook}</p>
            </div>
          </div>
        ))}
      </div>}

      {/* ── WHAT CHANGED & WHY (post-advance; self-gates without a prior snapshot) ──
          OverviewTab receives the full settlement whose prior snapshot drives the
          panel; surfaced here so an advanced town leads with what moved, not only
          static absolute stats. Paints nothing on an un-advanced town. (P3 /
          audit: surface deltas at the top / checklist 21.) */}
      <WhatChangedPanel
        settlement={r}
        priorSettlement={r.priorSettlement || null}
        before={r.priorCausalState || null}
        populationHistory={r.populationHistory}
      />

      {/* ── SYSTEMS HEALTH DASHBOARD ─────────────────────────────────────── */}
      <Section title="Systems Health" collapsible defaultOpen accent="#3d2b1a">

        {/* Status tags row — only the bands a GM must not miss carry saturated
            color; healthy/neutral readings stay muted so the anomaly is the
            single loud tag. (P3 / P4 / checklist 6.) */}
        <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14}}>
          <StatusTag label="Prosperity" value={eco.prosperity} accent={PROSPERITY_COLORS[eco.prosperity]} alert={['Poverty','Impoverished','Struggling','Poor'].includes(eco.prosperity)}/>
          <StatusTag label="Safety" value={sp.safetyLabel?.split(', ')[0].trim()} accent={sp.safetyLabel?.includes('Dangerous')||sp.safetyLabel?.includes('Desperate')?'#8b1a1a':sp.safetyLabel?.includes('Unsafe')?'#a0580a':sp.safetyLabel?.includes('Safe')?'#1a5a28':'#a0762a'} alert={!!(sp.safetyLabel&&(sp.safetyLabel.includes('Dangerous')||sp.safetyLabel.includes('Desperate')||sp.safetyLabel.includes('Unsafe')))} tier={sp.safetyLabel?.includes('Dangerous')||sp.safetyLabel?.includes('Desperate')?'bad':sp.safetyLabel?.includes('Unsafe')?'warn':sp.safetyLabel?.includes('Safe')?'good':'warn'}/>
          <StatusTag label="Viability" value={via.viable===false?'Not Viable':via.viable===true?'Viable':NO_VALUE} accent={via.viable===false?'#8b1a1a':via.viable===true?'#1a5a28':undefined} alert={via.viable===false}/>
          <StatusTag label="Defense" value={dp.readiness?.label} accent={dp.readiness?.color} alert={/poor|weak|unprepared|vulnerable|critical|none/i.test(dp.readiness?.label||'')}/>
        </div>

        {/* Magic dependency badge */}
        {dp.magicDependency&&<div style={{display:'flex',alignItems:'center',gap:6,
          background:swatch['#F8F0FF'],border:'1px solid #c0a0e0',borderRadius:5,
          padding:'5px 10px',marginTop:6}}>
          <span style={{fontSize:FS.sm,color:swatch.magic}}>✦</span>
          <span style={{fontSize:FS.xs,fontWeight:600,color:swatch.magic}}>Magic Dependency</span>
          <span style={{fontSize:FS.xs,color:swatch['#7A4AAA'],flex:1}}>, resilience relies on magical infrastructure.</span>
          {/* Real navigation control replacing the 'See Viability tab' text
              reference — a ghost button wired to the dossier's tab handler. */}
          {onNavigateTab&&<Button variant="ghost" size="sm" onClick={()=>onNavigateTab('viability')} style={{flexShrink:0,padding:'2px 6px'}}>Viability →</Button>}
        </div>}

        {/* Score bars — 2-col grid */}
        <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:'0 24px'}}>
          <ScoreRow label="Military Might" score={scores.military} icon=""/>
          <ScoreRow label="Monster Defense" score={scores.monster} icon=""/>
          <ScoreRow label="Internal Security" score={scores.internal} icon=""/>
          <ScoreRow label="Economic Resilience" score={scores.economic} icon=""/>
          <ScoreRow label="Magical Capability" score={scores.magical} icon=""/>
          {foodBal&&(()=>{
            // Food Security — production's coverage of daily need (mirrors the
            // Economics tab's canonical "production covers N% of need" framing),
            // shown as an always-on band in the slot the Enforcement Ratio used to
            // hold. A surplus reads Secure; a shortfall reads Strained or Critical
            // by how deep it runs. Replaces the old deficit-only sliver that a
            // well-fed town never showed.
            const prod=foodBal.dailyProduction, need=foodBal.dailyNeed;
            const coverage=(prod!=null&&need)
              ? Math.min(100,Math.round(prod/Math.max(1,need)*100))
              : (foodBal.deficitPercent!=null?Math.max(0,100-foodBal.deficitPercent):null);
            if(coverage==null) return null;
            const deficit=foodBal.deficit>0, surplus=foodBal.surplus>0;
            const word=deficit?(coverage<75?'Critical':'Strained'):surplus?'Secure':'Fair';
            const color=deficit?'#8b1a1a':surplus?'#1a5a28':BODY;
            return <div style={{marginBottom:8}}>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:3}}>
                <span style={{fontSize:FS.xs,color:swatch.inkMag2,fontWeight:600}}>Food Security</span>
                <span style={{fontSize:FS.xs,fontWeight:700,color:color}}><span style={{fontWeight:600,marginRight:5}}>{word}</span>{coverage}%</span>
              </div>
              <div style={{height:6,background:swatch['#E8DCC8'],borderRadius:3,overflow:'hidden'}}>
                <div style={{height:'100%',width:`${coverage}%`,background:color,borderRadius:3}}/>
              </div>
            </div>;
          })()}
        </div>
      </Section>

      {/* ── CURRENT TENSIONS & CONFLICTS ─────────────────────────────────── */}
      {(hist.currentTensions?.length>0||(r.conflicts||[]).length>0)&&<Section title="Tensions and conflicts" collapsible defaultOpen accent="#b8860b">
        {hist.currentTensions?.map((t,i)=>(
          <div key={i} style={{display:'flex',gap:8,marginBottom:6,paddingBottom:6,borderBottom:i<(hist.currentTensions?.length||0)-1||(r.conflicts||[]).length>0?'1px solid #e8d080':'none'}}>
            <span style={{fontSize:FS.sm,flexShrink:0,marginTop:1,color:swatch['#B8860B']}}>▸</span>
            <div>
              <p style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.45,margin:0}}>{typeof t==='object'?t.description:t}</p>
              {t.factions?.length>0&&<div style={{display:'flex',gap:4,marginTop:3,flexWrap:'wrap'}}>
                {t.factions.map((f,j)=><span key={j} style={{fontSize:FS.xxs,fontWeight:600,color:swatch['#7A5010'],background:swatch['#F5E8C0'],borderRadius:3,padding:'0 5px'}}>{f}</span>)}
              </div>}
            </div>
          </div>
        ))}
        {(r.conflicts||[]).map((c,i)=>{
          const iHigh=c.intensity==='high';
          return <div key={i} style={{display:'flex',gap:8,marginBottom:6}}>
            <span style={{fontSize:FS.sm,flexShrink:0,marginTop:1,color:iHigh?'#8b1a1a':'#a0762a'}}></span>
            <div>
              <div style={{display:'flex',gap:6,alignItems:'baseline',flexWrap:'wrap'}}>
                <span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{c.parties?.[0]} vs {c.parties?.[1]}</span>
                <span style={{fontSize:FS.micro,fontWeight:800,color:iHigh?'#8b1a1a':'#a0762a',background:iHigh?'#fdf0f0':'#faf0dc',border:`1px solid ${iHigh?'#e8c0c0':'#d8c080'}`,borderRadius:3,padding:'0 4px'}}>{iHigh?'HIGH':'MODERATE'}</span>
              </div>
              {c.issue&&<p style={{fontSize:FS.xs,color:swatch.inkMag3,margin:'2px 0 0',lineHeight:1.3}}>{c.issue}</p>}
            </div>
          </div>;
        })}
      </Section>}

      {/* ── SITUATION (arrival + pressure — more compact here) ───────────── */}
      {(r.arrivalScene||r.pressureSentence)&&<div style={{background:swatch.inkMag,borderRadius:8,padding:'12px 16px',marginBottom:14,border:'1px solid #3a2a10'}}>
        {r.arrivalScene&&<p style={{...serif,fontSize:FS.md,color:swatch['#F0E8D8'],lineHeight:1.7,margin:0,fontStyle:'italic'}}>{r.arrivalScene}</p>}
        {/* spacing carries the arrival→pressure split (already differentiated by
            color/size); the internal hairline rule was an avoidable border. (P5.) */}
        {r.pressureSentence&&<p style={{fontSize:FS.sm,color:swatch['#D4C4A0'],lineHeight:1.55,margin:0,marginTop:r.arrivalScene?10:0,fontStyle:'italic'}}>{r.pressureSentence}</p>}
      </div>}

      {/* ── SETTLEMENT ORIGIN ─────────────────────────────────────────────── */}
      {r.settlementReason&&<Section title="Settlement Origin" collapsible defaultOpen={false} accent="#6b5340">
        <div style={{borderLeft:'3px solid #c8b89a',paddingLeft:12}}>
          {Array.isArray(r.settlementReason)
            ?r.settlementReason.map((line,i)=><p key={i} style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:'0 0 4px',fontStyle:'italic'}}>{line}</p>)
            :<p style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}>{Ti(r.settlementReason?.primary||r.settlementReason)}</p>
          }
        </div>
      </Section>}

      {/* ── NOTABLE CONNECTION ──────────────────────────────────────────────
          De-boxed to accent-left + tint, matching the Section idiom. */}
      {r.prominentRelationship?.phrasing&&<div style={{background:swatch['#F7F0E4'],borderLeft:'3px solid #6b5340',padding:'4px 0 4px 13px',marginBottom:14}}>
        <div style={{fontSize:FS.xxs,fontWeight:700,color:BODY,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Notable Connection</div>
        <p style={{fontSize: FS['12.5'],...serif,color:swatch['#3A2A10'],lineHeight:1.6,margin:0,fontStyle:'italic'}}>{r.prominentRelationship.phrasing}</p>
        {/* Real navigation control replacing the text reference. */}
        {onNavigateTab&&<div style={{marginTop:5}}><Button variant="ghost" size="sm" onClick={()=>onNavigateTab('relationships')} style={{padding:'2px 6px'}}>Full relationship web →</Button></div>}
      </div>}

      {/* ── RESOURCE CONTEXT (terrain strengths) ─────────────────────────── */}
      {(ra.terrain||ra.economicStrengths?.length>0||ra.strategicValue)&&<Section title="Geography and resources" collapsible defaultOpen={false} accent="#1a5a28">
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          {ra.terrain&&<div style={{flex:'1 1 100px'}}>
            <div style={{fontSize:FS.micro,fontWeight:700,color:swatch.success,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>Terrain</div>
            <div style={{fontSize:FS.sm,fontWeight:600,color:swatch.inkMag}}>{ra.terrain}</div>
          </div>}
          {ra.economicStrengths?.length>0&&<div style={{flex:'2 1 160px'}}>
            <div style={{fontSize:FS.micro,fontWeight:700,color:swatch.success,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>Strengths</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
              {ra.economicStrengths.slice(0,4).map((s,i)=><span key={i} style={{fontSize:FS.xs,color:swatch.success,background:swatch['#E0F0E0'],borderRadius:4,padding:'1px 6px'}}>{s}</span>)}
            </div>
          </div>}
          {ra.strategicValue&&<div style={{flex:'2 1 160px'}}>
            <div style={{fontSize:FS.micro,fontWeight:700,color:swatch.success,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>Strategic Value</div>
            <div style={{fontSize:FS.xs,color:swatch.inkMag2,lineHeight:1.4}}>{ra.strategicValue}</div>
          </div>}
        </div>
      </Section>}

      {/* ── SPATIAL LAYOUT ──────────────────────────────────────────────────
          Routed through the shared Section primitive so its header reads at the
          same serif FS.lg altitude as Systems Health / Tensions / Geography and
          the layer-cake scan has one consistent collapsible level. (P6.) */}
      {r.spatialLayout?.quarters?.length>0&&<Section title={`Spatial Layout (${r.spatialLayout.quarters.length} quarters)`} collapsible defaultOpen={false} accent="#1a5a28">
        {r.spatialLayout.layout&&<p style={{fontSize:FS.sm,fontWeight:600,color:swatch.inkMag2,margin:'0 0 10px'}}>{r.spatialLayout.layout}</p>}
        <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'repeat(auto-fill,minmax(180px,1fr))',gap:8}}>
          {r.spatialLayout.quarters.map((q,i)=>(
            <div key={i} style={{background:swatch['#FAF8F4'],border:'1px solid #d8c8a0',borderRadius:6,padding:'8px 10px'}}>
              <div style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag,marginBottom:3}}>{q.name}</div>
              <p style={{fontSize:FS.xs,color:swatch.inkMag3,lineHeight:1.4,margin:0}}>{q.desc}</p>
              {q.landmarks?.slice(0,1).map((lm,j)=><p key={j} style={{fontSize:FS.xs,color:BODY,margin:'3px 0 0'}}>• {lm}</p>)}
            </div>
          ))}
        </div>
      </Section>}

      {/* ── WARNINGS & COHERENCE NOTES ──────────────────────────────────────
          One grouped region: each note is a spaced row carrying only its
          severity left-border + tint, not a separately-bordered floating card.
          Looser top margin sets it off as a distinct chunk. (P5 / checklist 20.) */}
      {((r.structuralViolations?.length||0)+(r.coherenceNotes?.length||0)+(r.structuralSuggestions?.length||0)>0)&&<div style={{marginTop:20,marginBottom:14,display:'flex',flexDirection:'column',gap:8}}>
        {r.structuralViolations?.length>0&&<div style={{background:swatch.dangerBg,borderLeft:'3px solid #8b1a1a',padding:'2px 0 2px 12px'}}>
          <div style={{fontSize:FS.xs,fontWeight:700,color:swatch.danger,marginBottom:4}}> Structural Issues</div>
          {r.structuralViolations.map((v,i)=><div key={i} style={{fontSize:FS.sm,color:swatch['#5A1A1A'],marginBottom:3}}><span style={{fontWeight:700}}>{v.institution||v.group}: </span>{v.reason}</div>)}
        </div>}
        {r.coherenceNotes?.filter(n=>n.severity==='contradiction').map((note,i)=>(
          <div key={i} style={{background:swatch['#FDF4F0'],borderLeft:'3px solid #8b3a1a',padding:'2px 0 2px 12px',display:'flex',gap:8}}>
            <span style={{color:swatch['#8B3A1A'],flexShrink:0}}></span>
            <span style={{fontSize: FS['12.5'],color:swatch.inkMag2,lineHeight:1.5}}>{note.note||Ti(note)}</span>
          </div>
        ))}
        {r.coherenceNotes?.filter(n=>n.severity!=='contradiction').map((note,i)=>(
          <div key={i} style={{background:swatch['#F0F4FD'],borderLeft:'3px solid #1a3a8b',padding:'2px 0 2px 12px',display:'flex',gap:8}}>
            <span style={{color:swatch['#1A3A8B'],flexShrink:0}}>ℹ</span>
            <span style={{fontSize: FS['12.5'],color:swatch.inkMag2,lineHeight:1.5}}>{note.note||Ti(note)}</span>
          </div>
        ))}
        {r.structuralSuggestions?.length>0&&<div style={{background:swatch['#F4F6FD'],borderLeft:'3px solid #2a3a7a',padding:'2px 0 2px 12px'}}>
          <div style={{fontSize:FS.xs,fontWeight:700,color:swatch.info,marginBottom:4}}> Suggestions</div>
          {r.structuralSuggestions.map((v,i)=><div key={i} style={{fontSize:FS.sm,color:swatch['#1A2A5A'],marginBottom:3}}>{v.reason}{v.suggested&&<span style={{color:swatch.inkMag3,fontStyle:'italic'}}>. Consider{v.suggested.join(', ')}</span>}</div>)}
        </div>}
      </div>}

      {/* ── INSTITUTIONS ────────────────────────────────────────────────────
          Kept as a BESPOKE collapsible (not routed through the shared Section
          primitive) on purpose: Section's serif-title header has no trailing
          slot, so converting would drop the per-category count pills this header
          shows WHILE COLLAPSED — genuine at-a-glance scent (P6) the Section
          can't carry. Tradeoff recorded. To still reduce box-soup it is de-boxed
          to the accent-left idiom (3px left border + tint, no 4-side border) and
          the internal body / legend borderTop hairlines are dropped for spacing,
          and the raw <button> is now the Button primitive. (P5 / hard rule.) */}
      <div style={{borderLeft:'3px solid #6b5340',background:instOpen?'#f0e8d8':'#f7f0e4'}}>
        <Button variant="ghost" onClick={()=>setInstOpen(v=>!v)} aria-expanded={instOpen} aria-label={`Institutions, ${(r.institutions||[]).length} total — ${instOpen?'collapse':'expand'}`} fullWidth style={{justifyContent:'space-between',padding:'13px 14px',background:'transparent',border:'none',borderRadius:0,WebkitTapHighlightColor:'transparent'}}>
          <span style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:FS.xs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em'}}>Institutions</span>
            <span style={{fontSize:FS.xs,color:BODY}}>{(r.institutions||[]).length} total</span>
          </span>
          <span style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap',justifyContent:'flex-end'}}>
            {Object.entries(byCategory).sort((a,b)=>b[1].length-a[1].length).slice(0,5).map(([cat,insts])=>(
              <span key={cat} style={{fontSize:FS.xs,fontWeight:600,color:getCatColor(cat),background:`${getCatColor(cat)}15`,borderRadius:3,padding:'1px 5px'}}>{cat} {insts.length}</span>
            ))}
            <span style={{fontSize:FS.xs,color:BODY,marginLeft:4}}>{instOpen?'▲':'▼'}</span>
          </span>
        </Button>
        {instOpen&&<div style={{padding:'0 14px 10px'}}>
          {/* Visual category distribution bar */}
          <div style={{display:'flex',height:8,borderRadius:4,overflow:'hidden',gap:1,marginBottom:12}}>
            {Object.entries(byCategory).sort((a,b)=>b[1].length-a[1].length).map(([cat,insts])=>(
              <div key={cat} title={`${cat}: ${insts.length}`} style={{flex:insts.length,background:getCatColor(cat),minWidth:insts.length>0?4:0}}/>
            ))}
          </div>
          {/* Categories with pills */}
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {Object.entries(byCategory).sort((a,b)=>a[0].localeCompare(b[0])).map(([cat,insts])=>{
              const cc=getCatColor(cat);
              return <div key={cat}>
                <div style={{fontSize:FS.xs,fontWeight:700,color:cc,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>{cat} ({insts.length})</div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                  {insts.sort((a,b)=>displayInstitutionName(a.name).localeCompare(displayInstitutionName(b.name))).map((inst,i)=>{
                    const isCustom = inst.source==='custom' || inst.isCustom===true;
                    const srcColor={required:'#a0762a',forced:'#2d7a44','auto-resolved':'#2a3a7a'}[inst.source]||'#6b5340';
                    const srcLabel={required:'REQ',forced:'','auto-resolved':'→'}[inst.source];
                    const base = {fontSize:FS.xs,padding:'2px 8px',borderRadius:4,color:swatch.inkMag,fontWeight:500,display:'inline-flex',alignItems:'center',gap:4};
                    const skin = isCustom
                      ? {...GOLD_TINT, borderWidth:1, borderStyle:'solid'}   // sparkling-gold custom row
                      : {background:`${srcColor}10`,border:`1px solid ${srcColor}30`};
                    return <span key={i} title={isCustom?'Your custom content':undefined} style={{...base,...skin}}>
                      {displayInstitutionName(inst.name)}
                      {isCustom
                        ? <span style={{fontSize:FS.xs,fontWeight:800,color:GOLD_DEEP,letterSpacing:'0.04em'}}>✦</span>
                        : (srcLabel&&<span style={{fontSize:FS.xs,fontWeight:800,color:srcColor,letterSpacing:'0.04em'}}>{srcLabel}</span>)}
                    </span>;
                  })}
                </div>
              </div>;
            })}
          </div>
          {/* Legend — separated by spacing, not a hairline (the legend is already
              distinct by size/weight). (P5.) */}
          <div style={{display:'flex',gap:14,marginTop:14,fontSize:FS.xs,color:BODY,flexWrap:'wrap'}}>
            {[['REQ','#a0762a','Historically required'],['','#2d7a44','Force-added by you'],['→','#2a3a7a','Auto-resolved dependency'],['✦',GOLD_DEEP,'custom']].map(([lbl,c,desc])=>(
              <span key={lbl}><span style={{color:c,fontWeight:800}}>{lbl}</span> = {desc}</span>
            ))}
          </div>
        </div>}
      </div>

    </div>
  );
}

export default React.memo(OverviewTab);
