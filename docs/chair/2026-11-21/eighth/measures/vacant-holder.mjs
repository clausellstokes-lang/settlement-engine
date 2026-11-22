// MEASURE (the chair's own, read-only): on LIT births, how often does a page say "No one holds the seat"
// while a power's description says that power sits in / holds / governs through the seat (the seat law's standing line)?
const R = (process.env.TREE || '/home/user/wt/lit') + '/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const ga = await import(R + 'domain/display/governanceAccount.js');
await loadGenerationLawPayloads();
const N = Number(process.argv[2] || 100);
const HOLD = /(They hold the .{1,60} seat, and answer for what it does\.|They sit in the .{1,60} themselves, and its rulings are their own\.|They govern through the .{1,60}, and what it orders is their order\.|They hold the .{1,60}, and nothing it decides is decided without them\.|They are the ones who sit in the .{1,60}, and its word is theirs\.)/;
const sizes = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const rows = []; const ex = [];
let lit = null;
for (const settType of sizes) {
  let n = 0, vacant = 0, both = 0, holderLine = 0;
  for (let i = 0; i < N; i++) {
    const seed = `vh-${settType}-${i}`;
    const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
    if (lit === null) lit = JSON.stringify(Object.fromEntries(Object.entries(s.config || {}).filter(([k]) => /LawVersion/.test(k))));
    n++;
    let g = ''; try { g = String(ga.governanceAccountOf(s, {})?.text || ''); } catch { g = ''; }
    const isVacant = g.includes('No one holds the seat');
    const hold = (s.powerStructure?.factions || []).map((f) => [f.faction, (HOLD.exec(String(f.desc || '')) || [])[1]]).filter((x) => x[1]);
    if (isVacant) vacant++;
    if (hold.length) holderLine++;
    if (isVacant && hold.length) { both++; if (ex.length < 8) ex.push(`${seed} ${s.name} (${s.powerStructure?.governingName}; trouble ${s.stress?.type || 'none'}): "${g.slice(0, 60)}…" + ${hold[0][0]}: "${hold[0][1]}"`); }
  }
  rows.push(`${settType}\t${n}\tvacant ${vacant}\tholder-line ${holderLine}\tBOTH ${both}`);
}
console.log('laws:', lit); console.log(rows.join('\n')); console.log('EXAMPLES:'); console.log(ex.join('\n'));
