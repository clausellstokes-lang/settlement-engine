// PAGE-7 measure (TROUBLE-LINES step 1, 2026-11-20; round 2 after the chair's rulings of 16:19): a current tension's
// stored hooks (and, step 1 only, its lasting effects). Towns: PAGE-5's 900 (hxd-<size>-<i>, i=0..n-1, every size in
// SIZES), built as page-5/sim.mjs builds them. Reads the FINAL record: history.currentTensions[].plotHooks /
// .lastingEffects, and factsOf(record) for each need.
// Usage: node measure.mjs <checkout root> [n=150] [prefix=hxd] [pools.mjs]
//   With a pools file (export default { <kind>: { take: { hooks }, hooks: [[text, need, stored?]...] } }; a need is 'none',
//   a fact-vocabulary atom (`src/domain/facts/factVocabulary.js :: atomHolds` over factsOf(record)), '!atom' (reads
//   false) or an array of those, all holding), it also prints the pools' spread: each kind's hooks replaced by the
//   top-`take` of fnv1a32(`${seed}::trouble::${kind}::hook::${text}`) among the lines whose need holds, draw-free.
// THE BAR (the chair, 16:19), by size over the path history.currentTensions[].plotHooks[] (every kind): TOPSHARE = the
//   commonest hook's places / the places holding any hook (the census's topN/holders); SEEN = the census's measure, the
//   mean over holders of the share of a place's hooks a second place also prints (census.mjs's `seen`).
// Count lines start with KINDS, KIND, HOOK, EFFECT, LEN, FACT, TRI, TOP, ATOMS, NEW, BAR (read those; the rest is detail).
const [, , L = process.cwd(), nA = '150', prefix = 'hxd', poolsPath = ''] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { fnv1a32 } = await import(`${L}/src/kernel/proseHash.js`);
const { atomHolds, isKnownAtom } = await import(`${L}/src/domain/facts/factVocabulary.js`);
await loadGenerationLawPayloads();
const pools = poolsPath ? await import(poolsPath) : null;
const partsOf = (need) => (Array.isArray(need) ? need : [need]).filter((x) => x !== 'none');
const ATOMS = pools ? [...new Set(Object.values(pools.default).flatMap((p) => p.hooks.flatMap(([, need]) => partsOf(need).map((x) => x.replace(/^!/, '')))))] : [];
const admits = (need, held) => partsOf(need).every((x) => (x.startsWith('!') ? held[x.slice(1)] === false : held[x] === true));
const unknown = ATOMS.filter((a) => !isKnownAtom(a));
if (pools) console.log(`ATOMS ${ATOMS.length} needs used, unknown to the vocabulary: ${unknown.length ? unknown.join(', ') : 'none'}`);

const pw = (t, c) => (t.powerStructure?.factions || []).filter((f) => f.category === c);
const gov = (t) => (t.powerStructure?.factions || []).find((f) => f.isGoverning);
const stresses = (t) => { const s = t.stress; const arr = Array.isArray(s) ? s : s ? [s] : []; return arr.map((x) => x?.type || x).filter(Boolean); };
const ownPast = (t, k) => (t.history?.historicalEvents || []).some((e) => (e.templateType || e.type) === k);
const TIER = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const safe = (fn) => { try { return fn(); } catch { return undefined; } };

