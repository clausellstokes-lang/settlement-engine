// LAYER-MAP guardCount.mjs — today's violations of the layer guard over the state-prose corpus, counted with the
// presumed-things walker's OWN matcher (`thingsNamedIn`) and the vocabulary's own declaration reading
// (`variantFactDeclaration` + the pool's brace group). A variant that names a registered thing presumes the thing's
// fact; the fact's layer is its atoms' lowest measured layer (perturb.json). A violation: the thing is not declared
// (no atom of the thing on the variant or its pool) AND the pool's measured/inferred layer is NOT above the thing's
// layer (layers.json). Run: TREE=<tree> node guardCount.mjs corpus-leaves layers.json perturb.json
import { readFileSync } from 'node:fs';
const T = process.env.TREE || process.cwd();
const { THINGS, thingsNamedIn } = await import(T + '/tests/lint/presumedThings.shared.mjs');
const { variantFactDeclaration } = await import(T + '/src/domain/display/stateProse/stateProseKernel.js');
const { atomsOf, declarationOfMarks } = await import(T + '/src/domain/facts/factVocabulary.js');
const LAY = JSON.parse(readFileSync(process.argv[2], 'utf8')).rows; const P = JSON.parse(readFileSync(process.argv[3], 'utf8'));
const atomLayer = Object.fromEntries(P.facts.filter((f) => f.fact.startsWith('atom ')).map((f) => [f.fact.slice(5), f.layer]));
Object.assign(atomLayer, { tier: 1, population: 1, 'magic level': 1, magic: 1, food: 2, stores: 2, prosperity: 2, crime: 3, priest: 3 });
const dimOf = (a) => a.replace(/^no /, '').split(':')[0].trim();
const thingLayer = Object.fromEntries(Object.entries(THINGS).map(([k, v]) => [k, v.atoms.length ? Math.min(...v.atoms.map((a) => atomLayer[dimOf(a)] ?? 99)) : null]));
const leaves = await Promise.all(['economy', 'defense', 'general', 'power', 'stressors', 'warFaith'].map(async (n) => Object.values(await import(`${T}/src/data/dossierStateProse/${n}.generated.js`)).find((v) => v && typeof v === 'object')));
const out = { thingLayer, namings: 0, undeclared: 0, violations: 0, byThing: {}, byLayer: {}, poolsWithViolation: new Set(), examples: [] };
for (const leaf of leaves) for (const [blockId, block] of Object.entries(leaf)) for (const [poolKey, vs] of Object.entries(block.pools || {})) {
  const id = `${blockId}::${poolKey}`; const row = LAY[id]; const meta = (block.poolMeta || {})[poolKey] || {};
  const poolAtoms = new Set((meta.declares || []).map((a) => a.replace(/^no /, '')));
  for (const v of vs) {
    const declared = new Set([...atomsOf(variantFactDeclaration(v)), ...atomsOf(declarationOfMarks(v.marks || []))].map((a) => a.replace(/^no /, '')));
    for (const thing of thingsNamedIn(String(v.text))) {
      out.namings++;
      const ok = THINGS[thing].atoms.some((a) => declared.has(a) || poolAtoms.has(a)) || meta.colour === true && false;
      if (ok) continue; out.undeclared++;
      const tl = thingLayer[thing]; const pl = typeof row?.layer === 'number' ? row.layer : null;
      const b = (out.byThing[thing] ||= { layer: tl, undeclared: 0, violations: 0 }); b.undeclared++;
      if (pl != null && tl != null && pl <= tl) { out.violations++; b.violations++; out.poolsWithViolation.add(id); out.byLayer['L' + pl] = (out.byLayer['L' + pl] || 0) + 1; if (out.examples.length < 8) out.examples.push(`L${pl} ${id} names ${thing}(L${tl}): ${String(v.text).slice(0, 110)}`); }
    }
  }
}
out.poolsWithViolation = out.poolsWithViolation.size;
console.log(JSON.stringify(out, null, 1));
