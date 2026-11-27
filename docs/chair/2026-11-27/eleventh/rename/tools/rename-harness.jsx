/**
 * RENAME-MEASURE harness (plain node, no vitest). Bundled by build-rename.mjs (esbuild), run by boot.mjs under jsdom.
 * Per plan row: born as the page battery births it; then FIVE records: base, T (town renamed), P (ruler / first person
 * renamed), H (first house = institution renamed), F (first power renamed), each by the product's own writer; each
 * restamped with its public prose (the save path re-composes the stamp on every persist: lib/saves.js :: publicProseForRow).
 * Each record: OWNER page (OutputContainer, every tab walked) + the non-DOM surfaces (PDF composers, Foundry journal,
 * Tonight sheet, session sheet headings). SHARE page (toPublicSafe -> projectShareVeil -> readOnly playerView) for base and T.
 * Every hash pick of kernel/proseHash.js is logged per render with its calling module (instrumented at bundle time).
 * Writes one jsonl line per birth: base views in full, each variant as per-view {gone, came} line diffs + its picks.
 */
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import { appendFileSync } from 'node:fs';
import OutputContainer from 'TREE/src/components/OutputContainer.jsx';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { toPublicSafe } from 'TREE/src/domain/display/publicSafe.js';
import { projectShareVeil } from 'TREE/src/domain/display/galleryVeil.js';
import { storeFor, linesOf } from 'TREE/tests/components/pageCensusWalk.shared.mjs';
import { applyNpcRenameToSettlement, applyFactionRenameToSettlement, resolveFactionForRename } from 'TREE/src/domain/factionRename.js';
import { applyInstitutionRenameToSettlement } from 'TREE/src/domain/institutionRename.js';
import { holderOf } from 'TREE/src/domain/seat/holderOfSeat.js';
import { normalizeSettlement } from 'TREE/src/domain/normalizeSettlement.js';
import { buildPrintProse } from 'TREE/src/domain/display/stateProse/printProse.js';
import { deriveDailyLifeSlot, DAILY_LIFE_PAGE_SLOTS } from 'TREE/src/domain/dailyLife.js';
import { composeCrisisPage } from 'TREE/src/domain/crisis/crisisPage.js';
import { composeTonightSheet } from 'TREE/src/domain/summary/tonightSheet.js';
import { collectPlotHooks } from 'TREE/src/domain/dossier/plotHooks.js';
import { tokenCase } from 'TREE/src/domain/display/labelCase.js';
import { buildViewModel } from 'TREE/src/pdf/lib/viewModel.js';
import { buildFoundryModuleFiles } from 'TREE/src/foundry/moduleBuilder.js';
import { overviewHeadline, economicsHeadline, npcsHeadline, powerHeadline } from 'TREE/src/pdf/lib/headlines.js';
import { mocks } from 'mock:state';

export const NEW = { town: 'Quillmarsh', person: 'Odalric Venn', house: 'Greywater Hall', power: 'The Ashen Compact' };

