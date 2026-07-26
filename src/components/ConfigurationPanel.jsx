import { useMemo } from 'react';
import {STRESS_TYPE_MAP} from '../data/stressTypes';
import { POPULATION_RANGES, TIER_ORDER } from '../data/constants.js';
import {
  CULTURE_PROFILES,
  CULTURE_PROFILE_KEYS,
} from '../domain/cultureProfiles.js';
import {getCompatibleResources} from '../generators/terrainHelpers';
import { GOLD, INK, MUTED, SECOND, BODY, BORDER, BORDER2, CARD, sans, FS, swatch } from './theme.js';
import { useStore } from '../store/index.js';
import HelpPopover from './compendium/HelpPopover.jsx';
import Button from './primitives/Button.jsx';
import Disclosure from './primitives/Disclosure.jsx';
import { ClerkNote } from './generate/ClerkNote.jsx';
import CharacterPresetCard from './generate/CharacterPresetCard.jsx';
import PlaceInRegionCard from './generate/PlaceInRegionCard.jsx';

const PARCHMENT=swatch['#F7F0E4'];
const DEFAULT_CONTENT_BOUNDARIES=Object.freeze({
  human_trafficking:false,
  slavery:false,
  torture:false,
  hard_drugs:true,
});
const CONTENT_BOUNDARY_OPTIONS=Object.freeze([
  ['human_trafficking','Human trafficking'],
  ['slavery','Slavery and forced labour'],
  ['torture','Torture'],
  ['hard_drugs','Hard-drug trade and use'],
]);
const CULTURAL_TRADITION_OPTIONS=Object.freeze(
  CULTURE_PROFILE_KEYS.map(key => Object.freeze({
    key,
    label: CULTURE_PROFILES[key].label,
  })),
);

// Population figure for a tier <option>, derived from the enforced source of
// truth POPULATION_RANGES (already in the eager data chunk — zero closure cost).
// Mirrors THE GAUGE's popFigure in HomeHero.jsx so the dropdown and the ranges
// cannot drift: the top tier renders open-ended (min+). Copy-law: no hand-typed
// population numbers here (thorp/hamlet had stale 20-80 / 81-400 bands).
const popRange = (tier) => {
  const r = POPULATION_RANGES[tier];
  if (!r) return '';
  const fmt = (n) => n.toLocaleString('en-US');
  return TIER_ORDER[TIER_ORDER.length - 1] === tier
    ? `${fmt(r.min)}+`
    : `${fmt(r.min)}–${fmt(r.max)}`;
};

// The 17 archetypes + priority sliders moved to the Character preset card
// (generate/CharacterPresetCard.jsx, data in generate/characterPresets.js).
// Applying a preset writes the SAME config values the old SliderPanel
// dropdown wrote, so generation stays byte-identical.

function Lbl({children,topic}){
  const base={fontSize:FS.xs,fontWeight:700,color:SECOND,letterSpacing:'0.05em',textTransform:'uppercase',marginBottom:4};
  // P126 / CP-1: optional inline Compendium help. HelpPopover self-gates
  // on flag('compendiumInlineHelp') and renders null when off, so the
  // label is byte-identical until the flag is flipped on.
  if(topic)return<div style={{...base,display:'flex',alignItems:'center',gap:5}}><span>{children}</span><HelpPopover topic={topic}/></div>;
  return<div style={base}>{children}</div>;
}
function Sel({value,onChange,children,ariaLabel}){return<select aria-label={ariaLabel} value={value} onChange={onChange} style={{width:'100%',padding:'5px 10px',border:`1px solid ${BORDER2}`,fontSize:FS.sm,background:CARD,fontFamily:sans,color:INK,cursor:'pointer'}}>{children}</select>;}

