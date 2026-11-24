/** @vitest-environment node */
/**
 * READ-25 (CLOSE-7, chain two): WHAT ELSE MOVED, by path. Births each seed of a plan on TWO trees (before, after) with the same
 * birth as the page battery (`birthConfig(row.config)`, `{ seed, customContent: {} }`) and writes, per birth, the record paths
 * (indices folded to `[]`) whose value differs, the live roster names lost and gained, the houses each generation step
 * selected, added or removed that differ (by the record's own institution trace), and the count of differing leaves.
 * Changes nothing; writes only $TWIN_OUT (JSON lines).
 *   TWIN_BEFORE=<tree> TWIN_AFTER=<tree> TWIN_PLAN=<plan.json> TWIN_OUT=<out.jsonl> npx vitest run --config <cfg>
 */
import { test } from 'vitest';
import { readFileSync, writeFileSync } from 'node:fs';

const PLAN = JSON.parse(readFileSync(String(process.env.TWIN_PLAN), 'utf8'));
const OUT = String(process.env.TWIN_OUT);

/** @param {string} T */
const loadTree = async (T) => {
  const R = `${T}/src/`;
  const { generateSettlementPipeline } = await import(/* @vite-ignore */ R + 'generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await import(/* @vite-ignore */ R + 'domain/density/densityCreateBoundary.js');
  const { liveInstitutions } = await import(/* @vite-ignore */ R + 'domain/institutions/institutionRoster.js');
  await loadGenerationLawPayloads();
  return { born: (/** @type {any} */ row) => generateSettlementPipeline(birthConfig(row.config), null, { seed: row.seed, customContent: {} }), liveInstitutions };
};

/** every leaf path → value, indices folded for the summary @param {unknown} v */
const leaves = (v) => {
  /** @type {Map<string, string>} */ const out = new Map();
  const walk = (/** @type {unknown} */ x, /** @type {string} */ p) => {
    if (x && typeof x === 'object') { for (const [k, y] of Object.entries(x)) walk(y, Array.isArray(x) ? `${p}[${k}]` : (p ? `${p}.${k}` : k)); return; }
    out.set(p, JSON.stringify(x));
  };
  walk(v, '');
  return out;
};

test('twin diff', async () => {
  const A = await loadTree(String(process.env.TWIN_BEFORE));
  const B = await loadTree(String(process.env.TWIN_AFTER));
  const lines = [];
  for (const row of PLAN) {
    const a = A.born(row); const b = B.born(row);
    const la = leaves(a); const lb = leaves(b);
    /** @type {Map<string, number>} */ const paths = new Map(); let n = 0;
    for (const k of new Set([...la.keys(), ...lb.keys()])) {
      if (la.get(k) === lb.get(k)) continue;
      n++; const folded = k.replace(/\[\d+\]/g, '[]'); paths.set(folded, (paths.get(folded) || 0) + 1);
    }
    const na = A.liveInstitutions(a).map((i) => String(i?.name)); const nb = B.liveInstitutions(b).map((i) => String(i?.name));
    // the roster as each STEP left it, by its trace: which houses each step selected, added or removed, before against after
    const byStep = (/** @type {any} */ x) => { /** @type {Record<string, string[]>} */ const o = {}; for (const t of x.simulationTrace || []) if (t?.targetType === 'institution') (o[`${t.step}:${t.result}`] ||= []).push(String(t.targetId)); return o; };
    const sa = byStep(a); const sb = byStep(b); /** @type {Record<string, { lost: string[], gained: string[] }>} */ const steps = {};
    for (const k of new Set([...Object.keys(sa), ...Object.keys(sb)])) { const x = sa[k] || []; const y = sb[k] || []; const lost = x.filter((v) => !y.includes(v)); const gained = y.filter((v) => !x.includes(v)); if (lost.length || gained.length) steps[k] = { lost, gained }; }
    lines.push(JSON.stringify({ seed: row.seed, leaves: n, steps, lost: na.filter((x) => !nb.includes(x)), gained: nb.filter((x) => !na.includes(x)),
      paths: Object.fromEntries([...paths.entries()].sort((x, y) => y[1] - x[1])) }));
  }
  writeFileSync(OUT, `${lines.join('\n')}\n`);
}, 7200000);
