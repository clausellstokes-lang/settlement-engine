import React, { useState, useMemo } from 'react';
import {ChevronDown, ChevronUp} from 'lucide-react';
import {STRESS_TYPE_MAP} from '../data/stressTypes';
import {getCompatibleResources} from '../generators/terrainHelpers';
import {GOLD, INK, MUTED, SECOND, BORDER, BORDER2, CARD, PARCH, sans} from './theme.js';
import { useStore } from '../store/index.js';

const PARCHMENT='#f7f0e4';

const ARCHETYPES=[
  {key:'balanced',name:'Balanced',desc:'No dominant characteristic',threat:'frontier',e:50,m:50,mg:50,r:50,c:50},
  {key:'merchant_republic',name:'Merchant Republic',desc:'Trade hub; guild security',threat:'heartland',e:82,m:38,mg:42,r:32,c:62},
  {key:'trade_crossroads',name:'Trade Crossroads',desc:'Major overland hub; active guilds',threat:'heartland',e:85,m:55,mg:45,r:40,c:55},
  {key:'mining_colony',name:'Mining Colony',desc:'Resource extraction; high military',threat:'frontier',e:68,m:72,mg:22,r:35,c:52},
  {key:'military_fortress',name:'Military Fortress',desc:'Heavily garrisoned; spartan',threat:'frontier',e:28,m:92,mg:18,r:42,c:28},
  {key:'frontier_outpost',name:'Frontier Outpost',desc:'Small post on edge of civilisation',threat:'frontier',e:35,m:80,mg:25,r:38,c:40},
  {key:'besieged_holdout',name:'Besieged Holdout',desc:'Under constant threat; fortified by necessity',threat:'plagued',e:25,m:88,mg:32,r:65,c:35},
  {key:'plague_of_beasts',name:'Embattled — Creature Threat',desc:'Hostile incursion; survival economy',threat:'plagued',e:22,m:75,mg:38,r:78,c:48},
  {key:'theocracy',name:'Theocracy',desc:'Church controls civic life',threat:'heartland',e:38,m:52,mg:35,r:92,c:18},
  {key:'holy_sanctuary',name:'Holy Sanctuary',desc:'Peaceful pilgrimage centre',threat:'heartland',e:35,m:22,mg:38,r:95,c:15},
  {key:'crusader_chapter',name:'Crusader Chapter',desc:'Faith and force unified',threat:'frontier',e:32,m:82,mg:28,r:82,c:18},
  {key:'mage_city',name:'Mage City',desc:'Arcane research centre',threat:'heartland',e:62,m:28,mg:92,r:22,c:38},
  {key:'arcane_academy',name:'Arcane Academy',desc:'Magical education above all',threat:'heartland',e:52,m:32,mg:96,r:28,c:35},
  {key:'monster_hunters',name:"Monster Hunters' Lodge",desc:'Magic and military vs creatures',threat:'plagued',e:42,m:72,mg:68,r:38,c:30},
  {key:'lawless_frontier',name:'Lawless Frontier',desc:'Criminal networks fill the vacuum',threat:'frontier',e:42,m:58,mg:30,r:28,c:82},
  {key:'criminal_haven',name:'Criminal Haven',desc:'The guild IS the government',threat:'heartland',e:72,m:25,mg:35,r:20,c:90},
  {key:'safe_province_capital',name:'Safe Province Capital',desc:'Peaceful administrative centre',threat:'heartland',e:68,m:42,mg:48,r:55,c:38},
];
const ARCHETYPE_GROUPS=[
  {label:'Neutral',keys:['balanced']},
  {label:'Economic',keys:['merchant_republic','trade_crossroads','mining_colony']},
  {label:'Military',keys:['military_fortress','frontier_outpost','besieged_holdout','plague_of_beasts']},
  {label:'Religious',keys:['theocracy','holy_sanctuary','crusader_chapter']},
  {label:'Arcane',keys:['mage_city','arcane_academy','monster_hunters']},
  {label:'Criminal',keys:['lawless_frontier','criminal_haven']},
  {label:'Civic',keys:['safe_province_capital']},
];
const PRIORITIES=[
  {key:'priorityEconomy',label:'Economy',accent:'#a0762a'},
  {key:'priorityMilitary',label:'Military',accent:'#8b1a1a'},
  {key:'priorityMagic',label:'Magic',accent:'#5a2a8a'},
  {key:'priorityReligion',label:'Religion',accent:'#1a5a28'},
  {key:'priorityCriminal',label:'Criminal',accent:'#4a1a4a'},
];

