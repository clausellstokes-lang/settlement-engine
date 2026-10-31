import React, { useState, useMemo } from 'react';
import { FS, swatch, MUTED } from '../../theme.js';
import { serif, Collapsible, Section, Empty } from '../Primitives';
import { tokenCase } from '../labelLadder.js';
import {EVENT_COLORS, SEV_COLORS} from '../tabConstants';
import useIsMobile from '../../../hooks/useIsMobile.js';

import {NarrativeNote} from '../NarrativeNote';
import Button from '../../primitives/Button.jsx';
// THE GENERAL DESK IS REACHED THROUGH ITS ONE CALLER (the mount registry's ARM 2), which
// also owns the §885.3 public gate: corpus prose is a PAID surface and this tab is not
// filtered off a free gallery dossier.
import { generalDeskLines } from '../generalDeskRead.js';
// THE STILL-RELEVANT MARK IS A HOOK MARKER (owner addendum X-14b), derived in one place.
import { eventHasOpenThread, timelineEntryHasOpenThread } from '../../../domain/display/historyOpenThreads.js';
// THE ONE PARAGRAPH RENDERER (owner finding 2026-09-18). The founding/record pair and the
// four identity lenses each rendered one `<p>` per sentence; they are now one paragraph
// each. The DRAW is unchanged — the same strings `drawnAtMount` ruled on in the reader.
import ProseBlock from '../ProseBlock.jsx';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import { edged } from '../../../design/edgedBox.js';
import { entityAnchor, eventIdFor } from '../../../domain/dossier/entityLinks.js';
import { useEntityFocus } from '../../dossier/useEntityFocus.js';

// Extended event type colors (EVENT_COLORS only covers 5 types)
const ALL_EC = {
  ...EVENT_COLORS,
  demographic: {color:'#1a5a28',bg:'#f0faf2',border:'#a8d8b0',label:'Demographic'},
  exile_return: {color:'#7a4010',bg:'#faf4ec',border:'#d8c090',label:'Exile & Return'},
  occupation_infiltration: {color:'#3a1a6a',bg:'#f4f0fd',border:'#c0b0e0',label:'Occupation'},
};

// Tension type colors + labels
const TENSION_META = {
  crime_wave:          {color:'#8b1a1a',label:'Crime Wave'},
  economic_disparity:  {color:'#7a5010',label:'Economic Disparity'},
  guild_conflict:      {color:'#8a4010',label:'Guild Conflict'},
  infiltration_fear:   {color:'#3a1a6a',label:'Infiltration Fear'},
  leadership_vacuum:   {color:'#5a5a1a',label:'Leadership Vacuum'},
  magical_controversy: {color:'#5a2a8a',label:'Magical Controversy'},
  occupation_legacy:   {color:'#1a2a5a',label:'Occupation Legacy'},
  outside_debt:        {color:'#6b4010',label:'External Debt'},
  resource_scarcity:   {color:'#7a4010',label:'Resource Scarcity'},
  succession_crisis:   {color:'#8b1a1a',label:'Succession Crisis'},
};

// Recency label
const recencyLabel = yrs => yrs<=10?'Recent':yrs<=30?'Living memory':yrs<=80?'Last century':yrs<=200?'Ancient':'Deep history';
const recencyColor = yrs => yrs<=10?'#8b1a1a':yrs<=30?'#a0762a':yrs<=80?'#5a6a1a':yrs<=200?'#2a4a7a':'#5a2a8a';

// Build event card text: the event's own name is the title (falling back to
// the type label), and the description renders IN FULL — it is the card's
// only body and runs at most ~117 chars, so truncation only ever hid prose.
const eventTitle = (evt) => {
  const ec = ALL_EC[evt.type] || ALL_EC.political;
  const name = typeof evt.name === 'string' && evt.name.trim() ? evt.name.trim() : ec.label;
  const desc = typeof evt.description === 'string' ? evt.description : '';
  return {label: ec.label, name, desc};
};

