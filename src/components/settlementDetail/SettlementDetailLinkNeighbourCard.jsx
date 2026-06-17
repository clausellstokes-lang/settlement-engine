import { useState } from 'react';
import { Link2 } from 'lucide-react';
import { RELATIONSHIP_SELECTIONS } from '../../domain/relationships/canonicalRelationship.js';
import { INK, MUTED, SECOND, BORDER, CARD, sans, FS, swatch } from '../theme';
import Button from '../primitives/Button.jsx';

export default function LinkNeighbourCard({currentSave, allSaves, onLink}){
  const[selected,setSelected]=useState(null);
  const[relType,setRelType]=useState('neutral');
  const others=allSaves.filter(s=>{
    if(s.id===currentSave?.saveData?.id) return false;
    if(currentSave?.settlement?.neighbourNetwork?.some(n=>n.id===s.id||n.name===s.name)) return false;
    return true;
  });
  if(!others.length) return<div style={{padding:'12px 14px',fontSize:FS.sm,color:MUTED,background:swatch['#F7F0E4'],borderRadius:8,border:`1px solid ${BORDER}`}}>No other saved settlements to link.</div>;
  return<div style={{background:swatch.infoBg,border:'1px solid #c0c8e8',borderRadius:8,padding:'12px 14px'}}>
    <div style={{fontSize:FS.xs,fontWeight:700,color:swatch.info,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
      <Link2 size={12}/> Link as Neighbour
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:8}}>
      {others.map(s=><button type="button" key={s.id} aria-pressed={selected?.id===s.id} onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:5,border:`1px solid ${selected?.id===s.id?'#2a3a7a':BORDER}`,background:selected?.id===s.id?'#e8eeff':CARD,cursor:'pointer',textAlign:'left',fontFamily:sans}}>
        <span style={{flex:1,fontSize:FS.sm,fontWeight:600,color:INK}}>{s.name}</span>
        <span style={{fontSize:FS.xxs,color:MUTED}}>{s.tier}</span>
      </button>)}
    </div>
    {selected&&<div style={{padding:'8px 10px',background:swatch['#E8EEFF'],borderRadius:5,border:'1px solid #c0c8e8',display:'flex',flexDirection:'column',gap:8}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:FS.sm,flex:1,color:swatch.info,fontWeight:600}}>Link: {selected.name}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
        <span style={{fontSize:FS.xs,color:SECOND}}>Relationship:</span>
        <select value={relType} onChange={e=>setRelType(e.target.value)} style={{fontSize:FS.xs,padding:'2px 6px',borderRadius:4,border:`1px solid ${BORDER}`,background:CARD,color:INK,fontFamily:sans,cursor:'pointer'}}>
          {RELATIONSHIP_SELECTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      <div style={{display:'flex',gap:8}}>
        <Button variant="info" size="sm" onClick={()=>onLink(selected,relType)}>Confirm</Button>
        <Button variant="secondary" size="sm" onClick={()=>setSelected(null)}>Cancel</Button>
      </div>
    </div>}
  </div>;
}
