import React from 'react';
import { Download, Sparkles, Map, FileText } from 'lucide-react';
import { generateSettlementPDF } from '../utils/generateSettlementPDF.js';
import { downloadNarrativePrompt, downloadMapPrompt } from '../utils/promptExporters.js';
import { sans } from './theme.js';
import ConfigurationPanel from './ConfigurationPanel';
import InstitutionalGrid from './InstitutionalGrid';
import ServicesTogglePanel from './ServicesTogglePanel';
import TradeDynamicsPanel from './TradeDynamicsPanel';
import OutputContainer from './OutputContainer';

/**
 * GenerateView — the Create tab content.
 * Receives generation state (from useSettlementGeneration), UI state, and isMobile.
 * App.jsx is the router; this component is the view.
 */
function downloadJSON(settlement) {
  if (!settlement) return;
  const blob = new Blob([JSON.stringify(settlement, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), {
    href: url,
    download: `${(settlement.name || 'settlement').replace(/\s+/g, '_')}.json`
  });
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
}


export default function GenerateView({
  // From useSettlementGeneration
  settlement, importedNeighbor, clearNeighbor, generateSettlement,
  loadedFromSave, clearLoadedFromSave,
  config, updateConfig, currentCatalog, tierForGrid,
  institutionToggles, categoryToggles, servicesToggles, goodsToggles,
  tierInstitutionNames, isManualTier,
  toggleInstitution, toggleCategory, isCategoryEnabled, resetToggles,
  bulkForceInstitutions, bulkExcludeInstitutions,
  toggleService, resetGoodsServices, bulkSetServices,
  toggleGood, bulkSetGoods,
  aiSettlement, setAiSettlement, regenSection,
  // UI state
  configOpen, setConfigOpen,
  instOpen,   setInstOpen,
  svcOpen,    setSvcOpen,
  showAdvanced, setShowAdvanced,
  randomSliderMode, setRandomSliderMode,
  // Neighbour system
  handleImportDirect,
  neighbourRelType, setNeighbourRelType,
  // Misc
  isMobile,
}) {
  return (
<div style={{display:'flex', flexDirection:'column', gap:16}}>

  {/* Saved config active banner */}
  {loadedFromSave && (
    <div style={{display:'flex',alignItems:'center',gap:10,background:'#fdf8ee',border:'2px solid #b8860b',borderRadius:8,padding:'10px 14px'}}>
      <span style={{fontSize:16,flexShrink:0}}>📋</span>
      <div style={{flex:1}}>
        <span style={{fontSize:13,fontWeight:700,color:'#5a3a00'}}>Configuration loaded: {loadedFromSave.name}</span>
        {loadedFromSave.tier && <span style={{fontSize:12,color:'#8a6020',marginLeft:8}}>{loadedFromSave.tier} · Settings from this settlement are active</span>}
      </div>
      <button onClick={clearLoadedFromSave} title="Clear" style={{display:'flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:'50%',background:'rgba(184,134,11,0.15)',border:'1px solid #b8860b',color:'#5a3a00',cursor:'pointer',fontSize:16,fontWeight:700,flexShrink:0}}>×</button>
    </div>
  )}

  {/* Neighbour active banner */}
  {importedNeighbor && (
    <div style={{display:'flex',alignItems:'center',gap:10,background:'#f0faf2',border:'2px solid #4a8a60',borderRadius:8,padding:'10px 14px'}}>
      <span style={{fontSize:16}}></span>
      <div style={{flex:1}}>
        <span style={{fontSize:13,fontWeight:700,color:'#1a5a28'}}>Neighbour active: {importedNeighbor.name}</span>
        <span style={{fontSize:12,color:'#4a8a60',marginLeft:8}}>{importedNeighbor.tier} · Next generation will include relationship data</span>
      </div>
      <button onClick={clearNeighbor} title="Remove neighbour" style={{display:'flex',alignItems:'center',justifyContent:'center',width:28,height:28,borderRadius:'50%',background:'rgba(74,138,96,0.15)',border:'1px solid #4a8a60',color:'#1a5a28',cursor:'pointer',fontSize:16,fontWeight:700,flexShrink:0}}>×</button>
    </div>
  )}

  {/* ── First-time hint — above configuration, only before first generation ── */}
  {!settlement && (
    <div style={{
      padding:'10px 14px',
      background:'#fef9ee',
      border:'1px solid #d4a843',
      borderLeft:'4px solid #b8860b',
      borderRadius:7,
      display:'flex',
      alignItems:'center',
      gap:10,
      pointerEvents:'none',
      userSelect:'none',
    }}>
      <span style={{fontSize:16,flexShrink:0,color:'#b8860b'}}>✦</span>
      <p style={{fontSize:13,color:'#5a3a00',margin:0,lineHeight:1.5}}>
        <strong style={{fontFamily:'Crimson Text, Georgia, serif',fontWeight:700}}>New here?</strong>{" "}Skip the configurations and hit{" "}<strong style={{fontFamily:'Crimson Text, Georgia, serif'}}>Generate Settlement</strong>{" "}for a fully randomised result. Every step below is optional — skip any, use any combination to build your envisioned domain, and generate whenever you're ready. Discover your world!
      </p>
    </div>
  )}

  {/* ️ Settlement Configuration collapsible */}
  <div style={{border:'1px solid #c8b89a',borderRadius:8,overflow:'hidden'}}>
    <button onClick={()=>setConfigOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'#f5ede0',border:'none',cursor:'pointer',textAlign:'left',borderBottom:configOpen?'1px solid #e0d0b0':'none',fontFamily:'Nunito, sans-serif'}}>
      <span style={{fontSize:15}}>️</span>
      <span style={{fontFamily:'Crimson Text, Georgia, serif',fontSize:16,fontWeight:600,color:'#1c1409',flex:1}}>Step 1: General Configuration</span>
      <span style={{fontSize:11,color:'#9c8068',fontWeight:500}}>{configOpen?'Collapse':'Configure Foundations'}</span>
    </button>
    {configOpen && <ConfigurationPanel config={config} updateConfig={updateConfig} showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced} onGenerate={()=>generateSettlement()} importedNeighbor={importedNeighbor} onClearNeighbor={clearNeighbor} randomSliderMode={randomSliderMode} setRandomSliderMode={setRandomSliderMode}/>}
  </div>

  {/* ️ Institutions collapsible */}
  <div style={{border:'1px solid #c8b89a',borderRadius:8}}>
    <button onClick={()=>setInstOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'#f5ede0',border:'none',cursor:'pointer',textAlign:'left',borderBottom:instOpen?'1px solid #e0d0b0':'none',fontFamily:'Nunito, sans-serif'}}>
      <span style={{fontSize:15}}>️</span>
      <span style={{fontFamily:'Crimson Text, Georgia, serif',fontSize:16,fontWeight:600,color:'#1c1409',flex:1}}>Step 2: Institutions</span>
      <span style={{fontSize:11,color:'#9c8068',fontWeight:500}}>{instOpen?'Collapse':'Configure Institutions'}</span>
    </button>
    {instOpen && <InstitutionalGrid tier={tierForGrid} catalog={currentCatalog} tierInstitutionNames={tierInstitutionNames} isManualTier={isManualTier} toggles={institutionToggles} categoryToggles={categoryToggles} onToggle={toggleInstitution} onCategoryToggle={toggleCategory} isCategoryEnabled={isCategoryEnabled} onResetToggles={resetToggles} onBulkAllow={resetToggles} onBulkDisallow={resetToggles} onBulkForce={bulkForceInstitutions} onBulkExclude={bulkExcludeInstitutions} goodsToggles={goodsToggles}/>}
  </div>

  {/* ️ Services collapsible */}
  <div style={{border:'1px solid #c8b89a',borderRadius:8}}>
    <button onClick={()=>setSvcOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'10px 14px',background:'#f5ede0',border:'none',cursor:'pointer',textAlign:'left',borderBottom:svcOpen?'1px solid #e0d0b0':'none',fontFamily:'Nunito, sans-serif'}}>
      <span style={{fontSize:15}}>️</span>
      <span style={{fontFamily:'Crimson Text, Georgia, serif',fontSize:16,fontWeight:600,color:'#1c1409',flex:1}}>Step 3: Available Services</span>
      <span style={{fontSize:11,color:'#9c8068',fontWeight:500}}>{svcOpen?'Collapse':'Configure Services'}</span>
    </button>
    {svcOpen && <ServicesTogglePanel tier={tierForGrid} currentCatalog={currentCatalog} servicesToggles={servicesToggles} onServiceToggle={toggleService} onReset={resetGoodsServices} onBulkAllow={()=>bulkSetServices('reset')} onBulkDisallow={()=>bulkSetServices('reset')} onBulkForce={()=>bulkSetServices('force')}/>}
  </div>

  {/*  Trade Dynamics (always visible, internally collapsible) */}
  <TradeDynamicsPanel tier={tierForGrid} goodsToggles={goodsToggles} onGoodsToggle={toggleGood} onResetToggles={resetGoodsServices} onBulkAllow={()=>bulkSetGoods('reset')} onBulkDisallow={()=>bulkSetGoods('reset')}/>


  {/*  Generate button */}
  <button
    onClick={()=>{
      try { generateSettlement(); clearLoadedFromSave?.(); }
      catch(e) { console.error('GENERATE ERROR:', e); alert('Error: ' + e.message + '\n\n' + e.stack); }
    }}
    style={{width:'100%',padding:isMobile?'16px 0':'14px 0',background:'linear-gradient(135deg, #a0762a 0%, #b8860b 100%)',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontFamily:'Crimson Text, Georgia, serif',fontSize:isMobile?20:19,fontWeight:600,letterSpacing:'0.02em',boxShadow:'0 3px 14px rgba(160,118,42,0.45)',transition:'opacity 0.15s, transform 0.1s'}}
    onMouseOver={e=>e.currentTarget.style.opacity='0.92'}
    onMouseOut={e=>e.currentTarget.style.opacity='1'}
    onMouseDown={e=>e.currentTarget.style.transform='scale(0.99)'}
    onMouseUp={e=>e.currentTarget.style.transform='scale(1)'}
  >
     Generate Settlement
  </button>

  {/* Output + export buttons */}
  {settlement && <>
    <OutputContainer settlement={settlement} aiSettlement={aiSettlement} setAiSettlement={setAiSettlement} onRegenerate={regenSection}/>
    <div style={{display:'flex',flexDirection:isMobile?'column':'row',justifyContent:'center',gap:isMobile?8:10,paddingTop:4}}>
      {[
        {label:'Save/Export JSON',    Icon:Download,  action:()=>downloadJSON(settlement),            color:'#1a4a2a'},
        {label:'Export Narrative AI Prompt', Icon:Sparkles, action:()=>downloadNarrativePrompt(settlement), color:'#5a3a8a'},
        {label:'Export Map AI Prompt',Icon:Map,       action:()=>downloadMapPrompt(settlement),       color:'#8a3a1a'},
        {label:'Export PDF',          Icon:FileText,  action:()=>generateSettlementPDF(settlement),   color:'#7a1a1a'},
      ].map(({label,Icon,action,color})=>(
        <button key={label} onClick={action} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:7,padding:isMobile?'13px 18px':'9px 18px',width:isMobile?'100%':'auto',background:color,color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontFamily:'Nunito, sans-serif',fontSize:13,fontWeight:700,boxShadow:'0 2px 6px rgba(0,0,0,0.2)',transition:'opacity 0.15s'}}
          onMouseOver={e=>e.currentTarget.style.opacity='0.88'}
          onMouseOut={e=>e.currentTarget.style.opacity='1'}
        >
          <Icon size={14}/>{label}
        </button>
      ))}
    </div>
  </>}
</div>
  );
}
