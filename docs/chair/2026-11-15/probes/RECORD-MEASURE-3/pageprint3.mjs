// RECORD-MEASURE-3 page print: node pageprint3.mjs <corpus> <dumps>. For each row's class (predicate on the record),
// how many towns PRINT both halves where a reader meets them (tabs: Summary/Systems/World/Table sections).
import fs from 'node:fs'; import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const [CORPUS, DUMPS] = process.argv.slice(2); const L = require('./load.cjs')(CORPUS);
const sect = (t) => { const o = {}; let c = ''; for (const l of t.split('\n')) { const m = /^== (.+) ==$/.exec(l); if (m) c = m[1]; else (o[c] ??= []).push(l); } return o; };
const tab = (o, re = /^(Summary|Systems|World|Table)\//) => Object.entries(o).filter(([k]) => re.test(k)).flatMap(([, v]) => v);
const band = (n) => n >= 65 ? 'STRONG' : n >= 40 ? 'ADEQUATE' : n >= 20 ? 'WEAK' : 'CRITICAL';
const R = { r1e: [0, 0, 0], r1m: [0, 0], r2a: [0, 0], r2b: [0, 0], r3: [0, 0], r4: [0, 0] };
for (const { seed, s } of L) {
  const f = `${DUMPS}/${seed}.txt`; if (!fs.existsSync(f)) continue; const o = sect(fs.readFileSync(f, 'utf8'));
  const T = tab(o); const has = (re, lines = T) => lines.some((l) => re.test(l));
  const p = s.economicState.prosperity, sc = s.defenseProfile.scores;
  if (band(sc.economic) === 'STRONG' && ['Poor', 'Struggling'].includes(p)) { R.r1e[0]++;
    const pw = has(new RegExp(`^${p}$`)); const ov = has(/^Economic ResilienceStrong$/, o['Summary/Overview'] || []);
    const df = has(/money in hand|money laid by|money enough|arrangements intact|own business running/, o['Systems/Defense'] || []);
    if (pw && ov) R.r1e[1]++; if (pw && df) R.r1e[2]++; }
  if (band(sc.military) === 'STRONG' && ['Vulnerable', 'Undefended'].includes(s.defenseProfile.readiness.label)) { R.r1m[0]++;
    if (has(/would see off a raid|see off/, o['Systems/Defense'] || []) && has(/^Vulnerable$|^Undefended$/, o['Systems/Defense'] || [])) R.r1m[1]++; }
  const sp = s.economicState.safetyProfile || {}, bmc = Number(sp.blackMarketCapture) || 0, cs = (s.economicState.incomeSources || []).filter((x) => x.isCriminal);
  const E = o['Systems/Economics'] || [];
  if (bmc >= 3 && !cs.length) { R.r2a[0]++; if (has(new RegExp(`^Shadow Economy: ${bmc}% capture`), E)) R.r2a[1]++; }
  if (bmc >= 3 && cs.length && cs[0].percentage !== bmc) { R.r2b[0]++; const i = E.findIndex((l) => l.includes(cs[0].source));
    if (has(new RegExp(`^Shadow Economy: ${bmc}% capture`), E) && i > 0 && E[i - 1] === `${cs[0].percentage}%`) R.r2b[1]++; }
  const fs_ = s.economicState.foodSecurity, fb = s.economicViability.metrics.foodBalance;
  const rem = fs_.deficit > 0 ? Math.max(0, fs_.dailyNeed - Math.max(0, fs_.dailyProduction) - Math.max(0, fs_.importCoverage) - Math.max(0, fs_.magicOffset)) : 0;
  if (Math.round(rem) !== Math.round(fb.deficit || 0)) { R.r3[0]++;
    const m = T.map((l) => /cannot cover ~(\d+) lbs|requires ~(\d+) lbs|imports ~(\d+) lbs/.exec(l)).find(Boolean); const sh = T.map((l) => /Short: ([\d,]+) lbs/.exec(l)).find(Boolean);
    if (m && sh && Number((m[1] || m[2] || m[3])) !== Number(sh[1].replace(/,/g, ''))) R.r3[1]++; }
}
console.log(JSON.stringify(R));
