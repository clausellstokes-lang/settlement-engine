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
const T = {
  crime_wave: [
    ['thieves_guild', (t) => pw(t, 'criminal').length > 0 || inst(t, /thieves'? guild/i)],
    ['law_thin', (t, f) => ['critical', 'collapsed'].includes(f.lawBand)],
    ['rival_rings', (t, f) => !!f.rivalRings],
    ['contraband_water', (t, f) => inst(t, /smuggl/i) && !!f.water?.navigable],
    ['underground', (t) => inst(t, /underground/i)],
    ['assassins', (t) => inst(t, /assassin|contract killer/i)],
    ['black_market', (t) => inst(t, /black market/i)],
    ['whisper_market', (t) => inst(t, /whisper market/i)],
    ['outlaws_near', (t) => inst(t, /fence|outlaw|bandit/i)],
  ],
  guild_conflict: [
    ['old_guild_war', (t) => past(t, 'guild_conflict')],
    ['guilds_rule', (t) => gov(t)?.category === 'economy'],
    ['caravans', (t) => inst(t, /caravan/i)],
    ['ships', (t) => inst(t, /docks|port facilities|harbou?r/i)],
    ['crossroads', (t, f) => f.route === 'crossroads'],
    ['craft_vs_merchant', (t) => (t.powerStructure?.factions || []).some((x) => /craft/i.test(x.faction)) && (t.powerStructure?.factions || []).some((x) => /merchant/i.test(x.faction))],
    ['fair', (t) => inst(t, /annual fair/i) && !inst(t, /major annual fairs/i)],
  ],
  resource_scarcity: [
    ['famine', (t, f) => !!f.famine?.famine],
    ['sickness', (t) => stress(t, 'plague_onset')],
    ['war_levy', (t, f) => f.warState === 'at war' || f.warState === 'front'],
    ['isolated', (t, f) => f.route === 'isolated'],
    ['source_spent', (t, f) => !!f.leadingSourceSpent || !!f.failedSource],
  ],
  external_threat: [
    ['war', (t, f) => f.warState === 'at war' || f.warState === 'front' || stress(t, 'wartime')],
    ['beasts_pressing', (t) => stress(t, 'monster_pressure')],
    ['militia_only', (t, f) => !!f.defence?.militia && !f.defence?.garrison],
    ['open_road', (t, f) => f.route === 'crossroads'],
    ['beasts_frontier', (t, f) => !!f.monsterFrontier],
  ],
  succession_crisis: [
    ['void', (t) => stress(t, 'succession_void')],
    ['heir_house', (t, f) => f.rulerKind === 'lord'],
    ['outranked', (t, f) => !!f.seatOutranked],
    ['rival_power', (t, f) => !!f.rivalPower],
    ['contested', (t) => /Contested/.test(t.powerStructure?.publicLegitimacy?.label || '')],
  ],
  outside_debt: [
    ['creditors_sit', (t) => stress(t, 'indebted')],
    ['old_crash', (t) => past(t, 'market_crash') || past(t, 'trade_collapse')],
    ['hard_up', (t, f) => ['Struggling', 'Poor'].includes(t.economicState?.prosperity)],
    ['merchants_rule', (t) => gov(t)?.category === 'economy'],
    ['through_trade', (t) => !!t.economicState?.isEntrepot],
  ],
  great_flood: [
    ['old_flood', (t) => past(t, 'great_flood')],
    ['coast', (t, f) => !!f.water?.coast],
    ['river', (t, f) => !!f.water?.river],
  ],
  legitimacy_crisis: [
    ['insurgency', (t) => stress(t, 'insurgency')],
    ['creed', (t) => stress(t, 'religious_conversion')],
    ['crisis_band', (t, f) => !!f.legitimacyCrisis],
    ['outranked', (t, f) => !!f.seatOutranked],
    ['lord', (t, f) => f.rulerKind === 'lord'],
    ['rival_power', (t, f) => !!f.rivalPower],
  ],
};
const towns = [];
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const seed = `${prefix}-${size}-${i}`; const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const f = factsOf(t); const shown = []; const assigned = [];
  for (const x of t.history?.currentTensions || []) {
    const tab = T[x.type]; if (!tab) { shown.push(x.description); continue; }
    const hold = tab.filter(([, p]) => { try { return !!p(t, f); } catch { return false; } }).map(([k]) => k);
    const cause = mode === 'priority' ? (hold[0] || 'plain') : (hold.length ? pickVariant(hold, `${seed}::held::${x.type}`) : 'plain');
    assigned.push({ kind: x.type, cause, hold });
    const forms = cause === 'plain' ? [0, 1, 2].map((j) => `${x.type}:plain:${j}`) : [0, 1].map((j) => `${x.type}:${cause}:${j}`);
    shown.push(pickVariant(forms, `${seed}::cause::${x.type}`));
  }
  towns.push({ seed, tier: t.tier, base: (t.history?.currentTensions || []).map((x) => x.description), shown, assigned });
}
const pct = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '-';
for (const k of Object.keys(T)) {
  const rows = towns.flatMap((t) => t.assigned.filter((a) => a.kind === k)); const n = rows.length;
  const raw = Object.fromEntries(T[k].map(([c]) => [c, rows.filter((r) => r.hold.includes(c)).length]));
  const asg = {}; for (const r of rows) asg[r.cause] = (asg[r.cause] || 0) + 1;
  console.log(`${k} (${n}): ` + T[k].map(([c]) => `${c} raw ${pct(raw[c], n)} → ${pct(asg[c] || 0, n)}`).join(' · ') + ` · plain ${pct(asg.plain || 0, n)}`);
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
