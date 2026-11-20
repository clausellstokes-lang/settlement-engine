/** @vitest-environment jsdom */
/**
 * sameness-census.render.census.jsx — SAME-1's rendered sameness census, its renderer (2026-11-20; brief 1), run ONLY
 * by scripts/sameness-census.mjs through its own vitest config (named `*.census.jsx` so the repository's test glob
 * never picks it up, as the page census's renderer).
 *
 * Per plan row: the chair's birth (stored-census/census.mjs: DEFAULT_CONFIG at the size, no dials), the public prose
 * stamped as the page census does, then EVERY PRINTED LINE with the heading it prints under:
 *   web:<group>/<tab>  the real OutputContainer walked as tests/components/pageCensusWalk.shared.mjs walks it (every
 *                      group, sub-tab and disclosure), its block walk copied here to keep the heading;
 *   pdf:<variant>      SettlementPDF's tree walked to its text leaves (houseLabelEverySurface's `pdfText`), three variants,
 *                      the heading being the last heading-styled text passed (a page or section head › a sub head);
 *   session            the strings composeTonightSheet returns (what SessionMode and the Table View render), the heading
 *                      being the leaf's key path.
 * Plus the STORED index: every string leaf of the stamped record (census.mjs's walk), masked and split to sentences,
 * masked sentence -> its paths (indices folded to `[]`). Lines are written MASKED (census.mjs's mask). Writes
 * `<out>/<seed>.json`.
 */
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { writeFileSync, readFileSync } from 'node:fs';
import { storeFor } from '../../tests/components/pageCensusWalk.shared.mjs';
import { maskerFor, sentencesOf } from '../sameness-census.mjs';

const mocks = vi.hoisted(() => ({ store: {} }));
vi.mock('../../src/store/index.js', () => {
  const useStore = (selector) => selector(mocks.store);
  useStore.subscribe = () => () => {}; useStore.getState = () => mocks.store;
  return { useStore };
});
vi.mock('../../src/lib/supabase.js', () => ({ supabase: {}, isConfigured: false }));
vi.mock('../../src/generators/aiLayer', () => ({ runTemplateNarrative: vi.fn() }));
vi.mock('../../src/lib/analytics.js', () => ({ track: vi.fn(), Funnel: { track: vi.fn() }, EVENTS: new Proxy({}, { get: (_t, k) => String(k) }) }));

import OutputContainer from '../../src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { withPublicProse } from '../../src/domain/display/publicProse.js';
import { composePublicProse } from '../../src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { DEFAULT_CONFIG } from '../../src/store/configSlice.js';
import { SettlementPDF } from '../../src/pdf/SettlementPDF.jsx';
import { composeTonightSheet } from '../../src/domain/summary/tonightSheet.js';

const OUT = process.env.SAME_CENSUS_OUT;
const PLAN = JSON.parse(readFileSync(String(process.env.SAME_CENSUS_PLAN), 'utf8'));
const viewport = { matches: false, listeners: new Set() };
window.matchMedia = Object.assign(vi.fn((q) => ({ media: q, get matches() { return viewport.matches; }, addEventListener: (_t, f) => viewport.listeners.add(f), removeEventListener: (_t, f) => viewport.listeners.delete(f), addListener: (f) => viewport.listeners.add(f), removeListener: (f) => viewport.listeners.delete(f) })), { SF_CONTROLLED: true });