function Lbl({children}){return<div style={{fontSize:11,fontWeight:700,color:SECOND,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:4}}>{children}</div>;}
function Sel({value,onChange,children}){return<select value={value} onChange={onChange} style={{width:'100%',padding:'5px 10px',border:`1px solid ${BORDER2}`,borderRadius:5,fontSize:12,background:CARD,fontFamily:sans,color:INK,cursor:'pointer'}}>{children}</select>;}
function Collapsible({title,status,children}){
  const[open,setOpen]=useState(false);
  return<div><button onClick={()=>setOpen(o=>!o)} style={{background:'none',border:'none',cursor:'pointer',textAlign:'left',fontSize:12,fontWeight:600,color:SECOND,display:'flex',alignItems:'center',gap:6,padding:'4px 0',width:'100%',fontFamily:sans}}>{open?<ChevronUp size={14}/>:<ChevronDown size={14}/>}<span style={{flex:1}}>{title}</span>{status&&!open&&<span style={{fontSize:10,fontWeight:600,color:MUTED,background:'#f0ead8',borderRadius:3,padding:'1px 6px',flexShrink:0}}>{status}</span>}</button>{open&&children}</div>;
}

function SliderPanel({config,updateConfig,randomSliderMode,setRandomSliderMode}){
  const[applied,setApplied]=useState(null);
  const apply=e=>{
    const key=e.target.value;if(!key)return;
    const arc=ARCHETYPES.find(a=>a.key===key);if(!arc)return;
    updateConfig({priorityEconomy:arc.e,priorityMilitary:arc.m,priorityMagic:arc.mg,priorityReligion:arc.r,priorityCriminal:arc.c,monsterThreat:arc.threat});
    setApplied(key);e.target.value='';
  };
  return<div style={{background:PARCHMENT,border:`1px solid ${BORDER}`,borderRadius:7,padding:'12px 14px',marginTop:4}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:randomSliderMode?0:10}}>
      <Lbl>Priority Sliders</Lbl>
      <button onClick={()=>setRandomSliderMode(!randomSliderMode)} style={{fontSize:11,fontWeight:700,padding:'3px 10px',border:`1px solid ${randomSliderMode?GOLD:BORDER2}`,borderRadius:5,cursor:'pointer',background:randomSliderMode?GOLD:CARD,color:randomSliderMode?'#fff':SECOND,fontFamily:sans}}> {randomSliderMode?'Random':'Set manually'}</button>
    </div>
    {randomSliderMode
      ? <p style={{fontSize:11,color:MUTED,margin:'6px 0 0',lineHeight:1.4}}>Each generation randomises all priority sliders. Toggle off to set values manually or choose an archetype.</p>
      : <>
        <div style={{marginBottom:10}}>
          <Lbl>Archetype preset</Lbl>
          <div style={{display:'flex',gap:6}}>
            <select defaultValue="" onChange={apply} style={{flex:1,padding:'5px 10px',border:`1px solid ${BORDER2}`,borderRadius:5,fontSize:12,background:CARD,fontFamily:sans,color:INK,cursor:'pointer'}}>
              <option value="">— Choose an archetype —</option>
              {ARCHETYPE_GROUPS.filter(g=>config.magicExists!==false||g.label!=='Arcane').map(({label,keys})=><optgroup key={label} label={label}>{keys.map(key=>{const a=ARCHETYPES.find(x=>x.key===key);return a?<option key={key} value={key}>{a.name} — {a.desc}</option>:null;})}</optgroup>)}
            </select>
            {applied&&<span style={{fontSize:11,color:'#4a8a60',fontWeight:600,display:'flex',alignItems:'center'}}>✓</span>}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {PRIORITIES.map(({key,label,accent})=>{
            // Hide magic slider entirely when magic doesn't exist in this world
            if (key === 'priorityMagic' && config.magicExists === false) return null;
            const val = config[key] ?? 50;
            return <div key={key} style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:12,fontWeight:600,color:INK,width:62,flexShrink:0}}>
                {label}
              </span>
              <input type="range"
                min={5} max={95}
                value={Math.max(5,val)}
                onChange={e=>updateConfig({[key]:Number(e.target.value)})}
                style={{flex:1,accentColor:accent,height:4}}/>
              <span style={{fontSize:11,fontWeight:700,color:accent,width:46,textAlign:'right',whiteSpace:'nowrap'}}>
                {val}
              </span>
            </div>;
          })}
        </div>
      </>
    }
  </div>;
}

