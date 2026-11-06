/**
 * scripts/audit/soak-review/aggregate.mjs — the corpus "in aggregate": finding classes, every
 * field alone by tier, the engine's chains, the dependence scan over all pairs, repetition
 * across the corpus, and the STOP / CLIMB line. Reads `<out>/shards/*.jsonl`, writes
 * `<out>/findings.jsonl`, `<out>/settlements.jsonl`, `<out>/aggregates/*` and `<out>/run.json`.
 */
import { readFileSync, readdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

import { KIND_OF, OWNER_BANDS, CHAIR_READINGS } from './checks.mjs';
import { CHAINS } from './chains.mjs';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const KIND_NAMES = ['none', 'food', 'faith', 'magic', 'defence', 'rulers', 'repetition', 'unnamed', 'small-as-town'];

function* shardLines(out) {
  const dir = join(out, 'shards');
  const seen = new Set();
  for (const f of readdirSync(dir).sort()) {
    for (const l of readFileSync(join(dir, f), 'utf-8').split('\n')) {
      if (!l) continue;
      let row; try { row = JSON.parse(l); } catch { continue; }
      if (seen.has(row.i)) continue;
      seen.add(row.i);
      yield row;
    }
  }
}

const q = (sorted, p) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))))] : null);
const r3 = (x) => (x == null || !Number.isFinite(x) ? x : Math.round(x * 1000) / 1000);

// ── dependence measures
function ranks(xs) {
  const idx = xs.map((x, k) => [x, k]).sort((a, b) => a[0] - b[0]);
  const r = new Array(xs.length);
  for (let a = 0; a < idx.length;) { let b = a; while (b + 1 < idx.length && idx[b + 1][0] === idx[a][0]) b += 1; const avg = (a + b) / 2; for (let k = a; k <= b; k += 1) r[idx[k][1]] = avg; a = b + 1; }
  return r;
}
function pearson(x, y) {
  const n = x.length; let mx = 0; let my = 0; for (let k = 0; k < n; k += 1) { mx += x[k]; my += y[k]; } mx /= n; my /= n;
  let sxy = 0; let sxx = 0; let syy = 0; for (let k = 0; k < n; k += 1) { const a = x[k] - mx; const b = y[k] - my; sxy += a * b; sxx += a * a; syy += b * b; }
  return sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
}
export const spearman = (x, y) => pearson(ranks(x), ranks(y));
/** Bias-corrected Cramér's V (Bergsma 2013). */
export function cramersV(a, b) {
  const n = a.length; const ta = new Map(); const tb = new Map(); const tab = new Map();
  for (let k = 0; k < n; k += 1) { ta.set(a[k], (ta.get(a[k]) || 0) + 1); tb.set(b[k], (tb.get(b[k]) || 0) + 1); const key = `${a[k]}\u0000${b[k]}`; tab.set(key, (tab.get(key) || 0) + 1); }
  const r = ta.size; const c = tb.size; if (r < 2 || c < 2) return 0;
  let chi = 0;
  for (const [va, na] of ta) for (const [vb, nb] of tb) { const e = (na * nb) / n; const o = tab.get(`${va}\u0000${vb}`) || 0; chi += ((o - e) ** 2) / e; }
  const phi2 = chi / n; const phi2c = Math.max(0, phi2 - ((r - 1) * (c - 1)) / (n - 1));
  const rc = r - ((r - 1) ** 2) / (n - 1); const cc = c - ((c - 1) ** 2) / (n - 1);
  const d = Math.min(rc - 1, cc - 1); return d > 0 ? Math.sqrt(phi2c / d) : 0;
}
/** Correlation ratio η of a numeric on a categorical (for a binary, |point-biserial|), on ranks. */
export function eta(cat, num) {
  const r = ranks(num); const n = r.length; const m = r.reduce((s, x) => s + x, 0) / n; const g = new Map();
  for (let k = 0; k < n; k += 1) { const e = g.get(cat[k]) || [0, 0]; e[0] += r[k]; e[1] += 1; g.set(cat[k], e); }
  if (g.size < 2) return 0;
  let between = 0; for (const [s, c] of g.values()) between += c * ((s / c - m) ** 2);
  let total = 0; for (const x of r) total += (x - m) ** 2;
  return total ? Math.sqrt(between / total) : 0;
}

