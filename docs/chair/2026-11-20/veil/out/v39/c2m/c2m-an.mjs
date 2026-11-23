// V39-C2M TABLES. node c2m-an.mjs <outdir>   (reads <outdir>/m1-shard*.json and <outdir>/m3-shard*.json, c2m.probe.jsx's output)
//   M1  per site: places whose resolved block differs from the stored pp-1 (all, and NOTHING-HIDDEN places: no hideable house);
//       the differing leaves by kind and cause, five examples each kind; places differing ONLY by (i); the controls; the
//       variant `unveiled: true`.
//   M3  per recompose row: hiding reads where the served field differs from the stored; held word for word / not; of the held,
//       equal / differ (the substituted stored block against the owner-side compose from the record carrying the served field).
import { readFileSync, readdirSync } from 'node:fs';
const [dir] = process.argv.slice(2);
const load = (re) => readdirSync(dir).filter((f) => re.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const fmt = (n) => n.toLocaleString('en-US');
const m1 = load(/^m1-shard\d+\.json$/);
if (m1.length) {
  const B = m1.flatMap((s) => s.births);
  const hidden0 = B.filter((b) => b.houses === 0);
  console.log(`M1: ${fmt(B.length)} places (${fmt(hidden0.length)} nothing-hidden: no hideable house); shards ${m1.map((s) => `${s.meta.shard.join('/')}:${s.meta.n} ${Math.round(s.meta.ms / 1000)}s`).join(', ')}`);
  console.log(`  CONTROLS: base copy vs stored differs on ${B.filter((b) => b.control).length} places; scratch composer vs the copy of (c) differs on ${B.filter((b) => b.scratchVsCopy).length}; site-restricted compose vs whole on ${B.filter((b) => b.atCheck).length}`);
  for (const b of B.filter((x) => x.control).slice(0, 3)) console.log(`    control e.g. ${b.seed}: ${JSON.stringify(b.controlEx).slice(0, 300)}`);
  const anyDiff = B.filter((b) => b.leafs.length);
  console.log(`  PLACES WHOSE (c) PROSE DIFFERS FROM THE STORED: ${fmt(anyDiff.length)} of ${fmt(B.length)}; nothing-hidden ${fmt(hidden0.filter((b) => b.leafs.length).length)} of ${fmt(hidden0.length)}`);
  const outsideI = (b) => b.leafs.filter((l) => l.kind !== 'i');
  console.log(`  ... differing OUTSIDE (i) (the target is 0 on nothing-hidden places): ${fmt(B.filter((b) => outsideI(b).length).length)} places; nothing-hidden ${fmt(hidden0.filter((b) => outsideI(b).length).length)} of ${fmt(hidden0.length)}; equal outside (i) on nothing-hidden: ${fmt(hidden0.filter((b) => !outsideI(b).length).length)}`);
  const sites = {};
  for (const b of B) {
    const per = {};
    for (const l of b.leafs) (per[l.site] ||= new Set()).add(l.kind);
    for (const [s, kinds] of Object.entries(per)) {
      const o = (sites[s] ||= { places: 0, h0: 0, onlyI: 0, leafs: 0, kinds: {} });
      o.places += 1; if (b.houses === 0) o.h0 += 1; if (kinds.size === 1 && kinds.has('i')) o.onlyI += 1;
    }
    for (const l of b.leafs) { const o = sites[l.site]; o.leafs += 1; o.kinds[l.kind] = (o.kinds[l.kind] || 0) + 1; }
  }
  console.log('\n  PER SITE: places differing | of them nothing-hidden | places differing by (i) alone | differing leaves | leaves by kind');
  for (const [s, o] of Object.entries(sites).sort((x, y) => y[1].places - x[1].places)) console.log(`    ${s}: ${fmt(o.places)} | ${fmt(o.h0)} | ${fmt(o.onlyI)} | ${fmt(o.leafs)} | ${JSON.stringify(o.kinds)}`);
  const L = B.flatMap((b) => b.leafs.map((l) => ({ ...l, seed: b.seed, h0: b.houses === 0 })));
  for (const kind of ['i', 'ii-w', 'ii-r', 'ii-j', 'iii']) {
    const ls = L.filter((l) => l.kind === kind);
    const places = new Set(ls.map((l) => l.seed)).size;
    console.log(`\n  KIND (${kind}): ${fmt(ls.length)} leaves on ${fmt(places)} places; by cause (leaves, places, sites):`);
    const by = {};
    for (const l of ls) { const o = (by[l.why] ||= { n: 0, p: new Set(), s: new Set() }); o.n += 1; o.p.add(l.seed); o.s.add(l.site); }
    for (const [w, o] of Object.entries(by).sort((x, y) => y[1].p.size - x[1].p.size).slice(0, 25)) console.log(`    ${fmt(o.n)} leaves, ${fmt(o.p.size)} places | ${w} | ${[...o.s].join(', ')}`);
    if (Object.keys(by).length > 25) console.log(`    ... ${Object.keys(by).length - 25} more causes`);
    // five examples, from five different causes where there are five
    const seen = new Set(); const ex = [];
    for (const l of ls) { if (ex.length >= 5) break; if (seen.has(l.why) && Object.keys(by).length >= 5) continue; seen.add(l.why); ex.push(l); }
    for (const l of ex) console.log(`    e.g. ${l.seed} ${l.site} ${l.path} [${l.why}]\n         stored:   ${String(l.stored).slice(0, 260)}\n         composed: ${String(l.composed).slice(0, 260)}`);
  }
  const T = B.map((b) => b.unveiledTrue);
  const tSites = {}; for (const b of B) for (const s of b.unveiledTrue.sites) tSites[s] = (tSites[s] || 0) + 1;
  console.log(`\n  VARIANT unveiled: true (blackMarketCapture re-derived): places differing ${fmt(T.filter((t) => t.leafs).length)}; leaves ${fmt(T.reduce((a, t) => a + t.leafs, 0))} (default ${fmt(L.length)}); same diff as default on ${fmt(T.filter((t) => t.sameAsDefault).length)} places; per site ${JSON.stringify(tSites)}`);
}
const m3 = load(/^m3-shard\d+\.json$/);
if (m3.length) {
  const B = m3.flatMap((s) => s.births);
  console.log(`\nM3: ${fmt(B.length)} places read, ${fmt(B.filter((b) => b.houses).length)} with a hideable house (each read by the twin at every gated setting, both Reveals)`);
  const R = {};
  for (const b of B) for (const [row, o] of Object.entries(b.rows)) {
    const e = (R[row] ||= { places: 0, reads: 0, absent: 0, held: 0, notHeld: 0, equal: 0, differ: 0, pEqual: 0, pDiffer: 0, ex: [] });
    e.places += 1; for (const k of ['reads', 'absent', 'held', 'notHeld', 'equal', 'differ']) e[k] += o[k];
    if (o.differ) e.pDiffer += 1; else if (o.equal) e.pEqual += 1;
    for (const x of o.ex) if (e.ex.length < 5 && !e.ex.some((y) => y.seed === b.seed)) e.ex.push({ seed: b.seed, ...x });
  }
  console.log('  row: places where served != stored | reads | served absent | stored block holds the stored text (reads) / not | of held: equal / differ (reads) | places all-equal / any-differ');
  for (const [row, e] of Object.entries(R)) {
    console.log(`    ${row}: ${fmt(e.places)} | ${fmt(e.reads)} | ${fmt(e.absent)} | ${fmt(e.held)} / ${fmt(e.notHeld)} | ${fmt(e.equal)} / ${fmt(e.differ)} | ${fmt(e.pEqual)} / ${fmt(e.pDiffer)}`);
    for (const x of e.ex) console.log(`      differ e.g. ${x.seed} ${x.read} ${x.site} ${x.path}\n        stored field: ${String(x.stored).slice(0, 160)}\n        served field: ${String(x.served).slice(0, 160)}\n        substituted:  ${String(x.substituted).slice(0, 260)}\n        owner-side:   ${String(x.ownerComposed).slice(0, 260)}`);
  }
  const rc = B.filter((b) => b.rc).map((b) => ({ seed: b.seed, houses: b.houses, ...b.rc }));
  const sum = (k, xs = rc) => xs.reduce((a, x) => a + x[k], 0);
  const hh = rc.filter((x) => x.houses);
  console.log(`\nM2x THE RECENT-CONFLICT SENTENCE (c) SHIPS vs THE ONE THE PAGE DRAWS (rederiveRecentConflict over each read's served document): ${fmt(rc.length)} places, ${fmt(sum('reads'))} reads`);
  console.log(`  (c) composes from a sentence on ${fmt(rc.filter((x) => x.cSentence).length)} places; its power:governance block holds it word for word on ${fmt(rc.filter((x) => x.cHolds).length)}`);
  console.log(`  reads: the page draws the SAME sentence ${fmt(sum('same'))} | a DIFFERENT one ${fmt(sum('differ'))} (on ${fmt(rc.filter((x) => x.differ).length)} places) | none ${fmt(sum('pageNone'))}; places with a hideable house: same ${fmt(sum('same', hh))} | differ ${fmt(sum('differ', hh))} | none ${fmt(sum('pageNone', hh))}`);
  for (const x of rc.filter((y) => y.differ).slice(0, 5)) console.log(`    differ e.g. ${x.seed} ${JSON.stringify(x.ex[0]).slice(0, 420)}`);
}
