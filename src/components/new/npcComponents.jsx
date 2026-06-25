import { useState, useEffect, useRef } from 'react';
import { FS, MUTED, swatch } from '../theme.js';
import { catColor } from './design';
import {Ti, serif, PlotHook} from './Primitives';
import { EditableText } from '../primitives/EditableText.jsx';
import EntityLink from '../primitives/EntityLink.jsx';
import ProseParagraph from '../ProseParagraph.jsx';
import { useStore } from '../../store/index.js';
import { isEdited, getOriginalValue } from '../../domain/userEdits.js';
import { entityAnchor, entityIdFor, normalizeNpcTraits } from '../../domain/dossier/entityLinks.js';
import { factionIdFromName } from '../../lib/entities.js';

/**
 * Stable identifier used to pin an NPC. Matches the backend filter contract
 * in supabase/functions/generate-narrative/index.ts — `npc.id` when defined,
 * otherwise `npc.name`. Kept at module scope so every consumer agrees.
 */
function npcPinKey(npc) {
  if (npc?.id != null) return String(npc.id);
  if (npc?.name != null) return String(npc.name);
  return null;
}

/** Stable id used to focus an NPC. Matches the index entry id (entityIdFor). */
function npcFocusId(npc) {
  return npc ? entityIdFor('npc', npc) : null;
}

export function NPCCategoryGroup({category, label, group, impFilter, search, relationships=[], pinnedIds, onTogglePin}) {
  const [open, setOpen] = useState(true);
  // A faction group defaults open, but if a hyperlink focuses an NPC that lives
  // in a group the user manually collapsed, re-open it so the target card is
  // reachable. Additive: focus only forces open, never forces closed.
  const focusedEntity = useStore(s => s.focusedEntity);
  const color = catColor(category);
  const displayLabel = label || (category.charAt(0).toUpperCase() + category.slice(1));
  const filtered = group.filter(npc => {
    if (impFilter && impFilter !== 'all' && npc.influence !== impFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (npc.name||'').toLowerCase().includes(q) ||
             (npc.role||'').toLowerCase().includes(q) ||
             (npc.factionAffiliation||'').toLowerCase().includes(q);
    }
    return true;
  });
  // Open this group when a hyperlink focuses an NPC it contains. Keyed on the
  // focus `ts` so re-clicking the same link re-fires. Runs before the
  // empty-group early return to keep hooks order stable.
  const containsFocused = !!focusedEntity?.id
    && group.some(npc => npcFocusId(npc) === focusedEntity.id);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- force-open on hyperlink focus is the intended additive affordance; keyed on `ts` to re-fire on repeat clicks
    if (containsFocused) setOpen(true);
  }, [focusedEntity?.ts, containsFocused]);
  if (!filtered.length) return null;
  // Sort: high first, then moderate, then low, then by power
  const sorted = [...filtered].sort((a,b) => {
    const ord = {high:0,moderate:1,low:2};
    const ia = ord[a.influence]??2, ib = ord[b.influence]??2;
    if (ia !== ib) return ia - ib;
    if ((b.power||0) !== (a.power||0)) return (b.power||0) - (a.power||0);
    return (a.name||'').localeCompare(b.name||'');
  });
  return (
    <div style={{marginBottom:14}}>
      <button type="button" aria-expanded={open} onClick={()=>setOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,background:'none',border:'none',cursor:'pointer',padding:'4px 0',WebkitTapHighlightColor:'transparent',marginBottom:open?8:0}}>
        <div style={{height:1,flex:1,background:`${color}35`}}/>
        <span style={{fontSize:FS.xs,fontWeight:700,color,textTransform:'uppercase',letterSpacing:'0.07em',flexShrink:0}}>{displayLabel} ({filtered.length})</span>
        {sorted.filter(n=>n.influence==='high').length > 0 &&
          <span style={{fontSize:FS.micro,fontWeight:700,color,background:`${color}18`,borderRadius:3,padding:'0 4px',flexShrink:0}}>●●● ×{sorted.filter(n=>n.influence==='high').length}</span>
        }
        <span style={{fontSize:FS.xxs,color:MUTED,flexShrink:0}}>{open?'▲':'▼'}</span>
        <div style={{height:1,flex:1,background:`${color}35`}}/>
      </button>
      {open && sorted.map(npc => <NPCInlineCard key={npc.id||npc.name} npc={npc} relationships={relationships} pinnedIds={pinnedIds} onTogglePin={onTogglePin}/>)}
    </div>
  );
}


