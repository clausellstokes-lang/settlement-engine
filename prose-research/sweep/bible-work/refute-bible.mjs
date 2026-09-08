// ADVERSARIAL re-derivation of §5's AXIS B. Rebuilds the bible exemplar corpus with a SURFACE tag,
// then recomputes the distance ranking under construction variants, against the SAME register metrics.
import { readFileSync } from 'node:fs';
import path from 'node:path';
const P = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/prose-research/probe-all';
const { measure, segments } = await import(path.join(P, 'metrics.mjs'));
const D = process.argv[2], W = process.argv[3];
const src = readFileSync(path.join(D, 'docs/VOICE_AND_TONE.md'), 'utf8');
const lines = src.split('\n');
const strip = (s) => s.trim().replace(/^[“"']+/, '').replace(/[”"']+$/, '').replace(/\s+/g, ' ').trim();
const good = [];
const add = (text, tag, surface) => { const t = strip(text); if (t.length >= 12 && /[a-z]/.test(t)) good.push({ text: t, pool: tag, surface }); };
{ const i = lines.findIndex((l) => /^## 1\. The Voice, in One Paragraph/.test(l));
  const j = lines.findIndex((l, k) => k > i && /^---/.test(l));
  const para = lines.slice(i + 1, j).join(' ').replace(/\*\*/g, '').trim();
  for (const s of segments(para)) add(s, 'B1', 'META-DESCRIPTION'); }
for (const l of lines) { const m = /^- Do(?: \([^)]*\))?: "(.+?)"\s*(?:\(.*\))?$/.exec(l.trim());
  if (m) for (const s of segments(m[1])) add(s, 'B2', 'PILLAR'); }
for (const l of lines) { if (!/^\|/.test(l) || !/→/.test(l)) continue;
  const cells = l.split('|').map((c) => c.trim());
  const surface = (cells[1] || '').replace(/\*\*/g, '').replace(/\s*\(.*\)$/, '').trim() || 'PLAYBOOK';
  for (const c of cells) { if (!/→/.test(c)) continue; const parts = c.split('→'); const after = parts[parts.length - 1];
    for (const q of (after.match(/"([^"]+)"/g) || [])) for (const s of segments(q.slice(1, -1))) add(s, 'B3/B4', surface); } }
{ const i = lines.findIndex((l) => /^## 5\. Immersion Doctrine/.test(l));
  const j = lines.findIndex((l, k) => k > i && /^## 6\./.test(l));
  for (const l of lines.slice(i, j)) { if (!/^\d+\. /.test(l.trim())) continue;
    for (const q of (l.match(/"([^"]+)"/g) || [])) for (const s of segments(q.slice(1, -1))) add(s, 'B4b', 'DOCTRINE-QUOTE'); } }
const seen = new Set(); const G = good.filter((r) => { const k = r.text.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; });
console.log('rebuilt exemplar n =', G.length, '(published 67)');
const bySurface = {}; for (const r of G) (bySurface[r.surface] ||= []).push(r);
console.log('\n=== SURFACE COMPOSITION OF THE 67 ===');
for (const [s, l] of Object.entries(bySurface).sort((a, b) => b[1].length - a[1].length)) console.log(String(l.length).padStart(3), s);

// chrome vs diegetic, by the bible's OWN §4 surface names
const CHROME = /META-DESCRIPTION|Home \/ landing|Pricing|Gallery|Account|Compendium|Core copy registry|Generate wizard|Dossier shell|Map \/ Realm|About|Admin|PLAYBOOK|DOCTRINE-QUOTE|PILLAR/;
const DIEGETIC = /^DATA:|Dossier content tabs|Settlement detail/;
const chrome = G.filter((r) => CHROME.test(r.surface)), dieg = G.filter((r) => DIEGETIC.test(r.surface));
console.log(`\nchrome-surface exemplars: ${chrome.length}/${G.length} (${(100*chrome.length/G.length).toFixed(1)}%)   diegetic-surface: ${dieg.length}`);

// ── variants
const noStop = G.filter((r) => !/[.?!]$/.test(r.text));
const placeholder = G.filter((r) => /\bX\b/.test(r.text) || /\.\.\.$/.test(r.text));
const banned = G.filter((r) => /^(live engine|feature flag|payload|overlay|placements)\b/i.test(r.text));
console.log(`rows with NO terminal stop: ${noStop.length}   rows carrying a doc placeholder X / truncation: ${placeholder.length}   rows that are BANNED terms: ${banned.length}`);
for (const r of banned) console.log('   BANNED-AS-EXEMPLAR:', JSON.stringify(r.text));
for (const r of placeholder) console.log('   PLACEHOLDER:', JSON.stringify(r.text));

const R = JSON.parse(readFileSync(path.join(W, 'report.json'), 'utf8'));
const M = R.metrics;
const STYLE = [
  ['words/segment mean', (m) => m.wps.mean], ['words/segment sd', (m) => m.wps.sd],
  ['share segments < 8 words', (m) => m.wps.under8], ['share segments > 30 words', (m) => m.wps.over30],
  ['segments / variant', (m) => m.segmentsPerVariant],
  ['antithesis SHAPE rate', (m) => m.shapesRate.antithesisShape], ['gloss tail rate', (m) => m.shapesRate.glossTail],
  ['2nd-sentence summary rate', (m) => m.shapesRate.secondSentSummary], ['semicolon rate', (m) => m.shapesRate.semicolon],
  ['colon rate', (m) => m.shapesRate.colon], ['parenthesis rate', (m) => m.shapesRate.parenthesis],
  ['abstract-noun closer rate', (m) => m.shapesRate.abstractCloser], ['adverbs / segment', (m) => m.shapesRate.adverbsPerSegment],
  ['participial-opener rate', (m) => m.shapesRate.participialOpener], ['triad-list rate', (m) => m.shapesRate.triadList],
  ['rationed pet words / variant', (m) => m.petRate], ['AI tells / variant EXOGENOUS', (m) => m.tellsExogenousRate],
];
const LENGTH = new Set(['words/segment mean', 'words/segment sd', 'share segments < 8 words', 'share segments > 30 words', 'segments / variant']);
const rank = (bibleMetrics, cols, styleList) => {
  const dist = {};
  for (const [label, f] of styleList) {
    const vals = cols.map((c) => Number(f(M[c])));
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length) || 1;
    const bz = (Number(f(bibleMetrics)) - mean) / sd;
    cols.forEach((c, i) => { const z = (vals[i] - mean) / sd; (dist[c] ||= { s: 0, k: 0 }); dist[c].s += Math.abs(z - bz); dist[c].k++; });
  }
  return cols.map((c) => ({ c, d: +(dist[c].s / dist[c].k).toFixed(3) })).sort((a, b) => a.d - b.d);
};
const COLS = Object.keys(M).filter((c) => c !== 'BIBLE' && c !== 'A-W');
const show = (name, r) => console.log(name.padEnd(46), r.map((x) => `${x.c}:${x.d}`).join('  '));
console.log('\n=== AXIS B UNDER CONSTRUCTION VARIANTS (full 19-column pool, 17 metrics) ===');
const V = {
  'V0 as published (n=67)': G,
  'V1 drop B1 meta-description (n=59)': G.filter((r) => r.pool !== 'B1'),
  'V2 drop the 2 BANNED-term rows': G.filter((r) => !banned.includes(r)),
  'V3 drop no-terminal-stop fragments': G.filter((r) => /[.?!]$/.test(r.text)),
  'V4 drop placeholder/truncated rows': G.filter((r) => !placeholder.includes(r)),
  'V5 DIEGETIC surfaces only': dieg,
  'V6 B2 pillars only (the Do: set)': G.filter((r) => r.pool === 'B2'),
};
const orders = {};
for (const [name, rows] of Object.entries(V)) {
  if (rows.length < 5) { console.log(name, '-- too few rows:', rows.length); continue; }
  const m = measure(rows.map((r) => ({ text: r.text, pool: r.surface, file: 'x' })));
  const r = rank(m, COLS, STYLE); orders[name] = r.map((x) => x.c);
  console.log(`${name.padEnd(38)} n=${String(rows.length).padStart(3)}  wps=${m.wps.mean}  TOP3 ${r.slice(0,3).map((x)=>x.c+':'+x.d).join(' ')}   BOTTOM3 ${r.slice(-3).map((x)=>x.c+':'+x.d).join(' ')}`);
}
console.log('\n=== METRIC-SET SENSITIVITY (bible = V0, published corpus) ===');
const m0 = measure(G.map((r) => ({ text: r.text, pool: r.surface, file: 'x' })));
const r17 = rank(m0, COLS, STYLE);
const rLenOnly = rank(m0, COLS, STYLE.filter(([l]) => LENGTH.has(l)));
const rNoLen = rank(m0, COLS, STYLE.filter(([l]) => !LENGTH.has(l)));
const COLS_SENT = COLS.filter((c) => c !== 'R4' && c !== 'R17');
const rSentOnly = rank(m0, COLS_SENT, STYLE);
show('17 metrics (published)', r17);
show('LENGTH FAMILY ONLY (5 of the 17)', rLenOnly);
show('12 NON-LENGTH metrics', rNoLen);
show('phrase-unit cols R4/R17 removed from pool', rSentOnly);
const spear = (a, b) => { const ra = Object.fromEntries(a.map((x, i) => [x.c, i])), rb = Object.fromEntries(b.map((x, i) => [x.c, i]));
  const ks = a.map((x) => x.c); const n = ks.length;
  const d2 = ks.reduce((s, k) => s + (ra[k] - rb[k]) ** 2, 0); return +(1 - 6 * d2 / (n * (n * n - 1))).toFixed(3); };
console.log('\nSpearman rho, published 17-metric order vs LENGTH-ONLY order   :', spear(r17, rLenOnly));
console.log('Spearman rho, published 17-metric order vs NON-LENGTH order    :', spear(r17, rNoLen));
console.log('Spearman rho, published order vs V1 (B1 dropped)              :', spear(r17, rank(measure(V['V1 drop B1 meta-description (n=59)'].map((r)=>({text:r.text,pool:r.surface,file:'x'}))), COLS, STYLE)));
console.log('Spearman rho, published order vs V5 (diegetic exemplars only) :', spear(r17, rank(measure(dieg.map((r)=>({text:r.text,pool:r.surface,file:'x'}))), COLS, STYLE)));
