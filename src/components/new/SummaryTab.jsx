import React, { useState } from 'react';
import { TIER_LABELS, catColor } from './design';
import { Ti, serif, sans } from './Primitives';

const gold='#a0762a', ink='#1c1409', muted='#9c8068', second='#6b5340';
const factionColors=['#a0762a','#8b1a1a','#1a4a2a','#2a3a7a','#5a2a8a'];

// ── Settlement character sentence ─────────────────────────────────────────────
function characterSentence(r) {
  const insts=(r.institutions||[]).map(i=>(i.name||'').toLowerCase());
  const hasArmed=insts.some(n=>['garrison','militia','watch','guard','mercenary'].some(k=>n.includes(k)));
  const hasCrim=insts.some(n=>['thieve','criminal','underworld','black market'].some(k=>n.includes(k)));
  const {tier,config:h={},economicState:g={},powerStructure:w={},history:p={}}=r;
  const tradeKey=h.tradeRouteAccess||'road';
  const threat=h.monsterThreat||'frontier';
  const sl=g.safetyProfile?.safetyLabel||'';
  const prosperity=g.prosperity||'Moderate';
  const stability=w.stability||'Stable';
  const ruling=w.factions?.[0]?.faction||((['thorp','hamlet'].includes(tier)?'the household heads':['village'].includes(tier)?'the village elders':'the local council'));
  const age=p.age;
  const recentConflict=w.recentConflict||'';
  const tradeDesc={port:'coastal port',river:'river settlement',crossroads:'crossroads market',road:'road-side settlement',isolated:'isolated settlement'}[tradeKey]||'settlement';
  const tierDesc={thorp:'tiny hamlet',hamlet:'small hamlet',village:'village',town:'market town',city:'city',metropolis:'metropolis'}[tier]||tier;
  const threatNote=threat==='plagued'?' The surrounding region is plagued by monster activity.':threat==='frontier'?' It sits on an active frontier.':'';
  const safetyNote=sl.includes('Dangerous')?' The streets are not safe.':sl.includes('Authoritarian')?(hasArmed?' The garrison controls the streets with an iron hand.':' The strongest armed group enforces community order.'):sl.includes('Criminal Governance')?(hasCrim?' Criminal organizations effectively run the settlement.':''):'' ;
  const ageNote=age?` Founded approximately ${age} years ago.`:'';
  return `${prosperity.toLowerCase()} ${tierDesc} — a ${tradeDesc}.${ageNote}${threatNote} Power rests with ${ruling.toLowerCase()}; stability: ${stability.toLowerCase().replace(/[()]/g,'')}.${safetyNote}${recentConflict?' '+recentConflict.charAt(0).toUpperCase()+recentConflict.slice(1)+'.':''}`;
}

