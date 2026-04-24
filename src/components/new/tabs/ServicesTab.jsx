import React, { useState } from 'react';
import {C} from '../design';
import {serif, sans} from '../Primitives';
import {Ts, J0} from '../tabConstants';
import {isMobile} from '../tabConstants';
import {computeChainSets, computeChainDepthMap} from '../tabHelpers';
import {ServiceItem} from '../serviceComponents';
import {NarrativeNote} from '../NarrativeNote';

export function ServicesTab({ services, settlement, narrativeNote}) {
  const [search, setSearch] = useState('');
  const [openCats, setOpenCats] = useState({});
  const tier = settlement?.tier || 'town';
  const mobile = isMobile();
  const hasServices = services && Object.values(services).some(v => v?.length > 0);

  if (!hasServices) return (
    <div style={{padding:32,textAlign:'center',color:'#9c8068',fontSize:13}}>Generate a settlement to see available services.</div>
  );

  // Chain impairment
  const {tradeDeps, impaired, degraded, vulnerable, depReasons} = computeChainSets(settlement);
  const chainDepthMap = computeChainDepthMap(settlement);
  // Build service → chain depth lookup from active chains
  const serviceChainDepth = new Map();
  (settlement?.economicState?.activeChains||[]).forEach(chain => {
    const depth = chainDepthMap.get(chain.chainId) || 1;
    (chain.processingInstitutions||[]).forEach(inst => {
      const key = inst.toLowerCase();
      if (!serviceChainDepth.has(key) || serviceChainDepth.get(key) < depth) {
        serviceChainDepth.set(key, depth);
      }
    });
  });

  // Build flat list for search
  const allServices = [];
  Object.entries(services||{}).forEach(([cat, list]) => {
    (list||[]).forEach(svc => {
      const name = typeof svc === 'string' ? svc : svc.name || '';
      const desc = typeof svc === 'object' ? (svc.desc || '') : '';
      const inst = typeof svc === 'object' ? (svc.institution || '') : '';
      allServices.push({ cat, svc, name, desc, inst, text: `${name} ${desc} ${inst}`.toLowerCase() });
    });
  });

  const query = search.trim().toLowerCase();
  const searchResults = query ? allServices.filter(s => s.text.includes(query)) : null;
  const missing = (J0[tier] || []).filter(k => !services?.[k]?.length);
  const totalCount = allServices.length;

  // Per-category impairment counts
  const catStats = {};
  Object.entries(services||{}).forEach(([cat, list]) => {
    let imp = 0, deg = 0, vul = 0;
    (list||[]).forEach(svc => {
      const name = typeof svc === 'string' ? svc : svc.name || '';
      const inst = typeof svc === 'object' ? (svc.institution || '') : '';
      if (impaired.has(name)||impaired.has(inst)) imp++;
      else if (degraded.has(name)||degraded.has(inst)) deg++;
      else if (vulnerable.has(name)||vulnerable.has(inst)) vul++;
    });
    catStats[cat] = { total: list?.length || 0, imp, deg, vul };
  });

  const totalImpaired = Object.values(catStats).reduce((s,c) => s+c.imp, 0);
  const totalDegraded = Object.values(catStats).reduce((s,c) => s+c.deg, 0);
  const catsWithIssues = Object.entries(catStats).filter(([,c]) => c.imp>0||c.deg>0).length;

  // Category display order: strictly alphabetical — impairment is shown on each card
  const catOrder = Object.keys(services||{}).filter(k => services[k]?.length).sort((a,b) => a.localeCompare(b));

  const toggleCat = (cat) => setOpenCats(prev => ({...prev, [cat]: prev[cat] !== false ? false : true}));
  const isOpen = (cat) => openCats[cat] !== false; // default open

  return (
    <div style={{...sans}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── HEADER STRIP ────────────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#f5ede0,#ede3cc)',border:'1px solid #c8b89a',borderRadius:8,padding:'10px 14px',marginBottom:14,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:0}}>
          <span style={{fontSize:13,fontWeight:700,color:'#1c1409'}}>{totalCount} services</span>
          <span style={{fontSize:12,color:'#9c8068',marginLeft:6}}>across {catOrder.length} categories</span>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {totalImpaired>0&&<span style={{fontSize:11,fontWeight:700,color:'#7a1a1a',background:'#fde8e8',border:'1px solid #f0a0a0',borderRadius:4,padding:'2px 8px'}}> {totalImpaired} impaired</span>}
          {totalDegraded>0&&<span style={{fontSize:11,fontWeight:700,color:'#7a3a00',background:'#fff0e0',border:'1px solid #e09050',borderRadius:4,padding:'2px 8px'}}> {totalDegraded} reduced</span>}
          {missing.length>0&&<span style={{fontSize:11,fontWeight:700,color:'#7a5010',background:'#fdf8e8',border:'1px solid #e0c060',borderRadius:4,padding:'2px 8px'}}> {missing.length} missing</span>}
          {totalImpaired===0&&totalDegraded===0&&missing.length===0&&<span style={{fontSize:11,fontWeight:700,color:'#6b5340',background:'#f0ead8',border:'1px solid #d0c0a0',borderRadius:4,padding:'2px 8px'}}>✓ No impairments</span>}
        </div>
      </div>

      {/* ── SEARCH ──────────────────────────────────────────────────────── */}
      <div style={{marginBottom:14}}>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'#9c8068',fontSize:14}}></span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder='Search services — "healing", "horse", "fence", "wizard"…'
            style={{width:'100%',padding:'9px 32px',border:'1px solid #c8b89a',borderRadius:6,fontSize:13,fontFamily:'Nunito,sans-serif',color:'#1c1409',background:'rgba(250,248,244,0.97)',boxSizing:'border-box'}}/>
          {search&&<button onClick={()=>setSearch('')} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:18,color:'#9c8068',lineHeight:1,padding:0}}>×</button>}
        </div>

        {searchResults !== null && (
          <div style={{marginTop:8}}>
            {searchResults.length === 0
              ? <div style={{background:'#fdf4f4',border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',borderRadius:6,padding:'10px 14px',fontSize:13,color:'#5a1a1a'}}>
                  <strong>Not available</strong> — nothing matching "{search}" in this settlement.
                  {missing.length>0&&<span style={{color:'#6b5340'}}> Missing categories: {missing.map(k=>Ts[k]?.label).filter(Boolean).join(', ')}.</span>}
                </div>
              : <div style={{background:'#faf8f4',border:'1px solid #e0d0b0',borderLeft:'3px solid #c8b89a',borderRadius:6,padding:'10px 14px'}}>
                  <div style={{fontSize:11,fontWeight:700,color:'#6b5340',marginBottom:8}}>✓ {searchResults.length} result{searchResults.length!==1?'s':''} found</div>
                  {searchResults.map((r,i)=>(
                    <div key={i} style={{marginBottom:6}}>
                      <ServiceItem svc={r.svc} accent={Ts[r.cat]?.accent||'#1a5a28'} isCriminal={r.cat==='criminal'} tradeDeps={tradeDeps} impaired={impaired} degraded={degraded} vulnerable={vulnerable} depReasons={depReasons} chainDepth={serviceChainDepth.get((typeof r.svc==='string'?r.svc:r.svc?.institution||'').toLowerCase())}/>
                      <span style={{fontSize:10,color:'#9c8068',marginLeft:20,display:'block',marginTop:1}}>{Ts[r.cat]?.icon} {Ts[r.cat]?.label}</span>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
      </div>

      {!query && <>

        {/* ── CATEGORY HEALTH GRID ────────────────────────────────────────── */}
        {(totalImpaired>0||totalDegraded>0||missing.length>0) && (
          <div style={{marginBottom:14}}>
            <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Category Status</div>
            <div style={{display:'grid',gridTemplateColumns:mobile?'repeat(2,1fr)':'repeat(3,1fr)',gap:6}}>
              {catOrder.map(cat => {
                const meta = Ts[cat] || {label:cat,accent:'#6b5340',icon:'•'};
                const cs = catStats[cat] || {total:0,imp:0,deg:0,vul:0};
                const hasImp = cs.imp > 0;
                const hasDeg = cs.deg > 0 && !hasImp;
                const borderColor = hasImp?'#e8a0a0':hasDeg?'#e0b050':'#c8d8a0';
                const bg = hasImp?'#fdf4f4':hasDeg?'#fdf8e8':'#f4faf0';
                return (
                  <div key={cat} style={{background:bg,border:`1px solid ${borderColor}`,borderLeft:`3px solid ${hasImp?'#c0392b':hasDeg?'#b8860b':meta.accent}`,borderRadius:5,padding:'6px 10px',cursor:'pointer'}}
                    onClick={()=>{
                      setOpenCats(prev=>({...prev,[cat]:true}));
                      setTimeout(()=>{const el=document.getElementById('svc-cat-'+cat);el&&el.scrollIntoView({behavior:'smooth',block:'start'});},50);
                    }}>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <span style={{fontSize:13}}>{meta.icon}</span>
                      <span style={{fontSize:11,fontWeight:700,color:'#1c1409',flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{meta.label}</span>
                      <span style={{fontSize:10,color:'#9c8068',flexShrink:0}}>{cs.total}</span>
                    </div>
                    {(hasImp||hasDeg)&&<div style={{marginTop:3,fontSize:10,fontWeight:700,color:hasImp?'#7a1a1a':'#7a3a00'}}>
                      {hasImp&&` ${cs.imp} impaired`}{hasDeg&&` ${cs.deg} reduced`}
                    </div>}
                  </div>
                );
              })}
              {missing.map(cat => {
                const meta = Ts[cat] || {label:cat,accent:'#6b5340',icon:'•'};
                return (
                  <div key={'missing-'+cat} style={{background:'#fdf8e8',border:'1px solid #e0c060',borderLeft:'3px solid #b8860b',borderRadius:5,padding:'6px 10px',opacity:0.8}}>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <span style={{fontSize:13}}>{meta.icon}</span>
                      <span style={{fontSize:11,fontWeight:700,color:'#5a3a10',flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{meta.label}</span>
                    </div>
                    <div style={{marginTop:3,fontSize:10,fontWeight:700,color:'#7a5010'}}> not available</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── NOTABLE ABSENCES ─────────────────────────────────────────────── */}
        {missing.length > 0 && (
          <div style={{background:'#fdf8e8',border:'1px solid #e0c060',borderLeft:'3px solid #b8860b',borderRadius:6,padding:'9px 14px',marginBottom:14,fontSize:12,color:'#5a3a10'}}>
            <strong>Not available for a {tier}:</strong> {missing.map(k=>Ts[k]?.label).filter(Boolean).join(', ')} — the party will need to look elsewhere.
          </div>
        )}

        {/* ── SERVICE CATEGORIES ───────────────────────────────────────────── */}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {catOrder.map(cat => {
            const list = services[cat];
            if (!list?.length) return null;
            const meta = Ts[cat] || {label:cat,accent:'#6b5340',icon:'•'};
            const cs = catStats[cat];
            const isCriminal = cat === 'criminal';
            const open = isOpen(cat);
            const hasImp = cs.imp > 0;
            const hasDeg = cs.deg > 0;
            const accentColor = hasImp?'#c0392b':hasDeg?'#b8860b':meta.accent;

            return (
              <div key={cat} id={'svc-cat-'+cat} style={{
                background: isCriminal?'#1a0a0a':`${meta.accent}08`,
                border:`1px solid ${isCriminal?'#4a1a1a':`${meta.accent}28`}`,
                borderLeft:`3px solid ${accentColor}`,
                borderRadius:7,overflow:'hidden'
              }}>
                {/* Category toggle */}
                <button onClick={()=>toggleCat(cat)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:8,
                  padding:'10px 14px',background:'transparent',border:'none',
                  borderBottom:open?`1px solid ${isCriminal?'#3a1a1a':`${meta.accent}20`}`:'none',
                  cursor:'pointer',textAlign:'left',WebkitTapHighlightColor:'transparent'
                }}>
                  <span style={{fontSize:14}}>{meta.icon}</span>
                  <span style={{fontSize:12,fontWeight:800,color:isCriminal?'#c06060':accentColor,textTransform:'uppercase',letterSpacing:'0.06em'}}>{meta.label}</span>
                  <span style={{fontSize:11,color:isCriminal?'#8a5050':'#9c8068'}}>({cs.total})</span>
                  {hasImp&&<span style={{fontSize:10,fontWeight:700,color:'#7a1a1a',background:'#fde8e8',border:'1px solid #f0a0a0',borderRadius:3,padding:'1px 5px',marginLeft:2}}> {cs.imp} impaired</span>}
                  {!hasImp&&hasDeg&&<span style={{fontSize:10,fontWeight:700,color:'#7a3a00',background:'#fff0e0',border:'1px solid #e09050',borderRadius:3,padding:'1px 5px',marginLeft:2}}> {cs.deg} reduced</span>}
                  <span style={{fontSize:10,color:isCriminal?'#8a5050':'#9c8068',marginLeft:'auto'}}>{open?'▲':'▼'}</span>
                </button>

                {open && <div style={{padding:'10px 14px'}}>
                  {isCriminal&&meta.note&&<p style={{fontSize:11,color:'#8a5050',fontStyle:'italic',margin:'0 0 10px',lineHeight:1.5,borderLeft:'2px solid #4a1a1a',paddingLeft:8}}>{meta.note}</p>}
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {[...list].sort((a,b) => {
                      // Impaired items float to top within category
                      const na = typeof a==='string'?a:a.name||'';
                      const ia = typeof a==='object'?a.institution||'':'';
                      const nb = typeof b==='string'?b:b.name||'';
                      const ib = typeof b==='object'?b.institution||'':'';
                      const aImp = (impaired.has(na)||impaired.has(ia))?2:(degraded.has(na)||degraded.has(ia))?1:0;
                      const bImp = (impaired.has(nb)||impaired.has(ib))?2:(degraded.has(nb)||degraded.has(ib))?1:0;
                      if (bImp!==aImp) return bImp-aImp;
                      return na.localeCompare(nb);
                    }).map((svc,i)=>(
                      <ServiceItem key={i} svc={svc} accent={meta.accent} isCriminal={isCriminal}
                        tradeDeps={tradeDeps} impaired={impaired} degraded={degraded} vulnerable={vulnerable} depReasons={depReasons} chainDepth={serviceChainDepth.get((typeof svc==='string'?svc:svc?.institution||'').toLowerCase())}/>
                    ))}
                  </div>
                </div>}
              </div>
            );
          })}
        </div>

        <p style={{fontSize:11,color:'#9c8068',marginTop:12,fontStyle:'italic',textAlign:'right'}}>
          {totalCount} services · {catOrder.length} categories{totalImpaired>0?` · ${totalImpaired} impaired`:''}
        </p>
      </>}
    </div>
  );
}

export default React.memo(ServicesTab);
