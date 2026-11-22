/**
 * scripts/audit/soak-review/dependence.mjs — THE DEPENDENCE SCAN, SECOND PASS (lane SOAK-2,
 * 2026-11-04; the dry run's §3 "This is where I stopped", docs/SOAK_1000_2026-11-03.md).
 *
 * The first pass (`aggregate.mjs`, the raw scan) is dominated by tier: almost every count
 * scales with tier, and one value copied under two paths scores near 1. This pass reads the
 * same columns three ways the first could not:
 *
 *  1. TIER-RESIDUAL. Each pair's dependence is computed WITHIN each tier (a tier where either
 *     column is constant is skipped: a constant has no dependence to report) and then POOLED,
 *     n-weighted over the tiers that had one. A tier step can no longer pass for a relation.
 *  2. COPY SUPPRESSION. A pair whose POOLED within-tier |v| ≥ 0.98, or whose two paths end in
 *     the same leaf key (`economicState.prosperity` / `chain.prosperity`), is one value under
 *     two names: it is dropped from the surprises and listed separately as a copy. The 0.98 is
 *     read on the residual, not the raw value: a real relation riding a tier step scores ≥ 0.98
 *     raw (the step dominates) and only a copy stays ≥ 0.98 inside every tier.
 *  3. THE CHAINS ON THE RESIDUAL. Every engine chain (`chains.mjs :: CHAINS`) re-read pooled
 *     within tier; a chain from `chain.tier` itself has no residual and says so.
 *
 * Surprises: kind (a), an UNEXPECTED dependence — a residual pair at pooled |v| ≥ 0.5 that is no
 * copy, crosses families and is no engine chain. A kind-(a) pair whose two sides EACH depend
 * (pooled ≥ 0.5) on one generation input (`INPUT_PATHS`: the matrix's dials and the stress
 * cell) is marked `commonInput` — that input explains it — and kept apart from the rest; kind (b), an EXPECTED-BUT-ABSENT one — a chain
 * the engine promises ('strong' or 'present') whose residual is weak or absent. Each carries
 * its figure, n and three witness seeds (the most over-represented joint cell, numerics cut
 * into within-tier terciles). Naming the rule behind a kind-(a) surprise is the reader's.
 * Pure over its inputs.
 */
import { dependence } from './dependence-measures.mjs';

export const TIERS = Object.freeze(['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']);
/** Copy threshold (the chair's ruling: |v| ≥ 0.98), read on the pooled within-tier value. */
export const COPY_THRESHOLD = 0.98;
/** A surprise of kind (a) needs this pooled residual. */
export const SURPRISE_THRESHOLD = 0.5;
/** A tier contributes to the pool only with this many settlements holding both columns. */
export const MIN_TIER_N = 30;

/** The generation inputs a common cause is sought among (the corpus matrix, `corpus.mjs :: cellFor`). */
export const INPUT_PATHS = Object.freeze([
  'chain.culture', 'chain.terrain', 'chain.route', 'chain.magicScenario', 'chain.contentProfile', 'chain.monsterThreat',
  'chain.stressCell', 'config.priorityEconomy', 'config.priorityMilitary', 'config.priorityReligion', 'config.priorityCriminal',
  'config.priorityMagic',
]);
const isInput = (p) => INPUT_PATHS.includes(p) || /^config\.(?:culture|terrainType|tradeRouteAccess|monsterThreat|contentProfile|magicExists|stressType|terrainOverride)$/.test(p);

