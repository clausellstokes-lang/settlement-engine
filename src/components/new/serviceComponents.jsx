import React, { useState } from 'react';
import {C} from './design';
import {Ti, PlotHook} from './Primitives';

import {foodNarrative} from './tabHelpers';

// ── ServiceItem ───────────────────────────────────────────────────────────────
export function ServiceItem({ svc, accent='#6b5340', isCriminal=false, tradeDeps, impaired, degraded, vulnerable, depReasons, chainDepth=null }) {
  const name  = typeof svc === 'string' ? svc : svc?.name || '';
  const desc  = typeof svc === 'object' ? (svc.desc || '') : '';
  const inst  = typeof svc === 'object' ? (svc.institution || '') : '';
  const isImp = impaired?.has(name) || impaired?.has(inst);
  const isDeg = !isImp && (degraded?.has(name) || degraded?.has(inst));
  const isVul = !isImp && !isDeg && (vulnerable?.has(name) || vulnerable?.has(inst));
  const statusColor = isImp ? '#8b1a1a' : isDeg ? '#8a4010' : isVul ? '#7a5010' : null;
  const statusLabel = isImp ? ' IMPAIRED' : isDeg ? ' REDUCED' : isVul ? ' VULNERABLE' : null;
  const depthLabel  = chainDepth && chainDepth > 1
    ? (chainDepth === 2 ? '2-order chain' : chainDepth === 3 ? '3-order chain' : chainDepth + '-order chain')
    : null;

  return (
    <div style={{
      display:'flex', alignItems:'flex-start', gap:8, padding:'5px 8px',
      background: isImp?'#fdf4f4': isDeg?'#fdf8f0': isCriminal?'#1a0808':'#faf8f4',
      borderLeft:`2px solid ${statusColor||accent}`,
      borderRadius:4, marginBottom:3,
      opacity: isImp?0.9:1,
    }}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
          <span style={{fontSize:12.5,fontWeight:600,color:isCriminal?'#c06060':'#1c1409'}}>{name}</span>
          {statusLabel&&<span style={{fontSize:9,fontWeight:800,color:statusColor,background:`${statusColor}18`,borderRadius:3,padding:'0 5px',letterSpacing:'0.04em',flexShrink:0}}>{statusLabel}</span>}
          {(isImp||isDeg||isVul)&&depthLabel&&<span style={{fontSize:9,fontWeight:600,color:'#6b5340',background:'#f0e8d8',border:'1px solid #c8b89a',borderRadius:3,padding:'0 5px',flexShrink:0}}> {depthLabel}</span>}
        </div>
        {desc&&<p style={{fontSize:11,color:isCriminal?'#8a5050':'#9c8068',lineHeight:1.3,margin:'1px 0 0'}}>{desc}</p>}
        {inst&&<p style={{fontSize:10,color:isCriminal?'#7a4040':'#9c8068',margin:'1px 0 0',fontStyle:'italic'}}>{inst}</p>}
        {(isImp||isDeg)&&depReasons&&(depReasons.get(name)||depReasons.get(inst))&&(()=>{
          const r=depReasons.get(name)||depReasons.get(inst);
          return <p style={{fontSize:10,color:isImp?'#8b1a1a':'#8a4010',margin:'3px 0 0',lineHeight:1.3}}>
             Needs <strong>{r.resource}</strong>
            {r.impact&&<span style={{fontStyle:'italic',marginLeft:4}}>{r.impact.slice(0,70)}{r.impact.length>70?'…':''}</span>}
          </p>;
        })()}
      </div>
    </div>
  );
}

// ── SafetyProfilePanel ────────────────────────────────────────────────────────

// ── SafetyProfilePanel ────────────────────────────────────────────────────────

// ── foodNarrative ─────────────────────────────────────────────────────────────