export function StressPanel({config,updateConfig}){
  const isRandom=config.selectedStressesRandom!==false;
  const selected=config.selectedStresses||[];
  const allKeys=Object.keys(STRESS_TYPE_MAP);
  const toggleRandom=()=>updateConfig(isRandom?{selectedStressesRandom:false,selectedStresses:allKeys}:{selectedStressesRandom:true,selectedStresses:[]});
  const toggleStress=key=>{if(isRandom)return;updateConfig({selectedStresses:selected.includes(key)?selected.filter(k=>k!==key):[...selected,key]});};
  return<div style={{background:swatch['#FDF8F0'],border:`1px solid ${BORDER2}`,padding:'12px 14px',marginTop:4}}>
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10,gap:10}}>
      <div style={{flex:1}}>
        <div style={{fontSize:FS.sm,fontWeight:700,color:INK,marginBottom:2}}>Settlement Stress</div>
        <p style={{fontSize:FS.xs,color:SECOND,margin:0,lineHeight:1.4}}>
          {isRandom
            ? 'Settlement conditions decide whether an eligible stress emerges. A generation may have none; occasionally a second accompanies the primary.'
            : `${selected.length} of ${allKeys.length} stress types selected. Each selected stress is applied to the generated settlement.`}
        </p>
      </div>
      <div style={{display:'flex',gap:5,flexShrink:0}}>
        <Button variant={isRandom?'primary':'secondary'} size="sm" aria-pressed={isRandom} onClick={toggleRandom}>{isRandom?'Random ON':'Random'}</Button>
        {!isRandom&&<><Button variant="secondary" size="sm" onClick={()=>updateConfig({selectedStresses:allKeys})}>All</Button><Button variant="secondary" size="sm" onClick={()=>updateConfig({selectedStresses:[]})}>None</Button></>}
      </div>
    </div>
    {!isRandom&&<div style={{display:'flex',flexDirection:'column',gap:4,maxHeight:200,overflowY:'auto'}}>
      {allKeys.map(key=>{const d=STRESS_TYPE_MAP[key];const on=selected.includes(key);return<Button key={key} variant={on?'gold':'secondary'} size="sm" aria-pressed={on} onClick={()=>toggleStress(key)} style={{display:'flex',alignItems:'center',justifyContent:'flex-start',gap:8,padding:'5px 8px',textAlign:'left',minHeight:'auto',whiteSpace:'normal',fontWeight:400,border:`1px solid ${on?d.colour||GOLD:BORDER}`,background:on?`${d.colour||GOLD}15`:'transparent'}}><span style={{fontSize: FS['14'],flexShrink:0}}>{d.icon}</span><span style={{fontSize:FS.xs,fontWeight:on?700:400,color:on?d.colour||GOLD:SECOND}}>{d.label}</span>{on&&<span style={{marginLeft:'auto',fontSize:FS.xxs,color:d.colour||GOLD}}>✓</span>}</Button>;})}
    </div>}
  </div>;
}

