import React, { useState, useEffect, useRef } from 'react';
import {Download, Link2, X, Clock} from 'lucide-react';

import {generateCrossSettlementConflicts} from '../generators/crossSettlementConflicts';
import {GOLD, INK, MUTED, SECOND, BORDER, CARD, sans, serif_} from './theme.js';
import { useStore } from '../store/index.js';
import { saves as savesService } from '../lib/saves.js';
import SettlementDetail from './SettlementDetail';
import OutputContainer from './OutputContainer';

// ── Error boundary for settlement detail view ────────────────────────────────
class DetailErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(err) { return { error: err }; }
  componentDidCatch(err) { console.warn('Detail view error:', err.message); }
  render() {
    if (this.state.error) {
      return <div style={{padding:'20px 14px',background:'#fdf4f4',border:'1px solid #e8c0c0',
        borderRadius:8,color:'#8b1a1a',fontSize:12,lineHeight:1.6}}>
        <strong>Could not render full output</strong> — this save may be from an older version.
        <br/>Use "Apply Saved Configuration & Regenerate" to create a fresh output.
        <div style={{marginTop:6,fontSize:11,color:'#c05a5a'}}>{String(this.state.error.message).slice(0,120)}</div>
      </div>;
    }
    return this.props.children;
  }
}

function downloadJSON(saveEntry){
  const data=JSON.stringify(saveEntry.settlement,null,2);
  const url=URL.createObjectURL(new Blob([data],{type:'application/json'}));
  const a=Object.assign(document.createElement('a'),{href:url,download:`${(saveEntry.name||'settlement').replace(/\s+/g,'_')}.json`});
  document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(url);a.remove();},1000);
}

// ix — link neighbour sub-component
const REL_TYPES=['neutral','trade_partner','allied','rival','cold_war','patron','client','criminal_network'];
function LinkNeighbourCard({currentSave, allSaves, onLink}){
  const[selected,setSelected]=useState(null);
  const[relType,setRelType]=useState('neutral');
  const others=allSaves.filter(s=>{
    if(s.id===currentSave?.saveData?.id) return false;
    if(currentSave?.settlement?.neighbourNetwork?.some(n=>n.id===s.id||n.name===s.name)) return false;
    return true;
  });
  if(!others.length) return<div style={{padding:'12px 14px',fontSize:12,color:MUTED,background:'#f7f0e4',borderRadius:8,border:`1px solid ${BORDER}`}}>No other saved settlements to link.</div>;
  return<div style={{background:'#f0f4ff',border:'1px solid #c0c8e8',borderRadius:8,padding:'12px 14px'}}>
    <div style={{fontSize:11,fontWeight:700,color:'#2a3a7a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8,display:'flex',alignItems:'center',gap:6}}>
      <Link2 size={12}/> Link as Neighbour
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:6,marginBottom:8}}>
      {others.map(s=><button key={s.id} onClick={()=>setSelected(selected?.id===s.id?null:s)} style={{display:'flex',alignItems:'center',gap:8,padding:'7px 10px',borderRadius:5,border:`1px solid ${selected?.id===s.id?'#2a3a7a':BORDER}`,background:selected?.id===s.id?'#e8eeff':CARD,cursor:'pointer',textAlign:'left',fontFamily:sans}}>
        <span style={{flex:1,fontSize:12,fontWeight:600,color:INK}}>{s.name}</span>
        <span style={{fontSize:10,color:MUTED}}>{s.tier}</span>
      </button>)}
    </div>
    {selected&&<div style={{padding:'8px 10px',background:'#e8eeff',borderRadius:5,border:'1px solid #c0c8e8',display:'flex',flexDirection:'column',gap:8}}>
      <div style={{display:'flex',alignItems:'center',gap:8}}>
        <span style={{fontSize:12,flex:1,color:'#2a3a7a',fontWeight:600}}>Link: {selected.name}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
        <span style={{fontSize:11,color:SECOND}}>Relationship:</span>
        <select value={relType} onChange={e=>setRelType(e.target.value)} style={{fontSize:11,padding:'2px 6px',borderRadius:4,border:`1px solid ${BORDER}`,background:CARD,color:INK,fontFamily:sans,cursor:'pointer'}}>
          {REL_TYPES.map(r=><option key={r} value={r}>{r.replace(/_/g,' ')}</option>)}
        </select>
      </div>
      <div style={{display:'flex',gap:8}}>
        <button onClick={()=>onLink(selected,relType)} style={{padding:'4px 12px',borderRadius:4,background:'#2a3a7a',color:'#fff',border:'none',cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:sans}}>Confirm</button>
        <button onClick={()=>setSelected(null)} style={{padding:'4px 10px',borderRadius:4,background:CARD,color:SECOND,border:`1px solid ${BORDER}`,cursor:'pointer',fontSize:11,fontFamily:sans}}>Cancel</button>
      </div>
    </div>}
  </div>;
}

