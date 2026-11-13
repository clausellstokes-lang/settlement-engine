import React from 'react';
import { FS, swatch, MUTED, GOLD_TINT, GOLD_DEEP } from '../../theme.js';
import { sans, Section, Empty } from '../Primitives';

import {NarrativeNote} from '../NarrativeNote';
import { economyDeskRead } from '../economyDeskRead.js';
import { DeskLines } from './EconomicsGlance.jsx'; // the shared position renderer (see its docblock)
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
// THE TWO LABEL SEAMS (§934.13 / §934.22). `rawResource` is a catalogue key on a desert
// town ('desert_salt', 'glass_sand', 'mountain_timber') and the processing names are
// institution keys; both are PRINTS here, and nothing on this tab matches on them.
import { resourceDisplayName } from '../../../domain/display/resourceDisplayName.js';
import { institutionDisplayName } from '../../../domain/display/institutionDisplayName.js';
// READER-R1 ruling 3: the gap rows the DM reads are the record-read lines, in the house voice.
import { resourceGapLines, housesStillNeeded, exploitationGroupsShown } from '../../../domain/display/validationOnPage.js';
import { FLUSH } from '../../../design/flush.js';

/**
 * WHAT A RESOURCE DRAWS ON (`exploitation.*[].dependsOn`). Its only reader was Economics'
 * Resource Exploitation section, cut in the UX consolidation (T2-7) because this page is the
 * one home; the fact comes here with it (writer reach). Plain words, one line.
 * @param {{ deps?: unknown, mobile: boolean }} props
 */
function DrawsOn({ deps, mobile }) {
  const list = Array.isArray(deps) ? deps.filter((d) => typeof d === 'string' && d) : [];
  if (!list.length) return null;
  return <div style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.inkMag3,marginTop:4}}>Draws on: {list.join(', ')}</div>;
}

// Value badge
const valColor = v => v==='high'?'#1a5a28':v==='medium'?'#a0762a':'#6b5340';
const valBg    = v => v==='high'?'#e8f5ec':v==='medium'?'#faf4e8':'#f0ead8';

/**
 * One worked-resource chain card, extracted verbatim from the Resource Exploitation section
 * (BUILD-W2-SEARCH U2, no behaviour change): `stage` is 'unexploited', 'partial' or 'full',
 * the section's three variants, so the dossier search mounts a chain through its own card.
 */
