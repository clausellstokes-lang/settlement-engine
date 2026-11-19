import fs from 'node:fs'; import zlib from 'node:zlib';
const T = '/home/user/wt-tip';
const { importsAsPrinted } = await import(T + '/src/domain/display/tradeListDisplay.js');
const K = await import(T + '/src/domain/facts/houseKinds.js');
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const B = load(process.argv[2]), A = load(process.argv[3]);
const out = { neededBeside: {}, hooksNew: {}, hooksGone: {}, selfSuff: {}, summary: {} };
const add = (o, k, seed) => (o[k] ||= []).push(seed);
for (const [seed, t] of A) { const b = B.get(seed);
  const bi = new Set(b.economicState.primaryImports || []); const added = (t.economicState.primaryImports || []).filter((x) => !bi.has(x)); if (!added.length) continue;
  const ip = importsAsPrinted(t); for (const n of ip.needed) add(out.neededBeside, `${n} | beside ${added.join(' + ')}`, seed);
  const hb = new Set((b.economicViability?.plotHooks || []).map((h) => h.hook)); const ht = new Set((t.economicViability?.plotHooks || []).map((h) => h.hook));
  for (const h of ht) if (!hb.has(h)) add(out.hooksNew, h.replace(String(t.name), '<town>').slice(0, 160), seed);
  for (const h of hb) if (!ht.has(h)) add(out.hooksGone, h.replace(String(t.name), '<town>').slice(0, 160), seed);
  const txt = JSON.stringify([t.economicViability, t.economicState?.incomeSources, t.economicState?.summary]).toLowerCase();
  for (const re of [/imports? nothing/, /self-sufficient/, /no imports/, /needs nothing from outside/, /well supplied/]) { const m = txt.match(re); if (m) add(out.selfSuff, m[0], seed); }
  if (JSON.stringify(b.economicViability?.summary) !== JSON.stringify(t.economicViability?.summary)) add(out.summary, JSON.stringify(t.economicViability?.summary).slice(0, 200), seed);
}
for (const [k, o] of Object.entries(out)) { console.log('==', k); for (const [x, v] of Object.entries(o).sort((p, q) => q[1].length - p[1].length).slice(0, 14)) console.log(v.length, '|', x, '|', v.slice(0, 3).join(', ')); }
