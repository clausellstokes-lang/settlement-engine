/** @vitest-environment jsdom */
// REVIEW-R3-STAGES render (REVIEW-R2-STAGES render.rr2s.jsx; only cfgFor changed) (from REVIEW-W2A-3 render.rw3.jsx; only cfgFor changed): every seed through the real OutputContainer as the OWNER sees it (not readOnly; premium;
// publicProse stamped where the tree has it), the dossierPhoneFloorAllViews walk: every group and sub-tab clicked,
// every aria-expanded disclosure opened, single-valued accordions opened in turn. Text dumped one line per block
// element per view (a repeated line kept once per view; <style> text tagged [STYLE]). census.sh writes __TREE__.
// Named *.census.jsx so no repository test glob picks it up.
import { afterEach, test, vi, expect } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import fs from 'node:fs';
const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('__TREE__/src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store; return { useStore };
});
vi.mock('__TREE__/src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('__TREE__/src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('__TREE__/src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));
import OutputContainer from '__TREE__/src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '__TREE__/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '__TREE__/src/domain/display/publicProse.js'; // @stamp
import { composePublicProse } from '__TREE__/src/components/new/publicProseCompose.js'; // @stamp
import { birthConfig, loadGenerationLawPayloads } from '__TREE__/src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '__TREE__/src/store/configSlice.js';

const OUT = process.env.CENSUS_OUT; const SEEDS = fs.readFileSync(process.env.CENSUS_SEEDS, 'utf8').trim().split('\n');
// REVIEW-W2A-3: the APP's own configuration shape. DEFAULT_CONFIG (random trade, culture, threat, resources) as the
// store ships it; randomSliderMode true -> _randomizePriorities; the stress panel with Random OFF writes
// selectedStressesRandom:false and the ticked list (an empty list = "None"). Seeds: rw3-<size>-<calm|s1+s2>-<i>.
// REVIEW-R3-STAGES: cfgFor is births.mjs's (the census's r2r/r2s seeds verbatim; rr3-<size>-<calm|s1+s2>-<route>-<i> in the app's shape).
const dials={ tradeRouteAccess:'random_trade', culture:'random_culture', monsterThreat:'random_threat', nearbyResourcesRandom:true, selectedStressesRandom:true, _randomizePriorities:true, magicExists:true, contentProfile:'grounded' };
function cfgFor(seed){
  let m=seed.match(/^r2r-(\w+)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,settType:m[1]});
  m=seed.match(/^r2s-(\w+)-(thorp|hamlet|village|town|city|metropolis)-(\d+)$/); if(m) return birthConfig({...DEFAULT_CONFIG,...dials,selectedStresses:[m[1]],selectedStressesRandom:false,settType:m[2]});
  // rw3-<size>-<calm|s1+s2>-<i>: REVIEW-W2A-3's own cfgFor (the round-two list's towns), verbatim.
  m=seed.match(/^rw3-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/); if(m){ const stresses = m[2]==='calm' ? [] : m[2].split('+');
    return birthConfig({...DEFAULT_CONFIG, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, _randomizePriorities:true}); }
  // rr3p-<size>-<calm|s1+s2>-<route>-<i>: the app's shape with the Regional Threat select on 'plagued' and the sliders set by hand
  // (_randomizePriorities off), Military at 10, 20 or 30 by i: the user's route to the embattled-region rows.
  m=seed.match(/^rr3p-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/); if(m){
    const stresses = m[2]==='calm' ? [] : m[2].split('+'); const route = m[3]==='rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({...DEFAULT_CONFIG, ...route, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, monsterThreat:'plagued', priorityMilitary:10+(+m[4]%3)*10}); }
  m=seed.match(/^rr[23][a-z]?-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-([a-z_]+)-(\d+)$/); if(m){
    const stresses = m[2]==='calm' ? [] : m[2].split('+'); const route = m[3]==='rand' ? {} : { tradeRouteAccess: m[3] };
    return birthConfig({...DEFAULT_CONFIG, ...route, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, _randomizePriorities:true}); }
  throw new Error(seed);
}
const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });
function store(town){ return { settlement: town, aiSettlement: null, setAiSettlement: vi.fn(), clearAiSettlement: vi.fn(), regenSection: vi.fn(), requestNarrative: vi.fn(), requestDailyLife: vi.fn(), getCost: vi.fn(() => 0), creditBalance: 0, aiLoading: false, aiRegenerating: false, aiError: null, aiProgress: '', aiPartialFailure: null, aiViolations: null, clearAiViolations: vi.fn(), lastRegenerationDelta: null, clearLastRegenerationDelta: vi.fn(), showNarrative: false, setShowNarrative: vi.fn(), savedSettlements: [{ id: 'save-1', settlement: town }], campaigns: [], eventLog: [], systemState: null, pinNpc: vi.fn(), unpinNpc: vi.fn(), queueEdit: vi.fn(), applyUserEditAction: vi.fn(), revertUserEditAction: vi.fn(), focusEntity: vi.fn(), editMode: false, phase: 'draft', auth: { tier: 'premium' }, isElevated: () => false, isSettlementClockBound: () => false, userPrefs: { tableViewOpen: false }, setUserPref: vi.fn() }; }
const BLOCK = new Set(['DIV','P','LI','H1','H2','H3','H4','H5','H6','SECTION','TR','UL','OL','TABLE','HEADER','FOOTER','ARTICLE','BR','DT','DD','DETAILS','SUMMARY','BLOCKQUOTE','FIGCAPTION','STYLE']);
function lines(root){
  const out=[]; let cur='';
  const flush=()=>{ const t=cur.replace(/\s+/g,' ').trim(); if(t) out.push(t); cur=''; };
  (function walk(n){ for(const c of n.childNodes){ if(c.nodeType===3){ cur+=c.nodeValue; } else if(c.nodeType===1){ const b=BLOCK.has(c.tagName); if(c.tagName==='STYLE'){ flush(); cur='[STYLE] '+c.textContent; flush(); continue; } if(b) flush(); walk(c); if(b) flush(); } } })(root);
  flush(); return out;
}
function openAll(panel, snap){
  const disc=()=>[...panel.querySelectorAll('[aria-expanded]')].filter(e=>!e.hasAttribute('aria-haspopup'));
  for(let p=0;p<4;p++){ const c=disc().filter(e=>e.getAttribute('aria-expanded')==='false'); if(!c.length) break; for(const e of c) fireEvent.click(e); }
  snap();
  const n=disc().length; for(let i=0;i<n;i++){ const e=disc()[i]; if(!e||e.getAttribute('aria-expanded')!=='false') continue; fireEvent.click(e); if(e.getAttribute('aria-expanded')==='true') snap(); }
}
afterEach(cleanup);
let ready=false;
for (const seed of SEEDS) {
  test(seed, async () => {
    if(!ready){ await loadGenerationLawPayloads(); ready=true; }
    let town = generateSettlementPipeline(cfgFor(seed), null, { seed, customContent: {} });
    town = withPublicProse(town, composePublicProse(town)); // @stamp
    mocks.store = store(town);
    const { container } = render(<OutputContainer settlement={town} />);
    const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
    const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
    await waitFor(() => expect(groupTabs().length).toBeGreaterThan(0));
    const dump=[];
    for (let g = 0; g < groupTabs().length; g++) {
      const groupName = groupTabs()[g].textContent.trim(); fireEvent.click(groupTabs()[g]);
      await waitFor(() => expect(subTabs().length).toBeGreaterThan(0));
      for (let s = 0; s < subTabs().length; s++) {
        const b = subTabs()[s]; const tabName=b.textContent.trim(); const id=(b.id||'').replace(/^sf-tab-/,'');
        fireEvent.click(b);
        try { await waitFor(() => { const p = container.querySelector(`#sf-panel-${id}`); expect(p).toBeTruthy(); expect((p.textContent||'').length).toBeGreaterThan(15); }, { timeout: 10000 }); } catch {}
        const panel = container.querySelector(`#sf-panel-${id}`); if(!panel){ dump.push(`== ${groupName}/${tabName} == [NO PANEL]`); continue; }
        const seen=new Set(); const acc=[];
        openAll(panel, ()=>{ for(const l of lines(panel)) if(!seen.has(l)){ seen.add(l); acc.push(l);} });
        dump.push(`== ${groupName}/${tabName} ==`, ...acc);
      }
    }
    fs.writeFileSync(`${OUT}/${seed}.txt`, dump.join('\n')+'\n');
    if(process.env.RECORD_OUT) fs.writeFileSync(`${process.env.RECORD_OUT}/${seed}.json`, JSON.stringify(town,null,1));
  }, 300000);
}
