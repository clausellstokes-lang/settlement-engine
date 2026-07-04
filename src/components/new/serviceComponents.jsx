import { FS, swatch, GOLD_TINT, GOLD_DEEP, BLUE, BLUE_BG } from '../theme.js';
import { truncateAtWord } from '../../lib/text.js';
import { displayInstitutionName } from '../../domain/display/institutionDisplay.js';
import EntityLink from '../primitives/EntityLink.jsx';
import { entityIdFor } from '../../domain/dossier/entityLinks.js';


// ── ServiceItem ───────────────────────────────────────────────────────────────
export function ServiceItem({ svc, accent='#6b5340', isCriminal=false, _tradeDeps, impaired, degraded, vulnerable, magicalInfra, compromised, depReasons, chainDepth=null }) {
  const name  = typeof svc === 'string' ? svc : svc?.name || '';
  const desc  = typeof svc === 'object' ? (svc.desc || '') : '';
  const inst  = typeof svc === 'object' ? (svc.institution || '') : '';
  // Compromised marker — an institution captured by corruption (covert in-chain
  // mark, or revealed by a public scandal). Two-channel: text label + colour.
  const compromiseState = compromised?.get?.(name.toLowerCase()) || compromised?.get?.(inst.toLowerCase()) || null;
  // §14 — services the user authored (or produced by a custom institution) carry
  // a `custom`/`source` flag; the dossier tints their row gold with a ✦ marker.
  const isCustom = typeof svc === 'object' && (svc.custom === true || svc.source === 'custom');
  // A supply gap met by a teleport/airship channel is SUPPLIED, not impaired — it
  // takes precedence over the red status tags and reads as a positive blue tag.
  const isMagical = magicalInfra?.has(name) || magicalInfra?.has(inst);
  const isImp = !isMagical && (impaired?.has(name) || impaired?.has(inst));
  const isDeg = !isMagical && !isImp && (degraded?.has(name) || degraded?.has(inst));
  const isVul = !isMagical && !isImp && !isDeg && (vulnerable?.has(name) || vulnerable?.has(inst));
  const statusColor = isImp ? '#8b1a1a' : isDeg ? '#8a4010' : isVul ? '#7a5010' : null;
  const statusLabel = isImp ? ' IMPAIRED' : isDeg ? ' REDUCED' : isVul ? ' VULNERABLE' : null;
  const depthLabel  = chainDepth && chainDepth > 1
    ? (chainDepth === 2 ? '2-order chain' : chainDepth === 3 ? '3-order chain' : chainDepth + '-order chain')
    : null;

  return (
    <div style={{
      display:'flex', alignItems:'flex-start', gap:8, padding:'5px 8px',
      ...(isCustom && !isImp && !isDeg && !isMagical
        ? { ...GOLD_TINT, borderWidth:1, borderStyle:'solid' }
        : { background: isMagical?BLUE_BG: isImp?'#fdf4f4': isDeg?'#fdf8f0': isCriminal?'#1a0808':'#faf8f4',
            borderLeft:`2px solid ${isMagical?BLUE:statusColor||accent}` }),
      borderRadius:4, marginBottom:3,
      opacity: isImp?0.9:1,
    }}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
          <span style={{fontSize: FS['12.5'],fontWeight:600,color:isCriminal?'#c06060':'#1c1409'}}>{name}</span>
          {isCustom&&<span style={{fontSize:FS.micro,fontWeight:800,color:GOLD_DEEP,letterSpacing:'0.04em',flexShrink:0}}>✦</span>}
          {statusLabel&&<span style={{fontSize:FS.micro,fontWeight:800,color:statusColor,background:`${statusColor}18`,borderRadius:3,padding:'0 5px',letterSpacing:'0.04em',flexShrink:0}}>{statusLabel}</span>}
          {isMagical&&<span title="Supply covered by magical trade infrastructure (teleportation / airship) — not impaired" style={{fontSize:FS.micro,fontWeight:800,color:BLUE,background:BLUE_BG,borderRadius:3,padding:'0 5px',letterSpacing:'0.04em',flexShrink:0}}>MAGICAL INFRASTRUCTURE</span>}
          {compromiseState&&<span title={compromiseState==='revealed'?'Corruption made public — this institution is compromised':'A corrupt insider quietly compromises this institution'} style={{fontSize:FS.micro,fontWeight:800,color:swatch['#6A2A9A'],background:'rgba(106,42,154,0.12)',border:'1px solid rgba(106,42,154,0.45)',borderRadius:3,padding:'0 5px',letterSpacing:'0.04em',flexShrink:0}}>{compromiseState==='revealed'?'COMPROMISED':'COMPROMISED (covert)'}</span>}
          {(isImp||isDeg||isVul)&&depthLabel&&<span style={{fontSize:FS.micro,fontWeight:600,color:swatch.inkMag3,background:swatch['#F0E8D8'],border:'1px solid #c8b89a',borderRadius:3,padding:'0 5px',flexShrink:0}}> {depthLabel}</span>}
        </div>
        {desc&&<p style={{fontSize:FS.xs,color:isCriminal?'#8a5050':'#9c8068',lineHeight:1.3,margin:'1px 0 0'}}>{desc}</p>}
        {inst&&<p style={{fontSize:FS.xxs,color:isCriminal?'#7a4040':'#9c8068',margin:'1px 0 0',fontStyle:'italic'}}>
          {/* Provider institution -> in-dossier cross-link. Resolved by the
              SAME id the dossier index assigns each institution (entityIdFor),
              so it follows a rename; degrades to the displayInstitutionName
              plain text when the institution is absent from the index or the
              Power tab is gated out. */}
          <EntityLink id={entityIdFor('institution', { name: inst })} type="institution" fallback={displayInstitutionName(inst)} />
        </p>}
        {(isImp||isDeg||isMagical)&&depReasons&&(depReasons.get(name)||depReasons.get(inst))&&(()=>{
          const r=depReasons.get(name)||depReasons.get(inst);
          return <p style={{fontSize:FS.xxs,color:isImp?'#8b1a1a':isMagical?BLUE:'#8a4010',margin:'3px 0 0',lineHeight:1.3}}>
             Needs <strong>{r.resource}</strong>
            {r.impact&&<span style={{fontStyle:'italic',marginLeft:4}}>{truncateAtWord(r.impact, 70)}</span>}
          </p>;
        })()}
      </div>
    </div>
  );
}

// ── SafetyProfilePanel ────────────────────────────────────────────────────────

// ── SafetyProfilePanel ────────────────────────────────────────────────────────

// ── foodNarrative ─────────────────────────────────────────────────────────────
