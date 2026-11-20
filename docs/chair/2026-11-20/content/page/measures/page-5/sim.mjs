// PAGE-5 unit 3 (b): candidate cause tables evaluated on built towns; repeat metrics with placeholder lines (2 a cause, 3 plain a kind)
const [, , L, nA = '50', prefix = 'hxd', mode = 'priority'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { officialsInCriminalPayOf } = await import(`${L}/src/domain/facts/officialsInPay.js`);
const { pickVariant } = await import(`${L}/src/kernel/proseHash.js`);
await loadGenerationLawPayloads();
const inst = (t, re) => (t.institutions || []).some((i) => re.test(i.name || ''));
const pw = (t, c) => (t.powerStructure?.factions || []).filter((f) => f.category === c);
const gov = (t) => (t.powerStructure?.factions || []).find((f) => f.isGoverning);
const past = (t, k) => (t.history?.historicalEvents || []).some((e) => (e.templateType || e.type) === k);
const stress = (t, k) => { const s = t.stress; const arr = Array.isArray(s) ? s : s ? [s] : []; return arr.some((x) => (x?.type || x) === k); };
// [cause, rank (1: the trouble's own engine, this town's present or own past; 2: a standing feature), predicate]
const T = {
  crime_wave: [
    ['criminal_power', 1, (t) => pw(t, 'criminal').length > 0],
    ['law_thin', 1, (t, f) => ['critical', 'collapsed'].includes(f.lawBand)],
    ['rival_rings', 1, (t, f) => !!f.rivalRings],
    ['no_force', 1, (t, f) => !f.orderForce?.kept],
    ['force_unpaid_or_cut', 1, (t, f) => !!f.orderForce?.kept && (!!f.orderForce?.volunteers || !!f.orderForce?.payCut || ['short', 'unpaid'].includes(f.orderForce?.pay))],
    ['old_crime_wave', 1, (t) => past(t, 'crime_wave')],
    ['thieves_house', 2, (t) => inst(t, /thieves'? guild/i)],
    ['contraband_water', 2, (t, f) => inst(t, /smuggl/i) && !!f.water?.navigable],
    ['underground', 2, (t) => inst(t, /underground/i)],
    ['assassins', 2, (t) => inst(t, /assassin|contract killer/i)],
    ['black_market', 2, (t) => inst(t, /black market/i)],
    ['whisper_market', 2, (t) => inst(t, /whisper market/i)],
    ['outlaws_near', 2, (t) => inst(t, /fence|outlaw|bandit/i)],
  ],
  guild_conflict: [
    ['old_guild_war', 1, (t) => past(t, 'guild_conflict')],
    ['guilds_rule', 1, (t) => gov(t)?.category === 'economy'],
    ['rival_power', 1, (t, f) => !!f.rivalPower],
    ['caravans', 2, (t) => inst(t, /caravan/i)],
    ['ships', 2, (t) => inst(t, /docks|port facilities|harbou?r/i)],
    ['crossroads', 2, (t, f) => f.route === 'crossroads'],
    ['fair', 2, (t) => inst(t, /annual fair/i)],
    ['trade_center', 2, (t) => inst(t, /international trade center|auction house|money changers/i)],
    ['luxury_quarter', 2, (t) => inst(t, /luxury goods quarter/i)],
  ],
  resource_scarcity: [
    ['famine', 1, (t, f) => !!f.famine?.famine],
    ['sickness', 1, (t) => stress(t, 'plague_onset')],
    ['war_levy', 1, (t, f) => f.warState === 'at war' || f.warState === 'front'],
    ['source_spent', 1, (t, f) => !!f.leadingSourceSpent || !!f.failedSource],
    ['old_scarcity', 1, (t) => past(t, 'resource_scarcity')],
    ['isolated', 2, (t, f) => f.route === 'isolated'],
  ],
  external_threat: [
    ['war', 1, (t, f) => f.warState === 'at war' || f.warState === 'front' || stress(t, 'wartime')],
    ['beasts_pressing', 1, (t) => stress(t, 'monster_pressure')],
    ['old_threat', 1, (t) => past(t, 'external_threat')],
    ['militia_only', 2, (t, f) => !!f.defence?.militia && !f.defence?.garrison],
    ['open_road', 2, (t, f) => f.route === 'crossroads'],
    ['beasts_frontier', 2, (t, f) => !!f.monsterFrontier],
  ],
  succession_crisis: [
    ['void', 1, (t) => stress(t, 'succession_void')],
    ['heir_house', 1, (t, f) => f.rulerKind === 'lord'],
    ['outranked', 1, (t, f) => !!f.seatOutranked],
    ['rival_power', 1, (t, f) => !!f.rivalPower],
    ['contested', 1, (t) => /Contested/.test(t.powerStructure?.publicLegitimacy?.label || '')],
    ['old_succession', 1, (t) => past(t, 'succession_crisis')],
  ],
  outside_debt: [
    ['creditors_sit', 1, (t) => stress(t, 'indebted')],
    ['old_crash', 1, (t) => past(t, 'market_crash') || past(t, 'trade_collapse')],
    ['hard_up', 1, (t) => ['Struggling', 'Poor'].includes(t.economicState?.prosperity)],
    ['merchants_rule', 1, (t) => gov(t)?.category === 'economy'],
    ['old_debt', 1, (t) => past(t, 'outside_debt')],
    ['through_trade', 2, (t) => !!t.economicState?.isEntrepot],
  ],
  great_flood: [
    ['old_flood', 1, (t) => past(t, 'great_flood')],
    ['coast', 2, (t, f) => !!f.water?.coast],
    ['river', 2, (t, f) => !!f.water?.river],
  ],
  legitimacy_crisis: [
    ['insurgency', 1, (t) => stress(t, 'insurgency')],
    ['creed', 1, (t) => stress(t, 'religious_conversion')],
    ['crisis_band', 1, (t, f) => !!f.legitimacyCrisis],
    ['outranked', 1, (t, f) => !!f.seatOutranked],
    ['lord', 1, (t, f) => f.rulerKind === 'lord'],
    ['rival_power', 1, (t, f) => !!f.rivalPower],
  ],
};
const PLAIN = { great_flood: 4 };
const WORDS = { 'crime_wave:rival_rings': 3, 'guild_conflict:guilds_rule': 3, 'guild_conflict:rival_power': 3, 'guild_conflict:fair': 3, 'resource_scarcity:war_levy': 3, 'external_threat:old_threat': 3, 'external_threat:war': 3, 'legitimacy_crisis:rival_power': 3, 'outside_debt:creditors_sit': 3, 'great_flood:river': 3, 'succession_crisis:old_succession': 3 };
const towns = [];
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const seed = `${prefix}-${size}-${i}`; const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const f = factsOf(t); const shown = []; const assigned = [];
  for (const x of t.history?.currentTensions || []) {
    const tab = T[x.type]; if (!tab) { shown.push(x.description); continue; }
    const hold = tab.filter(([, , p]) => { try { return !!p(t, f); } catch { return false; } }).map(([k, r]) => [k, r]);
    const r1 = hold.filter(([, r]) => r === 1).map(([k]) => k), r2 = hold.filter(([, r]) => r === 2).map(([k]) => k);
    const tier = r1.length ? r1 : r2;
    const cause = tier.length ? pickVariant(tier, `${seed}::held::${x.type}`) : 'plain';
    assigned.push({ kind: x.type, cause, hold: hold.map(([k]) => k) });
    const forms = cause === 'plain' ? [...Array(PLAIN[x.type] || 3).keys()].map((j) => `${x.type}:plain:${j}`) : [...Array(WORDS[`${x.type}:${cause}`] || 2).keys()].map((j) => `${x.type}:${cause}:${j}`);
    shown.push(pickVariant(forms, `${seed}::cause::${x.type}`));
  }
  towns.push({ seed, tier: t.tier, base: (t.history?.currentTensions || []).map((x) => x.description), shown, assigned });
}
const pct = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '-';
for (const k of Object.keys(T)) {
  const rows = towns.flatMap((t) => t.assigned.filter((a) => a.kind === k)); const n = rows.length;
  const raw = Object.fromEntries(T[k].map(([c]) => [c, rows.filter((r) => r.hold.includes(c)).length]));
  const wc = new Map(); for (const t of towns) for (let j = 0; j < t.shown.length; j++) if (t.shown[j].startsWith(k + ':')) wc.set(t.shown[j], (wc.get(t.shown[j]) || 0) + 1);
  const top = [...wc].sort((a, b) => b[1] - a[1])[0];
  const asg = {}; for (const r of rows) asg[r.cause] = (asg[r.cause] || 0) + 1;
  console.log(`${k} (${n}): ` + T[k].map(([c, rk]) => `${c}(r${rk}) raw ${pct(raw[c], n)} → ${pct(asg[c] || 0, n)}`).join(' · ') + ` · plain ${pct(asg.plain || 0, n)} · MAX WORDING ${top ? top[0].split(':').slice(1).join(':') + ' ' + pct(top[1], n) : '-'}`);
}
const metric = (key) => {
  const sh = (a, b) => { const s = new Set(a[key]); return b[key].some((d) => s.has(d)); };
  const tri = (a, b, c) => sh(a, b) || sh(a, c) || sh(b, c);
  const by = {}; let H = 0, M = 0; for (const size of SIZES) { const g = towns.filter((t) => t.tier === size); let h = 0, m = 0; for (let i = 0; i + 2 < g.length; i++) { m++; if (tri(g[i], g[i + 1], g[i + 2])) h++; } by[size] = pct(h, m); H += h; M += m; }
  // mixed: consecutive triples over the seed list interleaved across sizes (i-th of each size in turn)
  const mixed = []; for (let i = 0; i < +nA; i++) for (const size of SIZES) mixed.push(towns.find((t) => t.seed === `${prefix}-${size}-${i}`));
  let h = 0, m = 0; for (let i = 0; i + 2 < mixed.length; i++) { m++; if (tri(mixed[i], mixed[i + 1], mixed[i + 2])) h++; }
  let s = 12345; const r = () => (s = (s * 1103515245 + 12345) % 2147483648) / 2147483648; let hx = 0; const NX = 20000;
  for (let k = 0; k < NX; k++) { const a = towns[Math.floor(r() * towns.length)], b = towns[Math.floor(r() * towns.length)], c = towns[Math.floor(r() * towns.length)]; if (a === b || b === c || a === c) { k--; continue; } if (tri(a, b, c)) hx++; }
  return `same size ${pct(H, M)} (${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(' ')}); interleaved sizes ${pct(h, m)}; random triples ${pct(hx, NX)}`;
};
console.log('BASE  ' + metric('base'));
console.log('CAUSE ' + metric('shown'));
for (const size of ['city', 'metropolis', 'town']) { const g = towns.filter((t) => t.tier === size); const kc = {};
  for (let i = 0; i + 2 < g.length; i++) { const tr = [g[i], g[i + 1], g[i + 2]]; for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) for (const d of tr[a].shown) if (tr[b].shown.includes(d)) { const k = d.includes(':') && /^[a-z_]+:/.test(d) ? d : 'stored:' + d.slice(0, 40); kc[k] = (kc[k] || 0) + 1; } }
  console.log(size + ' shared: ' + Object.entries(kc).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, c]) => `${c}× ${k}`).join(' | ')); }
