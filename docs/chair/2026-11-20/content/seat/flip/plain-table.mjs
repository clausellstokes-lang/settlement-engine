#!/usr/bin/env node
/**
 * docs/chair/2026-11-20/content/seat/flip/plain-table.mjs — FLIP-CENSUS (A), THE OWNER'S PLAIN TABLE (builder BFL,
 * SEAT-7's lane, 2026-11-20; brief `../briefs/FLIP-CENSUS.md`). A MEASURE ONLY: it changes nothing under src/ or tests/
 * of any checkout. Fortune OFF throughout: every figure is under today's standing.
 *
 * What it measures: on the VISITOR pool (`../u4/measure-lit.mjs :: visitorJob`, seeds `visitor-<size>-0..99`, 600
 * places), every place born with `_seatLawVersion: 2` forced AFTER `birthConfig` (as measure-lit forces it), in two trees:
 *   D  = the contest rule as it stands today (the dial dark): a tree with `SEAT_CONTEST_LIT = false`;
 *   L1 = the contest rule as designed (`SEAT_CONTEST_LIT = true`, `SEAT_CIRCUMSTANCE_TUNING` untouched, every factor 1).
 *
 * One command:
 *   node plain-table.mjs all <D tree> <L1 tree> <work dir>
 *     1. THE INSTRUMENT: `../u4/measure-lit.mjs birth . <arm> '{"_seatLawVersion":2}' visitor <work>/<arm>.jsonl`, run
 *        in each tree (cwd = the tree, as measure-lit.sh runs it), one arm after the other.
 *     2. THE CALIBRATION (it can refute this run): the two arms' aggregates and their pairing, by measure-lit's own
 *        `aggregate` and `pairArms` (copied below verbatim), must EQUAL `../u4/measure-lit.json` pools.visitor
 *        `seat-D`, `seat-L1` and `seat:D->L1`. On a FAIL: exit 1, the calibration alone written to plain-table.{md,json}.
 *     3. THE PER-PLACE DUMP: `node plain-table.mjs detail <tree> <out.jsonl>` in each tree (cwd = the tree): every place
 *        re-born exactly as the instrument's visitorJob births it (the hash of the whole born record must equal the
 *        instrument's for every place, or the run stops), then read through the page's own readers:
 *        `dossier/powerStrata.js :: derivePowerStrata` (the Power tab's "The Seat and Its Contenders" list), the chip and
 *        heading of `components/new/tabs/power/PowerStrata.jsx` (`ARCHETYPE_LABEL`, `rulerRisk`, `seatListTitle`, read
 *        out of the component's own text, never retyped), and `rulingPowerCoup.js :: coupRiskLabel` (the four-word risk
 *        ladder the "Rule and succession" section and the desk prose print).
 *     4. THE REPORT: plain-table.{md,json} beside this script.
 *   node plain-table.mjs report <work dir>     steps 2 to 4 again from the rows an earlier `all` left in <work dir>.
 * Exit: 0 done, 1 the calibration failed, 2 a failure.
 */
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const INSTRUMENT = resolve(HERE, '../u4/measure-lit.mjs');
const MEASURED = resolve(HERE, '../u4/measure-lit.json');
const FORCE = { _seatLawVersion: 2 };
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const LADDER = ['Stable', 'Holding', 'Contested', 'Critical. The seat could fall'];
const fail = (msg) => { console.error(`plain-table: ${msg}`); process.exit(2); };
const bump = (m, k, by = 1) => { m[k] = (m[k] || 0) + by; };

