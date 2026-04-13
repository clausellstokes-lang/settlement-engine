import React, { useState } from 'react';
import {C} from './design';
import {Ti, serif, Tag, PlotHook} from './Primitives';

export function NeighbourLinkCard({link,settlement,styleFor}) {
  const [open,setOpen]=useState(false);
  const relType=link.relationshipType||link.relationshipLabel||'neutral';
  const st=styleFor(relType.toLowerCase().replace(/\s+/g,'_'));
  const label=(relType||'linked').replace(/_/g,' ');
  return (
    <div style={{border:`1px solid ${st.border}`,borderLeft:`3px solid ${st.color}`,borderRadius:8,overflow:'hidden'}}>
      <button onClick={()=>setOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:open?st.bg:'#faf8f4',border:'none',cursor:'pointer',textAlign:'left',WebkitTapHighlightColor:'transparent'}}>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
            <span style={{...serif,fontSize:15,fontWeight:700,color:'#1c1409'}}>{link.neighbourName||link.name}</span>
            <span style={{fontSize:10,fontWeight:700,color:st.color,background:`${st.color}15`,border:`1px solid ${st.color}40`,borderRadius:10,padding:'1px 8px'}}>{label}</span>
            {link.neighbourTier&&<span style={{fontSize:11,color:'#9c8068'}}>{link.neighbourTier}</span>}
          </div>
          {link.sharedHistory&&<p style={{fontSize:12,color:'#6b5340',margin:'4px 0 0',lineHeight:1.4}}>{link.sharedHistory}</p>}
        </div>
        <span style={{fontSize:11,color:'#9c8068',flexShrink:0}}>{open?'▲':'▼'}</span>
      </button>
      {open&&<div style={{padding:'12px 14px',background:'rgba(250,248,244,0.97)',borderTop:`1px solid ${st.border}`}}>
        {link.cause&&<div style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Cause</div>
          <p style={{fontSize:12,color:'#3d2b1a',lineHeight:1.5,margin:0}}>{link.cause}</p>
        </div>}
        {link.diplomaticStatus&&<div style={{marginBottom:10}}>
          <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Diplomatic Status</div>
          <p style={{fontSize:12,color:'#3d2b1a',lineHeight:1.5,margin:0}}>{link.diplomaticStatus}</p>
        </div>}
        {(link.tensions?.length>0||link.opportunities?.length>0)&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10,marginBottom:10}}>
          {link.tensions?.length>0&&<div style={{background:'#fdf4f4',border:'1px solid #e8c0c0',borderRadius:6,padding:'8px 10px'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#8b1a1a',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>Tensions</div>
            {link.tensions.map((t,i)=><div key={i} style={{fontSize:12,color:'#3d2b1a',marginBottom:3,lineHeight:1.4}}>▸ {t}</div>)}
          </div>}
          {link.opportunities?.length>0&&<div style={{background:'#f0faf2',border:'1px solid #a8d8b0',borderRadius:6,padding:'8px 10px'}}>
            <div style={{fontSize:10,fontWeight:700,color:'#1a5a28',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>Opportunities</div>
            {link.opportunities.map((o,i)=><div key={i} style={{fontSize:12,color:'#1c1409',marginBottom:3,lineHeight:1.4}}>▸ {o}</div>)}
          </div>}
        </div>}
        {link.npcConnections?.length>0&&<div>
          <div style={{fontSize:10,fontWeight:700,color:'#2a3a7a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>NPC Connections</div>
          {link.npcConnections.map((conn,i)=>(
            <div key={i} style={{background:'#f0f4ff',border:'1px solid #c0c8e8',borderLeft:'3px solid #2a3a7a',borderRadius:6,padding:'10px 12px',marginBottom:6}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                <div style={{background:'rgba(250,248,244,0.97)',border:'1px solid #c0c8e8',borderRadius:5,padding:'5px 9px',flexShrink:0}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#1c1409'}}>{conn.primaryNPCName}</div>
                  <div style={{fontSize:10,color:'#6b5340'}}>{conn.primaryNPCRole}{settlement?.name?` · ${settlement.name}`:''}</div>
                </div>
                <span style={{fontSize:14,color:'#9c8068',padding:'4px 0',flexShrink:0}}>↔</span>
                <div style={{background:'#eef0ff',border:'1px solid #c0c8e8',borderRadius:5,padding:'5px 9px',flexShrink:0}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#2a3a7a'}}>{conn.neighbourNPCName||`Contact in ${link.neighbourName}`}</div>
                  <div style={{fontSize:10,color:'#5a6a9a'}}>{conn.neighbourNPCRole?`${conn.neighbourNPCRole} · `:''}  {link.neighbourName}</div>
                </div>
              </div>
              {conn.description&&<p style={{fontSize:12,color:'#1c1409',lineHeight:1.5,margin:0}}>{conn.description}</p>}
            </div>
          ))}
        </div>}
        {link.tradeGoods?.length>0&&<div style={{marginTop:8}}>
          <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>Trade Goods</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:4}}>{link.tradeGoods.map((g,i)=><Tag key={i} color="#1a5a28">{g}</Tag>)}</div>
        </div>}
        {link.plotHooks?.length>0&&<div style={{marginTop:8}}>
          {link.plotHooks.map((h,i)=><PlotHook key={i} text={typeof h==='string'?h:Ti(h)}/>)}
        </div>}
        {/* Cross-settlement NPC contacts for this link */}
        {open&&(()=>{
          const _pn = link.neighbourName || link.name;
          const _isr = (settlement?.interSettlementRelationships||[])
            .filter(rx => rx.partnerSettlement === _pn || rx.linkId === link.linkId);
          const _c = {trade_partner:'#1a5a28',allied:'#1a3a7a',patron:'#4a1a6a',client:'#6a3a1a',rival:'#8a5010',cold_war:'#8a3010',hostile:'#8b1a1a',neutral:'#6b5340'}[link.relationshipType] || '#6b5340';
          return _isr.length>0 ? <div style={{marginTop:10,borderTop:`1px solid ${_c}20`,paddingTop:8}}>
            <div style={{fontSize:10,fontWeight:800,color:_c,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>
              Known Contacts ({_isr.length})
            </div>
            {_isr.map((rx,i)=><div key={i} style={{fontSize:11,color:'#3d2b1a',marginBottom:4,lineHeight:1.4,paddingLeft:8,borderLeft:`2px solid ${_c}40`}}>
              <strong>{rx.npcName}</strong> ({rx.npcRole}) ↔ <strong style={{color:_c}}>{rx.partnerName}</strong> ({rx.partnerRole})
              {rx.description&&<div style={{fontSize:10,color:'#6b5340',marginTop:1,fontStyle:'italic'}}>{rx.description}</div>}
            </div>)}
          </div> : null;
        })()}
      </div>}
    </div>
  );
}
