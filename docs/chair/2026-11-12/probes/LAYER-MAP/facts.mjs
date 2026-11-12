// LAYER-MAP facts.mjs — EXECUTED: every fact home traced over a corpus sample; each fact's layer is
// 1 + the highest layer it reads (stored paths via recordLayers.mjs; other facts via DEPS, read in source).
// Run: TREE=<tree> CORPUS=<corpus.ndjson.gz> [SAMPLE=120] node facts.mjs > facts.json
import { traceReads } from './trace.mjs';
import { layerOfPath } from './recordLayers.mjs';
import { loadCorpus } from './load.mjs';
const R = (process.env.TREE || process.cwd()) + '/src';
const imp = (p) => import(R + p);
const { factsOf } = await imp('/domain/facts/factsOf.js');
const { INSTITUTION_KINDS } = await imp('/domain/facts/institutions.js');
const mr = await imp('/domain/magicReliance.js');
const df = await imp('/domain/defense/defenseFacts.js');
const dd = await imp('/domain/display/defenseDisplay.js');
const fr = await imp('/domain/dossier/faithReading.js');
const hc = await imp('/domain/people/hallCapture.js');
const ca = await imp('/domain/canonicalAccessors.js');
const cs = await imp('/domain/crimeSignal.js');
const { generateDefenseProfile } = await imp('/generators/defenseGenerator.js');
const cf = await imp('/domain/crisis/crisisFacts.js');

// name -> [fn(record), deps (other facts it calls; READ in source), home]
const F = {};
const fo = (k) => (r) => factsOf(r)[k];
for (const k of ['crisis', 'storesMonths', 'defence', 'guardPresence', 'soldiers', 'commander', 'faith', 'water', 'market', 'famine', 'magic', 'rulerKind', 'migration', 'warState', 'sacredHouse', 'guild', 'populationBand', 'terrain', 'route', 'tier', 'foodSources', 'imports', 'exports', 'culture', 'crime', 'prosperity'])
  F['factsOf.' + k] = [fo(k), [], 'src/domain/facts/factsOf.js :: factsOf.' + k];
F['factsOf.hasInstitution'] = [(r) => INSTITUTION_KINDS.map((k) => factsOf(r).hasInstitution(k)), [], 'facts/institutions.js :: hasInstitution'];
F['factsOf.hasOtherNpc'] = [(r) => factsOf(r).hasOtherNpc(0), [], 'facts/otherNpc.js :: hasOtherNpc'];
const dep = (name, ...d) => { F[name][1] = d; };
dep('factsOf.guardPresence', 'factsOf.defence'); dep('factsOf.soldiers', 'factsOf.defence'); dep('factsOf.commander', 'factsOf.defence');
dep('factsOf.water', 'factsOf.terrain', 'factsOf.route'); dep('factsOf.warState', 'factsOf.crisis'); dep('factsOf.migration', 'factsOf.crisis');
dep('factsOf.sacredHouse', 'factsOf.hasInstitution'); dep('factsOf.crime', 'deriveCriminalStructure'); dep('factsOf.faith', 'faithReadingOf');
dep('factsOf.defence', 'defenseFactsOf');
// the other homes the class table names
F['defenseFactsOf'] = [(r) => df.defenseFactsOf(r), [], 'domain/defense/defenseFacts.js :: defenseFactsOf'];
F['foodEnduranceOf'] = [(r) => df.foodEnduranceOf(r), ['factsOf.storesMonths', 'factsOf.crisis'], 'domain/defense/defenseFacts.js :: foodEnduranceOf'];
F['crisisDimensionsOf (crisisAnswered)'] = [(r) => cf.crisisAnswered(r, {}), ['factsOf.crisis'], 'domain/crisis/crisisFacts.js :: crisisAnswered'];
F['wallsDimensionOf (wallsAnswered)'] = [(r) => df.wallsDimensionOf(r), ['defenseFactsOf'], 'domain/defense/defenseFacts.js :: wallsDimensionOf'];
F['magicPractitioners'] = [(r) => mr.magicPractitioners(r), [], 'domain/magicReliance.js :: magicPractitioners'];
F['magicDependents'] = [(r) => mr.magicDependents(r), [], 'domain/magicReliance.js :: magicDependents'];
F['magicDialAbsent'] = [(r) => mr.magicDialAbsent(r), [], 'domain/magicReliance.js :: magicDialAbsent'];
F['deriveMagicReliance'] = [(r) => mr.deriveMagicReliance(r), ['magicPractitioners', 'magicDependents', 'magicDialAbsent'], 'domain/magicReliance.js :: deriveMagicReliance'];
F['deriveCriminalStructure'] = [(r) => dd.deriveCriminalStructure(r), [], 'domain/display/defenseDisplay.js :: deriveCriminalStructure'];
F['crimeSignalOf (seats+estate)'] = [(r) => cs.crimeSignalOf({ seats: r.powerStructure?.factions, estate: r.institutions }), [], 'domain/crimeSignal.js :: crimeSignalOf'];
F['faithReadingOf'] = [(r) => fr.faithReadingOf(r), [], 'domain/dossier/faithReading.js :: faithReadingOf'];
F['hallCaptureOf'] = [(r) => hc.hallCaptureOf(r), [], 'domain/people/hallCapture.js :: hallCaptureOf'];
F['canonStressors'] = [(r) => ca.canonStressors(r), [], 'domain/canonicalAccessors.js :: canonStressors'];
F['generateDefenseProfile (stored defenseProfile)'] = [(r) => generateDefenseProfile(r), [], 'generators/defenseGenerator.js :: generateDefenseProfile'];
F['foodEnduranceLine (a composer)'] = [(r) => dd.foodEnduranceLine(r), ['foodEnduranceOf', 'factsOf.storesMonths'], 'domain/display/defenseDisplay.js :: foodEnduranceLine'];

