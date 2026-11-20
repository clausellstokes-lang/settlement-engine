// A saved town re-renders to exactly today's lines: every stored tie of the line's births, rendered at its stored proseVariant
// by the line's code and by the probe's (lines APPENDED), must be byte-identical.
import { readFileSync } from 'node:fs';
const [, , A, B, jsonl] = process.argv;
const load = async (L) => ({ E: (await import(`${L}/src/data/npcData.js`)).STRESS_ECONOMIC_EFFECTS, D: await import(`${L}/src/domain/defense/defenseFacts.js`) });
const a = await load(A), b = await load(B);
let ties = 0, same = 0, diff = 0, legacy = 0; const ex = [];
for (const line of readFileSync(jsonl, 'utf8').split('\n')) {
  if (!line.trim()) continue; const rec = JSON.parse(line); const t = rec.doc || rec.settlement || rec.value || rec;
  const by = new Map((t.npcs || []).map((n) => [n.id, n]));
  for (const r of t.relationships || []) {
    const f = by.get(r.from), s = by.get(r.to); if (!f || !s || !r.archetypeKey || !a.E[r.archetypeKey]) continue; ties++;
    if (!Number.isInteger(r.proseVariant)) legacy++;
    const fa = a.D.forceWordsOf(a.D.defenseFactsOf({ institutions: t.institutions || [] })), fb = b.D.forceWordsOf(b.D.defenseFactsOf({ institutions: t.institutions || [] }));
    const x = [a.E[r.archetypeKey].desc(f, s, r.proseVariant, fa), a.E[r.archetypeKey].tension(f, s, r.proseVariant, fa)];
    const y = [b.E[r.archetypeKey].desc(f, s, r.proseVariant, fb), b.E[r.archetypeKey].tension(f, s, r.proseVariant, fb)];
    if (x[0] === y[0] && x[1] === y[1]) same++; else { diff++; if (ex.length < 3) ex.push([r.archetypeKey, r.proseVariant, x, y]); }
    if (x[0] !== r.description) ex.length < 6 && ex.push(['STORED≠LINE-RENDER', r.archetypeKey, r.description, x[0]]);
  }
}
console.log(`ties ${ties} · identical ${same} · differ ${diff} · without a stored variant ${legacy}`); for (const e of ex) console.log(JSON.stringify(e));
