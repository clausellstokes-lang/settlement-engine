import React, { useState } from 'react';
import { FS, swatch, MUTED, GOLD_TINT, GOLD_DEEP } from '../../theme.js';
import {Ti, sans, Section, Empty, TabIntro} from '../Primitives';
import {PROSPERITY_COLORS} from '../tabConstants';
import {isMobile} from '../tabConstants';

import {NarrativeNote} from '../NarrativeNote';
import {SupplyChainsPanel} from '../SupplyChainsPanel';
import { criminalOpEcon } from '../../../domain/display/defenseDisplay.js';
import { deriveFoodBalance } from '../../../domain/display/dossierViewModel.js';
import { EconomicsGranarySection } from '../../dossier/EngineSections.jsx';
import Button from '../../primitives/Button.jsx';

// ── Status palette for chain cards ────────────────────────────────────────
// Module-scope so the object identity is stable across renders (avoids
// re-allocating per render of EconomicFlowsSection).
const FLOW_STATUS = {
  impaired:            {label:' Impaired',            color:'#8b1a1a', bg:'#fdf4f4', border:'#e8c0c0'},
  vulnerable:          {label:' Vulnerable',          color:'#8a4010', bg:'#fdf8f0', border:'#e0c090'},
  running:             {label:'✓ Running',           color:'#1a5a28', bg:'#f0faf4', border:'#a8d8b0'},
  entrepot:            {label:' Entrepôt',          color:'#a0762a', bg:'#faf6ec', border:'#d8c090'},
  magically_sustained: {label:'✦ Magically Sustained', color:'#5a2a8a', bg:'#f8f0ff', border:'#c0a0e0'},
  operational:         {label:'○ Operational',        color:'#6b5340', bg:'#faf8f4', border:'#e0d0b0'},
};

// §14 Phase 3b — trade-direction arrow colours (module-scope const = lint-safe).
const TRADE_IN_COLOR = swatch['#7A5010'];   // ← imported from a neighbour
const TRADE_OUT_COLOR = swatch['#1A5A28'];  // → exported to a neighbour

/**
 * EconomicFlowsSection — extracted from a 150-line IIFE that lived inline
 * in EconomicsTab.jsx. The IIFE pattern violated rules-of-hooks because
 * the React.useState call lived inside a callback expression, requiring
 * two eslint-disable directives to stay green. Now a proper component
 * with normal hook scoping.
 *
 * Props are the slices of eco that the section actually consumes — keeps
 * the prop surface narrow and the component cheap to memoize.
 */
