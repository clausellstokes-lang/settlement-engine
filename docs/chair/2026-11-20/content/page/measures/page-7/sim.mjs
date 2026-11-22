// PAGE-7 CAUSES-DATA measures (b) and (c): measures/page-5/sim.mjs RE-POINTED AT THE BUILT MODULE (a copy: sim.mjs on
// PAGE-5's lane is not touched). One source: the tables are src/data/tensionCauses.js, the predicates
// src/domain/display/tensionCauseHolds.js, and every shown sentence is src/domain/display/tensionCause.js ::
// tensionCauseSentenceOf with its built key (drawn through drawDeclared since addendum 3; {power} filled by tensionSidePower.js) (the town's name and the kind); the cause a tension speaks for is read back
// off that sentence (each wording belongs to one cause of its kind, or to its plain). Same 900 towns, same metrics.
//   (b) PROJECTION: three towns in a row sharing a shown sentence; interleaved sizes under 10%, three cities in a row
//       under 25%;
//   (c) THE CAP: no single wording above about 15% of its kind's tensions.
// Run: node docs/chair/2026-11-20/content/page/measures/page-7/sim.mjs $PWD 150 > <out>
const [, , L, nA = '150', prefix = 'hxd'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { TENSION_CAUSES } = await import(`${L}/src/data/tensionCauses.js`);
const { TENSION_CAUSE_HOLDS } = await import(`${L}/src/domain/display/tensionCauseHolds.js`);
const { tensionCauseSentenceOf } = await import(`${L}/src/domain/display/tensionCause.js`);
const { solePowerNameOf } = await import(`${L}/src/data/tensionSidePower.js`);
await loadGenerationLawPayloads();
/** sentence → `<kind>:<cause>:<index>` (or `<kind>:plain:<index>`), from the data file */
const OWNER = new Map();
for (const [kind, t] of Object.entries(TENSION_CAUSES)) {
  for (const c of t.causes) c.wordings.forEach((w, j) => OWNER.set(`${kind}\u0000${w.text}`, `${kind}:${c.id}:${j}`));
  t.plain.forEach((w, j) => OWNER.set(`${kind}\u0000${w.text}`, `${kind}:plain:${j}`));
  if (t.withoutItsHouse) OWNER.set(`${kind}\u0000${t.withoutItsHouse.text}`, `${kind}:withoutItsHouse:0`); // addendum 2 (the chair's 15:35)
}
const towns = [];
const names = new Map();
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const seed = `${prefix}-${size}-${i}`; const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  names.set(t.name, (names.get(t.name) || 0) + 1);
  const f = factsOf(t); const shown = []; const assigned = [];
  for (const x of t.history?.currentTensions || []) {
    const s = tensionCauseSentenceOf(t, x);
    if (s === null) { shown.push(x.description); continue; }
    // a {power} wording is found with its slot filled as the reader fills it (addendum 3: data/tensionSidePower.js)
    const owner = OWNER.get(`${x.type}\u0000${s}`) ?? TENSION_CAUSES[x.type].causes.filter((c) => c.power).flatMap((c) => c.wordings.map((w, j) => [c, w, j]))
      .filter(([c, w]) => w.text.split('{power}').join(String(solePowerNameOf(t, c.power, w.text.startsWith('{power}')))) === s).map(([c, , j]) => `${x.type}:${c.id}:${j}`)[0];
    if (!owner) throw new Error(`${seed} ${x.type}: a sentence the data file does not hold: ${s}`);
    const hold = TENSION_CAUSES[x.type].causes.filter((c) => TENSION_CAUSE_HOLDS[c.holds](t, f)).map((c) => c.id);
    assigned.push({ kind: x.type, cause: owner.split(':')[1], hold });
    shown.push(owner);
  }
  towns.push({ seed, tier: t.tier, base: (t.history?.currentTensions || []).map((x) => x.description), shown, assigned });
}
const pct = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '-';
const over = [];
for (const [k, table] of Object.entries(TENSION_CAUSES)) {
  const rows = towns.flatMap((t) => t.assigned.filter((a) => a.kind === k)); const n = rows.length;
  const raw = Object.fromEntries(table.causes.map((c) => [c.id, rows.filter((r) => r.hold.includes(c.id)).length]));
  const wc = new Map(); for (const t of towns) for (const d of t.shown) if (d.startsWith(k + ':')) wc.set(d, (wc.get(d) || 0) + 1);
  const sorted = [...wc].sort((a, b) => b[1] - a[1]); const top = sorted[0];
  for (const [w, c] of sorted) if (n && c / n > 0.15) over.push(`${w} ${pct(c, n)}`);
  const asg = {}; for (const r of rows) asg[r.cause] = (asg[r.cause] || 0) + 1;
  console.log(`${k} (${n}): ` + table.causes.map((c) => `${c.id}(r${c.rank}) raw ${pct(raw[c.id], n)} → ${pct(asg[c.id] || 0, n)}`).join(' · ') + ` · plain ${pct(asg.plain || 0, n)}` + (table.withoutItsHouse ? ` · withoutItsHouse ${asg.withoutItsHouse || 0} (${pct(asg.withoutItsHouse || 0, n)})` : '') + ` · MAX WORDING ${top ? top[0].split(':').slice(1).join(':') + ' ' + pct(top[1], n) : '-'}`);
}
const metric = (key) => {
  const sh = (a, b) => { const s = new Set(a[key]); return b[key].some((d) => s.has(d)); };
  const tri = (a, b, c) => sh(a, b) || sh(a, c) || sh(b, c);
  const by = {}; let H = 0, M = 0; for (const size of SIZES) { const g = towns.filter((t) => t.tier === size); let h = 0, m = 0; for (let i = 0; i + 2 < g.length; i++) { m++; if (tri(g[i], g[i + 1], g[i + 2])) h++; } by[size] = pct(h, m); H += h; M += m; }
  const mixed = []; for (let i = 0; i < +nA; i++) for (const size of SIZES) mixed.push(towns.find((t) => t.seed === `${prefix}-${size}-${i}`));
  let h = 0, m = 0; for (let i = 0; i + 2 < mixed.length; i++) { m++; if (tri(mixed[i], mixed[i + 1], mixed[i + 2])) h++; }
  let s = 12345; const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; let hx = 0; const NX = 20000;
  for (let k = 0; k < NX; k++) { const a = towns[Math.floor(r() * towns.length)], b = towns[Math.floor(r() * towns.length)], c = towns[Math.floor(r() * towns.length)]; if (a === b || b === c || a === c) { k--; continue; } if (tri(a, b, c)) hx++; }
  return { text: `same size ${pct(H, M)} (${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(' ')}); interleaved sizes ${pct(h, m)}; random triples ${pct(hx, NX)}`, mixed: h / m, by };
};
const base = metric('base'); const cause = metric('shown');
console.log('BASE  ' + base.text);
console.log('CAUSE ' + cause.text);
for (const size of ['city', 'metropolis', 'town']) { const g = towns.filter((t) => t.tier === size); const kc = {};
  for (let i = 0; i + 2 < g.length; i++) { const tr = [g[i], g[i + 1], g[i + 2]]; for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) for (const d of tr[a].shown) if (tr[b].shown.includes(d)) { const k = /^[a-z_]+:[a-z_]+:\d$/.test(d) ? d : 'stored:' + d.slice(0, 40); kc[k] = (kc[k] || 0) + 1; } }
  console.log(size + ' shared: ' + Object.entries(kc).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, c]) => `${c}× ${k}`).join(' | ')); }
const dupNames = [...names].filter(([, c]) => c > 1);
console.log(`NAMES (the key): ${names.size} distinct of ${towns.length} towns; ${dupNames.length} names held by more than one town${dupNames.length ? ': ' + dupNames.map(([n, c]) => `${n}×${c}`).join(', ') : ''}`);
console.log(`(b) PROJECTION: interleaved sizes ${pct(cause.mixed * 1000, 1000)} (bar under 10%: ${cause.mixed < 0.10 ? 'MET' : 'NOT MET'}); three cities in a row ${cause.by.city} (bar under 25%: ${parseFloat(cause.by.city) < 25 ? 'MET' : 'NOT MET'})`);
console.log(`(c) THE CAP: wordings above 15% of their kind's tensions: ${over.length}${over.length ? ' — ' + over.join(' | ') : ''}`);
