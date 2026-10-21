// D-WS-r2 probe (D.6): the MEASURED RANGE of W-DOCTRINE-1's two method shares over every
// archetype x a 21x21 grid of the alignment pair (the verifier's grid, re-used):
//  (1) expectedBloodyShare(actor)  — the landed export (raid + occupy share of the fit);
//  (2) armedShare(actor)           — the SAME fit loop over the landed exports INSTRUMENTS +
//      instrumentFit, numerator = instruments carried by armed men (bloody || garrison > 0:
//      raid, occupy, interdiction), denominator = all six. Read-only import of the worktree.
// Reports min / median / max of each, and the share of grid points at or above each median.
const M = process.argv[2];
const mod = await import(M + '/src/domain/worldPulse/supplyWebWarfare.js');
const { FACTION_ARCHETYPES } = await import(M + '/src/domain/factionArchetypes.js');
const { INSTRUMENTS, instrumentFit, expectedBloodyShare } = mod;
const keys = Object.keys(INSTRUMENTS).sort();
const armedKeys = keys.filter((k) => INSTRUMENTS[k].bloody || INSTRUMENTS[k].garrison > 0);
const armedShare = (actor) => { let n = 0, d = 0; for (const k of keys) { const w = instrumentFit(k, actor); d += w; if (armedKeys.includes(k)) n += w; } return d > 0 ? n / d : 0; };
const arches = ['', ...Object.values(FACTION_ARCHETYPES)];
const rows = [];
for (const archetype of arches) for (let e = 0; e <= 20; e++) for (let l = 0; l <= 20; l++) {
  const actor = { archetype, evilLean01: e / 20, lawfulLean01: l / 20 };
  rows.push({ archetype, b: expectedBloodyShare(actor), a: armedShare(actor) });
}
const stat = (xs) => { const s = [...xs].sort((p, q) => p - q); const med = s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2; return { min: s[0], med, max: s[s.length - 1] }; };
const B = stat(rows.map((r) => r.b)), A = stat(rows.map((r) => r.a));
const f = (x) => x.toFixed(4);
console.log(`instruments ${keys.join(',')} · armed ${armedKeys.join(',')} · archetypes ${arches.length} · grid points ${rows.length}`);
console.log(`bloodyShare  min ${f(B.min)} · median ${f(B.med)} · max ${f(B.max)} · points >= median ${rows.filter((r) => r.b >= B.med).length}/${rows.length}`);
console.log(`armedShare   min ${f(A.min)} · median ${f(A.med)} · max ${f(A.max)} · points >= median ${rows.filter((r) => r.a >= A.med).length}/${rows.length}`);
// per archetype: fraction bloody (>= median) and armed (>= median)
const by = {};
for (const r of rows) { const k = r.archetype || '(none)'; by[k] ??= { n: 0, b: 0, a: 0 }; by[k].n++; if (r.b >= B.med) by[k].b++; if (r.a >= A.med) by[k].a++; }
for (const [k, v] of Object.entries(by).sort()) console.log(`  ${k.padEnd(14)} bloody ${String(v.b).padStart(3)}/${v.n} · armed ${String(v.a).padStart(3)}/${v.n}`);
// both cuts vs the old absolute 0.5
console.log(`old absolute cut (>= 0.5) bloody: ${rows.filter((r) => r.b >= 0.5).length}/${rows.length}`);
