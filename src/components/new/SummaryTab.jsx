import React, { useState } from 'react';
import { FS, swatch, GOLD_TXT } from '../theme.js';
import { TIER_LABELS, catColor } from './design';
import { serif, TabIntro } from './Primitives';
import { BODY } from './tabConstants.js';
import { entityAnchor, normalizeNpcTraits } from '../../domain/dossier/entityLinks.js';
import { deriveFoodBalance, deriveDefensePosture } from '../../domain/display/dossierViewModel.js';
import { collectPlotHooks, countPlotHookCategories, PLOT_HOOK_CATEGORIES } from '../../domain/dossier/plotHooks.js';
import { buildLegacySummaryMarkdown } from '../../domain/summary/buildSummaryMarkdown.js';
import ReadSystemStateBar from '../settlement/ReadSystemStateBar.jsx';
import WarFaithSection from '../settlement/WarFaithSection.jsx';
import WhatChangedPanel from '../settlement/WhatChangedPanel.jsx';
import { useSettlementLiveWorld } from '../../hooks/useSettlementLiveWorld.js';
import Button from '../primitives/Button.jsx';

// ── Live Faith & War block (UX overhaul Phase 2) ──────────────────────────────
// REPLACED the thin inline FaithWarBlock with the fuller, self-gating
// WarFaithSection (strategy posture, aggressiveness + named inputs, war-exhaustion,
// disposition W/L, trade-war prize, coalition/siege/occupation, Faith Effects).
// This wrapper resolves the owning campaign's LIVE worldState via the shared
// useSettlementLiveWorld hook (same lookup the old block did) and hands the pure
// projections down. Self-gates to nothing for a peaceful, deity-free, non-campaign
// town — byte-identical off-state.
function FaithWarBlock({ settlement, saveId }) {
  const { worldState, regionalGraph, settlements, nameFor } = useSettlementLiveWorld(saveId);
  return (
    <WarFaithSection
      settlement={settlement}
      settlementId={saveId || settlement?.id || settlement?.config?.id}
      worldState={worldState}
      regionalGraph={regionalGraph}
      settlements={settlements}
      nameFor={nameFor}
    />
  );
}

// `second` was the per-file body-copy alias for '#6b5340'.
// Routing it through `BODY` from tabConstants centralises future contrast
// changes — keep the local `second` name so we don't churn every usage.
// `gold` stays the raw accent for FILLS/BORDERS and for text on the DARK ink
// panels (where gold-on-ink passes contrast). `goldTxt` is the legible
// gold-as-text token (gold-800) for any gold foreground on LIGHT parchment
// surfaces, where the raw gold-500 fails AA. (P7 / checklist 23.)
const gold=swatch['#A0762A'], goldTxt=GOLD_TXT, ink=swatch['#1C1409'], muted=swatch['#9C8068'], second=BODY;
// Shared no-value placeholder — an absent value reads as a deliberate
// 'not computed' state, not garbled output. Matches DefenseTab's 'Unknown'
// convention. (P2 coherence / P11 consistency.)
const NO_VALUE='Unknown';
const factionColors=['#a0762a','#8b1a1a','#1a4a2a','#2a3a7a','#5a2a8a'];

// ── Settlement character sentence ─────────────────────────────────────────────
function characterSentence(r) {
  const insts=(r.institutions||[]).map(i=>(i.name||'').toLowerCase());
  const hasArmed=insts.some(n=>['garrison','militia','watch','guard','mercenary'].some(k=>n.includes(k)));
  const hasCrim=insts.some(n=>['thieve','criminal','underworld','black market'].some(k=>n.includes(k)));
  const {tier,config:h={},economicState:g={},powerStructure:w={},history:p={}}=r;
  const tradeKey=h.tradeRouteAccess||'road';
  const threat=h.monsterThreat||'frontier';
  const sl=g.safetyProfile?.safetyLabel||'';
  const prosperity=g.prosperity||'Moderate';
  const stability=w.stability||'Stable';
  const ruling=w.factions?.[0]?.faction||((['thorp','hamlet'].includes(tier)?'the household heads':['village'].includes(tier)?'the village elders':'the local council'));
  const age=p.age;
  const recentConflict=w.recentConflict||'';
  const tradeDesc={port:'coastal port',river:'river settlement',crossroads:'crossroads market',road:'road-side settlement',isolated:'isolated settlement'}[tradeKey]||'settlement';
  const tierDesc={thorp:'tiny hamlet',hamlet:'small hamlet',village:'village',town:'market town',city:'city',metropolis:'metropolis'}[tier]||tier;
  const threatNote=threat==='plagued'?' The surrounding region is plagued by monster activity.':threat==='frontier'?' It sits on an active frontier.':'';
  const safetyNote=sl.includes('Dangerous')?' The streets are not safe.':sl.includes('Authoritarian')?(hasArmed?' The garrison controls the streets with an iron hand.':' The strongest armed group enforces community order.'):sl.includes('Criminal Governance')?(hasCrim?' Criminal organizations effectively run the settlement.':''):'' ;
  const ageNote=age?` Founded approximately ${age} years ago.`:'';
  return `${prosperity.toLowerCase()} ${tierDesc}. A ${tradeDesc}.${ageNote}${threatNote} Power rests with ${ruling.toLowerCase()}; stability: ${stability.toLowerCase().replace(/[()]/g,'')}.${safetyNote}${recentConflict?' '+recentConflict.charAt(0).toUpperCase()+recentConflict.slice(1)+'.':''}`;
}

