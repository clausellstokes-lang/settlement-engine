// WORDS-2 · per-unit attribution of a before/after battery pair (base vs the join without E3). A MEASURE.
// Usage: node unit-attribute.mjs <before rows> <after rows> <records dir of the before tree>
import { readdirSync, readFileSync } from 'node:fs'; import { gunzipSync } from 'node:zlib'; import { join } from 'node:path';
const { liveInstitutionNames } = await import('/home/user/wt/base/src/domain/facts/liveInstitutionNames.js');
const [,, BEFORE, AFTER, REC] = process.argv;
const V10 = /^(The war takes most of the money|Big decisions wait for a new leader|Nothing gets decided, repairs|Trade suffers as carts stop|People no longer trust those in charge|Much of what is earned here goes|Trade by road, gate and water has stopped|Food will run short|Taxes are disputed|Nothing is being taken yet|The occupiers take the revenue|Fewer people come to market|No one can earn a normal living|Travel is discouraged|The tithe is split)/;
const RULES = [
  ['G34', (v, l) => /^Law & order/.test(l) || /^(Unsafe|Dangerous) day to day; the law/.test(l)],
  ['G10', (v, l) => v === 'Systems/Defense' && V10.test(l)],
  ['G11', (v, l) => v === 'Systems/Defense' && /^(No stable governing authority[.;]|Enforcement is inconsistent; which power|Whoever holds sway decides)/.test(l)],
  ['G9', (v, l) => v === 'Systems/Defense' && /(has no wall, and nothing threatens it|^No wall marks where|is too small to wall and knows it)/.test(l)],
  ['E4', (v, l) => v === 'Systems/Economics' && /^(There is no market at |Whatever its \w+ brings goes on past)/.test(l)],
  ['G6', (v, l) => v === 'Systems/Economics' && /(^Little that comes past|sits on its \w+ and stays poor all the same|'s \w+ is busy, and the \w+ is poor all the same)/.test(l)],
  ['G1', (v, l) => v === 'Systems/Power' && /(must agree, and once made|business goes to the whole|left obvious decisions untaken|watches the \w+'s temper closely|^The shape of authority$)/.test(l)],
];
const ELDER = /^(The elder is asked at first light|People stop at the elder's door|Matters of any weight are talked over at the elder's door)/;
const FARE = /^(Nobody here goes hungry, though few eat richly|Money is short, so meals are plain, but nobody goes without)/;
const L12 = /^The lord's steward is obeyed/;
const units = {}; const un = []; const add = (u, seed, size) => { (units[u] ||= { pages: new Set(), size: {} }); if (!units[u].pages.has(seed)) { units[u].pages.add(seed); units[u].size[size] = (units[u].size[size] || 0) + 1; } };
for (const f of readdirSync(BEFORE)) {
  const a = JSON.parse(readFileSync(join(BEFORE, f))), b = JSON.parse(readFileSync(join(AFTER, f)));
  if (a.pageHash === b.pageHash) continue;
  const seed = a.seed, size = a.size;
  for (const v of new Set([...Object.keys(a.printed), ...Object.keys(b.printed)])) {
    const A = a.printed[v] || [], B = b.printed[v] || [];
    const gone = A.filter((x) => !B.includes(x)), came = B.filter((x) => !A.includes(x));
    const moved = [...gone.map((l) => ['-', l]), ...came.map((l) => ['+', l])];
    if (!moved.length) continue;
    if (v === 'World/Daily Life') {
      const who = [];
      if (gone.some((l) => ELDER.test(l))) who.push('E5');
      if (gone.some((l) => FARE.test(l))) who.push('G8');
      const rec = JSON.parse(gunzipSync(readFileSync(join(REC, `${seed}.json.gz`))).toString()).record;
      if (came.some((l) => L12.test(l)) || liveInstitutionNames(rec).some((n) => /lord's steward/i.test(n))) who.push('E6');
      if (!who.length) un.push(`${seed} ${v} ${moved.map(([d, l]) => d + l.slice(0, 60)).join(' | ')}`);
      for (const u of who) add(u, seed, size);
      continue;
    }
    for (const [d, l] of moved) {
      const s = l.split(a.seed).join('');
      const hit = RULES.find(([, t]) => t(v, l.replace(/^[^ ]+ /, (m) => m)) || t(v, l));
      const hit2 = hit || RULES.find(([, t]) => t(v, l.replace(/^\S+ (?=(has no wall|is too small|sits on|watches))/, '{S} ')));
      if (hit2) add(hit2[0], seed, size); else un.push(`${seed} ${v} ${d}${l.slice(0, 110)}`);
    }
  }
}
for (const [u, r] of Object.entries(units).sort()) console.log(u, r.pages.size, JSON.stringify(r.size), [...r.pages].slice(0, 3).join(' '));
const nd = un.filter((x) => !x.includes('World/Daily Life')); console.log('UNATTRIBUTED outside Daily Life', nd.length); for (const x of nd.slice(0, 25)) console.log('  ', x);
