import { GOLD, INK, MUTED, BORDER, CARD, sans, serif_, FS } from '../theme';
import Button from '../primitives/Button.jsx';

// ── Edit Names ───────────────────────────────────────────────────────────────
// Inline rename affordance for NPC & faction names. Presentational: all state
// (editingName / editDraft / editNamesOpen) and the rename handler are owned by
// the parent SettlementDetail and threaded in via props.
export default function SettlementDetailEditNames({
  settlement,
  editNamesOpen, setEditNamesOpen,
  editingName, setEditingName,
  editDraft, setEditDraft,
  isCanonLocked,
  handleApplyRename,
}) {
  return (
      settlement&&<div style={{marginBottom:14,border:`1px solid ${BORDER}`,borderRadius:8,overflow:'hidden'}}>
        <Button variant="secondary" fullWidth
          onClick={()=>{setEditNamesOpen(v=>!v);setEditingName(null);setEditDraft('');}}
          aria-expanded={editNamesOpen} aria-pressed={editNamesOpen}
          style={{justifyContent:'flex-start',gap:8,padding:'10px 14px',borderRadius:0,
            background:editNamesOpen?'#f5ede0':CARD,border:'none',boxShadow:'none',fontWeight:600,textAlign:'left'}}>
          <span style={{fontFamily:serif_,fontSize:FS.md,fontWeight:600,color:INK,flex:1}}>
            Edit Names
          </span>
          <span style={{fontSize:FS.xxs,color:MUTED}}>NPC &amp; faction names only</span>
          <span style={{fontSize:FS.xs,color:MUTED,marginLeft:4}}>{editNamesOpen?'▲':'▼'}</span>
        </Button>
        {editNamesOpen&&<div style={{padding:'10px 14px',background:CARD,borderTop:`1px solid ${BORDER}`}}>
        {isCanonLocked ? (
          <div style={{fontSize:FS.xs,color:MUTED,fontStyle:'italic',lineHeight:1.6}}>
            🔒 NPC and faction names are locked once this settlement is canonized.
            Reset it to draft (Phase badge above) if you need to rename them.
          </div>
        ) : (<>

          {/* NPCs */}
          {(settlement.npcs||[]).length>0&&<>
            <div style={{fontSize:FS.xxs,fontWeight:800,color:MUTED,textTransform:'uppercase',
              letterSpacing:'0.06em',marginBottom:6}}>NPCs</div>
            <div style={{display:'flex',flexDirection:'column',gap:4,marginBottom:12}}>
              {(settlement.npcs||[]).map(npc=>{
                const isEditing = editingName?.type==='npc' && editingName?.id===npc.id;
                return <div key={npc.id} style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:FS.xs,color:MUTED,minWidth:130,flexShrink:0}}>
                    {npc.role}
                  </span>
                  {isEditing
                    ? <><input
                        // eslint-disable-next-line jsx-a11y/no-autofocus -- focus the inline rename field the user just opened
                        autoFocus
                        aria-label={`Rename NPC ${npc.name}`}
                        value={editDraft}
                        onChange={e=>setEditDraft(e.target.value)}
                        onKeyDown={e=>{
                          if(e.key==='Enter') handleApplyRename('npc',npc.id,npc.name,editDraft);
                          if(e.key==='Escape'){setEditingName(null);setEditDraft('');}
                        }}
                        style={{flex:1,fontSize:FS.sm,padding:'3px 7px',border:`1px solid ${GOLD}`,
                          borderRadius:4,fontFamily:sans,color:INK}}
                      />
                      <Button variant="primary" size="sm" onClick={()=>handleApplyRename('npc',npc.id,npc.name,editDraft)}>
                        Save
                      </Button>
                      <Button variant="secondary" size="sm" onClick={()=>{setEditingName(null);setEditDraft('');}}>
                        Cancel
                      </Button></>
                    : <><span style={{fontSize:FS.sm,fontWeight:600,color:INK,flex:1}}>{npc.name}</span>
                      <Button variant="info" size="sm" onClick={()=>{setEditingName({type:'npc',id:npc.id,oldName:npc.name});setEditDraft(npc.name);}}>
                        Rename
                      </Button></>}
                </div>;
              })}
            </div>
          </>}

          {/* Factions */}
          {(settlement.factions||[]).length>0&&<>
            <div style={{fontSize:FS.xxs,fontWeight:800,color:MUTED,textTransform:'uppercase',
              letterSpacing:'0.06em',marginBottom:6}}>Factions</div>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              {(settlement.factions||[]).map((fac,fi)=>{
                const isEditing = editingName?.type==='faction' && editingName?.id===fac.name;
                return <div key={fi} style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:FS.xs,color:MUTED,minWidth:130,flexShrink:0}}>
                    {fac.dominantCategory&&fac.dominantCategory!=='other'
                      ? fac.dominantCategory
                      : fac.powerFactionName||fac.powerFactionCat||'mixed'}
                  </span>
                  {isEditing
                    ? <><input
                        // eslint-disable-next-line jsx-a11y/no-autofocus -- focus the inline rename field the user just opened
                        autoFocus
                        aria-label={`Rename faction ${fac.name}`}
                        value={editDraft}
                        onChange={e=>setEditDraft(e.target.value)}
                        onKeyDown={e=>{
                          if(e.key==='Enter') handleApplyRename('faction',fac.name,fac.name,editDraft);
                          if(e.key==='Escape'){setEditingName(null);setEditDraft('');}
                        }}
                        style={{flex:1,fontSize:FS.sm,padding:'3px 7px',border:`1px solid ${GOLD}`,
                          borderRadius:4,fontFamily:sans,color:INK}}
                      />
                      <Button variant="primary" size="sm" onClick={()=>handleApplyRename('faction',fac.name,fac.name,editDraft)}>
                        Save
                      </Button>
                      <Button variant="secondary" size="sm" onClick={()=>{setEditingName(null);setEditDraft('');}}>
                        Cancel
                      </Button></>
                    : <><span style={{fontSize:FS.sm,fontWeight:600,color:INK,flex:1}}>{fac.name}</span>
                      <Button variant="info" size="sm" onClick={()=>{setEditingName({type:'faction',id:fac.name,oldName:fac.name});setEditDraft(fac.name);}}>
                        Rename
                      </Button></>}
                </div>;
              })}
            </div>
          </>}

          <p style={{fontSize:FS.xxs,color:MUTED,margin:'10px 0 0',fontStyle:'italic',lineHeight:1.5}}>
            Renaming updates this settlement's JSON export and any linked neighbour references.
            Press Enter or click Save to confirm. Escape to cancel.
          </p>
        </>
        )}
        </div>}
      </div>
  );
}
