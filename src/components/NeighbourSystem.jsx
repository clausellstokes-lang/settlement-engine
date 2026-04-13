import React, { useState, useRef, useEffect } from 'react';
import {Link2, X, ChevronRight, Users} from 'lucide-react';
import {GOLD, INK, MUTED, SECOND, BORDER, CARD, PARCH, sans, serif_} from './theme.js';
import { useStore } from '../store/index.js';
import { saves as savesService } from '../lib/saves.js';

const REL_TYPES = [
  { id:'neutral',          label:'Neutral',           color:'#6b5340' },
  { id:'trade_partner',    label:'Trade Partner',     color:'#1a5a28' },
  { id:'allied',           label:'Allied',            color:'#1a3a7a' },
  { id:'patron',           label:'Patron (they are)', color:'#4a1a6a' },
  { id:'client',           label:'Client (they are)', color:'#6a3a1a' },
  { id:'rival',            label:'Rival',             color:'#8a5010' },
  { id:'cold_war',         label:'Cold War',          color:'#8a3010' },
  { id:'hostile',          label:'Hostile',           color:'#8b1a1a' },
];

const REL_DESCS = {
  neutral:       'No significant relationship. Generates independently.',
  trade_partner: 'Complementary economies. Your exports fill their import gaps and vice versa. Elevated market and craft institutions.',
  allied:        'Shared military burden. Coordinated defense, open trade. Government types converge. Criminal factions suppressed.',
  patron:        'They are larger and exert strong influence. Your government type pulls toward theirs. Their factions are present as overseers. A resistance faction simmers.',
  client:        'You are the smaller dependent. You specialize in what they need. They handle your defense. Quiet resentment factions form.',
  rival:         'Competing for the same trade routes, export markets, and ideological legitimacy. Elevated defense AND economy (arms race + market fight). Both mirror and antithetical government/factions.',
  cold_war:      'Surface diplomatic normalcy hiding deep hostility. Peak espionage. Both your faction types AND their opposites appear simultaneously. Criminal institutions elevated.',
  hostile:       'Active conflict. Trade suppressed. Defense maximized. Strong ideological antithesis in government and factions. War profiteers active.',
};

function RelTypeButton({ rel, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(rel.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', borderRadius: 6,
        border: `1px solid ${selected ? rel.color : BORDER}`,
        background: selected ? `${rel.color}14` : CARD,
        cursor: 'pointer', textAlign: 'left', width: '100%',
        fontFamily: sans, transition: 'all 0.1s',
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: rel.color, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: selected ? 700 : 600, color: selected ? rel.color : INK, flex: 1 }}>
        {rel.label}
      </span>
      {selected && <ChevronRight size={12} color={rel.color} />}
    </button>
  );
}

