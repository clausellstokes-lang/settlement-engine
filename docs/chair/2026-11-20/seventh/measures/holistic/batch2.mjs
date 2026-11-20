const [, , L, nA = '50'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
await loadGenerationLawPayloads();
const towns = [];
for (const size of SIZES) for (let i = 0; i < +nA; i++) towns.push(generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: size }), null, { seed: `hxd-${size}-${i}`, customContent: {} }));
const mean = (a) => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
const tally = (a) => { const m = new Map(); for (const k of a) m.set(k, (m.get(k) || 0) + 1); return [...m].sort((x, y) => y[1] - x[1]); };
const top = (a, n = 6) => tally(a).slice(0, n).map(([k, c]) => `${k} ${(100 * c / a.length).toFixed(0)}%`).join(' · ');
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const masker = (t) => { const names = new Set(); const add = (s) => { if (typeof s === 'string' && s.trim().length > 2) names.add(s.trim()); };
  add(t.name); for (const n of t.npcs || []) { add(n.name); for (const p of String(n.name || '').split(/\s+/)) if (p.length > 3) add(p); add(n.institution); add(n.role); add(n.title); }
  for (const f of t.powerStructure?.factions || []) add(f.faction); add(t.powerStructure?.government); add(t.powerStructure?.governingName);
  for (const i of t.institutions || []) { add(i.name); add(String(i.name || '').replace(/\s*\(.*\)\s*$/, '')); }
  const re = new RegExp([...names].sort((a, b) => b.length - a.length).map(esc).join('|'), 'gi');
  return (s) => typeof s === 'string' ? s.replace(re, '§').replace(/\b(the|The|a|an|A|An)\s+§/g, '§').replace(/\d+/g, '#') : ''; };
console.log('LEGITIMACY BY TIER (untouched settings), all towns, then towns born under NO stress');
for (const size of SIZES) {
  const g = towns.filter((t) => t.tier === size); const calm = g.filter((t) => !t.stress);
  const pl = (t) => t.powerStructure.publicLegitimacy || {};
  const bd = (k) => mean(g.map((t) => pl(t).breakdown?.[k] ?? 0)).toFixed(1);
  console.log(`${size.padEnd(10)} score mean ${mean(g.map((t) => pl(t).score ?? 0)).toFixed(0)} | ${top(g.map((t) => pl(t).label), 5)}`);
  console.log(`${''.padEnd(10)} calm only (${calm.length}): score mean ${mean(calm.map((t) => pl(t).score ?? 0)).toFixed(0)} | ${top(calm.map((t) => pl(t).label), 5)}`);
  console.log(`${''.padEnd(10)} breakdown means: prosperity ${bd('prosperity')} safety ${bd('safety')} defense ${bd('defense')} food ${bd('food')}; govMultiplier ${mean(g.map((t) => pl(t).govMultiplier ?? 1)).toFixed(2)} crimMultiplier ${mean(g.map((t) => pl(t).crimMultiplier ?? 1)).toFixed(2)}`);
  console.log(`${''.padEnd(10)} stability words: ${top(g.map((t) => String(t.powerStructure.stability).replace(/\s*\(.*$/, '').replace(/;.*$/, '')), 4)}`);
  console.log(`${''.padEnd(10)} government: ${top(g.map((t) => t.powerStructure.government), 4)}`);
  console.log(`${''.padEnd(10)} prosperity: ${top(g.map((t) => t.economicState?.prosperity), 4)} | defense: ${top(g.map((t) => t.defenseProfile?.readiness?.label ?? t.defenseProfile?.label ?? Object.keys(t.defenseProfile || {}).join('/')), 3)}`);
}
console.log('\nREPEATS INSIDE ONE TOWN (names masked), by tier: share of towns with a repeated line; mean repeated lines per town');
for (const size of SIZES) {
  const g = towns.filter((t) => t.tier === size);
  const rep = (pick) => { const per = g.map((t) => { const m = masker(t); const a = pick(t).map(m).filter(Boolean); return a.length - new Set(a).size; }); return `${Math.round(100 * per.filter((x) => x > 0).length / g.length)}% / ${mean(per).toFixed(1)}`; };
  console.log(`${size.padEnd(10)} goal(short) ${rep((t) => t.npcs.map((n) => n.goal?.short))}   goal(long) ${rep((t) => t.npcs.map((n) => n.goal?.long))}   own hook ${rep((t) => t.npcs.flatMap((n) => n.plotHooks || []))}   tie line ${rep((t) => t.relationships.map((r) => r.description))}   tie tension ${rep((t) => t.relationships.map((r) => r.tension))}`);
}
const ex = towns.find((t) => t.tier === 'village' && !t.stress && (t.powerStructure.publicLegitimacy?.score ?? 100) < 45);
if (ex) console.log('\nEXAMPLE calm village with legitimacy < 45:', ex.name, JSON.stringify(ex.powerStructure.publicLegitimacy).slice(0, 420), '| stability:', ex.powerStructure.stability, '| prosperity:', ex.economicState?.prosperity, '| defense:', JSON.stringify(ex.defenseProfile).slice(0, 260));
