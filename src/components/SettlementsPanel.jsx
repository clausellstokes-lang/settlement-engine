import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {Link2, Clock, Save, FolderOpen, FolderPlus, ChevronDown, ChevronRight, ArrowRight, Edit3, Check, X, Map as MapIcon, FileText} from 'lucide-react';

import {generateCrossSettlementConflicts} from '../generators/crossSettlementConflicts';
import {getAllModifiers, EFFECT_CATEGORIES, fmtMod} from '../lib/relationshipGraph.js';
import {generateCampaignPDF} from '../utils/generateCampaignPDF.js';
import {GOLD, GOLD_BG, INK, MUTED, SECOND, BORDER, CARD, sans, serif_} from './theme.js';
import { useStore } from '../store/index.js';
import { saves as savesService } from '../lib/saves.js';
import SettlementDetail from './SettlementDetail';
import DeleteConfirmation from './DeleteConfirmation';

// ── Save migration ─────────────────────────────────────────────────────────
function migrateConfig(config) {
  if (!config) return {};
  const c = { ...config };
  if (c.magicExists === undefined) c.magicExists = (c.priorityMagic ?? 50) > 0;
  if (!c.nearbyResourcesState) c.nearbyResourcesState = {};
  return c;
}

// ── NPC pairing helpers ────────────────────────────────────────────────────
const NPC_PAIR_CATS = {
  trade_partner:['economy'], allied:['economy','military'], patron:['military','economy'],
  client:['economy'], rival:['economy','military'], cold_war:['military','criminal'],
  hostile:['military'], neutral:['economy'],
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

function buildInterSettlementNPCs(settlementA, settlementB, relType, linkId) {
  const cats = NPC_PAIR_CATS[relType] || ['economy'];
  const descFn = CONTACT_DESC[relType] || CONTACT_DESC.neutral;
  let npcsA = (settlementA.npcs||[]).filter(n => cats.includes((n.category||'').toLowerCase()));
  let npcsB = (settlementB.npcs||[]).filter(n => cats.includes((n.category||'').toLowerCase()));
  if (!npcsA.length) npcsA = (settlementA.npcs||[]).slice(0, 3);
  if (!npcsB.length) npcsB = (settlementB.npcs||[]).slice(0, 3);
  if (!npcsA.length || !npcsB.length) return { forA:[], forB:[] };
  const pairs = [];
  const maxPairs = Math.min(npcsA.length, npcsB.length, 2);
  const usedB = new Set();
  for (let i = 0; i < maxPairs; i++) {
    const a = npcsA[i];
    const b = npcsB.find(n => !usedB.has(n.id) && n.category === a.category) || npcsB.find(n => !usedB.has(n.id));
    if (!b) break; usedB.add(b.id); pairs.push({ a, b });
  }
  const forA = pairs.map(({a,b}) => ({ linkId, npcId:a.id, npcName:a.name, npcRole:a.role, partnerName:b.name, partnerRole:b.role, partnerSettlement:settlementB.name, relType, description:descFn(a.name,a.role,b.name,b.role,settlementB.name) }));
  const forB = pairs.map(({a,b}) => ({ linkId, npcId:b.id, npcName:b.name, npcRole:b.role, partnerName:a.name, partnerRole:a.role, partnerSettlement:settlementA.name, relType, description:descFn(b.name,b.role,a.name,a.role,settlementA.name) }));
  return { forA, forB };
}

function findSaveByName(saves, name) { return saves.find(s => s.name === name || s.settlement?.name === name) || null; }
function findSaveById(saves, id) { return saves.find(s => s.id === id) || null; }

const REL_COLORS = { rival:'#8b1a1a', cold_war:'#8b1a1a', hostile:'#8b1a1a', allied:'#1a5a28', secret_alliance:'#1a5a28', trade_partner:'#a0762a', patron:'#2a3a7a', client:'#2a3a7a', criminal_network:'#5a2a8a' };
const REL_TYPES = ['neutral','trade_partner','allied','rival','cold_war','patron','client','criminal_network'];

// ── Settlement Card (reused in campaigns + unassigned) ────────────────────
function SettlementCard({ s, allModifiers, onView, onDelete, deleteId, setDeleteId, deleteConfirmed, campaigns, addToCampaign, removeFromCampaign, currentCampaignId }) {
  const [moveOpen, setMoveOpen] = useState(false);
  const ts = (t) => { try { return new Date(t).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'2-digit',hour:'2-digit',minute:'2-digit'}); } catch { return ''; } };

  // No overflow:hidden on the wrapper — would clip the "move to campaign"
  // popover that opens below the arrow button. DeleteConfirmation below
  // carries its own rounded corners + top margin, so nothing visually escapes.
  return (
    <div style={{ background:'rgba(255,251,245,0.96)', border:`1px solid ${BORDER}`, borderRadius:7 }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 12px' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:700, color:INK, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{s.name}</div>
          <div style={{ fontSize:10, color:MUTED, display:'flex', alignItems:'center', gap:6, marginTop:1, flexWrap:'wrap' }}>
            <Clock size={10}/> {ts(s.timestamp)} · {s.tier}
          </div>
          {(s.settlement?.neighbourNetwork?.length > 0) && (
            <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginTop:3 }}>
              {(s.settlement.neighbourNetwork||[]).slice(0,3).map((n,ni) => {
                const nc = REL_COLORS[n.relationshipType] || MUTED;
                return <span key={ni} style={{ fontSize:9, fontWeight:700, color:nc, background:`${nc}18`, border:`1px solid ${nc}40`, borderRadius:8, padding:'1px 6px', whiteSpace:'nowrap' }}>
                  <Link2 size={8} style={{display:'inline',verticalAlign:'middle',marginRight:2}}/>{n.neighbourName||n.name} · {(n.relationshipType||'linked').replace(/_/g,' ')}
                </span>;
              })}
              {(s.settlement.neighbourNetwork||[]).length > 3 && <span style={{fontSize:9,color:MUTED}}>+{s.settlement.neighbourNetwork.length - 3} more</span>}
            </div>
          )}
          {/* Network effect badges */}
          {(() => {
            const m = allModifiers.get(s.id);
            if (!m || m.sources.length === 0) return null;
            const badges = EFFECT_CATEGORIES.filter(c => Math.abs(m.totals[c.key]) >= 0.05);
            if (!badges.length) return null;
            return <div style={{display:'flex',gap:3,flexWrap:'wrap',marginTop:3}}>
              {badges.map(c => {
                const v = m.totals[c.key]; const pos = v >= 0;
                return <span key={c.key} style={{ fontSize:9, fontWeight:700, color:pos?'#1a5a28':'#8b1a1a', background:pos?'#e8f5e8':'#fde8e8', border:`1px solid ${pos?'#a0d0a0':'#e0b0b0'}`, borderRadius:8, padding:'1px 5px', whiteSpace:'nowrap' }}>
                  {c.label} {fmtMod(v)}
                </span>;
              })}
            </div>;
          })()}
        </div>
        <div style={{ display:'flex', gap:4, alignItems:'center', flexShrink:0 }}>
          {/* Move to campaign */}
          <div style={{ position:'relative' }}>
            <button onClick={() => setMoveOpen(!moveOpen)} title={currentCampaignId ? 'Move to...' : 'Add to campaign'} style={{ padding:'4px 6px', background:GOLD_BG, color:GOLD, border:`1px solid rgba(160,118,42,0.3)`, borderRadius:4, cursor:'pointer', fontSize:10, fontWeight:700, fontFamily:sans, display:'flex', alignItems:'center', gap:3 }}>
              <ArrowRight size={10}/>
            </button>
            {moveOpen && (
              <div style={{ position:'absolute', right:0, top:'100%', marginTop:4, zIndex:20, background:CARD, border:`1px solid ${BORDER}`, borderRadius:6, boxShadow:'0 4px 16px rgba(0,0,0,0.15)', minWidth:160, padding:4 }}>
                {currentCampaignId && (
                  <button onClick={() => { removeFromCampaign(currentCampaignId, s.id); setMoveOpen(false); }} style={{ width:'100%', textAlign:'left', padding:'5px 8px', border:'none', background:'none', cursor:'pointer', fontSize:11, color:'#8b1a1a', fontFamily:sans, borderRadius:3 }}
                    onMouseEnter={e => e.target.style.background='#fdf4f4'} onMouseLeave={e => e.target.style.background='none'}>
                    Remove from campaign
                  </button>
                )}
                {campaigns.map(c => c.id === currentCampaignId ? null : (
                  <button key={c.id} onClick={() => { addToCampaign(c.id, s.id); setMoveOpen(false); }} style={{ width:'100%', textAlign:'left', padding:'5px 8px', border:'none', background:'none', cursor:'pointer', fontSize:11, color:INK, fontFamily:sans, borderRadius:3, display:'flex', alignItems:'center', gap:4 }}
                    onMouseEnter={e => e.target.style.background='#f5ede0'} onMouseLeave={e => e.target.style.background='none'}>
                    <FolderOpen size={10} color={GOLD}/> {c.name}
                  </button>
                ))}
                {campaigns.length === 0 && <div style={{ padding:'5px 8px', fontSize:10, color:MUTED }}>No campaigns yet</div>}
              </div>
            )}
          </div>
          <button onClick={() => onView(s)} style={{ padding:'4px 10px', background:'#f0f4ff', color:'#2a3a7a', border:'1px solid #c0c8e8', borderRadius:4, cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:sans }}>View</button>
          <button onClick={() => setDeleteId(deleteId === s.id ? null : s.id)} style={{ padding:'4px 10px', background:'#fdf4f4', color:'#8b1a1a', border:'1px solid #e8c0c0', borderRadius:4, cursor:'pointer', fontSize:11, fontWeight:700, fontFamily:sans }}>Delete</button>
        </div>
      </div>
      {deleteId === s.id && (
        <DeleteConfirmation
          entityName={s.name}
          details={(s.settlement?.neighbourNetwork||[]).length > 0
            ? `This settlement has ${s.settlement.neighbourNetwork.length} neighbour link(s). Deleting it will remove those relationships from linked settlements. Any data not exported as JSON will be permanently lost.`
            : 'All data not physically exported as a JSON file will be permanently lost.'}
          onConfirm={() => deleteConfirmed(s.id)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
}

// ── Campaign Folder ──────────────────────────────────────────────────────────
function CampaignFolder({ campaign, settlements, allModifiers, onViewSettlement, deleteId, setDeleteId, deleteConfirmed, campaigns, addToCampaign, removeFromCampaign, onDeleteCampaign, onRenameCampaign, toggleCollapsed }) {
  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const collapsed = campaign.collapsed;

  // No overflow:hidden on the wrapper — would clip the "move to campaign"
  // popover on cards inside this section. The header's top corners are
  // rounded explicitly to match the parent so the cream background doesn't
  // poke outside the rounded outer border.
  return (
    <div style={{ background:'rgba(255,251,245,0.96)', border:`1px solid ${BORDER}`, borderRadius:8 }}>
      {/* Campaign header */}
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', background:'#f5ede0', borderBottom: collapsed ? 'none' : `1px solid ${BORDER}`, borderTopLeftRadius:8, borderTopRightRadius:8, borderBottomLeftRadius: collapsed ? 8 : 0, borderBottomRightRadius: collapsed ? 8 : 0 }}>
        <button onClick={() => toggleCollapsed(campaign.id)} style={{ background:'none', border:'none', cursor:'pointer', padding:0, display:'flex', color:MUTED }}>
          {collapsed ? <ChevronRight size={14}/> : <ChevronDown size={14}/>}
        </button>
        <FolderOpen size={14} color={GOLD}/>
        {editing ? (
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:4 }}>
            <input value={editDraft} onChange={e => setEditDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { onRenameCampaign(campaign.id, editDraft); setEditing(false); } if (e.key === 'Escape') setEditing(false); }}
              style={{ flex:1, padding:'2px 6px', border:`1px solid ${GOLD}`, borderRadius:3, fontSize:12, fontFamily:sans, outline:'none' }} autoFocus/>
            <button onClick={() => { onRenameCampaign(campaign.id, editDraft); setEditing(false); }} style={{ background:'none', border:'none', color:'#2a7a2a', cursor:'pointer' }}><Check size={12}/></button>
            <button onClick={() => setEditing(false)} style={{ background:'none', border:'none', color:'#8b1a1a', cursor:'pointer' }}><X size={12}/></button>
          </div>
        ) : (
          <span style={{ flex:1, fontSize:13, fontWeight:700, color:INK, fontFamily:serif_ }}>{campaign.name}</span>
        )}
        <span style={{ fontSize:10, color:MUTED, fontFamily:sans }}>{settlements.length} settlement{settlements.length !== 1 ? 's' : ''}</span>
        {campaign.mapState && <MapIcon size={11} color={GOLD} title="Map saved"/>}
        {!editing && (
          <div style={{ display:'flex', gap:2, alignItems:'center' }}>
            <button
              onClick={(e) => { e.stopPropagation(); generateCampaignPDF(campaign, settlements); }}
              disabled={settlements.length === 0}
              title="Export Campaign PDF"
              style={{ display:'flex', alignItems:'center', gap:3, background: settlements.length === 0 ? '#d8cdbc' : '#7a1a1a', color:'#fff', border:'none', borderRadius:4, padding:'3px 7px', cursor: settlements.length === 0 ? 'not-allowed' : 'pointer', fontSize:9, fontWeight:700, fontFamily:sans }}>
              <FileText size={10}/> PDF
            </button>
            <button onClick={() => { setEditing(true); setEditDraft(campaign.name); }} style={{ background:'none', border:'none', color:MUTED, cursor:'pointer', padding:2 }}><Edit3 size={11}/></button>
            <button onClick={() => setConfirmDelete(!confirmDelete)} style={{ background:'none', border:'none', color:'#8b1a1a', cursor:'pointer', padding:2 }}><X size={11}/></button>
          </div>
        )}
      </div>

      {/* Campaign delete confirmation */}
      {confirmDelete && (
        <DeleteConfirmation
          entityName={campaign.name}
          details={`This campaign contains ${settlements.length} settlement(s). They will become unassigned, not deleted.${campaign.mapState ? ' The saved map state will be lost.' : ''}`}
          onConfirm={() => { onDeleteCampaign(campaign.id); setConfirmDelete(false); }}
          onCancel={() => setConfirmDelete(false)}
        />
      )}

      {/* Nested settlements */}
      {!collapsed && (
        <div style={{ padding:'6px 8px 8px', display:'flex', flexDirection:'column', gap:4 }}>
          {settlements.length === 0 ? (
            <div style={{ padding:'10px 8px', fontSize:11, color:MUTED, textAlign:'center', fontStyle:'italic' }}>
              No settlements in this campaign yet. Use the arrow button to move settlements here.
            </div>
          ) : settlements.map(s => (
            <SettlementCard key={s.id} s={s} allModifiers={allModifiers}
              onView={onViewSettlement} deleteId={deleteId} setDeleteId={setDeleteId}
              deleteConfirmed={deleteConfirmed} campaigns={campaigns}
              addToCampaign={addToCampaign} removeFromCampaign={removeFromCampaign}
              currentCampaignId={campaign.id}/>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Panel ──────────────────────────────────────────────────────────────

export default function SettlementsPanel({ onNavigate }) {
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
  const authTier = useStore(s => s.auth.tier);
  const setSavedSettlements = useStore(s => s.setSavedSettlements);
  const applyCosmeticRename = useStore(s => s.applyCosmeticRename);

  // Campaign store
  const campaigns = useStore(s => s.campaigns);
  const createCampaign = useStore(s => s.createCampaign);
  const renameCampaign = useStore(s => s.renameCampaign);
  const deleteCampaign = useStore(s => s.deleteCampaign);
  const toggleCampaignCollapsed = useStore(s => s.toggleCampaignCollapsed);
  const addToCampaign = useStore(s => s.addToCampaign);
  const removeFromCampaign = useStore(s => s.removeFromCampaign);

  const onLoad = (data) => {
    if (data.config) updateConfig(migrateConfig(data.config));
    if (data.institutionToggles) setInstitutionToggles(data.institutionToggles);
    if (data.categoryToggles) setCategoryToggles(data.categoryToggles);
    if (data.goodsToggles) setGoodsToggles(data.goodsToggles);
    if (data.servicesToggles) setServiceToggles(data.servicesToggles);
    if (data.settlement) { setSettlement(data.settlement); setLoadedFromSave({ name: data.settlement.name, tier: data.settlement.tier }); }
    onNavigate?.('generate');
  };

  const [saves, _setSavesLocal] = useState([]);
  // Wrapper: update local state + Zustand store so WorldMap palette stays in sync
  const setSaves = useCallback((newSaves) => {
    _setSavesLocal(newSaves);
    setSavedSettlements(newSaves);
  }, [setSavedSettlements]);
  const [savesLoading, setSavesLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [linking, setLinking] = useState(false);
  const [networkVersion, setNetworkVersion] = useState(0);
  const [editNamesOpen, setEditNamesOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [showNewCampaign, setShowNewCampaign] = useState(false);

  const allModifiers = useMemo(() => getAllModifiers(saves), [saves]);

  useEffect(() => {
    savesService.list()
      .then(loaded => { setSaves(loaded); setSavesLoading(false); })
      .catch(e => { console.error('Failed to load saves:', e); setSavesLoading(false); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If the user jumped here from the World Map's "Open" button, the map had
  // already set selectedSettlementId in the store. Honor it by opening the
  // matching save in detail view, then clear the selection so the next
  // navigation to this tab starts on the list.
  const pendingFocusId = useStore(s => s.selectedSettlementId);
  const clearSelectedSettlement = useStore(s => s.clearSelectedSettlementId);
  useEffect(() => {
    if (!pendingFocusId || savesLoading || !saves.length || detail) return;
    const match = saves.find(s => s.id === pendingFocusId);
    if (match) {
      setDetail({ ...match, saveData: match });
      clearSelectedSettlement();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingFocusId, savesLoading, saves]);

  const persistBatch = async (updatedSaves, modifiedIds) => {
    try {
      if (savesService.writeAll) await savesService.writeAll(updatedSaves);
      else for (const id of modifiedIds) { const s = updatedSaves.find(x => x.id === id); if (s) await savesService.update(id, { settlement: s.settlement }); }
    } catch (e) { console.error('Persist failed:', e); }
  };

  // ── Rename ──────────────────────────────────────────────────────────────
  const applyRename = (type, id, oldName, newName) => {
    if (!newName.trim() || newName.trim() === oldName) return;
    const trimmed = newName.trim();
    const saveId = detail?.saveData?.id;
    let updatedSaves = saves.map(s => {
      if (s.id !== saveId) {
        const needsUpdate = (s.settlement?.interSettlementRelationships||[]).some(r => r.partnerSettlement === detail.settlement.name && (r.partnerName === oldName || r.npcName === oldName || r.partnerFactionName === oldName || r.factionName === oldName));
        if (!needsUpdate) return s;
        return { ...s, settlement: { ...s.settlement, interSettlementRelationships: (s.settlement.interSettlementRelationships||[]).map(r => {
          if (r.partnerSettlement !== detail.settlement.name) return r;
          return { ...r, partnerName: r.partnerName === oldName ? trimmed : r.partnerName, partnerFactionName: r.partnerFactionName === oldName ? trimmed : r.partnerFactionName, npcName: r.npcName === oldName ? trimmed : r.npcName, factionName: r.factionName === oldName ? trimmed : r.factionName };
        }) } };
      }
      const sett = s.settlement;
      const updatedNpcs = type === 'npc' ? (sett.npcs||[]).map(n => n.id === id ? {...n, name:trimmed} : n) : sett.npcs;
      const updatedFactions = type === 'faction' ? (sett.factions||[]).map(f => f.name === oldName ? {...f, name:trimmed} : f) : sett.factions;
      const updatedRels = (sett.relationships||[]).map(r => ({ ...r, npc1Name: r.npc1Name === oldName ? trimmed : r.npc1Name, npc2Name: r.npc2Name === oldName ? trimmed : r.npc2Name }));
      const updatedISR = (sett.interSettlementRelationships||[]).map(r => ({ ...r, npcName: r.npcName === oldName ? trimmed : r.npcName, partnerName: r.partnerName === oldName ? trimmed : r.partnerName, factionName: r.factionName === oldName ? trimmed : r.factionName, partnerFactionName: r.partnerFactionName === oldName ? trimmed : r.partnerFactionName }));
      return { ...s, settlement: { ...sett, npcs: updatedNpcs, factions: updatedFactions, relationships: updatedRels, interSettlementRelationships: updatedISR } };
    });
    setSaves(updatedSaves);
    const modifiedIds = updatedSaves.filter((s, i) => s !== saves[i]).map(s => s.id);
    persistBatch(updatedSaves, modifiedIds);
    const updatedDetailSave = updatedSaves.find(s => s.id === saveId);
    if (updatedDetailSave) setDetail(d => ({ ...d, ...updatedDetailSave, saveData: updatedDetailSave }));

    // AI-2: cosmetic-tier change — cascade the rename into every touched
    // save's ai_data blob too. applyCosmeticRename no-ops when a save has
    // no narrative, so this is cheap for unnarrated saves.
    for (const mid of modifiedIds) {
      applyCosmeticRename({ saveId: mid, oldName, newName: trimmed });
    }
  };

  const isDuplicate = settlement && saves.some(s => s.name === settlement.name && s.tier === settlement.tier && (s.settlement?.institutions||[]).length === (settlement.institutions||[]).length);

  // ── Save current ────────────────────────────────────────────────────────
  const saveCurrentSettlement = async () => {
    if (!settlement || !canSave) return;
    const saveId = Date.now();
    const newEntry = { id: saveId, name: settlement.name, tier: settlement.tier, timestamp: new Date().toISOString(), settlement, config, institutionToggles, categoryToggles, goodsToggles: goodsToggles||{}, servicesToggles: servicesToggles||{} };

    // Migrate neighborRelationship → neighbourNetwork
    const nr_raw = newEntry.settlement.neighborRelationship;
    if (nr_raw?.name) {
      const existingNet = newEntry.settlement.neighbourNetwork || [];
      if (!existingNet.some(n => n.name === nr_raw.name)) {
        newEntry.settlement = { ...newEntry.settlement, neighbourNetwork: [{ id:`generated_${nr_raw.name.replace(/\s+/g,'_')}`, name:nr_raw.name, neighbourName:nr_raw.name, neighbourTier:nr_raw.tier||'', tier:nr_raw.tier||'', relationshipType:nr_raw.relationshipType||'neutral', description:`Generated as ${(nr_raw.relationshipType||'neutral').replace(/_/g,' ')} of this settlement.`, fromGeneration:true }, ...existingNet] };
      }
    }

    let currentSaves = [...saves];

    // Bidirectional linking
    const nr = settlement.neighborRelationship;
    if (nr?.name) {
      const relType = nr.relationshipType || 'neutral';
      const partnerSave = findSaveByName(currentSaves, nr.name);
      if (partnerSave) {
        const linkId = `link_${saveId}_${partnerSave.id}`;
        const entryForA = { id:partnerSave.id, linkId, name:partnerSave.name, neighbourName:partnerSave.name, neighbourTier:partnerSave.tier, tier:partnerSave.tier, relationshipType:relType, description:`Generated as ${relType.replace(/_/g,' ')} of ${partnerSave.name}.`, bidirectional:true };
        const entryForB = { id:saveId, linkId, name:newEntry.name, neighbourName:newEntry.name, neighbourTier:newEntry.tier, tier:newEntry.tier, relationshipType:relType, description:`${newEntry.name} was generated as ${relType.replace(/_/g,' ')} of this settlement.`, bidirectional:true };
        const { forA: npcForA, forB: npcForB } = buildInterSettlementNPCs(settlement, partnerSave.settlement, relType, linkId);
        const { forA: conflictForA, forB: conflictForB } = generateCrossSettlementConflicts(settlement, partnerSave.settlement, relType, linkId);
        newEntry.settlement = { ...newEntry.settlement, neighbourNetwork: [entryForA, ...(newEntry.settlement.neighbourNetwork||[]).filter(n=>n.name!==partnerSave.name)], interSettlementRelationships: [...(newEntry.settlement.interSettlementRelationships||[]), ...npcForA, ...conflictForA] };
        currentSaves = currentSaves.map(s => {
          if (s.id !== partnerSave.id) return s;
          return { ...s, settlement: { ...s.settlement, neighbourNetwork: [entryForB, ...(s.settlement?.neighbourNetwork||[]).filter(n=>n.id!==saveId)], interSettlementRelationships: [...(s.settlement?.interSettlementRelationships||[]).filter(r=>r.linkId!==linkId), ...npcForB, ...conflictForB] } };
        });
      }
    }

    const effectiveMax = maxSaves || 30;
    const newSaves = [newEntry, ...currentSaves].slice(0, effectiveMax);
    setSaves(newSaves); setSaved(true); setTimeout(() => setSaved(false), 2000);
    try {
      await savesService.save(newEntry);
      const partnerSave = settlement.neighborRelationship?.name ? currentSaves.find(s => s !== saves.find(x => x.id === s.id)) : null;
      if (partnerSave) await savesService.update(partnerSave.id, { settlement: partnerSave.settlement });
    } catch (e) { console.error('Save failed:', e); }
  };

  // ── Delete ──────────────────────────────────────────────────────────────
  const deleteConfirmed = (id) => {
    const deletedSave = saves.find(s => s.id === id);
    const deletedNet = deletedSave?.settlement?.neighbourNetwork || [];
    let updated = saves.filter(s => s.id !== id).map(s => {
      const wasLinked = deletedNet.some(n => n.id === s.id || n.linkId);
      if (!wasLinked) return s;
      const cleanNet = (s.settlement?.neighbourNetwork||[]).filter(n => n.id !== id && n.name !== deletedSave?.name);
      const cleanISR = (s.settlement?.interSettlementRelationships||[]).filter(r => r.partnerSettlement !== deletedSave?.settlement?.name && r.partnerSettlement !== deletedSave?.name);
      if (cleanNet.length === (s.settlement?.neighbourNetwork||[]).length && cleanISR.length === (s.settlement?.interSettlementRelationships||[]).length) return s;
      return { ...s, settlement: { ...s.settlement, neighbourNetwork: cleanNet, interSettlementRelationships: cleanISR } };
    });
    setSaves(updated); setDeleteId(null);
    if (detail?.saveData?.id === id) setDetail(null);
    const modifiedIds = updated.filter((s, i) => s !== saves.filter(x => x.id !== id)[i]).map(s => s.id);
    savesService.delete(id).catch(e => console.error('Delete failed:', e));
    persistBatch(updated, modifiedIds);
  };

  // ── Link ────────────────────────────────────────────────────────────────
  const handleLink = (linkedSave, relType) => {
    const resolvedRelType = relType || 'neutral';
    const linkId = `link_${detail.saveData.id}_${linkedSave.id}`;
    const entryForCurrent = { id:linkedSave.id, linkId, name:linkedSave.name, neighbourName:linkedSave.name, neighbourTier:linkedSave.tier, tier:linkedSave.tier, relationshipType:resolvedRelType, description:`Manually linked as ${resolvedRelType.replace(/_/g,' ')}.`, bidirectional:true };
    const entryForPartner = { id:detail.saveData.id, linkId, name:detail.settlement.name, neighbourName:detail.settlement.name, neighbourTier:detail.settlement.tier||detail.saveData.tier, tier:detail.saveData.tier, relationshipType:resolvedRelType, description:`${detail.settlement.name} manually linked as ${resolvedRelType.replace(/_/g,' ')}.`, bidirectional:true };
    const { forA: npcForA, forB: npcForB } = buildInterSettlementNPCs(detail.settlement, linkedSave.settlement, resolvedRelType, linkId);
    const { forA: conflictForA, forB: conflictForB } = generateCrossSettlementConflicts(detail.settlement, linkedSave.settlement, resolvedRelType, linkId);
    const network = [...(detail.settlement.neighbourNetwork||[]), entryForCurrent];
    const ownISR = [...(detail.settlement.interSettlementRelationships||[]), ...npcForA, ...conflictForA];
    let updatedSaves = saves.map(s => {
      if (s.id === detail?.saveData?.id) return { ...s, settlement: { ...s.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } };
      if (s.id === linkedSave.id) return { ...s, settlement: { ...s.settlement, neighbourNetwork: [entryForPartner, ...(s.settlement?.neighbourNetwork||[]).filter(n => n.id !== detail.saveData.id)], interSettlementRelationships: [...(s.settlement?.interSettlementRelationships||[]).filter(r => r.linkId !== linkId), ...npcForB, ...conflictForB] } };
      return s;
    });
    setSaves(updatedSaves);
    setDetail(d => ({ ...d, settlement: { ...d.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } }));
    setNetworkVersion(v => v + 1); setLinking(false);
    persistBatch(updatedSaves, [detail.saveData.id, linkedSave.id]);
  };

  const removeNeighbour = (idx) => {
    const removedEntry = detail.settlement.neighbourNetwork[idx];
    const linkId = removedEntry?.linkId;
    const network = detail.settlement.neighbourNetwork.filter((_, i) => i !== idx);
    const ownISR = (detail.settlement.interSettlementRelationships||[]).filter(r => !linkId || r.linkId !== linkId);
    let updatedSaves = saves.map(s => {
      if (s.id !== detail?.saveData?.id) return s;
      return { ...s, settlement: { ...s.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } };
    });
    if (linkId || removedEntry?.id) {
      const partnerId = removedEntry?.id;
      const partnerSave = partnerId ? findSaveById(updatedSaves, partnerId) : null;
      if (partnerSave) {
        updatedSaves = updatedSaves.map(s => {
          if (s.id !== partnerId) return s;
          return { ...s, settlement: { ...s.settlement, neighbourNetwork: (s.settlement?.neighbourNetwork||[]).filter(n => linkId ? n.linkId !== linkId : n.id !== detail?.saveData?.id), interSettlementRelationships: (s.settlement?.interSettlementRelationships||[]).filter(r => !linkId || r.linkId !== linkId) } };
        });
      }
    }
    setSaves(updatedSaves);
    setDetail(d => ({ ...d, settlement: { ...d.settlement, neighbourNetwork: network, interSettlementRelationships: ownISR } }));
    setNetworkVersion(v => v + 1);
    const modifiedIds = [detail.saveData.id];
    if (removedEntry?.id) modifiedIds.push(removedEntry.id);
    persistBatch(updatedSaves, modifiedIds);
  };

  // ── Edit settlement ─────────────────────────────────────────────────────
  const onEditSettlement = (id, patch) => {
    const updatedSaves = saves.map(s => {
      if (s.id !== id) return s;
      const merged = { ...s };
      if (patch.settlement) {
        merged.settlement = { ...s.settlement };
        for (const [k, v] of Object.entries(patch.settlement)) {
          if (v && typeof v === 'object' && !Array.isArray(v)) merged.settlement[k] = { ...(s.settlement[k] || {}), ...v };
          else merged.settlement[k] = v;
        }
      }
      if (patch.config) merged.config = { ...(s.config || {}), ...patch.config };
      return merged;
    });
    setSaves(updatedSaves);
    const updatedEntry = updatedSaves.find(s => s.id === id);
    if (updatedEntry) setDetail(d => ({ ...d, ...updatedEntry, saveData: updatedEntry }));
    persistBatch(updatedSaves, [id]);
  };

  // ── Campaign helpers ────────────────────────────────────────────────────
  const handleCreateCampaign = () => {
    if (!newCampaignName.trim()) return;
    createCampaign(newCampaignName);
    setNewCampaignName('');
    setShowNewCampaign(false);
  };

  // Derive assigned/unassigned settlement grouping
  const assignedIds = useMemo(() => {
    const ids = new Set();
    for (const c of campaigns) for (const id of c.settlementIds) ids.add(id);
    return ids;
  }, [campaigns]);

  const unassignedSaves = useMemo(() => saves.filter(s => !assignedIds.has(s.id)), [saves, assignedIds]);

  const onViewSettlement = (s) => setDetail({ ...s, saveData: s });

  // ── Detail view ─────────────────────────────────────────────────────────
  if (detail) {
    return <SettlementDetail
      detail={detail} setDetail={setDetail} saves={saves} setSaves={setSaves}
      linking={linking} setLinking={setLinking}
      editNamesOpen={editNamesOpen} setEditNamesOpen={setEditNamesOpen}
      handleLink={handleLink} removeNeighbour={removeNeighbour}
      applyRename={applyRename} onLoad={onLoad} onEditSettlement={onEditSettlement}
    />;
  }

  // ── List view ───────────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

      {/* Save current settlement */}
      <div style={{ background:'rgba(255,251,245,0.96)', border:`1px solid ${BORDER}`, borderRadius:8, padding:'12px 14px' }}>
        <div style={{ fontFamily:serif_, fontSize:16, fontWeight:600, color:INK, marginBottom:8 }}>Saved Settlements</div>
        {settlement && (
          <div style={{ fontSize:11, color:MUTED, marginBottom:8, padding:'6px 10px', background:'#f5ede0', borderRadius:5, border:`1px solid ${BORDER}`, display:'flex', alignItems:'center', gap:6 }}>
            <span style={{color:SECOND}}>Current:</span>
            <span style={{fontWeight:700,color:INK}}>{settlement.name}</span>
            <span style={{color:MUTED}}>·</span>
            <span style={{color:SECOND}}>{settlement.tier}</span>
            {settlement.economicState?.prosperityLevel && <><span style={{color:MUTED}}>·</span><span style={{color:SECOND}}>{settlement.economicState.prosperityLevel}</span></>}
          </div>
        )}
        <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
          <button onClick={saveCurrentSettlement} disabled={!settlement||isDuplicate||!canSave||saves.length>=(maxSaves||30)} style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:(!settlement||isDuplicate||!canSave)?'#ccc':GOLD, color:'#fff', border:'none', borderRadius:5, cursor:(!settlement||isDuplicate||!canSave)?'not-allowed':'pointer', fontSize:12, fontWeight:700, fontFamily:sans }}>
            <Save size={13}/> {saved?'Saved!':!canSave?'Sign In to Save':isDuplicate?'Already Saved':saves.length>=(maxSaves||30)?'Slots Full':'Save Current Settlement'}
          </button>
          <span style={{ fontSize:11, color:MUTED }}>{saves.length}/{maxSaves||30} slots used</span>
        </div>
      </div>

      {/* New campaign button */}
      {authTier !== 'anon' && (
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {showNewCampaign ? (
            <div style={{ flex:1, display:'flex', gap:6 }}>
              <input value={newCampaignName} onChange={e => setNewCampaignName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateCampaign(); if (e.key === 'Escape') setShowNewCampaign(false); }}
                placeholder="Campaign name..." autoFocus
                style={{ flex:1, padding:'6px 10px', border:`1px solid ${BORDER}`, borderRadius:5, fontSize:12, fontFamily:sans, outline:'none' }}/>
              <button onClick={handleCreateCampaign} disabled={!newCampaignName.trim()} style={{ padding:'6px 12px', background:newCampaignName.trim()?GOLD:'#ccc', color:'#fff', border:'none', borderRadius:5, cursor:newCampaignName.trim()?'pointer':'not-allowed', fontSize:11, fontWeight:700, fontFamily:sans }}>Create</button>
              <button onClick={() => { setShowNewCampaign(false); setNewCampaignName(''); }} style={{ padding:'6px 10px', background:CARD, color:SECOND, border:`1px solid ${BORDER}`, borderRadius:5, cursor:'pointer', fontSize:11, fontFamily:sans }}>Cancel</button>
            </div>
          ) : (
            <button onClick={() => setShowNewCampaign(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:GOLD_BG, color:GOLD, border:`1px solid rgba(160,118,42,0.3)`, borderRadius:6, cursor:'pointer', fontSize:12, fontWeight:700, fontFamily:sans }}>
              <FolderPlus size={14}/> New Campaign
            </button>
          )}
        </div>
      )}

      {savesLoading ? (
        <div style={{ padding:'24px 16px', textAlign:'center', fontSize:13, color:MUTED, background:'rgba(255,251,245,0.96)', border:`1px solid ${BORDER}`, borderRadius:8 }}>Loading saves...</div>
      ) : saves.length === 0 ? (
        <div style={{ padding:'24px 16px', textAlign:'center', fontSize:13, color:MUTED, background:'rgba(255,251,245,0.96)', border:`1px solid ${BORDER}`, borderRadius:8 }}>No saved settlements yet. Generate one and save it.</div>
      ) : (
        <>
          {/* Campaign folders */}
          {campaigns.map(campaign => {
            const campSaves = campaign.settlementIds.map(id => saves.find(s => s.id === id)).filter(Boolean);
            return (
              <CampaignFolder key={campaign.id} campaign={campaign} settlements={campSaves}
                allModifiers={allModifiers} onViewSettlement={onViewSettlement}
                deleteId={deleteId} setDeleteId={setDeleteId} deleteConfirmed={deleteConfirmed}
                campaigns={campaigns} addToCampaign={addToCampaign} removeFromCampaign={removeFromCampaign}
                onDeleteCampaign={deleteCampaign} onRenameCampaign={renameCampaign}
                toggleCollapsed={toggleCampaignCollapsed}/>
            );
          })}

          {/* Unassigned settlements */}
          {unassignedSaves.length > 0 && (
            <div>
              {campaigns.length > 0 && (
                <div style={{ fontSize:10, fontWeight:700, color:MUTED, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:6, paddingLeft:4 }}>
                  Unassigned ({unassignedSaves.length})
                </div>
              )}
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {unassignedSaves.map(s => (
                  <SettlementCard key={s.id} s={s} allModifiers={allModifiers}
                    onView={onViewSettlement} deleteId={deleteId} setDeleteId={setDeleteId}
                    deleteConfirmed={deleteConfirmed} campaigns={campaigns}
                    addToCampaign={addToCampaign} removeFromCampaign={removeFromCampaign}
                    currentCampaignId={null}/>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
