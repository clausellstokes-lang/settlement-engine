import { FS, GOLD_TINT, GOLD_DEEP } from '../theme.js';
import { truncateAtWord } from '../../lib/text.js';
import InstitutionLink from '../primitives/InstitutionLink.jsx';
import useIsMobile from '../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../design/proseScale.js';

import { institutionDisplayName } from '../../domain/display/institutionDisplayName.js';
import { resourceDisplayName } from '../../domain/display/resourceDisplayName.js';
// R2-CODE-B item 1: a row whose `institution` is a provenance word ("(smuggling)") names no house.
import { SERVICE_PROVENANCE_SENTINELS } from '../../domain/institutionRename.js';
// X-35 (the owner, 2026-11-01): the row is the SINK of the Institutions card's service door. It
// declares the index's own anchor and follows THE ONE FOCUS CONVENTION (X-20 (c)), so a click on a
// house's service lands with this row at the top of the Services tab.
import { entityAnchor, entityIdFor, serviceEntityOf } from '../../domain/dossier/entityLinks.js';
import { useEntityFocus } from '../dossier/useEntityFocus.js';

// ── ServiceItem ───────────────────────────────────────────────────────────────
/**
 * The dependency reason a service row prints under its name, or null: the row is impaired or
 * reduced and its service or institution has a recorded dependency. ONE spelling of that read,
 * shared by the row and by the Services tab's X-50 plan below, so the tab cannot plan an impact
 * line for a row that would not print one.
 * @param {unknown} svc
 * @param {{ impaired?: Set<string>, degraded?: Set<string>, depReasons?: Map<string, { resource: string, impact: string, inst: string }> }} sets
 */
export function serviceImpactReason(svc, { impaired, degraded, depReasons }) {
  const name = typeof svc === 'string' ? svc : /** @type {any} */ (svc)?.name || '';
  const inst = typeof svc === 'object' ? (/** @type {any} */ (svc)?.institution || '') : '';
  const isImp = impaired?.has(name) || impaired?.has(inst);
  const isDeg = !isImp && (degraded?.has(name) || degraded?.has(inst));
  if (!(isImp || isDeg) || !depReasons) return null;
  return depReasons.get(name) || depReasons.get(inst) || null;
}

// X-50 (BOILERPLATE ONCE): `impactShown` — an earlier row already printed this row's impact
// sentence, so the row keeps its own need and prints no impact. Defaults to the old row.
// R2-CODE-B item 1 (THE PAGE STATES FACTS AND NEVER THE MACHINERY; the cold list REVIEW-W2A-3):
// the chain-depth chip ("2-order chain") and the "· covers Timber, Trade access + grain, …" tail
// said how the model linked a row, not a fact of the place, so neither prints. What they stood
// for stays in plain words: the status pill (Impaired / Reduced / Vulnerable) and each row's own
// "Needs {resource}". The two props are still accepted from the callers and read by nothing.
export function ServiceItem({ svc, accent='#6b5340', isCriminal=false, _tradeDeps, impaired, degraded, vulnerable, depReasons, chainDepth: _chainDepth=null, settlement=null, impactShown=false, impactCovers: _impactCovers=null }) {
  // THE PHONE PROSE FLOOR — the description sentence and the impairment reason.
  // The service name, the ✦ custom mark, the status pill, the chain-depth chip
  // and the institution attribution keep their own steps: they are the row's
  // scannable furniture, and this row repeats dozens of times down the tab.
  const mobile = useIsMobile();
  // X-35: the row's own entity id and anchor, computed exactly as the index computes them.
  const entity = serviceEntityOf(svc);
  const { ref: focusRef } = useEntityFocus(entityIdFor('service', entity));
  // ⛔ TWO BINDINGS, AND THE SPLIT IS THE POINT (§934.13). `name` stays the RAW service
  // key because it is a LOOKUP below — impaired/degraded/vulnerable sets and depReasons are
  // all keyed by the engine's spelling. `displayName` is the only one that reaches the page.
  const name  = typeof svc === 'string' ? svc : svc?.name || '';
  const displayName = institutionDisplayName(name);
  const desc  = typeof svc === 'object' ? (svc.desc || '') : '';
  // The row's provider, attributed as the record has it: RS-19 is kept in the RECORD (lane
  // REVIEW-INTAKE unit 2), so a row's institution is always the house that really offers it.
  const inst  = typeof svc === 'object' ? (svc.institution || '') : '';
  // A provenance word in the provider slot ("(smuggling)", "(arcane underground)") is a stress or
  // crime tag, not a house (institutionRename.js :: SERVICE_PROVENANCE_SENTINELS): no line names it.
  const provider = SERVICE_PROVENANCE_SENTINELS.includes(inst) ? '' : inst;
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

  return (
    <div ref={focusRef} id={entityAnchor('service', entity)} data-testid="service-row" style={{
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
          <span style={{fontSize: FS['12.5'],fontWeight:600,color:isCriminal?'#c06060':'#1c1409'}}>{displayName}</span>
          {isCustom&&<span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:800,color:GOLD_DEEP,letterSpacing:'0.04em',flexShrink:0}}>✦</span>}
          {statusLabel&&<span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:800,color:statusColor,background:`${statusColor}18`,padding:'0 5px',letterSpacing:'0.04em',flexShrink:0}}>{statusLabel}</span>}
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
        {provider&&<div style={{fontSize:chromeFontSize(FS.xxs, mobile),color:isCriminal?'#7a4040':'#9c8068',margin:'1px 0 0',fontStyle:'italic'}}><InstitutionLink name={provider} settlement={settlement} /></div>}
        {(()=>{
          const r=serviceImpactReason(svc, { impaired, degraded, depReasons });
          if (!r) return null;
          // ROUND THREE (the chair's ruling; the cut's #163 #427 #497 #891, HIGH): the need and the impact sentence
          // after it are TWO things. They were two inline siblings with a margin between them and no character, so
          // the page's own text read "Needs TimberSupply route severed." wherever it is copied, exported or read
          // aloud. They are two elements now, and the need closes with a full stop and a real space before the
          // sentence that follows, so no surface prints them run together. No word changes.
          const sentence = r.impact && !impactShown ? truncateAtWord(r.impact, 70) : '';
          return <p style={{fontSize:proseFontSize(FS.xxs,mobile),color:isImp?'#8b1a1a':'#8a4010',margin:'3px 0 0',lineHeight:1.3}}>
            {/* The dependency's `resource` is a catalogue KEY on thirteen of this tab's rows
                (`oasis_water`, `camel_herds`, `glass_sand`); `depReasons` is keyed by the raw
                name above and stays that way — only the printed word goes through the seam. */}
            <span data-testid="service-need">Needs <strong>{resourceDisplayName(r.resource)}</strong>{sentence ? '.' : ''}</span>
            {sentence&&<>{' '}<span data-testid="service-need-impact" style={{fontStyle:'italic'}}>{sentence}</span></>}
          </p>;
        })()}
      </div>
    </div>
  );
}

// ── SafetyProfilePanel ────────────────────────────────────────────────────────

// ── SafetyProfilePanel ────────────────────────────────────────────────────────

// ── foodNarrative ─────────────────────────────────────────────────────────────