// ── Stacked faction power bar ─────────────────────────────────────────────────
function FactionBar({ factions }) {
  const total = factions.reduce((s,f)=>s+(f.power||0),0)||100;
  if (!factions.length) return null;
  const modStyle={
    occupied:{c:'#8b1a1a',bg:'#fdf0f0',br:'#d4a0a0',label:'occupied'},
    contested:{c:'#7a3a1a',bg:'#fdf4ec',br:'#d4b090',label:'contested'},
    vacant:{c:'#1a3a8b',bg:'#f0f0fd',br:'#a0a0d4',label:'vacant'},
  };
  return (
    <div>
      <div style={{display:'flex',height:20,borderRadius:4,overflow:'hidden',gap:1,marginBottom:10}}>
        {factions.map((f,i)=>{
          const pct=Math.round((f.power||0)/total*100);
          const c=factionColors[i%factionColors.length];
          return <div key={i} style={{flex:pct,background:c,display:'flex',alignItems:'center',justifyContent:'center',minWidth:pct>5?undefined:0,overflow:'hidden'}}>
            {pct>11&&<span style={{fontSize:9,fontWeight:800,color:'#fff',padding:'0 3px'}}>{pct}%</span>}
          </div>;
        })}
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:5}}>
        {factions.map((f,i)=>{
          const c=factionColors[i%factionColors.length];
          const mods=(f.modifiers||[]).concat(f.modifier?[f.modifier]:[]);
          return <div key={i} style={{display:'flex',alignItems:'center',gap:7}}>
            <div style={{width:10,height:10,borderRadius:2,background:c,flexShrink:0}}/>
            <span style={{fontSize:12,fontWeight:600,color:ink,flex:1,minWidth:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{f.faction}</span>
            {mods.slice(0,2).map((mod,j)=>{
              const ms=modStyle[mod]||{c:'#6b5340',bg:'#f5f0e8',br:'#c8b89a',label:mod};
              return <span key={j} style={{fontSize:9,fontWeight:600,color:ms.c,background:ms.bg,border:`1px solid ${ms.br}`,borderRadius:3,padding:'0 4px',letterSpacing:'0.03em',textTransform:'uppercase',flexShrink:0}}>{ms.label}</span>;
            })}
            <span style={{fontSize:11,fontWeight:700,color:c,flexShrink:0}}>{f.power}%</span>
          </div>;
        })}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
function SummaryTab({ settlement:r }) {
  const [copied,setCopied]=useState(false);
  const [settingOpen,setSettingOpen]=useState(false);
  const [hooksOpen,setHooksOpen]=useState(true);
  const [instOpen,setInstOpen]=useState(false);
  if (!r) return null;

  const {name,tier,population:pop,institutions:g=[],npcs:w=[],factions:factionGroups=[],conflicts:allConflicts=[],economicState:eco={},spatialLayout:spatial,powerStructure:ps={},history:hist={},economicViability:via,settlementReason:reason,config:cfg={},stress:stressRaw,prominentRelationship:pr,coherenceNotes:cn=[]}=r;
  const isMobile=window.innerWidth<640;
  const stresses=(Array.isArray(stressRaw)?stressRaw:stressRaw?[stressRaw]:[]).filter(Boolean);
  const allFactions=ps?.factions||[];
  const tradeAccess=(cfg.tradeRouteAccess||'road').replace(/_/g,' ');
  const tierLabel=TIER_LABELS[tier]||tier;
  const firstQuarter=spatial?.quarters?.[0];
  const foodBal=via?.metrics?.foodBalance;
  const topIssue=via?.issues?.[0];
  const topNPCs=[...(w||[])].sort((a,b)=>(b.power||0)-(a.power||0)).slice(0,6);
  const dp=r.defenseProfile||{};

  // All plot hooks aggregated
  const hooks=[];
  (w||[]).forEach(n=>(n.plotHooks||[]).forEach(h=>hooks.push({text:typeof h==='string'?h:h.hook||String(h),source:n.name,icon:''})));
  (allConflicts||[]).forEach(c=>(c.plotHooks||[]).forEach(h=>hooks.push({text:typeof h==='string'?h:h.hook||String(h),source:c.parties?.join(' vs ')||'Conflict',icon:'️'})));
  ((eco.safetyProfile?.plotHooks)||[]).forEach(h=>hooks.push({text:typeof h==='string'?h:String(h),source:'Crime & Safety',icon:''}));
  ((via?.plotHooks)||[]).forEach(v=>hooks.push({text:typeof v==='object'?v.hook||Ti(v):String(v),source:'Economy',icon:''}));
  const topHooks=hooks.slice(0,6);

  // Institution categories
  const instByCat=g.reduce((acc,inst)=>{
    const cat=inst.category||'other';
    (acc[cat]=acc[cat]||[]).push(inst);
    return acc;
  },{});
  const catOrder=['Essential','Economy','Crafts','Government','Defense','Religious','Magic','Adventuring','Criminal','Entertainment','Infrastructure'];

  const copyText=()=>{
    const lines=[
      `# ${name}`,
      `*${tierLabel} · Pop. ${pop?.toLocaleString()} · ${tradeAccess} · ${hist?.age||'?'} years old*`,
      stresses.length?'\n**Active Crisis:** '+stresses.map(v=>`${v.label} — ${v.crisisHook}`).join(' | '):'',
      r.arrivalScene?`\n> ${r.arrivalScene}`:'',
      `\n**${characterSentence(r)}**`,
      `\n**Power:** ${allFactions.slice(0,3).map(f=>`${f.faction} (${f.power}%)`).join(', ')}. ${ps?.stability||''}`,
      `**Economy:** ${eco.prosperity||'?'} — ${eco.economicComplexity||''}. Exports: ${eco.primaryExports?.join(', ')||'none'}.${foodBal?.deficit>0?` Food deficit ${foodBal.deficitPercent}%.`:''}`,
      `**Defense:** ${dp.readiness?.label||'Unknown'}`,
      `\n**Key NPCs:**`,...topNPCs.map(v=>`- ${v.name} (${v.title}): ${[v.personality?.dominant,v.personality?.flaw].filter(Boolean).join(', ')}. Goal: ${v.goal?.short||'?'}`),
      `\n**Plot Hooks:**`,...topHooks.map(v=>`- [${v.source}] ${v.text}`),
    ].filter(Boolean).join('\n');
    navigator.clipboard?.writeText(lines);
    setCopied(true); setTimeout(()=>setCopied(false),2000);
  };

  // Situation tile helper
  const SitTile=({icon,label,value,color,sub})=>(
    <div style={{flex:1,minWidth:0,background:'#faf8f4',border:`1px solid ${color}30`,borderTop:`3px solid ${color}`,borderRadius:6,padding:'8px 10px'}}>
      <div style={{fontSize:10,fontWeight:700,color,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>{icon} {label}</div>
      <div style={{fontSize:12,fontWeight:700,color:ink,lineHeight:1.3,marginBottom:sub?2:0}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:muted,lineHeight:1.3}}>{sub}</div>}
    </div>
  );

  // Economy situation tile values
  const ecoTileColor=eco.prosperity==='Thriving'||eco.prosperity==='Prosperous'?'#1a5a28':eco.prosperity==='Struggling'||eco.prosperity==='Poor'||eco.prosperity==='Impoverished'?'#8b1a1a':'#a0762a';
  const ecoSub=foodBal?.deficit>0?`Food deficit ${foodBal.deficitPercent}%`:foodBal?.surplus>0?'Food surplus':'';

  // Defense tile
  const defScore=dp.scores?Math.round((dp.scores.military+dp.scores.monster+dp.scores.internal+dp.scores.economic+dp.scores.magical)/5):null;
  const defColor=defScore>=70?'#1a5a28':defScore>=45?'#a0762a':defScore>=25?'#8a4010':'#8b1a1a';

  // Power stability color
  const powStab=ps?.stability||'';
  const powColor=powStab.toLowerCase().includes('stable')&&!powStab.toLowerCase().includes('unstable')?'#1a5a28':powStab.toLowerCase().includes('critical')||powStab.toLowerCase().includes('desperate')?'#8b1a1a':'#a0762a';

  return (
    <div>

      {/* ── IDENTITY HEADER ──────────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(135deg,#1c1409 0%,#2d1f0e 70%,#1c1409 100%)',borderRadius:8,padding:isMobile?'14px':'16px 20px',marginBottom:16}}>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:10,marginBottom:8}}>
          <div style={{minWidth:0,flex:1}}>
            <div style={{...serif,fontSize:isMobile?22:28,fontWeight:600,color:'#c49a3c',lineHeight:1.1,marginBottom:4}}>{name}</div>
            <div style={{fontSize:11,color:'#6b5340',letterSpacing:'0.02em'}}>{tierLabel} · {pop?.toLocaleString()} pop. · {tradeAccess} · est. {hist?.age?`~${hist.age} yrs ago`:'unknown'}</div>
          </div>
          <button onClick={copyText} style={{flexShrink:0,padding:'7px 14px',borderRadius:6,background:'rgba(196,154,60,0.18)',border:'1px solid rgba(196,154,60,0.35)',color:'#c49a3c',fontSize:12,fontWeight:700,cursor:'pointer',...sans,display:'flex',alignItems:'center',gap:6}}>
            {copied?'✓':''} {copied?'Copied!':'Copy'}
          </button>
        </div>
        <p style={{fontSize:13.5,...serif,color:'#e8d8b0',lineHeight:1.65,margin:0,fontStyle:'italic'}}>
          {name} is a {characterSentence(r)}
        </p>
      </div>

      {/* ── ACTIVE CRISIS (if any) ───────────────────────────────────────── */}
      {stresses.length>0&&<div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:14}}>
        {stresses.map((v,i)=>(
          <div key={i} style={{border:`2px solid ${v.colour}`,borderRadius:8,padding:'14px 16px',background:`${v.colour}10`}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:8}}>
              <span style={{fontSize:22,lineHeight:1}}>{v.icon}</span>
              <span style={{...serif,fontSize:18,fontWeight:700,color:v.colour}}>{v.label}</span>
              <span style={{fontSize:9,fontWeight:800,color:'#fff',background:v.colour,borderRadius:4,padding:'2px 7px',letterSpacing:'0.07em'}}>ACTIVE CRISIS</span>
            </div>
            <p style={{fontSize:13,color:ink,lineHeight:1.55,marginBottom:8}}>{v.summary}</p>
            <div style={{borderTop:`1px solid ${v.colour}35`,paddingTop:8}}>
              <span style={{fontSize:11,fontWeight:700,color:v.colour,textTransform:'uppercase',letterSpacing:'0.05em',marginRight:6}}>Hook:</span>
              <span style={{fontSize:12,color:'#3a2a10',fontStyle:'italic',lineHeight:1.45}}>{v.crisisHook}</span>
            </div>
          </div>
        ))}
      </div>}

      {/* ── ARRIVAL SCENE ────────────────────────────────────────────────── */}
      {r.arrivalScene&&<div style={{background:'#1c1409',borderRadius:8,padding:'14px 18px',marginBottom:14,border:'1px solid #3a2a10'}}>
        <div style={{fontSize:10,fontWeight:700,color:gold,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:8}}>Arrival</div>
        <p style={{...serif,fontSize:14,color:'#f0e8d8',lineHeight:1.8,margin:0,fontStyle:'italic'}}>{r.arrivalScene}</p>
      </div>}

      {/* Pressure sentence if no arrivalScene */}
      {r.pressureSentence&&!r.arrivalScene&&<div style={{background:stresses.length?'#faf6ef':'#1c1409',border:stresses.length?'1px solid #e0d0b0':'1px solid #3a2a10',borderLeft:stresses.length?'3px solid #a0762a':undefined,borderRadius:7,padding:'10px 14px',marginBottom:14}}>
        <div style={{fontSize:10,fontWeight:700,color:gold,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>Current Situation</div>
        <p style={{fontSize:13,color:stresses.length?'#3a2a10':'#f0e8d8',lineHeight:1.55,margin:0,fontStyle:'italic'}}>{r.pressureSentence}</p>
      </div>}

      {/* ── SITUATION ROW (3 scannable tiles) ───────────────────────────── */}
      <div style={{display:'flex',gap:8,marginBottom:14,flexWrap:'wrap'}}>
        <SitTile icon="" label="Power" value={powStab.split(';')[0].split('—')[0].trim()} color={powColor} sub={allFactions[0]?.faction}/>
        <SitTile icon="" label="Economy" value={eco.prosperity||'—'} color={ecoTileColor} sub={ecoSub||eco.economicComplexity?.split('—')[0].trim()}/>
        <SitTile icon="" label="Defense" value={dp.readiness?.label||'—'} color={defColor} sub={defScore?`Avg. score ${defScore}/100`:undefined}/>
      </div>

      {/* ── POWER + CONFLICTS ────────────────────────────────────────────── */}
      <div style={{background:'#f4f6fd',border:'1px solid #b8c8e8',borderLeft:'3px solid #2a3a7a',borderRadius:8,padding:'12px 14px',marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:800,color:'#2a3a7a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10}}>Power & Conflict</div>
        <FactionBar factions={allFactions.slice(0,5)}/>
        {ps?.recentConflict&&<p style={{fontSize:11,color:'#8b1a1a',marginTop:8,lineHeight:1.4}}> {ps.recentConflict}</p>}
        {allConflicts.length>0&&<>
          <div style={{height:1,background:'#c0cce8',margin:'10px 0'}}/>
          <div style={{fontSize:10,fontWeight:700,color:'#2a3a7a',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:6}}>Active Conflicts</div>
          <div style={{display:'flex',flexDirection:'column',gap:5}}>
            {allConflicts.map((c,i)=>{
              const iHigh=c.intensity==='high';
              return <div key={i} style={{display:'flex',alignItems:'flex-start',gap:8,padding:'6px 8px',background:'rgba(250,248,244,0.97)',borderRadius:5,borderLeft:`3px solid ${iHigh?'#8b1a1a':'#a0762a'}`}}>
                <span style={{fontSize:11,flexShrink:0,marginTop:1}}></span>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{fontSize:12,fontWeight:700,color:ink}}>{c.parties?.[0]}</span>
                  <span style={{fontSize:11,color:muted}}> vs </span>
                  <span style={{fontSize:12,fontWeight:700,color:ink}}>{c.parties?.[1]}</span>
                  <span style={{fontSize:10,fontWeight:700,color:iHigh?'#8b1a1a':'#a0762a',background:iHigh?'#fdf0f0':'#faf4e8',borderRadius:3,padding:'0 4px',marginLeft:6}}>{iHigh?'HIGH':'MOD'}</span>
                  {c.issue&&<p style={{fontSize:11,color:second,margin:'2px 0 0',lineHeight:1.3}}>{c.issue}</p>}
                </div>
              </div>;
            })}
          </div>
        </>}
      </div>

      {/* ── PROMINENT RELATIONSHIP ────────────────────────────────────────── */}
      {pr?.phrasing&&<div style={{background:'#f7f0e4',border:'1px solid #d8c090',borderLeft:'3px solid #6b5340',borderRadius:7,padding:'9px 13px',marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:700,color:second,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:4}}>Notable Connection</div>
        <p style={{fontSize:12.5,...serif,color:'#3a2a10',lineHeight:1.6,margin:0,fontStyle:'italic'}}>{pr.phrasing}</p>
        <p style={{fontSize:10,color:muted,margin:'5px 0 0'}}>→ See Relationships tab for the full web.</p>
      </div>}

      {/* ── KEY FIGURES (roster grid) ─────────────────────────────────────── */}
      <div style={{background:'#faf8f4',border:'1px solid #e0d0b0',borderLeft:'3px solid #3d2b1a',borderRadius:8,padding:'12px 14px',marginBottom:12}}>
        <div style={{fontSize:10,fontWeight:800,color:'#3d2b1a',textTransform:'uppercase',letterSpacing:'0.07em',marginBottom:10}}>Key Figures</div>
        {topNPCs.length>0
          ?<div style={{display:'grid',gridTemplateColumns:isMobile?'1fr':'1fr 1fr',gap:'8px 16px'}}>
            {topNPCs.map((v,i)=>{
              const traits=(Array.isArray(v.personality)?[v.personality[0],v.personality[1]]:[v.personality?.dominant,v.personality?.flaw]).filter(Boolean);
              const catCol=catColor(v.category)||gold;
              return <div key={i} style={{display:'flex',gap:8,alignItems:'flex-start',padding:'6px 0',borderBottom:i<topNPCs.length-2||isMobile?'1px solid #f0ead8':'none'}}>
                <div style={{width:3,borderRadius:2,background:catCol,alignSelf:'stretch',flexShrink:0,minHeight:32}}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'baseline',gap:5,marginBottom:2,flexWrap:'wrap'}}>
                    <span style={{fontSize:13,fontWeight:700,color:ink}}>{v.name}</span>
                    <span style={{fontSize:10,color:muted}}>{v.title}</span>
                    {v.influence==='high'&&<span style={{fontSize:9,color:gold,fontWeight:700}}>●●●</span>}
                  </div>
                  {traits.length>0&&<div style={{display:'flex',gap:3,flexWrap:'wrap',marginBottom:3}}>
                    {traits.map((t,j)=><span key={j} style={{fontSize:10,color:second,background:'#ede3cc',borderRadius:3,padding:'0 4px'}}>{t}</span>)}
                  </div>}
                  {(v.goal?.short||v.goals?.[0])&&<p style={{fontSize:11,color:'#3d2b1a',margin:0,lineHeight:1.3}}>
                    <span style={{color:gold,fontWeight:700}}>→ </span>{v.goal?.short||v.goals?.[0]}
                  </p>}
                </div>
              </div>;
            })}
          </div>
          :<p style={{fontSize:12,color:muted,fontStyle:'italic',margin:0}}>No NPCs generated.</p>
        }
      </div>

      {/* ── PLOT HOOKS (collapsible) ───────────────────────────────────────── */}
      {topHooks.length>0&&<div style={{border:'1px solid #c8b0e0',borderLeft:'3px solid #5a2a8a',borderRadius:8,overflow:'hidden',marginBottom:12}}>
        <button onClick={()=>setHooksOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 13px',background:hooksOpen?'#f4f0fd':'#f8f4fd',border:'none',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
          <span style={{fontSize:11,fontWeight:700,color:'#5a2a8a',textTransform:'uppercase',letterSpacing:'0.06em'}}>Plot Hooks ({topHooks.length})</span>
          <span style={{fontSize:11,color:muted}}>{hooksOpen?'▲':'▼'}</span>
        </button>
        {hooksOpen&&<div style={{padding:'10px 14px',borderTop:'1px solid #c8b0e0'}}>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {topHooks.map((v,i)=>(
              <div key={i} style={{display:'flex',gap:10,alignItems:'flex-start'}}>
                <span style={{fontSize:12,flexShrink:0,marginTop:1}}>{v.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <span style={{fontSize:10,fontWeight:700,color:'#5a2a8a',textTransform:'uppercase',letterSpacing:'0.04em',marginRight:6}}>{v.source}</span>
                  <span style={{fontSize:13,color:ink,lineHeight:1.5}}>{v.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>}
      </div>}

      {/* ── SETTING accordion ─────────────────────────────────────────────── */}
      {(firstQuarter||spatial?.layout||hist?.historicalCharacter||Array.isArray(reason))&&<div style={{border:'1px solid #c8d8b0',borderRadius:8,overflow:'hidden',marginBottom:10}}>
        <button onClick={()=>setSettingOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 13px',background:settingOpen?'#edf5e8':'#f4faf0',border:'none',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
          <span style={{fontSize:11,fontWeight:700,color:'#1a4a2a',textTransform:'uppercase',letterSpacing:'0.06em'}}>Setting & Context</span>
          <span style={{fontSize:11,color:muted}}>{settingOpen?'▲':'▼'}</span>
        </button>
        {settingOpen&&<div style={{padding:'12px 14px',borderTop:'1px solid #c8d8b0'}}>
          {/* Layout + historical character */}
          {(spatial?.layout||hist?.historicalCharacter)&&<div style={{display:'flex',gap:16,flexWrap:'wrap',marginBottom:8}}>
            {spatial?.layout&&<p style={{fontSize:11,fontWeight:600,color:'#3d2b1a',margin:0,flex:'1 1 140px'}}>{spatial.layout}</p>}
            {hist?.historicalCharacter&&<p style={{fontSize:11,color:second,fontStyle:'italic',margin:0,flex:'1 1 120px'}}>{hist.historicalCharacter}</p>}
          </div>}
          {/* All quarters listed compactly */}
          {spatial?.quarters?.length>0&&<div style={{display:'flex',flexDirection:'column',gap:5,marginBottom:10}}>
            {spatial.quarters.map((q,i)=><div key={i} style={{display:'flex',gap:8,alignItems:'baseline'}}>
              <span style={{fontSize:11,fontWeight:700,color:'#1a4a2a',flexShrink:0,minWidth:130}}>{q.name}</span>
              <span style={{fontSize:11,color:'#6b5340'}}>{q.location}</span>
              {q.landmarks?.length>0&&<span style={{fontSize:10,color:'#9c8068'}}>{q.landmarks.slice(0,2).join(', ')}</span>}
            </div>)}
          </div>}
          {spatial?.tradeAccess&&<p style={{fontSize:11,color:second,margin:'0 0 6px',fontStyle:'italic'}}>Access: {spatial.tradeAccess}</p>}
          {Array.isArray(reason)&&reason.length>0&&<div>
            <div style={{fontSize:10,fontWeight:700,color:second,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Why This Settlement Exists</div>
            {reason.map((line,i)=><p key={i} style={{fontSize:12,color:'#3d2b1a',lineHeight:1.5,paddingLeft:10,borderLeft:'2px solid #e0d0b0',margin:'0 0 4px'}}>{line}</p>)}
          </div>}
          {r.pressureSentence&&stresses.length>0&&<div style={{marginTop:10,background:'#f7f0e4',borderLeft:'3px solid #a0762a',borderRadius:4,padding:'7px 10px'}}>
            <p style={{fontSize:12,color:'#3a2a10',fontStyle:'italic',margin:0}}>{r.pressureSentence}</p>
          </div>}
        </div>}
      </div>}

      {/* ── INSTITUTIONS (categorized) ────────────────────────────────────── */}
      <div style={{border:'1px solid #e0d0b0',borderRadius:8,overflow:'hidden'}}>
        <button onClick={()=>setInstOpen(v=>!v)} style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 13px',background:instOpen?'#f0e8d8':'#f7f0e4',border:'none',cursor:'pointer',WebkitTapHighlightColor:'transparent'}}>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <span style={{fontSize:11,fontWeight:700,color:second,textTransform:'uppercase',letterSpacing:'0.06em'}}>Institutions</span>
            <span style={{fontSize:11,color:muted}}>{g.length} total</span>
          </div>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            {catOrder.filter(c=>instByCat[c]?.length).map(c=>(
              <span key={c} style={{fontSize:10,fontWeight:600,color:catColor(c),background:`${catColor(c)}15`,borderRadius:3,padding:'1px 6px'}}>{instByCat[c].length}</span>
            ))}
            <span style={{fontSize:11,color:muted,marginLeft:4}}>{instOpen?'▲':'▼'}</span>
          </div>
        </button>
        {instOpen&&<div style={{padding:'10px 14px',borderTop:'1px solid #e0d0b0'}}>
          {catOrder.filter(cat=>instByCat[cat]?.length).map(cat=>(
            <div key={cat} style={{marginBottom:10}}>
              <div style={{fontSize:10,fontWeight:700,color:catColor(cat),textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:5}}>{cat} ({instByCat[cat].length})</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                {instByCat[cat].sort((a,b)=>a.name.localeCompare(b.name)).map((inst,i)=>{
                  const srcColor=inst.source==='required'?gold:inst.source==='forced'?'#1a5a28':inst.source==='auto-resolved'?'#2a3a7a':'#6b5340';
                  return <span key={i} style={{fontSize:11,padding:'2px 8px',borderRadius:4,background:`${srcColor}10`,border:`1px solid ${srcColor}30`,color:ink,fontWeight:500}}>{inst.name}</span>;
                })}
              </div>
            </div>
          ))}
        </div>}
      </div>

    </div>
  );
}

export default React.memo(SummaryTab);
