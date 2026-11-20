// PAGE-7 CAUSES-DATA measure (a): THE BUILT PREDICATES AGAINST sim.mjs's, on sim.mjs's 900 towns (hxd-<size>-0..N-1).
// For every town and every cause of the eight tables, the built predicate (src/domain/display/tensionCauseHolds.js, keyed by
// src/data/tensionCauses.js's `holds`) against the ruled one (measures/page-5/sim.mjs :: T, copied verbatim below). Counted
// twice: over every town, and over the towns whose live tensions hold the cause's kind (sim.mjs's `raw` denominator).
// Each disagreement is NAMED (town, cause, which side holds) and classed:
//   LIVE ROSTER   the only difference is a house sim.mjs reads on the raw roster that is not live (listed, not cured);
//   NOT CATALOGUE sim.mjs's pattern matched a house name the catalogue does not hold (a DM's own, or a renamed row);
//   OTHER         anything else: the home differs from sim.mjs's reading (the finding, not bent).
// Run: node docs/chair/2026-11-20/content/page/measures/page-7/holds.mjs $PWD 150 > <out>
const [, , L, nA = '150', prefix = 'hxd'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { TENSION_CAUSES } = await import(`${L}/src/data/tensionCauses.js`);
const { TENSION_CAUSE_HOLDS } = await import(`${L}/src/domain/display/tensionCauseHolds.js`);
const { CAUSE_HOUSES } = await import(`${L}/src/domain/facts/causeHouses.js`);
const { isLiveInstitution } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
const { declarationAdmits, declarationOf } = await import(`${L}/src/domain/facts/factVocabulary.js`);
await loadGenerationLawPayloads();
// ── sim.mjs's helpers and table, verbatim (old_crime_wave kept here only to show it is not built) ──
const inst = (t, re) => (t.institutions || []).some((i) => re.test(i.name || ''));
const pw = (t, c) => (t.powerStructure?.factions || []).filter((f) => f.category === c);
const gov = (t) => (t.powerStructure?.factions || []).find((f) => f.isGoverning);
const past = (t, k) => (t.history?.historicalEvents || []).some((e) => (e.templateType || e.type) === k);
const stress = (t, k) => { const s = t.stress; const arr = Array.isArray(s) ? s : s ? [s] : []; return arr.some((x) => (x?.type || x) === k); };
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
// the house patterns, for classing a house cause's disagreement
const HOUSE_RE = { thieves_house: /thieves'? guild/i, contraband_water: /smuggl/i, underground: /underground/i, assassins: /assassin|contract killer/i,
  black_market: /black market/i, whisper_market: /whisper market/i, outlaws_near: /fence|outlaw|bandit/i, caravans: /caravan/i,
  ships: /docks|port facilities|harbou?r/i, fair: /annual fair/i, trade_center: /international trade center|auction house|money changers/i, luxury_quarter: /luxury goods quarter/i };
const CATALOGUE_NAMES = new Set(Object.values(CAUSE_HOUSES).flatMap((s) => [...s]));
const simOf = (kind, id) => T[kind].find(([c]) => c === id);
let towns = 0, checks = 0, kindChecks = 0; const dis = []; const notBuilt = new Set();
// addendum 3: every line a cause can print declares atoms its predicate implies; each declaration is checked where it can print
let lineChecks = 0; const refused = [];
const perCause = {};
for (const size of SIZES) for (let i = 0; i < +nA; i++) {
  const seed = `${prefix}-${size}-${i}`;
  const t = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed, customContent: {} });
  const f = factsOf(t); towns++;
  const liveKinds = new Set((t.history?.currentTensions || []).map((x) => x.type));
  for (const [kind, rows] of Object.entries(T)) for (const [id] of rows) if (!TENSION_CAUSES[kind].causes.some((c) => c.id === id)) notBuilt.add(`${kind}:${id}`);
  for (const [kind, table] of Object.entries(TENSION_CAUSES)) for (const c of table.causes) {
    const sim = simOf(kind, c.id); if (!sim) { dis.push({ seed, kind, id: c.id, cls: 'NO SIM ROW' }); continue; }
    let s; try { s = !!sim[2](t, f); } catch { s = false; }
    const b = !!TENSION_CAUSE_HOLDS[c.holds](t, f);
    const guildless = !!table.withoutItsHouse && f.guild === false;
    if (b && !guildless) for (const w of c.wordings) { lineChecks++; const v = declarationAdmits(declarationOf(w), f); if (!v.admitted) refused.push(`${seed} ${kind}:${c.id} "${w.text}" refused ${JSON.stringify(v.refused)}`); }
    checks++; const inKind = liveKinds.has(kind); if (inKind) kindChecks++;
    const pc = (perCause[`${kind}:${c.id}`] ||= { sim: 0, built: 0, dis: 0, simK: 0, builtK: 0, disK: 0 });
    pc.sim += s; pc.built += b; if (inKind) { pc.simK += s; pc.builtK += b; }
    if (s === b) continue;
    pc.dis++; if (inKind) pc.disK++;
    let cls = 'OTHER', why = '';
    const re = HOUSE_RE[c.id];
    if (re) {
      const hit = (t.institutions || []).filter((x) => re.test(x.name || ''));
      const liveHit = hit.filter((x) => isLiveInstitution(x));
      if (s && !b && hit.length && !liveHit.length) { cls = 'LIVE ROSTER'; why = hit.map((x) => `${x.name} [${x.status || (x._worldPulseInactive ? 'inactive' : '?')}]`).join('; '); }
      else if (s && !b && liveHit.length && liveHit.every((x) => !CATALOGUE_NAMES.has(String(x.name).toLowerCase()))) { cls = 'NOT CATALOGUE'; why = liveHit.map((x) => x.name).join('; '); }
      else why = `houses matching sim's pattern: ${hit.map((x) => `${x.name}${isLiveInstitution(x) ? '' : ' [not live]'}`).join('; ') || 'none'}`;
    } else if (c.id === 'hard_up') why = `economicState.prosperity=${JSON.stringify(t.economicState?.prosperity)} facts.prosperity=${JSON.stringify(f.prosperity)}`;
    else if (c.holds === 'governedByTrade') why = `isGoverning=${JSON.stringify((t.powerStructure?.factions || []).filter((x) => x.isGoverning).map((x) => x.category))} governingName=${JSON.stringify(t.powerStructure?.governingName)}`;
    else if (c.holds.startsWith('crisis') || c.id === 'war') why = `stress=${JSON.stringify((Array.isArray(t.stress) ? t.stress : t.stress ? [t.stress] : []).map((x) => x?.type || x))} stressors=${JSON.stringify((Array.isArray(t.stressors) ? t.stressors : t.stressors ? [t.stressors] : []).map((x) => x?.type || x))} kinds=${JSON.stringify(f.crisis.kinds)}`;
    else if (c.id === 'contested') why = `label=${JSON.stringify(t.powerStructure?.publicLegitimacy?.label)}`;
    dis.push({ seed, kind, id: c.id, sim: s, built: b, inKind, cls, why });
  }
}
console.log(`DECLARED LINES: ${lineChecks} checks (every wording of every cause that holds, every town); REFUSED ${refused.length}`);
for (const r of refused) console.log(`  [REFUSED] ${r}`);
console.log(`TOWNS ${towns} · CHECKS ${checks} (every town × every built cause) · IN-KIND CHECKS ${kindChecks} (towns whose live tensions hold the kind)`);
console.log(`NOT BUILT (sim.mjs rows with no built cause): ${[...notBuilt].join(', ') || 'none'}`);
for (const [k, v] of Object.entries(perCause)) console.log(`  ${k.padEnd(36)} all towns: sim ${String(v.sim).padStart(3)} built ${String(v.built).padStart(3)} disagree ${String(v.dis).padStart(3)} · in kind: sim ${String(v.simK).padStart(3)} built ${String(v.builtK).padStart(3)} disagree ${String(v.disK).padStart(3)}`);
const by = (cls) => dis.filter((d) => d.cls === cls);
console.log(`DISAGREEMENTS ${dis.length} (in kind ${dis.filter((d) => d.inKind).length}) · LIVE ROSTER ${by('LIVE ROSTER').length} · NOT CATALOGUE ${by('NOT CATALOGUE').length} · OTHER ${by('OTHER').length} · NO SIM ROW ${by('NO SIM ROW').length}`);
for (const d of dis) console.log(`  [${d.cls}] ${d.seed} ${d.kind}:${d.id} sim=${d.sim} built=${d.built}${d.inKind ? ' IN KIND' : ''} — ${d.why}`);
