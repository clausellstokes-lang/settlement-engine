// The chair's measure (2026-11-20): EVERY stored sentence of a place, by its path in the record, and how far places share it.
// For each size: N places (seeds hxd-<size>-<i>), each record walked whole; a "sentence" is a string leaf of >= 25 characters with a space.
// The place's own proper names (its name, its people's name words, its powers' names) are masked to '#', so two places that print the same
// sentence about different people count as one. Per path: places holding it; distinct sentences; the commonest sentence and how many places
// print it (TOP); and SEEN = the mean share of a place's sentences at this path that a second place of the same size also prints.
const [, , L, nArg = '50', out = 'json'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
await loadGenerationLawPayloads();
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const n = +nArg;
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const result = {};
for (const size of SIZES) {
  const byPath = new Map(); // path -> Map(sentence -> Set(townIndex)), plus per-town sets
  for (let i = 0; i < n; i++) {
    const seed = `hxd-${size}-${i}`;
    const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
    const names = new Set();
    const add = (x) => { if (typeof x === 'string' && x.trim().length > 2) names.add(x.trim()); };
    add(t.name);
    for (const p of t.npcs || []) { add(p.name); for (const w of String(p.name || '').split(/\s+/)) if (w.length > 3) add(w); }
    for (const f of t.powerStructure?.factions || []) { add(f.name); add(f.faction); }
    const list = [...names].sort((a, b) => b.length - a.length);
    const re = list.length ? new RegExp(list.map(esc).join('|'), 'g') : null;
    const mask = (s) => (re ? s.replace(re, '#') : s).replace(/\d+/g, '0');
    const seen = new Set();
    const walk = (v, path, depth) => {
      if (v == null || depth > 14) return;
      if (typeof v === 'string') {
        if (v.length >= 25 && v.includes(' ')) {
          const m = mask(v);
          let mp = byPath.get(path); if (!mp) { mp = new Map(); byPath.set(path, mp); }
          let st = mp.get(m); if (!st) { st = new Set(); mp.set(m, st); }
          st.add(i);
        }
        return;
      }
      if (typeof v !== 'object') return;
      if (seen.has(v)) return; seen.add(v);
      if (Array.isArray(v)) { for (const x of v) walk(x, path + '[]', depth + 1); return; }
      for (const k of Object.keys(v)) { if (k.startsWith('_')) continue; walk(v[k], path ? path + '.' + k : k, depth + 1); }
    };
    walk(t, '', 0);
  }
  const rows = [];
  for (const [path, mp] of byPath) {
    const perTown = new Map(); // town -> count of sentences, and sum of (df-1)
    let top = null, topN = 0; const holders = new Set();
    for (const [s, st] of mp) {
      if (st.size > topN) { topN = st.size; top = s; }
      for (const i of st) { holders.add(i); const o = perTown.get(i) || { c: 0, sh: 0 }; o.c++; o.sh += (st.size - 1); perTown.set(i, o); }
    }
    const H = holders.size; if (H < 5) continue;
    let seenShare = 0; for (const o of perTown.values()) seenShare += (o.sh / o.c) / Math.max(1, H - 1);
    seenShare /= perTown.size;
    const perPlace = [...perTown.values()].reduce((a, o) => a + o.c, 0) / H;
    rows.push({ path, holders: H, distinct: mp.size, perPlace: +perPlace.toFixed(1), topN, topShare: +(topN / H).toFixed(2), seen: +seenShare.toFixed(3), top: top.slice(0, 140) });
  }
  result[size] = rows;
}
if (out === 'json') console.log(JSON.stringify(result));
