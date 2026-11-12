// LAYER-MAP readiness.mjs — EXECUTED: does the stored defence profile's readiness (generateDefenseProfile) depend
// by VALUE on the cast, the powers, the economy? Transplant each subtree from two other towns; count towns whose
// readiness label/score changes. Run: TREE=<tree> CORPUS=<corpus.ndjson.gz> node readiness.mjs
import { loadCorpus } from './load.mjs';
const { generateDefenseProfile } = await import((process.env.TREE || process.cwd()) + '/src/generators/defenseGenerator.js');
const c = loadCorpus(process.env.CORPUS).filter((_, i) => i % 6 === 0).map((x) => x.s);
const subs = { npcs: ['npcs'], powerStructure: ['powerStructure'], economicState: ['economicState'], institutions: ['institutions'], config: ['config'] };
const v = (r) => { try { const p = generateDefenseProfile(r); return JSON.stringify([p.readiness, p.scores]); } catch (e) { return 'THROW'; } };
const out = {};
for (const [name, keys] of Object.entries(subs)) { let n = 0; c.forEach((s, i) => { const b = v(s); for (const d of [c[(i + 1) % c.length], c[(i + 5) % c.length]]) { const r = { ...s }; for (const k of keys) r[k] = d[k]; if (v(r) !== b) { n++; break; } } }); out[name] = `${n}/${c.length}`; }
console.log(JSON.stringify(out));
