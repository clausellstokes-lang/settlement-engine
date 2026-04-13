import React, { useState, useMemo } from 'react';
import {INSTITUTION_SERVICES} from '../data/tradeGoodsData';
import ControlsStrip from './ControlsStrip.jsx';
import {GOLD, INK, MUTED, SECOND, sans} from './theme.js';
import { useStore } from '../store/index.js';
import { selectTierForGrid, selectCurrentCatalog } from '../store/selectors.js';

function matchServiceName(instName) {
  const lower = instName.toLowerCase().split(/[\s'(),\-\/]+/).filter(w=>w.length>2);
  let best=null, bestScore=0;
  for (const key of Object.keys(INSTITUTION_SERVICES)) {
    const kw = key.toLowerCase().split(/[\s'(),\-\/]+/).filter(w=>w.length>2);
    let score=0;
    for (const kp of kw) for (const lp of lower) {
      if (kp===lp) score+=2;
      else if (kp.length>3&&lp.startsWith(kp)) score+=1;
      else if (lp.length>4&&kp.startsWith(lp)) score+=1;
    }
    const norm = kw.length>0 ? score/(kw.length*2) : 0;
    if (score>bestScore||(score===bestScore&&score>0&&norm>(bestScore/(kw.length*2||1)))) {
      bestScore=score; best=key;
    }
  }
  return bestScore>0?best:null;
}

// Card-click cycle: allow → force → exclude → allow
function ServiceCard({ svcName, def, toggled, onCycle }) {
  const { allow, force, forceExclude } = toggled;
  const isForced   = force && !forceExclude;
  const isExcluded = forceExclude;
  const isAllowed  = !isForced && !isExcluded;

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
        <div style={{display:'flex', alignItems:'center', gap:6, flexWrap:'wrap'}}>
          <span style={{fontWeight:600, fontSize:12, color:isExcluded?MUTED:INK, textDecoration:isExcluded?'line-through':'none'}}>{svcName}</span>
          {def.requiredInstitution&&<span style={{fontSize:10,color:MUTED,fontStyle:'italic'}}>needs {def.requiredInstitution}</span>}
        </div>
        {def.desc&&<p style={{fontSize:11,color:SECOND,lineHeight:1.3,margin:'1px 0 0'}}>{def.desc}</p>}
      </div>
      <span style={{fontSize:9,fontWeight:700,color:labelColor,flexShrink:0,marginTop:2,letterSpacing:'0.03em'}}>{labelText}</span>
    </div>
  );
}

export default function ServicesTogglePanel() {
  const tier = useStore(selectTierForGrid);
  const currentCatalog = useStore(selectCurrentCatalog);
  const servicesToggles = useStore(s => s.servicesToggles);
  const onServiceToggle = useStore(s => s.toggleService);
  const setServiceToggles = useStore(s => s.setServiceToggles);
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState('');
  const [filterMode, setFilterMode] = useState('all');

  const instServiceMap = useMemo(() => {
    const map = {};
    Object.values(currentCatalog).forEach(cat => {
      Object.keys(cat).forEach(instName => {
        const svcKey = matchServiceName(instName);
        if (!svcKey || !INSTITUTION_SERVICES[svcKey]) return;
        if (!map[svcKey]) map[svcKey] = { catalogNames:[], services:INSTITUTION_SERVICES[svcKey] };
        if (!map[svcKey].catalogNames.includes(instName)) map[svcKey].catalogNames.push(instName);
      });
    });
    return map;
  }, [currentCatalog]);

  const toggleKey = (instName, svcName) => `${instName}_service_${svcName}`;

  const getToggle = (catalogName, svcKey, svcName, def) => {
    const k1 = toggleKey(catalogName, svcName);
    const k2 = toggleKey(svcKey, svcName);
    const val = servicesToggles[k1] ?? servicesToggles[k2];
    if (val==null) return { allow: def.on!==false, force: false, forceExclude: false };
    if (typeof val==='object') return { allow: val.allow??true, force: val.force??false, forceExclude: val.forceExclude??false };
    return { allow: !!val, force: false, forceExclude: false };
  };

  // Cycle: allow → force → exclude → allow
  const cycleService = (catalogName, svcKey, svcName, def) => {
    const cur = getToggle(catalogName, svcKey, svcName, def);
    let next;
    if (cur.forceExclude)       next = { allow:true,  force:false, forceExclude:false }; // exclude → allow
    else if (cur.force)         next = { allow:false, force:false, forceExclude:true  }; // force   → exclude
    else                        next = { allow:true,  force:true,  forceExclude:false }; // allow   → force
    onServiceToggle(toggleKey(catalogName, svcName), next);
  };

  // Bulk operations
  const bulkForce = () => {
    Object.entries(instServiceMap).forEach(([svcKey, {catalogNames, services}]) => {
      const catName = catalogNames[0] || svcKey;
      Object.keys(services).forEach(svcName => {
        onServiceToggle(toggleKey(catName, svcName), { allow:true, force:true, forceExclude:false });
      });
    });
  };
  const bulkExclude = () => {
    Object.entries(instServiceMap).forEach(([svcKey, {catalogNames, services}]) => {
      const catName = catalogNames[0] || svcKey;
      Object.keys(services).forEach(svcName => {
        onServiceToggle(toggleKey(catName, svcName), { allow:false, force:false, forceExclude:true });
      });
    });
  };

  const totals = useMemo(() => {
    let total=0, on=0, forced=0, excluded=0;
    Object.entries(instServiceMap).forEach(([svcKey, {catalogNames, services}]) => {
      const catName = catalogNames[0] || svcKey;
      Object.entries(services).forEach(([svcName, def]) => {
        total++;
        const t = getToggle(catName, svcKey, svcName, def);
        if (t.forceExclude) excluded++;
        else if (t.force) forced++;
        else if (t.allow) on++;
      });
    });
    return { total, on, forced, excluded };
  }, [instServiceMap, servicesToggles]);

  const filtered = Object.fromEntries(Object.entries(
    search
    ? Object.fromEntries(Object.entries(instServiceMap).filter(([key, {services}]) =>
        key.toLowerCase().includes(search.toLowerCase()) ||
        Object.entries(services).some(([n,d]) => n.toLowerCase().includes(search.toLowerCase()) || (d.desc||'').toLowerCase().includes(search.toLowerCase()))
      ))
    : instServiceMap
  ).filter(([svcKey, {catalogNames, services}]) => {
    if (filterMode === 'all') return true;
    const catName = catalogNames[0] || svcKey;
    const svcEntries = Object.entries(services);
    if (filterMode === 'forced') return svcEntries.some(([n,d]) => getToggle(catName,svcKey,n,d).force);
    if (filterMode === 'excluded') return svcEntries.some(([n,d]) => getToggle(catName,svcKey,n,d).forceExclude);
    return true;
  }));

  if (Object.keys(instServiceMap).length === 0) {
    return <div style={{padding:'14px 16px', background:'#faf8f4', fontSize:13, color:MUTED}}>
      No services available at this tier.
    </div>;
  }

  return (
    <div>
      <ControlsStrip
        search={search}
        setSearch={setSearch}
        placeholder="Search services…"
        onForceAll={bulkForce}
        onReset={() => setServiceToggles({})}
        onExcludeAll={bulkExclude}
        onExpandAll={() => setExpanded(Object.fromEntries(Object.keys(filtered).map(k=>[k,true])))}
        onCollapseAll={() => setExpanded({})}
        forcedCount={totals.forced}
        excludedCount={totals.excluded}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        tier={tier}
      />

      {/* Institution groups */}
      <div>
        {Object.keys(filtered).length === 0 && search
          ? <div style={{padding:16, textAlign:'center', color:MUTED, fontSize:12, fontStyle:'italic'}}>No services match "{search}"</div>
          : Object.entries(filtered).sort(([a],[b]) => a.localeCompare(b)).map(([svcKey, {catalogNames, services}]) => {
              const isOpen = !!expanded[svcKey];
              const catName = catalogNames[0] || svcKey;
              const svcEntries = Object.entries(services);
              const forcedCount = svcEntries.filter(([n,d]) => getToggle(catName,svcKey,n,d).force).length;
              const allowedCount = svcEntries.filter(([n,d]) => { const t=getToggle(catName,svcKey,n,d); return t.allow&&!t.force; }).length;

              return (
                <div key={svcKey} style={{borderBottom:'1px solid #e8dcc8'}}>
                  <button onClick={()=>setExpanded(e=>({...e,[svcKey]:!e[svcKey]}))}
                    style={{width:'100%', display:'flex', alignItems:'center', gap:8, padding:'7px 12px',
                      background: isOpen ? '#f0ead8' : '#faf4e8',
                      border:'none', borderTop:'1px solid #e0d0b0', cursor:'pointer', textAlign:'left', fontFamily:sans,
                      WebkitTapHighlightColor:'transparent',
                    }}>
                    <span style={{flex:1, display:'flex', alignItems:'center', gap:6}}>
                        <span style={{fontSize:12, fontWeight:700, color:'#1c1409', fontFamily:'Crimson Text, Georgia, serif'}}>{catName}</span>
                        {forcedCount>0 && <span style={{fontSize:9, fontWeight:800, color:GOLD, background:`${GOLD}18`, borderRadius:3, padding:'1px 5px'}}>{forcedCount} forced</span>}
                      </span>
                    {forcedCount===0 && <span style={{fontSize:9, color:MUTED, background:'#ede3cc', borderRadius:3, padding:'1px 5px'}}>{allowedCount} allowed</span>}
                    {forcedCount>0 && <>
                      <span style={{fontSize:9, color:MUTED, background:'#ede3cc', borderRadius:3, padding:'1px 5px'}}>{allowedCount} allowed</span>
                      <span style={{fontSize:9, fontWeight:700, color:GOLD, background:`${GOLD}20`, borderRadius:3, padding:'1px 5px'}}>{forcedCount} forced</span>
                    </>}
                    <span style={{fontSize:9, color:MUTED, marginLeft:4}}>{svcEntries.length}</span>
                    <span style={{fontSize:10, color:MUTED}}>{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div>
                      {svcEntries.map(([svcName, def]) => {
                        const tog = getToggle(catName, svcKey, svcName, def);
                        return (
                          <ServiceCard key={svcName} svcName={svcName} def={def} toggled={tog}
                            onCycle={() => cycleService(catName, svcKey, svcName, def)}/>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
        }
      </div>
    </div>
  );
}
