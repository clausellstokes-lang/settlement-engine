// V33-JOINPROBE step 5, the second reading: the served hooks against the walker's NAMED eleven
// (tests/lint/samenessHideable.walker.test.js :: EXEMPT['src/data/troubleHooks.js :: TROUBLE_HOOKS'].reason: WITHHELD 5 = crime_wave 2, 10, 12,
// guild_conflict 12, crime_wave 11; LISTED 6 = crime_wave 9, external_threat 8, succession_crisis 1, 2, 3, 8), lines as the composed pool's 1-based index.
//   node hookgap-eleven.mjs <worktree> <outdir of hookgap shards>
import { readFileSync, readdirSync } from 'node:fs';
const [W, O] = process.argv.slice(2);
const { troubleHookPool } = await import(`${W}/src/generators/history/troubleHooksOf.js`);
const { TROUBLE_HOOKS } = await import(`${W}/src/data/troubleHooks.js`);
const NAMED = { crime_wave: [2, 9, 10, 11, 12], guild_conflict: [12], external_threat: [8], succession_crisis: [1, 2, 3, 8] };
const WITHHELD = new Set(['crime_wave 2', 'crime_wave 10', 'crime_wave 11', 'crime_wave 12', 'guild_conflict 12']);
const at = new Map();
for (const kind of Object.keys(TROUBLE_HOOKS)) (troubleHookPool(kind) || []).forEach((r, i) => at.set(r.text, { kind, line: i + 1, needs: r.needs, excludes: r.excludes }));
console.log('THE NAMED ELEVEN, as the composed pools hold them:');
for (const [kind, lines] of Object.entries(NAMED)) for (const l of lines) { const e = [...at.entries()].find(([, v]) => v.kind === kind && v.line === l); console.log(`  ${kind} ${l} ${WITHHELD.has(`${kind} ${l}`) ? 'WITHHELD' : 'LISTED'} needs ${JSON.stringify(e?.[1].needs)} excludes ${JSON.stringify(e?.[1].excludes ?? [])}: ${e?.[0]}`); }
const rows = readdirSync(O).filter((f) => /^hookgap-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')).rows).filter((r) => r.twin);
let served = 0; const hit = [];
for (const r of rows) for (const eng of ['twin', 'server']) for (const h of r[eng].served) {
  if (eng === 'twin') served += 1;
  const a = at.get(h); if (!a || !(NAMED[a.kind] || []).includes(a.line)) continue;
  hit.push({ eng, seed: r.seed, id: `${a.kind} ${a.line}`, cls: WITHHELD.has(`${a.kind} ${a.line}`) ? 'WITHHELD' : 'LISTED', hidden: r[eng].hiddenHouses.length, powers: r[eng].withheldPowers.length });
}
const t = hit.filter((x) => x.eng === 'twin'); const s = hit.filter((x) => x.eng === 'server');
const by = (xs) => Object.entries(xs.reduce((m, x) => ({ ...m, [`${x.id} (${x.cls})`]: (m[`${x.id} (${x.cls})`] || 0) + 1 }), {})).map(([k, v]) => `${k}: ${v}`).join('; ');
console.log(`\nserved hooks (twin) ${served}; of the named eleven served: twin ${t.length}, server ${s.length}; on a place whose read hides a house or withholds a power: twin ${t.filter((x) => x.hidden || x.powers).length}, server ${s.filter((x) => x.hidden || x.powers).length}`);
console.log(`twin by row: ${by(t)}`); console.log(`server by row: ${by(s)}`);
for (const x of t) console.log(`  ${x.seed}: ${x.id} ${x.cls} (hidden houses ${x.hidden}, withheld powers ${x.powers})`);
