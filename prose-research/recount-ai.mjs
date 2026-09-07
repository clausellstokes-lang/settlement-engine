// recount-ai.mjs — scripted "Supported by" headers, partial table, coverage table, and copyright checks for section-ai.md
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url)); const OUT = join(HERE, 'sweep');
const kept = JSON.parse(readFileSync(join(OUT, 'kept-ai.json'), 'utf8'));
const partial = JSON.parse(readFileSync(join(OUT, 'partial-ai.json'), 'utf8'));
const merged = JSON.parse(readFileSync(join(OUT, 'merged-ai.json'), 'utf8'));
const K = new Map(kept.map(r => [r.index, r])); const P = new Map(partial.map(r => [r.index, r]));
const expand = (str) => str.replace(/\[(\d{1,4})\] to \[(\d{1,4})\]/g, (m, a, b) => { const o = []; for (let i = +a; i <= +b; i++) o.push("[" + i + "]"); return o.join(" "); });
const NONLLM = new Set([641,642,643,644,645,646,865,870,952,953,954,974]);
const docKey = (u) => { try { const x = new URL(u); const p = x.pathname.replace(/\/$/, ''); const h = x.host.replace(/^www\./, ''); const m = p.match(/(\d{4}\.\d{4,5})/); if ((h.includes('arxiv') || h.includes('ar5iv')) && m) return 'arxiv:' + m[1]; return h + p; } catch (e) { return u; } };
const isGloss = (r) => /dramatica\.com/.test(r.url) && /storyscope/i.test(r.source + ' ' + r.claim);
let text = readFileSync(process.argv[2], 'utf8');
// 1. headers
const parts = text.split(/(?=^### )/m);
const citedAll = new Set(); const partialCited = new Set();
const out = parts.map(block => {
  if (!/^### /.test(block)) return block;
  const body = expand(block.replace(/^Supported by: RECOUNT.*$/m, ''));
  const idx = [...new Set([...body.matchAll(/\[(\d{1,4})\]/g)].map(x => +x[1]))];
  const keptRows = idx.filter(i => K.has(i)); const partRows = idx.filter(i => P.has(i)); const excl = idx.filter(i => !K.has(i) && !P.has(i));
  keptRows.forEach(i => citedAll.add(i)); partRows.forEach(i => partialCited.add(i));
  const counted = keptRows.filter(i => !NONLLM.has(i)); const nonllm = keptRows.filter(i => NONLLM.has(i));
  const docs = new Set(counted.filter(i => !isGloss(K.get(i))).map(i => docKey(K.get(i).url))); const gloss = counted.filter(i => isGloss(K.get(i))).length;
  const kinds = { reader: 0, vendor: 0, relay: 0 }; for (const i of counted) { const k = K.get(i).kind; if (k in kinds) kinds[k]++; }
  const exclKept = excl.filter(i => merged.verdicts[i] && merged.verdicts[i].verdict !== 'SKIPPED_TRIAGE');
  let h = `Supported by ${counted.length} verified rows across ${docs.size} source documents`;
  if (gloss) h += ` (plus ${gloss} derivative gloss${gloss > 1 ? 'es' : ''} of a roster document)`;
  const splits = []; if (kinds.reader) splits.push(`${kinds.reader} reader comment${kinds.reader > 1 ? 's' : ''}`); if (kinds.vendor) splits.push(`${kinds.vendor} vendor statement${kinds.vendor > 1 ? 's' : ''}`); if (kinds.relay) splits.push(`${kinds.relay} relay${kinds.relay > 1 ? 's' : ''}`);
  if (splits.length) h += `, of which ${splits.join(', ')} (kind field, where present)`;
  if (nonllm.length) h += `; ${nonllm.length} non-LLM row${nonllm.length > 1 ? 's' : ''} cited for the human side and not counted`;
  h += `; ${partRows.length} partial row${partRows.length === 1 ? '' : 's'} cited for quotation only`;
  if (exclKept.length) h += `; excluded row${exclKept.length > 1 ? 's' : ''} ${exclKept.map(i => '[' + i + ']').join(', ')} cited on a supported limb or for the record only`;
  h += '. Counts generated from the JSON by recount-ai.mjs.';
  return block.replace(/^Supported by: RECOUNT.*$/m, h);
});
text = out.join('');
// 2. citations outside ### blocks (Part F table, register map, header) also count as cited
for (const m of expand(text).matchAll(/\[(\d{1,4})\]/g)) { const i = +m[1]; if (K.has(i)) citedAll.add(i); if (P.has(i)) partialCited.add(i); }
const uncitedKept = kept.map(r => r.index).filter(i => !citedAll.has(i)).sort((a, b) => a - b);
const uncitedPartial = partial.map(r => r.index).filter(i => !partialCited.has(i)).sort((a, b) => a - b);
text = text.replace('KEPT_CITED', String(citedAll.size)).replace('KEPT_UNCITED', String(uncitedKept.length)).replace('UNCITED_LIST', uncitedKept.length ? uncitedKept.map(i => '[' + i + ']').join(', ') : 'none');
text = text.replace('PARTIAL_CITED', String(partialCited.size)).replace('PARTIAL_UNCITED', String(uncitedPartial.length));
// 3. input roster
const files = readdirSync(OUT).filter(f => f.startsWith('verdicts-ai-') && f.endsWith('.json')).sort((a, b) => statSync(join(OUT, a)).mtimeMs - statSync(join(OUT, b)).mtimeMs);
const fmt = (d) => { const p = (n) => String(n).padStart(2, '0'); return `${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`; };
const roster = files.map(f => { const s = statSync(join(OUT, f)); return `\`${f.replace('verdicts-ai-', '').replace('.json', '')}\` (${s.size}, ${fmt(s.mtime)})`; }).join(', ') + '.';
text = text.replace('INPUT_ROSTER', 'in mtime order, dates 2026, ' + roster);
// 4. partial table
const trim12 = (s) => { const w = String(s || '').trim().split(/\s+/).filter(Boolean); return w.length > 12 ? w.slice(0, 12).join(' ') + ' (trimmed)' : w.join(' '); };
const esc = (s) => String(s || '').replace(/\|/g, '/').replace(/\n/g, ' ');
let table = '\n## PARTIAL rows: verbatim quotation only, and the limb that is not supported\n\nThese ' + partial.length + ' rows may be cited for the quotation in the second column and for nothing else. Where the supplied quotation was not on the page, the verifier\'s true wording is given; where the true wording exceeds twelve words it is trimmed and marked. The unsupported limb is the verifier\'s own statement of it.\n\n| index | quotation (the verifier\'s true wording, at most twelve words) | the unsupported limb |\n|---|---|---|\n';
for (const r of partial) table += `| ${r.index} | ${esc(trim12(r.verdict.trueWording))} | ${esc(r.verdict.unsupportedLimb || '(no limb recorded by the verifier; see the note)')} |\n`;
text += table;
writeFileSync(process.argv[3], text);
// 5. checks
const norm = (s) => String(s).toLowerCase().replace(/[“”"'‘’`]/g, '').replace(/[^a-z0-9%.$\s-]/g, ' ').replace(/\s+/g, ' ').trim();
const problems = [];
// quoted spans over twelve words
for (const line of text.split("\n")) { if (/^\|/.test(line)) continue; for (const m of line.matchAll(/"([^"\n]{3,})"/g)) { const w = m[1].trim().split(/\s+/).filter(Boolean).length; if (w > 12) problems.push(`LONG QUOTE (${w} words): "${m[1].slice(0, 80)}"`); } }
// quoted spans must be substrings of a cited row's trueWording on the same line
const lines = text.split('\n');
for (const line of lines) { if (/^\|/.test(line)) continue; const ids = [...expand(line).matchAll(/\[(\d{1,4})\]/g)].map(x => +x[1]); if (!ids.length) continue; const tws = []; for (const i of ids) { const r = K.get(i) || P.get(i); if (r) { tws.push(norm(r.verdict.trueWording)); if (r.verdict.verdict === "VERIFIED_VERBATIM" && r.quote) tws.push(norm(r.quote)); } else if (merged.verdicts[i]) { tws.push(norm(merged.verdicts[i].trueWording || "")); } } for (const m of line.matchAll(/"([^"\n]{3,})"/g)) { const q = norm(m[1]); if (q.split(' ').length < 2) continue; if (!tws.some(t => t.includes(q))) problems.push(`QUOTE NOT IN TW: "${m[1].slice(0, 70)}" | line: ${line.slice(0, 60)}`); } }
// 13-gram continuation check against every trueWording over 12 words
const nt = norm(text);
for (const r of [...kept, ...partial]) { const tw = norm(r.verdict.trueWording).split(' ').filter(Boolean); if (tw.length < 13) continue; for (let i = 0; i + 13 <= tw.length; i++) { const g = tw.slice(i, i + 13).join(' '); if (nt.includes(g)) { problems.push(`13-GRAM from [${r.index}]: ${g}`); break; } } }
console.log(JSON.stringify({ keptCited: citedAll.size, keptUncited: uncitedKept, partialCited: partialCited.size, partialUncited: uncitedPartial, problems: problems.length }, null, 1));
console.log(problems.join('\n'));