/**
 * One current-tension row, extracted verbatim from the tab (BUILD-W2-SEARCH U2, no behaviour
 * change) so the dossier search mounts a tension through its own row.
 */
export function TensionRow({t}) {
  const mobile = useIsMobile();
  // The table above names ten tension types and the engine writes more than ten
  // (the campaign path adds `external_threat` and its siblings), so the fallback
  // was printing the raw kind. A kind the table has not styled still reads as a
  // phrase rather than as an identifier.
  const tm = TENSION_META[t.type] || {color:'#b8860b',label:tokenCase(t.type)||'Tension'};
  const sevArr = Array.isArray(t.severity)?t.severity:[t.severity].filter(Boolean);
  const maxSev = sevArr.includes('catastrophic')?'catastrophic':sevArr.includes('major')?'major':'minor';
  const border = maxSev==='catastrophic'?'#8b1a1a':maxSev==='major'?'#b8860b':'#a0762a';
  return (
    <div style={{border:`1px solid ${border}40`,borderLeft:`3px solid ${border}`,background:swatch['#FDF8E8'],padding:'12px 14px'}}>
      {/* Header */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
        <span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:tm.color}}>{tm.label}</span>
        {sevArr.filter(s=>s&&SEV_COLORS[s]).map((s,j)=>(
          <span key={j} style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:SEV_COLORS[s]||'#6b5340',background:`${SEV_COLORS[s]||'#6b5340'}18`,padding:'0 5px',letterSpacing:'0.04em'}}>{s}</span>
        ))}
      </div>
      {/* Description. The tension's plot hooks live on the Plot Hooks tab (X-2). */}
      <p style={{fontSize:proseFontSize(FS.md, mobile),color:swatch.inkMag2,lineHeight:1.55,margin:'0 0 6px'}}>{typeof t==='object'?t.description||t.issue||t.type:String(t)}</p>
      {/* Factions */}
      {t.factions?.length>0&&<div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
        {t.factions.map((f,j)=><span key={j} style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:600,color:swatch['#7A5010'],background:swatch['#F5E8C0'],padding:'1px 6px'}}>{f}</span>)}
      </div>}
    </div>
  );
}

/**
 * One historical-event card, extracted verbatim from the tab (BUILD-W2-SEARCH U2, no behaviour
 * change). `h` is the settlement's history (the still-relevant mark reads it); the tab owns
 * which card is open and hands each card `isExp` and `onToggle`.
 */