function EconomicFlowsSection({ chains, institutionalServices = [], incomeSources = [] }) {
  const [flowFilter, setFlowFilter] = useState('all');
  const impairedCount   = chains.filter(c => c.status === 'impaired').length;
  const vulnerableCount = chains.filter(c => c.status === 'vulnerable').length;
  const entrepotCount   = chains.filter(c => c.entrepot).length;
  const runningCount    = chains.filter(c => c.status === 'running').length;

  const filtered = flowFilter === 'all'        ? chains
    : flowFilter === 'impaired'   ? chains.filter(c => c.status === 'impaired' || c.status === 'vulnerable')
    : flowFilter === 'productive' ? chains.filter(c => c.activatedByResource || c.status === 'running')
    : flowFilter === 'magic'      ? chains.filter(c => c.status === 'magically_sustained' || c.magicNote)
    :                                chains.filter(c => c.entrepot);

  return (
    <Section title={`Economic Flows (${chains.length + institutionalServices.length} active${impairedCount > 0 ? ` · ${impairedCount} impaired` : ''})`}
      collapsible defaultOpen={impairedCount > 0} accent={impairedCount > 0 ? '#8b1a1a' : undefined}>
      {/* Filter tabs */}
      <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:10}}>
        {[
          {key:'all',label:`All (${chains.length + institutionalServices.length})`},
          impairedCount + vulnerableCount > 0 && {key:'impaired',  label:` Issues (${impairedCount + vulnerableCount})`,  color:'#8b1a1a'},
          runningCount > 0                    && {key:'productive',label:`✓ Productive (${runningCount})`,            color:'#1a5a28'},
          entrepotCount > 0                   && {key:'entrepot',  label:` Entrepôt (${entrepotCount})`,              color:'#a0762a'},
          institutionalServices.length > 0    && {key:'services',  label:` Services (${institutionalServices.length})`, color:'#5a3a1a'},
        ].filter(Boolean).map(f => (
          <Button key={f.key} variant="secondary" size="sm" aria-pressed={flowFilter===f.key}
            onClick={() => setFlowFilter(f.key)} style={{
            padding:'4px 10px',borderRadius:4,minHeight:undefined,fontSize:FS.xxs,fontWeight:flowFilter===f.key?700:500,
            background:flowFilter===f.key?(f.color?`${f.color}18`:'#1c140918'):'#fff',
            color:flowFilter===f.key?(f.color||'#1c1409'):'#6b5340',
            border:`1px solid ${flowFilter===f.key?(f.color||'#1c1409'):'#c8b89a'}`,
          }}>{f.label}</Button>
        ))}
      </div>

      {/* Chain cards */}
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {filtered.map((chain, i) => {
          const st = FLOW_STATUS[chain.status] || FLOW_STATUS.operational;
          const hasIncome = incomeSources.some(inc =>
            inc.source.toLowerCase().includes(chain.label.split(' ')[0].toLowerCase()) ||
            (chain.needKey === 'trade_entrepot' && inc.source.toLowerCase().includes('entrepôt'))
          );
          const incomeEntry = hasIncome ? incomeSources.find(inc =>
            inc.source.toLowerCase().includes(chain.label.split(' ')[0].toLowerCase()) ||
            (chain.needKey === 'trade_entrepot' && inc.source.toLowerCase().includes('entrepôt'))
          ) : null;

          return (
            <div key={i} style={{
              background:st.bg, border:`1px solid ${st.border}`,
              borderLeft:`3px solid ${st.color}`,
              borderRadius:6, padding:'8px 12px',
            }}>
              {/* Header row */}
              <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4,flexWrap:'wrap'}}>
                <span style={{fontSize:FS.md}}>{chain.resourceIcon}</span>
                <span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{chain.label}</span>
                <span style={{fontSize:FS.micro,color:chain.needColor,background:`${chain.needColor}15`,borderRadius:3,padding:'0 5px',fontWeight:700}}>{chain.needIcon} {chain.needLabel}</span>
                <span style={{fontSize:FS.micro,fontWeight:800,color:st.color,background:`${st.color}15`,borderRadius:3,padding:'0 5px',marginLeft:'auto'}}>{st.label}</span>
              </div>

              {/* Institutions + outputs */}
              <div style={{display:'flex',gap:10,flexWrap:'wrap',marginBottom:chain.dependency||chain.entrepotNote?6:0}}>
                <div style={{flex:'1 1 140px'}}>
                  <div style={{fontSize:FS.micro,fontWeight:700,color:MUTED,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:2}}>Via</div>
                  <div style={{fontSize:FS.xs,color:swatch.inkMag2,lineHeight:1.3}}>{chain.processingInstitutions.join(' · ')}</div>
                </div>
                {chain.outputs.length > 0 && <div style={{flex:'1 1 140px'}}>
                  <div style={{fontSize:FS.micro,fontWeight:700,color:MUTED,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:2}}>Outputs</div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:2}}>
                    {chain.outputs.slice(0, 3).map((o, j) => (
                      <span key={j} style={{fontSize:FS.xxs,color:swatch.inkMag2,background:`${st.color}10`,borderRadius:3,padding:'1px 5px'}}>{o}</span>
                    ))}
                  </div>
                </div>}
              </div>

              {/* Impairment detail */}
              {chain.dependency && (
                <div style={{fontSize:FS.xs,color:st.color,background:`${st.color}08`,borderRadius:4,padding:'4px 8px',marginTop:4,lineHeight:1.4}}>
                  <strong>Needs {chain.dependency.resource}</strong> - {chain.dependency.impact}
                  {chain.dependency.affectedServices.length > 0 && <span style={{color:MUTED}}> · affects: {chain.dependency.affectedServices.slice(0, 3).join(', ')}</span>}
                </div>
              )}

              {/* Entrepôt note */}
              {chain.entrepot && chain.entrepotNote && !chain.dependency && (
                <p style={{fontSize:FS.xxs,color:swatch['#A0762A'],fontStyle:'italic',margin:'4px 0 0',lineHeight:1.3}}>{chain.entrepotNote}</p>
              )}

              {/* Magic substitution note */}
              {chain.magicNote && (
                <div style={{fontSize:FS.xxs,color:swatch.magic,background:swatch['#F8F0FF'],borderRadius:4,
                  padding:'4px 8px',marginTop:4,borderLeft:'3px solid #c0a0e0',lineHeight:1.4}}>
                  ✦ <em>{chain.magicNote}</em>
                  {chain.magicRecovery && <span style={{marginLeft:6,fontSize:FS.micro,color:swatch['#7A4AAA'],fontWeight:700}}>
                    {Math.round(chain.magicRecovery * 100)}% recovery
                  </span>}
                </div>
              )}

              {/* Income contribution */}
              {incomeEntry && (
                <div style={{fontSize:FS.xxs,color:swatch.inkMag3,marginTop:4}}>
                  Contributes to <strong>{incomeEntry.source}</strong> - {incomeEntry.percentage}% of income
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Institutional Services — tertiary economy */}
      {institutionalServices.length > 0 && (flowFilter === 'all' || flowFilter === 'services') && <>
        <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginTop:10,marginBottom:6}}>Service Economy</div>
        <div style={{display:'flex',flexDirection:'column',gap:5}}>
          {institutionalServices.map((svc, i) => (
            <div key={i} style={{
              background:swatch['#FAF8F4'],border:`1px solid ${svc.color}30`,
              borderLeft:`3px solid ${svc.color}`,
              borderRadius:6,padding:'7px 12px',
              display:'flex',alignItems:'flex-start',gap:8,
            }}>
              <span style={{fontSize: FS['16'],flexShrink:0}}>{svc.icon}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:2,flexWrap:'wrap'}}>
                  <span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{svc.label}</span>
                  <span style={{fontSize:FS.micro,fontWeight:700,color:svc.color,background:`${svc.color}15`,borderRadius:3,padding:'0 5px'}}>service</span>
                  {svc.exportable && <span style={{fontSize:FS.micro,color:swatch.success,background:swatch['#E8F5EC'],borderRadius:3,padding:'0 5px'}}>export</span>}
                  <span style={{fontSize:FS.micro,fontWeight:800,color:swatch.inkMag3,background:swatch['#EDE3CC'],borderRadius:3,padding:'0 5px',marginLeft:'auto'}}>○ Operational</span>
                </div>
                <div style={{fontSize:FS.xs,color:swatch.inkMag2}}>
                  <span style={{color:MUTED,marginRight:4}}>Via:</span>{svc.institutions.join(' · ')}
                </div>
                <div style={{fontSize:FS.xs,color:swatch.inkMag3,marginTop:1}}>{svc.output}</div>
              </div>
            </div>
          ))}
        </div>
      </>}
    </Section>
  );
}

