/**
 * scripts/audit/soak-review/dependence-measures.mjs — the dependence measures the soak's scans
 * share (moved out of aggregate.mjs by lane SOAK-2 so the second pass can read them without
 * the battery): Spearman on ranks, bias-corrected Cramér's V, the correlation ratio η, and
 * `dependence`, which picks one by the two columns' kinds. Pure.
 */
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
