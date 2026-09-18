import React, { useState } from 'react';
import { FS, swatch, MUTED } from '../../theme.js';
import { serif, Section } from '../Primitives';
import Button from '../../primitives/Button.jsx';

import {buildThreatAssessment} from '../../../domain/display/threatAssessment.js';
import {NarrativeNote} from '../NarrativeNote';
import { criminalOpNote, deriveCriminalStructure, deriveDefenseReadiness, deriveSupportingCapabilities, deriveGuardAssessment, deriveDefenseVulnerabilities, DEFENSE_STRESS_STATUS } from '../../../domain/display/defenseDisplay.js';
import { safetySeverityOf } from '../../../domain/display/safetySeverity.js';
import { scoreBand, scoreColor } from '../../../domain/display/defenseScoreBands.js';
import { defenseCriminalProse, defenseForcesProse, defenseMilitaryStatusProse, defensePostureProse, defenseStateProse, defenseSupportingProse, defenseThreatProse, defenseWallRationaleProse } from '../../../domain/display/stateProse/defenseStateProse.js';
import { drawnAtMount } from '../../../domain/display/stateProse/dossierMounts.js';
import { truncateAtWord } from '../../../lib/text.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
// THE ONE PARAGRAPH RENDERER (owner finding 2026-09-18). Every position on this tab used to
// map its drawn sentences to one `<p>` EACH, so a five-lens position printed five paragraphs
// that each opened on the town's name. The DRAW is unchanged: the lines handed over are the
// same strings `drawnAtMount` ruled on.
import ProseBlock from '../ProseBlock.jsx';

/**
 * The public-order position. ⚠ Its rungs arrive already PROJECTED BESIDE the DM's field —
 * the desk returns `{field, beside, hasField}`, never a bare rung — so this file cannot
 * render a machine sentence into the position the DM's own sentence occupies.
 */
const PUBLIC_ORDER_MOUNT = 'defense.publicOrder';

/**
 * The threat-assessment position. FIVE readiness rows of ONE block at ONE position — the
 * C3 law is about rungs per page-set, not draws, so one position may read several pools.
 */
const THREAT_MOUNT = 'defense.threatAssessment';

/**
 * The armed-forces position. FIVE lenses of DS-DEF-5 at ONE position, the same shape as the
 * threat rows above. ⚠ Its readings come from the STANDING roster, not from
 * `defenseProfile.institutions` — the force cards below list what the town BUILT (a ruin is
 * shown, correctly), while these sentences say what the town can field TODAY.
 */
const FORCES_MOUNT = 'defense.armedForces';

/**
 * The defensive-posture header position. THREE lenses of DS-DEF-1 at ONE position. ⚠ Its
 * readiness lens bands `readiness.score` — the SAME number the `readiness.label` badge
 * rendered beside it is computed from — so the badge and the sentence cannot disagree.
 */
const POSTURE_MOUNT = 'defense.postureHeader';

/**
 * The active-military-status position. TWO live lenses of DS-DEF-8 at ONE position; its
 * fourth pool is declared dark in the desk, with the reason and the one act that lights it.
 */
const MILITARY_STATUS_MOUNT = 'defense.militaryStatus';

/**
 * The wall-rationale position: why this town keeps a circuit, or why it does not. ⚠ Its
 * perimeter read is the STANDING roster, so a town whose walls have been thrown down is
 * described by the unwalled pools rather than asked why it keeps a wall it no longer has.
 */
const WALL_RATIONALE_MOUNT = 'defense.wallRationale';

/**
 * The criminal-architecture position. TWO lenses of DS-DEF-4 at ONE position. ⚠ Two of its
 * capture pools are DM-ONLY by the kernel's covertness gate — a player-facing dossier is not
 * told the hall has been bought — so the `audience` this tab passes is load-bearing here in
 * a way it is not for the other mounts.
 */
const CRIMINAL_MOUNT = 'defense.criminalStructure';

/**
 * The supporting-capabilities position. TWO lenses of DS-DEF-6 at ONE position, and the
 * block's other FOUR lenses are declared dark in the desk rather than drawn: each of them
 * states a fact one of the positions above already speaks, in near-verbatim prose. The
 * two that survive — the supply route and the sea approaches — are the only readings on
 * this tab that nothing else here can see.
 */
