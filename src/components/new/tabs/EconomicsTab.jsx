import React, { useState } from 'react';
import {C} from '../design';
import {Ti, sans, Section, Empty} from '../Primitives';
import {PROSPERITY_COLORS} from '../tabConstants';
import {isMobile} from '../tabConstants';

import {NarrativeNote} from '../NarrativeNote';
import {SupplyChainsPanel} from '../SupplyChainsPanel';

export function EconomicsTab({economicState, settlement, narrativeNote}) {
  const s = settlement;
  const mobile = isMobile();
  const eco = economicState || s?.economicState;
  const via = s?.economicViability;
  if (!eco) return <Empty message="No economic data available."/>;

  const prosColor = PROSPERITY_COLORS[eco.prosperity] || '#a0762a';
  const fb = via?.metrics?.foodBalance;
  // Terrain-critical imports (things this terrain physically cannot produce)
  const terrainCriticals = (() => {
    const res = s?.resourceAnalysis;
    if (!res || Array.isArray(res.imports)) return [];
    return res.imports?.critical || [];
  })();

  const hasCrit = eco.tradeDependencies?.some(d => d.severity === 'critical');
  const sp = eco.safetyProfile || {};
  const ecoScore = Math.round(eco.compound?.economyOutput || 0);
  const tradeLabel = (eco.tradeAccess || 'road').replace(/_/g,' ');

  // Safety tile color

  // Food tile
  const foodSurplus = fb?.surplus > 0;
  const foodDeficit = fb?.deficit > 0;
  const foodColor = foodDeficit ? '#8b1a1a' : foodSurplus ? '#1a5a28' : '#a0762a';
  const foodLabel = foodDeficit ? `Deficit ${fb.deficitPercent}%` : foodSurplus ? 'Surplus' : 'Balanced';

  return (
    <div style={{...sans}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── PROSPERITY HEADER ───────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#faf6ec,#f5ede0)',border:'1px solid #d8c090',borderLeft:`4px solid ${prosColor}`,borderRadius:8,padding:'12px 16px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize:22,fontWeight:700,color:prosColor,lineHeight:1.1,marginBottom:3}}>{eco.prosperity}</div>
            <div style={{fontSize:12,color:'#6b5340'}}>{eco.economicComplexity}</div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'flex-start'}}>
            <div style={{textAlign:'center',background:'rgba(250,248,244,0.97)',border:'1px solid #d8c090',borderRadius:6,padding:'6px 12px'}}>
              <div style={{fontSize:9,fontWeight:700,color:'#9c8068',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2}}>Trade</div>
              <div style={{fontSize:12,fontWeight:600,color:'#1c1409',textTransform:'capitalize'}}>{tradeLabel}</div>
            </div>
            {ecoScore>0&&<div style={{textAlign:'center',background:'rgba(250,248,244,0.97)',border:'1px solid #d8c090',borderRadius:6,padding:'6px 12px'}}>
              <div style={{fontSize:9,fontWeight:700,color:'#9c8068',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2}}>Output</div>
              <div style={{fontSize:13,fontWeight:700,color:ecoScore>=60?'#1a5a28':ecoScore>=35?'#a0762a':'#8b1a1a'}}>{ecoScore}/100</div>
            </div>}
          </div>
        </div>
        {eco.situationDesc&&<p style={{fontSize:13,color:'#3d2b1a',lineHeight:1.65,margin:'10px 0 0',borderTop:'1px solid #e0c890',paddingTop:8}}>{eco.situationDesc}</p>}
      </div>

      {/* ── AT-A-GLANCE TILES ───────────────────────────────────────────── */}
      <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
        {[
          {icon:'',label:'Economy',value:eco.prosperity,sub:ecoScore?`Output score: ${ecoScore}/100`:undefined,color:prosColor},
          {icon:'',label:'Food',value:foodLabel,sub:fb?`${fb.dailyProduction?.toLocaleString()} / ${fb.dailyNeed?.toLocaleString()} lbs/day`:undefined,color:foodColor},
        ].map(({icon,label,value,sub,color})=>(
          <div key={label} style={{flex:'1 1 120px',background:'#faf8f4',border:`1px solid ${color}30`,borderTop:`3px solid ${color}`,borderRadius:6,padding:'8px 10px',minWidth:0}}>
            <div style={{fontSize:10,fontWeight:700,color,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>{icon} {label}</div>
            <div style={{fontSize:13,fontWeight:700,color:'#1c1409',lineHeight:1.2,marginBottom:sub?2:0}}>{value}</div>
            {sub&&<div style={{fontSize:10,color:'#9c8068',lineHeight:1.3}}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* ── INCOME SOURCES ──────────────────────────────────────────────── */}
      {eco.incomeSources?.length>0&&<Section title="Income Sources" collapsible defaultOpen>
        <div style={{display:'flex',flexDirection:'column',gap:5}}>
          {eco.incomeSources.map((src,i)=>{
            const isCrim = src.isCriminal;
            const barColor = isCrim ? '#4a1a4a' : `linear-gradient(to right,${prosColor},#b8860b)`;
            return (
            <div key={i} style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{flex:1,background:'#e8dcc8',borderRadius:4,height:26,position:'relative',overflow:'hidden',minWidth:40}}>
                <div style={{position:'absolute',inset:'0',right:`${100-Math.min(src.percentage,100)}%`,background:isCrim?'#4a1a4a':`linear-gradient(to right,${prosColor},#b8860b)`,display:'flex',alignItems:'center',paddingLeft:6}}>
                  {src.percentage>=8&&<span style={{fontSize:10,fontWeight:700,color:'#fff',whiteSpace:'nowrap'}}>{src.percentage}%</span>}
                </div>
                {src.percentage<8&&<span style={{position:'absolute',left:`${src.percentage+1}%`,top:'50%',transform:'translateY(-50%)',fontSize:10,fontWeight:700,color:isCrim?'#4a1a4a':'#6b5340'}}>{src.percentage}%</span>}
              </div>
              <div style={{width:mobile?130:210,flexShrink:0,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:isCrim?'#4a1a4a':'#1c1409',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {isCrim&&<span style={{fontSize:9,fontWeight:800,color:'#4a1a4a',background:'#f0e0f0',borderRadius:2,padding:'0 4px',marginRight:4}}>️ CRIMINAL</span>}
                  {src.source}
                </div>
                {src.desc&&<div style={{fontSize:10,color:'#9c8068',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{src.desc}</div>}
              </div>
            </div>
            );
          })}
        </div>
      </Section>}

      {/* ── TRADE PROFILE (exports + imports unified) ───────────────────── */}
      {(eco.primaryExports?.length>0||eco.primaryImports?.length>0||eco.localProduction?.length>0)&&<Section title="Trade Profile" collapsible defaultOpen>
        <div style={{display:'grid',gridTemplateColumns:mobile?'1fr':'1fr 1fr',gap:12,marginBottom:eco.localProduction?.length>0?12:0}}>
          {/* Exports */}
          <div>
            <div style={{fontSize:10,fontWeight:700,color:'#1a5a28',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Exports</div>
            {eco.primaryExports?.length>0
              ?<div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {eco.primaryExports.map((e,i)=>{const t=e.includes('(transit)');return <span key={i} style={{fontSize:11,fontWeight:600,color:t?'#2a3a7a':'#1a5a28',background:t?'#eaecf8':'#e8f5ec',border:`1px solid ${t?'#a8b8e8':'#a8d8b0'}`,borderRadius:12,padding:'3px 9px'}}>{e}</span>;})}
                {eco.isEntrepot&&<div style={{width:'100%',fontSize:10,color:'#2a3a7a',fontStyle:'italic',marginTop:4}}> Blue = re-exported transit goods</div>}
              </div>
              :<p style={{fontSize:12,color:'#9c8068',fontStyle:'italic',margin:0}}>No significant exports.</p>
            }
          </div>
          {/* Imports */}
          <div>
            <div style={{fontSize:10,fontWeight:700,color:'#8b1a1a',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Imports</div>
            {eco.primaryImports?.length>0
              ?<div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {[...eco.primaryImports, ...terrainCriticals.filter(tc => !eco.primaryImports.some(imp => imp.toLowerCase().includes(tc.toLowerCase())))].sort().map((imp,i)=>{
                    const n=eco.necessityImports?.some(x=>imp.toLowerCase().includes(x.toLowerCase()));
                    const t=terrainCriticals.some(tc=>imp.toLowerCase().includes(tc.toLowerCase())||tc.toLowerCase().includes(imp.toLowerCase()));
                    const color = t?'#7a0a0a':n?'#8b1a1a':'#7a5010';
                    const bg    = t?'#fdf0f0':n?'#fdf4f4':'#faf4e8';
                    const bdr   = t?'#e08080':n?'#e8b0b0':'#d8c090';
                    const icon  = t?' ':n?' ':'';
                    return <span key={i} style={{fontSize:11,fontWeight:600,color,background:bg,border:`1px solid ${bdr}`,borderRadius:12,padding:'3px 9px'}}>{imp}{icon}</span>;
                  })}
                {(eco.necessityImports?.length>0||terrainCriticals.length>0)&&<div style={{width:'100%',fontSize:10,color:'#6b5340',fontStyle:'italic',marginTop:4}}>
                  {terrainCriticals.length>0&&<span style={{color:'#7a0a0a'}}> Terrain cannot produce</span>}
                  {terrainCriticals.length>0&&eco.necessityImports?.length>0&&<span> · </span>}
                  {eco.necessityImports?.length>0&&<span style={{color:'#8b1a1a'}}> Settlement necessity</span>}
                </div>}
              </div>
              :<p style={{fontSize:12,color:'#9c8068',fontStyle:'italic',margin:0}}>No recorded imports.</p>
            }
          </div>
        </div>
        {/* Local production */}
        {eco.localProduction?.length>0&&<div style={{borderTop:'1px solid #e8d8b0',paddingTop:10}}>
          <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Produced Locally</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
            {eco.localProduction.map((p,i)=><span key={i} style={{fontSize:10,color:'#3d2b1a',background:'#f0ead8',border:'1px solid #d8c890',borderRadius:4,padding:'1px 7px',textTransform:'capitalize'}}>{p.replace(/_/g,' ')}</span>)}
          </div>
        </div>}
      </Section>}

      {/* ── CRITICAL IMPORTS ──────────────────────────────────────────────── */}
      

      {/* ── FOOD SECURITY ──────────────────────────────────────────────────── */}
      {fb&&<Section title="Food Security" collapsible defaultOpen={!!fb.deficit} accent={foodColor}>
        {/* Balance bar */}
        <div style={{marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#6b5340',marginBottom:4}}>
            <span>Production: {fb.dailyProduction?.toLocaleString()} lbs/day</span>
            {fb.importCoverage>0&&<span style={{color:'#2a5a8a'}}>+ {fb.importCoverage.toLocaleString()} imported</span>}
            <span>Need: {fb.dailyNeed?.toLocaleString()} lbs/day</span>
          </div>
          <div style={{height:10,background:'#e8dcc8',borderRadius:5,overflow:'hidden',position:'relative'}}>
            {/* Production bar */}
            <div style={{height:'100%',width:`${Math.min(100,Math.round((fb.dailyProduction/Math.max(1,fb.dailyNeed))*100))}%`,background:foodDeficit?'#c08080':foodSurplus?'#1a5a28':'#a0762a',borderRadius:5}}/>
            {/* Import coverage overlay */}
            {fb.importCoverage>0&&<div style={{position:'absolute',top:0,left:`${Math.min(100,Math.round((fb.dailyProduction/Math.max(1,fb.dailyNeed))*100))}%`,height:'100%',width:`${Math.min(100-Math.round((fb.dailyProduction/Math.max(1,fb.dailyNeed))*100),Math.round((fb.importCoverage/Math.max(1,fb.dailyNeed))*100))}%`,background:'#2a5a8a80',borderRadius:'0 5px 5px 0'}}/>}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'#9c8068',marginTop:3}}>
            <span>Agriculture modifier: {Math.round((fb.agricultureModifier||1)*100)}%</span>
            {fb.stressModifier&&fb.stressModifier<1&&<span style={{color:'#8b1a1a'}}>Stress penalty: ×{fb.stressModifier}</span>}
            {fb.importCoverage>0&&<span style={{color:'#2a5a8a'}}>Trade covers {Math.round(fb.importCoverage/(fb.rawDeficit||fb.importCoverage)*100)}% of gap</span>}
          </div>
        </div>
        {/* Narrative */}
        <div style={{background:foodDeficit?'#fdf4f4':'#f0faf2',border:`1px solid ${foodDeficit?'#e8c0c0':'#a8d8b0'}`,borderLeft:`3px solid ${foodColor}`,borderRadius:6,padding:'8px 12px',fontSize:12,color:foodDeficit?'#5a1a1a':'#1a3a10',lineHeight:1.5}}>
          {foodDeficit
            ? fb.importCoverage>0
              ? `Production covers ${Math.round(fb.dailyProduction/fb.dailyNeed*100)}% of food needs. Trade imports cover an estimated ${Math.round(fb.importCoverage/(fb.rawDeficit||1)*100)}% of the gap — residual shortfall is ${fb.deficitPercent}%. Settlement is trade-dependent for food security.`
              : ` Production deficit of ${fb.deficitPercent}% — settlement requires food imports to sustain population.`
            : `Agricultural surplus of ${Math.round((fb.surplus/Math.max(1,fb.dailyNeed))*100)}% above daily needs.`
          }
        </div>
      </Section>}

      {/* ── ECONOMIC FLOWS (unified production chains + dependencies) ──────── */}
      {eco.activeChains?.length>0&&(()=>{
        const [flowFilter, setFlowFilter] = React.useState('all');
        const chains = eco.activeChains || [];
        const impairedCount  = chains.filter(c=>c.status==='impaired').length;
        const vulnerableCount= chains.filter(c=>c.status==='vulnerable').length;
        const entrepotCount  = chains.filter(c=>c.entrepot).length;
        const runningCount   = chains.filter(c=>c.status==='running').length;
        const magicCount     = chains.filter(c=>c.status==='magically_sustained').length;
        const filtered = flowFilter==='all' ? chains
          : flowFilter==='impaired'   ? chains.filter(c=>c.status==='impaired'||c.status==='vulnerable')
          : flowFilter==='productive' ? chains.filter(c=>c.activatedByResource||c.status==='running')
          : flowFilter==='magic'      ? chains.filter(c=>c.status==='magically_sustained'||c.magicNote)
          : chains.filter(c=>c.entrepot);

        const STATUS = {
          impaired:           {label:' Impaired',          color:'#8b1a1a', bg:'#fdf4f4', border:'#e8c0c0'},
          vulnerable:         {label:' Vulnerable',         color:'#8a4010', bg:'#fdf8f0', border:'#e0c090'},
          running:            {label:'✓ Running',             color:'#1a5a28', bg:'#f0faf4', border:'#a8d8b0'},
          entrepot:           {label:' Entrepôt',           color:'#a0762a', bg:'#faf6ec', border:'#d8c090'},
          magically_sustained:{label:'✦ Magically Sustained', color:'#5a2a8a', bg:'#f8f0ff', border:'#c0a0e0'},
          operational:        {label:'○ Operational',         color:'#6b5340', bg:'#faf8f4', border:'#e0d0b0'},
        };

        return (
          <Section title={`Economic Flows (${chains.length + (eco.institutionalServices?.length||0)} active${impairedCount>0?` · ${impairedCount} impaired`:''})`}
            collapsible defaultOpen={impairedCount>0} accent={impairedCount>0?'#8b1a1a':undefined}>
            {/* Filter tabs */}
            <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:10}}>
              {[
                {key:'all',label:`All (${chains.length + (eco.institutionalServices?.length||0)})`},
                impairedCount+vulnerableCount>0&&{key:'impaired',label:` Issues (${impairedCount+vulnerableCount})`,color:'#8b1a1a'},
                runningCount>0&&{key:'productive',label:`✓ Productive (${runningCount})`,color:'#1a5a28'},
                entrepotCount>0&&{key:'entrepot',label:` Entrepôt (${entrepotCount})`,color:'#a0762a'},
                eco.institutionalServices?.length>0&&{key:'services',label:` Services (${eco.institutionalServices.length})`,color:'#5a3a1a'},
              ].filter(Boolean).map(f=>(
                <button key={f.key} onClick={()=>setFlowFilter(f.key)} style={{
                  padding:'4px 10px',borderRadius:4,border:'1px solid',fontSize:10,fontWeight:flowFilter===f.key?700:500,cursor:'pointer',
                  background:flowFilter===f.key?(f.color?`${f.color}18`:'#1c140918'):'#fff',
                  color:flowFilter===f.key?(f.color||'#1c1409'):'#6b5340',
                  borderColor:flowFilter===f.key?(f.color||'#1c1409'):'#c8b89a',
                }}>{f.label}</button>
              ))}
            </div>

            {/* Chain cards */}
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {filtered.map((chain,i)=>{
                const st = STATUS[chain.status] || STATUS.operational;
                const hasIncome = eco.incomeSources?.some(inc =>
                  inc.source.toLowerCase().includes(chain.label.split(' ')[0].toLowerCase()) ||
                  (chain.needKey==='trade_entrepot'&&inc.source.toLowerCase().includes('entrepôt'))
                );
                const incomeEntry = hasIncome ? eco.incomeSources?.find(inc =>
                  inc.source.toLowerCase().includes(chain.label.split(' ')[0].toLowerCase()) ||
                  (chain.needKey==='trade_entrepot'&&inc.source.toLowerCase().includes('entrepôt'))
                ) : null;

                return (
                  <div key={i} style={{
                    background:st.bg, border:`1px solid ${st.border}`,
                    borderLeft:`3px solid ${st.color}`,
                    borderRadius:6, padding:'8px 12px',
                  }}>
                    {/* Header row */}
                    <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4,flexWrap:'wrap'}}>
                      <span style={{fontSize:13}}>{chain.resourceIcon}</span>
                      <span style={{fontSize:12,fontWeight:700,color:'#1c1409'}}>{chain.label}</span>
                      <span style={{fontSize:9,color:chain.needColor,background:`${chain.needColor}15`,borderRadius:3,padding:'0 5px',fontWeight:700}}>{chain.needIcon} {chain.needLabel}</span>
                      <span style={{fontSize:9,fontWeight:800,color:st.color,background:`${st.color}15`,borderRadius:3,padding:'0 5px',marginLeft:'auto'}}>{st.label}</span>
                    </div>

                    {/* Institutions + outputs */}
                    <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:chain.dependency||chain.entrepotNote?6:0}}>
                      <div style={{flex:'1 1 140px'}}>
                        <div style={{fontSize:9,fontWeight:700,color:'#9c8068',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:2}}>Via</div>
                        <div style={{fontSize:11,color:'#3d2b1a',lineHeight:1.3}}>{chain.processingInstitutions.join(' · ')}</div>
                      </div>
                      {chain.outputs.length>0&&<div style={{flex:'1 1 140px'}}>
                        <div style={{fontSize:9,fontWeight:700,color:'#9c8068',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:2}}>Outputs</div>
                        <div style={{display:'flex',flexWrap:'wrap',gap:2}}>
                          {chain.outputs.slice(0,3).map((o,j)=>(
                            <span key={j} style={{fontSize:10,color:'#3d2b1a',background:`${st.color}10`,borderRadius:3,padding:'1px 5px'}}>{o}</span>
                          ))}
                        </div>
                      </div>}
                    </div>

                    {/* Impairment detail */}
                    {chain.dependency&&(
                      <div style={{fontSize:11,color:st.color,background:`${st.color}08`,borderRadius:4,padding:'4px 8px',marginTop:4,lineHeight:1.4}}>
                         <strong>Needs {chain.dependency.resource}</strong> — {chain.dependency.impact}
                        {chain.dependency.affectedServices.length>0&&<span style={{color:'#9c8068'}}> · affects: {chain.dependency.affectedServices.slice(0,3).join(', ')}</span>}
                      </div>
                    )}

                    {/* Entrepôt note */}
                    {chain.entrepot&&chain.entrepotNote&&!chain.dependency&&(
                      <p style={{fontSize:10,color:'#a0762a',fontStyle:'italic',margin:'4px 0 0',lineHeight:1.3}}>{chain.entrepotNote}</p>
                    )}

                    {/* Magic substitution note */}
                    {chain.magicNote&&(
                      <div style={{fontSize:10,color:'#5a2a8a',background:'#f8f0ff',borderRadius:4,
                        padding:'4px 8px',marginTop:4,borderLeft:'3px solid #c0a0e0',lineHeight:1.4}}>
                        ✦ <em>{chain.magicNote}</em>
                        {chain.magicRecovery&&<span style={{marginLeft:6,fontSize:9,color:'#7a4aaa',fontWeight:700}}>
                          {Math.round(chain.magicRecovery*100)}% recovery
                        </span>}
                      </div>
                    )}

                    {/* Income contribution */}
                    {incomeEntry&&(
                      <div style={{fontSize:10,color:'#6b5340',marginTop:4}}>
                         Contributes to <strong>{incomeEntry.source}</strong> — {incomeEntry.percentage}% of income
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Institutional Services — tertiary economy */}
            {eco.institutionalServices?.length>0&&(flowFilter==='all'||flowFilter==='services')&&<>
              <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginTop:10,marginBottom:6}}>Service Economy</div>
              <div style={{display:'flex',flexDirection:'column',gap:5}}>
                {eco.institutionalServices.map((svc,i)=>(
                  <div key={i} style={{
                    background:'#faf8f4',border:`1px solid ${svc.color}30`,
                    borderLeft:`3px solid ${svc.color}`,
                    borderRadius:6,padding:'7px 12px',
                    display:'flex',alignItems:'flex-start',gap:8,
                  }}>
                    <span style={{fontSize:16,flexShrink:0}}>{svc.icon}</span>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2,flexWrap:'wrap'}}>
                        <span style={{fontSize:12,fontWeight:700,color:'#1c1409'}}>{svc.label}</span>
                        <span style={{fontSize:9,fontWeight:700,color:svc.color,background:`${svc.color}15`,borderRadius:3,padding:'0 5px'}}>service</span>
                        {svc.exportable&&<span style={{fontSize:9,color:'#1a5a28',background:'#e8f5ec',borderRadius:3,padding:'0 5px'}}>export</span>}
                        <span style={{fontSize:9,fontWeight:800,color:'#6b5340',background:'#ede3cc',borderRadius:3,padding:'0 5px',marginLeft:'auto'}}>○ Operational</span>
                      </div>
                      <div style={{fontSize:11,color:'#3d2b1a'}}>
                        <span style={{color:'#9c8068',marginRight:4}}>Via:</span>{svc.institutions.join(' · ')}
                      </div>
                      <div style={{fontSize:11,color:'#6b5340',marginTop:1}}>{svc.output}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>}
          </Section>
        );
      })()}

      {/* ── ECONOMIC PLOT HOOKS (currently invisible — now surfaced) ─────── */}
      {via?.plotHooks?.length>0&&<Section title={`Economic Plot Hooks (${via.plotHooks.length})`} collapsible defaultOpen={false} accent="#5a2a8a">
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {via.plotHooks.map((h,i)=>{
            const text=typeof h==='object'?h.hook||Ti(h):String(h);
            const cat=typeof h==='object'?h.category:null;
            return <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
              <span style={{fontSize:12,flexShrink:0,marginTop:1,color:'#5a2a8a'}}>✦</span>
              <div style={{flex:1}}>
                {cat&&<span style={{fontSize:10,fontWeight:700,color:'#5a2a8a',textTransform:'uppercase',letterSpacing:'0.04em',marginRight:6}}>{cat}</span>}
                <span style={{fontSize:13,color:'#1c1409',lineHeight:1.5}}>{text}</span>
              </div>
            </div>;
          })}
        </div>
      </Section>}

      {/* ── SUPPLY CHAINS ─────────────────────────────────────────────────────── */}
      {(eco?.activeChains?.length > 0) && (
        <Section title={`Supply Chains (${eco.activeChains.length})`} collapsible defaultOpen={false}>
          <SupplyChainsPanel settlement={s} eco={eco} />
        </Section>
      )}

            {/* ── RESOURCE EXPLOITATION ───────────────────────────────────────────── */}
      {(()=>{
        const res = s?.resourceAnalysis;
        if(!res) return null;
        const full = [...(res.exploitation?.fullyExploited||[])].sort((a,b)=>(a.rawResource||'').localeCompare(b.rawResource||''));
        const part = [...(res.exploitation?.partiallyExploited||[])].sort((a,b)=>(a.rawResource||'').localeCompare(b.rawResource||''));
        const unex = [...(res.exploitation?.unexploited||[])].sort((a,b)=>(a.rawResource||'').localeCompare(b.rawResource||''));
        if(full.length===0&&part.length===0&&unex.length===0) return null;
        return <Section title="Resource Exploitation" collapsible defaultOpen={false}>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {full.length>0&&<div>
              <div style={{fontSize:10,fontWeight:700,color:'#1a5a28',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>
                ✓ Fully Exploited ({full.length})
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {full.map((r,i)=><span key={i} style={{fontSize:11,color:'#1a5a28',background:'#e8f5ec',border:'1px solid #a8d8b0',borderRadius:4,padding:'2px 8px'}}>{r.rawResource||r.resource||(typeof r==='string'?r:r.chainKey||'?')}</span>)}
              </div>
            </div>}
            {part.length>0&&<div>
              <div style={{fontSize:10,fontWeight:700,color:'#8a5010',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>
                ◑ Partially Exploited ({part.length})
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {part.map((r,i)=>{
                const name = r.rawResource||r.resource||(typeof r==='string'?r:r.chainKey||'?');
                const missing = r.processingInstitutions?.length
                  ? '' : r.dependsOn?.length ? ' (needs: '+r.dependsOn.slice(0,2).join(', ')+')' : '';
                return <span key={i} style={{fontSize:11,color:'#8a5010',background:'#fdf0e0',border:'1px solid #e0b870',borderRadius:4,padding:'2px 8px'}}>{name}{missing}</span>;
              })}
              </div>
            </div>}
            {unex.length>0&&<div>
              <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>
                ○ Unexploited Opportunity ({unex.length})
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {unex.map((r,i)=><span key={i} style={{fontSize:11,color:'#6b5340',background:'#f5f0e8',border:'1px solid #c8b89a',borderRadius:4,padding:'2px 8px'}}>{r.rawResource||r.resource||(typeof r==='string'?r:r.chainKey||'?')}</span>)}
              </div>
            </div>}
          </div>
        </Section>;
      })()}

      {/* ── SHADOW ECONOMY ───────────────────────────────────────────────────── */}
      {(()=>{
        const sp = s?.economicState?.safetyProfile;
        const bmc = sp?.blackMarketCapture || 0;
        const dragDesc = sp?.economicDragDesc;
        const crimInsts = sp?.criminalInstitutions || [];
        const crimChains = (s?.economicState?.activeChains||[]).filter(c=>c.needKey==='criminal_economy');
        const crimeTypes = sp?.crimeTypes || [];
        if (!sp || bmc < 3) return null;

        const sevColor = bmc>=30?'#8b1a1a':bmc>=15?'#8a3010':'#7a5010';
        const sevBg    = bmc>=30?'#fdf4f4':bmc>=15?'#fdf0e8':'#faf8e8';

        // Scale context: same % means different things at different tiers
        const tier = s?.tier || 'village';
        const scaleNote = bmc>=30
          ? 'A substantial portion of economic activity bypasses legitimate channels. Tax revenue is severely compressed. Guild structures are being undercut.'
          : bmc>=15
          ? 'Significant off-book activity. Merchants operating in the shadow economy have a cost advantage over those paying duties and guild fees.'
          : 'Minor shadow activity — petty theft and small-scale unlicensed trade. An inconvenience, not a structural threat.';

        // What goods flow through the shadow economy (from crime types)
        const shadowGoods = crimeTypes
          .filter(ct => ct.type && ct.type.toLowerCase().includes('smuggl') ||
                        ct.type?.toLowerCase().includes('contraband') ||
                        ct.type?.toLowerCase().includes('black market'))
          .slice(0, 2);

        return <Section title={`Shadow Economy — ${bmc}% capture`} collapsible defaultOpen={bmc>=15}>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>

            {/* Capture rate + scale context */}
            <div style={{background:sevBg,border:`1px solid ${sevColor}30`,borderLeft:`4px solid ${sevColor}`,borderRadius:6,padding:'10px 14px',display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{flexShrink:0,textAlign:'center',minWidth:56}}>
                <div style={{fontWeight:800,fontSize:26,color:sevColor,lineHeight:1}}>{bmc}%</div>
                <div style={{fontSize:9,fontWeight:700,color:sevColor,textTransform:'uppercase',letterSpacing:'0.05em',marginTop:2}}>Off-book</div>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:12,color:'#3d2b1a',lineHeight:1.5,margin:'0 0 4px'}}>{scaleNote}</p>
                {dragDesc&&<p style={{fontSize:11.5,color:'#6b5340',fontStyle:'italic',margin:0,lineHeight:1.4}}>{dragDesc}</p>}
              </div>
            </div>

            {/* What operations generate this revenue */}
            {crimInsts.length>0&&<div>
              <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>Economic Operations</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {crimInsts.map((name,i)=>{
                  const n = name.toLowerCase();
                  const econ = n.includes('black market')   ? 'parallel marketplace'
                             : n.includes('smuggling')      ? 'duty evasion'
                             : n.includes('gambling')       ? 'unlicensed revenue'
                             : n.includes('front business') ? 'money laundering'
                             : n.includes('fence')          ? 'stolen goods market'
                             : n.includes('thieves')        ? 'protection + extraction'
                             : 'criminal revenue stream';
                  return (
                    <div key={i} style={{background:'#fdf4f4',border:'1px solid #e0b0b0',borderRadius:5,padding:'5px 10px',display:'flex',flexDirection:'column',gap:1}}>
                      <span style={{fontSize:11,fontWeight:700,color:'#8b1a1a'}}>{name}</span>
                      <span style={{fontSize:10,color:'#6b4040'}}>{econ}</span>
                    </div>
                  );
                })}
              </div>
            </div>}

            {/* Active criminal supply chains */}
            {crimChains.length>0&&<div>
              <div style={{fontSize:10,fontWeight:700,color:'#6b5340',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>Criminal Supply Chains</div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {crimChains.map((c,i)=>(
                  <span key={i} style={{fontSize:10,fontWeight:700,color:'#5a1a1a',background:'#fdf4f4',border:'1px solid #e0b0b0',borderRadius:4,padding:'2px 8px'}}>
                    {c.chainId?.replace(/_/g,' ')} · {c.status}
                  </span>
                ))}
              </div>
            </div>}

            {/* Note directing to Defense for power structure */}
            <div style={{fontSize:11,color:'#9c8068',fontStyle:'italic',borderTop:'1px solid #e8d8c0',paddingTop:8}}>
              Criminal power structures, enforcement dynamics, and public order detail → Defense tab
            </div>

          </div>
        </Section>;
      })()}

    </div>
  );
}

export default React.memo(EconomicsTab);