/** The leaf key of a walked path: its last key, the walk's own suffixes stripped. */
export function leafOf(path) {
  const bare = String(path).replace(/:(?:mean|rate|len|null)$/, '').replace(/\.#$/, '#').replace(/\[\]/g, '');
  const parts = bare.split('.');
  return parts[parts.length - 1];
}

/** The family a path belongs to (the first pass's own rule, kept so the two passes agree). */
export const familyOf = (p) => p.replace(/^chain\./, 'chain:').split(/[.[:]/).slice(0, 2).join('.');

/** Is the pair one value under two names? */
export function isCopy(a, b, pooledValue) {
  if (pooledValue != null && Math.abs(pooledValue) >= COPY_THRESHOLD) return { copy: true, why: `within-tier |v| ${Math.abs(pooledValue).toFixed(3)} ≥ ${COPY_THRESHOLD}` };
  if (leafOf(a) === leafOf(b)) return { copy: true, why: `same leaf "${leafOf(a)}"` };
  return { copy: false, why: '' };
}

const distinctCount = (xs) => new Set(xs.map(String)).size;

/**
 * Dependence of x on y within each tier, pooled n-weighted.
 * @param {Array<unknown>} x @param {Array<unknown>} y @param {string[]} tierOf (same index)
 * @returns {{ pooled: number|null, measure: string, n: number, byTier: Record<string, number> }}
 */
export function residualDependence(x, y, tierOf, minN = MIN_TIER_N) {
  const byTier = {};
  let sum = 0; let weight = 0; let measure = '-';
  for (const t of TIERS) {
    const xs = []; const ys = [];
    for (let k = 0; k < tierOf.length; k += 1) if (tierOf[k] === t && x[k] !== undefined && y[k] !== undefined) { xs.push(x[k]); ys.push(y[k]); }
    if (xs.length < minN || distinctCount(xs) < 2 || distinctCount(ys) < 2) continue;
    const d = dependence(xs, ys);
    byTier[t] = Math.round(d.value * 1000) / 1000;
    measure = d.measure;
    sum += d.value * xs.length; weight += xs.length;
  }
  return { pooled: weight ? Math.round((sum / weight) * 1000) / 1000 : null, measure, n: weight, byTier };
}

/** Cut a column into within-tier terciles (numeric) or keep it (categorical). */
function binned(col, tierOf) {
  const numeric = col.every((v) => v === undefined || typeof v === 'number');
  if (!numeric) return col.map((v) => (v === undefined ? undefined : String(v)));
  const out = new Array(col.length);
  for (const t of TIERS) {
    const idx = []; for (let k = 0; k < col.length; k += 1) if (tierOf[k] === t && col[k] !== undefined) idx.push(k);
    const sorted = idx.map((k) => col[k]).sort((a, b) => a - b);
    if (!sorted.length) continue;
    const lo = sorted[Math.floor(sorted.length / 3)]; const hi = sorted[Math.floor((2 * sorted.length) / 3)];
    for (const k of idx) out[k] = col[k] < lo ? 'low' : col[k] > hi ? 'high' : 'mid';
  }
  return out;
}

/**
 * Three witness seeds for a pair: the joint cell most over its expectation (≥ 5 settlements).
 * @returns {{ cell: string, ratio: number, count: number, seeds: string[] }}
 */
export function witnesses(x, y, tierOf, seeds) {
  const bx = binned(x, tierOf); const by = binned(y, tierOf);
  const cx = new Map(); const cy = new Map(); const cxy = new Map(); let n = 0;
  for (let k = 0; k < bx.length; k += 1) {
    if (bx[k] === undefined || by[k] === undefined) continue;
    n += 1; cx.set(bx[k], (cx.get(bx[k]) || 0) + 1); cy.set(by[k], (cy.get(by[k]) || 0) + 1);
    const key = `${bx[k]}\u0000${by[k]}`; const e = cxy.get(key) ?? { count: 0, ks: [] }; e.count += 1; if (e.ks.length < 3) e.ks.push(k); cxy.set(key, e);
  }
  let best = null;
  for (const [key, e] of cxy) {
    if (e.count < 5) continue;
    const [a, b] = key.split('\u0000');
    const ratio = e.count / ((cx.get(a) * cy.get(b)) / n);
    if (!best || ratio > best.ratio) best = { cell: `${a} × ${b}`, ratio: Math.round(ratio * 100) / 100, count: e.count, seeds: e.ks.map((k) => seeds[k]) };
  }
  return best ?? { cell: '', ratio: 0, count: 0, seeds: [] };
}

/**
 * The second pass.
 * @param {{ cand: string[], col: (p: string) => unknown[], tierOf: string[], seeds: string[], chains: ReadonlyArray<{id:string,from:string,to:string,expect:string,rule:string}>, rawPairs?: Map<string, number> }} input
 */
export function secondPass({ cand, col, tierOf, seeds, chains, rawPairs }) {
  const cols = new Map(cand.map((p) => [p, col(p)]));
  const chainKeys = new Set(chains.flatMap((c) => [`${c.from}\u0000${c.to}`, `${c.to}\u0000${c.from}`]));
  const N = tierOf.length;
  const residualPairs = []; const copies = [];
  for (let u = 0; u < cand.length; u += 1) {
    for (let v = u + 1; v < cand.length; v += 1) {
      const a = cand[u]; const b = cand[v];
      if (familyOf(a) === familyOf(b)) continue;
      const A = cols.get(a); const B = cols.get(b);
      let both = 0; for (let k = 0; k < N; k += 1) if (A[k] !== undefined && B[k] !== undefined) both += 1;
      if (both < N * 0.5) continue;
      const res = residualDependence(A, B, tierOf);
      if (res.pooled == null || Math.abs(res.pooled) < SURPRISE_THRESHOLD) continue;
      const key = `${a}\u0000${b}`;
      let raw = rawPairs?.get(key);
      if (raw === undefined) { const kk = []; for (let k = 0; k < N; k += 1) if (A[k] !== undefined && B[k] !== undefined) kk.push(k); raw = dependence(kk.map((k) => A[k]), kk.map((k) => B[k])).value; }
      const copy = isCopy(a, b, res.pooled);
      const row = { a, b, measure: res.measure, raw: Math.round(raw * 1000) / 1000, pooled: res.pooled, n: res.n, byTier: res.byTier, chain: chainKeys.has(key) };
      if (copy.copy) { copies.push({ ...row, why: copy.why }); continue; }
      residualPairs.push({ ...row, witness: witnesses(A, B, tierOf, seeds) });
    }
  }
  residualPairs.sort((p, q) => Math.abs(q.pooled) - Math.abs(p.pooled));
  copies.sort((p, q) => Math.abs(q.raw) - Math.abs(p.raw));
  const chainsResidual = chains.map((c) => {
    const x = col(c.from); const y = col(c.to);
    if (c.from === 'chain.tier' || c.to === 'chain.tier') return { id: c.id, from: c.from, to: c.to, rule: c.rule, expect: c.expect, pooled: null, measure: '-', n: 0, byTier: {}, verdict: 'no residual (tier is the cause)' };
    const res = residualDependence(x, y, tierOf);
    const v = res.pooled == null ? null : Math.abs(res.pooled);
    const verdict = v == null ? 'n/a' : c.expect === 'strong' ? (v >= 0.5 ? 'holds' : v >= 0.2 ? 'weak' : 'absent') : c.expect === 'present' ? (v >= 0.2 ? 'holds' : v >= 0.1 ? 'weak' : 'absent') : 'reported';
    return { id: c.id, from: c.from, to: c.to, rule: c.rule, expect: c.expect, ...res, verdict, witness: v == null ? null : witnesses(x, y, tierOf, seeds) };
  });
  // The common-input triage: which input each surprise's two sides both depend on.
  const inputs = INPUT_PATHS.filter((p) => { const c = col(p); return c && c.some((v) => v !== undefined); });
  const inputDep = new Map();
  const depOn = (input, path) => {
    const key = `${input}\u0000${path}`;
    if (!inputDep.has(key)) { const r = residualDependence(col(input), cols.get(path) ?? col(path), tierOf).pooled; inputDep.set(key, r == null ? 0 : Math.abs(r)); }
    return inputDep.get(key);
  };
  for (const p of residualPairs) {
    if (p.chain) continue;
    if (isInput(p.a) && isInput(p.b)) { p.commonInput = null; p.inputPair = true; continue; }
    let best = null;
    for (const input of inputs) {
      if (input === p.a || input === p.b) continue;
      const m = Math.min(depOn(input, p.a), depOn(input, p.b));
      if (m >= SURPRISE_THRESHOLD && (!best || m > best.m)) best = { input, m: Math.round(m * 1000) / 1000 };
    }
    p.commonInput = best;
  }
  const surprisesA = residualPairs.filter((p) => !p.chain);
  const surprisesB = chainsResidual.filter((c) => c.verdict === 'weak' || c.verdict === 'absent');
  return { residualPairs, copies, chainsResidual, surprisesA, surprisesB };
}
