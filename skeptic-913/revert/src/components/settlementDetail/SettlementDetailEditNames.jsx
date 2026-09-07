import { BORDER_STRONG, INK, MUTED, BODY, CARD, sans, serif_, FS } from '../theme';
import Button from '../primitives/Button.jsx';
import { nameOf } from '../../domain/rulingPower.js';

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
  // Owner queue #14. This section used to iterate `settlement.factions` ONLY —
  // the NPC-grouping mirror, which is empty on every generated settlement — so
  // the Factions rows rendered blank and the door did not exist. Prefer the
  // CANONICAL powerStructure roster, reading its label through nameOf so the
  // `.faction` / `.name` precedence can never be hand-rolled here.
  const powerFactions = settlement?.powerStructure?.factions || [];
  const factionRows = (powerFactions.length
    ? powerFactions.map((fac, fi) => ({
        key: `power-${fi}`,
        name: nameOf(fac),
        label: fac?.category || 'power faction',
      }))
    : (settlement?.factions || []).map((fac, fi) => ({
        key: `group-${fi}`,
        name: fac?.name,
        label: fac?.dominantCategory && fac.dominantCategory !== 'other'
          ? fac.dominantCategory
          : fac?.powerFactionName || fac?.powerFactionCat || 'mixed',
      }))
  ).filter(row => row.name);
  return (
      settlement&&<div style={{overflow:'hidden'}}>
        {/* A routine collapsible rename utility doesn't earn a permanent full
            card border: the header tint carries the affordance, and the open
            body attaches by spacing rather than a borderTop false-floor. */}
        <Button variant="secondary" fullWidth
          onClick={()=>{setEditNamesOpen(v=>!v);setEditingName(null);setEditDraft('');}}
          aria-expanded={editNamesOpen} aria-pressed={editNamesOpen}
          style={{justifyContent:'flex-start',gap:8,padding:'10px 14px',
            background:editNamesOpen?'#f5ede0':CARD,border:'none',boxShadow:'none',fontWeight:600,textAlign:'left'}}>
          <span style={{fontFamily:serif_,fontSize:FS.md,fontWeight:600,color:INK,flex:1}}>
            Edit Names
          </span>
          <span style={{fontSize:FS.xxs,color:MUTED}}>NPC &amp; faction names only</span>
          <span style={{fontSize:FS.xs,color:MUTED,marginLeft:4}}>{editNamesOpen?'▲':'▼'}</span>
        </Button>
        {editNamesOpen&&<div style={{padding:'10px 14px',background:CARD}}>
        {isCanonLocked ? (
          <div style={{fontSize:FS.xs,color:BODY,fontStyle:'italic',lineHeight:1.6}}>
            NPC and faction names are locked once this settlement is canonized.
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
                  {/* The role is load-bearing DATA — it tells the GM WHICH NPC
                      they're renaming — so it reads at BODY (AA), not chrome
                      MUTED (P7). */}
                  <span style={{fontSize:FS.xs,color:BODY,minWidth:130,flexShrink:0}}>
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
                        style={{flex:1,fontSize:FS.sm,minHeight:40,padding:'8px 10px',border:`1px solid ${BORDER_STRONG}`,
                          fontFamily:sans,color:INK}}
                      />
                      <Button variant="primary" size="md" onClick={()=>handleApplyRename('npc',npc.id,npc.name,editDraft)}>
                        Save
                      </Button>
                      <Button variant="secondary" size="md" onClick={()=>{setEditingName(null);setEditDraft('');}}>
                        Cancel
                      </Button></>
                    : <><span style={{fontSize:FS.sm,fontWeight:600,color:INK,flex:1}}>{npc.name}</span>
                      <Button variant="ghost" size="md" onClick={()=>{setEditingName({type:'npc',id:npc.id,oldName:npc.name});setEditDraft(npc.name);}}>
                        Rename
                      </Button></>}
                </div>;
              })}
            </div>
          </>}

          {/* Factions */}
          {factionRows.length>0&&<>
            <div style={{fontSize:FS.xxs,fontWeight:800,color:MUTED,textTransform:'uppercase',
              letterSpacing:'0.06em',marginBottom:6}}>Factions</div>
            <div style={{display:'flex',flexDirection:'column',gap:4}}>
              {factionRows.map(row=>{
                const isEditing = editingName?.type==='faction' && editingName?.id===row.name;
                return <div key={row.key} style={{display:'flex',alignItems:'center',gap:8}}>
                  {/* The faction category is load-bearing DATA (which faction is
                      being renamed), so it reads at BODY (AA), not MUTED (P7). */}
                  <span style={{fontSize:FS.xs,color:BODY,minWidth:130,flexShrink:0}}>
                    {row.label}
                  </span>
                  {isEditing
                    ? <><input
                        // eslint-disable-next-line jsx-a11y/no-autofocus -- focus the inline rename field the user just opened
                        autoFocus
                        aria-label={`Rename faction ${row.name}`}
                        value={editDraft}
                        onChange={e=>setEditDraft(e.target.value)}
                        onKeyDown={e=>{
                          if(e.key==='Enter') handleApplyRename('faction',row.name,row.name,editDraft);
                          if(e.key==='Escape'){setEditingName(null);setEditDraft('');}
                        }}
                        style={{flex:1,fontSize:FS.sm,minHeight:40,padding:'8px 10px',border:`1px solid ${BORDER_STRONG}`,
                          fontFamily:sans,color:INK}}
                      />
                      <Button variant="primary" size="md" onClick={()=>handleApplyRename('faction',row.name,row.name,editDraft)}>
                        Save
                      </Button>
                      <Button variant="secondary" size="md" onClick={()=>{setEditingName(null);setEditDraft('');}}>
                        Cancel
                      </Button></>
                    : <><span style={{fontSize:FS.sm,fontWeight:600,color:INK,flex:1}}>{row.name}</span>
                      <Button variant="ghost" size="md" onClick={()=>{setEditingName({type:'faction',id:row.name,oldName:row.name});setEditDraft(row.name);}}>
                        Rename
                      </Button></>}
                </div>;
              })}
            </div>
          </>}

          {/* Empty state: when there are no named NPCs or factions to rename,
              the opened panel would otherwise show only the disclaimer below and
              read as broken. Explain why it's empty. */}
          {(settlement.npcs||[]).length===0 && factionRows.length===0 && (
            <div style={{fontSize:FS.xs,color:BODY,lineHeight:1.5}}>
              This settlement has no named NPCs or factions to rename yet.
            </div>
          )}

          <p style={{fontSize:FS.xs,color:BODY,margin:'10px 0 0',fontStyle:'italic',lineHeight:1.5}}>
            Renaming updates this settlement's JSON export and any linked neighbour references.
            Press Enter or click Save to confirm. Escape to cancel.
          </p>
        </>
        )}
        </div>}
      </div>
  );
}
