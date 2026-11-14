/** @vitest-environment jsdom */
// CENSUS-3 render: render.census2.jsx unchanged in its tab walk, and three surfaces more for the same town, each a view
// of its own in the dump: the Tonight sheet (REVIEW-BAR-0 render.bar0.jsx's line, verbatim: "Table/Tonight sheet"), the
// PDF's text ("PDF/<chapter component>": SettlementPDF's element tree with every function component executed, as the
// surfaces seat's guard tests/pdf/chainStateThreeSurfaces.test.jsx walks it; one line per outermost Text; the props the
// export builds in utils/generateSettlementPDF.js: the normalized record, buildPrintProse, resolvePrimaryStress; the
// owner's premium export: faithUnlocked) and the Foundry journal ("Journal/<page>": buildJournalPages over
// buildViewModel as foundry/generateFoundryModule.js builds them; one line per markdown line, its markup and its
// escapes struck so the line reads as Foundry shows it). CENSUS_SURFACES=0 renders the tabs only.
// CENSUS-2 render: the SECOND-WAVE-CENSUS render (render.census.jsx at 6b262d4e0) unchanged but for the seed map, which
// now comes from seedcfg.mjs so the readers' towns (rr2s-, rww-, rpf-) render by the same walk as the 720.
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
import { makeCfgFor } from '__P__/seedcfg.mjs';
import TonightSheet from '__TREE__/src/components/TonightSheet.jsx';
import { composeTonightSheet } from '__TREE__/src/domain/summary/tonightSheet.js';
import { SettlementPDF } from '__TREE__/src/pdf/SettlementPDF.jsx';
import { buildViewModel } from '__TREE__/src/pdf/lib/viewModel.js';
import { buildJournalPages } from '__TREE__/src/foundry/journalPages.js';
import { normalizeSettlement } from '__TREE__/src/domain/normalizeSettlement.js';
import { buildPrintProse } from '__TREE__/src/domain/display/stateProse/printProse.js';
import { governanceStressTypesOf } from '__TREE__/src/domain/display/governanceAccount.js';
import { resolvePrimaryStress } from '__TREE__/src/generators/stressPriority.js';
const SURF = process.env.CENSUS_SURFACES !== '0';
const clean = (t) => String(t).replace(/[\u200b-\u200d\u00ad\ufeff]/g, '').replace(/\s+/g, ' ').trim();
// the PDF: one line per outermost Text (its leaves joined), function components executed, a Text's render prop skipped
function pdfText(node, acc) { if (node == null || typeof node === 'boolean') return acc; if (typeof node === 'string' || typeof node === 'number') { acc.push(String(node)); return acc; }
  if (Array.isArray(node)) { for (const n of node) pdfText(n, acc); return acc; } if (typeof node.type === 'function') return pdfText(node.type(node.props), acc); return pdfText(node.props?.children, acc); }
function pdfWalk(node, out) { if (node == null || typeof node === 'boolean') return; if (typeof node === 'string' || typeof node === 'number') { const t = clean(node); if (t) out.push(t); return; }
  if (Array.isArray(node)) { for (const n of node) pdfWalk(n, out); return; } if (typeof node.type === 'function') { pdfWalk(node.type(node.props), out); return; }
  if (node.type === 'TEXT') { const t = clean(pdfText(node.props?.children, []).join('')); if (t) out.push(t); return; } pdfWalk(node.props?.children, out); }
function pdfDump(town) { const norm = normalizeSettlement(town); const out = [];
  const doc = SettlementPDF({ settlement: norm, faithUnlocked: true, variant: 'canon_dossier', now: 'today', primaryStress: resolvePrimaryStress(governanceStressTypesOf(norm)), stateProse: buildPrintProse(norm, { worldState: null, faithUnlocked: true }) });
  const kids = [].concat(doc.props.children).flat(Infinity).filter((k) => k && typeof k === 'object');
  for (const k of kids) { const name = (typeof k.type === 'function' && k.type.name) || 'Front'; const ls = []; try { pdfWalk(k, ls); } catch (e) { ls.push('[PDF-ERROR] ' + e.message); }
    out.push(`== PDF/${name} ==`, ...ls); }   // every line kept (a repeated row is a count on these surfaces)
  return out; }
// the journal: markdown as Foundry shows it (headings, bullets, emphasis, escapes, entities struck)
const unmd = (l) => clean(l.replace(/^\s*#{1,6}\s+/, '').replace(/^\s*(?:[-*+]|\d+\.)\s+/, '').replace(/^\s*>\s?/, '').replace(/\*\*|__/g, '').replace(/(^|[^\\])\*/g, '$1').replace(/\\([\\`*_{}\[\]()#+\-.!|<>~])/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"));
function journalDump(town) { const norm = normalizeSettlement(town); const vm = buildViewModel({ settlement: norm }); const out = [];
  let npc = 0; for (const p of buildJournalPages(vm, { variant: 'canon_dossier', faithUnlocked: true, settlement: norm })) { const ls = String(p.markdown).split('\n').map(unmd).filter((l) => l && !/^[-|: ]+$/.test(l));
    out.push(`== Journal/${(/^NPC — /.test(p.name) ? `NPC ${++npc}` : p.name)} ==`, ...ls); }
  return out; }

const OUT = process.env.CENSUS_OUT; const SEEDS = fs.readFileSync(process.env.CENSUS_SEEDS, 'utf8').trim().split('\n');
const cfgFor = makeCfgFor(birthConfig, DEFAULT_CONFIG);
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
    if (SURF) {
      cleanup();
      { const pal=new Proxy({}, { get: () => '#000' }); const r=render(<TonightSheet sheet={composeTonightSheet(town)} palette={pal} />); dump.push('== Table/Tonight sheet ==', ...lines(r.container)); cleanup(); }
      try { dump.push(...pdfDump(town)); } catch (e) { dump.push('== PDF/ERROR ==', '[PDF-ERROR] ' + e.message); }
      try { dump.push(...journalDump(town)); } catch (e) { dump.push('== Journal/ERROR ==', '[JOURNAL-ERROR] ' + e.message); }
    }
    fs.writeFileSync(`${OUT}/${seed}.txt`, dump.join('\n')+'\n');
  }, 300000);
}
