import React, { useState } from 'react';
import {C} from '../design';
import {serif, Section} from '../Primitives';

import {isMobile} from '../tabConstants';

import {buildThreatAssessment} from '../../../generators/defenseGenerator';
import {NarrativeNote} from '../NarrativeNote';

export function DefenseTab({ settlement:r, narrativeNote}) {
  const [expandedThreat, setExpandedThreat] = useState(null);
  const [showForces, setShowForces] = useState(true);
  const mobile = isMobile();
  if (!r) return null;

  const d = r.defenseProfile || {};
  const scores = d.scores || {};
  const readiness = d.readiness || {label:'Unknown',color:'#9c8068',background:'#faf8f4',border:'#e0d0b0'};
  const inst = d.institutions || {};
  const f = r.economicState?.compound?.inst || {};
  const tradeAccess = r.config?.tradeRouteAccess || 'road';
  const sp = r.economicState?.safetyProfile || {};
  const ra = r.resourceAnalysis || {};
  const stresses = (Array.isArray(r.stress)?r.stress:r.stress?[r.stress]:[]).filter(Boolean);
  const stressTypes = stresses.map(s=>s?.type).filter(Boolean);
  const crimCapture = r.powerStructure?.criminalCaptureState || 'none';

  // Score color helper
  const scoreColor = n => n>=65?'#1a5a28':n>=40?'#a0762a':n>=20?'#8a4010':'#8b1a1a';
  const scoreBadge = n => n>=65?'STRONG':n>=40?'ADEQUATE':n>=20?'WEAK':'CRITICAL';

  // Threat assessment with expandable rows
  const threats = buildThreatAssessment(r);
  const threatScores = {
    'Beasts & Monsters': scores.monster||0,
    'Invasion & War': scores.military||0,
    'Internal Security': scores.internal||0,
    'Economic Survival': scores.economic||0,
    'Disasters & Famine': r.economicState?.foodSecurity?.resilienceScore ?? Math.round(((scores.economic||0)*0.4+(f.hasGranary?60:20)+(f.hasHospital?70:f.hasChurch?40:10))/2),
  };

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
  const bmc         = sp.blackMarketCapture || 0;

  // Classify criminal structure: organized / semi-organized / diffuse / none
  const allInstNames = (r.institutions||[]).map(i=>(i.name||'').toLowerCase());
  const hasGuild     = allInstNames.some(n=>n.includes("thieves' guild")||n.includes('thieves guild'));
  const hasSyndicate = allInstNames.some(n=>n.includes('multiple criminal')||n.includes('underground city')||n.includes('front business'));
  const hasSemiOrg   = allInstNames.some(n=>n.includes('smuggling')||n.includes('black market')||n.includes('gambling'));
  const hasDiffuse   = allInstNames.some(n=>n.includes('fence')||n.includes('bandit')||n.includes('outlaw'));
  const crimStructure = hasGuild||hasSyndicate ? 'organized'
                      : hasSemiOrg             ? 'semi-organized'
                      : hasDiffuse             ? 'diffuse'
                      : null;

  const crimStructureData = {
    organized:      { label:'Organized Syndicate', color:'#8b1a1a', bg:'#fdf4f4',
      note:'A structured criminal hierarchy controls what crime is permitted. Predictable rules, a hierarchy to negotiate with — or cross. Random violence is suppressed because it draws enforcement. The real danger is systematic: protection, extortion, corruption of officials.' },
    'semi-organized':{ label:'Semi-Organized Networks', color:'#8a3010', bg:'#fdf0e8',
      note:'Criminal activity is coordinated enough to maintain routes and territories but lacks a single controlling authority. Multiple factions may be competing. Less predictable than a guild, more structured than street crime.' },
    diffuse:        { label:'Diffuse Criminal Presence', color:'#7a5010', bg:'#faf8e0',
      note:'Opportunistic crime without organizational infrastructure. Fences, bandits, and minor operators work independently. Less politically dangerous but harder to suppress — no single node to threaten or buy off.' },
  };
  const csd = crimStructure ? crimStructureData[crimStructure] : null;

  // Safety severity for UI theming
  const isDangerous  = safetyLabel.includes('Dangerous')||safetyLabel.includes('Desperate');
  const isUnsafe     = safetyLabel.includes('Unsafe')||safetyLabel.includes('Tense')||safetyLabel.includes('Volatile');
  const isControlled = safetyLabel.includes('Controlled')||safetyLabel.includes('Suspicious');
  const isModerate   = safetyLabel.includes('Moderate')||safetyLabel.includes('Safe');
  const orderColor = isDangerous?'#8b1a1a':isUnsafe?'#8a4010':isControlled?'#5a2a6b':isModerate?'#1a5a28':'#a0762a';
  const orderBg    = isDangerous?'#fdf4f4':isUnsafe?'#fdf0e8':isControlled?'#f8f0fc':isModerate?'#f0faf4':'#faf8ec';

  // Stress military status
  const STRESS_STATUS = {
    under_siege:          {posture:'ACTIVE SIEGE',          colour:'#8b1a1a', icon:'️'},
    famine:               {posture:'INTERNAL PRESSURE',     colour:'#8b5a1a', icon:'️'},
    occupied:             {posture:'UNDER OCCUPATION',      colour:'#4a3a6b', icon:''},
    politically_fractured:{posture:'COMMAND SPLIT',         colour:'#5a4a1a', icon:''},
    recently_betrayed:    {posture:'SECURITY COMPROMISED',  colour:'#6b1a2a', icon:'️'},
    plague_onset:         {posture:'QUARANTINE ACTIVE',     colour:'#2a5a2a', icon:''},
  };
  const activeStress = stressTypes.find(t=>STRESS_STATUS[t]);
  const stressStatus = activeStress ? STRESS_STATUS[activeStress] : null;
  const stressObj    = stresses.find(s=>s?.type===activeStress);

  // Supporting capabilities
  const econScore = Math.round(scores.economic||0);
  const caps = [
    {
      icon:'', label:'Economic Backing',
      status: econScore>=65?'Well-funded':econScore>=40?'Adequate':econScore>=25?'Underfunded':'Critical',
      color: scoreColor(econScore), score: econScore,
      note: econScore>=65?'Full pay, maintained equipment, reserve capacity.':econScore>=40?'Adequate upkeep, some shortfalls.':econScore>=25?'Irregular pay, worn equipment, morale risk.':'Cannot sustain forces. Systemic breakdown.',
    },
    {
      icon:'', label:'Magical Capability',
      status: f.hasMagicInst?'Arcane support':'None',
      color: f.hasMagicInst?'#5a2a8a':'#9c8068', score: scores.magical||0,
      note: f.hasMagicInst?`${magicDef.slice(0,2).map(m=>m.name).join(', ')} — detection, wards, counterspell.`:'Conventional defense only. Invisible threats go undetected and unanswered.',
    },
    {
      icon:'', label:'Legal Infrastructure',
      status: f.hasCourtSystem&&f.hasPrison?'Court + Prison':f.hasCourtSystem?'Court only':f.hasPrison?'Prison only':'None',
      color: f.hasCourtSystem&&f.hasPrison?'#1a3a5a':f.hasCourtSystem?'#3a5a7a':f.hasPrison?'#7a5a3a':'#9c8068', score:null,
      note: f.hasCourtSystem&&f.hasPrison?'Full enforcement chain — arrest, prosecute, detain.':f.hasCourtSystem?'Courts without detention — fines and exile only.':f.hasPrison?'Detention without process — arbitrary enforcement.':'No deterrence beyond force.',
    },
    {
      icon:'', label:'Medical Readiness',
      status: f.hasHospital?'Hospital present':f.hasChurch?'Clergy care':'None',
      color: f.hasHospital?'#1a5a28':f.hasChurch?'#7a5010':'#8b1a1a', score:null,
      note: f.hasHospital?'Casualty treatment, outbreak containment, recovery capacity.':f.hasChurch?'Parish care — basic wound and disease management.':'No dedicated healers. Plague burns unchecked.',
    },
    {
      icon:'', label:'Logistics & Supply',
      status: f.hasGranary?'Granary present':'No reserves',
      color: f.hasGranary?'#1a5a28':'#8b1a1a', score:null,
      note: f.hasGranary?(f.hasPort?'Granary + sea access — historically the hardest siege posture to break.':tradeAccess==='isolated'?'Granary in isolation — endurance depends entirely on stored reserves.':'Granary with road supply. Cut the roads, cut the supply.'):(tradeAccess==='port'?'No reserves, but sea supply continues while port is open.':'No food buffer. Any supply disruption becomes a survival crisis within days.'),
    },
  ];
  if (f.hasNavy||f.hasPort) {
    caps.push({icon:'',label:'Naval Defense',status:f.hasNavy?'Naval force':'Port only',color:f.hasNavy?'#1a3a6a':'#3a5a7a',score:null,note:f.hasNavy?'Naval force controls sea approaches. Amphibious assault requires fleet superiority.':'Port facility but no naval force — sea approaches are accessible to any vessel.'});
  }

  // Defense violations
  const defViolations = (r.structuralViolations||[]).filter(v=>
    /fort|milit|wall|garrison|defense|guard|structural|survival/i.test(v.reason||'')
  );

  // Force card component
  const ForceCard = ({inst:i,accent}) => (
    <div style={{background:'#faf8f4',border:'1px solid #e0d0b0',borderLeft:`3px solid ${accent||'#6b5340'}`,borderRadius:6,padding:'9px 12px',marginBottom:6}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
        <div style={{flex:1}}>
          <div style={{fontSize:13,fontWeight:700,color:'#1c1409',marginBottom:i.desc?2:0}}>{i.name}</div>
          {i.desc&&<div style={{fontSize:11.5,color:'#6b5340',lineHeight:1.4}}>{i.desc}</div>}
        </div>
        {i.source&&i.source!=='generated'&&<span style={{fontSize:9,fontWeight:700,color:'#a0762a',background:'#f0e4c0',borderRadius:3,padding:'1px 5px',letterSpacing:'0.04em',flexShrink:0}}>{i.source==='required'?'REQ':'FORCED'}</span>}
      </div>
    </div>
  );

  return (
    <div style={{paddingBottom:16}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── DEFENSE OVERVIEW HEADER ──────────────────────────────────────── */}
      <div style={{background:readiness.background,border:`1px solid ${readiness.border}`,borderLeft:`4px solid ${readiness.color}`,borderRadius:8,padding:'14px 18px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
          <div style={{flexShrink:0}}>
            <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>Defensive Posture</div>
            <div style={{fontSize:24,fontWeight:700,color:readiness.color,lineHeight:1.1,marginBottom:6}}>{readiness.label}</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {ra.terrain&&<span style={{fontSize:11,color:'#1a4a2a',background:'#e8f0e8',border:'1px solid #a8d0a8',borderRadius:4,padding:'2px 8px',fontWeight:600}}>{ra.terrain}</span>}
              {ra.strategicValue&&<span style={{fontSize:11,color:'#3d2b1a',background:'#f0ead8',border:'1px solid #d0c090',borderRadius:4,padding:'2px 8px'}}>{ra.strategicValue.split(' - ')[0]}</span>}
            </div>
          </div>
          {sp.guardEffectivenessDesc&&<div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Guard Assessment</div>
            <p style={{fontSize:12.5,color:'#3d2b1a',lineHeight:1.6,margin:0}}>{sp.guardEffectivenessDesc}</p>
          </div>}
        </div>
      </div>

      {/* ── ACTIVE MILITARY STATUS (stress override) ─────────────────────── */}
      {stressStatus&&<div style={{background:`${stressStatus.colour}0e`,border:`2px solid ${stressStatus.colour}`,borderRadius:8,padding:'12px 16px',marginBottom:14,display:'flex',gap:12,alignItems:'flex-start'}}>
        <div style={{flexShrink:0,textAlign:'center',minWidth:80}}>
          <div style={{fontSize:10,fontWeight:800,color:stressStatus.colour,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Military Status</div>
          <div style={{fontSize:13,fontWeight:800,color:stressStatus.colour,lineHeight:1.2}}>{stressStatus.posture}</div>
        </div>
        <div style={{flex:1,borderLeft:`1px solid ${stressStatus.colour}40`,paddingLeft:12}}>
          {stressObj?.summary&&<p style={{fontSize:12.5,color:'#3a2a10',lineHeight:1.5,margin:'0 0 4px'}}>{stressObj.summary}</p>}
          {stressObj?.viabilityNote&&<p style={{fontSize:11.5,color:'#5a3a10',fontStyle:'italic',margin:0,lineHeight:1.4}}>{stressObj.viabilityNote}</p>}
        </div>
      </div>}

      {/* ── THREAT ASSESSMENT ────────────────────────────────────────────── */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Threat Assessment</div>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {threats.map(({icon,label,color,assess},i)=>{
            const sc = threatScores[label]||0;
            const badge = scoreBadge(sc);
            const badgeColor = scoreColor(sc);
            const isExp = expandedThreat===i;
            return (
              <div key={i} style={{border:`1px solid ${isExp?color+'60':'#e0d0b0'}`,borderLeft:`3px solid ${color}`,borderRadius:6,overflow:'hidden',background:isExp?`${color}06`:'#faf8f4',cursor:'pointer'}}
                onClick={()=>setExpandedThreat(isExp?null:i)}>
                <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px'}}>
                  <span style={{fontSize:14,flexShrink:0,lineHeight:1}}>{icon}</span>
                  <span style={{fontSize:12,fontWeight:700,color:'#1c1409',width:130,flexShrink:0,lineHeight:1.3}}>{label}</span>
                  <div style={{width:72,height:6,background:'#e8dcc8',borderRadius:3,overflow:'hidden',flexShrink:0}}>
                    <div style={{height:'100%',width:`${sc}%`,background:color,borderRadius:3}}/>
                  </div>
                  <span style={{fontSize:9,fontWeight:800,color:badgeColor,background:`${badgeColor}15`,borderRadius:3,padding:'1px 4px',letterSpacing:'0.03em',flexShrink:0,width:54,textAlign:'center',display:'inline-block'}}>{badge}</span>
                  <span style={{fontSize:10,color:'#9c8068',flexShrink:0}}>{isExp?'▲':'▼'}</span>
                </div>
                {isExp&&<div style={{padding:'0 12px 10px 12px',borderTop:`1px solid ${color}25`}}>
                  <p style={{fontSize:12.5,color:'#3d2b1a',lineHeight:1.6,margin:'8px 0 0'}}>{assess}</p>
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
                              : 'Critical — Order Failing';
            const orderBadge  = intScore>=65?'STRONG':intScore>=40?'ADEQUATE':intScore>=20?'WEAK':'CRITICAL';
            return (
              <div style={{background:orderBg,border:`1px solid ${orderColor}30`,borderLeft:`4px solid ${orderColor}`,borderRadius:6,padding:'10px 14px'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:14,flexWrap:'wrap'}}>
                  <div style={{flexShrink:0,minWidth:130}}>
                    <div style={{fontSize:9,fontWeight:700,color:orderColor,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Internal Security</div>
                    <div style={{fontSize:15,fontWeight:800,color:orderColor,lineHeight:1.15,marginBottom:4}}>{orderStatus}</div>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <span style={{fontSize:9,fontWeight:800,color:orderColor,background:`${orderColor}15`,border:`1px solid ${orderColor}40`,borderRadius:3,padding:'1px 5px',letterSpacing:'0.04em'}}>{orderBadge}</span>
                      {ratio!==null&&<span style={{fontSize:10,color:'#6b5340'}}>
                        ratio{' '}<span style={{fontWeight:700,color:orderColor}}>{ratio.toFixed(2)}×</span>
                      </span>}
                    </div>
                    {safetyLabel&&!safetyLabel.includes('Moderate')&&<div style={{fontSize:10,color:'#9c8068',marginTop:5,fontStyle:'italic'}}>{safetyLabel}</div>}
                  </div>
                  {sp.safetyDesc&&<div style={{flex:1,minWidth:160}}>
                    <p style={{fontSize:12,color:'#3d2b1a',lineHeight:1.55,margin:0}}>{sp.safetyDesc}</p>
                  </div>}
                </div>
              </div>
            );
          })()}

          {/* Criminal structure classification */}
          {csd&&<div style={{background:csd.bg,border:`1px solid ${csd.color}30`,borderLeft:`3px solid ${csd.color}`,borderRadius:6,padding:'9px 13px'}}>
            <div style={{fontSize:10,fontWeight:700,color:csd.color,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>Criminal Structure — {csd.label}</div>
            <p style={{fontSize:12,color:'#3d2b1a',lineHeight:1.5,margin:0}}>{csd.note}</p>
          </div>}

          {!crimStructure&&<div style={{background:'#f0faf4',border:'1px solid #a8d8b0',borderLeft:'3px solid #2d7a44',borderRadius:6,padding:'8px 13px',fontSize:12,color:'#1a5a28'}}>
            No organized criminal infrastructure detected. Crime exists at a petty, individual level.
          </div>}

          {/* Criminal institutions as power structures */}
          {crimInsts.length>0&&<div>
            <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Active Criminal Operations</div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {crimInsts.map((name,i)=>{
                // Derive context note by institution type
                const n = name.toLowerCase();
                const note = n.includes("thieves' guild")||n.includes('thieves guild')
                  ? 'Controls the criminal hierarchy. Suppresses random crime in exchange for predictable extraction. Deeply embedded in civic life.'
                  : n.includes('black market')
                  ? 'Operates a parallel marketplace for contraband, stolen goods, and unlicensed services. Competes directly with legitimate merchants.'
                  : n.includes('smuggling')
                  ? 'Moves goods around customs and guild charters. Corrupt officials, unofficial landing points, and false manifests.'
                  : n.includes('front business')
                  ? 'Legitimate-looking operations used to launder criminal revenue and provide cover for illegal activities.'
                  : n.includes('gang')||n.includes('street')
                  ? 'Controls specific territory through violence. Extorts local businesses. Competes with the watch for street-level authority.'
                  : n.includes('gambling')
                  ? 'Operates unlicensed gambling. Revenue funds broader criminal network. Attracts debt spirals and desperation crime.'
                  : n.includes('underground')
                  ? 'An entire secondary economy operating below street level. Beyond enforcement reach without extraordinary effort.'
                  : n.includes('assassin')
                  ? 'Professional killing for hire. The existence of this market reflects deeply embedded political violence.'
                  : n.includes('fence')
                  ? 'Moves stolen goods into legitimate circulation. The fence is the clearinghouse that makes theft economically viable.'
                  : 'Criminal infrastructure with local territorial or economic influence.';
                return (
                  <div key={i} style={{background:'#faf8f4',border:'1px solid #e0d0b0',borderLeft:'3px solid #8b1a1a',borderRadius:5,padding:'8px 12px'}}>
                    <div style={{fontSize:12,fontWeight:700,color:'#8b1a1a',marginBottom:3}}>{name}</div>
                    <div style={{fontSize:11.5,color:'#5a3a2a',lineHeight:1.4}}>{note}</div>
                  </div>
                );
              })}
            </div>
          </div>}

          {/* Criminal faction power dynamics + capture state note */}
          {crimFaction&&<div style={{background:'#fdf4f4',border:'1px solid #e8b0b0',borderLeft:'3px solid #8b1a1a',borderRadius:6,padding:'9px 13px'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#8b1a1a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>
              Criminal Faction — Power {crimFaction.power||0}
            </div>
            <div style={{fontSize:12,color:'#3d2b1a',lineHeight:1.5}}>{crimFaction.desc}</div>
            {(crimCapture === 'corrupted' || crimCapture === 'capture') && (
              <div style={{fontSize:11.5,color:'#4a1a4a',fontStyle:'italic',marginTop:6,paddingTop:6,borderTop:'1px solid #e8b0b0',lineHeight:1.4}}>
                {crimCapture === 'capture'
                  ? 'Criminal organisation effectively governs through compromised institutions. The distinction between official authority and criminal network has collapsed.'
                  : 'Key enforcement officials have arrangements with criminal networks. Selective enforcement — profitable crimes go unpunished, rivals are selectively prosecuted.'}
              </div>
            )}
          </div>}

          {/* Crime types — as enforcement challenges, not economic statistics */}
          {crimeTypes.length>0&&<div>
            <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Active Crime Patterns</div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {crimeTypes.map((ct,i)=>(
                <div key={i} style={{background:'#faf8f4',border:'1px solid #e0d0b0',borderRadius:5,padding:'7px 10px'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#3d2b1a',marginBottom:2}}>{ct.type}</div>
                  <div style={{fontSize:11.5,color:'#6b5340',lineHeight:1.4}}>{ct.desc?.slice(0,200)}{ct.desc?.length>200?'…':''}</div>
                </div>
              ))}
            </div>
          </div>}

          {/* Safety-derived plot hooks */}
          {sp.plotHooks?.length>0&&<div>
            <div style={{fontSize:10,fontWeight:700,color:'#5a2a8a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Order & Crime Plot Hooks</div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {sp.plotHooks.map((h,i)=>(
                <div key={i} style={{background:'#f8f0fc',border:'1px solid #d0a8e0',borderLeft:'3px solid #7a3a9a',borderRadius:5,padding:'8px 12px',fontSize:12,color:'#3a1a5a',lineHeight:1.5}}>{h}</div>
              ))}
            </div>
          </div>}

        </div>
      </Section>

      {/* ── ARMED FORCES & FORTIFICATIONS ───────────────────────────────── */}
      <div style={{marginBottom:14}}>
        <button onClick={()=>setShowForces(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 0',background:'none',border:'none',borderBottom:'1px solid #e0d0b0',cursor:'pointer',marginBottom:showForces?10:0,WebkitTapHighlightColor:'transparent'}}>
          <span style={{...serif,fontSize:16,fontWeight:600,color:'#1c1409'}}>
            Armed Forces & Fortifications
            <span style={{fontSize:12,fontWeight:400,color:'#9c8068',marginLeft:8}}>
              {walls.length>0&&`${walls.length} wall${walls.length>1?'s':''}  `}
              {mainForces.length>0&&`${mainForces.length} force${mainForces.length>1?'s':''}  `}
              {mercForces.length>0&&`${mercForces.length} mercenary  `}
              {charterForces.length>0&&`${charterForces.length} charter  `}
              {magicDef.length>0&&`${magicDef.length} arcane`}
            </span>
          </span>
          <span style={{fontSize:11,color:'#9c8068'}}>{showForces?'▲':'▼'}</span>
        </button>

        {showForces&&<div>
          {walls.length>0&&<div style={{marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:'#4a3a1a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Fortifications</div>
            {walls.map((w,i)=><ForceCard key={i} inst={w} accent="#4a3a1a"/>)}
          </div>}
          {!hasAnyFort&&<div style={{background:'#fdf8f0',border:'1px solid #e8d0b0',borderLeft:'3px solid #8a5010',borderRadius:6,padding:'10px 13px',marginBottom:10,fontSize:13,color:'#6b5340'}}>
            <strong style={{color:'#8a5010'}}>Unfortified.</strong> No perimeter walls. Defenders cannot control entry points or create chokepoints.
          </div>}
          {mainForces.length>0&&<div style={{marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:'#8b1a1a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Standing Forces</div>
            {[...new Map(mainForces.map(m=>[m.name,m])).values()].map((w,i)=><ForceCard key={i} inst={w} accent="#8b1a1a"/>)}
          </div>}
          {mercForces.length>0&&<div style={{marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:'#5a3a1a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Contracted Forces</div>
            {mercForces.map((w,i)=><ForceCard key={i} inst={w} accent="#5a3a1a"/>)}
          </div>}
          {charterForces.length>0&&<div style={{marginBottom:10}}>
            <div style={{fontSize:10,fontWeight:700,color:'#3a1a7a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Monster Response (Charter)</div>
            {charterForces.map((w,i)=><ForceCard key={i} inst={w} accent="#3a1a7a"/>)}
          </div>}
          {magicDef.length>0&&<div style={{marginBottom:6}}>
            <div style={{fontSize:10,fontWeight:700,color:'#5a2a8a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Arcane Defense</div>
            {magicDef.map((w,i)=><ForceCard key={i} inst={w} accent="#5a2a8a"/>)}
          </div>}
          {!hasAnyForce&&<div style={{background:'#fdf8f0',border:'1px solid #e8d0b0',borderLeft:'3px solid #8a5010',borderRadius:6,padding:'10px 13px',fontSize:13,color:'#6b5340'}}>
            <strong style={{color:'#8a5010'}}>No organized force.</strong> Defense relies on individual armed citizens. No command structure, no training, no coordinated response.
          </div>}
        </div>}
      </div>

      {/* ── SUPPORTING CAPABILITIES ──────────────────────────────────────── */}
      <Section title="Supporting Capabilities" collapsible defaultOpen={false}>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {caps.map((cap,i)=>(
            <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',background:'#faf8f4',border:'1px solid #e0d0b0',borderLeft:`3px solid ${cap.color}`,borderRadius:6,padding:'8px 12px'}}>
              <span style={{fontSize:14,flexShrink:0,marginTop:1}}>{cap.icon}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:2}}>
                  <span style={{fontSize:11,fontWeight:700,color:'#3d2b1a'}}>{cap.label}</span>
                  <span style={{fontSize:11,fontWeight:700,color:cap.color}}>{cap.status}</span>
                  {cap.score!==null&&<div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
                    <div style={{width:50,height:5,background:'#e8dcc8',borderRadius:3,overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${Math.min(100,cap.score)}%`,background:cap.color,borderRadius:3}}/>
                    </div>
                    <span style={{fontSize:10,color:cap.color,fontWeight:700}}>{Math.round(cap.score)}</span>
                  </div>}
                </div>
                <div style={{fontSize:11.5,color:'#6b5340',lineHeight:1.4}}>{cap.note}</div>
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
              <div style={{fontSize:11,fontWeight:700,color:crit?'#8b1a1a':'#7a5010',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>{crit?' Structural':' Warning'}</div>
              <div style={{fontSize:13,color:crit?'#5a1a1a':'#4a3010',lineHeight:1.45}}>{v.reason}</div>
            </div>;
          })}
        </Section>
        :<div style={{background:'#f0faf2',border:'1px solid #a8d8b0',borderLeft:'3px solid #2d7a44',borderRadius:6,padding:'9px 13px',fontSize:13,color:'#1a5a28'}}>
          ✓ No critical defense vulnerabilities identified.
        </div>
      }

    </div>
  );
}

export default DefenseTab;