// ── Save migration ─────────────────────────────────────────────────────────
// Upgrades old save format to current schema. Safe to call on any save.
function migrateConfig(config) {
  if (!config) return {};
  const c = { ...config };
  // Add magicExists if missing (infer from priorityMagic)
  if (c.magicExists === undefined) {
    c.magicExists = (c.priorityMagic ?? 50) > 0;
  }
  // Ensure nearbyResourcesState exists
  if (!c.nearbyResourcesState) c.nearbyResourcesState = {};
  return c;
}

// ── NPC pairing categories by relationship type ───────────────────────────────
const NPC_PAIR_CATS = {
  trade_partner:['economy'],
  allied:       ['economy','military'],
  patron:       ['military','economy'],
  client:       ['economy'],
  rival:        ['economy','military'],
  cold_war:     ['military','criminal'],
  hostile:      ['military'],
  neutral:      ['economy'],
};

const CONTACT_DESC = {
  trade_partner:(a,ar,b,br,bs)=>`${a} (${ar}) maintains trade connections with ${b} (${br}) in ${bs}.`,
  allied:       (a,ar,b,br,bs)=>`${a} (${ar}) coordinates with ${b} (${br}) of ${bs} on matters of mutual defense and policy.`,
  patron:       (a,ar,b,br,bs)=>`${a} (${ar}) reports to ${b} (${br}) of ${bs}, who exercises oversight authority.`,
  client:       (a,ar,b,br,bs)=>`${a} (${ar}) supplies goods and services to ${b} (${br}) in ${bs}.`,
  rival:        (a,ar,b,br,bs)=>`${a} (${ar}) and ${b} (${br}) of ${bs} are known adversaries competing for the same interests.`,
  cold_war:     (a,ar,b,br,bs)=>`${a} (${ar}) runs quiet intelligence operations against ${b} (${br}) of ${bs}, officially unacknowledged.`,
  hostile:      (a,ar,b,br,bs)=>`${a} (${ar}) and ${b} (${br}) of ${bs} are active enemies.`,
  neutral:      (a,ar,b,br,bs)=>`${a} (${ar}) has occasional dealings with ${b} (${br}) in ${bs}.`,
};

// Build paired inter-settlement NPC relationships between two settlements
function buildInterSettlementNPCs(settlementA, settlementB, relType, linkId) {
  const cats = NPC_PAIR_CATS[relType] || ['economy'];
  const descFn = CONTACT_DESC[relType] || CONTACT_DESC.neutral;
  let npcsA = (settlementA.npcs||[]).filter(n => cats.includes((n.category||'').toLowerCase()));
  let npcsB = (settlementB.npcs||[]).filter(n => cats.includes((n.category||'').toLowerCase()));

  // Fallback: if preferred categories yield nothing, use any available NPC
  if (!npcsA.length) npcsA = (settlementA.npcs||[]).slice(0, 3);
  if (!npcsB.length) npcsB = (settlementB.npcs||[]).slice(0, 3);
  if (!npcsA.length || !npcsB.length) return { forA:[], forB:[] };

  const pairs = [];
  const maxPairs = Math.min(npcsA.length, npcsB.length, 2);
  const usedB = new Set();
  for (let i = 0; i < maxPairs; i++) {
    const a = npcsA[i];
    const b = npcsB.find(n => !usedB.has(n.id) && n.category === a.category)
           || npcsB.find(n => !usedB.has(n.id));
    if (!b) break;
    usedB.add(b.id);
    pairs.push({ a, b });
  }

  const forA = pairs.map(({a,b}) => ({
    linkId,
    npcId:        a.id,
    npcName:      a.name,
    npcRole:      a.role,
    partnerName:  b.name,
    partnerRole:  b.role,
    partnerSettlement: settlementB.name,
    relType,
    description: descFn(a.name, a.role, b.name, b.role, settlementB.name),
  }));
  const forB = pairs.map(({a,b}) => ({
    linkId,
    npcId:        b.id,
    npcName:      b.name,
    npcRole:      b.role,
    partnerName:  a.name,
    partnerRole:  a.role,
    partnerSettlement: settlementA.name,
    relType,
    description: descFn(b.name, b.role, a.name, a.role, settlementA.name),
  }));

  return { forA, forB };
}

// Find a save entry by settlement name
function findSaveByName(saves, name) {
  return saves.find(s => s.name === name || s.settlement?.name === name) || null;
}

