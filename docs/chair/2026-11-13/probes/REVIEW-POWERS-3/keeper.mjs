// step 5: seatKeeperStyledNameOf on every vacant seat of a corpus — the form, the keeper's title and office, the seat
import fs from 'node:fs'; import zlib from 'node:zlib';
const T = process.env.TREE; const { seatKeeperStyledNameOf, seatKeeperOf, keeperFormOf, isSeatVacant, seatKeeperLineOf } = await import(T + '/src/domain/people/seatKeeper.js');
const { governingFactionOf, nameOf } = await import(T + '/src/domain/rulingPower.js');
const C = {};
for (const f of process.argv.slice(2)) for (const l of zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n')) { const { seed, s } = JSON.parse(l); if (!isSeatVacant(s)) continue;
  const k = seatKeeperOf(s); const v = seatKeeperStyledNameOf(s); const form = keeperFormOf(s); const gov = nameOf(governingFactionOf(s));
  const key = `${form || '(no form)'} | keeper title ${k?.title} | seat ${gov}`; (C[key] ||= []).push(`${seed}: "${v}" | seat row: "${seatKeeperLineOf(s)}"`); }
for (const [k, v] of Object.entries(C).sort((a, b) => b[1].length - a[1].length)) console.log(v.length, k, '\n   e.g.', v[0].slice(0, 230));
