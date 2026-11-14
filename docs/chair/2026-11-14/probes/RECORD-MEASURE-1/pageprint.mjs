// what the page prints of each class: node pageprint.mjs <classes.json> <corpus> <dumps dir>
// a town PRINTS its class where its dump holds the class's witness strings (every one of a pair) in the named sections.
import fs from 'node:fs'; import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const [CJ, CORPUS, DUMPS] = process.argv.slice(2);
const K = JSON.parse(fs.readFileSync(CJ, 'utf8')).classes;
const S = Object.fromEntries(require('./load.cjs')(CORPUS).map((r) => [r.seed, r.s]));
const sect = (txt) => { const o = {}; let cur = ''; for (const l of txt.split('\n')) { const m = /^== (.+) ==$/.exec(l); if (m) cur = m[1]; else (o[cur] ??= []).push(l); } return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.join('\n').toLowerCase()])); };
const inTabs = (sec, w, re = /^(Summary|Systems|World|Table)\//) => Object.entries(sec).filter(([k]) => re.test(k)).some(([, v]) => v.includes(w.toLowerCase()));
const where = (sec, w) => Object.entries(sec).filter(([k, v]) => /^(Summary|Systems|World|Table)\//.test(k) && v.includes(w.toLowerCase())).map(([k]) => k);
const W = {
  a_founder_vs_origin: (s) => [[s.history.founding.foundedBy.slice(0, 40), s.history.founding.reason.slice(0, 40)]],
  b1_dry_water_house: (s, d) => d.map((x) => [x]),
  b2_dry_water_good: (s, d) => d.map((x) => [x]),
  c1_made_no_house: (s, d) => d.flatMap((x) => x.split('|').slice(1).map((g) => [g])),
  c2_category_as_good: (s, d) => d.map((x) => [x]),
  c3_too_fine_for_size: (s, d) => d.map((x) => [/arms/.test(x) ? 'Advanced weapons' : /luxury/.test(x) ? 'luxury' : 'Education']),
  d_power_body: (s, d) => d.map((x) => [x.replace(/^(power|body): /, '').split(/ (Significant|Strong|Dominant|Minor|Suppressed)|,/)[0]]),
  e_size_cannot_hold: (s, d) => d.map((x) => [x.split(' in ')[0]]),
  f_defence_lines_empty: (s, d) => d.map((x) => [x.split(' with ')[0]]),
  g_stability_word: (s, d) => [[String(s.powerStructure.stability).split(';')[0].slice(0, 30)]],
  h_land_cannot: (s, d) => d.map((x) => [x.split(/,| in /)[0]]),
  i_made_and_imported: (s, d) => d.map((x) => [x]),
  j_office_empty: (s, d) => d.map((x) => [x]),
  k_gendered_title: (s, d) => d.map((x) => [x.replace(/^(male|female) /, '')]),
};
for (const [id, r] of Object.entries(K)) {
  let printed = 0; const sec = {};
  for (const seed of r.towns) {
    const f = `${DUMPS}/${seed}.txt`; if (!fs.existsSync(f)) continue;
    const ds = sect(fs.readFileSync(f, 'utf8'));
    const ws = W[id](S[seed], r.detail[seed]);
    const hit = ws.filter((pair) => pair.every((w) => inTabs(ds, w)));
    if (hit.length) { printed++; for (const w of hit[0]) for (const k of where(ds, w)) sec[k] = (sec[k] || 0) + 1; }
  }
  const top = Object.entries(sec).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${v}:${k}`).join(' ');
  console.log(`${id}\t${r.towns.length}\tprinted ${printed}\t${top}`);
}
