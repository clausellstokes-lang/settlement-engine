// CLOSE-3 unit (1) (a): the chair's measure re-run, W1 counted beside W3, the vacancy read against its source.
const R = (process.env.TREE || '/home/user/wt/lit') + '/src/';
const { generateSettlementPipeline } = await import(R + 'generators/generateSettlementPipeline.js');
const { birthConfig, loadGenerationLawPayloads } = await import(R + 'domain/density/densityCreateBoundary.js');
const ga = await import(R + 'domain/display/governanceAccount.js');
const { rulingChainOf } = await import(R + 'domain/dossier/powerStrata.js');
const { isSeatVacant } = await import(R + 'domain/people/seatKeeper.js');
const { SEAT_HOLDER_LINES } = await import(R + 'data/seatHolderLines.js');
await loadGenerationLawPayloads();
const N = Number(process.argv[2] || 100);
const esc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const toRe = (line) => new RegExp(esc(line).replace(/\\\{holder\\\|[^}]*\\\}/g, '\\w+').replace(/\\\{form's\\\}/g, '.{1,70}').replace(/\\\{form\\\}/g, '.{1,70}').replace(/\\\{holder\\\}/g, '.{1,70}'), 'i');
const W3 = SEAT_HOLDER_LINES.standing.map(toRe);
const W1 = SEAT_HOLDER_LINES.relation.map(toRe);
const W3v = (SEAT_HOLDER_LINES.standingVacant || []).map(toRe);
const W1v = (SEAT_HOLDER_LINES.relationVacant || []).map(toRe);
const hit = (res, t) => res.some((re) => re.test(String(t || '')));
const sizes = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const out = []; const ex = []; let lit = null;
const tot = { births: 0, page: 0, src: 0, predDiff: 0, w3: 0, w1: 0, both3: 0, both1: 0, bothAny: 0, outsideSV: 0, vacOutsideSV: 0, heldVac3: 0, heldVac1: 0, vacNoVac3: 0 };
for (const settType of sizes) {
  const c = { page: 0, w3: 0, w1: 0, both3: 0, both1: 0, bothAny: 0, outsideSV: 0, vacOutsideSV: 0, w3v: 0, w1v: 0, heldVac: 0 };
  for (let i = 0; i < N; i++) {
    const seed = `vh-${settType}-${i}`;
    const s = generateSettlementPipeline(birthConfig({ settType }), null, { seed, customContent: {} });
    if (lit === null) lit = JSON.stringify(Object.fromEntries(Object.entries(s.config || {}).filter(([k]) => /LawVersion/.test(k))));
    tot.births++;
    let g = ''; try { g = String(ga.governanceAccountOf(s, {})?.text || ''); } catch { g = ''; }
    const page = g.includes('No one holds the seat');
    const chain = rulingChainOf(s);
    const chainMissing = chain.absence?.kind === 'missing_seat';
    const src = isSeatVacant(s);
    if (page !== chainMissing || chainMissing !== src) tot.predDiff++;
    const types = [s.stress?.type, ...(Array.isArray(s.stress) ? s.stress.map((x) => x?.type) : []), ...(Array.isArray(s.stressors) ? s.stressors.map((x) => x?.type || x?.key || x) : [])].filter(Boolean).map(String);
    const sv = types.includes('succession_void');
    const facs = s.powerStructure?.factions || [];
    const rels = s.powerStructure?.factionRelationships || [];
    const has3 = facs.some((f) => hit(W3, f.desc));
    const has1 = rels.some((r) => hit(W1, r.narrative));
    const has3v = facs.some((f) => hit(W3v, f.desc));
    const has1v = rels.some((r) => hit(W1v, r.narrative));
    if (page) c.page++; if (src) tot.src++;
    if (has3) c.w3++; if (has1) c.w1++; if (has3v) c.w3v++; if (has1v) c.w1v++;
    if (page && has3) c.both3++; if (page && has1) c.both1++;
    if (page && (has3 || has1)) { c.bothAny++; if (!sv) c.outsideSV++; if (ex.length < 40) ex.push(`${seed}\t${s.powerStructure?.governingName || facs.find((f) => f.isGoverning)?.faction}\ttypes=${types.join(',')}\tW3=${has3}\tW1=${has1}`); }
    if (page && !sv) c.vacOutsideSV++;
    if (!page && (has3v || has1v)) c.heldVac++;
  }
  out.push(`${settType}\t${N}\tvacant ${c.page}\tW3 ${c.w3}\tW1 ${c.w1}\tBOTH-W3 ${c.both3}\tBOTH-W1 ${c.both1}\tBOTH-any ${c.bothAny}\tclash-outside-SV ${c.outsideSV}\tvacant-outside-SV ${c.vacOutsideSV}\tW3v ${c.w3v}\tW1v ${c.w1v}\theld-with-vacant-line ${c.heldVac}`);
}
console.log('laws:', lit); console.log(out.join('\n'));
console.log(`births ${tot.births}; page/chain/source predicate disagreements ${tot.predDiff}; source vacant ${tot.src}`);
console.log('CLASH SEEDS:'); console.log(ex.join('\n'));