// ── measure-lit.mjs's own readers, copied verbatim (the calibration compares like with like) ──────────────────────
const ladderKey = (label) => (String(label).startsWith('Critical') ? 'Critical' : String(label));
const isContested = (risk) => risk === 'Contested' || String(risk).startsWith('Critical');
const pct = (n, d) => (d ? `${Math.round((1000 * n) / d) / 10}` : '-');
function aggregate(rows) {
  const ok = rows.filter((r) => !r.error);
  const kinds = { present: {}, contends: {}, none: 0 };
  const ladder = {}; const crisisProtected = {}; const markers = {}; const circumstances = {};
  const routes = {}; const threats = {}; let rolledPriorities = 0;
  for (const r of ok) {
    for (const k of r.present) bump(kinds.present, k);
    for (const k of new Set(r.top)) bump(kinds.contends, String(k));
    if (!r.top.length) kinds.none += 1;
    const state = r.calm ? 'calm' : 'crisis';
    bump(((ladder[r.size] ||= {})[state] ||= {}), ladderKey(r.risk));
    bump(markers, r.cfg);
    bump(routes, String(r.route));
    bump(threats, String(r.threat));
    if (r.rp) rolledPriorities += 1;
    for (const c of r.held) bump(circumstances, c);
    if (!r.held.length) bump(circumstances, '(none)');
  }
  for (const size of SIZES) {
    const crisis = ok.filter((r) => r.size === size && !r.calm);
    const n = crisis.filter((r) => r.protected).length;
    crisisProtected[size] = { n, d: crisis.length, pct: pct(n, crisis.length) };
  }
  return { places: rows.length, errors: rows.filter((r) => r.error).map((r) => ({ seed: r.seed, error: r.error })), kinds, ladder, crisisProtected, markers, circumstances, routes, threats, rolledPriorities };
}
function pairArms(a, b) {
  const byKey = new Map(a.filter((r) => !r.error).map((r) => [`${r.pool}|${r.seed}`, r]));
  const out = { paired: 0, fieldOrRiskMoved: 0, topKindsMoved: 0, enter: {}, leave: {}, calmContestedOn: [], calmContestedOff: [] };
  for (const r of b) {
    const o = byKey.get(`${r.pool}|${r.seed}`);
    if (!o || r.error) continue;
    out.paired += 1;
    if (o.field !== r.field || o.risk !== r.risk) out.fieldOrRiskMoved += 1;
    const A = new Set(o.top.map(String)); const B = new Set(r.top.map(String));
    let moved = false;
    for (const k of B) if (!A.has(k)) { bump(out.enter, k); moved = true; }
    for (const k of A) if (!B.has(k)) { bump(out.leave, k); moved = true; }
    if (moved) out.topKindsMoved += 1;
    if (r.calm && o.calm) {
      if (isContested(r.risk) && !isContested(o.risk)) out.calmContestedOn.push(`${r.seed}`);
      if (!isContested(r.risk) && isContested(o.risk)) out.calmContestedOff.push(`${r.seed}`);
    }
  }
  return out;
}
/** Key-order-free JSON, so the comparison reads values, never insertion order. */
const canon = (v) => (Array.isArray(v) ? v.map(canon) : v && typeof v === 'object'
  ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v);
const same = (a, b) => JSON.stringify(canon(a)) === JSON.stringify(canon(b));