export function HistoryEventCard({evt, h, isExp, onToggle}) {
  const mobile = useIsMobile();
  const ec = ALL_EC[evt.type] || ALL_EC.political;
  const sev = typeof evt.severity==='string'&&evt.severity.length>2 ? evt.severity : null;
  const {label:typeLabel, name:evtName, desc} = eventTitle(evt);
  const isAnchored = eventHasOpenThread(evt, h);
  const yrsColor = recencyColor(evt.yearsAgo||0);
  const yrsLabel = recencyLabel(evt.yearsAgo||0);
  // X-20 (c): a link to this event opens its detail and scrolls the card to the top. The tab
  // owns which card is open, so focus asks it through `onToggle`, and only when closed.
  const evtId = eventIdFor(evt);
  const { ref: focusRef } = useEntityFocus(evtId, () => { if (!isExp && evt.lastingEffects?.length) onToggle(); });
  return (
    <div ref={focusRef} id={evtId ? entityAnchor('event', { id: evtId }) : undefined} style={{
      ...edged(`1px solid ${isAnchored?ec.color+'60':ec.border}`,`3px solid ${ec.color}`),
      overflow:'hidden',
      background: isAnchored?ec.bg:'#faf8f4',
      cursor:'pointer',
    }} role="button" tabIndex={0} onClick={onToggle} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onToggle();}}}>
      {/* Event header */}
      <div style={{padding:'10px 14px'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:4,flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:120}}>
            <div style={{display:'flex',alignItems:'baseline',gap:6,flexWrap:'wrap',marginBottom:2}}>
              <span style={{...serif,fontSize: FS['14'],fontWeight:600,color:swatch.inkMag}}>{evtName}</span>
              {evtName!==typeLabel&&<span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:ec.color}}>{typeLabel}</span>}
              {sev&&<span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:SEV_COLORS[sev]||'#6b5340',background:`${SEV_COLORS[sev]||'#6b5340'}15`,padding:'0 5px'}}>{sev}</span>}
            </div>
            <p style={{fontSize:proseFontSize(FS.md, mobile),color:swatch.inkMag,lineHeight:1.45,margin:0}}>{desc}</p>
          </div>
          <div style={{flexShrink:0,textAlign:'right'}}>
            <div style={{fontSize:FS.sm,fontWeight:700,color:yrsColor}}>{evt.yearsAgo}y ago</div>
            <div style={{fontSize:chromeFontSize(FS.micro, mobile),color:yrsColor,marginTop:1}}>{yrsLabel}</div>
          </div>
          {evt.lastingEffects?.length>0&&<span style={{fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED,flexShrink:0,paddingTop:2}}>{isExp?'▲':'▼'}</span>}
        </div>
      </div>
      {/* Expanded detail */}
      {/* The event's plot hooks live on the Plot Hooks tab (X-2). */}
      {isExp&&evt.lastingEffects?.length>0&&<div style={{padding:'0 14px 12px 14px',borderTop:`1px solid ${ec.border}`}}>
        {evt.lastingEffects?.length>0&&<div style={{marginBottom:8}}>
          <span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch.inkMag3}}>Lasting Effects: </span>
          <span style={{fontSize: chromeFontSize(FS['11.5'], mobile),color:swatch.inkMag3}}>{evt.lastingEffects.join(' · ')}</span>
        </div>}
      </div>}
    </div>
  );
}

