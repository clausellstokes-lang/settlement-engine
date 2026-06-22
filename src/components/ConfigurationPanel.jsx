import { useMemo } from 'react';
import {STRESS_TYPE_MAP} from '../data/stressTypes';
import {getCompatibleResources} from '../generators/terrainHelpers';
import { GOLD, INK, MUTED, BODY, SECOND, BORDER, BORDER2, CARD, sans, FS, swatch } from './theme.js';
import { useStore } from '../store/index.js';
import HelpPopover from './compendium/HelpPopover.jsx';
import Button from './primitives/Button.jsx';
import Disclosure from './primitives/Disclosure.jsx';

const PARCHMENT=swatch['#F7F0E4'];

// Priority-slider accents routed through the swatch escape hatch (no forked
// color consts). The accent is DECORATION on the track + value number; the
// magnitude itself is carried by the number text, so colour is never the sole
// channel (P7).
const PRIORITIES=[
  {key:'priorityEconomy',label:'Economy',accent:swatch['#A0762A']},
  {key:'priorityMilitary',label:'Military',accent:swatch['#8B1A1A']},
  {key:'priorityMagic',label:'Magic',accent:swatch['#5A2A8A']},
  {key:'priorityReligion',label:'Religion',accent:swatch['#1A5A28']},
  {key:'priorityCriminal',label:'Criminal',accent:swatch['#4A1A4A']},
];

function Lbl({children,topic}){
  const base={fontSize:FS.xs,fontWeight:700,color:SECOND,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:4};
  // Optional inline Compendium help. HelpPopover self-gates
  // on flag('compendiumInlineHelp') and renders null when off, so the
  // label is byte-identical until the flag is flipped on.
  if(topic)return<div style={{...base,display:'flex',alignItems:'center',gap:5}}><span>{children}</span><HelpPopover topic={topic}/></div>;
  return<div style={base}>{children}</div>;
}
function Sel({value,onChange,children,ariaLabel}){return<select aria-label={ariaLabel} value={value} onChange={onChange} style={{width:'100%',padding:'5px 10px',border:`1px solid ${BORDER2}`,borderRadius:5,fontSize:FS.sm,background:CARD,fontFamily:sans,color:INK,cursor:'pointer'}}>{children}</select>;}

