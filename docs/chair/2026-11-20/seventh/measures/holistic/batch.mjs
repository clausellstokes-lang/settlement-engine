// A holistic count of freshly born towns (prefix nobody tuned to). Usage: node batch.mjs <line> <perSizeDefault> <perSizeRandom>
const [, , L, nA = '50', nB = '25'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, DIALS } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
await loadGenerationLawPayloads();
const born = (cfg, seed) => generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
const corp = { untouched: [], everyDialRandom: [] };
const t0 = Date.now();
for (const size of SIZES) {
  for (let i = 0; i < +nA; i++) corp.untouched.push(born({ ...DEFAULT_CONFIG, settType: size }, `hxd-${size}-${i}`));
  for (let i = 0; i < +nB; i++) corp.everyDialRandom.push(born({ ...DEFAULT_CONFIG, ...DIALS, settType: size }, `hxr-${size}-${i}`));
}
console.log(`born ${corp.untouched.length}+${corp.everyDialRandom.length} in ${((Date.now() - t0) / 1000).toFixed(0)}s`);
const mean = (a) => a.length ? (a.reduce((x, y) => x + y, 0) / a.length) : 0;
const f1 = (x) => x.toFixed(1);
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
const top = (a, n = 5) => tally(a).slice(0, n).map(([k, c]) => `${k} ${(100 * c / a.length).toFixed(0)}%`).join(' · ');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function masker(t) {
  const names = new Set();
  const add = (s) => { if (typeof s === 'string' && s.trim().length > 2) names.add(s.trim()); };
  add(t.name);
  for (const n of t.npcs || []) { add(n.name); for (const p of String(n.name || '').split(/\s+/)) if (p.length > 3) add(p); add(n.institution); add(n.role); add(n.title); }
  for (const f of t.powerStructure?.factions || []) { add(f.faction); }
  add(t.powerStructure?.government); add(t.powerStructure?.governingName);
  for (const i of t.institutions || []) { add(i.name); add(String(i.name || '').replace(/\s*\(.*\)\s*$/, '')); }
  const list = [...names].sort((a, b) => b.length - a.length);
  const re = list.length ? new RegExp(list.map(esc).join('|'), 'gi') : null;
  return (s) => typeof s === 'string' ? (re ? s.replace(re, '§') : s).replace(/\b(the|The|a|an|A|An)\s+§/g, '§').replace(/\d+/g, '#') : '';
}
for (const [label, towns] of Object.entries(corp)) {
  console.log(`\n===== ${label.toUpperCase()} (${towns.length} towns) =====`);
  console.log('tier        pop(med)  houses people ties powers events tensions conflictsHIGH  underStress  legit<45');
  for (const size of SIZES) {
    const g = towns.filter((t) => t.tier === size);
    const pops = g.map((t) => t.population).sort((a, b) => a - b);
    const hi = g.map((t) => (t.powerStructure?.conflicts || []).filter((c) => /high/i.test(String(c.intensity))).length);
    console.log(`${size.padEnd(11)} ${String(pops[pops.length >> 1]).padStart(7)}  ${f1(mean(g.map((t) => t.institutions.length))).padStart(6)} ${f1(mean(g.map((t) => t.npcs.length))).padStart(6)} ${f1(mean(g.map((t) => t.relationships.length))).padStart(4)} ${f1(mean(g.map((t) => t.powerStructure.factions.length))).padStart(6)} ${f1(mean(g.map((t) => t.history.historicalEvents.length))).padStart(6)} ${f1(mean(g.map((t) => t.history.currentTensions.length))).padStart(8)} ${f1(mean(hi)).padStart(8)}       ${String(Math.round(100 * g.filter((t) => t.stress).length / g.length)).padStart(3)}%       ${String(Math.round(100 * g.filter((t) => (t.powerStructure.publicLegitimacy?.score ?? 100) < 45).length / g.length)).padStart(3)}%`);
  }
  const stressed = towns.filter((t) => t.stress);
  console.log(`under a stress at birth: ${stressed.length}/${towns.length}; kinds: ${top(stressed.map((t) => Array.isArray(t.stress) ? t.stress.map((s) => s.type).join('+') : t.stress.type), 6)}`);
  console.log(`legitimacy label: ${top(towns.map((t) => t.powerStructure.publicLegitimacy?.label), 6)}`);
  console.log(`prosperity: ${top(towns.map((t) => t.economicState?.prosperity), 7)}`);
  const govs = towns.map((t) => t.powerStructure.government);
  console.log(`government names: ${new Set(govs).size} distinct; top: ${top(govs, 8)}`);
  console.log(`governing power's kind: ${top(towns.map((t) => (t.powerStructure.factions.find((f) => f.isGoverning) || {}).category), 8)}`);
  console.log(`culture: ${new Set(towns.map((t) => t.culturalIdentity?.key)).size} distinct; top: ${top(towns.map((t) => t.culturalIdentity?.key), 4)}`);
  console.log(`criminal capture rung: ${top(towns.map((t) => t.powerStructure.criminalCaptureState), 5)}`);
  // sameness
  const pools = { 'person: short goal': [], 'person: long goal': [], 'person: secret': [], 'person: own hook': [], 'tie: description': [], 'tie: tension': [], 'tension: description': [], 'history event: description': [], 'arrival scene (1st sentence)': [], 'pressure sentence': [] };
  let dupGoalTowns = 0, echoTowns = 0, dupSecretTowns = 0, oddSecret = 0, nSecret = 0;
  for (const t of towns) {
    const m = masker(t);
    const sg = (t.npcs || []).map((n) => m(n.goal?.short)).filter(Boolean);
    const sec = (t.npcs || []).map((n) => n.secret?.what).filter(Boolean);
    if (new Set(sg).size < sg.length) dupGoalTowns++;
    if (new Set(sec).size < sec.length) dupSecretTowns++;
    for (const n of t.npcs || []) {
      if (n.goal?.short) pools['person: short goal'].push(m(n.goal.short));
      if (n.goal?.long) pools['person: long goal'].push(m(n.goal.long));
      if (n.secret?.what) { pools['person: secret'].push(n.secret.what); nSecret++; if (/their product|customers|their shop|their goods|their stall/i.test(n.secret.what) && !/economy|merchant|craft|trade/i.test(String(n.category))) oddSecret++; }
      for (const h of n.plotHooks || []) pools['person: own hook'].push(m(h));
    }
    for (const r of t.relationships || []) { if (r.description) pools['tie: description'].push(m(r.description)); if (r.tension) pools['tie: tension'].push(m(r.tension)); }
    for (const x of t.history.currentTensions || []) pools['tension: description'].push(m(x.description));
    for (const e of t.history.historicalEvents || []) pools['history event: description'].push(m(e.description));
    if (t.arrivalScene) pools['arrival scene (1st sentence)'].push(m(String(t.arrivalScene).split(/(?<=\.)\s/)[0]));
    if (t.pressureSentence) pools['pressure sentence'].push(m(t.pressureSentence));
    const past = new Set((t.history.historicalEvents || []).map((e) => e.templateType));
    if ((t.history.currentTensions || []).some((x) => past.has(x.type))) echoTowns++;
  }
  console.log('\nSAMENESS (names masked): pool · draws · distinct · the commonest line\'s share · share of draws that are a line seen 5+ times');
  for (const [k, a] of Object.entries(pools)) {
    if (!a.length) { console.log(`${k.padEnd(30)} none`); continue; }
    const tl = tally(a); const rep = tl.filter(([, c]) => c >= 5).reduce((x, [, c]) => x + c, 0);
    console.log(`${k.padEnd(30)} ${String(a.length).padStart(6)} ${String(tl.length).padStart(6)}  ${(100 * tl[0][1] / a.length).toFixed(1).padStart(5)}%  ${(100 * rep / a.length).toFixed(0).padStart(3)}%   e.g. "${tl[0][0].slice(0, 110)}"`);
  }
  console.log(`towns where two people hold the same short goal (names masked): ${dupGoalTowns}/${towns.length}; the same secret twice: ${dupSecretTowns}/${towns.length}`);
  console.log(`towns where a tension of today is of the same kind as an event of their own past: ${echoTowns}/${towns.length}`);
  console.log(`rough proxy: secrets about "their product/customers/shop/goods" held by people not of a trading kind: ${oddSecret}/${nSecret}`);
}
