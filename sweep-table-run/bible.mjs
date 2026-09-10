// BIBLE — build the archivist voice bible's OWN exemplar corpus out of docs/VOICE_AND_TONE.md
// and score it with the same instrument the registers are scored with, so "most / least like the
// bible" is a number and not an opinion.
//
// FOUR SOURCES, each a place where the bible SPEAKS in the voice rather than ABOUT it:
//   B1  §1 "The Voice, in One Paragraph"          — the definitional passage, split into sentences
//   B2  §2 pillars: every `- Do: "…"` exemplar    — the positive half of each pillar's pair
//   B3  §4 per-surface tone matrix: the AFTER     — text right of the last `→` in the exemplar cell
//   B4  §6 em-dash playbook + §5 doctrine: AFTERs and quoted positives
// The `Don't:` halves are collected SEPARATELY as the anti-corpus (never mixed into the exemplar).
// Usage: node bible.mjs <DOCK> <OUT.json>
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { measure, segments } from './metrics.mjs';

const D = process.argv[2];
const OUT = process.argv[3];
const src = readFileSync(path.join(D, 'docs/VOICE_AND_TONE.md'), 'utf8');
const lines = src.split('\n');

const strip = (s) => s.trim().replace(/^[“"']+/, '').replace(/[”"']+$/, '').replace(/\s+/g, ' ').trim();
const good = [];
const bad = [];
const add = (arr, text, tag) => { const t = strip(text); if (t.length >= 12 && /[a-z]/.test(t)) arr.push({ text: t, pool: tag, file: 'docs/VOICE_AND_TONE.md' }); };

// B1 — the §1 paragraph, sentence by sentence
{
  const i = lines.findIndex((l) => /^## 1\. The Voice, in One Paragraph/.test(l));
  const j = lines.findIndex((l, k) => k > i && /^---/.test(l));
  const para = lines.slice(i + 1, j).join(' ').replace(/\*\*/g, '').trim();
  for (const s of segments(para)) add(good, s, 'B1 §1 voice paragraph');
}
// B2 — the pillars' Do / Don't pairs
for (const l of lines) {
  let m = /^- Do(?: \([^)]*\))?: "(.+?)"\s*(?:\(.*\))?$/.exec(l.trim());
  if (m) { for (const s of segments(m[1])) add(good, s, 'B2 pillar Do'); continue; }
  m = /^- Don't: "(.+?)"/.exec(l.trim());
  if (m) { for (const s of segments(m[1])) add(bad, s, 'B2 pillar Dont'); }
}
// B3 — the tone matrix's AFTER (last arrow in the exemplar cell) and B4 — the playbook AFTERs
for (const l of lines) {
  if (!/^\|/.test(l) || !/→/.test(l)) continue;
  const cells = l.split('|').map((c) => c.trim());
  for (const c of cells) {
    if (!/→/.test(c)) continue;
    const parts = c.split('→');
    const after = parts[parts.length - 1];
    const before = parts.slice(0, -1).join('→');
    for (const q of (after.match(/"([^"]+)"/g) || [])) for (const s of segments(q.slice(1, -1))) add(good, s, 'B3/B4 matrix+playbook AFTER');
    for (const q of (before.match(/"([^"]+)"/g) || [])) for (const s of segments(q.slice(1, -1))) add(bad, s, 'B3/B4 BEFORE');
  }
}
// B4b — §5 immersion doctrine's quoted positives (numbered doctrine lines, quoted spans only)
{
  const i = lines.findIndex((l) => /^## 5\. Immersion Doctrine/.test(l));
  const j = lines.findIndex((l, k) => k > i && /^## 6\./.test(l));
  for (const l of lines.slice(i, j)) {
    if (!/^\d+\. /.test(l.trim())) continue;
    for (const q of (l.match(/"([^"]+)"/g) || [])) for (const s of segments(q.slice(1, -1))) add(good, s, 'B4b §5 doctrine quote');
  }
}

const dedup = (a) => { const s = new Set(); return a.filter((r) => { const k = r.text.toLowerCase(); if (s.has(k)) return false; s.add(k); return true; }); };
const G = dedup(good);
const B = dedup(bad);
const out = {
  exemplar: { n: G.length, bySource: G.reduce((a, r) => ((a[r.pool] = (a[r.pool] || 0) + 1), a), {}), metrics: measure(G), rows: G },
  antiCorpus: { n: B.length, metrics: measure(B), rows: B },
};
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('# bible exemplar sentences:', G.length, JSON.stringify(out.exemplar.bySource));
console.log('# bible anti-corpus (the Don\'t half):', B.length);
console.log('wps', JSON.stringify(out.exemplar.metrics.wps), 'segs/variant', out.exemplar.metrics.segmentsPerVariant);
console.log('shapes', JSON.stringify(out.exemplar.metrics.shapesRate));
console.log('hard rules', JSON.stringify(out.exemplar.metrics.bibleHardRules));
console.log('--- 12 exemplar rows ---');
for (const r of G.slice(0, 12)) console.log('   ', r.text);
