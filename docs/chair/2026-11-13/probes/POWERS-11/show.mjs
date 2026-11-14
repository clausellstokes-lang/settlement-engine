// show.mjs <dir> <substring> [n]: towns printing a faction desc containing the substring, with the roster
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [dir, sub, n = '40'] = process.argv.slice(2);
const rows = fs.readdirSync(dir).filter((f) => f.endsWith('.gz')).flatMap((f) => zlib.gunzipSync(fs.readFileSync(path.join(dir, f))).toString().trim().split('\n').map((l) => JSON.parse(l)));
let k = 0; const tiers = {};
for (const r of rows) for (const f of r.factions) if ((f.d || '').includes(sub)) { tiers[r.tier] = (tiers[r.tier] || 0) + 1; if (k++ < Number(n)) console.log(`${r.key} ${r.tier} [${r.stress}] ${f.n} ${f.p} ${f.l}${f.g ? ' (gov)' : ''} :: ${f.d}\n    roster: ${r.factions.map((x) => `${x.n} ${x.p} ${x.l}${x.g ? '*' : ''}`).join(', ')}`); }
console.log('tiers', JSON.stringify(tiers));