export function EconomicsTab({economicState, settlement, narrativeNote}) {
  const s = settlement;
  const mobile = isMobile();
  const eco = economicState || s?.economicState;
  const via = s?.economicViability;
  if (!eco) return <Empty message="No economic data available."/>;

  const prosColor = PROSPERITY_COLORS[eco.prosperity] || '#a0762a';
  const fb = via?.metrics?.foodBalance;
  // Deficit % MUST come from the canonical display model (residual ÷ daily need),
  // the same value the PDF prints — NOT the engine's gross metrics.foodBalance
  // .deficitPercent (deficit ÷ adjustedNeed, pre-import), which disagrees with the
  // PDF on every import-dependent settlement. (A+ pdf.3 — one fact, one source.)
  const fbal = deriveFoodBalance(s);
  // Terrain-critical imports (things this terrain physically cannot produce)
  const terrainCriticals = (() => {
    const res = s?.resourceAnalysis;
    if (!res || Array.isArray(res.imports)) return [];
    return res.imports?.critical || [];
  })();

  const _hasCrit = eco.tradeDependencies?.some(d => d.severity === 'critical');
  const _sp = eco.safetyProfile || {};
  const ecoScore = Math.round(eco.compound?.economyOutput || 0);
  const tradeLabel = (eco.tradeAccess || 'road').replace(/_/g,' ');

  // Safety tile color

  // Food tile
  const foodSurplus = fb?.surplus > 0;
  const foodDeficit = fb?.deficit > 0;
  const foodColor = foodDeficit ? '#8b1a1a' : foodSurplus ? '#1a5a28' : '#a0762a';
  const foodLabel = foodDeficit ? `Deficit ${fbal.deficitPct}%` : foodSurplus ? 'Surplus' : 'Balanced';

  return (
    <div style={{...sans}}>
      <TabIntro tabKey="economics" />
      <NarrativeNote note={narrativeNote} />

      {/* ── PROSPERITY HEADER ───────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#faf6ec,#f5ede0)',border:'1px solid #d8c090',borderLeft:`4px solid ${prosColor}`,borderRadius:8,padding:'12px 16px',marginBottom:14}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <div>
            <div style={{fontSize: FS['22'],fontWeight:700,color:prosColor,lineHeight:1.1,marginBottom:3}}>{eco.prosperity}</div>
            <div style={{fontSize:FS.sm,color:swatch.inkMag3}}>{eco.economicComplexity}</div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'flex-start'}}>
            <div style={{textAlign:'center',background:'rgba(250,248,244,0.97)',border:'1px solid #d8c090',borderRadius:6,padding:'6px 12px'}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:MUTED,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2}}>Trade</div>
              <div style={{fontSize:FS.sm,fontWeight:600,color:swatch.inkMag,textTransform:'capitalize'}}>{tradeLabel}</div>
            </div>
            {ecoScore>0&&<div style={{textAlign:'center',background:'rgba(250,248,244,0.97)',border:'1px solid #d8c090',borderRadius:6,padding:'6px 12px'}}>
              <div style={{fontSize:FS.micro,fontWeight:700,color:MUTED,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:2}}>Output</div>
              <div style={{fontSize:FS.md,fontWeight:700,color:ecoScore>=60?'#1a5a28':ecoScore>=35?'#a0762a':'#8b1a1a'}}>{ecoScore}/100</div>
            </div>}
          </div>
        </div>
        {eco.situationDesc&&<p style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.65,margin:'10px 0 0',borderTop:'1px solid #e0c890',paddingTop:8}}>{eco.situationDesc}</p>}
      </div>

      {/* ── AT-A-GLANCE TILES ───────────────────────────────────────────── */}
      <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
        {[
          {icon:'',label:'Economy',value:eco.prosperity,sub:ecoScore?`Output score: ${ecoScore}/100`:undefined,color:prosColor},
          {icon:'',label:'Food',value:foodLabel,sub:fb?`${fb.dailyProduction?.toLocaleString()} / ${fb.dailyNeed?.toLocaleString()} lbs/day`:undefined,color:foodColor},
        ].map(({icon,label,value,sub,color})=>(
          <div key={label} style={{flex:'1 1 120px',background:swatch['#FAF8F4'],border:`1px solid ${color}30`,borderTop:`3px solid ${color}`,borderRadius:6,padding:'8px 10px',minWidth:0}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>{icon} {label}</div>
            <div style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag,lineHeight:1.2,marginBottom:sub?2:0}}>{value}</div>
            {sub&&<div style={{fontSize:FS.xxs,color:MUTED,lineHeight:1.3}}>{sub}</div>}
          </div>
        ))}
      </div>

      {/* ── INCOME SOURCES ──────────────────────────────────────────────── */}
      {eco.incomeSources?.length>0&&<Section title="Income Sources" collapsible defaultOpen>
        <div style={{display:'flex',flexDirection:'column',gap:5}}>
          {eco.incomeSources.map((src,i)=>{
            const isCrim = src.isCriminal;
            const _barColor = isCrim ? '#4a1a4a' : `linear-gradient(to right,${prosColor},#b8860b)`;
            return (
            <div key={i} style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{flex:1,background:swatch['#E8DCC8'],borderRadius:4,height:26,position:'relative',overflow:'hidden',minWidth:40}}>
                <div style={{position:'absolute',inset:'0',right:`${100-Math.min(src.percentage,100)}%`,background:isCrim?'#4a1a4a':`linear-gradient(to right,${prosColor},#b8860b)`,display:'flex',alignItems:'center',paddingLeft:6}}>
                  {src.percentage>=8&&<span style={{fontSize:FS.xxs,fontWeight:700,color:swatch.white,whiteSpace:'nowrap'}}>{src.percentage}%</span>}
                </div>
                {src.percentage<8&&<span style={{position:'absolute',left:`${src.percentage+1}%`,top:'50%',transform:'translateY(-50%)',fontSize:FS.xxs,fontWeight:700,color:isCrim?'#4a1a4a':'#6b5340'}}>{src.percentage}%</span>}
              </div>
              <div style={{width:mobile?130:210,flexShrink:0,minWidth:0}}>
                <div style={{fontSize:FS.sm,fontWeight:600,color:isCrim?'#4a1a4a':'#1c1409',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                  {isCrim&&<span style={{fontSize:FS.micro,fontWeight:800,color:swatch['#4A1A4A'],background:swatch['#F0E0F0'],borderRadius:2,padding:'0 4px',marginRight:4}}>️ CRIMINAL</span>}
                  {src.source}
                </div>
                {src.desc&&<div style={{fontSize:FS.xxs,color:MUTED,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{src.desc}</div>}
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
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.success,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Exports</div>
            {eco.primaryExports?.length>0
              ?<div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {eco.primaryExports.map((e,i)=>{const t=e.includes('(transit)');const isCust=(eco.customTradeLabels?.exports||[]).some(x=>x.toLowerCase()===e.toLowerCase());const incl=isCust?(eco.customCategoryExports?.[e]||null):null;return isCust
                  ? <span key={i} title={incl&&incl.length?`incl. ${incl.join(', ')}`:undefined} style={{fontSize:FS.xs,fontWeight:700,color:GOLD_DEEP,...GOLD_TINT,borderWidth:1,borderStyle:'solid',borderRadius:12,padding:'3px 9px',display:'inline-flex',alignItems:'center',gap:4}}>{e}{incl&&incl.length?<span style={{fontWeight:600,opacity:0.8}}> · incl. {incl.length}</span>:null}<span style={{fontWeight:800}}>✦</span></span>
                  : <span key={i} style={{fontSize:FS.xs,fontWeight:600,color:t?'#2a3a7a':'#1a5a28',background:t?'#eaecf8':'#e8f5ec',border:`1px solid ${t?'#a8b8e8':'#a8d8b0'}`,borderRadius:12,padding:'3px 9px'}}>{e}</span>;})}
                {eco.isEntrepot&&<div style={{width:'100%',fontSize:FS.xxs,color:swatch.info,fontStyle:'italic',marginTop:4}}> Blue = re-exported transit goods</div>}
              </div>
              :<p style={{fontSize:FS.sm,color:MUTED,fontStyle:'italic',margin:0}}>No significant exports.</p>
            }
          </div>
          {/* Imports */}
          <div>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.danger,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Imports</div>
            {eco.primaryImports?.length>0
              ?<div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {[...eco.primaryImports, ...terrainCriticals.filter(tc => !eco.primaryImports.some(imp => imp.toLowerCase().includes(tc.toLowerCase())))].sort().map((imp,i)=>{
                    const n=eco.necessityImports?.some(x=>imp.toLowerCase().includes(x.toLowerCase()));
                    const t=terrainCriticals.some(tc=>imp.toLowerCase().includes(tc.toLowerCase())||tc.toLowerCase().includes(imp.toLowerCase()));
                    const color = t?'#7a0a0a':n?'#8b1a1a':'#7a5010';
                    const bg    = t?'#fdf0f0':n?'#fdf4f4':'#faf4e8';
                    const bdr   = t?'#e08080':n?'#e8b0b0':'#d8c090';
                    const icon  = t?' ':n?' ':'';
                    const isCust=(eco.customTradeLabels?.imports||[]).some(x=>x.toLowerCase()===imp.toLowerCase());
                    const incl=isCust?(eco.customCategoryImports?.[imp]||null):null;
                    return isCust
                      ? <span key={i} title={incl&&incl.length?`incl. ${incl.join(', ')}`:undefined} style={{fontSize:FS.xs,fontWeight:700,color:GOLD_DEEP,...GOLD_TINT,borderWidth:1,borderStyle:'solid',borderRadius:12,padding:'3px 9px',display:'inline-flex',alignItems:'center',gap:4}}>{imp}{incl&&incl.length?<span style={{fontWeight:600,opacity:0.8}}> · incl. {incl.length}</span>:null}<span style={{fontWeight:800}}>✦</span></span>
                      : <span key={i} style={{fontSize:FS.xs,fontWeight:600,color,background:bg,border:`1px solid ${bdr}`,borderRadius:12,padding:'3px 9px'}}>{imp}{icon}</span>;
                  })}
                {(eco.necessityImports?.length>0||terrainCriticals.length>0)&&<div style={{width:'100%',fontSize:FS.xxs,color:swatch.inkMag3,fontStyle:'italic',marginTop:4}}>
                  {terrainCriticals.length>0&&<span style={{color:swatch['#7A0A0A']}}> Terrain cannot produce</span>}
                  {terrainCriticals.length>0&&eco.necessityImports?.length>0&&<span> · </span>}
                  {eco.necessityImports?.length>0&&<span style={{color:swatch.danger}}> Settlement necessity</span>}
                </div>}
              </div>
              :<p style={{fontSize:FS.sm,color:MUTED,fontStyle:'italic',margin:0}}>No recorded imports.</p>
            }
          </div>
        </div>
        {/* §14 Phase 3b — cross-settlement trade with the neighbour */}
        {eco.tradeLinks?.length>0&&(()=>{
          const byPartner={};
          for(const l of eco.tradeLinks){const b=byPartner[l.partner]=byPartner[l.partner]||{imports:[],exports:[]};(l.direction==='import'?b.imports:b.exports).push(l.good);}
          return <div style={{borderTop:'1px solid #e8d8b0',paddingTop:10,marginBottom:eco.localProduction?.length>0?12:0}}>
            <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.info,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>↔ Trade with neighbours</div>
            {Object.entries(byPartner).map(([partner,g],i)=>(
              <div key={i} style={{fontSize:FS.xs,color:swatch.inkMag2,marginBottom:3,lineHeight:1.5}}>
                <strong style={{color:swatch.inkMag}}>{partner}</strong>
                {g.imports.length>0&&<span style={{marginLeft:8}}><span style={{color:TRADE_IN_COLOR,fontWeight:800}}>←</span> {g.imports.join(', ')}</span>}
                {g.exports.length>0&&<span style={{marginLeft:8}}><span style={{color:TRADE_OUT_COLOR,fontWeight:800}}>→</span> {g.exports.join(', ')}</span>}
              </div>
            ))}
            <div style={{fontSize:FS.micro,color:MUTED,fontStyle:'italic',marginTop:3}}>← imported from · → exported to</div>
          </div>;
        })()}
        {/* Local production */}
        {eco.localProduction?.length>0&&<div style={{borderTop:'1px solid #e8d8b0',paddingTop:10}}>
          <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:6}}>Produced Locally</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
            {eco.localProduction.map((p,i)=><span key={i} style={{fontSize:FS.xxs,color:swatch.inkMag2,background:swatch['#F0EAD8'],border:'1px solid #d8c890',borderRadius:4,padding:'1px 7px',textTransform:'capitalize'}}>{p.replace(/_/g,' ')}</span>)}
          </div>
        </div>}
      </Section>}

      {/* ── CRITICAL IMPORTS ──────────────────────────────────────────────── */}
      

      {/* ── FOOD SECURITY ──────────────────────────────────────────────────── */}
      {fb&&<Section title="Food Security" collapsible defaultOpen={!!fb.deficit} accent={foodColor}>
        {/* Balance bar */}
        <div style={{marginBottom:10}}>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:FS.xs,color:swatch.inkMag3,marginBottom:4}}>
            <span>Production: {fb.dailyProduction?.toLocaleString()} lbs/day</span>
            {fb.importCoverage>0&&<span style={{color:swatch['#2A5A8A']}}>+ {fb.importCoverage.toLocaleString()} imported</span>}
            <span>Need: {fb.dailyNeed?.toLocaleString()} lbs/day</span>
          </div>
          <div style={{height:10,background:swatch['#E8DCC8'],borderRadius:5,overflow:'hidden',position:'relative'}}>
            {/* Production bar */}
            <div style={{height:'100%',width:`${Math.min(100,Math.round((fb.dailyProduction/Math.max(1,fb.dailyNeed))*100))}%`,background:foodDeficit?'#c08080':foodSurplus?'#1a5a28':'#a0762a',borderRadius:5}}/>
            {/* Import coverage overlay */}
            {fb.importCoverage>0&&<div style={{position:'absolute',top:0,left:`${Math.min(100,Math.round((fb.dailyProduction/Math.max(1,fb.dailyNeed))*100))}%`,height:'100%',width:`${Math.min(100-Math.round((fb.dailyProduction/Math.max(1,fb.dailyNeed))*100),Math.round((fb.importCoverage/Math.max(1,fb.dailyNeed))*100))}%`,background:swatch['#2A5A8A'],borderRadius:'0 5px 5px 0'}}/>}
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:FS.xxs,color:MUTED,marginTop:3}}>
            <span>Agriculture modifier: {Math.round((fb.agricultureModifier||1)*100)}%</span>
            {fb.stressModifier&&fb.stressModifier<1&&<span style={{color:swatch.danger}}>Stress penalty: ×{fb.stressModifier}</span>}
            {fb.importCoverage>0&&<span style={{color:swatch['#2A5A8A']}}>Trade covers {Math.round(fb.importCoverage/(fb.rawDeficit||fb.importCoverage)*100)}% of gap</span>}
          </div>
        </div>
        {/* Narrative */}
        <div style={{background:foodDeficit?'#fdf4f4':'#f0faf2',border:`1px solid ${foodDeficit?'#e8c0c0':'#a8d8b0'}`,borderLeft:`3px solid ${foodColor}`,borderRadius:6,padding:'8px 12px',fontSize:FS.sm,color:foodDeficit?'#5a1a1a':'#1a3a10',lineHeight:1.5}}>
          {foodDeficit
            ? fb.importCoverage>0
              ? `Production covers ${Math.round(fb.dailyProduction/fb.dailyNeed*100)}% of food needs. Trade imports cover an estimated ${Math.round(fb.importCoverage/(fb.rawDeficit||1)*100)}% of the gap. Residual shortfall is ${fbal.deficitPct}%. Settlement is trade-dependent for food security.`
              : ` Production deficit of ${fbal.deficitPct}%. Settlement requires food imports to sustain population.`
            : `Agricultural surplus of ${Math.round((fb.surplus/Math.max(1,fb.dailyNeed))*100)}% above daily needs.`
          }
        </div>
      </Section>}

      {/* ── ECONOMIC FLOWS (unified production chains + dependencies) ──────── */}
      {eco.activeChains?.length > 0 && (
        <EconomicFlowsSection
          chains={eco.activeChains}
          institutionalServices={eco.institutionalServices || []}
          incomeSources={eco.incomeSources || []}
        />
      )}

      {/* ── ECONOMIC PLOT HOOKS (currently invisible — now surfaced) ─────── */}
      {via?.plotHooks?.length>0&&<Section title={`Economic Plot Hooks (${via.plotHooks.length})`} collapsible defaultOpen={false} accent="#5a2a8a">
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {via.plotHooks.map((h,i)=>{
            const text=typeof h==='object'?h.hook||Ti(h):String(h);
            const cat=typeof h==='object'?h.category:null;
            return <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
              <span style={{fontSize:FS.sm,flexShrink:0,marginTop:1,color:swatch.magic}}>✦</span>
              <div style={{flex:1}}>
                {cat&&<span style={{fontSize:FS.xxs,fontWeight:700,color:swatch.magic,textTransform:'uppercase',letterSpacing:'0.04em',marginRight:6}}>{cat}</span>}
                <span style={{fontSize:FS.md,color:swatch.inkMag,lineHeight:1.5}}>{text}</span>
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

      {/* ── CUSTOM SUPPLY CHAINS (§14 — user-confirmed in the Compendium) ──────── */}
      {eco?.customChains?.length > 0 && (
        <Section title={`Custom Supply Chains (${eco.customChains.length})`} collapsible defaultOpen={false}>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {eco.customChains.map((c,i)=>{
              const nodes = [c.resource, ...(c.processingInstitutions||[]), ...((c.outputs||[]).slice(0,3))].filter(Boolean);
              return (
                <div key={i} style={{...GOLD_TINT, borderWidth:1, borderStyle:'solid', borderRadius:5, padding:'8px 12px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:nodes.length?4:0,flexWrap:'wrap'}}>
                    <span style={{fontSize:FS.sm,fontWeight:800,color:swatch.inkMag}}>{c.label}</span>
                    <span style={{fontSize:FS.micro,fontWeight:800,color:GOLD_DEEP,letterSpacing:'0.04em'}}>✦</span>
                  </div>
                  {nodes.length>0 && (
                    <div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap'}}>
                      {nodes.map((n,j)=>(
                        <React.Fragment key={j}>
                          {j>0 && <span style={{fontSize:FS.xxs,color:MUTED}}>→</span>}
                          <span style={{fontSize:FS.xs,color:swatch.inkMag2,background:'rgba(255,255,255,0.55)',borderRadius:3,padding:'1px 6px',textTransform:'capitalize'}}>{n}</span>
                        </React.Fragment>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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
              <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.success,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>
                ✓ Fully Exploited ({full.length})
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {full.map((r,i)=><span key={i} style={{fontSize:FS.xs,color:swatch.success,background:swatch['#E8F5EC'],border:'1px solid #a8d8b0',borderRadius:4,padding:'2px 8px'}}>{r.rawResource||r.resource||(typeof r==='string'?r:r.chainKey||'?')}</span>)}
              </div>
            </div>}
            {part.length>0&&<div>
              <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch['#8A5010'],textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>
                ◑ Partially Exploited ({part.length})
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {part.map((r,i)=>{
                const name = r.rawResource||r.resource||(typeof r==='string'?r:r.chainKey||'?');
                const missing = r.processingInstitutions?.length
                  ? '' : r.dependsOn?.length ? ' (needs: '+r.dependsOn.slice(0,2).join(', ')+')' : '';
                return <span key={i} style={{fontSize:FS.xs,color:swatch['#8A5010'],background:swatch['#FDF0E0'],border:'1px solid #e0b870',borderRadius:4,padding:'2px 8px'}}>{name}{missing}</span>;
              })}
              </div>
            </div>}
            {unex.length>0&&<div>
              <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>
                ○ Unexploited Opportunity ({unex.length})
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {unex.map((r,i)=><span key={i} style={{fontSize:FS.xs,color:swatch.inkMag3,background:swatch['#F5F0E8'],border:'1px solid #c8b89a',borderRadius:4,padding:'2px 8px'}}>{r.rawResource||r.resource||(typeof r==='string'?r:r.chainKey||'?')}</span>)}
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
        const _tier = s?.tier || 'village';
        const scaleNote = bmc>=30
          ? 'A substantial portion of economic activity bypasses legitimate channels. Tax revenue is severely compressed. Guild structures are being undercut.'
          : bmc>=15
          ? 'Significant off-book activity. Merchants operating in the shadow economy have a cost advantage over those paying duties and guild fees.'
          : 'Minor shadow activity. Petty theft and small-scale unlicensed trade. An inconvenience, not a structural threat.';

        // What goods flow through the shadow economy (from crime types)
        const _shadowGoods = crimeTypes
          .filter(ct => ct.type && ct.type.toLowerCase().includes('smuggl') ||
                        ct.type?.toLowerCase().includes('contraband') ||
                        ct.type?.toLowerCase().includes('black market'))
          .slice(0, 2);

        return <Section title={`Shadow Economy${bmc}% capture`} collapsible defaultOpen={bmc>=15}>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>

            {/* Capture rate + scale context */}
            <div style={{background:sevBg,border:`1px solid ${sevColor}30`,borderLeft:`4px solid ${sevColor}`,borderRadius:6,padding:'10px 14px',display:'flex',gap:14,alignItems:'flex-start'}}>
              <div style={{flexShrink:0,textAlign:'center',minWidth:56}}>
                <div style={{fontWeight:800,fontSize: FS['26'],color:sevColor,lineHeight:1}}>{bmc}%</div>
                <div style={{fontSize:FS.micro,fontWeight:700,color:sevColor,textTransform:'uppercase',letterSpacing:'0.05em',marginTop:2}}>Off-book</div>
              </div>
              <div style={{flex:1}}>
                <p style={{fontSize:FS.sm,color:swatch.inkMag2,lineHeight:1.5,margin:'0 0 4px'}}>{scaleNote}</p>
                {dragDesc&&<p style={{fontSize: FS['11.5'],color:swatch.inkMag3,fontStyle:'italic',margin:0,lineHeight:1.4}}>{dragDesc}</p>}
              </div>
            </div>

            {/* What operations generate this revenue */}
            {crimInsts.length>0&&<div>
              <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>Economic Operations</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {crimInsts.map((name,i)=>{
                  const econ = criminalOpEcon(name);
                  return (
                    <div key={i} style={{background:swatch.dangerBg,border:'1px solid #e0b0b0',borderRadius:5,padding:'5px 10px',display:'flex',flexDirection:'column',gap:1}}>
                      <span style={{fontSize:FS.xs,fontWeight:700,color:swatch.danger}}>{name}</span>
                      <span style={{fontSize:FS.xxs,color:swatch['#6B4040']}}>{econ}</span>
                    </div>
                  );
                })}
              </div>
            </div>}

            {/* Active criminal supply chains */}
            {crimChains.length>0&&<div>
              <div style={{fontSize:FS.xxs,fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>Criminal Supply Chains</div>
              <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                {crimChains.map((c,i)=>(
                  <span key={i} style={{fontSize:FS.xxs,fontWeight:700,color:swatch['#5A1A1A'],background:swatch.dangerBg,border:'1px solid #e0b0b0',borderRadius:4,padding:'2px 8px'}}>
                    {c.chainId?.replace(/_/g,' ')} · {c.status}
                  </span>
                ))}
              </div>
            </div>}

            {/* Note directing to Defense for power structure */}
            <div style={{fontSize:FS.xs,color:MUTED,fontStyle:'italic',borderTop:'1px solid #e8d8c0',paddingTop:8}}>
              Criminal power structures, enforcement dynamics, and public order detail → Defense tab
            </div>

          </div>
        </Section>;
      })()}

      {/* UX overhaul Phase 2 — economic_capacity band + live granary gauge
          (deriveBlockadeRelief: storageMonths vs capacity + tithe/drawdown/
          blockade/deployment flags). Self-gates to nothing without a band or a
          live stockpile record. */}
      <EconomicsGranarySection settlement={settlement} />

    </div>
  );
}

export default React.memo(EconomicsTab);
