// W2-WRITE case probe (scratch, not committed): for chosen pools, per reachable case (the mapping seat's
// own case key, depth.mjs's), the slots the desk fills, the dimensions it answers, the audience, an example
// seed, and per variant whether it is eligible alone (player / dm) — so a writer sees WHY a case is short.
// Run: TREE=<tree> CORPUS=<gz> POOLS='DS-GEN-9::event type: political|...' (or POOLS=@file) LAYER_MAP_HOOK=1 \
//      node --import <LAYER-MAP>/jsx-register.mjs caseprobe.mjs <out.json>
import { readFileSync, writeFileSync } from 'node:fs';
import zlib from 'node:zlib';
const TREE = process.env.TREE; const R = TREE + '/src';
const imp = (p) => import(R + p);
const OUT = process.argv[2] || 'caseprobe.json';
const want = (process.env.POOLS || '').startsWith('@') ? readFileSync(process.env.POOLS.slice(1), 'utf8').trim().split('\n') : (process.env.POOLS || '').split('|').filter(Boolean);
const WANT = new Set(want); const ALL = WANT.size === 0;
const { PUBLIC_PROSE_SITES } = await imp('/components/new/publicProseCompose.js');
const { publicVeiledRecordOf } = await imp('/domain/display/publicSafe.js');
const { factsOf } = await imp('/domain/facts/factsOf.js');
const { variantFactDeclaration, poolDimensions, variantIsAnchored, variantIsAudible } = await imp('/domain/display/stateProse/stateProseKernel.js');
const { atomsOf, declarationOfMarks, atomHolds } = await imp('/domain/facts/factVocabulary.js');
const { THINGS, thingsNamedIn } = await import(TREE + '/tests/lint/presumedThings.shared.mjs');
const POOL_ID = new WeakMap(); const POOLS = {}; const META = {};
for (const n of ['economy', 'defense', 'general', 'power', 'stressors', 'warFaith']) {
  const leaf = Object.values(await imp(`/data/dossierStateProse/${n}.generated.js`)).find((v) => v && typeof v === 'object');
  for (const [b, block] of Object.entries(leaf)) for (const [k, vs] of Object.entries(block.pools || {})) { const id = `${b}::${k}`; POOL_ID.set(vs, id); POOLS[id] = vs; META[id] = (block.poolMeta || {})[k] || {}; }
}
const declAtoms = (v) => [...atomsOf(variantFactDeclaration(v)), ...atomsOf(declarationOfMarks(v.marks || []))];
const things = (v) => thingsNamedIn(String(v.text || ''));
const undeclaredThings = (v) => { const a = new Set(declAtoms(v).map((x) => x.replace(/^no /, ''))); return things(v).filter((t) => !THINGS[t].atoms.some((x) => a.has(x))); };
const absentIn = (t, f) => { try { return THINGS[t].absent ? !!THINGS[t].absent(f) : false; } catch { return false; } };
const hold = (w, f) => { try { const h = atomHolds(w, f, { npc: 0 }); return h === undefined ? 'u' : h ? 1 : 0; } catch { return 'E'; } };
const PF = {};
const poolFacts = (id) => PF[id] ||= (() => { const vs = POOLS[id]; const atoms = new Set(); const th = new Set();
  for (const v of vs) { for (const a of declAtoms(v)) atoms.add(a.replace(/^no /, '')); for (const t of things(v)) th.add(t); }
  for (const a of META[id].declares || []) atoms.add(String(a).replace(/^no /, ''));
  return { atoms: [...atoms].sort(), dims: poolDimensions(vs), things: [...th].sort() }; })();
let seed = null; let facts = null; let seen = null;
const per = {};
globalThis.__EV_HOOK = (pool, options, result, raw) => {
  const id = POOL_ID.get(pool); if (!id || seen.has(id)) return; seen.add(id);
  if (!ALL && !WANT.has(id)) return;
  const pf = poolFacts(id); const f = options.facts || facts;
  const caseObj = {};
  for (const a of pf.atoms) caseObj[a] = hold(a, f);
  for (const d of pf.dims) caseObj['dim ' + d] = (options.dimensions || {})[d] ?? '-';
  for (const t of pf.things) caseObj['thing ' + t] = absentIn(t, f) ? 'absent' : 'present';
  const ck = JSON.stringify(caseObj);
  const p = per[id] ||= { cases: {} };
  const c = p.cases[ck] ||= { towns: 0, seeds: [], slotsFilled: {}, dims: {}, audience: {}, variants: {} };
  c.towns++; if (c.seeds.length < 6) c.seeds.push(seed);
  for (const [k, v] of Object.entries(options.slots || {})) if (v != null && v !== '') c.slotsFilled[k] = (c.slotsFilled[k] || 0) + 1;
  for (const [k, v] of Object.entries(options.dimensions || {})) c.dims[`${k}=${v}`] = (c.dims[`${k}=${v}`] || 0) + 1;
  c.audience[options.audience || 'player'] = (c.audience[options.audience || 'player'] || 0) + 1;
  for (const v of pool) {
    let pl = false; let dm = false; try { pl = raw([v], options).length > 0; } catch { /* */ } try { dm = raw([v], { ...options, audience: 'dm' }).length > 0; } catch { /* */ }
    const words = undeclaredThings(v).filter((t) => absentIn(t, f));
    const r = c.variants[v.vid] ||= { player: 0, dm: 0, wordsFalse: 0, anchored: 0 };
    if (pl && !words.length) r.player++; if (dm && !words.length) r.dm++; if (words.length) r.wordsFalse++;
    if (variantIsAnchored(v, options.slots || {})) r.anchored++;
  }
};
const corpus = zlib.gunzipSync(readFileSync(process.env.CORPUS)).toString().trim().split('\n').map((l) => JSON.parse(l));
for (const { seed: sd, s } of corpus) {
  seed = sd; facts = factsOf(s); seen = new Set();
  const ctx = { veiledRecord: publicVeiledRecordOf(s) };
  for (const [, draw] of PUBLIC_PROSE_SITES) { try { draw(s, false, ctx); } catch { /* */ } }
}
const out = {};
for (const [id, p] of Object.entries(per)) out[id] = { variants: POOLS[id].map((v) => ({ vid: v.vid, marks: v.marks, text: v.text })), meta: META[id], cases: p.cases };
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log('pools', Object.keys(out).length);