function SliderPanel({config,updateConfig,randomSliderMode,setRandomSliderMode}){
  // Archetype selection lives in exactly ONE place now — the promoted Character
  // card above. The legacy "Archetype preset" dropdown that used to sit here was
  // a second door to the same 17 presets; removed so the sliders are pure manual
  // tuning. Picking a Character still snaps these sliders (same priority config).
  return<div style={{background:PARCHMENT,border:`1px solid ${BORDER}`,borderRadius:7,padding:'12px 14px',marginTop:4}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:randomSliderMode?0:10}}>
      <Lbl>Priority Sliders</Lbl>
      <Button variant={randomSliderMode?'gold':'secondary'} size="sm" aria-pressed={randomSliderMode} onClick={()=>setRandomSliderMode(!randomSliderMode)}>{randomSliderMode?'Random':'Set manually'}</Button>
    </div>
    {randomSliderMode
      ? <p style={{fontSize:FS.xs,color:BODY,margin:'6px 0 0',lineHeight:1.4}}>Each generation randomises all priority sliders. Toggle off to set values manually, or pick a Character above to shape them.</p>
      : <>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {PRIORITIES.map(({key,label,accent})=>{
            // Hide magic slider entirely when magic doesn't exist in this world
            if (key === 'priorityMagic' && config.magicExists === false) return null;
            const val = config[key] ?? 50;
            return <div key={key} style={{display:'flex',alignItems:'center',gap:8}}>
              <span style={{fontSize:FS.sm,fontWeight:600,color:INK,width:62,flexShrink:0}}>
                {label}
              </span>
              <input type="range"
                aria-label={label}
                min={5} max={95}
                value={Math.max(5,val)}
                onChange={e=>updateConfig({[key]:Number(e.target.value)})}
                style={{flex:1,accentColor:accent,height:4}}/>
              <span style={{fontSize:FS.xs,fontWeight:700,color:accent,width:46,textAlign:'right',whiteSpace:'nowrap'}}>
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
  return<div style={{background:swatch['#FDF8F0'],border:`1px solid ${BORDER2}`,borderRadius:7,padding:'12px 14px',marginTop:4}}>
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10,gap:10}}>
      <div style={{flex:1}}>
        <div style={{fontSize:FS.sm,fontWeight:700,color:INK,marginBottom:2}}>Settlement Stress</div>
        <p style={{fontSize:FS.xs,color:SECOND,margin:0,lineHeight:1.4}}>{isRandom?'A random stress may fire each Generate (~40% chance). All types are eligible.':`${selected.length} of ${allKeys.length} stress types selected.`}</p>
      </div>
      <div style={{display:'flex',gap:5,flexShrink:0}}>
        <Button variant={isRandom?'gold':'secondary'} size="sm" aria-pressed={isRandom} onClick={toggleRandom}>{isRandom?'Random ON':'Random'}</Button>
        {!isRandom&&<><Button variant="secondary" size="sm" onClick={()=>updateConfig({selectedStresses:allKeys})}>All</Button><Button variant="secondary" size="sm" onClick={()=>updateConfig({selectedStresses:[]})}>None</Button></>}
      </div>
    </div>
    {!isRandom&&<div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:200,overflowY:'auto'}}>
      {allKeys.map(key=>{const d=STRESS_TYPE_MAP[key];const on=selected.includes(key);return<Button key={key} variant={on?'gold':'secondary'} size="sm" aria-pressed={on} onClick={()=>toggleStress(key)} style={{display:'flex',alignItems:'center',justifyContent:'flex-start',gap:8,padding:'5px 8px',borderRadius:4,textAlign:'left',minHeight:'auto',whiteSpace:'normal',fontWeight:400,border:`1px solid ${on?d.colour||GOLD:BORDER}`,background:on?`${d.colour||GOLD}15`:'transparent'}}><span style={{fontSize: FS['14'],flexShrink:0}}>{d.icon}</span><span style={{fontSize:FS.xs,fontWeight:on?700:400,color:on?d.colour||GOLD:SECOND}}>{d.label}</span>{on&&<span style={{marginLeft:'auto',fontSize:FS.xxs,color:d.colour||GOLD}}>✓</span>}</Button>;})}
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
  // 'off' has no label — just looks bland, like a stress that wasn't selected.
  // Every active state carries a GLYPH so it reads in >=2 channels (glyph +
  // colour + label), not colour alone — depleted previously had only a leading
  // space, leaving CVD users unable to tell it from abundant (P7). '▼' = drawn
  // down / depleted; matches the '✦ abundant' / '○ allow' glyph pattern.
  const _RESOURCE_STATES = ['off','allow','abundant','depleted'];
  const STATE_LABELS  = {allow:'○ Allow',abundant:'✦ Abundant',depleted:'▼ Depleted'};
  const STATE_COLORS  = {allow:swatch['#9C8068'],abundant:swatch['#1A5A28'],depleted:swatch['#C05000']};
  const STATE_BG      = {allow:'transparent',abundant:swatch.successBg,depleted:swatch['#FFF7F0']};
  const STATE_BORDER  = {allow:swatch['#C8B89A'],abundant:swatch['#88C880'],depleted:swatch['#E08040']};

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
  const _toggleResource = key => {
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
        <div style={{fontSize:FS.sm,fontWeight:700,color:INK,marginBottom:2,display:'flex',alignItems:'center',gap:8}}>Nearby Resources<span style={{fontSize:FS.xs,fontWeight:400,color:BODY}}>constrained by {route} access</span></div>
        <p style={{fontSize:FS.xs,color:SECOND,margin:0,lineHeight:1.4}}>{isRandom?'A random compatible subset is selected each Generate.':`${selected.filter(k=>compatible.some(r=>r.key===k)).length} of ${compatible.length} compatible resources selected.`}</p>
      </div>
      <div style={{display:'flex',gap:5,flexShrink:0}}>
        <Button variant={isRandom?'gold':'secondary'} size="sm" aria-pressed={isRandom} onClick={toggleRandom}>{isRandom?'Random ON':'Random'}</Button>
        {!isRandom&&<>
          <Button variant="secondary" size="sm" onClick={()=>updateConfig({nearbyResources:compatible.map(r=>r.key)})}>All</Button>
          <Button variant="secondary" size="sm" onClick={()=>updateConfig({nearbyResources:[],nearbyResourcesState:{}})}>None</Button>
        </>}
      </div>
    </div>
    <div style={{display:'flex',flexDirection:'column',gap:10}}>
      {Object.entries(byCategory).sort(([a],[b])=>a.localeCompare(b)).map(([cat,resources])=><div key={cat}>
        <div style={{fontSize:FS.xxs,fontWeight:700,color:MUTED,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:5}}>{cat}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
          {resources.map(r=>{
            // Incompatible with current route/terrain — still clickable but visually dimmed
            if(!r.compatible && !selected.includes(r.key) && !isRandom) {
              const incompatTip = (r.incompatibleReason||'Not compatible with current access') + '. Click to force include anyway';
              return(
                <Button key={r.key} variant="ghost" size="sm"
                  onClick={()=>cycleResourceState(r.key)}
                  title={incompatTip}
                  style={{fontSize:FS.xs,padding:'3px 9px',borderRadius:4,minHeight:'auto',fontWeight:400,border:`1px dashed ${swatch['#C8B8A0']}`,
                    background:'transparent',color:BODY}}>
                  {r.name||r.key.replace(/_/g,' ')}
                </Button>);
            }

            if (isRandom) {
              // RANDOM MODE: all in pool — clearly shown as included/active
              return(
                <Button key={r.key} variant="gold" size="sm" disabled
                  title={`In random pool. Eligible for this generation. Actual selection happens at generation time based on route and terrain.`}
                  style={{fontSize:FS.xs,padding:'3px 9px',borderRadius:4,minHeight:'auto',opacity:1,
                    border:`1px solid ${swatch['#C8A84A']}`,background:`rgba(160,118,42,0.08)`,color:swatch['#8A6020'],
                    cursor:'default',userSelect:'none',fontWeight:600}}>
                  {r.name||r.key.replace(/_/g,' ')}
                </Button>);
            }

            // MANUAL MODE — single card cycles through all four states
            const st  = getResourceState(r.key);
            const isOff = st === 'off';
            const tip = isOff
              ? 'Not included. Click to add (Allow state).'
              : st==='allow'
              ? `Included, ~${tierPct}% chance of depleted at generation. Click to force Abundant.`
              : st==='abundant'
              ? 'Forced abundant. Full export potential. Click to force Depleted.'
              : 'Forced depleted. Local use only, import dependency at town+. Click to remove.';
            // Visual: off=bland/dim, allow=subtle gold, abundant=green, depleted=orange
            const btnStyle = isOff
              ? {border:`1px dashed ${swatch['#D0C0A8']}`,background:'transparent',color:BODY,
                 fontWeight:400}
              : st==='allow'
              ? {border:`1px solid ${GOLD}80`,background:`${GOLD}12`,color:GOLD,fontWeight:600}
              : {border:`1px solid ${STATE_BORDER[st]}`,background:STATE_BG[st],
                 color:STATE_COLORS[st],fontWeight:700};
            return(
              <Button key={r.key} variant="secondary" size="sm" onClick={()=>cycleResourceState(r.key)} title={tip}
                style={{fontSize:FS.xs,padding:'3px 9px',borderRadius:4,minHeight:'auto',
                  WebkitTapHighlightColor:'transparent',userSelect:'none',
                  transition:'all 0.1s',...btnStyle}}>
                {!isOff&&st!=='allow'&&<span style={{fontSize:FS.xs,marginRight:3,opacity:0.85}}>{STATE_LABELS[st].split(' ')[0]}</span>}
                {r.name||r.key.replace(/_/g,' ')}
              </Button>);
          })}
        </div>
      </div>)}
      {/* Legend — teaches the four-state model + the route constraint, so it
          carries causal content (P2): lifted off the sub-10px floor to FS.xs and
          the depleted swatch given its ▼ glyph so the legend matches the chips'
          glyph+colour+label pattern, not colour alone (P7). */}
      <div style={{marginTop:8,paddingTop:8,borderTop:`1px solid ${swatch['#E8DCC8']}`,display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
        {isRandom
          ? <span style={{fontSize:FS.xs,color:SECOND,fontStyle:'italic'}}>
              All compatible resources are in the pool. ~{tierPct}% chance of depleted per resource at <strong>{config.settType||'this tier'}</strong>. Toggle Random OFF to control individually.
            </span>
          : <>
              <span style={{fontSize:FS.xs,color:SECOND}}>Click each resource to cycle:</span>
              <span style={{fontSize:FS.xs,color:MUTED,border:`1px solid ${swatch['#D0C0A8']}`,borderRadius:3,padding:'1px 6px',opacity:0.7}}>Off</span>
              <span style={{fontSize:FS.xs,color:GOLD,background:`${GOLD}10`,border:`1px solid ${GOLD}70`,borderRadius:3,padding:'1px 6px'}}>○ Allow (~{tierPct}% depleted)</span>
              <span style={{fontSize:FS.xs,color:STATE_COLORS.abundant,background:STATE_BG.abundant,border:`1px solid ${STATE_BORDER.abundant}`,borderRadius:3,padding:'1px 6px'}}>✦ Abundant</span>
              <span style={{fontSize:FS.xs,color:STATE_COLORS.depleted,background:STATE_BG.depleted,border:`1px solid ${STATE_BORDER.depleted}`,borderRadius:3,padding:'1px 6px'}}>▼ Depleted</span>
            </>
        }
      </div>
    </div>
  </div>;
}

/**
 * @param {{ showFineTune?: boolean }} [props]
 *   showFineTune — render the "Fine-tune" block (priority sliders, nearby
 *   resources, settlement stress). Basic mode passes false so the panel stops at
 *   the Foundations; Advanced (default) shows it. Untouched values generate from
 *   working random defaults either way.
 */
export default function ConfigurationPanel({ showFineTune = true } = {}){
  const config = useStore(s => s.config);
  const updateConfig = useStore(s => s.updateConfig);
  const randomSliderMode = useStore(s => s.randomSliderMode);
  const setRandomSliderMode = useStore(s => s.setRandomSliderMode);
  // §14b — "Use custom content" toggle: only meaningful for users who can author
  // custom content and actually have some. Default ON (undefined === on).
  const canUseCustom = useStore(s => (typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false));
  const customCount = useStore(s => (typeof s.getCustomContentCount === 'function' ? s.getCustomContentCount() : 0));
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
      {/* §14b — Use custom content toggle (homebrew data layer). Default ON. */}
      {canUseCustom && customCount > 0 && (() => {
        const on = config.useCustomContent !== false;
        return (
          <label htmlFor="useCustomContent" style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',padding:'8px 10px',marginBottom:12,border:`1px solid ${on?swatch.magic:BORDER2}`,borderRadius:6,background:on?'rgba(124,58,237,0.06)':CARD}}>
            <input id="useCustomContent" aria-label="Use my custom content" type="checkbox" checked={on} onChange={e=>updateConfig({useCustomContent:e.target.checked})} style={{accentColor:swatch.magic,width:15,height:15,flexShrink:0}}/>
            <span style={{fontSize:FS.sm,fontWeight:700,color:on?swatch.magic:SECOND,fontFamily:sans}}>✦ Use my custom content</span>
            <span style={{fontSize:FS.xxs,color:MUTED,marginLeft:'auto',textAlign:'right',lineHeight:1.3}}>{customCount} item{customCount===1?'':'s'} · institutions, services, resources, trade, factions, stressors &amp; chains</span>
          </label>
        );
      })()}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',gap:'10px 16px',marginBottom:12}}>
        <div><Lbl topic="tier">Population</Lbl>
          <Sel ariaLabel="Population" value={blockTownPlus && isTownPlus ? 'village' : config.settType}
            onChange={e=>{
              const v = e.target.value;
              // If blocked tier somehow selected, snap to village
              if(blockTownPlus && ['town','city','metropolis'].includes(v)) return;
              updateConfig({settType:v});
            }}>
            <option value="random"> Random</option>
            <option value="thorp">Thorp (20-80)</option>
            <option value="hamlet">Hamlet (81-400)</option>
            <option value="village">Village (401-900)</option>
            {!blockTownPlus && <option value="town">Town (901-5,000)</option>}
            {!blockTownPlus && <option value="city">City (5,001-25,000)</option>}
            {!blockTownPlus && <option value="metropolis">Metropolis (25,001+)</option>}
            {blockTownPlus && <option value="town" disabled style={{color:swatch['#BBBBBB']}}>Town. Requires magic or road</option>}
            <option value="custom">Custom…</option>
          </Sel>
          {blockTownPlus && <div style={{fontSize:FS.xxs,color:swatch['#C05010'],marginTop:4,lineHeight:1.4}}>
            Town+ requires a trade route or Magic slider above 0
          </div>}
        </div>
        <div><Lbl topic="trade-route">Trade Route</Lbl>
          <Sel
            ariaLabel="Trade Route"
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
            {blockIsolated && <option value="isolated" disabled style={{color:swatch['#BBBBBB']}}>Isolated. Not available at town+ without magic</option>}
            <option value="mountain_pass">Mountain Pass</option>
          </Sel>
          {blockIsolated && <div style={{fontSize:FS.xxs,color:swatch['#C05010'],marginTop:4,lineHeight:1.4}}>
             Isolated unavailable at {config.settType} tier without magic infrastructure
          </div>}
        </div>
        {/* ── Isolation + Town+ warning ───────────────────────────────────── */}
        {['town','city','metropolis'].includes(config.settType) &&
          config.tradeRouteAccess === 'isolated' && (
          <div style={{
            background: swatch.infoBg,
            border: `1px solid ${swatch['#A0B0E0']}`,
            borderLeft: `3px solid ${swatch['#3A5AB0']}`,
            borderRadius: 6, padding: '8px 12px', fontSize: FS.xs, lineHeight: 1.55,
          }}>
            <span style={{fontWeight:700,color:swatch['#3A5AB0']}}>✦ Magical Trade Infrastructure</span><br/>
            <span style={{color:swatch['#2A3A6A']}}>
              A Teleportation Circle and arcane maintainer will be forced into this {config.settType}. Its only connection to the outside world. All trade flows through the circle. If it fails, the settlement collapses.
            </span>
          </div>
        )}

        <div><Lbl topic="terrain">Terrain</Lbl>
          <Sel ariaLabel="Terrain" value={config.terrainOverride||'auto'} onChange={e=>updateConfig({terrainOverride:e.target.value})}>
            <option value="auto">Auto (from route)</option>
            <option value="plains">Plains / Farmland</option>
            <option value="forest">Forest / Woodland</option>
            <option value="hills">Rolling Hills</option>
            <option value="riverside">River Valley</option>
            <option value="coastal">Coastal</option>
            <option value="mountain">Mountain</option>
            <option value="desert">Desert / Arid</option>
          </Sel>
        </div>
      </div>
      {config.settType==='custom'&&<div style={{marginBottom:12}}><Lbl>Custom Population</Lbl><input type="number" aria-label="Custom Population" min={10} max={500000} value={config.population||1500} onChange={e=>updateConfig({population:Number(e.target.value)})} style={{width:'100%',padding:'6px 10px',border:`1px solid ${BORDER2}`,borderRadius:5,fontSize:FS.md,fontFamily:sans,boxSizing:'border-box'}}/></div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',gap:'10px 16px',marginBottom:12}}>
        <div><Lbl topic="culture">Culture</Lbl>
          <Sel ariaLabel="Culture" value={config.culture||'random_culture'} onChange={e=>updateConfig({culture:e.target.value})}>
            <option value="random_culture"> Random</option>
            <option value="mixed">Mixed</option>
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
          <Lbl topic="settlement-age">Age</Lbl>
          <Sel ariaLabel="Settlement age" value={config.settlementAgeMode||'auto'} onChange={e=>updateConfig({settlementAgeMode:e.target.value})}>
            <option value="auto">Auto</option>
            <option value="new">Newly founded</option>
            <option value="custom">Custom years</option>
          </Sel>
          {config.settlementAgeMode==='custom'&&(
            <input
              type="number"
              aria-label="Custom years"
              min={0}
              max={5000}
              value={config.settlementAgeYears||0}
              onChange={e=>updateConfig({settlementAgeYears:Number(e.target.value)})}
              style={{width:'100%',marginTop:6,padding:'6px 10px',border:`1px solid ${BORDER2}`,borderRadius:5,fontSize:FS.sm,fontFamily:sans,boxSizing:'border-box'}}
            />
          )}
        </div>
        <div>
          <Lbl topic="monster-threat">Regional Threat</Lbl>
          <Sel ariaLabel="Regional Threat" value={config.monsterThreat||'random_threat'} onChange={e=>updateConfig({monsterThreat:e.target.value})}>
            <option value="random_threat"> Random</option>
            <option value="heartland">Safe Heartland</option>
            <option value="frontier">Active Frontier</option>
            <option value="plagued">Embattled Region</option>
          </Sel>
          <p style={{fontSize:FS.xs,color:BODY,margin:'6px 0 0',lineHeight:1.4}}>Heartland is quiet. Frontier sees raids and patrols. Embattled means active war or monster pressure.</p>
        </div>
        <div>
          <Lbl topic="magic-level">Magic in the World?</Lbl>
          <Sel ariaLabel="Magic in the World" value={config.magicExists===false?'no':'yes'}
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
            <option value="yes">✦ Yes. Magic exists</option>
            <option value="no">○ No. Historical mode</option>
          </Sel>
          {/* Make the cross-field consequence VISIBLE (P2): turning magic off at
              town+ forces a physical trade route — an isolated town+ is reset to
              Road (the magic toggle's onChange does this silently otherwise). */}
          {noMagic && isTownPlus && (
            <div style={{fontSize:FS.xs,color:swatch['#C05010'],marginTop:4,lineHeight:1.4}}>
              Without magic, a town or larger needs a physical trade route, so Isolated is set to Road.
            </div>
          )}
        </div>
      </div>
      {/* Settlement Name — optional, so it sits BELOW the essentials (Population
          leads, as the most table-relevant first control). Blank = auto-named. */}
      <div style={{marginBottom:12}}>
        <Lbl>Settlement Name (optional)</Lbl>
        <input type="text" aria-label="Settlement Name (optional)" maxLength={25} placeholder="Leave blank to generate automatically" value={config.customName||''} onChange={e=>updateConfig({customName:e.target.value.slice(0,25)})} style={{width:'100%',padding:'6px 10px',border:`1px solid ${BORDER2}`,borderRadius:5,fontSize:FS.md,fontFamily:sans,boxSizing:'border-box',background:config.customName?swatch['#FFFBF5']:CARD}}/>
        {config.customName&&<div style={{fontSize:FS.xs,color:MUTED,marginTop:3,textAlign:'right'}}>{25-(config.customName||'').length} characters remaining</div>}
      </div>
      {/* ── Fine-tune ───────────────────────────────────────────────────────
            Priority sliders + nearby resources + settlement stress behind ONE
            "Fine-tune" disclosure. Flattened to a single level (the resource +
            stress panels were collapsibles-inside-this-collapsible, 3 deep);
            each shows its own compact "Random" default until tuned. Basic mode
            hides this whole block (showFineTune=false) — the simulator randomises
            priorities/resources/stress — while Advanced shows it. */}
      {showFineTune && (
        <Disclosure title="Fine-tune: priorities, resources, stress" hint="Optional">
          <SliderPanel config={config} updateConfig={updateConfig} randomSliderMode={randomSliderMode} setRandomSliderMode={setRandomSliderMode}/>
          <div style={{marginTop:10}}><NearbyResourcesPanel config={config} updateConfig={updateConfig}/></div>
          <div style={{marginTop:6}}><StressPanel config={config} updateConfig={updateConfig}/></div>
        </Disclosure>
      )}
    </div>
  </div>;
}
