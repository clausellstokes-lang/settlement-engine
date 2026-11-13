/** @vitest-environment jsdom */
// SECOND-WAVE-CENSUS render: every seed through the real OutputContainer as the OWNER sees it (not readOnly; premium;
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
// REVIEW-W2-FIX-DATA-2 (copied from REVIEW-W2A-3): the APP's own configuration shape. DEFAULT_CONFIG (random trade, culture, threat, resources) as the
// store ships it; randomSliderMode true -> _randomizePriorities; the stress panel with Random OFF writes
// selectedStressesRandom:false and the ticked list (an empty list = "None"). Seeds: rf2-<size>-<calm|s1+s2>-<i>.
function cfgFor(seed){
  const m=seed.match(/^rf2-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/); if(!m) throw new Error(seed);
  const stresses = m[2]==='calm' ? [] : m[2].split('+');
  return birthConfig({...DEFAULT_CONFIG, settType:m[1], selectedStressesRandom:false, selectedStresses:stresses, _randomizePriorities:true});
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
