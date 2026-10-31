import React, { useState, useMemo } from 'react';
import { FS, MUTED, swatch } from '../../theme.js';
import { relColor } from '../../../domain/display/relationshipColors.js';
import { Section } from '../Primitives';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import Button from '../../primitives/Button.jsx';

import {NPCRelCard2, ConflictCard} from '../npcComponents';
import {NeighbourLinkCard} from '../neighbourComponents';
import { useStore } from '../../../store/index.js';
import { NEIGHBOUR_MIRROR_HEADING, neighbourMirrorLines } from '../../../domain/display/neighbourMirror.js';
import { relationshipsDeskLists } from '../../../domain/display/stateProse/relationshipsDeskRead.js'; // DS-REL-1 · the two lists, assembled ONCE

/** A tie's card palette by its type (the NPC relationship cards and the neighbour cards), hoisted
 *  from the tab (BUILD-W2-SEARCH U2, no behaviour change) so the dossier search styles a tie as
 *  this tab does. */
export const relationshipTypeStyle=(t)=>({
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

export function RelationshipsTab({ settlement:r, saveId=null, viewerIsPremium=false, playerView=false, publicDossier=false }) {
  const mobile = useIsMobile();
  const [typeFilter,setTypeFilter]=useState('all');
  const [fromFilter,setFromFilter]=useState('all');
  // ── IN-1b: THE STANDING LINE ───────────────────────────────────────────────
  // What our OWN durable record says each counterpart has been shown of us. The
  // one gate stands a layer down at the collector, so nothing here reads it:
  // dark, the read-model answers an empty list by identity and no Section
  // renders at all. The DM seam is composed HERE from props the container
  // already had (the landed RumorsTab convention), so no second premium
  // comparison is minted anywhere on this surface.
  const campaigns = useStore(s => s.campaigns);
  const savedSettlements = useStore(s => s.savedSettlements);
  const includeGroundTruth = viewerIsPremium && !playerView && !publicDossier;
  // `sid` is derived OUTSIDE the memo deliberately: it keeps `r` out of the memo
  // body entirely, so the inferred dependency is this one string rather than the
  // whole settlement object that re-allocates on unrelated state changes.
  const sid = saveId != null ? String(saveId) : (r?.id != null ? String(r.id) : '');
  // Hooks-order: this memo sits ABOVE the `!r` early return, for exactly the
  // reason recorded in the note on the memo above it.
  // A shared/public dossier carries no campaign world, and must never carry a
  // court's own ledger of its concealments even if one were reachable.
  const mirrorLines = useMemo(() => {
    const campaign = publicDossier || !sid || !Array.isArray(campaigns) ? null : campaigns.find(c => (c.settlementIds || []).map(String).includes(sid) && c.worldState?.spatialLedgers);
    const byId = new Map((savedSettlements || []).map(x => [String(x?.id ?? x?.settlement?.id ?? ''), x?.settlement?.name || x?.name || '']));
    return campaign ? neighbourMirrorLines({ worldState: campaign.worldState, settlementId: sid, counterpartIds: (campaign.settlementIds || []).map(String).filter(i => i !== sid), tick: campaign.worldState?.tick, nameFor: id => byId.get(String(id)) || String(id), includeGroundTruth }) : [];
  }, [sid, campaigns, savedSettlements, includeGroundTruth, publicDossier]);

  // ⭐ THE TWO LISTS THE DS-REL-1 DESK READS, NOW THROUGH THEIR ONE ASSEMBLER (ODQ §934.9).
  // They were three memos here — the live-conflict derivation, the typed-engagement merge
  // and the neighbour merge — and being here is precisely why the PAID PDF printed nothing
  // at `relationships.network` on a saved world: a headless builder cannot reach into a tab.
  // The assembly moved WHOLE to a sibling, unchanged line for line, and `printProse.js`
  // calls the same function. The prose on the page and the cards below it therefore cannot
  // describe two different sets — which is the property these consts were written for in the
  // first place.
  //
  // ⭐ AND THE SIBLING IS NOW A DOMAIN MODULE (ODQ §934.16): the owner ruled that a
  // domain-side reader of the relationship keys is bought with a governed register migration
  // rather than refused, so the assembler sits at
  // `domain/display/stateProse/relationshipsDeskRead.js` and this tab reads DOWN into the
  // shared layer instead of the PDF's headless builder reaching UP into this one.
  // ⚠ ONE READ LEFT WITH IT, and this list is shorter for it: the assembler no longer merges
  // `settlement.crossSettlementConflicts`. Nothing in `src/` writes that key — the generator
  // that mints those rows writes them into `interSettlementRelationships` — so the cards
  // below draw the engagements the record's own writers produced, plus the live derivation.
  // A record authored before the merge moved loses its legacy rows HERE as well as in print.
  //
  // STILL ABOVE THE `!r` EARLY RETURN, for the reason the SEAM car 3g note recorded: the
  // desk read has to be a `useMemo` (ARCH §4.1, X-F9) and a hook may not sit after an early
  // return. The assembler takes `!r` itself and answers the frozen silent lists.
  //
  // ⚠ ONE DEPENDENCY WHERE THERE WERE TWO SHAPES, and it is a stated one-time change: the
  // retired live-conflict memo carried GRANULAR deps (`r?._seed`, `r?.npcs`, …) to survive
  // `r` re-allocating on unrelated state, while both merges already depended on the whole
  // `r`. Collapsing to `[r]` therefore costs nothing on the merges and re-runs the live
  // derivation on an `r` re-allocation. That derivation is PURE and seeded off the pair's
  // stable identity, so the VALUE cannot move — only the recompute, and it early-returns
  // for free on every settlement with no live `neighborRelationship`.
  const relLists = useMemo(() => relationshipsDeskLists(r), [r]);
  const crossConflicts = relLists.crossEngagements;
  const neighbours = relLists.neighbours;
  // DS-REL-1 (`relationships.network`) is a GLANCE row by chair ruling (2026-10-30): the network
  // line paraphrased the type badge and the engagement lines were generic. The cards keep
  // every datum; the desk has no sentence on this page.

  if (!r) return null;

  const rels=(Array.isArray(r.relationships)?r.relationships:[]);
  const interSettlementRels=r.interSettlementRelationships||[];
  const conflicts=Array.isArray(r.conflicts)?r.conflicts:[];
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

  const styleFor=relationshipTypeStyle;

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

  const hasAny=neighbours.length>0||rels.length>0||conflicts.length>0;

  return (
    <div>

      {mirrorLines.length>0&&<Section title={NEIGHBOUR_MIRROR_HEADING} collapsible defaultOpen>
        {mirrorLines.map(l=><div key={l.counterpartId} style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.5,marginBottom:6}}>{l.line}{l.basis&&l.basis.length>0&&<details style={{marginTop:3}}><summary style={{cursor:'pointer',fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED}}>DM truth</summary><div style={{fontSize:proseFontSize(FS.xxs, mobile),color:MUTED,lineHeight:1.45}}>Built from {l.basis.join('; ')}.</div></details>}</div>)}
      </Section>}

      {/* Neighbour Network */}
      {neighbours.length>0&&<Section title={`Neighbour Network (${neighbours.length})`} collapsible defaultOpen>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {neighbours.map((link,i)=><NeighbourLinkCard key={link.id||i} link={link} settlement={r} styleFor={styleFor}/>)}
        </div>
      </Section>}

      {/* Inter-Settlement NPC Contacts */}
      {(()=>{const npcContacts=interSettlementRels.filter(x=>!x.type);return npcContacts.length>0&&<Section title={`Cross-Settlement Contacts (${npcContacts.length})`} collapsible defaultOpen>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {npcContacts.map((isr,i)=>{
            const c=relColor(isr.relType);
            return <div key={i} style={{border:`1px solid ${c}30`,borderLeft:`3px solid ${c}`,padding:'10px 14px',background:`${c}08`}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
                <span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{isr.npcName}</span>
                {isr.npcRole&&<span style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.inkMag3}}>({isr.npcRole})</span>}
                <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:MUTED,margin:'0 2px'}}>↔</span>
                <span style={{fontSize:FS.sm,fontWeight:700,color:c}}>{isr.partnerName}</span>
                {isr.partnerRole&&<span style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.inkMag3}}>({isr.partnerRole})</span>}
                <span style={{fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED,marginLeft:'auto',fontStyle:'italic',flexShrink:0}}>{isr.partnerSettlement}</span>
              </div>
              {isr.description&&<div style={{fontSize:proseFontSize(FS.xs,mobile),color:swatch.inkMag2,lineHeight:1.45,fontStyle:'italic'}}>{isr.description}</div>}
              <div style={{marginTop:4}}>
                <span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:c,background:`${c}18`,border:`1px solid ${c}40`,padding:'1px 8px'}}>
                  {(isr.relType||'linked').replace(/_/g,' ')}
                </span>
              </div>
            </div>;
          })}
        </div>
      </Section>;})()}

      {/* Cross-Settlement Engagements */}
      {crossConflicts.length>0&&<Section title={`Cross-Settlement Engagements (${crossConflicts.length})`} collapsible defaultOpen>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {crossConflicts.map((c,i)=>{
            const isFaction = c.type==='faction_engagement';
            // §67.2 / J-TC21-3: this table diverged from the one thirty lines above
            // it IN THE SAME FILE on four values, and the compile searched for a
            // recorded intent for the darker set and found none. It converges.
            const col = relColor(c.relType);
            return <div key={i} style={{border:`1px solid ${col}30`,borderLeft:`3px solid ${col}`,padding:'10px 14px',background:`${col}06`}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:5,flexWrap:'wrap'}}>
                {isFaction
                  ? <><span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{c.factionName}</span>
                      <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:MUTED}}>vs</span>
                      <span style={{fontSize:FS.sm,fontWeight:700,color:col}}>{c.partnerFactionName}</span>
                      <span style={{fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED,fontStyle:'italic'}}>({c.partnerSettlement})</span></>
                  : <><span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{c.npcName}</span>
                      <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:MUTED}}>({c.npcRole})</span>
                      <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:MUTED}}>vs</span>
                      <span style={{fontSize:FS.sm,fontWeight:700,color:col}}>{c.partnerName}</span>
                      <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:MUTED}}>({c.partnerRole}, {c.partnerSettlement})</span></>}
                <span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:col,background:`${col}18`,border:`1px solid ${col}40`,padding:'1px 7px',marginLeft:'auto',flexShrink:0}}>
                  {isFaction ? 'faction' : (c.conflictNature||'conflict')}
                </span>
              </div>
              {c.description&&<div style={{fontSize:proseFontSize(FS.xs,mobile),color:swatch.inkMag2,lineHeight:1.5}}>{c.description}</div>}
            </div>;
          })}
        </div>
      </Section>}

      {/* Emergent ties: the count, once (chair ruling R5). Each such card carries its own ◆ tag. */}
      {flagDriven.length>0&&<div style={{background:swatch['#F8F4FD'],border:'1px solid #d0b8e8',borderLeft:'3px solid #5a2a8a',padding:'8px 14px',marginBottom:16}}>
        <div data-testid="relationships-emergent" style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.magic,textTransform:'uppercase'}}>◆ {flagDriven.length} emergent tie{flagDriven.length>1?'s':''}</div>
      </div>}

      {/* NPC Relationships */}
      {rels.length>0&&<Section title={`NPC Relationships (${rels.length})`} collapsible defaultOpen>
        {/* Type filter */}
        <div style={{display:'flex',gap:6,marginBottom:8,flexWrap:'wrap'}}>
          {relTypes.map(({key,label})=>{
            const n=key==='all'?rels.length:rels.filter(rel=>rel.type===key).length;
            return <Button key={key} onClick={()=>setTypeFilter(key)}
              variant={typeFilter===key?'primary':'secondary'} size="sm"
              aria-pressed={typeFilter===key} style={{flexShrink:0}}>
              {label} ({n})
            </Button>;
          })}
        </div>
        {/* From filter (only when neighbours exist) */}
        {neighbours.length>0&&<div style={{display:'flex',gap:5,marginBottom:12,flexWrap:'wrap',paddingBottom:10,borderBottom:'1px solid #f0e8d8',alignItems:'center'}}>
          <span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch.inkMag3,flexShrink:0}}>From:</span>
          {['all',...allSettlements].map(name=>(
            <Button key={name} onClick={()=>setFromFilter(name)}
              variant={fromFilter===name?'primary':'secondary'} size="sm"
              aria-pressed={fromFilter===name} style={{flexShrink:0}}>
              {name==='all'?'All settlements':name}
            </Button>
          ))}
        </div>}

        {/* Relationship cards */}
        {filteredRels.map((rel,i)=><NPCRelCard2 key={`rel_${i}`} rel={rel} style={styleFor(rel.type)}/>)}
      </Section>}

      {/* GS-2 (ODQ §934.101): the "Factions" section is CUT. Its groups were tie-components
          wearing minted names; the power factions are the factions now, the NPCs tab owns
          membership, and the conflicts below name power factions directly. */}
      {/* Active Conflicts */}
      {conflicts.length>0&&<Section title={`Active Conflicts (${conflicts.length})`}>
        {conflicts.map((c,i)=><ConflictCard key={i} conflict={c}/>)}
      </Section>}

      {!hasAny&&<div style={{padding:'32px 16px',textAlign:'center',color:MUTED,fontSize:proseFontSize(FS.md,mobile)}}>
        Generate a settlement to see relationship data.
      </div>}
    </div>
  );
}

export default React.memo(RelationshipsTab);
