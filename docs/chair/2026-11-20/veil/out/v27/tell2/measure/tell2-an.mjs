// tell2-an.mjs <pooldir> <townsdir>: THE TELL'S TWO GATES as ruling 58 restates them (the chair, 18:21), and what it reports.
// (Ruling 54's single-membership analyzer that wrote run1/ is at 580a5c9dd.)
//
// THE UNIVERSE U(size, Reveal): every page read(T', s') of the pool such that s' hides NOTHING T' holds: part A (T' holds no
// hideable house: every setting) and part B (T' holds some: the settings that show all it holds). Pages are counted by
// DISTINCT BIRTH (a birth counts once however many of its settings show a value), with the same Reveal setting.
// GATED READS: read(T, s) of a town holding a hideable house where s hides at least one of them: own, the seven mixed
// g:<bits>, off (every house is hidden by default under each). allOpen is EXEMPT (ruling 58 1; it is reported).
// THE CONTROLS (the gate's 48 nothing-hidden births, outside the pool) are read under the same settings: the calibration.
// R4'S PARTS (ruling 58 3 (b)): the criminal-worded role, trace, ties, goals, memberships, cast families: DROPPED from both
// gates and LISTED RED as R4's.
// GATE-1 (full fineness): every single part of the page (each of the 87 fields, each family's count, each row-key state,
//   each of the FIVE cross bits; a part a page lacks reads '-') holds a value seen in at least two births of U. Controls must
//   be 0 of 48; a part where one is not is NAMED.
// GATE-2 (the joint signature at the family level): the families' counts and the five bits, jointly, seen in at least two
//   births of U. Calibrated by the controls at three levels (L1 counts none/one/several + bits; L2 none/some + bits; L3
//   none/some alone): the FINEST level with 0 of 48 controls at every gated setting is the gate; none: TOO FINE (exit 1).
// REPORTED, NEVER GATED: the full fine signature (every part, R4's included) jointly, hidden against controls, with Fisher's
//   exact p (one-sided: hidden non-members exceed the controls'); p < 0.05 is a STOP with the separating parts.
// RULING 58 3 (c)'s COUNT: the criminal powers' rows the twin serves (governing ones apart: VR42) that the rule would withhold
//   (served where the read serves no criminal house): on the gated reads of the 92 and on part A's pages.
// EXIT: 1 if any gated read of a hidden-house town fails GATE-1 or GATE-2 (twin or server), or GATE-2 has no level; 2 on a
// missing input; else 0.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
const [poolDir, townsDir] = process.argv.slice(2);
const load = (dir, re) => (existsSync(dir) ? readdirSync(dir).filter((f) => re.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8'))) : []);
const A = load(poolDir, /^pool-shard\d+\.json$/); const B = load(poolDir, /^poolb-shard\d+\.json$/); const TW = load(townsDir, /^towns-shard\d+\.json$/);
if (A.length !== 4 || B.length !== 4 || TW.length !== 4) { console.log(`MISSING SHARDS: part A ${A.length}/4, part B ${B.length}/4, towns ${TW.length}/4`); process.exit(2); }
const R4 = new Set(['r.people.roles', 'r.trace.criminal', 'r.ties.criminal', 'r.people.goals', 'r.people.memberships', 'r.cast.criminal']);
const GATED = ['own', 'g:110', 'g:101', 'g:011', 'g:100', 'g:010', 'g:001', 'g:000', 'off'];
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
const g1Fail = (size, rd, s, r4 = false) => [...PARTS[`${size}|${rd}`]].filter((p) => R4.has(p) === r4 && seen(size, rd, p, valOf(s, p)) < 2).map((p) => `${p}=${JSON.stringify(valOf(s, p))}`);
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
const g1 = (ts, eng, rd, set, r4 = false) => ts.filter((t) => { const s = sigAt(t, eng, rd, set); return s === undefined || g1Fail(t.size, rd, s, r4).length; });
console.log(`\nGATE-1 (full fineness, R4's parts dropped): gated reads failing, hidden-house towns (of ${hid.length}) twin / server; controls (of ${ctl.length}) twin`);
console.log('setting | hidden, Reveal off | hidden, Reveal DM | controls off | controls DM');
for (const set of [...GATED, 'allOpen']) console.log(`${set}${set === 'allOpen' ? ' (exempt)' : ''} | ${g1(hid, 'twin', 'off', set).length} / ${g1(hid, 'server', 'off', set).length} | ${g1(hid, 'twin', 'dm', set).length} / ${g1(hid, 'server', 'dm', set).length} | ${g1(ctl, 'twin', 'off', set).length} | ${g1(ctl, 'twin', 'dm', set).length}`);
const tallyFail = (ts, eng, sets, r4 = false) => { const out = {}; for (const rd of READS) for (const set of sets) for (const t of ts) { const s = sigAt(t, eng, rd, set); if (!s) continue; for (const l of g1Fail(t.size, rd, s, r4)) (out[`${rd}|${l}`] ||= new Set()).add(t.seed); } return out; };
const show = (o, n = 40) => Object.entries(o).sort((a, b) => b[1].size - a[1].size).slice(0, n).map(([k, s]) => `  ${s.size} | ${k.slice(0, 200)} (e.g. ${[...s].slice(0, 2).join(', ')})`).join('\n');
console.log('\nGATE-1, THE CONTROLS\' FAILING PARTS (NAMED, never dropped; every gated setting): controls | read|part=value');
console.log(show(tallyFail(ctl, 'twin', GATED)) || '  none');
console.log('\nGATE-1, THE HIDDEN-HOUSE TOWNS\' FAILING PARTS (every gated setting, twin): towns | read|part=value');
console.log(show(tallyFail(hid, 'twin', GATED)));
console.log('\nR4\'S PARTS, LISTED RED AS R4\'S (dropped from both gates; ruling 58 3 (b)): hidden-house towns whose gated reads hold an R4 part value fewer than two births of U show (twin / server), by setting');
for (const set of ['own', 'off']) console.log(`  ${set}: Reveal off ${g1(hid, 'twin', 'off', set, true).length} / ${g1(hid, 'server', 'off', set, true).length}, Reveal DM ${g1(hid, 'twin', 'dm', set, true).length} / ${g1(hid, 'server', 'dm', set, true).length}`);
console.log(`  mixed (any g:<bits>): Reveal off ${hid.filter((t) => MIXED.some((s) => g1([t], 'twin', 'off', s, true).length)).length}, Reveal DM ${hid.filter((t) => MIXED.some((s) => g1([t], 'twin', 'dm', s, true).length)).length} (twin)`);
console.log(show(tallyFail(hid, 'twin', GATED, true), 12));

// ── GATE-2
const g2 = (L, ts, eng, rd, set) => ts.filter((t) => { const s = sigAt(t, eng, rd, set); return s === undefined || !jMember(L, t.size, rd, s); });
console.log('\nGATE-2 (the joint family-level signature, R4\'s families dropped), CALIBRATION BY THE CONTROLS: per level, the worst gated setting\'s controls failing (of 48), Reveal off / DM');
let LEVEL = null;
for (const L of [1, 2, 3]) { const worst = (rd) => Math.max(...GATED.map((s) => g2(L, ctl, 'twin', rd, s).length)); const w = [worst('off'), worst('dm')];
  console.log(`  L${L} (${L === 1 ? 'counts none/one/several + the five bits' : L === 2 ? 'counts none/some + the five bits' : 'counts none/some alone'}): ${w[0]} / ${w[1]}${w[0] + w[1] === 0 ? ' CALIBRATED' : ' too fine'}`);
  if (LEVEL === null && w[0] + w[1] === 0) LEVEL = L; }
console.log(`GATE-2 LEVEL: ${LEVEL === null ? 'NONE CALIBRATED (every level too fine: the chair is told)' : `L${LEVEL}`}`);
console.log('THE CONTROLS GATE-2 FAILS, NAMED, per level: control, gated reads failing, its non-zero families and bits (own, Reveal off)');
for (const L of [1, 2, 3]) for (const t of ctl) { const bad = READS.flatMap((rd) => GATED.filter((s) => g2(L, [t], 'twin', rd, s).length).map((s) => `${rd}|${s}`)); if (!bad.length) continue;
  const m = partsOf(t.sigs['off|own']); console.log(`  L${L} ${t.seed}: ${bad.length} reads (${bad.slice(0, 4).join(' ')}${bad.length > 4 ? ' ...' : ''}); ${Object.entries(m).filter(([p, v]) => (p.startsWith('r.') && !R4.has(p) && v !== '0') || (p.startsWith('x.') && v !== '0')).map(([p, v]) => `${p}=${v}`).join(' ')}`); }
console.log('THE DRAG\'S EMPTY FORM (ruling 58 3 (a)): x.dragMarket values in U by size (births, Reveal off), and of the towns whose gated pages lack the key, how many would pass the bit with each empty form');
for (const size of SIZES) console.log(`  ${size}: ${[...(VAL[`${size}|off`]?.get('x.dragMarket') || new Map())].map(([v, s]) => `${v} ${s.size}`).join(', ')}`);
{ const absent = hid.filter((t) => partsOf(t.sigs['off|own'])['f.economicState.safetyProfile.economicDragDesc'] === 'a');
  for (const form of ['n', 'e']) console.log(`  served as ${form === 'n' ? 'null' : "''"}: ${absent.filter((t) => seen(t.size, 'off', 'x.dragMarket', `${form}:${partsOf(t.sigs['off|own'])['x.dragMarket'].split(':')[1]}`) >= 2 && seen(t.size, 'off', 'f.economicState.safetyProfile.economicDragDesc', form) >= 2).length} of ${absent.length} pass both the field and the bit (Reveal off, own)`); }
for (const L of [1, 2, 3]) { console.log(`\nGATE-2 at L${L}${L === LEVEL ? ' (THE GATE)' : ' (reported)'}: gated reads failing, hidden-house towns twin / server; controls twin`);
  console.log('setting | hidden, Reveal off | hidden, Reveal DM | controls off | controls DM');
  for (const set of [...GATED, 'allOpen']) console.log(`${set}${set === 'allOpen' ? ' (exempt)' : ''} | ${g2(L, hid, 'twin', 'off', set).length} / ${g2(L, hid, 'server', 'off', set).length} | ${g2(L, hid, 'twin', 'dm', set).length} / ${g2(L, hid, 'server', 'dm', set).length} | ${g2(L, ctl, 'twin', 'off', set).length} | ${g2(L, ctl, 'twin', 'dm', set).length}`); }

// ── REPORTED: the full fine signature, hidden against controls, Fisher's exact p
const lnF = (n) => { let s = 0; for (let i = 2; i <= n; i += 1) s += Math.log(i); return s; };
const hyper = (k, K, n, N) => Math.exp(lnF(K) - lnF(k) - lnF(K - k) + lnF(N - K) - lnF(n - k) - lnF(N - K - n + k) - lnF(N) + lnF(n) + lnF(N - n));
/** One-sided Fisher: P(hidden non-members >= a) given the margins. */
const fisher = (a, n1, c, n2) => { const K = a + c; const N = n1 + n2; let p = 0; for (let k = a; k <= Math.min(K, n1); k += 1) p += hyper(k, K, n1, N); return Math.min(1, p); };
console.log('\nREPORTED (never gated): THE FULL FINE SIGNATURE (every part, R4\'s included), jointly: non-members, hidden-house towns (twin) against controls, Fisher\'s exact p (one-sided)');
console.log('setting | Reveal off: hidden / controls / p | Reveal DM: hidden / controls / p');
let fisherStop = false;
for (const set of GATED) { const cell = (rd) => { const a = g2('F', hid, 'twin', rd, set).length; const c = g2('F', ctl, 'twin', rd, set).length; const p = fisher(a, hid.length, c, ctl.length); if (p < 0.05) fisherStop = true; return `${a}/${hid.length} / ${c}/${ctl.length} / ${p.toExponential(2)}`; };
  console.log(`${set} | ${cell('off')} | ${cell('dm')}`); }
console.log(`FISHER: ${fisherStop ? 'p < 0.05 at some gated setting: STOP (the separating parts are GATE-1\'s hidden-house list above, R4\'s list included)' : 'no gated setting below 0.05'}`);

// ── ruling 58 3 (c)'s count
const pcSum = (xs) => xs.reduce((a, [r, g]) => [a[0] + r, a[1] + g], [0, 0]);
const pcAt = (t, eng, k) => { const v = (eng === 'twin' ? t.pc : t.srvPc)?.[k]; return v ? v.split('/').map(Number) : null; };
console.log('\nRULING 58 3 (c): THE CRIMINAL POWERS\' ROWS the rule would withhold (served where the read serves no criminal house). Hidden-house towns, gated reads (twin; server): towns / rows / of them GOVERNING (VR42 keeps a governing row today)');
for (const set of ['own', 'off']) for (const rd of READS) { const row = (eng) => { const xs = hid.map((t) => pcAt(t, eng, `${rd}|${set}`)).filter(Boolean); const [r, g] = pcSum(xs); return `${xs.length} / ${r} / ${g}`; };
  console.log(`  ${set}, Reveal ${rd}: ${row('twin')} ; server ${row('server')}`); }
const anyPc = hid.filter((t) => GATED.some((s) => READS.some((rd) => pcAt(t, 'twin', `${rd}|${s}`))));
console.log(`  any gated setting: towns ${anyPc.length} (${[...new Set(anyPc.map((t) => t.size))].map((z) => `${z} ${anyPc.filter((t) => t.size === z).length}`).join(', ')})`);
console.log('PART A (nothing hidden: no read serves a criminal house, so EVERY criminal power row would be withheld): births with a criminal power row on some page / rows (the most a page serves, summed) / governing, by size');
for (const size of SIZES) { const bs = pa.filter((b) => b.size === size && Object.keys(b.pc || {}).length); const mx = bs.map((b) => Object.values(b.pc).map((v) => v.split('/').map(Number)).reduce((a, x) => (x[0] > a[0] ? x : a), [0, 0]));
  const [r, g] = pcSum(mx); console.log(`  ${size}: ${bs.length} of ${pa.filter((b) => b.size === size).length} births; ${r} rows; ${g} governing`); }
console.log(`the gate's 48 controls likewise: ${ctl.filter((t) => Object.keys(t.pc || {}).length).map((t) => `${t.seed} ${Object.values(t.pc)[0]}`).join('; ') || 'none'}`);

// ── per town
console.log('\nPER TOWN: per gated setting [' + GATED.join(' ') + '], twin, Reveal off | DM: "." passes, "1" fails GATE-1, "2" fails GATE-2 at its level, "b" both');
const mark = (t, rd, set) => { const s = sigAt(t, 'twin', rd, set); const a = !s || g1Fail(t.size, rd, s).length; const b = LEVEL !== null && (!s || !jMember(LEVEL, t.size, rd, s)); return a && b ? 'b' : a ? '1' : b ? '2' : '.'; };
for (const t of [...hid].sort((x, y) => x.seed.localeCompare(y.seed))) console.log(`  ${t.seed} (${t.size}) | ${GATED.map((s) => mark(t, 'off', s)).join('')} | ${GATED.map((s) => mark(t, 'dm', s)).join('')}`);
const fails = hid.filter((t) => READS.some((rd) => GATED.some((set) => ['twin', 'server'].some((eng) => { const s = sigAt(t, eng, rd, set); return !s || g1Fail(t.size, rd, s).length || LEVEL === null || !jMember(LEVEL, t.size, rd, s); }))));
const by = (f) => READS.map((rd) => `${rd} ${hid.filter((t) => f(t, rd)).length}`).join(', ');
console.log(`\nTODAY: GATE-1 own (${by((t, rd) => ['twin', 'server'].some((e) => g1([t], e, rd, 'own').length))}); off (${by((t, rd) => ['twin', 'server'].some((e) => g1([t], e, rd, 'off').length))}); mixed (${by((t, rd) => MIXED.some((s) => ['twin', 'server'].some((e) => g1([t], e, rd, s).length)))})`);
if (LEVEL !== null) console.log(`TODAY: GATE-2 L${LEVEL} own (${by((t, rd) => ['twin', 'server'].some((e) => g2(LEVEL, [t], e, rd, 'own').length))}); off (${by((t, rd) => ['twin', 'server'].some((e) => g2(LEVEL, [t], e, rd, 'off').length))}); mixed (${by((t, rd) => MIXED.some((s) => ['twin', 'server'].some((e) => g2(LEVEL, [t], e, rd, s).length)))})`);
console.log(`GATE: ${fails.length} of ${hid.length} hidden-house towns fail a gated read (GATE-1 or GATE-2${LEVEL === null ? ', uncalibrated' : ''}, twin or server) -> ${fails.length ? 'RED (exit 1)' : 'GREEN (exit 0)'}`);
process.exit(fails.length ? 1 : 0);
