import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { FS, swatch, MUTED } from '../../theme.js';
import { serif, Collapsible, Empty } from '../Primitives';
import {relStyle} from '../tabConstants';

import {NPCCategoryGroup, NPCRelCard2} from '../npcComponents';

import {NarrativeNote} from '../NarrativeNote';
import Button from '../../primitives/Button.jsx';
import IconButton from '../../primitives/IconButton.jsx';
import LockControls from '../../dossier/LockControls.jsx';

export function NPCsTab({
  npcs,
  onRerollNPCs,
  settlement,
  narrativeNote,
  pinnedIds,
  onTogglePin,
  canAuthorNpc = false,
}) {
  const [search, setSearch] = useState('');
  const [impFilter, setImpFilter] = useState('all');
  const pinnedCount = pinnedIds instanceof Set ? pinnedIds.size : 0;

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
          <span style={{...serif,fontSize:FS.xl,fontWeight:600,color:swatch.inkMag}}>{npcs.length} Key Figures</span>
          <span style={{fontSize:FS.xs,color:MUTED,marginLeft:8}}>
            {highCount>0&&`${highCount} high influence · `}{modCount>0&&`${modCount} moderate`}
          </span>
        </div>
        {pinnedCount > 0 && (
          <span
            title="Pinned NPCs are protected from AI rewrites. Their goal and secret won't be rewritten."
            style={{fontSize:FS.xxs,fontWeight:800,color:swatch.ai,background:swatch['#F0EBFF'],border:'1px solid #c8a8e8',padding:'2px 10px',letterSpacing:'0.04em',flexShrink:0,cursor:'help'}}>
            ⚲ {pinnedCount} PINNED
          </span>
        )}
        {/* The Reroll button now lives INSIDE LockControls: a locked roster must
            never render an armed Reroll, and the only way to guarantee that is to
            let the lock own the button. Per-CHARACTER locks are supported by the
            engine (domain/locksPreservation.js reads an id array under the same
            key) but have no per-row control yet — deliberately deferred so the
            roster row does not grow a second toggle next to Pin, which makes a
            DIFFERENT promise (pinning guards prose from the AI, not from dice). */}
        <LockControls scope="npcs" onReroll={onRerollNPCs} style={{flexShrink:0}} />
      </div>

      {/* ── SEARCH + FILTER ─────────────────────────────────────────────── */}
      <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
        <div style={{position:'relative',flex:1,minWidth:140}}>
          <span style={{position:'absolute',left:9,top:'50%',transform:'translateY(-50%)',display:'inline-flex',color:MUTED,pointerEvents:'none'}}><Search size={14}/></span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            aria-label="Filter by name, role, or faction"
            placeholder="Filter by name, role, or faction…"
            style={{width:'100%',padding:'7px 28px 7px 28px',border:'1px solid #c8b89a',fontSize:FS.sm,fontFamily:'Nunito,sans-serif',color:swatch.inkMag,background:swatch['#FAF8F4'],boxSizing:'border-box'}}/>
          {search&&<span style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',display:'inline-flex'}}><IconButton Icon={X} label="Clear filter" onClick={()=>setSearch('')} tone="ghost" size="sm" /></span>}
        </div>
        {[
          {key:'all',   label:'All'},
          {key:'high',  label:'●●● High'},
          {key:'moderate', label:'●● Moderate'},
          {key:'low',   label:'● Low'},
        ].map(f=>(
          <Button key={f.key} onClick={()=>setImpFilter(f.key)}
            variant={impFilter===f.key?'primary':'secondary'} size="sm"
            aria-pressed={impFilter===f.key} style={{flexShrink:0}}>
            {f.label}
          </Button>
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
          relationships={settlement?.relationships || []}
          pinnedIds={pinnedIds}
          onTogglePin={onTogglePin}
          canAuthorNpc={canAuthorNpc}
        />
      ))}

      <p style={{fontSize:FS.xs,color:MUTED,marginTop:8,fontStyle:'italic',textAlign:'right'}}>
        {npcs.length} figures · tap any card to expand
      </p>
    
      {/* NPC Relationships */}
      {(settlement?.relationships?.length > 0) && (
        <Collapsible title={`NPC Relationships (${settlement.relationships.length})`} defaultOpen={false}>
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

export default React.memo(NPCsTab);
