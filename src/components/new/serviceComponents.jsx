import { FS, swatch, GOLD_TINT, GOLD_DEEP } from '../theme.js';
import { truncateAtWord } from '../../lib/text.js';
import InstitutionLink from '../primitives/InstitutionLink.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import { proseFontSize } from '../../design/proseScale.js';


// ── ServiceItem ───────────────────────────────────────────────────────────────
export function ServiceItem({ svc, accent='#6b5340', isCriminal=false, _tradeDeps, impaired, degraded, vulnerable, depReasons, chainDepth=null, settlement=null }) {
  // THE PHONE PROSE FLOOR — the description sentence and the impairment reason.
  // The service name, the ✦ custom mark, the status pill, the chain-depth chip
  // and the institution attribution keep their own steps: they are the row's
  // scannable furniture, and this row repeats dozens of times down the tab.
  const mobile = useIsMobile();
  const name  = typeof svc === 'string' ? svc : svc?.name || '';
  const desc  = typeof svc === 'object' ? (svc.desc || '') : '';
  const inst  = typeof svc === 'object' ? (svc.institution || '') : '';
  // §14 — services the user authored (or produced by a custom institution) carry
  // a `custom`/`source` flag; the dossier tints their row gold with a ✦ marker.
  const isCustom = typeof svc === 'object' && (svc.custom === true || svc.source === 'custom');
  const isImp = impaired?.has(name) || impaired?.has(inst);
  const isDeg = !isImp && (degraded?.has(name) || degraded?.has(inst));
  const isVul = !isImp && !isDeg && (vulnerable?.has(name) || vulnerable?.has(inst));
  const statusColor = isImp ? '#8b1a1a' : isDeg ? '#8a4010' : isVul ? '#7a5010' : null;
  // RUNG 3, THE STATUS VALUE — colour and weight carry the meaning in this pill, so the
  // case does not have to. The print twin already speaks these words (`Services.jsx`
  // renders 'Impaired'), so the screen was the half that was shouting.
  const statusLabel = isImp ? ' Impaired' : isDeg ? ' Reduced' : isVul ? ' Vulnerable' : null;
  const depthLabel  = chainDepth && chainDepth > 1
    ? (chainDepth === 2 ? '2-order chain' : chainDepth === 3 ? '3-order chain' : chainDepth + '-order chain')
    : null;

  return (
    <div style={{
      display:'flex', alignItems:'flex-start', gap:8, padding:'5px 8px',
      ...(isCustom && !isImp && !isDeg
        ? { ...GOLD_TINT, borderWidth:1, borderStyle:'solid' }
        : { background: isImp?'#fdf4f4': isDeg?'#fdf8f0': isCriminal?'#1a0808':'#faf8f4',
            borderLeft:`2px solid ${statusColor||accent}` }),
      marginBottom:3,
      opacity: isImp?0.9:1,
    }}>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
          <span style={{fontSize: FS['12.5'],fontWeight:600,color:isCriminal?'#c06060':'#1c1409'}}>{name}</span>
          {isCustom&&<span style={{fontSize:FS.micro,fontWeight:800,color:GOLD_DEEP,letterSpacing:'0.04em',flexShrink:0}}>✦</span>}
          {statusLabel&&<span style={{fontSize:FS.micro,fontWeight:800,color:statusColor,background:`${statusColor}18`,padding:'0 5px',letterSpacing:'0.04em',flexShrink:0}}>{statusLabel}</span>}
          {(isImp||isDeg||isVul)&&depthLabel&&<span style={{fontSize:FS.micro,fontWeight:600,color:swatch.inkMag3,background:swatch['#F0E8D8'],border:'1px solid #c8b89a',padding:'0 5px',flexShrink:0}}>{depthLabel}</span>}
        </div>
        {desc&&<p style={{fontSize:proseFontSize(FS.xs,mobile),color:isCriminal?'#8a5050':'#9c8068',lineHeight:1.3,margin:'1px 0 0'}}>{desc}</p>}
        {/* ⛔ THE ATTRIBUTION LINE IS A `<div>`, AND IT IS NOT A STYLE CHOICE. Its child
            `InstitutionLink` renders a FRAGMENT — the inline trigger, and beside it the
            `InstitutionCard` dialog, in place rather than portalled — so opening a service
            entry's institution put a `<section role="dialog">` with a `<header>`, an `<h2>`,
            its own `<p>`s and a `<ul>` inside this paragraph, and React's DOM-nesting
            validator printed one error per block element. `</p>` is implied by any block
            start tag in the HTML parser, so that markup is not the tree React thinks it
            built. A `<div>` carrying the SAME explicit style renders the identical box (both
            are display:block and the `<p>` margin was already overridden), and it is the
            honest element for a line whose child may open a dialog. The two paragraphs above
            keep their `<p>`: their children are inline-only.
            @enforced-by tests/components/servicesInstitutionCardNesting.test.jsx */}
        {inst&&<div style={{fontSize:FS.xxs,color:isCriminal?'#7a4040':'#9c8068',margin:'1px 0 0',fontStyle:'italic'}}><InstitutionLink name={inst} settlement={settlement} /></div>}
        {(isImp||isDeg)&&depReasons&&(depReasons.get(name)||depReasons.get(inst))&&(()=>{
          const r=depReasons.get(name)||depReasons.get(inst);
          return <p style={{fontSize:proseFontSize(FS.xxs,mobile),color:isImp?'#8b1a1a':'#8a4010',margin:'3px 0 0',lineHeight:1.3}}>
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
