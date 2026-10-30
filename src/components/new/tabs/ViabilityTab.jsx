import { tokenCase } from '../labelLadder.js';
import { viabilityVerdict } from '../../../domain/display/viabilityVerdict.js';
import React, { useMemo } from 'react';
import { FS, swatch, MUTED } from '../../theme.js';
import { Ti, sans, Section, Empty } from '../Primitives';
import { flag } from '../../../lib/flags.js';
import { normalizePlotHook } from '../../../lib/proseSeams.js';
import { deriveViability } from '../../../domain/display/dossierViewModel.js';
import { isViabilityItem, trimViabilitySummary } from '../../../domain/display/viabilityFilter.js';


import {NarrativeNote} from '../NarrativeNote';
// THE GENERAL DESK THROUGH ITS ONE CALLER (the registry's ARM 2), which also owns the
// §885.3 paid-surface gate — corpus prose never draws for a free gallery viewer.
import { generalDeskLines } from '../generalDeskRead.js';
// THE ONE PARAGRAPH RENDERER (owner finding 2026-09-18): the verdict's three lenses are one
// paragraph rather than three, each of which opened on the town's name. The DRAW is unchanged.
import ProseBlock from '../ProseBlock.jsx';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import { edged } from '../../../design/edgedBox.js';

/** The page's one first-survey vintage label (owner-queue #28 at one site per page, X-8). */
export const FIRST_SURVEY_LABEL = 'Judged at the first survey; not re-run since.';

// The summary trim lives in viabilityFilter.js, the module web and PDF already share, so the
// paid document trims exactly what the tab trims.
export { trimViabilitySummary };

// The verdict palette, keyed on the SHARED tone token so the colour and the word can no
// longer disagree. The words live in domain/display/viabilityVerdict.js; these do not,
// because the page has its own palette for the same three tones.
const VERDICT_BG     = { good: '#f0faf4', warn: '#fdf8e8', bad: '#fdf4f4' };
const VERDICT_BORDER = { good: '#a8d8b0', warn: '#e0c860', bad: '#e8c0c0' };
const VERDICT_INK    = { good: '#1a5a28', warn: '#b8860b', bad: '#8b1a1a' };

