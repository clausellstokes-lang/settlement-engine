// VEIL-52 PP: the table of one pp.sh run.  node pp-an.mjs <outdir>   (a measure: exit 0; 2 if a shard did not finish)
import { readFileSync, readdirSync } from 'node:fs';
const O = process.argv[2];
const S = readdirSync(O).filter((f) => /^um-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')));
const J = (v) => JSON.stringify(v);
const sum = (f) => S.reduce((a, s) => a + f(s.PP), 0);
const merge = (k) => { const o = {}; for (const s of S) for (const [x, t] of Object.entries(s.PP[k] || {})) { const m = (o[x] ||= { leaves: 0, docs: new Set(), reads: 0, paths: {} }); m.leaves += t.leaves; t.docs.forEach((d) => m.docs.add(d)); m.reads += t.reads; for (const [p, n] of Object.entries(t.paths)) m.paths[p] = (m.paths[p] || 0) + n; } return o; };
console.log(`PP: shards ${S.length} done ${S.filter((s) => s.done).length} | documents ${sum((p) => p.docs)} | reads (document x Reveal) ${sum((p) => p.reads)} | faults ${S.reduce((a, s) => a + s.faults.length, 0)}`);
const mk = {}; for (const s of S) for (const [k, n] of Object.entries(s.PP.markers || {})) mk[k] = (mk[k] || 0) + n; const nb = {}; for (const s of S) for (const [k, n] of Object.entries(s.PP.noBody)) nb[k] = (nb[k] || 0) + n; console.log(`MARKERS ${J(mk)} | NO BODY ${J(nb)}`);
const off = {}; for (const s of S) for (const [k, n] of Object.entries(s.PP.offFirst || {})) off[k] = (off[k] || 0) + n; if (Object.keys(off).length) console.log(`REVEAL-OFF SECRETS / HOOKS / DM NOTES SENT (S minus P, leaves by marker|kind): ${J(off)}`);
const ex = (bin) => Object.assign({}, ...S.map((s) => s.PP.examples[bin] || {}));
for (const [bin, title] of [['a', '(a) IN S, NOT IN P: sent today to an unmarked listing, hidden by the browser'], ['b', '(b) IN P, NOT IN Vp: what the default veil would newly remove from the PAGE'], ['bd', '(b\') IN P, NOT IN Vd (the default veil\'s served data)'], ['ia', '(i) IN THE IMPORT (RPC data), NOT IN P'], ['is', '(i\') IN THE IMPORT, NOT IN S'], ['ip', '(i\'\') IN THE CLIENT\'S IMPORT (fetchDossierForImport), NOT IN P'], ['aU', 'PP-TODAY (U) UNMARKED, S MINUS P (master server, master browser)'], ['aM', 'PP-TODAY (M) MASTER EXPORT MARKER, S MINUS P (sent today, hidden only by the browser)']]) {
  if (!S.some((s) => s.PP[bin])) continue; if (S[0].PP.today && ['a', 'b', 'bd', 'ia', 'is', 'ip'].includes(bin)) continue; if (!S[0].PP.today && ['aU', 'aM'].includes(bin)) continue; if (['ia', 'is', 'ip'].includes(bin) && !S.some((s) => Object.keys(s.PP.ia || {}).length + Object.keys(s.PP.is || {}).length + Object.keys(s.PP.ip || {}).length) && !process.env.PP_IMPORT) continue; const m = merge(bin); const E = ex(bin); if (!Object.keys(m).length) { console.log(`\n${title}\n(EMPTY: 0 leaves, every kind, every read)`); continue; }
  console.log(`\n${title}\nkind | leaves | documents | reads | top paths (leaves) | example`);
  for (const [k, t] of Object.entries(m).sort((x, y) => y[1].leaves - x[1].leaves)) {
    const tp = Object.entries(t.paths).sort((x, y) => y[1] - x[1]).slice(0, 4).map(([p, n]) => `${p} ${n}`).join('; ');
    console.log(`${k} | ${t.leaves} | ${t.docs.size} | ${t.reads} | ${tp} | ${J(E[k])}`);
  }
}
process.exit(S.every((s) => s.done) ? 0 : 2);
