// M1: the commanding-claim class beside a Minor or Suppressed label, and the L2 placements, over births.mjs rows.
// node m1count.mjs <dir with 720.*.ndjson.gz> [--list N]
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const dir = process.argv[2]; const LIST = Number(process.argv[process.argv.indexOf('--list') + 1]) || 0;
const rows = fs.readdirSync(dir).filter((f) => f.endsWith('.ndjson.gz')).flatMap((f) => zlib.gunzipSync(fs.readFileSync(path.join(dir, f))).toString().trim().split('\n').map((l) => JSON.parse(l)));
const CLASS = /(Major church institutions hold structural influence|Militarised noble families|structurally embedded in governance|Standing army with genuine political weight|The ruling class and the merchant class are the same people|Dominant commercial class|direct temporal power|holds substantial temporal power|substantial political leverage|genuine political weight; their services|Underworld effectively controls|Criminal organisations have captured significant|structural influence the (elected council|seat) cannot easily override|are structurally embedded in governance here)/;
const COUNCIL = /council|assembly|senate|parliament|moot|thing|diet|consortium|bloc|league|compact/i;
const MERCH = /merchant|trade|commerc|guild/i;
const C = {}; const inc = (k) => (C[k] = (C[k] || 0) + 1); const ex = {};
const note = (k, r, f) => { inc(k); (ex[k] ??= []).length < LIST && ex[k].push(`${r.key} :: ${f.n} ${f.p} · ${f.l} :: ${String(f.d).slice(0, 140)}`); };
for (const r of rows) {
  const F = r.factions; const gov = F.find((f) => f.g);
  const merch = F.filter((f) => f.c === 'economy' || /Merchant|Trade|Commercial/.test(f.n));
  for (const f of F) {
    const d = f.d || '';
    if (/Minor|Suppressed/.test(f.l) && CLASS.test(d)) { inc('M1 class beside Minor/Suppressed'); note('  ' + d.match(CLASS)[0].slice(0, 50), r, f); }
    if (d.includes('present in council discussions through intermediaries') && !COUNCIL.test(gov?.n || '')) note('L2 crim council, no council governs', r, f);
    if (d.includes('outpaced by merchant capital') && !merch.some((m) => m.p > f.p)) note('L2 gentry outpaced, no merchant ahead', r, f);
    if (d.includes('competitive with merchant capital') && !merch.length) note('L2 noble competitive, no merchant power', r, f);
    if (d.startsWith('Merchants with local reach; a consistent civic presence without yet') && merch.length && merch.every((m) => m === f || m.p <= f.p) && !F.some((x) => x.g && MERCH.test(x.n) && x !== f)) note('L2 merchants "not yet dominant" while the leading merchant power', r, f);
  }
}
console.log('births', rows.length); console.log(JSON.stringify(C, null, 1)); if (LIST) console.log(JSON.stringify(ex, null, 1));
