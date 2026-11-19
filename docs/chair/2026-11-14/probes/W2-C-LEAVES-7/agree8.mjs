// TREE=<tree> node agree8.mjs <tri8 out.ndjson>: pills per surface and list; the towns where the surfaces disagree.
// The tab prints an export or an import as the record spells it, the PDF and the journal through resourceDisplayName:
// the tab's pills are compared through that seam (the label rows are counted apart); case and markdown escapes folded.
import fs from 'node:fs';
const { resourceDisplayName } = await import(process.env.TREE + '/src/domain/display/resourceDisplayName.js');
const rows = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const norm = (x) => String(x).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\\(.)/g, '$1').toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();
const c = {}; const inc = (k, n = 1) => (c[k] = (c[k] || 0) + n); const dis = { ex: [], im: [], lo: [] }; let err = 0;
for (const r of rows) {
  if (r.tabErr || r.pdfErr) { err++; console.error(r.seed, r.tabErr || r.pdfErr); continue; }
  for (const k of ['ex', 'im', 'lo']) {
    const raw = r.tab[k] || []; const t = raw.map((x) => norm(k === 'lo' ? x : resourceDisplayName(x)));
    if (k !== 'lo') inc(`tab ${k} label differs from the PDF's seam`, raw.filter((x) => norm(x) !== norm(resourceDisplayName(x))).length);
    const p = (r.pdf?.[k]?.items || []).map(norm);
    inc(`tab ${k}`, t.length); inc(`pdf ${k}`, p.length);
    let jOk = true;
    if (k !== 'lo') { let j = norm(r.jr[k] ?? ''); for (const it of [...t].sort((a, b) => b.length - a.length)) { const i = j.indexOf(it); if (i < 0) { jOk = false; break; } j = j.slice(0, i) + '\u0000' + j.slice(i + it.length); } jOk = jOk && j.split(', ').every((x) => x === '\u0000') === (t.length > 0) && (t.length > 0 || j === ''); inc(`journal ${k}`, jOk ? t.length : 0); if (!jOk) inc(`journal ${k} unmatched towns`); }
    const st = [...t].sort().join('|'), sp = [...p].sort().join('|');
    if (st !== sp || !jOk) { inc(`towns disagree ${k}`); if (dis[k].length < 3) dis[k].push(`${r.seed}\n   tab ${st}\n   pdf ${sp}\n   jr  ${r.jr[k] ?? '-'}`); }
  }
  if (r.tab.im === null) inc('tab: no Imports heading'); if (r.pdf && r.pdf.im.head == null) inc('pdf: no IMPORTS heading'); if (!r.pdf) inc('pdf: no TRADE FLOWS');
  if (r.jr.im == null) inc('journal: no Imports row');
}
console.log(JSON.stringify(c), 'errors', err); for (const k of Object.keys(dis)) if (dis[k].length) console.log(k, '\n' + dis[k].join('\n'));
