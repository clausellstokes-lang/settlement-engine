// PROOF-4: for each overview/power cell of e3-slots, the places whose slot line moved by a unit other than E3 (from attr.mjs's
// per-place string units), and how many of them now print / no longer print the cell's top line. A MEASURE. node e3cells.mjs K
import { readFileSync, readdirSync } from 'node:fs'; import { gunzipSync } from 'node:zlib';
const K = process.argv[2]; const P = '/home/user/settlement-engine/docs/chair/2026-11-21/eighth/close/close-8/proof'; const R = `${P}/runs-${K}`;
const places = JSON.parse(readFileSync(`${R}/attr-rec.json`));
const rec = (t, s) => JSON.parse(gunzipSync(readFileSync(`${R}/rec-${t}/${s}.json.gz`)).toString()).record;
const mask = (s, name) => { let t = String(s ?? '').trim(); if (name) t = t.split(name).join('{S}'); return t.replace(/\d[\d,.]*/g, '{N}'); };
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const tally = {};
for (const f of readdirSync(`${R}/rec-join`)) {
  const s = f.replace('.json.gz', ''); const p = places[s]; if (!p?.rec) continue;
  for (const [slot, path] of [['overview', 'record.pressureSentence'], ['power', 'record.powerStructure.recentConflict']]) {
    const hit = (p.strs || []).find((x) => x[0] === path); if (!hit) continue;
    const units = String(hit[3]); const a = rec('before', s), b = rec('join', s);
    const key = `${slot} ${p.size} [${units}]`; const e = (tally[key] ||= { n: 0, lines: new Map() });
    e.n++; const m = mask(slot === 'overview' ? b.pressureSentence : b.powerStructure?.recentConflict, b.name);
    e.lines.set(m.slice(0, 70), (e.lines.get(m.slice(0, 70)) || 0) + 1);
  }
}
for (const k of Object.keys(tally).sort()) { const e = tally[k]; if (/E3\]$|^power/.test(k) && !/D2|D7|D3/.test(k)) continue; console.log(k, e.n, JSON.stringify([...e.lines].sort((x, y) => y[1] - x[1]).slice(0, 3))); }