export function ResourceChainCard({ chain, stage, settlement = null, moved = false }) {
  const mobile = useIsMobile();
  // #452 (W2-C-LEAVES-3, ruled with R1): "Needs:" names only the houses the live roster does not hold by kind or trade.
  const needs = stage === 'unexploited' ? housesStillNeeded(settlement, chain?.processingInstitutions) : [];
  if (stage === 'unexploited') return (
    <div style={{background:swatch['#FDF8E8'],border:'1px solid #e0c060',borderLeft:'3px solid #b8860b',padding:'10px 14px'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:6,flexWrap:'wrap'}}>
        <span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:800,color:swatch['#7A5010'],background:swatch['#F5E8C0'],padding:'1px 6px',letterSpacing:'0.05em',textTransform:'uppercase'}}>Unexploited</span>
        <span style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag}}>{resourceDisplayName(chain.rawResource)}</span>
        <span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:600,color:valColor(chain.exportValue),background:valBg(chain.exportValue),padding:'0 5px'}}>{chain.exportValue} value</span>
      </div>
      {/* Chain flow */}
      <div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap',marginBottom:6}}>
        <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.inkMag2,background:swatch['#F0EAD8'],padding:'1px 6px',fontWeight:600}}>{resourceDisplayName(chain.rawResource)}</span>
        {/* P1-a: a card the analysis filed worked that the record shows idle (exploitationCardShown :: moved) prints the
            resource alone: the chain table's goods and what it draws on are not what the record holds of a spent ground. */}
        {(moved ? [] : (chain.intermediateGoods||[])).map((g,j)=>(
          <React.Fragment key={j}>
            <span style={{fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED}}>→</span>
            <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.inkMag2,background:swatch['#F0EAD8'],padding:'1px 6px'}}>{g}</span>
          </React.Fragment>
        ))}
        {(chain.finalProducts||[]).slice(0,moved?0:2).map((g,j)=>(
          <React.Fragment key={j}>
            <span style={{fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED}}>→</span>
            <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.success,background:swatch['#E8F5EC'],border:'1px solid #a8d8b0',padding:'1px 6px',fontWeight:600}}>{g}</span>
          </React.Fragment>
        ))}
      </div>
      {needs.length>0&&<div style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch['#5A3A10']}}>
        Needs: {needs.map((n) => institutionDisplayName(n) || n).join(', ')}
      </div>}
      {!moved&&<DrawsOn deps={chain.dependsOn} mobile={mobile} />}
    </div>
  );
  if (stage === 'partial') return (
    <div style={{background:swatch['#F4FAF4'],border:'1px solid #a8d8b0',borderLeft:'3px solid #5a6a1a',padding:'10px 14px'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4,flexWrap:'wrap'}}>
        <span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:800,color:swatch['#3A5A1A'],background:swatch['#D8ECD8'],padding:'1px 6px',letterSpacing:'0.05em',textTransform:'uppercase'}}>Partial</span>
        <span style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag}}>{resourceDisplayName(chain.rawResource)}</span>
        <span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:600,color:valColor(chain.exportValue),background:valBg(chain.exportValue),padding:'0 5px'}}>{chain.exportValue} value</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap'}}>
        <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.inkMag2,background:swatch['#F0EAD8'],padding:'1px 6px',fontWeight:600}}>{resourceDisplayName(chain.rawResource)}</span>
        {/* P1: a card the analysis filed Unexploited that a chain works here (exploitationCardShown :: moved) prints
            the resource alone: the filed goods are the chain table's promise, not the record. */}
        {(moved ? [] : (chain.intermediateGoods||[])).map((g,j)=>(
          <React.Fragment key={j}><span style={{fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED}}>→</span><span style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.inkMag2,background:swatch['#F0EAD8'],padding:'1px 6px'}}>{g}</span></React.Fragment>
        ))}
      </div>
      <DrawsOn deps={chain.dependsOn} mobile={mobile} />
    </div>
  );
  return (
    <div style={{background:swatch['#FAF8F4'],border:'1px solid #a8d8b0',borderLeft:'3px solid #1a5a28',padding:'8px 14px'}}>
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
        <span style={{fontSize:chromeFontSize(FS.micro, mobile),fontWeight:800,color:swatch.success,background:swatch['#C8ECD4'],padding:'1px 6px',letterSpacing:'0.05em',textTransform:'uppercase'}}>✓ Fully exploited</span>
        <span style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{resourceDisplayName(chain.rawResource)}</span>
        <span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:600,color:valColor(chain.exportValue),background:valBg(chain.exportValue),padding:'0 5px'}}>{chain.exportValue} value</span>
      </div>
      <DrawsOn deps={chain.dependsOn} mobile={mobile} />
    </div>
  );
}

/** DS-ECO-11's one position on this page; named once so the header and the paragraph read the same row. */
const GROUND_MOUNT = 'resources.groundAndWorkings';

/**
 * @param {object} props
 * @param {object} props.settlement
 * @param {object} [props.narrativeNote]
 * @param {boolean} [props.publicDossier] §885.3 — a free, anonymous gallery viewer draws no
 *   corpus prose. Threaded from OutputContainer and answered inside economyDeskRead.
 * @param {boolean} [props.playerView] the desk audience, the PowerTab term exactly.
 */
