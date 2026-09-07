// X6 — THE ANNEX-ROW EXTRACTOR (docs/content/RECEIPT_POOLS_*.md, by the numbered-line grammar).
//
// GRAMMAR (each part measured, none guessed):
//   row      ^(\d+)\. (.+)$                      a numbered variant line
//   angle    ^`\[([^`]*)\]`\s*                   the leading angle/edge tag, e.g. `[ledger · gate]`
//   meta     (?:\s*·)?\s*`(?:\[[^`]*\]|requiredSlots:[^`]*)`\s*$   trailing [live, verbatim] / [merged <- ...] / requiredSlots
//   note     \s*\*\([^)]*\)\*\s*$                the italic authoring note, e.g. *(volume exemplar)*
//   LAW ROW  ^\*\*                               a NUMBERED LAW, not a corpus variant — EXCLUDED
//                                                (the inventory's 9,221 "prose" rows include 106 of these)
//   heading  ^#{1,6} \s*(.+)$                    the enclosing kind/section heading is carried
//
// Every row is stamped wired | authored-unwired by joining its normalised key against the
// src-side index built from X2 + X5 + X7 (a superset of the inventory's export-only srcindex).
// Usage: node x6-annex.mjs <DOCK> <OUT.json> <walk.json> <inline.json> <jsx.json>
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const D = process.argv[2];
const OUT = process.argv[3];
const norm = (t) => t.toLowerCase().replace(/\{[a-z_0-9]+\}/gi, '{}').replace(/[’‘']/g, "'")
  .replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();

// ── the src-side index (for the wiring stamp) ────────────────────────────────
const srcKeys = new Map();
const feed = (rows, textKey, fileKey) => {
  for (const r of rows) {
    const t = r[textKey];
    if (typeof t !== 'string' || t.length < 12) continue;
    const k = norm(t);
    if (!srcKeys.has(k)) srcKeys.set(k, r[fileKey]);
  }
};
feed(JSON.parse(readFileSync(process.argv[4], 'utf8')), 'text', 'file');
feed(JSON.parse(readFileSync(process.argv[5], 'utf8')), 'text', 'file');
for (const r of JSON.parse(readFileSync(process.argv[6], 'utf8'))) {
  for (const h of (r.hits || [])) { const k = norm(h); if (!srcKeys.has(k)) srcKeys.set(k, r.file); }
}

const rowRe = /^(\d+)\. (.+)$/;
const tagRe = /^`\[([^`]*)\]`\s*/;
const metaRe = /(?:\s*·)?\s*`(?:\[[^`]*\]|requiredSlots:[^`]*)`\s*$/;
// the italic authoring trailer comes in two forms: *(volume exemplar)* and *— canonical-at-zero*
// (the second carries an em dash and, unstripped, is the ONLY source of em dashes in the annexes)
const noteRe = /\s*\*(?:\([^)]*\)|—[^*]*)\*\s*$/;
const headRe = /^(#{1,6})\s+(.+?)\s*$/;

const rows = [];
const perAnnex = {};
const CD = path.join(D, 'docs/content');
for (const f of readdirSync(CD).filter((x) => /^RECEIPT_POOLS_.*\.md$/.test(x))) {
  const lines = readFileSync(path.join(CD, f), 'utf8').split('\n');
  const st = { annex: f, rows: 0, law: 0, short: 0, prose: 0, wired: 0 };
  let h2 = '', h3 = '', inFence = false;
  lines.forEach((line, i) => {
    if (/^```/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    const hm = headRe.exec(line);
    if (hm) { if (hm[1].length <= 2) { h2 = hm[2]; h3 = ''; } else h3 = hm[2]; return; }
    const m = rowRe.exec(line);
    if (!m) return;
    st.rows++;
    let body = m[2];
    if (/^\*\*/.test(body)) { st.law++; return; }          // a numbered LAW, not a variant
    let angle = null;
    const tm = tagRe.exec(body);
    if (tm) { angle = tm[1]; body = body.replace(tagRe, ''); }
    let prev;
    do { prev = body; body = body.replace(metaRe, "").replace(noteRe, ""); } while (body !== prev);
    body = body.replace(noteRe, '').trim();
    if (body.length < 20) { st.short++; return; }
    st.prose++;
    const key = norm(body);
    const wiredTo = srcKeys.get(key) || null;
    if (wiredTo) st.wired++;
    rows.push({
      register: wiredTo ? 'ANNEX-WIRED' : 'ANNEX-UNWIRED',
      annex: f, file: `docs/content/${f}`, line: i + 1, n: Number(m[1]),
      section: h2, kind: h3, pool: `${f} :: ${h3 || h2}`,
      angle, shape: /\{[a-z_][a-z_0-9]*\}/i.test(body) ? 'slot-string' : 'object-string',
      viaFn: 0, wiredTo, text: body,
    });
  });
  perAnnex[f] = st;
}

writeFileSync(OUT, JSON.stringify(rows));
console.log('annex'.padEnd(34), 'rows'.padStart(6), 'law'.padStart(5), 'short'.padStart(6), 'prose'.padStart(6), 'wired'.padStart(6), 'pct'.padStart(6));
let T = { rows: 0, law: 0, short: 0, prose: 0, wired: 0 };
for (const s of Object.values(perAnnex).sort((a, b) => b.prose - a.prose)) {
  console.log(s.annex.padEnd(34), String(s.rows).padStart(6), String(s.law).padStart(5), String(s.short).padStart(6),
    String(s.prose).padStart(6), String(s.wired).padStart(6), (s.prose ? (100 * s.wired / s.prose).toFixed(1) : '-').padStart(6));
  for (const k of Object.keys(T)) T[k] += s[k];
}
console.log('TOTAL'.padEnd(34), String(T.rows).padStart(6), String(T.law).padStart(5), String(T.short).padStart(6),
  String(T.prose).padStart(6), String(T.wired).padStart(6), (100 * T.wired / T.prose).toFixed(1).padStart(6));
writeFileSync(OUT.replace(/\.json$/, '.perannex.json'), JSON.stringify(perAnnex, null, 1));
