// BIRTH-AUDIT Q2: the kinds table (kinds.mjs) as the hand-back prints it, with the census's marks beside each id.
//   node docs/chair/2026-11-17/birth/probes/q2table.mjs <q1.json.gz>
import fs from 'node:fs'; import zlib from 'node:zlib';
import { KINDS } from './kinds.mjs';
const q1 = JSON.parse(zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString());
const n = (pop, id) => q1.rows.filter((r) => r.pop === pop && r.id === id).length;
const label = { i: '(i) buys and works', ii: '(ii) is the source', iii: '(iii) other' };
console.log('| strike? | catalogue id | kind | its material | the one-line reason | marked short: the 720 · the 150 · the 300 |');
console.log('|---|---|---|---|---|---|');
for (const k of ['i', 'ii', 'iii']) for (const [id, v] of Object.entries(KINDS).filter(([, v]) => v[0] === k))
  console.log(`| [ ] | ${id} | ${label[k]} | ${v[1]}${v[3] ? ` (stands on: ${v[3].join(', ')}${v[4] ? '; or a coast' : ''})` : ''} | ${v[2]} | ${n('720', id)} · ${n('150', id)} · ${n('300', id)} |`);
