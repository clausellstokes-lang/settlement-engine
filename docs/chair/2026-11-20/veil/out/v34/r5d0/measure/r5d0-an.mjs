// R5D-0 (VEIL-34's MEASURE builder V34-R5D0): the four questions over the extended arm's shards.   node r5d0-an.mjs <arm outdir> [lit outdir]
// Q1 dmNote share on the DM door; Q2 the base templates a power's presence picks, served; Q3 the cut by the standing table;
// Q4 the tension's masked party. Reads only the shards (and, for Q2's lit count, the lit probe's own committed output shards).
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { FORMS } from './standing-table.mjs';
const dir = process.argv[2]; const litDir = process.argv[3];
const meta = []; const towns = readdirSync(dir).filter((f) => /^arm-shard\d+\.json$/.test(f)).flatMap((f) => { const j = JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')); meta.push(j.meta); return j.towns; });
const J = JSON.stringify; const pct = (a, b) => (b ? `${(100 * a / b).toFixed(1)}%` : '-');
const L = (...a) => console.log(...a);
L(`towns ${towns.length}; pages ${towns.reduce((s, t) => s + Object.keys(t.pages).length, 0)}`);
const W = { n: 0, cut: 0, fail: [] }; for (const m of meta) { W.n += m.walk.n; W.cut += m.walk.cut; W.fail.push(...m.walk.fail); }
L(`THE WALKER: engine standings cut whole by the table ${W.cut} / ${W.n}; fails ${W.fail.length}`); for (const f of W.fail.slice(0, 5)) L('  fail', J(f));

// ---------------- Q1
L('\n== Q1 dmNote (served relation rows carrying a dmNote) ==');
const q1 = {}; const add1 = (k, rows, dm) => { const r = q1[k] || (q1[k] = [0, 0, 0]); r[0] += rows; r[1] += dm; r[2] += 1; };
for (const t of towns) for (const [k, p] of Object.entries(t.pages)) {
  const [rd, set, eng] = k.split('|'); if (!p.xrel) continue;
  add1(`${rd}|${eng}|all`, p.xrel[0], p.xrel[1]); add1(`${rd}|${eng}|size:${t.size}`, p.xrel[0], p.xrel[1]); add1(`${rd}|${eng}|set:${set}`, p.xrel[0], p.xrel[1]);
  if (!p.hide) { add1(`${rd}|${eng}|nothingHidden`, p.xrel[0], p.xrel[1]); add1(`${rd}|${eng}|nothingHidden|size:${t.size}`, p.xrel[0], p.xrel[1]); }
  if (p.xrel[0] && p.xrel[1] === p.xrel[0]) add1(`${rd}|${eng}|pagesAllNoted`, 0, 0);
  if (p.xrel[0]) add1(`${rd}|${eng}|pagesWithRows`, 0, 0);
  if (p.xrel[1]) add1(`${rd}|${eng}|pagesWithANote`, 0, 0);
}
for (const k of Object.keys(q1).sort()) L(`  ${k.padEnd(40)} rows ${String(q1[k][0]).padStart(6)}  dmNote ${String(q1[k][1]).padStart(5)}  ${pct(q1[k][1], q1[k][0]).padStart(6)}  pages ${q1[k][2]}`);
const recRel = towns.reduce((a, t) => [a[0] + t.x.rel[0], a[1] + t.x.rel[1], a[2] + (t.x.rel[1] ? 1 : 0)], [0, 0, 0]);
L(`  RECORD (140 births): relation rows ${recRel[0]}, with a dmNote ${recRel[1]} (${pct(recRel[1], recRel[0])}); births holding any dmNote ${recRel[2]}`);

// ---------------- Q3 (before Q2: Q2 reads the bases)
L('\n== Q3 the cut ==');
let closedN = 0, closedC = 0; const kinds = {};
for (const [, kind, t] of FORMS) { kinds[kind] = (kinds[kind] || 0) + 1; closedN += 1; closedC += t.length; }
L(`  table: ${FORMS.length} forms (${J(kinds)}); ${closedC} characters as templates (slots as {X} etc.)`);
const allRec = towns.flatMap((t) => t.x.rd.map((r) => ({ ...r, seed: t.seed, size: t.size, W: new Set(Object.values(t.pages).flatMap((p) => p.W || [])), H: t.recH })));
const cls = (r) => (r.mid.length ? 'standing-inside-base' : r.ids.length && r.base === '' ? 'standing-alone(no base)' : r.ids.length ? 'base+standing' : 'base-only(no tail row)');
const byCls = {}; const ex = {};
for (const r of allRec) { const c = cls(r); byCls[c] = (byCls[c] || 0) + 1; (ex[c] || (ex[c] = [])).length < 5 && ex[c].push([r.seed, r.n, r.d.slice(0, 220)]); }
L(`  RECORD descs ${allRec.length}: ${J(byCls)}`);
for (const [c, xs] of Object.entries(ex)) if (c !== 'base+standing') for (const x of xs) L(`    ${c}: ${J(x)}`);
const engCmp = { eq: 0, ne: 0, none: 0 }; const engNe = [];
for (const r of allRec) { if (r.engEq === 1) engCmp.eq += 1; else if (r.engEq === 0) { engCmp.ne += 1; if (engNe.length < 8) engNe.push([r.seed, r.n, r.ids, r.d.slice(-200), String(r.eng).slice(0, 160)]); } else engCmp.none += 1; }
L(`  the table's cut against the engine's own standing on the record roster: equal ${engCmp.eq}, differ ${engCmp.ne}, no engine reading ${engCmp.none}`);
for (const x of engNe) L('    differ', J(x));
const tail = { engHas: 0, engAtTail: 0, engNotTail: [] }; for (const r of allRec) if (r.eng) { tail.engHas += 1; if (r.engTail === 1) tail.engAtTail += 1; else if (tail.engNotTail.length < 5) tail.engNotTail.push([r.seed, r.n, r.d.slice(-180), r.eng.slice(0, 120)]); }
L(`  (b) the engine's standing (record roster) is the desc's tail: ${tail.engAtTail} / ${tail.engHas}`); for (const x of tail.engNotTail) L('    not tail', J(x));
const noRow = allRec.filter((r) => !r.ids.length); const noRowEng = noRow.filter((r) => r.eng);
L(`  tail matches no row: ${noRow.length} of ${allRec.length} record descs; of these the engine writes a standing for ${noRowEng.length}`); for (const r of noRowEng.slice(0, 5)) L('    no row, engine has one', J([r.seed, r.n, r.d.slice(-160), r.eng.slice(0, 120)]));
const fid = {}; const nameForms = { descs: 0, namesW: 0, namesH: 0, ex: [] };
for (const r of allRec) { for (const i of r.ids) fid[i] = (fid[i] || 0) + 1; if (r.named.length) { nameForms.descs += 1; const w = r.named.filter((n) => r.W.has(n)); const h = r.named.filter((n) => r.H.includes(n)); if (w.length) nameForms.namesW += 1; if (h.length) nameForms.namesH += 1; if ((w.length || h.length) && nameForms.ex.length < 4) nameForms.ex.push([r.seed, r.n, w, h, r.d.slice(-200)]); } }
L(`  forms seen on the record descs: ${Object.keys(fid).length} of ${FORMS.length}: ${J(fid)}`);
L(`  never seen: ${J(FORMS.map((f) => f[0]).filter((i) => !fid[i]))}`);
L(`  record descs whose cut tail names a power: ${nameForms.descs}; naming a withheld (W) power ${nameForms.namesW}; a stamped (H) one ${nameForms.namesH}`); for (const x of nameForms.ex) L('    ', J(x));
// served instances
const sv = { off: {}, dm: {} };
for (const t of towns) { const rd = new Map(t.x.rd.map((r) => [r.n, r])); for (const [k, p] of Object.entries(t.pages)) { const [read, , eng] = k.split('|'); if (eng !== 'sv' || !p.xsd) continue; const o = sv[read];
  for (const row of p.xsd) { o.n = (o.n || 0) + 1; if (row[1] === -1) { o.nodesc = (o.nodesc || 0) + 1; continue; } const c = row[1] === 1 ? cls(rd.get(row[0])) : cls({ ids: row[4], base: row[3], mid: row[6] }); o[c] = (o[c] || 0) + 1; if (row[1] === 0) { o.differsFromRecord = (o.differsFromRecord || 0) + 1; } }
  if (!p.hide) for (const row of p.xsd) { if (row[1] === -1) continue; const c = row[1] === 1 ? cls(rd.get(row[0])) : cls({ ids: row[4], base: row[3], mid: row[6] }); o[`nh:${c}`] = (o[`nh:${c}`] || 0) + 1; o.nh = (o.nh || 0) + 1; } } }
L(`  SERVED descs (server): off ${J(sv.off)}`); L(`                          dm  ${J(sv.dm)}`);
const els = {}; const elsEx = []; let elsPages = 0;
for (const t of towns) for (const [k, p] of Object.entries(t.pages)) { if (!p.xels) continue; let any = 0; for (const [path, n] of Object.entries(p.xels)) { els[`${k.split('|')[0]}|${k.split('|')[2]}|${path}`] = (els[`${k.split('|')[0]}|${k.split('|')[2]}|${path}`] || 0) + n; any = 1; } elsPages += any; if (p.xelsEx?.length && elsEx.length < 6) elsEx.push(...p.xelsEx.slice(0, 1).map((e) => [t.seed, k, ...e])); }
L(`  (c) a served desc's standing literal held at ANOTHER path of the served document: pages ${elsPages}; by path ${J(els)}`); for (const e of elsEx) L('    ', J(e));
const bases = [...new Set(allRec.filter((r) => r.base && r.ids.length).map((r) => r.base))];
L(`  (d) distinct bases with a standing after them: ${bases.length}; samples:`); for (const b of [bases[0], bases[Math.floor(bases.length / 2)], bases[bases.length - 1]]) L(`    "${b}"`);

// ---------------- Q2
L('\n== Q2 base templates a power\'s presence picks (served, server; record) ==');
const T2 = [
  ['rulingStructure.js :: generatePowerStructure (govDescByLabel Elected Reeve)', 'a noble POWER seated (noblePower over the gate) or a noble house; kept by applyDensityLaw.js :: reeveToRoster where a noble power or house stands', /A reeve elected from the peasantry manages labour and mediates disputes under noble oversight\./],
  ['rulingStructure.js :: generatePowerStructure (nobleDesc, nobleGoverns + military very_high)', "the SEAT's name holds Feudal/Noble/Royal Authority/Household Council; the seat's NAME printed", /Hereditary landowners behind the /],
  ['rulingStructure.js :: generatePowerStructure (nobleDesc, nobleGoverns)', 'the seat noble-kind', /structurally embedded in governance here; the (council|hall) works alongside them|genuine but not dominant feudal claims|Noble families with residual feudal claims/],
  ['rulingStructure.js :: generatePowerStructure (nobleDesc, merchantAligned)', 'the seat Merchant oligarchy / Democratic assembly / Guild Council', /systematically displaced by merchant wealth|increasingly outpaced by merchant capital; they compete/],
  ['rulingStructure.js :: generatePowerStructure (nobleDesc, Royal Authority)', 'the seat Royal Authority', /crown's military and fiscal foundation|cooperation the crown depends on|nominally loyal to the crown/],
  ['rulingStructure.js :: generatePowerStructure (nobleDesc, council seat)', 'the seat Town/City/Grand Council ("the elected council") or not ("the seat")', /structural influence the (elected council|seat) cannot easily override/],
  ['rulingStructure.js :: generatePowerStructure (merchantDesc, merchantGoverns)', 'the seat a merchant oligarchy/council', /The ruling class and the merchant class are the same people/],
  ['rulingStructure.js :: generatePowerStructure (militaryDescFinal)', 'the seat a military council / martial', /Operationally distinct from the command council/],
  ['rulingStructure.js :: generatePowerStructure (religiousDesc)', 'the seat Theocratic / Church Council / ecclesiastical', /Religious law governs directly; clergy are administrators|Church authority is the formal source of governing legitimacy|tithes, land, and courts are all ecclesiastical/],
  ['stressFactions.js :: applyStressEventFactions (politically_fractured, indebted, succession_void)', 'the seat Royal Authority (P)', /Noble houses backing the current crown line|renegotiation of feudal obligations|Would support stability, if a price can be agreed|Claims legitimate authority through different means|coalition of noble houses that hold the crown's debt|Resident agent of the external creditor|Several of these houses hold crown debt|plausible hereditary claim; controls several key military levies|rival noble house backed by popular sentiment/],
  ['stressFactions.js :: applyStressEventFactions (religious_conversion)', "the seat's NAME length mod 3", /Losing congregation to the new faith|One of two rival sides, each claiming to be the true faith|Formally compliant with the conversion order|Under pressure from both sides of the faith/],
  ['applyDensityLaw.js :: rivalDescOf (RIVAL_DESC_OF_HOST)', "the HOST power's opening line (the rival is minted from a present power)", /A second armed company that wants a share|A rival bloc that wants a say|A rival criminal network that wants a share|A rival body that wants a say in enforcing/],
  ['claimStanding.js :: settleClaimsToLabel / settleClergyToFinalRoster', "the seat: council or not (SEAT_WORDS), magic (ARCANE_ADVISORY_UNDER_ARCANE_SEAT), its label's rank (UNDERWORLD_UNDER_STRONGER_SEAT), its power (CLERGY_WITH_WEIGHT)", /and fund the hall\.|and the hall knows it\.|the hall works alongside them|expect access to the hall in return\.|Magical practitioners outside the seat hold no office|the seat is stronger, but has not moved to break its hold|The faith holds no office in the hall/],
];
const q2 = T2.map(() => ({ rec: 0, off: 0, dm: 0, offW: 0, ex: [] }));
for (const t of towns) { const rd = new Map(t.x.rd.map((r) => [r.n, r]));
  for (const r of t.x.rd) T2.forEach(([, , re], i) => { if (re.test(r.base)) { q2[i].rec += 1; if (q2[i].ex.length < 1) q2[i].ex.push([t.seed, r.n, r.base.slice(0, 160)]); } });
  for (const [k, p] of Object.entries(t.pages)) { const [read, , eng] = k.split('|'); if (eng !== 'sv' || !p.xsd) continue;
    for (const row of p.xsd) { if (row[1] === -1) continue; const base = row[1] === 1 ? rd.get(row[0]).base : row[3]; T2.forEach(([, , re], i) => { if (re.test(base)) { q2[i][read] += 1; if (p.W?.length) q2[i].offW += 1; } }); } } }
T2.forEach(([sym, cond], i) => L(`  ${sym}\n     picked by: ${cond}\n     record ${q2[i].rec}; served off ${q2[i].off}, dm ${q2[i].dm}; on a page that withholds a power ${q2[i].offW}; e.g. ${J(q2[i].ex[0] || null)}`));
// a rival copying its host whole: a base equal to another power's base in the same record
let dupBase = 0; const dupEx = []; for (const t of towns) { const bs = t.x.rd.filter((r) => r.base); for (const r of bs) if (bs.some((o) => o !== r && o.base === r.base)) { dupBase += 1; if (dupEx.length < 3) dupEx.push([t.seed, r.n, r.base.slice(0, 120)]); } }
L(`  applyDensityLaw.js :: resizePoliticalRoster (the mint's { ...host } copy, no RIVAL_DESC_OF_HOST row): record descs whose base equals another power's base in the same record: ${dupBase}; e.g. ${J(dupEx)}`);
let rivalCrimHostW = 0; let rivalCrimServed = 0; for (const t of towns) { const rd = new Map(t.x.rd.map((r) => [r.n, r])); for (const [k, p] of Object.entries(t.pages)) { if (!k.endsWith('|sv') || !p.xsd) continue; for (const row of p.xsd) { if (row[1] === -1) continue; const base = row[1] === 1 ? rd.get(row[0]).base : row[3]; if (!/^A rival criminal network that wants a share/.test(base)) continue; rivalCrimServed += 1; if ((p.W || []).some((n) => /^Organised criminal network/.test(rd.get(n)?.base || ''))) rivalCrimHostW += 1; } } }
L(`  "A rival criminal network ... contests them with the established one" served (server, both reads) ${rivalCrimServed}; on a page that withholds its criminal host ${rivalCrimHostW}`);
const seatW = towns.reduce((s, t) => s + t.x.rd.filter((r) => r.gov && (Object.values(t.pages).some((p) => (p.W || []).includes(r.n)) || r.hid)).length, 0);
L(`  the seat withheld or stamped on any page: ${seatW} (of ${towns.length} seats)`);
const nobleW = towns.reduce((s, t) => s + (Object.values(t.pages).some((p) => (p.W || []).some((n) => /manor|gentry|noble|lord|baron/i.test(n))) ? 1 : 0), 0);
L(`  a noble power withheld on any page: ${nobleW} towns`);
// the standing line the brief cites (GR-line), served where no religious power is served
let grNoRel = 0; for (const t of towns) for (const [k, p] of Object.entries(t.pages)) { if (!k.endsWith('|sv') || !p.xsd) continue; const served = p.xsd.map((r) => r[0]); const rd = new Map(t.x.rd.map((r) => [r.n, r])); if (served.some((n) => /religious/i.test(n))) continue; for (const row of p.xsd) { const ids = row[1] === 1 ? rd.get(row[0])?.ids : row[4]; if (ids?.includes('GR-line')) grNoRel += 1; } }
L(`  GR-line ("They and the religious authorities both keep people in line", factionStanding.js) served where no religious power is served: ${grNoRel}`);
if (litDir && existsSync(litDir)) {
  const rows = readdirSync(litDir).filter((f) => /^litsurf-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${litDir}/${f}`, 'utf8')).rows);
  const strs = []; const walkS = (v, p) => { if (Array.isArray(v)) { if (v.length >= 3 && typeof v[0] === 'string' && /desc$/.test(v[0]) && typeof v[v.length - 1] === 'string') strs.push(v[v.length - 1]); else v.forEach((x) => walkS(x, p)); } else if (v && typeof v === 'object') for (const k of Object.keys(v)) walkS(v[k], k); };
  for (const r of rows) walkS(r, '');
  L(`  LIT (the lit probe's output, ${rows.length} births): desc strings it keeps (strataHits: hits only) ${strs.length}`);
  T2.forEach(([sym, , re]) => { const n = strs.filter((s) => re.test(s)).length; if (n) L(`    ${sym}: ${n}`); });
  // by act: the act's hidden power and each read's kept desc strings (reads[read][engine].strataHits: [path, names, mask, text])
  const acts = []; for (const r of rows) for (const a of (Array.isArray(r.seat) ? r.seat : [])) for (const [read, byEng] of Object.entries(a.reads || {})) for (const [eng, v] of Object.entries(byEng || {})) for (const h of (v && Array.isArray(v.strataHits) ? v.strataHits : [])) if (/desc$/.test(String(h[0]))) acts.push({ seed: r.seed, scen: a.scen, hidden: a.hiddenPower, read, eng, text: String(h[h.length - 1]) });
  L(`    by act (seat acts' reads): ${acts.length} kept desc strings`);
  T2.forEach(([sym, , re]) => { const xs = acts.filter((x) => re.test(x.text)); if (xs.length) L(`    ${sym}: ${xs.length}; hidden powers ${J([...new Set(xs.map((x) => x.hidden))])}; e.g. ${J([xs[0].seed, xs[0].scen, xs[0].read, xs[0].eng, (xs[0].text.match(re) || [''])[0]])}`); });
  const gr = acts.filter((x) => x.text.includes('They and the religious authorities both keep people in line.'));
  L(`    GR-line (a STANDING, not a base) in them: ${gr.length}; where the act hides "Religious Authorities": ${gr.filter((x) => x.hidden === 'Religious Authorities').length}; places ${J([...new Set(gr.map((x) => x.seed))])}`);
  const reeve = acts.filter((x) => /under noble oversight/.test(x.text)); L(`    the reeve's "under noble oversight" in them: ${reeve.length}`);
}

// ---------------- Q4
L('\n== Q4 the tension\'s masked party ==');
for (const t of towns) { if (!t.recH.length) continue; const ts = t.x.tens.map((x, i) => [i, x.type, x.f]).filter(([, , f]) => f && f.some((n) => t.recH.includes(n))); if (ts.length) L(`  ${t.seed}: stamped ${J(t.recH)}; record tensions naming it ${J(ts)}`); }
const q4 = {}; for (const t of towns) for (const [k, p] of Object.entries(t.pages)) { const [read, , eng] = k.split('|'); const key = `${read}|${eng}|${p.hide ? 'hiding' : 'nothingHidden'}`; const r = q4[key] || (q4[key] = { pages: 0, tmPages: 0, tm: 0, maskPages: 0, paths: {} }); r.pages += 1; if (p.xtm) { r.tmPages += 1; r.tm += p.xtm; } const mp = p.xmask || {}; if (Object.keys(mp).length) { r.maskPages += 1; for (const [pa, n] of Object.entries(mp)) r.paths[pa] = (r.paths[pa] || 0) + n; } }
for (const k of Object.keys(q4).sort()) L(`  ${k.padEnd(26)} ${J(q4[k])}`);
