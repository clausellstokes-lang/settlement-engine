// PROOF-4: WORDS-2's E2 census pairs (E2-CENSUS.md's top fifteen) counted by the pair's own two printed sentences, per page,
// over a battery's --views rows. A MEASURE. node e2census.mjs <rowsDir>
import { readdirSync, readFileSync } from 'node:fs';
const D = process.argv[2];
const V10 = /^(The war takes most of the money|Big decisions wait for a new leader|Nothing gets decided, repairs|Trade suffers as carts stop|People no longer trust those in charge|Much of what is earned here goes|Trade by road, gate and water has stopped|Food will run short|Taxes are disputed|Nothing is being taken yet|The occupiers take the revenue|Fewer people come to market|No one can earn a normal living|Travel is discouraged|The tithe is split)/;
const after = (ls, label) => { const i = ls.indexOf(label); return i >= 0 ? ls[i + 1] : undefined; };
const PAIRS = {
  '#1': (p) => p.pow.some((l) => /A headman settles disputes/.test(l)) && p.pow.some((l) => /must agree, and once made/.test(l)),
  '#3': (p) => p.fnd.includes('Law & orderAdequate') && /^(Unsafe|Dangerous)/.test(after(p.ov, 'Safety') || ''),
  '#4': (p) => p.fnd.includes('Law & orderAdequate') && p.def.some((l) => /outrunning the watch|faster than arrests/.test(l)),
  '#6+7': (p) => p.eco.some((l) => /^Little that comes past/.test(l)) && (p.eco.some((l) => /^Buyers from outside come to/.test(l)) || p.ov.some((l) => /Market day is when .* fills: the roads bring buyers/.test(l))),
  '#8': (p) => p.dl.some((l) => /^(Nobody here goes hungry|Money is short, so meals are plain, but nobody goes without)/.test(l)) && p.ov.includes('Food SecurityPressured'),
  '#9': (p) => p.def.some((l) => /has no wall against the country/.test(l)) && p.def.some((l) => /has no wall, and nothing threatens it/.test(l)),
  '#10': (p) => p.cri.some((l) => V10.test(l) && p.def.includes(l)),
  '#11': (p) => [...p.ov, ...p.pow].some((l) => /no stable governing authority/.test(l)) && p.def.some((l) => /^No stable governing authority/.test(l)),
  '#13': (p) => [...p.ov, ...p.eco].filter((l) => /There is no market at /.test(l)).length >= 2,
};
const n = {}; const ex = {};
for (const f of readdirSync(D)) {
  const r = JSON.parse(readFileSync(`${D}/${f}`)); const v = r.printed;
  const p = { pow: v['Systems/Power'] || [], fnd: v['Summary/Foundations'] || [], ov: v['Summary/Overview'] || [], def: v['Systems/Defense'] || [], eco: v['Systems/Economics'] || [], dl: v['World/Daily Life'] || [], cri: v['Summary/Crisis'] || [] };
  for (const [k, t] of Object.entries(PAIRS)) if (t(p)) { n[k] = (n[k] || 0) + 1; (ex[k] ||= []).length < 3 && ex[k].push(r.seed); }
}
for (const k of Object.keys(PAIRS)) console.log(`${k}\t${n[k] || 0}\t${(ex[k] || []).join(' ')}`);
