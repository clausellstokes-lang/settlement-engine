// R5-DESC-MEASURE: THE ARM'S TABLE (arm.probe.jsx's shards).   node arm-an.mjs <dir>   exit 0 (no parity STOP), 1 (a parity STOP)
// Pages are keyed '<off|dm>|<setting>|<tw|sv>'. A hit code is aW aH b bt c (see arm.probe.jsx's header).
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const shards = readdirSync(dir).filter((f) => /^arm-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const towns = shards.flatMap((s) => s.towns);
const P = []; const say = (s = '') => P.push(s);
const J = (x) => JSON.stringify(x);
const uniq = (xs) => [...new Set(xs)];
const all = towns.flatMap((t) => Object.entries(t.pages).map(([k, p]) => { const [dm, set, eng] = k.split('|'); return { t, k, dm, set, eng, p }; }));
const hid = towns.filter((t) => t.hidden.length);
const meta = shards[0]?.meta || {};
say(`R5-DESC-MEASURE THE ARM: ${towns.length} births (${hid.length} hidden-house, ${towns.length - hid.length} controls), ${all.length} pages; shards ${shards.map((s) => `${s.meta.shard.join('/')} ${s.meta.started}..${s.meta.ended}`).join('; ')}`);
say(`(c) word list: factionCategories.js FACTION_CATEGORY_KEYWORDS + MAGIC_CERTAIN_KEYWORDS (copied) by the withheld power's category, + its RULER_KINDS archetype word (${J(meta.rulerKinds)})`);
const errs = all.filter((x) => x.p.err || x.p.m5err || x.p.sErr);
say(`errors: ${errs.length}${errs.length ? `: ${errs.slice(0, 5).map((x) => `${x.t.seed} ${x.k} ${x.p.err || x.p.m5err || x.p.sErr}`).join('; ')}` : ''}`);

// ── PARITY (server against twin: W, H, the M1 table, the M5 table)
let par = 0; const parL = [];
for (const x of all.filter((y) => y.eng === 'tw')) {
  const s = x.t.pages[x.k.replace(/\|tw$/, '|sv')];
  for (const f of ['W', 'H', 'masked', 'm1', 'm5']) {
    const a = J(f === 'm1' || f === 'm5' ? Object.fromEntries(Object.entries(x.p[f] || {}).sort()) : x.p[f]);
    const b = J(f === 'm1' || f === 'm5' ? Object.fromEntries(Object.entries(s?.[f] || {}).sort()) : s?.[f]);
    if (a !== b) { par += 1; parL.push(`${x.t.seed} ${x.k} ${f}`); }
  }
}
say(`ENGINE PARITY (server against twin: W, H, masked rows, the M1 and M5 tables): ${par} differences${parL.length ? ` (STOP): ${parL.slice(0, 12).join('; ')}` : ''}`);

// ── M1
const wPages = all.filter((x) => x.p.W?.length); const hPages = all.filter((x) => x.p.H?.length);
say('');
say(`M1 THE CENSUS. pages with a withheld power (W, unstamped): ${wPages.length} of ${all.length} (towns ${uniq(wPages.map((x) => x.t.seed)).length}; names ${J(uniq(wPages.flatMap((x) => x.p.W)).slice(0, 12))}); pages whose record holds a stamped row (H): ${hPages.length} (towns ${uniq(hPages.map((x) => x.t.seed)).length}; the stamped row served on ${hPages.filter((x) => x.p.Hserved?.length).length}); pages serving a masked row: ${all.filter((x) => x.p.masked).length}`);
const NAMED = ['powerStructure.factions[].desc', 'factions[].desc', 'powerStructure.factionRelationships[].dmNote', 'powerStructure.factions[].powerLabel', 'powerStructure.recentConflict', 'pressureSentence', 'powerStructure.governingName', 'powerStructure.government', 'powerStructure.governmentType'];
const sum = (xs, f, path) => xs.reduce((a, x) => { const r = x.p[f]?.[path]; if (r) for (let i = 0; i < r.length; i += 1) a[i] += r[i]; return a; }, [0, 0, 0, 0, 0, 0]);
const cols = (r) => `${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} | ${r[4]} | ${r[5]}`;
const paths = uniq(all.flatMap((x) => Object.keys(x.p.m1 || {}))).sort();
say('path | side | n served | a(W) | a(H) | b mask | bt "the an unseen interest" | c kind');
for (const path of [...NAMED, ...paths.filter((p) => !NAMED.includes(p))]) {
  const tot = sum(all, 'm1', path); if (!tot[0] && !NAMED.includes(path)) continue;
  if (!tot[1] && !tot[2] && !tot[3] && !tot[5] && !NAMED.includes(path)) { say(`${path} | all | ${cols(tot)}`); continue; }
  for (const dm of ['off', 'dm']) for (const eng of ['sv', 'tw']) say(`${path} | ${dm}/${eng} | ${cols(sum(all.filter((x) => x.dm === dm && x.eng === eng), 'm1', path))}`);
}
say('M1 by setting (all paths summed; sv): setting | pages | n | aW | aH | b | bt | c');
for (const set of uniq(all.map((x) => x.set))) {
  const xs = all.filter((x) => x.set === set && x.eng === 'sv'); const r = [0, 0, 0, 0, 0, 0];
  for (const x of xs) for (const v of Object.values(x.p.m1 || {})) for (let i = 0; i < 6; i += 1) r[i] += v[i];
  say(`${set} | ${xs.length} | ${cols(r)}`);
}
const kwBy = {}; for (const x of all.filter((y) => y.eng === 'sv')) for (const [p, m] of Object.entries(x.p.kw || {})) for (const [w, n] of Object.entries(m)) { kwBy[p] = kwBy[p] || {}; kwBy[p][w] = (kwBy[p][w] || 0) + n; }
say(`(c) by path and word (sv, both reads): ${J(kwBy)}`);
const csBy = {}; for (const x of all) for (const [p, m] of Object.entries(x.p.cs || {})) { const k = `${p} ${x.dm}/${x.eng}`; csBy[k] = csBy[k] || { n: 0, ex: [] }; csBy[k].n += m.n; for (const e of m.ex) if (csBy[k].ex.length < 3 && !csBy[k].ex.includes(e)) csBy[k].ex.push(e); }
say('(c) STRICT (a kind word no served power\'s own name carries, the idiom "in the shadow of" / "\'s shadow" set aside), strings by path and side:');
for (const [k, v] of Object.entries(csBy).sort()) say(`  ${k}: ${v.n}  e.g. ${J(v.ex)}`);
const m5cs = {}; for (const x of all) for (const [p, m] of Object.entries(x.p.m5cs || {})) { const k = `${p} ${x.dm}/${x.eng}`; m5cs[k] = (m5cs[k] || 0) + m.n; }
const exs = all.filter((x) => x.eng === 'sv').flatMap((x) => (x.p.ex || []).map((e) => [x.t.seed, x.k, ...e]));
for (const cls of [[2, 'a(W)'], [3, 'a(H)'], [4, 'b'], [5, 'bt'], [6, 'c']]) {
  const hits = exs.filter((e) => e[4][cls[0] - 2] === '1');
  say(`  e.g. ${cls[1]} (${hits.length} kept examples):`); for (const e of hits.slice(0, 5)) say(`    ${e[0]} ${e[1]} ${e[3]} [${e[5]}] ${J(e[6])}`);
}

// ── M2
say('');
const m2 = {}; for (const x of all) for (const [p, r] of Object.entries(x.p.m1 || {})) if (!NAMED.includes(p) && (r[1] || r[2] || r[3])) { m2[p] = m2[p] || [0, 0, 0, 0]; m2[p][0] += r[1]; m2[p][1] += r[2]; m2[p][2] += r[3]; m2[p][3] += r[4]; }
say(`M2 (a) or (b) at a power-card path the M1 list does not name (both engines summed): ${J(m2)}`);
const wide = {}; for (const x of all) for (const [p, r] of Object.entries(x.p.wide || {})) { wide[p] = wide[p] || [0, 0, 0, 0]; for (let i = 0; i < 4; i += 1) wide[p][i] += r[i]; }
say(`M2 wider (every other served string, both engines summed, [aW, aH, b, bt]): ${J(wide)}`);
for (const x of all.filter((y) => y.eng === 'sv' && y.p.wex?.length).slice(0, 5)) say(`  e.g. ${x.t.seed} ${x.k}: ${J(x.p.wex[0])}`);

// ── M3
say('');
const nh = all.filter((x) => !x.p.hide && x.p.m3);
const tallyRows = (xs) => {
  const o = { pages: xs.length, strings: 0, B: 0, S: 0, Svac: 0, pagesB: 0, pagesS: 0, lbl: 0, lblN: 0, dm: 0, dmN: 0, codes: {} };
  for (const x of xs) {
    const rows = x.p.m3.rows.filter((r) => r[1]); o.strings += rows.length;
    const b = rows.filter((r) => r[2] === 1).length; const s = rows.filter((r) => r[3] === 1 || r[3] === 2).length;
    o.B += b; o.S += s; o.Svac += rows.filter((r) => r[3] === 2).length; if (b === rows.length) o.pagesB += 1; if (s === rows.length) o.pagesS += 1;
    for (const r of x.p.m3.rows) { if (r[4] !== -1) { o.lblN += 1; o.lbl += r[4] === 1 ? 1 : 0; } o.codes[`B${r[2]}`] = (o.codes[`B${r[2]}`] || 0) + 1; o.codes[`S${r[3]}`] = (o.codes[`S${r[3]}`] || 0) + 1; }
    for (const [, ok] of x.p.m3.relDm) { o.dmN += 1; o.dm += ok === 1 ? 1 : 0; }
  }
  return o;
};
say(`M3 THE OTHER WAY'S FIDELITY on the NOTHING-HIDDEN pages (no withheld power: no W, every stamped row served): ${J(tallyRows(nh))}`);
for (const dm of ['off', 'dm']) for (const eng of ['sv', 'tw']) say(`  ${dm}/${eng}: ${J(tallyRows(nh.filter((x) => x.dm === dm && x.eng === eng)))}`);
say(`  by setting (sv): ${J(Object.fromEntries(uniq(nh.map((x) => x.set)).map((s) => { const o = tallyRows(nh.filter((x) => x.set === s && x.eng === 'sv')); return [s, `${o.B}/${o.strings} B, ${o.S}/${o.strings} S, pages ${o.pagesB}/${o.pagesS} of ${o.pages}`]; })))}`);
const causeOf = (x, r) => {
  const c = x.t.causes[r[0]];
  if (r[2] === -2) return `B threw: ${x.p.m3.why}`;
  if (!c) return 'no record row (a power the record does not hold)';
  if (c.rrec === 0) return `a step after the power step rewrote it: ${c.steps.join(' > ') || '(none seen)'}`;
  if (c.rrec === -1) return `not in the power step's roster (born ${c.born ? 'at' : 'after'} the power step; steps ${c.steps.join(' > ')})`;
  if (typeof c.rrec === 'string') return `the replay threw: ${c.rrec}`;
  if (c.ba !== 1) {
    if (c.bao === 1) return "the late replay's options not handed (defenseLabel / militaryGate / forces)";
    if (c.bas === 1) return 'a seed draw (B with the record seed and options reproduces)';
    if (c.bi === 1) return `the power step's own inputs (intent config/institutions ${J(c.instN)}) differ from the final record's`;
    if (typeof c.ba === 'string') return `B over the record threw: ${c.ba}`;
    return 'other (B over the record misses; the intent replay reproduces)';
  }
  return r[2] === -1 ? 'B over the page lacks the power (the page differs from the record)' : 'the served page differs from the record (an input the share changes)';
};
const miss = nh.flatMap((x) => x.p.m3.rows.filter((r) => r[1] && r[2] !== 1).map((r) => ({ x, r, cause: causeOf(x, r) })));
const byCause = {}; for (const m of miss) byCause[m.cause] = (byCause[m.cause] || 0) + 1;
say(`  B MISSES by cause (${miss.length}): ${J(Object.entries(byCause).sort((a, b) => b[1] - a[1]))}`);
const bySplit = {}; for (const m of miss.filter((y) => y.r[2] === 0)) { const k = `${m.cause.slice(0, 70)} | base ${m.r[7]?.[0] ?? '?'} standing ${m.r[7]?.[1] ?? '?'}`; bySplit[k] = (bySplit[k] || 0) + 1; }
say(`  B MISSES (B holds the power, the desc differs) by cause and split (base equal 1/0, standing equal 1/0): ${J(Object.entries(bySplit).sort((a, b) => b[1] - a[1]))}`);
say(`  B misses by power (top): ${J(Object.entries(miss.reduce((a, m) => { a[m.r[0]] = (a[m.r[0]] || 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 14))}`);
for (const [cause] of Object.entries(byCause).sort((a, b) => b[1] - a[1]).slice(0, 8)) { const m = miss.find((y) => y.cause === cause); say(`    e.g. [${cause.slice(0, 60)}] ${m.x.t.seed} ${m.x.k} ${m.r[0]}: served ${J(m.r[6]?.[0] ?? '')} | B ${J(m.r[6]?.[1] ?? '')}`); }
const smiss = nh.flatMap((x) => x.p.m3.rows.filter((r) => r[1] && r[3] === 0).map((r) => ({ x, r })));
say(`  S' (the served rows whole, not name-only copies): reproduced ${nh.reduce((a, x) => a + x.p.m3.rows.filter((r) => r[1] && (r[9] === 1 || r[9] === 2)).length, 0)} of ${nh.reduce((a, x) => a + x.p.m3.rows.filter((r) => r[1]).length, 0)}; misses ${nh.reduce((a, x) => a + x.p.m3.rows.filter((r) => r[1] && r[9] === 0).length, 0)}; S misses S' reproduces ${nh.reduce((a, x) => a + x.p.m3.rows.filter((r) => r[1] && r[3] === 0 && (r[9] === 1 || r[9] === 2)).length, 0)}`);
say(`  S MISSES (the served desc does not end in the standing the served roster gives): ${smiss.length}; by power ${J(Object.entries(smiss.reduce((a, m) => { a[m.r[0]] = (a[m.r[0]] || 0) + 1; return a; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 12))}`);
const sd = new Map(); for (const m of smiss) { const k = `${m.r[0]} :: ${m.r[8]?.[1] ?? ''}`; if (!sd.has(k)) sd.set(k, [m, 0]); sd.get(k)[1] += 1; }
for (const [, [m, n]] of [...sd].sort((a, b) => b[1][1] - a[1][1]).slice(0, 8)) say(`    e.g. (${n}) ${m.x.t.seed} ${m.x.k} ${m.r[0]}: served tail ${J(m.r[8]?.[0])} | the served roster's standing ${J(m.r[8]?.[1])}`);
say(`  B over the record (once a birth, per stored power): ${J(towns.flatMap((t) => Object.values(t.causes)).reduce((a, c) => { const k = `rrec${typeof c.rrec === 'string' ? 'T' : c.rrec}/ba${typeof c.ba === 'string' ? 'T' : c.ba}/bao${typeof c.bao === 'string' ? 'T' : c.bao}/bas${typeof c.bas === 'string' ? 'T' : c.bas}`; a[k] = (a[k] || 0) + 1; return a; }, {}))}`);
// THE HIDING PAGES
const hp = all.filter((x) => x.p.hide && x.p.m3);
say(`M3 THE HIDING PAGES (a W power, or a stamped row not served): ${hp.length} pages, towns ${uniq(hp.map((x) => x.t.seed)).length}`);
say(`  B re-creates a withheld power in its roster: ${hp.filter((x) => x.p.m3.Brecreates?.length).length} pages (${J(uniq(hp.flatMap((x) => x.p.m3.Brecreates || [])))}); B threw on ${hp.filter((x) => x.p.m3.why).length}`);
const flagCount = (xs, pick) => { const o = { aW: 0, aH: 0, b: 0, bt: 0, c: 0, cStrict: 0, n: 0, strictWords: {} }; for (const s of xs.map(pick).filter((v) => typeof v === 'string' && /^[01]{6}:/.test(v))) { o.n += 1; ['aW', 'aH', 'b', 'bt', 'c', 'cStrict'].forEach((k, i) => { o[k] += s[i] === '1' ? 1 : 0; }); for (const w of s.slice(7).split(',').filter(Boolean)) o.strictWords[w] = (o.strictWords[w] || 0) + 1; } return o; };
say(`  B's descs of the SERVED powers (withheld absent): ${J(flagCount(hp.flatMap((x) => x.p.m3.Bhits || []), (r) => r[1]))}`);
say(`  S, withheld ABSENT (base kept + the served roster's standing): ${J(flagCount(hp.flatMap((x) => x.p.m3.S || []), (r) => r[1]))}; equal to the record's desc ${hp.flatMap((x) => x.p.m3.S || []).filter((r) => r[3] === 1).length}; no base ${hp.flatMap((x) => x.p.m3.S || []).filter((r) => r[1] === 'nobase').length}`);
const sx = hp.flatMap((x) => (x.p.m3.S || []).filter((r) => r[5]).map((r) => [x, r]));
say(`  S ABSENT's strict kind hits by where they sit (the base sentence kept, or the re-derived standing): ${JSON.stringify(sx.reduce((a, [, r]) => { a[r[6]] = (a[r[6]] || 0) + 1; return a; }, {}))}; distinct: ${JSON.stringify([...new Set(sx.map(([, r]) => `${r[0]} [${r[6]}]: ${r[5].slice(0, 200)}`))].slice(0, 8))}`);
say(`  S, a masked row KEPT (the withheld rows named '${meta.mask}'): ${J(flagCount(hp.flatMap((x) => x.p.m3.S || []), (r) => r[2]))}`);
for (const s of hp.flatMap((x) => (x.p.m3.S || []).filter((r) => r[4]).map((r) => [x.t.seed, x.k, r[0], r[4]])).slice(0, 5)) say(`    e.g. kept: ${s[0]} ${s[1]} ${s[2]}: ${J(s[3])}`);

// ── M5
say('');
const m5p = uniq(all.flatMap((x) => Object.keys(x.p.m5 || {}))).sort();
say('M5 THE STRATA AND CONTENDERS (derivePowerStrata, coupContenders over the page): path | side | n | aW | aH | b | bt | c (paths with a hit)');
for (const path of m5p) { const tot = sum(all, 'm5', path); if (!tot[1] && !tot[2] && !tot[3] && !tot[5]) continue; for (const dm of ['off', 'dm']) for (const eng of ['sv', 'tw']) say(`${path} | ${dm}/${eng} | ${cols(sum(all.filter((x) => x.dm === dm && x.eng === eng), 'm5', path))}`); }
const m5all = all.reduce((a, x) => { for (const v of Object.values(x.p.m5 || {})) for (let i = 0; i < 6; i += 1) a[i] += v[i]; return a; }, [0, 0, 0, 0, 0, 0]);
say(`M5 total over every path (both engines): ${cols(m5all)}`);
say(`M5 (c) STRICT by path and side: ${J(m5cs)}`);
const m5off = all.filter((x) => x.dm === 'off').reduce((a, x) => { for (const v of Object.values(x.p.m5 || {})) for (let i = 0; i < 6; i += 1) a[i] += v[i]; return a; }, [0, 0, 0, 0, 0, 0]);
say(`M5 Reveal off only (both engines): ${cols(m5off)}`);
for (const e of all.filter((x) => x.eng === 'sv').flatMap((x) => (x.p.m5ex || []).map((y) => [x.t.seed, x.k, ...y])).slice(0, 5)) say(`  e.g. ${e[0]} ${e[1]} ${e[3]} ${e[4]} [${e[5]}] ${J(e[6])}`);

// ── M4 (executed part)
say('');
const govs = uniq(towns.map((t) => t.gov[0])); const govHit = towns.filter((t) => t.govHouse.some(Boolean));
say(`M4 the governing names born (${govs.length}): ${J(govs)}`);
say(`M4 governingName/government spelling a house of its own record (the lane's fold): ${govHit.length} of ${towns.length} births: ${J(govHit.map((t) => [t.seed, t.gov[0]]).slice(0, 12))}; governingName != government on ${towns.filter((t) => t.gov[0] !== t.gov[1]).length}; governmentType written on ${towns.filter((t) => t.gov[2] != null).length}`);
say(`M4 a served governingName that is a withheld power: ${all.filter((x) => x.p.W?.includes(x.p.gov?.[0])).length} pages`);
console.log(P.join('\n'));
process.exit(par ? 1 : 0);
