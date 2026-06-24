import React, { useState } from 'react';
import { FS, swatch, MUTED, BODY } from '../../theme.js';
import {serif, Section, TabIntro} from '../Primitives';
import Button from '../../primitives/Button.jsx';
import EntityLink from '../../primitives/EntityLink.jsx';
import { entityIdFor } from '../../../domain/dossier/entityLinks.js';
import { factionIdFromName } from '../../../lib/entities.js';

import {useIsMobileTab} from '../tabConstants';

import {buildThreatAssessment} from '../../../generators/defenseGenerator';
import {NarrativeNote} from '../NarrativeNote';
import { criminalOpNote, deriveCriminalStructure, deriveDefenseReadiness, deriveSupportingCapabilities } from '../../../domain/display/defenseDisplay.js';
import { resolveMilitaryStress } from '../../../domain/display/warStatusVocab.js';
import { settlementWarStatus } from '../../../domain/display/warStatus.js';
import { DefenseWarFrontSection } from '../../dossier/EngineSections.jsx';
import { useSettlementLiveWorld } from '../../../hooks/useSettlementLiveWorld.js';
import { truncateAtWord } from '../../../lib/text.js';

export function DefenseTab({ settlement:r, narrativeNote, saveId = null}) {
  const [expandedThreat, setExpandedThreat] = useState(null);
  const [showForces, setShowForces] = useState(true);
  const mobile = useIsMobileTab();
  // UX overhaul Phase 2 — resolve the owning campaign's live war status so the
  // frozen defenseProfile can be reframed into a war-front readout. Self-gates to
  // nothing (null status) for a non-campaign / at-peace settlement.
  const { worldState, regionalGraph, nameFor } = useSettlementLiveWorld(saveId);
  const liveWarStatus = (r && saveId)
    ? settlementWarStatus({ settlementId: saveId, worldState, regionalGraph })
    : null;
  if (!r) return null;

  const d = r.defenseProfile || {};
  const scores = d.scores || {};
  const readiness = d.readiness || {label:'Unknown',color:'#9c8068',background:'#faf8f4',border:'#e0d0b0'};
  const inst = d.institutions || {};
  const f = r.economicState?.compound?.inst || {};
  const sp = r.economicState?.safetyProfile || {};
  const ra = r.resourceAnalysis || {};
  const crimCapture = r.powerStructure?.criminalCaptureState || 'none';

  // Score color helper
  const scoreColor = n => n>=65?'#1a5a28':n>=40?'#a0762a':n>=20?'#8a4010':'#8b1a1a';
  const scoreBadge = n => n>=65?'Strong':n>=40?'Adequate':n>=20?'Weak':'Critical';

  // Threat assessment with expandable rows
  const threats = buildThreatAssessment(r);
  const threatScores = {
    'Beasts & Monsters': scores.monster||0,
    'Invasion & War': scores.military||0,
    'Internal Security': scores.internal||0,
    'Economic Survival': scores.economic||0,
    'Disasters & Famine': scores.disaster ?? r.economicState?.foodSecurity?.resilienceScore ?? Math.round(((scores.economic||0)*0.4+(f.hasGranary?60:20)+(f.hasHospital?70:f.hasChurch?40:10))/2),
  };
  // Funding attribution per readiness row (economicGates consumer) — an
  // underfunded gate explains a lower bar instead of leaving it silent.
  const fundingNotes = Object.fromEntries(
    deriveDefenseReadiness(r).filter(row=>row.fundingNote).map(row=>[row.label,row.fundingNote])
  );

  // Military forces grouped
  const walls = inst.walls || [];
  const mainForces = [...(inst.garrison||[]),...(inst.militia||[]),...(inst.watch||[])];
  const mercForces = inst.mercenary || [];
  const charterForces = inst.charter || [];
  const magicDef = inst.magicDef || [];
  const hasAnyForce = mainForces.length||mercForces.length||charterForces.length||magicDef.length;
  const hasAnyFort = walls.length > 0;

  // Criminal architecture data
  const crimInsts  = sp.criminalInstitutions || [];
  const crimeTypes = sp.crimeTypes || [];
  const crimFaction = r.powerStructure?.factions?.find(f=>f.category==='criminal');
  const ratio       = typeof sp.safetyRatio === 'number' ? sp.safetyRatio : null;
  const safetyLabel = sp.safetyLabel || '';
  const _bmc         = sp.blackMarketCapture || 0;

  // Criminal structure classification (shared with the PDF viewModel)
  const csd = deriveCriminalStructure(r);
  const crimStructure = csd?.key || null;

  // Safety severity for UI theming
  const isDangerous  = safetyLabel.includes('Dangerous')||safetyLabel.includes('Desperate');
  const isUnsafe     = safetyLabel.includes('Unsafe')||safetyLabel.includes('Tense')||safetyLabel.includes('Volatile');
  const isControlled = safetyLabel.includes('Controlled')||safetyLabel.includes('Suspicious');
  const isModerate   = safetyLabel.includes('Moderate')||safetyLabel.includes('Safe');
  const orderColor = isDangerous?'#8b1a1a':isUnsafe?'#8a4010':isControlled?'#5a2a6b':isModerate?'#1a5a28':'#a0762a';
  const orderBg    = isDangerous?'#fdf4f4':isUnsafe?'#fdf0e8':isControlled?'#f8f0fc':isModerate?'#f0faf4':'#faf8ec';

  // Stress military status. `wartime` is the AGGRESSOR posture a PULSE-born war
  // surfaces as (war_drain / army_deployed conditions resolve to it via the shared
  // alias) — additive, so a generation save without a wartime status is unchanged.
  const STRESS_STATUS = {
    under_siege:          {posture:'ACTIVE SIEGE',          colour:'#8b1a1a', icon:'️'},
    wartime:              {posture:'AT WAR',                colour:'#8b1a1a', icon:'️'},
    famine:               {posture:'INTERNAL PRESSURE',     colour:'#8b5a1a', icon:'️'},
    occupied:             {posture:'UNDER OCCUPATION',      colour:'#4a3a6b', icon:''},
    politically_fractured:{posture:'COMMAND SPLIT',         colour:'#5a4a1a', icon:''},
    recently_betrayed:    {posture:'SECURITY COMPROMISED',  colour:'#6b1a2a', icon:'️'},
    plague_onset:         {posture:'QUARANTINE ACTIVE',     colour:'#2a5a2a', icon:''},
  };
  // Resolve through the SHARED war-status alias (domain/display/warStatusVocab)
  // so a PULSE-born siege/war (war_pressure / war_drain / army_deployed conditions)
  // lights this banner identically to a GENERATION-born one. A real generation
  // stress is returned UNCHANGED → byte-identical legacy render. The `types` set
  // is exactly the prior STRESS_STATUS scope (faithful superset).
  const militaryStatus = resolveMilitaryStress(r, { types: Object.keys(STRESS_STATUS) });
  const activeStress = militaryStatus?.type || null;
  const stressStatus = activeStress ? STRESS_STATUS[activeStress] : null;
  const stressObj    = militaryStatus;

  // Supporting capabilities (shared with the PDF viewModel)
  const caps = deriveSupportingCapabilities(r);

  // Defense violations
  const defViolations = (r.structuralViolations||[]).filter(v=>
    /fort|milit|wall|garrison|defense|guard|structural|survival/i.test(v.reason||'')
  );

  // Force card component
  const ForceCard = ({inst:i,accent}) => (
    <div style={{background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderLeft:`3px solid ${accent||'#6b5340'}`,borderRadius:6,padding:'9px 12px',marginBottom:6}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
        <div style={{flex:1}}>
          {/* Force/fortification name -> in-dossier cross-link to its
              institution card. Resolved by the SAME id the dossier index
              assigns each institution (entityIdFor), so it follows a rename;
              degrades to the plain name when the force is not a catalogued
              institution (e.g. a synthesized wall) or the Power tab is gated. */}
          <div style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag,marginBottom:i.desc?2:0}}>
            <EntityLink id={entityIdFor('institution', i)} type="institution" fallback={i.name} />
          </div>
          {i.desc&&<div style={{fontSize: FS['11.5'],color:swatch.inkMag3,lineHeight:1.4}}>{i.desc}</div>}
        </div>
        {i.source&&i.source!=='generated'&&<span style={{fontSize:FS.micro,fontWeight:700,color:swatch['#A0762A'],background:swatch['#F0E4C0'],borderRadius:3,padding:'1px 5px',letterSpacing:'0.04em',flexShrink:0}}>{i.source==='required'?'REQ':'FORCED'}</span>}
      </div>
    </div>
  );

  return (
    <div style={{paddingBottom:16}}>
      <TabIntro tabKey="defense" />
      <NarrativeNote note={narrativeNote} />

      {/* ── DEFENSE OVERVIEW HEADER ──────────────────────────────────────── */}
      <div style={{background:readiness.background,border:`1px solid ${readiness.border}`,borderLeft:`4px solid ${readiness.color}`,borderRadius:8,padding:'14px 18px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
          <div style={{flexShrink:0}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>Defensive Posture</div>
            <div style={{fontSize:FS.h1,fontWeight:700,color:readiness.color,lineHeight:1.1,marginBottom:6}}>{readiness.label}</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {ra.terrain&&<span style={{fontSize:FS.xs,color:swatch['#1A4A2A'],background:swatch['#E8F0E8'],border:'1px solid #a8d0a8',borderRadius:4,padding:'2px 8px',fontWeight:600}}>{ra.terrain}</span>}
              {ra.strategicValue&&<span style={{fontSize:FS.xs,color:swatch.inkMag2,background:swatch['#F0EAD8'],border:'1px solid #d0c090',borderRadius:4,padding:'2px 8px'}}>{ra.strategicValue.split(' - ')[0]}</span>}
            </div>
          </div>
          {sp.guardEffectivenessDesc&&<div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Guard Assessment</div>
            <p style={{fontSize: FS['12.5'],color:swatch.inkMag2,lineHeight:1.6,margin:0}}>{sp.guardEffectivenessDesc}</p>
          </div>}
        </div>
      </div>

      {/* ── ACTIVE MILITARY STATUS (stress override) ─────────────────────── */}
      {stressStatus&&<div style={{background:`${stressStatus.colour}0e`,border:`2px solid ${stressStatus.colour}`,borderRadius:8,padding:'12px 16px',marginBottom:14,display:'flex',gap:12,alignItems:'flex-start'}}>
        <div style={{flexShrink:0,textAlign:'center',minWidth:80}}>
          <div style={{fontSize:FS.xxs,fontWeight:800,color:stressStatus.colour,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Military Status</div>
          <div style={{fontSize:FS.md,fontWeight:800,color:stressStatus.colour,lineHeight:1.2}}>{stressStatus.posture}</div>
        </div>
        <div style={{flex:1,borderLeft:`1px solid ${stressStatus.colour}40`,paddingLeft:12}}>
          {stressObj?.summary&&<p style={{fontSize: FS['12.5'],color:swatch['#3A2A10'],lineHeight:1.5,margin:'0 0 4px'}}>{stressObj.summary}</p>}
          {stressObj?.viabilityNote&&<p style={{fontSize: FS['11.5'],color:swatch['#5A3A10'],fontStyle:'italic',margin:0,lineHeight:1.4}}>{stressObj.viabilityNote}</p>}
        </div>
      </div>}

      {/* ── THREAT ASSESSMENT ────────────────────────────────────────────── */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2}}>Threat Assessment</div>
        <div style={{fontSize:FS.xxs,color:BODY,marginBottom:8,fontStyle:'italic'}}>Bars show the settlement&apos;s defense readiness against each threat. Higher is better.</div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {threats.map(({icon,label,color,assess},i)=>{
            const sc = threatScores[label]||0;
            const badge = scoreBadge(sc);
            const badgeColor = scoreColor(sc);
            const isExp = expandedThreat===i;
            return (
              <div key={i} role="button" tabIndex={0} aria-expanded={isExp} aria-controls={`threat-panel-${i}`} style={{border:`1px solid ${isExp?color+'60':'#e0d0b0'}`,borderLeft:`3px solid ${color}`,borderRadius:6,overflow:'hidden',background:isExp?`${color}06`:'#faf8f4',cursor:'pointer'}}
                onClick={()=>setExpandedThreat(isExp?null:i)}
                onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setExpandedThreat(isExp?null:i);}}}>
                {/* On mobile the row wraps and the label flexes instead of holding
                    a fixed 130px slot, so the icon + label + 72px gauge + badge no
                    longer overrun a 375px viewport. Desktop keeps the fixed-width
                    single-line layout byte-for-byte. */}
                <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',...(mobile?{flexWrap:'wrap'}:null)}}>
                  <span style={{fontSize: FS['14'],flexShrink:0,lineHeight:1}}>{icon}</span>
                  <span style={mobile
                    ? {fontSize:FS.sm,fontWeight:700,color:swatch.inkMag,flex:'1 1 auto',minWidth:0,lineHeight:1.3}
                    : {fontSize:FS.sm,fontWeight:700,color:swatch.inkMag,width:130,flexShrink:0,lineHeight:1.3}}>{label}</span>
                  <div style={{width:72,height:6,background:swatch['#E8DCC8'],borderRadius:3,overflow:'hidden',flexShrink:0}}>
                    <div style={{height:'100%',width:`${sc}%`,background:color,borderRadius:3}}/>
                  </div>
                  <span style={{fontSize:FS.micro,fontWeight:800,color:badgeColor,background:`${badgeColor}15`,borderRadius:3,padding:'1px 4px',letterSpacing:'0.03em',flexShrink:0,width:54,textAlign:'center',display:'inline-block'}}>{badge}</span>
                  <span style={{fontSize:FS.xxs,color:MUTED,flexShrink:0}}>{isExp?'▲':'▼'}</span>
                </div>
                {isExp&&<div id={`threat-panel-${i}`} style={{padding:'0 12px 10px 12px',borderTop:`1px solid ${color}25`}}>
                  <p style={{fontSize: FS['12.5'],color:swatch.inkMag2,lineHeight:1.6,margin:'8px 0 0'}}>{assess}</p>
                  {fundingNotes[label]&&<p style={{fontSize:FS.xxs,color:BODY,fontStyle:'italic',margin:'5px 0 0',lineHeight:1.4}}>{fundingNotes[label]}</p>}
                </div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CRIMINAL ARCHITECTURE & PUBLIC ORDER ─────────────────────────── */}
      <Section title="Criminal Architecture & Public Order" collapsible
        defaultOpen={isDangerous||isUnsafe||isControlled||crimStructure==='organized'}>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>

          {/* Public order status banner — language aligned with internal security score */}
          {(()=>{
            const intScore   = scores.internal || 0;
            const orderStatus = intScore>=65 ? 'Strong Public Order'
                              : intScore>=40 ? 'Adequate Public Order'
                              : intScore>=20 ? 'Weak Public Order'
                              : 'Critical: Order Failing';
            const orderBadge  = intScore>=65?'Strong':intScore>=40?'Adequate':intScore>=20?'Weak':'Critical';
            return (
              <div style={{background:orderBg,border:`1px solid ${orderColor}30`,borderLeft:`4px solid ${orderColor}`,borderRadius:6,padding:'10px 14px'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:14,flexWrap:'wrap'}}>
                  <div style={{flexShrink:0,minWidth:130}}>
                    <div style={{fontSize:FS.micro,fontWeight:700,color:orderColor,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Internal Security</div>
                    <div style={{fontSize:FS.lg,fontWeight:800,color:orderColor,lineHeight:1.15,marginBottom:4}}>{orderStatus}</div>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <span style={{fontSize:FS.micro,fontWeight:800,color:orderColor,background:`${orderColor}15`,border:`1px solid ${orderColor}40`,borderRadius:3,padding:'1px 5px',letterSpacing:'0.04em'}}>{orderBadge}</span>
                      {ratio!==null&&<span style={{fontSize:FS.xxs,color:swatch.inkMag3}}>
                        ratio{' '}<span style={{fontWeight:700,color:orderColor}}>{ratio.toFixed(2)}×</span>
                      </span>}
                    </div>
                    {safetyLabel&&!safetyLabel.includes('Moderate')&&<div style={{fontSize:FS.xxs,color:BODY,marginTop:5,fontStyle:'italic'}}>{safetyLabel}</div>}
                  </div>
                  {sp.safetyDesc&&<div style={{flex:1,minWidth:160}}>
                    <p style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.55,margin:0}}>{sp.safetyDesc}</p>
                  </div>}
                </div>
              </div>
            );
          })()}

          {/* Criminal structure classification */}
          {csd&&<div style={{background:csd.bg,border:`1px solid ${csd.color}30`,borderLeft:`3px solid ${csd.color}`,borderRadius:6,padding:'9px 13px'}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:csd.color,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>Criminal Structure{csd.label}</div>
            <p style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.5,margin:0}}>{csd.note}</p>
          </div>}

          {!crimStructure&&<div style={{background:swatch['#F0FAF4'],border:'1px solid #a8d8b0',borderLeft:'3px solid #2d7a44',borderRadius:6,padding:'8px 13px',fontSize:FS.sm,color:swatch.success}}>
            No organized criminal infrastructure detected. Crime exists at a petty, individual level.
          </div>}

          {/* Criminal institutions as power structures */}
          {crimInsts.length>0&&<div>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Active Criminal Operations</div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {crimInsts.map((name,i)=>{
                const note = criminalOpNote(name);
                return (
                  <div key={i} style={{background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderLeft:'3px solid #8b1a1a',borderRadius:5,padding:'8px 12px'}}>
                    <div style={{fontSize:FS.sm,fontWeight:700,color:swatch.danger,marginBottom:3}}>{name}</div>
                    <div style={{fontSize: FS['11.5'],color:swatch['#5A3A2A'],lineHeight:1.4}}>{note}</div>
                  </div>
                );
              })}
            </div>
          </div>}

          {/* Criminal faction power dynamics + capture state note */}
          {crimFaction&&<div style={{background:swatch.dangerBg,border:'1px solid #e8b0b0',borderLeft:'3px solid #8b1a1a',borderRadius:6,padding:'9px 13px'}}>
            {/* Criminal faction -> in-dossier cross-link to its Power card. The
                faction's current name is rendered as the link (resolved by the
                canonical factionIdFromName id == the index key), so it follows a
                rename; degrades to plain text when the faction is absent from
                the index or the Power tab is gated. */}
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.danger,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>
              <EntityLink id={factionIdFromName(crimFaction.faction)} type="faction" fallback={crimFaction.faction||'Criminal Faction'} />: Power {crimFaction.power||0}
            </div>
            <div style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.5}}>{crimFaction.desc}</div>
            {(crimCapture === 'corrupted' || crimCapture === 'capture') && (
              <div style={{fontSize: FS['11.5'],color:swatch['#4A1A4A'],fontStyle:'italic',marginTop:6,paddingTop:6,borderTop:'1px solid #e8b0b0',lineHeight:1.4}}>
                {crimCapture === 'capture'
                  ? 'Criminal organisation effectively governs through compromised institutions. The distinction between official authority and criminal network has collapsed.'
                  : 'Key enforcement officials have arrangements with criminal networks. Selective enforcement. Profitable crimes go unpunished, rivals are selectively prosecuted.'}
              </div>
            )}
          </div>}

          {/* Crime types — as enforcement challenges, not economic statistics */}
          {crimeTypes.length>0&&<div>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Active Crime Patterns</div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {crimeTypes.map((ct,i)=>(
                <div key={i} style={{background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderRadius:5,padding:'7px 10px'}}>
                  <div style={{fontSize:FS.xs,fontWeight:700,color:swatch.inkMag2,marginBottom:2}}>{ct.type}</div>
                  <div style={{fontSize: FS['11.5'],color:swatch.inkMag3,lineHeight:1.4}}>{truncateAtWord(ct.desc, 200)}</div>
                </div>
              ))}
            </div>
          </div>}

          {/* Safety-derived plot hooks */}
          {sp.plotHooks?.length>0&&<div>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.magic,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Order & Crime Plot Hooks</div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {sp.plotHooks.map((h,i)=>(
                <div key={i} style={{background:swatch['#F8F0FC'],border:'1px solid #d0a8e0',borderLeft:'3px solid #7a3a9a',borderRadius:5,padding:'8px 12px',fontSize:FS.sm,color:swatch['#3A1A5A'],lineHeight:1.5}}>{h}</div>
              ))}
            </div>
          </div>}

        </div>
      </Section>

      {/* ── ARMED FORCES & FORTIFICATIONS ───────────────────────────────── */}
      <div style={{marginBottom:14}}>
        <Button variant="ghost" fullWidth aria-expanded={showForces} onClick={()=>setShowForces(v=>!v)} style={{justifyContent:'space-between',padding:'8px 0',borderColor:'transparent',borderBottom:'1px solid #e0d0b0',borderRadius:0,marginBottom:showForces?10:0,WebkitTapHighlightColor:'transparent'}}>
          <span style={{...serif,fontSize: FS['16'],fontWeight:600,color:swatch.inkMag}}>
            Armed Forces & Fortifications
            <span style={{fontSize:FS.sm,fontWeight:400,color:MUTED,marginLeft:8}}>
              {walls.length>0&&`${walls.length} wall${walls.length>1?'s':''}  `}
              {mainForces.length>0&&`${mainForces.length} force${mainForces.length>1?'s':''}  `}
              {mercForces.length>0&&`${mercForces.length} mercenary  `}
              {charterForces.length>0&&`${charterForces.length} charter  `}
              {magicDef.length>0&&`${magicDef.length} arcane`}
            </span>
          </span>
          <span style={{fontSize:FS.xs,color:MUTED}}>{showForces?'▲':'▼'}</span>
        </Button>

        {showForces&&<div>
          {walls.length>0&&<div style={{marginBottom:10}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch['#4A3A1A'],textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Fortifications</div>
            {walls.map((w,i)=><ForceCard key={i} inst={w} accent="#4a3a1a"/>)}
          </div>}
          {!hasAnyFort&&<div style={{background:swatch['#FDF8F0'],border:'1px solid #e8d0b0',borderLeft:'3px solid #8a5010',borderRadius:6,padding:'10px 13px',marginBottom:10,fontSize:FS.md,color:swatch.inkMag3}}>
            <strong style={{color:swatch['#8A5010']}}>Unfortified.</strong> No perimeter walls. Defenders cannot control entry points or create chokepoints.
          </div>}
          {mainForces.length>0&&<div style={{marginBottom:10}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.danger,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Standing Forces</div>
            {[...new Map(mainForces.map(m=>[m.name,m])).values()].map((w,i)=><ForceCard key={i} inst={w} accent="#8b1a1a"/>)}
          </div>}
          {mercForces.length>0&&<div style={{marginBottom:10}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch['#5A3A1A'],textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Contracted Forces</div>
            {mercForces.map((w,i)=><ForceCard key={i} inst={w} accent="#5a3a1a"/>)}
          </div>}
          {charterForces.length>0&&<div style={{marginBottom:10}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch['#3A1A7A'],textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Monster Response (Charter)</div>
            {charterForces.map((w,i)=><ForceCard key={i} inst={w} accent="#3a1a7a"/>)}
          </div>}
          {magicDef.length>0&&<div style={{marginBottom:6}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.magic,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Arcane Defense</div>
            {magicDef.map((w,i)=><ForceCard key={i} inst={w} accent="#5a2a8a"/>)}
          </div>}
          {!hasAnyForce&&<div style={{background:swatch['#FDF8F0'],border:'1px solid #e8d0b0',borderLeft:'3px solid #8a5010',borderRadius:6,padding:'10px 13px',fontSize:FS.md,color:swatch.inkMag3}}>
            <strong style={{color:swatch['#8A5010']}}>No organized force.</strong> Defense relies on individual armed citizens. No command structure, no training, no coordinated response.
          </div>}
        </div>}
      </div>

      {/* ── SUPPORTING CAPABILITIES ──────────────────────────────────────── */}
      <Section title="Supporting Capabilities" collapsible defaultOpen={false}>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {caps.map((cap,i)=>(
            <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderLeft:`3px solid ${cap.color}`,borderRadius:6,padding:'8px 12px'}}>
              <span style={{fontSize: FS['14'],flexShrink:0,marginTop:1}}>{cap.icon}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:2}}>
                  <span style={{fontSize:FS.xs,fontWeight:700,color:swatch.inkMag2}}>{cap.label}</span>
                  <span style={{fontSize:FS.xs,fontWeight:700,color:cap.color}}>{cap.status}</span>
                  {cap.score!==null&&<div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
                    <div style={{width:50,height:5,background:swatch['#E8DCC8'],borderRadius:3,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${Math.min(100,cap.score)}%`,background:cap.color,borderRadius:3}}/>
                    </div>
                    <span style={{fontSize:FS.xxs,color:cap.color,fontWeight:700}}>{Math.round(cap.score)}</span>
                  </div>}
                </div>
                <div style={{fontSize: FS['11.5'],color:swatch.inkMag3,lineHeight:1.4}}>{cap.note}</div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── VULNERABILITIES ───────────────────────────────────────────────── */}
      {defViolations.length>0
        ?<Section title={` Vulnerabilities (${defViolations.length})`} collapsible defaultOpen accent="#8b1a1a">
          {defViolations.map((v,i)=>{
            const crit=v.severity==='error'||v.severity==='critical';
            return <div key={i} style={{background:crit?'#fdf4f4':'#faf6ec',border:`1px solid ${crit?'#e8c0c0':'#e0c860'}`,borderLeft:`3px solid ${crit?'#8b1a1a':'#b8860b'}`,borderRadius:6,padding:'9px 13px',marginBottom:6}}>
              <div style={{fontSize:FS.xs,fontWeight:700,color:crit?'#8b1a1a':'#7a5010',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>{crit?' Structural':' Warning'}</div>
              <div style={{fontSize:FS.md,color:crit?'#5a1a1a':'#4a3010',lineHeight:1.45}}>{v.reason}</div>
            </div>;
          })}
        </Section>
        :<div style={{background:swatch.successBg,border:'1px solid #a8d8b0',borderLeft:'3px solid #2d7a44',borderRadius:6,padding:'9px 13px',fontSize:FS.md,color:swatch.success}}>
          ✓ No critical defense vulnerabilities identified.
        </div>
      }

      {/* UX overhaul Phase 2 — bridge the frozen defenseProfile.scores to the
          live defense_readiness band + contributors, and reframe militaryStress
          into a war-front readout (coalition/garrison-thinning) when at war. */}
      <DefenseWarFrontSection settlement={r} warStatus={liveWarStatus} nameFor={nameFor} />

    </div>
  );
}

export default React.memo(DefenseTab);
