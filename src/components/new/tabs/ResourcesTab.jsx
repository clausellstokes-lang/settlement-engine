import React, { useState } from 'react';
import {C} from '../design';
import {sans, Section, Empty} from '../Primitives';

import {isMobile} from '../tabConstants';

import {NarrativeNote} from '../NarrativeNote';

export function ResourcesTab({settlement:r, narrativeNote}) {
  const res = r?.resourceAnalysis;
  if (!res) return <Empty message="No resource data available."/>;
  const mobile = isMobile();
  const config = r?.config || {};

  // Imports: object {critical:[], recommended:[], reasons:{}}

  // Exploitation buckets
  const unexploited    = [...(res.exploitation?.unexploited || [])].sort((a,b)=>(a.rawResource||'').localeCompare(b.rawResource||''));
  const partExploited  = [...(res.exploitation?.partiallyExploited || [])].sort((a,b)=>(a.rawResource||'').localeCompare(b.rawResource||''));
  const fullExploited  = [...(res.exploitation?.fullyExploited || [])].sort((a,b)=>(a.rawResource||'').localeCompare(b.rawResource||''));

  // Value badge
  const valColor = v => v==='high'?'#1a5a28':v==='medium'?'#a0762a':'#6b5340';
  const valBg    = v => v==='high'?'#e8f5ec':v==='medium'?'#faf4e8':'#f0ead8';

  // Terrain accent color
  const terrainColor = {
    Coastal:'#1a3a6a', Plains:'#3a6a1a', Forest:'#1a5a28',
    Hills:'#6a4a1a', Mountains:'#4a4a5a', River:'#1a5a6a',
    Desert:'#8a5a1a', Swamp:'#2a5a3a', Tundra:'#3a4a6a',
  }[res.terrain] || '#a0762a';

  return (
    <div style={{...sans}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── TERRAIN IDENTITY HEADER ───────────────────────────────────────── */}
      <div style={{background:`linear-gradient(to right, ${terrainColor}18, ${terrainColor}08)`,border:`1px solid ${terrainColor}35`,borderLeft:`4px solid ${terrainColor}`,borderRadius:8,padding:'14px 18px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:14,flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:160}}>
            <div style={{fontSize:10,fontWeight:700,color:terrainColor,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:4}}>Terrain</div>
            <div style={{fontSize:22,fontWeight:700,color:'#1c1409',lineHeight:1.1,marginBottom:6}}>{res.terrain||'Unknown'}</div>
            {res.strategicValue&&<div style={{fontSize:12.5,color:'#3d2b1a',lineHeight:1.5}}>{res.strategicValue}</div>}
          </div>
          {res.economicStrengths?.length>0&&<div style={{flex:'2 1 200px'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Economic Strengths</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
              {[...res.economicStrengths].sort((a,b)=>(a||'').localeCompare(b||'')).map((s,i)=>(
                <span key={i} style={{fontSize:11,fontWeight:600,color:'#1a5a28',background:'#e0f0e4',border:'1px solid #a8d8b0',borderRadius:4,padding:'2px 9px'}}>✓ {s}</span>
              ))}
            </div>
          </div>}
        </div>
      </div>

      {/* ── CRITICAL IMPORTS (what they can't produce) ───────────────────── */}
      {(unexploited.length>0||partExploited.length>0||fullExploited.length>0)&&<Section title="Resource Exploitation" collapsible defaultOpen>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>

          {/* Unexploited — most interesting for DMs */}
          {unexploited.map((chain,i)=>(
            <div key={i} style={{background:'#fdf8e8',border:'1px solid #e0c060',borderLeft:'3px solid #b8860b',borderRadius:6,padding:'10px 14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
                <span style={{fontSize:9,fontWeight:800,color:'#7a5010',background:'#f5e8c0',borderRadius:3,padding:'1px 6px',letterSpacing:'0.05em'}}>UNEXPLOITED</span>
                <span style={{fontSize:13,fontWeight:700,color:'#1c1409',textTransform:'capitalize'}}>{chain.rawResource}</span>
                <span style={{fontSize:10,fontWeight:600,color:valColor(chain.exportValue),background:valBg(chain.exportValue),borderRadius:3,padding:'0 5px'}}>{chain.exportValue} value</span>
              </div>
              {/* Chain flow */}
              <div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap',marginBottom:6}}>
                <span style={{fontSize:11,color:'#3d2b1a',background:'#f0ead8',borderRadius:3,padding:'1px 6px',fontWeight:600,textTransform:'capitalize'}}>{chain.rawResource}</span>
                {(chain.intermediateGoods||[]).map((g,j)=>(
                  <React.Fragment key={j}>
                    <span style={{fontSize:10,color:'#9c8068'}}>→</span>
                    <span style={{fontSize:11,color:'#3d2b1a',background:'#f0ead8',borderRadius:3,padding:'1px 6px'}}>{g}</span>
                  </React.Fragment>
                ))}
                {(chain.finalProducts||[]).slice(0,2).map((g,j)=>(
                  <React.Fragment key={j}>
                    <span style={{fontSize:10,color:'#9c8068'}}>→</span>
                    <span style={{fontSize:11,color:'#1a5a28',background:'#e8f5ec',border:'1px solid #a8d8b0',borderRadius:3,padding:'1px 6px',fontWeight:600}}>{g}</span>
                  </React.Fragment>
                ))}
              </div>
              {chain.processingInstitutions?.length>0&&<div style={{fontSize:11,color:'#5a3a10'}}>
                Needs: {chain.processingInstitutions.join(', ')}
              </div>}
            </div>
          ))}

          {/* Partially exploited */}
          {partExploited.map((chain,i)=>(
            <div key={i} style={{background:'#f4faf4',border:'1px solid #a8d8b0',borderLeft:'3px solid #5a6a1a',borderRadius:6,padding:'10px 14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                <span style={{fontSize:9,fontWeight:800,color:'#3a5a1a',background:'#d8ecd8',borderRadius:3,padding:'1px 6px',letterSpacing:'0.05em'}}>PARTIAL</span>
                <span style={{fontSize:13,fontWeight:700,color:'#1c1409',textTransform:'capitalize'}}>{chain.rawResource}</span>
                <span style={{fontSize:10,fontWeight:600,color:valColor(chain.exportValue),background:valBg(chain.exportValue),borderRadius:3,padding:'0 5px'}}>{chain.exportValue} value</span>
              </div>
              <div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap'}}>
                <span style={{fontSize:11,color:'#3d2b1a',background:'#f0ead8',borderRadius:3,padding:'1px 6px',fontWeight:600,textTransform:'capitalize'}}>{chain.rawResource}</span>
                {(chain.intermediateGoods||[]).map((g,j)=>(
                  <React.Fragment key={j}><span style={{fontSize:10,color:'#9c8068'}}>→</span><span style={{fontSize:11,color:'#3d2b1a',background:'#f0ead8',borderRadius:3,padding:'1px 6px'}}>{g}</span></React.Fragment>
                ))}
              </div>
            </div>
          ))}

          {/* Fully exploited */}
          {fullExploited.map((chain,i)=>(
            <div key={i} style={{background:'#f0faf2',border:'1px solid #a8d8b0',borderLeft:'3px solid #1a5a28',borderRadius:6,padding:'8px 14px'}}>
              <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                <span style={{fontSize:9,fontWeight:800,color:'#1a5a28',background:'#c8ecd4',borderRadius:3,padding:'1px 6px',letterSpacing:'0.05em'}}>✓ FULLY EXPLOITED</span>
                <span style={{fontSize:12,fontWeight:700,color:'#1c1409',textTransform:'capitalize'}}>{chain.rawResource}</span>
                <span style={{fontSize:10,fontWeight:600,color:valColor(chain.exportValue),background:valBg(chain.exportValue),borderRadius:3,padding:'0 5px'}}>{chain.exportValue} value</span>
              </div>
            </div>
          ))}
        </div>
      </Section>}

      {/* ── AVAILABLE RAW RESOURCES ───────────────────────────────────────── */}
      {(r?.config?.nearbyResources?.length>0||res.availableResources?.length>0)&&<Section title="Nearby Resources" collapsible defaultOpen={true}>
        {(() => {
          const allRes = [...(r?.config?.nearbyResources || [])].sort();
          const depleted = [...(r?.config?.nearbyResourcesDepleted || [])].sort();
          const abundant = allRes.filter(rk => !depleted.includes(rk));
          const fmtKey = rk => rk.replace(/_/g,' ').replace(/./g,c=>c.toUpperCase());
          return <>
            {depleted.length>0&&<div style={{marginBottom:8}}>
              <div style={{fontSize:10,fontWeight:700,color:'#c05000',letterSpacing:'0.06em',marginBottom:4}}> DEPLETED — consumed locally, export potential reduced</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {depleted.map((rk,i)=><span key={i} style={{fontSize:11,color:'#8b3000',background:'#fff3ed',border:'1px solid #e08040',borderRadius:4,padding:'2px 9px',fontWeight:600}}> {fmtKey(rk)}</span>)}
              </div>
            </div>}
            {abundant.length>0&&<div style={{marginBottom:res.availableResources?.length>0?8:0}}>
              <div style={{fontSize:10,fontWeight:700,color:'#1a5a28',letterSpacing:'0.06em',marginBottom:4}}>✦ ABUNDANT — full export potential</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {abundant.map((rk,i)=><span key={i} style={{fontSize:11,color:'#1a5a28',background:'#f0faf2',border:'1px solid #88c880',borderRadius:4,padding:'2px 9px'}}>{fmtKey(rk)}</span>)}
              </div>
            </div>}
            {res.availableResources?.length>0&&<div style={{paddingTop:6,borderTop:'1px solid #e8dcc8'}}>
              <div style={{fontSize:10,fontWeight:700,color:'#9c8068',letterSpacing:'0.06em',marginBottom:4}}>COMMODITIES AVAILABLE</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {res.availableResources.map((r2,i)=><span key={i} style={{fontSize:11,color:'#3d2b1a',background:'#f0ead8',border:'1px solid #d8c890',borderRadius:4,padding:'2px 9px',textTransform:'capitalize'}}>{r2.replace(/_/g,' ')}</span>)}
              </div>
            </div>}
          </>;
        })()}
      </Section>}

      {/* ── EXPORT POTENTIAL ─────────────────────────────────────────────── */}
      {res.exports?.length>0&&<Section title="Export Potential" collapsible defaultOpen={false}>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {[...res.exports].sort((a,b)=>{
              const vOrder={['very high']:0,high:1,medium:2,low:3};
              return (vOrder[a.value||'medium']??2)-(vOrder[b.value||'medium']??2)||(a.good||'').localeCompare(b.good||'');
            }).map((e,i)=>{
            const v = e.value||'medium';
            return <div key={i} style={{background:'#f0faf2',border:'1px solid #a8d8b0',borderLeft:`3px solid ${valColor(v)}`,borderRadius:5,padding:'6px 10px',minWidth:0}}>
              <div style={{fontSize:12,fontWeight:700,color:'#1c1409'}}>{e.product||e.good||e.name}</div>
              {e.reason&&<div style={{fontSize:10,color:'#6b5340',marginTop:2}}>{e.reason}</div>}
            </div>;
          })}
        </div>
      </Section>}

      {/* ── GAPS & OPPORTUNITIES (combined) ──────────────────────────────── */}
      {(res.gaps?.length>0||res.priorityNotes?.length>0)&&<Section title="Gaps & Opportunities" collapsible defaultOpen accent="#5a2a8a">
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {/* Priority notes — DM opportunity hooks */}
          {(res.priorityNotes||[]).map((note,i)=>(
            <div key={i} style={{display:'flex',gap:8,padding:'8px 12px',background:'#f8f4fd',border:'1px solid #c8b0e0',borderLeft:'3px solid #5a2a8a',borderRadius:5}}>
              <span style={{fontSize:12,color:'#5a2a8a',flexShrink:0}}>✦</span>
              <p style={{fontSize:12.5,color:'#1c1409',lineHeight:1.45,margin:0}}>{note}</p>
            </div>
          ))}
          {/* Structural gaps */}
          {(res.gaps||[]).map((g,i)=>{
            const chain = typeof g==='object'?g.chain:'';
            const impact = typeof g==='object'?g.impact||(g.missing||[]).join(', '):''+g;
            const sev = typeof g==='object'?g.severity:'low';
            const gc = sev==='high'?'#8b1a1a':sev==='medium'?'#a0762a':'#6b5340';
            const gbg = sev==='high'?'#fdf4f4':sev==='medium'?'#faf4e8':'#f7f0e4';
            return <div key={i} style={{display:'flex',gap:8,padding:'8px 12px',background:gbg,border:`1px solid ${gc}40`,borderLeft:`3px solid ${gc}`,borderRadius:5}}>
              <span style={{fontSize:12,color:gc,flexShrink:0}}>{sev==='high'?'':''}</span>
              <div style={{flex:1}}>
                {chain&&<span style={{fontSize:11,fontWeight:700,color:'#1c1409',textTransform:'capitalize',marginRight:6}}>{chain}:</span>}
                <span style={{fontSize:12,color:'#3d2b1a'}}>{impact}</span>
              </div>
            </div>;
          })}
        </div>
      </Section>}

      {/* ── TERRAIN EFFECTS (only if data exists) ────────────────────────── */}
      {res.featureEffects?.length>0&&<Section title="Terrain Effects" collapsible defaultOpen={false}>
        {res.featureEffects.map((e,i)=>(
          <div key={i} style={{padding:'6px 0',borderBottom:'1px solid #f0e8d8',fontSize:12,color:'#3d2b1a'}}>
            <strong style={{color:'#1c1409'}}>{e.feature}:</strong> {e.effect}
          </div>
        ))}
      </Section>}

    </div>
  );
}

export default React.memo(ResourcesTab);
