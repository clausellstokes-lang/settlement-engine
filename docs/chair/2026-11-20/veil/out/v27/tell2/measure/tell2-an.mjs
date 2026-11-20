// tell2-an.mjs <pooldir> <townsdir>: R3-TELL-2 unit 1's tables and THE TELL COLUMN AS A GATED ARM (ruling 54 (d)).
// MEMBERSHIP (ruling 54 (b)): a served page's signature (tell2-signature.mjs) is a MEMBER iff at least TWO distinct
// nothing-hidden births of the pool, of the town's SIZE, show it under some criminal setting, read with the SAME Reveal DM
// setting (a birth counts once however many of its settings show it; the Reveal read is part of what the reader holds).
// THE GATE: exit 1 if any of the hidden-house towns' served pages (twin or server) is not a member, over GATE_SCOPE:
// 'all' (default: every criminal setting read) or 'own' (the gate's setting alone). Exit 2 if an input is missing or a
// shard threw. T2_DROP (optional, for the sensitivity table only; the gate never reads it): comma-separated signature
// part prefixes dropped before matching (e.g. 'k,f.conflicts').
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { sigDiff } from './tell2-signature.mjs';
const [poolDir, townsDir] = process.argv.slice(2);
const GATE_SCOPE = process.env.GATE_SCOPE || 'all';
const load = (dir, re) => readdirSync(dir).filter((f) => re.test(f)).sort().map((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')));
if (!existsSync(poolDir) || !existsSync(townsDir)) { console.log('MISSING INPUT'); process.exit(2); }
const pool = load(poolDir, /^pool-shard\d+\.json$/); const towns = load(townsDir, /^towns-shard\d+\.json$/);
if (pool.length !== 4 || towns.length !== 4) { console.log(`MISSING SHARDS: pool ${pool.length}/4, towns ${towns.length}/4`); process.exit(2); }
const DROP = (process.env.T2_DROP || '').split(',').filter(Boolean);
const coarse = (s) => { if (!DROP.length) return s; const o = JSON.parse(s);
  for (const d of DROP) { const [part, ...rest] = d.split('.'); const key = rest.join('.'); if (!key) delete o[part]; else if (o[part]) delete o[part][key]; }
  return JSON.stringify(o); };
const SETS = ['own', 'g:110', 'g:101', 'g:011', 'g:100', 'g:010', 'g:001', 'g:000', 'allOpen', 'off'];
const READS = ['off', 'dm'];
const med = (xs) => { if (!xs.length) return 0; const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };

// ── THE POOL
const births = pool.flatMap((sh) => sh.births.map((b) => ({ ...b, sigs: Object.fromEntries(Object.entries(b.sigs).map(([k, i]) => [k, coarse(sh.sigs[i])])),
  srv: b.srv && Object.fromEntries(Object.entries(b.srv).map(([k, i]) => [k, coarse(sh.sigs[i])])) })));
const SIZES = [...new Set(births.map((b) => b.size))];
/** members[size|read]: sig -> Set(seed) */
const members = {}; const pages = {};
for (const b of births) for (const [k, s] of Object.entries(b.sigs)) { const [rd] = k.split('|'); const key = `${b.size}|${rd}`;
  ((members[key] ||= new Map()).get(s) || members[key].set(s, new Set()).get(s)).add(b.seed);
  ((pages[key] ||= new Map()).set(s, (pages[key].get(s) || 0) + 1)); }
const countOf = (size, rd, s) => members[`${size}|${rd}`]?.get(s)?.size || 0;
const isMember = (size, rd, s) => countOf(size, rd, s) >= 2;
console.log(`R3-TELL-2 unit 1: THE TELL COLUMN (ruling 54), gate scope '${GATE_SCOPE}'${DROP.length ? `, SENSITIVITY: parts dropped ${DROP.join(',')}` : ''}`);
console.log(`\nTHE POOL (${poolDir}): nothing-hidden births, each read by the twin under every setting, Reveal off and on`);
console.log('size | tried | accepted (nothing hidden) | rejected early | CPU minutes (sum of shards) | distinct signatures off / dm | seen in one birth only off / dm | pool births whose OWN page is a member off / dm | whose OFF page is a member off / dm');
for (const size of SIZES) {
  const c = pool.map((sh) => sh.cost?.[size]).filter(Boolean); const tried = c.reduce((a, x) => a + x.tried, 0); const acc = c.reduce((a, x) => a + x.accepted, 0); const ms = c.reduce((a, x) => a + x.ms, 0);
  const bs = births.filter((b) => b.size === size);
  const cell = (rd, f) => f(members[`${size}|${rd}`] || new Map());
  const self = (rd, set) => bs.filter((b) => isMember(size, rd, b.sigs[`${rd}|${set}`])).length;
  console.log(`${size} | ${tried} | ${acc} | ${tried - acc} | ${(ms / 60000).toFixed(1)} | ${cell('off', (m) => m.size)} / ${cell('dm', (m) => m.size)} | ${cell('off', (m) => [...m.values()].filter((x) => x.size < 2).length)} / ${cell('dm', (m) => [...m.values()].filter((x) => x.size < 2).length)} | ${self('off', 'own')}/${bs.length} / ${self('dm', 'own')}/${bs.length} | ${self('off', 'off')}/${bs.length} / ${self('dm', 'off')}/${bs.length}`);
}
const audit = pool.flatMap((sh) => sh.audit || []);
console.log(`early-rejection audit: ${audit.filter((a) => a.finalHasHouse).length} of ${audit.length} audited rejected births hold a hideable house at their end (a birth is rejected at the first step holding one)`);
const rejAt = {}; for (const sh of pool) for (const [size, r] of Object.entries(sh.rejected || {})) for (const [st, n] of Object.entries(r.at)) rejAt[`${size}@${st}`] = (rejAt[`${size}@${st}`] || 0) + n;
console.log(`rejected at: ${Object.entries(rejAt).map(([k, n]) => `${k} ${n}`).join('; ')}`);
const srvS = births.filter((b) => b.srv); const srvBad = srvS.filter((b) => Object.keys(b.srv).some((k) => b.srv[k] !== b.sigs[k]));
console.log(`server sample (own and off, Reveal off and on): ${srvS.length} births, signature differs from the twin's in ${srvBad.length}${srvBad.length ? `: ${srvBad.map((b) => b.seed).join(', ')}` : ''}`);
const sums = births.map((b) => b.incSum).filter((x) => x !== null); console.log(`income shares on the pool's stored births: ${sums.length} with rows; summing to 100 (±0.5) ${sums.filter((x) => Math.abs(x - 100) <= 0.5).length}; else ${sums.filter((x) => Math.abs(x - 100) > 0.5).length}`);
const meta = existsSync(`${poolDir}/meta.txt`) ? readFileSync(`${poolDir}/meta.txt`, 'utf8') : '';
const st = /start (\S+)/.exec(meta)?.[1]; const en = /end (\S+)/.exec(meta)?.[1];
if (st && en) console.log(`pool wall clock: ${((Date.parse(en) - Date.parse(st)) / 60000).toFixed(1)} minutes (${st} to ${en}, four shards)`);

// ── THE TOWNS
const all = towns.flatMap((sh) => sh.births.map((b) => ({ ...b, sigs: Object.fromEntries(Object.entries(b.sigs).map(([k, i]) => [k, coarse(sh.sigs[i])])),
  srv: b.srv && Object.fromEntries(Object.entries(b.srv).map(([k, i]) => [k, coarse(sh.sigs[i])])) })));
const hid = all.filter((t) => t.hidden.length); const ctl = all.filter((t) => !t.hidden.length);
const sizesOf = [...new Set(hid.map((t) => t.size))];
console.log(`\nTHE TOWNS (${townsDir}): ${all.length} gate births; ${hid.length} with a hidden house; ${ctl.length} controls`);
const nonMem = (ts, eng, rd, set) => ts.filter((t) => { const s = (eng === 'twin' ? t.sigs : t.srv)?.[`${rd}|${set}`]; return s === undefined ? true : !isMember(t.size, rd, s); });
for (const [set, what] of [['own', 'the owner\'s own setting (the gate\'s)'], ['off', 'the switch OFF (the limit)']]) {
  console.log(`\nTHE TELL COLUMN, ${what}: NON-MEMBERS of the hidden-house towns, by size and Reveal (twin / server)`);
  console.log(`size (towns) | Reveal off | Reveal DM`);
  for (const size of [...sizesOf, 'ALL']) { const ts = size === 'ALL' ? hid : hid.filter((t) => t.size === size);
    console.log(`${size} (${ts.length}) | ${nonMem(ts, 'twin', 'off', set).length} / ${nonMem(ts, 'server', 'off', set).length} | ${nonMem(ts, 'twin', 'dm', set).length} / ${nonMem(ts, 'server', 'dm', set).length}`); }
}
console.log('\nEVERY SETTING: non-members of the hidden-house towns (twin / server), Reveal off | Reveal DM; and the gate\'s CONTROLS (nothing hidden; twin): their non-members measure the pool\'s sparsity, not a tell');
console.log('setting | hidden-house towns, off | hidden-house towns, DM | controls off | controls DM');
for (const set of SETS) console.log(`${set} | ${nonMem(hid, 'twin', 'off', set).length} / ${nonMem(hid, 'server', 'off', set).length} | ${nonMem(hid, 'twin', 'dm', set).length} / ${nonMem(hid, 'server', 'dm', set).length} | ${nonMem(ctl, 'twin', 'off', set).length}/${ctl.length} | ${nonMem(ctl, 'twin', 'dm', set).length}/${ctl.length}`);
const anyNon = (t, eng, rd) => SETS.some((set) => nonMem([t], eng, rd, set).length);
console.log(`ANY SETTING: hidden-house towns with a non-member page: Reveal off ${hid.filter((t) => anyNon(t, 'twin', 'off') || anyNon(t, 'server', 'off')).length}, Reveal DM ${hid.filter((t) => anyNon(t, 'twin', 'dm') || anyNon(t, 'server', 'dm')).length} (twin or server)`);
console.log(`THE LIMIT (ruling 54 (c): the switch-off page is always a member): hidden-house towns whose switch-off page is NOT a member: Reveal off ${nonMem(hid, 'twin', 'off', 'off').length} / ${nonMem(hid, 'server', 'off', 'off').length}, Reveal DM ${nonMem(hid, 'twin', 'dm', 'off').length} / ${nonMem(hid, 'server', 'dm', 'off').length} (twin / server)`);

// ── PARITY: the server's signature against the twin's, every town-read
const par = []; for (const t of hid) for (const k of Object.keys(t.sigs)) if (t.srv && t.srv[k] !== t.sigs[k]) par.push({ t, k, d: sigDiff(t.srv[k], t.sigs[k]) });
const parTowns = new Set(par.map((p) => p.t.seed));
console.log(`\nPARITY: town-reads whose server signature differs from the twin's: ${par.length} (${parTowns.size} towns)`);
const parBy = {}; for (const p of par) for (const l of p.d) (parBy[l] ||= new Set()).add(p.t.seed);
for (const [l, s] of Object.entries(parBy).sort((a, b) => b[1].size - a[1].size).slice(0, 20)) console.log(`  server -> twin  ${l}: ${s.size} towns (e.g. ${[...s].slice(0, 3).join(', ')})`);

// ── WHY: each non-member's nearest MEMBER signature (fewest differing parts), the gate's setting
const parsed = new Map(); const P = (s) => { if (!parsed.has(s)) parsed.set(s, JSON.parse(s)); return parsed.get(s); };
const nearest = (size, rd, s) => { let best = null;
  for (const [m, set] of members[`${size}|${rd}`] || []) { if (set.size < 2) continue; const d = sigDiff(P(s), P(m)); if (!best || d.length < best.d.length) best = { d, n: set.size }; }
  return best; };
const why = {};
console.log('\nPER NON-MEMBER TOWN, the gate\'s setting (twin): the parts its signature differs in from the NEAREST member signature of its size and Reveal (page -> member; the member\'s births)');
for (const rd of READS) for (const t of nonMem(hid, 'twin', rd, 'own').sort((a, b) => a.seed.localeCompare(b.seed))) {
  const nb = nearest(t.size, rd, t.sigs[`${rd}|own`]);
  console.log(`  ${t.seed} Reveal ${rd} (seen in ${countOf(t.size, rd, t.sigs[`${rd}|own`])} pool births): ${nb ? `${nb.d.length} parts from a member of ${nb.n}: ${nb.d.join('; ')}` : 'NO MEMBER AT THIS SIZE'}`);
  for (const l of nb?.d || []) { const key = `${rd}|${l.replace(/: .*/, '')}`; (why[key] ||= new Set()).add(t.seed); } }
console.log('\nTHE PARTS that most often separate a non-member from its nearest member (gate\'s setting, twin): towns');
for (const [k, s] of Object.entries(why).sort((a, b) => b[1].size - a[1].size).slice(0, 30)) console.log(`  ${k}: ${s.size}`);
// ── SINGLE-PART TELLS: a part's value that a hidden-house town's page shows and fewer than two pool births of its size
// show under ANY setting (same Reveal): that value alone makes the page a non-member, whatever else it holds.
const partVals = {}; // `${size}|${rd}` -> Map(`${part}.${key}=${value}` -> Set(seed))
const linesOf = (s) => { const o = P(s); return ['f', 'k', 'r', 'x'].flatMap((p) => Object.entries(o[p] || {}).map(([k, v]) => `${p}.${k}=${JSON.stringify(v)}`)); };
for (const b of births) for (const [k, s] of Object.entries(b.sigs)) { const key = `${b.size}|${k.split('|')[0]}`; const m = (partVals[key] ||= new Map());
  for (const l of linesOf(s)) (m.get(l) || m.set(l, new Set()).get(l)).add(b.seed); }
for (const set of ['own', 'off']) {
  const tally = {};
  for (const rd of READS) for (const t of hid) for (const l of linesOf(t.sigs[`${rd}|${set}`])) if ((partVals[`${t.size}|${rd}`]?.get(l)?.size || 0) < 2) (tally[`${rd}|${l}`] ||= new Set()).add(t.seed);
  console.log(`\nSINGLE-PART TELLS, setting '${set}' (twin): a value the hidden-house town's page shows that fewer than two nothing-hidden births of its size show under any setting (towns of ${hid.length})`);
  for (const [k, s] of Object.entries(tally).sort((a, b) => b[1].size - a[1].size).slice(0, 25)) console.log(`  ${s.size} | ${k.slice(0, 220)} (e.g. ${[...s].slice(0, 2).join(', ')})`);
}
// ── per town, every read
console.log('\nPER TOWN: member (M) or not (-) per setting in SETS order [' + SETS.join(' ') + '], twin then server, Reveal off | DM');
for (const t of [...hid].sort((a, b) => a.seed.localeCompare(b.seed))) {
  const row = (eng, rd) => SETS.map((set) => (nonMem([t], eng, rd, set).length ? '-' : 'M')).join('');
  console.log(`  ${t.seed} (${t.size}) | ${row('twin', 'off')} ${row('server', 'off')} | ${row('twin', 'dm')} ${row('server', 'dm')}`);
}
const failing = hid.filter((t) => READS.some((rd) => (GATE_SCOPE === 'own' ? ['own'] : SETS).some((set) => nonMem([t], 'twin', rd, set).length || nonMem([t], 'server', rd, set).length)));
console.log(`\nGATE (${GATE_SCOPE}): ${failing.length} of ${hid.length} hidden-house towns hold a non-member page${failing.length ? ' -> RED (exit 1)' : ' -> GREEN (exit 0)'}`);
process.exit(failing.length ? 1 : 0);
