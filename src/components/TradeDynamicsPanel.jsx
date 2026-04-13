import React, { useState, useMemo } from 'react';
import ControlsStrip from './ControlsStrip.jsx';
import {GOLD, INK, MUTED, SECOND, BORDER, sans} from './theme.js';
import { useStore } from '../store/index.js';
import { selectTierForGrid } from '../store/selectors.js';
import {SERVICE_TIER_DATA} from '../generators/servicesGenerator';
import {TIER_ORDER} from '../generators/helpers';

const CAT_COLORS = {
  agricultural:  { bg:'#f0faf2', text:'#1a5a28', label:'Agricultural' },
  raw_materials: { bg:'#faf4e8', text:'#7a5010', label:'Raw Material'  },
  manufactured:  { bg:'#f0f4ff', text:'#1a2a8a', label:'Manufactured'  },
  luxury:        { bg:'#faf0ff', text:'#6a1a8a', label:'Luxury'         },
  services:      { bg:'#f0f8ff', text:'#1a5a8a', label:'Service'        },
  food_processed:{ bg:'#fff4e8', text:'#8a4010', label:'Processed'      },
};

function catColor(cat) {
  return CAT_COLORS[String(cat||'').toLowerCase()] || { bg:'#f7f0e4', text:SECOND, label:'' };
}

function getGoodsForTier(tier) {
  if (!tier) return [];
  if (tier === 'all') {
    const seen = new Set(), out = [];
    (TIER_ORDER||[]).forEach(t => {
      const data = SERVICE_TIER_DATA[t] || {};
      Object.entries(data).forEach(([name,def]) => {
        if (!seen.has(name)) { seen.add(name); out.push({name,...def,_tier:t}); }
      });
    });
    return out;
  }
  const data = SERVICE_TIER_DATA[tier] || {};
  return Object.entries(data).map(([name,def]) => ({name,...def}));
}

function goodKey(tier, goodName) { return `${tier}_good_${goodName}`; }

// Card-click cycle: allow → force → exclude → allow
function GoodCard({ good, state, onCycle }) {
  const { allow, force, forceExclude } = state;
  const cc          = catColor(good.category);
  const isForced    = force && !forceExclude;
  const isExcluded  = forceExclude;
  const isAllowed   = !isForced && !isExcluded;

  const bg         = isForced ? '#efe8d0' : '#faf6ef';
  const borderLeft = `3px solid ${isForced ? GOLD : 'transparent'}`;
  const labelText  = isForced ? ' Forced' : isExcluded ? '✕ Excluded' : '○ Allow';
  const labelColor = isForced ? GOLD : MUTED;

  return (
    <div onClick={onCycle} style={{
      display:'flex', alignItems:'flex-start', gap:8,
      padding:'6px 12px 6px 10px',
      background:bg, borderLeft, borderBottom:'1px solid #f0e8d8',
      cursor:'pointer', userSelect:'none', WebkitTapHighlightColor:'transparent',
       transition:'background 0.1s',
    }}>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:'flex', alignItems:'baseline', gap:6, flexWrap:'wrap'}}>
          <span style={{fontWeight:600, fontSize:12, color:isExcluded?MUTED:INK, textDecoration:isExcluded?'line-through':'none'}}>{good.name}</span>
          {cc.label && <span style={{fontSize:10, fontWeight:700, color:cc.text, background:cc.bg, borderRadius:3, padding:'0 4px'}}>{cc.label}</span>}
          {good.requiredInstitution && <span style={{fontSize:10, color:MUTED, fontStyle:'italic'}}>needs {good.requiredInstitution}</span>}
        </div>
        {good.desc && <p style={{fontSize:11, color:SECOND, lineHeight:1.3, marginTop:1, marginBottom:0}}>{good.desc}</p>}
      </div>
      <span style={{fontSize:9, fontWeight:700, color:labelColor, flexShrink:0, marginTop:2, letterSpacing:'0.03em'}}>{labelText}</span>
    </div>
  );
}

function SectionHeader({ label, forced, allowed, total, isOpen, onToggle }) {
  return (
    <button onClick={onToggle} style={{
      width:'100%', display:'flex', alignItems:'center', gap:8, padding:'7px 12px',
      background: isOpen ? '#f0ead8' : '#faf4e8',
      border:'none', borderTop:'1px solid #e0d0b0',
      cursor:'pointer', textAlign:'left', fontFamily:sans,
      WebkitTapHighlightColor:'transparent',
    }}>
      <span style={{flex:1, display:'flex', alignItems:'center', gap:6}}>
        <span style={{fontSize:12, fontWeight:700, color:INK, fontFamily:"'Crimson Text', Georgia, serif"}}>{label}</span>
        {forced>0 && <span style={{fontSize:9, fontWeight:800, color:GOLD, background:`${GOLD}20`, borderRadius:3, padding:'1px 5px'}}>{forced} forced</span>}
      </span>
      {forced===0 && <span style={{fontSize:9, color:MUTED, background:'#ede3cc', borderRadius:3, padding:'1px 5px'}}>{allowed} allowed</span>}
      {forced>0 && <>
        <span style={{fontSize:9, color:MUTED, background:'#ede3cc', borderRadius:3, padding:'1px 5px'}}>{allowed} allowed</span>
        <span style={{fontSize:9, fontWeight:700, color:GOLD, background:`${GOLD}20`, borderRadius:3, padding:'1px 5px'}}>{forced} forced</span>
      </>}
      <span style={{fontSize:10, color:MUTED, marginLeft:4}}>{isOpen ? '▲' : '▼'}</span>
    </button>
  );
}

