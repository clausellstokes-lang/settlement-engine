// tell2-an.mjs <pooldir> <townsdir>: THE TELL'S TWO GATES as ruling 58 restates them (the chair, 18:21), and what it reports.
// (Ruling 54's single-membership analyzer that wrote run1/ is at 580a5c9dd.)
//
// THE UNIVERSE U(size, Reveal): every page read(T', s') of the pool such that s' hides NOTHING T' holds: part A (T' holds no
// hideable house: every setting) and part B (T' holds some: the settings that show all it holds). Pages are counted by
// DISTINCT BIRTH (a birth counts once however many of its settings show a value), with the same Reveal setting.
// GATED READS (ruling 62 (3), R3-TELL-3 (a)): read(T, s) of a town holding a hideable house where s hides at least one of
// them, BY THE TEST, not by a setting's name: own, the seven mixed g:<bits>, allOpen (it re-hides every house's card: the
// switch's "Show everything criminal", then each card back to hidden whole), off.
// THE CONTROLS (the gate's 48 nothing-hidden births, outside the pool) are read under the same settings: the calibration.
// R4'S PARTS (ruling 58 3 (b)): the criminal-worded role, trace, ties, goals, memberships, cast families: DROPPED from both
// gates and LISTED RED as R4's.
// GATE-1 (full fineness): every single part of the page (each of the 87 fields, each family's count, each row-key state,
//   each of the FIVE cross bits; a part a page lacks reads '-') holds a value seen in at least two births of U. Controls must
//   be 0 of 48; a part where one is not is NAMED.
//   LOWER BY RULE (ruling 62 (5)): where a gated read serves a GOVERNING criminal power's row (VR42 keeps it while the
//   government's name stays) and no other criminal power's row (the read's own count: rows = governing), the row's own parts
//   GATE-1 does not find at that size (r.powers.criminal, k.powers.*, x.powerNoHouse) are NOT gate failures: the town is
//   LOWER BY RULE, listed by name with those parts. Every other part of that read is gated as usual. (U's part B serves
//   criminal powers BESIDE their houses at every size, so the row itself is found; a governing row with no house served,
//   and the keys a governing row carries, are what is not.)
// GATE-2 (ruling 62 (4), R3-TELL-3 (b)): the joint signature at its COARSEST level L3 (the families none/some, R4's dropped)
//   is a COMPARISON, not a zero: at every gated setting, Reveal off and DM, twin and server, the hidden-house pages fail it
//   NO MORE OFTEN than the controls beyond sampling (one-sided Fisher p >= 0.05; the controls are read by the twin, nothing-
//   hidden pages' twin and server signatures measured equal), and EVERY failing hidden-house page is LISTED with its
//   separating parts (the families its L3 key differs in from the nearest member key). L1 and L2 are reported.
// REPORTED, NEVER GATED: the full fine signature (every part, R4's included) jointly, hidden against controls, with Fisher's
//   exact p (one-sided); ruling 62 (1): no separate stop, re-read after the cure.
// RULING 62 (5)'s COUNT (R3-TELL-3 (c)): on GATED READS ONLY, the criminal powers' rows served, GOVERNING ones apart (VR42);
//   a non-governing row served where the read serves no criminal house is AGAINST THE RULE (listed); the towns LOWER BY RULE
//   by name with the part GATE-1 does not find.
// EXIT (R3-TELL-3 (d)): 1 on any GATE-1 failure of a gated read of a hidden-house town (twin or server) or a GATE-2 Fisher p
// below 0.05 (twin or server); 2 on a missing input; else 0.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
const [poolDir, townsDir] = process.argv.slice(2);
const load = (dir, re) => (existsSync(dir) ? readdirSync(dir).filter((f) => re.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'))) : []);
const A = load(poolDir, /^pool-shard\d+\.json$/); const B = load(poolDir, /^poolb-shard\d+\.json$/); const TW = load(townsDir, /^towns-shard\d+\.json$/);
if (A.length !== 4 || B.length !== 4 || TW.length !== 4) { console.log(`MISSING SHARDS: part A ${A.length}/4, part B ${B.length}/4, towns ${TW.length}/4`); process.exit(2); }
const R4 = new Set(['r.people.roles', 'r.trace.criminal', 'r.ties.criminal', 'r.people.goals', 'r.people.memberships', 'r.cast.criminal']);
const GATED = ['own', 'g:110', 'g:101', 'g:011', 'g:100', 'g:010', 'g:001', 'g:000', 'allOpen', 'off'];
const MIXED = GATED.filter((s) => s.startsWith('g:'));
const READS = ['off', 'dm'];
const flat = (shs, part) => shs.flatMap((sh) => sh.births.map((b) => ({ ...b, part, sigs: Object.fromEntries(Object.entries(b.sigs).map(([k, i]) => [k, sh.sigs[i]])),
  srv: b.srv && Object.fromEntries(Object.entries(b.srv).map(([k, i]) => [k, sh.sigs[i]])) })));
const pa = flat(A, 'A'); const pb = flat(B, 'B'); const towns = flat(TW, 'T');
const hid = towns.filter((t) => t.hidden.length); const ctl = towns.filter((t) => !t.hidden.length);
const parsedC = new Map();
/** A signature as { part: value }: f.<path>, r.<family>, k.<family>.<key>, x.<bit>. */
const partsOf = (s) => { if (parsedC.has(s)) return parsedC.get(s); const o = JSON.parse(s); const m = {};
  for (const [k, v] of Object.entries(o.f || {})) m[`f.${k}`] = v; for (const [k, v] of Object.entries(o.r || {})) m[`r.${k}`] = v;
  for (const [fam, ks] of Object.entries(o.k || {})) for (const [k, v] of Object.entries(ks)) m[`k.${fam}.${k}`] = v;
  for (const [k, v] of Object.entries(o.x || {})) m[`x.${k}`] = v; parsedC.set(s, m); return m; };
const universe = [...pa, ...pb];
const SIZES = [...new Set(universe.map((b) => b.size))];
// every part name, per size|read: the pool's and the towns'
const PARTS = {};
const addParts = (size, k, s) => { const set = (PARTS[`${size}|${k.split('|')[0]}`] ||= new Set()); for (const p of Object.keys(partsOf(s))) set.add(p); };
for (const b of [...universe, ...towns]) for (const [k, s] of Object.entries(b.sigs)) addParts(b.size, k, s);
for (const t of towns) for (const [k, s] of Object.entries(t.srv || {})) addParts(t.size, k, s);
const valOf = (s, p) => partsOf(s)[p] ?? '-';
// U's value counts (distinct births) per size|read: part -> value -> Set(seed)
const VAL = {};
for (const b of universe) for (const [k, s] of Object.entries(b.sigs)) { const key = `${b.size}|${k.split('|')[0]}`; const V = (VAL[key] ||= new Map());
  for (const p of PARTS[key]) { const v = valOf(s, p); const m = V.get(p) || V.set(p, new Map()).get(p); (m.get(v) || m.set(v, new Set()).get(v)).add(b.seed); } }
const seen = (size, rd, p, v) => VAL[`${size}|${rd}`]?.get(p)?.get(v)?.size || 0;
/** GATE-1: the parts of a page (R4's alone when r4) whose value fewer than two births of U show. */
const g1Raw = (size, rd, s, r4 = false) => [...PARTS[`${size}|${rd}`]].filter((p) => R4.has(p) === r4 && seen(size, rd, p, valOf(s, p)) < 2).map((p) => `${p}=${JSON.stringify(valOf(s, p))}`);
// ruling 62 (5): the governing row's own parts, and whether U shows a criminal power's row at a size (two births or more)
const isPowerRowPart = (l) => /^(r\.powers\.criminal|k\.powers\.[^=]*|x\.powerNoHouse)=/.test(l);
const govServed = (s) => { const m = partsOf(s); return m['r.powers.criminal'] !== undefined && m['r.powers.criminal'] !== '0'; };
/** The by-rule parts of a gated read (its governing row's parts GATE-1 does not find at the size), given the read's pc. */
const byRule = (t, rd, s, pc) => (pc && Number(pc.split('/')[1]) > 0 && pc.split('/')[0] === pc.split('/')[1] && govServed(s) ? g1Raw(t.size, rd, s).filter(isPowerRowPart) : []);
const pcAtKey = (t, eng, key) => (eng === 'twin' ? t.pc : t.srvPc)?.[key];
/** GATE-1's failing parts of a read: the raw list less the by-rule parts (ruling 62 (5)). */
const g1FailT = (t, eng, rd, set) => { const s = sigAt(t, eng, rd, set); if (s === undefined) return ['<no page>']; const br = new Set(byRule(t, rd, s, pcAtKey(t, eng, `${rd}|${set}`))); return g1Raw(t.size, rd, s).filter((l) => !br.has(l)); };
const g1Fail = (size, rd, s, r4 = false) => g1Raw(size, rd, s, r4);
// joint keys
const famKey = (s, level) => { const m = partsOf(s); const r = Object.keys(m).filter((p) => p.startsWith('r.') && !R4.has(p)).sort().map((p) => `${p}=${level === 1 ? m[p] : m[p] === '0' ? '0' : '+'}`);
  const x = level === 3 ? [] : Object.keys(m).filter((p) => p.startsWith('x.')).sort().map((p) => `${p}=${m[p]}`); return [...r, ...x].join(';'); };
const JOINT = {}; // level|size|read -> key -> Set(seed)
const addJ = (lvl, size, rd, key, seed) => { const J = (JOINT[`${lvl}|${size}|${rd}`] ||= new Map()); (J.get(key) || J.set(key, new Set()).get(key)).add(seed); };
for (const b of universe) for (const [k, s] of Object.entries(b.sigs)) { const rd = k.split('|')[0]; for (const L of [1, 2, 3]) addJ(L, b.size, rd, famKey(s, L), b.seed); addJ('F', b.size, rd, s, b.seed); }
const jMember = (L, size, rd, s) => (JOINT[`${L}|${size}|${rd}`]?.get(L === 'F' ? s : famKey(s, L))?.size || 0) >= 2;
const sigAt = (t, eng, rd, set) => (eng === 'twin' ? t.sigs : t.srv)?.[`${rd}|${set}`];

console.log(`R3-TELL-2: THE TELL'S TWO GATES (ruling 58). Pool ${poolDir}; towns ${townsDir}`);
// ── the pool
console.log('\nTHE POOL: part A (nothing hidden, every setting) and part B (houses held, the settings that hide none)');
console.log('size | A births | B births (tried) | U distinct full signatures off / dm | B CPU min | A re-read CPU min');
for (const size of SIZES) { const bc = B.map((sh) => sh.cost?.[size]).filter(Boolean); const ac = A.map((sh) => sh.cost?.[size]).filter(Boolean);
  console.log(`${size} | ${pa.filter((b) => b.size === size).length} | ${pb.filter((b) => b.size === size).length} (${bc.reduce((a, x) => a + x.tried, 0)}) | ${JOINT[`F|${size}|off`]?.size} / ${JOINT[`F|${size}|dm`]?.size} | ${(bc.reduce((a, x) => a + x.ms, 0) / 60000).toFixed(1)} | ${(ac.reduce((a, x) => a + x.ms, 0) / 60000).toFixed(1)}`); }
const srvS = pa.filter((b) => b.srv); console.log(`part A server sample (own, off; both reads): ${srvS.length} births, signature differs from the twin's in ${srvS.filter((b) => Object.keys(b.srv).some((k) => b.srv[k] !== b.sigs[k])).length}`);
const meta = existsSync(`${poolDir}/meta.txt`) ? readFileSync(`${poolDir}/meta.txt`, 'utf8') : '';
for (const part of ['A', 'B']) { const st = new RegExp(`${part} start (\\S+)`).exec(meta)?.[1]; const en = new RegExp(`${part} end (\\S+)`).exec(meta)?.[1]; if (st && en) console.log(`part ${part} wall clock: ${((Date.parse(en) - Date.parse(st)) / 60000).toFixed(1)} minutes (${st} to ${en}, four shards)`); }

// ── GATE-1
const g1 = (ts, eng, rd, set, r4 = false) => ts.filter((t) => { const s = sigAt(t, eng, rd, set); return s === undefined || (r4 ? g1Fail(t.size, rd, s, true).length : g1FailT(t, eng, rd, set).length); });
const g1raw = (ts, eng, rd, set) => ts.filter((t) => { const s = sigAt(t, eng, rd, set); return s === undefined || g1Raw(t.size, rd, s).length; });
console.log(`\nGATE-1 (full fineness, R4's parts dropped; LOWER BY RULE parts apart): gated reads failing, hidden-house towns (of ${hid.length}) twin / server [raw, the by-rule parts counted: twin / server]; controls (of ${ctl.length}) twin`);
console.log('setting | hidden, Reveal off | hidden, Reveal DM | controls off | controls DM');
for (const set of GATED) console.log(`${set} | ${g1(hid, 'twin', 'off', set).length} / ${g1(hid, 'server', 'off', set).length} [${g1raw(hid, 'twin', 'off', set).length} / ${g1raw(hid, 'server', 'off', set).length}] | ${g1(hid, 'twin', 'dm', set).length} / ${g1(hid, 'server', 'dm', set).length} [${g1raw(hid, 'twin', 'dm', set).length} / ${g1raw(hid, 'server', 'dm', set).length}] | ${g1(ctl, 'twin', 'off', set).length} | ${g1(ctl, 'twin', 'dm', set).length}`);
const tallyFail = (ts, eng, sets, r4 = false) => { const out = {}; for (const rd of READS) for (const set of sets) for (const t of ts) { const s = sigAt(t, eng, rd, set); if (!s) continue; for (const l of (r4 ? g1Fail(t.size, rd, s, true) : g1FailT(t, eng, rd, set))) (out[`${rd}|${l}`] ||= new Set()).add(t.seed); } return out; };
const show = (o, n = 40) => Object.entries(o).sort((a, b) => b[1].size - a[1].size).slice(0, n).map(([k, s]) => `  ${s.size} | ${k.slice(0, 200)} (e.g. ${[...s].slice(0, 2).join(', ')})`).join('\n');
console.log('\nGATE-1, THE CONTROLS\' FAILING PARTS (NAMED, never dropped; every gated setting): controls | read|part=value');
console.log(show(tallyFail(ctl, 'twin', GATED)) || '  none');
console.log('\nGATE-1, THE HIDDEN-HOUSE TOWNS\' FAILING PARTS (every gated setting, twin): towns | read|part=value');
console.log(show(tallyFail(hid, 'twin', GATED)) || '  none');
console.log('GATE-1, THE SAME, SERVER: towns | read|part=value');
console.log(show(tallyFail(hid, 'server', GATED)) || '  none');
console.log('GATE-1, PER FAILING TOWN (twin or server, any gated read): town (size) | engine:read:setting count | its failing parts');
for (const t of [...hid].sort((x, y) => x.seed.localeCompare(y.seed))) { const hits = []; const ps = new Set();
  for (const eng of ['twin', 'server']) for (const rd of READS) for (const set of GATED) { const f = g1FailT(t, eng, rd, set); if (f.length) { hits.push(`${eng}:${rd}:${set}`); for (const l of f) ps.add(l); } }
  if (hits.length) console.log(`  ${t.seed} (${t.size}) | ${hits.length} reads | ${[...ps].join(' ').slice(0, 400)}`); }
console.log('\nR4\'S PARTS, LISTED RED AS R4\'S (dropped from both gates; ruling 58 3 (b)): hidden-house towns whose gated reads hold an R4 part value fewer than two births of U show (twin / server), by setting');
for (const set of ['own', 'off']) console.log(`  ${set}: Reveal off ${g1(hid, 'twin', 'off', set, true).length} / ${g1(hid, 'server', 'off', set, true).length}, Reveal DM ${g1(hid, 'twin', 'dm', set, true).length} / ${g1(hid, 'server', 'dm', set, true).length}`);
console.log(`  mixed (any g:<bits>): Reveal off ${hid.filter((t) => MIXED.some((s) => g1([t], 'twin', 'off', s, true).length)).length}, Reveal DM ${hid.filter((t) => MIXED.some((s) => g1([t], 'twin', 'dm', s, true).length)).length} (twin)`);
console.log(show(tallyFail(hid, 'twin', GATED, true), 12));

// ── GATE-2 (ruling 62 (4)): L3, a one-sided Fisher comparison with the controls, every failing hidden-house page listed
const g2 = (L, ts, eng, rd, set) => ts.filter((t) => { const s = sigAt(t, eng, rd, set); return s === undefined || !jMember(L, t.size, rd, s); });
const lnF = (n) => { let s = 0; for (let i = 2; i <= n; i += 1) s += Math.log(i); return s; };
const hyper = (k, K, n, N) => Math.exp(lnF(K) - lnF(k) - lnF(K - k) + lnF(N - K) - lnF(n - k) - lnF(N - K - n + k) - lnF(N) + lnF(n) + lnF(N - n));
/** One-sided Fisher: P(hidden failures >= a) given the margins. */
const fisher = (a, n1, c, n2) => { const K = a + c; const N = n1 + n2; let p = 0; for (let k = a; k <= Math.min(K, n1); k += 1) p += hyper(k, K, n1, N); return Math.min(1, p); };
console.log('\nGATE-2 (ruling 62 (4)): THE JOINT SIGNATURE AT L3 (families none/some, R4\'s dropped), A COMPARISON: hidden-house pages failing (twin / server) against the controls failing (twin), one-sided Fisher p (twin / server); a cell below 0.05 is RED');
console.log('setting | Reveal off: hidden twin / server, controls, p twin / server | Reveal DM: the same');
let g2Red = 0;
for (const set of GATED) { const cell = (rd) => { const c = g2(3, ctl, 'twin', rd, set).length; const at = g2(3, hid, 'twin', rd, set).length; const as = g2(3, hid, 'server', rd, set).length;
    const pt = fisher(at, hid.length, c, ctl.length); const ps = fisher(as, hid.length, c, ctl.length); if (pt < 0.05) g2Red += 1; if (ps < 0.05) g2Red += 1;
    return `${at} / ${as}, ${c}, ${pt.toExponential(2)} / ${ps.toExponential(2)}${pt < 0.05 || ps < 0.05 ? ' RED' : ''}`; };
  console.log(`${set} | ${cell('off')} | ${cell('dm')}`); }
console.log(`GATE-2: ${g2Red ? `${g2Red} cell(s) with p below 0.05: RED` : 'every gated setting at or above 0.05, both reads, both engines'}`);
/** The nearest member L3 key of U (two births or more) at size|read, and the families the page's key differs in. */
const NEAR = new Map();
const sepOf = (size, rd, s) => { const key = famKey(s, 3); const id = `${size}|${rd}|${key}`; if (NEAR.has(id)) return NEAR.get(id);
  const mine = Object.fromEntries(key.split(';').filter(Boolean).map((x) => x.split('='))); let best = null;
  for (const [k, st] of JOINT[`3|${size}|${rd}`] || new Map()) { if (st.size < 2) continue; const o = Object.fromEntries(k.split(';').filter(Boolean).map((x) => x.split('=')));
    const d = [...new Set([...Object.keys(mine), ...Object.keys(o)])].filter((f) => (mine[f] ?? '-') !== (o[f] ?? '-')).map((f) => `${f}:${mine[f] ?? '-'}->${o[f] ?? '-'}`); if (!best || d.length < best.length) best = d; }
  NEAR.set(id, best || ['<no member key>']); return NEAR.get(id); };
console.log('GATE-2, EVERY FAILING HIDDEN-HOUSE PAGE (for the security reader): town (size) | engine:read:settings | the families separating it from the nearest member key');
for (const t of [...hid].sort((x, y) => x.seed.localeCompare(y.seed))) { const by = new Map();
  for (const eng of ['twin', 'server']) for (const rd of READS) for (const set of GATED) { const s = sigAt(t, eng, rd, set); if (s !== undefined && jMember(3, t.size, rd, s)) continue;
    const sep = s === undefined ? '<no page>' : sepOf(t.size, rd, s).join(' '); (by.get(sep) || by.set(sep, []).get(sep)).push(`${eng}:${rd}:${set}`); }
  for (const [sep, rs] of by) console.log(`  ${t.seed} (${t.size}) | ${rs.length} pages (${rs.slice(0, 3).join(' ')}${rs.length > 3 ? ' ...' : ''}) | ${sep}`); }
console.log('THE CONTROLS GATE-2 FAILS AT L3, NAMED: control | reads failing | separating families (own, Reveal off)');
for (const t of ctl) { const bad = READS.flatMap((rd) => GATED.filter((s) => g2(3, [t], 'twin', rd, s).length).map((s) => `${rd}|${s}`)); if (!bad.length) continue;
  console.log(`  ${t.seed}: ${bad.length} reads | ${sepOf(t.size, 'off', t.sigs['off|own']).join(' ')}`); }
for (const L of [1, 2]) console.log(`REPORTED L${L} (${L === 1 ? 'counts none/one/several + the five bits' : 'none/some + the five bits'}), worst gated setting: hidden twin ${Math.max(...GATED.map((s) => g2(L, hid, 'twin', 'off', s).length))} / DM ${Math.max(...GATED.map((s) => g2(L, hid, 'twin', 'dm', s).length))}; controls ${Math.max(...GATED.map((s) => g2(L, ctl, 'twin', 'off', s).length))} / DM ${Math.max(...GATED.map((s) => g2(L, ctl, 'twin', 'dm', s).length))}`);
console.log('THE DRAG\'S EMPTY FORM (ruling 62 (2)): x.dragMarket values in U by size (births, Reveal off); the towns whose gated own page lacks the key, and those passing the field and the bit as served');
for (const size of SIZES) console.log(`  ${size}: ${[...(VAL[`${size}|off`]?.get('x.dragMarket') || new Map())].map(([v, s]) => `${v} ${s.size}`).join(', ')}`);
{ const F = 'f.economicState.safetyProfile.economicDragDesc'; const absent = hid.filter((t) => partsOf(t.sigs['off|own'])[F] === 'a');
  const pass = hid.filter((t) => { const m = partsOf(t.sigs['off|own']); return seen(t.size, 'off', F, m[F]) >= 2 && seen(t.size, 'off', 'x.dragMarket', m['x.dragMarket']) >= 2; });
  console.log(`  drag key ABSENT on the own page (Reveal off, twin): ${absent.length} of ${hid.length}; the field and the fifth bit both seen in U: ${pass.length} of ${hid.length}`); }

// ── REPORTED: the full fine signature, hidden against controls, Fisher's exact p
console.log('\nREPORTED (never gated): THE FULL FINE SIGNATURE (every part, R4\'s included), jointly: non-members, hidden-house towns (twin) against controls, Fisher\'s exact p (one-sided)');
console.log('setting | Reveal off: hidden / controls / p | Reveal DM: hidden / controls / p');
let fisherStop = false;
for (const set of GATED) { const cell = (rd) => { const a = g2('F', hid, 'twin', rd, set).length; const c = g2('F', ctl, 'twin', rd, set).length; const p = fisher(a, hid.length, c, ctl.length); if (p < 0.05) fisherStop = true; return `${a}/${hid.length} / ${c}/${ctl.length} / ${p.toExponential(2)}`; };
  console.log(`${set} | ${cell('off')} | ${cell('dm')}`); }
console.log(`FISHER (reported, ruling 62 (1): re-read after the cure, no separate stop): ${fisherStop ? 'p < 0.05 at some gated setting (the separating parts are GATE-1\'s hidden-house list above, R4\'s list included)' : 'no gated setting below 0.05'}`);

// ── ruling 62 (5)'s count (gated reads only; governing rows apart, VR42)
const pcSum = (xs) => xs.reduce((a, [r, g]) => [a[0] + r, a[1] + g], [0, 0]);
const pcAt = (t, eng, k) => { const v = pcAtKey(t, eng, k); return v ? v.split('/').map(Number) : null; };
console.log('\nRULING 62 (5): THE CRIMINAL POWERS\' ROWS SERVED ON GATED READS of the hidden-house towns (twin; server): towns / rows / of them GOVERNING (VR42 keeps them while the government\'s name stays)');
for (const set of GATED) for (const rd of READS) { const row = (eng) => { const xs = hid.map((t) => pcAt(t, eng, `${rd}|${set}`)).filter(Boolean); const [r, g] = pcSum(xs); return `${xs.length} / ${r} / ${g}`; };
  console.log(`  ${set}, Reveal ${rd}: ${row('twin')} ; server ${row('server')}`); }
{ const against = []; for (const t of hid) for (const eng of ['twin', 'server']) for (const rd of READS) for (const set of GATED) { const v = pcAt(t, eng, `${rd}|${set}`); const s = sigAt(t, eng, rd, set);
    if (v && v[0] > v[1] && s && partsOf(s)['x.powerNoHouse'] === '1') against.push(`${t.seed} ${eng}:${rd}:${set} ${v[0] - v[1]}`); }
  console.log(`NON-GOVERNING criminal rows served where the read serves no criminal house (AGAINST THE RULE): ${against.length}${against.length ? `: ${against.slice(0, 12).join('; ')}` : ''}`); }
const LOWER = new Map();
for (const t of hid) for (const eng of ['twin', 'server']) for (const rd of READS) for (const set of GATED) { const s = sigAt(t, eng, rd, set); if (!s) continue;
  for (const l of byRule(t, rd, s, pcAtKey(t, eng, `${rd}|${set}`))) { const e = LOWER.get(t.seed) || LOWER.set(t.seed, { t, parts: new Set(), reads: new Set() }).get(t.seed); e.parts.add(l); e.reads.add(`${eng}:${rd}:${set}`); } }
console.log(`THE TOWNS LOWER BY RULE (ruling 62 (5): VR42 keeps a governing row GATE-1 does not find at that size): ${LOWER.size}`);
for (const [seed, e] of [...LOWER].sort()) console.log(`  LOWER BY RULE ${seed} (${e.t.size}) | ${e.reads.size} reads | ${[...e.parts].join(' ')}`);

// ── per town
console.log('\nPER TOWN: per gated setting [' + GATED.join(' ') + '], twin, Reveal off | DM: "." passes, "1" fails GATE-1, "2" a GATE-2 (L3) non-member, "b" both, "r" LOWER BY RULE only');
const mark = (t, rd, set) => { const s = sigAt(t, 'twin', rd, set); const a = !s || g1FailT(t, 'twin', rd, set).length; const b = !s || !jMember(3, t.size, rd, s); const r = s && byRule(t, rd, s, pcAtKey(t, 'twin', `${rd}|${set}`)).length; return a && b ? 'b' : a ? '1' : b ? '2' : r ? 'r' : '.'; };
for (const t of [...hid].sort((x, y) => x.seed.localeCompare(y.seed))) console.log(`  ${t.seed} (${t.size}) | ${GATED.map((s) => mark(t, 'off', s)).join('')} | ${GATED.map((s) => mark(t, 'dm', s)).join('')}`);
const fails = hid.filter((t) => READS.some((rd) => GATED.some((set) => ['twin', 'server'].some((eng) => g1FailT(t, eng, rd, set).length))));
const by = (f) => READS.map((rd) => `${rd} ${hid.filter((t) => f(t, rd)).length}`).join(', ');
console.log(`\nTODAY: GATE-1 own (${by((t, rd) => ['twin', 'server'].some((e) => g1([t], e, rd, 'own').length))}); off (${by((t, rd) => ['twin', 'server'].some((e) => g1([t], e, rd, 'off').length))}); mixed (${by((t, rd) => MIXED.some((s) => ['twin', 'server'].some((e) => g1([t], e, rd, s).length)))})`);
console.log(`TODAY: GATE-1 allOpen (${by((t, rd) => ['twin', 'server'].some((e) => g1([t], e, rd, 'allOpen').length))}); any gated setting (${by((t, rd) => GATED.some((s) => ['twin', 'server'].some((e) => g1([t], e, rd, s).length)))}); LOWER BY RULE ${LOWER.size}`);
console.log(`TODAY: GATE-2 L3 any gated setting, non-members (${by((t, rd) => GATED.some((s) => ['twin', 'server'].some((e) => g2(3, [t], e, rd, s).length)))}); Fisher cells below 0.05: ${g2Red}`);
console.log(`GATE: ${fails.length} of ${hid.length} hidden-house towns fail GATE-1 on a gated read (twin or server); GATE-2 ${g2Red ? 'RED' : 'green'} -> ${fails.length || g2Red ? 'RED (exit 1)' : 'GREEN (exit 0)'}`);
process.exit(fails.length || g2Red ? 1 : 0);
