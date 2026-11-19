// counts, per surface, the towns whose food word differs from the one home (the band; else the stored label)
import fs from 'node:fs';
const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const fold = (s) => String(s ?? '').toLowerCase().trim();
const hex = (h) => { if (!h) return ''; const n = parseInt(h.replace('#', ''), 16); return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`; };
const c = { overview: [], overviewColour: [], substrate: [], substrateColour: [], pdfIdentity: [], pdfTonight: [], jrTonight: [], jrEconWord: [] };
for (const o of rows) {
  const home = o.band ?? o.stored; if (!home) continue;
  if (fold(o.overview?.w) !== fold(home)) c.overview.push(`${o.seed} ${o.overview?.w}/${home}`);
  else if (o.band && o.overview?.c !== hex(o.bandColor)) c.overviewColour.push(o.seed);
  if (fold(o.substrate?.w) !== fold(home)) c.substrate.push(`${o.seed} ${o.substrate?.w}/${home}`);
  else if (o.band && !String(o.substrate?.bg).includes(hex(o.bandColor))) c.substrateColour.push(o.seed);
  if (fold(o.pdfIdentity) !== fold(home)) c.pdfIdentity.push(`${o.seed} ${o.pdfIdentity}/${home}`);
  if (!String(o.pdfTonight || '').startsWith(`${home}.`)) c.pdfTonight.push(`${o.seed} ${o.pdfTonight}`);
  if (!String(o.jrTonight || '').startsWith(`- **Food**: ${home}.`)) c.jrTonight.push(`${o.seed} ${o.jrTonight}`);
  const w = String(o.jrEcon || '').match(/^- \*\*Food:\*\* ([A-Za-z]+)/)?.[1];
  if (w && fold(w) !== fold(home)) c.jrEconWord.push(`${o.seed} ${w}/${home}`);
}
for (const [k, v] of Object.entries(c)) console.log(`${k}\t${v.length}\t${v.slice(0, 3).join(' | ')}`);
