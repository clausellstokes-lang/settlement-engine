import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { FS, MUTED, swatch } from '../../theme.js';
import IconButton from '../../primitives/IconButton.jsx';
import { sans } from '../Primitives';
import {Ts, J0} from '../tabConstants';
import { tokenCase } from '../labelLadder.js';
import useIsMobile from '../../../hooks/useIsMobile.js';
import { chromeFontSize, proseFontSize } from '../../../design/proseScale.js';
import {computeChainSets, computeChainDepthMap} from '../tabHelpers';
import EconomyFreshnessNote from '../EconomyFreshnessNote.jsx';
import {ServiceItem} from '../serviceComponents';
import {NarrativeNote} from '../NarrativeNote';
import { economyDeskRead } from '../economyDeskRead.js';
import { DeskLines } from './EconomicsGlance.jsx'; // the shared position renderer (see its docblock)
import { compareCodepoint } from '../../../domain/deterministicSort.js';

/**
 * ⛔ DS-SUP-3'S POSITION, BOUND ONCE AND SPELLED ONCE.
 *
 * The mount registry's reachability arm counts this id as a WHOLE STRING LITERAL under
 * `src/components` and refuses a position named twice — a second spelling reads as a
 * second position for one block. This tab now draws the position at TWO PLACES (the
 * catalog paragraph, and the impaired house's own row), which is one position rendered
 * where each of its two lenses belongs, so the id is a const and the sites reference it.
 */
const CATALOG_MOUNT = 'services.catalogStanding';

/**
 * ⭐ THE CATEGORY'S RENDER ORDER, HOISTED, because two readers need the same answer.
 *
 * The list below is sorted impaired-first then by name, and the DS-SUP-3 join has to know
 * which row comes FIRST for the named house — so the comparator cannot stay inline in the
 * render. A second, quietly different copy is the fork this estate names by hand every
 * time it finds one.
 *
 * @param {Set<string>} impaired @param {Set<string>} degraded
 * @returns {(a: unknown, b: unknown) => number}
 */
function serviceOrder(impaired, degraded) {
  const rank = (svc) => {
    const name = typeof svc === 'string' ? svc : svc?.name || '';
    const inst = typeof svc === 'object' ? svc?.institution || '' : '';
    return (impaired.has(name) || impaired.has(inst)) ? 2
      : (degraded.has(name) || degraded.has(inst)) ? 1 : 0;
  };
  return (a, b) => {
    const diff = rank(b) - rank(a);
    if (diff !== 0) return diff;
    const na = typeof a === 'string' ? a : a?.name || '';
    const nb = typeof b === 'string' ? b : b?.name || '';
    return na.localeCompare(nb);
  };
}

/** The institution a service entry names, or '' — the one spelling of that read. */
const institutionOf = (svc) => (typeof svc === 'object' ? svc?.institution || '' : '');

/**
 * @param {object} props
 * @param {object} props.services
 * @param {object} props.settlement
 * @param {object} [props.narrativeNote]
 * @param {boolean} [props.publicDossier] §885.3 — a free, anonymous gallery viewer draws no
 *   corpus prose. Threaded from OutputContainer and answered inside economyDeskRead.
 * @param {boolean} [props.playerView] the desk audience, the PowerTab term exactly.
 */