function StressPanel({config,updateConfig}){
  const isRandom=config.selectedStressesRandom!==false;
  const selected=config.selectedStresses||[];
  const allKeys=Object.keys(STRESS_TYPE_MAP);
  const toggleRandom=()=>updateConfig(isRandom?{selectedStressesRandom:false,selectedStresses:allKeys}:{selectedStressesRandom:true,selectedStresses:[]});
  const toggleStress=key=>{if(isRandom)return;updateConfig({selectedStresses:selected.includes(key)?selected.filter(k=>k!==key):[...selected,key]});};
  return<div style={{background:'#fdf8f0',border:`1px solid ${BORDER2}`,borderRadius:7,padding:'12px 14px',marginTop:4}}>
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10,gap:10}}>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:700,color:INK,marginBottom:2}}>Settlement Stress</div>
        <p style={{fontSize:11,color:SECOND,margin:0,lineHeight:1.4}}>{isRandom?'A random stress may fire each Generate (~40% chance). All types are eligible.':`${selected.length} of ${allKeys.length} stress types selected.`}</p>
      </div>
      <div style={{display:'flex',gap:5,flexShrink:0}}>
        <button onClick={toggleRandom} style={{fontSize:11,fontWeight:700,padding:'4px 10px',border:`1px solid ${isRandom?'#8b5a1a':BORDER2}`,borderRadius:5,cursor:'pointer',background:isRandom?'#8b5a1a':CARD,color:isRandom?'#fff':SECOND,fontFamily:sans}}> {isRandom?'Random ON':'Random'}</button>
        {!isRandom&&<><button onClick={()=>updateConfig({selectedStresses:allKeys})} style={{fontSize:10,fontWeight:700,padding:'4px 8px',border:`1px solid ${BORDER2}`,borderRadius:4,background:CARD,cursor:'pointer',color:SECOND,fontFamily:sans}}>All</button><button onClick={()=>updateConfig({selectedStresses:[]})} style={{fontSize:10,fontWeight:700,padding:'4px 8px',border:`1px solid ${BORDER2}`,borderRadius:4,background:CARD,cursor:'pointer',color:SECOND,fontFamily:sans}}>None</button></>}
      </div>
    </div>
    {!isRandom&&<div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:200,overflowY:'auto'}}>
      {allKeys.map(key=>{const d=STRESS_TYPE_MAP[key];const on=selected.includes(key);return<button key={key} onClick={()=>toggleStress(key)} style={{display:'flex',alignItems:'center',gap:8,padding:'5px 8px',borderRadius:4,cursor:'pointer',textAlign:'left',border:`1px solid ${on?d.colour||GOLD:BORDER}`,background:on?`${d.colour||GOLD}15`:'transparent',fontFamily:sans}}><span style={{fontSize:14,flexShrink:0}}>{d.icon}</span><span style={{fontSize:11,fontWeight:on?700:400,color:on?d.colour||GOLD:SECOND}}>{d.label}</span>{on&&<span style={{marginLeft:'auto',fontSize:10,color:d.colour||GOLD}}>✓</span>}</button>;})}
    </div>}
  </div>;
}

