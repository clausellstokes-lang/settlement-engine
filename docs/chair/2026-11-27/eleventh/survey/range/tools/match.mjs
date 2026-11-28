// RANGE-MEASURE: attribute every printed sentence of a corpus to a template (a key's line, or a code literal).
// node match.mjs <keys.json> <corpus.jsonl> <out.jsonl>
// Per page: { seed, size, sents: [[tab, sentence, attr]] } where attr = "K<keyIdx>.<lineIdx>" | "X<codeIdx>" | "".
// Printed lines are read as the walk recorded them (owner views; Notes/* tabs left out). A template matches a printed line
// when its fixed parts occur in order (case-folded, quotes straightened), slots between them bounded at 120 chars.
import { readFileSync, createReadStream, writeFileSync, appendFileSync } from 'node:fs';
import { createInterface } from 'node:readline';
const [KEYS, CORPUS, OUT] = process.argv.slice(2);
const { keys, code } = JSON.parse(readFileSync(KEYS, 'utf8'));
const SLOT = '\u0001';
const norm = (s) => s.toLowerCase().replace(/[“”«»]/g, '"').replace(/[‘’]/g, "'").replace(/[—–]/g, '-').replace(/\s+/g, ' ').trim();
const toks = (s) => s.match(/[a-z0-9']+/g) || [];
const T = []; // templates: { id, parts: [normalized fixed parts], fixedLen }
keys.forEach((k, ki) => k.lines.forEach((l, li) => T.push({ id: `K${ki}.${li}`, raw: l.text })));
code.forEach((c, ci) => T.push({ id: `X${ci}`, raw: c.text }));
const shingleMap = new Map();
let short = 0;
for (const t of T) {
  const r = t.raw.replace(/\{[^}]*\}/g, SLOT);
  t.parts = r.split(SLOT).map(norm).filter((p) => toks(p).length > 0);
  t.fixedLen = t.parts.reduce((a, p) => a + p.length, 0);
  const best = t.parts.map(toks).sort((a, b) => b.length - a.length)[0] || [];
  const n = best.length >= 4 ? 4 : best.length === 3 ? 3 : 0;
  if (!n) { short++; continue; }
  t.n = n;
  // index ONE shingle per template (the rarest is unknown yet: take the middle one of its longest part)
  const sh = [];
  for (let i = 0; i + n <= best.length; i++) sh.push(best.slice(i, i + n).join(' '));
  t.sh = sh;
}
// choose for each template the shingle shared by the fewest templates
const freq = new Map();
for (const t of T) if (t.sh) for (const s of new Set(t.sh)) freq.set(s, (freq.get(s) || 0) + 1);
for (const t of T) {
  if (!t.sh) continue;
  const s = [...t.sh].sort((a, b) => freq.get(a) - freq.get(b))[0];
  const key = `${t.n}:${s}`;
  if (!shingleMap.has(key)) shingleMap.set(key, []);
  shingleMap.get(key).push(t);
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rx = (t) => t.re || (t.re = new RegExp(t.parts.map(esc).join('.{0,120}?')));
const cache = new Map();
function matchLine(line) {
  if (cache.has(line)) return cache.get(line);
  const n = norm(line); const tk = toks(n);
  const cands = new Set();
  for (const k of [3, 4]) for (let i = 0; i + k <= tk.length; i++) { const hit = shingleMap.get(`${k}:${tk.slice(i, i + k).join(' ')}`); if (hit) for (const t of hit) cands.add(t); }
  const found = [];
  for (const t of cands) { const m = rx(t).exec(n); if (m) found.push({ t, s: m.index, e: m.index + m[0].length }); }
  // greedy non-overlapping cover, longest fixed text first
  found.sort((a, b) => b.t.fixedLen - a.t.fixedLen);
  const chosen = [];
  for (const f of found) if (!chosen.some((c) => f.s < c.e && c.s < f.e)) chosen.push(f);
  const res = { n, chosen: chosen.map((c) => [c.t.id, c.s, c.e]), alts: found.length };
  cache.set(line, res); return res;
}
const SPLIT = /(?<=[.!?]["')]?)\s+(?=["'(]?[A-Z0-9])/;
const isSentence = (s) => (s.match(/[A-Za-z']+/g) || []).length >= 4 && /[a-z]/.test(s) && /[.!?]["'”’)]?$/.test(s.trim());
writeFileSync(OUT, '');
const rl = createInterface({ input: createReadStream(CORPUS), crlfDelay: Infinity });
let pages = 0; let sents = 0; let homed = 0;
for await (const L of rl) {
  if (!L) continue;
  const r = JSON.parse(L);
  if (r.error) { appendFileSync(OUT, `${JSON.stringify({ seed: r.seed, size: r.size, error: true })}\n`); continue; }
  const out = [];
  for (const [tab, lines] of Object.entries(r.views)) {
    if (tab.startsWith('Notes/')) continue;
    for (const line of lines) {
      const m = matchLine(line);
      // sentences of the printed line, with their offsets in the normalized line
      let off = 0; const n = m.n;
      for (const raw of line.split(SPLIT)) {
        const s = raw.trim(); if (!s) continue;
        const ns = norm(s); const at = n.indexOf(ns, off); const st = at >= 0 ? at : off; const en = st + ns.length; off = en;
        if (!isSentence(s)) continue;
        // the chosen template covering most of this sentence
        let best = ''; let bestCov = 0;
        for (const [id, a, b] of m.chosen) { const cov = Math.min(b, en) - Math.max(a, st); if (cov > bestCov) { bestCov = cov; best = id; } }
        if (bestCov < Math.min(12, ns.length / 3)) best = '';
        out.push([tab, s, best]); sents++; if (best) homed++;
      }
    }
  }
  appendFileSync(OUT, `${JSON.stringify({ seed: r.seed, size: r.size, sents: out })}\n`);
  pages++;
}
console.log(`templates ${T.length} (short, unindexed ${short}); pages ${pages}; sentences ${sents}; homed ${homed} (${(100 * homed / sents).toFixed(1)}%)`);
