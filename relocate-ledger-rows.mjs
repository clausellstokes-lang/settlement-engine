// relocate-ledger-rows.mjs <tree> <base-sha> <ledger> [--write]
// Relocates the rows of an EXACT, LOCATION-BOUND, SHRINK-ONLY ledger after a car moved lines. A row's IDENTITY is the
// text of its addressed line in the BASE tree (plus the snippet for prose-numerics rows); its ADDRESS is line[:column].
// For each row: read the base line, find it in the tip file — exactly once → RELOCATED (or UNCHANGED if same line);
// zero → VANISHED (a WIN candidate: reviewed by the chair, never re-added); many → AMBIGUOUS (STOP). Never adds a row.
// --write rewrites ONLY relocated addresses; vanished/ambiguous rows are left for the chair and the walker.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
const [tree, base, ledger, ...rest] = process.argv.slice(2);
if (!tree || !base || !ledger) { console.error('usage: <tree> <base-sha> <tests/lint/.x-baseline.json> [--write]'); process.exit(2); }
const WRITE = rest.includes('--write');
const raw = readFileSync(join(tree, ledger), 'utf8'); const doc = JSON.parse(raw);
const rows = Array.isArray(doc) ? doc : doc.entries; if (!Array.isArray(rows)) { console.error('no rows'); process.exit(2); }
const baseText = new Map();
function baseLines(p) { if (!baseText.has(p)) { try { baseText.set(p, execFileSync('git', ['show', `${base}:${p}`], { cwd: tree, encoding: 'utf8', maxBuffer: 64 << 20 }).split('\n')); } catch { baseText.set(p, null); } } return baseText.get(p); }
const tipText = new Map();
function tipLines(p) { if (!tipText.has(p)) { const f = join(tree, p); tipText.set(p, existsSync(f) ? readFileSync(f, 'utf8').split('\n') : null); } return tipText.get(p); }
const out = { unchanged: 0, repunctuated: [], relocated: [], vanished: [], ambiguous: [], missingFile: [] };
for (const r of rows) {
  const b = baseLines(r.path), t = tipLines(r.path);
  if (!b || !t) { out.missingFile.push(`${r.path}:${r.line}`); continue; }
  const ident = b[r.line - 1]; if (ident == null) { out.vanished.push(`${r.path}:${r.line} (base line absent)`); continue; }
  // IDENTITY: a prose-numerics row is path+category+SNIPPET (the walker's own identity) — the surrounding sentence may be
  // re-punctuated without the row moving; a wizard-news row (no snippet) is the base line's text.
  const has = r.snippet ? (ln) => ln.includes(r.snippet) : (ln) => ln === ident;
  if (has(t[r.line - 1] ?? '')) { out.unchanged++; if (r.snippet && t[r.line - 1] !== ident) out.repunctuated.push(`${r.path}:${r.line}`); continue; }
  const hits = []; t.forEach((ln, i) => { if (has(ln)) hits.push(i + 1); });
  if (hits.length === 1) { out.relocated.push(`${r.path}:${r.line}→${hits[0]}`); if (WRITE) r.line = hits[0]; }
  else if (hits.length === 0) out.vanished.push(`${r.path}:${r.line} :: ${(r.snippet || ident).trim().slice(0, 70)}`);
  else out.ambiguous.push(`${r.path}:${r.line} → ${hits.join(',')}`);
}
console.log(`${ledger}: rows=${rows.length} unchanged=${out.unchanged} (of which re-punctuated on the same line, snippet intact: ${out.repunctuated.length}) relocated=${out.relocated.length} vanished=${out.vanished.length} ambiguous=${out.ambiguous.length} missingFile=${out.missingFile.length}`);
for (const k of ['repunctuated', 'relocated', 'vanished', 'ambiguous', 'missingFile']) if (out[k].length) console.log(`  ${k}:\n    ` + out[k].slice(0, 40).join('\n    ') + (out[k].length > 40 ? `\n    … +${out[k].length - 40}` : ''));
if (WRITE) { if (out.ambiguous.length) { console.error('REFUSED --write: ambiguous rows'); process.exit(1); } writeFileSync(join(tree, ledger), JSON.stringify(doc, null, 2) + (raw.endsWith('\n') ? '\n' : ''), 'utf8'); console.log('  written (relocated addresses only; vanished rows untouched — review and delete by hand)'); }
process.exit(out.ambiguous.length ? 1 : 0);
