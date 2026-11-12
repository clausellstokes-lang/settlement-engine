// node wholediff.mjs <a-label> <b-label> <out.json> — THE WHOLE-LANE FIELD DIFF (L3): the paired shards of whole.mjs, line
// against line. Per moved leaf path (array indices folded to []): count, and for a number up/down, for any other value
// changed; a path only in b 'added', only in a 'removed'. Grouped by family (the path's first two segments). Beside it the
// labels by crisis and size: the coup label (Stable < Holding < Contested < Critical, toward danger or safety), the hall's
// capture state (none < adversarial < equilibrium < corrupted < capture), every faction powerLabel, stability and
// legitimacy, and the births that differ, by corpus.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const S = '/tmp/claude-0/-home-user-settlement-engine/af36b3be-c713-5bc4-9179-581d679d45cb/scratchpad/dumps';
const [A, B, OUT] = process.argv.slice(2);
const COUP = ['Stable', 'Holding', 'Contested', 'Critical. The seat could fall'];
const CAP = ['none', 'adversarial', 'equilibrium', 'corrupted', 'capture'];
const leaves = (v, p, o) => { if (v && typeof v === 'object') { const ks = Object.keys(v); if (!ks.length) o[p] = JSON.stringify(v); for (const k of ks) leaves(v[k], p + (Array.isArray(v) ? '[]' : `.${k}`) + (Array.isArray(v) ? `#${k}` : ''), o); } else o[p] = v; return o; };
const fold = (p) => p.replace(/#\d+/g, '');
const lines = (f) => readline.createInterface({ input: fs.createReadStream(f).pipe(zlib.createGunzip()), crlfDelay: Infinity })[Symbol.asyncIterator]();
const paths = {}; const births = {}; const labels = {}; const bump = (o, k, f) => { o[k] ||= { n: 0, up: 0, down: 0, changed: 0, added: 0, removed: 0 }; o[k].n++; o[k][f]++; };
const lab = (kind, crisis, tier, dir) => { const k = `${kind} | ${crisis || 'none'} | ${tier}`; labels[k] ||= { toward_danger: 0, toward_safety: 0, moved: 0 }; labels[k][dir]++; };
for (let i = 0; i < 4; i++) {
  const ia = lines(`${S}/${A}.w${i}.ndjson.gz`), ib = lines(`${S}/${B}.w${i}.ndjson.gz`);
  for (;;) {
    const [x, y] = await Promise.all([ia.next(), ib.next()]);
    if (x.done || y.done) { if (x.done !== y.done) throw new Error('unpaired'); break; }
    const a = JSON.parse(x.value), b = JSON.parse(y.value);
    if (a.key !== b.key) throw new Error(`order ${a.key} ${b.key}`);
    const corp = a.key.split(/[-:]/)[0]; births[corp] ||= [0, 0]; births[corp][1]++;
    const crisis = a.stress; const tier = a.tier;
    if (a.coup !== b.coup) lab('coup', crisis, tier, COUP.indexOf(b.coup) > COUP.indexOf(a.coup) ? 'toward_danger' : 'toward_safety');
    const ca = a.rec?.powerStructure?.criminalCaptureState, cb = b.rec?.powerStructure?.criminalCaptureState;
    if (ca !== cb) lab('capture', crisis, tier, CAP.indexOf(cb) > CAP.indexOf(ca) ? 'toward_danger' : 'toward_safety');
    for (const f of ['stability', 'legitimacy', 'government']) if (JSON.stringify(a.rec?.powerStructure?.[f]) !== JSON.stringify(b.rec?.powerStructure?.[f])) lab(f, crisis, tier, 'moved');
    const pl = (r) => Object.fromEntries((r?.powerStructure?.factions || []).map((f) => [f.faction, f.powerLabel]));
    const pa = pl(a.rec), pb = pl(b.rec); for (const n of Object.keys(pa)) if (n in pb && pa[n] !== pb[n]) lab('powerLabel', crisis, tier, 'moved');
    if (JSON.stringify(a.rec) === JSON.stringify(b.rec)) continue;
    births[corp][0]++;
    const la = leaves(a.rec, '', {}), lb = leaves(b.rec, '', {});
    for (const p of new Set([...Object.keys(la), ...Object.keys(lb)])) {
      if (la[p] === lb[p]) continue;
      const q = fold(p);
      if (!(p in la)) bump(paths, q, 'added'); else if (!(p in lb)) bump(paths, q, 'removed');
      else if (typeof la[p] === 'number' && typeof lb[p] === 'number') bump(paths, q, lb[p] > la[p] ? 'up' : 'down');
      else bump(paths, q, 'changed');
    }
  }
}
const fam = {}; for (const [q, v] of Object.entries(paths)) { const f = q.split(/(?=[.[])/).slice(0, 2).join(''); fam[f] ||= { n: 0, up: 0, down: 0, changed: 0, added: 0, removed: 0, paths: 0 }; for (const k of Object.keys(v)) fam[f][k] += v[k]; fam[f].paths++; }
fs.writeFileSync(OUT, JSON.stringify({ births, families: fam, paths, labels }, null, 1));
console.log('births differ/total', JSON.stringify(births));
for (const [f, v] of Object.entries(fam).sort((x, y) => y[1].n - x[1].n).slice(0, 50)) console.log(String(v.n).padStart(8), f, JSON.stringify(v));