const corpus = loadCorpus(process.env.CORPUS);
const N = Number(process.env.SAMPLE || 120);
const step = Math.max(1, Math.floor(corpus.length / N));
const sample = corpus.filter((_, i) => i % step === 0).slice(0, N);
const reads = {}; const errs = {};
for (const name of Object.keys(F)) { reads[name] = new Set(); errs[name] = 0; }
for (const { s } of sample) {
  for (const [name, [fn]] of Object.entries(F)) {
    const rec = structuredClone(s);
    const { paths, err } = traceReads(rec, fn);
    if (err) errs[name]++;
    for (const p of paths) reads[name].add(p);
  }
}
// the stored defenseProfile's layer: 1 + its generator's reads (excluding itself)
const pathLayer = (p, ov) => layerOfPath(p, ov).layer;
const maxPath = (set, ov) => { let m = -1, at = null; for (const p of set) { const l = pathLayer(p, ov); if (l != null && l > m) { m = l; at = p; } } return [m, at]; };
const [dpl] = maxPath([...reads['generateDefenseProfile (stored defenseProfile)']].filter((p) => !p.startsWith('defenseProfile')));
const ov = { defenseProfile: dpl + 1 };
const layer = {}; const why = {};
const L = (name, stack = []) => {
  if (layer[name] != null) return layer[name];
  if (stack.includes(name)) { why[name] = 'CYCLE ' + [...stack, name].join(' → '); return 99; }
  const [pm, at] = maxPath(reads[name], ov);
  let m = pm, by = at;
  for (const d of F[name][1]) { const dl = L(d, [...stack, name]); if (dl > m) { m = dl; by = 'fact ' + d; } }
  layer[name] = m + 1; why[name] = by; return layer[name];
};
for (const name of Object.keys(F)) L(name);
const unknown = new Set(); for (const set of Object.values(reads)) for (const p of set) if (pathLayer(p, ov) == null) unknown.add(p);
const out = { sample: sample.length, storedDefenseProfileLayer: ov.defenseProfile, facts: Object.keys(F).map((name) => ({
  name, home: F[name][2], layer: layer[name], decidedBy: why[name], deps: F[name][1], errors: errs[name],
  reads: [...reads[name]].filter((p) => !p.includes('.') || p.split('.').length <= 2).sort().map((p) => `${p}@L${pathLayer(p, ov)}`),
})).sort((a, b) => a.layer - b.layer || a.name.localeCompare(b.name)), unclassifiedPaths: [...unknown].sort() };
console.log(JSON.stringify(out, null, 1));