// ── the web walk (pageCensusWalk.shared.mjs's linesOf/walkDossier, copied to keep each line's heading) ──
const BLOCK = new Set(['DIV', 'P', 'LI', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SECTION', 'TR', 'UL', 'OL', 'TABLE', 'HEADER', 'FOOTER', 'ARTICLE', 'BR', 'DT', 'DD', 'DETAILS', 'SUMMARY', 'BLOCKQUOTE', 'FIGCAPTION']);
const HEAD = /^H[1-6]$/;
const isHeading = (el) => HEAD.test(el.tagName) || el.getAttribute('role') === 'heading' || el.tagName === 'SUMMARY' || el.tagName === 'LEGEND' || (el.hasAttribute('aria-expanded') && !el.hasAttribute('aria-haspopup'));
/** A heading's own words: cut at its first glyph or a count, at most 60 characters. */
const headWords = (t) => t.replace(/\s+/g, ' ').split(/[▲▼▸▾▴▶◀?(·:]/)[0].trim().slice(0, 60);
/** One [line, heading path] per block element; `<style>` skipped. A heading (an h1–h6, a role=heading, a summary, a
 * disclosure's button) heads what follows it inside its parent: the path is the open headings, outer to inner, ` › `. */
function linesWithHeading(root) {
  const out = []; let cur = ''; const stack = [];
  const flush = () => { const t = cur.replace(/\s+/g, ' ').trim(); if (t) out.push([t, stack.join(' › ')]); cur = ''; };
  const walk = (n) => {
    const depth = stack.length;
    for (const c of n.childNodes) {
      if (c.nodeType === 3) cur += c.nodeValue;
      else if (c.nodeType === 1) {
        if (c.tagName === 'STYLE') { flush(); continue; }
        if (isHeading(c)) { flush(); const h = headWords(c.textContent || ''); walk(c); flush(); if (h) stack.push(h); continue; }
        const block = BLOCK.has(c.tagName);
        if (block) flush();
        walk(c);
        if (block) flush();
      }
    }
    if (stack.length > depth) { flush(); stack.length = depth; }
  };
  walk(root); flush();
  return out;
}
async function walkDossier(container) {
  const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
  const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
  await waitFor(() => expect(groupTabs().length).toBeGreaterThan(0));
  const views = {};
  for (let g = 0; g < groupTabs().length; g++) {
    const groupName = (groupTabs()[g].textContent || '').trim();
    fireEvent.click(groupTabs()[g]);
    await waitFor(() => expect(subTabs().length).toBeGreaterThan(0));
    for (let i = 0; i < subTabs().length; i++) {
      const tab = subTabs()[i]; const tabName = (tab.textContent || '').trim(); const id = (tab.id || '').replace(/^sf-tab-/, '');
      fireEvent.click(tab);
      try {
        await waitFor(() => { const p = container.querySelector(`#sf-panel-${id}`); expect(p).toBeTruthy(); expect((p?.textContent || '').length).toBeGreaterThan(15); }, { timeout: 10000 });
      } catch { /* an empty panel is read as it is */ }
      const panel = container.querySelector(`#sf-panel-${id}`);
      const name = `web:${groupName}/${tabName}`;
      if (!panel) { views[name] = []; continue; }
      const seen = new Set(); const acc = [];
      const snap = () => { for (const [l, h] of linesWithHeading(panel)) if (!seen.has(l)) { seen.add(l); acc.push([l, h]); } };
      const disclosures = () => [...panel.querySelectorAll('[aria-expanded]')].filter((e) => !e.hasAttribute('aria-haspopup'));
      for (let pass = 0; pass < 4; pass++) {
        const closed = disclosures().filter((e) => e.getAttribute('aria-expanded') === 'false');
        if (!closed.length) break;
        for (const e of closed) fireEvent.click(e);
      }
      snap();
      const n = disclosures().length;
      for (let k = 0; k < n; k++) {
        const e = disclosures()[k];
        if (!e || e.getAttribute('aria-expanded') !== 'false') continue;
        fireEvent.click(e);
        if (e.getAttribute('aria-expanded') === 'true') snap();
      }
      views[name] = acc;
    }
  }
  return views;
}

// ── the PDF walk (houseLabelEverySurface's pdfText, with the last <Heading> kept) ──
function pdfTokens(node, out = []) {
  if (node == null || typeof node === 'boolean') return out;
  if (typeof node === 'string' || typeof node === 'number') { out.push(String(node)); return out; }
  if (Array.isArray(node)) { for (const n of node) pdfTokens(n, out); return out; }
  if (typeof node === 'object') {
    if (typeof node.type === 'function') {
      out.push('\n'); pdfTokens(node.type(node.props), out); out.push('\n'); return out;
    }
    if (node.type && typeof node.type === 'object' && typeof node.type.type === 'function') return pdfTokens({ type: node.type.type, props: node.props }, out);
    const st = [node.props?.style].flat(Infinity).reduce((a, x) => (x && typeof x === 'object' ? Object.assign(a, x) : a), {});
    const lvl = st.fontWeight >= 700 && st.fontSize >= 14 ? 1 : st.textTransform === 'uppercase' && st.fontWeight >= 800 && st.fontSize >= 11 ? 2 : 0;
    if (lvl) { const h = pdfTokens(node.props?.children, []).filter((x) => typeof x === 'string').join(' ').replace(/\s+/g, ' ').trim(); if (h) out.push({ h, lvl }); }
    out.push('\n'); pdfTokens(node.props?.children, out); out.push('\n');
  }
  return out;
}
function pdfLines(variant, town) {
  const phase = variant === 'draft_brief' ? 'draft' : 'canon';
  const toks = pdfTokens({ type: SettlementPDF, props: { settlement: town, phase, variant, faithUnlocked: true } });
  const out = []; let cur = []; let heading = ''; let section = '';
  const flush = () => { const t = cur.join(' ').replace(/\s+/g, ' ').trim(); if (t) out.push([t, heading]); cur = []; };
  for (const t of toks) {
    if (typeof t === 'object') { flush(); if (t.lvl === 1) { section = t.h.slice(0, 50); heading = section; } else heading = `${section} › ${t.h.slice(0, 50)}`; continue; }
    if (t === '\n') { flush(); continue; }
    cur.push(t);
  }
  flush();
  return out;
}

// ── the session sheet: every string leaf composeTonightSheet returns, under its key path ──
function sheetLines(sheet) {
  const out = []; const seen = new Set();
  const walk = (v, path) => {
    if (v == null) return;
    if (typeof v === 'string') { const t = v.replace(/\s+/g, ' ').trim(); if (t) out.push([t, path || '(sheet)']); return; }
    if (typeof v !== 'object' || seen.has(v)) return; seen.add(v);
    if (Array.isArray(v)) { for (const x of v) walk(x, `${path}[]`); return; }
    for (const k of Object.keys(v)) walk(v[k], path ? `${path}.${k}` : k);
  };
  walk(sheet, '');
  return out;
}

// ── the stored index (census.mjs's walk), masked sentence -> folded paths ──
function storedIndex(town, mask) {
  const idx = {}; const seen = new Set();
  const walk = (v, path, depth) => {
    if (v == null || depth > 14) return;
    if (typeof v === 'string') {
      if (v.length >= 25 && v.includes(' ')) for (const s of sentencesOf(mask(v))) { const a = (idx[s] ||= []); if (!a.includes(path)) a.push(path); }
      return;
    }
    if (typeof v !== 'object' || seen.has(v)) return; seen.add(v);
    if (Array.isArray(v)) { for (const x of v) walk(x, `${path}[]`, depth + 1); return; }
    for (const k of Object.keys(v)) { if (k.startsWith('_')) continue; walk(v[k], path ? `${path}.${k}` : k, depth + 1); }
  };
  walk(town, '', 0);
  return idx;
}

afterEach(cleanup);
let ready = false;
for (const row of PLAN) {
  test(row.seed, async () => {
    if (!ready) { await loadGenerationLawPayloads(); ready = true; }
    const t0 = Date.now();
    let town = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: row.size }), null, { seed: row.seed, customContent: {} });
    const mask = maskerFor(town);
    town = withPublicProse(town, composePublicProse(town));
    /** @type {Record<string, Array<[string, string]>>} */ const surfaces = {};
    mocks.store = storeFor(town, vi.fn);
    const { container } = render(<OutputContainer settlement={town} />);
    Object.assign(surfaces, await walkDossier(container));
    cleanup();
    for (const variant of ['canon_dossier', 'draft_brief', 'timeline_packet']) {
      try { surfaces[`pdf:${variant}`] = pdfLines(variant, town); } catch (e) { surfaces[`pdf:${variant}`] = [[`[PDF THREW] ${String(e?.message || e).slice(0, 200)}`, '']]; }
    }
    try { surfaces.session = sheetLines(composeTonightSheet(town)); } catch (e) { surfaces.session = [[`[SHEET THREW] ${String(e?.message || e).slice(0, 200)}`, '']]; }
    const masked = Object.fromEntries(Object.entries(surfaces).map(([k, v]) => [k, v.map(([l, h]) => [mask(l), mask(h)])]));
    writeFileSync(`${OUT}/${row.seed}.json`, JSON.stringify({ seed: row.seed, size: row.size, ms: Date.now() - t0, surfaces: masked, stored: storedIndex(town, mask) }));
  }, 300000);
}