export function NearbyResourcesPanel({config,updateConfig}){
  const route=config.tradeRouteAccess||'road';
  const isRandom   = config.nearbyResourcesRandom !== false;
  const selected   = config.nearbyResources || [];
  const resState   = config.nearbyResourcesState || {};

  // Four-state cycle: off (unselected) → allow → abundant → depleted → off
  // 'off' has no label — just looks bland, like a stress that wasn't selected
  const _RESOURCE_STATES = ['off','allow','abundant','depleted'];
  const STATE_LABELS  = {allow:'○ Allow',abundant:'✦ Abundant',depleted:'◐ Depleted'};
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
  return<div style={{background:PARCHMENT,border:`1px solid ${BORDER}`,padding:'12px 14px',marginTop:4}}>
    <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10,gap:10}}>
      <div style={{flex:1}}>
        <div style={{fontSize:FS.sm,fontWeight:700,color:INK,marginBottom:2,display:'flex',alignItems:'center',gap:8}}>Nearby Resources<span style={{fontSize:FS.xxs,fontWeight:400,color:MUTED}}>constrained by {route} access</span></div>
        <p style={{fontSize:FS.xs,color:SECOND,margin:0,lineHeight:1.4}}>{isRandom?'A random compatible subset is selected each Generate.':`${selected.filter(k=>compatible.some(r=>r.key===k)).length} of ${compatible.length} compatible resources selected.`}</p>
      </div>
      <div style={{display:'flex',gap:5,flexShrink:0}}>
        <Button variant={isRandom?'primary':'secondary'} size="sm" aria-pressed={isRandom} onClick={toggleRandom}>{isRandom?'Random ON':'Random'}</Button>
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
                  style={{fontSize:FS.xs,padding:'3px 9px',minHeight:'auto',fontWeight:400,border:'1px dashed #c8b8a0',
                    background:'transparent',color:MUTED,opacity:0.45}}>
                  {r.name||r.key.replace(/_/g,' ')}
                </Button>);
            }

            if (isRandom) {
              // RANDOM MODE: all in pool — clearly shown as included/active
              return(
                <Button key={r.key} variant="gold" size="sm" disabled
                  title={`In random pool. Eligible for this generation. Actual selection happens at generation time based on route and terrain.`}
                  style={{fontSize:FS.xs,padding:'3px 9px',minHeight:'auto',opacity:1,
                    border:`1px solid #c8a84a`,background:`rgba(160,118,42,0.08)`,color:`#8a6020`,
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
              ? 'Included; availability is resolved for this settlement size. Click to guarantee Abundant.'
              : st==='abundant'
              ? 'Forced abundant. Full export potential. Click to force Depleted.'
              : 'Forced depleted. Local use only, import dependency at town+. Click to remove.';
            // Visual: off=bland/dim, allow=subtle gold, abundant=green, depleted=orange
            const btnStyle = isOff
              ? {border:'1px solid #d0c0a8',background:'transparent',color:MUTED,
                 fontWeight:400,opacity:0.55}
              : st==='allow'
              ? {border:`1px solid ${GOLD}80`,background:`${GOLD}12`,color:GOLD,fontWeight:600}
              : {border:`1px solid ${STATE_BORDER[st]}`,background:STATE_BG[st],
                 color:STATE_COLORS[st],fontWeight:700};
            return(
              <Button key={r.key} variant="secondary" size="sm" onClick={()=>cycleResourceState(r.key)} title={tip}
                style={{fontSize:FS.xs,padding:'3px 9px',minHeight:'auto',
                  WebkitTapHighlightColor:'transparent',userSelect:'none',
                  transition:'all 0.1s',...btnStyle}}>
                {!isOff&&st!=='allow'&&<span style={{fontSize:FS.micro,marginRight:3,opacity:0.85}}>{STATE_LABELS[st].split(' ')[0]}</span>}
                {r.name||r.key.replace(/_/g,' ')}
              </Button>);
          })}
        </div>
      </div>)}
      {/* Legend */}
      <div style={{marginTop:8,paddingTop:8,borderTop:'1px solid #e8dcc8',display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
        {isRandom
          ? <span style={{fontSize:FS.xxs,color:SECOND,fontStyle:'italic'}}>
              Compatible resources are selected automatically. Some may begin depleted, with that pressure rising as settlement size grows. Toggle Random OFF to control them individually.
            </span>
          : <>
              <span style={{fontSize:FS.xxs,color:SECOND}}>Click each resource to cycle:</span>
              <span style={{fontSize:FS.xxs,color:MUTED,border:'1px solid #d0c0a8',padding:'1px 6px',opacity:0.7}}>Off</span>
              <span style={{fontSize:FS.xxs,color:GOLD,background:`${GOLD}10`,border:`1px solid ${GOLD}70`,padding:'1px 6px'}}>Allow (availability resolved)</span>
              <span style={{fontSize:FS.xxs,color:STATE_COLORS.abundant,background:STATE_BG.abundant,border:`1px solid ${STATE_BORDER.abundant}`,padding:'1px 6px'}}>✦ Abundant</span>
              <span style={{fontSize:FS.xxs,color:STATE_COLORS.depleted,background:STATE_BG.depleted,border:`1px solid ${STATE_BORDER.depleted}`,padding:'1px 6px'}}>Depleted</span>
            </>
        }
      </div>
    </div>
  </div>;
}

/**
 * @param {{ showFineTune?: boolean }} [props]
 *   showFineTune — render the "Fine-tune" disclosure (nearby resources +
 *     settlement stress). Default on, so existing mounts are unchanged.
 */
export default function ConfigurationPanel({ showFineTune = true } = {}){
  const config = useStore(s => s.config);
  const updateConfig = useStore(s => s.updateConfig);
  // §14b — "Use custom content" toggle: only meaningful for users who can author
  // custom content and actually have some. Default ON (undefined === on).
  const canUseCustom = useStore(s => (typeof s.canUseCustomContent === 'function' ? s.canUseCustomContent() : false));
  const customCount = useStore(s => (typeof s.getCustomContentCount === 'function' ? s.getCustomContentCount() : 0));
  // ── Isolation + magic constraint flags ──────────────────────────────────
  const magic       = config.priorityMagic || 0;
  const noMagic     = config.magicExists === false || magic === 0;

  return<div style={{background:CARD,border:`1px solid ${BORDER2}`}}>
    <div style={{padding:'0 16px 14px'}}>
      <div style={{marginBottom:12}}>
        <Lbl>Settlement Name (optional)</Lbl>
        <input type="text" aria-label="Settlement Name (optional)" maxLength={25} placeholder="Leave blank to generate automatically" value={config.customName||''} onChange={e=>updateConfig({customName:e.target.value.slice(0,25)})} style={{width:'100%',padding:'6px 10px',border:`1px solid ${BORDER2}`,fontSize:FS.md,fontFamily:sans,boxSizing:'border-box',background:config.customName?'#fffbf5':CARD}}/>
        {config.customName&&<div style={{fontSize:FS.xs,color:MUTED,marginTop:3,textAlign:'right'}}>{25-(config.customName||'').length} characters remaining</div>}
      </div>
      {/* §14b — Use custom content toggle (homebrew data layer). Default ON. */}
      {canUseCustom && customCount > 0 && (() => {
        const on = config.useCustomContent !== false;
        return (
          <label htmlFor="useCustomContent" style={{display:'flex',alignItems:'center',gap:8,cursor:'pointer',padding:'8px 10px',marginBottom:12,border:`1px solid ${on?swatch.magic:BORDER2}`,background:on?'rgba(124,58,237,0.06)':CARD}}>
            <input id="useCustomContent" aria-label="Use my custom content" type="checkbox" checked={on} onChange={e=>updateConfig({useCustomContent:e.target.checked})} style={{accentColor:swatch.magic,width:15,height:15,flexShrink:0}}/>
            <span style={{fontSize:FS.sm,fontWeight:700,color:on?swatch.magic:SECOND,fontFamily:sans}}>✦ Use my custom content</span>
            <span style={{fontSize:FS.xxs,color:MUTED,marginLeft:'auto',textAlign:'right',lineHeight:1.3}}>{customCount} item{customCount===1?'':'s'} · institutions, services, resources, trade, factions, stressors &amp; chains</span>
          </label>
        );
      })()}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'10px 16px',marginBottom:12}}>
        <div><Lbl topic="tier">Population</Lbl>
          <Sel value={config.settType} onChange={e=>updateConfig({settType:e.target.value})}>
            <option value="random">Random</option>
            <option value="thorp">{`Thorp (${popRange('thorp')})`}</option>
            <option value="hamlet">{`Hamlet (${popRange('hamlet')})`}</option>
            <option value="village">{`Village (${popRange('village')})`}</option>
            <option value="town">{`Town (${popRange('town')})`}</option>
            <option value="city">{`City (${popRange('city')})`}</option>
            <option value="metropolis">{`Metropolis (${popRange('metropolis')})`}</option>
            <option value="custom">Custom…</option>
          </Sel>
        </div>
        <div><Lbl topic="trade-route">Trade Route</Lbl>
          <Sel
            value={config.tradeRouteAccess}
            onChange={e=>updateConfig({tradeRouteAccess:e.target.value})}>
            <option value="random_trade">Random</option>
            <option value="road">Road</option>
            <option value="river">River</option>
            <option value="port">Port</option>
            <option value="crossroads">Crossroads</option>
            <option value="isolated">Isolated</option>
            <option value="mountain_pass">Mountain Pass</option>
          </Sel>
        </div>
        {/* ── Isolation + Town+ warning — a rubric-headed clerk's note
            (Deep Craft cluster 1; the blue tinted wash retired). */}
        {['town','city','metropolis'].includes(config.settType) &&
          config.tradeRouteAccess === 'isolated' && (
          <ClerkNote rubric="Isolation support premise" style={{ fontSize: FS.xs }}>
            The generator will test local food, hinterland production, reserves, seasonal access, and patronage first.
            {noMagic
              ? ' Without magic, any remaining support gap is preserved and labeled as an intentional tension.'
              : ' Functional high magic is available only as a last-resort substitution for a remaining gap.'}
          </ClerkNote>
        )}

        <div><Lbl topic="terrain">Terrain</Lbl>
          <Sel value={config.terrainOverride||'auto'} onChange={e=>updateConfig({terrainOverride:e.target.value})}>
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
      {config.settType==='custom'&&<div style={{marginBottom:12}}><Lbl>Custom Population</Lbl><input type="number" aria-label="Custom Population" min={10} max={500000} value={config.population||1500} onChange={e=>updateConfig({population:Number(e.target.value)})} style={{width:'100%',padding:'6px 10px',border:`1px solid ${BORDER2}`,fontSize:FS.md,fontFamily:sans,boxSizing:'border-box'}}/></div>}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:'10px 16px',marginBottom:12}}>
        <div><Lbl topic="culture">Cultural tradition</Lbl>
          <Sel value={config.culture||'random_culture'} onChange={e=>updateConfig({culture:e.target.value})}>
            <option value="random_culture">Random</option>
            <option value="mixed">Mixed</option>
            {CULTURAL_TRADITION_OPTIONS.map(option=>(
              <option key={option.key} value={option.key}>{option.label}</option>
            ))}
          </Sel>
          <p style={{fontSize:FS.xxs,color:MUTED,margin:'4px 0 0',lineHeight:1.35}}>
            Sets names and a local design grammar for built form, civic life, foodways, exchange, worship, and defense, with modest institution likelihoods.
          </p>
        </div>
        <div style={{gridColumn:config.contentProfile==='custom'?'span 2':'auto'}}>
          <Lbl>Generated themes</Lbl>
          <Sel
            ariaLabel="Generated themes"
            value={config.contentProfile||'grounded'}
            onChange={e=>{
              const contentProfile=e.target.value;
              updateConfig({
                contentProfile,
                ...(contentProfile==='custom'&&!config.contentBoundaries
                  ? {contentBoundaries:{...DEFAULT_CONTENT_BOUNDARIES}}
                  : {}),
              });
            }}
          >
            <option value="heroic">Heroic</option>
            <option value="grounded">Grounded</option>
            <option value="grim">Grim</option>
            <option value="custom">Custom boundaries</option>
          </Sel>
          <p style={{fontSize:FS.xxs,color:MUTED,margin:'4px 0 0',lineHeight:1.35}}>
            Grounded is the default. Grim explicitly permits generated slavery, trafficking, and torture themes.
          </p>
          {config.contentProfile==='custom'&&(
            <fieldset
              aria-label="Allowed generated themes"
              style={{
                display:'grid',
                gridTemplateColumns:'repeat(2,minmax(0,1fr))',
                gap:'5px 12px',
                margin:'8px 0 0',
                padding:'8px 10px',
                border:`1px solid ${BORDER2}`,
              }}
            >
              <legend style={{padding:'0 4px',fontSize:FS.xxs,fontWeight:700,color:SECOND}}>
                Allow the generator to introduce
              </legend>
              {CONTENT_BOUNDARY_OPTIONS.map(([key,label])=>{
                const boundaries=config.contentBoundaries||DEFAULT_CONTENT_BOUNDARIES;
                const inputId=`content-boundary-${key}`;
                return(
                  <label key={key} htmlFor={inputId} style={{display:'flex',alignItems:'flex-start',gap:6,fontSize:FS.xs,color:BODY,lineHeight:1.3}}>
                    <input
                      id={inputId}
                      aria-label={`Allow generated ${label.toLowerCase()}`}
                      type="checkbox"
                      checked={boundaries[key]===true}
                      onChange={e=>updateConfig({
                        contentBoundaries:{...boundaries,[key]:e.target.checked},
                      })}
                      style={{marginTop:1,accentColor:GOLD}}
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
            </fieldset>
          )}
        </div>
        <div>
          <Lbl topic="settlement-age">Age</Lbl>
          <Sel value={config.settlementAgeMode||'auto'} onChange={e=>updateConfig({settlementAgeMode:e.target.value})}>
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
              style={{width:'100%',marginTop:6,padding:'6px 10px',border:`1px solid ${BORDER2}`,fontSize:FS.sm,fontFamily:sans,boxSizing:'border-box'}}
            />
          )}
        </div>
        <div>
          <Lbl topic="monster-threat">Regional Threat</Lbl>
          <Sel ariaLabel="Regional Threat" value={config.monsterThreat||'random_threat'} onChange={e=>updateConfig({monsterThreat:e.target.value})}>
            <option value="random_threat">Random</option>
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
              updateConfig({
                magicExists: !noMagicNow,
                ...(noMagicNow ? {priorityMagic:0} : {priorityMagic: Math.max(5, config.priorityMagic||50)}),
              });
            }}>
            <option value="yes">✦ Yes. Magic exists</option>
            <option value="no">○ No. Historical mode</option>
          </Sel>
          {noMagic && config.tradeRouteAccess === 'isolated'
            && ['town','city','metropolis'].includes(config.settType) && (
            <div style={{fontSize:FS.xs,color:swatch['#C05010'],marginTop:4,lineHeight:1.4}}>
              This explicit isolated premise will be preserved. If local food,
              reserves, seasonal access, and patronage are insufficient, the
              dossier will label the support gap as by design.
            </div>
          )}
        </div>
      </div>
      <CharacterPresetCard advanced={true}/>
      {/* ── Fine-tune ───────────────────────────────────────────────────────
            Nearby resources + settlement stress behind ONE "Fine-tune"
            disclosure. Priority sliders moved up to the Character card, where
            the archetype chips and sliders are reconciled into one control.
            Flattened to a single level (the resource + stress panels were
            collapsibles side by side); each shows its own compact "Random"
            default until tuned. Callers can hide the whole block with
            showFineTune=false. */}
      {showFineTune && (
        <div style={{marginTop:10}}>
          <Disclosure title="Fine-tune: resources and stress" hint="Optional">
            <NearbyResourcesPanel config={config} updateConfig={updateConfig}/>
            <div style={{marginTop:6}}><StressPanel config={config} updateConfig={updateConfig}/></div>
          </Disclosure>
        </div>
      )}
      {/* Place in Region — birth-time campaign + patron-deity intent (premium;
          free sees a teaser). Mounted pre-generation so the choice bakes into
          settlement._config and persists on save. */}
      <div style={{marginTop:10}}><PlaceInRegionCard/></div>
    </div>
  </div>;
}
