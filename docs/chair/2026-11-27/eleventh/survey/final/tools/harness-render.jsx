/**
 * SURVEY-FINAL (A)+(B) phase 1: births each plan row exactly as the page battery births it (birthConfig(row.config),
 * { seed, customContent: {} }) with a presumption ledger open around the birth (the bundle adds each note's text) and every
 * declarationAdmits call logged (the bundle wraps it). Then the FINAL record (the stamped town, as the page reads it) is
 * asked again: every birth note refused there, and every direct declarationAdmits call admitted at birth and refused there.
 * Writes one jsonl line per birth. Changes nothing in the tree.
 */
import { cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { createElement } from 'react';
import OutputContainer from 'TREE/src/components/OutputContainer.jsx';
import { toPublicSafe } from 'TREE/src/domain/display/publicSafe.js';
import { projectShareVeil } from 'TREE/src/domain/display/galleryVeil.js';
import { storeFor } from 'TREE/tests/components/pageCensusWalk.shared.mjs';
import { linesOf } from 'TREE/tests/components/pageCensusWalk.shared.mjs';
import { buildViewModel } from 'TREE/src/pdf/lib/viewModel.js';
import { composeTonightSheet } from 'TREE/src/domain/summary/tonightSheet.js';
import { resolveDeclared, lineText } from 'TREE/src/domain/facts/drawDeclared.js';
import { SAFETY_LINE_SIBLINGS } from 'TREE/src/generators/safetyProfile.js';
import { DESC_VARIANT_SIBLINGS, DESC_LATE_SIBLINGS } from 'TREE/src/data/institutionDescVariants.js';
import { HISTORY_DESC_SIBLINGS } from 'TREE/src/data/historyData.js';
import { STRESS_TYPE_SIBLINGS } from 'TREE/src/data/stressTypes.js';
import { mocks } from 'mock:state';
const fn = () => { const f = (..._a) => undefined; return f; };
const expect = (v) => ({
  toBeGreaterThan: (n) => { if (!(v > n)) throw new Error(`expected ${v} > ${n}`); },
  toBeTruthy: () => { if (!v) throw new Error('expected truthy'); },
});
const TABLES = { SAFETY_LINE_SIBLINGS, DESC_VARIANT_SIBLINGS, DESC_LATE_SIBLINGS, HISTORY_DESC_SIBLINGS, STRESS_TYPE_SIBLINGS };
/** the door's own rule on a sibling set, on the final facts, chained (a resolved line that is itself a key resolves again) */
function siblingOnFinal(text, facts) {
  for (const [name, table] of Object.entries(TABLES)) {
    for (const [key, set] of Object.entries(table)) {
      if (!Array.isArray(set) || !set.some((l) => lineText(l) === text)) continue;
      let cur = key; const seen = new Set();
      for (;;) {
        if (seen.has(cur)) break; seen.add(cur);
        const s = table[cur]; if (!Array.isArray(s)) break;
        const r = resolveDeclared(s, { facts });
        if (r.line == null) return { table: name, key, shown: null };
        const t = lineText(r.line); if (t === cur) break; cur = t;
      }
      return { table: name, key, shown: cur };
    }
  }
  return null;
}
import { createHash } from 'node:crypto';
import { appendFileSync } from 'node:fs';
import { generateSettlementPipeline } from 'TREE/src/generators/generateSettlementPipeline.js';
import { withPublicProse } from 'TREE/src/domain/display/publicProse.js';
import { composePublicProse } from 'TREE/src/components/new/publicProseCompose.js';
import { birthConfig, loadGenerationLawPayloads } from 'TREE/src/domain/density/densityCreateBoundary.js';
import { withPresumptionLedger } from 'TREE/src/domain/facts/presumptionLedger.js';
import { factsOf } from 'TREE/src/domain/facts/factsOf.js';
import { declarationAdmits, declarationOfTags, atomsOf } from 'TREE/src/domain/facts/factVocabulary.js';

const sha = (v) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const INTERNAL = /src\/domain\/facts\/(drawDeclared|presumptionCheck|factVocabulary)\.js|stateProseKernel\.js/;

/** paths in `obj` whose string value contains `text` (first 4) */
function pathsOf(obj, text, max = 4) {
  const out = [];
  const walk = (v, p, depth) => {
    if (out.length >= max || depth > 14) return;
    if (typeof v === 'string') { if (v.includes(text)) out.push(p); return; }
    if (Array.isArray(v)) { v.forEach((x, i) => walk(x, `${p}[${i}]`, depth + 1)); return; }
    if (v && typeof v === 'object') for (const k of Object.keys(v)) walk(v[k], p ? `${p}.${k}` : k, depth + 1);
  };
  walk(obj, '', 0);
  return out;
}

async function walkDossier(container, { fireEvent, waitFor, expect }, reps) {
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
      const name = `${groupName}/${tabName}`;
      if (!panel) { views[name] = ['[NO PANEL]']; continue; }
      const seen = new Set(); const acc = [];
      const snap = () => {
        const ls = linesOf(panel); const cnt = new Map();
        for (const l of ls) cnt.set(l, (cnt.get(l) || 0) + 1);
        for (const [l, c] of cnt) if (c > 1) { reps[name] ||= {}; reps[name][l] = Math.max(reps[name][l] || 0, c); }
        for (const l of ls) if (!seen.has(l)) { seen.add(l); acc.push(l); }
      };
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

export async function run(plan, out, { modmap }) {
  await loadGenerationLawPayloads();
  const callerOf = (stack) => {
    const frames = String(stack).split('\n').slice(1);
    for (const f of frames) {
      const m = f.match(/at (?:(\S+) )?\(?(.*):(\d+):(\d+)\)?$/);
      if (!m) continue;
      const mod = modmap(Number(m[3]));
      if (INTERNAL.test(mod)) return '(none)';
      return `${mod} :: ${m[1] || '(anon)'}`;
    }
    return '(none)';
  };
  let n = 0;
  for (const row of plan) {
    const t0 = Date.now();
    let line;
    try {
      globalThis.__DA_LOG = [];
      const ledger = [];
      const { result: town } = withPresumptionLedger(() => generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} }), ledger);
      const da = globalThis.__DA_LOG; globalThis.__DA_LOG = null;
      const recordHash = sha(town);
      const stamped = withPublicProse(town, composePublicProse(town));
      const facts = factsOf(stamped);
      const refused = [];
      for (const e of ledger) {
        const atoms = [...(e.poolDeclares || []), ...(e.atoms || [])];
        if (atoms.length === 0 && !e.crisisScoped) continue;
        const parts = [declarationOfTags(e.poolDeclares || []), ...(Array.isArray(e.__decl) ? e.__decl : [declarationOfTags(e.atoms || [])])];
        const decl = { needs: parts.flatMap((p) => p.needs), excludes: parts.flatMap((p) => p.excludes), crisis: parts.flatMap((p) => p.crisis) };
        const v = declarationAdmits(decl, facts, { crisisScoped: e.crisisScoped === true, ctx: e.ctx });
        const vTags = declarationAdmits(declarationOfTags(atoms), facts, { crisisScoped: e.crisisScoped === true, ctx: e.ctx });
        if (v.admitted) continue;
        const text = typeof e.__text === 'string' ? e.__text : null;
        refused.push({ pool: e.pool, lineId: e.lineId, text: e.__text ?? null, atoms, refused: v.refused, replaySees: !vTags.admitted, resolvedBy: e.resolvedBy, block: e.block ?? null, drawKind: e.drawKind, surface: e.surface, ctx: e.ctx ? Object.keys(e.ctx) : null, stored: text ? pathsOf(stamped, text.length > 60 ? text.slice(0, 60) : text) : null });
      }
      const direct = new Map();
      let directCalls = 0;
      for (const d of da) {
        const caller = callerOf(d.stack);
        if (caller === '(none)') continue;
        directCalls += 1;
        if (!d.admitted) continue;
        const v = declarationAdmits(d.decl, facts, { crisisScoped: d.crisisScoped === true, ctx: d.ctx });
        if (v.admitted) continue;
        const k = `${caller} || ${atomsOf(d.decl).join(' · ')} || ${v.refused.join(' · ')}`;
        direct.set(k, (direct.get(k) || 0) + 1);
      }
      const want = process.env.WANT ? new Set(process.env.WANT.split(',')) : null;
      if (!refused.length && !direct.size) { line = { seed: row.seed, skipped: true }; appendFileSync(out, `${JSON.stringify(line)}\n`); continue; }
      mocks.store = storeFor(stamped, fn);
      const a = render(createElement(OutputContainer, { settlement: stamped }));
      const views = await walkDossier(a.container, { fireEvent, waitFor, expect }, {});
      cleanup();
      const pub = projectShareVeil(toPublicSafe(stamped, { full: false, memberOverrides: null }), null);
      mocks.store = storeFor(pub, fn);
      const b = render(createElement(OutputContainer, { settlement: pub, readOnly: true, playerView: true }));
      const shareViews = await walkDossier(b.container, { fireEvent, waitFor, expect }, {});
      cleanup();
      let pdf = ''; try { pdf = JSON.stringify(buildViewModel({ settlement: stamped })); } catch (e) { pdf = 'ERR ' + String(e).slice(0, 200); }
      let tonight = ''; try { tonight = JSON.stringify(composeTonightSheet(stamped)); } catch (e) { tonight = 'ERR ' + String(e).slice(0, 200); }
      const where = (vs, key) => Object.entries(vs).filter(([, ls]) => ls.some((l) => l.includes(key))).map(([v]) => v);
      for (const r of refused) {
        const t = typeof r.text === 'string' ? r.text.trim() : null;
        if (!t) continue;
        const key = t.length > 60 ? t.slice(0, 60) : t;
        r.owner = where(views, key); r.share = where(shareViews, key);
        r.pdf = pdf.includes(JSON.stringify(key).slice(1, -1)); r.tonight = tonight.includes(JSON.stringify(key).slice(1, -1));
        r.onFinal = siblingOnFinal(t, facts);
        if (r.onFinal && r.onFinal.shown) { const k2 = r.onFinal.shown.trim().slice(0, 60); r.onFinal.ownerHas = where(views, k2).length > 0; }
      }
      const prosperityLine = (views['Systems/Economics'] || []).slice(0, 2);
      line = { seed: row.seed, size: row.size, recordHash, ms: Date.now() - t0, refused, direct: [...direct], prosperityLine, rung: facts.prosperity };
    } catch (e) {
      globalThis.__DA_LOG = null;
      line = { seed: row.seed, size: row.size, error: String(e?.stack || e).slice(0, 2000) };
    }
    appendFileSync(out, `${JSON.stringify(line)}\n`);
    n++;
    if (n % 25 === 0) console.log(`${new Date().toISOString()} ${n}/${plan.length} last ${row.seed} ${line.ms ?? 'ERR'}ms`);
  }
}