function NearbyResourcesPanel({config,updateConfig}){
  const route=config.tradeRouteAccess||'road';
  const isRandom   = config.nearbyResourcesRandom !== false;
  const selected   = config.nearbyResources || [];
  const resState   = config.nearbyResourcesState || {};
  const DEPLETION_PROB = {thorp:5,hamlet:10,village:20,town:35,city:55,metropolis:70};
  const tierPct    = DEPLETION_PROB[config.settType] ?? 25;

  // Four-state cycle: off (unselected) → allow → abundant → depleted → off
  // 'off' has no label — just looks bland, like a stress that wasn't selected
  const RESOURCE_STATES = ['off','allow','abundant','depleted'];
  const STATE_LABELS  = {allow:'○ Allow',abundant:'✦ Abundant',depleted:' Depleted'};
  const STATE_COLORS  = {allow:'#9c8068',abundant:'#1a5a28',depleted:'#c05000'};
  const STATE_BG      = {allow:'transparent',abundant:'#f0faf2',depleted:'#fff7f0'};
  const STATE_BORDER  = {allow:'#c8b89a',abundant:'#88c880',depleted:'#e08040'};

  // A resource is 'off' if it's not in the selected list
  // Otherwise use the state map (defaulting to 'allow' if selected but no override)
  const getResourceState = (key) => {
    if (!activeKeys.includes(key)) return 'off';
    return resState[key] || 'allow';
  };
  const cycleResourceState = (key) => {
    if (isRandom) return;
    const cur = getResourceState(key);
    if (cur === 'off') {
      // Off → Allow: add resource to selected list
      updateConfig({ nearbyResources: [...selected, key] });
    } else if (cur === 'allow') {
      updateConfig({ nearbyResourcesState: { ...resState, [key]: 'abundant' } });
    } else if (cur === 'abundant') {
      updateConfig({ nearbyResourcesState: { ...resState, [key]: 'depleted' } });
    } else {
      // Depleted → Off: remove from selected + clear state
      const newState = { ...resState };
      delete newState[key];
      updateConfig({ nearbyResources: selected.filter(k=>k!==key), nearbyResourcesState: newState });
    }
  };
  const terrain=config.terrainOverride&&config.terrainOverride!=='auto'?config.terrainOverride:null;
  const allResources=useMemo(()=>{try{return getCompatibleResources(route,terrain);}catch{return[];}},[route,terrain]);
  const compatible=allResources.filter(r=>{
    if(!r.compatible&&!(terrain&&r.terrain===terrain))return false;
    if(config.magicExists===false&&r.key==='magical_node')return false;
    // If terrain override set, show terrain-specific resources even if route-incompatible
    if(terrain&&r.terrain&&r.terrain!==terrain)return false;
    // If terrain override set, boost terrain-matching resources to the top
    return true;
  });
  const byCategory=useMemo(()=>{const cats={};allResources.forEach(r=>{(cats[r.category]=cats[r.category]||[]).push(r);});Object.values(cats).forEach(arr=>arr.sort((a,b)=>(a.label||a.name||a.key||'').localeCompare(b.label||b.name||b.key||'')));return cats;},[allResources]);
  const toggleRandom=()=>updateConfig(
    isRandom
      ? {nearbyResourcesRandom:false, nearbyResources:compatible.map(r=>r.key), nearbyResourcesState:{}}
      : {nearbyResourcesRandom:true,  nearbyResources:null, nearbyResourcesState:{}}
  );
  const toggleResource = key => {
    if (isRandom) return;
    const isOn = selected.includes(key);
    if (isOn) {
      // Removing: clear from both the list and the state map
      const newState = { ...resState };
      delete newState[key];
      updateConfig({ nearbyResources: selected.filter(k=>k!==key), nearbyResourcesState: newState });
    } else {
      // Adding: enter Allow state by default
      updateConfig({ nearbyResources: [...selected, key] });
    }
  };
  const activeKeys=isRandom?allResources.map(r=>r.key):selected;
  return<div style={{background:PARCHMENT,border:`1px solid ${BORDER}`,borderRadius:7,padding:'12px 14px',marginTop:4}}>
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10,gap:10}}>
      <div style={{flex:1}}>
        <div style={{fontSize:12,fontWeight:700,color:INK,marginBottom:2,display:'flex',alignItems:'center',gap:8}}>Nearby Resources<span style={{fontSize:10,fontWeight:400,color:MUTED}}>constrained by {route} access</span></div>
        <p style={{fontSize:11,color:SECOND,margin:0,lineHeight:1.4}}>{isRandom?'A random compatible subset is selected each Generate.':`${selected.filter(k=>compatible.some(r=>r.key===k)).length} of ${compatible.length} compatible resources selected.`}</p>
      </div>
      <div style={{display:'flex',gap:5,flexShrink:0}}>
        <button onClick={toggleRandom} style={{fontSize:11,fontWeight:700,padding:'4px 10px',border:`1px solid ${isRandom?GOLD:BORDER2}`,borderRadius:5,cursor:'pointer',background:isRandom?GOLD:CARD,color:isRandom?'#fff':SECOND,fontFamily:sans}}> {isRandom?'Random ON':'Random'}</button>
        {!isRandom&&<>
          <button onClick={()=>updateConfig({nearbyResources:compatible.map(r=>r.key)})} style={{fontSize:10,fontWeight:700,padding:'4px 8px',border:`1px solid ${BORDER2}`,borderRadius:4,background:CARD,cursor:'pointer',color:SECOND,fontFamily:sans}}>All</button>
          <button onClick={()=>updateConfig({nearbyResources:[],nearbyResourcesState:{}})} style={{fontSize:10,fontWeight:700,padding:'4px 8px',border:`1px solid ${BORDER2}`,borderRadius:4,background:CARD,cursor:'pointer',color:SECOND,fontFamily:sans}}>None</button>
        </>}
      </div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {Object.entries(byCategory).sort(([a],[b])=>a.localeCompare(b)).map(([cat,resources])=><div key={cat}>
        <div style={{fontSize:10,fontWeight:700,color:MUTED,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>{cat}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
          {resources.map(r=>{
            // Incompatible with current route/terrain — still clickable but visually dimmed
            if(!r.compatible && !selected.includes(r.key) && !isRandom) {
              const incompatTip = (r.incompatibleReason||'Not compatible with current access') + ' — click to force include anyway';
              return(
                <button key={r.key}
                  onClick={()=>cycleResourceState(r.key)}
                  title={incompatTip}
                  style={{fontSize:11,padding:'3px 9px',borderRadius:4,border:'1px dashed #c8b8a0',
                    background:'transparent',color:MUTED,fontFamily:sans,opacity:0.45,cursor:'pointer'}}>
                  {r.name||r.key.replace(/_/g,' ')}
                </button>);
            }

            if (isRandom) {
              // RANDOM MODE: all in pool — clearly shown as included/active
              return(
                <button key={r.key} disabled
                  title={`In random pool — eligible for this generation. Actual selection happens at generation time based on route and terrain.`}
                  style={{fontSize:11,padding:'3px 9px',borderRadius:4,
                    border:`1px solid #c8a84a`,background:`rgba(160,118,42,0.08)`,color:`#8a6020`,
                    fontFamily:sans,cursor:'default',userSelect:'none',fontWeight:600}}>
                  {r.name||r.key.replace(/_/g,' ')}
                </button>);
            }

            // MANUAL MODE — single card cycles through all four states
            const st  = getResourceState(r.key);
            const isOff = st === 'off';
            const tip = isOff
              ? 'Not included. Click to add (Allow state).'
              : st==='allow'
              ? `Included — ~${tierPct}% chance of depleted at generation. Click to force Abundant.`
              : st==='abundant'
              ? 'Forced abundant — full export potential. Click to force Depleted.'
              : 'Forced depleted — local use only, import dependency at town+. Click to remove.';
            // Visual: off=bland/dim, allow=subtle gold, abundant=green, depleted=orange
            const btnStyle = isOff
              ? {border:'1px solid #d0c0a8',background:'transparent',color:MUTED,
                 fontWeight:400,opacity:0.55}
              : st==='allow'
              ? {border:`1px solid ${GOLD}80`,background:`${GOLD}12`,color:GOLD,fontWeight:600}
              : {border:`1px solid ${STATE_BORDER[st]}`,background:STATE_BG[st],
                 color:STATE_COLORS[st],fontWeight:700};
            return(
              <button key={r.key} onClick={()=>cycleResourceState(r.key)} title={tip}
                style={{fontSize:11,padding:'3px 9px',borderRadius:4,cursor:'pointer',
                  fontFamily:sans,WebkitTapHighlightColor:'transparent',userSelect:'none',
                  transition:'all 0.1s',...btnStyle}}>
                {!isOff&&st!=='allow'&&<span style={{fontSize:9,marginRight:3,opacity:0.85}}>{STATE_LABELS[st].split(' ')[0]}</span>}
                {r.name||r.key.replace(/_/g,' ')}
              </button>);
          })}
        </div>
      </div>)}
      {/* Legend */}
      <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid #e8dcc8',display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
        {isRandom
          ? <span style={{fontSize:10,color:SECOND,fontStyle:'italic'}}>
              All compatible resources are in the pool. ~{tierPct}% chance of depleted per resource at <strong>{config.settType||'this tier'}</strong>. Toggle Random OFF to control individually.
            </span>
          : <>
              <span style={{fontSize:10,color:SECOND}}>Click each resource to cycle:</span>
              <span style={{fontSize:10,color:MUTED,border:'1px solid #d0c0a8',borderRadius:3,padding:'1px 6px',opacity:0.7}}>Off</span>
              <span style={{fontSize:10,color:GOLD,background:`${GOLD}10`,border:`1px solid ${GOLD}70`,borderRadius:3,padding:'1px 6px'}}>Allow (~{tierPct}% depleted)</span>
              <span style={{fontSize:10,color:STATE_COLORS.abundant,background:STATE_BG.abundant,border:`1px solid ${STATE_BORDER.abundant}`,borderRadius:3,padding:'1px 6px'}}>✦ Abundant</span>
              <span style={{fontSize:10,color:STATE_COLORS.depleted,background:STATE_BG.depleted,border:`1px solid ${STATE_BORDER.depleted}`,borderRadius:3,padding:'1px 6px'}}> Depleted</span>
            </>
        }
      </div>
    </div>
  </div>;
}

export default function ConfigurationPanel(){
  const config = useStore(s => s.config);
  const updateConfig = useStore(s => s.updateConfig);
  const randomSliderMode = useStore(s => s.randomSliderMode);
  const setRandomSliderMode = useStore(s => s.setRandomSliderMode);
  // ── Isolation + magic constraint flags ──────────────────────────────────
  const magic       = config.priorityMagic || 0;
  const noMagic     = config.magicExists === false || magic === 0;
  const isIsolated  = config.tradeRouteAccess === 'isolated';
  const isTownPlus  = ['town','city','metropolis'].includes(config.settType);
  // Block: no magic + isolation is incompatible with town+
  const blockTownPlus  = noMagic && isIsolated;   // hide town+ options from tier dropdown
  const blockIsolated  = noMagic && isTownPlus;   // hide isolated from route dropdown

  return<div style={{background:CARD,border:`1px solid ${BORDER2}`,borderRadius:10}}>
    <div style={{padding:'0 16px 14px'}}>
      <div style={{marginBottom:12}}>
        <Lbl>Settlement Name (optional)</Lbl>
        <input type="text" maxLength={25} placeholder="Leave blank to generate automatically" value={config.customName||''} onChange={e=>updateConfig({customName:e.target.value.slice(0,25)})} style={{width:'100%',padding:'6px 10px',border:`1px solid ${BORDER2}`,borderRadius:5,fontSize:13,fontFamily:sans,boxSizing:'border-box',background:config.customName?'#fffbf5':CARD}}/>
        {config.customName&&<div style={{fontSize:11,color:MUTED,marginTop:3,textAlign:'right'}}>{25-(config.customName||'').length} characters remaining</div>}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'10px 16px',marginBottom:12}}>
        <div><Lbl>Population</Lbl>
          <Sel value={blockTownPlus && isTownPlus ? 'village' : config.settType}
            onChange={e=>{
              const v = e.target.value;
              // If blocked tier somehow selected, snap to village
              if(blockTownPlus && ['town','city','metropolis'].includes(v)) return;
              updateConfig({settType:v});
            }}>
            <option value="random"> Random</option>
            <option value="thorp">Thorp (20–80)</option>
            <option value="hamlet">Hamlet (81–400)</option>
            <option value="village">Village (401–900)</option>
            {!blockTownPlus && <option value="town">Town (901–5,000)</option>}
            {!blockTownPlus && <option value="city">City (5,001–25,000)</option>}
            {!blockTownPlus && <option value="metropolis">Metropolis (25,001+)</option>}
            {blockTownPlus && <option value="town" disabled style={{color:'#bbb'}}>Town — requires magic or road</option>}
            <option value="custom">Custom…</option>
          </Sel>
          {blockTownPlus && <div style={{fontSize:10,color:'#c05010',marginTop:4,lineHeight:1.4}}>
             Town+ requires a trade route or Magic slider above 0
          </div>}
        </div>
        <div><Lbl>Trade Route</Lbl>
          <Sel
            value={blockIsolated && isIsolated ? 'road' : config.tradeRouteAccess}
            onChange={e=>{
              const v = e.target.value;
              if(blockIsolated && v === 'isolated') return;
              updateConfig({tradeRouteAccess:v});
            }}>
            <option value="random_trade"> Random</option>
            <option value="road">Road</option>
            <option value="river">River</option>
            <option value="port">Port</option>
            <option value="crossroads">Crossroads</option>
            {!blockIsolated && <option value="isolated">Isolated</option>}
            {blockIsolated && <option value="isolated" disabled style={{color:'#bbb'}}>Isolated — not available at town+ without magic</option>}
            <option value="mountain_pass">Mountain Pass</option>
          </Sel>
          {blockIsolated && <div style={{fontSize:10,color:'#c05010',marginTop:4,lineHeight:1.4}}>
             Isolated unavailable at {config.settType} tier without magic infrastructure
          </div>}
        </div>
        {/* ── Isolation + Town+ warning ───────────────────────────────────── */}
        {['town','city','metropolis'].includes(config.settType) &&
          config.tradeRouteAccess === 'isolated' && (
          <div style={{
            background: '#f0f4ff',
            border: '1px solid #a0b0e0',
            borderLeft: '3px solid #3a5ab0',
            borderRadius: 6, padding: '8px 12px', fontSize: 11, lineHeight: 1.55,
          }}>
            <span style={{fontWeight:700,color:'#3a5ab0'}}>✦ Magical Trade Infrastructure</span><br/>
            <span style={{color:'#2a3a6a'}}>
              A Teleportation Circle and arcane maintainer will be forced into this {config.settType} — its only connection to the outside world. All trade flows through the circle. If it fails, the settlement collapses.
            </span>
          </div>
        )}

        <div><Lbl>Terrain</Lbl>
          <Sel value={config.terrainOverride||'auto'} onChange={e=>updateConfig({terrainOverride:e.target.value})}>
            <option value="auto">️ Auto (from route)</option>
            <option value="plains">Plains / Farmland</option>
            <option value="forest">Forest / Woodland</option>
            <option value="hills">Rolling Hills</option>
            <option value="riverside">River Valley</option>
            <option value="coastal">Coastal</option>
            <option value="mountain">️ Mountain</option>
            <option value="desert">️ Desert / Arid</option>
          </Sel>
        </div>
      </div>
      {config.settType==='custom'&&<div style={{marginBottom:12}}><Lbl>Custom Population</Lbl><input type="number" min={10} max={500000} value={config.population||1500} onChange={e=>updateConfig({population:Number(e.target.value)})} style={{width:'100%',padding:'6px 10px',border:`1px solid ${BORDER2}`,borderRadius:5,fontSize:13,fontFamily:sans,boxSizing:'border-box'}}/></div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'10px 16px',marginBottom:12}}>
        <div><Lbl>Culture</Lbl>
          <Sel value={config.culture||'random_culture'} onChange={e=>updateConfig({culture:e.target.value})}>
            <option value="random_culture"> Random</option>
            <option value="germanic">Germanic</option>
            <option value="latin">Latin/Roman</option>
            <option value="celtic">Celtic</option>
            <option value="norse">Norse</option>
            <option value="arabic">Arabic</option>
            <option value="slavic">Slavic</option>
            <option value="east_asian">East Asian</option>
            <option value="mesoamerican">Mesoamerican</option>
            <option value="south_asian">South Asian</option>
            <option value="steppe">Steppe</option>
            <option value="greek">Greek</option>
          </Sel>
        </div>
        <div>
          <Lbl>Regional Threat</Lbl>
          <Sel value={config.monsterThreat||'random_threat'} onChange={e=>updateConfig({monsterThreat:e.target.value})}>
            <option value="random_threat"> Random</option>
            <option value="heartland">️ Safe Heartland</option>
            <option value="frontier">️ Active Frontier</option>
            <option value="plagued">️ Embattled Region</option>
          </Sel>
        </div>
        <div>
          <Lbl>Magic in the World?</Lbl>
          <Sel value={config.magicExists===false?'no':'yes'}
            onChange={e=>{
              const noMagicNow = e.target.value==='no';
              const isTownPlusNow = ['town','city','metropolis'].includes(config.settType);
              const isIsolatedNow = config.tradeRouteAccess==='isolated';
              updateConfig({
                magicExists: !noMagicNow,
                ...(noMagicNow ? {priorityMagic:0} : {priorityMagic: Math.max(5, config.priorityMagic||50)}),
                // Isolated town+ without magic is impossible — reset to road
                ...(noMagicNow && isTownPlusNow && isIsolatedNow ? {tradeRouteAccess:'road'} : {}),
              });
            }}>
            <option value="yes">✦ Yes — magic exists</option>
            <option value="no">○ No — historical mode</option>
          </Sel>
        </div>
      </div>
      <SliderPanel config={config} updateConfig={updateConfig} randomSliderMode={randomSliderMode} setRandomSliderMode={setRandomSliderMode}/>
      <div style={{marginTop:10}}><Collapsible title=" Nearby Resources" status={config.nearbyResourcesRandom!==false?' Random':(config.nearbyResources?.length??0)+' selected'}><NearbyResourcesPanel config={config} updateConfig={updateConfig}/></Collapsible></div>
      <div style={{marginTop:6}}><Collapsible title=" Settlement Stress" status={config.selectedStressesRandom!==false?' Random':(config.selectedStresses?.length??0)+' selected'}><StressPanel config={config} updateConfig={updateConfig}/></Collapsible></div>
    </div>
  </div>;
}
