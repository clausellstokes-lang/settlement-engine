import { useState } from 'react';
import { RELATIONSHIP_SELECTIONS, relationshipDefinition, directionalRelationshipLabel } from '../../domain/relationships/canonicalRelationship.js';
import { INK, BODY, SECOND, BORDER, CARD, sans, FS, swatch } from '../theme';
import Button from '../primitives/Button.jsx';

export default function LinkNeighbourCard({currentSave, allSaves, onLink}){
  const[selected,setSelected]=useState(null);
  const[relType,setRelType]=useState('neutral');
  const others=allSaves.filter(s=>{
    if(s.id===currentSave?.saveData?.id) return false;
    if(currentSave?.settlement?.neighbourNetwork?.some(n=>n.id===s.id||n.name===s.name)) return false;
    return true;
  });
  // Empty state — flattened to the host card's body (no nested border/radius)
  // and given a path forward instead of a flat dead-end (P10): links connect two
  // saved settlements, so the next action is to save/generate another.
  if(!others.length) return<div style={{padding:'4px 2px',display:'flex',flexDirection:'column',gap:8}}>
    <div style={{fontSize:FS.sm,color:BODY,lineHeight:1.5}}>
      A link connects this settlement to another one in your library. You have no other saved settlements yet — save or generate one, then come back to link them.
    </div>
  </div>;
  // Flattened root: no border/radius (the host Link-Neighbour collapsible already
  // provides the one elevation level). Tint + padding alone read this as the
  // host card's body rather than a card-within-a-card (P5).
  return<div style={{background:swatch.infoBg,borderRadius:8,padding:'4px 2px'}}>
    <div style={{fontSize:FS.xs,fontWeight:700,color:swatch.info,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
      Link as Neighbour
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:8}}>
      {others.map(s=>{
        const isSel=selected?.id===s.id;
        return<button type="button" key={s.id} aria-pressed={isSel} onClick={()=>setSelected(isSel?null:s)} style={{display:'flex',alignItems:'center',gap:8,minHeight:40,padding:'8px 10px',borderRadius:5,border:`1px solid ${isSel?'#2a3a7a':BORDER}`,borderLeftWidth:isSel?4:1,background:isSel?'#e8eeff':CARD,cursor:'pointer',textAlign:'left',fontFamily:sans}}>
          {/* Selected state in two visible channels (P7): the blue tint/border AND
              a leading check glyph + bolder name, so selection survives a
              grayscale/squint test, not just the aria-pressed announcement. */}
          {isSel
            ? <span style={{width:13,flexShrink:0,color:swatch.info,fontWeight:800,lineHeight:1}} aria-hidden="true">{'✓'}</span>
            : <span style={{width:13,flexShrink:0}} aria-hidden="true"/>}
          <span style={{flex:1,fontSize:FS.sm,fontWeight:isSel?800:600,color:INK}}>{s.name}</span>
          {/* Tier is the only fact distinguishing one pick from another — it is
              load-bearing DATA, so it reads at BODY (AA) not chrome MUTED (P7). */}
          <span style={{fontSize:FS.xxs,color:BODY}}>{s.tier}</span>
        </button>;
      })}
    </div>
    {/* Active-selection confirm block. Flattened to one elevation: the inner
        bordered+tinted card is gone (it nested a card inside the already-bordered
        Link-as-Neighbour card). A larger top gap + a light tint alone carry the
        "now configuring this selection" grouping. */}
    {selected&&<div style={{marginTop:6,padding:'8px 10px',background:swatch['#E8EEFF'],borderRadius:5,display:'flex',flexDirection:'column',gap:8}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:FS.sm,flex:1,color:swatch.info,fontWeight:600}}>Link: {selected.name}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
        <span style={{fontSize:FS.xs,color:SECOND}}>Relationship:</span>
        <select aria-label="Relationship" value={relType} onChange={e=>setRelType(e.target.value)} style={{fontSize:FS.sm,minHeight:40,padding:'8px 10px',borderRadius:4,border:`1px solid ${BORDER}`,background:CARD,color:INK,fontFamily:sans,cursor:'pointer'}}>
          {RELATIONSHIP_SELECTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      {/* Directional preview: for the asymmetric pairs (overlord/vassal,
          patron/client) state WHICH SIDE this settlement is, naming the
          neighbour, off the canonical sourceRole. Symmetric picks show nothing
          (the label already reads correctly without a direction). */}
      {(() => {
        const def = relationshipDefinition(relType, currentSave?.saveData?.id || 'home', selected.id);
        const phrase = directionalRelationshipLabel({ localRelationshipRole: def.sourceRole }, selected.name);
        return phrase
          ? <div style={{fontSize:FS.xs,color:SECOND}}>This settlement will be: <span style={{fontWeight:700,color:INK}}>{phrase}</span></div>
          : null;
      })()}
      {/* Set the realm expectation: a link between two members of the same campaign
          now surfaces in the realm graph automatically (no manual Discover); a link
          to a settlement outside the campaign stays a dossier-local relationship. */}
      <div style={{fontSize:FS.xxs,color:SECOND,lineHeight:1.4}}>
        If both settlements share a campaign, this link appears in the realm graph automatically. Otherwise it stays on the dossier.
      </div>
      <div style={{display:'flex',gap:8}}>
        <Button variant="primary" size="sm" onClick={()=>onLink(selected,relType)}>Confirm</Button>
        <Button variant="secondary" size="sm" onClick={()=>setSelected(null)}>Cancel</Button>
      </div>
    </div>}
  </div>;
}