const SUPPORTING_MOUNT = 'defense.supportingCapabilities';

/**
 * ⭐ THE THREAT ROW → DS-DEF-2 POOL JOIN (owner finding 3, 2026-09-18).
 *
 * The five readiness sentences used to be flattened into one list and printed as a STACK
 * ABOVE the bars, so a reader had to pair a sentence with a bar by counting. Each sentence
 * now renders under the bar it is about, and this is the pairing.
 *
 * ⚠ IT IS A LABEL JOIN, AND IT IS TOTAL ON PURPOSE. `buildThreatAssessment` returns rows
 * carrying `{label, color, assess}` and no machine key, so the alternative was pairing by
 * INDEX — which would put a famine sentence under a monster bar the day that leaf grows a
 * conditional row, silently, because both lists would still be five long. The key set is
 * asserted EQUAL to the builder's own labels in tests/ui/defenseTabFlow.test.js, so neither
 * side can grow a member the other does not have; a label this map does not know draws
 * NOTHING rather than the wrong row's sentence. The sibling `threatScores` object in the
 * body below already keys on the same labels, so this is the file's own idiom.
 */
export const THREAT_ROW_KEY = Object.freeze({
  'Beasts & Monsters': 'beasts',
  'Invasion & War': 'invasion',
  'Internal Security': 'internal',
  'Economic Survival': 'economic',
  'Disasters & Famine': 'disaster',
});

