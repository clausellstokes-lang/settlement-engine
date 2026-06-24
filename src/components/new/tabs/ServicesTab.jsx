import React, { useState } from 'react';
import { FS, MUTED, swatch } from '../../theme.js';
import IconButton from '../../primitives/IconButton.jsx';
import { sans, TabIntro } from '../Primitives';
import {Ts, J0} from '../tabConstants';
import {useIsMobileTab} from '../tabConstants';
import {computeChainSets, computeChainDepthMap} from '../tabHelpers';
import {ServiceItem} from '../serviceComponents';
import {compromisedSecurityInstitutions} from '../../../domain/corruption.js';
import {NarrativeNote} from '../NarrativeNote';

export function ServicesTab({ services, settlement, narrativeNote}) {
  const [search, setSearch] = useState('');
  const [openCats, setOpenCats] = useState({});
  const tier = settlement?.tier || 'town';
  const mobile = useIsMobileTab();
  const hasServices = services && Object.values(services).some(v => v?.length > 0);

  if (!hasServices) return (
    <div style={{padding:32,textAlign:'center',color:MUTED,fontSize:FS.md}}>No services on offer here yet.</div>
  );

  // Chain impairment
  const {tradeDeps, impaired, degraded, vulnerable, depReasons} = computeChainSets(settlement);
  // Compromised institutions — surfaced as an explicit 'Compromised' marker on
  // the service row. An institution is compromised when it carries a
  // 'corruption' impairment (revealed by a scandal or marked in-chain by an
  // institution-scope Impose Corruption) or when a corrupt NPC is homed inside
  // a security institution (covert). compromisedSecurityInstitutions already
  // distinguishes covert vs revealed; we fold in any 'corruption'-impaired
  // institution so non-security captures show too. Two-channel: this drives a
  // text label and a colour, never colour alone.
  const compromised = (() => {
    const map = new Map(); // lowercased name → 'covert' | 'revealed'
    const { covert, revealed } = compromisedSecurityInstitutions(settlement);
    covert.forEach(n => map.set(String(n).toLowerCase(), 'covert'));
    revealed.forEach(n => map.set(String(n).toLowerCase(), 'revealed'));
    (settlement?.institutions || []).forEach(inst => {
      const imp = (inst.impairments || []).find(i => i?.type === 'corruption');
      if (!imp) return;
      const key = String(inst.name || '').toLowerCase();
      // A covert in-chain mark reads 'covert'; a public scandal reads 'revealed'.
      map.set(key, imp.covert ? 'covert' : 'revealed');
    });
    return map;
  })();
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
  const hasCustom = allServices.some(s => typeof s.svc === 'object' && (s.svc.custom === true || s.svc.source === 'custom'));

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
  const _catsWithIssues = Object.entries(catStats).filter(([,c]) => c.imp>0||c.deg>0).length;

  // Category display order: strictly alphabetical — impairment is shown on each card
  const catOrder = Object.keys(services||{}).filter(k => services[k]?.length).sort((a,b) => a.localeCompare(b));

  const toggleCat = (cat) => setOpenCats(prev => ({...prev, [cat]: prev[cat] !== false ? false : true}));
  const isOpen = (cat) => openCats[cat] !== false; // default open

  return (
    <div style={{...sans}}>
      <TabIntro tabKey="services" />
      <NarrativeNote note={narrativeNote} />

      {/* ── HEADER STRIP ────────────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#f5ede0,#ede3cc)',border:'1px solid #c8b89a',borderRadius:8,padding:'10px 14px',marginBottom:14,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:0}}>
          <span style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag}}>{totalCount} services</span>
          <span style={{fontSize:FS.sm,color:MUTED,marginLeft:6}}>across {catOrder.length} categories</span>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {totalImpaired>0&&<span style={{fontSize:FS.xs,fontWeight:700,color:swatch['#7A1A1A'],background:swatch['#FDE8E8'],border:'1px solid #f0a0a0',borderRadius:4,padding:'2px 8px'}}> {totalImpaired} impaired</span>}
          {totalDegraded>0&&<span style={{fontSize:FS.xs,fontWeight:700,color:swatch['#7A3A00'],background:swatch['#FFF0E0'],border:'1px solid #e09050',borderRadius:4,padding:'2px 8px'}}> {totalDegraded} reduced</span>}
          {missing.length>0&&<span style={{fontSize:FS.xs,fontWeight:700,color:swatch['#7A5010'],background:swatch['#FDF8E8'],border:'1px solid #e0c060',borderRadius:4,padding:'2px 8px'}}> {missing.length} missing</span>}
          {totalImpaired===0&&totalDegraded===0&&missing.length===0&&<span style={{fontSize:FS.xs,fontWeight:700,color:swatch.inkMag3,background:swatch['#F0EAD8'],border:'1px solid #d0c0a0',borderRadius:4,padding:'2px 8px'}}>✓ No impairments</span>}
        </div>
      </div>

      {/* ── SEARCH ──────────────────────────────────────────────────────── */}
      <div style={{marginBottom:14}}>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:MUTED,fontSize: FS['14']}}></span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            aria-label="Search services"
            placeholder='Search services, "healing", "horse", "fence", "wizard"…'
            style={{width:'100%',padding:'9px 32px',border:'1px solid #c8b89a',borderRadius:6,fontSize:FS.md,fontFamily:'Nunito,sans-serif',color:swatch.inkMag,background:'rgba(250,248,244,0.97)',boxSizing:'border-box'}}/>
          {search&&<span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',display:'inline-flex'}}><IconButton glyph={'✕'} label="Clear search" onClick={()=>setSearch('')} tone="ghost" size="sm" /></span>}
        </div>

        {searchResults !== null && (
          <div style={{marginTop:8}}>
            {searchResults.length === 0
              ? <div style={{background:swatch.dangerBg,border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',borderRadius:6,padding:'10px 14px',fontSize:FS.md,color:swatch['#5A1A1A']}}>
                  <strong>Not available</strong>. Nothing matching "{search}" in this settlement.
                  {missing.length>0&&<span style={{color:swatch.inkMag3}}> Missing categories: {missing.map(k=>Ts[k]?.label).filter(Boolean).join(', ')}.</span>}
                </div>
              : <div style={{background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderLeft:'3px solid #c8b89a',borderRadius:6,padding:'10px 14px'}}>
                  <div style={{fontSize:FS.xs,fontWeight:700,color:swatch.inkMag3,marginBottom:8}}>✓ {searchResults.length} result{searchResults.length!==1?'s':''} found</div>
                  {searchResults.map((r,i)=>(
                    <div key={i} style={{marginBottom:6}}>
                      <ServiceItem svc={r.svc} accent={Ts[r.cat]?.accent||'#1a5a28'} isCriminal={r.cat==='criminal'} tradeDeps={tradeDeps} impaired={impaired} degraded={degraded} vulnerable={vulnerable} compromised={compromised} depReasons={depReasons} chainDepth={serviceChainDepth.get((typeof r.svc==='string'?r.svc:r.svc?.institution||'').toLowerCase())}/>
                      <span style={{fontSize:FS.xxs,color:MUTED,marginLeft:20,display:'inline-flex',alignItems:'center',gap:4,marginTop:1}}>{Ts[r.cat]?.label}</span>
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
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Category Status</div>
            <div style={{display:'grid',gridTemplateColumns:mobile?'repeat(2,1fr)':'repeat(3,1fr)',gap:6}}>
              {catOrder.map(cat => {
                const meta = Ts[cat] || {label:cat,accent:'#6b5340'};
                const cs = catStats[cat] || {total:0,imp:0,deg:0,vul:0};
                const hasImp = cs.imp > 0;
                const hasDeg = cs.deg > 0 && !hasImp;
                const borderColor = hasImp?'#e8a0a0':hasDeg?'#e0b050':'#c8d8a0';
                const bg = hasImp?'#fdf4f4':hasDeg?'#fdf8e8':'#f4faf0';
                return (
                  <div key={cat} role="button" tabIndex={0} aria-label={`Show ${meta.label} services`} style={{background:bg,border:`1px solid ${borderColor}`,borderLeft:`3px solid ${hasImp?'#c0392b':hasDeg?'#b8860b':meta.accent}`,borderRadius:5,padding:'6px 10px',cursor:'pointer'}}
                    onClick={()=>{
                      setOpenCats(prev=>({...prev,[cat]:true}));
                      setTimeout(()=>{const el=document.getElementById('svc-cat-'+cat);el&&el.scrollIntoView({behavior:'smooth',block:'start'});},50);
                    }}
                    onKeyDown={e=>{
                      if(e.key==='Enter'||e.key===' '){
                        e.preventDefault();
                        setOpenCats(prev=>({...prev,[cat]:true}));
                        setTimeout(()=>{const el=document.getElementById('svc-cat-'+cat);el&&el.scrollIntoView({behavior:'smooth',block:'start'});},50);
                      }
                    }}>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <span style={{fontSize:FS.xs,fontWeight:700,color:swatch.inkMag,flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{meta.label}</span>
                      <span style={{fontSize:FS.xxs,color:MUTED,flexShrink:0}}>{cs.total}</span>
                    </div>
                    {(hasImp||hasDeg)&&<div style={{marginTop:3,fontSize:FS.xxs,fontWeight:700,color:hasImp?'#7a1a1a':'#7a3a00'}}>
                      {hasImp&&` ${cs.imp} impaired`}{hasDeg&&` ${cs.deg} reduced`}
                    </div>}
                  </div>
                );
              })}
              {missing.map(cat => {
                const meta = Ts[cat] || {label:cat,accent:'#6b5340'};
                return (
                  <div key={'missing-'+cat} style={{background:swatch['#FDF8E8'],border:'1px solid #e0c060',borderLeft:'3px solid #b8860b',borderRadius:5,padding:'6px 10px',opacity:0.8}}>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <span style={{fontSize:FS.xs,fontWeight:700,color:swatch['#5A3A10'],flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{meta.label}</span>
                    </div>
                    <div style={{marginTop:3,fontSize:FS.xxs,fontWeight:700,color:swatch['#7A5010']}}> not available</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── NOTABLE ABSENCES ─────────────────────────────────────────────── */}
        {missing.length > 0 && (
          <div style={{background:swatch['#FDF8E8'],border:'1px solid #e0c060',borderLeft:'3px solid #b8860b',borderRadius:6,padding:'9px 14px',marginBottom:14,fontSize:FS.sm,color:swatch['#5A3A10']}}>
            <strong>Not available for a {tier}:</strong> {missing.map(k=>Ts[k]?.label).filter(Boolean).join(', ')}. The party will need to look elsewhere.
          </div>
        )}

        {/* ── SERVICE CATEGORIES ───────────────────────────────────────────── */}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {catOrder.map(cat => {
            const list = services[cat];
            if (!list?.length) return null;
            const meta = Ts[cat] || {label:cat,accent:'#6b5340'};
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
                {/* Category toggle — bespoke: full-width header row with left-aligned
                    icon/label/count, conditional impairment badges, an auto-pushed
                    chevron, and an open-state-dependent bottom border. The Button
                    primitive centers content and can't express this layout, so it
                    stays raw (this file remains in the raw-button baseline). */}
                <button type="button" onClick={()=>toggleCat(cat)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:8,
                  padding:'10px 14px',background:'transparent',border:'none',
                  borderBottom:open?`1px solid ${isCriminal?'#3a1a1a':`${meta.accent}20`}`:'none',
                  cursor:'pointer',textAlign:'left',WebkitTapHighlightColor:'transparent'
                }}>
                  <span style={{fontSize:FS.sm,fontWeight:800,color:isCriminal?'#c06060':accentColor,textTransform:'uppercase',letterSpacing:'0.06em'}}>{meta.label}</span>
                  <span style={{fontSize:FS.xs,color:isCriminal?'#8a5050':'#9c8068'}}>({cs.total})</span>
                  {hasImp&&<span style={{fontSize:FS.xxs,fontWeight:700,color:swatch['#7A1A1A'],background:swatch['#FDE8E8'],border:'1px solid #f0a0a0',borderRadius:3,padding:'1px 5px',marginLeft:2}}> {cs.imp} impaired</span>}
                  {!hasImp&&hasDeg&&<span style={{fontSize:FS.xxs,fontWeight:700,color:swatch['#7A3A00'],background:swatch['#FFF0E0'],border:'1px solid #e09050',borderRadius:3,padding:'1px 5px',marginLeft:2}}> {cs.deg} reduced</span>}
                  <span style={{fontSize:FS.xxs,color:isCriminal?'#8a5050':'#9c8068',marginLeft:'auto'}}>{open?'▲':'▼'}</span>
                </button>

                {open && <div style={{padding:'10px 14px'}}>
                  {isCriminal&&meta.note&&<p style={{fontSize:FS.xs,color:swatch['#8A5050'],fontStyle:'italic',margin:'0 0 10px',lineHeight:1.5,borderLeft:'2px solid #4a1a1a',paddingLeft:8}}>{meta.note}</p>}
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
                        tradeDeps={tradeDeps} impaired={impaired} degraded={degraded} vulnerable={vulnerable} compromised={compromised} depReasons={depReasons} chainDepth={serviceChainDepth.get((typeof svc==='string'?svc:svc?.institution||'').toLowerCase())}/>
                    ))}
                  </div>
                </div>}
              </div>
            );
          })}
        </div>

        <p style={{fontSize:FS.xs,color:MUTED,marginTop:12,fontStyle:'italic',textAlign:'right'}}>
          {totalCount} services · {catOrder.length} categories{totalImpaired>0?` · ${totalImpaired} impaired`:''}{hasCustom?' · ✦ custom':''}
        </p>
      </>}
    </div>
  );
}

export default React.memo(ServicesTab);