// RECENT EVENTS ARE THE CHRONICLE'S (chair ruling H5, 2026-10-30): the slice this tab
// re-styled was the Chronicle feed's first eight rows, so it is cut and the Chronicle tab
// is the feed's one home. The router may still pass `recentEvents`; nothing reads it.
export function HistoryTab({settlement:r, narrativeNote, onReroll, publicDossier = false, playerView = false}) {
  const [expandedEvent, setExpandedEvent] = useState(null);
  const mobile = useIsMobile(); // hook must precede the early return (rules-of-hooks)
  // DS-GEN-9 (who this town is, and the one event it is still explained by), DS-GEN-14
  // (founded once, grown since) and DS-GEN-16 (what the record still carries forward).
  // ⭐ MEMOISED, AND ABOVE THE EARLY RETURN for the same reason `mobile` is (ARCH §4.1,
  // X-F9, SEAM car 3g): from car 3 this call composes eleven of the desk's blocks through
  // `composeStateProse` rather than through a single kernel read, and the browser-side cost
  // is unmeasured. The result is a pure function of the settlement and the two view flags.
  const historyDesk = useMemo(
    () => generalDeskLines(r, {publicDossier, playerView}).history,
    [r, publicDossier, playerView],
  );
  if (!r?.history) return <Empty message="No historical data available."/>;
  const h = r.history;
  // DS-GEN-9 (history.identity) and DS-GEN-16 (history.record) are GLANCE rows by chair
  // ruling (H3, H4): the founding line is the history desk's one sentence on this page.
  const {foundedLine} = historyDesk;
  const {founding, historicalEvents=[], currentTensions=[], historicalCharacter, age, eventsTimeline=[]} = h;

  // Sort events most recent first
  const sortedEvents = [...historicalEvents].sort((a,b) => (a.yearsAgo||0)-(b.yearsAgo||0));

  // ── THE TIMELINE IS THE EVENTS' HEADER (chair ruling H6, 2026-10-30) ──────────────
  // Every dot is one of the events listed beneath it, so the strip is drawn once, at the
  // head of that list. The big dot is the ONE "still relevant" mark: the card banner and the
  // legend's mark (whose label ended in empty parentheses) are gone, and the dot says it in
  // its own title.
  const timeline = age>0&&eventsTimeline.length>0&&<div data-testid="history-timeline" style={{marginBottom:12}}>
        <div style={{position:'relative',height:36,background:swatch['#F0EAD8'],overflow:'visible',marginTop:14,marginBottom:20}}>
          {/* Axis line */}
          <div style={{position:'absolute',top:'50%',left:0,right:0,height:2,background:swatch['#D0B880'],transform:'translateY(-50%)'}}/>
          {/* ⭐ THE AXIS ENDS ARE WORDS WEARING A STYLE (ODQ §934.63 noticed 6). They were
              the literals FOUNDED and NOW — capitals typed into the content while the
              kicker six lines above sets the very same look with `textTransform`. The
              comments beside them already said what they are ("Founded", "Now"), which is
              how long the two spellings had been sitting next to each other. */}
          <div style={{position:'absolute',left:0,bottom:-16,fontSize:chromeFontSize(FS.micro, mobile),color:MUTED,fontWeight:600,textTransform:'uppercase'}}>Founded</div>
          <div style={{position:'absolute',right:0,bottom:-16,fontSize:chromeFontSize(FS.micro, mobile),color:MUTED,fontWeight:600,textTransform:'uppercase'}}>Now</div>
          {/* Event dots + year labels with collision avoidance */}
          {(() => {
            // Sort by position to detect collisions
            const positioned = eventsTimeline.map((te,i) => ({
              ...te, i,
              open: timelineEntryHasOpenThread(te, h),
              pct: Math.min(97, Math.max(3, Math.round(((age - te.yearsAgo) / age) * 100))),
              ec: ALL_EC[te.type] || ALL_EC.political,
            })).sort((a,b) => a.pct - b.pct);
            // Assign label position: alternate above/below when events are within 12% of each other
            let lastPct = -100, flip = false;
            positioned.forEach(te => {
              if (te.pct - lastPct < 12) { flip = !flip; } else { flip = false; }
              te.labelAbove = flip;
              lastPct = te.pct;
            });
            return positioned.map(te => (
              <div key={te.i}>
                {/* Dot */}
                <div title={`${te.ec.label} - ${te.yearsAgo}y ago${te.open?' · still relevant today':''}`}
                  style={{position:'absolute',left:`${te.pct}%`,top:'50%',
                    transform:'translate(-50%,-50%)',
                    width:te.open?14:10,height:te.open?14:10,
                    background:te.ec.color,
                    border:`2px solid ${te.open?'#fff':swatch['#F0EAD8']}`,
                    outline:te.open?`2px solid ${te.ec.color}`:'none',
                    cursor:'pointer',zIndex:2}}>
                </div>
                {/* Year label — alternates above/below to avoid overlap */}
                <div style={{
                  position:'absolute',left:`${te.pct}%`,
                  top: te.labelAbove ? 1 : 27,
                  transform:'translateX(-50%)',
                  fontSize:chromeFontSize(FS.micro, mobile),fontWeight:600,
                  color:te.ec.color,
                  whiteSpace:'nowrap',
                  lineHeight:1,
                  pointerEvents:'none',
                  zIndex:3,
                }}>
                  {te.yearsAgo}y
                </div>
              </div>
            ));
          })()}
        </div>
        {/* Legend */}
        <div style={{display:'flex',gap:8,marginTop:22,flexWrap:'wrap'}}>
          {[...new Set(eventsTimeline.map(te=>te.type))].map(type=>{
            const ec = ALL_EC[type]||ALL_EC.political;
            return <span key={type} style={{display:'flex',alignItems:'center',gap:4,fontSize:chromeFontSize(FS.xxs, mobile),color:swatch.inkMag3}}>
              <div style={{width:8,height:8,background:ec.color,flexShrink:0}}/>
              {ec.label}
            </span>;
          })}
        </div>
      </div>;

  return (
    <div>
      <NarrativeNote note={narrativeNote} />

      {/* ── IDENTITY HEADER ───────────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#f5ede0,#ede3cc)',border:'1px solid #c8b89a',padding:'14px 18px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'baseline',gap:12,marginBottom:historicalCharacter?8:0,flexWrap:'wrap'}}>
          <span style={{...serif,fontSize:FS.xxl,fontWeight:600,color:swatch.inkMag}}>{r.name}</span>
          <span style={{fontSize:FS.md,color:swatch.inkMag3}}>{age} years old</span>
          {/* The "Keep this history" padlock is gone (owner order 2026-09-17, "remove the
              other padlocks"); the Reroll it wrapped stays, for a viewer who may roll. */}
          {onReroll && (
            <Button variant="gold" size="sm" onClick={onReroll} style={{marginLeft:'auto',flexShrink:0}}>
              ↺ Reroll
            </Button>
          )}
        </div>
        {historicalCharacter&&<p style={{...serif,fontSize: proseFontSize(FS['13.5'], mobile),color:swatch['#4A3020'],lineHeight:1.65,margin:0,fontStyle:'italic'}}>"{historicalCharacter}"</p>}
      </div>


      {/* ── CURRENT TENSIONS (most DM-relevant — first) ──────────────────── */}
      {currentTensions.length>0&&<Section title={`Current Tensions (${currentTensions.length})`} collapsible defaultOpen accent="#b8860b">
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {currentTensions.map((t,i)=><TensionRow key={i} t={t}/>)}
        </div>
      </Section>}

      {/* ── FOUNDING ─────────────────────────────────────────────────────── */}
      {founding&&<Collapsible title="Founding">
        <div style={{background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderLeft:'3px solid #a0762a',padding:'12px 14px'}}>
          <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:'6px 14px',marginBottom:founding.stressNote?10:0}}>
            {[
              {label:'Origin',     value:founding.reason},
              {label:'Founded by', value:founding.foundedBy},
              {label:'Early trial',value:founding.initialChallenge},
              {label:'How survived',value:founding.overcoming},
            ].filter(f=>f.value).map(({label,value})=>(
              <div key={label}>
                <span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:700,color:MUTED,marginRight:5}}>{label}:</span>
                <span style={{fontSize: proseFontSize(FS['12.5'], mobile),color:swatch.inkMag2,lineHeight:1.5}}>{value}</span>
              </div>
            ))}
          </div>
          {founding.stressNote&&<div style={{background:swatch['#FDF4EC'],border:'1px solid #e0c090',borderLeft:'3px solid #b8860b',padding:'8px 10px'}}>
            <p style={{fontSize:proseFontSize(FS.sm, mobile),color:swatch['#5A3010'],lineHeight:1.5,margin:0,fontStyle:'italic'}}>{founding.stressNote}</p>
          </div>}
          {/* ── DS-GEN-14 (history.founded) — the one sentence of texture, coupled to the
              founding facts it explains (chair ruling H3), UNDER them (the block law, X-16:
              prose never above the fact it explains). Open on first paint (H8). */}
          {foundedLine&&<ProseBlock lines={[foundedLine]} settlementName={r.name} tier={r.tier}
            style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.6,margin:'8px 0 0',fontStyle:'italic'}}/>}
        </div>
      </Collapsible>}

      {/* ── MAJOR HISTORICAL EVENTS (sorted recent first) ────────────────── */}
      {sortedEvents.length>0&&<Collapsible title={`Major Historical Events (${sortedEvents.length})`}>
        {timeline}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {sortedEvents.map((evt,i)=><HistoryEventCard key={i} evt={evt} h={h} isExp={expandedEvent===i} onToggle={()=>setExpandedEvent(expandedEvent===i?null:i)}/>)}
        </div>
      </Collapsible>}

    </div>
  );
}

export default React.memo(HistoryTab);