// ── Stacked faction power bar ─────────────────────────────────────────────────
function FactionBar({ factions }) {
  const total = factions.reduce((s,f)=>s+(f.power||0),0)||100;
  if (!factions.length) return null;
  const modStyle={
    occupied:{c:'#8b1a1a',bg:'#fdf0f0',br:'#d4a0a0',label:'occupied'},
    contested:{c:'#7a3a1a',bg:'#fdf4ec',br:'#d4b090',label:'contested'},
    vacant:{c:'#1a3a8b',bg:'#f0f0fd',br:'#a0a0d4',label:'vacant'},
  };
  return (
    <div>
      <div style={{display:'flex',height:20,borderRadius:4,overflow:'hidden',gap:1,marginBottom:10}}>
        {factions.map((f,i)=>{
          const pct=Math.round((f.power||0)/total*100);
          const c=factionColors[i%factionColors.length];
          // The bar share is encoded by width + the per-row number below, so
          // the sub-11px in-bar % was decorative; dropped per checklist 23.
          return <div key={i} title={`${pct}%`} style={{flex:pct,background:c,minWidth:pct>5?undefined:0,overflow:'hidden'}}/>;
        })}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:5}}>
        {factions.map((f,i)=>{
          const c=factionColors[i%factionColors.length];
          const mods=(f.modifiers||[]).concat(f.modifier?[f.modifier]:[]);
          return <div id={entityAnchor('faction', { id:f.id || f.faction, name:f.faction })} key={i} style={{display:'flex',alignItems:'center',gap:7,scrollMarginTop:80}}>
            <div style={{width:10,height:10,borderRadius:2,background:c,flexShrink:0}}/>
            <span style={{fontSize:FS.sm,fontWeight:600,color:ink,flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.faction}</span>
            {mods.slice(0,2).map((mod,j)=>{
              const ms=modStyle[mod]||{c:'#6b5340',bg:'#f5f0e8',br:'#c8b89a',label:mod};
              return <span key={j} style={{fontSize:FS.micro,fontWeight:600,color:ms.c,background:ms.bg,border:`1px solid ${ms.br}`,borderRadius:3,padding:'0 4px',letterSpacing:'0.03em',textTransform:'uppercase',flexShrink:0}}>{ms.label}</span>;
            })}
            <span style={{fontSize:FS.xs,fontWeight:700,color:ink,flexShrink:0}}>{f.power}%</span>
          </div>;
        })}
      </div>
    </div>
  );
}

