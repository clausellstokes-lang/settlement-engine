import React, { useState } from 'react';
import {C} from '../design';
import {Ti, sans, Section, Empty} from '../Primitives';

import {isMobile} from '../tabConstants';

import {NarrativeNote} from '../NarrativeNote';

export function ViabilityTab({settlement:s, narrativeNote}) {
  if (!s?.economicViability) return <Empty message="No coherence data available. Generate a settlement first."/>;
  const v = s.economicViability;
  const metrics = v.metrics || {};
  const mobile = isMobile();

  // Strip the "✗ NOT VIABLE: " / "✓ VIABLE: " prefix from summary
  const summaryClean = (v.summary||'').replace(/^[✗✓]\s*(NOT VIABLE:|VIABLE:)\s*/i, '').trim();

  // Stress-consequence issues: expected effects of active stressors (siege, famine, etc.)
  // These are NOT structural problems — they belong in a separate "Active Conditions" section
  // so they don't pollute the structural plausibility assessment.
  const stressConsequences = [...(v.issues||[]), ...(v.warnings||[])].filter(i =>
    i.type === 'stress_consequence'
  );

  // Severity colors
  const sevColor = sev => sev==='critical'?'#8b1a1a':sev==='high'?'#8a3010':sev==='dependency'||sev==='warning'?'#b8860b':'#6b5340';
  const sevBg    = sev => sev==='critical'?'#fdf4f4':sev==='high'?'#fdf0e8':sev==='dependency'||sev==='warning'?'#fdf8e8':'#f7f4f0';

  // Structural violations from root
  const structViolations = s.structuralViolations || [];

  // Critical issues vs lower-severity
  const byDesignIssues = [...(v.issues||[]).filter(i => i.severity==='by_design')].sort((a,b)=>(a.institution||'').localeCompare(b.institution||''));
  const criticalIssues = [...(v.issues||[]).filter(i => i.severity==='critical' && i.type !== 'stress_consequence')].sort((a,b)=>(a.title||'').localeCompare(b.title||''));
  // Strip dependency/resource chain issues — those are in Economics & Resources tabs
  // Viability only shows logic violations, structural conflicts, and by-design contradictions
  const VIABILITY_EXCLUDED_TYPES = ['dependency','resource_chain','opportunity','incomplete_chain','trade_dependency','food_security'];
  const VIABILITY_EXCLUDED_SEV   = ['dependency','opportunity'];
  const filteredWarnings = (v.warnings||[]).filter(w =>
    !VIABILITY_EXCLUDED_TYPES.includes(w.type) &&
    !VIABILITY_EXCLUDED_SEV.includes(w.severity) &&
    w.category !== 'Resource Access' &&
    w.category !== 'Resource Chain' &&
    w.category !== 'Economic Opportunity' &&
    w.category !== 'Water Dependency'
  );
  // Suggestions (opportunities) excluded from Viability tab — see Economics tab

  const otherIssues    = [...(v.issues||[]).filter(i =>
    i.severity!=='critical' && i.severity!=='by_design' &&
    i.type !== 'stress_consequence' &&
    !VIABILITY_EXCLUDED_TYPES.includes(i.type) &&
    !VIABILITY_EXCLUDED_SEV.includes(i.severity)
  )].sort((a,b)=>(a.title||'').localeCompare(b.title||''));

  // Clean plot hook text (strip embedded " PLOT HOOK: " prefix)
  const cleanHook = h => {
    const t = typeof h==='object' ? h.hook||Ti(h) : String(h);
    return t.replace(/^\s*PLOT HOOK:\s*/i, '').trim();
  };

  const viable = v.viable;

  return (
    <div style={{...sans}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── VIABILITY VERDICT ────────────────────────────────────────────── */}
      <div style={{
        background: viable===false ? '#fdf4f4' : viable===true ? '#f0faf4' : '#fdf8e8',
        border: `2px solid ${viable===false?'#e8c0c0':viable===true?'#a8d8b0':'#e0c860'}`,
        borderLeft: `6px solid ${viable===false?'#8b1a1a':viable===true?'#1a5a28':'#b8860b'}`,
        borderRadius: 8, padding: '14px 18px', marginBottom: 14,
      }}>
        <div style={{display:'flex',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
              <span style={{fontSize:22,fontWeight:800,color:viable===false?'#8b1a1a':viable===true?'#1a5a28':'#b8860b',lineHeight:1}}>
                {viable===false ? '✗ NOT COHERENT' : viable===true ? '✓ COHERENT' : ' MARGINAL COHERENCE'}
              </span>
            </div>
            {summaryClean&&<p style={{fontSize:13,color:'#3d2b1a',lineHeight:1.55,margin:0}}>{summaryClean}</p>}
            <p style={{fontSize:11,color:'#6b5340',margin:'6px 0 0',lineHeight:1.4}}>
              This tab checks whether your settlement makes logical sense — not whether it&apos;s economically optimised. 
              A viable settlement can have unexploited resources and unsatisfied demand; what matters is whether the 
              pieces fit together plausibly.
            </p>
          </div>
          {/* Quick metric pills */}
          <div style={{display:'flex',gap:6,flexWrap:'wrap',flexShrink:0}}>
            {metrics.criticalIssueCount>0&&<span style={{fontSize:11,fontWeight:700,color:'#8b1a1a',background:'#fde8e8',border:'1px solid #f0a0a0',borderRadius:4,padding:'3px 9px'}}>{metrics.criticalIssueCount} critical</span>}
            
            
          </div>
        </div>

        
      </div>

      {/* ── MAGIC DEPENDENCY WARNING ───────────────────────────────────────── */}
      {s?.defenseProfile?.magicDependency&&(
        <div style={{background:'#f8f0ff',border:'1px solid #c0a0e0',borderLeft:'4px solid #7a3a9a',
          borderRadius:6,padding:'10px 14px',marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:'#5a2a8a',marginBottom:4}}>
            ✦ Magic Dependency Detected
          </div>
          <div style={{fontSize:11,color:'#6b5340',lineHeight:1.5}}>
            This settlement's resilience relies on active magical infrastructure. One or more supply
            chains are magically sustained, or stress conditions are being offset by arcane, divine,
            or druidic intervention. Loss of magical practitioners — through conflict, plague, or
            political disruption — would immediately expose critical vulnerabilities.
          </div>
          {(s.economicState?.activeChains||[]).filter(c=>c.magicNote).map((c,i)=>(
            <div key={i} style={{fontSize:10,color:'#7a4aaa',marginTop:6,paddingLeft:8,
              borderLeft:'2px solid #c0a0e0',fontStyle:'italic'}}>
              ✦ {c.label}: {c.magicNote}
            </div>
          ))}
        </div>
      )}

      {/* ── BY-DESIGN CONTRADICTIONS ────────────────────────────────────── */}
      {byDesignIssues.length>0&&<Section title={`✦ By-Design Contradictions (${byDesignIssues.length})`} collapsible defaultOpen={false} accent='#8a3010'>
        <div style={{fontSize:11.5,color:'#6b5340',marginBottom:8,lineHeight:1.5,fontStyle:'italic'}}>
          These contradictions are intentional overrides. The settlement has institutions or combinations outside its normal tier. Use these as plot seeds, not problems to fix.
        </div>
        {byDesignIssues.map((v2,i)=>(
          <div key={i} style={{padding:'8px 12px',background:'#fdf8f0',border:'1px solid #d8b880',borderLeft:'3px solid #c05010',borderRadius:4,marginBottom:6}}>
            <div style={{fontSize:12,fontWeight:700,color:'#8a3010',marginBottom:3}}>{v2.institution}</div>
            <div style={{fontSize:11.5,color:'#3d2b1a',lineHeight:1.6}}>{v2.reason}</div>
            {v2.suggestedFixes?.[0] && (
              <div style={{fontSize:10.5,color:'#9c8068',marginTop:4,fontStyle:'italic'}}> {v2.suggestedFixes[0]}</div>
            )}
          </div>
        ))}
      </Section>}

      {/* ── SURVIVAL CRISES (structural violations) ──────────────────────── */}
      {structViolations.length>0&&<Section title={` Structural Crises (${structViolations.length})`} collapsible defaultOpen accent='#8b1a1a'>
        {structViolations.map((v2,i)=>(
          <div key={i} style={{background:'#fdf0f0',border:'1px solid #e0a0a0',borderLeft:'4px solid #8b1a1a',borderRadius:6,padding:'10px 14px',marginBottom:8}}>
            <div style={{fontSize:11,fontWeight:700,color:'#8b1a1a',marginBottom:3}}>
              {v2.institution||v2.group}
            </div>
            <p style={{fontSize:13,color:'#5a1a1a',lineHeight:1.5,margin:0}}>{v2.reason}</p>
          </div>
        ))}
      </Section>}

      {/* ── CRITICAL ISSUES ──────────────────────────────────────────────── */}
      {criticalIssues.length>0&&<Section title={`Critical Issues (${criticalIssues.length})`} collapsible defaultOpen accent='#8b1a1a'>
        {criticalIssues.map((issue,i)=>(
          <div key={i} style={{background:'#fdf4f4',border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',borderRadius:7,padding:'12px 14px',marginBottom:10}}>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:4,flexWrap:'wrap'}}>
              {issue.category&&<span style={{fontSize:10,fontWeight:700,color:'#8b1a1a',textTransform:'uppercase',letterSpacing:'0.05em'}}>{issue.category}</span>}
              {issue.title&&<span style={{fontSize:13,fontWeight:700,color:'#1c1409'}}>{issue.title}</span>}
            </div>
            <p style={{fontSize:12.5,color:'#3d2b1a',lineHeight:1.55,margin:'0 0 6px'}}>{typeof issue.description==='object'?issue.description.short||issue.description.text||'':issue.description||issue.message}</p>
            {issue.priorityNote&&<p style={{fontSize:11.5,color:'#8b3a1a',fontStyle:'italic',margin:'0 0 8px',lineHeight:1.4}}>{issue.priorityNote}</p>}
            {issue.suggestedFixes?.length>0&&<div style={{borderTop:'1px solid #e8c0c0',paddingTop:8}}>
              <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Suggested Fixes</div>
              {issue.suggestedFixes.map((fix,j)=>(
                <div key={j} style={{display:'flex',gap:6,marginBottom:3}}>
                  <span style={{color:'#1a5a28',flexShrink:0,fontSize:11}}>→</span>
                  <span style={{fontSize:11.5,color:'#3d2b1a'}}>{fix}</span>
                </div>
              ))}
            </div>}
          </div>
        ))}
      </Section>}

      {/* ── OTHER ISSUES ─────────────────────────────────────────────────── */}
      {otherIssues.length>0&&<Section title={`Issues (${otherIssues.length})`} collapsible defaultOpen>
        {otherIssues.map((issue,i)=>{
          const sc = sevColor(issue.severity);
          const sb = sevBg(issue.severity);
          return <div key={i} style={{background:sb,border:`1px solid ${sc}40`,borderLeft:`3px solid ${sc}`,borderRadius:6,padding:'10px 14px',marginBottom:8}}>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:3,flexWrap:'wrap'}}>
              {issue.category&&<span style={{fontSize:10,fontWeight:700,color:sc,textTransform:'uppercase',letterSpacing:'0.05em'}}>{issue.category}</span>}
              {issue.title&&<span style={{fontSize:12.5,fontWeight:700,color:'#1c1409'}}>{issue.title}</span>}
            </div>
            <p style={{fontSize:12,color:'#3d2b1a',lineHeight:1.5,margin:0}}>{typeof issue.description==='object'?issue.description.short||issue.description.text||'':issue.description||issue.message}</p>
            {issue.suggestedFixes?.length>0&&<div style={{marginTop:6}}>
              {issue.suggestedFixes.map((fix,j)=>(
                <div key={j} style={{display:'flex',gap:6,marginBottom:2}}>
                  <span style={{color:'#1a5a28',flexShrink:0,fontSize:11}}>→</span>
                  <span style={{fontSize:11,color:'#3d2b1a'}}>{fix}</span>
                </div>
              ))}
            </div>}
          </div>;
        })}
      </Section>}

      {/* ── WARNINGS ─────────────────────────────────────────────────────── */}
      {stressConsequences.length>0&&<Section title={`⚡ Active Stress Effects (${stressConsequences.length})`} collapsible defaultOpen={true} accent='#6b4c2a'>
        <p style={{fontSize:12,color:'#5a3e28',lineHeight:1.5,margin:'0 0 10px',fontStyle:'italic'}}>
          These are expected consequences of active stress conditions — not structural flaws. A settlement under siege losing supply chain access is working as intended.
        </p>
        {stressConsequences.map((item,i)=>(
          <div key={i} style={{background:'#f9f3e8',border:'1px solid #d4a96a',borderRadius:5,padding:'8px 10px',marginBottom:6}}>
            {item.title&&<span style={{fontSize:12.5,fontWeight:700,color:'#6b4c2a',display:'block',marginBottom:2}}>{item.title}</span>}
            <p style={{fontSize:12,color:'#5a3e28',lineHeight:1.5,margin:0}}>{typeof item.description==='object'?item.description.short||item.description.text||'':item.description||item.message||''}</p>
          </div>
        ))}
      </Section>}

      {filteredWarnings.length>0&&<Section title={`Warnings (${filteredWarnings.length})`} collapsible defaultOpen={false}>
        {filteredWarnings.map((w,i)=>{
          const wobj = typeof w==='object' ? w : {description:w};
          const sc = sevColor(wobj.severity||'warning');
          return <div key={i} style={{background:sevBg(wobj.severity||'warning'),border:`1px solid ${sc}35`,borderLeft:`3px solid ${sc}`,borderRadius:6,padding:'10px 14px',marginBottom:8}}>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:3,flexWrap:'wrap'}}>
              {wobj.category&&<span style={{fontSize:10,fontWeight:700,color:sc,textTransform:'uppercase',letterSpacing:'0.05em'}}>{wobj.category}</span>}
              {wobj.title&&<span style={{fontSize:12.5,fontWeight:700,color:'#1c1409'}}>{wobj.title}</span>}
            </div>
            {wobj.description&&<p style={{fontSize:12,color:'#3d2b1a',lineHeight:1.5,margin:'0 0 4px'}}>{wobj.description}</p>}
            {wobj.impact&&<p style={{fontSize:11.5,color:'#5a3a10',fontStyle:'italic',margin:'0 0 6px',lineHeight:1.4}}>Impact: {wobj.impact}</p>}
            {wobj.suggestedFixes?.length>0&&<div>
              {wobj.suggestedFixes.map((fix,j)=>(
                <div key={j} style={{display:'flex',gap:6,marginBottom:2}}>
                  <span style={{color:'#1a5a28',flexShrink:0,fontSize:11}}>→</span>
                  <span style={{fontSize:11,color:'#3d2b1a'}}>{fix}</span>
                </div>
              ))}
            </div>}
          </div>;
        })}
      </Section>}

      {/* ── OPPORTUNITIES / SUGGESTIONS ──────────────────────────────────── */}
      
    </div>
  );
}

export default React.memo(ViabilityTab);