/** One relationship between two columns, by their kinds. */
export function dependence(x, y) {
  const nx = x.every((v) => typeof v === 'number'); const ny = y.every((v) => typeof v === 'number');
  if (nx && ny) return { measure: 'spearman', value: spearman(x, y) };
  if (!nx && !ny) return { measure: 'cramersV', value: cramersV(x.map(String), y.map(String)) };
  return nx ? { measure: 'eta', value: eta(y.map(String), x) } : { measure: 'eta', value: eta(x.map(String), y) };
}

export function aggregate(out, meta) {
  const rows = [];
  writeFileSync(join(out, 'findings.jsonl'), '');
  writeFileSync(join(out, 'settlements.jsonl'), '');
  const fBuf = []; const sBuf = [];
  const flush = () => { if (fBuf.length) appendFileSync(join(out, 'findings.jsonl'), fBuf.splice(0).join('')); if (sBuf.length) appendFileSync(join(out, 'settlements.jsonl'), sBuf.splice(0).join('')); };
  const sentenceTowns = new Map(); const sentenceText = {};
  const fieldVals = new Map(); // path → array per row index (sparse)
  const cats = new Map(); // path → tier → value → count
  const classes = new Map();
  let errors = 0;
  for (const row of shardLines(out)) {
    const k = rows.length;
    if (row.error) errors += 1;
    for (const f of row.findings || []) {
      fBuf.push(`${JSON.stringify({ seed: row.seed, ...f })}\n`);
      const c = classes.get(f.check) ?? { check: f.check, kind: KIND_OF[f.check] ?? (f.check.startsWith('cert:') || f.check.startsWith('render:') ? -1 : 0), occurrences: 0, seeds: new Set(), byTier: {}, surfaces: {}, cases: [] };
      c.occurrences += 1; c.surfaces[f.surface] = (c.surfaces[f.surface] || 0) + 1;
      if (!c.seeds.has(row.seed)) { c.seeds.add(row.seed); c.byTier[row.tier] = (c.byTier[row.tier] || 0) + 1; if (c.cases.length < 3) c.cases.push({ seed: row.seed, tier: row.tier, surface: f.surface, quote: f.quote, detail: f.detail }); }
      classes.set(f.check, c);
    }
    const checks = {}; for (const f of row.findings || []) checks[f.check] = (checks[f.check] || 0) + 1;
    sBuf.push(`${JSON.stringify({ i: row.i, seed: row.seed, tier: row.tier, population: row.population, stressCell: row.stressCell, matrix: row.matrix, hashes: row.hashes, rendered: row.rendered, replay: row.replay, error: row.error ?? null, findingCount: (row.findings || []).length, checks })}\n`);
    for (const h of row.sentences || []) sentenceTowns.set(h, (sentenceTowns.get(h) || 0) + 1);
    Object.assign(sentenceText, row.texts || {});
    const scalars = { ...(row.features?.scalars || {}), ...(row.chains || {}) };
    for (const [p, v] of Object.entries(scalars)) { if (v === null || v === undefined) continue; let a = fieldVals.get(p); if (!a) { a = []; fieldVals.set(p, a); } a[k] = v; }
    for (const [p, vs] of Object.entries(row.features?.cats || {})) { const byT = cats.get(p) ?? {}; const t = (byT[row.tier] ??= {}); for (const [v, n] of Object.entries(vs)) t[v] = (t[v] || 0) + n; cats.set(p, byT); }
    if (fBuf.length > 5000) flush();
    rows.push({ i: row.i, seed: row.seed, tier: row.tier, sentences: row.sentences?.length ?? 0, rendered: row.rendered, sentenceHashes: row.sentences || [] });
  }
  flush();
  const N = rows.length;
  const tierOf = rows.map((r) => r.tier);

  // ── finding classes, ranked by rate × reach (reach = surfaces touched)
  const classRows = [...classes.values()].map((c) => {
    const pool = Object.keys(c.surfaces).every((x) => x === 'record') ? N : rows.filter((r) => r.rendered).length;
    const rate = c.seeds.size / Math.max(1, pool);
    return { check: c.check, kind: c.kind, kindName: c.kind >= 0 ? KIND_NAMES[c.kind] : c.kind === -2 ? 'informational' : 'certification', settlements: c.seeds.size, pool, rate: r3(rate), occurrences: c.occurrences, reach: Object.keys(c.surfaces).length, score: r3(rate * Object.keys(c.surfaces).length), byTier: c.byTier, surfaces: c.surfaces, cases: c.cases };
  }).sort((a, b) => b.score - a.score || b.rate - a.rate);
  writeFileSync(join(out, 'aggregates', 'finding-classes.json'), `${JSON.stringify(classRows, null, 1)}\n`);

  // ── every field alone, by tier
  const fields = [];
  const excluded = { sparse: 0, constant: 0 };
  for (const [p, a] of fieldVals) {
    const present = a.filter((v) => v !== undefined).length;
    if (present < N * 0.01) { excluded.sparse += 1; continue; }
    const vals = a.filter((v) => v !== undefined);
    const numeric = vals.every((v) => typeof v === 'number');
    const distinct = new Set(vals.map(String)).size;
    if (distinct < 2 && present === N) { excluded.constant += 1; continue; }
    const byTier = {};
    for (const t of TIERS) {
      const tv = []; let tn = 0;
      for (let k = 0; k < N; k += 1) if (tierOf[k] === t) { tn += 1; if (a[k] !== undefined) tv.push(a[k]); }
      if (numeric) { const s = tv.slice().sort((x, y) => x - y); byTier[t] = { presence: r3(tv.length / Math.max(1, tn)), min: r3(s[0]), p1: r3(q(s, 0.01)), p10: r3(q(s, 0.1)), median: r3(q(s, 0.5)), p90: r3(q(s, 0.9)), p99: r3(q(s, 0.99)), max: r3(s[s.length - 1]) }; } else { const c = {}; for (const v of tv) c[String(v)] = (c[String(v)] || 0) + 1; byTier[t] = { presence: r3(tv.length / Math.max(1, tn)), counts: distinct <= 40 ? c : { distinct: Object.keys(c).length } }; }
    }
    fields.push({ path: p, kind: numeric ? 'numeric' : distinct <= 40 ? 'categorical' : 'high-cardinality', presence: r3(present / N), distinct, byTier });
  }
  fields.sort((x, y) => x.path.localeCompare(y.path));
  writeFileSync(join(out, 'aggregates', 'fields.json'), `${JSON.stringify(fields)}\n`);
  writeFileSync(join(out, 'aggregates', 'inner-categories.json'), `${JSON.stringify(Object.fromEntries([...cats].filter(([, byT]) => Object.values(byT).some((t) => Object.keys(t).length <= 60))))}\n`);

  // ── the engine's chains, as the relationship each rule promises
  const col = (p) => { const a = fieldVals.get(p) || []; return rows.map((_, k) => a[k]); };
  const chainRows = CHAINS.map((ch) => {
    const x = col(ch.from); const y = col(ch.to);
    const keep = rows.map((_, k) => k).filter((k) => x[k] !== undefined && y[k] !== undefined && (!ch.where || ch.where(rows[k], k, col)));
    const d = keep.length > 10 ? dependence(keep.map((k) => x[k]), keep.map((k) => y[k])) : { measure: '-', value: null };
    const within = {};
    if (ch.withinTier) for (const t of TIERS) { const kk = keep.filter((k) => tierOf[k] === t); if (kk.length > 10) within[t] = r3(dependence(kk.map((k) => x[k]), kk.map((k) => y[k])).value); }
    const verdict = d.value == null ? 'n/a' : ch.expect === 'strong' ? (Math.abs(d.value) >= 0.5 ? 'holds' : Math.abs(d.value) >= 0.2 ? 'weak' : 'absent') : ch.expect === 'present' ? (Math.abs(d.value) >= 0.2 ? 'holds' : Math.abs(d.value) >= 0.1 ? 'weak' : 'absent') : 'reported';
    return { id: ch.id, from: ch.from, to: ch.to, rule: ch.rule, expect: ch.expect, n: keep.length, measure: d.measure, value: r3(d.value), within, verdict, note: ch.note ?? '' };
  });
  writeFileSync(join(out, 'aggregates', 'chains.json'), `${JSON.stringify(chainRows, null, 1)}\n`);

  // ── the dependence scan over all pairs of reasonable cardinality
  const cand = [];
  for (const f of fields) {
    if (f.presence < 0.9) continue;
    if (f.kind === 'high-cardinality') continue;
    if (f.kind === 'categorical' && (f.distinct > 30 || f.distinct < 2)) continue;
    if (f.kind === 'numeric' && f.distinct < 3) continue;
    cand.push(f.path);
  }
  const family = (p) => p.replace(/^chain\./, 'chain:').split(/[.[:]/).slice(0, 2).join('.');
  const cols = cand.map((p) => { const a = col(p); return a; });
  const pairs = [];
  for (let u = 0; u < cand.length; u += 1) {
    for (let v = u + 1; v < cand.length; v += 1) {
      if (family(cand[u]) === family(cand[v])) continue;
      const keep = []; const A = cols[u]; const B = cols[v];
      for (let k = 0; k < N; k += 1) if (A[k] !== undefined && B[k] !== undefined) keep.push(k);
      if (keep.length < N * 0.5) continue;
      const d = dependence(keep.map((k) => A[k]), keep.map((k) => B[k]));
      if (Math.abs(d.value) >= 0.5) pairs.push({ a: cand[u], b: cand[v], measure: d.measure, value: r3(d.value), n: keep.length, seeds: keep.slice(0, 3).map((k) => rows[k].seed) });
    }
  }
  pairs.sort((x, y) => Math.abs(y.value) - Math.abs(x.value));
  writeFileSync(join(out, 'aggregates', 'dependence-strong.json'), `${JSON.stringify({ candidates: cand.length, strongPairs: pairs.length, pairs: pairs.slice(0, 2000) })}\n`);

  // ── repetition across the corpus
  const rendered = rows.filter((r) => r.rendered);
  const towns = rendered.length;
  const shared = [...sentenceTowns].filter(([, n]) => n >= Math.max(3, towns * 0.1)).sort((a, b) => b[1] - a[1]);
  const sharedSet = new Set(shared.map(([h]) => h));
  const perTown = rendered.map((r) => (r.sentences ? r.sentenceHashes.filter((h) => sharedSet.has(h)).length / r.sentences : 0)).sort((a, b) => a - b);
  const seenElsewhere = rendered.map((r) => (r.sentences ? r.sentenceHashes.filter((h) => (sentenceTowns.get(h) || 0) > 1).length / r.sentences : 0)).sort((a, b) => a - b);
  const repetition = {
    towns, distinctSentences: sentenceTowns.size,
    sharedByTenPercent: shared.length,
    medianShareOfTownInTenPercentSentences: r3(q(perTown, 0.5)),
    medianShareOfTownSeenInAnotherTown: r3(q(seenElsewhere, 0.5)), p90ShareSeenElsewhere: r3(q(seenElsewhere, 0.9)),
    top: shared.slice(0, 60).map(([h, n]) => ({ towns: n, rate: r3(n / towns), sentence: sentenceText[h] })),
  };
  writeFileSync(join(out, 'aggregates', 'repetition.json'), `${JSON.stringify(repetition, null, 1)}\n`);

  // ── STOP / CLIMB (the chair's stop rule)
  const reasons = [];
  for (const c of classRows) {
    if (c.kind === -1 && c.settlements > 0) reasons.push(`failure: ${c.check} in ${c.settlements}`);
    else if (c.check.startsWith('X-46') && c.settlements > 0) reasons.push(`figure outside the owner's bands: ${c.settlements} settlements`);
    else if (c.kind === 6 && c.rate > 0.01) reasons.push(`repetition: ${c.check} at ${c.rate}`);
    else if (c.kind >= 1 && c.kind !== 6 && c.settlements >= 3) reasons.push(`kind ${c.kind} (${KIND_NAMES[c.kind]}): ${c.check} in ${c.settlements}`);
    else if (c.kind === 0 && c.rate > 0.01) reasons.push(`wording: ${c.check} at ${c.rate}`);
  }
  const verdict = reasons.length ? 'STOP' : 'CLIMB';
  const summary = { ...meta, settlements: N, rendered: towns, errors, findings: classRows.reduce((s, c) => s + c.occurrences, 0), classes: classRows.length, fieldsWalked: fieldVals.size, fieldsReported: fields.length, fieldsExcluded: excluded, dependenceCandidates: cand.length, strongCrossFamilyPairs: pairs.length, verdict, reasons, chairReadings: CHAIR_READINGS, bands: OWNER_BANDS };
  writeFileSync(join(out, 'run.json'), `${JSON.stringify(summary, null, 1)}\n`);
  return summary;
}
