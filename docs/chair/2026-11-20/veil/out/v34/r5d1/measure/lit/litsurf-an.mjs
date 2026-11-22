// V33-JOINPROBE PASS 2: the tables of litsurf.probe.jsx's shards (WHO RULES by surface; FORTUNE's merits), server and twin.
//   node litsurf-an.mjs <outdir>   (exit 2 on a missing shard; exit 1 where a served string names what the read hides, or server != twin)
import { readFileSync, readdirSync } from 'node:fs';
const O = process.argv[2];
const files = readdirSync(O).filter((f) => /^litsurf-shard\d+\.json$/.test(f)).sort();
if (files.length !== 4) { console.log(`MISSING SHARDS: ${files.length} of 4`); process.exit(2); }
const shards = files.map((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')));
const rows = shards.flatMap((s) => s.rows); const sizes = shards[0].sizes;
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sortH = (h) => [...h].map((x) => JSON.stringify(x)).sort();
const tally = (arr) => arr.reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});
let bad = 0;
console.log(`births ${rows.length}; the law each was born under (seat, fortune): ${JSON.stringify(tally(rows.map((r) => JSON.stringify([r.law.seat, r.law.fortune]))))}`);

// ── (1) WHO RULES ────────────────────────────────────────────────────────────────────────────────────────────────────────
console.log('\n(1) WHO RULES: the DM\'s act on born places (T hidden taker; R hidden retired holder; K criminal taker), each read off / dm.');
const acts = rows.flatMap((r) => r.seat.map((s) => ({ ...s, seed: r.seed, size: r.size })));
console.log(`acts: ${JSON.stringify(tally(acts.map((a) => (a.skipped ? `${a.scen}:skipped(${a.skipped})` : a.scen))))}`);
const live = acts.filter((a) => !a.skipped);
const S = [['a_config', (x) => x.a_config.seat !== null || x.a_config.fortune !== null, () => false],
  ['b_contest', (x) => x.b_contest.challengers.length > 0, (x) => x.b_contest.namesHidden > 0],
  ['c_desk', (x) => x.c_desk.served, (x) => x.c_desk.namesHidden],
  ['d_desc', (x) => x.d_desc.served > 0, (x) => x.d_desc.namesHidden > 0],
  ['e_recentConflict', (x) => x.e_recentConflict.served !== null, (x) => x.e_recentConflict.namesHidden],
  ['f_edges(behind/retired)', (x) => x.f_edges.behind.length + x.f_edges.retired.length > 0, (x) => x.f_edges.namesHidden > 0],
  ['g_holder(reader)', (x) => !!x.g_holderReader.holderName, (x) => false]];