// The facts a new line might need: [key, home, reader(t, f)] — boolean facts are counted as a rate; others as a spread.
const BOOL = [
  ['tier>=town', 'record.tier (factsOf.tier)', (t, f) => TIER.indexOf(f.tier) >= 3],
  ['watch', 'defence.js :: defenceOf().watch', (t, f) => !!f.defence.watch],
  ['garrison', 'defence.js :: defenceOf().garrison', (t, f) => !!f.defence.garrison],
  ['militia', 'defence.js :: defenceOf().militia', (t, f) => !!f.defence.militia],
  ['watch|garrison', 'defence.js :: defenceOf()', (t, f) => !!(f.defence.watch || f.defence.garrison)],
  ['force kept', 'orderForce.js :: orderForceOf().kept', (t, f) => !!f.orderForce?.kept],
  ['guardPresence', 'factsOf.guardPresence (watch|garrison|militia|hired)', (t, f) => !!f.guardPresence],
  ['paid watch', 'guardPay.js :: paidWatchOf', (t, f) => !!f.paidWatch],
  ['walls', 'defence.js :: defenceOf().walls', (t, f) => !!f.defence.walls],
  ['court sits', 'defence.js :: courtHoldersOf', (t, f) => !!f.courtSits],
  ['prison', 'defence.js :: defenceOf().prison', (t, f) => !!f.defence.prison],
  ['temple', "institutions.js :: hasInstitution(record,'temple')", (t, f) => !!f.hasInstitution('temple')],
  ['sacredHouse', 'factsOf.sacredHouse', (t, f) => !!f.sacredHouse],
  ['guild', 'guild.js :: guildOf', (t, f) => !!f.guild],
  ['market', 'market.js :: marketOf', (t, f) => !!f.market],
  ['navigable', 'water.js :: waterOf().navigable', (t, f) => !!f.water?.navigable],
  ['coast', 'water.js :: waterOf().coast', (t, f) => !!f.water?.coast],
  ['river', 'water.js :: waterOf().river', (t, f) => !!f.water?.river],
  ['criminal power', "powerStructure.factions[].category === 'criminal'", (t) => pw(t, 'criminal').length > 0],
  ['organised crime', "criminalStructureKey.js (factsOf.crime in semi-organized|organized)", (t, f) => ['semi-organized', 'organized'].includes(f.crime)],
  ['rival rings', 'rivalRings.js :: rivalRingsStand', (t, f) => !!f.rivalRings],
  ['criminal income', 'criminalIncome.js :: criminalIncomeOf', (t, f) => !!f.criminalIncome],
  ['rival power', 'rivalPower.js :: rivalPowerOf', (t, f) => !!f.rivalPower],
  ['seat outranked', 'seatOutranked.js :: seatOutrankedOf', (t, f) => !!f.seatOutranked],
  ['legitimacy crisis', 'legitimacyCrisis.js :: legitimacyCrisisOf', (t, f) => !!f.legitimacyCrisis],
  ['famine', 'famine.js :: famineOf().famine', (t, f) => !!f.famine?.famine],
  ['danger coming', 'dangerComing.js :: dangerComingOf', (t, f) => !!f.dangerComing],
  ['any stress', 'record.stress (crisisKind.js :: crisisOf)', (t) => stresses(t).length > 0],
  ['own past event', 'history.historicalEvents[].templateType === kind', (t, f, k) => ownPast(t, k)],
];
const SPREAD = [
  ['gov category', 'powerStructure.factions[isGoverning].category', (t) => gov(t)?.category ?? 'none'],
  ['ruler kind', 'rulerKind.js :: rulerKindOf', (t, f) => f.rulerKind ?? 'none'],
  ['law band', 'lawBand.js :: lawBandOf', (t, f) => f.lawBand ?? 'none'],
  ['war state', 'warState.js :: warStateOf', (t, f) => f.warState ?? 'none'],
  ['crime key', 'criminalStructureKey.js :: criminalStructureKeyOf', (t, f) => f.crime ?? 'none'],
  ['prosperity', 'prosperityRank.js :: prosperityLabelOf', (t, f) => f.prosperity ?? 'none'],
  ['stress', 'record.stress[].type', (t) => stresses(t).join('+') || 'none'],
];

