// WORDS-2 · which unit moved a birth's Daily Life: E5 (ruler: elder vs office: elders), G8 (the fare rows under a printed Pressured), E6 (L12 admitted). A MEASURE.
// Usage: node unit-dailylife-trigger.mjs <before rows> <after rows> <records dir>
import { readdirSync, readFileSync } from 'node:fs'; import { gunzipSync } from 'node:zlib'; import { join } from 'node:path';
const T = '/home/user/wt/joinx/src/domain/facts/';
const { factsOf } = await import(T + 'factsOf.js'); const { declarationAdmits, declarationOf } = await import(T + 'factVocabulary.js');
const [,, BEFORE, AFTER, REC] = process.argv;
const ad = (needs, excludes, f) => declarationAdmits(declarationOf({ text: 'x', needs, excludes }), f).admitted;
const out = { E5: [], G8: [], E6: [], none: [] };
for (const fn of readdirSync(BEFORE)) {
  const a = JSON.parse(readFileSync(join(BEFORE, fn))), b = JSON.parse(readFileSync(join(AFTER, fn)));
  const A = a.printed['World/Daily Life'] || [], B = b.printed['World/Daily Life'] || [];
  if (A.length === B.length && A.every((x, i) => x === B[i])) continue;
  const rec = JSON.parse(gunzipSync(readFileSync(join(REC, `${a.seed}.json.gz`))).toString()).record; const f = factsOf(rec);
  const who = [];
  if (ad(['ruler: elder'], [], f) !== ad(['office: elders'], [], f)) who.push('E5');
  if (ad(['prosperity: < comfortable'], [], f) && !ad(['prosperity: < comfortable'], ['food: = pressured'], f)) who.push('G8');
  else if (ad(['prosperity: ≤ poor'], [], f) && !ad(['prosperity: ≤ poor'], ['food: = pressured'], f)) who.push('G8');
  if (ad(['sovereign', "office: lord's steward", 'institution: lordsSteward'], [], f)) who.push('E6');
  for (const u of (who.length ? who : ['none'])) out[u].push(`${a.seed}`);
}
for (const [k, v] of Object.entries(out)) { const by = {}; for (const s of v) { const z = s.replace(/^dp-|-\d+$/g, ''); by[z] = (by[z] || 0) + 1; } console.log(k, v.length, JSON.stringify(by), v.slice(0, 8).join(' ')); }
