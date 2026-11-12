// LAYER-MAP perturb.mjs — EXECUTED value-dependence: which stored subtrees a fact or a drawn line DEPENDS on.
// For each sampled town and each stored subtree, the subtree is (a) deleted and (b) transplanted from two other
// towns; a fact whose value changes, or a desk lens whose pool key / sentence changes, depends on that subtree.
// A pool's layer = 1 + the highest layer among the subtrees its draws depend on (its key, its eligibility, its slots).
// Run: TREE=<tree> CORPUS=<corpus.ndjson.gz> [SAMPLE=60] node --import ./jsx-register.mjs perturb.mjs > perturb.json
import { loadCorpus } from './load.mjs';
const R = (process.env.TREE || process.cwd()) + '/src';
const imp = (p) => import(R + p);
const { PUBLIC_PROSE_SITES } = await imp('/components/new/publicProseCompose.js');
const { publicVeiledRecordOf } = await imp('/domain/display/publicSafe.js');
const { factsOf } = await imp('/domain/facts/factsOf.js');
const { INSTITUTION_KINDS } = await imp('/domain/facts/institutions.js');
const { FACT_DIMENSIONS, atomHolds } = await imp('/domain/facts/factVocabulary.js');
const mr = await imp('/domain/magicReliance.js'); const df = await imp('/domain/defense/defenseFacts.js');
const dd = await imp('/domain/display/defenseDisplay.js'); const fr = await imp('/domain/dossier/faithReading.js');
const hc = await imp('/domain/people/hallCapture.js'); const cs = await imp('/domain/crimeSignal.js');

// [subtree path, layer] — layers from recordLayers.mjs; defenseProfile's 4 from facts.mjs (its generator reads the cast)
const ECO = ['prosperity', 'foodSecurity', 'incomeSources', 'primaryExports', 'primaryImports', 'necessityImports', 'localProduction', 'activeChains', 'safetyProfile', 'tradeAccess', 'economicComplexity', 'compound', 'situationDesc', 'transit', 'tradeDependencies', 'institutionalServices', 'priorities'];
const POW = ['factions', 'government', 'governingName', 'stability', 'publicLegitimacy', 'factionRelationships', 'recentConflict'];
const SUB = [
  ['config', 0], ['size(tier+population)', 0], ['institutions', 0], ['crises(stress+stressors+activeConditions)', 0], ['culturalIdentity', 0], ['neighborRelationship', 0],
  ...ECO.map((k) => ['economicState.' + k, k === 'safetyProfile' ? 1 : 1]), ['spatialLayout', 1], ['availableServices', 1], ['isolationSupport', 1],
  ...POW.map((k) => ['powerStructure.' + k, 2]), ['powerStructure.criminalCaptureState', 4],
  ['npcs', 3], ['relationships', 3], ['history', 3], ['settlementReason', 3], ['resourceAnalysis', 3], ['economicViability', 3],
  ['conflicts', 4], ['defenseProfile', 4], ['arrivalScene', 4], ['pressureSentence', 4], ['culturalNotes', 1],
];
const LAYER = Object.fromEntries(SUB);
function withSub(rec, sub, donor) {
  const r = { ...rec };
  const set = (k, src) => { if (src === undefined) delete r[k]; else r[k] = src[k]; };
  if (sub === 'size(tier+population)') { set('tier', donor); set('population', donor); return r; }
  if (sub.startsWith('crises(')) { for (const k of ['stress', 'stressors', 'activeConditions']) set(k, donor); return r; }
  const [a, b] = sub.split('.');
  if (!b) { set(a, donor); return r; }
  r[a] = { ...(rec[a] || {}) };
  if (donor === undefined) delete r[a][b]; else r[a][b] = donor?.[a]?.[b];
  return r;
}
// facts by value
const FACTS = {};
const fo = (k) => (r) => factsOf(r)[k];
for (const k of ['crisis', 'storesMonths', 'defence', 'guardPresence', 'soldiers', 'commander', 'faith', 'water', 'market', 'famine', 'magic', 'rulerKind', 'migration', 'warState', 'sacredHouse', 'guild', 'populationBand', 'terrain', 'route', 'tier', 'foodSources', 'imports', 'exports', 'culture', 'crime', 'prosperity']) FACTS['factsOf.' + k] = fo(k);
FACTS['factsOf.hasInstitution'] = (r) => INSTITUTION_KINDS.map((k) => factsOf(r).hasInstitution(k));
FACTS['factsOf.hasOtherNpc'] = (r) => factsOf(r).hasOtherNpc(0);
FACTS['defenseFactsOf.walls-gate-watch-garrison (roster part)'] = (r) => { const d = df.defenseFactsOf(r); return [d.hasWalls, d.hasGate, d.hasWatch, d.hasGarrison, d.hasMilitia]; };
FACTS['foodEnduranceOf'] = (r) => df.foodEnduranceOf(r);
FACTS['magicPractitioners'] = (r) => mr.magicPractitioners(r);
FACTS['magicDependents'] = (r) => mr.magicDependents(r);
FACTS['deriveMagicReliance'] = (r) => mr.deriveMagicReliance(r);
FACTS['deriveCriminalStructure'] = (r) => dd.deriveCriminalStructure(r)?.key;
FACTS['crimeSignalOf(seats+estate)'] = (r) => cs.crimeSignalOf({ seats: r.powerStructure?.factions, estate: r.institutions });
FACTS['faithReadingOf'] = (r) => fr.faithReadingOf(r);
FACTS['hallCaptureOf.state'] = (r) => hc.hallCaptureOf(r).state;
// every vocabulary atom, by value (a keyed atom is read on all its keys)
for (const [dim, def] of Object.entries(FACT_DIMENSIONS)) {
  const keys = Array.isArray(def.keys) && def.keys.length ? def.keys.map((k) => `${dim}: ${k}`) : [dim];
  FACTS['atom ' + dim] = (r) => { const f = factsOf(r); return keys.map((w) => { try { return atomHolds(w, f, { npc: 0 }); } catch (e) { return 'E'; } }); };
}
const val = (fn, r) => { try { return JSON.stringify(fn(r)) ?? 'u'; } catch (e) { return 'THROW'; } };

