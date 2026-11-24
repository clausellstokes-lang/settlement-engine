// VEIL-53, RULING V6 (a) with V4 terms (1) and (2): the slice's rows (pages.probe.mjs (F), PG_DUMP_VIEWS=1) read.
// (1) every differing line keyed by the NARROWEST key that restores it (one key: that key; several: the shortest set's first,
//     marked JOINT; none: UNKEYED), by tab x class (LOST, GAINED, CHANGED) x key, with its count and UP TO THREE pairs from
//     distinct births; the classes by key (whole counts); the page readers' tabs in play.
// (2) the walk of P1's views on every slice birth: a line "undefined", "NaN", "null", "[object Object]"; a heading-like line
//     (ending ':' or a known heading) followed by another heading or the view's end (an empty block); a label with no value
//     (a line that is a bare known label). Each hit listed with its birth and tab.
// node slice-an.mjs <rowsdir> > table.txt
import { readdirSync, readFileSync } from 'node:fs';
const dir = process.argv[2];
const rows = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const err = rows.filter((r) => r.error);
const groups = new Map(); const byKey = {}; const byClass = {};
const keyOf = (r, item) => { const ks = r.restoredBy?.[item]; if (!r.restored) return 'UNSAMPLED'; if (!ks || !ks.length) return 'UNKEYED'; return ks.length === 1 ? ks[0] : `JOINT(${ks.slice().sort().join('+')})`; };
for (const r of rows) {
  if (r.error || !r.diff) continue;
  for (const [tab, d] of Object.entries(r.diff)) {
    const items = [...d.lost.map((l) => ['LOST', `${tab}\u0001L\u0001${l}`, l]), ...d.gained.map((l) => ['GAINED', `${tab}\u0001G\u0001${l}`, l]),
      ...d.changed.map(([x, y]) => ['CHANGED', `${tab}\u0001C\u0001${x}\u0001${y}`, `${x}  =>  ${y}`])];
    for (const [cls, item, text] of items) {
      const k = keyOf(r, item); const g = `${tab}|${cls}|${k}`;
      if (!groups.has(g)) groups.set(g, { n: 0, ex: [] });
      const G = groups.get(g); G.n += 1;
      if (G.ex.length < 3 && !G.ex.some((e) => e.seed === r.seed)) G.ex.push({ seed: r.seed, text: text.slice(0, 300) });
      byKey[k] = byKey[k] || { LOST: 0, GAINED: 0, CHANGED: 0 }; byKey[k][cls] += 1;
      byClass[cls] = (byClass[cls] || 0) + 1;
    }
  }
}
const HEAD = /:$/;
const BAD = /^(undefined|NaN|null|\[object Object\])$|\bundefined\b|\bNaN\b|\[object Object\]/;
const walk = [];
for (const r of rows) {
  const v = r.views; if (!v) continue;
  for (const [tab, both] of Object.entries(v)) {
    const ls = both?.P1 || []; const own = new Set(both?.P0 || []);
    ls.forEach((l, i) => {
      if (BAD.test(l)) walk.push({ seed: r.seed, tab, kind: 'BAD-TOKEN', line: l.slice(0, 160) });
      if (HEAD.test(l) && (i === ls.length - 1 || HEAD.test(ls[i + 1])) && !(own.has(l) && (both.P0.indexOf(l) === both.P0.length - 1 || HEAD.test(both.P0[both.P0.indexOf(l) + 1]))))
        walk.push({ seed: r.seed, tab, kind: 'EMPTY-BLOCK', line: l.slice(0, 160) });
    });
  }
}
const n = rows.length; const restored = rows.filter((r) => r.restored).length;
console.log(`SLICE ${n} births (errors ${err.length}; restore loop on ${restored}); classes ${JSON.stringify(byClass)}`);
console.log('BY KEY (all tabs):');
for (const [k, c] of Object.entries(byKey).sort((a, b) => (b[1].LOST + b[1].CHANGED + b[1].GAINED) - (a[1].LOST + a[1].CHANGED + a[1].GAINED))) console.log(`  ${k.padEnd(60)} ${JSON.stringify(c)}`);
console.log('BY TAB x CLASS x KEY, up to three pairs from distinct births:');
for (const [g, G] of [...groups].sort((a, b) => b[1].n - a[1].n)) { console.log(`  ${g}  n=${G.n}`); for (const e of G.ex) console.log(`      ${e.seed}: ${JSON.stringify(e.text)}`); }
console.log(`TERM (2) WALK: ${walk.length} hits`);
for (const w of walk.slice(0, 60)) console.log(`  ${w.kind} ${w.seed} ${w.tab}: ${JSON.stringify(w.line)}`);
for (const e of err.slice(0, 5)) console.log(`ERROR ${e.seed}: ${String(e.error).slice(0, 300)}`);