export function ViabilityTab({settlement:s, narrativeNote, publicDossier = false, playerView = false}) {
  // THE PHONE PROSE FLOOR — the verdict summary, the what-this-checks caption,
  // the receipt's reading lines and every issue description, reason, impact and
  // suggested fix below. Bound above the early return so the hook order is
  // stable; the verdict headline, the category eyebrows and the metric pills
  // keep their own steps.
  const mobile = useIsMobile();
  // DS-GEN-11: the verdict, the contradiction count and the first-survey caveat, banded in
  // the town's own voice beside the three data the panel already prints.
  // ⭐ MEMOISED, AND ABOVE THE EARLY RETURN (rules-of-hooks; ARCH §4.1, X-F9, SEAM car 3g):
  // from car 3 this call composes eleven of the desk's blocks through `composeStateProse`
  // rather than through a single kernel read, and that cost is unmeasured on the browser
  // side. The result is a pure function of the settlement and the two view flags.
  const {verdictLines} = useMemo(
    () => generalDeskLines(s, {publicDossier, playerView}).viability,
    [s, publicDossier, playerView],
  );
  if (!s?.economicViability) return <Empty message="No coherence data available. Generate a settlement first."/>;
  const v = s.economicViability;
  const metrics = v.metrics || {};
  // DS-DEF-9 and the frozen magicDependency record moved to the Magic tab as the Roles
  // section's framing (UX consolidation 2026-10-30, RULINGS-T2 T2-15); see MagicTab.jsx.

  // Strip the verdict prefix from the summary. Behind canonicalViewModel, use
  // the reconciled verdict from the display model (§1f) — its body only, since
  // this tab supplies its own coherence badge.
  const vmViability = flag('canonicalViewModel') ? deriveViability(s) : null;
  const summaryClean = trimViabilitySummary(vmViability
    ? vmViability.summary.replace(/^[^:]+:\s*/, '').trim()
    : (v.summary||'').replace(/^[✗✓]\s*(NOT VIABLE:|VIABLE:)\s*/i, '').trim());

  // Stress-consequence issues: expected effects of active stressors (siege, famine, etc.)
  // These are NOT structural problems — they belong in a separate "Active Conditions" section
  // so they don't pollute the structural plausibility assessment.
  const stressConsequences = [...(v.issues||[]), ...(v.warnings||[])].filter(i =>
    i.type === 'stress_consequence'
  );

  // Severity colors
  const sevColor = sev => sev==='critical'?'#8b1a1a':sev==='high'?'#8a3010':sev==='dependency'||sev==='warning'?'#b8860b':'#6b5340';
  const sevBg    = sev => sev==='critical'?'#fdf4f4':sev==='high'?'#fdf0e8':sev==='dependency'||sev==='warning'?'#fdf8e8':'#f7f4f0';

  // Structural violations from root
  const structuralReceiptItems = s.structuralViolations || [];
  const structViolations = structuralReceiptItems.filter(item => item?.severity !== 'by_design');
  const structuralByDesign = structuralReceiptItems.filter(item => item?.severity === 'by_design');
  // Critical issues vs lower-severity
  const byDesignIssues = [
    ...(v.issues||[]).filter(i => i.severity==='by_design'),
    ...structuralByDesign,
  ].filter((item, index, all) => (
    all.findIndex(candidate => (
      candidate?.type === item?.type
      && candidate?.institution === item?.institution
      && candidate?.reason === item?.reason
    )) === index
  )).sort((a,b)=>(a.institution||'').localeCompare(b.institution||''));
  const criticalIssues = [...(v.issues||[]).filter(i => i.severity==='critical' && i.type !== 'stress_consequence')].sort((a,b)=>(a.title||'').localeCompare(b.title||''));
  // Strip dependency/resource chain issues — those are in Economics & Resources tabs
  // Viability only shows logic violations, structural conflicts, and by-design
  // contradictions. Route through the ONE shared adjudicator (isViabilityItem)
  // so the web tab and the PDF viabilitySlice cannot drift (pdf-6): it applies
  // the type + severity + category exclusion lists in one place.
  const filteredWarnings = (v.warnings||[]).filter(isViabilityItem);
  // Suggestions (opportunities) excluded from Viability tab — see Economics tab

  const otherIssues    = [...(v.issues||[]).filter(i =>
    i.severity!=='critical' && i.severity!=='by_design' &&
    i.type !== 'stress_consequence' &&
    isViabilityItem(i)
  )].sort((a,b)=>(a.title||'').localeCompare(b.title||''));

  // Clean plot hook text (strip the embedded " PLOT HOOK: " prefix). Extraction
  // stays local (the Ti object fallback); the strip routes through the shared
  // display chokepoint (src/lib/proseSeams.js) so no surface can drift.
  const _cleanHook = h => normalizePlotHook(typeof h==='object' ? h.hook||Ti(h) : String(h));

  // ONE VERDICT, BOTH SURFACES. This tab used to fork inline on `viable` and print its own
  // words ('NOT COHERENT' / 'COHERENT' / 'MARGINAL COHERENCE') while the paid PDF printed
  // them through its own private `verdictOf`. Two vocabularies for one derived fact. The
  // shared leaf owns the word, the tone and the glyph; the palette below stays local.
  // ⚠ THE LEAF'S FOURTH AND FIFTH WORDS ARE GONE (2026-09-19): `verdictOf` also carried
  // 'Fragile' / 'Collapsing' branches keyed on a `verdict` field NOTHING WRITES, which the
  // observed-shape ratchet convicted the moment the lift moved them into the scanned tree.
  // The leaf reads `viable` and nothing else now — see its own note for the measurement.
  const verdict = viabilityVerdict(v);

  return (
    <div style={{...sans}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── VIABILITY VERDICT ────────────────────────────────────────────── */}
      <div style={{
        background: VERDICT_BG[verdict.tone] || VERDICT_BG.warn,
        ...edged(`2px solid ${VERDICT_BORDER[verdict.tone] || VERDICT_BORDER.warn}`, `6px solid ${VERDICT_INK[verdict.tone] || VERDICT_INK.warn}`),
        padding: '14px 18px', marginBottom: 14,
      }}>
        <div style={{display:'flex',alignItems:'flex-start',gap:12,flexWrap:'wrap'}}>
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
              <span style={{fontSize: FS['22'],fontWeight:800,color:VERDICT_INK[verdict.tone] || VERDICT_INK.warn,lineHeight:1}}>
                {verdict.glyph ? `${verdict.glyph} ` : ''}{verdict.label}
              </span>
            </div>
            {summaryClean&&<p style={{fontSize:proseFontSize(FS.md, mobile),color:swatch.inkMag2,lineHeight:1.55,margin:0}}>{summaryClean}</p>}
            {/* THE PAGE'S ONE VINTAGE LABEL (owner-queue #28; RULINGS-CROSS X-8, T2-11). The
                coaching sentences that explained the tab to the DM are cut (R1); section
                headers on this page carry no "First Survey" suffix, this line covers them. */}
            <p data-testid="viability-vintage" style={{fontSize:proseFontSize(FS.xs, mobile),color:swatch.inkMag3,margin:'6px 0 0',lineHeight:1.4}}>
              {FIRST_SURVEY_LABEL}
            </p>
            {/* ── DS-GEN-11 (viability.verdict) ─────────────────────────────
                ONE lens since the UX consolidation (T2-13): the contradiction
                reading. The verdict lens restated the headline and the
                first-survey lens restated the vintage label (generalDeskRead.js
                selects the lens). The DATUM is untouched. */}
            {verdictLines.length>0&&<div style={{borderTop:'1px solid #d8c090',marginTop:10,paddingTop:8}}>
              <ProseBlock lines={verdictLines} settlementName={s?.name} tier={s?.tier}
                style={{fontSize:FS.md,color:swatch.inkMag2,lineHeight:1.6,margin:0,fontStyle:'italic'}}/>
            </div>}
          </div>
          {/* Quick metric pills */}
          <div style={{display:'flex',gap:6,flexWrap:'wrap',flexShrink:0}}>
            {metrics.criticalIssueCount>0&&<span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.danger,background:swatch['#FDE8E8'],border:'1px solid #f0a0a0',padding:'3px 9px'}}>{metrics.criticalIssueCount} critical</span>}
            
            
          </div>
        </div>

        
      </div>

      {/* The generation receipt moved to the Versions tab (Notes group) in the UX
          consolidation (T2-14): it audits the generator, not the town, and stays
          reachable there. */}

      {/* ── BY-DESIGN CONTRADICTIONS ────────────────────────────────────── */}
      {byDesignIssues.length>0&&<Section title={`By-Design Contradictions (${byDesignIssues.length})`} collapsible defaultOpen={false} accent='#8a3010'>
        {byDesignIssues.map((v2,i)=>(
          <div key={i} style={{padding:'8px 12px',background:swatch['#FDF8F0'],border:'1px solid #d8b880',borderLeft:'3px solid #c05010',marginBottom:6}}>
            <div style={{fontSize:FS.sm,fontWeight:700,color:swatch['#8A3010'],marginBottom:3}}>{v2.institution}</div>
            <div style={{fontSize: proseFontSize(FS['11.5'], mobile),color:swatch.inkMag2,lineHeight:1.6}}>{v2.reason}</div>
            {v2.suggestedFixes?.[0] && (
              <div style={{fontSize: proseFontSize(FS['10.5'], mobile),color:MUTED,marginTop:4,fontStyle:'italic'}}>{v2.suggestedFixes[0]}</div>
            )}
          </div>
        ))}
      </Section>}

      {/* ── SURVIVAL CRISES (structural violations) ──────────────────────── */}
      {structViolations.length>0&&<Section title={`Structural Crises (${structViolations.length})`} collapsible defaultOpen accent='#8b1a1a'>
        {structViolations.map((v2,i)=>(
          <div key={i} style={{background:swatch['#FDF0F0'],border:'1px solid #e0a0a0',borderLeft:'4px solid #8b1a1a',padding:'10px 14px',marginBottom:8}}>
            <div style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.danger,marginBottom:3}}>
              {v2.institution||v2.group}
            </div>
            <p style={{fontSize:proseFontSize(FS.md, mobile),color:swatch['#5A1A1A'],lineHeight:1.5,margin:0}}>{v2.reason}</p>
          </div>
        ))}
      </Section>}

      {/* ── CRITICAL ISSUES ──────────────────────────────────────────────── */}
      {criticalIssues.length>0&&<Section title={`Critical Issues (${criticalIssues.length})`} collapsible defaultOpen accent='#8b1a1a'>
        {criticalIssues.map((issue,i)=>(
          <div key={i} style={{background:swatch['#FAF8F4'],border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',padding:'12px 14px',marginBottom:10}}>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:4,flexWrap:'wrap'}}>
              {issue.category&&<span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch.danger}}>{tokenCase(issue.category)}</span>}
              {issue.title&&<span style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag}}>{issue.title}</span>}
            </div>
            <p style={{fontSize: proseFontSize(FS['12.5'], mobile),color:swatch.inkMag2,lineHeight:1.55,margin:'0 0 6px'}}>{typeof issue.description==='object'?issue.description.short||issue.description.text||'':issue.description||issue.message}</p>
            {issue.priorityNote&&<p style={{fontSize: proseFontSize(FS['11.5'], mobile),color:swatch['#8B3A1A'],fontStyle:'italic',margin:'0 0 8px',lineHeight:1.4}}>{issue.priorityNote}</p>}
            {issue.suggestedFixes?.length>0&&<div style={{borderTop:'1px solid #e8c0c0',paddingTop:8}}>
              <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch.inkMag3,marginBottom:4}}>Suggested fixes</div>
              {issue.suggestedFixes.map((fix,j)=>(
                <div key={j} style={{display:'flex',gap:6,marginBottom:3}}>
                  <span style={{color:swatch.success,flexShrink:0,fontSize:chromeFontSize(FS.xs, mobile)}}>→</span>
                  <span style={{fontSize: proseFontSize(FS['11.5'], mobile),color:swatch.inkMag2}}>{fix}</span>
                </div>
              ))}
            </div>}
          </div>
        ))}
      </Section>}

      {/* ── OTHER ISSUES ─────────────────────────────────────────────────── */}
      {otherIssues.length>0&&<Section title={`Issues (${otherIssues.length})`} collapsible defaultOpen>
        {otherIssues.map((issue,i)=>{
          const sc = sevColor(issue.severity);
          const sb = sevBg(issue.severity);
          return <div key={i} style={{background:sb,border:`1px solid ${sc}40`,borderLeft:`3px solid ${sc}`,padding:'10px 14px',marginBottom:8}}>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:3,flexWrap:'wrap'}}>
              {issue.category&&<span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:sc}}>{tokenCase(issue.category)}</span>}
              {issue.title&&<span style={{fontSize: FS['12.5'],fontWeight:700,color:swatch.inkMag}}>{issue.title}</span>}
            </div>
            <p style={{fontSize:proseFontSize(FS.sm, mobile),color:swatch.inkMag2,lineHeight:1.5,margin:0}}>{typeof issue.description==='object'?issue.description.short||issue.description.text||'':issue.description||issue.message}</p>
            {issue.suggestedFixes?.length>0&&<div style={{marginTop:6}}>
              {issue.suggestedFixes.map((fix,j)=>(
                <div key={j} style={{display:'flex',gap:6,marginBottom:2}}>
                  <span style={{color:swatch.success,flexShrink:0,fontSize:chromeFontSize(FS.xs, mobile)}}>→</span>
                  <span style={{fontSize:proseFontSize(FS.xs, mobile),color:swatch.inkMag2}}>{fix}</span>
                </div>
              ))}
            </div>}
          </div>;
        })}
      </Section>}

      {/* ── WARNINGS ─────────────────────────────────────────────────────── */}
      {stressConsequences.length>0&&<Section title={`Active Stress Effects (${stressConsequences.length})`} collapsible defaultOpen={true} accent='#6b4c2a'>
        {stressConsequences.map((item,i)=>(
          <div key={i} style={{background:swatch['#F9F3E8'],border:'1px solid #d4a96a',padding:'8px 10px',marginBottom:6}}>
            {item.title&&<span style={{fontSize: FS['12.5'],fontWeight:700,color:swatch['#6B4C2A'],display:'block',marginBottom:2}}>{item.title}</span>}
            <p style={{fontSize:proseFontSize(FS.sm, mobile),color:swatch['#5A3E28'],lineHeight:1.5,margin:0}}>{typeof item.description==='object'?item.description.short||item.description.text||'':item.description||item.message||''}</p>
          </div>
        ))}
      </Section>}

      {filteredWarnings.length>0&&<Section title={`Warnings (${filteredWarnings.length})`} collapsible defaultOpen={false}>
        {filteredWarnings.map((w,i)=>{
          const wobj = typeof w==='object' ? w : {description:w};
          const sc = sevColor(wobj.severity||'warning');
          return <div key={i} style={{background:sevBg(wobj.severity||'warning'),border:`1px solid ${sc}35`,borderLeft:`3px solid ${sc}`,padding:'10px 14px',marginBottom:8}}>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:3,flexWrap:'wrap'}}>
              {wobj.category&&<span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:sc}}>{tokenCase(wobj.category)}</span>}
              {wobj.title&&<span style={{fontSize: FS['12.5'],fontWeight:700,color:swatch.inkMag}}>{wobj.title}</span>}
            </div>
            {wobj.description&&<p style={{fontSize:proseFontSize(FS.sm, mobile),color:swatch.inkMag2,lineHeight:1.5,margin:'0 0 4px'}}>{wobj.description}</p>}
            {wobj.impact&&<p style={{fontSize: proseFontSize(FS['11.5'], mobile),color:swatch['#5A3A10'],fontStyle:'italic',margin:'0 0 6px',lineHeight:1.4}}>Impact: {wobj.impact}</p>}
            {wobj.suggestedFixes?.length>0&&<div>
              {wobj.suggestedFixes.map((fix,j)=>(
                <div key={j} style={{display:'flex',gap:6,marginBottom:2}}>
                  <span style={{color:swatch.success,flexShrink:0,fontSize:chromeFontSize(FS.xs, mobile)}}>→</span>
                  <span style={{fontSize:proseFontSize(FS.xs, mobile),color:swatch.inkMag2}}>{fix}</span>
                </div>
              ))}
            </div>}
          </div>;
        })}
      </Section>}

      {/* ── OPPORTUNITIES / SUGGESTIONS ──────────────────────────────────── */}
      
    </div>
  );
}

export default React.memo(ViabilityTab);
