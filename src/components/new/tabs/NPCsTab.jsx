import React, { useState } from 'react';
import {C} from '../design';
import {serif, sans, Collapsible, Empty} from '../Primitives';
import {relStyle} from '../tabConstants';
import {isMobile} from '../tabConstants';

import {NPCCategoryGroup, NPCRelCard2} from '../npcComponents';

import {NarrativeNote} from '../NarrativeNote';

export function NPCsTab({npcs, onRerollNPCs, settlement, narrativeNote}) {
  const [search, setSearch] = useState('');
  const [impFilter, setImpFilter] = useState('all');
  const mobile = isMobile();

  if (!npcs?.length) return <Empty message="No NPCs generated. Generate a settlement to see key figures."/>;

  const highCount = npcs.filter(n=>n.influence==='high').length;
  const modCount  = npcs.filter(n=>n.influence==='moderate').length;

  // Group by power faction name (factionAffiliation), ordered by faction power rank
  const powerFactions = settlement?.powerStructure?.factions || [];
  const factionOrder  = powerFactions.map(f => f.faction);
  // Map faction name → its category (for color coding)
  const factionCategory = {};
  powerFactions.forEach(f => { factionCategory[f.faction] = f.category || 'other'; });

  const byFaction = {};
  npcs.forEach(n => {
    const key = n.factionAffiliation || 'Unaffiliated';
    (byFaction[key] = byFaction[key] || []).push(n);
  });

  // Sort faction groups: power-ranked factions first, then unaffiliated
  const presentFactions = Object.keys(byFaction).sort((a, b) => {
    const ia = factionOrder.indexOf(a);
    const ib = factionOrder.indexOf(b);
    if (a === 'Unaffiliated') return 1;
    if (b === 'Unaffiliated') return -1;
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const q = search.trim().toLowerCase();

  return (
    <div>
      <NarrativeNote note={narrativeNote} />
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14,flexWrap:'wrap'}}>
        <div style={{flex:1}}>
          <span style={{...serif,fontSize:17,fontWeight:600,color:'#1c1409'}}>{npcs.length} Key Figures</span>
          <span style={{fontSize:11,color:'#9c8068',marginLeft:8}}>
            {highCount>0&&`${highCount} high influence · `}{modCount>0&&`${modCount} moderate`}
          </span>
        </div>
        {onRerollNPCs&&<button onClick={onRerollNPCs} style={{fontSize:11,fontWeight:700,color:'#a0762a',background:'#f7f0e4',border:'1px solid #c8b89a',borderRadius:5,padding:'5px 12px',cursor:'pointer',flexShrink:0}}>↺ Reroll</button>}
      </div>

      {/* ── SEARCH + FILTER ─────────────────────────────────────────────── */}
      <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
        <div style={{position:'relative',flex:1,minWidth:140}}>
          <span style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',color:'#9c8068',fontSize:13}}></span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Filter by name, role, or faction…"
            style={{width:'100%',padding:'7px 28px 7px 28px',border:'1px solid #c8b89a',borderRadius:5,fontSize:12,fontFamily:'Nunito,sans-serif',color:'#1c1409',background:'rgba(250,248,244,0.97)',boxSizing:'border-box'}}/>
          {search&&<button onClick={()=>setSearch('')} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#9c8068',padding:0,lineHeight:1}}>×</button>}
        </div>
        {[
          {key:'all',   label:'All'},
          {key:'high',  label:'●●● High'},
          {key:'moderate', label:'●● Moderate'},
          {key:'low',   label:'● Low'},
        ].map(f=>(
          <button key={f.key} onClick={()=>setImpFilter(f.key)}
            style={{padding:'6px 11px',borderRadius:5,border:'1px solid',fontSize:11,fontWeight:impFilter===f.key?700:500,cursor:'pointer',flexShrink:0,
              background:impFilter===f.key?'#1c1409':'#f7f0e4',
              color:impFilter===f.key?'#c49a3c':'#6b5340',
              borderColor:impFilter===f.key?'#1c1409':'#c8b89a'}}>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── NPC GROUPS by power faction ────────────────────────────────── */}
      {presentFactions.map(factionName => (
        <NPCCategoryGroup
          key={factionName}
          category={factionCategory[factionName] || 'other'}
          label={factionName}
          group={byFaction[factionName]}
          impFilter={impFilter}
          search={q}
          relationships={settlement?.relationships||[]}
        />
      ))}

      <p style={{fontSize:11,color:'#9c8068',marginTop:8,fontStyle:'italic',textAlign:'right'}}>
        {npcs.length} figures · tap any card to expand
      </p>
    
      {/* NPC Relationships */}
      {(settlement?.relationships?.length > 0) && (
        <Collapsible title={` NPC Relationships (${settlement.relationships.length})`} defaultOpen={false}>
          <div style={{display:'flex',flexDirection:'column',gap:8,padding:'4px 0'}}>
            {(settlement?.relationships||[]).filter(r=>r.flagDriven).slice(0,6).map((r,i)=>(
              <NPCRelCard2 key={i} rel={r} style={relStyle(r.type)}/>
            ))}
            {(settlement?.relationships||[]).filter(r=>!r.flagDriven).slice(0,8).map((r,i)=>(
              <NPCRelCard2 key={i} rel={r} style={relStyle(r.type)}/>
            ))}
          </div>
        </Collapsible>
      )}
</div>
  );
}

export default NPCsTab;
