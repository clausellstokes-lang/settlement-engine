// V33-LP: THE READ-STORED MODE'S OWN TABLES. node lp-an.mjs <readdir> [<baseline readdir>] [<registry module>]
// <readdir> is stored.sh's outdir (extra-shard*.json, the stored dir named in its meta). With a baseline (the born-today
// read of the same slice) the tells table marks a row LEGACY-ONLY where <readdir> tells and the baseline does not.
//   (2) THE DIFFERENTIAL   hiding reads, engine-door reads, equal, every fault (galleryVeilRecent's arm)
//   (3) THE TELLS          per registry row (or "(unregistered) <prefix>"): documents with a name / kind / key tell, an example
//   (4) THE READERS        per re-derived value on a nothing-hidden read: equal / differ / notDrawn / served / recordLacks
//   (5) THE WORD RULES     registry rows whose recognition (`house`) or rule (`scope`) reads words, not a key: each row's
//                          path present in how many stored documents, and its tells, both dumps
import { readFileSync, readdirSync, existsSync } from 'node:fs';
const [dir, base, regMod = '/home/user/wt/lp/src/domain/veil/rosterChoiceRegistry.js'] = process.argv.slice(2);
const load = (d) => (d && existsSync(d) ? readdirSync(d).filter((f) => /^extra-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${d}/${f}`, 'utf8'))) : []);
const isRec = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const REG = await import(regMod);
const sets = [{ name: 'this', sh: load(dir) }, ...(base ? [{ name: 'baseline', sh: load(base) }] : [])];
for (const s of sets) { s.births = s.sh.flatMap((x) => x.births); s.dir = s.sh[0]?.meta?.dir; }
const [L, B] = sets;
const pct = (a, b) => `${a}/${b}`;
console.log(`DOCUMENTS: ${sets.map((s) => `${s.name} ${s.births.length} (${s.dir})`).join(' | ')}`);
for (const s of sets) {
  const by = (f) => s.births.reduce((m, b) => { const k = f(b); m[k] = (m[k] || 0) + 1; return m; }, {});
  console.log(`  ${s.name}: role/holds ${JSON.stringify(by((b) => `${b.role}:${b.held.length ? 'holds' : 'none'}`))}; owner-hidden powers in ${s.births.filter((b) => b.ownerHidden).length}; publicProse stored ${s.births.filter((b) => b.hasPublicProse).length}`);
}
// (2)
console.log('\n(2) THE DIFFERENTIAL (own, Reveal off and on; server page + import, twin; the withheld powers and houses never there)');
for (const s of sets) {
  const t = s.births.reduce((a, b) => ({ hiding: a.hiding + b.diff.hiding, reads: a.reads + b.diff.reads, equal: a.equal + b.diff.equal, faults: a.faults + b.diff.faults.length, places: a.places + (b.diff.hiding ? 1 : 0) }), { hiding: 0, reads: 0, equal: 0, faults: 0, places: 0 });
  console.log(`  ${s.name}: hiding places ${t.places} | hiding reads ${t.hiding} | engine-door reads ${t.reads} (want ${4 * t.hiding}) | equal ${pct(t.equal, t.reads)} | faults ${t.faults}`);
  const kinds = {}; for (const b of s.births) for (const f of b.diff.faults) { const k = f.replace(/^\S+ \S+ dm=\w+: |^\w+ dm=\w+: /, '').replace(/[:"(].*$/, '').trim(); (kinds[k] ||= []).push(`${b.seed} ${f}`); }
  for (const [k, v] of Object.entries(kinds).sort((x, y) => y[1].length - x[1].length)) console.log(`    ${v.length} x ${k}  e.g. ${v[0].slice(0, 260)}`);
}
// (3)
const tellTable = (s) => { const T = {}; for (const b of s.births) for (const [row, o] of Object.entries(b.tells)) for (const k of ['name', 'kind', 'key']) if (o[k]) { const e = ((T[row] ||= {})[k] ||= { docs: 0, ex: `${b.seed} ${o.ex[k]}` }); e.docs += 1; } return T; };
const TL = tellTable(L); const TB = B ? tellTable(B) : null;
console.log(`\n(3) THE TELLS per registry row: documents telling (name / kind / key)${B ? ' | baseline\'s; LEGACY-ONLY where this tells a kind and the baseline does not' : ''}`);
const rows = [...new Set([...Object.keys(TL), ...(TB ? Object.keys(TB) : [])])].sort();
const fmt = (o) => (o ? ['name', 'kind', 'key'].map((k) => o[k]?.docs || 0).join('/') : '0/0/0');
let legacyOnly = 0; const legacyRows = [];
for (const r of rows) {
  const only = TB ? ['name', 'kind', 'key'].filter((k) => TL[r]?.[k] && !TB[r]?.[k]) : [];
  if (only.length) { legacyOnly += 1; legacyRows.push(r); }
  console.log(`  ${only.length ? 'LEGACY-ONLY ' : ''}${r}: ${fmt(TL[r])}${TB ? ` | ${fmt(TB[r])}` : ''}${only.length ? ` [${only.join(',')}] e.g. ${TL[r][only[0]].ex.slice(0, 300)}` : ''}`);
}
console.log(`LEGACY-ONLY ROWS: ${legacyOnly}${legacyOnly ? ` (${legacyRows.join(', ')})` : ''}`);
// (4)
console.log('\n(4) THE READERS (pageRederive.js) fed a nothing-hidden read (twin, Reveal off), the value against the record: equal / differ / notDrawn / recordLacks / served / none');
for (const s of sets) {
  const ok = s.births.filter((b) => b.readers.hidesNothing); const F = {};
  for (const b of ok) for (const [f, o] of Object.entries(b.readers.f)) { const e = (F[f] ||= { equal: 0, differ: 0, notDrawn: 0, recordLacks: 0, served: 0, none: 0, n: 0, eq: 0, ex: null });
    if (o.s) { e[o.s] += 1; if (o.s === 'differ' && !e.ex) e.ex = `${b.seed}: record ${o.rec} | re-derived ${o.re}`; } else { e.n += o.n; e.eq += o.eq; if (o.ex && !e.ex) e.ex = `${b.seed} ${o.ex}`; } }
  console.log(`  ${s.name}: ${ok.length} documents read with nothing hidden`);
  for (const [f, e] of Object.entries(F)) console.log(`    ${f}: ${'n' in e && e.n ? `equal ${e.eq}/${e.n}` : `equal ${e.equal}/${e.equal + e.differ + e.notDrawn + e.recordLacks} (differ ${e.differ}, notDrawn ${e.notDrawn}, recordLacks ${e.recordLacks}; served ${e.served}, none ${e.none})`}${e.ex ? `  e.g. ${e.ex.slice(0, 240)}` : ''}`);
}
// (5) THE WORD RULES: the rows whose rule (not their key) reads words, by the registry's own scope text (grep: fold, a desc
// naming a hidden house, by name, criminal-worded, names the withheld power, holds its words); the always-withheld rows
// (their words never read: economy.situationDesc, history.siegeNarrative, power.recentConflict) and cast.stakes (it names
// its power by factionId: a key) are not word rules. Per row: the path present, the stored words naming a house or power
// the read could withhold (the lane's buildNameSearch fold over the stored hideable houses and criminal powers), the tells.
const WORD = {
  'compound.inst.flags': 'getInstFlags\'s keyword table over house NAMES (one fold)',
  'income.desc': 'a desc NAMING a hidden house leaves its row',
  'safety.criminalInstitutions': 'built by name (212 (16)/(19))',
  'power.entry': 'a criminal-WORDED governing body kept; a thieves\' NAME withheld',
  'power.relation.dmNote': 'the note NAMES the withheld criminal power',
  'power.conflicts': 'a conflict NAMING a withheld power follows recentConflict',
  'people.pressureSentence': 'it NAMES a withheld tie\'s two ends or holds its WORDS',
};
const { buildNameSearch } = await import('/home/user/wt/lp/src/domain/display/gallerySecondHomes.js');
const { isHideableHouse } = await import('/home/user/wt/lp/src/domain/people/cardVeil.js');
const { getInstFlags } = await import('/home/user/wt/lp/src/generators/priorityHelpers.js');
const RX = Object.fromEntries(REG.REGISTRY_ROWS.filter((r) => WORD[r.id]).map((r) => [r.id, new RegExp(r.path.replace(' \\(only in A\\)', ''))]));
const pathVals = (v, p = '', out = []) => { if (Array.isArray(v)) { out.push([p, v]); v.forEach((x) => pathVals(x, `${p}[]`, out)); } else if (isRec(v)) { if (p) out.push([p, v]); for (const k of Object.keys(v)) pathVals(v[k], p ? `${p}.${k}` : k, out); } else out.push([p, v]); return out; };
const strsOf = (v, o = []) => { if (typeof v === 'string') o.push(v); else if (Array.isArray(v)) v.forEach((x) => strsOf(x, o)); else if (isRec(v)) Object.values(v).forEach((x) => strsOf(x, o)); return o; };
const wordCensus = (s) => {
  const C = Object.fromEntries(Object.keys(WORD).map((k) => [k, { present: 0, naming: 0, ex: null }])); const flags = { docs: 0, differ: 0, ex: null };
  if (!s?.dir) return { C, flags };
  for (const b of s.births) {
    let d; try { d = JSON.parse(readFileSync(`${s.dir}/${b.seed}.json`, 'utf8')); } catch { continue; }
    const houses = (Array.isArray(d.institutions) ? d.institutions : []).filter((h) => isRec(h) && isHideableHouse(h)).map((h) => h.name);
    const powers = [...(Array.isArray(d.powerStructure?.factions) ? d.powerStructure.factions : []), ...(Array.isArray(d.factions) ? d.factions : [])].filter((f) => isRec(f) && (String(f.category || '').toLowerCase() === 'criminal' || f.hidden === true)).map((f) => f.faction || f.name).filter((x) => typeof x === 'string');
    const words = [...new Set([...houses, ...powers])]; const fold = words.length ? buildNameSearch(words, []) : null;
    const pv = pathVals(d);
    for (const id of Object.keys(WORD)) {
      const hits = pv.filter(([p]) => RX[id].test(p)); if (!hits.length) continue; C[id].present += 1;
      const named = fold && hits.flatMap(([, v]) => strsOf(v)).find((x) => fold.hit(x));
      if (named) { C[id].naming += 1; C[id].ex ||= `${b.seed}: ${named.slice(0, 140)}`; }
    }
    for (const where of ['economicState.compound.inst', 'economicState.safetyProfile.compound.inst']) {
      const inst = where.split('.').reduce((a, k) => (isRec(a) ? a[k] : undefined), d); if (!isRec(inst)) continue;
      let now; try { now = getInstFlags(d.config || {}, Array.isArray(d.institutions) ? d.institutions : []); } catch { continue; }
      flags.docs += 1; const diff = Object.keys(inst).filter((k) => /^has[A-Z]/.test(k) && k in now && now[k] !== inst[k]);
      if (diff.length) { flags.differ += 1; flags.ex ||= `${b.seed} ${where}: ${diff.map((k) => `${k} stored ${inst[k]} / today's fold ${now[k]}`).join(', ').slice(0, 200)}`; }
    }
  }
  return { C, flags };
};
const WL = wordCensus(L); const WB = B ? wordCensus(B) : null;
console.log(`\n(5) THE WORD RULES: ${Object.keys(WORD).length} rows. Per row: documents carrying the path / of them, stored words naming a hideable house or a criminal (or owner-hidden) power by the fold; tells name/kind/key (this${B ? ' | baseline' : ''})`);
for (const [id, how] of Object.entries(WORD)) {
  const a = WL.C[id]; const c = WB?.C[id];
  console.log(`  ${id} (${how}): present ${a.present}/${L.births.length}, naming ${a.naming}${c ? ` | present ${c.present}/${B.births.length}, naming ${c.naming}` : ''}; tells ${fmt(TL[id])}${TB ? ` | ${fmt(TB[id])}` : ''}${a.ex ? `  e.g. ${a.ex}` : ''}`);
}
console.log(`  compound.inst.has* against TODAY's getInstFlags over the stored houses: this ${WL.flags.differ}/${WL.flags.docs} compounds differ${WB ? ` | baseline ${WB.flags.differ}/${WB.flags.docs}` : ''}${WL.flags.ex ? `  e.g. ${WL.flags.ex}` : ''}`);
console.log(`WORD RULES: ${Object.keys(WORD).length}`);