export function NPCRelCard2({rel, style={color:'#6b5340',bg:'#faf8f4',border:'#e0d0b0'}}) {
  const [open,setOpen]=useState(false);
  return (
    <div style={{border:`1px solid ${style.border}`,borderLeft:`3px solid ${style.color}`,borderRadius:7,overflow:'hidden',marginBottom:10}}>
      <button type="button" aria-expanded={open} aria-label={`Toggle relationship between ${rel.npc1Name} and ${rel.npc2Name}`} onClick={()=>setOpen(v=>!v)} style={{width:'100%',background:open?style.bg:'#faf8f4',border:'none',cursor:'pointer',padding:'10px 14px',textAlign:'left',WebkitTapHighlightColor:'transparent'}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:8}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:3}}>
              <span style={{...serif,fontSize:FS.lg,fontWeight:700,color:swatch.inkMag}}>{rel.npc1Name}</span>
              <span style={{fontSize:FS.micro,fontWeight:800,color:style.color,background:style.bg,border:`1px solid ${style.border}`,borderRadius:3,padding:'1px 6px',letterSpacing:'0.05em'}}>{rel.typeName||rel.type}</span>
              <span style={{...serif,fontSize:FS.lg,fontWeight:700,color:swatch.inkMag}}>{rel.npc2Name}</span>
              {rel.flagDriven&&<span style={{fontSize:FS.micro,fontWeight:700,color:swatch.magic,background:swatch['#F0EBFF'],borderRadius:3,padding:'1px 6px',textTransform:'uppercase'}}>◆ Emergent</span>}
            </div>
            <div style={{fontSize:FS.xs,color:MUTED}}>{rel.npc1Role} · {rel.strength} · {rel.npc2Role}</div>
          </div>
          <span style={{fontSize:FS.xs,color:MUTED,flexShrink:0,paddingTop:2}}>{open?'▲':'▼'}</span>
        </div>
      </button>
      {open&&<div style={{padding:'10px 14px',background:'rgba(250,248,244,0.97)',borderTop:`1px solid ${style.border}`}}>
        <p style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:'0 0 10px'}}>{rel.description}</p>
        {rel.tension&&<div style={{background:swatch['#FDF8E8'],border:'1px solid #e0c860',borderLeft:'3px solid #b8860b',borderRadius:5,padding:'7px 10px',fontSize:FS.sm,color:swatch['#5A3A10'],lineHeight:1.5}}> {rel.tension}</div>}
      </div>}
    </div>
  );
}

export function ConflictCard({conflict:c}) {
  const [_open,_setOpen]=useState(false);
  const intStyle={high:{color:'#8b1a1a',label:'HIGH TENSION'},moderate:{color:'#a0762a',label:'MODERATE TENSION'},low:{color:'#1a5a28',label:'LOW TENSION'}};
  const d=intStyle[c.intensity]||intStyle.moderate;
  return (
    <div style={{background:swatch.dangerBg,border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',borderRadius:7,padding:'12px 14px',marginBottom:10}}>
      <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:6}}>
        <span style={{fontSize:FS.micro,fontWeight:800,color:d.color,background:`${d.color}18`,borderRadius:3,padding:'1px 6px',letterSpacing:'0.05em'}}>{d.label}</span>
        <span style={{...serif,fontSize: FS['14'],fontWeight:600,color:swatch.inkMag}}>{c.parties?.[0]} vs {c.parties?.[1]}</span>
      </div>
      <p style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.5,margin:'0 0 6px'}}>{c.desc||c.description}</p>
      {c.stakes&&<div style={{fontSize:FS.xs,color:MUTED,marginBottom:8}}><strong>At stake:</strong> {c.stakes}</div>}
      {c.plotHooks?.length>0&&<div style={{borderTop:'1px solid #e8c0c0',paddingTop:8,marginTop:4}}>
        {c.plotHooks.map((h,i)=><PlotHook key={i} text={typeof h==='string'?h:h.hook||Ti(h)}/>)}
      </div>}
    </div>
  );
}


