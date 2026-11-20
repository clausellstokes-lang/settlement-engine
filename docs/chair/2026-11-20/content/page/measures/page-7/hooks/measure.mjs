// PAGE-7 measure (TROUBLE-LINES step 1, 2026-11-20): a current tension's stored hooks and lasting effects.
// Towns: PAGE-5's 900 (hxd-<size>-<i>, i=0..n-1, every size in SIZES), built as page-5/sim.mjs builds them.
// Reads the FINAL record: history.currentTensions[].plotHooks / .lastingEffects, and factsOf(record) for each need.
// Usage: node measure.mjs <checkout root> [n=150] [prefix=hxd] [pools.mjs]
//   With a pools file (export default { <kind>: { take: { hooks, effects }, hooks: [[text, need]...], effects: [[text, need]...] } },
//   `need` a fact-vocabulary atom (`src/domain/facts/factVocabulary.js :: atomHolds` over factsOf(record)) or 'none'), it also
//   prints the proposed pools' spread: each kind's hooks/effects replaced by the top-`take` of
//   fnv1a32(`${seed}::trouble::${kind}::hook|effect::${text}`) among the lines whose need holds, draw-free.
// Count lines start with KINDS, KIND, HOOK, EFFECT, LEN, CHOSEN, FACT, TRI, TOP, NEW (read those; the rest is detail).
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
const ATOMS = pools ? [...new Set(Object.values(pools.default).flatMap((p) => [...p.hooks, ...p.effects].map(([, need]) => need)).filter((n) => n !== 'none'))] : [];
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
    const needsHeld = pools ? Object.fromEntries(ATOMS.map((a) => [a, safe(() => atomHolds(a, f)) === true])) : null;
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

if (pools) {
  const P = pools.default;
  const choose = (seed, kind, field, lines, held, len) => lines.filter(([, need]) => need === 'none' || held[need])
    .map(([text]) => [text, fnv1a32(`${seed}::trouble::${kind}::${field === 'hooks' ? 'hook' : 'effect'}::${text}`)])
    .sort((a, b) => b[1] - a[1]).slice(0, len).map(([text]) => text);
  const LEN = Object.fromEntries(Object.keys(P).map((k) => [k, P[k].take]));
  const memo = new Map();
  const newMap = (t, x) => { const key = `${t.seed}::${x.kind}`; if (memo.has(key)) return memo.get(key);
    const p = P[x.kind]; const v = p ? { hooks: choose(t.seed, x.kind, 'hooks', p.hooks, x.needsHeld, LEN[x.kind].hooks), effects: choose(t.seed, x.kind, 'effects', p.effects, x.needsHeld, LEN[x.kind].effects) } : { hooks: x.hooks, effects: x.effects };
    memo.set(key, v); return v; };
  for (const k of Object.keys(P)) {
    const rows = towns.flatMap((t) => t.tens.filter((x) => x.kind === k).map((x) => ({ t, x }))); const n = rows.length;
    for (const field of ['hooks', 'effects']) {
      const c = new Map(); let short = 0;
      for (const { t, x } of rows) { const v = newMap(t, x)[field]; if (v.length < LEN[k][field]) short++; for (const s of v) c.set(s, (c.get(s) || 0) + 1); }
      const top = [...c].sort((a, b) => b[1] - a[1]);
      const needRate = [...new Set(P[k][field].map(([, need]) => need))].map((need) => `${need}:${pct(rows.filter(({ x }) => need === 'none' || x.needsHeld[need]).length, n)}`);
      console.log(`NEW ${k} ${field}: pool ${P[k][field].length}, chosen ${LEN[k][field]} a town, short ${short}/${n}; max line ${top[0] ? pct(top[0][1], n) : '-'} ("${top[0]?.[0].slice(0, 50)}"), min line ${top.length ? pct(top[top.length - 1][1], n) : '-'}, lines printed ${top.length}/${P[k][field].length}; needs ${needRate.join(' ')}`);
      for (const [s, m] of top) console.log(`NEWLINE ${k} ${field} ${pct(m, n)} "${s}"`);
      for (const size of SIZES) { const g = rows.filter(({ t }) => t.tier === size); if (!g.length) continue; const cs = new Map();
        for (const { t, x } of g) for (const s of newMap(t, x)[field]) cs.set(s, (cs.get(s) || 0) + 1);
        const mx = [...cs].sort((a, b) => b[1] - a[1])[0]; console.log(`NEWSIZE ${k} ${field} ${size}: ${g.length} tensions, lines printed ${cs.size}, max line ${mx ? pct(mx[1], g.length) : '-'}`); }
    }
  }
  console.log(`TRI new hooks: ${tri('hooks', newMap)}`);
  console.log(`TRI new effects: ${tri('effects', newMap)}`);
}
