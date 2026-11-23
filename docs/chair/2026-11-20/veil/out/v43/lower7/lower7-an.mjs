// V43-LOWER7 (a), (c), (d) over the gate's run, read never re-made:   node lower7-an.mjs <pooldir> <gate townsdir> [rows.json]
// COPIED FROM tell2-an.mjs (out/v27/tell2/measure, the gate's analyzer), unchanged in substance: flat, partsOf, famKey, the JOINT
// build, jMember and sepOf (here sepOf also returns the nearest member key it chose; same tie order: the first key of least
// difference in the JOINT map's insertion order). R4's families are dropped as there.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
const [poolDir, townsDir, rowsFile] = process.argv.slice(2);
const load = (dir, re) => readdirSync(dir).filter((f) => re.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
const A = load(poolDir, /^pool-shard\d+\.json$/); const B = load(poolDir, /^poolb-shard\d+\.json$/); const TW = load(townsDir, /^towns-shard\d+\.json$/);
const R4 = new Set(['r.people.roles', 'r.trace.criminal', 'r.ties.criminal', 'r.people.goals', 'r.people.memberships', 'r.cast.criminal']);
const flat = (shs, part) => shs.flatMap((sh) => sh.births.map((b) => ({ ...b, part, sigs: Object.fromEntries(Object.entries(b.sigs).map(([k, i]) => [k, sh.sigs[i]])),
  srv: b.srv && Object.fromEntries(Object.entries(b.srv).map(([k, i]) => [k, sh.sigs[i]])) })));
const pa = flat(A, 'A'); const pb = flat(B, 'B'); const towns = flat(TW, 'T');
const hid = towns.filter((t) => t.hidden.length); const ctl = towns.filter((t) => !t.hidden.length);
const parsedC = new Map();
const partsOf = (s) => { if (parsedC.has(s)) return parsedC.get(s); const o = JSON.parse(s); const m = {};
  for (const [k, v] of Object.entries(o.f || {})) m[`f.${k}`] = v; for (const [k, v] of Object.entries(o.r || {})) m[`r.${k}`] = v;
  for (const [fam, ks] of Object.entries(o.k || {})) for (const [k, v] of Object.entries(ks)) m[`k.${fam}.${k}`] = v;
  for (const [k, v] of Object.entries(o.x || {})) m[`x.${k}`] = v; parsedC.set(s, m); return m; };
const famKey = (s, level) => { const m = partsOf(s); const r = Object.keys(m).filter((p) => p.startsWith('r.') && !R4.has(p)).sort().map((p) => `${p}=${level === 1 ? m[p] : m[p] === '0' ? '0' : '+'}`);
  const x = level === 3 ? [] : Object.keys(m).filter((p) => p.startsWith('x.')).sort().map((p) => `${p}=${m[p]}`); return [...r, ...x].join(';'); };
const jointOf = (births) => { const J = {}; for (const b of births) for (const [k, s] of Object.entries(b.sigs)) { const rd = k.split('|')[0]; const m = (J[`${b.size}|${rd}`] ||= new Map()); const key = famKey(s, 3); (m.get(key) || m.set(key, new Set()).get(key)).add(b.seed); } return J; };
const universe = [...pa, ...pb];
const JU = jointOf(universe);
const member = (J, size, rd, s) => (J[`${size}|${rd}`]?.get(famKey(s, 3))?.size || 0) >= 2;
const sepOf = (J, size, rd, s) => { const key = famKey(s, 3); const mine = Object.fromEntries(key.split(';').filter(Boolean).map((x) => x.split('='))); let best = null; let bk = null;
  for (const [k, st] of J[`${size}|${rd}`] || new Map()) { if (st.size < 2) continue; const o = Object.fromEntries(k.split(';').filter(Boolean).map((x) => x.split('=')));
    const d = [...new Set([...Object.keys(mine), ...Object.keys(o)])].filter((f) => (mine[f] ?? '-') !== (o[f] ?? '-')).map((f) => `${f}:${mine[f] ?? '-'}->${o[f] ?? '-'}`); if (!best || d.length < best.length) { best = d; bk = k; } }
  return { sep: best || ['<no member key>'], near: bk, n: bk ? J[`${size}|${rd}`].get(bk).size : 0 }; };
const short = (key) => key.split(';').filter((x) => x.endsWith('=+')).map((x) => x.slice(2, -2)).join(' ');
const EIGHT = ['r3m-city-indebted-1-106', 'r3m-city-insurgency-1-104', 'r3m-city-insurgency-1-114', 'r3m-city-none-1-117', 'r3m-city-politically_fractured-1-120', 'r3m-city-under_siege-1-108', 'r3m-metropolis-indebted-1-136', 'r3m-town-insurgency-0-14'];
const SEVEN = EIGHT.slice(0, 7);
const sigAt = (t, eng, rd, set) => (eng === 'twin' ? t.sigs : t.srv)?.[`${rd}|${set}`];
console.log(`V43-LOWER7: pool ${poolDir} (A ${pa.length}, B ${pb.length}); towns ${townsDir} (hidden ${hid.length}, controls ${ctl.length})`);
// ── (a)
console.log('\n(a) PER TOWN: engine:Reveal:setting | member of U at L3 | the town\'s L3 key ("+" families) | nearest member key ("+" families; births sharing it) | separating families (town->member)');
const A_OUT = {};
for (const seed of EIGHT) { const t = towns.find((x) => x.seed === seed); if (!t) { console.log(`  ${seed}: NOT IN THE GATE'S TOWNS`); continue; }
  console.log(`  ${seed} (${t.size}) hidden ${JSON.stringify(t.hidden)} pc twin ${JSON.stringify({ off: t.pc?.['off|own'], dm: t.pc?.['dm|own'] })}`);
  for (const eng of ['twin', 'server']) for (const rd of ['off', 'dm']) for (const set of ['own', 'off']) {
    const s = sigAt(t, eng, rd, set); if (!s) { console.log(`    ${eng}:${rd}:${set} | NO PAGE`); continue; }
    const m = member(JU, t.size, rd, s); const z = sepOf(JU, t.size, rd, s); (A_OUT[seed] ||= []).push({ eng, rd, set, m, sep: z.sep });
    console.log(`    ${eng}:${rd}:${set} | ${m ? 'MEMBER' : 'non-member'} | ${short(famKey(s, 3))} | ${m ? '-' : `${short(z.near)} (${z.n})`} | ${m ? '-' : z.sep.join(' ')}`); } }
// ── (c)
const govOf = (b, key) => { const v = b.pc?.[key]; if (!v) return false; const [, g] = v.split('/').map(Number); return g > 0; };
console.log('\n(c) NOTHING-HIDDEN BIRTHS WITH A GOVERNING CRIMINAL ROW (the probe\'s pc "rows/governing" at the own setting, twin; for part B the own setting with every house shown): by size and Reveal | n of m show inst.criminal | chains.criminal | both');
const C = [];
for (const [label, set] of [['controls (the gate\'s 48)', ctl], ['U part A', pa], ['U part B', pb]]) for (const rd of ['off', 'dm']) {
  const by = {}; for (const b of set) { const key = `${rd}|own`; if (!govOf(b, key)) continue; const m = partsOf(b.sigs[key]); const e = (by[b.size] ||= { m: 0, inst: 0, chains: 0, both: 0, seeds: [] });
    e.m += 1; const i = m['r.inst.criminal'] !== '0'; const c = m['r.chains.criminal'] !== '0'; e.inst += i; e.chains += c; e.both += i && c; if (!(i && c)) e.seeds.push(`${b.seed}${i ? '' : ' -inst'}${c ? '' : ' -chains'}`); if (rd === 'off') C.push(b); }
  const tot = Object.values(by).reduce((a, e) => ({ m: a.m + e.m, both: a.both + e.both }), { m: 0, both: 0 });
  console.log(`  ${label}, Reveal ${rd}: total ${tot.both} of ${tot.m} show both | ${Object.entries(by).map(([s, e]) => `${s}: m ${e.m}, inst ${e.inst}, chains ${e.chains}, both ${e.both}${e.seeds.length ? ` (not both: ${e.seeds.slice(0, 4).join('; ')})` : ''}`).join(' | ')}`); }
console.log(`  of the ${ctl.length} controls: with a governing criminal row (Reveal off or DM, own) ${ctl.filter((b) => govOf(b, 'off|own') || govOf(b, 'dm|own')).length}`);
// ── (d)
const JC = jointOf(C);
console.log(`\n(d) THE MEMBERSHIP RE-READ: each of the seven against ONLY (c)'s births (${C.length}: U and controls with a governing criminal row at Reveal off, every setting each was read at): member when two or more of them share its L3 key at its size and Reveal`);
console.log(`  (c)'s births by size: ${JSON.stringify(C.reduce((a, b) => { a[b.size] = (a[b.size] || 0) + 1; return a; }, {}))}`);
for (const seed of SEVEN) { const t = towns.find((x) => x.seed === seed); const rows = [];
  for (const rd of ['off', 'dm']) for (const set of ['own', 'off']) for (const eng of ['twin', 'server']) { const s = sigAt(t, eng, rd, set); if (!s) continue; const m = member(JC, t.size, rd, s); const z = sepOf(JC, t.size, rd, s); rows.push(`${eng}:${rd}:${set} ${m ? 'MEMBER' : `non-member [${z.sep.join(' ')}] (nearest shared by ${z.n})`}`); }
  console.log(`  ${seed} (${t.size}): ${rows.join(' | ')}`); }
// ── (b) the rows, from the probe
if (rowsFile && existsSync(rowsFile)) {
  const R = JSON.parse(readFileSync(rowsFile, 'utf8'));
  console.log('\n(b) THE PROBE\'S READS: signature equal to the gate\'s (town form): per seed | eng:Reveal:setting');
  let eq = 0; let ne = 0; const neq = [];
  for (const r of R.filter((x) => x.form === 'town')) { const t = towns.find((x) => x.seed === r.seed); for (const eng of ['twin', 'server']) { const g = sigAt(t, eng, r.dm ? 'dm' : 'off', r.set); if (g === r[eng]?.sig) eq += 1; else { ne += 1; neq.push(`${r.seed} ${eng}:${r.dm ? 'dm' : 'off'}:${r.set}`); } } }
  console.log(`  equal ${eq}, differ ${ne} ${neq.slice(0, 8).join('; ')}`);
  console.log('(b) THE "+ -> 0" FAMILIES\' ITEMS AS SERVED (town) and THE HOUSE-FREE TWIN\'S items in the same family (same engine, Reveal, setting)');
  for (const seed of EIGHT) for (const x of A_OUT[seed] || []) { if (x.m) continue; const fams = x.sep.filter((d) => d.endsWith(':+->0')).map((d) => d.split(':')[0].slice(2)); if (!fams.length) continue;
    const r = R.find((y) => y.seed === seed && y.form === 'town' && y.dm === (x.rd === 'dm') && y.set === x.set); const h = R.find((y) => y.seed === seed && y.form === 'houseFree' && y.dm === (x.rd === 'dm') && y.set === x.set);
    for (const f of fams) console.log(`  ${seed} ${x.eng}:${x.rd}:${x.set} ${f} | town ${JSON.stringify(r?.[x.eng]?.fams?.[f])} | house-free ${JSON.stringify(h?.[x.eng]?.fams?.[f])}`); }
  console.log('(b) THE RAW ROWS (town, twin, own; Reveal off | DM) and the house-free twin\'s (twin, own, Reveal off)');
  for (const seed of EIGHT) for (const dm of [false, true]) { const r = R.find((y) => y.seed === seed && y.form === 'town' && y.dm === dm && y.set === 'own'); console.log(`  ${seed} dm=${dm} held ${JSON.stringify(r?.held)}\n    TOWN ${JSON.stringify(r?.twin?.rows)}`);
    if (!dm) { const h = R.find((y) => y.seed === seed && y.form === 'houseFree' && !y.dm && y.set === 'own'); console.log(`    HOUSE-FREE ${JSON.stringify(h?.twin?.rows)}`); } }
}