// ── Situation tile ────────────────────────────────────────────────────────────
// Extracted to module scope so React Compiler can memoize it cleanly.
// Used as <SitTile/> in the SITUATION ROW below.
// `tier` ('good'|'warn'|'bad') drives a SECOND, non-color channel — a glyph +
// word qualifier beside the eyebrow — so Power/Economy/Defense health is not
// signalled by red/green alone. (P7 / checklist 23.)
const SIT_TIER={good:{glyph:'✓',word:'Stable'},warn:{glyph:'•',word:'Strained'},bad:{glyph:'!',word:'Critical'}};
function SitTile({ icon, label, value, color, sub, tier }) {
  const q=tier?SIT_TIER[tier]:null;
  // The raw threshold `color` carries the hue on the 3px top border (non-text,
  // 3:1 floor). For the small eyebrow + qualifier TEXT the warn/gold case
  // (#a0762a) fails 4.5:1 on the tile, so its text role swaps to GOLD_TXT;
  // green/red already clear AA. (P7 / checklist 23.)
  const textColor=color==='#a0762a'?goldTxt:color;
  return (
    <div style={{flex:1,minWidth:0,background:swatch['#FAF8F4'],border:`1px solid ${color}30`,borderTop:`3px solid ${color}`,borderRadius:6,padding:'8px 10px'}}>
      <div style={{display:'flex',alignItems:'baseline',gap:5,marginBottom:3}}>
        <span style={{fontSize:FS.xxs,fontWeight:700,color:textColor,textTransform:'uppercase',letterSpacing:'0.05em'}}>{icon} {label}</span>
        {q&&<span style={{fontSize:FS.xxs,fontWeight:700,color:textColor,marginLeft:'auto'}} title={q.word}>{q.glyph} {q.word}</span>}
      </div>
      <div style={{fontSize:FS.sm,fontWeight:700,color:ink,lineHeight:1.3,marginBottom:sub?2:0}}>{value}</div>
      {sub&&<div style={{fontSize:FS.xs,color:BODY,lineHeight:1.3}}>{sub}</div>}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function SummaryTab({ settlement:r, saveId=null, hideIdentity=false, onNavigateTab=null }) {
  const [copied,setCopied]=useState(false);
  const [settingOpen,setSettingOpen]=useState(false);
  const [hooksOpen,setHooksOpen]=useState(true);
  const [instOpen,setInstOpen]=useState(false);
  if (!r) return null;

  const {name,tier,population:pop,institutions:g=[],npcs:w=[],conflicts:allConflicts=[],economicState:eco={},spatialLayout:spatial,powerStructure:ps={},history:hist={},settlementReason:reason,config:cfg={},stress:stressRaw,prominentRelationship:pr}=r;
  const isMobile=window.innerWidth<640;
  const stresses=(Array.isArray(stressRaw)?stressRaw:stressRaw?[stressRaw]:[]).filter(Boolean);
  const allFactions=ps?.factions||[];
  const tradeAccess=(cfg.tradeRouteAccess||'road').replace(/_/g,' ');
  const tierLabel=TIER_LABELS[tier]||tier;
  const firstQuarter=spatial?.quarters?.[0];
  // Deficit % from the canonical display model (residual ÷ daily need), matching
  // the PDF — not the engine's gross deficitPercent. (A+ pdf.3.)
  const foodCanon=deriveFoodBalance(r);
  const topNPCs=[...(w||[])].sort((a,b)=>(b.power||0)-(a.power||0)).slice(0,6);
  const dp=r.defenseProfile||{};
  const allHooks=collectPlotHooks(r);
  const hookCounts=countPlotHookCategories(allHooks);

  // Institution categories
  const instByCat=g.reduce((acc,inst)=>{
    const cat=inst.category||'other';
    (acc[cat]=acc[cat]||[]).push(inst);
    return acc;
  },{});
  const catOrder=['Essential','Economy','Crafts','Government','Defense','Religious','Magic','Adventuring','Criminal','Entertainment','Infrastructure'];

  const copyText=()=>{
    // The markdown shape lives in the shared buildLegacySummaryMarkdown so this
    // tab and SummaryTabV2 can't drift on the at-the-table export. This caller
    // derives the per-line strings/rosters (the engine work) and hands them in.
    const lines=buildLegacySummaryMarkdown(r, {
      tierLabel,
      tradeAccess,
      age: hist?.age,
      stresses,
      characterSentence: characterSentence(r),
      powerLine: `${allFactions.slice(0,3).map(f=>`${f.faction} (${f.power}%)`).join(', ')}. ${ps?.stability||''}`,
      economyLine: `${eco.prosperity||'?'} - ${eco.economicComplexity||''}. Exports: ${eco.primaryExports?.join(', ')||'none'}.${foodCanon.deficit>0?` Food deficit ${foodCanon.deficitPct}%.`:''}`,
      defenseLine: dp.readiness?.label||'Unknown',
      npcs: topNPCs.map(v=>{
        const traits=normalizeNpcTraits(v).filter(t=>t.visibility!=='gm').slice(0,4).map(t=>`${t.label}: ${t.value}`).join('; ');
        return { line: `${v.name} (${v.title||v.role||'NPC'}): ${traits || 'No visible traits listed'}` };
      }),
      hooks: allHooks.map(v=>({ source: v.source, text: v.text })),
    });
    navigator.clipboard?.writeText(lines);
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  // Economy situation tile values
  const ecoTileColor=eco.prosperity==='Thriving'||eco.prosperity==='Prosperous'?'#1a5a28':eco.prosperity==='Struggling'||eco.prosperity==='Poor'||eco.prosperity==='Impoverished'?'#8b1a1a':'#a0762a';
  const ecoSub=foodCanon.deficit>0?`Food deficit ${foodCanon.deficitPct}%`:foodCanon.surplus>0?'Food surplus':'';

  // Defense tile — use the canonical posture helper so the screen and PDF
  // share ONE formula (rounded mean of ALL numeric score keys, incl.
  // `disaster`). The old inline 5-key mean diverged from the PDF/canon average
  // and rendered NaN when a score key was absent.
  const defScore=deriveDefensePosture(r).scoreAvg;
  const defColor=defScore>=70?'#1a5a28':defScore>=45?'#a0762a':defScore>=25?'#8a4010':'#8b1a1a';

  // Power stability color
  const powStab=ps?.stability||'';
  const powColor=powStab.toLowerCase().includes('stable')&&!powStab.toLowerCase().includes('unstable')?'#1a5a28':powStab.toLowerCase().includes('critical')||powStab.toLowerCase().includes('desperate')?'#8b1a1a':'#a0762a';

  // Map each tile's threshold color to a non-color status tier so SitTile can
  // carry good/warn/bad in a 2nd channel (glyph + word). (P7 / checklist 23.)
  const tierFor=c=>c==='#1a5a28'?'good':(c==='#8b1a1a'||c==='#8a4010')?'bad':'warn';

  return (
    <div>
      <TabIntro tabKey="summary" />

      {/* ── STATE AT A GLANCE (promoted read-view 4-dim strip) ───────────────
          UX overhaul Phase 2: the SystemStateBar twin, derived purely from the
          settlement, promoted OUT of premium editMode to the top of every read
          view at every altitude — the clean 4-dim glance for a new DM. */}
      <ReadSystemStateBar settlement={r} />

      {/* ── IDENTITY HEADER ──────────────────────────────────────────────────
          Suppressed when the dossier's own DossierHeaderRow is shown (saved
          view), so name/tier aren't rendered twice. */}
      {!hideIdentity && (
        <div style={{background:'linear-gradient(135deg,#1c1409 0%,#2d1f0e 70%,#1c1409 100%)',borderRadius:8,padding:isMobile?'14px':'16px 20px',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10,marginBottom:8}}>
            <div style={{minWidth:0,flex:1}}>
              <div style={{...serif,fontSize:isMobile?22:28,fontWeight:600,color:swatch['#C49A3C'],lineHeight:1.1,marginBottom:4}}>{name}</div>
              <div style={{fontSize:FS.xs,color:swatch.inkMag3,letterSpacing:'0.02em'}}>{tierLabel} · {pop?.toLocaleString()} pop. · {tradeAccess} · est. {hist?.age?`~${hist.age} yrs ago`:'unknown'}</div>
            </div>
            <Button variant="gold" size="md" onClick={copyText} style={{flexShrink:0}}>
              {copied?'✓ Copied':'Copy'}
            </Button>
          </div>
          <p style={{fontSize: FS['13.5'],...serif,color:swatch['#E8D8B0'],lineHeight:1.65,margin:0,fontStyle:'italic'}}>
            {name} is a {characterSentence(r)}
          </p>
        </div>
      )}

      {/* ── WHAT CHANGED & WHY (post-advance; self-gates without a prior snapshot) ──
          UX overhaul Phase 2: compareCausalState before→after + populationHistory.
          When a prior snapshot exists the deltas are the highest-signal content,
          so this leads the read directly below identity (P3 / audit: surface
          deltas at the top). Renders nothing for a never-advanced settlement. */}
      <WhatChangedPanel
        settlement={r}
        priorSettlement={r.priorSettlement || null}
        before={r.priorCausalState || null}
        populationHistory={r.populationHistory}
      />

      {/* ── ACTIVE CRISIS (if any) ───────────────────────────────────────── */}
      {stresses.length>0&&<div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:24}}>
        {stresses.map((v,i)=>(
          <div key={i} style={{border:`2px solid ${v.colour}`,borderRadius:8,padding:'14px 16px',background:`${v.colour}10`}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <span style={{fontSize: FS['22'],lineHeight:1}}>{v.icon}</span>
              <span style={{...serif,fontSize: FS['18'],fontWeight:700,color:v.colour}}>{v.label}</span>
              <span style={{fontSize:FS.micro,fontWeight:800,color:swatch.white,background:v.colour,borderRadius:4,padding:'2px 7px',letterSpacing:'0.07em'}}>Active Crisis</span>
            </div>
            <p style={{fontSize:FS.md,color:ink,lineHeight:1.55,marginBottom:8}}>{v.summary}</p>
            <div style={{borderTop:`1px solid ${v.colour}35`,paddingTop:8}}>
              <span style={{fontSize:FS.xs,fontWeight:700,color:v.colour,textTransform:'uppercase',letterSpacing:'0.05em',marginRight:6}}>Hook:</span>
              <span style={{fontSize:FS.sm,color:swatch['#3A2A10'],fontStyle:'italic',lineHeight:1.45}}>{v.crisisHook}</span>
            </div>
          </div>
        ))}
      </div>}

      {/* ── ARRIVAL SCENE ────────────────────────────────────────────────── */}
      {r.arrivalScene&&<div style={{background:swatch.inkMag,borderRadius:8,padding:'14px 18px',marginBottom:14,border:'1px solid #3a2a10'}}>
        <div style={{fontSize:FS.xxs,fontWeight:700,color:gold,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>Arrival</div>
        <p style={{...serif,fontSize: FS['14'],color:swatch['#F0E8D8'],lineHeight:1.8,margin:0,fontStyle:'italic'}}>{r.arrivalScene}</p>
      </div>}

      {/* Pressure sentence — only when it isn't already carried by an
          arrivalScene OR an active crisis (the crisis/header already state the
          pressure), so identity isn't restated as its own band. (P4 one
          focal point; P1 lead with essentials once.) */}
      {r.pressureSentence&&!r.arrivalScene&&!stresses.length&&<div style={{background:swatch.inkMag,border:'1px solid #3a2a10',borderRadius:7,padding:'10px 14px',marginBottom:14}}>
        <div style={{fontSize:FS.xxs,fontWeight:700,color:gold,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>Current Situation</div>
        <p style={{fontSize:FS.md,color:swatch['#F0E8D8'],lineHeight:1.55,margin:0,fontStyle:'italic'}}>{r.pressureSentence}</p>
      </div>}

      {/* ── SITUATION ROW (3 scannable tiles) ─────────────────────────────
          Looser gap below closes the situation/state cluster before the deep
          faction/figures stack begins. (P5 differential spacing.) */}
      <div style={{display:'flex',gap:8,marginBottom:24,flexWrap:'wrap'}}>
        <SitTile icon="" label="Power" value={powStab.split(';')[0].split(', ')[0].trim()||NO_VALUE} color={powColor} tier={tierFor(powColor)} sub={allFactions[0]?.faction}/>
        <SitTile icon="" label="Economy" value={eco.prosperity||NO_VALUE} color={ecoTileColor} tier={tierFor(ecoTileColor)} sub={ecoSub||eco.economicComplexity?.split(', ')[0].trim()}/>
        <SitTile icon="" label="Defense" value={dp.readiness?.label||NO_VALUE} color={defColor} tier={tierFor(defColor)} sub={defScore?`Avg. score ${defScore}/100`:undefined}/>
      </div>

      {/* ── FAITH & WAR (live worldState; self-gates when at peace) ───────── */}
      <FaithWarBlock settlement={r} saveId={saveId} />

      {/* ── POWER + CONFLICTS ────────────────────────────────────────────────
          Supporting tier: de-boxed to a single accent left-border + tint (no
          4-side border/radius); vertical spacing carries separation. (P5 /
          checklist 20 anti-box-soup.) */}
      <div style={{background:swatch['#F4F6FD'],borderLeft:'3px solid #2a3a7a',padding:'4px 0 4px 14px',marginBottom:20}}>
        <div style={{fontSize:FS.xxs,fontWeight:800,color:swatch.info,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10}}>Power & Conflict</div>
        <FactionBar factions={allFactions.slice(0,5)}/>
        {ps?.recentConflict&&<p style={{fontSize:FS.xs,color:swatch.danger,marginTop:8,lineHeight:1.4}}> {ps.recentConflict}</p>}
        {allConflicts.length>0&&<>
          <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.info,textTransform:'uppercase',letterSpacing:'0.05em',margin:'12px 0 6px'}}>Active Conflicts</div>
          {/* Flattened to one elevation — conflict rows separated by spacing +
              their colored left-border, not nested mini-cards. (P5.) */}
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {allConflicts.map((c,i)=>{
              const iHigh=c.intensity==='high';
              return <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,paddingLeft:8,borderLeft:`3px solid ${iHigh?'#8b1a1a':'#a0762a'}`}}>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{fontSize:FS.sm,fontWeight:700,color:ink}}>{c.parties?.[0]}</span>
                  <span style={{fontSize:FS.xs,color:BODY}}> vs </span>
                  <span style={{fontSize:FS.sm,fontWeight:700,color:ink}}>{c.parties?.[1]}</span>
                  <span style={{fontSize:FS.xs,fontWeight:700,color:iHigh?'#8b1a1a':'#a0762a',background:iHigh?'#fdf0f0':'#faf4e8',borderRadius:3,padding:'0 4px',marginLeft:6}}>{iHigh?'High':'Moderate'}</span>
                  {c.issue&&<p style={{fontSize:FS.xs,color:second,margin:'2px 0 0',lineHeight:1.3}}>{c.issue}</p>}
                </div>
              </div>;
            })}
          </div>
        </>}
      </div>

      {/* ── PROMINENT RELATIONSHIP ──────────────────────────────────────────
          Supporting tier: de-boxed to accent left-border + tint. */}
      {pr?.phrasing&&<div style={{background:swatch['#F7F0E4'],borderLeft:'3px solid #6b5340',padding:'4px 0 4px 13px',marginBottom:20}}>
        <div style={{fontSize:FS.xxs,fontWeight:700,color:second,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Notable Connection</div>
        <p style={{fontSize: FS['12.5'],...serif,color:swatch['#3A2A10'],lineHeight:1.6,margin:0,fontStyle:'italic'}}>{pr.phrasing}</p>
        {/* Real navigation control replacing the 'See Relationships tab' text
            reference — a ghost button wired to the dossier's tab handler. */}
        {onNavigateTab&&<div style={{marginTop:5}}><Button variant="ghost" size="sm" onClick={()=>onNavigateTab('relationships')} style={{padding:'2px 6px'}}>See the full relationship web →</Button></div>}
      </div>}

      {/* ── KEY FIGURES (roster grid) ─────────────────────────────────────────
          Hero tier: keeps the full bordered card + tint so the people-to-run
          stay a dominant secondary focal point; header promoted to FS.sm/800. */}
      <div style={{background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderLeft:'3px solid #3d2b1a',borderRadius:8,padding:'12px 14px',marginBottom:20}}>
        <div style={{fontSize:FS.sm,fontWeight:800,color:ink,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:10}}>Key Figures</div>
        {topNPCs.length>0
          ?<div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'8px 16px'}}>
            {topNPCs.map((v,i)=>{
              const traits=normalizeNpcTraits(v);
              const visibleTraits=traits.filter(t=>t.visibility!=='gm').slice(0,5);
              const catCol=catColor(v.category)||gold;
              return <div id={entityAnchor('npc', v)} key={i} style={{display:'flex',gap:8,alignItems:'flex-start',padding:'6px 0',borderBottom:i<topNPCs.length-2||isMobile?'1px solid #f0ead8':'none',scrollMarginTop:80}}>
                <div style={{width:3,borderRadius:2,background:catCol,alignSelf:'stretch',flexShrink:0,minHeight:32}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'baseline',gap:5,marginBottom:2,flexWrap:'wrap'}}>
                    <span style={{fontSize:FS.md,fontWeight:700,color:ink}}>{v.name}</span>
                    <span style={{fontSize:FS.xs,color:BODY}}>{v.title}</span>
                    {v.influence==='high'&&<span title="High influence" aria-label="High influence" style={{fontSize:FS.xs,color:goldTxt,fontWeight:700}}>●●● High</span>}
                  </div>
                  {visibleTraits.length>0&&<div style={{display:'flex',gap:3,flexWrap:'wrap',marginBottom:3}}>
                    {visibleTraits.map((t,j)=><span key={`${t.key}-${j}`} title={t.value} style={{fontSize:FS.xs,color:BODY,background:swatch['#EDE3CC'],borderRadius:3,padding:'0 4px'}}>{t.label}: {t.value}</span>)}
                  </div>}
                  {(v.goal?.short||v.goals?.[0])&&<p style={{fontSize:FS.xs,color:swatch.inkMag2,margin:0,lineHeight:1.3}}>
                    <span style={{color:goldTxt,fontWeight:700}}>→ </span>{v.goal?.short||v.goals?.[0]}
                  </p>}
                </div>
              </div>;
            })}
          </div>
          :<p style={{fontSize:FS.sm,color:BODY,fontStyle:'italic',margin:0}}>No NPCs generated.</p>
        }
      </div>

      {/* ── PLOT HOOKS (collapsible) ─────────────────────────────────────────
          Supporting tier: de-boxed to the accent-left idiom (single 3px left
          border + tint, no 4-side border/radius) so only KEY FIGURES keeps the
          full boxed elevation as the one secondary focal point. The expand cue
          survives on the ▲/▼ chevron + ghost-button hover. (P4 / P5.) */}
      {allHooks.length>0&&<div style={{borderLeft:'3px solid #5a2a8a',background:hooksOpen?'#f4f0fd':'#f8f4fd',marginBottom:12}}>
        <Button variant="ghost" aria-expanded={hooksOpen} aria-pressed={hooksOpen} onClick={()=>setHooksOpen(v=>!v)} fullWidth trailingIcon={<span style={{fontSize:FS.xs,color:muted}}>{hooksOpen?'▲':'▼'}</span>} style={{justifyContent:'space-between',padding:'9px 13px',background:'transparent',border:'none',borderRadius:0,WebkitTapHighlightColor:'transparent'}}>
          <span style={{fontSize:FS.xs,fontWeight:700,color:swatch.magic,textTransform:'uppercase',letterSpacing:'0.06em'}}>Plot Hooks ({allHooks.length})</span>
        </Button>
        {hooksOpen&&<div style={{padding:'0 14px 10px'}}>
          <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:10}}>
            {Object.entries(hookCounts).map(([cat,count])=>{
              const meta=PLOT_HOOK_CATEGORIES[cat]||PLOT_HOOK_CATEGORIES.tension;
              return <span key={cat} style={{fontSize:FS.xs,fontWeight:700,color:meta.color,background:`${meta.color}12`,border:`1px solid ${meta.color}30`,borderRadius:4,padding:'1px 6px'}}>{meta.label} {count}</span>;
            })}
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {allHooks.map((v,i)=>{
              const meta=PLOT_HOOK_CATEGORIES[v.category]||PLOT_HOOK_CATEGORIES.tension;
              return (
              <div id={entityAnchor('hook', { id:`${v.category}-${i}`, name:v.text.slice(0,40) })} key={i} style={{display:'flex',gap:10,alignItems:'flex-start',scrollMarginTop:80}}>
                <span style={{width:4,alignSelf:'stretch',borderRadius:2,background:meta.color,opacity:v.accent?1:0.55,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{fontSize:FS.xs,fontWeight:700,color:meta.color,textTransform:'uppercase',letterSpacing:'0.04em',marginRight:6}}>{v.source}</span>
                  {v.role&&<span style={{fontSize:FS.xs,color:BODY,marginRight:6}}>{v.role}</span>}
                  {v.sub&&<span style={{fontSize:FS.xs,color:v.accent?meta.color:BODY,fontStyle:v.accent?'normal':'italic'}}>{v.sub}</span>}
                  <span style={{fontSize:FS.md,color:ink,lineHeight:1.5}}>{v.text}</span>
                  {v.links?.length>0&&<div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:4}}>
                    {v.links.slice(0,4).map((link,j)=>{
                      const anchor=entityAnchor(link.kind, { id:link.id, name:link.label });
                      return <a key={`${link.kind}-${j}`} href={`#${anchor}`} style={{fontSize:FS.xs,fontWeight:700,color:meta.color,background:`${meta.color}10`,border:`1px solid ${meta.color}25`,borderRadius:3,padding:'1px 5px',textDecoration:'none'}}>{link.label}</a>;
                    })}
                  </div>}
                </div>
              </div>
            );})}
          </div>
        </div>}
      </div>}

      {/* ── SETTING accordion ───────────────────────────────────────────────
          Supporting tier: de-boxed to the accent-left idiom (3px left border +
          tint), matching Plot Hooks / Power & Conflict. (P4 / P5.) */}
      {(firstQuarter||spatial?.layout||hist?.historicalCharacter||Array.isArray(reason))&&<div style={{borderLeft:'3px solid #1a5a28',background:settingOpen?'#edf5e8':'#f4faf0',marginBottom:10}}>
        <Button variant="ghost" aria-expanded={settingOpen} aria-pressed={settingOpen} onClick={()=>setSettingOpen(v=>!v)} fullWidth trailingIcon={<span style={{fontSize:FS.xs,color:muted}}>{settingOpen?'▲':'▼'}</span>} style={{justifyContent:'space-between',padding:'9px 13px',background:'transparent',border:'none',borderRadius:0,WebkitTapHighlightColor:'transparent'}}>
          <span style={{fontSize:FS.xs,fontWeight:700,color:swatch['#1A4A2A'],textTransform:'uppercase',letterSpacing:'0.06em'}}>Setting & Context</span>
        </Button>
        {settingOpen&&<div style={{padding:'0 14px 12px'}}>
          {/* Layout + historical character */}
          {(spatial?.layout||hist?.historicalCharacter)&&<div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:8}}>
            {spatial?.layout&&<p style={{fontSize:FS.xs,fontWeight:600,color:swatch.inkMag2,margin:0,flex:'1 1 140px'}}>{spatial.layout}</p>}
            {hist?.historicalCharacter&&<p style={{fontSize:FS.xs,color:second,fontStyle:'italic',margin:0,flex:'1 1 120px'}}>{hist.historicalCharacter}</p>}
          </div>}
          {/* All quarters listed compactly */}
          {spatial?.quarters?.length>0&&<div style={{display:'flex',flexDirection:'column',gap:5,marginBottom:10}}>
            {spatial.quarters.map((q,i)=><div key={i} style={{display:'flex',gap:8,alignItems:'baseline'}}>
              <span style={{fontSize:FS.xs,fontWeight:700,color:swatch['#1A4A2A'],flexShrink:0,minWidth:130}}>{q.name}</span>
              <span style={{fontSize:FS.xs,color:swatch.inkMag3}}>{q.location}</span>
              {q.landmarks?.length>0&&<span style={{fontSize:FS.xs,color:BODY}}>{q.landmarks.slice(0,2).join(', ')}</span>}
            </div>)}
          </div>}
          {spatial?.tradeAccess&&<p style={{fontSize:FS.xs,color:second,margin:'0 0 6px',fontStyle:'italic'}}>Access: {spatial.tradeAccess}</p>}
          {Array.isArray(reason)&&reason.length>0&&<div>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:second,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Why This Settlement Exists</div>
            {reason.map((line,i)=><p key={i} style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.5,paddingLeft:10,borderLeft:'2px solid #e0d0b0',margin:'0 0 4px'}}>{line}</p>)}
          </div>}
          {r.pressureSentence&&stresses.length>0&&<div style={{marginTop:10,background:swatch['#F7F0E4'],borderLeft:'3px solid #a0762a',borderRadius:4,padding:'7px 10px'}}>
            <p style={{fontSize:FS.sm,color:swatch['#3A2A10'],fontStyle:'italic',margin:0}}>{r.pressureSentence}</p>
          </div>}
        </div>}
      </div>}

      {/* ── INSTITUTIONS (categorized) ────────────────────────────────────────
          Supporting tier: de-boxed to the accent-left idiom (3px neutral left
          border + tint), matching Setting / Plot Hooks; the category-count pills
          stay in the header trailing slot. (P4 / P5.) */}
      <div style={{borderLeft:'3px solid #6b5340',background:instOpen?'#f0e8d8':'#f7f0e4'}}>
        <Button variant="ghost" aria-expanded={instOpen} aria-pressed={instOpen} aria-label={`Institutions, ${g.length} total, ${instOpen?'collapse':'expand'}`} onClick={()=>setInstOpen(v=>!v)} fullWidth trailingIcon={
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            {catOrder.filter(c=>instByCat[c]?.length).map(c=>(
              <span key={c} style={{fontSize:FS.xs,fontWeight:600,color:catColor(c),background:`${catColor(c)}15`,borderRadius:3,padding:'1px 6px'}}>{instByCat[c].length}</span>
            ))}
            <span style={{fontSize:FS.xs,color:BODY,marginLeft:4}}>{instOpen?'▲':'▼'}</span>
          </div>
        } style={{justifyContent:'space-between',padding:'12px 13px',background:'transparent',border:'none',borderRadius:0,WebkitTapHighlightColor:'transparent'}}>
          <span style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:FS.xs,fontWeight:700,color:second,textTransform:'uppercase',letterSpacing:'0.06em'}}>Institutions</span>
            <span style={{fontSize:FS.xs,color:BODY}}>{g.length} total</span>
          </span>
        </Button>
        {instOpen&&<div style={{padding:'0 14px 10px'}}>
          {catOrder.filter(cat=>instByCat[cat]?.length).map(cat=>(
            <div key={cat} style={{marginBottom:10}}>
              <div style={{fontSize:FS.xs,fontWeight:700,color:catColor(cat),textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>{cat} ({instByCat[cat].length})</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {instByCat[cat].sort((a,b)=>a.name.localeCompare(b.name)).map((inst,i)=>{
                  const srcColor=inst.source==='required'?gold:inst.source==='forced'?'#1a5a28':inst.source==='auto-resolved'?'#2a3a7a':'#6b5340';
                  return <span id={entityAnchor('institution', inst)} key={i} style={{fontSize:FS.xs,padding:'2px 8px',borderRadius:4,background:`${srcColor}10`,border:`1px solid ${srcColor}30`,color:ink,fontWeight:500,scrollMarginTop:80}}>{inst.name}</span>;
                })}
              </div>
            </div>
          ))}
        </div>}
      </div>

    </div>
  );
}

export default React.memo(SummaryTab);