function SavedSettlementCard({ save, selected, onSelect }) {
  const s = save.settlement;
  const hasNetwork = (s?.neighbourNetwork?.length || 0) > 0;
  return (
    <button
      onClick={() => onSelect(save)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 6, width: '100%',
        border: `1px solid ${selected ? GOLD : BORDER}`,
        background: selected ? `${GOLD}14` : CARD,
        cursor: 'pointer', textAlign: 'left', fontFamily: sans,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: INK, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {save.name}
        </div>
        <div style={{ fontSize: 10, color: MUTED, display: 'flex', gap: 6, marginTop: 1, alignItems: 'center' }}>
          <span>{save.tier}</span>
          {s?.economicState?.prosperityLevel && <span>· {s.economicState.prosperityLevel}</span>}
          {hasNetwork && <><Link2 size={9} /><span>{s.neighbourNetwork.length} links</span></>}
        </div>
      </div>
      {selected && <ChevronRight size={13} color={GOLD} />}
    </button>
  );
}

export default function NeighbourSystem() {
  const onImportDirect = useStore(s => s.handleImportDirect);
  const importedNeighbor = useStore(s => s.importedNeighbour);
  const onClearNeighbor = useStore(s => s.clearNeighbour);
  const onRelTypeChange = useStore(s => s.setNeighbourRelType);
  const relType = useStore(s => s.neighbourRelType);
  const [saves, setSaves] = useState([]);
  const [selectedSave, setSelectedSave] = useState(null);
  const [activeTab, setActiveTab] = useState('saved'); // 'saved' | 'import'
  const [localRelType, setLocalRelType] = useState(relType || 'neutral');
  const [relOpen, setRelOpen] = useState(false);

  // Load saves on mount (async — works for both Supabase and localStorage)
  useEffect(() => {
    let cancelled = false;
    savesService.list().then(result => {
      if (!cancelled) setSaves(result);
    }).catch(() => {});
    // Also listen for localStorage changes in local-only mode
    const onStorage = () => {
      savesService.list().then(result => setSaves(result)).catch(() => {});
    };
    window.addEventListener('storage', onStorage);
    return () => { cancelled = true; window.removeEventListener('storage', onStorage); };
  }, []);

  const handleRelType = (rt) => {
    setLocalRelType(rt);
    onRelTypeChange?.(rt);
  };

  const handleUseSave = () => {
    if (!selectedSave?.settlement) return;
    // Pass the settlement JSON directly and trigger import in one shot
    const json = JSON.stringify(selectedSave.settlement);
    onImportDirect?.(json);
  };

  const selectedRelType = REL_TYPES.find(r => r.id === localRelType) || REL_TYPES[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* ── Active neighbour status ─────────────────────────────────────── */}
      {importedNeighbor && (
        <div style={{
          background: '#f0faf2', border: '2px solid #4a8a60', borderRadius: 8,
          padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link2 size={16} style={{ color: '#1a5a28' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#1a5a28', fontSize: 13 }}>
                Active Neighbour: {importedNeighbor.name}
              </div>
              <div style={{ fontSize: 11, color: '#2d7a44', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>{importedNeighbor.tier}</span>
                <span>·</span>
                <span style={{ color: selectedRelType.color, fontWeight: 700 }}>
                  {selectedRelType.label}
                </span>
                <span>·</span>
                <span>Generate a settlement to use this neighbour</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClearNeighbor}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: MUTED, padding: 4 }}
            title="Clear neighbour"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* ── Relationship type selector (collapsible) ─────────────────────── */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
        <button
          onClick={() => setRelOpen(v => !v)}
          style={{ width: '100%', padding: '10px 14px', background: PARCH, border: 'none',
            borderBottom: relOpen ? `1px solid ${BORDER}` : 'none',
            display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', textAlign: 'left' }}
        >
          <Link2 size={14} style={{ color: GOLD }} />
          <span style={{ fontFamily: serif_, fontSize: 15, fontWeight: 600, color: INK, flex: 1 }}>
            Relationship Type
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: selectedRelType.color,
            background: `${selectedRelType.color}14`, border: `1px solid ${selectedRelType.color}40`,
            borderRadius: 10, padding: '2px 10px' }}>
            {selectedRelType.label}
          </span>
          <span style={{ fontSize: 11, color: MUTED, marginLeft: 4 }}>{relOpen ? '▲' : '▼'}</span>
        </button>
        {relOpen && (
          <>
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {REL_TYPES.map(rel => (
                <RelTypeButton key={rel.id} rel={rel} selected={localRelType === rel.id} onSelect={(rt) => { handleRelType(rt); setRelOpen(false); }} />
              ))}
            </div>
            {localRelType && (
              <div style={{ padding: '8px 14px 12px', borderTop: `1px solid ${BORDER}`, fontSize: 11, color: SECOND, lineHeight: 1.55, fontStyle: 'italic' }}>
                {REL_DESCS[localRelType]}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Neighbour source tabs ───────────────────────────────────────── */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
          {[['saved', 'Saved Settlements']].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, padding: '9px 0', fontSize: 11, fontWeight: 700,
              fontFamily: sans, border: 'none', cursor: 'pointer',
              background: activeTab === id ? CARD : PARCH,
              color: activeTab === id ? INK : MUTED,
              borderBottom: activeTab === id ? `2px solid ${GOLD}` : '2px solid transparent',
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Saved settlements tab */}
        {activeTab === 'saved' && (
          <div style={{ padding: 12 }}>
            {saves.length === 0 ? (
              <div style={{ padding: '16px 0', textAlign: 'center', fontSize: 12, color: MUTED }}>
                <Users size={20} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                No saved settlements yet. Generate one and save it from the Settlements tab.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
                {saves.map(s => (
                  <SavedSettlementCard
                    key={s.id}
                    save={s}
                    selected={selectedSave?.id === s.id}
                    onSelect={sv => setSelectedSave(selectedSave?.id === sv.id ? null : sv)}
                  />
                ))}
              </div>
            )}
            {selectedSave && (
              <button
                onClick={handleUseSave}
                style={{
                  width: '100%', padding: '10px 0', background: GOLD, color: '#fff',
                  border: 'none', borderRadius: 6, cursor: 'pointer',
                  fontFamily: serif_, fontSize: 14, fontWeight: 600,
                }}
              >
                Set "{selectedSave.name}" as {selectedRelType.label} Neighbour & Go to Generate
              </button>
            )}
          </div>
        )}

        {/* JSON import tab */}
        
      </div>

      {/* ── How it affects generation ───────────────────────────────────── */}
      <div style={{ background: '#f8f4ee', border: `1px solid ${BORDER}`, borderRadius: 8, padding: '10px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
          What the neighbour affects
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[
            ['Institutions', 'Defense, market, craft, criminal probabilities shift by relationship type'],
            ['Economy',      'Exports/imports align as complement, competitor, or dependent based on relationship'],
            ['Factions',     'Neighbour faction types appear as agents, collaborators, or resistance movements'],
            ['Government',   'Pulls toward mirror or antithetical government type depending on relationship'],
            ['History',      'Key events reference the neighbouring settlement and relationship context'],
          ].map(([title, desc]) => (
            <div key={title} style={{ display: 'flex', gap: 8, fontSize: 11 }}>
              <span style={{ color: GOLD, fontWeight: 700, flexShrink: 0, width: 80 }}>{title}</span>
              <span style={{ color: SECOND, lineHeight: 1.4 }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