// Inline NPC card — replaces the removed NPCCard export
function NPCInlineCard({ npc, _relationships=[], pinnedIds, onTogglePin }) {
  // Manual prose editing. editMode is the global toggle on
  // the dossier header. The save/revert handlers look up the NPC's
  // index by id at edit time so the action targets the right entity
  // even if the npcs array has been re-sorted upstream.
  const editMode             = useStore(s => s.editMode);
  const applyUserEditAction  = useStore(s => s.applyUserEditAction);
  const revertUserEditAction = useStore(s => s.revertUserEditAction);
  const settlement           = useStore(s => s.settlement);
  const npcKey               = npc?.id != null ? String(npc.id) : (npc?.name != null ? String(npc.name) : null);
  const resolveNpcIndex = () => {
    if (!settlement?.npcs || !npcKey) return -1;
    return settlement.npcs.findIndex(n => {
      const k = n?.id != null ? String(n.id) : (n?.name != null ? String(n.name) : null);
      return k === npcKey;
    });
  };
  const secretIsEdited = isEdited(npc, 'secret.what');
  const secretOriginal = getOriginalValue(npc, 'secret.what');
  const onSaveSecret = (value) => {
    const idx = resolveNpcIndex();
    if (idx >= 0) applyUserEditAction('npc', idx, 'secret.what', value);
  };
  const onRevertSecret = () => {
    const idx = resolveNpcIndex();
    if (idx >= 0) revertUserEditAction('npc', idx, 'secret.what');
  };
  const [open, setOpen] = useState(false);

  // Dossier hyperlink focus. When a link navigates to THIS npc, force the card
  // open and scroll it into view. The card scrolls itself (from its own mount
  // effect) rather than relying on the navigator's timeout, so it lands even on
  // a freshly-mounted lazy tab. Focus only forces OPEN — the user's manual
  // collapse afterward still works. Keyed on focus `ts` so a repeat click of
  // the same link re-fires.
  const focusedEntity = useStore(s => s.focusedEntity);
  const cardRef = useRef(null);
  const isFocused = !!focusedEntity?.id && focusedEntity.id === npcFocusId(npc);
  useEffect(() => {
    if (!isFocused) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- force-open + scroll on hyperlink focus is the intended additive affordance; keyed on `ts` to re-fire on repeat clicks
    setOpen(true);
    cardRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
  }, [focusedEntity?.ts, isFocused]);

  const color = catColor(npc.category);
  const infDots = npc.influence==='high' ? '●●●' : npc.influence==='moderate' ? '●●' : '●';
  const infColor = npc.influence==='high' ? '#a0762a' : npc.influence==='moderate' ? '#6b5340' : '#9c8068';
  const traits = normalizeNpcTraits(npc);
  const publicTraits = traits.filter(t => t.visibility !== 'gm');

  // Pin UI is optional. When `onTogglePin` isn't provided (read-only views,
  // unsaved settlements) the icon doesn't render at all. `pinnedIds` is a Set
  // of pin keys; we compute isPinned against the same key the backend filters
  // on so the UI state can't drift from the edge function's behaviour.
  const pinKey = npcPinKey(npc);
  const pinAvailable = typeof onTogglePin === 'function' && pinKey != null;
  const isPinned = pinAvailable && pinnedIds instanceof Set && pinnedIds.has(pinKey);
  const pinColor = swatch['#6A2A9A']; // purple — ties visually to the narrative accent.

  return (
    <div ref={cardRef} id={entityAnchor('npc', npc)} style={{
      background:swatch['#FAF8F4'],
      border:`1px solid ${isPinned ? '#c8a8e8' : `${color}20`}`,
      borderLeft:`3px solid ${isPinned ? pinColor : color}`,
      borderRadius:6,marginBottom:6,overflow:'hidden',
      // Subtle tint when pinned — mirrors the narrative panel's purple wash.
      boxShadow: isPinned ? `inset 2px 0 0 rgba(106,42,154,0.08)` : 'none',
    }}>
      <button type="button" aria-expanded={open} onClick={()=>setOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 12px',background:'none',border:'none',cursor:'pointer',textAlign:'left',WebkitTapHighlightColor:'transparent'}}>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:'flex',alignItems:'baseline',gap:6,flexWrap:'wrap'}}>
            <span style={{...serif,fontSize: FS['14'],fontWeight:700,color:swatch.inkMag}}>{npc.name}</span>
            <span style={{fontSize:FS.xxs,color:MUTED}}>{npc.title}</span>
            <span style={{fontSize:FS.xs,fontWeight:700,color:infColor,marginLeft:'auto',flexShrink:0}}>{infDots}</span>
          </div>
          <div style={{fontSize:FS.xs,color:swatch.inkMag3}}>{npc.role}</div>
        </div>
        {pinAvailable && (
          <span
            role="button"
            tabIndex={0}
            aria-pressed={isPinned}
            aria-label={isPinned
              ? 'Pinned. This figure holds steady when you reforge or advance time.'
              : 'Pin this figure so a reforge or time advance leaves it unchanged.'}
            onClick={(e)=>{ e.stopPropagation(); onTogglePin(pinKey); }}
            onKeyDown={(e)=>{ if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onTogglePin(pinKey); } }}
            title={isPinned
              ? 'Pinned. This figure holds steady when you reforge or advance time.'
              : 'Pin this figure so a reforge or time advance leaves it unchanged.'}
            style={{
              display:'inline-flex',alignItems:'center',justifyContent:'center',
              width:22,height:22,flexShrink:0,
              borderRadius:4,
              background: isPinned ? 'rgba(106,42,154,0.12)' : 'transparent',
              border: `1px solid ${isPinned ? 'rgba(160,100,220,0.45)' : 'transparent'}`,
              color: isPinned ? pinColor : '#b8a898',
              cursor:'pointer',
              transition:'all 0.15s',
            }}
          >
            <span aria-hidden="true" style={{fontSize:FS.xs,fontWeight:isPinned?800:600,lineHeight:1}}>{isPinned ? '●' : '○'}</span>
          </span>
        )}
        <span style={{fontSize:FS.xxs,color:MUTED,flexShrink:0}}>{open?'▲':'▼'}</span>
      </button>
      {/* Faction affiliation — an in-dossier cross-link to the faction's Power
          card. Rendered OUTSIDE the toggle button (a link inside a button is
          invalid + would swallow the toggle). EntityLink degrades to plain text
          when the faction is absent from the index or the Power tab is gated. */}
      {npc.factionAffiliation && (
        <div style={{padding:'0 12px 6px 12px',fontSize:FS.xs,color:swatch.inkMag3,marginTop:-2}}>
          <EntityLink
            id={factionIdFromName(npc.factionAffiliation)}
            type="faction"
            fallback={npc.factionAffiliation}
          />
        </div>
      )}
      {open && (
        <div style={{padding:'0 12px 10px',borderTop:`1px solid ${color}15`}}>
          {publicTraits.length > 0 && (
            <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:6,marginTop:6}}>
              {publicTraits.map((t,i) => <span key={`${t.key}-${i}`} title={t.value} style={{fontSize:FS.xxs,color:swatch.inkMag3,background:swatch['#EDE3CC'],borderRadius:3,padding:'0 5px'}}>{t.label}: {t.value}</span>)}
            </div>
          )}
          {(npc.corrupt || npc.ousted) && (
            <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',margin:'6px 0',fontSize:FS.xs}}>
              {npc.corrupt ? (
                <span style={{
                  fontWeight:800,letterSpacing:'0.04em',textTransform:'uppercase',color:swatch.danger,
                  background:'rgba(139,26,26,0.12)',border:'1px solid rgba(139,26,26,0.4)',borderRadius:4,padding:'1px 6px',
                }}>Compromised</span>
              ) : (
                <span style={{
                  fontWeight:800,letterSpacing:'0.04em',textTransform:'uppercase',color:swatch.inkMag3,
                  background:'rgba(120,90,40,0.12)',border:'1px solid rgba(120,90,40,0.4)',borderRadius:4,padding:'1px 6px',
                }}>Exposed</span>
              )}
              {npc.corrupt && npc.corruptTies?.criminalInstitution && (
                <span style={{color:swatch.inkMag3,fontStyle:'italic'}}>tied to {npc.corruptTies.criminalInstitution}</span>
              )}
            </div>
          )}
          {npc.replacedNpc && (
            <div style={{margin:'6px 0',fontSize:FS.xs,color:swatch.inkMag3,fontStyle:'italic'}}>
              Newly installed. Replaced {npc.replacedNpc} after a corruption scandal.
            </div>
          )}
          {npc.goal?.short && (
            <p style={{fontSize:FS.sm,color:swatch.inkMag2,margin:'4px 0',lineHeight:1.4}}>
              <span style={{color:swatch['#A0762A'],fontWeight:700}}>→ </span><ProseParagraph text={npc.goal.short} />
            </p>
          )}
          {npc.structuralPosition && (
            <p style={{fontSize:FS.xs,color:swatch.inkMag3,margin:'4px 0',lineHeight:1.4,fontStyle:'italic'}}>{npc.structuralPosition}</p>
          )}
          {npc.activeConstraint && (
            <p style={{fontSize:FS.xs,color:swatch.danger,margin:'4px 0',lineHeight:1.4}}>
              <span style={{fontWeight:700}}>Constraint: </span>{npc.activeConstraint}
            </p>
          )}
          {(npc.secret || editMode) && (
            <div style={{marginTop:6,background:swatch['#F5F0E8'],borderRadius:4,padding:'5px 8px'}}>
              <span style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3}}>Secret: </span>
              <EditableText
                value={typeof npc.secret === 'string' ? npc.secret : (npc.secret?.what || '')}
                originalValue={secretOriginal}
                isEdited={secretIsEdited}
                editMode={editMode}
                onSave={onSaveSecret}
                onRevert={onRevertSecret}
                placeholder="Add a secret…"
                ariaLabel={`Secret for ${npc.name}`}
                textStyle={{fontSize:FS.xs,color:'#3d2b1a'}}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