export function ResourcesTab({settlement:r, narrativeNote, publicDossier = false, playerView = false}) {
  // THE PHONE PROSE FLOOR — the strategic-value line, the opportunity notes, a
  // gap's impact and the terrain effects. Bound above the early return so the
  // hook order is stable; the resource names and value chips keep their steps.
  const mobile = useIsMobile();
  const res = r?.resourceAnalysis;
  if (!res) return <Empty message="No resource data available."/>;
  const _config = r?.config || {};
  // THE ECONOMY DESK, through its one caller. DS-ECO-11 renders here and nowhere else.
  const deskProse = economyDeskRead(r, { publicDossier, playerView, publicSite: 'economy:resources', tier: r?.tier });
  // ⭐ ONE STRATEGIC-VALUE SENTENCE (RULINGS-T2 T2-9): DS-ECO-11's lens, on every view (the shared
  // page prints the owner's player-view draw: SW-B7b). The generator's rated line (`strategicValue`)
  // LEFT with that cause: no owner view reached it (0 of 300 towns), and a page with no draw is silent.
  // ⭐ THE GAPS READ THE RECORD (READER-R1, the chair's ruling 3). The generator's gap rows
  // ("Mill exists but lacks access to grain") ask the catalogue, not the place; a gap prints
  // here only when the record holds none of the house's inputs, as a fact about the place.
  // The raw rows and the priority notes (the generator's sliders: "Strong economic focus…")
  // are on the Viability tab's staff panel only.
  const gapLines = resourceGapLines(r);

  // Imports: object {critical:[], recommended:[], reasons:{}}

  // Exploitation buckets: the grade each card PRINTS (P1, W2-C-LEAVES-3): the chain model governs the yes or no where it
  // takes the resource, through the one reader the "No one here works" sentence and the PDF read.
  const shown = exploitationGroupsShown(r);
  const byRes = (a,b)=>(a.card.rawResource||'').localeCompare(b.card.rawResource||'');
  const unexploited    = [...shown.unexploited].sort(byRes);
  const partExploited  = [...shown.partial].sort(byRes);
  const fullExploited  = [...shown.full].sort(byRes);

  // Terrain accent color
  const terrainColor = {
    Coastal:'#1a3a6a', Plains:'#3a6a1a', Forest:'#1a5a28',
    Hills:'#6a4a1a', Mountains:'#4a4a5a', River:'#1a5a6a',
    Desert:'#8a5a1a', Swamp:'#2a5a3a', Tundra:'#3a4a6a',
  }[res.terrain] || '#a0762a';

  return (
    <div style={{...sans}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── TERRAIN IDENTITY HEADER ───────────────────────────────────────── */}
      <div style={{background:`linear-gradient(to right, ${terrainColor}18, ${terrainColor}08)`,border:`1px solid ${terrainColor}35`,borderLeft:`4px solid ${terrainColor}`,padding:'14px 18px',...FLUSH}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:14,flexWrap:'wrap'}}>
          <div style={{flex:1,minWidth:160}}>
            <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:terrainColor,marginBottom:4}}>Terrain</div>
            <div style={{fontSize: FS['22'],fontWeight:700,color:swatch.inkMag,lineHeight:1.1,marginBottom:6}}>{res.terrain||'Unknown'}</div>
          </div>
          {res.economicStrengths?.length>0&&<div style={{flex:'2 1 200px'}}>
            <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch.inkMag3,marginBottom:6}}>What the land offers</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
              {[...res.economicStrengths].sort((a,b)=>(a||'').localeCompare(b||'')).map((s,i)=>(
                <span key={i} style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:600,color:swatch.success,background:swatch['#E0F0E4'],border:'1px solid #a8d8b0',padding:'2px 9px'}}>✓ {s}</span>
              ))}
            </div>
          </div>}
        </div>
      </div>

      {/* ── CRITICAL IMPORTS (what they can't produce) ───────────────────── */}
      {(unexploited.length>0||partExploited.length>0||fullExploited.length>0)&&<Section title="Resource Exploitation" collapsible defaultOpen>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>

          {/* Unexploited — most interesting for DMs */}
          {unexploited.map((x,i)=><ResourceChainCard key={i} chain={x.card} stage="unexploited" settlement={r} moved={x.moved}/>)}

          {/* Partially exploited */}
          {partExploited.map((x,i)=><ResourceChainCard key={i} chain={x.card} stage="partial" moved={x.moved}/>)}

          {/* Fully exploited */}
          {fullExploited.map((x,i)=><ResourceChainCard key={i} chain={x.card} stage="full"/>)}
        </div>
      </Section>}

      {/* ── THE GROUND AND ITS WORKINGS (DS-ECO-11 at resources.groundAndWorkings) ──
          TWO LENSES SINCE THE UX CONSOLIDATION (2026-10-30, T2-9): the strategic-value
          sentence (which stands in for the generator's line in the header on DM views) and the
          ONE resource line on the Resource Exploitation section, UNDER the chains it reads (the
          block law, X-16: prose never above the fact it explains). The terrain lens
          is cut (the Overview's place passage owns the ground, X-1) and the strengths lens is
          cut (the chips above are the strengths, R2). */}
      <DeskLines mount={GROUND_MOUNT} settlementName={r?.name} tier={r?.tier} rungs={[deskProse.strategicValue, deskProse.exploitation, deskProse.resourceCondition]} />

      {/* ── AVAILABLE RAW RESOURCES ───────────────────────────────────────── */}
      {(r?.config?.nearbyResources?.length>0||res.availableResources?.length>0)&&<Section title="Nearby Resources" collapsible defaultOpen={true}>
        {(() => {
          const allRes = [...(r?.config?.nearbyResources || [])].sort();
          const depleted = [...(r?.config?.nearbyResourcesDepleted || [])].sort();
          const abundant = allRes.filter(rk => !depleted.includes(rk));
          const customSet = new Set(r?.config?.nearbyResourcesCustom || []);
          const fmtKey = rk => rk.replace(/_/g,' ').replace(/\b./g,c=>c.toUpperCase());
          return <>
            {depleted.length>0&&<div style={{marginBottom:8}}>
              <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch['#C05000'],letterSpacing:'0.06em',marginBottom:4}}>Depleted</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {depleted.map((rk,i)=>customSet.has(rk)
                  ? <span key={i} style={{fontSize:chromeFontSize(FS.xs, mobile),color:GOLD_DEEP,...GOLD_TINT,borderWidth:1,borderStyle:'solid',padding:'2px 9px',fontWeight:600,display:'inline-flex',alignItems:'center',gap:4}}>{fmtKey(rk)}<span style={{fontWeight:800}}>✦</span></span>
                  : <span key={i} style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch['#8B3000'],background:swatch['#FFF3ED'],border:'1px solid #e08040',padding:'2px 9px',fontWeight:600}}>{fmtKey(rk)}</span>)}
              </div>
            </div>}
            {abundant.length>0&&<div style={{marginBottom:res.availableResources?.length>0?8:0}}>
              <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch.success,letterSpacing:'0.06em',marginBottom:4}}>Abundant</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {abundant.map((rk,i)=>customSet.has(rk)
                  ? <span key={i} style={{fontSize:chromeFontSize(FS.xs, mobile),color:GOLD_DEEP,...GOLD_TINT,borderWidth:1,borderStyle:'solid',padding:'2px 9px',display:'inline-flex',alignItems:'center',gap:4}}>{fmtKey(rk)}<span style={{fontWeight:800}}>✦</span></span>
                  : <span key={i} style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.success,background:swatch['#FAF8F4'],border:'1px solid #88c880',padding:'2px 9px'}}>{fmtKey(rk)}</span>)}
              </div>
            </div>}
            {res.availableResources?.length>0&&<div style={{paddingTop:6,borderTop:'1px solid #e8dcc8'}}>
              <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:MUTED,letterSpacing:'0.06em',marginBottom:4}}>Commodities available</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
                {res.availableResources.map((r2,i)=><span key={i} style={{fontSize:chromeFontSize(FS.xs, mobile),color:swatch.inkMag2,background:swatch['#F0EAD8'],border:'1px solid #d8c890',padding:'2px 9px',textTransform:'capitalize'}}>{r2.replace(/_/g,' ')}</span>)}
              </div>
            </div>}
          </>;
        })()}
      </Section>}

      {/* ── GAPS & OPPORTUNITIES (combined) ──────────────────────────────── */}
      {gapLines.length>0&&<Section title="Gaps & Opportunities" collapsible defaultOpen accent="#5a2a8a">
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {gapLines.map((g,i)=>{
            const sev = g.severity;
            const gc = sev==='high'?'#8b1a1a':sev==='medium'?'#a0762a':'#6b5340';
            const gbg = sev==='high'?'#fdf4f4':sev==='medium'?'#faf4e8':'#f7f0e4';
            return <div key={i} style={{display:'flex',gap:8,padding:'8px 12px',background:gbg,border:`1px solid ${gc}40`,borderLeft:`3px solid ${gc}`}}>
              <div style={{flex:1}}>
                <span style={{fontSize:proseFontSize(FS.sm, mobile),color:swatch.inkMag2}}>{g.impact}</span>
              </div>
            </div>;
          })}
        </div>
      </Section>}

      {/* ── EXPORT POTENTIAL ─────────────────────────────────────────────── */}
      {res.exports?.length>0&&<Section title="Export Potential" collapsible defaultOpen={false}>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {[...res.exports].sort((a,b)=>{
              const vOrder={['very high']:0,high:1,medium:2,low:3};
              return (vOrder[a.value||'medium']??2)-(vOrder[b.value||'medium']??2)||(a.good||'').localeCompare(b.good||'');
            }).map((e,i)=>{
            const v = e.value||'medium';
            return <div key={i} style={{background:swatch['#FAF8F4'],border:'1px solid #a8d8b0',borderLeft:`3px solid ${valColor(v)}`,padding:'6px 10px',minWidth:0}}>
              <div style={{fontSize:FS.sm,fontWeight:700,color:swatch.inkMag}}>{e.product||e.good||e.name}</div>
              {e.reason&&<div style={{fontSize:proseFontSize(FS.xxs, mobile),color:swatch.inkMag3,marginTop:2}}>{e.reason}</div>}
            </div>;
          })}
        </div>
      </Section>}

      {/* ── TERRAIN EFFECTS (only if data exists) ────────────────────────── */}
      {res.featureEffects?.length>0&&<Section title="Terrain Effects" collapsible defaultOpen={false}>
        {res.featureEffects.map((e,i)=>(
          <div key={i} style={{padding:'6px 0',borderBottom:'1px solid #f0e8d8',fontSize:proseFontSize(FS.sm, mobile),color:swatch.inkMag2}}>
            <strong style={{color:swatch.inkMag}}>{e.feature}:</strong> {e.effect}
          </div>
        ))}
      </Section>}

    </div>
  );
}

export default React.memo(ResourcesTab);