// Find a save entry by id
function findSaveById(saves, id) {
  return saves.find(s => s.id === id) || null;
}

const REL_COLORS={rival:'#8b1a1a',cold_war:'#8b1a1a',allied:'#1a5a28',secret_alliance:'#1a5a28',trade_partner:'#a0762a',patron:'#2a3a7a',client:'#2a3a7a',criminal_network:'#5a2a8a'};

export default function SettlementsPanel({ onNavigate }){
  const settlement = useStore(s => s.settlement);
  const config = useStore(s => s.config);
  const institutionToggles = useStore(s => s.institutionToggles);
  const categoryToggles = useStore(s => s.categoryToggles);
  const goodsToggles = useStore(s => s.goodsToggles);
  const servicesToggles = useStore(s => s.servicesToggles);
  const updateConfig = useStore(s => s.updateConfig);
  const setInstitutionToggles = useStore(s => s.setInstitutionToggles);
  const setCategoryToggles = useStore(s => s.setCategoryToggles);
  const setGoodsToggles = useStore(s => s.setGoodsToggles);
  const setServiceToggles = useStore(s => s.setServiceToggles);
  const setSettlement = useStore(s => s.setSettlement);
  const setLoadedFromSave = useStore(s => s.setLoadedFromSave);
  const maxSaves = useStore(s => s.maxSaves());
  const canSave = useStore(s => s.canSave());

  const onLoad = (data) => {
    if (data.config) updateConfig(migrateConfig(data.config));
    if (data.institutionToggles) setInstitutionToggles(data.institutionToggles);
    if (data.categoryToggles) setCategoryToggles(data.categoryToggles);
    if (data.goodsToggles) setGoodsToggles(data.goodsToggles);
    if (data.servicesToggles) setServiceToggles(data.servicesToggles);
    if (data.settlement) {
      setSettlement(data.settlement);
      setLoadedFromSave({ name: data.settlement.name, tier: data.settlement.tier });
    }
    onNavigate?.('generate');
  };
  const [saves,setSaves]=useState([]);
  const [savesLoading,setSavesLoading]=useState(true);
  const [saved,setSaved]=useState(false);
  const [deleteId,setDeleteId]=useState(null);
  const [detail,setDetail]=useState(null);
  const [linking,setLinking]=useState(false);
  const [networkVersion,setNetworkVersion]=useState(0);
  const [importError,setImportError]=useState(null);
  const [importPending,setImportPending]=useState(null);
  const fileRef=useRef();
  const [editNamesOpen, setEditNamesOpen] = useState(false);
  const [editingName, setEditingName] = useState(null); // {type:'npc'|'faction', id, oldName}
  const [editDraft, setEditDraft] = useState('');

  useEffect(()=>{
    savesService.list()
      .then(loaded => { setSaves(loaded); setSavesLoading(false); })
      .catch(e => { console.error('Failed to load saves:', e); setSavesLoading(false); });
  },[]);

  // Persist helper: writes full array in local mode, individual updates in Supabase mode
  const persistBatch = async (updatedSaves, modifiedIds) => {
    try {
      if (savesService.writeAll) {
        await savesService.writeAll(updatedSaves);
      } else {
        for (const id of modifiedIds) {
          const s = updatedSaves.find(x => x.id === id);
          if (s) await savesService.update(id, { settlement: s.settlement });
        }
      }
    } catch (e) { console.error('Persist failed:', e); }
  };

  // ── Rename NPC or faction — cascades to partner saves ────────────────────
  const applyRename = (type, id, oldName, newName) => {
    if (!newName.trim() || newName.trim() === oldName) {
      setEditingName(null); setEditDraft(''); return;
    }
    const trimmed = newName.trim();
    const saveId  = detail?.saveData?.id;

    // Update the save entry deeply
    let updatedSaves = saves.map(s => {
      if (s.id !== saveId) {
        // Partner saves: update partnerName in interSettlementRelationships
        const needsUpdate = (s.settlement?.interSettlementRelationships||[]).some(
          r => r.partnerSettlement === detail.settlement.name &&
               (r.partnerName === oldName || r.npcName === oldName ||
                r.partnerFactionName === oldName || r.factionName === oldName)
        );
        if (!needsUpdate) return s;
        return {
          ...s,
          settlement: {
            ...s.settlement,
            interSettlementRelationships: (s.settlement.interSettlementRelationships||[]).map(r => {
              if (r.partnerSettlement !== detail.settlement.name) return r;
              return {
                ...r,
                partnerName:        r.partnerName === oldName        ? trimmed : r.partnerName,
                partnerFactionName: r.partnerFactionName === oldName ? trimmed : r.partnerFactionName,
                npcName:            r.npcName === oldName            ? trimmed : r.npcName,
                factionName:        r.factionName === oldName        ? trimmed : r.factionName,
              };
            }),
          },
        };
      }

      // This settlement's save: update the actual NPC/faction name + relationships
      const settlement = s.settlement;
      const updatedNpcs = type === 'npc'
        ? (settlement.npcs||[]).map(n => n.id === id ? {...n, name:trimmed} : n)
        : settlement.npcs;
      const updatedFactions = type === 'faction'
        ? (settlement.factions||[]).map(f => f.name === oldName ? {...f, name:trimmed} : f)
        : settlement.factions;

      // Update relationship strings that reference the old name
      const updatedRels = (settlement.relationships||[]).map(r => ({
        ...r,
        npc1Name: r.npc1Name === oldName ? trimmed : r.npc1Name,
        npc2Name: r.npc2Name === oldName ? trimmed : r.npc2Name,
      }));

      // Update inter-settlement relationships
      const updatedISR = (settlement.interSettlementRelationships||[]).map(r => ({
        ...r,
        npcName:            r.npcName === oldName            ? trimmed : r.npcName,
        partnerName:        r.partnerName === oldName        ? trimmed : r.partnerName,
        factionName:        r.factionName === oldName        ? trimmed : r.factionName,
        partnerFactionName: r.partnerFactionName === oldName ? trimmed : r.partnerFactionName,
      }));

      const updatedSettlement = {
        ...settlement,
        npcs:                        updatedNpcs,
        factions:                    updatedFactions,
        relationships:               updatedRels,
        interSettlementRelationships: updatedISR,
      };
      return { ...s, settlement: updatedSettlement };
    });

    setSaves(updatedSaves);
    const modifiedIds = updatedSaves.filter((s, i) => s !== saves[i]).map(s => s.id);
    persistBatch(updatedSaves, modifiedIds);
    // Update detail in memory
    const updatedDetailSave = updatedSaves.find(s => s.id === saveId);
    if (updatedDetailSave) {
      setDetail(d => ({ ...d, ...updatedDetailSave, saveData: updatedDetailSave }));
    }
    setEditingName(null);
    setEditDraft('');
  };

  // Duplicate detection: same name + same tier + same institution count
  const isDuplicate = settlement && saves.some(s =>
    s.name === settlement.name &&
    s.tier === settlement.tier &&
    (s.settlement?.institutions||[]).length === (settlement.institutions||[]).length
  );

  const saveCurrentSettlement=async()=>{
    if(!settlement||!canSave) return;
    const saveId = Date.now();
    const newEntry = {
      id: saveId,
      name: settlement.name,
      tier: settlement.tier,
      timestamp: new Date().toISOString(),
      settlement,
      config,
      institutionToggles,
      categoryToggles,
      goodsToggles: goodsToggles||{},
      servicesToggles: servicesToggles||{},
    };

    // ── Migrate neighborRelationship → neighbourNetwork ─────────────────────
    // Unify the two systems: generator creates neighborRelationship (singular),
    // manual links use neighbourNetwork (array). Always use the array.
    const nr_raw = newEntry.settlement.neighborRelationship;
    if (nr_raw?.name) {
      const existingNet = newEntry.settlement.neighbourNetwork || [];
      const alreadyLinked = existingNet.some(n => n.name === nr_raw.name);
      if (!alreadyLinked) {
        const migratedEntry = {
          id:               `generated_${nr_raw.name.replace(/\s+/g,'_')}`,
          name:             nr_raw.name,
          neighbourName:    nr_raw.name,
          neighbourTier:    nr_raw.tier || '',
          tier:             nr_raw.tier || '',
          relationshipType: nr_raw.relationshipType || 'neutral',
          description:      `Generated as ${(nr_raw.relationshipType||'neutral').replace(/_/g,' ')} of this settlement.`,
          fromGeneration:   true,
        };
        newEntry.settlement = {
          ...newEntry.settlement,
          neighbourNetwork: [migratedEntry, ...existingNet],
        };
      }
    }

    let currentSaves = [...saves];

    // ── Bidirectional neighbour linking ─────────────────────────────────────
    // If this settlement was generated with a neighbour, find that save and
    // create cross-links in both directions.
    const nr = settlement.neighborRelationship;
    if (nr?.name) {
      const relType    = nr.relationshipType || 'neutral';
      const partnerSave = findSaveByName(currentSaves, nr.name);

      if (partnerSave) {
        const linkId = `link_${saveId}_${partnerSave.id}`;

        // A→B entry on the new settlement
        const entryForA = {
          id:               partnerSave.id,
          linkId,
          name:             partnerSave.name,
          neighbourName:    partnerSave.name,
          neighbourTier:    partnerSave.tier,
          tier:             partnerSave.tier,
          relationshipType: relType,
          description:      `Generated as ${relType.replace(/_/g,' ')} of ${partnerSave.name}.`,
          bidirectional:    true,
        };

        // B→A entry on the partner settlement
        const entryForB = {
          id:               saveId,
          linkId,
          name:             newEntry.name,
          neighbourName:    newEntry.name,
          neighbourTier:    newEntry.tier,
          tier:             newEntry.tier,
          relationshipType: relType,
          description:      `${newEntry.name} was generated as ${relType.replace(/_/g,' ')} of this settlement.`,
          bidirectional:    true,
        };

        // Build inter-settlement NPC relationships and conflicts
        const { forA: npcForA, forB: npcForB } = buildInterSettlementNPCs(settlement, partnerSave.settlement, relType, linkId);
        const { forA: conflictForA, forB: conflictForB } = generateCrossSettlementConflicts(settlement, partnerSave.settlement, relType, linkId);
        const forA = [...npcForA, ...conflictForA];
        const forB = [...npcForB, ...conflictForB];

        // Add to new entry's settlement
        newEntry.settlement = {
          ...newEntry.settlement,
          neighbourNetwork: [
            entryForA,
            ...(newEntry.settlement.neighbourNetwork||[]).filter(n=>n.name!==partnerSave.name),
          ],
          interSettlementRelationships: [
            ...(newEntry.settlement.interSettlementRelationships||[]),
            ...forA,
          ],
        };

        // Update partner save bidirectionally
        currentSaves = currentSaves.map(s => {
          if (s.id !== partnerSave.id) return s;
          return {
            ...s,
            settlement: {
              ...s.settlement,
              neighbourNetwork: [
                entryForB,
                ...(s.settlement?.neighbourNetwork||[]).filter(n=>n.id!==saveId),
              ],
              interSettlementRelationships: [
                ...(s.settlement?.interSettlementRelationships||[]).filter(r=>r.linkId!==linkId),
                ...forB,
              ],
            },
          };
        });
      }
    }

    const effectiveMax = maxSaves || 30;
    const newSaves = [newEntry, ...currentSaves].slice(0, effectiveMax);
    setSaves(newSaves); setSaved(true); setTimeout(()=>setSaved(false),2000);

    // Persist: save new entry + update any modified partner
    try {
      await savesService.save(newEntry);
      // If a partner was modified (bidirectional link), update it
      const partnerSave = settlement.neighborRelationship?.name
        ? currentSaves.find(s => s !== saves.find(x => x.id === s.id))
        : null;
      if (partnerSave) {
        await savesService.update(partnerSave.id, { settlement: partnerSave.settlement });
      }
    } catch (e) { console.error('Save failed:', e); }
  };

  const handleFileImport=e=>{
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=ev=>{
      try{
        const parsed=JSON.parse(ev.target.result);
        const s=parsed.settlement||parsed;
        if(!s?.name||!s?.tier){setImportError('This file does not look like a valid settlement JSON.');return;}
        setImportError(null);
        setImportPending({name:s.name,settlement:s});
      }catch{setImportError('Could not read this file. Make sure it is a valid JSON file exported from this generator.');}
    };
    reader.readAsText(file);
    e.target.value='';
  };

  const deleteConfirmed=id=>{
    // Find the save being deleted to clean up its neighbour links
    const deletedSave = saves.find(s => s.id === id);
    const deletedNet  = deletedSave?.settlement?.neighbourNetwork || [];

    // Bidirectional cleanup: remove reverse links from all partner saves
    let updated = saves.filter(s => s.id !== id).map(s => {
      const wasLinked = deletedNet.some(n => n.id === s.id || n.linkId);
      if (!wasLinked) return s;

      // Remove any neighbour entries pointing back to deleted settlement
      const cleanNet = (s.settlement?.neighbourNetwork || []).filter(n =>
        n.id !== id && n.name !== deletedSave?.name
      );
      // Remove inter-settlement NPC relationships with deleted settlement
      const cleanISR = (s.settlement?.interSettlementRelationships || []).filter(r =>
        r.partnerSettlement !== deletedSave?.settlement?.name &&
        r.partnerSettlement !== deletedSave?.name
      );
      if (cleanNet.length === (s.settlement?.neighbourNetwork||[]).length &&
          cleanISR.length === (s.settlement?.interSettlementRelationships||[]).length) {
        return s; // nothing changed
      }
      return {
        ...s,
        settlement: { ...s.settlement, neighbourNetwork: cleanNet, interSettlementRelationships: cleanISR }
      };
    });

    setSaves(updated); setDeleteId(null);
    if(detail?.saveData?.id===id){ setDetail(null); }
    // Persist: delete entry + update affected partners
    const modifiedIds = updated.filter((s, i) => s !== saves.filter(x => x.id !== id)[i]).map(s => s.id);
    savesService.delete(id).catch(e => console.error('Delete failed:', e));
    persistBatch(updated, modifiedIds);
  };

  const handleLink=(linkedSave, relType)=>{
    const resolvedRelType = relType || 'neutral';
    const linkId = `link_${detail.saveData.id}_${linkedSave.id}`;

    // Entry on current settlement pointing to partner
    const entryForCurrent = {
      id:               linkedSave.id,
      linkId,
      name:             linkedSave.name,
      neighbourName:    linkedSave.name,
      neighbourTier:    linkedSave.tier,
      tier:             linkedSave.tier,
      relationshipType: resolvedRelType,
      description:      `Manually linked as ${resolvedRelType.replace(/_/g,' ')}.`,
      bidirectional:    true,
    };

    // Entry on partner pointing back to current
    const entryForPartner = {
      id:               detail.saveData.id,
      linkId,
      name:             detail.settlement.name,
      neighbourName:    detail.settlement.name,
      neighbourTier:    detail.settlement.tier || detail.saveData.tier,
      tier:             detail.saveData.tier,
      relationshipType: resolvedRelType,
      description:      `${detail.settlement.name} manually linked as ${resolvedRelType.replace(/_/g,' ')}.`,
      bidirectional:    true,
    };

    // Build inter-settlement NPC relationships and conflicts
    const { forA: npcForA, forB: npcForB } = buildInterSettlementNPCs(
      detail.settlement, linkedSave.settlement, resolvedRelType, linkId
    );
    const { forA: conflictForA, forB: conflictForB } = generateCrossSettlementConflicts(
      detail.settlement, linkedSave.settlement, resolvedRelType, linkId
    );
    const forA = [...npcForA, ...conflictForA];
    const forB = [...npcForB, ...conflictForB];

    const network = [...(detail.settlement.neighbourNetwork||[]), entryForCurrent];
    const ownISR  = [...(detail.settlement.interSettlementRelationships||[]), ...forA];

    let updatedSaves = saves.map(s => {
      if (s.id === detail?.saveData?.id) {
        return { ...s, settlement: { ...s.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR }};
      }
      if (s.id === linkedSave.id) {
        return {
          ...s,
          settlement: {
            ...s.settlement,
            neighbourNetwork: [
              entryForPartner,
              ...(s.settlement?.neighbourNetwork||[]).filter(n => n.id !== detail.saveData.id),
            ],
            interSettlementRelationships: [
              ...(s.settlement?.interSettlementRelationships||[]).filter(r => r.linkId !== linkId),
              ...forB,
            ],
          },
        };
      }
      return s;
    });

    setSaves(updatedSaves);
    setDetail(d=>({...d, settlement:{...d.settlement, neighbourNetwork:network, interSettlementRelationships:ownISR}}));
    setNetworkVersion(v=>v+1); setLinking(false);
    persistBatch(updatedSaves, [detail.saveData.id, linkedSave.id]);
  };

  const removeNeighbour=(idx)=>{
    const removedEntry = detail.settlement.neighbourNetwork[idx];
    const linkId       = removedEntry?.linkId;

    // Remove from this settlement
    const network = detail.settlement.neighbourNetwork.filter((_,i)=>i!==idx);
    // Remove associated inter-settlement NPC relationships
    const ownISR  = (detail.settlement.interSettlementRelationships||[])
      .filter(r => !linkId || r.linkId !== linkId);

    let updatedSaves = saves.map(s => {
      if (s.id !== detail?.saveData?.id) return s;
      return { ...s, settlement: { ...s.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR }};
    });

    // ── Bidirectional removal ─────────────────────────────────────────────
    // If this was a bidirectional link, remove the reverse entry from the partner
    if (linkId || removedEntry?.id) {
      const partnerId   = removedEntry?.id;
      const partnerSave = partnerId ? findSaveById(updatedSaves, partnerId) : null;
      if (partnerSave) {
        updatedSaves = updatedSaves.map(s => {
          if (s.id !== partnerId) return s;
          return {
            ...s,
            settlement: {
              ...s.settlement,
              // Remove the reverse neighbour entry
              neighbourNetwork: (s.settlement?.neighbourNetwork||[])
                .filter(n => linkId ? n.linkId !== linkId : n.id !== detail?.saveData?.id),
              // Remove paired NPC relationships
              interSettlementRelationships: (s.settlement?.interSettlementRelationships||[])
                .filter(r => !linkId || r.linkId !== linkId),
            },
          };
        });
      }
    }

    setSaves(updatedSaves);
    setDetail(d=>({...d, settlement:{...d.settlement, neighbourNetwork:network, interSettlementRelationships:ownISR}}));
    setNetworkVersion(v=>v+1);
    const modifiedIds = [detail.saveData.id];
    if (removedEntry?.id) modifiedIds.push(removedEntry.id);
    persistBatch(updatedSaves, modifiedIds);
  };

  const ts=s=>{try{return new Date(s).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'});}catch{return'';}};
  if(detail){
    return <SettlementDetail
      detail={detail}
      setDetail={setDetail}
      saves={saves}
      setSaves={setSaves}
      linking={linking}
      setLinking={setLinking}
      editNamesOpen={editNamesOpen}
      setEditNamesOpen={setEditNamesOpen}
      handleLink={handleLink}
      removeNeighbour={removeNeighbour}
      applyRename={applyRename}
      onLoad={onLoad}
    />;
  }

  // List view
  return<div style={{display:'flex',flexDirection:'column',gap:12}}>
    {/* Save current */}
    <div style={{background:'rgba(255,251,245,0.96)',border:`1px solid ${BORDER}`,borderRadius:8,padding:'12px 14px'}}>
      <div style={{fontFamily:serif_,fontSize:16,fontWeight:600,color:INK,marginBottom:8}}>Saved Settlements</div>
      {settlement&&<div style={{fontSize:11,color:MUTED,marginBottom:8,padding:'6px 10px',background:'#f5ede0',borderRadius:5,border:`1px solid ${BORDER}`,display:'flex',alignItems:'center',gap:6}}>
        <span style={{color:SECOND}}>Current:</span>
        <span style={{fontWeight:700,color:INK}}>{settlement.name}</span>
        <span style={{color:MUTED}}>·</span>
        <span style={{color:SECOND}}>{settlement.tier}</span>
        {settlement.economicState?.prosperityLevel&&<><span style={{color:MUTED}}>·</span><span style={{color:SECOND}}>{settlement.economicState.prosperityLevel}</span></>}
      </div>}
      <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
        <button onClick={saveCurrentSettlement} disabled={!settlement||isDuplicate||!canSave||saves.length>=(maxSaves||30)} style={{display:'flex',alignItems:'center',gap:6,padding:'8px 14px',background:(!settlement||isDuplicate||!canSave)?'#ccc':GOLD,color:'#fff',border:'none',borderRadius:5,cursor:(!settlement||isDuplicate||!canSave)?'not-allowed':'pointer',fontSize:12,fontWeight:700,fontFamily:sans}}>
          <Download size={13}/> {saved?'✓ Saved!':!canSave?'Sign In to Save':isDuplicate?'Already Saved':saves.length>=(maxSaves||30)?'Slots Full':'Save Current Settlement'}
        </button>

        <span style={{fontSize:11,color:MUTED}}>{saves.length}/{maxSaves||30} slots used</span>
      </div>
    </div>

    {/* Import from file */}
    <div style={{background:'#f7f0e4',border:`1px solid ${BORDER}`,borderRadius:8,padding:'12px 14px'}}>
      <div style={{fontSize:12,fontWeight:700,color:SECOND,marginBottom:8}}>Import from file</div>
      <button onClick={()=>fileRef.current?.click()} style={{display:'flex',alignItems:'center',gap:6,padding:'7px 12px',border:`1px solid ${BORDER}`,borderRadius:5,background:CARD,cursor:'pointer',fontSize:12,fontWeight:600,color:SECOND,fontFamily:sans}}>
        Import JSON file
      </button>
      <input ref={fileRef} type="file" accept=".json,application/json" onChange={handleFileImport} style={{display:'none'}}/>
      {importError&&<div style={{marginTop:8,fontSize:11,color:'#8b1a1a'}}>{importError}</div>}
      {importPending&&<div style={{marginTop:8,padding:'8px 10px',background:'#f0faf2',border:'1px solid #4a8a60',borderRadius:5}}>
        <div style={{fontSize:12,fontWeight:700,color:'#1a5a28',marginBottom:4}}>Add "{importPending.name}" to saved settlements?</div>
        <div style={{fontSize:11,color:SECOND,marginBottom:6}}>It will appear in your saved list and can be viewed, linked, or loaded from there.</div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={async()=>{
                // Save imported settlement to the list (not load into generator)
                const newSave = {
                  id: Date.now().toString(),
                  name: importPending.settlement.name || 'Imported Settlement',
                  tier: importPending.settlement.tier || 'unknown',
                  timestamp: Date.now(),
                  settlement: importPending.settlement,
                };
                setSaves(prev => [...prev, newSave]);
                savesService.save(newSave).catch(e => console.error('Import save failed:', e));
                setImportPending(null);
                setImportError(null);
              }} style={{padding:'5px 12px',background:'#1a5a28',color:'#fff',border:'none',borderRadius:4,cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:sans}}>Save to List</button>
          <button onClick={()=>setImportPending(null)} style={{padding:'5px 10px',background:'rgba(255,251,245,0.96)',border:`1px solid ${BORDER}`,borderRadius:4,cursor:'pointer',fontSize:11,color:SECOND,fontFamily:sans}}>Cancel</button>
        </div>
      </div>}
    </div>

    {/* Saves list */}
    {savesLoading
      ? <div style={{padding:'24px 16px',textAlign:'center',fontSize:13,color:MUTED,background:'rgba(255,251,245,0.96)',border:`1px solid ${BORDER}`,borderRadius:8}}>Loading saves...</div>
      : saves.length===0
      ? <div style={{padding:'24px 16px',textAlign:'center',fontSize:13,color:MUTED,background:'rgba(255,251,245,0.96)',border:`1px solid ${BORDER}`,borderRadius:8}}>No saved settlements yet. Generate one and save it.</div>
      : <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {saves.map(s=><div key={s.id} style={{background:'rgba(255,251,245,0.96)',border:`1px solid ${BORDER}`,borderRadius:7,overflow:'hidden'}}>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'9px 12px'}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:700,color:INK,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.name}</div>
                <div style={{fontSize:10,color:MUTED,display:'flex',alignItems:'center',gap:6,marginTop:1,flexWrap:'wrap'}}>
                  <Clock size={10}/> {ts(s.timestamp)} · {s.tier}
                </div>
                {(s.settlement?.neighbourNetwork?.length>0)&&<div style={{display:'flex',gap:4,flexWrap:'wrap',marginTop:3}}>
                  {(s.settlement.neighbourNetwork||[]).slice(0,3).map((n,ni)=>{
                    const nc=REL_COLORS[n.relationshipType]||MUTED;
                    return<span key={ni} style={{fontSize:9,fontWeight:700,color:nc,background:`${nc}18`,border:`1px solid ${nc}40`,borderRadius:8,padding:'1px 6px',whiteSpace:'nowrap'}}>
                      <Link2 size={8} style={{display:'inline',verticalAlign:'middle',marginRight:2}}/>{n.neighbourName||n.name} · {(n.relationshipType||'linked').replace(/_/g,' ')}
                    </span>;
                  })}
                  {(s.settlement.neighbourNetwork||[]).length>3&&<span style={{fontSize:9,color:MUTED}}>+{s.settlement.neighbourNetwork.length-3} more</span>}
                </div>}
              </div>
              <button onClick={()=>setDetail({...s,saveData:s})} style={{padding:'4px 10px',background:'#f0f4ff',color:'#2a3a7a',border:'1px solid #c0c8e8',borderRadius:4,cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:sans}}>View</button>
              <button onClick={()=>setDeleteId(deleteId===s.id?null:s.id)} style={{padding:'4px 10px',background:'#fdf4f4',color:'#8b1a1a',border:'1px solid #e8c0c0',borderRadius:4,cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:sans}}>
                Delete
              </button>
              
            </div>
            {/* Delete confirmation panel */}
            {deleteId===s.id&&<div style={{padding:'10px 12px',background:'#fdf4f4',borderTop:'1px solid #e8c0c0'}}>
              <div style={{fontSize:12,color:'#8b1a1a',fontWeight:600,marginBottom:5}}>
                 Delete {s.name}?
              </div>
              <div style={{fontSize:11,color:'#6b5340',lineHeight:1.5,marginBottom:8}}>
                {(s.settlement?.neighbourNetwork||[]).length>0
                  ? `This settlement has ${(s.settlement.neighbourNetwork||[]).length} neighbour link(s). Deleting it will remove those relationships from the linked settlements as well. Any data not physically exported as JSON will be permanently lost.`
                  : 'All data not physically exported as a JSON file will be permanently lost.'}
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>deleteConfirmed(s.id)} style={{padding:'5px 14px',background:'#8b1a1a',color:'#fff',border:'none',borderRadius:4,cursor:'pointer',fontSize:11,fontWeight:700,fontFamily:sans}}>
                  Yes, delete permanently
                </button>
                <button onClick={()=>setDeleteId(null)} style={{padding:'5px 10px',background:CARD,color:SECOND,border:`1px solid ${BORDER}`,borderRadius:4,cursor:'pointer',fontSize:11,fontFamily:sans}}>
                  Cancel
                </button>
              </div>
            </div>}
          </div>)}
        </div>
    }
  </div>;
}