const towns = [];
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const seed = `${prefix}-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const f = factsOf(t);
  const tens = (t.history?.currentTensions || []).map((x) => {
    const bool = Object.fromEntries(BOOL.map(([k, , p]) => [k, !!safe(() => p(t, f, x.type))]));
    const spread = Object.fromEntries(SPREAD.map(([k, , p]) => [k, String(safe(() => p(t, f)))]));
    const needsHeld = pools ? Object.fromEntries(ATOMS.map((a) => [a, safe(() => atomHolds(a, f))])) : null;
    return { kind: x.type, hooks: [...(x.plotHooks || [])].map(String), effects: [...(x.lastingEffects || [])].map(String), bool, spread, needsHeld };
  });
  towns.push({ seed, tier: t.tier ?? size, tens });
}

const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : '-');
const all = towns.flatMap((t) => t.tens.map((x) => ({ ...x, seed: t.seed, tier: t.tier })));
const kc = {}; for (const x of all) kc[x.kind] = (kc[x.kind] || 0) + 1;
const ranked = Object.entries(kc).sort((a, b) => b[1] - a[1]);
const eight = ranked.slice(0, 8).map(([k]) => k);
console.log(`KINDS towns ${towns.length}, tensions ${all.length}, kinds ${ranked.length}: ${ranked.map(([k, n]) => `${k} ${n}`).join(' · ')}`);
const bySize = (rows) => SIZES.map((s) => `${s} ${rows.filter((r) => r.tier === s).length}`).join(' ');

for (const k of eight) {
  const rows = all.filter((x) => x.kind === k); const n = rows.length;
  console.log(`\nKIND ${k}: ${n} tensions (${bySize(rows)})`);
  for (const field of ['hooks', 'effects']) {
    const lens = {}; for (const r of rows) lens[r[field].length] = (lens[r[field].length] || 0) + 1;
    console.log(`LEN ${k} ${field}: ${Object.entries(lens).map(([l, c]) => `${l} a town: ${c}`).join(' · ')}`);
    const sc = new Map(); for (const r of rows) for (const s of r[field]) sc.set(s, (sc.get(s) || 0) + 1);
    for (const [s, c] of [...sc].sort((a, b) => b[1] - a[1])) {
      const sz = SIZES.map((z) => `${z} ${rows.filter((r) => r.tier === z && r[field].includes(s)).length}/${rows.filter((r) => r.tier === z).length}`).join(' ');
      console.log(`${field === 'hooks' ? 'HOOK' : 'EFFECT'} ${k} ${c}/${n} (${pct(c, n)}) [${sz}] "${s}"`);
    }
  }
  console.log(`FACT ${k} ` + BOOL.map(([b]) => `${b} ${pct(rows.filter((r) => r.bool[b]).length, n)}`).join(' · '));
  for (const [s] of SPREAD) {
    const c = {}; for (const r of rows) c[r.spread[s]] = (c[r.spread[s]] || 0) + 1;
    console.log(`FACT ${k} ${s}: ` + Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([v, m]) => `${v} ${pct(m, n)}`).join(' · '));
  }
}
console.log(`\nHOMES ${BOOL.concat(SPREAD).map(([k, h]) => `${k} = ${h}`).join(' | ')}`);

// Three-in-a-row: consecutive triples of one size (hxd-<size>-i, i+1, i+2); a triple "shares" when any two of its towns
// print one same string in that field (any tension kind; and only the eight kinds).
const tri = (field, newMap) => {
  const strs = (t) => t.tens.flatMap((x) => (newMap ? newMap(t, x)[field] : x[field]));
  const sh = (a, b) => { const s = new Set(strs(a)); return strs(b).some((d) => s.has(d)); };
  const out = {}; let H = 0, M = 0;
  for (const size of SIZES) { const g = towns.filter((t) => t.tier === size); let h = 0, m = 0;
    for (let i = 0; i + 2 < g.length; i++) { m++; if (sh(g[i], g[i + 1]) || sh(g[i], g[i + 2]) || sh(g[i + 1], g[i + 2])) h++; }
    out[size] = pct(h, m); H += h; M += m; }
  return `all ${pct(H, M)} (${SIZES.map((s) => `${s} ${out[s]}`).join(' ')})`;
};
console.log(`\nTRI today hooks: ${tri('hooks')}`);
console.log(`TRI today effects: ${tri('effects')}`);
for (const size of ['city', 'metropolis']) for (const field of ['hooks', 'effects']) {
  const g = towns.filter((t) => t.tier === size); const c = new Map();
  for (const t of g) for (const s of new Set(t.tens.flatMap((x) => x[field]))) c.set(s, (c.get(s) || 0) + 1);
  console.log(`TOP ${size} ${field}: ` + [...c].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([s, n]) => `${n}/${g.length} "${s.slice(0, 60)}"`).join(' | '));
}

// THE BAR by size (see the header), over the first `m` places of each size (150 = all; 50 = the census's places).
const bar = (label, hooksOf, m) => {
  const parts = [];
  for (const size of SIZES) {
    const g = towns.filter((t) => t.tier === size).slice(0, m).map((t) => new Set(hooksOf(t)));
    const holders = g.filter((h) => h.size > 0); const H = holders.length;
    const df = new Map(); for (const h of holders) for (const s of h) df.set(s, (df.get(s) || 0) + 1);
    const top = Math.max(0, ...df.values());
    let seen = 0; for (const h of holders) { let sh = 0; for (const s of h) sh += df.get(s) - 1; seen += sh / h.size / Math.max(1, H - 1); }
    parts.push(`${size} top ${top}/${H} ${pct(top, H)} seen ${H ? (100 * seen / H).toFixed(1) : '-'}%`);
  }
  console.log(`BAR ${label} (${m} a size): ${parts.join(' · ')}`);
};
bar('today', (t) => t.tens.flatMap((x) => x.hooks), 150);
bar('today', (t) => t.tens.flatMap((x) => x.hooks), 50);

if (pools) {
  const P = pools.default;
  const unknown = ATOMS.filter((a) => !isKnownAtom(a));
  console.log(`ATOMS ${ATOMS.length} atoms used, unknown to the vocabulary: ${unknown.length ? unknown.join(', ') : 'none'}`);
  // KEY ORDER (env TROUBLE_KEY): 'seed-first' (default) hashes `${seed}::trouble::${kind}::hook::${text}`; 'text-first'
  // hashes `${text}::trouble::${kind}::hook::${seed}` (the town's own bytes last, so FNV-1a mixes them last).
  const keyOf = (seed, kind, text) => (process.env.TROUBLE_KEY === 'text-first' ? `${text}::trouble::${kind}::hook::${seed}` : `${seed}::trouble::${kind}::hook::${text}`);
  console.log(`KEY ${process.env.TROUBLE_KEY === 'text-first' ? 'text-first' : 'seed-first'}`);
  const choose = (seed, kind, lines, held, len) => lines.filter(([, need]) => admits(need, held))
    .map(([text]) => [text, fnv1a32(keyOf(seed, kind, text))])
    .sort((a, b) => b[1] - a[1]).slice(0, len).map(([text]) => text);
  const memo = new Map();
  const newMap = (t, x) => { const key = `${t.seed}::${x.kind}`; if (memo.has(key)) return memo.get(key);
    const p = P[x.kind]; const v = p ? { hooks: choose(t.seed, x.kind, p.hooks, x.needsHeld, p.take.hooks) } : { hooks: x.hooks };
    memo.set(key, v); return v; };
  for (const k of Object.keys(P)) {
    const rows = towns.flatMap((t) => t.tens.filter((x) => x.kind === k).map((x) => ({ t, x }))); const n = rows.length;
    const c = new Map(); let short = 0;
    for (const { t, x } of rows) { const v = newMap(t, x).hooks; if (v.length < P[k].take.hooks) short++; for (const s of v) c.set(s, (c.get(s) || 0) + 1); }
    const top = [...c].sort((a, b) => b[1] - a[1]);
    const free = P[k].hooks.filter(([, need]) => partsOf(need).length === 0).length;
    console.log(`NEW ${k}: pool ${P[k].hooks.length} (${free} need nothing, ${P[k].hooks.filter((h) => h[2]).length} stored), ${P[k].take.hooks} a place, short ${short}/${n}; max line ${top[0] ? pct(top[0][1], n) : '-'} of the kind's places, lines printed ${top.length}/${P[k].hooks.length}`);
    for (const [text, need, stored] of P[k].hooks) {
      const rate = rows.filter(({ x }) => admits(need, x.needsHeld)).length;
      console.log(`NEWLINE ${k} need ${JSON.stringify(need)} holds ${pct(rate, n)} prints ${pct(c.get(text) || 0, n)}${stored ? ' STORED' : ''} "${text}"`);
    }
    for (const size of SIZES) { const g = rows.filter(({ t }) => t.tier === size); if (!g.length) continue; const cs = new Map();
      for (const { t, x } of g) for (const s of newMap(t, x).hooks) cs.set(s, (cs.get(s) || 0) + 1);
      const srt = [...cs].sort((a, b) => b[1] - a[1]); const mx = srt[0]; console.log(`NEWSIZE ${k} ${size}: ${g.length} tensions, lines printed ${cs.size}, max line ${mx ? `${mx[1]}/${g.length}` : '-'}${['city', 'metropolis'].includes(size) ? ` [${srt.map(([, m]) => m).join(' ')}]` : ''}`); }
  }
  console.log(`TRI new hooks: ${tri('hooks', newMap)}`);
  bar('new', (t) => t.tens.flatMap((x) => newMap(t, x).hooks), 150);
  bar('new', (t) => t.tens.flatMap((x) => newMap(t, x).hooks), 50);
}
