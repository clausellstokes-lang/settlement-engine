// MEASURE (the chair's own, read-only; the line's tip, laws dark): two pairs of sentences that read as opposite on one page.
const R = (process.env.TREE || '/home/user/wt/line') + '/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const { buildPrintProse } = await import(R + 'domain/display/stateProse/printProse.js');
const D = await import(R + 'data/dossierStateProse/defense.generated.js');
const E = await import(R + 'data/dossierStateProse/economy.generated.js');
const G = await import(R + 'data/dossierStateProse/general.generated.js');
await loadGenerationLawPayloads();
// (i) where each family lives: position, pool, marks
const desks = { defense: Object.values(D)[0], economy: Object.values(E)[0], general: Object.values(G)[0] };
const FAM = {
  WAGES: /pays wages for its defen[cs]e/,
  NOMONEY: /(no money to pay them for it|always short of money for its defen[cs]e)/,
  FOODFAIL: /food trades (are failing|at .* are struggling|are struggling)/,
  FOODFINE: /(suggests to a visitor that food is a worry|worries much about one poor harvest|eats, and what it keeps put by)/,
};
const where = {};
for (const [desk, obj] of Object.entries(desks)) for (const [pos, block] of Object.entries(obj)) for (const [pool, vars] of Object.entries(block.pools || {})) for (const v of vars) for (const [fam, re] of Object.entries(FAM)) if (re.test(v.text)) (where[fam] ||= new Set()).add(`${desk} ${pos} [${pool}] marks(${(v.marks || []).join('; ')})`);
for (const [fam, set] of Object.entries(where)) { console.log('FAMILY', fam, ':', set.size, 'variants'); for (const x of [...set].slice(0, 12)) console.log('   ', x.slice(0, 200)); }
// (ii) how often they meet on one page
const N = Number(process.argv[2] || 100);
const sizes = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const ex = { wages: [], food: [] };
console.log('\nsize\tn\tWAGES\tNOMONEY\tBOTH\t|\tFOODFAIL\tFOODFINE\tBOTH');
const tot = [0, 0, 0, 0, 0, 0, 0];
for (const settType of sizes) {
  const c = [0, 0, 0, 0, 0, 0, 0];
  for (let i = 0; i < N; i++) {
    const seed = `dz-${settType}-${i}`;
    const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
    const pp = buildPrintProse(s, {});
    const all = Object.entries(pp).flatMap(([tab, mounts]) => Object.entries(mounts).map(([m, t]) => [m, String(t).replaceAll(s.name, '{settlement}')]));
    const has = (re) => all.find(([, t]) => re.test(t));
    const w = has(FAM.WAGES), nm = has(FAM.NOMONEY), ff = has(FAM.FOODFAIL), fo = has(FAM.FOODFINE);
    c[0]++; if (w) c[1]++; if (nm) c[2]++; if (w && nm) { c[3]++; if (ex.wages.length < 3) ex.wages.push(`${seed} ${s.name}: [${w[0]}] + [${nm[0]}]`); }
    if (ff) c[4]++; if (fo) c[5]++; if (ff && fo) { c[6]++; if (ex.food.length < 3) ex.food.push(`${seed} ${s.name}: [${ff[0]}] + [${fo[0]}]`); }
  }
  c.forEach((v, k) => { tot[k] += v; });
  console.log(`${settType}\t${c[0]}\t${c[1]}\t${c[2]}\t${c[3]}\t|\t${c[4]}\t${c[5]}\t${c[6]}`);
}
console.log(`ALL\t${tot[0]}\t${tot[1]}\t${tot[2]}\t${tot[3]}\t|\t${tot[4]}\t${tot[5]}\t${tot[6]}`);
console.log('EXAMPLES wages:', ex.wages.join(' || ')); console.log('EXAMPLES food:', ex.food.join(' || '));