// ── detail: one tree, every visitor place, read through the page's readers ─────────────────────────────────────────
async function detail(treeArg, outPath) {
  const T = resolve(treeArg);
  const imp = (p) => import(join(T, p));
  const { generateSettlementPipeline } = await imp('src/generators/generateSettlementPipeline.js');
  const { birthConfig, loadGenerationLawPayloads } = await imp('src/domain/density/densityCreateBoundary.js');
  const { DEFAULT_CONFIG } = await imp('src/store/configSlice.js');
  const { coupContenders, coupRiskLabel } = await imp('src/domain/rulingPowerCoup.js');
  const { governingFactionOf, nameOf } = await imp('src/domain/rulingPower.js');
  const { contestKindOf } = await imp('src/domain/seat/seatTable.js');
  const { factionArchetype } = await imp('src/domain/factionArchetypes.js');
  const { derivePowerStrata } = await imp('src/domain/dossier/powerStrata.js');
  const { SEAT_CONTEST_LIT } = await imp('src/domain/seat/seatCircumstances.js');
  const { NEW_SETTLEMENT_SEAT_LAW_VERSION } = await imp('src/domain/seat/seatLaw.js');
  const { createCustomContentSlice } = await imp('src/store/customContentSlice.js');
  const { settlementContentRuntimeOptions } = await imp('src/store/settlementContentRuntime.js');
  const { eligibleCustomContent } = await imp('src/domain/customContentSchema.js');
  const { contentRuntimeFromCampaignBinding } = await imp('src/domain/content/contentEnvironment.js');
  // The page's own words: read out of PowerStrata.jsx's text (module-private there), never retyped.
  const jsx = readFileSync(join(T, 'src/components/new/tabs/power/PowerStrata.jsx'), 'utf8');
  const grab = (re, what) => { const m = re.exec(jsx); if (!m) fail(`PowerStrata.jsx: ${what} not found`); return m[0]; };
  const pageSrc = [
    grab(/const ARCHETYPE_LABEL = \{[\s\S]*?\n\};/, 'ARCHETYPE_LABEL'),
    grab(/function rulerRisk\(p\) \{[\s\S]*?\n\}/, 'rulerRisk'),
    grab(/function seatListTitle\(powers\) \{[\s\S]*?\n\}/, 'seatListTitle'),
  ].join('\n');
  const page = new Function(`${pageSrc}\nreturn { ARCHETYPE_LABEL, rulerRisk, seatListTitle };`)();
  await loadGenerationLawPayloads();
  // measure-lit.mjs :: visitorJob, verbatim (the hash check below proves the birth is the instrument's).
  const visitorJob = (size, i) => {
    const config = {
      ...DEFAULT_CONFIG, settType: size,
      _institutionToggles: {}, _categoryToggles: {}, _goodsToggles: {}, _servicesToggles: {},
      _randomizePriorities: true,
    };
    let st;
    const slice = createCustomContentSlice(() => {}, () => st);
    st = { ...slice, activeCampaignId: null, campaigns: [], config: { ...DEFAULT_CONFIG, settType: size }, configExplicitFields: {} };
    const runtime = settlementContentRuntimeOptions(st, contentRuntimeFromCampaignBinding, eligibleCustomContent);
    return { size, preset: null, seed: `visitor-${size}-${i}`, config, options: runtime };
  };
  const lines = [JSON.stringify({ meta: { tree: T, force: FORCE, lit: SEAT_CONTEST_LIT, newSettlementLaw: NEW_SETTLEMENT_SEAT_LAW_VERSION } })];
  for (const size of SIZES) {
    for (let i = 0; i < 100; i += 1) {
      const job = visitorJob(size, i);
      const rec = { seed: job.seed, size };
      try {
        const t = generateSettlementPipeline({ ...birthConfig(job.config), ...FORCE }, null, { seed: job.seed, ...job.options });
        rec.hash = createHash('sha256').update(JSON.stringify(t)).digest('hex').slice(0, 16);
        rec.calm = !t.stress;
        const gov = governingFactionOf(t);
        rec.seat = gov ? nameOf(gov) : null;
        const rows = (t.powerStructure?.factions || []).filter((f) => f && f !== gov);
        rec.rows = Object.fromEntries(rows.map((f) => [nameOf(f), {
          contestKind: contestKindOf(f), statedKind: factionArchetype(f), hidden: f.hidden === true,
          category: f.category ?? null, power: f.power ?? null,
        }]));
        const c = coupContenders(t);
        rec.challengers = c.challengers.map((x) => ({ name: x.name, kind: contestKindOf(rows.find((f) => nameOf(f) === x.name) ?? x.name), shown: x.archetype, weight: x.weight }));
        rec.risk = coupRiskLabel(c);
        const { powers } = derivePowerStrata(t);
        rec.page = [page.seatListTitle(powers), ...powers.map((p) => {
          const risk = p.role === 'ruler' ? page.rulerRisk(p) : null;
          return [p.role === 'ruler' ? 'Ruler' : 'Contender', p.name, page.ARCHETYPE_LABEL[p.archetype] || 'Other', p.powerLabel || null, risk ? risk.label : null]
            .filter((x) => x !== null && x !== '').join(' · ');
        }), `(risk word: ${rec.risk})`];
      } catch (e) { rec.error = String(e?.stack || e).split('\n').slice(0, 3).join(' | '); }
      lines.push(JSON.stringify(rec));
    }
  }
  writeFileSync(outPath, `${lines.join('\n')}\n`);
  console.log(`detail ${T}: ${lines.length - 1} places, lit ${SEAT_CONTEST_LIT} -> ${outPath}`);
}