export function DefenseTab({ settlement:r, narrativeNote, publicDossier = false, playerView = false}) {
  const [expandedThreat, setExpandedThreat] = useState(null);
  const [showForces, setShowForces] = useState(true);
  // Mobile: let the threat row wrap and the label flex, so a long threat name
  // ("Siege & Assault") no longer clips against the fixed 130px slot at 375px.
  const isMobile = useIsMobile();
  if (!r) return null;

  const d = r.defenseProfile || {};
  const scores = d.scores || {};
  const readiness = d.readiness || {label:'Unknown',color:'#9c8068',background:'#faf8f4',border:'#e0d0b0'};
  const inst = d.institutions || {};
  const f = r.economicState?.compound?.inst || {};
  const sp = r.economicState?.safetyProfile || {};
  const ra = r.resourceAnalysis || {};
  // THE DEFENSE DESK. THE PUBLIC GATE (§885.3): a public gallery dossier is a PAID surface
  // and the `defense` tab is not filtered off one, so the desk is NOT DRAWN there. The
  // audience follows kernel law 2's fail-closed default, stated rather than defaulted.
  const deskProse = publicDossier
    ? Object.freeze({ publicOrder: null, firstSurvey: null })
    : defenseStateProse(r, {
      seed: String(r?._seed ?? r?.id ?? ''),
      audience: playerView ? 'player' : 'dm',
    });
  // `drawnAtMount` routes the RUNG the projection carries; the `beside` line is only
  // rendered when the registry lets that rung speak, so flipping the row to `glance`
  // silences the machine line and leaves the DM's field untouched.
  const orderBeside = drawnAtMount(PUBLIC_ORDER_MOUNT, deskProse.publicOrder?.rung)?.sentence
    ? deskProse.publicOrder.beside : null;
  const surveyBeside = drawnAtMount(PUBLIC_ORDER_MOUNT, deskProse.firstSurvey?.rung)?.sentence
    ? deskProse.firstSurvey.beside : null;
  // DS-DEF-2, the five readiness rows. Same public gate as the banner above; DS-DEF-2
  // frames no DM-editable field, so these are plain rungs rather than projections.
  const threatProse = publicDossier
    ? Object.freeze({ beasts: null, invasion: null, internal: null, economic: null, disaster: null })
    : defenseThreatProse(r, {
      seed: String(r?._seed ?? r?.id ?? ''),
      audience: playerView ? 'player' : 'dm',
    });
  // The sentence that belongs to ONE readiness row, or null. The registry still rules on
  // every rung exactly as it did when these were a flat list — flipping `defense.threatAssessment`
  // to `glance` silences all five together, under every bar at once.
  const threatSentenceFor = (label) => {
    const key = THREAT_ROW_KEY[label];
    return (key ? drawnAtMount(THREAT_MOUNT, threatProse[key])?.sentence : null) || null;
  };
  // DS-DEF-5, the armed-forces lenses. Same public gate as above, stated rather than
  // defaulted; DS-DEF-5 frames no DM-editable field, so these are plain rungs too.
  const forcesProse = publicDossier
    ? Object.freeze({ fortification: null, force: null, contracted: null, charter: null, arcane: null })
    : defenseForcesProse(r, {
      seed: String(r?._seed ?? r?.id ?? ''),
      audience: playerView ? 'player' : 'dm',
    });
  const forceLines = ['fortification', 'force', 'contracted', 'charter', 'arcane']
    .map((k) => drawnAtMount(FORCES_MOUNT, forcesProse[k])?.sentence).filter(Boolean);
  // DS-DEF-1, the posture header. Same public gate; it frames no DM-editable field either
  // (`guardEffectivenessDesc` is not a DM path), so these are plain rungs that sit BESIDE
  // the Guard Assessment paragraph rather than over it.
  const postureProse = publicDossier
    ? Object.freeze({ posture: null, terrain: null, prize: null })
    : defensePostureProse(r, {
      seed: String(r?._seed ?? r?.id ?? ''),
      audience: playerView ? 'player' : 'dm',
    });
  // ⚠ Like the public-order banner, these arrive already PROJECTED BESIDE the DM's field —
  // `guardEffectivenessDesc`, which `deriveGuardAssessment` returns verbatim just above. The
  // `beside` line is only taken when the registry lets that rung SPEAK, so flipping the row
  // to `glance` silences the machine lines and leaves the DM's paragraph untouched.
  const postureLines = ['posture', 'terrain', 'prize']
    .map((k) => (drawnAtMount(POSTURE_MOUNT, postureProse[k]?.rung)?.sentence
      ? postureProse[k].beside : null)).filter(Boolean);
  // DS-DEF-8, the military-status banner. Same public gate; it frames no DM-editable field
  // (the banner renders generator-authored `summary` / `viabilityNote`), so plain rungs.
  const statusProse = publicDossier
    ? Object.freeze({ override: null, viability: null })
    : defenseMilitaryStatusProse(r, {
      seed: String(r?._seed ?? r?.id ?? ''),
      audience: playerView ? 'player' : 'dm',
    });
  const statusLines = ['override', 'viability']
    .map((k) => drawnAtMount(MILITARY_STATUS_MOUNT, statusProse[k])?.sentence).filter(Boolean);
  // DS-DEF-11, why the wall and why not. Same public gate; no DM-editable field, plain rung.
  const wallProse = publicDossier
    ? Object.freeze({ rationale: null })
    : defenseWallRationaleProse(r, {
      seed: String(r?._seed ?? r?.id ?? ''),
      audience: playerView ? 'player' : 'dm',
    });
  const wallLine = drawnAtMount(WALL_RATIONALE_MOUNT, wallProse.rationale)?.sentence || null;
  // DS-DEF-6, the supporting capabilities. Same public gate as every other mount on this
  // tab; no DM-editable field, so plain rungs. Only the logistics and naval lenses are
  // read — the desk states, and the suite pins, why the other four must stay silent.
  const supportingProse = publicDossier
    ? Object.freeze({ logistics: null, naval: null })
    : defenseSupportingProse(r, {
      seed: String(r?._seed ?? r?.id ?? ''),
      audience: playerView ? 'player' : 'dm',
    });
  const supportingLines = ['logistics', 'naval']
    .map((k) => drawnAtMount(SUPPORTING_MOUNT, supportingProse[k])?.sentence).filter(Boolean);
  const stresses = (Array.isArray(r.stress)?r.stress:r.stress?[r.stress]:[]).filter(Boolean);
  const stressTypes = stresses.map(s=>s?.type).filter(Boolean);
  const crimCapture = r.powerStructure?.criminalCaptureState || 'none';

  // Score colour + band word come from the shared defenseScoreBands ladder
  // (R-5b item #20). The local twins that used to live here are deleted, so
  // OverviewTab, SummaryTab, this tab and the PDF cannot drift apart.

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
  // R-5b item #20: the raw `safetyRatio` float ("ratio 1.23×") that used to sit
  // in the Internal Security banner is RETIRED here, extending the owner's
  // 2026-07-22 retirement of the identical Enforcement Ratio display on
  // OverviewTab to this sibling. The banner already carries the same fact three
  // times in typed form (the orderStatus headline, the orderBadge band word and
  // the safetyLabel beneath), so the digit added a formula and no meaning.
  // safetyRatio stays a live derivation — only this display of it is retired.
  const safetyLabel = sp.safetyLabel || '';
  const _bmc         = sp.blackMarketCapture || 0;

  // Criminal structure classification (shared with the PDF viewModel)
  const csd = deriveCriminalStructure(r);
  const crimStructure = csd?.key || null;
  // DS-DEF-4, the criminal architecture. Same public gate as every other mount on this tab;
  // the desk is handed the SAME structure key the card below renders from, so the sentence
  // and the classification beneath it cannot be about two different readings.
  const criminalProse = publicDossier
    ? Object.freeze({ structure: null, capture: null })
    : defenseCriminalProse(r, crimStructure, {
      seed: String(r?._seed ?? r?.id ?? ''),
      audience: playerView ? 'player' : 'dm',
    });
  const criminalLines = ['structure', 'capture']
    .map((k) => drawnAtMount(CRIMINAL_MOUNT, criminalProse[k])?.sentence).filter(Boolean);

  // Safety severity for UI theming — via the shared safetySeverity chokepoint
  // (M2), TOTAL over the producer's label vocabulary. 'Strained' (the middle
  // stress tier) used to fall to the neutral default here; it now classifies as
  // 'unsafe' like 'Tense'/'Volatile'. orderElevated drives the section auto-open.
  const severity   = safetySeverityOf(safetyLabel);
  const orderColor = severity.color;
  const orderBg    = severity.bg;
  const orderElevated = severity.key === 'dangerous' || severity.key === 'unsafe' || severity.key === 'controlled';

  // Stress military status — the shared DEFENSE_STRESS_STATUS set (pdf-4), so the
  // screen and the PDF defenseSlice raise the SAME active-military-status callouts.
  const STRESS_STATUS = DEFENSE_STRESS_STATUS;
  const activeStress = stressTypes.find(t=>STRESS_STATUS[t]);
  const stressStatus = activeStress ? STRESS_STATUS[activeStress] : null;
  const stressObj    = stresses.find(s=>s?.type===activeStress);

  // Supporting capabilities (shared with the PDF viewModel)
  const caps = deriveSupportingCapabilities(r);
  const guardAssessment = deriveGuardAssessment(r);
  const defViolations = deriveDefenseVulnerabilities(r);

  // Force card component
  const ForceCard = ({inst:i,accent}) => (
    <div style={{background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderLeft:`3px solid ${accent||'#6b5340'}`,padding:'9px 12px',marginBottom:6}}>
      <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
        <div style={{flex:1}}>
          <div style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag,marginBottom:i.desc?2:0}}>{i.name}</div>
          {i.desc&&<div style={{fontSize: FS['11.5'],color:swatch.inkMag3,lineHeight:1.4}}>{i.desc}</div>}
        </div>
        {i.source&&i.source!=='generated'&&<span style={{fontSize:FS.micro,fontWeight:700,color:swatch['#A0762A'],background:swatch['#F0E4C0'],padding:'1px 5px',letterSpacing:'0.04em',flexShrink:0}}>{i.source==='required'?'REQ':'FORCED'}</span>}
      </div>
    </div>
  );

  return (
    <div style={{paddingBottom:16}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── DEFENSE OVERVIEW HEADER ──────────────────────────────────────── */}
      <div style={{background:readiness.background,border:`1px solid ${readiness.border}`,borderLeft:`4px solid ${readiness.color}`,padding:'14px 18px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap'}}>
          <div style={{flexShrink:0}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>Defensive Posture</div>
            <div style={{fontSize:FS.h1,fontWeight:700,color:readiness.color,lineHeight:1.1,marginBottom:6}}>{readiness.label}</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {ra.terrain&&<span style={{fontSize:FS.xs,color:swatch['#1A4A2A'],background:swatch['#E8F0E8'],border:'1px solid #a8d0a8',padding:'2px 8px',fontWeight:600}}>{ra.terrain}</span>}
              {ra.strategicValue&&<span style={{fontSize:FS.xs,color:swatch.inkMag2,background:swatch['#F0EAD8'],border:'1px solid #d0c090',padding:'2px 8px'}}>{ra.strategicValue.split(' - ')[0]}</span>}
            </div>
          </div>
          {guardAssessment&&<div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Guard Assessment</div>
            <p style={{fontSize: FS['12.5'],color:swatch.inkMag2,lineHeight:1.6,margin:0}}>{guardAssessment}</p>
          </div>}
        </div>
        {/* DS-DEF-1: the posture, the ground and the prize, in the town's own voice. Three
            lenses of one block at one position, BESIDE the badge and the DM's assessment. */}
        {postureLines.length>0&&<div style={{marginTop:10,paddingTop:10,borderTop:`1px solid ${readiness.border}`}}>
          <ProseBlock lines={postureLines} settlementName={r.name} tier={r.tier}
            style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.55,margin:0,fontStyle:'italic'}}/>
        </div>}
      </div>

      {/* ── ACTIVE MILITARY STATUS (stress override) ─────────────────────── */}
      {stressStatus&&<div style={{background:`${stressStatus.colour}0e`,border:`2px solid ${stressStatus.colour}`,padding:'12px 16px',marginBottom:14,display:'flex',gap:12,alignItems:'flex-start'}}>
        <div style={{flexShrink:0,textAlign:'center',minWidth:80}}>
          <div style={{fontSize:FS.xxs,fontWeight:800,color:stressStatus.colour,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Military Status</div>
          <div style={{fontSize:FS.md,fontWeight:800,color:stressStatus.colour,lineHeight:1.2}}>{stressStatus.posture}</div>
        </div>
        <div style={{flex:1,borderLeft:`1px solid ${stressStatus.colour}40`,paddingLeft:12}}>
          {stressObj?.summary&&<p style={{fontSize: FS['12.5'],color:swatch['#3A2A10'],lineHeight:1.5,margin:'0 0 4px'}}>{stressObj.summary}</p>}
          {stressObj?.viabilityNote&&<p style={{fontSize: FS['11.5'],color:swatch['#5A3A10'],fontStyle:'italic',margin:0,lineHeight:1.4}}>{stressObj.viabilityNote}</p>}
          {/* DS-DEF-8: what the override means for this town, in its own voice. */}
          <ProseBlock lines={statusLines} settlementName={r.name} tier={r.tier}
            style={{fontSize:FS.xs,color:swatch['#3A2A10'],lineHeight:1.5,margin:'6px 0 0',fontStyle:'italic'}}/>
        </div>
      </div>}

      {/* ── THREAT ASSESSMENT ────────────────────────────────────────────── */}
      <div style={{marginBottom:14}}>
        <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2}}>Threat Assessment</div>
        <div style={{fontSize:FS.xxs,color:MUTED,marginBottom:8,fontStyle:'italic'}}>Bars show the settlement&apos;s defense readiness against each threat, as judged at the first survey; Disasters & Famine is re-judged as the campaign advances. Higher is better.</div>
        {/* ⛔ NO SENTENCE STACK ABOVE THE BARS (owner finding 3, 2026-09-18). DS-DEF-2's five
            readiness sentences used to print here as five paragraphs, one per row, ABOVE the
            rows they describe — so a reader had to pair sentence to bar by counting, and all
            five opened on the town's name. Each one now renders UNDER ITS OWN BAR. The caption
            above stays: it frames the bars, not the sentences. */}
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {threats.map(({label,color,assess},i)=>{
            const sc = threatScores[label]||0;
            const badge = scoreBand(sc);
            const badgeColor = scoreColor(sc);
            const isExp = expandedThreat===i;
            const rowLine = threatSentenceFor(label);
            return (
              // ⚠ THE CARD IS NO LONGER THE BUTTON — the HEADER ROW inside it is. The corpus
              // sentence sits in the card, under the bar, and folding it inside the control
              // would have made the button's accessible name a whole paragraph. The row keeps
              // every handler, its `tabIndex`, its padding and its mobile reflow, so
              // tests/components/dossierMobileGate.test.jsx still finds exactly what it pins.
              <div key={i} style={{border:`1px solid ${isExp?color+'60':'#e0d0b0'}`,borderLeft:`3px solid ${color}`,overflow:'hidden',background:isExp?`${color}06`:'#faf8f4'}}>
                <div role="button" tabIndex={0} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 12px',flexWrap:isMobile?'wrap':undefined,cursor:'pointer'}}
                  onClick={()=>setExpandedThreat(isExp?null:i)}
                  onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setExpandedThreat(isExp?null:i);}}}>
                  <span style={isMobile
                    ? {fontSize:FS.sm,fontWeight:700,color:swatch.inkMag,flex:'1 1 auto',minWidth:0,lineHeight:1.3}
                    : {fontSize:FS.sm,fontWeight:700,color:swatch.inkMag,width:130,flexShrink:0,lineHeight:1.3}}>{label}</span>
                  <div style={{width:72,height:6,background:swatch['#E8DCC8'],overflow:'hidden',flexShrink:0}}>
                    <div style={{height:'100%',width:`${sc}%`,background:color}}/>
                  </div>
                  <span style={{fontSize:FS.micro,fontWeight:800,color:badgeColor,background:`${badgeColor}15`,padding:'1px 4px',letterSpacing:'0.03em',flexShrink:0,width:54,textAlign:'center',display:'inline-block'}}>{badge}</span>
                  <span style={{fontSize:FS.xxs,color:MUTED,flexShrink:0}}>{isExp?'▲':'▼'}</span>
                </div>
                {/* DS-DEF-2 for THIS row, in the town's own voice, under the bar it is about.
                    A row whose pool the corpus is silent about shows nothing here (R-DST-K);
                    the bar, its band word and its assessment are untouched either way. */}
                {rowLine&&<div style={{padding:'0 12px 8px'}}>
                  <ProseBlock lines={[rowLine]} settlementName={r.name} tier={r.tier}
                    style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.55,margin:0,fontStyle:'italic'}}/>
                </div>}
                {isExp&&<div style={{padding:'0 12px 10px 12px',borderTop:`1px solid ${color}25`}}>
                  <p style={{fontSize: FS['12.5'],color:swatch.inkMag2,lineHeight:1.6,margin:'8px 0 0'}}>{assess}</p>
                  {fundingNotes[label]&&<p style={{fontSize:FS.xxs,color:MUTED,fontStyle:'italic',margin:'5px 0 0',lineHeight:1.4}}>{fundingNotes[label]}</p>}
                </div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── CRIMINAL ARCHITECTURE & PUBLIC ORDER ─────────────────────────── */}
      <Section title="Criminal Architecture & Public Order" collapsible
        defaultOpen={orderElevated||crimStructure==='organized'}>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>

          {/* Public order status banner — language aligned with internal security score */}
          {(()=>{
            const intScore   = scores.internal || 0;
            const orderStatus = intScore>=65 ? 'Strong Public Order'
                              : intScore>=40 ? 'Adequate Public Order'
                              : intScore>=20 ? 'Weak Public Order'
                              : 'Critical: Order Failing';
            const orderBadge  = intScore>=65?'STRONG':intScore>=40?'ADEQUATE':intScore>=20?'WEAK':'CRITICAL';
            return (
              <div style={{background:orderBg,border:`1px solid ${orderColor}30`,borderLeft:`4px solid ${orderColor}`,padding:'10px 14px'}}>
                <div style={{display:'flex',alignItems:'flex-start',gap:14,flexWrap:'wrap'}}>
                  <div style={{flexShrink:0,minWidth:130}}>
                    <div style={{fontSize:FS.micro,fontWeight:700,color:orderColor,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Internal Security · First Survey</div>
                    <div style={{fontSize:FS.lg,fontWeight:800,color:orderColor,lineHeight:1.15,marginBottom:4}}>{orderStatus}</div>
                    <div style={{display:'flex',alignItems:'center',gap:7}}>
                      <span style={{fontSize:FS.micro,fontWeight:800,color:orderColor,background:`${orderColor}15`,border:`1px solid ${orderColor}40`,padding:'1px 5px',letterSpacing:'0.04em'}}>{orderBadge}</span>
                    </div>
                    {safetyLabel&&!safetyLabel.includes('Moderate')&&<div style={{fontSize:FS.xxs,color:MUTED,marginTop:5,fontStyle:'italic'}}>{safetyLabel}</div>}
                  </div>
                  {(sp.safetyDesc||orderBeside||surveyBeside)&&<div style={{flex:1,minWidth:160}}>
                    {/* THE DM'S FIELD, rendered exactly as before and BY IDENTITY. The
                        corpus lines sit BESIDE it and never in its place. */}
                    {sp.safetyDesc&&<p style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.55,margin:0}}>{sp.safetyDesc}</p>}
                    {orderBeside&&<p style={{fontSize:FS.sm,color:swatch.inkMag3,lineHeight:1.55,margin:sp.safetyDesc?'6px 0 0':0,fontStyle:'italic'}}>{orderBeside}</p>}
                    {surveyBeside&&<p style={{fontSize:FS.xs,color:swatch.inkMag3,lineHeight:1.5,margin:'6px 0 0',fontStyle:'italic'}}>{surveyBeside}</p>}
                  </div>}
                </div>
              </div>
            );
          })()}

          {/* Criminal structure classification */}
          {csd&&<div style={{background:csd.bg,border:`1px solid ${csd.color}30`,borderLeft:`3px solid ${csd.color}`,padding:'9px 13px'}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:csd.color,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>Criminal Structure: {csd.label}</div>
            <p style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.5,margin:0}}>{csd.note}</p>
          </div>}

          {!crimStructure&&<div style={{background:swatch['#F0FAF4'],border:'1px solid #a8d8b0',borderLeft:'3px solid #2d7a44',padding:'8px 13px',fontSize:FS.sm,color:swatch.success}}>
            No organized criminal infrastructure detected. Crime exists at a petty, individual level.
          </div>}

          {/* DS-DEF-4: the shape of the crime and how far it has reached, in the town's own
              voice. Two lenses of one block at one position. */}
          {criminalLines.length>0&&<div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #8b1a1a',padding:'9px 13px'}}>
            <ProseBlock lines={criminalLines} settlementName={r.name} tier={r.tier}
              style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.55,margin:0,fontStyle:'italic'}}/>
          </div>}

          {/* Criminal institutions as power structures */}
          {crimInsts.length>0&&<div>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Active Criminal Operations</div>
            <div style={{display:'flex',flexDirection:'column',gap:5}}>
              {crimInsts.map((name,i)=>{
                const note = criminalOpNote(name);
                return (
                  <div key={i} style={{background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderLeft:'3px solid #8b1a1a',padding:'8px 12px'}}>
                    <div style={{fontSize:FS.sm,fontWeight:700,color:swatch.danger,marginBottom:3}}>{name}</div>
                    <div style={{fontSize: FS['11.5'],color:swatch['#5A3A2A'],lineHeight:1.4}}>{note}</div>
                  </div>
                );
              })}
            </div>
          </div>}

          {/* Criminal faction power dynamics + capture state note */}
          {crimFaction&&<div style={{background:swatch['#FAF8F4'],border:'1px solid #e8b0b0',borderLeft:'3px solid #8b1a1a',padding:'9px 13px'}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.danger,textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:3}}>
              Criminal Faction: Power {crimFaction.power||0}
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
                <div key={i} style={{background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',padding:'7px 10px'}}>
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
                <div key={i} style={{background:swatch['#F8F0FC'],border:'1px solid #d0a8e0',borderLeft:'3px solid #7a3a9a',padding:'8px 12px',fontSize:FS.sm,color:swatch['#3A1A5A'],lineHeight:1.5}}>{h}</div>
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
          {/* DS-DEF-5: what the town can actually field, in its own voice. Five lenses of
              one block at one position; the force cards below are untouched. */}
          {forceLines.length>0&&<div style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #4a3a1a',padding:'9px 13px',marginBottom:10}}>
            <ProseBlock lines={forceLines} settlementName={r.name} tier={r.tier}
              style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.55,margin:0,fontStyle:'italic'}}/>
          </div>}
          {walls.length>0&&<div style={{marginBottom:10}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch['#4A3A1A'],textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Fortifications</div>
            {walls.map((w,i)=><ForceCard key={i} inst={w} accent="#4a3a1a"/>)}
          </div>}
          {!hasAnyFort&&<div style={{background:swatch['#FDF8F0'],border:'1px solid #e8d0b0',borderLeft:'3px solid #8a5010',padding:'10px 13px',marginBottom:10,fontSize:FS.md,color:swatch.inkMag3}}>
            <strong style={{color:swatch['#8A5010']}}>Unfortified.</strong> No perimeter walls. Defenders cannot control entry points or create chokepoints.
          </div>}
          {/* DS-DEF-11: why the wall, or why not — beside the works themselves. */}
          {wallLine&&<p style={{fontSize:FS.sm,color:swatch.inkMag3,lineHeight:1.55,margin:'0 0 10px',fontStyle:'italic'}}>{wallLine}</p>}
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
          {!hasAnyForce&&<div style={{background:swatch['#FDF8F0'],border:'1px solid #e8d0b0',borderLeft:'3px solid #8a5010',padding:'10px 13px',fontSize:FS.md,color:swatch.inkMag3}}>
            <strong style={{color:swatch['#8A5010']}}>No organized force.</strong> Defense relies on individual armed citizens. No command structure, no training, no coordinated response.
          </div>}
        </div>}
      </div>

      {/* ── SUPPORTING CAPABILITIES ──────────────────────────────────────── */}
      {/* DS-DEF-6 at defense.supportingCapabilities: how supply reaches this town and who
          holds its water, in its own voice. Two lenses of one block at one position; the
          capability rows below are untouched.
          ⛔ IT SITS ABOVE THE FOLD, AND THAT PLACEMENT IS THE POINT. The section beneath is
          `collapsible defaultOpen={false}` and `Primitives.jsx:114` renders `{open &&
          children}`, so a child of it produces NO BYTES for a reader until the header is
          clicked. Drawn inside, this position was a sentence the registry called lit and no
          reader ever saw — the walker's reachability arm, the public-dossier guard and the
          registry law were all green over it, and only a render told the truth. The line is
          now the FRAMING of the fold rather than a thing inside it (the DS-HK-1
          arrangement), and the visibility arm in dossierMountRegistry.walker.test.js is what
          keeps it there. */}
      {supportingLines.length>0&&<div data-testid="defense-supporting-lines" style={{background:swatch['#FAF8F4'],border:'1px solid #d8c090',borderLeft:'4px solid #1a3a6a',padding:'9px 13px',marginBottom:10}}>
        <ProseBlock lines={supportingLines} settlementName={r.name} tier={r.tier}
          style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.55,margin:0,fontStyle:'italic'}}/>
      </div>}
      <Section title="Supporting Capabilities" collapsible defaultOpen={false}>
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {caps.map((cap,i)=>(
            <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start',background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderLeft:`3px solid ${cap.color}`,padding:'8px 12px'}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:2}}>
                  <span style={{fontSize:FS.xs,fontWeight:700,color:swatch.inkMag2}}>{cap.label}</span>
                  <span style={{fontSize:FS.xs,fontWeight:700,color:cap.color}}>{cap.status}</span>
                  {/* R-5b item #20: the bare 0-100 digit beside this bar is now
                      the score's band word from the shared ladder. Magical
                      Capability's status ("Arcane support" / "None") is a
                      presence read, not a grade, so the band is the only word
                      that told the reader how good the bar actually is. */}
                  {cap.score!==null&&<div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:6}}>
                    <div style={{width:50,height:5,background:swatch['#E8DCC8'],overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${Math.min(100,cap.score)}%`,background:cap.color}}/>
                    </div>
                    <span style={{fontSize:FS.xxs,color:cap.color,fontWeight:700}}>{scoreBand(cap.score)}</span>
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
        ?<Section title={`Vulnerabilities · First Survey (${defViolations.length})`} collapsible defaultOpen accent="#8b1a1a">
          {defViolations.map((v,i)=>{
            const crit=v.severity==='error'||v.severity==='critical';
            return <div key={i} style={{background:crit?'#fdf4f4':'#faf6ec',border:`1px solid ${crit?'#e8c0c0':'#e0c860'}`,borderLeft:`3px solid ${crit?'#8b1a1a':'#b8860b'}`,padding:'9px 13px',marginBottom:6}}>
              <div style={{fontSize:FS.xs,fontWeight:700,color:crit?'#8b1a1a':'#7a5010',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>{crit?'Structural':'Warning'}</div>
              <div style={{fontSize:FS.md,color:crit?'#5a1a1a':'#4a3010',lineHeight:1.45}}>{v.reason}</div>
            </div>;
          })}
        </Section>
        :<div style={{background:swatch['#FAF8F4'],border:'1px solid #a8d8b0',borderLeft:'3px solid #2d7a44',padding:'9px 13px',fontSize:FS.md,color:swatch.success}}>
          ✓ No critical defense vulnerabilities identified at the first survey.
        </div>
      }

    </div>
  );
}

export default React.memo(DefenseTab);
