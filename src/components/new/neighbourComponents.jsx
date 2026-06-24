import { useState } from 'react';
import { FS, swatch, MUTED } from '../theme.js';
import {Ti, serif, Tag, PlotHook} from './Primitives';
import EntityLink from '../primitives/EntityLink.jsx';
import { useDossierEntities } from '../dossier/DossierEntityContext.jsx';

/**
 * Resolve a LOCAL NPC's display name to its stable index id (rename-safe).
 * Matches against the live `currentName` of each indexed npc so a renamed NPC
 * still maps to its card. Returns null for a name absent from the index (a
 * foreign-settlement contact) — the caller then renders plain text.
 *
 * @param {object|null} index  buildDossierEntityIndex result (or null).
 * @param {string} name        The NPC's stated name.
 * @returns {string|null}
 */
function localNpcId(index, name) {
  if (!index || !name) return null;
  const key = String(name).trim().toLowerCase();
  if (!key) return null;
  const hit = (index.npcs || []).find(n => String(n.currentName || '').trim().toLowerCase() === key);
  return hit ? hit.id : null;
}

export function NeighbourLinkCard({link,settlement,styleFor}) {
  const [open,setOpen]=useState(false);
  // This card IS the neighbour's relationship card (its own anchor), so its
  // header stays the expand/collapse toggle rather than a self-link. The
  // index is read to cross-link the LOCAL NPC in each npcConnection to its
  // card on the NPCs tab (rename-safe; foreign contacts degrade to text).
  const { index } = useDossierEntities();
  const relType=link.relationshipType||link.relationshipLabel||'neutral';
  const st=styleFor(relType.toLowerCase().replace(/\s+/g,'_'));
  const label=(relType||'linked').replace(/_/g,' ');
  return (
    <div style={{border:`1px solid ${st.border}`,borderLeft:`3px solid ${st.color}`,borderRadius:8,overflow:'hidden'}}>
      <button type="button" aria-expanded={open} onClick={()=>setOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:open?st.bg:'#faf8f4',border:'none',cursor:'pointer',textAlign:'left',WebkitTapHighlightColor:'transparent'}}>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
            <span style={{...serif,fontSize:FS.lg,fontWeight:700,color:swatch.inkMag}}>{link.neighbourName||link.name}</span>
            <span style={{fontSize:FS.xxs,fontWeight:700,color:st.color,background:`${st.color}15`,border:`1px solid ${st.color}40`,borderRadius:10,padding:'1px 8px'}}>{label}</span>
            {link.neighbourTier&&<span style={{fontSize:FS.xs,color:MUTED}}>{link.neighbourTier}</span>}
          </div>
          {link.sharedHistory&&<p style={{fontSize:FS.sm,color:swatch.inkMag3,margin:'4px 0 0',lineHeight:1.4}}>{link.sharedHistory}</p>}
        </div>
        <span style={{fontSize:FS.xs,color:MUTED,flexShrink:0}}>{open?'▲':'▼'}</span>
      </button>
      {open&&<div style={{padding:'12px 14px',background:'rgba(250,248,244,0.97)',borderTop:`1px solid ${st.border}`}}>
        {link.cause&&<div style={{marginBottom:10}}>
          <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Cause</div>
          <p style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.5,margin:0}}>{link.cause}</p>
        </div>}
        {link.diplomaticStatus&&<div style={{marginBottom:10}}>
          <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Diplomatic Status</div>
          <p style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.5,margin:0}}>{link.diplomaticStatus}</p>
        </div>}
        {(link.tensions?.length>0||link.opportunities?.length>0)&&<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:10,marginBottom:10}}>
          {link.tensions?.length>0&&<div style={{background:swatch.dangerBg,border:'1px solid #e8c0c0',borderRadius:6,padding:'8px 10px'}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.danger,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>Tensions</div>
            {link.tensions.map((t,i)=><div key={i} style={{fontSize:FS.sm,color:swatch.inkMag2,marginBottom:3,lineHeight:1.4}}>▸ {t}</div>)}
          </div>}
          {link.opportunities?.length>0&&<div style={{background:swatch.successBg,border:'1px solid #a8d8b0',borderRadius:6,padding:'8px 10px'}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.success,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>Opportunities</div>
            {link.opportunities.map((o,i)=><div key={i} style={{fontSize:FS.sm,color:swatch.inkMag,marginBottom:3,lineHeight:1.4}}>▸ {o}</div>)}
          </div>}
        </div>}
        {link.npcConnections?.length>0&&<div>
          <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.info,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>NPC Connections</div>
          {link.npcConnections.map((conn,i)=>(
            <div key={i} style={{background:swatch.infoBg,border:'1px solid #c0c8e8',borderLeft:'3px solid #2a3a7a',borderRadius:6,padding:'10px 12px',marginBottom:6}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:8,marginBottom:8,flexWrap:'wrap'}}>
                <div style={{background:'rgba(250,248,244,0.97)',border:'1px solid #c0c8e8',borderRadius:5,padding:'5px 9px',flexShrink:0}}>
                  <div style={{fontSize:FS.xs,fontWeight:700,color:swatch.inkMag}}>
                    {(() => {
                      // The primary side is a LOCAL NPC -> link to its card
                      // (rename-safe). neighbourNPCName stays plain (foreign).
                      const lid = localNpcId(index, conn.primaryNPCName);
                      return lid
                        ? <EntityLink id={lid} type="npc" fallback={conn.primaryNPCName} style={{fontSize:'inherit',fontWeight:700}} />
                        : conn.primaryNPCName;
                    })()}
                  </div>
                  <div style={{fontSize:FS.xxs,color:swatch.inkMag3}}>{conn.primaryNPCRole}{settlement?.name?` · ${settlement.name}`:''}</div>
                </div>
                <span style={{fontSize: FS['14'],color:MUTED,padding:'4px 0',flexShrink:0}}>↔</span>
                <div style={{background:swatch['#EEF0FF'],border:'1px solid #c0c8e8',borderRadius:5,padding:'5px 9px',flexShrink:0}}>
                  <div style={{fontSize:FS.xs,fontWeight:700,color:swatch.info}}>{conn.neighbourNPCName||`Contact in ${link.neighbourName}`}</div>
                  <div style={{fontSize:FS.xxs,color:swatch['#5A6A9A']}}>{conn.neighbourNPCRole?`${conn.neighbourNPCRole} · `:''}  {link.neighbourName}</div>
                </div>
              </div>
              {conn.description&&<p style={{fontSize:FS.sm,color:swatch.inkMag,lineHeight:1.5,margin:0}}>{conn.description}</p>}
            </div>
          ))}
        </div>}
        {link.tradeGoods?.length>0&&<div style={{marginTop:8}}>
          <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>Trade Goods</div>
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
            <div style={{fontSize:FS.xxs,fontWeight:800,color:_c,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>
              Known Contacts ({_isr.length})
            </div>
            {_isr.map((rx,i)=>{
              // rx.npcName is a LOCAL NPC (this settlement) -> link to its card.
              // rx.partnerName lives in the foreign settlement -> plain text.
              const _lid = localNpcId(index, rx.npcName);
              return <div key={i} style={{fontSize:FS.xs,color:swatch.inkMag2,marginBottom:4,lineHeight:1.4,paddingLeft:8,borderLeft:`2px solid ${_c}40`}}>
                <strong>{_lid ? <EntityLink id={_lid} type="npc" fallback={rx.npcName} style={{fontSize:'inherit',fontWeight:700}} /> : rx.npcName}</strong> ({rx.npcRole}) ↔ <strong style={{color:_c}}>{rx.partnerName}</strong> ({rx.partnerRole})
                {rx.description&&<div style={{fontSize:FS.xxs,color:swatch.inkMag3,marginTop:1,fontStyle:'italic'}}>{rx.description}</div>}
              </div>;
            })}
          </div> : null;
        })()}
      </div>}
    </div>
  );
}