// ── all ─────────────────────────────────────────────────────────────────────────────────────────────────────────────
const run = (cwd, args, log) => new Promise((res, rej) => {
  const p = spawn(process.execPath, args, { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
  let out = '';
  p.stdout.on('data', (d) => { out += d; });
  p.stderr.on('data', (d) => { out += d; });
  p.on('close', (code) => { writeFileSync(log, out); if (code === 0) res(out.trim()); else rej(new Error(`${args.join(' ')} (cwd ${cwd}) exited ${code}; see ${log}`)); });
});
const readJsonl = (path) => {
  const [head, ...rows] = readFileSync(path, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  return { meta: head.meta, rows };
};

async function all(dTree, lTree, work, reportOnly = false) {
  const W = resolve(work);
  mkdirSync(W, { recursive: true });
  const t0 = Date.now();
  // 1. the instrument (with `report`, the rows already in <work dir> are re-read, nothing is born)
  const force = JSON.stringify(FORCE);
  // one process at a time: the run shares the box with the census's whole-suite run (no load spike to time its tests out)
  const receipts = reportOnly ? ['seat-D', 'seat-L1'].map((a) => readFileSync(join(W, `${a}.log`), 'utf8').trim()) : [
    await run(resolve(dTree), [INSTRUMENT, 'birth', '.', 'seat-D', force, 'visitor', join(W, 'seat-D.jsonl')], join(W, 'seat-D.log')),
    await run(resolve(lTree), [INSTRUMENT, 'birth', '.', 'seat-L1', force, 'visitor', join(W, 'seat-L1.jsonl')], join(W, 'seat-L1.log')),
  ];
  const iD = readJsonl(join(W, 'seat-D.jsonl')); const iL = readJsonl(join(W, 'seat-L1.jsonl'));
  if (iD.meta.lit !== false || iL.meta.lit !== true) fail(`the trees' dials: D lit ${iD.meta.lit}, L1 lit ${iL.meta.lit}`);
  // 2. the calibration
  const measured = JSON.parse(readFileSync(MEASURED, 'utf8'));
  const mv = measured.pools.visitor;
  const aD = aggregate(iD.rows); const aL = aggregate(iL.rows); const pr = pairArms(iD.rows, iL.rows);
  const pick = (a) => ({ places: a.places, errors: a.errors.length, kinds: a.kinds, ladder: a.ladder, crisisProtected: a.crisisProtected, circumstances: a.circumstances, markers: a.markers, routes: a.routes, threats: a.threats, rolledPriorities: a.rolledPriorities });
  const checks = [
    ['seat-D aggregate (contender table, risk ladder, protection, circumstances, markers, roads, threats)', same(pick(aD), pick(mv['seat-D']))],
    ['seat-L1 aggregate (the same readings)', same(pick(aL), pick(mv['seat-L1']))],
    ['D -> L1 pairing (field or risk moved, top-three kinds moved, enter, leave, calm turning)', same(pr, mv['seat:D->L1'])],
  ];
  const calibration = {
    pass: checks.every(([, ok]) => ok),
    checks: checks.map(([what, ok]) => ({ what, equal: ok })),
    measuredHere: { fieldOrRiskMoved: pr.fieldOrRiskMoved, topKindsMoved: pr.topKindsMoved, enter: pr.enter, leave: pr.leave, calmContestedOn: pr.calmContestedOn.length, calmContestedOff: pr.calmContestedOff.length },
    measureLit: (({ fieldOrRiskMoved, topKindsMoved, enter, leave, calmContestedOn, calmContestedOff }) => ({ fieldOrRiskMoved, topKindsMoved, enter, leave, calmContestedOn: calmContestedOn.length, calmContestedOff: calmContestedOff.length }))(mv['seat:D->L1']),
    measureLitAt: measured.meta.seatSha,
  };
  console.log(`calibration: ${calibration.pass ? 'PASSES' : 'FAILS'} ${JSON.stringify(calibration.checks)}`);
  if (!calibration.pass) {
    writeFileSync(join(HERE, 'plain-table.json'), `${JSON.stringify({ calibration, receipts }, null, 2)}\n`);
    writeFileSync(join(HERE, 'plain-table.md'), `# The owner's plain table: CALIBRATION FAILED, nothing measured\n\n\`\`\`\n${JSON.stringify(calibration, null, 2)}\n\`\`\`\n`);
    process.exit(1);
  }
  // 3. the per-place dump
  const self = fileURLToPath(import.meta.url);
  if (!reportOnly) {
    await run(resolve(dTree), [self, 'detail', '.', join(W, 'detail-D.jsonl')], join(W, 'detail-D.log'));
    await run(resolve(lTree), [self, 'detail', '.', join(W, 'detail-L1.jsonl')], join(W, 'detail-L1.log'));
  }
  const dD = readJsonl(join(W, 'detail-D.jsonl')); const dL = readJsonl(join(W, 'detail-L1.jsonl'));
  // rows dumped before the risk word's bracket form read "Coup risk: <word>" on their last line: the same word
  for (const r of [...dD.rows, ...dL.rows]) if (r.page) r.page = r.page.map((x) => x.replace(/^Coup risk: (.*)$/, '(risk word: $1)'));
  for (const [inst, det, arm] of [[iD, dD, 'D'], [iL, dL, 'L1']]) {
    const h = new Map(inst.rows.map((r) => [r.seed, r.hash]));
    const off = det.rows.filter((r) => r.error || h.get(r.seed) !== r.hash);
    if (off.length || det.rows.length !== inst.rows.length) fail(`arm ${arm}: ${off.length} places whose re-birth is not the instrument's (${off.slice(0, 3).map((r) => r.seed).join(', ')})`);
  }
  // 4. the report
  report(dD, dL, calibration, receipts, reportOnly ? `re-made by \`report\` from the rows of an earlier \`all\`` : `${Math.round((Date.now() - t0) / 1000)} s`);
}

// ── report ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const SHORT = { 'Critical. The seat could fall': 'Critical' };
const word = (r) => SHORT[r] || r;
function report(dD, dL, calibration, receipts, seconds) {
  const L = new Map(dL.rows.map((r) => [r.seed, r]));
  const bySize = Object.fromEntries(SIZES.map((s) => [s, {
    places: 0, listChanged: 0, membershipChanged: 0, riskChanged: 0, topKindsChanged: 0, pageChanged: 0, craftWordOnly: 0, enter: {}, leave: {}, matrix: {},
    calmTurnedContested: 0, calmStoppedContested: 0,
  }]));
  const changed = [];
  const leaverRows = { criminal: { hidden: 0, criminalCategory: 0, statedKinds: {} }, craft: { statedKinds: {} } };
  for (const a of dD.rows) {
    const b = L.get(a.seed);
    const z = bySize[a.size];
    z.places += 1;
    const namesA = a.challengers.map((c) => c.name); const namesB = b.challengers.map((c) => c.name);
    const listChanged = namesA.join('\u0000') !== namesB.join('\u0000');
    const riskChanged = a.risk !== b.risk;
    const enter = b.challengers.filter((c) => !namesA.includes(c.name));
    const leave = a.challengers.filter((c) => !namesB.includes(c.name));
    for (const c of enter) bump(z.enter, c.kind);
    for (const c of leave) {
      bump(z.leave, c.kind);
      const row = a.rows[c.name];
      if (c.kind === 'criminal') { if (row?.hidden) leaverRows.criminal.hidden += 1; if (String(row?.category).toLowerCase() === 'criminal') leaverRows.criminal.criminalCategory += 1; bump(leaverRows.criminal.statedKinds, row?.statedKind); }
      if (c.kind === 'craft') bump(leaverRows.craft.statedKinds, row?.statedKind);
    }
    const kA = new Set(a.challengers.map((c) => c.kind)); const kB = new Set(b.challengers.map((c) => c.kind));
    const kindsChanged = [...kA].some((k) => !kB.has(k)) || [...kB].some((k) => !kA.has(k));
    if (listChanged) z.listChanged += 1;
    if (enter.length + leave.length) z.membershipChanged += 1;
    if (riskChanged) { z.riskChanged += 1; bump(z.matrix, `${word(a.risk)} → ${word(b.risk)}`); }
    if (kindsChanged) z.topKindsChanged += 1;
    const pageChanged = a.page.join('\n') !== b.page.join('\n');
    if (pageChanged) z.pageChanged += 1;
    // the page's only change is a craft guild's kind word, "Merchant" -> "Craft" (the same powers, the same order, the same risk)
    const asMerchant = (p) => p.map((x) => x.replace(/ · Craft · /g, ' · Merchant · ')).join('\n');
    if (pageChanged && asMerchant(a.page) === asMerchant(b.page)) z.craftWordOnly += 1;
    if (a.calm && b.calm && isContested(b.risk) && !isContested(a.risk)) z.calmTurnedContested += 1;
    if (a.calm && b.calm && !isContested(b.risk) && isContested(a.risk)) z.calmStoppedContested += 1;
    if (listChanged || riskChanged || pageChanged) changed.push({ a, b, listChanged, riskChanged, pageChanged, enter, leave });
  }
  // the six: one a size, where something changed; risk-and-list first, then risk, then list, then the page alone; the
  // lowest seed number within the best class (deterministic).
  const idx = (seed) => Number(seed.split('-').pop());
  const moved = (c) => c.enter.length + c.leave.length > 0;
  const rank = (c) => (c.riskChanged && moved(c) ? 0 : c.riskChanged ? 1 : moved(c) ? 2 : c.listChanged ? 3 : 4);
  const six = SIZES.map((size) => changed.filter((c) => c.a.size === size)
    .sort((x, y) => rank(x) - rank(y) || idx(x.a.seed) - idx(y.a.seed))[0] || { size, none: true });
  const total = (k) => SIZES.reduce((n, s) => n + bySize[s][k], 0);
  const sumMap = (k) => { const m = {}; for (const s of SIZES) for (const [x, n] of Object.entries(bySize[s][k])) bump(m, x, n); return m; };
  const fmtKinds = (m) => (Object.keys(m).length ? Object.entries(m).sort((x, y) => y[1] - x[1] || (x[0] < y[0] ? -1 : 1)).map(([k, n]) => `${k} ${n}`).join(', ') : 'none');
  const json = {
    meta: { script: 'docs/chair/2026-11-20/content/seat/flip/plain-table.mjs', writtenAt: new Date().toISOString(), seconds, standing: 'fortune OFF: under today\'s standing', pool: 'visitor (measure-lit.mjs :: visitorJob), seeds visitor-<size>-0..99, 600 places', force: FORCE, D: dD.meta, L1: dL.meta, instrument: receipts },
    calibration, bySize, totals: { places: total('places'), listChanged: total('listChanged'), membershipChanged: total('membershipChanged'), riskChanged: total('riskChanged'), topKindsChanged: total('topKindsChanged'), pageChanged: total('pageChanged'), craftWordOnly: total('craftWordOnly'), calmTurnedContested: total('calmTurnedContested'), calmStoppedContested: total('calmStoppedContested'), enter: sumMap('enter'), leave: sumMap('leave'), matrix: sumMap('matrix') },
    leavers: leaverRows,
    six: six.map((c) => (c.none ? c : { seed: c.a.seed, size: c.a.size, calm: c.a.calm, before: c.a.page, after: c.b.page, enter: c.enter, leave: c.leave })),
    changed: changed.map((c) => ({ seed: c.a.seed, list: c.listChanged, risk: c.riskChanged ? `${word(c.a.risk)} → ${word(c.b.risk)}` : null, page: c.pageChanged, enter: c.enter.map((x) => `${x.name} (${x.kind})`), leave: c.leave.map((x) => `${x.name} (${x.kind})`) })),
  };
  writeFileSync(join(HERE, 'plain-table.json'), `${JSON.stringify(json, null, 2)}\n`);
  writeFileSync(join(HERE, 'plain-table.md'), renderMd(json, fmtKinds));
  console.log(`report: ${changed.length} places changed in some way; written plain-table.{md,json} (${seconds})`);
}

function renderMd(j, fmtKinds) {
  const s = j.bySize; const t = j.totals;
  const row = (label, f) => `| ${label} | ${SIZES.map((z) => f(s[z])).join(' | ')} | ${f(t, true)} |`;
  const matrixKeys = [...new Set(SIZES.flatMap((z) => Object.keys(s[z].matrix)))].sort();
  const out = [];
  out.push('# What changes when the contest rule is switched to the rule as designed', '');
  out.push('*For the owner. A measure only; nothing in the product moved. Fortune is off, so every figure here is **under today\'s standing**.*', '');
  out.push(`We took the same 600 places a visitor gets (100 of each size, the same seeds), born under the seat law, and read each place's seat twice: once under **today's contest rule** and once under **the contest rule as designed**.¹ Nothing else differs between the two readings.`, '');
  out.push('## The short answer', '');
  out.push(`- **Calm places that start or stop reading contested: ${t.calmTurnedContested} and ${t.calmStoppedContested}.** Your headline does not move.`);
  out.push(`- **${t.listChanged} of 600 places** list their challengers differently (in ${t.membershipChanged} a challenger leaves or comes in; in the rest the same powers change order); **${t.riskChanged}** show a different risk word; **${t.pageChanged}** print anything different in the seat's list on the Power tab, and in ${t.craftWordOnly} of those the only difference is that a craft guild the page called "Merchant" is now called "Craft".`);
  out.push(`- Who leaves the challengers: ${fmtKinds(t.leave)}. Who comes in to take their places: ${fmtKinds(t.enter)}.`, '');
  out.push('## By size', '');
  out.push(`| | ${SIZES.join(' | ')} | all |`, `|---|${SIZES.map(() => '---').join('|')}|---|`);
  out.push(row('places', (z) => z.places));
  out.push(row('(1) the list of challengers changes (who, or their order)', (z) => z.listChanged));
  out.push(row('… of which a challenger leaves or comes in', (z) => z.membershipChanged));
  out.push(row('(2) the risk word changes', (z) => z.riskChanged));
  out.push(row('the kinds among the challengers change', (z) => z.topKindsChanged));
  out.push(row('the Power tab\'s seat list prints differently', (z) => z.pageChanged));
  out.push(row('… of which only a craft guild\'s kind word ("Merchant" → "Craft")', (z) => z.craftWordOnly));
  out.push(row('calm places turning contested · stopping', (z) => `${z.calmTurnedContested} · ${z.calmStoppedContested}`), '');
  out.push('### (1) Who leaves the challengers, and who comes in, by kind', '');
  out.push('Counted by power: a power that leaves the top three, and the power that takes its place (a kind already among the challengers can come in again).', '');
  out.push(`| size | leave | enter |`, '|---|---|---|');
  for (const z of SIZES) out.push(`| ${z} | ${fmtKinds(s[z].leave)} | ${fmtKinds(s[z].enter)} |`);
  out.push(`| **all** | ${fmtKinds(t.leave)} | ${fmtKinds(t.enter)} |`, '');
  out.push('### (2) The risk word: from which to which', '');
  out.push('The risk word is the seat\'s four-step ladder (Stable · Holding · Contested · Critical. The seat could fall), the engine\'s one reading of it (`rulingPowerCoup.js :: coupRiskLabel`), which the Power desk reading (`powerDeskRead.js`) and the printed campaign document (`printProse.js`) carry. The Power tab\'s own chip on the ruler is coarser (Uncontested · Contested · Critical) and is shown in the six places below.', '');
  if (!matrixKeys.length) out.push('No place changes its risk word.', '');
  else {
    out.push(`| from → to | ${SIZES.join(' | ')} | all |`, `|---|${SIZES.map(() => '---').join('|')}|---|`);
    for (const k of matrixKeys) out.push(`| ${k} | ${SIZES.map((z) => s[z].matrix[k] || 0).join(' | ')} | ${t.matrix[k] || 0} |`);
    out.push('');
  }
  out.push('### (3) Six places, one of each size, before and after, as the Power tab prints them', '');
  out.push('Each block is the Power tab\'s "Seat and Its Contenders" list as it prints it: the heading, then one line a power (role · name · kind · strength · and, on the ruler, the risk chip), read through `dossier/powerStrata.js :: derivePowerStrata` with the heading, the kind word and the chip taken from `PowerStrata.jsx` itself. The chip shows only where the desk prose does not already speak the risk. The last line, in brackets, is the four-step risk word (`coupRiskLabel`), not a page line. Chosen where something changed: a changed risk word with a challenger leaving or coming in first, then a changed risk word, then a challenger leaving or coming in, then a change of order, then the page alone; the lowest seed within that.', '');
  for (const c of j.six) {
    if (c.none) { out.push(`**${c.size}**: no place of this size changes at all.`, ''); continue; }
    out.push(`**${c.size}, \`${c.seed}\`** (${c.calm ? 'calm' : 'born in a crisis'}). Leaves: ${c.leave.length ? c.leave.map((x) => `${x.name} (${x.kind})`).join(', ') : 'nobody'}. Comes in: ${c.enter.length ? c.enter.map((x) => `${x.name} (${x.kind})`).join(', ') : 'nobody'}.`, '');
    out.push('| today\'s contest rule | the contest rule as designed |', '|---|---|');
    const n = Math.max(c.before.length, c.after.length);
    for (let i = 0; i < n; i += 1) out.push(`| ${c.before[i] ?? ''} | ${c.after[i] ?? ''} |`);
    out.push('');
  }
  out.push('## What becomes of a craft guild', '');
  out.push(`Today a Craft Guild is read for the contest by its category, and the generator files the Craft Guilds under \`economy\`, which today's reader folds to **merchant** (\`factionArchetypes.js :: factionArchetype\`, \`CATEGORY_MAP.economy\`). So today a craft guild contends as a merchant power, and the Power tab even labels it "Merchant". Under the rule as designed the contest reads a power's own kind (\`seat/seatTable.js :: contestKindOf\` → \`ownKindOf\`, which reads craft off the name: \`/craft|artisan/\`), so the guild is a **craft** power, labelled "Craft". A craft power presses its claim less hard than a merchant power: the push each kind brings to a coup is \`rulingPowerCoup.js :: COUP_COERCION\`, merchant 0.95 and craft 0.85, so the guild's weight in the contest falls by about a tenth with the same strength behind it (every circumstance factor stays 1). Where a craft guild was third and a rival sat within that tenth, the rival now passes it and the guild drops out of the top three. Of the craft powers that leave the challengers here, today's reader had called them: ${fmtKinds(j.leavers.craft.statedKinds)}.`, '');
  out.push('## What becomes of a criminal power', '');
  out.push(`It leaves the open field. Under the rule as designed, any power that is criminal by category or **hidden** reads "criminal" for the contest first, whatever its name says (\`seat/seatTable.js :: contestKindOf\`, the veil step \`isVeiledRow\`), and the contest never admits a criminal power (\`rulingPowerCoup.js :: coupContenders\`, "Criminal factions never vie for power openly — the capture ladder is their path"). Today a power criminal by category is already kept out, but a hidden power that is not criminal by category still contends under the kind it shows. Of the ${Object.values(j.leavers.criminal.statedKinds).reduce((x, y) => x + y, 0)} such powers that leave the challengers here, ${j.leavers.criminal.hidden} are hidden and ${j.leavers.criminal.criminalCategory} are criminal by category; today's reader had called them: ${fmtKinds(j.leavers.criminal.statedKinds)}. Their road to the seat is the one the game already gives them: **capture**, the slow climb of a faction its corrupt members pull down (\`worldPulse/factionCapture.js :: advanceFactionCapture\`, none → adversarial → equilibrium → corrupted → capture), and **the DM's own event**, "change ruling power" in the Event Composer, which may hand the seat to any power but the one holding it, hidden ones included (\`events/affordanceManifest.js :: rulingPowerTargets\`, \`CHANGE_RULING_POWER\`; \`events/mutateWorld.js :: changeRulingPower\`). The game never stages it as a coup on its own.`, '');
  out.push('---', '');
  out.push(`¹ "Today's contest rule" is arm **D**: the dial \`seat/seatCircumstances.js :: SEAT_CONTEST_LIT\` dark, as committed. "The contest rule as designed" is arm **L1**: the same dial lit, \`SEAT_CIRCUMSTANCE_TUNING\` untouched (every factor 1); the flipped scratch copy (both dials of the flip) was the L1 tree. Every place was born \`{ ...birthConfig(config), _seatLawVersion: 2 }\` (the law forced after \`birthConfig\`, as \`../u4/measure-lit.mjs\` forces it), on the visitor pool (\`measure-lit.mjs :: visitorJob\`, \`visitor-<size>-0..99\`), fortune off.`, '');
  out.push(`**Calibration: ${j.calibration.pass ? 'PASSES' : 'FAILS'}.** This run's D and L1 aggregates on this pool (the contender table, the risk ladder by size calm and crisis, protection, circumstances, markers, roads, threats) and their pairing EQUAL \`../u4/measure-lit.json\` (\`pools.visitor\` \`seat-D\`, \`seat-L1\`, \`seat:D->L1\`, measured at \`${j.calibration.measureLitAt}\`): field or risk moved in ${j.calibration.measuredHere.fieldOrRiskMoved} of 600 (measure-lit ${j.calibration.measureLit.fieldOrRiskMoved}); top-three kinds moved in ${j.calibration.measuredHere.topKindsMoved} (${j.calibration.measureLit.topKindsMoved}); leave ${fmtKinds(j.calibration.measuredHere.leave)}; enter ${fmtKinds(j.calibration.measuredHere.enter)}. Every place's re-birth for the page reading hashed equal to the instrument's whole born record (600 of 600, both arms).`, '');
  out.push(`One command: \`node docs/chair/2026-11-20/content/seat/flip/plain-table.mjs all <D tree> <L1 tree> <work dir>\` (each tree a checkout of the cut with \`node_modules\`; the L1 tree carries the flip). Written ${j.meta.writtenAt}, ${j.meta.seconds}. The numbers in full: \`plain-table.json\` (every changed place by seed).`, '');
  return `${out.join('\n')}\n`;
}

// ── main ────────────────────────────────────────────────────────────────────────────────────────────────────────────
const [mode, ...rest] = process.argv.slice(2);
for (const v of ['GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY', 'GIT_PREFIX']) if (process.env[v]) fail(`${v} is set; unset it first`);
if (mode === 'all' && rest.length === 3) await all(...rest);
else if (mode === 'report' && rest.length === 1) await all(null, null, rest[0], true);
else if (mode === 'detail' && rest.length === 2) await detail(...rest);
else fail('usage: plain-table.mjs all <D tree> <L1 tree> <work dir> | report <work dir> | detail <tree> <out.jsonl>');
