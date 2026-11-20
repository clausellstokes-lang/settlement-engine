// node an.mjs <dir> <unit: copies|cf|reach>  — reads shard*.json of copies.probe.jsx
import { readFileSync, readdirSync } from 'node:fs';
const [dir, unit] = process.argv.slice(2);
const T = readdirSync(dir).filter((f) => /^shard\d\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`)));
const out = [];
const PROSE = /^publicProse\b/;
if (unit === 'copies') {
  // every hit of a withheld power's name, by normalised path, both shapes, every read; towns counted per path
  const by = {}; const towns = new Set(); let reads = 0; let withReads = 0;
  for (const t of T) for (const [k, r] of Object.entries(t.reads || {})) {
    if (k.startsWith('B/') || !r.gone) continue; reads += 1;
    if (r.gone.length) { withReads += 1; towns.add(t.seed); }
    const [shape, dm, read] = k.split('/');
    for (const [g, hs] of Object.entries(r.hits)) for (const [p] of hs) {
      const key = `${PROSE.test(p) ? 'PROSE ' : 'STRUCT'} ${p}`;
      by[key] = by[key] || { hits: 0, towns: new Set(), where: new Set() };
      by[key].hits += 1; by[key].towns.add(t.seed); by[key].where.add(`${shape}/${dm}/${read}`);
    }
  }
  out.push(`${T.length} towns; ${towns.size} with a power withheld on some read; reads judged ${reads}, with a power withheld ${withReads}`);
  out.push('hits of a withheld power\'s name (case-folded substring, values and keys), by path: hits | towns | reads where seen');
  for (const k of Object.keys(by).sort()) out.push(`${String(by[k].hits).padStart(5)} | ${String(by[k].towns.size).padStart(3)} | ${k} | ${[...by[k].where].sort().join(' ')}`);
}
if (unit === 'cf') {
  // unit 4: per town with a hidden house, the served value (A) against the counterfactual's (B), same veil, same read
  const H = T.filter((t) => t.hidden?.length && t.reads?.['B/off/gallery']);
  const keyTally = { equal: 0, differ: 0 }; const typeTally = { equal: 0, differ: 0 };
  const rows = [];
  for (const t of H) for (const dm of ['off', 'dm']) {
    const a = t.reads[`L/${dm}/gallery`]; const b = t.reads[`B/${dm}/gallery`];
    const ka = a.why.key; const kb = b.why.key;
    const drive = (w) => (w.powers.length ? `power:${w.powers.join('+')}` : w.guild.length ? `guild:${w.guild}` : w.syndicate.length ? `syndicate:${w.syndicate}` : w.semi.length ? `semi-house:${w.semi.join('+')}`
      : w.diffuse.length ? `diffuse-house:${w.diffuse}` : w.houses.length ? `crim-house:${w.houses.join('+')}` : w.ops.length ? `ops:${w.ops.join('+')}` : w.chains.length ? `chains:${w.chains}` : '(none / covert)');
    const ta = Array.isArray(a.types) ? [...a.types].sort() : a.types; const tb = Array.isArray(b.types) ? [...b.types].sort() : b.types;
    const kEq = ka === kb; const tEq = JSON.stringify(ta) === JSON.stringify(tb);
    if (dm === 'off') keyTally[kEq ? 'equal' : 'differ'] += 1;
    typeTally[tEq ? 'equal' : 'differ'] += 1;
    rows.push(`${t.seed} ${dm} | key served ${ka} cf ${kb} ${kEq ? 'EQUAL' : 'DIFFER'} | driver ${drive(a.why)} | cf driver ${drive(b.why)} | types served ${JSON.stringify(ta)} cf ${JSON.stringify(tb)} ${tEq ? 'EQUAL' : 'DIFFER'}`);
  }
  out.push(`towns with a hidden house and a counterfactual: ${H.length}`);
  out.push(`Defense key (Reveal off): served equal to counterfactual ${keyTally.equal}, differing ${keyTally.differ}`);
  out.push(`crime types (Reveal off and on, as sets): equal ${typeTally.equal}, differing ${typeTally.differ}`);
  const served = {}; const cf = {};
  for (const t of H) { served[t.reads['L/off/gallery'].why.key] = (served[t.reads['L/off/gallery'].why.key] || 0) + 1; cf[t.reads['B/off/gallery'].why.key] = (cf[t.reads['B/off/gallery'].why.key] || 0) + 1; }
  out.push(`served key tally ${JSON.stringify(served)} | counterfactual key tally ${JSON.stringify(cf)}`);
  const mc = H.filter((t) => ['off', 'dm'].some((d) => (t.reads[`L/${d}/gallery`].types || []).includes?.('Magical crime')));
  out.push(`towns serving "Magical crime": ${mc.length}: ${mc.map((t) => `${t.seed} (cf ${JSON.stringify(t.reads['B/off/gallery'].types)})`).join('; ')}`);
  out.push('', ...rows);
}
if (unit === 'reach') {
  // unit 5: power rows withheld (L, gallery, Reveal off) where no hidden house could have raised them: the counterfactual
  // birth (no hideable house at all) still seats the same power
  let rowsW = 0; let rowsNotRaised = 0; const pages = new Set(); const pagesNotRaised = new Set(); const detail = [];
  let disagree = 0; const dis = [];
  for (const t of T.filter((x) => x.hidden?.length && x.Bpowers)) {
    const r = t.reads['L/off/gallery'];
    const W = r.gone; if (!W.length) continue; pages.add(t.seed);
    const bset = new Set(t.Bpowers.map((p) => p.n));
    const crimHidden = t.hidden.some((h) => String(h.cat).toLowerCase() === 'criminal');
    for (const w of W) {
      rowsW += 1;
      if (bset.has(w)) { rowsNotRaised += 1; pagesNotRaised.add(t.seed); detail.push(`${t.seed}: "${w}" withheld; the counterfactual seats it too (hidden houses: ${t.hidden.map((h) => `${h.name}/${h.cat}`).join(', ')}; a criminal one hidden: ${crimHidden})`); }
    }
    const crimTypes = (Array.isArray(r.types) ? r.types : []).filter((x) => ['Organized guild crime', 'Criminal governance', 'Street gang activity', 'Smuggling'].includes(x));
    if (crimTypes.length && !r.powers.some((p) => String(p.c).toLowerCase() === 'criminal')) { disagree += 1; dis.push(`${t.seed}: served types ${JSON.stringify(crimTypes)}, no criminal power served (withheld ${JSON.stringify(W)})`); }
  }
  out.push(`(a) power rows withheld (lane shape, gallery, Reveal off): ${rowsW} on ${pages.size} pages; of them the counterfactual (no hideable house at all) seats the same power: ${rowsNotRaised} rows on ${pagesNotRaised.size} pages`);
  out.push(`(b) pages serving an organised crime type (kept by attribution) with no criminal power served: ${disagree}`);
  out.push('', ...detail, '', ...dis);
}
console.log(out.join('\n'));
