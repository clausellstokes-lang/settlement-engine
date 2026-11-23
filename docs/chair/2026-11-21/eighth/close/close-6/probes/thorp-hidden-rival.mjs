// CLOSE-6 (the chair's N-question of 11:10 UTC): in the lit thorps powerSeatRender's re-pick found (the governing note AND an
// outranking rival), is the named rival a hidden power, and which have a hidden rival at all. TREE=<worktree> node <this>
const R = process.env.TREE + '/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { DEFAULT_CONFIG } = await import(R + 'store/configSlice.js');
const { governingFactionOf, nameOf } = await import(R + 'domain/rulingPower.js');
await loadGenerationLawPayloads();
for (const i of (process.argv[2] || '35,73,96,106,109,136').split(',').map(Number)) {
  const s = generateSettlementPipeline(birthConfig({ ...DEFAULT_CONFIG, settType: 'thorp' }), null, { seed: `rulers-thorp-${i}`, customContent: {} });
  const gov = governingFactionOf(s);
  const facs = s.powerStructure.factions || [];
  const outrank = facs.filter((f) => f !== gov && f.power > gov.power);
  const fmt = (f) => `${nameOf(f)} p${f.power}${f.hidden ? ' HIDDEN' : ''}${f.category ? ' [' + f.category + ']' : ''}`;
  console.log(`rulers-thorp-${i}\tlaws ${s.config?._seatLawVersion}/${s.config?._fortuneLawVersion}\tgov ${fmt(gov)}\toutranking: ${outrank.map(fmt).join('; ') || '-'}\thidden any: ${facs.filter((f) => f.hidden).map(fmt).join('; ') || '-'}`);
}
