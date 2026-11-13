// CENSUS-2 recall: does each kind's test fire on the cold readers' own lines? The readers' 80 towns (seeds.readers.txt)
// are re-born and re-rendered at the counted tree by census2.sh --seeds seeds.readers.txt; this joins their lines
// (ROUND-3-CUT.json `lines` and ROUND-3-CUT-INCREMENT.json `lines`) to that run's dumps and hits.
//   node recall.mjs <readers-out-dir> <ROUND-3-CUT.json> <ROUND-3-CUT-INCREMENT.json> [kinds=a,b,c] [misses=5]
// A reader line is PRINTING when its sentence (whitespace folded) is inside a line of the same town's dump; recall is
// fired / printing, per kind. The readers' `mechanism` is mapped to a kind by MECH below (a guide, not a key: a line
// of another mechanism that a test catches is counted apart as "caught across").
import fs from 'node:fs';
const [OUTD, cutF, incF, kindsArg = 'a,b,c,d,e,f,g,h', missN = '5'] = process.argv.slice(2);
const KINDS = kindsArg.split(',');
export const MECH = {
  a: (x) => /lacks/i.test(x.mechanism),
  b: (x) => /normal times/i.test(x.mechanism),
  c: (x) => /^a size$/i.test(x.mechanism.trim()),
  d: (x) => /broken text/i.test(x.mechanism),
  e: (x) => /^denies/i.test(x.mechanism),
  f: (x) => /count range|with a gate/i.test(x.mechanism),
  g: (x) => /machinery|slider name/i.test(x.mechanism),
  h: (x) => /acting|vacant|empty seat/i.test(`${x.mechanism} ${x.fact}`) && /ruler|holder|seat|role|power/i.test(x.mechanism),
};
const cut = JSON.parse(fs.readFileSync(cutF, 'utf8')).lines.map((x) => ({ ...x, list: 'cut', id: `cut#${x.n}` }));
const inc = JSON.parse(fs.readFileSync(incF, 'utf8')).lines.map((x) => ({ ...x, id: `${x.list}#${x.i}` }));
const ALL = [...cut, ...inc];
const H = JSON.parse(fs.readFileSync(OUTD + '/hits.json', 'utf8'));
const hitsBy = {}; for (const h of H) (hitsBy[`${h.seed}|${h.line}`] ||= []).push(h);
const norm = (t) => String(t).replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
const dumps = {}; const dumpLines = (seed) => dumps[seed] ??= (() => { try { const out = []; let view = '_'; for (const l of fs.readFileSync(`${OUTD}/dumps/${seed}.txt`, 'utf8').split('\n')) { const m = l.match(/^== (.*) ==$/); if (m) { view = m[1]; continue; } out.push({ view, line: l, n: norm(l) }); } return out; } catch { return null; } })();
const res = {}; const across = {};
for (const x of ALL) {
  const dl = dumpLines(x.town); if (!dl) continue;
  const sn = norm(x.sentence); const where = dl.filter((d) => d.n.includes(sn) || (sn.length > 40 && d.n.includes(sn.slice(0, Math.min(90, sn.length)))));
  const kinds = KINDS.filter((k) => MECH[k] && MECH[k](x));
  const firedKinds = new Set(); for (const d of where) for (const h of hitsBy[`${x.town}|${d.line}`] || []) firedKinds.add(h.pattern);
  for (const k of kinds) { const r = (res[k] ||= { lines: 0, printing: 0, fired: 0, high: 0, highFired: 0, misses: [] }); r.lines++; if (!where.length) continue; r.printing++; if (x.severity === 'HIGH') r.high++;
    if (firedKinds.has(k)) { r.fired++; if (x.severity === 'HIGH') r.highFired++; } else r.misses.push(x); }
  for (const k of firedKinds) if (!kinds.includes(k)) (across[k] ||= []).push(x.id);
}
for (const k of KINDS) { const r = res[k]; if (!r) { console.log(`kind ${k}: no reader line of its mechanism`); continue; }
  console.log(`kind ${k}: reader lines ${r.lines}; printing at the counted tree ${r.printing}; the test fires on ${r.fired} = recall ${(100 * r.fired / Math.max(1, r.printing)).toFixed(0)}% (HIGH ${r.highFired}/${r.high}); caught across other mechanisms ${across[k]?.length || 0}`);
  for (const x of r.misses.slice(0, +missN)) console.log(`   miss ${x.id} ${x.town} ${x.tab} | ${x.sentence.slice(0, 150)} | F: ${String(x.fact).slice(0, 110)}`); }
fs.writeFileSync(OUTD + '/recall.json', JSON.stringify({ res: Object.fromEntries(Object.entries(res).map(([k, v]) => [k, { ...v, misses: v.misses.map((x) => x.id) }])), across }, null, 1));
