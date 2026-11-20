// Under the forms of rule that send their own man: the seat's card as born today (title, role, house), and the powers beside it.
const [, , L, nA = '50', nB = '25'] = process.argv;
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { SIZES, DIALS } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { APPOINTED_GOVERNMENTS, seatHouseOf } = await import(`${L}/src/generators/people/representatives.js`);
await loadGenerationLawPayloads();
const seen = new Map(); const shape = new Map();
const add = (cfg, seed) => { const t = generateSettlementPipeline(birthConfig(cfg), null, { seed, customContent: {} });
  const gov = t.powerStructure.government; if (!APPOINTED_GOVERNMENTS.includes(gov)) return;
  const seat = seatHouseOf(t.institutions); const key = seat ? String(seat.house.name) : null;
  const card = (t.npcs || []).find((n) => n.id === 'seat') || (t.npcs || []).find((n) => key && n.institution?.kind === 'house' && n.institution.key === key) || null;
  const sig = `${gov} | seat house: ${key ?? 'none'} (${seat?.kind ?? '-'}) | card title: ${card?.title ?? 'NO CARD'} | role: ${card?.role ?? '-'} | card house: ${card?.institution?.kind ?? '-'}:${card?.institution?.key ?? '-'}`;
  shape.set(sig, (shape.get(sig) || 0) + 1);
  if (!seen.has(gov)) seen.set(gov, { tier: t.tier, name: t.name, card: card && { name: card.name, title: card.title, role: card.role, honorific: card.honorific, gender: card.gender, memberships: card.memberships, institution: card.institution }, powers: (t.powerStructure.factions || []).slice(0, 5).map((f) => `${f.faction}${f.isGoverning ? '*' : ''}`), royalHouses: t.institutions.filter((i) => /royal|noble|palace|steward|lord/i.test(String(i.name))).map((i) => i.name) }); };
for (const size of SIZES) { for (let i = 0; i < +nA; i++) add({ ...DEFAULT_CONFIG, settType: size }, `hxd-${size}-${i}`); for (let i = 0; i < +nB; i++) add({ ...DEFAULT_CONFIG, ...DIALS, settType: size }, `hxr-${size}-${i}`); }
for (const [s, n] of [...shape].sort((a, b) => b[1] - a[1])) console.log(String(n).padStart(3), s);
console.log('--- one example per form');
for (const [g, e] of seen) console.log(g, '::', JSON.stringify(e));