function lensesOf(s) {
  const out = {}; const ctx = { veiledRecord: publicVeiledRecordOf(s) };
  for (const [site, draw] of PUBLIC_PROSE_SITES) {
    let o; try { o = draw(s, false, ctx); } catch { out[site + '#THROW'] = { key: 'THROW' }; continue; }
    const walk = (x, p) => {
      if (!x || typeof x !== 'object') return;
      if (x.provenance && x.provenance.blockId) out[p] = { block: x.provenance.blockId, key: x.provenance.poolKey, text: x.sentence ?? null, vids: (x.provenance.pieces || []).map((q) => `${q.role}:${q.key}:${q.vid}`).join('|') };
      for (const [k, v] of Object.entries(x)) if (k !== 'provenance') walk(v, p + '.' + (/^\d+$/.test(k) ? '[]' : k));
    };
    walk(o, site);
  }
  return out;
}
const corpus = loadCorpus(process.env.CORPUS);
const N = Number(process.env.SAMPLE || 60); const stride = Math.max(1, Math.floor(corpus.length / N));
const sample = corpus.filter((_, i) => i % stride === 0).slice(0, N).map((x) => x.s);
const factDeps = Object.fromEntries(Object.keys(FACTS).map((k) => [k, {}]));
const poolDeps = {}; const poolKeyDeps = {}; const poolSeen = {}; const lensPools = {};
const add = (m, id, sub) => { (m[id] ||= {}); m[id][sub] = (m[id][sub] || 0) + 1; };
let throws = 0;
sample.forEach((s, i) => {
  const base = lensesOf(s);
  for (const [p, l] of Object.entries(base)) { if (l.key === 'THROW') { throws++; continue; } const id = `${l.block}::${l.key}`; poolSeen[id] = (poolSeen[id] || 0) + 1; (lensPools[p] ||= new Set()).add(id); }
  const fbase = Object.fromEntries(Object.entries(FACTS).map(([k, fn]) => [k, val(fn, s)]));
  const donors = [sample[(i + 1) % sample.length], sample[(i + 7) % sample.length]];
  for (const [sub] of SUB) {
    for (const donor of [undefined, ...donors]) {
      const r = withSub(s, sub, donor);
      for (const [k, fn] of Object.entries(FACTS)) { const v = val(fn, r); if (v !== fbase[k] && !(donor === undefined && v === 'THROW')) add(factDeps, k, sub); }
      const pert = lensesOf(r);
      for (const p of new Set([...Object.keys(base), ...Object.keys(pert)])) {
        const a = base[p], b = pert[p];
        if (a && a.key === 'THROW') continue;
        if (b && b.key === 'THROW' && donor === undefined) continue; // a deletion that crashes the site says nothing about one lens
        if (!a) continue; // a lens that appears only under perturbation: its pool is not this town's
        const id = `${a.block}::${a.key}`;
        if (!b || b.key !== a.key) { add(poolDeps, id, sub); add(poolKeyDeps, id, sub); }
        else if (b.text !== a.text || b.vids !== a.vids) add(poolDeps, id, sub);
      }
    }
  }
});
const layerOf = (deps) => { let m = -1, by = null; for (const sub of Object.keys(deps || {})) if (LAYER[sub] > m) { m = LAYER[sub]; by = sub; } return [m + 1, by]; };
const facts = Object.entries(factDeps).map(([k, d]) => { const [l, by] = layerOf(d); return { fact: k, layer: l, decidedBy: by, dependsOn: Object.keys(d).sort() }; }).sort((a, b) => a.layer - b.layer || a.fact.localeCompare(b.fact));
const pools = Object.keys(poolSeen).sort().map((id) => { const [l, by] = layerOf(poolDeps[id]); const [kl, kby] = layerOf(poolKeyDeps[id]); return { pool: id, draws: poolSeen[id], layer: l, decidedBy: by, keyLayer: kl, keyDecidedBy: kby, dependsOn: Object.keys(poolDeps[id] || {}).sort() }; });
console.log(JSON.stringify({ sample: sample.length, siteThrows: throws, lenses: Object.fromEntries(Object.entries(lensPools).map(([p, s]) => [p, [...s]])), facts, pools }, null, 1));
