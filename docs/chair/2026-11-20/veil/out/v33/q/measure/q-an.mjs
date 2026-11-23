// V33-Q: the analyses of q.probe.jsx's records.   node q-an.mjs <outdir> [failing towns, comma-separated]
// Reads <outdir>/q-towns-shard*.json, q-pool-shard*.json, q-insurg-shard*.json (each where present) and prints the measures of
// units (iv) and (v), section by section. Gated pages: every setting of a hidden-house town (each hides a house it holds,
// ruling 62 (3)); the house-free twin B and the pool are read as they are.
import { readFileSync, existsSync } from 'node:fs';
import { CRIM_RE } from '../../../v27/tell/measure/tell-surface.mjs';
const O = process.argv[2];
const FAIL = (process.argv[3] || 'r3m-city-none-1-117,r3m-metropolis-indebted-1-136').split(',');
const load = (m) => [0, 1, 2, 3].map((s) => `${O}/q-${m}-shard${s}.json`).filter(existsSync).flatMap((f) => JSON.parse(readFileSync(f, 'utf8')).births);
const towns = load('towns'); const pool = load('pool'); const ins = load('insurg');
const inc = (o, k, n = 1) => { o[k] = (o[k] || 0) + n; return o; };
const J = JSON.stringify;
const top = (o, n = 12) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${v}  ${k}`).join('\n    ');
const crimRel = (r) => /gov-crim|crim-served/.test(r[4]) || CRIM_RE.test(String(r[1] ?? ''));
const H = towns.filter((t) => t.hidden.length);
const say = (...a) => console.log(...a);
say(`RECORDS: towns ${towns.length} (hidden-house ${H.length}), pool ${pool.length} (A ${pool.filter((b) => b.part === 'A').length}, B ${pool.filter((b) => b.part === 'B').length}), insurgency births ${ins.length}`);

// ── (iv) RELATIONS
say('\n== (iv) RELATIONS: every served powerStructure.factionRelationships row on the gated pages of the failing towns (engine|read|setting -> rows: pair|type|direction|captureState|ends|fields naming a withheld power or hidden house)');
for (const seed of FAIL) {
  const t = H.find((x) => x.seed === seed); if (!t) { say(`  ${seed}: NOT IN THE RECORDS`); continue; }
  say(`  ${seed} (${t.size}) hidden houses ${J(t.hidden)}; stored powers ${J(t.stored.powers)}`);
  say(`    STORED rows: ${t.stored.rel.map((r) => r.join('|')).join(' ;; ') || 'none'}`);
  const byRow = {};
  for (const eng of ['twin', 'server']) for (const [k, p] of Object.entries(t[eng] || {})) for (const r of p.rel) inc(byRow, `${eng}: ${r.join('|')}`);
  say(`    SERVED rows (engine: row -> gated pages serving it, of 20 a engine):\n    ${top(byRow, 40)}`);
  const crimPages = {}; for (const eng of ['twin', 'server']) for (const [k, p] of Object.entries(t[eng] || {})) inc(crimPages, `${eng} ${p.rel.filter(crimRel).length ? 'family+' : 'family0'}`);
  say(`    pages by the GATE-2 family powers.relations (a row with a criminal served end or a crime-worded type): ${J(crimPages)}`);
  if (t.B) {
    say(`    HOUSE-FREE TWIN B: stored powers ${J(t.B.stored.powers)}; hideable left ${t.B.hideableLeft}`);
    say(`      B STORED rows: ${t.B.stored.rel.map((r) => r.join('|')).join(' ;; ') || 'none'}`);
    const bRows = {}; for (const p of Object.values(t.B.twin)) for (const r of p.rel) inc(bRows, r.join('|'));
    say(`      B twin served rows (row -> pages of 20):\n      ${top(bRows, 20).replace(/\n    /g, '\n      ')}`);
  }
}
say('\n  EVERY hidden-house town whose gated pages serve a relation row with a criminal served end (any engine): town | ends classes seen | rows naming a withheld power or hidden house');
for (const t of H) {
  const cl = {}; let named = 0;
  for (const eng of ['twin', 'server']) for (const p of Object.values(t[eng] || {})) for (const r of p.rel) { if (crimRel(r)) inc(cl, r[4]); if (/withheld|hidden-house|unknown/.test(r[4]) || r[5]) named += 1; }
  if (Object.keys(cl).length || named) say(`    ${t.seed} (${t.size}) | ${J(cl)} | rows with a withheld or unknown end, or a field naming one: ${named}`);
}
const govRel = {};
for (const b of pool) for (const [k, p] of Object.entries(b.pages)) {
  if (!p.govC) continue;
  const g = `${b.size} part ${b.part}`; govRel[g] ||= { pages: 0, births: new Set(), withRel: 0, withRelBirths: new Set() };
  govRel[g].pages += 1; govRel[g].births.add(b.seed);
  if (p.rel.some((r) => r[4].includes('gov-crim'))) { govRel[g].withRel += 1; govRel[g].withRelBirths.add(b.seed); }
}
say('\n  THE POOL: nothing-hidden pages whose served GOVERNING power is criminal, by size and part: pages (births) | of them serving a relation of that power: pages (births)');
for (const [g, v] of Object.entries(govRel).sort()) say(`    ${g}: ${v.pages} (${v.births.size}) | ${v.withRel} (${v.withRelBirths.size})`);
const famRel = {};
for (const b of pool) for (const p of Object.values(b.pages)) { const g = `${b.size}`; famRel[g] ||= { pages: 0, fam: 0, births: new Set() }; famRel[g].pages += 1; if (p.rel.some(crimRel)) { famRel[g].fam += 1; famRel[g].births.add(b.seed); } }
say('  THE POOL: pages serving any relation row of the family (a criminal served end or a crime-worded type), by size: pages | of them | births');
for (const [g, v] of Object.entries(famRel).sort()) say(`    ${g}: ${v.pages} | ${v.fam} | ${v.births.size}`);

// ── (v) (1) safetyDesc
say('\n== (v) (1) safetyDesc: " Everyone comes in by the gates, where the guard sees them." in NOTHING-HIDDEN births (pool part A, B shown whole beside it), by size: births whose STORED line holds it | births with a served page holding it | pages holding it / pages');
for (const size of ['village', 'town', 'city', 'metropolis']) for (const part of ['A', 'B']) {
  const bs = pool.filter((b) => b.size === size && b.part === part); if (!bs.length) continue;
  const st = bs.filter((b) => b.stored.sd.ev).length; const sv = bs.filter((b) => Object.values(b.pages).some((p) => p.sd.ev)).length;
  const pg = bs.flatMap((b) => Object.values(b.pages)); const pe = pg.filter((p) => p.sd.ev).length;
  const bn = bs.filter((b) => b.stored.sd.bn).length;
  say(`    ${size} ${part}: ${st} of ${bs.length} | ${sv} | ${pe} / ${pg.length}   (the beneath clause stored: ${bn}; the Very Safe line stored: ${bs.filter((b) => b.stored.sd.vs).length})`);
}
for (const seed of ['r3m-city-none-1-113', 'r3m-metropolis-infiltrated-0-62']) {
  const t = H.find((x) => x.seed === seed); if (!t) { say(`  ${seed}: NOT IN THE RECORDS`); continue; }
  const st = {}; for (const eng of ['twin', 'server']) for (const p of Object.values(t[eng] || {})) inc(st, `${eng} s=${p.sd.s} ev=${p.sd.ev} bn=${p.sd.bn} other-paths-holding-the-clause=${J(p.sd.bnAt || [])}`);
  const bs = t.B ? Object.values(t.B.twin).reduce((o, p) => inc(o, `s=${p.sd.s} ev=${p.sd.ev} bn=${p.sd.bn}`), {}) : null;
  say(`  ${seed}: stored ${J(t.stored.sdText)}\n    served (engine state: pages) ${J(st)}\n    house-free twin B stored ${J(t.B?.stored.sdText)}; B pages ${J(bs)}`);
}

// ── (v) (2) currentTensions
say('\n== (v) (2) currentTensions: a crime_wave\'s `factions` in NOTHING-HIDDEN TOWN births (pool part A), the stored record (ends: a power the record holds, or none) and the served pages');
const cwSt = {}; const cwPg = {}; let cwB = 0; let townsA = 0;
for (const b of pool.filter((x) => x.size === 'town' && x.part === 'A')) {
  townsA += 1; let any = false;
  if (Array.isArray(b.stored.ten)) for (const [ty, fs, cl] of b.stored.ten) if (ty === 'crime_wave') { any = true; inc(cwSt, `${fs} [ends ${cl || '-'}]`); }
  for (const p of Object.values(b.pages)) if (Array.isArray(p.ten)) for (const [ty, fs, cl] of p.ten) if (ty === 'crime_wave') inc(cwPg, `${fs} [ends ${cl || '-'}] sig=${p.sig}`);
  if (any) cwB += 1;
}
say(`  town births (part A) ${townsA}; holding a crime_wave (stored) ${cwB}\n  STORED forms (form -> births):\n    ${top(cwSt, 20)}\n  SERVED forms (form, the page's served crime signal -> pages):\n    ${top(cwPg, 20)}`);
const sig0 = {}; let sig0n = 0; let sig0empty = 0; const sig0Births = new Set();
for (const b of pool.filter((x) => x.size === 'town' && x.part === 'A')) for (const p of Object.values(b.pages)) {
  if (p.sig) continue; sig0n += 1; sig0Births.add(b.seed);
  if (!Array.isArray(p.ten)) { inc(sig0, '#absent'); continue; }
  if (!p.ten.length) sig0empty += 1;
  inc(sig0, p.ten.map(([ty]) => ty).sort().join('+') || '(empty)');
}
say(`  NOTHING-HIDDEN TOWN PAGES WITH NO SERVED CRIME SIGNAL: ${sig0n} pages of ${sig0Births.size} births; currentTensions empty on ${sig0empty}; the types they show (types -> pages):\n    ${top(sig0, 15)}`);
const cw0 = {}; for (const b of pool.filter((x) => x.size === 'town' && x.part === 'A')) for (const p of Object.values(b.pages)) if (!p.sig && Array.isArray(p.ten)) for (const [ty, fs, cl] of p.ten) if (ty === 'crime_wave') inc(cw0, `${fs} [${cl}]`);
say(`  of them, a crime_wave SERVED with no served crime signal (the hiding read's rule would take it; a nothing-hidden read runs no such rule): ${J(cw0)}`);
for (const seed of ['r3m-town-none-0-23', 'r3m-town-none-0-21']) {
  const t = H.find((x) => x.seed === seed); if (!t) { say(`  ${seed}: NOT IN THE RECORDS`); continue; }
  const st = {}; for (const eng of ['twin', 'server']) for (const [k, p] of Object.entries(t[eng] || {})) inc(st, `${eng} sig=${p.sig} ten=${J(p.ten)}`);
  const bs = t.B ? Object.values(t.B.twin).reduce((o, p) => inc(o, `sig=${p.sig} ten=${J(p.ten)}`), {}) : null;
  say(`  ${seed}: stored ${J(t.stored.tenFull)}\n    served (engine, signal, tensions -> pages):\n    ${top(st, 12)}\n    B stored ${J(t.B?.stored.tenFull)}\n    B pages ${J(bs)}`);
}

// ── (v) (3) criminal imports
say('\n== (v) (3) criminal imports: NOTHING-HIDDEN TOWN births in the insurgency crisis (new births), and the pool\'s');
for (const [label, bs] of [['insurgency births (q33i)', ins.filter((b) => b.size === 'town')], ['pool part A town, insurgency', pool.filter((b) => b.size === 'town' && b.part === 'A' && b.crisis === 'insurgency')], ['pool part A town, every crisis', pool.filter((b) => b.size === 'town' && b.part === 'A')]]) {
  if (!bs.length) { say(`  ${label}: none`); continue; }
  const st = {}; for (const b of bs) inc(st, Array.isArray(b.stored.imp) ? String(Math.min(b.stored.imp.length, 2)) : '#a');
  const several = bs.filter((b) => Object.values(b.pages).some((p) => Array.isArray(p.imp) && p.imp.length >= 2));
  const pg = {}; for (const b of bs) for (const p of Object.values(b.pages)) inc(pg, Array.isArray(p.imp) ? String(Math.min(p.imp.length, 2)) : '#a');
  const forms = {}; for (const b of several) for (const p of Object.values(b.pages)) if (Array.isArray(p.imp) && p.imp.length >= 2) inc(forms, p.imp.join(' + '));
  say(`  ${label}: births ${bs.length}; stored criminal imports (0/1/2=several) ${J(st)}; served pages ${J(pg)}; BIRTHS SHOWING SEVERAL ON A SERVED PAGE ${several.length}${several.length ? ` (${several.slice(0, 8).map((b) => b.seed).join(', ')})` : ''}\n    forms: ${top(forms, 6)}`);
}
const ic = ins.length ? JSON.parse(readFileSync(`${O}/q-insurg-shard0.json`, 'utf8')).cost : null; if (ic) say(`  (shard 0's cost: ${J(ic)})`);
for (const seed of ['r3m-town-insurgency-0-14']) {
  const t = H.find((x) => x.seed === seed); if (!t) { say(`  ${seed}: NOT IN THE RECORDS`); continue; }
  const st = {}; for (const eng of ['twin', 'server']) for (const p of Object.values(t[eng] || {})) inc(st, `${eng} ${J(p.imp)}`);
  const bs = t.B ? Object.values(t.B.twin).reduce((o, p) => inc(o, J(p.imp)), {}) : null;
  say(`  ${seed}: stored ${J(t.stored.imp)}\n    served ${J(st)}\n    B stored ${J(t.B?.stored.imp)}; B pages ${J(bs)}`);
}

// ── (v) (4) criminalCaptureState
say('\n== (v) (4) powerStructure.criminalCaptureState where the SERVED crime signal is false, on the gated pages of the 92 (engine|Reveal|setting -> pages serving a value other than \'none\')');
const cc = {}; const ccTowns = {}; const ccVals = {};
for (const t of H) for (const eng of ['twin', 'server']) for (const [k, p] of Object.entries(t[eng] || {})) {
  if (p.sig || p.ccs === '#a') continue;
  inc(ccVals, `${eng} ${k.split('|')[0]} ${J(p.ccs)}`);
  if (p.ccs !== 'none') { inc(cc, `${eng} ${k}`); (ccTowns[t.seed] ||= new Set()).add(`${eng}:${k}:${p.ccs}`); }
}
say(`  values on such pages (engine Reveal value -> pages): ${J(ccVals)}\n  pages with a value other than 'none' (engine Reveal|setting -> pages):\n    ${top(cc, 40)}`);
say(`  TOWNS (${Object.keys(ccTowns).length}):`);
for (const [s, v] of Object.entries(ccTowns)) { const t = H.find((x) => x.seed === s); const bv = t.B ? [...new Set(Object.values(t.B.twin).map((p) => p.ccs))] : null; say(`    ${s}: ${[...new Set([...v].map((x) => x.split(':').pop()))].join(',')} on ${v.size} pages | house-free twin B's pages: ${J(bv)} (B stored ${J(t.B?.stored.ccs)}; B criminal powers ${J(t.B?.stored.crimP)})`); }
const pc = {}; for (const b of pool) for (const [k, p] of Object.entries(b.pages)) if (!p.sig) inc(pc, `${b.size} ${J(p.ccs)}`);
say(`  THE POOL, pages with no served crime signal, by size and value: ${J(pc)}`);
