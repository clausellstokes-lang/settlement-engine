// U6 PROBE (SEAT-10): under the lit law at birth, which printed lines set a seat against its own holder?
// (1) relation rows whose pair is {the form (governing row), its holder}; (2) the holder row's standing line;
// (3) the standing SEAT_CONTESTED_STANDING on a row that holds the seat. Usage: node probe.mjs <root> <perSize>
const [root, perArg] = process.argv.slice(2); const PER = Number(perArg || 25);
const imp = (rel) => import(`${root}/${rel}`);
const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
const { governingFactionOf } = await imp('src/domain/rulingPower.js');
const { holderOf } = await imp('src/domain/seat/holderOfSeat.js');
const { coupContenders } = await imp('src/domain/rulingPowerCoup.js');
const { SEAT_CONTESTED_STANDING } = await imp('src/generators/power/factionStanding.js');
await loadGenerationLawPayloads();
const nameOf = (f) => String(f?.faction || f?.name || '');
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const out = { births: 0, holderApart: 0, relRows: 0, relTypes: {}, relLines: {}, holderStandings: {}, contestedOnHolder: 0, contestedNotInLitField: 0, contestedRows: 0, examples: [] };
const bump = (o, k) => { o[k] = (o[k] || 0) + 1; };
const shape = (t) => String(t || '').replace(/\b[A-Z][a-zà-ÿ]+(?:\s+[A-Z][a-zà-ÿ]+)*\b/g, '<Name>').slice(0, 160);
for (const settType of SIZES) for (let i = 0; i < PER; i += 1) {
  const seed = `u6p-${settType}-${i}`;
  const s = generateSettlementPipeline(birthConfig({ settType, culture: 'germanic' }), null, { seed, customContent: {} });
  out.births += 1;
  const g = governingFactionOf(s); const form = nameOf(g);
  const h = holderOf(s, { audience: 'owner' })?.holder; const holder = h ? nameOf(h) : null;
  const factions = s.powerStructure?.factions || [];
  const field = new Set((coupContenders(s).challengers || []).map((c) => c.name));
  for (const f of factions) if (f?.standing === SEAT_CONTESTED_STANDING || String(f?.desc || '').includes(SEAT_CONTESTED_STANDING)) {
    out.contestedRows += 1; if (holder && nameOf(f) === holder) out.contestedOnHolder += 1; if (!field.has(nameOf(f))) out.contestedNotInLitField += 1;
  }
  if (!holder || holder === form) continue;
  out.holderApart += 1;
  const hRow = factions.find((f) => nameOf(f) === holder);
  bump(out.holderStandings, shape(hRow?.standing || hRow?.desc || '(none)'));
  for (const r of (s.powerStructure?.factionRelationships || s.factionRelationships || [])) {
    const p = r?.pair || [r?.a, r?.b]; if (!(p.includes(form) && p.includes(holder))) continue;
    out.relRows += 1; bump(out.relTypes, `${r.type}/${r.trend || r.stability || ''}`); bump(out.relLines, shape(r.narrative || r.desc || r.line));
    if (out.examples.length < 8) out.examples.push({ seed, form, holder, type: r.type, line: String(r.narrative || r.desc || '').slice(0, 220), holderStanding: String(hRow?.standing || hRow?.desc || '').slice(0, 220) });
  }
}
const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 25);
console.log(JSON.stringify({ ...out, relTypes: top(out.relTypes), relLines: top(out.relLines), holderStandings: top(out.holderStandings) }, null, 1));
