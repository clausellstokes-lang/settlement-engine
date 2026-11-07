/**
 * scripts/audit/soak-review/aggregate.mjs — the corpus "in aggregate": finding classes, every
 * field alone by tier, the engine's chains, the dependence scan over all pairs, repetition
 * across the corpus, and the STOP / CLIMB line. Reads `<out>/shards/*.jsonl`, writes
 * `<out>/findings.jsonl`, `<out>/settlements.jsonl`, `<out>/aggregates/*` and `<out>/run.json`.
 */
import { readFileSync, readdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

import { KIND_OF, OWNER_BANDS, CHAIR_READINGS, READER_KIND, isReaderCheck } from './checks.mjs';
import { CHAINS } from './chains.mjs';
import { dependence } from './dependence-measures.mjs';
import { secondPass } from './dependence.mjs';
import { pairwiseRepeat, sourcePoolOf } from './prose.mjs';
import { bandReadings } from './bands.mjs';
import { REPO_ROOT } from './renderHarness.mjs';

const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const KIND_NAMES = ['none', 'food', 'faith', 'magic', 'defence', 'rulers', 'repetition', 'unnamed', 'small-as-town', 'reader'];

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

export { spearman, cramersV, eta, dependence } from './dependence-measures.mjs';

/**
 * @param {string} out the output directory
 * @param {object} meta spread first into run.json
 * @param {() => Iterable<any>} [source] the rows, in run order; a single run reads its own
 *   `<out>/shards/*.jsonl` (the default). The merge driver (scripts/audit/soak-merge.mjs) passes
 *   the union of N shard runs' moved files instead, ordered as one run would have read them.
 */
export function aggregate(out, meta, source = () => shardLines(out)) {
  const rows = [];
  writeFileSync(join(out, 'findings.jsonl'), '');
  writeFileSync(join(out, 'settlements.jsonl'), '');
  const fBuf = []; const sBuf = [];
  const flush = () => { if (fBuf.length) appendFileSync(join(out, 'findings.jsonl'), fBuf.splice(0).join('')); if (sBuf.length) appendFileSync(join(out, 'settlements.jsonl'), sBuf.splice(0).join('')); };
  const sentenceTowns = new Map(); const sentenceText = {};
  const storyText = {}; const storyRows = [];
  const fieldVals = new Map(); // path → array per row index (sparse)
  const cats = new Map(); // path → tier → value → count
  const classes = new Map();
  let errors = 0;
  // ── the READER battery's observations, apart (kind 9; lane READER-INSTRUMENTS, 2026-11-04)
  const reader = new Map(); const readerTierPool = {}; const exportsByTier = {}; const dailyLineByTier = {}; const a05Seeds = new Set();
  const readerFinding = (row, f) => {
    const c = reader.get(f.check) ?? { check: f.check, occurrences: 0, seeds: new Set(), byTier: {}, surfaces: {}, sub: {}, cases: [] };
    reader.set(f.check, c);
    // Every leading [tag] is a sub-case ("[no-market][no-watch] …" counts in both). A [~tag] is a
    // COLUMN only (the chair's rulings Q1, Q3): a finding whose every tag is one counts in its
    // column and never in the class's line.
    const tags = [...(String(f.detail || '').match(/^(?:\[~?[a-z0-9-]+\])+/)?.[0] ?? '').matchAll(/\[(~?[a-z0-9-]+)\]/g)].map((m) => m[1]);
    for (const tag of tags) { const t = (c.sub[tag] ??= { seeds: new Set(), byTier: {} }); if (!t.seeds.has(row.seed)) { t.seeds.add(row.seed); t.byTier[row.tier] = (t.byTier[row.tier] || 0) + 1; } }
    if (tags.length && tags.every((x) => x.startsWith('~'))) return;
    c.occurrences += 1; c.surfaces[f.surface] = (c.surfaces[f.surface] || 0) + 1;
    if (!c.seeds.has(row.seed)) { c.seeds.add(row.seed); c.byTier[row.tier] = (c.byTier[row.tier] || 0) + 1; if (c.cases.length < 3) c.cases.push({ seed: row.seed, tier: row.tier, surface: f.surface, quote: f.quote, detail: f.detail }); }
  };
  const readerPool = (row) => {
    readerTierPool[row.tier] = (readerTierPool[row.tier] || 0) + 1;
    if ((row.findings || []).some((f) => f.check === 'A-05:lacks-access-lines')) a05Seeds.add(row.seed);
    const n = row.reader?.exports; if (Number.isFinite(n)) (exportsByTier[row.tier] ??= []).push(n);
    if (row.reader?.dailyLifeLine) dailyLineByTier[row.tier] = (dailyLineByTier[row.tier] || 0) + 1;
  };
  for (const row of source()) {
    const k = rows.length;
    if (row.error) errors += 1;
    for (const f of row.findings || []) {
      fBuf.push(`${JSON.stringify({ seed: row.seed, ...f })}\n`);
      // Kind 9 (reader) is counted apart: never a finding class, never read by the stop rule.
      if (isReaderCheck(f.check)) { readerFinding(row, f); continue; }
      const c = classes.get(f.check) ?? { check: f.check, kind: KIND_OF[f.check] ?? (f.check.startsWith('cert:') || f.check.startsWith('render:') ? -1 : 0), occurrences: 0, seeds: new Set(), byTier: {}, surfaces: {}, cases: [] };
      c.occurrences += 1; c.surfaces[f.surface] = (c.surfaces[f.surface] || 0) + 1;
      if (!c.seeds.has(row.seed)) { c.seeds.add(row.seed); c.byTier[row.tier] = (c.byTier[row.tier] || 0) + 1; if (c.cases.length < 3) c.cases.push({ seed: row.seed, tier: row.tier, surface: f.surface, quote: f.quote, detail: f.detail }); }
      classes.set(f.check, c);
    }
    const checks = {}; for (const f of row.findings || []) checks[f.check] = (checks[f.check] || 0) + 1;
    const readerCount = (row.findings || []).filter((f) => isReaderCheck(f.check)).length;
    sBuf.push(`${JSON.stringify({ i: row.i, seed: row.seed, tier: row.tier, population: row.population, stressCell: row.stressCell, matrix: row.matrix, hashes: row.hashes, rendered: row.rendered, replay: row.replay, error: row.error ?? null, findingCount: (row.findings || []).length - readerCount, readerCount, checks })}\n`);
    if (row.rendered) readerPool(row);
    for (const h of row.sentences || []) sentenceTowns.set(h, (sentenceTowns.get(h) || 0) + 1);
    Object.assign(sentenceText, row.texts || {});
    Object.assign(storyText, row.storyTexts || {});
    if (row.rendered && row.story) { const items = row.story.items || []; storyRows.push({ seed: row.seed, tier: row.tier, items, exact: items.map((x) => x[0]), skel: [...new Set(items.map((x) => x[1]))], hooks: row.story.hooks || [] }); }
    const scalars = { ...(row.features?.scalars || {}), ...(row.chains || {}) };
    for (const [p, v] of Object.entries(scalars)) { if (v === null || v === undefined) continue; let a = fieldVals.get(p); if (!a) { a = []; fieldVals.set(p, a); } a[k] = v; }
    for (const [p, vs] of Object.entries(row.features?.cats || {})) { const byT = cats.get(p) ?? {}; const t = (byT[row.tier] ??= {}); for (const [v, n] of Object.entries(vs)) t[v] = (t[v] || 0) + n; cats.set(p, byT); }
    if (fBuf.length > 5000) flush();
    rows.push({ i: row.i, seed: row.seed, tier: row.tier, sentences: row.sentences?.length ?? 0, rendered: row.rendered, sentenceHashes: row.sentences || [], houses: row.houses });
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

  // ── the READER table: class · settlements/N · rate · byTier · sub-cases · three cases; the
  // Exports count by tier as a distribution; A-05's overlap with the Gaps sub-case.
  const readerN = Object.values(readerTierPool).reduce((a, b) => a + b, 0);
  const readerRows = [...reader.values()].map((c) => ({
    check: c.check, kind: READER_KIND, kindName: KIND_NAMES[READER_KIND], settlements: c.seeds.size, pool: readerN, rate: r3(c.seeds.size / Math.max(1, readerN)),
    occurrences: c.occurrences, byTier: c.byTier, surfaces: c.surfaces,
    subCases: Object.fromEntries(Object.entries(c.sub).map(([k, v]) => [k, { settlements: v.seeds.size, byTier: v.byTier }])),
    ...(c.sub.gaps ? { a05Overlap: { gapsAndA05: [...c.sub.gaps.seeds].filter((x) => a05Seeds.has(x)).length, a05Only: [...a05Seeds].filter((x) => !c.sub.gaps.seeds.has(x)).length, gapsOnly: [...c.sub.gaps.seeds].filter((x) => !a05Seeds.has(x)).length, withoutGaps: [...c.seeds].filter((x) => !c.sub.gaps.seeds.has(x)).length } } : {}),
    cases: c.cases,
  })).sort((a, b) => b.rate - a.rate || a.check.localeCompare(b.check));
  const dist = (xs) => { const v = xs.slice().sort((a, b) => a - b); const hist = {}; for (const x of v) hist[x] = (hist[x] || 0) + 1; return { n: v.length, min: v[0] ?? null, p10: q(v, 0.1), median: q(v, 0.5), p90: q(v, 0.9), max: v[v.length - 1] ?? null, histogram: hist }; };
  const readerOut = { title: 'Reader observations (outside the stop rule until the READER WINDOW lands)', rendered: readerN, tierPool: readerTierPool, classes: readerRows, distributions: { exportsLineItems: Object.fromEntries(TIERS.filter((t) => exportsByTier[t]).map((t) => [t, dist(exportsByTier[t])])), dailyLifeLinePages: { settlements: Object.values(dailyLineByTier).reduce((a, b) => a + b, 0), byTier: dailyLineByTier } } };
  writeFileSync(join(out, 'aggregates', 'reader-observations.json'), `${JSON.stringify(readerOut, null, 1)}\n`);

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

  // ── every field by tier with the owner's bands marked where they exist (bands.mjs)
  const banded = bandReadings(fields, col, tierOf, rows.map((r) => r.houses));
  for (const r of banded.rows) { const f = fields.find((x) => x.path === r.path); if (f) f.band = { name: r.band, source: r.source, byTier: Object.fromEntries(Object.entries(r.byTier).map(([t, b]) => [t, { band: b.band, medianInside: b.medianInside, outsideShare: b.outsideShare }])) }; }
  writeFileSync(join(out, 'aggregates', 'fields.json'), `${JSON.stringify(fields)}\n`);
  writeFileSync(join(out, 'aggregates', 'field-bands.json'), `${JSON.stringify(banded, null, 1)}\n`);

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
  const rawPairs = new Map();
  for (let u = 0; u < cand.length; u += 1) {
    for (let v = u + 1; v < cand.length; v += 1) {
      if (family(cand[u]) === family(cand[v])) continue;
      const keep = []; const A = cols[u]; const B = cols[v];
      for (let k = 0; k < N; k += 1) if (A[k] !== undefined && B[k] !== undefined) keep.push(k);
      if (keep.length < N * 0.5) continue;
      const d = dependence(keep.map((k) => A[k]), keep.map((k) => B[k]));
      rawPairs.set(`${cand[u]}\u0000${cand[v]}`, d.value);
      if (Math.abs(d.value) >= 0.5) pairs.push({ a: cand[u], b: cand[v], measure: d.measure, value: r3(d.value), n: keep.length, seeds: keep.slice(0, 3).map((k) => rows[k].seed) });
    }
  }
  pairs.sort((x, y) => Math.abs(y.value) - Math.abs(x.value));
  writeFileSync(join(out, 'aggregates', 'dependence-strong.json'), `${JSON.stringify({ candidates: cand.length, strongPairs: pairs.length, pairs: pairs.slice(0, 2000) })}\n`);

  // ── the second pass: within tier, copies apart, the chains on the residual (dependence.mjs)
  const second = secondPass({ cand, col, tierOf, seeds: rows.map((r) => r.seed), chains: CHAINS, rawPairs });
  writeFileSync(join(out, 'aggregates', 'dependence-residual.json'), `${JSON.stringify({
    candidates: cand.length, residualPairs: second.residualPairs.length, copies: second.copies.length,
    surprisesA: second.surprisesA.length, surprisesB: second.surprisesB.length,
    surprisesAList: second.surprisesA.slice(0, 5000), surprisesBList: second.surprisesB,
    chainsResidual: second.chainsResidual, copiesList: second.copies.slice(0, 2000),
  })}\n`);

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

  // ── repetition, prose only (prose.mjs: the surface filter and the audit's pairwise figure)
  const pw = (key) => { const r = pairwiseRepeat(storyRows.map((x) => ({ seed: x.seed, tier: x.tier, sentences: x[key] || [] }))); return { all: r3(r.all), sameTier: r3(r.sameTier), maxSameTier: r3(r.maxSameTier), maxPair: r.maxPair, byTier: Object.fromEntries(Object.entries(r.byTier).map(([t, v]) => [t, r3(v)])), towns: r.towns }; };
  const skelTowns = new Map(); for (const x of storyRows) for (const h of x.skel || []) skelTowns.set(h, (skelTowns.get(h) || 0) + 1);
  const storyTowns = storyRows.length;
  const sharedSkel = [...skelTowns].filter(([, n]) => n >= Math.max(3, storyTowns * 0.1)).sort((a, b) => b[1] - a[1]);
  const perTownStory = storyRows.map((x) => { const n = (x.skel || []).length; return { tier: x.tier, n, shared: n ? (x.skel.filter((h) => (skelTowns.get(h) || 0) >= Math.max(3, storyTowns * 0.1)).length / n) : 0 }; });
  const medianOf = (xs) => r3(q(xs.slice().sort((a, b) => a - b), 0.5));
  // The tabs' own copy: a widely shared skeleton whose words live in a tab component's JSX
  // (src/components/), not in a pool or a generator. Set aside by its SOURCE, then re-measured.
  const sources = new Map(sharedSkel.map(([h]) => [h, storyText[h] ? sourcePoolOf(storyText[h].s, REPO_ROOT) : null]));
  const chrome = new Set(sharedSkel.filter(([h]) => sources.get(h)?.file?.startsWith('src/components/')).map(([h]) => h));
  for (const x of storyRows) x.story = x.items.filter(([, h]) => !chrome.has(h)).map(([e]) => e);
  const prose = {
    chromeSkeletons: [...chrome].map((h) => ({ skeleton: storyText[h]?.s ?? '', towns: skelTowns.get(h), source: sources.get(h) })),
    definition: 'story sentences: <p> at body size (≥ 12px or unset) on the 20 screen tabs and the Tonight sheet; complete sentences of ≥ 6 words; word for word after normalizeRenderedSentence (prose.mjs)',
    towns: storyTowns,
    medianStorySentencesPerTown: medianOf(storyRows.map((x) => (x.exact || []).length)),
    exact: pw('exact'), story: pw('story'), skeleton: pw('skel'), hooks: pw('hooks'),
    distinctSkeletons: skelTowns.size, skeletonsInTenPercent: sharedSkel.length,
    medianShareOfTownInTenPercentSkeletons: medianOf(perTownStory.map((x) => x.shared)),
    top: sharedSkel.slice(0, 40).map(([h, n]) => ({ towns: n, rate: r3(n / storyTowns), tab: storyText[h]?.tab ?? '', skeleton: storyText[h]?.s ?? '', chrome: chrome.has(h), source: sources.get(h) ?? null })),
  };
  writeFileSync(join(out, 'aggregates', 'repetition-prose.json'), `${JSON.stringify(prose, null, 1)}\n`);

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
  const summary = { ...meta, settlements: N, rendered: towns, errors, findings: classRows.reduce((s, c) => s + c.occurrences, 0), classes: classRows.length, fieldsWalked: fieldVals.size, fieldsReported: fields.length, fieldsExcluded: excluded, dependenceCandidates: cand.length, strongCrossFamilyPairs: pairs.length, mediansOutsideBands: banded.outside.map((x) => `${x.path} ${x.tier} ${x.median} (band ${x.low}–${x.high})`), proseRepetition: { storyPairwise: prose.story.all, storySameTier: prose.story.sameTier, exactPairwise: prose.exact.all, exactSameTier: prose.exact.sameTier, hooksPairwise: prose.hooks.all, skeletonsInTenPercent: prose.skeletonsInTenPercent }, residual: { pairs: second.residualPairs.length, copies: second.copies.length, surprisesA: second.surprisesA.length, surprisesB: second.surprisesB.length }, verdict, reasons, chairReadings: CHAIR_READINGS, bands: OWNER_BANDS, reader: { classes: readerRows.length, findings: readerRows.reduce((a, c) => a + c.occurrences, 0), note: 'kind 9, outside the stop rule' } };
  writeFileSync(join(out, 'run.json'), `${JSON.stringify(summary, null, 1)}\n`);
  return summary;
}