export function ServicesTab({ services, settlement, narrativeNote, publicDossier = false, playerView = false}) {
  const [search, setSearch] = useState('');
  const [openCats, setOpenCats] = useState({});
  const tier = settlement?.tier || 'town';
  // `mobile` drives the phone layout AND the phone prose floor: the tab's three
  // reading sentences (the search miss, the absence note, the criminal-category
  // caution) take the floor below the breakpoint. Counts, chips and category
  // headers are glanced at and keep their own steps.
  const mobile = useIsMobile();
  const hasServices = services && Object.values(services).some(v => v?.length > 0);

  if (!hasServices) return (
    <div style={{padding:32,textAlign:'center',color:MUTED,fontSize:FS.md}}>Generate a settlement to see available services.</div>
  );

  // Chain impairment
  const {tradeDeps, impaired, degraded, vulnerable, depReasons} = computeChainSets(settlement);
  const chainDepthMap = computeChainDepthMap(settlement);
  // Build service → chain depth lookup from active chains
  const serviceChainDepth = new Map();
  (settlement?.economicState?.activeChains||[]).forEach(chain => {
    const depth = chainDepthMap.get(chain.chainId) || 1;
    (chain.processingInstitutions||[]).forEach(inst => {
      const key = inst.toLowerCase();
      if (!serviceChainDepth.has(key) || serviceChainDepth.get(key) < depth) {
        serviceChainDepth.set(key, depth);
      }
    });
  });

  // Build flat list for search
  const allServices = [];
  Object.entries(services||{}).forEach(([cat, list]) => {
    (list||[]).forEach(svc => {
      const name = typeof svc === 'string' ? svc : svc.name || '';
      const desc = typeof svc === 'object' ? (svc.desc || '') : '';
      const inst = typeof svc === 'object' ? (svc.institution || '') : '';
      allServices.push({ cat, svc, name, desc, inst, text: `${name} ${desc} ${inst}`.toLowerCase() });
    });
  });

  const query = search.trim().toLowerCase();
  const searchResults = query ? allServices.filter(s => s.text.includes(query)) : null;
  const missing = (J0[tier] || []).filter(k => !services?.[k]?.length);
  const totalCount = allServices.length;
  const hasCustom = allServices.some(s => typeof s.svc === 'object' && (s.svc.custom === true || s.svc.source === 'custom'));

  // Per-category impairment counts
  const catStats = {};
  Object.entries(services||{}).forEach(([cat, list]) => {
    let imp = 0, deg = 0, vul = 0;
    (list||[]).forEach(svc => {
      const name = typeof svc === 'string' ? svc : svc.name || '';
      const inst = typeof svc === 'object' ? (svc.institution || '') : '';
      if (impaired.has(name)||impaired.has(inst)) imp++;
      else if (degraded.has(name)||degraded.has(inst)) deg++;
      else if (vulnerable.has(name)||vulnerable.has(inst)) vul++;
    });
    catStats[cat] = { total: list?.length || 0, imp, deg, vul };
  });

  const totalImpaired = Object.values(catStats).reduce((s,c) => s+c.imp, 0);
  const totalDegraded = Object.values(catStats).reduce((s,c) => s+c.deg, 0);

  const _catsWithIssues = Object.entries(catStats).filter(([,c]) => c.imp>0||c.deg>0).length;

  // Category display order: strictly alphabetical — impairment is shown on each card
  const catOrder = Object.keys(services||{}).filter(k => services[k]?.length).sort((a,b) => a.localeCompare(b));
  // THE ONE IMPAIRED HOUSE THE DESK MAY NAME (DS-SUP-3's second lens). Taken from THIS
  // tab's own impairment sets rather than re-derived in the desk: the chips above and the
  // sentence below must never disagree about which house is short. A CATEGORY THAT IS
  // PRESENT is the pool's own condition, so the search runs over the rendered categories;
  // the order is by CODEPOINT (never localeCompare — THE PROMISE is cross-device stability)
  // so the same settlement names the same house on every machine.
  const impairedInstitution = catOrder
    .filter(cat => (catStats[cat]?.imp || 0) > 0)
    .flatMap(cat => (services[cat] || []).map(svc => (typeof svc === 'object' ? svc.institution || '' : '')))
    .filter(inst => inst && impaired.has(inst))
    .sort(compareCodepoint)[0] || null;
  const deskProse = economyDeskRead(settlement, { publicDossier, playerView, impairedInstitution });
  // ⭐ THE ROW DS-SUP-3'S SECOND LENS IS ABOUT (owner order 2026-09-19, the Defense idiom
  // applied here). That lens names `{institution}` — ONE house, by name — and it printed in
  // the catalog paragraph at the top of the tab, a screen and a half above the row that
  // house's service sits on. A reader had to pair a sentence to a row by searching for a
  // name. It now renders UNDER that row, in the town's own voice, exactly as
  // `defense.threatAssessment` renders under the bar it is about.
  //
  // ⚠ THE JOIN IS BY INSTITUTION AND IT RESOLVES TO EXACTLY ONE ROW. A house may supply
  // several services in several categories, and the sentence is about the HOUSE, so it is
  // said once: at the first row, in the tab's OWN render order (catOrder, then
  // `serviceOrder`), whose institution is the named one. A house with no rendered row at all
  // draws nothing here rather than the wrong row's sentence — `impairedInstitution` is built
  // from these same lists, so that case is the empty one.
  const impairedRow = (() => {
    if (!impairedInstitution) return null;
    const cmp = serviceOrder(impaired, degraded);
    for (const cat of catOrder) {
      const hit = [...(services[cat] || [])].sort(cmp)
        .find((svc) => institutionOf(svc) === impairedInstitution);
      if (hit) return { cat, svc: hit };
    }
    return null;
  })();

  const toggleCat = (cat) => setOpenCats(prev => ({...prev, [cat]: prev[cat] !== false ? false : true}));
  const isOpen = (cat) => openCats[cat] !== false; // default open

  return (
    <div style={{...sans}}>
      <NarrativeNote note={narrativeNote} />

      {/* ── ECONOMY FRESHNESS (R-3 declaration, R-4 shared leaf) — the honest
          stale-window note: applied events are not re-derived into this catalog
          until the next full survey. Conditional on the reconciliationLog detector;
          absent trail ⇒ byte-identical tab. 'catalog' is the services wording of
          the one shared sentence pair (domain/display/economyFreshness.js). */}
      <EconomyFreshnessNote settlement={settlement} variant="catalog" />

      {/* ── THE CATALOG AND ITS ABSENCES (DS-SUP-3 at services.catalogStanding) ──
          ONE LENS HERE: where the town stands against what a place its rung is expected to
          keep. That is a fact about the CATALOG, so it frames the catalog.
          ⛔ THE SECOND LENS LEFT THIS PARAGRAPH (owner order 2026-09-19). It names one house
          by name, and a sentence about a named house printed at the top of a tab is a
          sentence the reader has to go and find a row for. It renders under that house's own
          row below — same position, same registry ruling, flipping this row to `glance`
          still silences both together. The counts strip, the category grid and the absence
          chips are the DATUM and are untouched. Silent on a settlement with no catalog at
          all, because the tab itself returns early there (R-DST-K). */}
      <DeskLines mount={CATALOG_MOUNT} settlementName={settlement?.name} tier={settlement?.tier} rungs={[deskProse.catalogStanding]} />

      {/* ── HEADER STRIP ────────────────────────────────────────────────── */}
      <div style={{background:'linear-gradient(to right,#f5ede0,#ede3cc)',border:'1px solid #c8b89a',padding:'10px 14px',marginBottom:14,display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
        <div style={{flex:1,minWidth:0}}>
          {/* The two spans were separated by margin ALONE, so the strip's accessible
              name and any copy/paste of it read "15 servicesacross 8 categories".
              The space is a real text node; the margin keeps the optical gap. */}
          <span style={{fontSize:FS.md,fontWeight:700,color:swatch.inkMag}}>{totalCount} services</span>{' '}
          <span style={{fontSize:FS.sm,color:MUTED,marginLeft:6}}>across {catOrder.length} categories</span>
        </div>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {totalImpaired>0&&<span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch['#7A1A1A'],background:swatch['#F4DEDE'],border:'1px solid #d8c8a8',padding:'2px 8px'}}>{totalImpaired} impaired</span>}
          {totalDegraded>0&&<span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch['#7A3A00'],background:swatch['#FBEAD0'],border:'1px solid #e0c080',padding:'2px 8px'}}>{totalDegraded} reduced</span>}
          {missing.length>0&&<span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch['#7A5010'],background:swatch['#F0E4C0'],border:'1px solid #e0c080',padding:'2px 8px'}}>{missing.length} missing</span>}
          {totalImpaired===0&&totalDegraded===0&&missing.length===0&&<span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.inkMag3,background:swatch['#F0EAD8'],border:'1px solid #d0c0a0',padding:'2px 8px'}}>✓ No impairments</span>}
        </div>
      </div>

      {/* ── SEARCH ──────────────────────────────────────────────────────── */}
      <div style={{marginBottom:14}}>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',display:'inline-flex',color:MUTED,pointerEvents:'none'}}><Search size={15}/></span>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            aria-label="Search services"
            // The four-example placeholder is cut off mid-word on a phone
            // ('…"horse", "fenc'), which reads as a rendering fault rather than a
            // hint. Two examples fit a 375px field; the accessible name above is
            // the same on both, so nothing is lost to a screen reader.
            placeholder={mobile
              ? 'Search services, "healing", "horse"…'
              : 'Search services, "healing", "horse", "fence", "wizard"…'}
            style={{width:'100%',padding:'9px 32px',border:'1px solid #c8b89a',fontSize:FS.md,fontFamily:'Nunito,sans-serif',color:swatch.inkMag,background:swatch['#FAF8F4'],boxSizing:'border-box'}}/>
          {search&&<span style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',display:'inline-flex'}}><IconButton Icon={X} label="Clear search" onClick={()=>setSearch('')} tone="ghost" size="sm" /></span>}
        </div>

        {searchResults !== null && (
          <div style={{marginTop:8}}>
            {searchResults.length === 0
              ? <div style={{background:swatch['#FAF8F4'],border:'1px solid #e8c0c0',borderLeft:'3px solid #8b1a1a',padding:'10px 14px',fontSize:proseFontSize(FS.md,mobile),color:swatch['#5A1A1A']}}>
                  <strong>Not available</strong>. Nothing matching "{search}" in this settlement.
                  {missing.length>0&&<span style={{color:swatch.inkMag3}}> Missing categories: {missing.map(k=>Ts[k]?.label).filter(Boolean).join(', ')}.</span>}
                </div>
              : <div style={{background:swatch['#FAF8F4'],border:'1px solid #e0d0b0',borderLeft:'3px solid #c8b89a',padding:'10px 14px'}}>
                  <div style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.inkMag3,marginBottom:8}}>✓ {searchResults.length} result{searchResults.length!==1?'s':''} found</div>
                  {searchResults.map((r,i)=>(
                    <div key={i} style={{marginBottom:6}}>
                      <ServiceItem svc={r.svc} accent={Ts[r.cat]?.accent||'#1a5a28'} isCriminal={r.cat==='criminal'} tradeDeps={tradeDeps} impaired={impaired} degraded={degraded} vulnerable={vulnerable} depReasons={depReasons} settlement={settlement} chainDepth={serviceChainDepth.get((typeof r.svc==='string'?r.svc:r.svc?.institution||'').toLowerCase())}/>
                      <span style={{fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED,marginLeft:20,display:'block',marginTop:1}}>{Ts[r.cat]?.label}</span>
                    </div>
                  ))}
                </div>
            }
          </div>
        )}
      </div>

      {!query && <>

        {/* ── CATEGORY HEALTH GRID ────────────────────────────────────────── */}
        {(totalImpaired>0||totalDegraded>0||missing.length>0) && (
          <div style={{marginBottom:14}}>
            <div style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch.inkMag3,textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:8}}>Category Status</div>
            <div style={{display:'grid',gridTemplateColumns:mobile?'repeat(2,1fr)':'repeat(3,1fr)',gap:6}}>
              {catOrder.map(cat => {
                const meta = Ts[cat] || {label:cat,accent:'#6b5340'};
                const cs = catStats[cat] || {total:0,imp:0,deg:0,vul:0};
                const hasImp = cs.imp > 0;
                const hasDeg = cs.deg > 0 && !hasImp;
                const borderColor = hasImp?'#d8c8a8':hasDeg?'#e0c080':'#d0c0a8';
                const bg = hasImp?'#f4dede':hasDeg?'#fbead0':'#f0ead8';
                return (
                  <div key={cat} role="button" tabIndex={0} style={{background:bg,border:`1px solid ${borderColor}`,borderLeft:`3px solid ${hasImp?'#c0392b':hasDeg?'#b8860b':meta.accent}`,padding:'6px 10px',cursor:'pointer'}}
                    onClick={()=>{
                      setOpenCats(prev=>({...prev,[cat]:true}));
                      setTimeout(()=>{const el=document.getElementById('svc-cat-'+cat);el&&el.scrollIntoView({behavior:'smooth',block:'start'});},50);
                    }}
                    onKeyDown={e=>{
                      if(e.key==='Enter'||e.key===' '){
                        e.preventDefault();
                        setOpenCats(prev=>({...prev,[cat]:true}));
                        setTimeout(()=>{const el=document.getElementById('svc-cat-'+cat);el&&el.scrollIntoView({behavior:'smooth',block:'start'});},50);
                      }
                    }}>
                    {/* ODQ §934.23 — no clamp on dossier text: this label may be the raw category token on a catalogue the taxonomy has not named (`Ts[cat] || {label:cat}`), so it is not provably short and it wraps instead of truncating. */}
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch.inkMag,flex:1,minWidth:0}}>{meta.label}</span>
                      <span style={{fontSize:chromeFontSize(FS.xxs, mobile),color:MUTED,flexShrink:0}}>{cs.total}</span>
                    </div>
                    {(hasImp||hasDeg)&&<div style={{marginTop:3,fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:hasImp?'#7a1a1a':'#7a3a00'}}>
                      {hasImp&&`${cs.imp} impaired`}{hasDeg&&`${cs.deg} reduced`}
                    </div>}
                  </div>
                );
              })}
              {missing.map(cat => {
                const meta = Ts[cat] || {label:cat,accent:'#6b5340'};
                return (
                  <div key={'missing-'+cat} style={{background:swatch['#F0E4C0'],border:'1px solid #e0c080',borderLeft:'3px solid #b8860b',padding:'6px 10px',opacity:0.8}}>
                    <div style={{display:'flex',alignItems:'center',gap:5}}>
                      <span style={{fontSize:chromeFontSize(FS.xs, mobile),fontWeight:700,color:swatch['#5A3A10'],flex:1,minWidth:0}}>{meta.label}</span>
                    </div>
                    <div style={{marginTop:3,fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch['#7A5010']}}>not available</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── NOTABLE ABSENCES ─────────────────────────────────────────────── */}
        {missing.length > 0 && (
          <div style={{background:swatch['#F0E4C0'],border:'1px solid #e0c080',borderLeft:'3px solid #b8860b',padding:'9px 14px',marginBottom:14,fontSize:proseFontSize(FS.sm,mobile),color:swatch['#5A3A10']}}>
            <strong>Not available for a {tier}:</strong> {missing.map(k=>Ts[k]?.label).filter(Boolean).join(', ')}. The party will need to look elsewhere.
          </div>
        )}

        {/* ── SERVICE CATEGORIES ───────────────────────────────────────────── */}
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {catOrder.map(cat => {
            const list = services[cat];
            if (!list?.length) return null;
            const meta = Ts[cat] || {label:cat,accent:'#6b5340'};
            const cs = catStats[cat];
            const isCriminal = cat === 'criminal';
            const open = isOpen(cat);
            const hasImp = cs.imp > 0;
            const hasDeg = cs.deg > 0;
            const accentColor = hasImp?'#c0392b':hasDeg?'#b8860b':meta.accent;

            return (
              <div key={cat} id={'svc-cat-'+cat} style={{
                background: isCriminal?'#1a0a0a':`${meta.accent}08`,
                border:`1px solid ${isCriminal?'#4a1a1a':`${meta.accent}28`}`,
                borderLeft:`3px solid ${accentColor}`,
                overflow:'hidden'
              }}>
                {/* Category toggle — bespoke: full-width header row with left-aligned
                    label/count, conditional impairment badges, an auto-pushed
                    chevron, and an open-state-dependent bottom border. The Button
                    primitive centers content and can't express this layout, so it
                    stays raw (this file remains in the raw-button baseline). */}
                <button type="button" onClick={()=>toggleCat(cat)} style={{
                  width:'100%',display:'flex',alignItems:'center',gap:8,
                  padding:'10px 14px',background:'transparent',border:'none',
                  borderBottom:open?`1px solid ${isCriminal?'#3a1a1a':`${meta.accent}20`}`:'none',
                  cursor:'pointer',textAlign:'left',WebkitTapHighlightColor:'transparent'
                }}>
                  {/* A GROUP HEADER NESTED INSIDE THE CARD, not the card's eyebrow — the rule
                      DefenseSecurity's pair already set: "ARMED FORCES & FORTIFICATIONS" keeps
                      its capitals and "Standing forces" beneath it does not. "Category Status"
                      above is this surface's one eyebrow and is untouched. */}
                  <span style={{fontSize:FS.sm,fontWeight:800,color:isCriminal?'#c06060':accentColor}}>{tokenCase(meta.label)}</span>
                  <span style={{fontSize:chromeFontSize(FS.xs, mobile),color:isCriminal?'#8a5050':'#9c8068'}}>({cs.total})</span>
                  {hasImp&&<span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch['#7A1A1A'],background:swatch['#F4DEDE'],border:'1px solid #d8c8a8',padding:'1px 5px',marginLeft:2}}>{cs.imp} impaired</span>}
                  {!hasImp&&hasDeg&&<span style={{fontSize:chromeFontSize(FS.xxs, mobile),fontWeight:700,color:swatch['#7A3A00'],background:swatch['#FBEAD0'],border:'1px solid #e0c080',padding:'1px 5px',marginLeft:2}}>{cs.deg} reduced</span>}
                  <span style={{fontSize:chromeFontSize(FS.xxs, mobile),color:isCriminal?'#8a5050':'#9c8068',marginLeft:'auto'}}>{open?'▲':'▼'}</span>
                </button>

                {open && <div style={{padding:'10px 14px'}}>
                  {isCriminal&&meta.note&&<p style={{fontSize:proseFontSize(FS.xs,mobile),color:swatch['#8A5050'],fontStyle:'italic',margin:'0 0 10px',lineHeight:1.5,borderLeft:'2px solid #4a1a1a',paddingLeft:8}}>{meta.note}</p>}
                  <div style={{display:'flex',flexDirection:'column',gap:6}}>
                    {/* The comparator is `serviceOrder` at module scope — the DS-SUP-3 join
                        above resolves the first impaired-house row through the SAME function,
                        so the sentence cannot land under a row the list did not put first. */}
                    {[...list].sort(serviceOrder(impaired, degraded)).map((svc,i)=>(
                      <React.Fragment key={i}>
                        <ServiceItem svc={svc} accent={meta.accent} isCriminal={isCriminal}
                          tradeDeps={tradeDeps} impaired={impaired} degraded={degraded} vulnerable={vulnerable} depReasons={depReasons} settlement={settlement} chainDepth={serviceChainDepth.get((typeof svc==='string'?svc:svc?.institution||'').toLowerCase())}/>
                        {/* ── DS-SUP-3's SECOND LENS, UNDER THE ROW IT NAMES ──────────────
                            The Defense idiom exactly (DefenseTab's `threatSentenceFor`): the
                            sentence sits in the list, under the row, OUTSIDE any control — the
                            row above is a plain card and the category's own toggle is its
                            header, so nothing here lengthens a button's accessible name and
                            nothing is folded away. A silent corpus renders nothing (R-DST-K);
                            the row, its status pill and its chain chip are untouched either
                            way. */}
                        {deskProse.impairedService && impairedRow && impairedRow.cat === cat && impairedRow.svc === svc && (
                          <div data-testid="services-impaired-house-line">
                            <DeskLines mount={CATALOG_MOUNT} settlementName={settlement?.name}
                              tier={settlement?.tier} rungs={[deskProse.impairedService]} />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>}
              </div>
            );
          })}
        </div>

        <p style={{fontSize:proseFontSize(FS.xs, mobile),color:MUTED,marginTop:12,fontStyle:'italic',textAlign:'right'}}>
          {totalCount} services · {catOrder.length} categories{totalImpaired>0?` · ${totalImpaired} impaired`:''}{hasCustom?' · custom':''}
        </p>
      </>}
    </div>
  );
}

export default React.memo(ServicesTab);
