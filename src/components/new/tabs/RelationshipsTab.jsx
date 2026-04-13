import React, { useState, useMemo } from 'react';
import {generateCrossSettlementConflicts} from '../../../generators/crossSettlementConflicts';
import {C} from '../design';
import {serif, Section} from '../Primitives';

import {NPCRelCard2, ConflictCard} from '../npcComponents';
import {NeighbourLinkCard} from '../neighbourComponents';

export function RelationshipsTab({ settlement:r, neighboursOnly=false }) {
  const [typeFilter,setTypeFilter]=useState('all');
  const [fromFilter,setFromFilter]=useState('all');
  if (!r) return null;

  const rels=(Array.isArray(r.relationships)?r.relationships:[]);
  const interSettlementRels=r.interSettlementRelationships||[];
  // Conflicts: from saved links + live-generated for unsaved settlements
  const liveConflicts = useMemo(() => {
    const nr = r.neighborRelationship;
    if (!nr?.name) return [];
    try {
      const relType = nr.relationshipType || 'neutral';
      const settA = { name: r.name||'', npcs: r.npcs||[], factions: r.factions||[] };
      const settB = { name: nr.name, npcs: nr.npcs||[], factions: nr.factions||[] };
      const { forA } = generateCrossSettlementConflicts(settA, settB, relType, 'live');
      return forA;
    } catch(e) { return []; }
  }, [r.name, r.neighborRelationship?.name]);

  // Only typed entries (conflict / faction_engagement) — not raw NPC contacts (which have no type)
  const crossConflictsRaw = [
    ...(r.interSettlementRelationships||[]).filter(x=>x.type==='conflict'||x.type==='faction_engagement'),
    ...(r.crossSettlementConflicts||[]).filter(x=>x.type==='conflict'||x.type==='faction_engagement'),
    ...liveConflicts.filter(x=>x.type==='conflict'||x.type==='faction_engagement'),
  ];
  const seen = new Set();
  const crossConflicts = crossConflictsRaw.filter(x => {
    const key = x.description?.slice(0,40)||x.conflictNature||'';
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const conflicts=Array.isArray(r.conflicts)?r.conflicts:[];
  const factionGroups=Array.isArray(r.factions)?r.factions:[];
  // Use unified neighbourNetwork array (generator's neighborRelationship is migrated to this at save time)
  // Also include live generator output neighborRelationship for unsaved settlements
  const _liveNR = r.neighborRelationship;
  const _net    = r.neighbourNetwork || [];
  const _liveEntry = _liveNR?.name && !_net.some(n => n.name === _liveNR.name)
    ? [{
        id:               `live_${_liveNR.name}`,
        name:             _liveNR.name,
        neighbourName:    _liveNR.name,
        neighbourTier:    _liveNR.tier || '',
        relationshipType: _liveNR.relationshipType || 'neutral',
        description:      `Generated with ${_liveNR.name} as neighbour (${(_liveNR.relationshipType||'neutral').replace(/_/g,' ')}).`,
        fromGeneration:   true,
      }]
    : [];
  const neighbours = [..._net, ..._liveEntry];
  const flagDriven=rels.filter(rel=>rel.flagDriven);

  // Settlement names for "From" filter
  const settlementName=r.name||'';
  const neighbourNames=neighbours.map(n=>n.neighbourName).filter(Boolean);
  const allSettlements=[settlementName,...neighbourNames];

  const relTypes=[
    {key:'all',label:'All'},
    {key:'ally',label:'Allies'},
    {key:'rival',label:'Rivals'},
    {key:'enemy',label:'Enemies'},
    {key:'debtor_creditor',label:'Leverage'},
    {key:'patron_client',label:'Patronage'},
  ];

  const styleFor=(t)=>({
    ally:{color:'#1a5a28',bg:'#f0faf2',border:'#a8d8b0'},
    rival:{color:'#8b1a1a',bg:'#fdf4f4',border:'#e8c0c0'},
    enemy:{color:'#5a0a0a',bg:'#fdf0f0',border:'#e0a0a0'},
    patron_client:{color:'#a0762a',bg:'#faf8e4',border:'#e0d090'},
    political:{color:'#2a3a7a',bg:'#f0f4ff',border:'#a8b8e8'},
    respect:{color:'#1a4a6a',bg:'#f0f8ff',border:'#a8c8e8'},
    debtor_creditor:{color:'#5a2a8a',bg:'#f8f4fd',border:'#d0b8e8'},
    mentor_student:{color:'#2a5a2a',bg:'#f4faf4',border:'#b0d8b0'},
    family:{color:'#6a3a1a',bg:'#faf4ee',border:'#d8b898'},
  }[t]||{color:'#1a4a6a',bg:'#f0f8ff',border:'#a8c8e8'});

  // Build NPC → settlement map
  const npcSettlement={};
  (r.npcs||[]).forEach(n=>{npcSettlement[n.name]=settlementName;});
  neighbours.forEach(nb=>{(nb.npcConnections||[]).forEach(c=>{
    if(c.primaryNPCName) npcSettlement[c.primaryNPCName]=settlementName;
    if(c.neighbourNPCName) npcSettlement[c.neighbourNPCName]=nb.neighbourName;
  });});

  const filteredRels=rels.filter(rel=>{
    const typeOk=typeFilter==='all'||rel.type===typeFilter;
    const fromOk=fromFilter==='all'||(npcSettlement[rel.npc1Name]===fromFilter||npcSettlement[rel.npc2Name]===fromFilter);
    return typeOk&&fromOk;
  });

  // Cross-settlement NPC connections
  const crossConns=fromFilter==='all'
    ?neighbours.flatMap(n=>(n.npcConnections||[]).map(c=>({...c,_neighbourName:n.neighbourName})))
    :neighbours.filter(n=>n.neighbourName===fromFilter).flatMap(n=>(n.npcConnections||[]).map(c=>({...c,_neighbourName:n.neighbourName})));

  const hasAny=neighbours.length>0||rels.length>0||factionGroups.length>0||conflicts.length>0;

  return (
    <div>

      {/* Neighbour Network */}
      {neighbours.length>0&&<Section title={`Neighbour Network (${neighbours.length})`} collapsible defaultOpen>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {neighbours.map((link,i)=><NeighbourLinkCard key={link.id||i} link={link} settlement={r} styleFor={styleFor}/>)}
        </div>
      </Section>}

      {/* Inter-Settlement NPC Contacts */}
      {(()=>{const npcContacts=interSettlementRels.filter(x=>!x.type);return npcContacts.length>0&&<Section title={`Cross-Settlement Contacts (${npcContacts.length})`} collapsible defaultOpen>
        <p style={{fontSize:11,color:'#9c8068',margin:'0 0 10px',fontStyle:'italic'}}>
          Named NPCs with documented ties to figures in linked settlements. Links are removed when neighbours are delinked.
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {npcContacts.map((isr,i)=>{
            const relColors={trade_partner:'#1a5a28',allied:'#1a3a7a',patron:'#4a1a6a',client:'#6a3a1a',rival:'#8a5010',cold_war:'#8a3010',hostile:'#8b1a1a',neutral:'#6b5340'};
            const c=relColors[isr.relType]||'#6b5340';
            return <div key={i} style={{border:`1px solid ${c}30`,borderLeft:`3px solid ${c}`,borderRadius:7,padding:'10px 14px',background:`${c}08`}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                <span style={{fontSize:12,fontWeight:700,color:'#1c1409'}}>{isr.npcName}</span>
                {isr.npcRole&&<span style={{fontSize:11,color:'#6b5340'}}>({isr.npcRole})</span>}
                <span style={{fontSize:11,color:'#9c8068',margin:'0 2px'}}>↔</span>
                <span style={{fontSize:12,fontWeight:700,color:c}}>{isr.partnerName}</span>
                {isr.partnerRole&&<span style={{fontSize:11,color:'#6b5340'}}>({isr.partnerRole})</span>}
                <span style={{fontSize:10,color:'#9c8068',marginLeft:'auto',fontStyle:'italic',flexShrink:0}}>{isr.partnerSettlement}</span>
              </div>
              {isr.description&&<div style={{fontSize:11,color:'#3d2b1a',lineHeight:1.45,fontStyle:'italic'}}>{isr.description}</div>}
              <div style={{marginTop:4}}>
                <span style={{fontSize:10,fontWeight:700,color:c,background:`${c}18`,border:`1px solid ${c}40`,borderRadius:10,padding:'1px 8px'}}>
                  {(isr.relType||'linked').replace(/_/g,' ')}
                </span>
              </div>
            </div>;
          })}
        </div>
      </Section>;})()}

      {/* Cross-Settlement Engagements */}
      {crossConflicts.length>0&&<Section title={`Cross-Settlement Engagements (${crossConflicts.length})`} collapsible defaultOpen>
        <p style={{fontSize:11,color:'#9c8068',margin:'0 0 10px',fontStyle:'italic'}}>
          Conflicts and faction engagements between this settlement and its neighbours. Removed when the link is broken.
        </p>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {crossConflicts.map((c,i)=>{
            const isFaction = c.type==='faction_engagement';
            const relColors={trade_partner:'#a0762a',allied:'#1a3a7a',patron:'#4a1a6a',client:'#6a3a1a',rival:'#8b1a1a',cold_war:'#5a1a1a',hostile:'#8b0000',neutral:'#6b5340'};
            const col = relColors[c.relType]||'#6b5340';
            return <div key={i} style={{border:`1px solid ${col}30`,borderLeft:`3px solid ${col}`,borderRadius:7,padding:'10px 14px',background:`${col}06`}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5,flexWrap:'wrap'}}>
                {isFaction
                  ? <><span style={{fontSize:12,fontWeight:700,color:'#1c1409'}}>{c.factionName}</span>
                      <span style={{fontSize:11,color:'#9c8068'}}>vs</span>
                      <span style={{fontSize:12,fontWeight:700,color:col}}>{c.partnerFactionName}</span>
                      <span style={{fontSize:10,color:'#9c8068',fontStyle:'italic'}}>({c.partnerSettlement})</span></>
                  : <><span style={{fontSize:12,fontWeight:700,color:'#1c1409'}}>{c.npcName}</span>
                      <span style={{fontSize:11,color:'#9c8068'}}>({c.npcRole})</span>
                      <span style={{fontSize:11,color:'#9c8068'}}>vs</span>
                      <span style={{fontSize:12,fontWeight:700,color:col}}>{c.partnerName}</span>
                      <span style={{fontSize:11,color:'#9c8068'}}>({c.partnerRole}, {c.partnerSettlement})</span></>}
                <span style={{fontSize:10,fontWeight:700,color:col,background:`${col}18`,border:`1px solid ${col}40`,borderRadius:8,padding:'1px 7px',marginLeft:'auto',flexShrink:0}}>
                  {isFaction ? 'faction' : (c.conflictNature||'conflict')}
                </span>
              </div>
              {c.description&&<div style={{fontSize:11,color:'#3d2b1a',lineHeight:1.5}}>{c.description}</div>}
            </div>;
          })}
        </div>
      </Section>}

      {/* Emergent conditions banner */}
      {!neighboursOnly&&<>
      {flagDriven.length>0&&<div style={{background:'#f8f4fd',border:'1px solid #d0b8e8',borderLeft:'3px solid #5a2a8a',borderRadius:7,padding:'10px 14px',marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,color:'#5a2a8a',marginBottom:4}}>◆ EMERGENT CONDITIONS ACTIVE</div>
        <p style={{fontSize:12,color:'#3d2b1a',margin:0,lineHeight:1.5}}>
          {flagDriven.length} relationship{flagDriven.length>1?'s':''} shaped by the settlement's compound dynamics — these would not exist under neutral slider conditions.
        </p>
      </div>}

      {/* NPC Relationships */}
      {rels.length>0&&<Section title={`NPC Relationships (${rels.length})`} collapsible defaultOpen>
        <p style={{fontSize:11,color:'#9c8068',margin:'0 0 10px',fontStyle:'italic'}}>
          Internal relationships within {settlementName}. Cross-settlement NPC ties appear in each neighbour card above.
        </p>
        {/* Type filter */}
        <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap'}}>
          {relTypes.map(({key,label})=>{
            const n=key==='all'?rels.length:rels.filter(rel=>rel.type===key).length;
            return <button key={key} onClick={()=>setTypeFilter(key)} style={{padding:'4px 11px',borderRadius:20,border:'1px solid',fontSize:11,fontWeight:700,cursor:'pointer',background:typeFilter===key?'#1c1409':'#faf8f4',color:typeFilter===key?'#f5efe0':'#6b5340',borderColor:typeFilter===key?'#1c1409':'#c8b89a'}}>
              {label} ({n})
            </button>;
          })}
        </div>
        {/* From filter (only when neighbours exist) */}
        {neighbours.length>0&&<div style={{display:'flex',gap:5,marginBottom:12,flexWrap:'wrap',paddingBottom:10,borderBottom:'1px solid #f0e8d8',alignItems:'center'}}>
          <span style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.05em',flexShrink:0}}>From:</span>
          {['all',...allSettlements].map(name=>(
            <button key={name} onClick={()=>setFromFilter(name)} style={{padding:'3px 9px',borderRadius:20,border:'1px solid',fontSize:11,fontWeight:600,cursor:'pointer',background:fromFilter===name?'#2a3a7a':'#faf8f4',color:fromFilter===name?'#fff':'#3a4a7a',borderColor:fromFilter===name?'#2a3a7a':'#c0c8e8'}}>
              {name==='all'?'All settlements':name}
            </button>
          ))}
        </div>}

        {/* Relationship cards */}
        {filteredRels.map((rel,i)=><NPCRelCard2 key={`rel_${i}`} rel={rel} style={styleFor(rel.type)}/>)}
        {/* Cross-settlement connections */}
        {crossConns.map((conn,i)=>(
          <div key={`conn_${i}`} style={{border:'1px solid #c0c8e8',borderLeft:'3px solid #2a3a7a',borderRadius:7,padding:'10px 14px',marginBottom:10,background:'#f8f9ff'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
              <span style={{fontSize:12,fontWeight:700,color:'#1c1409'}}>{conn.primaryNPCName}</span>
              {conn.primaryNPCRole&&<span style={{fontSize:11,color:'#6b5340'}}>({conn.primaryNPCRole})</span>}
              <span style={{fontSize:11,color:'#9c8068',margin:'0 4px'}}>↔</span>
              <span style={{fontSize:12,fontWeight:700,color:'#2a3a7a'}}>{conn.neighbourNPCName||'Unknown'}</span>
              {conn.neighbourNPCRole&&<span style={{fontSize:11,color:'#6b5340'}}>({conn.neighbourNPCRole})</span>}
              {conn._neighbourName&&fromFilter==='all'&&<span style={{fontSize:10,color:'#9c8068',marginLeft:'auto',fontStyle:'italic'}}>{conn._neighbourName}</span>}
            </div>
            {conn.description&&<div style={{fontSize:12,color:'#3d2b1a',lineHeight:1.45}}>{conn.description}</div>}
          </div>
        ))}
      </Section>}

      {/* Faction Groups */}
      {factionGroups.length>0&&<Section title={`Factions (${factionGroups.length})`}>
        {factionGroups.map((fac,i)=>{
          const catColors={economy:'#a0762a',government:'#2a3a7a',military:'#8b1a1a',religious:'#1a4a2a',magic:'#3a1a7a',criminal:'#4a1a4a',other:'#5a4a2a'};
          const c=catColors[fac.dominantCategory]||'#6b5340';
          return <div key={i} style={{background:'#faf8f4',border:'1px solid #e0d0b0',borderLeft:`3px solid ${c}`,borderRadius:7,padding:'10px 14px',marginBottom:10}}>
            <div style={{...serif,fontSize:15,fontWeight:700,color:'#1c1409',marginBottom:6}}>{fac.name}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
              {(fac.members||[]).map(m=>(
                <span key={m.id||m.name} style={{fontSize:11,color:c,background:`${c}18`,border:`1px solid ${c}40`,borderRadius:10,padding:'2px 9px'}}>
                  {m.name} <span style={{color:'#9c8068'}}>({m.role})</span>
                </span>
              ))}
            </div>
          </div>;
        })}
      </Section>}

      {/* Active Conflicts */}
      {conflicts.length>0&&<Section title={`Active Conflicts (${conflicts.length})`}>
        {conflicts.map((c,i)=><ConflictCard key={i} conflict={c}/>)}
      </Section>}

      </>
      }{!hasAny&&<div style={{padding:'32px 16px',textAlign:'center',color:'#9c8068',fontSize:13}}>
        Generate a settlement to see relationship data.
      </div>}
    </div>
  );
}

export default RelationshipsTab;