function GoodsPanel() {
  const tier = useStore(selectTierForGrid);
  const goodsToggles = useStore(s => s.goodsToggles);
  const onGoodsToggle = useStore(s => s.toggleGood);
  const setGoodsToggles = useStore(s => s.setGoodsToggles);
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('all');

  const goods = useMemo(() => {
    if (tier === 'all') {
      const seen = new Set(), out = [];
      (TIER_ORDER||[]).forEach(t => {
        getGoodsForTier(t).forEach(g => { if (!seen.has(g.name)) { seen.add(g.name); out.push({...g,_tier:t}); } });
      });
      return out;
    }
    return getGoodsForTier(tier);
  }, [tier]);

  const getKey = name => {
    if (tier === 'all') {
      for (const t of (TIER_ORDER||[])) {
        if (getGoodsForTier(t).find(g=>g.name===name)) return goodKey(t, name);
      }
    }
    return goodKey(tier, name);
  };

  const getState = good => {
    const val = goodsToggles[getKey(good.name)];
    if (val==null) return { allow: good.on!==false, force: false, forceExclude: false };
    if (typeof val==='object') return { allow: val.allow??true, force: val.force??false, forceExclude: val.forceExclude??false };
    return { allow:!!val, force:false, forceExclude:false };
  };

  // Cycle: allow → force → exclude → allow
  const cycleGood = good => {
    const cur = getState(good);
    let next;
    if (cur.forceExclude)   next = { allow:true,  force:false, forceExclude:false }; // exclude → allow
    else if (cur.force)     next = { allow:false, force:false, forceExclude:true  }; // force   → exclude
    else                    next = { allow:true,  force:true,  forceExclude:false }; // allow   → force
    onGoodsToggle(getKey(good.name), next);
  };

  // Bulk operations
  const bulkForce   = () => goods.forEach(g => onGoodsToggle(getKey(g.name), { allow:true,  force:true,  forceExclude:false }));
  const bulkExclude = () => goods.forEach(g => onGoodsToggle(getKey(g.name), { allow:false, force:false, forceExclude:true  }));

  const filtered = search
    ? goods.filter(g => g.name.toLowerCase().includes(search.toLowerCase()) || (g.desc||'').toLowerCase().includes(search.toLowerCase()) || (g.category||'').toLowerCase().includes(search.toLowerCase()))
    : goods;

  const sortedAll = [...filtered].sort((a,b) => a.name.localeCompare(b.name));
  const sorted = filterMode==='all' ? sortedAll
    : filterMode==='forced' ? sortedAll.filter(g => { const s=getState(g); return s.force&&!s.forceExclude; })
    : sortedAll.filter(g => getState(g).forceExclude);
  const excludedCount = goods.filter(g => getState(g).forceExclude).length;
  const forcedCount   = goods.filter(g => { const s=getState(g); return s.force&&!s.forceExclude; }).length;
  const allowedCount  = goods.filter(g => { const s=getState(g); return !s.force&&!s.forceExclude; }).length;

  return (
    <div style={{border:`1px solid ${BORDER}`, borderRadius:0, borderTop:'none'}}>
      <ControlsStrip
        search={search}
        setSearch={setSearch}
        placeholder="Search goods…"
        onForceAll={bulkForce}
        onReset={() => setGoodsToggles({})}
        onExcludeAll={bulkExclude}
        onExpandAll={() => { setShowExport(true); setShowImport(true); }}
        onCollapseAll={() => { setShowExport(false); setShowImport(false); }}
        forcedCount={forcedCount}
        excludedCount={excludedCount}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        tier={tier}
      />

      <SectionHeader label="Export Goods" forced={forcedCount} allowed={allowedCount+forcedCount} total={goods.length} isOpen={showExport} onToggle={()=>setShowExport(v=>!v)}/>
      {showExport && (
        <div style={{maxHeight:360, overflowY:'auto', background:'#faf6ef'}}>
          {sorted.length===0 && search
            ? <div style={{padding:12, textAlign:'center', color:MUTED, fontSize:12, fontStyle:'italic'}}>No goods match "{search}"</div>
            : sorted.map(g => <GoodCard key={g.name} good={g} state={getState(g)} onCycle={()=>cycleGood(g)}/>)
          }
        </div>
      )}

      <SectionHeader label="Import Goods" forced={0} allowed={allowedCount+forcedCount} total={goods.length} isOpen={showImport} onToggle={()=>setShowImport(v=>!v)}/>
      {showImport && (
        <div style={{maxHeight:360, overflowY:'auto', background:'#faf6ef'}}>
          {sorted.length===0 && search
            ? <div style={{padding:12, textAlign:'center', color:MUTED, fontSize:12, fontStyle:'italic'}}>No goods match "{search}"</div>
            : sorted.map(g => <GoodCard key={g.name} good={g} state={getState(g)} onCycle={()=>cycleGood(g)}/>)
          }
        </div>
      )}
    </div>
  );
}

export default function TradeDynamicsPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{border:`1px solid ${BORDER}`, borderRadius:8}}>
      <button onClick={()=>setOpen(v=>!v)} style={{width:'100%', display:'flex', alignItems:'center', gap:8, padding:'10px 14px', background:'#f5ede0', border:'none', cursor:'pointer', textAlign:'left', borderBottom:open?'1px solid #e0d0b0':'none', fontFamily:sans}}>
        <span style={{fontSize:15}}></span>
        <span style={{fontFamily:'Crimson Text, Georgia, serif', fontSize:16, fontWeight:600, color:INK, flex:1}}>Step 4: Trade Dynamics</span>
        <span style={{fontSize:11, color:MUTED, fontWeight:500}}>{open ? 'Collapse' : 'Configure Trade'}</span>
      </button>
      {open && <GoodsPanel />}
    </div>
  );
}
