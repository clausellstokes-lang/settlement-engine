// replay.mjs <tree> <renderOut> [probe]: re-draw every pool offline: eligible = recorded e ∩ admitted by the tree's declarations; drawn = kernel.drawVariant(seed)
import fs from 'node:fs'; import path from 'node:path';
const [tree, rout, mode] = process.argv.slice(2); const T = (p) => path.join(tree, p);
const kernel = await import(T('src/domain/display/stateProse/stateProseKernel.js'));
const voc = await import(T('src/domain/facts/factVocabulary.js'));
const { factsOf } = await import(T('src/domain/facts/factsOf.js'));
const C = {}; for (const desk of ['defense', 'economy', 'general', 'power', 'stressors', 'warFaith']) Object.assign(C, Object.values(await import(T(`src/data/dossierStateProse/${desk}.generated.js`))).find((v) => v && typeof v === 'object'));
const d = path.join(rout, 'dumps'); let ok = 0, bad = 0, nos = 0; const out = {};
for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.draws.json'))) {
  const s = f.replace('.draws.json', ''); const draws = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'));
  const rec = JSON.parse(fs.readFileSync(path.join(rout, 'records', s + '.json'), 'utf8')); const facts = factsOf(rec);
  const seed = rec.seed ?? rec.settlementSeed ?? s; out[s] = {};
  for (const [pk, r] of Object.entries(draws)) {
    const [b, ...rest] = pk.split('::'); const key = rest.join('::'); const pool = C[b]?.pools?.[key]; if (!pool || !(r.d || []).length) continue;
    if (r.d.length !== 1) continue;
    const cs = C[b].poolMeta?.[key]?.crisisScoped === true;
    const el = pool.filter((v) => r.e.includes(v.vid) && voc.declarationAdmits(kernel.variantFactDeclaration(v), facts, { crisisScoped: cs }).admitted);
    if (mode === 'probe') { const got = kernel.drawVariant(pool.filter((v) => r.e.includes(v.vid)), b, key, String(seed)); if (got?.vid === r.d[0]) ok++; else bad++; continue; }
    const got = kernel.drawVariant(el, b, key, String(seed)); out[s][pk] = { e: el.map((v) => v.vid), d: got ? [got.vid] : [] };
  }
}
if (mode === 'probe') console.log('replay matches', ok, 'misses', bad); else fs.writeFileSync(path.join(rout, '..', path.basename(rout) + '.replay.json'), JSON.stringify(out));