async function walkDossier(container) {
  const groupTabs = () => [...container.querySelectorAll('[aria-label="Dossier sections"] [role="tab"]')];
  const subTabs = () => [...container.querySelectorAll('[aria-label="Dossier tabs"] [role="tab"]')];
  await waitFor(() => { if (!(groupTabs().length > 0)) throw new Error('no groups'); });
  const views = {};
  for (let g = 0; g < groupTabs().length; g++) {
    const groupName = (groupTabs()[g].textContent || '').trim();
    fireEvent.click(groupTabs()[g]);
    await waitFor(() => { if (!(subTabs().length > 0)) throw new Error('no subtabs'); });
    for (let i = 0; i < subTabs().length; i++) {
      const tab = subTabs()[i]; const tabName = (tab.textContent || '').trim(); const id = (tab.id || '').replace(/^sf-tab-/, '');
      fireEvent.click(tab);
      try {
        await waitFor(() => { const p = container.querySelector(`#sf-panel-${id}`); if (!p || (p.textContent || '').length <= 15) throw new Error('empty'); }, { timeout: 10000 });
      } catch { /* an empty panel is read as it is */ }
      const panel = container.querySelector(`#sf-panel-${id}`);
      const name = `${groupName}/${tabName}`;
      if (!panel) { views[name] = ['[NO PANEL]']; continue; }
      const seen = new Set(); const acc = [];
      const snap = () => { for (const l of linesOf(panel)) if (!seen.has(l)) { seen.add(l); acc.push(l); } };
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

const fn = () => () => undefined;
const clone = (v) => JSON.parse(JSON.stringify(v));
const splitLines = (s) => String(s || '').split(/\n+/).map((l) => l.trim()).filter(Boolean);

/** The non-DOM surfaces, each as a list of lines. */
function surfaces(town) {
  const out = {};
  const nz = normalizeSettlement(town);
  try {
    const pp = buildPrintProse(nz, {});
    const acc = [];
    const walk = (v) => { if (typeof v === 'string') acc.push(...splitLines(v)); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
    walk(pp);
    out['PDF/printProse'] = acc;
  } catch (e) { out['PDF/printProse'] = [`[ERR ${String(e).slice(0, 120)}]`]; }
  try { out['PDF/dailyLife'] = DAILY_LIFE_PAGE_SLOTS.map((k) => `${k}: ${deriveDailyLifeSlot(k, nz)?.text || ''}`); } catch (e) { out['PDF/dailyLife'] = [`[ERR ${String(e).slice(0, 120)}]`]; }
  try { out['PDF/crisis'] = splitLines(JSON.stringify(composeCrisisPage(nz))).flatMap((s) => s.split(/","/)); } catch (e) { out['PDF/crisis'] = [`[ERR ${String(e).slice(0, 120)}]`]; }
  let vm = null;
  try { vm = buildViewModel({ settlement: nz, aiSettlement: null, aiDailyLife: null, narrativeMode: false, systemState: null, eventLog: [], phase: 'draft', campaign: null }); } catch (e) { out['PDF/vm'] = [`[ERR ${String(e).slice(0, 120)}]`]; }
  if (vm) {
    const h = [];
    try { h.push(`overview: ${overviewHeadline(vm.overview, vm.identity)}`); } catch { h.push('overview: [ERR]'); }
    try { h.push(`economics: ${economicsHeadline(vm.economics)}`); } catch { h.push('economics: [ERR]'); }
    try { h.push(`npcs: ${npcsHeadline(vm.npcs)}`); } catch { h.push('npcs: [ERR]'); }
    try { h.push(`power: ${powerHeadline(vm.power, vm.identity)}`); } catch { h.push('power: [ERR]'); }
    out['PDF/headlines'] = h;
    try {
      const { pages } = buildFoundryModuleFiles({ settlement: nz, vm, variant: 'canon_dossier', faithUnlocked: false });
      for (const p of pages) out[`Foundry/${p.name}`] = splitLines(p.markdown);
    } catch (e) { out['Foundry/ERR'] = [String(e).slice(0, 200)]; }
  }
  try {
    const sheet = composeTonightSheet(town);
    const acc = [];
    const walk = (v) => { if (typeof v === 'string') acc.push(...splitLines(v)); else if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') Object.values(v).forEach(walk); };
    walk(sheet);
    out['Tonight/sheet'] = acc;
    const shown = new Set((sheet.hooks || []).map((x) => String(x.text || '').replace(/[.!?]$/, '')));
    const hk = collectPlotHooks(town).filter((x) => !shown.has(String(x.text || '').replace(/[.!?]$/, ''))).slice(0, 12);
    out['Session/threads'] = hk.flatMap((x) => [`${tokenCase(x.source || '')}`, String(x.text || '')]);
  } catch (e) { out['Tonight/sheet'] = [`[ERR ${String(e).slice(0, 120)}]`]; }
  return out;
}

export async function ownerPage(town) {
  globalThis.__picks = [];
  mocks.store = storeFor(town, fn);
  const a = render(createElement(OutputContainer, { settlement: town }));
  const views = await walkDossier(a.container);
  cleanup();
  Object.assign(views, surfaces(town));
  const picks = globalThis.__picks; globalThis.__picks = null;
  return { views, picks: [...new Set(picks)] };
}

export async function sharePage(town) {
  globalThis.__picks = [];
  const pub = projectShareVeil(toPublicSafe(town, { full: false, memberOverrides: null }), null);
  mocks.store = storeFor(pub, fn);
  const b = render(createElement(OutputContainer, { settlement: pub, readOnly: true, playerView: true }));
  const views = await walkDossier(b.container);
  cleanup();
  const picks = globalThis.__picks; globalThis.__picks = null;
  return { views, picks: [...new Set(picks)] };
}

const stamp = (t) => withPublicProse(t, composePublicProse(t));

/** The renames, each by the product's own writer, on a deep copy. Returns { rec, old, neu } or { skip }. */
export function renames(town) {
  const out = {};
  // T: renameSettlementImpl / renameDetailSettlement write `name` only (store/settlementRenameHelpers.js)
  out.T = { rec: { ...clone(town), name: NEW.town }, old: town.name, neu: NEW.town };
  // P: the seat's holder where one is named, else the first named person; the converged NPC writer
  {
    let who = null; let how = 'first';
    try { const h = holderOf(town, { audience: 'owner' }); const nm = h?.person?.name || (typeof h?.person === 'string' ? h.person : null); if (nm && (town.npcs || []).some((n) => n?.name === nm)) { who = nm; how = 'seat'; } } catch { /* */ }
    if (!who) who = (town.npcs || []).find((n) => n?.name)?.name || null;
    if (who) { const rec = clone(town); const r = applyNpcRenameToSettlement(rec, who, NEW.person); out.P = { rec, old: who, neu: NEW.person, how, changed: !!r?.changed }; } else out.P = { skip: 'no person' };
  }
  // H: the first institution ("house"): the one institution writer (no UI caller on this tree)
  {
    const who = (town.institutions || []).find((i) => i?.name)?.name || null;
    if (who) { const rec = clone(town); const r = applyInstitutionRenameToSettlement(rec, who, NEW.house); out.H = { rec, old: who, neu: NEW.house, changed: !!r?.changed }; } else out.H = { skip: 'no house' };
  }
  // F: the first power of powerStructure.factions: the converged faction writer (store lane)
  {
    const r0 = resolveFactionForRename(town, 0);
    if (r0?.currentName) { const rec = clone(town); const r = applyFactionRenameToSettlement(rec, r0.currentName, NEW.power); out.F = { rec, old: r0.currentName, neu: NEW.power, changed: !!r?.changed }; } else out.F = { skip: 'no power' };
  }
  return out;
}

function diffViews(a, b) {
  const d = {};
  for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const A = new Set(a[k] || []); const B = new Set(b[k] || []);
    const gone = [...A].filter((l) => !B.has(l)); const came = [...B].filter((l) => !A.has(l));
    if (gone.length || came.length) d[k] = { gone, came };
  }
  return d;
}

export async function run(plan, out, { share = true } = {}) {
  await loadGenerationLawPayloads();
  for (const row of plan) {
    const t0 = Date.now();
    let line;
    try {
      const born = generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} });
      const base = stamp(born);
      const B = await ownerPage(base);
      const BS = share ? await sharePage(base) : null;
      const vars = {};
      const rn = renames(born);
      for (const [k, v] of Object.entries(rn)) {
        if (v.skip) { vars[k] = { skip: v.skip }; continue; }
        const rec = stamp(v.rec);
        const O = await ownerPage(rec);
        const entry = { old: v.old, neu: v.neu, how: v.how, changed: v.changed, diff: diffViews(B.views, O.views), picks: O.picks };
        if (k === 'T' && share) {
          const S = await sharePage(rec);
          entry.shareDiff = diffViews(BS.views, S.views);
          entry.sharePicks = S.picks;
          entry.ownerVsShare = diffViews(O.views, S.views);
        }
        vars[k] = entry;
      }
      line = { seed: row.seed, size: row.size, name: born.name, id: born.id ?? null, _seed: born._seed ?? null, ms: 0,
        views: B.views, picks: B.picks, shareViews: BS?.views ?? null, sharePicks: BS?.picks ?? null,
        baseOwnerVsShare: BS ? diffViews(B.views, BS.views) : null, vars };
      line.ms = Date.now() - t0;
    } catch (e) {
      try { cleanup(); } catch { /* */ }
      line = { seed: row.seed, size: row.size, error: String(e?.stack || e).slice(0, 2000) };
    }
    appendFileSync(out, `${JSON.stringify(line)}\n`);
    console.log(`${new Date().toISOString()} ${row.seed} ${line.ms ?? 'ERR'}ms`);
  }
}