for (const scen of ['T', 'R', 'K']) for (const rd of ['off', 'dm']) {
  const a = live.filter((x) => x.scen === scen); if (!a.length) continue;
  console.log(`\n  ${scen} / ${rd}: ${a.length} places; the act's power served as a row (so NOT hidden on this read): server ${a.filter((x) => x.reads[rd].servedPower).length}, twin ${a.filter((x) => x.reads[rd].servedPowerTwin).length}`);
  console.log('    surface                    served srv/twin   names the hidden power srv/twin   server=twin');
  for (const [name, served, names] of S) {
    const sv = a.filter((x) => served(x.reads[rd].server)).length; const tv = a.filter((x) => served(x.reads[rd].twin)).length;
    const sn = a.filter((x) => names(x.reads[rd].server)).length; const tn = a.filter((x) => names(x.reads[rd].twin)).length;
    const key = name.split('(')[0].replace(/\(.*$/, '');
    const k = Object.keys(a[0].reads[rd].server).find((kk) => kk.startsWith(key.slice(0, 2)));
    const same = a.filter((x) => eq(x.reads[rd].server[k], x.reads[rd].twin[k])).length;
    if (sn || tn) bad += 1;
    console.log(`    ${name.padEnd(26)} ${String(sv).padStart(4)}/${String(tv).padEnd(4)}       ${String(sn).padStart(4)}/${String(tn).padEnd(4)}                       ${same}/${a.length}`);
  }
  const g = a.filter((x) => (!x.reads[rd].servedPower && x.reads[rd].server.g_holderReader.holderName === x.hiddenPower) || (!x.reads[rd].servedPowerTwin && x.reads[rd].twin.g_holderReader.holderName === x.hiddenPower)).length;
  const cnc = a.filter((x) => x.reads[rd].server.f_edges.corruptedNoCapture || x.reads[rd].twin.f_edges.corruptedNoCapture).length;
  const rung = a.filter((x) => x.reads[rd].server.captureRungServed !== null || x.reads[rd].twin.captureRungServed !== null).length;
  const unseen = a.filter((x) => /unseen interest/i.test(String(x.reads[rd].server.e_recentConflict.served ?? '')) ).length;
  const gd = a.filter((x) => x.reads[rd].server.g_holderReader.holderName !== x.ownerHolder.holderName).length;
  console.log(`    g: the reader's holder (server) differs from the owner's: ${gd} ${JSON.stringify(tally(a.map((x) => `${x.ownerHolder.rule}->${x.reads[rd].server.g_holderReader.rule}`)))}`);
  console.log(`    g: the reader's holder IS the act's power where the read withholds it: ${g}; f: a served corrupted/capture edge with no captureState: ${cnc}; the capture rung served: ${rung}; e: recentConflict masked "an unseen interest" (server): ${unseen}`);
  // every served string that names what the read hides (hidden power, hidden houses, withheld powers, withheld persons), by surface
  const hs = a.flatMap((x) => x.reads[rd].server.hides.hits.map((h) => ({ ...h, seed: x.seed }))); const ht = a.flatMap((x) => x.reads[rd].twin.hides.hits.map((h) => ({ ...h, seed: x.seed })));
  const closed = a.filter((x) => x.reads[rd].server.hides.closed || x.reads[rd].twin.hides.closed).length;
  console.log(`    ANY served string naming what the read hides (whole document): server ${hs.length}, twin ${ht.length} ${JSON.stringify(tally(hs.map((h) => h.surface)))} ${JSON.stringify(tally(ht.map((h) => h.surface)))}; closed searches ${closed}`);
  if (hs.length || ht.length) bad += 1;
  for (const h of [...hs, ...ht].slice(0, 6)) console.log(`      ${h.seed} ${h.path}: ${h.text}`);
  const sameHits = a.filter((x) => eq(sortH(x.reads[rd].server.hides.hits), sortH(x.reads[rd].twin.hides.hits))).length;
  if (sameHits !== a.length) bad += 1;
  console.log(`    server = twin on the hits: ${sameHits}/${a.length}`);
}
// examples of each act's owner sentences and what the reads serve
for (const scen of ['T', 'R', 'K']) {
  const x = live.find((y) => y.scen === scen && (y.ownerEdges.length || y.ownerRecentConflict)); if (!x) continue;
  console.log(`\n  example ${scen} ${x.seed} (hidden ${x.hiddenPower}; ${x.transfer.from} -> ${x.transfer.to}; owner's holder ${x.ownerHolder.rule} ${x.ownerHolder.holderName}):`);
  console.log(`    owner recentConflict: ${x.ownerRecentConflict}`); for (const e of x.ownerEdges) console.log(`    owner edge: ${e}`);
  for (const rd of ['off', 'dm']) { const s = x.reads[rd].server; console.log(`    ${rd} server recentConflict: ${s.e_recentConflict.served}; edges ${JSON.stringify([...s.f_edges.behind, ...s.f_edges.retired])}; reader holder ${s.g_holderReader.rule} ${s.g_holderReader.holderName}`); }
}

// ── (2) FORTUNE ──────────────────────────────────────────────────────────────────────────────────────────────────────────
console.log('\n(2) FORTUNE: breakdown.merits and the merit\'s sentence on the served document (no act), both engines, reads off / dm.');
console.log('size        births  merits>0(owner)  served merits = owner srv/twin  score = owner  meritsOf(doc) = owner  CAPTURED: meritsOf same  served merits+score same srv/twin  NO-HIDEABLE: meritsOf same  sentence served srv/twin  sentence same captured  sentence names hidden  rung served');
const F = { b: 0 };
for (const size of [...sizes, 'all']) {
  const r = size === 'all' ? rows : rows.filter((x) => x.size === size); if (!r.length) continue;
  const c = (fn) => r.filter(fn).length;
  const both = (fn) => ['off', 'dm'].every((rd) => fn(rd));
  const m = c((x) => (x.fortune.own.merits ?? 0) > 0);
  const smS = c((x) => both((rd) => eq(x.fortune.reads[rd].server.merits, x.fortune.own.merits))); const smT = c((x) => both((rd) => eq(x.fortune.reads[rd].twin.merits, x.fortune.own.merits)));
  const sc = c((x) => both((rd) => x.fortune.reads[rd].server.score === x.fortune.own.score && x.fortune.reads[rd].twin.score === x.fortune.own.score));
  const mo = c((x) => both((rd) => eq(x.fortune.reads[rd].server.meritsOf, x.fortune.own.meritsOf) && eq(x.fortune.reads[rd].twin.meritsOf, x.fortune.own.meritsOf)));
  const cm = c((x) => eq(x.fortune.ownCaptured.meritsOf, x.fortune.own.meritsOf));
  const csS = c((x) => both((rd) => eq(x.fortune.reads[rd].capServer.merits, x.fortune.reads[rd].server.merits) && x.fortune.reads[rd].capServer.score === x.fortune.reads[rd].server.score));
  const csT = c((x) => both((rd) => eq(x.fortune.reads[rd].capTwin.merits, x.fortune.reads[rd].twin.merits) && x.fortune.reads[rd].capTwin.score === x.fortune.reads[rd].twin.score));
  const nh = c((x) => eq(x.fortune.ownNoHideable.meritsOf, x.fortune.own.meritsOf));
  const ssS = c((x) => x.fortune.reads.off.server.sentence.length > 0); const ssT = c((x) => x.fortune.reads.off.twin.sentence.length > 0);
  const scap = c((x) => both((rd) => eq(x.fortune.reads[rd].server.sentence, x.fortune.reads[rd].capServer.sentence) && eq(x.fortune.reads[rd].twin.sentence, x.fortune.reads[rd].capTwin.sentence)));
  const snh = c((x) => ['off', 'dm'].some((rd) => [...x.fortune.reads[rd].hidesServer.hits, ...x.fortune.reads[rd].hidesTwin.hits].some((h) => h.surface === 'governance(merit sentence)' && x.fortune.reads[rd].server.sentence.some((s) => h.text.includes(s.slice(0, 40))))));
  const rung = c((x) => ['off', 'dm'].some((rd) => x.fortune.reads[rd].rungServer !== null || x.fortune.reads[rd].rungTwin !== null));
  if (size === 'all') { F.b = (r.length - smS) + (r.length - smT) + (r.length - sc) + (r.length - mo) + (r.length - cm) + (r.length - csS) + (r.length - csT) + (r.length - nh) + (r.length - scap) + snh + rung; }
  console.log(`${size.padEnd(11)} ${String(r.length).padStart(5)}  ${String(m).padStart(8)}         ${smS}/${smT}                          ${sc}             ${mo}                     ${cm}                        ${csS}/${csT}                            ${nh}                          ${ssS}/${ssT}                     ${scap}                       ${snh}                      ${rung}`);
}
if (F.b) bad += 1;
const ms = rows.filter((x) => x.fortune.reads.off.server.sentence.length).slice(0, 4);
for (const x of ms) console.log(`  merit sentence served ${x.seed} (merits ${x.fortune.own.merits}): ${x.fortune.reads.off.server.sentence.join(' ')}`);
const govHits = rows.flatMap((x) => ['off', 'dm'].flatMap((rd) => [...x.fortune.reads[rd].hidesServer.hits, ...x.fortune.reads[rd].hidesTwin.hits].map((h) => ({ ...h, seed: x.seed, rd }))));
console.log(`  (no act) ANY served string naming what the read hides, both reads, both engines: ${govHits.length} ${JSON.stringify(tally(govHits.map((h) => h.surface)))}`);
for (const h of govHits.slice(0, 6)) console.log(`    ${h.seed} ${h.rd} ${h.path}: ${h.text}`);
const sameF = rows.filter((x) => ['off', 'dm'].every((rd) => eq(x.fortune.reads[rd].server, x.fortune.reads[rd].twin) && eq(sortH(x.fortune.reads[rd].hidesServer.hits), sortH(x.fortune.reads[rd].hidesTwin.hits)))).length;
console.log(`  server = twin (fortune reads and hits): ${sameF}/${rows.length}`);
console.log(`\nLITSURF ${rows.length} births, ${live.length} acts: ${bad ? `RED (${bad} findings above)` : 'no served string names what the read hides; server = twin; merits rung-free on the served document'}`);
process.exit(bad ? 1 : 0);
