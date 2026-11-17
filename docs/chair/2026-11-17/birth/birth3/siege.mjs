// BIRTH-3 P5 (ii): THE SIEGE'S OTHER READERS. For every besieged town, three readers of the stored imports that ignore a
// siege, read over the tip's record and over the same record with the imports the line's birth left (the economy's own list:
// BIRTH-1 wrote nothing under a siege): the towns whose reading moves, and what it says.
//   TREE=<tip> node siege.mjs <line corpus> <tip corpus>
import fs from 'node:fs'; import zlib from 'node:zlib';
const R = process.env.TREE + '/src';
const G = await import(R + '/domain/display/stateProse/generalStateProse.js');
const E = await import(R + '/domain/display/stateProse/economyStateProse.js');
const load = (f) => new Map(zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n').map((l) => { const o = JSON.parse(l); return [o.seed, o.s]; }));
const A = load(process.argv[2]), B = load(process.argv[3]);
const dep = (deps, imports) => { if (!Array.isArray(deps)) return null; const listed = imports.map((x) => String(x).toLowerCase());
  const goods = [...new Set(deps.map((d) => /^Imports (.+)$/.exec(String(d?.title || ''))?.[1]?.replace(/\s*\(.*\)\s*$/, '').trim().toLowerCase()).filter((g) => g && !/[0-9]/.test(g) && listed.some((x) => x.includes(g))))]; return goods.join(' and ') || null; };
const out = { besieged: 0, wordsAdded: 0, craft: [], profile: [], dossier: [] };
for (const [seed, t] of B) {
  if (!(t.config?.stressTypes || []).includes('under_siege')) continue; out.besieged++;
  const l = A.get(seed); const li = l?.economicState?.primaryImports || []; const ti = t.economicState?.primaryImports || [];
  if (ti.length > li.length) out.wordsAdded++;
  const ra = t.resourceAnalysis || {}; const es = t.economicState || {};
  const rd = (imp) => ({ activeChains: es.activeChains, exploitation: ra.exploitation, isEntrepot: es.isEntrepot, primaryImports: imp });
  const c0 = G.craftReasonPoolKey(rd(li)), c1 = G.craftReasonPoolKey(rd(ti)); if (c0 !== c1) out.craft.push(`${seed}: ${c0} -> ${c1}`);
  const p0 = E.tradeProfilePoolKey({ ...es, primaryImports: li }), p1 = E.tradeProfilePoolKey(es); if (p0 !== p1) out.profile.push(`${seed}: ${p0} -> ${p1}`);
  const deps = t.economicViability?.dependencies; const d0 = dep(deps, li), d1 = dep(deps, ti); if (d0 !== d1) out.dossier.push(`${seed}: ${d0} -> ${d1}`);
}
console.log(JSON.stringify(out, null, 1));
