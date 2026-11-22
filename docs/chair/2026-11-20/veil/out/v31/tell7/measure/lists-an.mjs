// R3-TELL-7 unit (vii) STEP 1: THE TABLE (lists.probe.jsx's shards).   node lists-an.mjs <dir> [srcdir for the map]
// Per town, family (crimeTypes / ops / plotHooks), engine (server / twin), Reveal (off / dm) and gated setting: the served list
// of A against the house-free twin B's served list UNDER THE SAME SETTING, read by the same engine, as multisets:
//   EQ  equal (ORD: equal but in another order)   PART  served a STRICT PART of twin's   HOLDS  served holds what twin lacks
//   BOTH  each holds what the other lacks          FORM  one served '#absent' (or no profile) where the other is a list
// Per town and family the worst class over every page (BOTH > HOLDS > PART > FORM > ORD > EQ). THEN THE CAUSES of every
// entry a PART (or BOTH) page lacks that the twin shows, by what the RECORD (the stored town A) holds:
//   veil:withheld   the stored A list holds the entry and the read withheld it (the map's attribution, or the ops re-derivation)
//   veil:fallback   'Background crime' / 'Lawlessness' (safetyProfile.js's fallback): stored A lacks it, A's own non-crisis
//                   types were ALL withheld on the page (the withheld rows were the only ones), and A's record meets the
//                   fallback's condition (label Unsafe/Dangerous/criminal governance/authoritarian, or criminalEffective >= 45)
//   veil:crisis     a type raised by no house (the map's []) that A's crisis raises, stored A lacks it (a line settled away
//                   beside the hidden network: settleCrimeLinesToSignal)
//   draw            none of these: the twin's own draw (ruling 54: the twin is another draw)
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const towns = readdirSync(dir).filter((f) => /^lists-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).towns);
const { CRIME_TYPE_RAISERS } = await import(`${process.argv[3] || process.cwd()}/src/domain/display/galleryRosterChoices.js`);
const FAM = ['crimeTypes', 'ops', 'plotHooks'];
const RANK = { EQ: 0, ORD: 1, FORM: 2, PART: 3, HOLDS: 4, BOTH: 5 };
const bag = (xs) => { const m = new Map(); for (const x of xs) m.set(x, (m.get(x) || 0) + 1); return m; };
const minus = (a, b) => { const mb = bag(b); const out = []; for (const x of a) { const k = mb.get(x) || 0; if (k > 0) mb.set(x, k - 1); else out.push(x); } return out; };
const cls = (s, t) => {
  if (!Array.isArray(s) || !Array.isArray(t)) return s === t ? 'EQ' : 'FORM';
  const lack = minus(t, s); const extra = minus(s, t);
  if (!lack.length && !extra.length) return JSON.stringify(s) === JSON.stringify(t) ? 'EQ' : 'ORD';
  if (lack.length && extra.length) return 'BOTH';
  return lack.length ? 'PART' : 'HOLDS';
};
const DANGER = new Set(['Unsafe', 'Dangerous', 'Dangerous — Criminal Governance', 'Controlled — Authoritarian']);
const crisisType = (t) => Array.isArray(CRIME_TYPE_RAISERS[t]) && CRIME_TYPE_RAISERS[t].length === 0;
const nonCrisis = (t) => Array.isArray(CRIME_TYPE_RAISERS[t]) && CRIME_TYPE_RAISERS[t].length > 0;
const cause = (r, fam, e, served) => {
  const stored = r.storedA[fam];
  if (Array.isArray(stored) && stored.includes(e)) return 'veil:withheld';
  if (fam === 'crimeTypes') {
    if ((e === 'Background crime' || e === 'Lawlessness') && Array.isArray(stored)) {
      const own = stored.filter(nonCrisis);
      const allGone = own.every((t) => !served.includes(t));
      const cond = DANGER.has(r.readA.label) || (typeof r.readA.crimEff === 'number' && r.readA.crimEff >= 45);
      if (own.length && allGone && cond) return 'veil:fallback';
    }
    if (crisisType(e)) return 'veil:crisis?';
  }
  return 'draw';
};
const lines = []; const P = (s = '') => lines.push(s);
const summary = {}; const strict = [];
let parity = { srvA: 0, srvB: 0, pages: 0 };
for (const r of towns) {
  for (const [key, p] of Object.entries(r.pages)) {
    parity.pages += 1;
    if (JSON.stringify(p.srvA) !== JSON.stringify(p.twA)) parity.srvA += 1;
    if (JSON.stringify(p.srvB) !== JSON.stringify(p.twB)) parity.srvB += 1;
  }
  for (const fam of FAM) {
    let worst = 'EQ'; const seen = {};
    for (const [key, p] of Object.entries(r.pages)) {
      for (const [eng, s, t] of [['server', p.srvA[fam], p.srvB[fam]], ['twin', p.twA[fam], p.twB[fam]]]) {
        const c = cls(s, t); seen[c] = (seen[c] || 0) + 1;
        if (RANK[c] > RANK[worst]) worst = c;
        if (c === 'PART' || c === 'BOTH') {
          const lack = minus(t, s);
          strict.push({ seed: r.seed, size: r.size, crisis: r.crisis, fam, eng, key, cls: c, lack: lack.map((e) => `${e} <${cause(r, fam, e, s)}>`), extra: minus(s, t) });
        }
      }
    }
    ((summary[fam] ||= {})[r.size] ||= {});
    (summary[fam][r.size][worst] ||= []).push(r.seed);
    r[`worst_${fam}`] = worst; r[`seen_${fam}`] = seen;
  }
}
P(`R3-TELL-7 STEP 1: the safety lists served against the house-free twin's, ${towns.length} hidden-house towns, every gated setting (10), Reveal off and DM, server and twin (pages: ${parity.pages} per engine)`);
P(`ENGINE PARITY: A server != twin on ${parity.srvA} pages; B server != twin on ${parity.srvB} pages (all three lists, byte for byte)`);
P('');
P('THE TABLE: per family and size, towns by their WORST class over every page (EQ equal, ORD equal in another order, FORM presence differs, PART served a strict part of twin, HOLDS served holds what twin lacks, BOTH)');
for (const fam of FAM) {
  P(`  ${fam}`);
  for (const size of Object.keys(summary[fam]).sort()) {
    const row = summary[fam][size];
    P(`    ${size.padEnd(10)} ${Object.entries(row).sort((a, b) => RANK[a[0]] - RANK[b[0]]).map(([c, xs]) => `${c} ${xs.length}`).join(' | ')}`);
    for (const [c, xs] of Object.entries(row)) if (c !== 'EQ') P(`        ${c}: ${xs.join(', ')}`);
  }
}
P('');
P('EVERY STRICT-PART (and BOTH) PAGE GROUPED BY TOWN, FAMILY AND WHAT IS LACKING (with its cause); engines:readings:settings');
const g = new Map();
for (const x of strict) { const k = `${x.seed} (${x.size}, ${x.crisis}) | ${x.fam} | ${x.cls} | lacks ${x.lack.join('; ')}${x.extra.length ? ` | extra ${x.extra.join('; ')}` : ''}`; (g.get(k) || g.set(k, []).get(k)).push(`${x.eng}:${x.key}`); }
for (const [k, v] of [...g.entries()].sort()) P(`  ${k} | ${v.length} pages: ${[...new Set(v.map((s) => s.split(':')[0]))].join('+')} ${[...new Set(v.map((s) => s.split(':').slice(1).join(':')))].join(' ')}`);
P('');
P('THE CAUSES, by family: strict-part TOWNS by the cause of each lacking entry (a town counted once per cause)');
const byCause = {};
for (const x of strict) for (const l of x.lack) { const c = /<([^>]+)>$/.exec(l)[1]; ((byCause[x.fam] ||= {})[c] ||= new Set()).add(x.seed); }
for (const [fam, m] of Object.entries(byCause)) for (const [c, s] of Object.entries(m)) P(`  ${fam} ${c}: ${s.size} town(s): ${[...s].join(', ')}`);
P('');
P('THE HOLDS PAGES (served holds what the twin lacks), by town and family: what is extra');
const h = new Map();
for (const r of towns) for (const fam of FAM) for (const [key, p] of Object.entries(r.pages)) for (const [eng, s, t] of [['server', p.srvA[fam], p.srvB[fam]], ['twin', p.twA[fam], p.twB[fam]]]) {
  if (cls(s, t) !== 'HOLDS') continue; const k = `${r.seed} (${r.size}) | ${fam} | extra ${minus(s, t).join('; ')}`; (h.get(k) || h.set(k, []).get(k)).push(`${eng}:${key}`);
}
for (const [k, v] of [...h.entries()].sort()) P(`  ${k} | ${v.length} pages`);
console.log(lines.join('\n'));
