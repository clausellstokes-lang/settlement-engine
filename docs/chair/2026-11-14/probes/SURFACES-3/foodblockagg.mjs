// node foodblockagg.mjs <out dir>: the towns where the PDF's food block or the journal's Economics Food row says what the tab does not
import fs from 'node:fs';
const rows = fs.readdirSync(process.argv[2]).filter((f) => /^foodblock\.\d+\.jsonl$/.test(f)).flatMap((f) => fs.readFileSync(`${process.argv[2]}/${f}`, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l)));
const n = (v) => (v == null ? 0 : Math.round(v));
const cells = {}; const add = (k, r, d) => { (cells[k] ||= []).push(`${r.seed}[${r.crisis}] ${d}`); };
for (const r of rows) {
  const t = r.tab, p = r.pdf;
  if (p) {
    if (n(t.short) !== n(p.deficit)) add('pdf deficit vs tab Short', r, `pdf ${p.deficit} / tab ${t.short}`);
    if (t.production != null && n(t.production) !== n(p.production)) add('pdf produced vs tab Production', r, `pdf ${p.production} / tab ${t.production}`);
    if (t.need != null && n(t.need) !== n(p.need)) add('pdf needed vs tab Need', r, `pdf ${p.need} / tab ${t.need}`);
    if (!!t.imported !== !!p.cover) add('pdf import cover vs tab imported', r, `pdf cover ${p.cover} / tab imported ${t.imported}`);
    if (n(t.provision) !== n(p.provision)) add('pdf provision vs tab provision', r, `pdf ${p.provision} / tab ${t.provision}`);
  } else if (t.text) add('pdf block absent, tab row present', r, '');
  const j = r.jrEcon || '';
  const want = r.word ? `- **Food:** ${r.word}` : null;
  if (j !== (want || '')) { if (/Surplus|Balanced|Deficit [−-]|Food deficit|Food surplus/.test(j) || j !== (want || '')) add('journal Food row vs the food word', r, `jr "${j}" / word "${r.word}"`); }
}
console.log(`towns ${rows.length}`);
for (const [k, v] of Object.entries(cells)) console.log(`${k}: ${v.length}  e.g. ${v.slice(0, 3).join(' ; ')}`);
