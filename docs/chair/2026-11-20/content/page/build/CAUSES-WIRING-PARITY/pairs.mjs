// RUN (repo root): node docs/chair/2026-11-20/content/page/build/CAUSES-WIRING-PARITY/pairs.mjs "$PWD" > .../pairs.txt 2>&1
// Birth recipe copied from build/CAUSES-WIRING/parity.mjs (hxd-<size>-<i> and censusPlan('r2') + configOf). For the three
// crime_wave DIFF towns: each cause's holds on owner vs toPublicSafe(owner), and the fields the differing predicates read.
const L = process.argv[2];
const { generateSettlementPipeline } = await import(`${L}/src/generators/generateSettlementPipeline.js`);
const { birthConfig, loadGenerationLawPayloads } = await import(`${L}/src/domain/density/densityCreateBoundary.js`);
const { DEFAULT_CONFIG } = await import(`${L}/src/store/configSlice.js`);
const { censusPlan, configOf } = await import(`${L}/tests/components/pageCensusWalk.shared.mjs`);
const { toPublicSafe } = await import(`${L}/src/domain/display/publicSafe.js`);
const { tensionCauseSentenceOf } = await import(`${L}/src/domain/display/tensionCause.js`);
const { TENSION_CAUSES } = await import(`${L}/src/data/tensionCauses.js`);
const { TENSION_CAUSE_HOLDS } = await import(`${L}/src/domain/display/tensionCauseHolds.js`);
const { factsOf } = await import(`${L}/src/domain/facts/factsOf.js`);
const { criminalStructureKeyOf } = await import(`${L}/src/domain/facts/criminalStructureKey.js`);
const { rivalRingsOf } = await import(`${L}/src/domain/corruption.js`);
const { liveInstitutions } = await import(`${L}/src/domain/institutions/institutionRoster.js`);
await loadGenerationLawPayloads();
const WANT = ['r2r-city-19', 'r2s-religious_conversion-city-0', 'r2s-wartime-metropolis-2'];
const rows = censusPlan('r2').filter((r) => WANT.includes(r.seed));
const J = (x) => JSON.stringify(x);
for (const row of rows) {
  const doc = generateSettlementPipeline(configOf(row, DEFAULT_CONFIG, birthConfig), null, { seed: row.seed, customContent: {} });
  const pub = toPublicSafe(doc);
  const t = doc.history.currentTensions.find((x) => x.type === 'crime_wave');
  const t2 = pub?.history?.currentTensions?.find((x) => x.type === 'crime_wave');
  console.log(`\n=== TOWN ${row.seed} name=${J(doc.name)} pubName=${J(pub?.name)}`);
  console.log(`SENTENCE owner ${J(tensionCauseSentenceOf(doc, t))}`);
  console.log(`SENTENCE served ${J(tensionCauseSentenceOf(pub, t2))}`);
  const fo = factsOf(doc), fp = factsOf(pub);
  for (const c of TENSION_CAUSES.crime_wave.causes) {
    const a = TENSION_CAUSE_HOLDS[c.holds](doc, fo), b = TENSION_CAUSE_HOLDS[c.holds](pub, fp);
    console.log(`CAUSE ${c.id} rank ${c.rank} holds ${c.holds} power ${c.power ?? '-'} owner ${a} served ${b}${a !== b ? '  <<< DIFFERS' : ''}`);
  }
  const fac = (d) => (d?.powerStructure?.factions || []).map((f) => `${f.faction ?? f.name}|${f.category}${f.isGoverning ? '|gov' : ''}`);
  console.log(`FIELD powerStructure.factions owner ${J(fac(doc))}`);
  console.log(`FIELD powerStructure.factions served ${J(fac(pub))}`);
  console.log(`FACT crime(criminalStructureKeyOf) owner ${J(criminalStructureKeyOf(doc))} served ${J(criminalStructureKeyOf(pub))}`);
  const rr = (d) => rivalRingsOf(d?.powerStructure?.factions, liveInstitutions(d));
  console.log(`FACT rivalRingsOf(factions, live) owner ${J(rr(doc))} served ${J(rr(pub))}; facts.rivalRings owner ${fo.rivalRings} served ${fp.rivalRings}`);
  const of = (f) => ({ kept: f.orderForce.kept, volunteers: f.orderForce.volunteers, paid: f.orderForce.paid, pay: f.orderForce.pay, payCut: f.orderForce.payCut, count: f.orderForce.count });
  console.log(`FACT orderForce owner ${J(of(fo))}`);
  console.log(`FACT orderForce served ${J(of(fp))}`);
  console.log(`FACT lawBand owner ${J(fo.lawBand)} served ${J(fp.lawBand)}`);
  const mil = (d) => (Array.isArray(d?.npcs) ? d.npcs : []).filter((n) => n?.category === 'military').map((n) => `${n.name}|${n.settlementCondition}`);
  console.log(`FIELD npcs[category=military].settlementCondition owner ${J(mil(doc))} served ${J(mil(pub))}; npcs is array owner ${Array.isArray(doc.npcs)} served ${Array.isArray(pub?.npcs)}`);
  const inst = (d) => (Array.isArray(d?.institutions) ? d.institutions : []).map((i) => `${i.name}|${i.category}`);
  const io = inst(doc), ip = inst(pub);
  console.log(`FIELD institutions count owner ${io.length} served ${ip.length}; owner-only ${J(io.filter((x) => !ip.includes(x)))}; served-only ${J(ip.filter((x) => !io.includes(x)))}`);
  const lo = (liveInstitutions(doc) || []).length, lp = (liveInstitutions(pub) || []).length;
  console.log(`FACT liveInstitutions count owner ${lo} served ${lp}`);
}
